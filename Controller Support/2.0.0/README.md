## Repository for both DualSense and XBOX Controller support compatibility

Compatible with PartyJump which can be downloaded here:
[PartyJump.js](https://github.com/AlexandrosPanag/My_RPGMAKERMZ_Plugins_Repository/tree/main/Gameplay/PartyJump)

# 🎮 RPG Maker MZ Controller Detection Plugin Documentation

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-2.2.0-green)
![License](https://img.shields.io/badge/license-CC%20BY--ND%204.0-orange)

**Author:** Alexandros Panagiotakopoulos  
**Version:** 2.2.0  
**Compatibility:** RPG Maker MZ  
**License:** CC BY-ND 4.0 (attribution required)  
**Copyright © 2025-2026 Alexandros Panagiotakopoulos. All Rights Reserved.**

---

## 🆕 Version 2.2.0 Changelog
- Overlay redesigned as a **vertical button tower** (Select, Cancel, Dash, Menu, Jump)
- **Live press feedback** - rows highlight while a button is held
- New icon set: outline shapes for PlayStation, letters for Xbox
- Notifications restyled to a black card
- Removed the *Overlay Position* and *Enable Controller Input API* parameters
- Removed `testController()` and `scanControllers()` (use `scanExistingControllers()`)
- License changed to CC BY-ND 4.0

## 🎯 Overview

Detects connected gamepads (DualSense, DualShock 4, Xbox, generic), shows connect/disconnect notifications, and displays a compact on-screen button guide in the upper-right corner.

## 📦 Installation

1. Save the plugin as `ControllerDetection.js` (rename it if the filename has a version suffix, or parameters won't load)
2. Put it in `js/plugins/`
3. Enable it in **Tools → Plugin Manager**
4. Make sure **Enable Button Overlay** is `true`

## ⚙️ Plugin Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| Enable Controller Detection | true | Master switch |
| Show Connection Notifications | true | Popup on connect/disconnect |
| Notification Position | Bottom Right | Bottom Right / Bottom Center / Top Right / Top Left |
| Notification Duration | 5 | Seconds (2-15) |
| Enable Button Overlay | true | Show the button tower |
| Controller Type | Auto-Detect | Auto-Detect / PlayStation (DualSense) / Xbox |
| Show Only in Menus | true | ⚠️ Declared but not read by the code; currently has no effect |
| Enable Console Debug | true | Log connect/disconnect to the console |

## 🎮 Button Mappings

`Input.gamepadMapper`:

| Index | Function | Index | Function |
|-------|----------|-------|----------|
| 0 | ok | 9 | menu |
| 1 | shift (Dash) | 12 | up |
| 2 | cancel | 13 | down |
| 3 | menu | 14 | left |
| 4 | pageup | 15 | right |
| 5 | pagedown | | |

**Overlay rows (top to bottom):**

| Label | PlayStation | Xbox | Index |
|-------|-------------|------|-------|
| Select | □ | X | 0 |
| Cancel | ○ | B | 2 |
| Dash | × | A | 1 |
| Menu | △ | Y | 3 |
| Jump | R1 | RB | 5 |

> ⚠️ These icons follow the plugin's own mapping, not the standard Gamepad API face-button order. Verify on your hardware.  
> ⚠️ **Jump** is a label only (index 5 is still `pagedown`). The jump action itself comes from PartyJump.

## 🛠️ Console Commands (F8 / F12)

| Command | Returns |
|---------|---------|
| `$controllerDetection.getStatus()` | Init state, settings, controllers |
| `$controllerDetection.getControllerInfo()` | Live gamepads + tracked controllers |
| `$controllerDetection.getCurrentController()` | Active controller `{index, id, connected, timestamp, info}` or `null` |
| `$controllerDetection.getControllerState(index)` | Buttons and axes (index optional) |
| `$controllerDetection.scanExistingControllers()` | Re-scan for connected pads |
| `$controllerDetection.hideNotifications()` / `showNotifications()` | Toggle visible notifications |
| `$controllerDetection.updateOverlayVisibility()` / `updateOverlayContent()` | Refresh the overlay |
| `$controllerDetection.isPausedManually = true/false` | Force-hide the overlay |

## 🎨 Overlay Visibility

**Shows** when a controller is connected and the game isn't paused.  
**Hides** on the title screen, `Scene_CustomMenu`, during messages, scene changes, and when a map menu is open. Notifications are also suppressed in `Scene_CustomMenu`.

## 🎯 Usage Example

```javascript
let controller = $controllerDetection.getCurrentController();
if (controller && controller.info.name.includes('PlayStation')) {
    $gameMessage.add("PlayStation controller detected!");
} else if (controller) {
    $gameMessage.add("Controller detected!");
} else {
    $gameMessage.add("Use keyboard controls.");
}
```

## 🆘 Troubleshooting

- **Nothing detected:** press any button on the controller, then run `$controllerDetection.scanExistingControllers()`
- **No overlay:** check *Enable Button Overlay*, and remember it hides on the title screen, custom menus and during messages
- **Wrong icons:** set *Controller Type* manually
- **Wrong row lights up:** hold a button and run `$controllerDetection.getControllerState().buttons.filter(b => b.pressed)` to see its index


## 📄 License

CC BY-ND 4.0: <http://creativecommons.org/licenses/by-nd/4.0/>  
Free for commercial and non-commercial use with attribution. Do not distribute modified versions.

```
ControllerDetection.js Plugin (v2.2.0)
Copyright © 2026 Alexandros Panagiotakopoulos
```
