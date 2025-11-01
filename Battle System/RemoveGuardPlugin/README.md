# Remove Guard Command Plugin

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)

A simple RPG Maker MZ plugin that removes the "Guard" command from the battle menu.

## 📋 Description

This plugin removes the "Guard" option from the actor command window during battles in RPG Maker MZ. Perfect for games where the guard mechanic doesn't fit your battle system or gameplay design.

## ✨ Features

- Completely removes the Guard command from battle menus
- Works with all actors automatically
- Lightweight and conflict-free
- No configuration needed - plug and play!

## 🎮 Compatibility

- **RPG Maker Version:** MZ
- **Battle System:** Side-view and Front-view
- **Conflicts:** None known

## 📦 Installation

1. Download `RemoveGuardCommand.js`
2. Place the file in your project's `js/plugins/` folder
3. Open RPG Maker MZ
4. Go to **Plugin Manager** (F10)
5. Click **Add** and select `RemoveGuardCommand` from the list
6. Make sure the plugin is set to **ON**
7. Click **OK**

## 🔧 Usage

Once installed and activated, the Guard command will automatically be removed from all battle menus. No additional configuration is required!

## 📸 Screenshots

### Before
```
> Attack
> Guard    ← This will be removed
> Skills
> Items
```

### After
```
> Attack
> Skills
> Items
```

## 📝 Parameters

This plugin has no parameters - it works automatically once enabled.

## ⚙️ How It Works

The plugin overrides the `Window_ActorCommand.prototype.makeCommandList` method to filter out the guard command symbol before the battle menu is displayed.

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
- **Inspiration**: Bridging the gap between actor and enemy sprite systems

## 📜 Changelog

### Version 1.0.0 - Initial Release
- Added functionality to remove Guard command from battle menu

## 👤 Author

**Alexandros Panagiotakopoulos**
- Website: [alexandrospanag.github.io](https://alexandrospanag.github.io)

## 🐛 Bug Reports & Feature Requests

If you encounter any issues or have suggestions for improvements, please open an issue on the GitHub repository.

## 📄 License

This plugin is released under the MIT License.

---

Made with ❤️ for the RPG Maker MZ community
