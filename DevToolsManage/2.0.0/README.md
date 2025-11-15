# DevToolsManage.js - Enhanced Edition

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Version](https://img.shields.io/badge/version-2.0.0-orange)

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

### New Features (Enhanced Edition v1.3.0)
- 🆕 **Auto-Backup System** - Automatic project backups on save
- 🆕 **Memory Monitor** - Real-time memory usage display
- 🆕 **Screenshot Hotkey** - Quick screenshot capture with timestamp
- 🆕 **Manual Backup** - Create instant backups via hotkey
- 🆕 **SourceMap Error Fix** - Eliminates annoying Chrome DevTools warnings
- 🆕 **Styled Console** - Beautiful, color-coded console output
- 🆕 **Cross-Platform Support** - Improved Linux/Mac compatibility
- 🆕 **Modern NW.js API** - Updated for latest NW.js features
- 🆕 **Complete English Translation** - Full UI in English

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
git clone https://github.com/[your-username]/DevToolsManage-Enhanced.git
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
4. Start test play - DevTools will open automatically!

### Recommended Settings for Beginners
```javascript
StartupDevTool: true
CutTitle: "Load Latest Save" (option 2)
RapidStart: false
ShowFPS: OFF
MenuBarVisible: true
AutoBackup: true
MaxBackups: 5
```

### First Launch Tips
- Press **F5** to reload without restarting
- Press **F8** to toggle DevTools (if auto-start is off)
- Right-click (or middle-click) anywhere for quick menu
- Check console for helpful colored startup info

---

## ⚙️ Configuration

### Plugin Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| **StartupDevTool** | Boolean | `true` | Open DevTools on game start |
| **ShowFPS** | Select | `OFF` | Display FPS counter (FPS/MS/OFF) |
| **CutTitle** | Select | `0` | Skip title screen (0=Off, 1=New Game, 2=Load) |
| **RapidStart** | Boolean | `false` | Start game in fast mode |
| **RapidSpeed** | Number | `2` | Fast mode multiplier (1-16x) |
| **SlowSpeed** | Number | `2` | Slow mode divisor (1/2 - 1/16x) |
| **InvalidMessageSkip** | Boolean | `false` | Disable auto-skip messages in fast mode |
| **MenuBarVisible** | Boolean | `true` | Show menu bar with debug commands |
| **ClickMenu** | Select | `1` | Context menu button (-1=Off, 0=Left, 1=Middle, 2=Right) |
| **StartupOnTop** | Boolean | `false` | Lock window on top at startup |
| **UseReloadData** | Boolean | `true` | Auto-reload maps/database on focus |
| **UseBreakPoint** | Boolean | `false` | Fix for IDE breakpoint key issues |
| **AutoBackup** 🆕 | Boolean | `true` | Create backups on data reload |
| **MaxBackups** 🆕 | Number | `5` | Max backup files to keep (0=unlimited) |
| **ShowMemoryUsage** 🆕 | Boolean | `false` | Display memory usage in overlay |
| **EnableHotReload** 🆕 | Boolean | `false` | Experimental plugin hot-reload |

---

## ⌨️ Keyboard Shortcuts

### Configurable Shortcuts
You can assign any of these commands to F1-F12 (with optional Alt/Ctrl modifiers):

| Command | Default | Description |
|---------|---------|-------------|
| **AlwaysOnTop** | - | Toggle window always-on-top |
| **Freeze** | - | Pause/unpause game |
| **ToggleRapid** | - | Toggle fast mode (2-16x speed) |
| **ToggleSlow** | - | Toggle slow mode (1/2 - 1/16x speed) |
| **ExecuteScript** | - | Run custom script every frame |
| **ForceVictory** | - | Instantly win current battle |
| **ForceDefeat** | - | Instantly lose current battle |
| **ForceAbort** | - | Escape from current battle |
| **OpenProject** | - | Open project folder in file explorer |
| **Screenshot** 🆕 | - | Save screenshot to `/screenshots` folder |
| **Backup** 🆕 | - | Create manual backup to `/backups` folder |

### Example Configuration
```javascript
ShortcutList: [
  {
    Command: "ToggleRapid",
    HotKey: "F1",
    Alt: false,
    Ctrl: false
  },
  {
    Command: "Screenshot",
    HotKey: "F9",
    Alt: false,
    Ctrl: false
  },
  {
    Command: "ForceVictory",
    HotKey: "F10",
    Alt: true,
    Ctrl: false
  }
]
```

### Built-in Shortcuts
| Key | Function |
|-----|----------|
| **F5** | Reload page |
| **F8** | Toggle DevTools |
| **F12** | Open DevTools (alternate) |

---

## 📱 Menu Commands

### Menu Bar (Top of Window)
When `MenuBarVisible` is enabled, access all commands from the menu bar.

### Context Menu (Right-Click)
When `ClickMenu` is configured, right-click anywhere to access:
- ✓ Always on Top (checkbox)
- ✓ Fast Mode (checkbox)
- ✓ Slow Mode (checkbox)
- ✓ Freeze Screen (checkbox)
- Force Victory
- Force Defeat
- Abort Battle
- Resident Script
- Open Project
- Screenshot 🆕
- Create Backup 🆕

---

## 🔧 Advanced Features

### Auto-Reload System
When you edit maps or events in the editor:
1. Save your changes in RPG Maker MZ
2. Click back to the game window
3. Plugin automatically detects changes
4. Map and database reload instantly
5. Backup created automatically (if enabled)

**Note:** Your player position and game state are preserved!

### Backup System 🆕
```
your-project/
├── backups/
│   ├── backup_2025-01-15T10-30-00/
│   │   └── data/
│   ├── backup_2025-01-15T11-45-00/
│   │   └── data/
│   └── backup_2025-01-15T14-20-00/
│       └── data/
```

- Backups created on data reload (if `AutoBackup` is enabled)
- Timestamped folders for easy identification
- Automatic cleanup of old backups (keeps latest N backups)
- Manual backup via hotkey anytime

### Screenshot System 🆕
```
your-project/
├── screenshots/
│   ├── screenshot_2025-01-15T10-30-45.png
│   ├── screenshot_2025-01-15T11-22-13.png
│   └── screenshot_2025-01-15T14-05-09.png
```

- PNG format with transparency
- Timestamp in filename
- No resolution loss
- Perfect for documentation or bug reports

### Resident Scripts
Execute custom code every frame and monitor output:

1. Trigger the "Resident Script" command
2. Enter JavaScript code (example: `$gameParty.gold()`)
3. Console shows output only when value changes
4. Press command again to stop

**Example Uses:**
```javascript
// Monitor player position
`X:${$gamePlayer.x} Y:${$gamePlayer.y}`

// Watch variable
$gameVariables.value(10)

// Check switch states
$gameSwitches.value(5) ? "ON" : "OFF"
```

### Memory Monitoring 🆕
Enable `ShowMemoryUsage` to see real-time stats:
```
Always on top [ON] Fast [ON] | Mem: 87/512MB
```

Useful for:
- Detecting memory leaks
- Optimizing heavy scenes
- Performance profiling

### Speed Control Tips
- **Fast Mode:** Great for testing long cutscenes
- **Slow Mode:** Perfect for debugging timing-sensitive events
- **Freeze:** Pause to inspect exact game state
- Speed resets to normal during menu selection

---

## 🐛 Troubleshooting

### Common Issues

#### "DevTools failed to load SourceMap" Error
**Fixed in v1.3.0!** The enhanced edition automatically suppresses these warnings.

If you still see them:
1. Open DevTools Settings (F1 or gear icon)
2. Uncheck "Enable JavaScript source maps"
3. Uncheck "Enable CSS source maps"

#### Plugin Not Working
- ✅ Ensure `PluginCommonBase` is loaded **before** this plugin
- ✅ Check you're running in **test play** mode (not normal play)
- ✅ Verify NW.js environment (desktop, not browser)
- ✅ Check console for error messages

#### Auto-Reload Not Working
- ✅ Ensure `UseReloadData` is `true`
- ✅ Make sure you're clicking back to the game window after saving
- ✅ Check for conflicts with other map-related plugins
- ✅ Try disabling and re-enabling the feature

#### Backup Files Too Large
- Reduce `MaxBackups` to lower number (e.g., 3)
- Manually delete old backups from `/backups/` folder
- Consider disabling `AutoBackup` if not needed

#### Memory Usage Not Showing
- Only works in Chromium-based environments (NW.js)
- Enable `ShowMemoryUsage` parameter
- May not work in older NW.js versions

### Performance Tips
1. Disable `ShowMemoryUsage` if you don't need it
2. Set reasonable `MaxBackups` limit (5-10)
3. Disable `EnableHotReload` unless actively developing plugins
4. Use fast mode sparingly (high speeds can cause timing issues)

---

## 📝 Changelog

### v1.3.0 (2025-01-XX) - Enhanced Edition
**New Features:**
- 🆕 Auto-backup system with configurable limits
- 🆕 Memory usage monitoring and display
- 🆕 Screenshot capture with hotkey support
- 🆕 Manual backup command
- 🆕 SourceMap error suppression
- 🆕 Styled console output with colors
- 🆕 Complete English translations
- 🆕 Modern NW.js API implementation
- 🆕 Improved cross-platform compatibility (Linux/Mac)

**Improvements:**
- 🔧 Better error handling for file operations
- 🔧 Enhanced window state management
- 🔧 More robust focus detection
- 🔧 Cleaner code structure and documentation

**Bug Fixes:**
- 🐛 Fixed Chrome DevTools SourceMap warnings
- 🐛 Improved clipboard operations reliability

### v1.2.2 (2023-10-07)
- IDE breakpoint support made optional

### v1.2.1 (2023-07-20)
- Fixed English parameter title cut error

### v1.2.0 (2023-01-08)
- Title cut behavior now configurable (New Game vs Load)

### v1.1.4 (2022-04-30)
- Fixed EventRespawn.js region feature compatibility

### v1.1.3 (2021-04-10)
- Disabled incomplete CTRL-hold title cut bypass

### v1.1.2 (2021-03-27)
- Fixed event deletion state restoration on normal load

### v1.1.1 (2020-10-11)
- Fixed AnimationMv.js battle test conflict

### v1.1.0 (2020-09-26)
- Added Open Project shortcut command

### v1.0.5 (2020-09-13)
- Fixed force victory command

### v1.0.4 (2020-08-21)
- Fixed map auto-reload error

### v1.0.0 (2020-04-05)
- Initial release (ported from MV)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs
1. Check existing issues first
2. Include RPG Maker MZ version
3. Provide plugin configuration
4. Include console error messages
5. Describe steps to reproduce

### Suggesting Features
- Open an issue with `[Feature Request]` tag
- Explain use case and benefits
- Provide examples if possible

### Pull Requests
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Development Setup
```bash
# Clone repository
git clone https://github.com/[your-username]/DevToolsManage-Enhanced.git

# Test in RPG Maker MZ project
cp DevToolsManage.js /path/to/rpgmaker/project/js/plugins/

# Make changes and test thoroughly
```

---

## 📄 License

This project is licensed under the MIT License.

**Original Work:**
- Copyright (c) 2020 Triacontane
- Blog: https://triacontane.blogspot.jp/
- GitHub: https://github.com/triacontane/

**Modifications and Enhancements:**
- Copyright (c) 2025 Alexandros Panagiotakopoulos - alexandrospanag.github.io
- Website: alexandrospanag.github.io
- GitHub: github.com/AlexandrosPanag

See [LICENSE.md](LICENSE.md) for full license text.

---

## 🙏 Acknowledgments

- **Triacontane** - Original plugin creator and mastermind
- **RPG Maker MZ Community** - Feedback and testing
- **NW.js Team** - Modern desktop application framework
- **You** - For using this plugin! 🎮

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/[your-username]/DevToolsManage-Enhanced/issues)
- **Discussions:** [GitHub Discussions](https://github.com/[your-username]/DevToolsManage-Enhanced/discussions)
- **Original Plugin:** [Triacontane's Repository](https://github.com/triacontane/RPGMakerMV)

---

## 🌟 Star History

If this plugin helps your development, consider giving it a star! ⭐

---

**Made with ❤️ for the RPG Maker community**

---

### Quick Links
- [Download Latest Release](https://github.com/[your-username]/DevToolsManage-Enhanced/releases)
- [Report a Bug](https://github.com/[your-username]/DevToolsManage-Enhanced/issues/new?template=bug_report.md)
- [Request a Feature](https://github.com/[your-username]/DevToolsManage-Enhanced/issues/new?template=feature_request.md)
- [View Original Plugin](https://github.com/triacontane/RPGMakerMV/tree/mz_master)

---

*Last Updated: November 2025*

