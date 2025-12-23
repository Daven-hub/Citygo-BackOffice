export const authChannel = new BroadcastChannel("auth_channel");

export const AUTH_EVENTS = {
  REFRESH_START: "REFRESH_START",
  REFRESH_SUCCESS: "REFRESH_SUCCESS",
  LOGOUT: "LOGOUT",
};
