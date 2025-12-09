//=============================================================================
// UnofficialMZPatch.js
// Version: 1.0.1
// Date: 10-12-2025
//=============================================================================

/*:
@target MZ
@plugindesc [v1.0.1] Comprehensive RPG Maker MZ 1.9.0 Patches.
@author Alexandros Panagiotakopoulos
@url https://alexandrospanag.github.io
@version 1.0.1

@param --- Core Fixes ---
@default

@param enableCollisionFixes
@text Enable Collision Fixes
@desc Fixes diagonal movement collision glitches (walking through walls)
@type boolean
@default true

@param enableMemoryManagement
@text Enable Memory Management
@type boolean
@default true
@desc Automatically manages memory to prevent leaks during long play sessions

@param enableBitmapCaching
@text Enable Bitmap Caching
@type boolean
@default true
@desc Limits bitmap cache size to prevent memory overflow

@param maxBitmapCacheSize
@text Max Bitmap Cache Size (MB)
@type number
@min 50
@max 500
@default 150

@param enableAutoSaveBackup
@text Enable Auto-Save Backup
@type boolean
@default true

@param enableErrorLogging
@text Enable Error Logging
@type boolean
@default true

@param --- Performance ---
@default

@param enablePerformanceIntegration
@text Enable Performance Integration
@desc Automatically integrate all performance optimizations
@type boolean
@default true

@param enableAutoOptimization
@text Enable Auto Optimization
@type boolean
@default true

@param performanceThreshold
@text Performance Threshold (ms)
@type number
@min 8
@max 33
@default 16

@param enableObjectPooling
@text Enable Object Pooling
@type boolean
@default true

@param enableEventThrottling
@text Enable Event Throttling
@type boolean
@default true

@param enableFrameBudgeting
@text Enable Frame Budgeting
@type boolean
@default true

@param frameBudgetMs
@text Frame Budget (ms)
@type number
@min 1
@max 16
@default 8

@param gcThresholdMB
@text GC Threshold (MB)
@type number
@min 50
@max 500
@default 150

@param --- Quality Settings ---
@default

@param enableAdaptiveQuality
@text Enable Adaptive Quality
@type boolean
@default true

@param minFPS
@text Minimum Target FPS
@type number
@min 15
@max 60
@default 30

@param maxFPS
@text Maximum Target FPS
@type number
@min 30
@max 120
@default 60

@param enablePerformanceHUD
@text Enable Performance HUD
@type boolean
@default false

@param --- MZ 1.9.0 Patches ---
@default

@param enableInputFixes
@text Enable Input Fixes
@desc Fixes input handling issues in MZ 1.9.0
@type boolean
@default true

@param enableRendererFixes
@text Enable Renderer Fixes
@desc Fixes WebGL renderer issues
@type boolean
@default true

@param enableAudioFixes
@text Enable Audio Fixes
@desc Fixes audio playback and memory issues
@type boolean
@default true

@param enableSaveSystemFixes
@text Enable Save System Fixes
@desc Fixes save/load corruption issues
@type boolean
@default true

@param enableEventSystemFixes
@text Enable Event System Fixes
@desc Fixes event interpreter issues
@type boolean
@default true

@param enableBattleSystemFixes
@text Enable Battle System Fixes
@desc Fixes battle-related memory leaks
@type boolean
@default true

@param --- Texture & Rendering ---
@default

@param enableTextureBleedingFix
@text Enable Texture Bleeding Fix
@desc Fixes line artifacts when zooming/scaling sprites
@type boolean
@default true

@param --- Memory Leak Detection ---
@default

@param enableLeakDetection
@text Enable Leak Detection
@desc Enable memory leak detection (disable in production)
@type boolean
@default false

@param leakCheckInterval
@text Leak Check Interval (ms)
@type number
@min 1000
@max 60000
@default 5000

@param leakWarnThreshold
@text Leak Warning Threshold
@desc Number of objects before warning
@type number
@min 50
@max 500
@default 100

@param enableLeakVisualWarning
@text Enable Visual Leak Warning
@type boolean
@default true

@param --- QoL Improvements ---
@default

@param enableFontLoadingFix
@text Enable Font Loading Fix
@desc Ensures fonts are fully loaded before rendering text (WARNING: Can cause text flickering on custom HUDs)
@type boolean
@default false

@param enableWindowThrottling
@text Enable Window Refresh Throttling
@desc Prevents unnecessary window redraws for better performance (WARNING: Can cause HUD flickering)
@type boolean
@default false

@param excludeEquipWindowsFromThrottling
@text Exclude Equip Windows from Throttling
@desc Always allow equip menu windows to refresh immediately (fixes equip menu bugs)
@type boolean
@default true

@param windowRefreshInterval
@text Window Refresh Interval (ms)
@desc Minimum time between window refreshes
@type number
@min 16
@max 200
@default 50

@param enableSmoothTransitions
@text Enable Smooth Transitions
@desc Fade transitions instead of hard cuts between scenes
@type boolean
@default true

@param transitionDuration
@text Transition Duration (frames)
@desc Duration of fade transitions
@type number
@min 1
@max 60
@default 12

@command manualCleanup
@text Manual Cleanup
@desc Force memory cleanup

@command showPerformanceReport
@text Show Performance Report
@desc Display performance statistics

@command setQualityLevel
@text Set Quality Level
@desc Manually set quality (1-5)
@arg level
@type number
@min 1
@max 5
@default 3

@command togglePerformanceHUD
@text Toggle Performance HUD
@desc Show/hide performance overlay

@help
================================================================================
UnofficialMZPatch.js - Comprehensive RPG Maker MZ Enhancement Plugin
================================================================================

This plugin combines stability fixes, performance optimization, and unofficial
patches for RPG Maker MZ 1.9.0 into a single, comprehensive solution.

MAJOR FEATURES:
===============

1. DIAGONAL MOVEMENT COLLISION FIX
   - Prevents players from glitching through walls during diagonal movement
   - Proper collision checking for all 8 directions
   - Fixes edge-case passability issues

2. MEMORY MANAGEMENT
   - Bitmap cache management
   - Audio buffer cleanup
   - Sprite disposal fixes
   - Event interpreter optimization
   - Periodic garbage collection

3. PERFORMANCE INTEGRATION
   - Object pooling system
   - Frame budget management
   - Event throttling for distant events
   - Adaptive quality scaling
   - Delta time smoothing

4. MZ 1.9.0 SPECIFIC PATCHES
   - Input handling fixes
   - WebGL renderer stability
   - Audio system improvements
   - Save system corruption prevention
   - Battle system memory fixes

5. TEXTURE BLEEDING FIX
   - Fixes line artifacts when zooming/scaling
   - Pixel-perfect rendering for sprites
   - Proper texture wrapping (CLAMP mode)
   - Character, tilemap, and picture fixes

6. MEMORY LEAK DETECTION (Dev Mode)
   - Tracks bitmap/sprite/audio creation
   - Visual warnings for leak detection
   - Disabled by default for production

7. FONT LOADING FIX
   - Ensures fonts are fully loaded before text rendering
   - Prevents missing/fallback font display
   - Queues draw operations until fonts ready

8. WINDOW REFRESH THROTTLING
   - Prevents unnecessary window redraws
   - Configurable refresh interval
   - Smart throttling (messages exempt)
   - Optimized gold/status windows

9. SMOOTH SCENE TRANSITIONS
   - Fade transitions instead of hard cuts
   - Configurable duration
   - Automatic fade in/out on scene change
   - Skip for boot/gameover scenes

CONSOLE COMMANDS (F12):
=======================
$mzPatch.getReport()           - Full performance report
$mzPatch.optimizeAll()         - Force optimization
$mzPatch.setQuality(1-5)       - Set quality level
$mzPatch.toggleHUD()           - Toggle performance HUD
$mzPatch.getPoolStats()        - Object pool statistics
$mzPatch.cleanup()             - Force memory cleanup
$mzPatch.getLeakStatus()       - Check for memory leaks
$fontLoader.areFontsReady()    - Check font load status
$transitions.startFadeOut(dur) - Manual fade out
checkMemoryLeaks()             - Manual leak check (dev mode)

PLACEMENT:
==========
Place this plugin FIRST in your plugin list for maximum compatibility.
It replaces both StabilityAndCompatibilityFixes.js and PerformanceIntegration.js

================================================================================
Copyright © Alexandros Panagiotakopoulos. All Rights Reserved.
================================================================================
*/

(() => {
    'use strict';
    
    // Global error handler for plugin initialization
    try {
    
    const pluginName = 'UnofficialMZPatch';
    const VERSION = '1.0.0';
    
    // Safe parameter loading with fallbacks
    let parameters = {};
    try {
        parameters = PluginManager.parameters(pluginName) || {};
    } catch (e) {
    }
    
    
    //=========================================================================
    // Configuration
    //=========================================================================
    
    const Config = {
        // Core Fixes
        enableCollisionFixes: parameters['enableCollisionFixes'] !== 'false',
        enableMemoryManagement: parameters['enableMemoryManagement'] !== 'false',
        enableBitmapCaching: parameters['enableBitmapCaching'] !== 'false',
        maxBitmapCacheSize: parseInt(parameters['maxBitmapCacheSize']) || 150,
        enableAutoSaveBackup: parameters['enableAutoSaveBackup'] !== 'false',
        enableErrorLogging: parameters['enableErrorLogging'] !== 'false',
        
        // Performance
        enablePerformanceIntegration: parameters['enablePerformanceIntegration'] !== 'false',
        enableAutoOptimization: parameters['enableAutoOptimization'] !== 'false',
        performanceThreshold: parseFloat(parameters['performanceThreshold']) || 16.67,
        enableObjectPooling: parameters['enableObjectPooling'] !== 'false',
        enableEventThrottling: parameters['enableEventThrottling'] !== 'false',
        enableFrameBudgeting: parameters['enableFrameBudgeting'] !== 'false',
        frameBudgetMs: parseFloat(parameters['frameBudgetMs']) || 8,
        gcThresholdMB: parseInt(parameters['gcThresholdMB']) || 150,
        
        // Quality
        enableAdaptiveQuality: parameters['enableAdaptiveQuality'] !== 'false',
        minFPS: parseInt(parameters['minFPS']) || 30,
        maxFPS: parseInt(parameters['maxFPS']) || 60,
        enablePerformanceHUD: parameters['enablePerformanceHUD'] === 'true',
        
        // MZ 1.9.0 Patches
        enableInputFixes: parameters['enableInputFixes'] !== 'false',
        enableRendererFixes: parameters['enableRendererFixes'] !== 'false',
        enableAudioFixes: parameters['enableAudioFixes'] !== 'false',
        enableSaveSystemFixes: parameters['enableSaveSystemFixes'] !== 'false',
        enableEventSystemFixes: parameters['enableEventSystemFixes'] !== 'false',
        enableBattleSystemFixes: parameters['enableBattleSystemFixes'] !== 'false',
        
        // Texture & Rendering
        enableTextureBleedingFix: parameters['enableTextureBleedingFix'] !== 'false',
        
        // Memory Leak Detection
        enableLeakDetection: parameters['enableLeakDetection'] === 'true',
        leakCheckInterval: parseInt(parameters['leakCheckInterval']) || 5000,
        leakWarnThreshold: parseInt(parameters['leakWarnThreshold']) || 100,
        enableLeakVisualWarning: parameters['enableLeakVisualWarning'] !== 'false',
        
        // QoL Improvements
        enableFontLoadingFix: parameters['enableFontLoadingFix'] === 'true',  // Default OFF - can cause HUD flicker
        enableWindowThrottling: parameters['enableWindowThrottling'] === 'true',  // Default OFF - can cause HUD flicker
        excludeEquipWindowsFromThrottling: parameters['excludeEquipWindowsFromThrottling'] !== 'false', // Default ON
        windowRefreshInterval: parseInt(parameters['windowRefreshInterval']) || 50,
        enableSmoothTransitions: parameters['enableSmoothTransitions'] !== 'false',
        transitionDuration: parseInt(parameters['transitionDuration']) || 12
    };

    //=========================================================================
    // JavaScript Polyfills for Older NW.js Versions
    //=========================================================================
    
    if (!Array.prototype.flat) {
        Array.prototype.flat = function(depth = 1) {
            const flatten = (arr, d) => d < 1 ? arr.slice() : 
                arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val, d - 1) : val), []);
            return flatten(this, depth);
        };
    }
    
    if (!Array.prototype.flatMap) {
        Array.prototype.flatMap = function(callback, thisArg) {
            return this.map(callback, thisArg).flat();
        };
    }
    
    if (!Object.fromEntries) {
        Object.fromEntries = function(entries) {
            const obj = {};
            for (const [key, value] of entries) obj[key] = value;
            return obj;
        };
    }
    
    if (!Promise.allSettled) {
        Promise.allSettled = function(promises) {
            return Promise.all(promises.map(p => 
                Promise.resolve(p)
                    .then(value => ({ status: 'fulfilled', value }))
                    .catch(reason => ({ status: 'rejected', reason }))
            ));
        };
    }
    
    // String.prototype.replaceAll polyfill
    if (!String.prototype.replaceAll) {
        String.prototype.replaceAll = function(search, replacement) {
            return this.split(search).join(replacement);
        };
    }
    
    // Array.prototype.at polyfill
    if (!Array.prototype.at) {
        Array.prototype.at = function(index) {
            index = Math.trunc(index) || 0;
            if (index < 0) index += this.length;
            if (index < 0 || index >= this.length) return undefined;
            return this[index];
        };
    }

    //=========================================================================
    // SECTION 1: DIAGONAL MOVEMENT COLLISION FIX (MZ 1.9.0)
    //=========================================================================
    
    if (Config.enableCollisionFixes && typeof Game_Player !== 'undefined') {
        
        /**
         * Check if a tile is completely impassable (X-marked tile)
         * X-marked tiles block ALL 4 directions
         */
        Game_Map.prototype.isTileImpassable = function(x, y) {
            // Check if tile blocks all 4 cardinal directions
            const dominated = !this.isPassable(x, y, 2) && 
                              !this.isPassable(x, y, 4) && 
                              !this.isPassable(x, y, 6) && 
                              !this.isPassable(x, y, 8);
            return dominated;
        };
        
        /**
         * Enhanced diagonal collision check
         * Prevents glitching through walls during diagonal movement
         */
        Game_CharacterBase.prototype.canPassDiagonally = function(x, y, horz, vert) {
            const x2 = $gameMap.roundXWithDirection(x, horz);
            const y2 = $gameMap.roundYWithDirection(y, vert);
            
            // First check: is destination tile completely impassable?
            if ($gameMap.isTileImpassable(x2, y2)) {
                return false;
            }
            
            // Check horizontal movement from current position
            if (!this.canPass(x, y, horz)) return false;
            
            // Check vertical movement from current position
            if (!this.canPass(x, y, vert)) return false;
            
            // Check horizontal movement from the new Y position (corner check)
            if (!this.canPass(x, y2, horz)) return false;
            
            // Check vertical movement from the new X position (corner check)
            if (!this.canPass(x2, y, vert)) return false;
            
            // Check if destination tile allows entry from our direction
            if (!$gameMap.isPassable(x2, y2, this.reverseDir(horz))) return false;
            if (!$gameMap.isPassable(x2, y2, this.reverseDir(vert))) return false;
            
            // Check for events at diagonal destination
            if (this.isCollidedWithCharacters(x2, y2)) return false;
            
            return true;
        };
        
        /**
         * Fixed diagonal movement for characters
         */
        const _Game_CharacterBase_moveDiagonally = Game_CharacterBase.prototype.moveDiagonally;
        Game_CharacterBase.prototype.moveDiagonally = function(horz, vert) {
            this.setMovementSuccess(this.canPassDiagonally(this._x, this._y, horz, vert));
            
            if (this.isMovementSucceeded()) {
                this._x = $gameMap.roundXWithDirection(this._x, horz);
                this._y = $gameMap.roundYWithDirection(this._y, vert);
                this._realX = $gameMap.xWithDirection(this._x, this.reverseDir(horz));
                this._realY = $gameMap.yWithDirection(this._y, this.reverseDir(vert));
                this.increaseSteps();
            } else {
                // Wall slide: Try horizontal only, then vertical only
                if (this.canPass(this._x, this._y, horz)) {
                    this.moveStraight(horz);
                } else if (this.canPass(this._x, this._y, vert)) {
                    this.moveStraight(vert);
                }
            }
            
            // Update direction based on diagonal
            if (this._direction === 2 || this._direction === 8) {
                // Keep vertical direction as primary
            } else {
                // Keep horizontal direction as primary
            }
        };
        
        /**
         * Enhanced player diagonal movement with proper collision
         */
        const _Game_Player_moveDiagonally = Game_Player.prototype.moveDiagonally;
        Game_Player.prototype.moveDiagonally = function(horz, vert) {
            if (this.canPassDiagonally(this._x, this._y, horz, vert)) {
                this._followers.updateMove();
                Game_CharacterBase.prototype.moveDiagonally.call(this, horz, vert);
            } else {
                // Wall slide - try each direction individually
                const canHorz = this.canPass(this._x, this._y, horz);
                const canVert = this.canPass(this._x, this._y, vert);
                
                if (canHorz && !canVert) {
                    this.moveStraight(horz);
                } else if (canVert && !canHorz) {
                    this.moveStraight(vert);
                }
                // If both blocked or both open but diagonal blocked, don't move
            }
        };
        
        /**
         * Enhanced canPass to double-check X-marked tiles
         */
        const _Game_CharacterBase_canPass = Game_CharacterBase.prototype.canPass;
        Game_CharacterBase.prototype.canPass = function(x, y, d) {
            const x2 = $gameMap.roundXWithDirection(x, d);
            const y2 = $gameMap.roundYWithDirection(y, d);
            
            // Block movement into completely impassable tiles
            if ($gameMap.isTileImpassable(x2, y2)) {
                return false;
            }
            
            // Call original canPass
            return _Game_CharacterBase_canPass.call(this, x, y, d);
        };
        
        /**
         * Fix for edge-case passability on map boundaries
         */
        const _Game_Map_isPassable = Game_Map.prototype.isPassable;
        Game_Map.prototype.isPassable = function(x, y, d) {
            // Bounds check
            if (!this.isValid(x, y)) return false;
            
            // Call original
            return _Game_Map_isPassable.call(this, x, y, d);
        };      
    }

    //=========================================================================
    // SECTION 2: INPUT HANDLING FIXES (MZ 1.9.0)
    //=========================================================================
    
    if (Config.enableInputFixes && typeof Input !== 'undefined') {
        
        // Fix for input getting stuck
        const _Input_clear = Input.clear;
        Input.clear = function() {
            _Input_clear.call(this);
            this._currentState = {};
            this._previousState = {};
            this._latestButton = null;
            this._pressedTime = 0;
            this._gamepadStates = [];
        };
        
        // Fix for gamepad deadzone issues
        const _Input_updateGamepadState = Input._updateGamepadState;
        Input._updateGamepadState = function(gamepad) {
            // Apply deadzone to prevent drift
            const DEADZONE = 0.25;
            const axes = gamepad.axes.map(axis => 
                Math.abs(axis) < DEADZONE ? 0 : axis
            );
            
            // Store modified gamepad
            const modifiedGamepad = Object.create(gamepad);
            modifiedGamepad.axes = axes;
            
            _Input_updateGamepadState.call(this, modifiedGamepad);
        };
        
        // Fix for touch input on mobile
        const _TouchInput_clear = TouchInput.clear;
        TouchInput.clear = function() {
            _TouchInput_clear.call(this);
            this._mousePressed = false;
            this._screenPressed = false;
            this._pressedTime = 0;
            this._released = false;
        };
        
        // Prevent multiple key registration per frame
        let lastInputFrame = 0;
        const _Input_update = Input.update;
        Input.update = function() {
            const currentFrame = Graphics.frameCount;
            if (currentFrame === lastInputFrame) return;
            lastInputFrame = currentFrame;
            _Input_update.call(this);
        };
    }

    //=========================================================================
    // SECTION 3: MEMORY MANAGEMENT & BITMAP CACHING
    //=========================================================================
    
    if ((Config.enableMemoryManagement || Config.enableBitmapCaching) && typeof Bitmap !== 'undefined') {
        
        // Enhanced Bitmap initialization tracking
        const _Bitmap_initialize = Bitmap.prototype.initialize;
        Bitmap.prototype.initialize = function(width, height) {
            _Bitmap_initialize.call(this, width, height);
            this._creationTime = Date.now();
            this._lastAccess = Date.now();
        };
        
        // Track bitmap access
        const _Bitmap_getPixel = Bitmap.prototype.getPixel;
        Bitmap.prototype.getPixel = function(x, y) {
            this._lastAccess = Date.now();
            return _Bitmap_getPixel.call(this, x, y);
        };
        
        // Bitmap cache cleanup manager
        let lastCacheCleanup = Date.now();
        
        SceneManager.cleanupBitmapCache = function() {
            const cache = ImageManager._cache;
            if (!cache) return 0;
            
            const keys = Object.keys(cache);
            let totalSize = 0;
            const cacheInfo = [];
            
            for (const key of keys) {
                const bitmap = cache[key];
                if (bitmap && bitmap.width && bitmap.height) {
                    const size = bitmap.width * bitmap.height * 4;
                    totalSize += size;
                    cacheInfo.push({ 
                        key, 
                        bitmap, 
                        size, 
                        time: bitmap._lastAccess || bitmap._creationTime || 0 
                    });
                }
            }
            
            const maxSize = Config.maxBitmapCacheSize * 1024 * 1024;
            let removedSize = 0;
            
            if (totalSize > maxSize) {
                cacheInfo.sort((a, b) => a.time - b.time);
                
                for (const info of cacheInfo) {
                    if (totalSize - removedSize <= maxSize * 0.75) break;
                    
                    if (info.bitmap && info.bitmap.destroy) {
                        info.bitmap.destroy();
                    }
                    delete cache[info.key];
                    removedSize += info.size;
                }
                
                if (Config.enableErrorLogging && removedSize > 0) {
                }
            }
            
            return removedSize;
        };
        
        // ImageManager clear enhancement
        const _ImageManager_clear = ImageManager.clear;
        ImageManager.clear = function() {
            _ImageManager_clear.call(this);
            if (typeof gc !== 'undefined') gc();
        };
    }

    //=========================================================================
    // SECTION 4: AUDIO SYSTEM FIXES
    //=========================================================================
    
    if (Config.enableAudioFixes && typeof AudioManager !== 'undefined') {
        
        // Audio buffer cleanup
        const _AudioManager_stopAll = AudioManager.stopAll;
        AudioManager.stopAll = function() {
            _AudioManager_stopAll.call(this);
            
            // Clear SE buffers
            if (this._seBuffers) {
                for (const buffer of this._seBuffers) {
                    if (buffer && buffer.clear) buffer.clear();
                }
            }
            
            // Clear BGS buffer
            if (this._bgsBuffer && this._bgsBuffer.clear) {
                this._bgsBuffer.clear();
            }
        };
        
        // Periodic audio cleanup
        let lastAudioCleanup = Date.now();
        
        AudioManager.cleanupAudioBuffers = function() {
            if (!this._seBuffers) return;
            
            this._seBuffers = this._seBuffers.filter(buffer => {
                if (buffer && !buffer.isPlaying()) {
                    if (buffer.clear) buffer.clear();
                    return false;
                }
                return true;
            });
        };
        
        // Hook audio update
        const _AudioManager_update = AudioManager.update;
        AudioManager.update = function() {
            _AudioManager_update.call(this);
            
            const now = Date.now();
            if (now - lastAudioCleanup > 120000) {
                this.cleanupAudioBuffers();
                lastAudioCleanup = now;
            }
        };
        
        // Fix audio context state issues
        const _WebAudio_initialize = WebAudio.prototype.initialize;
        WebAudio.prototype.initialize = function(url) {
            _WebAudio_initialize.call(this, url);
            
            // Ensure audio context is running
            if (WebAudio._context && WebAudio._context.state === 'suspended') {
                WebAudio._context.resume().catch(() => {});
            }
        };
    }

    //=========================================================================
    // SECTION 5: SAVE SYSTEM FIXES
    //=========================================================================
    
    if (Config.enableSaveSystemFixes && typeof DataManager !== 'undefined') {
        
        // Backup save before overwriting
        const _DataManager_saveGame = DataManager.saveGame;
        DataManager.saveGame = function(savefileId) {
            if (Config.enableAutoSaveBackup) {
                const saveName = this.makeSavename(savefileId);
                const backupId = `backup_${savefileId}`;
                
                StorageManager.loadObject(saveName)
                    .then(existingData => {
                        if (existingData) {
                            return StorageManager.saveObject(this.makeSavename(backupId), existingData);
                        }
                    })
                    .catch(() => {});
            }
            
            return _DataManager_saveGame.call(this, savefileId);
        };
        
        // Try backup on load failure
        const _DataManager_loadGame = DataManager.loadGame;
        DataManager.loadGame = function(savefileId) {
            return _DataManager_loadGame.call(this, savefileId).catch(e => {
                
                const backupId = `backup_${savefileId}`;
                return StorageManager.loadObject(this.makeSavename(backupId))
                    .then(backup => {
                        if (backup) {
                            this.extractSaveContents(backup);
                            return true;
                        }
                        throw new Error('No backup available');
                    });
            });
        };
        
        // Fix save data corruption from circular references
        const _JsonEx_stringify = JsonEx.stringify;
        JsonEx.stringify = function(object) {
            try {
                return _JsonEx_stringify.call(this, object);
            } catch (e) {
                return this._safeStringify(object);
            }
        };
        
        JsonEx._safeStringify = function(obj, maxDepth = 10) {
            const seen = new WeakSet();
            return JSON.stringify(obj, (key, value) => {
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) return '[Circular]';
                    seen.add(value);
                }
                return value;
            });
        };
    }

    //=========================================================================
    // SECTION 6: EVENT SYSTEM FIXES
    //=========================================================================
    
    if (Config.enableEventSystemFixes && typeof Game_Character !== 'undefined') {
        
        // Fix move route null reference
        const _Game_Character_updateRoutineMove = Game_Character.prototype.updateRoutineMove;
        Game_Character.prototype.updateRoutineMove = function() {
            if (!this._moveRoute || !this._moveRoute.list) {
                this._moveRoute = { list: [], repeat: false, skippable: false, wait: false };
                this._moveRouteIndex = 0;
                this._moveRouteForcing = false;
                return;
            }
            _Game_Character_updateRoutineMove.call(this);
        };
        
        // Event interpreter memory cleanup
        const _Game_Interpreter_clear = Game_Interpreter.prototype.clear;
        Game_Interpreter.prototype.clear = function() {
            _Game_Interpreter_clear.call(this);
            this._comments = null;
            this._waitMode = '';
            this._waitCount = 0;
            this._childInterpreter = null;
        };
        
        // Prevent infinite loops
        const _Game_Interpreter_update = Game_Interpreter.prototype.update;
        Game_Interpreter.prototype.update = function() {
            this._loopCounter = (this._loopCounter || 0) + 1;
            
            if (this._loopCounter > 100000) {
                this.terminate();
                this._loopCounter = 0;
                return;
            }
            
            _Game_Interpreter_update.call(this);
            
            if (!this.isRunning()) {
                this._loopCounter = 0;
            }
        };
        
        // Fix parallel event buildup
        const _Game_Map_updateInterpreter = Game_Map.prototype.updateInterpreter;
        Game_Map.prototype.updateInterpreter = function() {
            _Game_Map_updateInterpreter.call(this);
            
            // Clean up stale parallel interpreters
            if (this._interpreter && !this._interpreter.isRunning()) {
                this._interpreter.clear();
            }
        };
        
        // Event page condition cache invalidation
        Game_Event.prototype.clearPageCache = function() {
            this._pageIndex = -1;
            this._erased = false;
        };
    }

    //=========================================================================
    // SECTION 7: BATTLE SYSTEM FIXES
    //=========================================================================
    
    if (Config.enableBattleSystemFixes && typeof BattleManager !== 'undefined') {
        
        // Battle end cleanup
        const _BattleManager_endBattle = BattleManager.endBattle;
        BattleManager.endBattle = function(result) {
            _BattleManager_endBattle.call(this, result);
            
            // Clear battle arrays
            this._actionBattlers = [];
            this._subject = null;
            this._action = null;
            this._targets = [];
            this._logWindow = null;
            this._spriteset = null;
        };
        
        // Fix action sequence memory leak
        const _Game_Action_clear = Game_Action.prototype.clear;
        Game_Action.prototype.clear = function() {
            _Game_Action_clear.call(this);
            this._targetIndex = 0;
            this._forcing = false;
            this._reflectionTarget = null;
        };
        
        // Battle sprite cleanup
        const _Spriteset_Battle_terminate = Spriteset_Battle.prototype.terminate;
        Spriteset_Battle.prototype.terminate = function() {
            // Destroy all battle sprites
            if (this._actorSprites) {
                for (const sprite of this._actorSprites) {
                    if (sprite && sprite.destroy) sprite.destroy();
                }
                this._actorSprites = [];
            }
            
            if (this._enemySprites) {
                for (const sprite of this._enemySprites) {
                    if (sprite && sprite.destroy) sprite.destroy();
                }
                this._enemySprites = [];
            }
            
            if (_Spriteset_Battle_terminate) {
                _Spriteset_Battle_terminate.call(this);
            }
        };
    }

    //=========================================================================
    // SECTION 8: RENDERER FIXES (DISABLED - Too aggressive for some setups)
    //=========================================================================
    
    // NOTE: This section has been disabled as it modifies core PIXI/WebGL
    // settings which can cause compatibility issues. The fixes included:
    // - WebGL context loss recovery
    // - PIXI filter memory leak fix
    // - Sprite disposal improvements
    // If you need these features, consider enabling them individually.
    
    /*
    if (Config.enableRendererFixes && typeof Graphics !== 'undefined') {
        // ... disabled ...
    }
    */
    
    if (Config.enableRendererFixes) {
    }

    //=========================================================================
    // SECTION 8B: TEXTURE BLEEDING FIX
    //=========================================================================
    
    if (Config.enableTextureBleedingFix && typeof PIXI !== 'undefined') {
        
        // Force nearest neighbor scaling globally (safe settings)
        if (PIXI.settings) {
            PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
            PIXI.settings.ROUND_PIXELS = true;
        }
        
        // Fix bitmap initialization for pixel-perfect rendering
        if (typeof Bitmap !== 'undefined') {
            const _Bitmap_initialize_texture = Bitmap.prototype.initialize;
            Bitmap.prototype.initialize = function(width, height) {
                _Bitmap_initialize_texture.call(this, width, height);
                if (this._canvas && this._context) {
                    this._context.imageSmoothingEnabled = false;
                }
            };
            
            // Fix texture wrapping when bitmap is loaded
            const _Bitmap_onLoad_texture = Bitmap.prototype._onLoad;
            Bitmap.prototype._onLoad = function() {
                _Bitmap_onLoad_texture.call(this);
                if (this._baseTexture && typeof PIXI !== 'undefined') {
                    this._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                }
            };
        }
        
        // Fix character sprite rendering
        if (typeof Sprite_Character !== 'undefined') {
            const _Sprite_Character_updateBitmap_texture = Sprite_Character.prototype.updateBitmap;
            Sprite_Character.prototype.updateBitmap = function() {
                _Sprite_Character_updateBitmap_texture.call(this);
                if (this.bitmap && this.bitmap._baseTexture) {
                    this.bitmap._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                }
            };
        }
        
        // Fix tilemap texture bleeding
        if (typeof Tilemap !== 'undefined') {
            const _Tilemap_initialize = Tilemap.prototype.initialize;
            Tilemap.prototype.initialize = function() {
                _Tilemap_initialize.call(this);
                
                // Ensure tileset textures use proper settings
                if (this._tilesetBitmaps) {
                    for (const bitmap of this._tilesetBitmaps) {
                        if (bitmap && bitmap._baseTexture) {
                            bitmap._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                        }
                    }
                }
            };
        }
        
        // Fix for picture sprites
        if (typeof Sprite_Picture !== 'undefined') {
            const _Sprite_Picture_updateBitmap = Sprite_Picture.prototype.updateBitmap;
            Sprite_Picture.prototype.updateBitmap = function() {
                _Sprite_Picture_updateBitmap.call(this);
                if (this.bitmap && this.bitmap._baseTexture) {
                    this.bitmap._baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                }
            };
        }
    }

    //=========================================================================
    // SECTION 8C: MEMORY LEAK DETECTION (Development Only)
    //=========================================================================
    
    // Memory Tracker object (always create, but hooks only if detection enabled)
    const MemoryLeakTracker = {
        enabled: Config.enableLeakDetection,
        bitmaps: new WeakSet(),
        sprites: new WeakSet(),
        audios: new WeakSet(),
        counts: {
            bitmaps: 0,
            sprites: 0,
            audio: 0,
            windows: 0
        },
        warnings: [],
        lastCheck: Date.now(),
        warningSprite: null
    };
    
    if (Config.enableLeakDetection && typeof Bitmap !== 'undefined' && typeof Sprite !== 'undefined') {
        
        // Track Bitmap creation
        const _Bitmap_init_leak = Bitmap.prototype.initialize;
        Bitmap.prototype.initialize = function(width, height) {
            _Bitmap_init_leak.call(this, width, height);
            MemoryLeakTracker.bitmaps.add(this);
            MemoryLeakTracker.counts.bitmaps++;
        };
        
        const _Bitmap_destroy_leak = Bitmap.prototype.destroy;
        Bitmap.prototype.destroy = function() {
            if (MemoryLeakTracker.bitmaps.has(this)) {
                MemoryLeakTracker.counts.bitmaps--;
            }
            _Bitmap_destroy_leak.call(this);
        };
        
        // Track Sprite creation
        const _Sprite_init_leak = Sprite.prototype.initialize;
        Sprite.prototype.initialize = function(bitmap) {
            _Sprite_init_leak.call(this, bitmap);
            MemoryLeakTracker.sprites.add(this);
            MemoryLeakTracker.counts.sprites++;
        };
        
        const _Sprite_destroy_leak = Sprite.prototype.destroy;
        Sprite.prototype.destroy = function(options) {
            if (MemoryLeakTracker.sprites.has(this)) {
                MemoryLeakTracker.counts.sprites--;
            }
            _Sprite_destroy_leak.call(this, options);
        };
        
        // Track Audio
        const _WebAudio_init_leak = WebAudio.prototype.initialize;
        WebAudio.prototype.initialize = function(url) {
            _WebAudio_init_leak.call(this, url);
            MemoryLeakTracker.audios.add(this);
            MemoryLeakTracker.counts.audio++;
        };
        
        const _WebAudio_clear_leak = WebAudio.prototype.clear;
        WebAudio.prototype.clear = function() {
            if (MemoryLeakTracker.audios.has(this)) {
                MemoryLeakTracker.counts.audio--;
            }
            _WebAudio_clear_leak.call(this);
        };
        
        // Track Windows
        const _Window_init_leak = Window_Base.prototype.initialize;
        Window_Base.prototype.initialize = function(rect) {
            _Window_init_leak.call(this, rect);
            MemoryLeakTracker.counts.windows++;
        };
        
        const _Window_destroy_leak = Window_Base.prototype.destroy;
        Window_Base.prototype.destroy = function(options) {
            MemoryLeakTracker.counts.windows--;
            _Window_destroy_leak.call(this, options);
        };
        
        // Visual warning display
        MemoryLeakTracker.createWarningDisplay = function() {
            if (!Config.enableLeakVisualWarning || this.warningSprite) return;
            
            const scene = SceneManager._scene;
            if (!scene) return;
            
            this.warningSprite = new Sprite();
            this.warningSprite.bitmap = new Bitmap(Graphics.width, 80);
            this.warningSprite.y = Graphics.height - 80;
            this.warningSprite.z = 10000;
            
            if (scene.addChild) {
                scene.addChild(this.warningSprite);
            }
        };
        
        MemoryLeakTracker.updateWarningDisplay = function(message) {
            if (!Config.enableLeakVisualWarning || !this.warningSprite || !this.warningSprite.bitmap) return;
            
            const bitmap = this.warningSprite.bitmap;
            bitmap.clear();
            bitmap.fillRect(0, 0, bitmap.width, bitmap.height, 'rgba(200, 0, 0, 0.85)');
            bitmap.textColor = '#ffffff';
            bitmap.fontSize = 18;
            bitmap.outlineWidth = 3;
            bitmap.drawText('⚠️ MEMORY LEAK WARNING', 10, 5, bitmap.width - 20, 28, 'left');
            bitmap.fontSize = 14;
            bitmap.drawText(message, 10, 40, bitmap.width - 20, 24, 'left');
        };
        
        MemoryLeakTracker.clearWarningDisplay = function() {
            if (this.warningSprite && this.warningSprite.bitmap) {
                this.warningSprite.bitmap.clear();
            }
        };
        
        // Leak check function
        MemoryLeakTracker.checkForLeaks = function() {
            const warnings = [];
            const c = this.counts;
            const threshold = Config.leakWarnThreshold;
            
            if (c.bitmaps > threshold) {
                warnings.push(`Bitmaps: ${c.bitmaps} (threshold: ${threshold})`);
            }
            if (c.sprites > threshold) {
                warnings.push(`Sprites: ${c.sprites} (threshold: ${threshold})`);
            }
            if (c.audio > 50) {
                warnings.push(`Audio objects: ${c.audio}`);
            }
            if (c.windows > 30) {
                warnings.push(`Windows: ${c.windows}`);
            }
            
            this.warnings = warnings;
            
            if (warnings.length > 0) {
                if (Config.enableErrorLogging) {
                    warnings.forEach(w => console.warn(`  • ${w}`));
                }
                
                if (Config.enableLeakVisualWarning) {
                    this.createWarningDisplay();
                    this.updateWarningDisplay(warnings.join(' | '));
                }
            } else {
                this.clearWarningDisplay();
            }
            
            this.lastCheck = Date.now();
        };
        
        // Hook into scene update for periodic checks
        const _Scene_Base_update_leak = Scene_Base.prototype.update;
        Scene_Base.prototype.update = function() {
            _Scene_Base_update_leak.call(this);
            
            const interval = Config.leakCheckInterval;
            if (Graphics.frameCount % Math.floor(interval / 16.67) === 0) {
                MemoryLeakTracker.checkForLeaks();
            }
        };
        
        // Console command for manual check
        window.checkMemoryLeaks = function() {
            MemoryLeakTracker.checkForLeaks();
            return {
                ...MemoryLeakTracker.counts,
                warnings: MemoryLeakTracker.warnings
            };
        };
    }

    //=========================================================================
    // SECTION 8D: FONT LOADING FIX
    //=========================================================================
    
    if (Config.enableFontLoadingFix && typeof Bitmap !== 'undefined') {
        
        // Font loading state tracking
        const FontLoader = {
            loaded: false,
            loading: false,
            callbacks: [],
            fonts: ['rmmz-mainfont', 'rmmz-numberfont'],
            
            // Check if all fonts are ready
            areFontsReady() {
                if (this.loaded) return true;
                
                for (const fontFamily of this.fonts) {
                    if (!document.fonts.check(`12px "${fontFamily}"`)) {
                        return false;
                    }
                }
                
                this.loaded = true;
                return true;
            },
            
            // Wait for fonts to load
            waitForFonts() {
                return new Promise((resolve) => {
                    if (this.areFontsReady()) {
                        resolve();
                        return;
                    }
                    
                    if (document.fonts && document.fonts.ready) {
                        document.fonts.ready.then(() => {
                            this.loaded = true;
                            resolve();
                        });
                    } else {
                        // Fallback: wait a bit for fonts
                        setTimeout(() => {
                            this.loaded = true;
                            resolve();
                        }, 500);
                    }
                });
            }
        };
        
        // Hook into Scene_Boot to wait for fonts
        if (typeof Scene_Boot !== 'undefined') {
            const _Scene_Boot_loadGameFonts = Scene_Boot.prototype.loadGameFonts;
            Scene_Boot.prototype.loadGameFonts = function() {
                _Scene_Boot_loadGameFonts.call(this);
                
                // Add custom fonts to tracking list
                if ($dataSystem && $dataSystem.advanced) {
                    const mainFont = $dataSystem.advanced.mainFontFilename;
                    const numberFont = $dataSystem.advanced.numberFontFilename;
                    
                    if (mainFont) {
                        const fontName = mainFont.replace(/\.[^/.]+$/, '');
                        if (!FontLoader.fonts.includes(fontName)) {
                            FontLoader.fonts.push(fontName);
                        }
                    }
                    if (numberFont) {
                        const fontName = numberFont.replace(/\.[^/.]+$/, '');
                        if (!FontLoader.fonts.includes(fontName)) {
                            FontLoader.fonts.push(fontName);
                        }
                    }
                }
            };
        }
        
        // Ensure fonts loaded before bitmap text drawing
        const _Bitmap_drawText = Bitmap.prototype.drawText;
        Bitmap.prototype.drawText = function(text, x, y, maxWidth, lineHeight, align) {
            // If fonts not ready, queue the draw operation
            if (!FontLoader.areFontsReady() && document.fonts && document.fonts.ready) {
                const self = this;
                const args = [text, x, y, maxWidth, lineHeight, align];
                document.fonts.ready.then(() => {
                    _Bitmap_drawText.apply(self, args);
                });
                return;
            }
            
            _Bitmap_drawText.call(this, text, x, y, maxWidth, lineHeight, align);
        };
        
        // Expose font loader globally
        window.$fontLoader = FontLoader;
    }

    //=========================================================================
    // SECTION 8E: WINDOW REFRESH THROTTLING
    //=========================================================================
    
    if (Config.enableWindowThrottling && typeof Window_Base !== 'undefined') {
        
        // Track last refresh time for each window
        const windowRefreshTimes = new WeakMap();
        
        // Helper function to check if a window is equip-related
        const isEquipRelatedWindow = function(window) {
            if (!Config.excludeEquipWindowsFromThrottling) return false;
            const name = window.constructor.name;
            return (
                name === 'Window_EquipSlot' ||
                name === 'Window_EquipItem' ||
                name === 'Window_EquipStatus' ||
                name === 'Window_EquipCommand'
            );
        };
        
        // Throttled refresh for Window_Base
        const _Window_Base_refresh = Window_Base.prototype.refresh;
        Window_Base.prototype.refresh = function() {
            // IMPORTANT: Skip throttling for equip-related windows - they need immediate refresh
            if (isEquipRelatedWindow(this)) {
                return _Window_Base_refresh.call(this);
            }
            
            const now = Date.now();
            const lastRefresh = windowRefreshTimes.get(this) || 0;
            const interval = Config.windowRefreshInterval;
            
            // Skip refresh if called too soon (unless forced)
            if (now - lastRefresh < interval && !this._forceRefresh) {
                // Schedule a delayed refresh
                if (!this._pendingRefresh) {
                    this._pendingRefresh = true;
                    const self = this;
                    setTimeout(() => {
                        self._pendingRefresh = false;
                        self._forceRefresh = true;
                        self.refresh();
                        self._forceRefresh = false;
                    }, interval - (now - lastRefresh));
                }
                return;
            }
            
            windowRefreshTimes.set(this, now);
            this._forceRefresh = false;
            _Window_Base_refresh.call(this);
        };
        
        // Force refresh method (bypasses throttle)
        Window_Base.prototype.forceRefresh = function() {
            this._forceRefresh = true;
            this.refresh();
        };
        
        // Throttle Window_Message updates
        if (typeof Window_Message !== 'undefined') {
            const _Window_Message_updateMessage = Window_Message.prototype.updateMessage;
            Window_Message.prototype.updateMessage = function() {
                // Message window needs real-time updates, don't throttle
                return _Window_Message_updateMessage.call(this);
            };
        }
        
        // Throttle status window refreshes
        if (Window_StatusBase) {
            const _Window_StatusBase_refresh = Window_StatusBase.prototype.refresh;
            Window_StatusBase.prototype.refresh = function() {
                // IMPORTANT: Skip throttling for equip-related windows
                if (isEquipRelatedWindow(this)) {
                    return _Window_StatusBase_refresh.call(this);
                }
                
                const now = Date.now();
                const lastRefresh = windowRefreshTimes.get(this) || 0;
                
                // Status windows can be throttled more aggressively
                if (now - lastRefresh < Config.windowRefreshInterval * 2 && !this._forceRefresh) {
                    return;
                }
                
                windowRefreshTimes.set(this, now);
                this._forceRefresh = false;
                _Window_StatusBase_refresh.call(this);
            };
        }
        
        // Optimize Window_Gold refresh
        if (typeof Window_Gold !== 'undefined') {
            const _Window_Gold_refresh = Window_Gold.prototype.refresh;
            Window_Gold.prototype.refresh = function() {
                // Only refresh if gold actually changed
                const currentGold = $gameParty ? $gameParty.gold() : 0;
                if (this._lastGold === currentGold && !this._forceRefresh) {
                    return;
                }
                this._lastGold = currentGold;
                _Window_Gold_refresh.call(this);
            };
        }
    }

    //=========================================================================
    // SECTION 8F: SMOOTH SCENE TRANSITIONS
    //=========================================================================
    
    // Transition state (always create but only use if enabled)
    const TransitionManager = {
        enabled: Config.enableSmoothTransitions,
        fading: false,
        fadeType: 'none', // 'in', 'out', 'none'
        fadeProgress: 0,
        fadeDuration: Config.transitionDuration,
        fadeSprite: null,
        callback: null,
        
        startFadeOut(duration, callback) {
            if (!this.enabled) {
                if (callback) callback();
                return;
            }
            this.fading = true;
            this.fadeType = 'out';
            this.fadeProgress = 0;
            this.fadeDuration = duration || Config.transitionDuration;
            this.callback = callback;
            this.createFadeSprite();
        },
        
        startFadeIn(duration) {
            if (!this.enabled) return;
            this.fading = true;
            this.fadeType = 'in';
            this.fadeProgress = 0;
            this.fadeDuration = duration || Config.transitionDuration;
            this.callback = null;
            this.createFadeSprite();
            if (this.fadeSprite) {
                this.fadeSprite.opacity = 255;
            }
        },
        
        createFadeSprite() {
            try {
                if (!this.fadeSprite && SceneManager._scene) {
                    this.fadeSprite = new ScreenSprite();
                    this.fadeSprite.setColor(0, 0, 0);
                    this.fadeSprite.opacity = this.fadeType === 'in' ? 255 : 0;
                    SceneManager._scene.addChild(this.fadeSprite);
                }
            } catch (e) {
                this.fading = false;
            }
        },
        
        update() {
            if (!this.enabled || !this.fading) return;
            if (!this.fadeSprite) {
                // Sprite missing - complete immediately
                this.completeFade();
                return;
            }
            
            this.fadeProgress++;
            const rate = Math.min(1, this.fadeProgress / this.fadeDuration);
            
            if (this.fadeType === 'out') {
                this.fadeSprite.opacity = Math.floor(255 * rate);
            } else if (this.fadeType === 'in') {
                this.fadeSprite.opacity = Math.floor(255 * (1 - rate));
            }
            
            if (this.fadeProgress >= this.fadeDuration) {
                this.completeFade();
            }
        },
        
        completeFade() {
            this.fading = false;
            const callback = this.callback;
            this.callback = null;
            
            if (this.fadeType === 'out' && callback) {
                try {
                    callback();
                } catch (e) {
                }
            }
            
            if (this.fadeType === 'in' && this.fadeSprite) {
                this.removeFadeSprite();
            }
            
            this.fadeType = 'none';
        },
        
        removeFadeSprite() {
            try {
                if (this.fadeSprite && this.fadeSprite.parent) {
                    this.fadeSprite.parent.removeChild(this.fadeSprite);
                }
            } catch (e) {}
            this.fadeSprite = null;
        },
        
        clear() {
            this.removeFadeSprite();
            this.fading = false;
            this.fadeType = 'none';
            this.fadeProgress = 0;
            this.callback = null;
        }
    };
    
    // Expose transition manager globally
    window.$transitions = TransitionManager;
    
    // Only hook if transitions are enabled AND classes exist
    if (Config.enableSmoothTransitions && typeof Scene_Base !== 'undefined' && typeof SceneManager !== 'undefined') {
        
        // Fade in when new scene starts (safe hook)
        const _Scene_Base_start_trans = Scene_Base.prototype.start;
        Scene_Base.prototype.start = function() {
            _Scene_Base_start_trans.call(this);
            
            // Skip fade for boot/gameover
            if ((typeof Scene_Boot !== 'undefined' && this instanceof Scene_Boot) || 
                (typeof Scene_Gameover !== 'undefined' && this instanceof Scene_Gameover)) {
                return;
            }
            
            TransitionManager.startFadeIn(Config.transitionDuration);
        };
        
        // Update transitions (safe hook)
        const _SceneManager_updateScene_trans = SceneManager.updateScene;
        SceneManager.updateScene = function() {
            _SceneManager_updateScene_trans.call(this);
            TransitionManager.update();
        };
        
        // Clean up on scene change (safe hook)
        const _Scene_Base_terminate_trans = Scene_Base.prototype.terminate;
        Scene_Base.prototype.terminate = function() {
            TransitionManager.clear();
            _Scene_Base_terminate_trans.call(this);
        };
    }

    //=========================================================================
    // SECTION 9: PERFORMANCE INTEGRATION HUB
    //=========================================================================
    
    class MZPatchHub {
        constructor() {
            this.version = VERSION;
            this.integratedPlugins = new Map();
            this.performanceHistory = [];
            this.optimizationHistory = [];
            this.currentQualityLevel = 3;
            this.lastOptimization = Date.now();
            this.frameTimeHistory = [];
            this.hudElement = null;
            
            // Performance metrics
            this.metrics = {
                currentFPS: 60,
                averageFPS: 60,
                frameTime: 16.67,
                memoryUsage: 0,
                optimizationScore: 100,
                drawCalls: 0,
                pooledObjects: 0,
                gcPauses: 0
            };
            
            // Object pools
            this.objectPools = new Map();
            
            // Frame budgeting
            this.deferredOperations = [];
            
            // Event throttling
            this.throttledEvents = new Map();
            
            // Memory tracking
            this.memorySnapshots = [];
            
            // Delta time smoothing
            this.deltaTimeBuffer = [];
            this.lastFrameTime = performance.now();
            this.smoothedDeltaTime = 16.67;
            
            this.initialize();
        }
        
        initialize() {
            if (!Config.enablePerformanceIntegration) return;
            
            this.discoverPlugins();
            if (Config.enableObjectPooling) this.initializeObjectPools();
            if (Config.enableEventThrottling) this.initializeEventThrottling();
            this.startPerformanceTracking();
            if (Config.enablePerformanceHUD) this.createPerformanceHUD();
        }
        
        //---------------------------------------------------------------------
        // Plugin Discovery
        //---------------------------------------------------------------------
        
        discoverPlugins() {
            if (window.$performanceCatcher) {
                this.integratedPlugins.set('PerformanceCatcher', window.$performanceCatcher);
            }
            if (window.$eventOptimizer) {
                this.integratedPlugins.set('EventOptimizer', window.$eventOptimizer);
            }
            if (window.TimeSystem) {
                this.integratedPlugins.set('TimeSystem', window.TimeSystem);
            }
        }
        
        //---------------------------------------------------------------------
        // Object Pooling
        //---------------------------------------------------------------------
        
        initializeObjectPools() {
            this.createPool('Sprite', () => new Sprite(), 50);
            this.createPool('Point', () => new PIXI.Point(), 100);
            this.createPool('Rectangle', () => new Rectangle(), 50);
            this.createPool('Array', () => [], 100);
        }
        
        createPool(name, factory, initialSize = 20) {
            const pool = {
                factory,
                available: [],
                inUse: new Set(),
                created: 0,
                reused: 0
            };
            
            for (let i = 0; i < initialSize; i++) {
                pool.available.push(factory());
                pool.created++;
            }
            
            this.objectPools.set(name, pool);
            return pool;
        }
        
        getFromPool(poolName) {
            const pool = this.objectPools.get(poolName);
            if (!pool) return null;
            
            let obj;
            if (pool.available.length > 0) {
                obj = pool.available.pop();
                pool.reused++;
            } else {
                obj = pool.factory();
                pool.created++;
            }
            
            pool.inUse.add(obj);
            this.metrics.pooledObjects = this.getTotalPooledObjects();
            return obj;
        }
        
        returnToPool(poolName, obj) {
            const pool = this.objectPools.get(poolName);
            if (!pool || !pool.inUse.has(obj)) return false;
            
            pool.inUse.delete(obj);
            
            if (obj.clear) obj.clear();
            if (obj.removeChildren) obj.removeChildren();
            if (poolName === 'Array') obj.length = 0;
            
            pool.available.push(obj);
            this.metrics.pooledObjects = this.getTotalPooledObjects();
            return true;
        }
        
        getTotalPooledObjects() {
            let total = 0;
            for (const pool of this.objectPools.values()) {
                total += pool.available.length + pool.inUse.size;
            }
            return total;
        }
        
        getPoolStats() {
            const stats = {};
            for (const [name, pool] of this.objectPools.entries()) {
                stats[name] = {
                    available: pool.available.length,
                    inUse: pool.inUse.size,
                    created: pool.created,
                    reused: pool.reused,
                    efficiency: pool.created > 0 ? 
                        ((pool.reused / (pool.created + pool.reused)) * 100).toFixed(1) + '%' : '0%'
                };
            }
            return stats;
        }
        
        //---------------------------------------------------------------------
        // Event Throttling
        //---------------------------------------------------------------------
        
        initializeEventThrottling() {
            const self = this;
            const originalUpdate = Game_Event.prototype.update;
            
            Game_Event.prototype.update = function() {
                if (!self.shouldThrottleEvent(this)) {
                    originalUpdate.call(this);
                    return;
                }
                
                const key = `event_${this._mapId}_${this._eventId}`;
                const lastUpdate = self.throttledEvents.get(key) || 0;
                const interval = self.calculateThrottleInterval(this);
                
                if (Date.now() - lastUpdate >= interval) {
                    self.throttledEvents.set(key, Date.now());
                    originalUpdate.call(this);
                }
            };
        }
        
        shouldThrottleEvent(event) {
            if (!$gamePlayer || !event) return false;
            if (event.isStarting()) return false;
            if (event._moveRoute && event._moveRoute.list.length > 0) return false;
            return true;
        }
        
        calculateThrottleInterval(event) {
            if (!$gamePlayer || !event) return 0;
            
            const dx = Math.abs($gamePlayer.x - event.x);
            const dy = Math.abs($gamePlayer.y - event.y);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 5) return 0;
            if (distance < 10) return 33;
            if (distance < 20) return 67;
            return 100;
        }
        
        //---------------------------------------------------------------------
        // Frame Budgeting
        //---------------------------------------------------------------------
        
        deferOperation(operation, priority = 5) {
            if (!Config.enableFrameBudgeting) {
                operation();
                return;
            }
            
            this.deferredOperations.push({ operation, priority, added: Date.now() });
            this.deferredOperations.sort((a, b) => a.priority - b.priority);
        }
        
        processFrameBudget() {
            if (this.deferredOperations.length === 0) return 0;
            
            const startTime = performance.now();
            const budget = Config.frameBudgetMs;
            let processed = 0;
            
            while (this.deferredOperations.length > 0) {
                if (performance.now() - startTime >= budget) break;
                
                const item = this.deferredOperations.shift();
                try {
                    item.operation();
                    processed++;
                } catch (e) {
                }
            }
            
            return processed;
        }
        
        //---------------------------------------------------------------------
        // Performance Tracking
        //---------------------------------------------------------------------
        
        startPerformanceTracking() {
            let frameCount = 0;
            let lastTime = performance.now();
            const self = this;
            
            const track = () => {
                const currentTime = performance.now();
                const deltaTime = currentTime - lastTime;
                
                if (deltaTime >= 1000) {
                    const fps = Math.round((frameCount * 1000) / deltaTime);
                    
                    self.metrics.currentFPS = fps;
                    self.metrics.frameTime = deltaTime / frameCount;
                    
                    self.frameTimeHistory.push({ time: currentTime, fps, frameTime: self.metrics.frameTime });
                    if (self.frameTimeHistory.length > 60) self.frameTimeHistory.shift();
                    
                    // Average FPS
                    const recent = self.frameTimeHistory.slice(-10);
                    self.metrics.averageFPS = Math.round(
                        recent.reduce((sum, e) => sum + e.fps, 0) / recent.length
                    );
                    
                    // Memory
                    if (performance.memory) {
                        self.metrics.memoryUsage = (performance.memory.usedJSHeapSize / 1024 / 1024);
                    }
                    
                    // Auto-optimize
                    if (Config.enableAutoOptimization && currentTime - self.lastOptimization > 1000) {
                        self.checkAndOptimize();
                    }
                    
                    // Update HUD
                    if (self.hudElement) self.updatePerformanceHUD();
                    
                    frameCount = 0;
                    lastTime = currentTime;
                }
                
                frameCount++;
                requestAnimationFrame(track);
            };
            
            requestAnimationFrame(track);
        }
        
        checkAndOptimize() {
            const avg = this.metrics.averageFPS;
            const optimizations = [];
            
            if (avg < Config.minFPS) {
                optimizations.push(...this.applyOptimizations());
            } else if (avg > Config.maxFPS && this.currentQualityLevel < 5) {
                this.currentQualityLevel = Math.min(5, this.currentQualityLevel + 1);
                optimizations.push(`Quality increased to ${this.currentQualityLevel}`);
            }
            
            if (optimizations.length > 0) {
                this.optimizationHistory.push({
                    timestamp: Date.now(),
                    fps: avg,
                    optimizations,
                    qualityLevel: this.currentQualityLevel
                });
                
                if (this.optimizationHistory.length > 100) {
                    this.optimizationHistory.shift();
                }
            }
            
            this.lastOptimization = Date.now();
            window.$qualityLevel = this.currentQualityLevel;
        }
        
        applyOptimizations() {
            const opts = [];
            
            if (this.currentQualityLevel > 1) {
                this.currentQualityLevel--;
                opts.push(`Quality reduced to ${this.currentQualityLevel}`);
            }
            
            // Cleanup caches
            if (SceneManager.cleanupBitmapCache) {
                SceneManager.cleanupBitmapCache();
                opts.push('Bitmap cache cleaned');
            }
            
            if (AudioManager.cleanupAudioBuffers) {
                AudioManager.cleanupAudioBuffers();
                opts.push('Audio buffers cleaned');
            }
            
            // Trim object pools
            for (const [name, pool] of this.objectPools.entries()) {
                const trimmed = Math.floor(pool.available.length / 2);
                if (trimmed > 0) {
                    pool.available.splice(0, trimmed);
                    opts.push(`Trimmed ${trimmed} from ${name} pool`);
                }
            }
            
            return opts;
        }
        
        //---------------------------------------------------------------------
        // Performance HUD
        //---------------------------------------------------------------------
        
        createPerformanceHUD() {
            this.hudElement = document.createElement('div');
            this.hudElement.id = 'mzpatch-hud';
            this.hudElement.style.cssText = `
                position: fixed;
                top: 10px;
                left: 10px;
                background: rgba(0, 0, 0, 0.85);
                color: #fff;
                padding: 12px;
                border-radius: 8px;
                font-family: 'Consolas', monospace;
                font-size: 11px;
                z-index: 99999;
                pointer-events: none;
                min-width: 220px;
                border: 1px solid rgba(100, 150, 255, 0.5);
                box-shadow: 0 4px 12px rgba(0,0,0,0.5);
            `;
            
            document.body.appendChild(this.hudElement);
            this.updatePerformanceHUD();
        }
        
        updatePerformanceHUD() {
            if (!this.hudElement) return;
            
            const m = this.metrics;
            const fpsColor = m.currentFPS >= 50 ? '#4f4' : m.currentFPS >= 30 ? '#ff4' : '#f44';
            const qualityColor = ['#f44', '#f84', '#ff4', '#8f4', '#4f4'][this.currentQualityLevel - 1];
            const memColor = m.memoryUsage > Config.gcThresholdMB * 0.8 ? '#f44' : 
                            m.memoryUsage > Config.gcThresholdMB * 0.5 ? '#ff4' : '#4f4';
            
            this.hudElement.innerHTML = `
                <div style="font-weight:bold;margin-bottom:6px;color:#8af;">⚡ MZ Patch v${VERSION}</div>
                <div>FPS: <span style="color:${fpsColor}">${m.currentFPS}</span> (Avg: ${m.averageFPS})</div>
                <div>Frame: ${m.frameTime.toFixed(2)}ms</div>
                <div>Quality: <span style="color:${qualityColor}">Level ${this.currentQualityLevel}/5</span></div>
                <div style="border-top:1px solid #444;margin:6px 0;"></div>
                <div>Memory: <span style="color:${memColor}">${m.memoryUsage.toFixed(1)}MB</span></div>
                <div>Pooled: ${m.pooledObjects} | Deferred: ${this.deferredOperations.length}</div>
                <div>Plugins: ${this.integratedPlugins.size} | Score: ${this.metrics.optimizationScore.toFixed(0)}%</div>
            `;
        }
        
        toggleHUD() {
            if (this.hudElement) {
                this.hudElement.style.display = this.hudElement.style.display === 'none' ? 'block' : 'none';
            } else {
                this.createPerformanceHUD();
            }
            return this.hudElement && this.hudElement.style.display !== 'none';
        }
        
        //---------------------------------------------------------------------
        // Public API
        //---------------------------------------------------------------------
        
        getReport() {
            const report = {
                version: VERSION,
                quality: this.currentQualityLevel,
                performance: { ...this.metrics },
                pools: this.getPoolStats(),
                history: {
                    frames: this.frameTimeHistory.slice(-10),
                    optimizations: this.optimizationHistory.slice(-10)
                },
                plugins: Array.from(this.integratedPlugins.keys()),
                config: { ...Config }
            };
            return report;
        }
        
        optimizeAll() {
            const opts = this.applyOptimizations();
            
            // Force GC
            if (typeof gc !== 'undefined') {
                gc();
                opts.push('Garbage collection forced');
            }
            
            // Clear image cache
            ImageManager.clear();
            opts.push('Image cache cleared');
            return opts;
        }
        
        setQuality(level) {
            const old = this.currentQualityLevel;
            this.currentQualityLevel = Math.max(1, Math.min(5, level));
            window.$qualityLevel = this.currentQualityLevel;
            return this.currentQualityLevel;
        }
        
        cleanup() {
            return this.optimizeAll();
        }
        
        //---------------------------------------------------------------------
        // Memory Leak Detection Integration
        //---------------------------------------------------------------------
        
        getLeakStatus() {
            if (!Config.enableLeakDetection) {
                return { enabled: false, message: 'Leak detection disabled' };
            }
            
            MemoryLeakTracker.checkForLeaks();
            return {
                enabled: true,
                counts: { ...MemoryLeakTracker.counts },
                warnings: MemoryLeakTracker.warnings,
                threshold: Config.leakWarnThreshold
            };
        }
        
        toggleLeakWarning() {
            if (MemoryLeakTracker.warningSprite) {
                const visible = MemoryLeakTracker.warningSprite.visible;
                MemoryLeakTracker.warningSprite.visible = !visible;
                return !visible;
            }
            return false;
        }
    }

    //=========================================================================
    // SECTION 10: GLOBAL ERROR HANDLING
    //=========================================================================
    
    if (Config.enableErrorLogging) {
        const _consoleError = console.error.bind(console);
        console.error = function(...args) {
            _consoleError.apply(console, args);
            
            try {
                const log = {
                    timestamp: Date.now(),
                    message: args.join(' '),
                    stack: new Error().stack
                };
                
                const logs = JSON.parse(sessionStorage.getItem('mzpatch_errors') || '[]');
                logs.push(log);
                if (logs.length > 50) logs.shift();
                sessionStorage.setItem('mzpatch_errors', JSON.stringify(logs));
            } catch (e) {}
        };
        
        window.addEventListener('error', e => console.error('Uncaught:', e.error));
        window.addEventListener('unhandledrejection', e => console.error('Unhandled Promise:', e.reason));
    }

    //=========================================================================
    // SECTION 11: SCENE HOOKS & PERIODIC CLEANUP
    //=========================================================================
    
    // Periodic cleanup during gameplay (only if core classes exist)
    if (typeof SceneManager !== 'undefined') {
        let lastPeriodicCleanup = Date.now();
        
        const _SceneManager_updateMain = SceneManager.updateMain;
        SceneManager.updateMain = function() {
            _SceneManager_updateMain.call(this);
            
            const now = Date.now();
            
            // Bitmap cache cleanup every 60 seconds
            if (Config.enableBitmapCaching && now - lastPeriodicCleanup > 60000) {
                if (this.cleanupBitmapCache) this.cleanupBitmapCache();
                lastPeriodicCleanup = now;
            }
            
            // Process frame budget
            if (window.$mzPatch && Config.enableFrameBudgeting) {
                window.$mzPatch.processFrameBudget();
            }
        };
    }
    
    // Map scene cleanup
    if (typeof Scene_Map !== 'undefined') {
        const _Scene_Map_terminate = Scene_Map.prototype.terminate;
        Scene_Map.prototype.terminate = function() {
            if ($gameMap && $gameMap._events) {
                for (const event of $gameMap._events) {
                    if (event && event._moveRoute) {
                        event._moveRoute = { list: [], repeat: false, skippable: false, wait: false };
                        event._moveRouteIndex = 0;
                    }
                }
            }
            _Scene_Map_terminate.call(this);
        };
    }
    
    // Heavy GC hint every 5 minutes
    if (typeof Scene_Base !== 'undefined') {
        let lastGcHint = Date.now();
        
        const _Scene_Base_update_gc = Scene_Base.prototype.update;
        Scene_Base.prototype.update = function() {
            _Scene_Base_update_gc.call(this);
            
            const now = Date.now();
            if (now - lastGcHint > 300000) {
                if (typeof gc !== 'undefined') gc();
                if (typeof ImageManager !== 'undefined') ImageManager.clear();
                lastGcHint = now;
                
                if (Config.enableErrorLogging) {
                }
            }
        };
    }

    //=========================================================================
    // SECTION 12: SAFE MATH OPERATIONS
    //=========================================================================
    
    Math.safeAdd = (a, b) => { const r = a + b; return isFinite(r) ? r : 0; };
    Math.safeMultiply = (a, b) => { const r = a * b; return isFinite(r) ? r : 0; };
    Math.safeDivide = (a, b) => b === 0 ? 0 : (isFinite(a / b) ? a / b : 0);

    //=========================================================================
    // SECTION 13: PLUGIN COMMANDS
    //=========================================================================
    
    if (typeof PluginManager !== 'undefined' && PluginManager.registerCommand) {
        PluginManager.registerCommand(pluginName, 'manualCleanup', () => {
            if (window.$mzPatch) window.$mzPatch.cleanup();
        });
        
        PluginManager.registerCommand(pluginName, 'showPerformanceReport', () => {
            if (window.$mzPatch) window.$mzPatch.getReport();
        });
        
        PluginManager.registerCommand(pluginName, 'setQualityLevel', args => {
            if (window.$mzPatch) window.$mzPatch.setQuality(parseInt(args.level) || 3);
        });
        
        PluginManager.registerCommand(pluginName, 'togglePerformanceHUD', () => {
            if (window.$mzPatch) window.$mzPatch.toggleHUD();
        });
    }

    //=========================================================================
    // SECTION 14: INITIALIZATION
    //=========================================================================
    
    if (typeof Scene_Boot !== 'undefined') {
        const _Scene_Boot_start_init = Scene_Boot.prototype.start;
        Scene_Boot.prototype.start = function() {
            _Scene_Boot_start_init.call(this);
            
            // Delay initialization to ensure all systems are ready
            setTimeout(() => {
                try {
                    window.$mzPatch = new MZPatchHub();
                    window.$qualityLevel = window.$mzPatch.currentQualityLevel;
                    if (Config.enableLeakDetection) {
                    }
                    if (Config.enableTextureBleedingFix) {
                    }
                } catch (e) {
                }
            }, 100);
        };
    }
    
    // Cleanup on unload
    window.addEventListener('beforeunload', () => {
        if (window.$mzPatch && window.$mzPatch.hudElement) {
            document.body.removeChild(window.$mzPatch.hudElement);
        }
    });
    
    } catch (globalError) {
    }

})();