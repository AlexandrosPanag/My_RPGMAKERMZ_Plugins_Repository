# ⚡ DebugPerformanceDrainIdentifier.js - Real Frame Performance Profiler

Stop guessing where your frame budget is going. Get real per-frame ms costs across every subsystem in your RPG Maker MZ game — including the PIXI render pass that every other profiler misses.

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-3.0.0-green)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)
![Type](https://img.shields.io/badge/type-DEBUG%20%2F%20Dev%20Tool-red)

> ⚠️ **Development tool only.** Remove before shipping your game.

---

## 👤 Author

**Alexandros Panagiotakopoulos**

---

## 🌟 What is DebugPerformanceDrainIdentifier?

A surgical frame-level profiler for RPG Maker MZ that tells you exactly where your 16.67ms per-frame budget is being spent. Every subsystem — game logic, sprites, characters, weather, input, audio, and the PIXI GPU render pass — is timed individually and reported as real per-frame averages with peak spike detection.

### **The Problem With Other Profilers**
- ❌ **Chrome DevTools** is powerful but overwhelming — too much noise to isolate MZ-specific systems
- ❌ **RPG Maker's built-in FPS counter** only shows the result, not the cause
- ❌ **v2 of this plugin** accumulated ms across its report interval, making healthy games look broken (91 frames × 1.7ms = 161ms printed — looked catastrophic, was fine)
- ❌ **All previous MZ profilers** hook `Scene_Base.update` only, completely missing the PIXI render pass where GPU draw calls actually happen

### **The Solution**
- ✅ **Real per-frame averages** — always comparable to the 16.67ms budget
- ✅ **PIXI Ticker hook** — captures the full frame including GPU compositing
- ✅ **Peak ms per bucket** — see spikes, not just averages
- ✅ **Automatic spike log** — records every frame over your threshold with timestamp and map name
- ✅ **Budget % bar** — instantly see if you're in trouble at a glance
- ✅ **Per-plugin breakdown** — ranked by avg ms cost

---

## 📊 What Gets Measured

| Bucket | What It Times |
|---|---|
| **PIXI Full Frame** | Full frame wall time via `PIXI.Ticker` — includes GPU render pass. Your true budget reference. |
| **Scene Logic** | `Scene_Base.update` total — all game logic combined |
| **Sprites / Spriteset** | `Spriteset_Map` and `Spriteset_Battle` update |
| **Player & Characters** | `Game_Player`, map events, vehicles |
| **Tilemap / Map** | `$gameMap.update` |
| **Parallel Events** | Parallel interpreter ticks |
| **Common Events** | Common event parallel branch |
| **Weather** | Weather sprite + `Game_Screen` weather |
| **Screen FX** | Tint, flash, shake, zoom, pictures, fades |
| **Input** | `Input` + `TouchInput` updates |
| **Audio** | `AudioManager` bgm updates |
| **Battle Events** | `BattleManager` event/phase updates |
| **Engine Core** | Scene Logic remainder after all known buckets |

> **Why two top rows?** PIXI Full Frame is your real budget usage. Scene Logic is the game-logic-only portion. The gap between them is PIXI rendering cost — invisible to every hook-based profiler.

---

## 🔍 Understanding The Report

```
⚡ PDID v3  10:37:44 AM  Sewer Dungeon  ↑00:01:28  60 FPS

  Frame Budget   ████████░░░░░░░░░░░░ 48.3% of 16.67ms  (avg 8.05ms  peak 14.22ms  over 180 frames)
  ────────────────────────────────────────────────────────────────────────────
  PIXI Full Frame        ████████░░░░░░░░░░░░░░░░░░░░  48.3%    8.052ms avg    14.220ms peak
  Scene Logic            ████░░░░░░░░░░░░░░░░░░░░░░░░  24.1%    4.018ms avg     9.100ms peak
  ────────────────────────────────────────────────────────────────────────────
  Sprites / Spriteset    ███░░░░░░░░░░░░░░░░░░░░░░░░░  18.6%    3.102ms avg     7.800ms peak
  Player & Characters    █░░░░░░░░░░░░░░░░░░░░░░░░░░░   4.2%    0.702ms avg     1.200ms peak
  Tilemap / Map          █░░░░░░░░░░░░░░░░░░░░░░░░░░░   2.1%    0.351ms avg     0.900ms peak
  Engine Core            ░░░░░░░░░░░░░░░░░░░░░░░░░░░░   0.8%    0.133ms avg     0.400ms peak
  ▶ Plugin Breakdown     (expand for per-plugin ranked table)
  ▶ Spikes (>20ms)       2 total recorded — last 2 shown
  ────────────────────────────────────────────────────────────────────────────
  180 frames sampled  |  PDID.reset() to clear  |  PDID.spike() for full spike log
```

### **Reading the colours**
| Colour | Meaning |
|---|---|
| 🟢 Green | Healthy — well within budget |
| 🔵 Blue | Low usage — no concern |
| 🟡 Yellow | Worth watching — starting to add up |
| 🟠 Orange | High — investigate if combined with other orange rows |
| 🔴 Red | Critical — this alone is eating significant frame budget |

### **The gap between PIXI Full Frame and Scene Logic**
This is your PIXI/GPU render cost. If `PIXI Full Frame` is 8ms and `Scene Logic` is 4ms, PIXI rendering itself is consuming 4ms. This gap grows when you have many sprites, large tilemaps, or heavy shader effects.

### **Peak ms vs Avg ms**
- **Avg ms** tells you the steady-state cost — what you're paying every frame
- **Peak ms** tells you the worst single frame — useful for finding hitches and stutters that averages hide

---

## 🚀 Installation

1. Drop `DEBUG_PerformanceDrainIdentifier.js` into your `js/plugins/` folder
2. Enable it in RPG Maker MZ Plugin Manager
3. Play your game — reports auto-print to the browser console every 3 seconds

**No configuration required.** Default settings work well out of the box.

---

## ⚙️ Plugin Parameters

| Parameter | Default | Description |
|---|---|---|
| **Report Interval** | `3000ms` | How often the profiler auto-prints a report |
| **Min % to Show** | `1%` | Hides buckets below this share (reduces noise) |
| **Spike Threshold** | `20ms` | Frames above this ms are recorded as spikes |
| **Bar Width** | `28` | Width of the ASCII progress bars in the report |

---

## 🛠️ Console API

All commands available directly in the browser DevTools console:

```javascript
PDID.report()    // Print an instant snapshot right now
PDID.budget()    // One-liner: current % of 16.67ms budget used
PDID.fps()       // Current rolling FPS
PDID.spike()     // Show full spike log (all frames over threshold)
PDID.reset()     // Zero all counters and start fresh
PDID.pause()     // Stop auto-reporting (counters keep accumulating)
PDID.resume()    // Restart auto-reporting
PDID.table()     // console.table of all buckets with avg/peak/budget%
PDID.plugins()   // console.table of per-plugin costs, sorted by avg ms
```

### **Quick diagnostics workflow**
```javascript
// 1. Check if you have a problem at all
PDID.budget()
// → "Frame budget: 48.3% used (avg 8.052ms / 16.667ms)  Peak: 14.220ms"  ✅ Fine

// 2. If budget is high, get a full breakdown
PDID.report()

// 3. Check which plugin is the heaviest
PDID.plugins()

// 4. Find out when and where spikes happen
PDID.spike()
// → lists every spike with timestamp and map name

// 5. Move to a different area, reset, and compare
PDID.reset()
// walk around for 10 seconds
PDID.report()
```

---

## 🔴 What "Bad" Looks Like

```
Frame Budget   ████████████████████ 143.7% of 16.67ms  ← OVER BUDGET
PIXI Full Frame   143.7%   23.95ms avg   67.00ms peak   ← red
Scene Logic        89.2%   14.87ms avg   45.00ms peak   ← red
Sprites/Spriteset  55.1%    9.18ms avg   30.00ms peak   ← red  ← investigate here
```

If `Sprites / Spriteset` is your highest sub-bucket, common causes are:
- Too many particle emitters active simultaneously (TRP_ParticleMZ)
- Minimap plugin redrawing every frame
- Multiple weather plugins stacked on top of each other
- Lighting plugin using render textures per frame

---

## ✅ What "Healthy" Looks Like

```
Frame Budget   ████████░░░░░░░░░░░░ 48.3% of 16.67ms   ← comfortable headroom
PIXI Full Frame    48.3%    8.05ms avg    14.22ms peak  ← green
Scene Logic        24.1%    4.02ms avg     9.10ms peak  ← green
Sprites/Spriteset  18.6%    3.10ms avg     7.80ms peak  ← green
```

You want `PIXI Full Frame` avg comfortably under 16.67ms with reasonable peak headroom. A budget of 40-60% is healthy for a plugin-heavy MZ game.

---

## 🔧 Compatibility

Hooks used:
- `PIXI.Ticker.shared._tick` — full frame timing
- `Scene_Base.prototype.update` — scene logic boundary
- `Scene_Boot.prototype.start` — plugin instrumentation on boot
- Various `Game_Map`, `Game_Player`, `Game_Screen`, `Spriteset_*` methods for sub-bucket timing

Works alongside all standard battle, weather, and UI plugins. Since this is a debug tool, load order doesn't matter — place it anywhere in your plugin list.

**Remove before release.** The PIXI Ticker hook and prototype wrapping add a small but measurable overhead of their own.

---

## 📄 License & Attribution

**Copyright © 2026 Alexandros Panagiotakopoulos. All Rights Reserved.**

Licensed under **Creative Commons Attribution 4.0 International License**

**You are free to:**
- ✅ **Share** — copy and redistribute in any medium or format
- ✅ **Adapt** — remix, transform, and build upon the material
- ✅ **Commercial Use** — use in commercial projects
- ✅ **Modify** — change and customize for your needs

**Under the following terms:**
- 📝 **Attribution** — Give appropriate credit and link to the license
- 📋 **Indicate Changes** — Note if you made changes
- 🚫 **No Warranty** — Provided "as is"

### Required Attribution
```
DebugPerformanceDrainIdentifier.js by Alexandros Panagiotakopoulos
Licensed under CC BY 4.0
```

---

**Copyright © 2026 Alexandros Panagiotakopoulos. All Rights Reserved.**

*Because "it feels slow" is not a bug report.*

**Happy profiling! ⚡🎮**
