# DevToolsManage.js — Changelog

## 2.3.0 — 2026/07/11
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
