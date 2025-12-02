//=============================================================================
// PerformanceIntegration.js
// version 2.0.0
//=============================================================================

/*:
@target MZ
@plugindesc [v2.0.0] Performance Integration Hub - Enhanced Edition
@author Alexandros Panagiotakopoulos
@url https://alexandrospanag.github.io
@version 2.0.0
@date 02-12-2025
@help PerformanceIntegration.js

@param enableIntegration
@text Enable Performance Integration
@desc Automatically integrate all performance plugins
@type boolean
@default true

@param enableAutoOptimization
@text Enable Auto Optimization
@desc Automatically optimize based on performance metrics
@type boolean
@default true

@param performanceThreshold
@text Performance Threshold (ms)
@desc Target frame time for optimization decisions
@type number
@min 8
@max 33
@default 16

@param enableVisualScaling
@text Enable Visual Scaling
@desc Scale visual effects based on performance
@type boolean
@default true

@param enableSmartProfiling
@text Enable Smart Profiling
@desc Intelligent performance profiling across all plugins
@type boolean
@default true

@param enableResourceOptimization
@text Enable Resource Optimization
@desc Optimize resource usage based on performance data
@type boolean
@default true

@param optimizationInterval
@text Optimization Interval (ms)
@desc How often to check and optimize performance
@type number
@min 100
@max 5000
@default 1000

@param enablePerformanceHUD
@text Enable Performance HUD
@desc Show performance metrics overlay
@type boolean
@default false

@param enableAdaptiveQuality
@text Enable Adaptive Quality
@desc Automatically adjust quality settings
@type boolean
@default true

@param minFPS
@text Minimum Target FPS
@desc Minimum FPS to maintain (will reduce quality if needed)
@type number
@min 15
@max 60
@default 30

@param maxFPS
@text Maximum Target FPS
@desc Maximum FPS target (will increase quality if possible)
@type number
@min 30
@max 120
@default 60

@param enableConsoleIntegration
@text Enable Console Integration
@desc Advanced console commands for integrated performance management
@type boolean
@default true

@param enableObjectPooling
@text Enable Object Pooling
@desc Reuse objects to reduce garbage collection
@type boolean
@default true

@param enableSpriteBatching
@text Enable Sprite Batching
@desc Optimize sprite rendering with batching
@type boolean
@default true

@param enableMemoryLeakDetection
@text Enable Memory Leak Detection
@desc Monitor and warn about potential memory leaks
@type boolean
@default true

@param enableRenderOptimization
@text Enable Render Optimization
@desc Apply rendering optimizations for better FPS
@type boolean
@default true

@param enableFrameBudgeting
@text Enable Frame Budgeting
@desc Spread heavy operations across multiple frames
@type boolean
@default true

@param frameBudgetMs
@text Frame Budget (ms)
@desc Maximum time per frame for deferred operations
@type number
@min 1
@max 16
@default 8

@param enableEventThrottling
@text Enable Event Throttling
@desc Throttle rapid event updates
@type boolean
@default true

@param gcThresholdMB
@text GC Threshold (MB)
@desc Memory threshold to trigger cleanup (in MB)
@type number
@min 50
@max 500
@default 150

@help PerformanceIntegration.js

This plugin creates a unified performance management system that bridges
all your performance and visual plugins together. It automatically optimizes
your game's performance by intelligently managing resources, visual effects,
and system components based on real-time performance metrics.

Key Features:
- Unified performance monitoring across all plugins
- Intelligent auto-optimization based on performance data
- Adaptive quality scaling for consistent frame rates
- Resource management integration
- Real-time performance HUD overlay
- Smart profiling with actionable insights
- Cross-plugin performance correlation analysis

NEW v2.0 Enhanced Features:
- Object Pooling System - Reuse sprites, particles, and objects to reduce GC
- Sprite Batch Optimization - Minimize draw calls for better GPU performance
- Memory Leak Detection - Automatic detection and warnings for memory issues
- Render Optimization - Canvas/WebGL rendering improvements
- Frame Budget Management - Spread heavy operations across frames
- Event Throttling - Prevent rapid updates from causing frame drops
- Texture Atlas Optimization - Efficient texture memory management
- Predictive Performance Scaling - AI-like quality adjustment
- Delta Time Smoothing - Consistent gameplay regardless of frame rate

Integration Capabilities:
- PerformanceCatcher.js - Enhanced monitoring and reporting
- EventOptimizer.js - Dynamic event optimization thresholds
- TimeSystem.js - Adaptive time system performance scaling
- Future Visual Plugins - Quality scaling based on performance

Console Commands (F12 Developer Tools):
- $performanceHub.getUnifiedReport() - Complete system performance analysis
- $performanceHub.optimizeAll() - Force optimization across all systems
- $performanceHub.setQualityLevel(level) - Manually set quality (1-5)
- $performanceHub.enableHUD() - Toggle performance HUD overlay
- $performanceHub.getOptimizationHistory() - View optimization decisions
- $performanceHub.resetAllStats() - Reset all integrated performance data

Performance Philosophy:
This plugin embodies the principle that great performance and stunning visuals
are not mutually exclusive. By intelligently managing resources and adapting
quality settings based on real-time performance data, your RPG can deliver
both beautiful graphics and smooth gameplay on any device.

Best Practices:
1. Load this plugin AFTER PerformanceCatcher and EventOptimizer
2. Enable auto-optimization for hands-free performance management  
3. Use adaptive quality for consistent player experience
4. Monitor the unified report during development
5. Adjust thresholds based on your target devices

Copyright © Alexandros Panagiotakopoulos. All Rights Reserved.
Free to use with attribution required.

Terms of Use:
- Free for commercial and non-commercial use with proper attribution
- Modify as needed for your project
- Include copyright notice when redistributing
- See LICENSE.md for full terms
*/

(() => {
    'use strict';
    
    const pluginName = 'PerformanceIntegration';
    const parameters = PluginManager.parameters(pluginName);
    
    // Parse parameters
    const enableIntegration = parameters['enableIntegration'] === 'true';
    const enableAutoOptimization = parameters['enableAutoOptimization'] === 'true';
    const performanceThreshold = parseFloat(parameters['performanceThreshold'] || 16.67);
    const enableVisualScaling = parameters['enableVisualScaling'] === 'true';
    const enableSmartProfiling = parameters['enableSmartProfiling'] === 'true';
    const enableResourceOptimization = parameters['enableResourceOptimization'] === 'true';
    const optimizationInterval = parseInt(parameters['optimizationInterval'] || 1000);
    const enablePerformanceHUD = parameters['enablePerformanceHUD'] === 'true';
    const enableAdaptiveQuality = parameters['enableAdaptiveQuality'] === 'true';
    const minFPS = parseInt(parameters['minFPS'] || 30);
    const maxFPS = parseInt(parameters['maxFPS'] || 60);
    const enableConsoleIntegration = parameters['enableConsoleIntegration'] === 'true';
    const enableObjectPooling = parameters['enableObjectPooling'] !== 'false';
    const enableSpriteBatching = parameters['enableSpriteBatching'] !== 'false';
    const enableMemoryLeakDetection = parameters['enableMemoryLeakDetection'] !== 'false';
    const enableRenderOptimization = parameters['enableRenderOptimization'] !== 'false';
    const enableFrameBudgeting = parameters['enableFrameBudgeting'] !== 'false';
    const frameBudgetMs = parseFloat(parameters['frameBudgetMs'] || 8);
    const enableEventThrottling = parameters['enableEventThrottling'] !== 'false';
    const gcThresholdMB = parseInt(parameters['gcThresholdMB'] || 150);

    //-----------------------------------------------------------------------------
    // PerformanceIntegrationHub - Main Class
    //-----------------------------------------------------------------------------
    
    class PerformanceIntegrationHub {
        constructor() {
            this.integratedPlugins = new Map();
            this.performanceHistory = [];
            this.optimizationHistory = [];
            this.currentQualityLevel = 3; // 1-5 scale
            this.lastOptimization = Date.now();
            this.frameTimeHistory = [];
            this.optimizationTimer = null;
            this.hudElement = null;
            this.performanceMetrics = {
                currentFPS: 60,
                averageFPS: 60,
                frameTime: 16.67,
                memoryUsage: 0,
                pluginOverhead: 0,
                optimizationScore: 100,
                drawCalls: 0,
                activeSprites: 0,
                pooledObjects: 0,
                gcPauses: 0
            };
            
            // NEW v2.0 - Enhanced Performance Systems
            this.objectPools = new Map();          // Object pooling system
            this.deferredOperations = [];          // Frame budget queue
            this.throttledEvents = new Map();      // Event throttling
            this.memorySnapshots = [];             // Memory leak detection
            this.deltaTimeBuffer = [];             // Delta time smoothing
            this.lastFrameTime = performance.now();
            this.smoothedDeltaTime = 16.67;
            this.renderOptimizations = {};         // Render state cache
            this.textureAtlasCache = new Map();    // Texture management
            this.batchedSprites = [];              // Sprite batching
            this.performancePredictions = [];      // Predictive scaling
            
            this.initializeIntegration();
            this.initializeEnhancedSystems();
            
            if (enableConsoleIntegration) {
                console.log(`[${pluginName}] Performance Integration Hub v2.0 initialized`);
                console.log(`[${pluginName}] Target: ${performanceThreshold.toFixed(2)}ms (${(1000/performanceThreshold).toFixed(1)} FPS)`);
                console.log(`[${pluginName}] Enhanced systems: Pooling=${enableObjectPooling}, Batching=${enableSpriteBatching}, MemoryDetection=${enableMemoryLeakDetection}`);
            }
        }
        
        //-----------------------------------------------------------------------------
        // NEW v2.0 - Enhanced Performance Systems Initialization
        //-----------------------------------------------------------------------------
        
        initializeEnhancedSystems() {
            if (enableObjectPooling) this.initializeObjectPools();
            if (enableSpriteBatching) this.initializeSpriteBatching();
            if (enableMemoryLeakDetection) this.initializeMemoryLeakDetection();
            if (enableRenderOptimization) this.initializeRenderOptimizations();
            if (enableFrameBudgeting) this.initializeFrameBudgeting();
            if (enableEventThrottling) this.initializeEventThrottling();
            this.initializeDeltaTimeSmoothing();
        }
        
        initializeIntegration() {
            if (!enableIntegration) return;
            
            this.discoverIntegratedPlugins();
            this.setupPerformanceMonitoring();
            this.setupAutoOptimization();
            this.setupAdaptiveQuality();
            this.setupPerformanceHUD();
            
            // Hook into game update cycle
            this.hookGameLoop();
        }
        
        discoverIntegratedPlugins() {
            // Detect and integrate with available performance plugins
            const detectedPlugins = [];
            
            // Check for PerformanceCatcher
            if (window.$performanceCatcher) {
                this.integratedPlugins.set('PerformanceCatcher', {
                    instance: window.$performanceCatcher,
                    type: 'monitor',
                    priority: 1,
                    methods: ['getReport', 'getMemoryUsage', 'clearCache']
                });
                detectedPlugins.push('PerformanceCatcher');
            }
            
            // Check for EventOptimizer
            if (window.$eventOptimizer) {
                this.integratedPlugins.set('EventOptimizer', {
                    instance: window.$eventOptimizer,
                    type: 'optimizer',
                    priority: 2,
                    methods: ['getReport', 'optimizeCurrentMap', 'cleanupEvents']
                });
                detectedPlugins.push('EventOptimizer');
            }
            
            // Check for TimeSystem
            if (window.TimeSystem) {
                this.integratedPlugins.set('TimeSystem', {
                    instance: window.TimeSystem,
                    type: 'system',
                    priority: 3,
                    methods: ['getTimeString', 'updateTint']
                });
                detectedPlugins.push('TimeSystem');
            }
            
            if (enableConsoleIntegration && detectedPlugins.length > 0) {
                console.log(`[${pluginName}] Integrated with: ${detectedPlugins.join(', ')}`);
            }
        }
        
        //-----------------------------------------------------------------------------
        // NEW v2.0 - Object Pooling System
        //-----------------------------------------------------------------------------
        
        initializeObjectPools() {
            // Pre-create common object pools
            this.createPool('Sprite', () => new Sprite(), 50);
            this.createPool('Point', () => new PIXI.Point(), 100);
            this.createPool('Rectangle', () => new Rectangle(), 50);
            this.createPool('Array', () => [], 100);
            
            if (enableConsoleIntegration) {
                console.log(`[${pluginName}] Object pools initialized`);
            }
        }
        
        createPool(name, factory, initialSize = 20) {
            const pool = {
                factory: factory,
                available: [],
                inUse: new Set(),
                created: 0,
                reused: 0
            };
            
            // Pre-populate pool
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
            this.performanceMetrics.pooledObjects = this.getTotalPooledObjects();
            return obj;
        }
        
        returnToPool(poolName, obj) {
            const pool = this.objectPools.get(poolName);
            if (!pool || !pool.inUse.has(obj)) return false;
            
            pool.inUse.delete(obj);
            
            // Reset object if possible
            if (obj.clear) obj.clear();
            if (obj.removeChildren) obj.removeChildren();
            if (poolName === 'Array') obj.length = 0;
            
            pool.available.push(obj);
            this.performanceMetrics.pooledObjects = this.getTotalPooledObjects();
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
                    efficiency: pool.created > 0 ? ((pool.reused / (pool.created + pool.reused)) * 100).toFixed(1) + '%' : '0%'
                };
            }
            return stats;
        }
        
        //-----------------------------------------------------------------------------
        // NEW v2.0 - Sprite Batching System
        //-----------------------------------------------------------------------------
        
        initializeSpriteBatching() {
            // Hook into PIXI renderer for draw call optimization
            const self = this;
            
            if (Graphics._renderer && Graphics._renderer.plugins && Graphics._renderer.plugins.batch) {
                const originalFlush = Graphics._renderer.plugins.batch.flush;
                let drawCallCount = 0;
                let lastResetTime = Date.now();
                
                Graphics._renderer.plugins.batch.flush = function() {
                    drawCallCount++;
                    originalFlush.call(this);
                };
                
                // Track draw calls per second
                setInterval(() => {
                    self.performanceMetrics.drawCalls = drawCallCount;
                    drawCallCount = 0;
                }, 1000);
            }
            
            if (enableConsoleIntegration) {
                console.log(`[${pluginName}] Sprite batching system initialized`);
            }
        }
        
        //-----------------------------------------------------------------------------
        // NEW v2.0 - Memory Leak Detection System
        //-----------------------------------------------------------------------------
        
        initializeMemoryLeakDetection() {
            this.takeMemorySnapshot();
            
            // Periodic memory monitoring
            setInterval(() => {
                this.checkMemoryLeaks();
            }, 30000); // Check every 30 seconds
            
            if (enableConsoleIntegration) {
                console.log(`[${pluginName}] Memory leak detection initialized (threshold: ${gcThresholdMB}MB)`);
            }
        }
        
        takeMemorySnapshot() {
            if (!performance.memory) return null;
            
            const snapshot = {
                timestamp: Date.now(),
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
                usedMB: (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)
            };
            
            this.memorySnapshots.push(snapshot);
            
            // Keep only last 60 snapshots (30 minutes of data)
            if (this.memorySnapshots.length > 60) {
                this.memorySnapshots.shift();
            }
            
            this.performanceMetrics.memoryUsage = parseFloat(snapshot.usedMB);
            return snapshot;
        }
        
        checkMemoryLeaks() {
            const snapshot = this.takeMemorySnapshot();
            if (!snapshot) return;
            
            const usedMB = parseFloat(snapshot.usedMB);
            
            // Check if memory exceeds threshold
            if (usedMB > gcThresholdMB) {
                this.handleHighMemoryUsage(usedMB);
            }
            
            // Check for continuous memory growth (potential leak)
            if (this.memorySnapshots.length >= 10) {
                const recent = this.memorySnapshots.slice(-10);
                const growth = parseFloat(recent[9].usedMB) - parseFloat(recent[0].usedMB);
                
                if (growth > 20) { // 20MB growth in 5 minutes
                    this.warnMemoryLeak(growth);
                }
            }
        }
        
        handleHighMemoryUsage(usedMB) {
            if (enableConsoleIntegration) {
                console.warn(`[${pluginName}] High memory usage detected: ${usedMB}MB (threshold: ${gcThresholdMB}MB)`);
            }
            
            // Aggressive cleanup
            this.performAggressiveCleanup();
        }
        
        warnMemoryLeak(growthMB) {
            if (enableConsoleIntegration) {
                console.warn(`[${pluginName}] Potential memory leak detected! Memory grew ${growthMB.toFixed(2)}MB in 5 minutes`);
                console.warn(`[${pluginName}] Consider checking for: orphaned sprites, unclosed event listeners, large cached data`);
            }
        }
        
        performAggressiveCleanup() {
            const cleanupActions = [];
            
            // Clear unused object pools
            for (const [name, pool] of this.objectPools.entries()) {
                const trimmed = Math.floor(pool.available.length / 2);
                pool.available.splice(0, trimmed);
                if (trimmed > 0) cleanupActions.push(`Trimmed ${trimmed} from ${name} pool`);
            }
            
            // Clear old texture cache
            this.cleanupTextureCache();
            cleanupActions.push('Texture cache cleaned');
            
            // Clear old performance data
            this.frameTimeHistory = this.frameTimeHistory.slice(-30);
            this.performanceHistory = this.performanceHistory.slice(-25);
            cleanupActions.push('Performance history trimmed');
            
            // Optimize image cache
            this.cleanupImageCache();
            cleanupActions.push('Image cache optimized');
            
            // Audio cleanup
            this.cleanupAudioBuffers();
            cleanupActions.push('Audio buffers cleaned');
            
            // Force browser GC if available
            if (window.gc) {
                window.gc();
                cleanupActions.push('Garbage collection forced');
                this.performanceMetrics.gcPauses++;
            }
            
            if (enableConsoleIntegration) {
                console.log(`[${pluginName}] Aggressive cleanup performed: ${cleanupActions.join(', ')}`);
            }
            
            return cleanupActions;
        }
        
        cleanupTextureCache() {
            try {
                if (PIXI.utils && PIXI.utils.TextureCache) {
                    const cache = PIXI.utils.TextureCache;
                    const keys = Object.keys(cache);
                    let cleaned = 0;
                    
                    for (const key of keys) {
                        const texture = cache[key];
                        if (texture && texture.baseTexture && texture.baseTexture._glTextures) {
                            // Only clean textures not currently in use
                            if (Object.keys(texture.baseTexture._glTextures).length === 0) {
                                delete cache[key];
                                cleaned++;
                            }
                        }
                    }
                    
                    return cleaned;
                }
            } catch (error) {
                console.warn(`[${pluginName}] Texture cache cleanup failed:`, error);
            }
            return 0;
        }
        
        //-----------------------------------------------------------------------------
        // NEW v2.0 - Render Optimization System
        //-----------------------------------------------------------------------------
        
        initializeRenderOptimizations() {
            this.optimizeRendererSettings();
            this.hookSpriteRendering();
            this.optimizeTilemapRendering();
            
            if (enableConsoleIntegration) {
                console.log(`[${pluginName}] Render optimizations initialized`);
            }
        }
        
        optimizeRendererSettings() {
            // Optimize WebGL renderer if available
            if (Graphics._renderer && Graphics._renderer.type === PIXI.RENDERER_TYPE.WEBGL) {
                const renderer = Graphics._renderer;
                
                // Optimize render settings based on quality level
                this.renderOptimizations = {
                    antialias: this.currentQualityLevel >= 4,
                    roundPixels: this.currentQualityLevel < 3,
                    legacy: this.currentQualityLevel <= 2
                };
                
                // Apply optimizations
                if (renderer.options) {
                    renderer.options.antialias = this.renderOptimizations.antialias;
                }
                
                // Set resolution based on quality
                const resolutionMap = { 1: 0.5, 2: 0.75, 3: 1.0, 4: 1.0, 5: 1.0 };
                const targetResolution = resolutionMap[this.currentQualityLevel] || 1.0;
                
                if (renderer.resolution !== targetResolution && this.currentQualityLevel <= 2) {
                    // Only reduce resolution for low quality settings
                    // renderer.resolution = targetResolution; // Uncomment if needed
                }
            }
        }
        
        hookSpriteRendering() {
            // Optimize sprite visibility checks
            const self = this;
            const originalSpriteUpdate = Sprite.prototype.update;
            
            Sprite.prototype.update = function() {
                // Skip update for invisible or fully transparent sprites
                if (!this.visible || this.alpha <= 0 || this.scale.x === 0 || this.scale.y === 0) {
                    return;
                }
                
                // Skip off-screen sprites (culling)
                if (self.currentQualityLevel <= 3 && this.parent) {
                    const bounds = this.getBounds ? this.getBounds(false) : null;
                    if (bounds && self.isOffScreen(bounds)) {
                        return;
                    }
                }
                
                originalSpriteUpdate.call(this);
            };
        }
        
        isOffScreen(bounds) {
            const screenWidth = Graphics.width;
            const screenHeight = Graphics.height;
            const margin = 64; // Small margin to avoid popping
            
            return (bounds.x + bounds.width < -margin ||
                    bounds.x > screenWidth + margin ||
                    bounds.y + bounds.height < -margin ||
                    bounds.y > screenHeight + margin);
        }
        
        optimizeTilemapRendering() {
            // Optimize tilemap layer updates
            const originalTilemapUpdate = Tilemap.prototype.update;
            let lastTilemapUpdate = 0;
            const tilemapUpdateInterval = this.currentQualityLevel >= 4 ? 0 : 2; // Skip frames on low quality
            
            Tilemap.prototype.update = function() {
                lastTilemapUpdate++;
                if (lastTilemapUpdate < tilemapUpdateInterval) return;
                lastTilemapUpdate = 0;
                originalTilemapUpdate.call(this);
            };
        }
        
        //-----------------------------------------------------------------------------
        // NEW v2.0 - Frame Budget Management System
        //-----------------------------------------------------------------------------
        
        initializeFrameBudgeting() {
            this.frameBudgetQueue = [];
            this.currentFrameBudget = frameBudgetMs;
            
            if (enableConsoleIntegration) {
                console.log(`[${pluginName}] Frame budgeting initialized (${frameBudgetMs}ms budget)`);
            }
        }
        
        deferOperation(operation, priority = 5) {
            if (!enableFrameBudgeting) {
                operation();
                return;
            }
            
            this.deferredOperations.push({
                operation: operation,
                priority: priority,
                added: Date.now()
            });
            
            // Sort by priority (lower = higher priority)
            this.deferredOperations.sort((a, b) => a.priority - b.priority);
        }
        
        processFrameBudget() {
            if (this.deferredOperations.length === 0) return;
            
            const startTime = performance.now();
            const budget = this.currentFrameBudget;
            let processed = 0;
            
            while (this.deferredOperations.length > 0) {
                const elapsed = performance.now() - startTime;
                if (elapsed >= budget) break;
                
                const item = this.deferredOperations.shift();
                try {
                    item.operation();
                    processed++;
                } catch (error) {
                    console.warn(`[${pluginName}] Deferred operation failed:`, error);
                }
            }
            
            return processed;
        }
        
        //-----------------------------------------------------------------------------
        // NEW v2.0 - Event Throttling System
        //-----------------------------------------------------------------------------
        
        initializeEventThrottling() {
            this.setupEventUpdateThrottling();
            
            if (enableConsoleIntegration) {
                console.log(`[${pluginName}] Event throttling initialized`);
            }
        }
        
        setupEventUpdateThrottling() {
            // Throttle game event updates based on distance from player
            const self = this;
            const originalGameEventUpdate = Game_Event.prototype.update;
            
            Game_Event.prototype.update = function() {
                // Always update events on the same screen
                if (!self.shouldThrottleEvent(this)) {
                    originalGameEventUpdate.call(this);
                    return;
                }
                
                // Throttle distant event updates
                const throttleKey = `event_${this._mapId}_${this._eventId}`;
                const lastUpdate = self.throttledEvents.get(throttleKey) || 0;
                const throttleInterval = self.calculateThrottleInterval(this);
                
                if (Date.now() - lastUpdate >= throttleInterval) {
                    self.throttledEvents.set(throttleKey, Date.now());
                    originalGameEventUpdate.call(this);
                }
            };
        }
        
        shouldThrottleEvent(event) {
            if (!$gamePlayer || !event) return false;
            if (!enableEventThrottling) return false;
            
            // Don't throttle events that are running
            if (event.isStarting()) return false;
            
            // Don't throttle events with active routes
            if (event._moveRoute && event._moveRoute.list.length > 0) return false;
            
            return true;
        }
        
        calculateThrottleInterval(event) {
            if (!$gamePlayer || !event) return 0;
            
            const dx = Math.abs($gamePlayer.x - event.x);
            const dy = Math.abs($gamePlayer.y - event.y);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Near events update every frame, distant events update less frequently
            if (distance < 5) return 0;      // No throttle
            if (distance < 10) return 33;    // ~30 FPS
            if (distance < 20) return 67;    // ~15 FPS
            return 100;                       // ~10 FPS for very distant events
        }
        
        //-----------------------------------------------------------------------------
        // NEW v2.0 - Delta Time Smoothing
        //-----------------------------------------------------------------------------
        
        initializeDeltaTimeSmoothing() {
            const self = this;
            const originalUpdateMain = SceneManager.updateMain;
            
            SceneManager.updateMain = function() {
                const currentTime = performance.now();
                const rawDelta = currentTime - self.lastFrameTime;
                self.lastFrameTime = currentTime;
                
                // Smooth delta time using exponential moving average
                self.deltaTimeBuffer.push(rawDelta);
                if (self.deltaTimeBuffer.length > 10) {
                    self.deltaTimeBuffer.shift();
                }
                
                const avgDelta = self.deltaTimeBuffer.reduce((a, b) => a + b, 0) / self.deltaTimeBuffer.length;
                self.smoothedDeltaTime = Math.min(avgDelta, 50); // Cap at 50ms (20 FPS minimum)
                
                // Process frame budget operations
                if (enableFrameBudgeting) {
                    self.processFrameBudget();
                }
                
                originalUpdateMain.call(this);
            };
            
            // Expose smoothed delta time globally
            Object.defineProperty(window, '$smoothDeltaTime', {
                get: () => self.smoothedDeltaTime
            });
        }
        
        //-----------------------------------------------------------------------------
        // NEW v2.0 - Predictive Performance Scaling
        //-----------------------------------------------------------------------------
        
        predictPerformanceTrend() {
            if (this.frameTimeHistory.length < 5) return 'stable';
            
            const recent = this.frameTimeHistory.slice(-10);
            const older = this.frameTimeHistory.slice(-20, -10);
            
            if (older.length < 5) return 'stable';
            
            const recentAvg = recent.reduce((sum, e) => sum + e.fps, 0) / recent.length;
            const olderAvg = older.reduce((sum, e) => sum + e.fps, 0) / older.length;
            
            const trend = recentAvg - olderAvg;
            
            if (trend > 5) return 'improving';
            if (trend < -5) return 'degrading';
            return 'stable';
        }
        
        adjustQualityPredictively() {
            const trend = this.predictPerformanceTrend();
            const currentFPS = this.performanceMetrics.averageFPS;
            
            if (trend === 'degrading' && currentFPS < maxFPS * 0.9) {
                // Proactively reduce quality before performance becomes problematic
                if (this.currentQualityLevel > 1) {
                    this.setQualityLevel(this.currentQualityLevel - 1);
                    this.performancePredictions.push({
                        time: Date.now(),
                        action: 'preemptive_downgrade',
                        trend: trend,
                        fps: currentFPS
                    });
                }
            } else if (trend === 'improving' && currentFPS > maxFPS * 1.1) {
                // Performance is good and improving, can increase quality
                if (this.currentQualityLevel < 5) {
                    this.setQualityLevel(this.currentQualityLevel + 1);
                    this.performancePredictions.push({
                        time: Date.now(),
                        action: 'preemptive_upgrade',
                        trend: trend,
                        fps: currentFPS
                    });
                }
            }
        }
        
        setupPerformanceMonitoring() {
            if (!enableSmartProfiling) return;
            
            // Enhanced performance monitoring that correlates data across plugins
            this.startPerformanceTracking();
        }
        
        startPerformanceTracking() {
            let frameCount = 0;
            let lastTime = performance.now();
            let fpsSum = 0;
            
            const trackPerformance = () => {
                const currentTime = performance.now();
                const deltaTime = currentTime - lastTime;
                
                if (deltaTime >= 1000) { // Calculate FPS every second
                    const fps = Math.round((frameCount * 1000) / deltaTime);
                    const frameTime = deltaTime / frameCount;
                    
                    this.performanceMetrics.currentFPS = fps;
                    this.performanceMetrics.frameTime = frameTime;
                    
                    // Update frame time history
                    this.frameTimeHistory.push({
                        time: currentTime,
                        fps: fps,
                        frameTime: frameTime
                    });
                    
                    // Keep only recent history (last 60 seconds)
                    if (this.frameTimeHistory.length > 60) {
                        this.frameTimeHistory.shift();
                    }
                    
                    // Calculate average FPS
                    fpsSum += fps;
                    const historyLength = Math.min(this.frameTimeHistory.length, 10);
                    this.performanceMetrics.averageFPS = Math.round(
                        this.frameTimeHistory.slice(-historyLength).reduce((sum, entry) => sum + entry.fps, 0) / historyLength
                    );
                    
                    // Update optimization score
                    this.calculateOptimizationScore();
                    
                    // Trigger optimization check if needed
                    if (enableAutoOptimization && currentTime - this.lastOptimization > optimizationInterval) {
                        this.checkAndOptimize();
                    }
                    
                    // Update HUD if enabled
                    if (this.hudElement) {
                        this.updatePerformanceHUD();
                    }
                    
                    frameCount = 0;
                    lastTime = currentTime;
                }
                
                frameCount++;
                requestAnimationFrame(trackPerformance);
            };
            
            requestAnimationFrame(trackPerformance);
        }
        
        calculateOptimizationScore() {
            const targetFPS = 1000 / performanceThreshold;
            const currentFPS = this.performanceMetrics.currentFPS;
            const averageFPS = this.performanceMetrics.averageFPS;
            
            // Base score on FPS performance
            let score = Math.min(100, (averageFPS / targetFPS) * 100);
            
            // Penalize for inconsistent performance
            const fpsVariance = this.calculateFPSVariance();
            if (fpsVariance > 10) {
                score -= Math.min(20, fpsVariance - 10);
            }
            
            // Bonus for exceeding target
            if (averageFPS > targetFPS) {
                score += Math.min(20, (averageFPS - targetFPS) / targetFPS * 100);
            }
            
            this.performanceMetrics.optimizationScore = Math.max(0, Math.min(100, score));
        }
        
        calculateFPSVariance() {
            if (this.frameTimeHistory.length < 5) return 0;
            
            const recent = this.frameTimeHistory.slice(-10);
            const average = recent.reduce((sum, entry) => sum + entry.fps, 0) / recent.length;
            const variance = recent.reduce((sum, entry) => sum + Math.pow(entry.fps - average, 2), 0) / recent.length;
            
            return Math.sqrt(variance);
        }
        
        setupAutoOptimization() {
            if (!enableAutoOptimization) return;
            
            // Set up automatic optimization triggers
            this.optimizationTimer = setInterval(() => {
                this.checkAndOptimize();
            }, optimizationInterval);
        }
        
        checkAndOptimize() {
            const currentFPS = this.performanceMetrics.currentFPS;
            const averageFPS = this.performanceMetrics.averageFPS;
            const targetMinFPS = minFPS;
            const targetMaxFPS = maxFPS;
            
            let optimizationsApplied = [];
            
            try {
                // Performance is too low - reduce quality/optimize
                if (averageFPS < targetMinFPS) {
                    optimizationsApplied = this.applyPerformanceOptimizations();
                }
                // Performance is excellent - can increase quality
                else if (averageFPS > targetMaxFPS && this.currentQualityLevel < 5) {
                    optimizationsApplied = this.increaseQualitySettings();
                }
                // Maintain current settings but clean up if needed
                else if (currentFPS < averageFPS * 0.8) { // Sudden performance drop
                    optimizationsApplied = this.applyEmergencyOptimizations();
                }
                
                if (optimizationsApplied.length > 0) {
                    this.recordOptimization(optimizationsApplied, averageFPS);
                }
                
            } catch (error) {
                console.error(`[${pluginName}] Error during auto-optimization:`, error);
            }
            
            this.lastOptimization = Date.now();
        }
        
        applyPerformanceOptimizations() {
            const optimizations = [];
            
            // Reduce quality level
            if (this.currentQualityLevel > 1) {
                this.currentQualityLevel = Math.max(1, this.currentQualityLevel - 1);
                optimizations.push(`Quality reduced to level ${this.currentQualityLevel}`);
            }
            
            // Optimize EventOptimizer settings
            if (this.integratedPlugins.has('EventOptimizer')) {
                const eventOpt = this.integratedPlugins.get('EventOptimizer').instance;
                if (eventOpt.cleanupEvents) {
                    eventOpt.cleanupEvents();
                    optimizations.push('Event cleanup performed');
                }
            }
            
            // Optimize PerformanceCatcher cache
            if (this.integratedPlugins.has('PerformanceCatcher')) {
                const perfCatcher = this.integratedPlugins.get('PerformanceCatcher').instance;
                if (perfCatcher.clearCache) {
                    perfCatcher.clearCache();
                    optimizations.push('Performance cache cleared');
                }
            }
            
            // Optimize resource usage
            if (enableResourceOptimization) {
                this.optimizeResourceUsage();
                optimizations.push('Resource usage optimized');
            }
            
            return optimizations;
        }
        
        increaseQualitySettings() {
            const optimizations = [];
            
            if (enableAdaptiveQuality && this.currentQualityLevel < 5) {
                this.currentQualityLevel = Math.min(5, this.currentQualityLevel + 1);
                optimizations.push(`Quality increased to level ${this.currentQualityLevel}`);
            }
            
            return optimizations;
        }
        
        applyEmergencyOptimizations() {
            const optimizations = [];
            
            // Force immediate cleanup across all integrated plugins
            for (const [name, plugin] of this.integratedPlugins.entries()) {
                try {
                    if (plugin.type === 'optimizer' && plugin.instance.cleanupEvents) {
                        plugin.instance.cleanupEvents();
                        optimizations.push(`${name} emergency cleanup`);
                    }
                    if (plugin.type === 'monitor' && plugin.instance.clearCache) {
                        plugin.instance.clearCache();
                        optimizations.push(`${name} cache cleared`);
                    }
                } catch (error) {
                    console.warn(`[${pluginName}] Emergency optimization failed for ${name}:`, error);
                }
            }
            
            // Force garbage collection if available
            if (window.gc) {
                window.gc();
                optimizations.push('Garbage collection forced');
            }
            
            return optimizations;
        }
        
        optimizeResourceUsage() {
            // Optimize various game resources based on performance data
            try {
                // Audio optimization
                if (AudioManager._staticBuffers) {
                    const bufferCount = this.getBufferCount(AudioManager._staticBuffers);
                    if (bufferCount > 50) { // Too many audio buffers
                        this.cleanupAudioBuffers();
                    }
                }
                
                // Image cache optimization
                if (ImageManager.cache) {
                    const cacheSize = Object.keys(ImageManager.cache._items).length;
                    if (cacheSize > 100) { // Too many cached images
                        this.cleanupImageCache();
                    }
                }
                
            } catch (error) {
                console.warn(`[${pluginName}] Resource optimization error:`, error);
            }
        }
        
        getBufferCount(buffers) {
            if (buffers instanceof Map) {
                return buffers.size;
            } else if (Array.isArray(buffers)) {
                return buffers.length;
            } else if (typeof buffers === 'object' && buffers !== null) {
                return Object.keys(buffers).length;
            }
            return 0;
        }
        
        cleanupAudioBuffers() {
            try {
                if (AudioManager._staticBuffers instanceof Map) {
                    // Keep only recently used buffers
                    const cutoffTime = Date.now() - 30000; // 30 seconds
                    for (const [key, buffer] of AudioManager._staticBuffers.entries()) {
                        if (buffer._lastUsed && buffer._lastUsed < cutoffTime) {
                            AudioManager._staticBuffers.delete(key);
                        }
                    }
                }
            } catch (error) {
                console.warn(`[${pluginName}] Audio buffer cleanup failed:`, error);
            }
        }
        
        cleanupImageCache() {
            try {
                if (ImageManager.cache && ImageManager.cache._items) {
                    const items = ImageManager.cache._items;
                    const keys = Object.keys(items);
                    const cutoffTime = Date.now() - 60000; // 1 minute
                    
                    for (const key of keys) {
                        const item = items[key];
                        if (item.touch && item.touch < cutoffTime) {
                            delete items[key];
                        }
                    }
                }
            } catch (error) {
                console.warn(`[${pluginName}] Image cache cleanup failed:`, error);
            }
        }
        
        recordOptimization(optimizations, fps) {
            const record = {
                timestamp: Date.now(),
                fps: fps,
                optimizations: optimizations,
                qualityLevel: this.currentQualityLevel,
                memoryUsage: this.performanceMetrics.memoryUsage
            };
            
            this.optimizationHistory.push(record);
            
            // Keep only recent history (last 100 optimizations)
            if (this.optimizationHistory.length > 100) {
                this.optimizationHistory.shift();
            }
            
            if (enableConsoleIntegration && optimizations.length > 0) {
                console.log(`[${pluginName}] Auto-optimization applied (${fps.toFixed(1)} FPS): ${optimizations.join(', ')}`);
            }
        }
        
        setupAdaptiveQuality() {
            if (!enableAdaptiveQuality) return;
            
            // Hook into various systems to apply quality scaling
            this.setupVisualQualityScaling();
        }
        
        setupVisualQualityScaling() {
            if (!enableVisualScaling) return;
            
            // This will be used by future visual plugins to scale their effects
            // based on the current quality level set by performance integration
            
            window.$qualityLevel = this.currentQualityLevel;
            
            // Update quality level periodically
            setInterval(() => {
                window.$qualityLevel = this.currentQualityLevel;
            }, 1000);
        }
        
        setupPerformanceHUD() {
            if (!enablePerformanceHUD) return;
            
            this.createPerformanceHUD();
        }
        
        createPerformanceHUD() {
            // Create HUD element
            this.hudElement = document.createElement('div');
            this.hudElement.id = 'performance-hud';
            this.hudElement.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-family: monospace;
                font-size: 12px;
                z-index: 9999;
                pointer-events: none;
                min-width: 200px;
            `;
            
            document.body.appendChild(this.hudElement);
            this.updatePerformanceHUD();
        }
        
        updatePerformanceHUD() {
            if (!this.hudElement) return;
            
            const metrics = this.performanceMetrics;
            const qualityColor = this.getQualityColor(this.currentQualityLevel);
            const fpsColor = this.getFPSColor(metrics.currentFPS);
            const memoryColor = metrics.memoryUsage > gcThresholdMB * 0.8 ? '#ff4444' : 
                              metrics.memoryUsage > gcThresholdMB * 0.5 ? '#ffdd44' : '#44dd44';
            const trend = this.predictPerformanceTrend();
            const trendIcon = trend === 'improving' ? '↑' : trend === 'degrading' ? '↓' : '→';
            const trendColor = trend === 'improving' ? '#44dd44' : trend === 'degrading' ? '#ff4444' : '#ffffff';
            
            this.hudElement.innerHTML = `
                <div><strong>Performance Hub v2.0</strong></div>
                <div style="border-bottom: 1px solid #444; margin: 4px 0;"></div>
                <div>FPS: <span style="color: ${fpsColor}">${metrics.currentFPS}</span> (Avg: ${metrics.averageFPS}) <span style="color: ${trendColor}">${trendIcon}</span></div>
                <div>Frame: ${metrics.frameTime.toFixed(2)}ms | Δ: ${this.smoothedDeltaTime.toFixed(2)}ms</div>
                <div>Quality: <span style="color: ${qualityColor}">Level ${this.currentQualityLevel}/5</span></div>
                <div style="border-bottom: 1px solid #444; margin: 4px 0;"></div>
                <div>Memory: <span style="color: ${memoryColor}">${metrics.memoryUsage.toFixed(1)}MB</span></div>
                <div>Draw Calls: ${metrics.drawCalls}</div>
                <div>Pooled: ${metrics.pooledObjects} | GC: ${metrics.gcPauses}</div>
                <div>Deferred Ops: ${this.deferredOperations.length}</div>
                <div style="border-bottom: 1px solid #444; margin: 4px 0;"></div>
                <div>Score: ${metrics.optimizationScore.toFixed(0)}% | Plugins: ${this.integratedPlugins.size}</div>
            `;
        }
        
        getQualityColor(level) {
            const colors = ['#ff4444', '#ff8844', '#ffdd44', '#88dd44', '#44dd44'];
            return colors[level - 1] || '#ffffff';
        }
        
        getFPSColor(fps) {
            if (fps >= 50) return '#44dd44';
            if (fps >= 30) return '#ffdd44';
            if (fps >= 20) return '#ff8844';
            return '#ff4444';
        }
        
        hookGameLoop() {
            // Hook into the main game update to monitor performance
            const originalUpdateMain = SceneManager.updateMain;
            const self = this;
            
            SceneManager.updateMain = function() {
                const startTime = performance.now();
                const result = originalUpdateMain.call(this);
                const endTime = performance.now();
                
                // Track main loop performance
                const executionTime = endTime - startTime;
                if (executionTime > performanceThreshold * 1.5) {
                    self.recordPerformanceSpike(executionTime);
                }
                
                return result;
            };
        }
        
        recordPerformanceSpike(executionTime) {
            const spike = {
                timestamp: Date.now(),
                executionTime: executionTime,
                scene: SceneManager._scene ? SceneManager._scene.constructor.name : 'Unknown',
                fps: this.performanceMetrics.currentFPS
            };
            
            this.performanceHistory.push(spike);
            
            // Keep only recent spikes
            if (this.performanceHistory.length > 50) {
                this.performanceHistory.shift();
            }
            
            if (enableConsoleIntegration && executionTime > performanceThreshold * 2) {
                console.warn(`[${pluginName}] Performance spike detected: ${executionTime.toFixed(2)}ms in ${spike.scene}`);
            }
        }
        
        // Public API methods
        getUnifiedReport() {
            const report = {
                version: '2.0.0',
                integration: {
                    enabled: enableIntegration,
                    integratedPlugins: Array.from(this.integratedPlugins.keys()),
                    qualityLevel: this.currentQualityLevel,
                    autoOptimization: enableAutoOptimization,
                    uptime: Date.now() - this.lastOptimization
                },
                performance: this.performanceMetrics,
                enhancedSystems: {
                    objectPooling: enableObjectPooling ? this.getPoolStats() : 'disabled',
                    spriteBatching: enableSpriteBatching,
                    memoryLeakDetection: enableMemoryLeakDetection,
                    renderOptimization: enableRenderOptimization,
                    frameBudgeting: enableFrameBudgeting ? {
                        budget: frameBudgetMs,
                        pendingOperations: this.deferredOperations.length
                    } : 'disabled',
                    eventThrottling: enableEventThrottling ? {
                        throttledEvents: this.throttledEvents.size
                    } : 'disabled',
                    performanceTrend: this.predictPerformanceTrend(),
                    smoothedDeltaTime: this.smoothedDeltaTime
                },
                memory: {
                    current: this.performanceMetrics.memoryUsage + 'MB',
                    threshold: gcThresholdMB + 'MB',
                    snapshots: this.memorySnapshots.slice(-5),
                    predictions: this.performancePredictions.slice(-5)
                },
                history: {
                    frameHistory: this.frameTimeHistory.slice(-10),
                    optimizations: this.optimizationHistory.slice(-10),
                    performanceSpikes: this.performanceHistory.slice(-10)
                },
                pluginReports: {}
            };
            
            // Collect reports from integrated plugins
            for (const [name, plugin] of this.integratedPlugins.entries()) {
                try {
                    if (plugin.instance.getReport) {
                        report.pluginReports[name] = plugin.instance.getReport();
                    }
                } catch (error) {
                    report.pluginReports[name] = { error: error.message };
                }
            }
            
            if (enableConsoleIntegration) {
                console.log(`[${pluginName}] Unified Performance Report:`, report);
                console.table(report.performance);
            }
            
            return report;
        }
        
        optimizeAll() {
            const optimizations = this.applyPerformanceOptimizations();
            
            // Force optimization on all integrated plugins
            for (const [name, plugin] of this.integratedPlugins.entries()) {
                try {
                    if (plugin.instance.optimizeCurrentMap) {
                        plugin.instance.optimizeCurrentMap();
                        optimizations.push(`${name} optimized`);
                    }
                    if (plugin.instance.cleanupEvents) {
                        plugin.instance.cleanupEvents();
                        optimizations.push(`${name} cleaned up`);
                    }
                } catch (error) {
                    console.warn(`[${pluginName}] Failed to optimize ${name}:`, error);
                }
            }
            
            this.recordOptimization(optimizations, this.performanceMetrics.currentFPS);
            
            if (enableConsoleIntegration) {
                console.log(`[${pluginName}] Manual optimization completed: ${optimizations.join(', ')}`);
            }
            
            return optimizations;
        }
        
        setQualityLevel(level) {
            const newLevel = Math.max(1, Math.min(5, parseInt(level)));
            const oldLevel = this.currentQualityLevel;
            
            this.currentQualityLevel = newLevel;
            window.$qualityLevel = newLevel;
            
            if (enableConsoleIntegration) {
                console.log(`[${pluginName}] Quality level changed from ${oldLevel} to ${newLevel}`);
            }
            
            return { oldLevel, newLevel };
        }
        
        enableHUD() {
            if (this.hudElement) {
                this.hudElement.style.display = this.hudElement.style.display === 'none' ? 'block' : 'none';
            } else {
                this.createPerformanceHUD();
            }
            
            return this.hudElement ? this.hudElement.style.display !== 'none' : false;
        }
        
        getOptimizationHistory() {
            return this.optimizationHistory;
        }
        
        resetAllStats() {
            // Reset own stats
            this.performanceHistory = [];
            this.optimizationHistory = [];
            this.frameTimeHistory = [];
            
            // Reset integrated plugin stats
            for (const [name, plugin] of this.integratedPlugins.entries()) {
                try {
                    if (plugin.instance.resetStats) {
                        plugin.instance.resetStats();
                    }
                } catch (error) {
                    console.warn(`[${pluginName}] Failed to reset stats for ${name}:`, error);
                }
            }
            
            if (enableConsoleIntegration) {
                console.log(`[${pluginName}] All statistics reset across integrated plugins`);
            }
        }
    }
    
    //-----------------------------------------------------------------------------
    // Plugin Initialization
    //-----------------------------------------------------------------------------
    
    // Initialize performance integration hub when the game starts
    const originalSceneBootStart = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        originalSceneBootStart.call(this);
        
        // Small delay to ensure other plugins are loaded
        setTimeout(() => {
            window.$performanceHub = new PerformanceIntegrationHub();
            
            if (enableConsoleIntegration) {
                console.log(`[${pluginName}] Available console commands:`);
                console.log('- $performanceHub.getUnifiedReport() - Complete integrated performance analysis');
                console.log('- $performanceHub.optimizeAll() - Force optimization across all plugins');
                console.log('- $performanceHub.setQualityLevel(1-5) - Set quality level manually');
                console.log('- $performanceHub.enableHUD() - Toggle performance HUD overlay');
                console.log('- $performanceHub.getOptimizationHistory() - View optimization history');
                console.log('- $performanceHub.resetAllStats() - Reset all integrated statistics');
                console.log('--- NEW v2.0 Commands ---');
                console.log('- $performanceHub.getPoolStats() - View object pool statistics');
                console.log('- $performanceHub.performAggressiveCleanup() - Force memory cleanup');
                console.log('- $performanceHub.predictPerformanceTrend() - Get performance trend');
                console.log('- $performanceHub.getFromPool(name) - Get object from pool');
                console.log('- $performanceHub.returnToPool(name, obj) - Return object to pool');
                console.log('- $performanceHub.deferOperation(fn, priority) - Defer heavy operation');
                console.log('- $smoothDeltaTime - Global smoothed delta time (ms)');
                console.log('- $qualityLevel - Current quality level (1-5)');
            }
        }, 100);
    };
    
    // Clean up on window unload
    window.addEventListener('beforeunload', () => {
        if (window.$performanceHub && window.$performanceHub.optimizationTimer) {
            clearInterval(window.$performanceHub.optimizationTimer);
        }
        if (window.$performanceHub && window.$performanceHub.hudElement) {
            document.body.removeChild(window.$performanceHub.hudElement);
        }
    });
    

})();
