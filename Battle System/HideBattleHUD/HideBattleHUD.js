//=============================================================================
// Hide Battle Status HUD
// Version: 1.0.2
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Automatically doubles sprite size for events with specific names
 * @author Alexandros Panagiotakopoulos
 * @url https://alexandrospanag.github.io
 * @date 20/10/2025
 * v1.0.0
 * 
 * @help
 * This plugin hides the battle status window that shows character portraits,
 * HP, MP, and TP bars at the bottom of the screen.
 * 
 * Command windows (Fight/Escape, Attack/Skills/etc.) remain visible and functional.
 * 
 * No plugin commands or parameters needed - it works automatically.
 */

(() => {
    // Override the status window's show method to do nothing
    const _Window_BattleStatus_show = Window_BattleStatus.prototype.show;
    Window_BattleStatus.prototype.show = function() {
        // Don't call the original show method - keep it hidden
        this.visible = false;
        this.opacity = 0;
    };

    // Override the open method to prevent it from showing
    const _Window_BattleStatus_open = Window_BattleStatus.prototype.open;
    Window_BattleStatus.prototype.open = function() {
        this.visible = false;
        this.opacity = 0;
        this.openness = 0;
    };

    // Hide the status window on creation
    const _Scene_Battle_createStatusWindow = Scene_Battle.prototype.createStatusWindow;
    Scene_Battle.prototype.createStatusWindow = function() {
        _Scene_Battle_createStatusWindow.call(this);
        this._statusWindow.visible = false;
        this._statusWindow.opacity = 0;
        this._statusWindow.hide();
    };

    // Override update to keep it hidden
    const _Window_BattleStatus_update = Window_BattleStatus.prototype.update;
    Window_BattleStatus.prototype.update = function() {
        _Window_BattleStatus_update.call(this);
        this.visible = false;
        this.opacity = 0;
    };

})();