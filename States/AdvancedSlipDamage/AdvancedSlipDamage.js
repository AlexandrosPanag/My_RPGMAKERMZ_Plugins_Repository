
//=============================================================================
// Advanced Slip Damage Plugin
// Version: 1.0.0
// For RPG Maker MZ
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Advanced slip damage system with flat values, percentages, and formulas
 * @author Alexandros Panagiotakopoulos
 * @url https:alexandrospanag.github.io
 * @date 15-11-2025
 * @version 1.0.0
 *
 * @help
 * ============================================================================
 * Advanced Slip Damage Plugin
 * ============================================================================
 * 
 * This plugin extends RPG Maker MZ's damage over time system with powerful
 * new options including flat damage values, percentage-based damage, and
 * custom JavaScript formulas.
 * 
 * ============================================================================
 * Note Tags for States
 * ============================================================================
 * 
 * FLAT DAMAGE/HEALING:
 * 
 * <slipDamage: 50>
 * Deals exactly 50 HP damage per turn
 * 
 * <slipHeal: 30>
 * Heals exactly 30 HP per turn
 * 
 * <slipMpDamage: 20>
 * Drains exactly 20 MP per turn
 * 
 * <slipMpHeal: 15>
 * Restores exactly 15 MP per turn
 * 
 * <slipTpDamage: 10>
 * Reduces exactly 10 TP per turn
 * 
 * <slipTpGain: 5>
 * Increases exactly 5 TP per turn
 * 
 * ----------------------------------------------------------------------------
 * 
 * PERCENTAGE-BASED DAMAGE/HEALING:
 * 
 * <slipDamagePercent: 10>
 * Deals 10% of MAX HP as damage per turn
 * 
 * <slipHealPercent: 5>
 * Heals 5% of MAX HP per turn
 * 
 * <slipMpDamagePercent: 15>
 * Drains 15% of MAX MP per turn
 * 
 * <slipMpHealPercent: 8>
 * Restores 8% of MAX MP per turn
 * 
 * <slipTpDamagePercent: 20>
 * Reduces 20% of MAX TP (usually 20% of 100 = 20) per turn
 * 
 * <slipTpGainPercent: 10>
 * Increases 10% of MAX TP per turn
 * 
 * ----------------------------------------------------------------------------
 * 
 * CUSTOM FORMULAS:
 * 
 * <slipFormula: a.level * 5>
 * Deals damage equal to 5 times the target's level
 * 
 * <slipMpFormula: Math.floor(a.mmp * 0.1) + 10>
 * Drains 10% of max MP plus 10
 * 
 * <slipTpFormula: a.hp < a.mhp * 0.5 ? 20 : 10>
 * Drains 20 TP if HP below 50%, otherwise 10 TP
 * 
 * Available variables in formulas:
 * - a = the affected battler (target)
 * - a.hp, a.mp, a.tp = current values
 * - a.mhp, a.mmp = maximum values
 * - a.level = battler level
 * - a.atk, a.def, a.mat, a.mdf = parameters
 * - Math functions (Math.floor, Math.max, etc.)
 * 
 * Positive formula results = damage
 * Negative formula results = healing
 * 
 * ----------------------------------------------------------------------------
 * 
 * COMBINING EFFECTS:
 * 
 * You can use multiple tags in the same state!
 * 
 * <slipDamage: 20>
 * <slipMpDamage: 10>
 * Deals 20 HP and 10 MP damage per turn
 * 
 * <slipDamagePercent: 5>
 * <slipHeal: 10>
 * Deals 5% max HP damage but heals 10 HP (net damage may vary)
 * 
 * ============================================================================
 * Examples
 * ============================================================================
 * 
 * POISON STATE:
 * <slipDamage: 50>
 * Simple poison that deals 50 damage per turn
 * 
 * BURN STATE:
 * <slipDamagePercent: 8>
 * Burn that deals 8% of max HP per turn
 * 
 * REGENERATION STATE:
 * <slipHeal: 100>
 * Heals 100 HP every turn
 * 
 * MANA BURN STATE:
 * <slipMpDamagePercent: 10>
 * Drains 10% of max MP per turn
 * 
 * LEVEL-SCALED POISON:
 * <slipFormula: a.level * 3>
 * Damage scales with target's level (level 10 = 30 damage)
 * 
 * DESPERATE MEASURE:
 * <slipFormula: a.hp < a.mhp * 0.3 ? -50 : 20>
 * Deals 20 damage normally, but heals 50 if HP below 30%
 * 
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * Free for commercial and non-commercial use with attribution.
 * Credit: Alexandros Panagiotakopoulos
 * 
 */

(() => {
    'use strict';

    const pluginName = 'AdvancedSlipDamage';

    //=========================================================================
    // DataManager
    //=========================================================================
    
    const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!_DataManager_isDatabaseLoaded.call(this)) return false;
        if (!this._slipDamageProcessed) {
            this.processSlipDamageNotes();
            this._slipDamageProcessed = true;
        }
        return true;
    };

    DataManager.processSlipDamageNotes = function() {
        for (let i = 1; i < $dataStates.length; i++) {
            const state = $dataStates[i];
            if (state) {
                this.processSlipDamageNotesForState(state);
            }
        }
    };

    DataManager.processSlipDamageNotesForState = function(state) {
        state.slipDamage = {
            hp: null,
            hpPercent: null,
            hpFormula: null,
            mp: null,
            mpPercent: null,
            mpFormula: null,
            tp: null,
            tpPercent: null,
            tpFormula: null
        };

        const notedata = state.note.split(/[\r\n]+/);
        
        for (let line of notedata) {
            // HP Flat
            if (line.match(/<slipDamage:\s*(-?\d+)>/i)) {
                state.slipDamage.hp = parseInt(RegExp.$1);
            }
            if (line.match(/<slipHeal:\s*(\d+)>/i)) {
                state.slipDamage.hp = -parseInt(RegExp.$1);
            }
            
            // HP Percent
            if (line.match(/<slipDamagePercent:\s*(-?\d+\.?\d*)>/i)) {
                state.slipDamage.hpPercent = parseFloat(RegExp.$1);
            }
            if (line.match(/<slipHealPercent:\s*(\d+\.?\d*)>/i)) {
                state.slipDamage.hpPercent = -parseFloat(RegExp.$1);
            }
            
            // HP Formula
            if (line.match(/<slipFormula:\s*(.+)>/i)) {
                state.slipDamage.hpFormula = String(RegExp.$1);
            }
            
            // MP Flat
            if (line.match(/<slipMpDamage:\s*(-?\d+)>/i)) {
                state.slipDamage.mp = parseInt(RegExp.$1);
            }
            if (line.match(/<slipMpHeal:\s*(\d+)>/i)) {
                state.slipDamage.mp = -parseInt(RegExp.$1);
            }
            
            // MP Percent
            if (line.match(/<slipMpDamagePercent:\s*(-?\d+\.?\d*)>/i)) {
                state.slipDamage.mpPercent = parseFloat(RegExp.$1);
            }
            if (line.match(/<slipMpHealPercent:\s*(\d+\.?\d*)>/i)) {
                state.slipDamage.mpPercent = -parseFloat(RegExp.$1);
            }
            
            // MP Formula
            if (line.match(/<slipMpFormula:\s*(.+)>/i)) {
                state.slipDamage.mpFormula = String(RegExp.$1);
            }
            
            // TP Flat
            if (line.match(/<slipTpDamage:\s*(-?\d+)>/i)) {
                state.slipDamage.tp = parseInt(RegExp.$1);
            }
            if (line.match(/<slipTpGain:\s*(\d+)>/i)) {
                state.slipDamage.tp = -parseInt(RegExp.$1);
            }
            
            // TP Percent
            if (line.match(/<slipTpDamagePercent:\s*(-?\d+\.?\d*)>/i)) {
                state.slipDamage.tpPercent = parseFloat(RegExp.$1);
            }
            if (line.match(/<slipTpGainPercent:\s*(\d+\.?\d*)>/i)) {
                state.slipDamage.tpPercent = -parseFloat(RegExp.$1);
            }
            
            // TP Formula
            if (line.match(/<slipTpFormula:\s*(.+)>/i)) {
                state.slipDamage.tpFormula = String(RegExp.$1);
            }
        }
    };

    //=========================================================================
    // Game_Battler
    //=========================================================================

    const _Game_Battler_regenerateAll = Game_Battler.prototype.regenerateAll;
    Game_Battler.prototype.regenerateAll = function() {
        _Game_Battler_regenerateAll.call(this);
        if (this.isAlive()) {
            this.processSlipDamage();
        }
    };

    Game_Battler.prototype.processSlipDamage = function() {
        for (const state of this.states()) {
            if (state.slipDamage) {
                this.processSlipDamageForState(state);
            }
        }
    };

    Game_Battler.prototype.processSlipDamageForState = function(state) {
        const sd = state.slipDamage;
        
        // Process HP
        let hpDamage = 0;
        if (sd.hp !== null) hpDamage += sd.hp;
        if (sd.hpPercent !== null) hpDamage += Math.floor(this.mhp * sd.hpPercent / 100);
        if (sd.hpFormula !== null) {
            try {
                const a = this;
                hpDamage += eval(sd.hpFormula);
            } catch (e) {
                console.error('Slip Formula Error:', e);
            }
        }
        if (hpDamage !== 0) {
            this.gainHp(-hpDamage);
        }
        
        // Process MP
        let mpDamage = 0;
        if (sd.mp !== null) mpDamage += sd.mp;
        if (sd.mpPercent !== null) mpDamage += Math.floor(this.mmp * sd.mpPercent / 100);
        if (sd.mpFormula !== null) {
            try {
                const a = this;
                mpDamage += eval(sd.mpFormula);
            } catch (e) {
                console.error('Slip MP Formula Error:', e);
            }
        }
        if (mpDamage !== 0) {
            this.gainMp(-mpDamage);
        }
        
        // Process TP
        let tpDamage = 0;
        if (sd.tp !== null) tpDamage += sd.tp;
        if (sd.tpPercent !== null) tpDamage += Math.floor(this.maxTp() * sd.tpPercent / 100);
        if (sd.tpFormula !== null) {
            try {
                const a = this;
                tpDamage += eval(sd.tpFormula);
            } catch (e) {
                console.error('Slip TP Formula Error:', e);
            }
        }
        if (tpDamage !== 0) {
            this.gainTp(-tpDamage);
        }
    };

})();
