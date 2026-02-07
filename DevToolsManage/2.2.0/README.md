# DevToolsManage.js - Changelog

## Version 2.2.0 (2026/02/07)

### Fixed
- **NW.js Compatibility Issue**: Fixed `require.main.filename` error that occurred when creating backups in certain NW.js contexts
  - Added multiple fallback paths for project path detection:
    - Primary: `require.main.filename` (original method)
    - Fallback 1: `nw.App.startPath` (NW.js native API)
    - Fallback 2: `process.cwd()` (Node.js fallback)
  - Added warning message when project path cannot be determined
  - Prevents crash when AutoBackup feature is enabled

### Added
- **/help Console Command System**: New interactive help system for developer console
  - Provides accessible command documentation
  - Helps developers understand available dev tools

### Changed
- **Code Optimizations**: Performance improvements across the plugin
  - Cleaner code structure
  - Better resource management

- **Cached DOM Queries**: Improved DOM query performance
  - Reduced repeated DOM lookups
  - Better caching mechanisms for frequently accessed elements

---

## Version History
- **2.2.0** - 2026/02/07 - NW.js fix, help system & optimizations
- **2.1.0** - 2025/11/19 - Code Modernization
- **2.0.1** - 2025/11/15 - Memory & Performance Update
- **1.3.0** - 2025/11/01 - Improvements
