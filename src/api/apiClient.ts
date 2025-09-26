import axios from 'axios';
import { Cookies } from "react-cookie";
import { toast } from 'react-toastify';
const cookies = new Cookies();  
const accessToken = cookies.get("accessToken");  
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API,
  headers: {
    'Content-Type': 'application/json',
  },
});
apiClient.interceptors.request.use(
  config => {
    if (accessToken) {
      config.headers['Authorization'] = 'Bearer ' + accessToken
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;

    if (!expectedError) {
      toast.error('An unexpected error occurred.');
    } else if (error.response.status === 401) {
      // Handle unauthorized errors, e.g., redirect to login
      toast.warn('Unauthorized. Please login in again.');
      // Optionally, redirect: window.location = '/login';
    } else if (error.response.data && error.response.data.message) {
      toast.error(error.response.data.message);
    } else {
      toast.error('An error occurred during the request.');
    }

    return Promise.reject(error);
  }
);
export default apiClient