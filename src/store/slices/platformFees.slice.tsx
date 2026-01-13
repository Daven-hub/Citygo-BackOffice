import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dataService from "../../services/platformeFeeService";

export interface PlatformFee {
  id: string;
  feeType: string;
  percentage: number;
  provider: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface PlatformFeeType {
  id: string;
  feeType: string;
  percentage: number;
  provider: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

interface feeState {
  platformFees: PlatformFee[];
  patformFeeId:PlatformFee | null;
  platformType:PlatformFeeType[];
  feeCache:string | null;
  status: "idle" | "loading" | "success" | "error";
  errors?: string | null;
}
const initialState: feeState = {
  platformFees: [],
  platformType:[],
  patformFeeId:null,
  feeCache: null,
  status: "idle",
  errors: null,
};

interface paramsType{
    id:string,
    datas:object
}

export const updatePlatformFeeById = createAsyncThunk(
  "platformFee/update",
  async ({ id, datas }: paramsType, thunkAPI) => {
    try {
      const response = await dataService.updateById(id, datas);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error.message);
      } else {
        return response;
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllPlatformFee = createAsyncThunk(
  "platformFee/getAll",
  async (_, thunkAPI) => {
    try {
    //   const token = thunkAPI.getState().auth.accessToken;
      const response = await dataService.getAll();
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error.message);
      } else {
        return response;
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPlatformFeeById = createAsyncThunk(
  "platformFee/getById",
  async (feedId:string, thunkAPI) => {
    try {
    //   const token = thunkAPI.getState().auth.accessToken;
      const response = await dataService.getById(feedId);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error.message);
      } else {
        return response;
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const createPlatformFee = createAsyncThunk(
  "PlatformFee/create",
  async (datas:object, thunkAPI) => {
    try {
    //   const token = thunkAPI.getState().auth.accessToken.trim();
      return await dataService.create(datas);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getFeeByType = createAsyncThunk(
  "platformFee/getByType",
  async (type:string, thunkAPI) => {
    try {
      const response = await dataService.getByType(type);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error.message);
      } else {
        return response;
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const feesActionCacheEvict = createAsyncThunk(
  "platformFee/evict_cache",
  async (_, thunkAPI) => {
    try {
      const response = await dataService.feesCacheEvict();
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error.message);
      } else {
        return response;
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deletePlatformById = createAsyncThunk(
  "platformFee/delete",
  async (feedId:string, thunkAPI) => {
    try {
      const response = await dataService.destroy(feedId);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error.message);
      } else {
        return response;
      }
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.error &&
          error.response.data.error.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const platformFeeSlice = createSlice({
  name: "platformFee",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updatePlatformFeeById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updatePlatformFeeById.fulfilled, (state, action) => {
        state.status = "success";
        const updated = action.payload.data;
        const index = state.platformFees.findIndex((us) => us?.id === updated?.id);
        if (index !== -1) {
          const existingUser = state.platformFees[index];
          state.platformFees[index] = {
            ...existingUser,
            ...updated,
            submittedAt: existingUser.createdAt,
          };
        }
      })
      .addCase(updatePlatformFeeById.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getAllPlatformFee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllPlatformFee.fulfilled, (state, action) => {
        state.status = "success";
        state.platformFees = action.payload.data;
      })
      .addCase(getAllPlatformFee.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getPlatformFeeById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getPlatformFeeById.fulfilled, (state, action) => {
        state.status = "success";
        state.patformFeeId = action.payload.data;
      })
      .addCase(getPlatformFeeById.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getFeeByType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getFeeByType.fulfilled, (state, action) => {
        state.status = "success";
        state.platformType = action.payload.data;
      })
      .addCase(getFeeByType.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(feesActionCacheEvict.pending, (state) => {
        state.status = "loading";
      })
      .addCase(feesActionCacheEvict.fulfilled, (state, action) => {
        state.status = "success";
        state.feeCache = action.payload.data;
      })
      .addCase(feesActionCacheEvict.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(createPlatformFee.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPlatformFee.fulfilled, (state, action) => {
        state.status = "success";
        // state.platformFees = action.payload.data;
      })
      .addCase(createPlatformFee.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(deletePlatformById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deletePlatformById.fulfilled, (state, action) => {
        state.status = "success";
        // state.platformFees = action.payload.data;
      })
      .addCase(deletePlatformById.rejected, (state, action) => {
        state.status = "error";
      })
      ;
  },
});

// export const { reset } = userSlice.actions;
export default platformFeeSlice.reducer;
