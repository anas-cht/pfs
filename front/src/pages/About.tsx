import React, {useState } from 'react';
import { Info, Brain, Calendar, FileText, Users, Search } from 'lucide-react';
import { useNavigate} from 'react-router-dom';
import { creatmessage } from '../services/messageservice';

function About() {
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate=useNavigate();

  const features = [
    {
      icon: Search,
      title: 'Research Assistance',
      description: 'Get AI-powered recommendations for courses and research papers tailored to your goals and interests.',
    },
    {
      icon: Users,
      title: 'Peer Collaboration',
      description: 'Connect with fellow students and mentors in your field.',
    },
    {
      icon: FileText,
      title: 'Professional Resume Building',
      description: 'Create ATS-friendly resumes with smart suggestions.',
    },
    {
      icon: Brain,
      title: 'AI Career Guidance',
      description: 'Receive data-driven career advice and industry insights.',
    },
    {
      icon: Calendar,
      title: 'Intelligent Study Planning',
      description: 'Optimize your study schedule with AI-powered time management.',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user || !user.id) {
      navigate("/signin");
      return;
    }


    if (!message.trim()) {
      setError('Please enter a message before submitting.');
      return;
    }

    const formData = {
      message: message,
      userid: user.id,
    };

    try {
      await creatmessage(formData);
      setMessage('');
      setSuccess('Your message has been sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send your message. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="flex items-center gap-3 mb-8">
        <Info className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">About EduAI</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
        <p className="text-gray-600 text-lg mb-6">
          EduAI combines artificial intelligence with education to create a personalized learning experience.
          We're dedicated to helping students achieve their academic and career goals through smart technology
          and data-driven insights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="flex gap-4 p-4 rounded-lg bg-gray-50">
                <Icon className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
        <p className="text-gray-600 mb-6">
          Have questions or suggestions? We'd love to hear from you.
        </p>

        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Your message..."
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default About;
