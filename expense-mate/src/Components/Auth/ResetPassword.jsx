import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGlobalLoading } from '../../Utilis/LoadingProvider';
import axiosInstance from '../../Utilis/axiosInstance';
import { showErrorToast, showSuccessToast } from '../../Utilis/toastMessage';
import Spinner from '../../Utilis/loading';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: '',    
    otp: ''               
  });
  const [email, setEmail] = useState('');
  
  const { loading, setLoading } = useGlobalLoading();
  const navigate = useNavigate();

  // ✅ Validate session on component mount
  useEffect(() => {
    const resetToken = sessionStorage.getItem('resetToken');
    const resetEmail = sessionStorage.getItem('resetEmail');
    
    if (!resetToken || !resetEmail) {
      showErrorToast('Invalid reset session. Please try again.');
      navigate('/forgot-password');
      return;
    }    
    setEmail(resetEmail);
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Validation
    if (!formData.newPassword) {
      showErrorToast('Please enter a new password');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      showErrorToast('Password must be at least 6 characters long');
      return;
    }
    
    if (!formData.otp) {
      showErrorToast('Please enter the OTP');
      return;
    }

    const resetToken = sessionStorage.getItem('resetToken');
    if (!resetToken) {
      showErrorToast('Session expired. Please try again.');
      navigate('/forgot-password');
      return;
    }

    setLoading(true);
    
    try {
      // ✅ Send correct data structure
      const response = await axiosInstance.put('/reset-password', {
        newPassword: formData.newPassword,  // ✅ Match backend expectation
        otp: formData.otp,
        resetToken: resetToken              // ✅ Get from sessionStorage
      });
      
      showSuccessToast(response.data.message || 'Password reset successful!');
      
      // ✅ Clear session data
      sessionStorage.removeItem('resetEmail');
      sessionStorage.removeItem('resetToken');
      
      setTimeout(() => {
        navigate('/login', { replace: true }); // ✅ replace: true is good here
      }, 2000);
      
    } catch (error) {
      showErrorToast(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Reset Password
          </h2>

          {/* ✅ Email display */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resetting password for:
            </label>
            <p className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-2 rounded-md border">
              {email || 'Loading...'}
            </p>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                name="otp"                    // ✅ Matches state field
                maxLength={6}
                value={formData.otp}          // ✅ Correct state access
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter 6-digit OTP"
              />
            </div>
            
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                name="newPassword"            // ✅ Matches state field
                value={formData.newPassword}  // ✅ Correct state access
                onChange={handleChange}
                required
                minLength={6}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your new password"
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Resetting Password..." : "Reset Password"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
