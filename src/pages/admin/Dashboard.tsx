import {
  useGetAdminInquiriesQuery,
  useGetAdminInquiryStatsQuery,
  useUpdateAdminInquiryMutation,
  useDeleteAdminInquiryMutation,
} from '../../redux/slices/inquiryApiSlice';
import { useGetAdminTourPlansQuery } from '../../redux/slices/tourApiSlice';
import { useGetAdminCabPlansQuery } from '../../redux/slices/cabApiSlice';
import { useGetAdminVehiclesQuery } from '../../redux/slices/vehicleApiSlice';
import { useGetAdminBlogsQuery } from '../../redux/slices/blogApiSlice';
import { useGetGalleryQuery } from '../../redux/slices/galleryApiSlice';
import {
  LuBus,
  LuMapPin,
  LuFileText,
  LuCheck,
  LuTrash2,
  LuInbox,
  LuCar,
  LuPhone,
  LuCalendar,
  LuUsers,
} from 'react-icons/lu';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';

export const Dashboard = () => {
  const { data: tourData } = useGetAdminTourPlansQuery({});
  const { data: cabData } = useGetAdminCabPlansQuery({});
  const { data: fleetData } = useGetAdminVehiclesQuery({});
  const { data: blogData } = useGetAdminBlogsQuery({});
  const { data: galleryData } = useGetGalleryQuery({});
  const { data: inqData } = useGetAdminInquiriesQuery({});
  const { data: statsData } = useGetAdminInquiryStatsQuery();
  const [updateInquiry] = useUpdateAdminInquiryMutation();
  const [deleteInquiry] = useDeleteAdminInquiryMutation();

  const inquiries = (inqData?.data || []) as any[];
  const inqStats = statsData?.data;

  const stats = {
    toursCount: tourData?.meta?.total || tourData?.data?.length || 0,
    cabsCount: cabData?.meta?.total || cabData?.data?.length || 0,
    fleetCount: fleetData?.meta?.total || fleetData?.data?.length || 0,
    blogsCount: blogData?.meta?.total || blogData?.data?.length || 0,
    galleryCount: galleryData?.meta?.total || galleryData?.data?.length || 0,
    inqCount:
      inqStats?.newInquiries ??
      inquiries.filter((i: any) => i.status === 'NEW' || i.status === 'pending').length,
    totalInquiries: inqStats?.total ?? inquiries.length,
  };

  const handleUpdateStatus = async (inq: any, newStatus: string) => {
    try {
      await updateInquiry({
        id: inq.id || inq._id,
        body: { status: newStatus as any, isWorkedOn: true },
      }).unwrap();
      toast.success(`Inquiry status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to update status.');
    }
  };

  const handleDeleteInquiry = async (id: string | number) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await deleteInquiry(id).unwrap();
        toast.success('Inquiry deleted successfully!');
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to delete inquiry.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
      case 'pending':
        return 'border-amber-400/30 bg-amber-400/10 text-amber-400';
      case 'IN_PROGRESS':
        return 'border-sky-400/30 bg-sky-400/10 text-sky-400';
      case 'CALL_BACK_REQUESTED':
        return 'border-purple-400/30 bg-purple-400/10 text-purple-400';
      case 'CONFIRMED':
      case 'responded':
        return 'border-emerald-400/30 bg-emerald-400/10 text-emerald-400';
      case 'RESOLVED':
        return 'border-zinc-500/30 bg-zinc-500/10 text-zinc-300';
      case 'CANCELLED':
        return 'border-rose-400/30 bg-rose-400/10 text-rose-400';
      default:
        return 'border-zinc-700 bg-zinc-800 text-zinc-400';
    }
  };

  const dashboardColumns: Column<any>[] = useMemo(
    () => [
      {
        header: 'Customer',
        render: (inq: any) => (
          <div className="space-y-0.5">
            <div className="font-semibold text-white">{inq.name}</div>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400">
              <LuPhone size={10} className="text-amber-400" />
              <span>{inq.phone}</span>
            </div>
            {inq.email && <div className="text-[10px] text-zinc-500">{inq.email}</div>}
          </div>
        ),
      },
      {
        header: 'Type & Service',
        render: (inq: any) => {
          const type = inq.type || 'CONTACT_US';
          const title =
            inq.vehicle?.name ||
            inq.tourPlan?.title ||
            inq.cabPlan?.title ||
            inq.planTitle ||
            'General Contact';
          return (
            <div className="space-y-1">
              <span className="inline-block rounded border border-amber-400/20 bg-amber-400/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 uppercase">
                {type.replace('_', ' ')}
              </span>
              <div className="text-xs font-semibold text-zinc-200">{title}</div>
            </div>
          );
        },
      },
      {
        header: 'Route & Details',
        render: (inq: any) => (
          <div className="space-y-0.5 text-xs text-zinc-300">
            {(inq.pickupLocation || inq.dropLocation) && (
              <div className="flex items-center gap-1 text-[11px] text-amber-400">
                <LuMapPin size={11} />
                <span>
                  {inq.pickupLocation || 'Origin'} → {inq.dropLocation || 'Destination'}
                </span>
              </div>
            )}
            {inq.travelDate && (
              <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                <LuCalendar size={10} />
                <span>Travel: {new Date(inq.travelDate).toLocaleDateString()}</span>
              </div>
            )}
            {inq.passengers && (
              <div className="flex items-center gap-1 text-[10px] text-zinc-400">
                <LuUsers size={10} />
                <span>{inq.passengers} Passengers</span>
              </div>
            )}
            {!inq.pickupLocation && !inq.travelDate && !inq.passengers && (
              <span className="text-[10px] text-zinc-500">—</span>
            )}
          </div>
        ),
      },
      {
        header: 'Message / Notes',
        render: (inq: any) => (
          <div className="max-w-xs space-y-1">
            <p className="line-clamp-2 text-xs text-zinc-400" title={inq.message}>
              {inq.message || '—'}
            </p>
            {inq.adminNotes && (
              <p className="text-[10px] text-amber-400/90 italic" title={inq.adminNotes}>
                Note: {inq.adminNotes}
              </p>
            )}
          </div>
        ),
      },
      {
        header: 'Status',
        render: (inq: any) => (
          <select
            value={inq.status || 'NEW'}
            onChange={e => handleUpdateStatus(inq, e.target.value)}
            className={`cursor-pointer rounded-lg border px-2 py-1 text-[10px] font-bold tracking-wider uppercase transition-colors outline-none ${getStatusBadge(
              inq.status
            )}`}
          >
            <option value="NEW" className="bg-zinc-900 text-white">NEW</option>
            <option value="IN_PROGRESS" className="bg-zinc-900 text-white">IN PROGRESS</option>
            <option value="CALL_BACK_REQUESTED" className="bg-zinc-900 text-white">CALL BACK</option>
            <option value="CONFIRMED" className="bg-zinc-900 text-white">CONFIRMED</option>
            <option value="RESOLVED" className="bg-zinc-900 text-white">RESOLVED</option>
            <option value="CANCELLED" className="bg-zinc-900 text-white">CANCELLED</option>
          </select>
        ),
      },
      {
        header: 'Actions',
        render: (inq: any) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                handleUpdateStatus(
                  inq,
                  inq.status === 'CONFIRMED' || inq.status === 'RESOLVED' ? 'NEW' : 'CONFIRMED'
                )
              }
              className="cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:bg-emerald-500/15 hover:text-emerald-400"
              title="Quick Confirm"
            >
              <LuCheck size={14} />
            </button>
            <button
              onClick={() => handleDeleteInquiry(inq.id || inq._id)}
              className="cursor-pointer rounded border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-400 transition-colors hover:bg-red-500/15 hover:text-red-400"
              title="Delete"
            >
              <LuTrash2 size={14} />
            </button>
          </div>
        ),
      },
    ],
    [handleUpdateStatus, handleDeleteInquiry]
  );

  return (
    <div className="animate-in space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Console Overview</h1>
        <p className="mt-1 text-xs text-zinc-400">
          Monitor your customer booking inquiries, view website stats, and manage travel modules.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900 p-5">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
              Inquiries
            </span>
            <span className="text-2xl font-black text-white">{stats.inqCount} Pending</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
            <LuInbox size={20} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900 p-5">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
              Total Vehicles
            </span>
            <span className="text-2xl font-black text-white">{stats.fleetCount} Vehicles</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
            <LuBus size={20} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900 p-5">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
              Tour Packages
            </span>
            <span className="text-2xl font-black text-white">{stats.toursCount} Tours</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
            <LuMapPin size={20} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900 p-5">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
              Cab Plans
            </span>
            <span className="text-2xl font-black text-white">{stats.cabsCount} Routes</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
            <LuCar size={20} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900 p-5">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
              SEO Blogs
            </span>
            <span className="text-2xl font-black text-white">{stats.blogsCount} Posts</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
            <LuFileText size={20} />
          </div>
        </div>
      </div>

      {/* Customer Inquiries Table */}
      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-lg font-bold text-white">
          Customer Booking Inquiries
          {stats.inqCount > 0 && (
            <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-zinc-950">
              {stats.inqCount} New
            </span>
          )}
        </h2>

        <Table
          data={inquiries}
          keyFn={(row: any) => String(row.id || row._id)}
          emptyMessage="No customer inquiries found."
          columns={dashboardColumns}
        />
      </div>
    </div>
  );
};
export default Dashboard;
