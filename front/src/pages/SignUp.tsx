import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, GraduationCap } from 'lucide-react';
import { AxiosError, isAxiosError } from 'axios';
import { createuser } from '../services/userservice';

interface FormErrors {
  username: string;
  fullname: string;
  email: string;
  password: string;
  university: string;
  degree: string;
}

interface ApiError {
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    password: '',
    university: '',
    degree: '',
  });

  const [errors, setErrors] = useState<FormErrors>({
    username: '',
    fullname: '',
    email: '',
    password: '',
    university: '',
    degree: '',
  });

  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (apiError) {
      setApiError(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      username: '',
      fullname: '',
      email: '',
      password: '',
      university: '',
      degree: '',
    };

    let isValid = true;

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    }

    if (!formData.university.trim()) {
      newErrors.university = 'University is required';
      isValid = false;
    }

    if (!formData.degree) {
      newErrors.degree = 'Please select a degree';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      const response = await createuser(formData);
      console.log('User created:', response.data);
      navigate('/signin');
    } catch (error) {
      console.error('Signup error:', error);
      handleApiError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApiError = (error: unknown) => {
    if (isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiError>;
      if (axiosError.response) {
        const { status, data } = axiosError.response;
        switch (status) {
          case 400:
            if (data.errors) {
              const fieldErrors = data.errors.reduce(
                (acc, err) => ({ ...acc, [err.field]: err.message }),
                {} as Partial<FormErrors>
              );
              setErrors(prev => ({ ...prev, ...fieldErrors }));
            } else {
              setApiError(data.message || 'Invalid request. Please check your input.');
            }
            break;
          case 409:
            if (data.message) {
              if (data.message.toLowerCase().includes('username')) {
                setErrors(prev => ({ ...prev, username: data.message }));
              } else if (data.message.toLowerCase().includes('email')) {
                setErrors(prev => ({ ...prev, email: data.message }));
              } else {
                setApiError(data.message);
              }
            } else {
              setApiError('Username or email already exists');
            }
            break;
          case 500:
            setApiError('Server error. Please try again later.');
            break;
          default:
            setApiError(data?.message || 'An unexpected error occurred');
        }
      } else if (axiosError.request) {
        setApiError('Network error. Please check your internet connection.');
      } else {
        setApiError('Request failed. Please try again.');
      }
    } else if (error instanceof Error) {
      setApiError(error.message);
    } else {
      setApiError('An unknown error occurred during signup.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <UserPlus className="w-12 h-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {apiError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {apiError}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Enter your username"
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>

            {/* Full name */}
            <div>
              <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                value={formData.fullname}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.fullname ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Enter your full name"
              />
              {errors.fullname && <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                placeholder="Enter your password"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* University */}
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700">
                University
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCap className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="university"
                  name="university"
                  type="text"
                  value={formData.university}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 px-3 py-2 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                    errors.university ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your university"
                />
                {errors.university && (
                  <p className="mt-1 text-sm text-red-600">{errors.university}</p>
                )}
              </div>
            </div>

            {/* Degree (Radio buttons) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
              <div className="space-y-2 pl-2">
                {['Baccalaureate', 'Bachelor', 'Master', 'Engineer', 'Doctoral', 'Other'].map(
                  degree => (
                    <div key={degree} className="flex items-center">
                      <input
                        type="radio"
                        id={degree}
                        name="degree"
                        value={degree}
                        checked={formData.degree === degree}
                        onChange={handleChange}
                        className="h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label htmlFor={degree} className="ml-2 block text-sm text-gray-700">
                        {degree}
                      </label>
                    </div>
                  )
                )}
              </div>
              {errors.degree && <p className="mt-1 text-sm text-red-600">{errors.degree}</p>}
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </button>
            </div>
          </form>

          {/* Google Auth */}
          <div className="mt-6">
            <button
              onClick={() => {
                window.location.href = 'http://localhost:8080/oauth2/authorization/google';
              }}
              className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <img
                src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                alt="Google logo"
                className="h-5 w-5 mr-2"
              />
              Continue with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
