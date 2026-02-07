import json
import re
from typing import Dict, List

def categorize_effect(animation: Dict) -> str:
    """Categorize an animation based on its name and effectName with priority-based logic."""
    name = animation.get("name", "").lower()
    effect_name = animation.get("effectName", "").lower()
    
    # CRITICAL: Check effectName for blood FIRST (catches MGC_W3_Blood* effects)
    if "blood" in effect_name or "blood" in name:
        return "BLOOD"
    
    # BREATH ATTACKS - Check before elements
    if "breath" in name:
        return "BREATH"
    
    # STATUS EFFECTS - Check before other categories
    if any(x in name for x in ["poison", "paralysis", "silence", "sleep", "stun", "blind", "confuse", "berserk", "charm"]):
        return "STATUS"
    
    # DEFENSIVE - Check before elements
    if any(x in name for x in ["shield", "guard", "protect", "barrier", "wall", "reflect"]):
        return "DEFENSIVE"
    
    # SUPPORT/HEALING - Check before elements
    if any(x in name for x in ["heal", "cure", "regen", "revive", "restore", "recovery", "resurrect", "raise", "life"]):
        return "SUPPORT"
    
    # SPECIAL MOVES - Check before elements (but exclude hit/effect to avoid false positives)
    if any(x in name for x in ["special", "limit", "ultimate", "finisher", "super"]) and "hit/effect" not in name:
        return "SPECIAL"
    
    # ELEMENTAL - Priority checks
    if any(x in name for x in ["fire", "flame", "burn", "blaze", "heat", "inferno", "pyro"]):
        return "FIRE"
    
    if any(x in name for x in ["ice", "frost", "freeze", "cold", "blizzard", "cryo"]):
        return "ICE"
    
    if any(x in name for x in ["thunder", "lightning", "electric", "bolt", "shock", "thunder"]):
        return "THUNDER"
    
    if any(x in name for x in ["water", "aqua", "splash", "wave", "tsunami", "hydro"]):
        return "WATER"
    
    if any(x in name for x in ["earth", "stone", "rock", "quake", "ground", "geo"]):
        return "EARTH"
    
    if any(x in name for x in ["wind", "gale", "tornado", "cyclone", "breeze", "aero"]) and "windbreath" not in name:
        return "WIND"
    
    if any(x in name for x in ["light", "holy", "divine", "sacred", "celestial", "radiant"]):
        return "LIGHT"
    
    if any(x in name for x in ["dark", "shadow", "evil", "curse", "hex", "doom"]):
        return "DARKNESS"
    
    # NEUTRAL MAGIC
    if any(x in name for x in ["magic", "mana", "spell", "arcane", "mystic", "energy"]):
        return "NEUTRAL"
    
    # PHYSICAL ATTACKS - Only basic physical types (exclude special weapons)
    if any(x in name for x in ["hit/physical", "blow", "slash/physical", "pierce/physical", "claw/physical", "body slam", "leg sweep"]):
        return "PHYSICAL"
    
    # WEAPON ATTACKS - Only "normal attack" variants (exclude special moves)
    if "normal attack" in name:
        return "WEAPONS"
    
    # SHOOTING/LASER
    if any(x in name for x in ["arrow", "shot", "bullet", "laser", "beam", "ray", "cannon", "missile", "rocket"]):
        return "SHOOTING"
    
    # MGC effects (special MGC_ prefixed effects)
    if "mgc" in effect_name or "mgc" in name:
        return "MGC"
    
    # Default to MISC
    return "MISC"

def create_separator(category_name: str, separator_id: int) -> Dict:
    """Create a category separator entry."""
    emoji_map = {
        "PHYSICAL": "⚔️",
        "WEAPONS": "🗡️",
        "FIRE": "🔥",
        "ICE": "❄️",
        "THUNDER": "⚡",
        "WATER": "💧",
        "EARTH": "🌍",
        "WIND": "💨",
        "LIGHT": "✨",
        "DARKNESS": "🌑",
        "NEUTRAL": "⚪",
        "SUPPORT": "💚",
        "STATUS": "💫",
        "DEFENSIVE": "🛡️",
        "BREATH": "🐉",
        "SHOOTING": "🔫",
        "SPECIAL": "🌟",
        "MISC": "🎭",
        "MGC": "🔮",
        "BLOOD": "🩸"
    }
    
    category_display = {
        "PHYSICAL": "PHYSICAL ATTACKS",
        "WEAPONS": "WEAPON ATTACKS",
        "FIRE": "FIRE ELEMENT",
        "ICE": "ICE ELEMENT",
        "THUNDER": "THUNDER ELEMENT",
        "WATER": "WATER ELEMENT",
        "EARTH": "EARTH ELEMENT",
        "WIND": "WIND ELEMENT",
        "LIGHT": "LIGHT ELEMENT",
        "DARKNESS": "DARKNESS ELEMENT",
        "NEUTRAL": "NEUTRAL MAGIC",
        "SUPPORT": "SUPPORT/HEALING",
        "STATUS": "STATUS EFFECTS",
        "DEFENSIVE": "DEFENSIVE",
        "BREATH": "BREATH ATTACKS",
        "SHOOTING": "SHOOTING/LASER",
        "SPECIAL": "SPECIAL MOVES",
        "MISC": "MISCELLANEOUS",
        "MGC": "MGC EFFECTS",
        "BLOOD": "BLOOD EFFECTS"
    }
    
    emoji = emoji_map.get(category_name, "📁")
    display = category_display.get(category_name, category_name)
    
    return {
        "id": separator_id,
        "displayType": 0,
        "alignBottom": False,
        "effectName": "",
        "flashTimings": [],
        "name": f"--{emoji}{display}-----",
        "offsetX": 0,
        "offsetY": 0,
        "rotation": {"x": 0, "y": 0, "z": 0},
        "scale": 100,
        "soundTimings": [],
        "speed": 100,
        "timings": []
    }

def reorganize_animations(input_file: str, output_file: str):
    """Main function to reorganize animations by category."""
    # Load the JSON file
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Category order (same as requested)
    category_order = [
        "PHYSICAL", "WEAPONS", "FIRE", "ICE", "THUNDER", "WATER", "EARTH", "WIND",
        "LIGHT", "DARKNESS", "NEUTRAL", "SUPPORT", "STATUS", "DEFENSIVE", "BREATH",
        "SHOOTING", "SPECIAL", "MISC", "MGC", "BLOOD"
    ]
    
    # Categorize all animations (skip null and empty entries)
    categorized = {cat: [] for cat in category_order}
    
    for item in data[1:]:  # Skip the null at index 0
        if item is None or not item or item.get("name") == "":
            continue
        
        category = categorize_effect(item)
        categorized[category].append(item)
    
    # Build the new array with separators and renumbered IDs
    result = [None]  # Start with null
    current_id = 1
    
    for category in category_order:
        if categorized[category]:
            # Add category separator
            separator = create_separator(category, current_id)
            result.append(separator)
            current_id += 1
            
            # Add all animations in this category with renumbered IDs
            for animation in categorized[category]:
                animation["id"] = current_id
                result.append(animation)
                current_id += 1
    
    # Save the reorganized file
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=0, ensure_ascii=False)
    
    # Print statistics
    print("\n=== REORGANIZATION COMPLETE ===\n")
    print(f"Total animations processed: {current_id - 1}")
    print(f"\nCategory Distribution:")
    for category in category_order:
        count = len(categorized[category])
        if count > 0:
            print(f"  {category}: {count}")
    print(f"\nOutput saved to: {output_file}")

if __name__ == "__main__":
    reorganize_animations(
        "Animations.json",
        "Animations_Reorganized.json"
    )
