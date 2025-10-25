# Nuclear Event Forcer for RPG Maker MZ

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)
![Warning](https://img.shields.io/badge/⚠️-DEBUG_ONLY-red)

A **debugging plugin** that forcefully executes events on every frame, bypassing RPG Maker MZ's normal event control systems. This plugin uses aggressive techniques to ensure specific events run continuously.

---

## ⚠️ CRITICAL WARNING - DEBUG USE ONLY

**🚨 THIS PLUGIN IS FOR DEBUGGING PURPOSES ONLY 🚨**

This plugin uses extremely aggressive techniques that bypass RPG Maker MZ's normal event flow control. It should **NEVER** be used in a production/released game.

### Why This Is Dangerous:

- ❌ **Breaks Game Logic** - Forces events to run regardless of conditions, switches, or game state
- ❌ **Performance Issues** - Events run every single frame (60 times per second) causing severe lag
- ❌ **Unpredictable Behavior** - Can cause unexpected interactions with other systems
- ❌ **Save Game Corruption Risk** - May corrupt save data by forcing invalid game states
- ❌ **Conflict Potential** - Will likely conflict with other plugins and battle systems
- ❌ **Memory Leaks** - Continuously creating interpreters can lead to memory issues

### When to Use This Plugin:

✅ **Testing** - Verifying that event commands work correctly  
✅ **Debugging** - Diagnosing why events aren't triggering normally  
✅ **Development** - Quickly testing event sequences during development  
✅ **Troubleshooting** - Isolating event-related issues

### When NOT to Use This Plugin:

❌ **Production Games** - Never include in released games  
❌ **Public Demos** - Will cause performance and stability issues  
❌ **Normal Gameplay** - Breaks the intended game flow  
❌ **Permanent Solutions** - This is a diagnostic tool, not a fix

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

---

## 🎯 What This Plugin Does

The Nuclear Event Forcer bypasses RPG Maker MZ's normal event control flow by:

1. **Hijacking Scene Updates** - Intercepts the game's update cycle
2. **Forcing Interpreter Creation** - Creates event interpreters even when they shouldn't exist
3. **Continuous Execution** - Restarts events immediately after they finish
4. **Global Update Injection** - Forces events to update every frame regardless of state

This creates a "forced execution" environment where tagged events will run continuously, no matter what.

---

## 📋 Requirements

- **RPG Maker MZ** (Version 1.0.0 or higher)
- Events with command lists
- Understanding of event systems (for debugging purposes)

---

## 🚀 Installation

### Step 1: Install the Plugin

1. Download `NuclearEventForcer.js`
2. Copy it to your project's plugin folder:
   ```
   YourProject/js/plugins/NuclearEventForcer.js
   ```
3. Open RPG Maker MZ
4. Go to **Tools → Plugin Manager**
5. Click **Add** or double-click an empty slot
6. Select `NuclearEventForcer` from the list
7. Ensure the plugin is **ON** (checkbox enabled)
8. Click **OK**

> **⚠️ Remember:** This plugin should be **disabled** before releasing your game!

---

## 🎮 Usage

### Step 1: Tag Your Events

1. Open the **Database** (F9) or use the map editor
2. Select an event you want to force-run
3. In the event's **Note** field, add:
   ```
   <nuke:traffic>
   ```
   
You can use any tag name instead of "traffic":
```
<nuke:test>
<nuke:debug>
<nuke:animation>
```

### Step 2: Activate Nuclear Mode

Use a **Plugin Command** to activate the forced execution:

1. In an event command list, select **Plugin Command**
2. Choose **NuclearEventForcer**
3. Select **Activate Nuclear Mode**
4. Enter the tag name (e.g., "traffic" for `<nuke:traffic>`)

**Example Setup:**
```
◆ Plugin Command: NuclearEventForcer, activateNuclearMode
  - Note Tag Content: traffic
```

### Step 3: Observe and Debug

Once activated:
- All events with the matching tag will start running
- They will run continuously, restarting immediately after finishing
- Check the **F8 Console** (Developer Tools) for detailed logging
- The plugin outputs diagnostic information about each event

---

## 🔍 Console Output

When activated, the plugin logs detailed information:

```
=== NUCLEAR MODE ACTIVATED ===
Looking for tag: traffic
Total events on map: 15
Event 1: PlayerStart at (10,12) - Has tag: false
Event 3: TrafficLight at (5,8) - Has tag: true
>>> FOUND TARGET: TrafficLight
Created new interpreter
Event has 12 commands
Interpreter setup complete
Added to forced events list
=== NUCLEAR MODE COMPLETE ===
Total forced events: 1
```

This helps you:
- Verify events are being found
- Confirm interpreters are created
- Track which events are being forced
- Debug event command execution

---

## 📚 Example Use Cases

### Use Case 1: Testing Animation Loops

**Problem:** You want to test an animation sequence repeatedly without manual triggering.

**Solution:**
```
Event: AnimationTest
Note: <nuke:anim>
Contents:
  ◆ Show Animation: Player, [Animation1]
  ◆ Wait: 30 frames
  ◆ Show Animation: Player, [Animation2]
  ◆ Wait: 30 frames
```

Activate with tag "anim" - the animation will loop continuously for testing.

### Use Case 2: Debugging Movement Scripts

**Problem:** A complex movement pattern isn't working correctly.

**Solution:**
```
Event: MovementDebug
Note: <nuke:move>
Contents:
  ◆ Set Movement Route: This Event
    - Move Down
    - Move Right
    - Move Up
    - Move Left
  ◆ Wait: 60 frames
```

Activate to watch the movement pattern repeat continuously.

### Use Case 3: Testing Conditional Logic

**Problem:** You need to verify switch/variable conditions are evaluated correctly.

**Solution:**
```
Event: LogicTest
Note: <nuke:logic>
Contents:
  ◆ Control Variables: [0001] += 1
  ◆ Conditional Branch: Variable [0001] >= 10
    ◆ Text: Counter reached 10!
    ◆ Control Variables: [0001] = 0
  : End
```

Watch how your logic executes frame-by-frame.

---

## 🔧 Troubleshooting

### Problem: Events not running

**Check:**
- Is the note tag spelled exactly as entered in the plugin command?
- Does the event have actual commands (not just a blank page)?
- Is the plugin enabled in Plugin Manager?
- Check F8 console for "FOUND TARGET" messages

### Problem: Game is lagging severely

**Solution:**
- This is expected - events are running 60 times per second
- Reduce the number of forced events
- Remove complex commands from test events
- **Remember:** This plugin is not meant for performance

### Problem: Events interfering with gameplay

**Solution:**
- The plugin is working as designed (forcing execution)
- Disable the plugin when not actively debugging
- Use separate test maps for nuclear debugging
- Never use this with actual gameplay events

### Problem: Console shows errors

**Solution:**
- Check that events have valid command lists
- Ensure event data structures are intact
- Verify the map and events loaded correctly
- Some errors may be expected if testing broken events

---

## 🛡️ Best Practices

### DO:
✅ Use on **test maps** separate from your main game  
✅ **Disable immediately** after debugging  
✅ Keep forced events **simple** (few commands)  
✅ Monitor the **F8 console** for diagnostic info  
✅ Test **one event at a time** when possible  
✅ Document which events you're testing  

### DON'T:
❌ Use in **production builds**  
❌ Test with **complex events** (use simplified versions)  
❌ Force multiple events **simultaneously** (causes lag)  
❌ Leave **enabled** when publishing demos  
❌ Rely on this as a **permanent solution**  
❌ Test with **save-critical** events  

---

## 🔬 Technical Details

### How It Works

The plugin hijacks two critical update methods:

1. **Scene_Map.prototype.update**
   - Intercepts the main scene update
   - Forces interpreters to run every frame

2. **Game_Map.prototype.update**
   - Intercepts the map update cycle
   - Provides backup forced execution


### Memory Considerations

- Each forced event maintains a persistent interpreter
- Interpreters are recreated if they stop
- Global array `window.$forcedEvents` persists across scenes
- Consider clearing forced events when changing maps

---

## ⚙️ Plugin Parameters

### activateNuclearMode Command

**Parameter: noteTag**
- **Type:** String
- **Default:** "traffic"
- **Description:** The tag content to search for in event notes
- **Example:** If note is `<nuke:test>`, use "test"

---

## 🚨 Final Warning

**This plugin is a power tool for debugging, not a game mechanic.**

Think of it like a fire extinguisher:
- 🔥 Breaks glass in emergency (debugging crisis)
- ✅ Solves the immediate problem (identifies issue)
- ❌ Not for everyday use (normal development)
- ⚠️ Can cause damage if misused (game stability)

**Before releasing your game:**
1. ✅ Remove or disable this plugin
2. ✅ Fix the actual event logic issues
3. ✅ Test without nuclear forcing
4. ✅ Verify save game integrity
5. ✅ Confirm normal event flow works

---

## 📚 Additional Resources

- [RPG Maker MZ Documentation](https://www.rpgmakerweb.com/support/products/rpg-maker-mz)
- [RPG Maker Forums](https://forums.rpgmakerweb.com/)
- [Event System Guide](https://rpgmakerweb.com/tutorials)
- [Plugin Development](https://docs.google.com/document/d/1xz7kB1g_z_eTvLxNzLWLp7eKPKrO9yVK7S7i0f1Tq8E/)

---

**Made with ❤️ for debugging the RPG Maker community's toughest event problems**

*Use responsibly. Debug wisely. Ship cleanly.* 🛡️
