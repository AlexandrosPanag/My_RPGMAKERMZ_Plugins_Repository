//=============================================================================
// FixTexturebleeding.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.0.3] Adds smoke effects when player and party members dash
 * @author Alexandros Panagiotakopoulos
 * @url alexandrospanag.github.io
* @version 1.0.0
 *
 * @help This plugin fixes the line artifacts that appear when zooming
 * or scaling sprites by adjusting PIXI rendering settings and texture wrapping.
 * Place this plugin at the TOP of your plugin list.
 */

(() => {
    'use strict';
    
    // Force nearest neighbor scaling
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
    
    // Ensure pixel-perfect rendering
    PIXI.settings.ROUND_PIXELS = true;
    
    // Reduce texture padding issues
    PIXI.settings.SPRITE_MAX_TEXTURES = Math.min(
        PIXI.settings.SPRITE_MAX_TEXTURES || 16,
        16
    );
    
    // Hook into bitmap loading to fix texture wrapping
    const _Bitmap_initialize = Bitmap.prototype.initialize;
    Bitmap.prototype.initialize = function(width, height) {
        _Bitmap_initialize.call(this, width, height);
        if (this._canvas) {
            this._context.imageSmoothingEnabled = false;
        }
    };
    
    // Fix texture wrapping when bitmap is loaded
    const _Bitmap__onLoad = Bitmap.prototype._onLoad;
    Bitmap.prototype._onLoad = function() {
        _Bitmap__onLoad.call(this);
        if (this._baseTexture) {
            this._baseTexture.wrapMode = PIXI.WRAP_MODES.CLAMP;
            this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
        }
    };
    
    // Additional fix for sprite rendering
    const _Sprite_Sprite_Character_updateBitmap = Sprite_Character.prototype.updateBitmap;
    Sprite_Character.prototype.updateBitmap = function() {
        _Sprite_Sprite_Character_updateBitmap.call(this);
        if (this.bitmap && this.bitmap._baseTexture) {
            this.bitmap._baseTexture.wrapMode = PIXI.WRAP_MODES.CLAMP;
        }
    };
    
    console.log('Advanced texture bleeding fix applied');
})();
