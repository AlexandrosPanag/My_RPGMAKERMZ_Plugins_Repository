# Pinball Minigame for RPG Maker MZ

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-red.svg)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-green.svg)

A full-featured, highly customizable Pinball Minigame for RPG Maker MZ. Featuring a custom 2D physics engine, stunning neon/synthwave aesthetics, procedural rendering, and deep integration with MZ's eventing system. Perfect for minigames, casino areas, or unique boss fights!

## 📄 License

This project is licensed under the **Creative Commons Attribution 4.0 International License**.

You are free to:
* ✅ **Share** — copy and redistribute in any medium or format
* ✅ **Adapt** — remix, transform, and build upon the material
* ✅ **Commercial Use** — use for commercial projects

Under the following terms:
* 📝 **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.

[View Full License](https://creativecommons.org/licenses/by/4.0/)

## 👏 Credits

* **Author**: Alexandros Panagiotakopoulos
* **Framework**: RPG Maker MZ Plugin System
* **Technologies**: JavaScript ES6+, PIXI.js, Custom 2D Physics

## 👤 Author

**Alexandros Panagiotakopoulos**
Website: [alexandrospanag.github.io](https://alexandrospanag.github.io)

## ✨ Features

- 🎮 **Custom Physics Engine** - Sub-stepped 2D circle-to-line/circle collision handling for realistic ball bouncing.
- 🎨 **Synthwave Aesthetics** - Beautiful procedural neon graphics, glowing trails, particle effects, and a dynamic starfield background.
- ⌨️ **Configurable Controls** - Customize the keyboard bindings for Left Flipper, Right Flipper, and the Plunger/Launch key via plugin parameters.
- 🎯 **Advanced Mechanics** - Includes bumpers, spinners, skill shot targets, score multipliers, combo timers, and a high-score bonus mode.
- 🔄 **Event Integration** - Win/Loss branching logic allowing you to seamlessly integrate the pinball game into your RPG Maker cutscenes and quests.
- ⚡ **High Performance** - Uses direct PIXI.js primitive rendering (Graphics API) ensuring smooth 60fps gameplay.

## 📦 Installation

1. Download `PinballMinigame.js`.
2. Place it in your project's `js/plugins/` folder.
3. Open the RPG Maker MZ Plugin Manager.
4. Add "PinballMinigame" to your plugin list and enable it.
5. (Optional) Tweak the physics, colors, and controls in the Plugin Parameters.
6. **Important**: Save your project.

## 🎮 Usage

### Launching the Minigame

To start the minigame from an event, use the **Plugin Command** feature in RPG Maker MZ:

1. Create an Event.
2. Add a Plugin Command.
3. Select `PinballMinigame` from the dropdown.
4. Choose **Start Pinball**.
5. Configure the arguments (e.g., Target Score, Starting Balls, Win/Lose Switch IDs).

### Default Controls

- **[Z]** - Left Flipper
- **[/] (Slash)** - Right Flipper
- **[Space]** - Hold and release to launch the ball from the top-left plunger.

*(These can be remapped in the Plugin Parameters)*

## 🔧 Technical Details

### Physics Configuration

You can tweak the internal physics in the Plugin Parameters to change how the game feels:
- **Gravity**: Downward pull applied to the ball.
- **Flipper Strength**: How hard the flippers hit the ball.
- **Bumper Restitution**: Bounciness of the bumpers.
- **Game Speed**: General time-scale multiplier.

### Custom Rendering

The minigame bypasses standard RPG Maker sprites and renders the board using pure PIXI Graphics. This gives it a crisp, modern, vector-like neon appearance. Custom visual properties (like `Table Color` and `Accent Color`) can be tweaked via Hex codes in the Plugin Parameters.

## 🐛 Troubleshooting

### Ball gets stuck?
- Ensure the physics parameters (gravity, flipper strength) aren't set to extreme values. The default settings are tuned for the best experience.
### Performance Drops?
- While highly optimized, very old hardware might struggle with PIXI particle limits. 

---

**Made with ❤️ for the RPG Maker community**

