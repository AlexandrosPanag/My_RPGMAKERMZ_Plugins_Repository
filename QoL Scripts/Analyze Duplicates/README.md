# RPG Maker MZ Animation Duplicate Analyzer

A Python script that analyzes your `Animations.json` file to find duplicates, similar animations, and minimal/empty animations that can be safely removed to optimize your project.

## Overview

This diagnostic tool helps you clean up and optimize your RPG Maker MZ animation database by identifying:
- **Duplicate animations** using the same effect files
- **Similar animations** with the same name but different effects
- **Minimal animations** with no sound, flash, or visual effects
- **File size reduction** potential

Perfect for projects that have accumulated redundant animations over time or use DLC/plugin animation packs.

## Features

- 🔍 **Duplicate Detection**: Finds animations sharing the same `effectName`
- 📊 **Statistical Analysis**: Provides comprehensive breakdown of your animation database
- 🧹 **Cleanup Recommendations**: Suggests which animations can be safely removed
- 💾 **Size Estimation**: Calculates potential file size reduction
- 📋 **Detailed Reports**: Shows all duplicates with ID and name references

## Installation

### Requirements

- Python 3.6 or higher
- No external dependencies (uses only Python standard library)

### Setup

1. Download the script to your computer
2. No installation needed - it's a standalone Python script

## Usage

### Basic Usage

1. **Locate your Animations.json file**:
   - Default path: `YourProject/data/Animations.json`

2. **Edit the script** to point to your file:
   ```python
   if __name__ == "__main__":
       file_path = r"C:\path\to\your\project\data\Animations.json"
       results = analyze_duplicates(file_path)
   ```

3. **Run the script**:
   ```bash
   python animation_analyzer.py
   ```

4. **Review the output** in your console

### Example Output

```
============================================================
DUPLICATE/CLEANUP ANALYSIS
============================================================

📋 SAME EFFECT, DIFFERENT NAMES (Potential duplicates):
------------------------------------------------------------

Effect: Fire1
  Used by 3 animations:
    • ID 45: Fireball
    • ID 128: Fire Attack
    • ID 203: Flame Strike

📋 SAME NAME, DIFFERENT EFFECTS (Variants):
------------------------------------------------------------

Name: Thunder Strike
  2 variants:
    • ID 67: Thunder1
    • ID 189: Thunder3

📋 MINIMAL ANIMATIONS (Can be removed):
------------------------------------------------------------
  • ID 12: (empty) - No sound, flash, or effect
  • ID 34: Placeholder - No sound, flash, or effect
  • ID 56: Test Animation - No sound, flash, or effect

  Total minimal animations: 15

============================================================
SUMMARY
============================================================
Total animations analyzed: 470
Effects with multiple uses: 12
Names used multiple times: 8
Minimal animations to remove: 15

💡 CLEANUP RECOMMENDATIONS:
------------------------------------------------------------
1. Review 12 duplicated effects
   → Keep one variant per effect, remove others

2. Remove 15 minimal animations
   → These have no sound, flash, or visual effect

✂️ POTENTIAL FILE SIZE REDUCTION:
   Removing 15 animations could save ~6.0 KB
```

## What It Detects

### 1. Same Effect, Different Names

Animations that use the **same effect file** (`effectName`) but have different display names.

**Example:**
```
Effect: "HitPhysical"
  • ID 2: "Hit/Physical"
  • ID 145: "Physical Strike"
  • ID 287: "Basic Hit"
```

**Why it matters:** These are functionally identical and waste database space. Keep the best-named one and remove duplicates.

### 2. Same Name, Different Effects

Animations with **identical display names** but different effect files.

**Example:**
```
Name: "Fire Strike"
  • ID 34: Effect "Fire1"
  • ID 98: Effect "Fire3"
```

**Why it matters:** These are variants of the same concept. Consider renaming or consolidating them (e.g., "Fire Strike I" and "Fire Strike II").

### 3. Minimal Animations

Animations that have **no functional content**:
- No sound effects (`soundTimings` is empty)
- No screen flashes (`flashTimings` is empty)
- No visual effect (`effectName` is empty)

**Example:**
```
• ID 12: "Placeholder" - No sound, flash, or effect
```

**Why it matters:** These are essentially blank entries that serve no purpose and can be safely deleted.

## How It Works

### Analysis Process

1. **Load JSON**: Reads your `Animations.json` file
2. **Skip Separators**: Ignores category separator entries (names starting with `--`)
3. **Group by Effect**: Groups animations using the same `effectName`
4. **Group by Name**: Groups animations with identical display names
5. **Identify Minimal**: Finds animations lacking all content
6. **Generate Report**: Creates detailed findings and recommendations

### Detection Logic

```python
# Duplicate Effects
for each effectName:
    if used by multiple animations:
        → Flag as potential duplicate

# Duplicate Names  
for each animation name:
    if used by multiple IDs:
        → Flag as variant

# Minimal Animations
for each animation:
    if no sounds AND no flashes AND no effect:
        → Flag as removable
```

## Cleanup Workflow

### Recommended Process

1. **Run the Analyzer**
   ```bash
   python animation_analyzer.py > analysis_report.txt
   ```

2. **Backup Your Database**
   ```bash
   cp Animations.json Animations_backup.json
   ```

3. **Review Duplicates Manually**
   - Open RPG Maker MZ Database → Animations
   - Check each flagged duplicate
   - Decide which variant to keep (best name, best configured)

4. **Remove Minimal Animations**
   - These are safe to delete immediately
   - No skills/items should reference them

5. **Update References**
   - Search your project for skills/items using removed animation IDs
   - Redirect them to the kept variant
   - Use **Find and Replace** in the Database

6. **Test Your Game**
   - Playtest battles to ensure animations work
   - Check all skills and items

### Safe Removal Guidelines

✅ **Safe to Remove:**
- Minimal animations (no content)
- Duplicate effects when one is clearly better
- Test/placeholder animations
- Unused animations (check with grep/search)

⚠️ **Review Carefully:**
- Duplicates used in different contexts
- Variations with subtle differences
- Animations referenced in eventing

❌ **Don't Remove:**
- Category separators (names starting with `--`)
- Animations actively used by skills/items
- Unique effect combinations

## Advanced Usage

### Generating a Cleanup Script

You can extend the analyzer to auto-generate removal suggestions:

```python
# Add to the script
def generate_removal_list(results):
    """Generate list of IDs to remove."""
    to_remove = []
    
    # Add all minimal animations
    for anim in results['minimal']:
        to_remove.append(anim['id'])
    
    # Add duplicate effects (keep first, remove rest)
    for effect, anims in results['duplicate_effects'].items():
        for anim in anims[1:]:  # Skip first
            to_remove.append(anim['id'])
    
    print(f"\n🗑️ Suggested removals: {to_remove}")
    return to_remove
```

### Integration with Other Tools

Combine with the reorganizer script:

```python
# 1. Run analyzer
results = analyze_duplicates("Animations.json")

# 2. Remove suggested animations
# (implement removal logic)

# 3. Run reorganizer to clean up IDs
reorganize_animations("Animations_cleaned.json", "Animations_final.json")
```

## Output Files

The script outputs to **console only** by default. To save reports:

```bash
# Save full report
python animation_analyzer.py > analysis_report.txt

# Save only recommendations
python animation_analyzer.py 2>&1 | grep -A 20 "RECOMMENDATIONS" > cleanup_plan.txt
```

## Statistics Explained

### Total Animations Analyzed
The count of **non-null, non-separator** animations in your database.

### Effects with Multiple Uses
Number of **unique `effectName` values** used by 2+ animations. High numbers suggest redundancy.

### Names Used Multiple Times
Number of **display names** shared by multiple animations. May indicate variants or poor naming.

### Minimal Animations to Remove
Count of **completely empty** animations. These are always safe to remove.

## Troubleshooting

### Error: File Not Found
```python
# Make sure path uses raw string (r prefix) for Windows
file_path = r"C:\Users\YourName\Documents\RMMZ\Project\data\Animations.json"
```

### Error: JSON Decode Error
- File may be corrupted
- Check for trailing commas in JSON
- Validate with a JSON linter

### No Duplicates Found
- Your database is already clean!
- Or categorization has already separated duplicates

### Script Runs But Shows Nothing
- Check if console output is hidden
- Redirect to file: `python script.py > output.txt`

## Best Practices

### Before Cleanup
1. ✅ **Always backup** `Animations.json`
2. ✅ **Run analyzer** on backup first
3. ✅ **Review all findings** manually
4. ✅ **Document removals** in changelog

### During Cleanup
1. ✅ Remove in **small batches** (10-20 at a time)
2. ✅ Test after each batch
3. ✅ Keep a **removal log** with IDs and reasons
4. ✅ Search for references before deleting

### After Cleanup
1. ✅ Playtest thoroughly
2. ✅ Check battle animations
3. ✅ Verify skill/item effects
4. ✅ Run reorganizer to renumber IDs

## Performance Impact

- **Execution Time**: < 1 second for 500+ animations
- **Memory Usage**: < 50 MB typical
- **File Size Impact**: Each removed animation saves ~0.4 KB

## Use Cases

### DLC Integration
After adding DLC animation packs, check for:
- Duplicates between base and DLC
- Similar effects with different names
- Redundant variations

### Project Optimization
Before release, clean up:
- Test animations from development
- Unused placeholder effects
- Duplicates from team collaboration

### Database Migration
When merging projects:
- Identify conflicting IDs
- Find duplicate content
- Consolidate similar effects

## Contributing

Contributions welcome! You can:
- Report issues with specific animation sets
- Suggest new detection patterns
- Improve categorization logic
- Add automated cleanup features

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
  - Duplicate effect detection
  - Name variant detection
  - Minimal animation identification
  - Statistical analysis and recommendations

## Related Tools

- **Animation Reorganizer**: Categorizes and sorts animations by type
- **Animation Flash Adder**: Adds screen flash effects to animations
- **RPG Maker MZ Database Tools**: Official database management utilities

---

**Note**: This is a diagnostic tool only. It does **not** modify your files. All cleanup must be done manually in RPG Maker MZ or via custom scripts.

Made with ❤️ for the RPG Maker community
