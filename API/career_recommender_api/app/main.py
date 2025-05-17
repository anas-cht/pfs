# main.py (FastAPI Career Recommendation API)

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle
import json
from typing import List
from app import (
    load_glove_embeddings,
    get_student_vector,
    predict_student,
    recommend_jobs,
)


# ---- Define Input Schema ----
class StudentInput(BaseModel):
    skills: List[str]
    interests: List[str]


# ---- Load Model and Jobs ----
with open("app/career_model.pkl", "rb") as f:
    model_data = pickle.load(f)


glove = load_glove_embeddings(model_data["glove_embeddings_path"])
centroids = model_data["centroids"]
career_keywords = model_data["career_keywords"]
careers = list(career_keywords.keys())

with open("app/linkedin_jobs__morocco_20250516_165349.json", "r", encoding="utf-8") as f:
    job_data = json.load(f)

# ---- Create FastAPI App ----
app = FastAPI()


@app.post("/recommend")
def recommend(input: StudentInput):
    # Generate student embedding
    student_vec = get_student_vector(input.skills, input.interests, glove)
    
    # Predict career probabilities
    prediction = predict_student(student_vec, centroids, careers)
    
    # Select top career based on max percentage
    top_career = max(prediction, key=prediction.get)
    
    # Recommend jobs using cosine similarity
    jobs = recommend_jobs(student_vec, job_data, glove)

    # Return both career and job list
    return {
        "career_recommendation": {
            "top": top_career,
            "all": prediction
        },
        "job_matches": jobs
    }

