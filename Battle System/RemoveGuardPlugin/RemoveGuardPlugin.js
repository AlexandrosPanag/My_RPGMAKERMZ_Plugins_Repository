//=============================================================================
// Remove Guard Command Plugin
// Version: 1.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Removes the Guard command from the battle menu.
 * @author Alexandros Panagiotakopoulos
 * @url alexandrospanag.github.io
 *
 * @help RemoveGuardCommand.js
 *
 * This plugin removes the "Guard" option from the actor command window
 * during side-view battles in RPG Maker MZ.
 *
 * ============================================================================
 * How to Use
 * ============================================================================
 * Simply install this plugin and the Guard command will no longer appear
 * in battle for any actors.
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * Free for commercial and non-commercial use.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 * Version 1.0.0 - Initial Release
 */

(() => {
    'use strict';

    // Override the makeCommandList method to exclude the guard command
    const _Window_ActorCommand_makeCommandList = Window_ActorCommand.prototype.makeCommandList;
    Window_ActorCommand.prototype.makeCommandList = function() {
        // Call the original method to build the command list
        _Window_ActorCommand_makeCommandList.call(this);
        
        // Filter out the guard command from the list
        this._list = this._list.filter(command => command.symbol !== 'guard');
    };

})();
