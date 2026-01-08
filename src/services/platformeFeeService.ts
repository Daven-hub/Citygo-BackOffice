import axios from "./api";
const API_URL = "/admin/platform-fees";

const getAll = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getById = async (feedId) => {
  try {
    const response = await axios.get(API_URL +'/'+ feedId);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const create = async (data) => {
  const response = await axios.post(API_URL,data);
  return response.data;
};

const feesCacheEvict = async () => {
  const response = await axios.post(API_URL+'/cache/evict');
  return response.data;
};

const getByType = async () => {
  try {
    const response = await axios.get(API_URL +'/by-type');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};
const updateById = async (feeId,data) => {
  const response = await axios.put(API_URL+'/'+feeId, data);
  return response.data;
};

const destroy = async (feeId) => {
  const response = await axios.delete(API_URL+'/'+feeId);
  return response.data;
};

const payoutService = {
  getAll,
  updateById,
  getById,
  destroy,
  getByType,
  feesCacheEvict,
  create
};

export default payoutService;