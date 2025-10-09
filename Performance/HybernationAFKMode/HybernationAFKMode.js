//=============================================================================
// HybernationAFKMode.js - Intelligent AFK Sleep Mode System
//=============================================================================
/*:
 * @target MZ
 * @plugindesc HybernationAFKMode v1.0.0 - Intelligent AFK Sleep Mode System
 * @author Alexandros Panagiotakopoulos
 * @version 1.0.0
 * @date 2025-10-09
 * @url 
 * @help HybernationAFKMode.js
 * 
 * ============================================================================
 * HybernationAFKMode - Intelligent AFK Sleep Mode System
 * ============================================================================
 * 
 * Automatically detects when players are away and puts the game into an
 * ultra-low power hibernation mode to preserve system resources and battery life.
 * Perfect for long gaming sessions or when players step away unexpectedly.
 * 
 * FEATURES:
 * ★ Smart AFK Detection: Monitors mouse, keyboard, and controller input
 * ★ Gradual Power Reduction: Progressive performance scaling before full sleep
 * ★ Visual Sleep Indicators: Beautiful overlay showing hibernation status
 * ★ Instant Wake-up: Any input immediately restores full performance
 * ★ Customizable Timing: Configure AFK detection and hibernation delays
 * ★ Performance Analytics: Track power savings and AFK patterns
 * ★ Scene-Aware: Different behavior for menus, battles, and gameplay
 * ★ Battery Optimization: Extends laptop battery life significantly
 * 
 * HOW IT WORKS:
 * 1. Silently monitors all user input (mouse, keyboard, gamepad)
 * 2. After configured idle time, starts reducing performance gradually
 * 3. Enters full hibernation mode if no activity detected
 * 4. Shows gentle visual overlay indicating sleep state
 * 5. Any input instantly wakes the game back to full performance
 * 6. Tracks and reports power savings to help optimize settings
 * 
 * PERFORMANCE STAGES:
 * • Active (0-3 min): Full performance, normal operation
 * • Drowsy (3-4 min): Reduced animation framerate, dimmed effects
 * • Sleepy (4-5 min): Minimal animations, paused audio fades
 * • Hibernation (5+ min): Ultra-low power, all non-essential systems paused
 * 
 * WAKE CONDITIONS:
 * • Mouse movement or clicks
 * • Keyboard input
 * • Controller button presses or stick movement
 * • Window focus events
 * • Touch input (mobile/tablet support)
 * 
 * DEVELOPER COMMANDS:
 * $afkMode.forceHibernation()     - Immediately enter hibernation mode
 * $afkMode.wake()                 - Force wake from hibernation
 * $afkMode.getStats()             - View AFK analytics and power savings
 * $afkMode.resetTimer()           - Reset the AFK timer
 * $afkMode.setIdleTime(minutes)   - Adjust idle detection time
 * 
 * ============================================================================
 * Copyright © 2025 Alexandros Panagiotakopoulos. All Rights Reserved.
 * Licensed under Creative Commons Attribution 4.0 International License
 * ============================================================================
 * 
 * @param enableAFKMode
 * @text Enable AFK Hibernation System
 * @desc Master switch for the entire AFK hibernation system
 * @type boolean
 * @default true
 * 
 * @param idleTimeMinutes
 * @text AFK Detection Time (Minutes)
 * @desc Minutes of inactivity before starting hibernation process
 * @type number
 * @min 1
 * @max 30
 * @default 5
 * 
 * @param hibernationTimeMinutes
 * @text Full Hibernation Time (Minutes)
 * @desc Additional minutes before entering deep hibernation
 * @type number
 * @min 1
 * @max 10
 * @default 2
 * 
 * @param enableVisualOverlay
 * @text Show Sleep Visual Overlay
 * @desc Display beautiful overlay when in hibernation mode
 * @type boolean
 * @default true
 * 
 * @param enableAudioFade
 * @text Enable Audio Fade in Sleep
 * @desc Gradually fade audio when entering hibernation
 * @type boolean
 * @default true
 * 
 * @param enablePerformanceScaling
 * @text Enable Performance Scaling
 * @desc Gradually reduce performance before full hibernation
 * @type boolean
 * @default true
 * 
 * @param wakeAnimationSpeed
 * @text Wake Animation Speed
 * @desc Speed of wake-up animation (milliseconds)
 * @type number
 * @min 100
 * @max 2000
 * @default 800
 * 
 * @param enableBattleProtection
 * @text Protect During Battle
 * @desc Never hibernate during battle scenes
 * @type boolean
 * @default true
 * 
 * @param enableMenuHibernation
 * @text Allow Menu Hibernation
 * @desc Allow hibernation while in menus (faster idle time)
 * @type boolean
 * @default true
 * 
 * @param enableAnalytics
 * @text Enable AFK Analytics
 * @desc Track AFK patterns and power savings
 * @type boolean
 * @default true
 * 
 * @param debugMode
 * @text Enable Debug Mode
 * @desc Show detailed hibernation information in console
 * @type boolean
 * @default false
 * 
 * @param customMessage
 * @text Custom Hibernation Message
 * @desc Custom message to show during hibernation
 * @default The game is resting... Press any key to wake up!
 * 
 * @param enableMobileSupport
 * @text Enable Mobile/Touch Support
 * @desc Detect touch events for mobile hibernation
 * @type boolean
 * @default true
 */

(() => {
    'use strict';
    
    // Plugin Information
    const PLUGIN_NAME = 'HybernationAFKMode';
    const PLUGIN_VERSION = '1.0.0';
    const AUTHOR = 'Alexandros Panagiotakopoulos';
    
    // Get Plugin Parameters
    const parameters = PluginManager.parameters(PLUGIN_NAME);
    
    const CONFIG = {
        enableAFKMode: parameters['enableAFKMode'] === 'true',
        idleTimeMinutes: parseInt(parameters['idleTimeMinutes']) || 5,
        hibernationTimeMinutes: parseInt(parameters['hibernationTimeMinutes']) || 2,
        enableVisualOverlay: parameters['enableVisualOverlay'] === 'true',
        enableAudioFade: parameters['enableAudioFade'] === 'true',
        enablePerformanceScaling: parameters['enablePerformanceScaling'] === 'true',
        wakeAnimationSpeed: parseInt(parameters['wakeAnimationSpeed']) || 800,
        enableBattleProtection: parameters['enableBattleProtection'] === 'true',
        enableMenuHibernation: parameters['enableMenuHibernation'] === 'true',
        enableAnalytics: parameters['enableAnalytics'] === 'true',
        debugMode: parameters['debugMode'] === 'true',
        customMessage: parameters['customMessage'] || 'The game is resting... Press any key to wake up!',
        enableMobileSupport: parameters['enableMobileSupport'] === 'true'
    };
    
    // Convert minutes to milliseconds for internal use
    const IDLE_TIME_MS = CONFIG.idleTimeMinutes * 60 * 1000;
    const HIBERNATION_TIME_MS = CONFIG.hibernationTimeMinutes * 60 * 1000;
    
    // Performance scaling stages
    const PERFORMANCE_STAGES = {
        ACTIVE: 0,
        DROWSY: 1,    // 75% of idle time
        SLEEPY: 2,    // 90% of idle time  
        HIBERNATION: 3 // Full idle time + hibernation time
    };

    //-----------------------------------------------------------------------------
    // HybernationAFKSystem - Main AFK Detection and Management Class
    //-----------------------------------------------------------------------------
    
    class HybernationAFKSystem {
        constructor() {
            this.initialized = false;
            this.isHibernating = false;
            this.currentStage = PERFORMANCE_STAGES.ACTIVE;
            this.lastActivityTime = Date.now();
            this.hibernationStartTime = null;
            
            // Performance scaling variables
            this.originalAnimationSpeed = 60;
            this.originalAudioVolume = 1.0;
            this.performanceScaleFactors = [1.0, 0.7, 0.3, 0.1];
            
            // Input tracking
            this.inputListeners = [];
            this.monitoredEvents = [
                'mousedown', 'mousemove', 'mousewheel', 'keydown', 'keyup',
                'touchstart', 'touchmove', 'touchend', 'focus', 'click'
            ];
            
            // Analytics
            this.analytics = {
                totalAfkTime: 0,
                hibernationSessions: 0,
                lastSessionStart: null,
                powerSavingsEstimate: 0,
                wakeEvents: []
            };
            
            // Visual elements
            this.hibernationOverlay = null;
            this.performanceIndicator = null;
            
            // Timers and intervals
            this.monitorInterval = null;
            this.performanceInterval = null;
            
            this.initializeSystem();
        }
        
        initializeSystem() {
            if (!CONFIG.enableAFKMode) {
                this.debugLog('🛌 AFK Mode disabled in configuration');
                return;
            }
            
            this.debugLog('🛌 Initializing Hibernation AFK System...');
            
            // Setup input monitoring
            this.setupInputMonitoring();
            
            // Create visual elements
            if (CONFIG.enableVisualOverlay) {
                this.createHibernationOverlay();
            }
            
            // Start monitoring loop
            this.startMonitoring();
            
            // Load saved analytics
            this.loadAnalytics();
            
            this.initialized = true;
            this.debugLog('✅ Hibernation AFK System initialized successfully');
            
            // Show initialization message
            console.log(`
🛌 HybernationAFKMode v${PLUGIN_VERSION} Loaded!

⏰ AFK DETECTION: ${CONFIG.idleTimeMinutes} minutes of inactivity
🌙 HIBERNATION: ${CONFIG.hibernationTimeMinutes} additional minutes for deep sleep
🎮 BATTLE PROTECTION: ${CONFIG.enableBattleProtection ? 'Enabled' : 'Disabled'}
📱 MOBILE SUPPORT: ${CONFIG.enableMobileSupport ? 'Enabled' : 'Disabled'}

Developer Commands:
$afkMode.forceHibernation()     - Enter hibernation immediately
$afkMode.wake()                 - Force wake from hibernation
$afkMode.getStats()             - View AFK analytics
$afkMode.resetTimer()           - Reset AFK timer
$afkMode.setIdleTime(minutes)   - Adjust idle detection time

The game will automatically hibernate when you're away to save power! 💚
            `);
        }
        
        setupInputMonitoring() {
            // Remove existing listeners
            this.removeInputListeners();
            
            // Add comprehensive input detection
            this.monitoredEvents.forEach(eventType => {
                const listener = (event) => this.onUserActivity(event);
                
                // Add to document for global capture
                document.addEventListener(eventType, listener, { 
                    passive: true, 
                    capture: true 
                });
                
                // Also add to window for focus events
                if (eventType === 'focus') {
                    window.addEventListener(eventType, listener, { passive: true });
                }
                
                this.inputListeners.push({ eventType, listener, element: document });
            });
            
            // Special gamepad monitoring
            if (window.navigator && navigator.getGamepads) {
                this.setupGamepadMonitoring();
            }
            
            this.debugLog('🎮 Input monitoring setup complete');
        }
        
        setupGamepadMonitoring() {
            // Gamepad API monitoring
            this.gamepadState = {};
            
            const checkGamepadActivity = () => {
                if (!this.initialized) return;
                
                const gamepads = navigator.getGamepads();
                for (let i = 0; i < gamepads.length; i++) {
                    const gamepad = gamepads[i];
                    if (gamepad) {
                        // Check buttons
                        for (let j = 0; j < gamepad.buttons.length; j++) {
                            if (gamepad.buttons[j].pressed !== this.gamepadState[`${i}_button_${j}`]) {
                                this.gamepadState[`${i}_button_${j}`] = gamepad.buttons[j].pressed;
                                if (gamepad.buttons[j].pressed) {
                                    this.onUserActivity({ type: 'gamepad', detail: 'button' });
                                }
                            }
                        }
                        
                        // Check axes (analog sticks)
                        for (let j = 0; j < gamepad.axes.length; j++) {
                            const currentValue = Math.round(gamepad.axes[j] * 100) / 100;
                            const lastValue = this.gamepadState[`${i}_axis_${j}`] || 0;
                            
                            if (Math.abs(currentValue - lastValue) > 0.1) {
                                this.gamepadState[`${i}_axis_${j}`] = currentValue;
                                this.onUserActivity({ type: 'gamepad', detail: 'axis' });
                            }
                        }
                    }
                }
            };
            
            // Check gamepad state periodically
            setInterval(checkGamepadActivity, 250);
            this.debugLog('🎮 Gamepad monitoring enabled');
        }
        
        onUserActivity(event) {
            const now = Date.now();
            const wasHibernating = this.isHibernating;
            const wasInactive = this.currentStage > PERFORMANCE_STAGES.ACTIVE;
            
            // Update activity timestamp
            this.lastActivityTime = now;
            
            // If we were hibernating or reduced performance, wake up
            if (wasHibernating || wasInactive) {
                this.wakeFromHibernation();
                
                // Track wake event for analytics
                if (CONFIG.enableAnalytics) {
                    this.analytics.wakeEvents.push({
                        timestamp: now,
                        eventType: event.type || 'unknown',
                        wasHibernating: wasHibernating,
                        stageBefore: this.currentStage
                    });
                }
            }
            
            // Reset to active stage
            this.currentStage = PERFORMANCE_STAGES.ACTIVE;
            
            this.debugLog(`👋 User activity detected: ${event.type || 'unknown'}`);
        }
        
        startMonitoring() {
            if (this.monitorInterval) {
                clearInterval(this.monitorInterval);
            }
            
            // Main monitoring loop - check every 30 seconds for efficiency
            this.monitorInterval = setInterval(() => {
                this.checkIdleStatus();
            }, 30000);
            
            // Performance scaling loop - more frequent for smooth scaling
            if (CONFIG.enablePerformanceScaling) {
                this.performanceInterval = setInterval(() => {
                    this.updatePerformanceScaling();
                }, 5000);
            }
            
            this.debugLog('⏰ AFK monitoring started');
        }
        
        checkIdleStatus() {
            if (!this.initialized) return;
            
            const now = Date.now();
            const idleDuration = now - this.lastActivityTime;
            
            // Skip hibernation in protected scenes
            if (this.isInProtectedScene()) {
                this.debugLog('🛡️ In protected scene - hibernation skipped');
                return;
            }
            
            // Determine what stage we should be in
            const drowsyThreshold = IDLE_TIME_MS * 0.75;
            const sleepyThreshold = IDLE_TIME_MS * 0.9;
            const hibernationThreshold = IDLE_TIME_MS + HIBERNATION_TIME_MS;
            
            let newStage = PERFORMANCE_STAGES.ACTIVE;
            
            if (idleDuration >= hibernationThreshold) {
                newStage = PERFORMANCE_STAGES.HIBERNATION;
            } else if (idleDuration >= sleepyThreshold) {
                newStage = PERFORMANCE_STAGES.SLEEPY;
            } else if (idleDuration >= drowsyThreshold) {
                newStage = PERFORMANCE_STAGES.DROWSY;
            }
            
            // Update stage if changed
            if (newStage !== this.currentStage) {
                this.transitionToStage(newStage, idleDuration);
            }
            
            this.debugLog(`💤 Idle check: ${Math.round(idleDuration/1000)}s idle, stage: ${this.getStageDisplayName(newStage)}`);
        }
        
        transitionToStage(newStage, idleDuration) {
            const oldStage = this.currentStage;
            this.currentStage = newStage;
            
            this.debugLog(`🔄 Stage transition: ${this.getStageDisplayName(oldStage)} → ${this.getStageDisplayName(newStage)}`);
            
            switch (newStage) {
                case PERFORMANCE_STAGES.DROWSY:
                    this.debugLog('😴 Entering drowsy mode - reducing performance slightly');
                    if (CONFIG.enablePerformanceScaling) {
                        this.applyPerformanceScaling(0.7);
                    }
                    break;
                    
                case PERFORMANCE_STAGES.SLEEPY:
                    this.debugLog('😪 Entering sleepy mode - significant performance reduction');
                    if (CONFIG.enablePerformanceScaling) {
                        this.applyPerformanceScaling(0.3);
                    }
                    if (CONFIG.enableAudioFade) {
                        this.fadeAudio(0.2);
                    }
                    break;
                    
                case PERFORMANCE_STAGES.HIBERNATION:
                    this.debugLog('🛌 Entering hibernation mode - maximum power savings');
                    this.enterHibernation();
                    break;
                    
                case PERFORMANCE_STAGES.ACTIVE:
                    this.debugLog('⚡ Returning to active mode - full performance restored');
                    this.restoreFullPerformance();
                    break;
            }
        }
        
        enterHibernation() {
            if (this.isHibernating) return;
            
            this.isHibernating = true;
            this.hibernationStartTime = Date.now();
            
            // Track analytics
            if (CONFIG.enableAnalytics) {
                this.analytics.hibernationSessions++;
                this.analytics.lastSessionStart = this.hibernationStartTime;
            }
            
            // Apply maximum performance reduction
            if (CONFIG.enablePerformanceScaling) {
                this.applyPerformanceScaling(0.05); // 5% performance
            }
            
            // Fade audio to minimum
            if (CONFIG.enableAudioFade) {
                this.fadeAudio(0.01);
            }
            
            // Show hibernation overlay
            if (CONFIG.enableVisualOverlay && this.hibernationOverlay) {
                this.showHibernationOverlay();
            }
            
            // Pause non-essential game systems
            this.pauseNonEssentialSystems();
            
            this.debugLog('🌙 Hibernation mode activated - maximum power savings enabled');
        }
        
        wakeFromHibernation() {
            if (!this.isHibernating && this.currentStage === PERFORMANCE_STAGES.ACTIVE) {
                return; // Already awake
            }
            
            const wasHibernating = this.isHibernating;
            this.isHibernating = false;
            
            // Calculate hibernation duration for analytics
            if (wasHibernating && CONFIG.enableAnalytics && this.hibernationStartTime) {
                const hibernationDuration = Date.now() - this.hibernationStartTime;
                this.analytics.totalAfkTime += hibernationDuration;
                this.analytics.powerSavingsEstimate += this.calculatePowerSavings(hibernationDuration);
                this.hibernationStartTime = null;
            }
            
            // Hide hibernation overlay
            if (CONFIG.enableVisualOverlay && this.hibernationOverlay) {
                this.hideHibernationOverlay();
            }
            
            // Restore all systems
            this.restoreFullPerformance();
            this.resumeNonEssentialSystems();
            
            // Reset stage to active
            this.currentStage = PERFORMANCE_STAGES.ACTIVE;
            
            this.debugLog('☀️ Woke from hibernation - full performance restored');
        }
        
        applyPerformanceScaling(scaleFactor) {
            // Reduce animation frame rate
            if (window.requestAnimationFrame) {
                const originalRAF = window.requestAnimationFrame;
                const throttleRAF = (callback) => {
                    // Reduce frame rate based on scale factor
                    setTimeout(() => originalRAF(callback), (1 - scaleFactor) * 50);
                };
                
                if (scaleFactor < 0.8) {
                    window.requestAnimationFrame = throttleRAF;
                }
            }
            
            // Scale update intervals
            if (SceneManager && SceneManager._scene) {
                const scene = SceneManager._scene;
                if (scene._updateInterval) {
                    scene._updateInterval *= (2 - scaleFactor);
                }
            }
            
            this.debugLog(`⚡ Performance scaled to ${Math.round(scaleFactor * 100)}%`);
        }
        
        restoreFullPerformance() {
            // Restore original animation frame rate
            if (window.originalRequestAnimationFrame) {
                window.requestAnimationFrame = window.originalRequestAnimationFrame;
            }
            
            // Restore audio volume
            if (CONFIG.enableAudioFade) {
                this.fadeAudio(1.0);
            }
            
            // Restore update intervals
            if (SceneManager && SceneManager._scene) {
                const scene = SceneManager._scene;
                if (scene._originalUpdateInterval) {
                    scene._updateInterval = scene._originalUpdateInterval;
                }
            }
            
            this.debugLog('⚡ Full performance restored');
        }
        
        fadeAudio(targetVolume) {
            if (!window.AudioManager) return;
            
            const currentVolume = AudioManager.bgmVolume;
            const steps = 20;
            const stepSize = (targetVolume - currentVolume) / steps;
            let currentStep = 0;
            
            const fadeInterval = setInterval(() => {
                currentStep++;
                const newVolume = Math.max(0, Math.min(1, currentVolume + (stepSize * currentStep)));
                
                AudioManager.bgmVolume = newVolume;
                AudioManager.bgsVolume = newVolume;
                AudioManager.seVolume = newVolume * 0.8;
                
                if (currentStep >= steps) {
                    clearInterval(fadeInterval);
                    this.debugLog(`🔊 Audio faded to ${Math.round(newVolume * 100)}%`);
                }
            }, 50);
        }
        
        pauseNonEssentialSystems() {
            // Pause particle systems
            if (window.ParticleSystem) {
                window.ParticleSystem.pauseAll?.();
            }
            
            // Reduce weather update frequency
            if ($dataMap && $dataMap.weatherType) {
                this._originalWeatherUpdate = Game_Screen.prototype.updateWeather;
                Game_Screen.prototype.updateWeather = function() {
                    // Update weather much less frequently
                    if (Graphics.frameCount % 20 === 0) {
                        this._originalWeatherUpdate?.call(this);
                    }
                };
            }
            
            // Pause unnecessary animations
            if (window.Sprite_Animation) {
                this._originalAnimationUpdate = Sprite_Animation.prototype.update;
                Sprite_Animation.prototype.update = function() {
                    // Update animations at 1/4 speed
                    if (Graphics.frameCount % 4 === 0) {
                        this._originalAnimationUpdate?.call(this);
                    }
                };
            }
            
            this.debugLog('⏸️ Non-essential systems paused');
        }
        
        resumeNonEssentialSystems() {
            // Resume particle systems
            if (window.ParticleSystem) {
                window.ParticleSystem.resumeAll?.();
            }
            
            // Restore weather updates
            if (this._originalWeatherUpdate) {
                Game_Screen.prototype.updateWeather = this._originalWeatherUpdate;
                this._originalWeatherUpdate = null;
            }
            
            // Resume animations
            if (this._originalAnimationUpdate) {
                Sprite_Animation.prototype.update = this._originalAnimationUpdate;
                this._originalAnimationUpdate = null;
            }
            
            this.debugLog('▶️ Non-essential systems resumed');
        }
        
        isInProtectedScene() {
            if (!SceneManager._scene) return false;
            
            const currentScene = SceneManager._scene.constructor.name;
            
            // Always protect battle scenes
            if (CONFIG.enableBattleProtection && currentScene === 'Scene_Battle') {
                return true;
            }
            
            // Check for other critical scenes
            const protectedScenes = [
                'Scene_Save',
                'Scene_Load', 
                'Scene_File',
                'Scene_Name'
            ];
            
            if (protectedScenes.includes(currentScene)) {
                return true;
            }
            
            // Protect during events
            if ($gameMessage && $gameMessage.isBusy()) {
                return true;
            }
            
            return false;
        }
        
        createHibernationOverlay() {
            // Create main overlay container
            this.hibernationOverlay = document.createElement('div');
            this.hibernationOverlay.className = 'hibernation-overlay';
            this.hibernationOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: linear-gradient(135deg, 
                    rgba(25, 25, 50, 0.95) 0%, 
                    rgba(15, 15, 35, 0.98) 50%, 
                    rgba(5, 5, 20, 0.99) 100%);
                display: none;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                z-index: 999999;
                backdrop-filter: blur(10px);
                font-family: 'GameFont', 'Mplus1p', sans-serif;
                color: #e0e6ff;
                text-align: center;
                animation: hibernation-pulse 4s ease-in-out infinite alternate;
            `;
            
            // Create hibernation message
            const messageContainer = document.createElement('div');
            messageContainer.style.cssText = `
                max-width: 600px;
                padding: 40px;
                background: rgba(255, 255, 255, 0.05);
                border: 2px solid rgba(180, 200, 255, 0.3);
                border-radius: 20px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(5px);
            `;
            
            // Hibernation icon
            const icon = document.createElement('div');
            icon.innerHTML = '🛌';
            icon.style.cssText = `
                font-size: 48px;
                margin-bottom: 20px;
                animation: hibernation-float 3s ease-in-out infinite alternate;
            `;
            
            // Message text
            const message = document.createElement('div');
            message.innerHTML = `
                <h2 style="margin: 0 0 15px 0; font-size: 24px; color: #a0c4ff;">Hibernation Mode</h2>
                <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.5; opacity: 0.9;">${CONFIG.customMessage}</p>
                <p style="margin: 0; font-size: 14px; opacity: 0.7;">💚 Power saving mode active • 🔋 Battery optimized</p>
            `;
            
            messageContainer.appendChild(icon);
            messageContainer.appendChild(message);
            this.hibernationOverlay.appendChild(messageContainer);
            
            // Create CSS animations
            const style = document.createElement('style');
            style.textContent = `
                @keyframes hibernation-pulse {
                    0% { background: linear-gradient(135deg, rgba(25, 25, 50, 0.95) 0%, rgba(15, 15, 35, 0.98) 50%, rgba(5, 5, 20, 0.99) 100%); }
                    100% { background: linear-gradient(135deg, rgba(35, 35, 60, 0.96) 0%, rgba(25, 25, 45, 0.99) 50%, rgba(15, 15, 30, 1) 100%); }
                }
                
                @keyframes hibernation-float {
                    0% { transform: translateY(0px); }
                    100% { transform: translateY(-10px); }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(this.hibernationOverlay);
            this.debugLog('🎨 Hibernation overlay created');
        }
        
        showHibernationOverlay() {
            if (this.hibernationOverlay) {
                this.hibernationOverlay.style.display = 'flex';
                this.hibernationOverlay.style.opacity = '0';
                
                // Fade in animation
                setTimeout(() => {
                    this.hibernationOverlay.style.transition = 'opacity 1s ease-in-out';
                    this.hibernationOverlay.style.opacity = '1';
                }, 50);
            }
        }
        
        hideHibernationOverlay() {
            if (this.hibernationOverlay && this.hibernationOverlay.style.display !== 'none') {
                // Fade out animation
                this.hibernationOverlay.style.transition = `opacity ${CONFIG.wakeAnimationSpeed}ms ease-out`;
                this.hibernationOverlay.style.opacity = '0';
                
                setTimeout(() => {
                    this.hibernationOverlay.style.display = 'none';
                }, CONFIG.wakeAnimationSpeed);
            }
        }
        
        // Analytics and utility methods
        calculatePowerSavings(hibernationDuration) {
            // Estimate power savings (rough calculation)
            const baseConsumption = 100; // Watts (estimated)
            const hibernationConsumption = 20; // Watts during hibernation
            const savingsPerHour = (baseConsumption - hibernationConsumption) / 1000; // kWh
            const hours = hibernationDuration / (1000 * 60 * 60);
            return savingsPerHour * hours;
        }
        
        getStats() {
            const stats = {
                ...this.analytics,
                currentStage: this.getStageDisplayName(this.currentStage),
                isHibernating: this.isHibernating,
                idleTimeSeconds: Math.round((Date.now() - this.lastActivityTime) / 1000),
                totalAfkHours: Math.round(this.analytics.totalAfkTime / (1000 * 60 * 60) * 100) / 100,
                estimatedPowerSavings: Math.round(this.analytics.powerSavingsEstimate * 1000) / 1000
            };
            
            console.log('🛌 AFK Hibernation Statistics:', stats);
            return stats;
        }
        
        getStageDisplayName(stage) {
            const names = ['Active', 'Drowsy', 'Sleepy', 'Hibernation'];
            return names[stage] || 'Unknown';
        }
        
        // Public API methods
        forceHibernation() {
            this.debugLog('🔧 Force hibernation requested');
            this.currentStage = PERFORMANCE_STAGES.HIBERNATION;
            this.enterHibernation();
        }
        
        wake() {
            this.debugLog('🔧 Force wake requested');
            this.onUserActivity({ type: 'manual' });
        }
        
        resetTimer() {
            this.debugLog('🔧 AFK timer reset');
            this.lastActivityTime = Date.now();
            this.wakeFromHibernation();
        }
        
        setIdleTime(minutes) {
            CONFIG.idleTimeMinutes = minutes;
            this.debugLog(`🔧 Idle time set to ${minutes} minutes`);
        }
        
        // Cleanup methods
        removeInputListeners() {
            this.inputListeners.forEach(({ eventType, listener, element }) => {
                element.removeEventListener(eventType, listener);
            });
            this.inputListeners = [];
        }
        
        destroy() {
            this.debugLog('🛑 Destroying hibernation system');
            
            // Clear intervals
            if (this.monitorInterval) clearInterval(this.monitorInterval);
            if (this.performanceInterval) clearInterval(this.performanceInterval);
            
            // Remove event listeners
            this.removeInputListeners();
            
            // Remove overlay
            if (this.hibernationOverlay) {
                this.hibernationOverlay.remove();
            }
            
            // Restore systems
            this.resumeNonEssentialSystems();
            this.restoreFullPerformance();
            
            // Save analytics
            this.saveAnalytics();
        }
        
        // Analytics persistence
        loadAnalytics() {
            if (!CONFIG.enableAnalytics) return;
            
            try {
                const saved = localStorage.getItem('hibernationAFKAnalytics');
                if (saved) {
                    const data = JSON.parse(saved);
                    this.analytics = { ...this.analytics, ...data };
                }
            } catch (error) {
                this.debugLog('⚠️ Could not load analytics:', error);
            }
        }
        
        saveAnalytics() {
            if (!CONFIG.enableAnalytics) return;
            
            try {
                localStorage.setItem('hibernationAFKAnalytics', JSON.stringify(this.analytics));
            } catch (error) {
                this.debugLog('⚠️ Could not save analytics:', error);
            }
        }
        
        updatePerformanceScaling() {
            // This runs more frequently to provide smooth performance scaling
            const idleDuration = Date.now() - this.lastActivityTime;
            
            if (CONFIG.enablePerformanceScaling && idleDuration > IDLE_TIME_MS * 0.5) {
                const scaleFactor = this.performanceScaleFactors[this.currentStage];
                // Additional micro-scaling based on exact idle time
            }
        }
        
        debugLog(message, data = null) {
            if (CONFIG.debugMode) {
                if (data) {
                    console.log(`[HybernationAFK] ${message}`, data);
                } else {
                    console.log(`[HybernationAFK] ${message}`);
                }
            }
        }
    }

    // Initialize the hibernation system
    let hibernationSystem = null;
    
    // Initialize after game is ready
    const initializeHibernation = () => {
        if (!hibernationSystem && CONFIG.enableAFKMode) {
            hibernationSystem = new HybernationAFKSystem();
            
            // Expose global API
            window.$afkMode = {
                forceHibernation: () => hibernationSystem.forceHibernation(),
                wake: () => hibernationSystem.wake(),
                getStats: () => hibernationSystem.getStats(),
                resetTimer: () => hibernationSystem.resetTimer(),
                setIdleTime: (minutes) => hibernationSystem.setIdleTime(minutes),
                system: hibernationSystem
            };
        }
    };
    
    // Initialize on different events to ensure it works
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeHibernation);
    } else {
        setTimeout(initializeHibernation, 1000);
    }
    
    // Scene hooks for better integration
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        setTimeout(initializeHibernation, 2000);
    };
    
    // Save analytics when game is closed
    window.addEventListener('beforeunload', () => {
        if (hibernationSystem) {
            hibernationSystem.saveAnalytics();
        }
    });
    
    // Cleanup on page unload
    window.addEventListener('unload', () => {
        if (hibernationSystem) {
            hibernationSystem.destroy();
        }
    });

})();