import axios from './api';
import { URL_L } from './route';

const register = async userData => {
  const response = await axios.post ('/auth/register', userData);
  // console.log(response)
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post ('/auth/login', userData);
  // console.log(response)
  return response.data;
};

const logout = () => {
  localStorage.removeItem ('user');
};

const authService = {
  register,
  logout,
  login
};

export default authService;
