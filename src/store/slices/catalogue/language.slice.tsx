import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../..";
import dataService from '../../../services/catalogue/languageService'

interface paramType{
    id:string,
    datas:object
}

export interface LanguageType {
  id: string;
  code: string;
  name: string;
  nativeName: string;
  active: boolean;
  sortOrder: number;
}

interface LuggageState {
  languages: LanguageType[];
  languagesId: LanguageType | null;
  status: "idle" | "loading" | "success" | "error";
  error?: string | null;
}

const initialState: LuggageState = {
  languages: [],
  languagesId: null,
  status: "idle",
  error: null,
};

export const createLanguage = createAsyncThunk (
  'language/create',
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

export const updateLanguage = createAsyncThunk(
  "language/update",
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

export const getAllLanguage = createAsyncThunk(
  "language/getAll",
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

export const getLanguageById = createAsyncThunk(
  "language/getById",
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

export const deleteLanguage = createAsyncThunk(
  "language/delete",
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

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateLanguage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateLanguage.fulfilled, (state, action) => {
        state.status = "success";
        const updatedUser = action.payload.data;
        const index = state.languages.findIndex((us) => us?.id === updatedUser?.id);
        if (index !== -1) {
          const existingUser = state.languages[index];
          state.languages[index] = {
            ...existingUser,
            ...updatedUser
          };
        }
      })
      .addCase(updateLanguage.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getAllLanguage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllLanguage.fulfilled, (state, action) => {
        state.status = "success";
        state.languages = action.payload?.data;
      })
      .addCase(getAllLanguage.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getLanguageById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getLanguageById.fulfilled, (state, action) => {
        state.status = "success";
        state.languagesId = action.payload.data;
      })
      .addCase(getLanguageById.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(deleteLanguage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteLanguage.fulfilled, (state, action) => {
        state.status = "success";
        // state.vehicleType = state.vehicleType.filter(
        //   (post) => post.id !== action.payload.id
        // );
      })
      .addCase(deleteLanguage.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(createLanguage.pending, state => {
        state.status = "loading";
      })
      .addCase(createLanguage.fulfilled, (state, action) => {
        state.status = "success";
        state.languages.unshift (action.payload.data);
      })
      .addCase (createLanguage.rejected, (state, action) => {
        state.status = "success";
      });
  },
});

export const { reset } = languageSlice.actions;
export default languageSlice.reducer;
