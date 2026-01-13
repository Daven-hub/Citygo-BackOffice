import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import supportTicketService from "../../services/supportTicketService";
import {
  SupportTicket,
  SupportTicketStats,
  SupportTicketDetailedStats,
  UpdateTicketRequest,
  ResolveTicketRequest,
  CreateTicketRequest,
  TicketStatus,
} from "@/types/supportTicket";

// =============================================================================
// INTERFACES
// =============================================================================

interface PaginateParams {
  page?: number;
  size?: number;
}

interface StatusParams extends PaginateParams {
  status: TicketStatus;
}

interface EscalateParams {
  ticketId: string;
  reason?: string;
}

interface AssignParams {
  ticketId: string;
  assignedTo: string;
}

interface AddNoteParams {
  ticketId: string;
  note: string;
}

interface ResolveParams {
  ticketId: string;
  data: ResolveTicketRequest;
}

interface UpdateParams {
  ticketId: string;
  data: UpdateTicketRequest;
}

interface SupportTicketState {
  tickets: SupportTicket[];
  selectedTicket: SupportTicket | null;
  stats: SupportTicketStats | null;
  detailedStats: SupportTicketDetailedStats | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  status: "idle" | "loading" | "success" | "error";
  error: string | null;
}

const initialState: SupportTicketState = {
  tickets: [],
  selectedTicket: null,
  stats: null,
  detailedStats: null,
  totalElements: 0,
  totalPages: 0,
  currentPage: 0,
  status: "idle",
  error: null,
};

// =============================================================================
// ASYNC THUNKS - CREATE (Dev testing only)
// =============================================================================

interface CreateTicketParams {
  data: CreateTicketRequest;
  files?: File[];
}

export const CreateTicket = createAsyncThunk(
  "supportTickets/create",
  async ({ data, files }: CreateTicketParams, thunkAPI) => {
    try {
      // Use the appropriate service method based on whether files are provided
      const response = files && files.length > 0
        ? await supportTicketService.createTicketWithAttachments(data, files)
        : await supportTicketService.createTicket(data);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// =============================================================================
// ASYNC THUNKS - LIST OPERATIONS
// =============================================================================

export const GetActiveTickets = createAsyncThunk(
  "supportTickets/getActive",
  async (params: PaginateParams | undefined, thunkAPI) => {
    try {
      const page = params?.page ?? 0;
      const size = params?.size ?? 20;
      const response = await supportTicketService.getActiveTickets(page, size);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const GetTicketsByStatus = createAsyncThunk(
  "supportTickets/getByStatus",
  async (params: StatusParams, thunkAPI) => {
    try {
      const page = params?.page ?? 0;
      const size = params?.size ?? 20;
      const response = await supportTicketService.getTicketsByStatus(
        params.status,
        page,
        size
      );
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const GetUnassignedTickets = createAsyncThunk(
  "supportTickets/getUnassigned",
  async (params: PaginateParams | undefined, thunkAPI) => {
    try {
      const page = params?.page ?? 0;
      const size = params?.size ?? 20;
      const response = await supportTicketService.getUnassignedTickets(
        page,
        size
      );
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const GetMyAssignedTickets = createAsyncThunk(
  "supportTickets/getMine",
  async (params: PaginateParams | undefined, thunkAPI) => {
    try {
      const page = params?.page ?? 0;
      const size = params?.size ?? 20;
      const response = await supportTicketService.getMyAssignedTickets(
        page,
        size
      );
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const GetEscalatedTickets = createAsyncThunk(
  "supportTickets/getEscalated",
  async (params: PaginateParams | undefined, thunkAPI) => {
    try {
      const page = params?.page ?? 0;
      const size = params?.size ?? 20;
      const response = await supportTicketService.getEscalatedTickets(
        page,
        size
      );
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const GetSlaBreachedTickets = createAsyncThunk(
  "supportTickets/getSlaBreached",
  async (params: PaginateParams | undefined, thunkAPI) => {
    try {
      const page = params?.page ?? 0;
      const size = params?.size ?? 20;
      const response = await supportTicketService.getSlaBreachedTickets(
        page,
        size
      );
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// =============================================================================
// ASYNC THUNKS - SINGLE TICKET
// =============================================================================

export const GetTicketById = createAsyncThunk(
  "supportTickets/getById",
  async (ticketId: string, thunkAPI) => {
    try {
      const response = await supportTicketService.getTicketById(ticketId);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const UpdateTicket = createAsyncThunk(
  "supportTickets/update",
  async ({ ticketId, data }: UpdateParams, thunkAPI) => {
    try {
      const response = await supportTicketService.updateTicket(ticketId, data);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// =============================================================================
// ASYNC THUNKS - ACTIONS
// =============================================================================

export const StartTicketProgress = createAsyncThunk(
  "supportTickets/startProgress",
  async (ticketId: string, thunkAPI) => {
    try {
      const response = await supportTicketService.startProgress(ticketId);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const AwaitCustomerResponse = createAsyncThunk(
  "supportTickets/awaitCustomer",
  async (ticketId: string, thunkAPI) => {
    try {
      const response = await supportTicketService.awaitCustomer(ticketId);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const EscalateTicket = createAsyncThunk(
  "supportTickets/escalate",
  async ({ ticketId, reason }: EscalateParams, thunkAPI) => {
    try {
      const response = await supportTicketService.escalateTicket(
        ticketId,
        reason
      );
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const ResolveTicket = createAsyncThunk(
  "supportTickets/resolve",
  async ({ ticketId, data }: ResolveParams, thunkAPI) => {
    try {
      const response = await supportTicketService.resolveTicket(ticketId, data);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const CloseTicket = createAsyncThunk(
  "supportTickets/close",
  async (ticketId: string, thunkAPI) => {
    try {
      const response = await supportTicketService.closeTicket(ticketId);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const AssignTicket = createAsyncThunk(
  "supportTickets/assign",
  async ({ ticketId, assignedTo }: AssignParams, thunkAPI) => {
    try {
      const response = await supportTicketService.assignTicket(ticketId, assignedTo);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const AddNote = createAsyncThunk(
  "supportTickets/addNote",
  async ({ ticketId, note }: AddNoteParams, thunkAPI) => {
    try {
      const response = await supportTicketService.addNote(ticketId, note);
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return { ticketId, note };
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// =============================================================================
// ASYNC THUNKS - STATS
// =============================================================================

export const GetTicketStats = createAsyncThunk(
  "supportTickets/getStats",
  async (_, thunkAPI) => {
    try {
      const response = await supportTicketService.getBasicStats();
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const GetDetailedTicketStats = createAsyncThunk(
  "supportTickets/getDetailedStats",
  async (_, thunkAPI) => {
    try {
      const response = await supportTicketService.getDetailedStats();
      if (!response.success) {
        return thunkAPI.rejectWithValue(response.error?.message);
      }
      return response;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// =============================================================================
// SLICE
// =============================================================================

export const supportTicketSlice = createSlice({
  name: "supportTickets",
  initialState,
  reducers: {
    clearSelectedTicket: (state) => {
      state.selectedTicket = null;
    },
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Helper to update ticket in list
    const updateTicketInList = (
      state: SupportTicketState,
      updatedTicket: SupportTicket
    ) => {
      const index = state.tickets.findIndex((t) => t.id === updatedTicket.id);
      if (index !== -1) {
        state.tickets[index] = updatedTicket;
      }
      if (state.selectedTicket?.id === updatedTicket.id) {
        state.selectedTicket = updatedTicket;
      }
    };

    builder
      // CreateTicket (dev testing)
      .addCase(CreateTicket.pending, (state) => {
        state.status = "loading";
      })
      .addCase(CreateTicket.fulfilled, (state, action) => {
        state.status = "success";
        // Add new ticket to the beginning of the list
        if (action.payload?.data) {
          state.tickets = [action.payload.data, ...state.tickets];
          state.totalElements += 1;
        }
      })
      .addCase(CreateTicket.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // GetActiveTickets
      .addCase(GetActiveTickets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetActiveTickets.fulfilled, (state, action) => {
        state.status = "success";
        state.tickets = action.payload?.data?.content || [];
        state.totalElements = action.payload?.data?.totalElements || 0;
        state.totalPages = action.payload?.data?.totalPages || 0;
        state.currentPage = action.payload?.data?.number || 0;
      })
      .addCase(GetActiveTickets.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // GetTicketsByStatus
      .addCase(GetTicketsByStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetTicketsByStatus.fulfilled, (state, action) => {
        state.status = "success";
        state.tickets = action.payload?.data?.content || [];
        state.totalElements = action.payload?.data?.totalElements || 0;
        state.totalPages = action.payload?.data?.totalPages || 0;
        state.currentPage = action.payload?.data?.number || 0;
      })
      .addCase(GetTicketsByStatus.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // GetUnassignedTickets
      .addCase(GetUnassignedTickets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetUnassignedTickets.fulfilled, (state, action) => {
        state.status = "success";
        state.tickets = action.payload?.data?.content || [];
        state.totalElements = action.payload?.data?.totalElements || 0;
        state.totalPages = action.payload?.data?.totalPages || 0;
        state.currentPage = action.payload?.data?.number || 0;
      })
      .addCase(GetUnassignedTickets.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // GetMyAssignedTickets
      .addCase(GetMyAssignedTickets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetMyAssignedTickets.fulfilled, (state, action) => {
        state.status = "success";
        state.tickets = action.payload?.data?.content || [];
        state.totalElements = action.payload?.data?.totalElements || 0;
        state.totalPages = action.payload?.data?.totalPages || 0;
        state.currentPage = action.payload?.data?.number || 0;
      })
      .addCase(GetMyAssignedTickets.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // GetEscalatedTickets
      .addCase(GetEscalatedTickets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetEscalatedTickets.fulfilled, (state, action) => {
        state.status = "success";
        state.tickets = action.payload?.data?.content || [];
        state.totalElements = action.payload?.data?.totalElements || 0;
        state.totalPages = action.payload?.data?.totalPages || 0;
        state.currentPage = action.payload?.data?.number || 0;
      })
      .addCase(GetEscalatedTickets.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // GetSlaBreachedTickets
      .addCase(GetSlaBreachedTickets.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetSlaBreachedTickets.fulfilled, (state, action) => {
        state.status = "success";
        state.tickets = action.payload?.data?.content || [];
        state.totalElements = action.payload?.data?.totalElements || 0;
        state.totalPages = action.payload?.data?.totalPages || 0;
        state.currentPage = action.payload?.data?.number || 0;
      })
      .addCase(GetSlaBreachedTickets.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // GetTicketById
      .addCase(GetTicketById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(GetTicketById.fulfilled, (state, action) => {
        state.status = "success";
        state.selectedTicket = action.payload?.data;
      })
      .addCase(GetTicketById.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // UpdateTicket
      .addCase(UpdateTicket.pending, (state) => {
        state.status = "loading";
      })
      .addCase(UpdateTicket.fulfilled, (state, action) => {
        state.status = "success";
        updateTicketInList(state, action.payload?.data);
      })
      .addCase(UpdateTicket.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // StartTicketProgress
      .addCase(StartTicketProgress.pending, (state) => {
        state.status = "loading";
      })
      .addCase(StartTicketProgress.fulfilled, (state, action) => {
        state.status = "success";
        updateTicketInList(state, action.payload?.data);
      })
      .addCase(StartTicketProgress.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // AwaitCustomerResponse
      .addCase(AwaitCustomerResponse.pending, (state) => {
        state.status = "loading";
      })
      .addCase(AwaitCustomerResponse.fulfilled, (state, action) => {
        state.status = "success";
        updateTicketInList(state, action.payload?.data);
      })
      .addCase(AwaitCustomerResponse.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // EscalateTicket
      .addCase(EscalateTicket.pending, (state) => {
        state.status = "loading";
      })
      .addCase(EscalateTicket.fulfilled, (state, action) => {
        state.status = "success";
        updateTicketInList(state, action.payload?.data);
      })
      .addCase(EscalateTicket.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // ResolveTicket
      .addCase(ResolveTicket.pending, (state) => {
        state.status = "loading";
      })
      .addCase(ResolveTicket.fulfilled, (state, action) => {
        state.status = "success";
        updateTicketInList(state, action.payload?.data);
      })
      .addCase(ResolveTicket.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // CloseTicket
      .addCase(CloseTicket.pending, (state) => {
        state.status = "loading";
      })
      .addCase(CloseTicket.fulfilled, (state, action) => {
        state.status = "success";
        updateTicketInList(state, action.payload?.data);
      })
      .addCase(CloseTicket.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // AssignTicket
      .addCase(AssignTicket.pending, (state) => {
        state.status = "loading";
      })
      .addCase(AssignTicket.fulfilled, (state, action) => {
        state.status = "success";
        updateTicketInList(state, action.payload?.data);
      })
      .addCase(AssignTicket.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // AddNote
      .addCase(AddNote.pending, (state) => {
        state.status = "loading";
      })
      .addCase(AddNote.fulfilled, (state) => {
        state.status = "success";
        // Note doesn't update ticket data, just confirms success
      })
      .addCase(AddNote.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload as string;
      })

      // GetTicketStats
      .addCase(GetTicketStats.pending, (state) => {
        // Don't set loading for stats to avoid flickering
      })
      .addCase(GetTicketStats.fulfilled, (state, action) => {
        state.stats = action.payload?.data;
      })
      .addCase(GetTicketStats.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // GetDetailedTicketStats
      .addCase(GetDetailedTicketStats.pending, (state) => {
        // Don't set loading for stats to avoid flickering
      })
      .addCase(GetDetailedTicketStats.fulfilled, (state, action) => {
        state.detailedStats = action.payload?.data;
      })
      .addCase(GetDetailedTicketStats.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedTicket, resetStatus } = supportTicketSlice.actions;
export default supportTicketSlice.reducer;
