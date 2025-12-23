import axios from "../api";
const API_URL = "/admin/catalog/currencies/";

const getAll = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const create = async (userData) => {
  const response = await axios.post(API_URL, userData);
  return response.data;
};

const getById = async (id) => {
  try {
    const response = await axios.get(API_URL + id);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const deleteById = async (id) => {
  const response = await axios.delete(API_URL + id);
  return response.data;
};

const updateById = async (id, userData) => {
  const response = await axios.patch(API_URL + id, userData);
  return response.data;
};


const currencieService = {
  getAll,
  deleteById,
  getById,
  updateById,
  create
};

export default currencieService;