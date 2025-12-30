import {configureStore} from '@reduxjs/toolkit';
import authReducer from '@/store/slices/auth.slice';
import usersReducer from '@/store/slices/user.slice';
import kycReducer from '@/store/slices/kyc.slice';
// import { injectStore } from '@/services/api';
import currencieReducer from '@/store/slices/catalogue/currencie.slice';
import languageReducer from '@/store/slices/catalogue/language.slice';
import luggageTypeReducer from '@/store/slices/catalogue/luggageType.slice';
import vehicleTypeReducer from '@/store/slices/catalogue/vehicleType.slice';
import vehicleReducer from '@/store/slices/vehicles.slice';
import documentReducer from '@/store/slices/document.slice';

export const store = configureStore ({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    kyc: kycReducer,
    currencie: currencieReducer,
    language: languageReducer,
    luggageType: luggageTypeReducer,
    vehicleType: vehicleTypeReducer,
    vehicle: vehicleReducer,
    document: documentReducer
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
