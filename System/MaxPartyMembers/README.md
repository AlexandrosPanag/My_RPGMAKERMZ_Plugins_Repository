# MaxPartyMembers Plugin Documentation

**Copyright © Alexandros Panagiotakopoulos. All Rights Reserved.**


![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)



## 👤 Author

**Alexandros Panagiotakopoulos**

---
## Overview

**MaxPartyMembers** is an RPG Maker MZ plugin that enforces a strict maximum on active party members in both battle and on the map. This plugin uses a "nuclear option" approach, forcefully overriding core party functions to ensure your party size limit is respected regardless of what other plugins do.

---

## Features

✅ **Strict Party Size Enforcement** - Limits active party members in battle and map followers  
✅ **Reserve Member System** - Automatically moves excess members to reserves  
✅ **Full Compatibility** - Overrides core functions to work with other menu plugins  
✅ **Debug Tools** - Built-in console commands for troubleshooting  
✅ **Auto-Cleanup** - Automatically manages party size when members are added  

---

## Installation

1. Copy `MaxPartyMembers.js` to your `js/plugins/` folder
2. Open the RPG Maker MZ Plugin Manager
3. Add the plugin to your plugin list
4. **⚠️ IMPORTANT: Place this plugin LAST in your plugin list!**
5. Configure the parameters (see below)
6. Save your project

---

## Plugin Parameters

### Maximum Active Party Members
- **Type:** Number (1-8)
- **Default:** 4
- **Description:** The maximum number of party members that can be active in battle and visible as followers on the map.

### Enable Debug Console
- **Type:** Boolean
- **Default:** true
- **Description:** Enables debug logging and console commands for troubleshooting.

---

## How It Works

### Active vs Reserve Members

- **Active Members**: The first X members of your party (where X = max active members)
  - Appear in battles
  - Show as followers on the map
  - Listed first in menus

- **Reserve Members**: Any additional party members beyond the limit
  - Do NOT appear in battles
  - Do NOT show as followers on the map
  - Still appear in menus (depending on your menu plugin)
  - Automatically stored in a separate reserve array

### Automatic Management

When you add party members:
```javascript
$gameParty.addActor(5); // Add actor ID 5
```

The plugin automatically:
1. Adds the actor to the party
2. If the party exceeds the limit, moves excess members to reserves
3. Updates battle members and map followers
4. Removes any duplicates

---

## Debug Commands

When **Enable Debug Console** is set to `true`, you can use these console commands:

### Show Party Status
```javascript
MaxPartyDebug.show()
```

**Output:**
- Current `_actors` array
- Current `_reserveMembers` array
- Active battle members with names
- All members with names
- Per-actor battle status
- Map follower information

### Emergency Fix
```javascript
MaxPartyDebug.fix()
```

Runs `$gameParty.refresh()` and displays the updated party status. Use this if party members get out of sync.

---

## Technical Details

### Overridden Functions

This plugin overrides the following core functions:

1. **`Game_Party.prototype.battleMembers()`**  
   Returns only the first X active members from the `_actors` array

2. **`Game_Party.prototype.maxBattleMembers()`**  
   Returns your configured maximum

3. **`Game_Party.prototype.allMembers()`**  
   Returns both active and reserve members combined

4. **`Game_Party.prototype.members()`**  
   Alias for `allMembers()`

5. **`Game_Actor.prototype.isBattleMember()`**  
   Checks if the actor is in the first X positions of the party

6. **`Game_Followers.prototype.visibleFollowers()`**  
   Returns only followers for active battle members

7. **`Game_Followers.prototype.refresh()`**  
   Manually assigns follower sprites based on battle members

8. **`Game_Follower.prototype.actor()`**  
   Maps each follower to the correct battle member (skipping the leader)

### New Methods

- **`Game_Party.prototype.getReserveMembers()`**  
  Returns an array of reserve member data objects

- **`Game_Party.prototype.getActiveMembers()`**  
  Returns an array of active battle members

---

## Common Issues & Solutions

### Issue: Extra followers appear on the map
**Solution:** Make sure this plugin is loaded **LAST** in your plugin list.

### Issue: Party members disappear after loading a save
**Solution:** Run `MaxPartyDebug.fix()` in the console, or call `$gameParty.refresh()` via an event.

### Issue: Menu shows wrong party members
**Solution:** This plugin only controls battle/map members. Your menu plugin may have its own party display logic. Check if your menu plugin has a "show all members" option.

### Issue: Can't swap party members
**Solution:** This plugin doesn't include a party swapping interface. You'll need a separate plugin for that (or use events with `$gameParty.addActor()` / `$gameParty.removeActor()`).

---

## Compatibility

### Works With:
- ✅ Most menu plugins (VisuStella, YEP, etc.)
- ✅ Battle system plugins
- ✅ Custom formation plugins
- ✅ Save/Load systems

### May Conflict With:
- ⚠️ Other party size plugins (disable them)
- ⚠️ Plugins that directly modify `battleMembers()` (load this LAST)

---

## Example Usage

### Set Max Party Size to 3
```javascript
// In Plugin Parameters:
Maximum Active Party Members: 3
```

### Add Multiple Members
```javascript
// Via event commands or script:
$gameParty.addActor(1); // Harold - Active
$gameParty.addActor(2); // Therese - Active
$gameParty.addActor(3); // Marsha - Active
$gameParty.addActor(4); // Lucius - Reserve (auto)
$gameParty.addActor(5); // Alice - Reserve (auto)
```

### Check Party Status
```javascript
// In console:
MaxPartyDebug.show()

// Output:
// _actors: [1, 2, 3]
// _reserveMembers: [4, 5]
// battleMembers(): [1:Harold, 2:Therese, 3:Marsha]
```

---

## Version History

### v2.0.1
- Fixed follower display to prevent duplicate leader sprites
- Completely replaced follower refresh logic
- Added proper actor mapping for followers

### v2.0.0
- Initial nuclear option implementation
- Force-overrides battleMembers() function
- Added reserve member system
- Added debug console commands

---

## Support

If you encounter issues:

1. Check that the plugin is loaded **LAST**
2. Run `MaxPartyDebug.show()` to check party state
3. Try `MaxPartyDebug.fix()` to force a refresh
4. Check the browser console for error messages
5. Disable other party-related plugins to test for conflicts

---

## 📄 License & Attribution

### **Copyright Information**
**Copyright © 2025 Alexandros Panagiotakopoulos. All Rights Reserved.**

### **License Terms**
Licensed under **Custom MIT-Based License with Attribution Requirements**

**You may:**
- ✅ Use in commercial projects with attribution
- ✅ Use in non-commercial projects with attribution
- ✅ Modify and adapt for your specific needs
- ✅ Redistribute with proper attribution

**You must:**
- 📝 Include attribution in your game credits
- 📋 Maintain copyright notices in code
- 📄 Include license information when redistributing

### **Required Attribution**
**Minimum attribution in game credits:**
```
Performance integration by Alexandros Panagiotakopoulos
```

**Professional attribution (recommended):**
```
PerformanceIntegration.js - Unified Performance Management
Professional RPG Plugin Suite by Alexandros Panagiotakopoulos
```
---

**Copyright © 2025 Alexandros Panagiotakopoulos. All Rights Reserved.**

*Revolutionizing RPG Maker MZ development through intelligent performance integration.*

---

*Last Updated: October 2025*
