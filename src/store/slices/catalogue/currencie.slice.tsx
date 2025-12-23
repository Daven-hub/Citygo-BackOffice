import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";
import dataService from '../../../services/catalogue/currencieService'

interface paramType{
    id:string,
    datas:object
}

export interface CurrencieType {
  id: string;
  code: string;
  name: string;
  symbol: string;
  active: boolean;
  sortOrder: number;
}

interface currencieState {
  currencies: CurrencieType[];
  currenciesId: CurrencieType | null;
  status: "idle" | "loading" | "success" | "error";
  error?: string | null;
}

const initialState: currencieState = {
  currencies: [],
  currenciesId: null,
  status: "idle",
  error: null,
};

export const createCurrencie = createAsyncThunk (
  'currencies/create',
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

export const updateCurrencie = createAsyncThunk(
  "currencies/update",
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

export const getAllCurrencie = createAsyncThunk<any, void, { state: RootState }>(
  "currencies/getAll",
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

export const getCurrencieById = createAsyncThunk<any, string, { state: RootState }>(
  "currencies/getById",
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

export const deleteCurrencie = createAsyncThunk(
  "currencies/delete",
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

export const currencieSlice = createSlice({
  name: "currencie",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateCurrencie.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateCurrencie.fulfilled, (state, action) => {
        state.status = "success";
        const updatedUser = action.payload.data;
        const index = state.currencies.findIndex((us) => us?.id === updatedUser?.id);
        if (index !== -1) {
          const existingUser = state.currencies[index];
          state.currencies[index] = {
            ...existingUser,
            ...updatedUser
          };
        }
      })
      .addCase(updateCurrencie.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getAllCurrencie.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllCurrencie.fulfilled, (state, action) => {
        state.status = "success";
        state.currencies = action.payload?.data;
      })
      .addCase(getAllCurrencie.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getCurrencieById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getCurrencieById.fulfilled, (state, action) => {
        state.status = "success";
        state.currenciesId = action.payload.data;
      })
      .addCase(getCurrencieById.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(deleteCurrencie.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteCurrencie.fulfilled, (state, action) => {
        state.status = "success";
        // state.vehicleType = state.vehicleType.filter(
        //   (post) => post.id !== action.payload.id
        // );
      })
      .addCase(deleteCurrencie.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(createCurrencie.pending, state => {
        state.status = "loading";
      })
      .addCase(createCurrencie.fulfilled, (state, action) => {
        state.status = "success";
        state.currencies.unshift (action.payload.data);
      })
      .addCase (createCurrencie.rejected, (state, action) => {
        state.status = "success";
      });
  },
});

export const { reset } = currencieSlice.actions;
export default currencieSlice.reducer;
