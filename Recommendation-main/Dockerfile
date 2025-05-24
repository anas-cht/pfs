# Dockerfile in /ai-model-3
FROM python:3.11 AS model3
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8002"]