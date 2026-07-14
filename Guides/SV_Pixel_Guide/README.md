# RPG Maker MZ — SV Battler Sprite Sheet Guide
> Everything you need to know about the `img/sv_actors/` sprite sheet format.

---

## The Sheet at a Glance

| Property | Value |
|---|---|
| Default sheet size | 576 × 384 px |
| Grid | **9 columns × 6 rows** |
| Default frame size | 64 × 64 px per cell |
| Total motions | **18** (3 per row × 6 rows) |
| Frames per motion | **3** |
| File location | `img/sv_actors/` |

Columns and rows are **zero-indexed** throughout this doc (col 0–8, row 0–5), which matches the grid overlay on your `001_BATTLER1_3x_grid.png`.

---

## How the Grid Is Structured

The 9 columns are split into **3 groups of 3 frames**, giving you 3 motions per row:

```
| Col 0  Col 1  Col 2 | Col 3  Col 4  Col 5 | Col 6  Col 7  Col 8 |
|   frame 1-2-3       |   frame 1-2-3       |   frame 1-2-3       |
|   MOTION A          |   MOTION B          |   MOTION C          |
```

With 6 rows that's **18 motions total**. The formula to find any motion:

```
row       = motion_index ÷ 3   (integer division)
col_start = (motion_index % 3) × 3
col_end   = col_start + 2
```

---

## Full Motion Map

| Motion # | Name | Row | Cols | Loop Type | What It Does |
|---|---|---|---|---|---|
| 0 | **walk** | 0 | 0–2 | ping-pong 🔁 | Steps forward when it's the battler's turn to act |
| 1 | **wait** | 0 | 3–5 | ping-pong 🔁 | Default idle pose while waiting |
| 2 | **chant** | 0 | 6–8 | ping-pong 🔁 | Charging / casting a magic skill |
| 3 | **guard** | 1 | 0–2 | ping-pong 🔁 | Defending / guard stance |
| 4 | **damage** | 1 | 3–5 | one-way ➡️ | Getting hit / flinch |
| 5 | **evade** | 1 | 6–8 | one-way ➡️ | Dodging an attack (miss) |
| 6 | **thrust** | 2 | 0–2 | one-way ➡️ | Stabbing attack — daggers, spears, guns |
| 7 | **swing** | 2 | 3–5 | one-way ➡️ | Slashing attack — swords, axes, clubs |
| 8 | **missile** | 2 | 6–8 | one-way ➡️ | Ranged/projectile — bows, crossbows |
| 9 | **skill** | 3 | 0–2 | one-way ➡️ | Physical special skill / combo move |
| 10 | **spell** | 3 | 3–5 | one-way ➡️ | Magic special skill / spell cast |
| 11 | **item** | 3 | 6–8 | one-way ➡️ | Using an item in battle |
| 12 | **escape** | 4 | 0–2 | ping-pong 🔁 | Running away animation |
| 13 | **victory** | 4 | 3–5 | ping-pong 🔁 | Victory pose after battle |
| 14 | **dying** | 4 | 6–8 | ping-pong 🔁 | Low HP / crisis state (loops while alive) |
| 15 | **abnormal** | 5 | 0–2 | ping-pong 🔁 | Status ailment (poison, confuse, etc.) |
| 16 | **sleep** | 5 | 3–5 | ping-pong 🔁 | Sleep / paralysis state |
| 17 | **dead** | 5 | 6–8 | one-way ➡️ | KO'd — plays once, **freezes on last frame** |

---

## Loop Types Explained

**Ping-pong 🔁** — plays frame 1→2→3→2→1→2→3... forever. Used for idle/persistent states.

**One-way ➡️** — plays frame 1→2→3 and stops (or returns to `wait`). Used for attacks, reactions, death.

---

## Your Questions Answered

### Attack animations — which cells?

| Attack Type | Motion | Row | Cols | Use When |
|---|---|---|---|---|
| Stab / Thrust | **thrust** | 2 | 0–2 | Daggers, spears, guns, claws |
| Slash / Swing | **swing** | 2 | 3–5 | Swords, axes, flails, hammers |
| Projectile | **missile** | 2 | 6–8 | Bows, crossbows, slingshots |
| Special physical | **skill** | 3 | 0–2 | Unique moves, combos |
| Spell cast | **spell** | 3 | 3–5 | Magic, summons |

> The **actual slash/projectile VFX** you see flying across the screen is a **Battle Animation** (set in the database under Animations), not drawn in the battler sheet itself. The battler sheet only controls the **character's pose** during the attack.

### Dodge animation

**evade** — Row 1, Cols 6–8. Plays when the battler dodges or the enemy misses.

### Death animation

**dead** — Row 5, Cols 6–8. One-way, freezes on the last frame (the collapsed/fallen pose).

### What about dying vs dead?

| Motion | Row | Cols | Trigger |
|---|---|---|---|
| **dying** | 4 | 6–8 | HP drops below 25% (crisis state). Loops continuously. |
| **dead** | 5 | 6–8 | HP hits 0. Plays once and holds the final frame. |

They're totally separate animations! `dying` is the "uh oh I'm almost dead" wobble. `dead` is the actual collapse.

---

### Your specific question: cols 6,3,4,5 vs 7,3,4,5 vs 8,3,4,5

You were asking about the **last 3 motions in rows 6-8** of your grid (using your 0-indexed `col,row` labeling). Let's decode them:

> **Your grid labels are `col,row`** (e.g. `6,3` = column 6, row 3).

| Your Grid Label | Motion Name | What It Is |
|---|---|---|
| `6,3` `7,3` `8,3` | **skill** (motion 9) | Physical special skill |
| `6,4` `7,4` `8,4` | *(part of dying)* | — |
| `6,5` `7,5` `8,5` | **dead** (motion 17) | KO / death collapse |

Wait — let me be precise. Your grid goes col 0–8, row 0–5:

| Your Label | Motion |
|---|---|
| cols 6–8, row 0 | **chant** |
| cols 6–8, row 1 | **evade** |
| cols 6–8, row 2 | **missile** |
| cols 6–8, row 3 | **item** |
| cols 6–8, row 4 | **dying** |
| cols 6–8, row 5 | **dead** |

So `(6,3)(7,3)(8,3)` = **item** animation. `(6,4)(7,4)(8,4)` = **dying**. `(6,5)(7,5)(8,5)` = **dead**.

---

## Weapon Overlays (Separate from Battler Sheet!)

The sword slash / bow shot / etc. that appears **on top of the battler** during attacks is NOT part of this sheet. It comes from `img/system/Weapons1.png` (and Weapons2, Weapons3). RPG Maker overlays that image automatically based on the weapon type equipped.

Default weapon-to-motion mappings:

| Weapon Type | Motion Used |
|---|---|
| Dagger, Sword, Axe, Spear, Glove | thrust / swing |
| Bow, Crossbow, Gun, Slingshot | missile |
| Staff, Rod | swing |
| None / unarmed | swing (default) |

---

## File Naming Tips

| Prefix | Effect |
|---|---|
| *(none)* | Normal battler |
| `!` | Disables the 6px upward offset (for objects on the ground) |
| `$` | Not used for sv_actors (it's a character sheet prefix) |

---

## Quick Reference — Row Summary

```
ROW 0 │ [walk]     │ [wait]     │ [chant]    │
ROW 1 │ [guard]    │ [damage]   │ [evade]    │
ROW 2 │ [thrust]   │ [swing]    │ [missile]  │  ← attack row
ROW 3 │ [skill]    │ [spell]    │ [item]     │  ← skill/item row
ROW 4 │ [escape]   │ [victory]  │ [dying]    │
ROW 5 │ [abnormal] │ [sleep]    │ [dead]     │  ← status/death row
       cols 0-2      cols 3-5     cols 6-8
```

---

## Pixel Coordinates (at 3× scale, 192×192 per frame)

At 3× the frame size is **192×192 px**. To find any frame's top-left corner:

```
x = col × 192
y = row × 192
```

Examples:
- `swing` frame 1 → col 3, row 2 → **(576, 384)**
- `dead` frame 1  → col 6, row 5 → **(1152, 960)**
- `wait` frame 2  → col 4, row 0 → **(768, 0)**

At original 1× scale (64×64): just divide all coords by 3.

---

*Made for `001_BATTLER1.png` — RPG Maker MZ SV Actor format (9×6 grid)*
