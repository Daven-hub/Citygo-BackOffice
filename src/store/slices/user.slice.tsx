import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";
// import authService from '../../services/authService';

interface paramsType{
  id:Number,
  datas:Object
}

const initialState = {
  users: [],
  usersId: null,
  userStatus: "idle",
  userError: null,
};

export const updateUser = createAsyncThunk(
  "user/updatye",
  async ({ id, datas }:paramsType, thunkAPI) => {
    try {
      const response = await userService.updateUser(id, datas);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error);
      } else {
        return response;
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllUsers = createAsyncThunk(
  "users/getAlll",
  async (_, thunkAPI) => {
    try {
      // const token = thunkAPI.getState ().auth.user.token;
      return await userService.getAllUser();
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getUserById = createAsyncThunk(
  "user/getById",
  async (id, thunkAPI) => {
    try {
      // const token = thunkAPI.getState ().auth.user.token;
      return await userService.getUserId(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteuser = createAsyncThunk(
  "users/delete",
  async (id, thunkAPI) => {
    try {
      // const token = thunkAPI.getState ().auth.user.token;
      return await userService.deleteUserId(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateUser.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.userStatus = "success";
        const updatedUser = action.payload.result;
        const index = state.users.findIndex(
          (us) => us?.idUsershop === updatedUser?.idUsershop
        );
        if (index !== -1) {
          const existingUser = state.users[index];
          state.users[index] = {
            ...existingUser,
            ...updatedUser,
            created_at: existingUser.created_at,
          };
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.userStatus = "error";
        state.userError = action.payload || "Modification échouée";
      })
      .addCase(getAllUsers.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.userStatus = "success";
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.userStatus = "error";
        state.userError = action.payload || "Impossible de charger les utilisateurs";
      })
      .addCase(getUserById.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.userStatus = "success";
        state.usersId = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.userStatus = "error";
        state.userError =
          action.payload || "Impossible de charger l'utilisateur";
      })
      .addCase(deleteuser.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(deleteuser.fulfilled, (state, action) => {
        state.userStatus = "success";
        state.users = state.users.filter(
          (post) => post.idUsershop !== action.payload.id
        );
      })
      .addCase(deleteuser.rejected, (state, action) => {
        state.userStatus = "error";
        state.userError = action.payload || "Suppression échouée";
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
