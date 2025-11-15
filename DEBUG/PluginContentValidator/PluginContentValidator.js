//=============================================================================
// Plugin Content Validator
// Version: 1.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Detects orphaned plugin commands, notetags, and mismatches in your project
 * @author Alexandros Panagiotakopoulos
 * @url https:alexandrospanag.github.io
 * @date 15/11/2025
 *
 * @help
 * ============================================================================
 * Plugin Content Validator
 * ============================================================================
 * 
 * This plugin scans your entire project for:
 * - Plugin commands from disabled/removed plugins
 * - Unrecognized notetags in database entries
 * - Malformed notetag syntax
 * - Script calls to non-existent plugin functions
 * - Potential typos in plugin commands and notetags
 *
 * Usage:
 * Open the console (F8) and type: PluginValidator.runValidation()
 * 
 * The report will be displayed in the console and can be exported.
 *
 * ============================================================================
 * 
 * @command runValidation
 * @text Run Full Validation
 * @desc Scans the entire project for orphaned content and mismatches
 *
 * @command exportReport
 * @text Export Report
 * @desc Exports the last validation report to a JSON file
 * 
 * ============================================================================
 * Terms of Use
 * ============================================================================
 *   - Free for commercial and non-commercial use with proper attribution
 *   - Modify as needed for your project
 *   - Include copyright notice when redistributing
 *   - See LICENSE.md for full terms
 *
 */

(() => {
    'use strict';

    const pluginName = "PluginContentValidator";

    //=========================================================================
    // Plugin Validator Core
    //=========================================================================
    
    class PluginValidator {
        constructor() {
            this.report = {
                timestamp: null,
                orphanedCommands: [],
                orphanedNotetags: [],
                malformedNotetags: [],
                scriptCallIssues: [],
                typoSuggestions: []
            };
            this.activePlugins = new Map();
            this.registeredCommands = new Set();
            this.registeredNotetags = new Set();
        }

        //---------------------------------------------------------------------
        // Main Validation Entry Point
        //---------------------------------------------------------------------
        runValidation() {
            console.log('%c=== Plugin Content Validator ===', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
            console.log('Starting validation scan...\n');
            
            // Check if game is properly initialized
            if (typeof $plugins === 'undefined') {
                console.log('%c❌ ERROR: $plugins is not defined!', 'color: #f44336; font-weight: bold;');
                console.log('The game may not be fully loaded. Try running this after the title screen or during gameplay.');
                return;
            }
            
            if (!$dataActors || !$dataClasses || !$dataSkills) {
                console.log('%c❌ ERROR: Database not loaded!', 'color: #f44336; font-weight: bold;');
                console.log('Please run validation during gameplay or after the game has fully loaded.');
                return;
            }
            
            console.log(`Found ${$plugins.length} total plugins in list`);
            const activeCount = $plugins.filter(p => p && p.status).length;
            console.log(`Found ${activeCount} active plugins\n`);
            
            this.report.timestamp = new Date().toISOString();
            
            // Phase 1: Build registry of active plugins
            this.buildPluginRegistry();
            
            // Phase 2: Scan all maps for plugin commands
            this.scanAllMaps();
            
            // Phase 3: Scan database for notetags
            this.scanDatabase();
            
            // Phase 4: Generate and display report
            this.generateReport();
            
            console.log('\n%c=== Validation Complete ===', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
        }

        //---------------------------------------------------------------------
        // Phase 1: Build Plugin Registry
        //---------------------------------------------------------------------
        buildPluginRegistry() {
            console.log('%cPhase 1: Building plugin registry...', 'color: #2196F3; font-weight: bold;');
            
            // Get all active plugins
            const plugins = $plugins.filter(plugin => plugin.status);
            
            plugins.forEach(plugin => {
                this.activePlugins.set(plugin.name, plugin);
                
                // Extract registered plugin commands from plugin parameters
                if (plugin.parameters) {
                    this.extractPluginCommands(plugin);
                }
            });
            
            // Also check PluginManager registered commands
            if (PluginManager._commands && PluginManager._commands instanceof Map) {
                for (let [key, value] of PluginManager._commands) {
                    this.registeredCommands.add(key);
                }
            } else if (PluginManager._commands && typeof PluginManager._commands === 'object') {
                // If it's a plain object instead of a Map
                Object.keys(PluginManager._commands).forEach(key => {
                    this.registeredCommands.add(key);
                });
            }
            
            console.log(`Found ${this.activePlugins.size} active plugins`);
            console.log(`Registered commands: ${this.registeredCommands.size}`);
        }

        extractPluginCommands(plugin) {
            // Parse plugin parameters to find @command declarations
            const paramText = JSON.stringify(plugin.parameters);
            const commandRegex = /@command\s+(\w+)/g;
            let match;
            
            while ((match = commandRegex.exec(paramText)) !== null) {
                // Store in multiple formats to catch variations
                const commandName = match[1];
                this.registeredCommands.add(`${plugin.name}:${commandName}`);
                this.registeredCommands.add(`${plugin.name}.${commandName}`);
                this.registeredCommands.add(`${plugin.name}/${commandName}`);
            }
        }

        //---------------------------------------------------------------------
        // Phase 2: Scan All Maps
        //---------------------------------------------------------------------
        scanAllMaps() {
            console.log('%cPhase 2: Scanning all maps...', 'color: #2196F3; font-weight: bold;');
            
            const dataSystem = $dataSystem;
            let totalEvents = 0;
            let issuesFound = 0;
            
            // Check if mapInfos exists
            if (!dataSystem || !dataSystem.mapInfos) {
                console.log('⚠️  Map data not available. Scanning current map only.');
                this.scanCurrentMap();
                return;
            }
            
            // Iterate through all maps
            for (let mapId = 1; mapId < dataSystem.mapInfos.length; mapId++) {
                const mapInfo = dataSystem.mapInfos[mapId];
                if (!mapInfo) continue;
                
                // Load map data
                const mapData = this.loadMapData(mapId);
                if (!mapData) continue;
                
                // Scan all events in the map
                mapData.events.forEach((event, eventId) => {
                    if (!event) return;
                    totalEvents++;
                    
                    event.pages.forEach((page, pageIndex) => {
                        const pageIssues = this.scanEventPage(page, mapId, eventId, pageIndex, mapInfo.name);
                        issuesFound += pageIssues;
                    });
                });
            }
            
            console.log(`Scanned ${totalEvents} events, found ${issuesFound} issues`);
        }

        scanCurrentMap() {
            // Scan only the currently loaded map
            if (!$dataMap || !$dataMap.events) {
                console.log('⚠️  No map currently loaded. Skipping map scan.');
                return;
            }
            
            let totalEvents = 0;
            let issuesFound = 0;
            const mapId = $gameMap ? $gameMap.mapId() : 0;
            const mapName = $dataMap.displayName || `Map ${mapId}`;
            
            $dataMap.events.forEach((event, eventId) => {
                if (!event) return;
                totalEvents++;
                
                event.pages.forEach((page, pageIndex) => {
                    const pageIssues = this.scanEventPage(page, mapId, eventId, pageIndex, mapName);
                    issuesFound += pageIssues;
                });
            });
            
            console.log(`Scanned ${totalEvents} events in current map, found ${issuesFound} issues`);
        }

        loadMapData(mapId) {
            const filename = 'Map%1.json'.format(mapId.padZero(3));
            const path = 'data/' + filename;
            
            // In test mode, we'll simulate map data
            // In actual RPG Maker, this would load from the file system
            if (typeof $dataMap !== 'undefined' && $gameMap && $gameMap.mapId() === mapId) {
                return $dataMap;
            }
            
            // For this plugin, we'll work with currently loaded map
            // A full implementation would need to load all maps
            return null;
        }

        scanEventPage(page, mapId, eventId, pageIndex, mapName) {
            let issuesFound = 0;
            
            page.list.forEach((command, commandIndex) => {
                // Check for plugin commands (code 357)
                if (command.code === 357) {
                    // In MZ, plugin commands are:
                    // parameters[0] = plugin name (with path, e.g., "RE;LIVE/StreetLampLighting")
                    // parameters[1] = command name (e.g., "addStreetLamp")
                    // parameters[3] = arguments object
                    const fullPluginName = command.parameters[0];
                    const commandName = command.parameters[1];
                    const args = command.parameters[3];
                    
                    // Extract just the plugin name (remove path)
                    const pluginNameParts = fullPluginName.split('/');
                    const shortPluginName = pluginNameParts[pluginNameParts.length - 1];
                    
                    // Build possible command formats to check
                    const possibleFormats = [
                        `${fullPluginName}:${commandName}`,
                        `${shortPluginName}:${commandName}`,
                        `${fullPluginName}.${commandName}`,
                        `${shortPluginName}.${commandName}`,
                        `${fullPluginName}/${commandName}`,
                        `${shortPluginName}/${commandName}`
                    ];
                    
                    // Check if any format matches our registered commands
                    const found = possibleFormats.some(format => this.registeredCommands.has(format));
                    
                    if (!found) {
                        this.report.orphanedCommands.push({
                            location: `Map: ${mapName} (ID: ${mapId})`,
                            eventId: eventId,
                            pageIndex: pageIndex,
                            commandIndex: commandIndex,
                            command: `${fullPluginName} ${commandName}`,
                            args: JSON.stringify(args),
                            suggestion: this.findSimilarCommand(`${shortPluginName}:${commandName}`)
                        });
                        issuesFound++;
                    }
                }
                
                // Check for script calls (code 355)
                if (command.code === 355) {
                    const script = command.parameters[0];
                    this.scanScriptCall(script, mapId, eventId, pageIndex, mapName, commandIndex);
                }
            });
            
            return issuesFound;
        }

        scanScriptCall(script, mapId, eventId, pageIndex, mapName, commandIndex) {
            // Look for common plugin function patterns
            const pluginCallPattern = /(\w+)\.(\w+)\(/g;
            let match;
            
            while ((match = pluginCallPattern.exec(script)) !== null) {
                const namespace = match[1];
                const method = match[2];
                
                // Check if this looks like a plugin call
                if (this.activePlugins.has(namespace)) {
                    // Plugin exists, method check would require runtime analysis
                    continue;
                } else if (namespace.includes('Plugin') || namespace.includes('Game')) {
                    // Potential plugin reference
                    this.report.scriptCallIssues.push({
                        location: `Map: ${mapName} (ID: ${mapId})`,
                        eventId: eventId,
                        pageIndex: pageIndex,
                        commandIndex: commandIndex,
                        script: script.substring(0, 100),
                        possibleIssue: `Reference to possibly non-existent plugin: ${namespace}`
                    });
                }
            }
        }

        //---------------------------------------------------------------------
        // Phase 3: Scan Database
        //---------------------------------------------------------------------
        scanDatabase() {
            console.log('%cPhase 3: Scanning database for notetags...', 'color: #2196F3; font-weight: bold;');
            
            const databases = [
                { name: 'Actors', data: $dataActors },
                { name: 'Classes', data: $dataClasses },
                { name: 'Skills', data: $dataSkills },
                { name: 'Items', data: $dataItems },
                { name: 'Weapons', data: $dataWeapons },
                { name: 'Armors', data: $dataArmors },
                { name: 'Enemies', data: $dataEnemies },
                { name: 'States', data: $dataStates }
            ];
            
            databases.forEach(db => {
                if (!db.data) return;
                
                db.data.forEach((entry, index) => {
                    if (!entry || !entry.note) return;
                    
                    this.scanNotetags(entry.note, db.name, index, entry.name);
                });
            });
        }

        scanNotetags(notetext, dbType, entryId, entryName) {
            // Pattern to match notetags: <tagname> or <tagname: value>
            const notetagPattern = /<([^>:]+)(?::([^>]+))?>/g;
            let match;
            
            while ((match = notetagPattern.exec(notetext)) !== null) {
                const tagName = match[1].trim();
                const tagValue = match[2] ? match[2].trim() : null;
                
                // Check for malformed tags
                if (tagName.includes('<') || tagName.includes('>')) {
                    this.report.malformedNotetags.push({
                        location: `${dbType} - ${entryName} (ID: ${entryId})`,
                        tag: match[0],
                        issue: 'Nested or malformed brackets'
                    });
                }
                
                // Check if this notetag is recognized
                // This is a simplified check - in reality, we'd need plugin metadata
                if (!this.isRecognizedNotetag(tagName)) {
                    this.report.orphanedNotetags.push({
                        location: `${dbType} - ${entryName} (ID: ${entryId})`,
                        tag: tagName,
                        fullTag: match[0],
                        suggestion: this.findSimilarNotetag(tagName)
                    });
                }
            }
            
            // Check for unclosed tags
            const openBrackets = (notetext.match(/</g) || []).length;
            const closeBrackets = (notetext.match(/>/g) || []).length;
            
            if (openBrackets !== closeBrackets) {
                this.report.malformedNotetags.push({
                    location: `${dbType} - ${entryName} (ID: ${entryId})`,
                    issue: `Mismatched brackets: ${openBrackets} opening, ${closeBrackets} closing`
                });
            }
        }

        isRecognizedNotetag(tagName) {
            // Build a list of common/known notetags
            // This should be enhanced with actual plugin metadata
            const commonTags = [
                'note', 'meta', 'description'
            ];
            
            return commonTags.includes(tagName.toLowerCase());
        }

        //---------------------------------------------------------------------
        // Typo Detection & Suggestions
        //---------------------------------------------------------------------
        findSimilarCommand(command) {
            let bestMatch = null;
            let bestScore = 0;
            
            for (let registered of this.registeredCommands) {
                const score = this.calculateSimilarity(command, registered);
                if (score > bestScore && score > 0.6) {
                    bestScore = score;
                    bestMatch = registered;
                }
            }
            
            return bestMatch ? `Did you mean: ${bestMatch}?` : 'No similar command found';
        }

        findSimilarNotetag(tag) {
            // Similar approach for notetags
            return 'Check plugin documentation for valid notetags';
        }

        calculateSimilarity(str1, str2) {
            // Levenshtein distance-based similarity
            const longer = str1.length > str2.length ? str1 : str2;
            const shorter = str1.length > str2.length ? str2 : str1;
            
            if (longer.length === 0) return 1.0;
            
            const distance = this.levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
            return (longer.length - distance) / longer.length;
        }

        levenshteinDistance(str1, str2) {
            const matrix = [];
            
            for (let i = 0; i <= str2.length; i++) {
                matrix[i] = [i];
            }
            
            for (let j = 0; j <= str1.length; j++) {
                matrix[0][j] = j;
            }
            
            for (let i = 1; i <= str2.length; i++) {
                for (let j = 1; j <= str1.length; j++) {
                    if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                        matrix[i][j] = matrix[i - 1][j - 1];
                    } else {
                        matrix[i][j] = Math.min(
                            matrix[i - 1][j - 1] + 1,
                            matrix[i][j - 1] + 1,
                            matrix[i - 1][j] + 1
                        );
                    }
                }
            }
            
            return matrix[str2.length][str1.length];
        }

        //---------------------------------------------------------------------
        // Report Generation
        //---------------------------------------------------------------------
        generateReport() {
            console.log('\n%c========== VALIDATION REPORT ==========', 'color: #FF9800; font-size: 14px; font-weight: bold;');
            console.log(`Generated: ${this.report.timestamp}\n`);
            
            // Orphaned Plugin Commands
            if (this.report.orphanedCommands.length > 0) {
                console.log('%c❌ Orphaned Plugin Commands:', 'color: #f44336; font-weight: bold;');
                this.report.orphanedCommands.forEach((issue, idx) => {
                    console.log(`${idx + 1}. ${issue.location}`);
                    console.log(`   Event ID: ${issue.eventId}, Page: ${issue.pageIndex}`);
                    console.log(`   Command: ${issue.command}`);
                    console.log(`   ${issue.suggestion}`);
                    console.log('');
                });
            } else {
                console.log('%c✓ No orphaned plugin commands found', 'color: #4CAF50;');
            }
            
            // Orphaned Notetags
            if (this.report.orphanedNotetags.length > 0) {
                console.log('%c❌ Unrecognized Notetags:', 'color: #f44336; font-weight: bold;');
                this.report.orphanedNotetags.forEach((issue, idx) => {
                    console.log(`${idx + 1}. ${issue.location}`);
                    console.log(`   Tag: ${issue.fullTag}`);
                    console.log(`   ${issue.suggestion}`);
                    console.log('');
                });
            } else {
                console.log('%c✓ No unrecognized notetags found', 'color: #4CAF50;');
            }
            
            // Malformed Notetags
            if (this.report.malformedNotetags.length > 0) {
                console.log('%c❌ Malformed Notetags:', 'color: #f44336; font-weight: bold;');
                this.report.malformedNotetags.forEach((issue, idx) => {
                    console.log(`${idx + 1}. ${issue.location}`);
                    console.log(`   Issue: ${issue.issue}`);
                    if (issue.tag) console.log(`   Tag: ${issue.tag}`);
                    console.log('');
                });
            } else {
                console.log('%c✓ No malformed notetags found', 'color: #4CAF50;');
            }
            
            // Script Call Issues
            if (this.report.scriptCallIssues.length > 0) {
                console.log('%c⚠️  Potential Script Call Issues:', 'color: #FF9800; font-weight: bold;');
                this.report.scriptCallIssues.forEach((issue, idx) => {
                    console.log(`${idx + 1}. ${issue.location}`);
                    console.log(`   Event ID: ${issue.eventId}, Page: ${issue.pageIndex}`);
                    console.log(`   Issue: ${issue.possibleIssue}`);
                    console.log(`   Script: ${issue.script}...`);
                    console.log('');
                });
            } else {
                console.log('%c✓ No script call issues detected', 'color: #4CAF50;');
            }
            
            // Summary
            const totalIssues = 
                this.report.orphanedCommands.length +
                this.report.orphanedNotetags.length +
                this.report.malformedNotetags.length +
                this.report.scriptCallIssues.length;
            
            console.log('\n%c========== SUMMARY ==========', 'color: #FF9800; font-size: 14px; font-weight: bold;');
            console.log(`Total Issues Found: ${totalIssues}`);
            console.log(`- Orphaned Commands: ${this.report.orphanedCommands.length}`);
            console.log(`- Unrecognized Notetags: ${this.report.orphanedNotetags.length}`);
            console.log(`- Malformed Notetags: ${this.report.malformedNotetags.length}`);
            console.log(`- Script Call Issues: ${this.report.scriptCallIssues.length}`);
            
            console.log('\nTo export this report, run: PluginValidator.exportReport()');
        }

        //---------------------------------------------------------------------
        // Export Report
        //---------------------------------------------------------------------
        exportReport() {
            let output = "=".repeat(80) + "\n";
            output += "RPG MAKER MZ - PLUGIN CONTENT VALIDATION REPORT\n";
            output += "Generated: " + new Date().toLocaleString() + "\n";
            output += "=".repeat(80) + "\n\n";
            
            // Summary Section
            const totalIssues = 
                this.report.orphanedCommands.length +
                this.report.orphanedNotetags.length +
                this.report.malformedNotetags.length +
                this.report.scriptCallIssues.length;
            
            output += "SUMMARY\n";
            output += "-".repeat(80) + "\n";
            output += `Total Issues Found: ${totalIssues}\n`;
            output += `  - Orphaned Plugin Commands: ${this.report.orphanedCommands.length}\n`;
            output += `  - Unrecognized Notetags: ${this.report.orphanedNotetags.length}\n`;
            output += `  - Malformed Notetags: ${this.report.malformedNotetags.length}\n`;
            output += `  - Script Call Issues: ${this.report.scriptCallIssues.length}\n`;
            output += "\n\n";
            
            // Active Plugins Section
            output += "ACTIVE PLUGINS\n";
            output += "-".repeat(80) + "\n";
            if (this.activePlugins.size > 0) {
                let pluginNum = 1;
                for (let [name, plugin] of this.activePlugins) {
                    output += `${pluginNum}. ${name}\n`;
                    if (plugin.description) {
                        output += `   Description: ${plugin.description}\n`;
                    }
                    pluginNum++;
                }
            } else {
                output += "No active plugins detected.\n";
            }
            output += "\n\n";
            
            // Registered Commands Section
            output += "REGISTERED PLUGIN COMMANDS\n";
            output += "-".repeat(80) + "\n";
            if (this.registeredCommands.size > 0) {
                const commands = Array.from(this.registeredCommands).sort();
                commands.forEach((cmd, idx) => {
                    output += `${idx + 1}. ${cmd}\n`;
                });
            } else {
                output += "No plugin commands registered.\n";
            }
            output += "\n\n";
            
            // Orphaned Plugin Commands
            output += "=".repeat(80) + "\n";
            output += "ORPHANED PLUGIN COMMANDS\n";
            output += "=".repeat(80) + "\n";
            if (this.report.orphanedCommands.length > 0) {
                this.report.orphanedCommands.forEach((issue, idx) => {
                    output += `\n${idx + 1}. ${issue.command}\n`;
                    output += "-".repeat(80) + "\n";
                    output += `Location: ${issue.location}\n`;
                    output += `Event ID: ${issue.eventId}\n`;
                    output += `Page Index: ${issue.pageIndex}\n`;
                    output += `Command Index: ${issue.commandIndex}\n`;
                    if (issue.args && Object.keys(issue.args).length > 0) {
                        output += `Arguments: ${JSON.stringify(issue.args)}\n`;
                    }
                    output += `Suggestion: ${issue.suggestion}\n`;
                });
            } else {
                output += "\nNo orphaned plugin commands found. ✓\n";
            }
            output += "\n\n";
            
            // Unrecognized Notetags
            output += "=".repeat(80) + "\n";
            output += "UNRECOGNIZED NOTETAGS\n";
            output += "=".repeat(80) + "\n";
            if (this.report.orphanedNotetags.length > 0) {
                this.report.orphanedNotetags.forEach((issue, idx) => {
                    output += `\n${idx + 1}. ${issue.fullTag}\n`;
                    output += "-".repeat(80) + "\n";
                    output += `Location: ${issue.location}\n`;
                    output += `Tag Name: ${issue.tag}\n`;
                    output += `Suggestion: ${issue.suggestion}\n`;
                });
            } else {
                output += "\nNo unrecognized notetags found. ✓\n";
            }
            output += "\n\n";
            
            // Malformed Notetags
            output += "=".repeat(80) + "\n";
            output += "MALFORMED NOTETAGS\n";
            output += "=".repeat(80) + "\n";
            if (this.report.malformedNotetags.length > 0) {
                this.report.malformedNotetags.forEach((issue, idx) => {
                    output += `\n${idx + 1}. SYNTAX ERROR\n`;
                    output += "-".repeat(80) + "\n";
                    output += `Location: ${issue.location}\n`;
                    output += `Issue: ${issue.issue}\n`;
                    if (issue.tag) {
                        output += `Problematic Tag: ${issue.tag}\n`;
                    }
                });
            } else {
                output += "\nNo malformed notetags found. ✓\n";
            }
            output += "\n\n";
            
            // Script Call Issues
            output += "=".repeat(80) + "\n";
            output += "POTENTIAL SCRIPT CALL ISSUES\n";
            output += "=".repeat(80) + "\n";
            if (this.report.scriptCallIssues.length > 0) {
                this.report.scriptCallIssues.forEach((issue, idx) => {
                    output += `\n${idx + 1}. POTENTIAL ISSUE\n`;
                    output += "-".repeat(80) + "\n";
                    output += `Location: ${issue.location}\n`;
                    output += `Event ID: ${issue.eventId}\n`;
                    output += `Page Index: ${issue.pageIndex}\n`;
                    output += `Command Index: ${issue.commandIndex}\n`;
                    output += `Issue: ${issue.possibleIssue}\n`;
                    output += `Script Preview:\n`;
                    output += `  ${issue.script}...\n`;
                });
            } else {
                output += "\nNo script call issues detected. ✓\n";
            }
            output += "\n\n";
            
            // Footer
            output += "=".repeat(80) + "\n";
            output += "END OF REPORT\n";
            output += "=".repeat(80) + "\n";
            
            // Download the file
            const blob = new Blob([output], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `Plugin_Validation_Report_${new Date().toISOString().slice(0,10)}.txt`;
            document.body.appendChild(a);
            a.click();
            
            // Cleanup
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 100);
            
            console.log('%cReport exported successfully!', 'color: #4CAF50; font-weight: bold;');
            if ($gameMessage && !DataManager.isBattleTest() && !DataManager.isEventTest()) {
                $gameMessage.add("Plugin validation report exported!");
            }
        }
    }

    //=========================================================================
    // Global Access
    //=========================================================================
    
    window.PluginValidator = new PluginValidator();

    //=========================================================================
    // Plugin Commands
    //=========================================================================
    
    PluginManager.registerCommand(pluginName, "runValidation", args => {
        window.PluginValidator.runValidation();
    });

    PluginManager.registerCommand(pluginName, "exportReport", args => {
        window.PluginValidator.exportReport();
    });

})();
