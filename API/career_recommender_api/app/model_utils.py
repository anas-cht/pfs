import numpy as np
from sklearn.preprocessing import normalize
from sklearn.metrics.pairwise import cosine_similarity

# ---- Load GloVe Embeddings ----
def load_glove_embeddings(glove_file_path='app/glove.6B.100d.txt', dim=100):
    embeddings = {}
    with open('app/glove.6B.100d.txt', 'r', encoding='utf-8') as f:
        for line in f:
            values = line.strip().split()
            word = values[0]
            vector = np.array(values[1:], dtype=np.float32)
            if len(vector) == dim:
                embeddings[word] = vector
    return embeddings

# ---- Student Vectorization ----
def get_student_vector(skills, interests, embeddings, dim=100):
    skill_weight = 2.0
    interest_weight = 1.0

    processed_skills = [w for term in skills for w in term.lower().split()]
    processed_interests = [w for term in interests for w in term.lower().split()]

    skill_vectors = [embeddings[w] * skill_weight for w in processed_skills if w in embeddings]
    interest_vectors = [embeddings[w] * interest_weight for w in processed_interests if w in embeddings]

    if not skill_vectors and not interest_vectors:
        return np.zeros(dim)

    combined = skill_vectors + interest_vectors
    mean_vector = np.mean(combined, axis=0)
    return normalize(mean_vector.reshape(1, -1))[0]

# ---- Predict Career ----
def predict_student(student_vec, centroids, careers, m=1.5):
    distances = np.linalg.norm(student_vec - centroids, axis=1)
    distances = np.maximum(distances, 1e-10)

    temperature = 0.3
    exp_scores = np.exp(-distances / temperature)
    percentages = exp_scores / exp_scores.sum()
    percentages = np.maximum(percentages, 0.05)
    percentages /= percentages.sum()

    return {career: round(float(p) * 100, 2) for career, p in zip(careers, percentages)}

# ---- Recommend Jobs ----
def recommend_jobs(student_vec, job_data, embeddings, top_n=5):
    scored_jobs = []
    for job in job_data:
        job_text = job['job_title'] + ' ' + str(job.get('skills', ''))     # + ' ' + job.get('description', '') + 
        job_vec = get_student_vector([job_text], [], embeddings)
        score = cosine_similarity([student_vec], [job_vec])[0][0]
        scored_jobs.append((score, job))
    
    # Sort jobs by similarity score
    scored_jobs.sort(reverse=True, key=lambda x: x[0])
    
    # Return top N
    return [job for _, job in scored_jobs[:top_n]]

