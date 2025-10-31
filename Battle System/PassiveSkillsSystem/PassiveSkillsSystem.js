//=============================================================================
// Passive Skills System
// Version: 1.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Adds passive skills system with auto-battle effects and stacking buffs
 * @author Alexandros Panagiotakopoulos
 * @url https://alexandrospanag.github.io
 * @help
 * ============================================================================
 * Passive Skills System v1.0.0
 * ============================================================================
 * 
 * This plugin allows you to create passive skills that are always active
 * when an actor has learned them, plus special combat effects.
 * 
 * ============================================================================
 * SKILL NOTE TAGS
 * ============================================================================
 * 
 * <Passive>
 * Makes this skill a passive that's always active when learned.
 * 
 * <Passive State: x>
 * Applies state x to the actor at the start of battle (and keeps it active).
 * 
 * <HP Regen: x%>
 * Regenerates x% of MaxHP per turn (e.g., <HP Regen: 5%>)
 * 
 * <MP Regen: x%>
 * Regenerates x% of MaxMP per turn (e.g., <MP Regen: 3%>)
 * 
 * <TP Regen: x>
 * Regenerates x TP per turn (e.g., <TP Regen: 10>)
 * 
 * <On Attack State: x, y%>
 * When this actor attacks, y% chance to apply state x to target
 * Example: <On Attack State: 5, 30%> = 30% chance to apply state 5
 * 
 * <On Attack Self State: x>
 * When this actor attacks, apply state x to themselves
 * Example: <On Attack Self State: 12> for stacking ATK buff
 * 
 * <Battle Start State: x>
 * Applies state x at the start of battle
 * 
 * ============================================================================
 * STATE NOTE TAGS
 * ============================================================================
 * 
 * <Stack Max: x>
 * This state can stack up to x times, multiplying its trait effects
 * Example: State with +10% ATK and <Stack Max: 5> = up to +50% ATK
 * 
 * ============================================================================
 * EXAMPLES
 * ============================================================================
 * 
 * EXAMPLE 1: HP Regeneration Passive
 * Create a skill with note: <Passive><HP Regen: 5%>
 * 
 * EXAMPLE 2: Blazing Spirit (Attack Power Stacking)
 * 1. Create State "Rising Heat" with:
 *    - Traits: ATK +10%
 *    - Note: <Stack Max: 5>
 *    - Auto Removal: End of Battle
 * 
 * 2. Create Skill "Blazing Spirit" with:
 *    - Note: <Passive><On Attack Self State: x>
 *    (where x is Rising Heat's state ID)
 * 
 * EXAMPLE 3: MP Regeneration
 * Create skill with: <Passive><MP Regen: 3%>
 * 
 * EXAMPLE 4: Burn on Attack
 * Create skill with: <Passive><On Attack State: 5, 25%>
 * (25% chance to burn enemy, assuming state 5 is burn)
 * 
 * ============================================================================
 */

(() => {
    'use strict';

    const pluginName = 'PassiveSkills';

    //=============================================================================
    // Game_BattlerBase - Passive Skill Recognition
    //=============================================================================

    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.call(this);
        this._passiveStates = [];
        this._stateStacks = {};
    };

    Game_BattlerBase.prototype.passiveSkills = function() {
        // Only actors have skills - enemies don't
        if (!this.skills || typeof this.skills !== 'function') {
            return [];
        }
        return this.skills().filter(skill => this.isPassiveSkill(skill));
    };

    Game_BattlerBase.prototype.isPassiveSkill = function(skill) {
        if (!skill) return false;
        return skill.meta.Passive !== undefined;
    };

    //=============================================================================
    // Game_Battler - Regeneration Effects
    //=============================================================================

    const _Game_Battler_regenerateAll = Game_Battler.prototype.regenerateAll;
    Game_Battler.prototype.regenerateAll = function() {
        _Game_Battler_regenerateAll.call(this);
        if (this.isAlive()) {
            this.applyPassiveRegeneration();
        }
    };

    Game_Battler.prototype.applyPassiveRegeneration = function() {
        const passives = this.passiveSkills();
        
        for (const skill of passives) {
            // HP Regeneration
            if (skill.meta.HPRegen) {
                const regenPercent = parseFloat(skill.meta.HPRegen);
                const value = Math.floor(this.mhp * regenPercent / 100);
                if (value !== 0) {
                    this.gainHp(value);
                }
            }
            
            // MP Regeneration
            if (skill.meta.MPRegen) {
                const regenPercent = parseFloat(skill.meta.MPRegen);
                const value = Math.floor(this.mmp * regenPercent / 100);
                if (value !== 0) {
                    this.gainMp(value);
                }
            }
            
            // TP Regeneration
            if (skill.meta.TPRegen) {
                const regenValue = parseFloat(skill.meta.TPRegen);
                if (regenValue !== 0) {
                    this.gainTp(regenValue);
                }
            }
        }
    };

    //=============================================================================
    // Game_Battler - On Attack Effects
    //=============================================================================

    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.call(this, target);
        
        if (this.isAttack() || this.isSkill()) {
            this.applyPassiveOnAttackEffects(target);
        }
    };

    Game_Action.prototype.applyPassiveOnAttackEffects = function(target) {
        const subject = this.subject();
        const passives = subject.passiveSkills();
        
        for (const skill of passives) {
            // Apply state to target
            if (skill.meta.OnAttackState) {
                const params = skill.meta.OnAttackState.split(',');
                const stateId = parseInt(params[0]);
                const chance = params[1] ? parseFloat(params[1]) : 100;
                
                if (Math.random() * 100 < chance) {
                    target.addState(stateId);
                }
            }
            
            // Apply state to self (for stacking buffs)
            if (skill.meta.OnAttackSelfState) {
                const stateId = parseInt(skill.meta.OnAttackSelfState);
                subject.addStackableState(stateId);
            }
        }
    };

    //=============================================================================
    // State Stacking System
    //=============================================================================

    Game_BattlerBase.prototype.addStackableState = function(stateId) {
        const state = $dataStates[stateId];
        if (!state) return;
        
        if (!this._stateStacks[stateId]) {
            this._stateStacks[stateId] = 0;
        }
        
        const maxStack = state.meta.StackMax ? parseInt(state.meta.StackMax) : 1;
        
        if (this._stateStacks[stateId] < maxStack) {
            this._stateStacks[stateId]++;
        }
        
        // Reset the state's turn counter
        this.addState(stateId);
    };

    Game_BattlerBase.prototype.getStateStacks = function(stateId) {
        return this._stateStacks[stateId] || 1;
    };

    const _Game_BattlerBase_eraseState = Game_BattlerBase.prototype.eraseState;
    Game_BattlerBase.prototype.eraseState = function(stateId) {
        _Game_BattlerBase_eraseState.call(this, stateId);
        if (this._stateStacks[stateId]) {
            delete this._stateStacks[stateId];
        }
    };

    // Modify trait calculations to account for stacks
    const _Game_BattlerBase_paramRate = Game_BattlerBase.prototype.paramRate;
    Game_BattlerBase.prototype.paramRate = function(paramId) {
        let rate = _Game_BattlerBase_paramRate.call(this, paramId);
        
        for (const state of this.states()) {
            if (state.meta.StackMax && this._stateStacks[state.id]) {
                const stacks = this._stateStacks[state.id];
                const baseRate = this.getStateParamRate(state, paramId);
                // Apply additional stacks (first stack already counted in base)
                if (baseRate !== 1) {
                    const bonusPerStack = baseRate - 1;
                    rate += bonusPerStack * (stacks - 1);
                }
            }
        }
        
        return rate;
    };

    Game_BattlerBase.prototype.getStateParamRate = function(state, paramId) {
        let rate = 1;
        for (const trait of state.traits) {
            if (trait.code === 21 && trait.dataId === paramId) {
                rate *= trait.value;
            }
        }
        return rate;
    };

    //=============================================================================
    // Battle Start - Apply Passive States
    //=============================================================================

    const _Game_Battler_onBattleStart = Game_Battler.prototype.onBattleStart;
    Game_Battler.prototype.onBattleStart = function(advantageous) {
        _Game_Battler_onBattleStart.call(this, advantageous);
        this.applyPassiveStates();
    };

    Game_Battler.prototype.applyPassiveStates = function() {
        const passives = this.passiveSkills();
        this._stateStacks = {}; // Reset stacks at battle start
        
        for (const skill of passives) {
            // Apply passive state
            if (skill.meta.PassiveState) {
                const stateId = parseInt(skill.meta.PassiveState);
                this.addState(stateId);
            }
            
            // Apply battle start state
            if (skill.meta.BattleStartState) {
                const stateId = parseInt(skill.meta.BattleStartState);
                this.addState(stateId);
            }
        }
    };

    //=============================================================================
    // Scene_Skill - Hide Passive Skills from Menu
    //=============================================================================

    const _Window_SkillList_includes = Window_SkillList.prototype.includes;
    Window_SkillList.prototype.includes = function(item) {
        if (item && item.meta.Passive) {
            return false; // Hide passive skills from use menu
        }
        return _Window_SkillList_includes.call(this, item);
    };

})();
