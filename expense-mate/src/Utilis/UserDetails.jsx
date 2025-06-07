import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "./axiosInstance";

const userContext = createContext();

// ✅ Custom hook to use user details
export const useUserDetails = () => {
  const context = useContext(userContext);
  if (!context) {
    throw new Error("useUserDetails must be used within UserDetailsProvider");
  }
  return context;
};

// ✅ Provider component
export const UserDetailsProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState({
    userId: "",
    userName: "",
    email: "",
    phoneNumber: "",
  });

  const [loading, setLoading] = useState(true);

  const fetchUserDetails = async () => { 
    try {
        const token = localStorage.getItem("accessToken");
        if(!token){
        setLoading(false);
        return;
    }

      setLoading(true);
      const response = await axiosInstance.get("/userdata");
      console.log("API Response:", response.data); // Debug log

      // ✅ Handle the nested user object structure
      const userData = response.data.user; // Based on your API response structure

      const updatedDetails = {
        userId: userData._id,
        userName: userData.name,
        email: userData.email,
        phoneNumber: userData.phone,
      };

      setUserDetails(updatedDetails);
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      fetchUserDetails();
  }, []);

  const contextValue = {
    userDetails,
    loading,
    setUserDetails,
    fetchUserDetails,
  };

  return (
    <userContext.Provider value={contextValue}>{children}</userContext.Provider>
  );
};
