// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import type { DragEndEvent } from '@dnd-kit/core';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { getuser2 } from '../services/userservice.ts';
import { getuserinfo } from '../services/userinfoservice.ts';
import { useUserinfo } from '../context/userinfocontext';
import {
  Brain,
  Calendar,
  FileText,
  Users,
  Search,
  BookMarked,
  Clock,
  Menu,
  GraduationCap,
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import { DashboardWidget } from '../components/DashboardWidget';
import { NotificationCenter } from '../components/NotificationCenter';
import { AIAssistant } from '../components/AIAssistant';
import { useAuth } from '../context/authcontext';

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {setUserinfo}=useUserinfo();
  const [widgets, setWidgets] = useState([
    {
      id: 'progress',
      title: 'Learning Progress',
      visible: true,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Web Development</span>
            <span className="text-sm text-gray-500">75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '75%' }}></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Machine Learning</span>
            <span className="text-sm text-gray-500">45%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
        </div>
      ),
    },
    {
      id: 'upcoming',
      title: 'Upcoming Sessions',
      visible: true,
      content: (
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 truncate">AI Fundamentals</p>
              <p className="text-sm text-gray-500">Today, 2:00 PM</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 truncate">Web Security</p>
              <p className="text-sm text-gray-500">Tomorrow, 10:00 AM</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'resources',
      title: 'Saved Resources',
      visible: true,
      content: (
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <BookMarked className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 truncate">React Best Practices</p>
              <p className="text-sm text-gray-500">Article • 15 min read</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <BookMarked className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-gray-900 truncate">ML Course Notes</p>
              <p className="text-sm text-gray-500">PDF • Last opened 2d ago</p>
            </div>
          </div>
        </div>
      ),
    },
  ]);

  const features = [
    // {
    //   title: 'Course Recommendations',
    //   description: 'Get AI-driven course suggestions from top platforms',
    //   icon: BookOpen,
    //   path: '/course',
    //   color: 'bg-blue-500',
    //   usage: 85,
    // },
    {
      title: 'Career Mentor',
      description: 'Receive personalized career guidance and job market insights',
      icon: Brain,
      path: '/career',
      color: 'bg-purple-500',
      usage: 100,
    },
    {
      title: 'Study Planner',
      description: 'Optimize your study schedule with AI assistance',
      icon: Calendar,
      path: '/planner',
      color: 'bg-green-500',
      usage: 100,
    },
    {
      title: 'Resume Builder',
      description: 'Create ATS-friendly resumes and cover letters',
      icon: FileText,
      path: '/resume',
      color: 'bg-yellow-500',
      usage: 100,
    },
    {
      title: 'Collaboration Hub',
      description: 'Connect with students and mentors',
      icon: Users,
      path: '/collaborate',
      color: 'bg-pink-500',
      usage: 100,
    },
    {
      title: 'Research Assistant',
      description: 'Discover and summarize research papers',
      icon: Search,
      path: '/research',
      color: 'bg-indigo-500',
      usage: 100,
    },
    {
      title: 'DocuMind',
      description: 'Chat with your PDF documents using AI assistance',
      icon: Search,
      path: '/research',
      color: 'bg-blue-500',
      usage: 100,
    },
  ].sort((a, b) => b.usage - a.usage);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }
    const { login } = useAuth();
    // const {hasPreferences}=useUserinfo();
  const [searchParams] = useSearchParams();
  const encodedEmail = searchParams.get('email');
  const email = encodedEmail ? decodeURIComponent(encodedEmail) : null;
// 1. Récupère l'utilisateur à partir de l'email
useEffect(() => {
  const fetchUser = async () => {
    if (!email) return;

    try {
      const response = await getuser2({ email });

      if (response.data) {
        const userData = {
          id: response.data.id,
          fullname: response.data.fullname || response.data.username || 'User',
          email: response.data.email,
          username: response.data.username,
          degree: response.data.degree,
          university: response.data.university,
          password: response.data.password,
        };

        localStorage.setItem('user', JSON.stringify(userData));
        login(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  fetchUser();
}, [email, login]);

// 2. Une fois l'utilisateur connecté, on récupère son userinfo
useEffect(() => {
  const fetchUserinfo = async () => {
    if (!user) return;

    try {
      const response2 = await getuserinfo(user.id);
      if (response2.data) {
        const userinfoData = {
          id: response2.data.id,
          interests: response2.data.interests,
          skills: response2.data.skills,
          userid: user.id
        };
        // alert(response2.data);
        setUserinfo(userinfoData);
      }
    } catch (error) {
      console.error("Failed to fetch userinfo data:", error);
    }
  };

  fetchUserinfo();
}, [user, setUserinfo]);



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Always visible */}
      <div className="relative bg-indigo-900 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            alt="Students studying"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Transform Your Learning Journey
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-indigo-100">
              Personalized education powered by AI. Master new skills, advance your career, and connect with a global community of learners.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50">
                <GraduationCap className="w-5 h-5 mr-2" />
                Start Learning
              </button>
              <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                <Brain className="w-5 h-5 mr-2" />
                Explore AI Tools
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isAuthenticated && (
          <>
            {/* User Profile Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-8 mb-8">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0"></div>
                <div className="min-w-0">
                  <h2 className="text-2xl font-bold text-gray-900 truncate">
                    Welcome, {user?.fullname || 'User'}!
                  </h2>
                  <p className="text-gray-600">Ready to continue learning?</p>
                </div>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
                <NotificationCenter />
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="sm:hidden p-2 rounded-lg hover:bg-gray-100"
                >
                  <Menu className="w-6 h-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Dashboard Widgets */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
                <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
                  {widgets.map((widget) =>
                    widget.visible ? (
                      <DashboardWidget
                        key={widget.id}
                        id={widget.id}
                        title={widget.title}
                        onRemove={() =>
                          setWidgets((prev) =>
                            prev.map((w) =>
                              w.id === widget.id ? { ...w, visible: false } : w
                            )
                          )
                        }
                      >
                        {widget.content}
                      </DashboardWidget>
                    ) : null
                  )}
                </SortableContext>
              </div>
            </DndContext>
          </>
        )}

        {/* Features Grid - Always visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.path}
                to={feature.pathh}
                className="transform hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <div className="bg-white rounded-lg shadow-lg overflow-hidden h-full">
                  <div className={`${feature.color} p-4 sm:p-6`}>
                    <Icon className="w-8 h-8 sm:w-12 sm:h-12 text-white" />
                  </div>
                  <div className="p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600">{feature.description}</p>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${feature.color} h-2 rounded-full`}
                          style={{ width: `${feature.usage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <AIAssistant />
    </div>
  );
};

export default Dashboard;
