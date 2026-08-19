import { useState, useMemo, useCallback } from 'react';
import {
  useGetGalleryQuery,
  useCreateGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} from '../../redux/slices/galleryApiSlice';
import { LuPlus, LuTrash2, LuPen, LuMapPin } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import { FormikInput, FormikSelect } from '../../components/common/formik';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { AdminDrawer } from '../../components/common/AdminDrawer';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';

const GALLERY_PHOTO_PRESETS = [
  {
    label: 'Luxury Sleeper Bus',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Highway Coach',
    url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Premium Cab Innova',
    url: 'https://images.unsplash.com/photo-1494976388531-d10580905c35?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Kerala Munnar Tea Estate',
    url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Taj Mahal Monument',
    url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
  },
];

export const ManageGallery = () => {
  const { data: galleryData } = useGetGalleryQuery({});
  const items = (galleryData?.data || []) as any[];

  const [createItem] = useCreateGalleryItemMutation();
  const [updateItem] = useUpdateGalleryItemMutation();
  const [deleteItem] = useDeleteGalleryItemMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const openAddDrawer = useCallback(() => {
    setEditingItem(null);
    setIsDrawerOpen(true);
  }, []);

  const openEditDrawer = useCallback((item: any) => {
    setEditingItem(item);
    setIsDrawerOpen(true);
  }, []);

  const handleSubmit = async (values: any) => {
    const payload = {
      title: values.title,
      imageUrl: values.imageUrl,
      photo: values.imageUrl,
      category: values.category,
      location: values.location,
    };

    try {
      if (editingItem) {
        await updateItem({
          id: String(editingItem.id || editingItem._id),
          body: payload as any,
        }).unwrap();
        toast.success('Gallery photo updated successfully!');
      } else {
        await createItem(payload as any).unwrap();
        toast.success('New photo added to gallery!');
      }
      setIsDrawerOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to save gallery photo.');
    }
  };

  const handleDelete = useCallback(
    async (id: string | number) => {
      if (window.confirm('Are you sure you want to remove this photo from the gallery?')) {
        try {
          await deleteItem(String(id)).unwrap();
          toast.success('Gallery photo deleted.');
        } catch (error: any) {
          toast.error(error?.data?.message || error?.message || 'Failed to delete photo.');
        }
      }
    },
    [deleteItem]
  );

  const columns: Column<any>[] = useMemo(
    () => [
      {
        header: 'Photo',
        render: (item: any) => (
          <img
            src={item.imageUrl || item.photo || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'}
            alt={item.title}
            className="h-12 w-20 rounded border border-zinc-800 object-cover"
          />
        ),
      },
      {
        header: 'Title / Caption',
        render: (item: any) => (
          <div className="max-w-xs space-y-0.5">
            <div className="font-bold text-white">{item.title}</div>
            {item.location && (
              <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                <LuMapPin size={10} className="text-amber-400" /> {item.location}
              </div>
            )}
          </div>
        ),
      },
      {
        header: 'Category',
        render: (item: any) => (
          <span className="inline-flex rounded border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-400 uppercase">
            {item.category || 'General'}
          </span>
        ),
      },
      {
        header: 'Actions',
        render: (item: any) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditDrawer(item)}
              className="cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              title="Edit"
            >
              <LuPen size={13} />
            </button>
            <button
              onClick={() => handleDelete(item.id || item._id)}
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
          <h1 className="text-2xl font-black text-white">Gallery Management</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Upload and organize showcase photos for buses, cabs, tour packages, and destinations.
          </p>
        </div>
        <button
          onClick={openAddDrawer}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-400/10 transition-colors hover:bg-amber-300"
        >
          <LuPlus size={16} /> Add Photo
        </button>
      </div>

      <Table
        data={items}
        keyFn={(row: any) => String(row.id || row._id)}
        emptyMessage="No photos in gallery. Click 'Add Photo' to upload showcase images."
        columns={columns}
      />

      {/* ── Add / Edit Gallery Drawer ── */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingItem ? 'Edit Gallery Photo' : 'Add Photo to Gallery'}
        subtitle={editingItem ? 'Update category, title, and image source' : 'Upload photos to display on the public gallery'}
        maxWidth="max-w-xl"
      >
        <Formik
          initialValues={
            editingItem
              ? {
                title: editingItem.title || '',
                imageUrl: editingItem.imageUrl || editingItem.photo || editingItem.image || editingItem.coverImage || (Array.isArray(editingItem.images) ? editingItem.images[0] : (typeof editingItem.images === 'string' ? editingItem.images : '')) || '',
                category: editingItem.category || 'bus',
                location: editingItem.location || '',
              }
              : {
                title: '',
                imageUrl: '',
                category: 'bus',
                location: '',
              }
          }
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-5 text-xs text-zinc-300">
              <FormikInput
                name="title"
                label="Photo Title / Caption"
                placeholder="e.g. Luxury Sleeper Bus Interior"
                required
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormikSelect
                  name="category"
                  label="Category"
                  options={[
                    { label: 'Buses & Coaches', value: 'bus' },
                    { label: 'Cabs & Cars', value: 'cab' },
                    { label: 'Holiday Destinations', value: 'destination' },
                  ]}
                  required
                />

                <FormikInput
                  name="location"
                  label="Location (Optional)"
                  placeholder="e.g. Surat Terminal, Kerala"
                />
              </div>

              {/* Image Upload Field */}
              <ImageUploadField
                name="imageUrl"
                label="Showcase Photo"
                value={values.imageUrl}
                onChange={url => setFieldValue('imageUrl', url)}
                presets={GALLERY_PHOTO_PRESETS}
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
                  {editingItem ? 'Save Changes' : 'Upload & Add'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </AdminDrawer>
    </div>
  );
};
export default ManageGallery;
