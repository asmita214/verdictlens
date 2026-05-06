import json
import shutil
from pathlib import Path

input_path = Path("data/kanoon_raw")
output_path = Path("data/criminal_cases")
output_path.mkdir(exist_ok=True)

CRIMINAL_KEYWORDS = [
    "sentenced to",
    "rigorous imprisonment",
    "undergo imprisonment",
    "convicted",
    "guilty of the offence",
    "years imprisonment",
    "section 302",
    "section 392",
    "section 376",
    "section 420",
    "section 323",
    "ipc",
    "indian penal code",
]

all_files = list(input_path.glob("*.json"))
print(f"Checking {len(all_files)} files...")

saved = 0

for f in all_files:
    with open(f, "r", encoding="utf-8") as file:
        record = json.load(file)
    
    text = record.get("full_text", "").lower()
    
    matches = sum(1 for kw in CRIMINAL_KEYWORDS if kw in text)
    
    if matches >= 3:
        shutil.copy(f, output_path / f.name)
        saved += 1

print(f"Criminal cases found: {saved} out of {len(all_files)}")
print(f"Saved to: data/criminal_cases/")