//=============================================================================
// DebugMockLoadingScreen.js
// version 1.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Keeps the loading screen visible indefinitely for CSS testing
 * @author Alexandros Panagiotakopoulos
 * @url https://alexandros.dev/rmmz/plugins/debug-mock-loading-screen
 * @version 1.0.0
 * @date 19-11-2025
 *
 * @param enabled
 * @text Enable Mock Loading
 * @desc Enable infinite loading screen for CSS testing
 * @type boolean
 * @default true
 *
 * @param showConsoleMessage
 * @text Show Console Message
 * @desc Display a message in console when mock loading is active
 * @type boolean
 * @default true
 *
 * @help DebugMockLoadingScreen.js
 *
 * This plugin prevents the game from progressing past the loading screen,
 * allowing you to test and view your custom CSS animations indefinitely.
 *
 * Usage:
 * - Enable the plugin to activate mock loading
 * - Disable the plugin to allow normal game loading
 * - Check the browser console for confirmation messages
 *
 * Perfect for testing:
 * - Loading spinner animations
 * - CSS transitions and effects
 * - Responsive design behavior
 * - FPS counter display
 *
 * Version 1.0.0
 * - Initial release
 * 
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *   - Free for commercial and non-commercial use with proper attribution
 *   - Modify as needed for your project
 *   - Include copyright notice when redistributing
 *   - See LICENSE.md for full terms
 *
 */

(() => {
    'use strict';

    const pluginName = "DebugMockLoadingScreen";
    const parameters = PluginManager.parameters(pluginName);
    const enabled = parameters['enabled'] === 'true';
    const showConsoleMessage = parameters['showConsoleMessage'] === 'true';

    if (!enabled) {
        if (showConsoleMessage) {
            console.log('%c[DebugMockLoadingScreen] Plugin is DISABLED - Game will load normally', 
                'color: #4ade80; font-weight: bold;');
        }
        return;
    }

    if (showConsoleMessage) {
        console.log('%c[DebugMockLoadingScreen] Plugin is ENABLED - Infinite loading active!', 
            'color: #ff00ff; font-weight: bold; font-size: 14px;');
        console.log('%c[DebugMockLoadingScreen] The game will stay on the loading screen indefinitely.', 
            'color: #00d4ff; font-weight: bold;');
        console.log('%c[DebugMockLoadingScreen] Disable this plugin to allow normal game loading.', 
            'color: #7b61ff;');
    }

    //-----------------------------------------------------------------------------
    // Scene_Boot
    //
    // The scene class for initializing the entire game.

    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        // Don't call the original start method - this prevents scene transition
        if (showConsoleMessage) {
            console.log('%c[DebugMockLoadingScreen] Scene_Boot.start() intercepted - Staying on loading screen', 
                'color: #ffd700; font-style: italic;');
        }
        
        // Keep the loading screen visible by doing nothing
        // The game will remain in the boot scene indefinitely
    };

    const _Scene_Boot_update = Scene_Boot.prototype.update;
    Scene_Boot.prototype.update = function() {
        // Override update to prevent any loading progress
        // Just update the scene manager without progressing
        Scene_Base.prototype.update.call(this);
        
        // Optional: You can add a timer here to auto-disable after X seconds
        // Uncomment below to auto-disable after 30 seconds:
        /*
        if (!this._mockLoadingTimer) {
            this._mockLoadingTimer = 0;
        }
        this._mockLoadingTimer++;
        
        if (this._mockLoadingTimer > 1800) { // 30 seconds at 60fps
            console.log('%c[DebugMockLoadingScreen] Auto-disabling after 30 seconds', 
                'color: #ff6b6b; font-weight: bold;');
            _Scene_Boot_start.call(this);
        }
        */
    };

    //-----------------------------------------------------------------------------
    // Graphics
    //
    // Keep loading spinner visible

    const _Graphics_endLoading = Graphics.endLoading;
    Graphics.endLoading = function() {
        if (showConsoleMessage) {
            console.log('%c[DebugMockLoadingScreen] Graphics.endLoading() blocked - Spinner stays visible', 
                'color: #ff1493;');
        }
        // Don't call original endLoading - keeps spinner active
    };

    //-----------------------------------------------------------------------------
    // Additional Debug Info

    if (showConsoleMessage) {
        // Display helpful keyboard shortcuts info
        setTimeout(() => {
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #7b61ff;');
            console.log('%c🎨 DEBUG LOADING SCREEN ACTIVE', 
                'color: #00d4ff; font-size: 16px; font-weight: bold;');
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #7b61ff;');
            console.log('%cYou can now test your CSS animations!', 'color: #4ade80;');
            console.log('%c• Press F12 to open DevTools and inspect elements', 'color: #e0e0e0;');
            console.log('%c• Press F5 to reload and see animations from start', 'color: #e0e0e0;');
            console.log('%c• Resize window to test responsive behavior', 'color: #e0e0e0;');
            console.log('%c• Disable this plugin when done testing', 'color: #ffd700; font-weight: bold;');
            console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #7b61ff;');
        }, 500);
    }

})();
