import { useState } from 'react';
import {
  useGetBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} from '../../redux/slices/blogApiSlice';
import { LuPlus, LuTrash2, LuPen, LuTag, LuUser, LuX } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { useMemo, useCallback } from 'react';
import { Formik, Form } from 'formik';
import { FormikInput, FormikTextarea, FormikTagsInput } from '../../components/formik';
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
  const { data: blogData } = useGetBlogsQuery({});
  const blogs = blogData?.data || [];
  const [createBlog] = useCreateBlogMutation();
  const [updateBlog] = useUpdateBlogMutation();
  const [deleteBlog] = useDeleteBlogMutation();
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any | null>(null);

  const openAddModal = useCallback(() => {
    setEditingBlog(null);
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((blog: any) => {
    setEditingBlog(blog);
    setShowModal(true);
  }, []);

  const handleSubmit = async (values: any) => {
    const payload = {
      title: values.title,
      excerpt: values.excerpt,
      content: values.content,
      author: values.author,
      photo: values.photo,
      tags: values.tags,
    };

    try {
      if (editingBlog) {
        await updateBlog({ id: editingBlog.id || editingBlog._id, body: payload }).unwrap();
        toast.success('Blog article updated!');
      } else {
        await createBlog(payload).unwrap();
        toast.success('New blog article published!');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to save blog article.');
    }
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (
        window.confirm(
          'Are you sure you want to delete this blog post? This might affect SEO links.'
        )
      ) {
        try {
          await deleteBlog(id).unwrap();
          toast.success('Blog article deleted.');
        } catch (error) {
          toast.error('Failed to delete blog article.');
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
            src={b.photo}
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
            <div className="truncate text-[10px] text-zinc-400">{b.excerpt}</div>
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
            <div>{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : b.date}</div>
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
              onClick={() => openEditModal(b)}
              className="bg-zinc-850 cursor-pointer rounded border border-zinc-800 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              title="Edit"
            >
              <LuPen size={13} />
            </button>
            <button
              onClick={() => handleDelete(b.id || b._id)}
              className="bg-zinc-850 text-zinc-455 cursor-pointer rounded border border-zinc-800 p-1.5 transition-colors hover:bg-red-500/15 hover:text-red-400"
              title="Delete"
            >
              <LuTrash2 size={13} />
            </button>
          </div>
        ),
      },
    ],
    [openEditModal, handleDelete]
  );

  return (
    <div className="animate-in space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-white">SEO & Travel Blogs</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Write travel guides, itinerary diaries, and articles to boost your search presence
            (SEO).
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-400/10 transition-colors hover:bg-amber-300"
        >
          <LuPlus size={16} /> Compose Blog
        </button>
      </div>

      <Table
        data={blogs}
        keyFn={(row: any) => row.id || row._id}
        emptyMessage="No blogs posted. Click 'Compose Blog' to create your first article."
        columns={blogColumns}
      />

      {/* ── Compose Blog Modal ── */}
      {showModal && (
        <div className="animate-in fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 px-6 py-4">
              <h3 className="text-base font-bold text-white">
                {editingBlog ? 'Edit Blog Article' : 'Compose SEO Blog Article'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="cursor-pointer rounded bg-zinc-800 p-1 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              >
                <LuX size={18} />
              </button>
            </div>

            <Formik
              initialValues={
                editingBlog
                  ? {
                      title: editingBlog.title || '',
                      excerpt: editingBlog.excerpt || '',
                      content: editingBlog.content || '',
                      author: editingBlog.author || 'Rajesh Kumar',
                      photo: editingBlog.photo || BLOG_PHOTO_PRESETS[0].url,
                      tags: editingBlog.tags || [],
                    }
                  : {
                      title: '',
                      excerpt: '',
                      content: '',
                      author: 'Rajesh Kumar',
                      photo: BLOG_PHOTO_PRESETS[0].url,
                      tags: ['Travel Guides', 'Road Trip'],
                    }
              }
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="flex-grow space-y-4 overflow-y-auto p-6 text-xs text-zinc-300">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormikInput
                      name="title"
                      label="Article Title"
                      placeholder="Why Road Trips in Luxury Buses are the New Trend"
                      required
                    />

                    <FormikInput name="author" label="Author" required />
                  </div>

                  {/* Photo Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-455 block text-sm font-semibold">
                        Cover Image URL *
                      </span>
                      <span className="text-[10px] text-amber-400">Or pick a blog preset</span>
                    </div>
                    <FormikInput
                      name="photo"
                      placeholder="https://images.unsplash.com/..."
                      required
                    />
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {BLOG_PHOTO_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFieldValue('photo', preset.url)}
                          className={`bg-zinc-850 cursor-pointer rounded border px-3 py-1 text-[10px] font-semibold hover:bg-zinc-800 ${
                            values.photo === preset.url
                              ? 'border-amber-400 text-amber-400'
                              : 'border-zinc-800 text-zinc-400'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Excerpt */}
                  <FormikInput
                    name="excerpt"
                    label="Excerpt / Meta Description (SEO)"
                    placeholder="Summarize the article in 1-2 sentences for google search snippet..."
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

                  <div className="flex items-center justify-end gap-3 border-t border-zinc-800/80 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="cursor-pointer rounded-xl border border-zinc-800 px-4 py-2 font-semibold hover:bg-zinc-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="cursor-pointer rounded-xl bg-amber-400 px-5 py-2 font-bold text-zinc-950 hover:bg-amber-300"
                    >
                      {editingBlog ? 'Save Changes' : 'Publish Article'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageBlogs;
