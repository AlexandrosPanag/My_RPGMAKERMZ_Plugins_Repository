//=============================================================================
// DevToolsManage.js
// ----------------------------------------------------------------------------
// Original Author: (C)2020 Triacontane
// Modified by: Alexandros Panagiotakopoulos (2025)
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version

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

(() => {
    'use strict';
    const script = document.currentScript;
    const param  = PluginManagerEx.createParameter(script);
    if (!param.ShortcutList) {
        param.ShortcutList = [];
    }

    //=============================================================================
    // Graphics
    //  FPSの表示を設定します。
    //=============================================================================
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
        const style = 'background: #222; color: #bada55; padding: 5px; border-radius: 3px;';
        console.log('%c********************************', style);
        console.log('%c***   Core Version           ***', style);
        console.log('%c********************************', style);
        console.log('RPG Maker Name    : %c' + Utils.RPGMAKER_NAME, 'color: #4CAF50; font-weight: bold');
        console.log('RPG Maker Version : %c' + Utils.RPGMAKER_VERSION, 'color: #2196F3; font-weight: bold');
        console.log('RPG Maker Engine  : %c' + (Utils.RPGMAKER_ENGINE || 'Official Version'), 'color: #FF9800; font-weight: bold');
        console.log('%c********************************', style);
        console.log('%c***   User Agent             ***', style);
        console.log('%c********************************', style);
        console.log('%c' + navigator.userAgent, 'color: #9E9E9E; font-size: 10px;');
        console.log('%c********************************', style);
        
        // Add performance info
        if (performance && performance.memory) {
            console.log('%c***   Performance Info       ***', style);
            console.log('Memory Limit: %c' + Math.round(performance.memory.jsHeapSizeLimit / 1048576) + ' MB', 'color: #00BCD4');
        }
    };

    // Disable subsequent features unless in test play
    if (!Utils.isOptionValid('test') && !DataManager.isBattleTest()) {
        console.log(PluginManagerEx.findPluginName(script) + ' is valid only test play!');
        return;
    }

    Graphics._createDevToolInfo = function() {
        const div            = document.createElement('div');
        div.id               = 'devTool';
        div.style.display    = 'none';
        div.style.position   = 'absolute';
        div.style.left       = '100px';
        div.style.top        = '5px';
        div.style.background = '#222';
        div.style.opacity    = '0.8';
        div.style['z-index'] = '8';
        div.style.color      = '#fff';
        this._devToolDiv     = div;
        document.body.appendChild(div);
    };

    Graphics.drawDevToolInfo = function(text) {
        if (text) {
            this._devToolDiv.style.display = 'block';
            let displayText = text;
            
            // Add memory info if enabled (with optional chaining)
            const memInfo = SceneManager._nwWindow?.getMemoryInfo();
            if (param.ShowMemoryUsage && memInfo) {
                displayText += ' | ' + memInfo;
            }
            
            this._devToolDiv.textContent = displayText;
        } else {
            this._devToolDiv.style.display = 'none';
        }
    };

    SceneManager.showSourceMapTip = function() {
        if (this._shownSourceMapTip) return;
        this._shownSourceMapTip = true;
        
        const style = 'background: #ff9800; color: white; padding: 5px; font-weight: bold;';
        console.log('%c💡 TIP: To disable SourceMap warnings permanently:', style);
        console.log('%c1. Open DevTools Settings (F1 or click gear icon)', 'color: #2196F3');
        console.log('%c2. Uncheck "Enable JavaScript source maps"', 'color: #2196F3');
        console.log('%c3. Uncheck "Enable CSS source maps"', 'color: #2196F3');
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
        // Suppress annoying SourceMap warnings in DevTools
        const originalWarn = console.warn;
        console.warn = function(...args) {
            const message = args.join(' ');
            if (message.includes('DevTools failed to load SourceMap') ||
                message.includes('Could not load content for') ||
                message.includes('ERR_FILE_NOT_FOUND')) {
                return; // Suppress these specific warnings
            }
            originalWarn.apply(console, args);
        };
    };

    SceneManager.addMenuBar = function() {
        if (!param.MenuBarVisible) {
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
            this._slowCounter += (1 / param.SlowSpeed);
            return 0;
        } else {
            this._slowCounter = 0.0;
            if (this.isRapid()) {
                return result * param.RapidSpeed;
            } else {
                return result;
            }
        }
    };

    const _SceneManager_updateScene = SceneManager.updateScene;
    SceneManager.updateScene        = function() {
        this.updateScript();
        if (this.isUseReload()) {
            this.updateDataReload();
        }
        if (this._freeze || this.isReloading()) {
            return;
        }
        _SceneManager_updateScene.apply(this, arguments);
    };

    SceneManager.isUseReload = function() {
        return param.UseReloadData && !DataManager.isBattleTest() &&
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
        constructor(shortcut, id) {
            const commands = {
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
            this._command  = commands[id];
            this._id       = id;
            this._shortcut = shortcut;
        }

        isTypeEqual(id) {
            return this._id === id;
        }

        onKeyDown(event) {
            if (!this._shortcut) {
                return;
            } else if (event.key !== this._shortcut.HotKey) {
                return;
            } else if (event.ctrlKey !== this._shortcut.Ctrl) {
                return;
            } else if (event.altKey !== this._shortcut.Alt) {
                return;
            }
            this.execute();
        }

        createHotKeyText() {
            if (!this._shortcut || !this._shortcut.HotKey) {
                return '';
            } else {
                const ctrl = this._shortcut.Ctrl ? 'Ctrl+' : '';
                const alt  = this._shortcut.Alt ? 'Alt+' : '';
                return `(${ctrl}${alt}${this._shortcut.HotKey})`;
            }
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
            if (param.MenuBarVisible) {
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
                if (event.button === param.ClickMenu) {
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
            const projectPath = path.dirname(require.main.filename);
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
            if (param.MaxBackups <= 0) return;
            
            const fs = require('fs');
            const path = require('path');
            
            try {
                const backups = fs.readdirSync(backupPath)
                    .filter(f => f.startsWith('backup_'))
                    .map(f => ({
                        name: f,
                        path: path.join(backupPath, f),
                        time: fs.statSync(path.join(backupPath, f)).mtime.getTime()
                    }))
                    .sort((a, b) => b.time - a.time);
                
                // Remove excess backups
                backups.slice(param.MaxBackups).forEach(old => {
                    this.deleteFolderRecursive(old.path);
                    console.log('Deleted old backup:', old.name);
                });
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
