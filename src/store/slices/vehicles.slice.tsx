import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "..";
import dataService from '../../services/vehicleService'

interface paramType{
    id:string,
    status:string,
    datas:object
}

type VehicleStatus = "SUSPENDED" | "PENDING" | "APPROVED" | "REJECTED";
type ComfortLevel = "STANDARD" | "PREMIUM" | "LUXE";

type Vehicle = {
  vehicleId: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  make: string;
  model: string;
  color: string;
  plate: string;
  vehicleTypeId: string;
  vehicleTypeName: string;
  seats: number;
  status: VehicleStatus;
  comfortLevel: ComfortLevel;
  createdAt: Date;
  submittedAt?: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  reviewNote?: string;
  documentCount: number;
};

type MetricType = {
  totalVehicles: number;
  draftCount: number;
  pendingReviewCount: number;
  approvedCount: number;
  rejectedCount: number;
  suspendedCount: number;
  standardCount: number;
  comfortCount: number;
  premiumCount: number;
  countByVehicleType: Record<string,number>;
  submittedLast24Hours: number;
  approvedLast24Hours: number;
  rejectedLast24Hours: number;
  avgApprovalTimeHours: number;
};

interface vehicleState {
  vehicles: Vehicle[];
  metricVehicule: MetricType | null;
  vehiclesId: Vehicle | null;
  status: "idle" | "loading" | "success" | "error";
  error?: string | null;
}

const initialState: vehicleState = {
  vehicles: [],
  metricVehicule: null,
  vehiclesId: null,
  status: "idle",
  error: null,
};

export const updateVehicleStatus = createAsyncThunk(
  "vehicles/update_status",
  async ({ id, status, datas }:paramType, thunkAPI) => {
    try {
      const response = await dataService.updateStatus(id,status, datas);
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

export const getAllVehicles = createAsyncThunk<any, void, { state: RootState }>(
  "vehicles/getAll",
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
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllPendingReview = createAsyncThunk<any, void, { state: RootState }>(
  "vehicles/getPendingReview",
  async (_, thunkAPI) => {
    try {
    //   const token = thunkAPI.getState().auth.accessToken;
      const response = await dataService.pendingReview();
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

export const getvehicleById = createAsyncThunk<any, string, { state: RootState }>(
  "vehicles/getById",
  async (id, thunkAPI) => {
    try {
    //   const token = thunkAPI.getState().auth.accessToken.trim();
      return await dataService.getById(id);
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

export const vehiculeMetric = createAsyncThunk(
  "vehicles/metric",
  async (_, thunkAPI) => {
    try {
      // const token = thunkAPI.getState ().auth.user.token;
      return await dataService.metric();
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

export const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateVehicleStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateVehicleStatus.fulfilled, (state, action) => {
        state.status = "success";
        const updatedUser = action.payload.data;
        const index = state.vehicles.findIndex((us) => us?.vehicleId === updatedUser?.vehicleId);
        if (index !== -1) {
          const existingUser = state.vehicles[index];
          state.vehicles[index] = {
            ...existingUser,
            ...updatedUser,
            createdAt:existingUser?.createdAt
          };
        }
      })
      .addCase(updateVehicleStatus.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getAllVehicles.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllVehicles.fulfilled, (state, action) => {
        state.status = "success";
        state.vehicles = action.payload?.data?.content;
      })
      .addCase(getAllVehicles.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getAllPendingReview.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllPendingReview.fulfilled, (state, action) => {
        state.status = "success";
        state.vehicles = action.payload?.data?.content;
      })
      .addCase(getAllPendingReview.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getvehicleById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getvehicleById.fulfilled, (state, action) => {
        state.status = "success";
        state.vehiclesId = action.payload.data;
      })
      .addCase(getvehicleById.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(vehiculeMetric.pending, (state) => {
        state.status = "loading";
      })
      .addCase(vehiculeMetric.fulfilled, (state, action) => {
        state.status = "success";
        state.metricVehicule= action.payload.data
      })
      .addCase(vehiculeMetric.rejected, (state, action) => {
        state.status = "error";
      });
  },
});

export const { reset } = vehicleSlice.actions;
export default vehicleSlice.reducer;
