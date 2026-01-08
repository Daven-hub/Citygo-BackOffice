import axios from "./api";
const API_URL = "/admin/refunds";

const getAll = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getById = async (id) => {
  try {
    const response = await axios.get(API_URL +'/'+ id);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const refundCount = async () => {
  const response = await axios.get(API_URL+'/count');
  return response.data;
};

const process = async (id) => {
  const response = await axios.post(API_URL+'/'+id+'/process');
  return response.data;
};

const batcProcess = async (data) => {
  const response = await axios.put(API_URL+'/batch-process', data);
  return response.data;
};


const refundService = {
  getAll,
  getById,
  refundCount,
  process,
  batcProcess
};

export default refundService;