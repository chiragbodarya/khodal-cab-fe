import { useState, useMemo, useCallback } from 'react';
import {
  useGetAdminTourPlansQuery,
  useGetTourPlansQuery,
  useCreateTourPlanMutation,
  useUpdateTourPlanMutation,
  useDeleteTourPlanMutation,
} from '../../redux/slices/tourApiSlice';
import {
  useGetAdminCabPlansQuery,
  useGetCabPlansQuery,
  useCreateCabPlanMutation,
  useUpdateCabPlanMutation,
  useDeleteCabPlanMutation,
} from '../../redux/slices/cabApiSlice';
import {
  LuPlus,
  LuTrash2,
  LuPen,
  LuClock,
  LuMapPin,
  LuCar,
  LuCompass,
} from 'react-icons/lu';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import { FormikInput, FormikTextarea, FormikTagsInput } from '../../components/common/formik';
import { ImageUploadField } from '../../components/common/ImageUploadField';
import { AdminDrawer } from '../../components/common/AdminDrawer';
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

const CAB_PHOTO_PRESETS = [
  {
    label: 'Mumbai Highway',
    url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Airport Cab Drop',
    url: 'https://images.unsplash.com/photo-1494976388531-d10580905c35?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Expressway Route',
    url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  },
  {
    label: 'Multi-City Luxury Fleet',
    url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
  },
];

export const ManagePlans = () => {
  const [activeTab, setActiveTab] = useState<'tours' | 'cabs'>('tours');

  // Tour queries & mutations
  const { data: adminTourData, isError: isTourError } = useGetAdminTourPlansQuery({});
  const { data: publicTourData } = useGetTourPlansQuery(undefined, { skip: !isTourError });
  const tourPlans = (adminTourData?.data || publicTourData?.data || []) as any[];
  const [createTourPlan] = useCreateTourPlanMutation();
  const [updateTourPlan] = useUpdateTourPlanMutation();
  const [deleteTourPlan] = useDeleteTourPlanMutation();

  // Cab queries & mutations
  const { data: adminCabData, isError: isCabError } = useGetAdminCabPlansQuery({});
  const { data: publicCabData } = useGetCabPlansQuery(undefined, { skip: !isCabError });
  const cabPlans = (adminCabData?.data || publicCabData?.data || []) as any[];
  const [createCabPlan] = useCreateCabPlanMutation();
  const [updateCabPlan] = useUpdateCabPlanMutation();
  const [deleteCabPlan] = useDeleteCabPlanMutation();

  // Drawer State
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

  // Submit Handler
  const handleSubmit = async (values: any) => {
    try {
      if (activeTab === 'tours') {
        const payload = {
          title: values.title || values.packageName,
          packageName: values.title || values.packageName,
          packageDescription: values.description,
          description: values.description,
          destination: values.destination || values.tripRoute,
          tripRoute: values.destination || values.tripRoute,
          duration: values.duration,
          days: Number(values.days) || 3,
          nights: Number(values.nights) || 2,
          price: Number(values.price),
          pricePerPerson: Number(values.price),
          photo: values.photo,
          coverImage: values.photo,
          highlights: values.highlights || [],
          inclusions: values.inclusions || [],
          isActive: true,
        };

        if (editingItem) {
          await updateTourPlan({
            id: String(editingItem.id || editingItem._id),
            body: payload as any,
          }).unwrap();
          toast.success('Tour package updated successfully!');
        } else {
          await createTourPlan(payload as any).unwrap();
          toast.success('New tour package created!');
        }
      } else {
        // Cab Plan
        const payload = {
          title: values.title || values.packageName,
          packageName: values.title || values.packageName,
          packageDescription: values.description,
          description: values.description,
          tripRoute: values.destination || values.tripRoute,
          destination: values.destination || values.tripRoute,
          duration: values.duration || `${values.days || 1} Day`,
          days: Number(values.days) || 1,
          nights: Number(values.nights) || 0,
          pricePerPerson: Number(values.price),
          price: Number(values.price),
          withDriver: values.withDriver ?? true,
          photo: values.photo,
          coverImage: values.photo,
          highlights: values.highlights || [],
          inclusions: values.inclusions || [],
          isActive: true,
        };

        if (editingItem) {
          await updateCabPlan({
            id: String(editingItem.id || editingItem._id),
            body: payload as any,
          }).unwrap();
          toast.success('Cab plan updated successfully!');
        } else {
          await createCabPlan(payload as any).unwrap();
          toast.success('New cab trip plan created!');
        }
      }
      setIsDrawerOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to save plan.');
    }
  };

  // Delete Handler
  const handleDelete = useCallback(
    async (id: string | number) => {
      const entityName = activeTab === 'tours' ? 'tour package' : 'cab plan';
      if (window.confirm(`Are you sure you want to delete this ${entityName}?`)) {
        try {
          if (activeTab === 'tours') {
            await deleteTourPlan(String(id)).unwrap();
          } else {
            await deleteCabPlan(String(id)).unwrap();
          }
          toast.success(`${entityName} deleted successfully.`);
        } catch (error: any) {
          toast.error(error?.data?.message || error?.message || `Failed to delete ${entityName}.`);
        }
      }
    },
    [activeTab, deleteTourPlan, deleteCabPlan]
  );

  // Table Columns
  const planColumns: Column<any>[] = useMemo(
    () => [
      {
        header: 'Cover',
        render: (p: any) => (
          <img
            src={
              p.photo ||
              p.coverImage ||
              (activeTab === 'tours'
                ? 'https://images.unsplash.com/photo-1599661046289-e31897846e41'
                : 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2')
            }
            alt={p.title || p.packageName}
            className="h-10 w-16 rounded border border-zinc-800 object-cover"
          />
        ),
      },
      {
        header: 'Package / Route Details',
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
        header: 'Route & Duration',
        render: (p: any) => (
          <div className="space-y-0.5 text-xs text-zinc-400">
            <div className="flex items-center gap-1 font-semibold text-amber-400">
              <LuMapPin size={10} /> {p.destination || p.tripRoute}
            </div>
            <div className="flex items-center gap-1">
              <LuClock size={10} /> {p.duration || `${p.days || 1} Days / ${p.nights || 0} Nights`}
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
              onClick={() => openEditDrawer(p)}
              className="cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
              title="Edit"
            >
              <LuPen size={13} />
            </button>
            <button
              onClick={() => handleDelete(p.id || p._id)}
              className="cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:bg-red-500/15 hover:text-red-400"
              title="Delete"
            >
              <LuTrash2 size={13} />
            </button>
          </div>
        ),
      },
    ],
    [activeTab, openEditDrawer, handleDelete]
  );

  const activeData = activeTab === 'tours' ? tourPlans : cabPlans;

  return (
    <div className="animate-in space-y-8">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black text-white">Travel & Cab Plans Management</h1>
          <p className="mt-1 text-xs text-zinc-400">
            Manage holiday packages, pricing, cab routes, itineraries, and terms.
          </p>
        </div>
        <button
          onClick={openAddDrawer}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-400/10 transition-colors hover:bg-amber-300"
        >
          <LuPlus size={16} /> {activeTab === 'tours' ? 'Create Tour Package' : 'Add Cab Trip Plan'}
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('tours')}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${activeTab === 'tours'
              ? 'bg-amber-400 text-zinc-950 shadow-md'
              : 'border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
        >
          <LuCompass size={14} /> Tour Packages ({tourPlans.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('cabs')}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${activeTab === 'cabs'
              ? 'bg-amber-400 text-zinc-950 shadow-md'
              : 'border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
        >
          <LuCar size={14} /> Cab Trip Plans ({cabPlans.length})
        </button>
      </div>

      <Table
        data={activeData}
        keyFn={(row: any) => String(row.id || row._id)}
        emptyMessage={`No ${activeTab === 'tours' ? 'tour packages' : 'cab plans'} listed. Click 'Create' to add your first plan.`}
        columns={planColumns}
      />

      {/* ── Add / Edit Plan Drawer ── */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={
          editingItem
            ? `Edit ${activeTab === 'tours' ? 'Tour Destination' : 'Cab Route'} Details`
            : `Create New ${activeTab === 'tours' ? 'Tour Destination' : 'Cab Route'}`
        }
        subtitle={
          editingItem
            ? 'Update itinerary, duration, and pricing'
            : 'Configure routes, pricing, and package inclusions'
        }
        maxWidth="max-w-2xl"
      >
        <Formik
          initialValues={
            editingItem
              ? {
                title: editingItem.title || editingItem.packageName || '',
                destination: editingItem.destination || editingItem.tripRoute || '',
                days: editingItem.days || 3,
                nights: editingItem.nights !== undefined ? editingItem.nights : 2,
                duration: editingItem.duration || '',
                price: editingItem.price || editingItem.pricePerPerson || 5000,
                photo:
                  editingItem.photo ||
                  editingItem.coverImage ||
                  (activeTab === 'tours' ? TOUR_PHOTO_PRESETS[0].url : CAB_PHOTO_PRESETS[0].url),
                description: editingItem.description || editingItem.packageDescription || '',
                withDriver: editingItem.withDriver ?? true,
                highlights: editingItem.highlights || [],
                inclusions: editingItem.inclusions || [],
              }
              : {
                title: '',
                destination: '',
                days: activeTab === 'tours' ? 3 : 1,
                nights: activeTab === 'tours' ? 2 : 0,
                duration: activeTab === 'tours' ? '3 Days / 2 Nights' : 'One Way / Round Trip',
                price: activeTab === 'tours' ? 10000 : 4500,
                photo: activeTab === 'tours' ? TOUR_PHOTO_PRESETS[0].url : CAB_PHOTO_PRESETS[0].url,
                description: '',
                withDriver: true,
                highlights: [],
                inclusions:
                  activeTab === 'tours'
                    ? ['AC Coach Travel', 'Hotel Stay', 'Meals Included']
                    : ['Fuel charges', 'Driver allowances', 'GST'],
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
                  label={activeTab === 'tours' ? 'Package Title' : 'Cab Service Title'}
                  placeholder={activeTab === 'tours' ? 'Agra Heritage Weekend Trip' : 'Surat to Mumbai Cab Service'}
                  required
                />

                <FormikInput
                  name="destination"
                  label={activeTab === 'tours' ? 'Destination' : 'Route / Trip Destination'}
                  placeholder={activeTab === 'tours' ? 'Delhi - Agra - Delhi' : 'Mumbai / Surat'}
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <FormikInput
                  name="days"
                  type="number"
                  label="Days"
                  min={1}
                  required
                />

                <FormikInput
                  name="nights"
                  type="number"
                  label="Nights"
                  min={0}
                  required
                />

                <FormikInput
                  name="price"
                  type="number"
                  label={activeTab === 'tours' ? 'Price Per Person (INR)' : 'Trip Price (INR)'}
                  min={1}
                  required
                />
              </div>

              <FormikInput
                name="duration"
                label="Duration Label"
                placeholder="e.g. 3 Days / 2 Nights or One Way / Round Trip"
              />

              {/* Image Upload Field */}
              <ImageUploadField
                name="photo"
                label="Cover Image Photo"
                value={values.photo}
                onChange={url => setFieldValue('photo', url)}
                presets={activeTab === 'tours' ? TOUR_PHOTO_PRESETS : CAB_PHOTO_PRESETS}
                required
              />

              <FormikTagsInput
                name="highlights"
                label="Highlights & Key Features"
                placeholder="e.g. Sanitized cabs, Expert drivers"
              />

              <FormikTagsInput
                name="inclusions"
                label="Package Inclusions"
                placeholder="e.g. Tolls, Fuel, Driver stay"
              />

              <FormikTextarea
                name="description"
                label="Description & Terms"
                rows={3}
                placeholder="Provide details about route pickup, terms, cancellation, or itinerary schedule..."
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
                  {editingItem ? 'Save Changes' : 'Create Package'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </AdminDrawer>
    </div>
  );
};
export default ManagePlans;
