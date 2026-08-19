import { useState, useMemo, useCallback } from 'react';
import {
  useGetAdminTourPlansQuery,
  useGetTourPlansQuery,
  useCreateTourPlanMutation,
  useUpdateTourPlanMutation,
  useDeleteTourPlanMutation,
} from '../../redux/slices/tourApiSlice';
import { LuPlus, LuTrash2, LuPen, LuMapPin, LuClock, LuSearch } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import { FormikInput, FormikTextarea, FormikTagsInput } from '../../components/common/formik';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { AdminDrawer } from '../../components/common/AdminDrawer';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';

const TOUR_PHOTO_PRESETS = [
  {
    label: 'Taj Mahal Heritage',
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Goa Coastal Package',
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Kerala Backwaters',
    url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Rajasthan Royal Forts',
    url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
  },
];

export const ManageTours = () => {
  const { data: adminData, isError, isLoading } = useGetAdminTourPlansQuery();
  const { data: publicData } = useGetTourPlansQuery(undefined, { skip: !isError });

  const [createTourPlan] = useCreateTourPlanMutation();
  const [updateTourPlan] = useUpdateTourPlanMutation();
  const [deleteTourPlan] = useDeleteTourPlanMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const tourPlans = useMemo(() => {
    const raw = adminData?.data || publicData?.data || [];
    return Array.isArray(raw) ? raw : [];
  }, [adminData, publicData]);

  const filteredTours = useMemo(() => {
    if (!searchQuery.trim()) return tourPlans;
    const q = searchQuery.toLowerCase();
    return tourPlans.filter((p: any) => {
      const title = (p.title || p.packageName || '').toLowerCase();
      const dest = (p.destination || p.tripRoute || '').toLowerCase();
      return title.includes(q) || dest.includes(q);
    });
  }, [tourPlans, searchQuery]);

  const openAddDrawer = useCallback(() => {
    setEditingTour(null);
    setIsDrawerOpen(true);
  }, []);

  const openEditDrawer = useCallback((tour: any) => {
    setEditingTour(tour);
    setIsDrawerOpen(true);
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        title: values.title,
        packageName: values.title,
        destination: values.destination,
        tripRoute: values.destination,
        days: Number(values.days),
        nights: Number(values.nights),
        duration: values.duration || `${values.days} Days / ${values.nights} Nights`,
        price: Number(values.price),
        pricePerPerson: Number(values.price),
        photo: values.photo,
        coverImage: values.photo,
        description: values.description,
        packageDescription: values.description,
        highlights: values.highlights || [],
        inclusions: values.inclusions || [],
        isActive: true,
      };

      if (editingTour) {
        await updateTourPlan({
          id: String(editingTour.id || editingTour._id),
          body: payload as any,
        }).unwrap();
        toast.success('Tour package updated successfully!');
      } else {
        await createTourPlan(payload as any).unwrap();
        toast.success('New tour package published!');
      }
      setIsDrawerOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to save tour package.');
    }
  };

  const handleDelete = useCallback(
    async (id: string | number) => {
      if (window.confirm('Are you sure you want to delete this tour package?')) {
        try {
          await deleteTourPlan(String(id)).unwrap();
          toast.success('Tour package deleted successfully.');
        } catch (error: any) {
          toast.error(error?.data?.message || error?.message || 'Failed to delete tour package.');
        }
      }
    },
    [deleteTourPlan]
  );

  const columns: Column<any>[] = useMemo(
    () => [
      {
        header: 'Cover',
        render: (p: any) => (
          <img
            src={p.photo || p.coverImage || 'https://images.unsplash.com/photo-1599661046289-e31897846e41'}
            alt={p.title || p.packageName}
            className="h-10 w-16 rounded-xl border border-zinc-800 object-cover"
          />
        ),
      },
      {
        header: 'Package Details',
        render: (p: any) => (
          <div className="max-w-xs space-y-1">
            <div className="truncate leading-tight font-bold text-white">
              {p.title || p.packageName}
            </div>
            <div className="truncate text-[10px] text-zinc-400">
              {p.description || p.packageDescription || 'No description provided'}
            </div>
          </div>
        ),
      },
      {
        header: 'Destination & Duration',
        render: (p: any) => (
          <div className="space-y-0.5 text-xs text-zinc-400">
            <div className="flex items-center gap-1 font-semibold text-amber-400">
              <LuMapPin size={11} /> {p.destination || p.tripRoute || 'All India'}
            </div>
            <div className="flex items-center gap-1">
              <LuClock size={11} /> {p.duration || `${p.days || 1} Days / ${p.nights || 0} Nights`}
            </div>
          </div>
        ),
      },
      {
        header: 'Price / Person',
        render: (p: any) => (
          <div className="text-sm font-black text-white">
            ₹{(p.price || p.pricePerPerson || 0).toLocaleString('en-IN')}
          </div>
        ),
      },
      {
        header: 'Actions',
        render: (p: any) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditDrawer(p)}
              className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:border-amber-400/40 hover:bg-zinc-800 hover:text-white"
              title="Edit Tour Package"
            >
              <LuPen size={13} />
            </button>
            <button
              onClick={() => handleDelete(p.id || p._id)}
              className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              title="Delete Tour Package"
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
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white">Tour Packages Management</h1>
            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-0.5 text-xs font-bold text-amber-400">
              {tourPlans.length} {tourPlans.length === 1 ? 'Package' : 'Packages'}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Create, update, and manage holiday tours, pilgrimages, and group packages.
          </p>
        </div>

        <button
          onClick={openAddDrawer}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-400/10 transition-colors hover:bg-amber-300"
        >
          <LuPlus size={16} /> Create Tour Package
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
        <div className="relative flex-1">
          <LuSearch className="absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-500" size={15} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search tours by package name or destination..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 transition-colors focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      <Table
        data={filteredTours}
        keyFn={(row: any) => String(row.id || row._id)}
        emptyMessage={
          isLoading
            ? 'Loading tour packages...'
            : searchQuery
            ? 'No tour packages match your search.'
            : "No tour packages listed. Click 'Create Tour Package' to add your first package."
        }
        columns={columns}
      />

      {/* ── Add / Edit Tour Drawer ── */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingTour ? 'Edit Tour Package Details' : 'Create New Tour Package'}
        subtitle={editingTour ? 'Update itinerary, duration, and pricing' : 'Configure destination, pricing, and package inclusions'}
        maxWidth="max-w-2xl"
      >
        <Formik
          initialValues={
            editingTour
              ? {
                title: editingTour.title || editingTour.packageName || '',
                destination: editingTour.destination || editingTour.tripRoute || '',
                days: editingTour.days !== undefined ? editingTour.days : '',
                nights: editingTour.nights !== undefined ? editingTour.nights : '',
                duration: editingTour.duration || '',
                price: editingTour.price || editingTour.pricePerPerson || '',
                photo: editingTour.photo || editingTour.coverImage || editingTour.imageUrl || editingTour.image || (Array.isArray(editingTour.images) ? editingTour.images[0] : (typeof editingTour.images === 'string' ? editingTour.images : '')) || '',
                description: editingTour.description || editingTour.packageDescription || '',
                highlights: editingTour.highlights || [],
                inclusions: editingTour.inclusions || [],
              }
              : {
                title: '',
                destination: '',
                days: '',
                nights: '',
                duration: '',
                price: '',
                photo: '',
                description: '',
                highlights: [],
                inclusions: [],
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
                  label="Tour Package Title"
                  placeholder="e.g. Rajasthan Royal Forts & Palaces"
                  required
                />

                <FormikInput
                  name="destination"
                  label="Destination / Route"
                  placeholder="e.g. Jaipur - Jodhpur - Udaipur"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormikInput
                  name="days"
                  type="number"
                  label="Days"
                  placeholder="e.g. 5"
                  min={1}
                  required
                />

                <FormikInput
                  name="nights"
                  type="number"
                  label="Nights"
                  placeholder="e.g. 4"
                  min={0}
                  required
                />

                <FormikInput
                  name="price"
                  type="number"
                  label="Price Per Person (INR)"
                  placeholder="e.g. 14500"
                  min={1}
                  required
                />
              </div>

              <FormikInput
                name="duration"
                label="Duration Label (Optional)"
                placeholder="e.g. 5 Days / 4 Nights"
              />

              {/* Image Upload Field */}
              <ImageUploadField
                name="photo"
                label="Tour Cover Image Photo"
                value={values.photo}
                onChange={url => setFieldValue('photo', url)}
                presets={TOUR_PHOTO_PRESETS}
                required
              />

              <FormikTagsInput
                name="highlights"
                label="Package Highlights & Key Features"
                placeholder="e.g. Fort Visit, Desert Safari, Folk Dance"
              />

              <FormikTagsInput
                name="inclusions"
                label="Package Inclusions"
                placeholder="e.g. AC Bus, 3-Star Hotels, Breakfast & Dinner, Sightseeing"
              />

              <FormikTextarea
                name="description"
                label="Detailed Description & Itinerary"
                rows={3}
                placeholder="Describe day-by-day travel plan, sightseeing places, pickup points, and policies..."
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
                  {editingTour ? 'Save Changes' : 'Publish Tour Package'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </AdminDrawer>
    </div>
  );
};

export default ManageTours;
