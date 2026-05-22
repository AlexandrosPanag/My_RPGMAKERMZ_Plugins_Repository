# ⚔️ FightEscapeOnce.js - One-Time Party Command System

Streamline your RPG Maker MZ battles by showing the Fight/Escape prompt only once — at the very start of combat. Every turn after that skips straight to your actors' command menus.

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)

---

## 👤 Author

**Alexandros Panagiotakopoulos**

---

## 🌟 What is FightEscapeOnce?

FightEscapeOnce is a **lightweight, zero-configuration battle flow plugin** for RPG Maker MZ. By default, MZ forces players to click Fight at the start of **every single turn** before they can pick their actions — a repetitive extra step that interrupts the flow of combat. This plugin eliminates that friction entirely.

### **The Problem It Solves**
- ❌ **Repetitive Fight prompt** interrupts battle rhythm every turn
- ❌ **Unnecessary extra click** before every actor command
- ❌ **Immersion breaking** — players already committed to fighting
- ❌ **Slower pacing** in action-heavy or encounter-rich games

### **The Solution**
- ✅ **Fight/Escape appears once** — on Turn 1 of each battle
- ✅ **Turn 2 onward** skips straight to actor command menus
- ✅ **Escape always available** on Turn 1 as normal
- ✅ **Zero configuration** — drop in and it works
- ✅ **Resets cleanly** on every new battle encounter

---

## 🎮 How It Works

### **Default MZ Battle Flow (every turn)**
```
Fight/Escape → Actor 1 → Actor 2 → Actor 3 → Actor 4 → Enemy Phase
Fight/Escape → Actor 1 → Actor 2 → ...  ← repeated EVERY turn
```

### **With FightEscapeOnce**
```
Turn 1:  Fight/Escape → Actor 1 → Actor 2 → Actor 3 → Actor 4 → Enemy Phase
Turn 2+: Actor 1 → Actor 2 → Actor 3 → Actor 4 → Enemy Phase  ← direct!
Turn 3+: Actor 1 → Actor 2 → ...
```

Players make the commitment to fight once, and the game trusts that decision for the rest of the battle. Clean, fast, fluid.

---

## 🚀 Key Features

### **⚡ Instant Battle Flow**
- Fight/Escape shown **once per battle**, on Turn 1 only
- Subsequent turns jump **directly to actor commands**
- No input lag, no extra window, no interruption

### **🔄 Smart Battle Reset**
- Flag resets **automatically** at the start of every new battle
- Each encounter starts fresh with Fight/Escape on Turn 1
- No leftover state between battles

### **🎯 Escape Still Works**
- Turn 1 Fight/Escape window is **fully functional**
- Players can still escape from combat normally
- No escape mechanics are removed or broken

### **🧩 Minimal Footprint**
- **Only 3 method hooks** — `BattleManager.initMembers`, `BattleManager.setup`, `Scene_Battle.startPartyCommandSelection`, `Scene_Battle.commandFight`
- **Zero new data stored** beyond a single boolean flag on BattleManager
- **No plugin parameters** — nothing to configure

---

## ⚙️ Installation

### **Quick Start (2 Steps)**
1. **Drop** `FightEscapeOnce.js` into your `js/plugins/` folder
2. **Enable** it in the RPG Maker MZ Plugin Manager

That's it. No settings, no notetags, no configuration. Start a battle and experience the difference.

---

## 🔧 Compatibility

### **Plugin Load Order**
| **Plugin** | **Placement** |
|---|---|
| VisuStella Battle Core | Place TK_FightEscapeOnce **below** it |
| YEP Battle Engine Core | Place TK_FightEscapeOnce **below** it |
| Most other battle plugins | Any order should work |

### **Hooked Methods**
This plugin only touches:
- `BattleManager.initMembers` — adds `_fightChosenOnce` flag
- `BattleManager.setup` — resets flag on new battle
- `Scene_Battle.prototype.startPartyCommandSelection` — skips window on Turn 2+
- `Scene_Battle.prototype.commandFight` — sets flag when Fight is chosen

If another plugin also hooks `startPartyCommandSelection`, ensure load order is correct so both plugins chain properly via their aliased calls.

### **Tested Environments**
- ✅ RPG Maker MZ (all versions)
- ✅ Chrome / Edge / Firefox
- ✅ NW.js (desktop deployment)
- ✅ Standard side-view and front-view battle

---

## 🛠️ Developer Notes

### **Console Diagnostics**
```javascript
// Check if fight has been chosen this battle
console.log(BattleManager._fightChosenOnce);  // true / false

// Manually reset mid-battle (e.g. for testing)
BattleManager._fightChosenOnce = false;

// Force skip party command on demand
SceneManager._scene.selectNextCommand();
```

### **Extending the Plugin**
If you want Fight/Escape to re-appear under specific conditions (e.g. a new wave of enemies joins), you can reset the flag via an event script call:
```javascript
BattleManager._fightChosenOnce = false;
```
The next turn will then show Fight/Escape again before proceeding.

---

## 🔒 Security & Compatibility

- **No external dependencies** — completely self-contained
- **No data persisted** — flag lives only in memory during battle
- **No core overwrites** — all hooks use proper aliasing
- **No eval() usage** — safe and CSP compliant
- **Save game safe** — doesn't touch save data in any way

---

## 🎯 Use Cases

- **Action-RPGs** where fast turn pacing matters
- **Encounter-heavy dungeons** where clicking Fight every turn gets tedious
- **Streamlined UX** for players unfamiliar with JRPG conventions
- **Custom battle systems** that already imply the player is fighting
- **Games where Escape is rare** and the Fight prompt feels redundant after Turn 1

---

## 📄 License & Attribution

### **Copyright Information**
**Copyright © 2026 Alexandros Panagiotakopoulos. All Rights Reserved.**

### **License Terms**
Licensed under **Creative Commons Attribution 4.0 International License**

**You are free to:**
- ✅ **Share** — copy and redistribute in any medium or format
- ✅ **Adapt** — remix, transform, and build upon the material
- ✅ **Commercial Use** — use for commercial projects
- ✅ **Modify** — change and customize for your needs

**Under the following terms:**
- 📝 **Attribution** — You must give appropriate credit and link to the license
- 📋 **Indicate Changes** — You must indicate if you made changes
- 🚫 **No Warranty** — The work is provided "as is"

### **Required Attribution**
**Minimum attribution in game credits:**
```
FightEscapeOnce.js by Alexandros Panagiotakopoulos
Licensed under CC BY 4.0
```

**Recommended attribution (for professional games):**
```
FightEscapeOnce.js — One-Time Party Command System
Copyright © 2026 Alexandros Panagiotakopoulos
Licensed under Creative Commons Attribution 4.0 International License
https://creativecommons.org/licenses/by/4.0/
```

---

## 📈 Performance

- **CPU Impact**: Negligible — one boolean check per turn start
- **Memory Usage**: ~1 boolean flag during battle, nothing else
- **Load Time**: <1ms initialization
- **No frame-by-frame overhead** — only fires on turn phase transitions

---

**Copyright © 2026 Alexandros Panagiotakopoulos. All Rights Reserved.**

*Making every battle feel fluid, fast, and focused.*

**Happy game developing! 🎮⚔️**
