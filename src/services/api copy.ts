// src/services/api.js (ou le nom de votre fichier)
import { logoutAsync, refreshTokenAsync } from "@/store/slices/auth.slice";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://cng-ngc.org/api/proxy.php?path=http://api.dev.citygo-drive.com",
  headers: {
    "Content-Type": "application/json",
  },
});

let store;

export const injectStore = (_store) => {
  store = _store;
};

// --- NOUVELLE LOGIQUE POUR GÉRER LA CONCURRENCE ---
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Interceptor de Requête (pour ajouter le token initial)
axiosInstance.interceptors.request.use((config) => {
    const state = store.getState().auth;
    if (state.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});


// Intercepteur de Réponse (la logique robuste)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si l'erreur est 401 ET que nous n'avons pas déjà marqué cette requête pour retry
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Si nous sommes déjà en train de rafraîchir, on met la requête en attente
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          // Quand le refresh est fini, on ré-exécute la requête originale avec le nouveau token
          originalRequest.headers.Authorization = 'Bearer ' + token;
          return axiosInstance(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      // Sinon, on initie le processus de rafraîchissement
      isRefreshing = true;

      try {
        const result = await store.dispatch(refreshTokenAsync()).unwrap();
        const newAccessToken = result.accessToken;

        isRefreshing = false;
        processQueue(null, newAccessToken); // Vide la file d'attente et relance tout

        // Ré-exécute la requête originale qui a causé l'erreur 401
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);

      } catch (err) {
        isRefreshing = false;
        processQueue(err); // Vide la file d'attente avec l'erreur
        await store.dispatch(logoutAsync()); // Déconnecte l'utilisateur
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
