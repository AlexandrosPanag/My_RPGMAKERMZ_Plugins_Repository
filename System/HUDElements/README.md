# HUDElements Plugin Documentation

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)



## 👤 Author

**Alexandros Panagiotakopoulos**

---


**Copyright © 2025 Alexandros Panagiotakopoulos. All Rights Reserved.**
---
The ultimate performance coordination system for RPG Maker MZ. Transform your plugin collection into a unified, intelligent performance management suite that delivers consistent, optimized gameplay across all devices.

## 🎯 Overview
The HUDElements plugin provides a real-time party status HUD system that displays HP/MP bars, names, and levels for all active party members. The HUD features smooth animations, customizable positioning, and automatic updates during gameplay.

## ⚡ Features
- **Real-time Status Display**: Live HP/MP bars that update automatically
- **Party Management**: Shows up to 4 party members with automatic formation handling
- **Smooth Animations**: Optional animated transitions for status changes
- **Color-coded Health**: Dynamic bar colors based on HP/MP percentages
- **Scene Integration**: Works in map, battle, and optionally menu scenes
- **Customizable Positioning**: Adjustable HUD location and dimensions
- **Performance Optimized**: Efficient update system with configurable frequency

## Installation
1. Copy `HUDElements.js` to your `js/plugins/` folder
2. Enable the plugin in the Plugin Manager
3. Configure settings as desired (see Configuration section)
4. The HUD will appear automatically during gameplay

## Configuration Parameters

### Basic Settings
| Parameter | Description | Type | Default |
|-----------|-------------|------|---------|
| **enableHUD** | Enable/disable the entire HUD system | Boolean | true |
| **enableHPBars** | Show HP status bars | Boolean | true |
| **enableMPBars** | Show MP status bars | Boolean | true |
| **enableNames** | Display character names | Boolean | true |
| **enableLevels** | Show character levels | Boolean | true |

### Positioning & Layout
| Parameter | Description | Type | Range | Default |
|-----------|-------------|------|-------|---------|
| **hudPositionX** | Horizontal position in pixels | Number | 0-800 | 20 |
| **hudPositionY** | Vertical position in pixels | Number | 0-500 | 400 |
| **barWidth** | Width of status bars | Number | 50-300 | 60 |
| **barHeight** | Height of status bars | Number | 8-30 | 6 |
| **memberSpacing** | Space between members | Number | 10-100 | 80 |

### Animation & Performance
| Parameter | Description | Type | Range | Default |
|-----------|-------------|------|-------|---------|
| **updateFrequency** | Update interval (milliseconds) | Number | 50-1000 | 100 |
| **enableAnimations** | Smooth bar animations | Boolean | - | true |
| **enableBattleMode** | Enhanced battle display | Boolean | - | true |
| **showInMenus** | Display in menu scenes | Boolean | - | false |
| **enableDebugMode** | Console debug messages | Boolean | - | false |

## Visual Design

### Status Bar Colors
The plugin uses dynamic color gradients that change based on current HP/MP percentages:

#### HP Bar Colors
- **High HP (>50%)**: Red to orange gradient (#ff4444 → #ffdd88)
- **Medium HP (26-50%)**: Orange to yellow gradient (#ff8800 → #ffcc66)
- **Low HP (≤25%)**: Deep red warning gradient (#ff0000 → #ff6699)

#### MP Bar Colors
- **High MP (>50%)**: Blue to cyan gradient (#4488ff → #44ddcc)
- **Medium MP (26-50%)**: Purple to blue gradient (#6688ff → #66aaff)
- **Low MP (≤25%)**: Red-purple warning gradient (#ff4400 → #4499ff)

### Layout Structure
```
┌─────────────────────────────────────┐
│  [Character 1] [Character 2] ...    │
│  Name + Level                       │
│  ████████░░ HP Bar                  │
│  ████░░░░░░ MP Bar                  │
└─────────────────────────────────────┘
```

## Core Classes & Methods

### PartyHUDSystem Class
Main system class that handles all HUD functionality.

#### Key Methods
- `initialize()` - Sets up the HUD system
- `createHUDContainer()` - Creates the main DOM container
- `updateDisplay()` - Refreshes all party member displays
- `showHUD()` / `hideHUD()` - Controls HUD visibility
- `handleSceneChange(sceneName)` - Manages scene transitions

#### Properties
- `hudContainer` - Main DOM element container
- `memberElements[]` - Array of individual member displays
- `lastPartyData[]` - Cached party data for change detection
- `updateInterval` - Timer for automatic updates

## Integration Points

### Scene Management
The plugin automatically integrates with RPG Maker MZ scenes:

- **Scene_Map**: HUD visible during field exploration
- **Scene_Battle**: HUD visible during combat (if battle mode enabled)
- **Scene_Menu**: HUD visible in menus (if showInMenus enabled)
- **Scene_Title**: HUD hidden on title screen

### Party System Integration
Automatically responds to party changes:

- **Adding Members**: `Game_Party.addActor()` override
- **Removing Members**: `Game_Party.removeActor()` override  
- **Reordering**: `Game_Party.swapOrder()` override

## Plugin Commands
Available through event commands or script calls:

| Command | Description |
|---------|-------------|
| `showHUD` | Force show the HUD |
| `hideHUD` | Force hide the HUD |
| `refreshHUD` | Force refresh display |

### Script Call Examples
```javascript
// Show HUD manually
$partyHUD.showHUD();

// Hide HUD manually
$partyHUD.hideHUD();

// Force update display
$partyHUD.updateDisplay();

// Access configuration
$partyHUD.CONFIG.enableAnimations = false;
```

## Developer API

### Global Access
The plugin creates a global `$partyHUD` object for debugging and advanced control:

```javascript
// Check if system is initialized
$partyHUD.initialized

// Access current configuration
$partyHUD.CONFIG

// Manual scene handling
$partyHUD.handleSceneChange('Scene_Map');

// Destroy and recreate system
$partyHUD.destroy();
$partyHUD.initialize();
```

### Debug Features
When debug mode is enabled (`enableDebugMode: true`):

- Console logging for all major events
- Party change notifications
- Scene transition messages
- Performance timing information

### Console Commands
```javascript
// Available debug commands
$partyHUD.debugLog('Custom message');
$partyHUD.detectPartyChanges($gameParty.allMembers());
$partyHUD.updateMemberDisplay(actor, index, true);
```

## Performance Considerations

### Update Optimization
- Change detection prevents unnecessary DOM updates
- Configurable update frequency (default 100ms)
- Efficient party data caching system
- Minimal DOM manipulation

### Memory Management
- Automatic cleanup on scene changes
- Proper event listener removal
- Container cleanup on plugin disable

## Customization Guide

### Styling Modifications
The HUD uses inline CSS that can be modified in the `createHUDContainer()` and `createMemberElement()` methods:

```javascript
// Example: Change HUD position
CONFIG.hudPositionX = 100;
CONFIG.hudPositionY = 50;

// Example: Modify bar colors
// Edit the gradient definitions in updateStatusBar()
```

### Adding Custom Elements
Extend the `createMemberElement()` method to add new display elements:

```javascript
// Add custom status indicator
const statusIcon = document.createElement('div');
statusIcon.className = 'status-icon';
// ... styling and logic
memberDiv.appendChild(statusIcon);
```

## Version History

### v1.0.0 (Current)
- Initial release
- Core HUD functionality
- Real-time HP/MP bars
- Party management integration
- Scene transition handling
- Customizable positioning and styling

## Support & Compatibility


### Plugin Compatibility
- Compatible with most party management plugins
- Works with custom battle systems
- May require positioning adjustments with UI modification plugins



## 📄 License & Attribution

### **Copyright Information**
**Copyright © 2025 Alexandros Panagiotakopoulos. All Rights Reserved.**

### **License Terms**
Licensed under **Custom MIT-Based License with Attribution Requirements**

**You may:**
- ✅ Use in commercial projects with attribution
- ✅ Use in non-commercial projects with attribution
- ✅ Modify and adapt for your specific needs
- ✅ Redistribute with proper attribution

**You must:**
- 📝 Include attribution in your game credits
- 📋 Maintain copyright notices in code
- 📄 Include license information when redistributing

### **Required Attribution**
**Minimum attribution in game credits:**
```
Performance integration by Alexandros Panagiotakopoulos
```

**Professional attribution (recommended):**
```
PerformanceIntegration.js - Unified Performance Management
Professional RPG Plugin Suite by Alexandros Panagiotakopoulos
```
**Copyright © 2025 Alexandros Panagiotakopoulos. All Rights Reserved.**
