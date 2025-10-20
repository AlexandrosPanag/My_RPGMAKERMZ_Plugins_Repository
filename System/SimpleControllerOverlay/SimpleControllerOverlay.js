//=============================================================================
// SimpleControllerOverlay.js
// Version: 1.0.0
// Author: Assistant
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Simple Controller Button Overlay v1.0.0
 * @author Assistant
 * @version 1.0.0
 * @url alexandrospanag.github.io
 * @date 26/09/2025
 * @help SimpleControllerOverlay.js
 * 
 * @param controllerType
 * @text Controller Type
 * @desc Which controller buttons to show
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
 * Simple controller button overlay that shows controller buttons when a controller is detected.
 * Just displays the equivalent controller buttons next to the existing "Z select X cancel" text.
 * 
 * COMPLETELY INDEPENDENT - No conflicts with other controller plugins!
 * - Does not interfere with VisuMZ CoreEngine
 * - Does not interfere with ControllerIconMapper
 * - Does not interfere with ControllerDetection.js
 * - Pure visual overlay only - no input system modifications
 * 
 * No complex integration - just a clean visual overlay!
 */

(() => {
    'use strict';
    
    // Add debug function immediately so it's always available
    window.testControllerOverlay = function() {
        console.log('=== CONTROLLER OVERLAY DEBUG ===');
        console.log('Plugin loaded:', true);
        console.log('Navigator gamepad support:', !!navigator.getGamepads);
        
        if (navigator.getGamepads) {
            const gamepads = navigator.getGamepads();
            console.log('Connected gamepads:', Array.from(gamepads).filter(gp => gp !== null).length);
            Array.from(gamepads).forEach((gp, i) => {
                if (gp) console.log(`  Gamepad ${i}: ${gp.id}`);
            });
        }
        
        console.log('Overlay element exists:', !!document.getElementById('controller-button-overlay'));
        
        const overlay = document.getElementById('controller-button-overlay');
        if (overlay) {
            console.log('Overlay display:', overlay.style.display);
            console.log('Overlay position:', overlay.style.position);
            overlay.style.display = 'flex';
            overlay.innerHTML = '<div style="color: yellow;">🎮 CONTROLLER OVERLAY TEST 🎮</div>';
            console.log('Overlay forced visible for testing');
        } else {
            console.log('Creating test overlay...');
            const testOverlay = document.createElement('div');
            testOverlay.id = 'controller-button-overlay';
            testOverlay.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                z-index: 10000;
                background: rgba(0, 0, 0, 0.9);
                color: yellow;
                padding: 16px;
                border-radius: 8px;
                font-family: Arial;
                font-size: 16px;
                border: 2px solid yellow;
                display: flex;
            `;
            testOverlay.innerHTML = '🎮 TEST OVERLAY WORKING!';
            document.body.appendChild(testOverlay);
            console.log('Test overlay created and should be visible');
        }
        
        return 'Check console for details';
    };
    
    console.log('[SimpleControllerOverlay] Debug function testControllerOverlay() added');
    
    // Ensure we don't conflict with other controller plugins
    const ISOLATION_MODE = true; // Run completely independently
    
    // Clear any existing controller global variables to avoid conflicts
    if (ISOLATION_MODE) {
        // Don't touch other plugins' globals, just use our own scope
        console.log('[SimpleControllerOverlay] Running in isolation mode - no conflicts with other controller plugins');
    }
    
    const pluginName = 'SimpleControllerOverlay';
    const parameters = PluginManager.parameters(pluginName);
    
    const config = {
        controllerType: parameters['controllerType'] || 'auto',
        overlayPosition: parameters['overlayPosition'] || 'menu-right',
        showOnlyInMenus: parameters['showOnlyInMenus'] === 'true'
    };
    
    let overlayElement = null;
    let currentControllerType = 'xbox'; // Default
    let isControllerConnected = false;
    
    // Independent controller detection (no conflicts with other plugins)
    function detectController() {
        // Completely independent detection - no interference with other controller systems
        if (!navigator.getGamepads) return false;
        
        try {
            const gamepads = navigator.getGamepads();
            for (let i = 0; i < gamepads.length; i++) {
                const gamepad = gamepads[i];
                if (gamepad && gamepad.connected) {
                    // Auto-detect controller type independently
                    if (config.controllerType === 'auto') {
                        const id = gamepad.id.toLowerCase();
                        if (id.includes('dualsense') || id.includes('ps5') || id.includes('playstation') || id.includes('054c')) {
                            currentControllerType = 'ps';
                        } else {
                            currentControllerType = 'xbox';
                        }
                    } else {
                        currentControllerType = config.controllerType;
                    }
                    return true;
                }
            }
        } catch (error) {
            // Silent fail to avoid conflicts with other controller systems
            console.log('[SimpleControllerOverlay] Controller detection error (non-critical):', error.message);
        }
        return false;
    }
    
    // Create the overlay element
    function createOverlay() {
        if (overlayElement) return;
        
        overlayElement = document.createElement('div');
        overlayElement.id = 'controller-button-overlay';
        overlayElement.style.cssText = `
            position: fixed;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            padding: 10px 12px;
            border-radius: 6px;
            font-family: 'GameFont', Arial, sans-serif;
            font-size: 12px;
            border: 1px solid rgba(255, 255, 255, 0.4);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(4px);
            display: none;
            min-width: 160px;
        `;
        
        // Position the overlay
        setOverlayPosition();
        
        document.body.appendChild(overlayElement);
        console.log('[SimpleControllerOverlay] Overlay element created');
    }
    
    function setOverlayPosition() {
        if (!overlayElement) return;
        
        // Clear existing position styles
        overlayElement.style.top = '';
        overlayElement.style.bottom = '';
        overlayElement.style.left = '';
        overlayElement.style.right = '';
        
        switch (config.overlayPosition) {
            case 'menu-right':
                // Position in true upper right corner near RPG Maker MZ pause menu
                overlayElement.style.top = '20px';
                overlayElement.style.right = '20px';
                break;
            case 'bottom-right':
                overlayElement.style.bottom = '20px';
                overlayElement.style.right = '20px';
                break;
            case 'bottom-left':
                overlayElement.style.bottom = '20px';
                overlayElement.style.left = '20px';
                break;
            case 'top-right':
                overlayElement.style.top = '20px';
                overlayElement.style.right = '20px';
                break;
            case 'top-left':
                overlayElement.style.top = '20px';
                overlayElement.style.left = '20px';
                break;
        }
    }
    
    // Update overlay content based on controller type
    function updateOverlayContent() {
        if (!overlayElement) return;
        
        let content = '';
        
        if (currentControllerType === 'ps') {
            // PlayStation DualSense buttons - Default PS layout
            content = `
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <div style="width: 26px; height: 26px; background: linear-gradient(145deg, #E91E63, #AD1457); border-radius: 4px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid #880E4F; position: relative;">
                                <div style="width: 14px; height: 14px; background: white; border-radius: 2px; box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);"></div>
                            </div>
                            <span style="font-size: 12px; font-weight: 600;">Select</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <div style="width: 26px; height: 26px; background: linear-gradient(145deg, #2196F3, #1565C0); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid #0D47A1;">×</div>
                            <span style="font-size: 12px; font-weight: 600;">Back</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <div style="width: 26px; height: 26px; background: linear-gradient(145deg, #4CAF50, #2E7D32); border-radius: 0; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid #1B5E20; transform: rotate(0deg);">△</div>
                            <span style="font-size: 12px; font-weight: 600;">Menu</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <div style="width: 26px; height: 26px; background: linear-gradient(145deg, #9E9E9E, #616161); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 1px solid #424242;">R3</div>
                            <span style="font-size: 12px; font-weight: 600;">Jump</span>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // Xbox controller buttons - Default Xbox layout
            content = `
                <div style="display: flex; flex-direction: column; gap: 10px;">
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <div style="width: 26px; height: 26px; background: linear-gradient(145deg, #003E7E, #001F3F); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid #001122;">X</div>
                            <span style="font-size: 12px; font-weight: 600;">Select</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <div style="width: 26px; height: 26px; background: linear-gradient(145deg, #4CAF50, #2E7D32); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 900; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid #1B5E20;">A</div>
                            <span style="font-size: 12px; font-weight: 600;">Back</span>
                        </div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 14px;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <div style="width: 26px; height: 26px; background: linear-gradient(145deg, #FFD700, #FFA000); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: black; font-weight: 900; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 2px solid #FF8F00;">Y</div>
                            <span style="font-size: 12px; font-weight: 600;">Menu</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px;">
                            <div style="width: 26px; height: 26px; background: linear-gradient(145deg, #9E9E9E, #616161); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700; font-size: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.3); border: 1px solid #424242;">R3</div>
                            <span style="font-size: 12px; font-weight: 600;">Jump</span>
                        </div>
                    </div>
                </div>
            `;
        }
        
        overlayElement.innerHTML = content;
    }
    
    // Show or hide overlay based on conditions
    function updateOverlayVisibility() {
        if (!overlayElement) return;
        
        const shouldShow = isControllerConnected && (!config.showOnlyInMenus || isInMenuScene());
        
        overlayElement.style.display = shouldShow ? 'flex' : 'none';
        
        if (shouldShow) {
            updateOverlayContent();
        }
    }
    
    // Check if we're in a menu scene
    function isInMenuScene() {
        if (!SceneManager._scene) return false;
        
        const scene = SceneManager._scene;
        return scene instanceof Scene_Menu || 
               scene instanceof Scene_Item || 
               scene instanceof Scene_Skill || 
               scene instanceof Scene_Equip || 
               scene instanceof Scene_Status || 
               scene instanceof Scene_Options || 
               scene instanceof Scene_Save || 
               scene instanceof Scene_Load ||
               scene instanceof Scene_GameEnd ||
               scene instanceof Scene_Battle;
    }
    
    // Main update function - completely isolated from other controller systems
    function updateControllerStatus() {
        try {
            const wasConnected = isControllerConnected;
            isControllerConnected = detectController();
            
            if (wasConnected !== isControllerConnected) {
                console.log(`[SimpleControllerOverlay] Controller ${isControllerConnected ? 'connected' : 'disconnected'} - Type: ${currentControllerType}`);
            }
            
            updateOverlayVisibility();
        } catch (error) {
            // Prevent any errors from affecting other systems
            console.log('[SimpleControllerOverlay] Update error (isolated):', error.message);
        }
    }
    
    // Initialize when the game starts
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        
        console.log('[SimpleControllerOverlay] Initializing simple controller overlay...');
        
        // Create the overlay element immediately
        createOverlay();
        updateControllerStatus();
        
        // Set up regular controller checking
        setInterval(updateControllerStatus, 1000);
        
        console.log('[SimpleControllerOverlay] Simple controller overlay initialized!');
    };
    
    // Update overlay when scene changes
    const _SceneManager_goto = SceneManager.goto;
    SceneManager.goto = function(sceneClass) {
        _SceneManager_goto.call(this, sceneClass);
        
        // Update overlay visibility after scene change
        setTimeout(() => {
            updateOverlayVisibility();
        }, 100);
    };
    
    // Debug function
    window.testControllerOverlay = function() {
        console.log('=== CONTROLLER OVERLAY TEST ===');
        console.log('Controller connected:', isControllerConnected);
        console.log('Controller type:', currentControllerType);
        console.log('In menu scene:', isInMenuScene());
        console.log('Show only in menus:', config.showOnlyInMenus);
        console.log('Overlay element exists:', !!overlayElement);
        console.log('Overlay visible:', overlayElement ? overlayElement.style.display : 'N/A');
        
        if (overlayElement) {
            // Force show overlay for testing
            isControllerConnected = true;
            updateOverlayVisibility();
            console.log('Overlay forced visible for testing');
        }
    };
    
    console.log('[SimpleControllerOverlay] Plugin loaded successfully!');
    
})();
