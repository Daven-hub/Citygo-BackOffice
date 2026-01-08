import axios from "./api";
const API_URL = "/admin/settings";

const getAll = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getByKey = async (key) => {
  try {
    const response = await axios.get(API_URL +'/'+ key);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const categorie = async () => {
  const response = await axios.get(API_URL+'/categories');
  return response.data;
};

const evictCache = async () => {
  const response = await axios.post(API_URL+'/cache/evict');
  return response.data;
};

const updateByKey = async (key,data) => {
  const response = await axios.put(API_URL+'/'+ key, data);
  return response.data;
};


const settingService = {
  getAll,
  updateByKey,
  evictCache,
  categorie,
  getByKey
};

export default settingService;