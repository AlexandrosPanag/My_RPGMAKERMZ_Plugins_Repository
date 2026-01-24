//=============================================================================
// Enemy Health Bar Plugin
// Version: 1.0.0
// Date: 24-01-2026
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Displays animated health bars for enemies and actors in battle
 * @author Alexandros Panagiotakopoulos
 * @date 24-01-2026
 * @url https://github.com/AlexandrosPanag/My_RPGMAKERMZ_Plugins_Repository/tree/main/Battle%20System/EnemyHealthBar
 *
 * @param barWidth
 * @text Bar Width
 * @desc Width of the health bar in pixels
 * @type number
 * @default 240
 *
 * @param barHeight
 * @text Bar Height
 * @desc Height of the health bar in pixels
 * @type number
 * @default 24
 *
 * @param enemyBarOffsetY
 * @text Enemy Y Offset
 * @desc Vertical offset from enemy sprite (positive = below)
 * @type number
 * @min -200
 * @default 10
 *
 * @param actorBarOffsetY
 * @text Actor Y Offset
 * @desc Vertical offset from actor sprite (positive = below)
 * @type number
 * @min -200
 * @default 50
 *
 * @param animationSpeed
 * @text Animation Speed
 * @desc Speed of the gradient animation (higher = faster)
 * @type number
 * @default 2
 *
 * @param showActorBars
 * @text Show Actor Bars
 * @desc Show health bars for actors
 * @type boolean
 * @default true
 *
 * @param showEnemyBars
 * @text Show Enemy Bars
 * @desc Show health bars for enemies
 * @type boolean
 * @default true
 *
 * @help
 * This plugin displays animated health bars for enemies and actors in battle.
 * 
 * Features:
 * - Seamless looping gradient animation
 * - Damage instantly cuts to black
 * - Smooth HP drain animation
 * - Works for both actors and enemies
 * 
 * Place this plugin in your js/plugins folder and activate it
 * in the Plugin Manager.
 */

(() => {
    const pluginName = "EnemyHealthBar";
    const parameters = PluginManager.parameters(pluginName);
    
    const barWidth = Number(parameters['barWidth'] || 240);
    const barHeight = Number(parameters['barHeight'] || 24);
    const enemyBarOffsetY = Number(parameters['enemyBarOffsetY'] || 10);
    const actorBarOffsetY = Number(parameters['actorBarOffsetY'] || 50);
    const animationSpeed = Number(parameters['animationSpeed'] || 2);
    const showActorBars = parameters['showActorBars'] !== 'false';
    const showEnemyBars = parameters['showEnemyBars'] !== 'false';

    //-----------------------------------------------------------------------------
    // Sprite_AnimatedHealthBar - Base class for animated health bars
    //-----------------------------------------------------------------------------

    function Sprite_AnimatedHealthBar() {
        this.initialize(...arguments);
    }

    Sprite_AnimatedHealthBar.prototype = Object.create(Sprite.prototype);
    Sprite_AnimatedHealthBar.prototype.constructor = Sprite_AnimatedHealthBar;

    Sprite_AnimatedHealthBar.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this._battler = null;
        this._displayedHp = 0;
        this._targetHp = 0;
        this._maxHp = 1;
        this._animationOffset = 0;
        this._drainSpeed = 0.02; // HP drain animation speed
        this.createBitmap();
        this.anchor.x = 0.5;
        this.anchor.y = 0;
    };

    Sprite_AnimatedHealthBar.prototype.setup = function(battler) {
        this._battler = battler;
        this._displayedHp = battler.hp;
        this._targetHp = battler.hp;
        this._maxHp = battler.mhp;
        this.redraw();
    };

    Sprite_AnimatedHealthBar.prototype.createBitmap = function() {
        // Create a wider bitmap to allow for seamless animation and borders
        this.bitmap = new Bitmap(barWidth + 8, barHeight + 8);
    };

    Sprite_AnimatedHealthBar.prototype.update = function() {
        Sprite.prototype.update.call(this);
        if (!this._battler) return;
        
        // Update animation offset for seamless loop
        this._animationOffset += animationSpeed;
        if (this._animationOffset >= 360) {
            this._animationOffset -= 360;
        }
        
        // Check for HP changes
        if (this._battler.hp !== this._targetHp || this._battler.mhp !== this._maxHp) {
            this._targetHp = this._battler.hp;
            this._maxHp = this._battler.mhp;
            
            // If taking damage, instantly show the "cut" (black area appears immediately)
            if (this._targetHp < this._displayedHp) {
                // Damage taken - the bar "cuts" to show damage area immediately
                // but the displayed HP drains smoothly to match
            }
        }
        
        // Smooth HP drain animation
        if (this._displayedHp !== this._targetHp) {
            const diff = this._targetHp - this._displayedHp;
            const step = Math.max(1, Math.abs(diff) * this._drainSpeed);
            
            if (Math.abs(diff) <= step) {
                this._displayedHp = this._targetHp;
            } else if (diff > 0) {
                this._displayedHp += step; // Healing
            } else {
                this._displayedHp -= step; // Damage drain
            }
        }
        
        // Always redraw for animation
        this.redraw();
        
        // Visibility
        this.visible = this._battler.isAlive();
    };

    Sprite_AnimatedHealthBar.prototype.redraw = function() {
        if (!this._battler) return;
        
        const bitmap = this.bitmap;
        bitmap.clear();
        
        const ctx = bitmap.context;
        const x = 4;
        const y = 4;
        const w = barWidth;
        const h = barHeight;
        const borderWidth = 2;
        const innerPadding = 3;
        
        // Calculate rates
        const currentRate = Math.max(0, this._displayedHp / this._maxHp);
        const targetRate = Math.max(0, this._targetHp / this._maxHp);
        const innerWidth = w - (borderWidth + innerPadding) * 2;
        const innerHeight = h - (borderWidth + innerPadding) * 2;
        const fillWidth = Math.floor(innerWidth * currentRate);
        const targetWidth = Math.floor(innerWidth * targetRate);
        
        // Draw outer glow/shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
        ctx.shadowBlur = 6;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        // Outer border frame (dark)
        ctx.fillStyle = '#2a2a2a';
        ctx.fillRect(x, y, w, h);
        
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        // Inner border (metallic look)
        const metalGradient = ctx.createLinearGradient(x, y, x, y + h);
        metalGradient.addColorStop(0, '#555555');
        metalGradient.addColorStop(0.5, '#333333');
        metalGradient.addColorStop(1, '#555555');
        ctx.fillStyle = metalGradient;
        ctx.fillRect(x + borderWidth, y + borderWidth, w - borderWidth * 2, h - borderWidth * 2);
        
        // Inner background (deep black with slight gradient)
        const bgGradient = ctx.createLinearGradient(x + borderWidth + innerPadding, y + borderWidth + innerPadding, 
                                                     x + borderWidth + innerPadding, y + h - borderWidth - innerPadding);
        bgGradient.addColorStop(0, '#0a0a0a');
        bgGradient.addColorStop(0.5, '#151515');
        bgGradient.addColorStop(1, '#0a0a0a');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(x + borderWidth + innerPadding, y + borderWidth + innerPadding, innerWidth, innerHeight);
        
        const fillX = x + borderWidth + innerPadding;
        const fillY = y + borderWidth + innerPadding;
        
        // Draw the animated health gradient if there's HP to show
        if (fillWidth > 0) {
            // Main health bar with animated gradient
            const gradient = this.createAnimatedGradient(ctx, fillX, fillY, fillWidth, innerHeight);
            ctx.fillStyle = gradient;
            ctx.fillRect(fillX, fillY, fillWidth, innerHeight);
            
            // Add depth with inner shadow
            const depthGradient = ctx.createLinearGradient(fillX, fillY, fillX, fillY + innerHeight);
            depthGradient.addColorStop(0, 'rgba(0, 0, 0, 0.3)');
            depthGradient.addColorStop(0.1, 'rgba(0, 0, 0, 0)');
            depthGradient.addColorStop(0.9, 'rgba(0, 0, 0, 0)');
            depthGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
            ctx.fillStyle = depthGradient;
            ctx.fillRect(fillX, fillY, fillWidth, innerHeight);
            
            // Professional gloss effect (curved highlight)
            const glossGradient = ctx.createLinearGradient(fillX, fillY, fillX, fillY + innerHeight * 0.6);
            glossGradient.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
            glossGradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.3)');
            glossGradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.05)');
            glossGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = glossGradient;
            ctx.fillRect(fillX, fillY, fillWidth, innerHeight * 0.6);
            
            // Bottom reflection
            const reflectGradient = ctx.createLinearGradient(fillX, fillY + innerHeight * 0.7, fillX, fillY + innerHeight);
            reflectGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            reflectGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
            reflectGradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
            ctx.fillStyle = reflectGradient;
            ctx.fillRect(fillX, fillY + innerHeight * 0.7, fillWidth, innerHeight * 0.3);
        }
        
        // If draining (damage taken), show the "ghost" of previous HP in darker color
        if (currentRate > targetRate && targetWidth < fillWidth) {
            const drainX = fillX + targetWidth;
            const drainWidth = fillWidth - targetWidth;
            
            // Drain area with gradient
            const drainGradient = ctx.createLinearGradient(drainX, fillY, drainX, fillY + innerHeight);
            drainGradient.addColorStop(0, 'rgba(200, 50, 50, 0.7)');
            drainGradient.addColorStop(0.5, 'rgba(255, 80, 80, 0.8)');
            drainGradient.addColorStop(1, 'rgba(200, 50, 50, 0.7)');
            ctx.fillStyle = drainGradient;
            ctx.fillRect(drainX, fillY, drainWidth, innerHeight);
        }
        
        // Outer border highlights for 3D effect
        ctx.strokeStyle = '#666666';
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
        
        // Top-left highlight (light)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.moveTo(x + 1, y + h - 1);
        ctx.lineTo(x + 1, y + 1);
        ctx.lineTo(x + w - 1, y + 1);
        ctx.stroke();
        
        // Bottom-right shadow (dark)
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.beginPath();
        ctx.moveTo(x + w - 1, y + 1);
        ctx.lineTo(x + w - 1, y + h - 1);
        ctx.lineTo(x + 1, y + h - 1);
        ctx.stroke();
        
        bitmap._baseTexture.update();
    };

    Sprite_AnimatedHealthBar.prototype.createAnimatedGradient = function(ctx, x, y, width, height) {
        // Create seamless looping gradient with enhanced colors
        const offset = this._animationOffset;
        const rate = this._displayedHp / this._maxHp;
        
        // Base colors depend on HP percentage with smoother transitions
        let baseHue, baseSaturation;
        if (rate > 0.6) {
            // Healthy green (120 to 90)
            baseHue = 120;
            baseSaturation = 85;
        } else if (rate > 0.4) {
            // Yellow-green transition (90 to 60)
            baseHue = 120 - (0.6 - rate) * 300;
            baseSaturation = 90;
        } else if (rate > 0.2) {
            // Yellow to orange (60 to 30)
            baseHue = 60 - (0.4 - rate) * 150;
            baseSaturation = 95;
        } else {
            // Orange to red (30 to 0)
            baseHue = 30 - rate * 150;
            baseSaturation = 100;
        }
        baseHue = Math.max(0, Math.min(120, baseHue));
        
        // Create gradient with animated color stops
        const gradient = ctx.createLinearGradient(x, y + height * 0.3, x + width, y + height * 0.7);
        
        // Enhanced animation with more stops for smoother effect
        const stops = 12;
        for (let i = 0; i <= stops; i++) {
            const position = i / stops;
            
            // Create wave effect with multiple frequencies for complexity
            const wave1 = Math.sin((position * 2 + offset / 60) * Math.PI);
            const wave2 = Math.sin((position * 4 + offset / 40) * Math.PI) * 0.5;
            const combinedWave = (wave1 + wave2) / 1.5;
            
            // Dynamic lightness and saturation
            const lightness = 50 + combinedWave * 20; // Varies between 30% and 70%
            const saturation = baseSaturation + combinedWave * 10;
            
            // Subtle hue shift for shimmer effect
            const hueShift = Math.sin((position * 6 + offset / 25) * Math.PI) * 8;
            const hue = baseHue + hueShift;
            
            const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
            gradient.addColorStop(position, color);
        }
        
        return gradient;
    };

    //-----------------------------------------------------------------------------
    // Sprite_Enemy - Add health bar
    //-----------------------------------------------------------------------------

    const _Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
    Sprite_Enemy.prototype.initMembers = function() {
        _Sprite_Enemy_initMembers.call(this);
        this._healthBarSprite = null;
        this._needsHealthBar = false;
    };

    const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler = function(battler) {
        _Sprite_Enemy_setBattler.call(this, battler);
        if (battler && showEnemyBars) {
            this._needsHealthBar = true;
        }
    };

    const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
    Sprite_Enemy.prototype.update = function() {
        _Sprite_Enemy_update.call(this);
        if (this._needsHealthBar && this.parent) {
            this.createHealthBar();
            this._needsHealthBar = false;
        }
        this.updateHealthBar();
    };

    Sprite_Enemy.prototype.createHealthBar = function() {
        if (!this._healthBarSprite && this._enemy) {
            this._healthBarSprite = new Sprite_AnimatedHealthBar();
            this._healthBarSprite.setup(this._enemy);
            this.parent.addChild(this._healthBarSprite);
        }
    };

    Sprite_Enemy.prototype.updateHealthBar = function() {
        if (this._healthBarSprite && this._enemy) {
            this._healthBarSprite.x = this.x;
            this._healthBarSprite.y = this.y + enemyBarOffsetY;
        }
    };

    const _Sprite_Enemy_destroy = Sprite_Enemy.prototype.destroy;
    Sprite_Enemy.prototype.destroy = function(options) {
        if (this._healthBarSprite) {
            this._healthBarSprite = null;
        }
        _Sprite_Enemy_destroy.call(this, options);
    };

    //-----------------------------------------------------------------------------
    // Sprite_Actor - Add health bar
    //-----------------------------------------------------------------------------

    const _Sprite_Actor_initMembers_health = Sprite_Actor.prototype.initMembers || function() {};
    Sprite_Actor.prototype.initMembers = function() {
        _Sprite_Actor_initMembers_health.call(this);
        this._healthBarSprite = null;
        this._needsHealthBar = false;
    };

    const _Sprite_Actor_setBattler_health = Sprite_Actor.prototype.setBattler || Sprite_Actor.prototype.setBattler;
    Sprite_Actor.prototype.setBattler = function(battler) {
        _Sprite_Actor_setBattler_health.call(this, battler);
        if (battler && showActorBars) {
            this._needsHealthBar = true;
            // Update existing health bar with new battler
            if (this._healthBarSprite) {
                this._healthBarSprite.setup(battler);
            }
        }
    };

    const _Sprite_Actor_update_health = Sprite_Actor.prototype.update || Sprite_Actor.prototype.update;
    Sprite_Actor.prototype.update = function() {
        _Sprite_Actor_update_health.call(this);
        if (this._needsHealthBar && this._battler) {
            this.createActorHealthBar();
            this._needsHealthBar = false;
        }
        this.updateActorHealthBar();
    };

    Sprite_Actor.prototype.createActorHealthBar = function() {
        if (!this._healthBarSprite && this._battler) {
            this._healthBarSprite = new Sprite_AnimatedHealthBar();
            this._healthBarSprite.setup(this._battler);
            this.addChild(this._healthBarSprite);
        }
    };

    Sprite_Actor.prototype.updateActorHealthBar = function() {
        if (this._healthBarSprite && this._battler) {
            // Position below actor (relative to actor sprite)
            this._healthBarSprite.x = 0;
            this._healthBarSprite.y = actorBarOffsetY;
        }
    };

})();
