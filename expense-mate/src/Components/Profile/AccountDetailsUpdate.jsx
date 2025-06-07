import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../Utilis/axiosInstance";
import { showSuccessToast, showErrorToast } from "../../Utilis/toastMessage";
import Spinner from "../../Utilis/loading";
import { useGlobalLoading } from "../../Utilis/LoadingProvider";

const fieldLabels = {
  email: "New Email",
  phone: "New Phone Number",
  password: "New Password",
};

const AccountDetailsUpdate = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setLoading, loading } = useGlobalLoading();
  const field = location.state?.field || "email";
  const preValue = location.state?.preValue || "";

  const [value, setValue] = useState(preValue);
  const [otp, setOtp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  React.useEffect(() => {
    setValue(preValue);
    setOtp("");
    setConfirmPassword("");
    setFormError("");
  }, [field, preValue]);

  // Validate input before update
  const validateInput = () => {
    if (field === "email") {
      if (!/^\S+@\S+\.\S+$/.test(value)) {
        setFormError("Please enter a valid email address.");
        return false;
      }
    } else if (field === "phone") {
      if (!/^\d{10,15}$/.test(value)) {
        setFormError("Please enter a valid phone number.");
        return false;
      }
    } else if (field === "password") {
      if (value.length < 6) {
        setFormError("Password must be at least 6 characters.");
        return false;
      }
      if (value !== confirmPassword) {
        setFormError("Passwords do not match.");
        return false;
      }
    }
    if (!otp) {
      setFormError("Please enter the OTP.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;
    setLoading(true);
    try {
      let payload = { otp };
      if (field === "email") payload.newEmail = value;
      else if (field === "phone") payload.newPhone = value;
      else if (field === "password") payload.newPassword = value;
      await axiosInstance.put("/update/user-data", payload);
      showSuccessToast(`${fieldLabels[field]} updated successfully`);
      setTimeout(() => {
        navigate("/account");
        // TODO: Prefer context or event to refresh user details instead of reload
        setTimeout(() => window.location.reload(), 300);
      }, 1200);
    } catch (err) {
      // Show backend error message if present
      setFormError(
        err?.response?.data?.message || "Failed to update"
      );
    } finally {
      setLoading(false);
    }
  };

  // Design improvements: use simple labels above inputs, better spacing
  return (
    <>
      {loading && <Spinner />}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-indigo-100 py-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 relative">
          {/* Back button */}
          <button
            className="mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition font-medium"
            onClick={() => navigate(-1)}
            type="button"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-center text-blue-700 mb-8">
            Update {fieldLabels[field]}
          </h1>
          <form className="space-y-6" onSubmit={handleUpdate}>
            {formError && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-center animate-pulse">{formError}</div>
            )}
            {/* Input for new value */}
            {(field === "email" || field === "phone" || field === "password") && (
              <div className="flex flex-col gap-1">
                <label className="text-gray-700 font-medium mb-1">
                  {fieldLabels[field]}
                </label>
                <input
                  type={field === "password" ? "password" : field === "email" ? "email" : "text"}
                  name={field}
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-lg"
                  placeholder={fieldLabels[field]}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            )}
            {/* Confirm password for password change */}
            {field === "password" && (
              <div className="flex flex-col gap-1">
                <label className="text-gray-700 font-medium mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 text-lg"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            {/* OTP input */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-700 font-medium mb-1">
                OTP (Check your email)
              </label>
              <input
                type="text"
                name="otp"
                className="border border-gray-300 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50 text-lg tracking-widest"
                placeholder="Enter OTP"
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                maxLength={6}
                pattern="\d{6}"
                inputMode="numeric"
              />
            </div>
            <div className="flex items-center gap-4 mt-2 justify-center">
              <button
                type="submit"
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition font-semibold shadow-lg text-lg"
                disabled={loading}
              >
                Update {fieldLabels[field]}
              </button>
              <button
                type="button"
                className="bg-gray-200 text-gray-700 px-8 py-2 rounded-lg hover:bg-gray-300 transition font-semibold shadow-md text-lg"
                onClick={() => navigate("/account")}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AccountDetailsUpdate;
