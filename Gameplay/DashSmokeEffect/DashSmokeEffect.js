//=============================================================================
// DashSmokeEffect.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.0.1] Adds smoke effects when player and party members dash
 * @author Alexandros Panagiotakopoulos
 * @url alexandrospanag.github.io
 *
 * @param smokeDuration
 * @text Smoke Duration
 * @desc How long the smoke effect lasts (frames)
 * @default 30
 * @type number
 *
 * @param smokeInterval
 * @text Smoke Interval
 * @desc Frames between smoke puffs while dashing
 * @default 8
 * @type number
 *
 * @param smokeScale
 * @text Smoke Scale
 * @desc Scale of the smoke sprite (1.0 = normal size)
 * @default 1.5
 * @type number
 * @decimals 1
 *
 * @param smokeOpacity
 * @text Starting Opacity
 * @desc Starting opacity of smoke (0-255)
 * @default 200
 * @type number
 *
 * @help DashSmokeEffect.js
 *
 * This plugin adds a smoke effect when the player or party members dash.
 * The effect is inspired by Sonic's running animation.
 *
 * By default, it uses an icon from the IconSet. You can change which icon
 * or use a custom image file from img/system/.
 *
 * No plugin commands needed - it works automatically when dashing!
 */

(() => {
    const pluginName = "DashSmokeEffect";
    const parameters = PluginManager.parameters(pluginName);
    
    const smokeDuration = Number(parameters['smokeDuration'] || 30);
    const smokeInterval = Number(parameters['smokeInterval'] || 8);
    const smokeScale = Number(parameters['smokeScale'] || 1.5);
    const smokeOpacity = Number(parameters['smokeOpacity'] || 200);

    //-----------------------------------------------------------------------------
    // Sprite_DashSmoke
    //-----------------------------------------------------------------------------

    class Sprite_DashSmoke extends Sprite {
        initialize(x, y) {
            super.initialize();
            this._duration = smokeDuration;
            this._startX = x;
            this._startY = y;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            this.x = x;
            this.y = y;
            this.z = 1;
            this.createBitmap();
            this.setupAnimation();
        }

        createBitmap() {
            const pw = 32;
            const ph = 32;
            this.bitmap = new Bitmap(pw, ph);
            this.drawSmokeCircle(pw, ph);
        }

        drawSmokeCircle(pw, ph) {
            const ctx = this.bitmap.context;
            const centerX = pw / 2;
            const centerY = ph / 2;
            const radius = pw / 3;
            
            // Create gradient for softer smoke
            const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
            gradient.addColorStop(0.5, 'rgba(220, 220, 220, 0.6)');
            gradient.addColorStop(1, 'rgba(200, 200, 200, 0)');
            
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
            
            this.bitmap._baseTexture.update();
        }

        setupAnimation() {
            this.scale.x = smokeScale;
            this.scale.y = smokeScale;
            this.opacity = smokeOpacity;
            this.rotation = (Math.random() - 0.5) * 0.5;
            this._driftX = (Math.random() - 0.5) * 0.5;
        }

        update() {
            super.update();
            this.updateAnimation();
        }

        updateAnimation() {
            this._duration--;
            
            // Fade out
            this.opacity = (this._duration / smokeDuration) * smokeOpacity;
            
            // Scale up
            const scaleIncrease = 0.03;
            this.scale.x += scaleIncrease;
            this.scale.y += scaleIncrease;
            
            // Drift
            this.y -= 0.8;
            this.x += this._driftX;
            
            if (this._duration <= 0) {
                if (this.parent) {
                    this.parent.removeChild(this);
                }
            }
        }
    }

    //-----------------------------------------------------------------------------
    // Game_CharacterBase
    //-----------------------------------------------------------------------------

    const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.call(this);
        this._dashSmokeCounter = 0;
    };

    Game_CharacterBase.prototype.updateDashSmokeCounter = function() {
        if (!this._dashSmokeCounter) {
            this._dashSmokeCounter = 0;
        }
        
        this._dashSmokeCounter++;
        
        if (this._dashSmokeCounter >= smokeInterval) {
            this._dashSmokeCounter = 0;
            if (SceneManager._scene && SceneManager._scene._spriteset) {
                SceneManager._scene._spriteset.createDashSmokeAt(this.screenX(), this.screenY());
            }
        }
    };

    //-----------------------------------------------------------------------------
    // Game_Player
    //-----------------------------------------------------------------------------

    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.call(this, sceneActive);
        
        if (sceneActive && this.isDashing() && this.isMoving()) {
            this.updateDashSmokeCounter();
        }
    };

    //-----------------------------------------------------------------------------
    // Game_Follower
    //-----------------------------------------------------------------------------

    const _Game_Follower_update = Game_Follower.prototype.update;
    Game_Follower.prototype.update = function() {
        _Game_Follower_update.call(this);
        
        // Followers dash when the player dashes
        if (this.isVisible() && $gamePlayer.isDashing() && this.isMoving()) {
            this.updateDashSmokeCounter();
        }
    };

    //-----------------------------------------------------------------------------
    // Spriteset_Map
    //-----------------------------------------------------------------------------

    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createDashSmokeContainer();
    };

    Spriteset_Map.prototype.createDashSmokeContainer = function() {
        this._dashSmokeSprites = [];
        this._dashSmokeContainer = new Sprite();
        this._dashSmokeContainer.z = 4;
        this._tilemap.addChild(this._dashSmokeContainer);
    };

    Spriteset_Map.prototype.createDashSmokeAt = function(x, y) {
        if (!this._dashSmokeContainer) return;
        
        const sprite = new Sprite_DashSmoke(x, y);
        this._dashSmokeContainer.addChild(sprite);
        this._dashSmokeSprites.push(sprite);
        
        // Clean up finished sprites
        this._dashSmokeSprites = this._dashSmokeSprites.filter(s => s.parent);
    };
})();
