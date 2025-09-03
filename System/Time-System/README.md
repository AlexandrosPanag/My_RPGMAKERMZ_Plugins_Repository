# 🕐 RPG Maker MZ Time System Plugin Documentation

**Plugin Name:** TimeSystem.js  
**Version:** 1.0.0  
**Compatible with:** RPG Maker MZ  

---

## 📖 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Plugin Parameters](#plugin-parameters)
5. [Plugin Commands](#plugin-commands)
6. [Script Calls](#script-calls)
7. [Developer Console Commands](#developer-console-commands)
8. [Time Periods & Screen Tinting](#time-periods--screen-tinting)
9. [Usage Examples](#usage-examples)
10. [Troubleshooting](#troubleshooting)
## 🎯 Overview

The Time System plugin creates a realistic day/night cycle for your RPG Maker MZ game. Time progresses automatically in real-time, with configurable speed and automatic screen tinting to create immersive day/night atmosphere changes.

### Key Benefits:
- **Real-time progression** - Time flows continuously
- **Automatic screen tinting** - Visual day/night changes
- **Save/Load compatible** - Time state is preserved
- **Highly configurable** - Customize all aspects
- **Developer friendly** - Extensive debugging tools

---

## ✨ Features

### 🕐 Time System
- 24-hour clock (00:00 to 23:59)
- Configurable time speed (1 real second = 1 in-game minute by default)
- Automatic progression with start/stop controls
- Save/load integration

### 🌅 Day/Night Cycle
- **Four distinct time periods:**
  - 🌙 **Night** (20:00 - 05:59) - Dark blue tint
  - 🌅 **Dawn** (06:00 - 07:59) - Orange/pink tint
  - ☀️ **Day** (08:00 - 17:59) - No tint
  - 🌇 **Dusk** (18:00 - 19:59) - Orange/red tint

### 🎨 Screen Tinting
- Automatic color transitions
- Smooth tint changes (2-second transitions)
- Configurable time periods
- Enable/disable option

---

## 📦 Installation

1. **Save the plugin file** as `TimeSystem.js` in your `js/plugins/` folder
2. **Open Plugin Manager** in RPG Maker MZ
3. **Enable** the TimeSystem plugin
4. **Configure parameters** as desired
5. **Test** your game!

---

## 🎮 Plugin Commands

Access these through **Event Commands → Plugin Command → TimeSystem**

- **Show Time Window** - Displays current time popup
- **Set Time** - Manually set hours (0-23) and minutes (0-59)
- **Toggle Time Flow** - Start/stop time progression
- **Toggle Time Display** - Show/hide corner time display
- **Log Current Time** - Debug output to console
- **Test Time System** - Comprehensive system test

---

## 💻 Script Calls

Use these in **Event Commands → Script**:

### Basic Operations:
```javascript
$gameTime.getHours()        // Returns 0-23
$gameTime.getMinutes()      // Returns 0-59
$gameTime.getTimeString()   // Returns "HH:MM"
$gameTime.setTime(12, 30)   // Set to 12:30
$gameTime.start() / $gameTime.stop()  // Control progression
```

### Time Period Checks:
```javascript
$gameTime.getTimeOfDay()    // Returns: "night", "dawn", "day", "dusk"
$gameTime.isDay()          // True for day/dawn
$gameTime.isNight()        // True for night/dusk
```

---

## 🛠️ Developer Console Commands

Open console (F8) and use these for testing:

```javascript
TimeSystemDebug.help()                    // Show all commands
TimeSystemDebug.getTimeInfo()             // Current status
TimeSystemDebug.speedUpHours(5)           // Jump forward 5 hours
TimeSystemDebug.speedUpMinutes(30)        // Jump forward 30 minutes
TimeSystemDebug.forceTint('night')        // Apply night tint
TimeSystemDebug.testAllTints()            // Test all tint periods
```

---

## 🎨 Time Periods & Screen Tinting

| Period | Hours | Screen Tint | RGBA Values |
|--------|-------|-------------|-------------|
| 🌙 **Night** | 20:00 - 05:59 | Dark blue | `[-100, -100, 0, 100]` |
| 🌅 **Dawn** | 06:00 - 07:59 | Orange/pink | `[50, 20, -50, 80]` |
| ☀️ **Day** | 08:00 - 17:59 | None | `[0, 0, 0, 0]` |
| 🌇 **Dusk** | 18:00 - 19:59 | Orange/red | `[80, 20, -80, 90]` |

---

## 🎯 Usage Examples

### NPC Dialog Based on Time:
```javascript
// In conditional branch with script:
$gameTime.isNight()

// TRUE: "Good evening! It's getting dark."
// FALSE: "What a lovely day it is!"
```

### Shop Hours (9 AM to 8 PM):
```javascript
if ($gameTime.getHours() >= 9 && $gameTime.getHours() < 20) {
    // Open shop
} else {
    $gameMessage.add("We're closed! Come back 9:00-20:00");
}
```

### Pause Time During Cutscenes:
```javascript
$gameTime.stop();  // At cutscene start
// ... cutscene events ...
$gameTime.start(); // At cutscene end
```

---

## 🐛 Troubleshooting

### Common Issues:

#### **"$gameTime is not defined"**
- Ensure plugin is enabled in Plugin Manager
- Start new game or use "Test Time System" command
- Check console for initialization messages

#### **Screen Tinting Not Working**
- Verify "Enable Tinting" parameter is `true`
- Must be on map scene (not in menus)
- Test with `TimeSystemDebug.forceTint('night')`

#### **Time Display Not Showing**
- Check "Show Time Display" parameter is `true`
- Use "Toggle Time Display" plugin command
- Verify X/Y position coordinates are on screen

#### **Time Not Progressing**
- Check if time is running: `$gameTime.isRunning()`
- Use `TimeSystemDebug.toggle()` to restart
- Verify Time Speed parameter isn't too high

### Debug Steps:
1. Open console and look for initialization message
2. Run `TimeSystemDebug.getTimeInfo()` 
3. Test with `TimeSystemDebug.speedUpHours(1)`
4. Use `TimeSystemDebug.testAllTints()` for tinting verification

---

This documentation covers everything you need to use, configure, and troubleshoot your Time System plugin! The plugin is fully functional with real-time progression, automatic screen tinting, comprehensive debugging tools, and save/load integration.

**Happy game making! 🎮**
