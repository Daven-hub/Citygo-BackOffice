import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";
import { RootState } from "..";

interface paramsType {
  id: number;
  datas: object;
}

interface dataType {
  userId: string;
  datas: object;
}

interface bulkType {
  userIds: string[];
  operation: string;
  reason: string
}

export interface UserType {
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string; // ISO date string
  deviceCount: number;
  displayName: string;
  driverVerified: boolean;
  email: string;
  emailVerified: boolean;
  id: string;
  lastLoginAt: string | null; // ISO date string
  locale: string;
  phone: string;
  phoneVerified: boolean;
  roles: string[]; // ex: ["ROLE_USER", "ROLE_ADMIN"]
  sessionCount: number;
  status: "ACTIVE" | "INACTIVE" | string;
  updatedAt: string; // ISO date string
}

interface UsersState {
  users: UserType[];
  userLogId: any[];
  bulks: any[],
  analytics: any[],
  usersId: UserType | null;
  userStatus: "idle" | "loading" | "success" | "error";
  userError?: string | null;
}

const initialState: UsersState = {
  users: [],
  userLogId: [],
  bulks:[],
  analytics: [],
  usersId: null,
  userStatus: "idle",
  userError: null,
};

export const updateUser = createAsyncThunk(
  "user/updatye",
  async ({ id, datas }: paramsType, thunkAPI) => {
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

export const getAllUsers = createAsyncThunk<any, void, { state: RootState }>(
  "users/getAll",
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken;
      const response = await userService.getAllUser(token);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error.message);
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

export const getUserById = createAsyncThunk<any, string, { state: RootState }>(
  "user/getById",
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.accessToken.trim();
      return await userService.getUserId(id, token);
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

export const suspendUserById = createAsyncThunk<any,dataType,{ state: RootState }>(
  "users/suspended", 
  async ({ userId, datas }, 
  thunkAPI) => {
    try {
      // const token = thunkAPI.getState ().auth.user.token;
      return await userService.suspendUserById(userId, datas);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

export const unSuspendUserById = createAsyncThunk<any,string,{ state: RootState }>(
  "users/unSuspended", 
  async (id, thunkAPI) => {
    try {
      // const token = thunkAPI.getState ().auth.user.token;
      return await userService.unSuspendUserById(id);
    } catch (error) {
      const message =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
});

export const UpdateLocalFlag = createAsyncThunk<any,dataType,{ state: RootState }>(
  "users/localFlag", 
  async ({ userId, datas }, thunkAPI) => {
  try {
    // const token = thunkAPI.getState ().auth.user.token;
    return await userService.updateLocalFlag(userId, datas);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const getUsetActivityLogById = createAsyncThunk<any,string,{ state: RootState }>(
  "users/activityLogById", 
  async (userId, thunkAPI) => {
  try {
    // const token = thunkAPI.getState ().auth.user.token;
    return await userService.getUserActivityLog(userId);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const BulkOperationUsers = createAsyncThunk<any,bulkType,{ state: RootState }>(
  "users/userBulk-operations", 
  async ({userIds,operation,reason}, thunkAPI) => {
  try {
    const userData={userIds,operation,reason}
    // const token = thunkAPI.getState ().auth.user.token;
    return await userService.userBulkOperation(userData);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const AnalyticsUser = createAsyncThunk<any,void,{ state: RootState }>(
  "users/analyticsUser", 
  async (_, thunkAPI) => {
  try {
    // const token = thunkAPI.getState ().auth.user.token;
    return await userService.getAnalytics();
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

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
        const index = state.users.findIndex((us) => us?.id === updatedUser?.id);
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
      })
      .addCase(getAllUsers.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.userStatus = "success";
        state.users = action.payload?.data.content;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.userStatus = "error";
      })
      .addCase(getUserById.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.userStatus = "success";
        state.usersId = action.payload.data;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.userStatus = "error";
      })
      .addCase(deleteuser.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(deleteuser.fulfilled, (state, action) => {
        state.userStatus = "success";
        state.users = state.users.filter(
          (post) => post.id !== action.payload.id
        );
      })
      .addCase(deleteuser.rejected, (state, action) => {
        state.userStatus = "error";
      })
      .addCase(suspendUserById.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(suspendUserById.fulfilled, (state, action) => {
        state.userStatus = "success";
        const updatedUser = action.payload.data;
        const index = state.users.findIndex((us) => us?.id === updatedUser?.id);
        if (index !== -1) {
          const existingUser = state.users[index];
          state.users[index] = {
            ...existingUser,
            ...updatedUser,
            createdAt: existingUser.createdAt,
          };
        }
      })
      .addCase(suspendUserById.rejected, (state, action) => {
        state.userStatus = "error";
        // state.userError = action.payload || "Modification échouée";
      })
      .addCase(unSuspendUserById.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(unSuspendUserById.fulfilled, (state, action) => {
        state.userStatus = "success";
        const updatedUser = action.payload.data;
        const index = state.users.findIndex((us) => us?.id === updatedUser?.id);
        if (index !== -1) {
          const existingUser = state.users[index];
          state.users[index] = {
            ...existingUser,
            ...updatedUser,
            createdAt: existingUser.createdAt,
          };
        }
      })
      .addCase(unSuspendUserById.rejected, (state, action) => {
        state.userStatus = "error";
      })
      .addCase(UpdateLocalFlag.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(UpdateLocalFlag.fulfilled, (state, action) => {
        state.userStatus = "success";
        const updatedUser = action.payload.data;
        const index = state.users.findIndex((us) => us?.id === updatedUser?.id);
        if (index !== -1) {
          const existingUser = state.users[index];
          state.users[index] = {
            ...existingUser,
            ...updatedUser,
            createdAt: existingUser.createdAt,
          };
        }
      })
      .addCase(UpdateLocalFlag.rejected, (state, action) => {
        state.userStatus = "error";
      })
      .addCase(getUsetActivityLogById.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(getUsetActivityLogById.fulfilled, (state, action) => {
        state.userStatus = "success";
        state.userLogId = action.payload.data?.content;
      })
      .addCase(getUsetActivityLogById.rejected, (state, action) => {
        state.userStatus = "error";
      })
      .addCase(BulkOperationUsers.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(BulkOperationUsers.fulfilled, (state, action) => {
        state.userStatus = "success";
        state.bulks = action.payload.data;
      })
      .addCase(BulkOperationUsers.rejected, (state, action) => {
        state.userStatus = "error";
      })
      .addCase(AnalyticsUser.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(AnalyticsUser.fulfilled, (state, action) => {
        state.userStatus = "success";
        state.analytics = action.payload.data;
      })
      .addCase(AnalyticsUser.rejected, (state, action) => {
        state.userStatus = "error";
      });
  },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
