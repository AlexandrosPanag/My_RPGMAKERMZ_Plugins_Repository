# DebugMockLoadingScreen for RPG Maker MZ

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-red.svg)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-green.svg)

A developer tool for RPG Maker MZ that keeps the loading screen visible indefinitely. Perfect for testing custom CSS animations, loading spinners, and visual effects without the game actually loading.

## ⚠️ IMPORTANT WARNING

**THIS IS A TESTING TOOL ONLY!**

🚨 **DO NOT LEAVE THIS ENABLED IN YOUR FINAL GAME!** 🚨

This plugin **PREVENTS YOUR GAME FROM LOADING**. It's designed purely for CSS testing and development work.

**If you enable this and forget to disable it:**
- ❌ Your game will never start
- ❌ Players will be stuck on the loading screen forever
- ❌ You will look very silly
- ❌ Players will think your game is broken

**Before distributing your game:**
1. ✅ **DISABLE THIS PLUGIN** in the Plugin Manager
2. ✅ Test that your game actually loads
3. ✅ Consider removing it entirely from your plugins folder
4. ✅ Don't be that developer who ships with debug plugins enabled

---

## 🎯 What Does This Do?

DebugMockLoadingScreen freezes your game at the loading screen so you can:

✨ **Test CSS animations** - Watch your loading spinner spin indefinitely  
✨ **Check visual effects** - See glows, fades, and transitions clearly  
✨ **Test responsive design** - Resize window and see how it adapts  
✨ **Verify FPS counter** - Monitor performance overlay behavior  
✨ **Inspect elements** - Open DevTools and examine CSS in detail  

## 📦 Installation

1. Download `DebugMockLoadingScreen.js`
2. Place it in your project's `js/plugins/` folder
3. Open RPG Maker MZ Plugin Manager
4. Add "DebugMockLoadingScreen" to your plugin list
5. Configure parameters (see below)
6. **Important**: Save your project

## ⚙️ Plugin Parameters

### Enable Mock Loading
- **Type**: Boolean (ON/OFF)
- **Default**: ON
- **Description**: Toggle infinite loading screen

When **ON**: Game stays on loading screen forever  
When **OFF**: Game loads normally

### Show Console Message
- **Type**: Boolean (ON/OFF)
- **Default**: ON
- **Description**: Display debug messages in browser console

When **ON**: Helpful color-coded messages appear in console  
When **OFF**: Silent operation (no console output)

## 🎮 Usage

### Basic Workflow

**Step 1: Enable the Plugin**
```
1. Open Plugin Manager in RPG Maker MZ
2. Find "DebugMockLoadingScreen"
3. Set "Enable Mock Loading" to ON
4. Save your project
```

**Step 2: Test Your CSS**
```
1. Start playtest (F12 or test play button)
2. Game stays on loading screen
3. Loading spinner animates continuously
4. Open browser DevTools (F12) to inspect
```

**Step 3: Disable When Done**
```
1. Open Plugin Manager
2. Set "Enable Mock Loading" to OFF
3. OR disable the entire plugin
4. Save your project
5. Verify game loads normally
```

### Perfect For Testing

✅ **Loading Spinner Animations**
- Gradient effects
- Rotation speed
- Easing functions
- Glow and shadow effects

✅ **CSS Transitions**
- Fade in/out effects
- Scale animations
- Opacity changes
- Color transitions

✅ **Responsive Design**
- Different screen sizes
- Mobile layouts
- Breakpoint behavior
- Element positioning

✅ **Visual Effects**
- Particle effects
- Blur filters
- Backdrop filters
- Box shadows

✅ **Performance**
- FPS counter visibility
- Animation smoothness
- Resource usage
- Rendering performance

## 🖥️ Console Messages

When "Show Console Message" is enabled, you'll see helpful debug output:

```javascript
// When plugin is ENABLED
[DebugMockLoadingScreen] Plugin is ENABLED - Infinite loading active!
[DebugMockLoadingScreen] The game will stay on the loading screen indefinitely.
[DebugMockLoadingScreen] Disable this plugin to allow normal game loading.

// Interception messages
[DebugMockLoadingScreen] Scene_Boot.start() intercepted - Staying on loading screen
[DebugMockLoadingScreen] Graphics.endLoading() blocked - Spinner stays visible

// Helpful tips
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎨 DEBUG LOADING SCREEN ACTIVE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
You can now test your CSS animations!
• Press F12 to open DevTools and inspect elements
• Press F5 to reload and see animations from start
• Resize window to test responsive behavior
• Disable this plugin when done testing
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

```javascript
// When plugin is DISABLED
[DebugMockLoadingScreen] Plugin is DISABLED - Game will load normally
```

## 🔧 Technical Details

### How It Works

The plugin intercepts these RPG Maker MZ methods:

```javascript
Scene_Boot.prototype.start()      // Prevents scene transition
Scene_Boot.prototype.update()     // Stops loading progress
Graphics.endLoading()             // Keeps spinner visible
```

**Result**: Game initializes but never progresses past the boot scene.

### Performance Impact

- **CPU Usage**: ~0.1% (just renders loading screen)
- **Memory**: Minimal (~1MB)
- **No Side Effects**: Doesn't modify game data or save files
- **Clean Exit**: Simply close the game window when done

### What Gets Loaded

✅ **Loaded**:
- Basic engine initialization
- Loading screen CSS and HTML
- Plugin system
- Graphics renderer

❌ **NOT Loaded**:
- Game database
- Map data
- Actor data
- Save files
- Game scenes (Map, Battle, Menu, etc.)

### Browser Compatibility

Works in all modern browsers:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Opera
- ✅ Brave

## 💡 Testing Scenarios

### Scenario 1: Spinner Speed Testing

**Goal**: Test if spinner spins fast enough

```
1. Enable plugin
2. Start playtest
3. Observe spinner rotation
4. If too slow: Adjust CSS animation timing
5. Press F5 to reload and test changes
6. Repeat until satisfied
```

### Scenario 2: Gradient Effect Testing

**Goal**: Perfect the blue-to-purple gradient

```
1. Enable plugin
2. Start playtest  
3. Open DevTools (F12)
4. Inspect #loadingSpinnerImage
5. Modify border colors in real-time
6. Copy final CSS values
7. Update your CSS file
```

### Scenario 3: Responsive Design Testing

**Goal**: Test mobile/tablet layouts

```
1. Enable plugin
2. Start playtest
3. Open DevTools (F12)
4. Toggle device toolbar (Ctrl+Shift+M)
5. Test different screen sizes
6. Verify spinner scales properly
7. Check positioning on small screens
```

### Scenario 4: Performance Monitoring

**Goal**: Ensure smooth 60 FPS

```
1. Enable plugin
2. Start playtest
3. Open DevTools > Performance tab
4. Start recording
5. Watch for 10-20 seconds
6. Stop recording
7. Analyze frame timing
8. Optimize CSS if needed
```

## 🐛 Troubleshooting

### Game won't load?

**Problem**: Left plugin enabled  
**Solution**: Disable plugin in Plugin Manager  
**Prevention**: Always check plugin status before distribution

### Console messages not showing?

**Problem**: "Show Console Message" is OFF  
**Solution**: Enable in plugin parameters  
**Alternative**: Works fine without messages, they're just helpful

### Want to auto-disable after time?

**Problem**: Testing long-term behavior  
**Solution**: Edit the plugin code:

```javascript
// Find this commented section in the plugin:
/*
if (!this._mockLoadingTimer) {
    this._mockLoadingTimer = 0;
}
this._mockLoadingTimer++;

if (this._mockLoadingTimer > 1800) { // 30 seconds at 60fps
    console.log('%c[DebugMockLoadingScreen] Auto-disabling after 30 seconds', 
        'color: #ff6b6b; font-weight: bold;');
    _Scene_Boot_start.call(this);
}
*/

// Uncomment it to auto-disable after 30 seconds
```

### CSS changes not applying?

**Problem**: Browser cache  
**Solution**: Hard refresh (Ctrl+F5 or Cmd+Shift+R)  
**Alternative**: Open DevTools > Disable cache (while DevTools open)

## 💻 Developer Tips

### Quick CSS Iteration

```
1. Keep game window open with plugin enabled
2. Edit CSS file in your code editor
3. Press F5 in game window to reload
4. Immediately see changes
5. No need to restart RPG Maker MZ!
```

### Using Browser DevTools

**Chrome DevTools Shortcuts:**
```
F12              - Open/close DevTools
Ctrl+Shift+C     - Element inspector
Ctrl+Shift+M     - Device toolbar (responsive testing)
Ctrl+Shift+P     - Command palette
Ctrl+F           - Search in elements
```

**Useful DevTools Features:**
- **Elements Tab**: Inspect and modify CSS in real-time
- **Console Tab**: View plugin debug messages
- **Performance Tab**: Monitor FPS and rendering
- **Network Tab**: Check if resources loaded correctly

### CSS Testing Checklist

```
☐ Spinner rotates smoothly
☐ Gradient colors look correct
☐ Glow effects are visible
☐ Animation timing feels right
☐ No flickering or stuttering
☐ Works at different window sizes
☐ Maintains 60 FPS
☐ Positioning is correct
☐ Z-index layering is proper
☐ Responsive breakpoints work
```

## 🚀 Advanced Usage

### Testing Multiple CSS Variants

```
1. Enable plugin
2. Start playtest
3. Open DevTools > Elements
4. Find #loadingSpinnerImage
5. Modify CSS properties live
6. Take screenshots of variants
7. Compare and choose best version
8. Update your CSS file
```

### Performance Profiling

```
1. Enable plugin
2. Start playtest
3. Open DevTools > Performance
4. Click Record button
5. Wait 10 seconds
6. Click Stop button
7. Review frame timing
8. Look for dropped frames
9. Identify performance bottlenecks
```

### A/B Testing Animations

```javascript
// Create two CSS animation variants
@keyframes spinFast {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

@keyframes spinSlow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

// Test each one:
animation: spinFast 0.8s linear infinite;  // Test this
animation: spinSlow 1.5s linear infinite;  // Then this
```

## 📋 Pre-Release Checklist

Before releasing your game, verify:

```
☐ Plugin is DISABLED in Plugin Manager
☐ Game actually loads to title screen
☐ Tested on clean project without plugin
☐ Removed plugin from plugins folder (optional but recommended)
☐ Loading screen appears briefly then disappears
☐ No infinite loading in production build
☐ No console errors related to loading
☐ Save/Load functionality works correctly
```

## 🎓 Example Workflow

**Real Development Session:**

```
9:00 AM - Morning CSS Work
1. Enable DebugMockLoadingScreen
2. Start playtest
3. Test spinner gradient colors
4. Adjust in DevTools
5. Update CSS file
6. F5 to reload
7. Perfect! Disable plugin.

10:00 AM - Continue Game Development  
1. Plugin still disabled
2. Working on maps and events
3. Everything loads normally

2:00 PM - More CSS Tweaks
1. Re-enable DebugMockLoadingScreen
2. Test responsive design
3. Verify mobile layout
4. Disable plugin again

End of Day
1. Double-check plugin is disabled
2. Commit code to version control
3. Note: Plugin was only for CSS testing
```

## 📄 License

This project is licensed under the **Creative Commons Attribution 4.0 International License**.

You are free to:
* ✅ **Share** — copy and redistribute in any medium or format
* ✅ **Adapt** — remix, transform, and build upon the material
* ✅ **Commercial Use** — use for commercial projects

Under the following terms:
* 📝 **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.

[View Full License](https://creativecommons.org/licenses/by/4.0/)

## 👏 Credits

* **Author**: Alexandros Panagiotakopoulos
* **Website**: [alexandrospanag.github.io](https://alexandrospanag.github.io)
* **Framework**: RPG Maker MZ Plugin System
* **Technologies**: JavaScript ES6+, CSS3 Animation Testing
* **Inspiration**: Modern web development tools and live reload functionality

## 📝 Changelog

### Version 1.0.0 (2025-11-19)
- ✨ Initial release
- 🎨 Infinite loading screen for CSS testing
- 💬 Color-coded console messages
- 🎮 Simple enable/disable toggle
- 🔧 Zero impact on game data
- 📊 Performance monitoring support
- 🛠️ DevTools integration friendly
- ⚡ Lightweight and clean

## ⚠️ Final Warning

**SERIOUSLY, DON'T FORGET TO DISABLE THIS!**

We cannot stress this enough:

1. This plugin is **ONLY** for CSS testing
2. It **BREAKS** your game intentionally
3. **DISABLE IT** before releasing
4. Check **TWICE** before distributing
5. Your players will **NOT** be happy if you leave it on

**You've been warned!** 😊

---

## 🤝 Contributing

Found this useful? Have improvements?
- 🐛 Report issues on GitHub
- 💡 Suggest new features
- 🔧 Submit pull requests
- ⭐ Star the repository if it helped!


## ⚡ Quick Reference

```javascript
// Enable: Plugin ON
Result: Game stuck on loading screen ✅

// Disable: Plugin OFF  
Result: Game loads normally ✅

// Before Release: Plugin DISABLED or REMOVED
Result: Players can actually play your game ✅✅✅
```

---

**Made with ❤️ for CSS perfectionists**

*Test your loading screen in style!* 🎨✨

**P.S.** - If you ship with this enabled, we told you so. 😄
