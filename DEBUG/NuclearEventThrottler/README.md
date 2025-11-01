# 💣 Nuclear Event Throttler - Extreme Stress Testing Plugin

<div align="center">

![Version](https://img.shields.io/badge/version-1.0.0-red.svg)
![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-blue.svg)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-green.svg)
![Status](https://img.shields.io/badge/status-TESTING%20ONLY-critical.svg)

**⚠️ EXTREME WARNING: FOR STRESS TESTING ONLY ⚠️**

</div>

---

## 🚨 CRITICAL WARNINGS - READ BEFORE USE

### ⛔ **DO NOT USE IN PRODUCTION**

This plugin is **INTENTIONALLY DESIGNED TO CRASH YOUR GAME**. It is a debugging and stress-testing tool for experienced developers only.

<div align="center">

### ❌ **NEVER** USE THIS PLUGIN IF:
- You are building a final game release
- You are inexperienced with debugging
- You don't understand performance profiling
- You haven't saved your project recently
- You are working on a production build

### ✅ **ONLY** USE THIS PLUGIN IF:
- You are an experienced developer
- You need hardware benchmarking data
- You are testing engine limits
- You understand crash analysis
- You have proper backups

</div>

---

## 📋 Table of Contents
- [What This Plugin Does](#what-this-plugin-does)
- [Why This Plugin Exists](#why-this-plugin-exists)
- [Installation](#installation)
- [Usage Instructions](#usage-instructions)
- [Configuration](#configuration)
- [Understanding the Output](#understanding-the-output)
- [Safety Features](#safety-features)
- [Known Risks](#known-risks)
- [Troubleshooting](#troubleshooting)
- [License & Credits](#-license--credits)

---

## 🎯 What This Plugin Does

The **Nuclear Event Throttler** is an extreme stress-testing tool that:

1. **Spawns massive quantities of events** - Starts with 100 events and exponentially increases
2. **Monitors real-time performance** - Tracks FPS, memory usage, and system load
3. **Logs detailed crash data** - Records exact failure points for analysis
4. **Pushes hardware to limits** - Tests maximum capacity before crash/freeze
5. **Provides benchmark data** - Console output for performance profiling

### Technical Specifications

```
Initial Spawn: 100 events (configurable)
Wave Increment: +50 events per wave (configurable)
Spawn Interval: 60 frames (~1 second) (configurable)
Safety Limit: 10,000 events (configurable, can be disabled)
Performance Monitoring: FPS, Memory, Event Count, Elapsed Time
```

---

## 🔬 Why This Plugin Exists

### Legitimate Use Cases:

1. **Hardware Benchmarking**
   - Test game performance on different PC specifications
   - Determine minimum system requirements
   - Compare performance across devices

2. **Engine Limit Testing**
   - Find RPG Maker MZ's maximum event capacity
   - Test sprite rendering limits
   - Analyze memory management behavior

3. **Performance Optimization**
   - Identify bottlenecks in event systems
   - Test plugin compatibility under stress
   - Validate optimization techniques

4. **Educational Purposes**
   - Learn about performance profiling
   - Understand crash analysis
   - Study memory management

### ❌ **NOT** for:
- Actual gameplay mechanics
- Production environments
- Players to interact with
- Final game builds
- Unsupervised testing

---

## 📦 Installation

### Prerequisites
- RPG Maker MZ (latest version recommended)
- Basic understanding of the browser console (F12)
- Recent project backup
- Saved game state

### Steps

1. **Download** `NuclearEventThrottler.js`

2. **Place** the file in your project's `js/plugins/` folder

3. **Open** RPG Maker MZ Plugin Manager

4. **Add** the plugin to your plugin list

5. **Configure** parameters (see Configuration section)

6. **⚠️ IMPORTANT:** Enable the plugin **ONLY** during testing sessions

7. **⚠️ REMEMBER:** Disable before any builds or playtesting

---

## 🎮 Usage Instructions

### Starting the Stress Test

1. **Open your game** in test mode (F12 to open console)

2. **Navigate** to any map in your game

3. **Press F9** (or your configured key) to start

4. **Watch** the console for performance data

5. **Wait** for the game to slow down, freeze, or crash

### Stopping the Test

- **Press F9 again** (if the game is still responsive)
- **Close the game** if frozen
- **Force quit** if crashed

### Reading Console Output

```javascript
🚀 SPAWNING WAVE 1: 100 EVENTS
📊 WAVE 1 COMPLETE
   Events Spawned: 100
   Total Events: 100
   Current FPS: 60
   Average FPS: 60.0
   Elapsed Time: 1.00s
   Memory: 45.23MB / 2048.00MB (Limit: 4096.00MB)
   Memory Usage: 1.1%
---
```

---

## ⚙️ Configuration

### Plugin Parameters

| Parameter | Default | Description | Risk Level |
|-----------|---------|-------------|------------|
| **Initial Spawn Count** | 100 | Events in first wave | 🟡 Medium |
| **Spawn Interval** | 60 frames | Time between waves | 🟡 Medium |
| **Increment Per Wave** | 50 | Additional events per wave | 🟠 High |
| **Maximum Events** | 10,000 | Safety limit | 🔴 Critical |
| **Enable Movement** | true | Events move randomly | 🟠 High |
| **Enable Animations** | true | Animated sprites | 🟠 High |
| **Monitor FPS** | true | Track performance | 🟢 Safe |
| **Auto Stop on Low FPS** | false | Stop at FPS < 10 | 🟢 Safe |
| **Activation Key** | F9 | Hotkey to start/stop | 🟢 Safe |

### Recommended Configurations

#### Conservative Testing (Safest)
```
Initial Spawn: 50
Interval: 120 frames
Increment: 25
Max Events: 5,000
Movement: false
Animations: false
Auto Stop: true
```

#### Standard Testing (Moderate)
```
Initial Spawn: 100
Interval: 60 frames
Increment: 50
Max Events: 10,000
Movement: true
Animations: true
Auto Stop: false
```

#### Nuclear Testing (EXTREME)
```
Initial Spawn: 500
Interval: 30 frames
Increment: 100
Max Events: 50,000
Movement: true
Animations: true
Auto Stop: false
```

⚠️ **Nuclear testing WILL crash most systems very quickly!**

---

## 📊 Understanding the Output

### Console Metrics Explained

#### FPS (Frames Per Second)
- **60 FPS** - Optimal performance
- **30-60 FPS** - Noticeable lag beginning
- **10-30 FPS** - Severe lag
- **<10 FPS** - Near freeze state
- **0 FPS** - Frozen/crashed

#### Memory Usage
- **<50%** - Healthy
- **50-80%** - High usage
- **>80%** - Critical, crash imminent
- **>95%** - Crash likely

#### Performance Warnings

```javascript
⚠️ WARNING: SEVERE LAG DETECTED (FPS: 25)
🔥 CRITICAL: NEAR FREEZE STATE (FPS: 8)
🔥 CRITICAL: HIGH MEMORY USAGE (87.3%)
```

### Final Summary Report

After stopping (or crashing), you'll see:

```javascript
💀 NUCLEAR STRESS TEST SUMMARY 💀
Total Waves: 15
Total Events Spawned: 1750
Final FPS: 12
Test Duration: 45.32s

📈 Performance Degradation:
   FPS Drop: 60 → 12 (80.0% degradation)

🎯 CRASH/FREEZE POINT DATA:
   Events at failure: ~1750
   Waves completed: 15
   Final Memory: 1834.56MB / 4096.00MB

[Detailed Performance Table]
```

---

## 🛡️ Safety Features

### Built-in Protections

1. **Maximum Event Limit**
   - Default: 10,000 events
   - Prevents infinite spawning
   - Can be disabled for extreme tests

2. **Auto-Stop on Low FPS**
   - Optional safety feature
   - Stops at FPS < 10
   - Prevents hard crashes (sometimes)

3. **Event Cleanup System**
   - Removes spawned events on stop
   - Clears sprites from memory
   - Triggers garbage collection hint

4. **Performance Monitoring**
   - Real-time FPS tracking
   - Memory usage alerts
   - Progressive warnings

### Emergency Procedures

If the game freezes:
1. **Wait 30 seconds** - May recover
2. **Task Manager** - End process if needed (Ctrl+Shift+Esc)
3. **Force Quit** - Alt+F4 (Windows) or Cmd+Q (Mac)
4. **Restart** - Relaunch RPG Maker MZ

⚠️ **Unsaved progress will be lost!**

---

## ⚠️ Known Risks

### Will Definitely Happen:
- ✅ Game will lag significantly
- ✅ FPS will drop to single digits
- ✅ Memory usage will spike
- ✅ Game may freeze completely
- ✅ Game may crash to desktop

### May Happen:
- ⚠️ Browser tab crash (web version)
- ⚠️ System slowdown
- ⚠️ Temporary unresponsiveness
- ⚠️ GPU driver timeout (rare)

### Will NOT Happen:
- ❌ Permanent system damage
- ❌ File corruption (if saved properly)
- ❌ Operating system crash
- ❌ Hardware damage

### Data Loss Prevention

**ALWAYS** before testing:
1. Save your project
2. Close other applications
3. Backup important work
4. Test on a separate project copy

---

## 🔧 Troubleshooting

### Game Won't Start After Test

**Solution:** Disable the plugin in Plugin Manager and restart

### Console Shows Errors

**Solution:** Check that you're using RPG Maker MZ (not MV) and the latest version

### Test Doesn't Start

**Solution:** 
- Ensure you're on a map (not in menus)
- Check the activation key setting
- Verify plugin is enabled

### Game Crashes Immediately

**Solution:** 
- Reduce initial spawn count
- Increase spawn interval
- Disable movement/animations
- Enable auto-stop safety

### Performance Data Not Showing

**Solution:**
- Open browser console (F12)
- Ensure "Monitor FPS" is enabled
- Check console isn't filtered

---

## 📚 Additional Resources

### Recommended Reading
- [RPG Maker MZ Performance Optimization](https://forums.rpgmakerweb.com/)
- [JavaScript Performance Profiling](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [Memory Management in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)

### Tools for Analysis
- **Chrome DevTools** - Performance profiling
- **Firefox Developer Tools** - Memory analysis
- **Windows Task Manager** - System monitoring
- **HWMonitor** - Hardware temperature monitoring

---

## 📝 License & Credits

### License

This project is licensed under the **Creative Commons Attribution 4.0 International License (CC BY 4.0)**.

**You are free to:**
- ✅ **Share** — copy and redistribute in any medium or format
- ✅ **Adapt** — remix, transform, and build upon the material  
- ✅ **Commercial Use** — use for commercial projects (testing purposes only)

**Under the following terms:**
- 📝 **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.

**Full License:** [Creative Commons BY 4.0](https://creativecommons.org/licenses/by/4.0/)

### Credits

- **Author**: Alexandros Panagiotakopoulos
- **GitHub**: [alexandrospanag](https://github.com/alexandrospanag)
- **Website**: [alexandrospanag.github.io](https://alexandrospanag.github.io)
- **Framework**: RPG Maker MZ Plugin System
- **Technologies**: JavaScript ES6+, RPG Maker MZ Core Scripts, Performance API
- **Purpose**: Performance profiling and hardware benchmarking for game development

### Attribution Example

When using this plugin in your testing documentation:

```
Nuclear Event Throttler by Alexandros Panagiotakopoulos
GitHub: https://github.com/alexandrospanag
License: CC BY 4.0
Used for performance testing and optimization analysis
```

---

## ⚖️ Disclaimer

**THIS SOFTWARE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND.**

The author is not responsible for:
- Game crashes or freezes
- Data loss
- System instability
- Time spent debugging
- Hardware stress
- Any other consequences of use

**By using this plugin, you acknowledge:**
- You understand it will crash your game
- You are an experienced developer
- You have proper backups
- You will not use it in production
- You accept all risks

---

## 📞 Support & Contact

### Reporting Issues
- **GitHub Issues**: [Report a Bug](https://github.com/alexandrospanag)
- **Email**: [Contact via GitHub Profile](https://github.com/alexandrospanag)

### Before Reporting:
1. ✅ Confirm you're using RPG Maker MZ
2. ✅ Check you followed installation steps
3. ✅ Verify configuration parameters
4. ✅ Include console output
5. ✅ Describe expected vs actual behavior

---

## 🏁 Final Reminders

<div align="center">

### ⚠️ THIS PLUGIN IS FOR TESTING ONLY ⚠️

**NEVER** use in production builds

**ALWAYS** disable before releasing

**BACKUP** before testing

**UNDERSTAND** the risks involved

**USE** responsibly and safely

---

**Made with 💣 for RPG Maker MZ Testing & Optimization**

*Remember: A crashed game in testing means a stable game in production!*

</div>

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Compatibility:** RPG Maker MZ 1.0.0+  
**Status:** Active Development (Testing Tools)
