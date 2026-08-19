import { useState, useMemo, useCallback } from 'react';
import {
  useGetAdminVehiclesQuery,
  useGetVehiclesQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} from '../../redux/slices/vehicleApiSlice';
import { LuPlus, LuTrash2, LuPen, LuUsers } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import {
  FormikInput,
  FormikTextarea,
  FormikSelect,
  FormikTagsInput,
} from '../../components/common/formik';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { AdminDrawer } from '../../components/common/AdminDrawer';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';

const MOCK_PHOTO_PRESETS = [
  {
    label: 'Sleeper Bus (Volvo)',
    url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Tour Coach (Benz)',
    url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Luxury Van (Toyota)',
    url: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Executive Sedan',
    url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
  },
];

export const ManageFleet = () => {
  const { data: adminVehicleData, isError } = useGetAdminVehiclesQuery({});
  const { data: publicVehicleData } = useGetVehiclesQuery(undefined, { skip: !isError });

  const vehicles = (adminVehicleData?.data || publicVehicleData?.data || []) as any[];
  const [createVehicle] = useCreateVehicleMutation();
  const [updateVehicle] = useUpdateVehicleMutation();
  const [deleteVehicle] = useDeleteVehicleMutation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);

  const openAddDrawer = useCallback(() => {
    setEditingVehicle(null);
    setIsDrawerOpen(true);
  }, []);

  const openEditDrawer = useCallback((vehicle: any) => {
    setEditingVehicle(vehicle);
    setIsDrawerOpen(true);
  }, []);

  const handleSubmit = async (values: any) => {
    const payload = {
      name: values.name,
      type: values.type,
      category: values.type || values.category,
      capacity: Number(values.capacity),
      seatCapacity: Number(values.capacity),
      description: values.description,
      photo: values.photo,
      imageUrl: values.photo,
      images: values.photo ? [values.photo] : [],
      amenities: values.amenities,
      features: values.amenities,
      ratePerKm: Number(values.ratePerKm),
      pricePerKm: Number(values.ratePerKm),
      isActive: true,
    };

    try {
      if (editingVehicle) {
        await updateVehicle({
          id: String(editingVehicle.id || editingVehicle._id),
          body: payload as any,
        }).unwrap();
        toast.success('Vehicle updated successfully!');
      } else {
        await createVehicle(payload as any).unwrap();
        toast.success('New vehicle added to fleet!');
      }
      setIsDrawerOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to save vehicle.');
    }
  };

  const handleDelete = useCallback(
    async (id: string | number) => {
      if (window.confirm('Are you sure you want to remove this vehicle?')) {
        try {
          await deleteVehicle(String(id)).unwrap();
          toast.success('Vehicle deleted successfully.');
        } catch (error: any) {
          toast.error(error?.data?.message || error?.message || 'Failed to delete vehicle.');
        }
      }
    },
    [deleteVehicle]
  );

  const fleetColumns: Column<any>[] = useMemo(
    () => [
      {
        header: 'Photo',
        render: (v: any) => (
          <img
            src={v.photo || v.imageUrl || (v.images && v.images[0]) || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'}
            alt={v.name}
            className="h-10 w-16 rounded border border-zinc-800 object-cover"
          />
        ),
      },
      {
        header: 'Vehicle Details',
        render: (v: any) => (
          <div className="max-w-xs space-y-1">
            <div className="truncate leading-tight font-bold text-white">{v.name}</div>
            <div className="truncate text-[10px] text-zinc-400">{v.description || 'No description provided'}</div>
          </div>
        ),
      },
      {
        header: 'Specs',
        render: (v: any) => (
          <div className="space-y-0.5 text-xs text-zinc-400">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 uppercase">
              {v.type || v.category || 'Bus'}
            </div>
            <div className="flex items-center gap-1">
              <LuUsers size={10} /> {v.capacity || v.seatCapacity || 4} Seater
            </div>
          </div>
        ),
      },
      {
        header: 'Amenities / Features',
        render: (v: any) => (
          <div className="flex max-w-[150px] flex-wrap gap-1">
            {(v.amenities || v.features || []).map((item: string, idx: number) => (
              <span
                key={idx}
                className="rounded border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 text-[9px] font-medium text-zinc-300"
              >
                {item}
              </span>
            ))}
          </div>
        ),
      },
      {
        header: 'Rate',
        render: (v: any) => (
          <div className="text-xs font-bold text-white">₹{v.ratePerKm || v.pricePerKm || 40}/km</div>
        ),
      },
      {
        header: 'Actions',
        render: (v: any) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditDrawer(v)}
              className="cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              title="Edit"
            >
              <LuPen size={13} />
            </button>
            <button
              onClick={() => handleDelete(v.id || v._id)}
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
          <h1 className="text-2xl font-black text-white">Vehicle Management</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Create, update, and manage buses, vans, cars, and coaches.
          </p>
        </div>
        <button
          onClick={openAddDrawer}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-400/10 transition-colors hover:bg-amber-300"
        >
          <LuPlus size={16} /> Add New Vehicle
        </button>
      </div>

      <Table
        data={vehicles}
        keyFn={(row: any) => String(row.id || row._id)}
        emptyMessage="No vehicles listed. Click 'Add New Vehicle' to add vehicles."
        columns={fleetColumns}
      />

      {/* ── Add / Edit Vehicle Drawer ── */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingVehicle ? 'Edit Vehicle Details' : 'Add New Vehicle'}
        subtitle={editingVehicle ? 'Modify specs, pricing, and features' : 'Enter specs and upload vehicle images'}
        maxWidth="max-w-xl"
      >
        <Formik
          initialValues={
            editingVehicle
              ? {
                name: editingVehicle.name || '',
                type: editingVehicle.type || editingVehicle.category || 'bus',
                capacity: editingVehicle.capacity || editingVehicle.seatCapacity || '',
                description: editingVehicle.description || '',
                photo: editingVehicle.photo || editingVehicle.imageUrl || editingVehicle.image || editingVehicle.coverImage || (Array.isArray(editingVehicle.images) ? editingVehicle.images[0] : (typeof editingVehicle.images === 'string' ? editingVehicle.images : '')) || '',
                amenities: editingVehicle.amenities || editingVehicle.features || [],
                ratePerKm: editingVehicle.ratePerKm || editingVehicle.pricePerKm || '',
              }
              : {
                name: '',
                type: 'bus',
                capacity: '',
                description: '',
                photo: '',
                amenities: [],
                ratePerKm: '',
              }
          }
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue }) => (
            <Form className="space-y-5 text-xs text-zinc-300">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormikInput
                  name="name"
                  label="Vehicle Name"
                  placeholder="Volvo 9600 Multi-Axle"
                  required
                />

                <FormikSelect
                  name="type"
                  label="Vehicle Type / Category"
                  options={[
                    { label: 'Bus', value: 'bus' },
                    { label: 'Coach', value: 'coach' },
                    { label: 'Luxury Mini Van', value: 'van' },
                    { label: 'Executive Car / Sedan', value: 'car' },
                    { label: 'SUV', value: 'SUV' },
                  ]}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormikInput
                  name="capacity"
                  type="number"
                  label="Seat Capacity"
                  placeholder="e.g. 36 or 7"
                  min={1}
                  required
                />

                <FormikInput
                  name="ratePerKm"
                  type="number"
                  label="Rate Per KM (INR)"
                  placeholder="e.g. 45"
                  min={1}
                  required
                />
              </div>

              {/* Enhanced Image Upload Field */}
              <ImageUploadField
                name="photo"
                label="Vehicle Photo"
                value={values.photo}
                onChange={url => setFieldValue('photo', url)}
                presets={MOCK_PHOTO_PRESETS}
                required
              />

              <FormikTagsInput
                name="amenities"
                label="Vehicle Amenities & Features"
                placeholder="e.g. Wi-Fi, Charger, Toilet, Pushback Seats"
              />

              <FormikTextarea
                name="description"
                label="Short Description"
                rows={3}
                placeholder="Describe comfort features, safety, or routes this vehicle works on..."
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
                  {editingVehicle ? 'Save Changes' : 'Create Vehicle'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </AdminDrawer>
    </div>
  );
};
export default ManageFleet;
