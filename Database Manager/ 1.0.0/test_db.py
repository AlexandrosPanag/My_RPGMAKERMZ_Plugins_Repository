# RPG Maker MZ Database Manager
# Created by Alexandros Panagiotakopoulos
# Version 1.0.0
# Date: 22/10/2026
# Copyright (c) 2026-2027 Alexandros Panagiotakopoulos 
# License: CC BY-NC-SA 4.0 
# https://creativecommons.org/licenses/by-nc-sa/4.0/ 

"""Quick smoke test for database logic."""
from database import DatabaseManager
import os

db = DatabaseManager()
data_dir = os.path.join(os.path.dirname(__file__), "sample_data")
db.set_path(data_dir)

results = db.load_all()
for k, v in results.items():
    if v == "OK":
        entries = db.get_entries(k)
        print(f"  {k}: {v} ({len(entries)} entries)")
    elif v != "File not found":
        print(f"  {k}: {v}")

print("\n--- Testing CRUD ---")
skills = db.get_entries("Skills")
print(f"Skills before add: {len(skills)}")

new_idx = db.add_entry("Skills")
print(f"Added skill at index {new_idx}")

db.copy_entry("Skills", 3)
name = db.clipboard["name"]
print(f"Copied skill #3 (clipboard: {name})")

paste_idx = db.paste_entry("Skills")
print(f"Pasted at index {paste_idx}")

db.swap_entries("Skills", 2, 3)
e2 = db.get_entry("Skills", 2)["name"]
e3 = db.get_entry("Skills", 3)["name"]
print(f"Swapped entries 2 and 3: now 2={e2}, 3={e3}")

db.delete_entry("Skills", new_idx)
print(f"Deleted entry at index {new_idx}")

print("\nAll tests passed!")
