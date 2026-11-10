# 💠 Animated Turn Indicator — RPG Maker MZ Plugin

<p align="center">
  <b>A crisp, lightweight, animated holo-ring that appears under the actor who is choosing an action in battle.</b>
</p>

 ![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)

<p align="center">
  <img src="https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/PIXI-GPU%20Sprites-e72264?style=for-the-badge" alt="PIXI">
  <img src="https://img.shields.io/badge/version-1.0.0-4af3ff?style=for-the-badge" alt="Version 1.0.0">
  <img src="https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-ee5522?style=for-the-badge" alt="License">
</p>

---

## 🎯 Why This Plugin?

In RPG Maker MZ's default battle system, it can be hard to tell at a glance whose turn it is when several party members are on screen. The default selection feedback is minimal, and many indicator plugins are heavy on performance because they redraw canvases every frame.

**Animated Turn Indicator** fixes that:

- ❌ No more guessing **which actor is choosing** an action
- ❌ No per-frame **canvas redraws** or texture re-uploads
- ❌ No blurry artwork on **scaled or fullscreen** windows
- ❌ No abrupt popping — transitions are smooth
- ❌ No complicated setup — **drop in, enable, done**

---

## ✨ Features

### 🔮 Holographic Ring
- Translucent elliptical platform under the active actor
- Neon **double-rim** with a white-hot core and near-edge sheen
- Dashed inner ring and faint solid inner ring for depth
- Breathing ground glow that gently pulses

### 🌊 Expanding Ripples
Two staggered ripple rings continuously expand outward and fade, synchronized with the **Pulse Speed** setting.

### ☄️ Orbiting Comets
- 0–6 comets circle the ring
- Each comet has a **fading, depth-scaled trail** (6 segments)
- Comets alternate direction and slightly vary in speed
- Comets appear larger and brighter at the front of the ring, smaller at the back

### ✨ Rising Motes
- 0–16 small glowing particles drift upward from inside the ring
- Randomized position, speed, height, and sideways wobble
- Fade in and out smoothly over their lifetime

### 🎬 Smooth Motion
- **Pop-in / fade-out** when a turn starts or ends
- **Gliding** between actors when the active actor changes
- Pixel-snapped positioning for crisp edges

### 🎨 Dynamic Coloring
- Set any hex color through the plugin parameters
- Automatically follows `ConfigManager.plumbobColor` (a hue from 0–360) if another plugin provides it
- The indicator **repaints live** when the color source changes

### ⚡ Built for Performance
| Technique | Benefit |
|---|---|
| Artwork painted **once** (and only again on color change) | No per-frame canvas work |
| Per-frame updates only move / fade pre-rendered sprites | Runs on the GPU |
| No texture re-uploads or per-frame allocations | No garbage-collection hitches |
| Shared spark texture for comets and motes | Low memory use |
| Default per-child `update()` is skipped | No redundant traversal |
| Textures rendered at 2× by default | Sharp on any screen size |

---

## 🚀 Getting Started

### Prerequisites

- **RPG Maker MZ** (any recent version)
- No other plugins required

### Installation

1. Copy `AnimatedTurnIndicator.js` into your project's `js/plugins/` folder
2. Open the **Plugin Manager** in RPG Maker MZ (`Tools → Plugin Manager`)
3. Double-click an empty row, select **AnimatedTurnIndicator**, set **Status** to **ON**
4. Adjust the parameters to taste and click **OK**
5. Start a battle test — the ring appears when an actor is selecting a command

```
YourProject/
└── js/
    └── plugins/
        └── AnimatedTurnIndicator.js
```

> The plugin name in the Plugin Manager must match the file name exactly: `AnimatedTurnIndicator`.

---

## ⚙️ Plugin Parameters

| Parameter | Type | Range | Default | Description |
|---|---|---|---|---|
| **Circle Color** | Hex string | any hex | `#4af3ff` | Indicator color. Used when no other plugin provides `ConfigManager.plumbobColor` |
| **Circle Opacity** | Number | 0 – 255 | `220` | Master opacity of the whole indicator |
| **Circle Size** | Number | 10 – 200 | `70` | Horizontal radius of the ring in pixels |
| **Pulse Speed** | Number | 1 – 10 | `3` | Speed of the pulse, ripple, and orbit animation |
| **Y Offset** | Number | -200 – 200 | `0` | Vertical offset from the actor's position (negative = up, positive = down) |
| **Orbiting Comets** | Number | 0 – 6 | `3` | Number of comets circling the ring (`0` disables) |
| **Rising Motes** | Number | 0 – 16 | `6` | Number of glowing motes drifting upward (`0` disables) |
| **Render Quality** | Number | 1 – 3 | `2` | Texture resolution multiplier |

Out-of-range or invalid values are automatically clamped to the nearest valid value, and blank values fall back to the default.

### 🎚️ Render Quality Guide

| Value | Label | Use When |
|---|---|---|
| `1` | Low | Lowest memory use, small or low-resolution windows |
| `2` | Standard | Crisp on virtually all screens *(recommended)* |
| `3` | Ultra | Large 4K or heavily scaled fullscreen displays |

### 🧪 Example Presets

| Look | Color | Size | Pulse | Comets | Motes |
|---|---|---|---|---|---|
| **Default Holo** | `#4af3ff` | 70 | 3 | 3 | 6 |
| **Minimal** | `#ffffff` | 55 | 2 | 0 | 0 |
| **Magic Circle** | `#c46bff` | 90 | 4 | 4 | 10 |
| **Fire Ring** | `#ff7a2a` | 80 | 5 | 5 | 12 |
| **Low-End Device** | `#4af3ff` | 70 | 3 | 1 | 2 |

---

## 🎨 How Coloring Works

The indicator picks its color in this order:

1. **`ConfigManager.plumbobColor`** — if defined by another plugin as a hue from `0` to `360`, the indicator derives its base and bright colors from that hue
2. **Circle Color** parameter — otherwise, the hex value you set is used, with a brighter tint automatically generated

The color source is checked every frame, but the artwork is only **repainted when the value actually changes**, so in-game color pickers update the ring instantly with no cost the rest of the time.

---

## 🧩 How It Works

```
Spriteset_Battle
 └── _battleField
      └── Sprite_TurnIndicator (inserted at the bottom, behind battlers)
           ├── Glow          (additive blend)
           ├── Disc          (platform, rims, dashed ring)
           ├── Ripples ×2    (additive blend)
           ├── Motes ×N      (additive blend)
           └── Comets ×N     (additive blend, 6-segment trails)
```

Each frame, `Spriteset_Battle` asks `BattleManager.actor()` who is currently selecting a command:

- **Actor found and alive** → the indicator fades in and glides to that actor's sprite
- **No active actor** (enemy turn, action execution, victory, etc.) → the indicator fades out and hides itself

Because the indicator is added to the bottom of the battle field, it always appears **underneath** your battlers.

---

## 📁 File Structure

```
js/plugins/
└── AnimatedTurnIndicator.js
    ├── Plugin header & parameters
    ├── Color helpers          (HSL → RGB, hex → RGB, palette resolver)
    ├── One-time painters      (glow, disc, ripple ring, spark)
    ├── Sprite_TurnIndicator   (build, repaint, per-frame tick)
    └── Spriteset_Battle       (creation, update hook, actor sprite lookup)
```

---

## 🔧 Compatibility Notes

- Targets **RPG Maker MZ** only (`@target MZ`)
- **No plugin commands** — everything is controlled through parameters
- **Aliased methods** (original behavior is preserved and called first):
  - `Spriteset_Battle.prototype.createLowerLayer`
  - `Spriteset_Battle.prototype.update`
- **Added methods** on `Spriteset_Battle`:
  - `createTurnIndicator`
  - `updateTurnIndicator`
  - `findActorSprite`
  - `isInputting`
- ⚠️ `Spriteset_Battle.prototype.isInputting` is **defined directly** (not aliased). If another plugin defines the same method, load order matters — place this plugin accordingly
- Works with the **default side-view and front-view** battle styles as long as actor sprites are tracked in `_actorSprites`
- Plays well with plugins that set `ConfigManager.plumbobColor`

---

## 📄 License

This work is licensed under the **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License**.

[![CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

**You are free to:**
- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material

**Under the following terms:**
- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made
- **NonCommercial** — You may not use the material for commercial purposes
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license

© 2026 Alexandros Panagiotakopoulos — [alexandrospanag.github.io](https://alexandrospanag.github.io)

---

## 🙏 Acknowledgments

- Built for [RPG Maker MZ](https://www.rpgmakerweb.com/products/rpg-maker-mz) by Gotcha Gotcha Games / KADOKAWA
- Rendered with [PixiJS](https://pixijs.com/) via RPG Maker MZ's `Sprite` and `Bitmap` classes
- RPG Maker is a trademark of Gotcha Gotcha Games / KADOKAWA CORPORATION
