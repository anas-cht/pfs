# Career Recommender API (FastAPI)

###  How to Run

1. Clone/download project
2. Place model files in `/app`
3. Install dependencies:
    pip install -r requirements.txt

4. Start server:
    uvicorn app.main:app --reload

5. Visit Swagger docs: [http://localhost:8000/docs](http://localhost:8000/docs)

###  Endpoint

- `POST /recommend`

- `Request Body`
Send a POST request to /recommend with a JSON payload like this:

{
  "skills": ["python", "sql"],
  "interests": ["ai", "analytics"]
}


- `Response`
The API will return career predictions and the top 5 matched jobs from LinkedIn. A sample response looks like this:

{
  "career_predictions": [
    "Data Scientist",
    "AI Engineer",
    "Machine Learning Specialist",
    "Data Analyst",
    "Software Engineer"
  ],
  "top_5_jobs": [
    {
      "title": "Data Scientist",
      "company": "Company A",
      "location": "New York, NY",
      "url": "https://linkedin.com/job/12345"
    },
    {
      "title": "AI Engineer",
      "company": "Company B",
      "location": "San Francisco, CA",
      "url": "https://linkedin.com/job/67890"
    },
    // ... other jobs
  ]
}


### 
If you encounter issues related to large file uploads or missing model files, ensure that you have placed all required files (career_model.pkl, glove.6B.100d.txt, etc.) in the /app directory.