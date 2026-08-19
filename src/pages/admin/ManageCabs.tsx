import { useState, useMemo, useCallback } from 'react';
import {
  useGetAdminCabPlansQuery,
  useGetCabPlansQuery,
  useCreateCabPlanMutation,
  useUpdateCabPlanMutation,
  useDeleteCabPlanMutation,
} from '../../redux/slices/cabApiSlice';
import { LuPlus, LuTrash2, LuPen, LuMapPin, LuClock, LuSearch, LuUserCheck } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import { FormikInput, FormikTextarea, FormikTagsInput } from '../../components/common/formik';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { AdminDrawer } from '../../components/common/AdminDrawer';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';

const CAB_PHOTO_PRESETS = [
  {
    label: 'Airport Taxi Transfer',
    url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Outstation Sedan Cab',
    url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'City Cab Fleet',
    url: 'https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Luxury SUV Ride',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  },
];

export const ManageCabs = () => {
  const { data: adminData, isError, isLoading } = useGetAdminCabPlansQuery();
  const { data: publicData } = useGetCabPlansQuery(undefined, { skip: !isError });

  const [createCabPlan] = useCreateCabPlanMutation();
  const [updateCabPlan] = useUpdateCabPlanMutation();
  const [deleteCabPlan] = useDeleteCabPlanMutation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCab, setEditingCab] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const cabPlans = useMemo(() => {
    const raw = adminData?.data || publicData?.data || [];
    return Array.isArray(raw) ? raw : [];
  }, [adminData, publicData]);

  const filteredCabs = useMemo(() => {
    if (!searchQuery.trim()) return cabPlans;
    const q = searchQuery.toLowerCase();
    return cabPlans.filter((p: any) => {
      const title = (p.title || p.packageName || '').toLowerCase();
      const dest = (p.destination || p.tripRoute || '').toLowerCase();
      return title.includes(q) || dest.includes(q);
    });
  }, [cabPlans, searchQuery]);

  const openAddDrawer = useCallback(() => {
    setEditingCab(null);
    setIsDrawerOpen(true);
  }, []);

  const openEditDrawer = useCallback((cab: any) => {
    setEditingCab(cab);
    setIsDrawerOpen(true);
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        title: values.title,
        packageName: values.title,
        destination: values.destination,
        tripRoute: values.destination,
        days: Number(values.days || 1),
        nights: Number(values.nights || 0),
        duration: values.duration || 'One Way / Round Trip',
        price: Number(values.price),
        pricePerPerson: Number(values.price),
        withDriver: values.withDriver ?? true,
        photo: values.photo,
        coverImage: values.photo,
        description: values.description,
        packageDescription: values.description,
        highlights: values.highlights || [],
        inclusions: values.inclusions || [],
        isActive: true,
      };

      if (editingCab) {
        await updateCabPlan({
          id: String(editingCab.id || editingCab._id),
          body: payload as any,
        }).unwrap();
        toast.success('Cab plan updated successfully!');
      } else {
        await createCabPlan(payload as any).unwrap();
        toast.success('New cab trip plan created!');
      }
      setIsDrawerOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to save cab plan.');
    }
  };

  const handleDelete = useCallback(
    async (id: string | number) => {
      if (window.confirm('Are you sure you want to delete this cab plan?')) {
        try {
          await deleteCabPlan(String(id)).unwrap();
          toast.success('Cab plan deleted successfully.');
        } catch (error: any) {
          toast.error(error?.data?.message || error?.message || 'Failed to delete cab plan.');
        }
      }
    },
    [deleteCabPlan]
  );

  const columns: Column<any>[] = useMemo(
    () => [
      {
        header: 'Cover',
        render: (p: any) => (
          <img
            src={p.photo || p.coverImage || 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2'}
            alt={p.title || p.packageName}
            className="h-10 w-16 rounded-xl border border-zinc-800 object-cover"
          />
        ),
      },
      {
        header: 'Cab Service & Route',
        render: (p: any) => (
          <div className="max-w-xs space-y-1">
            <div className="truncate leading-tight font-bold text-white">
              {p.title || p.packageName}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-400">
              <LuMapPin size={11} /> {p.destination || p.tripRoute || 'Local / Outstation'}
            </div>
          </div>
        ),
      },
      {
        header: 'Driver & Duration',
        render: (p: any) => (
          <div className="space-y-1 text-xs text-zinc-400">
            <div className="flex items-center gap-1">
              <LuClock size={11} /> {p.duration || 'Flexible Trip'}
            </div>
            <span className="inline-flex items-center gap-1 rounded bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
              <LuUserCheck size={11} /> {p.withDriver ? 'Driver Included' : 'Self Drive'}
            </span>
          </div>
        ),
      },
      {
        header: 'Trip Price',
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
              title="Edit Cab Plan"
            >
              <LuPen size={13} />
            </button>
            <button
              onClick={() => handleDelete(p.id || p._id)}
              className="cursor-pointer rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
              title="Delete Cab Plan"
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
            <h1 className="text-2xl font-black text-white">Cab & Taxi Plans Management</h1>
            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-0.5 text-xs font-bold text-amber-400">
              {cabPlans.length} {cabPlans.length === 1 ? 'Plan' : 'Plans'}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Create, update, and manage airport taxis, city rides, and one-way outstation cab routes.
          </p>
        </div>

        <button
          onClick={openAddDrawer}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-400/10 transition-colors hover:bg-amber-300"
        >
          <LuPlus size={16} /> Add Cab Trip Plan
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
            placeholder="Search cabs by service title or route..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 transition-colors focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      <Table
        data={filteredCabs}
        keyFn={(row: any) => String(row.id || row._id)}
        emptyMessage={
          isLoading
            ? 'Loading cab trip plans...'
            : searchQuery
            ? 'No cab plans match your search.'
            : "No cab trip plans listed. Click 'Add Cab Trip Plan' to create your first route."
        }
        columns={columns}
      />

      {/* ── Add / Edit Cab Drawer ── */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingCab ? 'Edit Cab Trip Plan Details' : 'Add New Cab Trip Plan'}
        subtitle={editingCab ? 'Update route pricing, vehicle options, and driver terms' : 'Configure route, pricing, and trip inclusions'}
        maxWidth="max-w-2xl"
      >
        <Formik
          initialValues={
            editingCab
              ? {
                title: editingCab.title || editingCab.packageName || '',
                destination: editingCab.destination || editingCab.tripRoute || '',
                days: editingCab.days !== undefined ? editingCab.days : 1,
                nights: editingCab.nights !== undefined ? editingCab.nights : 0,
                duration: editingCab.duration || '',
                price: editingCab.price || editingCab.pricePerPerson || '',
                withDriver: editingCab.withDriver ?? true,
                photo: editingCab.photo || editingCab.coverImage || editingCab.imageUrl || editingCab.image || (Array.isArray(editingCab.images) ? editingCab.images[0] : (typeof editingCab.images === 'string' ? editingCab.images : '')) || '',
                description: editingCab.description || editingCab.packageDescription || '',
                highlights: editingCab.highlights || [],
                inclusions: editingCab.inclusions || [],
              }
              : {
                title: '',
                destination: '',
                days: 1,
                nights: 0,
                duration: '',
                price: '',
                withDriver: true,
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
                  label="Cab Service Title"
                  placeholder="e.g. Surat to Mumbai Airport One-Way"
                  required
                />

                <FormikInput
                  name="destination"
                  label="Route / Destination"
                  placeholder="e.g. Surat to Mumbai (Airport Drop)"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormikInput
                  name="price"
                  type="number"
                  label="Trip Price (INR)"
                  placeholder="e.g. 4500"
                  min={1}
                  required
                />

                <FormikInput
                  name="duration"
                  label="Trip Type / Duration"
                  placeholder="e.g. One Way / 4-5 Hours"
                />
              </div>

              {/* Image Upload Field */}
              <ImageUploadField
                name="photo"
                label="Cab Cover Image Photo"
                value={values.photo}
                onChange={url => setFieldValue('photo', url)}
                presets={CAB_PHOTO_PRESETS}
                required
              />

              <FormikTagsInput
                name="highlights"
                label="Cab Trip Highlights"
                placeholder="e.g. AC Sedan, Toll Included, Doorstep Pickup"
              />

              <FormikTagsInput
                name="inclusions"
                label="Inclusions"
                placeholder="e.g. Fuel, Driver Allowance, Parking charges"
              />

              <FormikTextarea
                name="description"
                label="Trip Terms & Vehicle Info"
                rows={3}
                placeholder="Describe cab type, luggage capacity, pickup schedule, and waiting policies..."
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
                  {editingCab ? 'Save Changes' : 'Create Cab Plan'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </AdminDrawer>
    </div>
  );
};

export default ManageCabs;
