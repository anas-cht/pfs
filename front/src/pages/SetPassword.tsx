import React, { useEffect,useState } from 'react';
import { Lock } from 'lucide-react';
import { useNavigate} from 'react-router-dom';
// import { setpassword } from '../services/userservice.ts';
import { useLocation } from 'react-router-dom';

function SetPassword() {
  const[email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedpassword, setConfirmedPassword] = useState('');
  const [error, setError] = useState('');
    const navigate = useNavigate();
      const [errors, setErrors] = useState({
        email: '',
        password: '',
        confirmedpassword:''
      });

        const location = useLocation();
        const queryParams = new URLSearchParams(location.search);
        const email2 = queryParams.get('email');
        useEffect(() => {
          if (email2) {
            setEmail(email2);
          }
        }, [email2]);
        


       
  // const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    // setSuccess(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmedpassword) {
      setError('Passwords do not match');
      return;
    }
      if(validateForm()){
      // setpassword({ email, password });
      navigate("/signin");}
    // Here you would typically make an API call to update the password
    // setSuccess(true);
    // setFormData({ email: '', password: '', confirmPassword: '' });
  };

  function validateForm() {
    let valid = true;
    const errorsCopy = { ...errors };



    if (email.trim()) {
      errorsCopy.email = '';
    } else {
      errorsCopy.email = 'Email is required';
      valid = false;
    }

    if (password.trim()) {
      errorsCopy.password = '';
    } else {
      errorsCopy.password = 'Password is required';
      valid = false;
    }

    if (confirmedpassword.trim()) {
      errorsCopy.confirmedpassword = '';
    } else {
      errorsCopy.confirmedpassword = 'Confirm Password is required';
      valid = false;
    }

    setErrors(errorsCopy);
    return valid;
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="flex items-center gap-3 mb-8">
        <Lock className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-900">Set Password</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value )}
              className={`appearance-none block w-full pl-10 px-3 py-2 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.email? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email address"
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div> */}

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange= {(e)=>setPassword(e.target.value)}
              className={`appearance-none block w-full pl-10 px-3 py-2 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}              
              placeholder="Enter your new password"
              required
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmedpassword}
              onChange={(e) => setConfirmedPassword( e.target.value )}
              className={`appearance-none block w-full pl-10 px-3 py-2 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                errors.confirmedpassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your new password"
              required
            />
            {errors.confirmedpassword && <p className="mt-1 text-sm text-red-600">{errors.confirmedpassword}</p>}
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">Password updated successfully!</p>
            </div>
          )} */}

          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Set Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default SetPassword;