# BoatBoardingSystem.js

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)

## The Problem

RPG Maker MZ's default boat vehicle system has a critical flaw when used on **World Type tilesets**: once you disembark the boat, you cannot reboard it.

This happens because:
- When you disembark, the boat parks on a water tile and the player is placed on an adjacent land tile
- To reboard, the player would need to walk onto the water tile to interact with the boat — which is impossible since water tiles are impassable on foot
- Additionally, the default system gives you no control over **where** the player lands after disembarking or **where** the boat goes after boarding

There is no built-in way to fix this without a plugin.

![](https://raw.githubusercontent.com/AlexandrosPanag/My_RPGMAKERMZ_Plugins_Repository/refs/heads/main/System/BoardDockingSystem/example_for_x56_y35_x54_y41.png)

---

## The Solution

**BoatBoardingSystem.js** replaces the default boarding/disembarking system entirely with a coordinate-based dock system.

You manually define dock spots in the Plugin Manager. Each dock has explicit coordinates for every step of the boarding and disembarking flow — no guesswork, no engine magic, full control.

**Features:**
- Board and disembark via a **Yes/No prompt**
- Player and party are **hidden while on the boat**
- Pressing **No** keeps the player/boat in place without spamming the prompt
- Supports **any direction** of approach (left, right, up, down)
- Multiple docks per map, across multiple maps
- Zero parallel events — no performance cost

---

## Installation

1. Copy `BoatBoardingSystem.js` into your project's `js/plugins/` folder
2. Open RPG Maker MZ and go to **Tools → Plugin Manager**
3. Add `BoatBoardingSystem` to your plugin list
4. Configure your dock spots in the plugin parameters (see below)

---

## How It Works

Each dock entry defines **5 coordinate pairs**:

| Parameter | Description |
|---|---|
| **Map ID** | The map this dock belongs to |
| **Boat Parked X/Y** | The water tile where the boat sits waiting to be boarded |
| **Board Trigger X/Y** | The land tile the player stands on to get the "Board the boat?" prompt |
| **Enter X/Y** | Where the player + boat teleport after boarding (should be open water, away from the dock) |
| **Disembark Trigger X/Y** | The water tile that triggers the "Disembark here?" prompt when the boat is on it |
| **Exit X/Y** | The land tile the player appears on after disembarking |

### Flow Diagram

```
BOARDING
[Player walks to Board Trigger tile]
        ↓
[Prompt: "Board the boat?"]
   Yes ↓        No → nothing happens
[Player + boat teleport to Enter tile]
[Player and party become invisible]

DISEMBARKING
[Player sails boat to Disembark Trigger tile]
        ↓
[Prompt: "Disembark here?"]
   Yes ↓        No → nothing happens
[Player appears at Exit tile]
[Boat stays at Disembark Trigger tile]
[Player and party become visible]
```

---

## Tileset Setup

Make sure your water tiles are set to **○ (passable)** in the **Boat** passability tab of your tileset. Land tiles should remain **✖** for both walking and boat passability.

For **World Type** tilesets, the A1 animated water tiles control boat passability automatically — set them to ○ in the Boat tab.

---

## Example Configuration

Here is a working two-dock setup for a world map (Map ID 48) with two ports connected by sea.

### Dock 1 — Port A (boarding point)

```json
{
  "mapId": "48",
  "boatX": "54",  "boatY": "41",
  "boardX": "53", "boardY": "41",
  "enterX": "55", "enterY": "41",
  "disembarkX": "56", "disembarkY": "35",
  "exitX": "58",  "exitY": "35"
}
```

**What this means:**
- The boat sits parked at **(54, 41)** — a water tile next to the dock
- The player stands at **(53, 41)** — the land tile — to get the board prompt
- After boarding, the boat moves to **(55, 41)** — open water, away from the dock so the disembark prompt doesn't immediately fire
- Sailing to **(56, 35)** near Port B triggers the disembark prompt
- After disembarking, the player appears at **(58, 35)** on land at Port B

---

### Dock 2 — Port B (return trip)

```json
{
  "mapId": "48",
  "boatX": "56",  "boatY": "35",
  "boardX": "57", "boardY": "35",
  "enterX": "55", "enterY": "35",
  "disembarkX": "54", "disembarkY": "41",
  "exitX": "52",  "exitY": "41"
}
```

**What this means:**
- The boat parks at **(56, 35)** after the player disembarks at Port B
- The player stands at **(57, 35)** to reboard for the return trip
- After boarding, the boat moves to **(55, 35)** — open water
- Sailing to **(54, 41)** near Port A triggers the disembark prompt
- After disembarking, the player appears at **(52, 41)** on land at Port A

---

## Tips

- **Enter X/Y** should always be at least 1–2 tiles away from the Board Trigger tile, otherwise the disembark prompt fires immediately after boarding
- **Exit X/Y** should always be at least 1–2 tiles away from the Disembark Trigger tile, otherwise the board prompt fires immediately after disembarking
- You can stack multiple docks on the same map for ports with multiple berths
- Docks are one-directional by design — define two docks (one per direction) for a return trip, as shown in the example above
- The boat is invisible while the player is sailing since the player sprite is hidden — make sure your boat graphic looks good on its own

---

## Compatibility

- **Engine:** RPG Maker MZ
- **Conflicts:** Any plugin that overrides `Game_Player.prototype.getOnVehicle`, `getOffVehicle`, or `triggerAction` may conflict. Place this plugin **below** such plugins in the Plugin Manager list.

---

## License

This project is licensed under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**.

You are free to:
- **Share**: Copy and redistribute the material in any medium or format
- **Adapt**: Remix, transform, and build upon the material for any purpose, even commercially

Under the following terms:
- **Attribution**: You must give appropriate credit to Alexandros Panagiotakopoulos

See [LICENSE](https://creativecommons.org/licenses/by/4.0/) for full details.

## Credits

**Created by**: Alexandros Panagiotakopoulos  
**Website**: [alexandrospanag.github.io](https://alexandrospanag.github.io)  
**Date**: May 11, 2026

