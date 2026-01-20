# RPG Maker MZ Ultimate Cheat Sheet Collection

---

# 📋 Table of Contents
1. [Script Calls Cheat Sheet](#script-calls)
2. [Event Command Quick Reference](#event-commands)
3. [Switch & Variable Best Practices](#switches-variables)
4. [Plugin Command Patterns](#plugin-commands)
5. [Common Event Setups](#common-events)
6. [Battle System Tricks](#battle-tricks)
7. [Map & Movement Techniques](#map-movement)
8. [Save & Load System](#save-system)

---

<a name="script-calls"></a>
# 💻 Script Calls Cheat Sheet

## Player & Party Management

### **Get Player Position**
```javascript
$gamePlayer.x  // Player's X coordinate
$gamePlayer.y  // Player's Y coordinate
$gameMap.displayX()  // Screen X position
$gameMap.displayY()  // Screen Y position
```

### **Move Player**
```javascript
$gamePlayer.locate(x, y)  // Teleport to coordinates
$gamePlayer.jump(xPlus, yPlus)  // Jump relative
$gamePlayer.setDirection(2)  // 2=down, 4=left, 6=right, 8=up
```

### **Party Management**
```javascript
$gameParty.addActor(5)  // Add actor 5 to party
$gameParty.removeActor(5)  // Remove actor 5
$gameParty.leader()  // Get party leader
$gameParty.size()  // Number of party members
$gameParty.members()  // Array of all party members
$gameParty.gainGold(500)  // Add gold
$gameParty.loseGold(100)  // Remove gold
$gameParty.gold()  // Current gold amount
```

---

## Actor Manipulation

### **Get Actor Data**
```javascript
$gameActors.actor(1)  // Get actor by ID
$gameActors.actor(1).name()  // Actor's name
$gameActors.actor(1).level  // Actor's level
$gameActors.actor(1).hp  // Current HP
$gameActors.actor(1).mp  // Current MP
$gameActors.actor(1).mhp  // Max HP
$gameActors.actor(1).mmp  // Max MP
```

### **Change Actor Stats**
```javascript
$gameActors.actor(1).changeLevel(50, false)  // Level to 50, no show
$gameActors.actor(1).gainHp(100)  // Heal 100 HP
$gameActors.actor(1).gainMp(50)  // Restore 50 MP
$gameActors.actor(1).setHp(1)  // Set HP to 1
$gameActors.actor(1).setMp(0)  // Set MP to 0
```

### **Change Actor Appearance**
```javascript
$gameActors.actor(1).setName("NewName")
$gameActors.actor(1).setNickname("The Hero")
$gameActors.actor(1).setCharacterImage("Actor2", 0)
$gameActors.actor(1).setFaceImage("Actor2", 0)
$gameActors.actor(1).setBattlerImage("Actor2_1")
```

### **Equipment & Skills**
```javascript
$gameActors.actor(1).learnSkill(10)  // Learn skill ID 10
$gameActors.actor(1).forgetSkill(10)  // Forget skill ID 10
$gameActors.actor(1).hasSkill(10)  // Check if has skill
$gameActors.actor(1).changeEquip(0, $dataWeapons[5])  // Equip weapon
```

---

## Items & Inventory

### **Item Management**
```javascript
$gameParty.gainItem($dataItems[1], 5)  // Add 5 of item 1
$gameParty.loseItem($dataItems[1], 2)  // Remove 2 of item 1
$gameParty.hasItem($dataItems[1])  // Check if has item
$gameParty.numItems($dataItems[1])  // Count of item

$gameParty.gainItem($dataWeapons[5], 1)  // Add weapon
$gameParty.gainItem($dataArmors[10], 1)  // Add armor
```

---

## Switches & Variables

### **Switch Operations**
```javascript
$gameSwitches.setValue(1, true)  // Turn switch 1 ON
$gameSwitches.setValue(1, false)  // Turn switch 1 OFF
$gameSwitches.value(1)  // Check switch 1 status
```

### **Variable Operations**
```javascript
$gameVariables.setValue(1, 100)  // Set variable 1 to 100
$gameVariables.value(1)  // Get variable 1 value
$gameVariables.setValue(1, $gameVariables.value(1) + 10)  // Add 10
```

---

## Map & Events

### **Map Control**
```javascript
SceneManager.goto(Scene_Map)  // Go to map
$gameMap.mapId()  // Current map ID
$gameMap.displayName()  // Map display name
$gameMap.refresh()  // Refresh map events
```

### **Event Control**
```javascript
$gameMap.event(5)  // Get event ID 5
$gameMap.event(5).erase()  // Erase event 5
this.character(0)  // This event (use in event script)
this.character(-1)  // Player
this.character(1)  // Event ID 1
```

### **Self Switches** (in event script calls)
```javascript
const key = [this._mapId, this._eventId, 'A']
$gameSelfSwitches.setValue(key, true)  // Turn self switch A ON
```

---

## Scene Management

### **Change Scenes**
```javascript
SceneManager.push(Scene_Menu)  // Open menu
SceneManager.push(Scene_Item)  // Open item menu
SceneManager.push(Scene_Skill)  // Open skill menu
SceneManager.push(Scene_Equip)  // Open equip menu
SceneManager.push(Scene_Status)  // Open status menu
SceneManager.push(Scene_Save)  // Open save menu
SceneManager.push(Scene_Load)  // Open load menu
SceneManager.push(Scene_GameEnd)  // Open game end menu
SceneManager.goto(Scene_Title)  // Return to title
SceneManager.goto(Scene_Gameover)  // Game over
```

---

## Audio Control

### **Music & Sound**
```javascript
AudioManager.playBgm({name: "Theme1", volume: 90, pitch: 100, pan: 0})
AudioManager.playBgs({name: "River", volume: 80, pitch: 100, pan: 0})
AudioManager.playMe({name: "Victory1", volume: 90, pitch: 100, pan: 0})
AudioManager.playSe({name: "Sword1", volume: 90, pitch: 100, pan: 0})

AudioManager.stopBgm()  // Stop background music
AudioManager.fadeOutBgm(3)  // Fade out over 3 seconds
```

---

## Screen Effects

### **Weather & Tint**
```javascript
$gameScreen.changeWeather('rain', 5, 60)  // Rain at power 5
$gameScreen.changeWeather('storm', 9, 60)  // Storm
$gameScreen.changeWeather('snow', 7, 60)  // Snow
$gameScreen.changeWeather('none', 0, 60)  // Clear weather

$gameScreen.startTint([68, -34, -34, 0], 60)  // Red tint
$gameScreen.startTint([0, 0, 0, 255], 60)  // Fade to black
$gameScreen.startTint([0, 0, 0, 0], 60)  // Clear tint
```

### **Shake & Flash**
```javascript
$gameScreen.startShake(5, 5, 60)  // Shake screen
$gameScreen.startFlash([255, 255, 255, 255], 30)  // White flash
$gameScreen.startFlash([255, 0, 0, 170], 30)  // Red flash
```

---

## Battle System

### **Start/End Battle**
```javascript
BattleManager.setup(5, true, true)  // Setup troop 5, can escape, can lose
SceneManager.push(Scene_Battle)

$gameParty.inBattle()  // Check if in battle
BattleManager.isBattleEnd()  // Check if battle ended
```

---

## Time & System

### **Time Control**
```javascript
Graphics.frameCount  // Total frames since game start
$gameTimer.start(600)  // Start timer (600 frames = 10 seconds)
$gameTimer.stop()  // Stop timer
$gameTimer.seconds()  // Current timer seconds
```

### **Save/Load**
```javascript
DataManager.saveGame(1)  // Save to slot 1
DataManager.loadGame(1)  // Load from slot 1
DataManager.isAnySavefileExists()  // Check if any save exists
```

---

<a name="event-commands"></a>
# 🎬 Event Command Quick Reference

## Essential Event Commands

### **Conditional Branches - Common Patterns**

#### Check if variable is in range:
```
◆Conditional Branch: Variable [0001] >= 10
  ◆Text: You have enough!
: Else
  ◆Text: Not enough yet.
: Branch End
```

#### Check multiple switches at once:
```
◆Conditional Branch: Switch [0001] == ON AND Switch [0002] == ON
  ◆Text: Both conditions met!
: Branch End
```

#### Check if actor is in party:
```
◆Conditional Branch: [Actor 5] is in the Party
  ◆Text: Crystal is here!
: Branch End
```

#### Check item count:
```
◆Conditional Branch: Party Has [Potion] x5 or more
  ◆Text: You have enough potions!
: Branch End
```

---

### **Control Switches - Patterns**

#### Turn on multiple switches:
```
◆Control Switches: #0001..#0010 = ON
(Batch operation - very useful!)
```

#### Toggle switch:
```
◆Conditional Branch: Switch [0001] == ON
  ◆Control Switches: #0001 = OFF
: Else
  ◆Control Switches: #0001 = ON
: Branch End
```

---

### **Control Variables - Advanced**

#### Random number (dice roll):
```
◆Control Variables: #0001 = Random No. (1...6)
◆Text: You rolled a \V[1]!
```

#### Store actor's HP:
```
◆Control Variables: #0001 = [Actor 1]'s HP
```

#### Mathematics:
```
◆Control Variables: #0005 = #0001 + #0002
◆Control Variables: #0006 = #0003 * 2
◆Control Variables: #0007 = #0004 / 2
```

#### Store item count:
```
◆Control Variables: #0001 = Party's [Potion] Count
```

---

### **Event Movement - Smooth Cutscenes**

#### Character walks to position:
```
◆Set Movement Route: Player
: ◇Move Down
: ◇Move Down
: ◇Move Right
: ◇Wait: 30 frames
: ◇Turn Left
◆Wait for Completion
```

#### Make NPC face player:
```
◆Set Movement Route: This Event
: ◇Turn toward Player
```

#### Jump animation:
```
◆Set Movement Route: Player
: ◇Jump: (0, -2)  // Jump up 2 tiles
```

---

<a name="switches-variables"></a>
# 🔄 Switches & Variables Best Practices

## Naming Convention (Use Comments!)

### **Switches Organization**
```
0001-0010: Story Progression
  0001: Prologue Complete
  0002: Met Queen Crystal
  0003: First Boss Defeated
  
0011-0020: Quest Flags
  0011: Quest_Bandit_Camp_Active
  0012: Quest_Bandit_Camp_Complete
  
0021-0030: Character States
  0021: Crystal_In_Party
  0022: Elyria_Recruited
  0023: Crow_Available
  
0031-0050: Map Flags
  0031: Castle_Gate_Open
  0032: Sewer_Key_Used
  0033: Library_Unlocked
  
0051-0100: Combat Flags
  0051: Boss_Phase_2
  0052: Tutorial_Complete
```

### **Variables Organization**
```
0001-0010: Player Stats
  0001: Player_Gender (1=Male, 2=Female)
  0002: Difficulty (1=Normal, 2=ReLive)
  0003: Current_Loop_Number
  0004: Days_In_Loop
  
0011-0020: Quest Progress
  0011: Main_Quest_Stage
  0012: Side_Quest_Count
  0013: Enemies_Defeated
  
0021-0030: Inventory/Currency
  0021: Special_Currency
  0022: Crafting_Materials
  
0031-0050: Temporary Variables
  0031: Temp_Calculation
  0032: Temp_Random
  0033: Temp_Counter
```

---

## Common Patterns

### **One-Time Event**
```
◆Conditional Branch: Switch [0050: Event_Done] == OFF
  ◆Text: This happens once!
  ◆Control Switches: #0050 Event_Done = ON
: Branch End
```

### **Counter System**
```
◆Control Variables: #0010 += 1
◆Text: You've done this \V[10] times!
```

### **Quest Stage Progression**
```
◆Control Variables: #0011 Quest_Stage = 1  // Quest started
...
◆Control Variables: #0011 Quest_Stage = 2  // Objective 1 done
...
◆Control Variables: #0011 Quest_Stage = 3  // Quest complete
```

---

<a name="plugin-commands"></a>
# 🔌 Plugin Command Patterns

## How to Use Plugin Commands

### **Basic Syntax** (Event Command: Plugin Command)
```
Plugin Name: YourPlugin
Command: commandName
Arguments:
  arg1: value1
  arg2: value2
```

### **Common Plugin Commands**

#### VisuStella Message Core:
```
Plugin: MessageCore
Command: MessageWindowPosition
  X: 0
  Y: 100
  Width: Graphics.boxWidth
  Height: 200
```

#### Picture Common Events:
```
Plugin: PictureCE
Command: CallCommonEvent
  Picture ID: 1
  Common Event ID: 5
```

---

<a name="common-events"></a>
# 🎯 Common Event Setups

## Common Event Best Practices

### **Types of Common Events**

#### **1. Parallel Process** (Always running)
```
Use for: Real-time systems, timers, background updates
Example: Day/Night cycle, Auto-save timer

◆Conditional Branch: Switch [0100: DayNight_Active] == ON
  ◆Control Variables: #0020 Time += 1
  ◆Conditional Branch: Variable [0020] >= 1000
    ◆Control Variables: #0020 Time = 0
    ◆Script: $gameScreen.startTint([...], 60)
  : Branch End
◆Wait: 60 frames
```

#### **2. Autorun** (Runs once when condition met)
```
Use for: Cutscenes, story events, one-time triggers

◆Conditional Branch: Switch [0001: Cutscene_Trigger] == ON
  ◆Text: A cutscene plays!
  ◆Control Switches: #0001 Cutscene_Trigger = OFF
: Branch End
```

#### **3. None** (Called manually)
```
Use for: Reusable scripts, called by events

Common Event #1: "Heal Party"
◆Recover All: Entire Party
◆Play SE: Heal
◆Show Animation: Screen, [Heal Effect]
```

---

### **Common Event Library Examples**

#### **Level Up Celebration**
```
◆Show Picture: #1, LevelUp, Center (0,0)
◆Play ME: Fanfare1
◆Wait: 120 frames
◆Erase Picture: #1
```

#### **Death Counter**
```
◆Control Variables: #0030 Deaths += 1
◆Conditional Branch: Variable [0030] >= 10
  ◆Text: You've died 10 times. Here's a hint!
  ◆Control Switches: #0040 Hint_Available = ON
: Branch End
```

#### **Auto-Save System**
```
◆Conditional Branch: Switch [0200: AutoSave_Enabled] == ON
  ◆Control Variables: #0031 Timer += 1
  ◆Conditional Branch: Variable [0031] >= 600
    ◆Script: DataManager.saveGame(99)
    ◆Text: \C[3]Auto-saved!\C[0]
    ◆Control Variables: #0031 Timer = 0
  : Branch End
: Branch End
```

---

<a name="battle-tricks"></a>
# ⚔️ Battle System Tricks

## Battle Event Scripting

### **Multi-Phase Boss**
```
Troop Event - Condition: Turn 1
◆Text: Boss: Phase 1 begins!

Troop Event - Condition: Enemy [Boss] HP <= 50%
◆Conditional Branch: Switch [0051: Phase2] == OFF
  ◆Text: Boss: You'll regret that!
  ◆Change Enemy State: [Boss], +Attack Up
  ◆Change Enemy State: [Boss], +Defense Up
  ◆Control Switches: #0051 Phase2 = ON
: Branch End
```

### **Summon Reinforcements**
```
Troop Event - Condition: Turn 5
◆Text: Boss: I summon my minions!
◆Show Animation: [Boss], [Summon Effect]
◆Add Enemy: Minion x2
```

### **Escape Prevention**
```
Troop Event - Condition: Battle Start
◆Change Battle BGM: Boss_Theme
◆Text: You cannot escape!
◆Script: BattleManager._canEscape = false;
```

---

<a name="map-movement"></a>
# 🗺️ Map & Movement Techniques

## Advanced Map Tricks

### **Smooth Camera Follow**
```
◆Set Movement Route: Player
: ◇Move Up
: ◇Move Up
: ◇Move Up
◆Wait for Completion
◆Scroll Map: Up, 6, 4 speed
◆Wait: 60 frames
```

### **Cutscene Lock Player**
```
◆Set Movement Route: Player
: ◇Change Opacity: 0 (invisible)
: ◇Through ON
◆Control Switches: #0080 Cutscene_Active = ON

[After cutscene]
◆Set Movement Route: Player
: ◇Change Opacity: 255
: ◇Through OFF
◆Control Switches: #0080 Cutscene_Active = OFF
```

### **Event Follows Player**
```
Event Page 2 - Condition: Switch [0021: Crystal_Follows] ON
◆Set Movement Route: This Event
: ◇Move toward Player (repeat)
```

---

<a name="save-system"></a>
# 💾 Save & Load System

## Custom Save/Load Scripts

### **Quick Save to Slot 1**
```javascript
if (DataManager.saveGame(1)) {
  SoundManager.playSave();
  $gameMessage.add("Game Saved!");
} else {
  SoundManager.playBuzzer();
  $gameMessage.add("Save Failed!");
}
```

### **Check if Save Exists**
```javascript
if (DataManager.isAnySavefileExists()) {
  $gameMessage.add("Save data found!");
  $gameSwitches.setValue(90, true);
} else {
  $gameMessage.add("No save data.");
}
```

### **Get Play Time**
```javascript
const seconds = $gameSystem.playtime();
const hours = Math.floor(seconds / 3600);
const minutes = Math.floor((seconds % 3600) / 60);
$gameMessage.add("Playtime: " + hours + "h " + minutes + "m");
```

---

# 🎮 RE;LIVE Specific Patterns

## Loop System Implementation

### **Initialize Loop Counter**
```
◆Control Variables: #0003 Loop_Number = 1
◆Control Variables: #0004 Days_In_Loop = 0
```

### **Loop Reset Sequence**
```
◆Text: \C[18]LOOP RESET INITIATED...\C[0]
◆Fadeout Screen
◆Control Variables: #0003 Loop_Number += 1
◆Control Variables: #0004 Days_In_Loop = 0
◆Transfer Player: [Throne Room]
◆Fadein Screen
◆Text: \C[18]LOOP \V[3] BEGIN\C[0]
```

### **Memory Persistence Check**
```
◆Conditional Branch: Variable [0003: Loop_Number] >= 2
  ◆Text: \N[1]: (I've been here before...)
  ◆Text: \N[1]: (This is loop \V[3].)
: Branch End
```

---

# 🎨 Visual Novel Techniques

## Dialogue System Enhancements

### **Character Portrait Display**
```
◆Show Picture: #1, MC_Portrait, Left (50, 50)
◆Text: \N[1]: This is my dialogue.
◆Erase Picture: #1

◆Show Picture: #2, Crystal_Portrait, Right (650, 50)
◆Text: Crystal: And this is my response.
◆Erase Picture: #2
```

### **Dialogue Choice System**
```
◆Show Choices: [Agree], [Disagree], [Ask Question]
: When [Agree]
  ◆Control Variables: #0050 Approval += 10
  ◆Text: Crystal: I'm glad we agree.
: When [Disagree]
  ◆Control Variables: #0050 Approval -= 5
  ◆Text: Crystal: I see...
: When [Ask Question]
  ◆Text: Crystal: You want to know more?
: Branch End
```

---

# 🔍 Debugging Tips

## Test Commands (Use in Script Calls)

```javascript
// Teleport anywhere
$gamePlayer.locate(10, 15)

// Give all items
for (let i = 1; i < $dataItems.length; i++) {
  if ($dataItems[i]) $gameParty.gainItem($dataItems[i], 1);
}

// Max level all actors
for (let i = 1; i <= 4; i++) {
  if ($gameActors.actor(i)) {
    $gameActors.actor(i).changeLevel(99, false);
  }
}

// Unlock all switches
for (let i = 1; i <= 100; i++) {
  $gameSwitches.setValue(i, true);
}

// View current position
console.log($gamePlayer.x, $gamePlayer.y, $gameMap.mapId());
```

---

# 📊 Performance Tips

## Optimize Your Game

### **Reduce Parallel Processes**
- Use as few parallel common events as possible
- Combine multiple checks into one event
- Use wait commands to reduce CPU usage

### **Efficient Event Pages**
- Delete unnecessary event pages
- Use self-switches instead of switches when possible
- Erase events that are no longer needed

### **Image Optimization**
- Use .webp for smaller file sizes
- Keep tileset images under 2048x2048
- Compress audio files

---

**That's the ultimate collection! Bookmark this and you'll have everything you need!** 🚀
