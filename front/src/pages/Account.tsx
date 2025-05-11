import React, { useState, useEffect } from 'react';
import { User, Settings,Shield } from 'lucide-react';
// import { useNavigate} from 'react-router-dom';
import { useAuth } from '../context/authcontext';
import { updateuser, updatepassword ,removeuser } from '../services/userservice';
import axios, { AxiosError } from 'axios';
import { useUserinfo } from '../context/userinfocontext';


interface UserData {
  id?: number;
  username: string;
  fullname: string;
  email: string;
  degree: string;
  university: string;
  password?: string;
}

interface ApiError {
  message: string;
  errors?: { field: string; message: string }[];
}

interface FormErrors {
  username: string;
  fullname: string;
  email: string;
  degree: string;
  university: string;
  password?: string;
}

function isAxiosError(error: unknown): error is AxiosError<ApiError> {
  return axios.isAxiosError(error);
}


function Account() {
  const [activeTab, setActiveTab] = useState('profile');
  const { user, logout } = useAuth();
  const {userinfo} =useUserinfo();
  const [formData, setFormData] = useState<UserData>({
    id: 0,
    username: '',
    fullname: '',
    email: '',
    degree: '',
    university: '',
  });
  

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({
    username: '',
    fullname: '',
    email: '',
    degree: '',
    university: '',
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);


  // const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        username: user.username || '',
        fullname: user.fullname || '',
        email: user.email || '',
        degree: user.degree || '',
        university: user.university || '',
      });
    }
  }, [user]);


  const handleUpdateUser = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    setError(null);
    setApiError(null);
    setSuccess(false);

    try {
      if (validateForm()) {
        const response = await updateuser({ ...formData, id: user.id });

        setFormData({
          username: response.data.username,
          fullname: response.data.fullname,
          email: response.data.email,
          degree: response.data.degree,
          university: response.data.university,
        });

        const unchanged =
          formData.email === user.email &&
          formData.username === user.username &&
          formData.fullname === user.fullname &&
          formData.degree === user.degree &&
          formData.university === user.university;

        if (unchanged) {
          setError('Failed to update user.');
        } else {
          user.email = response.data.email;
          user.fullname = response.data.fullname;
          user.username = response.data.username;
          user.degree = response.data.degree;
          user.university = response.data.university;
          setSuccess(true);
        }
      }
    } catch (err) {
      setError('Failed to update user. Please try again.');
      console.error('Update error:', err);
      handleApiError(err);
    } finally {
      setIsLoading(false);
    }
  };

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };

    if (formData.username.trim()) {
      errorsCopy.username = '';
    } else {
      errorsCopy.username = 'Username is required';
      valid = false;
    }

    if (formData.fullname.trim()) {
      errorsCopy.fullname = '';
    } else {
      errorsCopy.fullname = 'Full name is required';
      valid = false;
    }

    if (formData.email.trim()) {
      errorsCopy.email = '';
    } else {
      errorsCopy.email = 'Email is required';
      valid = false;
    }

    if (formData.degree.trim()) {
      errorsCopy.degree = '';
    } else {
      errorsCopy.degree = 'Degree is required';
      valid = false;
    }

    if (formData.university.trim()) {
      errorsCopy.university = '';
    } else {
      errorsCopy.university = 'University is required';
      valid = false;
    }

    setErrors(errorsCopy);
    return valid;
  }

  const handleApiError = (error: unknown) => {
    if (isAxiosError(error)) {
      const { response } = error;
      if (response) {
        const { status, data } = response;
        console.log('API error response:', status, data);

        switch (status) {
          case 400:
            if (data.errors) {
              const fieldErrors = data.errors.reduce((acc, err) => ({
                ...acc,
                [err.field]: err.message,
              }), {} as Partial<FormErrors>);
              setErrors(prev => ({ ...prev, ...fieldErrors }));
            } else {
              setApiError(data.message || 'Invalid request.');
            }
            break;

          case 409:
            if (data.message.toLowerCase().includes('username')) {
              setErrors(prev => ({ ...prev, username: data.message }));
            } else if (data.message.toLowerCase().includes('email')) {
              setErrors(prev => ({ ...prev, email: data.message }));
            } else {
              setApiError(data.message);
            }
            break;

          case 500:
            setApiError('Server error. Please try again later.');
            break;

          default:
            setApiError(data?.message || 'An unexpected error occurred');
        }
      } else {
        setApiError('Network error. Please check your connection.');
      }
    } else if (error instanceof Error) {
      setApiError(error.message);
    } else {
      setApiError('An unknown error occurred.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDeleteAccount = async () => {
    if (!user?.id)  setDeleteError('Failed to delete account. Please try again.');
    ;
    
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      await removeuser({ ...formData });
      // Only call logout after successful deletion
      logout();
    } catch (err) {
      console.error('Delete account error:', err);
      setDeleteError('Failed to delete account. Please try again.');
      setShowConfirm(false);
      handleApiError(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Account Settings</h2>
      <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
        {[
          { id: 'profile', label: 'Profile', icon: <User size={16} /> },
          { id: 'preferences', label: 'Preferences', icon: <Settings size={16} /> },
          // { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
          { id: 'security', label: 'Security', icon: <Shield size={16} /> },
        ].map((tab) => {
          const showRedDot =
            tab.id === 'profile' &&
            (!user?.degree?.trim() || !user?.university?.trim()) ||
            tab.id === 'security' &&
            (user?.password == null || user.password === "");

          return (
            <button
              key={tab.id}
              className={`relative mr-4 py-2 px-4 font-semibold flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500 hover:text-blue-500'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label}
              {showRedDot && (
                <span className="absolute top-1 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          );
        })}
      </div>

      {activeTab === 'profile' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateUser();
          }}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${
                errors.fullname ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fullname && (
              <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border p-2 rounded ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Degree</label>
            <div
              className={`space-y-2 p-2 rounded ${
                errors.degree || !formData.degree ? 'border border-red-500 bg-red-50' : ''
              }`}
            >
              {['Baccalaureate', 'Bachelor', 'Master', 'Engineer', 'Doctoral', 'Other'].map((option) => (
                <label key={option} className="inline-flex items-center">
                  <input
                    type="radio"
                    name="degree"
                    value={option}
                    checked={formData.degree === option}
                    onChange={handleChange}
                    className="form-radio text-blue-600"
                  />
                  <span className="ml-2">{option}</span>
                </label>
              ))}
            </div>
            {errors.degree && (
              <p className="text-red-500 text-sm mt-1">{errors.degree}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">University</label>
            <input
              type="text"
              name="university"
              value={formData.university}
              onChange={handleChange}
              placeholder={!formData.university ? 'University is required' : ''}
              className={`w-full border p-2 rounded placeholder-red-400 ${
                errors.university || !formData.university ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.university && (
              <p className="text-red-500 text-sm mt-1">{errors.university}</p>
            )}
          </div>

          {apiError && <p className="text-red-600 text-sm">{apiError}</p>}
          {success && (
            <p className="text-green-600 text-sm">Account updated successfully!</p>
          )}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      )}

      {activeTab === 'security' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPasswordError(null);
            setPasswordSuccess(null);

            if (!password || !confirmPassword) {
              setPasswordError('Please fill out both password fields.');
              return;
            }

            if (password !== confirmPassword) {
              setPasswordError('Passwords do not match.');
              return;
            }
            formData.password = password;
            user.password = password;
            updatepassword({ ...formData })
              .then(() => {
                setPasswordSuccess('Password updated successfully!');
                setPassword('');
                setConfirmPassword('');
              })
              .catch(() => {
                setPasswordError('Failed to update password. Please try again.');
              });
          }}
          className="space-y-6"
        >
          {user?.password === '' || user?.password == null ? (
            <p className="text-red-600 text-sm">Set your password</p>
          ) : (
            <p>Change your password</p>
          )}

          {passwordError && <p className="text-red-600 text-sm">{passwordError}</p>}
          {passwordSuccess && <p className="text-green-600 text-sm">{passwordSuccess}</p>}

          <div>
            <label className="block text-sm font-medium mb-1">New Password</label>
            <input
              type="password"
              name="password"
              className="w-full border p-2 rounded border-gray-300"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              className="w-full border p-2 rounded border-gray-300"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update Password
          </button>

          <div className="mt-6">
            <button
              type="button"
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 relative"
              onClick={() => setShowConfirm(true)}
              // onBlur={(e) => {
              //   // Only hide if the related target is not within the confirm dialog
              //   if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              //     setShowConfirm(false);
              //   }
              // }}
            >
              Delete Account
            </button>

            {showConfirm && (
              <div className="mt-2 p-4 border border-red-300 bg-red-50 rounded shadow-sm">
                <p className="text-sm text-red-700 mb-2">
                  Are you sure you want to delete your account?
                </p>
                {deleteError && <p className="text-red-600 text-sm mb-2">{deleteError}</p>}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteAccount()}
                    disabled={isDeleting}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirm(false)}
                    className="px-3 py-1 border rounded hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      )}
  {activeTab === 'preferences' && (
  <div className="space-y-6">
    {/* Interests Section */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center">
          <svg 
            className="w-5 h-5 mr-2 text-indigo-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" 
            />
          </svg>
          My Interests
        </h3>
      </div>
      <div className="p-5">
        {userinfo?.interests ? (
          <div className="flex flex-wrap gap-2">
            {userinfo.interests.split(',').map((interest, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-200"
              >
                {interest.trim()}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 italic">
            You haven't added any interests yet
          </p>
        )}
      </div>
    </div>

    {/* Skills Section */}
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 flex items-center">
          <svg 
            className="w-5 h-5 mr-2 text-emerald-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
            />
          </svg>
          My Skills
        </h3>
      </div>
      <div className="p-5">
        {userinfo?.skills ? (
          <div className="flex flex-wrap gap-2">
            {userinfo.skills.split(',').map((skill, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-50 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
              >
                {skill.trim()}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 italic">
            You haven't added any skills yet
          </p>
        )}
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default Account;
