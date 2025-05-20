import React, { useState, useMemo, useEffect } from 'react';
import { Search, Briefcase, Link as LinkIcon, MapPin, Award, BarChart2 } from 'lucide-react';
import jobsData from '../data/linkedin_job_results.json';
import { getrecommendedcarrer } from '../services/userinfoservice';
import { useAuth } from '../context/authcontext';

function JobBoard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recommendedData, setRecommendedData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        const response = await getrecommendedcarrer(user.id);
        setRecommendedData(response.data);
        
        if (!response.data.jobMatches || response.data.jobMatches.length === 0) {
          // Fallback aux données locales si aucune recommandation n'est disponible
          setRecommendedData({
            ...response.data,
            jobMatches: jobsData.slice(0, 10)
          });
        }
      } catch (err) {
        setError(err.message);
        // Fallback aux données locales en cas d'erreur
        setRecommendedData({
          topCareer: "Software Engineer",
          careerScores: {},
          jobMatches: jobsData.slice(0, 10)
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedJobs();
  }, [user.id]);

  const searchLower = searchTerm.toLowerCase();

  const suggestions = useMemo(() => {
    if (!searchLower.trim()) return [];
    const all = new Set<string>();

    jobsData.forEach((job) => {
      if (job.job_title?.toLowerCase().includes(searchLower)) all.add(job.job_title);
      if (job.company?.toLowerCase().includes(searchLower)) all.add(job.company);
      job.skills?.forEach((s: string) => {
        if (s.toLowerCase().includes(searchLower)) all.add(s);
      });
    });

    return Array.from(all).slice(0, 5);
  }, [searchLower]);

  const filteredJobs = useMemo(() => {
    if (!searchLower.trim()) return jobsData.slice(0, 20);
    return jobsData.filter((job) =>
      job.job_title?.toLowerCase().includes(searchLower) ||
      job.company?.toLowerCase().includes(searchLower) ||
      job.skills?.some((s: string) => s.toLowerCase().includes(searchLower))
    );
  }, [searchLower]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-10">Loading recommendations...</div>;
  }

  if (error) {
    return <div className="max-w-7xl mx-auto px-4 py-10">Error: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* 🔷 Hero Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-10 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Explore Job Opportunities</h1>
        </div>
        <p className="text-lg opacity-90">
          Browse through curated listings to find your next role in tech.
        </p>
      </div>

      {/* Career Recommendation Section */}
      {recommendedData?.topCareer && (
        <div className="mb-8 bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
            <Award className="w-6 h-6 mr-2 text-purple-600" />
            Your Career Match
          </h2>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-medium text-gray-900">Top Recommended Career</h3>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                Best Match
              </span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{recommendedData.topCareer}</p>
          </div>

          {recommendedData.careerScores && Object.keys(recommendedData.careerScores).length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3 flex items-center">
                <BarChart2 className="w-5 h-5 mr-2 text-purple-600" />
                Career Match Scores
              </h3>
              <div className="space-y-3">
                {Object.entries(recommendedData.careerScores)
                  .sort((a, b) => b[1] - a[1])
                  .map(([career, score]) => (
                    <div key={career} className="flex items-center">
                      <div className="w-1/3 font-medium text-gray-700">{career}</div>
                      <div className="w-2/3">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-purple-600 h-2.5 rounded-full" 
                            style={{ width: `${Math.min(100, Number(score))}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-500 ml-2">{Number(score).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommended Jobs Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Recommended Jobs for {recommendedData?.topCareer || 'You'}</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {recommendedData?.jobMatches?.map((job, i) => (
            <div
              key={i}
              className="min-w-[300px] max-w-[300px] bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-1">{job.jobTitle || job.job_title}</h2>
              <p className="text-sm text-purple-700 font-medium">{job.company}</p>
              {job.location && (
                <div className="flex items-center text-xs text-gray-500 mt-1 mb-3">
                  <MapPin className="w-4 h-4 mr-1" />
                  {job.location}
                </div>
              )}
              {job.skills && job.skills.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 6).map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <a
                  href={job.url || job.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-600 hover:text-purple-800 flex items-center font-medium"
                >
                  <LinkIcon className="w-4 h-4 mr-1" />
                  View Job
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🔎 Search Bar */}
      <div className="mb-10 relative">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by job title, company, or skill..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          />
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg">
            <ul className="py-1">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                  onMouseDown={() => {
                    setSearchTerm(s);
                    setShowSuggestions(false);
                  }}
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 📌 All Jobs - Horizontal Scroll */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">All Job Listings</h2>
        <div className="flex overflow-x-auto space-x-4 pb-4">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, i) => (
              <div
                key={i}
                className="min-w-[300px] max-w-[300px] bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-1">{job.job_title}</h2>
                <p className="text-sm text-indigo-700 font-medium">{job.company}</p>
                {job.location && (
                  <div className="flex items-center text-xs text-gray-500 mt-1 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </div>
                )}
                {job.skills && job.skills.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Required Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 6).map((skill: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-end">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center font-medium"
                  >
                    <LinkIcon className="w-4 h-4 mr-1" />
                    View Job
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No matching jobs found.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobBoard;