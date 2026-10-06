# DevTools Python Compiler for RPG Maker MZ

![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)
![RPG Maker MZ](https://img.shields.io/badge/RPG%20Maker-MZ-red.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

A lightweight Python-like syntax transpiler for the RPG Maker MZ DevConsole. Write quick Python-style one-liners in the browser console (F8) and have them converted to JavaScript and executed on the spot, with handy shortcuts for the game's core objects (`player`, `party`, `map`, `switches`, and more). Perfect for debugging, testing, and rapid prototyping during development.

## 📄 License

This project is licensed under the **MIT License**.

You are free to:
* ✅ **Use** — use the software for any purpose
* ✅ **Modify** — change, remix, and build upon the code
* ✅ **Distribute** — share copies in any medium or format
* ✅ **Commercial Use** — use it in commercial projects

Under the following terms:
* 📝 **License Notice** — Include the original copyright and license notice in copies or substantial portions of the software.

[View Full License](http://opensource.org/licenses/mit-license.php)

## 👏 Credits

* **Author**: Alexandros Panagiotakopoulos
* **Framework**: RPG Maker MZ Plugin System
* **Technologies**: JavaScript ES6+, Regex-based Python-to-JS Transpilation
* **Base Plugin**: DevToolsManage (DevConsole)

## 👤 Author

**Alexandros Panagiotakopoulos**
GitHub: [github.com/AlexandrosPanag](https://github.com/AlexandrosPanag)

## ✨ Features

- 🐍 **Python-like Syntax** - Write `print()`, `for ... in range()`, `if/elif/else`, `def`, `lambda`, f-strings, and more.
- 🔄 **Live Transpilation** - Your Python code is converted to JavaScript and executed instantly, with both versions logged to the console for easy debugging.
- ⚡ **RPG Maker Shortcuts** - Use `player`, `party`, `map`, `switches`, `variables`, `actors`, `items`, and others instead of typing `$gamePlayer`, `$gameParty`, `$gameMap`, etc.
- 🧰 **Multiple Entry Points** - Run code via `py_cmd()`, `py` tagged templates, `$py()`, `pyrun()`, or `pyexec()`.
- 💬 **DevConsole Integration** - Automatically registers `/py`, `/python`, and `/pyhelp` commands when DevConsole is detected.
- 🔍 **Transpile-Only Mode** - Use `pytranspile()` to preview the generated JavaScript without running it.
- 🆘 **Built-in Help** - Call `pyhelp()` at any time for a quick syntax cheat sheet.

## 📦 Installation

1. Download `DevToolsPythonCompiler.js`.
2. Place it in your project's `js/plugins/` folder.
3. Open the RPG Maker MZ Plugin Manager.
4. Add "DevToolsPythonCompiler" to your plugin list and enable it.
5. Make sure it is placed **below** `DevToolsManage` (the plugin is declared with `@base DevToolsManage` and `@orderAfter DevToolsManage`).
6. (Optional) Toggle **Enable Python Mode** in the Plugin Parameters.
7. **Important**: Save your project.

> 💡 This is a development tool. Disable or remove it before deploying your game.

## 🎮 Usage

### Running Python Code

Playtest your game, open the console with **F8**, and use any of the following:

```js
// 1. py_cmd() function
py_cmd("print('Hello World')")
py_cmd("for i in range(5): print(i)")

// 2. py`` tagged template
py`player.x = 10`
py`gold = 5000`

// 3. $py() function
$py('print(player.x, player.y)')

// 4. pyrun() function (multi-line template strings)
pyrun(`
for item in items:
    print(item.name)
`)

// 5. pyexec() function
pyexec("print('test')")
```

### DevConsole Commands

If DevConsole is detected, the following commands are registered:

| Command | Description |
|---------|-------------|
| `/py <code>` | Execute Python-like code |
| `/python <code>` | Alias for `/py` |
| `/pyhelp` | Show Python syntax help |

### Utility Functions

| Function | Description |
|----------|-------------|
| `pyhelp()` | Prints a syntax cheat sheet to the console |
| `pytranspile("code")` | Logs and returns the generated JavaScript without executing it |
| `PythonTranspiler` | The transpiler object, exposed globally for advanced usage |

### Quick Examples

```python
# Heal all party members
py_cmd("for actor in party.members(): actor.recoverAll()")

# Give gold
py_cmd("party.gainGold(10000)")

# Teleport player
py_cmd("player.setPosition(10, 15)")

# Print player position
py_cmd("print(f'Position: ({player.x}, {player.y})')")

# Loop through items
py_cmd("for i in range(1, 10): print(items[i].name if items[i] else 'Empty')")

# Check switches
py_cmd("for i in range(1, 20): print(f'Switch {i}: {switches.value(i)}')")
```

## 🔧 Technical Details

### Supported Syntax

| Category | Python | JavaScript |
|----------|--------|------------|
| **Print** | `print(x, y)` | `console.log(x, y)` |
| **f-strings** | `f"Value: {x}"` | `` `Value: ${x}` `` |
| **Variables** | `x = 10` | `let x = 10` |
| **For (range)** | `for i in range(10):` | `for (let i = 0; i < 10; i++) {` |
| **For (range, start/end)** | `for i in range(2, 10):` | `for (let i = 2; i < 10; i++) {` |
| **For (range, step)** | `for i in range(0, 10, 2):` | `for (let i = 0; i < 10; i += 2) {` |
| **For (iterable)** | `for item in list:` | `for (const item of list) {` |
| **While** | `while x > 0:` | `while (x > 0) {` |
| **Conditionals** | `if` / `elif` / `else` | `if` / `else if` / `else` |
| **Ternary** | `a if cond else b` | `cond ? a : b` |
| **Functions** | `def foo(x, y):` | `function foo(x, y) {` |
| **Lambda** | `lambda x: x * 2` | `(x) => x * 2` |
| **Constants** | `True`, `False`, `None` | `true`, `false`, `null` |
| **Logic** | `and`, `or`, `not` | `&&`, `\|\|`, `!` |
| **Identity** | `is`, `is not`, `is None` | `===`, `!==`, `=== null` |
| **Membership** | `x in list` / `x not in list` | `list.includes(x)` / `!list.includes(x)` |
| **Length** | `len(list)` | `list.length` |

### Built-in Function Mappings

| Type | Python | JavaScript |
|------|--------|------------|
| **Conversion** | `int()`, `float()`, `str()`, `bool()`, `list()` | `parseInt()`, `parseFloat()`, `String()`, `Boolean()`, `Array.from()` |
| **Math** | `abs()`, `min()`, `max()`, `pow()`, `round()`, `sqrt()` | `Math.abs()`, `Math.min()`, `Math.max()`, `Math.pow()`, `Math.round()`, `Math.sqrt()` |
| **Operators** | `x ** y`, `x // y` | `Math.pow(x, y)`, `Math.floor(x / y)` |
| **Other** | `type()`, `isinstance(a, B)`, `input()` | `typeof()`, `a instanceof B`, `prompt()` |

### Method Mappings

| Type | Python | JavaScript |
|------|--------|------------|
| **String** | `.upper()`, `.lower()`, `.strip()`, `.lstrip()`, `.rstrip()` | `.toUpperCase()`, `.toLowerCase()`, `.trim()`, `.trimStart()`, `.trimEnd()` |
| **String** | `.startswith()`, `.endswith()`, `.find()` | `.startsWith()`, `.endsWith()`, `.indexOf()` |
| **List** | `.append()`, `.extend()`, `.insert()`, `.index()` | `.push()`, `.push(...)`, `.splice()`, `.indexOf()` |
| **Dict** | `.keys()`, `.values()`, `.items()`, `.get(k, d)` | `Object.keys()`, `Object.values()`, `Object.entries()`, `(obj[k] ?? d)` |

### RPG Maker Shortcuts

| Shortcut | Resolves To | Shortcut | Resolves To |
|----------|-------------|----------|-------------|
| `player` | `$gamePlayer` | `weapons` | `$dataWeapons` |
| `party` | `$gameParty` | `armors` | `$dataArmors` |
| `map` | `$gameMap` | `enemies` | `$dataEnemies` |
| `switches` | `$gameSwitches` | `troop` | `$gameTroop` |
| `variables` | `$gameVariables` | `screen` | `$gameScreen` |
| `actors` | `$gameActors` | `message` | `$gameMessage` |
| `items` | `$dataItems` | `system` | `$gameSystem` |
| `temp` | `$gameTemp` | `timer` | `$gameTimer` |

The `gold` shortcut from the in-plugin help is also documented as `$gameParty.gold()`.

### Debug Output

Every execution logs the original Python, the generated JavaScript, and the result (if any) to the console:

- `[Python]` — the code you entered
- `[JS]` — the transpiled JavaScript
- `[Result]` — the returned value (only shown when not `undefined`)
- `[Error]` — the error message, plus the generated JS for inspection

## ⚙️ Plugin Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| **Enable Python Mode** | Boolean | `true` | Enables Python-like syntax in DevConsole. When `false`, the plugin does nothing. |

## 🐛 Troubleshooting

### Nothing happens / `py_cmd is not defined`?
- Confirm the plugin is enabled in the Plugin Manager and that **Enable Python Mode** is `true`.
- Make sure it is listed below `DevToolsManage`.
- Open the console with **F8** during playtest; you should see "🐍 Python Compiler Ready!" on startup.

### `/py` command not found?
- The `/py`, `/python`, and `/pyhelp` commands are only registered if DevConsole is detected. Use `py_cmd()` or `py``` ` directly if it isn't.

### Code runs but behaves strangely?
- Use `pytranspile("your code")` to inspect the generated JavaScript and see exactly what was produced.

### Known Limitations
This is a **regex-based transpiler for a subset of Python**, not a full Python interpreter. Keep these in mind:

- **Indentation blocks are limited.** Blocks are opened with `{` but closed automatically at the end of the code, so single-line blocks (`for i in range(5): print(i)`) work best. Complex multi-line, nested blocks may not transpile correctly.
- **`range()` arguments must be numeric literals** (e.g. `range(10)`, not `range(len(x))` or `range(n)`).
- **Shortcut names are replaced everywhere.** Words like `map`, `items`, `message`, `system`, `temp`, and `timer` are converted even when used as ordinary identifiers or method names (e.g. `array.map(...)`). Avoid using these names for your own variables.
- **Some methods are simplified.** `.remove()` is only partially supported, and `.count()` is not supported (use `.filter(...).length` instead).
- **Variables are declared with `let`** per line, so reusing the same name across separate calls is fine, but redeclaration inside one script is not tracked across nested scopes.

## 📝 Changelog

- **1.0.1** (09/01/2026) — Quick hotfix: added the `pyhelp()` command.
- **1.0.0** (09/01/2026) — Initial release: Python-like syntax transpiler for DevConsole.

---

**Made with ❤️ for the RPG Maker community**
