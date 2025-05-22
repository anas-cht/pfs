from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import pandas as pd
from recommendation_engine import load_data, hybrid_recommendations  
import logging

# Initialize logging
logging.basicConfig(level=logging.INFO)

# Load data once at startup
courses_df, ratings_df = load_data()
print("Columns in ratings_df:", ratings_df.columns.tolist())


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserRequest(BaseModel):
    user_id: int
    n_recommendations: int = 10

class RecommendationResponse(BaseModel):
    title: str
    provider: str
    skills: str
    rating: float
    course_link: str

@app.post("/recommendations/hybrid", response_model=List[RecommendationResponse])
def get_hybrid_recommendations(user_req: UserRequest):
    if user_req.user_id not in ratings_df['UserID'].unique():
        raise HTTPException(status_code=404, detail="User ID not found")

    try:
        result_df = hybrid_recommendations(
            user_req.user_id, courses_df, ratings_df, user_req.n_recommendations
        )

        # Option 1: Update keys before returning
        result_df = result_df.rename(columns={
            "Title": "title",
            "Provider": "provider",
            "Skills": "skills",
            "Rating": "rating",
            "Course Link": "course_link"
        })

        return result_df.to_dict(orient="records")
    except Exception as e:
        logging.error(f"Error generating recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))



if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8002, reload=True)