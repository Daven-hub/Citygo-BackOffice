import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";
import dataService from '../../../services/catalogue/vehicleTypeService'

interface paramType{
    id:string,
    datas:object
}

export interface VehicleT {
  id: string;
  code: string;
  name: string;
  seatCapacityMin: number;
  seatCapacityMax: number;
  active: boolean;
  sortOrder: number;
}

interface VehicleState {
  vehicleTypes: VehicleT[];
  vehicleTypeId: VehicleT | null;
  status: "idle" | "loading" | "success" | "error";
  error?: string | null;
}

const initialState: VehicleState = {
  vehicleTypes: [],
  vehicleTypeId: null,
  status: "idle",
  error: null,
};

export const createVehicleType = createAsyncThunk (
  'vehicleType/create',
  async (datas, thunkAPI) => {
    try {
      const response= await dataService.create(datas);
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

export const updateVehicleType = createAsyncThunk(
  "vehicleType/update",
  async ({ id, datas }:paramType, thunkAPI) => {
    try {
      const response = await dataService.updateById(id, datas);
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

export const getAllVehicleType = createAsyncThunk(
  "vehicleType/getAll",
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

export const getVehicleTypeById = createAsyncThunk(
  "vehicleType/getById",
  async (id:string, thunkAPI) => {
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

export const deleteVehiculeType = createAsyncThunk(
  "vehicleType/delete",
  async (id, thunkAPI) => {
    try {
      // const token = thunkAPI.getState ().auth.user.token;
      return await dataService.deleteById(id);
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

export const vehicleTypeSlice = createSlice({
  name: "vehicleType",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateVehicleType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateVehicleType.fulfilled, (state, action) => {
        state.status = "success";
        const updatedUser = action.payload.data;
        const index = state.vehicleTypes.findIndex((us) => us?.id === updatedUser?.id);
        if (index !== -1) {
          const existingUser = state.vehicleTypes[index];
          state.vehicleTypes[index] = {
            ...existingUser,
            ...updatedUser
          };
        }
      })
      .addCase(updateVehicleType.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getAllVehicleType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllVehicleType.fulfilled, (state, action) => {
        state.status = "success";
        state.vehicleTypes = action.payload?.data;
      })
      .addCase(getAllVehicleType.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getVehicleTypeById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getVehicleTypeById.fulfilled, (state, action) => {
        state.status = "success";
        state.vehicleTypeId = action.payload.data;
      })
      .addCase(getVehicleTypeById.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(deleteVehiculeType.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteVehiculeType.fulfilled, (state, action) => {
        state.status = "success";
        // state.vehicleType = state.vehicleType.filter(
        //   (post) => post.id !== action.payload.id
        // );
      })
      .addCase(deleteVehiculeType.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(createVehicleType.pending, state => {
        state.status = "loading";
      })
      .addCase(createVehicleType.fulfilled, (state, action) => {
        state.status = "success";
        state.vehicleTypes.unshift (action.payload.data);
      })
      .addCase (createVehicleType.rejected, (state, action) => {
        state.status = "success";
      });
  },
});

export const { reset } = vehicleTypeSlice.actions;
export default vehicleTypeSlice.reducer;
