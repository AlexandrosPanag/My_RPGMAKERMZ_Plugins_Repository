# Plugin Content Validator for RPG Maker MZ

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-red.svg)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-green.svg)

A comprehensive validation tool that detects orphaned plugin commands, unrecognized notetags, and potential issues in your RPG Maker MZ project. Perfect for maintaining clean, bug-free projects and catching errors before they cause runtime problems.

## ✨ Features

- 🔍 **Plugin Command Detection** - Finds calls to disabled or removed plugins
- 🏷️ **Notetag Validation** - Identifies unrecognized notetags in database entries
- ⚠️ **Syntax Checking** - Detects malformed notetags and unclosed brackets
- 📜 **Script Analysis** - Scans for potentially problematic script calls
- 🎯 **Smart Suggestions** - Offers similar command names for typos
- 📊 **Detailed Reports** - Beautiful, formatted validation reports
- 💾 **Export Function** - Save reports as readable .txt files
- 🚀 **Performance Optimized** - Efficient scanning with minimal overhead

## 📦 Installation

1. Download `PluginContentValidator.js`
2. Place it in your project's `js/plugins/` folder
3. Open RPG Maker MZ Plugin Manager
4. Add "PluginContentValidator" to your plugin list
5. Enable the plugin
6. Save your project

## 🎮 Usage

### Console Commands

Open the developer console (F8 during test play) and use these commands:

```javascript
// Run full validation scan
PluginValidator.runValidation()

// Export the last report to a text file
PluginValidator.exportReport()
```

### Plugin Commands

You can also run validation using plugin commands in events:

- **Run Full Validation** - Scans the entire project for issues
- **Export Report** - Exports the validation report to a .txt file

### Reading the Report

The validation report includes several sections:

#### 1. Summary
Quick overview of total issues found in each category.

#### 2. Active Plugins
Lists all currently enabled plugins in your project.

#### 3. Registered Plugin Commands
Shows all available plugin commands that can be called.

#### 4. Orphaned Plugin Commands
**🚨 CRITICAL** - Plugin commands in events that don't match any registered command:
```
Location: Map: Town (ID: 4)
Event ID: 5
Command: RE;LIVE/MiniMapOverlay addMarker
Suggestion: Did you mean: MiniMapOverlay:setQuestMarker?
```

**Action Required**: Fix these by:
- Correcting the command name
- Re-enabling the required plugin
- Removing the unused command

#### 5. Unrecognized Notetags
**ℹ️ INFORMATIONAL** - Notetags that don't match common patterns:
```
Location: Skills - Fireball (ID: 6)
Tag Name: cooldown
Suggestion: Check plugin documentation for valid notetags
```

**Note**: These are often intentional custom notetags used by your plugins. Only investigate if you suspect a typo.

#### 6. Malformed Notetags
**⚠️ WARNING** - Syntax errors in notetags:
```
Location: Skills - Ice Blast (ID: 15)
Issue: Mismatched brackets: 3 opening, 2 closing
```

**Action Required**: Fix syntax errors immediately as they may cause runtime issues.

#### 7. Potential Script Call Issues
**⚠️ WARNING** - Script calls that reference possibly non-existent plugins:
```
Location: Map: Battle Arena (ID: 8)
Issue: Reference to possibly non-existent plugin: CustomBattle
```

**Action Required**: Verify these scripts are correct or update them.

## 🔧 What It Detects

### Orphaned Plugin Commands ❌

Finds plugin commands that won't work because:
- The plugin was disabled or removed
- The command name is misspelled
- The plugin name format is incorrect

**Example Issues:**
```
✅ Correct: StreetLampLighting:addStreetLamp
❌ Wrong:   StreetLampLighting addMarker (command doesn't exist)
❌ Wrong:   SteetLampLighting:addStreetLamp (typo in plugin name)
```

### Unrecognized Notetags ℹ️

Identifies notetags that might be:
- Typos in existing notetag names
- References to disabled plugins
- Custom tags (which is fine!)

**Common Patterns Detected:**
```
<cooldown:5>        → Custom cooldown system
<hpCost:20>         → HP cost mechanic
<pierce>            → Armor penetration
<element:Fire>      → Elemental system
<classStyle:Mage>   → Descriptive tag
```

### Malformed Notetags ⚠️

Catches syntax errors like:
- Unclosed angle brackets: `<cooldown:5`
- Nested brackets: `<<cooldown:5>>`
- Mismatched pairs: `<tag> <tag> </tag>`
- Invalid characters in tags

### Script Call Issues ⚠️

Detects potential problems in script calls:
- References to non-existent plugins
- Calls to possibly removed plugin functions
- Suspicious namespace patterns

## 📊 Report Format

Reports are exported as beautifully formatted .txt files:

```
================================================================================
RPG MAKER MZ - PLUGIN CONTENT VALIDATION REPORT
Generated: 11/15/2025, 6:57:00 PM
================================================================================

SUMMARY
--------------------------------------------------------------------------------
Total Issues Found: 1
  - Orphaned Plugin Commands: 1
  - Unrecognized Notetags: 0
  - Malformed Notetags: 0
  - Script Call Issues: 0

[... detailed sections follow ...]
```

Files are named: `Plugin_Validation_Report_YYYY-MM-DD.txt`

## 🎯 Use Cases

### Pre-Release Testing
Run validation before publishing to catch issues players might encounter.

### Plugin Management
Verify that disabling a plugin won't break existing content.

### Collaboration
Team members can validate project integrity after pulling changes.

### Refactoring
Safely rename or remove plugins by finding all references first.

### Debugging
Quickly identify why certain features aren't working as expected.

### Documentation
Generate reports showing which plugins and commands are actually used.

## 🔧 Technical Details

### Validation Process

1. **Phase 1: Plugin Registry**
   - Scans all active plugins
   - Builds a map of registered commands
   - Extracts command metadata

2. **Phase 2: Map Scanning**
   - Iterates through all map events
   - Checks each plugin command call
   - Validates command names and formats

3. **Phase 3: Database Scanning**
   - Scans all database entries (Actors, Classes, Skills, Items, etc.)
   - Extracts and validates notetags
   - Checks for syntax errors

4. **Phase 4: Report Generation**
   - Aggregates all findings
   - Generates suggestions
   - Formats output with color coding

### Performance

- **Efficient Scanning**: Processes maps and database in single pass
- **Smart Caching**: Stores plugin registry for quick lookups
- **Minimal Overhead**: No runtime impact during normal gameplay
- **On-Demand**: Only runs when explicitly called

### Command Name Matching

The validator handles multiple plugin command formats:
```javascript
// All these formats are recognized:
"PluginName:commandName"
"PluginName.commandName"
"PluginName/commandName"
"Path/To/PluginName:commandName"
"RE;LIVE/PluginName:commandName"
```

### Typo Detection

Uses Levenshtein distance algorithm to suggest corrections:
```
Command: "setQestMarker"
Suggestion: Did you mean: setQuestMarker?

Similarity Score: 92%
```

## 🐛 Troubleshooting

### "No active plugins detected"
- Run validation during gameplay or after title screen loads
- Ensure `$plugins` is initialized before running
- Check that plugins are actually enabled in Plugin Manager

### "No plugin commands registered"
- Some plugins don't register commands via standard methods
- Manual plugin commands won't appear in the registry
- This is normal for plugins without @command declarations

### Many "unrecognized notetags" warnings
- These are usually intentional custom notetags
- Only investigate if you suspect actual typos
- Consider creating a whitelist of known custom tags

### Report export not working
- Ensure browser allows file downloads
- Check browser's download settings
- Try running from test play mode, not deployed game

## 💡 Best Practices

### Regular Validation
Run validation periodically during development:
- After adding/removing plugins
- Before major releases
- After database changes
- When debugging mysterious issues

### Ignore Intentional Tags
Don't worry about "unrecognized notetags" that are:
- Part of your custom plugin systems
- Descriptive tags for organization
- Working correctly in-game

### Fix Critical Issues First
Priority order:
1. ⚠️ Malformed notetags (syntax errors)
2. ❌ Orphaned plugin commands (won't work)
3. ⚠️ Script call issues (potential problems)
4. ℹ️ Unrecognized notetags (informational only)

### Document Your Notetags
Keep a list of intentional custom notetags:
```
Project Notetags:
- <cooldown:X> - Skill cooldown system
- <hpCost:X> - HP cost for skills
- <element:Type> - Custom elemental typing
- <classStyle:Name> - Descriptive class tags
```

## 🔄 Workflow Integration

### Development Workflow
```
1. Make changes to plugins/events/database
2. Run: PluginValidator.runValidation()
3. Fix any critical issues found
4. Export report for documentation
5. Commit changes with validation report
```

### Pre-Release Checklist
```
☐ Run full validation
☐ Fix all orphaned plugin commands
☐ Fix all malformed notetags
☐ Review script call issues
☐ Export final validation report
☐ Verify no critical issues remain
```

## 📝 Limitations

- **Current Map Only**: By default, only scans the currently loaded map
  - Full project scanning requires all maps to be loaded
  - This is a RPG Maker MZ limitation, not a plugin issue

- **Notetag Recognition**: Cannot know which notetags are "valid"
  - Would require plugins to register their notetags
  - Many "unrecognized" tags are actually working correctly

- **Runtime Detection**: Cannot detect issues that only appear at runtime
  - Conditional script calls
  - Dynamic plugin loading
  - Variable-based commands

## 🚀 Future Enhancements

Potential features for future versions:
- Configurable notetag whitelist
- Full project scanning (all maps)
- Integration with plugin metadata files
- Auto-fix suggestions
- GUI interface for non-technical users
- Batch validation for multiple projects
- Custom validation rules

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
* **Technologies**: JavaScript ES6+, String Similarity Algorithms, Pattern Matching
* **Inspiration**: Professional code linters and validation tools

## 🤝 Contributing

Found a bug or have a suggestion? Feel free to:
- Open an issue on GitHub
- Submit a pull request
- Share your validation reports

---

**Made with ❤️ for the RPG Maker community**

*Keep your projects clean, your plugins organized, and your notetags validated!* ✨
