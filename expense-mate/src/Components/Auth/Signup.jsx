import React from 'react';
import { useState } from 'react';
import { useGlobalLoading } from '../../Utilis/LoadingProvider';
import axiosInstance from '../../Utilis/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../Utilis/toastMessage';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from '../../Utilis/loading';

const Signup = () => {

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    phone:'',});
    const {loading, setLoading} = useGlobalLoading();

    const handleChange=(e)=>{
      setSignupData({...signupData, [e.target.name]: e.target.value});
    }

    const navigate = useNavigate();

    const handleSubmit=async(e)=>{
      e.preventDefault();
      setLoading(true)
      try {
        const response = await axiosInstance.post('/signup', signupData);
        showSuccessToast('Signup successful! Please log in.');
        setSignupData({
          name: '',
          email: '',
          password: '',
          phone: '',
        });
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      } catch (error) {
        showErrorToast(error.response?.data?.message || 'Signup failed');
      }
      finally{
        setLoading(false);
      }
    }

  return (
    <>{loading && <Spinner/>}
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              name='name'
              value={signupData.name}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              name='email'
              value={signupData.email}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              name='password'
              value={signupData.password}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              name='phone'
              value={signupData.phone}
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
             {loading ?"Creating account..." : "Sign Up"}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default Signup;