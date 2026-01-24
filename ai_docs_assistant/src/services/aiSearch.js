// src/services/aiSearch.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const aiSearchApi = createApi({
  reducerPath: 'aiSearchApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8000/api',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    semanticSearch: builder.mutation({
      query: ({ query, filters }) => ({
        url: '/search/semantic',
        method: 'POST',
        body: { query, filters },
      }),
    }),
    getSimilarDocuments: builder.query({
      query: (documentId) => `/documents/${documentId}/similar`,
    }),
    extractEntities: builder.mutation({
      query: (documentId) => ({
        url: `/documents/${documentId}/entities`,
        method: 'POST',
      }),
    }),
    summarizeDocument: builder.mutation({
      query: ({ documentId, maxLength }) => ({
        url: `/documents/${documentId}/summarize`,
        method: 'POST',
        body: { max_length: maxLength },
      }),
    }),
  }),
});

export const {
  useSemanticSearchMutation,
  useGetSimilarDocumentsQuery,
  useExtractEntitiesMutation,
  useSummarizeDocumentMutation,
} = aiSearchApi;