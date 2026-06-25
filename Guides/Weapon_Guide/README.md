# RPG Maker MZ — Weapons Database Quick Reference

> **Disclaimer:** This guide was created with the assistance of **Claude Sonnet 4.6** (Anthropic). Content has been reviewed and corrected for accuracy against RPG Maker MZ's default engine behavior. Always verify against your own project's configuration.

---

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)


## 👤 Author

**Alexandros Panagiotakopoulos**

## The Three Zones of a Weapon Entry

| Zone | Contains | Effect |
|------|----------|--------|
| **Top** | Name, Icon, Description, Weapon Type, Animation, Price | Labeling & equip restriction |
| **Middle** | 8 Params (MHP, MMP, ATK, DEF, MAT, MDF, AGI, LUK) | Flat stat additions |
| **Bottom** | Traits | Percentage rules, resistances, special effects |

> **Key rule:** Params are flat math (`+20 ATK`). Traits are rules (`Fire damage`, `150% ATK Rate`). Both can be on the same weapon doing completely different things.

---

## Parameters (Params) — Flat Additions

| Abbr | Full Name | Role |
|------|-----------|------|
| `MHP` | Max Hit Points | Increases max HP |
| `MMP` | Max Magic Points | Increases max MP |
| `ATK` | Attack Power | Physical damage (default formula: `a.atk * 4 - b.def * 2`) |
| `DEF` | Defense Power | Physical damage reduction |
| `MAT` | Magic Attack Power | Spell damage (formula: `a.mat * 4 - b.mdf * 2`) |
| `MDF` | Magic Defense Power | Magic damage reduction |
| `AGI` | Agility | Turn order only — **does not** affect HIT or EVA in MZ by default |
| `LUK` | Luck | Status accuracy/resistance, crit rolls |

All param bonuses from all equipped items **add together**, then stack onto the actor's base stat.

---

## Traits — Categories at a Glance

### RATE Traits (Multipliers — default 100%)

| Trait | What It Changes |
|-------|----------------|
| **Element Rate** | Damage taken from an element. `200%` = weakness, `50%` = resist, `0%` = immune, negative = absorb (healed) |
| **Debuff Rate** | How easily the *wearer's* stats get debuffed |
| **State Rate** | How easily a specific status lands *on the wearer* |
| **State Resist** | Hard on/off immunity to a status effect |
| **Parameter Rate** | Multiplies a stat by a %. Multiple sources **multiply together** (e.g. `150% × 150% = 225%`) |

### X-PARAM Traits (Additive — default 0%)

| Abbr | Full Name | Notes |
|------|-----------|-------|
| `HIT` | Hit Rate | Default actors start at 95%. Add `+5%` to reach 100% |
| `EVA` | Evasion Rate | Chance to dodge physical attacks |
| `CRI` | Critical Hit Rate | Default 4%. Adds to crit chance |
| `CEV` | Critical Evasion | Reduces crits landing on wearer |
| `MEV` | Magic Evasion | Dodge magic skills entirely |
| `MRF` | Magic Reflection | % chance to reflect magic back at caster |
| `CNT` | Counter Attack | % chance to auto-counter physical hits |
| `HRG` | HP Regeneration | % of max HP recovered per turn |
| `MRG` | MP Regeneration | % of max MP recovered per turn |
| `TRG` | TP Regeneration | % of max TP recovered per turn |

### S-PARAM Traits (Multiplicative — default 100%)

| Abbr | Full Name | Notes |
|------|-----------|-------|
| `TGR` | Target Rate | Enemy targeting priority. `200%` = tank/aggro, `0%` = ignored |
| `GRD` | Guard Effect Rate | Guard command efficiency. Default halves damage at 100% |
| `REC` | Recovery Effect Rate | Multiplies healing *received* |
| `PHA` | Pharmacology | Multiplies item healing effects |
| `MCR` | MP Cost Rate | Multiplies skill MP costs. `50%` = half-cost spells |
| `TCR` | TP Charge Rate | TP build speed |
| `PDR` | Physical Damage Rate | Global physical resistance/weakness |
| `MDR` | Magic Damage Rate | Global magic resistance/weakness |
| `FDR` | Floor Damage Rate | Damage from floor hazard tiles |
| `EXR` | Experience Rate | EXP gained multiplier |

### ATTACK Traits

| Trait | Effect |
|-------|--------|
| **Attack Element** | Adds an element to normal attacks. Stack multiple for multi-element |
| **Attack State** | X% chance to apply a status on normal attack hit |
| **Attack Speed** | Flat bonus/penalty to turn order priority |
| **Attack Times** | +1 = one extra hit per normal attack (each hit crits independently) |
| **Attack Skill** | Replaces the Attack command with a specific skill |

### SKILL / EQUIP / PARTY Traits

| Trait | Effect |
|-------|--------|
| **Add Skill Type** | Grants all skills of a category while equipped |
| **Add Skill** | Grants one specific skill while equipped |
| **Seal Skill Type** | Blocks an entire skill category |
| **Seal Skill** | Blocks one specific skill |
| **Equip Weapon/Armor** | Allows equipping a type the actor normally can't |
| **Slot Type: Dual Wield** | Shield slot becomes a second weapon slot |
| **Action Times+** | X% chance of an extra action per turn |
| **Special Flag** | Auto Battle / Guard / Substitute / Preserve TP switches |
| **Party Ability** | Party-wide passives: Encounter Half/None, Gold Double, Item Double, etc. |

---

## Buffs & Debuffs — Who Gets Them?

**The golden rule: effects apply to whoever the skill *targets*, not whoever casts it.**

```
Skill targets SELF   → you get the buff/debuff
Skill targets ENEMY  → enemy gets the buff/debuff
Skill targets ALLIES → all allies get the buff/debuff
```

### Buff/Debuff Stack Values

| Stacks | Multiplier |
|--------|-----------|
| +2 (max buff) | × 2.0 |
| +1 | × 1.5 |
| 0 (default) | × 1.0 |
| −1 | × 0.75 |
| −2 (max debuff) | × 0.5 |

Stacks cap at ±2. Going beyond just refreshes the timer. Default duration: **5 turns**.

### Weapons & Debuffs — The Correct Chain

Weapons **cannot directly apply buffs/debuffs**. The path is:

```
Weapon (Attack State trait)
  → 50% chance to apply State on hit
    → State has a Parameter Rate trait (e.g. ATK × 75%)
      → Enemy's ATK is reduced while state is active
```

---

## Damage Calculation — Correct Order of Operations

```
1. Evaluate formula (a.atk × 4 − b.def × 2)
   └─ Buff/Debuff multipliers are already baked into a.atk, b.def at this step

2. × Element Rate (target's resistance/weakness to the element)

3. × PDR or MDR (target's physical or magic damage rate)

4. × Critical multiplier (3× base) — if CRI roll succeeds
   └─ Happens BEFORE variance

5. Apply Variance (±variance% random roll)

6. Apply Guard reduction (if target is guarding)

7. Reduce HP → apply on-hit states (Attack State / skill Add State effects)
```

### What Each Weapon Part Affects

- **ATK param** → feeds into the formula at Step 1
- **Attack Element trait** → triggers Step 2
- **Attack State trait** → triggers Step 7

### Editing Formulas

Every skill has a free-form formula box. Examples:

```javascript
a.atk * 4 - b.def * 2        // Default physical
a.mat * 4 - b.mdf * 2        // Default magical
(a.atk + a.mat) * 2          // Hybrid attack
a.atk * 8 - b.def * 2        // Hard-hitting physical
```

---

## Weapon Type Field

Does exactly **two things**:

1. **Equip Restriction** — actors can only equip weapon types listed in their settings
2. **Skill Gating** — skills can require a specific weapon type to be usable

> Weapon Type names are labels you define in the **System** tab. MZ matches by ID number, not name.

---

## Common Beginner Mistakes

| Mistake | Reality |
|---------|---------|
| "AGI affects hit/evasion" | AGI only controls turn order in MZ. HIT and EVA are separate X-Params |
| "Buffs apply after PDR in the damage chain" | Buffs are baked into the stat before the formula even runs |
| "Variance is applied before the crit check" | Critical hits are applied **before** variance in MZ |
| "Two ATK Rate 150% traits give +100% ATK" | They multiply: 1.5 × 1.5 = **2.25×** ATK |
| "Weapons can directly debuff enemies" | Weapons use Attack State → State has the stat modifier |
| "Element Rate -100% means immune" | Negative Element Rate means the actor is **healed** by that element |

---

*Quick reference for the full interactive HTML guide. Covers: Params, all Trait groups (RATE, X-PARAM, S-PARAM, ATTACK, SKILL/PARTY), Buff/Debuff system, and Damage Calculation order.*
