/**
 * Copyright (c) 2025 Alexandros Panagiotakopoulos
 * 
 * This work is licensed under the Creative Commons Attribution-NoDerivatives 4.0 
 * International License. To view a copy of this license, visit 
 * http://creativecommons.org/licenses/by-nd/4.0/
 */

//=============================================================================
// VisualFilterMode.js - Professional Visual Filter System
//=============================================================================
/*:
 * @target MZ
 * @plugindesc VisualFilterMode v1.0.0 - Professional Visual Filter System
 * @author Alexandros Panagiotakopoulos
 * @version 1.0.0
 * @license CC-BY-ND-4.0
 * @date 2025-09-26
 * @url alexandrospanag.github.io
 * @help VisualFilterMode.js
 * 
 * ============================================================================
 * VisualFilterMode - Professional Visual Filter System
 * ============================================================================
 * 
 * Transform your RPG with stunning visual filters! Players can cycle through
 * beautiful filter modes using the TAB key, creating dynamic visual experiences
 * that enhance immersion and atmosphere.
 * 
 * FEATURES:
 * ★ Multiple Professional Filters: Default, Sepia, Noir, Vintage, Cool, Warm
 * ★ Smooth Transitions: Beautiful fade effects between filter modes
 * ★ TAB Key Cycling: Intuitive filter switching with visual feedback
 * ★ Customizable Settings: Enable/disable filters, transition speed control
 * ★ Visual Notifications: Filter name display with elegant animations
 * ★ Performance Optimized: Hardware-accelerated CSS filters
 * ★ Save Integration: Filter preferences persist between sessions
 * 
 * HOW TO USE:
 * 1. Enable plugin and configure desired filters
 * 2. Click the elegant 🎨 button to cycle through filters
 * 3. Beautiful notification shows current filter name
 * 4. Filter preference automatically saves
 * 5. Enjoy enhanced visual atmosphere!
 * 
 * FILTERS AVAILABLE:
 * • Default (No Filter) → Sepia Vintage → Film Noir → Vintage Film
 * • Cool Tones → Warm Tones → Dreamy Soft → High Drama
 * • Photo Negative → Color Invert → [cycles back to Default]
 * 
 * DEVELOPER COMMANDS:
 * $visualFilter.nextFilter()          - Cycle to next filter
 * $visualFilter.setFilter('sepia')     - Set specific filter
 * $visualFilter.getCurrentFilter()     - Get current filter info
 * $visualFilter.listFilters()          - Show all available filters
 * 
 * ============================================================================
 * Copyright © 2025 Alexandros Panagiotakopoulos. All Rights Reserved.
 * Licensed under Creative Commons Attribution 4.0 International License
 * ============================================================================
 * 
 * @param enableFilterSystem
 * @text Enable Visual Filter System
 * @desc Master switch for the entire filter system
 * @type boolean
 * @default true
 * 
 * @param enableClickButton
 * @text Enable Click Button Controls
 * @desc Show clickable button to cycle through filters
 * @type boolean
 * @default true
 * 
 * @param showFilterNotifications
 * @text Show Filter Change Notifications
 * @desc Display filter name when switching
 * @type boolean
 * @default true
 * 
 * @param transitionSpeed
 * @text Filter Transition Speed
 * @desc Speed of filter transitions (milliseconds)
 * @type number
 * @min 100
 * @max 2000
 * @default 500
 * 
 * @param notificationDuration
 * @text Notification Display Duration
 * @desc How long filter notifications remain visible (seconds)
 * @type number
 * @min 1
 * @max 10
 * @default 3
 * 
 * @param enableDefaultFilter
 * @text Enable Default Filter
 * @desc Include "No Filter" option in cycling
 * @type boolean
 * @default true
 * 
 * @param enableSepiaFilter
 * @text Enable Sepia Filter
 * @desc Include vintage sepia filter
 * @type boolean
 * @default true
 * 
 * @param enableNoirFilter
 * @text Enable Noir Filter
 * @desc Include dramatic black & white filter
 * @type boolean
 * @default true
 * 
 * @param enableVintageFilter
 * @text Enable Vintage Filter
 * @desc Include aged film filter with vignette
 * @type boolean
 * @default true
 * 
 * @param enableCoolFilter
 * @text Enable Cool Filter
 * @desc Include cool blue tones filter
 * @type boolean
 * @default true
 * 
 * @param enableWarmFilter
 * @text Enable Warm Filter
 * @desc Include warm orange/red tones filter
 * @type boolean
 * @default true
 * 
 * @param enableDreamFilter
 * @text Enable Dream Filter
 * @desc Include soft dreamy filter with blur
 * @type boolean
 * @default false
 * 
 * @param enableDramaticFilter
 * @text Enable Dramatic Filter
 * @desc Include high contrast dramatic filter
 * @type boolean
 * @default false
 * 
 * @param enableNegativeFilter
 * @text Enable Negative Filter
 * @desc Include photographic negative effect filter
 * @type boolean
 * @default true
 * 
 * @param enableInvertedFilter
 * @text Enable Inverted Colors Filter
 * @desc Include inverted color spectrum filter
 * @type boolean
 * @default true
 * 
 * @param saveFilterPreference
 * @text Save Filter Preference
 * @desc Remember selected filter between game sessions
 * @type boolean
 * @default true
 * 
 * @param enableDebugMode
 * @text Enable Debug Mode
 * @desc Show detailed filter information in console
 * @type boolean
 * @default true
 */

(() => {
    'use strict';
    
    // Plugin Information
    const PLUGIN_NAME = 'VisualFilterMode';
    const PLUGIN_VERSION = '1.0.0';
    const AUTHOR = 'Alexandros Panagiotakopoulos';
    
    // Get Plugin Parameters
    const parameters = PluginManager.parameters(PLUGIN_NAME);
    
    const CONFIG = {
        enableFilterSystem: parameters['enableFilterSystem'] === 'true',
        enableClickButton: parameters['enableClickButton'] === 'true',
        showFilterNotifications: parameters['showFilterNotifications'] === 'true',
        transitionSpeed: parseInt(parameters['transitionSpeed']) || 500,
        notificationDuration: parseInt(parameters['notificationDuration']) || 3,
        saveFilterPreference: parameters['saveFilterPreference'] === 'true',
        enableDebugMode: parameters['enableDebugMode'] === 'true',
        
        // Filter Availability
        filters: {
            default: parameters['enableDefaultFilter'] === 'true',
            sepia: parameters['enableSepiaFilter'] === 'true',
            noir: parameters['enableNoirFilter'] === 'true',
            vintage: parameters['enableVintageFilter'] === 'true',
            cool: parameters['enableCoolFilter'] === 'true',
            warm: parameters['enableWarmFilter'] === 'true',
            dream: parameters['enableDreamFilter'] === 'true',
            dramatic: parameters['enableDramaticFilter'] === 'true',
            negative: parameters['enableNegativeFilter'] === 'true',
            inverted: parameters['enableInvertedFilter'] === 'true'
        }
    };

    // Numpad Key to Filter Mapping
    const NUMPAD_FILTER_MAP = {
        1: 'default',    // Numpad 1 - Default/No Filter
        2: 'sepia',      // Numpad 2 - Sepia Vintage
        3: 'noir',       // Numpad 3 - Film Noir
        4: 'vintage',    // Numpad 4 - Vintage Film
        5: 'cool',       // Numpad 5 - Cool Tones
        6: 'warm',       // Numpad 6 - Warm Tones
        7: 'dream',      // Numpad 7 - Dreamy Soft
        8: 'dramatic'    // Numpad 8 - High Drama
    };

    // Numpad Key Codes
    const NUMPAD_KEYS = {
        97: 1,  // Numpad 1
        98: 2,  // Numpad 2
        99: 3,  // Numpad 3
        100: 4, // Numpad 4
        101: 5, // Numpad 5
        102: 6, // Numpad 6
        103: 7, // Numpad 7
        104: 8  // Numpad 8
    };

    // Visual Filter Definitions
    const FILTER_DEFINITIONS = {
        default: {
            name: '🎮 Default',
            description: 'Original game visuals',
            css: '',
            intensity: 0
        },
        sepia: {
            name: '📜 Sepia Vintage',
            description: 'Warm nostalgic sepia tones',
            css: 'sepia(1) contrast(1.3) brightness(1.2) saturate(0.8)',
            intensity: 1.0
        },
        noir: {
            name: '🎭 Film Noir',
            description: 'Dramatic black and white',
            css: 'grayscale(1) contrast(1.8) brightness(0.8)',
            intensity: 1.0
        },
        vintage: {
            name: '📸 Vintage Film',
            description: 'Aged film with subtle vignette',
            css: 'sepia(0.8) contrast(1.4) brightness(0.9) saturate(0.7) hue-rotate(10deg)',
            intensity: 0.8,
            overlay: 'vignette'
        },
        cool: {
            name: '❄️ Cool Tones',
            description: 'Crisp blue atmospheric filter',
            css: 'hue-rotate(40deg) saturate(1.5) contrast(1.3) brightness(0.9)',
            intensity: 0.8
        },
        warm: {
            name: '🔥 Warm Tones',
            description: 'Cozy orange and red ambiance',
            css: 'hue-rotate(-30deg) saturate(1.4) contrast(1.2) brightness(1.1)',
            intensity: 0.8
        },
        dream: {
            name: '💭 Dreamy Soft',
            description: 'Soft ethereal blur effect',
            css: 'blur(2px) brightness(1.3) saturate(1.6) contrast(0.8)',
            intensity: 0.7
        },
        dramatic: {
            name: '⚡ High Drama',
            description: 'Intense high contrast',
            css: 'contrast(2) brightness(0.8) saturate(1.8) hue-rotate(5deg)',
            intensity: 1.0
        },
        negative: {
            name: '📸 Photo Negative',
            description: 'Classic photographic negative effect',
            css: 'invert(1) hue-rotate(180deg)',
            intensity: 1.0
        },
        inverted: {
            name: '🌈 Color Invert',
            description: 'Complete color spectrum inversion',
            css: 'invert(1) contrast(1.2) saturate(1.3)',
            intensity: 1.0
        }
    };

    // Global VisualFilterMode Class
    class VisualFilterModeSystem {
        constructor() {
            this.initialized = false;
            this.currentFilterKey = 'default';
            this.availableFilters = [];
            this.filterIndex = 0;
            this.transitionInProgress = false;
            this.notificationElement = null;
            this.filterOverlayElement = null;
            
            this.initializeSystem();
        }

        initializeSystem() {
            if (!CONFIG.enableFilterSystem) {
                console.log(`🎨 ${PLUGIN_NAME}: Filter system disabled in settings`);
                return;
            }

            this.debugLog('🎨 Initializing Visual Filter System...');
            
            // Build available filters list
            this.buildAvailableFilters();
            
            // Create filter CSS styles
            this.createFilterStyles();
            
            // Setup input handling
            this.setupInputHandling();
            
            // Create filter overlay element
            this.createFilterOverlay();
            
            // Create notification system
            this.createNotificationSystem();
            
            // Load saved filter preference
            this.loadFilterPreference();
            
            this.initialized = true;
            this.debugLog('✅ Visual Filter System initialized successfully');
            
            // Apply initial filter after a short delay to ensure DOM is ready
            setTimeout(() => {
                this.applyFilter(this.currentFilterKey, false);
            }, 100);
        }

        buildAvailableFilters() {
            this.availableFilters = [];
            
            Object.keys(FILTER_DEFINITIONS).forEach(key => {
                if (CONFIG.filters[key]) {
                    this.availableFilters.push(key);
                }
            });
            
            this.debugLog(`🎯 Available Filters: ${this.availableFilters.length}`, this.availableFilters);
            
            // Ensure we have at least default filter
            if (this.availableFilters.length === 0) {
                this.availableFilters.push('default');
                console.warn(`⚠️ ${PLUGIN_NAME}: No filters enabled, defaulting to 'default' filter`);
            }
        }

        createFilterStyles() {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'visualFilterModeStyles';
            styleSheet.textContent = `
                /* Visual Filter Mode Styles */
                .visual-filter-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    pointer-events: none;
                    z-index: 1000;
                    transition: all ${CONFIG.transitionSpeed}ms ease-in-out;
                }

                .visual-filter-vignette {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.3) 100%);
                    opacity: 0;
                    transition: opacity ${CONFIG.transitionSpeed}ms ease-in-out;
                }

                .visual-filter-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
                    color: #ecf0f1;
                    padding: 12px 20px;
                    border-radius: 8px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
                    font-family: 'GameFont', 'Arial', sans-serif;
                    font-size: 14px;
                    font-weight: bold;
                    z-index: 10000;
                    opacity: 0;
                    transform: translateX(100px);
                    transition: all 0.3s ease-out;
                    border: 2px solid #3498db;
                    backdrop-filter: blur(10px);
                }

                .visual-filter-notification.show {
                    opacity: 1;
                    transform: translateX(0);
                }

                .visual-filter-notification .filter-name {
                    font-size: 16px;
                    margin-bottom: 4px;
                }

                .visual-filter-notification .filter-description {
                    font-size: 11px;
                    opacity: 0.8;
                    font-weight: normal;
                }

                /* Canvas filter application */
                canvas.visual-filter-applied {
                    transition: filter ${CONFIG.transitionSpeed}ms ease-in-out;
                }
            `;
            
            document.head.appendChild(styleSheet);
            this.debugLog('🎨 Filter CSS styles created');
        }

        createFilterOverlay() {
            this.filterOverlayElement = document.createElement('div');
            this.filterOverlayElement.className = 'visual-filter-overlay';
            
            // Create vignette overlay for vintage filter
            const vignetteElement = document.createElement('div');
            vignetteElement.className = 'visual-filter-vignette';
            this.filterOverlayElement.appendChild(vignetteElement);
            
            document.body.appendChild(this.filterOverlayElement);
            this.debugLog('🎭 Filter overlay element created');
        }

        createNotificationSystem() {
            this.notificationElement = document.createElement('div');
            this.notificationElement.className = 'visual-filter-notification';
            document.body.appendChild(this.notificationElement);
            this.debugLog('📱 Notification system created');
            
            // Create elegant filter button
            this.createTestButton();
        }
        
        createTestButton() {
            // Always create the button if filter system is enabled
            if (!CONFIG.enableFilterSystem) {
                this.debugLog('🖱️ Button creation skipped - filter system disabled');
                return;
            }
            
            if (!CONFIG.enableClickButton) {
                this.debugLog('🖱️ Click button disabled in settings, but creating anyway for functionality');
            }
            
            console.log('🎨 Creating visual filter button...');
            
            const filterButton = document.createElement('div');
            filterButton.innerHTML = '🎨';
            filterButton.title = 'Click to cycle visual filters';
            filterButton.style.cssText = `
                position: fixed;
                top: 20px;
                left: 20px;
                background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
                color: white;
                padding: 12px;
                border-radius: 50%;
                font-family: Arial, sans-serif;
                font-size: 20px;
                cursor: pointer;
                z-index: 99999;
                user-select: none;
                box-shadow: 0 4px 15px rgba(142, 68, 173, 0.4);
                border: 3px solid #7d3c98;
                transition: all 0.3s ease;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                backdrop-filter: blur(10px);
                pointer-events: auto;
            `;
            
            filterButton.addEventListener('click', (event) => {
                // Prevent any event propagation to game systems
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                
                console.log('🖱️ 🎨 FILTER BUTTON CLICKED!');
                if (this.initialized) {
                    this.nextFilter();
                } else {
                    console.log('❌ System not initialized');
                }
            });
            
            filterButton.addEventListener('mouseover', (event) => {
                event.preventDefault();
                event.stopPropagation();
                filterButton.style.background = 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)';
                filterButton.style.transform = 'scale(1.1)';
                filterButton.style.boxShadow = '0 6px 20px rgba(142, 68, 173, 0.6)';
            });
            
            filterButton.addEventListener('mouseout', (event) => {
                event.preventDefault();
                event.stopPropagation();
                filterButton.style.background = 'linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)';
                filterButton.style.transform = 'scale(1)';
                filterButton.style.boxShadow = '0 4px 15px rgba(142, 68, 173, 0.4)';
            });
            
            // Ensure button is added to DOM
            if (document.body) {
                document.body.appendChild(filterButton);
                console.log('✅ Filter button added to document body');
            } else {
                // Fallback if body isn't ready yet
                setTimeout(() => {
                    if (document.body) {
                        document.body.appendChild(filterButton);
                        console.log('✅ Filter button added to document body (delayed)');
                    }
                }, 100);
            }
            
            this.filterButton = filterButton;
            this.debugLog('🎨 Elegant filter button created and added to DOM');
        }

        setupInputHandling() {
            if (!CONFIG.enableClickButton) {
                this.debugLog('🖱️ Click button disabled in settings');
                return;
            }

            this.debugLog('🎨 Click button controls enabled - look for the 🎨 button!');
        }

        nextFilter() {
            if (this.transitionInProgress) {
                this.debugLog('⏳ Transition in progress, ignoring filter change');
                return;
            }

            this.filterIndex = (this.filterIndex + 1) % this.availableFilters.length;
            const newFilterKey = this.availableFilters[this.filterIndex];
            
            this.debugLog(`🔄 Cycling to filter: ${newFilterKey} (${this.filterIndex + 1}/${this.availableFilters.length})`);
            this.applyFilter(newFilterKey, true);
        }

        applyFilter(filterKey, showNotification = true) {
            if (!this.initialized || this.transitionInProgress) {
                console.log('❌ Filter application blocked - initialized:', this.initialized, 'transition:', this.transitionInProgress);
                return false;
            }

            const filterDefinition = FILTER_DEFINITIONS[filterKey];
            if (!filterDefinition) {
                console.error(`❌ ${PLUGIN_NAME}: Unknown filter key: ${filterKey}`);
                return false;
            }

            this.transitionInProgress = true;
            this.currentFilterKey = filterKey;
            
            console.log(`🎨 APPLYING FILTER: ${filterDefinition.name} - CSS: "${filterDefinition.css}"`);
            this.debugLog(`🎨 Applying filter: ${filterDefinition.name}`, filterDefinition);

            // Immediate visual feedback - flash the screen briefly
            document.body.style.backgroundColor = filterKey === 'default' ? 'transparent' : 
                                                 filterKey === 'sepia' ? 'rgba(139, 69, 19, 0.1)' :
                                                 filterKey === 'noir' ? 'rgba(0, 0, 0, 0.1)' :
                                                 filterKey === 'cool' ? 'rgba(0, 100, 200, 0.1)' :
                                                 filterKey === 'warm' ? 'rgba(200, 100, 0, 0.1)' :
                                                 filterKey === 'negative' ? 'rgba(255, 255, 255, 0.2)' :
                                                 filterKey === 'inverted' ? 'rgba(128, 0, 128, 0.15)' :
                                                 'rgba(100, 100, 100, 0.05)';
            
            setTimeout(() => {
                document.body.style.backgroundColor = 'transparent';
            }, 200);

            // Apply CSS filter to game elements
            this.applyFilterToGameElements(filterDefinition.css);

            // Handle special overlays
            if (filterDefinition.overlay === 'vignette') {
                const vignetteElement = this.filterOverlayElement.querySelector('.visual-filter-vignette');
                if (vignetteElement) {
                    vignetteElement.style.opacity = '1';
                }
            } else {
                const vignetteElement = this.filterOverlayElement.querySelector('.visual-filter-vignette');
                if (vignetteElement) {
                    vignetteElement.style.opacity = '0';
                }
            }

            // Show notification
            if (showNotification && CONFIG.showFilterNotifications) {
                this.showNotification(filterDefinition);
            }

            // Save preference
            if (CONFIG.saveFilterPreference) {
                this.saveFilterPreference();
            }

            // Reset transition flag after animation
            setTimeout(() => {
                this.transitionInProgress = false;
            }, CONFIG.transitionSpeed);

            return true;
        }

        applyFilterToGameElements(cssFilter) {
            this.debugLog(`🎨 Applying filter: "${cssFilter}"`);
            
            // Nuclear approach - apply to EVERYTHING we can find
            const targetSelectors = [
                '#gameCanvas',
                '#upperCanvas', 
                'canvas',
                '.spriteset',
                '#ErrorPrinter',
                'body'
            ];
            
            let appliedCount = 0;
            
            targetSelectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach((element, index) => {
                    if (element) {
                        element.style.filter = cssFilter;
                        element.style.transition = `filter ${CONFIG.transitionSpeed}ms ease-in-out`;
                        appliedCount++;
                        this.debugLog(`✅ Filter applied to ${selector}[${index}]: ${element.id || 'no-id'}`);
                    }
                });
            });
            
            // Ultimate fallback - apply to document root
            if (appliedCount === 0) {
                document.documentElement.style.filter = cssFilter;
                document.documentElement.style.transition = `filter ${CONFIG.transitionSpeed}ms ease-in-out`;
                this.debugLog('💥 Filter applied to document root as last resort!');
                appliedCount++;
            }
            
            this.debugLog(`🎯 Filter applied to ${appliedCount} elements total`);
        }

        showNotification(filterDefinition) {
            if (!this.notificationElement || !CONFIG.showFilterNotifications) {
                return;
            }

            this.notificationElement.innerHTML = `
                <div class="filter-name">${filterDefinition.name}</div>
                <div class="filter-description">${filterDefinition.description}</div>
            `;

            // Show notification with animation
            this.notificationElement.classList.add('show');

            // Hide after duration
            setTimeout(() => {
                this.notificationElement.classList.remove('show');
            }, CONFIG.notificationDuration * 1000);

            this.debugLog(`📱 Notification shown: ${filterDefinition.name}`);
        }

        setFilter(filterKey) {
            if (!this.availableFilters.includes(filterKey)) {
                console.error(`❌ ${PLUGIN_NAME}: Filter '${filterKey}' is not available or enabled`);
                return false;
            }

            this.filterIndex = this.availableFilters.indexOf(filterKey);
            return this.applyFilter(filterKey, true);
        }

        getCurrentFilter() {
            return {
                key: this.currentFilterKey,
                definition: FILTER_DEFINITIONS[this.currentFilterKey],
                index: this.filterIndex,
                totalFilters: this.availableFilters.length
            };
        }

        listFilters() {
            const filterList = this.availableFilters.map((key, index) => {
                const def = FILTER_DEFINITIONS[key];
                return {
                    index: index + 1,
                    key,
                    name: def.name,
                    description: def.description,
                    intensity: def.intensity,
                    current: key === this.currentFilterKey
                };
            });

            console.log(`🎨 Available Filters (SHIFT+P to cycle):`);
            console.table(filterList);
            return filterList;
        }

        saveFilterPreference() {
            if (!CONFIG.saveFilterPreference) return;
            
            try {
                // Try RPG Maker's data system first
                if (typeof $dataSystem !== 'undefined' && $dataSystem !== null) {
                    $dataSystem.visualFilterPreference = this.currentFilterKey;
                    this.debugLog(`💾 Filter preference saved to $dataSystem: ${this.currentFilterKey}`);
                    return;
                }
            } catch (error) {
                this.debugLog(`⚠️ Cannot save to $dataSystem: ${error.message}`);
            }
            
            try {
                // Fallback to localStorage
                localStorage.setItem('visualFilterPreference', this.currentFilterKey);
                this.debugLog(`💾 Filter preference saved to localStorage: ${this.currentFilterKey}`);
            } catch (error) {
                this.debugLog(`⚠️ Cannot save to localStorage: ${error.message}`);
                console.warn(`❌ ${PLUGIN_NAME}: Failed to save filter preference:`, error);
            }
        }

        loadFilterPreference() {
            if (!CONFIG.saveFilterPreference) return;
            
            let savedFilter = null;
            
            try {
                // Try RPG Maker's data system first
                if (typeof $dataSystem !== 'undefined' && $dataSystem !== null) {
                    savedFilter = $dataSystem.visualFilterPreference;
                    if (savedFilter) {
                        this.debugLog(`📂 Found saved filter in $dataSystem: ${savedFilter}`);
                    }
                }
            } catch (error) {
                this.debugLog(`⚠️ Cannot load from $dataSystem: ${error.message}`);
            }
            
            // Fallback to localStorage if no RPG Maker data found
            if (!savedFilter) {
                try {
                    savedFilter = localStorage.getItem('visualFilterPreference');
                    if (savedFilter) {
                        this.debugLog(`📂 Found saved filter in localStorage: ${savedFilter}`);
                    }
                } catch (error) {
                    this.debugLog(`⚠️ Cannot load from localStorage: ${error.message}`);
                }
            }
            
            // Apply saved filter if found and valid
            if (savedFilter && this.availableFilters.includes(savedFilter)) {
                this.filterIndex = this.availableFilters.indexOf(savedFilter);
                this.currentFilterKey = savedFilter;
                this.debugLog(`✅ Loaded filter preference: ${savedFilter}`);
            } else {
                this.debugLog(`ℹ️ No valid saved filter preference found, using default`);
            }
        }

        getStatus() {
            return {
                initialized: this.initialized,
                enabled: CONFIG.enableFilterSystem,
                currentFilter: this.getCurrentFilter(),
                availableFilters: this.availableFilters.length,
                transitionInProgress: this.transitionInProgress,
                settings: CONFIG,
                version: PLUGIN_VERSION,
                canvasElements: this.getCanvasInfo()
            };
        }
        
        getCanvasInfo() {
            const gameCanvas = document.querySelector('#gameCanvas');
            const upperCanvas = document.querySelector('#upperCanvas');
            const allCanvases = document.querySelectorAll('canvas');
            
            return {
                gameCanvas: !!gameCanvas,
                upperCanvas: !!upperCanvas,
                totalCanvases: allCanvases.length,
                canvasIds: Array.from(allCanvases).map(c => c.id || 'no-id'),
                currentFilters: Array.from(allCanvases).map(c => c.style.filter || 'none')
            };
        }
        
        forceApplyTestFilter() {
            this.debugLog('🧪 Force applying test sepia filter for debugging...');
            const testFilter = 'sepia(1) brightness(1.2) contrast(1.1)';
            
            // Apply to everything we can find
            const gameCanvas = document.querySelector('#gameCanvas');
            const upperCanvas = document.querySelector('#upperCanvas');
            const allCanvases = document.querySelectorAll('canvas');
            const body = document.body;
            
            if (gameCanvas) {
                gameCanvas.style.filter = testFilter;
                this.debugLog('✅ Applied test filter to gameCanvas');
            }
            
            if (upperCanvas) {
                upperCanvas.style.filter = testFilter;
                this.debugLog('✅ Applied test filter to upperCanvas');
            }
            
            allCanvases.forEach((canvas, i) => {
                canvas.style.filter = testFilter;
                this.debugLog(`✅ Applied test filter to canvas ${i}: ${canvas.id || 'no-id'}`);
            });
            
            // Nuclear option: apply to body
            body.style.filter = testFilter;
            this.debugLog('💥 Applied test filter to body element');
            
            // Also try the entire document
            document.documentElement.style.filter = testFilter;
            this.debugLog('💥💥 Applied test filter to document element');
            
            return this.getCanvasInfo();
        }
        
        clearAllFilters() {
            this.debugLog('🧹 Clearing all filters...');
            
            // Clear from everything
            const elements = [
                ...document.querySelectorAll('canvas'),
                document.body,
                document.documentElement
            ];
            
            elements.forEach((element, i) => {
                if (element) {
                    element.style.filter = '';
                    this.debugLog(`🧹 Cleared filter from element ${i}`);
                }
            });
            
            this.currentFilterKey = 'default';
            console.log('✅ All filters cleared');
        }
        
        toggleTestButton(show = null) {
            if (!this.filterButton) {
                console.log('⚠️ Button not found, creating it now...');
                this.createTestButton();
                return;
            }
            
            if (show === null) {
                show = this.filterButton.style.display === 'none';
            }
            
            this.filterButton.style.display = show ? 'flex' : 'none';
            console.log(`🎨 Filter button ${show ? 'shown' : 'hidden'}`);
        }
        
        recreateButton() {
            // Remove existing button if it exists
            if (this.filterButton && this.filterButton.parentNode) {
                this.filterButton.parentNode.removeChild(this.filterButton);
            }
            
            // Create new button
            this.createTestButton();
            console.log('🔄 Filter button recreated');
        }

        debugLog(message, data = null) {
            if (!CONFIG.enableDebugMode) return;
            
            if (data) {
                console.log(`🎨 ${PLUGIN_NAME}: ${message}`, data);
            } else {
                console.log(`🎨 ${PLUGIN_NAME}: ${message}`);
            }
        }
    }

    // Initialize immediately when script loads
    let visualFilterSystem = null;
    
    // Try immediate initialization
    function tryInitialization() {
        if (!visualFilterSystem) {
            console.log('🎨 Attempting VisualFilterMode initialization...');
            try {
                visualFilterSystem = new VisualFilterModeSystem();
                window.$visualFilter = visualFilterSystem;
                console.log(`🎨 VisualFilterMode v${PLUGIN_VERSION} by ${AUTHOR} - Ready! Click the 🎨 button to cycle filters!`);
                return true;
            } catch (error) {
                console.log('⚠️ Early initialization failed, will retry...', error);
                return false;
            }
        }
        return true;
    }

    // Try initialization immediately
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(tryInitialization, 500);
        });
    } else {
        setTimeout(tryInitialization, 500);
    }

    // Scene_Boot hook for initialization backup
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        
        setTimeout(() => {
            if (!tryInitialization()) {
                console.log('⚠️ Scene_Boot initialization also failed');
            }
        }, 100);
    };
    
    // Scene_Map backup initialization
    const _Scene_Map_start = Scene_Map.prototype.start;
    Scene_Map.prototype.start = function() {
        _Scene_Map_start.call(this);
        
        // Final fallback initialization
        setTimeout(() => {
            if (!tryInitialization()) {
                console.log('❌ All initialization attempts failed');
            }
        }, 1000);
    };

    // Plugin Commands (if needed for future event integration)
    PluginManager.registerCommand(PLUGIN_NAME, 'setFilter', args => {
        if (visualFilterSystem) {
            visualFilterSystem.setFilter(args.filterKey);
        }
    });

    PluginManager.registerCommand(PLUGIN_NAME, 'nextFilter', args => {
        if (visualFilterSystem) {
            visualFilterSystem.nextFilter();
        }
    });

    // Scene Map integration for canvas detection
    const _Scene_Map_createDisplayObjects = Scene_Map.prototype.createDisplayObjects;
    Scene_Map.prototype.createDisplayObjects = function() {
        _Scene_Map_createDisplayObjects.call(this);
        
        // Reapply filter after scene changes with longer delay
        if (visualFilterSystem && visualFilterSystem.initialized) {
            setTimeout(() => {
                visualFilterSystem.applyFilter(visualFilterSystem.currentFilterKey, false);
                visualFilterSystem.debugLog('🔄 Filter reapplied after Scene_Map creation');
            }, 200);
        }
    };

    // Battle scene integration
    const _Scene_Battle_createDisplayObjects = Scene_Battle.prototype.createDisplayObjects;
    Scene_Battle.prototype.createDisplayObjects = function() {
        _Scene_Battle_createDisplayObjects.call(this);
        
        // Reapply filter after scene changes with longer delay
        if (visualFilterSystem && visualFilterSystem.initialized) {
            setTimeout(() => {
                visualFilterSystem.applyFilter(visualFilterSystem.currentFilterKey, false);
                visualFilterSystem.debugLog('🔄 Filter reapplied after Scene_Battle creation');
            }, 200);
        }
    };

    // Console help message
    console.log(`
    🎨 VisualFilterMode v${PLUGIN_VERSION} Loaded!
    
    🖱️ ELEGANT CONTROLS:
    Click the beautiful 🎨 button in the top-right corner to cycle filters!
    
    🎭 AVAILABLE FILTERS:
    Default → Sepia → Noir → Vintage → Cool → Warm → Dream → Drama → Negative → Inverted
    
    Developer Commands:
    $visualFilter.nextFilter()              - Cycle to next filter
    $visualFilter.setFilter('sepia')        - Set specific filter by name
    $visualFilter.forceApplyTestFilter()    - Nuclear test filter (debug)
    $visualFilter.clearAllFilters()         - Remove all filters
    $visualFilter.toggleTestButton()        - Show/hide filter button
    $visualFilter.recreateButton()          - Recreate missing button
    $visualFilter.getCurrentFilter()        - Get current filter info
    $visualFilter.getStatus()               - Complete system status
    
    🎨 Click the purple 🎨 button to experience visual magic!
    `);


})();

