//=============================================================================
// PinballMinigame.js
//=============================================================================

/*:
 * @target MZ
 * @plugindesc [v1.0.0] Full-featured Pinball Minigame with neon/synthwave aesthetics,
 * custom physics, configurable controls, bonus mode, win/lose branching, and score tracking.
 * @author Alexandros Panagiotakopoulos
 * @url https://alexandrospanag.github.io
 * @date 28/09/2026
 * v1.0.0
 * @help PinballMinigame.js
 *
 * @param ---Controls---
 * @default
 *
 * @param LeftFlipperKey
 * @parent ---Controls---
 * @text Left Flipper Key
 * @desc The keyboard key for the left flipper. Use JS key names (e.g. z, a, shift, control).
 * @type string
 * @default z
 *
 * @param RightFlipperKey
 * @parent ---Controls---
 * @text Right Flipper Key
 * @desc The keyboard key for the right flipper. Use JS key names (e.g. slash, m, x).
 * @type string
 * @default slash
 *
 * @param LaunchKey
 * @parent ---Controls---
 * @text Ball Launch / Plunger Key
 * @desc Key to launch the ball from the plunger lane. Hold longer for more power.
 * @type string
 * @default space
 *
 * @param ---Table---
 * @default
 *
 * @param BackgroundImage
 * @parent ---Table---
 * @text Background Image
 * @desc Optional background image file (from img/pictures/). Leave blank for procedural neon table.
 * @type file
 * @dir img/pictures
 * @default
 *
 * @param TableColor
 * @parent ---Table---
 * @text Table Primary Color
 * @desc Primary neon color for the table theme (hex). Default is cyan.
 * @type string
 * @default #00ffff
 *
 * @param TableAccentColor
 * @parent ---Table---
 * @text Table Accent Color
 * @desc Accent neon color for bumpers and effects (hex). Default is magenta.
 * @type string
 * @default #ff00ff
 *
 * @param ---Gameplay---
 * @default
 *
 * @param BallCount
 * @parent ---Gameplay---
 * @text Number of Balls
 * @desc Total balls per game. Classic pinball uses 3.
 * @type number
 * @min 1
 * @max 9
 * @default 3
 *
 * @param BonusDuration
 * @parent ---Gameplay---
 * @text Bonus Duration (seconds)
 * @desc How long the BONUS mode lasts when triggered.
 * @type number
 * @min 3
 * @max 60
 * @default 15
 *
 * @param BonusMultiplier
 * @parent ---Gameplay---
 * @text Bonus Score Multiplier
 * @desc Score multiplier during BONUS mode.
 * @type number
 * @min 2
 * @max 10
 * @default 3
 *
 * @param BonusTriggerHits
 * @parent ---Gameplay---
 * @text Bonus Trigger Hits
 * @desc Number of special target hits needed to trigger BONUS mode.
 * @type number
 * @min 1
 * @max 10
 * @default 3
 *
 * @param DefaultMinimumScore
 * @parent ---Gameplay---
 * @text Default Minimum Score
 * @desc Default score threshold to "win". Plugin Command can override per-call. 0 = always win.
 * @type number
 * @default 0
 *
 * @param ---Output---
 * @default
 *
 * @param ScoreVariable
 * @parent ---Output---
 * @text Score Variable ID
 * @desc RPG Maker variable ID to store the final pinball score. 0 = don't store.
 * @type variable
 * @default 0
 *
 * @param HighScoreVariable
 * @parent ---Output---
 * @text High Score Variable ID
 * @desc RPG Maker variable ID to store the all-time high score. 0 = don't store.
 * @type variable
 * @default 0
 *
 * @param ResultSwitch
 * @parent ---Output---
 * @text Result Switch ID
 * @desc Switch set ON if player WINS (score >= threshold), OFF if loses. Used with Conditional Branch.
 * @type switch
 * @default 0
 *
 * @param WinCommonEvent
 * @parent ---Output---
 * @text Win Common Event
 * @desc Common Event auto-run when player WINS. 0 = none. Use for cutscenes, rewards, teleports.
 * @type common_event
 * @default 0
 *
 * @param LoseCommonEvent
 * @parent ---Output---
 * @text Lose Common Event
 * @desc Common Event auto-run when player LOSES. 0 = none. Use for fail dialogue, retry prompts.
 * @type common_event
 * @default 0
 *
 * @command StartPinball
 * @text Start Pinball
 * @desc Launch the pinball minigame scene.
 *
 * @arg RequireMinimumScore
 * @text Required Minimum Score
 * @desc Score the player must reach to "win". 0 = use plugin default. Sets Result Switch ON/OFF.
 * @type number
 * @default 0
 *
 * @command StartPinballBonus
 * @text Start Pinball (Bonus Mode)
 * @desc Launch pinball starting directly in BONUS mode for story events.
 *
 * @arg RequireMinimumScore
 * @text Required Minimum Score
 * @desc Score the player must reach to "win". 0 = use plugin default.
 * @type number
 * @default 0
 *
 * @arg BonusDurationOverride
 * @text Bonus Duration Override
 * @desc Override bonus duration for this instance (seconds). 0 = use default.
 * @type number
 * @default 0
 *
 * @help
 * ============================================================================
 * PINBALL MINIGAME v1.0.0
 * ============================================================================
 *
 * A complete pinball minigame for RPG Maker MZ with:
 *  - Full physics engine (gravity, collision, sub-stepping)
 *  - Neon/synthwave procedural table with optional background image
 *  - Two configurable flippers + plunger launch
 *  - Bumpers, ramps, spinner, skill shot lane
 *  - Score display (upper-left corner)
 *  - 3 balls (configurable)
 *  - BONUS mode triggered by hitting special targets
 *  - WIN/LOSE result branching via switches and common events
 *  - Score output to RPG Maker variables
 *
 * ============================================================================
 * WIN/LOSE BRANCHING
 * ============================================================================
 *
 * Set "Required Minimum Score" in the Plugin Command (or DefaultMinimumScore
 * in plugin parameters). After the game:
 *
 *   - If score >= threshold:  Result Switch → ON,  Win Common Event runs
 *   - If score <  threshold:  Result Switch → OFF, Lose Common Event runs
 *
 * Use Conditional Branch on the Result Switch in your events:
 *
 *   ◆ Plugin Command: Start Pinball (RequireMinimumScore: 5000)
 *   ◆ Conditional Branch: Switch [Result Switch] is ON
 *     ◆ Control Self Switch: A = ON        ← unlock door
 *     ◆ Transfer Player: [Secret Room]     ← teleport
 *   ◆ Else
 *     ◆ Text: "You need 5000 points! Try again."
 *   ◆ End
 *
 * You can call this multiple times with different thresholds:
 *   - NPC 1: RequireMinimumScore 3000 → opens door
 *   - NPC 2: RequireMinimumScore 8000 → reveals secret path
 *   - NPC 3: RequireMinimumScore 15000 → teleports player
 *
 * ============================================================================
 * CONTROLS (Default)
 * ============================================================================
 *
 *   Left Flipper:  Z key  (or tap left half of screen)
 *   Right Flipper: / key  (or tap right half of screen)
 *   Launch Ball:   Space (hold & release for power)
 *   Exit:          Escape / Cancel
 *
 * ============================================================================
 */

(() => {
    "use strict";

    // ========================================================================
    // PLUGIN PARAMETERS
    // ========================================================================
    const PLUGIN_NAME = "PinballMinigame";
    const params = PluginManager.parameters(PLUGIN_NAME);

    const PARAM = {
        leftKey: String(params["LeftFlipperKey"] || "z").toLowerCase(),
        rightKey: String(params["RightFlipperKey"] || "slash").toLowerCase(),
        launchKey: String(params["LaunchKey"] || "space").toLowerCase(),
        bgImage: String(params["BackgroundImage"] || ""),
        tableColor: String(params["TableColor"] || "#00ffff"),
        accentColor: String(params["TableAccentColor"] || "#ff00ff"),
        ballCount: Number(params["BallCount"] || 3),
        bonusDuration: Number(params["BonusDuration"] || 15),
        bonusMultiplier: Number(params["BonusMultiplier"] || 3),
        bonusTriggerHits: Number(params["BonusTriggerHits"] || 3),
        defaultMinScore: Number(params["DefaultMinimumScore"] || 0),
        scoreVarId: Number(params["ScoreVariable"] || 0),
        highScoreVarId: Number(params["HighScoreVariable"] || 0),
        resultSwitchId: Number(params["ResultSwitch"] || 0),
        winCommonEventId: Number(params["WinCommonEvent"] || 0),
        loseCommonEventId: Number(params["LoseCommonEvent"] || 0),
    };

    // ========================================================================
    // COLOR UTILITIES
    // ========================================================================
    function hexToNum(hex) {
        return parseInt(hex.replace("#", ""), 16);
    }

    function hexToRgb(hex) {
        const n = hexToNum(hex);
        return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
    }

    function lerpColor(hex1, hex2, t) {
        const c1 = hexToRgb(hex1), c2 = hexToRgb(hex2);
        const r = Math.round(c1.r + (c2.r - c1.r) * t);
        const g = Math.round(c1.g + (c2.g - c1.g) * t);
        const b = Math.round(c1.b + (c2.b - c1.b) * t);
        return (r << 16) | (g << 8) | b;
    }

    function numToRgb(num) {
        return { r: (num >> 16) & 0xff, g: (num >> 8) & 0xff, b: num & 0xff };
    }

    // ========================================================================
    // VECTOR 2D
    // ========================================================================
    class Vec2 {
        constructor(x = 0, y = 0) { this.x = x; this.y = y; }
        clone() { return new Vec2(this.x, this.y); }
        set(x, y) { this.x = x; this.y = y; return this; }
        add(v) { return new Vec2(this.x + v.x, this.y + v.y); }
        sub(v) { return new Vec2(this.x - v.x, this.y - v.y); }
        scale(s) { return new Vec2(this.x * s, this.y * s); }
        dot(v) { return this.x * v.x + this.y * v.y; }
        cross(v) { return this.x * v.y - this.y * v.x; }
        len() { return Math.sqrt(this.x * this.x + this.y * this.y); }
        lenSq() { return this.x * this.x + this.y * this.y; }
        normalize() {
            const l = this.len();
            return l > 0 ? this.scale(1 / l) : new Vec2(0, 0);
        }
        perp() { return new Vec2(-this.y, this.x); }
        rotate(angle) {
            const c = Math.cos(angle), s = Math.sin(angle);
            return new Vec2(this.x * c - this.y * s, this.x * s + this.y * c);
        }
        static lerp(a, b, t) {
            return new Vec2(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t);
        }
    }

    // ========================================================================
    // INPUT KEY MAPPING
    // ========================================================================
    const KEY_NAME_MAP = {
        "a": 65, "b": 66, "c": 67, "d": 68, "e": 69, "f": 70, "g": 71,
        "h": 72, "i": 73, "j": 74, "k": 75, "l": 76, "m": 77, "n": 78,
        "o": 79, "p": 80, "q": 81, "r": 82, "s": 83, "t": 84, "u": 85,
        "v": 86, "w": 87, "x": 88, "y": 89, "z": 90,
        "0": 48, "1": 49, "2": 50, "3": 51, "4": 52,
        "5": 53, "6": 54, "7": 55, "8": 56, "9": 57,
        "space": 32, "enter": 13, "shift": 16, "control": 17, "alt": 18,
        "tab": 9, "backspace": 8,
        "left": 37, "up": 38, "right": 39, "down": 40,
        "comma": 188, "period": 190, "slash": 191,
        "semicolon": 186, "quote": 222, "bracketleft": 219,
        "bracketright": 221, "backslash": 220, "minus": 189, "equal": 187,
        "insert": 45, "delete": 46, "home": 36, "end": 35,
        "pageup": 33, "pagedown": 34,
        "f1": 112, "f2": 113, "f3": 114, "f4": 115, "f5": 116,
        "f6": 117, "f7": 118, "f8": 119, "f9": 120, "f10": 121,
        "f11": 122, "f12": 123,
    };

    const _pinballLeftKey = "pinball_left";
    const _pinballRightKey = "pinball_right";
    const _pinballLaunchKey = "pinball_launch";

    function registerPinballKeys() {
        const leftCode = KEY_NAME_MAP[PARAM.leftKey] || 90;
        const rightCode = KEY_NAME_MAP[PARAM.rightKey] || 191;
        const launchCode = KEY_NAME_MAP[PARAM.launchKey] || 32;
        Input.keyMapper[leftCode] = _pinballLeftKey;
        Input.keyMapper[rightCode] = _pinballRightKey;
        Input.keyMapper[launchCode] = _pinballLaunchKey;
    }

    // ========================================================================
    // PHYSICS CONSTANTS
    // ========================================================================
    const GRAVITY = 0.35;
    const SUB_STEPS = 10;  // Increased from 8 for crispier feel
    const BALL_RADIUS = 8;
    const BALL_RESTITUTION = 0.45;
    const WALL_RESTITUTION = 0.5;
    const BUMPER_RESTITUTION = 1.6;   // Slightly higher for punchier bumps
    const FLIPPER_RESTITUTION = 0.65;
    const FRICTION = 0.9985;  // Slightly less friction for smoother rolling
    const MAX_VELOCITY = 28;      // Higher cap for more dynamic play

    // ========================================================================
    // TABLE DIMENSIONS
    // ========================================================================
    const TABLE = {
        get width() { return Math.min(Graphics.width, 480); },
        get height() { return Graphics.height; },
        get left() { return (Graphics.width - this.width) / 2; },
        get right() { return this.left + this.width; },
        get top() { return 0; },
        get bottom() { return this.height; },
        get centerX() { return Graphics.width / 2; },
        get centerY() { return this.height / 2; },
        get plungerLaneWidth() { return 36; },
        get plungerLaneLeft() { return this.right - this.plungerLaneWidth; },
        get drainGap() { return 140; },
        get drainY() { return this.bottom - 50; },
    };

    // ========================================================================
    // COLLISION LINE SEGMENT
    // ========================================================================
    class LineSeg {
        constructor(x1, y1, x2, y2, restitution = WALL_RESTITUTION) {
            this.p1 = new Vec2(x1, y1);
            this.p2 = new Vec2(x2, y2);
            this.restitution = restitution;
        }

        closestPoint(p) {
            const d = this.p2.sub(this.p1);
            const len = d.lenSq();
            if (len === 0) return this.p1.clone();
            let t = p.sub(this.p1).dot(d) / len;
            t = Math.max(0, Math.min(1, t));
            return this.p1.add(d.scale(t));
        }

        normal() {
            const d = this.p2.sub(this.p1);
            return d.perp().normalize();
        }
    }

    // ========================================================================
    // BUMPER (CIRCLE)
    // ========================================================================
    class Bumper {
        constructor(x, y, radius, points = 100, isSpecial = false) {
            this.pos = new Vec2(x, y);
            this.radius = radius;
            this.points = points;
            this.isSpecial = isSpecial;
            this.restitution = BUMPER_RESTITUTION;
            this.hitTimer = 0;
            this.glowPhase = Math.random() * Math.PI * 2;
            // Ring pulse effect
            this.ringPulseRadius = 0;
            this.ringPulseAlpha = 0;
        }
    }

    // ========================================================================
    // SPINNER
    // ========================================================================
    class Spinner {
        constructor(x, y, width, points = 50) {
            this.pos = new Vec2(x, y);
            this.halfWidth = width / 2;
            this.points = points;
            this.angle = 0;
            this.angularVel = 0;
            this.hitTimer = 0;
        }
    }

    // ========================================================================
    // RAMP
    // ========================================================================
    class Ramp {
        constructor(points, bonusPoints = 500, restitution = WALL_RESTITUTION) {
            this.segments = [];
            this.bonusPoints = bonusPoints;
            for (let i = 0; i < points.length - 1; i++) {
                this.segments.push(new LineSeg(
                    points[i][0], points[i][1],
                    points[i + 1][0], points[i + 1][1],
                    restitution
                ));
            }
        }
    }

    // ========================================================================
    // FLIPPER (enhanced physics)
    // ========================================================================
    class Flipper {
        constructor(pivotX, pivotY, length, side, restAngle, maxAngle) {
            this.pivot = new Vec2(pivotX, pivotY);
            this.length = length;
            this.side = side;
            this.restAngle = restAngle;
            this.maxAngle = maxAngle;
            this.angle = restAngle;
            this.angularVel = 0;
            this.isPressed = false;
            this.restitution = FLIPPER_RESTITUTION;
            this.width = 10;
        }

        get tip() {
            return this.pivot.add(new Vec2(this.length, 0).rotate(this.angle));
        }

        getSegment() {
            const tip = this.tip;
            return new LineSeg(this.pivot.x, this.pivot.y, tip.x, tip.y, this.restitution);
        }

        update(dt) {
            const prevAngle = this.angle;
            const upSpeed = 0.35;       // Snappier upswing (was 0.25)
            const downSpeed = 0.14;     // Slightly faster return
            if (this.isPressed) {
                if (this.side === "left") {
                    this.angle = Math.max(this.maxAngle, this.angle - upSpeed);
                } else {
                    this.angle = Math.min(this.maxAngle, this.angle + upSpeed);
                }
            } else {
                if (this.side === "left") {
                    this.angle = Math.min(this.restAngle, this.angle + downSpeed);
                } else {
                    this.angle = Math.max(this.restAngle, this.angle - downSpeed);
                }
            }
            this.angularVel = (this.angle - prevAngle);
        }
    }

    // ========================================================================
    // PINBALL BALL (enhanced)
    // ========================================================================
    class PinballBall {
        constructor(x, y) {
            this.pos = new Vec2(x, y);
            this.vel = new Vec2(0, 0);
            this.radius = BALL_RADIUS;
            this.active = false;
            this.inPlunger = true;
            this.trail = [];
            this.spinAngle = 0; // Visual spin
        }

        update(dt) {
            if (!this.active) return;

            // Gravity
            this.vel.y += GRAVITY * dt;

            // Clamp velocity
            const speed = this.vel.len();
            if (speed > MAX_VELOCITY) {
                this.vel = this.vel.normalize().scale(MAX_VELOCITY);
            }

            // Friction
            this.vel = this.vel.scale(FRICTION);

            // Move
            this.pos.x += this.vel.x * dt;
            this.pos.y += this.vel.y * dt;

            // Visual spin based on horizontal velocity
            this.spinAngle += this.vel.x * 0.05;

            // Trail (more samples for smoother trail)
            this.trail.push(this.pos.clone());
            if (this.trail.length > 16) this.trail.shift();
        }
    }

    // ========================================================================
    // PARTICLE SYSTEM (performance-optimized)
    // ========================================================================
    const MAX_PARTICLES = 150;

    class Particle {
        constructor(x, y, vx, vy, color, life) {
            this.x = x; this.y = y;
            this.vx = vx; this.vy = vy;
            this.color = color;
            this.life = life;
            this.maxLife = life;
            this.size = 1.5 + Math.random() * 2.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.04;
            this.life--;
            this.vx *= 0.97;
            this.vy *= 0.97;
        }
        get alpha() { return Math.max(0, this.life / this.maxLife); }
        get dead() { return this.life <= 0; }
    }

    // ========================================================================
    // STARFIELD PARTICLE (background ambiance, very cheap)
    // ========================================================================
    class StarParticle {
        constructor() {
            this.reset();
            this.y = Math.random() * Graphics.height; // randomize initial Y
        }
        reset() {
            this.x = TABLE.left + Math.random() * TABLE.width;
            this.y = -2;
            this.speed = 0.15 + Math.random() * 0.4;
            this.size = 0.5 + Math.random() * 1.5;
            this.alpha = 0.1 + Math.random() * 0.25;
            this.twinklePhase = Math.random() * Math.PI * 2;
        }
        update(t) {
            this.y += this.speed;
            if (this.y > Graphics.height + 5) this.reset();
            this.currentAlpha = this.alpha * (0.6 + Math.sin(t * 0.02 + this.twinklePhase) * 0.4);
        }
    }

    // ========================================================================
    // SCREEN SHAKE SYSTEM
    // ========================================================================
    class ScreenShake {
        constructor() {
            this.intensity = 0;
            this.duration = 0;
            this.x = 0;
            this.y = 0;
        }
        trigger(intensity, duration) {
            this.intensity = Math.max(this.intensity, intensity);
            this.duration = Math.max(this.duration, duration);
        }
        update() {
            if (this.duration > 0) {
                this.duration--;
                const decay = this.duration > 0 ? this.intensity * (this.duration / 10) : 0;
                this.x = (Math.random() - 0.5) * decay * 2;
                this.y = (Math.random() - 0.5) * decay * 2;
                this.intensity *= 0.9;
            } else {
                this.x = 0;
                this.y = 0;
                this.intensity = 0;
            }
        }
    }

    // ========================================================================
    // SCENE_PINBALL
    // ========================================================================
    class Scene_Pinball extends Scene_Base {

        constructor() {
            super();
            this._scoreThreshold = 0;
            this._startInBonus = false;
            this._bonusDurationOverride = 0;
        }

        create() {
            super.create();
            registerPinballKeys();
            this.initGameState();
            this.buildTable();
            this.createLayers();
            this.drawStaticTable();  // Draw static elements ONCE
            this.createCRTOverlay();
            this.createHUD();
            this.spawnBall();

            if (this._startInBonus) {
                this.activateBonus();
            }
        }

        initGameState() {
            this._score = 0;
            this._ballsRemaining = PARAM.ballCount;
            this._ball = null;
            this._gameOver = false;
            this._gameOverTimer = 0;
            this._gameOverPhase = 0;  // 0=fadein, 1=countup, 2=stats, 3=rank, 4=result, 5=wait
            this._displayedScore = 0; // For count-up animation
            this._plungerPower = 0;
            this._plungerCharging = false;
            this._drainDelay = 0;

            // Bonus
            this._bonusActive = false;
            this._bonusTimer = 0;
            this._bonusHits = 0;
            this._bonusFlashTimer = 0;

            // Combo
            this._combo = 0;
            this._comboTimer = 0;

            // Particles
            this._particles = [];

            // Animation
            this._frameCount = 0;

            // Score popups
            this._scorePopups = [];

            // Screen shake
            this._shake = new ScreenShake();

            // Statistics tracking
            this._stats = {
                totalBumperHits: 0,
                maxCombo: 0,
                bonusActivations: 0,
                spinnerHits: 0,
                skillShotsHit: 0,
                totalFlipperHits: 0,
            };

            // Starfield
            this._stars = [];
            for (let i = 0; i < 40; i++) {
                this._stars.push(new StarParticle());
            }

            // Determine the effective score threshold
            if (this._scoreThreshold <= 0) {
                this._scoreThreshold = PARAM.defaultMinScore;
            }

            // Win/Lose result
            this._didWin = false;
        }

        // ====================================================================
        // TABLE CONSTRUCTION
        // ====================================================================
        buildTable() {
            const L = TABLE.left;
            const R = TABLE.right;
            const T = TABLE.top;
            const B = TABLE.bottom;
            const PL = TABLE.plungerLaneLeft;
            const CX = TABLE.centerX;

            this._walls = [];
            this._bumpers = [];
            this._spinners = [];
            this._ramps = [];
            this._flippers = [];
            this._skillShotTargets = [];

            // --- Outer walls ---
            this._walls.push(new LineSeg(L, B, L, T)); // Left wall
            this._walls.push(new LineSeg(L, T, R, T)); // Top wall
            this._walls.push(new LineSeg(R, T, R, B)); // Right wall
            this._walls.push(new LineSeg(L, T + 40, L + 150, T + 40)); // Top left plunger floor

            // --- Flipper area ---
            const flipperY = B - 100;
            const drainCenterX = CX;
            const drainHalfGap = TABLE.drainGap / 2;

            // (Sloped funnel walls removed as requested)

            // --- Slingshots ---
            this._slingshotLeftHit = 0;
            this._slingshotRightHit = 0;

            // --- Drain posts ---
            this._walls.push(new LineSeg(
                drainCenterX - drainHalfGap - 5, flipperY + 15,
                drainCenterX - drainHalfGap - 5, flipperY + 35
            ));
            this._walls.push(new LineSeg(
                drainCenterX + drainHalfGap + 5, flipperY + 15,
                drainCenterX + drainHalfGap + 5, flipperY + 35
            ));

            // --- Drain funnel ---
            this._walls.push(new LineSeg(
                drainCenterX - drainHalfGap - 5, flipperY + 35,
                drainCenterX - drainHalfGap, B
            ));
            this._walls.push(new LineSeg(
                drainCenterX + drainHalfGap + 5, flipperY + 35,
                drainCenterX + drainHalfGap, B
            ));

            // --- Flippers ---
            const flipperLength = 55;
            const leftFlipperX = drainCenterX - drainHalfGap + 5;
            const rightFlipperX = drainCenterX + drainHalfGap - 5;

            this._flippers.push(new Flipper(
                leftFlipperX, flipperY, flipperLength, "left", 0.45, -0.65
            ));
            this._flippers.push(new Flipper(
                rightFlipperX, flipperY, flipperLength, "right",
                Math.PI - 0.45, Math.PI + 0.65
            ));

            // --- Bumpers (triangle) ---
            const bumperY = T + 180;
            const bumperR = 22;
            this._bumpers.push(new Bumper(CX, bumperY - 40, bumperR, 100));
            this._bumpers.push(new Bumper(CX - 50, bumperY + 30, bumperR, 100));
            this._bumpers.push(new Bumper(CX + 50, bumperY + 30, bumperR, 100));

            // --- Special targets (bonus triggers) ---
            const targetY = T + 100;
            const targetSpacing = 50;
            for (let i = 0; i < 3; i++) {
                const tx = CX - targetSpacing + i * targetSpacing;
                this._bumpers.push(new Bumper(tx, targetY, 10, 200, true));
            }

            // --- Spinner ---
            this._spinners.push(new Spinner(CX - 60, T + 280, 40, 50));

            // --- Ramps ---
            // Ramps removed to open up the playfield


            // --- Side lanes ---
            // Side lanes removed to open up the playfield


            // --- Skill shot targets ---
            for (let i = 0; i < 3; i++) {
                this._skillShotTargets.push({
                    pos: new Vec2(PL + (R - PL) / 2, T + 80 + i * 60),
                    radius: 8,
                    points: (3 - i) * 500,
                    hit: false,
                    hitTimer: 0,
                });
            }

            // --- Lane arrows (visual only, define positions) ---
            this._laneArrows = [];
            // Left orbit arrows
            for (let i = 0; i < 3; i++) {
                this._laneArrows.push({
                    x: L + 45, y: B - 220 - i * 35,
                    angle: -0.3, phase: i * 0.4,
                });
            }
            // Right orbit arrows
            for (let i = 0; i < 3; i++) {
                this._laneArrows.push({
                    x: PL - 45, y: B - 220 - i * 35,
                    angle: 0.3, phase: i * 0.4 + Math.PI,
                });
            }
        }

        // ====================================================================
        // RENDERING LAYERS (performance: static + dynamic split)
        // ====================================================================
        createLayers() {
            // Background container
            this._bgLayer = new PIXI.Container();
            this.addChild(this._bgLayer);

            if (PARAM.bgImage) {
                const bitmap = ImageManager.loadPicture(PARAM.bgImage);
                const sprite = new Sprite(bitmap);
                this._bgLayer.addChild(sprite);
            } else {
                this.createProceduralBackground();
            }

            // Starfield layer (drawn each frame but very cheap)
            this._starGfx = new PIXI.Graphics();
            this.addChild(this._starGfx);

            // Static table layer (drawn ONCE, never redrawn)
            this._staticTableGfx = new PIXI.Graphics();
            this.addChild(this._staticTableGfx);

            // Main game container (receives screen shake transform)
            this._gameContainer = new PIXI.Container();
            this.addChild(this._gameContainer);

            // Dynamic table layer (redrawn each frame: bumpers, flippers, spinner)
            this._dynamicTableGfx = new PIXI.Graphics();
            this._gameContainer.addChild(this._dynamicTableGfx);

            // Ring pulse layer (expanding rings on bumper hits)
            this._ringGfx = new PIXI.Graphics();
            this._gameContainer.addChild(this._ringGfx);

            // Particle layer
            this._particleGfx = new PIXI.Graphics();
            this._gameContainer.addChild(this._particleGfx);

            // Ball layer
            this._ballGfx = new PIXI.Graphics();
            this._gameContainer.addChild(this._ballGfx);

            // Overlay layer (score popups)
            this._overlayLayer = new PIXI.Container();
            this.addChild(this._overlayLayer);

            // Neon border glow
            this._borderGlow = new PIXI.Graphics();
            this.addChild(this._borderGlow);
        }

        createProceduralBackground() {
            const gfx = new PIXI.Graphics();
            // Deep dark background
            gfx.beginFill(0x060612);
            gfx.drawRect(0, 0, Graphics.width, Graphics.height);
            gfx.endFill();

            // Table field (subtly lighter)
            gfx.beginFill(0x0a0a20);
            gfx.drawRect(TABLE.left - 5, TABLE.top, TABLE.width + 10, TABLE.height);
            gfx.endFill();

            // Perspective grid (synthwave style — converging lines)
            const gridColor = hexToNum(PARAM.tableColor);
            gfx.lineStyle(0.5, gridColor, 0.06);
            for (let y = 0; y < Graphics.height; y += 25) {
                gfx.moveTo(TABLE.left, y);
                gfx.lineTo(TABLE.right, y);
            }
            for (let x = TABLE.left; x <= TABLE.right; x += 25) {
                gfx.moveTo(x, 0);
                gfx.lineTo(x, Graphics.height);
            }

            // Subtle radial gradient using concentric circles
            const cx = TABLE.centerX, cy = TABLE.centerY;
            for (let r = 300; r > 0; r -= 20) {
                gfx.lineStyle(0);
                gfx.beginFill(gridColor, 0.008);
                gfx.drawCircle(cx, cy, r);
                gfx.endFill();
            }

            this._bgLayer.addChild(gfx);
        }

        // ====================================================================
        // CRT SCANLINE OVERLAY (very cheap — drawn once)
        // ====================================================================
        createCRTOverlay() {
            this._crtGfx = new PIXI.Graphics();
            this._crtGfx.lineStyle(0);
            for (let y = 0; y < Graphics.height; y += 3) {
                this._crtGfx.beginFill(0x000000, 0.08);
                this._crtGfx.drawRect(0, y, Graphics.width, 1);
                this._crtGfx.endFill();
            }
            // Add after everything except HUD
            this.addChild(this._crtGfx);
        }

        // ====================================================================
        // STATIC TABLE DRAWING (drawn ONCE — walls, ramps, guides)
        // ====================================================================
        drawStaticTable() {
            const gfx = this._staticTableGfx;
            const primaryColor = hexToNum(PARAM.tableColor);

            // Walls
            gfx.lineStyle(2, primaryColor, 0.7);
            for (const wall of this._walls) {
                gfx.moveTo(wall.p1.x, wall.p1.y);
                gfx.lineTo(wall.p2.x, wall.p2.y);
            }

            // Wall glow (draw wider, lower alpha behind walls)
            gfx.lineStyle(6, primaryColor, 0.08);
            for (const wall of this._walls) {
                gfx.moveTo(wall.p1.x, wall.p1.y);
                gfx.lineTo(wall.p2.x, wall.p2.y);
            }

            // Ramp rails
            gfx.lineStyle(1.5, primaryColor, 0.35);
            for (const ramp of this._ramps) {
                for (const seg of ramp.segments) {
                    gfx.moveTo(seg.p1.x, seg.p1.y);
                    gfx.lineTo(seg.p2.x, seg.p2.y);
                }
            }

            // Ramp glow
            gfx.lineStyle(5, primaryColor, 0.06);
            for (const ramp of this._ramps) {
                for (const seg of ramp.segments) {
                    gfx.moveTo(seg.p1.x, seg.p1.y);
                    gfx.lineTo(seg.p2.x, seg.p2.y);
                }
            }

            // Drain zone (permanent subtle glow)
            const drainCenterX = TABLE.centerX;
            const drainHalfGap = TABLE.drainGap / 2;
            gfx.lineStyle(0);
            gfx.beginFill(0xff0000, 0.06);
            gfx.drawRect(
                drainCenterX - drainHalfGap,
                TABLE.bottom - 25,
                TABLE.drainGap, 25
            );
            gfx.endFill();

            // Slingshot base removed
        }

        // ====================================================================
        // HUD
        // ====================================================================
        createHUD() {
            this._hudContainer = new PIXI.Container();
            this.addChild(this._hudContainer);

            // Score (upper left)
            this._scoreText = new PIXI.Text("SCORE: 0", {
                fontFamily: "Courier New, monospace",
                fontSize: 22,
                fontWeight: "bold",
                fill: PARAM.tableColor,
                stroke: "#000000",
                strokeThickness: 4,
                dropShadow: true,
                dropShadowColor: PARAM.tableColor,
                dropShadowBlur: 10,
                dropShadowDistance: 0,
            });
            this._scoreText.x = 12;
            this._scoreText.y = 10;
            this._hudContainer.addChild(this._scoreText);

            // Ball counter
            this._ballText = new PIXI.Text("", {
                fontFamily: "Courier New, monospace",
                fontSize: 16,
                fill: "#ffffff",
                stroke: "#000000",
                strokeThickness: 3,
            });
            this._ballText.x = 12;
            this._ballText.y = 38;
            this._hudContainer.addChild(this._ballText);

            // Target score (if threshold set)
            this._targetText = new PIXI.Text("", {
                fontFamily: "Courier New, monospace",
                fontSize: 14,
                fill: "#ffaa00",
                stroke: "#000000",
                strokeThickness: 3,
            });
            this._targetText.x = 12;
            this._targetText.y = 58;
            this._hudContainer.addChild(this._targetText);

            // Bonus indicator
            this._bonusText = new PIXI.Text("", {
                fontFamily: "Courier New, monospace",
                fontSize: 28,
                fontWeight: "bold",
                fill: PARAM.accentColor,
                stroke: "#000000",
                strokeThickness: 5,
                dropShadow: true,
                dropShadowColor: PARAM.accentColor,
                dropShadowBlur: 12,
                dropShadowDistance: 0,
            });
            this._bonusText.anchor.set(0.5, 0);
            this._bonusText.x = Graphics.width / 2;
            this._bonusText.y = 12;
            this._hudContainer.addChild(this._bonusText);

            // Combo text
            this._comboText = new PIXI.Text("", {
                fontFamily: "Courier New, monospace",
                fontSize: 18,
                fill: "#ffff00",
                stroke: "#000000",
                strokeThickness: 3,
            });
            this._comboText.x = 12;
            this._comboText.y = 78;
            this._hudContainer.addChild(this._comboText);

            // Bonus progress
            this._bonusProgressText = new PIXI.Text("", {
                fontFamily: "Courier New, monospace",
                fontSize: 14,
                fill: PARAM.accentColor,
                stroke: "#000000",
                strokeThickness: 2,
            });
            this._bonusProgressText.x = 12;
            this._bonusProgressText.y = 98;
            this._hudContainer.addChild(this._bonusProgressText);

            // Plunger bar
            this._plungerBarBg = new PIXI.Graphics();
            this._hudContainer.addChild(this._plungerBarBg);
            this._plungerBarFill = new PIXI.Graphics();
            this._hudContainer.addChild(this._plungerBarFill);

            // Game Over overlay container (hidden initially)
            this._gameOverContainer = new PIXI.Container();
            this._gameOverContainer.visible = false;
            this.addChild(this._gameOverContainer);
        }

        // ====================================================================
        // BALL SPAWNING
        // ====================================================================
        spawnBall() {
            if (this._ballsRemaining <= 0) {
                this.triggerGameOver();
                return;
            }

            const plX = TABLE.left + 45;
            const plY = TABLE.top + 20;
            this._ball = new PinballBall(plX, plY);
            this._ball.active = false;
            this._ball.inPlunger = true;
            this._plungerPower = 0;
            this._plungerCharging = false;

            for (const t of this._skillShotTargets) {
                t.hit = false;
            }
        }

        // ====================================================================
        // MAIN UPDATE LOOP
        // ====================================================================
        update() {
            super.update();
            this._frameCount++;

            if (this._gameOver) {
                this.updateGameOver();
                return;
            }

            this.processInput();
            this.updateFlippers();
            this.updatePhysics();
            this.updateSpinners();
            this.updateBonus();
            this.updateCombo();
            this.updateParticles();
            this.updateScorePopups();
            this.updateStarfield();
            this._shake.update();

            // Apply screen shake to game container
            this._gameContainer.x = this._shake.x;
            this._gameContainer.y = this._shake.y;

            this.drawDynamicTable();
            this.drawBall();
            this.drawParticles();
            this.drawStarfield();
            this.drawBorderGlow();
            this.updateHUD();

            this.checkDrain();
        }

        // ====================================================================
        // INPUT
        // ====================================================================
        processInput() {
            let leftPressed = Input.isPressed(_pinballLeftKey);
            let rightPressed = Input.isPressed(_pinballRightKey);

            // Touch/mouse support
            if (TouchInput.isPressed()) {
                if (TouchInput.x < Graphics.width / 2) {
                    leftPressed = true;
                } else {
                    rightPressed = true;
                }
            }

            this._flippers[0].isPressed = leftPressed;
            this._flippers[1].isPressed = rightPressed;

            // Plunger
            if (this._ball && this._ball.inPlunger) {
                if (Input.isPressed(_pinballLaunchKey)) {
                    this._plungerCharging = true;
                    this._plungerPower = Math.min(1, this._plungerPower + 0.018);
                } else if (this._plungerCharging && !Input.isPressed(_pinballLaunchKey)) {
                    this.launchBall();
                }
            }

            // Exit
            if (Input.isTriggered("cancel") || Input.isTriggered("escape")) {
                this.exitGame();
            }
        }

        launchBall() {
            if (!this._ball) return;
            const power = 6 + this._plungerPower * 20;
            this._ball.vel = new Vec2(power, 0);
            this._ball.active = true;
            this._ball.inPlunger = false;
            this._plungerCharging = false;
            this.spawnParticles(this._ball.pos.x, this._ball.pos.y, hexToNum(PARAM.tableColor), 12);
            this._shake.trigger(2, 5);
        }

        // ====================================================================
        // FLIPPER UPDATE
        // ====================================================================
        updateFlippers() {
            for (const flipper of this._flippers) {
                flipper.update(1);
            }
        }

        // ====================================================================
        // PHYSICS (sub-stepped)
        // ====================================================================
        updatePhysics() {
            if (!this._ball || !this._ball.active) return;

            const dt = 1 / SUB_STEPS;
            for (let step = 0; step < SUB_STEPS; step++) {
                this._ball.update(dt);
                this.collideWalls();
                this.collideBumpers();
                this.collideFlippers();
                this.collideSpinners();
                this.collideSkillShotTargets();
            }
        }

        collideWalls() {
            const ball = this._ball;
            // Table walls
            for (const wall of this._walls) {
                this._resolveCircleLine(ball, wall);
            }

            // Ramp walls
            for (const ramp of this._ramps) {
                for (const seg of ramp.segments) {
                    this._resolveCircleLine(ball, seg);
                }
            }
        }

        _resolveCircleLine(ball, seg) {
            const closest = seg.closestPoint(ball.pos);
            const diff = ball.pos.sub(closest);
            const dist = diff.len();

            if (dist < ball.radius && dist > 0) {
                const normal = diff.normalize();
                const overlap = ball.radius - dist;
                ball.pos.x += normal.x * overlap;
                ball.pos.y += normal.y * overlap;

                const velDotN = ball.vel.dot(normal);
                if (velDotN < 0) {
                    ball.vel.x -= normal.x * velDotN * (1 + seg.restitution);
                    ball.vel.y -= normal.y * velDotN * (1 + seg.restitution);
                }
            }
        }

        collideBumpers() {
            const ball = this._ball;
            for (const bumper of this._bumpers) {
                const diff = ball.pos.sub(bumper.pos);
                const dist = diff.len();
                const minDist = ball.radius + bumper.radius;

                if (dist < minDist && dist > 0) {
                    const normal = diff.normalize();
                    const overlap = minDist - dist;
                    ball.pos.x += normal.x * overlap;
                    ball.pos.y += normal.y * overlap;

                    const velDotN = ball.vel.dot(normal);
                    if (velDotN < 0) {
                        ball.vel.x -= normal.x * velDotN * (1 + bumper.restitution);
                        ball.vel.y -= normal.y * velDotN * (1 + bumper.restitution);

                        // Minimum bounce speed for satisfying feel
                        const newSpeed = ball.vel.len();
                        if (newSpeed < 6) {
                            ball.vel = ball.vel.normalize().scale(6);
                        }
                    }

                    // Effects
                    bumper.hitTimer = 14;
                    this.addScore(bumper.points);
                    this.addCombo();
                    this._stats.totalBumperHits++;

                    // Ring pulse effect
                    bumper.ringPulseRadius = bumper.radius;
                    bumper.ringPulseAlpha = 0.8;

                    // Screen shake (bigger for regular bumpers)
                    if (!bumper.isSpecial) {
                        this.spawnParticles(bumper.pos.x, bumper.pos.y, hexToNum(PARAM.accentColor), 10);
                        this._shake.trigger(3, 6);
                    } else {
                        this.spawnParticles(bumper.pos.x, bumper.pos.y, 0xffff00, 8);
                        this._shake.trigger(2, 4);
                    }

                    // Bonus target tracking
                    if (bumper.isSpecial) {
                        this._bonusHits++;
                        if (this._bonusHits >= PARAM.bonusTriggerHits && !this._bonusActive) {
                            this.activateBonus();
                        }
                    }
                }

                // Decay timers
                if (bumper.hitTimer > 0) bumper.hitTimer--;

                // Ring pulse expansion
                if (bumper.ringPulseAlpha > 0) {
                    bumper.ringPulseRadius += 2.5;
                    bumper.ringPulseAlpha -= 0.025;
                    if (bumper.ringPulseAlpha < 0) bumper.ringPulseAlpha = 0;
                }
            }
        }

        collideFlippers() {
            const ball = this._ball;
            for (const flipper of this._flippers) {
                const seg = flipper.getSegment();
                const closest = seg.closestPoint(ball.pos);
                const diff = ball.pos.sub(closest);
                const dist = diff.len();
                const flipperRadius = flipper.width / 2 + 2;
                const minDist = ball.radius + flipperRadius;

                if (dist < minDist && dist > 0) {
                    const normal = diff.normalize();
                    const overlap = minDist - dist;
                    ball.pos.x += normal.x * overlap;
                    ball.pos.y += normal.y * overlap;

                    // Flipper velocity at contact point
                    const contactVec = closest.sub(flipper.pivot);
                    const contactDist = contactVec.len();
                    const flipperVel = contactVec.perp().normalize().scale(
                        flipper.angularVel * contactDist * 3.0  // Increased transfer
                    );

                    const relVel = ball.vel.sub(flipperVel);
                    const relVelDotN = relVel.dot(normal);

                    if (relVelDotN < 0) {
                        const impulse = -(1 + flipper.restitution) * relVelDotN;
                        ball.vel.x += normal.x * impulse + flipperVel.x * 0.6;
                        ball.vel.y += normal.y * impulse + flipperVel.y * 0.6;
                    }

                    this._stats.totalFlipperHits++;
                    this.spawnParticles(closest.x, closest.y, hexToNum(PARAM.tableColor), 4);
                    this._shake.trigger(1, 3);
                }
            }
        }

        collideSpinners() {
            const ball = this._ball;
            for (const spinner of this._spinners) {
                const diff = ball.pos.sub(spinner.pos);
                const dist = diff.len();
                const minDist = ball.radius + spinner.halfWidth;

                if (dist < minDist && dist > 0) {
                    const normal = diff.normalize();
                    const overlap = minDist - dist;
                    ball.pos.x += normal.x * overlap;
                    ball.pos.y += normal.y * overlap;

                    const velDotN = ball.vel.dot(normal);
                    if (velDotN < 0) {
                        ball.vel.x -= normal.x * velDotN * 1.1;
                        ball.vel.y -= normal.y * velDotN * 1.1;
                    }

                    spinner.angularVel += ball.vel.len() * 0.18;
                    spinner.hitTimer = 10;
                    this.addScore(spinner.points);
                    this.addCombo();
                    this._stats.spinnerHits++;
                }
            }
        }

        collideSkillShotTargets() {
            if (!this._ball.inPlunger && this._ball.pos.x > TABLE.plungerLaneLeft) {
                for (const target of this._skillShotTargets) {
                    if (target.hit) continue;
                    const diff = this._ball.pos.sub(target.pos);
                    const dist = diff.len();
                    if (dist < this._ball.radius + target.radius) {
                        target.hit = true;
                        target.hitTimer = 20;
                        this.addScore(target.points);
                        this.addScorePopup(target.pos.x, target.pos.y, target.points);
                        this.spawnParticles(target.pos.x, target.pos.y, 0xffff00, 14);
                        this._shake.trigger(2, 5);
                        this._stats.skillShotsHit++;
                    }
                }
            }
        }

        // ====================================================================
        // DRAIN CHECK
        // ====================================================================
        checkDrain() {
            if (!this._ball) return;

            if (this._drainDelay > 0) {
                this._drainDelay--;
                if (this._drainDelay <= 0) {
                    this.spawnBall();
                }
                return;
            }

            if (!this._ball.active) return;

            if (this._ball.pos.y > TABLE.bottom + BALL_RADIUS * 2) {
                this._ballsRemaining--;
                this._ball.active = false;
                this._combo = 0;
                this._comboTimer = 0;
                this._bonusHits = 0;

                if (this._bonusActive) {
                    this.deactivateBonus();
                }

                // Screen shake on drain
                this._shake.trigger(4, 10);
                this.spawnParticles(
                    this._ball.pos.x, TABLE.bottom - 10,
                    0xff3333, 15
                );

                this._drainDelay = 50;
            }
        }

        // ====================================================================
        // SCORING
        // ====================================================================
        addScore(points) {
            const multiplier = this._bonusActive ? PARAM.bonusMultiplier : 1;
            const comboMultiplier = 1 + this._combo * 0.1;
            const total = Math.floor(points * multiplier * comboMultiplier);
            this._score += total;

            if (total >= 100) {
                this.addScorePopup(
                    this._ball ? this._ball.pos.x : TABLE.centerX,
                    this._ball ? this._ball.pos.y - 20 : TABLE.centerY,
                    total
                );
            }
        }

        addScorePopup(x, y, points) {
            this._scorePopups.push({
                x, y,
                text: `+${points}`,
                life: 55,
                maxLife: 55,
                vy: -1.8,
            });
        }

        addCombo() {
            this._combo++;
            this._comboTimer = 150; // 2.5 seconds
            if (this._combo > this._stats.maxCombo) {
                this._stats.maxCombo = this._combo;
            }
        }

        // ====================================================================
        // BONUS MODE
        // ====================================================================
        activateBonus() {
            this._bonusActive = true;
            const duration = this._bonusDurationOverride > 0
                ? this._bonusDurationOverride
                : PARAM.bonusDuration;
            this._bonusTimer = duration * 60;
            this._bonusFlashTimer = 0;
            this._stats.bonusActivations++;

            // Big popup
            this.addScorePopup(TABLE.centerX, TABLE.centerY, 0);
            const p = this._scorePopups[this._scorePopups.length - 1];
            p.text = "★ BONUS! ★";
            p.life = 100;
            p.maxLife = 100;

            this.spawnParticles(TABLE.centerX, TABLE.centerY, hexToNum(PARAM.accentColor), 35);
            this._shake.trigger(5, 12);
        }

        deactivateBonus() {
            this._bonusActive = false;
            this._bonusTimer = 0;
            this._bonusHits = 0;
        }

        updateBonus() {
            if (this._bonusActive) {
                this._bonusTimer--;
                this._bonusFlashTimer++;
                if (this._bonusTimer <= 0) {
                    this.deactivateBonus();
                }
            }
        }

        updateCombo() {
            if (this._comboTimer > 0) {
                this._comboTimer--;
                if (this._comboTimer <= 0) this._combo = 0;
            }
        }

        updateSpinners() {
            for (const spinner of this._spinners) {
                spinner.angle += spinner.angularVel;
                spinner.angularVel *= 0.96;
                if (spinner.hitTimer > 0) spinner.hitTimer--;
            }
        }

        // ====================================================================
        // PARTICLES
        // ====================================================================
        spawnParticles(x, y, color, count) {
            // Cap total particles for performance
            const budget = MAX_PARTICLES - this._particles.length;
            count = Math.min(count, budget);
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1.5 + Math.random() * 4;
                this._particles.push(new Particle(
                    x, y,
                    Math.cos(angle) * speed,
                    Math.sin(angle) * speed,
                    color,
                    22 + Math.floor(Math.random() * 28)
                ));
            }
        }

        updateParticles() {
            for (let i = this._particles.length - 1; i >= 0; i--) {
                this._particles[i].update();
                if (this._particles[i].dead) this._particles.splice(i, 1);
            }
        }

        updateScorePopups() {
            for (let i = this._scorePopups.length - 1; i >= 0; i--) {
                const p = this._scorePopups[i];
                p.y += p.vy;
                p.vy *= 0.97; // Decelerate for smooth float
                p.life--;
                if (p.life <= 0) this._scorePopups.splice(i, 1);
            }
        }

        updateStarfield() {
            for (const star of this._stars) {
                star.update(this._frameCount);
            }
        }

        // ====================================================================
        // DRAWING — STARFIELD
        // ====================================================================
        drawStarfield() {
            this._starGfx.clear();
            const primaryColor = hexToNum(PARAM.tableColor);
            for (const star of this._stars) {
                this._starGfx.lineStyle(0);
                this._starGfx.beginFill(primaryColor, star.currentAlpha);
                this._starGfx.drawCircle(star.x, star.y, star.size);
                this._starGfx.endFill();
            }
        }

        // ====================================================================
        // DRAWING — BORDER GLOW
        // ====================================================================
        drawBorderGlow() {
            this._borderGlow.clear();
            const t = this._frameCount;
            const primaryColor = hexToNum(PARAM.tableColor);
            const accentColor = hexToNum(PARAM.accentColor);

            const glowAlpha = 0.25 + Math.sin(t * 0.025) * 0.12;
            this._borderGlow.lineStyle(2, primaryColor, glowAlpha);
            this._borderGlow.drawRect(TABLE.left - 2, TABLE.top, TABLE.width + 4, TABLE.height);

            // Outer soft glow
            this._borderGlow.lineStyle(6, primaryColor, glowAlpha * 0.3);
            this._borderGlow.drawRect(TABLE.left - 5, TABLE.top - 3, TABLE.width + 10, TABLE.height + 6);

            if (this._bonusActive) {
                const bonusGlow = 0.4 + Math.sin(t * 0.12) * 0.4;
                this._borderGlow.lineStyle(4, accentColor, bonusGlow);
                this._borderGlow.drawRect(TABLE.left - 8, TABLE.top - 5, TABLE.width + 16, TABLE.height + 10);
            }
        }

        // ====================================================================
        // DRAWING — DYNAMIC TABLE (redrawn each frame)
        // ====================================================================
        drawDynamicTable() {
            const gfx = this._dynamicTableGfx;
            gfx.clear();
            const ringGfx = this._ringGfx;
            ringGfx.clear();

            const primaryColor = hexToNum(PARAM.tableColor);
            const accentColor = hexToNum(PARAM.accentColor);
            const t = this._frameCount;

            // === Slingshot flashes removed ===

            // === Lane Arrows (animated pulse) ===
            for (const arrow of this._laneArrows) {
                const pulse = Math.sin(t * 0.06 + arrow.phase);
                const alpha = 0.15 + pulse * 0.2;
                if (alpha > 0.05) {
                    gfx.lineStyle(0);
                    gfx.beginFill(primaryColor, alpha);
                    // Simple triangle arrow
                    const ax = arrow.x, ay = arrow.y;
                    const size = 6;
                    const ca = Math.cos(arrow.angle - Math.PI / 2);
                    const sa = Math.sin(arrow.angle - Math.PI / 2);
                    gfx.moveTo(ax + ca * size, ay + sa * size);
                    gfx.lineTo(ax + Math.cos(arrow.angle + Math.PI / 6) * size * 0.8,
                        ay + Math.sin(arrow.angle + Math.PI / 6) * size * 0.8);
                    gfx.lineTo(ax + Math.cos(arrow.angle - Math.PI / 6) * size * 0.8,
                        ay + Math.sin(arrow.angle - Math.PI / 6) * size * 0.8);
                    gfx.closePath();
                    gfx.endFill();
                }
            }

            // === Bumpers ===
            for (const bumper of this._bumpers) {
                const isHit = bumper.hitTimer > 0;
                const glowPulse = Math.sin(t * 0.045 + bumper.glowPhase) * 0.3 + 0.7;

                if (bumper.isSpecial) {
                    const specialColor = 0xffff00;
                    const lit = this._bonusHits > (this._bumpers.indexOf(bumper) - 3);

                    // Outer glow
                    gfx.lineStyle(0);
                    gfx.beginFill(specialColor, isHit ? 0.2 : 0.04);
                    gfx.drawCircle(bumper.pos.x, bumper.pos.y, bumper.radius + 5);
                    gfx.endFill();

                    gfx.lineStyle(2, isHit ? 0xffffff : (lit ? specialColor : accentColor),
                        isHit ? 1 : glowPulse);
                    gfx.beginFill(isHit ? 0xffffff : (lit ? specialColor : accentColor),
                        isHit ? 0.7 : (lit ? 0.3 : 0.15));
                    gfx.drawCircle(bumper.pos.x, bumper.pos.y, bumper.radius);
                    gfx.endFill();

                    gfx.lineStyle(1, specialColor, 0.5);
                    gfx.drawCircle(bumper.pos.x, bumper.pos.y, bumper.radius * 0.5);
                } else {
                    const bumperColor = isHit ? 0xffffff : accentColor;
                    const fillAlpha = isHit ? 0.6 : 0.12 + glowPulse * 0.08;

                    // Outer soft glow
                    gfx.lineStyle(0);
                    gfx.beginFill(accentColor, isHit ? 0.25 : 0.04);
                    gfx.drawCircle(bumper.pos.x, bumper.pos.y, bumper.radius + 8);
                    gfx.endFill();

                    // Main body
                    gfx.lineStyle(2.5, bumperColor, isHit ? 1 : 0.8);
                    gfx.beginFill(bumperColor, fillAlpha);
                    gfx.drawCircle(bumper.pos.x, bumper.pos.y, bumper.radius);
                    gfx.endFill();

                    // Inner ring
                    gfx.lineStyle(1, primaryColor, 0.5);
                    gfx.drawCircle(bumper.pos.x, bumper.pos.y, bumper.radius * 0.4);

                    // Inner dot
                    gfx.lineStyle(0);
                    gfx.beginFill(accentColor, 0.4 + glowPulse * 0.2);
                    gfx.drawCircle(bumper.pos.x, bumper.pos.y, 3);
                    gfx.endFill();
                }

                // Ring pulse effect (expanding ring on hit)
                if (bumper.ringPulseAlpha > 0) {
                    const ringColor = bumper.isSpecial ? 0xffff00 : accentColor;
                    ringGfx.lineStyle(2, ringColor, bumper.ringPulseAlpha);
                    ringGfx.drawCircle(bumper.pos.x, bumper.pos.y, bumper.ringPulseRadius);
                }
            }

            // === Spinners ===
            for (const spinner of this._spinners) {
                const isHit = spinner.hitTimer > 0;
                const spinColor = isHit ? 0xffffff : primaryColor;

                // Spinner blade
                gfx.lineStyle(3.5, spinColor, isHit ? 1 : 0.7);
                const cosA = Math.cos(spinner.angle);
                const sinA = Math.sin(spinner.angle);
                gfx.moveTo(
                    spinner.pos.x - cosA * spinner.halfWidth,
                    spinner.pos.y - sinA * spinner.halfWidth
                );
                gfx.lineTo(
                    spinner.pos.x + cosA * spinner.halfWidth,
                    spinner.pos.y + sinA * spinner.halfWidth
                );

                // Glow on blade
                if (isHit) {
                    gfx.lineStyle(8, primaryColor, 0.2);
                    gfx.moveTo(
                        spinner.pos.x - cosA * spinner.halfWidth,
                        spinner.pos.y - sinA * spinner.halfWidth
                    );
                    gfx.lineTo(
                        spinner.pos.x + cosA * spinner.halfWidth,
                        spinner.pos.y + sinA * spinner.halfWidth
                    );
                }

                // Pivot
                gfx.lineStyle(0);
                gfx.beginFill(primaryColor, 0.6);
                gfx.drawCircle(spinner.pos.x, spinner.pos.y, 3);
                gfx.endFill();
            }

            // === Skill shot targets ===
            for (const target of this._skillShotTargets) {
                const isHit = target.hit;
                const color = isHit ? 0x333333 : 0xffff00;
                const alpha = isHit ? 0.25 : (0.5 + Math.sin(t * 0.07) * 0.3);

                if (!isHit) {
                    // Outer glow
                    gfx.lineStyle(0);
                    gfx.beginFill(0xffff00, 0.05);
                    gfx.drawCircle(target.pos.x, target.pos.y, target.radius + 5);
                    gfx.endFill();
                }

                gfx.lineStyle(2, color, alpha);
                gfx.beginFill(color, isHit ? 0.03 : 0.12);
                gfx.drawCircle(target.pos.x, target.pos.y, target.radius);
                gfx.endFill();

                if (target.hitTimer > 0) target.hitTimer--;
            }

            // === Flippers ===
            for (const flipper of this._flippers) {
                const tip = flipper.tip;
                const isPressed = flipper.isPressed;
                const flipColor = isPressed ? 0xffffff : primaryColor;

                // Flipper glow (drawn first, behind)
                gfx.lineStyle(flipper.width + 6, flipColor, isPressed ? 0.15 : 0.05);
                gfx.moveTo(flipper.pivot.x, flipper.pivot.y);
                gfx.lineTo(tip.x, tip.y);

                // Flipper body
                gfx.lineStyle(flipper.width, flipColor, isPressed ? 1 : 0.85);
                gfx.moveTo(flipper.pivot.x, flipper.pivot.y);
                gfx.lineTo(tip.x, tip.y);

                // Pivot point (chrome-like)
                gfx.lineStyle(1, 0xffffff, 0.5);
                gfx.beginFill(primaryColor, 0.9);
                gfx.drawCircle(flipper.pivot.x, flipper.pivot.y, 5);
                gfx.endFill();

                // Tip cap
                gfx.lineStyle(0);
                gfx.beginFill(flipColor, isPressed ? 0.8 : 0.4);
                gfx.drawCircle(tip.x, tip.y, 4.5);
                gfx.endFill();
            }

            // === Plunger ===
            if (this._ball && this._ball.inPlunger) {
                const plY = TABLE.top + 20;
                const plBaseX = TABLE.left - 5;
                const plWidth = 40 - this._plungerPower * 25; // shrinks when charged
                const powerColor = lerpColor(PARAM.tableColor, "#ff2200", this._plungerPower);

                // Plunger body
                gfx.lineStyle(2, primaryColor, 0.8);
                gfx.beginFill(powerColor, 0.2 + this._plungerPower * 0.5);
                gfx.drawRoundedRect(plBaseX, plY - 10, plWidth, 20, 3);
                gfx.endFill();

                // Plunger glow at high power
                if (this._plungerPower > 0.5) {
                    gfx.lineStyle(0);
                    gfx.beginFill(powerColor, (this._plungerPower - 0.5) * 0.15);
                    gfx.drawRoundedRect(plBaseX - 4, plY - 14, plWidth + 8, 28, 5);
                    gfx.endFill();
                }

                // Spring coils
                gfx.lineStyle(2, powerColor, 0.8);
                const coils = 5;
                for (let i = 0; i < coils; i++) {
                    const sx = plBaseX + (plWidth / coils) * i;
                    const sy = (i % 2 === 0) ? -7 : 7;
                    gfx.moveTo(sx, plY + sy);
                    gfx.lineTo(sx + plWidth / coils, plY - sy);
                }
            }

            // === Power bar ===
            this._plungerBarBg.clear();
            this._plungerBarFill.clear();
            if (this._ball && this._ball.inPlunger) {
                const barX = TABLE.left;
                const barY = TABLE.top - 20; // Just above the table
                const barW = 160;
                const barH = 12;

                this._plungerBarBg.lineStyle(2, primaryColor, 0.4);
                this._plungerBarBg.beginFill(0x0a0a1a, 0.85);
                this._plungerBarBg.drawRoundedRect(barX, barY, barW, barH, 4);
                this._plungerBarBg.endFill();

                const fillW = barW * this._plungerPower;
                const fillColor = lerpColor(PARAM.tableColor, "#ff2200", this._plungerPower);
                this._plungerBarFill.beginFill(fillColor, 0.85);
                this._plungerBarFill.drawRoundedRect(
                    barX + 2, barY + 2, Math.max(0, fillW - 4), barH - 4, 2
                );
                this._plungerBarFill.endFill();

                // Power bar glow
                if (this._plungerPower > 0.3) {
                    this._plungerBarFill.lineStyle(0);
                    this._plungerBarFill.beginFill(fillColor, 0.15);
                    this._plungerBarFill.drawRoundedRect(
                        barX - 2, barY - 2, Math.max(0, fillW + 4), barH + 4, 4
                    );
                    this._plungerBarFill.endFill();
                }
            }

            // === Drain danger glow (animated) ===
            const drainCenterX = TABLE.centerX;
            const drainHalfGap = TABLE.drainGap / 2;
            const drainPulse = 0.06 + Math.sin(t * 0.04) * 0.04;
            gfx.lineStyle(0);
            gfx.beginFill(0xff0000, drainPulse);
            gfx.drawRect(
                drainCenterX - drainHalfGap, TABLE.bottom - 22,
                TABLE.drainGap, 22
            );
            gfx.endFill();
        }

        // ====================================================================
        // DRAWING — BALL (enhanced chrome look)
        // ====================================================================
        drawBall() {
            this._ballGfx.clear();
            if (!this._ball) return;

            const ball = this._ball;
            const primaryColor = hexToNum(PARAM.tableColor);
            const t = this._frameCount;

            // Trail (gradient alpha, gradient size)
            if (ball.active && ball.trail.length > 1) {
                for (let i = 0; i < ball.trail.length; i++) {
                    const prog = i / ball.trail.length;
                    const alpha = prog * 0.35;
                    const size = prog * ball.radius * 0.75;
                    this._ballGfx.lineStyle(0);
                    this._ballGfx.beginFill(primaryColor, alpha);
                    this._ballGfx.drawCircle(ball.trail[i].x, ball.trail[i].y, size);
                    this._ballGfx.endFill();
                }
            }

            // Outer glow halo
            this._ballGfx.lineStyle(0);
            this._ballGfx.beginFill(primaryColor, 0.1);
            this._ballGfx.drawCircle(ball.pos.x, ball.pos.y, ball.radius + 8);
            this._ballGfx.endFill();
            this._ballGfx.beginFill(primaryColor, 0.06);
            this._ballGfx.drawCircle(ball.pos.x, ball.pos.y, ball.radius + 14);
            this._ballGfx.endFill();

            // Ball shadow (subtle, offset down-right)
            this._ballGfx.beginFill(0x000000, 0.2);
            this._ballGfx.drawCircle(ball.pos.x + 2, ball.pos.y + 2, ball.radius);
            this._ballGfx.endFill();

            // Main ball body
            this._ballGfx.lineStyle(1.5, 0xffffff, 0.7);
            this._ballGfx.beginFill(primaryColor, 0.75);
            this._ballGfx.drawCircle(ball.pos.x, ball.pos.y, ball.radius);
            this._ballGfx.endFill();

            // Chrome highlight ring
            this._ballGfx.lineStyle(1, 0xffffff, 0.25);
            this._ballGfx.drawCircle(ball.pos.x, ball.pos.y, ball.radius * 0.7);

            // Specular highlight (moves with spin for lively feel)
            const hlOffsetX = Math.cos(ball.spinAngle) * 1.5 - 2;
            const hlOffsetY = Math.sin(ball.spinAngle) * 1.5 - 2;
            this._ballGfx.lineStyle(0);
            this._ballGfx.beginFill(0xffffff, 0.55);
            this._ballGfx.drawCircle(ball.pos.x + hlOffsetX, ball.pos.y + hlOffsetY, ball.radius * 0.3);
            this._ballGfx.endFill();

            // Tiny secondary highlight
            this._ballGfx.beginFill(0xffffff, 0.2);
            this._ballGfx.drawCircle(ball.pos.x + 3, ball.pos.y + 3, ball.radius * 0.15);
            this._ballGfx.endFill();
        }

        // ====================================================================
        // DRAWING — PARTICLES
        // ====================================================================
        drawParticles() {
            this._particleGfx.clear();
            for (const p of this._particles) {
                this._particleGfx.lineStyle(0);
                this._particleGfx.beginFill(p.color, p.alpha);
                this._particleGfx.drawCircle(p.x, p.y, p.size * p.alpha);
                this._particleGfx.endFill();
            }
        }

        // ====================================================================
        // HUD UPDATE
        // ====================================================================
        updateHUD() {
            this._scoreText.text = `SCORE: ${this._score.toLocaleString()}`;

            // Balls
            let ballIcons = "";
            for (let i = 0; i < this._ballsRemaining; i++) ballIcons += "● ";
            for (let i = this._ballsRemaining; i < PARAM.ballCount; i++) ballIcons += "○ ";
            this._ballText.text = `BALLS: ${ballIcons.trim()}`;

            // Target score
            if (this._scoreThreshold > 0) {
                const met = this._score >= this._scoreThreshold;
                this._targetText.style.fill = met ? "#44ff44" : "#ffaa00";
                this._targetText.text = `TARGET: ${this._scoreThreshold.toLocaleString()} ${met ? "✓" : ""}`;
                this._targetText.visible = true;
            } else {
                this._targetText.visible = false;
            }

            // Bonus
            if (this._bonusActive) {
                const secsLeft = Math.ceil(this._bonusTimer / 60);
                const flashOn = Math.floor(this._bonusFlashTimer / 5) % 2 === 0;
                this._bonusText.text = flashOn
                    ? `★ BONUS x${PARAM.bonusMultiplier} ★  ${secsLeft}s` : "";
                this._bonusText.visible = true;
            } else {
                this._bonusText.visible = false;
            }

            // Combo
            if (this._combo > 1) {
                this._comboText.text = `COMBO x${this._combo}`;
                this._comboText.visible = true;
            } else {
                this._comboText.visible = false;
            }

            // Bonus progress
            if (!this._bonusActive && this._bonusHits > 0) {
                let prog = "";
                for (let i = 0; i < PARAM.bonusTriggerHits; i++) {
                    prog += i < this._bonusHits ? "★ " : "☆ ";
                }
                this._bonusProgressText.text = `BONUS: ${prog.trim()}`;
                this._bonusProgressText.visible = true;
            } else {
                this._bonusProgressText.visible = false;
            }

            // Score popups
            this._overlayLayer.removeChildren();
            for (const popup of this._scorePopups) {
                const alpha = Math.max(0, popup.life / popup.maxLife);
                const isBonus = popup.text.includes("BONUS");
                const color = isBonus ? PARAM.accentColor : "#ffff00";
                const fontSize = isBonus ? 28 : 18;
                const text = new PIXI.Text(popup.text, {
                    fontFamily: "Courier New, monospace",
                    fontSize: fontSize,
                    fontWeight: "bold",
                    fill: color,
                    stroke: "#000000",
                    strokeThickness: 4,
                    dropShadow: isBonus,
                    dropShadowColor: PARAM.accentColor,
                    dropShadowBlur: 8,
                    dropShadowDistance: 0,
                });
                text.anchor.set(0.5, 0.5);
                text.x = popup.x;
                text.y = popup.y;
                text.alpha = alpha;
                text.scale.set(0.8 + (1 - alpha) * 0.4);
                this._overlayLayer.addChild(text);
            }
        }

        // ====================================================================
        // GAME OVER — GORGEOUS ANIMATED SCREEN
        // ====================================================================
        triggerGameOver() {
            this._gameOver = true;
            this._gameOverTimer = 0;
            this._gameOverPhase = 0;
            this._displayedScore = 0;

            // Determine win/lose
            if (this._scoreThreshold > 0) {
                this._didWin = this._score >= this._scoreThreshold;
            } else {
                this._didWin = true; // No threshold = always win
            }

            // Store results in RPG Maker variables/switches
            if (PARAM.scoreVarId > 0) {
                $gameVariables.setValue(PARAM.scoreVarId, this._score);
            }
            if (PARAM.highScoreVarId > 0) {
                const currentHigh = $gameVariables.value(PARAM.highScoreVarId);
                if (this._score > currentHigh) {
                    $gameVariables.setValue(PARAM.highScoreVarId, this._score);
                }
            }
            if (PARAM.resultSwitchId > 0) {
                $gameSwitches.setValue(PARAM.resultSwitchId, this._didWin);
            }

            // Build game over overlay
            this.buildGameOverScreen();
        }

        buildGameOverScreen() {
            const container = this._gameOverContainer;
            container.removeChildren();

            // Dark overlay background
            this._goOverlay = new PIXI.Graphics();
            this._goOverlay.beginFill(0x000000, 0);
            this._goOverlay.drawRect(0, 0, Graphics.width, Graphics.height);
            this._goOverlay.endFill();
            container.addChild(this._goOverlay);

            // Central panel
            this._goPanel = new PIXI.Graphics();
            container.addChild(this._goPanel);

            const cx = Graphics.width / 2;
            const cy = Graphics.height / 2;

            // "GAME OVER" title
            this._goTitle = new PIXI.Text("GAME OVER", {
                fontFamily: "Courier New, monospace",
                fontSize: 42,
                fontWeight: "bold",
                fill: "#ffffff",
                stroke: "#000000",
                strokeThickness: 6,
                dropShadow: true,
                dropShadowColor: PARAM.tableColor,
                dropShadowBlur: 16,
                dropShadowDistance: 0,
            });
            this._goTitle.anchor.set(0.5, 0.5);
            this._goTitle.x = cx;
            this._goTitle.y = cy - 130;
            this._goTitle.alpha = 0;
            this._goTitle.scale.set(2);
            container.addChild(this._goTitle);

            // Score counter
            this._goScoreText = new PIXI.Text("0", {
                fontFamily: "Courier New, monospace",
                fontSize: 36,
                fontWeight: "bold",
                fill: PARAM.tableColor,
                stroke: "#000000",
                strokeThickness: 5,
                dropShadow: true,
                dropShadowColor: PARAM.tableColor,
                dropShadowBlur: 12,
                dropShadowDistance: 0,
            });
            this._goScoreText.anchor.set(0.5, 0.5);
            this._goScoreText.x = cx;
            this._goScoreText.y = cy - 65;
            this._goScoreText.alpha = 0;
            container.addChild(this._goScoreText);

            // Stats lines
            const statStyle = {
                fontFamily: "Courier New, monospace",
                fontSize: 15,
                fill: "#aaaaaa",
                stroke: "#000000",
                strokeThickness: 3,
            };

            this._goStats = [];
            const statsData = [
                `Bumper Hits: ${this._stats.totalBumperHits}`,
                `Max Combo:   ${this._stats.maxCombo}x`,
                `Bonus Runs:  ${this._stats.bonusActivations}`,
                `Skill Shots: ${this._stats.skillShotsHit}`,
            ];

            for (let i = 0; i < statsData.length; i++) {
                const stat = new PIXI.Text(statsData[i], statStyle);
                stat.anchor.set(0.5, 0.5);
                stat.x = cx;
                stat.y = cy - 15 + i * 24;
                stat.alpha = 0;
                container.addChild(stat);
                this._goStats.push(stat);
            }

            // Rank
            const rank = this.calculateRank();
            this._goRank = new PIXI.Text(rank.letter, {
                fontFamily: "Courier New, monospace",
                fontSize: 64,
                fontWeight: "bold",
                fill: rank.color,
                stroke: "#000000",
                strokeThickness: 7,
                dropShadow: true,
                dropShadowColor: rank.color,
                dropShadowBlur: 20,
                dropShadowDistance: 0,
            });
            this._goRank.anchor.set(0.5, 0.5);
            this._goRank.x = cx;
            this._goRank.y = cy + 100;
            this._goRank.alpha = 0;
            this._goRank.scale.set(3);
            container.addChild(this._goRank);

            // Win/Lose result text
            this._goResultText = new PIXI.Text("", {
                fontFamily: "Courier New, monospace",
                fontSize: 24,
                fontWeight: "bold",
                fill: "#ffffff",
                stroke: "#000000",
                strokeThickness: 5,
            });
            this._goResultText.anchor.set(0.5, 0.5);
            this._goResultText.x = cx;
            this._goResultText.y = cy + 155;
            this._goResultText.alpha = 0;
            container.addChild(this._goResultText);

            if (this._scoreThreshold > 0) {
                if (this._didWin) {
                    this._goResultText.text = `TARGET ${this._scoreThreshold.toLocaleString()} — PASSED!`;
                    this._goResultText.style.fill = "#44ff44";
                    this._goResultText.style.dropShadow = true;
                    this._goResultText.style.dropShadowColor = "#44ff44";
                    this._goResultText.style.dropShadowBlur = 12;
                    this._goResultText.style.dropShadowDistance = 0;
                } else {
                    this._goResultText.text = `TARGET ${this._scoreThreshold.toLocaleString()} — FAILED`;
                    this._goResultText.style.fill = "#ff4444";
                    this._goResultText.style.dropShadow = true;
                    this._goResultText.style.dropShadowColor = "#ff4444";
                    this._goResultText.style.dropShadowBlur = 12;
                    this._goResultText.style.dropShadowDistance = 0;
                }
            }

            // Exit hint
            this._goHint = new PIXI.Text("Press any key to continue", {
                fontFamily: "Courier New, monospace",
                fontSize: 14,
                fill: "#666666",
                stroke: "#000000",
                strokeThickness: 2,
            });
            this._goHint.anchor.set(0.5, 0.5);
            this._goHint.x = cx;
            this._goHint.y = cy + 195;
            this._goHint.alpha = 0;
            container.addChild(this._goHint);

            container.visible = true;
        }

        calculateRank() {
            const s = this._score;
            if (s >= 15000) return { letter: "S+", color: "#ff00ff" };
            if (s >= 10000) return { letter: "S", color: "#ffaa00" };
            if (s >= 7000) return { letter: "A", color: "#44ff44" };
            if (s >= 4000) return { letter: "B", color: "#4488ff" };
            if (s >= 2000) return { letter: "C", color: "#aaaaaa" };
            return { letter: "D", color: "#666666" };
        }

        updateGameOver() {
            const t = this._gameOverTimer++;
            const phase = this._gameOverPhase;

            // Continue drawing the table underneath
            this.updateStarfield();
            this.drawStarfield();
            this.drawDynamicTable();
            this.updateParticles();
            this.drawParticles();

            // Phase 0: Fade in overlay (0-30 frames)
            if (phase === 0) {
                const progress = Math.min(1, t / 30);
                this._goOverlay.clear();
                this._goOverlay.beginFill(0x000000, progress * 0.75);
                this._goOverlay.drawRect(0, 0, Graphics.width, Graphics.height);
                this._goOverlay.endFill();

                if (t >= 30) {
                    this._gameOverPhase = 1;
                    this._gameOverTimer = 0;
                }
            }

            // Phase 1: Title drops in (0-25 frames)
            if (phase === 1) {
                const progress = Math.min(1, t / 25);
                const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
                this._goTitle.alpha = eased;
                this._goTitle.scale.set(1 + (1 - eased) * 1.5);

                if (t >= 25) {
                    this._gameOverPhase = 2;
                    this._gameOverTimer = 0;
                }
            }

            // Phase 2: Score count-up (0-60 frames)
            if (phase === 2) {
                const progress = Math.min(1, t / 60);
                const eased = 1 - Math.pow(1 - progress, 2);
                this._displayedScore = Math.floor(this._score * eased);
                this._goScoreText.text = this._displayedScore.toLocaleString();
                this._goScoreText.alpha = 1;

                // Subtle scale pulse during count
                this._goScoreText.scale.set(1 + Math.sin(t * 0.3) * 0.03);

                if (t >= 60) {
                    this._goScoreText.text = this._score.toLocaleString();
                    this._goScoreText.scale.set(1);
                    this._gameOverPhase = 3;
                    this._gameOverTimer = 0;
                }
            }

            // Phase 3: Stats appear one by one (0-60 frames)
            if (phase === 3) {
                for (let i = 0; i < this._goStats.length; i++) {
                    const delay = i * 12;
                    if (t > delay) {
                        const statProgress = Math.min(1, (t - delay) / 15);
                        this._goStats[i].alpha = statProgress;
                        this._goStats[i].x = Graphics.width / 2 + (1 - statProgress) * 30;
                    }
                }

                if (t >= 12 * this._goStats.length + 15) {
                    this._gameOverPhase = 4;
                    this._gameOverTimer = 0;
                }
            }

            // Phase 4: Rank reveal (0-30 frames)
            if (phase === 4) {
                const progress = Math.min(1, t / 25);
                const eased = 1 - Math.pow(1 - progress, 4); // ease out quartic
                this._goRank.alpha = eased;
                this._goRank.scale.set(1 + (1 - eased) * 2.5);

                if (t >= 25) {
                    this._goRank.scale.set(1);
                    this._gameOverPhase = 5;
                    this._gameOverTimer = 0;
                }
            }

            // Phase 5: Result + hint (0-20 frames)
            if (phase === 5) {
                const progress = Math.min(1, t / 20);
                this._goResultText.alpha = progress;
                this._goHint.alpha = progress * 0.7;

                if (t >= 20) {
                    this._gameOverPhase = 6;
                    this._gameOverTimer = 0;
                }
            }

            // Phase 6: Waiting for input
            if (phase === 6) {
                // Pulsing rank
                const pulse = 1 + Math.sin(t * 0.04) * 0.05;
                this._goRank.scale.set(pulse);

                // Pulsing hint
                this._goHint.alpha = 0.4 + Math.sin(t * 0.06) * 0.3;

                // Accept input after brief delay
                if (t > 15) {
                    if (Input.isTriggered("ok") || Input.isTriggered("cancel") ||
                        Input.isTriggered("escape") || Input.isTriggered(_pinballLaunchKey) ||
                        Input.isTriggered(_pinballLeftKey) || Input.isTriggered(_pinballRightKey) ||
                        TouchInput.isTriggered()) {
                        this.exitGame();
                    }
                }
            }
        }

        // ====================================================================
        // EXIT
        // ====================================================================
        exitGame() {
            // Store score if exiting early
            if (PARAM.scoreVarId > 0 && !this._gameOver) {
                $gameVariables.setValue(PARAM.scoreVarId, this._score);
            }

            // If game over, also determine win/lose for early exit
            if (!this._gameOver && PARAM.resultSwitchId > 0) {
                const threshold = this._scoreThreshold > 0
                    ? this._scoreThreshold : PARAM.defaultMinScore;
                if (threshold > 0) {
                    $gameSwitches.setValue(PARAM.resultSwitchId, this._score >= threshold);
                } else {
                    $gameSwitches.setValue(PARAM.resultSwitchId, true);
                }
            }

            // Trigger common events
            if (this._gameOver || true) { // Always trigger on exit
                const threshold = this._scoreThreshold > 0
                    ? this._scoreThreshold : PARAM.defaultMinScore;
                const won = threshold > 0 ? this._score >= threshold : true;

                if (won && PARAM.winCommonEventId > 0) {
                    $gameTemp.reserveCommonEvent(PARAM.winCommonEventId);
                } else if (!won && PARAM.loseCommonEventId > 0) {
                    $gameTemp.reserveCommonEvent(PARAM.loseCommonEventId);
                }
            }

            SceneManager.pop();
        }

        // ====================================================================
        // SCENE LIFECYCLE
        // ====================================================================
        terminate() {
            super.terminate();
        }

        isReady() {
            return super.isReady();
        }
    }

    // ========================================================================
    // PLUGIN COMMANDS
    // ========================================================================
    PluginManager.registerCommand(PLUGIN_NAME, "StartPinball", args => {
        const threshold = Number(args.RequireMinimumScore || 0);
        Scene_Pinball._pendingThreshold = threshold > 0 ? threshold : PARAM.defaultMinScore;
        Scene_Pinball._pendingStartInBonus = false;
        SceneManager.push(Scene_Pinball);
    });

    PluginManager.registerCommand(PLUGIN_NAME, "StartPinballBonus", args => {
        const threshold = Number(args.RequireMinimumScore || 0);
        Scene_Pinball._pendingThreshold = threshold > 0 ? threshold : PARAM.defaultMinScore;
        Scene_Pinball._pendingStartInBonus = true;
        Scene_Pinball._pendingBonusDurationOverride = Number(args.BonusDurationOverride || 0);
        SceneManager.push(Scene_Pinball);
    });

    // Apply pending settings on scene create
    const _Scene_Pinball_create = Scene_Pinball.prototype.create;
    Scene_Pinball.prototype.create = function () {
        if (Scene_Pinball._pendingThreshold) {
            this._scoreThreshold = Scene_Pinball._pendingThreshold;
            Scene_Pinball._pendingThreshold = 0;
        }
        if (Scene_Pinball._pendingStartInBonus) {
            this._startInBonus = true;
            this._bonusDurationOverride = Scene_Pinball._pendingBonusDurationOverride || 0;
            Scene_Pinball._pendingStartInBonus = false;
            Scene_Pinball._pendingBonusDurationOverride = 0;
        }

        // Reset result switches at start (clean state for each play)
        if (PARAM.resultSwitchId > 0) {
            $gameSwitches.setValue(PARAM.resultSwitchId, false);
        }

        _Scene_Pinball_create.call(this);
    };

    // Static pending values
    Scene_Pinball._pendingThreshold = 0;
    Scene_Pinball._pendingStartInBonus = false;
    Scene_Pinball._pendingBonusDurationOverride = 0;

    // Global access
    window.Scene_Pinball = Scene_Pinball;

})();
