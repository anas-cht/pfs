import React from 'react';
import { Calendar } from 'lucide-react';

function StudyPlanner() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Study Planner</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">
          Welcome to your study planner. Here you can organize your study schedule and track your academic progress.
        </p>
      </div>
    </div>
  );
}

export default StudyPlanner;