# DebugStatsExporter Plugin Documentation

## Overview

**Plugin Name:** DebugStatsExporter  
**Version:** 1.0.0  
**Target:** RPG Maker MZ  
**Author:** Alexandros Panagiotakopoulos 


![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)
![Warning](https://img.shields.io/badge/⚠️-DEBUG_ONLY-red)

## Description

DebugStatsExporter is a powerful development tool designed to help RPG Maker MZ developers analyze and balance their game's character progression. This plugin exports comprehensive actor data including stats, growth curves, skills, and traits into an easy-to-read text file format.

Perfect for:
- Game balance analysis
- Character progression planning
- Team collaboration and documentation
- Creating reference guides for testers
- Identifying stat curve imbalances

---

## Features

### Comprehensive Data Export
- **Complete stat tables** for all actors from level 1 to max level
- **HP/MP gain analysis** showing growth per level
- **Skill progression** with costs and descriptions
- **Trait and feature documentation**
- **Equipment slot configuration**
- **Profile and note fields**

### Easy to Use
- Single plugin command activation
- Console command support for quick access
- Automatic file download to desktop
- Clean, formatted text output
- No configuration required

### Developer-Friendly Output
- Organized by actor with clear section headers
- Table format for easy spreadsheet import
- Level-by-level breakdowns for trend analysis
- Skill learning requirements clearly listed
- All data in plain text for maximum compatibility

---

## Installation

1. **Download** the `DebugStatsExporter.js` file
2. **Copy** it to your project's `js/plugins/` folder
3. **Open** RPG Maker MZ and go to your project
4. **Enable** the plugin in the Plugin Manager (Tools → Plugin Manager)
5. **Save** your project

**Important:** This plugin requires no parameters or configuration. Simply enable it and it's ready to use!

---

## Usage

### Method 1: Plugin Command (Recommended for Events)

1. Create an event or use an existing one
2. Add a **Plugin Command**
3. Select **DebugStatsExporter**
4. Choose **Export Actor Stats**
5. Run the event in-game

This is ideal for creating a debug room or adding to your main menu for easy access during testing.

### Method 2: Console Command (Quickest for Development)

1. Launch your game in **Test Play** mode
2. Press **F8** to open the developer console
3. Type the following command:
   ```javascript
   SceneManager._scene.exportActorStats()
   ```
4. Press **Enter**

The export will begin immediately and download to your default downloads folder.

### Method 3: Script Call in Events

Add this as a **Script** command in any event:
```javascript
SceneManager._scene.exportActorStats();
```

---

## Output Format

The plugin generates a `.txt` file named `ActorStats_Export.txt` with the following structure:

### Header
```
================================================================================
RPG MAKER MZ - ACTOR STATS EXPORT
Generated: [Date and Time]
================================================================================
```

### For Each Actor

#### 1. Basic Information
- Actor ID and Name
- Nickname
- Class
- Initial and Maximum Level

#### 2. Initial Stats
Complete listing of starting statistics:
- Max HP / Max MP
- ATK / DEF
- MAT / MDF
- AGI / LUK

#### 3. Stat Growth by Level
Full table showing all stats from level 1 to max level:
```
Level | HP    | MP    | ATK | DEF | MAT | MDF | AGI | LUK
----------------------------------------------------------------------
    1 |   500 |   100 |  15 |  12 |  10 |   8 |  14 |  10
    2 |   520 |   105 |  16 |  13 |  11 |   9 |  15 |  11
    ...
```

#### 4. HP/MP Gains Per Level
Shows exactly how much HP and MP increases at each level:
```
Level | HP Gain | MP Gain
------------------------------
    2 |      20 |       5
    3 |      22 |       5
    ...
```

#### 5. Learned Skills
- **Initial Skills** - Skills available at start
- **Skills by Level** - Complete progression including:
  - Level requirement
  - Skill name and ID
  - Skill type
  - MP and TP costs
  - Description

#### 6. Traits
All character traits with detailed information:
- Parameter modifiers (HP, MP, ATK, etc.)
- Ex-Parameters (Hit rate, Evasion, Critical, etc.)
- Sp-Parameters (Target rate, Guard, Recovery, etc.)
- Special abilities and flags

#### 7. Equipment Slots
Lists all available equipment slot types for the actor

#### 8. Profile & Notes
Displays profile text and any custom notes from the database

---

## Use Cases & Examples

### Use Case 1: Balance Analysis
**Problem:** You're unsure if your HP growth is too high or too low.

**Solution:**
1. Export actor stats
2. Open the text file
3. Look at the "HP/MP GAINS PER LEVEL" table
4. Compare values across different levels
5. Identify if gains are consistent or if there are unexpected spikes/drops

**Example Finding:** "Actor 1 gains 50 HP at level 10 but only 15 HP at level 11 - this inconsistency should be smoothed out."

### Use Case 2: Skill Progression Review
**Problem:** You want to ensure skill learning is properly paced.

**Solution:**
1. Export actor stats
2. Review the "LEARNED SKILLS" section
3. Check if powerful skills are learned too early
4. Verify skill costs are appropriate for each level

**Example Finding:** "Actor 2 learns a 50 MP cost spell at level 5, but only has 80 MP total - might be too expensive."

### Use Case 3: Team Documentation
**Problem:** Multiple team members need to reference character stats.

**Solution:**
1. Export stats regularly during development
2. Share the text file with team members
3. Designers can reference exact values
4. Writers can use stats for dialogue consistency

### Use Case 4: Spreadsheet Analysis
**Problem:** You want to create graphs of stat growth.

**Solution:**
1. Export actor stats
2. Copy the stat growth table
3. Paste into Excel/Google Sheets
4. Create charts to visualize growth curves
5. Compare multiple actors side-by-side

---

## Tips & Best Practices

### For Game Developers

1. **Export Regularly** - Make it a habit to export stats after major balance changes
2. **Version Control** - Keep dated exports to track balance changes over time
3. **Compare Actors** - Look at multiple actors side-by-side to ensure variety and balance
4. **Check Growth Curves** - Ensure stat growth feels smooth and doesn't have weird jumps
5. **Review MP Costs** - Cross-reference skill costs with MP growth to ensure usability

### For Game Designers

1. **Document Changes** - Add notes to the export file explaining why certain values were chosen
2. **Share with Team** - Use exports in design meetings to discuss balance
3. **Create References** - Use exports as the basis for design documentation
4. **Test Boundaries** - Look for edge cases (level 1 stats vs level 99 stats)

### For QA/Testers

1. **Reference Guide** - Use exports to quickly look up exact stat values
2. **Bug Reporting** - Include export data when reporting balance issues
3. **Progression Tracking** - Verify in-game values match the database

---

## Troubleshooting

### Issue: Plugin command doesn't appear
**Solution:** Make sure the plugin is enabled in the Plugin Manager and your project is saved.

### Issue: File doesn't download
**Solution:** 
- Check browser permissions if running as a web build
- Ensure you have write permissions to your downloads folder
- Try using the console command method instead

### Issue: Some actors are missing
**Solution:** The plugin only exports actors that exist in the database. Empty actor slots are automatically skipped.

### Issue: Stats look incorrect
**Solution:** The plugin reads directly from `$dataActors` - verify your database values are correct in the RPG Maker MZ editor.

### Issue: File opens with wrong encoding
**Solution:** The file uses UTF-8 encoding. Open with a text editor that supports UTF-8 (Notepad++, VS Code, etc.)

---

## Technical Details

### Plugin Commands
- **exportStats** - Triggers the export process

### Console Methods
- `SceneManager._scene.exportActorStats()` - Main export function

### Data Sources
The plugin reads from the following RPG Maker MZ data objects:
- `$dataActors` - Actor database
- `$dataClasses` - Class database  
- `$dataSkills` - Skills database
- `$dataSystem` - System settings (equipment types, skill types)

### File Output
- **Format:** Plain text (.txt)
- **Encoding:** UTF-8
- **Filename:** ActorStats_Export.txt
- **Location:** Browser's default download folder

---

## Compatibility

### RPG Maker Version
- ✅ RPG Maker MZ (All versions)
- ❌ RPG Maker MV (Not compatible)

### Plugin Compatibility
This plugin should be compatible with most other plugins as it:
- Only reads data (doesn't modify game state)
- Uses standard RPG Maker MZ APIs
- Doesn't override core functions permanently
- No parameter conflicts

**Recommended Plugin Order:** Place near the bottom of your plugin list to ensure it reads the most up-to-date data from other plugins.

---

## FAQ

**Q: Can I export during a playtest?**  
A: Yes! Use F8 and the console command for instant exports during testing.

**Q: Does this work with custom stat plugins?**  
A: It exports standard RPG Maker MZ stats. Custom stats from other plugins may not appear unless they modify the base actor parameters.

**Q: Can I customize the output format?**  
A: Yes! The plugin code is commented and organized. Developers can modify the `formatActorData()` function to change the output.

**Q: Is there a file size limit?**  
A: No practical limit. Even projects with 50+ actors and 99 levels export quickly.

**Q: Can I export just one actor?**  
A: Currently exports all actors. You can manually filter the text file or modify the code to add actor selection.

**Q: Does it export enemy stats?**  
A: No, this plugin focuses on actors only. An enemy version could be created using similar methods.

---

## Changelog

### Version 1.0.0 (Initial Release)
- Full actor stat export
- Level-by-level growth tables
- HP/MP gain analysis
- Skill progression documentation
- Trait and equipment data
- Console and plugin command support

---


## Credits

Created by: Alexandros Panagiotakopoulos
Special thanks to the RPG Maker community for inspiration and support.

---

## 📝 License & Credits

### License
This project is licensed under the **Creative Commons Attribution 4.0 International License**.

**You are free to:**
- ✅ Share — copy and redistribute in any medium or format
- ✅ Adapt — remix, transform, and build upon the material  
- ✅ Commercial Use — use for commercial projects (DEBUG ONLY)

**Under the following terms:**
- 📝 **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.

### Credits
- **Author**: Alexandros Panagiotakopoulos
- **Framework**: RPG Maker MZ Plugin System
- **Technologies**: JavaScript ES6+, RPG Maker MZ Core Scripts
- **Purpose**: Advanced debugging and event diagnostics
