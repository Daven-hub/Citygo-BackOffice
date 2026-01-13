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
  previewDoc:string | null;
  status: "idle" | "loading" | "success" | "error";
  errors?: string | null;
}
const initialState: DocumentStateType = {
  documents: [],
  previewDoc:null,
  status: "idle",
  errors: null,
};

interface paramsType{
    id:string,
    datas:object
}

export interface DocumentQueryParams {
  page?: number;
  size?: number;
  userId?: string;
  vehicleId?: string;
  type?: string;
  category?: string;
  state?:string;
  ownerType?:string;
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
  async (params:DocumentQueryParams, thunkAPI) => {
    try {
      const page = params.page ?? 0;
      const size = params.size ?? 20;
      const queryParams = {
        ...params,
        page,
        size,
      };
      const response = await dataService.getAll(queryParams);
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

export const previewDocument = createAsyncThunk(
  "document/preview",
  async (id:string, thunkAPI) => {
    try {
      const response = await dataService.previewDoc(id);
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
      .addCase(previewDocument.pending, (state) => {
        state.status = "loading";
      })
      .addCase(previewDocument.fulfilled, (state, action) => {
        state.status = "success";
        state.previewDoc = action.payload?.data;
      })
      .addCase(previewDocument.rejected, (state, action) => {
        state.status = "error";
      })
      ;
  },
});

// export const { reset } = userSlice.actions;
export default documentSlice.reducer;
