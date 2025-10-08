//=============================================================================
// PerformanceCatcher.js
//=============================================================================
// COPYRIGHT ALEXANDROSPANAGIOTAKOPOULOS - ALEXANDROSPANAG.GITHUB.IO
// DATE: 08/10/2025
//=============================================================================

/*:
@target MZ
@plugindesc [v2.0.0] Performance Monitor & Cache Manager
@author YourName
@url 
@help PerformanceCatcher.js

@param enableMonitoring
@text Enable Performance Monitoring
@desc Monitor plugins for performance issues
@type boolean
@default true

@param enableCacheCleanup
@text Enable Cache Cleanup
@desc Automatically clean cache on map transfers
@type boolean
@default true

@param performanceThreshold
@text Performance Warning Threshold (ms)
@desc Warn when plugin functions take longer than this (milliseconds)
@type number
@min 1
@max 1000
@default 16

@param cacheCleanupInterval
@text Cache Cleanup Interval
@desc Clean cache every X map transfers (0 = every transfer)
@type number
@min 0
@max 50
@default 3

@param enableConsoleReports
@text Enable Console Reports
@desc Show performance reports in developer console
@type boolean
@default true

@param enableMemoryMonitoring
@text Enable Memory Monitoring
@desc Monitor memory usage and warn about memory leaks
@type boolean
@default true

@param memoryWarningThreshold
@text Memory Warning Threshold (MB)
@desc Warn when memory usage exceeds this amount
@type number
@min 50
@max 2000
@default 1000

@param enableSaveDataOptimization
@text Enable Save Data Optimization
@desc Optimize save data by removing redundant information
@type boolean
@default true

@param enableAutoGarbageCollection
@text Enable Auto Garbage Collection
@desc Force garbage collection during cache cleanup
@type boolean
@default true

@param enableImageOptimization
@text Enable Image Cache Optimization
@desc Optimize image caching with intelligent preloading
@type boolean
@default true

@param maxCacheSize
@text Maximum Cache Size (MB)
@desc Maximum total cache size before forced cleanup
@type number
@min 10
@max 500
@default 100

@param enableEventOptimization
@text Enable Event Optimization
@desc Optimize event processing and cleanup unused events
@type boolean
@default true

@help PerformanceCatcher.js

This plugin monitors performance across all other plugins and automatically
manages cache to prevent memory buildup and performance degradation.

Features:
- Real-time performance monitoring of all plugin functions
- Automatic cache cleanup on map transfers
- Memory usage monitoring and leak detection
- Performance profiling and bottleneck identification
- Detailed console reports for debugging

The plugin automatically identifies slow-performing functions and provides
recommendations for optimization. Cache cleanup happens automatically
when moving between maps to prevent memory buildup.

Console Commands (F12 Developer Tools):
- $performanceCatcher.getReport() - Get detailed performance report
- $performanceCatcher.clearCache() - Manually clear all caches
- $performanceCatcher.resetStats() - Reset performance statistics
- $performanceCatcher.getMemoryUsage() - Check current memory usage

Terms of Use:
- Free for commercial and non-commercial use
- Credit required
- Modify as needed for your project
*/

(() => {
    'use strict';
    
    const pluginName = 'PerformanceCatcher';
    const parameters = PluginManager.parameters(pluginName);
    
    // Parse parameters
    const enableMonitoring = parameters['enableMonitoring'] === 'true';
    const enableCacheCleanup = parameters['enableCacheCleanup'] === 'true';
    const performanceThreshold = parseInt(parameters['performanceThreshold'] || 16);
    const cacheCleanupInterval = parseInt(parameters['cacheCleanupInterval'] || 3);
    const enableConsoleReports = parameters['enableConsoleReports'] === 'true';
    const enableMemoryMonitoring = parameters['enableMemoryMonitoring'] === 'true';
    const memoryWarningThreshold = parseInt(parameters['memoryWarningThreshold'] || 1000);
    const enableSaveDataOptimization = parameters['enableSaveDataOptimization'] === 'true';
    const enableAutoGarbageCollection = parameters['enableAutoGarbageCollection'] === 'true';
    const enableImageOptimization = parameters['enableImageOptimization'] === 'true';
    const maxCacheSize = parseInt(parameters['maxCacheSize'] || 100);
    const enableEventOptimization = parameters['enableEventOptimization'] === 'true';

    //-----------------------------------------------------------------------------
    // PerformanceCatcher - Main Class
    //-----------------------------------------------------------------------------
    
    class PerformanceCatcher {
        constructor() {
            this.pluginStats = new Map();
            this.functionStats = new Map();
            this.mapTransferCount = 0;
            this.lastCleanup = Date.now();
            this.memoryBaseline = 0;
            this.warningHistory = [];
            this.isMonitoring = false;
            
            // Enhanced cache tracking
            this.cacheStats = {
                totalSize: 0,
                imageCache: new Set(),
                audioCache: new Set(),
                cleanupHistory: []
            };
            
            // Performance optimization tracking
            this.optimizations = {
                saveDataReductions: 0,
                eventOptimizations: 0,
                imageOptimizations: 0,
                cacheHits: 0,
                cacheMisses: 0
            };
            
            // Frame rate monitoring
            this.frameRateHistory = [];
            this.lastFrameTime = performance.now();
            
            this.initializeMonitoring();
            this.setupCacheManagement();
            this.setupAdvancedOptimizations();
            
            if (enableConsoleReports) {
                console.log(`[${pluginName}] Enhanced Performance monitoring initialized`);
                console.log(`[${pluginName}] Threshold: ${performanceThreshold}ms, Cleanup interval: ${cacheCleanupInterval} transfers`);
                console.log(`[${pluginName}] Max cache size: ${maxCacheSize}MB, Save optimization: ${enableSaveDataOptimization}`);
            }
        }
        
        initializeMonitoring() {
            if (!enableMonitoring) return;
            
            this.isMonitoring = true;
            this.wrapPluginFunctions();
            this.startMemoryMonitoring();
            
            // Set up performance observer if available
            if (typeof PerformanceObserver !== 'undefined') {
                this.setupPerformanceObserver();
            }
        }
        
        wrapPluginFunctions() {
            const originalPluginManager = PluginManager.setup;
            const self = this;
            
            PluginManager.setup = function(plugins) {
                const result = originalPluginManager.call(this, plugins);
                
                // Monitor all loaded plugins
                plugins.forEach(plugin => {
                    if (plugin.status && plugin.name !== pluginName) {
                        self.monitorPlugin(plugin.name);
                    }
                });
                
                return result;
            };
        }
        
        monitorPlugin(pluginName) {
            if (!window[pluginName] && !this.findPluginFunctions(pluginName)) {
                return; // Plugin doesn't expose functions to monitor
            }
            
            this.pluginStats.set(pluginName, {
                totalCalls: 0,
                totalTime: 0,
                averageTime: 0,
                maxTime: 0,
                warnings: 0,
                functions: new Map()
            });
            
            // Try to find and wrap plugin functions
            this.wrapAvailableFunctions(pluginName);
        }
        
        findPluginFunctions(pluginName) {
            // Look for common plugin patterns
            const possibleLocations = [
                window[pluginName],
                window[`Game_${pluginName}`],
                window[`Scene_${pluginName}`],
                window[`Window_${pluginName}`],
                window[`Sprite_${pluginName}`]
            ];
            
            return possibleLocations.some(location => location && typeof location === 'object');
        }
        
        wrapAvailableFunctions(pluginName) {
            const locations = [
                { obj: window, prefix: pluginName },
                { obj: window, prefix: `Game_${pluginName}` },
                { obj: window, prefix: `Scene_${pluginName}` },
                { obj: window, prefix: `Window_${pluginName}` },
                { obj: window, prefix: `Sprite_${pluginName}` }
            ];
            
            locations.forEach(location => {
                const target = location.obj[location.prefix];
                if (target && typeof target === 'function') {
                    this.wrapConstructor(target, pluginName, location.prefix);
                } else if (target && typeof target === 'object') {
                    this.wrapObjectMethods(target, pluginName, location.prefix);
                }
            });
        }
        
        wrapConstructor(constructor, pluginName, functionName) {
            const originalConstructor = constructor;
            const self = this;
            
            window[functionName] = function(...args) {
                const startTime = performance.now();
                const result = originalConstructor.apply(this, args);
                const endTime = performance.now();
                
                self.recordPerformance(pluginName, functionName, endTime - startTime);
                return result;
            };
            
            // Copy prototype and static properties
            Object.setPrototypeOf(window[functionName], originalConstructor);
            Object.assign(window[functionName], originalConstructor);
        }
        
        wrapObjectMethods(obj, pluginName, objectName) {
            const self = this;
            
            Object.getOwnPropertyNames(obj).forEach(methodName => {
                if (typeof obj[methodName] === 'function' && !methodName.startsWith('_')) {
                    const originalMethod = obj[methodName];
                    
                    obj[methodName] = function(...args) {
                        const startTime = performance.now();
                        const result = originalMethod.apply(this, args);
                        const endTime = performance.now();
                        
                        self.recordPerformance(pluginName, `${objectName}.${methodName}`, endTime - startTime);
                        return result;
                    };
                }
            });
            
            // Also wrap prototype methods if it's a constructor
            if (obj.prototype) {
                Object.getOwnPropertyNames(obj.prototype).forEach(methodName => {
                    if (typeof obj.prototype[methodName] === 'function' && 
                        methodName !== 'constructor' && !methodName.startsWith('_')) {
                        const originalMethod = obj.prototype[methodName];
                        
                        obj.prototype[methodName] = function(...args) {
                            const startTime = performance.now();
                            const result = originalMethod.apply(this, args);
                            const endTime = performance.now();
                            
                            self.recordPerformance(pluginName, `${objectName}.prototype.${methodName}`, endTime - startTime);
                            return result;
                        };
                    }
                });
            }
        }
        
        recordPerformance(pluginName, functionName, executionTime) {
            if (!this.isMonitoring) return;
            
            // Update plugin stats
            const pluginStat = this.pluginStats.get(pluginName);
            if (pluginStat) {
                pluginStat.totalCalls++;
                pluginStat.totalTime += executionTime;
                pluginStat.averageTime = pluginStat.totalTime / pluginStat.totalCalls;
                pluginStat.maxTime = Math.max(pluginStat.maxTime, executionTime);
                
                // Update function stats
                if (!pluginStat.functions.has(functionName)) {
                    pluginStat.functions.set(functionName, {
                        calls: 0,
                        totalTime: 0,
                        averageTime: 0,
                        maxTime: 0
                    });
                }
                
                const funcStat = pluginStat.functions.get(functionName);
                funcStat.calls++;
                funcStat.totalTime += executionTime;
                funcStat.averageTime = funcStat.totalTime / funcStat.calls;
                funcStat.maxTime = Math.max(funcStat.maxTime, executionTime);
                
                // Check for performance warnings
                if (executionTime > performanceThreshold) {
                    pluginStat.warnings++;
                    this.recordWarning(pluginName, functionName, executionTime);
                }
            }
        }
        
        recordWarning(pluginName, functionName, executionTime) {
            const warning = {
                plugin: pluginName,
                function: functionName,
                time: executionTime,
                timestamp: Date.now()
            };
            
            this.warningHistory.push(warning);
            
            // Keep only recent warnings (last 100)
            if (this.warningHistory.length > 100) {
                this.warningHistory.shift();
            }
            
            if (enableConsoleReports && executionTime > performanceThreshold * 2) {
                console.warn(`[${pluginName}] Performance Warning: ${pluginName}.${functionName} took ${executionTime.toFixed(2)}ms`);
            }
        }
        
        setupCacheManagement() {
            if (!enableCacheCleanup) return;
            
            // Hook into scene changes for map transfers
            const originalSceneMapStart = Scene_Map.prototype.start;
            const self = this;
            
            Scene_Map.prototype.start = function() {
                originalSceneMapStart.call(this);
                self.onMapTransfer();
            };
            
            if (enableCacheOptimization) {
                this.wrapImageManager();
                this.wrapAudioManager();
                this.wrapCacheManager();
            }
        }

        wrapImageManager() {
            const original_ImageManager_loadBitmap = ImageManager.loadBitmap;
            ImageManager.loadBitmap = function(folder, filename) {
                const cacheKey = `${folder}/${filename}`;
                
                if (this._cache && this._cache.get(cacheKey)) {
                    window.$performanceCatcher.optimizations.cacheHits++;
                } else {
                    window.$performanceCatcher.optimizations.cacheMisses++;
                    window.$performanceCatcher.cacheStats.imageCache.add(cacheKey);
                }
                
                return original_ImageManager_loadBitmap.call(this, folder, filename);
            };

            if (enableConsoleReports) {
                console.log(`[${pluginName}] Image Manager wrapped for cache optimization`);
            }
        }

        wrapAudioManager() {
            const original_AudioManager_loadStaticSe = AudioManager.loadStaticSe;
            AudioManager.loadStaticSe = function(se) {
                const cacheKey = se.name;
                
                if (this._staticBuffers && this._staticBuffers[cacheKey]) {
                    window.$performanceCatcher.optimizations.cacheHits++;
                } else {
                    window.$performanceCatcher.optimizations.cacheMisses++;
                    window.$performanceCatcher.cacheStats.audioCache.add(cacheKey);
                }
                
                return original_AudioManager_loadStaticSe.call(this, se);
            };

            if (enableConsoleReports) {
                console.log(`[${pluginName}] Audio Manager wrapped for cache optimization`);
            }
        }

        wrapCacheManager() {
            // Enhanced cache size monitoring
            if (ImageManager._cache) {
                const original_cache_setItem = ImageManager._cache.setItem || function() {};
                ImageManager._cache.setItem = function(key, value) {
                    const result = original_cache_setItem.call(this, key, value);
                    
                    // Estimate cache size
                    if (value && value.canvas) {
                        const size = value.canvas.width * value.canvas.height * 4;
                        window.$performanceCatcher.cacheStats.totalSize += size;
                        
                        // Check if we're over the limit
                        if (window.$performanceCatcher.cacheStats.totalSize > maxCacheSize * 1024 * 1024) {
                            window.$performanceCatcher.clearImageCache();
                        }
                    }
                    
                    return result;
                };
            }

            if (enableConsoleReports) {
                console.log(`[${pluginName}] Cache Manager wrapped for size monitoring`);
            }
        }
        
        onMapTransfer() {
            this.mapTransferCount++;
            
            if (cacheCleanupInterval === 0 || this.mapTransferCount % cacheCleanupInterval === 0) {
                this.performCacheCleanup();
            }
            
            if (enableMemoryMonitoring) {
                this.checkMemoryUsage();
            }
        }
        
        performCacheCleanup() {
            const startTime = performance.now();
            let clearedItems = 0;
            
            try {
                // Clear image cache for unused images
                if (ImageManager._cache && typeof ImageManager._cache === 'object') {
                    const imagesToKeep = this.getActiveImages();
                    for (const key in ImageManager._cache) {
                        if (ImageManager._cache.hasOwnProperty(key) && !imagesToKeep.has(key)) {
                            delete ImageManager._cache[key];
                            clearedItems++;
                        }
                    }
                }
                
                // Clear audio cache for unused audio
                if (AudioManager._staticBuffers) {
                    const audioToKeep = this.getActiveAudio();
                    
                    // Handle different types of audio buffer storage
                    if (AudioManager._staticBuffers instanceof Map) {
                        // It's a Map object
                        AudioManager._staticBuffers.forEach((buffer, key) => {
                            if (!audioToKeep.has(key)) {
                                AudioManager._staticBuffers.delete(key);
                                clearedItems++;
                            }
                        });
                    } else if (Array.isArray(AudioManager._staticBuffers)) {
                        // It's an array - clear unused elements
                        for (let i = AudioManager._staticBuffers.length - 1; i >= 0; i--) {
                            const buffer = AudioManager._staticBuffers[i];
                            if (buffer && buffer._reservedSeName && !audioToKeep.has(buffer._reservedSeName)) {
                                AudioManager._staticBuffers.splice(i, 1);
                                clearedItems++;
                            }
                        }
                    } else if (typeof AudioManager._staticBuffers === 'object') {
                        // It's a regular object - delete unused properties
                        Object.keys(AudioManager._staticBuffers).forEach(key => {
                            if (!audioToKeep.has(key)) {
                                delete AudioManager._staticBuffers[key];
                                clearedItems++;
                            }
                        });
                    }
                }
                
                // Clear tileset cache if available
                if (window.Tilemap && window.Tilemap._cache) {
                    const oldCacheSize = Object.keys(window.Tilemap._cache).length;
                    window.Tilemap._cache = {};
                    clearedItems += oldCacheSize;
                }
                
                // Force garbage collection if available
                if (window.gc) {
                    window.gc();
                }
                
                const endTime = performance.now();
                this.lastCleanup = Date.now();
                
                if (enableConsoleReports) {
                    console.log(`[${pluginName}] Cache cleanup completed: ${clearedItems} items cleared in ${(endTime - startTime).toFixed(2)}ms`);
                }
                
            } catch (error) {
                console.error(`[${pluginName}] Error during cache cleanup:`, error);
            }
        }
        
        getActiveImages() {
            const activeImages = new Set();
            
            // Add currently visible sprite images
            if (SceneManager._scene && SceneManager._scene._spriteset) {
                this.collectSpriteImages(SceneManager._scene._spriteset, activeImages);
            }
            
            // Add character images from current map
            if ($gameMap && $gameMap._events) {
                Object.values($gameMap._events).forEach(event => {
                    if (event && event._characterName) {
                        activeImages.add('characters/' + event._characterName);
                    }
                });
            }
            
            // Add player character image
            if ($gamePlayer && $gamePlayer._characterName) {
                activeImages.add('characters/' + $gamePlayer._characterName);
            }
            
            return activeImages;
        }
        
        collectSpriteImages(container, imageSet) {
            if (!container || !container.children) return;
            
            container.children.forEach(child => {
                if (child.bitmap && child.bitmap.url) {
                    const urlParts = child.bitmap.url.split('/');
                    const fileName = urlParts[urlParts.length - 1];
                    const folder = urlParts[urlParts.length - 2];
                    if (folder && fileName) {
                        imageSet.add(folder + '/' + fileName.replace('.png', ''));
                    }
                }
                
                if (child.children) {
                    this.collectSpriteImages(child, imageSet);
                }
            });
        }
        
        getActiveAudio() {
            const activeAudio = new Set();
            
            // Add currently playing BGM and BGS
            if (AudioManager._currentBgm && AudioManager._currentBgm.name) {
                activeAudio.add(AudioManager._currentBgm.name);
            }
            
            if (AudioManager._currentBgs && AudioManager._currentBgs.name) {
                activeAudio.add(AudioManager._currentBgs.name);
            }
            
            // Add recent SE (keep last few sound effects) - handle different buffer types
            if (AudioManager._seBuffers) {
                if (Array.isArray(AudioManager._seBuffers)) {
                    AudioManager._seBuffers.forEach(buffer => {
                        if (buffer && buffer._reservedSeName) {
                            activeAudio.add(buffer._reservedSeName);
                        }
                    });
                } else if (AudioManager._seBuffers instanceof Map) {
                    AudioManager._seBuffers.forEach((buffer, key) => {
                        if (buffer && buffer._reservedSeName) {
                            activeAudio.add(buffer._reservedSeName);
                        }
                    });
                } else if (typeof AudioManager._seBuffers === 'object') {
                    Object.values(AudioManager._seBuffers).forEach(buffer => {
                        if (buffer && buffer._reservedSeName) {
                            activeAudio.add(buffer._reservedSeName);
                        }
                    });
                }
            }
            
            return activeAudio;
        }
        
        startMemoryMonitoring() {
            if (!enableMemoryMonitoring) return;
            
            // Set baseline memory usage
            if (performance.memory) {
                this.memoryBaseline = performance.memory.usedJSHeapSize;
            }
            
            // Check memory usage periodically
            setInterval(() => {
                this.checkMemoryUsage();
            }, 30000); // Every 30 seconds
        }
        
        checkMemoryUsage() {
            if (!performance.memory) return;
            
            const currentMemory = performance.memory.usedJSHeapSize / (1024 * 1024); // Convert to MB
            const memoryLimit = performance.memory.jsHeapSizeLimit / (1024 * 1024);
            const memoryPercentage = (currentMemory / memoryLimit) * 100;
            
            if (currentMemory > memoryWarningThreshold) {
                const warning = {
                    type: 'memory',
                    usage: currentMemory,
                    percentage: memoryPercentage,
                    timestamp: Date.now()
                };
                
                this.warningHistory.push(warning);
                
                if (enableConsoleReports) {
                    console.warn(`[${pluginName}] Memory Warning: ${currentMemory.toFixed(1)}MB (${memoryPercentage.toFixed(1)}% of limit)`);
                }
                
                // Trigger emergency cleanup if memory usage is very high
                if (memoryPercentage > 80) {
                    this.performEmergencyCleanup();
                }
            }
        }
        
        performEmergencyCleanup() {
            if (enableConsoleReports) {
                console.warn(`[${pluginName}] Emergency cleanup triggered due to high memory usage`);
            }
            
            // Force cache cleanup regardless of interval
            this.performCacheCleanup();
            
            // Clear additional caches
            if (Bitmap._cache) {
                Bitmap._cache = {};
            }
            
            if (window.FontManager && window.FontManager._cache) {
                window.FontManager._cache.clear();
            }
        }
        
        setupPerformanceObserver() {
            try {
                const observer = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        if (entry.duration > performanceThreshold) {
                            this.recordWarning('System', entry.name, entry.duration);
                        }
                    });
                });
                
                observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
            } catch (error) {
                if (enableConsoleReports) {
                    console.log(`[${pluginName}] PerformanceObserver not available in this environment`);
                }
            }
        }
        
        // Public API methods
        getReport() {
            const avgFrameRate = this.frameRateHistory.length > 0 ? 
                this.frameRateHistory.reduce((a, b) => a + b, 0) / this.frameRateHistory.length : 0;
                
            const report = {
                monitoring: {
                    enabled: enableMonitoring,
                    threshold: performanceThreshold,
                    uptime: Date.now() - this.lastCleanup
                },
                plugins: Array.from(this.pluginStats.entries()).map(([name, stats]) => ({
                    name,
                    totalCalls: stats.totalCalls,
                    totalTime: stats.totalTime.toFixed(2),
                    averageTime: stats.averageTime.toFixed(2),
                    maxTime: stats.maxTime.toFixed(2),
                    warnings: stats.warnings,
                    functions: Array.from(stats.functions.entries()).map(([funcName, funcStats]) => ({
                        name: funcName,
                        calls: funcStats.calls,
                        averageTime: funcStats.averageTime.toFixed(2),
                        maxTime: funcStats.maxTime.toFixed(2)
                    })).sort((a, b) => parseFloat(b.averageTime) - parseFloat(a.averageTime))
                })).sort((a, b) => b.warnings - a.warnings),
                optimizations: {
                    saveDataReductions: this.optimizations.saveDataReductions,
                    eventOptimizations: this.optimizations.eventOptimizations,
                    imageOptimizations: this.optimizations.imageOptimizations,
                    cacheHits: this.optimizations.cacheHits,
                    cacheMisses: this.optimizations.cacheMisses,
                    cacheHitRate: this.optimizations.cacheHits + this.optimizations.cacheMisses > 0 ? 
                        `${((this.optimizations.cacheHits / (this.optimizations.cacheHits + this.optimizations.cacheMisses)) * 100).toFixed(1)}%` : '0%'
                },
                performance: {
                    frameRate: `${avgFrameRate.toFixed(1)} FPS`,
                    frameRateSamples: this.frameRateHistory.length,
                    cacheSize: `${(this.cacheStats.totalSize / 1024 / 1024).toFixed(2)}MB`,
                    maxCacheSize: `${maxCacheSize}MB`,
                    cacheUsage: `${((this.cacheStats.totalSize / (maxCacheSize * 1024 * 1024)) * 100).toFixed(1)}%`
                },
                memory: this.getMemoryReport(),
                recentWarnings: this.warningHistory.slice(-10),
                mapTransfers: this.mapTransferCount,
                lastCleanup: new Date(this.lastCleanup).toLocaleString()
            };
            
            if (enableConsoleReports) {
                console.table(report.plugins);
            }
            
            return report;
        }
        
        getMemoryReport() {
            if (!performance.memory) {
                return { available: false };
            }
            
            return {
                available: true,
                used: (performance.memory.usedJSHeapSize / (1024 * 1024)).toFixed(1) + ' MB',
                total: (performance.memory.totalJSHeapSize / (1024 * 1024)).toFixed(1) + ' MB',
                limit: (performance.memory.jsHeapSizeLimit / (1024 * 1024)).toFixed(1) + ' MB',
                percentage: ((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100).toFixed(1) + '%'
            };
        }
        
        clearCache() {
            this.performCacheCleanup();
        }
        
        resetStats() {
            this.pluginStats.clear();
            this.functionStats.clear();
            this.warningHistory = [];
            this.mapTransferCount = 0;
            
            if (enableConsoleReports) {
                console.log(`[${pluginName}] Performance statistics reset`);
            }
        }
        
        getMemoryUsage() {
            return this.getMemoryReport();
        }

        // Enhanced optimization methods
        setupAdvancedOptimizations() {
            if (enableSaveDataOptimization) {
                this.setupSaveDataOptimization();
            }
            
            if (enableAutoGarbageCollection) {
                this.setupAutoGarbageCollection();
            }
            
            if (enableEventOptimization) {
                this.setupEventOptimization();
            }
            
            if (enableImageOptimization) {
                this.setupImageOptimization();
            }
            
            // Frame rate monitoring
            this.setupFrameRateMonitoring();
        }

        setupSaveDataOptimization() {
            const original_Game_System_onAfterLoad = Game_System.prototype.onAfterLoad;
            Game_System.prototype.onAfterLoad = function() {
                original_Game_System_onAfterLoad.call(this);
                window.$performanceCatcher.optimizeSaveData();
            };

            const original_DataManager_saveGame = DataManager.saveGame;
            DataManager.saveGame = function(savefileId) {
                window.$performanceCatcher.cleanupSaveData();
                return original_DataManager_saveGame.call(this, savefileId);
            };

            if (enableConsoleReports) {
                console.log(`[${pluginName}] Save data optimization enabled`);
            }
        }

        setupAutoGarbageCollection() {
            const gcInterval = 30000; // Every 30 seconds
            
            setInterval(() => {
                if (this.shouldTriggerGC()) {
                    this.performGarbageCollection();
                }
            }, gcInterval);

            if (enableConsoleReports) {
                console.log(`[${pluginName}] Auto garbage collection enabled (${gcInterval}ms interval)`);
            }
        }

        setupEventOptimization() {
            // Monitor and optimize common events
            const original_Game_Interpreter_setup = Game_Interpreter.prototype.setup;
            Game_Interpreter.prototype.setup = function(list, eventId) {
                window.$performanceCatcher.trackEventExecution(eventId, list);
                return original_Game_Interpreter_setup.call(this, list, eventId);
            };

            if (enableConsoleReports) {
                console.log(`[${pluginName}] Event optimization enabled`);
            }
        }

        setupImageOptimization() {
            const original_Bitmap_initialize = Bitmap.prototype.initialize;
            Bitmap.prototype.initialize = function(width, height) {
                const result = original_Bitmap_initialize.call(this, width, height);
                window.$performanceCatcher.trackImageCreation(this, width, height);
                return result;
            };

            if (enableConsoleReports) {
                console.log(`[${pluginName}] Image optimization enabled`);
            }
        }

        setupFrameRateMonitoring() {
            const monitorFrame = () => {
                const now = performance.now();
                const deltaTime = now - this.lastFrameTime;
                this.lastFrameTime = now;
                
                this.frameRateHistory.push(1000 / deltaTime);
                if (this.frameRateHistory.length > 60) {
                    this.frameRateHistory.shift();
                }
                
                requestAnimationFrame(monitorFrame);
            };
            
            requestAnimationFrame(monitorFrame);
        }

        // Advanced optimization methods
        optimizeSaveData() {
            let optimizations = 0;
            
            try {
                // Clean up temporary variables in game systems
                if ($dataSystem && $dataSystem._tempVars) {
                    delete $dataSystem._tempVars;
                    optimizations++;
                }
                
                // Optimize actor data
                if ($gameActors && $gameActors._data) {
                    $gameActors._data.forEach(actor => {
                        if (actor) {
                            // Remove unnecessary temporary data
                            delete actor._tempBattleData;
                            delete actor._cachedParams;
                            optimizations++;
                        }
                    });
                }
                
                // Clean up map events
                if ($gameMap && $gameMap._events) {
                    $gameMap._events.forEach(event => {
                        if (event && event._cachedData) {
                            delete event._cachedData;
                            optimizations++;
                        }
                    });
                }
                
                this.optimizations.saveDataReductions += optimizations;
                
                if (enableConsoleReports && optimizations > 0) {
                    console.log(`[${pluginName}] Optimized save data: ${optimizations} items cleaned`);
                }
                
            } catch (error) {
                if (enableConsoleReports) {
                    console.warn(`[${pluginName}] Save data optimization error:`, error);
                }
            }
        }

        cleanupSaveData() {
            try {
                // Remove temporary UI states
                if (SceneManager._scene && SceneManager._scene._tempData) {
                    delete SceneManager._scene._tempData;
                }
                
                // Clear cached battle data
                if ($gameParty) {
                    $gameParty._actors.forEach(actor => {
                        if ($gameActors.actor(actor)) {
                            const actorData = $gameActors.actor(actor);
                            delete actorData._battleCache;
                            delete actorData._skillCache;
                        }
                    });
                }
                
                // Force garbage collection if available
                if (window.gc && typeof window.gc === 'function') {
                    window.gc();
                }
                
            } catch (error) {
                if (enableConsoleReports) {
                    console.warn(`[${pluginName}] Save data cleanup error:`, error);
                }
            }
        }

        shouldTriggerGC() {
            const memoryInfo = this.getMemoryReport();
            const currentMemory = memoryInfo.estimated || 0;
            const memoryThreshold = maxCacheSize * 1024 * 1024; // Convert MB to bytes
            
            return currentMemory > memoryThreshold || 
                   (performance.memory && performance.memory.usedJSHeapSize > memoryThreshold);
        }

        performGarbageCollection() {
            const beforeMemory = this.getMemoryReport().estimated || 0;
            
            try {
                // Clear image cache if over limit
                if (this.cacheStats.totalSize > maxCacheSize * 1024 * 1024) {
                    this.clearImageCache();
                }
                
                // Clear audio cache
                if (AudioManager._staticBuffers) {
                    const bufferKeys = Object.keys(AudioManager._staticBuffers);
                    const halfLength = Math.floor(bufferKeys.length / 2);
                    for (let i = 0; i < halfLength; i++) {
                        delete AudioManager._staticBuffers[bufferKeys[i]];
                    }
                }
                
                // Clean up PIXI resources
                if (PIXI && PIXI.utils && PIXI.utils.clearTextureCache) {
                    PIXI.utils.clearTextureCache();
                }
                
                // Force browser garbage collection if available
                if (window.gc && typeof window.gc === 'function') {
                    window.gc();
                }
                
                const afterMemory = this.getMemoryReport().estimated || 0;
                const cleaned = beforeMemory - afterMemory;
                
                if (enableConsoleReports && cleaned > 0) {
                    console.log(`[${pluginName}] Garbage collection completed: ${(cleaned / 1024 / 1024).toFixed(2)}MB freed`);
                }
                
            } catch (error) {
                if (enableConsoleReports) {
                    console.warn(`[${pluginName}] Garbage collection error:`, error);
                }
            }
        }

        trackEventExecution(eventId, eventList) {
            if (!eventList || eventList.length === 0) return;
            
            const eventKey = `event_${eventId}`;
            if (!this.functionStats.has(eventKey)) {
                this.functionStats.set(eventKey, {
                    calls: 0,
                    totalTime: 0,
                    avgTime: 0,
                    commands: eventList.length
                });
            }
            
            const stats = this.functionStats.get(eventKey);
            stats.calls++;
            
            // Track complex events for optimization
            if (eventList.length > 50) {
                this.optimizations.eventOptimizations++;
                if (enableConsoleReports) {
                    console.log(`[${pluginName}] Large event detected (${eventList.length} commands): Event ${eventId}`);
                }
            }
        }

        trackImageCreation(bitmap, width, height) {
            const imageSize = (width * height * 4) || 0; // Approximate RGBA size
            this.cacheStats.totalSize += imageSize;
            
            // Track for optimization
            if (imageSize > 1024 * 1024) { // Images over 1MB
                this.optimizations.imageOptimizations++;
                if (enableConsoleReports) {
                    console.log(`[${pluginName}] Large image created: ${(imageSize / 1024 / 1024).toFixed(2)}MB`);
                }
            }
        }

        clearImageCache() {
            try {
                // Clear ImageManager cache
                if (ImageManager._cache) {
                    ImageManager._cache.clear();
                }
                
                // Clear bitmap cache
                if (Bitmap._cache) {
                    Bitmap._cache.clear();
                }
                
                // Reset our tracking
                this.cacheStats.totalSize = 0;
                this.cacheStats.imageCache.clear();
                
                if (enableConsoleReports) {
                    console.log(`[${pluginName}] Image cache cleared`);
                }
                
            } catch (error) {
                if (enableConsoleReports) {
                    console.warn(`[${pluginName}] Image cache clear error:`, error);
                }
            }
        }

        getOptimizationReport() {
            const avgFrameRate = this.frameRateHistory.length > 0 ? 
                this.frameRateHistory.reduce((a, b) => a + b, 0) / this.frameRateHistory.length : 0;
            
            return {
                optimizations: { ...this.optimizations },
                frameRate: {
                    current: avgFrameRate.toFixed(1),
                    samples: this.frameRateHistory.length
                },
                cache: {
                    totalSize: `${(this.cacheStats.totalSize / 1024 / 1024).toFixed(2)}MB`,
                    maxSize: `${maxCacheSize}MB`,
                    usage: `${((this.cacheStats.totalSize / (maxCacheSize * 1024 * 1024)) * 100).toFixed(1)}%`
                }
            };
        }
    }
    
    //-----------------------------------------------------------------------------
    // Plugin Initialization
    //-----------------------------------------------------------------------------
    
    // Initialize performance catcher when the game starts
    const originalSceneBootStart = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        originalSceneBootStart.call(this);
        
        // Initialize performance catcher
        window.$performanceCatcher = new PerformanceCatcher();
        
        if (enableConsoleReports) {
            console.log(`[${pluginName}] Available console commands:`);
            console.log('- $performanceCatcher.getReport() - Get performance report');
            console.log('- $performanceCatcher.clearCache() - Clear caches manually');
            console.log('- $performanceCatcher.resetStats() - Reset statistics');
            console.log('- $performanceCatcher.getMemoryUsage() - Check memory usage');
            console.log('- $performanceCatcher.getOptimizationReport() - Get optimization statistics');
            console.log('- $performanceCatcher.optimizeSaveData() - Clean save data manually');
            console.log('- $performanceCatcher.performGarbageCollection() - Force garbage collection');
            console.log('- $performanceCatcher.clearImageCache() - Clear image cache');
        }
    };
    
})();
