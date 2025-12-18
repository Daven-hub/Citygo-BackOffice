import {configureStore} from '@reduxjs/toolkit';
import authReducer from '@/store/slices/auth.slice';
import usersReducer from '@/store/slices/user.slice';
import kycReducer from '@/store/slices/kyc.slice';
// import { injectStore } from '@/services/api';

export const store = configureStore ({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    kyc: kycReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
