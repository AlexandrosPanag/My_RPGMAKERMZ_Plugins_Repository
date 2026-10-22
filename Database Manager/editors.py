# RPG Maker MZ Database Manager
# Created by Alexandros Panagiotakopoulos
# Version 1.0.0
# Date: 22/10/2026
# Copyright (c) 2026-2027 Alexandros Panagiotakopoulos 
# License: CC BY-NC-SA 4.0 
# https://creativecommons.org/licenses/by-nc-sa/4.0/ 

"""
editors.py — Dynamic property editors for RPG Maker MZ database entries.

Provides:
  • PropertyEditor    – scrollable form that renders every field of a selected entry
  • TraitsDialog      – table-based editor for the ``traits`` array
  • EffectsDialog     – table-based editor for the ``effects`` array
  • JsonEditorDialog  – raw-JSON fallback for deeply-nested / unknown data
"""

from __future__ import annotations

import copy
import json
import re
from typing import Any

from PySide6.QtWidgets import (
    QCheckBox, QComboBox, QDialog, QDoubleSpinBox, QFormLayout,
    QGroupBox, QHBoxLayout, QHeaderView, QLabel, QLineEdit,
    QMessageBox, QPlainTextEdit, QPushButton, QScrollArea,
    QSizePolicy, QSpinBox, QTableWidget, QTableWidgetItem,
    QTextEdit, QVBoxLayout, QWidget,
)
from PySide6.QtCore import Qt, Signal
from PySide6.QtGui import QFont

from constants import (
    DROPDOWN_FIELDS, EFFECT_CODES, EFFECT_CODE_LIST, FIELD_LABELS,
    FIELD_ORDER, MULTILINE_FIELDS, PARAM_NAMES, READONLY_FIELDS,
    SPECIAL_FIELDS, TRAIT_CODES, TRAIT_CODE_LIST,
    XPARAM_NAMES, SPARAM_NAMES, DAMAGE_TYPES,
    SPECIAL_FLAG_NAMES, COLLAPSE_NAMES, PARTY_ABILITY_NAMES,
    SLOT_TYPE_NAMES,
)


# ═══════════════════════════════════════════════════════════════════════════════
#  Utilities
# ═══════════════════════════════════════════════════════════════════════════════

def _camel_to_title(name: str) -> str:
    """``camelCase`` → ``Camel Case``."""
    s = re.sub(r"([A-Z])", r" \1", name)
    return s.strip().title()


def _field_label(key: str) -> str:
    return FIELD_LABELS.get(key, _camel_to_title(key))


def _trait_description(trait: dict) -> str:
    """Human-readable one-liner for a trait dict."""
    code = trait.get("code", 0)
    data_id = trait.get("dataId", 0)
    value = trait.get("value", 0)
    code_name = TRAIT_CODES.get(code, f"Code {code}")
    detail = _trait_data_label(code, data_id)
    val_str = _trait_value_str(code, value)
    return f"{code_name}  ·  {detail}  ·  {val_str}"


def _trait_data_label(code: int, data_id: int) -> str:
    if code in (21,):  # Parameter
        return PARAM_NAMES[data_id] if data_id < len(PARAM_NAMES) else f"#{data_id}"
    if code in (22,):  # Ex-Parameter
        return XPARAM_NAMES[data_id] if data_id < len(XPARAM_NAMES) else f"#{data_id}"
    if code in (23,):  # Sp-Parameter
        return SPARAM_NAMES[data_id] if data_id < len(SPARAM_NAMES) else f"#{data_id}"
    if code == 62:
        return SPECIAL_FLAG_NAMES[data_id] if data_id < len(SPECIAL_FLAG_NAMES) else f"#{data_id}"
    if code == 63:
        return COLLAPSE_NAMES[data_id] if data_id < len(COLLAPSE_NAMES) else f"#{data_id}"
    if code == 64:
        return PARTY_ABILITY_NAMES[data_id] if data_id < len(PARTY_ABILITY_NAMES) else f"#{data_id}"
    if code == 55:
        return SLOT_TYPE_NAMES[data_id] if data_id < len(SLOT_TYPE_NAMES) else f"#{data_id}"
    return f"#{data_id}"


def _trait_value_str(code: int, value) -> str:
    if code in (11, 12, 13, 21, 22, 23, 32):
        return f"{value * 100:.0f}%"
    if code in (33, 34, 61):
        return f"{value:+.0f}" if isinstance(value, (int, float)) else str(value)
    return str(value)


def _effect_description(effect: dict) -> str:
    code = effect.get("code", 0)
    data_id = effect.get("dataId", 0)
    v1 = effect.get("value1", 0)
    v2 = effect.get("value2", 0)
    code_name = EFFECT_CODES.get(code, f"Code {code}")
    if code in (11, 12):
        return f"{code_name}  ·  {v1 * 100:.0f}% + {v2}"
    if code == 13:
        return f"{code_name}  ·  {v1:.0f}"
    if code in (21, 22):
        return f"{code_name}  ·  State #{data_id}  ·  {v1 * 100:.0f}%"
    if code in (31, 32, 33, 34):
        return f"{code_name}  ·  Param #{data_id}  ·  {v1:.0f} turns"
    if code == 42:
        return f"{code_name}  ·  Param #{data_id}  ·  +{v1:.0f}"
    if code == 43:
        return f"{code_name}  ·  Skill #{data_id}"
    if code == 44:
        return f"{code_name}  ·  Event #{data_id}"
    return f"{code_name}  ·  d={data_id}  v1={v1}  v2={v2}"


# ═══════════════════════════════════════════════════════════════════════════════
#  PropertyEditor  –  main editing panel shown to the right of the entry list
# ═══════════════════════════════════════════════════════════════════════════════

class PropertyEditor(QScrollArea):
    """Dynamically builds a form for the currently selected database entry."""

    entry_changed = Signal()  # emitted whenever a field value changes

    def __init__(self, parent: QWidget | None = None):
        super().__init__(parent)
        self._entry: dict | None = None
        self._category: str | None = None
        self._widgets: dict[str, QWidget] = {}

        self.setWidgetResizable(True)
        self.setHorizontalScrollBarPolicy(Qt.ScrollBarPolicy.ScrollBarAlwaysOff)
        self.setObjectName("propertyEditor")

        self._container = QWidget()
        self._container.setStyleSheet("background-color: #111228;")
        self._layout = QVBoxLayout(self._container)
        self._layout.setContentsMargins(20, 16, 20, 16)
        self._layout.setSpacing(6)
        self.setWidget(self._container)

        # Placeholder
        self._placeholder = QLabel("Select an entry to begin editing")
        self._placeholder.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self._placeholder.setStyleSheet(
            "font-size: 15px; color: #55566a; padding: 60px;"
        )
        self._layout.addWidget(self._placeholder)
        self._layout.addStretch()

    # ── Public API ─────────────────────────────────────────────────────────────

    @property
    def current_entry(self) -> dict | None:
        return self._entry

    def load_entry(self, entry: dict, category: str) -> None:
        self._entry = entry
        self._category = category
        self._rebuild()

    def clear(self) -> None:
        self._entry = None
        self._category = None
        self._clear_layout()
        self._placeholder = QLabel("Select an entry to begin editing")
        self._placeholder.setAlignment(Qt.AlignmentFlag.AlignCenter)
        self._placeholder.setStyleSheet(
            "font-size: 15px; color: #55566a; padding: 60px;"
        )
        self._layout.addWidget(self._placeholder)
        self._layout.addStretch()

    # ── Layout helpers ─────────────────────────────────────────────────────────

    def _clear_layout(self) -> None:
        self._widgets.clear()
        while self._layout.count():
            child = self._layout.takeAt(0)
            w = child.widget()
            if w:
                w.setParent(None)
                w.deleteLater()

    def _rebuild(self) -> None:
        self._clear_layout()
        entry = self._entry
        if entry is None:
            return

        # Header
        name = entry.get("name", "")
        eid = entry.get("id", "?")
        header = QLabel(f"#{eid}   {name}")
        header.setObjectName("headerLabel")
        self._layout.addWidget(header)

        # Determine field order
        ordered = FIELD_ORDER.get(self._category, [])
        all_keys = list(entry.keys())
        keys = [k for k in ordered if k in all_keys]
        keys += [k for k in all_keys if k not in keys]

        for key in keys:
            value = entry[key]
            self._add_field(key, value)

        self._layout.addStretch()

    # ── Field factory ──────────────────────────────────────────────────────────

    def _add_field(self, key: str, value: Any) -> None:
        label_text = _field_label(key)
        entry = self._entry

        # ----- read-only -----
        if key in READONLY_FIELDS:
            row = self._make_row(label_text)
            le = QLineEdit(str(value))
            le.setReadOnly(True)
            row.addWidget(le, 1)
            return

        # ----- damage object -----
        if key == "damage" and isinstance(value, dict):
            self._add_damage_group(value)
            return

        # ----- traits / effects -----
        if key == "traits" and isinstance(value, list):
            self._add_list_button(key, label_text, value, TraitsDialog)
            return
        if key == "effects" and isinstance(value, list):
            self._add_list_button(key, label_text, value, EffectsDialog)
            return

        # ----- params (flat 8-element array for enemies / weapons / armors) -----
        if key == "params" and isinstance(value, list) and len(value) == 8 and all(isinstance(v, (int, float)) for v in value):
            self._add_params_group(key, value)
            return

        # ----- equips (small int array) -----
        if key == "equips" and isinstance(value, list):
            self._add_small_int_array(key, label_text, value)
            return

        # ----- expParams (4-element array) -----
        if key == "expParams" and isinstance(value, list):
            self._add_small_int_array(key, label_text, value)
            return

        # ----- complex arrays / objects → JSON editor button -----
        if key in SPECIAL_FIELDS:
            self._add_json_button(key, label_text, value)
            return

        # ----- dropdowns -----
        if key in DROPDOWN_FIELDS:
            options = DROPDOWN_FIELDS[key]
            row = self._make_row(label_text)
            combo = QComboBox()
            for i, opt in enumerate(options):
                combo.addItem(f"{i}: {opt}", i)
            idx = value if isinstance(value, int) and 0 <= value < len(options) else 0
            combo.setCurrentIndex(idx)
            combo.currentIndexChanged.connect(lambda v, k=key: self._set(k, v))
            row.addWidget(combo, 1)
            self._widgets[key] = combo
            return

        # ----- boolean -----
        if isinstance(value, bool):
            row = self._make_row(label_text)
            cb = QCheckBox()
            cb.setChecked(value)
            cb.stateChanged.connect(
                lambda state, k=key: self._set(k, state == Qt.CheckState.Checked.value)
            )
            row.addWidget(cb, 1)
            self._widgets[key] = cb
            return

        # ----- multiline text -----
        if key in MULTILINE_FIELDS:
            self._add_section_label(label_text)
            te = QTextEdit()
            te.setPlainText(str(value) if value else "")
            te.setMaximumHeight(100)
            te.textChanged.connect(
                lambda k=key, w=te: self._set(k, w.toPlainText())
            )
            self._layout.addWidget(te)
            self._widgets[key] = te
            return

        # ----- numbers -----
        if isinstance(value, float):
            row = self._make_row(label_text)
            sb = QDoubleSpinBox()
            sb.setRange(-999999.0, 999999.0)
            sb.setDecimals(4)
            sb.setValue(value)
            sb.valueChanged.connect(lambda v, k=key: self._set(k, v))
            row.addWidget(sb, 1)
            self._widgets[key] = sb
            return

        if isinstance(value, int):
            row = self._make_row(label_text)
            sb = QSpinBox()
            sb.setRange(-999999, 999999)
            sb.setValue(value)
            sb.valueChanged.connect(lambda v, k=key: self._set(k, v))
            row.addWidget(sb, 1)
            self._widgets[key] = sb
            return

        # ----- string -----
        if isinstance(value, str):
            row = self._make_row(label_text)
            le = QLineEdit(value)
            le.textChanged.connect(lambda v, k=key: self._set(k, v))
            row.addWidget(le, 1)
            self._widgets[key] = le
            return

        # ----- generic list / dict → JSON -----
        if isinstance(value, (list, dict)):
            self._add_json_button(key, label_text, value)
            return

        # ----- fallback -----
        row = self._make_row(label_text)
        le = QLineEdit(str(value) if value is not None else "")
        le.setReadOnly(True)
        row.addWidget(le, 1)

    # ── Widget helpers ─────────────────────────────────────────────────────────

    def _make_row(self, label_text: str) -> QHBoxLayout:
        row = QHBoxLayout()
        row.setSpacing(12)
        lbl = QLabel(label_text)
        lbl.setObjectName("fieldLabel")
        lbl.setFixedWidth(160)
        lbl.setAlignment(Qt.AlignmentFlag.AlignRight | Qt.AlignmentFlag.AlignVCenter)
        row.addWidget(lbl)
        self._layout.addLayout(row)
        return row

    def _add_section_label(self, text: str) -> None:
        lbl = QLabel(text.upper())
        lbl.setObjectName("sectionLabel")
        self._layout.addWidget(lbl)

    def _set(self, key: str, value: Any) -> None:
        if self._entry is not None:
            self._entry[key] = value
            self.entry_changed.emit()

    # ── Damage group ───────────────────────────────────────────────────────────

    def _add_damage_group(self, dmg: dict) -> None:
        grp = QGroupBox("Damage")
        form = QFormLayout(grp)
        form.setContentsMargins(12, 18, 12, 12)
        form.setSpacing(8)

        # Type
        type_combo = QComboBox()
        for i, t in enumerate(DAMAGE_TYPES):
            type_combo.addItem(f"{i}: {t}", i)
        type_combo.setCurrentIndex(dmg.get("type", 0))
        type_combo.currentIndexChanged.connect(lambda v: dmg.__setitem__("type", v))
        form.addRow("Type", type_combo)

        # Element
        elem_spin = QSpinBox()
        elem_spin.setRange(-1, 999)
        elem_spin.setValue(dmg.get("elementId", 0))
        elem_spin.valueChanged.connect(lambda v: dmg.__setitem__("elementId", v))
        form.addRow("Element ID", elem_spin)

        # Formula
        formula_edit = QLineEdit(dmg.get("formula", "0"))
        formula_edit.setObjectName("formulaEdit")
        mono = QFont("Cascadia Mono", 13)
        mono.setStyleHint(QFont.StyleHint.Monospace)
        formula_edit.setFont(mono)
        formula_edit.textChanged.connect(lambda v: dmg.__setitem__("formula", v))
        form.addRow("Formula", formula_edit)

        # Variance
        var_spin = QSpinBox()
        var_spin.setRange(0, 100)
        var_spin.setValue(dmg.get("variance", 20))
        var_spin.valueChanged.connect(lambda v: dmg.__setitem__("variance", v))
        form.addRow("Variance %", var_spin)

        # Critical
        crit_cb = QCheckBox()
        crit_cb.setChecked(dmg.get("critical", False))
        crit_cb.stateChanged.connect(
            lambda s: dmg.__setitem__("critical", s == Qt.CheckState.Checked.value)
        )
        form.addRow("Critical", crit_cb)

        self._layout.addWidget(grp)

    # ── Params group (flat 8-int array) ────────────────────────────────────────

    def _add_params_group(self, key: str, params: list) -> None:
        grp = QGroupBox("Base Parameters")
        grid = QVBoxLayout(grp)
        grid.setContentsMargins(12, 18, 12, 12)

        for i, pname in enumerate(PARAM_NAMES):
            row = QHBoxLayout()
            lbl = QLabel(pname)
            lbl.setFixedWidth(100)
            lbl.setObjectName("fieldLabel")
            sb = QSpinBox()
            sb.setRange(-99999, 99999)
            if i < len(params):
                sb.setValue(params[i])
            sb.valueChanged.connect(
                lambda v, idx=i: self._set_array_element(params, idx, v)
            )
            row.addWidget(lbl)
            row.addWidget(sb, 1)
            grid.addLayout(row)

        self._layout.addWidget(grp)

    def _set_array_element(self, arr: list, idx: int, value: Any) -> None:
        if 0 <= idx < len(arr):
            arr[idx] = value
            self.entry_changed.emit()

    # ── Small int-array (equips, expParams) ────────────────────────────────────

    def _add_small_int_array(self, key: str, label: str, arr: list) -> None:
        grp = QGroupBox(label)
        lay = QHBoxLayout(grp)
        lay.setContentsMargins(12, 18, 12, 12)

        for i, v in enumerate(arr):
            sb = QSpinBox()
            sb.setRange(-9999, 9999)
            sb.setValue(v if isinstance(v, int) else 0)
            sb.valueChanged.connect(
                lambda val, idx=i: self._set_array_element(arr, idx, val)
            )
            lay.addWidget(QLabel(f"[{i}]"))
            lay.addWidget(sb)

        self._layout.addWidget(grp)

    # ── Traits / Effects button ────────────────────────────────────────────────

    def _add_list_button(self, key: str, label: str, arr: list,
                         dialog_cls: type) -> None:
        row = self._make_row(label)
        btn = QPushButton(f"Edit {label} ({len(arr)})")
        btn.setObjectName("toolButton")
        btn.setMinimumWidth(200)
        badge = QLabel(f"  {len(arr)} entries")
        badge.setObjectName("countBadge")

        def _open():
            dlg = dialog_cls(arr, self)
            if dlg.exec() == QDialog.DialogCode.Accepted:
                self._entry[key] = dlg.result_data()
                btn.setText(f"Edit {label} ({len(self._entry[key])})")
                badge.setText(f"  {len(self._entry[key])} entries")
                self.entry_changed.emit()

        btn.clicked.connect(_open)
        row.addWidget(btn)
        row.addWidget(badge)
        row.addStretch()

    # ── Generic JSON editor button ─────────────────────────────────────────────

    def _add_json_button(self, key: str, label: str, value: Any) -> None:
        row = self._make_row(label)
        btn = QPushButton(f"Edit JSON ({type(value).__name__})")
        btn.setObjectName("toolButton")
        btn.setMinimumWidth(200)

        type_hint = ""
        if isinstance(value, list):
            type_hint = f"  {len(value)} items"
        elif isinstance(value, dict):
            type_hint = f"  {len(value)} keys"

        badge = QLabel(type_hint)
        badge.setObjectName("countBadge")

        def _open():
            dlg = JsonEditorDialog(key, value, self)
            if dlg.exec() == QDialog.DialogCode.Accepted:
                self._entry[key] = dlg.result_data()
                self.entry_changed.emit()

        btn.clicked.connect(_open)
        row.addWidget(btn)
        if type_hint:
            row.addWidget(badge)
        row.addStretch()


# ═══════════════════════════════════════════════════════════════════════════════
#  TraitsDialog
# ═══════════════════════════════════════════════════════════════════════════════

class TraitsDialog(QDialog):
    """Editable table for the ``traits`` array."""

    def __init__(self, traits: list[dict], parent: QWidget | None = None):
        super().__init__(parent)
        self.setWindowTitle("Edit Traits")
        self.setMinimumSize(700, 500)
        self._data = copy.deepcopy(traits)

        lay = QVBoxLayout(self)

        # Table
        self._table = QTableWidget(len(self._data), 4)
        self._table.setHorizontalHeaderLabels(["Code", "Type", "Data ID", "Value"])
        self._table.horizontalHeader().setSectionResizeMode(
            1, QHeaderView.ResizeMode.Stretch
        )
        self._table.setSelectionBehavior(
            QTableWidget.SelectionBehavior.SelectRows
        )
        self._populate()
        lay.addWidget(self._table)

        # Buttons
        btn_row = QHBoxLayout()
        add_btn = QPushButton("+ Add Trait")
        add_btn.clicked.connect(self._add)
        edit_btn = QPushButton("Edit Selected")
        edit_btn.clicked.connect(self._edit_selected)
        del_btn = QPushButton("Remove Selected")
        del_btn.setObjectName("dangerButton")
        del_btn.clicked.connect(self._remove)

        btn_row.addWidget(add_btn)
        btn_row.addWidget(edit_btn)
        btn_row.addWidget(del_btn)
        btn_row.addStretch()

        ok_btn = QPushButton("OK")
        ok_btn.setObjectName("accentButton")
        ok_btn.clicked.connect(self.accept)
        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)
        btn_row.addWidget(cancel_btn)
        btn_row.addWidget(ok_btn)

        lay.addLayout(btn_row)

    def result_data(self) -> list[dict]:
        return self._data

    def _populate(self) -> None:
        self._table.setRowCount(len(self._data))
        for row, trait in enumerate(self._data):
            code = trait.get("code", 0)
            self._table.setItem(row, 0, QTableWidgetItem(str(code)))
            self._table.setItem(
                row, 1, QTableWidgetItem(TRAIT_CODES.get(code, f"Unknown ({code})"))
            )
            self._table.setItem(row, 2, QTableWidgetItem(str(trait.get("dataId", 0))))
            self._table.setItem(row, 3, QTableWidgetItem(str(trait.get("value", 0))))

    def _add(self) -> None:
        dlg = _TraitEditDialog(parent=self)
        if dlg.exec() == QDialog.DialogCode.Accepted:
            self._data.append(dlg.get_trait())
            self._populate()

    def _edit_selected(self) -> None:
        row = self._table.currentRow()
        if 0 <= row < len(self._data):
            dlg = _TraitEditDialog(self._data[row], self)
            if dlg.exec() == QDialog.DialogCode.Accepted:
                self._data[row] = dlg.get_trait()
                self._populate()

    def _remove(self) -> None:
        row = self._table.currentRow()
        if 0 <= row < len(self._data):
            self._data.pop(row)
            self._populate()


class _TraitEditDialog(QDialog):
    """Small form for editing a single trait."""

    def __init__(self, trait: dict | None = None, parent: QWidget | None = None):
        super().__init__(parent)
        self.setWindowTitle("Trait")
        self.setMinimumWidth(400)

        lay = QFormLayout(self)

        self._code_combo = QComboBox()
        for code, name in TRAIT_CODE_LIST:
            self._code_combo.addItem(f"{code}: {name}", code)
        lay.addRow("Code", self._code_combo)

        self._data_spin = QSpinBox()
        self._data_spin.setRange(0, 9999)
        lay.addRow("Data ID", self._data_spin)

        self._value_spin = QDoubleSpinBox()
        self._value_spin.setRange(-9999.0, 9999.0)
        self._value_spin.setDecimals(4)
        self._value_spin.setValue(1.0)
        lay.addRow("Value", self._value_spin)

        if trait:
            code = trait.get("code", 11)
            idx = next(
                (i for i, (c, _) in enumerate(TRAIT_CODE_LIST) if c == code), 0
            )
            self._code_combo.setCurrentIndex(idx)
            self._data_spin.setValue(trait.get("dataId", 0))
            self._value_spin.setValue(trait.get("value", 0))

        btns = QHBoxLayout()
        ok = QPushButton("OK")
        ok.setObjectName("accentButton")
        ok.clicked.connect(self.accept)
        cancel = QPushButton("Cancel")
        cancel.clicked.connect(self.reject)
        btns.addStretch()
        btns.addWidget(cancel)
        btns.addWidget(ok)
        lay.addRow(btns)

    def get_trait(self) -> dict:
        return {
            "code": self._code_combo.currentData(),
            "dataId": self._data_spin.value(),
            "value": self._value_spin.value(),
        }


# ═══════════════════════════════════════════════════════════════════════════════
#  EffectsDialog
# ═══════════════════════════════════════════════════════════════════════════════

class EffectsDialog(QDialog):
    """Editable table for the ``effects`` array."""

    def __init__(self, effects: list[dict], parent: QWidget | None = None):
        super().__init__(parent)
        self.setWindowTitle("Edit Effects")
        self.setMinimumSize(750, 500)
        self._data = copy.deepcopy(effects)

        lay = QVBoxLayout(self)

        self._table = QTableWidget(len(self._data), 5)
        self._table.setHorizontalHeaderLabels(
            ["Code", "Type", "Data ID", "Value 1", "Value 2"]
        )
        self._table.horizontalHeader().setSectionResizeMode(
            1, QHeaderView.ResizeMode.Stretch
        )
        self._table.setSelectionBehavior(
            QTableWidget.SelectionBehavior.SelectRows
        )
        self._populate()
        lay.addWidget(self._table)

        btn_row = QHBoxLayout()
        add_btn = QPushButton("+ Add Effect")
        add_btn.clicked.connect(self._add)
        edit_btn = QPushButton("Edit Selected")
        edit_btn.clicked.connect(self._edit_selected)
        del_btn = QPushButton("Remove Selected")
        del_btn.setObjectName("dangerButton")
        del_btn.clicked.connect(self._remove)

        btn_row.addWidget(add_btn)
        btn_row.addWidget(edit_btn)
        btn_row.addWidget(del_btn)
        btn_row.addStretch()

        ok_btn = QPushButton("OK")
        ok_btn.setObjectName("accentButton")
        ok_btn.clicked.connect(self.accept)
        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)
        btn_row.addWidget(cancel_btn)
        btn_row.addWidget(ok_btn)

        lay.addLayout(btn_row)

    def result_data(self) -> list[dict]:
        return self._data

    def _populate(self) -> None:
        self._table.setRowCount(len(self._data))
        for row, eff in enumerate(self._data):
            code = eff.get("code", 0)
            self._table.setItem(row, 0, QTableWidgetItem(str(code)))
            self._table.setItem(
                row, 1, QTableWidgetItem(EFFECT_CODES.get(code, f"Unknown ({code})"))
            )
            self._table.setItem(row, 2, QTableWidgetItem(str(eff.get("dataId", 0))))
            self._table.setItem(row, 3, QTableWidgetItem(str(eff.get("value1", 0))))
            self._table.setItem(row, 4, QTableWidgetItem(str(eff.get("value2", 0))))

    def _add(self) -> None:
        dlg = _EffectEditDialog(parent=self)
        if dlg.exec() == QDialog.DialogCode.Accepted:
            self._data.append(dlg.get_effect())
            self._populate()

    def _edit_selected(self) -> None:
        row = self._table.currentRow()
        if 0 <= row < len(self._data):
            dlg = _EffectEditDialog(self._data[row], self)
            if dlg.exec() == QDialog.DialogCode.Accepted:
                self._data[row] = dlg.get_effect()
                self._populate()

    def _remove(self) -> None:
        row = self._table.currentRow()
        if 0 <= row < len(self._data):
            self._data.pop(row)
            self._populate()


class _EffectEditDialog(QDialog):
    """Small form for editing a single effect."""

    def __init__(self, effect: dict | None = None, parent: QWidget | None = None):
        super().__init__(parent)
        self.setWindowTitle("Effect")
        self.setMinimumWidth(400)

        lay = QFormLayout(self)

        self._code_combo = QComboBox()
        for code, name in EFFECT_CODE_LIST:
            self._code_combo.addItem(f"{code}: {name}", code)
        lay.addRow("Code", self._code_combo)

        self._data_spin = QSpinBox()
        self._data_spin.setRange(0, 9999)
        lay.addRow("Data ID", self._data_spin)

        self._v1_spin = QDoubleSpinBox()
        self._v1_spin.setRange(-9999.0, 9999.0)
        self._v1_spin.setDecimals(4)
        lay.addRow("Value 1", self._v1_spin)

        self._v2_spin = QDoubleSpinBox()
        self._v2_spin.setRange(-9999.0, 9999.0)
        self._v2_spin.setDecimals(4)
        lay.addRow("Value 2", self._v2_spin)

        if effect:
            code = effect.get("code", 11)
            idx = next(
                (i for i, (c, _) in enumerate(EFFECT_CODE_LIST) if c == code), 0
            )
            self._code_combo.setCurrentIndex(idx)
            self._data_spin.setValue(effect.get("dataId", 0))
            self._v1_spin.setValue(effect.get("value1", 0))
            self._v2_spin.setValue(effect.get("value2", 0))

        btns = QHBoxLayout()
        ok = QPushButton("OK")
        ok.setObjectName("accentButton")
        ok.clicked.connect(self.accept)
        cancel = QPushButton("Cancel")
        cancel.clicked.connect(self.reject)
        btns.addStretch()
        btns.addWidget(cancel)
        btns.addWidget(ok)
        lay.addRow(btns)

    def get_effect(self) -> dict:
        return {
            "code": self._code_combo.currentData(),
            "dataId": self._data_spin.value(),
            "value1": self._v1_spin.value(),
            "value2": self._v2_spin.value(),
        }


# ═══════════════════════════════════════════════════════════════════════════════
#  JsonEditorDialog  – raw JSON editing fallback
# ═══════════════════════════════════════════════════════════════════════════════

class JsonEditorDialog(QDialog):
    """Lets the user edit any value as formatted JSON text."""

    def __init__(self, key: str, value: Any, parent: QWidget | None = None):
        super().__init__(parent)
        self.setWindowTitle(f"Edit JSON — {_field_label(key)}")
        self.setMinimumSize(600, 500)
        self._original = value

        lay = QVBoxLayout(self)

        hint = QLabel(
            "Edit the JSON below. Invalid JSON will not be accepted."
        )
        hint.setStyleSheet("color: #8888a8; font-size: 12px; padding: 4px;")
        lay.addWidget(hint)

        self._editor = QPlainTextEdit()
        mono = QFont("Cascadia Mono", 12)
        mono.setStyleHint(QFont.StyleHint.Monospace)
        self._editor.setFont(mono)
        self._editor.setPlainText(json.dumps(value, indent=2, ensure_ascii=False))
        lay.addWidget(self._editor)

        btns = QHBoxLayout()
        fmt_btn = QPushButton("Format")
        fmt_btn.clicked.connect(self._format)
        btns.addWidget(fmt_btn)
        btns.addStretch()

        cancel = QPushButton("Cancel")
        cancel.clicked.connect(self.reject)
        ok = QPushButton("Apply")
        ok.setObjectName("accentButton")
        ok.clicked.connect(self._apply)
        btns.addWidget(cancel)
        btns.addWidget(ok)
        lay.addLayout(btns)

    def result_data(self) -> Any:
        return self._result

    def _format(self) -> None:
        try:
            data = json.loads(self._editor.toPlainText())
            self._editor.setPlainText(json.dumps(data, indent=2, ensure_ascii=False))
        except json.JSONDecodeError:
            pass  # leave as-is

    def _apply(self) -> None:
        try:
            self._result = json.loads(self._editor.toPlainText())
            self.accept()
        except json.JSONDecodeError as exc:
            QMessageBox.warning(self, "Invalid JSON", str(exc))
