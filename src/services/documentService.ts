import axios from "./api";
const API_URL = "/admin/documents";

const getAll = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const updateById = async (id, userData) => {
  const response = await axios.patch(API_URL + "/" + id, userData);
  return response.data;
};



const documentService = {
  getAll,
  updateById
};

export default documentService;