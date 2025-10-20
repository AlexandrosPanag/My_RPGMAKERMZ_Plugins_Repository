//=============================================================================
// Enemy_SideView_Sprites.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Allows enemies to use side-view sprite sheets like actors
 * @author Alexandros Panagiotakopoulos
 * @url https://alexandrospanag.github.io
 * @help Enemy_SideView_Sprites.js
 * 
 * This plugin allows enemies to use animated sprite sheets instead of
 * static images in side-view battle.
 * 
 * Setup:
 * 1. Create sprite sheets for enemies (same format as actor sprites)
 * 2. Place them in img/sv_enemies/ folder
 * 3. In enemy note tags, add: <SideViewSprite: filename>
 * 
 * Example:
 * <SideViewSprite: Skeleton>
 * 
 * The enemy will now use img/sv_enemies/Skeleton.png as its sprite.
 */

(() => {
    'use strict';

    //-----------------------------------------------------------------------------
    // Game_Enemy
    //-----------------------------------------------------------------------------

    const _Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
    Game_Enemy.prototype.initMembers = function() {
        _Game_Enemy_initMembers.call(this);
        this._motionType = 'walk';
        this._motion = null;
        this._motionCount = 0;
        this._pattern = 0;
    };

    Game_Enemy.prototype.isSpriteVisible = function() {
        return true;
    };

    Game_Enemy.prototype.performActionStart = function(action) {
        Game_Battler.prototype.performActionStart.call(this, action);
    };

    Game_Enemy.prototype.performAction = function(action) {
        Game_Battler.prototype.performAction.call(this, action);
        if (action.isAttack()) {
            this.performAttack();
        } else if (action.isMagicSkill()) {
            this.requestMotion('spell');
        } else if (action.isSkill()) {
            this.requestMotion('skill');
        } else if (action.isItem()) {
            this.requestMotion('item');
        }
    };

    Game_Enemy.prototype.performAttack = function() {
        const weapons = [0];
        const wtypeId = weapons[0];
        if (wtypeId) {
            this.requestMotion('thrust');
        } else {
            this.requestMotion('attack');
        }
    };

    Game_Enemy.prototype.performDamage = function() {
        Game_Battler.prototype.performDamage.call(this);
        if (this.svBattlerName()) {
            this.requestMotion('damage');
        }
        SoundManager.playEnemyDamage();
    };

    Game_Enemy.prototype.performEvasion = function() {
        Game_Battler.prototype.performEvasion.call(this);
        if (this.svBattlerName()) {
            this.requestMotion('evade');
        }
    };

    Game_Enemy.prototype.performMagicEvasion = function() {
        Game_Battler.prototype.performMagicEvasion.call(this);
        if (this.svBattlerName()) {
            this.requestMotion('evade');
        }
    };

    Game_Enemy.prototype.performCounter = function() {
        Game_Battler.prototype.performCounter.call(this);
        if (this.svBattlerName()) {
            this.requestMotion('guard');
        }
    };

    Game_Enemy.prototype.performCollapse = function() {
        Game_Battler.prototype.performCollapse.call(this);
        if (this.svBattlerName() && this.collapseType() === 0) {
            this.requestMotion('collapse');
        }
    };

    Game_Enemy.prototype.requestMotion = function(motionType) {
        this._motionType = motionType;
    };

    Game_Enemy.prototype.motionType = function() {
        return this._motionType;
    };

    Game_Enemy.prototype.startMotion = function(motionType) {
        const motion = Sprite_Actor.MOTIONS[motionType];
        if (motion) {
            this._motion = motion;
            this._motionCount = 0;
            this._pattern = 0;
        }
    };

    Game_Enemy.prototype.svBattlerName = function() {
        if (!this.enemy()) return '';
        const note = this.enemy().note;
        if (!note) return '';
        // Match the tag and capture only the filename part
        const match = note.match(/<SideViewSprite\s*:\s*([^>]+)>/i);
        if (match) {
            let filename = match[1].trim();
            // Remove .png extension if included
            filename = filename.replace(/\.png$/i, '');
            return filename;
        }
        return '';
    };

    //-----------------------------------------------------------------------------
    // Sprite_Enemy
    //-----------------------------------------------------------------------------

    const _Sprite_Enemy_initMembers = Sprite_Enemy.prototype.initMembers;
    Sprite_Enemy.prototype.initMembers = function() {
        _Sprite_Enemy_initMembers.call(this);
        this._motion = null;
        this._motionCount = 0;
        this._pattern = 0;
        this._svBattlerName = '';
    };

    const _Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
    Sprite_Enemy.prototype.setBattler = function(battler) {
        const changed = battler !== this._battler;
        _Sprite_Enemy_setBattler.call(this, battler);
        if (changed && this._enemy) {
            this._svBattlerName = this._enemy.svBattlerName();
            this._isSvSprite = !!this._svBattlerName;
            if (this._isSvSprite) {
                this.loadSvBitmap();
            }
        }
    };

    Sprite_Enemy.prototype.loadSvBitmap = function() {
        this.bitmap = ImageManager.loadSvEnemy(this._svBattlerName);
        // Don't set _mainSprite.bitmap here - it will be set by updateFrame
    };

    const _Sprite_Enemy_loadBitmap = Sprite_Enemy.prototype.loadBitmap;
    Sprite_Enemy.prototype.loadBitmap = function(name) {
        if (this._isSvSprite) {
            this.loadSvBitmap();
        } else {
            _Sprite_Enemy_loadBitmap.call(this, name);
        }
    };

    const _Sprite_Enemy_updateBitmap = Sprite_Enemy.prototype.updateBitmap;
    Sprite_Enemy.prototype.updateBitmap = function() {
        if (this._isSvSprite) {
            const name = this._enemy.svBattlerName();
            if (this._svBattlerName !== name) {
                this._svBattlerName = name;
                this.loadSvBitmap();
            }
        } else {
            _Sprite_Enemy_updateBitmap.call(this);
        }
    };

    const _Sprite_Enemy_update = Sprite_Enemy.prototype.update;
    Sprite_Enemy.prototype.update = function() {
        _Sprite_Enemy_update.call(this);
        if (this._isSvSprite) {
            this.updateMotion();
        }
    };

    const _Sprite_Enemy_updateFrame = Sprite_Enemy.prototype.updateFrame;
    Sprite_Enemy.prototype.updateFrame = function() {
        if (this._isSvSprite) {
            this.updateSvFrame();
        } else {
            _Sprite_Enemy_updateFrame.call(this);
        }
    };

    Sprite_Enemy.prototype.updateMotion = function() {
        this.setupMotion();
        if (this._motion) {
            this._motionCount++;
            if (this._motionCount >= this.motionSpeed()) {
                if (this._motion.loop) {
                    this._pattern = (this._pattern + 1) % 4;
                } else if (this._pattern < 2) {
                    this._pattern++;
                } else {
                    this.refreshMotion();
                }
                this._motionCount = 0;
            }
        }
    };

    Sprite_Enemy.prototype.setupMotion = function() {
        if (this._enemy.motionType() !== this._motion?.name) {
            this.startMotion(this._enemy.motionType());
            this._enemy.requestMotion('walk');
        }
    };

    Sprite_Enemy.prototype.startMotion = function(motionType) {
        const motion = Sprite_Actor.MOTIONS[motionType];
        if (motion) {
            this._motion = motion;
            this._motionCount = 0;
            this._pattern = 0;
        }
    };

    Sprite_Enemy.prototype.refreshMotion = function() {
        const enemy = this._enemy;
        if (enemy) {
            const stateMotion = enemy.stateMotionIndex();
            if (enemy.isInputting() || enemy.isActing()) {
                this.startMotion("walk");
            } else if (stateMotion === 3) {
                this.startMotion("dead");
            } else if (stateMotion === 2) {
                this.startMotion("sleep");
            } else if (enemy.isChanting()) {
                this.startMotion("chant");
            } else if (enemy.isGuard() || enemy.isGuardWaiting()) {
                this.startMotion("guard");
            } else if (stateMotion === 1) {
                this.startMotion("abnormal");
            } else if (enemy.isDying()) {
                this.startMotion("dying");
            } else {
                this.startMotion("walk");
            }
        }
    };

    Sprite_Enemy.prototype.motionSpeed = function() {
        return 12;
    };

    Sprite_Enemy.prototype.updateSvFrame = function() {
        const bitmap = this.bitmap;
        if (bitmap) {
            const motionIndex = this._motion ? this._motion.index : 0;
            const pattern = this._pattern < 3 ? this._pattern : 1;
            const cw = bitmap.width / 9;
            const ch = bitmap.height / 6;
            const cx = Math.floor(motionIndex / 6) * 3 + pattern;
            const cy = motionIndex % 6;
            this.setFrame(cx * cw, cy * ch, cw, ch);
            if (this._mainSprite) {
                this._mainSprite.bitmap = bitmap;
                this._mainSprite.setFrame(cx * cw, cy * ch, cw, ch);
            }
        }
    };

    //-----------------------------------------------------------------------------
    // ImageManager
    //-----------------------------------------------------------------------------

    ImageManager.loadSvEnemy = function(filename) {
        return this.loadBitmap('img/sv_enemies/', filename);
    };

})();
