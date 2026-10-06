//=============================================================================
// SnakeMiniGame.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc v1.0 Classic snake mini-game on a dark pixel grid.
 * @author You
 *
 * @help
 * Run the Plugin Command "Start Snake" from an event.
 * Controls: Arrow keys / numpad, or swipe on touch screens.
 * OK / Cancel (after the game ends) closes the game.
 *
 * Snake grows by 1 each time it eats a fruit.
 *  - WIN : snake reaches Max Length
 *  - LOSE: head hits its own tail (or a wall if Wrap Walls is off)
 *
 * @command start
 * @text Start Snake
 * @desc Starts the snake mini-game.
 *
 * @arg cols
 * @text Grid Columns
 * @type number
 * @min 5
 * @default 40
 *
 * @arg rows
 * @text Grid Rows
 * @type number
 * @min 5
 * @default 7
 *
 * @arg cellSize
 * @text Cell Size (px)
 * @desc Width/height of each square in pixels.
 * @type number
 * @min 2
 * @default 14
 *
 * @arg cellGap
 * @text Cell Gap (px)
 * @type number
 * @min 0
 * @default 3
 *
 * @arg fruitSize
 * @text Fruit Size (cells)
 * @desc Fruit is a square of this many cells per side.
 * @type number
 * @min 1
 * @max 3
 * @default 1
 *
 * @arg fruitColor
 * @text Fruit Color
 * @default #00ff41
 *
 * @arg snakeColor
 * @text Snake Color
 * @default #a0149f
 *
 * @arg startLength
 * @text Start Length
 * @type number
 * @min 1
 * @default 3
 *
 * @arg maxLength
 * @text Max Length (win)
 * @type number
 * @min 2
 * @default 20
 *
 * @arg speed
 * @text Frames Per Move
 * @desc Lower = faster (60 frames = 1 second).
 * @type number
 * @min 1
 * @default 8
 *
 * @arg wrapWalls
 * @text Wrap Walls
 * @type boolean
 * @default true
 *
 * @arg winSwitchId
 * @text Win Switch
 * @desc Turned ON when the player wins, OFF when they lose.
 * @type switch
 * @default 0
 *
 * @arg scoreVariableId
 * @text Length Variable
 * @desc Stores final snake length.
 * @type variable
 * @default 0
 */

(() => {
    "use strict";
    const pluginName = "SnakeMiniGame";

    let cfg = {};

    PluginManager.registerCommand(pluginName, "start", args => {
        cfg = {
            cols: Number(args.cols || 40),
            rows: Number(args.rows || 7),
            cell: Number(args.cellSize || 14),
            gap: Number(args.cellGap || 3),
            fruitSize: Number(args.fruitSize || 1),
            fruitColor: String(args.fruitColor || "#00ff41"),
            snakeColor: String(args.snakeColor || "#a0149f"),
            startLength: Number(args.startLength || 3),
            maxLength: Number(args.maxLength || 20),
            speed: Number(args.speed || 8),
            wrap: String(args.wrapWalls) !== "false",
            winSwitch: Number(args.winSwitchId || 0),
            scoreVar: Number(args.scoreVariableId || 0)
        };
        SceneManager.push(Scene_Snake);
    });

    //-------------------------------------------------------------------------
    // Scene_Snake
    //-------------------------------------------------------------------------
    class Scene_Snake extends Scene_Base {
        create() {
            super.create();
            this._bg = new Sprite(new Bitmap(Graphics.width, Graphics.height));
            this._bg.bitmap.fillAll("#05070a");
            this.addChild(this._bg);

            const step = cfg.cell + cfg.gap;
            this._boardW = cfg.cols * step - cfg.gap;
            this._boardH = cfg.rows * step - cfg.gap;
            this._board = new Sprite(new Bitmap(this._boardW, this._boardH));
            this._board.x = Math.floor((Graphics.width - this._boardW) / 2);
            this._board.y = Math.floor((Graphics.height - this._boardH) / 2);
            this.addChild(this._board);

            this._msg = new Sprite(new Bitmap(Graphics.width, 48));
            this._msg.y = this._board.y + this._boardH + 20;
            this.addChild(this._msg);

            this.initGame();
            this.draw();
        }

        initGame() {
            const cy = Math.floor(cfg.rows / 2);
            this._snake = [];
            for (let i = 0; i < cfg.startLength; i++) {
                this._snake.push({ x: 2 + cfg.startLength - i, y: cy }); // head first
            }
            this._dir = { x: 1, y: 0 };
            this._queue = [];
            this._timer = 0;
            this._state = "play"; // play | win | lose
            this._touchStart = null;
            this.spawnFruit();
        }

        spawnFruit() {
            const fs = cfg.fruitSize;
            const free = [];
            for (let x = 0; x <= cfg.cols - fs; x++) {
                for (let y = 0; y <= cfg.rows - fs; y++) {
                    let ok = true;
                    for (const s of this._snake) {
                        if (s.x >= x && s.x < x + fs && s.y >= y && s.y < y + fs) {
                            ok = false;
                            break;
                        }
                    }
                    if (ok) free.push({ x, y });
                }
            }
            this._fruit = free.length ? free[Math.randomInt(free.length)] : null;
        }

        update() {
            super.update();
            if (this._state === "play") {
                this.readInput();
                if (++this._timer >= cfg.speed) {
                    this._timer = 0;
                    this.step();
                    this.draw();
                }
            } else if (Input.isTriggered("ok") || Input.isTriggered("cancel") || TouchInput.isCancelled()) {
                this.finish();
            }
        }

        readInput() {
            const map = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
            for (const key in map) {
                if (Input.isTriggered(key)) this.queueDir(map[key][0], map[key][1]);
            }
            // swipe support
            if (TouchInput.isTriggered()) {
                this._touchStart = { x: TouchInput.x, y: TouchInput.y };
            }
            if (this._touchStart && TouchInput.isPressed()) {
                const dx = TouchInput.x - this._touchStart.x;
                const dy = TouchInput.y - this._touchStart.y;
                if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
                    if (Math.abs(dx) > Math.abs(dy)) this.queueDir(Math.sign(dx), 0);
                    else this.queueDir(0, Math.sign(dy));
                    this._touchStart = { x: TouchInput.x, y: TouchInput.y };
                }
            }
        }

        queueDir(x, y) {
            const last = this._queue.length ? this._queue[this._queue.length - 1] : this._dir;
            if (last.x === -x && last.y === -y) return; // no reversing
            if (last.x === x && last.y === y) return;
            if (this._queue.length < 2) this._queue.push({ x, y });
        }

        step() {
            if (this._queue.length) this._dir = this._queue.shift();
            const head = this._snake[0];
            let nx = head.x + this._dir.x;
            let ny = head.y + this._dir.y;

            if (cfg.wrap) {
                nx = (nx + cfg.cols) % cfg.cols;
                ny = (ny + cfg.rows) % cfg.rows;
            } else if (nx < 0 || ny < 0 || nx >= cfg.cols || ny >= cfg.rows) {
                return this.endGame("lose");
            }

            const fs = cfg.fruitSize;
            const eating = this._fruit &&
                nx >= this._fruit.x && nx < this._fruit.x + fs &&
                ny >= this._fruit.y && ny < this._fruit.y + fs;

            // tail moves away this step unless we are growing
            const body = eating ? this._snake : this._snake.slice(0, -1);
            if (body.some(s => s.x === nx && s.y === ny)) {
                this._snake.unshift({ x: nx, y: ny });
                return this.endGame("lose");
            }

            this._snake.unshift({ x: nx, y: ny });
            if (eating) {
                SoundManager.playOk();
                if (this._snake.length >= cfg.maxLength) return this.endGame("win");
                this.spawnFruit();
            } else {
                this._snake.pop();
            }
        }

        endGame(result) {
            this._state = result;
            SoundManager[result === "win" ? "playUseSkill" : "playBuzzer"]();
            this.draw();
            const b = this._msg.bitmap;
            b.clear();
            b.fontSize = 24;
            b.textColor = result === "win" ? cfg.fruitColor : "#ff5577";
            const text = result === "win"
                ? "You win! Max length reached."
                : "Game over! You bit your tail.";
            b.drawText(text + "  (OK to exit)", 0, 0, Graphics.width, 40, "center");
        }

        finish() {
            if (cfg.winSwitch > 0) $gameSwitches.setValue(cfg.winSwitch, this._state === "win");
            if (cfg.scoreVar > 0) $gameVariables.setValue(cfg.scoreVar, this._snake.length);
            SceneManager.pop();
        }

        draw() {
            const b = this._board.bitmap;
            const c = cfg.cell, step = c + cfg.gap;
            b.clear();
            const sq = (x, y, w, h, color) => {
                const ctx = b.context;
                ctx.fillStyle = color;
                ctx.beginPath();
                const r = Math.max(1, Math.floor(c / 4));
                const px = x * step, py = y * step;
                if (ctx.roundRect) ctx.roundRect(px, py, w, h, r);
                else ctx.rect(px, py, w, h);
                ctx.fill();
            };
            for (let x = 0; x < cfg.cols; x++) {
                for (let y = 0; y < cfg.rows; y++) sq(x, y, c, c, "#161b22");
            }
            if (this._fruit) {
                const fs = cfg.fruitSize;
                sq(this._fruit.x, this._fruit.y,
                    fs * step - cfg.gap, fs * step - cfg.gap, cfg.fruitColor);
            }
            this._snake.forEach((s, i) => {
                sq(s.x, s.y, c, c, i === 0 ? "#c21fc0" : cfg.snakeColor);
            });
            b._baseTexture.update();
        }
    }

    window.Scene_Snake = Scene_Snake;
})();