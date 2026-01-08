import axios from "./api";
const API_URL = "/places";

const autocomplete = async () => {
  try {
    const response = await axios.get(API_URL+'/autocomplete');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
const pending = async () => {
  try {
    const response = await axios.get(API_URL+'/admin/pending');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getById = async (placeId) => {
  try {
    const response = await axios.get(API_URL +'/'+ placeId);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const pendingCount = async () => {
  const response = await axios.get(API_URL+'/admin/pending/count');
  return response.data;
};

const approve = async (id) => {
  const response = await axios.put(API_URL+'/admin/'+ id+'/approve');
  return response.data;
};

const reject = async (id,data) => {
  const response = await axios.put(API_URL+'/admin/'+ id+'/reject', data);
  return response.data;
};
const placeByStatus = async (status) => {
  const response = await axios.get(API_URL+'/admin/by-status/'+status);
  return response.data;
};

const placeService = {
  autocomplete,
  placeByStatus,
  getById,
  reject,
  approve,
  pendingCount,
  pending
};

export default placeService;