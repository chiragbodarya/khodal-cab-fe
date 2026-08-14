import { apiSlice, type PaginatedResponse, type SingleResponse } from './apiSlice';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  planId?: string;
  planTitle?: string;
  status: 'pending' | 'responded';
  createdAt: string;
}

export const inquiryApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getInquiries: builder.query<
      PaginatedResponse<Inquiry>,
      { page?: number; limit?: number; status?: string }
    >({
      query: params => ({
        url: '/inquiries',
        params,
      }),
      providesTags: ['Inquiry'],
    }),
    getInquiryById: builder.query<SingleResponse<Inquiry>, string>({
      query: id => `/inquiries/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Inquiry', id }],
    }),
    createInquiry: builder.mutation<SingleResponse<Inquiry>, Partial<Inquiry>>({
      query: body => ({
        url: '/inquiries',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Inquiry'],
    }),
    updateInquiryStatus: builder.mutation<
      SingleResponse<Inquiry>,
      { id: string; status: 'pending' | 'responded' }
    >({
      query: ({ id, status }) => ({
        url: `/inquiries/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Inquiry', id }, 'Inquiry'],
    }),
    deleteInquiry: builder.mutation<unknown, string>({
      query: id => ({
        url: `/inquiries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Inquiry'],
    }),
  }),
});

export const {
  useGetInquiriesQuery,
  useGetInquiryByIdQuery,
  useCreateInquiryMutation,
  useUpdateInquiryStatusMutation,
  useDeleteInquiryMutation,
} = inquiryApi;
