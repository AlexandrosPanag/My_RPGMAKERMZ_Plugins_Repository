Version 1.0.1 Changelog (2025-11-01):
CRITICAL BUG FIX:

Fixed: Frame rate not restoring properly after waking from hibernation - game was stuck at ~10 FPS after wake
Fixed: requestAnimationFrame reference now properly saved and restored using this.originalRequestAnimationFrame
Fixed: Added isRAFThrottled flag to prevent multiple RAF throttling attempts
Improved: RAF restoration now explicitly logs when it's restored for debugging purposes

Technical Details:
The issue was that applyPerformanceScaling() was replacing window.requestAnimationFrame with a throttled version, but the original reference wasn't being saved before modification. When restoreFullPerformance() tried to restore it, it was checking for window.originalRequestAnimationFrame (which didn't exist), causing the throttled version to remain active even after waking.
