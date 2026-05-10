//=============================================================================
// BoatBoardingSystem.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Defines specific dock spots where the player can board/disembark the boat.
 * @author Alexandros Panagiotakopoulos
 * @url alexandrospanag.github.io
 *
 * @param Docks
 * @text Dock Spots
 * @type struct<Dock>[]
 * @desc List of dock spots where the player can board and disembark the boat.
 * @default []
 *
 * @help BoatBoardingSystem.js
 *
 * Each dock defines:
 * - Boat tile: where the boat sits in the water
 * - Board tile: where the player stands to board (triggers "Board the boat?")
 * - Enter tile: where the player+boat move to after boarding (open water)
 * - Disembark tile: where the boat must be to trigger "Disembark here?"
 * - Exit tile: where the player lands after disembarking
 */

/*~struct~Dock:
 * @param mapId
 * @text Map ID
 * @type number
 * @min 1
 * @default 1
 *
 * @param boatX
 * @text Boat Parked X
 * @type number
 * @min 0
 * @desc The water tile where the boat sits waiting to be boarded.
 * @default 0
 *
 * @param boatY
 * @text Boat Parked Y
 * @type number
 * @min 0
 * @default 0
 *
 * @param boardX
 * @text Board Trigger X
 * @type number
 * @min 0
 * @desc The land tile where the player stands to get the "Board the boat?" prompt.
 * @default 0
 *
 * @param boardY
 * @text Board Trigger Y
 * @type number
 * @min 0
 * @default 0
 *
 * @param enterX
 * @text Enter X (after boarding)
 * @type number
 * @min 0
 * @desc Where the player+boat move to immediately after boarding. Pick open water away from the dock.
 * @default 0
 *
 * @param enterY
 * @text Enter Y (after boarding)
 * @type number
 * @min 0
 * @default 0
 *
 * @param disembarkX
 * @text Disembark Trigger X
 * @type number
 * @min 0
 * @desc The water tile the boat must be on to get the "Disembark here?" prompt.
 * @default 0
 *
 * @param disembarkY
 * @text Disembark Trigger Y
 * @type number
 * @min 0
 * @default 0
 *
 * @param exitX
 * @text Exit X (after disembarking)
 * @type number
 * @min 0
 * @desc The land tile the player lands on after disembarking.
 * @default 0
 *
 * @param exitY
 * @text Exit Y (after disembarking)
 * @type number
 * @min 0
 * @default 0
 */

(() => {
    'use strict';

    const pluginName = 'BoatBoardingSystem';
    const parameters = PluginManager.parameters(pluginName);
    const rawDocks = JSON.parse(parameters['Docks'] || '[]');

    const DOCKS = rawDocks.map(d => {
        const obj = JSON.parse(d);
        return {
            mapId:      Number(obj.mapId),
            boatX:      Number(obj.boatX),
            boatY:      Number(obj.boatY),
            boardX:     Number(obj.boardX),
            boardY:     Number(obj.boardY),
            enterX:     Number(obj.enterX),
            enterY:     Number(obj.enterY),
            disembarkX: Number(obj.disembarkX),
            disembarkY: Number(obj.disembarkY),
            exitX:      Number(obj.exitX),
            exitY:      Number(obj.exitY),
        };
    });

    let _promptLock = false;

    function currentMapDocks() {
        return DOCKS.filter(d => d.mapId === $gameMap.mapId());
    }

    // Player standing on board tile and boat is parked at boatX/boatY
    function findBoardableDock(x, y) {
        return currentMapDocks().find(d =>
            d.boardX === x && d.boardY === y &&
            $gameMap.boat()._mapId === $gameMap.mapId() &&
            $gameMap.boat().x === d.boatX && $gameMap.boat().y === d.boatY
        );
    }

    // Boat is sitting on disembark trigger tile
    function findDisembarkableDock(x, y) {
        return currentMapDocks().find(d => d.disembarkX === x && d.disembarkY === y);
    }

    function unlock() {
        const checkClose = setInterval(() => {
            if (!$gameMessage.isBusy()) {
                clearInterval(checkClose);
                setTimeout(() => { _promptLock = false; }, 300);
            }
        }, 100);
    }

    function showYesNoChoice(message, onYes, onNo) {
        if (_promptLock || $gameMessage.isBusy()) return;
        _promptLock = true;

        $gameMessage.add(message);
        $gameMessage.setChoices(['Yes', 'No'], 0, 1);
        $gameMessage.setChoiceCallback(index => {
            if (index === 0) onYes();
            else if (onNo) onNo();
            unlock();
        });
    }

    function hideParty() {
        $gamePlayer.setTransparent(true);
        $gamePlayer._followers.visibleFollowers().forEach(f => f.setTransparent(true));
    }

    function showParty() {
        $gamePlayer.setTransparent(false);
        $gamePlayer._followers.visibleFollowers().forEach(f => f.setTransparent(false));
    }

    function doBoard(dock) {
        const boat = $gameMap.boat();
        if (!boat) return;

        boat.getOn();
        $gamePlayer._vehicleType = 'boat';
        $gamePlayer._vehicleGettingOn = false;
        boat.setLocation($gameMap.mapId(), dock.enterX, dock.enterY);
        $gamePlayer.locate(dock.enterX, dock.enterY);
        $gamePlayer._followers.synchronize(dock.enterX, dock.enterY, $gamePlayer.direction());
        hideParty();
    }

    function doDisembark(dock) {
        const boat = $gameMap.boat();
        if (!boat) return;

        boat.getOff();
        $gamePlayer._vehicleType = 'walk';
        $gamePlayer._vehicleGettingOff = false;
        $gamePlayer.setDirection(2);
        boat.setLocation($gameMap.mapId(), dock.disembarkX, dock.disembarkY);
        $gamePlayer.locate(dock.exitX, dock.exitY);
        $gamePlayer._followers.synchronize(dock.exitX, dock.exitY, 2);
        showParty();
    }

    //-------------------------------------------------------------------------
    // Intercept confirm button
    //-------------------------------------------------------------------------
    const _Game_Player_triggerAction = Game_Player.prototype.triggerAction;
    Game_Player.prototype.triggerAction = function() {
        if (_promptLock) return false;

        // On boat — check for disembark trigger tile
        if (this.isInBoat()) {
            const dock = findDisembarkableDock(this.x, this.y);
            if (dock) {
                showYesNoChoice('Disembark here?', () => doDisembark(dock));
                return true;
            }
            return false;
        }

        // On foot — check for board trigger tile
        if (!this.isInVehicle()) {
            const dock = findBoardableDock(this.x, this.y);
            if (dock) {
                showYesNoChoice('Board the boat?', () => doBoard(dock));
                return true;
            }
        }

        return _Game_Player_triggerAction.call(this);
    };

    //-------------------------------------------------------------------------
    // Keep player + party hidden while in boat every frame
    //-------------------------------------------------------------------------
    const _Game_Player_update = Game_Player.prototype.update;
    Game_Player.prototype.update = function(sceneActive) {
        _Game_Player_update.call(this, sceneActive);
        if (this.isInBoat()) hideParty();
    };

    //-------------------------------------------------------------------------
    // Block default boarding/disembarking entirely
    //-------------------------------------------------------------------------
    Game_Player.prototype.getOnVehicle = function() { return false; };
    Game_Player.prototype.getOffVehicle = function() { return false; };

})();
