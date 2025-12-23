import axios from './api';

const register = async userData => {
  const response = await axios.post ('/auth/register', userData);
  // console.log(response)
  return response.data;
};

const login = async (userData) => {
  const response = await axios.post ('/auth/login', userData);
  // console.log('response',response)
  return response.data;
};

const refreshToken = async (userData) => {
  const response = await axios.post ('/auth/refresh', JSON.stringify(userData));
  console.log('responseRefresh',response)
  return response.data;
};

const logout = async(refreshToken) => {
  const response = await axios.post ('/auth/logout?refreshToken='+refreshToken);
  // console.log('response',response)
  return response.data;
};

const authService = {
  register,
  logout,
  refreshToken,
  login
};

export default authService;
