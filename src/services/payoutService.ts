import axios from "./api";
const API_URL = "/admin/payouts";

const getAll = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getById = async (payoutId) => {
  try {
    const response = await axios.get(API_URL +'/'+ payoutId);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const payoutCount = async () => {
  const response = await axios.get(API_URL+'/count');
  return response.data;
};

const approve = async (payoutId) => {
  const response = await axios.post(API_URL+'/'+ payoutId+'/approve');
  return response.data;
};

const reject = async (payoutId,data) => {
  const response = await axios.post(API_URL+'/'+ payoutId+'/reject', data);
  return response.data;
};
const batchapprove = async (data) => {
  const response = await axios.post(API_URL+'/batch-approve', data);
  return response.data;
};

const payoutService = {
  getAll,
  batchapprove,
  getById,
  reject,
  approve,
  payoutCount
};

export default payoutService;