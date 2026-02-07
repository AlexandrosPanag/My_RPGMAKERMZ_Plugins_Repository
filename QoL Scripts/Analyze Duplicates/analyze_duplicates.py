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
Analyze Animations.json for duplicate/similar animations that can be removed.
"""

import json
from collections import defaultdict

def analyze_duplicates(file_path):
    """Find duplicate and similar animations."""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Group animations by effectName
    by_effect = defaultdict(list)
    # Group by display name
    by_name = defaultdict(list)
    # Track empty/minimal animations
    minimal = []
    
    for i, anim in enumerate(data[1:], 1):  # Skip null at index 0
        if anim is None:
            continue
        
        name = anim.get('name', '')
        effect_name = anim.get('effectName', '')
        
        # Skip separators
        if name.startswith('--'):
            continue
        
        # Track by effectName
        if effect_name:
            by_effect[effect_name].append({
                'id': anim.get('id'),
                'name': name,
                'index': i
            })
        
        # Track by name
        if name:
            by_name[name].append({
                'id': anim.get('id'),
                'effectName': effect_name,
                'index': i
            })
        
        # Check for minimal animations (no sounds, no flashes, no effect)
        has_sound = len(anim.get('soundTimings', [])) > 0
        has_flash = len(anim.get('flashTimings', [])) > 0
        has_effect = effect_name != ''
        
        if not has_sound and not has_flash and not has_effect:
            minimal.append({
                'id': anim.get('id'),
                'name': name,
                'reason': 'No sound, flash, or effect'
            })
    
    # Report findings
    print("=" * 60)
    print("DUPLICATE/CLEANUP ANALYSIS")
    print("=" * 60)
    
    # 1. Same effectName but different display names
    print("\n📋 SAME EFFECT, DIFFERENT NAMES (Potential duplicates):")
    print("-" * 60)
    duplicate_effects = {k: v for k, v in by_effect.items() if len(v) > 1}
    if duplicate_effects:
        for effect, anims in sorted(duplicate_effects.items()):
            print(f"\nEffect: {effect}")
            print(f"  Used by {len(anims)} animations:")
            for anim in anims:
                print(f"    • ID {anim['id']}: {anim['name']}")
    else:
        print("  ✅ No duplicates found")
    
    # 2. Same display name but different effects
    print("\n\n📋 SAME NAME, DIFFERENT EFFECTS (Variants):")
    print("-" * 60)
    duplicate_names = {k: v for k, v in by_name.items() if len(v) > 1 and k != ''}
    if duplicate_names:
        count = 0
        for name, anims in sorted(duplicate_names.items()):
            if count < 10:  # Show first 10
                print(f"\nName: {name}")
                print(f"  {len(anims)} variants:")
                for anim in anims:
                    print(f"    • ID {anim['id']}: {anim['effectName'][:50]}...")
                count += 1
        if len(duplicate_names) > 10:
            print(f"\n  ... and {len(duplicate_names) - 10} more duplicate names")
    else:
        print("  ✅ No duplicates found")
    
    # 3. Minimal animations
    print("\n\n📋 MINIMAL ANIMATIONS (Can be removed):")
    print("-" * 60)
    if minimal:
        for anim in minimal[:20]:  # Show first 20
            print(f"  • ID {anim['id']}: {anim['name'] or '(empty)'} - {anim['reason']}")
        if len(minimal) > 20:
            print(f"\n  ... and {len(minimal) - 20} more minimal animations")
        print(f"\n  Total minimal animations: {len(minimal)}")
    else:
        print("  ✅ No minimal animations found")
    
    # 4. Summary
    print("\n\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total animations analyzed: {len(data) - 1}")
    print(f"Effects with multiple uses: {len(duplicate_effects)}")
    print(f"Names used multiple times: {len(duplicate_names)}")
    print(f"Minimal animations to remove: {len(minimal)}")
    
    # Generate cleanup recommendations
    print("\n\n💡 CLEANUP RECOMMENDATIONS:")
    print("-" * 60)
    
    if duplicate_effects:
        print(f"1. Review {len(duplicate_effects)} duplicated effects")
        print("   → Keep one variant per effect, remove others")
    
    if minimal:
        print(f"2. Remove {len(minimal)} minimal animations")
        print("   → These have no sound, flash, or visual effect")
    
    total_removable = len(minimal)
    if total_removable > 0:
        print(f"\n✂️ POTENTIAL FILE SIZE REDUCTION:")
        print(f"   Removing {total_removable} animations could save ~{total_removable * 0.4:.1f} KB")
    
    return {
        'duplicate_effects': duplicate_effects,
        'duplicate_names': duplicate_names,
        'minimal': minimal
    }

if __name__ == "__main__":
    file_path = r"c:\Users\alexa\Documents\RMMZ\Re;Live\data\Animations.json"
    print(f"\n🔍 Analyzing: {file_path}\n")
    results = analyze_duplicates(file_path)
