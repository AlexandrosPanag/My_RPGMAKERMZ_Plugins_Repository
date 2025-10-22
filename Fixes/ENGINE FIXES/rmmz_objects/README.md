# Engine Modification Documentation - Game_Event.updateSelfMovement

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Engine Mod](https://img.shields.io/badge/type-Engine%20Modification-red)
![Version](https://img.shields.io/badge/version-1.0.0-green)

---

## 👤 Modified By

**Alexandros Panagiotakopoulos**

**Copyright © 2025 Alexandros Panagiotakopoulos. All Rights Reserved.**

---

## 📋 Original Copyright Notice

**Original Code © Kadokawa / GOTCHA GOTCHA GAMES Inc.**  
This document describes modifications to the core RPG Maker MZ engine code.

---

## 🎯 Overview

This modification edits the `Game_Event.prototype.updateSelfMovement` method from the core RPG Maker MZ engine to improve event processing behavior and consistency across maps.

## 🔧 Modification Details

### Modified Method
```javascript
Game_Event.prototype.updateSelfMovement = function() {
    if (
        !this._locked &&
        // Remove: this.isNearTheScreen() &&
        this.checkStop(this.stopCountThreshold())
    ) {
        switch (this._moveType) {
            case 1:
                this.moveTypeRandom();
                break;
            case 2:
                this.moveTypeTowardPlayer();
                break;
            case 3:
                this.moveTypeCustom();
                break;
        }
    }
};
