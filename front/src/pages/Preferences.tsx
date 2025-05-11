import { useState, useEffect, useMemo, useCallback } from 'react';
import skillsData from '../skills.json';
import { createuserinfo,Userinfo} from '../services/userinfoservice';
import { useNavigate} from 'react-router-dom';
import { useAuth } from '../context/authcontext'; // adjust this to your actual auth context path
import { useUserinfo } from '../context/userinfocontext';

const SkillInterestForm = () => {
  const csInterests = [
    'Artificial Intelligence', 
    'Web Development',
    'Data Science',
    'Cybersecurity',
    'Game Development',
    'Mobile Development',
    'Cloud Computing',
    'DevOps',
    'Blockchain',
    'Machine Learning',
  ];
  const {setUserinfo}=useUserinfo();
  const navigate=useNavigate();
  const { user } = useAuth(); // Must provide user with `id`
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [otherInterest, setOtherInterest] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [displayedSkills, setDisplayedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const PAGE_SIZE = 50;

  useEffect(() => {
    const handler = setTimeout(() => {
      const trimmed = searchInput.trim().toLowerCase();
      setDebouncedSearch(prev =>
        prev !== trimmed ? trimmed : trimmed + ' '
      );
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput]);

  const filteredSkills = useMemo(() => {
    if (!debouncedSearch.trim()) return [];
    const term = debouncedSearch.trim().toLowerCase();
    return skillsData
      .filter(skill => skill.toLowerCase().includes(term))
      .slice(0, 100);
  }, [debouncedSearch]);

  useEffect(() => {
    if (step === 2 && displayedSkills.length === 0) {
      loadMoreSkills();
    }
  }, [step]);

  const loadMoreSkills = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    setTimeout(() => {
      const nextChunk = skillsData.slice(
        displayedSkills.length,
        displayedSkills.length + PAGE_SIZE
      );
      setDisplayedSkills(prev => [...prev, ...nextChunk]);
      setHasMore(displayedSkills.length + nextChunk.length < skillsData.length);
      setIsLoading(false);
    }, 300);
  }, [displayedSkills, isLoading, hasMore]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
      if (
        scrollHeight - scrollTop <= clientHeight * 1.1 &&
        !debouncedSearch &&
        hasMore &&
        !isLoading
      ) {
        loadMoreSkills();
      }
    },
    [debouncedSearch, hasMore, isLoading, loadMoreSkills]
  );

  const toggleInterest = useCallback(
    (interest: string) => {
      setSelectedInterests(prev =>
        prev.includes(interest)
          ? prev.filter(i => i !== interest)
          : prev.length < 3
          ? [...prev, interest]
          : prev
      );
    },
    []
  );

  const toggleSkill = useCallback(
    (skill: string) => {
      setSelectedSkills(prev =>
        prev.includes(skill)
          ? prev.filter(s => s !== skill)
          : prev.length < 5
          ? [...prev, skill]
          : prev
      );
    },
    []
  );

  const addCustomSkill = useCallback(() => {
    const trimmed = customSkill.trim();
    if (trimmed && !selectedSkills.includes(trimmed) && selectedSkills.length < 5) {
      setSelectedSkills(prev => [...prev, trimmed]);
      setCustomSkill('');
    }
  }, [customSkill, selectedSkills]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!user || !user.id) {
        alert('You must be logged in to submit your preferences.');
        return;
      }

      const interests =
        otherInterest && !csInterests.includes(otherInterest)
          ? [...selectedInterests, otherInterest]
          : selectedInterests;

      const userinfoPayload: Userinfo = {
        interests: interests.join(','),
        skills: selectedSkills.join(','),
        userid: user.id,
      };

      try {
        const response = await createuserinfo(userinfoPayload);
        setUserinfo(userinfoPayload);
        console.log('Preferences saved:', response.data);
        console.log('Preferences submitted successfully!');
        navigate("/");
      } catch (error) {
        console.error('Error submitting preferences:', error);
        alert('Failed to submit preferences.');
      }
    },
    [selectedInterests, otherInterest, selectedSkills, user]
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">
        {step === 1 ? 'Select Your Interests' : 'Select Your Skills'}
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Interests */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">
              Choose up to 3 CS-related interests that match your passions
            </p>
            <div className="grid grid-cols-2 gap-3">
              {csInterests.map(interest => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`py-2 px-4 rounded-md border ${
                    selectedInterests.includes(interest)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                  } transition-colors`}
                >
                  {interest}
                </button>
              ))}
            </div>
            <div className="mt-4">
              <label htmlFor="otherInterest" className="block text-sm font-medium text-gray-700 mb-1">
                Other (specify if not listed)
              </label>
              <input
                type="text"
                id="otherInterest"
                value={otherInterest}
                onChange={e => setOtherInterest(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your interest"
              />
            </div>
            <div className="flex justify-end mt-6">
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={selectedInterests.length === 0 && !otherInterest.trim()}
                className={`px-4 py-2 rounded-md ${
                  selectedInterests.length === 0 && !otherInterest.trim()
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Next: Select Skills
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-gray-600 mb-4">Select up to 5 skills you're familiar with</p>

            <div className="mb-4 relative">
              <label htmlFor="skillFilter" className="block text-sm font-medium text-gray-700 mb-1">
                Search skills
              </label>
              <input
                type="text"
                id="skillFilter"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                placeholder="Type to search skills..."
              />
            </div>

            <div
              className="max-h-60 overflow-y-auto mb-4 border border-gray-200 rounded-md p-2"
              onScroll={handleScroll}
            >
              {debouncedSearch.trim() ? (
                filteredSkills.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {filteredSkills.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`py-2 px-3 rounded-md text-sm ${
                          selectedSkills.includes(skill)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No matching skills found</p>
                )
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    {displayedSkills.map(skill => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className={`py-2 px-3 rounded-md text-sm ${
                          selectedSkills.includes(skill)
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        } transition-colors`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                  {isLoading && (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {!hasMore && (
                    <p className="text-center text-gray-500 py-2">All skills loaded</p>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={customSkill}
                onChange={e => setCustomSkill(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a skill not listed"
              />
              <button
                type="button"
                onClick={addCustomSkill}
                disabled={!customSkill.trim() || selectedSkills.length >= 5}
                className={`px-3 py-2 rounded-md ${
                  !customSkill.trim() || selectedSkills.length >= 5
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                Add
              </button>
            </div>

            <div className="mt-2">
              <p className="text-sm text-gray-500">Selected: {selectedSkills.length}/5 skills</p>
              {selectedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedSkills.map(skill => (
                    <span
                      key={skill}
                      className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => toggleSkill(skill)}
                        className="ml-2 text-blue-500 hover:text-blue-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setSearchInput('');
                  setDebouncedSearch('');
                }}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={selectedSkills.length === 0}
                className={`px-4 py-2 rounded-md ${
                  selectedSkills.length === 0
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SkillInterestForm;
