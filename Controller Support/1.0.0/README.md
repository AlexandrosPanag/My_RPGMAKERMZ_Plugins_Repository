## Repository for both DualSense and XBOX Controller support compatibility

Compatible with PartyJump which can be downloaded here:
[PartyJump.js](https://github.com/AlexandrosPanag/My_RPGMAKERMZ_Plugins_Repository/tree/main/Gameplay/PartyJump)


# 🎮 RPG Maker MZ Controller Detection Plugin Documentation

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-2.0.0-green)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)

## 👤 Author

**Alexandros Panagiotakopoulos**

---

**Copyright © 2025-2026 Alexandros Panagiotakopoulos. All Rights Reserved.**

**Version:** 1.0.0  
**Compatibility:** RPG Maker MZ  
**Copyright:** Alexandros Panagiotakopoulos. All Rights Reserved Ⓒ  
**License:** Free to use with attribution required  

---

Version 2.0.0 Changelog:
- Added integrated button overlay system
- Enhanced DualSense controller detection
- Unified notification and overlay functionality
- Improved performance with single polling system
- Added comprehensive controller type auto-detection
- Enhanced visual button mapping display

## 📖 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Plugin Parameters](#plugin-parameters)
5. [Controller Support](#controller-support)
6. [Button Mappings](#button-mappings)
7. [Developer Console Commands](#developer-console-commands)
8. [Visual Display System](#visual-display-system)
9. [Usage Examples](#usage-examples)
10. [Advanced Features](#advanced-features)
11. [Integration Tips](#integration-tips)
12. [Performance & Optimization](#performance--optimization)
13. [Troubleshooting](#troubleshooting)
14. [FAQ](#faq)

## 🎯 Overview

The Controller Detection plugin provides comprehensive gamepad support for your RPG Maker MZ game. It automatically detects when controllers are connected or disconnected, displays visual notifications, and shows an elegant button overlay to help players understand controller mappings.

### Key Benefits:
- **Automatic detection** - Instantly recognizes connected controllers
- **Visual notifications** - Shows connection/disconnection alerts
- **Button overlay** - Displays controller button mappings on-screen
- **Multi-controller support** - Detects PlayStation, Xbox, and generic controllers
- **Developer friendly** - Extensive API and debugging tools
- **Save/Load compatible** - Controller state preserved across sessions

---

## ✨ Features

### 🎮 Controller Detection
- Automatic gamepad connection/disconnection detection
- Real-time controller status monitoring
- Support for PlayStation DualSense, DualShock 4, Xbox, and generic controllers
- Controller type auto-detection
- Multi-controller support with active controller management

### 🔔 Visual Notifications
- **Connection notifications** - Green popup when controller connects
- **Disconnection notifications** - Red popup when controller disconnects
- **Controller identification** - Shows specific controller name
- **Customizable positioning** - Choose notification location
- **Auto-hide** - Notifications fade after set duration
- **Smart hiding** - Auto-hides during custom menus

### 🎨 Button Overlay System
- **Real-time button display** - Shows current controller buttons
- **Correct mappings** - Displays actual button functions (Confirm, Cancel, Dash, Menu)
- **Controller-specific icons** - Different visuals for PlayStation vs Xbox
- **Adaptive visibility** - Only shows when controller is connected
- **Scene-aware** - Hides during menus and cutscenes
- **Customizable position** - Multiple placement options

### 🔧 Developer API
- Complete controller state access
- Button press detection
- Axis value reading
- Controller testing tools
- Real-time debugging

---

## 📦 Installation

### **Step-by-Step Guide:**

1. **Download/Save the Plugin**
   - Save the plugin file as `ControllerDetection.js` (exact filename is important!)
   - Place it in your project's `js/plugins/RE;LIVE/` folder

2. **Enable in RPG Maker MZ**
   - Open your project in RPG Maker MZ
   - Go to **Tools** → **Plugin Manager**
   - Find "ControllerDetection" in the list
   - Check the box to enable it
   - Click **OK**

3. **Configure Parameters**
   - Double-click the ControllerDetection plugin in Plugin Manager
   - **IMPORTANT:** Ensure "Enable Button Overlay" is `true` for visual button display
   - Set "Show Connection Notifications" to `true` for connection alerts
   - Adjust notification and overlay positions as desired
   - Click **OK** to save

4. **Test Your Game**
   - Save your project
   - Connect a controller (DualSense, Xbox, or compatible gamepad)
   - Test play your game
   - You should see a connection notification and button overlay appear

### **File Structure:**
```
YourProject/
├── js/
│   └── plugins/
│       └── RE;LIVE/
│           └── ControllerDetection.js  ← Must be in this location
└── data/
    └── Plugins.json                    ← Auto-updated by Plugin Manager
```

### **Important Notes:**
- **Controller must be connected BEFORE starting game** or connect during gameplay
- **Button overlay requires "Enable Button Overlay" parameter set to true**
- Works with most modern controllers supporting the Gamepad API

---

## ⚙️ Plugin Parameters

### **Detection Settings**

| Parameter | Default | Description |
|-----------|---------|-------------|
| **Enable Controller Detection** | true | Master switch for entire system |
| **Enable Controller Input API** | true | Enable API access for other plugins |
| **Enable Console Debug** | true | Show debug info in F8/F12 console |

### **Notification Settings**

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| **Show Connection Notifications** | true | true/false | Display popup when controllers connect/disconnect |
| **Notification Position** | Bottom Right | Bottom Right, Bottom Center, Top Right, Top Left | Where notifications appear |
| **Notification Duration** | 5 seconds | 2-15 seconds | How long notifications stay visible |

### **Button Overlay Settings**

| Parameter | Default | Options | Description |
|-----------|---------|---------|-------------|
| **Enable Button Overlay** | true | true/false | **MUST BE TRUE** for button display |
| **Controller Type** | Auto-Detect | Auto-Detect, PlayStation, Xbox | Override auto-detection if needed |
| **Overlay Position** | Upper Right | Menu Area, Bottom Right/Left, Top Right/Left | Button overlay location |
| **Show Only in Menus** | true | true/false | Show overlay only in menus (false = always show) |

### **⚠️ Important Notes:**
- **Button Overlay MUST be enabled** for visual button mappings
- Auto-Detect works best for proper controller icon display
- Notification duration minimum is 2 seconds for readability

---

## 🎮 Controller Support

### **Officially Supported Controllers**

| Controller Type | Detection Method | Button Icons | Auto-Detect |
|----------------|------------------|--------------|-------------|
| 🎮 **PlayStation DualSense** (PS5) | Vendor ID 054c, "DualSense" in name | PlayStation buttons (×, □, ○, △) | ✅ Yes |
| 🎮 **PlayStation DualShock 4** (PS4) | Vendor ID 054c, "DualShock" in name | PlayStation buttons | ✅ Yes |
| 🎮 **Xbox Controllers** (Series X/S, One) | Vendor ID 045e, XInput detection | Xbox buttons (A, B, X, Y) | ✅ Yes |
| 🎮 **Generic USB Gamepads** | Standard Gamepad API | Xbox-style buttons | ✅ Fallback |

### **Browser Compatibility**

| Browser | Windows | macOS | Linux | Notes |
|---------|---------|-------|-------|-------|
| **Chrome/Edge** | ✅ Full | ✅ Full | ✅ Full | Best compatibility |
| **Firefox** | ✅ Full | ✅ Full | ✅ Full | Excellent support |
| **Safari** | ⚠️ Limited | ✅ Good | N/A | Some detection quirks |
| **NW.js** | ✅ Full | ✅ Full | ✅ Full | Desktop deployment |

### **Connection Requirements**
- **USB Connection:** Plug in before or during gameplay
- **Bluetooth (DualSense/DualShock):** Pair via system settings, then start game
- **Xbox Wireless:** Use Xbox Wireless Adapter or USB cable
- **Generic Controllers:** Standard HID-compliant gamepads

### **Controller Detection Priority**
1. **DualSense detection** - Checks for PS5 controller first
2. **DualShock detection** - Checks for PS4 controller
3. **Xbox detection** - Checks for Xbox controllers
4. **Generic fallback** - Any other Gamepad API device

---

## 🎯 Button Mappings

### **Default Button Configuration**

The plugin uses the following button mappings optimized for DualSense/PlayStation controllers:

#### **PlayStation Controllers (DualSense/DualShock)**
| Physical Button | Button Index | RPG Maker Function | In-Game Action |
|----------------|--------------|-------------------|----------------|
| **Cross (×)** | 0 | "ok" | **Confirm** - Select menu items, interact |
| **Square (□)** | 2 | "cancel" | **Cancel** - Go back, close menus |
| **Circle (○)** | 1 | "shift" | **Dash** - Run/sprint |
| **Triangle (△)** | 3 | "menu" | **Menu** - Open main menu |
| **L1 Bumper** | 4 | "pageup" | Page Up - Navigate menus |
| **R1 Bumper** | 5 | "pagedown" | Page Down - Navigate menus |
| **Options** | 9 | "menu" | Open menu |
| **D-Pad Up** | 12 | "up" | Navigate up, World Map |
| **D-Pad Down** | 13 | "down" | Navigate down |
| **D-Pad Left** | 14 | "left" | Navigate left |
| **D-Pad Right** | 15 | "right" | Navigate right |

#### **Xbox Controllers**
| Physical Button | Button Index | RPG Maker Function | In-Game Action |
|----------------|--------------|-------------------|----------------|
| **A Button** | 0 | "ok" | **Confirm** - Select menu items, interact |
| **X Button** | 2 | "cancel" | **Cancel** - Go back, close menus |
| **B Button** | 1 | "shift" | **Dash** - Run/sprint |
| **Y Button** | 3 | "menu" | **Menu** - Open main menu |
| **LB Bumper** | 4 | "pageup" | Page Up - Navigate menus |
| **RB Bumper** | 5 | "pagedown" | Page Down - Navigate menus |
| **Start/Menu** | 9 | "menu" | Open menu |
| **D-Pad Up** | 12 | "up" | Navigate up, World Map |
| **D-Pad Down** | 13 | "down" | Navigate down |
| **D-Pad Left** | 14 | "left" | Navigate left |
| **D-Pad Right** | 15 | "right" | Navigate right |

### **Button Overlay Display**

The on-screen overlay shows these four primary buttons:

**PlayStation Overlay:**
```
[×] Confirm  |  [□] Cancel  |  [○] Dash  |  [△] Menu
```

**Xbox Overlay:**
```
[A] Confirm  |  [X] Cancel  |  [B] Dash  |  [Y] Menu
```

### **Important Note on Button Indices**
⚠️ **DualSense controllers use non-sequential button numbering:**
- Button 0 = Cross (×)
- Button 1 = Circle (○) ← **NOT** Square!
- Button 2 = Square (□)
- Button 3 = Triangle (△)

This is different from Xbox controllers where buttons are sequential. The plugin handles this automatically!

---

## 🛠️ Developer Console Commands

Open developer console (**F8** in test mode, **F12** in browser) and use these for testing:

### **System Status Commands**
```javascript
$controllerDetection.getStatus()
// Returns complete system status:
// - Initialization state
// - Active controller info
// - Connected controllers list
// - API enabled status
// - All current settings

$controllerDetection.getControllerInfo()
// Returns detailed controller information:
// - Live gamepad data
// - Detected controllers
// - Button/axis counts
// - Connection timestamps
```

### **Controller Information**
```javascript
$controllerDetection.getCurrentController()
// Returns active controller details:
// - Controller index
// - Controller ID string
// - Connection status
// - Controller name
// - Timestamp

$controllerDetection.getControllerState(0)
// Returns real-time controller state:
// - All button states (pressed, touched, value)
// - All axis values
// - Current timestamp
// (Use controller index, or omit for active controller)
```

### **Testing & Diagnostics**
```javascript
$controllerDetection.testController(0)
// Test controller input in real-time
// Press buttons and see console output
// Returns: true if controller found, false if not

$controllerDetection.scanControllers()
// Manually scan for connected controllers
// Useful if controller connected after game start
// Returns full controller info
```

### **Notification Control**
```javascript
$controllerDetection.hideNotifications()
// Manually hide all controller notifications
// Useful during cutscenes or special events

$controllerDetection.showNotifications()
// Re-show hidden notifications
// Restores normal notification behavior
```

### **Quick Reference Table**

| Command | Purpose | Returns |
|---------|---------|---------|
| `getStatus()` | System health check | Object with initialization, settings, controllers |
| `getControllerInfo()` | Detailed controller data | Object with live gamepads and detected controllers |
| `getCurrentController()` | Active controller details | Object with current controller info or null |
| `getControllerState(index)` | Real-time button/axis data | Object with buttons array and axes array |
| `testController(index)` | Interactive button testing | Boolean (true if found) |
| `scanControllers()` | Force controller scan | Object with controller info |
| `hideNotifications()` | Disable notifications | undefined |
| `showNotifications()` | Enable notifications | undefined |

### **Example Testing Workflow**
```javascript
// 1. Check if system is working
$controllerDetection.getStatus()

// 2. See what controllers are detected
$controllerDetection.getControllerInfo()

// 3. Test active controller buttons
$controllerDetection.testController()
// Now press buttons and watch console

// 4. Check button states in real-time
$controllerDetection.getControllerState()

// 5. Force rescan if controller just connected
$controllerDetection.scanControllers()
```

---

## 🎨 Visual Display System

### **Connection Notifications**

#### **Notification Types**

**Connection Notification (Green):**
```
🎮 Controller Connected
   PlayStation DualSense
```
- **Color:** Green background with green border
- **Duration:** 5 seconds (configurable)
- **Trigger:** When controller is connected
- **Animation:** Slide-in from position

**Disconnection Notification (Red):**
```
❌ Controller Disconnected
   PlayStation DualSense
```
- **Color:** Red background with red border
- **Duration:** 5 seconds (configurable)
- **Trigger:** When controller is disconnected
- **Animation:** Slide-out reverse

#### **Notification Positioning**

| Position | Visual Location | Best For |
|----------|----------------|----------|
| **Bottom Right** | Lower right corner | Default, non-intrusive |
| **Bottom Center** | Center bottom | High visibility |
| **Top Right** | Upper right corner | Away from UI elements |
| **Top Left** | Upper left corner | Alternative placement |

### **Button Overlay System**

#### **Overlay Design**

The button overlay shows a modern, sleek design with:
- **Gradient background** - Dark semi-transparent with blur
- **Separated buttons** - Divider lines between each button
- **Button icons** - Accurate PlayStation or Xbox button graphics
- **Labels** - Clear function names (Confirm, Cancel, Dash, Menu)
- **Shadows & depth** - Professional 3D appearance

**PlayStation Visual Example:**
```
┌───────────────────────────────────────────────────────┐
│  [×] Confirm  │  [□] Cancel  │  [○] Dash  │  [△] Menu │
└───────────────────────────────────────────────────────┘
```

**Xbox Visual Example:**
```
┌───────────────────────────────────────────────────────┐
│  [A] Confirm  │  [X] Cancel  │  [B] Dash  │  [Y] Menu │
└───────────────────────────────────────────────────────┘
```

#### **Button Color Coding**

**PlayStation Buttons:**
- **Cross (×)** - Blue circle - Confirm action
- **Square (□)** - Pink square - Cancel action
- **Circle (○)** - Red circle - Dash action
- **Triangle (△)** - Green triangle - Menu action

**Xbox Buttons:**
- **A Button** - Green circle - Confirm action
- **X Button** - Blue circle - Cancel action
- **B Button** - Red circle - Dash action
- **Y Button** - Yellow circle - Menu action

#### **Overlay Positioning**

| Position | Location | Coordinates | Best For |
|----------|----------|-------------|----------|
| **Upper Right (Menu Area)** | Top-right, 20px margin | (right: 20px, top: 20px) | Default, near pause menu |
| **Bottom Right** | Bottom-right corner | (right: 20px, bottom: 20px) | Always visible |
| **Bottom Left** | Bottom-left corner | (left: 20px, bottom: 20px) | Left-handed preference |
| **Top Right** | Top-right corner | (right: 20px, top: 20px) | Minimal interference |
| **Top Left** | Top-left corner | (left: 20px, top: 20px) | Alternative placement |

#### **Visibility Logic**

The overlay automatically shows/hides based on:

✅ **Shows When:**
- Controller is connected
- Not in title screen
- Not in custom menu
- Not paused (if "Show Only in Menus" is false)
- Not during message windows
- Not during scene transitions

❌ **Hides When:**
- No controller connected
- In title screen (Scene_Title)
- In custom menu (Scene_CustomMenu)
- During message windows
- During scene changes
- In pause menu (if "Show Only in Menus" is true)

---

## 🎯 Usage Examples

### **Basic Controller Detection**
```javascript
// Check if any controller is connected
if ($controllerDetection.getCurrentController()) {
    $gameMessage.add("Controller detected! Use gamepad controls.");
} else {
    $gameMessage.add("No controller found. Use keyboard controls.");
}
```

### **Controller Type-Specific Messages**
```javascript
// In a Conditional Branch with Script:
$controllerDetection.getCurrentController()

// TRUE Branch:
let controller = $controllerDetection.getCurrentController();
if (controller.id.toLowerCase().includes('dualsense')) {
    $gameMessage.add("DualSense detected! Press × to confirm.");
} else if (controller.id.toLowerCase().includes('xbox')) {
    $gameMessage.add("Xbox controller detected! Press A to confirm.");
}

// FALSE Branch:
$gameMessage.add("Please connect a controller.");
```

### **Dynamic Control Hints**
```javascript
// Show appropriate button prompts based on controller
let controller = $controllerDetection.getCurrentController();
let confirmButton = "Enter key";

if (controller) {
    if (controller.id.toLowerCase().includes('dualsense')) {
        confirmButton = "× button";
    } else {
        confirmButton = "A button";
    }
}

$gameMessage.add(`Press ${confirmButton} to continue.`);
```

### **Button State Checking**
```javascript
// Check if specific button is pressed
let state = $controllerDetection.getControllerState();
if (state && state.buttons[0].pressed) {
    // Confirm button (Cross/A) is currently pressed
    console.log("Confirm button pressed!");
}
```

### **Cutscene Notification Control**
```javascript
// At cutscene start:
$controllerDetection.hideNotifications();

// ... cutscene events ...

// At cutscene end:
$controllerDetection.showNotifications();
```

### **Controller Connection Events**
```javascript
// Parallel process event checking for controllers
if (!$controllerDetection.getCurrentController()) {
    // Show tutorial for keyboard controls
    $gameVariables.setValue(1, 0); // Keyboard mode
} else {
    // Show tutorial for gamepad controls
    $gameVariables.setValue(1, 1); // Gamepad mode
}
```

### **Achievement/Trophy System**
```javascript
// Award achievement for using specific controller
let controller = $controllerDetection.getCurrentController();
if (controller && controller.id.toLowerCase().includes('dualsense')) {
    // Unlock "PlayStation Player" achievement
    $gameSwitches.setValue(50, true);
}
```

---

## 🚀 Advanced Features

### **Multi-Controller Management**

The plugin automatically manages multiple connected controllers:

```javascript
// Get information about all controllers
let info = $controllerDetection.getControllerInfo();
console.log(`Total controllers: ${info.liveGamepads.length}`);

// List all connected controllers
info.detectedControllers.forEach((controller, index) => {
    console.log(`Controller ${index}: ${controller.name}`);
});
```

**Active Controller Logic:**
- First connected controller becomes "active"
- If active controller disconnects, next available becomes active
- Controllers tracked by unique index (0-3 typically)

### **Real-Time Button Monitoring**

```javascript
// Monitor all button states in real-time
let state = $controllerDetection.getControllerState();

state.buttons.forEach((button, index) => {
    if (button.pressed) {
        console.log(`Button ${index} pressed! (${button.value})`);
    }
});

// Check analog stick positions
console.log(`Left stick X: ${state.axes[0]}`);
console.log(`Left stick Y: ${state.axes[1]}`);
console.log(`Right stick X: ${state.axes[2]}`);
console.log(`Right stick Y: ${state.axes[3]}`);
```

### **Custom Button Overlay Extensions**

The overlay can be dynamically updated:

```javascript
// Force overlay visibility update
if (window.$controllerDetection && window.$controllerDetection.overlayElement) {
    window.$controllerDetection.updateOverlayVisibility();
}

// Force overlay content refresh
if (window.$controllerDetection) {
    window.$controllerDetection.updateOverlayContent();
}
```

### **Notification System Integration**

```javascript
// Programmatically trigger custom notifications
// (Advanced usage - requires modifying plugin code)

// Example structure for custom controller events:
window.addEventListener('gamepadconnected', (e) => {
    console.log('Custom handler: Controller connected!');
    // Your custom logic here
});

window.addEventListener('gamepaddisconnected', (e) => {
    console.log('Custom handler: Controller disconnected!');
    // Your custom logic here
});
```

### **Save/Load Integration**

The plugin automatically integrates with save/load:

**What Gets Saved:**
- Controller connection state
- Active controller index
- Controller type (PlayStation/Xbox)
- Notification visibility state

**What Gets Restored:**
- Controller rescan on load
- Notification state restoration
- Overlay recreation if controller still connected

### **Scene-Specific Behavior**

The plugin adapts to different game scenes:

| Scene Type | Notifications | Button Overlay | Detection |
|-----------|---------------|----------------|-----------|
| **Scene_Map** | ✅ Show | ✅ Show | ✅ Active |
| **Scene_Menu** | ✅ Show | ✅ Show | ✅ Active |
| **Scene_Battle** | ✅ Show | ✅ Show | ✅ Active |
| **Scene_Title** | ❌ Hide | ❌ Hide | ✅ Active |
| **Scene_CustomMenu** | ❌ Hide | ❌ Hide | ✅ Active |
| **Scene transitions** | ✅ Show | ❌ Hide | ✅ Active |

---

## 🔧 Integration Tips

### **Working with Other Plugins**

#### **Input Plugins**
```javascript
// Coordinate with other input systems
if ($controllerDetection.getCurrentController()) {
    // Use gamepad input priority
    InputManager.setMode('gamepad');
} else {
    // Fallback to keyboard
    InputManager.setMode('keyboard');
}
```

#### **UI Enhancement Plugins**
```javascript
// Adjust UI based on controller presence
if ($controllerDetection.getCurrentController()) {
    // Show gamepad-friendly UI
    UIManager.setLayout('gamepad');
} else {
    // Show keyboard/mouse UI
    UIManager.setLayout('desktop');
}
```

#### **Tutorial Systems**
```javascript
// Dynamic tutorial text
let controller = $controllerDetection.getCurrentController();
if (controller) {
    if (controller.id.includes('DualSense')) {
        Tutorial.show("Press × to jump, □ to attack");
    } else {
        Tutorial.show("Press A to jump, X to attack");
    }
} else {
    Tutorial.show("Press Z to jump, X to attack");
}
```

### **Custom Menu Integration**

```javascript
// In custom menu scenes, check controller status
Scene_CustomMenu.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
    
    // Hide controller notifications during custom menu
    if ($controllerDetection) {
        $controllerDetection.hideNotifications();
    }
};

Scene_CustomMenu.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
    
    // Restore notifications after custom menu
    if ($controllerDetection) {
        $controllerDetection.showNotifications();
    }
};
```

### **Event System Patterns**

**Controller-Required Events:**
```javascript
// Check if player has controller for mini-game
if (!$controllerDetection.getCurrentController()) {
    $gameMessage.add("This mini-game requires a controller!");
    $gameMessage.add("Please connect a gamepad to continue.");
    // Exit event or provide alternative
} else {
    // Proceed with controller-based mini-game
}
```

**Controller Type Branching:**
```javascript
// Conditional Branch > Script
$controllerDetection.getCurrentController() && 
$controllerDetection.getCurrentController().id.includes('DualSense')

// TRUE: PlayStation-specific instructions/rewards
// FALSE: Generic or Xbox instructions
```

---

## 📊 Performance & Optimization

### **System Requirements**
- **CPU Usage:** Minimal (< 0.5% on modern systems)
- **Memory Usage:** ~100KB RAM
- **Frame Rate Impact:** None (polling at 500ms intervals)
- **Save File Size:** +~500 bytes

### **Optimization Features**
- **Smart Polling:** Controller state checked every 500ms, not every frame
- **Event-Driven Updates:** Connection/disconnection uses browser events
- **Conditional Rendering:** Overlay only renders when visible
- **Cached Controller Info:** Type detection cached after first identification
- **Scene-Aware:** Notifications/overlays disabled in appropriate scenes

### **Performance Best Practices**

✅ **Efficient Usage:**
```javascript
// Cache controller info if using multiple times
let controller = $controllerDetection.getCurrentController();
if (controller) {
    let name = controller.info.name;
    let id = controller.id;
    // Use cached data...
}
```

❌ **Avoid Inefficiency:**
```javascript
// Don't call getControllerState() every frame in tight loops
for (let i = 0; i < 1000; i++) {
    let state = $controllerDetection.getControllerState(); // Bad!
}
```

### **Production Optimizations**

For release builds:
1. **Disable Console Debug** - Set "Enable Console Debug" to false
2. **Disable Notifications** (optional) - If overlay is sufficient
3. **Test on Target Platforms** - Verify performance on min-spec hardware

### **Compatibility Notes**
- ✅ **RPG Maker MZ:** All versions 1.0.0+
- ✅ **Mobile Deployment:** Compatible (if device supports Gamepad API)
- ✅ **Web Deployment:** Works in all modern browsers
- ✅ **NW.js Versions:** All supported versions
- ✅ **Steam Deck:** Full compatibility via browser gamepad API

---

## 🆘 Troubleshooting

### **Common Issues & Solutions**

#### **🚫 Controller Not Detected**

**Symptoms:** No notifications, overlay doesn't appear, console shows no controller

**Causes & Solutions:**
1. ❌ **Controller not connected** → ✅ Plug in USB or pair Bluetooth before/during game
2. ❌ **Browser doesn't support Gamepad API** → ✅ Use Chrome, Firefox, or Edge
3. ❌ **Controller drivers not installed** → ✅ Install official drivers (Xbox Accessories, DS4Windows, etc.)
4. ❌ **Permission issues (web)** → ✅ Check browser permissions for gamepad access

**Quick Diagnostic:**
```javascript
// Check if Gamepad API is available
console.log('Gamepad API supported:', !!navigator.getGamepads);

// Manual controller scan
$controllerDetection.scanControllers();

// Check system status
$controllerDetection.getStatus();
```

#### **🎨 Button Overlay Not Showing**

**Symptoms:** Notifications work, but no button overlay visible

**Most Common Fix:** ✅ **Enable "Enable Button Overlay" in Plugin Manager**

**Other Causes & Solutions:**
1. ❌ **Parameter disabled** → ✅ Check Plugin Manager: "Enable Button Overlay" = true
2. ❌ **Wrong scene** → ✅ Must be on map (not in title/custom menu)
3. ❌ **"Show Only in Menus" setting** → ✅ Adjust parameter based on desired behavior
4. ❌ **Overlay position off-screen** → ✅ Try different overlay position setting

**Diagnostic Steps:**
```javascript
// Check if overlay element exists
console.log('Overlay element:', $controllerDetection.overlayElement);

// Force visibility update
$controllerDetection.updateOverlayVisibility();

// Check enableButtonOverlay parameter
$controllerDetection.getStatus();
// Look for: buttonOverlayEnabled: true
```

#### **🔔 Notifications Not Appearing**

**Symptoms:** Controller detected, but no popup notifications

**Solutions:**
1. ❌ **Notifications disabled** → ✅ Set "Show Connection Notifications" to true
2. ❌ **In custom menu** → ✅ Notifications auto-hide in Scene_CustomMenu (by design)
3. ❌ **Notifications manually hidden** → ✅ Call `$controllerDetection.showNotifications()`
4. ❌ **Notification duration too short** → ✅ Increase "Notification Duration" parameter

**Quick Fix:**
```javascript
// Force show notifications
$controllerDetection.showNotifications();

// Check notification settings
let status = $controllerDetection.getStatus();
console.log('Show notifications:', status.settings.showNotifications);
```

#### **🎮 Wrong Controller Type Detected**

**Symptoms:** DualSense shows Xbox buttons, or vice versa

**Causes & Solutions:**
1. ❌ **Auto-detection failed** → ✅ Manually set "Controller Type" parameter to "PlayStation" or "Xbox"
2. ❌ **Generic controller** → ✅ Will default to Xbox-style buttons
3. ❌ **Incorrect controller ID string** → ✅ Check console for actual controller ID

**Manual Override:**
```javascript
// Check detected controller type
let controller = $controllerDetection.getCurrentController();
console.log('Controller ID:', controller.id);
console.log('Controller Name:', controller.info.name);

// If wrong, set parameter manually in Plugin Manager:
// Controller Type → PlayStation (for PS controllers)
// Controller Type → Xbox (for Xbox controllers)
```

#### **⚡ Performance Issues**

**Symptoms:** Game lags when controller connected

**Rare, but possible causes:**
1. ❌ **Console logging overhead** → ✅ Disable "Enable Console Debug"
2. ❌ **Too many controllers** → ✅ Disconnect unused controllers
3. ❌ **Conflicting plugins** → ✅ Test with minimal plugin setup

**Performance Check:**
```javascript
// Check system resource usage
$controllerDetection.getStatus();

// Disable console debug in Plugin Manager for production
```

### **Advanced Troubleshooting**

#### **Browser-Specific Issues**

**Safari (macOS/iOS):**
- May have limited Gamepad API support
- Try using Chrome or Firefox instead
- Some controller types may not be recognized

**Firefox:**
- Generally excellent support
- Refresh page if controller not detected immediately

**Chrome/Edge:**
- Best compatibility
- Most reliable for testing

#### **Controller-Specific Fixes**

**DualSense (PS5) Controller:**
```javascript
// Verify DualSense detection
let controller = $controllerDetection.getCurrentController();
if (controller.id.toLowerCase().includes('dualsense')) {
    console.log('DualSense detected correctly');
} else {
    console.log('Detection issue - check USB/Bluetooth connection');
}
```

**Xbox Controllers:**
```javascript
// Xbox controllers may show as "XInput" or generic
// This is normal - plugin handles it automatically
let state = $controllerDetection.getControllerState();
console.log('Total buttons:', state.buttons.length);
// Should be 16-17 for Xbox controllers
```

#### **Plugin Conflict Resolution**

**Common conflict types:**
- **Other controller plugins** → Use only one controller detection plugin
- **Input remapping plugins** → May override button mappings
- **Custom menu plugins** → Already handled (notifications auto-hide)

**Conflict Testing:**
1. Disable all other plugins except ControllerDetection
2. Test if issue persists
3. Re-enable plugins one by one to identify conflicts

---

## 🐛 FAQ

### **General Questions**

**Q: Do I need both SimpleControllerOverlay and ControllerDetection?**
A: No! Version 2.0.0 combines both. Disable `SimpleControllerOverlay.js` if you have it.

**Q: Will this work with my wireless controller?**
A: Yes, if your system recognizes it via Bluetooth and it supports the Gamepad API.

**Q: Can I customize the button colors?**
A: Button visuals are built into the plugin code. Future versions may include customization options.

**Q: Does this support Nintendo Switch Pro Controller?**
A: Yes, it will be detected as a generic controller and use Xbox-style button displays.

### **Technical Questions**

**Q: Why do I see Xbox buttons for my PlayStation controller?**
A: Auto-detection may have failed. Set "Controller Type" parameter to "PlayStation" manually.

**Q: Can I hide notifications but keep the button overlay?**
A: Yes! Set "Show Connection Notifications" to false, keep "Enable Button Overlay" as true.

**Q: How do I change button mapping?**
A: Button mappings are in the plugin code (`Input.gamepadMapper`). Modify at your own risk!

**Q: Does this work offline/standalone?**
A: Yes! Works in NW.js desktop builds and offline browser play.

**Q: Can other plugins access controller data?**
A: Yes! Use `$controllerDetection.getControllerState()` to get button/axis values.

### **Integration Questions**

**Q: How do I make mini-games require a controller?**
A: Check `if (!$controllerDetection.getCurrentController())` and show error message.

**Q: Can I show different tutorials for different controllers?**
A: Yes! Check controller type with `getCurrentController().id.includes('DualSense')` etc.

**Q: How do I temporarily disable notifications during cutscenes?**
A: Use `$controllerDetection.hideNotifications()` and restore with `showNotifications()`.

---

## 📚 Technical Specifications

### **System Architecture**
```
ControllerDetection.js v2.0.0 Structure:
├── Plugin Parameters & Metadata
├── Input.gamepadMapper (Button Configuration)
├── ControllerDetectionSystem Class
│   ├── Controller Detection Engine
│   │   ├── Connection/disconnection events
│   │   ├── Controller type identification
│   │   └── Active controller management
│   ├── Notification System
│   │   ├── Visual popup creation
│   │   ├── Position management
│   │   ├── Auto-hide timers
│   │   └── Scene-aware visibility
│   ├── Button Overlay System
│   │   ├── Dynamic button HTML generation
│   │   ├── Controller-specific icons
│   │   ├── Real-time visibility control
│   │   ├── Pause/menu detection
│   │   └── Position management
│   └── Public API Methods
│       ├── getStatus()
│       ├── getControllerInfo()
│       ├── getCurrentController()
│       ├── getControllerState()
│       ├── testController()
│       └── scanControllers()
└── Scene Integration Hooks
    ├── Scene_Boot initialization
    ├── Scene_Map integration
    └── Save/load compatibility
```

### **Button Mapping Configuration**

The plugin uses this standardized DualSense/PlayStation button configuration:

```javascript
Input.gamepadMapper = {
    0: "ok",       // Cross (×) / A
    2: "cancel",   // Square (□) / X
    1: "shift",    // Circle (○) / B - Running/Dash
    3: "menu",     // Triangle (△) / Y
    4: "pageup",   // L1 / LB - Left Bumper
    5: "pagedown", // R1 / RB - Right Bumper
    9: "menu",     // Options / Start
    12: "up",      // D-pad Up
    13: "down",    // D-pad Down
    14: "left",    // D-pad Left
    15: "right"    // D-pad Right
};
```

### **Supported Vendor IDs**

| Vendor ID | Manufacturer | Detection String |
|-----------|--------------|------------------|
| **054c** | Sony | PlayStation controllers |
| **045e** | Microsoft | Xbox controllers |
| **057e** | Nintendo | Switch Pro Controller |
| **Generic** | Various | Standard HID gamepads |

### **Performance Metrics**
- **Detection Scan:** Every 500ms (2 Hz)
- **Overlay Update:** Every 100ms (10 Hz) when visible
- **Notification Duration:** 5 seconds (configurable 2-15s)
- **Connection Event:** Immediate (browser event-driven)
- **CPU Impact:** <0.5% on modern hardware
- **Memory Footprint:** ~100KB

### **Browser API Dependencies**
- **Gamepad API:** `navigator.getGamepads()`
- **Events:** `gamepadconnected`, `gamepaddisconnected`
- **DOM Manipulation:** Dynamic HTML injection for overlay/notifications
- **CSS3:** Gradient backgrounds, animations, blur effects

---

## 🚀 Future Enhancements

### **Planned Features** *(Potential Additions)*

#### **Enhanced Visual Customization**
- User-customizable button overlay colors
- Multiple overlay themes (modern, retro, minimal)
- Font size and style options
- Custom icon sets support

#### **Advanced Controller Features**
- Vibration/rumble support
- Motion controls (DualSense gyro)
- Trigger resistance feedback (DualSense adaptive triggers)
- LED color control (DualSense/DualShock lightbar)

#### **Extended Button Support**
- L2/R2 trigger display
- Analog stick position indicators
- Touchpad support (DualSense/DualShock 4)
- Additional face button mappings

#### **Integration Expansions**
- Plugin parameter for custom button labels
- Event-triggered controller prompts
- Tutorial system integration
- Achievement/trophy system hooks

### **Developer Extensions**
```javascript
// Example future API expansion:
$controllerDetection.vibrate(intensity, duration);        // Rumble support
$controllerDetection.setLEDColor(r, g, b);                // LED control
$controllerDetection.getMotionData();                     // Gyro/accelerometer
$controllerDetection.setButtonLabels(['OK', 'Back'...]);  // Custom labels
```

---

## 📞 Support & Contributing

### Getting Help

- **Issues**: Report bugs or detection problems
- **Questions**: Ask about configuration or controller compatibility
- **Suggestions**: Propose new features or improvements

### Contributing

- **Bug Reports**: Include browser version, controller type, and console errors
- **Controller Reports**: Help expand compatibility by reporting new controller types
- **Feature Requests**: Describe use case and expected behavior

---

## 📄 License & Terms

### Copyright Notice

**Copyright © 2025 Alexandros Panagiotakopoulos. All Rights Reserved.**

### Usage Rights

- ✅ **Free for commercial use** (with attribution)
- ✅ **Free for non-commercial use** (with attribution)  
- ✅ **Modify as needed for your project**
- ✅ **Redistribute with proper attribution**

### Attribution Requirements

**Attribution is REQUIRED.** Please include the following credit:

**In your game credits:**
```
ControllerDetection.js Plugin (v2.0.0)
Copyright © 2025 Alexandros Panagiotakopoulos
```

**In documentation or readme files:**
```
Controller support powered by ControllerDetection.js
Created by Alexandros Panagiotakopoulos
```

**Minimum attribution:**
```
Plugin by Alexandros Panagiotakopoulos
```

### Disclaimer

This plugin is provided "as is" without warranty. Use at your own risk and always backup your project before installing new plugins.

**Copyright © 2025 Alexandros Panagiotakopoulos. All Rights Reserved.**

---

## 🎮 Version History & Changelog

### **Version 2.0.0** *(Current - January 2025)*
**🎯 Major Update - Unified System:**
- ✅ **Merged SimpleControllerOverlay** - Combined two plugins into one
- ✅ **Enhanced button overlay** - Improved visual design with gradients and shadows
- ✅ **Correct button mappings** - Displays actual function names (Confirm, Cancel, Dash, Menu)
- ✅ **DualSense button configuration** - Proper non-sequential button index handling
- ✅ **Unified polling system** - Single controller scan for better performance
- ✅ **Scene-aware visibility** - Smart show/hide logic for overlays and notifications

**🛠️ Technical Improvements:**
- Enhanced controller type detection (DualSense, DualShock 4, Xbox, generic)
- Improved auto-detection reliability
- Better notification positioning system
- Optimized overlay rendering with CSS transforms
- Enhanced pause/menu detection logic

**🐛 Bug Fixes:**
- Fixed overlay not hiding in custom menus
- Resolved button label mismatches
- Corrected DualSense button index mapping (0=Cross, 2=Square, 1=Circle)
- Fixed notification persistence during scene changes

### **Version 1.0.1** *(December 2024)*
**🛠️ Initial Release:**
- Basic controller detection
- Connection/disconnection notifications
- Simple controller API
- Console debugging tools

---

## 📞 Contact

For support, questions, or feedback about this plugin, please refer to the documentation above or check for updates in the original distribution source.

**Happy game developing! 🎮**

---

*📝 This documentation covers ControllerDetection.js v2.0.0. For the latest updates and advanced customization options, consult the plugin comments and developer console tools.*

**Copyright © 2025 Alexandros Panagiotakopoulos. All Rights Reserved.**

