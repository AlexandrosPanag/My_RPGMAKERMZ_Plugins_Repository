/*:
 * @target MZ
 * @plugindesc PartyJump v1.1.0 - Simplified
 * @author Alexandros Panagiotakopoulos
 * @version 1.1.0
 *
 * @help
 * ============================================================================
 *  PartyJump.js - Documentation & License
 * ============================================================================
 *
 *  PartyJump enables the player and followers to perform a charged jump in any
 *  direction, with visual feedback and robust collision/object detection.
 *
 *  FEATURES:
 *  - Hold SPACE or L3 (left stick click) to charge a jump.
 *  - Release to jump. Direction is set by arrow keys, WASD, or gamepad stick.
 *  - Followers jump with you, staggered for realism.
 *  - Visual charge indicator with color, progress, and direction arrow.
 *  - Jump height and distance scale with charge time.
 *  - Sound effect on jump (configurable).
 *  - Performance optimized for RPG Maker MZ.
 *
 *  IN-DEPTH OBJECT DETECTION:
 *  - Before jumping, the plugin checks if the landing spot is valid:
 *    1. Map boundaries: Prevents jumping off the map.
 *    2. Tile passability: Uses $gameMap.isPassable(x, y, d) to ensure the tile
 *       can be entered from the jump direction.
 *    3. Event collision: Scans all events at the target tile with $gameMap.eventsXy(x, y)
 *       and blocks the jump if any event with normal priority is present (e.g., walls, obstacles).
 *    4. Followers: Follower jumps are only triggered if the player jump is valid.
 *    5. If the landing spot is invalid, the jump is canceled and an error sound is played.
 *  - The plugin supports diagonal and straight jumps, and adapts to both keyboard and gamepad input.
 *
 *  LICENSE
 *  ===========================================================================
 *  Free for commercial use with proper attribution.
 *  Modify and adapt for your specific needs.
 *  No royalties - pay once, use forever.
 *  Attribution Required: Alexandros Panagiotakopoulos
 *  Performance optimization by Alexandros Panagiotakopoulos
 *
 *  Example Attribution:
 *    "PartyJump.js by Alexandros Panagiotakopoulos - github.com/alexandrospanag"
 *
 *  For support, updates, or attribution details, visit:
 *    https://alexandrospanag.github.io
 *
 *  PARAMETERS (see Plugin Manager):
 *    - Maximum Jump Height/Distance
 *    - Minimum/Maximum Charge Time
 *    - Jump Duration
 *    - Enable Sound, Sound Name, Volume
 *    - Cooldown Frames
 *    - Show Charge Indicator
 *
 *  USAGE:
 *    - Hold SPACE or L3 to charge, release to jump.
 *    - Use arrow keys, WASD, or gamepad stick to set jump direction.
 *    - Followers will jump with you.
 *    - Visual indicator shows charge and direction.
 *
 * ============================================================================
 */

(() => {
    'use strict';
    
    const params = PluginManager.parameters('PartyJump');
    const config = {
        maxHeight: Number(params['maxJumpHeight'] || 60),
        maxDistance: Number(params['maxJumpDistance'] || 96),
        minCharge: Number(params['minChargeTime'] || 10),
        maxCharge: Math.floor(Number(params['maxChargeTime'] || 90) * 0.5), // 50% faster
        duration: Number(params['jumpDuration'] || 30),
        cooldown: Number(params['cooldownFrames'] || 60),
        sound: params['enableSound'] === 'true',
        soundName: String(params['jumpSound'] || 'Jump1'),
        volume: Number(params['jumpVolume'] || 80),
        showIndicator: params['showChargeIndicator'] !== 'false'
    };
    
    let jumpState = {
        cooldown: 0,
        isJumping: false,
        isCharging: false,
        chargeStart: 0,
        direction: 0,
        indicator: null
    };
    
    const easing = t => t < 0.5 ? 
        (1 - Math.pow(1 - t * 2, 4)) * 0.5 : 
        0.5 + Math.pow((t - 0.5) * 2, 4) * 0.5;
    
    const getChargeProgress = elapsed => 
        Math.max(0, Math.min(1, (elapsed - config.minCharge) / (config.maxCharge - config.minCharge)));
    
    const getChargeMultiplier = progress => 0.5 + progress * 1.5;
    
    const DIRECTIONS = {
        UP: 8, DOWN: 2, LEFT: 4, RIGHT: 6,
        UP_LEFT: 7, UP_RIGHT: 9, DOWN_LEFT: 1, DOWN_RIGHT: 3
    };
    
    const DIRECTION_OFFSETS = {
        [DIRECTIONS.UP]: [0, -1],
        [DIRECTIONS.DOWN]: [0, 0.5],
        [DIRECTIONS.LEFT]: [-1, 0],
        [DIRECTIONS.RIGHT]: [1, 0],
        [DIRECTIONS.UP_LEFT]: [-0.7, -0.3],
        [DIRECTIONS.UP_RIGHT]: [0.7, -0.3],
        [DIRECTIONS.DOWN_LEFT]: [-0.7, 0.3],
        [DIRECTIONS.DOWN_RIGHT]: [0.7, 0.3]
    };
    
    // Sprite Jump Animation
    const _Sprite_Character_updatePosition = Sprite_Character.prototype.updatePosition;
    Sprite_Character.prototype.updatePosition = function() {
        _Sprite_Character_updatePosition.call(this);
        
        if (this._character?._jumpData?.active && this._character.isPartyMember()) {
            const data = this._character._jumpData;
            const progress = easing(data.progress);
            
            // Only apply visual vertical offset, horizontal is handled by actual position
            this.y -= data.height * Math.sin(progress * Math.PI);
        }
    };
    
    // Character Jump Data
    const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.call(this);
        this._jumpData = { active: false, progress: 0, start: 0, height: 0, distance: 0, direction: 0 };
    };
    
    Game_CharacterBase.prototype.startJump = function(direction, distance, height) {
        this._jumpData = {
            active: true,
            progress: 0,
            start: Graphics.frameCount,
            height: height,
            distance: distance,
            direction: direction
        };
    };
    
    Game_CharacterBase.prototype.updateJump = function() {
        if (!this._jumpData.active) return;
        
        const elapsed = Graphics.frameCount - this._jumpData.start;
        this._jumpData.progress = Math.min(elapsed / config.duration, 1);
        
        if (this._jumpData.progress >= 1) {
            this._jumpData.active = false;
        }
    };
    
    Game_CharacterBase.prototype.isPartyMember = function() {
        return this === $gamePlayer || $gamePlayer._followers._data.includes(this);
    };
    
    // Player Input
    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.call(this, sceneActive);
        this.updateJump();
        this.updateJumpInput();
    };
    
    Game_Player.prototype.updateJumpInput = function() {
        if (jumpState.cooldown > 0) jumpState.cooldown--;
        
        const isHeld = Input.isPressed('space') || Input.isPressed('l3');
        
        if (isHeld && !jumpState.isCharging && this.canJump()) {
            this.startCharge();
        } else if (!isHeld && jumpState.isCharging) {
            this.executeJump();
        } else if (jumpState.isCharging) {
            this.updateCharge();
        }
    };
    
    // Prevent movement only during jump animation, not during charging
    const _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        if (jumpState.isJumping) return false;
        return _Game_Player_canMove.call(this);
    };
    
    Game_Player.prototype.startCharge = function() {
        jumpState.isCharging = true;
        jumpState.chargeStart = Graphics.frameCount;
        jumpState.direction = 0;
        if (config.showIndicator) this.createIndicator();
    };
    
    Game_Player.prototype.updateCharge = function() {
        const elapsed = Graphics.frameCount - jumpState.chargeStart;
        jumpState.direction = this.getDirection();
        
        // Check if landing spot is valid
        const isLandingValid = this.checkLandingSpot(jumpState.direction, elapsed);
        
        // Remove auto-jump, allow infinite charging
        if (config.showIndicator) {
            this.refreshIndicator(elapsed, isLandingValid);
        }
    };
    
    Game_Player.prototype.checkLandingSpot = function(direction, elapsed) {
        if (direction === 0) return true; // Vertical jump always valid
        
        const progress = getChargeProgress(elapsed);
        const multiplier = getChargeMultiplier(progress);
        const distance = config.maxDistance * multiplier;
        const offset = DIRECTION_OFFSETS[direction] || [0, 0];
        const tiles = Math.round(distance / 48);
        
        const targetX = this.x + (offset[0] * tiles);
        const targetY = this.y + (offset[1] * tiles);
        
        // Check if target position is passable
        return this.isMapPassable(Math.round(targetX), Math.round(targetY), direction);
    };
    
    Game_Player.prototype.isMapPassable = function(x, y, d) {
        // Check map boundaries
        if (x < 0 || y < 0 || x >= $gameMap.width() || y >= $gameMap.height()) {
            return false;
        }
        
        // Check if tile is passable
        if (!$gameMap.isPassable(x, y, d)) {
            return false;
        }
        
        // Check for events blocking the spot
        const events = $gameMap.eventsXy(x, y);
        for (const event of events) {
            if (event.isNormalPriority()) {
                return false;
            }
        }
        
        return true;
    };
    
    Game_Player.prototype.cancelJump = function() {
        // Play error sound
        AudioManager.playSe({
            name: 'Buzzer1',
            volume: 60,
            pitch: 100,
            pan: 0
        });
        
        jumpState.isCharging = false;
        if (config.showIndicator) this.destroyIndicator();
    };
    
    Game_Player.prototype.executeJump = function() {
        const elapsed = Graphics.frameCount - jumpState.chargeStart;
        
        if (elapsed >= config.minCharge) {
            const progress = getChargeProgress(elapsed);
            const multiplier = getChargeMultiplier(progress);
            const height = config.maxHeight * multiplier;
            const distance = jumpState.direction ? config.maxDistance * multiplier : 0;
            
            // Final check before jumping
            if (this.checkLandingSpot(jumpState.direction, elapsed)) {
                this.doJump(jumpState.direction, distance, height);
            } else {
                this.cancelJump();
                return;
            }
        }
        
        jumpState.isCharging = false;
        if (config.showIndicator) this.destroyIndicator();
    };
    
    Game_Player.prototype.doJump = function(direction, distance, height) {
        jumpState.isJumping = true;
        jumpState.cooldown = config.cooldown;
        
        // Enhanced sound for max charge
        const elapsed = Graphics.frameCount - jumpState.chargeStart;
        const isMaxCharge = elapsed >= config.maxCharge;
        
        if (config.sound) {
            AudioManager.playSe({
                name: config.soundName,
                volume: isMaxCharge ? Math.min(100, config.volume + 20) : config.volume,
                pitch: isMaxCharge ? 120 : 100 + (height / config.maxHeight) * 20,
                pan: 0
            });
        }
        
        // Calculate target position based on direction
        const offset = DIRECTION_OFFSETS[direction] || [0, 0];
        const tiles = Math.round(distance / 48); // Convert pixels to tiles
        const targetX = this.x + (offset[0] * tiles);
        const targetY = this.y + (offset[1] * tiles);
        
        // Start visual jump animation for player
        this.startJump(direction, distance, height);
        
        // Move player to target position smoothly
        if (direction !== 0 && tiles > 0) {
            // Store original position
            const startX = this.x;
            const startY = this.y;
            
            // Gradually move player during jump
            let moveProgress = 0;
            const moveInterval = setInterval(() => {
                moveProgress += 1 / config.duration;
                if (moveProgress >= 1) {
                    moveProgress = 1;
                    clearInterval(moveInterval);
                }
                
                const currentX = startX + (targetX - startX) * easing(moveProgress);
                const currentY = startY + (targetY - startY) * easing(moveProgress);
                this.setPosition(currentX, currentY);
                
                // Update followers to follow smoothly
                if (moveProgress >= 0.3) { // Start follower movement slightly delayed
                    $gamePlayer._followers.updateMove();
                }
            }, 16.67);
        } else {
            // Vertical jump - just update followers
            setTimeout(() => $gamePlayer._followers.updateMove(), config.duration * 5);
        }
        
        // Make followers jump with same parameters, slightly staggered
        $gamePlayer._followers._data.forEach((follower, index) => {
            if (follower.isVisible()) {
                setTimeout(() => {
                    follower.startJump(direction, distance, height);
                }, index * 50); // 50ms stagger per follower for natural flow
            }
        });
        
        setTimeout(() => jumpState.isJumping = false, config.duration * 16.67);
    };
    
    Game_Player.prototype.getDirection = function() {
        const pressed = key => Input.isPressed(key);
        
        // Check keyboard directions
        const up = pressed('up') || pressed('w');
        const down = pressed('down') || pressed('s');
        const left = pressed('left') || pressed('a');
        const right = pressed('right') || pressed('d');
        
        // Check gamepad stick (axes)
        let padUp = false, padDown = false, padLeft = false, padRight = false;
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
        for (let i = 0; i < gamepads.length; i++) {
            const gamepad = gamepads[i];
            if (gamepad) {
                const threshold = 0.5;
                const axisX = gamepad.axes[0] || 0;
                const axisY = gamepad.axes[1] || 0;
                
                if (axisY < -threshold) padUp = true;
                if (axisY > threshold) padDown = true;
                if (axisX < -threshold) padLeft = true;
                if (axisX > threshold) padRight = true;
            }
        }
        
        // Combine keyboard and gamepad inputs
        const finalUp = up || padUp;
        const finalDown = down || padDown;
        const finalLeft = left || padLeft;
        const finalRight = right || padRight;
        
        // Return combined direction
        if (finalUp && finalLeft) return DIRECTIONS.UP_LEFT;
        if (finalUp && finalRight) return DIRECTIONS.UP_RIGHT;
        if (finalDown && finalLeft) return DIRECTIONS.DOWN_LEFT;
        if (finalDown && finalRight) return DIRECTIONS.DOWN_RIGHT;
        if (finalUp) return DIRECTIONS.UP;
        if (finalDown) return DIRECTIONS.DOWN;
        if (finalLeft) return DIRECTIONS.LEFT;
        if (finalRight) return DIRECTIONS.RIGHT;
        return 0;
    };
    
    Game_Player.prototype.canJump = function() {
        return jumpState.cooldown <= 0 && !jumpState.isJumping && 
               !$gameMessage.isBusy() && $gameSystem.isMenuEnabled() && 
               !$gameMap.isEventRunning();
    };
    
    Game_Player.prototype.createIndicator = function() {
        const scene = SceneManager._scene;
        if (!scene?._spriteset) return;
        
        jumpState.indicator = new Sprite(new Bitmap(40, 40));
        jumpState.indicator.anchor.set(0.5, 1);
        
        const playerSprite = scene._spriteset._characterSprites.find(s => s._character === this);
        if (playerSprite) {
            jumpState.indicator.x = playerSprite.x;
            jumpState.indicator.y = playerSprite.y - 48;
            scene._spriteset._tilemap.addChild(jumpState.indicator);
        }
    };
    
    Game_Player.prototype.refreshIndicator = function(elapsed, isValid = true) {
        if (!jumpState.indicator?.bitmap) return;
        
        const bmp = jumpState.indicator.bitmap;
        const progress = getChargeProgress(elapsed);
        const cx = 20, cy = 20, r = 14;
        const isMaxCharge = elapsed >= config.maxCharge;
        
        bmp.clear();
        
        // Super charge effect - pulsing and glowing
        if (isMaxCharge && isValid) {
            const pulse = Math.sin(Graphics.frameCount * 0.2) * 0.3 + 0.7;
            const glowRadius = r + 4 + Math.sin(Graphics.frameCount * 0.3) * 3;
            
            // Outer glow
            const ctx = bmp._context;
            const gradient = ctx.createRadialGradient(cx, cy, r, cx, cy, glowRadius);
            gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
            gradient.addColorStop(0.5, 'rgba(255, 140, 0, 0.5)');
            gradient.addColorStop(1, 'rgba(255, 69, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, bmp.width, bmp.height);
            
            // Sparkle particles
            for (let i = 0; i < 8; i++) {
                const angle = (Graphics.frameCount * 0.1 + i * Math.PI / 4) % (Math.PI * 2);
                const dist = r + 8;
                const px = cx + Math.cos(angle) * dist;
                const py = cy + Math.sin(angle) * dist;
                ctx.fillStyle = `rgba(255, 255, 0, ${pulse})`;
                ctx.fillRect(px - 1, py - 1, 2, 2);
            }
        }
        
        // Background circle with color based on validity
        const bgColor = isValid ? (isMaxCharge ? 'rgba(255, 215, 0, 0.6)' : 'rgba(0,0,0,0.4)') : 'rgba(255,0,0,0.5)';
        bmp.drawCircle(cx, cy, r, bgColor);
        
        const ctx = bmp._context;
        ctx.beginPath();
        ctx.arc(cx, cy, r - 2, -Math.PI/2, -Math.PI/2 + Math.min(progress, 1) * Math.PI * 2);
        
        // Enhanced color for max charge
        if (isMaxCharge && isValid) {
            const gradient = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
            gradient.addColorStop(0, '#FFD700');
            gradient.addColorStop(0.5, '#FFA500');
            gradient.addColorStop(1, '#FF4500');
            ctx.strokeStyle = gradient;
        } else {
            ctx.strokeStyle = isValid ? `hsl(${Math.min(progress, 1) * 120}, 100%, 50%)` : '#FF0000';
        }
        ctx.lineWidth = isMaxCharge && isValid ? 5 : 4;
        ctx.stroke();
        
        // "MAX" text for full charge
        if (isMaxCharge && isValid) {
            bmp.fontSize = 10;
            bmp.textColor = '#FFD700';
            bmp.outlineColor = '#FF4500';
            bmp.outlineWidth = 3;
            bmp.drawText('MAX!', 0, -5, bmp.width, 20, 'center');
        }
        
        if (jumpState.direction) {
            const angles = {8: -90, 2: 90, 4: 180, 6: 0, 7: -135, 9: -45, 1: 135, 3: 45};
            const angle = (angles[jumpState.direction] || 0) * Math.PI / 180;
            
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(-6, -3);
            ctx.lineTo(6, 0);
            ctx.lineTo(-6, 3);
            ctx.closePath();
            
            // Enhanced arrow for max charge
            if (isMaxCharge && isValid) {
                ctx.shadowColor = '#FFD700';
                ctx.shadowBlur = 10;
            }
            
            ctx.fillStyle = isValid ? (isMaxCharge ? '#FFD700' : '#FFD700') : '#FF0000';
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
        }
        
        // Draw X mark if landing spot is invalid
        if (!isValid && jumpState.direction) {
            ctx.strokeStyle = '#FF0000';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(cx - 8, cy - 8);
            ctx.lineTo(cx + 8, cy + 8);
            ctx.moveTo(cx + 8, cy - 8);
            ctx.lineTo(cx - 8, cy + 8);
            ctx.stroke();
        }
        
        bmp._baseTexture.update();
    };
    
    Game_Player.prototype.destroyIndicator = function() {
        if (jumpState.indicator?.parent) {
            jumpState.indicator.parent.removeChild(jumpState.indicator);
        }
        jumpState.indicator = null;
    };
    
    // Follower Update
    const _Game_Follower_update = Game_Follower.prototype.update;
    Game_Follower.prototype.update = function() {
        _Game_Follower_update.call(this);
        this.updateJump();
    };
    
    // Input Enhancement - Enhanced for DualSense and Xbox Controllers
    const _Input_onKeyDown = Input._onKeyDown;
    Input._onKeyDown = function(event) {
        _Input_onKeyDown.call(this, event);
        const keys = {32: 'space', 87: 'w', 65: 'a', 83: 's', 68: 'd'};
        if (keys[event.keyCode]) this._currentState[keys[event.keyCode]] = true;
    };
    
    const _Input_onKeyUp = Input._onKeyUp;
    Input._onKeyUp = function(event) {
        _Input_onKeyUp.call(this, event);
        const keys = {32: 'space', 87: 'w', 65: 'a', 83: 's', 68: 'd'};
        if (keys[event.keyCode]) this._currentState[keys[event.keyCode]] = false;
    };
    
    const _Input_updateGamepadState = Input._updateGamepadState;
    Input._updateGamepadState = function(gamepad) {
        _Input_updateGamepadState.call(this, gamepad);
        if (gamepad) {
            // L3 Button Support (Left Stick Click)
            // DualSense/PS: Button 10
            // Xbox: Button 10
            // Most standard gamepads: Button 10
            const l3Button = gamepad.buttons[10];
            if (l3Button) {
                this._currentState['l3'] = l3Button.pressed;
            }
            
            // Also check button 11 (R3) as fallback for some controller mappings
            const r3Button = gamepad.buttons[11];
            if (r3Button && r3Button.pressed) {
                this._currentState['l3'] = true;
            }
        }
    };
    
    // Scene Cleanup
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        jumpState = { cooldown: 0, isJumping: false, isCharging: false, chargeStart: 0, direction: 0, indicator: null };
    };
    
})();
