// src/services/api.js
import {refreshTokenAsync } from "@/store/slices/auth.slice";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://cng-ngc.org/api/proxy.php?path=http://api.dev.citygo-drive.com",
  headers: {
    "Content-Type": "application/json",
  },
});

let store;
let logoutHandler = () => {};

export const injectStore = (_store) => {
  store = _store;
};
export const injectLogoutHandler = (handler) => {
  logoutHandler = handler;
};

let isRefreshing = false;
let refreshPromise = null; 

axiosInstance.interceptors.request.use(async (config) => {
  const state = store.getState().auth;
  const accessToken = state.accessToken;
  const expiresIn = state.expiresIn;
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = expiresIn - now;
  const REFRESH_THRESHOLD = 60;

  let token = accessToken;

  // Si le token est présent et expire bientôt (dans moins de 60s)
  if (accessToken && timeUntilExpiry < REFRESH_THRESHOLD && timeUntilExpiry > 0) {
    if (!isRefreshing) {
      isRefreshing = true;
      console.log("Token expire bientôt (<60s). Lancement du refresh...");
      refreshPromise = store.dispatch(refreshTokenAsync())
        .then((result) => {
          isRefreshing = false;
          refreshPromise = null;
          console.log('.data.accessToken',result?.data?.accessToken)
          return result?.data?.accessToken;
        })
        .catch((err) => {
          isRefreshing = false;
          refreshPromise = null;
          logoutHandler();
          throw err;
        });
    }

    token = await refreshPromise;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});


export default axiosInstance;
