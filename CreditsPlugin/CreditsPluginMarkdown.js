//=============================================================================
// CreditsPlugin.js
// Copyright (c) 2025 Alexandros Panagiotakopoulos
// version 2.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Adds a Credits option to the Custom Options menu that displays credits from a markdown file.
 * @author Alexandros Panagiotakopoulos
 * @url https://alexandrospanag.github.io
 * @version 2.0.0
 * @date 13/12/2025
 * @license CC-BY-SA-4.0
 * 
 * @param creditsFile
 * @text Credits File Path
 * @desc Path to the credits markdown file (relative to project root)
 * @default data/credits.md
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
 * @param baseFontSize
 * @text Base Font Size
 * @desc Base font size for normal text
 * @type number
 * @min 12
 * @max 72
 * @default 24
 * 
 * @param textColor
 * @text Text Color
 * @desc Color of the credits text (CSS format)
 * @default #ffffff
 * 
 * @param headerColor
 * @text Header Color
 * @desc Color for headers (CSS format)
 * @default #ffcc00
 * 
 * @param subheaderColor
 * @text Subheader Color
 * @desc Color for subheaders (CSS format)
 * @default #88ccff
 * 
 * @param backgroundColor
 * @text Background Color
 * @desc Background color for credits scene (CSS format)
 * @default #000000
 * 
 * @help
 * ============================================================================
 * Credits Plugin for RPG Maker MZ (Markdown Support)
 * ============================================================================
 * 
 * This plugin adds a "Credits" option to your CustomOptionsMenu with full
 * markdown formatting support.
 * 
 * IMPORTANT: This plugin must be loaded AFTER CustomOptionsMenu.js!
 * 
 * Setup:
 * 1. Save this plugin in js/plugins folder
 * 2. Enable it in Plugin Manager BELOW CustomOptionsMenu
 * 3. Create a file named "credits.md" in your project's data folder
 * 4. Write your credits using markdown formatting
 * 
 * Supported Markdown Features:
 * - # Heading 1 (largest)
 * - ## Heading 2
 * - ### Heading 3
 * - **bold text**
 * - *italic text*
 * - Horizontal rules: --- or ___
 * - Empty lines for spacing
 * 
 * Controls:
 * - Press ESC, X, or click to return to Options menu
 * - Arrow keys to scroll manually
 */

(() => {
    'use strict';
    
    const pluginName = "CreditsPlugin";
    const parameters = PluginManager.parameters(pluginName);
    const creditsFile = String(parameters['creditsFile'] || 'data/credits.md');
    const scrollSpeed = Number(parameters['scrollSpeed'] || 1.0);
    const baseFontSize = Number(parameters['baseFontSize'] || 24);
    const textColor = String(parameters['textColor'] || '#ffffff');
    const headerColor = String(parameters['headerColor'] || '#ffcc00');
    const subheaderColor = String(parameters['subheaderColor'] || '#88ccff');
    const backgroundColor = String(parameters['backgroundColor'] || '#000000');

    //-----------------------------------------------------------------------------
    // Markdown Parser
    //-----------------------------------------------------------------------------
    
    class MarkdownParser {
        static parse(text) {
            const lines = text.split('\n');
            const parsed = [];
            
            for (let line of lines) {
                const trimmed = line.trim();
                
                // Headers
                if (trimmed.startsWith('# ')) {
                    parsed.push({
                        text: trimmed.substring(2),
                        type: 'h1',
                        fontSize: baseFontSize + 16,
                        color: headerColor,
                        bold: true,
                        align: 'center'
                    });
                } else if (trimmed.startsWith('## ')) {
                    parsed.push({
                        text: trimmed.substring(3),
                        type: 'h2',
                        fontSize: baseFontSize + 10,
                        color: headerColor,
                        bold: true,
                        align: 'left'
                    });
                } else if (trimmed.startsWith('### ')) {
                    parsed.push({
                        text: trimmed.substring(4),
                        type: 'h3',
                        fontSize: baseFontSize + 4,
                        color: subheaderColor,
                        bold: true,
                        align: 'left'
                    });
                }
                // Horizontal rule
                else if (trimmed === '---' || trimmed === '___' || trimmed === '***') {
                    parsed.push({
                        text: '',
                        type: 'hr',
                        fontSize: baseFontSize,
                        color: textColor
                    });
                }
                // Empty line
                else if (trimmed === '') {
                    parsed.push({
                        text: '',
                        type: 'empty',
                        fontSize: baseFontSize,
                        color: textColor
                    });
                }
                // Regular text with inline formatting
                else {
                    const segments = this.parseInlineFormatting(line);
                    parsed.push({
                        text: line,
                        segments: segments,
                        type: 'text',
                        fontSize: baseFontSize,
                        color: textColor,
                        align: 'left'
                    });
                }
            }
            
            return parsed;
        }
        
        static parseInlineFormatting(text) {
            const segments = [];
            let currentPos = 0;
            const regex = /(\*\*|__)(.*?)\1|\*(.+?)\*|_(.+?)_/g;
            let match;
            
            while ((match = regex.exec(text)) !== null) {
                // Add text before match
                if (match.index > currentPos) {
                    segments.push({
                        text: text.substring(currentPos, match.index),
                        bold: false,
                        italic: false
                    });
                }
                
                // Add formatted text
                const isBold = match[1] !== undefined;
                const isItalic = match[3] !== undefined || match[4] !== undefined;
                const content = match[2] || match[3] || match[4];
                
                segments.push({
                    text: content,
                    bold: isBold,
                    italic: isItalic
                });
                
                currentPos = regex.lastIndex;
            }
            
            // Add remaining text
            if (currentPos < text.length) {
                segments.push({
                    text: text.substring(currentPos),
                    bold: false,
                    italic: false
                });
            }
            
            return segments.length > 0 ? segments : [{text: text, bold: false, italic: false}];
        }
    }

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
        this._scrollY = Graphics.boxHeight;
        this._parsedCredits = [];
        this._autoScroll = true;
        this.createCustomBackground();
        this.loadCredits();
    };
    
    Scene_Credits.prototype.createCustomBackground = function() {
        this._backgroundFilter = new PIXI.filters.BlurFilter(4);
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = SceneManager.backgroundBitmap();
        this._backgroundSprite.filters = [this._backgroundFilter];
        this.addChild(this._backgroundSprite);
        
        this._overlay = new Sprite();
        this._overlay.bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
        this._overlay.bitmap.fillAll('rgba(0, 0, 0, 0.7)');
        this.addChild(this._overlay);
        
        this._backgroundFilter2 = new Sprite();
        this._backgroundFilter2.bitmap = new Bitmap(Graphics.boxWidth, Graphics.boxHeight);
        this._backgroundFilter2.bitmap.fillRect(0, 0, Graphics.boxWidth, Graphics.boxHeight, backgroundColor);
        this._backgroundFilter2.opacity = 200;
        this.addChild(this._backgroundFilter2);
    };
    
    Scene_Credits.prototype.loadCredits = function() {
        const xhr = new XMLHttpRequest();
        const url = creditsFile;
        xhr.open('GET', url);
        xhr.overrideMimeType('text/plain');
        xhr.onload = () => {
            if (xhr.status < 400) {
                this._parsedCredits = MarkdownParser.parse(xhr.responseText);
            } else {
                this._parsedCredits = MarkdownParser.parse(
                    "# Error Loading Credits\n\n" +
                    "Please create a file at:\n" +
                    creditsFile + "\n\n" +
                    "## Example Content\n" +
                    "# My Game Title\n\n" +
                    "**Created by:** Your Name\n" +
                    "**Programming:** John Doe\n" +
                    "**Art:** Jane Smith"
                );
            }
            this.createCreditsSprite();
        };
        xhr.onerror = () => {
            this._parsedCredits = MarkdownParser.parse(
                "# Error\n\nCould not load: " + creditsFile
            );
            this.createCreditsSprite();
        };
        xhr.send();
    };
    
    Scene_Credits.prototype.createCreditsSprite = function() {
        // Calculate total height
        let totalHeight = Graphics.boxHeight;
        for (const line of this._parsedCredits) {
            if (line.type === 'hr') {
                totalHeight += 30;
            } else if (line.type === 'empty') {
                totalHeight += 20;
            } else {
                totalHeight += line.fontSize + 15;
            }
        }
        totalHeight += Graphics.boxHeight;
        
        this._creditsSprite = new Sprite();
        this._creditsSprite.bitmap = new Bitmap(Graphics.boxWidth, totalHeight);
        
        let currentY = 0;
        const leftMargin = 60;
        
        for (const line of this._parsedCredits) {
            if (line.type === 'hr') {
                // Draw horizontal line
                const y = currentY + 15;
                const lineWidth = Graphics.boxWidth - (leftMargin * 2);
                this._creditsSprite.bitmap.fillRect(leftMargin, y, lineWidth, 2, textColor);
                currentY += 30;
            } else if (line.type === 'empty') {
                currentY += 20;
            } else if (line.segments) {
                // Draw text with inline formatting
                this._creditsSprite.bitmap.fontSize = line.fontSize;
                this._creditsSprite.bitmap.textColor = line.color;
                
                let x = line.align === 'center' ? Graphics.boxWidth / 2 : leftMargin;
                
                if (line.align === 'center') {
                    // Center-aligned text
                    this._creditsSprite.bitmap.drawText(
                        line.text,
                        0,
                        currentY,
                        Graphics.boxWidth,
                        line.fontSize + 10,
                        'center'
                    );
                } else {
                    // Left-aligned with formatting
                    let offsetX = x;
                    for (const segment of line.segments) {
                        this._creditsSprite.bitmap.fontBold = segment.bold;
                        this._creditsSprite.bitmap.fontItalic = segment.italic;
                        
                        const textWidth = this._creditsSprite.bitmap.measureTextWidth(segment.text);
                        this._creditsSprite.bitmap.drawText(
                            segment.text,
                            offsetX,
                            currentY,
                            textWidth + 10,
                            line.fontSize + 10,
                            'left'
                        );
                        offsetX += textWidth;
                    }
                    this._creditsSprite.bitmap.fontBold = false;
                    this._creditsSprite.bitmap.fontItalic = false;
                }
                
                currentY += line.fontSize + 15;
            } else {
                // Simple text (headers)
                this._creditsSprite.bitmap.fontSize = line.fontSize;
                this._creditsSprite.bitmap.textColor = line.color;
                this._creditsSprite.bitmap.fontBold = line.bold || false;
                
                const align = line.align || 'center';
                const x = align === 'center' ? 0 : leftMargin;
                const width = align === 'center' ? Graphics.boxWidth : Graphics.boxWidth - leftMargin;
                
                this._creditsSprite.bitmap.drawText(
                    line.text,
                    x,
                    currentY,
                    width,
                    line.fontSize + 10,
                    align
                );
                
                this._creditsSprite.bitmap.fontBold = false;
                currentY += line.fontSize + 15;
            }
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
                    this._scrollY = Graphics.boxHeight;
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
            
            const minY = -(this._creditsSprite.height - Graphics.boxHeight);
            const maxY = Graphics.boxHeight;
            this._scrollY = Math.max(minY, Math.min(maxY, this._scrollY));
            
            if (Input.isTriggered('cancel') || Input.isTriggered('ok') || TouchInput.isTriggered()) {
                SoundManager.playCancel();
                this.popScene();
            }
        }
    };
    
    window.Scene_Credits = Scene_Credits;

    //-----------------------------------------------------------------------------
    // Extend Window_CustomOptions to add Credits option
    //-----------------------------------------------------------------------------
    
    const _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        
        setTimeout(() => {
            if (typeof Window_CustomOptions === 'undefined') {
                console.warn('[CreditsPlugin] Window_CustomOptions not found. Make sure CustomOptionsMenu.js is loaded first!');
                return;
            }
            
            const _Window_CustomOptions_makeOptions = Window_CustomOptions.prototype.makeOptions;
            Window_CustomOptions.prototype.makeOptions = function() {
                const options = _Window_CustomOptions_makeOptions.call(this);
                options.push({ name: 'Credits', symbol: 'credits', type: 'button' });
                return options;
            };
            
            const _Window_CustomOptions_drawItem = Window_CustomOptions.prototype.drawItem;
            Window_CustomOptions.prototype.drawItem = function(index) {
                const option = this._options[index];
                
                if (option && option.type === 'button') {
                    const rect = this.itemLineRect(index);
                    this.drawItemBackground(index);
                    this.drawOptionName(option.name, rect);
                    this.drawButtonPrompt(rect, index);
                } else {
                    _Window_CustomOptions_drawItem.call(this, index);
                }
            };
            
            if (!Window_CustomOptions.prototype.drawButtonPrompt) {
                Window_CustomOptions.prototype.drawButtonPrompt = function(rect, index) {
                    const time = Date.now() / 1000;
                    const isSelected = index === this.index();
                    const x = rect.x + rect.width - 150;
                    const y = rect.y + 20;
                    
                    this.contents.fontSize = 20;
                    this.contents.fontBold = true;
                    
                    if (isSelected) {
                        const hue = (time * 60) % 360;
                        const pulse = Math.sin(time * 3) * 0.3 + 0.7;
                        this.changeTextColor(`hsla(${hue}, 90%, 60%, ${pulse})`);
                        this.drawText('[ PRESS OK ]', x, y, 140, 'center');
                    } else {
                        this.changeTextColor('#888888');
                        this.drawText('[ PRESS OK ]', x, y, 140, 'center');
                    }
                    
                    this.contents.fontBold = false;
                    this.resetTextColor();
                };
            }
            
            const _Window_CustomOptions_processOk = Window_CustomOptions.prototype.processOk;
            Window_CustomOptions.prototype.processOk = function() {
                const option = this._options[this.index()];
                
                if (option && option.type === 'button' && option.symbol === 'credits') {
                    SoundManager.playOk();
                    SceneManager.push(Scene_Credits);
                } else {
                    _Window_CustomOptions_processOk.call(this);
                }
            };
            
            const _Window_CustomOptions_cursorRight = Window_CustomOptions.prototype.cursorRight;
            Window_CustomOptions.prototype.cursorRight = function() {
                const option = this._options[this.index()];
                if (option && option.type === 'button') {
                    return;
                }
                _Window_CustomOptions_cursorRight.call(this);
            };
            
            const _Window_CustomOptions_cursorLeft = Window_CustomOptions.prototype.cursorLeft;
            Window_CustomOptions.prototype.cursorLeft = function() {
                const option = this._options[this.index()];
                if (option && option.type === 'button') {
                    return;
                }
                _Window_CustomOptions_cursorLeft.call(this);
            };
            
            console.log('[CreditsPlugin] Successfully integrated with CustomOptionsMenu');
        }, 100);
    };

})();
