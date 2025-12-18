import axios from "./api";
const API_URL = "/admin/catalog";

const getAllVehicleType = async () => {
  try {
    const response = await axios.get(API_URL+'/vehicle-types');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
// const getAllVehicleType = async () => {
//   try {
//     const response = await axios.get(API_URL+'/vehicle-types');
//     return response.data;
//   } catch (error) {
//     throw error.response?.data || error;
//   }
// };
const updateRequest = async (id, userData) => {
  const response = await axios.patch(API_URL + "/kyc/requests/" + id, userData);
  return response.data;
};

const getRequestById = async (id) => {
  const response = await axios.get(API_URL + "/kyc/requests/" + id);
  return response.data;
};




const getAllDriverApplication = async () => {
  try {
    const response = await axios.get(API_URL+'/driver-applications');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const updateDriverApplication = async (id, data) => {
  const response = await axios.patch(API_URL + "/driver-applications/" + id, data);
  return response.data;
};

const getDriverApplicationById = async (id) => {
  const response = await axios.get(API_URL + "/driver-applications/" + id);
  return response.data;
};

const catalogueService = {
  getAllRequest,
  updateRequest,
  getRequestById,
  getAllDriverApplication,
  updateDriverApplication,
  getDriverApplicationById
};

export default catalogueService;