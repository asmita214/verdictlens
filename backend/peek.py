import json
from pathlib import Path

files = list(Path("data/kanoon_raw").glob("*.json"))

for f in files[:3]:
    with open(f, "r", encoding="utf-8") as file:
        record = json.load(file)
    
    text = record.get("full_text", "")
    print(f"\n{'='*60}")
    print(f"File: {f.name}")
    print(f"Text length: {len(text)}")
    print(f"\nFirst 800 characters:")
    print(text[:800])
    print(f"\nSummary field: {record.get('summary', '')[:200]}")