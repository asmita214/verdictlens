# VerdictLens — Judicial Intelligence Platform

> An NLP and ML powered transparency tool that analyzes real Indian High Court judgments, detects sentencing disparity across judges, and delivers explainable AI predictions for every case.

---

## Live Demo

| Service | Link |
|---------|------|
| Frontend | https://verdictlens.vercel.app |
| API Docs | https://verdictlens.onrender.com/docs |

---

## The Problem

The Indian judiciary has a documented sentencing disparity problem. Two people committing the same crime can receive wildly different sentences depending on which judge handles their case. Court judgments are publicly available as thousands of PDFs but nobody has systematically analyzed the patterns inside them.

VerdictLens makes judicial disparity visible — using real data, real models, and real explainability.

---

## Key Finding

> **Judge identity is the 3rd most important predictor of sentence severity — more important than bail status, defendant age, and court location.**

This was discovered through SHAP analysis on 852 real Indian High Court judgments.

---

## Features

- **Judge Anomaly Scoring** — ML-derived 0 to 100 anomaly scores for each judge based on deviation from expected sentencing patterns
- **Judgment Analyzer** — paste any court judgment text and get instant ML prediction with SHAP waterfall explanation
- **Case Similarity Search** — find historically similar cases from the real judgment database using TF-IDF vector matching
- **Bias Explorer** — global SHAP analysis showing which features drive sentencing outcomes system-wide
- **Judge Profiles** — detailed offense-wise breakdown with deviation analysis for each judge

---

## Data Pipeline

```
Step 1 — Data Collection
Indian High Court judgments streamed from HuggingFace
Immanuel30303/Indian-High-Court-Judgments-all (5.5M records)
Filtered to 2000 criminal cases using keyword matching
eCourts PDFs parsed using pdfplumber and pytesseract OCR as secondary source

Step 2 — Criminal Case Filtering
Keyword filter across all collected files
852 criminal cases retained from 8944 total
Filter criteria: sentenced, imprisonment, convicted, IPC, guilty

Step 3 — NER Extraction
regex patterns for sentence length, IPC sections, bail status
spaCy NER for judge names with High Court format support
CORAM and Honble pattern matching for Indian court formats
Output: structured CSV with 13 columns per judgment

Step 4 — Feature Engineering
Offense severity score from domain knowledge mapping
Number of IPC sections as complexity feature
Primary IPC section extraction
Binary flags: is_murder, bail_granted, court_known, judge_known
Label encoding for all categorical variables

Step 5 — Model Training
XGBoost classifier on 3 sentence severity categories
GridSearchCV across 324 hyperparameter combinations
SMOTE oversampling to handle class imbalance
Two-stage approach separating life imprisonment from fixed-term sentences

Step 6 — Explainability and Anomaly Detection
SHAP TreeExplainer for per-prediction feature attribution
Global feature importance analysis across all cases
Per-judge deviation scoring comparing actual vs predicted category
Anomaly score derived from deviation distribution per judge
```

---

## ML Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| NER Extraction | spaCy + regex | Extract structured fields from judgment text |
| Classification | XGBoost | Predict sentence severity category |
| Tuning | GridSearchCV | Find optimal hyperparameters across 324 combinations |
| Imbalance | SMOTE | Oversample minority classes for balanced training |
| Explainability | SHAP TreeExplainer | Per-prediction feature attribution |
| Anomaly Detection | Deviation scoring | Flag statistically abnormal judges |
| Similarity Search | TF-IDF cosine similarity | Find similar historical cases |

---

## SHAP Analysis Results

Top features driving severe sentencing by importance:

| Rank | Feature | SHAP Importance |
|------|---------|----------------|
| 1 | is_murder | 0.55 |
| 2 | num_ipc_sections | 0.32 |
| 3 | judge_encoded | 0.17 |
| 4 | ipc_encoded | 0.14 |
| 5 | court_known | 0.12 |
| 6 | defendant_age | 0.08 |
| 7 | bail_granted | 0.07 |
| 8 | offense_encoded | 0.07 |

Judge identity ranks 3rd above bail status, defendant age, and court location. For medium-range sentences specifically, judge identity is the single most important factor surpassing even offense type.

---

## Judge Anomaly Scores

| Judge | Cases | Anomaly Score | Pattern |
|-------|-------|--------------|---------|
| R.R. JAIN | 5 | 100 | Sentences 0.6 categories below expected |
| H.J. Umrigar | 7 | 47.7 | Sentences 0.3 categories above expected |
| Frank Anthony | 4 | 41.7 | Sentences 0.25 categories above expected |
| A.N. DIVECHA | 21 | 31.7 | Sentences 0.19 categories below expected |
| Basudeo Sahai | 3 | 0.0 | Matches model predictions exactly |

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/judges/` | All judges with anomaly scores ranked by deviation |
| GET | `/judges/{name}` | Individual judge profile with offense breakdown |
| POST | `/analyze/` | Analyze judgment text and return prediction with SHAP |
| POST | `/search/` | Find top 5 similar historical cases |
| GET | `/health` | API health check |

---

## Tech Stack

**Backend**
- FastAPI with automatic OpenAPI documentation
- Pydantic for request and response validation
- uvicorn ASGI server
- CORS middleware for cross-origin requests

**Frontend**
- React 18 with Vite
- Tailwind CSS for styling
- Recharts for data visualization
- Framer Motion for animations

**Deployment**
- Backend on Render
- Frontend on Vercel
- GitHub for version control and automatic redeployment on push

---

## Data Sources

- **Primary** — Immanuel30303/Indian-High-Court-Judgments-all on HuggingFace with 5.5 million High Court judgment records streamed and filtered for criminal cases
- **Secondary** — eCourts public portal PDFs parsed with pdfplumber and pytesseract OCR
- **Final dataset** — 852 criminal cases with complete NLP-extracted features

---

## Run Locally

### Backend

```bash
git clone https://github.com/asmita214/verdictlens.git
cd verdictlens/backend

python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac and Linux

pip install -r requirements.txt
uvicorn api.main:app --reload --port 8000
```

API runs at http://localhost:8000
Documentation at http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

No environment variables needed locally. The frontend automatically connects to localhost:8000 when VITE_API_URL is not set.

---

## Disclaimer

This project is built for research and educational purposes. Anomaly scores surface statistical patterns that may deserve scrutiny — they do not constitute legal findings or accusations of misconduct against any individual. All data used is publicly available from government sources.
