# RPG Maker MZ Random Loot Plugin

A lightweight, plug-and-play loot randomization system for RPG Maker MZ that brings dynamic treasure and weapon drops to your game using simple note tags.

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-red.svg)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-green.svg)

## 👤 Author

**Alexandros Panagiotakopoulos**

## Overview

Transform static treasure chests and event rewards into exciting randomized loot! This plugin allows you to define min-max ranges for gold and weapon drops, creating a more replayable and engaging dungeon-crawling experience.

## Features

- 🎲 **True Random Generation**: Uses cryptographically secure `crypto.getRandomValues()` for genuinely unpredictable results
- 💰 **Random Gold Drops**: Set min-max ranges for currency rewards
- ⚔️ **Random Weapon Drops**: Randomize which weapon the player receives
- 🎯 **Simple Note Tags**: Easy-to-use event configuration
- 🎨 **Automatic Messages**: Displays colored messages with icons when loot is obtained
- 🔄 **Combine Both**: Use gold AND weapon drops on the same event
- ⚡ **Lightweight**: Minimal performance impact, zero dependencies

## Installation

1. **Download** the plugin file: `RandomLootPlugin.js`
2. **Copy** to your project's plugin folder:
   ```
   YourProject/js/plugins/RandomLootPlugin.js
   ```
3. **Enable** in RPG Maker MZ:
   - Open Plugin Manager (F10 or Tools → Plugin Manager)
   - Add `RandomLootPlugin` to your plugin list
   - Make sure it's enabled (checkbox ON)
4. **Done!** No additional configuration needed

## Quick Start

### Example 1: Simple Treasure Chest

1. Create a treasure chest event
2. In the event's **Note** field, add:
   ```
   <randomtreasurecoin:10-100>
   ```
3. Run the event
4. Player receives random gold between 10-100!

### Example 2: Weapon Drop

1. Create an event (enemy drop, reward chest, etc.)
2. In the event's **Note** field, add:
   ```
   <randomweapondrop:1-5>
   ```
3. Run the event
4. Player receives a random weapon with ID 1-5!

### Example 3: Combined Loot

1. Create an event
2. In the event's **Note** field, add:
   ```
   <randomtreasurecoin:50-200>
   <randomweapondrop:10-20>
   ```
3. Run the event
4. Player gets random gold AND a random weapon!

## Note Tags Reference

### Random Gold/Currency

```
<randomtreasurecoin:MIN-MAX>
```

Gives the player a random amount of gold between MIN and MAX (inclusive).

**Examples:**
```
<randomtreasurecoin:10-50>     → Grants 10 to 50 gold
<randomtreasurecoin:1-100>     → Grants 1 to 100 gold
<randomtreasurecoin:500-1000>  → Grants 500 to 1000 gold
```

### Random Weapon Drop

```
<randomweapondrop:MIN-MAX>
```

Gives the player a random weapon with database ID between MIN and MAX (inclusive).

**Examples:**
```
<randomweapondrop:1-5>    → Random weapon from IDs 1-5
<randomweapondrop:10-15>  → Random weapon from IDs 10-15
<randomweapondrop:1-50>   → Any weapon from IDs 1-50
```

**Important:** Make sure the weapon IDs in your range actually exist in your database!

## Usage Guide

### Setting Up Treasure Chests

**Recommended Event Structure:**

```
◆ Text: The chest is locked...
◆ Conditional Branch: Player has Key Item "Chest Key"
  ◆ Play SE: Chest1
  ◆ Text: You opened the chest!
  ◆ (Plugin automatically gives loot from note tags)
  ◆ Control Self Switch: A = ON
◆ Branch End

◆ Page 2 (Self Switch A = ON)
  ◆ Text: The chest is empty.
```

**Event Note Field:**
```
<randomtreasurecoin:25-75>
<randomweapondrop:1-10>
```

**Result:**
- Player opens chest
- Gets 25-75 random gold
- Gets 1 random weapon from IDs 1-10
- Chest becomes empty (won't give loot again)

### Boss Enemy Drops

**Setup:**
1. After boss battle, create an autorun/parallel event
2. Add condition: Boss defeated
3. Add note tags for boss-tier loot

**Event Note Field:**
```
<randomtreasurecoin:500-1000>
<randomweapondrop:45-50>
```

**Result:**
- Player defeats boss
- Event automatically runs
- Player receives 500-1000 gold
- Player receives rare weapon (IDs 45-50)

### Quest Rewards

**Different reward tiers based on quest difficulty:**

**Easy Quest Event Note:**
```
<randomtreasurecoin:50-100>
<randomweapondrop:1-10>
```

**Hard Quest Event Note:**
```
<randomtreasurecoin:500-1000>
<randomweapondrop:40-50>
```

Use conditional branches to call the appropriate reward event.

### Gambling/Lottery System

**Slot Machine Event Note:**
```
<randomtreasurecoin:1-1000>
```

**Result:**
- Could win 1 gold (unlucky!)
- Could win 1000 gold (jackpot!)
- Creates exciting risk/reward gameplay

## Visual Messages

The plugin automatically displays styled messages when loot is obtained:

### Gold Message
```
Found 47 Gold!
```
- Text appears in **gold/yellow color** (Color Code 14)
- Shows exact amount received

### Weapon Message
```
Found [Weapon Icon] Legendary Sword!
```
- Shows the weapon's **icon** from database
- Text appears in **green color** (Color Code 2)
- Displays weapon's name from database

## How It Works

### True Randomization Explained

This plugin uses **cryptographically secure random number generation**:

```javascript
crypto.getRandomValues(randomBuffer);
```

**Why This Matters:**
- ✅ **Unpredictable**: Unlike `Math.random()`, patterns cannot be predicted
- ✅ **Non-Repeatable**: Same seed won't produce same results
- ✅ **High Quality**: Same randomness quality as encryption systems
- ✅ **Perfect for Loot**: Ensures fair and exciting drops

**Comparison:**
```
Math.random()              → Predictable patterns, can be exploited
crypto.getRandomValues()   → True randomness, casino-grade quality ✓
```

### Processing Flow

1. **Event Triggered**: Player interacts with event
2. **Note Read**: Plugin reads event's note field
3. **Pattern Match**: Searches for `<randomtreasurecoin:X-Y>` and `<randomweapondrop:X-Y>`
4. **Generate Random**: Creates truly random number in specified range
5. **Give Loot**: Adds gold/weapon to player inventory
6. **Display Message**: Shows colored message automatically

### Range Handling

- **Equal Values**: `<randomtreasurecoin:50-50>` always gives exactly 50
- **Reversed Range**: `<randomtreasurecoin:100-10>` auto-corrects to 10-100
- **Integers Only**: Decimals are rounded down (50.9 becomes 50)

## Advanced Techniques

### Organizing Weapon Tiers

Structure your database for easy tier randomization:

```
Database → Weapons:
IDs 1-10:   Common (Iron Sword, Wooden Staff, Dagger)
IDs 11-20:  Uncommon (Steel Sword, Magic Wand, Silver Dagger)
IDs 21-30:  Rare (Mithril Blade, Crystal Staff, Assassin Blade)
IDs 31-40:  Epic (Flame Sword, Arcane Staff, Poison Dagger)
IDs 41-50:  Legendary (Excalibur, Staff of Ages, Godslayer)
```

**Then use tier-appropriate ranges:**
```
Common Chest:     <randomweapondrop:1-10>
Rare Chest:       <randomweapondrop:21-30>
Boss Drop:        <randomweapondrop:41-50>
```

### Difficulty-Scaled Loot

**Easy Mode Event:**
```
<randomtreasurecoin:100-200>
<randomweapondrop:1-15>
```

**Normal Mode Event:**
```
<randomtreasurecoin:50-100>
<randomweapondrop:1-30>
```

**Hard Mode Event:**
```
<randomtreasurecoin:10-50>
<randomweapondrop:20-50>
```

Use conditional branches based on difficulty variable.

### Progressive Dungeon Floors

```
Floor 1:  <randomtreasurecoin:5-15>   <randomweapondrop:1-5>
Floor 5:  <randomtreasurecoin:25-50>  <randomweapondrop:10-15>
Floor 10: <randomtreasurecoin:100-200> <randomweapondrop:30-40>
Floor 20: <randomtreasurecoin:500-1000> <randomweapondrop:45-50>
```

### Multiple Weapon Drops

To drop multiple random weapons, use a loop:

```
◆ Control Variables: #001 = 3  (Number of weapons to drop)
◆ Loop
  ◆ Common Event: Weapon Drop Event  (has <randomweapondrop:1-20>)
  ◆ Control Variables: #001 -= 1
  ◆ Conditional Branch: Variable [001] = 0
    ◆ Break Loop
  ◆ Branch End
◆ Loop End
```

## Compatibility

### ✅ Compatible With

- RPG Maker MZ (all versions)
- Default battle system
- ATB battle systems
- CTB battle systems
- Custom message plugins (most)
- Gold/economy plugins
- Inventory management plugins
- Custom currency plugins (uses TextManager.currencyUnit)

### ⚠️ Potential Conflicts

- Plugins that heavily modify `Game_Interpreter.prototype.setup`
- Custom event note parsing systems
- **Solution**: Place this plugin BELOW conflicting plugins in the load order

## Troubleshooting

### Problem: No loot is generated

**Solutions:**
1. ✅ Check note tag syntax is exact: `<randomtreasurecoin:10-50>`
2. ✅ Verify plugin is enabled in Plugin Manager
3. ✅ Confirm event is actually running (add "Show Text" to test)
4. ✅ Open browser console (F12) and check for errors
5. ✅ Make sure note tags are in the **Event's Note field**, not in a comment

### Problem: Same amount every time

**Solutions:**
1. This shouldn't happen with crypto randomization
2. Try refreshing playtest (Ctrl+F5)
3. Check for conflicting plugins that override randomization
4. Ensure you're not testing multiple times in same frame

### Problem: Weapon doesn't appear

**Solutions:**
1. ✅ Verify weapon IDs exist in Database → Weapons
2. ✅ Check ID range doesn't exceed your weapon count
   - Example: Don't use `<randomweapondrop:1-100>` if you only have 50 weapons
3. ✅ Ensure inventory isn't full (if using inventory limit plugin)
4. ✅ Check weapon type can be equipped by at least one character

### Problem: Messages don't show

**Solutions:**
1. ✅ Ensure message window isn't blocked by other events
2. ✅ Check if custom message plugin is interfering
3. ✅ Verify text codes work: Test `\C[14]` and `\I[1]` in a Show Text command
4. ✅ Try disabling other message-related plugins temporarily

### Problem: Error after updating RPG Maker MZ

**Solutions:**
1. Re-download latest version of plugin
2. Clear browser cache (Ctrl+F5 in playtest)
3. Check plugin compatibility notes
4. Disable and re-enable plugin

## Customization

### Changing Message Colors

Edit the plugin code (around lines 68 and 84):

```javascript
// Gold message - Change color code 14 to any color
$gameMessage.add(`Found \\C[14]${amount} ${goldName}\\C[0]!`);

// Weapon message - Change color code 2 to any color
$gameMessage.add(`Found \\I[${iconIndex}]\\C[2]${weaponName}\\C[0]!`);
```

**Color Reference:**
- 0 = Normal (white/black)
- 1 = Blue (HP)
- 2 = Green (items)
- 3 = Cyan (skills)
- 4 = Red (danger)
- 14 = Gold/Yellow
- 18 = Orange
- 29 = Purple

### Disabling Messages

To silently give loot without messages, comment out message lines:

```javascript
// $gameMessage.add(`Found \\C[14]${amount} ${goldName}\\C[0]!`);
```

### Adding Item Support

Extend the plugin to support random item drops:

```javascript
// Add this after the weapon code (around line 85)
const itemMatch = note.match(/<randomitemdrop:(\d+)-(\d+)>/i);
if (itemMatch) {
    const min = parseInt(itemMatch[1]);
    const max = parseInt(itemMatch[2]);
    const itemId = this.trueRandomInt(min, max);
    
    if ($dataItems[itemId]) {
        $gameParty.gainItem($dataItems[itemId], 1);
        const itemName = $dataItems[itemId].name;
        const iconIndex = $dataItems[itemId].iconIndex;
        $gameMessage.add(`Found \\I[${iconIndex}]\\C[3]${itemName}\\C[0]!`);
    }
}
```

Then use in events:
```
<randomitemdrop:1-20>
```

### Adding Armor Support

Similar to items, add armor support:

```javascript
const armorMatch = note.match(/<randomarmordrop:(\d+)-(\d+)>/i);
if (armorMatch) {
    const min = parseInt(armorMatch[1]);
    const max = parseInt(armorMatch[2]);
    const armorId = this.trueRandomInt(min, max);
    
    if ($dataArmors[armorId]) {
        $gameParty.gainItem($dataArmors[armorId], 1);
        const armorName = $dataArmors[armorId].name;
        const iconIndex = $dataArmors[armorId].iconIndex;
        $gameMessage.add(`Found \\I[${iconIndex}]\\C[2]${armorName}\\C[0]!`);
    }
}
```

Then use:
```
<randomarmordrop:1-30>
```

## Performance

- **Memory Usage**: < 5 KB
- **Processing Time**: < 1ms per event trigger
- **CPU Impact**: Negligible
- **Optimization**: Regex compiled once, minimal overhead

## Best Practices

### Database Organization

1. ✅ **Group by Tier**: Keep weapon tiers in sequential ID ranges
2. ✅ **Document Ranges**: Add comments in database noting tier ranges
3. ✅ **Test All IDs**: Verify every ID in your ranges exists
4. ✅ **Leave Gaps**: Reserve ID ranges for future additions

### Event Design

1. ✅ **Use Self Switches**: Prevent chests from giving infinite loot
2. ✅ **Add Sound Effects**: Play SE when loot is obtained
3. ✅ **Visual Feedback**: Change chest sprite (closed → open)
4. ✅ **Particle Effects**: Use animations for loot discovery
5. ✅ **Clear Timing**: Don't spam multiple loot events simultaneously

### Game Balance

1. ✅ **Scale with Progress**: Higher areas = better loot ranges
2. ✅ **Risk vs Reward**: Harder content = better drops
3. ✅ **Economy Balance**: Don't break your game's economy
4. ✅ **Test Thoroughly**: Playtest each loot range multiple times
5. ✅ **Player Expectations**: Match loot quality to effort required

## Real-World Examples

### Roguelike Dungeon

```
Floor 1-5 Chests:
<randomtreasurecoin:10-30>
<randomweapondrop:1-10>

Floor 6-10 Chests:
<randomtreasurecoin:50-100>
<randomweapondrop:11-20>

Floor 11-15 Chests:
<randomtreasurecoin:150-300>
<randomweapondrop:21-35>

Floor 16-20 Boss:
<randomtreasurecoin:500-1000>
<randomweapondrop:45-50>
```

### Side Quest Rewards

```
Tutorial Quest:
<randomtreasurecoin:20-50>

Story Quest:
<randomtreasurecoin:100-200>
<randomweapondrop:15-25>

Endgame Quest:
<randomtreasurecoin:1000-2000>
<randomweapondrop:45-50>
```

### Random Encounter Drops

```
Common Enemy (70% drop rate):
<randomtreasurecoin:5-15>

Rare Enemy (30% drop rate):
<randomtreasurecoin:50-100>
<randomweapondrop:10-20>

Boss Enemy (100% drop rate):
<randomtreasurecoin:300-500>
<randomweapondrop:35-45>
```

## FAQ

**Q: Can I use this for items and armor?**  
A: By default, only gold and weapons are supported. However, you can easily extend it (see Customization section).

**Q: Is the randomization truly random?**  
A: Yes! It uses `crypto.getRandomValues()`, the same cryptographic-grade randomness used in security systems.

**Q: Can I have multiple note tags of the same type?**  
A: Currently only the first match is processed. For multiple drops, call the event multiple times or use loops.

**Q: Does this work in battle?**  
A: It's designed for map events, but you can trigger events from Troop pages.

**Q: Can I disable the message display?**  
A: Yes, comment out the `$gameMessage.add()` lines in the plugin code.

**Q: Will this slow down my game?**  
A: No, the performance impact is negligible (< 1ms per event).

**Q: What happens if weapon ID doesn't exist?**  
A: The plugin validates the ID exists before giving it. Invalid IDs are skipped silently.

**Q: Can I use decimal numbers in ranges?**  
A: No, all values are converted to integers. Use whole numbers only.

## Version History

- **v1.0** (2026-02-07): Initial release
  - Random gold drops
  - Random weapon drops
  - Cryptographically secure randomization
  - Automatic colored messages
  - Full RPG Maker MZ support

## License

This project is licensed under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**.

You are free to:
- ✅ **Share**: Copy and redistribute in any medium or format
- ✅ **Adapt**: Remix, transform, and build upon the material
- ✅ **Commercial Use**: Use in commercial projects
- ✅ **Modify**: Change and extend the plugin

Under the following terms:
- **Attribution**: You must give appropriate credit to Alexandros Panagiotakopoulos
- **Indicate Changes**: If you modify the plugin, you must indicate what was changed
- **No Additional Restrictions**: You may not apply legal terms that restrict others from doing anything the license permits

See [LICENSE](https://creativecommons.org/licenses/by/4.0/) for full legal details.

## Credits

**Author**: Alexandros Panagiotakopoulos  
**Website**: [alexandrospanag.github.io](https://alexandrospanag.github.io)  
**Date**: February 8, 2026  
**Version**: 1.0

---

**Made with ❤️ for the RPG Maker community**

*Transform your static loot into exciting, randomized rewards!*
