# UnofficialMZPatch.js

**Comprehensive RPG Maker MZ 1.9.0 Enhancement Plugin**

A complete stability, performance, and bug-fix solution for RPG Maker MZ. Combines multiple patches into a single, well-optimized plugin.

---

## 🚀 Features

### Core Fixes
- ✅ **Diagonal Movement Collision Fix** - Prevents glitching through walls during diagonal movement
- ✅ **Memory Management** - Automatic bitmap cache cleanup and memory leak prevention
- ✅ **Audio System Fixes** - Prevents audio buffer memory leaks
- ✅ **Save System Protection** - Auto-backup saves before overwriting + corruption prevention
- ✅ **Event System Stability** - Fixes null reference errors and infinite loops
- ✅ **Battle System Memory Fixes** - Proper cleanup of battle sprites and actions

### MZ 1.9.0 Specific Patches
- ✅ Input handling fixes (stuck keys, gamepad deadzone)
- ✅ WebGL renderer stability improvements
- ✅ Texture bleeding fix (removes lines when zooming/scaling)
- ✅ Font loading fix (prevents fallback fonts)
- ✅ Window refresh throttling (reduces unnecessary redraws)

### Performance Optimizations
- ✅ **Object Pooling** - Reuses Sprites, Points, Rectangles, Arrays
- ✅ **Frame Budgeting** - Spreads heavy operations across multiple frames
- ✅ **Event Throttling** - Reduces update frequency for distant events
- ✅ **Adaptive Quality Scaling** - Auto-adjusts quality based on FPS
- ✅ **Performance HUD** - Real-time FPS/memory monitoring (optional)

### Quality of Life
- ✅ **Smooth Scene Transitions** - Fade in/out instead of hard cuts
- ✅ **Memory Leak Detection** - Visual warnings for development (disabled by default)
- ✅ **JavaScript Polyfills** - Ensures compatibility with older NW.js versions

---

## 📦 Installation

1. Download `UnofficialMZPatch.js`
2. Place in your project's `js/plugins/` folder
3. Open Plugin Manager in RPG Maker MZ
4. **Add this plugin FIRST in your plugin list** (must be at the top)
5. Configure options as needed
6. Save your project

---

## ⚙️ Configuration

### Recommended Settings for Most Projects

✅ Enable Collision Fixes: ON
✅ Enable Memory Management: ON
✅ Enable Bitmap Caching: ON
✅ Enable Performance Integration: ON
✅ Enable Texture Bleeding Fix: ON
✅ Enable Smooth Transitions: ON⚠️ Enable Font Loading Fix: OFF (can cause HUD flicker)
⚠️ Enable Window Throttling: OFF (can cause HUD flicker)
⚠️ Enable Performance HUD: OFF (for production)
⚠️ Enable Leak Detection: OFF (for production)

### Advanced Performance Tuning
- **Performance Threshold**: 16ms (60 FPS) or 33ms (30 FPS)
- **Frame Budget**: 8ms (default) - lower for more responsive controls
- **Max Bitmap Cache**: 150MB (increase if you have many large images)
- **GC Threshold**: 150MB (increase for memory-heavy games)

---

## 🎮 Console Commands

Open the F12 developer console and use these commands:
```javascript// Performance monitoring
$mzPatch.getReport()           // Full performance report
$mzPatch.toggleHUD()           // Show/hide performance overlay
$mzPatch.getPoolStats()        // Object pooling statistics// Manual optimization
$mzPatch.cleanup()             // Force memory cleanup
$mzPatch.optimizeAll()         // Run all optimizations
$mzPatch.setQuality(1-5)       // Set quality level (1=lowest, 5=highest)// Memory leak detection (if enabled)
$mzPatch.getLeakStatus()       // Check for memory leaks
checkMemoryLeaks()             // Force leak check// Font loading (if enabled)
$fontLoader.areFontsReady()    // Check if fonts are loaded// Transitions (if enabled)
$transitions.startFadeOut(12)  // Manual fade out (12 frames)
```
---

## 🐛 Known Issues & Workarounds

### ⚠️ Font Loading Fix
- **Issue**: Can cause text flickering on custom HUDs
- **Workaround**: Disable "Enable Font Loading Fix" if you experience this

### ⚠️ Window Throttling
- **Issue**: Can cause HUD updates to lag or flicker
- **Workaround**: Disable "Enable Window Throttling" or enable "Exclude Equip Windows from Throttling"

### ⚠️ Smooth Transitions
- **Issue**: May interfere with custom transition plugins
- **Workaround**: Disable "Enable Smooth Transitions" if you use custom scene transitions

---

## 📝 Changelog

### v1.0.1 (Current)
**Fixed:**
- 🐛 **CRITICAL: Alt-Tab Bug** - Characters no longer become invisible when minimizing/alt-tabbing
  - Added visibility change detection
  - Auto-completes fade transitions on window blur
  - Properly cleans up fade sprites when window regains focus
  
**Improvements:**
- Better fade sprite cleanup on scene changes
- Added blur/focus event listeners for more reliable window state tracking

### v1.0.0 (Initial Release)
**Added:**
- Complete diagonal movement collision system
- Memory management with bitmap caching
- Audio buffer cleanup
- Save system backup and corruption prevention
- Event system stability fixes
- Battle system memory leak fixes
- Input handling improvements (MZ 1.9.0)
- Texture bleeding fix for pixel-perfect rendering
- Object pooling system
- Frame budgeting for heavy operations
- Event throttling based on distance
- Adaptive quality scaling
- Performance HUD with real-time metrics
- Memory leak detection (dev mode)
- Font loading fix
- Window refresh throttling
- Smooth scene transitions with fade in/out
- JavaScript polyfills for older NW.js versions
- Plugin command support
- Console API for manual control

---

## 🔧 Compatibility

### Tested With
- RPG Maker MZ 1.9.0
- Windows 10/11
- macOS (Intel & Apple Silicon)
- Modern browsers (for web deployment)

### Plugin Compatibility
This plugin is designed to work alongside:
- PerformanceCatcher
- EventOptimizer
- TimeSystem
- Most other plugins (when placed first in plugin list)

### Known Conflicts
- May conflict with other collision system plugins
- May conflict with custom transition plugins (disable Smooth Transitions)

---

## 📄 License

Copyright © 2025 Alexandros Panagiotakopoulos. All Rights Reserved.

For licensing inquiries, visit: https://alexandrospanag.github.io

---

