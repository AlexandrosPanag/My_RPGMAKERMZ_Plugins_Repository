//=============================================================================
// AnimatedTurnIndicator.js
// Version: 1.0.0
//=============================================================================

/*:
 * @target MZ
 * @plugindesc Crisp, lightweight animated holo-ring under the actor who is choosing an action
 * @author Alexandros Panagiotakopoulos
 * @version 1.0.0
 * @date 6 October 2026
 * @url https://alexandrospanag.github.io
 *
 * @param circleColor
 * @text Circle Color
 * @desc Indicator color (hex). Used when no other plugin provides ConfigManager.plumbobColor (a hue 0-360).
 * @default #4af3ff
 *
 * @param circleOpacity
 * @text Circle Opacity
 * @desc Master opacity of the indicator (0-255)
 * @type number
 * @min 0
 * @max 255
 * @default 220
 *
 * @param circleSize
 * @text Circle Size
 * @desc Horizontal radius of the ring in pixels
 * @type number
 * @min 10
 * @max 200
 * @default 70
 *
 * @param pulseSpeed
 * @text Pulse Speed
 * @desc Speed of the pulse / ripple / orbit animation (higher = faster)
 * @type number
 * @min 1
 * @max 10
 * @default 3
 *
 * @param yOffset
 * @text Y Offset
 * @desc Vertical offset from actor position (negative = above, positive = below)
 * @type number
 * @min -200
 * @max 200
 * @default 0
 *
 * @param orbiterCount
 * @text Orbiting Comets
 * @desc Number of comets circling the ring (0 disables)
 * @type number
 * @min 0
 * @max 6
 * @default 3
 *
 * @param moteCount
 * @text Rising Motes
 * @desc Number of small glowing motes drifting upward (0 disables)
 * @type number
 * @min 0
 * @max 16
 * @default 6
 *
 * @param renderScale
 * @text Render Quality
 * @desc Texture resolution multiplier. 2 = crisp on all screens, 1 = lowest memory, 3 = ultra.
 * @type number
 * @min 1
 * @max 3
 * @default 2
 *
 * @help AnimatedTurnIndicator.js
 *
 * Shows a glowing holographic ring under the actor currently selecting
 * their action in battle.
 *
 * Version 2.0 is a full rewrite built for performance:
 *  - All artwork is painted ONCE (and again only if the color changes).
 *  - Every frame only moves/fades pre-rendered sprites on the GPU:
 *    no canvas redraws, no texture re-uploads, no per-frame allocations.
 *  - Textures are rendered at 2x by default, so edges stay sharp even
 *    when the game window is scaled or fullscreen.
 *
 * Visuals: neon double-rim ring, dashed inner ring, breathing glow,
 * expanding ripples, orbiting comets with depth, rising motes, smooth
 * pop-in / fade-out and smooth gliding between actors.
 *
 * Color: if another plugin defines ConfigManager.plumbobColor (a hue
 * from 0-360) it is used, otherwise the Circle Color parameter is used.
 *
 * No plugin commands.
 */

(() => {
    "use strict";

    const pluginName = "AnimatedTurnIndicator";
    const parameters = PluginManager.parameters(pluginName);

    const num = (value, fallback, min, max) => {
        const n = Number(value);
        const v = (value === undefined || value === "" || !Number.isFinite(n)) ? fallback : n;
        return Math.min(max, Math.max(min, v));
    };

    const circleColor = String(parameters["circleColor"] || "#4af3ff");
    const masterAlpha = num(parameters["circleOpacity"], 220, 0, 255) / 255;
    const circleSize = num(parameters["circleSize"], 70, 10, 200);
    const pulseSpeed = num(parameters["pulseSpeed"], 3, 1, 10);
    const yOffset = num(parameters["yOffset"], 0, -200, 200);
    const orbiterCount = Math.round(num(parameters["orbiterCount"], 3, 0, 6));
    const moteCount = Math.round(num(parameters["moteCount"], 6, 0, 16));
    const SS = Math.round(num(parameters["renderScale"], 2, 1, 3));

    // Geometry in texture pixels (1x logical size * SS)
    const RX = circleSize * SS;
    const RY = circleSize * 0.4 * SS;
    const PAD = 20 * SS;
    const TRAIL = 6;

    //-------------------------------------------------------------------------
    // Color helpers
    //-------------------------------------------------------------------------

    function hslToRgb(h, s, l) {
        h = (((h % 360) + 360) % 360) / 360; s /= 100; l /= 100;
        let r, g, b;
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    function hexToRgb(hex) {
        let h = String(hex).trim().replace("#", "");
        if (h.length === 3) h = h.split("").map(c => c + c).join("");
        if (!/^[0-9a-f]{6}$/i.test(h)) return [74, 243, 255];
        const n = parseInt(h, 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    }

    const mixWhite = (c, t) => c.map(v => Math.round(v + (255 - v) * t));
    const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

    function resolvePalette(source) {
        const hue = Number(source);
        if (source !== undefined && source !== null && source !== "" && Number.isFinite(hue)) {
            return { base: hslToRgb(hue, 90, 62), bright: hslToRgb(hue, 100, 82) };
        }
        const base = hexToRgb(circleColor);
        return { base, bright: mixWhite(base, 0.45) };
    }

    //-------------------------------------------------------------------------
    // One-time painters (run on creation and when the color changes)
    //-------------------------------------------------------------------------

    function touch(bitmap) {
        if (bitmap._baseTexture) bitmap._baseTexture.update();
    }

    // Soft elliptical ground glow (gradient only, no shadowBlur)
    function paintGlow(bitmap, pal) {
        const ctx = bitmap.context, W = bitmap.width, H = bitmap.height;
        ctx.clearRect(0, 0, W, H);
        const R = W / 2;
        ctx.save();
        ctx.translate(W / 2, H / 2);
        ctx.scale(1, H / W);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R);
        g.addColorStop(0, rgba(pal.base, 0));
        g.addColorStop(0.35, rgba(pal.base, 0.05));
        g.addColorStop(0.625, rgba(pal.base, 0.34));
        g.addColorStop(0.8, rgba(pal.base, 0.10));
        g.addColorStop(1, rgba(pal.base, 0));
        ctx.fillStyle = g;
        ctx.fillRect(-R, -R, R * 2, R * 2);
        ctx.restore();
        touch(bitmap);
    }

    // The main ring: translucent platform, dashed inner ring, neon rim
    function paintDisc(bitmap, pal) {
        const ctx = bitmap.context, W = bitmap.width, H = bitmap.height;
        const cx = W / 2, cy = H / 2;
        const rx = RX * 0.96, ry = RY * 0.96;
        ctx.clearRect(0, 0, W, H);

        // Platform fill
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(1, ry / rx);
        const fill = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
        fill.addColorStop(0, rgba(pal.base, 0.06));
        fill.addColorStop(0.6, rgba(pal.base, 0.14));
        fill.addColorStop(0.88, rgba(pal.base, 0.34));
        fill.addColorStop(1, rgba(pal.bright, 0.55));
        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(0, 0, rx, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Faint inner solid ring
        ctx.strokeStyle = rgba(pal.base, 0.24);
        ctx.lineWidth = 1 * SS;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx * 0.5, ry * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Dashed inner ring (uniform stroke thickness)
        const N = 28, step = (Math.PI * 2) / N, k = 0.74;
        ctx.strokeStyle = rgba(pal.bright, 0.6);
        ctx.lineWidth = 1.6 * SS;
        ctx.lineCap = "round";
        ctx.beginPath();
        for (let i = 0; i < N; i++) {
            const a0 = i * step, a1 = a0 + step * 0.55;
            ctx.moveTo(cx + Math.cos(a0) * rx * k, cy + Math.sin(a0) * ry * k);
            ctx.ellipse(cx, cy, rx * k, ry * k, 0, a0, a1);
        }
        ctx.stroke();
        ctx.lineCap = "butt";

        // Neon rim: halo, colored body, white-hot core
        ctx.save();
        ctx.shadowBlur = 16 * SS;
        ctx.shadowColor = rgba(pal.base, 0.9);
        ctx.strokeStyle = rgba(pal.base, 0.45);
        ctx.lineWidth = 6 * SS;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.shadowBlur = 8 * SS;
        ctx.shadowColor = rgba(pal.bright, 0.9);
        ctx.strokeStyle = rgba(pal.bright, 0.95);
        ctx.lineWidth = 2.6 * SS;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.lineWidth = 1.1 * SS;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Near-edge sheen for depth
        ctx.strokeStyle = "rgba(255,255,255,0.32)";
        ctx.lineWidth = 3.2 * SS;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, Math.PI * 0.18, Math.PI * 0.82);
        ctx.stroke();
        ctx.lineCap = "butt";

        touch(bitmap);
    }

    // Thin ring used for the expanding ripples
    function paintRing(bitmap, pal) {
        const ctx = bitmap.context, W = bitmap.width, H = bitmap.height;
        const cx = W / 2, cy = H / 2, rx = RX * 0.96, ry = RY * 0.96;
        ctx.clearRect(0, 0, W, H);
        ctx.save();
        ctx.shadowBlur = 10 * SS;
        ctx.shadowColor = rgba(pal.base, 0.9);
        ctx.strokeStyle = rgba(pal.base, 0.4);
        ctx.lineWidth = 5 * SS;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        ctx.strokeStyle = rgba(pal.bright, 0.95);
        ctx.lineWidth = 2 * SS;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
        touch(bitmap);
    }

    // Round glowing spark (shared by comets and motes)
    function paintSpark(bitmap, pal) {
        const ctx = bitmap.context, S = bitmap.width, c = S / 2;
        ctx.clearRect(0, 0, S, S);
        const g = ctx.createRadialGradient(c, c, 0, c, c, c);
        g.addColorStop(0, "rgba(255,255,255,1)");
        g.addColorStop(0.2, rgba(pal.bright, 0.9));
        g.addColorStop(0.55, rgba(pal.base, 0.3));
        g.addColorStop(1, rgba(pal.base, 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, S, S);
        touch(bitmap);
    }

    //-------------------------------------------------------------------------
    // Sprite_TurnIndicator
    //-------------------------------------------------------------------------

    class Sprite_TurnIndicator extends Sprite {
        initialize() {
            super.initialize();
            this._t = 0;
            this._phase = 0;
            this._presence = 0;
            this._hasPos = false;
            this._px = 0;
            this._py = 0;
            this._colorSrc = {}; // sentinel: forces first paint
            this._build();
        }

        _makeBitmap(w, h) {
            const bmp = new Bitmap(Math.ceil(w), Math.ceil(h));
            bmp.smooth = true;
            return bmp;
        }

        _makeLayer(bitmap, additive) {
            const sprite = new Sprite(bitmap);
            sprite.anchor.x = 0.5;
            sprite.anchor.y = 0.5;
            sprite.scale.x = sprite.scale.y = 1 / SS;
            if (additive) sprite.blendMode = PIXI.BLEND_MODES.ADD;
            this.addChild(sprite);
            return sprite;
        }

        _build() {
            const discW = 2 * (RX + PAD), discH = 2 * (RY + PAD);
            const sparkS = 18 * SS;

            this._glowBmp = this._makeBitmap(RX * 3.2, RY * 3.2);
            this._discBmp = this._makeBitmap(discW, discH);
            this._ringBmp = this._makeBitmap(discW, discH);
            this._sparkBmp = this._makeBitmap(sparkS, sparkS);

            // Back to front
            this._glow = this._makeLayer(this._glowBmp, true);
            this._disc = this._makeLayer(this._discBmp, false);

            this._ripples = [
                this._makeLayer(this._ringBmp, true),
                this._makeLayer(this._ringBmp, true)
            ];

            this._motes = [];
            for (let i = 0; i < moteCount; i++) {
                this._motes.push({
                    sprite: this._makeLayer(this._sparkBmp, true),
                    angle: Math.random() * Math.PI * 2,
                    radius: Math.sqrt(Math.random()) * 0.8,
                    offset: Math.random(),
                    period: 1.8 + Math.random() * 1.6,
                    rise: 38 + Math.random() * 28,
                    wobble: (Math.random() * 2 - 1) * 4
                });
            }

            this._orbiters = [];
            for (let i = 0; i < orbiterCount; i++) {
                const trail = [];
                for (let j = 0; j < TRAIL; j++) {
                    trail.push(this._makeLayer(this._sparkBmp, true));
                }
                this._orbiters.push({
                    trail,
                    dir: i % 2 === 0 ? 1 : -1,
                    speed: 1 + i * 0.18,
                    phase: (i / orbiterCount) * Math.PI * 2
                });
            }

            this.alpha = 0;
        }

        _repaint() {
            const pal = resolvePalette(this._colorSrc);
            paintGlow(this._glowBmp, pal);
            paintDisc(this._discBmp, pal);
            paintRing(this._ringBmp, pal);
            paintSpark(this._sparkBmp, pal);
        }

        // Driven by Spriteset_Battle; the default per-child update is skipped
        // on purpose so nothing runs twice and children are not traversed.
        update() { }

        tick(active, x, y) {
            // Presence: smooth pop-in / fade-out
            const target = active ? 1 : 0;
            this._presence += (target - this._presence) * (active ? 0.16 : 0.22);
            if (Math.abs(target - this._presence) < 0.005) this._presence = target;

            if (this._presence <= 0) {
                if (this.visible) this.visible = false;
                this._hasPos = false;
                return;
            }
            if (!this.visible) this.visible = true;

            // Repaint only when the color source changed
            const src = ConfigManager.plumbobColor;
            if (src !== this._colorSrc) {
                this._colorSrc = src;
                this._repaint();
            }

            // Glide toward the active actor
            if (active) {
                if (!this._hasPos) {
                    this._px = x; this._py = y; this._hasPos = true;
                } else {
                    this._px += (x - this._px) * 0.3;
                    this._py += (y - this._py) * 0.3;
                    if (Math.abs(x - this._px) < 0.25) this._px = x;
                    if (Math.abs(y - this._py) < 0.25) this._py = y;
                }
            }
            this.x = Math.round(this._px);
            this.y = Math.round(this._py);

            const p = this._presence;
            const ease = 1 - Math.pow(1 - p, 3);
            const k = p >= 1 ? 1 : 0.82 + 0.18 * ease;
            this.scale.x = this.scale.y = k;
            this.alpha = p * masterAlpha;

            const t = (this._t += 1 / 60);
            this._phase += pulseSpeed / 60;
            const breathe = 0.5 + 0.5 * Math.sin(this._phase);

            // Breathing: alpha on the crisp ring, alpha+scale on the glow
            this._disc.alpha = 0.88 + 0.12 * breathe;
            this._glow.alpha = 0.7 + 0.3 * breathe;
            this._glow.scale.x = this._glow.scale.y = (1 + 0.05 * breathe) / SS;

            // Ripples
            const cycle = 2.6 * 3 / pulseSpeed;
            for (let i = 0; i < 2; i++) {
                const u = ((t / cycle) + i * 0.5) % 1;
                const s = 0.92 + 0.55 * (1 - (1 - u) * (1 - u));
                const r = this._ripples[i];
                r.scale.x = r.scale.y = s / SS;
                r.alpha = Math.min(1, u / 0.12) * Math.pow(1 - u, 1.6) * 0.7;
            }

            const rx1 = circleSize * 0.96, ry1 = circleSize * 0.4 * 0.96;

            // Orbiting comets with a fading, depth-scaled trail
            const w = 1.5 * (pulseSpeed / 3);
            for (const o of this._orbiters) {
                const head = t * w * o.speed * o.dir + o.phase;
                for (let j = 0; j < TRAIL; j++) {
                    const a = head - j * 0.075 * o.dir;
                    const d = (Math.sin(a) + 1) / 2;       // 0 = back, 1 = front
                    const fade = 1 - j / TRAIL;
                    const s = (0.55 + 0.45 * d) * (0.3 + 0.7 * fade) * 0.9 / SS;
                    const sp = o.trail[j];
                    sp.x = Math.cos(a) * rx1;
                    sp.y = Math.sin(a) * ry1;
                    sp.scale.x = sp.scale.y = s;
                    sp.alpha = (0.45 + 0.55 * d) * fade * fade;
                }
            }

            // Rising motes
            for (const m of this._motes) {
                const u = ((t + m.offset * m.period) / m.period) % 1;
                const sp = m.sprite;
                sp.x = Math.cos(m.angle) * rx1 * m.radius + Math.sin(u * Math.PI * 2 + m.offset * 6) * m.wobble;
                sp.y = Math.sin(m.angle) * ry1 * m.radius - u * m.rise;
                sp.alpha = Math.sin(u * Math.PI) * 0.85;
                sp.scale.x = sp.scale.y = (0.28 + 0.22 * (1 - u)) / SS;
            }
        }
    }

    //-------------------------------------------------------------------------
    // Spriteset_Battle
    //-------------------------------------------------------------------------

    const _Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function () {
        _Spriteset_Battle_createLowerLayer.call(this);
        this.createTurnIndicator();
    };

    Spriteset_Battle.prototype.createTurnIndicator = function () {
        this._turnIndicator = new Sprite_TurnIndicator();
        this._turnIndicator.visible = false;
        this._battleField.addChildAt(this._turnIndicator, 0);
    };

    Spriteset_Battle.prototype.updateTurnIndicator = function () {
        const indicator = this._turnIndicator;
        if (!indicator) return;
        const actor = BattleManager.actor();
        const sprite = (actor && actor.isAlive()) ? this.findActorSprite(actor) : null;
        if (sprite) {
            indicator.tick(true, sprite.x, sprite.y + yOffset);
        } else {
            indicator.tick(false, 0, 0);
        }
    };

    const _Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function () {
        _Spriteset_Battle_update.call(this);
        this.updateTurnIndicator();
    };

    Spriteset_Battle.prototype.isInputting = function () {
        return BattleManager.isInputting() ||
            BattleManager._phase === 'input' ||
            SceneManager._scene.isAnyInputWindowActive();
    };

    Spriteset_Battle.prototype.findActorSprite = function (actor) {
        if (!this._actorSprites) return null;
        for (const sprite of this._actorSprites) {
            if (sprite._actor === actor) return sprite;
        }
        return null;
    };

})();