# Career Recommender API (FastAPI)

### 📦 How to Run

1. Clone/download project
2. Place model files in `/app`
3. Install dependencies:
    pip install -r requirements.txt

4. Start server:
    uvicorn app.main:app --reload

5. Visit Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 📬 Endpoint

- `POST /recommend`
```json
{
"skills": ["python", "sql"],
"interests": ["ai", "analytics"]
}

Returns:
    career predictions
    top 5 matched jobs from LinkedIn JSON


