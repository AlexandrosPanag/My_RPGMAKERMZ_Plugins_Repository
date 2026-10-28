//=============================================================================
// DevToolsManage.js
// ----------------------------------------------------------------------------
// Created by triacontane
// Modified by Alexandros Panagiotakopoulos
// ----------------------------------------------------------------------------

/*:
 * @plugindesc Development Support Plugin
 * @author triacontane & Alexandros Panagiotakopoulos
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @target MZ
 * @url alexandrospanag.github.io
 *
 * @param StartupDevTool
 * @text Boot on Launch
 * @desc Boots the developer tool simultaneously with game launch.
 * @default true
 * @type boolean
 *
 * @param ShortcutList
 * @text Shortcut List
 * @desc A list of usable shortcut functions.
 * @type struct<ShortcutFunction>[]
 *
 * @param ShowFPS
 * @text Show FPS
 * @desc By default, shows FPS in the upper left of the screen. (FPS/MS/OFF)
 * @default OFF
 * @type select
 * @option FPS
 * @option MS
 * @option OFF
 *
 * @param CutTitle
 * @text Title Skip
 * @desc Skips the title screen and loads the most recent save file.
 * @default 0
 * @type select
 * @option Invalid
 * @value 0
 * @option New game
 * @value 1
 * @option Latest data load
 * @value 2
 *
 * @param RapidStart
 * @text Start Rapid Mode
 * @desc Launches the game in a sped up state. (ON/OFF)
 * @default false
 * @type boolean
 *
 * @param RapidSpeed
 * @text Rapid Speed
 * @desc The playback speed when rapid mode is executed. Can be specified up to 16x.
 * @default 2
 * @type number
 * @max 16
 *
 * @param SlowSpeed
 * @text Slow Speed
 * @desc The playback speed (denominator) when slow mode is executed. Can be slowed to 1/16 speed.
 * @default 2
 * @type number
 * @max 16
 *
 * @param InvalidMessageSkip
 * @text Disable Message Skip
 * @desc Disables forced skipping of messages in rapid mode.
 * @default false
 * @type boolean
 *
 * @param MenuBarVisible
 * @text Display Menu Bar
 * @desc Display the menu bar and execute various debug commands.(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param ClickMenu
 * @text Click Menu
 * @desc Executes various debug commands from the click menu. (-1:Disable  0:Left  1:Wheel  2:Right)
 * @default 1
 * @type select
 * @option Disable
 * @value -1
 * @option Left
 * @value 0
 * @option Wheel
 * @value 1
 * @option Right
 * @value 2
 *
 * @param OutputStartupInfo
 * @text Info Output at Launch
 * @desc Outputs a log of various types of information on launch.
 * @default true
 * @type boolean
 *
 * @param StartupOnTop
 * @text Launch as Top Screen
 * @desc Locks the game screen as the forefront display on launch.
 * @default false
 * @type boolean
 *
 * @param UseReloadData
 * @text Use Reload Function
 * @desc Reloads map and data on focus. Please disable if it causes the program to have problems running due to competing processes.
 * @default true
 * @type boolean
 *
 * @param AutoBackup
 * @text Auto Backup on Save
 * @desc Automatically creates a backup of the project when saving maps/events.
 * @default true
 * @type boolean
 *
 * @param MaxBackups
 * @text Maximum Backups
 * @desc Maximum number of backup files to keep (0 = unlimited)
 * @default 5
 * @type number
 *
 * @param ShowMemoryUsage
 * @text Show Memory Usage
 * @desc Shows JS heap memory usage in the dev info overlay (refreshed every second).
 * @default false
 * @type boolean
 *
 * @param PanelEnabled
 * @text Dev Panel
 * @desc Enables the in-game dev panel (tools, console, data, performance, lab).
 * @default true
 * @type boolean
 *
 * @param PanelHotkey
 * @text Panel Hotkey
 * @desc Key that opens/closes the dev panel (matched by physical key). Backquote is the key left of "1".
 * @default Backquote
 * @type select
 * @option Backquote
 * @option F1
 * @option F6
 * @option F7
 * @option F10
 * @option F11
 *
 * @param PanelOpenAtStart
 * @text Open Panel on Launch
 * @desc Opens the dev panel as soon as the game starts.
 * @default false
 * @type boolean
 *
 * @param PanelDock
 * @text Panel Side
 * @desc Which edge of the game window the panel docks to.
 * @default right
 * @type select
 * @option Right
 * @value right
 * @option Left
 * @value left
 *
 * @param Toasts
 * @text Toast Notifications
 * @desc Shows short on-screen confirmations when a dev command succeeds or fails.
 * @default true
 * @type boolean
 *
 * @param MockLoadingOnBoot
 * @text Hold Loading Screen on Boot
 * @desc Keeps the loading spinner on screen at launch so you can style it. Release it from the panel or with mockload(false).
 * @default false
 * @type boolean
 *
 * @param PerfAutoStart
 * @text Start Profiler on Launch
 * @desc Starts the frame profiler right away. Otherwise start it with perf() or from the panel.
 * @default false
 * @type boolean
 *
 * @param PerfConsoleReports
 * @text Profiler Console Reports
 * @desc Prints a profiler report to the console every interval while the profiler runs.
 * @default false
 * @type boolean
 *
 * @param PerfInterval
 * @text Profiler Report Interval (ms)
 * @desc How often the profiler rolls its averages and prints console reports.
 * @default 3000
 * @type number
 * @min 500
 * @max 30000
 *
 * @param PerfSpikeMs
 * @text Spike Threshold (ms)
 * @desc Frames slower than this are recorded as spikes.
 * @default 20
 * @type number
 * @min 1
 * @max 200
 *
 * @param StressInitial
 * @text Stress: First Wave
 * @desc Events spawned in the first wave of the stress test.
 * @default 100
 * @type number
 * @min 1
 * @max 5000
 *
 * @param StressInterval
 * @text Stress: Wave Interval (frames)
 * @desc Frames between waves (60 = one second).
 * @default 60
 * @type number
 * @min 1
 * @max 600
 *
 * @param StressIncrement
 * @text Stress: Growth Per Wave
 * @desc Extra events added to each following wave.
 * @default 50
 * @type number
 * @min 0
 * @max 2000
 *
 * @param StressMax
 * @text Stress: Event Limit
 * @desc The test stops once this many events have been spawned.
 * @default 10000
 * @type number
 * @min 10
 * @max 100000
 *
 * @param StressMovement
 * @text Stress: Moving Events
 * @desc Spawned events move randomly (more CPU load).
 * @default true
 * @type boolean
 *
 * @param StressAnimations
 * @text Stress: Visible Animated Events
 * @desc Spawned events use your actors' walking sprites (more GPU load).
 * @default false
 * @type boolean
 *
 * @param StressMarkers
 * @text Stress: Debug Markers
 * @desc Draws a small marker on every spawned event.
 * @default false
 * @type boolean
 *
 * @param StressAutoStop
 * @text Stress: Stop When FPS Collapses
 * @desc Stops the stress test when FPS stays under 10.
 * @default true
 * @type boolean
 *
 * @param ValidatorKnownTags
 * @text Validator: Known Notetags
 * @desc Comma-separated notetag names the validator should never report (e.g. mytag, other).
 * @default
 * @type string
 *
 * @help This is a creation support plugin that adjusts the behavior of the developer tool.
 * This plugin is only enabled for test plays in a local environment.
 * The following functions are provided to assist with smooth development.
 *
 * 1. The developer tool automatically opens on game launch.(Normally, F8 is used to launch.)
 *    Even when set to OFF, it will automatically open when an error occurs.
 *
 * 2. It will always display the game screen as the foremost window on screen. This is
 *    convenient when looking at other screens while working. You can switch modes from the menu bar in-game.
 *
 * 3. If you edit maps or events and resave, the map and database will be automatically
 *    reloaded the instant focus returns to the game screen.
 *
 * 4. Skip the title screen and load the most recent save file.
 *
 * 5. Increase or decrease game speed (16x maximum).
 *    Or, stop the game entirely.
 *    The game will return to normal speed only when making a selection in a window.
 *
 * 6. Force kill all enemies, allowing you to win. You will still receive battle rewards.
 *    You can also force a loss or abort a battle.
 *
 * 7. Execute optional scripts on every frame.
 *    Results are outputted to the console only when there is a variation in a script's return value.
 *
 * 8. Allow external battle tests via the editor.
 *    Please configure btest in the url options.
 *
 * 9. Dev panel: press the panel hotkey (Backquote by default) for tools, a live
 *    console, a switch/variable editor, a frame profiler and the debug lab.
 *
 * 10. Debug tools you can call as functions from the console or the panel:
 *      perf()              frame profiler on/off   (perf.report / budget / spikes / table / plugins / reset)
 *      stress()            event stress test        (stress.stop / config / status)
 *      nuke("tag")         force <nuke:tag> events  (nuke.stop / list)
 *      validate()          scan project content     (validate.export / allow / last)
 *      stats()             export actor stats       (stats(actorId) for one actor)
 *      mockload()          hold the loading screen  (mockload(false) to release)
 *      panel()             open/close the dev panel
 *    Type help() for every command. These replace the stand-alone DebugMockLoadingScreen,
 *    DebugStatsExporter, NuclearEventForcer, NuclearEventThrottler,
 *    DebugPerformanceDrainIdentifier and PluginContentValidator plugins: turn those off
 *    to avoid hooking the same engine methods twice.
 *
 * This plugin has no plugin commands; everything is a console function or a panel button.
 *
 * User Agreement:
 *  You may alter or redistribute the plugin without permission. There are no restrictions on usage format
 *  (such as adult- or commercial-use only).
 *  This plugin is now all yours.
 */

/*~struct~ShortcutFunction:
 *
 * @param Command
 * @text Command
 * @desc Details of the command you wish to execute.
 * @default
 * @type select
 * @option Display at forefront
 * @value AlwaysOnTop
 * @option Freeze screen
 * @value Freeze
 * @option Resident script
 * @value ExecuteScript
 * @option Abort battle
 * @value ForceAbort
 * @option Lose battle
 * @value ForceDefeat
 * @option Win battle
 * @value ForceVictory
 * @option Rapid mode
 * @value ToggleRapid
 * @option Slow mode
 * @value ToggleSlow
 * @option Open project
 * @value OpenProject
 * @option Take screenshot
 * @value Screenshot
 * @option Backup project data
 * @value Backup
 * @option Toggle dev panel
 * @value TogglePanel
 * @option Stress test on/off
 * @value StressTest
 * @option Validate project
 * @value RunValidation
 * @option Export actor stats
 * @value ExportStats
 * @option Profiler on/off
 * @value TogglePerf
 * @option Print profiler report
 * @value PerfReport
 * @option Hold loading screen
 * @value MockLoad
 *
 * @param HotKey
 * @text Hotkey
 * @desc Hotkey for executing commands.
 * @default
 * @type select
 * @option
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param Alt
 * @text Hold ALT key simultaneously
 * @desc Enabled only when ALT key is held simultaneously
 * @type boolean
 * @default false
 *
 * @param Ctrl
 * @text Hold CTRL key simultaneously
 * @desc Enabled only when CTRL key is held simultaneously
 * @type boolean
 * @default false
 *
 */

/**
 * DevTools
 * Everything that is new in this version lives in this one namespace:
 * theme, log feed, toasts, HUD, dev panel and the six debug tools
 * (profiler, stress test, event forcer, validator, stats export, mock loading).
 * Nothing in here touches the engine until DevTools.init() runs, and init() only
 * runs during test play.
 */
const DevTools = (() => {
    'use strict';

    //=========================================================================
    // Shared state + small helpers
    //=========================================================================
    const D = {};                       // public surface (returned at the end)
    const cfg = {                       // filled from plugin parameters by init()
        panel: true, hotkey: 'Backquote', openAtStart: false, dock: 'right', toasts: true,
        mockBoot: false, perfAuto: false, perfReports: false, perfInterval: 3000, perfSpike: 20,
        stress: { initial: 100, interval: 60, increment: 50, max: 10000, movement: true, animations: false, markers: false, autoStop: true },
        knownTags: []
    };
    const S = {                         // runtime toggles (kept out of save files on purpose)
        god: false, noclip: false, ready: false
    };
    D.cfg = cfg;
    D.state = S;

    const isNw = () => typeof Utils !== 'undefined' && Utils.isNwjs();
    const clamp = (n, a, b) => Math.min(b, Math.max(a, n));
    const num = (v, d) => { const n = Number(v); return Number.isFinite(n) ? n : d; };
    const flag = (v, d) => (v === undefined || v === null || v === '') ? d : (v === true || v === 'true');
    const fmt = (n, d = 1) => Number.isFinite(n) ? n.toFixed(d) : '-';
    const pad2 = (n) => String(n).padStart(2, '0');
    const clock = (t = new Date()) => `${pad2(t.getHours())}:${pad2(t.getMinutes())}:${pad2(t.getSeconds())}`;
    const stamp = () => new Date().toISOString().replace(/[:.]/g, '-');
    D.util = { isNw, clamp, num, flag, fmt, clock };

    /** Tiny DOM builder: h('div', {class:'x', onclick:fn}, child, 'text') */
    function h(tag, attrs, ...kids) {
        const el = document.createElement(tag);
        if (attrs) {
            for (const k of Object.keys(attrs)) {
                const v = attrs[k];
                if (v === undefined || v === null || v === false) continue;
                if (k === 'class') el.className = v;
                else if (k === 'text') el.textContent = v;
                else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
                else if (k.length > 2 && k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
                else if (k === 'value') el.value = v;
                else if (k === 'checked') el.checked = !!v;
                else el.setAttribute(k, v === true ? '' : String(v));
            }
        }
        for (const kid of kids.flat(2)) {
            if (kid === null || kid === undefined || kid === false) continue;
            el.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
        }
        return el;
    }

    /** Safe, bounded text rendering of any value (never throws). */
    function inspect(v, depth = 0) {
        try {
            if (v === null) return 'null';
            if (v === undefined) return 'undefined';
            const t = typeof v;
            if (t === 'string') return depth ? JSON.stringify(v) : v;
            if (t === 'number' || t === 'boolean' || t === 'bigint') return String(v);
            if (t === 'symbol') return v.toString();
            if (t === 'function') return `function ${v.name || '(anonymous)'}()`;
            if (v instanceof Error) return v.stack || `${v.name}: ${v.message}`;
            if (typeof Node !== 'undefined' && v instanceof Node) return `<${(v.nodeName || 'node').toLowerCase()}${v.id ? '#' + v.id : ''}>`;
            if (depth > 2) return Array.isArray(v) ? '[...]' : '{...}';
            if (Array.isArray(v)) {
                const items = v.slice(0, 12).map(x => inspect(x, depth + 1));
                return '[' + items.join(', ') + (v.length > 12 ? `, ...+${v.length - 12}` : '') + ']';
            }
            const name = v.constructor && v.constructor.name && v.constructor.name !== 'Object' ? v.constructor.name + ' ' : '';
            const keys = Object.keys(v).slice(0, 10);
            const body = keys.map(k => `${k}: ${inspect(v[k], depth + 1)}`).join(', ');
            return name + '{' + body + (Object.keys(v).length > 10 ? ', ...' : '') + '}';
        } catch (e) {
            return '[unprintable]';
        }
    }
    D.inspect = inspect;

    /** Aligned plain-text table for the panel feed. */
    function tableText(rows) {
        if (!rows || !rows.length) return '(no rows)';
        const cols = Object.keys(rows[0]);
        const cells = rows.map(r => cols.map(c => String(r[c] === undefined ? '' : r[c])));
        const widths = cols.map((c, i) => Math.min(40, Math.max(c.length, ...cells.map(r => r[i].length))));
        const line = (arr) => arr.map((s, i) => s.slice(0, widths[i]).padEnd(widths[i])).join('  ');
        return [line(cols), line(widths.map(w => '-'.repeat(w))), ...cells.map(line)].join('\n');
    }

    //=========================================================================
    // File output (NW.js writes into <project>/exports, browsers download)
    //=========================================================================
    const fsx = {
        safeName: (name) => String(name).replace(/[^\w.\-]+/g, '_'),
        /** Returns the saved path (NW.js) or the file name (browser download). */
        saveText(name, text, folder = 'exports') {
            name = fsx.safeName(name);
            if (isNw()) {
                const fs = require('fs');
                const path = require('path');
                const dir = path.join(DevConsole.getProjectPath(), folder);
                if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
                const file = path.join(dir, name);
                fs.writeFileSync(file, text, 'utf8');
                return file;
            }
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 200);
            return name;
        },
        /** Loads a JSON file from the project's data folder (used by the validator). */
        loadJson(url) {
            return new Promise((resolve) => {
                const xhr = new XMLHttpRequest();
                xhr.open('GET', url);
                xhr.overrideMimeType('application/json');
                xhr.onload = () => {
                    try { resolve(JSON.parse(xhr.responseText)); } catch (e) { resolve(null); }
                };
                xhr.onerror = () => resolve(null);
                xhr.send();
            });
        }
    };
    D.fs = fsx;

    //=========================================================================
    // Log: themed console output + a ring buffer the panel renders
    //=========================================================================
    const LEVELS = { log: 0, info: 1, ok: 2, warn: 3, error: 4 };
    const COLORS = { log: '#aab2e0', info: '#8ea2ff', ok: '#5fe0b7', warn: '#ffc15e', error: '#ff7a93' };
    const raw = {
        log: console.log.bind(console), info: (console.info || console.log).bind(console),
        warn: console.warn.bind(console), error: console.error.bind(console),
        table: (console.table || console.log).bind(console)
    };
    const feed = [];
    const FEED_MAX = 400;
    const feedListeners = new Set();
    let feedSeq = 0;
    let inMirror = false;

    function pushFeed(level, text, extra) {
        const last = feed[feed.length - 1];
        if (last && last.level === level && last.text === text && !last.pre) {
            last.count++;
            last.t = Date.now();
        } else {
            feed.push(Object.assign({ id: ++feedSeq, t: Date.now(), level, text, count: 1 }, extra));
            if (feed.length > FEED_MAX) feed.shift();
        }
        feedListeners.forEach(fn => { try { fn(); } catch (e) { /* a broken listener must not break logging */ } });
    }

    function formatArgs(args) {
        if (!args.length) return '';
        let head = args[0];
        let rest = args.slice(1);
        let out;
        if (typeof head === 'string' && head.includes('%c')) {
            let used = 0;
            out = head.replace(/%c/g, () => { used++; return ''; });
            rest = rest.slice(used);
        } else {
            out = typeof head === 'string' ? head : inspect(head, 1);
        }
        const tail = rest.map(a => (typeof a === 'string' ? a : inspect(a, 1))).join(' ');
        return (out + (tail ? ' ' + tail : '')).slice(0, 4000);
    }

    /** Mirrors console.log/info/warn/error into the feed without changing what the console prints. */
    function installMirror() {
        if (installMirror.done) return;
        installMirror.done = true;
        for (const level of ['log', 'info', 'warn', 'error', 'debug']) {
            const orig = console[level];
            if (typeof orig !== 'function') continue;
            console[level] = function (...args) {
                orig.apply(console, args);
                if (inMirror) return;
                inMirror = true;
                try {
                    const text = formatArgs(args);
                    if (text.trim()) pushFeed(level === 'debug' ? 'log' : level, text);
                } catch (e) { /* ignore */ } finally { inMirror = false; }
            };
        }
    }

    const BADGE = 'background:#252a4a;color:#8ea2ff;padding:1px 8px;border-radius:4px;font-weight:600;';
    function emit(level, msg, extra) {
        const method = level === 'error' ? raw.error : level === 'warn' ? raw.warn : raw.log;
        method('%c dev %c ' + msg, BADGE, `color:${COLORS[level]}`, ...(extra === undefined ? [] : [extra]));
        pushFeed(level, String(msg));
        if (level !== 'log' && level !== 'info') toast(msg, level);
    }
    const log = {
        line: (msg) => { raw.log(msg); pushFeed('log', String(msg)); },
        info: (msg, extra) => emit('info', msg, extra),
        ok: (msg, extra) => emit('ok', msg, extra),
        warn: (msg, extra) => emit('warn', msg, extra),
        err: (msg, extra) => emit('error', msg, extra),
        /** Heading + aligned rows, printed once so it stays together in both consoles. */
        block(title, lines, level = 'info') {
            raw.log('%c dev %c ' + title + '\n%c' + lines.join('\n'), BADGE, `color:${COLORS[level]};font-weight:600`, 'color:#9aa3d6;font-family:monospace');
            pushFeed('log', title + '\n' + lines.join('\n'), { pre: true });
        },
        table(rows, title) {
            if (title) raw.log('%c dev %c ' + title, BADGE, `color:${COLORS.info};font-weight:600`);
            raw.table(rows);
            pushFeed('log', (title ? title + '\n' : '') + tableText(rows), { pre: true });
        }
    };
    D.log = log;
    D.feed = { items: feed, listeners: feedListeners, clear() { feed.length = 0; feedListeners.forEach(fn => fn()); } };

    //=========================================================================
    // Toasts
    //=========================================================================
    let toastHost = null;
    function toast(msg, level = 'info', ms = 2600) {
        if (!cfg.toasts || !S.ready) return;
        try {
            if (!toastHost) toastHost = h('div', { class: 'dtm-toasts', 'aria-live': 'polite' });
            const root = D.root();
            if (toastHost.parentNode !== root) root.appendChild(toastHost);
            while (toastHost.childNodes.length >= 4) toastHost.firstChild.remove();
            const el = h('div', { class: 'dtm-toast ' + level, text: String(msg).slice(0, 160) });
            toastHost.appendChild(el);
            setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 260); }, ms);
        } catch (e) { /* toasts are cosmetic */ }
    }
    D.toast = toast;

    //=========================================================================
    // Root element + theme
    //=========================================================================
    let rootEl = null;
    D.root = function () {
        if (rootEl && rootEl.isConnected) return rootEl;
        if (!document.getElementById('dtm-style')) {
            const st = document.createElement('style');
            st.id = 'dtm-style';
            st.textContent = D.css;
            document.head.appendChild(st);
        }
        rootEl = h('div', { id: 'dtm-root', class: 'dtm-root' });
        document.body.appendChild(rootEl);
        return rootEl;
    };

    // Press / scroll events on dev UI must never reach the game's TouchInput.
    // Release events are deliberately allowed through so a drag that ends over
    // the panel can't leave the game thinking the mouse is still held down.
    const BLOCKED = ['mousedown', 'mousemove', 'wheel', 'touchstart', 'touchmove', 'pointerdown', 'dblclick', 'contextmenu'];
    D.shield = function (el) {
        for (const type of BLOCKED) el.addEventListener(type, (e) => e.stopPropagation(), { passive: type !== 'wheel' ? true : false });
        return el;
    };

    D.css = `
.dtm-root{--ink:#14172b;--ink2:#1b1f38;--ink3:#262b4b;--line:#343b66;--text:#e6e9fb;--dim:#8f96bd;--acc:#8ea2ff;--acc2:#2b3470;--ok:#5fe0b7;--warn:#ffc15e;--err:#ff7a93;
position:fixed;inset:0;pointer-events:none;z-index:9000;color:var(--text);
font:12.5px/1.45 "Segoe UI Variable Text","Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;letter-spacing:.005em}
.dtm-root *{box-sizing:border-box}
.dtm-root button,.dtm-root input,.dtm-root select{font:inherit;color:inherit}
.dtm-mono{font-family:ui-monospace,"Cascadia Mono","SF Mono",Consolas,"Liberation Mono",monospace;font-variant-numeric:tabular-nums}
.dtm-root :focus-visible{outline:2px solid var(--acc);outline-offset:1px}

/* ---------- HUD chips ---------- */
.dtm-hud{position:absolute;left:100px;top:6px;display:none;flex-wrap:wrap;gap:4px;max-width:calc(100% - 120px);pointer-events:none;user-select:none}
.dtm-hud.show{display:flex}
.dtm-chip{display:inline-flex;align-items:center;gap:6px;padding:2px 9px 2px 7px;border-radius:999px;background:rgba(20,23,43,.88);border:1px solid var(--line);font-size:11.5px;white-space:nowrap}
.dtm-chip i{width:7px;height:7px;border-radius:50%;background:var(--acc)}
.dtm-chip.ok i{background:var(--ok)} .dtm-chip.warn i{background:var(--warn)} .dtm-chip.err i{background:var(--err)}
.dtm-chip b{font-weight:600} .dtm-chip span{color:var(--dim)}

/* ---------- Panel shell ---------- */
.dtm-panel{position:absolute;top:8px;bottom:8px;width:min(380px,calc(100% - 16px));display:none;flex-direction:column;pointer-events:auto;
background:rgba(20,23,43,.965);border:1px solid var(--line);border-radius:14px;box-shadow:0 14px 40px rgba(4,6,20,.55);overflow:hidden;transition:opacity .18s}
.dtm-panel.open{display:flex}
.dtm-panel.right{right:8px} .dtm-panel.left{left:8px}
.dtm-panel.ghost{opacity:.3} .dtm-panel.ghost:hover{opacity:.96}
.dtm-head{display:flex;align-items:center;gap:8px;padding:10px 10px 6px 14px}
.dtm-title{font-size:14px;font-weight:650;letter-spacing:.01em}
.dtm-sub{color:var(--dim);font-size:11.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1}
.dtm-icon{width:26px;height:26px;border-radius:8px;border:1px solid transparent;background:transparent;color:var(--dim);cursor:pointer;display:grid;place-items:center;font-size:14px;line-height:1}
.dtm-icon:hover{background:var(--ink3);color:var(--text)} .dtm-icon.on{background:var(--acc2);color:#fff}

/* ---------- Frame ribbon ---------- */
.dtm-ribbon{margin:0 12px;padding:8px 10px 6px;background:var(--ink2);border:1px solid var(--line);border-radius:10px}
.dtm-ribbon canvas{display:block;width:100%;height:36px}
.dtm-reads{display:flex;gap:14px;margin-top:5px;font-size:11.5px;color:var(--dim)}
.dtm-reads b{color:var(--text);font-weight:600}

/* ---------- Tabs ---------- */
.dtm-tabs{display:flex;gap:2px;margin:10px 12px 0;padding:3px;background:var(--ink2);border-radius:10px}
.dtm-tab{flex:1;padding:5px 4px;border:0;border-radius:8px;background:transparent;color:var(--dim);cursor:pointer;font-weight:550}
.dtm-tab:hover{color:var(--text)} .dtm-tab.on{background:var(--acc2);color:#fff}
.dtm-body{flex:1;min-height:0;overflow:auto;padding:10px 12px 12px;scrollbar-width:thin;scrollbar-color:var(--line) transparent}
.dtm-body::-webkit-scrollbar{width:8px} .dtm-body::-webkit-scrollbar-thumb{background:var(--line);border-radius:8px}
.dtm-foot{padding:6px 14px 9px;color:var(--dim);font-size:11px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:8px}

/* ---------- Controls ---------- */
.dtm-h{margin:14px 0 6px;font-size:12px;font-weight:650;color:var(--text)} .dtm-h:first-child{margin-top:2px}
.dtm-h small{font-weight:400;color:var(--dim);margin-left:6px}
.dtm-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:6px}
.dtm-btn{padding:6px 9px;border-radius:8px;border:1px solid var(--line);background:var(--ink2);cursor:pointer;text-align:left;transition:background .12s,border-color .12s}
.dtm-btn:hover{background:var(--ink3);border-color:#4a5390} .dtm-btn:active{transform:translateY(1px)}
.dtm-btn.pri{background:var(--acc2);border-color:#4658b8;color:#fff} .dtm-btn.pri:hover{background:#34408a}
.dtm-btn.danger{border-color:#7a3350;color:#ffb3c2} .dtm-btn[disabled]{opacity:.45;cursor:default}
.dtm-pill{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 9px;border-radius:8px;border:1px solid var(--line);background:var(--ink2);cursor:pointer;text-align:left}
.dtm-pill:hover{background:var(--ink3)} .dtm-pill span{white-space:nowrap}
.dtm-pill u{text-decoration:none;width:26px;height:14px;border-radius:999px;background:#3a4170;position:relative;flex:none;transition:background .15s}
.dtm-pill u::after{content:"";position:absolute;top:2px;left:2px;width:10px;height:10px;border-radius:50%;background:#aab2e0;transition:transform .15s,background .15s}
.dtm-pill.on{border-color:#4658b8} .dtm-pill.on u{background:var(--ok)} .dtm-pill.on u::after{transform:translateX(12px);background:#0d1f19}
.dtm-card{padding:10px;border:1px solid var(--line);border-radius:10px;background:var(--ink2);margin-bottom:10px}
.dtm-card>.dtm-h{margin-top:0}
.dtm-row{display:flex;align-items:center;gap:6px;margin:6px 0}
.dtm-row>label{flex:1;color:var(--dim)}
.dtm-in{width:100%;min-width:0;padding:5px 8px;border-radius:7px;border:1px solid var(--line);background:#101328;outline:none}
.dtm-in:focus{border-color:var(--acc)} .dtm-in.sm{width:74px;text-align:right}
.dtm-cmd{display:flex;gap:6px;margin:5px 0;align-items:center}
.dtm-cmd .dtm-btn{flex:none;min-width:84px} .dtm-cmd .dtm-in{flex:1}
.dtm-note{color:var(--dim);font-size:11.5px;margin:4px 0}
.dtm-stat{display:grid;grid-template-columns:1fr auto;gap:2px 10px;font-size:12px}
.dtm-stat>span:nth-child(odd){color:var(--dim)}
.dtm-bar{height:6px;border-radius:99px;background:#101328;overflow:hidden;margin:3px 0 7px}
.dtm-bar>i{display:block;height:100%;border-radius:99px;background:var(--ok);transition:width .25s}
.dtm-bar.warn>i{background:var(--warn)} .dtm-bar.err>i{background:var(--err)}
.dtm-empty{padding:18px 8px;text-align:center;color:var(--dim)}

/* ---------- Console ---------- */
.dtm-console{display:flex;flex-direction:column;height:100%}
.dtm-filters{display:flex;gap:4px;margin-bottom:6px}
.dtm-filters .dtm-btn{padding:3px 9px;font-size:11.5px} .dtm-filters .dtm-btn.on{background:var(--acc2);color:#fff;border-color:#4658b8}
.dtm-log{flex:1;min-height:120px;overflow:auto;background:#0f1226;border:1px solid var(--line);border-radius:8px;padding:4px 0;scrollbar-width:thin;scrollbar-color:var(--line) transparent}
.dtm-line{display:flex;gap:8px;padding:2px 9px 2px 8px;border-left:3px solid transparent;font-size:11.5px;white-space:pre-wrap;word-break:break-word}
.dtm-line time{color:#5d648f;flex:none} .dtm-line em{font-style:normal;color:var(--dim);flex:none}
.dtm-line.info{border-color:var(--acc)} .dtm-line.ok{border-color:var(--ok)} .dtm-line.warn{border-color:var(--warn);color:#ffe3ab} .dtm-line.error{border-color:var(--err);color:#ffc2cd}
.dtm-pre{margin:0 0 5px;padding:1px 10px 3px 69px;overflow-x:auto;white-space:pre;font-size:11px;line-height:1.5;color:#aab2e0;border-left:3px solid transparent;scrollbar-width:thin;scrollbar-color:var(--line) transparent}
.dtm-pre.info{border-color:var(--acc)} .dtm-pre.ok{border-color:var(--ok)} .dtm-pre.warn{border-color:var(--warn)} .dtm-pre.error{border-color:var(--err)}
.dtm-prompt{display:flex;align-items:center;gap:6px;margin-top:6px}
.dtm-prompt span{color:var(--acc);font-weight:700}
.dtm-hint{margin-top:4px;color:var(--dim);font-size:11px;min-height:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* ---------- Data tab ---------- */
.dtm-seg{display:flex;gap:4px;margin-bottom:8px} .dtm-seg .dtm-btn{flex:1;text-align:center} .dtm-seg .dtm-btn.on{background:var(--acc2);color:#fff;border-color:#4658b8}
.dtm-data{margin-top:8px;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.dtm-drow{display:flex;align-items:center;gap:8px;padding:4px 8px;border-bottom:1px solid #20254a}
.dtm-drow:last-child{border-bottom:0} .dtm-drow .id{color:var(--dim);width:34px;flex:none;text-align:right} .dtm-drow .nm{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dtm-drow .dtm-in{width:92px;padding:2px 6px;text-align:right}
.dtm-sw{width:30px;height:16px;border-radius:99px;background:#3a4170;border:0;position:relative;cursor:pointer;flex:none}
.dtm-sw::after{content:"";position:absolute;top:2px;left:2px;width:12px;height:12px;border-radius:50%;background:#aab2e0;transition:transform .15s}
.dtm-sw.on{background:var(--ok)} .dtm-sw.on::after{transform:translateX(14px);background:#0d1f19}

/* ---------- Perf tab ---------- */
.dtm-brow{display:grid;grid-template-columns:118px 1fr 58px;gap:8px;align-items:center;font-size:11.5px;margin:2px 0}
.dtm-brow .dtm-bar{margin:0} .dtm-brow .v{text-align:right;color:var(--dim)}
.dtm-brow .n{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* ---------- Toasts ---------- */
.dtm-toasts{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);display:flex;flex-direction:column;gap:6px;align-items:center;pointer-events:none}
.dtm-toast{padding:6px 14px;border-radius:9px;background:rgba(20,23,43,.96);border:1px solid var(--line);border-left:4px solid var(--acc);box-shadow:0 6px 20px rgba(4,6,20,.5);max-width:80vw;transition:opacity .25s,transform .25s}
.dtm-toast.ok{border-left-color:var(--ok)} .dtm-toast.warn{border-left-color:var(--warn)} .dtm-toast.error{border-left-color:var(--err)}
.dtm-toast.out{opacity:0;transform:translateY(6px)}

@media (prefers-reduced-motion:reduce){.dtm-root *{transition:none!important;animation:none!important}}
@media (max-width:760px){.dtm-grid{grid-template-columns:repeat(2,1fr)}}
`;

    //=========================================================================
    // Tool: Mock loading screen  (was DebugMockLoadingScreen)
    //  - mockload()       toggles the spinner hold at any time
    //  - Boot hold        keeps the game on the boot scene until released
    //  Fix: the old plugin blocked Graphics.endLoading for the whole session
    //  with no way back. This one is a switch and can be released.
    //=========================================================================
    const MockLoad = (() => {
        let held = false;          // spinner is being held
        let bootScene = null;      // Scene_Boot we are holding back
        let bootStart = null;      // the start() we skipped
        let endPatched = false;

        function patchEnd() {
            if (endPatched || typeof Graphics.endLoading !== 'function') return;
            endPatched = true;
            const orig = Graphics.endLoading;
            Graphics.endLoading = function () {
                if (held) return;
                return orig.apply(this, arguments);
            };
        }

        /** Called once, after every other Scene_Boot.start patch in this plugin is in place. */
        function installBoot() {
            if (!cfg.mockBoot) return;
            const base = Scene_Boot.prototype.start;
            Scene_Boot.prototype.start = function () {
                if (cfg.mockBoot && !bootScene) {
                    bootScene = this;
                    bootStart = base;
                    held = true;
                    log.warn('Loading screen held at boot. Run mockload(false) or use the panel to continue.');
                    return;
                }
                return base.apply(this, arguments);
            };
        }

        function set(on) {
            patchEnd();
            if (on) {
                held = true;
                if (typeof Graphics.startLoading === 'function') Graphics.startLoading();
                log.ok('Loading screen held. Run mockload(false) to release it.');
            } else {
                held = false;
                if (bootScene) {
                    const scene = bootScene, start = bootStart;
                    bootScene = null; bootStart = null;
                    cfg.mockBoot = false;
                    start.call(scene);
                }
                if (typeof Graphics.endLoading === 'function') Graphics.endLoading();
                log.ok('Loading screen released.');
            }
            return held;
        }

        return {
            installBoot,
            call(on) { return set(on === undefined ? !held : !!on); },
            isHeld: () => held,
            isBootHeld: () => !!bootScene
        };
    })();
    D.MockLoad = MockLoad;

    //=========================================================================
    // Tool: Actor stats export  (was DebugStatsExporter)
    //  Fixes: trait names now match MZ's trait codes (11 is Element Rate, not
    //  "Skill"); "Initial Skills" really lists skills; no stray message box
    //  when called from the console; writes into <project>/exports.
    //=========================================================================
    const Stats = (() => {
        const TRAIT_NAMES = {
            11: 'Element Rate', 12: 'Debuff Rate', 13: 'State Rate', 14: 'State Resist',
            21: 'Parameter', 22: 'Ex-Parameter', 23: 'Sp-Parameter',
            31: 'Attack Element', 32: 'Attack State', 33: 'Attack Speed', 34: 'Attack Times+', 35: 'Attack Skill',
            41: 'Skill Type Add', 42: 'Skill Type Seal', 43: 'Skill Add', 44: 'Skill Seal',
            51: 'Equip Weapon Type', 52: 'Equip Armor Type', 53: 'Equip Lock', 54: 'Equip Seal', 55: 'Slot Type',
            61: 'Action Times+', 62: 'Special Flag', 63: 'Collapse Effect', 64: 'Party Ability'
        };
        const PARAMS = ['MHP', 'MMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI', 'LUK'];
        const XPARAMS = ['HIT', 'EVA', 'CRI', 'CEV', 'MEV', 'MRF', 'CNT', 'HRG', 'MRG', 'TRG'];
        const SPARAMS = ['TGR', 'GRD', 'REC', 'PHA', 'MCR', 'TCR', 'PDR', 'MDR', 'FDR', 'EXR'];
        const FLAGS = ['Auto Battle', 'Guard', 'Substitute', 'Preserve TP'];
        const COLLAPSE = ['Normal', 'Boss', 'Instant', 'No Disappear'];
        const ABILITY = ['Encounter Half', 'Encounter None', 'Cancel Surprise', 'Raise Preemptive', 'Gold Double', 'Drop Item Double'];
        const nm = (arr, i, fallback = 'Unknown') => (arr && arr[i]) || `${fallback} #${i}`;
        const pct = (v) => `${(v * 100).toFixed(1)}%`;
        const rule = (c, n = 80) => c.repeat(n);

        function formatTrait(t) {
            const label = TRAIT_NAMES[t.code] || `Trait ${t.code}`;
            const d = t.dataId, v = t.value;
            let body;
            switch (t.code) {
                case 11: body = `${nm($dataSystem.elements, d, 'Element')} x${pct(v)}`; break;
                case 12: body = `${PARAMS[d] || 'Param ' + d} x${pct(v)}`; break;
                case 13: body = `${nm($dataStates.map(s => s && s.name), d, 'State')} x${pct(v)}`; break;
                case 14: body = nm($dataStates.map(s => s && s.name), d, 'State'); break;
                case 21: body = `${PARAMS[d] || 'Param ' + d} x${pct(v)}`; break;
                case 22: body = `${XPARAMS[d] || 'XParam ' + d} +${pct(v)}`; break;
                case 23: body = `${SPARAMS[d] || 'SParam ' + d} x${pct(v)}`; break;
                case 31: body = nm($dataSystem.elements, d, 'Element'); break;
                case 32: body = `${nm($dataStates.map(s => s && s.name), d, 'State')} +${pct(v)}`; break;
                case 33: body = String(v); break;
                case 34: body = `+${v}`; break;
                case 35: case 43: case 44: body = `${nm($dataSkills.map(s => s && s.name), d, 'Skill')} (ID ${d})`; break;
                case 41: case 42: body = nm($dataSystem.skillTypes, d, 'Skill type'); break;
                case 51: body = nm($dataSystem.weaponTypes, d, 'Weapon type'); break;
                case 52: body = nm($dataSystem.armorTypes, d, 'Armor type'); break;
                case 53: case 54: body = nm($dataSystem.equipTypes, d, 'Equip type'); break;
                case 55: body = d === 1 ? 'Dual Wield' : 'Normal'; break;
                case 61: body = `+${pct(v)}`; break;
                case 62: body = FLAGS[d] || `Flag ${d}`; break;
                case 63: body = COLLAPSE[d] || `Effect ${d}`; break;
                case 64: body = ABILITY[d] || `Ability ${d}`; break;
                default: body = `Data ${d}, Value ${v}`;
            }
            return `  - ${label}: ${body}\n`;
        }

        function formatActor(actor) {
            let out = `ACTOR #${actor.id}: ${actor.name}\n${rule('-')}\n`;
            const cls = $dataClasses[actor.classId];
            out += `Nickname: ${actor.nickname}\nClass: ${cls ? cls.name : 'None'}\n`;
            out += `Initial Level: ${actor.initialLevel}\nMax Level: ${actor.maxLevel}\n\n`;

            const temp = new Game_Actor(actor.id);
            const top = Math.min(actor.maxLevel, 99);
            const row = (lvl) => {
                temp.changeLevel(lvl, false);
                return { level: lvl, p: PARAMS.map((_, i) => temp.param(i)) };
            };

            const init = row(actor.initialLevel);
            out += 'INITIAL STATS (at initial level):\n';
            PARAMS.forEach((p, i) => { out += `  ${p}: ${init.p[i]}\n`; });
            out += '\n';

            out += 'STAT GROWTH BY LEVEL:\nLevel |   HP  |   MP  | ATK | DEF | MAT | MDF | AGI | LUK\n' + rule('-', 70) + '\n';
            const rows = [];
            for (let lvl = 1; lvl <= top; lvl++) {
                const r = row(lvl);
                rows.push(r);
                out += `${String(lvl).padStart(5)} | ${String(r.p[0]).padStart(5)} | ${String(r.p[1]).padStart(5)} | ` +
                    r.p.slice(2).map(x => String(x).padStart(3)).join(' | ') + '\n';
            }
            out += '\nHP/MP GAINS PER LEVEL:\nLevel | HP Gain | MP Gain\n' + rule('-', 30) + '\n';
            for (let i = 1; i < rows.length; i++) {
                out += `${String(rows[i].level).padStart(5)} | ${String(rows[i].p[0] - rows[i - 1].p[0]).padStart(7)} | ${String(rows[i].p[1] - rows[i - 1].p[1]).padStart(7)}\n`;
            }
            out += '\n';

            out += 'LEARNED SKILLS:\n';
            temp.changeLevel(actor.initialLevel, false);
            const initial = temp.skills();
            if (initial.length) {
                out += 'At initial level:\n';
                initial.forEach(s => { out += `  - ${s.name} (ID ${s.id})\n`; });
                out += '\n';
            }
            if (cls && cls.learnings && cls.learnings.length) {
                out += 'Skills by level:\n';
                cls.learnings.forEach(l => {
                    const s = $dataSkills[l.skillId];
                    if (!s) return;
                    out += `  Lv ${l.level}: ${s.name} (ID ${s.id})\n`;
                    out += `    Type: ${$dataSystem.skillTypes[s.stypeId] || 'None'}\n`;
                    out += `    MP Cost: ${s.mpCost} | TP Cost: ${s.tpCost}\n`;
                    if (s.description) out += `    Description: ${s.description}\n`;
                });
            } else {
                out += '  No skills learned by level\n';
            }
            out += '\n';

            out += 'ACTOR TRAITS:\n';
            out += actor.traits && actor.traits.length ? actor.traits.map(formatTrait).join('') : '  None\n';
            out += '\nCLASS TRAITS:\n';
            out += cls && cls.traits && cls.traits.length ? cls.traits.map(formatTrait).join('') : '  None\n';

            out += '\nEQUIPMENT SLOTS:\n';
            const slots = temp.equipSlots();
            out += slots.length
                ? slots.map((t, i) => `  Slot ${i + 1}: ${$dataSystem.equipTypes[t] || 'Unknown'}\n`).join('')
                : '  No equipment slots\n';
            if (actor.profile) out += `\nPROFILE:\n${actor.profile}\n`;
            if (actor.note) out += `\nNOTES:\n${actor.note}\n`;
            return out;
        }

        /** stats() exports every actor, stats(3) just actor 3. Returns the saved path. */
        function exportStats(actorId) {
            if (!$dataActors || !$dataClasses || !$dataSkills || !$dataSystem) {
                log.err('Database is not loaded yet. Try again once the game has started.');
                return null;
            }
            const ids = actorId
                ? [Number(actorId)]
                : $dataActors.map((a, i) => (a ? i : 0)).filter(Boolean);
            if (actorId && !$dataActors[ids[0]]) { log.err(`Actor ${actorId} does not exist.`); return null; }

            let out = `${rule('=')}\nRPG MAKER MZ - ACTOR STATS EXPORT\nGenerated: ${new Date().toLocaleString()}\n${rule('=')}\n\n`;
            let done = 0;
            for (const id of ids) {
                try {
                    out += formatActor($dataActors[id]) + `\n${rule('=')}\n\n`;
                    done++;
                } catch (e) {
                    out += `ACTOR #${id}: export failed (${e.message})\n\n${rule('=')}\n\n`;
                    log.warn(`Actor ${id} could not be exported: ${e.message}`);
                }
            }
            const file = fsx.saveText(actorId ? `ActorStats_${actorId}.txt` : 'ActorStats_Export.txt', out);
            log.ok(`Exported ${done} actor(s) to ${file}`);
            return file;
        }

        return { export: exportStats, formatActor, formatTrait };
    })();
    D.Stats = Stats;

    //=========================================================================
    // Tool: Event forcer  (was NuclearEventForcer)
    //  Fixes: runs once per frame (the old plugin hooked Scene_Map.update AND
    //  Game_Map.update, so events ran twice as fast); keeps its own interpreters
    //  (Game_Event.refresh() throws away event._interpreter on non-parallel
    //  events, which silently stopped them); skips events with no active page
    //  (page() is undefined and list() would throw); drops targets on map change.
    //=========================================================================
    const Nuke = (() => {
        const targets = [];
        let mapId = 0;
        let installed = false;

        function install() {
            if (installed) return;
            installed = true;
            const orig = Game_Map.prototype.update;
            Game_Map.prototype.update = function (sceneActive) {
                orig.call(this, sceneActive);
                if (targets.length) tick(this);
            };
        }

        function tick(map) {
            if (map.mapId() !== mapId) {
                log.warn('Map changed: event forcer cleared.');
                targets.length = 0;
                return;
            }
            for (let i = targets.length - 1; i >= 0; i--) {
                const t = targets[i];
                const ev = t.event;
                try {
                    if (map._events[ev._eventId] !== ev) { targets.splice(i, 1); continue; }
                    const page = ev.page();
                    if (!page || !page.list || page.list.length < 2) continue;
                    if (!t.interp.isRunning()) t.interp.setup(page.list, ev._eventId);
                    t.interp.update();
                } catch (e) {
                    log.err(`Forced event ${ev._eventId} failed and was removed: ${e.message}`);
                    targets.splice(i, 1);
                }
            }
        }

        function matcher(what) {
            if (typeof what === 'number') return (ev) => ev._eventId === what;
            const tag = String(what === undefined ? 'traffic' : what).trim();
            const esc = tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const re = new RegExp(`<nuke\\s*:\\s*${esc}\\s*>`, 'i');
            return (ev) => { const d = ev.event(); return !!(d && re.test(d.note || '')); };
        }

        /** nuke("traffic") forces every event tagged <nuke:traffic>; nuke(5) forces event 5. */
        function activate(what) {
            if (!$gameMap || !$dataMap) { log.err('No map is loaded.'); return 0; }
            install();
            targets.length = 0;
            mapId = $gameMap.mapId();
            const test = matcher(what);
            for (const ev of $gameMap.events()) {
                if (!ev || !test(ev)) continue;
                const page = ev.page();
                if (!page || !page.list || page.list.length < 2) continue;
                targets.push({ event: ev, interp: new Game_Interpreter() });
            }
            if (targets.length) log.ok(`Forcing ${targets.length} event(s) every frame: ${targets.map(t => t.event._eventId).join(', ')}`);
            else log.warn(typeof what === 'number' ? `Event ${what} has no active page to run.` : `No events with <nuke:${what === undefined ? 'traffic' : what}> and a runnable page on this map.`);
            return targets.length;
        }

        function stop() {
            const n = targets.length;
            targets.length = 0;
            log.ok(n ? `Stopped forcing ${n} event(s).` : 'Nothing was being forced.');
            return n;
        }

        function list() {
            const rows = targets.map(t => ({ id: t.event._eventId, name: (t.event.event() || {}).name, x: t.event.x, y: t.event.y, running: t.interp.isRunning() }));
            if (rows.length) log.table(rows, 'Forced events'); else log.info('No events are being forced.');
            return rows;
        }

        return { activate, stop, list, count: () => targets.length };
    })();
    D.Nuke = Nuke;

    //=========================================================================
    // Tool: Project validator  (was PluginContentValidator)
    //  Fixes: scans every map (the old code looked for $dataSystem.mapInfos,
    //  which doesn't exist, so it only ever scanned the open map); results no
    //  longer pile up across runs; plugin commands are checked with MZ's real
    //  "Plugin:command" key and report *why* they fail; script-call check uses
    //  real global lookups instead of flagging every "Game_" class; notetag
    //  names are discovered from the installed plugins instead of a hard-coded
    //  list; </closing> tags and "a < b" in notes no longer cause false hits;
    //  exporting no longer pops a message box.
    //=========================================================================
    const Validate = (() => {
        // Tags that were hard-coded in the stand-alone validator. Kept so existing projects behave the same.
        const BASE_TAGS = ('note meta description cooldown cooldownreduce quickskill quickcost hpcost hpcostflat requirehp requiretp ' +
            'limitbreak usesperbattle finisher finisherthreshold statedamagebonus buildmomentum requiremomentum consumemomentum ' +
            'stance stanceskill requirestance pierce piercepercent backstab aoe passive passivestate onattackstate onattackselfstate ' +
            'onhitstate hpregen mpregen tpregen multihit randomhits execute chargeskill stackmax momentum slipdamage slipheal ' +
            'slipdamagepercent sliphealpercent slipformula slipmpdamage slipmpheal slipmpdamagepercent slipmphealpercent slipmpformula ' +
            'sliptpdamage sliptpgain sliptpdamagepercent sliptpgainpercent sliptpformula slipchance hide removebyaction criticalguaranteed ' +
            'reviveparty chargetime stunchance equip sideviewsprite respawn casttomove castmove height spriteheight torsoratio ' +
            'doublesizer triplesizer nosizer light lightradius lightcolor lightintensity nolight lamp nojump jumpheight loot lootchance ' +
            'loottable minimap minimapicon nominimap timetrigger openhours closedhours weather noweather equipimg equipcustimg1 ' +
            'equipcustimg2 equipsvimg1 equipsvimg2 armorimageitem weaponimageitem custarmortypemodeitem custequipmotionmodeitem ' +
            'custweapontypemodeitem equipspriteconfigitem equipspriteenableitem nuke').split(/\s+/);

        const allowed = new Set();
        const listeners = new Set();
        let report = null;
        let running = false;
        let progress = { done: 0, total: 0, label: '' };
        let discovered = null;                      // Set of tag names found in plugin sources
        const similarCache = new Map();

        const setProgress = (done, total, label) => { progress = { done, total, label }; listeners.forEach(fn => { try { fn(); } catch (e) { /* ignore */ } }); };
        const wait = () => new Promise(r => setTimeout(r, 0));

        //---------------------------------------------------------------------
        // Similarity (typo suggestions)
        //---------------------------------------------------------------------
        function lev(a, b) {
            if (a === b) return 0;
            let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
            for (let i = 1; i <= a.length; i++) {
                const cur = [i];
                for (let j = 1; j <= b.length; j++) {
                    cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
                }
                prev = cur;
            }
            return prev[b.length];
        }
        function closest(word, pool, min = 0.7) {
            word = word.toLowerCase();
            let best = null, bestScore = 0;
            for (const cand of pool) {
                const c = cand.toLowerCase();
                const len = Math.max(word.length, c.length);
                if (!len || Math.abs(word.length - c.length) > 3) continue;
                const score = (len - lev(word, c)) / len;
                if (score > bestScore) { bestScore = score; best = cand; }
            }
            return bestScore >= min ? best : null;
        }

        //---------------------------------------------------------------------
        // Known notetags: built-ins + user list + names found inside plugin sources
        //---------------------------------------------------------------------
        function discoverTags() {
            const found = new Set();
            if (!isNw()) return found;
            try {
                const fs = require('fs');
                const path = require('path');
                const base = path.join(DevConsole.getProjectPath(), 'js', 'plugins');
                for (const p of ($plugins || [])) {
                    if (!p || !p.status) continue;
                    const file = path.join(base, String(p.name).replace(/\.js$/i, '') + '.js');
                    if (!fs.existsSync(file) || fs.statSync(file).size > 3 * 1024 * 1024) continue;
                    const src = fs.readFileSync(file, 'utf8');
                    let m;
                    const tagRe = /<\/?([A-Za-z_][\w ]{0,38}?)\s*[:>]/g;
                    while ((m = tagRe.exec(src))) found.add(m[1].trim().toLowerCase());
                    const metaRe = /meta(?:\.([A-Za-z_]\w*)|\[\s*['"]([^'"]+)['"]\s*\])/g;
                    while ((m = metaRe.exec(src))) found.add((m[1] || m[2]).toLowerCase());
                }
            } catch (e) {
                log.warn('Could not read plugin sources for notetag discovery: ' + e.message);
            }
            return found;
        }

        const tagKey = (name) => String(name).trim().replace(/^\//, '').trim().toLowerCase();
        function isKnownTag(name) {
            const k = tagKey(name);
            return BASE_TAGS.includes(k) || allowed.has(k) || cfg.knownTags.includes(k) || (discovered && discovered.has(k));
        }
        function suggestTag(name) {
            const k = tagKey(name);
            if (similarCache.has(k)) return similarCache.get(k);
            const pool = new Set([...BASE_TAGS, ...allowed, ...cfg.knownTags, ...(discovered || [])]);
            const hit = closest(k, pool, 0.72);
            const text = hit ? `Did you mean <${hit}>?` : 'Not found in any active plugin. Check the plugin documentation or whitelist it with validate.allow("' + k + '").';
            similarCache.set(k, text);
            return text;
        }

        //---------------------------------------------------------------------
        // Scanners
        //---------------------------------------------------------------------
        function scanNote(r, note, where) {
            if (!note) return;
            const re = /<(\/?[A-Za-z_][^<>:]*)(:?)([^>]*)>/g;
            let m;
            while ((m = re.exec(note))) {
                const name = m[1].trim();
                if (name.length > 40) continue;
                if (!isKnownTag(name)) {
                    r.orphanedNotetags.push({ location: where, tag: tagKey(name), fullTag: m[0].length > 80 ? m[0].slice(0, 77) + '...' : m[0], suggestion: suggestTag(name) });
                }
            }
            note.split(/\r?\n/).forEach((line, i) => {
                if (/<[A-Za-z\/]/.test(line) && !/<[A-Za-z\/][^<>]*>/.test(line)) {
                    r.malformedNotetags.push({ location: where, tag: line.trim().slice(0, 80), issue: `Unclosed tag on line ${i + 1}` });
                }
                if (/<<|>>/.test(line) && /<<[A-Za-z]/.test(line)) {
                    r.malformedNotetags.push({ location: where, tag: line.trim().slice(0, 80), issue: `Doubled bracket on line ${i + 1}` });
                }
            });
        }

        function globalExists(name) {
            try { return (0, eval)(`typeof ${name}`) !== 'undefined'; } catch (e) { return true; }
        }

        function scanScript(r, script, where, ctx) {
            const re = /(?<![\w$.])([A-Z][A-Za-z0-9_]*)\.[A-Za-z_]\w*\s*\(/g;
            let m;
            const seen = new Set();
            while ((m = re.exec(script))) {
                const ns = m[1];
                if (seen.has(ns)) continue;
                seen.add(ns);
                if (!globalExists(ns)) {
                    r.scriptCallIssues.push(Object.assign({ location: where, script: script.slice(0, 100), possibleIssue: `"${ns}" is not defined (plugin missing or disabled?)` }, ctx));
                }
            }
        }

        function scanList(r, list, where, ctx, plugins) {
            if (!list) return;
            for (let i = 0; i < list.length; i++) {
                const c = list[i];
                if (!c) continue;
                const here = Object.assign({}, ctx, { commandIndex: i });
                if (c.code === 357) {
                    const short = String(c.parameters[0]).split('/').pop().replace(/\.js$/i, '');
                    const cmd = c.parameters[1];
                    const key = `${short}:${cmd}`;
                    let problem = null;
                    if (!plugins.active.has(short)) {
                        problem = plugins.known.has(short) ? `Plugin "${short}" is turned off in the plugin list` : `Plugin "${short}" is not installed`;
                    } else if (!plugins.commands.has(key)) {
                        problem = `Plugin "${short}" has no command "${cmd}"`;
                    }
                    if (problem) {
                        r.orphanedCommands.push(Object.assign({
                            location: where, command: `${short} > ${cmd}`, args: c.parameters[3] || {}, problem,
                            suggestion: closest(key, plugins.commands, 0.6) ? `Did you mean ${closest(key, plugins.commands, 0.6)}?` : 'No similar command found'
                        }, here));
                    }
                } else if (c.code === 355) {
                    let script = String(c.parameters[0] || '');
                    while (list[i + 1] && list[i + 1].code === 655) { i++; script += '\n' + list[i].parameters[0]; }
                    scanScript(r, script, where, here);
                } else if (c.code === 111 && c.parameters[0] === 12) {
                    scanScript(r, String(c.parameters[1] || ''), where, here);
                }
            }
        }

        function scanEvents(r, events, mapLabel, plugins) {
            let count = 0;
            for (const ev of (events || [])) {
                if (!ev) continue;
                count++;
                const base = `${mapLabel} / event ${ev.id} "${ev.name}"`;
                scanNote(r, ev.note, base);
                (ev.pages || []).forEach((page, pi) => scanList(r, page.list, base + ` / page ${pi + 1}`, { eventId: ev.id, pageIndex: pi }, plugins));
            }
            return count;
        }

        function buildPluginInfo() {
            const active = new Set(), known = new Set(), commands = new Set();
            for (const p of ($plugins || [])) {
                if (!p) continue;
                const name = String(p.name).replace(/^.*[\\/]/, '').replace(/\.js$/i, '');
                known.add(name);
                if (p.status) active.add(name);
            }
            const cmds = PluginManager._commands || {};
            (cmds instanceof Map ? [...cmds.keys()] : Object.keys(cmds)).forEach(k => commands.add(k));
            return { active, known, commands };
        }

        //---------------------------------------------------------------------
        // Main run
        //---------------------------------------------------------------------
        async function run(opts = {}) {
            if (running) { log.warn('A validation is already running.'); return report; }
            if (typeof $plugins === 'undefined' || !$dataActors || !$dataSystem) {
                log.err('The database is not loaded yet. Run validate() after the game has started.');
                return null;
            }
            running = true;
            similarCache.clear();
            const t0 = performance.now();
            const r = {
                timestamp: new Date().toISOString(),
                scope: { maps: 0, events: 0, commonEvents: 0, troops: 0, dbEntries: 0 },
                orphanedCommands: [], orphanedNotetags: [], malformedNotetags: [], scriptCallIssues: [],
                plugins: [], commands: []
            };
            try {
                setProgress(0, 1, 'Reading plugins');
                discovered = discoverTags();
                const plugins = buildPluginInfo();
                r.plugins = [...plugins.active].sort();
                r.commands = [...plugins.commands].sort();

                // Database notes
                const dbs = [['Actors', $dataActors], ['Classes', $dataClasses], ['Skills', $dataSkills], ['Items', $dataItems],
                    ['Weapons', $dataWeapons], ['Armors', $dataArmors], ['Enemies', $dataEnemies], ['States', $dataStates],
                    ['Tilesets', typeof $dataTilesets !== 'undefined' ? $dataTilesets : null]];
                setProgress(0, 1, 'Database notes');
                for (const [label, data] of dbs) {
                    (data || []).forEach((e, i) => { if (e && e.note) { r.scope.dbEntries++; scanNote(r, e.note, `${label} #${i} "${e.name || ''}"`); } });
                }
                await wait();

                // Common events + troops
                ($dataCommonEvents || []).forEach((ce, i) => {
                    if (!ce) return;
                    r.scope.commonEvents++;
                    scanList(r, ce.list, `Common event ${i} "${ce.name}"`, { eventId: `CE${i}`, pageIndex: 0 }, plugins);
                });
                ($dataTroops || []).forEach((tr, i) => {
                    if (!tr) return;
                    r.scope.troops++;
                    (tr.pages || []).forEach((pg, pi) => scanList(r, pg.list, `Troop ${i} "${tr.name}" / page ${pi + 1}`, { eventId: `T${i}`, pageIndex: pi }, plugins));
                });
                await wait();

                // Maps
                const infos = ($dataMapInfos || []).filter(Boolean);
                const liveId = $gameMap ? $gameMap.mapId() : 0;
                for (let n = 0; n < infos.length; n++) {
                    const info = infos[n];
                    setProgress(n, infos.length, `Map ${info.id} ${info.name}`);
                    let data = null;
                    if (info.id === liveId && $dataMap) data = $dataMap;
                    else data = await fsx.loadJson(`data/Map${String(info.id).padStart(3, '0')}.json`);
                    if (!data) { log.warn(`Map ${info.id} (${info.name}) could not be read and was skipped.`); continue; }
                    const label = `Map ${info.id} "${info.name}"`;
                    r.scope.maps++;
                    scanNote(r, data.note, label + ' (map note)');
                    r.scope.events += scanEvents(r, data.events, label, plugins);
                    if (n % 4 === 3) await wait();
                }
                setProgress(infos.length, infos.length, 'Done');
            } catch (e) {
                log.err('Validation stopped: ' + e.message);
                console.error(e);
            } finally {
                running = false;
            }
            r.seconds = (performance.now() - t0) / 1000;
            report = r;
            print(r);
            listeners.forEach(fn => { try { fn(); } catch (e) { /* ignore */ } });
            return report;
        }

        function total(r) { return r.orphanedCommands.length + r.orphanedNotetags.length + r.malformedNotetags.length + r.scriptCallIssues.length; }

        function print(r) {
            const lines = [];
            const sec = (title, items, fmtItem, max = 20) => {
                lines.push('', `${title} (${items.length})`);
                if (!items.length) { lines.push('  none'); return; }
                items.slice(0, max).forEach((it, i) => lines.push(...fmtItem(it, i)));
                if (items.length > max) lines.push(`  ... and ${items.length - max} more (validate.export() has all of them)`);
            };
            lines.push(`Scanned ${r.scope.maps} maps, ${r.scope.events} events, ${r.scope.commonEvents} common events, ${r.scope.troops} troops, ${r.scope.dbEntries} database notes in ${fmt(r.seconds, 2)}s`);
            sec('Broken plugin commands', r.orphanedCommands, (x) => [`  - ${x.location}`, `      ${x.command}: ${x.problem}. ${x.suggestion}`]);
            // group notetags by name so one typo used 200 times is one line
            const groups = new Map();
            r.orphanedNotetags.forEach(x => { const g = groups.get(x.tag) || { tag: x.tag, n: 0, ex: [], suggestion: x.suggestion }; g.n++; if (g.ex.length < 2) g.ex.push(x.location); groups.set(x.tag, g); });
            sec('Unrecognized notetags', [...groups.values()].sort((a, b) => b.n - a.n), (g) => [`  - <${g.tag}> x${g.n}  (${g.ex.join('; ')})`, `      ${g.suggestion}`]);
            sec('Malformed notetags', r.malformedNotetags, (x) => [`  - ${x.location}`, `      ${x.issue}: ${x.tag}`]);
            sec('Script calls to missing globals', r.scriptCallIssues, (x) => [`  - ${x.location}`, `      ${x.possibleIssue}`]);
            const n = total(r);
            log.block(`Validation finished: ${n} issue(s)`, lines, n ? 'warn' : 'ok');
            if (n) toast(`Validation found ${n} issue(s)`, 'warn'); else toast('Validation clean', 'ok');
        }

        function exportReport() {
            if (!report) { log.warn('Nothing to export yet. Run validate() first.'); return null; }
            const r = report;
            const line = '='.repeat(80);
            let o = `${line}\nRPG MAKER MZ - PLUGIN CONTENT VALIDATION REPORT\nGenerated: ${new Date(r.timestamp).toLocaleString()}\n${line}\n\n`;
            o += `SUMMARY\n${'-'.repeat(80)}\nTotal issues: ${total(r)}\n`;
            o += `  Broken plugin commands: ${r.orphanedCommands.length}\n  Unrecognized notetags: ${r.orphanedNotetags.length}\n`;
            o += `  Malformed notetags: ${r.malformedNotetags.length}\n  Script call issues: ${r.scriptCallIssues.length}\n`;
            o += `  Scanned: ${r.scope.maps} maps, ${r.scope.events} events, ${r.scope.commonEvents} common events, ${r.scope.troops} troops, ${r.scope.dbEntries} database notes\n\n`;
            o += `ACTIVE PLUGINS (${r.plugins.length})\n${'-'.repeat(80)}\n${r.plugins.map((p, i) => `${i + 1}. ${p}`).join('\n')}\n\n`;
            o += `REGISTERED PLUGIN COMMANDS (${r.commands.length})\n${'-'.repeat(80)}\n${r.commands.join('\n')}\n\n`;
            const block = (title, items, f) => {
                o += `${line}\n${title}\n${line}\n`;
                o += items.length ? items.map((x, i) => `\n${i + 1}. ${f(x)}`).join('\n') + '\n' : '\nNone found.\n';
                o += '\n';
            };
            block('BROKEN PLUGIN COMMANDS', r.orphanedCommands, x => `${x.command}\n   Location: ${x.location}\n   Event: ${x.eventId}, page ${x.pageIndex + 1}, line ${x.commandIndex + 1}\n   Problem: ${x.problem}\n   Arguments: ${JSON.stringify(x.args)}\n   ${x.suggestion}`);
            block('UNRECOGNIZED NOTETAGS', r.orphanedNotetags, x => `${x.fullTag}\n   Location: ${x.location}\n   ${x.suggestion}`);
            block('MALFORMED NOTETAGS', r.malformedNotetags, x => `${x.issue}\n   Location: ${x.location}\n   Text: ${x.tag}`);
            block('SCRIPT CALL ISSUES', r.scriptCallIssues, x => `${x.possibleIssue}\n   Location: ${x.location}\n   Script: ${x.script}`);
            o += `${line}\nEND OF REPORT\n${line}\n`;
            const file = fsx.saveText(`Plugin_Validation_Report_${new Date().toISOString().slice(0, 10)}.txt`, o);
            log.ok(`Validation report saved to ${file}`);
            return file;
        }

        function allow(...tags) {
            tags.flat().forEach(t => allowed.add(tagKey(t)));
            similarCache.clear();
            log.ok(`Whitelisted: ${[...allowed].join(', ') || 'nothing'}. Run validate() again.`);
            return [...allowed];
        }

        return {
            run, export: exportReport, allow, listeners,
            last: () => report, isRunning: () => running, progress: () => progress, total
        };
    })();
    D.Validate = Validate;

    //=========================================================================
    // Tool: Frame profiler  (was DebugPerformanceDrainIdentifier)
    //  Fixes: hooks the ticker MZ really runs (Graphics._app.ticker, not
    //  PIXI.Ticker.shared) so "PIXI Full Frame" is no longer always empty;
    //  "Scene Logic" now wraps SceneManager.updateScene (Scene_Base.update
    //  never contained the map/event/player work it was labelled with);
    //  nested timers are no longer double-counted when computing Engine Core;
    //  the "Tilemap / Map" patch checked the wrong method; timers are
    //  exception-safe; every hook is a plain pass-through while the profiler
    //  is off, so leaving it installed costs next to nothing.
    //=========================================================================
    const Perf = (() => {
        const BUDGET = 1000 / 60;
        const NAMES = ['PIXI Full Frame', 'Render Pass', 'Scene Logic', 'Sprites / Spriteset', 'Player & Characters', 'Tilemap / Map',
            'Map Interpreter', 'Parallel Events', 'Common Events', 'Weather', 'Screen FX', 'Input', 'Audio', 'Battle Events', 'Engine Core'];
        const PINNED = ['PIXI Full Frame', 'Render Pass', 'Scene Logic'];
        const mk = () => ({ sum: 0, calls: 0, peak: 0 });
        const rep = {}, ui = {};
        NAMES.forEach(n => { rep[n] = mk(); ui[n] = mk(); });
        const plugRep = {}, plugUi = {};
        const spikes = [];
        const ring = new Float32Array(120);
        let ringN = 0, ringI = 0;
        const stamps = [];
        let active = false, consolePaused = false, installed = false, tickerHooked = false;
        let startedAt = performance.now(), lastRoll = performance.now(), lastUiRoll = performance.now();
        let uiSnap = null, repSnap = null;
        let depth = 0, inScene = false, topSum = 0;
        let coreGlobals = null;

        //---- accumulation -------------------------------------------------
        function bump(w, name, dt) {
            const b = w[name] || (w[name] = mk());
            b.sum += dt; b.calls++; if (dt > b.peak) b.peak = dt;
        }
        const add = (name, dt) => { bump(rep, name, dt); bump(ui, name, dt); };
        const credit = (name, dt) => { bump(plugRep, name, dt); bump(plugUi, name, dt); };
        function zero(w) { for (const k of Object.keys(w)) { w[k].sum = 0; w[k].calls = 0; w[k].peak = 0; } }

        function timed(bucket, orig, self, args) {
            const t0 = performance.now();
            depth++;
            try {
                return orig.apply(self, args);
            } finally {
                depth--;
                const dt = performance.now() - t0;
                add(bucket, dt);
                if (depth === 0 && inScene) topSum += dt;
            }
        }
        function wrap(obj, method, bucket) {
            if (!obj) return false;
            const orig = obj[method];
            if (typeof orig !== 'function' || orig.__dtm) return false;
            const w = function (...args) { return active ? timed(bucket, orig, this, args) : orig.apply(this, args); };
            w.__dtm = true;
            obj[method] = w;
            return true;
        }

        //---- helpers --------------------------------------------------------
        function where() {
            try {
                if (typeof $gameMap !== 'undefined' && $gameMap && $gameMap.mapId() > 0) {
                    const dn = $gameMap.displayName && $gameMap.displayName();
                    return dn || (($dataMapInfos[$gameMap.mapId()] || {}).name) || `Map ${$gameMap.mapId()}`;
                }
                return (SceneManager._scene && SceneManager._scene.constructor.name) || '-';
            } catch (e) { return '-'; }
        }
        const uptime = () => {
            const s = Math.floor((performance.now() - startedAt) / 1000);
            return `${pad2(Math.floor(s / 3600))}:${pad2(Math.floor((s % 3600) / 60))}:${pad2(s % 60)}`;
        };
        function fpsNow() {
            if (stamps.length < 2) return 0;
            const span = stamps[stamps.length - 1] - stamps[0];
            return span > 0 ? Math.round((stamps.length - 1) / (span / 1000)) : 0;
        }
        const bar = (pct, w = 24) => { const f = clamp(Math.round(pct / 100 * w), 0, w); return '#'.repeat(f) + '.'.repeat(w - f); };

        function compute(win, pwin) {
            const rows = [];
            for (const name of NAMES) {
                const b = win[name];
                if (!b || !b.calls) continue;
                const avg = b.sum / b.calls;
                rows.push({ name, avg, peak: b.peak, calls: b.calls, pct: avg / BUDGET * 100 });
            }
            const full = win['PIXI Full Frame'];
            const fullAvg = full.calls ? full.sum / full.calls : 0;
            const plugins = Object.keys(pwin).map(n => {
                const p = pwin[n];
                const avg = p.calls ? p.sum / p.calls : 0;
                return { name: n, avg, peak: p.peak, calls: p.calls, pct: avg / BUDGET * 100 };
            }).filter(p => p.avg > 0.01).sort((a, b) => b.avg - a.avg);
            return { frames: full.calls, fullAvg, fullPeak: full.peak, budgetPct: fullAvg / BUDGET * 100, rows, plugins, fps: fpsNow(), at: Date.now() };
        }

        //---- per-frame hook -------------------------------------------------
        function onFrame(t0, dt) {
            ring[ringI] = dt; ringI = (ringI + 1) % ring.length; if (ringN < ring.length) ringN++;
            stamps.push(t0); if (stamps.length > 121) stamps.shift();
            add('PIXI Full Frame', dt);
            if (dt > cfg.perfSpike) {
                spikes.push({ ms: dt, time: clock(), where: where() });
                if (spikes.length > 20) spikes.shift();
            }
            const t = performance.now();
            if (t - lastUiRoll >= 500) { uiSnap = compute(ui, plugUi); zero(ui); zero(plugUi); lastUiRoll = t; }
            if (t - lastRoll >= cfg.perfInterval) {
                lastRoll = t;
                repSnap = compute(rep, plugRep);
                zero(rep); zero(plugRep);
                if (cfg.perfReports && !consolePaused) printReport(repSnap);
            }
        }

        function hookTicker() {
            if (tickerHooked) return true;
            const app = Graphics._app || Graphics.app;
            const ticker = (app && app.ticker) || (window.PIXI && PIXI.Ticker && PIXI.Ticker.shared);
            if (!ticker || typeof ticker._tick !== 'function' || ticker._tick.__dtm) return false;
            const orig = ticker._tick;
            const wrapped = function (time) {
                if (!active) return orig.call(this, time);
                const t0 = performance.now();
                orig.call(this, time);
                onFrame(t0, performance.now() - t0);
            };
            wrapped.__dtm = true;
            ticker._tick = wrapped;
            // CPU time spent submitting the draw calls (GPU work itself is asynchronous)
            if (app && typeof app.render === 'function' && !app.render.__dtm) {
                const r = app.render;
                app.render = function () {
                    if (!active) return r.apply(this, arguments);
                    const t = performance.now();
                    try { return r.apply(this, arguments); } finally { add('Render Pass', performance.now() - t); }
                };
                app.render.__dtm = true;
            }
            tickerHooked = true;
            return true;
        }

        //---- engine patches (installed once, inert while off) ------------------
        function installPatches() {
            if (installed) return;
            installed = true;
            wrap(SceneManager, 'updateInputData', 'Input');
            wrap(AudioManager, 'checkErrors', 'Audio');
            wrap(Game_Map.prototype, 'update', 'Tilemap / Map');
            wrap(Game_Map.prototype, 'updateInterpreter', 'Map Interpreter');
            wrap(Game_Map.prototype, 'updateEvents', 'Player & Characters');
            wrap(Game_Map.prototype, 'updateVehicles', 'Player & Characters');
            wrap(Game_Player.prototype, 'update', 'Player & Characters');
            wrap(Game_Event.prototype, 'updateParallel', 'Parallel Events');
            if (typeof Game_CommonEvent !== 'undefined') wrap(Game_CommonEvent.prototype, 'update', 'Common Events');
            wrap(Spriteset_Map.prototype, 'update', 'Sprites / Spriteset');
            wrap(Spriteset_Battle.prototype, 'update', 'Sprites / Spriteset');
            if (typeof Weather !== 'undefined') wrap(Weather.prototype, 'update', 'Weather');
            wrap(Game_Screen.prototype, 'updateWeather', 'Weather');
            for (const m of ['updateFadeOut', 'updateTone', 'updateFlash', 'updateShake', 'updateZoom', 'updatePictures']) wrap(Game_Screen.prototype, m, 'Screen FX');
            for (const m of ['updateEvent', 'updatePhase']) wrap(BattleManager, m, 'Battle Events');

            // Scene Logic = everything SceneManager.updateScene does; Engine Core = what's left
            // after the top-level buckets that ran inside it (nested timers are not counted twice).
            const origScene = SceneManager.updateScene;
            const sceneWrap = function () {
                if (!active) return origScene.apply(this, arguments);
                const t0 = performance.now();
                inScene = true; topSum = 0;
                try {
                    return origScene.apply(this, arguments);
                } finally {
                    inScene = false;
                    const wall = performance.now() - t0;
                    add('Scene Logic', wall);
                    add('Engine Core', Math.max(0, wall - topSum));
                }
            };
            sceneWrap.__dtm = true;
            SceneManager.updateScene = sceneWrap;

            instrumentPlugins();
        }

        //---- per-plugin attribution -----------------------------------------
        const SKIP = new Set(['webkitStorageInfo', 'webkitIndexedDB', 'webkitRequestFileSystem', 'webkitResolveLocalFileSystemURL', 'openDatabase']);
        function isCtor(k) {
            if (SKIP.has(k)) return false;
            try {
                const d = Object.getOwnPropertyDescriptor(window, k);
                if (d && d.get && !d.value) return false;
                return typeof window[k] === 'function' && !!window[k].prototype;
            } catch (e) { return false; }
        }
        function snapshotGlobals() {
            coreGlobals = new Set(Object.keys(window).filter(isCtor));
        }
        const HOT = ['update', 'updateLogic', 'updateVisibility', 'updatePosition', 'updateOpacity', 'updateAnimation', 'updateFrame',
            'updateBitmap', 'updateColor', 'updateMove', 'refresh', 'redrawItem', 'processHandling', 'processCursorMove', 'processTouch'];
        function matchScore(a, b) {
            a = a.replace(/[_\-.]/g, '').toLowerCase();
            b = b.replace(/[_\-.]/g, '').toLowerCase();
            if (a === b) return 1000;
            if (a.includes(b)) return b.length * 2;
            if (b.includes(a)) return a.length;
            let best = 0;
            for (let len = Math.min(b.length, 8); len >= 4; len--) {
                for (let i = 0; i <= b.length - len; i++) if (a.includes(b.slice(i, i + len))) { best = Math.max(best, len); break; }
            }
            return best;
        }
        function wrapPlugin(ctor, method, plugin) {
            const proto = ctor && ctor.prototype;
            if (!proto || typeof proto[method] !== 'function' || proto[method].__dtm || proto[method].__dtmPlugin) return false;
            const orig = proto[method];
            const w = function (...args) {
                if (!active) return orig.apply(this, args);
                const t0 = performance.now();
                try { return orig.apply(this, args); } finally { credit(plugin, performance.now() - t0); }
            };
            w.__dtmPlugin = plugin;
            proto[method] = w;
            return true;
        }
        function instrumentPlugins() {
            if (!coreGlobals) return;
            const names = ($plugins || []).filter(p => p && p.status).map(p => String(p.name).replace(/^.*[\\/]/, '').replace(/\.js$/i, ''));
            let wrapped = 0;
            for (const g of Object.keys(window).filter(k => !coreGlobals.has(k) && isCtor(k))) {
                let best = null, bestScore = 3;
                for (const n of names) { const s = matchScore(g, n); if (s > bestScore) { bestScore = s; best = n; } }
                if (!best) continue;
                for (const m of HOT) if (wrapPlugin(window[g], m, best)) wrapped++;
            }
            for (const n of names) if (!plugRep[n]) { plugRep[n] = mk(); plugUi[n] = mk(); }
            log.info(`Profiler is watching ${wrapped} plugin methods across ${names.length} plugins.`);
        }

        //---- reports ---------------------------------------------------------
        function reportLines(snap) {
            const lines = [];
            const mem = performance.memory ? ` | heap ${(performance.memory.usedJSHeapSize / 1048576).toFixed(0)} MB` : '';
            lines.push(`${clock()}  ${where()}  up ${uptime()}  ${fpsNow()} FPS${mem}`);
            lines.push(`Frame budget  ${bar(Math.min(snap.budgetPct, 100), 20)} ${fmt(snap.budgetPct)}% of 16.67 ms  (avg ${fmt(snap.fullAvg, 2)} ms, peak ${fmt(snap.fullPeak, 2)} ms, ${snap.frames} frames)`);
            lines.push('-'.repeat(78));
            const rest = snap.rows.filter(r => !PINNED.includes(r.name)).sort((a, b) => b.avg - a.avg);
            const rows = [...snap.rows.filter(r => PINNED.includes(r.name)), ...rest];
            for (const r of rows) {
                if (r.pct < 1 && !PINNED.includes(r.name)) continue;
                lines.push(`${r.name.padEnd(22)} ${bar(Math.min(r.pct, 100))} ${fmt(r.pct).padStart(5)}%  ${r.avg.toFixed(3).padStart(7)} ms avg  ${r.peak.toFixed(3).padStart(8)} ms peak`);
            }
            if (snap.plugins.length) {
                lines.push('-'.repeat(78), 'Plugins with measured work');
                snap.plugins.slice(0, 8).forEach(p => lines.push(`  ${p.name.padEnd(36)} ${bar(Math.min(p.pct, 100), 14)} ${fmt(p.pct).padStart(5)}%  ${p.avg.toFixed(3).padStart(7)} ms avg`));
            }
            if (spikes.length) {
                lines.push('-'.repeat(78), `Recent spikes (over ${cfg.perfSpike} ms)`);
                spikes.slice(-5).forEach(s => lines.push(`  ${s.time}  ${String(s.where).padEnd(24)} ${fmt(s.ms, 2)} ms`));
            }
            return lines;
        }
        function printReport(snap) {
            if (!snap || snap.frames < 5) { log.info('Profiler is warming up: not enough frames yet.'); return null; }
            log.block('Profiler report', reportLines(snap), snap.budgetPct >= 100 ? 'error' : snap.budgetPct >= 60 ? 'warn' : 'ok');
            return snap;
        }

        //---- public ------------------------------------------------------------
        function start() {
            if (active) return true;
            try {
                installPatches();
                if (!hookTicker()) log.warn('Could not hook the render ticker. Scene and plugin timings still work.');
            } catch (e) {
                log.err('Profiler could not start: ' + e.message);
                return false;
            }
            zero(rep); zero(ui); zero(plugRep); zero(plugUi);
            spikes.length = 0; stamps.length = 0; ringN = 0; ringI = 0;
            startedAt = performance.now(); lastRoll = lastUiRoll = startedAt;
            uiSnap = null; repSnap = null;
            active = true;
            log.ok('Profiler on. Open the Perf tab or run perf.report().');
            return true;
        }
        function stop() {
            if (!active) return false;
            active = false;
            log.ok('Profiler off.');
            return true;
        }

        return {
            init() { snapshotGlobals(); },
            start, stop,
            toggle() { return active ? !stop() : start(); },
            isActive: () => active,
            report() { return printReport(repSnap || compute(rep, plugRep)); },
            budget() {
                const s = uiSnap || compute(ui, plugUi);
                log.info(`Frame budget: ${fmt(s.budgetPct)}% used (avg ${fmt(s.fullAvg, 3)} ms of 16.667, peak ${fmt(s.fullPeak, 3)} ms)`);
                return s.budgetPct;
            },
            fps: fpsNow,
            spikes() {
                if (!spikes.length) { log.ok('No spikes recorded.'); return []; }
                log.table(spikes.map(s => ({ time: s.time, where: s.where, ms: fmt(s.ms, 2) })), `Spikes over ${cfg.perfSpike} ms`);
                return spikes.slice();
            },
            reset() { zero(rep); zero(ui); zero(plugRep); zero(plugUi); spikes.length = 0; uiSnap = null; repSnap = null; startedAt = performance.now(); log.ok('Profiler counters reset.'); },
            pause() { consolePaused = true; log.info('Profiler console reports paused.'); },
            resume() { consolePaused = false; lastRoll = performance.now(); log.info('Profiler console reports resumed.'); },
            autoreport(on) { cfg.perfReports = on === undefined ? !cfg.perfReports : !!on; log.info(`Profiler console reports ${cfg.perfReports ? 'on' : 'off'}.`); return cfg.perfReports; },
            table() {
                const s = repSnap || compute(rep, plugRep);
                log.table(s.rows.map(r => ({ Bucket: r.name, 'Avg ms': r.avg.toFixed(3), 'Peak ms': r.peak.toFixed(3), '% of budget': fmt(r.pct) + '%', Calls: r.calls })));
                return s.rows;
            },
            pluginTable() {
                const s = repSnap || compute(rep, plugRep);
                log.table(s.plugins.map(p => ({ Plugin: p.name, 'Avg ms': p.avg.toFixed(3), 'Peak ms': p.peak.toFixed(3), Calls: p.calls })));
                return s.plugins;
            },
            snapshot: () => Object.assign({ active }, uiSnap || compute(ui, plugUi)),
            spikeList: () => spikes.slice(),
            frames: () => ({ data: ring, count: ringN, head: ringI }),
            BUDGET
        };
    })();
    D.Perf = Perf;

    //=========================================================================
    // Tool: Event stress test  (was NuclearEventThrottler)
    //  Fixes: the F9 listener was added on every map load, so after a few map
    //  changes one key press toggled the test several times; cleanup used
    //  _events.filter(), which compacts the array and shifts every event id
    //  (breaking $gameMap.event(id) for the rest of the session) and left the
    //  fake events inside $dataMap forever; the Game_Event.event() override
    //  (hit by every event, every frame) is gone; "Enable Animations" and
    //  "Show Markers" now actually do something; console.clear() no longer
    //  wipes your console; the test stops cleanly on map change and before any
    //  save so spawned events can never end up in a save file.
    //=========================================================================
    const Stress = (() => {
        const st = {
            active: false, wave: 0, total: 0, frame: 0, t0: 0, last: 0, fps: 60, low: 0,
            mapId: 0, dataRef: null, evRef: null, baseData: 0, baseGame: 0,
            sprites: [], history: [], samples: []
        };
        let installed = false;
        let markerBitmap = null;
        const conf = () => cfg.stress;

        function install() {
            if (installed) return;
            installed = true;
            const origUpdate = Scene_Map.prototype.update;
            Scene_Map.prototype.update = function () {
                origUpdate.call(this);
                if (st.active) tick();
            };
            // Whatever path saves the game (menu, autosave plugins, save()), spawned events are removed first.
            const origContents = DataManager.makeSaveContents;
            DataManager.makeSaveContents = function () {
                if (st.active) { log.warn('Stress test stopped before saving.'); stop(); }
                return origContents.apply(this, arguments);
            };
        }

        function sheets() {
            const set = new Set();
            ($dataActors || []).forEach(a => { if (a && a.characterName) set.add(a.characterName); });
            return [...set];
        }

        function makeData(id, x, y, pool) {
            const c = conf();
            const visible = c.animations && pool.length;
            const name = visible ? pool[Math.floor(Math.random() * pool.length)] : '';
            return {
                id, name: `StressEvent_${id}`, note: '', meta: {}, x, y,
                pages: [{
                    conditions: { actorId: 1, actorValid: false, itemId: 1, itemValid: false, selfSwitchCh: 'A', selfSwitchValid: false, switch1Id: 1, switch1Valid: false, switch2Id: 1, switch2Valid: false, variableId: 1, variableValid: false, variableValue: 0 },
                    image: { tileId: 0, characterName: name, characterIndex: name && name[0] !== '$' ? Math.floor(Math.random() * 8) : 0, direction: 2, pattern: 1 },
                    moveType: c.movement ? 1 + Math.floor(Math.random() * 2) : 0,
                    moveSpeed: 2 + Math.floor(Math.random() * 4),
                    moveFrequency: 2 + Math.floor(Math.random() * 4),
                    moveRoute: { list: [{ code: 0, parameters: [] }], repeat: true, skippable: false, wait: false },
                    walkAnime: !!visible, stepAnime: !!visible, directionFix: false, through: true,
                    priorityType: 0, trigger: 0, list: [{ code: 0, indent: 0, parameters: [] }]
                }]
            };
        }

        function spawn(want) {
            const c = conf();
            const count = Math.min(want, c.max - st.total);
            if (count <= 0) return 0;
            const w = $gameMap.width(), h = $gameMap.height();
            const spriteset = SceneManager._scene && SceneManager._scene._spriteset;
            const pool = sheets();
            let made = 0;
            for (let i = 0; i < count; i++) {
                try {
                    const id = $dataMap.events.length;
                    const data = makeData(id, Math.floor(Math.random() * w), Math.floor(Math.random() * h), pool);
                    $dataMap.events.push(data);
                    const ev = new Game_Event($gameMap.mapId(), id);
                    $gameMap._events[id] = ev;
                    made++;
                    if (spriteset && spriteset._tilemap) {
                        const sp = new Sprite_Character(ev);
                        if (c.markers) {
                            if (!markerBitmap) { markerBitmap = new Bitmap(8, 8); markerBitmap.fillRect(0, 0, 8, 8, '#ff4466'); }
                            const m = new Sprite(markerBitmap);
                            m.x = -4; m.y = -4; m.opacity = 160;
                            sp.addChild(m);
                        }
                        spriteset._characterSprites.push(sp);
                        spriteset._tilemap.addChild(sp);
                        st.sprites.push(sp);
                    }
                } catch (e) {
                    // roll back a half-made event so ids stay consistent
                    if ($dataMap.events.length - 1 >= st.baseData) { const last = $dataMap.events.length - 1; if ($gameMap._events[last] === undefined) $dataMap.events.pop(); }
                    log.err('Spawn failed: ' + e.message);
                    break;
                }
            }
            st.total += made;
            st.wave++;
            const mem = performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1048576) : null;
            st.history.push({ wave: st.wave, spawned: made, total: st.total, fps: Math.round(st.fps), heapMB: mem === null ? '-' : mem, seconds: fmt((performance.now() - st.t0) / 1000, 1) });
            log.info(`Wave ${st.wave}: +${made} events (${st.total} total, ${Math.round(st.fps)} FPS${mem === null ? '' : ', ' + mem + ' MB'})`);
            return made;
        }

        function tick() {
            const now = performance.now();
            if (st.last) { st.samples.push(now - st.last); if (st.samples.length > 30) st.samples.shift(); }
            st.last = now;
            if ($gameMap.mapId() !== st.mapId || $dataMap !== st.dataRef || $gameMap._events !== st.evRef) { abandon(); return; }
            if (st.samples.length >= 10) st.fps = 1000 / (st.samples.reduce((a, b) => a + b, 0) / st.samples.length);
            if (conf().autoStop && st.wave >= 2 && st.fps < 10) {
                if (++st.low > 90) { log.warn(`FPS collapsed to ${Math.round(st.fps)}. Stopping the stress test.`); stop(); return; }
            } else st.low = 0;
            if (++st.frame >= conf().interval) {
                st.frame = 0;
                if (st.total >= conf().max) { log.warn(`Event limit reached (${conf().max}).`); stop(); return; }
                spawn(conf().initial + st.wave * conf().increment);
            }
        }

        /** The map (or its data) changed under us: the old events are already gone, just reset. */
        function abandon() {
            log.warn('Map changed: stress test ended (its events went with the old map).');
            summarize();
            reset();
        }

        function reset() {
            st.active = false; st.sprites = []; st.samples = []; st.last = 0; st.low = 0;
            st.dataRef = null; st.evRef = null;
        }

        function summarize() {
            if (!st.history.length) return;
            const first = st.history[0], last = st.history[st.history.length - 1];
            log.table(st.history, `Stress test summary: ${st.total} events over ${st.wave} waves, FPS ${first.fps} to ${last.fps}`);
        }

        function cleanup() {
            const sameMap = $gameMap && $gameMap.mapId() === st.mapId && $dataMap === st.dataRef && $gameMap._events === st.evRef;
            if (sameMap) {
                $dataMap.events.length = st.baseData;
                $gameMap._events.length = st.baseGame;
                const ss = SceneManager._scene && SceneManager._scene._spriteset;
                if (ss && ss._characterSprites) {
                    const mine = new Set(st.sprites);
                    for (let i = ss._characterSprites.length - 1; i >= 0; i--) if (mine.has(ss._characterSprites[i])) ss._characterSprites.splice(i, 1);
                }
                st.sprites.forEach(s => { if (s.parent) s.parent.removeChild(s); });
            }
        }

        function start(opts) {
            if (st.active) return true;
            if (!(SceneManager._scene instanceof Scene_Map) || !$gameMap || !$dataMap || !$dataMap.events) {
                log.err('Start the stress test while standing on a map.');
                return false;
            }
            if (opts) config(opts, true);
            install();
            Object.assign(st, {
                active: true, wave: 0, total: 0, frame: 0, t0: performance.now(), last: 0, fps: 60, low: 0,
                mapId: $gameMap.mapId(), dataRef: $dataMap, evRef: $gameMap._events,
                baseData: $dataMap.events.length, baseGame: $gameMap._events.length,
                sprites: [], history: [], samples: []
            });
            log.warn('Stress test started. It will slow the game down on purpose. Run stress.stop() to end it.');
            spawn(conf().initial);
            return true;
        }

        function stop() {
            if (!st.active) { log.info('The stress test is not running.'); return false; }
            st.active = false;
            summarize();
            cleanup();
            log.ok(`Stress test stopped. Removed ${st.total} spawned events.`);
            const total = st.total;
            reset();
            return total;
        }

        function config(opts, quiet) {
            const c = conf();
            const o = opts || {};
            if ('initial' in o) c.initial = clamp(Math.round(num(o.initial, c.initial)), 1, 5000);
            if ('interval' in o) c.interval = clamp(Math.round(num(o.interval, c.interval)), 1, 600);
            if ('increment' in o) c.increment = clamp(Math.round(num(o.increment, c.increment)), 0, 2000);
            if ('max' in o) c.max = clamp(Math.round(num(o.max, c.max)), 10, 100000);
            for (const k of ['movement', 'animations', 'markers', 'autoStop']) if (k in o) c[k] = !!o[k];
            if (!quiet) log.ok('Stress settings: ' + inspect(c));
            return Object.assign({}, c);
        }

        return {
            start, stop, config,
            toggle(opts) { return st.active ? !!stop() : start(opts); },
            isActive: () => st.active,
            status: () => ({ active: st.active, wave: st.wave, total: st.total, fps: Math.round(st.fps), seconds: st.active ? (performance.now() - st.t0) / 1000 : 0 }),
            guard() { if (st.active) stop(); }
        };
    })();
    D.Stress = Stress;

    //=========================================================================
    // Command registry (filled by DevConsole; read by the panel and by help())
    //=========================================================================
    D.registry = [];
    D.reg = (def) => { D.registry.push(def); return def; };
    D.commandNames = () => D.registry.flatMap(d => [d.name, ...(d.aliases || [])]);

    //=========================================================================
    // HUD: status chips in the corner of the game window (replaces the plain
    // black text box; the element keeps its #devTool id)
    //=========================================================================
    const HUD = (() => {
        let el = null;
        let sig = '';
        let legacy = '';

        function chips() {
            const out = [];
            const add = (label, value, tone) => out.push({ label, value, tone });
            const nw = typeof SceneManager !== 'undefined' ? SceneManager._nwWindow : null;
            if (nw && nw.isOnTop()) add('On top', '', 'ok');
            if (SceneManager._freeze) add('Frozen', '', 'err');
            if (SceneManager.isRapid && SceneManager.isRapid()) add('Rapid', `x${D.speeds.rapid}`, 'warn');
            else if (SceneManager.isSlow && SceneManager.isSlow()) add('Slow', `1/${D.speeds.slow}`, 'warn');
            if (S.god) add('God', '', 'ok');
            if (S.noclip) add('Noclip', '', 'ok');
            if (Perf.isActive()) {
                const s = Perf.snapshot();
                add('Profiler', s.frames ? `${fmt(s.fullAvg, 1)} ms` : 'warming up', s.budgetPct >= 100 ? 'err' : s.budgetPct >= 60 ? 'warn' : 'ok');
            }
            if (Stress.isActive()) { const t = Stress.status(); add('Stress', `${t.total} events, ${t.fps} FPS`, t.fps < 30 ? 'err' : 'warn'); }
            if (Nuke.count()) add('Forcing', `${Nuke.count()} events`, 'warn');
            if (MockLoad.isHeld()) add('Loading held', '', 'warn');
            if (cfg.showMemory) {
                const m = nw && nw.getMemoryInfo ? nw.getMemoryInfo() : '';
                if (m) add('Memory', m.replace(/^Mem:\s*/, ''), '');
            }
            if (legacy.trim()) add(legacy.trim(), '', '');
            return out;
        }

        function render() {
            if (!el) return;
            const list = chips();
            const next = list.map(c => `${c.label}|${c.value}|${c.tone}`).join(';');
            if (next === sig) return;
            sig = next;
            el.textContent = '';
            for (const c of list) {
                el.appendChild(h('span', { class: 'dtm-chip ' + (c.tone || '') }, h('i'), h('b', { text: c.label }), c.value ? h('span', { text: c.value }) : null));
            }
            el.classList.toggle('show', list.length > 0);
        }

        return {
            mount() {
                el = h('div', { id: 'devTool', class: 'dtm-hud dtm-mono' });
                D.root().appendChild(el);
                return el;
            },
            render,
            setLegacy(text) { legacy = text || ''; render(); },
            element: () => el
        };
    })();
    D.HUD = HUD;
    D.speeds = { rapid: 2, slow: 2 };

    //=========================================================================
    // Panel
    //=========================================================================
    const Panel = (() => {
        const TAB_ORDER = ['tools', 'console', 'data', 'perf', 'lab'];
        const tabs = {};
        let el = null, bodyEl = null, tabBar = null, subEl = null, footL = null, footR = null, canvas = null, readsEl = null;
        let isOpen = false, tab = 'tools', ghost = false, dock = 'right';
        let current = null, timer = 0, raf = 0;

        // frame pacing samples for the ribbon (independent of the profiler)
        const dts = new Float32Array(90);
        let di = 0, dn = 0, lastT = 0, skip = 0, lastReads = 0;

        //---- small widgets -------------------------------------------------
        const noFocus = (e) => e.preventDefault();
        const btn = (label, onclick, cls = '', title = '') => h('button', { class: 'dtm-btn ' + cls, type: 'button', title, onmousedown: noFocus, onclick }, label);
        function pill(label, get, toggle, title = '') {
            const b = h('button', { class: 'dtm-pill', type: 'button', title, onmousedown: noFocus, onclick: () => { try { toggle(); } finally { sync(); } } }, h('span', { text: label }), h('u'));
            const sync = () => b.classList.toggle('on', !!get());
            sync();
            b.sync = sync;
            return b;
        }
        const field = (label, input) => h('div', { class: 'dtm-row' }, h('label', { text: label }), input);
        const numIn = (value, onchange, min, max) => h('input', { class: 'dtm-in sm dtm-mono', type: 'number', value, min, max, onchange: (e) => onchange(Number(e.target.value)) });
        D.ui = { btn, pill, field, numIn, noFocus };

        //---- ribbon ----------------------------------------------------------
        function sampleFrame(t) {
            raf = requestAnimationFrame(sampleFrame);
            if (lastT) { dts[di] = t - lastT; di = (di + 1) % dts.length; if (dn < dts.length) dn++; }
            lastT = t;
            if ((++skip & 3) === 0) drawRibbon();
            if (t - lastReads > 400) { lastReads = t; updateReads(); }
        }
        function avgDt(n = 30) {
            const c = Math.min(n, dn);
            if (!c) return 0;
            let s = 0;
            for (let k = 1; k <= c; k++) s += dts[(di - k + dts.length) % dts.length];
            return s / c;
        }
        function drawRibbon() {
            if (!canvas || !isOpen) return;
            const dpr = window.devicePixelRatio || 1;
            const w = Math.floor(canvas.clientWidth * dpr), hgt = Math.floor(canvas.clientHeight * dpr);
            if (!w || !hgt) return;
            if (canvas.width !== w || canvas.height !== hgt) { canvas.width = w; canvas.height = hgt; }
            const g = canvas.getContext('2d');
            if (!g) return;
            g.clearRect(0, 0, w, hgt);
            const n = dts.length, bw = w / n, MAX = 50;
            for (let i = 0; i < dn; i++) {
                const v = dts[(di - dn + i + n) % n];
                const bh = Math.max(2, Math.min(1, v / MAX) * hgt);
                g.fillStyle = v <= 18.5 ? '#5fe0b7' : v <= 26 ? '#ffc15e' : '#ff7a93';
                g.fillRect((n - dn + i) * bw + 0.5 * dpr, hgt - bh, Math.max(1, bw - 1.5 * dpr), bh);
            }
            g.strokeStyle = 'rgba(142,162,255,.55)';
            g.setLineDash([3 * dpr, 3 * dpr]);
            g.beginPath();
            const y = hgt - (1000 / 60 / MAX) * hgt;
            g.moveTo(0, y); g.lineTo(w, y); g.stroke();
            g.setLineDash([]);
        }
        function updateReads() {
            if (!readsEl) return;
            const a = avgDt();
            const fps = a ? Math.round(1000 / a) : 0;
            const mem = performance.memory ? `${Math.round(performance.memory.usedJSHeapSize / 1048576)} MB` : '-';
            readsEl.textContent = '';
            readsEl.append(
                h('span', {}, 'FPS ', h('b', { text: String(fps) })),
                h('span', {}, 'Frame ', h('b', { text: fmt(a, 1) + ' ms' })),
                h('span', {}, 'Heap ', h('b', { text: mem }))
            );
        }

        //---- shell --------------------------------------------------------------
        function sceneLabel() {
            const sc = SceneManager._scene;
            const name = sc ? sc.constructor.name : '-';
            try {
                if ($gameMap && $gameMap.mapId() > 0 && sc instanceof Scene_Map) {
                    const info = $dataMapInfos[$gameMap.mapId()];
                    return `Map ${$gameMap.mapId()} ${info ? info.name : ''}  (${$gamePlayer.x}, ${$gamePlayer.y})`;
                }
            } catch (e) { /* fall through */ }
            return name;
        }

        function build() {
            dock = cfg.dock === 'left' ? 'left' : 'right';
            canvas = h('canvas', { 'aria-label': 'Frame time history' });
            readsEl = h('div', { class: 'dtm-reads dtm-mono' });
            subEl = h('div', { class: 'dtm-sub' });
            footL = h('span');
            footR = h('span', { text: `${cfg.hotkey === 'Backquote' ? '`' : cfg.hotkey} closes` });
            tabBar = h('div', { class: 'dtm-tabs', role: 'tablist' });
            bodyEl = h('div', { class: 'dtm-body' });
            const ghostBtn = h('button', { class: 'dtm-icon', type: 'button', title: 'Fade the panel so you can see the game', onmousedown: noFocus, onclick: () => { ghost = !ghost; el.classList.toggle('ghost', ghost); ghostBtn.classList.toggle('on', ghost); } }, '\u25D0');
            const dockBtn = h('button', { class: 'dtm-icon', type: 'button', title: 'Move to the other side', onmousedown: noFocus, onclick: () => { dock = dock === 'right' ? 'left' : 'right'; el.classList.remove('left', 'right'); el.classList.add(dock); } }, '\u21C4');
            const closeBtn = h('button', { class: 'dtm-icon', type: 'button', title: 'Close', onmousedown: noFocus, onclick: close }, '\u2715');
            el = h('section', { class: 'dtm-panel ' + dock, role: 'dialog', 'aria-label': 'Dev tools' },
                h('div', { class: 'dtm-head' }, h('div', { class: 'dtm-title', text: 'Dev tools' }), subEl, ghostBtn, dockBtn, closeBtn),
                h('div', { class: 'dtm-ribbon' }, canvas, readsEl),
                tabBar, bodyEl,
                h('div', { class: 'dtm-foot' }, footL, footR));
            D.shield(el);
            // Escape closes the panel only while focus is inside it, so the game's own Escape menu is untouched.
            el.addEventListener('keydown', (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(); } });
            for (const name of TAB_ORDER) {
                tabBar.appendChild(h('button', { class: 'dtm-tab', type: 'button', role: 'tab', 'data-tab': name, onmousedown: noFocus, onclick: () => select(name) }, tabs[name].label));
            }
            D.root().appendChild(el);
        }

        function select(name) {
            if (!tabs[name]) return;
            tab = name;
            for (const b of tabBar.children) { const on = b.dataset.tab === name; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); }
            if (current && current.destroy) current.destroy();
            bodyEl.textContent = '';
            bodyEl.scrollTop = 0;
            current = tabs[name].build(bodyEl) || {};
            if (current.refresh) current.refresh();
        }

        function tick() {
            if (!isOpen) return;
            subEl.textContent = sceneLabel();
            footL.textContent = `${SceneManager._scene ? SceneManager._scene.constructor.name : '-'}`;
            if (current && current.refresh) { try { current.refresh(); } catch (e) { /* a tab must never take the panel down */ } }
        }

        function open() {
            if (!cfg.panel) return;
            if (!el) build();
            if (isOpen) return;
            isOpen = true;
            el.classList.add('open');
            select(tab);
            lastT = 0; dn = 0; di = 0;
            raf = requestAnimationFrame(sampleFrame);
            timer = setInterval(tick, 400);
            tick();
        }

        function close() {
            if (!isOpen) return;
            isOpen = false;
            el.classList.remove('open');
            cancelAnimationFrame(raf); raf = 0;
            clearInterval(timer); timer = 0;
            if (current && current.destroy) current.destroy();
            current = null;
            const a = document.activeElement;
            if (a && el.contains(a)) a.blur();
            if (typeof Input !== 'undefined') Input.clear();   // no key left "held" from typing in the panel
        }

        return {
            register(name, def) { tabs[name] = def; },
            open, close,
            toggle(force) { const want = force === undefined ? !isOpen : !!force; want ? open() : close(); return isOpen; },
            isOpen: () => isOpen,
            select(name) { if (!el) build(); if (!isOpen) open(); select(name); },
            currentTab: () => tab
        };
    })();
    D.Panel = Panel;

    //=========================================================================
    // Tab: Tools (mode switches + every registered command as a button)
    //=========================================================================
    Panel.register('tools', {
        label: 'Tools',
        build(box) {
            const { btn, pill } = D.ui;
            const pills = [];
            const modes = [
                ['God mode', () => S.god, () => window.god(), 'Party takes no damage'],
                ['Noclip', () => S.noclip, () => window.noclip(), 'Walk through walls'],
                ['Rapid', () => SceneManager.isRapid(), () => SceneManager.toggleRapid(), `Game speed x${D.speeds.rapid}`],
                ['Slow', () => SceneManager.isSlow(), () => SceneManager.toggleSlow(), `Game speed 1/${D.speeds.slow}`],
                ['Freeze', () => SceneManager._freeze, () => SceneManager.toggleFreeze(), 'Pause game updates'],
                ['Profiler', () => Perf.isActive(), () => Perf.toggle(), 'Frame profiler']
            ];
            if (isNw()) modes.splice(5, 0, ['On top', () => SceneManager._nwWindow && SceneManager._nwWindow.isOnTop(), () => SceneManager.toggleAlwaysOnTop(), 'Keep the game window above others']);
            const grid = h('div', { class: 'dtm-grid' });
            for (const [label, get, toggle, title] of modes) { const p = pill(label, get, toggle, title); pills.push(p); grid.appendChild(p); }
            box.append(h('div', { class: 'dtm-h', text: 'Modes' }), grid);

            const groups = [];
            for (const def of D.registry) {
                if (!def.panel) continue;
                let g = groups.find(x => x.name === def.group);
                if (!g) { g = { name: def.group, defs: [] }; groups.push(g); }
                g.defs.push(def);
            }
            const run = (def, inputs) => {
                const args = inputs.map((el, i) => {
                    const spec = def.panel.inputs[i];
                    if (el.value === '') return undefined;
                    return spec.type === 'number' ? Number(el.value) : el.value;
                });
                while (args.length && args[args.length - 1] === undefined) args.pop();
                const fn = window[def.name];
                if (typeof fn === 'function') fn(...args);
            };
            for (const g of groups) {
                const plain = h('div', { class: 'dtm-grid' });
                const withInputs = [];
                for (const def of g.defs) {
                    const spec = def.panel;
                    if (spec.inputs && spec.inputs.length) {
                        const inputs = spec.inputs.map(i => h('input', {
                            class: 'dtm-in dtm-mono', type: i.type === 'number' ? 'number' : 'text', value: i.def === undefined ? '' : i.def,
                            placeholder: i.label, title: i.label, 'aria-label': `${def.name} ${i.label}`,
                            onkeydown: (e) => { e.stopPropagation(); if (e.key === 'Enter') run(def, inputs); },
                            onkeyup: (e) => e.stopPropagation()
                        }));
                        withInputs.push(h('div', { class: 'dtm-cmd' }, btn(spec.label || def.name, () => run(def, inputs), '', def.desc), inputs));
                    } else {
                        plain.appendChild(btn(spec.label || def.name, () => run(def, []), spec.danger ? 'danger' : '', def.desc));
                    }
                }
                box.append(h('div', { class: 'dtm-h', text: g.name }));
                if (plain.childNodes.length) box.appendChild(plain);
                withInputs.forEach(n => box.appendChild(n));
            }
            box.appendChild(h('p', { class: 'dtm-note', text: 'Every button runs a console function of the same name. Type help() in the Console tab for the full list.' }));
            return { refresh() { pills.forEach(p => p.sync()); } };
        }
    });

    //=========================================================================
    // Tab: Console (live feed + prompt with history and completion)
    //=========================================================================
    Panel.register('console', {
        label: 'Console',
        build(box) {
            const { btn } = D.ui;
            let filter = 'all';
            const history = Panel._history || (Panel._history = []);
            let hIdx = -1;
            let scheduled = 0;

            const logEl = h('div', { class: 'dtm-log dtm-mono', role: 'log', 'aria-live': 'off' });
            const hint = h('div', { class: 'dtm-hint dtm-mono' });
            const input = h('input', {
                class: 'dtm-in dtm-mono', type: 'text', spellcheck: 'false', autocomplete: 'off', placeholder: 'tp(5, 5)  or  help()',
                'aria-label': 'Console input'
            });
            const filterBtns = {};
            const setFilter = (f) => { filter = f; Object.keys(filterBtns).forEach(k => filterBtns[k].classList.toggle('on', k === f)); draw(true); };
            const mkFilter = (key, label) => (filterBtns[key] = btn(label, () => setFilter(key)));

            const pass = (e) => (filter === 'all') || (filter === 'warn' ? (e.level === 'warn' || e.level === 'error') : e.level === 'error');
            function draw(stick) {
                scheduled = 0;
                const near = stick || (logEl.scrollHeight - logEl.scrollTop - logEl.clientHeight < 40);
                const items = D.feed.items.filter(pass).slice(-160);
                logEl.textContent = '';
                if (!items.length) logEl.appendChild(h('div', { class: 'dtm-empty', text: 'Nothing logged yet. Run a command below.' }));
                for (const e of items) {
                    // Multi-line output (help, reports, tables): title on the line, body in a scrollable block
                    const nl = e.pre ? e.text.indexOf('\n') : -1;
                    const title = nl > 0 ? e.text.slice(0, nl) : e.text;
                    logEl.appendChild(h('div', { class: 'dtm-line ' + e.level },
                        h('time', { text: clock(new Date(e.t)) }),
                        h('span', { text: title }),
                        e.count > 1 ? h('em', { text: `x${e.count}` }) : null));
                    if (nl > 0) logEl.appendChild(h('pre', { class: 'dtm-pre ' + e.level, text: e.text.slice(nl + 1) }));
                }
                if (near) logEl.scrollTop = logEl.scrollHeight;
            }
            const onFeed = () => { if (!scheduled) scheduled = requestAnimationFrame(() => draw(false)); };
            D.feed.listeners.add(onFeed);

            function names() { return D.commandNames().concat(['perf', 'stress', 'nuke', 'validate', 'stats', 'mockload', 'panel']); }
            function complete() {
                const v = input.value;
                const m = v.match(/[A-Za-z_$][\w$]*$/);
                if (!m) return;
                const hits = [...new Set(names())].filter(n => n.startsWith(m[0]) && n !== m[0]).sort();
                if (hits.length === 1) { input.value = v.slice(0, m.index) + hits[0] + '('; hint.textContent = usage(hits[0]); }
                else if (hits.length) hint.textContent = hits.slice(0, 8).join('   ');
            }
            function usage(name) {
                const d = D.registry.find(x => x.name === name || (x.aliases || []).includes(name));
                return d ? `${d.usage}  -  ${d.desc}` : '';
            }

            function run() {
                const code = input.value.trim();
                if (!code) return;
                if (history[history.length - 1] !== code) history.push(code);
                if (history.length > 80) history.shift();
                hIdx = -1;
                input.value = '';
                hint.textContent = '';
                D.feed.items.push({ id: -Date.now(), t: Date.now(), level: 'info', text: '> ' + code, count: 1, pre: true });
                onFeed();
                try {
                    const result = (0, eval)(code);
                    if (result && typeof result.then === 'function') {
                        result.then(v => { if (v !== undefined) raw.log(v); pushFeed('log', inspect(v, 1)); }, e => pushFeed('error', e && e.message ? e.message : String(e)));
                    } else if (result !== undefined) {
                        pushFeed('log', inspect(result, 1), { pre: true });
                    } else onFeed();
                } catch (e) {
                    pushFeed('error', e && e.message ? e.message : String(e));
                    raw.error(e);
                }
            }

            input.addEventListener('keydown', (e) => {
                e.stopPropagation();   // typing here must never drive the game
                if (e.key === 'Enter') { e.preventDefault(); run(); }
                else if (e.key === 'ArrowUp') { e.preventDefault(); if (history.length) { hIdx = hIdx < 0 ? history.length - 1 : Math.max(0, hIdx - 1); input.value = history[hIdx]; } }
                else if (e.key === 'ArrowDown') { e.preventDefault(); if (hIdx >= 0) { hIdx++; input.value = hIdx >= history.length ? '' : history[hIdx]; if (hIdx >= history.length) hIdx = -1; } }
                else if (e.key === 'Tab') { e.preventDefault(); complete(); }
            });
            input.addEventListener('keyup', (e) => {
                e.stopPropagation();
                if (e.key.length === 1 || e.key === 'Backspace') {
                    const m = input.value.match(/([A-Za-z_$][\w$]*)\(?$/);
                    hint.textContent = m ? usage(m[1]) : '';
                }
            });
            input.addEventListener('keypress', (e) => e.stopPropagation());

            box.append(h('div', { class: 'dtm-console' },
                h('div', { class: 'dtm-filters' }, mkFilter('all', 'All'), mkFilter('warn', 'Warnings'), mkFilter('error', 'Errors'),
                    h('span', { style: { flex: '1' } }), btn('Clear', () => D.feed.clear())),
                logEl,
                h('div', { class: 'dtm-prompt' }, h('span', { text: '>' }), input),
                hint));
            setFilter('all');
            setTimeout(() => input.focus(), 0);
            return { destroy() { D.feed.listeners.delete(onFeed); if (scheduled) cancelAnimationFrame(scheduled); } };
        }
    });

    //=========================================================================
    // Tab: Data (switches + variables editor)
    //=========================================================================
    Panel.register('data', {
        label: 'Data',
        build(box) {
            const { btn } = D.ui;
            let kind = 'switches';
            let query = '';
            let rows = [];
            const listEl = h('div', { class: 'dtm-data' });
            const note = h('p', { class: 'dtm-note' });
            const kinds = {};
            const swallow = (e) => e.stopPropagation();

            const search = h('input', {
                class: 'dtm-in', type: 'search', placeholder: 'Search by name or id', 'aria-label': 'Search',
                onkeydown: swallow, onkeyup: swallow, onkeypress: swallow,
                oninput: () => { query = search.value.trim().toLowerCase(); draw(); }
            });
            const setKind = (k) => { kind = k; Object.keys(kinds).forEach(x => kinds[x].classList.toggle('on', x === k)); draw(); };
            const mk = (k, label) => (kinds[k] = btn(label, () => setKind(k)));

            function ready() {
                return typeof $dataSystem !== 'undefined' && $dataSystem && typeof $gameSwitches !== 'undefined' && $gameSwitches &&
                    typeof $gameVariables !== 'undefined' && $gameVariables;
            }

            function makeRow(id, name) {
                const label = h('span', { class: 'nm', title: name, text: name || '(unnamed)' });
                let control, sync;
                if (kind === 'switches') {
                    control = h('button', { class: 'dtm-sw', type: 'button', role: 'switch', onmousedown: D.ui.noFocus, onclick: () => { $gameSwitches.setValue(id, !$gameSwitches.value(id)); sync(); } });
                    sync = () => { const on = !!$gameSwitches.value(id); control.classList.toggle('on', on); control.setAttribute('aria-checked', on); };
                } else {
                    control = h('input', {
                        class: 'dtm-in dtm-mono', type: 'text', 'aria-label': `Variable ${id}`,
                        onkeydown: (e) => { e.stopPropagation(); if (e.key === 'Enter') control.blur(); }, onkeyup: swallow, onkeypress: swallow,
                        onchange: () => {
                            const raw = control.value;
                            const n = Number(raw);
                            $gameVariables.setValue(id, raw.trim() !== '' && Number.isFinite(n) ? n : raw);
                        }
                    });
                    sync = () => { if (document.activeElement !== control) control.value = String($gameVariables.value(id)); };
                }
                sync();
                listEl.appendChild(h('div', { class: 'dtm-drow' }, h('span', { class: 'id dtm-mono', text: String(id) }), label, control));
                return { sync };
            }

            function draw() {
                listEl.textContent = '';
                rows = [];
                if (!ready()) {
                    listEl.appendChild(h('div', { class: 'dtm-empty', text: 'Start or load a game to edit switches and variables.' }));
                    note.textContent = '';
                    return;
                }
                const names = kind === 'switches' ? $dataSystem.switches : $dataSystem.variables;
                let matched = 0;
                for (let id = 1; id < names.length; id++) {
                    const name = names[id] || '';
                    if (query && !(name.toLowerCase().includes(query) || String(id) === query)) continue;
                    matched++;
                    if (rows.length < 100) rows.push(makeRow(id, name));
                }
                if (!matched) listEl.appendChild(h('div', { class: 'dtm-empty', text: 'Nothing matches that search.' }));
                note.textContent = matched > rows.length ? `Showing ${rows.length} of ${matched}. Search to narrow the list.` : '';
            }

            box.append(h('div', { class: 'dtm-seg' }, mk('switches', 'Switches'), mk('variables', 'Variables')), search, listEl, note);
            setKind('switches');
            return { refresh() { if (ready()) rows.forEach(r => r.sync()); } };
        }
    });

    //=========================================================================
    // Tab: Perf (live profiler view)
    //=========================================================================
    Panel.register('perf', {
        label: 'Perf',
        build(box) {
            const { btn, pill } = D.ui;
            const toggleBtn = btn('', () => { Perf.toggle(); refresh(); }, 'pri');
            const live = h('div');
            const reports = pill('Console reports', () => cfg.perfReports, () => Perf.autoreport(), 'Print a report to the console every interval');
            box.append(
                h('div', { class: 'dtm-grid' }, toggleBtn, btn('Print report', () => Perf.report()), btn('Reset', () => Perf.reset())),
                h('div', { style: { margin: '8px 0 10px' } }, reports),
                live);

            const tone = (pct) => (pct >= 100 ? 'err' : pct >= 60 ? 'warn' : '');
            const barRow = (name, pct, text) => h('div', { class: 'dtm-brow' },
                h('span', { class: 'n', title: name, text: name }),
                h('div', { class: 'dtm-bar ' + tone(pct) }, h('i', { style: { width: clamp(pct, 0, 100) + '%' } })),
                h('span', { class: 'v dtm-mono', text }));

            function refresh() {
                toggleBtn.textContent = Perf.isActive() ? 'Stop profiler' : 'Start profiler';
                reports.sync();
                live.textContent = '';
                if (!Perf.isActive()) {
                    live.append(h('div', { class: 'dtm-empty', text: 'The profiler is off. Start it to see where each frame goes.' }));
                    return;
                }
                const s = Perf.snapshot();
                if (!s.frames) { live.append(h('div', { class: 'dtm-empty', text: 'Collecting frames...' })); return; }
                live.append(
                    h('div', { class: 'dtm-h' }, 'Frame budget', h('small', { text: `${fmt(s.budgetPct)}% of 16.67 ms, ${s.fps} FPS` })),
                    barRow('Full frame', s.budgetPct, `${fmt(s.fullAvg, 2)} ms`),
                    h('div', { class: 'dtm-note', text: `Peak ${fmt(s.fullPeak, 1)} ms over ${s.frames} frames` }),
                    h('div', { class: 'dtm-h', text: 'Where it goes' }));
                const pinned = ['PIXI Full Frame'];
                s.rows.filter(r => !pinned.includes(r.name) && (r.pct >= 0.5 || r.name === 'Scene Logic' || r.name === 'Render Pass'))
                    .sort((a, b) => b.avg - a.avg)
                    .forEach(r => live.append(barRow(r.name, r.pct, `${fmt(r.avg, 2)} ms`)));
                if (s.plugins.length) {
                    live.append(h('div', { class: 'dtm-h', text: 'Plugins' }));
                    s.plugins.slice(0, 6).forEach(p => live.append(barRow(p.name, p.pct, `${fmt(p.avg, 2)} ms`)));
                }
                const sp = Perf.spikeList().slice(-4).reverse();
                if (sp.length) {
                    live.append(h('div', { class: 'dtm-h' }, 'Recent spikes', h('small', { text: `over ${cfg.perfSpike} ms` })));
                    sp.forEach(x => live.append(h('div', { class: 'dtm-note dtm-mono', text: `${x.time}  ${x.where}  ${fmt(x.ms, 1)} ms` })));
                }
            }
            return { refresh };
        }
    });

    //=========================================================================
    // Tab: Lab (stress test, event forcer, validator, stats export, loading hold)
    //=========================================================================
    Panel.register('lab', {
        label: 'Lab',
        build(box) {
            const { btn, pill, field, numIn } = D.ui;
            const swallow = (e) => e.stopPropagation();
            const textIn = (value, placeholder, w) => h('input', { class: 'dtm-in dtm-mono', type: 'text', value, placeholder, style: w ? { width: w } : null, onkeydown: swallow, onkeyup: swallow, onkeypress: swallow });
            const card = (title, ...kids) => h('div', { class: 'dtm-card' }, h('div', { class: 'dtm-h', text: title }), ...kids);
            const live = [];                         // functions refreshed every tick

            //---- Stress test ----------------------------------------------------
            const c = cfg.stress;
            const stressBtn = btn('', () => { Stress.toggle(); }, 'pri');
            const stressInfo = h('div', { class: 'dtm-note dtm-mono' });
            const stressPill = (label, key) => pill(label, () => c[key], () => { Stress.config({ [key]: !c[key] }, true); });
            const stressPills = [stressPill('Moving events', 'movement'), stressPill('Visible sprites', 'animations'), stressPill('Markers', 'markers'), stressPill('Auto-stop', 'autoStop')];
            box.append(card('Stress test',
                h('p', { class: 'dtm-note', text: 'Spawns more and more invisible events until the game slows down. Everything is removed when it stops.' }),
                field('First wave', numIn(c.initial, v => Stress.config({ initial: v }, true), 1, 5000)),
                field('Frames between waves', numIn(c.interval, v => Stress.config({ interval: v }, true), 1, 600)),
                field('Growth per wave', numIn(c.increment, v => Stress.config({ increment: v }, true), 0, 2000)),
                field('Event limit', numIn(c.max, v => Stress.config({ max: v }, true), 10, 100000)),
                h('div', { class: 'dtm-grid' }, stressPills),
                h('div', { style: { margin: '8px 0 4px' } }, stressBtn), stressInfo));
            live.push(() => {
                const t = Stress.status();
                stressBtn.textContent = t.active ? 'Stop stress test' : 'Start stress test';
                stressBtn.classList.toggle('danger', t.active);
                stressInfo.textContent = t.active ? `Wave ${t.wave} - ${t.total} events - ${t.fps} FPS - ${fmt(t.seconds, 0)} s` : (t.total ? `Last run: ${t.total} events over ${t.wave} waves.` : 'Not running.');
                stressPills.forEach(p => p.sync());
            });

            //---- Event forcer ----------------------------------------------------
            const tagIn = textIn('traffic', 'tag or event id');
            const nukeInfo = h('div', { class: 'dtm-note dtm-mono' });
            const forceNow = () => { const v = tagIn.value.trim(); window.nuke(/^\d+$/.test(v) ? Number(v) : (v || 'traffic')); };
            tagIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') forceNow(); });
            box.append(card('Event forcer',
                h('p', { class: 'dtm-note', text: 'Runs events tagged <nuke:tag> in their notes on every frame, whatever else is happening. Or give an event id.' }),
                h('div', { class: 'dtm-cmd' }, btn('Force', forceNow, 'pri'), tagIn),
                h('div', { class: 'dtm-grid' }, btn('Stop', () => window.nuke.stop()), btn('List', () => window.nuke.list())), nukeInfo));
            live.push(() => { nukeInfo.textContent = Nuke.count() ? `Forcing ${Nuke.count()} event(s).` : 'Nothing forced.'; });

            //---- Validator ---------------------------------------------------------
            const valBtn = btn('Validate', () => { Validate.run(); }, 'pri');
            const valInfo = h('div', { class: 'dtm-note' });
            const valList = h('div');
            box.append(card('Project validator',
                h('p', { class: 'dtm-note', text: 'Checks every map, common event and troop for plugin commands that no longer exist, unknown notetags and script calls to missing classes.' }),
                h('div', { class: 'dtm-grid' }, valBtn, btn('Export report', () => window.validate.export())), valInfo, valList));
            live.push(() => {
                valBtn.disabled = Validate.isRunning();
                const p = Validate.progress();
                const r = Validate.last();
                valList.textContent = '';
                if (Validate.isRunning()) { valInfo.textContent = `Scanning ${p.label} (${p.done}/${p.total})`; return; }
                if (!r) { valInfo.textContent = 'Not run yet.'; return; }
                const total = Validate.total(r);
                valInfo.textContent = total ? `${total} issue(s) across ${r.scope.maps} maps and ${r.scope.events} events.` : `Clean: ${r.scope.maps} maps and ${r.scope.events} events checked.`;
                const rows = [
                    ['Broken plugin commands', r.orphanedCommands.length], ['Unknown notetags', r.orphanedNotetags.length],
                    ['Malformed notetags', r.malformedNotetags.length], ['Missing script globals', r.scriptCallIssues.length]
                ];
                valList.append(h('div', { class: 'dtm-stat' }, rows.flatMap(([k, v]) => [h('span', { text: k }), h('span', { class: 'dtm-mono', text: String(v) })])));
                r.orphanedCommands.slice(0, 4).forEach(x => valList.append(h('div', { class: 'dtm-note', title: x.location, text: `${x.command}: ${x.problem}` })));
            });

            //---- Stats export ---------------------------------------------------------
            const actorIn = textIn('', 'all actors', '110px');
            box.append(card('Actor stats export',
                h('p', { class: 'dtm-note', text: 'Writes stats by level, skills, traits and equipment to a text file in your project\'s exports folder.' }),
                h('div', { class: 'dtm-cmd' }, btn('Export', () => window.stats(actorIn.value.trim() ? Number(actorIn.value) : undefined), 'pri'), actorIn)));

            //---- Loading hold ------------------------------------------------------------
            const loadBtn = btn('', () => window.mockload());
            const loadInfo = h('div', { class: 'dtm-note' });
            box.append(card('Loading screen',
                h('p', { class: 'dtm-note', text: 'Keeps the loading spinner on screen so you can style it. Release it to carry on.' }),
                h('div', { class: 'dtm-grid' }, loadBtn), loadInfo));
            live.push(() => {
                loadBtn.textContent = MockLoad.isHeld() ? 'Release spinner' : 'Hold spinner';
                loadInfo.textContent = MockLoad.isBootHeld() ? 'The game is waiting on the boot screen. Release to start it.' : '';
            });

            return { refresh() { live.forEach(fn => fn()); } };
        }
    });

    //=========================================================================
    // Hotkey + init
    //=========================================================================
    function onPanelKey(e) {
        if (!cfg.panel || e.code !== cfg.hotkey || e.ctrlKey || e.altKey || e.metaKey || e.repeat) return;
        const t = e.target;
        const inPanel = t && t.closest && t.closest('.dtm-panel');
        const editable = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
        if (editable && !inPanel) return;      // a game text field keeps its own backquote
        e.preventDefault();
        e.stopImmediatePropagation();
        Panel.toggle();
    }

    /** Runs once, during test play, from the plugin's main closure. */
    D.init = function (param, speeds) {
        cfg.panel = flag(param.PanelEnabled, true);
        cfg.hotkey = String(param.PanelHotkey || 'Backquote');
        cfg.openAtStart = flag(param.PanelOpenAtStart, false);
        cfg.dock = param.PanelDock === 'left' ? 'left' : 'right';
        cfg.toasts = flag(param.Toasts, true);
        cfg.mockBoot = flag(param.MockLoadingOnBoot, false);
        cfg.perfAuto = flag(param.PerfAutoStart, false);
        cfg.perfReports = flag(param.PerfConsoleReports, false);
        cfg.perfInterval = clamp(num(param.PerfInterval, 3000), 500, 30000);
        cfg.perfSpike = clamp(num(param.PerfSpikeMs, 20), 1, 200);
        cfg.showMemory = flag(param.ShowMemoryUsage, false);
        Object.assign(cfg.stress, {
            initial: clamp(num(param.StressInitial, 100), 1, 5000),
            interval: clamp(num(param.StressInterval, 60), 1, 600),
            increment: clamp(num(param.StressIncrement, 50), 0, 2000),
            max: clamp(num(param.StressMax, 10000), 10, 100000),
            movement: flag(param.StressMovement, true),
            animations: flag(param.StressAnimations, false),
            markers: flag(param.StressMarkers, false),
            autoStop: flag(param.StressAutoStop, true)
        });
        cfg.knownTags = String(param.ValidatorKnownTags || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean);
        D.speeds.rapid = speeds.rapid;
        D.speeds.slow = speeds.slow;

        installMirror();
        Perf.init();
        window.addEventListener('keydown', onPanelKey, true);
        S.ready = true;
    };

    /** Runs after SceneManager.initialize (the PIXI app and the HUD element exist by then). */
    D.afterBoot = function () {
        try {
            if (cfg.perfAuto) Perf.start();
            if (cfg.openAtStart) Panel.open();
            setInterval(() => HUD.render(), 1000);
            HUD.render();
        } catch (e) { log.err('Dev tools could not finish starting: ' + e.message); }
    };

    return D;
})();

/**
 * DevConsole
 * Console command system for developer tools.
 * Every command is a plain global function: help(), tp(x,y), gold(1000), perf(), stress() ...
 * Each one is also registered with DevTools so the dev panel can build buttons for it.
 */
const DevConsole = {
    _history: [],
    _maxHistory: 50,

    /**
     * Initialize the console command system
     */
    init() {
        this.exposeGlobalCommands();
        const key = DevTools.cfg.panel ? (DevTools.cfg.hotkey === 'Backquote' ? '`' : DevTools.cfg.hotkey) : null;
        DevTools.log.block('Dev tools ready', [
            'Type help() for every command.',
            key ? `Press ${key} to open the dev panel.` : 'The dev panel is turned off in the plugin settings.'
        ], 'ok');
    },

    /**
     * Shared screenshot helper (used by both window.screenshot and ShortCutCommand.executeScreenshot)
     */
    takeScreenshot() {
        const canvas = Graphics._canvas;
        if (!canvas) { DevTools.log.err('Screenshot failed: no game canvas.'); return; }
        // Render the stage right now so the WebGL buffer is not blank when read back
        const app = Graphics._app || Graphics.app;
        if (app && app.renderer) app.renderer.render(app.stage);
        const stampName = `screenshot_${new Date().toISOString().replace(/[:.]/g, '-')}.png`;
        canvas.toBlob((blob) => {
            if (!blob) { DevTools.log.err('Screenshot failed: empty canvas.'); return; }
            if (!Utils.isNwjs()) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = stampName;
                document.body.appendChild(a); a.click();
                setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 200);
                DevTools.log.ok(`Screenshot downloaded: ${stampName}`);
                return;
            }
            const fs = require('fs');
            const path = require('path');
            const dir = path.join(this.getProjectPath(), 'screenshots');
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            const filename = path.join(dir, stampName);
            // Write the raw bytes directly (no base64 round-trip, no synchronous disk write)
            blob.arrayBuffer().then((buf) => {
                fs.writeFile(filename, Buffer.from(buf), (err) => {
                    if (err) { DevTools.log.err('Screenshot failed: ' + err.message); return; }
                    DevTools.log.ok(`Screenshot saved: ${filename}`);
                    SoundManager.playSave();
                });
            });
        }, 'image/png');
    },

    /**
     * Project root folder (shared by screenshot + backup + exports)
     */
    getProjectPath() {
        if (typeof require !== 'function') return '';
        const path = require('path');
        if (require.main?.filename) return path.dirname(require.main.filename);
        if (typeof nw !== 'undefined' && nw.App?.startPath) return nw.App.startPath;
        return process.cwd();
    },

    /**
     * Add to command history
     */
    addHistory(cmd) {
        this._history.push(cmd);
        if (this._history.length > this._maxHistory) {
            this._history.shift();
        }
    },

    /**
     * Expose all commands as global functions
     */
    exposeGlobalCommands() {
        const T = DevTools;
        const L = T.log;
        const GROUPS = ['Player', 'Items and gold', 'Party', 'Game state', 'Battle', 'Inspect', 'Debug tools', 'Utility'];

        // Registers a command: global function (+ aliases) and a registry entry for help() and the panel.
        const def = (name, meta, fn) => {
            T.reg(Object.assign({ name, fn }, meta));
            const wrapped = (...args) => {
                this.addHistory(`${name}(${args.map(a => T.inspect(a, 1)).join(', ')})`);
                try {
                    return fn(...args);
                } catch (e) {
                    L.err(`${name}() failed: ${e.message}`);
                    console.error(e);
                }
            };
            wrapped.__dtm = true;
            for (const n of [name, ...(meta.aliases || [])]) {
                const clash = n in window && !(window[n] && window[n].__dtm);
                if (clash && meta.isNew) { L.warn(`"${n}" already exists on window and was left alone.`); continue; }
                window[n] = wrapped;
            }
            return wrapped;
        };
        const need = (obj, what) => { if (!obj) { L.err(`${what} is not available yet. Start or load a game first.`); return false; } return true; };
        const list = (title, rows) => L.block(title, rows.slice(0, 40).concat(rows.length > 40 ? [`... and ${rows.length - 40} more`] : []));

        // ═══════════════════════════════════════════════════════════════
        // HELP
        // ═══════════════════════════════════════════════════════════════
        def('help', { group: 'Utility', usage: 'help() or help("cmd")', desc: 'Show every command, or details for one' }, (command) => {
            if (command) {
                const d = T.registry.find(x => x.name === command || (x.aliases || []).includes(command));
                if (!d) { L.err(`Unknown command: ${command}. Run help() for the list.`); return; }
                const lines = [`Usage:   ${d.usage}`, `Does:    ${d.desc}`];
                if (d.aliases && d.aliases.length) lines.push(`Aliases: ${d.aliases.join(', ')}`);
                if (d.extra) lines.push('', ...d.extra);
                L.block(`${d.name}()`, lines);
                return;
            }
            const lines = [];
            for (const g of GROUPS) {
                const defs = T.registry.filter(x => x.group === g);
                if (!defs.length) continue;
                lines.push('', g);
                defs.forEach(d => lines.push(`  ${d.usage.padEnd(26)} ${d.desc}`));
            }
            lines.push('', 'Tip: help("perf") shows the sub-commands of the debug tools.');
            L.block('Dev tools commands', lines);
        });

        // ═══════════════════════════════════════════════════════════════
        // PLAYER
        // ═══════════════════════════════════════════════════════════════
        def('tp', {
            group: 'Player', usage: 'tp(x, y) / tp(mapId, x, y)', desc: 'Teleport on this map, or to another map', aliases: ['teleport', 'warp'],
            panel: { label: 'Teleport', inputs: [{ label: 'x', type: 'number' }, { label: 'y', type: 'number' }] }
        }, (a, b, c) => {
            if (!need($gamePlayer, 'The player')) return;
            if (c !== undefined) {
                $gamePlayer.reserveTransfer(a, b, c, 2, 0);
                L.ok(`Transferring to map ${a} at (${b}, ${c})`);
            } else if (b !== undefined) {
                $gamePlayer.locate(a, b);
                L.ok(`Teleported to (${a}, ${b})`);
            } else {
                L.info('Usage: tp(x, y) or tp(mapId, x, y)');
            }
        });

        def('heal', { group: 'Player', usage: 'heal()', desc: 'Fully heal the party', aliases: ['recover'], panel: { label: 'Heal party' } }, () => {
            if (!need($gameParty, 'The party')) return;
            $gameParty.members().forEach(actor => actor.recoverAll());
            L.ok('Party fully healed');
            SoundManager.playRecovery();
        });

        def('god', { group: 'Player', usage: 'god()', desc: 'Toggle god mode (no damage to the party)', aliases: ['godmode'] }, () => {
            T.state.god = !T.state.god;
            L.ok(`God mode ${T.state.god ? 'on' : 'off'}`);
            T.HUD.render();
            return T.state.god;
        });

        def('noclip', { group: 'Player', usage: 'noclip()', desc: 'Toggle walking through walls', aliases: ['ghost'] }, () => {
            T.state.noclip = !T.state.noclip;
            L.ok(`Noclip ${T.state.noclip ? 'on' : 'off'}`);
            T.HUD.render();
            return T.state.noclip;
        });

        def('speed', { group: 'Player', usage: 'speed(n)', desc: 'Set player move speed 1-6', panel: { label: 'Move speed', inputs: [{ label: 'speed', type: 'number', def: 4 }] } }, (n = 4) => {
            if (!need($gamePlayer, 'The player')) return;
            const v = Math.max(1, Math.min(6, Number(n) || 4));
            $gamePlayer.setMoveSpeed(v);
            L.ok(`Move speed ${v}`);
        });

        // ═══════════════════════════════════════════════════════════════
        // ITEMS & CURRENCY
        // ═══════════════════════════════════════════════════════════════
        def('gold', { group: 'Items and gold', usage: 'gold(amount)', desc: 'Add or remove gold', aliases: ['money'], panel: { label: 'Gold', inputs: [{ label: 'amount', type: 'number', def: 10000 }] } }, (amount = 10000) => {
            if (!need($gameParty, 'The party')) return;
            amount = Number(amount) || 0;
            if (amount < 0) $gameParty.loseGold(Math.abs(amount)); else $gameParty.gainGold(amount);
            L.ok(`Gold: ${$gameParty.gold()} (${amount >= 0 ? '+' : ''}${amount})`);
            SoundManager.playShop();
        });

        const giver = (name, label, getData, sound, example) => def(name, {
            group: 'Items and gold', usage: `${name}(id, amount)`, desc: `Give ${label}`,
            panel: { label: label[0].toUpperCase() + label.slice(1), inputs: [{ label: 'id', type: 'number' }, { label: 'amount', type: 'number', def: 1 }] }
        }, (id, amount = 1) => {
            if (!need($gameParty, 'The party')) return;
            const data = getData();
            if (!id || !data[id]) {
                list(`Available ${label}s (first 20)`, data.filter(Boolean).slice(0, 20).map(i => `  ${i.id}: ${i.name}`));
                return;
            }
            $gameParty.gainItem(data[id], Number(amount) || 1);
            L.ok(`Added ${amount}x ${data[id].name}`);
            SoundManager[sound]();
        });
        giver('item', 'item', () => $dataItems, 'playUseItem');
        giver('weapon', 'weapon', () => $dataWeapons, 'playEquip');
        giver('armor', 'armor', () => $dataArmors, 'playEquip');

        def('allitems', { group: 'Items and gold', usage: 'allitems()', desc: 'Give 99 of every named item', panel: { label: 'All items' } }, () => {
            if (!need($gameParty, 'The party')) return;
            let count = 0;
            $dataItems.filter(i => i && i.name).forEach(i => { $gameParty.gainItem(i, 99); count++; });
            L.ok(`Added ${count} items (99 each)`);
        });

        // ═══════════════════════════════════════════════════════════════
        // PARTY
        // ═══════════════════════════════════════════════════════════════
        def('addactor', { group: 'Party', usage: 'addactor(id)', desc: 'Add an actor to the party', panel: { label: 'Add actor', inputs: [{ label: 'id', type: 'number' }] } }, (id) => {
            if (!need($gameParty, 'The party')) return;
            if (!id || !$dataActors[id]) {
                list('Available actors', $dataActors.filter(Boolean).map(a => `  ${a.id}: ${a.name}`));
                return;
            }
            $gameParty.addActor(id);
            L.ok(`Added actor: ${$dataActors[id].name}`);
        });

        def('removeactor', { group: 'Party', usage: 'removeactor(id)', desc: 'Remove an actor from the party', panel: { label: 'Remove actor', inputs: [{ label: 'id', type: 'number' }] } }, (id) => {
            if (!need($gameParty, 'The party')) return;
            if (!id) {
                list('Current party', $gameParty.members().map(a => `  ${a.actorId()}: ${a.name()}`));
                return;
            }
            $gameParty.removeActor(id);
            L.ok(`Removed actor ${id}`);
        });

        def('level', { group: 'Party', usage: 'level(n)', desc: 'Set the level of every party member', aliases: ['setlevel'], panel: { label: 'Set level', inputs: [{ label: 'level', type: 'number', def: 99 }] } }, (n = 99) => {
            if (!need($gameParty, 'The party')) return;
            $gameParty.members().forEach(actor => actor.changeLevel(Number(n) || 1, false));
            L.ok(`Party set to level ${n}`);
        });

        def('exp', { group: 'Party', usage: 'exp(amount)', desc: 'Give EXP to every party member', panel: { label: 'Give EXP', inputs: [{ label: 'amount', type: 'number', def: 1000 }] } }, (amount = 1000) => {
            if (!need($gameParty, 'The party')) return;
            $gameParty.members().forEach(actor => actor.gainExp(Number(amount) || 0));
            L.ok(`Added ${amount} EXP to the party`);
        });

        // ═══════════════════════════════════════════════════════════════
        // GAME STATE
        // ═══════════════════════════════════════════════════════════════
        def('save', { group: 'Game state', usage: 'save(slot)', desc: 'Save to a slot (0 is the autosave)', panel: { label: 'Save', inputs: [{ label: 'slot', type: 'number', def: 1 }] } }, (slot = 1) => {
            if (!need($gameSystem, 'The game')) return;
            $gameSystem.onBeforeSave();
            DataManager.saveGame(slot).then(() => {
                L.ok(`Game saved to slot ${slot}`);
                SoundManager.playSave();
            }).catch(err => L.err('Save failed: ' + (err && err.message ? err.message : err)));
        });

        def('load', { group: 'Game state', usage: 'load(slot)', desc: 'Load a slot', panel: { label: 'Load', inputs: [{ label: 'slot', type: 'number', def: 1 }] } }, (slot = 1) => {
            DataManager.loadGame(slot).then(() => {
                L.ok(`Game loaded from slot ${slot}`);
                SoundManager.playLoad();
                Scene_Load.prototype.reloadMapIfUpdated.call(SceneManager._scene);
                SceneManager.goto(Scene_Map);
                $gameSystem.onAfterLoad();
            }).catch(err => L.err('Load failed: ' + (err && err.message ? err.message : err)));
        });

        def('sw', { group: 'Game state', usage: 'sw(id) / sw(id, true|false)', desc: 'Toggle or set a switch', aliases: ['setswitch'], panel: { label: 'Toggle switch', inputs: [{ label: 'id', type: 'number' }] } }, (id, value) => {
            if (!need($gameSwitches, 'Switches')) return;
            if (!id) { L.info('Usage: sw(id) or sw(id, true/false)'); return; }
            const next = value === undefined ? !$gameSwitches.value(id) : !!value;
            $gameSwitches.setValue(id, next);
            L.ok(`Switch ${id} ${next ? 'ON' : 'OFF'}`);
            return next;
        });

        def('vari', { group: 'Game state', usage: 'vari(id) / vari(id, value)', desc: 'Read or set a variable', aliases: ['setvar'], panel: { label: 'Variable', inputs: [{ label: 'id', type: 'number' }, { label: 'value' }] } }, (id, value) => {
            if (!need($gameVariables, 'Variables')) return;
            if (!id) { L.info('Usage: vari(id) or vari(id, value)'); return; }
            if (value !== undefined) {
                const n = Number(value);
                const v = typeof value === 'string' && value.trim() !== '' && Number.isFinite(n) ? n : value;
                $gameVariables.setValue(id, v);
                L.ok(`Variable ${id} = ${v}`);
                return v;
            }
            const cur = $gameVariables.value(id);
            L.info(`Variable ${id} = ${cur}`);
            return cur;
        });

        def('event', { group: 'Game state', usage: 'event() / event(id)', desc: 'List map events, or start one', panel: { label: 'Start event', inputs: [{ label: 'id', type: 'number' }] } }, (id) => {
            if (!need($gameMap, 'The map')) return;
            if (!id) {
                list('Map events', $gameMap.events().map(e => `  ${String(e.eventId()).padStart(3)}: ${e.event().name} at (${e.x}, ${e.y})`));
                return;
            }
            const ev = $gameMap.event(id);
            if (ev) { ev.start(); L.ok(`Started event ${id}: ${ev.event().name}`); } else L.err(`Event ${id} not found`);
        });

        // ═══════════════════════════════════════════════════════════════
        // BATTLE
        // ═══════════════════════════════════════════════════════════════
        def('encounter', { group: 'Battle', usage: 'encounter(troopId)', desc: 'Start a battle', aliases: ['battle'], panel: { label: 'Encounter', inputs: [{ label: 'troop', type: 'number' }] } }, (troopId) => {
            if (!need($gameMap, 'The map')) return;
            if (!(SceneManager._scene instanceof Scene_Map)) { L.err('Start battles from the map screen.'); return; }
            if (troopId && $dataTroops[troopId]) {
                BattleManager.setup(troopId, true, false);
                SceneManager.push(Scene_Battle);
                L.ok(`Starting battle with troop ${troopId}`);
            } else {
                list('Available troops (first 20)', $dataTroops.filter(Boolean).slice(0, 20).map(t => `  ${t.id}: ${t.name}`));
            }
        });

        def('win', { group: 'Battle', usage: 'win()', desc: 'Win the current battle', aliases: ['victory'], panel: { label: 'Win battle' } }, () => {
            if (SceneManager._scene instanceof Scene_Battle) { BattleManager.forceVictory(); L.ok('Battle won'); } else L.info('Not in battle');
        });

        def('flee', { group: 'Battle', usage: 'flee()', desc: 'Escape the current battle', panel: { label: 'Flee battle' } }, () => {
            if (SceneManager._scene instanceof Scene_Battle) { BattleManager.forceAbort(); L.ok('Fled from battle'); } else L.info('Not in battle');
        });

        // ═══════════════════════════════════════════════════════════════
        // INSPECT
        // ═══════════════════════════════════════════════════════════════
        def('coords', { group: 'Inspect', usage: 'coords()', desc: 'Show map and player position', aliases: ['pos', 'where'], panel: { label: 'Position' } }, () => {
            if (!need($gamePlayer, 'The player')) return;
            const mapId = $gameMap.mapId();
            L.block('Position', [`Map:       ${mapId} (${$dataMapInfos[mapId]?.name || 'Unknown'})`, `Tile:      (${$gamePlayer.x}, ${$gamePlayer.y})`, `Direction: ${$gamePlayer.direction()}`]);
        });

        def('mapinfo', { group: 'Inspect', usage: 'mapinfo()', desc: 'Show details about the current map', panel: { label: 'Map info' } }, () => {
            if (!need($gameMap, 'The map')) return;
            const mapId = $gameMap.mapId();
            L.block('Map info', [
                `ID:      ${mapId}`, `Name:    ${$dataMapInfos[mapId]?.name || 'Unknown'}`, `Size:    ${$dataMap.width} x ${$dataMap.height}`,
                `Tileset: ${$dataTilesets[$dataMap.tilesetId]?.name || 'Unknown'}`, `Events:  ${$gameMap.events().length}`, `BGM:     ${$dataMap.bgm?.name || 'None'}`
            ]);
        });

        def('vars', { group: 'Inspect', usage: 'vars("term")', desc: 'List non-zero variables (or filter by name)', panel: { label: 'Variables', inputs: [{ label: 'filter' }] } }, (filter) => {
            if (!need($gameVariables, 'Variables')) return;
            const needle = filter ? String(filter).toLowerCase() : '';
            const rows = [];
            for (let i = 1; i < $dataSystem.variables.length; i++) {
                const val = $gameVariables.value(i);
                const name = $dataSystem.variables[i] || `Var${i}`;
                if (val === 0 && !filter) continue;
                if (needle && !name.toLowerCase().includes(needle)) continue;
                rows.push(`  [${i}] ${name}: ${val}`);
            }
            list(`${rows.length} variable(s)`, rows);
        });

        def('switches', { group: 'Inspect', usage: 'switches("term")', desc: 'List ON switches (or filter by name)', panel: { label: 'Switches', inputs: [{ label: 'filter' }] } }, (filter) => {
            if (!need($gameSwitches, 'Switches')) return;
            const needle = filter ? String(filter).toLowerCase() : '';
            const rows = [];
            for (let i = 1; i < $dataSystem.switches.length; i++) {
                const val = $gameSwitches.value(i);
                const name = $dataSystem.switches[i] || `Switch${i}`;
                if (!val && !filter) continue;
                if (needle && !name.toLowerCase().includes(needle)) continue;
                rows.push(`  [${i}] ${name}: ${val ? 'ON' : 'OFF'}`);
            }
            list(`${rows.length} switch(es)`, rows);
        });

        def('party', { group: 'Inspect', usage: 'party()', desc: 'Party HP, MP and states', panel: { label: 'Party status' } }, () => {
            if (!need($gameParty, 'The party')) return;
            const rows = $gameParty.members().map(a => `  [${a.actorId()}] ${a.name()} Lv.${a.level} | HP ${a.hp}/${a.mhp} | MP ${a.mp}/${a.mmp} | ${a.states().map(s => s.name).join(', ') || 'no states'}`);
            L.block('Party status', rows.concat(`  Gold: ${$gameParty.gold()}`));
        });

        // ═══════════════════════════════════════════════════════════════
        // DEBUG TOOLS (the six former stand-alone plugins)
        // ═══════════════════════════════════════════════════════════════
        const P = T.Perf, St = T.Stress, N = T.Nuke, V = T.Validate;

        const perf = def('perf', {
            group: 'Debug tools', usage: 'perf()', desc: 'Frame profiler on/off', isNew: true,
            extra: [
                'perf()            turn the profiler on or off', 'perf.report()    print a report now', 'perf.budget()    share of the 16.67 ms frame budget used',
                'perf.fps()        rolling FPS', 'perf.spikes()    slowest recent frames', 'perf.table()     buckets as a table', 'perf.plugins()   per-plugin timings',
                'perf.reset()      zero all counters', 'perf.pause() / perf.resume()   console reports', 'perf.autoreport(true|false)   print a report every interval'
            ]
        }, () => P.toggle());
        Object.assign(perf, {
            start: () => P.start(), stop: () => P.stop(), report: () => P.report(), budget: () => P.budget(), fps: () => P.fps(),
            spikes: () => P.spikes(), spike: () => P.spikes(), table: () => P.table(), plugins: () => P.pluginTable(), reset: () => P.reset(),
            pause: () => P.pause(), resume: () => P.resume(), autoreport: (on) => P.autoreport(on), snapshot: () => P.snapshot(), version: '4.0.0'
        });
        window.PDID = perf;

        const stress = def('stress', {
            group: 'Debug tools', usage: 'stress(opts)', desc: 'Start or stop the event stress test', isNew: true,
            extra: [
                'stress()                  start, or stop if it is running', 'stress({initial:200, increment:100})   start with settings',
                'stress.stop()             stop and remove every spawned event', 'stress.config({max:5000, movement:false, animations:true, markers:true, interval:30})',
                'stress.status()           wave, events and FPS'
            ]
        }, (opts) => St.toggle(opts));
        Object.assign(stress, { start: (o) => St.start(o), stop: () => St.stop(), config: (o) => St.config(o), status: () => St.status() });

        const nuke = def('nuke', {
            group: 'Debug tools', usage: 'nuke("tag")', desc: 'Force events tagged <nuke:tag> to run every frame', isNew: true,
            extra: ['nuke("traffic")   force events whose note has <nuke:traffic>', 'nuke(12)          force event 12', 'nuke.stop()       stop forcing', 'nuke.list()       show forced events']
        }, (what) => N.activate(what));
        Object.assign(nuke, { stop: () => N.stop(), list: () => N.list() });

        const validate = def('validate', {
            group: 'Debug tools', usage: 'validate()', desc: 'Scan the project for broken plugin content', isNew: true,
            extra: ['validate()               scan every map, common event, troop and database note', 'validate.export()        save the last report as a text file',
                'validate.allow("a","b")  never report these notetags', 'validate.last()          the last report object']
        }, () => V.run());
        Object.assign(validate, { export: () => V.export(), allow: (...t) => V.allow(...t), last: () => V.last() });
        window.PluginValidator = { runValidation: () => V.run(), exportReport: () => V.export() };

        def('stats', {
            group: 'Debug tools', usage: 'stats(actorId)', desc: 'Export actor stats to a text file', isNew: true,
            extra: ['stats()     every actor', 'stats(3)    only actor 3']
        }, (id) => T.Stats.export(id));

        def('mockload', {
            group: 'Debug tools', usage: 'mockload(on)', desc: 'Hold or release the loading screen', isNew: true,
            extra: ['mockload()        toggle the spinner hold', 'mockload(false)   release it (also continues a held boot)']
        }, (on) => T.MockLoad.call(on));

        const panel = def('panel', { group: 'Debug tools', usage: 'panel()', desc: 'Open or close the dev panel', isNew: true }, (open) => T.Panel.toggle(open));
        panel.tab = (name) => T.Panel.select(name);

        // ═══════════════════════════════════════════════════════════════
        // UTILITY
        // ═══════════════════════════════════════════════════════════════
        def('fps', { group: 'Utility', usage: 'fps()', desc: 'Cycle the FPS counter', panel: { label: 'FPS meter' } }, () => {
            Graphics._switchFPSCounter();
            L.info('FPS counter switched');
        });

        def('reload', { group: 'Utility', usage: 'reload()', desc: 'Reload the game', panel: { label: 'Reload', danger: true } }, () => { location.reload(); });

        def('screenshot', { group: 'Utility', usage: 'screenshot()', desc: 'Save a screenshot', aliases: ['ss', 'capture'], panel: { label: 'Screenshot' } }, () => this.takeScreenshot());

        def('hist', { group: 'Utility', usage: 'hist()', desc: 'Show recent commands' }, () => {
            if (!this._history.length) { L.info('No command history yet'); return; }
            L.block('Recent commands', this._history.slice(-10).map((cmd, i) => `  ${i + 1}. ${cmd}`));
        });

        def('cls', { group: 'Utility', usage: 'cls()', desc: 'Clear the console and the panel log', panel: { label: 'Clear log' } }, () => {
            console.clear();
            T.feed.clear();
            L.info('Console cleared. Type help() for commands.');
        });
    }
};

(() => {
    'use strict';
    const script = document.currentScript;
    const param = PluginManagerEx.createParameter(script);
    if (!param.ShortcutList) {
        param.ShortcutList = [];
    }

    // Cache frequently accessed values
    const RAPID_SPEED = param.RapidSpeed || 2;
    const SLOW_SPEED = param.SlowSpeed || 2;
    const USE_RELOAD = param.UseReloadData;
    const MENU_VISIBLE = param.MenuBarVisible;
    const CLICK_MENU = param.ClickMenu;

    //=============================================================================
    // Graphics
    //  FPSの表示を設定します。
    //=============================================================================
    Graphics.setFPSMeter = function (type) {
        switch (type) {
            case 'FPS':
                this._switchFPSCounter();
                break;
            case 'MS':
                this._switchFPSCounter();
                this._switchFPSCounter();
                break;
        }
    };

    const _Graphics__createAllElements = Graphics._createAllElements;
    Graphics._createAllElements = function () {
        _Graphics__createAllElements.apply(this, arguments);
        if (param.OutputStartupInfo && (Utils.isOptionValid('test') || DataManager.isBattleTest())) {
            this.outputStartUpLog();
        }
        if (this._createDevToolInfo) {
            this._createDevToolInfo();
        }
    };

    // One themed console entry instead of ~15 separate rows
    Graphics.outputStartUpLog = function () {
        const versions = (typeof process !== 'undefined' && process.versions) || {};
        const memory = performance?.memory;
        const rows = [
            ['Name', Utils.RPGMAKER_NAME],
            ['Version', Utils.RPGMAKER_VERSION],
            ['Engine', Utils.RPGMAKER_ENGINE || 'Official Version'],
            ['NW.js', versions['node-webkit']],
            ['Chromium', versions.chrome || (navigator.userAgent.match(/Chrome\/([\d.]+)/) || [])[1]],
            ['Node', versions.node],
            ['Memory', memory && ((memory.jsHeapSizeLimit / 1048576) | 0) + ' MB limit'],
            ['User agent', navigator.userAgent]
        ].filter(row => row[1]);
        DevTools.log.block('Startup', rows.map(([k, v]) => `${k.padEnd(11)}${v}`), 'info');
    };

    // Disable subsequent features unless in test play
    const isTestPlay = Utils.isOptionValid('test') || DataManager.isBattleTest();
    if (!isTestPlay) {
        console.log(PluginManagerEx.findPluginName(script) + ' is valid only test play!');
        return;
    }

    // Initialize the dev tools + console commands for test play
    DevTools.init(param, { rapid: RAPID_SPEED, slow: SLOW_SPEED });
    DevConsole.init();

    // God mode: zero out HP damage dealt to actors (toggled by god())
    const _Game_Action_executeDamage = Game_Action.prototype.executeDamage;
    Game_Action.prototype.executeDamage = function (target, value) {
        if (value > 0 && DevTools.state.god && target.isActor()) value = 0;
        _Game_Action_executeDamage.call(this, target, value);
    };

    // Poison / slip damage bypasses executeDamage, so cap it too while god mode is on
    const _Game_Actor_maxSlipDamage = Game_Actor.prototype.maxSlipDamage;
    Game_Actor.prototype.maxSlipDamage = function () {
        return DevTools.state.god ? 0 : _Game_Actor_maxSlipDamage.apply(this, arguments);
    };

    // Noclip lives in the dev tools (not on the player object), so it never ends up in a save file
    const _Game_Player_isDebugThrough = Game_Player.prototype.isDebugThrough;
    Game_Player.prototype.isDebugThrough = function () {
        return DevTools.state.noclip || _Game_Player_isDebugThrough.apply(this, arguments);
    };

    Graphics._createDevToolInfo = function () {
        this._devToolDiv = DevTools.HUD.mount();
    };

    // Legacy entry point: any text passed in is shown as a chip next to the live state chips
    Graphics.drawDevToolInfo = function (text) {
        DevTools.HUD.setLegacy(text);
    };

    // Cached tip shown flag
    let _shownSourceMapTip = false;

    SceneManager.showSourceMapTip = function () {
        if (_shownSourceMapTip) return;
        _shownSourceMapTip = true;

        // Only nag the first time on this machine (the warning itself comes from
        // DevTools, so JS cannot hide it - the setting below is the permanent fix)
        const key = 'DevToolsManage_sourceMapTipShown';
        try {
            if (localStorage.getItem(key)) return;
            localStorage.setItem(key, '1');
        } catch (e) { /* storage unavailable: just show the tip */ }

        console.log(
            '%c💡 Tip: silence the SourceMap warnings permanently %c\n' +
            'DevTools Settings (F1) → Sources → uncheck "Enable JavaScript source maps" and "Enable CSS source maps"',
            'background:#ff9800;color:#fff;padding:3px 8px;border-radius:3px;font-weight:bold;',
            'color:#2196F3;');
    };

    //=============================================================================
    // SceneManager
    //  Automatically controls developer tools based on the situation.
    //=============================================================================
    const _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize = function () {
        _SceneManager_initialize.apply(this, arguments);
        this.initDevCommand();
        Graphics.setFPSMeter(param.ShowFPS);
        DevTools.afterBoot();
        if (!Utils.isNwjs()) {
            return;
        }
        this._freeze = false;
        this._nwWindow = new GameNwWindow();
        if (param.StartupOnTop || Utils.isOptionValid('onTop')) {
            this.setInitAlwaysOnTop();
        }
    };

    SceneManager.setInitAlwaysOnTop = function () {
        const sc = this.findShortCut('AlwaysOnTop');
        sc ? sc.execute() : this._nwWindow.toggleAlwaysOnTop();
    };

    const _SceneManager_terminate = SceneManager.terminate;
    SceneManager.terminate = function () {
        if (this._nwWindow) {
            this._nwWindow.cleanup();
        }
        _SceneManager_terminate.apply(this, arguments);
    };

    SceneManager.setInitRapid = function () {
        const sc = this.findShortCut('ToggleRapid');
        sc ? sc.execute() : this.toggleRapid();
    };

    SceneManager.findShortCut = function (id) { return this._commandList.find(c => c.isTypeEqual(id)); };

    SceneManager.initDevCommand = function () {
        const commandList = param.ShortcutList
            .filter(item => ShortCutCommand.COMMANDS[item.Command])
            .map(item => new ShortCutCommand(item, item.Command));
        if (SceneManager.takeCapture) {
            commandList.push(new ShortCutCommand(null, 'Capture'));
        }
        if (SceneManager.onKeyDownForScreenMovie) {
            commandList.push(new ShortCutCommand(null, 'Record'));
        }
        this._commandList = commandList;
    };

    SceneManager.iterateCommandList = function (cb) { this._commandList.forEach(cb); };

    SceneManager.getNwWindow = function () { return this._nwWindow; };

    SceneManager.toggleAlwaysOnTop = function () {
        if (!this._nwWindow) return false;   // browsers have no native window to pin
        this._nwWindow.toggleAlwaysOnTop();
        this.drawDevToolInfo();
        return this._nwWindow.isOnTop();
    };

    SceneManager.toggleFreeze = function () {
        Input.clear();
        this._freeze = !this._freeze;
        this.drawDevToolInfo();
        return this._freeze;
    };

    SceneManager.toggleRapid = function () {
        if (!this.isSlow()) {
            this._rapid = !this._rapid;
            this.drawDevToolInfo();
        }
        return this._rapid;
    };

    SceneManager.toggleSlow = function () {
        if (!this.isRapid()) {
            this._slow = !this._slow;
            this.drawDevToolInfo();
        }
        return this._slow;
    };

    SceneManager.openProject = function () { if (this._nwWindow) this._nwWindow.openProject(); };

    // The HUD reads the live state itself (rapid, slow, freeze, on top, god, profiler ...)
    SceneManager.drawDevToolInfo = function () {
        DevTools.HUD.render();
    };

    const _SceneManager_catchException = SceneManager.catchException;
    SceneManager.catchException = function (e) {
        if (this._nwWindow) this._nwWindow.showDevTools(false);
        _SceneManager_catchException.apply(this, arguments);
    };

    const _SceneManager_onError = SceneManager.onError;
    SceneManager.onError = function (e) {
        if (this._nwWindow) this._nwWindow.showDevTools(false);
        _SceneManager_onError.apply(this, arguments);
    };

    const _SceneManager_onKeyDown = SceneManager.onKeyDown;
    SceneManager.onKeyDown = function (event) {
        _SceneManager_onKeyDown.apply(this, arguments);
        this.onKeyDownForDevToolManage(event);
    };

    SceneManager.onKeyDownForDevToolManage = function (event) { this.iterateCommandList(c => c.onKeyDown(event)); };

    SceneManager.isRapid = function () { return !!this._rapid; };
    SceneManager.isSlow = function () { return !!this._slow; };

    const _SceneManager_initNwjs = SceneManager.initNwjs;
    SceneManager.initNwjs = function () {
        _SceneManager_initNwjs.apply(this, arguments);
        if (Utils.isNwjs()) {
            this.addMenuBar();
            this.suppressSourceMapWarnings();
        }
    };

    let _consoleFiltersInstalled = false;
    SceneManager.suppressSourceMapWarnings = function () {
        if (_consoleFiltersInstalled) return;
        _consoleFiltersInstalled = true;

        // Suppress annoying SourceMap and WebGL warnings in DevTools
        const originalWarn = console.warn;
        const originalError = console.error;
        const warnPatterns = [
            'DevTools failed to load SourceMap',
            'Could not load content for',
            'ERR_FILE_NOT_FOUND',
            'chrome-extension://'
        ];
        // Common in PIXI.js
        const errorPatterns = [
            'GL_INVALID_OPERATION',
            'Feedback loop formed',
            'Object cannot be used because it has not been generated',
            '[.WebGL-'
        ];
        // Only inspects strings / Errors, so arbitrary objects can never make logging throw
        const matches = (args, patterns) => args.some(a => {
            const m = typeof a === 'string' ? a : (a instanceof Error ? a.message : '');
            return m !== '' && patterns.some(p => m.includes(p));
        });

        console.warn = function (...args) {
            if (matches(args, warnPatterns)) return;
            originalWarn.apply(console, args);
        };

        console.error = function (...args) {
            if (matches(args, errorPatterns)) return;
            originalError.apply(console, args);
        };
    };

    SceneManager.addMenuBar = function () {
        if (!MENU_VISIBLE) {
            this._needAdjustScreen = false;
            return;
        }
        const gameWindow = nw.Window.get();
        if (!gameWindow.menu || gameWindow.menu.type !== 'menubar') {
            this._needAdjustScreen = true;
        }
        gameWindow.menu = new nw.Menu({ type: 'menubar' });
    };

    const _SceneManager_run = SceneManager.run;
    SceneManager.run = function (sceneClass) {
        _SceneManager_run.apply(this, arguments);
        this.setWindowSizeForMenuBar();
    };

    SceneManager.setWindowSizeForMenuBar = function () {
        if (!this._needAdjustScreen) {
            return;
        }
        const gameWindow = nw.Window.get();
        setTimeout(() => { // Fix missing menu bar height
            const style_height = parseInt(Graphics._canvas.style.height, 10);
            const height_diff = SceneManager._screenHeight - style_height;
            if (height_diff !== 0) {
                gameWindow.moveBy(0, -height_diff);
                gameWindow.resizeBy(0, height_diff);
            }
        }, 100);
    };

    SceneManager._slowCounter = 0;
    const _SceneManager_determineRepeatNumber = SceneManager.determineRepeatNumber;
    SceneManager.determineRepeatNumber = function (deltaTime) {
        const result = _SceneManager_determineRepeatNumber.apply(this, arguments);
        if (!this._rapid && !this._slow) {
            this._slowCounter = 0;
            return result;
        }
        if (this._scene && this._scene.isAnyWindowActive()) {
            return result;
        }
        if (this.isSlow()) {
            // Only ticks that would have run a frame count (on 120/144 Hz screens many ticks run none),
            // and exactly one in SLOW_SPEED of them is let through, so "2" really is half speed.
            if (result < 1) return 0;
            this._slowCounter += result;
            if (this._slowCounter < SLOW_SPEED) return 0;
            this._slowCounter = 0;
            return 1;
        }
        this._slowCounter = 0;
        return this.isRapid() ? result * RAPID_SPEED : result;
    };

    const _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene = function () {
        this.updateScript();
        if (this.isUseReload()) {   // skips battle tests and event tests
            this.updateDataReload();
        }
        if (this._freeze || this.isReloading()) {
            return;
        }
        _SceneManager_updateScene.apply(this, arguments);
    };

    SceneManager.isUseReload = function () { return USE_RELOAD && !DataManager.isBattleTest() && !DataManager.isEventTest() && Utils.isNwjs(); };

    SceneManager.updateScript = function () {
        const list = this._commandList;
        for (let i = 0; i < list.length; i++) list[i].updateScriptIfNeed();
    };

    SceneManager.updateDataReload = function () {
        if (this.getNwWindow().isOnFocus() && !this._reloadGenerator) {
            this._reloadGenerator = this.reloadGenerator();
        }
        if (this._reloadGenerator && DataManager.isDatabaseLoaded()) {
            if (!this._reloadGenerator.next().value) {
                this._reloadGenerator = null;
                // Resolve conflict for DynamicDatabase.js
                if (typeof DynamicDatabaseManager !== 'undefined') {
                    DynamicDatabaseManager.makeDynamicDatabase();
                }
            }
        }
    };

    SceneManager.reloadGenerator = function* () {
        this._preVersionId = $dataSystem.versionId;
        DataManager.reloadSystemData();
        yield true;

        if (this._preVersionId !== $dataSystem.versionId) {
            // Create backup before reload
            if (param.AutoBackup && this._nwWindow) {
                this._nwWindow.createBackup();
            }

            this.reloadMapData();
            DataManager.loadDatabase();
            DevTools.log.info('Database reloaded (version ' + $dataSystem.versionId + ')');
            yield true;
        }
        return false;
    };

    SceneManager.reloadMapData = function () {
        if (this._scene instanceof Scene_Map && $gamePlayer.canMove()) {
            $gamePlayer.reserveTransfer(
                $gameMap.mapId(), $gamePlayer.x, $gamePlayer.y, $gamePlayer.direction(), 2);
            $gamePlayer.requestMapReload();
            DevTools.log.info('Map reloaded');
        }
    };

    SceneManager.isReloading = function () { return !!this._reloadGenerator; };

    SceneManager.isCurrentScene = function (sceneClass) { return this._scene?.constructor === sceneClass; };

    class ShortCutCommand {
        // Static command definitions (shared across all instances)
        static COMMANDS = {
            AlwaysOnTop: { name: 'Always on top', type: 'checkbox' },
            ToggleRapid: { name: 'Rapid mode', type: 'checkbox' },
            ToggleSlow: { name: 'Slow mode', type: 'checkbox' },
            ForceVictory: { name: 'Win battle', type: 'normal' },
            ExecuteScript: { name: 'Resident script', type: 'normal' },
            Freeze: { name: 'Freeze screen', type: 'checkbox' },
            ForceDefeat: { name: 'Lose battle', type: 'normal' },
            ForceAbort: { name: 'Abort battle', type: 'normal' },
            OpenProject: { name: 'Open project folder', type: 'normal' },
            Capture: { name: 'Capture', type: 'normal' },
            Record: { name: 'Record', type: 'normal' },
            Screenshot: { name: 'Screenshot', type: 'normal' },
            Backup: { name: 'Backup project data', type: 'normal' },
            TogglePanel: { name: 'Dev panel', type: 'checkbox' },
            StressTest: { name: 'Stress test', type: 'checkbox' },
            RunValidation: { name: 'Validate project', type: 'normal' },
            ExportStats: { name: 'Export actor stats', type: 'normal' },
            TogglePerf: { name: 'Profiler', type: 'checkbox' },
            PerfReport: { name: 'Print profiler report', type: 'normal' },
            MockLoad: { name: 'Hold loading screen', type: 'checkbox' }
        };

        constructor(shortcut, id) {
            this._command = ShortCutCommand.COMMANDS[id];
            this._id = id;
            this._shortcut = shortcut;
            this._contextMenu = null;
            this._lastScriptString = null;
            this._lastScriptResult = null;
        }

        isTypeEqual(id) { return this._id === id; }

        onKeyDown(event) {
            const shortcut = this._shortcut;
            if (!shortcut) return;
            if (event.key !== shortcut.HotKey) return;
            if (event.ctrlKey !== shortcut.Ctrl) return;
            if (event.altKey !== shortcut.Alt) return;
            this.execute();
        }

        createHotKeyText() {
            const shortcut = this._shortcut;
            if (!shortcut?.HotKey) return '';
            const ctrl = shortcut.Ctrl ? 'Ctrl+' : '';
            const alt = shortcut.Alt ? 'Alt+' : '';
            return `(${ctrl}${alt}${shortcut.HotKey})`;
        }

        appendNwMenu(menuObject) {
            const menuItem = new nw.MenuItem({
                label: this._command.name + this.createHotKeyText(),
                type: this._command.type,
            });
            if (menuObject.type === 'contextmenu') {
                this._contextMenu = menuItem;
            }
            menuItem.click = this.execute.bind(this, true);
            menuObject.append(menuItem);
        }

        execute(fromClick = false) {
            const result = this[`execute${this._id}`]();
            if (fromClick) {
                SoundManager.playCursor();
            }
            this.setCheck(result);
        }

        setCheck(value) {
            if (this._command.type === 'checkbox' && this._contextMenu) {
                this._contextMenu.checked = value;
            }
        }

        executeAlwaysOnTop() { return SceneManager.toggleAlwaysOnTop(); }
        executeToggleRapid() { return SceneManager.toggleRapid(); }
        executeToggleSlow() { return SceneManager.toggleSlow(); }
        executeFreeze() { return SceneManager.toggleFreeze(); }
        executeForceVictory() { BattleManager.forceVictory(); }
        executeForceDefeat() { BattleManager.forceDefect(); }
        executeForceAbort() { BattleManager.forceAbort(); }
        executeOpenProject() { SceneManager.openProject(); }
        executeCapture() { SceneManager.takeCapture(); }
        executeRecord() { return SceneManager._screenRecorder.toggle(); }

        executeScreenshot() { DevConsole.takeScreenshot(); }

        executeTogglePanel() { return DevTools.Panel.toggle(); }
        executeStressTest() { return DevTools.Stress.toggle(); }
        executeRunValidation() { DevTools.Validate.run(); }
        executeExportStats() { DevTools.Stats.export(); }
        executeTogglePerf() { return DevTools.Perf.toggle(); }
        executePerfReport() { DevTools.Perf.report(); }
        executeMockLoad() { return DevTools.MockLoad.call(); }

        executeBackup() {
            const nwWin = SceneManager._nwWindow;
            if (nwWin && nwWin.createBackup(true)) {
                SoundManager.playSave();
            }
        }

        executeExecuteScript() {
            const promptValue = 'Enter the script you want to run every frame.';
            const nwWindow = SceneManager.getNwWindow();
            const scriptString = window.prompt(promptValue, nwWindow ? nwWindow.readClipboard() : '');
            if (scriptString !== null && scriptString !== '') {
                if (nwWindow) {
                    nwWindow.showDevTools();
                    nwWindow.writeClipboard(scriptString);
                }
                this.updateScript(scriptString);
                this._lastScriptString = scriptString;
            }
        }

        updateScript(scriptString) {
            let result = null;
            try {
                result = eval(scriptString);
                if (!this._lastScriptString) {
                    SoundManager.playOk();
                    DevTools.log.ok('Resident script running: ' + scriptString);
                }
            } catch (e) {
                if (!this._lastScriptString) {
                    SoundManager.playBuzzer();
                    DevTools.log.err('Resident script failed: ' + scriptString);
                    console.error(e.stack);
                }
                result = e.toString();
            }
            if (!this._lastScriptString || result !== this._lastScriptResult) {
                console.log(result);
            }
            this._lastScriptResult = result;
        }

        updateScriptIfNeed() {
            if (this._lastScriptString) {
                this.updateScript(this._lastScriptString);
            }
        }
    }

    //=============================================================================
    // BattleManager
    //  強制勝利を追加定義します。
    //=============================================================================
    BattleManager.forceVictory = function () {
        if (!this.canExecuteBattleEndProcess()) return;
        $gameTroop.members().forEach(e => e.addNewState(e.deathStateId()));
        this.processVictory();
    };

    BattleManager.forceDefect = function () {
        if (!this.canExecuteBattleEndProcess()) return;
        $gameParty.members().forEach(a => a.addNewState(a.deathStateId()));
        this.processDefeat();
    };

    BattleManager.forceAbort = function () {
        if (!this.canExecuteBattleEndProcess()) return;
        $gameParty.performEscape();
        SoundManager.playEscape();
        this.displayEscapeSuccessMessage();
        this._escaped = true;
        this.processAbort();
    };

    BattleManager.canExecuteBattleEndProcess = function () { return SceneManager.isCurrentScene(Scene_Battle) && this._phase !== 'battleEnd'; };

    //=============================================================================
    // DataManager
    //  外部エディタから戦闘テストの実行を可能にします。
    //=============================================================================
    const _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase = function () {
        if (this.isNeedSuppressBtest()) {
            this._suppressBattleTest = true;
        }
        _DataManager_loadDatabase.apply(this, arguments);
        this._suppressBattleTest = false;
    };

    const _DataManager_isBattleTest = DataManager.isBattleTest;
    DataManager.isBattleTest = function () {
        return this._suppressBattleTest ? false : _DataManager_isBattleTest.apply(this, arguments);
    };

    DataManager.isNeedSuppressBtest = function () {
        if (!this.isBattleTest()) {
            return false;
        }
        if (Utils.isNwjs()) {
            return this._databaseFiles.every(function (databaseFile) {
                return !StorageManager.isExistTestData(databaseFile.src);
            });
        } else {
            return true;
        }
    };

    DataManager.reloadSystemData = function () {
        const data = this._databaseFiles.find(f => f.name === '$dataSystem');
        this.loadDataFile(data.name, data.src);
    };

    StorageManager.isExistTestData = function (fileName) {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(path.dirname(require.main.filename), 'data/Test_' + fileName);
        return fs.existsSync(filePath);
    };

    Scene_Base.prototype.isAnyWindowActive = function () {
        return !!this._windowLayer?.children.some(w => w instanceof Window_Selectable && w.active);
    };

    //=============================================================================
    // Scene_Boot
    //  Skip the title screen and go to the map screen.
    //=============================================================================
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        _Scene_Boot_start.apply(this, arguments);
        if (param.RapidStart) {
            SceneManager.setInitRapid();
        }
        this.cutSceneTitle();
    };

    Scene_Boot.prototype.cutSceneTitle = function () {
        if (DataManager.isBattleTest() || DataManager.isEventTest()) {
            return;
        }
        switch (param.CutTitle) {
            case 1:
                this.goToNewGame();
                break;
            case 2: {
                const result = this.goToLatestContinue();
                if (!result) {
                    this.goToNewGame();
                }
                break;
            }
        }
    };

    Scene_Boot.prototype.goToNewGame = function () {
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    };

    Scene_Boot.prototype.goToLatestContinue = function () {
        if (DataManager.isAnySavefileExists()) {
            DataManager.loadGame(DataManager.latestSavefileId()).then(() => {
                this.reloadMapIfUpdated();   // pick up database edits made since the save
                SceneManager.goto(Scene_Map);
                $gameSystem.onAfterLoad();
            }).catch((e) => {
                // A damaged save used to leave the game stuck on the boot screen
                DevTools.log.err('Latest save could not be loaded, starting a new game instead: ' + (e && e.message ? e.message : e));
                this.goToNewGame();
            });
            return true;
        } else {
            return false;
        }
    };
    const _Scene_Load_reloadMapIfUpdated = Scene_Load.prototype.reloadMapIfUpdated;
    Scene_Load.prototype.reloadMapIfUpdated = function () {
        _Scene_Load_reloadMapIfUpdated.apply(this, arguments);
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
            $gameMap.clearEventErase();
        }
    };

    Scene_Boot.prototype.reloadMapIfUpdated = function () {
        Scene_Load.prototype.reloadMapIfUpdated.apply(this, arguments);
    };

    // Must come after every other Scene_Boot.start patch above so a held boot also holds those
    DevTools.MockLoad.installBoot();

    //=============================================================================
    // Window_Message
    //  It provides faster messaging.
    //=============================================================================
    if (!param.InvalidMessageSkip) {
        const _Window_Message_isTriggered = Window_Message.prototype.isTriggered;
        Window_Message.prototype.isTriggered = function () {
            return _Window_Message_isTriggered.apply(this, arguments) || SceneManager.isRapid();
        };

        const _Window_Message_startPause = Window_Message.prototype.startPause;
        Window_Message.prototype.startPause = function () {
            _Window_Message_startPause.apply(this, arguments);
            if (SceneManager.isRapid()) {
                this.startWait(1);
            }
        };
    }

    const _Game_Map_eraseEvent = Game_Map.prototype.eraseEvent;
    Game_Map.prototype.eraseEvent = function (eventId) {
        _Game_Map_eraseEvent.apply(this, arguments);
        if (!this._eraseEvents) this._eraseEvents = [];
        if (!this._eraseEvents.includes(eventId)) this._eraseEvents.push(eventId);
    };

    const _Game_Map_setupEvents = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function () {
        _Game_Map_setupEvents.apply(this, arguments);
        if (this._eraseEvents && $gamePlayer.isNeedMapReload()) {
            this.restoreEventErase();
        } else {
            this.clearEventErase();
        }
    };

    Game_Map.prototype.restoreEventErase = function () {
        this._eraseEvents.forEach(id => this._events[id]?.erase());
    };

    Game_Map.prototype.clearEventErase = function () {
        this._eraseEvents = [];
    };

    Game_Player.prototype.isNeedMapReload = function () { return this._needsMapReload; };

    //=============================================================================
    // Controller_NwJs
    //  Manages API calls in Nw.js.
    //=============================================================================
    class GameNwWindow {
        constructor() {
            this._onFocus = false;
            this._menuBar = new nw.Menu({ type: 'menubar' });
            this._menuClick = null;
            this._onTop = false;
            this._clickHandler = null;
            this._focusHandler = null;
            this._closeHandler = null;
            this._performanceMonitor = {
                memory: [],
                interval: null
            };
            this.initSetting();
        }

        initSetting() {
            this.addEventListener();
            if (MENU_VISIBLE) {
                this.makeMenu(this._menuBar);
                this.setMenuBar(this._menuBar);
            }
            this.initClickMenu();

            if (this.isStartUpDevTool()) {
                this.showDevTools();
            }
            this.setupModernFeatures();
        }

        setupModernFeatures() {
            // Performance monitoring
            if (param.ShowMemoryUsage) {
                this.startPerformanceMonitoring();
            }
        }

        startPerformanceMonitoring() {
            this._performanceMonitor.interval = setInterval(() => {
                if (typeof performance !== 'undefined' && performance.memory) {
                    const memory = performance.memory;
                    this._performanceMonitor.memory.push({
                        used: Math.round(memory.usedJSHeapSize / 1048576),
                        total: Math.round(memory.totalJSHeapSize / 1048576),
                        limit: Math.round(memory.jsHeapSizeLimit / 1048576)
                    });
                    if (this._performanceMonitor.memory.length > 60) {
                        this._performanceMonitor.memory.shift();
                    }
                }
                if (SceneManager._nwWindow) SceneManager.drawDevToolInfo();
            }, 1000);
        }

        getMemoryInfo() {
            const latest = this._performanceMonitor.memory[this._performanceMonitor.memory.length - 1];
            return latest ? `Mem: ${latest.used}/${latest.limit}MB` : '';
        }

        isStartUpDevTool() { return param.StartupDevTool && !Utils.isOptionValid('devToolOff'); }

        openProject() {
            const { exec } = require('child_process');
            const path = require('path');
            const projectPath = DevConsole.getProjectPath();

            // Modern cross-platform file opening
            const commands = {
                'win32': `start "" "${projectPath}"`,
                'darwin': `open "${projectPath}"`,
                'linux': `xdg-open "${projectPath}"`
            };

            const command = commands[process.platform] || commands['linux'];

            exec(command, (error) => {
                if (error) {
                    console.error('Failed to open project folder:', error);
                }
            });
        }

        initClickMenu() {
            if (CLICK_MENU < 0) return; // click menu disabled
            this._menuClick = new nw.Menu();
            this.makeMenu(this._menuClick);
        }

        makeMenu(menuObject) { SceneManager.iterateCommandList(c => c.appendNwMenu(menuObject)); }

        setMenuBar(menu) { this.getWindow().menu = menu; }

        isOnFocus() {
            const v = this._onFocus;
            this._onFocus = false;
            return v;
        }

        addEventListener() {
            // Modern event handling with better performance
            this._clickHandler = (event) => {
                if (event.button === CLICK_MENU) {
                    event.preventDefault();
                    this._menuClick.popup(event.pageX, event.pageY);
                }
            };
            if (CLICK_MENU >= 0) {
                document.addEventListener('mousedown', this._clickHandler, { passive: false });
            } else {
                this._clickHandler = null;
            }

            const currentWin = this.getWindow();
            currentWin.removeAllListeners('focus');
            currentWin.removeAllListeners('blur');
            currentWin.removeAllListeners('close');

            this._focusHandler = () => {
                this._onFocus = true;
            };
            currentWin.on('focus', this._focusHandler);

            // Add close handler for cleanup
            this._closeHandler = () => {
                this.cleanup();
                // With a 'close' listener registered NW.js waits for close(true); without it the
                // window ignored the first click on the X button.
                currentWin.close(true);
            };
            currentWin.on('close', this._closeHandler);
        }

        getWindow() { return nw.Window.get(); }
        getClipboard() { return nw.Clipboard.get(); }
        isOnTop() { return this._onTop; }

        toggleAlwaysOnTop() {
            this._onTop = !this._onTop;
            this.getWindow().setAlwaysOnTop(this._onTop);
            return this._onTop;
        }

        showDevTools() {
            const win = this.getWindow();
            win.showDevTools();

            // Show tip about disabling source maps
            SceneManager.showSourceMapTip();

            requestAnimationFrame(() => {
                setTimeout(() => {
                    win.focus();
                }, 500);
            });
        }

        readClipboard() { return this.getClipboard().get('text'); }
        writeClipboard(v) { this.getClipboard().set(v, 'text'); }

        // Creates a backup of the data folder. Returns true on success.
        // `force` bypasses the AutoBackup setting (used by the manual Backup command).
        createBackup(force = false) {
            if (!force && !param.AutoBackup) return false;

            const fs = require('fs');
            const path = require('path');
            const projectPath = DevConsole.getProjectPath();

            const backupPath = path.join(projectPath, 'backups');

            try {
                if (!fs.existsSync(backupPath)) {
                    fs.mkdirSync(backupPath, { recursive: true });
                }

                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const backupFolder = path.join(backupPath, `backup_${timestamp}`);

                // Modern recursive copy (Node.js 16.7.0+)
                const srcPath = path.join(projectPath, 'data');
                const destPath = path.join(backupFolder, 'data');

                if (fs.cpSync) {
                    fs.cpSync(srcPath, destPath, { recursive: true });
                } else {
                    // Fallback for older Node versions
                    this.copyFolderSync(srcPath, destPath);
                }

                DevTools.log.ok('Backup created: ' + backupFolder);
                this.cleanOldBackups(backupPath);
                return true;
            } catch (error) {
                DevTools.log.err('Backup failed: ' + error.message);
                return false;
            }
        }

        copyFolderSync(src, dest) {
            const fs = require('fs');
            const path = require('path');

            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }

            const files = fs.readdirSync(src);
            files.forEach(file => {
                const srcPath = path.join(src, file);
                const destPath = path.join(dest, file);

                if (fs.statSync(srcPath).isDirectory()) {
                    this.copyFolderSync(srcPath, destPath);
                } else {
                    fs.copyFileSync(srcPath, destPath);
                }
            });
        }

        cleanOldBackups(backupPath) {
            const maxBackups = param.MaxBackups;
            if (!(maxBackups > 0)) return; // 0 = unlimited; also guards undefined/NaN (slice(undefined) would delete everything)

            const fs = require('fs');
            const path = require('path');

            try {
                const backups = fs.readdirSync(backupPath)
                    .filter(f => f.startsWith('backup_'))
                    .map(f => {
                        const fullPath = path.join(backupPath, f);
                        return {
                            name: f,
                            path: fullPath,
                            time: fs.statSync(fullPath).mtime.getTime()
                        };
                    })
                    .sort((a, b) => b.time - a.time);

                // Remove excess backups
                const toDelete = backups.slice(maxBackups);
                for (const old of toDelete) {
                    this.deleteFolderRecursive(old.path);
                    console.log('Deleted old backup:', old.name);
                }
            } catch (error) {
                console.error('Failed to clean old backups:', error);
            }
        }

        deleteFolderRecursive(folderPath) {
            const fs = require('fs');

            if (fs.existsSync(folderPath)) {
                // Use modern recursive removal (Node.js 14.14.0+)
                fs.rmSync(folderPath, { recursive: true, force: true });
            }
        }

        cleanup() {
            if (this._cleaned) return;
            this._cleaned = true;
            try {
                // Clean up event listeners
                if (this._clickHandler) {
                    document.removeEventListener('mousedown', this._clickHandler);
                    this._clickHandler = null;
                }

                const currentWin = this.getWindow();
                if (currentWin) {
                    // Use optional chaining for safer cleanup
                    this._focusHandler && currentWin.removeListener('focus', this._focusHandler);
                    this._closeHandler && currentWin.removeListener('close', this._closeHandler);
                }

                this._focusHandler = null;
                this._closeHandler = null;

                // Clean up performance monitoring
                if (this._performanceMonitor?.interval) {
                    clearInterval(this._performanceMonitor.interval);
                    this._performanceMonitor.interval = null;
                }

                // Clear performance data
                if (this._performanceMonitor) {
                    this._performanceMonitor.memory = [];
                }

                // Clear menu references
                this._menuBar = null;
                this._menuClick = null;

                DevTools.log.info('Window listeners cleaned up.');
            } catch (error) {
                console.error('Cleanup error:', error);
            }
        }
    }
})();