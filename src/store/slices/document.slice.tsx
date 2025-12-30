import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dataService from "../../services/documentService";

export interface Owner {
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  rating: number | null;
}

export enum DocumentState {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}
export enum OwnerType {
  USER = "USER",
  VEHICLE = "VEHICLE",
}

export enum DocumentType {
  SELFIE = "SELFIE",
  IDENTITY = "IDENTITY",
  LICENSE = "LICENSE",
  OTHER = "OTHER",
}

export enum DocumentCategory {
  IDENTITY = "IDENTITY",
  VEHICLE = "VEHICLE",
}

export interface Document {
  documentId: string;
  ownerId: string;
  owner: Owner;
  ownerType: OwnerType;
  vehicleId: string | null;
  type: DocumentType;
  category: DocumentCategory;
  state: DocumentState;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  expiryDate: string | null;
  reviewNote: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  version: number;
  isCurrent: boolean;
  supersededBy: string | null;
  createdAt: string;
  updatedAt: string;
}


interface DocumentStateType {
  documents: Document[];
  status: "idle" | "loading" | "success" | "error";
  errors?: string | null;
}
const initialState: DocumentStateType = {
  documents: [],
  status: "idle",
  errors: null,
};

interface paramsType{
    id:string,
    datas:object
}

export const updateDocument = createAsyncThunk(
  "document/update",
  async ({ id, datas }: paramsType, thunkAPI) => {
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

export const getAllDocuments = createAsyncThunk(
  "document/getAll",
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


export const documentSlice = createSlice({
  name: "document",
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateDocument.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateDocument.fulfilled, (state, action) => {
        state.status = "success";
        const updatedUser = action.payload.data;
        const index = state.documents.findIndex((us) => us?.documentId === updatedUser?.documentId);
        if (index !== -1) {
          const existingUser = state.documents[index];
          state.documents[index] = {
            ...existingUser,
            ...updatedUser,
            createdAt: existingUser.createdAt,
          };
        }
      })
      .addCase(updateDocument.rejected, (state, action) => {
        state.status = "error";
      })
      .addCase(getAllDocuments.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getAllDocuments.fulfilled, (state, action) => {
        state.status = "success";
        state.documents = action.payload?.data.content;
      })
      .addCase(getAllDocuments.rejected, (state, action) => {
        state.status = "error";
      })
      ;
  },
});

// export const { reset } = userSlice.actions;
export default documentSlice.reducer;
