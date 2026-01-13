import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dataService from "../../services/settingService";

export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  valueType: "INTEGER" | "BOOLEAN" | "STRING" | "DECIMAL";
  description: string;
  category: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
}

interface settingState {
  settings: SystemSetting[];
  settingKey:SystemSetting | null;
  settingCateg:string[];
  settingCache:string | null;
  status: "idle" | "loading" | "success" | "error";
  errors?: string | null;
}
const initialState: settingState = {
  settings: [],
  settingKey:null,
  settingCache:null,
  settingCateg:[],
  status: "idle",
  errors: null,
};

interface paramsType{
    key:string,
    datas:object
}

interface paginate{
  page?:number | 0,
  size?:number | 20
}

export const updateSettingByKey = createAsyncThunk(
  "setting/updatye",
  async ({ key, datas }: paramsType, thunkAPI) => {
    try {
      const response = await dataService.updateByKey(key, datas);
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

export const getAllSettings = createAsyncThunk(
  "settings/getAll",
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

export const getAllCategorie = createAsyncThunk(
  "settings/categorie",
  async (_, thunkAPI) => {
    try {
    //   const token = thunkAPI.getState().auth.accessToken.trim();
      return await dataService.categorie();
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

export const getSettingsByKey = createAsyncThunk(
  "settings/getByKey",
  async (key:string, thunkAPI) => {
    try {
    //   const token = thunkAPI.getState().auth.accessToken;
      const response = await dataService.getByKey(key);
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

export const evictActionCache = createAsyncThunk(
  "settings/evict_cache",
  async (_, thunkAPI) => {
    try {
    //   const token = thunkAPI.getState().auth.accessToken;
      const response = await dataService.evictCache();
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

export const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateSettingByKey.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateSettingByKey.fulfilled, (state, action) => {
        state.status = "success";
        const updatedUser = action.payload.data;
        const index = state.settings.findIndex((us) => us?.id === updatedUser?.id);
        if (index !== -1) {
          const existingUser = state.settings[index];
          state.settings[index] = {
            ...existingUser,
            ...updatedUser,
            submittedAt: existingUser.createdAt,
          };
        }
      })
      .addCase(updateSettingByKey.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getAllSettings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllSettings.fulfilled, (state, action) => {
        state.status = "success";
        state.settings = action.payload?.data;
      })
      .addCase(getAllSettings.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getSettingsByKey.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getSettingsByKey.fulfilled, (state, action) => {
        state.status = "success";
        state.settingKey = action.payload.data;
      })
      .addCase(getSettingsByKey.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getAllCategorie.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllCategorie.fulfilled, (state, action) => {
        state.status = "success";
        state.settingCateg = action.payload.data;
      })
      .addCase(getAllCategorie.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(evictActionCache.pending, (state) => {
        state.status = "loading";
      })
      .addCase(evictActionCache.fulfilled, (state, action) => {
        state.status = "success";
        state.settingCache = action.payload.data;
      })
      .addCase(evictActionCache.rejected, (state, action) => {
        state.status = "error";
      })
      ;
  },
});

// export const { reset } = userSlice.actions;
export default settingSlice.reducer;
