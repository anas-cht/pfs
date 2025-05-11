import React, { useState, useMemo } from 'react';
import { Search, Star, BookOpen, Link as LinkIcon } from 'lucide-react';
import coursesData from '../data/coursera_courses_detailed.json';

function ResearchAssistant() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchLower = searchTerm.toLowerCase();

  // 🔍 Suggestions: from entire dataset
  const suggestions = useMemo(() => {
    if (!searchLower.trim()) return [];

    const allSuggestions = new Set<string>();

    coursesData.forEach((item) => {
      if (item.Title?.toLowerCase().includes(searchLower)) {
        allSuggestions.add(item.Title);
      }
      if (item.Provider?.toLowerCase().includes(searchLower)) {
        allSuggestions.add(item.Provider);
      }
      if (item.Skills) {
        item.Skills.split(',').forEach((skill) => {
          const trimmedSkill = skill.trim();
          if (trimmedSkill.toLowerCase().includes(searchLower)) {
            allSuggestions.add(trimmedSkill);
          }
        });
      }
    });

    return Array.from(allSuggestions).slice(0, 5);
  }, [searchLower]);

  // 🎯 Filter all courses on search
  const filteredResearch = useMemo(() => {
    if (!searchLower.trim()) {
      return [...coursesData]
        .sort((a, b) => (parseFloat(b.Rating) || 0) - (parseFloat(a.Rating) || 0))
        .slice(0, 20); // show top 20 by default
    }

    return coursesData.filter((item) =>
      item.Title?.toLowerCase().includes(searchLower) ||
      item.Provider?.toLowerCase().includes(searchLower) ||
      item.Skills?.toLowerCase().includes(searchLower)
    );
  }, [searchLower]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <BookOpen className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">Course Catalog</h1>
      </div>

      {/* 🔎 Search Bar with Suggestions */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Find Courses</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title, provider, or skills..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <ul className="py-1">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                    onMouseDown={() => {
                      setSearchTerm(suggestion);
                      setShowSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 📚 Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResearch.length > 0 ? (
          filteredResearch.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {item['Image URL'] && (
                <img
                  src={item['Image URL']}
                  alt={item.Title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x225?text=Course+Image';
                  }}
                />
              )}
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-gray-900 line-clamp-2">{item.Title}</h2>
                  {item.Rating && (
                    <span className="flex items-center bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm">
                      <Star className="w-4 h-4 mr-1" />
                      {item.Rating}
                    </span>
                  )}
                </div>

                {item.Provider && (
                  <p className="text-sm text-gray-600 mb-2">By {item.Provider}</p>
                )}

                {item.Skills && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-500 uppercase mb-1">Skills</p>
                    <p className="text-sm text-gray-700 line-clamp-2">{item.Skills}</p>
                  </div>
                )}

                {item.Details && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.Details}</p>
                )}

                <div className="flex justify-between items-center">
                  {item.Reviews && (
                    <span className="text-xs text-gray-500">{item.Reviews} reviews</span>
                  )}

                  {item['Course Link'] && (
                    <a
                      href={item['Course Link']}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      <LinkIcon className="w-4 h-4 mr-1" />
                      View Course
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? 'No matching results found' : 'Browse our top courses below'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResearchAssistant;
