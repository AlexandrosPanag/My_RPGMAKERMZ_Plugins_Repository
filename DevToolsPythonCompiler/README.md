# DevTools Python Compiler Documentation


![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)
![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-red.svg)
![License](https://img.shields.io/badge/license-CC%20BY%204.0-green.svg)


## Overview

**DevToolsPythonCompiler.js** is a JavaScript plugin for RPG Maker MZ that adds Python-like syntax support to the developer console. It transpiles a subset of Python syntax to JavaScript in real-time, making scripting and debugging more intuitive for developers familiar with Python.


---

## Installation

1. **Prerequisites:** Requires the `DevToolsManage` plugin to be installed first
2. **Installation Order:** Place after `DevToolsManage` in your plugin list
3. **Enable:** Set the `EnablePythonMode` parameter to `true` (default)

---

# DevTools Python Compiler - Quick Start Guide

## 🐍 What is this?

This plugin lets you write Python-like code in the browser console to control your RPG Maker MZ game. No more complex JavaScript syntax!

## 🚀 How to Use

Open the browser console (`F8` or `F12`) and start using Python syntax!

### Basic Commands

🚀 Use "pyhelp()" (without the " " command 🚀

```javascript
// Simple print
py_cmd("print('Hello World')")

// Using template literals
py`print('Quick test')`

// Alternative methods
$py("print('Alternative')")
pyexec("print('Another way')")
```

### 🎮 RPG Maker Shortcuts

Instead of writing `$gameParty`, just write `party`:

```javascript
// Give gold
py_cmd("party.gainGold(10000)")

// Teleport player
py_cmd("player.setPosition(10, 15)")

// Heal all party members
py_cmd("for actor in party.members(): actor.recoverAll()")
```

**Available shortcuts:**
- `player` → `$gamePlayer`
- `party` → `$gameParty`
- `map` → `$gameMap`
- `switches` → `$gameSwitches`
- `variables` → `$gameVariables`
- `actors` → `$gameActors`
- `items` → `$dataItems`
- `weapons` → `$dataWeapons`
- `armors` → `$dataArmors`

### 📝 Python Syntax Features

#### Print Statements
```javascript
py_cmd("print('Hello')")
py_cmd("print('HP:', player.hp)")

// F-strings (formatted strings)
py_cmd("print(f'Position: ({player.x}, {player.y})')")
```

#### Variables
```javascript
py_cmd("x = 100")
py_cmd("player_hp = party.leader().hp")
```

#### Loops
```javascript
// Range loop
py_cmd("for i in range(5): print(i)")

// Loop through arrays
py_cmd("for actor in party.members(): print(actor.name())")

// With start and end
py_cmd("for i in range(1, 10): print(f'Item {i}')")
```

#### Conditionals
```javascript
py_cmd("if party.gold() > 1000: print('Rich!')")

// Ternary operator
py_cmd("status = 'alive' if player.hp > 0 else 'dead'")
```

#### Boolean Logic
```javascript
py_cmd("if player.hp > 50 and party.gold() > 100: print('Good condition')")
py_cmd("if x == 10 or y == 20: print('Match found')")
py_cmd("if not player.isMoving(): print('Stopped')")
```

### 🔧 Useful Examples

#### Check Switches
```javascript
py_cmd("for i in range(1, 20): print(f'Switch {i}: {switches.value(i)}')")
```

#### List All Items
```javascript
py_cmd("for i in range(1, 10): print(items[i].name if items[i] else 'Empty')")
```

#### Give Items to Party
```javascript
py_cmd("party.gainItem(items[1], 5)")
```

#### Check Party Status
```javascript
py_cmd("for actor in party.members(): print(f'{actor.name()}: HP {actor.hp}/{actor.mhp}')")
```

#### Modify Variables
```javascript
py_cmd("variables.setValue(1, 100)")
py_cmd("print(f'Variable 1 = {variables.value(1)}')")
```

#### Array Operations
```javascript
py_cmd("arr = [1, 2, 3, 4, 5]")
py_cmd("print(len(arr))")
py_cmd("arr.append(6)")
py_cmd("print(arr)")
```

### 📚 Multi-line Code

For longer scripts, use `pyrun()`:

```javascript
pyrun(`
gold = party.gold()
if gold < 1000:
    print('Need more gold!')
    party.gainGold(5000)
else:
    print(f'You have {gold} gold')
`)
```

### 🔍 Debugging

See the transpiled JavaScript code without executing:

```javascript
pytranspile("print('Hello')")
// Output: console.log('Hello')
```

### 📖 Get Help

```javascript
// View help in console
pyhelp()
```

## 💡 Tips

1. **Use f-strings** for formatted output: `f'HP: {player.hp}'`
2. **Chain methods** work: `party.leader().name()`
3. **Python booleans** work: `True`, `False`, `None`
4. **Math operators** work: `x ** 2` (power), `x // 2` (floor division)
5. **List comprehensions** aren't supported - use loops instead

## ⚠️ Limitations

- List comprehensions not supported
- Dictionary comprehensions not supported
- Classes and decorators not supported
- Import statements not supported
- Some complex Python features won't work

## 🎯 Common Tasks

### Reset Player Position
```javascript
py_cmd("player.setPosition(0, 0)")
```

### Give All Items
```javascript
py_cmd("for i in range(1, 100): party.gainItem(items[i], 1) if items[i] else None")
```

### Max Out Party Stats
```javascript
py_cmd("for actor in party.members(): actor.recoverAll()")
```

### Clear All Switches
```javascript
py_cmd("for i in range(1, 100): switches.setValue(i, False)")
```

### Test Battle
```javascript
py_cmd("$gameTroop.setup(1)")  // Setup troop ID 1
```

---

**Enjoy coding with Python syntax in RPG Maker MZ! 🐍🎮**


---

## Limitations

### Syntax Limitations
- **Indentation-based blocks:** The transpiler converts colon-based syntax to braces, but complex nested indentation may not work perfectly
- **Multi-line blocks:** Best used with `pyrun()` function
- **List comprehensions:** Not supported (use traditional loops)
- **Decorators:** Not supported
- **Classes:** Not supported (use JavaScript classes or factory functions)
- **Imports:** Not supported (use native JavaScript imports)

### Known Edge Cases
- Complex nested function calls may require parentheses
- Method chaining requires careful formatting
- Some Python built-ins have no direct JavaScript equivalent

---

## Troubleshooting

### Code Not Executing
1. Check that `EnablePythonMode` parameter is `true`
2. Verify `DevToolsManage` is installed and active
3. Open browser console (F8) to see errors

### Syntax Errors
1. Use `pytranspile()` to see generated JavaScript
2. Check console for error messages
3. Simplify complex expressions
4. Add explicit parentheses for operator precedence

### Unexpected Results
1. Remember Python shortcuts are case-sensitive
2. Check that RPG Maker objects are initialized (game must be running)
3. Use `console.log()` liberally to debug

---

## Tips & Best Practices

1. **Start Simple:** Test syntax with simple print statements first
2. **Use F-Strings:** They're more readable than concatenation
3. **One-Liners:** The `/py` command works best with single logical operations
4. **Multi-Line:** Use `pyrun()` for complex logic
5. **Debug:** Use `pytranspile()` to understand how code is converted
6. **Property Access:** Remember dots work the same in Python and JavaScript
7. **Type Safety:** Python's dynamic typing translates directly to JavaScript

---

## Performance Considerations

- Transpilation happens in real-time (minimal overhead for dev console use)
- Generated JavaScript is executed via `Function` constructor
- No persistent state between executions (each call is independent)
- Suitable for debugging and testing, not production game logic

---

## 📄 License

This project is licensed under the **Creative Commons Attribution 4.0 International License**.

You are free to:
* ✅ **Share** — copy and redistribute in any medium or format
* ✅ **Adapt** — remix, transform, and build upon the material
* ✅ **Commercial Use** — use for commercial projects

Under the following terms:
* 📝 **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.

[View Full License](https://creativecommons.org/licenses/by/4.0/)

---

## 👏 Credits

* **Author**: Alexandros Panagiotakopoulos
* **Framework**: RPG Maker MZ Plugin System
* **Technologies**: JavaScript ES6+, CSS3 Animations, HTML5 APIs
* **Inspiration**: Modern browser power management and mobile battery optimization

---

## Version History

### v1.0.0 (2025/12/02)
- Initial release
- Python-like syntax transpiler for DevConsole
- Support for basic Python constructs (loops, conditionals, functions)
- RPG Maker MZ object shortcuts
- F-string support
- Multiple execution methods (`/py`, `py```, `$py()`, `pyrun()`)
- Debug transpilation output
- Console help system
