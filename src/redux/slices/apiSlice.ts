import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Common Types
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface SingleResponse<T> {
  data: T;
  message?: string;
}

// Base API
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    credentials: 'include', // Important for cookies (access token)
    prepareHeaders: headers => {
      return headers;
    },
  }),
  tagTypes: ['Admin', 'TourPlan', 'CabPlan', 'Vehicle', 'Blog', 'Gallery', 'Inquiry'],
  endpoints: () => ({}),
});
