import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../Utilis/axiosInstance";
import { showErrorToast, showSuccessToast } from "../../Utilis/toastMessage";
import { useAuth } from "../../Utilis/AuthProvider"; // Add this import
import Spinner from "../../Utilis/loading";
import { useGlobalLoading } from "../../Utilis/LoadingProvider";
import { useUserDetails } from "../../Utilis/UserDetails";
import { usePeriodAnalytics } from "../../Utilis/PeriodAnalytics";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Add this hook
  const { loading, setLoading } = useGlobalLoading(); // Use the global loading state
  const [correctPassword, setcorrectPassword] = useState(true);
  const{fetchUserDetails} = useUserDetails();
  const{getPeriodAnalytics} = usePeriodAnalytics();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/login", formData);
      const { accessToken } = response.data;
      login(accessToken);
      showSuccessToast("Login successful!");
      navigate("/home", { replace: true });
      await fetchUserDetails();
      await getPeriodAnalytics();
    } catch (error) {
      showErrorToast(error.response?.data?.message || "Login failed");
      setcorrectPassword(false);
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
            Login
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-start text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                onChange={handleChange} // Fixed: was 'onchange'
                value={formData.email}
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-start text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange} // Fixed: was 'onchange'
                required
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading} // Added disabled state
                className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          {/* Add centering wrapper div */}
          {!correctPassword && (
            <div className="mt-4 text-center">
              <Link
                to="/forget-password"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
              >
                Forget Password?
              </Link>
            </div>
          )}

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
