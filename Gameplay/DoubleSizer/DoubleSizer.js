//=============================================================================
// DoubleSizer.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Automatically doubles sprite size for events with specific names
 * @author Alexandros Panagiotakopoulos
 * @url https://alexandrospanag.github.io
 * @date 15/11/2025
 * v1.2.0
 *
 * @help DoubleSizer.js
 *
 * This plugin automatically doubles the size of event sprites based on their
 * event name. Simply name your event with the trigger word and it will
 * automatically be doubled in size - no parallel processes or plugin commands
 * needed!
 *
 * IMPORTANT: This plugin should be placed ABOVE EventConnect in the plugin list
 * to ensure proper compatibility.
 *
 * ============================================================================
 * How to Use
 * ============================================================================
 *
 * 1. Create an event in your map
 * 2. Name it with the trigger word (default: "DoubleEvent")
 *    - Examples: "DoubleEvent", "DoubleEvent_Boat", "MyShip_DoubleEvent"
 * 3. The sprite will automatically be doubled in size!
 *
 * The event name just needs to CONTAIN the trigger word anywhere in it.
 * You can add prefixes or suffixes for organization.
 *
 * ============================================================================
 * Plugin Parameters
 * ============================================================================
 *
 * Trigger Word: The word to look for in event names (default: "DoubleEvent")
 * Scale Factor: How much to multiply the sprite size (default: 2.0)
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *   - Free for commercial and non-commercial use with proper attribution
 *   - Modify as needed for your project
 *   - Include copyright notice when redistributing
 *   - See LICENSE.md for full terms
 *
 * @param triggerWord
 * @text Trigger Word
 * @type string
 * @default DoubleEvent
 * @desc Events containing this word in their name will be doubled.
 *
 * @param scaleFactor
 * @text Scale Factor
 * @type number
 * @decimals 1
 * @min 0.1
 * @max 10.0
 * @default 2.0
 * @desc The size multiplier for doubled events (2.0 = double size).
 * 
 * @command enable
 * @text Enable Double Size
 * @desc Manually enable double size for the current event
 * 
 * @command disable
 * @text Disable Double Size
 * @desc Manually disable double size for the current event
 */

(() => {
    const pluginName = "DoubleSizer";
    const parameters = PluginManager.parameters(pluginName);
    const triggerWord = String(parameters['triggerWord'] || 'DoubleEvent');
    const scaleFactor = Number(parameters['scaleFactor'] || 2.0);

    // Check if event should be doubled based on its name
    Game_Event.prototype.isDoubleSizerEvent = function() {
        if (!this.event()) return false;
        const eventName = this.event().name || "";
        return eventName.includes(triggerWord);
    };

    // Initialize and check event name
    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.call(this, mapId, eventId);
        this._doubleSizerEnabled = this.isDoubleSizerEvent();
        this._doubleSizerScale = this._doubleSizerEnabled ? scaleFactor : 1.0;
    };

    // Store original scale methods
    const _Sprite_Character_initialize = Sprite_Character.prototype.initialize;
    Sprite_Character.prototype.initialize = function(character) {
        _Sprite_Character_initialize.call(this, character);
        this._lastDoubleSizerState = false;
    };

    // Apply scale in update to ensure it persists
    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.call(this);
        
        if (this._character instanceof Game_Event) {
            const shouldScale = this._character._doubleSizerEnabled;
            
            // Only update scale if state changed or scale is wrong
            if (shouldScale) {
                const targetScale = this._character._doubleSizerScale;
                if (this.scale.x !== targetScale || this.scale.y !== targetScale) {
                    this.scale.x = targetScale;
                    this.scale.y = targetScale;
                }
                this._lastDoubleSizerState = true;
            } else if (this._lastDoubleSizerState) {
                // Reset scale if it was previously scaled
                this.scale.x = 1.0;
                this.scale.y = 1.0;
                this._lastDoubleSizerState = false;
            }
        }
    };

    // Ensure scale persists through character bitmap changes
    const _Sprite_Character_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
    Sprite_Character.prototype.setCharacterBitmap = function() {
        _Sprite_Character_setCharacterBitmap.call(this);
        
        if (this._character instanceof Game_Event && this._character._doubleSizerEnabled) {
            this.scale.x = this._character._doubleSizerScale;
            this.scale.y = this._character._doubleSizerScale;
        }
    };

    // Override updateHalfBodySprites to maintain scale
    const _Sprite_Character_updateHalfBodySprites = Sprite_Character.prototype.updateHalfBodySprites;
    Sprite_Character.prototype.updateHalfBodySprites = function() {
        _Sprite_Character_updateHalfBodySprites.call(this);
        
        if (this._character instanceof Game_Event && this._character._doubleSizerEnabled) {
            // Reapply scale after half body sprite update
            this.scale.x = this._character._doubleSizerScale;
            this.scale.y = this._character._doubleSizerScale;
        }
    };


    // Plugin Commands
    PluginManager.registerCommand(pluginName, 'enable', args => {
        if ($gameMap && $gameMap._interpreter && $gameMap._interpreter._eventId) {
            const eventId = $gameMap._interpreter._eventId;
            const event = $gameMap.event(eventId);
            if (event) {
                event._doubleSizerEnabled = true;
                event._doubleSizerScale = scaleFactor;
            }
        }
    });

    PluginManager.registerCommand(pluginName, 'disable', args => {
        if ($gameMap && $gameMap._interpreter && $gameMap._interpreter._eventId) {
            const eventId = $gameMap._interpreter._eventId;
            const event = $gameMap.event(eventId);
            if (event) {
                event._doubleSizerEnabled = false;
                event._doubleSizerScale = 1.0;
            }
        }
    });

})();
