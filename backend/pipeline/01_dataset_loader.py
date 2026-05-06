from datasets import load_dataset
import json
from pathlib import Path

output_path = Path("data/kanoon_raw")
output_path.mkdir(exist_ok=True)

CRIMINAL_KEYWORDS = [
    "sentenced", "imprisonment", "convicted",
    "ipc", "indian penal code", "accused",
    "guilty", "rigorous", "section 302",
    "section 392", "section 376", "section 420",
    "section 323", "section 379", "bail",
    "years of imprisonment", "undergo imprisonment"
]

print("Loading Indian High Court Judgments...")
print("Using streaming — downloads one record at a time...")
print("Will collect 2000 criminal cases then stop...")

# streaming=True is critical here
# without it Python tries to download all 5.5M rows at once
# which would take hours and crash your RAM
# streaming downloads one record at a time
# we check each one and only save criminal cases
dataset = load_dataset(
    "Immanuel30303/Indian-High-Court-Judgments-all",
    split="train",
    streaming=True
)

saved = 0
checked = 0
TARGET = 2000  # we want 2000 criminal cases

for record in dataset:
    checked += 1

    
    text = record.get("output", "")

    if not text or len(text.strip()) < 300:
        continue

    text_lower = text.lower()

    # count how many criminal keywords appear
    matches = sum(1 for kw in CRIMINAL_KEYWORDS if kw in text_lower)

    # only save if at least 3 criminal keywords found
    if matches < 3:
        continue

    structured = {
        "doc_id": f"hc_{saved}",
        "source": "indian_high_court",
        "title": f"high_court_judgment_{saved}",
        "court": "Indian High Court",
        "date": "",
        "summary": "",
        "full_text": text.strip(),
    }

    output_file = output_path / f"hc_{saved}.json"
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(structured, f, ensure_ascii=False, indent=2)

    saved += 1

    if saved % 100 == 0:
        print(f"  Saved {saved} criminal cases (checked {checked} total)...")

    # stop once we have enough
    if saved >= TARGET:
        print(f"\nTarget reached! Stopping.")
        break

print(f"\nDone.")
print(f"Total checked: {checked}")
print(f"Criminal cases saved: {saved}")
print(f"Files in: data/kanoon_raw/")