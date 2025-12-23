import axios from "./api";
const API_URL = "/admin/vehicles/";

const getAll = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getById = async (vehicleIdid) => {
  try {
    const response = await axios.get(API_URL + vehicleIdid);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const pendingReview = async () => {
  const response = await axios.get(API_URL+'/pending-review');
  return response.data;
};

const updateStatus = async (vehicleId,status,userData) => {
  const response = await axios.post(API_URL+ vehicleId+'/'+status, userData);
  return response.data;
};

const metric = async () => {
  const response = await axios.get(API_URL+'/metrics');
  return response.data;
};

const vehicleService = {
  getAll,
  updateStatus,
  getById,
  metric,
  pendingReview
};

export default vehicleService;