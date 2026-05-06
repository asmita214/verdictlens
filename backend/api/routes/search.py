from fastapi import APIRouter
from pydantic import BaseModel
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

router = APIRouter(prefix="/search", tags=["Search"])

data = {}
vectorizer = None
tfidf_matrix = None

def set_data(loaded_data: dict):
    global data, vectorizer, tfidf_matrix

    data = loaded_data
    predictions = loaded_data["predictions"]

    # build corpus using offense_type only
    # TF-IDF converts text into numbers based on word frequency
    # similar cases will have similar vectors
    # cosine similarity measures how close two vectors are
    corpus = (
        predictions['offense_type']
        .fillna("unknown")
        .astype(str)
        .tolist()
    )

    vectorizer   = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(corpus)

    print(f"  search index built: {tfidf_matrix.shape}")


class SearchRequest(BaseModel):
    query: str
    top_k: int = 5


@router.post("/")
def find_similar_cases(request: SearchRequest):
    """
    Takes a query describing a case.
    Returns top 5 most similar historical cases.
    """
    predictions = data["predictions"]
    categories  = data["categories"]

    # convert query to TF-IDF vector
    query_vec = vectorizer.transform([request.query])

    # calculate similarity between query and all cases
    similarities = cosine_similarity(
        query_vec, tfidf_matrix
    ).flatten()

    # get top K most similar indices
    top_indices = similarities.argsort()[-request.top_k:][::-1]

    results = []
    for idx in top_indices:
        row = predictions.iloc[idx]

        # safely get predicted category name
        try:
            pred_cat = categories.get(
                str(int(row['predicted_category'])), "unknown"
            )
        except:
            pred_cat = "unknown"

        results.append({
            "rank":               len(results) + 1,
            "similarity_score":   round(float(similarities[idx]), 3),
            "judge_name":         str(row['judge_name']),
            "offense_type":       str(row['offense_type']),
            "sentence_years":     float(row['sentence_years']),
            "predicted_category": pred_cat,
            "deviation":          float(row['category_deviation']),
        })

    return {
        "query":   request.query,
        "results": results
    }