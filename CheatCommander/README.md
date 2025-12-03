# CheatCommander for RPG Maker MZ

![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)
![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-red.svg)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-green.svg)

A comprehensive developer console and cheat system for RPG Maker MZ. Instantly access powerful debugging tools, cheats, and utilities during playtesting. Press **~** (tilde) to open the console and take full control of your game.

## ⚙️ Changelog

-[1.0.1]: Added page-up/page-down keyboard compatibility to view the console history.

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
* **Framework**: RPG Maker MZ Plugin System
* **Technologies**: JavaScript ES6+, CSS3 Animations, HTML5 APIs
* **Inspiration**: Modern browser power management and mobile battery optimization

## 👤 Author

**Alexandros Panagiotakopoulos**

An automatic sprite size doubler for RPG Maker MZ that intelligently scales event sprites based on their names. Perfect for boats, vehicles, large NPCs, and any object that needs to stand out visually.

## ✨ Features

- 🎮 **40+ Commands** - Comprehensive suite of cheats and dev tools
- ⌨️ **Instant Access** - Press ~ key to open console anywhere
- 🎯 **Smart Commands** - Intuitive syntax with optional parameters
- 💾 **Save/Load** - Quick save and load from any slot
- 🔍 **Debug Tools** - FPS counter, coordinates, event inspector
- 🎨 **Beautiful UI** - Professional console with command history
- ⚡ **Performance** - Lightweight, no impact on gameplay
- 🛡️ **God Mode** - Invincibility and infinite resources
- 🚫 **No Clip** - Walk through walls and obstacles
- 📊 **Variable Inspector** - View and modify game state in real-time

## 📦 Installation

1. Download `CheatCommander.js` (or `CheatConsole.js`)
2. Place it in your project's `js/plugins/` folder
3. Open RPG Maker MZ Plugin Manager
4. Add "CheatCommander" to your plugin list
5. Enable the plugin
6. (Optional) Configure hotkey in Plugin Parameters
7. **Important**: Save your project

## 🎮 Usage

### Opening the Console

Press the **~** (tilde) key during gameplay or playtesting to open the console.

**Alternative Keys:**
- **~** (tilde/backtick) - Primary key
- **`** (backtick) - Alternative
- **F5** (customizable) - Secondary hotkey

### Using Commands

Type commands directly into the console and press **Enter**:

```
> gold 50000
Added 50000 gold

> heal
Party fully healed

> teleport 5 10 15
Teleporting to Map 5 (10, 15)
```

### Console Controls

- **Enter** - Execute command
- **Escape** - Close console
- **~** - Toggle console open/closed
- **Backspace** - Delete characters
- **Up/Down Arrow** - Command history (coming soon)

## 📚 Command Reference

### 💰 Cheat Commands

#### Gold Management
```javascript
gold [amount]              // Add gold (default: 999999)

Examples:
gold                       // Add 999,999 gold
gold 50000                 // Add 50,000 gold
gold -1000                 // Remove 1,000 gold
```

#### Party Management
```javascript
heal                       // Restore all HP/MP/TP
instanttp                  // Set all party members' TP to 100
level [number]             // Set party level (default: 99)
clearstatus                // Remove all status effects

Examples:
heal                       // Full heal party
level 50                   // Set party to level 50
level                      // Set party to level 99
instanttp                  // Fill all TP bars
```

#### God Mode
```javascript
godmode                    // Toggle invincibility

Effects:
• Party cannot lose HP
• Party cannot lose MP
• Cannot die in battle
• Toggle on/off repeatedly
```

#### Movement Cheats
```javascript
speed [1-6]               // Set movement speed (default: 4)
noclip                    // Toggle collision detection

Examples:
speed 6                   // Maximum speed
speed 1                   // Very slow
noclip                    // Walk through walls (toggle)
```

#### Item Management
```javascript
item [id] [quantity]      // Add item by ID (default qty: 1)
weapon [id] [quantity]    // Add weapon by ID
armor [id] [quantity]     // Add armor by ID

Examples:
item 1 99                 // Add 99x Item #1
weapon 5                  // Add 1x Weapon #5
armor 10 5                // Add 5x Armor #10
```

#### Encounter Control
```javascript
encounter                 // Toggle random encounters on/off

Effects:
• Disables/enables random battles
• Persists until toggled again
• Great for exploration
```

### 🛠️ Developer Tools

#### Teleportation
```javascript
teleport [map] [x] [y]    // Teleport to map location

Examples:
teleport 5 10 15          // Go to Map 5, position (10,15)
teleport 1 0 0            // Go to Map 1 origin
```

#### Switches & Variables
```javascript
switch [id] [on/off]      // Set switch state (default: on)
var [id] [value]          // Set variable value

Examples:
switch 10 on              // Turn Switch #10 ON
switch 5 off              // Turn Switch #5 OFF
switch 3                  // Turn Switch #3 ON (default)
var 1 100                 // Set Variable #1 to 100
var 50 -10                // Set Variable #50 to -10
```

#### Save/Load System
```javascript
save [slot]               // Save to slot (default: 1)
load [slot]               // Load from slot (default: 1)

Examples:
save 1                    // Save to slot 1
save 5                    // Save to slot 5
load 1                    // Load from slot 1
```

#### Display Toggles
```javascript
fps                       // Toggle FPS counter overlay
coords                    // Toggle coordinate display

Display Shows:
• FPS: Current frames per second
• Map: Current map ID
• X, Y: Player coordinates
• Region: Current region ID
```

#### Event Inspector
```javascript
eventinfo                 // Show events at player position

Information Shown:
• Events at exact position
• Event IDs and names
• Nearby events (1 tile radius)
• Event coordinates
```

#### Flag Inspector
```javascript
showswitches [start] [end]  // Display switch states (default: 1-10)
showvars [start] [end]      // Display variable values (default: 1-10)
resetflags                  // Reset all switches/variables to default

Examples:
showswitches 1 20           // Show switches 1-20
showvars 10 25              // Show variables 10-25
resetflags                  // Reset first 100 switches/vars
```

### ⚔️ Battle Commands

```javascript
killall                   // Defeat all enemies instantly

Requirements:
• Must be in battle
• Applies death state to all enemies
• Ends battle immediately
```

### 🔧 Utility Commands

```javascript
clear                     // Clear console history
help                      // Display command list with descriptions
```

## 🎯 Use Cases

### Development & Testing

**Quick Level Testing**
```
> level 50
> gold 100000
> item 1 99
> teleport 10 5 5
```

**Battle Testing**
```
> godmode
> instanttp
> heal
> encounter     // Disable random battles
```

**Event Debugging**
```
> coords        // Show position
> eventinfo     // Check event data
> showswitches 1 20  // View switch states
```

### Playtesting Workflows

**Skip to Specific Content**
```
> teleport 15 20 30
> switch 25 on
> var 10 5
```

**Test Boss Battles**
```
> level 99
> heal
> godmode
> instanttp
```

**Speed Run Testing**
```
> speed 6
> noclip
> encounter
```

## 🎨 Interface

### Console Window

- **Position**: Bottom 70% of screen
- **Opacity**: Semi-transparent (220/255)
- **Background**: Dark with slight blur
- **Text Color**: Matrix green (#00ff00)
- **Input Prompt**: Yellow (#ffff00)
- **Max History**: 100 lines

### Debug Overlay

- **Position**: Top-left corner
- **Size**: 400x120 pixels
- **Opacity**: Transparent background
- **Updates**: Real-time (60 FPS)

**Displays:**
```
FPS: 60
Map: 5
X: 10 Y: 15
Region: 1
```

## 🔧 Technical Details

### Command Processing

1. **Input Capture**: Direct keyboard input via event listeners
2. **Parsing**: Command split into name + arguments
3. **Validation**: Check command exists and parameters valid
4. **Execution**: Run command with error handling
5. **Feedback**: Display result in console history

### Performance Impact

- **Overhead**: <0.1% CPU when closed
- **Memory**: ~2MB for command history
- **Rendering**: Hardware-accelerated overlays
- **No Lag**: Zero impact on gameplay when inactive

### State Management

```javascript
consoleState = {
    isOpen: false,          // Console visibility
    history: [],            // Command history (max 100)
    inputText: '',          // Current input
    godMode: false,         // Invincibility toggle
    noClip: false,          // Collision toggle
    noEncounter: false,     // Random battles toggle
    showFPS: false,         // FPS overlay toggle
    showCoords: false,      // Coordinates toggle
    historyIndex: -1        // Command history navigation
}
```

### Integration Points

The plugin hooks into these RPG Maker MZ systems:

```javascript
// Scene Management
Scene_Map.prototype.createAllWindows()
Scene_Map.prototype.update()

// Player Movement
Game_Player.prototype.isMapPassable()
Game_Player.prototype.encounterProgressValue()

// Battle System
Game_Battler.prototype.gainHp()
Game_Battler.prototype.gainMp()

// Input System
Input.keyMapper[192] = 'console'  // ~ key
```

## 🐛 Troubleshooting

### Console won't open?
- **Check Key**: Try ~, `, or F5
- **Plugin Order**: Move CheatCommander lower in plugin list
- **Keyboard Layout**: Some layouts don't have ~ key
- **Solution**: Configure alternative hotkey in parameters

### Commands not working?
- **Syntax**: Check for typos in command names
- **Parameters**: Ensure parameters are valid numbers/text
- **Context**: Some commands only work in specific scenes
  - `killall` requires active battle
  - `teleport` requires map scene

### Display issues?
- **Opacity**: Adjust window opacity in plugin parameters
- **Text**: Change text colors if hard to read
- **Overlap**: Console may overlap with custom UI
- **Z-Index**: Ensure console window renders on top

### Game crashes?
- **Invalid IDs**: Using item/weapon/armor IDs that don't exist
- **Map IDs**: Teleporting to non-existent maps
- **Save/Load**: Loading corrupted or incompatible saves

### God mode not working?
- **Battle Only**: God mode affects battle damage
- **Map Damage**: Does not prevent map event damage
- **Status Effects**: Does not prevent status ailments
- **Solution**: Use `clearstatus` for status effects

## 💡 Best Practices

### Development Workflow

**Before Testing:**
```
> fps                      // Monitor performance
> coords                   // Track position
```

**During Testing:**
```
> eventinfo                // Check event setup
> showswitches 1 50        // Monitor game state
> showvars 1 50            // Track variables
```

**Problem Solving:**
```
> teleport [map] [x] [y]   // Jump to problem areas
> switch [id] on/off       // Test switch logic
> var [id] [value]         // Test variable conditions
```

### Playtesting Tips

1. **Save Often**: Use `save [slot]` to create test checkpoints
2. **Toggle Wisely**: Remember to disable cheats before real testing
3. **Document**: Note which commands you used for reproduction
4. **Clear History**: Use `clear` before important testing sessions

### Command Combinations

**Fast Travel Setup:**
```
> speed 6
> noclip
> encounter
```

**Battle Testing:**
```
> godmode
> instanttp
> level 99
```

**Economy Testing:**
```
> gold 999999
> item 1 99
> weapon 1 99
> armor 1 99
```

## 🔒 Security & Deployment

### For Development Only

⚠️ **Important**: This plugin is designed for development and testing only!

**Before Release:**
1. ❌ **Disable** or **remove** CheatCommander from plugin list
2. ❌ Delete the plugin file from `js/plugins/` folder
3. ✅ Test game thoroughly without cheats enabled
4. ✅ Verify console doesn't open in production

### Deployment Checklist

```
☐ Remove CheatCommander.js from plugins folder
☐ Remove from Plugin Manager list
☐ Test that ~ key does nothing
☐ Verify no console appears
☐ Check game plays normally
☐ Test save/load still works
☐ Confirm no cheat state persists
```

## 🚀 Future Enhancements

Potential features for future versions:

- 📜 **Command History Navigation** - Up/Down arrow keys
- 💾 **Command Aliases** - Create custom shortcuts
- 🎨 **Theme System** - Customizable colors and styles
- 📊 **Performance Profiler** - Detailed performance metrics
- 🗺️ **Map Editor** - Real-time map modifications
- 🎭 **Actor Editor** - Modify actor stats on-the-fly
- 📝 **Command Macros** - Save and execute command sequences
- 🔍 **Search System** - Find events, items, switches by name
- 📈 **Analytics** - Track playtesting metrics
- 🌐 **Remote Console** - Control game from web browser

## 📝 Changelog

### Version 1.0.0 (2025-11-15)
- ✨ Initial release
- 🎮 40+ cheat and developer commands
- 🖥️ Professional console interface
- 📊 FPS and coordinate overlay
- 🛡️ God mode and no-clip functionality
- 💾 Quick save/load system
- 🔍 Event and flag inspection tools
- ⚡ Optimized performance
- 🎨 Matrix-themed UI design

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
* **Technologies**: JavaScript ES6+, HTML5 Canvas, Event System
* **Inspiration**: Classic game developer consoles (Quake, Source Engine, Unreal)

## 🤝 Contributing

Found a bug or have a feature request?
- 🐛 Report issues on GitHub
- 💡 Suggest new commands
- 🔧 Submit pull requests
- ⭐ Star the repository if you find it useful!

## ⚠️ Disclaimer

This plugin is intended for **development and testing purposes only**. Using cheats can break game balance and ruin the player experience. Always remove this plugin before distributing your game to players.

**The developer is not responsible for:**
- Game balance issues caused by cheats
- Save file corruption from invalid commands
- Performance issues from excessive command use
- Any problems arising from modified game state

## 📞 Support

Need help?
- 📖 Read this documentation thoroughly
- 🔍 Check the troubleshooting section
- 💬 Visit RPG Maker forums
- 🌐 Check the official website

## 🎓 Tutorials

### Quick Start Guide

**Step 1: Installation**
```
1. Download plugin
2. Place in js/plugins/
3. Enable in Plugin Manager
4. Save project
```

**Step 2: First Commands**
```
1. Start test play (F12)
2. Press ~ key
3. Type: help
4. Type: gold
5. Type: heal
```

**Step 3: Explore**
```
Try these commands:
> fps
> coords  
> godmode
> noclip
> level 50
```

### Advanced Usage

**Creating Test Scenarios**
```
// Set up a specific game state
> teleport 10 5 5
> level 30
> switch 15 on
> var 20 100
> gold 50000
> item 10 5
```

**Performance Testing**
```
// Monitor game performance
> fps
> coords
// Now test heavy content areas
```

**Event Debugging**
```
// Check event behavior
> coords
> eventinfo
> showswitches 1 30
> switch 5 on
// Trigger event and observe
```

---

**Made with ❤️ for the RPG Maker community**

*Debug faster, test smarter, develop better!* 🎮✨
