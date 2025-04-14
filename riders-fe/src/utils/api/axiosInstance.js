import axios from 'axios';

// Create an axios instance with default config
const backendUrl =  import.meta.env.VITE_API_URL;
console.log(backendUrl);

const axiosInstance = axios.create({
  baseURL: `${backendUrl}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});


export default axiosInstance;