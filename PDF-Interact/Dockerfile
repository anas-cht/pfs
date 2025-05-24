# Dockerfile in /ai-model-2
FROM python:3.11 AS model2
WORKDIR /app
COPY . .
RUN pip install -r requirements.txt
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001"]