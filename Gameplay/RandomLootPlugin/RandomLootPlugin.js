//=============================================================================
// Random Loot Plugin
// RandomLootPlugin.js
// version 1.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Adds random treasure and weapon drops to events
 * @author Alexamdros Panagiotakopoulos
 * @date 07-02-2026
 * @url alexandrospanag.github.io 
 * @version 1.0
 * 
 * @help RandomLootPlugin.js
 * 
 * This plugin allows you to add random loot to events using note tags.
 * 
 * EVENT NOTE TAGS:
 * <randomtreasurecoin:MIN-MAX>
 *   - Gives the player a random amount of gold between MIN and MAX
 *   - Example: <randomtreasurecoin:1-100>
 * 
 * <randomweapondrop:MIN-MAX>
 *   - Gives the player a random weapon with ID between MIN and MAX
 *   - Example: <randomweapondrop:1-5>
 * 
 * You can use both tags on the same event!
 * 
 * USAGE:
 * 1. Create an event (like a treasure chest)
 * 2. In the event's note field, add the desired tag(s)
 * 3. The plugin will automatically process the loot when the event runs
 * 
 * The randomization uses cryptographically secure random numbers for
 * true randomness.
 */

(() => {
    'use strict';

    // Store original Game_Interpreter methods
    const _Game_Interpreter_setup = Game_Interpreter.prototype.setup;
    
    // Override the setup method to process event notes
    Game_Interpreter.prototype.setup = function(list, eventId) {
        _Game_Interpreter_setup.call(this, list, eventId);
        
        // Only process if this is an event (not common event or battle)
        if (eventId > 0 && this._eventId > 0) {
            this.processRandomLoot();
        }
    };
    
    // New method to process random loot from event notes
    Game_Interpreter.prototype.processRandomLoot = function() {
        const event = $gameMap.event(this._eventId);
        if (!event) return;
        
        const note = event.event().note || '';
        
        // Process random treasure coin
        const coinMatch = note.match(/<randomtreasurecoin:(\d+)-(\d+)>/i);
        if (coinMatch) {
            const min = parseInt(coinMatch[1]);
            const max = parseInt(coinMatch[2]);
            const amount = this.trueRandomInt(min, max);
            $gameParty.gainGold(amount);
            
            // Show message
            const goldName = TextManager.currencyUnit;
            $gameMessage.add(`Found \\C[14]${amount} ${goldName}\\C[0]!`);
        }
        
        // Process random weapon drop
        const weaponMatch = note.match(/<randomweapondrop:(\d+)-(\d+)>/i);
        if (weaponMatch) {
            const min = parseInt(weaponMatch[1]);
            const max = parseInt(weaponMatch[2]);
            const weaponId = this.trueRandomInt(min, max);
            
            // Validate weapon exists
            if ($dataWeapons[weaponId]) {
                $gameParty.gainItem($dataWeapons[weaponId], 1);
                
                // Show message
                const weaponName = $dataWeapons[weaponId].name;
                const iconIndex = $dataWeapons[weaponId].iconIndex;
                $gameMessage.add(`Found \\I[${iconIndex}]\\C[2]${weaponName}\\C[0]!`);
            }
        }
    };
    
    // True random number generator using crypto API for maximum randomness
    Game_Interpreter.prototype.trueRandomInt = function(min, max) {
        // Ensure min and max are integers
        min = Math.floor(min);
        max = Math.floor(max);
        
        // If min equals max, return that value
        if (min === max) return min;
        
        // Ensure min is less than max
        if (min > max) {
            const temp = min;
            min = max;
            max = temp;
        }
        
        const range = max - min + 1;
        
        // Use crypto.getRandomValues for true randomness
        // This is cryptographically secure and much better than Math.random()
        const randomBuffer = new Uint32Array(1);
        crypto.getRandomValues(randomBuffer);
        
        // Convert to a number in our range
        const randomValue = randomBuffer[0] / (0xFFFFFFFF + 1); // Normalize to 0-1
        return Math.floor(randomValue * range) + min;
    };

})();
