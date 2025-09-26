/*:
 * @target MZ
 * @plugindesc PartyJump v1.0.0
 * @author GitHub Copilot & Alexandros Panagiotokopoulos
 * @version 1.0.0
 * @description A dynamic party jump system for RPG Maker MZ
 * @url 
 * @help PartyJump.js
 * 
 * ============================================================================
 * Party Jump Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin allows the player to make the entire party jump by pressing
 * the space key. All visible party members will perform synchronized jumping
 * animations with customizable height and duration.
 * 
 * DIRECTIONAL JUMPING (Hold & Release System):
 * • Hold SPACE = Charge jump
 * • Hold SPACE + Direction Keys = Charge directional jump
 * • Release SPACE = Execute jump in held direction
 * • Supports Arrow Keys, WASD, and Controller Stick
 * 
 * CONTROLLER SUPPORT:
 * • Hold L3 (Left Stick Button) = Charge jump
 * • Hold L3 + Left Stick Direction = Charge directional jump
 * • Release L3 = Execute jump in held direction
 * 
 * CHARGING SYSTEM:
 * • Visual feedback shows charge direction and power level
 * • Minimum hold time prevents accidental jumps
 * • Variable jump height based on charge duration
 * • Longer charge = Higher jump + Greater distance
 * • Maximum charge time for ultimate jumps
 * • Power levels: Weak → Normal → Strong → Ultimate
 * • Works with all input methods simultaneously
 * 
 * Features:
 * • Hold-and-release jump charging system
 * • 8-directional jumping support (arrows, WASD, or stick)
 * • Full controller and keyboard compatibility
 * • Visual charge indicators and feedback
 * • Customizable jump height, distance, and animation duration
 * • Sound effects with pitch variation for directional jumps
 * • Smooth animation with easing effects
 * • Works on maps and during movement
 * • Prevents jumping during events or cutscenes
 * 
 * ============================================================================
 * Plugin Parameters
 * ============================================================================
 * 
 * @param maxJumpHeight
 * @text Maximum Jump Height
 * @desc Highest jump at full charge (in pixels)
 * @type number
 * @min 20
 * @max 200
 * @default 60
 * 
 * @param maxJumpDistance  
 * @text Maximum Jump Distance
 * @desc Furthest jump at full charge (in pixels)
 * @type number
 * @min 0
 * @max 150
 * @default 96
 * 
 * @param chargeLevels
 * @text Charge Power Levels
 * @desc Number of distinct power levels (2-8)
 * @type number
 * @min 2
 * @max 8
 * @default 4
 * 
 * @param ultimateChargeTime
 * @text Ultimate Charge Time
 * @desc Frames needed for maximum power jump
 * @type number
 * @min 60
 * @max 300
 * @default 120
 * 
 * @param chargeSound
 * @text Charging Sound Effect
 * @desc Sound effect while charging (optional)
 * @type string
 * @default Cursor1
 * 
 * @param enableChargingSound
 * @text Enable Charging Sound
 * @desc Play sound effect while charging
 * @type boolean
 * @default true
 * 
 * @param minChargeTime
 * @text Minimum Charge Time
 * @desc Minimum frames to hold before jump activates
 * @type number
 * @min 1
 * @max 60
 * @default 10
 * 
 * @param maxChargeTime
 * @text Maximum Charge Time
 * @desc Maximum frames to hold (auto-jumps after this)
 * @type number
 * @min 30
 * @max 180
 * @default 90
 * 
 * @param showChargeIndicator
 * @text Show Charge Indicator
 * @desc Display visual feedback while charging jump
 * @type boolean
 * @default true
 * 
 * @param enableController
 * @text Enable Controller Support
 * @desc Allow jumping with L3 (Left Stick Button) on controllers
 * @type boolean
 * @default true
 * 
 * @param enableWASD
 * @text Enable WASD Support
 * @desc Allow directional jumping with WASD keys
 * @type boolean
 * @default true
 * 
 * @param jumpDistance
 * @text Jump Distance
 * @desc How far characters jump horizontally (in pixels)
 * @type number
 * @min 0
 * @max 96
 * @default 48
 * 
 * @param enableDirectional
 * @text Enable Directional Jumping
 * @desc Allow directional jumping with arrow keys + space
 * @type boolean
 * @default true
 * 
 * @param jumpHeight
 * @text Jump Height
 * @desc How high the characters jump (in pixels)
 * @type number
 * @min 10
 * @max 100
 * @default 24
 * 
 * @param jumpDuration
 * @text Jump Duration
 * @desc How long the jump animation lasts (in frames)
 * @type number
 * @min 10
 * @max 120
 * @default 30
 * 
 * @param enableSound
 * @text Enable Jump Sound
 * @desc Play a sound effect when jumping
 * @type boolean
 * @default true
 * 
 * @param jumpSound
 * @text Jump Sound Effect
 * @desc Sound effect filename (without extension)
 * @type string
 * @default Jump1
 * 
 * @param jumpVolume
 * @text Jump Sound Volume
 * @desc Volume of the jump sound effect (0-100)
 * @type number
 * @min 0
 * @max 100
 * @default 80
 * 
 * @param jumpPitch
 * @text Jump Sound Pitch
 * @desc Pitch of the jump sound effect (50-150)
 * @type number
 * @min 50
 * @max 150
 * @default 100
 * 
 * @param cooldownFrames
 * @text Jump Cooldown
 * @desc Frames to wait between jumps
 * @type number
 * @min 0
 * @max 180
 * @default 60
 * 
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * 
 * Free for commercial and non-commercial use.
 * Please credit "Alexandros Panagiotokopoulos" when using this plugin.
 * 
 * ============================================================================
 * Changelog
 * ============================================================================
 * 
 * Version 1.0.0
 * - Initial release
 * - Basic party jump functionality
 * - Sound effects and customization options
 * 
 */

(() => {
    'use strict';
    
    // Plugin parameter extraction
    const pluginName = 'PartyJump';
    const parameters = PluginManager.parameters(pluginName);
    
    const maxJumpHeight = Number(parameters['maxJumpHeight'] || 60);
    const maxJumpDistance = Number(parameters['maxJumpDistance'] || 96);
    const chargeLevels = Math.max(2, Math.min(8, Number(parameters['chargeLevels'] || 4)));
    const ultimateChargeTime = Number(parameters['ultimateChargeTime'] || 120);
    const chargeSound = String(parameters['chargeSound'] || 'Cursor1');
    const enableChargingSound = parameters['enableChargingSound'] !== 'false';
    const minChargeTime = Number(parameters['minChargeTime'] || 10);
    const maxChargeTime = Number(parameters['maxChargeTime'] || 90);
    const showChargeIndicator = parameters['showChargeIndicator'] !== 'false';
    const enableController = parameters['enableController'] !== 'false';
    const enableWASD = parameters['enableWASD'] !== 'false';
    const jumpDistance = Number(parameters['jumpDistance'] || 48);
    const enableDirectional = parameters['enableDirectional'] === 'true';
    const jumpHeight = Number(parameters['jumpHeight'] || 24);
    const jumpDuration = Number(parameters['jumpDuration'] || 30);
    const enableSound = parameters['enableSound'] === 'true';
    const jumpSound = String(parameters['jumpSound'] || 'Jump1');
    const jumpVolume = Number(parameters['jumpVolume'] || 80);
    const jumpPitch = Number(parameters['jumpPitch'] || 100);
    const cooldownFrames = Number(parameters['cooldownFrames'] || 60);
    
    // Global jump state management
    let jumpCooldown = 0;
    let isJumping = false;
    let isCharging = false;
    let chargeStartFrame = 0;
    let chargedDirection = 0;
    let chargeLevel = 0;
    let chargeSoundPlaying = false;
    let chargeIndicator = null;
    
    // Easing function for smooth jump animation
    const easeOutQuart = (t) => {
        return 1 - Math.pow(1 - t, 4);
    };
    
    const easeInQuart = (t) => {
        return Math.pow(t, 4);
    };
    
    // Helper functions for charge-based jumping
    const getChargeLevel = (elapsed) => {
        if (elapsed < minChargeTime) return 0;
        const chargeProgress = Math.min((elapsed - minChargeTime) / (ultimateChargeTime - minChargeTime), 1);
        return Math.floor(chargeProgress * chargeLevels);
    };
    
    const getJumpPowerMultiplier = (level) => {
        if (level === 0) return 0.5; // Weak jump
        return 0.5 + (level / (chargeLevels - 1)) * 1.5; // 0.5x to 2.0x power
    };
    
    const getChargeLevelName = (level) => {
        const names = ['Weak', 'Normal', 'Strong', 'Power', 'Super', 'Ultra', 'Maximum', 'Ultimate'];
        return names[Math.min(level, names.length - 1)] || 'Ultimate';
    };
    
    const getChargeLevelColor = (level) => {
        const colors = [
            '#FFFF00', // Weak - Yellow
            '#FFA500', // Normal - Orange
            '#FF4500', // Strong - Red Orange
            '#FF0000', // Power - Red
            '#FF00FF', // Super - Magenta
            '#8A2BE2', // Ultra - Blue Violet
            '#4B0082', // Maximum - Indigo
            '#9400D3'  // Ultimate - Violet
        ];
        return colors[Math.min(level, colors.length - 1)] || '#9400D3';
    };
    
    // Combined easing for jump (up and down)
    const jumpEasing = (t) => {
        if (t < 0.5) {
            return easeOutQuart(t * 2) * 0.5;
        } else {
            return 0.5 + easeInQuart((t - 0.5) * 2) * 0.5;
        }
    };
    
    //=============================================================================
    // Sprite_Character - Visual Jump Implementation (Better Compatibility)
    //=============================================================================
    
    const _Sprite_Character_updatePosition = Sprite_Character.prototype.updatePosition;
    Sprite_Character.prototype.updatePosition = function() {
        _Sprite_Character_updatePosition.call(this);
        
        // Apply jump offset at sprite level for better compatibility
        if (this._character && this._character._isPartyJumping && 
            this._character._jumpProgress > 0 && this._character.isPartyMember()) {
            
            const jumpOffset = jumpEasing(this._character._jumpProgress);
            const currentJumpHeight = this._character._originalJumpPeak * Math.sin(jumpOffset * Math.PI);
            
            // Vertical jump offset
            this.y -= currentJumpHeight;
            
            // Horizontal jump offset (directional)
            if (this._character._jumpDirection) {
                const horizontalOffset = this._character._jumpDistance * jumpOffset;
                
                switch (this._character._jumpDirection) {
                    case 2: // Down
                        this.y += horizontalOffset * 0.5; // Slight forward lean
                        break;
                    case 4: // Left
                        this.x -= horizontalOffset;
                        break;
                    case 6: // Right
                        this.x += horizontalOffset;
                        break;
                    case 8: // Up
                        this.y -= horizontalOffset * 0.5; // Slight backward lean
                        break;
                    case 1: // Down-Left
                        this.x -= horizontalOffset * 0.7;
                        this.y += horizontalOffset * 0.3;
                        break;
                    case 3: // Down-Right
                        this.x += horizontalOffset * 0.7;
                        this.y += horizontalOffset * 0.3;
                        break;
                    case 7: // Up-Left
                        this.x -= horizontalOffset * 0.7;
                        this.y -= horizontalOffset * 0.3;
                        break;
                    case 9: // Up-Right
                        this.x += horizontalOffset * 0.7;
                        this.y -= horizontalOffset * 0.3;
                        break;
                }
            }
        }
    };
    
    //=============================================================================
    // Game_CharacterBase - Enhanced Jump System (Simplified)
    //=============================================================================
    
    const _Game_CharacterBase_initMembers = Game_CharacterBase.prototype.initMembers;
    Game_CharacterBase.prototype.initMembers = function() {
        _Game_CharacterBase_initMembers.call(this);
        this._jumpProgress = 0;
        this._jumpStartFrame = 0;
        this._isPartyJumping = false;
        this._originalJumpPeak = 0;
        this._jumpDirection = 0;
        this._jumpDistance = 0;
    };
    
    Game_CharacterBase.prototype.startPartyJump = function(direction = 0, distance = 0, height = jumpHeight) {
        if (this._isPartyJumping) return;
        
        this._isPartyJumping = true;
        this._jumpProgress = 0;
        this._jumpStartFrame = Graphics.frameCount;
        this._originalJumpPeak = height;
        this._jumpDirection = direction;
        this._jumpDistance = distance;
    };
    
    Game_CharacterBase.prototype.updatePartyJump = function() {
        if (!this._isPartyJumping) return;
        
        const elapsed = Graphics.frameCount - this._jumpStartFrame;
        this._jumpProgress = Math.min(elapsed / jumpDuration, 1);
        
        if (this._jumpProgress >= 1) {
            this._isPartyJumping = false;
            this._jumpProgress = 0;
            this._jumpDirection = 0;
            this._jumpDistance = 0;
        }
    };
    
    // Helper method to identify party members
    Game_CharacterBase.prototype.isPartyMember = function() {
        return this === $gamePlayer || $gamePlayer._followers._data.includes(this);
    };
    
    //=============================================================================
    // Game_Player - Jump Input Handling
    //=============================================================================
    
    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.call(this, sceneActive);
        this.updatePartyJump();
        this.updateJumpInput();
    };
    
    Game_Player.prototype.updateJumpInput = function() {
        // Update cooldown
        if (jumpCooldown > 0) {
            jumpCooldown--;
        }
        
        // Check for jump input with hold-and-release system
        const spaceHeld = Input.isPressed('space');
        const l3Held = enableController && Input.isPressed('l3');
        const jumpHeld = spaceHeld || l3Held;
        
        if (jumpHeld && !isCharging && this.canPartyJump()) {
            // Start charging
            this.startCharging();
        } else if (!jumpHeld && isCharging) {
            // Released - execute jump
            this.executeChargedJump();
        } else if (isCharging) {
            // Continue charging
            this.updateCharging();
        }
    };
    
    Game_Player.prototype.startCharging = function() {
        isCharging = true;
        chargeStartFrame = Graphics.frameCount;
        chargedDirection = 0;
        chargeLevel = 0;
        chargeSoundPlaying = false;
        
        if (showChargeIndicator) {
            this.showChargeIndicator();
        }
    };
    
    Game_Player.prototype.updateCharging = function() {
        const elapsed = Graphics.frameCount - chargeStartFrame;
        const newLevel = getChargeLevel(elapsed);
        
        // Update charged direction based on current input
        chargedDirection = this.getJumpDirection();
        
        // Play charging sound when level increases
        if (newLevel > chargeLevel && enableChargingSound && chargeSound) {
            chargeLevel = newLevel;
            this.playChargeLevelSound(chargeLevel);
        }
        
        // Auto-jump if held beyond ultimate
        if (elapsed >= ultimateChargeTime + 30) {
            this.executeChargedJump();
            return;
        }
        
        // Update charge indicator
        if (showChargeIndicator) {
            this.updateChargeIndicator(elapsed, chargedDirection, chargeLevel);
        }
    };
    
    Game_Player.prototype.playChargeLevelSound = function(level) {
        if (!chargeSound) return;
        
        try {
            const basePitch = 80 + (level * 15); // Rising pitch per level
            const audio = {
                name: chargeSound,
                volume: 40 + (level * 5), // Rising volume
                pitch: Math.min(basePitch, 150),
                pan: 0
            };
            AudioManager.playSe(audio);
        } catch (e) {
            console.warn('PartyJump: Could not play charge sound:', chargeSound);
        }
    };
    
    Game_Player.prototype.executeChargedJump = function() {
        if (!isCharging) return;
        
        const elapsed = Graphics.frameCount - chargeStartFrame;
        const finalLevel = getChargeLevel(elapsed);
        
        // Only jump if held long enough
        if (elapsed >= minChargeTime) {
            const powerMultiplier = getJumpPowerMultiplier(finalLevel);
            const chargedHeight = Math.floor(jumpHeight + (maxJumpHeight - jumpHeight) * (powerMultiplier - 0.5) / 1.5);
            const chargedDistance = chargedDirection !== 0 ? 
                Math.floor(jumpDistance + (maxJumpDistance - jumpDistance) * (powerMultiplier - 0.5) / 1.5) : 0;
            
            this.executePartyJump(chargedDirection, chargedDistance, chargedHeight, finalLevel);
        }
        
        // Reset charging state
        isCharging = false;
        chargedDirection = 0;
        chargeLevel = 0;
        chargeSoundPlaying = false;
        
        if (showChargeIndicator) {
            this.hideChargeIndicator();
        }
    };
    
    Game_Player.prototype.showChargeIndicator = function() {
        if (!SceneManager._scene || !SceneManager._scene._spriteset) return;
        
        // Create charge indicator sprite
        chargeIndicator = new Sprite();
        chargeIndicator.bitmap = new Bitmap(32, 32);
        chargeIndicator.anchor.x = 0.5;
        chargeIndicator.anchor.y = 1;
        chargeIndicator.z = 200;
        
        // Position above player
        const playerSprite = SceneManager._scene._spriteset._characterSprites.find(sprite => 
            sprite._character === $gamePlayer);
        if (playerSprite) {
            chargeIndicator.x = playerSprite.x;
            chargeIndicator.y = playerSprite.y - 48;
            SceneManager._scene._spriteset._tilemap.addChild(chargeIndicator);
        }
    };
    
    Game_Player.prototype.updateChargeIndicator = function(elapsed, direction, level) {
        if (!chargeIndicator || !chargeIndicator.bitmap) return;
        
        const bitmap = chargeIndicator.bitmap;
        bitmap.clear();
        
        // Calculate progress and power level
        const progress = Math.min(elapsed / ultimateChargeTime, 1);
        const powerMultiplier = getJumpPowerMultiplier(level);
        const levelColor = getChargeLevelColor(level);
        const levelName = getChargeLevelName(level);
        
        const radius = 12 + (level * 2); // Growing radius with level
        const centerX = 20;
        const centerY = 20;
        
        // Expand bitmap if needed for larger indicators
        if (radius > 16 && bitmap.width < 50) {
            bitmap.resize(50, 50);
        }
        
        // Background circle (pulsing effect for high levels)
        const pulseAlpha = level > 2 ? 0.3 + Math.sin(Graphics.frameCount * 0.3) * 0.2 : 0.3;
        bitmap.drawCircle(centerX, centerY, radius + 3, `rgba(255, 255, 255, ${pulseAlpha})`);
        
        // Main progress circle
        bitmap.drawCircle(centerX, centerY, radius, 'rgba(0, 0, 0, 0.4)');
        
        // Multi-layered progress arc for different power levels
        const context = bitmap._context;
        const startAngle = -Math.PI / 2;
        
        // Draw each charge level as a separate arc
        for (let i = 0; i <= level; i++) {
            const levelProgress = Math.min((elapsed - minChargeTime) / (ultimateChargeTime - minChargeTime), 1);
            const arcProgress = Math.min(levelProgress * chargeLevels - i, 1);
            if (arcProgress <= 0) continue;
            
            const endAngle = startAngle + (arcProgress * Math.PI * 2 / chargeLevels) + (i * Math.PI * 2 / chargeLevels);
            
            context.beginPath();
            context.arc(centerX, centerY, radius - 2, 
                       startAngle + (i * Math.PI * 2 / chargeLevels), endAngle);
            context.strokeStyle = getChargeLevelColor(i);
            context.lineWidth = 4;
            context.stroke();
        }
        
        // Power level text
        if (level > 0) {
            bitmap.fontSize = 8;
            bitmap.textColor = levelColor;
            bitmap.drawText(levelName, 0, radius + 8, bitmap.width, 12, 'center');
        }
        
        // Power multiplier indicator
        if (powerMultiplier > 1) {
            bitmap.fontSize = 6;
            bitmap.textColor = '#FFFFFF';
            bitmap.drawText(`${powerMultiplier.toFixed(1)}x`, 0, radius + 20, bitmap.width, 10, 'center');
        }
        
        // Direction arrow (larger and more prominent for high levels)
        if (direction !== 0) {
            this.drawDirectionArrow(bitmap, centerX, centerY, direction, level);
        }
        
        bitmap._baseTexture.update();
    };
    
    Game_Player.prototype.drawDirectionArrow = function(bitmap, centerX, centerY, direction, level) {
        const context = bitmap._context;
        const arrowSize = 6 + (level * 1.5); // Bigger arrows for higher levels
        
        let angle = 0;
        switch (direction) {
            case 8: angle = -Math.PI / 2; break; // Up
            case 2: angle = Math.PI / 2; break;  // Down
            case 4: angle = Math.PI; break;      // Left
            case 6: angle = 0; break;            // Right
            case 7: angle = -3 * Math.PI / 4; break; // Up-Left
            case 9: angle = -Math.PI / 4; break;     // Up-Right
            case 1: angle = 3 * Math.PI / 4; break; // Down-Left
            case 3: angle = Math.PI / 4; break;     // Down-Right
        }
        
        context.save();
        context.translate(centerX, centerY);
        context.rotate(angle);
        
        // Draw enhanced arrow with glow effect for high levels
        if (level > 2) {
            context.shadowColor = getChargeLevelColor(level);
            context.shadowBlur = 5;
        }
        
        context.beginPath();
        context.moveTo(-arrowSize, -arrowSize / 2);
        context.lineTo(arrowSize, 0);
        context.lineTo(-arrowSize, arrowSize / 2);
        context.closePath();
        
        context.fillStyle = level > 1 ? getChargeLevelColor(level) : '#FFD700';
        context.fill();
        context.strokeStyle = '#000000';
        context.lineWidth = 1;
        context.stroke();
        
        context.restore();
    };
    
    Game_Player.prototype.hideChargeIndicator = function() {
        if (chargeIndicator && chargeIndicator.parent) {
            chargeIndicator.parent.removeChild(chargeIndicator);
        }
        chargeIndicator = null;
    };
    
    Game_Player.prototype.getJumpDirection = function() {
        if (!enableDirectional) return 0;
        
        let direction = 0;
        
        // Check for directional input combinations (Arrow Keys, WASD, and Controller)
        const up = Input.isPressed('up') || (enableWASD && Input.isPressed('w')) || 
                  (enableController && this.getControllerDirection().up);
        const down = Input.isPressed('down') || (enableWASD && Input.isPressed('s')) || 
                    (enableController && this.getControllerDirection().down);
        const left = Input.isPressed('left') || (enableWASD && Input.isPressed('a')) || 
                    (enableController && this.getControllerDirection().left);
        const right = Input.isPressed('right') || (enableWASD && Input.isPressed('d')) || 
                     (enableController && this.getControllerDirection().right);
        
        // Determine direction based on key combinations
        if (up && left) {
            direction = 7; // Up-Left
        } else if (up && right) {
            direction = 9; // Up-Right
        } else if (down && left) {
            direction = 1; // Down-Left
        } else if (down && right) {
            direction = 3; // Down-Right
        } else if (up) {
            direction = 8; // Up
        } else if (down) {
            direction = 2; // Down
        } else if (left) {
            direction = 4; // Left
        } else if (right) {
            direction = 6; // Right
        }
        
        return direction;
    };
    
    Game_Player.prototype.getControllerDirection = function() {
        // Get controller stick input for directional jumping
        const stick = Input._getControllerStick();
        if (!stick) return { up: false, down: false, left: false, right: false };
        
        const threshold = 0.5; // Sensitivity threshold for stick input
        return {
            up: stick.y < -threshold,
            down: stick.y > threshold,
            left: stick.x < -threshold,
            right: stick.x > threshold
        };
    };
    
    Game_Player.prototype.canPartyJump = function() {
        return (
            jumpCooldown <= 0 &&
            !isJumping &&
            !$gameMessage.isBusy() &&
            !$gamePlayer.isMoving() &&
            $gameSystem.isMenuEnabled() &&
            !$gameMap.isEventRunning() &&
            $gameMap.mapId() > 0
        );
    };
    
    Game_Player.prototype.executePartyJump = function(direction = 0, distance = 0, height = jumpHeight, level = 0) {
        isJumping = true;
        jumpCooldown = cooldownFrames;
        
        const actualDistance = direction !== 0 ? distance : 0;
        
        // Play enhanced sound effect based on power level
        if (enableSound && jumpSound) {
            try {
                let pitchVariation = jumpPitch;
                let volumeBoost = jumpVolume;
                
                // Enhance audio for higher levels
                if (level > 0) {
                    pitchVariation += (level * 5); // Higher pitch for more power
                    volumeBoost = Math.min(100, jumpVolume + (level * 3));
                }
                
                if (direction !== 0) {
                    pitchVariation += (Math.random() - 0.5) * 10; // Less variation for charged jumps
                }
                
                const audio = {
                    name: jumpSound,
                    volume: volumeBoost,
                    pitch: Math.max(50, Math.min(150, pitchVariation)),
                    pan: 0
                };
                AudioManager.playSe(audio);
            } catch (e) {
                console.warn('PartyJump: Could not play sound effect:', jumpSound);
            }
        }
        
        // Make all visible party members jump with enhanced parameters
        this.startPartyJump(direction, actualDistance, height);
        
        // Make followers jump with same enhanced parameters
        $gamePlayer._followers._data.forEach(follower => {
            if (follower.isVisible()) {
                follower.startPartyJump(direction, actualDistance, height);
            }
        });
        
        // Adjust reset time based on jump height (higher jumps take longer)
        const adjustedDuration = jumpDuration * (1 + (height - jumpHeight) / jumpHeight * 0.5);
        setTimeout(() => {
            isJumping = false;
        }, adjustedDuration * 16.67); // Convert frames to milliseconds
    };
    
    //=============================================================================
    // Game_Follower - Enhanced for Party Jump
    //=============================================================================
    
    const _Game_Follower_update = Game_Follower.prototype.update;
    Game_Follower.prototype.update = function() {
        _Game_Follower_update.call(this);
        this.updatePartyJump();
    };
    
    //=============================================================================
    // Input Enhancement - Enhanced Key and Controller Support
    //=============================================================================
    
    const _Input_onKeyDown = Input._onKeyDown;
    Input._onKeyDown = function(event) {
        _Input_onKeyDown.call(this, event);
        
        // Add space key support
        if (event.keyCode === 32) { // Space key
            Input._currentState['space'] = true;
        }
        
        // Add WASD support if enabled
        if (enableWASD) {
            switch (event.keyCode) {
                case 87: // W key
                    Input._currentState['w'] = true;
                    break;
                case 65: // A key
                    Input._currentState['a'] = true;
                    break;
                case 83: // S key
                    Input._currentState['s'] = true;
                    break;
                case 68: // D key
                    Input._currentState['d'] = true;
                    break;
            }
        }
    };
    
    const _Input_onKeyUp = Input._onKeyUp;
    Input._onKeyUp = function(event) {
        _Input_onKeyUp.call(this, event);
        
        // Remove space key support
        if (event.keyCode === 32) { // Space key
            Input._currentState['space'] = false;
        }
        
        // Remove WASD support if enabled
        if (enableWASD) {
            switch (event.keyCode) {
                case 87: // W key
                    Input._currentState['w'] = false;
                    break;
                case 65: // A key
                    Input._currentState['a'] = false;
                    break;
                case 83: // S key
                    Input._currentState['s'] = false;
                    break;
                case 68: // D key
                    Input._currentState['d'] = false;
                    break;
            }
        }
    };
    
    // Enhanced controller support
    const _Input_updateGamepadState = Input._updateGamepadState;
    Input._updateGamepadState = function(gamepad) {
        _Input_updateGamepadState.call(this, gamepad);
        
        if (enableController && gamepad) {
            // L3 button (Left Stick Press) - typically button 10
            const l3Button = gamepad.buttons[10];
            if (l3Button) {
                Input._currentState['l3'] = l3Button.pressed;
            }
            
            // Store stick values for directional detection
            this._leftStick = {
                x: gamepad.axes[0] || 0,
                y: gamepad.axes[1] || 0
            };
        }
    };
    
    // Helper method to get controller stick input
    Input._getControllerStick = function() {
        return this._leftStick || { x: 0, y: 0 };
    };
    
    //=============================================================================
    // Plugin Command Support
    //=============================================================================
    
    PluginManager.registerCommand(pluginName, "partyJump", args => {
        if ($gamePlayer.canPartyJump()) {
            const direction = parseInt(args.direction) || 0;
            $gamePlayer.executePartyJump(direction);
        }
    });
    
    PluginManager.registerCommand(pluginName, "directionalJump", args => {
        if ($gamePlayer.canPartyJump()) {
            const direction = parseInt(args.direction) || 0;
            $gamePlayer.executePartyJump(direction);
        }
    });
    
    PluginManager.registerCommand(pluginName, "setCooldown", args => {
        const frames = parseInt(args.frames) || 0;
        jumpCooldown = Math.max(0, frames);
    });
    
    //=============================================================================
    // Scene_Map Integration
    //=============================================================================
    
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        
        // Reset jump states on new map
        isJumping = false;
        jumpCooldown = 0;
        isCharging = false;
        chargedDirection = 0;
        chargeLevel = 0;
        chargeSoundPlaying = false;
        if (chargeIndicator) {
            $gamePlayer.hideChargeIndicator();
        }
    };
    
    //=============================================================================
    // Save Data Integration
    //=============================================================================
    
    const _Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
    Game_System.prototype.onAfterLoad = function() {
        if (_Game_System_onAfterLoad) _Game_System_onAfterLoad.call(this);
        
        // Reset jump states after loading
        isJumping = false;
        jumpCooldown = 0;
        isCharging = false;
        chargedDirection = 0;
        chargeLevel = 0;
        chargeSoundPlaying = false;
        if (chargeIndicator) {
            $gamePlayer.hideChargeIndicator();
        }
    };
    
    //=============================================================================
    // Debug Information
    //=============================================================================
    
    if ($dataSystem && $dataSystem.optDisplayTp) {
        console.log(`%c[${pluginName}] %cSuccessfully loaded!`, 
                   'color: #4CAF50; font-weight: bold;', 
                   'color: #2196F3;');
        console.log(`%c[${pluginName}] %cControls: Hold SPACE or L3 to charge, release to jump!`, 
                   'color: #4CAF50; font-weight: bold;', 
                   'color: #FF9800;');
        console.log(`%c[${pluginName}] %cHold direction keys while charging for directional jumps!`, 
                   'color: #4CAF50; font-weight: bold;', 
                   'color: #FF9800;');
        
        if (enableWASD) {
            console.log(`%c[${pluginName}] %cWASD support enabled!`, 
                       'color: #4CAF50; font-weight: bold;', 
                       'color: #9C27B0;');
        }
        
        if (enableController) {
            console.log(`%c[${pluginName}] %cController support enabled (L3 + Left Stick)!`, 
                       'color: #4CAF50; font-weight: bold;', 
                       'color: #2196F3;');
        }
    }
    
})();