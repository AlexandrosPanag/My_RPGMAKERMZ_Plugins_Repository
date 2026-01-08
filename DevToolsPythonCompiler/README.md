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

## Quick Start

Open the browser console (F8 in RPG Maker MZ) and try these commands:

```python
# Print a message
/py print("Hello World")

# Use f-strings
/py print(f"Player position: ({player.x}, {player.y})")

# Give gold to party
/py party.gainGold(5000)

# Heal all party members
/py for actor in party.members(): actor.recoverAll()
```

---

## Usage Methods

The plugin provides four ways to execute Python-like code:

### 1. `/py` Command (Console)
Execute single-line Python commands directly in the console:
```python
/py print("Hello")
/py for i in range(5): print(i)
```

### 2. Tagged Template Literal
Use backticks with the `py` tag:
```javascript
py`player.x = 10`
py`print(player.x, player.y)`
```

### 3. `$py()` Function
Pass Python code as a string:
```javascript
$py('print("Hello")')
$py('x = 10; print(x * 2)')
```

### 4. `pyrun()` Function
Best for multi-line code blocks:
```javascript
pyrun(`
for i in range(10):
    if i % 2 == 0:
        print(i)
`)
```

---

## Supported Python Syntax

### Print Statements
```python
print("hello")              # → console.log("hello")
print(x, y, z)              # → console.log(x, y, z)
print(f"Value: {x}")        # → console.log(`Value: ${x}`)
```

### Variables
```python
x = 10                      # → let x = 10
player.hp = 100             # → player.hp = 100 (property assignment)
```

### For Loops
```python
for i in range(10):         # → for (let i = 0; i < 10; i++)
for i in range(2, 10):      # → for (let i = 2; i < 10; i++)
for i in range(0, 10, 2):   # → for (let i = 0; i < 10; i += 2)
for item in items:          # → for (const item of items)
```

### While Loops
```python
while x > 0:                # → while (x > 0) {
    x = x - 1               #       x = x - 1
                            #    }
```

### Conditionals
```python
if x > 5:                   # → if (x > 5) {
    print("big")            # → console.log("big")
elif x > 2:                 # → } else if (x > 2) {
    print("medium")         # → console.log("medium")
else:                       # → } else {
    print("small")          # → console.log("small")
                            # → }

# Ternary operator
result = "yes" if x > 5 else "no"  # → result = x > 5 ? "yes" : "no"
```

### Functions
```python
def greet(name):            # → function greet(name) {
    print(f"Hello {name}")  #       console.log(`Hello ${name}`)
                            #    }

# Lambda functions
double = lambda x: x * 2    # → double = (x) => x * 2
```

### Boolean Values & Operators
```python
True, False, None           # → true, false, null
x and y                     # → x && y
x or y                      # → x || y
not x                       # → !x
x is None                   # → x === null
x is not None               # → x !== null
```

### List Operations
```python
len(items)                  # → items.length
items.append(x)             # → items.push(x)
items.pop()                 # → items.pop()
x in items                  # → items.includes(x)
x not in items              # → !items.includes(x)
items.reverse()             # → items.reverse()
items.sort()                # → items.sort()
items.index(x)              # → items.indexOf(x)
```

### String Operations
```python
text.upper()                # → text.toUpperCase()
text.lower()                # → text.toLowerCase()
text.strip()                # → text.trim()
text.split(",")             # → text.split(",")
text.startswith("pre")      # → text.startsWith("pre")
text.endswith("suf")        # → text.endsWith("suf")
text.replace("a", "b")      # → text.replace("a", "b")
```

### Dictionary Operations
```python
dict.keys()                 # → Object.keys(dict)
dict.values()               # → Object.values(dict)
dict.items()                # → Object.entries(dict)
dict.get(key, default)      # → (dict[key] ?? default)
```

### Math Operations
```python
abs(x)                      # → Math.abs(x)
min(a, b)                   # → Math.min(a, b)
max(a, b)                   # → Math.max(a, b)
pow(x, y)                   # → Math.pow(x, y)
round(x)                    # → Math.round(x)
sqrt(x)                     # → Math.sqrt(x)

# Operators
x ** y                      # → Math.pow(x, y) (power)
x // y                      # → Math.floor(x / y) (floor division)
```

### Type Conversions
```python
int(x)                      # → parseInt(x)
float(x)                    # → parseFloat(x)
str(x)                      # → String(x)
bool(x)                     # → Boolean(x)
list(x)                     # → Array.from(x)
type(x)                     # → typeof(x)
```

---

## RPG Maker Shortcuts

The plugin provides convenient shortcuts for common RPG Maker MZ objects:

| Python Keyword | JavaScript Equivalent | Description |
|----------------|----------------------|-------------|
| `player` | `$gamePlayer` | The player character |
| `party` | `$gameParty` | The party |
| `map` | `$gameMap` | The current map |
| `switches` | `$gameSwitches` | Game switches |
| `variables` | `$gameVariables` | Game variables |
| `actors` | `$gameActors` | Actor data |
| `items` | `$dataItems` | Item database |
| `weapons` | `$dataWeapons` | Weapon database |
| `armors` | `$dataArmors` | Armor database |
| `enemies` | `$dataEnemies` | Enemy database |
| `troop` | `$gameTroop` | Enemy troop |
| `screen` | `$gameScreen` | Screen effects |
| `message` | `$gameMessage` | Message window |
| `system` | `$gameSystem` | Game system |
| `temp` | `$gameTemp` | Temporary data |
| `timer` | `$gameTimer` | Game timer |

---

## Practical Examples

### Player Manipulation
```python
# Teleport player
/py player.setPosition(10, 15)

# Get player coordinates
/py print(f"Position: ({player.x}, {player.y})")

# Move player
/py player.moveStraight(2)  # 2 = down
```

### Party Management
```python
# Heal all party members
/py for actor in party.members(): actor.recoverAll()

# Give gold
/py party.gainGold(10000)

# Add item
/py party.gainItem(items[1], 5)

# Check party leader HP
/py print(f"Leader HP: {party.leader().hp}")
```

### Switches & Variables
```python
# Set a switch
/py switches.setValue(1, True)

# Check multiple switches
/py for i in range(1, 10): print(f"Switch {i}: {switches.value(i)}")

# Set variable
/py variables.setValue(5, 100)

# Get variable with f-string
/py print(f"Variable 5: {variables.value(5)}")
```

### Item Inspection
```python
# List all non-null items
/py for i in range(1, 20): print(items[i].name if items[i] else "Empty")

# Find items by name
/py for i in range(1, len(items)): 
    if items[i] and "Potion" in items[i].name: 
        print(f"ID {i}: {items[i].name}")
```

### Battle Commands
```python
# Enemy HP check
/py for enemy in troop.members(): print(f"{enemy.name()}: {enemy.hp}")

# Kill all enemies (for testing)
/py for enemy in troop.members(): enemy.die()
```

### Map Inspection
```python
# Display map info
/py print(f"Map ID: {map.mapId()}, Display Name: {map.displayName()}")

# Check map events
/py print(f"Events on map: {len(map.events())}")

# Event loop
/py for event in map.events(): 
    if event: 
        print(f"Event {event.eventId()}: ({event.x}, {event.y})")
```

### Conditional Logic
```python
# Check gold and give items
/py if party.gold() > 1000:
    party.gainItem(items[10], 1)
    print("Gave rare item!")
else:
    print("Not enough gold")
```

---

## Advanced Features

### Debug Transpilation
View the generated JavaScript without executing:
```javascript
pytranspile("for i in range(5): print(i)")
// Output: Generated JS code
```

### Console Help
View quick reference in console:
```
/pyhelp
```

### Command Aliases
The plugin registers aliases:
```
/python <code>  # Same as /py
```

---

## Debug Output

The plugin provides colored console output for debugging:

- **[Python]** (Blue) - Original Python code
- **[JS]** (Yellow) - Transpiled JavaScript
- **[Result]** (Green) - Execution result
- **[Error]** (Red) - Error messages

Example:
```python
/py print(2 + 2)
```

Console output:
```
[Python] print(2 + 2)
[JS] console.log(2 + 2)
4
[Result] undefined
```

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
