import axios from "./api";
import {
  UpdateTicketRequest,
  ResolveTicketRequest,
  TicketCategory,
  TicketSubcategory,
  TicketSource,
} from "@/types/supportTicket";

const API_URL = "/admin/support/tickets";
const CUSTOMER_API_URL = "/support/tickets";

// =============================================================================
// CREATE TICKET (Customer endpoint - for dev testing only)
// =============================================================================

interface CreateTicketRequest {
  category: TicketCategory;
  subcategory?: TicketSubcategory;
  subject: string;
  description: string;
  source?: TicketSource;
}

const createTicket = async (data: CreateTicketRequest) => {
  try {
    const response = await axios.post(CUSTOMER_API_URL, {
      ...data,
      source: data.source || "ADMIN",
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const createTicketWithAttachments = async (
  data: CreateTicketRequest,
  files?: File[]
) => {
  try {
    const formData = new FormData();

    // Add ticket data as JSON blob
    const ticketData = {
      ...data,
      source: data.source || "ADMIN",
    };
    formData.append(
      "ticket",
      new Blob([JSON.stringify(ticketData)], { type: "application/json" })
    );

    // Add files if provided
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    const response = await axios.post(
      `${CUSTOMER_API_URL}/with-attachments`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// =============================================================================
// LIST ENDPOINTS
// =============================================================================

const getActiveTickets = async (page = 0, size = 20) => {
  try {
    const response = await axios.get(`${API_URL}?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getTicketsByStatus = async (status: string, page = 0, size = 20) => {
  try {
    const response = await axios.get(
      `${API_URL}/status/${status}?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getUnassignedTickets = async (page = 0, size = 20) => {
  try {
    const response = await axios.get(
      `${API_URL}/unassigned?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getMyAssignedTickets = async (page = 0, size = 20) => {
  try {
    const response = await axios.get(`${API_URL}/mine?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getEscalatedTickets = async (page = 0, size = 20) => {
  try {
    const response = await axios.get(
      `${API_URL}/escalated?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getSlaBreachedTickets = async (page = 0, size = 20) => {
  try {
    const response = await axios.get(
      `${API_URL}/sla-breached?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// =============================================================================
// SINGLE TICKET ENDPOINTS
// =============================================================================

const getTicketById = async (ticketId: string) => {
  try {
    const response = await axios.get(`${API_URL}/${ticketId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const updateTicket = async (ticketId: string, data: UpdateTicketRequest) => {
  try {
    const response = await axios.put(`${API_URL}/${ticketId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// =============================================================================
// ACTION ENDPOINTS
// =============================================================================

const startProgress = async (ticketId: string) => {
  try {
    const response = await axios.put(`${API_URL}/${ticketId}/start`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const awaitCustomer = async (ticketId: string) => {
  try {
    const response = await axios.put(`${API_URL}/${ticketId}/await-customer`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const escalateTicket = async (ticketId: string, reason?: string) => {
  try {
    const url = reason
      ? `${API_URL}/${ticketId}/escalate?reason=${encodeURIComponent(reason)}`
      : `${API_URL}/${ticketId}/escalate`;
    const response = await axios.put(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const resolveTicket = async (ticketId: string, data: ResolveTicketRequest) => {
  try {
    const response = await axios.put(`${API_URL}/${ticketId}/resolve`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const closeTicket = async (ticketId: string) => {
  try {
    const response = await axios.put(`${API_URL}/${ticketId}/close`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const assignTicket = async (ticketId: string, assignedTo: string) => {
  try {
    const response = await axios.put(`${API_URL}/${ticketId}`, { assignedTo });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const addNote = async (ticketId: string, note: string) => {
  try {
    const response = await axios.post(`${API_URL}/${ticketId}/notes`, { note });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getTicketHistory = async (ticketId: string, page = 0, size = 50) => {
  try {
    const response = await axios.get(
      `${API_URL}/${ticketId}/history?page=${page}&size=${size}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// =============================================================================
// STATS ENDPOINTS
// =============================================================================

const getBasicStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getDetailedStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/stats/detailed`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// =============================================================================
// ATTACHMENT ENDPOINTS
// =============================================================================

const getTicketAttachments = async (ticketId: string) => {
  try {
    const response = await axios.get(`${API_URL}/${ticketId}/attachments`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const getAttachmentDownloadUrl = async (attachmentId: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/attachments/${attachmentId}/download`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const deleteAttachment = async (attachmentId: string) => {
  try {
    const response = await axios.delete(
      `${API_URL}/attachments/${attachmentId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

const addAttachment = async (
  ticketId: string,
  file: File,
  description?: string
) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    if (description) {
      formData.append("description", description);
    }

    const response = await axios.post(
      `${CUSTOMER_API_URL}/${ticketId}/attachments`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// =============================================================================
// EXPORT
// =============================================================================

const supportTicketService = {
  // Create (dev testing)
  createTicket,
  createTicketWithAttachments,
  // List
  getActiveTickets,
  getTicketsByStatus,
  getUnassignedTickets,
  getMyAssignedTickets,
  getEscalatedTickets,
  getSlaBreachedTickets,
  // Single
  getTicketById,
  updateTicket,
  // Actions
  startProgress,
  awaitCustomer,
  escalateTicket,
  resolveTicket,
  closeTicket,
  assignTicket,
  addNote,
  getTicketHistory,
  // Stats
  getBasicStats,
  getDetailedStats,
  // Attachments
  getTicketAttachments,
  getAttachmentDownloadUrl,
  deleteAttachment,
  addAttachment,
};

export default supportTicketService;
