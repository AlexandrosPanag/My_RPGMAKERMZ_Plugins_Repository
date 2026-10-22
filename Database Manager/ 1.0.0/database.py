# RPG Maker MZ Database Manager
# Created by Alexandros Panagiotakopoulos
# Version 1.0.0
# Date: 22/10/2026
# Copyright (c) 2026-2027 Alexandros Panagiotakopoulos 
# License: CC BY-NC-SA 4.0 
# https://creativecommons.org/licenses/by-nc-sa/4.0/ 

"""
database.py — RPG Maker MZ Database I/O & Manipulation
"""

import json
import os
import copy
import shutil
from datetime import datetime

from constants import DATABASE_FILES, NULL_PREFIX_CATEGORIES


class DatabaseManager:
    """Manages loading, saving, and manipulating RPG Maker MZ database files."""

    def __init__(self):
        self.data_path: str | None = None
        self.data: dict[str, list | dict] = {}
        self.clipboard: dict | None = None
        self.clipboard_category: str | None = None
        self.modified_categories: set[str] = set()

    # ── Path & Validation ──────────────────────────────────────────────────────

    def set_path(self, path: str) -> bool:
        """Set and validate the project data folder path."""
        if os.path.isdir(path):
            self.data_path = path
            return True
        return False

    def detect_available_files(self) -> list[str]:
        """Return categories whose JSON files exist on disk."""
        available = []
        if not self.data_path:
            return available
        for cat, fname in DATABASE_FILES.items():
            if os.path.isfile(os.path.join(self.data_path, fname)):
                available.append(cat)
        return available

    # ── Loading ────────────────────────────────────────────────────────────────

    def load_all(self) -> dict[str, str]:
        """Load every database file.  Returns {category: status_message}."""
        results: dict[str, str] = {}
        for category, filename in DATABASE_FILES.items():
            filepath = os.path.join(self.data_path, filename)
            if not os.path.isfile(filepath):
                results[category] = "File not found"
                continue
            try:
                with open(filepath, "r", encoding="utf-8") as fh:
                    self.data[category] = json.load(fh)
                results[category] = "OK"
            except json.JSONDecodeError as exc:
                results[category] = f"JSON error: {exc}"
            except OSError as exc:
                results[category] = f"Read error: {exc}"
        return results

    def load_category(self, category: str) -> str:
        """(Re)load a single category from disk."""
        filename = DATABASE_FILES.get(category)
        if not filename:
            return "Unknown category"
        filepath = os.path.join(self.data_path, filename)
        if not os.path.isfile(filepath):
            return "File not found"
        try:
            with open(filepath, "r", encoding="utf-8") as fh:
                self.data[category] = json.load(fh)
            return "OK"
        except Exception as exc:  # noqa: BLE001
            return str(exc)

    # ── Querying ───────────────────────────────────────────────────────────────

    def get_entries(self, category: str) -> list[tuple[int, dict]]:
        """Return [(array_index, entry_dict), …] excluding null slots."""
        raw = self.data.get(category)
        if not isinstance(raw, list):
            return []
        return [
            (i, entry)
            for i, entry in enumerate(raw)
            if entry is not None and isinstance(entry, dict)
        ]

    def get_entry(self, category: str, index: int) -> dict | None:
        """Return the entry at *index*, or ``None``."""
        raw = self.data.get(category)
        if isinstance(raw, list) and 0 <= index < len(raw):
            return raw[index]
        return None

    def entry_count(self, category: str) -> int:
        """Number of non-null entries."""
        return len(self.get_entries(category))

    # ── Editing ────────────────────────────────────────────────────────────────

    def update_entry(self, category: str, index: int, entry: dict) -> None:
        """Overwrite the entry at *index* with *entry*."""
        raw = self.data.get(category)
        if isinstance(raw, list) and 0 <= index < len(raw):
            raw[index] = entry
            self.modified_categories.add(category)

    # ── Adding ─────────────────────────────────────────────────────────────────

    def add_entry(self, category: str) -> int:
        """Append a new default entry.  Returns its array index, or -1."""
        raw = self.data.get(category)
        if not isinstance(raw, list):
            return -1

        next_id = len(raw)  # MZ uses array position as id
        new_entry = self._create_default(category, next_id)
        raw.append(new_entry)
        self.modified_categories.add(category)
        return len(raw) - 1

    def duplicate_entry(self, category: str, index: int) -> int:
        """Duplicate an existing entry at the end. Returns new index."""
        raw = self.data.get(category)
        if not isinstance(raw, list) or index < 0 or index >= len(raw):
            return -1
        entry = raw[index]
        if entry is None:
            return -1

        new_entry = copy.deepcopy(entry)
        new_id = len(raw)
        new_entry["id"] = new_id
        if "name" in new_entry:
            new_entry["name"] = new_entry["name"] + " (Copy)"
        raw.append(new_entry)
        self.modified_categories.add(category)
        return len(raw) - 1

    # ── Deleting ───────────────────────────────────────────────────────────────

    def delete_entry(self, category: str, index: int) -> bool:
        """Null-out an entry and trim trailing nulls."""
        raw = self.data.get(category)
        if not isinstance(raw, list) or index <= 0 or index >= len(raw):
            return False  # never delete index 0 (the null sentinel)
        raw[index] = None
        # Trim trailing nulls (but keep at least [null])
        while len(raw) > 1 and raw[-1] is None:
            raw.pop()
        self.modified_categories.add(category)
        return True

    # ── Reordering ─────────────────────────────────────────────────────────────

    def swap_entries(self, category: str, idx_a: int, idx_b: int) -> bool:
        """Swap two entries and fix up their ``id`` fields."""
        raw = self.data.get(category)
        if not isinstance(raw, list):
            return False
        if not (0 < idx_a < len(raw) and 0 < idx_b < len(raw)):
            return False
        if raw[idx_a] is None or raw[idx_b] is None:
            return False

        raw[idx_a], raw[idx_b] = raw[idx_b], raw[idx_a]

        # Fix ids so they match their new positions
        if isinstance(raw[idx_a], dict) and "id" in raw[idx_a]:
            raw[idx_a]["id"] = idx_a
        if isinstance(raw[idx_b], dict) and "id" in raw[idx_b]:
            raw[idx_b]["id"] = idx_b

        self.modified_categories.add(category)
        return True

    # ── Clipboard operations ───────────────────────────────────────────────────

    def copy_entry(self, category: str, index: int) -> bool:
        """Deep-copy an entry to the internal clipboard."""
        entry = self.get_entry(category, index)
        if entry is not None and isinstance(entry, dict):
            self.clipboard = copy.deepcopy(entry)
            self.clipboard_category = category
            return True
        return False

    def cut_entry(self, category: str, index: int) -> bool:
        """Copy, then delete."""
        if self.copy_entry(category, index):
            return self.delete_entry(category, index)
        return False

    def paste_entry(self, category: str) -> int:
        """Paste the clipboard at the end of *category*.  Returns new index."""
        if self.clipboard is None:
            return -1
        raw = self.data.get(category)
        if not isinstance(raw, list):
            return -1

        new_entry = copy.deepcopy(self.clipboard)
        new_id = len(raw)
        new_entry["id"] = new_id
        raw.append(new_entry)
        self.modified_categories.add(category)
        return len(raw) - 1

    @property
    def has_clipboard(self) -> bool:
        return self.clipboard is not None

    # ── Saving ─────────────────────────────────────────────────────────────────

    def save_category(self, category: str) -> bool:
        """Write a single category back to its JSON file."""
        filename = DATABASE_FILES.get(category)
        if not filename or category not in self.data:
            return False
        filepath = os.path.join(self.data_path, filename)
        try:
            with open(filepath, "w", encoding="utf-8") as fh:
                # RPG Maker MZ uses compact JSON (no extra whitespace)
                json.dump(self.data[category], fh, ensure_ascii=False,
                          separators=(",", ":"))
            return True
        except OSError as exc:
            print(f"[save_category] {category}: {exc}")
            return False

    def save_all(self) -> dict[str, str]:
        """Save every loaded category.  Returns {category: status}."""
        results: dict[str, str] = {}
        for category in list(self.data.keys()):
            ok = self.save_category(category)
            results[category] = "Saved" if ok else "Error"
        self.modified_categories.clear()
        return results

    # ── Backup ─────────────────────────────────────────────────────────────────

    def backup(self) -> str | None:
        """Create a timestamped copy of the data folder.  Returns its path."""
        if not self.data_path:
            return None
        ts = datetime.now().strftime("%Y%m%d_%H%M%S")
        parent = os.path.dirname(self.data_path)
        backup_dir = os.path.join(parent, f"data_backup_{ts}")
        try:
            shutil.copytree(self.data_path, backup_dir)
            return backup_dir
        except OSError as exc:
            print(f"[backup] {exc}")
            return None

    # ── Default entry factories ────────────────────────────────────────────────

    def _create_default(self, category: str, entry_id: int) -> dict:
        """Return a minimal skeleton for a new entry."""
        base = {"id": entry_id, "name": f"(new {category.rstrip('s')} {entry_id})"}

        factories = {
            "Skills":  self._default_skill,
            "Items":   self._default_item,
            "Weapons": self._default_weapon,
            "Armors":  self._default_armor,
            "Actors":  self._default_actor,
            "Classes": self._default_class,
            "Enemies": self._default_enemy,
            "States":  self._default_state,
            "Troops":  self._default_troop,
            "CommonEvents": self._default_common_event,
            "Animations":   self._default_animation,
            "Tilesets":     self._default_tileset,
        }
        factory = factories.get(category)
        if factory:
            base.update(factory(entry_id))
        return base

    @staticmethod
    def _default_skill(eid: int) -> dict:
        return {
            "animationId": -1,
            "damage": {"critical": False, "elementId": 0,
                       "formula": "0", "type": 0, "variance": 20},
            "description": "", "effects": [], "hitType": 0,
            "iconIndex": 0, "message1": "", "message2": "",
            "mpCost": 0, "note": "", "occasion": 0, "repeats": 1,
            "requiredWtypeId1": 0, "requiredWtypeId2": 0,
            "scope": 0, "speed": 0, "stypeId": 1,
            "successRate": 100, "tpCost": 0, "tpGain": 0, "traits": [],
        }

    @staticmethod
    def _default_item(eid: int) -> dict:
        return {
            "animationId": -1, "consumable": True,
            "damage": {"critical": False, "elementId": 0,
                       "formula": "0", "type": 0, "variance": 20},
            "description": "", "effects": [], "hitType": 0,
            "iconIndex": 0, "itypeId": 1, "note": "", "occasion": 0,
            "price": 0, "repeats": 1, "scope": 0, "speed": 0,
            "successRate": 100, "tpGain": 0,
        }

    @staticmethod
    def _default_weapon(eid: int) -> dict:
        return {
            "animationId": -1, "description": "", "etypeId": 1,
            "iconIndex": 0, "note": "",
            "params": [0, 0, 0, 0, 0, 0, 0, 0],
            "price": 0, "traits": [], "wtypeId": 0,
        }

    @staticmethod
    def _default_armor(eid: int) -> dict:
        return {
            "atypeId": 0, "description": "", "etypeId": 2,
            "iconIndex": 0, "note": "",
            "params": [0, 0, 0, 0, 0, 0, 0, 0],
            "price": 0, "traits": [],
        }

    @staticmethod
    def _default_actor(eid: int) -> dict:
        return {
            "battlerName": "", "characterIndex": 0,
            "characterName": "", "classId": 1,
            "equips": [0, 0, 0, 0, 0],
            "faceIndex": 0, "faceName": "",
            "initialLevel": 1, "maxLevel": 99,
            "nickname": "", "note": "", "profile": "", "traits": [],
        }

    @staticmethod
    def _default_class(eid: int) -> dict:
        return {
            "expParams": [30, 20, 30, 30],
            "learnings": [], "note": "",
            "params": [[1] * 99 for _ in range(8)],
            "traits": [],
        }

    @staticmethod
    def _default_enemy(eid: int) -> dict:
        return {
            "battlerName": "", "battlerHue": 0,
            "actions": [{"conditionParam1": 0, "conditionParam2": 0,
                         "conditionType": 0, "rating": 5, "skillId": 1}],
            "dropItems": [
                {"kind": 0, "dataId": 1, "denominator": 1},
                {"kind": 0, "dataId": 1, "denominator": 1},
                {"kind": 0, "dataId": 1, "denominator": 1},
            ],
            "exp": 0, "gold": 0, "note": "",
            "params": [100, 0, 10, 10, 10, 10, 10, 10],
            "traits": [],
        }

    @staticmethod
    def _default_state(eid: int) -> dict:
        return {
            "autoRemovalTiming": 0, "chanceByDamage": 100,
            "iconIndex": 0, "maxTurns": 1,
            "message1": "", "message2": "",
            "message3": "", "message4": "",
            "minTurns": 1, "motion": 0, "note": "",
            "overlay": 0, "priority": 50,
            "releaseByDamage": False, "removeAtBattleEnd": False,
            "removeByDamage": False, "removeByRestriction": False,
            "removeByWalking": False, "restriction": 0,
            "stepsToRemove": 100, "traits": [],
        }

    @staticmethod
    def _default_troop(eid: int) -> dict:
        return {"members": [], "pages": [], "note": ""}

    @staticmethod
    def _default_common_event(eid: int) -> dict:
        return {"list": [], "switchId": 0, "trigger": 0, "note": ""}

    @staticmethod
    def _default_animation(eid: int) -> dict:
        return {
            "displayType": 0, "effectName": "",
            "flashTimings": [], "offsetX": 0, "offsetY": 0,
            "rotation": {"x": 0, "y": 0, "z": 0},
            "soundTimings": [], "speed": 100,
        }

    @staticmethod
    def _default_tileset(eid: int) -> dict:
        return {
            "flags": [], "mode": 1, "note": "",
            "tilesetNames": ["", "", "", "", "", "", "", "", ""],
        }
