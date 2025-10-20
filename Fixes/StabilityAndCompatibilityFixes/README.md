# Stability and Compatibility Fixes Plugin


Welcome to my collection of RPG Maker MZ Fixes plugins! This repository contains various fixes that the RPG Maker MZ engine fails to address.

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-1.0.2-green)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)


## 👤 Author

**Alexandros Panagiotakopoulos**

---
## ⚙️  Changelogs:
### 1.0.1: Fixed an issue with loading save files even after deleted.
### 1.0.2: Fixed an issue with loading lists causing the game to crash.

## 📋 Overview

A comprehensive stability plugin designed to resolve common RPG Maker MZ issues that emerge during extended gameplay sessions (100+ hours) and address compatibility problems with older NW.js versions. This plugin implements advanced memory management techniques, error handling, and performance optimizations to ensure your game runs smoothly throughout its entire duration.


## 📝 License & Credits

### License
This project is licensed under the **Creative Commons Attribution 4.0 International License**.

**You are free to:**
- ✅ Share — copy and redistribute in any medium or format
- ✅ Adapt — remix, transform, and build upon the material  
- ✅ Commercial Use — use for commercial projects

**Under the following terms:**
- 📝 **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.

### Credits
- **Author**: Alexandros Panagiotakopoulos
- **Framework**: RPG Maker MZ Plugin System
- **Technologies**: JavaScript ES6+, CSS3 Animations, HTML5 APIs
- **Inspiration**: Modern browser power management and mobile battery optimization


## ✨ Key Features

### Memory Management
- **Bitmap Cache Control**: Automatically monitors and limits bitmap cache size to prevent memory overflow
- **Audio Buffer Cleanup**: Properly releases audio resources to prevent accumulation
- **Sprite Disposal**: Ensures all sprites and their associated resources are correctly destroyed
- **Periodic Garbage Collection**: Provides hints to the JavaScript engine for optimal memory cleanup

### Save System Protection
- **Automatic Backup Creation**: Creates backup saves before each save operation
- **Corruption Recovery**: Attempts to restore from backup if save file loading fails
- **Data Integrity**: Prevents save file corruption during long play sessions

### Performance Optimization
- **Event Interpreter Protection**: Prevents infinite loops and clears temporary event data
- **Battle System Cleanup**: Properly releases battle-specific resources after combat
- **Animation Memory Management**: Prevents memory leaks from animation sprites
- **Map Resource Management**: Clears map events and tilemap data on scene transitions

### Compatibility Enhancements
- **JavaScript Polyfills**: Includes polyfills for Array.flat, Array.flatMap, Object.fromEntries, and Promise.allSettled
- **WebGL Context Recovery**: Automatically attempts to recover from WebGL context loss
- **Safe Math Operations**: Provides safe number operations that prevent NaN and Infinity values

### Error Handling
- **Comprehensive Error Logging**: Captures and logs errors to session storage for debugging
- **Uncaught Error Handling**: Monitors and logs uncaught errors and promise rejections
- **Performance Monitoring**: Optional FPS tracking and low-performance warnings (debug mode)

## 🚀 Installation

1. Download `StabilityAndCompatibilityFixes.js`
2. Place the file in your project's `js/plugins/` folder
3. Open the Plugin Manager in RPG Maker MZ
4. Add the plugin to your plugin list
5. **Important:** Place this plugin **BEFORE** other plugins for maximum effectiveness

## ⚙️  Plugin Parameters

### Enable Memory Management
- **Type:** Boolean
- **Default:** true
- **Description:** Automatically manages memory to prevent leaks during long play sessions

### Enable Bitmap Caching
- **Type:** Boolean
- **Default:** true
- **Description:** Limits bitmap cache size to prevent memory overflow

### Max Bitmap Cache Size (MB)
- **Type:** Number
- **Range:** 50-500
- **Default:** 150
- **Description:** Maximum memory allocated for bitmap cache in megabytes

### Enable Auto-Save Backup
- **Type:** Boolean
- **Default:** true
- **Description:** Creates backup saves to prevent corruption

### Enable Error Logging
- **Type:** Boolean
- **Default:** true
- **Description:** Logs errors to console and session storage for debugging

### Enable Performance Monitor
- **Type:** Boolean
- **Default:** false
- **Description:** Monitors game performance (recommended for debugging only)

## 🔧  Plugin Commands

### Manual Cleanup
**Command:** `manualCleanup`

Manually triggers a comprehensive memory cleanup operation:
- Clears bitmap cache
- Releases audio buffers
- Clears image cache
- Triggers garbage collection hint

**Usage:**
```
Plugin Command: StabilityAndCompatibilityFixes manualCleanup
```

### Show Memory Info
**Command:** `showMemoryInfo`

Displays current memory usage information in the console:
- Used heap size
- Total heap size
- Heap size limit
- Current FPS (if performance monitor is enabled)

**Usage:**
```
Plugin Command: StabilityAndCompatibilityFixes showMemoryInfo
```

## 🧰 Issues Fixed

This plugin addresses the following common RPG Maker MZ stability issues:

- ✅ Memory leaks from bitmap accumulation
- ✅ Audio files not properly releasing
- ✅ Save file corruption
- ✅ Event interpreter memory buildup
- ✅ WebGL context loss
- ✅ Sprite disposal issues
- ✅ Animation memory leaks
- ✅ Battle system memory accumulation
- ✅ Map transition memory leaks
- ✅ Infinite event loops
- ✅ JavaScript compatibility issues with older NW.js versions

## 🧰 Automatic Maintenance Schedule

The plugin performs automatic maintenance at the following intervals:

- **Bitmap Cache Cleanup:** Every 60 seconds
- **Audio Buffer Cleanup:** Every 2 minutes
- **Garbage Collection Hint:** Every 5 minutes
- **Performance Monitoring:** Every 1 second (if enabled)

## 🧰 Best Practices

1. **Plugin Order:** Always place this plugin at or near the top of your plugin list
2. **Testing:** Enable Performance Monitor during development to identify potential issues
3. **Memory Limits:** Adjust Max Bitmap Cache Size based on your game's asset requirements
4. **Error Logs:** Check session storage for error logs when debugging issues
5. **Manual Cleanup:** Use the manual cleanup command before major scene transitions or after resource-intensive sequences

## 🧰 Debugging

### Viewing Error Logs
Error logs are stored in `sessionStorage` under the key `rpgmz_error_log`. To view them:

1. Open the browser/NW.js console (F8 or F12)
2. Type: `JSON.parse(sessionStorage.getItem('rpgmz_error_log'))`
3. Press Enter to view all logged errors

### Memory Monitoring
Use the `showMemoryInfo` plugin command to check current memory usage. This helps identify if your game is approaching memory limits.

### Performance Issues
If you experience performance issues:
1. Enable Performance Monitor in plugin parameters
2. Watch console for FPS warnings
3. Use manual cleanup commands strategically
4. Consider increasing bitmap cache size if textures are being reloaded frequently

## Compatibility

- **RPG Maker Version:** MZ 1.0.0+
- **NW.js Version:** Compatible with older versions through polyfills
- **Browser:** Chrome/Chromium-based browsers
- **Platform:** Windows, macOS, Linux

## Technical Details

### Memory Management Strategy
The plugin uses a multi-layered approach to memory management:
- **Proactive cleanup** of unused resources
- **Reactive limits** on cache sizes
- **Periodic maintenance** to prevent accumulation
- **Garbage collection hints** to assist the JavaScript engine

### Safe Math Operations
Three new utility functions are added to the Math object:
- `Math.safeAdd(a, b)` - Addition that returns 0 for invalid results
- `Math.safeMultiply(a, b)` - Multiplication that returns 0 for invalid results
- `Math.safeDivide(a, b)` - Division that returns 0 for division by zero or invalid results



## Changelog

### Version 1.0.0 (Initial Release)
- Comprehensive memory management system
- Bitmap cache optimization
- Audio cleanup automation
- Save file backup and recovery
- Event interpreter protection
- WebGL context recovery
- JavaScript polyfills for compatibility
- Performance monitoring
- Error logging system
- Manual cleanup commands

---

**Note:** This plugin is designed to work automatically once installed. Most users will not need to adjust parameters or use plugin commands unless experiencing specific issues or debugging.
