from fastapi import APIRouter, HTTPException
import pandas as pd
import numpy as np

# APIRouter is like a mini FastAPI app
# we use it to group related endpoints together
# all judge related endpoints live here
router = APIRouter(prefix="/judges", tags=["Judges"])

# this will hold our loaded data
# it gets set when the app starts
data = {}

def set_data(loaded_data: dict):
    """Called once at startup to set the shared data"""
    global data
    data = loaded_data


@router.get("/")
def get_all_judges():
    """
    Returns list of all judges with their anomaly scores.
    React homepage calls this to show the judge cards.
    """
    judge_scores = data["judge_scores"]

    # remove unknown judges from the list
    judge_scores = judge_scores[
        judge_scores['judge_name'] != 'unknown'
    ].copy()

    # sort by anomaly score highest first
    judge_scores = judge_scores.sort_values(
        'anomaly_score', ascending=False
    )

    judges_list = []

    for _, row in judge_scores.iterrows():
        judges_list.append({
            "name":          row['judge_name'],
            "cases":         int(row['cases']),
            "anomaly_score": float(row['anomaly_score']),
            "mean_deviation": float(row['mean_deviation']),
            "verdict":       get_verdict(float(row['anomaly_score'])),
            "flag":          float(row['anomaly_score']) > 70
        })

    return {
        "total":   len(judges_list),
        "judges":  judges_list
    }


@router.get("/{judge_name}")
def get_judge_profile(judge_name: str):
    """
    Returns detailed profile of one specific judge.
    React judge profile page calls this.
    """
    predictions = data["predictions"]
    judge_scores = data["judge_scores"]

    # find this judge's cases
    judge_cases = predictions[
        predictions['judge_name'].str.lower() == judge_name.lower()
    ]

    if len(judge_cases) == 0:
        raise HTTPException(
            status_code=404,
            detail=f"Judge {judge_name} not found"
        )

    # get anomaly score
    score_row = judge_scores[
        judge_scores['judge_name'].str.lower() == judge_name.lower()
    ]

    anomaly_score = float(score_row['anomaly_score'].values[0]) \
        if len(score_row) > 0 else 0.0

    # offense breakdown for this judge
    offense_breakdown = judge_cases.groupby('offense_type').agg(
        count=('sentence_years', 'count'),
        avg_sentence=('sentence_years', 'mean')
    ).round(2).to_dict('index')

    # recent cases
    recent = judge_cases.tail(10)[
        ['offense_type', 'sentence_years',
         'predicted_category', 'category_deviation']
    ].to_dict('records')

    return {
        "name":              judge_name,
        "total_cases":       len(judge_cases),
        "anomaly_score":     anomaly_score,
        "verdict":           get_verdict(anomaly_score),
        "mean_deviation":    float(judge_cases['category_deviation'].mean()),
        "offense_breakdown": offense_breakdown,
        "recent_cases":      recent,
    }


def get_verdict(score: float) -> str:
    """
    Converts anomaly score number into a human readable label.
    This shows on judge profile cards in the UI.
    """
    if score >= 70:   return "High Anomaly"
    elif score >= 40: return "Moderate Deviation"
    elif score >= 20: return "Slight Deviation"
    else:             return "Normal Pattern"