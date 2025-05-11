import React, { useState, useMemo } from 'react';
import { Search, Briefcase, Link as LinkIcon, MapPin } from 'lucide-react';
import jobsData from '../data/linkedin_job_results.json';

function JobBoard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const searchLower = searchTerm.toLowerCase();

  // 🔍 Auto-suggestions
  const suggestions = useMemo(() => {
    if (!searchLower.trim()) return [];

    const allSuggestions = new Set<string>();

    jobsData.forEach((job) => {
      if (job.job_title?.toLowerCase().includes(searchLower)) {
        allSuggestions.add(job.job_title);
      }
      if (job.company?.toLowerCase().includes(searchLower)) {
        allSuggestions.add(job.company);
      }
      if (job.skills) {
        job.skills.forEach((skill: string) => {
          if (skill.toLowerCase().includes(searchLower)) {
            allSuggestions.add(skill);
          }
        });
      }
    });

    return Array.from(allSuggestions).slice(0, 5);
  }, [searchLower]);

  // 🔍 Filter results
  const filteredJobs = useMemo(() => {
    if (!searchLower.trim()) return jobsData.slice(0, 20); // default: top 20

    return jobsData.filter((job) =>
      job.job_title?.toLowerCase().includes(searchLower) ||
      job.company?.toLowerCase().includes(searchLower) ||
      job.skills?.some((skill: string) => skill.toLowerCase().includes(searchLower))
    );
  }, [searchLower]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Briefcase className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
      </div>

      {/* 🔎 Search Bar */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Find Jobs</h2>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title, company, or skills..."
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

      {/* 🧾 Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-semibold text-gray-900 mb-1">{job.job_title}</h2>
              <p className="text-sm text-gray-700 mb-1">{job.company}</p>
              {job.location && (
                <p className="text-xs text-gray-500 mb-2 flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {job.location}
                </p>
              )}
              {job.skills && (
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 uppercase mb-1">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 6).map((skill: string, idx: number) => (
                      <span key={idx} className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end mt-4">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  <LinkIcon className="w-4 h-4 mr-1" />
                  View Job
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500">
              {searchTerm ? 'No matching jobs found' : 'Browse recent listings'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobBoard;
