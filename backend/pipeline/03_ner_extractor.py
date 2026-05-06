import re
import json
import spacy
import pandas as pd
from pathlib import Path

nlp = spacy.load("en_core_web_sm")

SENTENCE_PATTERNS = [
    r'sentenced?\s+to\s+(\d+)\s*years?',
    r'imprisonment\s+for\s+(\d+)\s*years?',
    r'rigorous\s+imprisonment\s+(?:for\s+)?(\d+)\s*years?',
    r'(\d+)\s*years?\s+(?:rigorous\s+)?imprisonment',
    r'undergo\s+(?:rigorous\s+)?imprisonment\s+for\s+(\d+)\s*years?',
    r'sentenced?\s+to\s+(\w+)\s+years?',
    r'imprisonment\s+for\s+(\w+)\s+years?',
    r'sentence\s+of\s+(\d+)\s*years?',
    r'(\d+)\s*years?\s+r\.i\.',
    r'r\.i\.\s+for\s+(\d+)\s*years?',
]

WORD_TO_NUM = {
    "one": 1, "two": 2, "three": 3, "four": 4,
    "five": 5, "six": 6, "seven": 7, "eight": 8,
    "nine": 9, "ten": 10, "eleven": 11, "twelve": 12,
    "thirteen": 13, "fourteen": 14, "fifteen": 15,
    "twenty": 20, "life": 20
}

IPC_PATTERNS = [
    r'[Ss]ection\s+(\d+[A-Za-z]?)\s+IPC',
    r'[Ss]ection\s+(\d+[A-Za-z]?)\s+of\s+(?:the\s+)?IPC',
    r'u/s\s+(\d+[A-Za-z]?)\s+IPC',
    r'under\s+[Ss]ection\s+(\d+[A-Za-z]?)',
    r'[Ss]ec(?:tion)?\.?\s+(\d+[A-Za-z]?)\s+IPC',
    r'[Ss]ection\s+(\d+[A-Za-z]?)\s+of\s+the\s+Indian\s+Penal',
]

BAIL_PATTERNS = [
    r'bail\s+is\s+(granted|rejected|refused|allowed)',
    r'(granted|rejected|refused|allowed)\s+bail',
    r'released\s+on\s+(bail)',
    r'bail\s+application\s+(allowed|dismissed)',
    r'bail\s+(allowed|rejected|refused|granted)',
]

OFFENSE_MAP = {
    "murder":     ["murder", "culpable homicide", "302", "304"],
    "robbery":    ["robbery", "dacoity", "392", "393", "394", "395"],
    "assault":    ["assault", "hurt", "grievous", "323", "324", "325", "326"],
    "fraud":      ["fraud", "cheating", "forgery", "420", "417", "468"],
    "theft":      ["theft", "stolen", "379", "380", "381"],
    "rape":       ["rape", "sexual assault", "376"],
    "kidnapping": ["kidnapping", "abduction", "363", "364", "365"],
    "drug":       ["narcotic", "drug", "ndps", "contraband"],
}

IPC_TO_OFFENSE = {
    "302": "murder",     "304": "murder",
    "392": "robbery",    "393": "robbery",    "394": "robbery",
    "395": "robbery",    "396": "robbery",
    "323": "assault",    "324": "assault",    "325": "assault",
    "326": "assault",
    "420": "fraud",      "417": "fraud",      "468": "fraud",
    "379": "theft",      "380": "theft",      "381": "theft",
    "376": "rape",
    "363": "kidnapping", "364": "kidnapping", "365": "kidnapping",
}


def extract_sentence_length(text: str):
    text_lower = text.lower()
    for pattern in SENTENCE_PATTERNS:
        match = re.search(pattern, text_lower)
        if match:
            value = match.group(1).strip()
            if value.isdigit():
                years = int(value)
                if 1 <= years <= 25:
                    return float(years)
            if value in WORD_TO_NUM:
                years = WORD_TO_NUM[value]
                if 1 <= years <= 25:
                    return float(years)
    if "life imprisonment" in text_lower or "imprisonment for life" in text_lower:
        return 20.0
    return None


def extract_ipc_sections(text: str):
    sections_found = []
    for pattern in IPC_PATTERNS:
        matches = re.findall(pattern, text)
        sections_found.extend(matches)
    seen = set()
    unique_sections = []
    for s in sections_found:
        if s not in seen:
            seen.add(s)
            unique_sections.append(s)
    return unique_sections


def extract_offense_type(text: str, ipc_sections: list):
    for section in ipc_sections:
        clean_section = re.sub(r'[A-Za-z]', '', section)
        if clean_section in IPC_TO_OFFENSE:
            return IPC_TO_OFFENSE[clean_section]
    text_lower = text.lower()
    for offense, keywords in OFFENSE_MAP.items():
        for keyword in keywords:
            if keyword in text_lower:
                return offense
    return "other"


def extract_bail_status(text: str):
    text_lower = text.lower()
    for pattern in BAIL_PATTERNS:
        match = re.search(pattern, text_lower)
        if match:
            result = match.group(1).lower()
            if result in ["granted", "allowed", "bail"]:
                return "granted"
            elif result in ["rejected", "refused", "dismissed"]:
                return "rejected"
    return "unknown"


def extract_judge_name(text: str):
    """
    Updated to handle High Court formats like:
    - Hon'ble Irshad Hussain, J.
    - CORAM: B.H.MARLAPALLE & SMT.ROSHAN S. DALVI,JJ.
    - Hon'ble Mr. Justice Rajesh Kumar
    - Before: Justice P.C. Verma
    """

    # pattern 1 — CORAM format which is most common in High Courts
    # CORAM: B.H.MARLAPALLE & SMT.ROSHAN S. DALVI,JJ.
    coram_match = re.search(
        r'CORAM\s*:\s*([A-Z][A-Z\s\.\,&]+?)(?:JJ\.|J\.|$)',
        text[:800]
    )
    if coram_match:
        name = coram_match.group(1).strip().rstrip(',& ')
        if 3 < len(name) < 80:
            return name

    # pattern 2 — Hon'ble format
    # Hon'ble Irshad Hussain, J.
    honble_match = re.search(
        r"Hon['\']?ble\s+(?:Mr\.?\s+)?(?:Justice\s+)?([A-Z][a-zA-Z\s\.]+?)(?:,\s*J\.|\s+J\.)",
        text[:800]
    )
    if honble_match:
        name = honble_match.group(1).strip()
        if 3 < len(name) < 60:
            return name

    # pattern 3 — Before format
    before_match = re.search(
        r'(?:BEFORE|Before)\s*:\s*(?:HON[\'"]?BLE\s+)?(?:MR\.?\s+)?(?:JUSTICE\s+)?([A-Z][A-Za-z\s\.]+)',
        text[:800]
    )
    if before_match:
        name = before_match.group(1).strip()
        if 3 < len(name) < 60:
            return name

    # pattern 4 — spaCy fallback for PERSON entities
    header_text = text[:600]
    doc = nlp(header_text)
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text.strip()
            context = header_text[
                max(0, header_text.find(name) - 40):
                header_text.find(name) + len(name) + 40
            ]
            if any(t in context.lower() for t in
                   ["justice", "judge", "hon", "coram", "before", "j."]):
                return name

    return "unknown"


def extract_defendant_age(text: str):
    patterns = [
        r'accused\s+aged?\s+(\d+)\s*years?',
        r'appellant\s+aged?\s+(\d+)\s*years?',
        r'(\d+)\s*years?\s+of\s+age',
        r'age[d]?\s+(\d+)\s*years?',
        r'aged\s+(\d+)',
    ]
    text_lower = text.lower()
    for pattern in patterns:
        match = re.search(pattern, text_lower)
        if match:
            age = int(match.group(1))
            if 15 <= age <= 80:
                return age
    return None


def extract_court_name(text: str):
    patterns = [
        r'IN\s+THE\s+HIGH\s+COURT\s+OF\s+([A-Z][A-Z\s]+?)(?:\s+AT\s+([A-Z]+))?(?:\n|\.)',
        r'HIGH\s+COURT\s+OF\s+([A-Z][A-Z\s]+)',
        r'IN\s+THE\s+([A-Z][A-Z\s]+COURT[A-Z\s]*)',
        r'([A-Z][A-Z\s]+SESSIONS\s+COURT)',
    ]
    for pattern in patterns:
        match = re.search(pattern, text[:500])
        if match:
            court = match.group(1).strip()
            if len(court) < 80:
                return court
    return "unknown"


def process_all_judgments(input_folder: str, output_csv: str):
    input_path = Path(input_folder)
    json_files = list(input_path.glob("*.json"))
    print(f"Found {len(json_files)} judgment files to process")

    results = []
    processed = 0
    failed = 0

    for i, json_file in enumerate(json_files):
        try:
            with open(json_file, "r", encoding="utf-8") as f:
                record = json.load(f)

            text = record.get("full_text", "")

            if not text or len(text) < 200:
                failed += 1
                continue

            sentence_years = extract_sentence_length(text)
            ipc_sections   = extract_ipc_sections(text)
            offense_type   = extract_offense_type(text, ipc_sections)
            bail_status    = extract_bail_status(text)
            judge_name     = extract_judge_name(text)
            defendant_age  = extract_defendant_age(text)
            court_name     = extract_court_name(text)

            row = {
                "doc_id":         record.get("doc_id", json_file.stem),
                "source":         record.get("source", "unknown"),
                "court":          court_name,
                "judge_name":     judge_name,
                "offense_type":   offense_type,
                "ipc_sections":   "|".join(ipc_sections),
                "sentence_years": sentence_years,
                "bail_status":    bail_status,
                "defendant_age":  defendant_age,
                "date":           record.get("date", ""),
                "summary":        record.get("summary", ""),
                "text_length":    len(text),
                "full_text":      text[:2000],
            }

            results.append(row)
            processed += 1

            if processed % 100 == 0:
                print(f"  Processed {processed}/{len(json_files)}...")

        except Exception as e:
            print(f"  Error on {json_file.name}: {e}")
            failed += 1
            continue

    df = pd.DataFrame(results)

    print(f"\nExtraction complete.")
    print(f"  Total processed: {processed}")
    print(f"  Failed/skipped:  {failed}")
    print(f"  Rows in dataset: {len(df)}")
    print(f"\nField coverage:")
    print(f"  sentence_years: {df['sentence_years'].notna().sum()} / {len(df)}")
    print(f"  judge_name:     {(df['judge_name'] != 'unknown').sum()} / {len(df)}")
    print(f"  offense_type:   {(df['offense_type'] != 'other').sum()} / {len(df)}")
    print(f"  bail_status:    {(df['bail_status'] != 'unknown').sum()} / {len(df)}")
    print(f"  defendant_age:  {df['defendant_age'].notna().sum()} / {len(df)}")

    output_path = Path(output_csv)
    output_path.parent.mkdir(exist_ok=True)
    df.to_csv(output_csv, index=False, encoding="utf-8")
    print(f"\nSaved to: {output_csv}")

    return df


if __name__ == "__main__":
    df = process_all_judgments(
        input_folder="data/criminal_cases",
        output_csv="data/processed/judgments_extracted.csv"
    )
    print("\nSample of extracted data:")
    print(df[["judge_name", "offense_type", "sentence_years",
              "bail_status", "defendant_age"]].head(15).to_string())