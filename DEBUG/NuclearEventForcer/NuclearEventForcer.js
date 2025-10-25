/*:
 * @target MZ
 * @plugindesc NUCLEAR OPTION - Forces events to run no matter what
 * @author Alexandros Panagiotakopoulos
 * @url alexandrospanag.github.io
 * @version 1.0.0
 *
 * @command activateNuclearMode
 * @text Activate Nuclear Mode
 * @desc Forcefully starts and updates events with the specified tag
 *
 * @arg noteTag
 * @text Note Tag Content
 * @desc The tag content to look for (e.g., if tag is <nuke:traffic>, enter "traffic")
 * @type string
 * @default traffic
 *
 * @help
 * THE NUCLEAR OPTION
 * 
 * Add <nuke:traffic> to your event notes
 * Use plugin command with tag "traffic"
 * 
 * This will:
 * - Force create interpreters
 * - Force them into a global update list
 * - Update them EVERY FRAME regardless of ANYTHING
 */

(() => {
    const pluginName = "NuclearEventForcer";
    
    // Global list of events to force update
    window.$forcedEvents = window.$forcedEvents || [];

    PluginManager.registerCommand(pluginName, "activateNuclearMode", args => {
        const noteTag = args.noteTag || "traffic";
        
        console.log("=== NUCLEAR MODE ACTIVATED ===");
        console.log("Looking for tag:", noteTag);
        
        // Clear previous forced events
        window.$forcedEvents = [];
        
        // Find all events on current map
        const allEvents = $gameMap._events || [];
        console.log("Total events on map:", allEvents.length);
        
        for (let i = 0; i < allEvents.length; i++) {
            const event = allEvents[i];
            if (!event) continue;
            
            const eventData = event.event();
            if (!eventData) continue;
            
            const note = eventData.note || "";
            const searchTag = `<nuke:${noteTag}>`;
            
            console.log(`Event ${i}: ${eventData.name} at (${event.x},${event.y}) - Has tag: ${note.includes(searchTag)}`);
            
            if (note.includes(searchTag)) {
                console.log(`>>> FOUND TARGET: ${eventData.name}`);
                
                // Force create interpreter if it doesn't exist
                if (!event._interpreter) {
                    event._interpreter = new Game_Interpreter();
                    console.log("Created new interpreter");
                }
                
                // Get the event's command list
                const list = event.list();
                console.log("Event has", list ? list.length : 0, "commands");
                
                if (list && list.length > 0) {
                    // Force setup the interpreter
                    event._interpreter.setup(list, event._eventId);
                    console.log("Interpreter setup complete");
                    
                    // Add to forced update list
                    window.$forcedEvents.push(event);
                    console.log("Added to forced events list");
                }
            }
        }
        
        console.log("=== NUCLEAR MODE COMPLETE ===");
        console.log("Total forced events:", window.$forcedEvents.length);
    });

    // Hijack Scene_Map update to force our events
    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        
        // Force update our nuclear events
        if (window.$forcedEvents && window.$forcedEvents.length > 0) {
            for (const event of window.$forcedEvents) {
                if (event && event._interpreter) {
                    // If not running, restart it
                    if (!event._interpreter.isRunning()) {
                        const list = event.list();
                        if (list && list.length > 0) {
                            event._interpreter.setup(list, event._eventId);
                        }
                    }
                    // Force update
                    event._interpreter.update();
                }
            }
        }
    };

    // ALSO hijack Game_Map update as backup
    const _Game_Map_update = Game_Map.prototype.update;
    Game_Map.prototype.update = function(sceneActive) {
        _Game_Map_update.call(this, sceneActive);
        
        // Double-force update our nuclear events
        if (window.$forcedEvents && window.$forcedEvents.length > 0) {
            for (const event of window.$forcedEvents) {
                if (event && event._interpreter) {
                    if (!event._interpreter.isRunning()) {
                        const list = event.list();
                        if (list && list.length > 0) {
                            event._interpreter.setup(list, event._eventId);
                        }
                    }
                    event._interpreter.update();
                }
            }
        }
    };
    
    console.log("Nuclear Event Forcer loaded and ready");
})();
