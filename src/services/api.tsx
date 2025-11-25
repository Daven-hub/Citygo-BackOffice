import axios from 'axios';
// import { useToast } from '../hook/use-toast';


// 👉 Crée une instance
const axiosInstance = axios.create({
  baseURL: '/api'
  // baseURL: 'http://localhost:83/api'
  // headers: {
  //   'Content-Type': 'application/json',
  // },
});


axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Une erreur est survenue';

    if (
      error.response &&
      error.response.data &&
      typeof error.response.data === 'object'
    ) {
      message = error.response.data.message || message;
    }

    return Promise.reject(message);
  }
);

export default axiosInstance;