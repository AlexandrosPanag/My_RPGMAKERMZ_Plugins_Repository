//=============================================================================
// ControllerDetection.js
//=============================================================================

/*:
@target MZ
@plugindesc [v1.0.1] Controller Detection System
@author Alexandros Panagiotakopoulos
@url 
@help ControllerDetection.js

@param enableControllerDetection
@text Enable Controller Detection
@desc Enable automatic controller detection and notifications
@type boolean
@default true

@param showConnectionNotifications
@text Show Connection Notifications
@desc Show notifications when controllers connect/disconnect
@type boolean
@default true

@param notificationPosition
@text Notification Position
@desc Where to show controller notifications
@type select
@option Bottom Right
@value bottomRight
@option Bottom Center
@value bottomCenter
@option Top Right
@value topRight
@option Top Left
@value topLeft
@default bottomRight

@param notificationDuration
@text Notification Duration (seconds)
@desc How long to show notifications
@type number
@min 2
@max 15
@default 5

@param enableControllerInput
@text Enable Controller Input API
@desc Enable controller input API for other plugins
@type boolean
@default true

@param enableConsoleDebug
@text Enable Console Debug
@desc Show debug information in console
@type boolean
@default true

@help ControllerDetection.js

This plugin provides comprehensive controller detection and basic input support
for RPG Maker MZ. It automatically detects when controllers are connected or
disconnected and can optionally allow Player 1 to use controller input.

Key Features:
- Automatic controller detection (DualSense, Xbox, generic gamepads)
- Visual notifications for controller connection/disconnection
- Controller information API for other plugins
- Comprehensive controller debugging and status information
- Support for all major controller types
- Real-time controller status monitoring

Supported Controllers:
- PlayStation DualSense (PS5)
- PlayStation DualShock 4 (PS4)
- Xbox controllers (Xbox One, Xbox Series X/S)
- Generic USB gamepads
- All controllers supporting the Gamepad API

Features:
- Real-time controller connection/disconnection detection
- Visual notifications with controller-specific information  
- Controller state API for other plugins to access
- Comprehensive debugging and status information
- Performance-optimized controller polling
- Browser compatibility checking

Console Commands (F12 Developer Tools):
- $controllerDetection.getStatus() - View system status
- $controllerDetection.getControllerInfo() - View all connected controllers
- $controllerDetection.getCurrentController() - Get active controller data
- $controllerDetection.getControllerState(index) - Get controller button/axis state
- $controllerDetection.testController(index) - Test specific controller
- $controllerDetection.scanControllers() - Manually scan for controllers

Best Practices:
1. Enable notifications during development to see controller status
2. Test with actual controllers for accurate detection
3. Use console commands to debug controller issues
4. Check browser compatibility for Gamepad API support

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
    
    const pluginName = 'ControllerDetection';
    const parameters = PluginManager.parameters(pluginName);
    
    // Parse parameters
    const enableControllerDetection = parameters['enableControllerDetection'] === 'true';
    const showConnectionNotifications = parameters['showConnectionNotifications'] === 'true';
    const notificationPosition = parameters['notificationPosition'] || 'bottomRight';
    const notificationDuration = parseInt(parameters['notificationDuration'] || 5);
    const enableControllerInputAPI = parameters['enableControllerInput'] === 'true';
    const enableConsoleDebug = parameters['enableConsoleDebug'] === 'true';

    //-----------------------------------------------------------------------------
    // ControllerDetectionSystem - Main Class
    //-----------------------------------------------------------------------------
    
    class ControllerDetectionSystem {
        constructor() {
            this.isInitialized = false;
            this.connectedControllers = new Map();
            this.activeController = null; // Currently detected controller
            this.controllerInputAPI = enableControllerInputAPI;
            this.notificationQueue = [];
            
            // Safe initialization with delay
            setTimeout(() => {
                this.initializeSystem();
            }, 1000);
            
            if (enableConsoleDebug) {
                console.log(`[${pluginName}] Controller Detection System scheduled for initialization`);
            }
        }

        
        initializeSystem() {
            if (!enableControllerDetection || this.isInitialized) return;
            
            try {
                this.setupControllerDetection();
                this.setupNotificationSystem();
                this.startControllerPolling();
                
                this.isInitialized = true;
                
                if (enableConsoleDebug) {
                    console.log(`[${pluginName}] Controller Detection System successfully initialized`);
                }
                
            } catch (error) {
                console.error(`[${pluginName}] Failed to initialize controller detection:`, error);
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
                    console.log(`[${pluginName}] Gamepad connected event:`, e.gamepad);
                }
                this.onControllerConnected(e.gamepad);
            });
            
            window.addEventListener('gamepaddisconnected', (e) => {
                if (enableConsoleDebug) {
                    console.log(`[${pluginName}] Gamepad disconnected event:`, e.gamepad);
                }
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
            
            if (showConnectionNotifications) {
                this.showNotification('connected', controllerInfo);
            }
            
            // Auto-assign as active controller if none assigned
            if (!this.activeController) {
                this.setActiveController(gamepad.index);
            }
            
            if (enableConsoleDebug) {
                console.log(`[${pluginName}] Controller connected:`, controllerInfo);
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
                
                // Remove from connected controllers
                this.connectedControllers.delete(gamepad.index);
                
                // Clear active controller if it was this one
                if (this.activeController && this.activeController.index === gamepad.index) {
                    this.activeController = null;
                    
                    // Try to assign another controller if available
                    const remainingControllers = Array.from(this.connectedControllers.keys());
                    if (remainingControllers.length > 0) {
                        this.setActiveController(remainingControllers[0]);
                    }
                }
                
                if (enableConsoleDebug) {
                    console.log(`[${pluginName}] Controller disconnected:`, controllerInfo);
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
                
                if (enableConsoleDebug) {
                    console.log(`[${pluginName}] Active controller set to: ${controllerInfo.name}`);
                }
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
            
            if (enableConsoleDebug) {
                console.log(`[${pluginName}] Initial controller scan found ${foundControllers} controllers`);
                if (foundControllers === 0) {
                    console.log(`[${pluginName}] No controllers found. Connect a controller and press a button to activate it.`);
                }
            }
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
            const notificationElement = document.createElement('div');
            const positionClass = notificationPosition.toLowerCase().replace(/([A-Z])/g, '-$1');
            
            notificationElement.className = `controller-notification ${type} ${positionClass}`;
            
            if (type === 'connected') {
                notificationElement.innerHTML = `🎮 Controller Connected<br><small>${controllerInfo.name}</small>`;
            } else {
                notificationElement.innerHTML = `❌ Controller Disconnected<br><small>${controllerInfo.name}</small>`;
            }
            
            document.body.appendChild(notificationElement);
            
            // Auto-remove after duration
            setTimeout(() => {
                if (document.body.contains(notificationElement)) {
                    notificationElement.style.animation = 'controllerSlideIn 0.3s ease-out reverse';
                    setTimeout(() => {
                        if (document.body.contains(notificationElement)) {
                            document.body.removeChild(notificationElement);
                        }
                    }, 300);
                }
            }, notificationDuration * 1000);
            
            if (enableConsoleDebug) {
                console.log(`[${pluginName}] Notification shown: ${type} - ${controllerInfo.name}`);
            }
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
                activeController: this.activeController,
                connectedControllers: Array.from(this.connectedControllers.values()),
                gamepadApiSupported: !!navigator.getGamepads,
                settings: {
                    showNotifications: showConnectionNotifications,
                    notificationPosition: notificationPosition,
                    notificationDuration: notificationDuration
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
                console.log(`[${pluginName}] No controller found at index ${controllerIndex}`);
                return false;
            }
            
            console.log(`[${pluginName}] Testing controller at index ${controllerIndex}:`);
            console.log('- ID:', gamepad.id);
            console.log('- Connected:', gamepad.connected);
            console.log('- Buttons:', gamepad.buttons.length);
            console.log('- Axes:', gamepad.axes.length);
            console.log('- Timestamp:', gamepad.timestamp);
            
            // Test button presses
            const pressedButtons = [];
            for (let i = 0; i < gamepad.buttons.length; i++) {
                if (gamepad.buttons[i].pressed) {
                    pressedButtons.push(i);
                }
            }
            
            if (pressedButtons.length > 0) {
                console.log('- Pressed buttons:', pressedButtons);
            }
            
            return true;
        }
        
        scanControllers() {
            if (enableConsoleDebug) {
                console.log(`[${pluginName}] Manually scanning for controllers...`);
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
        
        if (enableConsoleDebug) {
            console.log(`[${pluginName}] Available console commands:`);
            console.log('- $controllerDetection.getStatus() - View system status');
            console.log('- $controllerDetection.getControllerInfo() - View all connected controllers');
            console.log('- $controllerDetection.getCurrentController() - Get active controller data');
            console.log('- $controllerDetection.getControllerState(index) - Get controller button/axis state');
            console.log('- $controllerDetection.testController(index) - Test specific controller');
            console.log('- $controllerDetection.scanControllers() - Manually scan for controllers');
        }
    };
    
})();