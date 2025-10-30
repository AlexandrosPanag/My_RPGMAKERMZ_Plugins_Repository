# TripleSizer Plugin for RPG Maker MZ

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-red.svg)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-green.svg)


⚠️ IMPORTANT: Due to common RPG Maker MZ bugs commonly known as Texture Bleeding I recommend you download and place FIRST the following plugin to avoid the "line" sprite animation bug:
https://github.com/AlexandrosPanag/My_RPGMAKERMZ_Plugins_Repository/tree/main/Fixes/FixTextureBleeding


## 👤 Author

**Alexandros Panagiotakopoulos**

An automatic sprite size tripler for RPG Maker MZ that intelligently scales event sprites based on their names. Perfect for giant bosses, massive structures, colossal creatures, and any object that needs to dominate the visual space.

## ✨ Features

- 🎯 **Automatic Detection** - Simply name your events with a trigger word
- 🚀 **Zero Configuration** - Works instantly without plugin commands
- ⚡ **Performance Optimized** - No parallel processes or constant checks
- 🎨 **Customizable** - Adjust trigger word and scale factor
- 📦 **Lightweight** - Minimal code footprint
- 🔧 **Easy Integration** - Drop in and use immediately
- 🤝 **DoubleSizer Compatible** - Works alongside DoubleSizer without conflicts

## 📦 Installation

1. Download `TripleSizer.js`
2. Place it in your project's `js/plugins/` folder
3. Open RPG Maker MZ Plugin Manager
4. Add "TripleSizer" to your plugin list
5. Enable the plugin
6. (Optional) Configure parameters

## 🎮 Usage

### Basic Usage

Simply name your event with the trigger word (default: `TripleEvent`) anywhere in the event name:

```
✅ TripleEvent
✅ TripleEvent_Dragon
✅ Boss_TripleEvent
✅ TripleEvent_Giant_Golem
✅ ColossalTitan_TripleEvent_01
❌ MyBoss (doesn't contain trigger word)
```

The sprite will automatically be tripled in size when the map loads!

### Event Naming Examples

**For Giant Bosses:**
- `TripleEvent_Dragon_Ancient`
- `TripleEvent_Demon_Lord`
- `Titan_TripleEvent`

**For Colossal Creatures:**
- `TripleEvent_Leviathan`
- `TripleEvent_Behemoth`
- `Kraken_TripleEvent_Sea`

**For Massive Structures:**
- `TripleEvent_Statue_Guardian`
- `TripleEvent_Mech_Battle`
- `Tower_TripleEvent`

**For Epic NPCs:**
- `TripleEvent_King_Throne`
- `TripleEvent_Elder_Tree_Spirit`
- `Guardian_TripleEvent_Ancient`

### Plugin Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| **Trigger Word** | String | `TripleEvent` | The word to look for in event names. Events containing this word will be scaled. |
| **Scale Factor** | Number | `3.0` | The size multiplier. 3.0 = triple size, 4.0 = quadruple size, etc. |

### Advanced Configuration

You can customize the trigger word to match your project's naming convention:

```
Trigger Word: "GiantSprite" → Name events: "GiantSprite_Boss"
Trigger Word: "3X" → Name events: "3X_Dragon"
Trigger Word: "Colossal" → Name events: "Colossal_Titan"
```

You can also adjust the scale factor for different size needs:

```
Scale Factor: 2.5 → 2.5x larger
Scale Factor: 3.0 → Triple size (default)
Scale Factor: 4.0 → Quadruple size
Scale Factor: 5.0 → Quintuple size
```

## 🎯 Use Cases

### Epic Boss Battles
Create imposing boss enemies that tower over the player, emphasizing their threat level and importance.

### Kaiju/Monster Encounters
Design massive creatures like dragons, titans, or sea monsters that dominate the battlefield.

### Colossal Structures
Represent enormous structures like giant statues, mechanical walkers, or ancient guardians.

### Mythological Beings
Give gods, elder spirits, and legendary creatures an appropriately massive presence.

### Environmental Scale
Create sense of scale with giant environmental objects like ancient trees, massive crystals, or towering monuments.

### Mech/Robot Battles
Perfect for large mechanized units, battle mechs, or giant robots in sci-fi settings.

## 🔧 Technical Details

### How It Works

1. **Initialization**: When a map loads, each event checks if its name contains the trigger word
2. **Priority Check**: If DoubleSizer is active on an event, TripleSizer defers to it
3. **Flag Setting**: Events with matching names (and not using DoubleSizer) are flagged as "triple sized"
4. **Sprite Scaling**: The sprite renderer applies the scale factor during rendering
5. **Persistent**: The scaling remains active as long as the event exists

### Compatibility with DoubleSizer

TripleSizer is designed to work harmoniously with DoubleSizer:
- **Priority System**: DoubleSizer takes precedence if both trigger words are present
- **No Conflicts**: Both plugins can be active simultaneously
- **Independent Operation**: Each plugin manages its own events

### Performance

- **One-time Check**: Event names are only checked once during initialization
- **No Runtime Overhead**: No continuous checking or parallel processes
- **Efficient Rendering**: Uses native sprite scaling (hardware accelerated)
- **Memory Friendly**: Minimal memory footprint
- **Optimized Updates**: Only applies scaling when necessary

### Compatibility

- ✅ RPG Maker MZ (all versions)
- ✅ Compatible with DoubleSizer plugin
- ✅ Compatible with most plugins
- ✅ Works with all character sprites
- ✅ Supports both static and animated sprites
- ✅ Compatible with event systems

## 🐛 Troubleshooting

### Event not tripling in size?
- Check that the event name contains the trigger word exactly (case-sensitive)
- Verify the plugin is enabled in Plugin Manager
- If using DoubleSizer, ensure both plugins don't target the same event
- Ensure the plugin is loaded before other character-sprite-related plugins

### Sprite appears pixelated or blurry?
- This is normal when scaling raster graphics significantly
- Use higher resolution sprite sheets (at least 2-3x native size) for better quality when scaled
- Consider using 96x96 or 144x144 character sprites for triple-sized events
- Anti-aliasing may cause slight blurriness at extreme scales

### Conflicts with other plugins?
- Try moving TripleSizer higher or lower in the plugin list
- Check for other plugins that modify sprite rendering or scaling
- Ensure you're using the latest version
- Test with DoubleSizer to ensure proper compatibility

### Performance issues with many triple-sized sprites?
- Limit the number of triple-sized events visible on screen simultaneously
- Use higher quality but compressed sprite sheets
- Consider reducing scale factor to 2.5x if performance is critical

## 💡 Design Tips

### Sprite Creation
- **Higher Resolution**: Create sprites at 2-3x the standard resolution for best quality
- **Detail Level**: Triple-sized sprites can show more detail, use this to your advantage
- **Contrast**: Ensure sprites have good contrast so they remain visible when scaled

### Visual Balance
- **Screen Space**: Triple-sized sprites take 9x the visual space, plan accordingly
- **Camera Positioning**: Consider zooming out or adjusting camera for large events
- **Collision**: Remember to adjust collision hitboxes for gameplay balance

### Use Cases
- **Boss Intros**: Perfect for dramatic boss battle introductions
- **Scale Storytelling**: Use size to convey power, importance, or threat level
- **Environmental Design**: Create memorable landmarks with massive objects

## 📝 Changelog

### Version 1.0.0 (2025-10-30)
- Initial release
- Automatic event detection via name matching
- Configurable trigger word and scale factor
- Full compatibility with DoubleSizer plugin
- Optimized performance with one-time initialization
- Priority system to prevent scaling conflicts


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
* **Technologies**: JavaScript ES6+, Hardware-Accelerated Sprite Rendering
* **Inspiration**: Epic boss battles and colossal scale encounters in classic RPGs

## 🔗 Related Plugins

* **DoubleSizer** - Companion plugin for 2x sprite scaling
* **FixTextureBleeding** - Essential fix for sprite animation artifacts

---

**Made with ❤️ for the RPG Maker community**
