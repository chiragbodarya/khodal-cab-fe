import { apiSlice, type PaginatedResponse, type SingleResponse } from './apiSlice';

export type InquiryType = 'CONTACT_US' | 'VEHICLE' | 'TOUR_PLAN' | 'CAB_PLAN';

export type InquiryStatus =
  | 'NEW'
  | 'IN_PROGRESS'
  | 'CALL_BACK_REQUESTED'
  | 'CONFIRMED'
  | 'RESOLVED'
  | 'CANCELLED'
  | 'pending'
  | 'responded';

export interface Inquiry {
  id: number | string;
  type: InquiryType;
  status: InquiryStatus;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  pickupLocation?: string;
  dropLocation?: string;
  travelDate?: string;
  returnDate?: string;
  passengers?: number;
  vehicleId?: number | string | null;
  cabPlanId?: number | string | null;
  tourPlanId?: number | string | null;
  planId?: string | number;
  planTitle?: string;
  isWorkedOn?: boolean;
  followUpDate?: string | null;
  adminNotes?: string | null;
  lastContactedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
  vehicle?: any;
  tourPlan?: any;
  cabPlan?: any;
}

export interface InquiryStats {
  total: number;
  newInquiries: number;
  inProgress: number;
  callBackRequested: number;
  confirmed: number;
  todayFollowUps: number;
}

export interface AdminInquiryQueryParams {
  page?: number;
  limit?: number;
  type?: InquiryType;
  status?: InquiryStatus;
  isWorkedOn?: 'true' | 'false' | boolean;
  followUp?: 'today' | 'pending';
  search?: string;
}

export const inquiryApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    // 1. Public Submit Inquiry (Vehicle, Tour, Cab, Contact Us)
    createInquiry: builder.mutation<SingleResponse<Inquiry>, Partial<Inquiry>>({
      query: body => ({
        url: '/inquiries',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Inquiry'],
    }),

    // 2. Admin List Inquiries (with filters, search, pagination)
    getAdminInquiries: builder.query<PaginatedResponse<Inquiry>, AdminInquiryQueryParams | void>({
      query: params => ({
        url: '/inquiries/admin/list',
        params: params || {},
      }),
      providesTags: ['Inquiry'],
    }),

    // Fallback/alias for public/admin general query
    getInquiries: builder.query<PaginatedResponse<Inquiry>, AdminInquiryQueryParams | void>({
      query: params => ({
        url: '/inquiries/admin/list',
        params: params || {},
      }),
      providesTags: ['Inquiry'],
    }),

    // 3. Admin Inquiry Statistics
    getAdminInquiryStats: builder.query<SingleResponse<InquiryStats>, void>({
      query: () => '/inquiries/admin/stats',
      providesTags: ['Inquiry'],
    }),

    // 4. Admin Single Inquiry by ID
    getAdminInquiryById: builder.query<SingleResponse<Inquiry>, string | number>({
      query: id => `/inquiries/admin/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Inquiry', id }],
    }),

    getInquiryById: builder.query<SingleResponse<Inquiry>, string | number>({
      query: id => `/inquiries/admin/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Inquiry', id }],
    }),

    // 5. Admin Update Inquiry (status, followUpDate, adminNotes, isWorkedOn)
    updateAdminInquiry: builder.mutation<
      SingleResponse<Inquiry>,
      { id: string | number; body: Partial<Inquiry> }
    >({
      query: ({ id, body }) => ({
        url: `/inquiries/admin/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Inquiry', id }, 'Inquiry'],
    }),

    updateInquiryStatus: builder.mutation<
      SingleResponse<Inquiry>,
      { id: string | number; status?: string; [key: string]: any }
    >({
      query: ({ id, ...body }) => ({
        url: `/inquiries/admin/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Inquiry', id }, 'Inquiry'],
    }),

    // 6. Admin Delete Inquiry
    deleteAdminInquiry: builder.mutation<unknown, string | number>({
      query: id => ({
        url: `/inquiries/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Inquiry'],
    }),

    deleteInquiry: builder.mutation<unknown, string | number>({
      query: id => ({
        url: `/inquiries/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Inquiry'],
    }),
  }),
});

export const {
  useCreateInquiryMutation,
  useGetAdminInquiriesQuery,
  useGetInquiriesQuery,
  useGetAdminInquiryStatsQuery,
  useGetAdminInquiryByIdQuery,
  useGetInquiryByIdQuery,
  useUpdateAdminInquiryMutation,
  useUpdateInquiryStatusMutation,
  useDeleteAdminInquiryMutation,
  useDeleteInquiryMutation,
} = inquiryApi;
