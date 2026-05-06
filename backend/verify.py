# save as verify.py in backend folder
import json
from pathlib import Path

files = list(Path("data/kanoon_raw").glob("hc_*.json"))
print(f"High Court files: {len(files)}")

# open 3 and show first 300 chars
for f in files[:3]:
    with open(f) as file:
        record = json.load(file)
    text = record.get("full_text", "")
    print(f"\n{'='*50}")
    print(f"File: {f.name}")
    print(f"Text preview: {text[:300]}")