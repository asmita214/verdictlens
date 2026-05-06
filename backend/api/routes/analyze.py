from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import re
import numpy as np
import shap
import pandas as pd

router = APIRouter(prefix="/analyze", tags=["Analysis"])

data = {}

def set_data(loaded_data: dict):
    global data
    data = loaded_data


class JudgmentRequest(BaseModel):
    text: str


class AnalysisResponse(BaseModel):
    judge_name:          str
    offense_type:        str
    ipc_sections:        list
    predicted_category:  str
    confidence:          float
    deviation_flag:      bool
    shap_explanation:    list
    anomaly_score:       float
    summary:             str


SENTENCE_PATTERNS = [
    r'sentenced?\s+to\s+(\d+)\s*years?',
    r'imprisonment\s+for\s+(\d+)\s*years?',
    r'rigorous\s+imprisonment\s+(?:for\s+)?(\d+)\s*years?',
    r'(\d+)\s*years?\s+(?:rigorous\s+)?imprisonment',
    r'sentence\s+of\s+(\d+)\s*years?',
    r'(\d+)\s*years?\s+r\.i\.',
]

WORD_TO_NUM = {
    "one": 1, "two": 2, "three": 3, "four": 4,
    "five": 5, "six": 6, "seven": 7, "eight": 8,
    "nine": 9, "ten": 10, "life": 20
}

IPC_PATTERNS = [
    r'[Ss]ection\s+(\d+[A-Za-z]?)\s+IPC',
    r'u/s\s+(\d+[A-Za-z]?)\s+IPC',
    r'under\s+[Ss]ection\s+(\d+[A-Za-z]?)',
]

OFFENSE_MAP = {
    "murder":     ["murder", "culpable homicide", "302", "304"],
    "robbery":    ["robbery", "dacoity", "392", "393", "394", "395"],
    "assault":    ["assault", "hurt", "323", "324", "325", "326"],
    "fraud":      ["fraud", "cheating", "420", "417", "468"],
    "theft":      ["theft", "stolen", "379", "380", "381"],
    "rape":       ["rape", "sexual assault", "376"],
    "kidnapping": ["kidnapping", "abduction", "363", "364", "365"],
    "drug":       ["narcotic", "drug", "ndps"],
}

IPC_TO_OFFENSE = {
    "302": "murder",  "304": "murder",
    "392": "robbery", "393": "robbery",
    "323": "assault", "324": "assault", "325": "assault",
    "420": "fraud",   "417": "fraud",
    "379": "theft",   "380": "theft",
    "376": "rape",
    "363": "kidnapping",
}

OFFENSE_SEVERITY = {
    'murder': 10, 'rape': 9, 'robbery': 7,
    'kidnapping': 6, 'drug': 5, 'assault': 4,
    'theft': 3, 'fraud': 2, 'unknown': 5
}

HONBLE_PATTERN = re.compile(
    r"Hon['\"]?ble\s+(?:Mr\.?\s+)?(?:Justice\s+)?([A-Z][a-zA-Z\s\.]+?)(?:,\s*J\.|\s+J\.)"
)
CORAM_PATTERN = re.compile(
    r"CORAM\s*:\s*([A-Z][A-Z\s\.\,&]+?)(?:JJ\.|J\.|$)"
)


def extract_features_from_text(text: str) -> dict:
    text_lower = text.lower()

    ipc_sections = []
    for pattern in IPC_PATTERNS:
        matches = re.findall(pattern, text)
        ipc_sections.extend(matches)
    ipc_sections = list(set(ipc_sections))

    offense_type = "unknown"
    for section in ipc_sections:
        clean = re.sub(r'[A-Za-z]', '', section)
        if clean in IPC_TO_OFFENSE:
            offense_type = IPC_TO_OFFENSE[clean]
            break
    if offense_type == "unknown":
        for offense, keywords in OFFENSE_MAP.items():
            if any(kw in text_lower for kw in keywords):
                offense_type = offense
                break

    sentence_years = None
    for pattern in SENTENCE_PATTERNS:
        match = re.search(pattern, text_lower)
        if match:
            val = match.group(1)
            if val.isdigit() and 1 <= int(val) <= 25:
                sentence_years = float(val)
                break
            elif val in WORD_TO_NUM:
                sentence_years = float(WORD_TO_NUM[val])
                break
    if "life imprisonment" in text_lower:
        sentence_years = 20.0

    judge_name = "unknown"
    coram = CORAM_PATTERN.search(text[:800])
    if coram:
        judge_name = coram.group(1).strip().rstrip(',& ')
    else:
        honble = HONBLE_PATTERN.search(text[:800])
        if honble:
            judge_name = honble.group(1).strip()

    bail_granted = 0
    if re.search(r'bail\s+(?:is\s+)?(granted|allowed)', text_lower):
        bail_granted = 1

    num_ipc    = len(ipc_sections)
    primary_ipc = ipc_sections[0] if ipc_sections else "0"

    return {
        "judge_name":     judge_name,
        "offense_type":   offense_type,
        "ipc_sections":   ipc_sections,
        "sentence_years": sentence_years,
        "bail_granted":   bail_granted,
        "num_ipc":        num_ipc,
        "primary_ipc":    primary_ipc,
    }


def encode_features(extracted: dict) -> pd.DataFrame:
    encoders = data["encoders"]
    features = data["features"]

    offense  = extracted["offense_type"]
    judge    = extracted["judge_name"]
    primary  = extracted["primary_ipc"]

    def safe_encode(encoder, value):
        if value in encoder.classes_:
            return encoder.transform([value])[0]
        elif 'unknown' in encoder.classes_:
            return encoder.transform(['unknown'])[0]
        else:
            return 0

    row = {
        "offense_encoded":  safe_encode(encoders['offense'], offense),
        "offense_severity": OFFENSE_SEVERITY.get(offense, 5),
        "bail_granted":     extracted["bail_granted"],
        "court_encoded":    0,
        "judge_encoded":    safe_encode(encoders['judge'], judge),
        "ipc_encoded":      safe_encode(encoders['ipc'], primary),
        "num_ipc_sections": extracted["num_ipc"],
        "is_murder":        int(offense == "murder"),
        "court_known":      0,
        "judge_known":      int(judge != "unknown"),
        "defendant_age":    30.0,
    }

    return pd.DataFrame([row])[features]


@router.post("/", response_model=AnalysisResponse)
def analyze_judgment(request: JudgmentRequest):
    text = request.text.strip()

    if len(text) < 100:
        raise HTTPException(
            status_code=400,
            detail="Text too short. Please provide full judgment text."
        )

    extracted     = extract_features_from_text(text)
    X_new         = encode_features(extracted)
    model         = data["model"]
    categories    = data["categories"]

    pred_category = int(model.predict(X_new)[0])
    pred_proba    = model.predict_proba(X_new)[0]
    confidence    = float(pred_proba[pred_category])
    category_name = categories[str(pred_category)]

    explainer         = shap.TreeExplainer(model)
    shap_vals         = explainer.shap_values(X_new)
    feature_names     = data["features"]
    shap_explanation  = []

    for i, fname in enumerate(feature_names):
        shap_explanation.append({
            "feature":    fname,
            "value":      float(X_new.iloc[0][fname]),
            "shap_value": float(shap_vals[0][i][pred_category]),
            "direction":  "increases" if shap_vals[0][i][pred_category] > 0
                          else "decreases"
        })

    shap_explanation.sort(
        key=lambda x: abs(x["shap_value"]),
        reverse=True
    )

    anomaly_score = 0.0
    judge_scores  = data["judge_scores"]
    judge_name    = extracted["judge_name"]

    if judge_name != "unknown":
        match = judge_scores[
            judge_scores['judge_name'].str.lower() == judge_name.lower()
        ]
        if len(match) > 0:
            anomaly_score = float(match['anomaly_score'].values[0])

    summary = (
        f"This {extracted['offense_type']} case was predicted as a "
        f"{category_name} sentence. "
        f"The top factor was {shap_explanation[0]['feature'].replace('_', ' ')} "
        f"which {shap_explanation[0]['direction']} the predicted severity. "
    )
    if judge_name != "unknown":
        summary += f"Judge {judge_name} has an anomaly score of {anomaly_score:.0f}/100."

    actual         = extracted["sentence_years"]
    deviation_flag = False
    if actual is not None:
        def cat(y):
            if y <= 3:   return 0
            elif y <= 7: return 1
            else:        return 2
        deviation_flag = abs(cat(actual) - pred_category) >= 1

    return AnalysisResponse(
        judge_name         = judge_name,
        offense_type       = extracted["offense_type"],
        ipc_sections       = extracted["ipc_sections"],
        predicted_category = category_name,
        confidence         = round(confidence, 3),
        deviation_flag     = deviation_flag,
        shap_explanation   = shap_explanation,
        anomaly_score      = anomaly_score,
        summary            = summary,
    )