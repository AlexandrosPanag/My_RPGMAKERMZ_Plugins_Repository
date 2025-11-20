//=============================================================================
// WeaponEquipSystem.js
// v1.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Allows custom weapon sprites per weapon using note tags
 * @author Alexandros Panagiotakopoulos
 * @url https://alexandrospanag.github.io
 * @date 20-11-2025
 * @version 1.0.0
 * @license (CC BY-4.0) Creative Commons Attribution 4.0 International License (CC BY-4.0).

 * 
 * @help WeaponEquipSystem.js
 * 
 * This plugin allows you to set custom weapon sprites for each weapon
 * in the database using note tags.
 * 
 * HOW TO USE:
 * ============
 * 1. Place your weapon sprite files in img/system/ folder
 * 2. Each weapon file should contain 3 frames horizontally (swing animation)
 * 3. In the Weapons database, add this note tag:
 * 
 * <weaponSprite: filename>
 * OR
 * <weaponSprite: filename, row>
 * 
 * SINGLE FILE MODE (RECOMMENDED):
 * - filename: Name of the image file with 3 frames (without .png)
 * - Image format: 3 columns x 1 row (288px x 64px for standard size)
 * 
 * EXAMPLES:
 * <weaponSprite: Axe1>           Uses Axe1.png (3 frames in one row)
 * <weaponSprite: Sword_Fire>     Uses Sword_Fire.png
 * <weaponSprite: Hammer_Heavy>   Uses Hammer_Heavy.png
 * 
 * MULTI-ROW MODE (if you still want sprite sheets):
 * <weaponSprite: MyWeapons, 0>   Uses first row of MyWeapons.png
 * <weaponSprite: MyWeapons, 1>   Uses second row of MyWeapons.png
 * 
 * IMAGE DIMENSIONS:
 * - Each frame should be 96px wide and 64px tall
 * - Total image size for single row: 288px x 64px
 * - For multi-row sheets, height should be 64px * number of rows
 * 
 * LICENSE:
 * This plugin is licensed under the Creative Commons Attribution 4.0 International License (CC BY-4.0).
 * You are free to share and adapt this work, even for commercial purposes, as long as you give appropriate credit.
 */

(() => {
    'use strict';

    // Parse weapon note tags
    const _DataManager_extractMetadata = DataManager.extractMetadata;
    DataManager.extractMetadata = function(data) {
        _DataManager_extractMetadata.call(this, data);
        if (data.meta && data.note) {
            // Try format with row number first: <weaponSprite: filename, row>
            let match = data.note.match(/<weaponSprite:\s*(.+?)\s*,\s*(\d+)>/i);
            if (match) {
                data.weaponSpriteFile = match[1].trim();
                data.weaponSpriteRow = parseInt(match[2]);
            } else {
                // Try single file format: <weaponSprite: filename>
                match = data.note.match(/<weaponSprite:\s*(.+?)>/i);
                if (match) {
                    data.weaponSpriteFile = match[1].trim();
                    data.weaponSpriteRow = 0; // Default to first row
                }
            }
        }
    };

    // Override weapon sprite loading
    const _Sprite_Weapon_loadBitmap = Sprite_Weapon.prototype.loadBitmap;
    Sprite_Weapon.prototype.loadBitmap = function() {
        const weapon = this.weaponData();
        if (weapon && weapon.weaponSpriteFile) {
            this.bitmap = ImageManager.loadSystem(weapon.weaponSpriteFile);
            this._customWeapon = true;
            this._customRow = weapon.weaponSpriteRow || 0;
        } else {
            _Sprite_Weapon_loadBitmap.call(this);
            this._customWeapon = false;
        }
    };

    // Get weapon data
    Sprite_Weapon.prototype.weaponData = function() {
        if (this._weaponImageId > 0) {
            return $dataWeapons[this._weaponImageId];
        }
        return null;
    };

    // Override update frame for custom weapons
    const _Sprite_Weapon_updateFrame = Sprite_Weapon.prototype.updateFrame;
    Sprite_Weapon.prototype.updateFrame = function() {
        if (this._customWeapon) {
            const pattern = this._pattern;
            const w = 96; // Frame width
            const h = 64; // Frame height
            const sx = pattern * w;
            const sy = this._customRow * h;
            this.setFrame(sx, sy, w, h);
        } else {
            _Sprite_Weapon_updateFrame.call(this);
        }
    };

})();
