//=============================================================================
// TimeSystem.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.0.2] Time System with Day/Night Cycle
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
    
    
    const pluginName = 'TimeSystem'; // Fixed to match the actual filename
    const parameters = PluginManager.parameters(pluginName);
    
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
            
            // Force initial screen tint application
            setTimeout(() => {
                this.updateScreenTint(true);
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
                }
            }
        }
        
        setTime(hours, minutes) {
            this._hours = Math.max(0, Math.min(23, hours));
            this._minutes = Math.max(0, Math.min(59, minutes));
            this._seconds = 0;
            this._realTimeCounter = 0;
            this.updateScreenTint(true); // Force update when manually setting time
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
        }
        
        stop() {
            this._running = false;
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
        
        getTintForTimeOfDay(timeOfDay) {
            let tint = [0, 0, 0, 0];
            switch (timeOfDay) {
                case 'night':
                    tint = [-50, -50, 20, 60];
                    break;
                case 'dawn':
                    tint = [30, 15, -30, 20];
                    break;
                case 'day':
                    tint = [0, 0, 0, 0];
                    break;
                case 'dusk':
                    tint = [40, 15, -40, 30];
                    break;
            }
            return tint;
        }
        
        updateScreenTint(force = false) {
            if (!enableTinting) {
                return;
            }
            
            if (!$gameScreen) {
                return;
            }
            
            const timeOfDay = this.getTimeOfDay();
            const expectedTint = this.getTintForTimeOfDay(timeOfDay);
            
            // Check if we're already applying the correct tint
            const currentTone = $gameScreen._tone;
            const tintAlreadyCorrect = expectedTint.every((value, index) => 
                Math.abs(currentTone[index] - value) < 5
            );
            
            // Skip if already correct and not forced
            if (!force && tintAlreadyCorrect && !$gameScreen._tintDuration) {
                return;
            }
            
            // Only update if hour changed OR forced OR tint is wrong
            const currentHour = this._hours;
            if (!force && currentHour === this._lastTintTime && tintAlreadyCorrect) {
                return;
            }
            
            this._lastTintTime = currentHour;
            this._currentTint = [...expectedTint];
            
            $gameScreen.startTint(expectedTint, 120); // 2-second transition
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
                scene._timeDisplaySprite = new Sprite_TimeDisplay();
                scene.addChild(scene._timeDisplaySprite);
            }
        }
        
        hideTimeDisplay() {
            const scene = SceneManager._scene;
            if (scene && scene._timeDisplaySprite) {
                scene.removeChild(scene._timeDisplaySprite);
                scene._timeDisplaySprite = null;
            }
        }
    }

    //-----------------------------------------------------------------------------
    // Sprite_TimeDisplay - Permanent time display without Window graphics
    //-----------------------------------------------------------------------------
    
    class Sprite_TimeDisplay extends Sprite {
        constructor() {
            super();
            this.x = timeDisplayX;
            this.y = timeDisplayY;
            this._refreshCounter = 0;
            this.createBitmap();
            this.refresh();
        }
        
        createBitmap() {
            this.bitmap = new Bitmap(140, 72);
        }
        
        refresh() {
            if (!this.bitmap) return;
            
            this.bitmap.clear();
            
            if (!window.$gameTime) {
                this.bitmap.textColor = '#FFFFFF';
                this.bitmap.drawText("--:--", 4, 0, 132, 36, 'left');
                return;
            }
            
            const timeString = window.$gameTime.getTimeString();
            const timeOfDay = window.$gameTime.getTimeOfDay();
            
            // Draw time with white color
            this.bitmap.textColor = '#FFFFFF';
            this.bitmap.fontSize = 28;
            this.bitmap.drawText(timeString, 4, 0, 132, 36, 'left');
            
            // Draw time of day with color coding
            let color;
            switch (timeOfDay) {
                case 'night':
                    color = '#6699FF'; // Light blue
                    break;
                case 'dawn':
                    color = '#FF9966'; // Orange
                    break;
                case 'day':
                    color = '#FFFFFF'; // White
                    break;
                case 'dusk':
                    color = '#FFCC66'; // Yellow
                    break;
                default:
                    color = '#FFFFFF';
            }
            
            this.bitmap.textColor = color;
            this.bitmap.fontSize = 20;
            const timeOfDayText = timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);
            this.bitmap.drawText(timeOfDayText, 4, 36, 132, 24, 'left');
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
    // Sprite_Time - Temporary time display without Window graphics
    //-----------------------------------------------------------------------------
    
    class Sprite_Time extends Sprite {
        constructor(x, y, width, height) {
            super();
            this.x = x;
            this.y = y;
            this._width = width;
            this._height = height;
            this.createBitmap();
            this.refresh();
        }
        
        createBitmap() {
            this.bitmap = new Bitmap(this._width, this._height);
        }
        
        refresh() {
            if (!this.bitmap) return;
            
            this.bitmap.clear();
            
            if (!window.$gameTime) {
                this.bitmap.textColor = '#FFFFFF';
                this.bitmap.fontSize = 24;
                this.bitmap.drawText("Time: --:--", 0, 0, this._width, this._height / 2, 'center');
                this.bitmap.drawText("Unknown", 0, this._height / 2, this._width, this._height / 2, 'center');
                return;
            }
            
            const timeString = window.$gameTime.getTimeString();
            const timeOfDay = window.$gameTime.getTimeOfDay();
            const timeOfDayText = timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1);
            
            this.bitmap.textColor = '#FFFFFF';
            this.bitmap.fontSize = 28;
            this.bitmap.drawText(timeString, 0, 0, this._width, this._height / 2, 'center');
            
            this.bitmap.fontSize = 20;
            this.bitmap.drawText(timeOfDayText, 0, this._height / 2, this._width, this._height / 2, 'center');
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
        if (!window.$gameTime) {
            window.$gameTime = new Game_Time();
        }
        
        // Test time progression
        const startTime = window.$gameTime.getTimeString();
        window.$gameTime.addMinute();
        const endTime = window.$gameTime.getTimeString();
        
        // Test screen tinting
        if (enableTinting) {
            window.$gameTime.updateScreenTint();
        }
        
        $gameMessage.add("Time system test completed!");
    });
    
    PluginManager.registerCommand(pluginName, "logCurrentTime", args => {
        if (!window.$gameTime) {
            return;
        }
        const emoji = window.$gameTime.getTimeEmoji();
        const timeString = window.$gameTime.getTimeString();
        const timeOfDay = window.$gameTime.getTimeOfDay();
        const running = window.$gameTime.isRunning() ? "Running" : "Stopped";
        
        $gameMessage.add(`${emoji} TIME: ${timeString} | ${timeOfDay} | ${running}`);
    });
    
    PluginManager.registerCommand(pluginName, "showTimeDisplay", args => {
        if (!window.$gameTime) {
            window.$gameTime = new Game_Time();
        }
        const scene = SceneManager._scene;
        if (scene && scene._timeDisplaySprite) {
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
        const timeSprite = new Sprite_Time(Graphics.boxWidth - 200, 50, 180, 96);
        SceneManager._scene.addChild(timeSprite);
        
        setTimeout(() => {
            SceneManager._scene.removeChild(timeSprite);
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
            }
        }, 500);
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
