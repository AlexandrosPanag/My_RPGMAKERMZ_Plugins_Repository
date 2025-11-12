//=============================================================================
// Anti-Regeneration Debuff Plugin
// Version: 1.0.0
// For RPG Maker MZ
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Adds an Anti-Regeneration debuff that reverses healing into damage
 * @author Alexandros Panagiotakopoulos
 * @version 1.0.0
 * @date 12-11-2025
 * @url alexandrospanag.github.io
 *
 * @help
 * ============================================================================
 * Anti-Regeneration Debuff Plugin
 * ============================================================================
 * 
 * This plugin allows you to create states that reverse regeneration effects,
 * turning healing into damage instead.
 * 
 * ============================================================================
 * Note Tags
 * ============================================================================
 * 
 * State Note Tags:
 * 
 * <antiRegen>
 * Makes this state reverse all regeneration effects (HP, MP, TP) into their
 * opposite. Healing becomes damage, and damage becomes healing.
 * 
 * <antiRegen: hp>
 * Reverses only HP regeneration effects
 * 
 * <antiRegen: mp>
 * Reverses only MP regeneration effects
 * 
 * <antiRegen: tp>
 * Reverses only TP regeneration effects
 * 
 * <antiRegen: hp mp>
 * Reverses both HP and MP regeneration (you can combine any types)
 * 
 * ============================================================================
 * Examples
 * ============================================================================
 * 
 * Create a state in your database with one of these note tags:
 * 
 * <antiRegen>
 * This will reverse ALL regeneration effects for the duration of the state
 * 
 * <antiRegen: hp mp>
 * This will reverse HP and MP regeneration, but TP regeneration works normally
 * 
 * ============================================================================
 * How It Works
 * ============================================================================
 * 
 * When a battler has a state with the <antiRegen> note tag:
 * - Any HP regeneration becomes HP damage
 * - Any MP regeneration becomes MP damage
 * - Any TP regeneration becomes TP damage
 * - This works with all default regeneration states
 * - The effect lasts for the duration of the anti-regen state
 * 
*   Terms of Use:
*   - Free for commercial and non-commercial use with proper attribution
*   - Modify as needed for your project
*   - Include copyright notice when redistributing
*   - See LICENSE.md for full terms
 */

(() => {
    'use strict';

    const pluginName = 'AntiRegenerationDebuff';

    //=========================================================================
    // DataManager
    //=========================================================================
    
    const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!_DataManager_isDatabaseLoaded.call(this)) return false;
        if (!this._antiRegenProcessed) {
            this.processAntiRegenNotes();
            this._antiRegenProcessed = true;
        }
        return true;
    };

    DataManager.processAntiRegenNotes = function() {
        for (let i = 1; i < $dataStates.length; i++) {
            const state = $dataStates[i];
            if (state) {
                this.processAntiRegenNotesForState(state);
            }
        }
    };

    DataManager.processAntiRegenNotesForState = function(state) {
        state.antiRegen = {
            active: false,
            hp: false,
            mp: false,
            tp: false
        };

        const notedata = state.note.split(/[\r\n]+/);
        for (let line of notedata) {
            if (line.match(/<antiRegen(?:\s*:\s*(.+))?>/i)) {
                state.antiRegen.active = true;
                
                if (RegExp.$1) {
                    const types = RegExp.$1.toLowerCase().split(/\s+/);
                    for (let type of types) {
                        if (type === 'hp') state.antiRegen.hp = true;
                        if (type === 'mp') state.antiRegen.mp = true;
                        if (type === 'tp') state.antiRegen.tp = true;
                    }
                } else {
                    // If no specific types are mentioned, reverse all
                    state.antiRegen.hp = true;
                    state.antiRegen.mp = true;
                    state.antiRegen.tp = true;
                }
            }
        }
    };

    //=========================================================================
    // Game_Battler
    //=========================================================================

    Game_Battler.prototype.hasAntiRegen = function(type) {
        return this.states().some(state => {
            return state.antiRegen && state.antiRegen.active && state.antiRegen[type];
        });
    };

    const _Game_Battler_regenerateHp = Game_Battler.prototype.regenerateHp;
    Game_Battler.prototype.regenerateHp = function() {
        const value = Math.floor(this.hrg * this.mhp);
        
        if (value !== 0) {
            if (this.hasAntiRegen('hp')) {
                // Reverse the regeneration
                this.gainHp(-value);
            } else {
                // Normal regeneration
                this.gainHp(value);
            }
        }
    };

    const _Game_Battler_regenerateMp = Game_Battler.prototype.regenerateMp;
    Game_Battler.prototype.regenerateMp = function() {
        const value = Math.floor(this.mrg * this.mmp);
        
        if (value !== 0) {
            if (this.hasAntiRegen('mp')) {
                // Reverse the regeneration
                this.gainMp(-value);
            } else {
                // Normal regeneration
                this.gainMp(value);
            }
        }
    };

    const _Game_Battler_regenerateTp = Game_Battler.prototype.regenerateTp;
    Game_Battler.prototype.regenerateTp = function() {
        const value = Math.floor(this.trg * 100);
        
        if (value !== 0) {
            if (this.hasAntiRegen('tp')) {
                // Reverse the regeneration
                this.gainTp(-value);
            } else {
                // Normal regeneration
                this.gainTp(value);
            }
        }
    };

})();
