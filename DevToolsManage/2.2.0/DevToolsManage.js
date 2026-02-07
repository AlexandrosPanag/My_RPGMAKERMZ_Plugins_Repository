//=============================================================================
// DevToolsManage.js
// ----------------------------------------------------------------------------
// Original Author: (C)2020 Triacontane
// Modified by: Alexandros Panagiotakopoulos (2025-2026)
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version

// 2.2.0 2026/02/07 Fixed require.main.filename error with NW.js fallback paths for backup creation
// 2.2.0 2025/12/02 Added /help console command system, code optimizations, cached DOM queries
// 2.1.0 2025/11/19 Code Modernization: Updated to 2025 standards, replaced deprecated Node.js APIs
// 2.0.1 2025/11/15 Memory & Performance Update: Fixed memory leaks, added cleanup methods
// 1.3.0 2025/11/01 Improvements: Use of modern NW.js API, performance optimization, UI improvements
// 1.2.2 2023/10/07 IDE breakpoint support is now optional.
// 1.2.1 2023/07/20 Fixed an incorrect title cut for the English parameter.
// 1.2.0 2023/01/08 Changed the behavior of title cuts to allow you to choose between starting a new game or loading the latest data.
// 1.1.4 2022/04/30 Addressed an issue where an error would occur when using the map reload function after deleting events duplicated with the EventRespawn.js region function.
// 1.1.3 2021/04/10 Disabled the incomplete function that prevented title cuts by holding down the CTRL key during title cut settings.
// 1.1.2 2021/03/27 Fixed an issue where deleted events would not be restored during normal loads.
// 1.1.1 2020/10/11 Fixed a conflict where enemy groups were not selected correctly in battle tests when combined with AnimationMv.js.
// 1.1.0 2020/09/26 Added a shortcut command to open the project folder.
// 1.0.5 2020/09/13 Fixed an issue where the forced victory command did not work.
// 1.0.4 2020/08/21 Fixed an issue where an error occurred when attempting to use the map auto-reload function.
// 1.0.3 2020/08/20 Fixed an issue where the plugin would not work with the official version of PluginCommonBase.
// 1.0.2 2020/06/06 Improved the English help.
// 1.0.1 2020/04/20 Improved breakpoints.

// 1.0.0 2020/04/05 Created using the MV version
// ----------------------------------------------------------------------------
// [Original Blog]   : https://triacontane.blogspot.jp/
// [Original Twitter]: https://twitter.com/triacontane/
// [Original GitHub] : https://github.com/triacontane/
// [Modified by]     : https://github.com/AlexandrosPanag
//=============================================================================

/*:
 * @plugindesc Development Support Plugin
 * @author triacontane & Alexandros Panagiotakopoulos
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @target MZ
 * @url alexandrospanag.github.io
 *
 * @param StartupDevTool
 * @text Boot on Launch
 * @desc Boots the developer tool simultaneously with game launch.
 * @default true
 * @type boolean
 *
 * @param ShortcutList
 * @text Shortcut List
 * @desc A list of usable shortcut functions.
 * @type struct<ShortcutFunction>[]
 *
 * @param ShowFPS
 * @text Show FPS
 * @desc By default, shows FPS in the upper left of the screen. (FPS/MS/OFF)
 * @default OFF
 * @type select
 * @option FPS
 * @option MS
 * @option OFF
 *
 * @param CutTitle
 * @text Title Skip
 * @desc Skips the title screen and loads the most recent save file.
 * @default 0
 * @type select
 * @option Invalid
 * @value 0
 * @option New game
 * @value 1
 * @option Latest data load
 * @value 2
 *
 * @param RapidStart
 * @text Start Rapid Mode
 * @desc Launches the game in a sped up state. (ON/OFF)
 * @default false
 * @type boolean
 *
 * @param RapidSpeed
 * @text Rapid Speed
 * @desc The playback speed when rapid mode is executed. Can be specified up to 16x.
 * @default 2
 * @type number
 * @max 16
 *
 * @param SlowSpeed
 * @text Slow Speed
 * @desc The playback speed (denominator) when slow mode is executed. Can be slowed to 1/16 speed.
 * @default 2
 * @type number
 * @max 16
 *
 * @param InvalidMessageSkip
 * @text Disable Message Skip
 * @desc Disables forced skipping of messages in rapid mode.
 * @default false
 * @type boolean
 *
 * @param MenuBarVisible
 * @text Display Menu Bar
 * @desc Display the menu bar and execute various debug commands.(ON/OFF)
 * @default true
 * @type boolean
 *
 * @param ClickMenu
 * @text Click Menu
 * @desc Executes various debug commands from the click menu. (-1:Disable  0:Left  1:Wheel  2:Right)
 * @default 1
 * @type select
 * @option Disable
 * @value -1
 * @option Left
 * @value 0
 * @option Wheel
 * @value 1
 * @option Right
 * @value 2
 *
 * @param OutputStartupInfo
 * @text Info Output at Launch
 * @desc Outputs a log of various types of information on launch.
 * @default true
 * @type boolean
 *
 * @param StartupOnTop
 * @text Launch as Top Screen
 * @desc Locks the game screen as the forefront display on launch.
 * @default false
 * @type boolean
 *
 * @param UseReloadData
 * @text Use Reload Function
 * @desc Reloads map and data on focus. Please disable if it causes the program to have problems running due to competing processes.
 * @default true
 * @type boolean
 *
 * @param AutoBackup
 * @text Auto Backup on Save
 * @desc Automatically creates a backup of the project when saving maps/events.
 * @default true
 * @type boolean
 *
 * @param MaxBackups
 * @text Maximum Backups
 * @desc Maximum number of backup files to keep (0 = unlimited)
 * @default 5
 * @type number
 * 
 * @help This is a creation support plugin that adjusts the behavior of the developer tool.
 * This plugin is only enabled for test plays in a local environment.
 * The following functions are provided to assist with smooth development.
 *
 * 1. The developer tool automatically opens on game launch.(Normally, F8 is used to launch.)
 *    Even when set to OFF, it will automatically open when an error occurs.
 *
 * 2. It will always display the game screen as the foremost window on screen. This is
 *    convenient when looking at other screens while working. You can switch modes from the menu bar in-game.
 *
 * 3. If you edit maps or events and resave, the map and database will be automatically
 *    reloaded the instant focus returns to the game screen.
 *
 * 4. Skip the title screen and load the most recent save file.
 *
 * 5. Increase or decrease game speed (16x maximum).
 *    Or, stop the game entirely.
 *    The game will return to normal speed only when making a selection in a window.
 *
 * 6. Force kill all enemies, allowing you to win. You will still receive battle rewards.
 *    You can also force a loss or abort a battle.
 *
 * 7. Execute optional scripts on every frame.
 *    Results are outputted to the console only when there is a variation in a script's return value.
 *
 * 8. Allow external battle tests via the editor.
 *    Please configure btest in the url options.
 *
 * This plugin is not a plugin command.
 *
 * User Agreement:
 *  You may alter or redistribute the plugin without permission. There are no restrictions on usage format
 *  (such as adult- or commercial-use only).
 *  This plugin is now all yours.
 */

/*~struct~ShortcutFunction:
 *
 * @param Command
 * @text Command
 * @desc Details of the command you wish to execute.
 * @default
 * @type select
 * @option Display at forefront
 * @value AlwaysOnTop
 * @option Freeze screen
 * @value Freeze
 * @option Resident script
 * @value ExecuteScript
 * @option Abort battle
 * @value ForceAbort
 * @option Lose battle
 * @value ForceDefeat
 * @option Win battle
 * @value ForceVictory
 * @option Rapid mode
 * @value ToggleRapid
 * @option Slow mode
 * @value ToggleSlow
 * @option Open project
 * @value OpenProject
 *
 * @param HotKey
 * @text Hotkey
 * @desc Hotkey for executing commands.
 * @default
 * @type select
 * @option
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param Alt
 * @text Hold ALT key simultaneously
 * @desc Enabled only when ALT key is held simultaneously
 * @type boolean
 * @default false
 *
 * @param Ctrl
 * @text Hold CTRL key simultaneously
 * @desc Enabled only when CTRL key is held simultaneously
 * @type boolean
 * @default false
 *
 */

/*:ja
 * @plugindesc Development Support Plug-in
 * @author Triacontane (トリアコンタン) & Alexandros Panagiotakopoulos
 * @base PluginCommonBase
 * @orderAfter PluginCommonBase
 * @target MZ
 * @url https://github.com/triacontane/RPGMakerMV/tree/mz_master/DevToolsManage.js
 *
 * @param StartupDevTool
 * @text Launch at startup
 * @desc When you start the game, the developer tools will launch at the same time.
 * @default true
 * @type boolean
 *
 * @param ShortcutList
 * @text Shortcut list
 * @desc This is a list of shortcut functions to use.
 * @type struct<ShortcutFunction>[]
 *
 * @param ShowFPS
 * @text FPS indicators
 * @desc By default, FPS is displayed in the upper left corner of the screen (FPS/MS/OFF).
 * @default OFF
 * @type select
 * @option FPS
 * @option MS
 * @option OFF
 *
 * @param CutTitle
 * @text Title cut
 * @desc Skip the title screen and start the game.
 * @default 0
 * @type select
 * @option invalid
 * @value 0
 * @option Start a new game
 * @value 1
 * @option Load latest data
 * @value 2
 *
 * @param RapidStart
 * @text High-speed start
 * @desc Start the game in a faster state. (ON/OFF)
 * @default false
 * @type boolean
 *
 * @param RapidSpeed
 * @text High-speed scaling
 * @desc This is the playback speed when speeding up. You can specify up to 16x speed.
 * @default 2
 * @type number
 * @max 16
 *
 * @param SlowSpeed
 * @text Low speed ratio
 * @desc This is the playback speed (denominator) when slowing down the video. You can specify up to 1/16x speed.
 * @default 2
 * @type number
 * @max 16
 *
 * @param InvalidMessageSkip
 * @text Message skip disabled
 * @desc Disables forced skipping of messages in accelerated state.
 * @default false
 * @type boolean
 *
 * @param MenuBarVisible
 * @text Show Menu Bar
 * @desc Displays the menu bar and allows you to execute various debug commands. (ON/OFF)
 * @default true
 * @type boolean
 *
 * @param ClickMenu
 * @text クリックメニュー
 * @desc You can execute various debug commands from the click menu. (-1: Disabled, 0: Left, 1: Wheel, 2: Right)
 * @default 1
 * @type select
 * @option invalid  
 * @value -1
 * @option left
 * @value 0
 * @option wheel
 * @value 1
 * @option right
 * @value 2
 *
 * @param OutputStartupInfo
 * @text Output startup information
 * @desc Various information will be logged at startup.
 * @default true
 * @type boolean
 *
 * @param StartupOnTop
 * @text Launch at forefront
 * @desc When starting, the game screen will be fixed at the forefront.
 * @default false
 * @type boolean
 *
 * @param UseReloadData
 * @text Use reload function
 * @desc Reloads maps and data when on focus. Disable this if you are having problems with the app due to conflicts.
 * @default true
 * @type boolean
 *
 * @help This is a development support plugin that adjusts the behavior of the developer tools.
* This plugin is only active during test play in a local environment.
* It provides the following features to support smooth development.
*
* 1. The developer tools launch automatically when the game starts. (Usually launched with F8).
* Even if disabled, they will launch automatically if an error occurs.
*
* 2. They keep the game screen in the foreground. This is convenient for working while looking at the screen.
* You can switch between them from the menu bar during gameplay.
*
* 3. If you modify a map or event and resave it, the map and database will automatically reload the moment you return focus to the game screen.
*
* 4. You can skip the title screen and load the latest save file.
*
* 5. You can speed up or slow down the game speed (up to 16x speed).
* You can also stop the game completely.
* The game will run at normal speed only while a window item is selected.
*
* 6. You can force annihilate all enemies to win. You can also obtain rewards.
* Force defeat and forced abort are also possible.
*
* 7. You can execute any script every frame.
* Results are output to the console only when the script's return value changes.
*
* 8. Battles can be tested externally via the editor.
* Set the url option to btest.
*
* This plugin does not have a plugin command.
*
* Terms of Use:
* You may modify and redistribute this plugin without permission from the author, and there are no restrictions on its use (commercial, R18, etc.).
* This plugin is now yours.
 */

/*~struct~ShortcutFunction:
 *
 * @param Command
 * @text Command
 * @desc The content of the command you want to execute.
 * @default
 * @type select
 * @option Always on top
 * @value AlwaysOnTop
 * @option Freeze screen
 * @value Freeze
 * @option Execute script
 * @value ExecuteScript
 * @option Force abort
 * @value ForceAbort
 * @option Force defeat
 * @value ForceDefeat
 * @option Force victory
 * @value ForceVictory
 * @option High speed toggle
 * @value ToggleRapid
 * @option Low speed toggle
 * @value ToggleSlow
 * @option Open project
 * @value OpenProject
 *
 * @param HotKey
 * @text Hotkey
 * @desc Hotkey to execute the command.
 * @default
 * @type select
 * @option
 * @option F1
 * @option F2
 * @option F3
 * @option F4
 * @option F5
 * @option F6
 * @option F7
 * @option F8
 * @option F9
 * @option F10
 * @option F11
 * @option F12
 *
 * @param Alt
 * @text ALT key press simultaneously
 * @desc When enabled, it will only be executed when pressed simultaneously with the ALT key.
 * @type boolean
 * @default false
 *
 * @param Ctrl
 * @text CTRL key press simultaneously
 * @desc When enabled, it will only be executed when you press the CTRL key at the same time.
 * @type boolean
 * @default false
 *
 */

/**
 * Controller_NwJs
 * Manipulates NW.js windows.
 * @constructor
 */
function Controller_NwJs() {
    this.initialize.apply(this, arguments);
}

/**
 * DevConsole
 * Console command system for developer tools
 * Commands are called directly as functions: help(), tp(x,y), gold(1000), etc.
 */
const DevConsole = {
    _history: [],
    _maxHistory: 50,
    
    /**
     * Initialize the console command system
     */
    init() {
        this.exposeGlobalCommands();
        console.log('%c🎮 DevConsole Ready! Type help() for commands.', 
            'background: #000; color: white; padding: 5px; border-radius: 3px; font-weight: bold;');
    },
    
    /**
     * Add to command history
     */
    addHistory(cmd) {
        this._history.push(cmd);
        if (this._history.length > this._maxHistory) {
            this._history.shift();
        }
    },
    
    /**
     * Expose all commands as global functions
     */
    exposeGlobalCommands() {
        const style = 'color: #2196F3; font-weight: bold;';
        const cmdStyle = 'color: #4CAF50;';
        const descStyle = 'color: #9E9E9E;';
        
        // ═══════════════════════════════════════════════════════════════
        // HELP COMMAND
        // ═══════════════════════════════════════════════════════════════
        window.help = (command) => {
            this.addHistory('help()');
            
            if (command) {
                // Show specific command help
                const helps = {
                    'tp': { desc: 'Teleport player', usage: 'tp(x, y) or tp(mapId, x, y)' },
                    'heal': { desc: 'Fully heal party', usage: 'heal()' },
                    'god': { desc: 'Toggle god mode', usage: 'god()' },
                    'noclip': { desc: 'Walk through walls', usage: 'noclip()' },
                    'speed': { desc: 'Set move speed 1-6', usage: 'speed(4)' },
                    'gold': { desc: 'Add/remove gold', usage: 'gold(10000) or gold(-500)' },
                    'item': { desc: 'Give item', usage: 'item(id, amount)' },
                    'weapon': { desc: 'Give weapon', usage: 'weapon(id, amount)' },
                    'armor': { desc: 'Give armor', usage: 'armor(id, amount)' },
                    'allitems': { desc: 'Get all items', usage: 'allitems()' },
                    'level': { desc: 'Set party level', usage: 'level(99)' },
                    'exp': { desc: 'Add EXP', usage: 'exp(1000)' },
                    'addactor': { desc: 'Add actor to party', usage: 'addactor(id)' },
                    'removeactor': { desc: 'Remove actor', usage: 'removeactor(id)' },
                    'save': { desc: 'Save game', usage: 'save(slot)' },
                    'load': { desc: 'Load game', usage: 'load(slot)' },
                    'sw': { desc: 'Toggle switch', usage: 'sw(id) or sw(id, true/false)' },
                    'vari': { desc: 'Get/set variable', usage: 'vari(id) or vari(id, value)' },
                    'event': { desc: 'List/start event', usage: 'event() or event(id)' },
                    'coords': { desc: 'Show position', usage: 'coords()' },
                    'mapinfo': { desc: 'Show map info', usage: 'mapinfo()' },
                    'encounter': { desc: 'Start battle', usage: 'encounter(troopId)' },
                    'win': { desc: 'Win battle', usage: 'win()' },
                    'flee': { desc: 'Flee battle', usage: 'flee()' },
                    'fps': { desc: 'Toggle FPS', usage: 'fps()' },
                    'screenshot': { desc: 'Take screenshot', usage: 'screenshot()' },
                    'reload': { desc: 'Reload game', usage: 'reload()' }
                };
                
                const h = helps[command];
                if (h) {
                    console.log(`%c${command}()`, style);
                    console.log(`  Description: %c${h.desc}`, descStyle);
                    console.log(`  Usage: %c${h.usage}`, cmdStyle);
                } else {
                    console.error(`Unknown command: ${command}`);
                }
                return;
            }
            
            console.log('%c╔══════════════════════════════════════╗', style);
            console.log('%c║     DevTools Console Commands        ║', style);
            console.log('%c╚══════════════════════════════════════╝', style);
            console.log('');
            console.log('%c▸ Player', style);
            console.log('  %ctp(x, y)%c - Teleport on current map', cmdStyle, descStyle);
            console.log('  %ctp(mapId, x, y)%c - Teleport to map', cmdStyle, descStyle);
            console.log('  %cheal()%c - Fully heal party', cmdStyle, descStyle);
            console.log('  %cgod()%c - Toggle god mode', cmdStyle, descStyle);
            console.log('  %cnoclip()%c - Walk through walls', cmdStyle, descStyle);
            console.log('  %cspeed(n)%c - Set move speed (1-6)', cmdStyle, descStyle);
            console.log('');
            console.log('%c▸ Items & Currency', style);
            console.log('  %cgold(amount)%c - Add/remove gold', cmdStyle, descStyle);
            console.log('  %citem(id, amount)%c - Give item', cmdStyle, descStyle);
            console.log('  %cweapon(id, amount)%c - Give weapon', cmdStyle, descStyle);
            console.log('  %carmor(id, amount)%c - Give armor', cmdStyle, descStyle);
            console.log('  %callitems()%c - Give 99 of all items', cmdStyle, descStyle);
            console.log('');
            console.log('%c▸ Party', style);
            console.log('  %caddactor(id)%c - Add actor to party', cmdStyle, descStyle);
            console.log('  %cremoveactor(id)%c - Remove actor', cmdStyle, descStyle);
            console.log('  %clevel(n)%c - Set party level', cmdStyle, descStyle);
            console.log('  %cexp(amount)%c - Add EXP to party', cmdStyle, descStyle);
            console.log('');
            console.log('%c▸ Game State', style);
            console.log('  %csave(slot)%c - Save to slot', cmdStyle, descStyle);
            console.log('  %cload(slot)%c - Load from slot', cmdStyle, descStyle);
            console.log('  %csw(id, value)%c - Toggle/set switch', cmdStyle, descStyle);
            console.log('  %cvari(id, value)%c - Get/set variable', cmdStyle, descStyle);
            console.log('  %cevent(id)%c - List/start event', cmdStyle, descStyle);
            console.log('');
            console.log('%c▸ Debug', style);
            console.log('  %cfps()%c - Toggle FPS counter', cmdStyle, descStyle);
            console.log('  %ccoords()%c - Show current position', cmdStyle, descStyle);
            console.log('  %cmapinfo()%c - Show map info', cmdStyle, descStyle);
            console.log('  %creload()%c - Reload game', cmdStyle, descStyle);
            console.log('');
            console.log('%c▸ Battle', style);
            console.log('  %cencounter(troopId)%c - Start battle', cmdStyle, descStyle);
            console.log('  %cwin()%c - Force win battle', cmdStyle, descStyle);
            console.log('  %cflee()%c - Flee from battle', cmdStyle, descStyle);
            console.log('');
            console.log('%c▸ Utility', style);
            console.log('  %chelp()%c - Show this help', cmdStyle, descStyle);
            console.log('  %chelp("cmd")%c - Help for specific command', cmdStyle, descStyle);
            console.log('  %cscreenshot()%c - Take screenshot', cmdStyle, descStyle);
            console.log('  %chistory()%c - Command history', cmdStyle, descStyle);
            console.log('');
            console.log('%cTip: Just type the function name and press Enter!', 'color: #FF9800; font-style: italic;');
        };
        
        // ═══════════════════════════════════════════════════════════════
        // PLAYER COMMANDS
        // ═══════════════════════════════════════════════════════════════
        
        // Teleport
        window.tp = (a, b, c) => {
            this.addHistory(`tp(${a}, ${b}${c !== undefined ? ', ' + c : ''})`);
            if (!$gamePlayer) return console.error('Player not available');
            
            if (c !== undefined) {
                // tp(mapId, x, y)
                $gamePlayer.reserveTransfer(a, b, c, 2, 0);
                console.log(`Transferring to Map ${a} (${b}, ${c})`);
            } else if (b !== undefined) {
                // tp(x, y)
                $gamePlayer.setPosition(a, b);
                console.log(`Teleported to (${a}, ${b})`);
            } else {
                console.log('Usage: tp(x, y) or tp(mapId, x, y)');
            }
        };
        window.teleport = window.tp;
        window.warp = window.tp;
        
        // Heal
        window.heal = () => {
            this.addHistory('heal()');
            if (!$gameParty) return console.error('Party not available');
            $gameParty.members().forEach(actor => actor.recoverAll());
            console.log('Party fully healed!');
            SoundManager.playRecovery();
        };
        window.recover = window.heal;
        
        // God mode
        window.god = () => {
            this.addHistory('god()');
            if (!$gameParty) return console.error('Party not available');
            $gameParty._godMode = !$gameParty._godMode;
            console.log(`God Mode: ${$gameParty._godMode ? 'ON' : 'OFF'}`);
            
            if ($gameParty._godMode && !Game_Battler.prototype._originalExecuteDamage) {
                Game_Battler.prototype._originalExecuteDamage = Game_Battler.prototype.executeDamage;
                Game_Battler.prototype.executeDamage = function(value) {
                    if ($gameParty._godMode && $gameParty.members().includes(this) && value > 0) return;
                    this._originalExecuteDamage(value);
                };
            }
            return $gameParty._godMode;
        };
        window.godmode = window.god;
        
        // Noclip
        window.noclip = () => {
            this.addHistory('noclip()');
            if (!$gamePlayer) return console.error('Player not available');
            $gamePlayer._through = !$gamePlayer._through;
            console.log(`Noclip: ${$gamePlayer._through ? 'ON' : 'OFF'}`);
            return $gamePlayer._through;
        };
        window.ghost = window.noclip;
        
        // Speed
        window.speed = (n = 4) => {
            this.addHistory(`speed(${n})`);
            if (!$gamePlayer) return console.error('Player not available');
            $gamePlayer.setMoveSpeed(Math.max(1, Math.min(6, n)));
            console.log(`Move speed: ${n}`);
        };
        
        // ═══════════════════════════════════════════════════════════════
        // ITEMS & CURRENCY
        // ═══════════════════════════════════════════════════════════════
        
        // Gold
        window.gold = (amount = 10000) => {
            this.addHistory(`gold(${amount})`);
            if (!$gameParty) return console.error('Party not available');
            if (amount < 0) {
                $gameParty.loseGold(Math.abs(amount));
            } else {
                $gameParty.gainGold(amount);
            }
            console.log(`Gold: ${$gameParty.gold()} (${amount >= 0 ? '+' : ''}${amount})`);
            SoundManager.playShop();
        };
        window.money = window.gold;
        
        // Item
        window.item = (id, amount = 1) => {
            this.addHistory(`item(${id}, ${amount})`);
            if (!$gameParty) return console.error('Party not available');
            if (!id || !$dataItems[id]) {
                console.log('Available items:');
                $dataItems.filter(Boolean).slice(1, 20).forEach(i => console.log(`  ${i.id}: ${i.name}`));
                return;
            }
            $gameParty.gainItem($dataItems[id], amount);
            console.log(`Added ${amount}x ${$dataItems[id].name}`);
            SoundManager.playUseItem();
        };
        
        // Weapon
        window.weapon = (id, amount = 1) => {
            this.addHistory(`weapon(${id}, ${amount})`);
            if (!$gameParty) return console.error('Party not available');
            if (!id || !$dataWeapons[id]) {
                console.log('Available weapons:');
                $dataWeapons.filter(Boolean).slice(1, 20).forEach(w => console.log(`  ${w.id}: ${w.name}`));
                return;
            }
            $gameParty.gainItem($dataWeapons[id], amount);
            console.log(`Added ${amount}x ${$dataWeapons[id].name}`);
            SoundManager.playEquip();
        };
        
        // Armor
        window.armor = (id, amount = 1) => {
            this.addHistory(`armor(${id}, ${amount})`);
            if (!$gameParty) return console.error('Party not available');
            if (!id || !$dataArmors[id]) {
                console.log('Available armors:');
                $dataArmors.filter(Boolean).slice(1, 20).forEach(a => console.log(`  ${a.id}: ${a.name}`));
                return;
            }
            $gameParty.gainItem($dataArmors[id], amount);
            console.log(`Added ${amount}x ${$dataArmors[id].name}`);
            SoundManager.playEquip();
        };
        
        // All items
        window.allitems = () => {
            this.addHistory('allitems()');
            if (!$gameParty) return console.error('Party not available');
            let count = 0;
            $dataItems.filter(Boolean).forEach(i => { $gameParty.gainItem(i, 99); count++; });
            console.log(`Added ${count} items (99 each)`);
        };
        
        // ═══════════════════════════════════════════════════════════════
        // PARTY
        // ═══════════════════════════════════════════════════════════════
        
        // Add actor
        window.addactor = (id) => {
            this.addHistory(`addactor(${id})`);
            if (!$gameParty) return console.error('Party not available');
            if (!id || !$dataActors[id]) {
                console.log('Available actors:');
                $dataActors.filter(Boolean).forEach(a => console.log(`  ${a.id}: ${a.name}`));
                return;
            }
            $gameParty.addActor(id);
            console.log(`Added actor: ${$dataActors[id].name}`);
        };
        
        // Remove actor
        window.removeactor = (id) => {
            this.addHistory(`removeactor(${id})`);
            if (!$gameParty) return console.error('Party not available');
            if (!id) {
                console.log('Current party:');
                $gameParty.members().forEach(a => console.log(`  ${a.actorId()}: ${a.name()}`));
                return;
            }
            $gameParty.removeActor(id);
            console.log(`Removed actor ID: ${id}`);
        };
        
        // Level
        window.level = (n = 99) => {
            this.addHistory(`level(${n})`);
            if (!$gameParty) return console.error('Party not available');
            $gameParty.members().forEach(actor => actor.changeLevel(n, false));
            console.log(`All party members set to level ${n}`);
        };
        window.setlevel = window.level;
        
        // EXP
        window.exp = (amount = 1000) => {
            this.addHistory(`exp(${amount})`);
            if (!$gameParty) return console.error('Party not available');
            $gameParty.members().forEach(actor => actor.gainExp(amount));
            console.log(`Added ${amount} EXP to all party members`);
        };
        
        // ═══════════════════════════════════════════════════════════════
        // GAME STATE
        // ═══════════════════════════════════════════════════════════════
        
        // Save
        window.save = (slot = 1) => {
            this.addHistory(`save(${slot})`);
            $gameSystem.onBeforeSave();
            DataManager.saveGame(slot).then(() => {
                console.log(`Game saved to slot ${slot}`);
                SoundManager.playSave();
            }).catch(err => console.error('Save failed:', err));
        };
        
        // Load
        window.load = (slot = 1) => {
            this.addHistory(`load(${slot})`);
            DataManager.loadGame(slot).then(() => {
                console.log(`Game loaded from slot ${slot}`);
                SoundManager.playLoad();
                SceneManager.goto(Scene_Map);
                $gameSystem.onAfterLoad();
            }).catch(err => console.error('Load failed:', err));
        };
        
        // Switch (renamed to sw to avoid JavaScript reserved word issues)
        window.sw = (id, value) => {
            this.addHistory(`sw(${id}${value !== undefined ? ', ' + value : ''})`);
            if (!$gameSwitches) return console.error('Switches not available');
            if (!id) { console.log('Usage: sw(id) or sw(id, true/false)'); return; }
            
            let newValue;
            if (value === undefined) {
                newValue = !$gameSwitches.value(id);
            } else {
                newValue = !!value;
            }
            $gameSwitches.setValue(id, newValue);
            console.log(`Switch ${id}: ${newValue ? 'ON' : 'OFF'}`);
        };
        window.setswitch = window.sw;
        
        // Variable (renamed to vari to be shorter)
        window.vari = (id, value) => {
            this.addHistory(`vari(${id}${value !== undefined ? ', ' + value : ''})`);
            if (!$gameVariables) return console.error('Variables not available');
            if (!id) { console.log('Usage: vari(id) or vari(id, value)'); return; }
            
            if (value !== undefined) {
                $gameVariables.setValue(id, value);
                console.log(`Variable ${id} = ${value}`);
            } else {
                console.log(`Variable ${id} = ${$gameVariables.value(id)}`);
            }
        };
        window.setvar = window.vari;
        
        // Event
        window.event = (id) => {
            this.addHistory(`event(${id || ''})`);
            if (!$gameMap) return console.error('Map not available');
            if (!id) {
                console.log('Map events:');
                $gameMap.events().forEach(e => console.log(`  ${e.eventId()}: ${e.event().name} at (${e.x}, ${e.y})`));
                return;
            }
            const ev = $gameMap.event(id);
            if (ev) {
                ev.start();
                console.log(`Started event ${id}: ${ev.event().name}`);
            } else {
                console.error(`Event ${id} not found`);
            }
        };
        
        // ═══════════════════════════════════════════════════════════════
        // DEBUG
        // ═══════════════════════════════════════════════════════════════
        
        // FPS
        window.fps = () => {
            this.addHistory('fps()');
            Graphics._switchFPSCounter();
            console.log('FPS counter toggled');
        };
        
        // Coords
        window.coords = () => {
            this.addHistory('coords()');
            if (!$gamePlayer) return console.error('Player not available');
            const mapId = $gameMap.mapId();
            console.log(`Map: ${mapId} (${$dataMapInfos[mapId]?.name || 'Unknown'})`);
            console.log(`Position: (${$gamePlayer.x}, ${$gamePlayer.y})`);
            console.log(`Direction: ${$gamePlayer.direction()}`);
        };
        window.pos = window.coords;
        window.where = window.coords;
        
        // Map info
        window.mapinfo = () => {
            this.addHistory('mapinfo()');
            if (!$gameMap) return console.error('Map not available');
            const mapId = $gameMap.mapId();
            console.log('=== Map Info ===');
            console.log(`ID: ${mapId}`);
            console.log(`Name: ${$dataMapInfos[mapId]?.name || 'Unknown'}`);
            console.log(`Size: ${$dataMap.width} x ${$dataMap.height}`);
            console.log(`Tileset: ${$dataTilesets[$dataMap.tilesetId]?.name || 'Unknown'}`);
            console.log(`Events: ${$gameMap.events().length}`);
            console.log(`BGM: ${$dataMap.bgm?.name || 'None'}`);
        };
        
        // Reload
        window.reload = () => {
            this.addHistory('reload()');
            if (Utils.isNwjs()) {
                location.reload();
            } else {
                console.log('Reload only available in NW.js');
            }
        };
        
        // ═══════════════════════════════════════════════════════════════
        // BATTLE
        // ═══════════════════════════════════════════════════════════════
        
        // Encounter
        window.encounter = (troopId) => {
            this.addHistory(`encounter(${troopId || ''})`);
            if (!$gameMap) return console.error('Map not available');
            if (troopId && $dataTroops[troopId]) {
                BattleManager.setup(troopId, true, false);
                SceneManager.push(Scene_Battle);
                console.log(`Starting battle with troop ${troopId}`);
            } else {
                console.log('Available troops:');
                $dataTroops.filter(Boolean).slice(1, 20).forEach(t => console.log(`  ${t.id}: ${t.name}`));
            }
        };
        window.battle = window.encounter;
        
        // Win
        window.win = () => {
            this.addHistory('win()');
            if (SceneManager._scene instanceof Scene_Battle) {
                BattleManager.forceVictory();
                console.log('Battle won!');
            } else {
                console.log('Not in battle');
            }
        };
        window.victory = window.win;
        
        // Flee
        window.flee = () => {
            this.addHistory('flee()');
            if (SceneManager._scene instanceof Scene_Battle) {
                BattleManager.forceAbort();
                console.log('Fled from battle!');
            } else {
                console.log('Not in battle');
            }
        };
        window.escape = window.flee;
        
        // ═══════════════════════════════════════════════════════════════
        // UTILITY
        // ═══════════════════════════════════════════════════════════════
        
        // Screenshot
        window.screenshot = () => {
            this.addHistory('screenshot()');
            if (Utils.isNwjs()) {
                const fs = require('fs');
                const path = require('path');
                const projectPath = path.dirname(require.main.filename);
                const screenshotPath = path.join(projectPath, 'screenshots');
                
                if (!fs.existsSync(screenshotPath)) {
                    fs.mkdirSync(screenshotPath, { recursive: true });
                }
                
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = path.join(screenshotPath, `screenshot_${timestamp}.png`);
                
                Graphics._canvas.toBlob((blob) => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        fs.writeFileSync(filename, reader.result.split(',')[1], 'base64');
                        console.log('Screenshot saved:', filename);
                        SoundManager.playSave();
                    };
                    reader.readAsDataURL(blob);
                }, 'image/png');
            } else {
                console.log('Screenshots only available in NW.js');
            }
        };
        window.ss = window.screenshot;
        window.capture = window.screenshot;
        
        // History
        window.history = () => {
            if (this._history.length === 0) {
                console.log('No command history');
                return;
            }
            console.log('Command history:');
            this._history.slice(-10).forEach((cmd, i) => console.log(`  ${i + 1}. ${cmd}`));
        };
        
        // Clear (alias for console.clear)
        window.cls = () => {
            console.clear();
            console.log('%c🎮 Console cleared. Type help() for commands.', 
                'background: #000; color: white; padding: 5px; border-radius: 3px;');
        };
    }
};

(() => {
    'use strict';
    const script = document.currentScript;
    const param  = PluginManagerEx.createParameter(script);
    if (!param.ShortcutList) {
        param.ShortcutList = [];
    }
    
    // Cache frequently accessed values
    const RAPID_SPEED = param.RapidSpeed || 2;
    const SLOW_SPEED = param.SlowSpeed || 2;
    const USE_RELOAD = param.UseReloadData;
    const MENU_VISIBLE = param.MenuBarVisible;
    const CLICK_MENU = param.ClickMenu;

    //=============================================================================
    // Graphics
    //  FPSの表示を設定します。
    //=============================================================================
    const _fpsStyles = {
        header: 'background: #222; color: #bada55; padding: 5px; border-radius: 3px;',
        version: 'color: #4CAF50; font-weight: bold',
        versionBlue: 'color: #2196F3; font-weight: bold',
        versionOrange: 'color: #FF9800; font-weight: bold',
        userAgent: 'color: #9E9E9E; font-size: 10px;',
        memory: 'color: #00BCD4'
    };
    
    Graphics.setFPSMeter = function(type) {
        switch (type) {
            case 'FPS':
                this._switchFPSCounter();
                break;
            case 'MS':
                this._switchFPSCounter();
                this._switchFPSCounter();
                break;
        }
    };

    const _Graphics__createAllElements = Graphics._createAllElements;
    Graphics._createAllElements        = function() {
        _Graphics__createAllElements.apply(this, arguments);
        if (param.OutputStartupInfo) {
            this.outputStartUpLog();
        }
        if (this._createDevToolInfo) {
            this._createDevToolInfo();
        }
    };

    Graphics.outputStartUpLog = function() {
        const style = _fpsStyles.header;
        console.log('%c********************************', style);
        console.log('%c***   Core Version           ***', style);
        console.log('%c********************************', style);
        console.log('RPG Maker Name    : %c' + Utils.RPGMAKER_NAME, _fpsStyles.version);
        console.log('RPG Maker Version : %c' + Utils.RPGMAKER_VERSION, _fpsStyles.versionBlue);
        console.log('RPG Maker Engine  : %c' + (Utils.RPGMAKER_ENGINE || 'Official Version'), _fpsStyles.versionOrange);
        console.log('%c********************************', style);
        console.log('%c***   User Agent             ***', style);
        console.log('%c********************************', style);
        console.log('%c' + navigator.userAgent, _fpsStyles.userAgent);
        console.log('%c********************************', style);
        
        // Add performance info
        const memory = performance?.memory;
        if (memory) {
            console.log('%c***   Performance Info       ***', style);
            console.log('Memory Limit: %c' + ((memory.jsHeapSizeLimit / 1048576) | 0) + ' MB', _fpsStyles.memory);
        }
    };

    // Disable subsequent features unless in test play
    const isTestPlay = Utils.isOptionValid('test') || DataManager.isBattleTest();
    if (!isTestPlay) {
        console.log(PluginManagerEx.findPluginName(script) + ' is valid only test play!');
        return;
    }
    
    // Initialize DevConsole for test play
    DevConsole.init();

    Graphics._createDevToolInfo = function() {
        const div            = document.createElement('div');
        div.id               = 'devTool';
        
        // Use cssText for better performance (single style recalc)
        div.style.cssText = 'display:none;position:absolute;left:100px;top:5px;background:#222;opacity:0.8;z-index:8;color:#fff;padding:2px 6px;border-radius:3px;font-size:12px;';
        
        this._devToolDiv     = div;
        document.body.appendChild(div);
    };

    Graphics.drawDevToolInfo = function(text) {
        const div = this._devToolDiv;
        if (text) {
            div.style.display = 'block';
            let displayText = text;
            
            // Add memory info if enabled (with optional chaining)
            const memInfo = SceneManager._nwWindow?.getMemoryInfo();
            if (param.ShowMemoryUsage && memInfo) {
                displayText += ' | ' + memInfo;
            }
            
            div.textContent = displayText;
        } else {
            div.style.display = 'none';
        }
    };

    // Cached tip shown flag
    let _shownSourceMapTip = false;
    
    SceneManager.showSourceMapTip = function() {
        if (_shownSourceMapTip) return;
        _shownSourceMapTip = true;
        
        const style = 'background: #ff9800; color: white; padding: 5px; font-weight: bold;';
        const tipStyle = 'color: #2196F3';
        console.log('%c💡 TIP: To disable SourceMap warnings permanently:', style);
        console.log('%c1. Open DevTools Settings (F1 or click gear icon)', tipStyle);
        console.log('%c2. Uncheck "Enable JavaScript source maps"', tipStyle);
        console.log('%c3. Uncheck "Enable CSS source maps"', tipStyle);
    };

    //=============================================================================
    // SceneManager
    //  Automatically controls developer tools based on the situation.
    //=============================================================================
    const _SceneManager_initialize = SceneManager.initialize;
    SceneManager.initialize        = function() {
        _SceneManager_initialize.apply(this, arguments);
        this.initDevCommand();
        Graphics.setFPSMeter(param.ShowFPS);
        if (!Utils.isNwjs()) {
            return;
        }
        this._freeze   = false;
        this._nwWindow = new GameNwWindow();
        if (param.StartupOnTop || Utils.isOptionValid('onTop')) {
            this.setInitAlwaysOnTop();
        }
    };

    SceneManager.setInitAlwaysOnTop = function() {
        const shortCut = this.findShortCut('AlwaysOnTop');
        if (shortCut) {
            shortCut.execute();
        } else {
            this._nwWindow.toggleAlwaysOnTop();
        }
    };

    const _SceneManager_terminate = SceneManager.terminate;
    SceneManager.terminate        = function() {
        if (this._nwWindow) {
            this._nwWindow.cleanup();
        }
        _SceneManager_terminate.apply(this, arguments);
    };

    SceneManager.setInitRapid = function() {
        const shortCut = this.findShortCut('ToggleRapid');
        if (shortCut) {
            shortCut.execute();
        } else {
            this.toggleRapid();
        }
    };

    SceneManager.findShortCut = function(id) {
        return this._commandList.filter(command => command.isTypeEqual(id))[0];
    };

    SceneManager.initDevCommand = function() {
        const commandList = param.ShortcutList.map(item => {
            return new ShortCutCommand(item, item.Command);
        });
        if (SceneManager.takeCapture) {
            commandList.push(new ShortCutCommand(null, 'Capture'));
        }
        if (SceneManager.onKeyDownForScreenMovie) {
            commandList.push(new ShortCutCommand(null, 'Record'));
        }
        this._commandList = commandList;
    };

    SceneManager.iterateCommandList = function(callBack) {
        this._commandList.forEach(command => callBack(command));
    };

    SceneManager.getNwWindow = function() {
        return this._nwWindow;
    };

    SceneManager.toggleAlwaysOnTop = function() {
        this._nwWindow.toggleAlwaysOnTop();
        this.drawDevToolInfo();
        return this._nwWindow.isOnTop();
    };

    SceneManager.toggleFreeze = function() {
        Input.clear();
        this._freeze = !this._freeze;
        this.drawDevToolInfo();
        return this._freeze;
    };

    SceneManager.toggleRapid = function() {
        if (!this.isSlow()) {
            this._rapid = !this._rapid;
            this.drawDevToolInfo();
        }
        return this._rapid;
    };

    SceneManager.toggleSlow = function() {
        if (!this.isRapid()) {
            this._slow = !this._slow;
            this.drawDevToolInfo();
        }
        return this._slow;
    };

    SceneManager.openProject = function() {
        this._nwWindow.openProject();
    };

    SceneManager.drawDevToolInfo = function() {
        let text = '';
        if (this._nwWindow.isOnTop()) {
            text += 'Always on top [ON] ';
        }
        if (this._freeze) {
            text += 'Freeze [ON] ';
        }
        if (this.isRapid()) {
            text += 'Rapid [ON] ';
        } else if (this.isSlow()) {
            text += 'Slow [ON] ';
        }
        Graphics.drawDevToolInfo(text);
    };

    const _SceneManager_catchException = SceneManager.catchException;
    SceneManager.catchException        = function(e) {
        if (this._nwWindow) this._nwWindow.showDevTools(false);
        _SceneManager_catchException.apply(this, arguments);
    };

    const _SceneManager_onError = SceneManager.onError;
    SceneManager.onError        = function(e) {
        if (this._nwWindow) this._nwWindow.showDevTools(false);
        _SceneManager_onError.apply(this, arguments);
    };

    const _SceneManager_onKeyDown = SceneManager.onKeyDown;
    SceneManager.onKeyDown        = function(event) {
        _SceneManager_onKeyDown.apply(this, arguments);
        this.onKeyDownForDevToolManage(event);
    };

    SceneManager.onKeyDownForDevToolManage = function(event) {
        this.iterateCommandList(command => command.onKeyDown(event));
    };

    SceneManager.isRapid = function() {
        return !!this._rapid;
    };

    SceneManager.isSlow = function() {
        return !!this._slow;
    };

    const _SceneManager_initNwjs = SceneManager.initNwjs;
    SceneManager.initNwjs        = function() {
        _SceneManager_initNwjs.apply(this, arguments);
        if (Utils.isNwjs()) {
            this.addMenuBar();
            this.suppressSourceMapWarnings();
        }
    };

    SceneManager.suppressSourceMapWarnings = function() {
        // Suppress annoying SourceMap and WebGL warnings in DevTools
        const originalWarn = console.warn;
        const originalError = console.error;
        
        console.warn = function(...args) {
            const message = args.join(' ');
            if (message.includes('DevTools failed to load SourceMap') ||
                message.includes('Could not load content for') ||
                message.includes('ERR_FILE_NOT_FOUND') ||
                message.includes('chrome-extension://')) {
                return; // Suppress these specific warnings
            }
            originalWarn.apply(console, args);
        };
        
        console.error = function(...args) {
            const message = args.join(' ');
            // Suppress WebGL feedback loop and invalid operation errors (common in PIXI.js)
            if (message.includes('GL_INVALID_OPERATION') ||
                message.includes('Feedback loop formed') ||
                message.includes('Object cannot be used because it has not been generated') ||
                message.includes('[.WebGL-')) {
                return; // Suppress WebGL errors
            }
            originalError.apply(console, args);
        };
    };

    SceneManager.addMenuBar = function() {
        if (!MENU_VISIBLE) {
            this._needAdjustScreen = false;
            return;
        }
        const gameWindow = nw.Window.get();
        if (!gameWindow.menu || gameWindow.menu.type !== 'menubar') {
            this._needAdjustScreen = true;
        }
        gameWindow.menu = new nw.Menu({type: 'menubar'});
    };

    const _SceneManager_run = SceneManager.run;
    SceneManager.run        = function(sceneClass) {
        _SceneManager_run.apply(this, arguments);
        this.setWindowSizeForMenuBar();
    };

    SceneManager.setWindowSizeForMenuBar = function() {
        if (!this._needAdjustScreen) {
            return;
        }
        const gameWindow = nw.Window.get();
        setTimeout(() => { // Fix missing menu bar height
            const style_height = parseInt(Graphics._canvas.style.height, 10);
            const height_diff  = SceneManager._screenHeight - style_height;
            if (height_diff !== 0) {
                gameWindow.moveBy(0, -height_diff);
                gameWindow.resizeBy(0, height_diff);
            }
        }, 100);
    };

    SceneManager._slowCounter = 0.0;
    const _SceneManager_determineRepeatNumber = SceneManager.determineRepeatNumber;
    SceneManager.determineRepeatNumber = function(deltaTime) {
        const result = _SceneManager_determineRepeatNumber.apply(this, arguments);
        if (this._scene && this._scene.isAnyWindowActive()) {
            return result;
        }
        if (this.isSlow() && result >= 1 && this._slowCounter < 1.0) {
            this._slowCounter += (1 / SLOW_SPEED);
            return 0;
        } else {
            this._slowCounter = 0.0;
            return this.isRapid() ? result * RAPID_SPEED : result;
        }
    };

    const _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene        = function() {
        this.updateScript();
        if (USE_RELOAD) {
            this.updateDataReload();
        }
        if (this._freeze || this.isReloading()) {
            return;
        }
        _SceneManager_updateScene.apply(this, arguments);
    };

    SceneManager.isUseReload = function() {
        return USE_RELOAD && !DataManager.isBattleTest() &&
            !DataManager.isEventTest() && Utils.isNwjs();
    };

    SceneManager.updateScript = function() {
        this.iterateCommandList(command => command.updateScriptIfNeed());
    };

    SceneManager.updateDataReload = function() {
        if (this.getNwWindow().isOnFocus() && !this._reloadGenerator) {
            this._reloadGenerator = this.reloadGenerator();
        }
        if (this._reloadGenerator && DataManager.isDatabaseLoaded()) {
            if (!this._reloadGenerator.next().value) {
                this._reloadGenerator = null;
                // Resolve conflict for DynamicDatabase.js
                if (typeof DynamicDatabaseManager !== 'undefined') {
                    DynamicDatabaseManager.makeDynamicDatabase();
                }
            }
        }
    };

    SceneManager.reloadGenerator = function* () {
        this._preVersionId = $dataSystem.versionId;
        DataManager.reloadSystemData();
        yield true;
        
        if (this._preVersionId !== $dataSystem.versionId) {
            // Create backup before reload
            if (param.AutoBackup && this._nwWindow) {
                this._nwWindow.createBackup();
            }
            
            this.reloadMapData();
            DataManager.loadDatabase();
            console.log('Database Reloaded - Version:', $dataSystem.versionId);
            yield true;
        }
        return false;
    };

    SceneManager.reloadMapData = function() {
        if (this._scene instanceof Scene_Map && $gamePlayer.canMove()) {
            $gamePlayer.reserveTransfer(
                $gameMap.mapId(), $gamePlayer.x, $gamePlayer.y, $gamePlayer.direction(), 2);
            $gamePlayer.requestMapReload();
            console.log('Map Reload');
        }
    };

    SceneManager.isReloading = function() {
        return !!this._reloadGenerator;
    };

    SceneManager.isCurrentScene = function(sceneClass) {
        return this._scene && this._scene.constructor === sceneClass;
    };

    class ShortCutCommand {
        // Static command definitions (shared across all instances)
        static COMMANDS = {
            AlwaysOnTop  : {name: 'Bring to Front (最前面に表示)', type: 'checkbox'},
            ToggleRapid  : {name: 'High Speed Toggle (高速化)', type: 'checkbox'},
            ToggleSlow   : {name: 'Low Speed Toggle (低速化)', type: 'checkbox'},
            ForceVictory : {name: 'Force Victory (強制勝利)', type: 'normal'},
            ExecuteScript: {name: 'Execute Script (常駐スクリプト)', type: 'normal'},
            Freeze       : {name: 'Freeze Screen (画面フリーズ)', type: 'checkbox'},
            ForceDefeat  : {name: 'Force Defeat (強制敗北)', type: 'normal'},
            ForceAbort   : {name: 'Force Abort (強制中断)', type: 'normal'},
            OpenProject  : {name: 'Open Project (プロジェクトを開く)', type: 'normal'},
            Capture      : {name: 'Capture (キャプチャ)', type: 'normal'},
            Record       : {name: 'Record (録画)', type: 'normal'},
            Screenshot   : {name: 'Screenshot (スクリーンショット)', type: 'normal'},
            Backup       : {name: 'Backup (バックアップ作成)', type: 'normal'}
        };
        
        constructor(shortcut, id) {
            this._command  = ShortCutCommand.COMMANDS[id];
            this._id       = id;
            this._shortcut = shortcut;
            this._contextMenu = null;
            this._lastScriptString = null;
            this._lastScriptResult = null;
        }

        isTypeEqual(id) {
            return this._id === id;
        }

        onKeyDown(event) {
            const shortcut = this._shortcut;
            if (!shortcut) return;
            if (event.key !== shortcut.HotKey) return;
            if (event.ctrlKey !== shortcut.Ctrl) return;
            if (event.altKey !== shortcut.Alt) return;
            this.execute();
        }

        createHotKeyText() {
            const shortcut = this._shortcut;
            if (!shortcut?.HotKey) return '';
            const ctrl = shortcut.Ctrl ? 'Ctrl+' : '';
            const alt  = shortcut.Alt ? 'Alt+' : '';
            return `(${ctrl}${alt}${shortcut.HotKey})`;
        }

        appendNwMenu(menuObject) {
            const menuItem = new nw.MenuItem({
                label: this._command.name + this.createHotKeyText(),
                type : this._command.type,
            });
            if (menuObject.type === 'contextmenu') {
                this._contextMenu = menuItem;
            }
            menuItem.click = this.execute.bind(this, true);
            menuObject.append(menuItem);
        }

        execute(fromClick = false) {
            const result = this[`execute${this._id}`]();
            if (fromClick) {
                SoundManager.playCursor();
            }
            this.setCheck(result);
        }

        setCheck(value) {
            if (this._command.type === 'checkbox' && this._contextMenu) {
                this._contextMenu.checked = value;
            }
        }

        executeAlwaysOnTop() {
            return SceneManager.toggleAlwaysOnTop();
        }

        executeToggleRapid() {
            return SceneManager.toggleRapid();
        }

        executeToggleSlow() {
            return SceneManager.toggleSlow();
        }

        executeFreeze() {
            return SceneManager.toggleFreeze();
        }

        executeForceVictory() {
            BattleManager.forceVictory();
        }

        executeForceDefeat() {
            BattleManager.forceDefect();
        }

        executeForceAbort() {
            BattleManager.forceAbort();
        }

        executeOpenProject() {
            SceneManager.openProject();
        }

        executeCapture() {
            SceneManager.takeCapture();
        }

        executeRecord() {
            return SceneManager._screenRecorder.toggle();
        }

        executeScreenshot() {
            if (Utils.isNwjs()) {
                const fs = require('fs');
                const path = require('path');
                const projectPath = path.dirname(require.main.filename);
                const screenshotPath = path.join(projectPath, 'screenshots');
                
                if (!fs.existsSync(screenshotPath)) {
                    fs.mkdirSync(screenshotPath, { recursive: true });
                }
                
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = path.join(screenshotPath, `screenshot_${timestamp}.png`);
                
                Graphics.snapForBackground();
                
                // Use requestAnimationFrame for better timing
                requestAnimationFrame(() => {
                    const canvas = Graphics._canvas;
                    canvas.toBlob((blob) => {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                            const base64 = reader.result.split(',')[1];
                            fs.writeFileSync(filename, base64, 'base64');
                            console.log('Screenshot saved:', filename);
                            SoundManager.playSave();
                        };
                        reader.readAsDataURL(blob);
                    }, 'image/png');
                });
            }
        }

        executeBackup() {
            if (SceneManager._nwWindow) {
                SceneManager._nwWindow.createBackup();
                SoundManager.playSave();
            }
        }

        executeExecuteScript() {
            const promptValue  = 'Enter the script you want to run as a resident program. (常駐実行したいスクリプトを入力してください。)';
            const nwWindow     = SceneManager.getNwWindow();
            const scriptString = window.prompt(promptValue, nwWindow.readClipboard());
            if (scriptString !== null && scriptString !== '') {
                nwWindow.showDevTools();
                nwWindow.writeClipboard(scriptString);
                this.updateScript(scriptString);
                this._lastScriptString = scriptString;
            }
        }

        updateScript(scriptString) {
            let result = null;
            try {
                result = eval(scriptString);
                if (!this._lastScriptString) {
                    SoundManager.playOk();
                    console.log('Execute Script : ' + scriptString);
                }
            } catch (e) {
                if (!this._lastScriptString) {
                    SoundManager.playBuzzer();
                    console.log('Error Script : ' + scriptString);
                    console.error(e.stack);
                }
                result = e.toString();
            }
            if (!this._lastScriptString || result !== this._lastScriptResult) {
                console.log(result);
            }
            this._lastScriptResult = result;
        }

        updateScriptIfNeed() {
            if (this._lastScriptString) {
                this.updateScript(this._lastScriptString);
            }
        }
    }

    //=============================================================================
    // BattleManager
    //  強制勝利を追加定義します。
    //=============================================================================
    BattleManager.forceVictory = function() {
        if (this.canExecuteBattleEndProcess()) {
            $gameTroop.members().forEach(function(enemy) {
                enemy.addNewState(enemy.deathStateId());
            });
            this.processVictory();
        }
    };

    BattleManager.forceDefect = function() {
        if (this.canExecuteBattleEndProcess()) {
            $gameParty.members().forEach(function(actor) {
                actor.addNewState(actor.deathStateId());
            });
            this.processDefeat();
        }
    };

    BattleManager.forceAbort = function() {
        if (this.canExecuteBattleEndProcess()) {
            $gameParty.performEscape();
            SoundManager.playEscape();
            this.displayEscapeSuccessMessage();
            this._escaped = true;
            this.processAbort();
        }
    };

    BattleManager.canExecuteBattleEndProcess = function() {
        return SceneManager.isCurrentScene(Scene_Battle) && this._phase !== 'battleEnd';
    };

    //=============================================================================
    // DataManager
    //  外部エディタから戦闘テストの実行を可能にします。
    //=============================================================================
    const _DataManager_loadDatabase = DataManager.loadDatabase;
    DataManager.loadDatabase        = function() {
        if (this.isNeedSuppressBtest()) {
            this._suppressBattleTest = true;
        }
        _DataManager_loadDatabase.apply(this, arguments);
        this._suppressBattleTest = false;
    };

    const _DataManager_isBattleTest = DataManager.isBattleTest;
    DataManager.isBattleTest        = function() {
        return this._suppressBattleTest ? false : _DataManager_isBattleTest.apply(this, arguments);
    };

    DataManager.isNeedSuppressBtest = function() {
        if (!this.isBattleTest()) {
            return false;
        }
        if (Utils.isNwjs()) {
            return this._databaseFiles.every(function(databaseFile) {
                return !StorageManager.isExistTestData(databaseFile.src);
            });
        } else {
            return true;
        }
    };

    DataManager.reloadSystemData = function() {
        const data = this._databaseFiles.filter(file => file.name === '$dataSystem')[0];
        this.loadDataFile(data.name, data.src);
    };

    StorageManager.isExistTestData = function(fileName) {
        const fs = require('fs');
        const path = require('path');
        const filePath = path.join(path.dirname(require.main.filename), 'data/Test_' + fileName);
        return fs.existsSync(filePath);
    };

    Scene_Base.prototype.isAnyWindowActive = function() {
        if (this._windowLayer) {
            return this._windowLayer.children.some(win => {
                return win instanceof Window_Selectable && win.active;
            });
        } else {
            return false;
        }
    };

    //=============================================================================
    // Scene_Boot
    //  Skip the title screen and go to the map screen.
    //=============================================================================
    const _Scene_Boot_start    = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.apply(this, arguments);
        if (param.RapidStart) {
            SceneManager.setInitRapid();
        }
        this.cutSceneTitle();
    };

    Scene_Boot.prototype.cutSceneTitle = function() {
        if (DataManager.isBattleTest() || DataManager.isEventTest()) {
            return;
        }
        switch (param.CutTitle) {
            case 1:
                this.goToNewGame();
                break;
            case 2:
                const result = this.goToLatestContinue();
                if (!result) {
                    this.goToNewGame();
                }
                break;
        }
    };

    Scene_Boot.prototype.goToNewGame = function() {
        DataManager.setupNewGame();
        SceneManager.goto(Scene_Map);
    };

    Scene_Boot.prototype.goToLatestContinue = function() {
        if (DataManager.isAnySavefileExists()) {
            DataManager.loadGame(DataManager.latestSavefileId()).then(() => {
                SceneManager.goto(Scene_Map);
                $gameSystem.onAfterLoad();
            });
            return true;
        } else {
            return false;
        }
    };
    Scene_Boot.prototype.reloadMapIfUpdated = Scene_Load.prototype.reloadMapIfUpdated;

    const _Scene_Load_reloadMapIfUpdated = Scene_Load.prototype.reloadMapIfUpdated;
    Scene_Load.prototype.reloadMapIfUpdated = function() {
        _Scene_Load_reloadMapIfUpdated.apply(this, arguments);
        if ($gameSystem.versionId() !== $dataSystem.versionId) {
            $gameMap.clearEventErase();
        }
    };

    //=============================================================================
    // Window_Message
    //  It provides faster messaging.
    //=============================================================================
    if (!param.InvalidMessageSkip) {
        const _Window_Message_isTriggered    = Window_Message.prototype.isTriggered;
        Window_Message.prototype.isTriggered = function() {
            return _Window_Message_isTriggered.apply(this, arguments) || SceneManager.isRapid();
        };

        const _Window_Message_startPause    = Window_Message.prototype.startPause;
        Window_Message.prototype.startPause = function() {
            _Window_Message_startPause.apply(this, arguments);
            if (SceneManager.isRapid()) {
                this.startWait(1);
            }
        };
    }

    const _Game_Map_eraseEvent    = Game_Map.prototype.eraseEvent;
    Game_Map.prototype.eraseEvent = function(eventId) {
        _Game_Map_eraseEvent.apply(this, arguments);
        this._eraseEvents.push(eventId);
    };

    const _Game_Map_setupEvents    = Game_Map.prototype.setupEvents;
    Game_Map.prototype.setupEvents = function() {
        _Game_Map_setupEvents.apply(this, arguments);
        if (this._eraseEvents && $gamePlayer.isNeedMapReload()) {
            this.restoreEventErase();
        } else {
            this.clearEventErase();
        }
    };

    Game_Map.prototype.restoreEventErase = function() {
        this._eraseEvents.forEach(eventId => {
            if (this._events[eventId]) {
                this._events[eventId].erase();
            }
        });
    };

    Game_Map.prototype.clearEventErase = function() {
        this._eraseEvents = [];
    };

    Game_Player.prototype.isNeedMapReload = function() {
        return this._needsMapReload;
    };

    //=============================================================================
    // Controller_NwJs
    //  Manages API calls in Nw.js.
    //=============================================================================
class GameNwWindow {
        constructor() {
            this._onFocus   = false;
            this._menuBar   = new nw.Menu({type: 'menubar'});
            this._menuClick = null;
            this._onTop     = false;
            this._windowState = 'normal';
            this._clickHandler = null;
            this._focusHandler = null;
            this._blurHandler = null;
            this._closeHandler = null;
            this._performanceMonitor = {
                memory: [],
                interval: null
            };
            this.initSetting();
        }

        initSetting() {
            this.addEventListener();
            if (MENU_VISIBLE) {
                this.makeMenu(this._menuBar);
                this.setMenuBar(this._menuBar);
            }
            this.initClickMenu();
            
            if (this.isStartUpDevTool()) {
                this.showDevTools();
            }
            this.setupModernFeatures();
        }

        setupModernFeatures() {
            // Add window state tracking
            const win = this.getWindow();
            win.on('minimize', () => this._windowState = 'minimized');
            win.on('maximize', () => this._windowState = 'maximized');
            win.on('restore', () => this._windowState = 'normal');
            
            // Performance monitoring
            if (param.ShowMemoryUsage) {
                this.startPerformanceMonitoring();
            }
        }

        startPerformanceMonitoring() {
            this._performanceMonitor.interval = setInterval(() => {
                if (typeof performance !== 'undefined' && performance.memory) {
                    const memory = performance.memory;
                    this._performanceMonitor.memory.push({
                        used: Math.round(memory.usedJSHeapSize / 1048576),
                        total: Math.round(memory.totalJSHeapSize / 1048576),
                        limit: Math.round(memory.jsHeapSizeLimit / 1048576)
                    });
                    if (this._performanceMonitor.memory.length > 60) {
                        this._performanceMonitor.memory.shift();
                    }
                }
            }, 1000);
        }

        getMemoryInfo() {
            const latest = this._performanceMonitor.memory[this._performanceMonitor.memory.length - 1];
            return latest ? `Mem: ${latest.used}/${latest.limit}MB` : '';
        }

        isStartUpDevTool() {
            return param.StartupDevTool && !Utils.isOptionValid('devToolOff');
        }

        openProject() {
            const { exec } = require('child_process');
            const path = require('path');
            const projectPath = path.dirname(require.main.filename);
            
            // Modern cross-platform file opening
            const commands = {
                'win32': `start "" "${projectPath}"`,
                'darwin': `open "${projectPath}"`,
                'linux': `xdg-open "${projectPath}"`
            };
            
            const command = commands[process.platform] || commands['linux'];
            
            exec(command, (error) => {
                if (error) {
                    console.error('Failed to open project folder:', error);
                }
            });
        }

        initClickMenu() {
            this._menuClick = new nw.Menu();
            this.makeMenu(this._menuClick);
        }

        makeMenu(menuObject) {
            SceneManager.iterateCommandList(command => command.appendNwMenu(menuObject));
        }

        setMenuBar(menu) {
            this.getWindow().menu = menu;
        }

        isOnFocus() {
            const focus   = this._onFocus;
            this._onFocus = false;
            return focus;
        }

        addEventListener() {
            // Modern event handling with better performance
            this._clickHandler = (event) => {
                if (event.button === CLICK_MENU) {
                    event.preventDefault();
                    this._menuClick.popup(event.pageX, event.pageY);
                }
            };
            document.addEventListener('mousedown', this._clickHandler, { passive: false });
            
            const currentWin = this.getWindow();
            currentWin.removeAllListeners('focus');
            currentWin.removeAllListeners('blur');
            currentWin.removeAllListeners('close');
            
            this._focusHandler = () => {
                this._onFocus = true;
            };
            currentWin.on('focus', this._focusHandler);
            
            // Add blur handler for better state tracking
            this._blurHandler = () => {
                // Optional: could add auto-pause feature here
            };
            currentWin.on('blur', this._blurHandler);
            
            // Add close handler for cleanup
            this._closeHandler = () => {
                this.cleanup();
            };
            currentWin.on('close', this._closeHandler);
        }

        getWindow() {
            return nw.Window.get();
        }

        getClipboard() {
            return nw.Clipboard.get();
        }

        toggleAlwaysOnTop() {
            this._onTop = !this._onTop;
            this.getWindow().setAlwaysOnTop(this._onTop);
            return this._onTop;
        }

        isOnTop() {
            return this._onTop;
        }

        showDevTools() {
            const win = this.getWindow();
            win.showDevTools();
            
            // Show tip about disabling source maps
            SceneManager.showSourceMapTip();
            
            requestAnimationFrame(() => {
                setTimeout(() => {
                    win.focus();
                }, 500);
            });
        }

        readClipboard() {
            return this.getClipboard().get('text');
        }

        writeClipboard(copyValue) {
            this.getClipboard().set(copyValue, 'text');
        }

        // New method for window state management
        getWindowState() {
            return this._windowState;
        }

        // New method for creating backups
        createBackup() {
            if (!param.AutoBackup) return;
            
            const fs = require('fs');
            const path = require('path');
            
            // Get project path with fallbacks for different NW.js contexts
            let projectPath;
            if (require.main && require.main.filename) {
                projectPath = path.dirname(require.main.filename);
            } else if (typeof nw !== 'undefined' && nw.App && nw.App.startPath) {
                projectPath = nw.App.startPath;
            } else if (process && process.cwd) {
                projectPath = process.cwd();
            } else {
                console.warn('DevToolsManage: Unable to determine project path for backup');
                return;
            }
            
            const backupPath = path.join(projectPath, 'backups');
            
            try {
                if (!fs.existsSync(backupPath)) {
                    fs.mkdirSync(backupPath, { recursive: true });
                }
                
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const backupFolder = path.join(backupPath, `backup_${timestamp}`);
                
                // Modern recursive copy (Node.js 16.7.0+)
                const srcPath = path.join(projectPath, 'data');
                const destPath = path.join(backupFolder, 'data');
                
                if (fs.cpSync) {
                    fs.cpSync(srcPath, destPath, { recursive: true });
                } else {
                    // Fallback for older Node versions
                    this.copyFolderSync(srcPath, destPath);
                }
                
                console.log('Backup created:', backupFolder);
                this.cleanOldBackups(backupPath);
            } catch (error) {
                console.error('Backup failed:', error);
            }
        }

        copyFolderSync(src, dest) {
            const fs = require('fs');
            const path = require('path');
            
            if (!fs.existsSync(dest)) {
                fs.mkdirSync(dest, { recursive: true });
            }
            
            const files = fs.readdirSync(src);
            files.forEach(file => {
                const srcPath = path.join(src, file);
                const destPath = path.join(dest, file);
                
                if (fs.statSync(srcPath).isDirectory()) {
                    this.copyFolderSync(srcPath, destPath);
                } else {
                    fs.copyFileSync(srcPath, destPath);
                }
            });
        }

        cleanOldBackups(backupPath) {
            const maxBackups = param.MaxBackups;
            if (maxBackups <= 0) return;
            
            const fs = require('fs');
            const path = require('path');
            
            try {
                const backups = fs.readdirSync(backupPath)
                    .filter(f => f.startsWith('backup_'))
                    .map(f => {
                        const fullPath = path.join(backupPath, f);
                        return {
                            name: f,
                            path: fullPath,
                            time: fs.statSync(fullPath).mtime.getTime()
                        };
                    })
                    .sort((a, b) => b.time - a.time);
                
                // Remove excess backups
                const toDelete = backups.slice(maxBackups);
                for (const old of toDelete) {
                    this.deleteFolderRecursive(old.path);
                    console.log('Deleted old backup:', old.name);
                }
            } catch (error) {
                console.error('Failed to clean old backups:', error);
            }
        }

        deleteFolderRecursive(folderPath) {
            const fs = require('fs');
            
            if (fs.existsSync(folderPath)) {
                // Use modern recursive removal (Node.js 14.14.0+)
                fs.rmSync(folderPath, { recursive: true, force: true });
            }
        }

        cleanup() {
            try {
                // Clean up event listeners
                if (this._clickHandler) {
                    document.removeEventListener('mousedown', this._clickHandler);
                    this._clickHandler = null;
                }
                
                const currentWin = this.getWindow();
                if (currentWin) {
                    // Use optional chaining for safer cleanup
                    this._focusHandler && currentWin.removeListener('focus', this._focusHandler);
                    this._blurHandler && currentWin.removeListener('blur', this._blurHandler);
                    this._closeHandler && currentWin.removeListener('close', this._closeHandler);
                }
                
                this._focusHandler = null;
                this._blurHandler = null;
                this._closeHandler = null;
                
                // Clean up performance monitoring
                if (this._performanceMonitor?.interval) {
                    clearInterval(this._performanceMonitor.interval);
                    this._performanceMonitor.interval = null;
                }
                
                // Clear performance data
                if (this._performanceMonitor) {
                    this._performanceMonitor.memory = [];
                }
                
                // Clear menu references
                this._menuBar = null;
                this._menuClick = null;
                
                console.log('GameNwWindow cleanup complete');
            } catch (error) {
                console.error('Cleanup error:', error);
            }
        }
    }
})();
