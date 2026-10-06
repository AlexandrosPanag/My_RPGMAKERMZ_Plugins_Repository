# DevToolsManage.js — Changelog

## 2.4.0 — October 6 2026
**Modified by:** Alexandros Panagiotakopoulos

### Performance
- `SceneManager.determineRepeatNumber` — now returns early when neither rapid nor slow mode is active, skipping the per-frame scan of every window in the scene (slow counter is still reset, so behavior is unchanged)
- `Graphics.drawDevToolInfo` — checks the memory param first, and only touches the DOM (`display` / `textContent`) when the value actually changed
- `SceneManager.updateScript` — per-frame `forEach` closure replaced with a plain `for` loop
- `vars()` / `switches()` — filter string is lowercased once instead of on every iteration
- Click menu — the `mousedown` listener and menu are no longer created when Click Menu is set to Disable
- Screenshots — PNG bytes are written asynchronously with `fs.writeFile` instead of a base64 round-trip plus blocking `writeFileSync`

### Graphics / Overlay
- Dev info overlay now has `pointer-events:none` (it can no longer swallow mouse clicks), `user-select:none`, and tabular numerals so the text doesn't jitter
- Screenshot capture falls back to rendering the PIXI stage directly when `Graphics.snapForBackground` does not exist, so the canvas is not captured blank

### Bug Fixes
- **God mode** — previously hooked `Game_Battler.executeDamage`, which does not exist in MZ, so it likely never worked. Now hooks `Game_Action.executeDamage` (installed once at load, toggled by `god()`)
- **`window.escape` alias removed** — `escape = flee` overwrote the browser's native `escape()` function, which older libraries rely on
- **`history()` renamed to `hist()`** — it attempted to overwrite `window.history` (the browser History API). Help text updated
- **Non-NW.js test play** — map/data auto-reload dereferenced `_nwWindow` every frame and would throw; now guarded with `Utils.isNwjs()`
- **List commands** — `item()`, `weapon()`, `armor()` and `encounter()` listings skipped the first entry (off-by-one in `slice` after `filter(Boolean)`)
- **Blank shortcut entries** — a Shortcut List entry with no command crashed menu creation; unknown/blank entries are now skipped
- **`MaxBackups`** — an undefined/NaN value would have caused `slice(undefined)` to delete every backup; now guarded (0 still means unlimited)
- **Console filters** — warning/error suppression no longer joins arbitrary arguments (could throw on odd objects); it only inspects strings and Errors, and can only be installed once
- `tp(x, y)` now uses `$gamePlayer.locate` so the camera recenters and followers are synchronized
- `speed()` now logs the clamped value instead of the raw input
- `Game_Map.eraseEvent` — no longer stores duplicate event IDs and tolerates a missing `_eraseEvents` array
- `Scene_Boot.cutSceneTitle` — `case 2` wrapped in braces (lexical declaration in a case clause)

### Dead Code Removed
- `_windowState` and its minimize / maximize / restore window listeners — written but never read anywhere
- Old `Game_Battler` god-mode hook (replaced by the working `Game_Action` hook above)
- Duplicated project-path lookup — screenshot and backup now share `DevConsole.getProjectPath()`

### New Features
- **Show Memory Usage** (new plugin parameter, default OFF) — the memory-monitoring code already existed but its parameter was never declared, so it could never be enabled. It is now declared and the overlay refreshes every second instead of only when a toggle changes
- **Screenshot** and **Backup** are now selectable in the Shortcut List (hotkey / menu bar / click menu). Both commands existed in code but were unreachable from the editor
- Manual Backup now works even when Auto Backup is OFF, and only plays the save sound if the backup succeeded (`createBackup(force)` now returns true/false)
- `help("vars")`, `help("switches")`, `help("party")`, `help("hist")` and `help("cls")` now work; `cls()` added to the help listing

### Notes
- Intentionally left untouched: `SceneManager.isUseReload` (unused here but possibly used by other plugins) and `Scene_Boot.prototype.reloadMapIfUpdated`
- `window.event` still shadows the browser's legacy global; kept because it is a documented command
- Backups still use a synchronous copy, so very large `data` folders may cause a brief hitch

---

## 2.3.0 — July 11 2026
**Modified by:** Alexandros Panagiotakopoulos

### Dead Code Removed
- Removed duplicate `/*:ja` jsdoc block (~200 lines) — cosmetic only, RPG Maker MZ ignores it
- Removed unused `Controller_NwJs` function stub — declared but never implemented or referenced
- Removed empty `_blurHandler` — registered as a window listener but contained only a placeholder comment
- Removed dead `getWindowState()` method — returned a value that was never read anywhere in the plugin
- Eliminated duplicate screenshot blob logic — `window.screenshot` and `executeScreenshot` were identical; both now call a shared `DevConsole.takeScreenshot()` helper

### Code Compression (~303 lines reduced, 2166 → 1863)
- Collapsed ~40 single-body methods to one-liners across `SceneManager`, `ShortCutCommand`, and `GameNwWindow`
- All `execute*` delegate methods in `ShortCutCommand` compressed to one-liners
- `BattleManager.forceVictory/forceDefect/forceAbort` refactored to guard-return style with arrow callbacks
- `Scene_Base.isAnyWindowActive` simplified with optional chaining
- `DataManager.reloadSystemData` — `.filter()[0]` replaced with `.find()`
- `Game_Map.restoreEventErase` — explicit `if` block replaced with optional chaining
- `setInitAlwaysOnTop` / `setInitRapid` — `if/else` blocks replaced with ternary
- `SceneManager.findShortCut` — `.filter()[0]` replaced with `.find()`

### New Console Commands
Three new commands available in the DevTools console during test play:

| Command | Description |
|---|---|
| `vars()` | Dumps all non-zero `$gameVariables` with their database names. Pass a string to filter by name: `vars("gold")` |
| `switches()` | Dumps all ON `$gameSwitches` with their database names. Pass a string to filter: `switches("door")` |
| `party()` | Compact party overview — shows each member's level, HP, MP, and active states, plus current gold |

---

## 2.2.0 — 2026/02/07
Fixed `require.main.filename` error with NW.js fallback paths, added `/help` console command system, code optimizations, cached DOM queries.

## 2.1.0 — 2025/11/19
Code modernization: updated to 2025 standards, replaced deprecated Node.js APIs.

## 2.0.1 — 2025/11/15
Memory & performance update: fixed memory leaks, added cleanup methods.

## 1.3.0 — 2025/11/01
Improvements: use of modern NW.js API, performance optimization, UI improvements.

## 1.2.2 — 2023/10/07
IDE breakpoint support is now optional.

## 1.2.1 — 2023/07/20
Fixed an incorrect title cut for the English parameter.

## 1.2.0 — 2023/01/08
Changed the behavior of title cuts to allow choosing between starting a new game or loading the latest data.

## 1.1.4 — 2022/04/30
Addressed an issue where an error would occur when using the map reload function after deleting events duplicated with the EventRespawn.js region function.

## 1.1.3 — 2021/04/10
Disabled the incomplete function that prevented title cuts by holding down the CTRL key during title cut settings.

## 1.1.2 — 2021/03/27
Fixed an issue where deleted events would not be restored during normal loads.

## 1.1.1 — 2020/10/11
Fixed a conflict where enemy groups were not selected correctly in battle tests when combined with AnimationMv.js.

## 1.1.0 — 2020/09/26
Added a shortcut command to open the project folder.

## 1.0.5 — 2020/09/13
Fixed an issue where the forced victory command did not work.

## 1.0.4 — 2020/08/21
Fixed an issue where an error occurred when attempting to use the map auto-reload function.

## 1.0.3 — 2020/08/20
Fixed an issue where the plugin would not work with the official version of PluginCommonBase.

## 1.0.2 — 2020/06/06
Improved the English help.

## 1.0.1 — 2020/04/20
Improved breakpoints.

## 1.0.0 — 2020/04/05
Initial MZ port. Original MV version by Triacontane.
