# RPG Maker MZ Text Code Cheat Sheet

## 🎭 Basic Text Codes

### **Color Codes**
```
\C[n]  - Change text color (n = color number 0-31)
\C[0]  - White (default)
\C[1]  - Blue
\C[2]  - Red
\C[3]  - Green
\C[4]  - Cyan
\C[10] - Dark Red
\C[14] - Gray
\C[18] - Orange
```

**Example:**
```
\C[2]DANGER!\C[0] This is normal text.
```

---

### **Icons**
```
\I[n]  - Display icon (n = icon ID from IconSet.png)
\I[1]  - Poison icon
\I[64] - Gold coin
\I[87] - Sword
\I[176] - Heart
```

**Example:**
```
You found \I[64] 500 Gold!
```

---

## 💰 Variable & Data Display

### **Variables & Values**
```
\V[n]  - Show variable value (n = variable ID)
\G     - Show currency unit (Gold)
```

**Example:**
```
You have \V[10] potions.
Total: \V[5]\G
```

---

### **Actor Information**
```
\N[n]  - Actor name (n = actor ID)
\P[n]  - Party member name (n = party position 1-4)
\N[1]  - Shows Actor 1's name
\P[1]  - Shows 1st party member's name
```

**Example:**
```
\N[1]: I'm the hero!
\P[2]: I'm the second party member!
```

---

## ⚔️ Icons & Special Characters

### **Currency & Stats**
```
\G     - Gold icon + "G"
```

---

### **Special Characters**
```
\\     - Backslash \
\$     - Opens gold window
\.     - Wait 1/4 second
\|     - Wait 1 second
\!     - Wait for button press
\>     - Instant text (no letter-by-letter)
\<     - Cancel instant text
\^     - Close message window immediately
```

**Example:**
```
Hello\. there\. friend\!
(Pauses between words, waits for button at end)
```

---

## 🎨 Advanced Formatting

### **Text Size**
```
\{     - Increase text size
\}     - Decrease text size
```

**Example:**
```
Normal \{ BIG TEXT \} Normal again
```

---

### **Text Effects** (Requires Plugins)
```
\PX[n] - Move text X pixels horizontally
\PY[n] - Move text Y pixels vertically
\FS[n] - Change font size (n = size)
```

---

## 🎪 Custom Codes (Your Plugins May Add These)

### **Common Plugin Extensions**
```
\AF[n] - Show actor face (VisuStella)
\PF[n] - Show party member face
\HP[n] - Show actor's HP
\MP[n] - Show actor's MP
\TP[n] - Show actor's TP
```

---

## 💡 Practical Examples

### **Quest Dialogue**
```
\C[3]Quest Complete!\C[0]
You received \I[64]500\G and \I[87]Iron Sword!
```

### **Character Conversation**
```
\N[1]: Hey \N[2], look what I found!
\N[2]: Is that a \I[176]Health Potion?
\N[1]: Yeah! We have \V[10] now.
```

### **Dramatic Pause**
```
The demon king appears\.\.\.\!
\C[2]\{PREPARE TO DIE!\}\C[0]
```

### **Variable Display**
```
Current Level: \V[5]
Experience: \V[6] / \V[7]
Gold: \V[8]\G
```

### **Shop Dialogue**
```
Shopkeeper: That'll be 500\G.
You have \V[1]\G.
\C[3]Purchase?\C[0]
```

---

## 🔧 Pro Tips

### **Combining Codes**
You can stack multiple codes:
```
\C[10]\I[1]\N[1] is poisoned!\C[0]
(Red text + poison icon + actor name)
```

### **Color Palette Reference**
- **0** = White
- **1** = Blue
- **2** = Red  
- **3** = Green
- **4** = Cyan
- **5** = Purple
- **6** = Yellow
- **7** = Gray
- **8-15** = Darker variants
- **16-23** = System colors
- **24-31** = Custom colors

### **Common Icon IDs**
- **1-48**: Status effects (poison, sleep, etc.)
- **64-95**: Items (potions, keys, gold)
- **96-143**: Equipment (weapons, armor)
- **144-159**: Skills/Magic
- **160-191**: Misc (hearts, stars, elemental)

---

## 🎯 RE;LIVE Specific Examples

### **Loop Counter Display**
```
\C[18]Loop \V[20]\C[0] - Day \V[21]
```

### **System Messages**
```
\C[2]<ERROR DETECTED>\C[0]
\C[10]LOOP RESET INITIATED...\C[0]
```

### **Character Stats**
```
\N[1] - Level \V[1]
HP: \V[2] / \V[3]
```

### **Time Loop Notification**
```
\|You have died\.\.\.
\!\C[18]Returning to checkpoint\.\.\.\C[0]
```

---

## 🚀 Quick Reference Table

| Code | Effect | Example |
|------|--------|---------|
| `\C[n]` | Color | `\C[2]Red Text\C[0]` |
| `\I[n]` | Icon | `\I[64] Gold` |
| `\V[n]` | Variable | `\V[1] potions` |
| `\N[n]` | Actor Name | `\N[1] says hi` |
| `\G` | Currency | `500\G` |
| `\.` | Wait 1/4 sec | `Wait\. here` |
| `\|` | Wait 1 sec | `Long\| pause` |
| `\!` | Wait button | `Click\! me` |
| `\{` | Bigger text | `\{BIG\}` |
| `\}` | Smaller text | `\}small\}` |

---

## 📝 Testing in Your Game

Open any event → Show Text command → Try these:

```
Hello \N[1]! You have \V[10] items.
\C[3]This is green!\C[0] This is normal.
You earned \I[64]500\G!
\.\.\.\!
```

---

## 🔍 Finding Icon IDs

1. Open **RPG Maker MZ**
2. Go to **Database** → **System 2**
3. Look at **IconSet** preview
4. Count from **left to right, top to bottom** starting at 0
5. Or use: [Icon ID = (Row × 16) + Column]

Example: Icon in Row 5, Column 3 = (5 × 16) + 3 = **83**

---

**Note:** Some codes require specific plugins (like VisuStella Message Core). The basic codes above work in vanilla RPG Maker MZ!
