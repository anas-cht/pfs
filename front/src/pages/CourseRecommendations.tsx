import React from 'react';

function CourseRecommendations() {
  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-5">
        <h1 className="text-3xl font-bold text-gray-900">Course Recommendations</h1>
        <p className="mt-2 text-sm text-gray-500">
          Discover personalized course recommendations tailored to your interests and career goals.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Placeholder for course recommendations */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900">Introduction to AI</h3>
          <p className="mt-2 text-sm text-gray-600">
            Learn the fundamentals of artificial intelligence and machine learning.
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Beginner
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900">Web Development</h3>
          <p className="mt-2 text-sm text-gray-600">
            Master modern web development with React and Node.js.
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Intermediate
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-900">Data Science</h3>
          <p className="mt-2 text-sm text-gray-600">
            Explore data analysis and visualization techniques.
          </p>
          <div className="mt-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
              Advanced
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseRecommendations;