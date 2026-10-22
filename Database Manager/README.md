# ⚔️ RPG Maker MZ — Database Manager

<p align="center">
  <b>An advanced desktop tool for editing, reordering, and managing RPG Maker MZ database files.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.10+">
  <img src="https://img.shields.io/badge/Qt-PySide6-41CD52?style=for-the-badge&logo=qt&logoColor=white" alt="PySide6">
  <img src="https://img.shields.io/badge/RPG%20Maker-MZ-ff6600?style=for-the-badge" alt="RPG Maker MZ">
  <img src="https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-ee5522?style=for-the-badge" alt="License">
</p>

---

## 🎯 Why This Tool?

RPG Maker MZ stores its entire database as `.json` files inside the `data/` folder — Actors, Classes, Skills, Items, Weapons, and more. The built-in editor is functional but lacks essential quality-of-life features:

- ❌ No way to **reorder** entries without manual JSON editing
- ❌ No **cut / copy / paste** between entries
- ❌ No **search** across large databases
- ❌ No **bulk editing** or quick duplication
- ❌ Editing damage formulas and traits is cumbersome

**Database Manager** fixes all of that with a clean, modern desktop UI.

---

## ✨ Features

### 📂 Project Management
- Browse to any RPG Maker MZ project's `data/` folder
- Remembers your last-used project path
- One-click **timestamped backups** of the entire data folder
- Reload from disk at any time

### 🗂️ Full Database Coverage
Navigate all 12 core database categories via the sidebar:

| | | |
|---|---|---|
| 👤 Actors | ⚔️ Classes | ✨ Skills |
| 🧪 Items | 🗡️ Weapons | 🛡️ Armors |
| 👹 Enemies | 🦹 Troops | 💫 States |
| 🎬 Animations | 🗺️ Tilesets | 📜 Common Events |

### 🔍 Search & Filter
Type in the search bar to instantly filter entries by ID or name.

### ✂️ Array Manipulation
| Action | Shortcut | Description |
|---|---|---|
| **Cut** | `Ctrl+X` | Copy entry to clipboard and delete it |
| **Copy** | `Ctrl+C` | Copy entry to clipboard |
| **Paste** | `Ctrl+V` | Paste clipboard as a new entry at the end |
| **Duplicate** | `Ctrl+D` | Clone the selected entry |
| **Delete** | `Delete` | Remove entry (sets slot to `null`) |
| **Move Up** | `Ctrl+↑` | Swap with the entry above |
| **Move Down** | `Ctrl+↓` | Swap with the entry below |

IDs are automatically updated when entries are reordered.

### 🛠️ Deep Property Editing
When you select an entry, every field becomes editable:

- **Text fields** — names, descriptions, nicknames, profiles, messages
- **Number spinners** — stats, costs, IDs, levels
- **Checkboxes** — consumable, critical, boolean flags
- **Dropdowns** — scope, hit type, occasion, restriction, auto-removal timing
- **Base Parameters grid** — Max HP, Max MP, Attack, Defense, M.Attack, M.Defense, Agility, Luck

### ⚡ Damage Formula Editor
A dedicated monospace text field for editing damage formulas, plus:
- Damage type dropdown (HP Damage, MP Drain, etc.)
- Element ID selector
- Variance percentage
- Critical hit toggle

### 📋 Traits & Effects Editors
Full table-based dialogs for managing:
- **Traits** — Element Rate, Parameters, Ex-Parameters, Sp-Parameters, Attack Element, Equip types, Special Flags, Party Abilities, and more
- **Effects** — Recover HP/MP, Gain TP, Add/Remove States, Buffs/Debuffs, Grow, Learn Skill, Common Event

Each dialog supports **Add**, **Edit Selected**, and **Remove Selected** operations.

### 📝 JSON Fallback Editor
For complex nested data (event command lists, troop pages, tileset flags, etc.), a raw JSON editor with syntax highlighting and format button ensures nothing is inaccessible.

### 💾 Safe Saving
- Changes are held **in memory** until you explicitly save
- **Unsaved changes indicator** warns you which categories have been modified
- **Exit guard** prompts you to save before closing
- Writes **compact JSON** matching RPG Maker MZ's native format
- **Null sentinel at index 0** is always preserved

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+** — [Download](https://www.python.org/downloads/)
  - ⚠️ Check **"Add Python to PATH"** during installation

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/rpgmz-database-manager.git
cd rpgmz-database-manager

# Install dependencies
pip install -r requirements.txt
```

### Run

```bash
python main.py
```

The startup dialog will appear — browse to your RPG Maker MZ project's `data/` folder and click **Open Project**.

---

## 📁 Project Structure

```
rpgmz-database-manager/
├── main.py              # Entry point, startup dialog, main window, menus
├── database.py          # Database I/O, CRUD, clipboard, reorder, backup
├── editors.py           # Dynamic property editor, traits/effects/JSON dialogs
├── constants.py         # RPG Maker MZ enums, field labels, QSS stylesheet
├── test_db.py           # Smoke test for database operations
├── requirements.txt     # Python dependencies (PySide6)
├── sample_data/         # Sample JSON files for testing
│   ├── Actors.json
│   ├── Skills.json
│   └── Items.json
├── README.md            # This file
└── LICENSE              # CC BY-NC-SA 4.0
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + O` | Open a different project |
| `Ctrl + S` | Save all changes to disk |
| `Ctrl + N` | Add a new entry |
| `Ctrl + D` | Duplicate selected entry |
| `Ctrl + X` | Cut entry |
| `Ctrl + C` | Copy entry to clipboard |
| `Ctrl + V` | Paste entry from clipboard |
| `Ctrl + ↑` | Move entry up |
| `Ctrl + ↓` | Move entry down |
| `Delete` | Delete selected entry |

---

## 📸 Screenshots

> *Coming soon — contributions welcome!*

---

## ⚠️ Important Notes

- **Always create a backup** before your first save → `File → Create Backup`
- The tool writes **compact JSON** (no indentation) — this is the format RPG Maker MZ expects
- The `null` entry at array index 0 is **never removed** — RPG Maker MZ requires it
- Deleting an entry sets its slot to `null` rather than shifting all subsequent indices, preserving references in maps and events
- The tool does **not** modify `System.json` or `Map*.json` files

---

## 🤝 Contributing

Contributions are welcome! Here are some ideas:

- [ ] Undo / Redo support
- [ ] Drag-and-drop reordering in the entry list
- [ ] Icon preview for `iconIndex` fields
- [ ] Cross-referencing (show which skills a class learns, which enemies drop an item, etc.)
- [ ] Dark / Light theme toggle
- [ ] Export / Import individual entries as JSON snippets
- [ ] Batch operations (rename, stat scaling, etc.)

Please open an issue first to discuss any major changes.

---

## 📄 License

This work is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License**.

[![CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**You are free to:**
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material

**Under the following terms:**
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made
- **NonCommercial** — You may not use the material for commercial purposes
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license

© 2026-2027 Alexandros Panagiotakopoulos

---

## 🙏 Acknowledgments

- Built with [PySide6](https://doc.qt.io/qtforpython-6/) (Qt for Python)
- Designed for [RPG Maker MZ](https://www.rpgmakerweb.com/products/rpg-maker-mz) by Gotcha Gotcha Games / KADOKAWA
- RPG Maker is a trademark of Gotcha Gotcha Games / KADOKAWA CORPORATION
