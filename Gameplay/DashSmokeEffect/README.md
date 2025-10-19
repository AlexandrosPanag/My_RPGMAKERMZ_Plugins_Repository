# 💨 Dash Smoke Effect Plugin

A Sonic-inspired smoke effect plugin for RPG Maker MZ that adds dynamic smoke puffs when the player and party members dash.

## Features

- 🌫️ **Automatic Smoke Trails** - Smoke puffs automatically appear when dashing
- 👥 **Party Support** - Works for both the player and all visible followers
- 🎨 **Smooth Animations** - Smoke fades out, scales up, and drifts realistically
- ⚙️ **Fully Customizable** - Adjust duration, interval, scale, and opacity via plugin parameters
- 🎯 **Zero Setup** - No plugin commands needed, works immediately after installation


## ⚙️ Changelogs:
#1.0.2: Fixed an issuue with Star-marked tiles and smoothed the animation so it has less smoke.
#1.0.3: Fixed an issuue with a non-existent 5th party-member's shadow. 

## Installation

1. Download `DashSmokeEffect.js`
2. Place it in your project's `js/plugins/` folder
3. Open RPG Maker MZ
4. Go to **Tools → Plugin Manager**
5. Add the plugin to your plugin list
6. Save your project
7. Test it out by holding **Shift** while moving!

## How It Works

The plugin detects when the player or party members are dashing (holding Shift while moving) and creates smoke puff sprites at their position. Each smoke puff:

- Starts at full opacity and gradually fades out
- Scales up slightly as it disappears
- Drifts upward and sideways for natural movement
- Automatically cleans itself up when the animation completes

## Plugin Parameters

### Smoke Duration
- **Default:** 30 frames
- **Description:** How long each smoke puff lasts before disappearing
- **Tip:** Lower values create quick puffs, higher values make lingering smoke

### Smoke Interval
- **Default:** 8 frames
- **Description:** Frames between each smoke puff while dashing
- **Tip:** Lower values create a denser trail, higher values space them out

### Smoke Scale
- **Default:** 1.5
- **Description:** Size multiplier for the smoke sprite (1.0 = normal size)
- **Tip:** Adjust based on your character sprite size for best visual effect

### Starting Opacity
- **Default:** 200 (out of 255)
- **Description:** Initial opacity of each smoke puff
- **Tip:** Lower for subtle effects, higher for more prominent smoke

## Customization Examples

### Dense Sonic-Style Trail
```
Smoke Duration: 20
Smoke Interval: 5
Smoke Scale: 1.5
Starting Opacity: 200
```

### Subtle Ghost Effect
```
Smoke Duration: 40
Smoke Interval: 12
Smoke Scale: 2.0
Starting Opacity: 120
```

### Quick Burst Style
```
Smoke Duration: 15
Smoke Interval: 8
Smoke Scale: 1.2
Starting Opacity: 255
```

## Technical Details

- **Target:** RPG Maker MZ
- **Dependencies:** None
- **Compatibility:** Should work with most plugins
- **Performance:** Lightweight with automatic sprite cleanup

## Troubleshooting

**Q: I don't see any smoke when dashing**
- Make sure you're holding **Shift** while moving (not just moving fast)
- Check that the plugin is enabled in the Plugin Manager
- Verify you're testing on a map (not in battle or menus)

**Q: The smoke appears too often/not enough**
- Adjust the **Smoke Interval** parameter to control frequency

**Q: The smoke is too big/small**
- Modify the **Smoke Scale** parameter to resize the effect

**Q: Can I change the smoke color?**
- Currently the smoke is white/gray. You can edit the `drawSmokeCircle` method in the code to change the gradient colors


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
- **Technologies**: JavaScript ES6+, CSS3 Animations, HTML5 APIs
- **Inspiration**: Modern browser power management and mobile battery optimization



---

**Enjoy your Sonic-speed adventures! 🦔💨**
