import { apiSlice, type SingleResponse } from './apiSlice';

export interface UploadedFile {
  filename: string;
  url: string;
  originalName?: string;
  size?: number;
  [key: string]: unknown;
}

export const uploadApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    uploadImage: builder.mutation<SingleResponse<{ url: string; filename: string } | string>, FormData>({
      query: formData => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Upload'],
    }),
    getUploads: builder.query<{ data: UploadedFile[] } | UploadedFile[], void>({
      query: () => '/upload',
      providesTags: ['Upload'],
    }),
    deleteUpload: builder.mutation<unknown, string>({
      query: filename => ({
        url: `/upload/${filename}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Upload'],
    }),
  }),
});

export const {
  useUploadImageMutation,
  useGetUploadsQuery,
  useDeleteUploadMutation,
} = uploadApi;
