import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL,
    headers:{
        'Content-Type': 'application/json',
    },
    withCredentials: true, // This is important for sending cookies
});

//Request interceptor to add access token 
axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

//Response interceptor for refreshing token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const accessToken = localStorage.getItem('accessToken');
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      accessToken
    ) {
      originalRequest._retry = true;
      try {
        const refreshUrl = `${baseURL.replace(/\/$/, '')}/refresh-token`;
        const response = await axios.put(refreshUrl, {}, {
          withCredentials: true,
        });
        const { accessToken: newToken } = response.data;
        localStorage.setItem('accessToken', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;