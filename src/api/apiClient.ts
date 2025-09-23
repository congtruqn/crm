import axios from 'axios';
import { Cookies } from "react-cookie";  
const cookies = new Cookies();  
const accessToken = cookies.get("accessToken");  
const apiClient = axios.create({
  baseURL: 'http://develop.softnests.com/api',
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
export default apiClient