import { refreshTokenAsync } from "@/store/slices/auth.slice";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://api.dev.citygo-drive.com",
  headers: {
    "Content-Type": "application/json",
  },
});


let store;

export const injectStore = (_store) => {
  store = _store;
};

export const hardLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("expiresIn");

  window.location.replace("/connexion");
};

let isRefreshing = false;
let refreshPromise = null; 


axiosInstance.interceptors.request.use(async (config) => {
  if (!store) return config;

  const { accessToken, refreshToken, expiresIn } = store.getState().auth;
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = expiresIn - now;
  const REFRESH_THRESHOLD = 360;

  let token = accessToken;

  console.log('timeUntilExpiry',timeUntilExpiry)
  if (
    accessToken &&
    refreshToken &&
    timeUntilExpiry > 0 &&
    timeUntilExpiry < REFRESH_THRESHOLD
  ) {
    if (!isRefreshing) {
      isRefreshing = true;
      console.log('preparation')
      refreshPromise = store
        .dispatch(refreshTokenAsync())
        .unwrap()
        .then((res) => {
          console.log("[AUTH] Refresh OK");
          return res.data.accessToken;
        })
        .catch((err) => {
          console.error("[AUTH] Refresh failed", err);
          hardLogout();
          throw err;
        })
        .finally(() => {
          isRefreshing = false;
        });
    }

    token = await refreshPromise;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         const res = await store.dispatch(refreshTokenAsync()).unwrap();
//         const newToken = res.data.accessToken;

//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return axiosInstance(originalRequest);
//       } catch (err) {
//         console.error("[AUTH] Refresh 401 failed");
//         hardLogout();
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosInstance;
