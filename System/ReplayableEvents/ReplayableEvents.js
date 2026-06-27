//=============================================================================
// Replayable Events
// Version: 1.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Allows events to reset themselves after interaction, making them replayable infinitely.
 * @author Alexandros Panagiotakopoulos
 * @url https://alexandrospanag.github.io
 * @version 1.0.0
 *
 * @help ReplayableEvents.js
 *
 * ============================================================================
 * REPLAYABLE EVENTS v1.0
 * ============================================================================
 *
 * Ever wanted an event to reset itself after it runs, so the player can
 * interact with it again from scratch — no page 2 workarounds, no manual
 * self switch juggling?
 *
 * Just add ONE notetag to the event and you're done.
 *
 * ============================================================================
 * EVENT NOTE TAGS
 * ============================================================================
 *
 * <replayable>
 * When the event finishes running, all of its Self Switches (A, B, C, D)
 * are automatically reset to OFF. The event snaps back to its first valid
 * page as if it was never interacted with — ready to run again infinitely.
 *
 * ============================================================================
 * USAGE
 * ============================================================================
 *
 * 1. Open the event you want to be replayable in the RPG Maker MZ editor.
 * 2. In the event's NOTE field (top right), add:
 *        <replayable>
 * 3. That's it. No extra pages, no self switch management needed.
 *
 * The reset happens the moment the event finishes — so the very next
 * interaction starts from page 1 again.
 *
 * ============================================================================
 * EXAMPLES
 * ============================================================================
 *
 * NPC DIALOGUE THAT NEVER LOCKS:
 * Add <replayable> to any NPC event. Talk to them, they say their lines,
 * and when the event ends they reset — talk to them again and it's fresh.
 *
 * REPEATABLE CHEST / PUZZLE:
 * Add <replayable> to a chest event. Normally once self switch A is ON
 * the chest is "opened forever". With this tag, the chest resets after
 * each interaction — good for respawning loot or repeatable puzzles.
 *
 * CUTSCENE TRIGGER:
 * An event that plays a cutscene can be tagged <replayable> so the player
 * can re-trigger it as many times as they want.
 *
 * ============================================================================
 * NOTES
 * ============================================================================
 *
 * - Only Self Switches A, B, C, D are reset. Game Switches and Variables
 *   that the event may have modified are NOT touched — only the event's
 *   own self switches.
 * - If you intentionally want SOME self switches to persist (e.g. a flag
 *   that a quest is done) just use a regular Game Switch instead of a
 *   Self Switch for that flag, and it won't be affected.
 * - Compatible with events that have multiple pages — the reset brings the
 *   event back to whichever page would naturally be active with all self
 *   switches OFF.
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * Free for commercial and non-commercial use with attribution.
 *
 */

(() => {
    'use strict';

    //=========================================================================
    // DataManager - Parse notetags
    //=========================================================================

    const _DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function () {
        if (!_DataManager_isDatabaseLoaded.call(this)) return false;
        if (!this._replayableEventsLoaded) {
            this._replayableEventsLoaded = true;
        }
        return true;
    };

    //=========================================================================
    // Game_Event - Check notetag and reset on end
    //=========================================================================

    Game_Event.prototype.isReplayable = function () {
        const event = this.event();
        if (!event || !event.note) return false;
        return /<replayable>/i.test(event.note);
    };

    Game_Event.prototype.resetSelfSwitches = function () {
        const mapId = this._mapId;
        const eventId = this._eventId;
        const switches = ['A', 'B', 'C', 'D'];
        for (const key of switches) {
            const selfSwitchKey = [mapId, eventId, key];
            $gameSelfSwitches.setValue(selfSwitchKey, false);
        }
        // Refresh so the event snaps back to the correct page immediately
        this.refresh();
    };

    //=========================================================================
    // Game_Interpreter - Hook into event end
    //=========================================================================

    const _Game_Interpreter_terminate = Game_Interpreter.prototype.terminate;
    Game_Interpreter.prototype.terminate = function () {
        _Game_Interpreter_terminate.call(this);

        // Only act on map events (depth 0 = top-level interpreter),
        // not on battle events or common events called from other interpreters
        if (this._depth === 0 && this._mapId > 0 && this._eventId > 0) {
            const event = $gameMap.event(this._eventId);
            if (event && event.isReplayable()) {
                event.resetSelfSwitches();
            }
        }
    };

})();