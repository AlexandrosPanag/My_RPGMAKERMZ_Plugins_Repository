# RPG Maker MZ Animation Flash Effects Adder

A Python script that automatically adds element-themed screen flash effects to RPG Maker MZ animations, enhancing visual impact without manual configuration.

## Overview

This tool analyzes your `Animations.json` file and intelligently adds **color-coded screen flashes** to animations based on their elemental type. Each element gets unique, thematic flash colors that play at key animation moments.

Perfect for:
- **Enhancing existing animations** without recreating them
- **Batch processing** hundreds of animations at once
- **Consistent visual feedback** across all elemental attacks
- **DLC/plugin integration** where animations lack flash effects

## Features

- 🎨 **Element-Themed Colors**: 9+ predefined color schemes (Fire, Ice, Thunder, Water, etc.)
- ⚡ **Smart Detection**: Automatically identifies element type from animation names
- 🔄 **Non-Destructive**: Only adds flashes to animations that don't have them
- 📊 **Detailed Statistics**: Reports how many animations were enhanced
- 🎭 **Multiple Flash Patterns**: Each element gets 2-3 timed flashes for dynamic effect
- 💾 **Safe Processing**: Preserves all existing animation data

## Element Flash Colors

| Element | Flash Colors | Timing Pattern |
|---------|-------------|----------------|
| 🔥 **Fire** | Orange → Bright Yellow-Orange | 2 flashes (frames 0, 2) |
| ❄️ **Ice** | Light Blue → White-Blue | 2 flashes (frames 0, 2) |
| ⚡ **Thunder** | Yellow → White → Blue-White | 3 flashes (frames 0, 1, 3) |
| 💧 **Water** | Deep Blue → Light Blue | 2 flashes (frames 0, 2) |
| 🌍 **Earth** | Brown → Sandy Brown | 2 flashes (frames 0, 2) |
| 💨 **Wind** | Light Green → Pale Green | 2 flashes (frames 0, 2) |
| ✨ **Light** | Bright Yellow → Pure White | 2 flashes (frames 0, 1) |
| 🌑 **Darkness** | Purple → Dark Purple | 2 flashes (frames 0, 2) |
| 🩸 **Blood** | Dark Red → Bright Red | 2 flashes (frames 0, 2) |
| ⚔️ **Physical** | White Flash | 1 flash (frame 0) |

## Installation

### Requirements

- Python 3.6 or higher
- No external dependencies (uses only Python standard library)

### Setup

1. Download the script
2. Place it in your project directory or anywhere accessible
3. No installation required - it's a standalone script

## Usage

### Basic Usage

1. **Configure File Paths**:
   ```python
   if __name__ == "__main__":
       input_file = r"C:\path\to\your\Animations.json"
       output_file = r"C:\path\to\your\Animations_WithFlash.json"
       
       add_flash_effects(input_file, output_file)
   ```

2. **Run the Script**:
   ```bash
   python flash_effects_adder.py
   ```

3. **Review Output**:
   ```
   ============================================================
   FLASH EFFECTS ADDED
   ============================================================
   
   Total animations processed: 470
   Already had flash effects: 120
   ✨ Flash effects added: 315
   Skipped (separators/no match): 35
   
   📁 Output saved to: Animations_WithFlash.json
   ```

4. **Test in RPG Maker MZ**:
   - Backup your original `Animations.json`
   - Replace with `Animations_WithFlash.json`
   - Test animations in battle

### Example Workflow

```bash
# Step 1: Backup
cp data/Animations.json data/Animations_backup.json

# Step 2: Run script
python flash_effects_adder.py

# Step 3: Review output file
# Check Animations_WithFlash.json

# Step 4: Deploy
cp Animations_WithFlash.json data/Animations.json

# Step 5: Test in RPG Maker MZ
```

## How It Works

### Detection Logic

The script analyzes each animation's `name` and `effectName` fields:

```python
# Example detection
Animation: "Fire Strike"
Effect: "Fire3"

→ Contains "fire"
→ Apply Fire flash template (Orange → Yellow-Orange)
```

### Flash Template Structure

Each element has a predefined flash pattern:

```python
'fire': [
    {"frame": 0, "duration": 15, "color": [255, 128, 0, 170]},    # Orange
    {"frame": 2, "duration": 20, "color": [255, 200, 100, 200]},  # Bright yellow
]
```

**Parameters:**
- `frame`: Animation frame when flash occurs
- `duration`: How long flash lasts (in frames, 60 FPS)
- `color`: RGBA values [Red, Green, Blue, Alpha]

### Processing Rules

1. ✅ **Add Flash**: Animation has no existing `flashTimings`
2. ⏭️ **Skip**: Animation already has flash effects
3. ⏭️ **Skip**: Category separators (names starting with `--`)
4. ⏭️ **Skip**: No element detected (unless physical attack)

## Element Keywords

The script detects elements by checking for these keywords:

### Fire Element
- fire, flame, burn, blaze, heat, inferno, pyro

### Ice Element
- ice, frost, freeze, cold, blizzard, cryo

### Thunder Element
- thunder, lightning, electric, bolt, shock

### Water Element
- water, aqua, splash, wave, tsunami, hydro

### Earth Element
- earth, stone, rock, quake, ground, geo

### Wind Element
- wind, gale, tornado, cyclone, breeze, aero

### Light Element
- light, holy, divine, sacred, celestial, radiant

### Darkness Element
- dark, shadow, evil, curse, hex, doom

### Blood Effect
- blood

### Physical Attacks
- attack, hit, slash, pierce, blow, strike

## Customization

### Adding Custom Elements

Add your own element flash patterns:

```python
flash_templates = {
    # ... existing elements ...
    
    'poison': [
        {"frame": 0, "duration": 15, "color": [150, 255, 50, 160]},   # Toxic green
        {"frame": 2, "duration": 20, "color": [100, 200, 100, 180]},  # Darker green
    ],
    'sonic': [
        {"frame": 0, "duration": 10, "color": [200, 200, 255, 140]},  # Sound wave
        {"frame": 1, "duration": 15, "color": [230, 230, 255, 170]},
    ],
}
```

### Adjusting Flash Intensity

Modify the alpha channel (4th color value):

```python
# Subtle flash (lower alpha)
"color": [255, 128, 0, 100]  # Alpha: 100

# Intense flash (higher alpha)
"color": [255, 128, 0, 255]  # Alpha: 255
```

### Changing Timing

Adjust when flashes occur:

```python
# Quick succession
{"frame": 0, "duration": 10, "color": [...]},
{"frame": 1, "duration": 10, "color": [...]},

# Delayed impact
{"frame": 0, "duration": 15, "color": [...]},
{"frame": 5, "duration": 20, "color": [...]},
```

## Output Statistics

The script provides detailed statistics:

```
============================================================
FLASH EFFECTS ADDED
============================================================

Total animations processed: 470
Already had flash effects: 120      ← Unchanged
✨ Flash effects added: 315         ← Enhanced
Skipped (separators/no match): 35  ← Not applicable

📋 Flash colors by element:
  🔥 Fire: Orange/Yellow-orange
  ❄️  Ice: Light blue/White-blue
  ...

📁 Output saved to: Animations_WithFlash.json

💡 Tip: Flash effects make elemental attacks more impactful!
```

## Before & After Comparison

### Before (No Flash)
```json
{
  "id": 45,
  "name": "Fireball",
  "effectName": "Fire3",
  "flashTimings": [],  ← Empty
  "soundTimings": [...]
}
```

### After (With Flash)
```json
{
  "id": 45,
  "name": "Fireball",
  "effectName": "Fire3",
  "flashTimings": [    ← Added
    {"frame": 0, "duration": 15, "color": [255, 128, 0, 170]},
    {"frame": 2, "duration": 20, "color": [255, 200, 100, 200]}
  ],
  "soundTimings": [...]
}
```

## Use Cases

### DLC Integration
After importing DLC animation packs:
```bash
python flash_effects_adder.py
# Adds missing flashes to all new animations
```

### Plugin Animations
Enhance animations from plugins that lack flashes:
```bash
# Input: Plugin animations without flashes
# Output: Same animations with element-themed flashes
```

### Batch Enhancement
Update hundreds of animations at once:
```bash
# Manual method: Hours of clicking in RPG Maker
# Script method: Seconds of processing
```

### Visual Consistency
Ensure all elemental attacks have the same visual language:
```bash
# All fire attacks: Orange flashes
# All ice attacks: Blue flashes
# Consistent across entire game
```

## Advanced Features

### Selective Processing

Process only specific categories:

```python
def should_add_flash(anim):
    """Custom filter for which animations to enhance."""
    name = anim.get('name', '').lower()
    
    # Only add to offensive spells
    if any(x in name for x in ['strike', 'blast', 'bolt']):
        return True
    
    # Skip support/healing
    if any(x in name for x in ['heal', 'cure', 'buff']):
        return False
    
    return True
```

### Custom Flash Patterns

Create situational flash effects:

```python
def get_boss_attack_flash():
    """Special flash pattern for boss attacks."""
    return [
        {"frame": 0, "duration": 10, "color": [255, 0, 0, 200]},
        {"frame": 2, "duration": 10, "color": [255, 255, 255, 255]},
        {"frame": 4, "duration": 10, "color": [255, 0, 0, 200]},
        {"frame": 6, "duration": 15, "color": [100, 0, 0, 150]},
    ]
```

### Batch Processing Multiple Files

Process several animation files:

```python
files = [
    ("Animations_Base.json", "Animations_Base_Flash.json"),
    ("Animations_DLC.json", "Animations_DLC_Flash.json"),
    ("Animations_Custom.json", "Animations_Custom_Flash.json"),
]

for input_file, output_file in files:
    add_flash_effects(input_file, output_file)
    print(f"✅ Processed {input_file}")
```

## Troubleshooting

### No Flashes Added
**Issue**: Script reports 0 flashes added

**Solutions:**
- Check that animations don't already have `flashTimings`
- Verify animation names contain element keywords
- Review detection logic for your naming convention

### Wrong Colors
**Issue**: Flash colors don't match element

**Solutions:**
- Check animation name/effectName for unexpected keywords
- Adjust detection priority in `get_element_flash_timings()`
- Customize flash templates for your needs

### Too Intense/Subtle
**Issue**: Flashes are too bright or too dim

**Solutions:**
```python
# Too bright - reduce alpha
"color": [255, 128, 0, 120]  # Was 170

# Too dim - increase alpha
"color": [255, 128, 0, 220]  # Was 170
```

### Flash Timing Off
**Issue**: Flash doesn't sync with animation

**Solutions:**
```python
# Adjust frame timing
{"frame": 1, ...}  # Delay by 1 frame
{"frame": 0, ...}  # Immediate
```

## Performance

- **Processing Speed**: ~0.5 seconds for 500 animations
- **Memory Usage**: < 30 MB typical
- **File Size**: Adds ~0.2 KB per animation
- **In-Game Impact**: Negligible (flashes are optimized)

## Best Practices

### Before Running
1. ✅ **Backup** your `Animations.json` file
2. ✅ **Test** on a copy first
3. ✅ **Review** element detection logic
4. ✅ **Verify** output file path

### After Running
1. ✅ **Compare** file sizes (should increase slightly)
2. ✅ **Test** in RPG Maker MZ editor
3. ✅ **Playtest** battle animations
4. ✅ **Adjust** colors if needed

### Integration Workflow
```bash
# 1. Clean duplicates
python animation_analyzer.py

# 2. Reorganize categories  
python animation_reorganizer.py

# 3. Add flash effects
python flash_effects_adder.py

# 4. Deploy to game
cp Animations_WithFlash.json data/Animations.json
```

## Color Theory Guide

### Element Color Choices

**Fire (Orange/Yellow)**
- Warm, energetic colors
- High intensity for explosive feel
- Bright yellow suggests heat

**Ice (Blue/White)**
- Cool, crystalline colors
- White suggests frost
- Light blue = cold temperature

**Thunder (Yellow/White/Blue)**
- Multiple flashes = electrical discharge
- Yellow = energy, White = flash, Blue = afterglow
- Quick succession = crackling effect

**Earth (Brown)**
- Natural, solid colors
- Sandy brown = dust/debris
- Lower alpha = grounded feeling

**Darkness (Purple)**
- Mysterious, ominous colors
- Dark purple = shadow magic
- Avoid pure black (not visible)

## FAQ

**Q: Will this overwrite existing flashes?**  
A: No, it only adds flashes to animations that have empty `flashTimings` arrays.

**Q: Can I run this multiple times?**  
A: Yes, but it won't add duplicates. Already-enhanced animations are skipped.

**Q: Does it work with custom animations?**  
A: Yes, as long as the animation names contain element keywords.

**Q: Can I undo the changes?**  
A: Yes, use your backup or re-run from original file.

**Q: What if my element uses different names?**  
A: Modify the keyword detection in `get_element_flash_timings()`.

## Contributing

Contributions welcome! You can:
- Add new element flash templates
- Improve keyword detection
- Create alternate color schemes
- Add GUI interface
- Suggest timing improvements

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
**Date**: February 7, 2026

## Version History

- **v1.0.0** (2026-02-07): Initial release
  - 9 element flash templates
  - Physical attack flashes
  - Smart detection system
  - Statistical reporting

## Related Tools

- **Animation Reorganizer**: Categorizes and sorts animations
- **Animation Analyzer**: Finds duplicates and suggests cleanup
- **RPG Maker MZ**: Official game development software

---

**Pro Tip**: Combine this tool with the Animation Reorganizer for a complete animation database enhancement workflow!

Made with ❤️ for the RPG Maker community
