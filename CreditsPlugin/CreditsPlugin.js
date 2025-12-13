//=============================================================================
// CreditsPlugin.js
// Version 1.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Adds a Credits option to the Options menu that displays credits from a text file.
 * @author Alexandros Panagiotakopoulos
 * @date 22/11/2025
 * @url https://github.com/AlexandrosPanag/My_RPGMAKERMZ_Plugins_Repository/tree/main/CreditsPlugin
 * @version 1.0
* @license CC-BY-SA-4.0
 * 
 * @param creditsFile
 * @text Credits File Path
 * @desc Path to the credits text file (relative to project root)
 * @default data/credits.txt
 * 
 * @param scrollSpeed
 * @text Scroll Speed
 * @desc Speed of credits scrolling (lower = slower)
 * @type number
 * @min 0.1
 * @max 10
 * @decimals 1
 * @default 1.0
 * 
 * @param fontSize
 * @text Font Size
 * @desc Font size for credits text
 * @type number
 * @min 12
 * @max 72
 * @default 28
 * 
 * @param textColor
 * @text Text Color
 * @desc Color of the credits text (CSS format)
 * @default #ffffff
 * 
 * @param backgroundColor
 * @text Background Color
 * @desc Background color for credits scene (CSS format)
 * @default #000000
 * 
 * @help
 * ============================================================================
 * Credits Plugin for RPG Maker MZ
 * ============================================================================
 * 
 * This plugin adds a "Credits" option to the Options menu.
 * 
 * Setup:
 * 1. Save this plugin in js/plugins folder
 * 2. Enable it in Plugin Manager
 * 3. Create a text file named "credits.txt" in your project's data folder
 * 4. Write your credits in the text file (one line per entry)
 * 
 * The credits will scroll from bottom to top automatically.
 * 
 * Controls:
 * - Press ESC, X, or click to return to Options menu
 * - Arrow keys to scroll manually
 * 
 * Credits File Format:
 * Just write plain text, one entry per line.
 * 
 * 
 * LICENSE: CC-BY-ND 4.0
 * ============================================================================
 * Copyright (c) 2025 Alexandros Panagiotakopoulos
 * 
 * This work is licensed under the Creative Commons Attribution-NoDerivatives 4.0 
 * International License. To view a copy of this license, visit 
 * http://creativecommons.org/licenses/by-nd/4.0/
 */

(() => {
    'use strict';
    
    const pluginName = "CreditsPlugin";
    const parameters = PluginManager.parameters(pluginName);
    const creditsFile = String(parameters['creditsFile'] || 'data/credits.txt');
    const scrollSpeed = Number(parameters['scrollSpeed'] || 1.0);
    const fontSize = Number(parameters['fontSize'] || 28);
    const textColor = String(parameters['textColor'] || '#ffffff');
    const backgroundColor = String(parameters['backgroundColor'] || '#000000');

    //-----------------------------------------------------------------------------
    // Scene_Credits
    //-----------------------------------------------------------------------------
    
    function Scene_Credits() {
        this.initialize(...arguments);
    }
    
    Scene_Credits.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Credits.prototype.constructor = Scene_Credits;
    
    Scene_Credits.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };
    
    Scene_Credits.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this._scrollY = Graphics.height;
        this._creditsText = [];
        this._autoScroll = true;
        this.createCustomBackground();
        this.loadCredits();
    };
    
    Scene_Credits.prototype.createCustomBackground = function() {
        this._backgroundFilter = new Sprite();
        this._backgroundFilter.bitmap = new Bitmap(Graphics.width, Graphics.height);
        this._backgroundFilter.bitmap.fillRect(0, 0, Graphics.width, Graphics.height, backgroundColor);
        this.addChild(this._backgroundFilter);
    };
    
    Scene_Credits.prototype.loadCredits = function() {
        const xhr = new XMLHttpRequest();
        const url = creditsFile;
        xhr.open('GET', url);
        xhr.overrideMimeType('text/plain');
        xhr.onload = () => {
            if (xhr.status < 400) {
                this._creditsText = xhr.responseText.split('\n');
            } else {
                this._creditsText = [
                    "Error loading credits file!",
                    "",
                    "Please create a file at:",
                    creditsFile,
                    "",
                    "Example content:",
                    "My Game Title",
                    "",
                    "Created by: Your Name",
                    "Programming: John Doe",
                    "Art: Jane Smith"
                ];
            }
            this.createCreditsSprite();
        };
        xhr.onerror = () => {
            this._creditsText = [
                "Error loading credits file!",
                "",
                "Please create: " + creditsFile
            ];
            this.createCreditsSprite();
        };
        xhr.send();
    };
    
    Scene_Credits.prototype.createCreditsSprite = function() {
        const lineHeight = fontSize + 10;
        const totalHeight = this._creditsText.length * lineHeight + Graphics.height * 2;
        
        this._creditsSprite = new Sprite();
        this._creditsSprite.bitmap = new Bitmap(Graphics.width, totalHeight);
        this._creditsSprite.bitmap.fontSize = fontSize;
        this._creditsSprite.bitmap.textColor = textColor;
        
        for (let i = 0; i < this._creditsText.length; i++) {
            const text = this._creditsText[i];
            const y = i * lineHeight;
            this._creditsSprite.bitmap.drawText(
                text,
                0,
                y,
                Graphics.width,
                lineHeight,
                'center'
            );
        }
        
        this._creditsSprite.y = this._scrollY;
        this.addChild(this._creditsSprite);
    };
    
    Scene_Credits.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        
        if (this._creditsSprite) {
            if (this._autoScroll) {
                this._scrollY -= scrollSpeed;
                this._creditsSprite.y = this._scrollY;
                
                if (this._scrollY + this._creditsSprite.height < 0) {
                    this._scrollY = Graphics.height;
                }
            }
            
            if (Input.isPressed('up')) {
                this._autoScroll = false;
                this._scrollY += 5;
                this._creditsSprite.y = this._scrollY;
            }
            if (Input.isPressed('down')) {
                this._autoScroll = false;
                this._scrollY -= 5;
                this._creditsSprite.y = this._scrollY;
            }
            
            const minY = -(this._creditsSprite.height - Graphics.height);
            const maxY = Graphics.height;
            this._scrollY = Math.max(minY, Math.min(maxY, this._scrollY));
            
            if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isTriggered()) {
                SoundManager.playCancel();
                this.popScene();
            }
        }
    };
    
    window.Scene_Credits = Scene_Credits;

    //-----------------------------------------------------------------------------
    // Window_Options - Add Credits Command
    //-----------------------------------------------------------------------------
    
    const _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand("Credits", "credits");
    };
    
    const _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        const symbol = this.commandSymbol(index);
        if (symbol === "credits") {
            return "";
        }
        return _Window_Options_statusText.call(this, index);
    };
    
    const _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        const index = this.index();
        const symbol = this.commandSymbol(index);
        if (symbol === "credits") {
            this.playOkSound();
            this.updateInputData();
            this.deactivate();
            this.callHandler("credits");
        } else {
            _Window_Options_processOk.call(this);
        }
    };
    
    const _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function() {
        const symbol = this.commandSymbol(this.index());
        if (symbol === "credits") {
            return;
        }
        _Window_Options_cursorRight.call(this);
    };
    
    const _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function() {
        const symbol = this.commandSymbol(this.index());
        if (symbol === "credits") {
            return;
        }
        _Window_Options_cursorLeft.call(this);
    };

    //-----------------------------------------------------------------------------
    // Scene_Options - Handle Credits Command
    //-----------------------------------------------------------------------------
    
    const _Scene_Options_create = Scene_Options.prototype.create;
    Scene_Options.prototype.create = function() {
        _Scene_Options_create.call(this);
        this._optionsWindow.setHandler("credits", this.commandCredits.bind(this));
    };
    
    Scene_Options.prototype.commandCredits = function() {
        this._optionsWindow.activate();
        SceneManager.push(Scene_Credits);
    };

})();
