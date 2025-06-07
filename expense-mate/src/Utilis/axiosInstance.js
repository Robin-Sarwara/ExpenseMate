import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8080/api', // Fixed: Changed from 5000 to 8080
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

    // Only try to refresh if accessToken existed before
    const accessToken = localStorage.getItem('accessToken');
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      accessToken // Only refresh if there was a token
    ) {
      originalRequest._retry = true;
      try {
        const response = await axios.put('http://localhost:8080/api/refresh-token', {}, {
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