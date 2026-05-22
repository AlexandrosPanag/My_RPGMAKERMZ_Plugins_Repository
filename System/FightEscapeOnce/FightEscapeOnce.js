/*:
 * @target MZ
 * @plugindesc Fight/Escape prompt appears only on Turn 1. Turn 2+ skips straight to actor command menus.
 * @author Alexandros Panagiotakopoulos
 * @version 1.0.0
 *
 * @help
 * ============================================================================
 * FightEscapeOnce.js  v1.0.0
 * ============================================================================
 * By default RPG Maker MZ shows the Fight/Escape window at the start of
 * EVERY turn. This plugin makes it appear only once — on Turn 1 of each
 * battle. From Turn 2 onward the party command window is skipped entirely
 * and the game jumps straight to the first actor's command menu.
 *
 * No configuration needed. Just drop it in js/plugins/ and enable it.
 *
 * COMPATIBILITY
 * -------------
 * Hooks Scene_Battle.prototype.startPartyCommandSelection and
 * Scene_Battle.prototype.commandFight only. Should be compatible with
 * most battle system plugins. If using VisuStella Battle Core, place
 * this plugin BELOW it in the plugin list.
 * ============================================================================
 */

(() => {
  'use strict';

  // ── Track whether Fight was chosen this battle ─────────────────────────────
  // We piggyback on BattleManager since it already owns battle state.

  const _BattleManager_initMembers = BattleManager.initMembers;
  BattleManager.initMembers = function() {
    _BattleManager_initMembers.call(this);
    this._fightChosenOnce = false;
  };

  // Also reset at the very start of each new battle
  const _BattleManager_setup = BattleManager.setup;
  BattleManager.setup = function(troopId, canEscape, canLose) {
    _BattleManager_setup.call(this, troopId, canEscape, canLose);
    this._fightChosenOnce = false;
  };

  // ── Scene_Battle hooks ─────────────────────────────────────────────────────

  // This is called at the start of every turn to show Fight/Escape.
  // If fight was already chosen once this battle, skip it entirely.
  const _Scene_startPartyCommand = Scene_Battle.prototype.startPartyCommandSelection;
  Scene_Battle.prototype.startPartyCommandSelection = function() {
    if (BattleManager._fightChosenOnce) {
      // Skip the party command window — go straight to actor commands
      this.selectNextCommand();
    } else {
      // First time this battle: show it normally
      _Scene_startPartyCommand.call(this);
    }
  };

  // When the player actually picks "Fight", mark it so future turns skip it.
  const _Scene_commandFight = Scene_Battle.prototype.commandFight;
  Scene_Battle.prototype.commandFight = function() {
    BattleManager._fightChosenOnce = true;
    _Scene_commandFight.call(this);
  };

})();