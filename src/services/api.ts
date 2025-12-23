import { logoutAsync, refreshTokenAsync } from "@/store/slices/auth.slice";
import axios from "axios";

const axiosInstance = axios.create({

  baseURL: import.meta.env.VITE_API_URL || "https://api.dev.citygo-drive.com",

  headers: {
    "Content-Type": "application/json",
  },
});

let store;
let abortController = new AbortController();

export const resetAbortController = () => {
  abortController = new AbortController();
};

export const injectStore = (_store) => {
  store = _store;
};

export const hardLogout = async (dispatch) => {
  try {
    await dispatch(logoutAsync()).unwrap();
    abortController.abort();
    window.location.replace("/connexion");
  } catch (error) {
    console.log(error);
  }
};


let isRefreshing = false;
let refreshPromise = null;
let isLoggingOut = false;

export const handleDeconnection = () => {
  if (isLoggingOut) return;
  isLoggingOut = true;
  abortController.abort();
  localStorage.clear();
  window.location.replace("/connexion");
};

axiosInstance.interceptors.request.use(async (config) => {
  console.log("[AXIOS] Interceptor triggered", config.url);
  if (!store) return config;
  if (config.url?.includes("/auth/") && !config.url?.includes("/auth/logout")) {
    if (config.headers?.Authorization) {
      delete config.headers.Authorization;
    }
    return config;
  }

  const { accessToken, refreshToken, expiresIn } = store.getState().auth;
  const now = Math.floor(Date.now() / 1000);
  const timeUntilExpiry = expiresIn - now;
  const REFRESH_THRESHOLD = 2000;
  let token = accessToken;
  console.log("timeUntilExpiry", timeUntilExpiry);
  if (
    accessToken &&
    refreshToken &&
    timeUntilExpiry > 0 &&
    timeUntilExpiry < REFRESH_THRESHOLD
  ) {
    // console.log("preparation start");
    if (!isRefreshing) {
      isRefreshing = true;
      // console.log("preparation");
      refreshPromise = store
        .dispatch(refreshTokenAsync())
        .unwrap()
        .then((res) => {
          // console.log("res", res);
          console.log("[AUTH] Refresh OK");
          return res?.data?.accessToken;
        })
        .catch((err) => {
          console.error("[AUTH] Refresh failed", err);
          hardLogout(store.dispatch);
          throw err;
        })
        .finally(() => {
          isRefreshing = false;
        });
    }
    token = await refreshPromise;
    console.log("tokenFinal", token);
  }

  console.log("newExpirin", expiresIn);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // if (isLoggingOut) {
  //   return Promise.reject(new axios.Cancel("Logging out"));
  // }

  config.signal = abortController.signal;
  return config;
});


axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (isLoggingOut) {
      return Promise.reject(error);
    }

    if (
      error.response?.status === 401 &&
      !originalRequest.url?.includes("/auth/")
    ) {
      isLoggingOut = true;
      handleDeconnection();
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
