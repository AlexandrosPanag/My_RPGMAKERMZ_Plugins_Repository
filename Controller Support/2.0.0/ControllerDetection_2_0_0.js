/**
 * Copyright (c) 2026 Alexandros Panagiotakopoulos
 * 
 * This work is licensed under the Creative Commons Attribution-NoDerivatives 4.0 
 * International License. To view a copy of this license, visit 
 * http://creativecommons.org/licenses/by-nd/4.0/
 */

//=============================================================================
// ControllerDetection.js
// Version: 2.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v2.2.0] Controller Detection with Vertical Button Overlay
 * @author Alexandros Panagiotakopoulos
 * @version 2.2.0
 * @license CC-BY-ND-4.0
 * @url https://alexandrospanag.github.io
 * @help ControllerDetection.js
 * 
 * @param enableControllerDetection
 * @text Enable Controller Detection
 * @desc Enable automatic controller detection and notifications
 * @type boolean
 * @default true
 * 
 * @param showConnectionNotifications
 * @text Show Connection Notifications
 * @desc Show notifications when controllers connect/disconnect
 * @type boolean
 * @default true
 * 
 * @param notificationPosition
 * @text Notification Position
 * @desc Where to show controller notifications
 * @type select
 * @option Bottom Right
 * @value bottomRight
 * @option Bottom Center
 * @value bottomCenter
 * @option Top Right
 * @value topRight
 * @option Top Left
 * @value topLeft
 * @default bottomRight
 * 
 * @param notificationDuration
 * @text Notification Duration (seconds)
 * @desc How long to show notifications
 * @type number
 * @min 2
 * @max 15
 * @default 5
 * 
 * @param enableButtonOverlay
 * @text Enable Button Overlay
 * @desc Show controller button overlay when gamepad is detected
 * @type boolean
 * @default true
 * 
 * @param controllerType
 * @text Controller Type
 * @desc Which controller buttons to show in overlay
 * @type select
 * @option Auto-Detect
 * @value auto
 * @option PlayStation (DualSense)
 * @value ps
 * @option Xbox
 * @value xbox
 * @default auto
 * 
 * @param showOnlyInMenus
 * @text Show Only in Menus
 * @desc Only show overlay when in menus (not on map)
 * @type boolean
 * @default true
 * 
 * @param enableConsoleDebug
 * @text Enable Console Debug
 * @desc Show debug information in console
 * @type boolean
 * @default true
 *
 * @help ControllerDetection.js
 * 
 * This plugin provides comprehensive controller detection and a vertical
 * button overlay for RPG Maker MZ. It automatically detects when controllers
 * are connected or disconnected and shows a visual button guide.
 * 
 * Key Features:
 * - Automatic controller detection (DualSense, Xbox, generic gamepads)
 * - Visual notifications for controller connection/disconnection
 * - Vertical button overlay tower in the upper-right corner
 * - Controller information API for other plugins
 * 
 * Supported Controllers:
 * - PlayStation DualSense (PS5)
 * - PlayStation DualShock 4 (PS4)
 * - Xbox controllers (Xbox One, Xbox Series X/S)
 * - Generic USB gamepads
 * 
 * Console Commands (F12 Developer Tools):
 * - $controllerDetection.getStatus() - View system status
 * - $controllerDetection.getControllerInfo() - View all connected controllers
 * - $controllerDetection.getCurrentController() - Get active controller data
 * - $controllerDetection.getControllerState(index) - Get controller button/axis state
 * 
 * Copyright © Alexandros Panagiotakopoulos. All Rights Reserved.
 * Free to use with attribution required.
 */

(() => {
    'use strict';

    const pluginName = 'ControllerDetection';
    const parameters = PluginManager.parameters(pluginName);

    // Parse parameters
    const enableControllerDetection = parameters['enableControllerDetection'] === 'true';
    const showConnectionNotifications = parameters['showConnectionNotifications'] === 'true';
    const notificationPosition = parameters['notificationPosition'] || 'bottomRight';
    const notificationDuration = parseInt(parameters['notificationDuration'] || 5);
    const enableButtonOverlay = parameters['enableButtonOverlay'] !== 'false';
    const enableConsoleDebug = parameters['enableConsoleDebug'] === 'true';

    const overlayConfig = {
        controllerType: parameters['controllerType'] || 'auto'
    };

    //=========================================================================
    // Gamepad Button Mapping
    //=========================================================================

    Input.gamepadMapper = {
        0: "ok",       // A / Cross (×)
        2: "cancel",   // B / Square (□)
        1: "shift",    // X / Circle (○) - Running
        3: "menu",     // Y / Triangle (△)
        4: "pageup",   // LB / L1 - Left bumper
        5: "pagedown", // RB / R1 - Right bumper
        9: "menu",     // Start / Options / Pause menu
        12: "up",      // D-pad up
        13: "down",    // D-pad down
        14: "left",    // D-pad left
        15: "right"    // D-pad right
    };

    //=========================================================================
    // ControllerDetectionSystem - Main Class
    //=========================================================================

    class ControllerDetectionSystem {
        constructor() {
            this.isInitialized = false;
            this.connectedControllers = new Map();
            this.activeController = null;

            // Button overlay properties
            this.overlayElement = null;
            this.currentControllerType = 'xbox';
            this.isControllerConnected = false;
            this.isPausedManually = false;

            // Safe initialization with delay
            setTimeout(() => {
                this.initializeSystem();
            }, 1000);
        }

        initializeSystem() {
            if (!enableControllerDetection || this.isInitialized) return;

            try {
                this.setupControllerDetection();
                this.setupNotificationSystem();

                if (enableButtonOverlay) {
                    this.setupButtonOverlay();
                }

                this.isInitialized = true;
            } catch (error) {
                console.error(`[${pluginName}] Initialization error:`, error);
            }
        }

        setupControllerDetection() {
            if (!navigator.getGamepads) {
                console.warn(`[${pluginName}] Gamepad API not supported in this browser`);
                return;
            }

            window.addEventListener('gamepadconnected', (e) => {
                if (enableConsoleDebug) {
                    console.log(`[${pluginName}] Controller connected: ${e.gamepad.id}`);
                }
                this.onControllerConnected(e.gamepad);
            });

            window.addEventListener('gamepaddisconnected', (e) => {
                if (enableConsoleDebug) {
                    console.log(`[${pluginName}] Controller disconnected: ${e.gamepad.id}`);
                }
                this.onControllerDisconnected(e.gamepad);
            });

            this.scanExistingControllers();
        }

        onControllerConnected(gamepad) {
            const controllerInfo = {
                id: gamepad.id,
                index: gamepad.index,
                name: this.getControllerName(gamepad),
                connected: true,
                connectedAt: Date.now(),
                buttons: gamepad.buttons.length,
                axes: gamepad.axes.length
            };

            this.connectedControllers.set(gamepad.index, controllerInfo);
            this.isControllerConnected = true;

            // Update controller type for overlay
            if (overlayConfig.controllerType === 'auto') {
                const id = gamepad.id.toLowerCase();
                if (id.includes('dualsense') || id.includes('ps5') ||
                    id.includes('playstation') || id.includes('054c') ||
                    id.includes('wireless controller')) {
                    this.currentControllerType = 'ps';
                } else {
                    this.currentControllerType = 'xbox';
                }
            } else {
                this.currentControllerType = overlayConfig.controllerType;
            }

            if (showConnectionNotifications) {
                this.showNotification('connected', controllerInfo);
            }

            if (!this.activeController) {
                this.setActiveController(gamepad.index);
            }

            if (enableButtonOverlay) {
                this.updateOverlayVisibility();
            }
        }

        onControllerDisconnected(gamepad) {
            const controllerInfo = this.connectedControllers.get(gamepad.index);

            if (controllerInfo) {
                controllerInfo.connected = false;

                if (showConnectionNotifications) {
                    this.showNotification('disconnected', controllerInfo);
                }

                this.connectedControllers.delete(gamepad.index);

                if (this.connectedControllers.size === 0) {
                    this.isControllerConnected = false;
                }

                if (this.activeController && this.activeController.index === gamepad.index) {
                    this.activeController = null;

                    const remainingControllers = Array.from(this.connectedControllers.keys());
                    if (remainingControllers.length > 0) {
                        this.setActiveController(remainingControllers[0]);
                    }
                }

                if (enableButtonOverlay) {
                    this.updateOverlayVisibility();
                }
            }
        }

        getControllerName(gamepad) {
            const id = gamepad.id.toLowerCase();

            if (id.includes('dualsense') || id.includes('054c') || id.includes('ps5')) {
                return 'PlayStation DualSense';
            } else if (id.includes('dualshock') || id.includes('ps4')) {
                return 'PlayStation DualShock 4';
            } else if (id.includes('wireless controller') && gamepad.id.includes('054c')) {
                return 'PlayStation Controller';
            } else if (id.includes('xbox') || id.includes('xinput')) {
                return 'Xbox Controller';
            } else if (id.includes('045e')) {
                return 'Xbox Controller';
            } else {
                return `Controller (${gamepad.id.substring(0, 30)})`;
            }
        }

        setActiveController(controllerIndex) {
            const controllerInfo = this.connectedControllers.get(controllerIndex);
            if (controllerInfo) {
                this.activeController = {
                    index: controllerIndex,
                    info: controllerInfo,
                    activatedAt: Date.now()
                };
            }
        }

        scanExistingControllers() {
            if (!navigator.getGamepads) return;

            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                const gamepad = gamepads[i];
                if (gamepad && gamepad.connected) {
                    this.onControllerConnected(gamepad);
                }
            }
        }

        hideAllNotifications() {
            const notifications = document.querySelectorAll('.controller-notification');
            notifications.forEach(notification => {
                notification.style.display = 'none';
            });
        }

        showAllNotifications() {
            const notifications = document.querySelectorAll('.controller-notification');
            notifications.forEach(notification => {
                notification.style.display = 'block';
            });
        }

        //=====================================================================
        // Notification System
        //=====================================================================

        setupNotificationSystem() {
            const style = document.createElement('style');
            style.textContent = `
                .controller-notification {
                    position: fixed;
                    background: #000000;
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    font-family: 'Arial', sans-serif;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                    z-index: 10000;
                    pointer-events: none;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
                    max-width: 250px;
                    word-wrap: break-word;
                    animation: controllerSlideIn 0.3s ease-out;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }
                
                .controller-notification.connected,
                .controller-notification.disconnected {
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    background: #000000;
                }
                
                .controller-notification.bottom-right {
                    bottom: 20px;
                    right: 20px;
                }
                
                .controller-notification.bottom-center {
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                }
                
                .controller-notification.top-right {
                    top: 20px;
                    right: 20px;
                }
                
                .controller-notification.top-left {
                    top: 20px;
                    left: 20px;
                }
                
                @keyframes controllerSlideIn {
                    from { 
                        opacity: 0; 
                        transform: translateY(20px) ${notificationPosition.includes('center') ? 'translateX(-50%)' : ''}; 
                    }
                    to { 
                        opacity: 1; 
                        transform: translateY(0) ${notificationPosition.includes('center') ? 'translateX(-50%)' : ''}; 
                    }
                }
            `;
            document.head.appendChild(style);
        }

        showNotification(type, controllerInfo) {
            // Don't show notifications when custom menu is active
            if (SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_CustomMenu') {
                return;
            }

            const notificationElement = document.createElement('div');
            const positionClass = notificationPosition.toLowerCase().replace(/([A-Z])/g, '-$1');

            notificationElement.className = `controller-notification ${type} ${positionClass}`;

            if (type === 'connected') {
                notificationElement.innerHTML = `🎮 Controller Connected<br><small>${controllerInfo.name}</small>`;
            } else {
                notificationElement.innerHTML = `❌ Controller Disconnected<br><small>${controllerInfo.name}</small>`;
            }

            document.body.appendChild(notificationElement);

            // Hide notification if custom menu becomes active
            const checkForCustomMenu = () => {
                if (SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_CustomMenu') {
                    if (document.body.contains(notificationElement)) {
                        notificationElement.style.display = 'none';
                    }
                } else if (notificationElement.style.display === 'none') {
                    notificationElement.style.display = 'block';
                }
            };

            const menuCheckInterval = setInterval(checkForCustomMenu, 100);

            // Auto-remove after duration
            setTimeout(() => {
                clearInterval(menuCheckInterval);
                if (document.body.contains(notificationElement)) {
                    notificationElement.style.animation = 'controllerSlideIn 0.3s ease-out reverse';
                    setTimeout(() => {
                        if (document.body.contains(notificationElement)) {
                            document.body.removeChild(notificationElement);
                        }
                    }, 300);
                }
            }, notificationDuration * 1000);
        }

        //=====================================================================
        // Button Overlay System — Vertical Tower Layout
        //=====================================================================

        setupButtonOverlay() {
            this.createOverlay();
            this.setupOverlayStyles();

            // Hook into Scene_Map for pause detection
            if (typeof Scene_Map !== 'undefined') {
                const _Scene_Map_callMenu = Scene_Map.prototype.callMenu;
                Scene_Map.prototype.callMenu = function () {
                    window.$controllerDetection.isPausedManually = true;
                    _Scene_Map_callMenu.call(this);
                    setTimeout(() => window.$controllerDetection.updateOverlayVisibility(), 50);
                };

                const _Scene_Map_update = Scene_Map.prototype.update;
                Scene_Map.prototype.update = function () {
                    _Scene_Map_update.call(this);

                    if (window.$controllerDetection.isPausedManually && this.isActive && !this.isActive()) {
                        window.$controllerDetection.isPausedManually = false;
                        setTimeout(() => window.$controllerDetection.updateOverlayVisibility(), 50);
                    }
                };
            }

            // Periodic visibility check
            setInterval(() => {
                if (this.overlayElement) {
                    this.updateOverlayVisibility();
                }
            }, 100);
        }

        setupOverlayStyles() {
            const style = document.createElement('style');
            style.textContent = `
                #controller-button-overlay {
                    position: fixed;
                    top: 80px;
                    right: 10px;
                    z-index: 10000;
                    background: rgba(10, 10, 14, 0.82);
                    color: white;
                    padding: 10px 9px;
                    border-radius: 12px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'GameFont', Arial, sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    border: 1px solid rgba(255, 255, 255, 0.13);
                    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(0,0,0,0.3);
                    backdrop-filter: blur(6px);
                    -webkit-backdrop-filter: blur(6px);
                    display: none;
                    flex-direction: column;
                    align-items: stretch;
                    gap: 3px;
                    min-width: 100px;
                    transform: translateZ(0);
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    pointer-events: none;
                }
                
                .ctrl-btn-row {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    padding: 5px 6px;
                    border-radius: 7px;
                    transition: background 0.1s ease, transform 0.1s ease;
                }
                
                .ctrl-btn-row.pressed {
                    background: rgba(255, 255, 255, 0.13);
                    transform: scale(0.94);
                }
                
                .ctrl-btn-icon {
                    width: 34px;
                    height: 34px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: rgba(18, 18, 24, 0.95);
                    border: 2px solid rgba(255, 255, 255, 0.38);
                    flex-shrink: 0;
                    box-sizing: border-box;
                    transition: border-color 0.1s ease, background 0.1s ease;
                }
                
                .ctrl-btn-row.pressed .ctrl-btn-icon {
                    border-color: rgba(255, 255, 255, 0.85);
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .ctrl-btn-icon.pill {
                    border-radius: 7px;
                    width: 40px;
                    height: 26px;
                }
                
                .ctrl-btn-label {
                    font-size: 13px;
                    font-weight: 600;
                    letter-spacing: 0.4px;
                    color: rgba(255, 255, 255, 0.88);
                    white-space: nowrap;
                    transition: color 0.1s ease;
                }
                
                .ctrl-btn-row.pressed .ctrl-btn-label {
                    color: #fff;
                }
                
                .ctrl-btn-separator {
                    height: 1px;
                    background: rgba(255, 255, 255, 0.08);
                    margin: 1px 6px;
                }
            `;
            document.head.appendChild(style);
        }

        createOverlay() {
            if (this.overlayElement) return;

            this.overlayElement = document.createElement('div');
            this.overlayElement.id = 'controller-button-overlay';
            document.body.appendChild(this.overlayElement);
        }

        /**
         * Builds a single button row for the vertical overlay.
         * @param {string} iconHTML - Inner HTML for the button icon
         * @param {string} label   - Action label text
         * @param {string} shape   - Icon shape: 'circle' (default), 'pill' (trigger)
         * @param {boolean} pressed - Whether the button is currently held
         * @returns {string} HTML string for the row
         */
        _buildButtonRow(iconHTML, label, shape, pressed) {
            const shapeClass = shape === 'pill' ? ' pill' : '';
            const pressedClass = pressed ? ' pressed' : '';
            return `<div class="ctrl-btn-row${pressedClass}">
                <div class="ctrl-btn-icon${shapeClass}">${iconHTML}</div>
                <span class="ctrl-btn-label">${label}</span>
            </div>`;
        }

        /**
         * Reads live pressed state of the 4 displayed buttons.
         * @returns {Object} Map of gamepad button index → boolean
         */
        _getButtonPressState() {
            const state = { 0: false, 1: false, 2: false, 3: false, 5: false };
            if (!navigator.getGamepads) return state;
            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                const gp = gamepads[i];
                if (!gp || !gp.connected) continue;
                for (const idx of [0, 1, 2, 3, 5]) {
                    if (gp.buttons[idx] && gp.buttons[idx].pressed) {
                        state[idx] = true;
                    }
                }
                break; // only first connected controller
            }
            return state;
        }

        updateOverlayContent() {
            if (!this.overlayElement) return;

            const p = this._getButtonPressState();
            let rows = '';

            // Clean × cross icon — two diagonal lines centered in the circle
            const crossSVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="3" y1="3" x2="13" y2="13" stroke="white" stroke-width="2.4" stroke-linecap="round"/>
                <line x1="13" y1="3" x2="3" y2="13" stroke="white" stroke-width="2.4" stroke-linecap="round"/>
            </svg>`;

            const triangleSVG = `<svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 2 L18.5 17 L1.5 17 Z" stroke="white" stroke-width="2.5" stroke-linejoin="round" fill="none"/>
            </svg>`;

            if (this.currentControllerType === 'ps') {
                // PlayStation DualSense — vertical tower
                // □ Select (button 0)
                rows += this._buildButtonRow(
                    '<div style="width:14px;height:14px;border:2.4px solid white;border-radius:1px;box-sizing:border-box;"></div>',
                    'Select', 'circle', p[0]
                );
                rows += '<div class="ctrl-btn-separator"></div>';

                // ○ Cancel (button 2)
                rows += this._buildButtonRow(
                    '<div style="width:15px;height:15px;border:2.4px solid white;border-radius:50%;box-sizing:border-box;"></div>',
                    'Cancel', 'circle', p[2]
                );
                rows += '<div class="ctrl-btn-separator"></div>';

                // × Dash (button 1)
                rows += this._buildButtonRow(crossSVG, 'Dash', 'circle', p[1]);
                rows += '<div class="ctrl-btn-separator"></div>';

                // △ Menu (button 3)
                rows += this._buildButtonRow(triangleSVG, 'Menu', 'circle', p[3]);
                rows += '<div class="ctrl-btn-separator"></div>';

                // R1 Jump (button 5)
                rows += this._buildButtonRow(
                    '<span style="font-size:11px;font-weight:800;color:white;letter-spacing:-0.3px;">R1</span>',
                    'Jump', 'pill', p[5]
                );

            } else {
                // Xbox controller — vertical tower
                // X Select (button 0)
                rows += this._buildButtonRow(
                    '<span style="font-size:15px;font-weight:900;color:white;">X</span>',
                    'Select', 'circle', p[0]
                );
                rows += '<div class="ctrl-btn-separator"></div>';

                // B Cancel (button 2)
                rows += this._buildButtonRow(
                    '<span style="font-size:15px;font-weight:900;color:white;">B</span>',
                    'Cancel', 'circle', p[2]
                );
                rows += '<div class="ctrl-btn-separator"></div>';

                // A Dash (button 1)
                rows += this._buildButtonRow(
                    '<span style="font-size:15px;font-weight:900;color:white;">A</span>',
                    'Dash', 'circle', p[1]
                );
                rows += '<div class="ctrl-btn-separator"></div>';

                // Y Menu (button 3)
                rows += this._buildButtonRow(
                    '<span style="font-size:15px;font-weight:900;color:white;">Y</span>',
                    'Menu', 'circle', p[3]
                );
                rows += '<div class="ctrl-btn-separator"></div>';

                // RB Jump (button 5)
                rows += this._buildButtonRow(
                    '<span style="font-size:11px;font-weight:800;color:white;letter-spacing:-0.3px;">RB</span>',
                    'Jump', 'pill', p[5]
                );
            }

            this.overlayElement.innerHTML = rows;
        }

        updateOverlayVisibility() {
            if (!this.overlayElement) return;

            const currentScene = SceneManager._scene;
            const isStartMenu = currentScene && (currentScene.constructor.name === 'Scene_Title' ||
                currentScene.constructor.name === 'Scene_CustomMenu');
            const isPaused = this.isGamePaused();

            const shouldShow = this.isControllerConnected && !isStartMenu && !isPaused;

            this.overlayElement.style.display = shouldShow ? 'flex' : 'none';

            if (shouldShow) {
                this.updateOverlayContent();
            }
        }

        isGamePaused() {
            if (this.isPausedManually) {
                return true;
            }

            const currentScene = SceneManager._scene;
            if (currentScene && (currentScene.constructor.name === 'Scene_Title' ||
                currentScene.constructor.name === 'Scene_CustomMenu')) {
                return true;
            }

            if (typeof $gameMessage !== 'undefined' && $gameMessage && $gameMessage.isBusy()) {
                return true;
            }

            if (SceneManager.isSceneChanging && SceneManager.isSceneChanging()) {
                return true;
            }

            if (currentScene && currentScene.constructor.name === 'Scene_Map') {
                const scene = currentScene;

                if (scene._windowLayer && scene._windowLayer.children) {
                    for (let child of scene._windowLayer.children) {
                        if (child && child.visible && (child.isOpen ? child.isOpen() : true)) {
                            const windowName = child.constructor.name;
                            if (windowName.includes('MenuCommand') ||
                                windowName.includes('SaveFile') ||
                                windowName.includes('LoadFile') ||
                                windowName.includes('Options') ||
                                windowName.includes('GameEnd') ||
                                windowName.includes('ItemList') ||
                                windowName.includes('SkillList') ||
                                windowName.includes('Status') ||
                                windowName.includes('Equip')) {
                                return true;
                            }
                        }
                    }
                }
            }

            return false;
        }

        //=====================================================================
        // Public API Methods
        //=====================================================================

        getStatus() {
            return {
                initialized: this.isInitialized,
                buttonOverlayEnabled: enableButtonOverlay,
                activeController: this.activeController,
                connectedControllers: Array.from(this.connectedControllers.values()),
                gamepadApiSupported: !!navigator.getGamepads,
                settings: {
                    showNotifications: showConnectionNotifications,
                    notificationPosition: notificationPosition,
                    notificationDuration: notificationDuration,
                    showOnlyInMenus: overlayConfig.showOnlyInMenus
                }
            };
        }

        getControllerInfo() {
            const gamepads = navigator.getGamepads();
            const liveGamepads = [];

            for (let i = 0; i < gamepads.length; i++) {
                if (gamepads[i]) {
                    liveGamepads.push({
                        index: i,
                        id: gamepads[i].id,
                        connected: gamepads[i].connected,
                        buttons: gamepads[i].buttons.length,
                        axes: gamepads[i].axes.length,
                        timestamp: gamepads[i].timestamp
                    });
                }
            }

            return {
                supported: !!navigator.getGamepads,
                liveGamepads: liveGamepads,
                detectedControllers: Array.from(this.connectedControllers.values()),
                activeController: this.activeController
            };
        }

        getCurrentController() {
            if (!this.activeController) return null;

            const gamepads = navigator.getGamepads();
            const gamepad = gamepads[this.activeController.index];

            if (!gamepad || !gamepad.connected) return null;

            return {
                index: gamepad.index,
                id: gamepad.id,
                connected: gamepad.connected,
                timestamp: gamepad.timestamp,
                info: this.activeController.info
            };
        }

        getControllerState(controllerIndex) {
            if (typeof controllerIndex !== 'number') {
                controllerIndex = this.activeController ? this.activeController.index : 0;
            }

            const gamepads = navigator.getGamepads();
            const gamepad = gamepads[controllerIndex];

            if (!gamepad || !gamepad.connected) return null;

            return {
                buttons: Array.from(gamepad.buttons).map((btn, i) => ({
                    index: i,
                    pressed: btn.pressed,
                    touched: btn.touched,
                    value: btn.value
                })),
                axes: Array.from(gamepad.axes),
                timestamp: gamepad.timestamp
            };
        }
    }

    //=========================================================================
    // Plugin Initialization
    //=========================================================================

    const originalSceneBootStart = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function () {
        originalSceneBootStart.call(this);

        const system = new ControllerDetectionSystem();
        window.$controllerDetection = system;

        // Expose notification toggle API directly
        system.hideNotifications = system.hideAllNotifications.bind(system);
        system.showNotifications = system.showAllNotifications.bind(system);
    };

})();