//=============================================================================
// DevToolsPythonCompiler.js
// ----------------------------------------------------------------------------
// Author: Alexandros Panagiotakopoulos (2025)
// This software is released under the MIT License.
// http://opensource.org/licenses/mit-license.php
// ----------------------------------------------------------------------------
// Version
// 1.0.0 09/01/2026 Initial release - Python-like syntax transpiler for DevConsole
// ----------------------------------------------------------------------------
// [GitHub] : https://github.com/AlexandrosPanag
//=============================================================================

/*:
 * @plugindesc Python-like Syntax Compiler for DevConsole
 * @author Alexandros Panagiotakopoulos
 * @target MZ
 * @base DevToolsManage
 * @orderAfter DevToolsManage
 *
 * @param EnablePythonMode
 * @text Enable Python Mode
 * @desc Enable Python-like syntax in DevConsole (use /py or py`code`)
 * @default true
 * @type boolean
 *
 * @help
 * ============================================================================
 * DevTools Python Compiler
 * ============================================================================
 * 
 * This plugin adds Python-like syntax support to the DevConsole.
 * It transpiles a subset of Python syntax to JavaScript.
 * 
 * ============================================================================
 * USAGE
 * ============================================================================
 * 
 * In the browser console (F8), you can use:
 * 
 * 1. The /py command:
 *    /py print("Hello World")
 *    /py for i in range(5): print(i)
 * 
 * 2. The py`` tagged template:
 *    py`player.x = 10`
 *    py`gold = 5000`
 * 
 * 3. The $py() function:
 *    $py('print(player.x, player.y)')
 * 
 * 4. Multi-line with pyrun():
 *    pyrun(`
 *    for item in items:
 *        print(item.name)
 *    `)
 * 
 * ============================================================================
 * SUPPORTED PYTHON SYNTAX
 * ============================================================================
 * 
 * PRINT STATEMENT:
 *   print("hello")           -> console.log("hello")
 *   print(x, y, z)           -> console.log(x, y, z)
 *   print(f"Value: {x}")     -> console.log(`Value: ${x}`)
 * 
 * VARIABLES:
 *   x = 10                   -> let x = 10
 *   player.hp = 100          -> player.hp = 100
 * 
 * FOR LOOPS:
 *   for i in range(10):      -> for (let i = 0; i < 10; i++) {
 *   for i in range(2, 10):   -> for (let i = 2; i < 10; i++) {
 *   for i in range(0,10,2):  -> for (let i = 0; i < 10; i += 2) {
 *   for item in list:        -> for (const item of list) {
 * 
 * WHILE LOOPS:
 *   while x > 0:             -> while (x > 0) {
 * 
 * IF/ELIF/ELSE:
 *   if x > 5:                -> if (x > 5) {
 *   elif x > 2:              -> } else if (x > 2) {
 *   else:                    -> } else {
 * 
 * FUNCTIONS:
 *   def foo(x, y):           -> function foo(x, y) {
 *   lambda x: x * 2          -> (x) => x * 2
 * 
 * BOOLEAN/NONE:
 *   True, False, None        -> true, false, null
 *   and, or, not             -> &&, ||, !
 * 
 * LIST OPERATIONS:
 *   len(list)                -> list.length
 *   list.append(x)           -> list.push(x)
 *   x in list                -> list.includes(x)
 *   x not in list            -> !list.includes(x)
 * 
 * STRING OPERATIONS:
 *   str.upper()              -> str.toUpperCase()
 *   str.lower()              -> str.toLowerCase()
 *   str.split(",")           -> str.split(",")
 *   str.strip()              -> str.trim()
 *   str.startswith("x")      -> str.startsWith("x")
 *   str.endswith("x")        -> str.endsWith("x")
 * 
 * DICT OPERATIONS:
 *   dict.keys()              -> Object.keys(dict)
 *   dict.values()            -> Object.values(dict)
 *   dict.items()             -> Object.entries(dict)
 * 
 * MATH:
 *   abs(x)                   -> Math.abs(x)
 *   min(a, b)                -> Math.min(a, b)
 *   max(a, b)                -> Math.max(a, b)
 *   pow(x, y)                -> Math.pow(x, y)
 *   x ** y                   -> Math.pow(x, y)
 *   x // y                   -> Math.floor(x / y)
 * 
 * TYPE CONVERSIONS:
 *   int(x)                   -> parseInt(x)
 *   float(x)                 -> parseFloat(x)
 *   str(x)                   -> String(x)
 *   bool(x)                  -> Boolean(x)
 *   list(x)                  -> Array.from(x)
 * 
 * RPG MAKER SHORTCUTS:
 *   player                   -> $gamePlayer
 *   party                    -> $gameParty
 *   map                      -> $gameMap
 *   switches                 -> $gameSwitches
 *   variables                -> $gameVariables
 *   actors                   -> $gameActors
 *   items                    -> $dataItems
 *   gold                     -> $gameParty.gold()
 * 
 * ============================================================================
 * EXAMPLES
 * ============================================================================
 * 
 * # Heal all party members
 * /py for actor in party.members(): actor.recoverAll()
 * 
 * # Give gold
 * /py party.gainGold(10000)
 * 
 * # Teleport player
 * /py player.setPosition(10, 15)
 * 
 * # Print player position
 * /py print(f"Position: ({player.x}, {player.y})")
 * 
 * # Loop through items
 * /py for i in range(1, 10): print(items[i].name if items[i] else "Empty")
 * 
 * # Check switches
 * /py for i in range(1, 20): print(f"Switch {i}: {switches.value(i)}")
 * 
 * ============================================================================
 */

(() => {
    'use strict';
    
    const script = document.currentScript;
    const params = PluginManagerEx ? PluginManagerEx.createParameter(script) : { EnablePythonMode: true };
    
    if (!params.EnablePythonMode) return;

    /**
     * PythonTranspiler - Converts Python-like syntax to JavaScript
     */
    const PythonTranspiler = {
        // Indentation tracking for block conversion
        _indentStack: [],
        _currentIndent: 0,
        
        /**
         * Main transpile function
         * @param {string} code - Python-like code
         * @returns {string} - JavaScript code
         */
        transpile(code) {
            if (!code || typeof code !== 'string') return '';
            
            // Reset state
            this._indentStack = [];
            this._currentIndent = 0;
            
            let js = code;
            
            // Pre-process: Handle f-strings
            js = this.convertFStrings(js);
            
            // Convert Python syntax to JS
            js = this.convertKeywords(js);
            js = this.convertOperators(js);
            js = this.convertBuiltins(js);
            js = this.convertLoops(js);
            js = this.convertConditionals(js);
            js = this.convertFunctions(js);
            js = this.convertRPGMakerShortcuts(js);
            js = this.convertMethodCalls(js);
            js = this.convertAssignments(js);
            
            // Post-process: Handle indentation-based blocks
            js = this.convertIndentationBlocks(js);
            
            return js.trim();
        },
        
        /**
         * Convert f-strings to template literals
         */
        convertFStrings(code) {
            // f"text {var}" -> `text ${var}`
            return code.replace(/f["']([^"']*?)["']/g, (match, content) => {
                const converted = content.replace(/\{([^}]+)\}/g, '${$1}');
                return '`' + converted + '`';
            });
        },
        
        /**
         * Convert Python keywords to JavaScript
         */
        convertKeywords(code) {
            const keywords = [
                [/\bTrue\b/g, 'true'],
                [/\bFalse\b/g, 'false'],
                [/\bNone\b/g, 'null'],
                [/\band\b/g, '&&'],
                [/\bor\b/g, '||'],
                [/\bnot\s+/g, '!'],
                [/\bis\s+None\b/g, '=== null'],
                [/\bis\s+not\s+None\b/g, '!== null'],
                [/\bis\s+not\b/g, '!=='],
                [/\bis\b/g, '==='],
                [/\bpass\b/g, '/* pass */'],
                [/\belif\b/g, 'else if'],
            ];
            
            for (const [pattern, replacement] of keywords) {
                code = code.replace(pattern, replacement);
            }
            return code;
        },
        
        /**
         * Convert Python operators to JavaScript
         */
        convertOperators(code) {
            // ** power operator -> Math.pow
            code = code.replace(/(\w+|\))\s*\*\*\s*(\w+|\()/g, 'Math.pow($1, $2)');
            
            // // floor division -> Math.floor
            code = code.replace(/(\w+|\))\s*\/\/\s*(\w+|\()/g, 'Math.floor($1 / $2)');
            
            // x not in list -> !list.includes(x)
            code = code.replace(/(\w+)\s+not\s+in\s+(\w+)/g, '!$2.includes($1)');
            
            // x in list -> list.includes(x)
            code = code.replace(/(\w+)\s+in\s+(\w+)(?!\s*[:\)])/g, '$2.includes($1)');
            
            return code;
        },
        
        /**
         * Convert Python built-in functions
         */
        convertBuiltins(code) {
            const builtins = [
                // Print
                [/\bprint\s*\(/g, 'console.log('],
                
                // Type conversions
                [/\bint\s*\(/g, 'parseInt('],
                [/\bfloat\s*\(/g, 'parseFloat('],
                [/\bstr\s*\(/g, 'String('],
                [/\bbool\s*\(/g, 'Boolean('],
                [/\blist\s*\(/g, 'Array.from('],
                
                // Math functions
                [/\babs\s*\(/g, 'Math.abs('],
                [/\bmin\s*\(/g, 'Math.min('],
                [/\bmax\s*\(/g, 'Math.max('],
                [/\bpow\s*\(/g, 'Math.pow('],
                [/\bround\s*\(/g, 'Math.round('],
                [/\bsqrt\s*\(/g, 'Math.sqrt('],
                
                // len() -> .length
                [/\blen\s*\(\s*(\w+)\s*\)/g, '$1.length'],
                
                // type() -> typeof
                [/\btype\s*\(/g, 'typeof('],
                
                // isinstance check (basic)
                [/\bisinstance\s*\(\s*(\w+)\s*,\s*(\w+)\s*\)/g, '$1 instanceof $2'],
                
                // input() -> prompt()
                [/\binput\s*\(/g, 'prompt('],
            ];
            
            for (const [pattern, replacement] of builtins) {
                code = code.replace(pattern, replacement);
            }
            
            return code;
        },
        
        /**
         * Convert Python loops to JavaScript
         */
        convertLoops(code) {
            // for i in range(n): -> for (let i = 0; i < n; i++) {
            code = code.replace(
                /for\s+(\w+)\s+in\s+range\s*\(\s*(\d+)\s*\)\s*:/g,
                'for (let $1 = 0; $1 < $2; $1++) {'
            );
            
            // for i in range(start, end): -> for (let i = start; i < end; i++) {
            code = code.replace(
                /for\s+(\w+)\s+in\s+range\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)\s*:/g,
                'for (let $1 = $2; $1 < $3; $1++) {'
            );
            
            // for i in range(start, end, step): -> for (let i = start; i < end; i += step) {
            code = code.replace(
                /for\s+(\w+)\s+in\s+range\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)\s*:/g,
                'for (let $1 = $2; $1 < $3; $1 += $4) {'
            );
            
            // for item in list: -> for (const item of list) {
            code = code.replace(
                /for\s+(\w+)\s+in\s+(\w+(?:\.\w+)*(?:\(\))?)\s*:/g,
                'for (const $1 of $2) {'
            );
            
            // while condition: -> while (condition) {
            code = code.replace(
                /while\s+(.+?):/g,
                'while ($1) {'
            );
            
            return code;
        },
        
        /**
         * Convert Python conditionals to JavaScript
         */
        convertConditionals(code) {
            // if condition: -> if (condition) {
            code = code.replace(
                /if\s+(.+?):/g,
                'if ($1) {'
            );
            
            // else if already handled by keyword conversion
            // else if condition: -> else if (condition) {
            code = code.replace(
                /else\s+if\s+(.+?):/g,
                '} else if ($1) {'
            );
            
            // else: -> } else {
            code = code.replace(
                /else\s*:/g,
                '} else {'
            );
            
            // Ternary: x if condition else y -> condition ? x : y
            code = code.replace(
                /(\S+)\s+if\s+(.+?)\s+else\s+(\S+)/g,
                '$2 ? $1 : $3'
            );
            
            return code;
        },
        
        /**
         * Convert Python functions to JavaScript
         */
        convertFunctions(code) {
            // def func(args): -> function func(args) {
            code = code.replace(
                /def\s+(\w+)\s*\(([^)]*)\)\s*:/g,
                'function $1($2) {'
            );
            
            // lambda x: expr -> (x) => expr
            code = code.replace(
                /lambda\s+([^:]+):\s*(.+?)(?=\)|,|$)/g,
                '($1) => $2'
            );
            
            // return statement (already valid JS)
            
            return code;
        },
        
        /**
         * Convert RPG Maker shortcuts
         */
        convertRPGMakerShortcuts(code) {
            const shortcuts = [
                [/\bplayer\b(?!\s*[=\[])/g, '$gamePlayer'],
                [/\bparty\b(?!\s*[=\[])/g, '$gameParty'],
                [/\bmap\b(?!\s*[=\[])/g, '$gameMap'],
                [/\bswitches\b(?!\s*[=\[])/g, '$gameSwitches'],
                [/\bvariables\b(?!\s*[=\[])/g, '$gameVariables'],
                [/\bactors\b(?!\s*[=\[])/g, '$gameActors'],
                [/\bitems\b(?!\s*[=\[])/g, '$dataItems'],
                [/\bweapons\b(?!\s*[=\[])/g, '$dataWeapons'],
                [/\barmors\b(?!\s*[=\[])/g, '$dataArmors'],
                [/\benemies\b(?!\s*[=\[])/g, '$dataEnemies'],
                [/\btroop\b(?!\s*[=\[])/g, '$gameTroop'],
                [/\bscreen\b(?!\s*[=\[])/g, '$gameScreen'],
                [/\bmessage\b(?!\s*[=\[])/g, '$gameMessage'],
                [/\bsystem\b(?!\s*[=\[])/g, '$gameSystem'],
                [/\btemp\b(?!\s*[=\[])/g, '$gameTemp'],
                [/\btimer\b(?!\s*[=\[])/g, '$gameTimer'],
            ];
            
            for (const [pattern, replacement] of shortcuts) {
                code = code.replace(pattern, replacement);
            }
            
            return code;
        },
        
        /**
         * Convert Python method calls to JavaScript equivalents
         */
        convertMethodCalls(code) {
            // String methods
            code = code.replace(/\.upper\(\)/g, '.toUpperCase()');
            code = code.replace(/\.lower\(\)/g, '.toLowerCase()');
            code = code.replace(/\.strip\(\)/g, '.trim()');
            code = code.replace(/\.lstrip\(\)/g, '.trimStart()');
            code = code.replace(/\.rstrip\(\)/g, '.trimEnd()');
            code = code.replace(/\.startswith\(/g, '.startsWith(');
            code = code.replace(/\.endswith\(/g, '.endsWith(');
            code = code.replace(/\.find\(/g, '.indexOf(');
            code = code.replace(/\.replace\(/g, '.replace(');
            code = code.replace(/\.split\(/g, '.split(');
            code = code.replace(/\.join\(/g, '.join(');
            
            // List methods
            code = code.replace(/\.append\(/g, '.push(');
            code = code.replace(/\.pop\(\)/g, '.pop()');
            code = code.replace(/\.remove\(/g, '.splice(.indexOf('); // Simplified
            code = code.replace(/\.insert\(/g, '.splice(');
            code = code.replace(/\.reverse\(\)/g, '.reverse()');
            code = code.replace(/\.sort\(\)/g, '.sort()');
            code = code.replace(/\.extend\(/g, '.push(...');
            code = code.replace(/\.index\(/g, '.indexOf(');
            code = code.replace(/\.count\(/g, '.filter(x => x === ').replace(/\)$/, ').length');
            
            // Dict methods
            code = code.replace(/(\w+)\.keys\(\)/g, 'Object.keys($1)');
            code = code.replace(/(\w+)\.values\(\)/g, 'Object.values($1)');
            code = code.replace(/(\w+)\.items\(\)/g, 'Object.entries($1)');
            code = code.replace(/(\w+)\.get\(([^,)]+),?\s*([^)]*)\)/g, '($1[$2] ?? $3)');
            
            return code;
        },
        
        /**
         * Convert simple Python assignments
         */
        convertAssignments(code) {
            // Only add 'let' for simple variable assignments (not property assignments)
            // x = value -> let x = value (but not obj.x = value)
            const lines = code.split('\n');
            const declaredVars = new Set();
            
            return lines.map(line => {
                // Skip if it's a property assignment or already has let/const/var
                if (line.includes('.') || /\b(let|const|var)\s/.test(line)) {
                    return line;
                }
                
                // Match simple assignment: varname = value
                const match = line.match(/^(\s*)(\w+)\s*=\s*(.+)$/);
                if (match) {
                    const [, indent, varName, value] = match;
                    // Don't redeclare if already declared
                    if (!declaredVars.has(varName)) {
                        declaredVars.add(varName);
                        return `${indent}let ${varName} = ${value}`;
                    }
                }
                return line;
            }).join('\n');
        },
        
        /**
         * Convert indentation-based blocks to brace-based
         * This is a simplified version - handles single-line blocks after :
         */
        convertIndentationBlocks(code) {
            const lines = code.split('\n');
            const result = [];
            let openBraces = 0;
            
            for (let i = 0; i < lines.length; i++) {
                let line = lines[i];
                
                // Count braces to track nesting
                const openCount = (line.match(/{/g) || []).length;
                const closeCount = (line.match(/}/g) || []).length;
                openBraces += openCount - closeCount;
                
                result.push(line);
            }
            
            // Close any remaining open braces
            while (openBraces > 0) {
                result.push('}');
                openBraces--;
            }
            
            return result.join('\n');
        }
    };

    /**
     * Execute transpiled Python code
     * @param {string} pyCode - Python-like code
     * @returns {*} - Result of execution
     */
    function executePython(pyCode) {
        const jsCode = PythonTranspiler.transpile(pyCode);
        
        // Log transpilation for debugging
        console.log('%c[Python]%c ' + pyCode, 'color: #3776AB; font-weight: bold;', 'color: inherit;');
        console.log('%c[JS]%c ' + jsCode, 'color: #F7DF1E; font-weight: bold;', 'color: inherit;');
        
        try {
            // Use Function constructor for cleaner execution
            const result = new Function(jsCode)();
            if (result !== undefined) {
                console.log('%c[Result]%c', 'color: #4CAF50; font-weight: bold;', 'color: inherit;', result);
            }
            return result;
        } catch (error) {
            console.error('%c[Error]%c ' + error.message, 'color: #F44336; font-weight: bold;', 'color: inherit;');
            console.error('Generated JS:', jsCode);
            return null;
        }
    }

    /**
     * Tagged template literal for Python code
     * Usage: py`print("hello")`
     */
    function pyTaggedTemplate(strings, ...values) {
        let code = strings[0];
        for (let i = 0; i < values.length; i++) {
            code += values[i] + strings[i + 1];
        }
        return executePython(code);
    }

    // Expose global functions
    window.py = pyTaggedTemplate;
    window.$py = executePython;
    window.pyrun = executePython;
    window.pytranspile = (code) => {
        const js = PythonTranspiler.transpile(code);
        console.log(js);
        return js;
    };
    
    // Expose transpiler for advanced usage
    window.PythonTranspiler = PythonTranspiler;

    // Register /py command with DevConsole if available
    if (typeof DevConsole !== 'undefined' && DevConsole.register) {
        DevConsole.register('py', (args) => {
            if (args.length === 0) {
                console.log('Usage: /py <python code>');
                console.log('Example: /py print("Hello World")');
                console.log('Example: /py for i in range(5): print(i)');
                return;
            }
            const code = args.join(' ');
            return executePython(code);
        }, 'Execute Python-like code', '/py <code>');
        
        DevConsole.register('pyhelp', () => {
            const style = 'color: #3776AB; font-weight: bold;';
            const codeStyle = 'color: #4CAF50; font-family: monospace;';
            
            console.log('%c╔══════════════════════════════════════════════╗', style);
            console.log('%c║     Python-like Syntax for DevConsole        ║', style);
            console.log('%c╚══════════════════════════════════════════════╝', style);
            console.log('');
            console.log('%c▸ Basic Usage:', style);
            console.log('  %c/py print("Hello")', codeStyle);
            console.log('  %cpy`player.x = 10`', codeStyle);
            console.log('  %c$py(\'print(player.x)\')', codeStyle);
            console.log('');
            console.log('%c▸ Variables:', style);
            console.log('  %cx = 10                    → let x = 10', codeStyle);
            console.log('  %cprint(x)                  → console.log(x)', codeStyle);
            console.log('');
            console.log('%c▸ Loops:', style);
            console.log('  %cfor i in range(5):        → for loop 0-4', codeStyle);
            console.log('  %cfor item in list:         → for...of loop', codeStyle);
            console.log('  %cwhile x > 0:              → while loop', codeStyle);
            console.log('');
            console.log('%c▸ Conditionals:', style);
            console.log('  %cif x > 5:                 → if statement', codeStyle);
            console.log('  %celif x > 2:               → else if', codeStyle);
            console.log('  %celse:                     → else', codeStyle);
            console.log('');
            console.log('%c▸ RPG Maker Shortcuts:', style);
            console.log('  %cplayer → $gamePlayer      party → $gameParty', codeStyle);
            console.log('  %cmap → $gameMap            switches → $gameSwitches', codeStyle);
            console.log('  %cvariables → $gameVariables', codeStyle);
            console.log('');
            console.log('%c▸ Examples:', style);
            console.log('  %c/py party.gainGold(10000)', codeStyle);
            console.log('  %c/py for actor in party.members(): actor.recoverAll()', codeStyle);
            console.log('  %c/py print(f"HP: {party.leader().hp}")', codeStyle);
            console.log('');
            console.log('%cUse pytranspile("code") to see JS output without executing', 'color: #FF9800; font-style: italic;');
        }, 'Show Python syntax help', '/pyhelp');
        
        DevConsole.alias('python', 'py');
    }

    // Log initialization
    console.log('%c🐍 Python Compiler Ready! Use /py, py`code`, or $py("code")', 
        'background: #3776AB; color: white; padding: 5px; border-radius: 3px; font-weight: bold;');

})();
