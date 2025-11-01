# Passive Skills System Plugin
A comprehensive RPG Maker MZ plugin that adds a complete passive skill system with auto-regeneration, combat triggers, and stackable buffs.

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)


## 📋 Description
This plugin introduces a powerful passive skill framework for RPG Maker MZ, allowing you to create skills that are always active once learned. Unlike active skills that must be manually selected in battle, passive skills work automatically in the background, providing constant benefits, regeneration effects, and triggered abilities based on combat actions.

Perfect for creating deep character progression systems, unique class abilities, and dynamic combat mechanics that reward aggressive play or strategic positioning.

## ✨ Features
- **Always-Active Skills** - Passive skills work automatically when learned
- **Auto-Regeneration** - HP, MP, and TP regeneration per turn
- **Combat Triggers** - Apply states on attack to enemies or self
- **Stackable Buffs** - Build up power progressively during combat
- **Battle Automation** - Start battles with buffs automatically applied
- **Clean UI** - Passive skills are hidden from battle/menu skill lists
- **No Configuration** - All setup done through simple note tags
- **High Performance** - Optimized for multiple passive skills per actor

## 🎮 Compatibility
- **RPG Maker Version:** MZ
- **Battle System:** Compatible with default battle system
- **Conflicts:** Generally compatible with most plugins
- **Load Order:** Place below battle system plugins, above UI plugins

## 📝 License & Credits

### License
This project is licensed under the **Creative Commons Attribution 4.0 International License**.

**You are free to:**
- ✅ Share — copy and redistribute in any medium or format
- ✅ Adapt — remix, transform, and build upon the material  
- ✅ Commercial Use — use for commercial projects

**Under the following terms:**
- 📝 **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.

### Credits
- **Author**: Alexandros Panagiotakopoulos
- **Framework**: RPG Maker MZ Plugin System
- **Technologies**: JavaScript ES6+, RPG Maker MZ Core Scripts
- **Inspiration**: Bridging the gap between actor and enemy sprite systems


### Known Compatible Plugins
- YEP Battle Engine Core
- VisuStella Battle Core
- SRD plugins (general compatibility)

## 📦 Installation
1. Download `PassiveSkills.js`
2. Place the file in your project's `js/plugins/` folder
3. Open RPG Maker MZ
4. Go to **Plugin Manager** (F10)
5. Click **Add** and select `PassiveSkills` from the list
6. Make sure the plugin is set to **ON**
7. Click **OK**
8. Save your project

## 🔧 Usage

### Basic Setup
Once installed, configure passive skills using note tags in the Database:

**Creating a Simple HP Regeneration Passive:**
1. Go to **Database** → **Skills**
2. Create or edit a skill
3. Set **Scope** to "None" and **Occasion** to "Never"
4. In the **Note** field, add:
```
<Passive>
<HP Regen: 5%>
```
5. Give this skill to an actor - they'll now regenerate 5% HP per turn!

### Quick Start Examples

**Example 1: HP Regeneration**
```
<Passive>
<HP Regen: 5%>
```
Actor regenerates 5% of max HP every turn.

**Example 2: MP Regeneration**
```
<Passive>
<MP Regen: 3%>
```
Actor regenerates 3% of max MP every turn.

**Example 3: Poison on Hit**
```
<Passive>
<On Attack State: 5, 25%>
```
25% chance to poison enemies (state ID 5) when attacking.

**Example 4: Start Battle Buffed**
```
<Passive>
<Battle Start State: 10>
```
Automatically gain state 10 at battle start.

## 📖 Note Tags Reference

### Skill Note Tags

#### Core Passive Tag
```
<Passive>
```
Marks a skill as passive (always active when learned). Required for all passive skills.

---

#### Regeneration Tags
```
<HP Regen: x%>
```
Regenerates x% of max HP per turn.
- Example: `<HP Regen: 5%>` restores 5% HP each turn

```
<MP Regen: x%>
```
Regenerates x% of max MP per turn.
- Example: `<MP Regen: 3%>` restores 3% MP each turn

```
<TP Regen: x>
```
Regenerates x TP per turn (flat amount).
- Example: `<TP Regen: 10>` restores 10 TP each turn

---

#### Combat Trigger Tags
```
<On Attack State: x, y%>
```
Applies state x to target with y% chance when attacking.
- Parameters: x = state ID, y% = success rate (optional, default 100%)
- Example: `<On Attack State: 5, 30%>` = 30% chance to apply state 5

```
<On Attack Self State: x>
```
Applies state x to yourself when attacking.
- Parameter: x = state ID
- Example: `<On Attack Self State: 12>` applies state 12 to self
- Perfect for stacking buff mechanics!

```
<Battle Start State: x>
```
Applies state x at the start of battle.
- Parameter: x = state ID
- Example: `<Battle Start State: 10>` applies state 10 when battle begins

```
<Passive State: x>
```
Applies and maintains state x throughout battle.
- Parameter: x = state ID
- Example: `<Passive State: 9>` keeps state 9 active during battle

---

### State Note Tags

```
<Stack Max: x>
```
Allows this state to stack up to x times, multiplying trait effects.
- Parameter: x = maximum stacks
- Example: `<Stack Max: 5>` allows 5 stacks
- Works with: Parameter rates (ATK, DEF, etc.), element rates, state resistance
- Calculation: State with +10% ATK and 3 stacks = +30% ATK total

**Example Stackable State Setup:**
```
State Name: Rising Heat
Traits: ATK +10%
Auto Removal: End of Battle
Note: <Stack Max: 5>
```

## 💡 Advanced Examples

### Example 1: Blazing Spirit (Stacking ATK Buff)
Create a passive that increases attack power with each attack, stacking up to 5 times.

**Step 1 - Create the Buff State:**
1. **Database** → **States** → Create new state (e.g., ID 12 "Rising Heat")
2. **Name:** Rising Heat
3. **Restriction:** None
4. **Auto Removal Timing:** End of Battle
5. **Traits:** Add Parameter → ATK → 110% (+10% ATK)
6. **Note:**
```
<Stack Max: 5>
```

**Step 2 - Create the Passive Skill:**
1. **Database** → **Skills** → Create new skill (e.g., ID 51 "Blazing Spirit")
2. **Scope:** None
3. **Occasion:** Never
4. **Note:**
```
<Passive>
<On Attack Self State: 12>
```

**Result:** Each attack grants +10% ATK (max 5 stacks = +50% ATK). Resets each battle.

---

### Example 2: Combat Meditation
Restore both HP and MP each turn while building TP.

**Setup:**
1. Create skill "Combat Meditation"
2. **Note:**
```
<Passive>
<HP Regen: 3%>
<MP Regen: 2%>
<TP Regen: 5>
```

**Result:** Regenerates 3% HP, 2% MP, and 5 TP every turn.

---

### Example 3: Venomous Strikes
Apply poison to enemies with a chance on each attack.

**Setup:**
1. Ensure you have a Poison state (e.g., ID 5)
2. Create skill "Venomous Strikes"
3. **Note:**
```
<Passive>
<On Attack State: 5, 25%>
```

**Result:** Every attack has 25% chance to poison the target.

---

### Example 4: Battle-Ready Warrior
Start every battle with multiple buffs active.

**Setup:**
1. Create states: "Battle Focus" (ID 15, +20% ATK) and "Combat Stance" (ID 16, +15% DEF)
2. Create skill "Battle-Ready"
3. **Note:**
```
<Passive>
<Battle Start State: 15>
<Battle Start State: 16>
```

**Result:** Starts every battle with both buffs active.

---

### Example 5: Berserker's Soul (Advanced Combo)
Complex passive combining regeneration, battle buffs, and stacking damage.

**Setup States:**
- State 20: "Rage Stack" (Traits: +15% ATK, Note: `<Stack Max: 3>`)
- State 21: "Berserker Trance" (Traits: +10% ATK, -5% DEF)

**Setup Skill:**
```
<Passive>
<HP Regen: 2%>
<Battle Start State: 21>
<On Attack Self State: 20>
```

**Result:**
- Starts with +10% ATK, -5% DEF
- Regenerates 2% HP per turn
- Each attack adds +15% ATK (max 3 stacks = +45%)
- Total potential: +55% ATK at full stacks

## ⚙️ How It Works

### Technical Overview
The plugin integrates seamlessly with RPG Maker MZ's core battle system:

**Battle Start Phase:**
1. Passive skills are scanned for each actor
2. Battle Start States are applied
3. State stacks are reset to 0

**Combat Phase (Attack/Skill):**
1. Action executes normally
2. On-attack triggers check for passive skills
3. Target states applied based on success rates
4. Self-states applied with stacking logic

**Turn End Phase (Regeneration):**
1. Standard regeneration occurs
2. Passive regeneration effects apply
3. HP/MP/TP gains are calculated and applied

### State Stacking Mathematics
Stacks multiply trait bonuses linearly:
- **1 stack:** Base bonus (e.g., +10% ATK)
- **2 stacks:** 2× bonus (e.g., +20% ATK)
- **3 stacks:** 3× bonus (e.g., +30% ATK)

Formula: `final_bonus = base_bonus × stack_count`

### Performance
- Optimized lookups for passive skill checks
- Efficient state stack management
- No overhead when no passive skills learned
- Safe for multiple passives per actor

## 📝 Parameters
This plugin has no parameters - all configuration is done through note tags in the Database!

## 🎯 Use Cases

### Character Progression
- Create unique class-defining abilities
- Reward players for learning specific skills
- Build synergistic skill combinations

### Combat Mechanics
- "Building heat" systems for sustained damage
- Risk/reward mechanics (HP regen vs glass cannon)
- Elemental mastery with persistent buffs

### Strategic Depth
- Passive combos that work together
- Trade-offs between different passive choices
- Long-term power scaling in extended battles


## 📜 Changelog

### Version 1.0.0 - Initial Release (2025-10-31)
- Core passive skill system
- HP/MP/TP regeneration effects
- On-attack state application (target and self)
- Battle start state automation
- State stacking system with configurable max limits
- Automatic passive skill hiding in menus
- Full documentation and examples

## 👤 Author
**Assistant**
- Plugin Version: 1.0.0
- For: RPG Maker MZ

## 🐛 Bug Reports & Feature Requests

### Troubleshooting
If you encounter issues:
1. Verify plugin is enabled in Plugin Manager
2. Check note tags are typed exactly as documented (case-sensitive)
3. Ensure state IDs referenced in notes actually exist
4. Test in a fresh battle (stacks reset each battle)
5. Check plugin load order if using other battle plugins

### Future Features
Potential additions for future versions:
- Visual stack indicators in battle UI
- Conditional passive activation (HP thresholds, equipment requirements)
- Passive skill trees with prerequisites
- Custom formula support for regeneration
- On-damage and on-kill trigger effects
- Passive skill leveling system

## 📄 Additional Notes

### Tips for Best Results
- Use descriptive skill names to remind players what passives do
- Combine regeneration with offensive passives for balanced builds
- Set appropriate stack limits to prevent overwhelming power
- Test passive combinations for balance
- Use skill descriptions to explain passive effects to players

### Design Guidelines
- **Regeneration:** 3-5% is moderate, 10%+ is very strong
- **Stack Limits:** 3-5 stacks is balanced, 10+ can become extreme
- **State Chances:** 25-50% feels impactful without being guaranteed
- **Battle Start Buffs:** Keep modest (+10-20%) to avoid trivializing early turns

---

Made with ❤️ for the RPG Maker MZ community
