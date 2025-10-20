//=============================================================================
// StabilityAndCompatibilityFixes.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.0.2] Comprehensive stability fixes and memory management for long gameplay sessions
@author Alexandros Panagiotakopoulos
@url alexandrospanag.github.io
@Date 20/10/2025

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
@desc Maximum memory allocated for bitmap cache in megabytes

@param enableAutoSaveBackup
@text Enable Auto-Save Backup
@type boolean
@default true
@desc Creates backup saves to prevent corruption

@param enableErrorLogging
@text Enable Error Logging
@type boolean
@default true
@desc Logs errors to console for debugging

@param enablePerformanceMonitor
@text Enable Performance Monitor
@type boolean
@default false
@desc Monitors game performance (for debugging only)

@help
================================================================================
Stability and Compatibility Fixes Plugin
================================================================================
This plugin resolves common RPG Maker MZ stability issues that appear during
long gameplay sessions (100+ hours) and addresses compatibility issues with
older NW.js versions.

Features:
- Memory leak prevention
- Bitmap cache management
- Audio cleanup
- Event interpreter optimization
- Save file corruption prevention
- Error handling and recovery
- Performance monitoring
- Polyfills for older JavaScript environments

Issues Fixed:
- Memory leaks from bitmap accumulation
- Audio files not properly releasing
- Save file corruption
- Event interpreter memory buildup
- WebGL context loss recovery
- Sprite disposal issues
- Animation memory leaks
- Battle system memory accumulation

Place this plugin BEFORE other plugins in your plugin list for maximum effect.

================================================================================
*/

(() => {
    'use strict';
    
    const pluginName = 'StabilityAndCompatibilityFixes';
    const parameters = PluginManager.parameters(pluginName);
    
    const enableMemoryManagement = parameters['enableMemoryManagement'] === 'true';
    const enableBitmapCaching = parameters['enableBitmapCaching'] === 'true';
    const maxBitmapCacheSize = parseInt(parameters['maxBitmapCacheSize']) || 150;
    const enableAutoSaveBackup = parameters['enableAutoSaveBackup'] === 'true';
    const enableErrorLogging = parameters['enableErrorLogging'] === 'true';
    const enablePerformanceMonitor = parameters['enablePerformanceMonitor'] === 'true';
    
    //=============================================================================
    // JavaScript Polyfills for Older NW.js Versions
    //=============================================================================
    
    // Array.prototype.flat polyfill
    if (!Array.prototype.flat) {
        Array.prototype.flat = function(depth = 1) {
            const flatten = (arr, depth) => {
                if (depth < 1) return arr.slice();
                return arr.reduce((acc, val) => {
                    return acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val);
                }, []);
            };
            return flatten(this, depth);
        };
    }
    
    // Array.prototype.flatMap polyfill
    if (!Array.prototype.flatMap) {
        Array.prototype.flatMap = function(callback, thisArg) {
            return this.map(callback, thisArg).flat();
        };
    }
    
    // Object.fromEntries polyfill
    if (!Object.fromEntries) {
        Object.fromEntries = function(entries) {
            const obj = {};
            for (const [key, value] of entries) {
                obj[key] = value;
            }
            return obj;
        };
    }
    
    // Promise.allSettled polyfill
    if (!Promise.allSettled) {
        Promise.allSettled = function(promises) {
            return Promise.all(
                promises.map(promise =>
                    Promise.resolve(promise)
                        .then(value => ({ status: 'fulfilled', value }))
                        .catch(reason => ({ status: 'rejected', reason }))
                )
            );
        };
    }
    
    //=============================================================================
    // Global Error Handling
    //=============================================================================
    
    if (enableErrorLogging) {
        const _originalConsoleError = console.error;
        console.error = function(...args) {
            _originalConsoleError.apply(console, args);
            
            // Store error in session storage for debugging
            try {
                const errorLog = {
                    timestamp: Date.now(),
                    message: args.join(' '),
                    stack: new Error().stack
                };
                
                const existingLogs = JSON.parse(sessionStorage.getItem('rpgmz_error_log') || '[]');
                existingLogs.push(errorLog);
                
                // Keep only last 50 errors
                if (existingLogs.length > 50) {
                    existingLogs.shift();
                }
                
                sessionStorage.setItem('rpgmz_error_log', JSON.stringify(existingLogs));
            } catch (e) {
                // Ignore if storage is full
            }
        };
        
        window.addEventListener('error', function(event) {
            console.error('Uncaught Error:', event.error);
        });
        
        window.addEventListener('unhandledrejection', function(event) {
            console.error('Unhandled Promise Rejection:', event.reason);
        });
    }
    
    //=============================================================================
    // Bitmap Cache Management
    //=============================================================================
    
    if (enableBitmapCaching) {
        const _ImageManager_clear = ImageManager.clear;
        ImageManager.clear = function() {
            _ImageManager_clear.call(this);
            // Force garbage collection hint
            if (typeof gc !== 'undefined') {
                gc();
            }
        };
        
        // Monitor and limit bitmap cache
        const _Bitmap_initialize = Bitmap.prototype.initialize;
        Bitmap.prototype.initialize = function(width, height) {
            _Bitmap_initialize.call(this, width, height);
            this._creationTime = Date.now();
        };
        
        // Periodic cache cleanup
        let lastCacheCleanup = Date.now();
        const _SceneManager_updateMain = SceneManager.updateMain;
        SceneManager.updateMain = function() {
            _SceneManager_updateMain.call(this);
            
            const now = Date.now();
            if (now - lastCacheCleanup > 60000) { // Every 60 seconds
                this.cleanupBitmapCache();
                lastCacheCleanup = now;
            }
        };
        
        SceneManager.cleanupBitmapCache = function() {
            const cache = ImageManager._cache;
            if (!cache) return;
            
            const keys = Object.keys(cache);
            let totalSize = 0;
            const cacheInfo = [];
            
            // Calculate total cache size
            for (const key of keys) {
                const bitmap = cache[key];
                if (bitmap && bitmap.width && bitmap.height) {
                    const size = bitmap.width * bitmap.height * 4; // RGBA
                    totalSize += size;
                    cacheInfo.push({ key, bitmap, size, time: bitmap._creationTime || 0 });
                }
            }
            
            const maxSize = maxBitmapCacheSize * 1024 * 1024;
            
            if (totalSize > maxSize) {
                // Sort by creation time (oldest first)
                cacheInfo.sort((a, b) => a.time - b.time);
                
                let removedSize = 0;
                for (const info of cacheInfo) {
                    if (totalSize - removedSize <= maxSize * 0.8) break;
                    
                    if (info.bitmap && info.bitmap.destroy) {
                        info.bitmap.destroy();
                    }
                    delete cache[info.key];
                    removedSize += info.size;
                }
                
                if (enableErrorLogging) {
                    console.log(`Bitmap cache cleanup: Removed ${(removedSize / 1024 / 1024).toFixed(2)}MB`);
                }
            }
        };
    }
    
    //=============================================================================
    // Audio Memory Management
    //=============================================================================
    
    if (enableMemoryManagement) {
        // Clean up audio buffers properly
        const _AudioManager_stopAll = AudioManager.stopAll;
        AudioManager.stopAll = function() {
            _AudioManager_stopAll.call(this);
            
            // Release audio buffers
            for (const buffer of this._seBuffers) {
                if (buffer && buffer.clear) {
                    buffer.clear();
                }
            }
            
            if (this._bgsBuffer) {
                this._bgsBuffer.clear();
            }
        };
        
        // Periodic audio cleanup
        let lastAudioCleanup = Date.now();
        const _AudioManager_update = AudioManager.update;
        AudioManager.update = function() {
            _AudioManager_update.call(this);
            
            const now = Date.now();
            if (now - lastAudioCleanup > 120000) { // Every 2 minutes
                this.cleanupAudioBuffers();
                lastAudioCleanup = now;
            }
        };
        
        AudioManager.cleanupAudioBuffers = function() {
            // Remove stopped SE buffers
            this._seBuffers = this._seBuffers.filter(buffer => {
                if (buffer && !buffer.isPlaying()) {
                    buffer.clear();
                    return false;
                }
                return true;
            });
        };
    }
    
    //=============================================================================
    // Sprite Disposal Fixes
    //=============================================================================
    
    if (enableMemoryManagement) {
        const _Sprite_destroy = Sprite.prototype.destroy;
        Sprite.prototype.destroy = function(options) {
            // Ensure proper cleanup of filters
            if (this.filters) {
                this.filters = null;
            }
            
            // Clear bitmap reference
            if (this.bitmap && !this.bitmap._url) {
                this.bitmap = null;
            }
            
            _Sprite_destroy.call(this, options);
        };
        
        // Fix Spriteset disposal
        const _Spriteset_Base_destroy = Spriteset_Base.prototype.destroy;
        Spriteset_Base.prototype.destroy = function(options) {
            this.removeAllChildren();
            _Spriteset_Base_destroy.call(this, options);
        };
        
        Spriteset_Base.prototype.removeAllChildren = function() {
            while (this.children.length > 0) {
                const child = this.children[0];
                this.removeChild(child);
                if (child.destroy) {
                    child.destroy();
                }
            }
        };
    }
    
    //=============================================================================
    // Save File Corruption Prevention
    //=============================================================================
    
    if (enableAutoSaveBackup) {
        const _DataManager_saveGame = DataManager.saveGame;
        DataManager.saveGame = function(savefileId) {
            // Create backup before saving (only if save exists)
            const saveName = this.makeSavename(savefileId);
            const backupId = `backup_${savefileId}`;
            
            // Use async approach with proper error handling
            StorageManager.loadObject(saveName)
                .then(existingData => {
                    if (existingData) {
                        return StorageManager.saveObject(this.makeSavename(backupId), existingData);
                    }
                })
                .catch(e => {
                    // Silently ignore if no existing save (first time saving to this slot)
                    if (enableErrorLogging && e.message !== 'Savefile not found') {
                        console.error('Backup save failed:', e);
                    }
                });
            
            return _DataManager_saveGame.call(this, savefileId);
        };
        
        const _DataManager_loadGame = DataManager.loadGame;
        DataManager.loadGame = function(savefileId) {
            try {
                return _DataManager_loadGame.call(this, savefileId);
            } catch (e) {
                console.error('Load failed, attempting backup:', e);
                
                // Try loading from backup
                try {
                    const backupId = `backup_${savefileId}`;
                    const backup = StorageManager.loadObject(this.makeSavename(backupId));
                    if (backup) {
                        this.extractSaveContents(backup);
                        return true;
                    }
                } catch (backupError) {
                    console.error('Backup load also failed:', backupError);
                }
                
                return false;
            }
        };
    }
    
    //=============================================================================
    // Event Interpreter Memory Management
    //=============================================================================
    
    if (enableMemoryManagement) {
        const _Game_Interpreter_clear = Game_Interpreter.prototype.clear;
        Game_Interpreter.prototype.clear = function() {
            _Game_Interpreter_clear.call(this);
            
            // Clear all temporary data
            this._comments = null;
            this._waitMode = '';
            this._waitCount = 0;
        };
        // Add safety check for move routes
        const _Game_Character_updateRoutineMove = Game_Character.prototype.updateRoutineMove;
        Game_Character.prototype.updateRoutineMove = function() {
            // Ensure move route exists and has required structure
            if (!this._moveRoute || !this._moveRoute.list) {
                this._moveRoute = { list: [], repeat: false, skippable: false, wait: false };
                this._moveRouteIndex = 0;
                this._moveRouteForcing = false;
                return;
            }
            _Game_Character_updateRoutineMove.call(this);
        };
        
        // Prevent infinite loops
        const _Game_Interpreter_update = Game_Interpreter.prototype.update;
        Game_Interpreter.prototype.update = function() {
            this._loopCounter = (this._loopCounter || 0) + 1;
            
            if (this._loopCounter > 100000) {
                console.error('Event interpreter loop limit exceeded - terminating');
                this.terminate();
                this._loopCounter = 0;
                return;
            }
            
            _Game_Interpreter_update.call(this);
            
            if (!this.isRunning()) {
                this._loopCounter = 0;
            }
        };
    }
    
    //=============================================================================
    // WebGL Context Loss Recovery
    //=============================================================================
    
    if (enableMemoryManagement) {
        const canvas = Graphics._canvas;
        if (canvas) {
            canvas.addEventListener('webglcontextlost', function(event) {
                event.preventDefault();
                console.warn('WebGL context lost - attempting recovery');
                
                setTimeout(() => {
                    location.reload();
                }, 1000);
            });
            
            canvas.addEventListener('webglcontextrestored', function() {
                console.log('WebGL context restored');
            });
        }
    }
    
    //=============================================================================
    // Performance Monitoring (Debug)
    //=============================================================================
    
    if (enablePerformanceMonitor) {
        let frameCount = 0;
        let lastFpsUpdate = Date.now();
        let currentFps = 60;
        
        const _SceneManager_updateMain = SceneManager.updateMain;
        SceneManager.updateMain = function() {
            _SceneManager_updateMain.call(this);
            
            frameCount++;
            const now = Date.now();
            
            if (now - lastFpsUpdate >= 1000) {
                currentFps = frameCount;
                frameCount = 0;
                lastFpsUpdate = now;
                
                if (currentFps < 30) {
                    console.warn(`Low FPS detected: ${currentFps}`);
                }
            }
        };
        
        // Add FPS display
        SceneManager.showFps = function() {
            return currentFps;
        };
    }
    
    //=============================================================================
    // Battle System Memory Management
    //=============================================================================
    
    if (enableMemoryManagement) {
        const _BattleManager_endBattle = BattleManager.endBattle;
        BattleManager.endBattle = function(result) {
            _BattleManager_endBattle.call(this, result);
            
            // Clear battle-specific data
            this._actionBattlers = [];
            this._subject = null;
            this._action = null;
            this._targets = [];
            
            // Force sprite cleanup
            if (SceneManager._scene && SceneManager._scene._spriteset) {
                const spriteset = SceneManager._scene._spriteset;
                if (spriteset.destroy) {
                    spriteset.destroy();
                }
            }
        };
    }
    
    //=============================================================================
    // Animation Memory Leak Prevention
    //=============================================================================
    
    if (enableMemoryManagement) {
    const _Scene_Map_terminate = Scene_Map.prototype.terminate;
    Scene_Map.prototype.terminate = function() {
        // Clear all map events safely
        if ($gameMap && $gameMap._events) {
            for (const event of $gameMap._events) {
                if (event) {
                    event._moveRouteIndex = 0;
                    // Don't set to null - reset to default empty structure
                    if (event._moveRoute) {
                        event._moveRoute = { list: [], repeat: false, skippable: false, wait: false };
                    }
                }
            }
        }
            
        _Scene_Map_terminate.call(this);
    };
}

//=============================================================================
// Map Memory Management
    //=============================================================================
    
    //=============================================================================
    // Map Memory Management
    //=============================================================================
    
    if (enableMemoryManagement) {
        const _Scene_Map_terminate = Scene_Map.prototype.terminate;
        Scene_Map.prototype.terminate = function() {
            // Clear all map events safely
            if ($gameMap && $gameMap._events) {
                for (const event of $gameMap._events) {
                    if (event && event._moveRoute) {
                        // Reset to default empty structure instead of null
                        event._moveRoute = { 
                            list: [], 
                            repeat: false, 
                            skippable: false, 
                            wait: false 
                        };
                        event._moveRouteIndex = 0;
                    }
                }
            }
            
            _Scene_Map_terminate.call(this);
        };
    }
    
    //=============================================================================
    // Periodic Garbage Collection Hint
    //=============================================================================
    
    if (enableMemoryManagement) {
        let lastGcHint = Date.now();
        
        const _Scene_Base_update = Scene_Base.prototype.update;
        Scene_Base.prototype.update = function() {
            _Scene_Base_update.call(this);
            
            const now = Date.now();
            if (now - lastGcHint > 300000) { // Every 5 minutes
                if (typeof gc !== 'undefined') {
                    gc();
                }
                ImageManager.clear();
                lastGcHint = now;
                
                if (enableErrorLogging) {
                    console.log('Periodic memory cleanup executed');
                }
            }
        };
    }
    
    //=============================================================================
    // Safe Number Operations
    //=============================================================================
    
    // Prevent NaN and Infinity in calculations
    Math.safeAdd = function(a, b) {
        const result = a + b;
        return isFinite(result) ? result : 0;
    };
    
    Math.safeMultiply = function(a, b) {
        const result = a * b;
        return isFinite(result) ? result : 0;
    };
    
    Math.safeDivide = function(a, b) {
        if (b === 0) return 0;
        const result = a / b;
        return isFinite(result) ? result : 0;
    };
    
    //=============================================================================
    // Plugin Command for Manual Cleanup
    //=============================================================================
    
    PluginManager.registerCommand(pluginName, 'manualCleanup', args => {
        console.log('Manual cleanup initiated...');
        
        // Clear bitmap cache
        if (SceneManager.cleanupBitmapCache) {
            SceneManager.cleanupBitmapCache();
        }
        
        // Clear audio buffers
        if (AudioManager.cleanupAudioBuffers) {
            AudioManager.cleanupAudioBuffers();
        }
        
        // Clear image cache
        ImageManager.clear();
        
        // Garbage collection hint
        if (typeof gc !== 'undefined') {
            gc();
        }
        
        console.log('Manual cleanup completed');
    });
    
    PluginManager.registerCommand(pluginName, 'showMemoryInfo', args => {
        if (performance && performance.memory) {
            const memory = performance.memory;
            console.log('=== Memory Info ===');
            console.log(`Used: ${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
            console.log(`Total: ${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
            console.log(`Limit: ${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`);
        }
        
        if (enablePerformanceMonitor) {
            console.log(`Current FPS: ${SceneManager.showFps()}`);
        }
    });
    
    console.log(`${pluginName} v1.0.0 loaded successfully`);
    
})();
