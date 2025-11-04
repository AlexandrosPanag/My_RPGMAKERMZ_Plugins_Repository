/**
 * Copyright (c) 2025 Alexandros Panagiotakopoulos
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
 * @plugindesc [v2.0.0] Controller Detection with Button Overlay
 * @author Alexandros Panagiotakopoulos
 * @version 2.0.0
 * @license CC-BY-ND-4.0
 * @url alexandrospanag.github.io
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
 * @param overlayPosition
 * @text Overlay Position
 * @desc Where to show the controller button overlay
 * @type select
 * @option Upper Right (Menu Area)
 * @value menu-right
 * @option Bottom Right
 * @value bottom-right
 * @option Bottom Left
 * @value bottom-left
 * @option Top Right
 * @value top-right
 * @option Top Left
 * @value top-left
 * @default menu-right
 * 
 * @param showOnlyInMenus
 * @text Show Only in Menus
 * @desc Only show overlay when in menus (not on map)
 * @type boolean
 * @default true
 * 
 * @param enableControllerInput
 * @text Enable Controller Input API
 * @desc Enable controller input API for other plugins
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
 * This plugin provides comprehensive controller detection and button overlay
 * for RPG Maker MZ. It automatically detects when controllers are connected or
 * disconnected and shows a visual button overlay.
 * 
 * Key Features:
 * - Automatic controller detection (DualSense, Xbox, generic gamepads)
 * - Visual notifications for controller connection/disconnection
 * - Controller button overlay showing button assignments
 * - Controller information API for other plugins
 * - Real-time controller status monitoring
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
 * - $controllerDetection.testController(index) - Test specific controller
 * - $controllerDetection.scanControllers() - Manually scan for controllers
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
    const enableButtonOverlay = parameters['enableButtonOverlay'] !== 'false'; // Default true
    const enableControllerInputAPI = parameters['enableControllerInput'] === 'true';
    const enableConsoleDebug = parameters['enableConsoleDebug'] === 'true';
    
    const overlayConfig = {
        controllerType: parameters['controllerType'] || 'auto',
        overlayPosition: parameters['overlayPosition'] || 'menu-right',
        showOnlyInMenus: parameters['showOnlyInMenus'] === 'true'
    };
    
    //=============================================================================
    // Gamepad Button Mapping - DualSense Controller Configuration
    //=============================================================================
    
    // Set up the correct gamepad button mappings for DualSense controller
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
    };    //=============================================================================
    // ControllerDetectionSystem - Main Class
    //=============================================================================
    
    class ControllerDetectionSystem {
        constructor() {
            this.isInitialized = false;
            this.connectedControllers = new Map();
            this.activeController = null;
            this.controllerInputAPI = enableControllerInputAPI;
            this.notificationQueue = [];
            
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
                
                this.startControllerPolling();
                this.isInitialized = true;
            } catch (error) {
                console.error(`[${pluginName}] Initialization error:`, error);
            }
        }
        
        setupControllerDetection() {
            // Check for Gamepad API support
            if (!navigator.getGamepads) {
                console.warn(`[${pluginName}] Gamepad API not supported in this browser`);
                return;
            }
            
            // Set up gamepad connection/disconnection events
            window.addEventListener('gamepadconnected', (e) => {
                if (enableConsoleDebug) {
                }
                this.onControllerConnected(e.gamepad);
            });
            
            window.addEventListener('gamepaddisconnected', (e) => {
                this.onControllerDisconnected(e.gamepad);
            });
            
            // Scan for already-connected controllers
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
                controllerInfo.disconnectedAt = Date.now();
                
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
            } else if (id.includes('045e')) { // Microsoft vendor ID
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
            let foundControllers = 0;
            
            for (let i = 0; i < gamepads.length; i++) {
                const gamepad = gamepads[i];
                if (gamepad && gamepad.connected) {
                    this.onControllerConnected(gamepad);
                    foundControllers++;
                }
            }
            
        }
        
        hideAllNotifications() {
            // Hide all existing controller notifications
            const notifications = document.querySelectorAll('.controller-notification');
            notifications.forEach(notification => {
                notification.style.display = 'none';
            });
        }
        
        showAllNotifications() {
            // Show all hidden controller notifications
            const notifications = document.querySelectorAll('.controller-notification');
            notifications.forEach(notification => {
                notification.style.display = 'block';
            });
        }
        
        setupNotificationSystem() {
            // Create CSS for notifications
            const style = document.createElement('style');
            style.textContent = `
                .controller-notification {
                    position: fixed;
                    background: rgba(0, 0, 0, 0.9);
                    color: white;
                    padding: 15px 20px;
                    border-radius: 8px;
                    font-family: 'Arial', sans-serif;
                    font-size: 14px;
                    font-weight: bold;
                    text-align: center;
                    z-index: 10000;
                    pointer-events: none;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                    max-width: 250px;
                    word-wrap: break-word;
                    animation: controllerSlideIn 0.3s ease-out;
                }
                
                .controller-notification.connected {
                    border: 2px solid #4CAF50;
                    background: rgba(76, 175, 80, 0.9);
                }
                
                .controller-notification.disconnected {
                    border: 2px solid #f44336;
                    background: rgba(244, 67, 54, 0.9);
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
            
            // Hide notification immediately if custom menu becomes active
            const checkForCustomMenu = () => {
                if (SceneManager._scene && SceneManager._scene.constructor.name === 'Scene_CustomMenu') {
                    if (document.body.contains(notificationElement)) {
                        notificationElement.style.display = 'none';
                    }
                } else if (notificationElement.style.display === 'none') {
                    notificationElement.style.display = 'block';
                }
            };
            
            // Check every 100ms for custom menu activation
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
        
        //=============================================================================
        // Button Overlay System
        //=============================================================================
        
        setupButtonOverlay() {
            this.createOverlay();
            this.setupOverlayStyles();
            
            // Hook into Scene_Map for pause detection
            if (typeof Scene_Map !== 'undefined') {
                const _Scene_Map_callMenu = Scene_Map.prototype.callMenu;
                Scene_Map.prototype.callMenu = function() {
                    window.$controllerDetection.isPausedManually = true;
                    _Scene_Map_callMenu.call(this);
                    setTimeout(() => window.$controllerDetection.updateOverlayVisibility(), 50);
                };
                
                const _Scene_Map_update = Scene_Map.prototype.update;
                Scene_Map.prototype.update = function() {
                    _Scene_Map_update.call(this);
                    
                    if (window.$controllerDetection.isPausedManually && this.isActive && !this.isActive()) {
                        window.$controllerDetection.isPausedManually = false;
                        setTimeout(() => window.$controllerDetection.updateOverlayVisibility(), 50);
                    }
                };
            }
            
            // Set up visibility checking
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
                    z-index: 10000;
                    background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(20, 20, 20, 0.92));
                    color: white;
                    padding: 16px 20px;
                    border-radius: 12px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'GameFont', Arial, sans-serif;
                    font-size: 13px;
                    font-weight: 500;
                    border: 2px solid rgba(255, 255, 255, 0.15);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(12px);
                    display: none;
                    min-width: 200px;
                    transform: translateZ(0);
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }
            `;
            document.head.appendChild(style);
        }
        
        createOverlay() {
            if (this.overlayElement) return;
            
            this.overlayElement = document.createElement('div');
            this.overlayElement.id = 'controller-button-overlay';
            
            this.setOverlayPosition();
            document.body.appendChild(this.overlayElement);
        }
        
        setOverlayPosition() {
            if (!this.overlayElement) return;
            
            this.overlayElement.style.top = '';
            this.overlayElement.style.bottom = '';
            this.overlayElement.style.left = '';
            this.overlayElement.style.right = '';
            
            switch (overlayConfig.overlayPosition) {
                case 'menu-right':
                    this.overlayElement.style.top = '20px';
                    this.overlayElement.style.right = '20px';
                    break;
                case 'bottom-right':
                    this.overlayElement.style.bottom = '20px';
                    this.overlayElement.style.right = '20px';
                    break;
                case 'bottom-left':
                    this.overlayElement.style.bottom = '20px';
                    this.overlayElement.style.left = '20px';
                    break;
                case 'top-right':
                    this.overlayElement.style.top = '20px';
                    this.overlayElement.style.right = '20px';
                    break;
                case 'top-left':
                    this.overlayElement.style.top = '20px';
                    this.overlayElement.style.left = '20px';
                    break;
            }
        }
        
        updateOverlayContent() {
            if (!this.overlayElement) return;
            
            let content = '';
            
            if (this.currentControllerType === 'ps') {
                // PlayStation DualSense buttons
                content = `
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 34px; height: 34px; background: linear-gradient(145deg, #2196F3, #1976D2); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 19px; box-shadow: 0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25); border: 1.5px solid rgba(255,255,255,0.1); text-shadow: 0 2px 3px rgba(0,0,0,0.7);">×</div>
                            <span style="font-size: 14px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.9); letter-spacing: 0.3px;">Dash</span>
                        </div>
                        
                        <div style="width: 1px; height: 24px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);"></div>
                        
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 34px; height: 34px; background: linear-gradient(145deg, #E91E63, #C2185B); border-radius: 4px; display: flex; align-items: center; justify-content: center; box-shadow: 0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.2); border: 1.5px solid rgba(255,255,255,0.1); position: relative;">
                                <div style="width: 16px; height: 16px; background: linear-gradient(145deg, #ffffff, #f0f0f0); border-radius: 1px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.3), 0 1px 0 rgba(255,255,255,1);"></div>
                            </div>
                            <span style="font-size: 14px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.9); letter-spacing: 0.3px;">Select</span>
                        </div>
                        
                        <div style="width: 1px; height: 24px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);"></div>
                        
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 34px; height: 34px; background: linear-gradient(145deg, #F44336, #D32F2F); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 18px; box-shadow: 0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25); border: 1.5px solid rgba(255,255,255,0.1); text-shadow: 0 2px 3px rgba(0,0,0,0.7);">●</div>
                            <span style="font-size: 14px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.9); letter-spacing: 0.3px;">Cancel</span>
                        </div>
                        
                        <div style="width: 1px; height: 24px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);"></div>
                        
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 34px; height: 34px; background: linear-gradient(145deg, #4CAF50, #388E3C); border-radius: 6px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 19px; box-shadow: 0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25); border: 1.5px solid rgba(255,255,255,0.1); text-shadow: 0 2px 3px rgba(0,0,0,0.7);">▲</div>
                            <span style="font-size: 14px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.9); letter-spacing: 0.3px;">Menu</span>
                        </div>
                    </div>
                `;
            } else {
                // Xbox controller buttons
                content = `
                    <div style="display: flex; align-items: center; gap: 20px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 34px; height: 34px; background: linear-gradient(145deg, #107C10, #0E6A0E); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 17px; box-shadow: 0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25); border: 1.5px solid rgba(255,255,255,0.1); text-shadow: 0 2px 3px rgba(0,0,0,0.8);">A</div>
                            <span style="font-size: 14px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.9); letter-spacing: 0.3px;">Dash</span>
                        </div>
                        
                        <div style="width: 1px; height: 24px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);"></div>
                        
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 34px; height: 34px; background: linear-gradient(145deg, #0078D7, #005A9E); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 17px; box-shadow: 0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25); border: 1.5px solid rgba(255,255,255,0.1); text-shadow: 0 2px 3px rgba(0,0,0,0.8);">X</div>
                            <span style="font-size: 14px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.9); letter-spacing: 0.3px;">Confirm</span>
                        </div>
                        
                        <div style="width: 1px; height: 24px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);"></div>
                        
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 34px; height: 34px; background: linear-gradient(145deg, #E74856, #C42B35); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 17px; box-shadow: 0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25); border: 1.5px solid rgba(255,255,255,0.1); text-shadow: 0 2px 3px rgba(0,0,0,0.8);">B</div>
                            <span style="font-size: 14px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.9); letter-spacing: 0.3px;">Cancel</span>
                        </div>
                        
                        <div style="width: 1px; height: 24px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);"></div>
                        
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <div style="width: 34px; height: 34px; background: linear-gradient(145deg, #FFB900, #F39C12); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: rgba(0,0,0,0.85); font-weight: 900; font-size: 17px; box-shadow: 0 3px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.35); border: 1.5px solid rgba(255,255,255,0.2); text-shadow: 0 1px 2px rgba(255,255,255,0.6);">Y</div>
                            <span style="font-size: 14px; font-weight: 600; text-shadow: 0 2px 4px rgba(0,0,0,0.9); letter-spacing: 0.3px;">Menu</span>
                        </div>
                    </div>
                `;
            }
            
            this.overlayElement.innerHTML = content;
        }
        
        updateOverlayVisibility() {
            if (!this.overlayElement) return;
            
            const currentScene = SceneManager._scene;
            const isStartMenu = currentScene && (currentScene.constructor.name === 'Scene_Title' || 
                                                 currentScene.constructor.name === 'Scene_CustomMenu');
            const isPaused = this.isGamePaused();
            
            const shouldShow = this.isControllerConnected && !isStartMenu && !isPaused;
            
            this.overlayElement.style.display = shouldShow ? 'flex' : 'none';
            this.overlayElement.style.visibility = shouldShow ? 'visible' : 'hidden';
            
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

        
        startControllerPolling() {
            // Simple polling for controller detection and status updates
            const pollControllers = () => {
                // Keep the system alive for other plugins to access controller data
                requestAnimationFrame(pollControllers);
            };
            
            requestAnimationFrame(pollControllers);
        }
        
        // Public API methods
        getStatus() {
            return {
                initialized: this.isInitialized,
                controllerInputAPIEnabled: this.controllerInputAPI,
                buttonOverlayEnabled: enableButtonOverlay,
                activeController: this.activeController,
                connectedControllers: Array.from(this.connectedControllers.values()),
                gamepadApiSupported: !!navigator.getGamepads,
                settings: {
                    showNotifications: showConnectionNotifications,
                    notificationPosition: notificationPosition,
                    notificationDuration: notificationDuration,
                    overlayPosition: overlayConfig.overlayPosition,
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
        
        testController(controllerIndex) {
            if (typeof controllerIndex !== 'number') {
                controllerIndex = this.activeController ? this.activeController.index : 0;
            }
            
            const gamepads = navigator.getGamepads();
            const gamepad = gamepads[controllerIndex];
            
            if (!gamepad) {
                return false;
            }
            
            
            // Test button presses
            const pressedButtons = [];
            for (let i = 0; i < gamepad.buttons.length; i++) {
                if (gamepad.buttons[i].pressed) {
                    pressedButtons.push(i);
                }
            }
            
            if (pressedButtons.length > 0) {
            }
            
            return true;
        }
        
        scanControllers() {
            if (enableConsoleDebug) {
            }
            
            this.scanExistingControllers();
            return this.getControllerInfo();
        }
    }
    
    //-----------------------------------------------------------------------------
    // Plugin Initialization
    //-----------------------------------------------------------------------------
    
    // Initialize controller detection system when the game starts
    const originalSceneBootStart = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        originalSceneBootStart.call(this);
        
        // Initialize controller detection system
        window.$controllerDetection = new ControllerDetectionSystem();
        
        // Add global methods for notification control
        window.$controllerDetection.hideNotifications = function() {
            return window.$controllerDetection.hideAllNotifications();
        };
        
        window.$controllerDetection.showNotifications = function() {
            return window.$controllerDetection.showAllNotifications();
        };
        
    };
    
})();
