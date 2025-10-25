# PushBack Plugin for RPG Maker MZ

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-red.svg)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-green.svg)


## ⚙️ Changelog
* 1.1.0 - Updated the plugin to work with decimal (like 0.5) square

## 👤 Author

**Alexandros Panagiotakopoulos**

An intelligent collision system for RPG Maker MZ that creates invisible force fields around events. Perfect for moving traffic, dangerous zones, and dynamic environmental hazards that push the player away.



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

## ✨ Features

- 🎯 **Invisible Collision Zones** - Creates square barriers around events
- 🚗 **Moving Traffic Support** - Zones move automatically with events
- ⚡ **Instant Response** - Player bounces back immediately on contact
- 🎨 **Customizable Distance** - Adjust zone size per event
- 📦 **Lightweight** - Minimal performance impact
- 🔧 **Zero Configuration** - Just add a note tag and go

## 📦 Installation

1. Download `PushBack.js`
2. Place it in your project's `js/plugins/` folder
3. Open RPG Maker MZ Plugin Manager
4. Add "PushBack" to your plugin list
5. Enable the plugin
6. Start using note tags on your events

## 🎮 Usage

### Basic Usage

Add the following note tag to any event:

```
<pushback: distance>
```

**Example:**
```
<pushback: 2>
```

This creates a 5x5 tile invisible barrier around the event (2 tiles in each direction + the event itself).

### Visual Example

```
Event with <pushback: 2>

    ■ ■ ■ ■ ■
    ■ ■ ■ ■ ■
    ■ ■ E ■ ■  ← Event (E) with 2-tile pushback zone
    ■ ■ ■ ■ ■
    ■ ■ ■ ■ ■

■ = Pushback zone (invisible barrier)
E = Event position
```

When the player tries to walk into any ■ tile, they get pushed back in the opposite direction!

### Practical Examples

**Moving Carriage:**
```
Event Name: Horse_Carriage
Note: <pushback: 2>
Movement: Automatic Route (Loop)
```
Creates a moving obstacle that players cannot approach.

**Dangerous Machinery:**
```
Event Name: Steam_Engine
Note: <pushback: 3>
Movement: None
```
Creates a large danger zone around stationary hazards.

**City Traffic:**
```
Event Name: Merchant_Cart
Note: <pushback: 1>
Movement: Random
```
Creates realistic street traffic that pushes players aside.

**Boss Arena:**
```
Event Name: Dragon_Boss
Note: <pushback: 4>
Movement: Toward Player
```
Creates a threatening presence with a large danger zone.

### Distance Guidelines

| Distance | Zone Size | Use Case |
|----------|-----------|----------|
| **1** | 3x3 tiles | Small obstacles, pedestrians |
| **2** | 5x5 tiles | Carriages, carts, standard vehicles |
| **3** | 7x7 tiles | Large vehicles, dangerous machinery |
| **4** | 9x9 tiles | Boss monsters, massive objects |
| **5+** | 11x11+ tiles | Epic encounters, extreme hazards |

## 🎯 Use Cases

### Moving Traffic Systems
Create realistic city streets with carriages, carts, and wagons that push players out of the way.

### Environmental Hazards
Implement dangerous machinery, steam vents, or magical barriers that keep players at a safe distance.

### Dynamic Boss Encounters
Give bosses threatening auras or charge attacks that push players back during combat.

### Crowd Simulation
Create bustling marketplaces where NPCs have personal space that pushes players away.

### Puzzle Mechanics
Design puzzles where players must navigate around moving pushback zones to reach objectives.

## 🔧 Technical Details

### How It Works

1. **Pre-Movement Check**: Before the player moves, the plugin checks their destination
2. **Zone Detection**: Calculates if the destination is within any event's pushback zone
3. **Direction Reversal**: If entering a zone, the player moves in the opposite direction
4. **Seamless Integration**: Uses RPG Maker's native movement system

### Collision Detection

The plugin uses **Manhattan distance** for zone detection:
```javascript
distance_x = |player.x - event.x|
distance_y = |player.y - event.y|

if (distance_x <= pushback_distance AND distance_y <= pushback_distance) {
    // Player is in pushback zone!
}
```

### Performance

- **Efficient Checking**: Only checks on player movement attempts
- **No Parallel Processes**: Zero runtime overhead when player is idle
- **Optimized Loop**: Early exit when pushback zone is detected
- **Memory Friendly**: No data storage, purely calculation-based

### Direction Mapping

```
Player Input → Pushback Response
Up (8)       → Down (2)
Down (2)     → Up (8)
Left (4)     → Right (6)
Right (6)    → Left (4)
```

## 🎨 Advanced Techniques

### Combining with Other Systems

**Moving Patrol Routes:**
```
Event: Guard with pushback zone
Movement: Custom route with "Repeat Movement"
Note: <pushback: 2>
```

**Conditional Pushback:**
```
Event Page 1: <pushback: 3> (hostile)
Event Page 2: No pushback (friendly after quest)
Condition: Switch "Guard Trusts Player" is ON
```

**Layered Zones:**
```
Event 1: Fire Core <pushback: 3>
Event 2: Heat Wave (around Event 1) <pushback: 5>
Result: Graduated danger zones
```

### Creating Traffic Systems

**One-Way Street:**
1. Create events moving in one direction
2. Add `<pushback: 1>` to all traffic events
3. Set movement type to "Custom Route" with loops
4. Player gets pushed if they try to walk into traffic

**Intersection:**
1. Create 4 traffic events (one per direction)
2. Add `<pushback: 2>` to each
3. Time movements so they don't collide
4. Player must wait for gaps to cross

## 🐛 Troubleshooting

### Player can enter the pushback zone?
- Check that the note tag is correctly formatted: `<pushback: X>` (no extra spaces)
- Verify the distance number is correct
- Ensure the plugin is enabled in Plugin Manager

### Player gets stuck or can't move?
- Reduce the pushback distance value
- Ensure events aren't overlapping their zones
- Check that you haven't surrounded the player completely

### Pushback doesn't work with moving events?
- This plugin works perfectly with moving events!
- The zone moves automatically with the event
- No additional configuration needed

### Player moves in wrong direction?
- The pushback always moves in the **opposite** direction of input
- This is intentional to simulate being "bounced back"
- If you want different behavior, adjust the `reverseDir` function

## 📝 Changelog

### Version 1.0.0 (2025-10-23)
- Initial release
- Square pushback zones via note tags
- Automatic zone movement with events
- Direction reversal on collision
- Optimized performance with pre-movement checking

---

**Made with ❤️ for the RPG Maker community**

*Perfect for cities with traffic, dangerous environments, and dynamic gameplay!*
