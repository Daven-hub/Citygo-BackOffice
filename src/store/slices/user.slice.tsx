import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import userService from "../../services/userService";
import { UserStats } from "@/components/UserStatOverview";

interface paramsType{
  id:number,
  datas:object
}

interface metricType {
  period: string;
  metric: string;
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

export interface TrendData {
  date: string;
  label?: string;
  registrations: number;
  activeUsers: number;
  driverApplications: number;
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
  userLogId: object[];
  bulks: object[],
  analytics: UserStats | null,
  analyticMetric: TrendData[],
  usersId: UserType | null;
  userStatus: "idle" | "loading" | "success" | "error";
  userError?: string | null;
}

const initialState: UsersState = {
  users: [],
  userLogId: [],
  bulks:[],
  analytics: null,
  analyticMetric: [],
  usersId: null,
  userStatus: "idle",
  userError: null,
};

export const UpdateUser = createAsyncThunk(
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

export const GetAllUsers = createAsyncThunk(
  "users/getAll",
  async (_, thunkAPI) => {
    try {
      // const token = thunkAPI.getState().auth.accessToken;
      const response = await userService.getAllUser();
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

export const GetUserById = createAsyncThunk(
  "user/getById",
  async (id:string, thunkAPI) => {
    try {
      // const token = thunkAPI.getState().auth.accessToken.trim();
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

export const Deleteuser = createAsyncThunk(
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

export const SuspendUserById = createAsyncThunk(
  "users/suspended", 
  async ({ userId, datas }:dataType, 
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

export const UnSuspendUserById = createAsyncThunk(
  "users/unSuspended", 
  async (id:string, thunkAPI) => {
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

export const UpdateLocalFlag = createAsyncThunk(
  "users/localFlag", 
  async ({ userId, datas }:dataType, thunkAPI) => {
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

export const GetUsetActivityLogById = createAsyncThunk(
  "users/activityLogById", 
  async (userId:string, thunkAPI) => {
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

export const BulkOperationUsers = createAsyncThunk(
  "users/userBulk-operations", 
  async ({userIds,operation,reason}:bulkType, thunkAPI) => {
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

export const AnalyticsUser = createAsyncThunk(
  "users/analyticsUser", 
  async (periode:string, thunkAPI) => {
  try {
    // const token = thunkAPI.getState ().auth.user.token;
    return await userService.getAnalytics(periode);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const AnalyticsWithMetric = createAsyncThunk(
  "users/analyticsWithMetric", 
  async ({period,metric}:metricType, thunkAPI) => {
  try {
    // const token = thunkAPI.getState ().auth.user.token;
    return await userService.getAnalyticMetric(period,metric);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const UserSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(UpdateUser.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(UpdateUser.fulfilled, (state, action) => {
        state.userStatus = "success";
        const updatedUser = action.payload.result;
        const index = state.users.findIndex(
          (us) => us?.id === updatedUser?.id
        );

        if (index !== -1) {
          const existingUser = state.users[index];
          state.users[index] = {
            ...existingUser,
            ...updatedUser,
            createdAt: existingUser.createdAt,
          };
        }
      })
      .addCase(UpdateUser.rejected, (state, action) => {
        state.userStatus = "error";
      })
      .addCase(GetAllUsers.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(GetAllUsers.fulfilled, (state, action) => {
        state.userStatus = "success";
        state.users = action.payload?.data.content;
      })
      .addCase(GetAllUsers.rejected, (state, action) => {
        state.userStatus = "error";
      })
      .addCase(GetUserById.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(GetUserById.fulfilled, (state, action) => {
        state.userStatus = "success";
        state.usersId = action.payload.data;
      })
      .addCase(GetUserById.rejected, (state, action) => {
        state.userStatus = "error";
      })
      .addCase(Deleteuser.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(Deleteuser.fulfilled, (state, action) => {
        state.userStatus = "success";
        state.users = state.users.filter(
          (post) => post.id !== action.payload.id
        );
      })
      .addCase(Deleteuser.rejected, (state, action) => {
        state.userStatus = "error";
      })
      .addCase(SuspendUserById.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(SuspendUserById.fulfilled, (state, action) => {
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
      .addCase(SuspendUserById.rejected, (state, action) => {
        state.userStatus = "error";
        // state.userError = action.payload || "Modification échouée";
      })
      .addCase(UnSuspendUserById.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(UnSuspendUserById.fulfilled, (state, action) => {
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
      .addCase(UnSuspendUserById.rejected, (state, action) => {
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
      .addCase(GetUsetActivityLogById.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(GetUsetActivityLogById.fulfilled, (state, action) => {
        state.userStatus = "success";
        state.userLogId = action.payload.data?.content;
      })
      .addCase(GetUsetActivityLogById.rejected, (state, action) => {
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
      })
      .addCase(AnalyticsWithMetric.pending, (state) => {
        state.userStatus = "loading";
      })
      .addCase(AnalyticsWithMetric.fulfilled, (state, action) => {
        state.userStatus = "success";
        state.analyticMetric = action.payload.trends;
      })
      .addCase(AnalyticsWithMetric.rejected, (state, action) => {
        state.userStatus = "error";
      });
  },
});

// export const { reset } = UserSlice.actions;
export default UserSlice.reducer;
