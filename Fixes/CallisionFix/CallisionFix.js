/*:
 * @target MZ
 * @plugindesc Prevents walking through impassable tiles (X marked tiles)
 * @author Alexandros Panagiotokopoulos
 * @version 1.0.0
 * alexandrospanag.github.io
 * @help
 * This plugin fixes collision detection to completely prevent walking
 * through tiles marked with X (impassable).
 * 
 * No configuration needed - just install and it works automatically.
 */

(() => {
    'use strict';

    // Override moveStraight to add strict collision checking
    const _Game_Player_moveStraight = Game_Player.prototype.moveStraight;
    Game_Player.prototype.moveStraight = function(d) {
        const x = this.x;
        const y = this.y;
        const x2 = $gameMap.roundXWithDirection(x, d);
        const y2 = $gameMap.roundYWithDirection(y, d);
        
        // Strict passability check - check all layers
        if (!this.canPassDiagonally(x, y, d, d)) {
            if (!$gameMap.isPassable(x2, y2, this.reverseDir(d))) {
                return;
            }
            if (!$gameMap.isPassable(x, y, d)) {
                return;
            }
        }
        
        _Game_Player_moveStraight.call(this, d);
    };

    // Override the core passability check
    const _Game_Map_isPassable = Game_Map.prototype.isPassable;
    Game_Map.prototype.isPassable = function(x, y, d) {
        // Check all tile layers for impassable flags
        if (!this.checkPassage(x, y, (1 << (d / 2 - 1)) & 0x0f)) {
            return false;
        }
        return _Game_Map_isPassable.call(this, x, y, d);
    };

    // Add additional check in canPass
    const _Game_CharacterBase_canPass = Game_CharacterBase.prototype.canPass;
    Game_CharacterBase.prototype.canPass = function(x, y, d) {
        const x2 = $gameMap.roundXWithDirection(x, d);
        const y2 = $gameMap.roundYWithDirection(y, d);
        
        if (!$gameMap.isValid(x2, y2)) {
            return false;
        }
        
        if (this.isThrough() || this.isDebugThrough()) {
            return true;
        }
        
        // Force check the tile flags
        if (!$gameMap.isPassable(x, y, d)) {
            return false;
        }
        if (!$gameMap.isPassable(x2, y2, this.reverseDir(d))) {
            return false;
        }
        if (this.isCollidedWithCharacters(x2, y2)) {
            return false;
        }
        
        return true;
    };

})();