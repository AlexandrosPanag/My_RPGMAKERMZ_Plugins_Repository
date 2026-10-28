# DevToolsManage.js — Changelog

##⚠️ WARNING: 
This version is highly expiremental - it is integrated with the DEBUG folder repository for an all-in-one master solution.
If any problems are encountered - switch to version 2.4.0 and as always ensure you have your game files backed-up!

## 3.0.0 — October 28 2026
**Modified by:** Alexandros Panagiotakopoulos

### Integrated Debug Tools
The six stand-alone debug plugins now live inside DevToolsManage and are callable as console functions. Turn the old plugins off so the same engine methods are not hooked twice.

| Function | Replaces | Sub-commands |
|---|---|---|
| `perf()` | DebugPerformanceDrainIdentifier | `.start() .stop() .report() .budget() .fps() .spikes() .table() .plugins() .reset() .pause() .resume() .autoreport() .snapshot()` |
| `stress(opts)` | NuclearEventThrottler | `.start() .stop() .config({...}) .status()` |
| `nuke("tag")` / `nuke(id)` | NuclearEventForcer | `.stop() .list()` |
| `validate()` | PluginContentValidator | `.export() .allow("tag") .last()` |
| `stats()` / `stats(actorId)` | DebugStatsExplorer | |
| `mockload(on)` | DebugMockLoadingScreen | `mockload(false)` releases it |
| `panel()` | — (new) | `.tab("perf")` |

- Backward-compatible globals kept: `PDID` (same object as `perf`) and `PluginValidator.runValidation()` / `.exportReport()`
- Every tool is inert until used: the profiler's hooks are plain pass-throughs while it is off, and the stress test / event forcer only patch the engine on first use
- Everything is test-play only; a released build gets none of it

### Visual Overhaul
- **Dev panel** (new, `` ` `` by default) with five tabs:
  - **Tools** — mode switches (God, Noclip, Rapid, Slow, Freeze, On top, Profiler) plus a button for every registered command, with inline inputs for commands that take arguments
  - **Console** — live log feed with All / Warnings / Errors filters, command prompt with history (↑/↓), Tab completion and usage hints
  - **Data** — searchable switch and variable editor
  - **Perf** — live budget bar, per-bucket bars, per-plugin timings and recent spikes
  - **Lab** — stress test, event forcer, project validator, actor stats export and loading-screen hold
- Frame-pacing ribbon in the panel header (independent of the profiler), with FPS, frame time and heap readouts
- Panel can dock left or right, fade to see the game (ghost), and open at launch; Escape closes it only while focus is inside it
- **HUD chips** replace the plain black text overlay: On top, Frozen, Rapid ×N / Slow 1/N, God, Noclip, Profiler (ms), Stress, Forcing, Loading held, Memory. The element keeps its `#devTool` id and `pointer-events:none`; it only redraws when something changed
- **Toast notifications** for successes, warnings and errors (can be turned off)
- Console output restyled with one consistent themed format (`help()`, startup info, reports, tables); the console is also mirrored into the panel
- Shortcut List / menu labels cleaned up to plain English
- Panel input is shielded from the game: press/scroll events on the panel never reach `TouchInput`, typing in panel fields never reaches `Input`, and release events still pass through so a mouse press can never get stuck
- No backdrop blur or per-frame DOM churn, so the panel does not distort profiler numbers

### New Parameters
All existing parameter names are unchanged; new ones default to the previous behaviour.
- Dev Panel, Panel Hotkey (Backquote / F1 / F6 / F7 / F10 / F11), Open Panel on Launch, Panel Side, Toast Notifications
- Hold Loading Screen on Boot
- Start Profiler on Launch, Profiler Console Reports, Profiler Report Interval, Spike Threshold
- Stress: First Wave, Wave Interval, Growth Per Wave, Event Limit, Moving Events, Visible Animated Events, Debug Markers, Stop When FPS Collapses
- Validator: Known Notetags
- 7 new Shortcut List commands: Dev panel, Stress test, Validate project, Export actor stats, Profiler, Print profiler report, Hold loading screen

### Bug Fixes — DevToolsManage
- **Slow mode** ran at 1/(N+1) speed (e.g. 1/3 when set to 2), and on 120/144 Hz monitors the counter reset on zero-frame ticks so it could stall. Exactly one in N real frames now runs
- **Window close** — registering a `close` listener made NW.js wait for `close(true)`, so the first click on the X button did nothing. The handler now cleans up and closes
- **Reload on focus** used a constant that dropped the battle-test / event-test exclusion; `updateScene` now uses `isUseReload()` again (this also puts that method to use)
- **Browser test play** — `toggleRapid`, `toggleSlow`, `toggleFreeze` and `toggleAlwaysOnTop` dereferenced the missing NW window and threw; now null-safe. The resident-script prompt is guarded the same way
- **Title Skip** — a corrupt latest save left the game stuck on the boot screen (unhandled rejection); it now logs the error and starts a new game. The "continue" path now also calls `reloadMapIfUpdated()` so database edits since the save are picked up (`Scene_Boot.prototype.reloadMapIfUpdated` was previously copied but never called)
- **God mode** state was stored on `$gameParty._godMode` and written into save files; it now lives in the dev tools. Poison / slip damage bypassed `executeDamage`, so `Game_Actor.maxSlipDamage` is zeroed while God is on
- **Noclip** was stored as `$gamePlayer._through` (saved, and reset by movement routes); it is now applied through `Game_Player.isDebugThrough`
- Startup info is logged only during test play (it previously printed in released builds too)
- Screenshot no longer references the non-existent `Graphics.snapForBackground`; it renders the stage and captures directly
- `allitems()` skips unnamed placeholder items; `encounter()` refuses to start from outside the map scene; `reload()` works in browsers as well
- `GameNwWindow.cleanup()` runs once (it was called from both the close event and `SceneManager.terminate`)

### Bug Fixes — Ported Tools
**Event stress test (was NuclearEventThrottler)**
- The F9 listener was added on every map load, so after a few map changes one key press toggled the test several times. It is now bound through the Shortcut List (and F9 no longer collides with MZ's own debug scene key)
- Cleanup used `_events.filter()`, which compacts the array and shifts every event ID for the rest of the session, and left the fake events in `$dataMap` permanently. Arrays are now truncated back to their original length
- Removed the `Game_Event.event()` override that every event hit every frame
- "Enable Animations" and "Show Markers" were declared but did nothing; they now work (animated events use your actors' own walking sprites, so no missing-asset errors)
- `console.clear()` on start no longer wipes your console
- The test stops cleanly on map change or data reload, and before any save (via `DataManager.makeSaveContents`), so spawned events can never end up in a save file
- Waves are clamped to the event limit instead of overshooting it

**Event forcer (was NuclearEventForcer)**
- It hooked both `Scene_Map.update` and `Game_Map.update`, so forced events ran at double speed. Now a single hook
- It stored its interpreter on `event._interpreter`, which `Game_Event.refresh()` clears for non-parallel events, silently stopping them. Interpreters are now kept privately
- Events with no active page crashed (`page()` is undefined); they are skipped. Targets are dropped on map change, and a failing forced event is removed instead of crashing the map update

**Profiler (was DebugPerformanceDrainIdentifier)**
- It hooked `PIXI.Ticker.shared`, which MZ's app does not use, so "PIXI Full Frame" was always empty. It now hooks the app ticker (shared ticker as fallback), and adds a "Render Pass" bucket for draw-call submission time
- "Scene Logic" wrapped `Scene_Base.update`, which excludes map / event / player updates; it now wraps `SceneManager.updateScene`
- "Engine Core" is computed from top-level buckets only, so nested timers are no longer double-counted
- The "Tilemap / Map" patch checked the wrong method; added "Map Interpreter" bucket; parallel and common events are timed on their real methods
- Timers are exception-safe (`try/finally`)

**Project validator (was PluginContentValidator)**
- It looked for `$dataSystem.mapInfos`, which does not exist, so it only ever scanned the open map. It now reads `$dataMapInfos` and scans every map, plus common events, troops and tileset notes
- Results accumulated across runs; each run now starts clean
- Plugin commands are checked against MZ's real `Plugin:command` key, and the report says *why* each one failed (plugin not installed / turned off / no such command)
- Script-call check flagged every `Game_…` class as a missing plugin and `this.` calls too; it now flags only capitalised globals that genuinely do not exist
- Recognised notetags are discovered from the active plugins' source files (NW.js) instead of relying on a hard-coded list; the old list is kept as a base. `</closing>` tags and `a < b` inside notes no longer cause false hits, and identical unknown tags are grouped in the console summary
- Exported reports no longer double-encode arguments, and exporting no longer pops an in-game message box

**Actor stats export (was DebugStatsExplorer)**
- Trait names matched the wrong codes (11 was labelled "Skill" but is Element Rate, etc.); now matches MZ's trait codes, including Attack Skill, Debuff Rate, State Rate / Resist and Equip Lock / Seal
- "Initial Skills" listed trait code 11 as skills; it now lists the skills the actor actually has at their initial level
- Added class traits; a single failing actor no longer aborts the whole export
- No more stray message box when called from the console

**Mock loading screen (was DebugMockLoadingScreen)**
- It permanently blocked `Graphics.endLoading` with no way back. It is now a switch: `mockload()` toggles it, `mockload(false)` releases it, and a boot hold (parameter) continues the game when released

### Performance
- HUD, ribbon and tab refreshes are throttled (400 ms) and only run while the panel is open
- Profiler wrappers short-circuit to the original method while the profiler is off

### Dead Code Removed
- Old plain-text dev overlay builder (`Graphics._fpsStyles`, text-box `drawDevToolInfo` logic) — replaced by the HUD; `Graphics.drawDevToolInfo(text)` still exists and shows its text as a chip
- `CAN_RELOAD` constant

### Notes
- The panel hotkey is matched by physical key (`event.code`), so Backquote works on non-US layouts; it is ignored while typing in a game text field
- Profiler per-plugin timings only cover plugins that expose global classes (plugins written entirely inside an IIFE cannot be attributed)
- The profiler's frame ribbon in the panel measures frame pacing, not CPU time, and is available even when the profiler is off
- `window.event` still shadows the browser's legacy global; kept because it is a documented command
- Backups still use a synchronous copy, so very large `data` folders may cause a brief hitch
- Verified with a mocked-engine test harness (58 checks) and real Chromium renders of every panel tab; not yet exercised inside a live RPG Maker MZ / NW.js session
