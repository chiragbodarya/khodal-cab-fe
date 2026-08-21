import { useState, useMemo, useCallback } from 'react';
import {
  useGetAdminBlogsQuery,
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from '../../redux/slices/blogApiSlice';
import { LuPlus, LuTrash2, LuPen, LuTag, LuUser } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import { FormikInput, FormikTextarea, FormikTagsInput } from '../../components/common/formik';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { AdminDrawer } from '../../components/common/AdminDrawer';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';

const BLOG_PHOTO_PRESETS = [
  {
    label: 'Road Trip Bus',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Sunset Taj Mahal',
    url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Mountain Travel',
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Beach Travel Pack',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
];

export const ManageBlogs = () => {
  const { data: adminBlogData, isError } = useGetAdminBlogsQuery({});
  const { data: publicBlogData } = useGetBlogsQuery(undefined, { skip: !isError });
  const blogs = (adminBlogData?.data || publicBlogData?.data || []) as any[];

  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  const openAddDrawer = useCallback(() => {
    setEditingBlog(null);
    setIsDrawerOpen(true);
  }, []);

  const openEditDrawer = useCallback((blog: any) => {
    setEditingBlog(blog);
    setIsDrawerOpen(true);
  }, []);

  const handleSubmit = async (values: any) => {
    const slug =
      values.slug ||
      values.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const payload = {
      title: values.title,
      slug,
      excerpt: values.excerpt,
      content: values.content,
      author: values.author,
      photo: values.photo,
      coverImage: values.photo,
      tags: values.tags || [],
      status: 'published',
    };

    try {
      if (editingBlog) {
        await updateBlog({
          id: String(editingBlog.id || editingBlog._id),
          body: payload as any,
        }).unwrap();
        toast.success('Blog article updated successfully!');
      } else {
        await createBlog(payload as any).unwrap();
        toast.success('New blog article published!');
      }
      setIsDrawerOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to save blog article.');
    }
  };

  const handleDelete = useCallback(
    async (id: string | number) => {
      if (
        window.confirm(
          'Are you sure you want to delete this blog post? This might affect SEO links.'
        )
      ) {
        try {
          await deleteBlog(String(id)).unwrap();
          toast.success('Blog article deleted.');
        } catch (error: any) {
          toast.error(error?.data?.message || error?.message || 'Failed to delete blog article.');
        }
      }
    },
    [deleteBlog]
  );

  const blogColumns: Column<any>[] = useMemo(
    () => [
      {
        header: 'Cover',
        render: (b: any) => (
          <img
            src={b.photo || b.coverImage || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'}
            alt={b.title}
            className="h-10 w-16 rounded border border-zinc-800 object-cover"
          />
        ),
      },
      {
        header: 'Details',
        render: (b: any) => (
          <div className="max-w-xs space-y-1">
            <div className="truncate leading-tight font-bold text-white">{b.title}</div>
            <div className="truncate text-[10px] text-zinc-400">{b.excerpt || b.content?.slice(0, 60)}</div>
          </div>
        ),
      },
      {
        header: 'Author & Date',
        render: (b: any) => (
          <div className="space-y-0.5 text-xs text-zinc-400">
            <div className="flex items-center gap-1">
              <LuUser size={10} /> {b.author || 'Admin'}
            </div>
            <div>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : 'Recent'}</div>
          </div>
        ),
      },
      {
        header: 'Tags & Views',
        render: (b: any) => (
          <div className="space-y-1">
            <div className="flex w-fit items-center gap-1 rounded bg-amber-400/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
              <LuTag size={10} /> {(b.tags || [])[0] || 'Travel'}
            </div>
            <div className="text-[10px] text-zinc-500">{b.views || 0} views</div>
          </div>
        ),
      },
      {
        header: 'Actions',
        render: (b: any) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditDrawer(b)}
              className="cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              title="Edit"
            >
              <LuPen size={13} />
            </button>
            <button
              onClick={() => handleDelete(b.id || b._id)}
              className="cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:bg-red-500/15 hover:text-red-400"
              title="Delete"
            >
              <LuTrash2 size={13} />
            </button>
          </div>
        ),
      },
    ],
    [openEditDrawer, handleDelete]
  );

  return (
    <div className="animate-in space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-white">SEO & Travel Blogs</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Write travel guides, itinerary diaries, and articles to boost your search presence (SEO).
          </p>
        </div>
        <button
          onClick={openAddDrawer}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-400/10 transition-colors hover:bg-amber-300"
        >
          <LuPlus size={16} /> Compose Blog
        </button>
      </div>

      <Table
        data={blogs}
        keyFn={(row: any) => String(row.id || row._id)}
        emptyMessage="No blogs posted. Click 'Compose Blog' to create your first article."
        columns={blogColumns}
      />

      {/* ── Compose / Edit Blog Drawer ── */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingBlog ? 'Edit Blog Article' : 'Compose SEO Blog Article'}
        subtitle={editingBlog ? 'Update article details, cover image, and metadata' : 'Publish travel stories, news, and destination guides'}
        maxWidth="max-w-2xl"
      >
        <Formik
          initialValues={
            editingBlog
              ? {
                title: editingBlog.title || '',
                excerpt: editingBlog.excerpt || '',
                content: editingBlog.content || '',
                author: editingBlog.author || '',
                photo: editingBlog.photo || editingBlog.coverImage || editingBlog.imageUrl || editingBlog.image || (Array.isArray(editingBlog.images) ? editingBlog.images[0] : (typeof editingBlog.images === 'string' ? editingBlog.images : '')) || '',
                tags: editingBlog.tags || [],
              }
              : {
                title: '',
                excerpt: '',
                content: '',
                author: '',
                photo: '',
                tags: [],
              }
          }
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-5 text-xs text-zinc-300">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormikInput
                  name="title"
                  label="Article Title"
                  placeholder="Why Road Trips in Luxury Buses are the New Trend"
                  required
                />

                <FormikInput
                  name="author"
                  label="Author"
                  placeholder="e.g. Editorial Team or Admin"
                  required
                />
              </div>

              {/* Enhanced Image Upload Field */}
              <ImageUploadField
                name="photo"
                label="Blog Cover Photo"
                value={values.photo}
                onChange={url => setFieldValue('photo', url)}
                presets={BLOG_PHOTO_PRESETS}
                required
              />

              {/* Excerpt */}
              <FormikInput
                name="excerpt"
                label="Excerpt / Meta Description (SEO)"
                placeholder="Summarize the article in 1-2 sentences for Google search snippet..."
                required
              />

              <FormikTagsInput
                name="tags"
                label="Article Tags"
                placeholder="e.g. Travel Tips"
                tagPrefix="#"
              />

              {/* Content Body */}
              <FormikTextarea
                name="content"
                label="Article Body Content"
                rows={8}
                className="font-mono text-[11px] leading-relaxed"
                placeholder="Write the full post here. You can use markdown sub-headings like ### to format your article sections..."
                required
              />

              <div className="flex items-center justify-end gap-3 border-t border-zinc-800/80 pt-5">
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="cursor-pointer rounded-xl border border-zinc-800 px-4 py-2.5 font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="cursor-pointer rounded-xl bg-amber-400 px-5 py-2.5 font-bold text-zinc-950 shadow-lg shadow-amber-400/10 hover:bg-amber-300"
                >
                  {editingBlog ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </AdminDrawer>
    </div>
  );
};
export default ManageBlogs;
