# ReplayableEvents.js

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)

## The Problem

RPG Maker MZ events are **one-and-done by default**. The standard workaround for making an event repeatable is to use Self Switches — flip Self Switch A to ON at the end of page 1 to move to page 2, and then somehow reset it back via another event, a parallel process, or a convoluted multi-page setup.

This gets messy fast:
- You need at least 2 pages per event just to handle the "done" state
- Resetting requires either a separate event or a plugin command called from elsewhere
- For infinitely repeatable events (NPC dialogue, repeatable puzzles, cutscene triggers) the page juggling adds up quickly
- There is no built-in way to tell an event "just reset yourself when you're done"

---

## The Solution

**ReplayableEvents.js** adds a single notetag that makes any event reset itself the moment it finishes running.

No extra pages. No self switch management. No parallel events. Just add `<replayable>` to the event's note field and it will reset all its own Self Switches (A, B, C, D) back to OFF automatically after every interaction — ready to run again from scratch, infinitely.

**Features:**
- One notetag does everything — `<replayable>`
- Resets Self Switches A, B, C, and D automatically on event end
- Works on any event type: NPC dialogue, chests, puzzles, cutscene triggers
- Infinite replays — no turn limit
- Zero parallel events — no performance cost
- Game Switches and Variables set by the event are **not** touched

---

## Installation

1. Copy `ReplayableEvents.js` into your project's `js/plugins/` folder
2. Open RPG Maker MZ and go to **Tools → Plugin Manager**
3. Add `ReplayableEvents` to your plugin list
4. Enable it — no parameters to configure

---

## How It Works

When an event with `<replayable>` in its note finishes running, the plugin automatically sets Self Switches A, B, C, and D for that event back to `false`. The event then refreshes itself, snapping back to whichever page would naturally be active with all self switches OFF — which in most cases is page 1.

### Flow Diagram

```
[Player interacts with <replayable> event]
              ↓
   [Event runs normally — page 1]
              ↓
      [Event finishes]
              ↓
[Plugin resets Self Switches A, B, C, D → OFF]
              ↓
      [Event refreshes → back to page 1]
              ↓
[Player interacts again → same event runs again]
```

---

## Usage

### Step 1 — Add the notetag

Open the event in the RPG Maker MZ editor. In the **Note** field (top right of the event editor), add:

```
<replayable>
```

That's it. The event will now reset itself every time it finishes.

### Step 2 — Build your event normally

Design your event pages exactly as you normally would. Use Self Switches if needed for page transitions within a single run — they'll be cleared automatically when the event ends.

---

## Examples

### Repeatable NPC Dialogue

An NPC that always says fresh dialogue every time you talk to them. Normally you'd need to avoid Self Switches entirely or reset them manually.

```
Event Note: <replayable>

Page 1:
  ◆ Text: "Hello traveller! Safe roads to you."
  ◆ Self Switch A = ON  ← optional, if you have a page 2
```

After the event ends, Self Switch A is automatically cleared — talk to the NPC again and page 1 runs fresh.

---

### Repeatable Chest / Loot Respawn

A chest that respawns its contents every time the player interacts with it. Useful for training areas, repeatable dungeons, or resource nodes.

```
Event Note: <replayable>

Page 1 (chest closed graphic):
  ◆ Text: "You found a Potion!"
  ◆ Gain Item: Potion ×1
  ◆ Self Switch A = ON

Page 2 (chest open graphic, condition: Self Switch A is ON):
  ← This page would normally lock the chest forever.
     With <replayable>, Self Switch A resets after the event ends,
     so the player always sees page 1 on the next interaction.
```

---

### Repeatable Cutscene Trigger

A floor tile or object that plays a cutscene every time the player steps on it or interacts with it — useful for tutorial zones, arena intros, or story replays.

```
Event Note: <replayable>

Page 1:
  ◆ Fadeout Screen
  ◆ [Cutscene commands...]
  ◆ Fadein Screen
```

Every interaction replays the cutscene from the top.

---

## Tips

- **Self Switches vs Game Switches** — if you need a flag that *survives* the reset (e.g. a quest completion flag, a "player has seen this cutscene at least once" flag), use a regular **Game Switch** instead of a Self Switch. Game Switches are not touched by the reset.
- **Multi-page events** — the reset brings the event back to whichever page is valid when all self switches are OFF. Make sure page 1 has no Self Switch condition, or it won't be reachable after the reset.
- **Nested common events** — the reset fires when the top-level event finishes, not when a common event it called finishes. Common events called from a replayable event are not affected.
- **Trigger type** — works with all trigger types: Action Button, Player Touch, Event Touch, and Autorun.

---

## Compatibility

- **Engine:** RPG Maker MZ
- **Conflicts:** Any plugin that overrides `Game_Interpreter.prototype.terminate` may conflict. Place this plugin **below** such plugins in the Plugin Manager list.

---

## License

This project is licensed under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**.

You are free to:
- **Share**: Copy and redistribute the material in any medium or format
- **Adapt**: Remix, transform, and build upon the material for any purpose, even commercially

Under the following terms:
- **Attribution**: You must give appropriate credit to Alexandros Panagiotakopoulos

See [LICENSE](https://creativecommons.org/licenses/by/4.0/) for full details.

---

## Credits

**Created by**: Alexandros Panagiotakopoulos  
**Website**: [alexandrospanag.github.io](https://alexandrospanag.github.io)  
**Date**: June 27, 2026
