import { apiSlice, type PaginatedResponse, type SingleResponse } from './apiSlice';

export interface Blog {
  id: string;
  title: string;
  content: string;
  tags: string[];
  slug: string;
  status: string;
  [key: string]: unknown;
}

export const blogApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getBlogs: builder.query<PaginatedResponse<Blog>, Record<string, unknown> | void>({
      query: params => ({
        url: '/blogs',
        params: params || {},
      }),
      providesTags: ['Blog'],
    }),
    getBlogBySlug: builder.query<SingleResponse<Blog>, string>({
      query: slug => `/blogs/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'Blog', id: slug }],
    }),
    getAdminBlogs: builder.query<PaginatedResponse<Blog>, Record<string, unknown> | void>({
      query: params => ({
        url: '/blogs/admin/list',
        params: params || {},
      }),
      providesTags: ['Blog'],
    }),
    getAdminBlogBySlug: builder.query<SingleResponse<Blog>, string>({
      query: slug => `/blogs/admin/${slug}`,
      providesTags: (_result, _error, slug) => [{ type: 'Blog', id: slug }],
    }),
    createBlog: builder.mutation<SingleResponse<Blog>, Partial<Blog>>({
      query: body => ({
        url: '/blogs',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Blog'],
    }),
    updateBlog: builder.mutation<SingleResponse<Blog>, { id: string; body: Partial<Blog> }>({
      query: ({ id, body }) => ({
        url: `/blogs/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Blog', id }, 'Blog'],
    }),
    deleteBlog: builder.mutation<unknown, string>({
      query: id => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog'],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogBySlugQuery,
  useGetAdminBlogsQuery,
  useGetAdminBlogBySlugQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
