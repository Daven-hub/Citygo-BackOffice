import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '@/services/authService';

const userFromStorage= localStorage.getItem("user")


const initialState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  token: localStorage.getItem("token") || null,
  csrf: localStorage.getItem("csrf") || null,
  users:[],
  authStatus: "ndle",
  statusR:false,
  error: null,
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
        return thunkAPI.rejectWithValue(response.error || "Connexion échouée");
      }else{
        return response;
      }
    } catch (err) {
      console.log("err",err)
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
      state.token = null;
      state.csrf = null;
      localStorage.removeItem('token');
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
        state.error = action.payload || action.error.message || "Erreur de connexion";
      })
      .addCase(login.pending, (state) => {
        state.authStatus = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authStatus = "success";
        state.user= action.payload.user;
        state.token = action.payload.token;
        state.csrf = action.payload.csrf;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('csrf', action.payload.csrf);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => {
        state.authStatus = "error";
        state.error = action.payload || action.error.message || "Erreur de connexion";
      });
  },
});

export const { logout, reset } = authSlice.actions;
export default authSlice.reducer;
