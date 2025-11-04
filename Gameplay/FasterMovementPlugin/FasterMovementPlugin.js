//=============================================================================
// Faster Movement Speed
// Version: 1.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Increases walking and running speeds for the player party
 * @author Alexandros Panagiotakopoulos
 * @version 1.0.0
 * 
 * @param walkSpeed
 * @text Walking Speed
 * @type number
 * @min 1
 * @max 10
 * @default 5
 * @desc Normal walking speed (default: 4, recommended: 5-6)
 * 
 * @param dashSpeed
 * @text Running/Dash Speed
 * @type number
 * @min 1
 * @max 10
 * @default 7
 * @desc Running/dashing speed (default: 5, recommended: 7-8)
 * 
 * @help
 * ============================================================================
 * Faster Movement Speed Plugin
 * ============================================================================
 * 
 * This plugin increases the walking and running speeds for the player.
 * 
 * Default RPG Maker MZ speeds:
 * - Walk: 4
 * - Run/Dash: 5
 * 
 * Recommended settings:
 * - Walk: 5-6 (faster walking)
 * - Run/Dash: 7-8 (much faster running)
 * 
 * You can adjust these values in the plugin parameters!
 * 
 * ============================================================================
 */

(() => {
    const pluginName = "FasterMovementSpeed";
    const parameters = PluginManager.parameters(pluginName);
    const walkSpeed = Number(parameters['walkSpeed'] || 5);
    const dashSpeed = Number(parameters['dashSpeed'] || 7);

    // Override the realMoveSpeed method for Game_Player
    const _Game_Player_realMoveSpeed = Game_Player.prototype.realMoveSpeed;
    Game_Player.prototype.realMoveSpeed = function() {
        if (this.isDashing()) {
            return dashSpeed;
        } else {
            return walkSpeed;
        }
    };

    // Also apply to followers
    const _Game_Follower_realMoveSpeed = Game_Follower.prototype.realMoveSpeed;
    Game_Follower.prototype.realMoveSpeed = function() {
        return $gamePlayer.realMoveSpeed();
    };

})();
