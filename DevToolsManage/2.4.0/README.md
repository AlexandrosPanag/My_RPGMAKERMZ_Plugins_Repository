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

## 1.0.0 — 2020/04/05
Initial MZ port. Original MV version by Triacontane.
