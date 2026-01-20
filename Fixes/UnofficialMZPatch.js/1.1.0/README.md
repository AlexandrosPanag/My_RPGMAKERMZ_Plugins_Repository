# UnofficialMZPatch.js - v1.1.0 Patch Notes

## Fixed Issues

### Critical Fix: Sprites Becoming Invisible During Idle
**Issue**: After the game became completely idle (no input for extended period), all characters and sprites would become invisible.

**Root Cause**: The Smooth Scene Transitions feature (SECTION 8F) was creating a black fade sprite that would get stuck at full opacity (255) when the game went idle or during alt-tab events. This fade sprite covered the entire screen, making all game content invisible.

**Solution**: Completely removed the Smooth Scene Transitions system (SECTION 8F) including:
- Entire `TransitionManager` object and all related methods
- Visibility change event listeners (`visibilitychange`, `blur`, `focus`)
- TransitionManager update calls from `SceneManager.updateMain`
- Global `$transitions` variable exposure

**Impact**: 
- ✅ Sprites and characters no longer become invisible during idle periods
- ✅ Game remains fully visible after alt-tabbing
- ❌ Smooth scene transitions feature is no longer available (can be re-enabled via parameter, but currently disabled by default)

### Parameter Changes
- `enableSmoothTransitions` parameter is now effectively non-functional (feature removed from codebase)
- `transitionDuration` parameter is now unused

## Recommendations

For users who were using the Smooth Transitions feature:
1. The feature has been completely removed to prevent the invisibility bug
2. RPG Maker MZ's default scene transitions will be used instead
3. If you need custom transitions, consider using a dedicated transition plugin

## Files Modified
- `UnofficialMZPatch.js` - Lines ~1469-1625 (SECTION 8F removed)
- `UnofficialMZPatch.js` - Lines ~2128-2158 (TransitionManager update calls removed)

## Testing Notes
- Tested with game running idle for extended periods - sprites remain visible ✅
- Tested with alt-tab during gameplay - no invisibility issues ✅
- All other plugin features remain functional ✅
