//=============================================================================
// TimeSystem.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.0.1] Time System with Day/Night Cycle
@author Alexandros Panagiotakopoulos
@url alexandrospanag.github.io
@help TimeSystem.js

@param timeSpeed
@text Time Speed
@desc How many real seconds equal 1 in-game minute (default: 1)
@type number
@min 0.1
@max 60
@decimals 1
@default 1

@param startHour
@text Starting Hour
@desc What hour the game starts at (0-23)
@type number
@min 0
@max 23
@default 6

@param startMinute
@text Starting Minute
@desc What minute the game starts at (0-59)
@type number
@min 0
@max 59
@default 0

@param consoleLogging
@text Enable Console Logging
@desc Show time updates in developer console
@type boolean
@default true

@param consoleLogInterval
@text Console Log Interval
@desc How often to log time to console (in game minutes)
@type number
@min 1
@max 60
@default 10

@param showTimeDisplay
@text Show Time Display
@desc Show permanent time display in top-left corner
@type boolean
@default true

@param timeDisplayX
@text Time Display X Position
@desc X position of the time display
@type number
@min 0
@max 2000
@default 10

@param timeDisplayY
@text Time Display Y Position
@desc Y position of the time display
@type number
@min 0
@max 2000
@default 10

@param enableTinting
@text Enable Screen Tinting
@desc Enable automatic screen tinting based on time of day
@type boolean
@default true

@param dawnHour
@text Dawn Hour
@desc Hour when dawn begins (0-23)
@type number
@min 0
@max 23
@default 6

@param dayHour
@text Day Hour
@desc Hour when full day begins (0-23)
@type number
@min 0
@max 23
@default 8

@param duskHour
@text Dusk Hour
@desc Hour when dusk begins (0-23)
@type number
@min 0
@max 23
@default 18

@param nightHour
@text Night Hour
@desc Hour when full night begins (0-23)
@type number
@min 0
@max 23
@default 20

@command showTimeDisplay
@text Toggle Time Display
@desc Toggle the permanent time display on/off

@command testTimeSystem
@text Test Time System
@desc Run a quick test of the time system functionality

@command logCurrentTime
@text Log Current Time
@desc Immediately log the current time to console

@command showTime
@text Show Time Window
@desc Shows the current time in a window

@command setTime
@text Set Time
@desc Sets the current time
@arg hours
@text Hours
@type number
@min 0
@max 23
@default 12
@arg minutes
@text Minutes
@type number
@min 0
@max 59
@default 0

@command toggleTimeFlow
@text Toggle Time Flow
@desc Starts or stops time progression

This plugin creates a real-time day/night cycle system for RPG Maker MZ.

Features:
- Configurable time speed
- Automatic screen tinting based on time of day
- Script calls for advanced users
- Plugin commands for easy event control

Script Calls:
$gameTime.getHours() - Returns current hour (0-23)
$gameTime.getMinutes() - Returns current minute (0-59)
$gameTime.getTimeString() - Returns formatted time string
$gameTime.setTime(hours, minutes) - Sets the time
$gameTime.start() - Starts time progression
$gameTime.stop() - Stops time progression
$gameTime.isDay() - Returns true if daytime
$gameTime.isNight() - Returns true if nighttime
$gameTime.showTimeDisplay() - Shows permanent time display
$gameTime.hideTimeDisplay() - Hides permanent time display

*/

(() => {
    'use strict';
    
    // Add immediate debug functions for testing
    window.testTimeSystemTint = function() {
        console.log('🧪 === TIME SYSTEM TINT TEST ===');
        console.log('Checking basic tint functionality...');
        
        if (!$gameScreen) {
            console.log('❌ $gameScreen not available - must be on map scene');
            return false;
        }
        
        console.log('✅ $gameScreen available');
        console.log(`Current tone: [${$gameScreen._tone.join(', ')}]`);
        
        // Test direct tint
        console.log('🎨 Testing direct red tint...');
        $gameScreen.startTint([200, 0, 0, 0], 60);
        
        setTimeout(() => {
            console.log(`Tone after red: [${$gameScreen._tone.join(', ')}]`);
            
            // Test blue tint
            console.log('🎨 Testing direct blue tint...');
            $gameScreen.startTint([0, 0, 200, 0], 60);
            
            setTimeout(() => {
                console.log(`Tone after blue: [${$gameScreen._tone.join(', ')}]`);
                
                // Reset
                console.log('🎨 Resetting to normal...');
                $gameScreen.startTint([0, 0, 0, 0], 60);
                
                console.log('🧪 Basic tint test complete - if you saw color changes, tinting works!');
            }, 1000);
        }, 1000);
        
        return true;
    };
    
    window.testTimeSystemParams = function() {
        console.log('🔧 === TIME SYSTEM PARAMETER TEST ===');
        const pluginName = 'TimeSystem';
        const parameters = PluginManager.parameters(pluginName);
        
        console.log('Plugin name:', pluginName);
        console.log('Raw parameters:', parameters);
        console.log('enableTinting raw:', parameters['enableTinting']);
        console.log('enableTinting processed:', parameters['enableTinting'] === 'true');
        console.log('$gameTime available:', typeof $gameTime);
        
        if ($gameTime && $gameTime.updateScreenTint) {
            console.log('🎨 Testing $gameTime.updateScreenTint(true)...');
            $gameTime.updateScreenTint(true);
        }
        
        return parameters;
    };
    
    console.log('[TimeSystem] Debug functions added: testTimeSystemTint() and testTimeSystemParams()');
    
    const pluginName = 'TimeSystem'; // Fixed to match the actual filename
    const parameters = PluginManager.parameters(pluginName);
    
    // Debug: Log the raw parameters to see what's actually loaded
    console.log(`[TimeSystem] Plugin Name: ${pluginName}`);
    console.log(`[TimeSystem] Raw Parameters:`, parameters);
    console.log(`[TimeSystem] Raw enableTinting value: "${parameters['enableTinting']}" (type: ${typeof parameters['enableTinting']})`);
    
    const timeSpeed = parseFloat(parameters['timeSpeed'] || 1);
    const startHour = parseInt(parameters['startHour'] || 6);
    const startMinute = parseInt(parameters['startMinute'] || 0);
    const consoleLogging = parameters['consoleLogging'] === 'true';
    const consoleLogInterval = parseInt(parameters['consoleLogInterval'] || 10);
    const showTimeDisplay = parameters['showTimeDisplay'] === 'true';
    const timeDisplayX = parseInt(parameters['timeDisplayX'] || 10);
    const timeDisplayY = parseInt(parameters['timeDisplayY'] || 10);
    const enableTinting = parameters['enableTinting'] === 'true';
    const dawnHour = parseInt(parameters['dawnHour'] || 6);
    const dayHour = parseInt(parameters['dayHour'] || 8);
    const duskHour = parseInt(parameters['duskHour'] || 18);
    const nightHour = parseInt(parameters['nightHour'] || 20);
    
    // Debug: Log the processed parameters
    console.log(`[TimeSystem] Processed enableTinting: ${enableTinting}`);
    console.log(`[TimeSystem] Processed consoleLogging: ${consoleLogging}`);
    console.log(`[TimeSystem] Processed showTimeDisplay: ${showTimeDisplay}`);

    //-----------------------------------------------------------------------------
    // Game_Time
    //-----------------------------------------------------------------------------
    
    class Game_Time {
        constructor() {
            this.initialize();
        }
        
        initialize() {
            this._hours = startHour;
            this._minutes = startMinute;
            this._seconds = 0;
            this._realTimeCounter = 0;
            this._running = true;
            this._lastTintTime = -1;
            this._lastLoggedMinute = -1;
            this._currentTint = [0, 0, 0, 0]; // Track current intended tint
            this._tintEnforcer = null; // For continuous tint monitoring
            
            if (consoleLogging) {
                console.log(`[TimeSystem] Time system initialized at ${this.getTimeString()} (${this.getTimeOfDay()})`);
            }
            
            // Force initial screen tint application
            setTimeout(() => {
                this.updateScreenTint(true);
                this.startTintEnforcer(); // Start continuous tint monitoring
            }, 100);
        }
        
        update() {
            if (!this._running) return;
            
            this._realTimeCounter += 1/60; // 60 FPS
            
            if (this._realTimeCounter >= timeSpeed) {
                this._realTimeCounter = 0;
                this.addMinute();
                this.updateScreenTint();
            }
        }
        
        addMinute() {
            this._minutes++;
            if (this._minutes >= 60) {
                this._minutes = 0;
                this._hours++;
                if (this._hours >= 24) {
                    this._hours = 0;
                    if (consoleLogging) {
                        console.log(`[TimeSystem] New day started! Time: ${this.getTimeString()}`);
                    }
                }
            }
            
            // Console logging at specified intervals
            if (consoleLogging) {
                const currentMinute = this._hours * 60 + this._minutes;
                if (this._lastLoggedMinute === -1 || 
                    (currentMinute - this._lastLoggedMinute) >= consoleLogInterval ||
                    (currentMinute < this._lastLoggedMinute && currentMinute >= consoleLogInterval)) { // Handle day rollover
                    
                    this._lastLoggedMinute = currentMinute;
                    const timeOfDay = this.getTimeOfDay();
                    const emoji = this.getTimeEmoji();
                    console.log(`[TimeSystem] ${emoji} Time: ${this.getTimeString()} | Period: ${timeOfDay} | Running: ${this._running}`);
                }
            }
        }
        
        setTime(hours, minutes) {
            this._hours = Math.max(0, Math.min(23, hours));
            this._minutes = Math.max(0, Math.min(59, minutes));
            this._seconds = 0;
            this._realTimeCounter = 0;
            this.updateScreenTint(true); // Force update when manually setting time
            
            if (consoleLogging) {
                console.log(`[TimeSystem] Time manually set to ${this.getTimeString()} (${this.getTimeOfDay()})`);
            }
        }
        
        getHours() {
            return this._hours;
        }
        
        getMinutes() {
            return this._minutes;
        }
        
        getTimeString() {
            const h = this._hours.toString().padStart(2, '0');
            const m = this._minutes.toString().padStart(2, '0');
            return `${h}:${m}`;
        }
        
        start() {
            this._running = true;
            if (consoleLogging) {
                console.log(`[TimeSystem] ▶️ Time progression started at ${this.getTimeString()}`);
            }
        }
        
        stop() {
            this._running = false;
            if (consoleLogging) {
                console.log(`[TimeSystem] ⏸️ Time progression stopped at ${this.getTimeString()}`);
            }
        }
        
        isRunning() {
            return this._running;
        }
        
        getTimeOfDay() {
            if (this._hours >= nightHour || this._hours < dawnHour) {
                return 'night';
            } else if (this._hours >= dawnHour && this._hours < dayHour) {
                return 'dawn';
            } else if (this._hours >= dayHour && this._hours < duskHour) {
                return 'day';
            } else {
                return 'dusk';
            }
        }
        
        getTimeEmoji() {
            const timeOfDay = this.getTimeOfDay();
            switch (timeOfDay) {
                case 'night': return '🌙';
                case 'dawn': return '🌅';
                case 'day': return '☀️';
                case 'dusk': return '🌇';
                default: return '⏰';
            }
        }
        
        isDay() {
            const timeOfDay = this.getTimeOfDay();
            return timeOfDay === 'day' || timeOfDay === 'dawn';
        }
        
        isNight() {
            const timeOfDay = this.getTimeOfDay();
            return timeOfDay === 'night' || timeOfDay === 'dusk';
        }
        
        updateScreenTint(force = false) {
            console.log(`[TimeSystem] 🎨 updateScreenTint called - force: ${force}, enableTinting: ${enableTinting}`);
            
            if (!enableTinting) {
                console.log(`[TimeSystem] 🚫 Tinting disabled in parameters`);
                return;
            }
            
            if (!$gameScreen) {
                console.log(`[TimeSystem] 🚫 $gameScreen not available`);
                return;
            }
            
            const currentHour = this._hours;
            const timeOfDay = this.getTimeOfDay();
            
            console.log(`[TimeSystem] 🕐 Current time: ${this.getTimeString()} (${timeOfDay}), hour: ${currentHour}, lastTintTime: ${this._lastTintTime}`);
            
            // Only skip if same hour AND not forced AND not first initialization
            if (!force && currentHour === this._lastTintTime && this._lastTintTime !== -1) {
                console.log(`[TimeSystem] ⏭️ Skipping tint update - same hour and not forced`);
                return;
            }
            
            this._lastTintTime = currentHour;
            let tint = [0, 0, 0, 0]; // [Red, Green, Blue, Gray]
            
            switch (timeOfDay) {
                case 'night':
                    tint = [-50, -50, 20, 60]; // Subtle night tint (darker, slightly blue)
                    break;
                case 'dawn':
                    tint = [30, 15, -30, 20]; // Gentle dawn tint (warm, soft)
                    break;
                case 'day':
                    tint = [0, 0, 0, 0]; // No tint
                    break;
                case 'dusk':
                    tint = [40, 15, -40, 30]; // Gentle dusk tint (warm, orange)
                    break;
            }
            
            console.log(`[TimeSystem] 🎨 Applying ${timeOfDay} tint: [${tint.join(', ')}]`);
            console.log(`[TimeSystem] 🎨 Current screen tone before: [${$gameScreen._tone.join(', ')}]`);
            
            $gameScreen.startTint(tint, 120); // 2-second transition
            this._currentTint = [...tint]; // Store the current intended tint
            
            // Log the result after a short delay
            setTimeout(() => {
                console.log(`[TimeSystem] 🎨 Screen tone after tint: [${$gameScreen._tone.join(', ')}]`);
            }, 200);
        }
        
        // Start continuous tint monitoring to prevent other systems from overriding
        startTintEnforcer() {
            if (this._tintEnforcer) {
                clearInterval(this._tintEnforcer);
            }
            
            this._tintEnforcer = setInterval(() => {
                if (!enableTinting || !$gameScreen || !this._currentTint) return;
                
                const currentTone = $gameScreen._tone;
                const expectedTint = this._currentTint;
                
                // Check if tint has been changed by another system
                const tintMatches = expectedTint.every((value, index) => Math.abs(currentTone[index] - value) < 5);
                
                if (!tintMatches) {
                    if (consoleLogging) {
                        console.log(`[TimeSystem] 🔧 Tint overridden detected - reapplying ${this.getTimeOfDay()} tint`);
                    }
                    $gameScreen.startTint(expectedTint, 30); // Quick re-application
                }
            }, 2000); // Check every 2 seconds
        }
        
        // Stop tint enforcer
        stopTintEnforcer() {
            if (this._tintEnforcer) {
                clearInterval(this._tintEnforcer);
                this._tintEnforcer = null;
            }
        }
        
        makeEmpty() {
            return {
                hours: this._hours,
                minutes: this._minutes,
                seconds: this._seconds,
                realTimeCounter: this._realTimeCounter,
                running: this._running,
                lastTintTime: this._lastTintTime
            };
        }
        
        makeEmptyObject() {
            return this.makeEmpty();
        }
        
        extractSaveContents(contents) {
            this._hours = contents.hours || startHour;
            this._minutes = contents.minutes || startMinute;
            this._seconds = contents.seconds || 0;
            this._realTimeCounter = contents.realTimeCounter || 0;
            this._running = contents.running !== undefined ? contents.running : true;
            this._lastTintTime = contents.lastTintTime || -1;
        }
        
        showTimeDisplay() {
            const scene = SceneManager._scene;
            if (!scene) return;
            
            // Remove existing display first
            this.hideTimeDisplay();
            
            if (showTimeDisplay && scene.constructor === Scene_Map) {
                scene._timeDisplayWindow = new Window_TimeDisplay();
                scene.addWindow(scene._timeDisplayWindow);
            }
        }
        
        hideTimeDisplay() {
            const scene = SceneManager._scene;
            if (scene && scene._timeDisplayWindow) {
                scene.removeChild(scene._timeDisplayWindow);
                scene._timeDisplayWindow = null;
            }
        }
    }

    //-----------------------------------------------------------------------------
    // Window_TimeDisplay - Permanent time display
    //-----------------------------------------------------------------------------
    
    class Window_TimeDisplay extends Window_Base {
        constructor() {
            const rect = new Rectangle(timeDisplayX, timeDisplayY, 140, 72);
            super(rect);
            this.opacity = 180; // Semi-transparent background
            this.contentsOpacity = 255; // Full opacity text
            this._refreshCounter = 0;
            this.refresh();
        }
        
        refresh() {
            if (this.contents) {
                this.contents.clear();
            }
            if (!window.$gameTime) {
                if (this.contents) {
                    this.drawText("--:--", 4, 0, this.innerWidth - 8, 'left');
                }
                return;
            }
            
            const timeString = window.$gameTime.getTimeString();
            const timeOfDay = window.$gameTime.getTimeOfDay();
            
            // Draw time
            this.changeTextColor(ColorManager.normalColor());
            this.drawText(timeString, 4, 0, this.innerWidth - 8, 'left');
            
            // Draw time of day with color coding
            let color;
            switch (timeOfDay) {
                case 'night':
                    color = ColorManager.textColor(3); // Blue
                    break;
                case 'dawn':
                    color = ColorManager.textColor(17); // Orange
                    break;
                case 'day':
                    color = ColorManager.textColor(0); // White/Normal
                    break;
                case 'dusk':
                    color = ColorManager.textColor(14); // Yellow
                    break;
                default:
                    color = ColorManager.normalColor();
            }
            
            this.changeTextColor(color);
            const timeOfDayText = timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);
            this.drawText(timeOfDayText, 4, this.lineHeight(), this.innerWidth - 8, 'left');
        }
        
        update() {
            super.update();
            this._refreshCounter++;
            // Update display every 30 frames (half second) for smooth updates
            if (this._refreshCounter >= 30) {
                this._refreshCounter = 0;
                this.refresh();
            }
        }
    }

    //-----------------------------------------------------------------------------
    // Window_Time
    //-----------------------------------------------------------------------------
    
    class Window_Time extends Window_Base {
        constructor(rect) {
            super(rect);
            this.refresh();
        }
        
        refresh() {
            this.contents.clear();
            if (!window.$gameTime) {
                this.drawText("Time: --:--", 0, 0, this.innerWidth, 'center');
                this.drawText("Unknown", 0, this.lineHeight(), this.innerWidth, 'center');
                return;
            }
            
            const timeString = window.$gameTime.getTimeString();
            const timeOfDay = window.$gameTime.getTimeOfDay();
            const timeOfDayText = timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);
            
            this.drawText(timeString, 0, 0, this.innerWidth, 'center');
            this.drawText(timeOfDayText, 0, this.lineHeight(), this.innerWidth, 'center');
        }
        
        update() {
            super.update();
            if (Graphics.frameCount % 60 === 0) { // Update every second
                this.refresh();
            }
        }
    }

    //-----------------------------------------------------------------------------
    // Plugin Commands
    //-----------------------------------------------------------------------------
    
    PluginManager.registerCommand(pluginName, "testTimeSystem", args => {
        console.log("=== TIME SYSTEM TEST START ===");
        
        if (!window.$gameTime) {
            console.log("[TimeSystem] ❌ $gameTime is not initialized!");
            window.$gameTime = new Game_Time();
            console.log("[TimeSystem] ✅ Created new $gameTime instance");
        }
        
        console.log(`[TimeSystem] 📊 Current Status:`);
        console.log(`  Time: ${window.$gameTime.getTimeString()}`);
        console.log(`  Period: ${window.$gameTime.getTimeOfDay()}`);
        console.log(`  Running: ${window.$gameTime.isRunning()}`);
        console.log(`  Real Counter: ${window.$gameTime._realTimeCounter}`);
        
        // Test time progression
        console.log("[TimeSystem] 🧪 Testing time progression...");
        const startTime = window.$gameTime.getTimeString();
        window.$gameTime.addMinute();
        const endTime = window.$gameTime.getTimeString();
        console.log(`  Before: ${startTime} → After: ${endTime}`);
        
        // Test screen tinting
        if (enableTinting) {
            console.log("[TimeSystem] 🎨 Testing screen tinting...");
            window.$gameTime.updateScreenTint();
        }
        
        console.log("=== TIME SYSTEM TEST END ===");
        $gameMessage.add("Time system test completed - check console!");
    });
    
    PluginManager.registerCommand(pluginName, "logCurrentTime", args => {
        if (!window.$gameTime) {
            console.log("[TimeSystem] ❌ $gameTime is not initialized yet!");
            return;
        }
        const emoji = window.$gameTime.getTimeEmoji();
        const timeString = window.$gameTime.getTimeString();
        const timeOfDay = window.$gameTime.getTimeOfDay();
        const running = window.$gameTime.isRunning() ? "Running" : "Stopped";
        
        console.log(`[TimeSystem] ${emoji} CURRENT TIME: ${timeString} | Period: ${timeOfDay} | Status: ${running}`);
    });
    
    PluginManager.registerCommand(pluginName, "showTimeDisplay", args => {
        if (!window.$gameTime) {
            window.$gameTime = new Game_Time();
        }
        const scene = SceneManager._scene;
        if (scene && scene._timeDisplayWindow) {
            // Toggle off
            window.$gameTime.hideTimeDisplay();
            $gameMessage.add("Time display hidden");
        } else {
            // Toggle on
            window.$gameTime.showTimeDisplay();
            $gameMessage.add("Time display shown");
        }
    });
    
    PluginManager.registerCommand(pluginName, "showTime", args => {
        if (!window.$gameTime) {
            window.$gameTime = new Game_Time();
        }
        const rect = new Rectangle(Graphics.boxWidth - 200, 50, 180, 96);
        const timeWindow = new Window_Time(rect);
        SceneManager._scene.addChild(timeWindow);
        
        setTimeout(() => {
            SceneManager._scene.removeChild(timeWindow);
        }, 3000); // Show for 3 seconds
    });
    
    PluginManager.registerCommand(pluginName, "setTime", args => {
        if (!window.$gameTime) {
            window.$gameTime = new Game_Time();
        }
        const hours = parseInt(args.hours || 12);
        const minutes = parseInt(args.minutes || 0);
        window.$gameTime.setTime(hours, minutes);
    });
    
    PluginManager.registerCommand(pluginName, "toggleTimeFlow", args => {
        if (!window.$gameTime) {
            window.$gameTime = new Game_Time();
        }
        if (window.$gameTime.isRunning()) {
            window.$gameTime.stop();
        } else {
            window.$gameTime.start();
        }
    });

    //-----------------------------------------------------------------------------
    // Game Integration
    //-----------------------------------------------------------------------------
    
    // Initialize $gameTime immediately
    window.$gameTime = null;
    
    // Create global game time object
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        if (!window.$gameTime) {
            window.$gameTime = new Game_Time();
            console.log("[TimeSystem] ✅ $gameTime created in Scene_Boot.start()");
        }
    };
    
    // Ensure $gameTime exists when creating a new game
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        window.$gameTime = new Game_Time();
    };
    
    // Update time system
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        if (window.$gameTime) {
            window.$gameTime.update();
        }
    };
    
    // Show time display when entering map
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        // Delay to ensure scene is fully loaded
        setTimeout(() => {
            if (window.$gameTime && showTimeDisplay) {
                window.$gameTime.showTimeDisplay();
            }
            // Force screen tint update when entering map scene
            if (window.$gameTime) {
                window.$gameTime.updateScreenTint(true);
                if (consoleLogging) {
                    console.log(`[TimeSystem] 🎨 Scene_Map started - applying screen tint for ${window.$gameTime.getTimeOfDay()}`);
                }
            }
        }, 500);
    };
    
    // Also try adding display when scene is created
    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        // Add time display window
        if (window.$gameTime && showTimeDisplay) {
            setTimeout(() => {
                window.$gameTime.showTimeDisplay();
            }, 100);
        }
    };
    
    // Alternative approach - add to spriteset
    const _Spriteset_Map_createLowerLayer = Spriteset_Map.prototype.createLowerLayer;
    Spriteset_Map.prototype.createLowerLayer = function() {
        _Spriteset_Map_createLowerLayer.call(this);
        this.createTimeDisplay();
    };
    
    Spriteset_Map.prototype.createTimeDisplay = function() {
        if (showTimeDisplay && window.$gameTime) {
            this._timeDisplayWindow = new Window_TimeDisplay();
            this.addChild(this._timeDisplayWindow);
        }
    };
    
    // Clean up time display when leaving map
    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        if (window.$gameTime) {
            window.$gameTime.hideTimeDisplay();
        }
        _Scene_Map_terminate.call(this);
    };
    
    // Also update in other scenes to keep time flowing
    const _Scene_Menu_update = Scene_Menu.prototype.update;
    Scene_Menu.prototype.update = function() {
        _Scene_Menu_update.call(this);
        if (window.$gameTime) {
            window.$gameTime.update();
        }
    };
    
    // Save/Load integration
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.gameTime = window.$gameTime ? window.$gameTime.makeEmpty() : null;
        return contents;
    };
    
    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        if (contents.gameTime) {
            if (!window.$gameTime) {
                window.$gameTime = new Game_Time();
            }
            window.$gameTime.extractSaveContents(contents.gameTime);
        }
    };
    
    // Initialize time system on new game
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        if (!window.$gameTime) {
            window.$gameTime = new Game_Time();
        }
        window.$gameTime.initialize();
        // Delay screen tint update to ensure game screen is ready
        setTimeout(() => {
            if (window.$gameTime) {
                window.$gameTime.updateScreenTint();
            }
        }, 100);
    };

    // Make plugin parameters available to debug functions
    window.TimeSystemParams = {
        timeSpeed,
        startHour,
        startMinute,
        consoleLogging,
        consoleLogInterval,
        showTimeDisplay,
        timeDisplayX,
        timeDisplayY,
        enableTinting,
        dawnHour,
        dayHour,
        duskHour,
        nightHour
    };

})();

//=============================================================================
// Developer Console Commands
// These can be run directly in the browser console for testing
//=============================================================================

window.TimeSystemDebug = {
    // Check plugin parameters
    checkParams: function() {
        console.log("🔧 === PLUGIN PARAMETERS CHECK ===");
        console.log("🔧 Available plugin parameter sets:");
        
        // Check all available plugin parameter sets
        const pluginNames = ['TimeSystem', 'time', 'Time System', 'TimeSystem.js'];
        pluginNames.forEach(name => {
            const params = PluginManager.parameters(name);
            if (Object.keys(params).length > 0) {
                console.log(`✅ Found parameters for "${name}":`, params);
            } else {
                console.log(`❌ No parameters found for "${name}"`);
            }
        });
        
        if (!window.TimeSystemParams) {
            console.log("❌ TimeSystemParams not available!");
            return false;
        }
        
        console.log("✅ Plugin parameters loaded:");
        Object.entries(window.TimeSystemParams).forEach(([key, value]) => {
            console.log(`   • ${key}: ${value}`);
        });
        return true;
    },
    
    // Speed up time by X hours
    speedUpHours: function(hours) {
        if (!window.$gameTime) {
            console.log("❌ $gameTime not initialized!");
            return false;
        }
        
        console.log(`⏩ Speeding up time by ${hours} hour(s)...`);
        const startTime = window.$gameTime.getTimeString();
        const startPeriod = window.$gameTime.getTimeOfDay();
        
        // Speed up time
        for (let i = 0; i < hours; i++) {
            for (let j = 0; j < 60; j++) {
                window.$gameTime.addMinute();
            }
        }
        
        const endTime = window.$gameTime.getTimeString();
        const endPeriod = window.$gameTime.getTimeOfDay();
        
        console.log(`🕐 Time: ${startTime} (${startPeriod}) → ${endTime} (${endPeriod})`);
        
        // Force screen tint update
        window.$gameTime.updateScreenTint(true);
        
        // Additional verification
        setTimeout(() => {
            if ($gameScreen && $gameScreen._tone) {
                console.log(`🎨 Current screen tone: [${$gameScreen._tone.join(', ')}]`);
                console.log(`🎨 Expected tint for ${endPeriod} period`);
            }
        }, 500);
        
        return true;
    },
    
    // Speed up time by X minutes
    speedUpMinutes: function(minutes) {
        if (!window.$gameTime) {
            console.log("❌ $gameTime not initialized!");
            return;
        }
        console.log(`⏩ Speeding up time by ${minutes} minute(s)...`);
        const startTime = window.$gameTime.getTimeString();
        
        for (let i = 0; i < minutes; i++) {
            window.$gameTime.addMinute();
        }
        
        const endTime = window.$gameTime.getTimeString();
        console.log(`🕐 Time changed from ${startTime} to ${endTime}`);
        window.$gameTime.updateScreenTint();
    },
    
    // Get current time info
    getTimeInfo: function() {
        if (!window.$gameTime) {
            console.log("❌ $gameTime not initialized!");
            return;
        }
        
        const emoji = window.$gameTime.getTimeEmoji();
        const timeString = window.$gameTime.getTimeString();
        const timeOfDay = window.$gameTime.getTimeOfDay();
        const running = window.$gameTime.isRunning();
        
        console.log(`${emoji} Current Time: ${timeString}`);
        console.log(`📅 Time Period: ${timeOfDay}`);
        console.log(`⚙️ System Running: ${running}`);
        console.log(`🔄 Real Time Counter: ${window.$gameTime._realTimeCounter.toFixed(2)}`);
    },
    
    // Set specific time
    setTime: function(hours, minutes = 0) {
        if (!window.$gameTime) {
            console.log("❌ $gameTime not initialized!");
            return;
        }
        
        window.$gameTime.setTime(hours, minutes);
        console.log(`🕐 Time set to ${window.$gameTime.getTimeString()} (${window.$gameTime.getTimeOfDay()})`);
    },
    
    // Toggle time progression
    toggle: function() {
        if (!window.$gameTime) {
            console.log("❌ $gameTime not initialized!");
            return;
        }
        
        if (window.$gameTime.isRunning()) {
            window.$gameTime.stop();
            console.log("⏸️ Time progression stopped");
        } else {
            window.$gameTime.start();
            console.log("▶️ Time progression started");
        }
    },
    
    // Test automatic screen tinting system
    testAutoTinting: function() {
        if (!window.$gameTime) {
            console.log("❌ $gameTime not initialized!");
            return;
        }
        
        console.log("🔧 COMPREHENSIVE SCREEN TINTING DEBUG:");
        console.log("=====================================");
        
        // Check plugin parameters
        console.log(`🔧 enableTinting parameter: ${window.TimeSystemParams?.enableTinting ?? 'undefined'}`);
        console.log(`🔧 timeSpeed: ${window.TimeSystemParams?.timeSpeed ?? 'undefined'}`);
        console.log(`🔧 consoleLogging: ${window.TimeSystemParams?.consoleLogging ?? 'undefined'}`);
        
        // Check game objects
        console.log(`🔧 $gameScreen exists: ${!!$gameScreen}`);
        console.log(`🔧 SceneManager._scene: ${SceneManager._scene ? SceneManager._scene.constructor.name : 'null'}`);
        
        if ($gameScreen) {
            console.log(`🔧 $gameScreen._tone: [${$gameScreen._tone ? $gameScreen._tone.join(', ') : 'null'}]`);
            console.log(`🔧 $gameScreen.startTint function: ${typeof $gameScreen.startTint}`);
        }
        
        // Check time system
        console.log(`⏰ Current time: ${window.$gameTime.getTimeString()}`);
        console.log(`🌅 Current period: ${window.$gameTime.getTimeOfDay()}`);
        console.log(`🔄 Time running: ${window.$gameTime.isRunning()}`);
        console.log(`🔧 _lastTintTime: ${window.$gameTime._lastTintTime}`);
        
        // Try to force a tint update with detailed logging
        console.log("🔧 Attempting forced tint update...");
        
        // Temporarily enable console logging for this test
        const originalLogging = consoleLogging;
        if (window.consoleLogging !== undefined) {
            window.consoleLogging = true;
        }
        
        try {
            window.$gameTime.updateScreenTint(true);
            console.log("✅ updateScreenTint call completed");
        } catch (error) {
            console.log(`❌ Error in updateScreenTint: ${error.message}`);
            console.log(error);
        }
        
        // Restore original logging setting
        if (window.consoleLogging !== undefined) {
            window.consoleLogging = originalLogging;
        }
        
        console.log("🔧 Debug completed - check above for issues");
    },
    
    // Full system diagnostic - checks everything
    fullDiagnostic: function() {
        console.log("🔍 === FULL SYSTEM DIAGNOSTIC ===");
        console.log("================================");
        
        // 1. Check basic initialization
        console.log("1️⃣ CHECKING INITIALIZATION:");
        console.log(`   • $gameTime exists: ${!!window.$gameTime}`);
        console.log(`   • $gameScreen exists: ${!!$gameScreen}`);
        console.log(`   • Current scene: ${SceneManager._scene ? SceneManager._scene.constructor.name : 'none'}`);
        
        if (!window.$gameTime) {
            console.log("❌ CRITICAL: $gameTime not initialized!");
            console.log("💡 Try starting a new game or entering the map");
            return false;
        }
        
        // 2. Check time system
        console.log("2️⃣ CHECKING TIME SYSTEM:");
        console.log(`   • Current time: ${window.$gameTime.getTimeString()}`);
        console.log(`   • Current period: ${window.$gameTime.getTimeOfDay()}`);
        console.log(`   • Time running: ${window.$gameTime.isRunning()}`);
        console.log(`   • Last tint time: ${window.$gameTime._lastTintTime}`);
        
        // 3. Check tinting settings
        console.log("3️⃣ CHECKING TINTING SETTINGS:");
        console.log(`   • enableTinting: ${window.TimeSystemParams?.enableTinting ?? 'undefined'}`);
        console.log(`   • consoleLogging: ${window.TimeSystemParams?.consoleLogging ?? 'undefined'}`);
        
        if (!window.TimeSystemParams?.enableTinting) {
            console.log("❌ PROBLEM: Screen tinting is disabled in plugin parameters!");
            console.log("💡 Enable 'Enable Screen Tinting' in Plugin Manager");
            return false;
        }
        
        // 4. Check screen system
        if ($gameScreen) {
            console.log("4️⃣ CHECKING SCREEN SYSTEM:");
            console.log(`   • Current tone: [${$gameScreen._tone.join(', ')}]`);
            console.log(`   • startTint function: ${typeof $gameScreen.startTint}`);
            console.log(`   • Tint enforcer running: ${!!window.$gameTime._tintEnforcer}`);
        }
        
        // 5. Run live test
        console.log("5️⃣ RUNNING LIVE TEST:");
        console.log("   • Attempting to apply test tint...");
        
        if ($gameScreen) {
            const originalTone = [...$gameScreen._tone];
            $gameScreen.startTint([100, 100, 0, 0], 60); // Yellow tint
            
            setTimeout(() => {
                const newTone = $gameScreen._tone;
                const changed = !originalTone.every((val, i) => val === newTone[i]);
                
                console.log(`   • Original tone: [${originalTone.join(', ')}]`);
                console.log(`   • New tone: [${newTone.join(', ')}]`);
                console.log(`   • Tint changed: ${changed ? '✅ YES' : '❌ NO'}`);
                
                if (!changed) {
                    console.log("❌ PROBLEM: Screen tinting is not working at all!");
                    console.log("💡 Possible causes:");
                    console.log("   - Not on map scene (must be on game map)");
                    console.log("   - Another plugin is overriding tints");
                    console.log("   - RPG Maker MZ version incompatibility");
                } else {
                    console.log("✅ Basic screen tinting works!");
                    console.log("💡 Testing time-based tinting...");
                    window.$gameTime.updateScreenTint(true);
                }
                
                // Restore original tint
                setTimeout(() => {
                    $gameScreen.startTint(originalTone, 30);
                }, 1000);
            }, 200);
        }
        
        console.log("🔍 Diagnostic completed - check results above");
        return true;
    },
    
    // Direct tint test - bypasses all our logic
    directTintTest: function() {
        console.log("🧪 DIRECT TINT TEST - Bypassing all plugin logic");
        console.log("===============================================");
        
        if (!$gameScreen) {
            console.log("❌ $gameScreen is not available!");
            console.log("🔧 Make sure you're on the map scene (not in menus)");
            return;
        }
        
        console.log("✅ $gameScreen is available");
        console.log(`🔧 Current tone: [${$gameScreen._tone ? $gameScreen._tone.join(', ') : 'no tone'}]`);
        
        // Test 1: Try a very obvious red tint
        console.log("🧪 Test 1: Applying strong red tint [200, 0, 0, 0]");
        try {
            $gameScreen.startTint([200, 0, 0, 0], 60);
            console.log("✅ Red tint command executed");
            
            setTimeout(() => {
                console.log(`🔧 Tone after red tint: [${$gameScreen._tone.join(', ')}]`);
                
                // Test 2: Try a blue tint
                console.log("🧪 Test 2: Applying strong blue tint [0, 0, 200, 0]");
                $gameScreen.startTint([0, 0, 200, 0], 60);
                
                setTimeout(() => {
                    console.log(`🔧 Tone after blue tint: [${$gameScreen._tone.join(', ')}]`);
                    
                    // Test 3: Try night tint
                    console.log("🧪 Test 3: Applying night tint [-100, -100, 0, 100]");
                    $gameScreen.startTint([-100, -100, 0, 100], 60);
                    
                    setTimeout(() => {
                        console.log(`🔧 Tone after night tint: [${$gameScreen._tone.join(', ')}]`);
                        console.log("🧪 If you see tone changes but no visual effect, there might be another tint system overriding ours");
                    }, 100);
                }, 100);
            }, 100);
            
        } catch (error) {
            console.log(`❌ Error applying tint: ${error.message}`);
            console.log(error);
        }
    },
    
    // Test the tint enforcer system
    testTintEnforcer: function() {
        console.log("🔧 TESTING TINT ENFORCER SYSTEM");
        console.log("==============================");
        
        if (!window.$gameTime) {
            console.log("❌ $gameTime not available");
            return;
        }
        
        // Apply a test tint
        console.log("🧪 Step 1: Applying night tint via enforcer");
        window.$gameTime.updateScreenTint(true);
        
        setTimeout(() => {
            console.log(`🔧 Current intended tint: [${window.$gameTime._currentTint ? window.$gameTime._currentTint.join(', ') : 'none'}]`);
            console.log(`🔧 Actual screen tone: [${$gameScreen._tone.join(', ')}]`);
            
            // Now try to override it manually
            console.log("🧪 Step 2: Manually overriding with red tint (enforcer should restore)");
            $gameScreen.startTint([200, 0, 0, 0], 30);
            
            console.log("🔧 Wait 5 seconds... enforcer should restore the original tint");
        }, 1000);
    },
    
    // Toggle tint enforcer on/off
    toggleTintEnforcer: function() {
        if (!window.$gameTime) {
            console.log("❌ $gameTime not available");
            return;
        }
        
        if (window.$gameTime._tintEnforcer) {
            window.$gameTime.stopTintEnforcer();
            console.log("🔧 Tint enforcer stopped");
        } else {
            window.$gameTime.startTintEnforcer();
            console.log("🔧 Tint enforcer started");
        }
    },
    
    // Force screen tinting
    forceTint: function(timeOfDay = null) {
        if (!window.$gameTime) {
            console.log("❌ $gameTime not initialized!");
            return;
        }
        
        if (!$gameScreen) {
            console.log("❌ $gameScreen not available!");
            return;
        }
        
        const targetTime = timeOfDay || window.$gameTime.getTimeOfDay();
        console.log(`🎨 Force applying ${targetTime} tint...`);
        
        let tint = [0, 0, 0, 0];
        switch (targetTime) {
            case 'night':
                tint = [-100, -100, 0, 100];
                break;
            case 'dawn':
                tint = [50, 20, -50, 80];
                break;
            case 'day':
                tint = [0, 0, 0, 0];
                break;
            case 'dusk':
                tint = [80, 20, -80, 90];
                break;
        }
        
        console.log(`🎨 Applying tint: [${tint.join(', ')}]`);
        console.log(`🎨 Current screen tone before: [${$gameScreen._tone.join(', ')}]`);
        
        $gameScreen.startTint(tint, 60);
        
        setTimeout(() => {
            console.log(`🎨 Current screen tone after: [${$gameScreen._tone.join(', ')}]`);
        }, 200);
    },
    
    // Test all tints manually
    testAllTints: function() {
        if (!$gameScreen) {
            console.log("❌ $gameScreen not available!");
            return;
        }
        
        console.log("🎨 Testing all screen tints...");
        
        const tints = [
            ['day', [0, 0, 0, 0]],
            ['dawn', [50, 20, -50, 80]],
            ['dusk', [80, 20, -80, 90]], 
            ['night', [-100, -100, 0, 100]]
        ];
        
        let index = 0;
        const testNext = () => {
            if (index >= tints.length) {
                console.log("🎨 All tint tests completed!");
                return;
            }
            
            const [name, tint] = tints[index];
            console.log(`🎨 Testing ${name} tint: [${tint.join(', ')}]`);
            $gameScreen.startTint(tint, 60);
            
            index++;
            setTimeout(testNext, 3000);
        };
        
        testNext();
    },
    
    // Cycle through all time periods quickly
    cycleAllPeriods: function() {
        if (!window.$gameTime) {
            console.log("❌ $gameTime not initialized!");
            return;
        }
        
        console.log("🔄 Cycling through all time periods...");
        
        // Dawn
        this.setTime(6, 0);
        console.log(`🌅 Dawn: ${window.$gameTime.getTimeString()}`);
        
        setTimeout(() => {
            // Day  
            this.setTime(8, 0);
            console.log(`☀️ Day: ${window.$gameTime.getTimeString()}`);
            
            setTimeout(() => {
                // Dusk
                this.setTime(18, 0);
                console.log(`🌇 Dusk: ${window.$gameTime.getTimeString()}`);
                
                setTimeout(() => {
                    // Night
                    this.setTime(20, 0);
                    console.log(`🌙 Night: ${window.$gameTime.getTimeString()}`);
                }, 2000);
            }, 2000);
        }, 2000);
    },
    
    // Help - show all available commands
    help: function() {
        console.log("🕐 === TIME SYSTEM CONSOLE COMMANDS ===");
        console.log("TimeSystemDebug.checkParams() - 🔧 CHECK PLUGIN PARAMETERS");
        console.log("TimeSystemDebug.fullDiagnostic() - 🔍 COMPLETE SYSTEM CHECK");
        console.log("TimeSystemDebug.speedUpHours(x) - Speed up by X hours");
        console.log("TimeSystemDebug.speedUpMinutes(x) - Speed up by X minutes");
        console.log("TimeSystemDebug.setTime(h, m) - Set specific time");
        console.log("TimeSystemDebug.getTimeInfo() - Show current time info");
        console.log("TimeSystemDebug.toggle() - Start/stop time progression");
        console.log("TimeSystemDebug.forceTint(period) - Force apply screen tint");
        console.log("TimeSystemDebug.testAutoTinting() - Debug automatic tinting");
        console.log("TimeSystemDebug.directTintTest() - Test RPG Maker tinting directly");
        console.log("TimeSystemDebug.testTintEnforcer() - Test continuous tint monitoring");
        console.log("TimeSystemDebug.toggleTintEnforcer() - Enable/disable tint enforcer");
        console.log("TimeSystemDebug.testAllTints() - Test all tints automatically");
        console.log("TimeSystemDebug.cycleAllPeriods() - Demo all time periods");
        console.log("TimeSystemDebug.help() - Show this help");
        console.log("=====================================");
        console.log("🔧 IF TINTING ISN'T WORKING - START HERE:");
        console.log("TimeSystemDebug.fullDiagnostic() - Complete system check");
        console.log("=====================================");
        console.log("TimeSystemDebug.testAllTints() - Test all tints automatically");
        console.log("TimeSystemDebug.testAutoTinting() - Test automatic tint system");
        console.log("TimeSystemDebug.cycleAllPeriods() - Demo all time periods");
        console.log("TimeSystemDebug.help() - Show this help");
        console.log("=====================================");
        console.log("🎨 Tint Examples:");
        console.log("TimeSystemDebug.forceTint('night') - Apply night tint");
        console.log("TimeSystemDebug.forceTint('day') - Remove all tinting");
    }
};

// Auto-show help on plugin load
setTimeout(() => {
    if (window.TimeSystemDebug) {
        console.log("🕐 Time System loaded! Type 'TimeSystemDebug.help()' for console commands");
    }
}, 1000);
