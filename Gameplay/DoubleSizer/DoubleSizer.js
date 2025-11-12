//=============================================================================
// DoubleSizer.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Automatically doubles sprite size for events with specific names
 * @author Alexandros Panagiotakopoulos
 * @url https://alexandrospanag.github.io
 * @date 20/10/2025
 * v1.0.0
 *
 * @help DoubleSizer.js
 *
 * This plugin automatically doubles the size of event sprites based on their
 * event name. Simply name your event with the trigger word and it will
 * automatically be doubled in size - no parallel processes or plugin commands
 * needed!
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
    };

    // Override Sprite_Character update scale method
    const _Sprite_Character_updateScale = Sprite_Character.prototype.updateScale || function() {};
    Sprite_Character.prototype.updateScale = function() {
        _Sprite_Character_updateScale.call(this);
        
        if (this._character instanceof Game_Event) {
            if (this._character._doubleSizerEnabled) {
                this.scale.x = scaleFactor;
                this.scale.y = scaleFactor;
            } else {
                this.scale.x = 1.0;
                this.scale.y = 1.0;
            }
        }
    };

    // Call updateScale in the update loop
    const _Sprite_Character_update = Sprite_Character.prototype.update;
    Sprite_Character.prototype.update = function() {
        _Sprite_Character_update.call(this);
        this.updateScale();
    };

    // Ensure scale is applied when sprite is created
    const _Sprite_Character_setCharacter = Sprite_Character.prototype.setCharacter;
    Sprite_Character.prototype.setCharacter = function(character) {
        _Sprite_Character_setCharacter.call(this, character);
        if (character instanceof Game_Event && character._doubleSizerEnabled) {
            this.updateScale();
        }
    };

})();
