# Credits Plugin Documentation

![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-orange)


## 👤 Author

**Alexandros Panagiotakopoulos**


---

## 📖  Overview

The Credits Plugin adds a beautiful, scrolling credits scene to your RPG Maker MZ game. It reads credit information from a text file and displays it with smooth scrolling animations, perfect for showcasing your game's contributors at the end of your game or from the options menu.

- Credis Plugin Markdown version accepts special markdown documents (.md format) for more professional characters and/or documentation.

---

## ✨ Features

- **Simple Text File Integration** - Credits are read from an easy-to-edit text file
- **Smooth Auto-Scrolling** - Automatic scrolling with configurable speed
- **Manual Control** - Players can scroll up/down manually using arrow keys
- **Customizable Appearance** - Adjust font size, colors, scroll speed
- **Looping Credits** - Automatically loops back to the start when finished
- **Multiple Integration Options** - Can be added to Options menu or Title screen
- **Dark Background** - Clean, professional presentation with customizable background

---

## 📦 Installation

### Step 1: Install the Plugin

1. Save `CreditsPlugin.js` in your project's `js/plugins/` folder
2. Open the Plugin Manager in RPG Maker MZ
3. Add `CreditsPlugin` to your plugin list
4. Enable the plugin

### Step 2: Create Your Credits File

1. Navigate to your project's `data/` folder
2. Create a new text file named `credits.txt`
3. Write your credits (see format below)

### Step 3: Configure Plugin Parameters (Optional)

Open the Plugin Manager and configure:
- Credits file path
- Scroll speed
- Font size
- Text and background colors

---

## Credits File Format

The credits file uses a simple plain text format. Each line in the file becomes one line in the credits display.

### Example credits.txt:

```
My Amazing RPG

Developed by Studio Name


Created by: John Doe

Programming: Jane Smith
Art Direction: Bob Artist
Character Design: Alice Designer
Music & Sound: Charlie Composer
Writing: David Writer


Special Thanks:
All our supporters and playtesters

Thank you for playing!


© 2025 Studio Name. All Rights Reserved.
```

### Formatting Tips:

- **One entry per line** - Each line in the file is one line in the credits
- **Blank lines** - Use empty lines to create spacing between sections
- **No special formatting** - Use plain text only (no bold, italics, etc.)
- **Centered text** - All text is automatically centered on screen
- **Any length** - Your credits can be as long or short as you need

---

## Plugin Parameters

### Credits File Path
- **Type:** Text
- **Default:** `data/credits.txt`
- **Description:** Path to your credits text file relative to project root
- **Example:** `data/my_credits.txt`

### Scroll Speed
- **Type:** Number
- **Range:** 0.1 - 10.0
- **Default:** 1.0
- **Description:** Speed of automatic scrolling (lower = slower, higher = faster)
- **Recommended:** 0.5-2.0 for comfortable reading

### Font Size
- **Type:** Number
- **Range:** 12 - 72
- **Default:** 28
- **Description:** Size of the credits text in pixels
- **Recommended:** 24-32 for most displays

### Text Color
- **Type:** Text (CSS Color)
- **Default:** `#ffffff` (white)
- **Description:** Color of the credits text in CSS format
- **Examples:** 
  - `#ffffff` (white)
  - `#ffff00` (yellow)
  - `#00ff00` (green)
  - `rgba(255, 255, 255, 0.9)` (semi-transparent white)

### Background Color
- **Type:** Text (CSS Color)
- **Default:** `#000000` (black)
- **Description:** Background color for the credits scene
- **Examples:**
  - `#000000` (black)
  - `#1a1a2e` (dark blue)
  - `rgba(0, 0, 0, 0.95)` (semi-transparent black)

---

## Player Controls

When viewing credits, players can use these controls:

| Input | Action |
|-------|--------|
| **ESC / X** | Return to previous menu |
| **Enter / Z** | Return to previous menu |
| **↑ Up Arrow** | Scroll up (pauses auto-scroll) |
| **↓ Down Arrow** | Scroll down (pauses auto-scroll) |
| **Mouse Click** | Return to previous menu |

### Auto-Scroll Behavior:
- Credits automatically scroll from bottom to top
- Manual scrolling pauses auto-scroll
- Credits loop back to the start when finished
- Scroll position is clamped to prevent going out of bounds

---

## Integration Options

### Option 1: Add to Options Menu (Recommended)

The plugin can be integrated into RPG Maker MZ's default Options menu. The credits option will appear at the bottom of the options list.

**Access:** Title Screen → Options → Credits

### Option 2: Add to Title Screen

You can modify the plugin to add a "Credits" button directly to the title screen menu alongside New Game, Continue, and Options.

**Access:** Title Screen → Credits

### Option 3: Custom Integration

For developers using custom menu systems, you can call the credits scene programmatically:

```javascript
SceneManager.push(Scene_Credits);
```

---

## Troubleshooting

### Credits Don't Appear

**Problem:** The credits option doesn't show up in the menu.

**Solutions:**
1. Check that the plugin is enabled in Plugin Manager
2. Verify the plugin is loaded in the correct order
3. If using a custom menu plugin, ensure this plugin loads AFTER it
4. Restart playtest (F5) after enabling the plugin

### Error Loading Credits File

**Problem:** "Error loading credits file!" message appears.

**Solutions:**
1. Verify `credits.txt` exists in the `data/` folder
2. Check the file path in plugin parameters matches the actual file location
3. Ensure the file is saved as plain text (.txt format)
4. Check for typos in the filename

### Text Appears Too Small/Large

**Problem:** Credits text is hard to read.

**Solutions:**
1. Adjust the "Font Size" parameter in Plugin Manager
2. Recommended range: 24-32 for most displays
3. Test on your target display resolution
4. Consider your game's native resolution when setting font size

### Scrolling Too Fast/Slow

**Problem:** Credits scroll at an uncomfortable speed.

**Solutions:**
1. Adjust the "Scroll Speed" parameter
2. Lower values = slower scrolling (0.5 for slow, relaxed pace)
3. Higher values = faster scrolling (2.0 for quick credits)
4. Default 1.0 is a good middle ground
5. Test with your actual credits length

### Credits Don't Loop

**Problem:** Credits stop scrolling after one pass.

**Solution:** This is the intended behavior - credits loop automatically when they finish scrolling off the top of the screen. If this isn't working, there may be a conflict with another plugin.

---

## Advanced Usage

### Calling Credits from Events

You can trigger the credits scene from any event using a Script call:

```javascript
SceneManager.push(Scene_Credits);
```

**Use cases:**
- Show credits at the end of your game
- Create a "View Credits" NPC
- Add credits to custom menu systems
- Trigger after defeating final boss

### Multiple Credits Files

You can create multiple credits files and swap between them:

```javascript
// Change credits file temporarily
const originalFile = PluginManager.parameters('CreditsPlugin')['creditsFile'];
PluginManager.parameters('CreditsPlugin')['creditsFile'] = 'data/ending_credits.txt';
SceneManager.push(Scene_Credits);
// Restore original after scene ends
```

### Custom Styling

For advanced developers, you can modify the credits appearance by editing the `Scene_Credits` class:

- `createCreditsSprite()` - Modify text rendering
- `createCustomBackground()` - Change background appearance
- `update()` - Adjust scrolling behavior

---

## Compatibility

### Compatible With:
- ✅ RPG Maker MZ (all versions)
- ✅ Most menu plugins
- ✅ Scene management plugins
- ✅ UI plugins

### Load Order:
- Load AFTER custom menu plugins
- Load AFTER scene management plugins
- Load BEFORE visual effect plugins

### Known Conflicts:
- None currently identified

---

## Best Practices

### Writing Good Credits

1. **Group by category** - Separate developers, artists, musicians, etc.
2. **Use blank lines** - Create visual breaks between sections
3. **Keep it readable** - Don't make credits too long
4. **Include everyone** - Acknowledge all contributors
5. **Add copyright** - Include copyright and legal notices at the end

### Performance

- Credits files should be under 500 lines for best performance
- Large images are NOT supported (text only)
- The plugin is lightweight and won't impact game performance

### Testing

1. Test credits with your actual content, not placeholder text
2. Watch the entire credits sequence at least once
3. Test manual scrolling controls
4. Verify credits loop properly
5. Test on different screen resolutions

---

## Examples

### Minimal Credits
```
My First RPG

Created by: Your Name

Thanks for playing!
```

### Standard Credits
```
My Amazing RPG
Chapter One


DEVELOPMENT TEAM

Director: John Doe
Producer: Jane Smith


PROGRAMMING
Lead Programmer: Bob Code
Systems: Alice Dev
Tools: Charlie Tech


ART
Art Director: David Draw
Character Art: Eve Pixel
Environment Art: Frank Brush


MUSIC & SOUND
Composer: Grace Note
Sound Design: Henry Audio


SPECIAL THANKS
Our wonderful community
All playtesters and supporters


© 2025 Studio Name
```

### End Game Credits
```
THE END


GAME DIRECTOR
Your Name


STORY & WRITING
Lead Writer: Story Person
Additional Writing: Helper Writer


PROGRAMMING
Engine: Developer One
Gameplay: Developer Two
UI/UX: Developer Three


ART & ANIMATION
Character Design: Artist One
Background Art: Artist Two
Animation: Artist Three
Visual Effects: Artist Four


MUSIC & AUDIO
Original Soundtrack: Composer Name
Sound Effects: Sound Designer
Voice Acting: Actor Names


SPECIAL THANKS TO
Our Kickstarter Backers
Beta Testers
Family and Friends


And special thanks to YOU
for playing our game!


Visit us at: www.yourgame.com


© 2025 Your Studio Name
All Rights Reserved
```


---

## ⚖️ License

**Copyright © 2025 Alexandros Panagiotakopoulos**

This work is licensed under the Creative Commons Attribution-NoDerivatives 4.0 International License. To view a copy of this license, visit http://creativecommons.org/licenses/by-nd/4.0/

You are free to:
- **Share** - Copy and redistribute the material in any medium or format for any purpose, even commercially
- The licensor cannot revoke these freedoms as long as you follow the license terms

Under the following terms:
- **Attribution** - You must give appropriate credit, provide a link to the license, and indicate if changes were made
- **NoDerivatives** - If you remix, transform, or build upon the material, you may not distribute the modified material

**Free to use with attribution required.**

---

## Changelog

### Version 1.0.0 (2025)
- Initial release
- Basic credits scrolling functionality
- Text file integration
- Customizable parameters
- Manual scroll controls
- Auto-looping credits
