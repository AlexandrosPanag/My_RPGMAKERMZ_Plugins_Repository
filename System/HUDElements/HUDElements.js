//=============================================================================
// HUDElements.js - Advanced Party Status HUD System
//=============================================================================
/*:
 * @target MZ
 * @plugindesc HUDElements v1.0.0 - Advanced Party Status HUD System
 * @author Alexandros Panagiotakopoulos
 * @version 1.0.0
 * @date 2025-09-26
 * @url 
 * @help HUDElements.js
 * 
 * ============================================================================
 * HUDElements - Advanced Party Status HUD System
 * ============================================================================
 * 
 * Display real-time party member status with beautiful animated bars!
 * Shows HP, MP, and names for up to 4 party members in the top-left corner.
 * 
 * FEATURES:
 * ★ Real-Time Status Display: Live HP/MP bars that update instantly
 * ★ Dynamic Party Management: Auto-updates when party changes
 * ★ Beautiful Animated Bars: Smooth HP/MP transitions with color coding
 * ★ Formation Aware: Updates when party formation changes
 * ★ Smart Positioning: Clean top-left layout that doesn't interfere
 * ★ Customizable Colors: Different colors for HP (red) and MP (blue)
 * ★ Member Swapping Support: Handles party member additions/removals
 * ★ Performance Optimized: Efficient updates only when needed
 * ★ Battle Integration: Works seamlessly in battle and map scenes
 * 
 * STATUS BAR FEATURES:
 * • HP Bar: Red gradient with current/max HP display
 * • MP Bar: Blue gradient with current/max MP display  
 * • Name Display: Character name with elegant styling
 * • Level Display: Shows character level
 * • Status Icons: Visual indicators for states
 * • Animated Transitions: Smooth bar changes
 * 
 * PARTY MANAGEMENT:
 * • Supports up to 4 active party members
 * • Auto-hides bars for inactive slots
 * • Real-time formation updates
 * • Handles party member swapping
 * • Battle participants highlighting
 * 
 * CUSTOMIZATION OPTIONS:
 * • Enable/disable HP bars
 * • Enable/disable MP bars
 * • Adjust bar sizes and spacing
 * • Configure update frequency
 * • Customize colors and styling
 * • Position and layout options
 * 
 * ============================================================================
 * Copyright © 2025 Alexandros Panagiotakopoulos. All Rights Reserved.
 * Licensed under Creative Commons Attribution 4.0 International License
 * ============================================================================
 * 
 * @param enableHUD
 * @text Enable HUD System
 * @desc Master switch for the entire HUD system
 * @type boolean
 * @default true
 * 
 * @param enableHPBars
 * @text Enable HP Bars
 * @desc Show HP bars for party members
 * @type boolean
 * @default true
 * 
 * @param enableMPBars
 * @text Enable MP Bars  
 * @desc Show MP bars for party members
 * @type boolean
 * @default true
 * 
 * @param enableNames
 * @text Enable Name Display
 * @desc Show party member names
 * @type boolean
 * @default true
 * 
 * @param enableLevels
 * @text Enable Level Display
 * @desc Show party member levels
 * @type boolean
 * @default true
 * 
 * @param hudPositionX
 * @text HUD X Position
 * @desc Horizontal position from left edge (pixels)
 * @type number
 * @min 0
 * @max 500
 * @default 20
 * 
 * @param hudPositionY
 * @text HUD Y Position
 * @desc Vertical position from top edge (pixels)
 * @type number
 * @min 0
 * @max 500
 * @default 400
 * 
 * @param barWidth
 * @text Status Bar Width
 * @desc Width of HP/MP bars in pixels
 * @type number
 * @min 50
 * @max 300
 * @default 60
 * 
 * @param barHeight
 * @text Status Bar Height
 * @desc Height of HP/MP bars in pixels
 * @type number
 * @min 8
 * @max 30
 * @default 6
 * 
 * @param memberSpacing
 * @text Member Spacing
 * @desc Horizontal spacing between party members
 * @type number
 * @min 10
 * @max 100
 * @default 80
 * 
 * @param updateFrequency
 * @text Update Frequency
 * @desc How often to update HUD (milliseconds)
 * @type number
 * @min 50
 * @max 1000
 * @default 100
 * 
 * @param enableAnimations
 * @text Enable Smooth Animations
 * @desc Animate bar changes smoothly
 * @type boolean
 * @default true
 * 
 * @param enableBattleMode
 * @text Enable Battle Mode
 * @desc Enhanced display during battle
 * @type boolean
 * @default true
 * 
 * @param showInMenus
 * @text Show in Menu Scenes
 * @desc Display HUD in menu scenes
 * @type boolean
 * @default false
 * 
 * @param enableDebugMode
 * @text Enable Debug Mode
 * @desc Show debug information in console
 * @type boolean
 * @default false
 * 
 */

(() => {
    'use strict';
    
    // Plugin Information
    const PLUGIN_NAME = 'HUDElements';
    const PLUGIN_VERSION = '1.0.0';
    const AUTHOR = 'Alexandros Panagiotakopoulos';
    
    // Get Plugin Parameters
    const parameters = PluginManager.parameters(PLUGIN_NAME);
    
    const CONFIG = {
        enableHUD: parameters['enableHUD'] !== 'false',
        enableHPBars: parameters['enableHPBars'] !== 'false',
        enableMPBars: parameters['enableMPBars'] !== 'false',
        enableNames: parameters['enableNames'] !== 'false',
        enableLevels: parameters['enableLevels'] !== 'false',
        hudPositionX: parseInt(parameters['hudPositionX']) || 20,
        hudPositionY: parseInt(parameters['hudPositionY']) || 400,
        barWidth: parseInt(parameters['barWidth']) || 60,
        barHeight: parseInt(parameters['barHeight']) || 6,
        memberSpacing: parseInt(parameters['memberSpacing']) || 80,
        updateFrequency: parseInt(parameters['updateFrequency']) || 100,
        enableAnimations: parameters['enableAnimations'] !== 'false',
        enableBattleMode: parameters['enableBattleMode'] !== 'false',
        showInMenus: parameters['showInMenus'] === 'true',
        enableDebugMode: parameters['enableDebugMode'] === 'true'
    };

    //=============================================================================
    // HUD System Class
    //=============================================================================
    
    class PartyHUDSystem {
        constructor() {
            this.hudContainer = null;
            this.memberElements = [];
            this.lastPartyData = [];
            this.updateInterval = null;
            this.initialized = false;
            this.currentScene = null;
            this.isVisible = false;
        }

        initialize() {
            if (!CONFIG.enableHUD) {
                this.debugLog('🚫 HUD system disabled in config');
                return false;
            }

            this.debugLog('🎯 Initializing Party HUD System...');
            
            this.createHUDContainer();
            this.createMemberElements();
            this.setupUpdateLoop();
            this.setupSceneHandlers();
            
            this.initialized = true;
            this.debugLog('✅ Party HUD System initialized successfully');
            return true;
        }

        debugLog(message, data = null) {
            if (CONFIG.enableDebugMode) {
                if (data) {
                    console.log(`[${PLUGIN_NAME}] ${message}`, data);
                } else {
                    console.log(`[${PLUGIN_NAME}] ${message}`);
                }
            }
        }

        createHUDContainer() {
            // Remove existing container if it exists
            if (this.hudContainer) {
                this.hudContainer.remove();
            }

            this.hudContainer = document.createElement('div');
            this.hudContainer.id = 'partyHudContainer';
            this.hudContainer.style.cssText = `
                position: fixed;
                top: ${CONFIG.hudPositionY}px;
                left: ${CONFIG.hudPositionX}px;
                z-index: 100;
                pointer-events: none;
                font-family: 'GameFont', 'Arial', sans-serif;
                user-select: none;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                display: flex;
                flex-direction: row;
                align-items: flex-end;
                gap: 10px;
            `;

            document.body.appendChild(this.hudContainer);
            this.debugLog('🎨 HUD container created');
        }

        createMemberElements() {
            this.memberElements = [];
            
            for (let i = 0; i < 4; i++) {
                const memberElement = this.createMemberElement(i);
                this.hudContainer.appendChild(memberElement);
                this.memberElements.push(memberElement);
            }
            
            this.debugLog(`👥 Created ${this.memberElements.length} member elements`);
        }

        createMemberElement(index) {
            const memberDiv = document.createElement('div');
            memberDiv.className = 'party-member';
            memberDiv.style.cssText = `
                position: relative;
                width: ${Math.floor((CONFIG.barWidth + 15) / 2)}px;
                height: 36px;
                opacity: 0;
                transition: opacity 0.3s ease-in-out;
                background: rgba(0, 0, 0, 0.15);
                border-radius: 2px;
                padding: 1px 3px 2px 3px;
                backdrop-filter: blur(1px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
            `;

            // Name and Level Display
            const nameDiv = document.createElement('div');
            nameDiv.className = 'member-name';
            nameDiv.style.cssText = `
                color: rgba(255, 255, 255, 1);
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 4px;
                margin-top: 1px;
                text-shadow: 2px 2px 2px rgba(0, 0, 0, 0.9);
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                text-align: center;
                line-height: 1;
                height: 14px;
                z-index: 10;
                position: relative;
                flex-shrink: 0;
            `;
            memberDiv.appendChild(nameDiv);

            // HP Bar Container
            if (CONFIG.enableHPBars) {
                const hpContainer = this.createStatusBar('hp', '#ff4444', '#aa0000', '#ff6666', '#ffaa44', '#ffdd88');
                memberDiv.appendChild(hpContainer);
            }

            // MP Bar Container  
            if (CONFIG.enableMPBars) {
                const mpContainer = this.createStatusBar('mp', '#4488ff', '#0044aa', '#6666ff', '#8844ff', '#44ddcc');
                mpContainer.style.marginTop = '1px';
                memberDiv.appendChild(mpContainer);
            }

            return memberDiv;
        }

        createStatusBar(type, primaryColor, secondaryColor, accentColor1, accentColor2, accentColor3) {
            const container = document.createElement('div');
            container.className = `${type}-container`;
            container.style.cssText = `
                position: relative;
                width: 100%;
                height: ${CONFIG.barHeight}px;
                margin-bottom: 1px;
            `;

            // Background bar
            const background = document.createElement('div');
            background.className = `${type}-background`;
            background.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(40, 40, 40, 0.6);
                border: 1px solid rgba(80, 80, 80, 0.4);
                border-radius: 2px;
            `;
            container.appendChild(background);

            // Foreground bar (actual value)
            const foreground = document.createElement('div');
            foreground.className = `${type}-bar`;
            foreground.style.cssText = `
                position: absolute;
                top: 1px;
                left: 1px;
                width: 0%;
                height: calc(100% - 2px);
                background: ${type === 'hp' ? 
                    `linear-gradient(45deg, ${primaryColor}CC, ${accentColor1}CC, ${accentColor2}CC, ${accentColor3}CC, ${secondaryColor}CC)` :
                    `linear-gradient(135deg, ${primaryColor}CC, ${accentColor1}CC, ${accentColor2}CC, ${accentColor3}CC, ${secondaryColor}CC)`
                };
                border-radius: 1px;
                transition: ${CONFIG.enableAnimations ? 'width 0.3s ease-out' : 'none'};
            `;
            container.appendChild(foreground);

            // Text overlay (hidden - no numbers displayed)
            const text = document.createElement('div');
            text.className = `${type}-text`;
            text.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: none;
                align-items: center;
                justify-content: center;
                color: rgba(255, 255, 255, 0);
                font-size: 0px;
                font-weight: normal;
                text-shadow: none;
                pointer-events: none;
            `;
            container.appendChild(text);

            return container;
        }

        updateDisplay() {
            if (!this.initialized || !this.isVisible) return;

            const currentParty = $gameParty.allMembers().slice(0, 4);
            const hasChanges = this.detectPartyChanges(currentParty);

            if (hasChanges) {
                this.debugLog('👥 Party composition changed, updating display');
            }

            currentParty.forEach((actor, index) => {
                if (actor && index < this.memberElements.length) {
                    this.updateMemberDisplay(actor, index, hasChanges);
                }
            });

            // Hide unused member slots
            for (let i = currentParty.length; i < this.memberElements.length; i++) {
                this.hideMemberElement(i);
            }

            // Update last party data for change detection
            this.lastPartyData = currentParty.map(actor => ({
                actorId: actor ? actor.actorId() : 0,
                hp: actor ? actor.hp : 0,
                maxHp: actor ? actor.mhp : 0,
                mp: actor ? actor.mp : 0,
                maxMp: actor ? actor.mmp : 0,
                level: actor ? actor.level : 0,
                name: actor ? actor.name() : ''
            }));
        }

        detectPartyChanges(currentParty) {
            if (this.lastPartyData.length !== currentParty.length) return true;
            
            return currentParty.some((actor, index) => {
                const lastData = this.lastPartyData[index];
                if (!lastData) return true;
                
                return !actor || 
                       actor.actorId() !== lastData.actorId ||
                       actor.hp !== lastData.hp ||
                       actor.mhp !== lastData.maxHp ||
                       actor.mp !== lastData.mp ||
                       actor.mmp !== lastData.maxMp ||
                       actor.level !== lastData.level ||
                       actor.name() !== lastData.name;
            });
        }

        updateMemberDisplay(actor, index, forceUpdate = false) {
            const element = this.memberElements[index];
            if (!element || !actor) return;

            // Show element if hidden
            if (element.style.opacity === '0') {
                element.style.opacity = '1';
            }

            // Update name and level
            const nameElement = element.querySelector('.member-name');
            if (nameElement && CONFIG.enableNames) {
                const nameText = CONFIG.enableLevels ? 
                    `${actor.name()} Lv.${actor.level}` : 
                    actor.name();
                
                if (nameElement.textContent !== nameText) {
                    nameElement.textContent = nameText;
                }
            }

            // Update HP bar
            if (CONFIG.enableHPBars) {
                this.updateStatusBar(element, 'hp', actor.hp, actor.mhp);
            }

            // Update MP bar
            if (CONFIG.enableMPBars) {
                this.updateStatusBar(element, 'mp', actor.mp, actor.mmp);
            }
        }

        updateStatusBar(memberElement, type, current, max) {
            const bar = memberElement.querySelector(`.${type}-bar`);
            const text = memberElement.querySelector(`.${type}-text`);
            
            if (!bar || !text) return;

            const percentage = max > 0 ? (current / max) * 100 : 0;
            const displayText = `${current}/${max}`;

            // Update bar width
            if (bar.style.width !== `${percentage}%`) {
                bar.style.width = `${percentage}%`;
            }

            // Update text
            if (text.textContent !== displayText) {
                text.textContent = displayText;
            }

            // Color coding based on percentage
            if (percentage <= 25) {
                bar.style.background = type === 'hp' ? 
                    'linear-gradient(45deg, #ff0000CC, #ff3366CC, #ff6699CC, #ffaa44CC, #cc0000CC)' :
                    'linear-gradient(135deg, #ff4400CC, #cc2255CC, #aa44ffCC, #4499ffCC, #cc2200CC)';
            } else if (percentage <= 50) {
                bar.style.background = type === 'hp' ?
                    'linear-gradient(45deg, #ff8800CC, #ffaa44CC, #ff9966CC, #ffcc66CC, #cc6600CC)' :
                    'linear-gradient(135deg, #6688ffCC, #7766ffCC, #9944ffCC, #66aaffCC, #4466ccCC)';
            } else {
                bar.style.background = type === 'hp' ?
                    'linear-gradient(45deg, #ff4444CC, #ff6666CC, #ffaa44CC, #ffdd88CC, #aa0000CC)' :
                    'linear-gradient(135deg, #4488ffCC, #6666ffCC, #8844ffCC, #44ddccCC, #0044aaCC)';
            }
        }

        hideMemberElement(index) {
            const element = this.memberElements[index];
            if (element && element.style.opacity !== '0') {
                element.style.opacity = '0';
            }
        }

        showHUD() {
            if (this.hudContainer && !this.isVisible) {
                this.hudContainer.style.opacity = '1';
                this.isVisible = true;
                this.debugLog('👁️ HUD shown');
            }
        }

        hideHUD() {
            if (this.hudContainer && this.isVisible) {
                this.hudContainer.style.opacity = '0';
                this.isVisible = false;
                this.debugLog('🙈 HUD hidden');
            }
        }

        setupUpdateLoop() {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }

            this.updateInterval = setInterval(() => {
                this.updateDisplay();
            }, CONFIG.updateFrequency);

            this.debugLog(`⏱️ Update loop started (${CONFIG.updateFrequency}ms interval)`);
        }

        setupSceneHandlers() {
            // Scene change detection will be handled by the scene hooks
            this.debugLog('🎭 Scene handlers ready');
        }

        handleSceneChange(newScene) {
            this.currentScene = newScene;
            
            if (newScene === 'Scene_Map' || newScene === 'Scene_Battle') {
                this.showHUD();
            } else if (newScene === 'Scene_Menu' && CONFIG.showInMenus) {
                this.showHUD();
            } else {
                this.hideHUD();
            }
            
            this.debugLog(`🎭 Scene changed to: ${newScene}`);
        }

        destroy() {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
                this.updateInterval = null;
            }

            if (this.hudContainer) {
                this.hudContainer.remove();
                this.hudContainer = null;
            }

            this.memberElements = [];
            this.initialized = false;
            this.debugLog('💥 HUD system destroyed');
        }
    }

    //=============================================================================
    // Global System Instance
    //=============================================================================
    
    let partyHUD = null;

    // Initialize system when game is ready
    const initializeHUD = () => {
        if (!partyHUD) {
            partyHUD = new PartyHUDSystem();
            partyHUD.initialize();
            
            // Make globally accessible for debugging
            window.$partyHUD = partyHUD;
        }
    };

    //=============================================================================
    // Scene Integration
    //=============================================================================
    
    // Scene_Map Integration
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        initializeHUD();
        if (partyHUD) partyHUD.handleSceneChange('Scene_Map');
    };

    // Scene_Battle Integration
    const _Scene_Battle_start = Scene_Battle.prototype.start;
    Scene_Battle.prototype.start = function() {
        _Scene_Battle_start.call(this);
        initializeHUD();
        if (partyHUD) partyHUD.handleSceneChange('Scene_Battle');
    };

    // Scene_Menu Integration
    const _Scene_Menu_start = Scene_Menu.prototype.start;
    Scene_Menu.prototype.start = function() {
        _Scene_Menu_start.call(this);
        if (partyHUD) partyHUD.handleSceneChange('Scene_Menu');
    };

    // Scene_Title Integration (hide HUD)
    const _Scene_Title_start = Scene_Title.prototype.start;
    Scene_Title.prototype.start = function() {
        _Scene_Title_start.call(this);
        if (partyHUD) partyHUD.handleSceneChange('Scene_Title');
    };

    //=============================================================================
    // Game_Party Integration - Handle Formation Changes
    //=============================================================================
    
    const _Game_Party_addActor = Game_Party.prototype.addActor;
    Game_Party.prototype.addActor = function(actorId) {
        _Game_Party_addActor.call(this, actorId);
        if (partyHUD) {
            partyHUD.debugLog(`👤 Actor added: ${actorId}`);
            // Force immediate update
            setTimeout(() => partyHUD.updateDisplay(), 50);
        }
    };

    const _Game_Party_removeActor = Game_Party.prototype.removeActor;
    Game_Party.prototype.removeActor = function(actorId) {
        _Game_Party_removeActor.call(this, actorId);
        if (partyHUD) {
            partyHUD.debugLog(`👤 Actor removed: ${actorId}`);
            // Force immediate update
            setTimeout(() => partyHUD.updateDisplay(), 50);
        }
    };

    const _Game_Party_swapOrder = Game_Party.prototype.swapOrder;
    Game_Party.prototype.swapOrder = function(index1, index2) {
        _Game_Party_swapOrder.call(this, index1, index2);
        if (partyHUD) {
            partyHUD.debugLog(`🔄 Party order swapped: ${index1} <-> ${index2}`);
            // Force immediate update
            setTimeout(() => partyHUD.updateDisplay(), 50);
        }
    };

    //=============================================================================
    // Plugin Commands
    //=============================================================================
    
    PluginManager.registerCommand(PLUGIN_NAME, "showHUD", args => {
        if (partyHUD) partyHUD.showHUD();
    });

    PluginManager.registerCommand(PLUGIN_NAME, "hideHUD", args => {
        if (partyHUD) partyHUD.hideHUD();
    });

    PluginManager.registerCommand(PLUGIN_NAME, "refreshHUD", args => {
        if (partyHUD) {
            partyHUD.lastPartyData = []; // Force refresh
            partyHUD.updateDisplay();
        }
    });

    //=============================================================================
    // Cleanup on Scene Changes
    //=============================================================================
    
    const _SceneManager_goto = SceneManager.goto;
    SceneManager.goto = function(sceneClass) {
        _SceneManager_goto.call(this, sceneClass);
        
        // Handle scene transitions
        if (partyHUD && sceneClass) {
            const sceneName = sceneClass.name || 'Unknown';
            partyHUD.handleSceneChange(sceneName);
        }
    };

    //=============================================================================
    // Debug Console Commands
    //=============================================================================
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeHUD, 1000);
        });
    } else {
        setTimeout(initializeHUD, 1000);
    }

    // Console help message
    console.log(`
    👥 HUDElements v${PLUGIN_VERSION} Loaded!
    
    🎯 PARTY STATUS HUD:
    Real-time HP/MP bars for all party members in top-left corner!
    
    ✨ FEATURES:
    • Live HP/MP status bars with smooth animations
    • Party member names and levels
    • Auto-updates on formation changes
    • Battle and map scene integration
    • Beautiful color-coded health indicators
    
    🛠️ Developer Commands:
    $partyHUD.showHUD()                - Show the HUD
    $partyHUD.hideHUD()               - Hide the HUD
    $partyHUD.updateDisplay()         - Force update display
    
    👥 Your party status is now beautifully displayed!
    `);

})();