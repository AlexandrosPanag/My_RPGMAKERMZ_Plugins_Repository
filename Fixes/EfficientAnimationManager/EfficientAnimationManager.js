//=============================================================================
// EfficientAnimationManager.js
// Version: 1.0.1
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Automatically doubles sprite size for events with specific names
 * @author Alexandros Panagiotakopoulos
 * @url https://alexandrospanag.github.io
 * @date 22/10/2025
 * 
 * @help EfficientAnimationManager.js
 * 
 * This plugin manages multiple animated objects (like flames, water, crystals)
 * efficiently using a single centralized update loop instead of parallel events.
 * 
 * ============================================================================
 * Setup Instructions:
 * ============================================================================
 * 
 * 1. Create your animated events with NO parallel process
 * 2. In the event's Note field, add one of these tags:
 *    <animate:speed>        - Example: <animate:15>
 *    <animate:speed:offset> - Example: <animate:15:5>
 * 
 * The speed value controls animation speed (lower = faster, default is 10)
 * The offset value staggers the animation start (optional, creates variety)
 * 
 * 3. Set the event's image to your animated graphic
 * 4. The plugin will automatically animate all frames horizontally
 * 
 * ============================================================================
 * Examples:
 * ============================================================================
 * 
 * <animate:10>      - Fast animation, all objects sync
 * <animate:15>      - Medium animation
 * <animate:20:10>   - Slow animation with offset
 * <animate:12:5>    - Medium-fast with slight offset
 * 
 * Perfect for: flames, torches, water, waterfalls, crystals, magical effects,
 * floating objects, pulsing lights, and any repeating animation!
 * 
 * ============================================================================
 * Plugin Commands:
 * ============================================================================
 * 
 * None needed - automatic!
 * 
 * @param globalSpeed
 * @text Global Speed Multiplier
 * @type number
 * @decimals 2
 * @min 0.1
 * @max 5.0
 * @default 1.0
 * @desc Multiplier for all animation speeds (1.0 = normal, 0.5 = half speed, 2.0 = double speed)
 * 
 * @param enableLighting
 * @text Enable Light Effects
 * @type boolean
 * @default false
 * @desc If true, flames will pulse opacity slightly (requires no lighting plugin conflicts)
 */

(() => {
    const pluginName = "EfficientAnimationManager";
    const parameters = PluginManager.parameters(pluginName);
    const globalSpeed = parseFloat(parameters['globalSpeed'] || 1.0);
    const enableLighting = parameters['enableLighting'] === 'true';

    //=========================================================================
    // Game_Event - Parse animation tags
    //=========================================================================
    
    const _Game_Event_initialize = Game_Event.prototype.initialize;
    Game_Event.prototype.initialize = function(mapId, eventId) {
        _Game_Event_initialize.call(this, mapId, eventId);
        this.parseAnimationTag();
    };

    Game_Event.prototype.parseAnimationTag = function() {
        this._isAnimated = false;
        this._animSpeed = 10;
        this._animOffset = 0;
        this._animFrame = 0;
        this._animCounter = 0;
        
        const note = this.event().note || '';
        const match = note.match(/<animate:(\d+)(?::(\d+))?>/i);
        
        if (match) {
            this._isAnimated = true;
            this._animSpeed = parseInt(match[1]) / globalSpeed;
            this._animOffset = match[2] ? parseInt(match[2]) : 0;
            this._animCounter = this._animOffset; // Stagger the start
        }
    };

    Game_Event.prototype.isAnimated = function() {
        return this._isAnimated;
    };

    Game_Event.prototype.updateAnimation = function() {
        if (!this._isAnimated) return;
        
        this._animCounter++;
        
        if (this._animCounter >= this._animSpeed) {
            this._animCounter = 0;
            
            // Get the character graphic info
            const characterName = this._characterName;
            
            if (characterName) {
                // Calculate max frames based on bitmap width
                const bitmap = ImageManager.loadCharacter(characterName);
                if (bitmap && bitmap.isReady()) {
                    const maxFrames = 3; // Standard RPG Maker frame count
                    
                    this._animFrame = (this._animFrame + 1) % maxFrames;
                    this._pattern = this._animFrame;
                }
            }
        }
        
        // Optional: Pulse effect for lighting
        if (enableLighting) {
            const pulse = Math.sin(this._animCounter / this._animSpeed * Math.PI * 2);
            this._opacity = 255 - (pulse * 20); // Subtle 20-point opacity variation
        }
    };

    //=========================================================================
    // Game_Map - Centralized update for all animated objects
    //=========================================================================
    
    const _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function(sceneActive) {
        _Game_Map_update.call(this, sceneActive);
        this.updateAnimatedObjects();
    };

    Game_Map.prototype.updateAnimatedObjects = function() {
        // Single loop through all events - MUCH more efficient than parallel events
        for (const event of this.events()) {
            if (event && event.isAnimated()) {
                event.updateAnimation();
            }
        }
    };

    //=========================================================================
    // Sprite_Character - Apply visual updates (ONLY for animated events)
    //=========================================================================
    
    const _Sprite_Character_updateCharacterFrame = Sprite_Character.prototype.updateCharacterFrame;
    Sprite_Character.prototype.updateCharacterFrame = function() {
        // CRITICAL FIX: Only override frame updates for events with <animate> tag
        if (this._character instanceof Game_Event && this._character.isAnimated()) {
            // Custom animation frame update for tagged events only
            this.updateAnimatedCharacterFrame();
            this.updateAnimatedVisuals();
        } else {
            // Normal frame update for all other characters/events
            _Sprite_Character_updateCharacterFrame.call(this);
        }
    };

    Sprite_Character.prototype.updateAnimatedCharacterFrame = function() {
        const pw = this.patternWidth();
        const ph = this.patternHeight();
        const sx = (this.characterBlockX() + this._character._pattern) * pw;
        const sy = (this.characterBlockY() + this._character.direction() / 2 - 1) * ph;
        this.setFrame(sx, sy, pw, ph);
    };

    Sprite_Character.prototype.updateAnimatedVisuals = function() {
        if (enableLighting && this._character._opacity !== undefined) {
            this.opacity = this._character._opacity;
        }
    };

})();
