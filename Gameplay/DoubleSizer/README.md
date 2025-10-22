# DoubleSizer Plugin for RPG Maker MZ

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-red.svg)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-green.svg)


⚠️ IMPORTANT: Due to common RPG Maker MZ bugs commonly known as Texture Bleeding I recommend you download and place FIRST the following plugin to avoid the "line" sprite animation bug:
https://github.com/AlexandrosPanag/My_RPGMAKERMZ_Plugins_Repository/tree/main/Fixes/FixTextureBleeding


## 👤 Author

**Alexandros Panagiotakopoulos**

An automatic sprite size doubler for RPG Maker MZ that intelligently scales event sprites based on their names. Perfect for boats, vehicles, large NPCs, and any object that needs to stand out visually.

## ✨ Features

- 🎯 **Automatic Detection** - Simply name your events with a trigger word
- 🚀 **Zero Configuration** - Works instantly without plugin commands
- ⚡ **Performance Optimized** - No parallel processes or constant checks
- 🎨 **Customizable** - Adjust trigger word and scale factor
- 📦 **Lightweight** - Minimal code footprint
- 🔧 **Easy Integration** - Drop in and use immediately

## 📦 Installation

1. Download `DoubleSizer.js`
2. Place it in your project's `js/plugins/` folder
3. Open RPG Maker MZ Plugin Manager
4. Add "DoubleSizer" to your plugin list
5. Enable the plugin
6. (Optional) Configure parameters

## 🎮 Usage

### Basic Usage

Simply name your event with the trigger word (default: `DoubleEvent`) anywhere in the event name:

```
✅ DoubleEvent
✅ DoubleEvent_Boat
✅ Ship_DoubleEvent
✅ DoubleEvent_Boss_Dragon
✅ LargeBoat_DoubleEvent_01
❌ MyBoat (doesn't contain trigger word)
```

The sprite will automatically be doubled in size when the map loads!

### Event Naming Examples

**For Boats:**
- `DoubleEvent_Boat_Small`
- `DoubleEvent_Ship_Pirate`
- `Ferry_DoubleEvent`

**For Vehicles:**
- `DoubleEvent_Carriage`
- `DoubleEvent_AirShip`
- `Tank_DoubleEvent_Heavy`

**For Large NPCs/Bosses:**
- `DoubleEvent_Dragon_Boss`
- `DoubleEvent_Giant_NPC`
- `King_DoubleEvent`

### Plugin Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| **Trigger Word** | String | `DoubleEvent` | The word to look for in event names. Events containing this word will be scaled. |
| **Scale Factor** | Number | `2.0` | The size multiplier. 2.0 = double size, 3.0 = triple size, etc. |

### Advanced Configuration

You can customize the trigger word to match your project's naming convention:

```
Trigger Word: "BigSprite" → Name events: "BigSprite_Boat"
Trigger Word: "2X" → Name events: "2X_Ship"
Trigger Word: "Large" → Name events: "Large_Dragon"
```

You can also adjust the scale factor for different size needs:

```
Scale Factor: 1.5 → 50% larger
Scale Factor: 2.0 → Double size (default)
Scale Factor: 3.0 → Triple size
Scale Factor: 4.0 → Quadruple size
```

## 🎯 Use Cases

### Maritime Transportation
Create realistic-looking boats and ships that are appropriately sized for passenger transport.

### Vehicle Systems
Make carriages, wagons, and other vehicles appear larger than standard character sprites.

### Boss Encounters
Give boss enemies an imposing presence with larger sprites.

### Environmental Objects
Create large environmental objects like statues, monuments, or machinery.

### Cutscene Characters
Make specific characters stand out during important cutscenes.

## 🔧 Technical Details

### How It Works

1. **Initialization**: When a map loads, each event checks if its name contains the trigger word
2. **Flag Setting**: Events with matching names are flagged as "double sized"
3. **Sprite Scaling**: The sprite renderer applies the scale factor during rendering
4. **Persistent**: The scaling remains active as long as the event exists

### Performance

- **One-time Check**: Event names are only checked once during initialization
- **No Runtime Overhead**: No continuous checking or parallel processes
- **Efficient Rendering**: Uses native sprite scaling (hardware accelerated)
- **Memory Friendly**: Minimal memory footprint

### Compatibility

- ✅ RPG Maker MZ (all versions)
- ✅ Compatible with most plugins
- ✅ Works with all character sprites
- ✅ Supports both static and animated sprites
- ✅ Compatible with vehicle systems

## 🐛 Troubleshooting

### Event not doubling in size?
- Check that the event name contains the trigger word exactly (case-sensitive)
- Verify the plugin is enabled in Plugin Manager
- Ensure the plugin is loaded before other character-sprite-related plugins

### Sprite appears pixelated?
- This is normal when scaling raster graphics
- Use higher resolution sprite sheets for better quality when scaled
- Consider using vector-based character generators if available

### Conflicts with other plugins?
- Try moving DoubleSizer higher or lower in the plugin list
- Check for other plugins that modify sprite rendering
- Ensure you're using the latest version

## 📝 Changelog

### Version 1.0.0 (2025-10-20)
- Initial release
- Automatic event detection via name matching
- Configurable trigger word and scale factor
- Optimized performance with one-time initialization


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

---

**Made with ❤️ for the RPG Maker community**
