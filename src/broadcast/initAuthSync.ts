// import { authChannel, AUTH_EVENTS } from "@/lib/authChannel";
import { logoutAsync, refreshTokenAsync } from "@/store/slices/auth.slice";
import { store } from "@/store";
import { AUTH_EVENTS, authChannel } from "./authChannel";

export const initAuthSync = () => {
  authChannel.onmessage = (event) => {
    const { type, payload } = event.data;

    if (type === AUTH_EVENTS.REFRESH_SUCCESS) {
      store.dispatch(refreshTokenAsync());
    }

    if (type === AUTH_EVENTS.LOGOUT) {
      store.dispatch(logoutAsync());
      window.location.replace("/connexion");
    }
  };
};
