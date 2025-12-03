# UnofficialMZPatch for RPG Maker MZ

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ%201.9.0-red.svg)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-green.svg)

A comprehensive stability, performance, and compatibility patch for RPG Maker MZ 1.9.0. This plugin combines multiple fixes, optimizations, and quality-of-life improvements into a single, unified solution.

---

## ⚠️ IMPORTANT LEGAL DISCLAIMER

**THIS IS AN UNOFFICIAL PLUGIN.**

This plugin is **NOT** official, endorsed, affiliated with, or supported by:
- Gotcha Gotcha Games Inc.
- Kadokawa Corporation
- RPG Maker MZ development team
- OR any official RPG Maker entity

This plugin is an independent, community-created tool developed to address common issues and improve the RPG Maker MZ experience. Use at your own discretion.

**The author assumes no responsibility for:**
- Any damage to your project files
- Save file corruption
- Compatibility issues with other plugins
- Any issues arising from the use of this plugin


---

 ## ⚠️ DO NOT install any other performance and/or fixes since this one already includes existing one as an all-in-one package!


## 🔴 CRITICAL BACKUP WARNING

⚠️ **BACKUP YOUR ENTIRE PROJECT BEFORE INSTALLING THIS PLUGIN** ⚠️

This is a **massive, comprehensive plugin** that modifies core RPG Maker MZ systems including:

- Movement and collision detection
- Memory management and garbage collection
- Input handling systems
- Save/Load systems
- Rendering pipeline
- Audio systems
- Event interpreter
- Battle system
- Scene transitions
- Window refresh cycles

**Before installation:**
1. ✅ Create a complete backup of your project folder
2. ✅ Backup your save files separately
3. ✅ Test in a separate copy of your project first
4. ✅ Document your current plugin order
5. ✅ Export/backup any important game data

**The author is NOT responsible for any data loss or project corruption.**

---

## 📄 License

This project is licensed under the **Creative Commons Attribution 4.0 International License**.

You are free to:
* ✅ **Share** — copy and redistribute in any medium or format
* ✅ **Adapt** — remix, transform, and build upon the material
* ✅ **Commercial Use** — use for commercial projects

Under the following terms:
* 📝 **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.

[View Full License](https://creativecommons.org/licenses/by/4.0/)

---

## ✨ Features Overview

### 🎮 Core Fixes
- **Diagonal Movement Collision Fix** — Prevents glitching through walls
- **Memory Management** — Automatic cleanup prevents memory leaks
- **Auto-Save Backup** — Creates backup saves before overwriting
- **Error Logging** — Comprehensive error tracking

### ⚡ Performance Optimizations
- **Object Pooling** — Reuses objects to reduce garbage collection
- **Event Throttling** — Reduces updates for distant events
- **Frame Budgeting** — Spreads heavy operations across frames
- **Adaptive Quality** — Automatically adjusts quality for stable FPS
- **Window Refresh Throttling** — Prevents unnecessary redraws

### 🔧 MZ 1.9.0 Patches
- **Input Fixes** — Resolves stuck keys and gamepad deadzone issues
- **Renderer Fixes** — WebGL context loss recovery
- **Audio Fixes** — Proper buffer cleanup and context handling
- **Save System Fixes** — Prevents corruption, circular reference handling
- **Event System Fixes** — Move route fixes, loop prevention
- **Battle System Fixes** — Memory cleanup after battles

### 🎨 Visual Improvements
- **Texture Bleeding Fix** — Eliminates line artifacts when scaling
- **Smooth Scene Transitions** — Fade effects instead of hard cuts
- **Font Loading Fix** — Ensures fonts load before rendering

### 🔍 Development Tools
- **Memory Leak Detection** — Visual warnings for resource leaks
- **Performance HUD** — Real-time FPS, memory, and quality display
- **Console Commands** — Debug and control via F12 console

---

## 📦 Installation

1. **BACKUP YOUR PROJECT FIRST!**
2. Download `UnofficialMZPatch.js`
3. Place it in your project's `js/plugins/` folder
4. Open RPG Maker MZ Plugin Manager
5. Add "UnofficialMZPatch" to your plugin list
6. **Place this plugin FIRST (at the top) of your plugin list**
7. Configure parameters as needed
8. Save your project

### Plugin Order

```
1. UnofficialMZPatch.js    ← FIRST (this plugin)
2. [Your other plugins...]
3. [More plugins...]
```

**Why first?** This plugin modifies core systems that other plugins may depend on. Placing it first ensures maximum compatibility.

---

## ⚙️ Configuration

### Core Fixes

| Parameter | Default | Description |
|-----------|---------|-------------|
| `enableCollisionFixes` | true | Fixes diagonal movement collision glitches |
| `enableMemoryManagement` | true | Automatic memory cleanup for long sessions |
| `enableBitmapCaching` | true | Limits bitmap cache size |
| `maxBitmapCacheSize` | 150 MB | Maximum memory for bitmap cache |
| `enableAutoSaveBackup` | true | Creates backup before saving |
| `enableErrorLogging` | true | Logs errors for debugging |

### Performance

| Parameter | Default | Description |
|-----------|---------|-------------|
| `enablePerformanceIntegration` | true | Master toggle for performance features |
| `enableAutoOptimization` | true | Automatically optimize based on FPS |
| `performanceThreshold` | 16 ms | Target frame time (16ms = 60 FPS) |
| `enableObjectPooling` | true | Reuse objects to reduce GC |
| `enableEventThrottling` | true | Throttle distant event updates |
| `enableFrameBudgeting` | true | Spread heavy operations |
| `frameBudgetMs` | 8 ms | Time budget per frame |
| `gcThresholdMB` | 150 MB | Memory threshold for cleanup |

### Quality Settings

| Parameter | Default | Description |
|-----------|---------|-------------|
| `enableAdaptiveQuality` | true | Auto-adjust quality for stable FPS |
| `minFPS` | 30 | Minimum acceptable FPS |
| `maxFPS` | 60 | Target maximum FPS |
| `enablePerformanceHUD` | false | Show performance overlay |

### MZ 1.9.0 Patches

| Parameter | Default | Description |
|-----------|---------|-------------|
| `enableInputFixes` | true | Fix input handling issues |
| `enableRendererFixes` | true | Fix WebGL renderer issues |
| `enableAudioFixes` | true | Fix audio playback/memory |
| `enableSaveSystemFixes` | true | Fix save corruption issues |
| `enableEventSystemFixes` | true | Fix event interpreter issues |
| `enableBattleSystemFixes` | true | Fix battle memory leaks |

### Texture & Rendering

| Parameter | Default | Description |
|-----------|---------|-------------|
| `enableTextureBleedingFix` | true | Fix scaling artifacts |

### Memory Leak Detection (Development)

| Parameter | Default | Description |
|-----------|---------|-------------|
| `enableLeakDetection` | false | Enable leak tracking (dev only) |
| `leakCheckInterval` | 5000 ms | Time between leak checks |
| `leakWarnThreshold` | 100 | Objects before warning |
| `enableLeakVisualWarning` | true | Show on-screen warning |

### QoL Improvements

| Parameter | Default | Description |
|-----------|---------|-------------|
| `enableFontLoadingFix` | true | Wait for fonts before rendering |
| `enableWindowThrottling` | true | Throttle window refreshes |
| `windowRefreshInterval` | 50 ms | Minimum refresh interval |
| `enableSmoothTransitions` | true | Fade scene transitions |
| `transitionDuration` | 12 frames | Transition fade duration |

---

## 🎮 Console Commands (F12)

Access the browser console with F12 (or F8 in playtest) and use these commands:

### Performance Hub

```javascript
$mzPatch.getReport()           // Full performance report
$mzPatch.optimizeAll()         // Force optimization
$mzPatch.setQuality(1-5)       // Set quality level (1=low, 5=high)
$mzPatch.toggleHUD()           // Toggle performance HUD
$mzPatch.getPoolStats()        // Object pool statistics
$mzPatch.cleanup()             // Force memory cleanup
$mzPatch.getLeakStatus()       // Check for memory leaks
```

### Font & Transitions

```javascript
$fontLoader.areFontsReady()    // Check if fonts are loaded
$transitions.startFadeOut(12)  // Manual fade out (frames)
$transitions.startFadeIn(12)   // Manual fade in (frames)
```

### Memory Leak Detection

```javascript
checkMemoryLeaks()             // Manual leak check (when enabled)
```

### Global Variables

```javascript
$qualityLevel                  // Current quality level (1-5)
$smoothDeltaTime               // Smoothed delta time (ms)
```

---

## 🔧 Feature Details

### 1. Diagonal Movement Collision Fix

**Problem:** Players can glitch through walls when moving diagonally, especially at corners.

**Solution:** Enhanced collision detection that checks:
- Horizontal passability from current position
- Vertical passability from current position
- Horizontal passability from new Y position
- Vertical passability from new X position
- Corner collision at destination
- Event collision at destination

**Wall Sliding:** If diagonal movement fails, the plugin tries:
1. Horizontal movement only
2. Vertical movement only
3. Direction with more clearance

### 2. Memory Management

**Bitmap Cache Management:**
- Tracks creation time and last access time
- Automatically cleans old bitmaps when cache exceeds limit
- Prioritizes removing least-recently-used bitmaps

**Audio Buffer Cleanup:**
- Cleans stopped SE buffers every 2 minutes
- Properly releases BGS buffers
- Fixes audio context suspension issues

**Periodic Garbage Collection:**
- Hints to browser GC every 5 minutes
- Clears image cache periodically
- Manages bitmap cache every 60 seconds

### 3. Performance Integration

**Object Pooling:**
- Pre-creates Sprite, Point, Rectangle, and Array pools
- Reuses objects instead of creating new ones
- Reduces garbage collection pauses

**Event Throttling:**
- Events within 5 tiles: Full update rate
- Events 5-10 tiles away: ~30 FPS updates
- Events 10-20 tiles away: ~15 FPS updates
- Events 20+ tiles away: ~10 FPS updates
- Exceptions: Starting events, events with move routes

**Frame Budgeting:**
- Defers heavy operations
- Processes deferred operations within time budget
- Prevents frame time spikes

**Adaptive Quality:**
- Monitors average FPS
- Reduces quality level if FPS drops below minimum
- Increases quality level if FPS exceeds maximum
- 5 quality levels (1=lowest, 5=highest)

### 4. Input Fixes

**Stuck Key Prevention:**
- Clears input state properly
- Prevents multiple key registrations per frame

**Gamepad Deadzone:**
- 0.25 deadzone to prevent stick drift
- Prevents unintended movement

**Touch Input:**
- Proper state clearing
- Fixes mobile input issues

### 5. Save System Fixes

**Auto-Backup:**
- Creates backup before each save
- Backup stored as `backup_[slotId]`
- Automatically tries backup if main save fails

**Circular Reference Protection:**
- Safe JSON stringify fallback
- Prevents save corruption from circular references

### 6. Texture Bleeding Fix

**Problem:** Line artifacts appear when zooming or scaling sprites.

**Solution:**
- Forces `PIXI.SCALE_MODE = NEAREST`
- Sets `ROUND_PIXELS = true`
- Uses `WRAP_MODE = CLAMP` for textures
- Disables image smoothing

**Affected sprites:**
- Character sprites
- Tilemap textures
- Picture sprites
- Animation sprites

### 7. Font Loading Fix

**Problem:** Text renders with fallback fonts before custom fonts load.

**Solution:**
- Tracks font loading state
- Uses `document.fonts.ready` API
- Queues draw operations until fonts ready

### 8. Window Refresh Throttling

**Problem:** Excessive window redraws hurt performance.

**Solution:**
- Minimum 50ms between refreshes (configurable)
- Message windows exempt (need real-time updates)
- Status windows use 2x throttle
- Gold window only refreshes when gold changes

### 9. Smooth Scene Transitions

**Problem:** Hard cuts between scenes feel jarring.

**Solution:**
- Fade out (configurable duration)
- Scene change
- Fade in (configurable duration)
- Skip for Scene_Boot and Scene_Gameover

---

## 🐛 Troubleshooting

### Plugin not working?

1. **Check plugin order** — Must be FIRST in plugin list
2. **Check for conflicts** — Disable other plugins to test
3. **Check console (F12)** — Look for error messages
4. **Verify parameters** — Ensure settings are correct

### Performance issues?

```javascript
// Check current performance
$mzPatch.getReport()

// Force optimization
$mzPatch.optimizeAll()

// Lower quality
$mzPatch.setQuality(1)

// Check for leaks (if enabled)
$mzPatch.getLeakStatus()
```

### Collision still broken?

- Ensure `enableCollisionFixes` is `true`
- Check for conflicting movement plugins
- This plugin should be loaded BEFORE movement plugins

### Transitions not smooth?

- Ensure `enableSmoothTransitions` is `true`
- Increase `transitionDuration` for slower fades
- Check for conflicting scene plugins

### Memory still leaking?

1. Enable leak detection temporarily:
   - Set `enableLeakDetection` to `true`
2. Play normally and watch for warnings
3. Check console: `checkMemoryLeaks()`
4. Disable in production after debugging

---

## 📝 Plugin Commands

Use these in events via Plugin Command:

| Command | Description |
|---------|-------------|
| `manualCleanup` | Force memory cleanup |
| `showPerformanceReport` | Display performance stats |
| `setQualityLevel` | Set quality (1-5) |
| `togglePerformanceHUD` | Show/hide HUD overlay |

---

## 🔄 Changelog

### Version 1.0.0 (2025-12-03)
- ✨ Initial release
- 🎮 Diagonal movement collision fix
- 🧠 Memory management system
- ⚡ Performance integration hub
- 🔧 MZ 1.9.0 specific patches
- 🎨 Texture bleeding fix
- 🔍 Memory leak detection
- 📝 Font loading fix
- 🖼️ Window refresh throttling
- 🌊 Smooth scene transitions
- 📊 Performance HUD
- 🎯 Object pooling system
- ⏱️ Event throttling
- 💾 Save system backup
- 🛡️ Error logging
- 📜 JavaScript polyfills for older NW.js

---

## 👏 Credits

* **Author**: Alexandros Panagiotakopoulos
* **Website**: [alexandrospanag.github.io](https://alexandrospanag.github.io)
* **Framework**: RPG Maker MZ Plugin System
* **Technologies**: JavaScript ES6+, PIXI.js, WebGL, HTML5 APIs

---

## 🤝 Contributing

Found a bug or have a feature request?
- 🐛 Report issues on GitHub
- 💡 Suggest improvements
- 🔧 Submit pull requests
- ⭐ Star the repository if you find it useful!

---

## ⚠️ Final Reminder

1. **This is UNOFFICIAL** — Not affiliated with RPG Maker
2. **BACKUP FIRST** — Always backup before installing
3. **PLACE FIRST** — This plugin should be first in your list
4. **TEST THOROUGHLY** — Test in a copy of your project
5. **DISABLE LEAK DETECTION** — For production builds

---

**Made with ❤️ for the RPG Maker community**

*Stability, Performance, Compatibility — All in One!* 🎮✨

