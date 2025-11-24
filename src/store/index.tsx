import {configureStore} from '@reduxjs/toolkit';
import authReducer from '@/store/slices/auth.slice';
import usersReducer from '@/store/slices/user.slice';

export const store = configureStore ({
  reducer: {
    auth: authReducer,
    users: usersReducer,
  },
  devTools: true,
});
