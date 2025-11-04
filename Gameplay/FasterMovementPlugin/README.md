# Faster Movement Speed for RPG Maker MZ
![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-green.svg)

A plugin that significantly increases both walking and running speeds in RPG Maker MZ. Make your game feel more responsive and reduce tedious movement with fully customizable speed parameters. Perfect for action-oriented games or players who want a faster-paced experience.

---

## ✨ Features

- 🚶 **Faster Walking** — Increases default walk speed from 4 to 5 (customizable up to 10)
- 🏃 **Faster Running** — Increases default dash speed from 5 to 7 (customizable up to 10)
- 👥 **Party Followers Included** — All party members move at the same speed
- ⚙️ **Fully Customizable** — Adjust speeds through plugin parameters to your preference
- ⚡ **Plug-and-Play** — Works automatically once enabled
- 🎮 **Non-Intrusive** — Doesn't affect events, vehicles, or other movement systems

---

## 🚀 Installation

1. Download `FasterMovementSpeed.js`
2. Copy it to your project's plugin folder:
   ```
   YourProject/js/plugins/FasterMovementSpeed.js
   ```
3. Open RPG Maker MZ
4. Go to **Tools → Plugin Manager**
5. Click **Add** or double-click an empty slot
6. Select `FasterMovementSpeed` from the list
7. Ensure the plugin is **ON** (checkbox enabled)
8. Click **OK**

---

## 🎮 Usage

### Default Settings
The plugin works immediately with recommended default speeds:
- **Walking Speed**: 5 (RPG Maker default: 4)
- **Running Speed**: 7 (RPG Maker default: 5)

### Customization
1. In Plugin Manager, double-click the `FasterMovementSpeed` plugin
2. Adjust the parameters:
   - **Walking Speed** — Set between 1-10 (recommended: 5-6)
   - **Running/Dash Speed** — Set between 1-10 (recommended: 7-8)
3. Click **OK** to save

### Speed Reference
- **1-3**: Very slow (slower than default)
- **4**: RPG Maker default walk speed
- **5**: RPG Maker default run speed / Plugin default walk speed
- **6**: Noticeably faster walking
- **7**: Plugin default run speed (much faster)
- **8-9**: Very fast movement
- **10**: Extremely fast (may feel too fast for most games)

---

## 📝 License & Credits

### License
This project is licensed under the **Creative Commons Attribution 4.0 International License**.

**You are free to:**
- ✅ Share — copy and redistribute in any medium or format
- ✅ Adapt — remix, transform, and build upon the material  
- ✅ Commercial Use — use for commercial projects

**Under the following terms:**
- 📝 **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.

### Credits
- **Author**: Alexandros Panagiotakopoulos
- **Framework**: RPG Maker MZ Plugin System
- **Technologies**: JavaScript ES6+, RPG Maker MZ Core Scripts
- **Inspiration**: Making RPG Maker games feel more responsive and modern

---

## 📋 Requirements

- **RPG Maker MZ** (Version 1.0.0 or higher)

---

## 🔧 Troubleshooting

- **Speed feels too fast/slow**: Adjust the plugin parameters to your liking
- **Followers not keeping up**: This shouldn't happen, but if it does, ensure no other plugins are overriding follower movement
- **Events move at weird speeds**: This plugin only affects the player and party; event speeds are unchanged
- **Speed resets after cutscenes**: Some cutscenes may temporarily override speeds, but they return to normal after

---

## 💡 Tips

- **For Action Games**: Try walk: 6, dash: 8
- **For Standard RPGs**: Try walk: 5, dash: 7 (default)
- **For Exploration Games**: Try walk: 5, dash: 6
- Test your speeds on both small indoor maps and large outdoor maps to find the right balance

---

**Made with ❤️ for the RPG Maker community**
