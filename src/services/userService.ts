import axios from "./api";
const API_URL = "/admin";

const getAllUser = async (token) => {
  try {
    const response = await axios.get(API_URL+'/users');
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    throw error.response?.data || error;
  }
};

const updateUser = async (id, userData) => {
  const response = await axios.put(API_URL + "?id=" + id, userData);
  return response.data;
};

const getUserId = async (id,token) => {
  const response = await axios.get(API_URL + "/users/" + id);
  return response.data;
};

const deleteUserId = async (id) => {
  const response = await axios.delete(API_URL + "/users/" + id);
  return response.data;
};

const suspendUserById = async (userId,datas)=>{
   const response = await axios.post(API_URL + "/users/" + userId+'/suspend',datas);
   return response.data;
}

const unSuspendUserById = async (userId)=>{
   const response = await axios.post(API_URL + "/users/" + userId+'/suspend');
   return response.data;
}

const updateLocalFlag = async (userId,datas)=>{
   const response = await axios.patch(API_URL + "/users/" + userId,datas);
   return response.data;
}

const getUserActivityLog = async (userId)=>{
   const response = await axios.get(API_URL + "/users/" + userId+'/activity');
   return response.data;
}

const authService = {
  getAllUser,
  getUserId,
  updateUser,
  deleteUserId,
  suspendUserById,
  unSuspendUserById,
  updateLocalFlag,
  getUserActivityLog
};

export default authService;