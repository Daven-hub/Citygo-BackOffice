import axios from "./api";
const API_URL = "/admin/chat";

const getAll = async () => {
  try {
    const response = await axios.get(API_URL+'/conversations');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const create = async (data) => {
  try {
    const response = await axios.post(API_URL +'/conversations',data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getMessageById = async (id) => {
  try {
    const response = await axios.get(API_URL+'/conversations/'+id+'/messages');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const createMessageById = async (id,data) => {
  try {
    const response = await axios.get(API_URL+'/conversations/'+id+'/messages');
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const chatService = {
  getAll,
  create,
  getMessageById,
  createMessageById
};

export default chatService;