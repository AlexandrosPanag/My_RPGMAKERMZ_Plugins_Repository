# RPG Maker MZ Database Manager
# Created by Alexandros Panagiotakopoulos
# Version 1.0.0
# Date: 22/10/2026
# Copyright (c) 2026-2027 Alexandros Panagiotakopoulos 
# License: CC BY-NC-SA 4.0 
# https://creativecommons.org/licenses/by-nc-sa/4.0/ 
 

"""
main.py — RPG Maker MZ Database Manager
Entry point: startup dialog → main window.
"""

from __future__ import annotations

import os
import sys

from PySide6.QtWidgets import (
    QApplication, QDialog, QFileDialog, QHBoxLayout, QLabel,
    QLineEdit, QListWidget, QListWidgetItem, QMainWindow,
    QMenuBar, QMessageBox, QPushButton, QSizePolicy, QSplitter,
    QStatusBar, QVBoxLayout, QWidget,
)
from PySide6.QtCore import Qt, QSize, QSettings
from PySide6.QtGui import QAction, QFont, QKeySequence, QIcon

from constants import APP_STYLESHEET, CATEGORY_ICONS, DATABASE_FILES
from database import DatabaseManager
from editors import PropertyEditor


# ═══════════════════════════════════════════════════════════════════════════════
#  Startup Dialog
# ═══════════════════════════════════════════════════════════════════════════════

class StartupDialog(QDialog):
    """Project-selection screen shown on launch."""

    def __init__(self, parent: QWidget | None = None):
        super().__init__(parent)
        self.setWindowTitle("RPG Maker MZ — Database Manager")
        self.setMinimumSize(580, 420)
        self.setMaximumSize(700, 520)
        self.selected_path: str | None = None

        self._settings = QSettings("RPGMZ-DBManager", "DBManager")

        lay = QVBoxLayout(self)
        lay.setContentsMargins(40, 30, 40, 30)
        lay.setSpacing(8)

        # ── Title ──────────────────────────────────────────────────
        spacer_top = QWidget()
        spacer_top.setFixedHeight(10)
        lay.addWidget(spacer_top)

        title = QLabel("RPG Maker MZ\nDatabase Manager")
        title.setObjectName("startupTitle")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        lay.addWidget(title)

        subtitle = QLabel("Advanced editing, reordering, and management for your project database")
        subtitle.setObjectName("startupSubtitle")
        subtitle.setAlignment(Qt.AlignmentFlag.AlignCenter)
        subtitle.setWordWrap(True)
        lay.addWidget(subtitle)

        lay.addSpacing(18)

        # ── Path input ─────────────────────────────────────────────
        path_label = QLabel("PROJECT DATA FOLDER")
        path_label.setObjectName("sectionLabel")
        lay.addWidget(path_label)

        path_row = QHBoxLayout()
        path_row.setSpacing(8)
        self._path_edit = QLineEdit()
        self._path_edit.setPlaceholderText(r"C:\path\to\your\rpg-project\data")
        self._path_edit.setMinimumHeight(38)

        # Restore last-used path
        last = self._settings.value("last_path", "")
        if last:
            self._path_edit.setText(last)

        browse_btn = QPushButton("Browse…")
        browse_btn.setMinimumHeight(38)
        browse_btn.clicked.connect(self._browse)
        path_row.addWidget(self._path_edit, 1)
        path_row.addWidget(browse_btn)
        lay.addLayout(path_row)

        hint = QLabel("Select the  data/  folder inside your RPG Maker MZ project.")
        hint.setObjectName("startupHint")
        lay.addWidget(hint)

        lay.addSpacing(18)

        # ── Open button ────────────────────────────────────────────
        open_btn = QPushButton("Open Project")
        open_btn.setObjectName("accentButton")
        open_btn.setMinimumHeight(44)
        open_btn.clicked.connect(self._open)
        lay.addWidget(open_btn)

        lay.addStretch()

        # ── Version footer ─────────────────────────────────────────
        ver = QLabel("v1.0.0")
        ver.setAlignment(Qt.AlignmentFlag.AlignCenter)
        ver.setStyleSheet("color: #333355; font-size: 11px;")
        lay.addWidget(ver)

    # ── Slots ──────────────────────────────────────────────────────────────────

    def _browse(self) -> None:
        folder = QFileDialog.getExistingDirectory(
            self, "Select the  data/  folder", self._path_edit.text()
        )
        if folder:
            self._path_edit.setText(folder)

    def _open(self) -> None:
        path = self._path_edit.text().strip()
        if not path:
            QMessageBox.warning(self, "No Path", "Please enter or browse to a folder.")
            return
        if not os.path.isdir(path):
            QMessageBox.warning(
                self, "Invalid Path",
                f"The folder does not exist:\n{path}"
            )
            return
        # Quick sanity check: look for at least one expected .json
        found_any = any(
            os.path.isfile(os.path.join(path, f))
            for f in DATABASE_FILES.values()
        )
        if not found_any:
            reply = QMessageBox.question(
                self, "No Database Files Found",
                "This folder does not appear to contain RPG Maker MZ "
                "database files (Actors.json, Skills.json, etc.).\n\n"
                "Open it anyway?",
                QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
            )
            if reply != QMessageBox.StandardButton.Yes:
                return

        self._settings.setValue("last_path", path)
        self.selected_path = path
        self.accept()


# ═══════════════════════════════════════════════════════════════════════════════
#  Main Window
# ═══════════════════════════════════════════════════════════════════════════════

class MainWindow(QMainWindow):
    """Primary application window with sidebar, entry list, and property editor."""

    def __init__(self, data_path: str):
        super().__init__()
        self.db = DatabaseManager()
        self.db.set_path(data_path)
        self._current_category: str | None = None
        self._current_entry_idx: int = -1
        self._all_entries: list[tuple[int, dict]] = []  # cached for filtering

        self.setWindowTitle(f"RPG Maker MZ Database Manager  —  {data_path}")
        self.setMinimumSize(1100, 700)
        self.resize(1440, 900)

        self._build_ui()
        self._build_menus()
        self._load_data()

    # ── UI Construction ────────────────────────────────────────────────────────

    def _build_ui(self) -> None:
        central = QWidget()
        self.setCentralWidget(central)
        root = QHBoxLayout(central)
        root.setContentsMargins(0, 0, 0, 0)
        root.setSpacing(0)

        # ── Sidebar ────────────────────────────────────────────────
        sidebar = QWidget()
        sidebar.setObjectName("sidebar")
        sidebar.setFixedWidth(190)
        side_lay = QVBoxLayout(sidebar)
        side_lay.setContentsMargins(0, 8, 0, 8)
        side_lay.setSpacing(0)

        side_title = QLabel("DATABASE")
        side_title.setObjectName("sidebarTitle")
        side_lay.addWidget(side_title)

        self._cat_list = QListWidget()
        self._cat_list.setObjectName("categoryList")
        for cat in DATABASE_FILES:
            icon = CATEGORY_ICONS.get(cat, "\U0001F4C1")
            item = QListWidgetItem(f"  {icon}   {cat}")
            item.setData(Qt.ItemDataRole.UserRole, cat)
            item.setSizeHint(QSize(0, 36))
            self._cat_list.addItem(item)
        self._cat_list.currentRowChanged.connect(self._on_category_changed)
        side_lay.addWidget(self._cat_list)

        root.addWidget(sidebar)

        # ── Entry-list panel ───────────────────────────────────────
        entry_panel = QWidget()
        entry_panel.setObjectName("entryPanel")
        entry_panel.setMinimumWidth(250)
        entry_panel.setMaximumWidth(340)
        ep_lay = QVBoxLayout(entry_panel)
        ep_lay.setContentsMargins(10, 10, 10, 10)
        ep_lay.setSpacing(6)

        self._search = QLineEdit()
        self._search.setPlaceholderText("\U0001F50D  Search entries…")
        self._search.setClearButtonEnabled(True)
        self._search.textChanged.connect(self._filter_entries)
        ep_lay.addWidget(self._search)

        self._entry_list = QListWidget()
        self._entry_list.setObjectName("entryList")
        self._entry_list.currentRowChanged.connect(self._on_entry_selected)
        ep_lay.addWidget(self._entry_list, 1)

        # Toolbar
        tb = QHBoxLayout()
        tb.setSpacing(3)
        tool_defs = [
            ("▲",  "Move Up  (Ctrl+Up)",     self._move_up),
            ("▼",  "Move Down  (Ctrl+Down)",  self._move_down),
            ("+",  "Add Entry  (Ctrl+N)",     self._add_entry),
            ("✂",  "Cut  (Ctrl+X)",           self._cut_entry),
            ("⧉",  "Copy  (Ctrl+C)",          self._copy_entry),
            ("📋", "Paste  (Ctrl+V)",          self._paste_entry),
            ("⊘",  "Duplicate",               self._duplicate_entry),
            ("🗑", "Delete  (Del)",            self._delete_entry),
        ]
        for text, tip, handler in tool_defs:
            btn = QPushButton(text)
            btn.setObjectName("toolButton")
            btn.setToolTip(tip)
            btn.setFixedSize(36, 32)
            btn.clicked.connect(handler)
            tb.addWidget(btn)
        tb.addStretch()
        ep_lay.addLayout(tb)

        # ── Right splitter: entry-list | property editor ───────────
        splitter = QSplitter(Qt.Orientation.Horizontal)
        splitter.setHandleWidth(2)

        splitter.addWidget(entry_panel)

        # Property editor wrapper
        editor_wrapper = QWidget()
        editor_wrapper.setStyleSheet("background-color: #111228;")
        ew_lay = QVBoxLayout(editor_wrapper)
        ew_lay.setContentsMargins(0, 0, 0, 0)
        ew_lay.setSpacing(0)

        self._prop_editor = PropertyEditor()
        ew_lay.addWidget(self._prop_editor, 1)

        # Save bar
        save_bar = QWidget()
        save_bar.setStyleSheet(
            "background-color: #0d0e1a; border-top: 1px solid #1e1f3a;"
        )
        sb_lay = QHBoxLayout(save_bar)
        sb_lay.setContentsMargins(16, 10, 16, 10)

        self._mod_label = QLabel("")
        self._mod_label.setStyleSheet("color: #f39c12; font-size: 12px;")
        sb_lay.addWidget(self._mod_label)
        sb_lay.addStretch()

        save_btn = QPushButton("💾   Save All Changes")
        save_btn.setObjectName("saveButton")
        save_btn.clicked.connect(self._save_all)
        sb_lay.addWidget(save_btn)

        ew_lay.addWidget(save_bar)

        splitter.addWidget(editor_wrapper)
        splitter.setStretchFactor(0, 0)
        splitter.setStretchFactor(1, 1)
        splitter.setSizes([280, 900])

        root.addWidget(splitter, 1)

        # ── Status bar ─────────────────────────────────────────────
        self._status = self.statusBar()
        self._status.showMessage("Ready")
        self._status_right = QLabel("")
        self._status.addPermanentWidget(self._status_right)

    # ── Menus ──────────────────────────────────────────────────────────────────

    def _build_menus(self) -> None:
        mb = self.menuBar()

        # File
        file_m = mb.addMenu("&File")
        self._add_action(file_m, "&Open Project…", self._open_project, QKeySequence.StandardKey.Open)
        file_m.addSeparator()
        self._add_action(file_m, "&Save All", self._save_all, QKeySequence.StandardKey.Save)
        self._add_action(file_m, "Save Current &Category", self._save_category)
        file_m.addSeparator()
        self._add_action(file_m, "Create &Backup", self._backup)
        self._add_action(file_m, "&Reload from Disk", self._reload)
        file_m.addSeparator()
        self._add_action(file_m, "E&xit", self.close, QKeySequence.StandardKey.Quit)

        # Edit
        edit_m = mb.addMenu("&Edit")
        self._add_action(edit_m, "Cu&t Entry", self._cut_entry, QKeySequence.StandardKey.Cut)
        self._add_action(edit_m, "&Copy Entry", self._copy_entry, QKeySequence.StandardKey.Copy)
        self._add_action(edit_m, "&Paste Entry", self._paste_entry, QKeySequence.StandardKey.Paste)
        edit_m.addSeparator()
        self._add_action(edit_m, "&Duplicate Entry", self._duplicate_entry, QKeySequence("Ctrl+D"))
        self._add_action(edit_m, "De&lete Entry", self._delete_entry, QKeySequence.StandardKey.Delete)
        edit_m.addSeparator()
        self._add_action(edit_m, "&Add New Entry", self._add_entry, QKeySequence("Ctrl+N"))
        self._add_action(edit_m, "Move &Up", self._move_up, QKeySequence("Ctrl+Up"))
        self._add_action(edit_m, "Move &Down", self._move_down, QKeySequence("Ctrl+Down"))

        # Help
        help_m = mb.addMenu("&Help")
        self._add_action(help_m, "&About", self._about)

    @staticmethod
    def _add_action(menu, text, slot, shortcut=None) -> QAction:
        act = QAction(text, menu)
        if shortcut:
            act.setShortcut(shortcut)
        act.triggered.connect(slot)
        menu.addAction(act)
        return act

    # ── Data loading ───────────────────────────────────────────────────────────

    def _load_data(self) -> None:
        results = self.db.load_all()
        ok = sum(1 for v in results.values() if v == "OK")
        total = len(results)
        self._status.showMessage(f"Loaded {ok}/{total} database files")

        # Report errors
        errors = {k: v for k, v in results.items() if v != "OK" and v != "File not found"}
        if errors:
            msg = "\n".join(f"  • {k}: {v}" for k, v in errors.items())
            QMessageBox.warning(
                self, "Load Warnings",
                f"Some files had issues:\n{msg}"
            )

        if self._cat_list.count() > 0:
            self._cat_list.setCurrentRow(0)

    # ── Category / entry selection ─────────────────────────────────────────────

    def _on_category_changed(self, row: int) -> None:
        if row < 0:
            return
        item = self._cat_list.item(row)
        cat = item.data(Qt.ItemDataRole.UserRole) if item else None
        if not cat:
            return
        self._current_category = cat
        self._current_entry_idx = -1
        self._refresh_entries()
        self._prop_editor.clear()
        count = self.db.entry_count(cat)
        self._status_right.setText(
            f"Category: {cat}   |   {count} entries"
        )

    def _refresh_entries(self) -> None:
        self._entry_list.blockSignals(True)
        self._entry_list.clear()
        if not self._current_category:
            self._entry_list.blockSignals(False)
            return

        self._all_entries = self.db.get_entries(self._current_category)
        search = self._search.text().strip().lower()

        for arr_idx, entry in self._all_entries:
            name = entry.get("name", "")
            eid = entry.get("id", arr_idx)
            display = f"{eid:04d}:  {name}"
            if search and search not in display.lower():
                continue
            item = QListWidgetItem(display)
            item.setData(Qt.ItemDataRole.UserRole, arr_idx)
            self._entry_list.addItem(item)

        self._entry_list.blockSignals(False)

    def _filter_entries(self, _text: str) -> None:
        self._refresh_entries()

    def _on_entry_selected(self, row: int) -> None:
        if row < 0:
            self._prop_editor.clear()
            self._current_entry_idx = -1
            return
        item = self._entry_list.item(row)
        if not item:
            return
        idx = item.data(Qt.ItemDataRole.UserRole)
        self._current_entry_idx = idx
        entry = self.db.get_entry(self._current_category, idx)
        if entry and isinstance(entry, dict):
            self._prop_editor.load_entry(entry, self._current_category)
        self._update_mod_label()

    def _select_entry_by_array_index(self, arr_idx: int) -> None:
        """After a list refresh, select the row whose UserRole == arr_idx."""
        for row in range(self._entry_list.count()):
            item = self._entry_list.item(row)
            if item and item.data(Qt.ItemDataRole.UserRole) == arr_idx:
                self._entry_list.setCurrentRow(row)
                return

    # ── Entry manipulation ─────────────────────────────────────────────────────

    def _add_entry(self) -> None:
        cat = self._current_category
        if not cat:
            return
        new_idx = self.db.add_entry(cat)
        if new_idx >= 0:
            self._refresh_entries()
            self._select_entry_by_array_index(new_idx)
            self._update_mod_label()
            self._status.showMessage(f"Added new entry at index {new_idx}")

    def _delete_entry(self) -> None:
        cat = self._current_category
        idx = self._current_entry_idx
        if not cat or idx <= 0:
            return
        entry = self.db.get_entry(cat, idx)
        name = entry.get("name", "") if isinstance(entry, dict) else ""
        reply = QMessageBox.question(
            self, "Confirm Delete",
            f"Delete entry #{idx} \"{name}\" from {cat}?\n\n"
            "The slot will be set to null.",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
        )
        if reply == QMessageBox.StandardButton.Yes:
            self.db.delete_entry(cat, idx)
            self._prop_editor.clear()
            self._current_entry_idx = -1
            self._refresh_entries()
            self._update_mod_label()
            self._status.showMessage(f"Deleted entry #{idx}")

    def _cut_entry(self) -> None:
        cat = self._current_category
        idx = self._current_entry_idx
        if not cat or idx <= 0:
            return
        if self.db.cut_entry(cat, idx):
            self._prop_editor.clear()
            self._current_entry_idx = -1
            self._refresh_entries()
            self._update_mod_label()
            self._status.showMessage(f"Cut entry #{idx} to clipboard")

    def _copy_entry(self) -> None:
        cat = self._current_category
        idx = self._current_entry_idx
        if not cat or idx < 0:
            return
        if self.db.copy_entry(cat, idx):
            self._status.showMessage(f"Copied entry #{idx} to clipboard")

    def _paste_entry(self) -> None:
        cat = self._current_category
        if not cat or not self.db.has_clipboard:
            self._status.showMessage("Clipboard is empty")
            return
        new_idx = self.db.paste_entry(cat)
        if new_idx >= 0:
            self._refresh_entries()
            self._select_entry_by_array_index(new_idx)
            self._update_mod_label()
            self._status.showMessage(f"Pasted entry at index {new_idx}")

    def _duplicate_entry(self) -> None:
        cat = self._current_category
        idx = self._current_entry_idx
        if not cat or idx < 0:
            return
        new_idx = self.db.duplicate_entry(cat, idx)
        if new_idx >= 0:
            self._refresh_entries()
            self._select_entry_by_array_index(new_idx)
            self._update_mod_label()
            self._status.showMessage(f"Duplicated entry → index {new_idx}")

    def _move_up(self) -> None:
        cat = self._current_category
        idx = self._current_entry_idx
        if not cat or idx <= 1:
            return
        # Find the previous non-null entry
        target = idx - 1
        while target > 0 and self.db.get_entry(cat, target) is None:
            target -= 1
        if target <= 0:
            return
        if self.db.swap_entries(cat, idx, target):
            self._refresh_entries()
            self._select_entry_by_array_index(target)
            self._update_mod_label()
            self._status.showMessage(f"Moved entry {idx} ↔ {target}")

    def _move_down(self) -> None:
        cat = self._current_category
        idx = self._current_entry_idx
        raw = self.db.data.get(cat)
        if not cat or not isinstance(raw, list) or idx < 1 or idx >= len(raw) - 1:
            return
        target = idx + 1
        while target < len(raw) and self.db.get_entry(cat, target) is None:
            target += 1
        if target >= len(raw):
            return
        if self.db.swap_entries(cat, idx, target):
            self._refresh_entries()
            self._select_entry_by_array_index(target)
            self._update_mod_label()
            self._status.showMessage(f"Moved entry {idx} ↔ {target}")

    # ── Save / Backup / Reload ─────────────────────────────────────────────────

    def _save_all(self) -> None:
        results = self.db.save_all()
        ok = sum(1 for v in results.values() if v == "Saved")
        total = len(results)
        self._status.showMessage(f"Saved {ok}/{total} files ✓")
        self._update_mod_label()

        errors = {k: v for k, v in results.items() if v != "Saved"}
        if errors:
            msg = "\n".join(f"  • {k}: {v}" for k, v in errors.items())
            QMessageBox.warning(self, "Save Errors", f"Errors:\n{msg}")
        else:
            self._status.showMessage(f"All {ok} files saved successfully ✓")

    def _save_category(self) -> None:
        cat = self._current_category
        if not cat:
            return
        if self.db.save_category(cat):
            self.db.modified_categories.discard(cat)
            self._update_mod_label()
            self._status.showMessage(f"Saved {cat} ✓")
        else:
            QMessageBox.warning(self, "Error", f"Failed to save {cat}")

    def _backup(self) -> None:
        path = self.db.backup()
        if path:
            QMessageBox.information(
                self, "Backup Created",
                f"Backup saved to:\n{path}"
            )
            self._status.showMessage(f"Backup → {path}")
        else:
            QMessageBox.warning(self, "Backup Failed", "Could not create backup.")

    def _reload(self) -> None:
        reply = QMessageBox.question(
            self, "Reload from Disk",
            "Discard all unsaved changes and reload from disk?",
            QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
        )
        if reply == QMessageBox.StandardButton.Yes:
            self._prop_editor.clear()
            self._current_entry_idx = -1
            self._load_data()

    def _open_project(self) -> None:
        folder = QFileDialog.getExistingDirectory(
            self, "Select data/ folder", self.db.data_path or ""
        )
        if folder:
            self.db.set_path(folder)
            self._prop_editor.clear()
            self._current_entry_idx = -1
            self._current_category = None
            self._load_data()
            self.setWindowTitle(
                f"RPG Maker MZ Database Manager  —  {folder}"
            )

    # ── Helpers ────────────────────────────────────────────────────────────────

    def _update_mod_label(self) -> None:
        mods = self.db.modified_categories
        if mods:
            self._mod_label.setText(
                f"⚠  Unsaved changes in: {', '.join(sorted(mods))}"
            )
        else:
            self._mod_label.setText("")

        # Also update the status-bar count
        if self._current_category:
            count = self.db.entry_count(self._current_category)
            self._status_right.setText(
                f"Category: {self._current_category}   |   {count} entries"
            )

    def _about(self) -> None:
        QMessageBox.about(
            self,
            "About RPG Maker MZ Database Manager",
            "<h3>RPG Maker MZ Database Manager</h3>"
            "<p>Version 1.0.0</p>"
            "<p>An advanced editor for RPG Maker MZ's JSON database files. "
            "Supports cut/copy/paste, reordering, deep editing of traits, "
            "effects, damage formulas, and more.</p>"
            "<p><b>Shortcuts:</b></p>"
            "<ul>"
            "<li>Ctrl+S — Save All</li>"
            "<li>Ctrl+N — New Entry</li>"
            "<li>Ctrl+D — Duplicate Entry</li>"
            "<li>Ctrl+X/C/V — Cut/Copy/Paste</li>"
            "<li>Ctrl+↑/↓ — Move Up/Down</li>"
            "<li>Delete — Delete Entry</li>"
            "</ul>"
        )

    # ── Close event ────────────────────────────────────────────────────────────

    def closeEvent(self, event) -> None:
        if self.db.modified_categories:
            reply = QMessageBox.question(
                self,
                "Unsaved Changes",
                f"You have unsaved changes in: "
                f"{', '.join(sorted(self.db.modified_categories))}.\n\n"
                "Save before exiting?",
                QMessageBox.StandardButton.Save
                | QMessageBox.StandardButton.Discard
                | QMessageBox.StandardButton.Cancel,
            )
            if reply == QMessageBox.StandardButton.Save:
                self._save_all()
                event.accept()
            elif reply == QMessageBox.StandardButton.Discard:
                event.accept()
            else:
                event.ignore()
        else:
            event.accept()


# ═══════════════════════════════════════════════════════════════════════════════
#  Entry point
# ═══════════════════════════════════════════════════════════════════════════════

def main() -> None:
    app = QApplication(sys.argv)
    app.setApplicationName("RPG Maker MZ Database Manager")
    app.setOrganizationName("RPGMZ-DBManager")
    app.setStyle("Fusion")  # best cross-platform base style
    app.setStyleSheet(APP_STYLESHEET)

    # Show startup dialog
    startup = StartupDialog()
    if startup.exec() != QDialog.DialogCode.Accepted:
        sys.exit(0)

    data_path = startup.selected_path
    if not data_path:
        sys.exit(0)

    # Launch main window
    window = MainWindow(data_path)
    window.show()
    sys.exit(app.exec())


if __name__ == "__main__":
    main()
