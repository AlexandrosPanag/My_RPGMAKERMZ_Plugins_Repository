# RPG Maker MZ — Skills Database Quick Reference

> **Disclaimer:** This guide was created with the assistance of **Claude Sonnet 4.6** (Anthropic). Content has been reviewed and corrected for accuracy against RPG Maker MZ's default engine behavior. Always verify against your own project's configuration.

---

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)


## 👤 Author

**Alexandros Panagiotakopoulos**

---

## The Five Zones of a Skill Entry

| Zone | Contains | What it Controls |
|------|----------|-----------------|
| **Basic Info** | Name, Icon, Description, Skill Type, Messages | Visibility, battle log text |
| **Cost** | MP Cost, TP Cost, Required Weapon Type | When the skill is available |
| **Invocation** | Speed, Success Rate, Repeat, TP Gain, Hit Type, Animation | How it fires and resolves |
| **Damage** | Type, Element, Formula, Variance, Critical | The math |
| **Effects** | States, Buffs/Debuffs, Recovery, Special | Everything else that happens |

---

## Hit Type — Three Flavours

| Type | Evaded by | Reflected by | Countered by | Notes |
|------|-----------|-------------|--------------|-------|
| **Physical Hit** | EVA | — | CNT | Uses HIT vs EVA formula |
| **Magical Hit** | MEV | MRF | — | Bypasses physical evasion |
| **Certain Hit** | Nothing | Nothing | Nothing | Success Rate still applies |

> **Key distinction:** Scope = *who* gets hit. Hit Type = *how* it resolves. They are independent.

---

## Scope — Who Gets Every Effect?

**The rule: every damage, state, buff, debuff, and recovery in the Effects tab lands on whoever Scope is targeting.**

### Enemy Scopes
| Scope | Targets |
|-------|---------|
| One Enemy | Player-selected living enemy |
| All Enemies | Every living enemy (full damage each, not split) |
| One Random Enemy | Random living enemy |
| X Random Enemies | Fires X times, each picks randomly |

### Ally Scopes
| Scope | Targets |
|-------|---------|
| One Ally | Player-selected living ally |
| All Allies | Every living ally including caster |
| One Ally (Exc. User) | Any living ally except caster |
| All Allies (Exc. User) | All living allies except caster |
| One Dead Ally | A KO'd ally — **required for revival** |
| All Dead Allies | Every KO'd ally |

### Special Scopes
| Scope | Targets |
|-------|---------|
| User | Only the caster — no target selection |
| All (Enemies + Allies) | Every living battler on the field |
| None | No target — for passive/cosmetic skills |

> ⚠️ **Most common mistake:** Putting a debuff in Effects on a skill scoped to One Ally. That debuffs your own party member, not an enemy.

---

## Repeat (Multi-Hit) — How It Works

The **Repeat** field fires the skill N times. Each repeat is a fully independent hit:
- Its own damage roll (with variance)
- Its own hit/miss check
- Its own state proc roll

```
One Enemy   × Repeat 3  → 3 hits on the same target
Random Enemy × Repeat 4  → 4 hits, each picks a random enemy
All Enemies  × Repeat 2  → every enemy hit twice (double damage total)
```

> State chances compound across hits. 30% Poison on a 5-hit skill gives 5 independent 30% rolls. Tune accordingly.

---

## Damage Types

| Type | Effect |
|------|--------|
| **HP Damage** | Subtracts from target HP — goes through element, PDR/MDR, crit, variance, guard |
| **MP Damage** | Drains target MP — useful only vs enemies with MP assigned |
| **HP Recover** | Restores HP — multiplied by target's REC s-param |
| **MP Recover** | Restores MP — also multiplied by REC |
| **HP Drain** | Damages target, heals caster by the same amount |
| **MP Drain** | Target loses MP, caster gains it |

---

## Formula Reference

Variables: `a` = attacker/caster, `b` = target. Buff multipliers are **already baked in** to `a.atk`, `b.def` etc.

```javascript
a.atk * 4 - b.def * 2          // Default physical
a.mat * 4 - b.mdf * 2          // Default magical
a.mat * 3 + 50                  // Heal (scales with MAT + flat)
(a.atk + a.mat) * 2 - b.def    // Hybrid stat
b.mhp * 0.25                    // 25% of target's max HP (Gravity)
(b.mhp - b.hp) * 0.5           // Scales with target's missing HP
a.hp * 0.1                      // Scales with caster's current HP
Math.max(0, a.atk*4 - b.def*2) // Prevent going negative explicitly
v[n]                            // Reference game variable #n
```

---

## Variance

| Value | Feel |
|-------|------|
| 0% | Perfectly consistent — best for playtesting and execution skills |
| 10% | Tight, precise |
| 20% | Default — organic feel |
| 35%+ | Wide RNG — hard to balance |

---

## Damage Calculation — Correct Order

```
1. Evaluate formula  (a.atk × 4 − b.def × 2)
   └─ Buffs/debuffs already baked into stats at this step

2. × Element Rate    (target's weakness/resistance)

3. × PDR or MDR      (physical or magic damage rate)

4. × Critical (3×)   ← before variance

5. Apply Variance    (±variance% random roll)

6. Apply Guard       (if target is guarding)

7. Reduce HP → trigger on-hit states
```

---

## Effects — Who Gets Them?

All effects go to the **Scope target**. A single skill can have multiple effects active simultaneously.

| Effect | Description |
|--------|-------------|
| **Add State** | Apply a status at X% chance. Subject to target's State Rate and LUK modifier |
| **Remove State** | Cure a specific status (set to 100% for guaranteed cure) |
| **Add Buff** | +1 stack (×1.5) or +2 stacks (×2.0) to a stat for N turns |
| **Add Debuff** | −1 stack (×0.75) or −2 stacks (×0.5) to a stat for N turns |
| **Remove Buff** | Strip positive stacks from a stat |
| **Remove Debuff** | Cleanse negative stacks from a stat |
| **Recover HP** | Flat or % of max HP restore (in addition to or instead of formula) |
| **Recover MP** | Flat or % of max MP restore |
| **Gain TP** | Give flat TP to the target |

---

## Hit & Miss — Three Layers

```
Layer 1: Success Rate (0–100%)
  └─ Auto-miss check before anything else

Layer 2: Hit Type evasion
  Physical → HIT (default 95%) vs target EVA
  Magical  → target MEV check, then MRF reflection check
  Certain  → skips both — cannot be evaded or reflected

Layer 3: State/Debuff roll (after skill lands)
  Final chance = state% × target's State Rate × LUK modifier
  (a.luk - b.luk) * 0.001 + 1
```

**To guarantee a state:** 100% state rate + Certain Hit (bypasses EVA/MEV). State Rate trait on the target can still resist it.

---

## TP Skills

- TP range: **0–100** (fixed max in default MZ)
- Fills from: taking damage, using skills (TP Gain field), TRG regen
- Resets to 0 on battle start unless actor has **Preserve TP** trait

### TP Cost Tiers

| Cost | Design Role |
|------|-------------|
| 20–30 TP | Rotation — used every 3–5 turns |
| 50 TP | Signature — once per major fight |
| 100 TP | Limit break — once if you're lucky |

### TP Gain on Damage (approximate)
`TP gained ≈ (damage / max HP) × 100 × 0.5`  
Getting hit for 20% of max HP gives roughly 10 TP.

> ⚠️ Don't let a skill generate more TP than it costs — that creates infinite loops.

---

## Balance — Standard Formula Benchmarks

**Baseline:** 100 ATK caster vs 50 DEF enemy → `a.atk * 4 - b.def * 2` = **300 damage**.  
Typical mid-game enemy HP: 1000–2000. One hit ≈ 15–30% of their HP.

### Formula Multiplier Scale

| Multiplier | Assessment |
|-----------|------------|
| ×1–2 | Too weak — chip damage only |
| ×3–4 | Normal single-target — baseline |
| ×5–6 | Strong — justify with MP/TP cost or long cooldown |
| ×8+ | Overpowered unless gated behind 100 TP or similar |

### Typically Overpowered
- High multiplier AoE (atk×6 hits all enemies)
- HP Drain on All Enemies scope
- 100% state rate on Certain Hit, cheap skill
- Full stat debuff (−2 stacks) combined with strong damage
- % max HP AoE with no cost

### Typically Too Weak
- Multiplier ×1–2 on single target
- 10% state rate on a high-cost skill
- Debuff with no damage, Physical Hit (fully resistable)
- MP Damage vs enemies with 0 MP
- Heal formula scaling from ATK instead of MAT

### AoE Compensation Rule
AoE hits every enemy for full damage — reduce the coefficient by 40–60% or double the MP cost.
```
Single target: a.mat * 4 - b.mdf * 2  at 20 MP ✅
All enemies:   a.mat * 2.5 - b.mdf    at 40 MP ✅
```

---

## Design Tips — Quick List

**Clarity**
- Write descriptions as tooltips, not lore. "Deals fire damage. 30% Poison" > flavour text.
- Mention state chances in the description if they're meaningful to strategy.
- Use Message 1 to confirm the action in the battle log.

**Variety**
- Mix reliable (100% Success Rate) and unreliable (70–80%) skills per character.
- Design each actor around a different resource loop: HP risk, MP pool, TP accumulation.
- Use state combos: one skill applies "Marked", another consumes it for bonus damage.
- Scale upgrades by changing formula coefficients, not by editing the old skill.

**Things to avoid**
- Physical Hit on a spell you want to always land (use Certain Hit instead).
- Debuff in Effects on an ally-scoped skill (it debuffs your party).
- HP Drain enemies without a clear counter strategy.
- Variance above 0% on execution or "finishing blow" skills.
- Formulas where high enemy DEF makes the result go negative (use `Math.max(0, ...)`).

**The design question for every skill:**  
> *"Why would I use this instead of a normal attack?"*  
If the answer is "always" → it's overtuned. If the answer is "I wouldn't" → it needs a niche.

---

*Quick reference for the full interactive HTML guide. See the `.html` file for interactive formula tester, TP buildup calculator, scope visualizer, and power budget breakdown.*
