/**
 * Copyright (c) 2025 Alexandros Panagiotakopoulos
 * 
 * This work is licensed under the Creative Commons Attribution-NoDerivatives 4.0 
 * International License. To view a copy of this license, visit 
 * http://creativecommons.org/licenses/by-nd/4.0/
 */

//=============================================================================
// MaxPartyMembers.js
// Version: 2.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc MaxPartyMembers v2.0.1 — Enforces max active party (battle + map followers)
 * @author Alexandros Panagiotakopoulos
 * @version 2.0.1
 * @license CC-BY-ND-4.0
 * @description Nuclear option - forcefully limits battleMembers to max regardless of _actors array
 *
 * @param maxActiveMembers
 * @text Maximum Active Party Members
 * @type number
 * @min 1
 * @max 8
 * @default 4
 *
 * @param enableDebugConsole
 * @text Enable Debug Console
 * @type boolean
 * @default true
 *
 * @help
 * ============================================================================
 * LOAD THIS PLUGIN LAST IN YOUR PLUGIN LIST!
 * ============================================================================
 * This plugin FORCEFULLY overrides battleMembers() to return only the first
 * maxActiveMembers, regardless of what CustomMainMenu or any other plugin does.
 * ============================================================================
Copyright © Alexandros Panagiotakopoulos. All Rights Reserved.
Free to use with attribution required.

Terms of Use:
- Free for commercial and non-commercial use with proper attribution
- Modify as needed for your project
- Include copyright notice when redistributing
- See LICENSE.md for full terms
 */

(() => {
    'use strict';

    const script = document.currentScript;
    const parameters = PluginManager.parameters(script.src.split('/').pop().replace(/\.js$/, ''));
    
    const maxActiveMembers = parseInt(parameters['maxActiveMembers']) || 4;
    const enableDebugConsole = parameters['enableDebugConsole'] === 'true';

    const debugLog = (msg) => {
        if (enableDebugConsole) console.log(`[MaxPartyMembers] ${msg}`);
    };

    debugLog(`🔴 NUCLEAR MODE ACTIVATED - Max: ${maxActiveMembers}`);

    //-----------------------------------------------------------------------------
    // NUCLEAR OPTION: Override battleMembers to FORCE the limit
    //-----------------------------------------------------------------------------
    Game_Party.prototype.battleMembers = function() {
        // Get first maxActiveMembers from _actors array
        const activeIds = (this._actors || []).slice(0, maxActiveMembers);
        const result = activeIds.map(id => $gameActors.actor(id)).filter(Boolean);
        
        if (enableDebugConsole && result.length !== maxActiveMembers && this._actors.length >= maxActiveMembers) {
            debugLog(`⚠️ battleMembers() returning ${result.length} members (expected ${maxActiveMembers})`);
            debugLog(`⚠️ Full _actors array: [${this._actors.join(', ')}]`);
        }
        
        return result;
    };

    //-----------------------------------------------------------------------------
    // Override maxBattleMembers to return our setting
    //-----------------------------------------------------------------------------
    Game_Party.prototype.maxBattleMembers = function() {
        return maxActiveMembers;
    };

    //-----------------------------------------------------------------------------
    // Initialize reserve members array
    //-----------------------------------------------------------------------------
    const _Game_Party_initialize = Game_Party.prototype.initialize;
    Game_Party.prototype.initialize = function() {
        _Game_Party_initialize.call(this);
        this._reserveMembers = [];
        debugLog('Initialized');
    };

    //-----------------------------------------------------------------------------
    // Helper methods for reserves
    //-----------------------------------------------------------------------------
    Game_Party.prototype.getReserveMembers = function() {
        if (!this._reserveMembers) this._reserveMembers = [];
        return this._reserveMembers.map(id => $dataActors[id]).filter(Boolean);
    };

    Game_Party.prototype.getActiveMembers = function() {
        return this.battleMembers(); // Use our forced battleMembers
    };

    //-----------------------------------------------------------------------------
    // allMembers returns everyone for menu display
    //-----------------------------------------------------------------------------
    Game_Party.prototype.allMembers = function() {
        if (!this._reserveMembers) this._reserveMembers = [];
        
        // Combine active and reserve
        const combinedIds = [...(this._actors || []), ...this._reserveMembers];
        
        // Return unique actors
        const seenIds = new Set();
        return combinedIds.map(id => {
            if ($gameActors.actor(id) && !seenIds.has(id)) {
                seenIds.add(id);
                return $gameActors.actor(id);
            }
            return null;
        }).filter(Boolean);
    };

    //-----------------------------------------------------------------------------
    // members returns everyone for menu
    //-----------------------------------------------------------------------------
    Game_Party.prototype.members = function() {
        return this.allMembers();
    };

    //-----------------------------------------------------------------------------
    // Hook to check if an actor is in battle party
    //-----------------------------------------------------------------------------
    const _Game_Actor_isBattleMember = Game_Actor.prototype.isBattleMember;
    Game_Actor.prototype.isBattleMember = function() {
        // Check if this actor is in the first maxActiveMembers of the party
        if (!$gameParty) return false;
        const battleIds = ($gameParty._actors || []).slice(0, maxActiveMembers);
        return battleIds.includes(this._actorId);
    };

    //-----------------------------------------------------------------------------
    // Auto-cleanup on refresh
    //-----------------------------------------------------------------------------
    const _Game_Party_refresh = Game_Party.prototype.refresh;
    Game_Party.prototype.refresh = function() {
        if (!this._reserveMembers) this._reserveMembers = [];
        
        // Move excess actors to reserves
        if (this._actors && this._actors.length > maxActiveMembers) {
            const excess = this._actors.splice(maxActiveMembers);
            for (const id of excess) {
                if (!this._reserveMembers.includes(id)) {
                    this._reserveMembers.push(id);
                    debugLog(`Moved excess actor ${id} to reserves`);
                }
            }
        }
        
        // Remove duplicates
        if (this._reserveMembers) {
            this._reserveMembers = this._reserveMembers.filter(id => !this._actors.includes(id));
        }
        
        _Game_Party_refresh.call(this);
    };

    //-----------------------------------------------------------------------------
    // FIX: Override followers to only show battle members
    //-----------------------------------------------------------------------------
    Game_Followers.prototype.visibleFollowers = function() {
        // Only show followers for battle members (first maxActiveMembers)
        const battleMemberCount = Math.min($gameParty.battleMembers().length, maxActiveMembers);
        return this._data.slice(0, battleMemberCount);
    };

    const _Game_Followers_initialize = Game_Followers.prototype.initialize;
    Game_Followers.prototype.initialize = function() {
        _Game_Followers_initialize.call(this);
        // Recreate followers array to match max battle members
        this._data = [];
        for (let i = 0; i < maxActiveMembers; i++) {
            this._data.push(new Game_Follower(i));
        }
    };


    const _Game_Followers_refresh = Game_Followers.prototype.refresh;
    Game_Followers.prototype.refresh = function() {
        const battleMembers = $gameParty.battleMembers();
        
        // Manually set each follower's appearance based on battle members
        this._data.forEach((follower, index) => {
            const actor = battleMembers[index + 1]; // +1 to skip leader
            if (actor) {
                follower._characterName = actor.characterName();
                follower._characterIndex = actor.characterIndex();
            } else {
                follower._characterName = '';
                follower._characterIndex = 0;
            }
        });
        
        // Don't call original - it uses allMembers() which we don't want
        // _Game_Followers_refresh.call(this);
    };

    //-----------------------------------------------------------------------------
    // Debug commands
    //-----------------------------------------------------------------------------
    if (enableDebugConsole) {
        window.MaxPartyDebug = {
            show: () => {
                console.log('=== MAX PARTY DEBUG ===');
                console.log('_actors:', $gameParty._actors);
                console.log('_reserveMembers:', $gameParty._reserveMembers);
                console.log('battleMembers():', $gameParty.battleMembers().map(a => `${a.actorId()}:${a.name()}`));
                console.log('allMembers():', $gameParty.allMembers().map(a => `${a.actorId()}:${a.name()}`));
                console.log('Max allowed:', maxActiveMembers);
                
                // Check each actor's battle status
                console.log('\nPer-Actor Battle Status:');
                $gameParty.allMembers().forEach(a => {
                    console.log(`  ${a.name()} (ID ${a.actorId()}): isBattleMember = ${a.isBattleMember()}`);
                });
                console.log('\nFollowers on map:');
                if ($gamePlayer && $gamePlayer.followers()) {
                    const followers = $gamePlayer.followers()._data;
                    console.log(`  Total follower slots: ${followers.length}`);
                    console.log(`  Visible followers: ${$gamePlayer.followers().visibleFollowers().length}`);
                    followers.forEach((f, i) => {
                        const actor = $gameParty.battleMembers()[i + 1];
                        console.log(`    Follower ${i}: ${actor ? actor.name() : 'NONE'}`);
                    });
                }
            },
            fix: () => {
                console.log('Emergency fix...');
                $gameParty.refresh();
                MaxPartyDebug.show();
            }
        };
        debugLog('Commands: MaxPartyDebug.show(), MaxPartyDebug.fix()');
    }

    debugLog('Plugin loaded - battleMembers() FORCEFULLY limited');

})();
