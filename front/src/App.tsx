import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Brain, BookOpen, Calendar, Users, Search } from 'lucide-react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
// import CourseRecommendations from './pages/CourseRecommendations';
import CareerMentor from './pages/CareerMentor';
import StudyPlanner from './pages/StudyPlanner';
import ResumeBuilder from './pages/ResumeBuilder';
import CollaborationHub from './pages/CollaborationHub';
import ResearchAssistant from './pages/ResearchAssistant';
import About from './pages/About';
import Account from './pages/Account';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Preferences from './pages/Preferences';
import { Footer } from './components/Footer';
import { AuthProvider } from './context/authcontext';
// import SetPassword from './pages/SetPassword';
import PrivateRoute from './context/privateroute';
import ProtectedDashboardRoute from './context/signroute';

import { UserinfoProvider } from './context/userinfocontext';

function App() {
  return (
    <Router>
      <UserinfoProvider> 
        <AuthProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
              <Routes>
              <Route path="/" element={<Dashboard />} />

                <Route path="/career" element={<PrivateRoute><CareerMentor /></PrivateRoute>} />
                <Route path="/planner" element={<PrivateRoute><StudyPlanner /></PrivateRoute>} />
                <Route path="/resume" element={<PrivateRoute><ResumeBuilder /></PrivateRoute>} />
                <Route path="/collaborate" element={<PrivateRoute><CollaborationHub /></PrivateRoute>} />
                <Route path="/research" element={<PrivateRoute><ResearchAssistant /></PrivateRoute>} />
                <Route path="/about" element={<About />} />
                <Route path="/account" element={<PrivateRoute><Account /></PrivateRoute>} />
                <Route path="/preferences" element={<Preferences />} />
                <Route path="/signin" element={<ProtectedDashboardRoute ><SignIn /></ProtectedDashboardRoute >} />
                <Route path="/signup" element={<ProtectedDashboardRoute ><SignUp /></ProtectedDashboardRoute>} />
              </Routes>
            </div>
            <Footer />
          </div>
        </AuthProvider>
      </UserinfoProvider>
    </Router>
  );
}



export default App;