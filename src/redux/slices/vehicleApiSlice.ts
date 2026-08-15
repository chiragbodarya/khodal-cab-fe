import { apiSlice, type PaginatedResponse, type SingleResponse } from './apiSlice';

export interface Vehicle {
  id: string;
  name: string;
  category: string;
  seatCapacity: number;
  pricePerKm: number;
  features: string[];
  isActive: boolean;
  [key: string]: unknown;
}

export const vehicleApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getVehicles: builder.query<PaginatedResponse<Vehicle>, Record<string, unknown> | void>({
      query: params => ({
        url: '/vehicles',
        params: params || {},
      }),
      providesTags: ['Vehicle'],
    }),
    getVehicleById: builder.query<SingleResponse<Vehicle>, string>({
      query: id => `/vehicles/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Vehicle', id }],
    }),
    getAdminVehicles: builder.query<PaginatedResponse<Vehicle>, Record<string, unknown> | void>({
      query: params => ({
        url: '/vehicles/admin/list',
        params: params || {},
      }),
      providesTags: ['Vehicle'],
    }),
    getAdminVehicleById: builder.query<SingleResponse<Vehicle>, string>({
      query: id => `/vehicles/admin/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Vehicle', id }],
    }),
    createVehicle: builder.mutation<SingleResponse<Vehicle>, Partial<Vehicle>>({
      query: body => ({
        url: '/vehicles',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Vehicle'],
    }),
    updateVehicle: builder.mutation<
      SingleResponse<Vehicle>,
      { id: string; body: Partial<Vehicle> }
    >({
      query: ({ id, body }) => ({
        url: `/vehicles/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Vehicle', id }, 'Vehicle'],
    }),
    deleteVehicle: builder.mutation<unknown, string>({
      query: id => ({
        url: `/vehicles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Vehicle'],
    }),
  }),
});

export const {
  useGetVehiclesQuery,
  useGetVehicleByIdQuery,
  useGetAdminVehiclesQuery,
  useGetAdminVehicleByIdQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = vehicleApi;
