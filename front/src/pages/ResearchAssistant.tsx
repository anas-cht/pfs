import React, { useState, useMemo, useEffect } from 'react';
import { Star, BookOpen, FileText, Link as LinkIcon, Sparkles } from 'lucide-react';
import coursesData from '../data/coursera_courses_detailed.json';
import papersData from '../data/arxiv_it_research.json';
import { addcourse, getallcourses, getcoursesrecommandation } from '../services/courseservice';
import { useAuth } from '../context/authcontext';
import { useUserinfo } from '../context/userinfocontext';

// Star Rating Component
const StarRating = ({ rating, setRating, interactive = true }) => {
  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => interactive && setRating(star)}
          className={`${interactive ? 'cursor-pointer' : 'cursor-default'}`}
          disabled={!interactive}
        >
          <Star
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );
};

function ResearchAssistant() {
  const [courseSearch, setCourseSearch] = useState('');
  const [paperSearch, setPaperSearch] = useState('');
  const [showCourseSuggestions, setShowCourseSuggestions] = useState(false);
  const [showPaperSuggestions, setShowPaperSuggestions] = useState(false);
  const [courseRatings, setCourseRatings] = useState({});
  const [paperRatings, setPaperRatings] = useState({});
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [coursesrec, setCoursesrec] = useState<any[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [coursesError, setCoursesError] = useState<string | null>(null);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const {userinfo}=useUserinfo();

  useEffect(() => {
    const getCoursesrec = async () => {
      if (!userinfo) return;
      try {
        const response2 = await getcoursesrecommandation(userinfo) ;
        setCoursesrec(response2.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setCoursesError('Failed to load your recommandation courses. Please try again.');
      } finally {
        setCoursesLoading(false);
      }
    };

    getCoursesrec();
  }, [userinfo]);


  useEffect(() => {
    const fetchRatedCourses = async () => {
      if (!user?.id) return;
      try {
        setCoursesLoading(true);
        const response = await getallcourses(user.id);
        setCourses(response.data);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
        setCoursesError('Failed to load your rated courses. Please try again.');
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchRatedCourses();
  }, [user?.id]);

  // Initialize courseRatings from loaded courses
  useEffect(() => {
    if (!courses) return;
    const initialRatings = {};
    courses.forEach((course) => {
      initialRatings[course.title] = course.rating;
    });
    setCourseRatings(initialRatings);
  }, [courses]);

  // Handle course rating submission
  const handleCourseRating = async (title, rating) => {
    setLoading(true);
    setError(null);
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      const courseData = {
        title: `${title}`,
        editeur: coursesData.find(c => c.Title === title)?.Provider || 'Unknown',
        rating: rating,
        userid: user.id
      };

      const response = await addcourse(courseData);

      if (response.status === 200) {
        const newRatings = { ...courseRatings, [title]: rating };
        setCourseRatings(newRatings);
      } else {
        throw new Error(response.data?.message || 'Failed to submit rating');
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError(err.response?.data?.message || err.message || 'Failed to submit rating');
    } finally {
      setLoading(false);
    }
  };

  // Handle paper rating submission
  const handlePaperRating = async (title, rating) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://your-api.com/ratings/papers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paperTitle: title,
          rating: rating,
        }),
      });

      if (response.ok) {
        const newRatings = { ...paperRatings, [title]: rating };
        setPaperRatings(newRatings);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit rating');
      }
    } catch (err) {
      console.error('Error submitting rating:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const courseLower = courseSearch.toLowerCase();
  const paperLower = paperSearch.toLowerCase();

  const courseSuggestions = useMemo(() => {
    if (!courseLower.trim()) return [];
    const all = new Set<string>();

    coursesData.forEach((item) => {
      if (item.Title?.toLowerCase().includes(courseLower)) all.add(item.Title);
      if (item.Provider?.toLowerCase().includes(courseLower)) all.add(item.Provider);
      if (item.Skills) {
        item.Skills.split(',').forEach((s) => {
          if (s.trim().toLowerCase().includes(courseLower)) all.add(s.trim());
        });
      }
    });

    return Array.from(all).slice(0, 5);
  }, [courseLower]);

  const filteredCourses = useMemo(() => {
    if (!courseLower.trim()) {
      return [...coursesData]
        .sort((a, b) => (parseFloat(b.Rating) || 0) - (parseFloat(a.Rating) || 0))
        .slice(0, 20);
    }

    return coursesData.filter((item) =>
      item.Title?.toLowerCase().includes(courseLower) ||
      item.Provider?.toLowerCase().includes(courseLower) ||
      item.Skills?.toLowerCase().includes(courseLower)
    );
  }, [courseLower]);

  const filteredPapers = useMemo(() => {
    if (!paperLower.trim()) return papersData;

    return papersData.filter((paper) =>
      paper.Title?.toLowerCase().includes(paperLower) ||
      paper.Authors?.toLowerCase().includes(paperLower) ||
      paper.Summary?.toLowerCase().includes(paperLower)
    );
  }, [paperLower]);

  const paperSuggestions = useMemo(() => {
    if (!paperLower.trim()) return [];
    const all = new Set<string>();

    papersData.forEach((item) => {
      if (item.Title?.toLowerCase().includes(paperLower)) all.add(item.Title);
      if (item.Authors?.toLowerCase().includes(paperLower)) all.add(item.Authors);
    });

    return Array.from(all).slice(0, 5);
  }, [paperLower]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Error and loading */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-lg font-semibold">Submitting your rating...</p>
          </div>
        </div>
      )}

      {/* Greeting */}
      <div className="mb-10 p-6 bg-gradient-to-r from-indigo-600 rounded-2xl text-white shadow-lg flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome to the Knowledge Catalog</h1>
          <p className="text-lg">Find top-rated courses and explore cutting-edge research papers in tech.</p>
        </div>
        <Sparkles className="w-12 h-12 text-yellow-200 drop-shadow-lg" />
      </div>

       {/* Recommendations For You */}
       {coursesrec.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold">Recommendations For You</h2>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {coursesrec.map((item, index) => (
              <div
                key={`rec-${index}`}
                className="min-w-[300px] bg-white rounded-lg shadow-md hover:shadow-lg hover:ring-2 hover:ring-purple-400 transform hover:scale-105 transition-all duration-200 ease-in-out overflow-hidden"
              >
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
                      <span className="flex items-center bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-sm">
                        <Star className="w-4 h-4 mr-1" />
                        {item.Rating}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">By {item.Provider}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{item.Skills}</p>
                  {item.Details && <p className="text-sm text-gray-600 mt-2 line-clamp-3">{item.Details}</p>}

                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Your rating:</p>
                    <StarRating
                      rating={courseRatings[item.Title] || 0}
                      setRating={(rating) => handleCourseRating(item.Title, rating)}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    {item.Reviews && <span className="text-xs text-gray-500">{item.Reviews} reviews</span>}
                    {item['Course Link'] && (
                      <a
                        href={item['Course Link']}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-purple-600 hover:text-purple-800 text-sm font-medium"
                      >
                        <LinkIcon className="w-4 h-4 mr-1" />
                        View Course
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Courses */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Courses Catalog</h2>
        </div>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={courseSearch}
            onChange={(e) => setCourseSearch(e.target.value)}
            onFocus={() => setShowCourseSuggestions(true)}
            onBlur={() => setTimeout(() => setShowCourseSuggestions(false), 200)}
          />
          {showCourseSuggestions && courseSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <ul className="py-1">
                {courseSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-indigo-50 cursor-pointer"
                    onMouseDown={() => {
                      setCourseSearch(suggestion);
                      setShowCourseSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((item, index) => (
              <div
                key={index}
                className="min-w-[300px] bg-white rounded-lg shadow-md hover:shadow-lg hover:ring-2 hover:ring-indigo-400 transform hover:scale-105 transition-all duration-200 ease-in-out overflow-hidden"
              >
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
                  <p className="text-sm text-gray-600 mb-2">By {item.Provider}</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{item.Skills}</p>
                  {item.Details && <p className="text-sm text-gray-600 mt-2 line-clamp-3">{item.Details}</p>}

                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Your rating:</p>
                    <StarRating
                      rating={courseRatings[item.Title] || 0}
                      setRating={(rating) => handleCourseRating(item.Title, rating)}
                    />
                  </div>

                  <div className="flex justify-between items-center mt-4">
                    {item.Reviews && <span className="text-xs text-gray-500">{item.Reviews} reviews</span>}
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
            <p className="text-gray-500">No courses found</p>
          )}
        </div>
      </div>

      {/* Papers */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-semibold">Papers Catalog</h2>
        </div>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search papers..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            value={paperSearch}
            onChange={(e) => setPaperSearch(e.target.value)}
            onFocus={() => setShowPaperSuggestions(true)}
            onBlur={() => setTimeout(() => setShowPaperSuggestions(false), 200)}
          />
          {showPaperSuggestions && paperSuggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              <ul className="py-1">
                {paperSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-teal-50 cursor-pointer"
                    onMouseDown={() => {
                      setPaperSearch(suggestion);
                      setShowPaperSuggestions(false);
                    }}
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4">
          {filteredPapers.length > 0 ? (
            filteredPapers.map((paper, index) => (
              <div
                key={index}
                className="min-w-[300px] bg-white rounded-lg shadow-md hover:shadow-lg hover:ring-2 hover:ring-teal-400 transform hover:scale-105 transition-all duration-200 ease-in-out overflow-hidden p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">{paper.Title}</h3>
                <p className="text-sm text-gray-600 mb-1">{paper.Authors}</p>
                <p className="text-xs text-gray-500 mb-3">Published: {paper.Published}</p>
                <p className="text-sm text-gray-700 line-clamp-4 mb-3">{paper.Summary}</p>

                <div className="mt-3">
                  <p className="text-xs text-gray-500 mb-1">Your rating:</p>
                  <StarRating
                    rating={paperRatings[paper.Title] || 0}
                    setRating={(rating) => handlePaperRating(paper.Title, rating)}
                  />
                </div>

                <div className="flex justify-between items-center mt-auto">
                  {paper.Link && (
                    <a href={paper.Link} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 hover:text-teal-800 flex items-center">
                      <LinkIcon className="w-4 h-4 mr-1" />
                      Abstract
                    </a>
                  )}
                  {paper['PDF Link'] && (
                    <a href={paper['PDF Link']} target="_blank" rel="noopener noreferrer" className="text-sm text-teal-600 hover:text-teal-800 ml-4">
                      PDF
                    </a>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No papers found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResearchAssistant;
