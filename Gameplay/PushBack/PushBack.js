/*:
 * @target MZ
 * @plugindesc Prevents walking through impassable tiles (X marked tiles)
 * @author Alexandros Panagiotokopoulos
 * @version 1.0.0
 * alexandrospanag.github.io
 * @help
 * This plugin fixes collision detection to completely prevent walking
 * through tiles marked with X (impassable).
 * No configuration needed - just install and it works automatically.
 * ============================================================================
 * PushBack Plugin
 * ============================================================================
 * 
 * Put this in an event's NOTE field:
 * 
 * <pushback: distance>
 * 
 * Example:
 * <pushback: 2>
 * 
 * This creates an invisible square around the event. When the player tries to
 * move into this zone, they get pushed back in the opposite direction.
 * 
 * Perfect for moving traffic like carriages!
 * 
 * ============================================================================
 */
(() => {
    // Override the player's movement to check for pushback zones
    const _Game_Player_moveStraight = Game_Player.prototype.moveStraight;
    Game_Player.prototype.moveStraight = function(d) {
        // Calculate where player would move to
        const x2 = $gameMap.roundXWithDirection(this.x, d);
        const y2 = $gameMap.roundYWithDirection(this.y, d);
        
        // Check if moving into a pushback zone
        if (this.isInPushbackZone(x2, y2)) {
            // Push in opposite direction instead
            const reverseDir = this.reverseDir(d);
            _Game_Player_moveStraight.call(this, reverseDir);
            return;
        }
        
        // Normal movement
        _Game_Player_moveStraight.call(this, d);
    };
    
    Game_Player.prototype.isInPushbackZone = function(x, y) {
        for (const event of $gameMap.events()) {
            if (!event || !event.event()) continue;
            
            const note = event.event().note;
            const match = note.match(/<pushback:\s*(\d+)>/i);
            
            if (match) {
                const distance = parseInt(match[1]);
                const dx = Math.abs(x - event.x);
                const dy = Math.abs(y - event.y);
                
                // Check if position is within the square zone
                if (dx <= distance && dy <= distance) {
                    return true;
                }
            }
        }
        return false;
    };
    
    Game_Player.prototype.reverseDir = function(d) {
        switch(d) {
            case 2: return 8; // Down -> Up
            case 4: return 6; // Left -> Right
            case 6: return 4; // Right -> Left
            case 8: return 2; // Up -> Down
        }
        return d;
    };
})();
