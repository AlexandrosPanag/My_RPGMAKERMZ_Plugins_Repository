# Code Written by Alexandros Panagiotakopoulos
# Date: 07-02-2026
# alexandrospanag.github.io

# Reorganize Animations for DLC
# This script categorizes animations based on their names and effect names, then reorganizes them with
# category separators and renumbered IDs. The categorization logic is designed to prioritize certain keywords
# to ensure accurate classification, especially for effects that may have overlapping keywords (e.g., "
#blood" in both physical and magical effects). The script also prints out statistics about the reorganization process.
# License: 4.0 International (CC BY 4.0)


#!/usr/bin/env python3
"""
Add flash effects to elemental animations that are missing them.
"""

import json
import copy

def get_element_flash_timings(effect_name, name):
    """Generate appropriate flash timings based on element type."""
    name_lower = name.lower()
    effect_lower = effect_name.lower()
    combined = name_lower + " " + effect_lower
    
    # Elemental flash colors (R, G, B, Alpha)
    flash_templates = {
        'fire': [
            {"frame": 0, "duration": 15, "color": [255, 128, 0, 170]},    # Orange
            {"frame": 2, "duration": 20, "color": [255, 200, 100, 200]},  # Bright yellow-orange
        ],
        'ice': [
            {"frame": 0, "duration": 15, "color": [100, 200, 255, 170]},  # Light blue
            {"frame": 2, "duration": 20, "color": [200, 230, 255, 200]},  # White-blue
        ],
        'thunder': [
            {"frame": 0, "duration": 10, "color": [255, 255, 100, 200]},  # Yellow
            {"frame": 1, "duration": 15, "color": [255, 255, 255, 255]},  # White flash
            {"frame": 3, "duration": 10, "color": [200, 200, 255, 180]},  # Blue-white
        ],
        'water': [
            {"frame": 0, "duration": 15, "color": [80, 150, 255, 150]},   # Deep blue
            {"frame": 2, "duration": 20, "color": [150, 200, 255, 180]},  # Light blue
        ],
        'earth': [
            {"frame": 0, "duration": 15, "color": [139, 90, 43, 170]},    # Brown
            {"frame": 2, "duration": 20, "color": [200, 150, 100, 180]},  # Sandy brown
        ],
        'wind': [
            {"frame": 0, "duration": 15, "color": [200, 255, 200, 140]},  # Light green
            {"frame": 2, "duration": 20, "color": [230, 255, 230, 170]},  # Pale green
        ],
        'light': [
            {"frame": 0, "duration": 15, "color": [255, 255, 200, 200]},  # Bright yellow
            {"frame": 1, "duration": 20, "color": [255, 255, 255, 255]},  # Pure white
        ],
        'darkness': [
            {"frame": 0, "duration": 15, "color": [100, 50, 150, 170]},   # Purple
            {"frame": 2, "duration": 20, "color": [80, 40, 100, 200]},    # Dark purple
        ],
        'blood': [
            {"frame": 0, "duration": 15, "color": [200, 0, 0, 180]},      # Dark red
            {"frame": 2, "duration": 20, "color": [255, 50, 50, 200]},    # Bright red
        ],
    }
    
    # Check for each element
    for element, flash in flash_templates.items():
        if element in combined:
            return flash
    
    # Default flash for non-elemental attacks
    if any(x in combined for x in ['attack', 'hit', 'slash', 'pierce', 'blow', 'strike']):
        return [
            {"frame": 0, "duration": 10, "color": [255, 255, 255, 150]},  # White flash
        ]
    
    return None

def add_flash_effects(input_file, output_file):
    """Add flash effects to animations that don't have them."""
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    stats = {
        'total': 0,
        'had_flash': 0,
        'added_flash': 0,
        'skipped': 0
    }
    
    result = [None]  # Keep null at index 0
    
    for anim in data[1:]:
        if anim is None:
            continue
        
        stats['total'] += 1
        name = anim.get('name', '')
        effect_name = anim.get('effectName', '')
        
        # Skip separators
        if name.startswith('--'):
            result.append(anim)
            stats['skipped'] += 1
            continue
        
        # Check if already has flash
        existing_flash = anim.get('flashTimings', [])
        if existing_flash and len(existing_flash) > 0:
            result.append(anim)
            stats['had_flash'] += 1
            continue
        
        # Try to add appropriate flash
        new_flash = get_element_flash_timings(effect_name, name)
        
        if new_flash:
            modified = copy.deepcopy(anim)
            modified['flashTimings'] = new_flash
            result.append(modified)
            stats['added_flash'] += 1
        else:
            result.append(anim)
            stats['skipped'] += 1
    
    # Save the result
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(result, f, indent=0, ensure_ascii=False)
    
    # Print results
    print("=" * 60)
    print("FLASH EFFECTS ADDED")
    print("=" * 60)
    
    print(f"\nTotal animations processed: {stats['total']}")
    print(f"Already had flash effects: {stats['had_flash']}")
    print(f"✨ Flash effects added: {stats['added_flash']}")
    print(f"Skipped (separators/no match): {stats['skipped']}")
    
    print("\n📋 Flash colors by element:")
    print("  🔥 Fire: Orange/Yellow-orange")
    print("  ❄️  Ice: Light blue/White-blue")
    print("  ⚡ Thunder: Yellow/White/Blue-white")
    print("  💧 Water: Deep blue/Light blue")
    print("  🌍 Earth: Brown/Sandy brown")
    print("  💨 Wind: Light green/Pale green")
    print("  ✨ Light: Bright yellow/Pure white")
    print("  🌑 Darkness: Purple/Dark purple")
    print("  🩸 Blood: Dark red/Bright red")
    print("  ⚔️  Physical: White flash")
    
    print(f"\n📁 Output saved to: {output_file}")
    print("\n💡 Tip: Flash effects make elemental attacks more impactful!")

if __name__ == "__main__":
    input_file = r"c:\Users\alexa\Documents\RMMZ\Re;Live\data\Animations_Cleaned.json"
    output_file = r"c:\Users\alexa\Documents\RMMZ\Re;Live\data\Animations_WithFlash.json"
    
    print("✨ Adding flash effects to elemental animations...\n")
    print(f"📂 Reading: {input_file}\n")
    
    add_flash_effects(input_file, output_file)
