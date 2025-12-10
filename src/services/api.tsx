import axios from 'axios';
// import { useToast } from '../hook/use-toast';


// 👉 Crée une instance
const axiosInstance = axios.create({
  // baseURL: 'http://api.dev.citygo-drive.com'
  // baseURL: 'https://cng-ngc.org/api'
  baseURL:'http://api.dev.citygo-drive.com'
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