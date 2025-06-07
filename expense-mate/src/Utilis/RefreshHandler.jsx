import React, { useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';

const RefreshHandler = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) { // Wait for auth check to complete
      
      // 🔓 Define auth pages that don't require login
      const authPages = ['/login', '/signup', '/forgot-password', '/reset-password'];
      const isAuthPage = authPages.includes(location.pathname);
      
      if (isAuthenticated) {
        // ✅ Redirect authenticated users away from auth pages to /home
        if (isAuthPage) {
          navigate("/home", { replace: true });
        }
        // ✅ Handle root redirect to /home
        if (location.pathname === "/") {
          navigate("/home", { replace: true });
        }
      } else {
        // ✅ Redirect unauthenticated users to login (from ANY protected page)
        if (!isAuthPage) {
          navigate("/login", { replace: true });
        }
      }
    }
  }, [location.pathname, isAuthenticated, loading, navigate]);

  return children;
};

export default RefreshHandler;
