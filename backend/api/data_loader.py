import pickle
import json
import pandas as pd
from pathlib import Path

# path to your saved model files
SAVED_DIR = Path("models/saved")

def load_all():
    """
    Loads everything once when API starts.
    Returns a dict with all models and data.
    """

    print("Loading model files...")

    # load trained XGBoost model
    with open(SAVED_DIR / "verdict_model.pkl", "rb") as f:
        model = pickle.load(f)
    print("  model loaded")

    # load label encoders
    with open(SAVED_DIR / "encoders.pkl", "rb") as f:
        encoders = pickle.load(f)
    print("  encoders loaded")

    # load feature list
    with open(SAVED_DIR / "features.json", "r") as f:
        features = json.load(f)
    print("  features loaded")

    # load category names
    with open(SAVED_DIR / "categories.json", "r") as f:
        categories = json.load(f)
    print("  categories loaded")

    # load judge anomaly scores
    judge_scores = pd.read_csv(SAVED_DIR / "judge_anomaly_scores.csv")
    print("  judge scores loaded")

    # load all predictions
    predictions = pd.read_csv(SAVED_DIR / "predictions.csv")
    print("  predictions loaded")

    print("All files loaded successfully")

    return {
        "model":        model,
        "encoders":     encoders,
        "features":     features,
        "categories":   categories,
        "judge_scores": judge_scores,
        "predictions":  predictions,
    }