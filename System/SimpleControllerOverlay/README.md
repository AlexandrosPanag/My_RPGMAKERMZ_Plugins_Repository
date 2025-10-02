# Simple Controller Overlay for RPG Maker MZ

A clean, lightweight controller button overlay plugin that displays controller prompts when a gamepad is detected. Perfect for providing visual controller guidance without interfering with existing game systems.

## 🎮 Features

### **Visual Controller Overlay**
- **Clean button display** showing controller-specific prompts
- **Auto-detection** of PlayStation DualSense and Xbox controllers
- **Authentic button styling** with proper colors and gradients
- **Non-invasive** - pure visual overlay with no input system modifications

### **Controller Support**
- **PlayStation DualSense**: □ (Square), × (Cross), △ (Triangle), R3
- **Xbox Controllers**: X, A, Y, R3
- **Auto-detection** based on controller ID
- **Manual override** options available

### **Smart Positioning**
- **Upper-right placement** near RPG Maker MZ menu areas
- **Multiple position options** (corners, menu area)
- **Menu-only display** option to show only during menus
- **Responsive design** that adapts to different scenes

## 📋 Button Layout

### PlayStation DualSense
| Button | Action | Color |
|--------|--------|-------|
| **□ (Square)** | Select | Pink/Magenta |
| **× (Cross)** | Back | Blue |
| **△ (Triangle)** | Menu | Green |
| **R3 (Right Stick)** | Jump | Gray |

### Xbox Controller
| Button | Action | Color |
|--------|--------|-------|
| **X** | Select | Blue |
| **A** | Back | Green |
| **Y** | Menu | Yellow |
| **R3 (Right Stick)** | Jump | Gray |

## 🚀 Installation

1. **Download** `SimpleControllerOverlay.js`
2. **Place** in your `js/plugins/` folder
3. **Enable** in RPG Maker MZ Plugin Manager
4. **Configure** settings as desired
5. **Test** with a connected controller

## ⚙️ Configuration

### Plugin Parameters

| Parameter | Description | Options | Default |
|-----------|-------------|---------|---------|
| **Controller Type** | Which controller to display | Auto-Detect, PlayStation, Xbox | Auto-Detect |
| **Overlay Position** | Where to show the overlay | Upper Right, Bottom Right, etc. | Upper Right (Menu Area) |
| **Show Only in Menus** | Display only during menu scenes | True/False | True |

### Position Options
- **Upper Right (Menu Area)** - Near pause menu elements *(Recommended)*
- **Bottom Right** - Lower right corner
- **Bottom Left** - Lower left corner  
- **Top Right** - Upper right corner
- **Top Left** - Upper left corner

## 🛡️ Compatibility

### **Zero Conflicts**
This plugin is designed to be **completely independent** and conflict-free:

- ✅ **VisuMZ CoreEngine** - No interference with button assist systems
- ✅ **VisuMZ MainMenuCore** - Works alongside menu modifications
- ✅ **Other controller plugins** - Pure visual overlay only
- ✅ **Input system plugins** - No input modifications made

### **Safe to Use With**
- All VisuMZ plugins
- Other controller detection plugins
- Input modification plugins
- Menu enhancement plugins

### **Replaces/Alternative to**
- Complex controller icon replacement systems
- Input system override plugins
- HTML injection controller plugins

## 🐛 Troubleshooting

### Controller Not Detected
```javascript
// Test in browser console (F12)
testControllerOverlay()
```

### Common Issues

| Issue | Solution |
|-------|----------|
| **Overlay not showing** | Check controller connection and plugin enabled |
| **Wrong controller type** | Set manual controller type in parameters |
| **Position issues** | Try different overlay position settings |
| **Menu conflicts** | Disable other controller plugins |

### Debug Commands
```javascript
// Force show overlay for testing
testControllerOverlay()

// Check controller detection
navigator.getGamepads()
```

## 🔧 Technical Details

### **Architecture**
- **Independent detection** using Gamepad API
- **Pure CSS styling** for authentic button appearance
- **Error isolation** prevents conflicts with other systems
- **Scene-aware** display logic

### **Performance**
- **Minimal overhead** - 1-second polling interval
- **No input hooks** - visual display only
- **Efficient rendering** - updates only when needed
- **Memory safe** - proper cleanup on scene transitions

### **Browser Compatibility**
- Chrome/Chromium (recommended)
- Firefox
- Edge
- Any browser with Gamepad API support

## 📄 File Structure

```
js/plugins/
├── SimpleControllerOverlay.js    # Main plugin file

```

## 🎯 Use Cases

### **Perfect For**
- **Indie games** wanting controller support indication
- **PC ports** of console games
- **Hybrid input** games (keyboard + controller)
- **Accessibility** features for controller users

### **Game Genres**
- RPGs with menu navigation
- Action games with quick inputs
- Puzzle games with controller shortcuts
- Any game supporting controllers

## 📝 Version History

### v1.0.0 (Current)
- Initial release
- PlayStation DualSense and Xbox controller support
- Auto-detection and manual override
- Multiple positioning options
- Menu-aware display logic
- Complete conflict prevention

## 📄 License & Terms

### Copyright Notice

**Copyright © Alexandros Panagiotakopoulos. All Rights Reserved.**

### Usage Rights

- ✅ **Free for commercial use** (with attribution)
- ✅ **Free for non-commercial use** (with attribution)  
- ✅ **Modify as needed for your project**
- ✅ **Redistribute with proper attribution**

### Attribution Requirements

**Attribution is REQUIRED.** Please include the following credit:

**In your game credits:**
```
SimpleControllerOverlay.js Plugin
Copyright © Alexandros Panagiotakopoulos
```

**In documentation or readme files:**
```
Performance monitoring powered by SimpleControllerOverlay.js
Created by Alexandros Panagiotakopoulos
```

**Minimum attribution:**
```
Plugin by Alexandros Panagiotakopoulos
```

### Disclaimer

This plugin is provided "as is" without warranty. Use at your own risk and always backup your project before installing new plugins.

**Copyright © Alexandros Panagiotakopoulos. All Rights Reserved.**

---

**Simple Controller Overlay** - Making controller support visible and accessible! 🎮✨
