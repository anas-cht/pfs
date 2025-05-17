import numpy as np
import random
import matplotlib.pyplot as plt
from sklearn.manifold import TSNE
from sklearn.preprocessing import normalize
import requests
import os
from zipfile import ZipFile
from io import BytesIO
import pickle
import json

# ----------------------------
# 1. Download and Load GloVe embeddings
# ----------------------------
def download_glove_embeddings():
    glove_url = 'http://nlp.stanford.edu/data/glove.6B.zip'
    glove_file = 'glove.6B.100d.txt'
    
    if not os.path.exists(glove_file):
        print("Downloading GloVe embeddings...")
        response = requests.get(glove_url)
        with ZipFile(BytesIO(response.content)) as z:
            with z.open(glove_file) as f:
                content = f.read().decode('utf-8')
        with open(glove_file, 'w', encoding='utf-8') as f:
            f.write(content)
        print("Download complete!")
    else:
        print("GloVe embeddings already downloaded")

def load_glove_embeddings(glove_file_path='glove.6B.100d.txt', dim=100):
    embeddings = {}
    with open(glove_file_path, 'r', encoding='utf-8') as f:
        for line in f:
            values = line.strip().split()
            word = values[0]
            vector = np.array(values[1:], dtype=np.float32)
            if len(vector) == dim:
                embeddings[word] = vector
    return embeddings

# ----------------------------
# 2. Enhanced student vectorization
# ----------------------------
def get_student_vector(skills, interests, embeddings, dim=100):
    # Weight skills more heavily than interests
    skill_weight = 2.0
    interest_weight = 1.0
    
    # Process multi-word terms
    processed_skills = []
    for term in skills:
        processed_skills.extend(term.lower().split())
    
    processed_interests = []
    for term in interests:
        processed_interests.extend(term.lower().split())
    
    # Get weighted vectors
    skill_vectors = []
    for word in processed_skills:
        if word in embeddings:
            skill_vectors.append(embeddings[word] * skill_weight)
    
    interest_vectors = []
    for word in processed_interests:
        if word in embeddings:
            interest_vectors.append(embeddings[word] * interest_weight)
    
    if not skill_vectors and not interest_vectors:
        return np.zeros(dim)
    
    combined_vectors = skill_vectors + interest_vectors
    mean_vector = np.mean(combined_vectors, axis=0)
    return normalize(mean_vector.reshape(1, -1))[0]  # L2 normalize

# ----------------------------
# 3. Improved KMeans++ initialization
# ----------------------------
def initialize_centroids(X, k):
    centroids = []
    # First centroid: point with highest density
    distances = np.array([np.sum(np.linalg.norm(X - x, axis=1)) for x in X])
    centroids.append(X[np.argmin(distances)])
    
    for _ in range(1, k):
        dists = np.array([np.min([np.linalg.norm(x - centroid)**2 for centroid in centroids]) for x in X])
        probs = dists / np.sum(dists)
        new_centroid_idx = np.argmax(dists)  # Farthest point
        centroids.append(X[new_centroid_idx])
    return np.array(centroids)

# ----------------------------
# 4. Optimized Fuzzy KMeans
# ----------------------------
def train_fuzzy_kmeans(X, k, career_keywords, embeddings, max_epochs=100, tol=1e-5, m=1.5):
    # Initialize with career keywords
    initial_centroids = []
    for keywords in career_keywords.values():
        vec = get_student_vector(keywords, [], embeddings)
        initial_centroids.append(vec)
    initial_centroids = np.array(initial_centroids)
    
    # Start with career-guided centroids
    centroids = initial_centroids.copy()
    best_centroids = centroids.copy()
    min_shift = float('inf')
    
    for epoch in range(max_epochs):
        # Regularized distances
        distances = np.linalg.norm(X[:, np.newaxis] - centroids, axis=2)
        distances = np.maximum(distances, 1e-10)
        
        # Fuzzy membership calculation
        weights = distances ** (-2/(m-1))
        memberships = weights / weights.sum(axis=1, keepdims=True)
        
        # Update centroids (80% data-driven, 20% career-guided)
        new_centroids = 0.8 * (memberships.T @ X) / memberships.sum(axis=0)[:, np.newaxis]
        new_centroids += 0.2 * initial_centroids
        
        shift = np.linalg.norm(new_centroids - centroids)
        
        if shift < min_shift:
            min_shift = shift
            best_centroids = new_centroids.copy()
        
        print(f"Epoch {epoch+1:3d} | Shift: {shift:.6f} | Best: {min_shift:.6f}")
        
        if shift < tol:
            break
            
        centroids = new_centroids
    
    return best_centroids, career_keywords  # Now returns both components

# ----------------------------
# 5. Enhanced Prediction
# ----------------------------
def predict_student(student_vec, centroids, careers, m=1.5):
    distances = np.linalg.norm(student_vec - centroids, axis=1)
    distances = np.maximum(distances, 1e-10)
    
    # Sharp temperature scaling
    temperature = 0.3
    exp_scores = np.exp(-distances / temperature)
    percentages = exp_scores / exp_scores.sum()
    
    # Apply minimum threshold (5%) and renormalize
    percentages = np.maximum(percentages, 0.05)
    percentages = percentages / percentages.sum()
    
    results = {career: round(float(percent)*100, 2) 
              for career, percent in zip(careers, percentages)}
    return dict(sorted(results.items(), key=lambda item: item[1], reverse=True))

# ----------------------------
# 6. Visualization
# ----------------------------
def visualize_clusters(X, centroids, careers):
    combined = np.vstack([X, centroids])
    perplexity = min(30, len(combined)-1)
    
    tsne = TSNE(n_components=2, random_state=42, perplexity=perplexity)
    combined_2d = tsne.fit_transform(combined)
    
    X_2d = combined_2d[:-len(centroids)]
    centroids_2d = combined_2d[-len(centroids):]

    plt.figure(figsize=(12, 8))
    
    # Plot students
    plt.scatter(X_2d[:, 0], X_2d[:, 1], c='blue', alpha=0.6, label='Students')
    
    # Plot centroids with distinct styles
    markers = ['*', 's', 'D', 'P', 'X']
    colors = ['red', 'green', 'purple', 'orange', 'brown']
    sizes = [400, 350, 350, 350, 350]
    
    for idx, career in enumerate(careers):
        plt.scatter(centroids_2d[idx, 0], centroids_2d[idx, 1],
                   c=colors[idx], marker=markers[idx], s=sizes[idx],
                   edgecolor='black', linewidth=1.5,
                   label=f'{career} Center')
        
        plt.annotate(career, (centroids_2d[idx, 0], centroids_2d[idx, 1]),
                     fontsize=12, weight='bold', color=colors[idx],
                     bbox=dict(facecolor='white', alpha=0.8, edgecolor='none'))

    plt.title("Career Clustering Visualization (t-SNE)", fontsize=14)
    plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.show()

# ----------------------------
# 7. Model Saving/Loading
# ----------------------------
def save_model(centroids, career_keywords, glove_embeddings_path, model_path='career_model.pkl'):
    model_data = {
        'centroids': centroids,
        'career_keywords': career_keywords,
        'glove_embeddings_path': glove_embeddings_path
    }
    
    with open(model_path, 'wb') as f:
        pickle.dump(model_data, f)
    print(f"Model saved to {model_path}")

def load_model(model_path='career_model.pkl'):
    with open(model_path, 'rb') as f:
        model_data = pickle.load(f)
    
    # The embeddings need to be loaded separately
    glove_embeddings = load_glove_embeddings(model_data['glove_embeddings_path'])
    
    return {
        'centroids': model_data['centroids'],
        'career_keywords': model_data['career_keywords'],
        'embeddings': glove_embeddings
    }

def predict_with_saved_model(student_skills, student_interests, model_path='career_model.pkl'):
    # Load model
    model = load_model(model_path)
    
    # Get student vector
    student_vec = get_student_vector(student_skills, student_interests, model['embeddings'])
    
    # Predict
    predictions = predict_student(student_vec, model['centroids'], list(model['career_keywords'].keys()))
    
    return predictions

# ----------------------------
# 8. Main Execution
# ----------------------------
def main():
    download_glove_embeddings()
    glove_file_path = 'glove.6B.100d.txt'
    glove_embeddings = load_glove_embeddings(glove_file_path)
    
    # Enhanced student data
    students = [
        {"name": "AI Student", "skills": ["Python", "TensorFlow", "Deep Learning"], 
         "interests": ["Neural Networks", "Machine Learning"]},
        {"name": "Cyber Student", "skills": ["Linux", "Wireshark", "Encryption"], 
         "interests": ["Security", "Penetration Testing"]},
        {"name": "Cloud Student", "skills": ["AWS", "Docker", "Kubernetes"], 
         "interests": ["DevOps", "Scalability"]},
        {"name": "Data Student", "skills": ["Python", "Pandas", "Statistics"], 
         "interests": ["Analysis", "Visualization"]},
        {"name": "Dev Student", "skills": ["JavaScript", "React", "Node"], 
         "interests": ["Web Development", "APIs"]},
        {"name": "AI Student 2", "skills": ["PyTorch", "NLP", "Algorithms"], 
         "interests": ["Computer Vision", "AI Research"]},
        {"name": "Cyber Student 2", "skills": ["Firewall", "Kali", "Forensics"], 
         "interests": ["Ethical Hacking", "Cyber Defense"]},
        {"name": "Cloud Student 2", "skills": ["Azure", "Terraform", "CI/CD"], 
         "interests": ["Infrastructure", "Cloud Security"]},
        {"name": "Data Student 2", "skills": ["SQL", "R", "Machine Learning"], 
         "interests": ["Data Mining", "Big Data"]},
        {"name": "Dev Student 2", "skills": ["Java", "Spring", "Microservices"], 
         "interests": ["Backend", "System Design"]}
    ]

    # Career definitions with more specific keywords
    career_keywords = {
        "AI/ML Engineer": ["neural", "machine", "deep", "tensor", "pytorch", "algorithm", 
                          "vision", "nlp", "convolutional", "transformer", "reinforcement"],
        "Cybersecurity": ["security", "penetration", "firewall", "encryption", "hacking",
                         "forensics", "kali", "malware", "vulnerability", "intrusion", "audit"],
        "Cloud Engineer": ["cloud", "aws", "azure", "docker", "kubernetes", "devops",
                          "infrastructure", "serverless", "terraform", "microservices", "scalability"],
        "Data Scientist": ["data", "analysis", "statistics", "visualization", "pandas",
                          "mining", "bigdata", "regression", "clustering", "hypothesis", "experiment"],
        "Software Developer": ["code", "development", "programming", "application", "debugging",
                             "web", "backend", "frontend", "api", "database", "framework"]
    }

    # Prepare student vectors
    student_vectors = np.array([
        get_student_vector(s["skills"], s["interests"], glove_embeddings)
        for s in students
    ])

    # Train and save model
    centroids, career_keywords = train_fuzzy_kmeans(
        student_vectors,
        k=len(career_keywords),
        career_keywords=career_keywords,
        embeddings=glove_embeddings,
        m=1.5
    )
    
    save_model(centroids, career_keywords, glove_file_path)

    # Test predictions with original model
    test_cases = [
        ("AI Focused", ["Deep Learning", "Python", "Neural Networks"], ["AI Research", "Computer Vision"]),
        ("Cyber Focused", ["Kali Linux", "Encryption", "Network Security"], ["Ethical Hacking", "Forensics"]),
        ("Cloud Focused", ["AWS", "Terraform", "Serverless"], ["Cloud Architecture", "DevOps"]),
        ("Data Focused", ["Pandas", "SQL", "Data Mining"], ["Business Intelligence", "Analytics"]),
        ("Dev Focused", ["JavaScript", "React", "APIs"], ["Web Applications", "Frontend"])
    ]

    print("\n=== Career Recommendations (Original Model) ===")
    for name, skills, interests in test_cases:
        vec = get_student_vector(skills, interests, glove_embeddings)
        predictions = predict_student(vec, centroids, list(career_keywords.keys()))
        print(f"\n{name}:")
        for career, percent in predictions.items():
            print(f"{career}: {percent}%")

    # Test predictions with saved model
    print("\n=== Career Recommendations (Saved Model) ===")
    for name, skills, interests in test_cases:
        predictions = predict_with_saved_model(skills, interests)
        print(f"\n{name}:")
        for career, percent in predictions.items():
            print(f"{career}: {percent}%")

    # Visualization
    visualize_clusters(student_vectors, centroids, list(career_keywords.keys()))

if __name__ == "__main__":
    main()