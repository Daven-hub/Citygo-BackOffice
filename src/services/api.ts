import { refreshTokenAsync } from "@/store/slices/auth.slice";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://api.dev.citygo-drive.com",
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
  console.log("[AXIOS] Interceptor triggered", config.url);
  if (!store) return config;

  if (config.url?.includes("/auth/")) {
    if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }
    return config;
  }

  const { accessToken, refreshToken, expiresIn } = store.getState().auth;
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = expiresIn - now;
  const REFRESH_THRESHOLD = 100;
  let token = accessToken;
  console.log('timeUntilExpiry',timeUntilExpiry)
  if (
    accessToken &&
    refreshToken &&
    timeUntilExpiry > 0 &&
    timeUntilExpiry < REFRESH_THRESHOLD
  ) {
    console.log('preparation start')
    if (!isRefreshing) {
      isRefreshing = true;
      console.log('preparation')
      refreshPromise = store
        .dispatch(refreshTokenAsync())
        .unwrap()
        .then((res) => {
          console.log('res',res)
          console.log("[AUTH] Refresh OK");
          return res?.data?.accessToken;
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
    console.log('tokenFinal',token)
  }

  console.log('newExpirin',expiresIn)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// let isLoggingOut = false;

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // 🔒 Si déconnexion déjà en cours → on stop tout
//     if (isLoggingOut) {
//       return Promise.reject(error);
//     }

//     if (
//       error.response?.status === 401 &&
//       !originalRequest.url?.includes("/auth/")
//     ) {
//       isLoggingOut = true;
//       hardLogout();
//       return Promise.reject(error);
//     }

//     return Promise.reject(error);
//   }
// );


export default axiosInstance;
