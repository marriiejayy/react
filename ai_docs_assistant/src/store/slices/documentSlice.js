// src/store/slices/documentSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { addNotification } from './uiSlice';

// Async thunk for document upload
export const uploadDocument = createAsyncThunk(
  'document/uploadDocument',
  async (file, { dispatch, rejectWithValue, getState }) => {
    try {
      const { token } = getState().auth;
      
      const formData = new FormData();
      formData.append('file', file);

      // Simulate API call - replace with actual FastAPI endpoint
      const response = await fetch('http://localhost:8000/api/documents/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      
      // Add notification
      dispatch(addNotification({
        id: Date.now(),
        type: 'success',
        message: `Document "${file.name}" uploaded successfully`,
      }));

      return data;
    } catch (error) {
      dispatch(addNotification({
        id: Date.now(),
        type: 'error',
        message: `Failed to upload "${file.name}"`,
      }));
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for processing document
export const processDocument = createAsyncThunk(
  'document/processDocument',
  async (documentId, { getState, rejectWithValue }) => {
    try {
      const { token } = getState().auth;
      
      // Simulate API call - replace with actual FastAPI endpoint
      const response = await fetch(`http://localhost:8000/api/documents/${documentId}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Processing failed');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  documents: [
    {
      id: '1',
      name: 'Quarterly Report Q3 2024.pdf',
      size: '2.4 MB',
      uploadedAt: '2024-10-15T10:30:00Z',
      status: 'processed',
      summary: 'Financial analysis showing 15% revenue growth',
    },
    {
      id: '2',
      name: 'Market Research Analysis.docx',
      size: '1.8 MB',
      uploadedAt: '2024-10-14T14:20:00Z',
      status: 'pending',
      summary: '',
    },
    {
      id: '3',
      name: 'Project Proposal - AI Integration.pdf',
      size: '3.2 MB',
      uploadedAt: '2024-10-13T09:45:00Z',
      status: 'processed',
      summary: 'Proposal for integrating AI assistant into workflow',
    },
  ],
  selectedDocument: null,
  isUploading: false,
  isLoading: false,
  error: null,
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    setDocuments: (state, action) => {
      state.documents = action.payload;
    },
    selectDocument: (state, action) => {
      state.selectedDocument = action.payload;
    },
    deleteDocument: (state, action) => {
      state.documents = state.documents.filter(doc => doc.id !== action.payload);
      if (state.selectedDocument?.id === action.payload) {
        state.selectedDocument = null;
      }
    },
    clearDocuments: (state) => {
      state.documents = [];
      state.selectedDocument = null;
    },
    updateDocument: (state, action) => {
      const index = state.documents.findIndex(doc => doc.id === action.payload.id);
      if (index !== -1) {
        state.documents[index] = { ...state.documents[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isUploading = false;
        if (action.payload?.document) {
          state.documents.unshift(action.payload.document);
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload;
      })
      .addCase(processDocument.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(processDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.documents.findIndex(doc => doc.id === action.payload?.documentId);
        if (index !== -1) {
          state.documents[index].status = 'processed';
          state.documents[index].summary = action.payload?.summary || '';
        }
      })
      .addCase(processDocument.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setDocuments,
  selectDocument,
  deleteDocument,
  clearDocuments,
  updateDocument,
} = documentSlice.actions;

export default documentSlice.reducer;