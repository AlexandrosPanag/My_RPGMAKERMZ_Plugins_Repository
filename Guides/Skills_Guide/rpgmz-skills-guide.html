<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>RPG Maker MZ — Skills Database Guide</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;600&display=swap');

  :root {
    --bg:        #0d0f14;
    --surface:   #161a24;
    --panel:     #1d2235;
    --border:    #2a3050;
    --gold:      #c9a84c;
    --gold-dim:  #7a6130;
    --cyan:      #5ec4d6;
    --red:       #e05a6a;
    --green:     #56c97a;
    --purple:    #9f7aea;
    --orange:    #e8935a;
    --text:      #d4daf0;
    --muted:     #6e7a9f;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Inter', sans-serif;
    font-size: 15px;
    line-height: 1.7;
  }

  /* ── HEADER ── */
  header {
    background: linear-gradient(160deg, #0d0f14 0%, #0d1a20 50%, #0d0f14 100%);
    border-bottom: 1px solid var(--gold-dim);
    padding: 48px 32px 40px;
    text-align: center;
    position: relative;
    overflow: hidden;
  }
  header::before {
    content: '✦';
    position: absolute;
    font-size: 320px;
    opacity: 0.025;
    top: -80px; left: 50%;
    transform: translateX(-50%);
    pointer-events: none;
    color: var(--cyan);
  }
  header h1 {
    font-family: 'Cinzel', serif;
    font-size: clamp(24px, 5vw, 46px);
    font-weight: 900;
    color: var(--cyan);
    letter-spacing: 2px;
    text-shadow: 0 0 40px rgba(94,196,214,0.3);
    position: relative;
  }
  header p {
    margin-top: 10px;
    color: var(--muted);
    font-size: 14px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  /* ── NAV TABS ── */
  nav {
    display: flex;
    overflow-x: auto;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    scrollbar-width: none;
    gap: 2px;
    padding: 0 8px;
  }
  nav::-webkit-scrollbar { display: none; }
  nav button {
    flex-shrink: 0;
    padding: 14px 20px;
    background: none;
    border: none;
    border-bottom: 3px solid transparent;
    color: var(--muted);
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: color .2s, border-color .2s;
    white-space: nowrap;
  }
  nav button:hover { color: var(--text); }
  nav button.active {
    color: var(--cyan);
    border-bottom-color: var(--cyan);
  }

  /* ── LAYOUT ── */
  main { max-width: 900px; margin: 0 auto; padding: 40px 24px 80px; }
  section { display: none; }
  section.active { display: block; }

  /* ── TYPOGRAPHY ── */
  h2 {
    font-family: 'Cinzel', serif;
    font-size: 22px;
    color: var(--cyan);
    margin-bottom: 6px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(94,196,214,0.25);
  }
  h3 {
    font-size: 15px;
    font-weight: 600;
    color: var(--gold);
    margin: 28px 0 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  p { margin-bottom: 14px; color: var(--text); }
  strong { color: #fff; }
  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    background: rgba(94,196,214,0.1);
    color: var(--cyan);
    padding: 2px 6px;
    border-radius: 4px;
  }

  /* ── CARDS ── */
  .card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 22px 24px;
    margin-bottom: 18px;
  }
  .card-title {
    font-family: 'Cinzel', serif;
    font-size: 15px;
    color: var(--gold);
    margin-bottom: 10px;
  }

  /* ── TRAIT ROWS ── */
  .trait-row {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 16px 20px;
    margin-bottom: 10px;
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 16px;
    align-items: start;
  }
  @media (max-width: 600px) { .trait-row { grid-template-columns: 1fr; gap: 6px; } }
  .trait-tag {
    background: rgba(94,196,214,0.1);
    border: 1px solid rgba(94,196,214,0.3);
    border-radius: 5px;
    padding: 4px 10px;
    font-size: 12px;
    font-weight: 600;
    color: var(--cyan);
    text-align: center;
    font-family: 'JetBrains Mono', monospace;
  }
  .trait-tag.gold  { background: rgba(201,168,76,0.12); border-color: var(--gold-dim); color: var(--gold); }
  .trait-tag.red   { background: rgba(224,90,106,0.12); border-color: rgba(224,90,106,0.4); color: var(--red); }
  .trait-tag.green { background: rgba(86,201,122,0.12); border-color: rgba(86,201,122,0.4); color: var(--green); }
  .trait-tag.purple{ background: rgba(159,122,234,0.12); border-color: rgba(159,122,234,0.4); color: var(--purple); }
  .trait-tag.orange{ background: rgba(232,147,90,0.12); border-color: rgba(232,147,90,0.4); color: var(--orange); }
  .trait-body .trait-title { font-weight: 600; color: #fff; margin-bottom: 4px; }
  .trait-body p { font-size: 13px; margin-bottom: 0; }

  /* ── CALLOUT BOXES ── */
  .callout {
    border-radius: 8px;
    padding: 18px 20px;
    margin: 20px 0;
    border-left: 4px solid;
  }
  .callout.info  { background: rgba(94,196,214,0.08); border-color: var(--cyan); }
  .callout.warn  { background: rgba(224,90,106,0.08); border-color: var(--red); }
  .callout.tip   { background: rgba(86,201,122,0.08); border-color: var(--green); }
  .callout.gold  { background: rgba(201,168,76,0.08); border-color: var(--gold); }
  .callout.purple{ background: rgba(159,122,234,0.08); border-color: var(--purple); }
  .callout-label {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }
  .callout.info  .callout-label { color: var(--cyan); }
  .callout.warn  .callout-label { color: var(--red); }
  .callout.tip   .callout-label { color: var(--green); }
  .callout.gold  .callout-label { color: var(--gold); }
  .callout.purple .callout-label { color: var(--purple); }
  .callout p { font-size: 14px; margin-bottom: 0; }

  /* ── SCOPE GRID ── */
  .scope-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
    margin: 16px 0;
  }
  .scope-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 16px;
    border-top: 2px solid var(--border);
    transition: border-top-color .2s;
  }
  .scope-card:hover { border-top-color: var(--cyan); }
  .scope-card.enemy  { border-top-color: rgba(224,90,106,0.6); }
  .scope-card.ally   { border-top-color: rgba(86,201,122,0.6); }
  .scope-card.self   { border-top-color: rgba(201,168,76,0.6); }
  .scope-card.dead   { border-top-color: rgba(159,122,234,0.6); }
  .scope-card.all    { border-top-color: rgba(94,196,214,0.6); }
  .scope-name { font-weight: 700; color: #fff; margin-bottom: 4px; font-size: 14px; }
  .scope-who  { font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px; }
  .scope-card.enemy  .scope-who { color: var(--red); }
  .scope-card.ally   .scope-who { color: var(--green); }
  .scope-card.self   .scope-who { color: var(--gold); }
  .scope-card.dead   .scope-who { color: var(--purple); }
  .scope-card.all    .scope-who { color: var(--cyan); }
  .scope-desc { font-size: 12px; color: var(--muted); line-height: 1.5; }

  /* ── FORMULA DISPLAY ── */
  .formula-box {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px 24px;
    margin: 14px 0;
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
    text-align: center;
  }
  .formula-box.phys   { color: var(--orange); border-color: rgba(232,147,90,0.3); }
  .formula-box.magic  { color: var(--purple); border-color: rgba(159,122,234,0.3); }
  .formula-box.heal   { color: var(--green);  border-color: rgba(86,201,122,0.3); }
  .formula-box.custom { color: var(--cyan);   border-color: rgba(94,196,214,0.3); }

  /* ── PERCENT GRID ── */
  .percent-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    margin: 16px 0;
  }
  .pct-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px;
    text-align: center;
  }
  .pct-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 22px;
    font-weight: 700;
    display: block;
    margin-bottom: 4px;
  }
  .pct-val.op    { color: var(--red); }
  .pct-val.good  { color: var(--green); }
  .pct-val.weak  { color: var(--muted); }
  .pct-val.heal  { color: #56d4c9; }
  .pct-label { font-size: 11px; color: var(--muted); }

  /* ── FLOW ── */
  .flow {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
    margin: 16px 0;
  }
  .flow-box {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 10px 16px;
    font-size: 13px;
    font-weight: 600;
    text-align: center;
    min-width: 110px;
  }
  .flow-box.actor  { border-color: var(--cyan);   color: var(--cyan);   }
  .flow-box.result { border-color: var(--green);  color: var(--green);  }
  .flow-box.target { border-color: var(--red);    color: var(--red);    }
  .flow-box.skill  { border-color: var(--purple); color: var(--purple); }
  .flow-arrow { color: var(--muted); font-size: 20px; }

  /* ── POWER RATING ── */
  .power-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
    margin: 16px 0;
  }
  @media (max-width: 600px) { .power-grid { grid-template-columns: 1fr; } }
  .power-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 18px;
  }
  .power-card.op   { border-top: 3px solid var(--red);   }
  .power-card.weak { border-top: 3px solid var(--muted); }
  .power-card.good { border-top: 3px solid var(--green); }
  .power-label { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 10px; }
  .power-card.op   .power-label { color: var(--red);   }
  .power-card.weak .power-label { color: var(--muted); }
  .power-card.good .power-label { color: var(--green); }
  .power-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
    font-size: 13px;
  }
  .power-item:last-child { border-bottom: none; }
  .power-item-name { color: var(--text); }
  .power-item-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 700;
  }
  .power-card.op   .power-item-val { color: var(--red);   }
  .power-card.weak .power-item-val { color: var(--muted); }
  .power-card.good .power-item-val { color: var(--green); }

  /* ── TIPS LIST ── */
  .tip-list { list-style: none; margin: 12px 0; }
  .tip-list li {
    padding: 10px 14px;
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 6px;
    margin-bottom: 8px;
    font-size: 13px;
    display: flex;
    gap: 12px;
    align-items: flex-start;
  }
  .tip-list li .tip-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }

  /* ── INTERACTIVE CALC ── */
  .buff-demo {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 24px;
    margin: 20px 0;
  }
  .demo-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 14px;
    flex-wrap: wrap;
  }
  .demo-row label {
    font-size: 13px;
    color: var(--muted);
    min-width: 140px;
    font-weight: 600;
  }
  .demo-row input[type=range] {
    flex: 1;
    min-width: 120px;
    accent-color: var(--cyan);
  }
  .demo-row .val-display {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    font-weight: 700;
    min-width: 60px;
    text-align: right;
    color: var(--cyan);
  }
  .demo-result {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 16px;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  @media (max-width: 500px) { .demo-result { grid-template-columns: 1fr 1fr; } }
  .res-item { text-align: center; }
  .res-val {
    font-family: 'Cinzel', serif;
    font-size: 24px;
    font-weight: 700;
    color: var(--cyan);
    display: block;
  }
  .res-val.danger { color: var(--red); }
  .res-val.safe   { color: var(--green); }
  .res-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; }

  /* ── TP BAR ── */
  .tp-bar-wrap { background: var(--bg); border-radius: 6px; height: 10px; margin: 8px 0; overflow: hidden; border: 1px solid var(--border); }
  .tp-bar { height: 100%; background: linear-gradient(90deg, var(--purple), #c084fc); border-radius: 6px; transition: width .3s; }

  /* ── SECTION INTRO ── */
  .section-intro {
    color: var(--muted);
    font-size: 14px;
    margin-bottom: 28px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border);
  }

  /* ── CHIPS ── */
  .chips { display: flex; flex-wrap: wrap; gap: 8px; margin: 10px 0; }
  .chip {
    background: rgba(94,196,214,0.1);
    border: 1px solid rgba(94,196,214,0.3);
    border-radius: 20px;
    padding: 4px 14px;
    font-size: 12px;
    font-weight: 600;
    color: var(--cyan);
  }
  .chip.gold   { background: rgba(201,168,76,0.1);  border-color: rgba(201,168,76,0.3);  color: var(--gold); }
  .chip.red    { background: rgba(224,90,106,0.1);  border-color: rgba(224,90,106,0.3);  color: var(--red); }
  .chip.green  { background: rgba(86,201,122,0.1);  border-color: rgba(86,201,122,0.3);  color: var(--green); }
  .chip.purple { background: rgba(159,122,234,0.1); border-color: rgba(159,122,234,0.3); color: var(--purple); }
</style>
</head>
<body>

<header>
  <h1>✦ RPG Maker MZ — Skills Database</h1>
  <p>Complete Guide · No Plugins · Scope, State, Hits, Power &amp; Balance</p>
</header>

<nav>
  <button class="active" onclick="switchTab('overview')">Overview</button>
  <button onclick="switchTab('scope')">Scope</button>
  <button onclick="switchTab('damage')">Damage</button>
  <button onclick="switchTab('effects')">Effects</button>
  <button onclick="switchTab('hit')">Hit &amp; Miss</button>
  <button onclick="switchTab('tp')">TP Skills</button>
  <button onclick="switchTab('power')">Balance</button>
  <button onclick="switchTab('tips')">Design Tips</button>
</nav>

<main>

<!-- ═══════════════ OVERVIEW ═══════════════ -->
<section id="overview" class="active">
  <h2>The Skills Database — Big Picture</h2>
  <p class="section-intro">A skill in MZ is made of five zones: who can use it and when, what it costs, what it hits, how hard it hits, and what extra things happen. Master all five and you can build anything from a basic attack to a game-changing ultimate.</p>

  <div class="card">
    <div class="card-title">🗂 The Five Zones of a Skill</div>
    <div class="trait-row">
      <div class="trait-tag gold">BASIC INFO</div>
      <div class="trait-body">
        <div class="trait-title">Name, Icon, Description, Skill Type, Message</div>
        <p>The Skill Type gates which actors can see this skill in battle. <strong>Message 1</strong> shows when the skill is used ("Casts Fire!"). <strong>Message 2</strong> is optional, shows before the hit lands. These print to the battle log.</p>
      </div>
    </div>
    <div class="trait-row">
      <div class="trait-tag gold">COST</div>
      <div class="trait-body">
        <div class="trait-title">MP Cost, TP Cost, Required Weapon Type</div>
        <p>A skill can cost MP, TP, both, or nothing. <strong>Required Weapon Type</strong> greys out the skill unless the actor has that weapon equipped. Both costs are paid at the moment of execution, not at the start of the turn.</p>
      </div>
    </div>
    <div class="trait-row">
      <div class="trait-tag gold">INVOCATION</div>
      <div class="trait-body">
        <div class="trait-title">Speed, Success Rate, Repeat, TP Gain, Hit Type, Animation</div>
        <p>Speed adjusts turn order for this skill specifically. Repeat sets how many times it fires. Success Rate is the base accuracy before hit/evasion calculations. TP Gain is how much TP the user earns after using it.</p>
      </div>
    </div>
    <div class="trait-row">
      <div class="trait-tag gold">DAMAGE</div>
      <div class="trait-body">
        <div class="trait-title">Type, Element, Formula, Variance, Critical</div>
        <p>The damage section is where the actual math happens. You set whether it does HP or MP damage, which element, write the formula, and toggle whether crits can proc. This is the section the Damage Calc tab dives into.</p>
      </div>
    </div>
    <div class="trait-row">
      <div class="trait-tag gold">EFFECTS</div>
      <div class="trait-body">
        <div class="trait-title">States, Buffs/Debuffs, Recovery, Special</div>
        <p>Things that happen in addition to or instead of damage. Apply states (poison, sleep), add or remove buffs/debuffs, recover HP/MP, gain extra TP. A skill can have multiple effects at once. These apply to the <strong>target</strong>.</p>
      </div>
    </div>
  </div>

  <div class="callout gold">
    <div class="callout-label">🔑 The Single Most Important Concept</div>
    <p><strong>Scope determines everything.</strong> Every effect — damage, states, buffs, debuffs — applies to whoever the skill's Scope is targeting. Before asking "who gets poisoned?", ask "what does the Scope say?" That's your answer, always.</p>
  </div>

  <h3>Hit Type — Physical vs Magical vs Certain Hit</h3>
  <div class="trait-row">
    <div class="trait-tag red">Physical Hit</div>
    <div class="trait-body">
      <div class="trait-title">Affected by HIT, EVA, and uses physical formulas</div>
      <p>Can be evaded using the target's EVA rate. Triggers Counter Attack (CNT) on the target. Affected by PDR (Physical Damage Rate). Uses <code>a.atk</code> and <code>b.def</code> in the default formula paradigm.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag purple">Magical Hit</div>
    <div class="trait-body">
      <div class="trait-title">Affected by MEV, MRF, and uses magical formulas</div>
      <p>Can be evaded by MEV (Magic Evasion) or reflected by MRF (Magic Reflection). Affected by MDR (Magic Damage Rate). Does NOT trigger counter attacks. Uses <code>a.mat</code> and <code>b.mdf</code> in typical formulas.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag green">Certain Hit</div>
    <div class="trait-body">
      <div class="trait-title">Cannot be evaded, reflected, or countered</div>
      <p>Ignores EVA, MEV, and MRF entirely. Cannot be reflected. Does not trigger CNT counters. <strong>Success Rate still applies</strong> — Certain Hit only bypasses evasion, not your own accuracy check. Use for debuffs you always want to land.</p>
    </div>
  </div>

  <div class="callout info">
    <div class="callout-label">ℹ️ Scope vs Hit Type — Two Different Things</div>
    <p><strong>Scope</strong> = who gets targeted. <strong>Hit Type</strong> = how the hit is resolved. A skill can target All Enemies (scope) while being a Magical Hit (type). Both settings are completely independent.</p>
  </div>
</section>

<!-- ═══════════════ SCOPE ═══════════════ -->
<section id="scope">
  <h2>Scope — Who Gets Hit?</h2>
  <p class="section-intro">Scope is the single field that determines who every effect lands on. Get this right and the whole skill makes sense. Get it wrong and your "enemy poison" heals your party instead.</p>

  <div class="callout gold">
    <div class="callout-label">🔑 The Rule of Scope</div>
    <p>Every damage, state, buff, debuff, and recovery in the Effects tab applies to whoever the Scope targets — not the caster, not a fixed side, just: the target of this skill right now.</p>
  </div>

  <h3>Enemy Scopes</h3>
  <div class="scope-grid">
    <div class="scope-card enemy">
      <div class="scope-name">One Enemy</div>
      <div class="scope-who">⚔ Hits enemies</div>
      <div class="scope-desc">Single target. Player selects which enemy. Most common for single-target attacks and single-target debuffs.</div>
    </div>
    <div class="scope-card enemy">
      <div class="scope-name">All Enemies</div>
      <div class="scope-who">⚔ Hits enemies</div>
      <div class="scope-desc">Hits every living enemy. Damage is not split — each enemy takes the full formula result. Great for AoE attacks.</div>
    </div>
    <div class="scope-card enemy">
      <div class="scope-name">One Random Enemy</div>
      <div class="scope-who">⚔ Hits enemies</div>
      <div class="scope-desc">Picks a random living enemy. Combines with Repeat for multi-hit random attacks — each hit picks independently, so the same target can be hit multiple times.</div>
    </div>
    <div class="scope-card enemy">
      <div class="scope-name">X Random Enemies</div>
      <div class="scope-who">⚔ Hits enemies</div>
      <div class="scope-desc">Fires X times at random enemies. The number is set by the Repeat field. Each hit is independent — useful for multi-hit scatter attacks.</div>
    </div>
  </div>

  <h3>Ally Scopes</h3>
  <div class="scope-grid">
    <div class="scope-card ally">
      <div class="scope-name">One Ally</div>
      <div class="scope-who">💚 Hits allies</div>
      <div class="scope-desc">Single living ally. Player selects which one. Use for single-target heals, single-target buffs, or single-target revival setups.</div>
    </div>
    <div class="scope-card ally">
      <div class="scope-name">All Allies</div>
      <div class="scope-who">💚 Hits allies</div>
      <div class="scope-desc">Every living ally, including the caster. Each ally receives the full effect. Use for party heals and party buffs.</div>
    </div>
    <div class="scope-card ally">
      <div class="scope-name">One Ally (Exc. User)</div>
      <div class="scope-who">💚 Hits allies</div>
      <div class="scope-desc">Any living ally that is NOT the caster. For support skills where you can't target yourself — fits certain "transfer" mechanics.</div>
    </div>
    <div class="scope-card ally">
      <div class="scope-name">All Allies (Exc. User)</div>
      <div class="scope-who">💚 Hits allies</div>
      <div class="scope-desc">Every living ally except the caster. Good for a bard-style buff that benefits others but not self.</div>
    </div>
    <div class="scope-card dead">
      <div class="scope-name">One Dead Ally</div>
      <div class="scope-who">💀 Revive scope</div>
      <div class="scope-desc">Targets a KO'd (dead) ally only. Required for revival skills — if you use a normal Ally scope on a dead actor, nothing happens.</div>
    </div>
    <div class="scope-card dead">
      <div class="scope-name">All Dead Allies</div>
      <div class="scope-who">💀 Revive scope</div>
      <div class="scope-desc">Revives everyone who is KO'd. Combine with a Recover HP effect to restore some HP on revival, or they come back at 1 HP.</div>
    </div>
  </div>

  <h3>Self and Special Scopes</h3>
  <div class="scope-grid">
    <div class="scope-card self">
      <div class="scope-name">User</div>
      <div class="scope-who">✦ Hits caster only</div>
      <div class="scope-desc">Only the user of the skill. Perfect for self-buffs, self-heals, and skills that charge or transform the caster. No target selection required.</div>
    </div>
    <div class="scope-card all">
      <div class="scope-name">All (Enemies + Allies)</div>
      <div class="scope-who">☄ Hits everyone</div>
      <div class="scope-desc">Hits every living battler on the field — enemies AND allies. Use sparingly. Friendly fire damage skills, debuffs that catch everyone, or field-wide effects.</div>
    </div>
    <div class="scope-card self">
      <div class="scope-name">None</div>
      <div class="scope-who">✦ No target</div>
      <div class="scope-desc">No target is selected and no damage or state is applied. Used for purely cosmetic skills, escape-type abilities, or skills that work via traits rather than effects.</div>
    </div>
  </div>

  <div class="callout warn">
    <div class="callout-label">⚠️ The Most Common Scope Mistake</div>
    <p>Putting a <strong>debuff or negative state in the Effects tab</strong> on a skill scoped to <strong>One Ally</strong> — you'll debuff your own party member, not the enemy. Always set scope to match the intent of the effect. Allies get healed/buffed; enemies get damaged/debuffed.</p>
  </div>

  <h3>How Scope Interacts with Multi-Hit (Repeat)</h3>
  <div class="card">
    <div class="card-title">🔁 Repeat Field — Hit Count</div>
    <p>The <strong>Repeat</strong> field (in the Invocation section) sets how many times the skill fires. Each repeat is a separate hit, with its own damage roll, its own hit/miss check, and its own state application roll.</p>
    <div class="trait-row" style="margin-top:12px">
      <div class="trait-tag">One Enemy × Repeat 3</div>
      <div class="trait-body">
        <div class="trait-title">3 hits on the SAME enemy</div>
        <p>All three hits land on the selected target. Each hit rolls damage and state chance separately. Great for combo-style physical attacks.</p>
      </div>
    </div>
    <div class="trait-row">
      <div class="trait-tag">Random Enemy × Repeat 4</div>
      <div class="trait-body">
        <div class="trait-title">4 hits on RANDOM enemies</div>
        <p>Each hit picks a random target independently. The same enemy can be hit multiple times. Shotgun or spray-style attacks.</p>
      </div>
    </div>
    <div class="trait-row">
      <div class="trait-tag">All Enemies × Repeat 2</div>
      <div class="trait-body">
        <div class="trait-title">Hits all enemies TWICE</div>
        <p>Every enemy gets hit twice. Total damage output is doubled — be careful with balance here. Consider reducing the formula coefficient.</p>
      </div>
    </div>
    <div class="callout tip" style="margin-top:14px">
      <div class="callout-label">✅ Multi-hit State Stacking</div>
      <p>If your skill has a 30% chance to inflict Poison and fires 5 times, the first hit has a 30% chance. If it misses, the second hit gets another independent 30% chance. More hits = more chances to land a state. Factor this into balance.</p>
    </div>
  </div>
</section>

<!-- ═══════════════ DAMAGE ═══════════════ -->
<section id="damage">
  <h2>Damage — Type, Formula &amp; Variance</h2>
  <p class="section-intro">The damage section defines what the skill does mathematically. Understanding these fields is the difference between a skill that works as intended and one that accidentally one-shots bosses or tickles enemies.</p>

  <h3>Damage Type — What Gets Reduced?</h3>
  <div class="trait-row">
    <div class="trait-tag red">HP Damage</div>
    <div class="trait-body">
      <div class="trait-title">Reduces target's current HP</div>
      <p>The most common type. Result of the formula is subtracted from HP. Goes through element rate, PDR/MDR, crit, variance, and guard in that order.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag purple">MP Damage</div>
    <div class="trait-body">
      <div class="trait-title">Drains the target's MP pool</div>
      <p>Does no HP damage. Useful for a Silence or Mana Drain concept. Works against enemies with MP-based skills, but most enemies in default MZ have MP = 0, so check enemy MP values first.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag green">HP Recover</div>
    <div class="trait-body">
      <div class="trait-title">Restores HP to the target</div>
      <p>Negative formula values go through the <strong>REC (Recovery Effect Rate)</strong> modifier of the target. This means the REC s-param multiplies how much healing is received. Write your formula as a positive number for healing.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag green">MP Recover</div>
    <div class="trait-body">
      <div class="trait-title">Restores MP to the target</div>
      <p>Restores MP instead of HP. Also goes through REC. The Ether / Elixir type skill. The formula can reference <code>a.mat</code> for scaling mana-restore staves.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag orange">HP Drain</div>
    <div class="trait-body">
      <div class="trait-title">Damages target, heals caster by the same amount</div>
      <p>The formula result is subtracted from the target's HP and added to the caster's HP. The Drain/Absorb type. The heal is capped at the caster's max HP. Very strong — factor this into balance.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag orange">MP Drain</div>
    <div class="trait-body">
      <div class="trait-title">Drains MP from target, gives it to caster</div>
      <p>Target loses MP, caster gains it. Useful for a Mana Siphon mechanic. Again, only useful against enemies who have MP assigned in their database entry.</p>
    </div>
  </div>

  <h3>The Formula Field — Writing Damage</h3>
  <p>The formula is a JavaScript expression. <code>a</code> = the attacker/caster, <code>b</code> = the target. You can access any stat using dot notation.</p>

  <div class="formula-box phys">a.atk * 4 - b.def * 2</div>
  <p style="text-align:center; font-size:13px; color:var(--muted); margin-top:-8px">Default physical attack formula</p>

  <div class="formula-box magic">a.mat * 4 - b.mdf * 2</div>
  <p style="text-align:center; font-size:13px; color:var(--muted); margin-top:-8px">Default magic attack formula</p>

  <div class="formula-box heal">a.mat * 3 + 50</div>
  <p style="text-align:center; font-size:13px; color:var(--muted); margin-top:-8px">Example heal formula (scales with MAT, flat bonus)</p>

  <div class="formula-box custom">(a.atk + a.mat) * 2 - b.def</div>
  <p style="text-align:center; font-size:13px; color:var(--muted); margin-top:-8px">Hybrid stat skill using both ATK and MAT</p>

  <h3>Available Formula Variables</h3>
  <div class="card">
    <div class="card-title">📐 What You Can Use in Formulas</div>
    <div class="chips">
      <span class="chip">a.atk</span>
      <span class="chip">a.def</span>
      <span class="chip">a.mat</span>
      <span class="chip">a.mdf</span>
      <span class="chip">a.agi</span>
      <span class="chip">a.luk</span>
      <span class="chip">a.hp</span>
      <span class="chip">a.mp</span>
      <span class="chip">a.tp</span>
      <span class="chip">a.mhp</span>
      <span class="chip">a.mmp</span>
      <span class="chip">b.atk</span>
      <span class="chip">b.def</span>
      <span class="chip">b.mat</span>
      <span class="chip">b.mdf</span>
      <span class="chip">b.hp</span>
      <span class="chip">b.mhp</span>
      <span class="chip">v[n]</span>
    </div>
    <p style="margin-top:12px; font-size:13px"><code>v[n]</code> accesses game variable #n. This lets you scale damage from story progress, boss phase states, or any runtime value you've stored. All the above work for both <code>a</code> and <code>b</code>. Buff/debuff multipliers are already applied — <code>a.atk</code> is the buffed value.</p>
  </div>

  <h3>Interesting Formula Patterns</h3>
  <div class="trait-row">
    <div class="trait-tag">% of Max HP</div>
    <div class="trait-body">
      <div class="trait-title">Percent-based damage, scales with target's HP</div>
      <p><code>b.mhp * 0.25</code> — always deals 25% of the target's max HP, regardless of any stats. Great for "Gravity"-type spells. Not affected by ATK/DEF at all.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag">Missing HP</div>
    <div class="trait-body">
      <div class="trait-title">Hits harder when target is injured</div>
      <p><code>(b.mhp - b.hp) * 0.5</code> — deals damage based on how much HP the target is missing. Executes low-HP enemies; weak against healthy targets. Classic "Finishing Blow" design.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag">Current HP</div>
    <div class="trait-body">
      <div class="trait-title">Scales with caster's own health</div>
      <p><code>a.hp * 0.1</code> — deals damage equal to 10% of the CASTER's current HP. Risk-reward design: weaker when injured, stronger when healthy. Or invert it — a "Desperate Attack" that hits harder the lower your HP is.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag">Flat Damage</div>
    <div class="trait-body">
      <div class="trait-title">Ignores all stats entirely</div>
      <p><code>500</code> — always deals exactly 500 damage (before variance, element, and guard). Completely stat-agnostic. Useful for traps, environmental hazards, or ultra-late-game abilities where DEF scaling is irrelevant.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag">Math.max</div>
    <div class="trait-body">
      <div class="trait-title">Prevent a formula from going negative</div>
      <p><code>Math.max(0, a.atk * 4 - b.def * 2)</code> — if the target's DEF would make the formula negative, it floors to 0 instead of healing them. MZ clamps to 0 internally on damage types anyway, but this is explicit and safe.</p>
    </div>
  </div>

  <h3>Variance — The Random Spread</h3>
  <p>Variance is a percentage that creates a random range around the base damage. Set to <strong>20%</strong> (the default), a 100-damage skill can hit anywhere from 80 to 120. Set to 0% for perfectly consistent, deterministic damage.</p>

  <div class="percent-grid">
    <div class="pct-card">
      <span class="pct-val good">0%</span>
      <div class="pct-label">Consistent — great for balance testing</div>
    </div>
    <div class="pct-card">
      <span class="pct-val good">10%</span>
      <div class="pct-label">Tight spread — feels precise</div>
    </div>
    <div class="pct-card">
      <span class="pct-val good">20%</span>
      <div class="pct-label">Default — feels organic</div>
    </div>
    <div class="pct-card">
      <span class="pct-val op">35%+</span>
      <div class="pct-label">Wide — RNG-heavy, hard to balance</div>
    </div>
  </div>

  <div class="callout tip">
    <div class="callout-label">✅ Tip: Set Variance to 0 When Playtesting Balance</div>
    <p>Variance makes it hard to know if your formulas are right during development. Set to 0% while balancing, then restore your preferred feel at the end. This also applies to boss skills — you want predictable threat, not a boss that sometimes one-shots by chance.</p>
  </div>

  <h3>Critical Hits</h3>
  <p>The <strong>Critical</strong> checkbox on the skill enables or disables the possibility of a critical hit for that skill. When enabled, the base critical rate from the attacker's CRI x-param is used.</p>
  <div class="trait-row">
    <div class="trait-tag green">Critical ON</div>
    <div class="trait-body">
      <div class="trait-title">CRI roll happens — default 3× damage on success</div>
      <p>The attacker's CRI rate is checked (default actors start at 4%). If it lands, damage is multiplied by ~3 before variance. The target's CEV (Critical Evasion) can reduce this. Enable on physical attacks and high-risk skills.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag red">Critical OFF</div>
    <div class="trait-body">
      <div class="trait-title">No crit possible — consistent damage</div>
      <p>The skill can never crit, regardless of the actor's CRI rate. Turn this off for healing skills, guaranteed-damage abilities, and skill effects where a sudden 3× spike would break gameplay.</p>
    </div>
  </div>

  <h3>Interactive Formula Tester</h3>
  <div class="buff-demo">
    <div class="demo-row">
      <label>Caster ATK</label>
      <input type="range" id="sk-atk" min="1" max="400" value="100" oninput="calcSkill()">
      <span class="val-display" id="sk-atk-v">100</span>
    </div>
    <div class="demo-row">
      <label>Caster MAT</label>
      <input type="range" id="sk-mat" min="1" max="400" value="100" oninput="calcSkill()">
      <span class="val-display" id="sk-mat-v">100</span>
    </div>
    <div class="demo-row">
      <label>Target DEF</label>
      <input type="range" id="sk-def" min="0" max="400" value="50" oninput="calcSkill()">
      <span class="val-display" id="sk-def-v">50</span>
    </div>
    <div class="demo-row">
      <label>Target MDF</label>
      <input type="range" id="sk-mdf" min="0" max="400" value="50" oninput="calcSkill()">
      <span class="val-display" id="sk-mdf-v">50</span>
    </div>
    <div class="demo-row">
      <label>Target Max HP</label>
      <input type="range" id="sk-mhp" min="100" max="5000" value="1000" step="50" oninput="calcSkill()">
      <span class="val-display" id="sk-mhp-v">1000</span>
    </div>
    <div class="demo-result">
      <div class="res-item">
        <span class="res-val" id="sk-phys">300</span>
        <span class="res-label">Physical (atk×4−def×2)</span>
      </div>
      <div class="res-item">
        <span class="res-val" id="sk-magic">300</span>
        <span class="res-label">Magic (mat×4−mdf×2)</span>
      </div>
      <div class="res-item">
        <span class="res-val" id="sk-strong">600</span>
        <span class="res-label">Strong (atk×8−def×2)</span>
      </div>
      <div class="res-item">
        <span class="res-val" id="sk-grav">250</span>
        <span class="res-label">Gravity (mhp×25%)</span>
      </div>
      <div class="res-item">
        <span class="res-val" id="sk-pct">30%</span>
        <span class="res-label">% of Target's Max HP</span>
      </div>
      <div class="res-item">
        <span class="res-val" id="sk-heal">350</span>
        <span class="res-label">Heal (mat×3+50)</span>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════ EFFECTS ═══════════════ -->
<section id="effects">
  <h2>Effects — States, Buffs &amp; Recovery</h2>
  <p class="section-intro">Effects are things that happen in addition to or instead of damage. They live in the Effects tab of the skill. Every effect applies to whoever the Scope is targeting — always.</p>

  <div class="callout gold">
    <div class="callout-label">🔑 Who Gets the Effect?</div>
    <p>The effect goes to the <strong>target of the skill, as defined by the Scope</strong>. "Add State: Poison" on a skill scoped to One Enemy poisons the enemy. The same effect on a skill scoped to One Ally poisons your ally. The effect itself doesn't care who it lands on — Scope decides that.</p>
  </div>

  <h3>State Effects — Apply &amp; Remove</h3>
  <div class="trait-row">
    <div class="trait-tag red">Add State</div>
    <div class="trait-body">
      <div class="trait-title">Apply a status to the target, with a success chance</div>
      <p>You pick a State from your States database and set a percentage (0–100%). This is the base chance <em>before</em> the target's State Rate trait and LUK modifier. At 100% on a Certain Hit skill, it always lands. On a Physical/Magical hit, State Rate and LUK still adjust it.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag green">Remove State</div>
    <div class="trait-body">
      <div class="trait-title">Cure a specific status on the target</div>
      <p>Removes a specific state from the target. Set to 100% to guarantee the cure. Use this for Antidote (remove Poison), Remedy (remove Sleep), etc. Works on allies — scope to One Ally to cure a party member.</p>
    </div>
  </div>

  <div class="callout info">
    <div class="callout-label">ℹ️ How State Success Rate Is Calculated</div>
    <p>Final chance = Skill's state % × target's State Rate for that state × LUK modifier. LUK modifier = <code>(a.luk - b.luk) * 0.001 + 1</code>. High LUK helps land statuses and resists them. At 100% on a Certain Hit skill, the full formula applies but evasion is bypassed.</p>
  </div>

  <h3>Buff &amp; Debuff Effects</h3>
  <div class="trait-row">
    <div class="trait-tag green">Add Buff</div>
    <div class="trait-body">
      <div class="trait-title">Temporarily boost one of the target's 8 stats</div>
      <p>Choose a stat and how many turns. +1 stack = ×1.5. +2 stacks = ×2.0. Each additional stack beyond 2 is capped and just refreshes the timer. Buff the target of the scope — so a "Haste" skill scoped to One Ally buffs that ally's AGI.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag red">Add Debuff</div>
    <div class="trait-body">
      <div class="trait-title">Temporarily weaken one of the target's 8 stats</div>
      <p>−1 stack = ×0.75. −2 stacks = ×0.5. Same turn-based timer. Subject to the target's Debuff Rate trait for that stat — if they have 0% Debuff Rate on DEF, your DEF debuff won't land. Scope this to One Enemy to weaken enemies.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag">Remove Buff</div>
    <div class="trait-body">
      <div class="trait-title">Strip a buff from the target</div>
      <p>Removes all positive stacks of the chosen stat buff. Useful on enemies who buff themselves — a "Dispel" skill removes their ATK UP etc. Scope this to One Enemy to strip their buffs.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag">Remove Debuff</div>
    <div class="trait-body">
      <div class="trait-title">Cleanse a debuff from the target</div>
      <p>Removes negative stacks of a stat debuff. Cleanse ATK DOWN, DEF DOWN, etc. from allies. Scope to One Ally or All Allies for a support dispel skill.</p>
    </div>
  </div>

  <h3>Recovery Effects</h3>
  <div class="trait-row">
    <div class="trait-tag green">Recover HP</div>
    <div class="trait-body">
      <div class="trait-title">Restore HP — by flat amount or percentage</div>
      <p>In addition to or instead of a formula heal, you can add a flat HP restore or a percentage of max HP in the Effects tab. Example: "Recover 25% of max HP" alongside a formula. Both apply. Good for skills that mix damage with self-recovery.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag green">Recover MP</div>
    <div class="trait-body">
      <div class="trait-title">Restore MP to the target</div>
      <p>By flat amount or percentage. Use this for Ether-type items or MP-battery skills. Separate from the Damage type "MP Recover" — this is an effect layered on top of something else.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag purple">Gain TP</div>
    <div class="trait-body">
      <div class="trait-title">Give TP directly to the target</div>
      <p>Grants a flat amount of TP. Useful for a "Charge" or "Focus" skill that builds TP for an ultimate. The target gets the TP, so scope to User for a self-charge, or One Ally to charge a teammate.</p>
    </div>
  </div>

  <h3>Special Effects</h3>
  <div class="trait-row">
    <div class="trait-tag orange">Escape</div>
    <div class="trait-body">
      <div class="trait-title">Forces the party to attempt escape</div>
      <p>Same as the escape action — can fail depending on AGI difference. Put this in a skill if you want a "Smoke Bomb" or "Teleport" ability that has a chance to flee. Still subject to escape restrictions.</p>
    </div>
  </div>

  <div class="callout tip">
    <div class="callout-label">✅ Stacking Multiple Effects</div>
    <p>A single skill can have dozens of effects simultaneously. An ultimate skill could: deal HP damage, apply Stun, reduce the target's DEF by 2 stacks, and give the caster 30 TP — all from one Effects tab. Each effect is processed independently in order.</p>
  </div>

  <h3>Practical Example: "Weaken Slash" — Full Setup</h3>
  <div class="card">
    <div class="card-title">⚙ Building a Skill That Hits &amp; Debuffs</div>
    <p><strong>Goal:</strong> A physical attack that damages the enemy and has a 40% chance to lower their DEF.</p>
    <div class="trait-row" style="margin-top:12px">
      <div class="trait-tag">Scope</div>
      <div class="trait-body"><p>One Enemy — targets a single enemy.</p></div>
    </div>
    <div class="trait-row">
      <div class="trait-tag">Hit Type</div>
      <div class="trait-body"><p>Physical Hit — can be evaded, triggers counters.</p></div>
    </div>
    <div class="trait-row">
      <div class="trait-tag">Damage</div>
      <div class="trait-body"><p>HP Damage, formula: <code>a.atk * 5 - b.def * 2</code>, variance 20%, critical ON.</p></div>
    </div>
    <div class="trait-row">
      <div class="trait-tag">Effect 1</div>
      <div class="trait-body"><p>Add Debuff → DEF → 40% chance. Goes to the enemy (scope is One Enemy).</p></div>
    </div>
    <div class="callout tip" style="margin-top:14px">
      <div class="callout-label">✅ Result</div>
      <p>Hits the enemy for physical damage. 40% chance to apply DEF DOWN (×0.75 DEF for the duration). Because it's a Physical Hit, the enemy's DEF Debuff Rate trait can resist it. To guarantee the debuff, change Hit Type to <strong>Certain Hit</strong> — but then it's also unblockable by EVA.</p>
    </div>
  </div>
</section>

<!-- ═══════════════ HIT & MISS ═══════════════ -->
<section id="hit">
  <h2>Hit, Miss &amp; Guaranteed Effects</h2>
  <p class="section-intro">Whether a skill lands is determined by three layers: the skill's own Success Rate, the Hit Type's evasion rules, and the attacker vs defender stats. Understanding all three lets you design precisely how reliable a skill should be.</p>

  <h3>Layer 1 — Success Rate</h3>
  <p>Every skill has a <strong>Success Rate</strong> field (0–100%). This is the base accuracy of the skill itself, checked <em>before</em> any evasion calculation. At 100%, the skill doesn't auto-miss — it still goes through the evasion check. At 95%, there's a 5% chance of a straight miss regardless of hit rate.</p>

  <div class="percent-grid">
    <div class="pct-card">
      <span class="pct-val good">100%</span>
      <div class="pct-label">Always goes to evasion check</div>
    </div>
    <div class="pct-card">
      <span class="pct-val good">95%</span>
      <div class="pct-label">5% auto-miss before EVA</div>
    </div>
    <div class="pct-card">
      <span class="pct-val weak">75%</span>
      <div class="pct-label">Unreliable — flavour only</div>
    </div>
    <div class="pct-card">
      <span class="pct-val weak">50%</span>
      <div class="pct-label">Coin flip — niche uses</div>
    </div>
  </div>

  <div class="callout warn">
    <div class="callout-label">⚠️ Success Rate ≠ Guaranteed Hit</div>
    <p>100% Success Rate does NOT mean the skill always hits. It means "don't auto-miss before checking evasion." The target's EVA (for Physical) or MEV (for Magical) still applies. To truly guarantee a hit, use <strong>Certain Hit</strong> as the Hit Type.</p>
  </div>

  <h3>Layer 2 — Hit Type &amp; Evasion</h3>
  <div class="trait-row">
    <div class="trait-tag red">Physical Hit</div>
    <div class="trait-body">
      <div class="trait-title">Hit formula: HIT rate vs EVA rate</div>
      <p>Final hit chance = attacker's <code>hit</code> x-param minus target's <code>eva</code> x-param. Default actor HIT is 95%. If a target has 20% EVA, your effective hit rate is 95% − 20% = 75% (approximately). Also subject to Success Rate check first.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag purple">Magical Hit</div>
    <div class="trait-body">
      <div class="trait-title">Hit formula: always hits unless MEV or MRF proc</div>
      <p>Magical skills don't use the HIT/EVA calculation. Instead, the target's MEV (Magic Evasion) rate is checked — if it procs, the spell misses. And MRF (Magic Reflection) can bounce it back at the caster. Both are independent checks.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag green">Certain Hit</div>
    <div class="trait-body">
      <div class="trait-title">Skips all evasion — lands unless Success Rate fails</div>
      <p>Bypasses EVA, MEV, and MRF. The only thing that can stop it is the skill's own Success Rate check. At 100% Success Rate + Certain Hit = truly guaranteed. Cannot be countered (no CNT proc), cannot be reflected.</p>
    </div>
  </div>

  <h3>Layer 3 — State &amp; Debuff Success</h3>
  <p>When a skill lands, the Effects still have their own success chance. A skill that hits does not mean its state auto-applies — each effect has its own probability roll.</p>

  <div class="flow">
    <div class="flow-box actor">Skill lands<br>(hit check passed)</div>
    <div class="flow-arrow">→</div>
    <div class="flow-box skill">State effect<br>rolls its %<br>independently</div>
    <div class="flow-arrow">→</div>
    <div class="flow-box skill">× target's<br>State Rate for<br>that status</div>
    <div class="flow-arrow">→</div>
    <div class="flow-box skill">× LUK modifier<br>(a.luk vs b.luk)</div>
    <div class="flow-arrow">→</div>
    <div class="flow-box result">State lands<br>or not</div>
  </div>

  <div class="callout info">
    <div class="callout-label">ℹ️ Making a State Guaranteed</div>
    <p>To guarantee a state always applies when the skill hits: set the state's percentage to 100% in the Effects tab, and use <strong>Certain Hit</strong> as the Hit Type. This bypasses evasion, and 100% chance ignores the LUK roll. State Rate traits can still resist it — use Certain Hit + 100% + State Resist on the skill itself via traits for absolute immunity bypass.</p>
  </div>

  <h3>Designing "Guaranteed" vs "Unreliable" Skills</h3>
  <div class="card">
    <div class="card-title">🎯 Reliability Design Patterns</div>
    <div class="trait-row" style="margin-top:12px">
      <div class="trait-tag green">Guaranteed Debuff</div>
      <div class="trait-body">
        <div class="trait-title">High cost, always applies, Certain Hit</div>
        <p>Certain Hit + 100% state rate. Strong but should cost a lot (high MP/TP, long cooldown via a state on the caster, or be boss-exclusive).</p>
      </div>
    </div>
    <div class="trait-row">
      <div class="trait-tag">Reliable Damage</div>
      <div class="trait-body">
        <div class="trait-title">100% Success Rate, Physical Hit, no crit</div>
        <p>Hits every time against low-EVA enemies, moderate damage, predictable. The bread-and-butter attack.</p>
      </div>
    </div>
    <div class="trait-row">
      <div class="trait-tag red">Gamble Skill</div>
      <div class="trait-body">
        <div class="trait-title">75% Success Rate, high damage multiplier</div>
        <p>Misses 25% of the time but hits extremely hard. Adds tension and strategic choice. Give it an exciting animation so the miss still feels meaningful.</p>
      </div>
    </div>
    <div class="trait-row">
      <div class="trait-tag orange">Debuff Spam</div>
      <div class="trait-body">
        <div class="trait-title">Low cost, 30% state rate, fast attack speed</div>
        <p>Fires multiple times per round (Repeat), each with a 30% state chance. Low individual chance, but the volume of hits makes it likely to land eventually. Design for patience.</p>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════ TP SKILLS ═══════════════ -->
<section id="tp">
  <h2>TP Skills — The Limit Break System</h2>
  <p class="section-intro">TP (Technique Points) is MZ's built-in "limit break" resource. It fills as you act and take damage, and drains to zero at battle end (unless Preserve TP is active). Designing around TP creates exciting escalation moments in battle.</p>

  <h3>How TP Works</h3>
  <div class="card">
    <div class="card-title">⚡ TP Fundamentals</div>
    <div class="trait-row" style="margin-top:8px">
      <div class="trait-tag purple">Range</div>
      <div class="trait-body"><p>TP goes from 0 to a max of <strong>100</strong> by default. This maximum is fixed in the default engine (unlike HP/MP, there are no "MTP" params).</p></div>
    </div>
    <div class="trait-row">
      <div class="trait-tag purple">Gain on Action</div>
      <div class="trait-body"><p>The <strong>TP Gain</strong> field on each skill sets how much TP the user earns after using that skill. Default attack gains a small amount. Set it to 0 for skills that shouldn't generate TP (or drain TP to use).</p></div>
    </div>
    <div class="trait-row">
      <div class="trait-tag purple">Gain on Damage</div>
      <div class="trait-body"><p>Actors gain TP when hit. The amount scales with damage taken as a percentage of max HP. Getting hit hard fills TP fast — classic limit break behavior.</p></div>
    </div>
    <div class="trait-row">
      <div class="trait-tag purple">Battle Start</div>
      <div class="trait-body"><p>TP resets to 0 at battle start (unless the actor has the <strong>Preserve TP</strong> special flag from a trait). You can also set the initial TP in actor settings or via events.</p></div>
    </div>
  </div>

  <h3>Making a TP Skill — The Setup</h3>
  <div class="trait-row">
    <div class="trait-tag purple">TP Cost</div>
    <div class="trait-body">
      <div class="trait-title">Set the TP Cost field in the skill</div>
      <p>Enter a value in the TP Cost field. The skill is greyed out until the actor has that much TP. Common costs: <strong>25 TP</strong> (moderate, usable frequently), <strong>50 TP</strong> (mid-tier), <strong>100 TP</strong> (full gauge, the true "limit break").</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag purple">TP Gain from Skill</div>
    <div class="trait-body">
      <div class="trait-title">How much TP the skill gives back after use</div>
      <p>Usually 0 for expensive TP skills (you spent it, you don't get it back). Can be a small positive if you want chain combos. Generating more TP than the skill costs creates infinite loops — avoid that.</p>
    </div>
  </div>

  <h3>TP Buildup Visualizer</h3>
  <div class="buff-demo">
    <div class="demo-row">
      <label>Damage per hit (% of max HP)</label>
      <input type="range" id="tp-dmg" min="1" max="40" value="10" oninput="calcTP()">
      <span class="val-display" id="tp-dmg-v">10%</span>
    </div>
    <div class="demo-row">
      <label>Hits before TP skill</label>
      <input type="range" id="tp-hits" min="1" max="20" value="5" oninput="calcTP()">
      <span class="val-display" id="tp-hits-v">5</span>
    </div>
    <div class="demo-row">
      <label>TP Gain per action taken</label>
      <input type="range" id="tp-gain" min="0" max="20" value="5" oninput="calcTP()">
      <span class="val-display" id="tp-gain-v">5</span>
    </div>
    <p style="font-size:13px; color:var(--muted); margin: 8px 0 14px">TP from damage ≈ damage% × 50 (engine approximation)</p>
    <div id="tp-bar-container" style="margin-bottom:16px">
      <div style="display:flex; justify-content:space-between; font-size:12px; color:var(--muted); margin-bottom:4px">
        <span>0</span><span id="tp-bar-label">TP after hits</span><span>100</span>
      </div>
      <div class="tp-bar-wrap"><div class="tp-bar" id="tp-bar" style="width:50%"></div></div>
    </div>
    <div class="demo-result">
      <div class="res-item">
        <span class="res-val" id="tp-from-dmg">25</span>
        <span class="res-label">TP from Damage</span>
      </div>
      <div class="res-item">
        <span class="res-val" id="tp-from-act">25</span>
        <span class="res-label">TP from Actions</span>
      </div>
      <div class="res-item">
        <span class="res-val" id="tp-total">50</span>
        <span class="res-label">Total TP</span>
      </div>
    </div>
  </div>

  <h3>TP Skill Design Patterns</h3>
  <div class="trait-row">
    <div class="trait-tag purple">Low Cost — 20–30 TP</div>
    <div class="trait-body">
      <div class="trait-title">Rotation skills — used frequently</div>
      <p>Moderate power-up, slightly stronger than a normal skill. Used every 3–5 turns. Great for "combo finisher" designs or skills that give a quick burst of healing.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag purple">Mid Cost — 50 TP</div>
    <div class="trait-body">
      <div class="trait-title">Signature moves — used once per fight roughly</div>
      <p>Major damage spike, powerful debuff, or party-wide effect. The actor should feel rewarded for saving up. Used in 1–2 fights per significant encounter.</p>
    </div>
  </div>
  <div class="trait-row">
    <div class="trait-tag purple">Full Gauge — 100 TP</div>
    <div class="trait-body">
      <div class="trait-title">Limit break — used once if you're lucky</div>
      <p>Massive AoE, guaranteed state, near-instant kill on weaker enemies, or a game-changing effect. Animation should be spectacular. Balance by making it strong but not game-breaking — the enemy has had 10–15 turns to attack you while you charged it.</p>
    </div>
  </div>

  <div class="callout tip">
    <div class="callout-label">✅ Preserve TP Trick</div>
    <p>If an actor has the <strong>Preserve TP</strong> special flag (from a trait on equipment or a state), their TP carries over between battles. Great for a passive skill that makes a character feel "always ready" — but be careful with balance if your game has many short fights.</p>
  </div>

  <div class="callout warn">
    <div class="callout-label">⚠️ MP + TP Dual Cost Skills</div>
    <p>You can set both an MP cost and a TP cost on the same skill. The skill is only available when the actor has <em>both</em>. Use this for ultimate skills with a dual resource gate — it makes the moment feel even more earned. But if either resource is empty, the skill is greyed out.</p>
  </div>

  <h3>Powering Up Across a Fight — Charged Skills</h3>
  <p>TP naturally creates escalating power across a fight. Here's how to design skill sets that use this arc:</p>
  <div class="card">
    <div class="card-title">📈 Example TP Skill Progression — Warrior</div>
    <div class="trait-row" style="margin-top:8px">
      <div class="trait-tag">0 TP (free)</div>
      <div class="trait-body"><p><strong>Normal Attack</strong> — gains 5 TP on use.</p></div>
    </div>
    <div class="trait-row">
      <div class="trait-tag">5 MP (cheap)</div>
      <div class="trait-body"><p><strong>Power Strike</strong> — gains 8 TP on use, slightly above normal damage.</p></div>
    </div>
    <div class="trait-row">
      <div class="trait-tag purple">25 TP</div>
      <div class="trait-body"><p><strong>War Cry</strong> — ATK UP on self (scope: User). Costs 25 TP, 0 gain.</p></div>
    </div>
    <div class="trait-row">
      <div class="trait-tag purple">50 TP</div>
      <div class="trait-body"><p><strong>Cleave</strong> — hits all enemies for <code>a.atk * 6 - b.def * 2</code>. Costs 50 TP.</p></div>
    </div>
    <div class="trait-row">
      <div class="trait-tag purple">100 TP</div>
      <div class="trait-body"><p><strong>Berserker Rage</strong> — massive single-target hit (<code>a.atk * 16 - b.def * 2</code>), guaranteed ATK DOWN on target, scope: One Enemy. The full-gauge limit break.</p></div>
    </div>
  </div>
</section>

<!-- ═══════════════ BALANCE ═══════════════ -->
<section id="power">
  <h2>Balance — Power, Weakness &amp; the Standard Formula</h2>
  <p class="section-intro">Using the default physical formula <strong>(a.atk × 4 − b.def × 2)</strong> as a baseline, here's what is considered strong, normal, and weak — so you know exactly where your designs land.</p>

  <div class="callout gold">
    <div class="callout-label">⚖ The Baseline</div>
    <p>A typical mid-game actor has around 100 ATK. A typical mid-game enemy has around 50 DEF. The default attack deals roughly <strong>300 damage</strong>. A typical enemy at this point has 1000–2000 HP. One hit = 15–30% of their HP. That's the frame of reference for everything below.</p>
  </div>

  <h3>Formula Multiplier Scale</h3>
  <div class="percent-grid">
    <div class="pct-card">
      <span class="pct-val weak">×1–2</span>
      <div class="pct-label">Weak / chip damage</div>
    </div>
    <div class="pct-card">
      <span class="pct-val good">×3–4</span>
      <div class="pct-label">Normal single-target</div>
    </div>
    <div class="pct-card">
      <span class="pct-val good">×5–6</span>
      <div class="pct-label">Strong / MP-costly</div>
    </div>
    <div class="pct-card">
      <span class="pct-val op">×8+</span>
      <div class="pct-label">OP unless gated by TP/cost</div>
    </div>
  </div>

  <div class="power-grid">
    <div class="power-card op">
      <div class="power-label">⚠ Typically Overpowered</div>
      <div class="power-item"><span class="power-item-name">High multiplier + All Enemies</span><span class="power-item-val">a.atk×6 AoE</span></div>
      <div class="power-item"><span class="power-item-name">Drain on All Enemies</span><span class="power-item-val">HP Drain AoE</span></div>
      <div class="power-item"><span class="power-item-name">Guaranteed 100% state on Any Hit type</span><span class="power-item-val">Sleep 100%</span></div>
      <div class="power-item"><span class="power-item-name">Full stat debuff (×2 stacks) + damage</span><span class="power-item-val">DEF −2 + hit</span></div>
      <div class="power-item"><span class="power-item-name">Attack Times+2 on low cost</span><span class="power-item-val">×3 hits free</span></div>
      <div class="power-item"><span class="power-item-name">% of max HP AoE with no cost</span><span class="power-item-val">25% mhp × all</span></div>
      <div class="power-item"><span class="power-item-name">Action Times+ stacking on same character</span><span class="power-item-val">Extra turns</span></div>
    </div>
    <div class="power-card weak">
      <div class="power-label">😴 Typically Too Weak</div>
      <div class="power-item"><span class="power-item-name">Low multiplier on single target</span><span class="power-item-val">a.atk×1−b.def</span></div>
      <div class="power-item"><span class="power-item-name">10% state chance on high-cost skill</span><span class="power-item-val">30 MP, 10% Poison</span></div>
      <div class="power-item"><span class="power-item-name">Debuff with no damage, Physical Hit</span><span class="power-item-val">DEF Down only</span></div>
      <div class="power-item"><span class="power-item-name">MP Damage vs enemies with 0 MP</span><span class="power-item-val">Useless</span></div>
      <div class="power-item"><span class="power-item-name">+1 buff for 1 turn, 20 MP cost</span><span class="power-item-val">Overcosted buff</span></div>
      <div class="power-item"><span class="power-item-name">Heal based on ATK stat (not MAT)</span><span class="power-item-val">Wrong stat scaling</span></div>
      <div class="power-item"><span class="power-item-name">50% Success Rate skill, normal damage</span><span class="power-item-val">Gamble, no payoff</span></div>
    </div>
  </div>

  <h3>AoE vs Single Target — The Trade-off</h3>
  <p>Any skill that hits all enemies is inherently more powerful than a single-target version, because it multiplies output by the number of enemies. Compensate accordingly:</p>
  <div class="trait-row">
    <div class="trait-tag">Single Target</div>
    <div class="trait-body"><p>Full formula, full cost. <code>a.mat * 4 - b.mdf * 2</code> at 20 MP is fair for 1 enemy.</p></div>
  </div>
  <div class="trait-row">
    <div class="trait-tag red">All Enemies</div>
    <div class="trait-body"><p>Reduce the multiplier by 40–60%, or double the MP cost. <code>a.mat * 2.5 - b.mdf</code> at 40 MP is roughly balanced if there are 3 enemies.</p></div>
  </div>

  <h3>Status Effect Balance Guide</h3>
  <div class="card">
    <div class="card-title">⚖ Status Rates vs Hit Type vs Cost</div>
    <div class="trait-row" style="margin-top:8px">
      <div class="trait-tag green">Fair</div>
      <div class="trait-body">
        <div class="trait-title">30–50% rate, Physical Hit, on a damage skill</div>
        <p>Damage + moderate state chance. Costs normal MP. The enemy has a real chance to resist it, and it's a bonus on top of damage — not the only value.</p>
      </div>
    </div>
    <div class="trait-row">
      <div class="trait-tag green">Fair</div>
      <div class="trait-body">
        <div class="trait-title">100% rate, Certain Hit, high TP cost (50–100)</div>
        <p>Guaranteed but gated by a large resource cost. Earned through gameplay. The guarantee is the payoff for the investment.</p>
      </div>
    </div>
    <div class="trait-row">
      <div class="trait-tag red">Overpowered</div>
      <div class="trait-body">
        <div class="trait-title">100% rate, Certain Hit, free or cheap skill</div>
        <p>No tradeoff. You can spam it every turn and the enemy has no agency against it. If the state does anything meaningful (Sleep, Stop, heavy debuff), this breaks combat.</p>
      </div>
    </div>
    <div class="trait-row">
      <div class="trait-tag">Boring</div>
      <div class="trait-body">
        <div class="trait-title">10–15% rate, high cost, no damage</div>
        <p>You spend resources for a low-probability effect with no guaranteed return. Players will never use it. Either raise the rate, lower the cost, or add a damage component.</p>
      </div>
    </div>
  </div>

  <h3>Multi-Hit Balance</h3>
  <div class="callout warn">
    <div class="callout-label">⚠️ Multi-Hit + Crit Is Explosive</div>
    <p>A skill with Repeat 5, a reasonable formula, and critical hits enabled can occasionally deal 5× damage if every hit crits (each hit rolls independently). Test your highest realistic crit scenario. With 20% CRI, the chance of 5 consecutive crits is ~0.03% — but in 100 fights, it will happen. Design the floor, not just the average.</p>
  </div>

  <h3>The "Power Budget" Model</h3>
  <p>Think of each skill as having a power budget. Spend it across these dimensions — but going over in multiple dimensions simultaneously is what creates broken skills:</p>
  <div class="card">
    <div class="card-title">📊 Power Budget Dimensions</div>
    <div class="trait-row" style="margin-top:8px">
      <div class="trait-tag">Damage</div>
      <div class="trait-body"><p>Raw formula coefficient. Higher = more of the budget spent.</p></div>
    </div>
    <div class="trait-row">
      <div class="trait-tag">Targeting</div>
      <div class="trait-body"><p>All Enemies costs more budget than One Enemy.</p></div>
    </div>
    <div class="trait-row">
      <div class="trait-tag">Reliability</div>
      <div class="trait-body"><p>Certain Hit + 100% state = high budget cost. Physical Hit + 40% = low.</p></div>
    </div>
    <div class="trait-row">
      <div class="trait-tag">Side Effects</div>
      <div class="trait-body"><p>Bonus state, debuff, self-buff — each is budget spent.</p></div>
    </div>
    <div class="trait-row">
      <div class="trait-tag">Resource Cost</div>
      <div class="trait-body"><p>High MP/TP cost = budget refunded. Free skills = higher base budget allotment.</p></div>
    </div>
    <div class="callout tip" style="margin-top:14px">
      <div class="callout-label">✅ The Balancing Question</div>
      <p>Ask: "What does this skill do that a normal attack can't?" If the answer is "everything, and more" at the same cost — it's overtuned. If the answer is "one thing, clearly" — it's balanced.</p>
    </div>
  </div>
</section>

<!-- ═══════════════ TIPS ═══════════════ -->
<section id="tips">
  <h2>Design Tips — Making Skills Feel Great</h2>
  <p class="section-intro">Technical correctness is only half the job. These tips cover how to make skills readable, flavorful, and satisfying to use — the design craft side of RPG Maker MZ.</p>

  <h3>Clarity — Players Should Know What a Skill Does</h3>
  <ul class="tip-list">
    <li>
      <span class="tip-icon">📝</span>
      <span><strong>Write the description like a tooltip, not a lore entry.</strong> "Deals fire damage to one enemy. High chance to inflict Burn." is better than "The flames of the ancient dragon stir within." Save lore for the name and animation — the description is functional.</span>
    </li>
    <li>
      <span class="tip-icon">📊</span>
      <span><strong>Mention state chances in the description if they're noteworthy.</strong> "30% chance to Poison" sets player expectations. Surprises are fun for discovery but frustrating for strategy. Players who understand a skill use it more effectively and enjoy it more.</span>
    </li>
    <li>
      <span class="tip-icon">🎯</span>
      <span><strong>Use the Scope to telegraph intent.</strong> Healers should rarely need to "attack" enemies, and warriors shouldn't be casting ally-scope skills. Scope discipline keeps each character's role legible at a glance in the skill menu.</span>
    </li>
    <li>
      <span class="tip-icon">💡</span>
      <span><strong>Use Message 1 to confirm the action in the battle log.</strong> "Mia casts Cure!" is more satisfying than silence. Message 2 (shown just before the hit lands) is optional — use it for multi-stage attacks or spells that "charge" then fire.</span>
    </li>
  </ul>

  <h3>Variety — Avoiding a Flat Skill Set</h3>
  <ul class="tip-list">
    <li>
      <span class="tip-icon">⚡</span>
      <span><strong>Give each actor a different resource loop.</strong> A warrior earns TP from taking hits and spends it on burst damage. A mage spends MP for consistent magic. A rogue uses cheap skills that set up states. Role diversity creates interesting party composition choices.</span>
    </li>
    <li>
      <span class="tip-icon">🔀</span>
      <span><strong>Mix reliable and unreliable skills intentionally.</strong> A character with all 100% success rate skills feels safe but boring. Adding one 70%-success-rate gamble skill with a high payoff creates tension and memorable moments — both the hit and the miss.</span>
    </li>
    <li>
      <span class="tip-icon">🎭</span>
      <span><strong>Give passive skills (via traits on weapons/states) to enhance active skills.</strong> A skill that applies a "Marked" state, which another skill then consumes for bonus damage — this combo system creates depth without new fields. States are the connective tissue of complex skill designs.</span>
    </li>
    <li>
      <span class="tip-icon">📈</span>
      <span><strong>Scale skills throughout the game by changing the formula coefficient, not the skill itself.</strong> Add a stronger version at level 20 instead of editing the old one — or give the upgraded version a slightly different scope or side effect. The upgrade should feel meaningfully different, not just numerically bigger.</span>
    </li>
    <li>
      <span class="tip-icon">🌀</span>
      <span><strong>Use formulas that scale with unusual stats for uniqueness.</strong> <code>a.luk * 3</code> for a "Fortune Teller" character. <code>a.mhp * 0.1</code> for a "Titan Smash" that scales with total health. <code>b.hp * 0.3</code> for a skill that hits harder the more HP the target has. These create memorable playstyles.</span>
    </li>
  </ul>

  <h3>Satisfying Feedback</h3>
  <ul class="tip-list">
    <li>
      <span class="tip-icon">✨</span>
      <span><strong>Match animation length to power level.</strong> A basic attack plays a short animation. A 100-TP ultimate should play something spectacular. Mismatched animations (big flashy animation on a weak skill) feel wrong and undercut the moment.</span>
    </li>
    <li>
      <span class="tip-icon">🔊</span>
      <span><strong>Multi-hit skills feel impactful even when each hit is small.</strong> Three hits for 100 each feels better than one hit for 300. This is pure feel — use it for physical combo characters. Just account for the aggregate damage in balance.</span>
    </li>
    <li>
      <span class="tip-icon">⚖</span>
      <span><strong>Give skills natural counters so the player can react.</strong> A Silence skill (seal Magic type) counters a mage enemy. Fire weakness counters a specific mob. This isn't just balance — it's the core of the "puzzle" feeling that makes turn-based battles engaging. Design enemies with exploitable weaknesses and skills that exploit them.</span>
    </li>
  </ul>

  <h3>Common Mistakes to Avoid</h3>
  <ul class="tip-list">
    <li>
      <span class="tip-icon">🚫</span>
      <span><strong>Don't use a Physical Hit type for a spell you want to always land.</strong> Physical skills can be evaded by EVA and countered via CNT. If your skill is magic-thematic, use Magical Hit — or Certain Hit if it must always connect.</span>
    </li>
    <li>
      <span class="tip-icon">🚫</span>
      <span><strong>Don't put a debuff on an ally-scoped skill by accident.</strong> Scope determines who gets all effects. An "ATK Down" effect on a party-heal skill with All Allies scope will debuff your whole party.</span>
    </li>
    <li>
      <span class="tip-icon">🚫</span>
      <span><strong>Don't give HP Drain skills to enemies without careful testing.</strong> If an enemy drains HP and heals faster than the party can damage it, the fight becomes unwinnable. Drain enemies need balanced HP totals and a clear counter (magic kill, absorb element, etc.).</span>
    </li>
    <li>
      <span class="tip-icon">🚫</span>
      <span><strong>Don't leave Variance at 20% on skills you want to feel "precise."</strong> A skill designed to finish off weakened enemies can miss the threshold due to variance. Set to 0% for execution skills, sniper-type skills, or any ability where consistency is part of the fantasy.</span>
    </li>
    <li>
      <span class="tip-icon">🚫</span>
      <span><strong>Don't use a formula that goes wildly negative for high-DEF targets.</strong> <code>a.atk * 2 - b.def * 4</code> will heal enemies with moderate DEF because the result goes below zero. MZ floors damage to 0 for the HP Damage type, but the intent is still broken. Always check what happens at extreme DEF values. Use <code>Math.max(0, ...)</code> when in doubt.</span>
    </li>
  </ul>

  <div class="callout purple">
    <div class="callout-label">✦ Final Design Principle</div>
    <p>Every skill should answer one question clearly: <strong>"Why would I use this instead of a normal attack?"</strong> If the answer is "always" — it's probably too strong. If the answer is "I wouldn't" — it needs a niche. The best skills have a clear situational reason to exist: elemental weakness, a state setup, a finishing move, a healing priority. Give every skill its moment.</p>
  </div>
</section>

</main>

<script>
  function switchTab(id) {
    document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function calcSkill() {
    const atk = +document.getElementById('sk-atk').value;
    const mat = +document.getElementById('sk-mat').value;
    const def = +document.getElementById('sk-def').value;
    const mdf = +document.getElementById('sk-mdf').value;
    const mhp = +document.getElementById('sk-mhp').value;

    document.getElementById('sk-atk-v').textContent = atk;
    document.getElementById('sk-mat-v').textContent = mat;
    document.getElementById('sk-def-v').textContent = def;
    document.getElementById('sk-mdf-v').textContent = mdf;
    document.getElementById('sk-mhp-v').textContent = mhp;

    const phys  = Math.max(0, atk * 4 - def * 2);
    const magic = Math.max(0, mat * 4 - mdf * 2);
    const strong = Math.max(0, atk * 8 - def * 2);
    const grav  = Math.round(mhp * 0.25);
    const pct   = Math.round((phys / mhp) * 100);
    const heal  = mat * 3 + 50;

    document.getElementById('sk-phys').textContent  = phys;
    document.getElementById('sk-magic').textContent = magic;
    document.getElementById('sk-strong').textContent = strong;
    document.getElementById('sk-grav').textContent  = grav;
    document.getElementById('sk-pct').textContent   = pct + '%';
    document.getElementById('sk-heal').textContent  = heal;

    // Color code
    const physEl = document.getElementById('sk-phys');
    physEl.className = 'res-val ' + (phys > mhp * 0.5 ? 'danger' : phys > mhp * 0.25 ? '' : 'safe');
    const magEl = document.getElementById('sk-magic');
    magEl.className = 'res-val ' + (magic > mhp * 0.5 ? 'danger' : magic > mhp * 0.25 ? '' : 'safe');
    const strEl = document.getElementById('sk-strong');
    strEl.className = 'res-val ' + (strong > mhp * 0.5 ? 'danger' : '');
  }

  function calcTP() {
    const dmgPct = +document.getElementById('tp-dmg').value;
    const hits   = +document.getElementById('tp-hits').value;
    const gain   = +document.getElementById('tp-gain').value;

    document.getElementById('tp-dmg-v').textContent = dmgPct + '%';
    document.getElementById('tp-hits-v').textContent = hits;
    document.getElementById('tp-gain-v').textContent = gain;

    // TP from damage: MZ formula approx = floor(dmg / mhp * 100 * 50 * tcr) per hit
    // Simplified to: dmgPct * 0.5 per hit (50% coefficient)
    const tpFromDmg = Math.min(100, Math.round(dmgPct * 0.5 * hits));
    const tpFromAct = Math.min(100, gain * hits);
    const total = Math.min(100, tpFromDmg + tpFromAct);

    document.getElementById('tp-from-dmg').textContent = tpFromDmg;
    document.getElementById('tp-from-act').textContent = tpFromAct;
    document.getElementById('tp-total').textContent = total;

    const bar = document.getElementById('tp-bar');
    bar.style.width = total + '%';
    bar.style.background = total >= 100
      ? 'linear-gradient(90deg, #c9a84c, #ffd700)'
      : total >= 50
      ? 'linear-gradient(90deg, var(--purple), #c084fc)'
      : 'linear-gradient(90deg, #4a5080, var(--purple))';

    document.getElementById('tp-bar-label').textContent =
      total >= 100 ? '⚡ LIMIT READY' : `TP after ${hits} hit(s): ${total}/100`;
  }

  calcSkill();
  calcTP();
</script>

</body>
</html>
