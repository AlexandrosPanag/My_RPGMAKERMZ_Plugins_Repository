//=============================================================================
// PerformanceIntegration.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.0.0] Performance Integration Hub
@author Alexandros Panagiotakopoulos
@url 
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
                optimizationScore: 100
            };
            
            this.initializeIntegration();
            
            if (enableConsoleIntegration) {
                console.log(`[${pluginName}] Performance Integration Hub initialized`);
                console.log(`[${pluginName}] Target: ${performanceThreshold.toFixed(2)}ms (${(1000/performanceThreshold).toFixed(1)} FPS)`);
            }
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
            
            this.hudElement.innerHTML = `
                <div><strong>Performance Hub</strong></div>
                <div>FPS: <span style="color: ${fpsColor}">${metrics.currentFPS}</span> (Avg: ${metrics.averageFPS})</div>
                <div>Frame Time: ${metrics.frameTime.toFixed(2)}ms</div>
                <div>Quality: <span style="color: ${qualityColor}">Level ${this.currentQualityLevel}</span></div>
                <div>Score: ${metrics.optimizationScore.toFixed(0)}%</div>
                <div>Plugins: ${this.integratedPlugins.size}</div>
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
                integration: {
                    enabled: enableIntegration,
                    integratedPlugins: Array.from(this.integratedPlugins.keys()),
                    qualityLevel: this.currentQualityLevel,
                    autoOptimization: enableAutoOptimization,
                    uptime: Date.now() - this.lastOptimization
                },
                performance: this.performanceMetrics,
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
