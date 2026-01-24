# BattleHUD Plugin Documentation

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-2.0.0-green)
![License](https://img.shields.io/badge/license-CC%20BY--ND%204.0-orange)

## 👤 Author

**Alexandros Panagiotakopoulos**

---

## 📖 Overview

The BattleHUD Plugin displays animated health bars with status effects for both enemies and actors in battle. It features smooth HP drain animations, seamless looping gradient effects, and visual status indicator icons for buffs and debuffs. Actors receive additional MP and TP bars for complete resource monitoring.

---

## ✨ Features

- **Animated Health Bars** - Seamless looping gradient animations for both enemies and allies
- **Resource Bars for Actors** - HP, MP, and TP bars for party members
- **Enemy Simplicity** - Enemies display only HP bars (no MP/TP)
- **Smooth Damage Animation** - Instant damage visualization with smooth HP drain effect
- **Professional Styling** - Metallic borders, glossy effects, and depth shading
- **Configurable Parameters** - Customize bar sizes, offsets, animation speed, and visibility

---

## 📦 Installation

### Step 1: Install the Plugin

1. Save `BattleHUD.js` in your project's `js/plugins/` folder
2. Open the Plugin Manager in RPG Maker MZ
3. Add `BattleHUD` to your plugin list
4. Enable the plugin

### Step 2: Configure Parameters (Optional)

Open the Plugin Manager and adjust:
- Bar dimensions (width/height)
- Position offsets
- Animation speed
- Show/hide actor or enemy bars

---

## 📊 Plugin Parameters

### Bar Width
- **Type:** Number
- **Default:** `240`
- **Description:** Width of all health bars in pixels
- **Recommended:** 200-300 for standard resolution

### Bar Height
- **Type:** Number
- **Default:** `24`
- **Description:** Height of health bars in pixels
- **Recommended:** 20-30 for visibility

### Enemy Y Offset
- **Type:** Number
- **Range:** -200 to ∞
- **Default:** `10`
- **Description:** Vertical offset from enemy sprite (positive = below, negative = above)

### Actor Y Offset
- **Type:** Number
- **Range:** -200 to ∞
- **Default:** `50`
- **Description:** Vertical offset from actor sprite (positive = below)

### Animation Speed
- **Type:** Number
- **Default:** `2`
- **Description:** Speed of gradient animation (higher = faster shimmer effect)
- **Recommended:** 1-4 for comfortable viewing

### Show Actor Bars
- **Type:** Boolean
- **Default:** `true`
- **Description:** Toggle health, MP, and TP bars for party members

### Show Enemy Bars
- **Type:** Boolean
- **Default:** `true`
- **Description:** Toggle health bars for enemies

---

## 🎨 Visual Features

### Health Bar Components

**Enemies Display:**
- HP bar with animated gradient
- Status effect icons (buffs/debuffs)

**Actors Display:**
- HP bar with animated gradient
- MP bar below HP
- TP bar below MP
- Status effect icons (buffs/debuffs)

### Color System

The health bars automatically change color based on HP percentage:

| HP Range | Color |
|----------|-------|
| 60-100% | Green (Healthy) |
| 40-60% | Yellow-Green (Caution) |
| 20-40% | Orange (Warning) |
| 0-20% | Red (Critical) |

### Animation Effects

- **Seamless Gradient Loop** - Continuous shimmer effect that never repeats visibly
- **Instant Damage Cut** - Black area appears immediately when taking damage
- **Smooth HP Drain** - HP bar smoothly drains to actual value after damage
- **Healing Animation** - Bar smoothly fills when healing
- **Glossy Overlay** - Professional shine effect with curved highlights
- **3D Depth** - Metallic borders and shadow effects

---

## 🎯 Status Effect Display

### Buff/Debuff Icons

Status effects appear as small icon boxes below the health bar:

- **Stackable Design** - Multiple effects display side-by-side
- **Both Allies & Enemies** - Status icons appear for all battlers
- **Auto-Update** - Icons appear/disappear when effects are applied/removed
- **Compact Layout** - Designed to not obstruct battle view

### Icon Types

The plugin displays icons for:
- Attack/Defense buffs
- Speed/Magic buffs
- Poison, silence, paralysis
- Sleep, confusion, berserk
- Any custom states with icons

---

## 🎮 Gameplay Integration

### Battle Flow

1. **Battle Start** - Health bars fade in for all visible battlers
2. **Taking Damage** - Black damage area appears instantly, HP drains smoothly
3. **Healing** - Bar smoothly fills to new HP value
4. **Status Applied** - Icon appears below health bar
5. **Status Removed** - Icon disappears
6. **Death** - Bar fades out when battler is defeated

### Performance

- Lightweight sprite-based rendering
- Optimized gradient calculations
- No impact on battle performance
- Works with large enemy groups

---

## 🔧 Troubleshooting

### Health Bars Don't Appear

**Problem:** No bars visible in battle.

**Solutions:**
1. Check plugin is enabled in Plugin Manager
2. Verify "Show Actor Bars" or "Show Enemy Bars" is set to `true`
3. Ensure plugin loads AFTER core battle system plugins
4. Test with default RPG Maker MZ battle test

### Bars Positioned Incorrectly

**Problem:** Bars appear too high/low or offset.

**Solutions:**
1. Adjust "Enemy Y Offset" parameter for enemy positioning
2. Adjust "Actor Y Offset" parameter for actor positioning
3. Negative values move bars upward
4. Positive values move bars downward
5. Test with different enemy/actor sizes

### Status Icons Not Showing

**Problem:** Buff/debuff icons don't appear.

**Solutions:**
1. Verify states have icons assigned in the database
2. Check if icons are in the correct IconSet file
3. Ensure states are properly applied in battle
4. Test with default states (Poison, etc.)

### Animation Too Fast/Slow

**Problem:** Gradient shimmer is uncomfortable to watch.

**Solutions:**
1. Lower "Animation Speed" for slower effect (try 1.0)
2. Raise "Animation Speed" for faster effect (try 3-4)
3. Default 2.0 is balanced for most games
4. Very high values (5+) may cause distraction

### Bars Overlap or Too Large

**Problem:** Bars interfere with battle visuals.

**Solutions:**
1. Reduce "Bar Width" parameter (try 180-200)
2. Reduce "Bar Height" parameter (try 18-20)
3. Adjust Y offsets to move bars further from sprites
4. Consider screen resolution when sizing

---

## 🔌 Compatibility

### Compatible With:
- ✅ RPG Maker MZ (all versions)
- ✅ VisuStella Battle Core
- ✅ YEP Battle Engine (MV port)
- ✅ Most custom battle systems
- ✅ Status effect plugins

### Load Order:
- Load AFTER core battle plugins
- Load AFTER sprite management plugins
- Load BEFORE visual effect overlays

### Known Conflicts:
- May conflict with plugins that heavily modify Sprite_Enemy or Sprite_Actor
- Test with any plugin that adds custom battle HUD elements

---

## 💡 Best Practices

### Configuration Tips

1. **Bar Size** - Keep bars proportional to sprite size
2. **Offset Testing** - Test with tallest and shortest battlers
3. **Animation Speed** - Choose speed that complements battle pace
4. **Color Visibility** - Ensure colors are visible against your battle backgrounds

### Performance Optimization

- Plugin is already optimized for performance
- Large bar sizes (300+) may increase draw calls slightly
- Animation speed doesn't impact performance
- Works efficiently with 8+ enemies on screen

### Design Integration

1. Match bar style to your game's aesthetic
2. Consider disabling actor bars if using custom UI
3. Test visibility against various battle backgrounds
4. Ensure status icons are legible at chosen bar size

---

## 🎯 Advanced Usage

### Custom Status Icon Layouts

For developers wanting to customize status icon positioning, modify the `Sprite_AnimatedHealthBar` class methods related to status rendering.

### Calling from Events

The battle HUD automatically initializes during battle scenes. No event commands needed.

### Multiple Bar Styles

To create different bar styles for different enemy types, you can extend the `createAnimatedGradient` method with conditional logic based on battler properties.

---

## 📝 Technical Details

### Architecture

- **Base Class:** `Sprite_AnimatedHealthBar`
- **Enemy Integration:** Extended `Sprite_Enemy`
- **Actor Integration:** Extended `Sprite_Actor`
- **Rendering:** Canvas 2D Context with gradient animations

### Key Methods

- `createAnimatedGradient()` - Generates seamless looping color gradients
- `redraw()` - Renders bar with all visual effects
- `update()` - Handles animation and HP drain logic
- `setup()` - Initializes bar with battler data

### Animation Math

The gradient uses multiple sine wave frequencies for complex shimmer:
- Primary wave: `sin(position * 2 + offset/60)`
- Secondary wave: `sin(position * 4 + offset/40) * 0.5`
- Combined for smooth, non-repeating visual effect

---

## 📋 Examples

### Standard Battle Setup

```javascript
// Default configuration works for most games
// Just enable the plugin and test in battle
```

### Boss Battle (Larger Bars)

```javascript
// In Plugin Manager, set:
Bar Width: 300
Bar Height: 30
Enemy Y Offset: 20
Animation Speed: 3
```

### Minimal HUD (Enemies Only)

```javascript
// In Plugin Manager, set:
Show Actor Bars: false
Show Enemy Bars: true
```

### Retro Style (Small, Fast)

```javascript
// In Plugin Manager, set:
Bar Width: 180
Bar Height: 16
Animation Speed: 4
```


---

## ⚖️ License

**Copyright © 2026 Alexandros Panagiotakopoulos**

This work is licensed under the Creative Commons Attribution-NoDerivatives 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/4.0/

You are free to:
- **Share** - Copy and redistribute the material in any medium or format for any purpose, even commercially
- The licensor cannot revoke these freedoms as long as you follow the license terms

Under the following terms:
- **Attribution** - You must give appropriate credit, provide a link to the license, and indicate if changes were made
- **NoDerivatives** - If you remix, transform, or build upon the material, you may not distribute the modified material

**Free to use with attribution required.**

---

## 🙏 Credits

- Plugin Author: Alexandros Panagiotakopoulos
- Documentation: Alexandros Panagiotakopoulos


---

**Thank you for using BattleHUD!**
