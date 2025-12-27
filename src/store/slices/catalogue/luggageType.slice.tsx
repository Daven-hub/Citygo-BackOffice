import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";
import dataService from '../../../services/catalogue/luggageTypeService'

interface paramType{
    id:string,
    datas:object
}

export interface Luggage {
  id: string;
  code: string;
  name: string;
  active: boolean;
  sortOrder: number;
}

interface LuggageState {
  luggageTypes: Luggage[];
  luggageTypeId: Luggage | null;
  status: "idle" | "loading" | "success" | "error";
  error?: string | null;
}

const initialState: LuggageState = {
  luggageTypes: [],
  luggageTypeId: null,
  status: "idle",
  error: null,
};

export const createLuggage = createAsyncThunk (
  'Luggage/create',
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

export const updateLuggage = createAsyncThunk(
  "Luggage/update",
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

export const getAllLuggage = createAsyncThunk(
  "Luggage/getAll",
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

export const getLuggageById = createAsyncThunk(
  "Luggage/getById",
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

export const deleteLuggage = createAsyncThunk(
  "Luggage/delete",
  async (id:string, thunkAPI) => {
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

export const luggageSlice = createSlice({
  name: "luggage",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateLuggage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateLuggage.fulfilled, (state, action) => {
        state.status = "success";
        const updatedUser = action.payload.data;
        const index = state.luggageTypes.findIndex((us) => us?.id === updatedUser?.id);
        if (index !== -1) {
          const existingUser = state.luggageTypes[index];
          state.luggageTypes[index] = {
            ...existingUser,
            ...updatedUser
          };
        }
      })
      .addCase(updateLuggage.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getAllLuggage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllLuggage.fulfilled, (state, action) => {
        state.status = "success";
        state.luggageTypes = action.payload?.data;
      })
      .addCase(getAllLuggage.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getLuggageById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLuggageById.fulfilled, (state, action) => {
        state.status = "success";
        state.luggageTypeId = action.payload.data;
      })
      .addCase(getLuggageById.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(deleteLuggage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteLuggage.fulfilled, (state, action) => {
        state.status = "success";
        // state.vehicleType = state.vehicleType.filter(
        //   (post) => post.id !== action.payload.id
        // );
      })
      .addCase(deleteLuggage.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(createLuggage.pending, state => {
        state.status = "loading";
      })
      .addCase(createLuggage.fulfilled, (state, action) => {
        state.status = "success";
        state.luggageTypes.unshift (action.payload.data);
      })
      .addCase (createLuggage.rejected, (state, action) => {
        state.status = "success";
      });
  },
});

export const { reset } = luggageSlice.actions;
export default luggageSlice.reducer;
