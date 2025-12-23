import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authService from '@/services/authService';
import { RootState } from '..';

const userFromStorage= localStorage.getItem("user")

const initialState = {
  user:  userFromStorage ? JSON.parse(userFromStorage) : null,
  accessToken: localStorage.getItem("accessToken") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  expiresIn: parseInt(localStorage.getItem("expiresIn")) || 0,
  // users:[],
  authStatus: "ndle",
}

// export const registerApp = createAsyncThunk (
//   'auth/register',
//   async (datas, thunkAPI) => {
//     try {
//       const response= await authService.register(datas);
//       if (!response.success) {
//         return thunkAPI.rejectWithValue(response.error);
//       }else{
//         return response;
//       }
//     } catch (err) {
//       const message =
//         (err.response &&
//           err.response.data &&
//           err.response.data.message) ||
//         err.message ||
//         err.toString ();
//       return thunkAPI.rejectWithValue (message);
//     }
//   }
// );


export const login = createAsyncThunk(
  'auth/login',
  async (payload, thunkAPI) => {
    try {
      const response= await authService.login(payload);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      if(!response?.data?.user?.roles?.includes('ROLE_ADMIN')){
        return thunkAPI.rejectWithValue("Cet Utilisateur n'est pas autorisé");
      }
      return response;
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

export const refreshTokenAsync = createAsyncThunk<any, void, { state: RootState }>(
  'auth/refreshToken',
  async (_, thunkAPI) => {
    const state= thunkAPI.getState().auth;
    const data= {
      refreshToken: state.refreshToken
    }
    // console.log('data',data)
    try {
      const response = await authService.refreshToken(data);
      //  console.log('response',response)
      // if (!response.success) return thunkAPI.rejectWithValue(response.error?.message);
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const logoutAsync = createAsyncThunk<any, void, { state: RootState }>(
  'auth/Logout',
  async (_, thunkAPI) => {
    const state= thunkAPI.getState().auth;
    try {
      const response = await authService.logout(state.refreshToken);
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);


export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      // state.users=[]
    }
  },
  extraReducers: builder => {
    builder
      // .addCase (registerApp.pending, state => {
      //   state.authStatus = "loading";
      // })
      // .addCase (registerApp.fulfilled, (state, action) => {
      //   state.authStatus = "success";
      //   state.users.unshift (action.payload.result);
      // })
      // .addCase (registerApp.rejected, (state, action) => {
      //   state.authStatus = "success";
      // })
      .addCase(login.pending, (state) => {
        state.authStatus = "loading";
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authStatus = "success";
        const now = Math.floor(Date.now() / 1000);
        state.user= action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
        const expireAt=now + parseInt(action.payload.data.expiresIn);
        state.expiresIn = expireAt;
        localStorage.setItem('expiresIn',expireAt.toString());
        localStorage.setItem('accessToken', action.payload.data.accessToken);
        localStorage.setItem('refreshToken', action.payload.data.refreshToken);
        localStorage.setItem('user', JSON.stringify({userId:action.payload.data.user.userId}));
      })
      .addCase(login.rejected, (state, action) => {
        state.authStatus = "error";
      }).addCase(refreshTokenAsync.pending, (state) => {
        state.authStatus = "loading";
      }).addCase(refreshTokenAsync.fulfilled, (state, action) => {
        state.authStatus = "success";
        const now = Math.floor(Date.now() / 1000);
        state.accessToken = action.payload.data.accessToken;
        const expireAt=now + parseInt(action.payload.data.expiresIn);
        state.expiresIn = expireAt;
        state.refreshToken = action.payload.data.refreshToken;
        localStorage.setItem('refreshToken', action.payload.data.refreshToken);
        localStorage.setItem('expiresIn',expireAt.toString());
        localStorage.setItem('accessToken', action.payload.data.accessToken);
      })
      .addCase(refreshTokenAsync.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.expiresIn = 0;
        localStorage.removeItem('user');
        localStorage.removeItem('expiresIn');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }).addCase(logoutAsync.pending, (state) => {
        state.authStatus = "loading";
      }).addCase(logoutAsync.fulfilled, (state, action) => {
        state.authStatus = "success";
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.expiresIn = 0;
        localStorage.removeItem('user');
        localStorage.removeItem('expiresIn');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(logoutAsync.rejected, (state) => {
        state.authStatus = "error";
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.expiresIn = 0;
        localStorage.removeItem('user');
        localStorage.removeItem('expiresIn');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      });
      ;
  },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
