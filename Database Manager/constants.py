# RPG Maker MZ Database Manager
# Created by Alexandros Panagiotakopoulos
# Version 1.0.0
# Date: 22/10/2026
# Copyright (c) 2026-2027 Alexandros Panagiotakopoulos 
# License: CC BY-NC-SA 4.0 
# https://creativecommons.org/licenses/by-nc-sa/4.0/ 

"""
constants.py — RPG Maker MZ Database Tool Constants & Stylesheet
"""

# ── Database file mapping ──────────────────────────────────────────────────────
DATABASE_FILES = {
    "Actors":       "Actors.json",
    "Classes":      "Classes.json",
    "Skills":       "Skills.json",
    "Items":        "Items.json",
    "Weapons":      "Weapons.json",
    "Armors":       "Armors.json",
    "Enemies":      "Enemies.json",
    "Troops":       "Troops.json",
    "States":       "States.json",
    "Animations":   "Animations.json",
    "Tilesets":     "Tilesets.json",
    "CommonEvents": "CommonEvents.json",
}

# All of these use null at index 0
NULL_PREFIX_CATEGORIES = list(DATABASE_FILES.keys())

# ── Category sidebar icons ─────────────────────────────────────────────────────
CATEGORY_ICONS = {
    "Actors":       "\U0001F464",   # 👤
    "Classes":      "\u2694\uFE0F", # ⚔️
    "Skills":       "\u2728",       # ✨
    "Items":        "\U0001F9EA",   # 🧪
    "Weapons":      "\U0001F5E1\uFE0F", # 🗡️
    "Armors":       "\U0001F6E1\uFE0F", # 🛡️
    "Enemies":      "\U0001F479",   # 👹
    "Troops":       "\U0001F9B9",   # 🦹
    "States":       "\U0001F4AB",   # 💫
    "Animations":   "\U0001F3AC",   # 🎬
    "Tilesets":     "\U0001F5FA\uFE0F", # 🗺️
    "CommonEvents": "\U0001F4DC",   # 📜
}

# ── Readable field labels ──────────────────────────────────────────────────────
FIELD_LABELS = {
    "id": "ID",
    "name": "Name",
    "description": "Description",
    "note": "Note",
    "iconIndex": "Icon Index",
    "animationId": "Animation ID",
    "mpCost": "MP Cost",
    "tpCost": "TP Cost",
    "tpGain": "TP Gain",
    "stypeId": "Skill Type ID",
    "scope": "Scope",
    "occasion": "Occasion",
    "hitType": "Hit Type",
    "speed": "Speed",
    "repeats": "Repeats",
    "successRate": "Success Rate (%)",
    "requiredWtypeId1": "Req. Weapon Type 1",
    "requiredWtypeId2": "Req. Weapon Type 2",
    "message1": "Message 1",
    "message2": "Message 2",
    "message3": "Message 3 (Actor)",
    "message4": "Message 4 (Enemy)",
    "damage": "Damage",
    "effects": "Effects",
    "traits": "Traits",
    "price": "Price",
    "itypeId": "Item Type ID",
    "consumable": "Consumable",
    "wtypeId": "Weapon Type ID",
    "atypeId": "Armor Type ID",
    "etypeId": "Equip Type ID",
    "params": "Parameters",
    "battlerName": "Battler Image",
    "battlerHue": "Battler Hue",
    "characterName": "Character Image",
    "characterIndex": "Character Index",
    "faceName": "Face Image",
    "faceIndex": "Face Index",
    "classId": "Class ID",
    "initialLevel": "Initial Level",
    "maxLevel": "Max Level",
    "nickname": "Nickname",
    "profile": "Profile",
    "equips": "Initial Equipment",
    "expParams": "EXP Curve",
    "learnings": "Skill Learnings",
    "actions": "Actions",
    "dropItems": "Drop Items",
    "gold": "Gold",
    "exp": "Experience",
    "priority": "Priority",
    "restriction": "Restriction",
    "autoRemovalTiming": "Auto-Removal Timing",
    "minTurns": "Min Turns",
    "maxTurns": "Max Turns",
    "removeAtBattleEnd": "Remove at Battle End",
    "removeByRestriction": "Remove by Restriction",
    "removeByDamage": "Remove by Damage",
    "removeByWalking": "Remove by Walking",
    "stepsToRemove": "Steps to Remove",
    "chanceByDamage": "Chance by Damage (%)",
    "overlay": "Overlay Index",
    "releaseByDamage": "Release by Damage",
    "motion": "SV Motion",
    "battlerOverlayType": "Battler Overlay",
    "meta": "Meta",
    "switchId": "Switch ID",
    "list": "Event Commands",
    "pages": "Pages",
    "members": "Troop Members",
    "tilesetNames": "Tileset Names",
    "mode": "Mode",
    "flags": "Flags",
    "timings": "Timings",
    "flashTimings": "Flash Timings",
    "soundTimings": "Sound Timings",
    "rotation": "Rotation",
    "mirror": "Mirror",
    "displayType": "Display Type",
    "effectName": "Effect Name",
    "speed2x": "Double Speed",
}

# ── Trait constants ────────────────────────────────────────────────────────────
TRAIT_CODES = {
    11: "Element Rate",
    12: "Debuff Rate",
    13: "State Rate",
    14: "State Resist",
    21: "Parameter",
    22: "Ex-Parameter",
    23: "Sp-Parameter",
    31: "Attack Element",
    32: "Attack State",
    33: "Attack Speed",
    34: "Attack Times+",
    35: "Attack Skill",
    41: "Add Skill Type",
    42: "Seal Skill Type",
    43: "Add Skill",
    44: "Seal Skill",
    51: "Equip Weapon Type",
    52: "Equip Armor Type",
    53: "Lock Equip Slot",
    54: "Seal Equip Slot",
    55: "Slot Type",
    61: "Action Times+",
    62: "Special Flag",
    63: "Collapse Effect",
    64: "Party Ability",
}

TRAIT_CODE_LIST = sorted(TRAIT_CODES.items())

# ── Effect constants ───────────────────────────────────────────────────────────
EFFECT_CODES = {
    11: "Recover HP",
    12: "Recover MP",
    13: "Gain TP",
    21: "Add State",
    22: "Remove State",
    31: "Add Buff",
    32: "Add Debuff",
    33: "Remove Buff",
    34: "Remove Debuff",
    41: "Special Effect",
    42: "Grow",
    43: "Learn Skill",
    44: "Common Event",
}

EFFECT_CODE_LIST = sorted(EFFECT_CODES.items())

# ── Name tables ────────────────────────────────────────────────────────────────
PARAM_NAMES  = ["Max HP", "Max MP", "Attack", "Defense",
                "M.Attack", "M.Defense", "Agility", "Luck"]

XPARAM_NAMES = ["Hit Rate", "Evasion Rate", "Critical Rate", "Crit Evasion",
                "Magic Evasion", "Magic Reflection", "Counter Attack",
                "HP Regen", "MP Regen", "TP Regen"]

SPARAM_NAMES = ["Target Rate", "Guard Effect", "Recovery Effect",
                "Pharmacology", "MP Cost Rate", "TP Charge Rate",
                "Physical Damage Rate", "Magical Damage Rate",
                "Floor Damage Rate", "Experience Rate"]

DAMAGE_TYPES   = ["None", "HP Damage", "MP Damage", "HP Recover",
                  "MP Recover", "HP Drain", "MP Drain"]

SCOPE_NAMES    = ["None", "1 Enemy", "All Enemies",
                  "1 Random Enemy", "2 Random Enemies",
                  "3 Random Enemies", "4 Random Enemies",
                  "1 Ally", "All Allies",
                  "1 Ally (Dead)", "All Allies (Dead)", "The User"]

HIT_TYPE_NAMES   = ["Certain Hit", "Physical Attack", "Magical Attack"]
OCCASION_NAMES   = ["Always", "Battle Only", "Menu Only", "Never"]
SPECIAL_FLAG_NAMES = ["Auto Battle", "Guard", "Substitute", "Preserve TP"]
COLLAPSE_NAMES    = ["Normal", "Boss", "Instant", "No Disappear"]
PARTY_ABILITY_NAMES = ["Encounter Half", "Encounter None",
                       "Cancel Surprise", "Raise Preemptive",
                       "Gold Double", "Drop Item Double"]
RESTRICTION_NAMES   = ["None", "Attack an enemy", "Attack anyone",
                       "Attack an ally", "Cannot move"]
AUTO_REMOVAL_NAMES  = ["None", "At Action End", "At Turn End"]
SLOT_TYPE_NAMES     = ["Normal", "Dual Wield"]

# ── Field classification ──────────────────────────────────────────────────────
MULTILINE_FIELDS = {"description", "note", "profile"}
READONLY_FIELDS  = {"id"}

DROPDOWN_FIELDS = {
    "scope":              SCOPE_NAMES,
    "hitType":            HIT_TYPE_NAMES,
    "occasion":           OCCASION_NAMES,
    "restriction":        RESTRICTION_NAMES,
    "autoRemovalTiming":  AUTO_REMOVAL_NAMES,
}

# Fields to render with specialised widgets rather than generic ones
SPECIAL_FIELDS = {"damage", "traits", "effects", "learnings",
                  "actions", "dropItems", "params", "equips",
                  "pages", "members", "list", "expParams",
                  "flags", "tilesetNames", "timings",
                  "flashTimings", "soundTimings", "meta"}

# Preferred field order per category (unlisted keys appear at the end)
FIELD_ORDER = {
    "Skills": [
        "id", "name", "iconIndex", "description", "stypeId",
        "scope", "mpCost", "tpCost", "tpGain",
        "hitType", "occasion", "speed", "successRate", "repeats",
        "animationId", "requiredWtypeId1", "requiredWtypeId2",
        "message1", "message2",
        "damage", "effects", "traits", "note",
    ],
    "Items": [
        "id", "name", "iconIndex", "description",
        "itypeId", "price", "consumable",
        "scope", "occasion", "speed", "successRate", "repeats",
        "animationId", "tpGain",
        "damage", "effects", "note",
    ],
    "Weapons": [
        "id", "name", "iconIndex", "description",
        "wtypeId", "etypeId", "price",
        "params", "animationId", "traits", "note",
    ],
    "Armors": [
        "id", "name", "iconIndex", "description",
        "atypeId", "etypeId", "price",
        "params", "traits", "note",
    ],
    "Actors": [
        "id", "name", "nickname", "profile",
        "classId", "initialLevel", "maxLevel",
        "characterName", "characterIndex",
        "faceName", "faceIndex", "battlerName",
        "equips", "traits", "note",
    ],
    "Classes": [
        "id", "name", "expParams",
        "params", "learnings", "traits", "note",
    ],
    "Enemies": [
        "id", "name",
        "battlerName", "battlerHue",
        "params", "exp", "gold",
        "dropItems", "actions", "traits", "note",
    ],
    "States": [
        "id", "name", "iconIndex",
        "restriction", "priority",
        "autoRemovalTiming", "minTurns", "maxTurns",
        "removeAtBattleEnd", "removeByRestriction",
        "removeByDamage", "removeByWalking",
        "chanceByDamage", "stepsToRemove",
        "message1", "message2", "message3", "message4",
        "motion", "overlay",
        "traits", "note",
    ],
    "Troops": [
        "id", "name", "members", "pages", "note",
    ],
    "Animations": [
        "id", "name", "displayType", "effectName",
        "flashTimings", "soundTimings",
        "offsetX", "offsetY", "rotation", "speed2x",
        "note",
    ],
    "Tilesets": [
        "id", "name", "mode",
        "tilesetNames", "flags", "note",
    ],
    "CommonEvents": [
        "id", "name", "switchId", "trigger", "list", "note",
    ],
}

# ── Application Stylesheet (QSS) ──────────────────────────────────────────────
APP_STYLESHEET = """
/* ── Global ──────────────────────────────────────────── */
* {
    font-family: "Segoe UI", "Noto Sans", "Helvetica Neue", Arial, sans-serif;
}
QMainWindow, QDialog {
    background-color: #111222;
}
QWidget {
    color: #e0e0f0;
}

QToolTip {
    background-color: #252848;
    color: #e0e0f0;
    border: 1px solid #3d3e6a;
    padding: 5px 8px;
    border-radius: 4px;
    font-size: 12px;
}

/* ── Menu Bar ────────────────────────────────────────── */
QMenuBar {
    background-color: #0d0e1a;
    color: #c0c0d0;
    border-bottom: 1px solid #2d2e4a;
    padding: 2px 0;
    font-size: 13px;
}
QMenuBar::item:selected {
    background-color: #6c5ce7;
    color: #ffffff;
    border-radius: 4px;
}
QMenu {
    background-color: #181a35;
    border: 1px solid #2d2e4a;
    border-radius: 6px;
    padding: 5px;
}
QMenu::item {
    padding: 6px 30px 6px 20px;
    border-radius: 4px;
}
QMenu::item:selected {
    background-color: #6c5ce7;
    color: #ffffff;
}
QMenu::separator {
    height: 1px;
    background-color: #2d2e4a;
    margin: 4px 10px;
}

/* ── Sidebar ─────────────────────────────────────────── */
#sidebar {
    background-color: #0d0e1a;
    border-right: 1px solid #1e1f3a;
}
#sidebarTitle {
    font-size: 10px;
    font-weight: bold;
    color: #6c5ce7;
    padding: 12px 15px 6px 15px;
    letter-spacing: 3px;
}
#categoryList {
    background-color: transparent;
    border: none;
    font-size: 13px;
    outline: none;
}
#categoryList::item {
    padding: 9px 14px;
    border-radius: 6px;
    margin: 1px 6px;
    color: #8888a8;
}
#categoryList::item:selected {
    background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                stop:0 #6c5ce7, stop:1 #8b7cf7);
    color: #ffffff;
    font-weight: bold;
}
#categoryList::item:hover:!selected {
    background-color: #16183a;
    color: #c0c0e0;
}

/* ── Entry List Panel ────────────────────────────────── */
#entryPanel {
    background-color: #111228;
    border-right: 1px solid #1e1f3a;
}
#entryList {
    background-color: #0e0f22;
    border: 1px solid #1e1f3a;
    border-radius: 8px;
    font-size: 13px;
    font-family: "Cascadia Mono", "Consolas", monospace;
    padding: 4px;
    outline: none;
}
#entryList::item {
    padding: 5px 10px;
    border-radius: 4px;
    margin: 1px 2px;
    color: #a0a0c0;
}
#entryList::item:selected {
    background-color: #6c5ce7;
    color: #ffffff;
}
#entryList::item:hover:!selected {
    background-color: #1a1c40;
}

/* ── Line Edits ──────────────────────────────────────── */
QLineEdit {
    background-color: #181a38;
    border: 1px solid #2d2e4a;
    border-radius: 6px;
    padding: 7px 12px;
    color: #e0e0f0;
    font-size: 13px;
    selection-background-color: #6c5ce7;
}
QLineEdit:focus {
    border-color: #6c5ce7;
}
QLineEdit:read-only {
    background-color: #12132a;
    color: #666680;
}
QLineEdit[placeholderText] {
    color: #55566a;
}

/* ── Text Edits ──────────────────────────────────────── */
QTextEdit, QPlainTextEdit {
    background-color: #181a38;
    border: 1px solid #2d2e4a;
    border-radius: 6px;
    padding: 6px 10px;
    color: #e0e0f0;
    font-size: 13px;
    selection-background-color: #6c5ce7;
}
QTextEdit:focus, QPlainTextEdit:focus {
    border-color: #6c5ce7;
}

/* ── Spin Boxes ──────────────────────────────────────── */
QSpinBox, QDoubleSpinBox {
    background-color: #181a38;
    border: 1px solid #2d2e4a;
    border-radius: 6px;
    padding: 5px 10px;
    color: #e0e0f0;
    font-size: 13px;
    min-width: 80px;
}
QSpinBox:focus, QDoubleSpinBox:focus {
    border-color: #6c5ce7;
}
QSpinBox::up-button, QDoubleSpinBox::up-button,
QSpinBox::down-button, QDoubleSpinBox::down-button {
    background-color: #252848;
    border: none;
    width: 20px;
    border-radius: 3px;
}
QSpinBox::up-button:hover, QDoubleSpinBox::up-button:hover,
QSpinBox::down-button:hover, QDoubleSpinBox::down-button:hover {
    background-color: #6c5ce7;
}

/* ── Combo Boxes ─────────────────────────────────────── */
QComboBox {
    background-color: #181a38;
    border: 1px solid #2d2e4a;
    border-radius: 6px;
    padding: 6px 12px;
    color: #e0e0f0;
    font-size: 13px;
    min-width: 120px;
}
QComboBox:focus {
    border-color: #6c5ce7;
}
QComboBox::drop-down {
    border: none;
    width: 28px;
}
QComboBox QAbstractItemView {
    background-color: #181a38;
    border: 1px solid #2d2e4a;
    border-radius: 6px;
    selection-background-color: #6c5ce7;
    color: #e0e0f0;
    padding: 4px;
    outline: none;
}

/* ── Check Boxes ─────────────────────────────────────── */
QCheckBox {
    spacing: 8px;
    font-size: 13px;
    color: #c0c0d8;
}
QCheckBox::indicator {
    width: 18px;
    height: 18px;
    border: 2px solid #3d3e6a;
    border-radius: 4px;
    background-color: #181a38;
}
QCheckBox::indicator:checked {
    background-color: #6c5ce7;
    border-color: #6c5ce7;
}
QCheckBox::indicator:hover {
    border-color: #8b7cf7;
}

/* ── Push Buttons ────────────────────────────────────── */
QPushButton {
    background-color: #1e2048;
    border: 1px solid #2d2e5a;
    border-radius: 6px;
    padding: 7px 18px;
    color: #c0c0e0;
    font-size: 13px;
    font-weight: 500;
}
QPushButton:hover {
    background-color: #282b60;
    border-color: #6c5ce7;
    color: #e8e8ff;
}
QPushButton:pressed {
    background-color: #6c5ce7;
    color: #ffffff;
}
QPushButton:disabled {
    background-color: #14152a;
    color: #44446a;
    border-color: #1e1f3a;
}

#accentButton {
    background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                stop:0 #6c5ce7, stop:1 #8b7cf7);
    border: none;
    color: #ffffff;
    font-weight: bold;
    font-size: 14px;
    padding: 10px 24px;
    border-radius: 8px;
}
#accentButton:hover {
    background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                stop:0 #7d6ef0, stop:1 #a89cfa);
}
#accentButton:pressed {
    background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                stop:0 #5a4bd6, stop:1 #7b6ce8);
}

#dangerButton {
    background-color: #e94560;
    border: none;
    color: #ffffff;
    font-weight: bold;
}
#dangerButton:hover {
    background-color: #f0586f;
}

#saveButton {
    background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                stop:0 #27ae60, stop:1 #2ecc71);
    border: none;
    color: #ffffff;
    font-weight: bold;
    font-size: 14px;
    padding: 10px 30px;
    border-radius: 8px;
    min-width: 160px;
}
#saveButton:hover {
    background: qlineargradient(x1:0, y1:0, x2:1, y2:0,
                stop:0 #2ecc71, stop:1 #3ddb80);
}

#toolButton {
    background-color: #1a1c42;
    border: 1px solid #2a2c5a;
    border-radius: 6px;
    font-size: 14px;
    padding: 4px;
    min-width: 32px;
    min-height: 28px;
}
#toolButton:hover {
    background-color: #282b60;
    border-color: #6c5ce7;
}
#toolButton:pressed {
    background-color: #6c5ce7;
}

/* ── Scroll Areas ────────────────────────────────────── */
QScrollArea {
    border: none;
    background-color: transparent;
}
QScrollBar:vertical {
    background-color: #111228;
    width: 10px;
    border-radius: 5px;
    margin: 0;
}
QScrollBar::handle:vertical {
    background-color: #2d2e5a;
    border-radius: 5px;
    min-height: 30px;
}
QScrollBar::handle:vertical:hover {
    background-color: #6c5ce7;
}
QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical {
    height: 0;
}
QScrollBar:horizontal {
    background-color: #111228;
    height: 10px;
    border-radius: 5px;
}
QScrollBar::handle:horizontal {
    background-color: #2d2e5a;
    border-radius: 5px;
    min-width: 30px;
}
QScrollBar::handle:horizontal:hover {
    background-color: #6c5ce7;
}
QScrollBar::add-line:horizontal, QScrollBar::sub-line:horizontal {
    width: 0;
}

/* ── Group Boxes ─────────────────────────────────────── */
QGroupBox {
    background-color: #13142c;
    border: 1px solid #1e1f3a;
    border-radius: 8px;
    margin-top: 14px;
    padding-top: 18px;
    font-size: 13px;
    font-weight: bold;
    color: #8b7cf7;
}
QGroupBox::title {
    subcontrol-origin: margin;
    subcontrol-position: top left;
    padding: 2px 12px;
    background-color: #1a1c3e;
    border: 1px solid #2d2e5a;
    border-radius: 4px;
    margin-left: 10px;
}

/* ── Tables ──────────────────────────────────────────── */
QTableWidget {
    background-color: #0e0f22;
    border: 1px solid #1e1f3a;
    border-radius: 6px;
    gridline-color: #1e1f3a;
    font-size: 12px;
    outline: none;
}
QTableWidget::item {
    padding: 4px 8px;
    color: #c0c0d8;
}
QTableWidget::item:selected {
    background-color: #6c5ce7;
    color: #ffffff;
}
QHeaderView::section {
    background-color: #181a38;
    color: #8888a8;
    border: none;
    border-right: 1px solid #1e1f3a;
    border-bottom: 1px solid #1e1f3a;
    padding: 6px 10px;
    font-weight: bold;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* ── Status Bar ──────────────────────────────────────── */
QStatusBar {
    background-color: #0d0e1a;
    border-top: 1px solid #1e1f3a;
    color: #8888a8;
    font-size: 12px;
    padding: 2px 10px;
}

/* ── Labels ──────────────────────────────────────────── */
QLabel {
    color: #c0c0d8;
}
#headerLabel {
    font-size: 18px;
    font-weight: bold;
    color: #e0e0f0;
    padding: 8px 0;
}
#sectionLabel {
    font-size: 11px;
    font-weight: bold;
    color: #6c5ce7;
    letter-spacing: 2px;
    padding: 10px 0 4px 0;
}
#fieldLabel {
    font-size: 13px;
    color: #9090aa;
    min-width: 140px;
}
#countBadge {
    background-color: #1e2048;
    border: 1px solid #2d2e5a;
    border-radius: 10px;
    padding: 2px 8px;
    font-size: 11px;
    color: #8b7cf7;
    font-weight: bold;
}

/* ── Splitter ────────────────────────────────────────── */
QSplitter::handle {
    background-color: #1e1f3a;
    width: 2px;
}
QSplitter::handle:hover {
    background-color: #6c5ce7;
}

/* ── Tab Widget ──────────────────────────────────────── */
QTabWidget::pane {
    border: 1px solid #1e1f3a;
    border-radius: 6px;
    background-color: #111228;
}
QTabBar::tab {
    background-color: #14152e;
    border: 1px solid #1e1f3a;
    padding: 8px 16px;
    color: #8888a8;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    margin-right: 2px;
}
QTabBar::tab:selected {
    background-color: #111228;
    color: #e0e0f0;
    border-bottom-color: #111228;
}
QTabBar::tab:hover:!selected {
    background-color: #1a1c40;
    color: #c0c0e0;
}

/* ── Message Box ─────────────────────────────────────── */
QMessageBox {
    background-color: #181a35;
}
QMessageBox QLabel {
    color: #e0e0f0;
    font-size: 13px;
}
QMessageBox QPushButton {
    min-width: 80px;
}

/* ── Startup Dialog ──────────────────────────────────── */
#startupTitle {
    font-size: 28px;
    font-weight: bold;
    color: #e0e0f0;
    padding: 10px;
}
#startupSubtitle {
    font-size: 14px;
    color: #6c5ce7;
    padding-bottom: 20px;
}
#startupHint {
    font-size: 12px;
    color: #55566a;
    padding: 5px;
    font-style: italic;
}

/* ── Formula Editor ──────────────────────────────────── */
#formulaEdit {
    font-family: "Cascadia Mono", "Consolas", "Courier New", monospace;
    font-size: 14px;
    background-color: #181a38;
    color: #f0c040;
    border: 1px solid #2d2e4a;
    border-radius: 6px;
    padding: 8px 12px;
}
#formulaEdit:focus {
    border-color: #f0c040;
}
"""
