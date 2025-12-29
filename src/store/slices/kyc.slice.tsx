import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dataService from "../../services/kycService";
import { RootState } from "..";

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}
export type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED" | "UNDER_REVIEW";
export interface DriverApplication {
  applicationId: string;
  status: ApplicationStatus;
  licenseNumber: string;
  licenseExpiryDate: string;
  experience: number;
  motivation: string;
  emergencyContact: EmergencyContact;
  submittedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
}

export type KycStatus = "PENDING" | "APPROVED" | "REJECTED";
export interface KycUserSummary {
  userId: string;
  displayName: string;
  avatarUrl: string;
  rating: number;
}
export interface KycRequest {
  kycRequestId: string;
  userId: string;
  user: KycUserSummary;
  status: KycStatus;
  submittedAt: string;
  reviewedAt: string;
  reviewedBy: string;
  rejectionReasons: string[];
}
interface kycState {
  requests: KycRequest[];
  driverApplications: DriverApplication[];
  requestId: KycRequest | null;
  driverAppId: DriverApplication | null;
  status: "idle" | "loading" | "success" | "error";
  errors?: string | null;
}
const initialState: kycState = {
  requests: [],
  driverApplications: [],
  requestId:null,
  driverAppId: null,
  status: "idle",
  errors: null,
};

interface paramsType{
    id:string,
    datas:object
}

export const updateKycRequest = createAsyncThunk(
  "kycRequest/updatye",
  async ({ id, datas }: paramsType, thunkAPI) => {
    try {
      const response = await dataService.updateRequest(id, datas);
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

export const getAllKycRequest = createAsyncThunk(
  "kycRequest/getAll",
  async (_, thunkAPI) => {
    try {
    //   const token = thunkAPI.getState().auth.accessToken;
      const response = await dataService.getAllRequest();
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

export const getKycRequestById = createAsyncThunk(
  "kycRequest/getById",
  async (id, thunkAPI) => {
    try {
    //   const token = thunkAPI.getState().auth.accessToken.trim();
      return await dataService.getRequestById(id);
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

export const updateDriverApp = createAsyncThunk(
  "driverApplication/update",
  async ({ id, datas }: paramsType, thunkAPI) => {
    try {
      const response = await dataService.updateDriverApplication(id, datas);
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

export const getAllDriverApp = createAsyncThunk(
  "driverApplication/getAll",
  async (_, thunkAPI) => {
    try {
    //   const token = thunkAPI.getState().auth.accessToken;
      const response = await dataService.getAllDriverApplication();
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

export const getDriverAppById = createAsyncThunk(
  "driverApplication/getById",
  async (id:string, thunkAPI) => {
    try {
    //   const token = thunkAPI.getState().auth.accessToken.trim();
      return await dataService.getDriverApplicationById(id);
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


export const kycSlice = createSlice({
  name: "kyc",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateKycRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateKycRequest.fulfilled, (state, action) => {
        state.status = "success";
        const updatedUser = action.payload.data;
        const index = state.requests.findIndex((us) => us?.kycRequestId === updatedUser?.kycRequestId);
        if (index !== -1) {
          const existingUser = state.requests[index];
          state.requests[index] = {
            ...existingUser,
            ...updatedUser,
            submittedAt: existingUser.submittedAt,
          };
        }
      })
      .addCase(updateKycRequest.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getAllKycRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllKycRequest.fulfilled, (state, action) => {
        state.status = "success";
        state.requests = action.payload?.data.content;
      })
      .addCase(getAllKycRequest.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getKycRequestById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getKycRequestById.fulfilled, (state, action) => {
        state.status = "success";
        state.requestId = action.payload.data;
      })
      .addCase(getKycRequestById.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(updateDriverApp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateDriverApp.fulfilled, (state, action) => {
        state.status = "success";
        const updatedUser = action.payload.data;
        const index = state.driverApplications.findIndex((us) => us?.applicationId === updatedUser?.applicationId);
        if (index !== -1) {
          const existingUser = state.driverApplications[index];
          state.driverApplications[index] = {
            ...existingUser,
            ...updatedUser,
            submittedAt: existingUser.submittedAt,
          };
        }
      })
      .addCase(updateDriverApp.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getAllDriverApp.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllDriverApp.fulfilled, (state, action) => {
        state.status = "success";
        state.driverApplications = action.payload?.data.content;
      })
      .addCase(getAllDriverApp.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getDriverAppById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getDriverAppById.fulfilled, (state, action) => {
        state.status = "success";
        state.driverAppId = action.payload.data;
      })
      .addCase(getDriverAppById.rejected, (state, action) => {
        state.status = "error";
      })
      ;
  },
});

// export const { reset } = userSlice.actions;
export default kycSlice.reducer;
