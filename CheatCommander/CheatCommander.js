//=============================================================================
// CheatConsole.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Advanced cheat console with dev tools (Press ~ to open)
 * @author Alexandros Panagiotakopoulos
 * @url https://alexandrospanag.github.io
 * @date 16/11/2025
 * v1.0.1
 * @help CheatConsole.js
 *
 * This plugin adds a comprehensive developer/cheat console to your game.
 * Press the ~ (tilde) key to open the console.
 * Use Page Up/Page Down to scroll through history.
 *
 * Copyright (c) 2025 Alexandros Panagiotakopoulos
 * 
 * This work is licensed under the Creative Commons Attribution-NoDerivatives 4.0 
 * International License. To view a copy of this license, visit 
 * http://creativecommons.org/licenses/by-nd/4.0/
 * ============================================================================
 * Available Commands
 * ============================================================================
 * 
 * CHEATS:
 *   gold [amount]              Add gold to party (default: 999999)
 *   godmode                    Toggle invincibility
 *   heal                       Restore HP/MP/TP to full for all party members
 *   level [num]                Set party level (default: 99)
 *   speed [num]                Set movement speed (1-6, default: 4)
 *   noclip                     Toggle collision (walk through walls)
 *   encounter                  Toggle random encounters on/off
 *   instanttp                  Fill all party members' TP to 100
 *   item [id] [qty]            Add item by ID (qty default: 1)
 *   weapon [id] [qty]          Add weapon by ID (qty default: 1)
 *   armor [id] [qty]           Add armor by ID (qty default: 1)
 *
 * DEV TOOLS:
 *   teleport [map] [x] [y]     Teleport to map location
 *   switch [id] [on/off]       Set switch state (default: on)
 *   var [id] [value]           Set variable value
 *   clearstatus                Remove all status effects from party
 *   killall                    Defeat all enemies (battle only)
 *   save [slot]                Save game to slot (default: 1)
 *   load [slot]                Load game from slot (default: 1)
 *   fps                        Toggle FPS counter overlay
 *   coords                     Toggle coordinate display
 *   eventinfo                  Show info about events at player position
 *   showswitches [start] [end] Display switch states (default: 1-10)
 *   showvars [start] [end]     Display variable values (default: 1-10)
 *   resetflags                 Reset all switches/variables to default
 *
 * UTILITIES:
 *   clear                      Clear console history
 *   help                       Display this command list
 * 
 * ============================================================================
 */

(() => {
    'use strict';

    // Console State
    const consoleState = {
        isOpen: false,
        history: [],
        inputText: '',
        godMode: false,
        noClip: false,
        noEncounter: false,
        showFPS: false,
        showCoords: false,
        historyIndex: -1,
        scrollOffset: 0  // Added for scroll tracking
    };

    //=============================================================================
    // Scene_Map - Add Console Window
    //=============================================================================
    const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
    Scene_Map.prototype.createAllWindows = function() {
        _Scene_Map_createAllWindows.call(this);
        this.createConsoleWindow();
        this.createDebugOverlay();
    };

    Scene_Map.prototype.createConsoleWindow = function() {
        const rect = this.consoleWindowRect();
        this._consoleWindow = new Window_CheatConsole(rect);
        this._consoleWindow.hide();
        this._consoleWindow.close();
        this.addWindow(this._consoleWindow);
    };

    Scene_Map.prototype.createDebugOverlay = function() {
        const rect = new Rectangle(10, 10, 400, 120);
        this._debugOverlay = new Window_DebugOverlay(rect);
        this._debugOverlay.hide();
        this.addWindow(this._debugOverlay);
    };

    Scene_Map.prototype.consoleWindowRect = function() {
        const ww = Graphics.boxWidth;
        const wh = Math.floor(Graphics.boxHeight * 0.7);
        const wx = 0;
        const wy = Graphics.boxHeight - wh;
        return new Rectangle(wx, wy, ww, wh);
    };

    const _Scene_Map_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
        _Scene_Map_update.call(this);
        this.updateConsoleToggle();
        this.updateDebugOverlay();
    };

    Scene_Map.prototype.updateConsoleToggle = function() {
        if (Input.isTriggered('console')) {
            this.toggleConsole();
        }
    };

    Scene_Map.prototype.updateDebugOverlay = function() {
        if (this._debugOverlay) {
            if (consoleState.showFPS || consoleState.showCoords) {
                this._debugOverlay.show();
                this._debugOverlay.refresh();
            } else {
                this._debugOverlay.hide();
            }
        }
    };

    Scene_Map.prototype.toggleConsole = function() {
        if (!this._consoleWindow) {
            return;
        }
        
        if (consoleState.isOpen) {
            this._consoleWindow.deactivate();
            this._consoleWindow.hide();
            this._consoleWindow.close();
            consoleState.isOpen = false;
        } else {
            this._consoleWindow.show();
            this._consoleWindow.open();
            this._consoleWindow.activate();
            consoleState.isOpen = true;
            consoleState.scrollOffset = 0; // Reset scroll when opening
        }
    };

    //=============================================================================
    // Input - Add Console Key and Page Keys
    //=============================================================================
    Input.keyMapper[192] = 'console';
    Input.keyMapper[223] = 'console';
    Input.keyMapper[116] = 'console';
    Input.keyMapper[33] = 'pageup';     // Page Up
    Input.keyMapper[34] = 'pagedown';   // Page Down

    //=============================================================================
    // Window_DebugOverlay - Shows FPS and Coordinates
    //=============================================================================
    function Window_DebugOverlay() {
        this.initialize(...arguments);
    }

    Window_DebugOverlay.prototype = Object.create(Window_Base.prototype);
    Window_DebugOverlay.prototype.constructor = Window_DebugOverlay;

    Window_DebugOverlay.prototype.initialize = function(rect) {
        Window_Base.prototype.initialize.call(this, rect);
        this.opacity = 0;
        this.contentsOpacity = 255;
        this._frameCount = 0;
        this._lastTime = performance.now();
        this._fps = 60;
    };

    Window_DebugOverlay.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        this._frameCount++;
        const now = performance.now();
        if (now - this._lastTime >= 1000) {
            this._fps = Math.round(this._frameCount * 1000 / (now - this._lastTime));
            this._frameCount = 0;
            this._lastTime = now;
        }
    };

    Window_DebugOverlay.prototype.refresh = function() {
        this.contents.clear();
        let y = 0;
        
        if (consoleState.showFPS) {
            this.changeTextColor('#00ff00');
            this.drawText('FPS: ' + this._fps, 0, y, this.width);
            y += this.lineHeight();
        }
        
        if (consoleState.showCoords) {
            this.changeTextColor('#ffff00');
            this.drawText('Map: ' + $gameMap.mapId(), 0, y, this.width);
            y += this.lineHeight();
            this.drawText('X: ' + $gamePlayer.x + ' Y: ' + $gamePlayer.y, 0, y, this.width);
            y += this.lineHeight();
            this.changeTextColor('#00ffff');
            const regionId = $gameMap.regionId($gamePlayer.x, $gamePlayer.y);
            this.drawText('Region: ' + regionId, 0, y, this.width);
        }
        
        this.resetTextColor();
    };

    //=============================================================================
    // Window_CheatConsole
    //=============================================================================
    function Window_CheatConsole() {
        this.initialize(...arguments);
    }

    Window_CheatConsole.prototype = Object.create(Window_Selectable.prototype);
    Window_CheatConsole.prototype.constructor = Window_CheatConsole;

    Window_CheatConsole.prototype.initialize = function(rect) {
        Window_Selectable.prototype.initialize.call(this, rect);
        this.opacity = 220;
        this.backOpacity = 200;
        this.contentsOpacity = 255;
        this._inputText = '';
        
        if (consoleState.history.length === 0) {
            consoleState.history.push('=== Dev Console Activated ===');
            consoleState.history.push('Type "help" for available commands');
            consoleState.history.push('Use Page Up/Down to scroll history');
        }
        
        this.refresh();
    };

    Window_CheatConsole.prototype.maxItems = function() {
        return 1;
    };

    Window_CheatConsole.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        if (this.active) {
            this.processInput();
            this.processScroll();
        }
    };

    Window_CheatConsole.prototype.processScroll = function() {
        const lineHeight = this.lineHeight();
        const maxLines = Math.floor((this.height - this.padding * 2 - lineHeight) / lineHeight);
        const maxScroll = Math.max(0, consoleState.history.length - maxLines + 1);
        
        if (Input.isRepeated('pageup')) {
            consoleState.scrollOffset = Math.min(consoleState.scrollOffset + 5, maxScroll);
            this.refresh();
            SoundManager.playCursor();
        } else if (Input.isRepeated('pagedown')) {
            consoleState.scrollOffset = Math.max(consoleState.scrollOffset - 5, 0);
            this.refresh();
            SoundManager.playCursor();
        }
    };

    Window_CheatConsole.prototype.processInput = function() {
        if (Input.isTriggered('ok')) {
            this.executeCommand(this._inputText);
            this._inputText = '';
            consoleState.historyIndex = -1;
            consoleState.scrollOffset = 0; // Reset scroll on command
            this.refresh();
            SoundManager.playOk();
        } else if (Input.isTriggered('cancel')) {
            this.deactivate();
            this.close();
            consoleState.isOpen = false;
            SoundManager.playCancel();
        } else {
            this.handleKeyboardInput();
        }
    };

    Window_CheatConsole.prototype.handleKeyboardInput = function() {
        if (this._lastKeyEvent) {
            const key = this._lastKeyEvent.key;
            
            if (key.length === 1) {
                this._inputText += key;
                this.refresh();
            } else if (key === 'Backspace') {
                this._inputText = this._inputText.slice(0, -1);
                this.refresh();
            }
            
            this._lastKeyEvent = null;
        }
    };

    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        
        if (!this._consoleKeyHandler) {
            this._consoleKeyHandler = this.onConsoleKeyDown.bind(this);
            document.addEventListener('keydown', this._consoleKeyHandler);
        }
    };

    Scene_Map.prototype.onConsoleKeyDown = function(event) {
        if (event.key === '~' || event.key === '`') {
            event.preventDefault();
            return;
        }
        
        if (consoleState.isOpen && this._consoleWindow && this._consoleWindow.active) {
            // Allow Page Up/Down to pass through for scrolling
            if (event.key === 'PageUp' || event.key === 'PageDown') {
                event.preventDefault();
                return;
            }
            
            if (event.key === 'Enter' || event.key === 'Escape') {
                return;
            }
            
            event.preventDefault();
            this._consoleWindow._lastKeyEvent = event;
        }
    };

    Window_CheatConsole.prototype.executeCommand = function(input) {
        if (!input.trim()) return;

        const parts = input.trim().toLowerCase().split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);

        consoleState.history.push('> ' + input);

        switch(cmd) {
            case 'help':
                this.cmdHelp();
                break;
            case 'gold':
                this.cmdGold(args);
                break;
            case 'godmode':
                this.cmdGodMode();
                break;
            case 'heal':
                this.cmdHeal();
                break;
            case 'level':
                this.cmdLevel(args);
                break;
            case 'speed':
                this.cmdSpeed(args);
                break;
            case 'noclip':
                this.cmdNoClip();
                break;
            case 'item':
                this.cmdItem(args);
                break;
            case 'weapon':
                this.cmdWeapon(args);
                break;
            case 'armor':
                this.cmdArmor(args);
                break;
            case 'teleport':
                this.cmdTeleport(args);
                break;
            case 'switch':
                this.cmdSwitch(args);
                break;
            case 'var':
            case 'variable':
                this.cmdVariable(args);
                break;
            case 'encounter':
                this.cmdEncounter();
                break;
            case 'instanttp':
                this.cmdInstantTP();
                break;
            case 'clearstatus':
                this.cmdClearStatus();
                break;
            case 'killall':
                this.cmdKillAll();
                break;
            case 'save':
                this.cmdSave(args);
                break;
            case 'load':
                this.cmdLoad(args);
                break;
            case 'fps':
                this.cmdFPS();
                break;
            case 'coords':
                this.cmdCoords();
                break;
            case 'eventinfo':
                this.cmdEventInfo();
                break;
            case 'showswitches':
                this.cmdShowSwitches(args);
                break;
            case 'showvars':
                this.cmdShowVars(args);
                break;
            case 'resetflags':
                this.cmdResetFlags();
                break;
            case 'clear':
                consoleState.history = [];
                consoleState.scrollOffset = 0;
                break;
            default:
                consoleState.history.push('Unknown command: ' + cmd);
        }

        if (consoleState.history.length > 500) {
            consoleState.history = consoleState.history.slice(-500);
        }

        this.refresh();
    };

    // Cheat Commands
    Window_CheatConsole.prototype.cmdItem = function(args) {
        const itemId = args[0] ? parseInt(args[0]) : 1;
        const quantity = args[1] ? parseInt(args[1]) : 1;
        if ($dataItems[itemId]) {
            $gameParty.gainItem($dataItems[itemId], quantity);
            consoleState.history.push(`Added ${quantity}x ${$dataItems[itemId].name}`);
        } else {
            consoleState.history.push('Invalid item ID');
        }
    };

    Window_CheatConsole.prototype.cmdWeapon = function(args) {
        const weaponId = args[0] ? parseInt(args[0]) : 1;
        const quantity = args[1] ? parseInt(args[1]) : 1;
        if ($dataWeapons[weaponId]) {
            $gameParty.gainItem($dataWeapons[weaponId], quantity);
            consoleState.history.push(`Added ${quantity}x ${$dataWeapons[weaponId].name}`);
        } else {
            consoleState.history.push('Invalid weapon ID');
        }
    };

    Window_CheatConsole.prototype.cmdArmor = function(args) {
        const armorId = args[0] ? parseInt(args[0]) : 1;
        const quantity = args[1] ? parseInt(args[1]) : 1;
        if ($dataArmors[armorId]) {
            $gameParty.gainItem($dataArmors[armorId], quantity);
            consoleState.history.push(`Added ${quantity}x ${$dataArmors[armorId].name}`);
        } else {
            consoleState.history.push('Invalid armor ID');
        }
    };

    Window_CheatConsole.prototype.cmdTeleport = function(args) {
        const mapId = args[0] ? parseInt(args[0]) : 1;
        const x = args[1] ? parseInt(args[1]) : 0;
        const y = args[2] ? parseInt(args[2]) : 0;
        $gamePlayer.reserveTransfer(mapId, x, y, 2, 0);
        consoleState.history.push(`Teleporting to Map ${mapId} (${x}, ${y})`);
    };

    Window_CheatConsole.prototype.cmdSwitch = function(args) {
        const switchId = args[0] ? parseInt(args[0]) : 1;
        const value = args[1] === 'off' ? false : true;
        $gameSwitches.setValue(switchId, value);
        consoleState.history.push(`Switch #${switchId} set to ${value ? 'ON' : 'OFF'}`);
    };

    Window_CheatConsole.prototype.cmdVariable = function(args) {
        const varId = args[0] ? parseInt(args[0]) : 1;
        const value = args[1] ? parseInt(args[1]) : 0;
        $gameVariables.setValue(varId, value);
        consoleState.history.push(`Variable #${varId} set to ${value}`);
    };

    Window_CheatConsole.prototype.cmdEncounter = function() {
        consoleState.noEncounter = !consoleState.noEncounter;
        consoleState.history.push('Random Encounters: ' + (consoleState.noEncounter ? 'OFF' : 'ON'));
    };

    Window_CheatConsole.prototype.cmdClearStatus = function() {
        $gameParty.members().forEach(actor => {
            actor.clearStates();
        });
        consoleState.history.push('All status effects removed');
    };

    Window_CheatConsole.prototype.cmdKillAll = function() {
        if ($gameParty.inBattle()) {
            $gameTroop.members().forEach(enemy => {
                enemy.addState(1);
            });
            consoleState.history.push('All enemies defeated');
        } else {
            consoleState.history.push('Not in battle!');
        }
    };

    // Dev Tool Commands
    Window_CheatConsole.prototype.cmdSave = function(args) {
        const saveId = args[0] ? parseInt(args[0]) : 1;
        $gameSystem.onBeforeSave();
        DataManager.saveGame(saveId).then(() => {
            consoleState.history.push(`Game saved to slot ${saveId}`);
        }).catch(() => {
            consoleState.history.push('Save failed!');
        });
    };

    Window_CheatConsole.prototype.cmdLoad = function(args) {
        const saveId = args[0] ? parseInt(args[0]) : 1;
        if (DataManager.loadGame(saveId)) {
            Scene_Load.prototype.reloadMapIfUpdated.call(SceneManager._scene);
            SceneManager.goto(Scene_Map);
            consoleState.history.push(`Game loaded from slot ${saveId}`);
        } else {
            consoleState.history.push('Load failed! Invalid save slot');
        }
    };

    Window_CheatConsole.prototype.cmdFPS = function() {
        consoleState.showFPS = !consoleState.showFPS;
        consoleState.history.push('FPS Display: ' + (consoleState.showFPS ? 'ON' : 'OFF'));
    };

    Window_CheatConsole.prototype.cmdCoords = function() {
        consoleState.showCoords = !consoleState.showCoords;
        consoleState.history.push('Coordinates Display: ' + (consoleState.showCoords ? 'ON' : 'OFF'));
    };

    Window_CheatConsole.prototype.cmdEventInfo = function() {
        const x = $gamePlayer.x;
        const y = $gamePlayer.y;
        const events = $gameMap.eventsXy(x, y);
        
        if (events.length > 0) {
            events.forEach(event => {
                consoleState.history.push(`Event #${event.eventId()}: "${event.event().name}"`);
            });
        } else {
            consoleState.history.push('No events at current position');
        }
        
        // Show nearby events
        const nearbyEvents = $gameMap.events().filter(e => {
            const dx = Math.abs(e.x - x);
            const dy = Math.abs(e.y - y);
            return dx <= 1 && dy <= 1 && (dx > 0 || dy > 0);
        });
        
        if (nearbyEvents.length > 0) {
            consoleState.history.push('Nearby events:');
            nearbyEvents.forEach(e => {
                consoleState.history.push(`  #${e.eventId()} at (${e.x},${e.y})`);
            });
        }
    };

    Window_CheatConsole.prototype.cmdShowSwitches = function(args) {
        const start = args[0] ? parseInt(args[0]) : 1;
        const end = args[1] ? parseInt(args[1]) : Math.min(start + 9, 100);
        
        consoleState.history.push(`Switches ${start}-${end}:`);
        for (let i = start; i <= end; i++) {
            const state = $gameSwitches.value(i) ? 'ON' : 'OFF';
            consoleState.history.push(`  [${i}]: ${state}`);
        }
    };

    Window_CheatConsole.prototype.cmdShowVars = function(args) {
        const start = args[0] ? parseInt(args[0]) : 1;
        const end = args[1] ? parseInt(args[1]) : Math.min(start + 9, 100);
        
        consoleState.history.push(`Variables ${start}-${end}:`);
        for (let i = start; i <= end; i++) {
            const value = $gameVariables.value(i);
            consoleState.history.push(`  [${i}]: ${value}`);
        }
    };

    Window_CheatConsole.prototype.cmdResetFlags = function() {
        for (let i = 1; i <= 100; i++) {
            $gameSwitches.setValue(i, false);
            $gameVariables.setValue(i, 0);
        }
        consoleState.history.push('All switches and variables reset');
    };

    Window_CheatConsole.prototype.cmdHelp = function() {
        consoleState.history.push('═══════════════════════════════════════');
        consoleState.history.push('               CHEAT COMMANDS');
        consoleState.history.push('═══════════════════════════════════════');
        consoleState.history.push('  gold [amt]           Add gold');
        consoleState.history.push('  godmode              Toggle invincibility');
        consoleState.history.push('  heal                 Restore HP/MP/TP');
        consoleState.history.push('  instanttp            Fill TP to 100');
        consoleState.history.push('  level [n]            Set party level');
        consoleState.history.push('  speed [n]            Movement speed (1-6)');
        consoleState.history.push('  noclip               Walk through walls');
        consoleState.history.push('  encounter            Toggle encounters');
        consoleState.history.push('  item [id] [qty]      Add item');
        consoleState.history.push('  weapon [id] [qty]    Add weapon');
        consoleState.history.push('  armor [id] [qty]     Add armor');
        consoleState.history.push('');
        consoleState.history.push('              DEV TOOLS');
        consoleState.history.push('═══════════════════════════════════════');
        consoleState.history.push('  teleport [m] [x] [y] Teleport to map');
        consoleState.history.push('  switch [id] [on/off] Set switch');
        consoleState.history.push('  var [id] [val]       Set variable');
        consoleState.history.push('  save [slot]          Save game');
        consoleState.history.push('  load [slot]          Load game');
        consoleState.history.push('  fps                  Show FPS counter');
        consoleState.history.push('  coords               Show coordinates');
        consoleState.history.push('  eventinfo            Show event data');
        consoleState.history.push('  showswitches [s] [e] Display switches');
        consoleState.history.push('  showvars [s] [e]     Display variables');
        consoleState.history.push('  resetflags           Reset switches/vars');
        consoleState.history.push('  clearstatus          Remove status effects');
        consoleState.history.push('  killall              Win battle instantly');
        consoleState.history.push('  clear                Clear console');
        consoleState.history.push('═══════════════════════════════════════');
        consoleState.history.push('  Use Page Up/Down to scroll history');
    };

    Window_CheatConsole.prototype.cmdGold = function(args) {
        const amount = args[0] ? parseInt(args[0]) : 999999;
        $gameParty.gainGold(amount);
        consoleState.history.push(`Added ${amount} gold`);
    };

    Window_CheatConsole.prototype.cmdGodMode = function() {
        consoleState.godMode = !consoleState.godMode;
        consoleState.history.push('God Mode: ' + (consoleState.godMode ? 'ON' : 'OFF'));
    };

    Window_CheatConsole.prototype.cmdHeal = function() {
        $gameParty.members().forEach(actor => {
            actor.recoverAll();
        });
        consoleState.history.push('Party fully healed');
    };

    Window_CheatConsole.prototype.cmdInstantTP = function() {
        $gameParty.members().forEach(actor => {
            actor.setTp(100);
        });
        consoleState.history.push('All party members TP set to 100');
    };

    Window_CheatConsole.prototype.cmdLevel = function(args) {
        const level = args[0] ? parseInt(args[0]) : 99;
        $gameParty.members().forEach(actor => {
            const currentLevel = actor.level;
            if (level > currentLevel) {
                actor.changeLevel(level, false);
            }
        });
        consoleState.history.push(`Party level set to ${level}`);
    };

    Window_CheatConsole.prototype.cmdSpeed = function(args) {
        const speed = args[0] ? parseFloat(args[0]) : 4;
        $gamePlayer.setMoveSpeed(speed);
        consoleState.history.push(`Movement speed set to ${speed}`);
    };

    Window_CheatConsole.prototype.cmdNoClip = function() {
        consoleState.noClip = !consoleState.noClip;
        consoleState.history.push('NoClip: ' + (consoleState.noClip ? 'ON' : 'OFF'));
    };

    Window_CheatConsole.prototype.refresh = function() {
        this.contents.clear();
        
        this.contents.fillRect(0, 0, this.width - this.padding * 2, this.height - this.padding * 2, 'rgba(0, 0, 0, 0.8)');
        
        const lineHeight = this.lineHeight();
        const maxLines = Math.floor((this.height - this.padding * 2 - lineHeight) / lineHeight);
        
        // Calculate start index based on scroll offset
        let startIndex = Math.max(0, consoleState.history.length - maxLines + 1 - consoleState.scrollOffset);
        startIndex = Math.max(0, startIndex);
        
        // Draw scroll indicator if there's more history to view
        if (consoleState.scrollOffset > 0) {
            this.changeTextColor('#888888');
            this.drawText('▲ More history above (Page Up)', 0, 0, this.width - this.padding * 2, 'center');
            this.changeTextColor('#00ff00');
        }
        
        this.changeTextColor('#00ff00');
        const startY = consoleState.scrollOffset > 0 ? lineHeight : 0;
        for (let i = startIndex; i < Math.min(startIndex + maxLines - 1, consoleState.history.length); i++) {
            const y = (i - startIndex) * lineHeight + startY;
            this.drawText(consoleState.history[i], 0, y, this.width - this.padding * 2);
        }

        // Show scroll indicator at bottom if not at latest
        if (consoleState.scrollOffset > 0) {
            this.changeTextColor('#888888');
            const indicatorY = (maxLines - 2) * lineHeight;
            this.drawText('▼ Latest messages below (Page Down)', 0, indicatorY, this.width - this.padding * 2, 'center');
        }

        // Draw input line
        this.changeTextColor('#ffff00');
        const inputY = (maxLines - 1) * lineHeight;
        this.drawText('> ' + this._inputText + '_', 0, inputY, this.width - this.padding * 2);
        this.resetTextColor();
    };

    //=============================================================================
    // God Mode Implementation
    //=============================================================================
    const _Game_Battler_gainHp = Game_Battler.prototype.gainHp;
    Game_Battler.prototype.gainHp = function(value) {
        if (consoleState.godMode && this.isActor() && value < 0) {
            return;
        }
        _Game_Battler_gainHp.call(this, value);
    };

    const _Game_Battler_gainMp = Game_Battler.prototype.gainMp;
    Game_Battler.prototype.gainMp = function(value) {
        if (consoleState.godMode && this.isActor() && value < 0) {
            return;
        }
        _Game_Battler_gainMp.call(this, value);
    };

    //=============================================================================
    // NoClip Implementation
    //=============================================================================
    const _Game_Player_isMapPassable = Game_Player.prototype.isMapPassable;
    Game_Player.prototype.isMapPassable = function(x, y, d) {
        if (consoleState.noClip) {
            return true;
        }
        return _Game_Player_isMapPassable.call(this, x, y, d);
    };
    
    //=============================================================================
    // No Encounter Implementation
    //=============================================================================
    const _Game_Player_encounterProgressValue = Game_Player.prototype.encounterProgressValue;
    Game_Player.prototype.encounterProgressValue = function() {
        if (consoleState.noEncounter) {
            return 0;
        }
        return _Game_Player_encounterProgressValue.call(this);
    };

})();
