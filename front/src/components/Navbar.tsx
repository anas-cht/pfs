import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, FileText, Users, Search, User } from 'lucide-react';
import { useAuth } from '../context/authcontext';

const Navbar = () => {
  const { isAuthenticated, logout,user } = useAuth();
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const navigate = useNavigate();

  const featureItems = [
    { path: '/research', label: 'Research Assistant', icon: Search, description: 'Get AI-powered recommendations for courses and research papers tailored to your goals and interests.' },
    { path: '/resume', label: 'Resume Generator', icon: FileText, description: 'AI-generated ATS-friendly resumes and cover letters.' },
    { path: '/career', label: 'AI Career Mentor', icon: User, description: 'Personalized career guidance with job market analysis.' },
    { path: '/planner', label: 'Smart Study Planner', icon: Calendar, description: 'AI-optimized scheduling integrated with your calendar.' },
    { path: '/collaborate', label: 'Collaboration Hub', icon: Users, description: 'Connect with students and mentors for projects.' },
  ];

  const handleFeatureClick = (path: string) => {
    const isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated') || 'false');
    if (!isAuthenticated) {
      navigate('/signin', { state: { from: path } });
    } else {
      navigate(path);
    }
    setFeaturesOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Logo and navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              UniSphere
            </Link>

            <div className="relative">
              <button
                onClick={() => setFeaturesOpen(!featuresOpen)}
                className="flex items-center text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                Features {featuresOpen ? '▲' : '▼'}
              </button>

              {featuresOpen && (
                <div className="absolute z-10 left-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {featureItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleFeatureClick(item.path)}
                          className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <div className="flex items-center">
                            <Icon className="w-5 h-5 mr-3 text-indigo-600" />
                            <div>
                              <p className="font-medium">{item.label}</p>
                              <p className="text-gray-500 text-xs mt-1">{item.description}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link to="/about" className="text-gray-700 hover:text-gray-900">
              About
            </Link>
          </div>

          {/* Right side - Auth buttons */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <>
                <button
                  onClick={logout}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900"
                >
                  Logout
                </button>
                <Link to="/account" className="px-4 py-2 text-gray-700 hover:text-gray-900 relative">
                <User className="w-5 h-5" />
                    {(user?.university === '' || user?.university == null ||
                      user?.degree === '' || user?.degree == null ||
                      user?.password === '' || user?.password == null) && (
                      <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    )}
                </Link>
              </>
            ) : (
              <>
                <Link to="/signin" className="px-4 py-2 text-gray-700 hover:text-gray-900">
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
