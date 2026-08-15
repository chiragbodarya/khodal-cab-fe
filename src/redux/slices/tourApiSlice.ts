import { apiSlice, type PaginatedResponse, type SingleResponse } from './apiSlice';

export interface TourPlan {
  id: string;
  packageName: string;
  days: number;
  nights: number;
  tripRoute: string;
  pricePerPerson: number;
  isActive: boolean;
  [key: string]: unknown;
}

export const tourApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getTourPlans: builder.query<PaginatedResponse<TourPlan>, Record<string, unknown> | void>({
      query: params => ({
        url: '/tour-plans',
        params: params || {},
      }),
      providesTags: ['TourPlan'],
    }),
    getTourPlanById: builder.query<SingleResponse<TourPlan>, string>({
      query: id => `/tour-plans/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'TourPlan', id }],
    }),
    getAdminTourPlans: builder.query<PaginatedResponse<TourPlan>, Record<string, unknown> | void>({
      query: params => ({
        url: '/tour-plans/admin/list',
        params: params || {},
      }),
      providesTags: ['TourPlan'],
    }),
    getAdminTourPlanById: builder.query<SingleResponse<TourPlan>, string>({
      query: id => `/tour-plans/admin/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'TourPlan', id }],
    }),
    createTourPlan: builder.mutation<SingleResponse<TourPlan>, Partial<TourPlan>>({
      query: body => ({
        url: '/tour-plans',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['TourPlan'],
    }),
    updateTourPlan: builder.mutation<
      SingleResponse<TourPlan>,
      { id: string; body: Partial<TourPlan> }
    >({
      query: ({ id, body }) => ({
        url: `/tour-plans/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'TourPlan', id }, 'TourPlan'],
    }),
    deleteTourPlan: builder.mutation<unknown, string>({
      query: id => ({
        url: `/tour-plans/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['TourPlan'],
    }),
  }),
});

export const {
  useGetTourPlansQuery,
  useGetTourPlanByIdQuery,
  useGetAdminTourPlansQuery,
  useGetAdminTourPlanByIdQuery,
  useCreateTourPlanMutation,
  useUpdateTourPlanMutation,
  useDeleteTourPlanMutation,
} = tourApi;
