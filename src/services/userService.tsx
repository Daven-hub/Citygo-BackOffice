import axios from './api';
// import { BaseUrl } from '../config';

const API_URL = '/users/';

// Register user
const getAllUser = async () => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };
  const response = await axios.get (API_URL);
  return response.data;
};

const updateUser = async (id,userData) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };
  const response = await axios.put(API_URL+"?id=" + id, userData);
  return response.data;
};

// Login user
const getUserId = async (id) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };
  const response = await axios.get (API_URL+"?id=" + id);
  return response.data;
};

const deleteUserId = async (id) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };
  const response = await axios.delete (API_URL+"?id=" + id);
  return response.data;
};



const authService = {
  getAllUser,
  getUserId,
  updateUser,
  deleteUserId
};

export default authService;
