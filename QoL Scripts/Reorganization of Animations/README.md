# RPG Maker MZ Animation Reorganizer

A Python script that automatically categorizes and organizes RPG Maker MZ animations into logical groups with visual separators.

## Overview

This tool processes your `Animations.json` file and reorganizes all animations into categorized sections with emoji-labeled separators, making it much easier to find and manage animations in the RPG Maker MZ editor.

## Features

- **Automatic Categorization**: Intelligently categorizes animations based on their names and effect names
- **20+ Categories**: Organizes animations into elemental, physical, magical, and special effect categories
- **Visual Separators**: Adds emoji-labeled separator entries between categories for easy navigation
- **ID Renumbering**: Automatically renumbers all animation IDs sequentially
- **Preserves Data**: Maintains all animation properties while reorganizing

## Categories

The script organizes animations into the following categories:

| Category | Emoji | Description |
|----------|-------|-------------|
| PHYSICAL ATTACKS | ⚔️ | Basic physical attacks (hits, blows, slashes) |
| WEAPON ATTACKS | 🗡️ | Normal weapon attack animations |
| FIRE ELEMENT | 🔥 | Fire, flame, and burn effects |
| ICE ELEMENT | ❄️ | Ice, frost, and freeze effects |
| THUNDER ELEMENT | ⚡ | Lightning and electric effects |
| WATER ELEMENT | 💧 | Water, aqua, and splash effects |
| EARTH ELEMENT | 🌍 | Earth, stone, and rock effects |
| WIND ELEMENT | 💨 | Wind, gale, and tornado effects |
| LIGHT ELEMENT | ✨ | Holy, divine, and light effects |
| DARKNESS ELEMENT | 🌑 | Dark, shadow, and curse effects |
| NEUTRAL MAGIC | ⚪ | General magic and arcane effects |
| SUPPORT/HEALING | 💚 | Healing, cure, and recovery effects |
| STATUS EFFECTS | 💫 | Poison, paralysis, sleep, etc. |
| DEFENSIVE | 🛡️ | Shield, guard, and barrier effects |
| BREATH ATTACKS | 🐉 | Dragon breath and similar attacks |
| SHOOTING/LASER | 🔫 | Arrows, bullets, beams, and missiles |
| SPECIAL MOVES | 🌟 | Limit breaks and ultimate attacks |
| MISCELLANEOUS | 🎭 | Uncategorized animations |
| MGC EFFECTS | 🔮 | Special MGC-prefixed effects |
| BLOOD EFFECTS | 🩸 | Blood and gore effects |

## Installation

1. Ensure you have Python 3.6 or higher installed
2. Download the script to your project directory
3. No additional dependencies required (uses only Python standard library)

## Usage

### Basic Usage

1. Backup your `Animations.json` file (located in `data/` folder)
2. Place the script in your RPG Maker MZ project root directory
3. Run the script:

```bash
python animation_reorganizer.py
```

4. The script will create `Animations_Reorganized.json`
5. Review the reorganized file, then replace the original if satisfied

### Custom File Paths

You can modify the file paths in the script:

```python
if __name__ == "__main__":
    reorganize_animations(
        "path/to/input/Animations.json",
        "path/to/output/Animations_Reorganized.json"
    )
```

## How It Works

### Categorization Logic

The script uses a priority-based categorization system:

1. **Blood Effects**: Checked first via `effectName` to catch MGC_W3_Blood* effects
2. **Breath Attacks**: Identified before elemental checks
3. **Status Effects**: Checked before other categories
4. **Defensive Abilities**: Shields, barriers, and protection spells
5. **Support/Healing**: Healing and recovery effects
6. **Elemental Magic**: Fire, ice, thunder, water, earth, wind, light, darkness
7. **Physical/Weapon Attacks**: Basic combat animations
8. **Special Categories**: Shooting, MGC effects, and miscellaneous

### Keyword Matching

The script analyzes animation names for keywords like:
- Fire: "fire", "flame", "burn", "blaze", "inferno"
- Ice: "ice", "frost", "freeze", "blizzard"
- Healing: "heal", "cure", "regen", "restore"
- And many more...

## Output

The script generates:

- **Reorganized JSON file**: All animations sorted by category with separators
- **Statistics report**: Console output showing category distribution

Example output:
```
=== REORGANIZATION COMPLETE ===

Total animations processed: 245

Category Distribution:
  PHYSICAL: 15
  FIRE: 23
  ICE: 18
  THUNDER: 12
  SUPPORT: 8
  ...

Output saved to: Animations_Reorganized.json
```

## Example

### Before
```
1. Thunder Strike
2. Heal
3. Fireball
4. Ice Shard
...
```

### After
```
1. --⚔️PHYSICAL ATTACKS-----
2. Slash Attack
3. Body Slam
4. --🔥FIRE ELEMENT-----
5. Fireball
6. Inferno
7. --❄️ICE ELEMENT-----
8. Ice Shard
9. Blizzard
10. --💚SUPPORT/HEALING-----
11. Heal
...
```

## Important Notes

- **Always backup** your `Animations.json` before running the script
- The script renumbers all animation IDs sequentially
- Existing skill/item references to animations will need to be updated if IDs change
- Empty or null animation entries are skipped
- Separator entries are non-functional placeholders for organization only

## Troubleshooting

**Q: My animations disappeared!**  
A: Check that you're using the reorganized file. The script creates a new file rather than modifying the original.

**Q: Some animations are in the wrong category**  
A: You can modify the `categorize_effect()` function to adjust keyword matching for your specific animation names.

**Q: Can I add custom categories?**  
A: Yes! Add your category to `category_order`, create an emoji mapping in `create_separator()`, and add matching logic in `categorize_effect()`.

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new categories
- Improve categorization logic
- Add support for other RPG Maker versions

## License

This project is licensed under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**.

You are free to:
- **Share**: Copy and redistribute the material in any medium or format
- **Adapt**: Remix, transform, and build upon the material for any purpose, even commercially

Under the following terms:
- **Attribution**: You must give appropriate credit to Alexandros Panagiotakopoulos

See [LICENSE](https://creativecommons.org/licenses/by/4.0/) for full details.

## Credits

**Created by**: Alexandros Panagiotakopoulos  
**Website**: [alexandrospanag.github.io](https://alexandrospanag.github.io)


Made with ❤️ for the RPG Maker community
