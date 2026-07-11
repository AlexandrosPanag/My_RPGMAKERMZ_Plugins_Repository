# DevToolsManage.js - Enhanced Edition

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-2.3.0-orange)

A powerful development support plugin for RPG Maker MZ that supercharges your workflow with modern features, performance monitoring, and quality-of-life improvements.

> **Original Author:** [Triacontane](https://github.com/triacontane/)
> **Enhanced by:** Alexandros Panagiotakopoulos

---

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Menu Commands](#-menu-commands)
- [Console Commands](#-console-commands)
- [Advanced Features](#-advanced-features)
- [Troubleshooting](#-troubleshooting)
- [Changelog](#-changelog)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Features (Original)
- ✅ **Auto DevTools Launch** - Developer tools open automatically on game start
- ✅ **Always On Top** - Keep game window in foreground while editing
- ✅ **Hot Reload** - Automatically reload maps and database when files change
- ✅ **Title Skip** - Jump straight to game or load latest save
- ✅ **Speed Control** - Speed up or slow down gameplay (1/16x to 16x speed)
- ✅ **Battle Shortcuts** - Instant win/lose/abort battle commands
- ✅ **Resident Scripts** - Execute custom scripts on every frame
- ✅ **FPS Display** - Show FPS/MS counter

### Enhanced Edition Features (v1.3.0+)
- 🆕 **Auto-Backup System** - Automatic project backups on save
- 🆕 **Memory Monitor** - Real-time memory usage display
- 🆕 **Screenshot Hotkey** - Quick screenshot capture with timestamp
- 🆕 **Manual Backup** - Create instant backups via hotkey
- 🆕 **SourceMap Error Suppression** - Eliminates annoying Chrome DevTools warnings
- 🆕 **Styled Console** - Beautiful, color-coded console output
- 🆕 **Cross-Platform Support** - Improved Linux/Mac compatibility
- 🆕 **Modern NW.js API** - Updated for latest NW.js features
- 🆕 **Complete English Translation** - Full UI in English

### v2.x Additions
- 🆕 **DevConsole Command System** - Full suite of in-console debug commands (`help()`, `tp()`, `gold()`, etc.)
- 🆕 **God Mode** - Toggle invincibility for party members
- 🆕 **Noclip** - Walk through walls toggle
- 🆕 **Command History** - Track recently used console commands
- 🆕 **NW.js Path Fallbacks** - Robust project path detection across all environments
- 🆕 **WebGL Error Suppression** - Suppresses common PIXI.js/WebGL noise in DevTools

### v2.3.0 (Latest)
- 🧹 **Dead Code Removal** - Eliminated ~300 lines of unused/duplicate code for faster parse times
- 🆕 **`vars()`** - Dump all non-zero game variables with names, filterable
- 🆕 **`switches()`** - Dump all ON switches with names, filterable
- 🆕 **`party()`** - Compact party HP/MP/level/state overview in console
- ⚡ **Shared Screenshot Helper** - `window.screenshot` and the hotkey shortcut no longer duplicate logic
- ⚡ **Method Compression** - ~40 single-body methods collapsed, leaner AST = faster load

---

## 📦 Installation

### Method 1: Direct Download
1. Download `DevToolsManage.js` from this repository
2. Place it in your project's `js/plugins/` folder
3. Open RPG Maker MZ Plugin Manager
4. Add the plugin and ensure it loads **after** `PluginCommonBase`

### Method 2: Git Clone
```bash
cd your-rpgmaker-project/js/plugins/
git clone https://github.com/AlexandrosPanag/DevToolsManage-Enhanced.git
```

### Dependencies
- **Required:** `PluginCommonBase.js` (standard MZ plugin)
- **Recommended:** NW.js environment (desktop deployment)

---

## 🚀 Quick Start

### Basic Setup
1. Install the plugin
2. Enable in Plugin Manager
3. Set `StartupDevTool` to `true` (default)
4. Start test play — DevTools will open automatically!

### Recommended Settings for Development
```
StartupDevTool:      true
CutTitle:            2  (Load Latest Save)
RapidStart:          false
ShowFPS:             OFF
MenuBarVisible:      true
AutoBackup:          true
MaxBackups:          5
UseReloadData:       true
```

### First Launch Tips
- Press **F8** to toggle DevTools manually
- Middle-click (or right-click) anywhere for the quick debug menu
- Open the DevTools console and type `help()` to see all available commands
- Check the console for color-coded startup info on boot

---

## ⚙️ Configuration

### Plugin Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| **StartupDevTool** | Boolean | `true` | Open DevTools on game start |
| **ShowFPS** | Select | `OFF` | Display FPS counter (FPS/MS/OFF) |
| **CutTitle** | Select | `0` | Skip title screen (0=Off, 1=New Game, 2=Load Latest) |
| **RapidStart** | Boolean | `false` | Start game in fast mode |
| **RapidSpeed** | Number | `2` | Fast mode multiplier (max 16x) |
| **SlowSpeed** | Number | `2` | Slow mode divisor (max 1/16x) |
| **InvalidMessageSkip** | Boolean | `false` | Disable auto-skip messages in fast mode |
| **MenuBarVisible** | Boolean | `true` | Show menu bar with debug commands |
| **ClickMenu** | Select | `1` | Context menu button (-1=Off, 0=Left, 1=Middle, 2=Right) |
| **StartupOnTop** | Boolean | `false` | Lock window on top at startup |
| **UseReloadData** | Boolean | `true` | Auto-reload maps/database on focus |
| **AutoBackup** | Boolean | `true` | Create backups on data reload |
| **MaxBackups** | Number | `5` | Max backup files to keep (0=unlimited) |
| **ShowMemoryUsage** | Boolean | `false` | Display memory usage in overlay |

---

## ⌨️ Keyboard Shortcuts

### Configurable Shortcuts
Assign any of these commands to F1–F12 with optional Alt/Ctrl modifiers:

| Command | Description |
|---------|-------------|
| **AlwaysOnTop** | Toggle window always-on-top |
| **Freeze** | Pause/unpause game |
| **ToggleRapid** | Toggle fast mode (2–16x speed) |
| **ToggleSlow** | Toggle slow mode (1/2–1/16x speed) |
| **ExecuteScript** | Run a custom script every frame |
| **ForceVictory** | Instantly win current battle |
| **ForceDefeat** | Instantly lose current battle |
| **ForceAbort** | Escape from current battle |
| **OpenProject** | Open project folder in file explorer |
| **Screenshot** | Save screenshot to `/screenshots/` |
| **Backup** | Create manual backup to `/backups/` |

### Example Configuration
```javascript
ShortcutList: [
  { Command: "ToggleRapid",  HotKey: "F1",  Alt: false, Ctrl: false },
  { Command: "ForceVictory", HotKey: "F10", Alt: true,  Ctrl: false },
  { Command: "Screenshot",   HotKey: "F9",  Alt: false, Ctrl: false }
]
```

---

## 📱 Menu Commands

### Context Menu
When `ClickMenu` is configured, click anywhere to access:

- ✓ Always on Top (checkbox)
- ✓ Fast Mode (checkbox)
- ✓ Slow Mode (checkbox)
- ✓ Freeze Screen (checkbox)
- Force Victory
- Force Defeat
- Abort Battle
- Resident Script
- Open Project
- Screenshot
- Create Backup

---

## 🖥️ Console Commands

Type these directly into the DevTools console during test play. Type `help()` to see the full list at any time.

### Player
| Command | Description |
|---------|-------------|
| `tp(x, y)` | Teleport to position on current map |
| `tp(mapId, x, y)` | Teleport to position on a different map |
| `heal()` | Fully restore HP/MP for all party members |
| `god()` | Toggle invincibility (party takes no damage) |
| `noclip()` | Toggle walk-through-walls |
| `speed(n)` | Set player move speed (1–6) |

### Items & Currency
| Command | Description |
|---------|-------------|
| `gold(amount)` | Add or remove gold (negative to remove) |
| `item(id, amount)` | Give item by ID (omit ID to list available) |
| `weapon(id, amount)` | Give weapon by ID |
| `armor(id, amount)` | Give armor by ID |
| `allitems()` | Give 99 of every item in the database |

### Party
| Command | Description |
|---------|-------------|
| `addactor(id)` | Add actor to party |
| `removeactor(id)` | Remove actor from party |
| `level(n)` | Set all party members to level n |
| `exp(amount)` | Add EXP to all party members |
| `party()` | Show HP/MP/level/states for all members + gold |

### Game State
| Command | Description |
|---------|-------------|
| `save(slot)` | Save game to slot |
| `load(slot)` | Load game from slot |
| `sw(id)` | Toggle a game switch |
| `sw(id, true/false)` | Set a switch to a specific value |
| `vari(id)` | Read a game variable |
| `vari(id, value)` | Set a game variable |
| `event(id)` | Start an event by ID (omit to list all) |

### Debug & Inspect
| Command | Description |
|---------|-------------|
| `vars()` | Dump all non-zero variables with names |
| `vars("term")` | Filter variable dump by name |
| `switches()` | Dump all ON switches with names |
| `switches("term")` | Filter switch dump by name |
| `coords()` | Show player map ID, position, and direction |
| `mapinfo()` | Show full map info (size, tileset, BGM, events) |
| `fps()` | Toggle the FPS counter |
| `reload()` | Reload the game |

### Battle
| Command | Description |
|---------|-------------|
| `encounter(troopId)` | Start a battle with a specific troop |
| `win()` | Force win the current battle |
| `flee()` | Force escape the current battle |

### Utility
| Command | Description |
|---------|-------------|
| `help()` | Show full command list |
| `help("cmd")` | Show help for a specific command |
| `screenshot()` | Take a screenshot (also: `ss()`, `capture()`) |
| `history()` | Show recent command history |
| `cls()` | Clear the console |

---

## 🔧 Advanced Features

### Auto-Reload System
When you edit maps or events in the editor:
1. Save your changes in RPG Maker MZ
2. Click back to the game window
3. Plugin detects the version change automatically
4. Map and database reload instantly
5. Backup is created automatically (if `AutoBackup` is enabled)

Player position and game state are preserved across reloads.

### Backup System
```
your-project/
└── backups/
    ├── backup_2026-07-11T10-30-00/
    │   └── data/
    ├── backup_2026-07-11T11-45-00/
    │   └── data/
    └── backup_2026-07-11T14-20-00/
        └── data/
```

Backups are timestamped and automatically pruned to the `MaxBackups` limit. Manual backups can be triggered via hotkey at any time.

### Screenshot System
```
your-project/
└── screenshots/
    ├── screenshot_2026-07-11T10-30-45.png
    └── screenshot_2026-07-11T14-05-09.png
```

PNG format, full resolution, timestamped. Works via hotkey or `screenshot()` / `ss()` in the console.

### Resident Scripts
Run any JavaScript expression on every frame and monitor when its value changes:

1. Trigger the **Resident Script** command
2. Enter an expression, e.g. `$gameParty.gold()`
3. Console only prints when the return value changes
4. Trigger again to stop

```javascript
// Examples
`X:${$gamePlayer.x} Y:${$gamePlayer.y}`   // live position
$gameVariables.value(10)                    // watch a variable
$gameSwitches.value(5) ? 'ON' : 'OFF'      // watch a switch
```

### Memory Monitoring
Enable `ShowMemoryUsage` to show real-time heap info in the on-screen overlay:
```
Always on top [ON] Rapid [ON] | Mem: 87/512MB
```

---

## 🐛 Troubleshooting

### Plugin Not Working
- Ensure `PluginCommonBase` loads **before** this plugin
- Only active during **test play** — not normal play or deployed builds
- Verify you are running in an NW.js environment (desktop, not browser)

### Auto-Reload Not Working
- Ensure `UseReloadData` is `true`
- Click back into the game window after saving in the editor
- Check for conflicts with other map-related plugins

### DevTools SourceMap Warnings
Suppressed automatically since v1.3.0. If they still appear, open DevTools Settings (F1) and uncheck both SourceMap options under Preferences.

### Backup Files Too Large
- Lower `MaxBackups` (e.g. 3)
- Manually clear old folders from `/backups/`
- Disable `AutoBackup` if not needed

### Memory Usage Not Showing
- Requires NW.js / Chromium environment
- Enable `ShowMemoryUsage` in plugin parameters

---

## 📝 Changelog

### v2.3.0 — 2026/07/11
**Dead Code Removed:**
- Eliminated duplicate `/*:ja` jsdoc block (~200 lines) — RPG Maker MZ ignores it at runtime
- Removed unused `Controller_NwJs` function stub — declared but never implemented or referenced
- Removed empty `_blurHandler` — registered as a window listener with only a placeholder comment inside
- Removed dead `getWindowState()` method — its return value was never read anywhere
- Eliminated duplicate screenshot blob logic — `window.screenshot` and `executeScreenshot` were identical; both now delegate to `DevConsole.takeScreenshot()`

**Code Compression (2166 → 1863 lines):**
- ~40 single-body methods collapsed to one-liners across `SceneManager`, `ShortCutCommand`, and `GameNwWindow`
- All `execute*` delegate methods in `ShortCutCommand` compressed
- `BattleManager.forceVictory/forceDefect/forceAbort` refactored to guard-return style
- `Scene_Base.isAnyWindowActive` simplified with optional chaining
- `DataManager.reloadSystemData` and `findShortCut` switched from `.filter()[0]` to `.find()`
- `Game_Map.restoreEventErase` simplified with optional chaining
- `setInitAlwaysOnTop` / `setInitRapid` converted from if/else to ternary

**New Console Commands:**
- `vars("term")` — dump all non-zero `$gameVariables` with database names; optional filter string
- `switches("term")` — dump all ON `$gameSwitches` with database names; optional filter string
- `party()` — compact party overview showing level, HP, MP, active states, and current gold

### v2.2.0 — 2026/02/07
Fixed `require.main.filename` error with NW.js fallback paths, added `/help` console command system, code optimizations, cached DOM queries.

### v2.1.0 — 2025/11/19
Code modernization: updated to 2025 standards, replaced deprecated Node.js APIs.

### v2.0.1 — 2025/11/15
Memory & performance update: fixed memory leaks, added cleanup methods.

### v1.3.0 — 2025/11/01
Auto-backup system, memory monitoring, screenshot capture, SourceMap suppression, styled console output, modern NW.js API, cross-platform improvements.

### v1.2.2 — 2023/10/07
IDE breakpoint support made optional.

### v1.2.1 — 2023/07/20
Fixed English parameter title cut error.

### v1.2.0 — 2023/01/08
Title cut behavior now configurable (New Game vs Load Latest).

### v1.1.4 — 2022/04/30
Fixed EventRespawn.js region feature compatibility.

### v1.1.3 — 2021/04/10
Disabled incomplete CTRL-hold title cut bypass.

### v1.1.2 — 2021/03/27
Fixed event deletion state not restoring on normal load.

### v1.1.1 — 2020/10/11
Fixed AnimationMv.js battle test conflict.

### v1.1.0 — 2020/09/26
Added Open Project shortcut command.

### v1.0.5 — 2020/09/13
Fixed force victory command.

### v1.0.4 — 2020/08/21
Fixed map auto-reload error.

### v1.0.3 — 2020/08/20
Fixed compatibility with official PluginCommonBase version.

### v1.0.2 — 2020/06/06
Improved English help text.

### v1.0.1 — 2020/04/20
Improved breakpoints.

### v1.0.0 — 2020/04/05
Initial MZ port. Original MV version by Triacontane.

---

## 🤝 Contributing

### Reporting Bugs
1. Check existing issues first
2. Include RPG Maker MZ version and plugin list
3. Provide your plugin configuration
4. Include console error messages
5. Describe steps to reproduce

### Pull Requests
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/MyFeature`)
3. Commit your changes (`git commit -m 'Add MyFeature'`)
4. Push to the branch (`git push origin feature/MyFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

**Original Work:**
Copyright (c) 2020 Triacontane
- Blog: https://triacontane.blogspot.jp/
- GitHub: https://github.com/triacontane/

**Modifications and Enhancements:**
Copyright (c) 2025–2026 Alexandros Panagiotakopoulos
- Website: alexandrospanag.github.io
- GitHub: github.com/AlexandrosPanag

---

## 🙏 Acknowledgments

- **Triacontane** — Original plugin creator
- **RPG Maker MZ Community** — Feedback and testing
- **NW.js Team** — Modern desktop application framework

---

*Last Updated: July 2026*
