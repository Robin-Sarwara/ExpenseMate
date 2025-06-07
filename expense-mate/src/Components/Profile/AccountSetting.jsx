import React, { useState } from 'react';
import { useUserDetails } from '../../Utilis/UserDetails';
import { showSuccessToast, showErrorToast } from '../../Utilis/toastMessage';
import axiosInstance from '../../Utilis/axiosInstance';
import Spinner from '../../Utilis/loading';
import { useGlobalLoading } from '../../Utilis/LoadingProvider';
import { useNavigate } from 'react-router-dom';

const AccountSetting = () => {
  const { userDetails, fetchUserDetails } = useUserDetails();
  const [username, setUsername] = useState(userDetails.userName || '');
  const { loading, setLoading } = useGlobalLoading();
  const [editUsername, setEditUsername] = useState(false);
  const [editField, setEditField] = useState(null); // 'email', 'phone', 'password'
  const navigate = useNavigate();

  const handleUsernameEdit = () => {
    setEditUsername(true);
  };

  const handleCancel = () => {
    setEditUsername(false);
    setUsername(userDetails.userName || '');
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosInstance.put('/update/user-data', { newName: username });
      showSuccessToast('Username updated successfully');
      setEditUsername(false);
      fetchUserDetails();
    } catch (error) {
      showErrorToast('Failed to update username');
    } finally {
      setLoading(false);
    }
  };

  // For sensitive fields (email, phone, password)
  const handleSensitiveEdit = async (field) => {
    setEditField(field);
    let preValue = '';
    if (field === 'email') preValue = userDetails.email || '';
    else if (field === 'phone') preValue = userDetails.phoneNumber || '';
    // Password: no prefill

    setLoading(true);
    try {
      let payload = {};
      // Always send OTP to the user's current email for all fields
      payload = { email: userDetails.email, subject: field };
      await axiosInstance.post('/send-otp', payload);
      showSuccessToast('OTP sent to your email');
      navigate('/account/update-details', { state: { field, preValue } });
    } catch (error) {
      showErrorToast(error?.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Spinner />}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center py-8">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Back to Home button */}
          <button
            className="mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition font-medium"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>
          <h2 className="text-3xl font-bold text-center text-blue-700 mb-8">Account Settings</h2>
          <div className="space-y-6">
            {/* Username */}
            <div className="flex items-center justify-between gap-4">
              <div className="w-1/3 font-semibold text-gray-700">Username</div>
              <div className="flex-1">
                {editUsername ? (
                  <input
                    type="text"
                    name="userName"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    autoFocus
                  />
                ) : (
                  <span className="text-gray-800">{userDetails.userName || '-'}</span>
                )}
              </div>
              <div>
                {editUsername ? (
                  <>
                    <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-1 rounded-md mr-2 hover:bg-blue-700 transition disabled:opacity-50">Save</button>
                    <button onClick={handleCancel} className="bg-gray-200 text-gray-700 px-4 py-1 rounded-md hover:bg-gray-300 transition">Cancel</button>
                  </>
                ) : (
                  <button onClick={handleUsernameEdit} className="bg-blue-100 text-blue-700 px-4 py-1 rounded-md hover:bg-blue-200 transition">Edit</button>
                )}
              </div>
            </div>
            {/* Email */}
            <div className="flex items-center justify-between gap-4">
              <div className="w-1/3 font-semibold text-gray-700">Email</div>
              <div className="flex-1">
                <span className="text-gray-800">{userDetails.email || '-'}</span>
              </div>
              <div>
                <button onClick={() => handleSensitiveEdit('email')} className="bg-blue-100 text-blue-700 px-4 py-1 rounded-md hover:bg-blue-200 transition">Edit</button>
              </div>
            </div>
            {/* Phone */}
            <div className="flex items-center justify-between gap-4">
              <div className="w-1/3 font-semibold text-gray-700">Phone</div>
              <div className="flex-1">
                <span className="text-gray-800">{userDetails.phoneNumber || '-'}</span>
              </div>
              <div>
                <button onClick={() => handleSensitiveEdit('phone')} className="bg-blue-100 text-blue-700 px-4 py-1 rounded-md hover:bg-blue-200 transition">Edit</button>
              </div>
            </div>
            {/* Password */}
            <div className="flex items-center justify-between gap-4">
              <div className="w-1/3 font-semibold text-gray-700">Password</div>
              <div className="flex-1">
                <span className="text-gray-800 tracking-widest select-none">••••••••</span>
              </div>
              <div>
                <button onClick={() => handleSensitiveEdit('password')} className="bg-blue-100 text-blue-700 px-4 py-1 rounded-md hover:bg-blue-200 transition">Edit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountSetting;
