# PerformanceCatcher.js - RPG Maker MZ Plugin

**Version:** 2.0.0  
**Compatibility:** RPG Maker MZ  
**Copyright:** Alexandros Panagiotakopoulos. All Rights Reserved Ⓒ  
**License:** Free to use with attribution required  

## 📋 Overview

PerformanceCatcher is a comprehensive performance monitoring and cache management plugin for RPG Maker MZ that helps identify performance bottlenecks and automatically manages memory to keep your game running smoothly.

### 🎯 Key Features

- **🔍 Real-time Performance Monitoring** - Track execution time of all plugin functions with frame rate monitoring
- **🧹 Automatic Cache Management** - Smart cleanup of images, audio, and other cached resources with size limits
- **💾 Advanced Memory Monitoring** - Track memory usage, detect leaks, and automatic garbage collection
- **📁 Save Data Optimization** - Automatic cleanup of temporary data to prevent corruption and reduce file sizes
- **⚡ Event Performance Tracking** - Monitor large events (50+ commands) and optimize performance bottlenecks
- **🖼️ Image Optimization** - Real-time tracking of large images (1MB+) with automatic cache management
- **⚠️ Intelligent Performance Warnings** - Get notified when functions exceed configurable thresholds
- **🛠️ Enhanced Developer Console** - Comprehensive reports with optimization metrics and manual controls
- **⚙️ Highly Configurable** - Extensive customization options for thresholds, cache sizes, and optimization behaviors
- **📊 Advanced Analytics** - Cache hit/miss ratios, frame rate statistics, and detailed performance insights

---

## 🚀 Installation

1. **Download** the `PerformanceCatcher.js` file
2. **Place** it in your `js/plugins/` folder
3. **Enable** the plugin in the Plugin Manager
4. **Configure** the parameters as needed (see Configuration section)

---

## ⚙️ Configuration Parameters

### Core Settings

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| **Enable Performance Monitoring** | Boolean | `true` | Monitor plugins for performance issues |
| **Enable Cache Cleanup** | Boolean | `true` | Automatically clean cache on map transfers |
| **Enable Console Reports** | Boolean | `true` | Show detailed reports in developer console |

### Performance Settings

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| **Performance Warning Threshold** | Number | `16` | Warn when functions take longer than X milliseconds |
| **Cache Cleanup Interval** | Number | `3` | Clean cache every X map transfers (0 = every transfer) |

### Memory Settings

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| **Enable Memory Monitoring** | Boolean | `true` | Monitor memory usage and detect leaks |
| **Memory Warning Threshold** | Number | `1000` | Warn when memory usage exceeds X megabytes |

---

## 🎮 How It Works

### Performance Monitoring

The plugin automatically wraps plugin functions to monitor their execution time:

```javascript
// Automatically monitors execution time of all plugin functions
Plugin.someFunction() // Takes 25ms -> Warning logged if > threshold
```

### Cache Management

Smart cache cleanup occurs during map transfers:

- **Image Cache**: Removes unused character sprites, tilesets, and pictures
- **Audio Cache**: Clears unused sound effects and music files
- **Tileset Cache**: Resets tileset rendering cache
- **Memory Cleanup**: Forces garbage collection when available

### Memory Monitoring

Continuous monitoring prevents memory leaks:

- **Real-time Tracking**: Monitors memory usage every 30 seconds
- **Warning System**: Alerts when memory exceeds configured threshold
- **Emergency Cleanup**: Automatic cleanup at 80% of memory limit
- **Leak Detection**: Identifies plugins causing memory buildup

---

## 🛠️ Developer Console Commands

Open Developer Tools (F12) and use these commands:

### Get Performance Report
```javascript
$performanceCatcher.getReport()
```
Returns detailed performance statistics for all plugins.

### Manual Cache Cleanup
```javascript
$performanceCatcher.clearCache()
```
Immediately cleans all caches regardless of interval settings.

### Reset Statistics
```javascript
$performanceCatcher.resetStats()
```
Clears all performance statistics and warning history.

### Check Memory Usage
```javascript
$performanceCatcher.getMemoryUsage()
```
Returns current memory usage information.

---

## 📊 Understanding the Reports

### Performance Report Structure

```javascript
{
  monitoring: {
    enabled: true,
    threshold: 16,
    uptime: 300000
  },
  plugins: [
    {
      name: "TimeSystem",
      totalCalls: 1500,
      totalTime: "245.50",
      averageTime: "0.16",
      maxTime: "25.30",
      warnings: 3,
      functions: [...]
    }
  ],
  memory: {
    used: "156.2 MB",
    total: "180.4 MB",
    limit: "2048.0 MB",
    percentage: "7.6%"
  },
  recentWarnings: [...],
  mapTransfers: 5,
  lastCleanup: "12/25/2025, 3:45:30 PM"
}
```

### Warning Types

- **Performance Warnings**: Functions taking longer than threshold
- **Memory Warnings**: Memory usage exceeding configured limit
- **Cache Warnings**: Issues during cache cleanup operations

---

## 🎯 Best Practices

### For Game Developers

1. **Monitor During Development**: Keep console reports enabled during testing
2. **Adjust Thresholds**: Fine-tune warning thresholds for your project
3. **Regular Reports**: Check `$performanceCatcher.getReport()` periodically
4. **Memory Management**: Enable memory monitoring for long gameplay sessions

### For Plugin Developers

1. **Function Naming**: Use clear, descriptive function names for better reports
2. **Performance Awareness**: Monitor your plugin's impact on game performance
3. **Cache Consideration**: Design plugins with cache cleanup in mind
4. **Memory Efficiency**: Avoid memory leaks in plugin code

### Recommended Settings

| Game Type | Performance Threshold | Memory Threshold | Cache Interval |
|-----------|----------------------|------------------|----------------|
| **Simple RPG** | 16ms | 500MB | Every 3 maps |
| **Complex RPG** | 25ms | 1000MB | Every 2 maps |
| **Action Game** | 8ms | 1000MB | Every map |
| **Story-Heavy** | 20ms | 800MB | Every 5 maps |

---

## 🔧 Troubleshooting

### Common Issues

**Q: Plugin reports show no data**  
A: Ensure Performance Monitoring is enabled and other plugins are loaded correctly.

**Q: Cache cleanup causes frame drops**  
A: Increase the Cache Cleanup Interval or disable cleanup during critical scenes.

**Q: Memory warnings appear constantly**  
A: Lower the Memory Warning Threshold or investigate plugins causing memory leaks.

**Q: Console commands don't work**  
A: Make sure the plugin is properly loaded and `$performanceCatcher` is available.

### Performance Impact

The plugin itself is designed to have minimal performance impact:

- **Monitoring Overhead**: ~0.1-0.5ms per monitored function call
- **Memory Usage**: ~2-5MB for statistics storage
- **Cache Cleanup**: ~10-50ms depending on cache size

---

## 📈 Advanced Usage

### Custom Performance Monitoring

```javascript
// Monitor custom functions
const startTime = performance.now();
myCustomFunction();
const executionTime = performance.now() - startTime;
console.log(`Custom function took ${executionTime}ms`);
```

### Conditional Cache Cleanup

```javascript
// Trigger cleanup based on custom conditions
if (myCondition) {
    $performanceCatcher.clearCache();
}
```

### Performance Profiling Session

```javascript
// Start fresh profiling session
$performanceCatcher.resetStats();

// Play your game for a while...

// Get comprehensive report
const report = $performanceCatcher.getReport();
console.table(report.plugins);
```

---

## 🤝 Support & Contributing

### Getting Help

- **Issues**: Report bugs or performance problems
- **Questions**: Ask about configuration or usage
- **Suggestions**: Propose new features or improvements

### Contributing

- **Bug Reports**: Include detailed reproduction steps
- **Feature Requests**: Describe the use case and expected behavior  
- **Code Contributions**: Follow existing code style and include tests

---

## 📄 License & Terms

### Copyright Notice

**Copyright © Alexandros Panagiotakopoulos. All Rights Reserved.**

### Usage Rights

- ✅ **Free for commercial use** (with attribution)
- ✅ **Free for non-commercial use** (with attribution)  
- ✅ **Modify as needed for your project**
- ✅ **Redistribute with proper attribution**

### Attribution Requirements

**Attribution is REQUIRED.** Please include the following credit:

**In your game credits:**
```
PerformanceCatcher.js Plugin
Copyright © Alexandros Panagiotakopoulos
```

**In documentation or readme files:**
```
Performance monitoring powered by PerformanceCatcher.js
Created by Alexandros Panagiotakopoulos
```

**Minimum attribution:**
```
Plugin by Alexandros Panagiotakopoulos
```

### Disclaimer

This plugin is provided "as is" without warranty. Use at your own risk and always backup your project before installing new plugins.

**Copyright © Alexandros Panagiotakopoulos. All Rights Reserved.**

---

## 🔄 Version History

### v2.0.0 (Current) - Major Enhancement Update
**🚀 Advanced Optimization System**
- **✨ NEW: Save Data Optimization** - Automatic cleanup of temporary variables and cached data to prevent save file corruption and reduce file sizes
- **🗑️ NEW: Auto Garbage Collection** - Intelligent memory monitoring with configurable thresholds and automatic cache clearing
- **⚡ NEW: Event Optimization** - Large event detection (50+ commands) with performance warnings and execution tracking
- **🖼️ NEW: Image Optimization** - Real-time image size tracking, large image detection (1MB+), and automatic cache management
- **📊 NEW: Advanced Performance Monitoring** - Real-time frame rate monitoring with 60-sample rolling averages
- **💾 NEW: Enhanced Cache Management** - Smart cache hit/miss tracking, size monitoring, and automatic cleanup when limits exceeded
- **🎛️ NEW: Configuration Parameters**:
  - `enableSaveDataOptimization` - Automatic save data cleanup
  - `enableAutoGarbageCollection` - Smart memory management  
  - `enableImageOptimization` - Image cache optimization
  - `maxCacheSize` - Maximum cache size in MB (default: 100MB)
  - `enableEventOptimization` - Event performance tracking
- **💻 NEW: Enhanced Console Commands**:
  - `$performanceCatcher.getOptimizationReport()` - Detailed optimization statistics
  - `$performanceCatcher.optimizeSaveData()` - Manual save data cleanup
  - `$performanceCatcher.performGarbageCollection()` - Force memory cleanup  
  - `$performanceCatcher.clearImageCache()` - Clear image cache manually
- **📈 Enhanced Reporting** - Comprehensive performance reports with optimization metrics, cache usage, frame rate data, and hit/miss ratios
- **🔧 Performance Improvements** - PIXI texture cache management, automatic memory leak prevention, and intelligent threshold-based cleanup
- **🛡️ Stability Enhancements** - Proactive memory management, save data corruption prevention, and performance degradation protection

### v1.0.0
- Initial release
- Real-time performance monitoring
- Automatic cache management  
- Memory monitoring and leak detection
- Developer console integration
- Comprehensive configuration options

---

## 📞 Contact

For support, questions, or feedback about this plugin, please refer to the documentation above or check for updates in the original distribution source.

**Happy game developing! 🎮**

