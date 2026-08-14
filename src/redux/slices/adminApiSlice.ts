import { apiSlice, type PaginatedResponse, type SingleResponse } from './apiSlice';

export interface Admin {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthResponse {
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    admin: Admin;
  };
}

export const adminApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<AuthResponse, Record<string, unknown>>({
      query: credentials => ({
        url: '/admin/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Admin'],
    }),
    refresh: builder.mutation<
      { data: { accessToken: string; refreshToken: string } },
      { refreshToken: string }
    >({
      query: body => ({
        url: '/admin/auth/refresh',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<unknown, { refreshToken: string }>({
      query: body => ({
        url: '/admin/auth/logout',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Admin'],
    }),
    getCurrentAdmin: builder.query<SingleResponse<{ admin: Admin }>, void>({
      query: () => '/admin/me',
      providesTags: ['Admin'],
    }),
    getAdmins: builder.query<PaginatedResponse<Admin>, { page?: number; limit?: number }>({
      query: params => ({
        url: '/admin/',
        params,
      }),
      providesTags: ['Admin'],
    }),
    createAdmin: builder.mutation<SingleResponse<Admin>, Record<string, unknown>>({
      query: body => ({
        url: '/admin/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Admin'],
    }),
    changePassword: builder.mutation<
      unknown,
      { id: string; currentPassword: string; newPassword: string }
    >({
      query: ({ id, ...body }) => ({
        url: `/admin/${id}/password`,
        method: 'PUT',
        body,
      }),
    }),
    deleteAdmin: builder.mutation<unknown, string>({
      query: id => ({
        url: `/admin/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshMutation,
  useLogoutMutation,
  useGetCurrentAdminQuery,
  useGetAdminsQuery,
  useCreateAdminMutation,
  useChangePasswordMutation,
  useDeleteAdminMutation,
} = adminApi;
