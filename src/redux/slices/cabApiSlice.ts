import { apiSlice, type PaginatedResponse, type SingleResponse } from './apiSlice';

export interface CabPlan {
  id: string;
  packageName: string;
  days: number;
  nights: number;
  tripRoute: string;
  pricePerPerson: number;
  withDriver: boolean;
  isActive: boolean;
  [key: string]: unknown;
}

export const cabApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getCabPlans: builder.query<PaginatedResponse<CabPlan>, Record<string, unknown> | void>({
      query: params => ({
        url: '/cab-plans',
        params: params || {},
      }),
      providesTags: ['CabPlan'],
    }),
    getCabPlanById: builder.query<SingleResponse<CabPlan>, string>({
      query: id => `/cab-plans/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'CabPlan', id }],
    }),
    getAdminCabPlans: builder.query<PaginatedResponse<CabPlan>, Record<string, unknown> | void>({
      query: params => ({
        url: '/cab-plans/admin/list',
        params: params || {},
      }),
      providesTags: ['CabPlan'],
    }),
    getAdminCabPlanById: builder.query<SingleResponse<CabPlan>, string>({
      query: id => `/cab-plans/admin/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'CabPlan', id }],
    }),
    createCabPlan: builder.mutation<SingleResponse<CabPlan>, Partial<CabPlan>>({
      query: body => ({
        url: '/cab-plans',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CabPlan'],
    }),
    updateCabPlan: builder.mutation<
      SingleResponse<CabPlan>,
      { id: string; body: Partial<CabPlan> }
    >({
      query: ({ id, body }) => ({
        url: `/cab-plans/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'CabPlan', id }, 'CabPlan'],
    }),
    deleteCabPlan: builder.mutation<unknown, string>({
      query: id => ({
        url: `/cab-plans/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['CabPlan'],
    }),
  }),
});

export const {
  useGetCabPlansQuery,
  useGetCabPlanByIdQuery,
  useGetAdminCabPlansQuery,
  useGetAdminCabPlanByIdQuery,
  useCreateCabPlanMutation,
  useUpdateCabPlanMutation,
  useDeleteCabPlanMutation,
} = cabApi;
