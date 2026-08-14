import { apiSlice, type PaginatedResponse, type SingleResponse } from './apiSlice';

export interface GalleryItem {
  id: string;
  imageUrl: string;
  category: string;
  title: string;
  [key: string]: unknown;
}

export const galleryApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getGallery: builder.query<PaginatedResponse<GalleryItem>, Record<string, unknown> | void>({
      query: params => ({
        url: '/gallery',
        params: params || {},
      }),
      providesTags: ['Gallery'],
    }),
    getGalleryById: builder.query<SingleResponse<GalleryItem>, string>({
      query: id => `/gallery/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Gallery', id }],
    }),
    createGalleryItem: builder.mutation<SingleResponse<GalleryItem>, Partial<GalleryItem>>({
      query: body => ({
        url: '/gallery',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Gallery'],
    }),
    updateGalleryItem: builder.mutation<
      SingleResponse<GalleryItem>,
      { id: string; body: Partial<GalleryItem> }
    >({
      query: ({ id, body }) => ({
        url: `/gallery/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Gallery', id }, 'Gallery'],
    }),
    deleteGalleryItem: builder.mutation<unknown, string>({
      query: id => ({
        url: `/gallery/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Gallery'],
    }),
  }),
});

export const {
  useGetGalleryQuery,
  useGetGalleryByIdQuery,
  useCreateGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} = galleryApi;
