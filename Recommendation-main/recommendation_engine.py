import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import NMF

def load_data():
    """Load the courses data and create a synthetic ratings dataset."""
    # Load the courses data
    courses_df = pd.read_csv('coursera_courses_detailed.csv')
    
    # Select only the columns we need
    courses_df = courses_df[['Title', 'Provider', 'Skills', 'Rating', 'Course Link']]
    
    # Create a synthetic ratings dataset
    num_users = 100
    user_ids = range(1, num_users + 1)
    
    ratings = []
    for user_id in user_ids:
        num_ratings = np.random.randint(5, 20)
        rated_courses = courses_df.sample(num_ratings)
        for _, course in rated_courses.iterrows():
            rating = np.random.randint(1, 6)
            ratings.append({
                'UserID': user_id,
                'Title': course['Title'],
                'Rating': rating
            })
    
    ratings_df = pd.DataFrame(ratings)
    return courses_df, ratings_df

def get_user_ratings(user_id, ratings_df):
    """Get the courses a specific user has rated."""
    return ratings_df[ratings_df['UserID'] == user_id]

def user_based_recommendations(user_id, courses_df, ratings_df, n_recommendations=10, k=5):
    """User-based collaborative filtering recommendations."""
    user_course_matrix = ratings_df.pivot_table(index='UserID', columns='Title', values='Rating').fillna(0)
    user_similarity = cosine_similarity(user_course_matrix)
    user_similarity_df = pd.DataFrame(
        user_similarity,
        index=user_course_matrix.index,
        columns=user_course_matrix.index
    )
    
    similar_users = user_similarity_df[user_id].sort_values(ascending=False)[1:k+1].index
    target_user_rated = set(get_user_ratings(user_id, ratings_df)['Title'])
    similar_users_ratings = ratings_df[
        (ratings_df['UserID'].isin(similar_users)) & 
        (~ratings_df['Title'].isin(target_user_rated))
    ]
    
    recommendations = []
    for course in similar_users_ratings['Title'].unique():
        course_ratings = similar_users_ratings[similar_users_ratings['Title'] == course]
        similarities = [user_similarity_df.loc[user_id, u] for u in course_ratings['UserID']]
        weighted_avg = np.dot(course_ratings['Rating'], similarities) / np.sum(similarities)
        recommendations.append({'Title': course, 'PredictedRating': weighted_avg})
    
    if not recommendations:
        return pd.DataFrame(columns=['Title', 'Provider', 'Skills', 'Rating', 'Course Link'])
    
    rec_df = pd.DataFrame(recommendations).sort_values('PredictedRating', ascending=False)
    final_recs = pd.merge(rec_df, courses_df, on='Title', how='left')
    final_recs = final_recs[['Title', 'Provider', 'Skills', 'PredictedRating', 'Course Link']]
    return final_recs.rename(columns={'PredictedRating': 'Rating'}).head(n_recommendations)

def model_based_recommendations(user_id, courses_df, ratings_df, n_recommendations=10):
    """Matrix factorization recommendations using NMF."""
    user_course_matrix = ratings_df.pivot_table(
        index='UserID', 
        columns='Title', 
        values='Rating'
    ).fillna(0)
    
    model = NMF(n_components=20, init='random', random_state=42)
    W = model.fit_transform(user_course_matrix)
    H = model.components_
    reconstructed_matrix = np.dot(W, H)
    
    user_idx = user_course_matrix.index.get_loc(user_id)
    user_predicted_ratings = reconstructed_matrix[user_idx]
    
    recommendations = pd.DataFrame({
        'Title': user_course_matrix.columns,
        'PredictedRating': user_predicted_ratings
    })
    
    rated_courses = set(get_user_ratings(user_id, ratings_df)['Title'])
    recommendations = recommendations[~recommendations['Title'].isin(rated_courses)]
    recommendations = recommendations.sort_values('PredictedRating', ascending=False)
    
    final_recs = pd.merge(recommendations, courses_df, on='Title', how='left').head(n_recommendations)
    return final_recs[['Title', 'Provider', 'Skills', 'PredictedRating', 'Course Link']].rename(columns={'PredictedRating': 'Rating'})

def item_based_recommendations(user_id, courses_df, ratings_df, n_recommendations=10):
    """Item-based collaborative filtering recommendations."""
    user_course_matrix = ratings_df.pivot_table(index='UserID', columns='Title', values='Rating').fillna(0)
    course_similarity = cosine_similarity(user_course_matrix.T)
    course_similarity_df = pd.DataFrame(
        course_similarity,
        index=user_course_matrix.columns,
        columns=user_course_matrix.columns
    )
    
    user_ratings = get_user_ratings(user_id, ratings_df)
    liked_courses = user_ratings[user_ratings['Rating'] >= 4]['Title']
    if len(liked_courses) == 0:
        liked_courses = user_ratings['Title']
    
    recommendations = []
    for course in liked_courses:
        similar_courses = course_similarity_df[course].sort_values(ascending=False)[1:11]
        for similar_course, similarity in similar_courses.items():
            if similar_course not in user_ratings['Title'].values:
                recommendations.append({'Title': similar_course, 'SimilarityScore': similarity})
    
    if not recommendations:
        return pd.DataFrame(columns=['Title', 'Provider', 'Skills', 'Rating', 'Course Link'])
    
    rec_df = pd.DataFrame(recommendations)
    rec_df = rec_df.groupby('Title')['SimilarityScore'].max().reset_index()
    rec_df = rec_df.sort_values('SimilarityScore', ascending=False)
    
    final_recs = pd.merge(rec_df, courses_df, on='Title', how='left')
    final_recs = final_recs[['Title', 'Provider', 'Skills', 'SimilarityScore', 'Course Link']]
    return final_recs.rename(columns={'SimilarityScore': 'Rating'}).head(n_recommendations)

def hybrid_recommendations(user_id, courses_df, ratings_df, n_recommendations=10):
    """Combine recommendations from all three methods."""
    user_recs = user_based_recommendations(user_id, courses_df, ratings_df, n_recommendations*2)
    model_recs = model_based_recommendations(user_id, courses_df, ratings_df, n_recommendations*2)
    item_recs = item_based_recommendations(user_id, courses_df, ratings_df, n_recommendations*2)
    
    combined = pd.concat([user_recs, model_recs, item_recs]).drop_duplicates('Title')
    
    # Normalize scores
    for col in ['Rating', 'PredictedRating', 'SimilarityScore']:
        if col in combined.columns:
            min_val = combined[col].min()
            max_val = combined[col].max()
            combined[f'{col}_norm'] = (combined[col] - min_val) / (max_val - min_val) if max_val != min_val else 0.5
    
    # Combine with weights
    combined['CombinedScore'] = (
        0.4 * combined.get('Rating_norm', 0) +
        0.4 * combined.get('PredictedRating_norm', 0) +
        0.2 * combined.get('SimilarityScore_norm', 0)
    )
    
    final_recs = combined.sort_values('CombinedScore', ascending=False)
    final_recs = final_recs[['Title', 'Provider', 'Skills', 'CombinedScore', 'Course Link']]
    return final_recs.rename(columns={'CombinedScore': 'Rating'}).head(n_recommendations)

if __name__ == "__main__":
    courses_df, ratings_df = load_data()
    user_id = 1
    
    print("\nUser-based recommendations:")
    print(user_based_recommendations(user_id, courses_df, ratings_df))
    
    print("\nModel-based recommendations:")
    print(model_based_recommendations(user_id, courses_df, ratings_df))
    
    print("\nItem-based recommendations:")
    print(item_based_recommendations(user_id, courses_df, ratings_df))
    
    print("\nHybrid recommendations:")
    print(hybrid_recommendations(user_id, courses_df, ratings_df))