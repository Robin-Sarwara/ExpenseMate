import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalLoading } from '../../Utilis/LoadingProvider';  
import axiosInstance from '../../Utilis/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../Utilis/toastMessage';
import Spinner from '../../Utilis/loading';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const { loading, setLoading } = useGlobalLoading();

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      showErrorToast('Please enter your email address');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axiosInstance.post('/forget-password', { email });
      showSuccessToast('OTP sent to your email!');
      sessionStorage.setItem('resetEmail', email); // Store email for reset password
      sessionStorage.setItem('resetToken', response.data.resetToken); // Store token for reset password
      setTimeout(() => {
        navigate('/reset-password');
      }, 1500);
      
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <div className='min-h-screen bg-gray-100 flex items-center justify-center p-4'>
        <div className='w-full max-w-md p-8 bg-white rounded-lg shadow-lg'>
          <h1 className='text-2xl font-bold text-center text-gray-800 mb-6'>
            Forgot Password
          </h1>
          
          <p className='text-sm text-gray-600 text-center mb-6'>
            Enter your email address and we'll send you OTP to reset your password.
          </p>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className='block text-sm font-medium text-gray-700'>
                Email Address
              </label>
              <input 
                type="email" 
                id='email'
                name='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder='Enter your email address'
                className='mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgetPassword;
