//=============================================================================
// TripleSizer.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Automatically triples sprite size for events with specific names
 * @author Alexandros Panagiotakopoulos
 * @url https://alexandrospanag.github.io
 * @date 30/10/2025
 * v1.0.0
 *
 * @help TripleSizer.js
 *
 * This plugin automatically triples the size of event sprites based on their
 * event name. Simply name your event with the trigger word and it will
 * automatically be tripled in size - no parallel processes or plugin commands
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
 * 2. Name it with the trigger word (default: "TripleEvent")
 *    - Examples: "TripleEvent", "TripleEvent_Boss", "MyGiant_TripleEvent"
 * 3. The sprite will automatically be tripled in size!
 *
 * The event name just needs to CONTAIN the trigger word anywhere in it.
 * You can add prefixes or suffixes for organization.
 *
 * ============================================================================
 * Plugin Parameters
 * ============================================================================
 *
 * Trigger Word: The word to look for in event names (default: "TripleEvent")
 * Scale Factor: How much to multiply the sprite size (default: 3.0)
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * Free for commercial and non-commercial use.
 *
 * @param triggerWord
 * @text Trigger Word
 * @type string
 * @default TripleEvent
 * @desc Events containing this word in their name will be tripled.
 *
 * @param scaleFactor
 * @text Scale Factor
 * @type number
 * @decimals 1
 * @min 0.1
 * @max 10.0
 * @default 3.0
 * @desc The size multiplier for tripled events (3.0 = triple size).
 */

(() => {
    const pluginName = "TripleSizer";
    const parameters = PluginManager.parameters(pluginName);
    const triggerWord = String(parameters['triggerWord'] || 'TripleEvent');
    const scaleFactor = Number(parameters['scaleFactor'] || 3.0);

    // Check if event should be tripled based on its name
    Game_Event.prototype.isTripleSizerEvent = function() {
        if (!this.event()) return false;
        const eventName = this.event().name || "";
        return eventName.includes(triggerWord);
    };

    // Initialize and check event name
    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.call(this, mapId, eventId);
        
        // Don't override DoubleSizer if it's already set
        if (!this._doubleSizerEnabled) {
            this._tripleSizerEnabled = this.isTripleSizerEvent();
            this._tripleSizerScale = this._tripleSizerEnabled ? scaleFactor : 1.0;
        }
    };

    // Store original scale methods
    const _Sprite_Character_initialize = Sprite_Character.prototype.initialize;
    Sprite_Character.prototype.initialize = function(character) {
        _Sprite_Character_initialize.call(this, character);
        if (!this._lastDoubleSizerState) {
            this._lastTripleSizerState = false;
        }
    };

    // Apply scale in update to ensure it persists
    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.call(this);
        
        if (this._character instanceof Game_Event) {
            // Skip if DoubleSizer is handling this event
            if (this._character._doubleSizerEnabled) {
                return;
            }
            
            const shouldScale = this._character._tripleSizerEnabled;
            
            // Only update scale if state changed or scale is wrong
            if (shouldScale) {
                const targetScale = this._character._tripleSizerScale;
                if (this.scale.x !== targetScale || this.scale.y !== targetScale) {
                    this.scale.x = targetScale;
                    this.scale.y = targetScale;
                }
                this._lastTripleSizerState = true;
            } else if (this._lastTripleSizerState) {
                // Reset scale if it was previously scaled
                this.scale.x = 1.0;
                this.scale.y = 1.0;
                this._lastTripleSizerState = false;
            }
        }
    };

    // Ensure scale persists through character bitmap changes
    const _Sprite_Character_setCharacterBitmap = Sprite_Character.prototype.setCharacterBitmap;
    Sprite_Character.prototype.setCharacterBitmap = function() {
        _Sprite_Character_setCharacterBitmap.call(this);
        
        if (this._character instanceof Game_Event && 
            this._character._tripleSizerEnabled && 
            !this._character._doubleSizerEnabled) {
            this.scale.x = this._character._tripleSizerScale;
            this.scale.y = this._character._tripleSizerScale;
        }
    };

    // Override updateHalfBodySprites to maintain scale
    const _Sprite_Character_updateHalfBodySprites = Sprite_Character.prototype.updateHalfBodySprites;
    Sprite_Character.prototype.updateHalfBodySprites = function() {
        _Sprite_Character_updateHalfBodySprites.call(this);
        
        if (this._character instanceof Game_Event && 
            this._character._tripleSizerEnabled && 
            !this._character._doubleSizerEnabled) {
            // Reapply scale after half body sprite update
            this.scale.x = this._character._tripleSizerScale;
            this.scale.y = this._character._tripleSizerScale;
        }
    };

})();
