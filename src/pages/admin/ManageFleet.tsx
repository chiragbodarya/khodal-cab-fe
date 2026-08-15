import { useState } from 'react';
import {
  useGetVehiclesQuery,
  useCreateVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} from '../../redux/slices/vehicleApiSlice';
import { LuPlus, LuTrash2, LuPen, LuUsers, LuX } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { useMemo, useCallback } from 'react';
import { Formik, Form } from 'formik';
import {
  FormikInput,
  FormikTextarea,
  FormikSelect,
  FormikTagsInput,
} from '../../components/formik';
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
  const { data: vehicleData } = useGetVehiclesQuery({});
  const vehicles = vehicleData?.data || [];
  const [createVehicle] = useCreateVehicleMutation();
  const [updateVehicle] = useUpdateVehicleMutation();
  const [deleteVehicle] = useDeleteVehicleMutation();
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<any | null>(null);

  const openAddModal = useCallback(() => {
    setEditingVehicle(null);
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((vehicle: any) => {
    setEditingVehicle(vehicle);
    setShowModal(true);
  }, []);

  const handleSubmit = async (values: any) => {
    const payload = {
      name: values.name,
      type: values.type,
      capacity: values.capacity,
      description: values.description,
      photo: values.photo,
      amenities: values.amenities,
      ratePerKm: values.ratePerKm,
    };

    try {
      if (editingVehicle) {
        // Edit
        await updateVehicle({
          id: editingVehicle.id || editingVehicle._id,
          body: payload,
        }).unwrap();
        toast.success('Vehicle updated successfully!');
      } else {
        // Create new
        await createVehicle(payload).unwrap();
        toast.success('New vehicle added to fleet!');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to save vehicle.');
    }
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to remove this vehicle from the fleet?')) {
        try {
          await deleteVehicle(id).unwrap();
          toast.success('Vehicle deleted successfully.');
        } catch (error) {
          toast.error('Failed to delete vehicle.');
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
            src={v.photo || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'}
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
            <div className="truncate text-[10px] text-zinc-400">{v.description}</div>
          </div>
        ),
      },
      {
        header: 'Specs',
        render: (v: any) => (
          <div className="space-y-0.5 text-xs text-zinc-400">
            <div className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 uppercase">
              {v.type}
            </div>
            <div className="flex items-center gap-1">
              <LuUsers size={10} /> {v.capacity} Seater
            </div>
          </div>
        ),
      },
      {
        header: 'Amenities',
        render: (v: any) => (
          <div className="flex max-w-[150px] flex-wrap gap-1">
            {(v.amenities || []).map((item: string, idx: number) => (
              <span
                key={idx}
                className="text-zinc-350 rounded border border-zinc-800 bg-zinc-950 px-1.5 py-0.5 text-[9px] font-medium"
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
          <div className="text-xs font-bold text-white">₹{v.ratePerKm || 40}/km</div>
        ),
      },
      {
        header: 'Actions',
        render: (v: any) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditModal(v)}
              className="bg-zinc-850 cursor-pointer rounded border border-zinc-800 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              title="Edit"
            >
              <LuPen size={13} />
            </button>
            <button
              onClick={() => handleDelete(v.id || v._id)}
              className="bg-zinc-850 text-zinc-450 cursor-pointer rounded border border-zinc-800 p-1.5 transition-colors hover:bg-red-500/15 hover:text-red-400"
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
          <h1 className="text-2xl font-black text-white">Fleet Management</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Create, update, and manage transport buses, vans, and coaches.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-400/10 transition-colors hover:bg-amber-300"
        >
          <LuPlus size={16} /> Add New Vehicle
        </button>
      </div>

      <Table
        data={vehicles}
        keyFn={(row: any) => row.id || row._id}
        emptyMessage="No vehicles listed. Click 'Add New Vehicle' to seed your fleet."
        columns={fleetColumns}
      />

      {/* ── Add / Edit Vehicle Modal ── */}
      {showModal && (
        <div className="animate-in fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 px-6 py-4">
              <h3 className="text-base font-bold text-white">
                {editingVehicle ? 'Edit Vehicle Details' : 'Add Vehicle to Fleet'}
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
                editingVehicle
                  ? {
                      name: editingVehicle.name,
                      type: editingVehicle.type,
                      capacity: editingVehicle.capacity,
                      description: editingVehicle.description,
                      photo: editingVehicle.photo,
                      amenities: editingVehicle.amenities || [],
                      ratePerKm: editingVehicle.ratePerKm || 40,
                    }
                  : {
                      name: '',
                      type: 'bus',
                      capacity: 36,
                      description: '',
                      photo: MOCK_PHOTO_PRESETS[0].url,
                      amenities: ['AC', 'Wi-Fi', 'GPS'],
                      ratePerKm: 40,
                    }
              }
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="flex-grow space-y-4 overflow-y-auto p-6 text-xs text-zinc-300">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormikInput
                      name="name"
                      label="Vehicle Name"
                      placeholder="Volvo 9600 Multi-Axle"
                      required
                    />

                    <FormikSelect
                      name="type"
                      label="Vehicle Type"
                      options={[
                        { label: 'Bus', value: 'bus' },
                        { label: 'Coach', value: 'coach' },
                        { label: 'Luxury Mini Van', value: 'van' },
                        { label: 'Executive Car', value: 'car' },
                      ]}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormikInput
                      name="capacity"
                      type="number"
                      label="Seat Capacity"
                      min={1}
                      required
                    />

                    <FormikInput
                      name="ratePerKm"
                      type="number"
                      label="Rate Per KM (INR)"
                      min={1}
                      required
                    />
                  </div>

                  {/* Photo Input & Presets */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-450 block text-sm font-semibold">
                        Vehicle Image URL *
                      </span>
                      <span className="text-[10px] text-amber-400">Or pick a preset below</span>
                    </div>
                    <FormikInput
                      name="photo"
                      placeholder="https://images.unsplash.com/..."
                      required
                    />
                    {/* Presets Row */}
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {MOCK_PHOTO_PRESETS.map((preset, idx) => (
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

                  <FormikTagsInput
                    name="amenities"
                    label="Vehicle Amenities"
                    placeholder="e.g. Wi-Fi, Charger, Toilet"
                  />

                  <FormikTextarea
                    name="description"
                    label="Short Description"
                    rows={3}
                    placeholder="Describe comfort features, safety, or routes this vehicle works on..."
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
                      {editingVehicle ? 'Save Changes' : 'Create Vehicle'}
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
export default ManageFleet;
