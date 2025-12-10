import axios from "./api";
// import { BaseUrl } from '../config';

const API_URL = "/admin";

const getAllUser = async (token) => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      },
    };
    const response = await axios.get(API_URL+'/users',config);
    console.log("response1", "test");
    // ?page=0&size=20
    console.log("response", response);

    return response.data;
  } catch (error) {
    // Gestion d'erreur améliorée
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error.response?.data || error;
  }
};

const updateUser = async (id, userData) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };
  const response = await axios.put(API_URL + "?id=" + id, userData);
  return response.data;
};

// Login user
const getUserId = async (id,token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL + "/users/" + id,config);
  return response.data;
};

const deleteUserId = async (id) => {
  // const config = {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // };
  const response = await axios.delete(API_URL + "/users/" + id);
  return response.data;
};

const authService = {
  getAllUser,
  getUserId,
  updateUser,
  deleteUserId,
};

export default authService;

// const config = {
//   headers: {
//     Authorization: `Bearer ${token}`,
//     'Content-type':'application/json'
//   },
// };
// const response = await axios.get ("/admin/users?page=0&size=20",config);
// console.log('response1','test')
// console.log('response',response)
// return response.data;
