import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '@/services/authService';

const userFromStorage= localStorage.getItem("user")
// user: userFromStorage ? JSON.parse(userFromStorage) : null,


const initialState = {
  user:  userFromStorage ? JSON.parse(userFromStorage) : null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("accessToken") || null,
  expiresIn: 0,
  users:[],
  authStatus: "ndle",
  // statusR:false,
  // error: null,
}

export const registerApp = createAsyncThunk (
  'auth/register',
  async (datas, thunkAPI) => {
    try {
      const response= await authService.register(datas);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error);
      }else{
        return response;
      }
    } catch (err) {
      const message =
        (err.response &&
          err.response.data &&
          err.response.data.message) ||
        err.message ||
        err.toString ();
      return thunkAPI.rejectWithValue (message);
    }
  }
);


export const login = createAsyncThunk(
  'auth/login',
  async (payload, thunkAPI) => {
    try {
      const response= await authService.login(payload);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }else{
        return response;
      }
    } catch (err) {
      console.log('err',err)
      const message =
        err.response?.data?.message ||
        err.message ||
        "Problem de connexion au serveur";
      return thunkAPI.rejectWithValue(message);
    }
    
  }
);


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresIn = 0;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('csrf');
      localStorage.removeItem('user');
    },
    reset: (state) => {
      state.users=[]
    }
  },
  extraReducers: builder => {
    builder
      .addCase (registerApp.pending, state => {
        state.authStatus = "loading";
      })
      .addCase (registerApp.fulfilled, (state, action) => {
        state.authStatus = "success";
        state.users.unshift (action.payload.result);
      })
      .addCase (registerApp.rejected, (state, action) => {
        state.authStatus = "success";
        // state.error = action.payload || action.error.message || "Erreur de connexion";
      })
      .addCase(login.pending, (state) => {
        state.authStatus = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authStatus = "success";
        // state.user= action.payload.user;
        // state.accessToken = action.payload.token;
        // state.refreshToken = action.payload.csfr;
        // localStorage.setItem('accessToken', action.payload.token);
        // localStorage.setItem('refreshToken', action.payload.csfr);
        // localStorage.setItem('user', JSON.stringify(action.payload.user));

         state.user= action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
        localStorage.setItem('accessToken', action.payload.data.accessToken);
        localStorage.setItem('refreshToken', action.payload.data.refreshToken);
        localStorage.setItem('user', JSON.stringify({userId:action.payload.data.user.userId}));
      })
      .addCase(login.rejected, (state, action) => {
        state.authStatus = "error";
        // state.error = action.payload || action.error.message || "Erreur de connexion";
      });
  },
});

export const { logout, reset } = authSlice.actions;
export default authSlice.reducer;
