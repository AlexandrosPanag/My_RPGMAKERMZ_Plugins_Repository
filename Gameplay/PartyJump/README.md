# 🦘 PartyJump Plugin for RPG Maker MZ

> *Make your entire party leap into action with advanced hold-and-release charging system!*

## 🌟 Overview

The **PartyJump** plugin adds a sophisticated jumping mechanic to RPG Maker MZ with a **hold-and-release charging system**. Hold **SPACE** or **L3** to charge your jump power, add directional input for 8-way directional jumps, then release to execute powerful leaps with visual feedback and dynamic sound effects!

---

## ✨ Features

### 🚀 **Advanced Charging System**
- **Hold & Release Controls** - Hold SPACE or L3, release to jump with variable power
- **8-Level Power System** - Weak → Normal → Strong → Power → Super → Ultra → Maximum → Ultimate
- **Visual Charge Indicator** - Real-time feedback showing power level and direction
- **Minimum Charge Time** - Prevents accidental jumps (configurable)
- **Auto-Jump Protection** - Prevents infinite charging with maximum hold time

### 🎯 **Directional Jumping**
- **8-Way Directional Control** - Jump in any of 8 directions with Arrow Keys, WASD, or Controller Stick
- **Dynamic Distance** - Longer charge = greater jump distance and height
- **Visual Direction Arrows** - Charge indicator shows intended jump direction
- **Multi-Input Support** - Keyboard and controller inputs work simultaneously

### 🎮 **Multiple Control Options**
- **Keyboard**: Hold SPACE + Arrow Keys or WASD for directional jumps
- **Controller**: Hold L3 + Left Stick for directional jumps
- **Flexible Configuration** - Enable/disable individual input methods

### 🎨 **Visual Feedback System**
- **Multi-Level Progress Rings** - Different colors for each power level (Yellow → Orange → Red → Purple)
- **Pulsing Effects** - High-level charges pulse for dramatic effect
- **Enhanced Arrow Indicators** - Bigger, glowing arrows for higher power levels
- **Power Multiplier Display** - Shows exact power multiplier (0.5x to 2.0x)

### 🔊 **Dynamic Audio System**
- **Charging Sound Effects** - Audio feedback while charging with rising pitch
- **Power-Based Audio** - Higher charge levels = enhanced sound effects
- **Directional Audio Variation** - Slight pitch variations for directional jumps
- **Configurable Audio Options** - Control all sound aspects independently

### 🛡️ **Smart Safeguards**
- **Event Protection** - No jumping during story sequences
- **Movement Lock** - Prevents jumping while characters are moving
- **Menu Integration** - Respects game menu availability
- **Map Validation** - Only works on valid game maps
- **State Management** - Proper cleanup on map changes and saves

---

## 🚀 Installation

1. **Download** the `PartyJump.js` file
2. **Copy** to your `js/plugins/` directory
3. **Enable** the plugin in the Plugin Manager
4. **Configure** parameters as desired
5. **Test** by pressing **SPACE** in-game!

---

## ⚙️ Plugin Parameters

### 🚀 **Charging System Settings**
| Parameter | Description | Default | Range |
|-----------|-------------|---------|-------|
| **Maximum Jump Height** | Highest jump at full charge (pixels) | 60 | 20-200 |
| **Maximum Jump Distance** | Furthest jump at full charge (pixels) | 96 | 0-150 |
| **Charge Power Levels** | Number of distinct power levels | 4 | 2-8 |
| **Ultimate Charge Time** | Frames for maximum power | 120 | 60-300 |
| **Minimum Charge Time** | Frames before jump activates | 10 | 1-60 |
| **Maximum Charge Time** | Auto-jump after this duration | 90 | 30-180 |

### 🎯 **Basic Animation Settings**
| Parameter | Description | Default | Range |
|-----------|-------------|---------|-------|
| **Jump Height** | Base jump height (pixels) | 24 | 10-100 |
| **Jump Duration** | Animation length (frames) | 30 | 10-120 |
| **Jump Distance** | Base horizontal distance (pixels) | 48 | 0-96 |
| **Cooldown Frames** | Delay between jumps (frames) | 60 | 0-180 |

### 🎮 **Control Settings**
| Parameter | Description | Default | Range |
|-----------|-------------|---------|-------|
| **Enable Directional Jumping** | Allow 8-way directional jumps | true | true/false |
| **Enable Controller Support** | L3 + Left Stick support | true | true/false |
| **Enable WASD Support** | WASD key support | true | true/false |
| **Show Charge Indicator** | Visual charging feedback | true | true/false |

### 🔊 **Audio Settings**
| Parameter | Description | Default | Range |
|-----------|-------------|---------|-------|
| **Enable Jump Sound** | Play sound effect when jumping | true | true/false |
| **Jump Sound Effect** | Audio file name for jumps | Jump1 | Any SE file |
| **Jump Sound Volume** | Jump sound volume level | 80 | 0-100 |
| **Jump Sound Pitch** | Jump sound pitch adjustment | 100 | 50-150 |
| **Enable Charging Sound** | Play sound while charging | true | true/false |
| **Charging Sound Effect** | Audio file for charging feedback | Cursor1 | Any SE file |

---

## 🎮 Controls

### 🖥️ **Keyboard Controls**
| Input | Action | Description |
|-------|--------|-------------|
| **Hold SPACE** | Charge Jump | Build up power for enhanced jumping |
| **Hold SPACE + Arrow Keys** | Directional Charge | Charge jump in specific direction |
| **Hold SPACE + WASD** | Alternative Directional | WASD alternative to arrow keys |
| **Release SPACE** | Execute Jump | Jump with charged power and direction |

### 🎮 **Controller Controls**
| Input | Action | Description |
|-------|--------|-------------|
| **Hold L3** | Charge Jump | Build up power with left stick button |
| **Hold L3 + Left Stick** | Directional Charge | Charge jump using stick direction |
| **Release L3** | Execute Jump | Jump with charged power and direction |

### 🎯 **Power Levels**
| Level | Name | Color | Power Multiplier | Height Range |
|-------|------|-------|------------------|--------------|
| 0 | Weak | Yellow | 0.5x | ~12px |
| 1 | Normal | Orange | 0.67x | ~24px |
| 2 | Strong | Red Orange | 1.0x | ~36px |
| 3 | Power | Red | 1.33x | ~48px |
| 4 | Super | Magenta | 1.67x | ~60px |
| 5 | Ultra | Blue Violet | 2.0x | ~72px |
| 6 | Maximum | Indigo | 2.0x+ | Max Height |
| 7 | Ultimate | Violet | 2.0x+ | Max Height |

---

## 🛠️ Technical Features

### 🚀 **Advanced Charging System**
- **Multi-Level Power System**: 8 distinct power levels with visual and audio feedback
- **Hold & Release Mechanics**: Variable power based on charge duration
- **Dynamic Power Scaling**: Jump height and distance scale with charge level
- **Visual Feedback Loop**: Real-time charge indicator with color progression
- **Audio Progression**: Rising pitch and volume during charging

### 🎯 **Directional Jump Engine**
- **8-Way Movement**: Support for all cardinal and diagonal directions
- **Multi-Input Detection**: Arrow keys, WASD, and controller stick simultaneously
- **Dynamic Distance Calculation**: Charge level affects horizontal movement
- **Vector-Based Movement**: Smooth diagonal jumping with proper ratios

### 🎨 **Visual Indicator System**
- **Progressive Ring Display**: Multi-layered circular progress indicator
- **Color Coding System**: 8 distinct colors matching power levels
- **Pulsing Effects**: High-level charges feature pulsing animations
- **Direction Arrows**: Enhanced arrows showing jump direction
- **Power Multiplier Text**: Numerical feedback for exact power level

### 🎨 **Animation System**
- **Easing Functions**: Uses combined `easeOutQuart` and `easeInQuart` for natural jump arcs
- **Sine Wave Physics**: Realistic jump trajectory with proper acceleration/deceleration
- **Frame-Based Timing**: Smooth 60fps animation support
- **Progress Tracking**: Precise animation state management
- **Sprite-Level Integration**: Compatible with existing character animation systems

### 🔧 **Input System Enhancement**
- **Extended Key Mapping**: SPACE, WASD, Arrow keys, and L3 support
- **Controller Integration**: Full gamepad compatibility with stick input
- **Multi-Input Tolerance**: Handle multiple input methods simultaneously
- **Input State Management**: Proper press/hold/release detection

### 🔧 **Integration Points**
- **Character Base Extension**: Enhanced `Game_CharacterBase` for jump mechanics
- **Input System**: Extended Input class with space key support
- **Follower Management**: Synchronized follower animations
- **Save System**: Proper state management across saves/loads

### 🐛 **Error Handling**
- **Sound Fallback**: Graceful handling of missing audio files
- **Parameter Validation**: Safe defaults for all configuration options
- **State Reset**: Automatic cleanup on map changes and game loads

---

## 🎯 Usage Examples

### 🏃‍♂️ **Basic Usage**
```javascript
// Hold SPACE to charge, release to jump
// 1. Hold SPACE - charging begins
// 2. Hold for desired power level (watch visual indicator)
// 3. Release SPACE - party jumps with charged power

// For directional jumps:
// 1. Hold SPACE + Arrow Key (or WASD)
// 2. Charge to desired level
// 3. Release SPACE - party jumps in held direction
```

### 🎮 **Controller Usage**
```javascript
// Hold L3 (Left Stick Button) to charge
// 1. Hold L3 - charging begins
// 2. Move Left Stick for direction
// 3. Release L3 - directional jump executed

// Power levels automatically adjust jump height and distance
// Ultimate level jumps can cover significant distances!
```

### 🎬 **Plugin Commands & Events**
```javascript
// Manual party jump via plugin command
$gamePlayer.executePartyJump();

// Directional jump with specific power
$gamePlayer.executePartyJump(6, 96, 60, 3); // Right, max distance, high jump, power level 3

// Check if party can jump
if ($gamePlayer.canPartyJump()) {
    console.log("Party ready to jump!");
}

// Set jump cooldown programmatically
jumpCooldown = 120; // 2 seconds at 60fps
```

### 🎚️ **Dynamic Configuration**
```javascript
// Modify maximum charge parameters during gameplay
maxJumpHeight = 120; // Increase maximum jump height
ultimateChargeTime = 180; // Longer charge time for ultimate power

// Adjust base jump parameters
jumpHeight = 48; // Higher base jump
jumpDuration = 20; // Faster jumping animation

// Enable/disable features dynamically
showChargeIndicator = false; // Hide visual feedback
enableDirectional = false; // Disable directional jumping
```

---

## 🔧 Compatibility

### ✅ **Compatible With**
- RPG Maker MZ (all versions)
- Most character movement plugins
- Event and cutscene systems
- Save/Load functionality
- Plugin command systems

### ⚠️ **Considerations**
- May conflict with plugins that heavily modify character positioning
- Custom movement plugins should be tested for compatibility
- Sound effects require appropriate audio files in `audio/se/` folder
- Controller support requires proper gamepad detection
- Charge indicator requires sufficient screen space above player

---

## 🎨 Customization Ideas

### 🌟 **Visual Enhancements**
- Combine with particle effect plugins for jump trails and charge effects
- Add screen shake effects for ultimate-level jumps
- Create dust clouds or impact effects on landing
- Custom charge indicator graphics for different themes
- Power-level specific jump animations or character poses

### 🔊 **Audio Variations**
- Different charging sounds for each power level
- Character-specific jump sounds based on party member
- Environmental jump sounds (grass, stone, water, etc.)
- Musical jump effects synchronized to background music
- Echo or reverb effects for high-power jumps

### 🎮 **Gameplay Integration**
- Puzzle mechanics requiring specific power-level jumps
- Platformer-style gameplay with distance-based challenges
- Special areas only accessible with ultimate-level jumps
- Power-up items that enhance charging speed or maximum power
- Achievement systems based on jump combinations and power levels
- Boss battles utilizing directional dodging with jumps

---

## 🐛 Troubleshooting

### **Jump Not Working?**
- Check if events or menus are active
- Verify plugin is enabled in Plugin Manager
- Ensure SPACE key isn't bound to other functions
- Confirm you're holding SPACE long enough (minimum charge time)
- Check that cooldown period has expired

### **Charging Not Appearing?**
- Verify "Show Charge Indicator" parameter is enabled
- Ensure you're on a valid map (not in menus)
- Check that there's enough space above the player character
- Confirm the charging system is enabled in parameters

### **No Directional Jumping?**
- Enable "Enable Directional Jumping" parameter
- Check that WASD or Controller support is enabled if needed
- Verify you're holding direction keys WHILE charging
- Confirm controller is properly connected and detected

### **Controller Not Working?**
- Enable "Enable Controller Support" parameter
- Verify controller is connected and recognized by browser/game
- Test L3 button functionality (left stick click)
- Check that gamepad API is supported in your environment

### **No Sound Effects?**
- Verify audio files exist in `audio/se/` folder
- Check volume settings aren't at 0
- Confirm audio file names match parameters exactly
- Enable "Enable Jump Sound" and "Enable Charging Sound" parameters
- Test with default sound files (Jump1, Cursor1)

### **Performance Issues?**
- Reduce "Ultimate Charge Time" for faster charging
- Increase cooldown to prevent rapid jumping
- Disable charge indicator if causing frame drops
- Check for conflicts with other character or visual plugins
- Lower "Charge Power Levels" for simpler visual effects

---

## 🏆 Advanced Features

### 🎯 **Plugin Integration**
```javascript
// Check charging state
if (isCharging) {
    console.log(`Charging at level: ${chargeLevel}`);
    console.log(`Direction: ${chargedDirection}`);
}

// Check if party can jump
if ($gamePlayer.canPartyJump()) {
    // Safe to execute jump
    $gamePlayer.executePartyJump();
}

// Monitor jump state with enhanced info
if (isJumping) {
    console.log('Party is in the air!');
    // Access individual character jump states
    console.log(`Player jump progress: ${$gamePlayer._jumpProgress}`);
}

// Get current charge level information
const elapsed = Graphics.frameCount - chargeStartFrame;
const currentLevel = getChargeLevel(elapsed);
const powerMultiplier = getJumpPowerMultiplier(currentLevel);
console.log(`Current power: ${powerMultiplier}x`);
```

### 🔧 **Advanced Customization**
```javascript
// Dynamic charge level modification
chargeLevels = 6; // Change number of power levels
ultimateChargeTime = 200; // Adjust maximum charge time

// Custom power scaling
const customPowerMultiplier = (level) => {
    return 0.3 + (level / (chargeLevels - 1)) * 2.5; // 0.3x to 2.8x power
};

// Override charge level colors
const customChargeLevelColor = (level) => {
    const customColors = ['#00FF00', '#0080FF', '#8000FF', '#FF0080'];
    return customColors[level] || '#FF0080';
};
```

### 🔄 **Event Integration**
- Use plugin commands in events for scripted charged jumps
- Combine with switches for conditional jump power limits
- Create jump-based puzzles requiring specific power levels
- Implement platforming challenges with directional requirements
- Design boss battles with charging mechanics for dodging

---

## 📋 Version History

### **v1.0.0** - Advanced Charging System Release
- ✅ **Hold & Release Charging System** - Variable power jumps with 8 power levels
- ✅ **8-Way Directional Jumping** - Arrow keys, WASD, and controller stick support
- ✅ **Visual Charge Indicator** - Real-time feedback with color-coded power levels
- ✅ **Enhanced Audio System** - Dynamic charging sounds with rising pitch/volume
- ✅ **Controller Support** - Full L3 + Left Stick integration
- ✅ **Multi-Input Support** - Keyboard and gamepad work simultaneously
- ✅ **Advanced Visual Effects** - Pulsing charge rings, direction arrows, power text
- ✅ **Dynamic Power Scaling** - Height and distance scale with charge level
- ✅ **Smart State Management** - Proper cleanup and error handling
- ✅ **Extensive Customization** - 20+ configurable parameters
- ✅ **Backwards Compatibility** - Maintains all original functionality

---

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

---

*"Charge your dreams, aim your hopes, and leap into greatness - one powerful jump at a time!"* 🚀⚡🦘
