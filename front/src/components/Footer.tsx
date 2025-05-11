import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About EduAI</h3>
            <p className="text-gray-600 max-w-md">
              EduAI combines artificial intelligence with education to create a personalized learning experience. 
              We're dedicated to helping students achieve their academic and career goals through smart technology 
              and data-driven insights.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-5 h-5" />
                <span>support@eduai.com</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-5 h-5" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>123 Education Street, Learning City, 12345</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © 2024 EduAI. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link to="/about" className="text-gray-500 hover:text-gray-700 text-sm">About</Link>
              <Link to="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-500 hover:text-gray-700 text-sm">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}