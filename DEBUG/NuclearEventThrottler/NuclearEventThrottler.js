//=============================================================================
// NuclearEventThrottler.js - EXTREME STRESS TEST
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Nuclear event stress test - Spawns massive amounts of events until crash/freeze for debugging
 * @author Alexandros Panagiotakopoulos
 * @date 2025-10-20
 * @url https://alexandrospanag.github.io
 *
 * @param initialSpawnCount
 * @text Initial Spawn Count
 * @type number
 * @min 10
 * @max 1000
 * @default 100
 * @desc How many events to spawn in the first wave
 *
 * @param spawnInterval
 * @text Spawn Interval (frames)
 * @type number
 * @min 1
 * @max 300
 * @default 60
 * @desc How often to spawn new waves (60 frames = 1 second)
 *
 * @param incrementPerWave
 * @text Increment Per Wave
 * @type number
 * @min 1
 * @max 500
 * @default 50
 * @desc How many more events to add each wave
 *
 * @param maxEvents
 * @text Maximum Events (Safety)
 * @type number
 * @min 100
 * @max 100000
 * @default 10000
 * @desc Safety limit before auto-stop (set high for true nuclear test)
 *
 * @param enableMovement
 * @text Enable Event Movement
 * @type boolean
 * @default true
 * @desc Make events move randomly (more CPU intensive)
 *
 * @param enableAnimations
 * @text Enable Animations
 * @type boolean
 * @default true
 * @desc Add animations to events (more GPU intensive)
 *
 * @param monitorFPS
 * @text Monitor FPS
 * @type boolean
 * @default true
 * @desc Track and display FPS degradation
 *
 * @param autoStopOnLowFPS
 * @text Auto Stop on Low FPS
 * @type boolean
 * @default false
 * @desc Stop spawning when FPS drops below 10 (safety feature)
 *
 * @param showEventMarkers
 * @text Show Event Markers
 * @type boolean
 * @default false
 * @desc Show small visual markers where invisible events are (debug only)
 * 
 * @param testKey
 * @text Activation Key
 * @type string
 * @default F9
 * @desc Key to start/stop the stress test (F9, F10, F11, F12)
 *
 * @help
 * ============================================================================
 * Nuclear Event Throttler - EXTREME STRESS TEST
 * ============================================================================
 * 
 * ⚠️ WARNING: FOR DEBUGGING AND TESTING ONLY! ⚠️
 * This plugin is designed to deliberately crash or freeze your game to test
 * hardware limits and engine performance boundaries.
 * 
 * DO NOT USE IN PRODUCTION BUILDS!
 * 
 * Features:
 * - Spawns exponentially increasing amounts of events
 * - Real-time performance monitoring (FPS, event count, memory)
 * - Console logging of all performance metrics
 * - Customizable stress parameters
 * - Optional movement and animations for increased load
 * - Safety limits (can be disabled for true nuclear testing)
 * 
 * How to Use:
 * 1. Start your game on any map
 * 2. Press F9 (or configured key) to begin stress test
 * 3. Watch console (F12) for performance data
 * 4. Game will progressively slow down until freeze/crash
 * 5. Press F9 again to stop/reset (if still responsive)
 * 
 * Console Output:
 * - Event count per wave
 * - Current FPS
 * - Total events spawned
 * - Memory usage (if available)
 * - Performance warnings
 * - Crash point detection
 * 
 * Testing Different Scenarios:
 * - Static events: Disable movement/animations
 * - Moving events: Enable movement only
 * - Full chaos: Enable everything + low spawn interval
 * - Memory test: High spawn count, low interval
 * - GPU test: Enable animations, disable movement
 * 
 * Performance Benchmarks to Watch:
 * - FPS drops below 60: Noticeable lag
 * - FPS drops below 30: Severe lag
 * - FPS drops below 10: Near freeze
 * - FPS drops to 0: Frozen/crashed
 * 
 * ⚠️ THIS WILL CRASH YOUR GAME - THAT'S THE POINT! ⚠️
 * ============================================================================
 */

(() => {
    'use strict';
    
    const pluginName = "NuclearEventThrottler";
    const parameters = PluginManager.parameters(pluginName);
    
    const config = {
    initialSpawn: Number(parameters['initialSpawnCount'] || 100),
    interval: Number(parameters['spawnInterval'] || 60),
    increment: Number(parameters['incrementPerWave'] || 50),
    maxEvents: Number(parameters['maxEvents'] || 10000),
    enableMovement: parameters['enableMovement'] !== 'false',
    enableAnimations: parameters['enableAnimations'] !== 'false',
    monitorFPS: parameters['monitorFPS'] !== 'false',
    autoStop: parameters['autoStopOnLowFPS'] === 'true',
    showEventMarkers: parameters['showEventMarkers'] === 'true',
    testKey: String(parameters['testKey'] || 'F9')
};
    
    let testState = {
        active: false,
        waveCount: 0,
        totalEvents: 0,
        frameCounter: 0,
        lastFPS: 60,
        fpsHistory: [],
        spawnedEventIds: [],
        startTime: 0,
        lastSpawnTime: 0,
        performanceData: []
    };
    
    // Console styling
    const styles = {
        title: 'background: #ff0000; color: #ffffff; font-size: 16px; font-weight: bold; padding: 5px;',
        warning: 'background: #ff6600; color: #ffffff; font-size: 14px; padding: 3px;',
        info: 'background: #0066ff; color: #ffffff; font-size: 12px; padding: 2px;',
        success: 'background: #00ff00; color: #000000; font-size: 12px; padding: 2px;',
        danger: 'background: #ff0000; color: #ffffff; font-size: 14px; font-weight: bold; padding: 3px;',
        data: 'color: #00ffff; font-size: 11px;'
    };
    
    //-----------------------------------------------------------------------------
    // Performance Monitor
    //-----------------------------------------------------------------------------
    
    class PerformanceMonitor {
        constructor() {
            this.lastTime = performance.now();
            this.frames = 0;
            this.fps = 60;
        }
        
        update() {
            this.frames++;
            const currentTime = performance.now();
            const elapsed = currentTime - this.lastTime;
            
            if (elapsed >= 1000) {
                this.fps = Math.round((this.frames * 1000) / elapsed);
                this.frames = 0;
                this.lastTime = currentTime;
            }
            
            return this.fps;
        }
        
        getMemoryUsage() {
            if (performance.memory) {
                return {
                    used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2),
                    total: (performance.memory.totalJSHeapSize / 1048576).toFixed(2),
                    limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2)
                };
            }
            return null;
        }
    }
    
    const perfMonitor = new PerformanceMonitor();
    
    //-----------------------------------------------------------------------------
    // Event Spawner
    //-----------------------------------------------------------------------------
    
    function spawnEventWave(count) {
        if (!$gameMap) return;
        
        console.log(`%c🚀 SPAWNING WAVE ${testState.waveCount + 1}: ${count} EVENTS`, styles.warning);
        
        const mapWidth = $gameMap.width();
        const mapHeight = $gameMap.height();
        let spawned = 0;
        
        for (let i = 0; i < count; i++) {
            const x = Math.floor(Math.random() * mapWidth);
            const y = Math.floor(Math.random() * mapHeight);
            
            // Create event data
            const eventData = createStressEventData(x, y, i);
            
            // Spawn the event
            const eventId = $gameMap._events.length;
            const event = new Game_Event($gameMap._mapId, eventId);
            event.setEventData(eventData);
            $gameMap._events.push(event);
            testState.spawnedEventIds.push(eventId);
            spawned++;
            
            // Add to sprite set
            const scene = SceneManager._scene;
            if (scene && scene._spriteset) {
                const sprite = new Sprite_Character(event);
                scene._spriteset._characterSprites.push(sprite);
                scene._spriteset._tilemap.addChild(sprite);
                
                // ADD THIS: Optional debug marker
                if (config.showEventMarkers) {
                    const marker = new Sprite();
                    marker.bitmap = new Bitmap(8, 8);
                    marker.bitmap.fillRect(0, 0, 8, 8, '#FF0000');
                    marker.x = x * 48 + 20;
                    marker.y = y * 48 + 20;
                    marker.opacity = 128;
                    scene._spriteset._tilemap.addChild(marker);
                }
            }
        }
        
        testState.totalEvents += spawned;
        testState.waveCount++;
        
        logPerformanceData(spawned);
    }
    
    // REPLACE the createStressEventData function (around line 180) with this fixed version:

function createStressEventData(x, y, index) {
    return {
        id: 9999 + index,
        name: `StressEvent_${index}`,
        note: '', // Add note field for meta data
        meta: {}, // Add empty meta object
        x: x,
        y: y,
        pages: [{
            conditions: {
                switch1Valid: false,
                switch1Id: 1,
                switch2Valid: false,
                switch2Id: 1,
                variableValid: false,
                variableId: 1,
                variableValue: 0,
                selfSwitchValid: false,
                selfSwitchCh: 'A',
                itemValid: false,
                itemId: 1,
                actorValid: false,
                actorId: 1
            },
            image: {
                tileId: 0,
                characterName: '', // Empty = invisible event
                characterIndex: 0,
                direction: 2,
                pattern: 0
            },
            moveType: config.enableMovement ? Math.floor(Math.random() * 3) + 1 : 0,
            moveSpeed: Math.floor(Math.random() * 4) + 2,
            moveFrequency: Math.floor(Math.random() * 4) + 2,
            moveRoute: {
                list: [{ code: 0 }],
                repeat: true,
                skippable: false,
                wait: false
            },
            walkAnime: false, // No animation for invisible
            stepAnime: false, // No animation for invisible
            directionFix: false,
            through: true,
            priorityType: 1, // Below characters
            trigger: 0,
            list: [{ code: 0 }]
        }]
    };
}

// ALSO REPLACE the spawnEventWave function (around line 150) with this safer version:

function spawnEventWave(count) {
    if (!$gameMap) return;
    
    console.log(`%c🚀 SPAWNING WAVE ${testState.waveCount + 1}: ${count} EVENTS`, styles.warning);
    
    const mapWidth = $gameMap.width();
    const mapHeight = $gameMap.height();
    let spawned = 0;
    
    for (let i = 0; i < count; i++) {
        try {
            const x = Math.floor(Math.random() * mapWidth);
            const y = Math.floor(Math.random() * mapHeight);
            
            // Create event data with all required properties
            const eventData = createStressEventData(x, y, testState.totalEvents + i);
            
            // Add to $dataMap.events if it doesn't exist there
            if (!$dataMap.events) {
                $dataMap.events = [null]; // Events array starts at index 1
            }
            
            // Find next available event ID
            const eventId = $dataMap.events.length;
            $dataMap.events.push(eventData);
            
            // Create the game event
            const event = new Game_Event($gameMap._mapId, eventId);
            
            // Make sure the event has access to its data
            if (!event.event()) {
                event._eventId = eventId;
            }
            
            // Add to game map
            $gameMap._events[eventId] = event;
            testState.spawnedEventIds.push(eventId);
            spawned++;
            
            // Add to sprite set
            const scene = SceneManager._scene;
            if (scene && scene._spriteset) {
                const sprite = new Sprite_Character(event);
                scene._spriteset._characterSprites.push(sprite);
                scene._spriteset._tilemap.addChild(sprite);
            }
        } catch (error) {
            console.error(`%cFailed to spawn event ${i}:`, 'color: red;', error);
            // Continue spawning other events even if one fails
        }
    }
    
    testState.totalEvents += spawned;
    testState.waveCount++;
    
    logPerformanceData(spawned);
}

// Override Game_Event.event() to return our custom data
const _Game_Event_event = Game_Event.prototype.event;
Game_Event.prototype.event = function() {
    // First try the normal way
    const normalEvent = _Game_Event_event.call(this);
    if (normalEvent) return normalEvent;
    
    // If not found, try $dataMap.events
    if ($dataMap && $dataMap.events && $dataMap.events[this._eventId]) {
        return $dataMap.events[this._eventId];
    }
    
    // Return a minimal valid event object to prevent crashes
    return {
        id: this._eventId,
        name: 'StressEvent',
        note: '',
        meta: {},
        pages: [{
            conditions: {},
            image: { characterName: '', characterIndex: 0, direction: 2, pattern: 0, tileId: 0 },
            moveType: 0,
            moveSpeed: 3,
            moveFrequency: 3,
            moveRoute: { list: [{ code: 0 }], repeat: true, skippable: false, wait: false },
            walkAnime: true,
            stepAnime: false,
            directionFix: false,
            through: true,
            priorityType: 1,
            trigger: 0,
            list: [{ code: 0 }]
        }]
    };
};

function getRandomCharacter() {
    // Return empty string for invisible events - no asset loading!
    return '';
}

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// Random Character Generation
//-----------------------------------------------------------------------------
/*function getRandomCharacter() {
    const characters = [
        'Actor1', 'Actor2', 'Actor3', 'People1', 'People2', 'People3', 'People4',
        'Monster', 'Nature', 'Vehicle', 'Evil'
    ];
        return characters[Math.floor(Math.random() * characters.length)];
    }
    
    // Extend Game_Event to accept custom data
    Game_Event.prototype.setEventData = function(data) {
        this._eventId = data.id;
        this._event = data;
        this.locate(data.x, data.y);
        this.refresh();
    };

*/    
    
    //-----------------------------------------------------------------------------
    // Performance Logging
    //-----------------------------------------------------------------------------
    
    function logPerformanceData(spawned) {
        const fps = perfMonitor.update();
        const memory = perfMonitor.getMemoryUsage();
        const elapsed = ((performance.now() - testState.startTime) / 1000).toFixed(2);
        
        testState.fpsHistory.push(fps);
        if (testState.fpsHistory.length > 10) testState.fpsHistory.shift();
        
        const avgFPS = (testState.fpsHistory.reduce((a, b) => a + b, 0) / testState.fpsHistory.length).toFixed(1);
        
        const data = {
            wave: testState.waveCount,
            spawned: spawned,
            totalEvents: testState.totalEvents,
            fps: fps,
            avgFPS: avgFPS,
            memory: memory,
            elapsed: elapsed
        };
        
        testState.performanceData.push(data);
        
        // Console output
        console.log(`%c📊 WAVE ${data.wave} COMPLETE`, styles.info);
        console.log(`%c   Events Spawned: ${spawned}`, styles.data);
        console.log(`%c   Total Events: ${data.totalEvents}`, styles.data);
        console.log(`%c   Current FPS: ${fps}`, fps < 30 ? styles.danger : styles.data);
        console.log(`%c   Average FPS: ${avgFPS}`, styles.data);
        console.log(`%c   Elapsed Time: ${elapsed}s`, styles.data);
        
        if (memory) {
            console.log(`%c   Memory: ${memory.used}MB / ${memory.total}MB (Limit: ${memory.limit}MB)`, styles.data);
            const memoryPercent = ((memory.used / memory.limit) * 100).toFixed(1);
            console.log(`%c   Memory Usage: ${memoryPercent}%`, styles.data);
        }
        
        // Performance warnings
        if (fps < 30 && fps >= 10) {
            console.log(`%c⚠️ WARNING: SEVERE LAG DETECTED (FPS: ${fps})`, styles.warning);
        } else if (fps < 10) {
            console.log(`%c🔥 CRITICAL: NEAR FREEZE STATE (FPS: ${fps})`, styles.danger);
        }
        
        if (memory && (memory.used / memory.limit) > 0.8) {
            console.log(`%c🔥 CRITICAL: HIGH MEMORY USAGE (${((memory.used / memory.limit) * 100).toFixed(1)}%)`, styles.danger);
        }
        
        console.log('---');
        
        testState.lastFPS = fps;
    }
    
    function logTestSummary() {
        console.log(`%c💀 NUCLEAR STRESS TEST SUMMARY 💀`, styles.title);
        console.log(`%c Total Waves: ${testState.waveCount}`, styles.info);
        console.log(`%c Total Events Spawned: ${testState.totalEvents}`, styles.info);
        console.log(`%c Final FPS: ${testState.lastFPS}`, styles.info);
        console.log(`%c Test Duration: ${((performance.now() - testState.startTime) / 1000).toFixed(2)}s`, styles.info);
        
        if (testState.performanceData.length > 0) {
            console.log(`%c📈 Performance Degradation:`, styles.info);
            const firstFPS = testState.performanceData[0].fps;
            const lastFPS = testState.performanceData[testState.performanceData.length - 1].fps;
            const degradation = ((firstFPS - lastFPS) / firstFPS * 100).toFixed(1);
            console.log(`%c   FPS Drop: ${firstFPS} → ${lastFPS} (${degradation}% degradation)`, styles.data);
        }
        
        console.log(`%c🎯 CRASH/FREEZE POINT DATA:`, styles.warning);
        console.log(`%c   Events at failure: ~${testState.totalEvents}`, styles.data);
        console.log(`%c   Waves completed: ${testState.waveCount}`, styles.data);
        
        const memory = perfMonitor.getMemoryUsage();
        if (memory) {
            console.log(`%c   Final Memory: ${memory.used}MB / ${memory.limit}MB`, styles.data);
        }
        
        console.table(testState.performanceData);
    }
    
    //-----------------------------------------------------------------------------
    // Test Control
    //-----------------------------------------------------------------------------
    
    function startStressTest() {
        if (testState.active) {
            stopStressTest();
            return;
        }
        
        console.clear();
        console.log(`%c💣 NUCLEAR EVENT THROTTLER - STRESS TEST INITIATED 💣`, styles.title);
        console.log(`%c⚠️ WARNING: This will intentionally crash/freeze your game!`, styles.danger);
        console.log(`%c Configuration:`, styles.info);
        console.log(`%c   Initial Spawn: ${config.initialSpawn}`, styles.data);
        console.log(`%c   Spawn Interval: ${config.interval} frames`, styles.data);
        console.log(`%c   Increment: ${config.increment} per wave`, styles.data);
        console.log(`%c   Max Events: ${config.maxEvents}`, styles.data);
        console.log(`%c   Movement: ${config.enableMovement}`, styles.data);
        console.log(`%c   Animations: ${config.enableAnimations}`, styles.data);
        console.log('---');
        
        testState.active = true;
        testState.waveCount = 0;
        testState.totalEvents = 0;
        testState.frameCounter = 0;
        testState.startTime = performance.now();
        testState.fpsHistory = [];
        testState.performanceData = [];
        testState.spawnedEventIds = [];
        
        // Initial spawn
        spawnEventWave(config.initialSpawn);
    }
    
    function stopStressTest() {
        if (!testState.active) return;
        
        console.log(`%c🛑 STRESS TEST STOPPED`, styles.warning);
        testState.active = false;
        
        logTestSummary();
        
        // Clean up events
        console.log(`%c🧹 Cleaning up ${testState.totalEvents} events...`, styles.info);
        cleanupTestEvents();
    }
    
    function cleanupTestEvents() {
        if (!$gameMap) return;
        
        // Remove spawned events
        for (const eventId of testState.spawnedEventIds) {
            if ($gameMap._events[eventId]) {
                $gameMap._events[eventId] = null;
            }
        }
        
        // Clean up sprites
        const scene = SceneManager._scene;
        if (scene && scene._spriteset) {
            const sprites = scene._spriteset._characterSprites;
            for (let i = sprites.length - 1; i >= 0; i--) {
                const sprite = sprites[i];
                if (sprite._character && testState.spawnedEventIds.includes(sprite._character._eventId)) {
                    scene._spriteset._tilemap.removeChild(sprite);
                    sprites.splice(i, 1);
                }
            }
        }
        
        console.log(`%c✅ Cleanup complete. Refreshing map...`, styles.success);
        $gameMap._events = $gameMap._events.filter(e => e !== null);
        
        // Force garbage collection hint (doesn't guarantee collection)
        if (global.gc) {
            global.gc();
            console.log(`%c♻️ Garbage collection triggered`, styles.success);
        }
    }
    
    //-----------------------------------------------------------------------------
    // Update Loop
    //-----------------------------------------------------------------------------
    
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        
        if (!testState.active) return;
        
        testState.frameCounter++;
        
        // Update FPS monitor
        if (config.monitorFPS) {
            const fps = perfMonitor.update();
            
            // Auto-stop on low FPS if enabled
            if (config.autoStop && fps < 10) {
                console.log(`%c🔥 AUTO-STOP: FPS dropped below 10 (${fps})`, styles.danger);
                stopStressTest();
                return;
            }
        }
        
        // Spawn next wave
        if (testState.frameCounter >= config.interval) {
            testState.frameCounter = 0;
            
            // Check if we've hit the limit
            if (testState.totalEvents >= config.maxEvents) {
                console.log(`%c🛑 MAXIMUM EVENT LIMIT REACHED (${config.maxEvents})`, styles.danger);
                stopStressTest();
                return;
            }
            
            const nextSpawnCount = config.initialSpawn + (testState.waveCount * config.increment);
            spawnEventWave(nextSpawnCount);
        }
    };
    
    //-----------------------------------------------------------------------------
    // Input Handler
    //-----------------------------------------------------------------------------
    
    const keyMap = {
        'F9': 120,
        'F10': 121,
        'F11': 122,
        'F12': 123
    };
    
    const _Scene_Map_onMapLoaded = Scene_Map.prototype.onMapLoaded;
    Scene_Map.prototype.onMapLoaded = function() {
        _Scene_Map_onMapLoaded.call(this);
        
        // Add key listener
        document.addEventListener('keydown', function(event) {
            if (event.keyCode === keyMap[config.testKey]) {
                event.preventDefault();
                if (SceneManager._scene instanceof Scene_Map) {
                    if (!testState.active) {
                        startStressTest();
                    } else {
                        stopStressTest();
                    }
                }
            }
        });
    };
    
    //-----------------------------------------------------------------------------
    // Plugin Command
    //-----------------------------------------------------------------------------
    
    PluginManager.registerCommand(pluginName, "startTest", args => {
        startStressTest();
    });
    
    PluginManager.registerCommand(pluginName, "stopTest", args => {
        stopStressTest();
    });
    
    PluginManager.registerCommand(pluginName, "setSpawnCount", args => {
        config.initialSpawn = Number(args.count || 100);
        console.log(`%c Initial spawn count set to: ${config.initialSpawn}`, styles.info);
    });
    
    //-----------------------------------------------------------------------------
    // Startup Warning
    //-----------------------------------------------------------------------------
    
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        
        console.log(`%c💣 NUCLEAR EVENT THROTTLER LOADED 💣`, styles.title);
        console.log(`%c⚠️ WARNING: This plugin is for TESTING ONLY!`, styles.danger);
        console.log(`%c Press ${config.testKey} on the map to start stress test`, styles.warning);
    };
    
})();
