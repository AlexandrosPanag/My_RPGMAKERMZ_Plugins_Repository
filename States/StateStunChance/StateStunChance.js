//=============================================================================
// State Stun Chance Plugin
// Version: 1.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Adds a chance for states to stun the afflicted battler each turn
 * @author Alexandros Panagiotakopoulos
 * @url https:alexandrospanag.github.io
 * @date 15-11-2025
 * @version 1.0.0
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * 
 * This plugin allows you to add a stun chance to any state. Each turn while
 * the state is active, there's a chance the battler will be stunned for that
 * turn.
 * 
 * ============================================================================
 * Note Tags
 * ============================================================================
 * 
 * Use the following note tag in the State's note box:
 * 
 * <stunChance:X>
 * 
 * Where X is the percentage chance (0-100) to stun each turn.
 * 
 * Examples:
 * <stunChance:5>   - 5% chance to stun each turn
 * <stunChance:25>  - 25% chance to stun each turn
 * <stunChance:100> - 100% chance to stun each turn (guaranteed)
 * 
 * ============================================================================
 * How It Works
 * ============================================================================
 * 
 * - The stun check happens at the start of each turn
 * - If the battler is stunned, they cannot act that turn
 * - The state duration continues normally (stun doesn't consume turns)
 * - If the state is reapplied, the stun chance continues with the new duration
 * - Multiple states with stun chances are checked independently
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.0.0:
 * - Initial release
 * 
 */

(() => {
    'use strict';

    //=========================================================================
    // Game_BattlerBase - Extract Stun Chance from States
    //=========================================================================
    
    Game_BattlerBase.prototype.getStunChanceFromStates = function() {
        const stunChances = [];
        
        for (const state of this.states()) {
            const match = state.note.match(/<stunChance:(\d+)>/i);
            if (match) {
                const chance = Number(match[1]);
                if (chance > 0) {
                    stunChances.push({
                        stateId: state.id,
                        chance: chance,
                        stateName: state.name
                    });
                }
            }
        }
        
        return stunChances;
    };

    //=========================================================================
    // Game_Battler - Check for Stun at Turn Start
    //=========================================================================
    
    const _Game_Battler_onTurnEnd = Game_Battler.prototype.onTurnEnd;
    Game_Battler.prototype.onTurnEnd = function() {
        // Clear the stun flag from the previous turn
        this._stunnedThisTurn = false;
        _Game_Battler_onTurnEnd.call(this);
    };

    Game_Battler.prototype.checkStateStunChance = function() {
        this._stunnedThisTurn = false;
        
        const stunChances = this.getStunChanceFromStates();
        
        for (const stunData of stunChances) {
            if (Math.random() * 100 < stunData.chance) {
                this._stunnedThisTurn = true;
                
                // Display a message about being stunned
                if ($gameParty.inBattle()) {
                    const stateName = stunData.stateName;
                    this.startAnimation(49, false, 0); // Stun animation (change ID as needed)
                    
                    if (this.isActor()) {
                        $gameMessage.add(`${this.name()} is stunned by ${stateName}!`);
                    } else {
                        $gameMessage.add(`${this.name()} is stunned by ${stateName}!`);
                    }
                }
                
                break; // Only stun once even if multiple states could stun
            }
        }
        
        return this._stunnedThisTurn;
    };

    Game_Battler.prototype.isStunnedByState = function() {
        return this._stunnedThisTurn === true;
    };

    //=========================================================================
    // BattleManager - Check Stun at Turn Start
    //=========================================================================
    
    const _BattleManager_startTurn = BattleManager.startTurn;
    BattleManager.startTurn = function() {
        // Check stun chance for the current subject before they act
        const subject = this._subject;
        if (subject) {
            subject.checkStateStunChance();
        }
        _BattleManager_startTurn.call(this);
    };

    //=========================================================================
    // Game_Battler - Prevent Action if Stunned
    //=========================================================================
    
    const _Game_Battler_canMove = Game_Battler.prototype.canMove;
    Game_Battler.prototype.canMove = function() {
        if (this.isStunnedByState()) {
            return false;
        }
        return _Game_Battler_canMove.call(this);
    };

    //=========================================================================
    // Game_Action - Ensure Stunned Battlers Don't Act
    //=========================================================================
    
    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        // If the subject is stunned, don't apply the action
        if (this.subject().isStunnedByState()) {
            return;
        }
        _Game_Action_apply.call(this, target);
    };

})();
