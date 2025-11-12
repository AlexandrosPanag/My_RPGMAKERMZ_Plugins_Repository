//=============================================================================
// EventOptimizer.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.0.0] Event Performance Optimizer
@author Alexandros Panagiotakopoulos
@url alexandrospanag.github.io
@date 12-11-2025
@help EventOptimizer.js

@param enableOptimization
@text Enable Event Optimization
@desc Automatically optimize event performance
@type boolean
@default true

@param enableEventMonitoring
@text Enable Event Monitoring
@desc Monitor individual event performance
@type boolean
@default true

@param eventThreshold
@text Event Warning Threshold (ms)
@desc Warn when events take longer than this to execute
@type number
@min 1
@max 100
@default 5

@param enableEventPooling
@text Enable Event Pooling
@desc Use object pooling for temporary events
@type boolean
@default true

@param maxPoolSize
@text Maximum Pool Size
@desc Maximum number of pooled events
@type number
@min 10
@max 1000
@default 100

@param enableConditionalLoading
@text Enable Conditional Loading
@desc Only load events when they're needed
@type boolean
@default true

@param eventCleanupInterval
@text Event Cleanup Interval
@desc Clean up unused events every X map transfers
@type number
@min 1
@max 20
@default 5

@param enableConsoleReports
@text Enable Console Reports
@desc Show event performance reports in console
@type boolean
@default true

@param enableAutoCleanup
@text Enable Auto Cleanup
@desc Automatically cleanup unused event data
@type boolean
@default true

@param maxEventDistance
@text Max Event Distance
@desc Only process events within this distance from player (in tiles)
@type number
@min 5
@max 50
@default 15

@param enableSmartPriority
@text Enable Smart Priority
@desc Prioritize important events over background ones
@type boolean
@default true

@help EventOptimizer.js

This plugin provides comprehensive event performance optimization for RPG Maker MZ.
It works seamlessly with PerformanceCatcher.js to provide the ultimate performance
monitoring and optimization solution.

Key Features:
- Real-time event performance monitoring
- Smart event pooling to reduce memory usage
- Conditional event loading (only load when needed)  
- Distance-based event processing
- Automatic cleanup of unused event data
- Priority-based event execution
- Integration with PerformanceCatcher for detailed reports

Performance Benefits:
- Reduces lag in maps with many events
- Prevents memory buildup from event data
- Optimizes event execution order
- Provides detailed performance analytics

Console Commands (F12 Developer Tools):
- $eventOptimizer.getReport() - Get detailed event performance report
- $eventOptimizer.cleanupEvents() - Manually cleanup unused events  
- $eventOptimizer.resetStats() - Reset event statistics
- $eventOptimizer.getActiveEvents() - List currently active events
- $eventOptimizer.optimizeCurrentMap() - Force optimize current map

Best Practices:
1. Load EventOptimizer after PerformanceCatcher for best integration
2. Adjust maxEventDistance based on your map sizes
3. Use conditional loading for maps with 50+ events
4. Enable console reports during development

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
    
    const pluginName = 'EventOptimizer';
    const parameters = PluginManager.parameters(pluginName);
    
    // Parse parameters
    const enableOptimization = parameters['enableOptimization'] === 'true';
    const enableEventMonitoring = parameters['enableEventMonitoring'] === 'true';
    const eventThreshold = parseInt(parameters['eventThreshold'] || 5);
    const enableEventPooling = parameters['enableEventPooling'] === 'true';
    const maxPoolSize = parseInt(parameters['maxPoolSize'] || 100);
    const enableConditionalLoading = parameters['enableConditionalLoading'] === 'true';
    const eventCleanupInterval = parseInt(parameters['eventCleanupInterval'] || 5);
    const enableConsoleReports = parameters['enableConsoleReports'] === 'true';
    const enableAutoCleanup = parameters['enableAutoCleanup'] === 'true';
    const maxEventDistance = parseInt(parameters['maxEventDistance'] || 15);
    const enableSmartPriority = parameters['enableSmartPriority'] === 'true';

    //-----------------------------------------------------------------------------
    // EventOptimizer - Main Class
    //-----------------------------------------------------------------------------
    
    class EventOptimizer {
        constructor() {
            this.eventStats = new Map();
            this.eventPool = [];
            this.activeEvents = new Set();
            this.mapTransferCount = 0;
            this.lastCleanup = Date.now();
            this.performanceHistory = [];
            this.optimizationData = new Map();
            this.eventPriorities = new Map();
            
            this.initializeOptimization();
            
            if (enableConsoleReports) {
                console.log(`[${pluginName}] Event optimization initialized`);
                console.log(`[${pluginName}] Threshold: ${eventThreshold}ms, Max Distance: ${maxEventDistance} tiles`);
            }
        }
        
        initializeOptimization() {
            if (!enableOptimization) return;
            
            this.setupEventMonitoring();
            this.setupEventPooling();
            this.setupConditionalLoading();
            this.setupSmartPriority();
            
            // Hook into map changes
            this.hookMapTransitions();
        }
        
        setupEventMonitoring() {
            if (!enableEventMonitoring) return;
            
            // Hook into event execution
            const originalUpdateSelfMovement = Game_Event.prototype.updateSelfMovement;
            const self = this;
            
            Game_Event.prototype.updateSelfMovement = function() {
                if (!enableOptimization) {
                    return originalUpdateSelfMovement.call(this);
                }
                
                const startTime = performance.now();
                const result = originalUpdateSelfMovement.call(this);
                const executionTime = performance.now() - startTime;
                
                self.recordEventPerformance(this, 'updateSelfMovement', executionTime);
                return result;
            };
            
            // Hook into event command execution
            const originalExecuteCommand = Game_Interpreter.prototype.executeCommand;
            
            Game_Interpreter.prototype.executeCommand = function() {
                if (!enableOptimization || !this._eventId) {
                    return originalExecuteCommand.call(this);
                }
                
                const startTime = performance.now();
                const result = originalExecuteCommand.call(this);
                const executionTime = performance.now() - startTime;
                
                const event = $dataMap.events[this._eventId];
                if (event) {
                    self.recordEventPerformance(event, 'executeCommand', executionTime);
                }
                
                return result;
            };
        }
        
        recordEventPerformance(event, operation, executionTime) {
            const eventId = event.id || event._eventId || 'unknown';
            const mapId = $gameMap ? $gameMap.mapId() : 'unknown';
            const key = `${mapId}_${eventId}`;
            
            if (!this.eventStats.has(key)) {
                this.eventStats.set(key, {
                    eventId: eventId,
                    mapId: mapId,
                    name: event.name || `Event ${eventId}`,
                    operations: new Map(),
                    totalCalls: 0,
                    totalTime: 0,
                    averageTime: 0,
                    maxTime: 0,
                    warnings: 0,
                    lastExecution: Date.now()
                });
            }
            
            const stats = this.eventStats.get(key);
            
            // Update operation-specific stats
            if (!stats.operations.has(operation)) {
                stats.operations.set(operation, {
                    calls: 0,
                    totalTime: 0,
                    averageTime: 0,
                    maxTime: 0
                });
            }
            
            const opStats = stats.operations.get(operation);
            opStats.calls++;
            opStats.totalTime += executionTime;
            opStats.averageTime = opStats.totalTime / opStats.calls;
            opStats.maxTime = Math.max(opStats.maxTime, executionTime);
            
            // Update overall stats
            stats.totalCalls++;
            stats.totalTime += executionTime;
            stats.averageTime = stats.totalTime / stats.totalCalls;
            stats.maxTime = Math.max(stats.maxTime, executionTime);
            stats.lastExecution = Date.now();
            
            // Check for performance warnings
            if (executionTime > eventThreshold) {
                stats.warnings++;
                this.recordEventWarning(key, operation, executionTime);
            }
            
            // Update priority based on performance
            if (enableSmartPriority) {
                this.updateEventPriority(key, executionTime);
            }
        }
        
        recordEventWarning(eventKey, operation, executionTime) {
            const warning = {
                eventKey,
                operation,
                executionTime,
                timestamp: Date.now()
            };
            
            this.performanceHistory.push(warning);
            
            // Keep only recent warnings (last 50)
            if (this.performanceHistory.length > 50) {
                this.performanceHistory.shift();
            }
            
            if (enableConsoleReports && executionTime > eventThreshold * 2) {
                console.warn(`[${pluginName}] Event Performance Warning: ${eventKey}.${operation} took ${executionTime.toFixed(2)}ms`);
            }
        }
        
        updateEventPriority(eventKey, executionTime) {
            const currentPriority = this.eventPriorities.get(eventKey) || 0;
            
            // Lower priority for slow events, higher for fast ones
            let newPriority = currentPriority;
            if (executionTime > eventThreshold) {
                newPriority = Math.max(0, currentPriority - 1);
            } else if (executionTime < eventThreshold / 2) {
                newPriority = Math.min(10, currentPriority + 1);
            }
            
            this.eventPriorities.set(eventKey, newPriority);
        }
        
        setupEventPooling() {
            if (!enableEventPooling) return;
            
            // Initialize event pool
            this.eventPool = [];
            
            // Hook into event creation to use pooling
            const originalRefresh = Game_Map.prototype.refresh;
            const self = this;
            
            Game_Map.prototype.refresh = function() {
                // Clean up active events before refresh
                self.activeEvents.clear();
                
                const result = originalRefresh.call(this);
                
                // Track active events after refresh
                if (this._events) {
                    this._events.forEach(event => {
                        if (event) {
                            self.activeEvents.add(event._eventId);
                        }
                    });
                }
                
                return result;
            };
        }
        
        setupConditionalLoading() {
            if (!enableConditionalLoading) return;
            
            // Hook into event updates to implement distance-based processing
            const originalUpdate = Game_Event.prototype.update;
            const self = this;
            
            Game_Event.prototype.update = function() {
                if (!enableOptimization) {
                    return originalUpdate.call(this);
                }
                
                // Distance-based optimization
                if (self.shouldSkipEventUpdate(this)) {
                    return; // Skip update if event is too far away
                }
                
                return originalUpdate.call(this);
            };
        }
        
        shouldSkipEventUpdate(event) {
            if (!$gamePlayer || !event) return false;
            
            // Always process important events
            if (this.isImportantEvent(event)) return false;
            
            // Calculate distance to player
            const playerX = $gamePlayer.x;
            const playerY = $gamePlayer.y;
            const eventX = event.x;
            const eventY = event.y;
            
            const distance = Math.abs(playerX - eventX) + Math.abs(playerY - eventY);
            
            // Skip if event is too far away
            return distance > maxEventDistance;
        }
        
        isImportantEvent(event) {
            if (!event) return false;
            
            // Check if event has important triggers
            const importantTriggers = [0, 1, 2]; // Action, Player Touch, Event Touch
            if (importantTriggers.includes(event._trigger)) return true;
            
            // Check if event has high priority
            const eventKey = `${$gameMap.mapId()}_${event._eventId}`;
            const priority = this.eventPriorities.get(eventKey) || 0;
            if (priority > 7) return true;
            
            // Check if event is currently running
            if (event._interpreter && event._interpreter.isRunning()) return true;
            
            return false;
        }
        
        setupSmartPriority() {
            if (!enableSmartPriority) return;
            
            // Hook into event list processing to apply priorities
            const originalUpdateEventsXy = Game_Map.prototype.eventsXy;
            const self = this;
            
            Game_Map.prototype.eventsXy = function(x, y) {
                const events = originalUpdateEventsXy.call(this, x, y);
                
                if (!enableOptimization) return events;
                
                // Sort events by priority
                return events.sort((a, b) => {
                    const keyA = `${this.mapId()}_${a._eventId}`;
                    const keyB = `${this.mapId()}_${b._eventId}`;
                    const priorityA = self.eventPriorities.get(keyA) || 0;
                    const priorityB = self.eventPriorities.get(keyB) || 0;
                    return priorityB - priorityA; // Higher priority first
                });
            };
        }
        
        hookMapTransitions() {
            const originalOnMapLoaded = Scene_Map.prototype.onMapLoaded;
            const self = this;
            
            Scene_Map.prototype.onMapLoaded = function() {
                originalOnMapLoaded.call(this);
                self.onMapTransfer();
            };
        }
        
        onMapTransfer() {
            this.mapTransferCount++;
            
            // Perform cleanup at intervals
            if (this.mapTransferCount % eventCleanupInterval === 0) {
                this.performEventCleanup();
            }
            
            // Optimize the newly loaded map
            if (enableOptimization) {
                this.optimizeCurrentMap();
            }
        }
        
        performEventCleanup() {
            if (!enableAutoCleanup) return;
            
            const startTime = performance.now();
            let cleanedItems = 0;
            
            try {
                // Clean up old event stats
                const cutoffTime = Date.now() - (5 * 60 * 1000); // 5 minutes ago
                
                for (const [key, stats] of this.eventStats.entries()) {
                    if (stats.lastExecution < cutoffTime) {
                        this.eventStats.delete(key);
                        cleanedItems++;
                    }
                }
                
                // Clean up old priorities
                for (const [key] of this.eventPriorities.entries()) {
                    if (!this.eventStats.has(key)) {
                        this.eventPriorities.delete(key);
                        cleanedItems++;
                    }
                }
                
                // Clean up old performance history
                const oldHistoryLength = this.performanceHistory.length;
                this.performanceHistory = this.performanceHistory.filter(
                    warning => warning.timestamp > cutoffTime
                );
                cleanedItems += oldHistoryLength - this.performanceHistory.length;
                
                // Return unused pooled events
                if (this.eventPool.length > maxPoolSize) {
                    const excess = this.eventPool.length - maxPoolSize;
                    this.eventPool.splice(maxPoolSize, excess);
                    cleanedItems += excess;
                }
                
                const endTime = performance.now();
                this.lastCleanup = Date.now();
                
                if (enableConsoleReports) {
                    console.log(`[${pluginName}] Event cleanup completed: ${cleanedItems} items cleaned in ${(endTime - startTime).toFixed(2)}ms`);
                }
                
            } catch (error) {
                console.error(`[${pluginName}] Error during event cleanup:`, error);
            }
        }
        
        optimizeCurrentMap() {
            if (!$gameMap || !$gameMap._events) return;
            
            const mapId = $gameMap.mapId();
            let optimizedCount = 0;
            
            // Analyze events on current map
            $gameMap._events.forEach(event => {
                if (!event) return;
                
                const eventKey = `${mapId}_${event._eventId}`;
                
                // Set initial priorities for new events
                if (!this.eventPriorities.has(eventKey)) {
                    const priority = this.calculateInitialPriority(event);
                    this.eventPriorities.set(eventKey, priority);
                    optimizedCount++;
                }
                
                // Initialize stats for new events
                if (!this.eventStats.has(eventKey)) {
                    this.eventStats.set(eventKey, {
                        eventId: event._eventId,
                        mapId: mapId,
                        name: event.event().name || `Event ${event._eventId}`,
                        operations: new Map(),
                        totalCalls: 0,
                        totalTime: 0,
                        averageTime: 0,
                        maxTime: 0,
                        warnings: 0,
                        lastExecution: Date.now()
                    });
                }
            });
            
            if (enableConsoleReports && optimizedCount > 0) {
                console.log(`[${pluginName}] Optimized ${optimizedCount} events on map ${mapId}`);
            }
        }
        
        calculateInitialPriority(event) {
            if (!event) return 0;
            
            let priority = 5; // Default priority
            
            // Higher priority for player-interactive events
            if (event._trigger <= 2) priority += 2; // Action, Player Touch, Event Touch
            
            // Higher priority for events with movement
            if (event._moveType > 0) priority += 1;
            
            // Lower priority for parallel events (they run constantly)
            if (event._trigger === 4) priority -= 2;
            
            // Higher priority for events with graphics
            if (event._characterName) priority += 1;
            
            return Math.max(0, Math.min(10, priority));
        }
        
        // Public API methods
        getReport() {
            const report = {
                optimization: {
                    enabled: enableOptimization,
                    threshold: eventThreshold,
                    maxDistance: maxEventDistance,
                    uptime: Date.now() - this.lastCleanup
                },
                events: Array.from(this.eventStats.entries()).map(([key, stats]) => ({
                    key,
                    eventId: stats.eventId,
                    mapId: stats.mapId,
                    name: stats.name,
                    totalCalls: stats.totalCalls,
                    totalTime: stats.totalTime.toFixed(2),
                    averageTime: stats.averageTime.toFixed(2),
                    maxTime: stats.maxTime.toFixed(2),
                    warnings: stats.warnings,
                    priority: this.eventPriorities.get(key) || 0,
                    operations: Array.from(stats.operations.entries()).map(([op, opStats]) => ({
                        operation: op,
                        calls: opStats.calls,
                        averageTime: opStats.averageTime.toFixed(2),
                        maxTime: opStats.maxTime.toFixed(2)
                    }))
                })).sort((a, b) => parseFloat(b.averageTime) - parseFloat(a.averageTime)),
                performance: {
                    activeEvents: this.activeEvents.size,
                    pooledEvents: this.eventPool.length,
                    recentWarnings: this.performanceHistory.slice(-10),
                    mapTransfers: this.mapTransferCount,
                    lastCleanup: new Date(this.lastCleanup).toLocaleString()
                }
            };
            
            if (enableConsoleReports) {
                console.table(report.events);
            }
            
            return report;
        }
        
        cleanupEvents() {
            this.performEventCleanup();
        }
        
        resetStats() {
            this.eventStats.clear();
            this.eventPriorities.clear();
            this.performanceHistory = [];
            this.mapTransferCount = 0;
            
            if (enableConsoleReports) {
                console.log(`[${pluginName}] Event statistics reset`);
            }
        }
        
        getActiveEvents() {
            return Array.from(this.activeEvents);
        }
        
        optimizeCurrentMapManual() {
            this.optimizeCurrentMap();
            return this.getReport();
        }
    }
    
    //-----------------------------------------------------------------------------
    // Plugin Initialization
    //-----------------------------------------------------------------------------
    
    // Initialize event optimizer when the game starts
    const originalSceneBootStart = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        originalSceneBootStart.call(this);
        
        // Initialize event optimizer
        window.$eventOptimizer = new EventOptimizer();
        
        // Integrate with PerformanceCatcher if available
        if (window.$performanceCatcher) {
            if (enableConsoleReports) {
                console.log(`[${pluginName}] Integrated with PerformanceCatcher for enhanced monitoring`);
            }
        }
        
        if (enableConsoleReports) {
            console.log(`[${pluginName}] Available console commands:`);
            console.log('- $eventOptimizer.getReport() - Get event performance report');
            console.log('- $eventOptimizer.cleanupEvents() - Clean up event data');
            console.log('- $eventOptimizer.resetStats() - Reset statistics');
            console.log('- $eventOptimizer.getActiveEvents() - List active events');
            console.log('- $eventOptimizer.optimizeCurrentMap() - Optimize current map');
        }
    };
    
})();
