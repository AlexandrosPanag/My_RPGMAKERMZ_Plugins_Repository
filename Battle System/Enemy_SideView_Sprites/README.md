# Enemy Side-View Sprites for RPG Maker MZ

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)

A plugin that allows enemies in RPG Maker MZ to use animated side-view sprite sheets instead of static battler images, bringing them to life with the same motion system used by actors.


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


## ✨ Features

- 🎭 **Animated Enemy Sprites** - Enemies use sprite sheets with walking, attacking, damage, and death animations
- 🔄 **Full Motion System** - Supports all standard RPG Maker MZ motions (walk, attack, damage, guard, spell, etc.)
- 📁 **Organized Asset Management** - Store enemy sprites in `img/sv_enemies/` with folder structure support
- 🎮 **Seamless Integration** - Works with the default side-view battle system
- 🏷️ **Simple Configuration** - Easy note tag system for assigning sprites to enemies
- ⚡ **Performance Optimized** - Efficient sprite rendering and animation handling

## 📋 Requirements

- **RPG Maker MZ** (Version 1.0.0 or higher)
- Side-view battle system enabled
- Enemy sprite sheets in the standard 9×6 format

## 🚀 Installation

### Step 1: Install the Plugin

1. Download `Enemy_SideView_Sprites.js`
2. Copy it to your project's plugin folder:
   ```
   YourProject/js/plugins/Enemy_SideView_Sprites.js
   ```
3. Open RPG Maker MZ
4. Go to **Tools → Plugin Manager**
5. Click **Add** or double-click an empty slot
6. Select `Enemy_SideView_Sprites` from the list
7. Ensure the plugin is **ON** (checkbox enabled)
8. Click **OK**

### Step 2: Prepare Your Sprite Assets

1. Create the enemy sprites folder:
   ```
   YourProject/img/sv_enemies/
   ```
2. Organize your sprite sheets (optional subfolders supported):
   ```
   img/sv_enemies/
   ├── Slime.png
   ├── Goblin.png
   └── Minions/
       ├── Slime/
       │   └── EN_001_Slime.png
       └── Skeleton/
           └── EN_002_Skeleton.png
   ```

### Step 3: Configure Your Enemies

1. Open the **Database** (F9)
2. Go to the **Enemies** tab
3. Select an enemy
4. In the **Note** field at the bottom, add:
   ```
   <SideViewSprite: YourSpriteName>
   ```

**Examples:**
```
<SideViewSprite: Slime>
<SideViewSprite: Minions/Slime/EN_001_Slime>
<SideViewSprite: Bosses/DragonKing>
```

> **Note:** Do not include the `.png` extension in the note tag.

## 🎨 Sprite Sheet Format

Enemy sprites must follow RPG Maker MZ's standard side-view format:

- **Dimensions**: 9 columns × 6 rows
- **Grid Layout**: Each cell is the same size
- **Animation Frames**: 3 frames per motion (columns 0-2, 3-5, 6-8)

### Motion Index Layout

| Row | Motion Type | Description |
|-----|------------|-------------|
| 0 | Walk | Idle/walking animation |
| 1 | Wait | Waiting stance |
| 2 | Chant | Casting/chanting magic |
| 3 | Guard | Defensive stance |
| 4 | Damage | Taking damage |
| 5 | Evade | Dodging attacks |
| 6 | Thrust | Thrusting weapon attack |
| 7 | Swing | Swinging weapon attack |
| 8 | Missile | Ranged attack |
| 9 | Skill | Using skills |
| 10 | Spell | Casting spells |
| 11 | Item | Using items |
| 12 | Escape | Fleeing animation |
| 13 | Victory | Victory pose |
| 14 | Dying | Near death |
| 15 | Abnormal | Status effect |
| 16 | Sleep | Sleeping |
| 17 | Dead | Death/collapse |

## 🎯 Usage

### Basic Setup

1. **Enable Side-View Battle System**:
   - Database → System 1 → Battle System → **Side View**

2. **Configure Enemy**:
   ```
   Enemy: Slime
   Note: <SideViewSprite: Slime>
   ```

3. **Create Troops**:
   - Add enemies to troops normally
   - Position them on the battle screen
   - The plugin handles sprite behavior automatically

### Advanced Usage

#### Multiple Enemy Types
```
Enemy: Blue Slime
Note: <SideViewSprite: Minions/Slime/BlueSlime>

Enemy: Red Slime
Note: <SideViewSprite: Minions/Slime/RedSlime>
```

#### Organized Folder Structure
```
img/sv_enemies/
├── Common/
│   ├── Slime.png
│   └── Bat.png
├── Boss/
│   ├── DragonLord.png
│   └── DemonKing.png
└── Elite/
    ├── KnightCaptain.png
    └── ArchMage.png
```

## 🔧 Troubleshooting

### Problem: Enemies appear as static images

**Solution:**
- Verify Side-View battle system is enabled (Database → System 1)
- Check that the note tag has both opening `<` and closing `>` brackets
- Ensure the sprite file exists in `img/sv_enemies/`

### Problem: Sprite not found error

**Solution:**
- Verify the path in the note tag matches your folder structure
- Do not include `.png` extension in the note tag
- Check for typos in the filename

### Problem: Sprite displays but doesn't animate

**Solution:**
- Verify sprite sheet is in 9×6 format
- Each frame should be the same size
- Check that the bitmap dimensions are divisible by 9 (width) and 6 (height)

### Problem: Plugin conflicts

**Solution:**
- Ensure this plugin loads after any battle system modifications
- Check plugin order in Plugin Manager
- Disable other plugins temporarily to identify conflicts

## 🎬 Example Project Structure

```
YourProject/
├── js/
│   └── plugins/
│       └── Enemy_SideView_Sprites.js
├── img/
│   ├── enemies/          # Original static enemy images (optional)
│   └── sv_enemies/       # New animated enemy sprites
│       ├── Slime.png
│       ├── Goblin.png
│       └── Minions/
│           └── Slime/
│               └── EN_001_Slime.png
└── data/
    └── Enemies.json      # Contains note tags
```


## 📚 Additional Resources

- [RPG Maker MZ Documentation](https://www.rpgmakerweb.com/support/products/rpg-maker-mz)
- [RPG Maker Forums](https://forums.rpgmakerweb.com/)
- [Plugin Development Guide](https://docs.google.com/document/d/1xz7kB1g_z_eTvLxNzLWLp7eKPKrO9yVK7S7i0f1Tq8E/)

## 🔮 Future Features

Planned improvements for future versions:
- Custom motion speed configuration
- Support for weapon-specific attack animations
- Hybrid mode (mix static and animated enemies)
- Extended motion set support
- Visual plugin configurator

---

**Made with ❤️ for the RPG Maker community**
