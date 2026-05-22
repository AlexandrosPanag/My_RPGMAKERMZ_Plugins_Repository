
//=============================================================================
// DebugPerformanceDrainIdentifier.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc DEBUG — Performance Drain Identifier
 * Real per-frame ms cost across all subsystems including PIXI render pass.
 * Reports actual frame budget usage, not accumulated totals.
 * Drop during development; remove before shipping.
 *
 * @author Alexandros Panagiotakopoulos
 * @url https://alexandrospanag.github.io
 * @license CC-BY-4.0
 * @version 1.0.0
 *
 * @param interval
 * @text Report Interval (ms)
 * @type number
 * @min 500
 * @max 30000
 * @default 3000
 * @desc How often the profiler prints a report.
 *
 * @param minPercent
 * @text Min % to Show
 * @type number
 * @min 0
 * @max 100
 * @default 1
 * @desc Hides rows whose share is below this threshold.
 *
 * @param spikeThreshold
 * @text Spike Threshold (ms)
 * @type number
 * @min 1
 * @max 100
 * @default 20
 * @desc Frames above this ms cost are flagged as spikes.
 *
 * @param barWidth
 * @text Bar Width
 * @type number
 * @min 10
 * @max 60
 * @default 28
 *
 * @help
 * ============================================================================
 *  DebugPerformanceDrainIdentifier  v1.0.0
 * ============================================================================
 *
 *  BUCKETS (per-frame average ms)
 *  ────────────────────────────────
 *  • PIXI Full Frame    — wall time from Ticker._tick start to end (gold standard)
 *  • Scene Logic        — Scene_Base.update total (game logic only)
 *  • Sprites/Spriteset  — Spriteset_Map / Spriteset_Battle update
 *  • Player/Characters  — Game_Player + events + vehicles
 *  • Tilemap/Map        — $gameMap update
 *  • Parallel Events    — parallel interpreter ticks
 *  • Common Events      — common event parallel branch
 *  • Weather            — weather sprite + Game_Screen weather
 *  • Screen FX          — tint, flash, shake, pictures
 *  • Input              — Input + TouchInput
 *  • Audio              — AudioManager bgm updates
 *  • Battle Events      — BattleManager event/phase updates
 *  • Engine Core        — Scene Logic remainder after known buckets
 *
 *  CONSOLE API
 *  ────────────
 *  PDID.report()      — instant snapshot
 *  PDID.reset()       — zero all counters
 *  PDID.pause()       — stop auto-reporting
 *  PDID.resume()      — restart auto-reporting
 *  PDID.spike()       — show worst N spike frames
 *  PDID.fps()         — current rolling FPS
 *  PDID.budget()      — % of 16.67ms budget used (avg)
 *  PDID.table()       — console.table of all buckets
 *  PDID.plugins()     — per-plugin breakdown table
 * ============================================================================
 */

(() => {
    "use strict";

    const PLUGIN_NAME = "DebugPerformanceDrainIdentifier";
    const raw         = PluginManager.parameters(PLUGIN_NAME);
    const INTERVAL    = Math.max(500,  Number(raw.interval)       || 3000);
    const MIN_PCT     = Math.max(0,    Number(raw.minPercent)      || 1);
    const SPIKE_MS    = Math.max(1,    Number(raw.spikeThreshold)  || 20);
    const BAR_WIDTH   = Math.min(60,   Math.max(10, Number(raw.barWidth) || 28));
    const BUDGET_MS   = 1000 / 60;   // 16.667ms

    // ─────────────────────────────────────────────────────────────────────────
    // Bucket definitions
    // ─────────────────────────────────────────────────────────────────────────
    const BUCKET_ORDER = [
        "PIXI Full Frame",
        "Scene Logic",
        "Sprites / Spriteset",
        "Player & Characters",
        "Tilemap / Map",
        "Parallel Events",
        "Common Events",
        "Weather",
        "Screen FX",
        "Input",
        "Audio",
        "Battle Events",
        "Engine Core",
    ];

    // Per-bucket accumulators: { sum, calls, peak }
    const B = {};
    for (const k of BUCKET_ORDER) B[k] = { sum: 0, calls: 0, peak: 0 };

    // Per-plugin accumulators
    const _pluginAcc = {};

    // Spike log: array of { ms, time }
    const _spikes = [];
    const MAX_SPIKES = 20;

    // FPS ring buffer
    const _fpsRing = [];
    const FPS_RING  = 120;
    let   _lastTick = performance.now();

    let _paused     = false;
    let _lastReport = performance.now();
    let _startTime  = performance.now();
    let _frameCount = 0;

    // ─────────────────────────────────────────────────────────────────────────
    // Helpers
    // ─────────────────────────────────────────────────────────────────────────
    function _add(bucket, dt) {
        const b = B[bucket];
        b.sum   += dt;
        b.calls += 1;
        if (dt > b.peak) b.peak = dt;
    }

    function _creditPlugin(name, dt) {
        if (!_pluginAcc[name]) _pluginAcc[name] = { sum: 0, calls: 0, peak: 0 };
        const p = _pluginAcc[name];
        p.sum   += dt;
        p.calls += 1;
        if (dt > p.peak) p.peak = dt;
    }

    function _time(bucket, fn) {
        const t0  = performance.now();
        const ret = fn();
        _add(bucket, performance.now() - t0);
        return ret;
    }

    function _avg(bucket) {
        const b = B[bucket];
        return b.calls > 0 ? b.sum / b.calls : 0;
    }

    function _bar(pct, w) {
        w = w || BAR_WIDTH;
        const f = Math.min(w, Math.round((pct / 100) * w));
        return "█".repeat(f) + "░".repeat(w - f);
    }

    function _colour(pct) {
        if (pct >= 60) return "color:#ff2222;font-weight:bold;font-family:monospace";
        if (pct >= 35) return "color:#ff8800;font-weight:bold;font-family:monospace";
        if (pct >= 15) return "color:#ffdd00;font-family:monospace";
        if (pct >=  5) return "color:#88ddff;font-family:monospace";
        return                 "color:#66aa66;font-family:monospace";
    }

    function _msColour(ms) {
        if (ms >= BUDGET_MS * 1.5) return "color:#ff2222;font-weight:bold;font-family:monospace";
        if (ms >= BUDGET_MS)       return "color:#ff8800;font-weight:bold;font-family:monospace";
        if (ms >= BUDGET_MS * 0.5) return "color:#ffdd00;font-family:monospace";
        return                            "color:#66aa66;font-family:monospace";
    }

    function _uptime() {
        const s = Math.floor((performance.now() - _startTime) / 1000);
        return `${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
    }

    function _rollingFps() {
        if (_fpsRing.length < 2) return 0;
        const span = _fpsRing[_fpsRing.length-1] - _fpsRing[0];
        return span > 0 ? Math.round((_fpsRing.length - 1) / (span / 1000)) : 0;
    }

    function _mapName() {
        try {
            if ($gameMap && $gameMap.mapId() > 0) {
                const dn = $gameMap.displayName && $gameMap.displayName();
                if (dn) return dn;
                if (typeof $dataMapInfos !== "undefined")
                    return ($dataMapInfos[$gameMap.mapId()] || {}).name || `Map ${$gameMap.mapId()}`;
            }
            if (SceneManager._scene)
                return SceneManager._scene.constructor.name || "—";
        } catch(e) {}
        return "—";
    }

    // ─────────────────────────────────────────────────────────────────────────
    // PIXI Ticker hook — measures the FULL frame wall time
    // This is the only way to capture GPU render cost that Scene_Base misses
    // ─────────────────────────────────────────────────────────────────────────
    (function _hookPixiTicker() {
        // PIXI.Ticker has a _tick method called by rAF
        const ticker = PIXI.Ticker.shared || (PIXI.ticker && PIXI.ticker.shared);
        if (!ticker) return;

        const _origTick = ticker._tick.bind(ticker);
        ticker._tick = function(time) {
            const t0 = performance.now();
            _origTick(time);
            const dt = performance.now() - t0;

            // FPS ring
            _fpsRing.push(t0);
            if (_fpsRing.length > FPS_RING) _fpsRing.shift();

            _add("PIXI Full Frame", dt);
            _frameCount++;

            // Spike detection
            if (dt > SPIKE_MS) {
                _spikes.push({ ms: dt, time: new Date().toLocaleTimeString(), map: _mapName() });
                if (_spikes.length > MAX_SPIKES) _spikes.shift();
            }

            if (!_paused && performance.now() - _lastReport >= INTERVAL) {
                _report();
                _lastReport = performance.now();
            }
        };
        ticker._tick.__pdid__ = true;
    })();

    // ─────────────────────────────────────────────────────────────────────────
    // Core bucket patches
    // ─────────────────────────────────────────────────────────────────────────

    // Input
    const _origInput = SceneManager.updateInputData.bind(SceneManager);
    SceneManager.updateInputData = function() { _time("Input", () => _origInput()); };

    // Audio
    if (AudioManager.updateCurrentBgm) {
        const _o = AudioManager.updateCurrentBgm.bind(AudioManager);
        AudioManager.updateCurrentBgm = function(...a) { _time("Audio", () => _o(...a)); };
    }

    // Parallel events
    if (Game_Map.prototype.updateParallelInterpreters) {
        const _o = Game_Map.prototype.updateParallelInterpreters;
        Game_Map.prototype.updateParallelInterpreters = function() { _time("Parallel Events", () => _o.call(this)); };
    }

    // Common events
    if (Game_Map.prototype.updateCommonEvents) {
        const _o = Game_Map.prototype.updateCommonEvents;
        Game_Map.prototype.updateCommonEvents = function() { _time("Common Events", () => _o.call(this)); };
    }

    // Tilemap / Map
    if (Game_Map.prototype.updateVehicles) {
        const _o = Game_Map.prototype.update;
        Game_Map.prototype.update = function(s) { _time("Tilemap / Map", () => _o.call(this, s)); };
    }

    // Characters
    if (Game_Map.prototype.updateEvents) {
        const _o = Game_Map.prototype.updateEvents;
        Game_Map.prototype.updateEvents = function() { _time("Player & Characters", () => _o.call(this)); };
    }
    if (Game_Map.prototype.updateVehicles) {
        const _o = Game_Map.prototype.updateVehicles;
        Game_Map.prototype.updateVehicles = function() { _time("Player & Characters", () => _o.call(this)); };
    }
    const _origPlayerUpdate = Game_Player.prototype.update;
    Game_Player.prototype.update = function(s) { _time("Player & Characters", () => _origPlayerUpdate.call(this, s)); };

    // Sprites / Spriteset
    [Spriteset_Map, Spriteset_Battle].forEach(Cls => {
        if (!Cls) return;
        const _o = Cls.prototype.update;
        Cls.prototype.update = function() { _time("Sprites / Spriteset", () => _o.call(this)); };
    });

    // Weather
    if (Game_Screen.prototype.updateWeather) {
        const _o = Game_Screen.prototype.updateWeather;
        Game_Screen.prototype.updateWeather = function() { _time("Weather", () => _o.call(this)); };
    }
    if (typeof Weather !== "undefined" && Weather.prototype?.update) {
        const _o = Weather.prototype.update;
        Weather.prototype.update = function() { _time("Weather", () => _o.call(this)); };
    }

    // Screen FX
    ["updateTone","updateFlash","updateShake","updateZoom","updatePictures",
     "updateFadeOut","updateFadeIn"].forEach(m => {
        if (!Game_Screen.prototype[m]) return;
        const _o = Game_Screen.prototype[m];
        Game_Screen.prototype[m] = function() { _time("Screen FX", () => _o.call(this)); };
    });

    // Battle
    if (typeof BattleManager !== "undefined") {
        ["updateEvent","updateEventMain","updatePhase"].forEach(m => {
            if (!BattleManager[m]) return;
            const _o = BattleManager[m].bind(BattleManager);
            BattleManager[m] = function(...a) { _time("Battle Events", () => _o(...a)); };
        });
    }

    // Scene Logic — wraps Scene_Base.update, calculates Engine Core as remainder
    const _origSceneUpdate = Scene_Base.prototype.update;
    Scene_Base.prototype.update = function() {
        const t0 = performance.now();
        // Zero sub-frame accumulator so Engine Core = scene wall - known buckets
        const knownBefore = Object.keys(B)
            .filter(k => k !== "Scene Logic" && k !== "Engine Core" && k !== "PIXI Full Frame")
            .reduce((s, k) => s + B[k].sum, 0);

        _origSceneUpdate.call(this);

        const sceneWall = performance.now() - t0;
        _add("Scene Logic", sceneWall);

        // Engine Core = scene wall time minus all known sub-bucket contributions this frame
        const knownAfter = Object.keys(B)
            .filter(k => k !== "Scene Logic" && k !== "Engine Core" && k !== "PIXI Full Frame")
            .reduce((s, k) => s + B[k].sum, 0);
        const knownDelta = knownAfter - knownBefore;
        _add("Engine Core", Math.max(0, sceneWall - knownDelta));
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Per-plugin instrumentation (Strategy A: new constructors)
    // ─────────────────────────────────────────────────────────────────────────
    const _SKIP_GLOBALS = new Set([
        "webkitStorageInfo","webkitIndexedDB","webkitRequestFileSystem",
        "webkitResolveLocalFileSystemURL","openDatabase",
    ]);
    function _safeIsConstructor(k) {
        if (_SKIP_GLOBALS.has(k)) return false;
        try {
            const d = Object.getOwnPropertyDescriptor(window, k);
            if (d && d.get && !d.value) return false;
            return typeof window[k] === "function" && !!window[k].prototype;
        } catch(e) { return false; }
    }
    const _coreGlobals = new Set(Object.keys(window).filter(k => _safeIsConstructor(k)));

    const HOT_METHODS = [
        "update","updateLogic","updateVisibility","updatePosition","updateOpacity",
        "updateAnimation","updateFrame","updateBitmap","updateColor","updateMove",
        "refresh","redrawItem","processHandling","processCursorMove","processTouch",
    ];

    function _wrapProtoMethod(ctor, method, pluginName) {
        const proto = ctor?.prototype;
        if (!proto || typeof proto[method] !== "function" || proto[method].__pdid__) return false;
        const _o = proto[method];
        const _w = function(...args) {
            const t0  = performance.now();
            const ret = _o.apply(this, args);
            const dt  = performance.now() - t0;
            _creditPlugin(pluginName, dt);
            return ret;
        };
        _w.__pdid__ = pluginName;
        proto[method] = _w;
        return true;
    }

    function _matchScore(a, b) {
        a = a.replace(/[_\-.]/g,"").toLowerCase();
        b = b.replace(/[_\-.]/g,"").toLowerCase();
        if (a === b)        return 1000;
        if (a.includes(b)) return b.length * 2;
        if (b.includes(a)) return a.length;
        let best = 0;
        for (let len = Math.min(b.length, 8); len >= 4; len--)
            for (let i = 0; i <= b.length - len; i++)
                if (a.includes(b.slice(i, i+len))) { best = Math.max(best, len); break; }
        return best;
    }

    const _origBootStart = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        // Find plugins added after core snapshot
        const activePlugins = ($plugins || []).filter(p => p.status).map(p => ({
            name: (p.name || "").replace(/^.*[/\\]/, "").replace(/\.js$/i,""),
            full: p.name || "",
        }));

        const newGlobals = Object.keys(window)
            .filter(k => !_coreGlobals.has(k) && _safeIsConstructor(k));

        let wrapped = 0;
        for (const ctorName of newGlobals) {
            let bestPlugin = null, bestScore = 3;
            for (const p of activePlugins) {
                const score = _matchScore(ctorName, p.name);
                if (score > bestScore) { bestScore = score; bestPlugin = p.name; }
            }
            if (!bestPlugin) continue;
            const ctor = window[ctorName];
            for (const m of HOT_METHODS)
                if (_wrapProtoMethod(ctor, m, bestPlugin)) wrapped++;
        }

        // Init zero entries so all plugins appear in table
        for (const p of activePlugins)
            if (!_pluginAcc[p.name]) _pluginAcc[p.name] = { sum: 0, calls: 0, peak: 0 };

        console.log(`%c[PDID] Instrumented ${wrapped} plugin methods across ${activePlugins.length} plugins.`, "color:#00e5ff");
        _origBootStart.call(this);
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Report
    // ─────────────────────────────────────────────────────────────────────────
    function _report() {
        const fps      = _rollingFps();
        const fullAvg  = _avg("PIXI Full Frame");
        const logicAvg = _avg("Scene Logic");
        const budgetPct = (fullAvg / BUDGET_MS) * 100;
        const frames   = B["PIXI Full Frame"].calls;
        const peakFull = B["PIXI Full Frame"].peak;

        if (frames < 5) {
            console.log("%c[PDID] Warming up — not enough frames yet.", "color:#888");
            return;
        }

        const now = new Date().toLocaleTimeString();
        const map = _mapName();

        // ── Header ────────────────────────────────────────────────────────────
        console.groupCollapsed(
            `%c⚡ PDID  %c${now}  %c${map}  %c↑${_uptime()}  %c${fps} FPS`,
            "color:#00e5ff;font-weight:bold;font-size:13px;font-family:monospace",
            "color:#777;font-size:11px",
            "color:#ffcc00;font-size:11px",
            "color:#556;font-size:10px",
            fps >= 55 ? "color:#66cc66;font-weight:bold" : fps >= 30 ? "color:#ffaa00;font-weight:bold" : "color:#ff4444;font-weight:bold"
        );

        // ── Budget summary line ───────────────────────────────────────────────
        const budgetBar = _bar(Math.min(budgetPct, 100), 20);
        console.log(
            `%c  Frame Budget   %c${budgetBar} %c${budgetPct.toFixed(1)}%% of 16.67ms  %c(avg ${fullAvg.toFixed(2)}ms  peak ${peakFull.toFixed(2)}ms  over ${frames} frames)`,
            "color:#fff;font-weight:bold;font-family:monospace",
            budgetPct >= 100 ? "color:#ff2222;font-family:monospace" : budgetPct >= 60 ? "color:#ff8800;font-family:monospace" : "color:#66cc66;font-family:monospace",
            budgetPct >= 100 ? "color:#ff2222;font-weight:bold;font-family:monospace" : budgetPct >= 60 ? "color:#ff8800;font-weight:bold;font-family:monospace" : "color:#66cc66;font-weight:bold;font-family:monospace",
            "color:#556;font-size:10px;font-family:monospace"
        );

        // ── Divider ───────────────────────────────────────────────────────────
        console.log("%c  " + "─".repeat(72), "color:#333;font-family:monospace");

        // ── Per-bucket rows ───────────────────────────────────────────────────
        // Sort by avg ms descending, but keep PIXI Full Frame and Scene Logic pinned top
        const pinned  = ["PIXI Full Frame", "Scene Logic"];
        const rest    = BUCKET_ORDER.filter(k => !pinned.includes(k))
                                    .sort((a,b) => _avg(b) - _avg(a));
        const ordered = [...pinned, ...rest];

        for (const key of ordered) {
            const avg   = _avg(key);
            const peak  = B[key].peak;
            const calls = B[key].calls;
            if (calls === 0) continue;

            // All percentages relative to 16.67ms budget — always meaningful
            const pct    = (avg / BUDGET_MS) * 100;
            if (pct < MIN_PCT && key !== "PIXI Full Frame" && key !== "Scene Logic") continue;

            const bar    = _bar(Math.min(pct, 100));
            const label  = key.padEnd(22);
            const avgStr = avg.toFixed(3).padStart(7) + "ms avg";
            const pkStr  = peak.toFixed(3).padStart(7) + "ms peak";
            const pctStr = pct.toFixed(1).padStart(6) + "%";

            const isDivider = key === "Scene Logic";
            if (isDivider)
                console.log("%c  " + "─".repeat(72), "color:#333;font-family:monospace");

            console.log(
                `%c  ${label} %c${bar} %c${pctStr}  %c${avgStr}  %c${pkStr}`,
                key === "PIXI Full Frame" ? "color:#00e5ff;font-weight:bold;font-family:monospace"
                  : key === "Scene Logic"   ? "color:#ffaa44;font-weight:bold;font-family:monospace"
                  : key === "Engine Core"   ? "color:#aa88ff;font-family:monospace"
                  :                          "color:#ccc;font-family:monospace",
                _colour(pct),
                _colour(pct),
                _msColour(avg),
                peak > SPIKE_MS ? "color:#ff6644;font-family:monospace" : "color:#556;font-family:monospace"
            );
        }

        // ── Plugin breakdown (collapsed) ──────────────────────────────────────
        const pluginRows = Object.entries(_pluginAcc)
            .map(([name, d]) => ({ name, avg: d.calls > 0 ? d.sum/d.calls : 0, peak: d.peak, calls: d.calls }))
            .filter(r => r.avg > 0.01)
            .sort((a,b) => b.avg - a.avg);

        if (pluginRows.length > 0) {
            console.log("%c  " + "─".repeat(72), "color:#333;font-family:monospace");
            console.groupCollapsed(
                `%c  Plugin Breakdown ▶  %c(${pluginRows.length} plugins with measured activity — expand)`,
                "color:#ffaa44;font-weight:bold;font-family:monospace",
                "color:#556;font-size:10px"
            );
            for (const r of pluginRows) {
                const pct = (r.avg / BUDGET_MS) * 100;
                const bar = _bar(Math.min(pct, 100), 20);
                console.log(
                    `%c  ${r.name.padEnd(44)} %c${bar} %c${pct.toFixed(1).padStart(5)}%  %c${r.avg.toFixed(3).padStart(7)}ms avg  %c${r.peak.toFixed(3).padStart(7)}ms peak`,
                    "color:#ddd;font-family:monospace",
                    _colour(pct),
                    "color:#fff;font-family:monospace",
                    _msColour(r.avg),
                    r.peak > SPIKE_MS ? "color:#ff6644;font-family:monospace" : "color:#556;font-family:monospace"
                );
            }
            console.groupEnd();
        }

        // ── Spike summary ─────────────────────────────────────────────────────
        if (_spikes.length > 0) {
            console.log("%c  " + "─".repeat(72), "color:#333;font-family:monospace");
            const recentSpikes = _spikes.slice(-5);
            console.groupCollapsed(
                `%c  ⚠ Spikes (>${SPIKE_MS}ms)  %c${_spikes.length} total recorded — last ${recentSpikes.length} shown`,
                "color:#ff6644;font-weight:bold;font-family:monospace",
                "color:#886655;font-size:10px"
            );
            for (const s of recentSpikes) {
                console.log(
                    `%c  ${s.time}  ${s.map.padEnd(24)}  %c${s.ms.toFixed(2)}ms`,
                    "color:#888;font-family:monospace",
                    s.ms > SPIKE_MS * 2 ? "color:#ff2222;font-weight:bold;font-family:monospace" : "color:#ff9944;font-family:monospace"
                );
            }
            console.groupEnd();
        }

        // ── Footer ────────────────────────────────────────────────────────────
        console.log(
            `%c  ${frames} frames sampled  |  PDID.reset() to clear  |  PDID.spike() for full spike log`,
            "color:#334;font-size:10px;font-family:monospace"
        );
        console.groupEnd();

        // Roll counters
        for (const k of BUCKET_ORDER) { B[k].sum = 0; B[k].calls = 0; B[k].peak = 0; }
        for (const k of Object.keys(_pluginAcc)) { _pluginAcc[k].sum = 0; _pluginAcc[k].calls = 0; _pluginAcc[k].peak = 0; }
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Public API
    // ─────────────────────────────────────────────────────────────────────────
    window.PDID = {
        report() { _report(); _lastReport = performance.now(); },
        reset() {
            for (const k of BUCKET_ORDER) { B[k].sum = 0; B[k].calls = 0; B[k].peak = 0; }
            for (const k of Object.keys(_pluginAcc)) { _pluginAcc[k].sum = 0; _pluginAcc[k].calls = 0; _pluginAcc[k].peak = 0; }
            _spikes.length = 0;
            _frameCount    = 0;
            _startTime     = performance.now();
            console.log("%c[PDID] All counters reset.", "color:#00e5ff");
        },
        pause()   { _paused = true;  console.log("%c[PDID] Paused.", "color:#ffcc00"); },
        resume()  { _paused = false; _lastReport = performance.now(); console.log("%c[PDID] Resumed.", "color:#00e5ff"); },
        fps()     { return _rollingFps(); },
        budget()  {
            const avg = _avg("PIXI Full Frame");
            const pct = (avg / BUDGET_MS) * 100;
            console.log(`%c[PDID] Frame budget: ${pct.toFixed(1)}% used (avg ${avg.toFixed(3)}ms / 16.667ms)  Peak: ${B["PIXI Full Frame"].peak.toFixed(3)}ms`,
                pct >= 100 ? "color:#ff2222;font-weight:bold" : pct >= 60 ? "color:#ff8800;font-weight:bold" : "color:#66cc66;font-weight:bold");
        },
        spike()   {
            if (_spikes.length === 0) { console.log("%c[PDID] No spikes recorded.", "color:#66cc66"); return; }
            console.group(`%c[PDID] All recorded spikes (>${SPIKE_MS}ms) — ${_spikes.length} total`, "color:#ff6644;font-weight:bold");
            for (const s of _spikes)
                console.log(`%c  ${s.time}  ${s.map.padEnd(24)}  ${s.ms.toFixed(2)}ms`,
                    s.ms > SPIKE_MS * 2 ? "color:#ff2222" : "color:#ff9944");
            console.groupEnd();
        },
        table()   {
            console.table(BUCKET_ORDER.map(k => ({
                Bucket : k,
                "Avg ms": _avg(k).toFixed(3),
                "Peak ms": B[k].peak.toFixed(3),
                "% of budget": (((_avg(k)) / BUDGET_MS) * 100).toFixed(1) + "%",
                Calls: B[k].calls,
            })));
        },
        plugins() {
            const rows = Object.entries(_pluginAcc)
                .map(([name, d]) => ({
                    Plugin: name,
                    "Avg ms": d.calls > 0 ? (d.sum / d.calls).toFixed(3) : "0.000",
                    "Peak ms": d.peak.toFixed(3),
                    Calls: d.calls,
                }))
                .sort((a,b) => parseFloat(b["Avg ms"]) - parseFloat(a["Avg ms"]));
            console.table(rows);
        },
        version: "3.0.0",
    };

    // ─────────────────────────────────────────────────────────────────────────
    // Boot message
    // ─────────────────────────────────────────────────────────────────────────
    console.log(
        "%c⚡ DEBUG_PerformanceDrainIdentifier \n" +
        "%cNow reports real per-frame averages + PIXI render pass + spike detection\n" +
        "%cInterval: %c" + INTERVAL + "ms%c  |  Spike threshold: %c" + SPIKE_MS + "ms%c  |  Budget: %c16.67ms%c (60fps)\n" +
        "%cAPI: PDID.report() | PDID.budget() | PDID.fps() | PDID.spike() | PDID.reset() | PDID.table() | PDID.plugins()",
        "color:#00e5ff;font-size:14px;font-weight:bold",
        "color:#66aa88;font-size:11px",
        "color:#777", "color:#eee", "color:#777", "color:#eee", "color:#777", "color:#eee", "color:#777",
        "color:#556;font-size:11px"
    );

})();
