import { useState } from 'react';
import {
  useGetAdminTourPlansQuery,
  useCreateTourPlanMutation,
  useUpdateTourPlanMutation,
  useDeleteTourPlanMutation,
} from '../../redux/slices/tourApiSlice';
import { LuPlus, LuTrash2, LuPen, LuClock, LuMapPin, LuX } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { useMemo, useCallback } from 'react';
import { Formik, Form } from 'formik';
import { FormikInput, FormikTextarea, FormikTagsInput } from '../../components/formik';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';

const TOUR_PHOTO_PRESETS = [
  {
    label: 'Taj Mahal',
    url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Kerala Houseboat',
    url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Manali Campsite',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Goa Beach Resort',
    url: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80',
  },
];

export const ManagePlans = () => {
  const { data: tourData } = useGetAdminTourPlansQuery({});
  const plans = tourData?.data || [];
  const [createTourPlan] = useCreateTourPlanMutation();
  const [updateTourPlan] = useUpdateTourPlanMutation();
  const [deleteTourPlan] = useDeleteTourPlanMutation();
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  const openAddModal = useCallback(() => {
    setEditingPlan(null);
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((plan: any) => {
    setEditingPlan(plan);
    setShowModal(true);
  }, []);

  const handleSubmit = async (values: any) => {
    const payload = {
      title: values.title,
      packageName: values.title,
      destination: values.destination,
      tripRoute: values.destination,
      duration: values.duration,
      days: parseInt(values.duration) || 3,
      nights: (parseInt(values.duration) || 3) - 1,
      price: values.price,
      pricePerPerson: values.price,
      photo: values.photo,
      coverImage: values.photo,
      description: values.description,
      highlights: values.highlights,
      inclusions: values.inclusions,
      isActive: true,
    };

    try {
      if (editingPlan) {
        await updateTourPlan({ id: editingPlan.id || editingPlan._id, body: payload }).unwrap();
        toast.success('Travel plan updated successfully!');
      } else {
        await createTourPlan(payload).unwrap();
        toast.success('New travel package created!');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('Failed to save travel plan.');
    }
  };

  const handleDelete = useCallback(
    async (id: string) => {
      if (window.confirm('Are you sure you want to delete this travel package?')) {
        try {
          await deleteTourPlan(id).unwrap();
          toast.success('Travel package removed.');
        } catch (error) {
          toast.error('Failed to delete travel package.');
        }
      }
    },
    [deleteTourPlan]
  );

  const planColumns: Column<any>[] = useMemo(
    () => [
      {
        header: 'Cover',
        render: (p: any) => (
          <img
            src={
              p.photo ||
              p.coverImage ||
              'https://images.unsplash.com/photo-1599661046289-e31897846e41'
            }
            alt={p.title || p.packageName}
            className="h-10 w-16 rounded border border-zinc-800 object-cover"
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
            <div className="truncate text-[10px] text-zinc-400">{p.description}</div>
          </div>
        ),
      },
      {
        header: 'Location & Duration',
        render: (p: any) => (
          <div className="space-y-0.5 text-xs text-zinc-400">
            <div className="flex items-center gap-1 font-semibold text-amber-400">
              <LuMapPin size={10} /> {p.destination || p.tripRoute}
            </div>
            <div className="flex items-center gap-1">
              <LuClock size={10} /> {p.duration || `${p.days} Days / ${p.nights} Nights`}
            </div>
          </div>
        ),
      },
      {
        header: 'Price',
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
              onClick={() => openEditModal(p)}
              className="bg-zinc-850 cursor-pointer rounded border border-zinc-800 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              title="Edit"
            >
              <LuPen size={13} />
            </button>
            <button
              onClick={() => handleDelete(p.id || p._id)}
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
          <h1 className="text-2xl font-black text-white">Travel Plans & Places</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Manage packages, prices, route details, and customer itinerary options.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-400/10 transition-colors hover:bg-amber-300"
        >
          <LuPlus size={16} /> Create Tour Package
        </button>
      </div>

      <Table
        data={plans}
        keyFn={(row: any) => row.id || row._id}
        emptyMessage="No travel packages listed. Click 'Create Tour Package' to seed your destinations."
        columns={planColumns}
      />

      {/* ── Add / Edit Tour Plan Modal ── */}
      {showModal && (
        <div className="animate-in fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm">
          <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 px-6 py-4">
              <h3 className="text-base font-bold text-white">
                {editingPlan ? 'Edit Tour Destination Details' : 'Create New Tour Destination'}
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
                editingPlan
                  ? {
                      title: editingPlan.title || editingPlan.packageName || '',
                      destination: editingPlan.destination || editingPlan.tripRoute || '',
                      duration:
                        editingPlan.duration ||
                        `${editingPlan.days || 3} Days / ${editingPlan.nights || 2} Nights`,
                      price: editingPlan.price || editingPlan.pricePerPerson || 10000,
                      photo:
                        editingPlan.photo || editingPlan.coverImage || TOUR_PHOTO_PRESETS[0].url,
                      description: editingPlan.description || '',
                      highlights: editingPlan.highlights || [],
                      inclusions: editingPlan.inclusions || [],
                    }
                  : {
                      title: '',
                      destination: '',
                      duration: '3 Days / 2 Nights',
                      price: 10000,
                      photo: TOUR_PHOTO_PRESETS[0].url,
                      description: '',
                      highlights: [],
                      inclusions: ['AC Coach Travel', 'Hotel Stay', 'Meals Included'],
                    }
              }
              onSubmit={handleSubmit}
            >
              {({ values, setFieldValue }) => (
                <Form className="flex-grow space-y-4 overflow-y-auto p-6 text-xs text-zinc-300">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormikInput
                      name="title"
                      label="Package Title"
                      placeholder="Agra Heritage Weekend Trip"
                      required
                    />

                    <FormikInput
                      name="destination"
                      label="Destination"
                      placeholder="Delhi - Agra - Delhi"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormikInput
                      name="duration"
                      label="Duration"
                      placeholder="3 Days / 2 Nights"
                      required
                    />

                    <FormikInput
                      name="price"
                      type="number"
                      label="Package Price (INR)"
                      min={1}
                      required
                    />
                  </div>

                  {/* Photo selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-zinc-455 block text-sm font-semibold">
                        Cover Image URL *
                      </span>
                      <span className="text-[10px] text-amber-400">Or pick a tour preset</span>
                    </div>
                    <FormikInput
                      name="photo"
                      placeholder="https://images.unsplash.com/..."
                      required
                    />
                    <div className="flex gap-2 overflow-x-auto py-1">
                      {TOUR_PHOTO_PRESETS.map((preset, idx) => (
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
                    name="highlights"
                    label="Tour Highlights"
                    placeholder="e.g. Taj Mahal sunrise view"
                  />

                  <FormikTagsInput
                    name="inclusions"
                    label="Package Inclusions"
                    placeholder="e.g. 3-star Hotel stay"
                  />

                  <FormikTextarea
                    name="description"
                    label="Package Description"
                    rows={3}
                    placeholder="Provide package summary, brief daily route planner, or target audience..."
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
                      {editingPlan ? 'Save Changes' : 'Create Package'}
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
export default ManagePlans;
