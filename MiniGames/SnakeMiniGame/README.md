# Snake Minigame for RPG Maker MZ

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-red.svg)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-green.svg)

A lightweight, highly customizable Snake Minigame for RPG Maker MZ. Featuring a dark pixel-grid aesthetic with glowing-style rounded cells, a growing purple snake, bright fruit, and simple integration with MZ's eventing system. Perfect for minigames, casino areas, puzzle rooms, or quick side activities!

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
* **Technologies**: JavaScript ES6+, Canvas 2D (via MZ Bitmap)

## 👤 Author

**Alexandros Panagiotakopoulos**
Website: [alexandrospanag.github.io](https://alexandrospanag.github.io)

## ✨ Features

- 🐍 **Classic Snake Gameplay** - The snake grows by one cell every time it eats a fruit, and the game ends when you reach the maximum length or bite your own tail.
- 🎨 **Pixel-Grid Aesthetics** - A dark grid of small rounded squares, a purple snake with a brighter head, and a bright-colored fruit that stands out on the board.
- 📐 **Fully Adjustable Board** - Choose the number of columns and rows, the cell size in pixels, the gap between cells, and the fruit size in cells.
- ⌨️ **Flexible Controls** - Arrow keys, numpad, or swipe gestures on touch screens. Input is queued so quick turns feel responsive, and instant 180° reversals are blocked.
- 🧱 **Wall Modes** - Choose between wrapping around the edges or treating walls as deadly.
- 🔄 **Event Integration** - A win/lose switch and a final-length variable let you branch your cutscenes, quests, and rewards based on the result.
- ⚡ **Lightweight** - A single file with no dependencies, no external images, and no audio files required (uses MZ's built-in system sounds).

## 📦 Installation

1. Download `SnakeMiniGame.js`.
2. Place it in your project's `js/plugins/` folder.
3. Open the RPG Maker MZ Plugin Manager.
4. Add "SnakeMiniGame" to your plugin list and enable it.
5. **Important**: Save your project.

> ⚠️ The filename must match the plugin name exactly (`SnakeMiniGame.js`). If you rename the file, update the `pluginName` constant at the top of the script too.

## 🎮 Usage

### Launching the Minigame

To start the minigame from an event, use the **Plugin Command** feature in RPG Maker MZ:

1. Create an Event.
2. Add a Plugin Command.
3. Select `SnakeMiniGame` from the dropdown.
4. Choose **Start Snake**.
5. Configure the arguments (e.g., Grid Size, Max Length, Win Switch, Length Variable).

### Default Controls

- **[Arrow Keys / Numpad 8-4-6-2]** - Steer the snake up, left, right, or down
- **[Swipe]** - Steer the snake on touch screens
- **[OK / Cancel]** - Close the game after the round ends

### Rules

- Eat the fruit to grow by one cell.
- 🏆 **Win** by reaching the **Max Length**.
- 💀 **Lose** by hitting your own tail (or a wall, if Wrap Walls is turned off).

## 🔧 Technical Details

### Command Arguments

| Argument | Description | Default |
|---|---|---|
| **Grid Columns** | Number of columns on the board | `40` |
| **Grid Rows** | Number of rows on the board | `7` |
| **Cell Size (px)** | Width and height of each square | `14` |
| **Cell Gap (px)** | Space between squares | `3` |
| **Fruit Size (cells)** | Fruit is a square of this many cells per side (1-3) | `1` |
| **Fruit Color** | Hex color of the fruit | `#00ff41` |
| **Snake Color** | Hex color of the snake body | `#a0149f` |
| **Start Length** | Starting length of the snake | `3` |
| **Max Length (win)** | Length required to win | `20` |
| **Frames Per Move** | Lower = faster (60 frames = 1 second) | `8` |
| **Wrap Walls** | Pass through edges instead of dying | `true` |
| **Win Switch** | Set ON on win, OFF on loss (`0` = none) | `0` |
| **Length Variable** | Stores the final snake length (`0` = none) | `0` |

### Event Integration

After the game closes, you can use conditional branches in your event:

- Check the **Win Switch** to see whether the player won or lost.
- Read the **Length Variable** to reward the player based on how long the snake got.

### Custom Rendering

The minigame bypasses standard RPG Maker sprites and draws the board procedurally onto a single bitmap each time the snake moves. The board is centered automatically on screen. Cell size, gap, and colors are all adjustable through the command arguments, so you can reshape the look from a wide contribution-graph strip to a classic square arena.

## 🐛 Troubleshooting

### Plugin Command doesn't appear or does nothing?
- Make sure the file is named exactly `SnakeMiniGame.js` and is enabled in the Plugin Manager.
- Save the project after adding the plugin so the command list refreshes.

### Board is cut off or too big?
- The board width is `Columns × (Cell Size + Gap) - Gap`. Keep it within your game's resolution (816×624 by default in MZ).

### Rounded corners look square?
- Cells use the canvas `roundRect` function when available and fall back to plain squares on very old runtimes. Updating your RPG Maker MZ version fixes this.

### Snake feels too fast or too slow?
- Adjust **Frames Per Move**. Values between `5` (fast) and `12` (relaxed) work well for most boards.

---

**Made with ❤️ for the RPG Maker community**
