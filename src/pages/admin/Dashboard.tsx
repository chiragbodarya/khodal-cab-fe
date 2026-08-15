import {
  useGetInquiriesQuery,
  useUpdateInquiryStatusMutation,
  useDeleteInquiryMutation,
} from '../../redux/slices/inquiryApiSlice';
import { useGetAdminTourPlansQuery } from '../../redux/slices/tourApiSlice';
import { useGetVehiclesQuery } from '../../redux/slices/vehicleApiSlice';
import { useGetBlogsQuery } from '../../redux/slices/blogApiSlice';
import { LuBus, LuMapPin, LuFileText, LuCheck, LuTrash2, LuInbox } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { useMemo } from 'react';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';

export const Dashboard = () => {
  const { data: tourData } = useGetAdminTourPlansQuery({});
  const { data: fleetData } = useGetVehiclesQuery({});
  const { data: blogData } = useGetBlogsQuery({});
  const { data: inqData } = useGetInquiriesQuery({});
  const [updateStatus] = useUpdateInquiryStatusMutation();
  const [deleteInquiry] = useDeleteInquiryMutation();

  const inquiries = inqData?.data || [];
  const stats = {
    plansCount: tourData?.meta?.total || tourData?.data?.length || 0,
    fleetCount: fleetData?.meta?.total || fleetData?.data?.length || 0,
    blogsCount: blogData?.meta?.total || blogData?.data?.length || 0,
    inqCount: inquiries.filter((i: any) => i.status === 'pending').length,
  };

  const handleToggleStatus = async (inq: any) => {
    try {
      const newStatus = inq.status === 'pending' ? 'responded' : 'pending';
      await updateStatus({ id: inq.id || inq._id, status: newStatus as any }).unwrap();
      toast.success('Inquiry status updated successfully!');
    } catch (error) {
      toast.error('Failed to update status.');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inquiry?')) {
      try {
        await deleteInquiry(id).unwrap();
        toast.success('Inquiry deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete inquiry.');
      }
    }
  };

  const dashboardColumns: Column<any>[] = useMemo(
    () => [
      {
        header: 'Customer',
        render: (inq: any) => (
          <>
            <div className="font-semibold text-white">{inq.name}</div>
            <div className="text-[10px] text-zinc-500">
              {inq.email} | {inq.phone}
            </div>
          </>
        ),
      },
      {
        header: 'Requested Tour',
        render: (inq: any) => <span className="font-medium text-zinc-300">{inq.planTitle}</span>,
      },
      {
        header: 'Date',
        render: (inq: any) => (
          <span className="text-zinc-450">
            {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : inq.date}
          </span>
        ),
      },
      {
        header: 'Message',
        render: (inq: any) => (
          <div className="max-w-xs truncate" title={inq.message}>
            {inq.message || '—'}
          </div>
        ),
      },
      {
        header: 'Status',
        render: (inq: any) => (
          <span
            className={`inline-flex rounded px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase ${
              inq.status === 'pending'
                ? 'border border-amber-400/20 bg-amber-400/10 text-amber-400'
                : 'bg-emerald-450/10 border border-emerald-400/20 text-emerald-400'
            }`}
          >
            {inq.status}
          </span>
        ),
      },
      {
        header: 'Actions',
        render: (inq: any) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleStatus(inq)}
              className={`cursor-pointer rounded p-1.5 transition-colors ${
                inq.status === 'pending'
                  ? 'bg-zinc-850 border border-zinc-800 text-zinc-400 hover:bg-emerald-500/15 hover:text-emerald-400'
                  : 'bg-zinc-850 text-zinc-450 border border-zinc-800 hover:bg-amber-500/15 hover:text-amber-400'
              }`}
              title={inq.status === 'pending' ? 'Mark Responded' : 'Mark Pending'}
            >
              <LuCheck size={14} />
            </button>
            <button
              onClick={() => handleDeleteInquiry(inq.id || inq._id)}
              className="bg-zinc-850 cursor-pointer rounded border border-zinc-800 p-1.5 text-zinc-400 hover:bg-red-500/15 hover:text-red-400"
              title="Delete"
            >
              <LuTrash2 size={14} />
            </button>
          </div>
        ),
      },
    ],
    [handleToggleStatus, handleDeleteInquiry]
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
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900 p-5">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
              Pending Inquiries
            </span>
            <span className="text-2xl font-black text-white">{stats.inqCount}</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
            <LuInbox size={20} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900 p-5">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
              Total Fleet
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
              Destinations
            </span>
            <span className="text-2xl font-black text-white">{stats.plansCount} Packages</span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
            <LuMapPin size={20} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900 p-5">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold tracking-wider text-zinc-500 uppercase">
              SEO Articles
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
          keyFn={(row: any) => row.id || row._id}
          emptyMessage="No customer inquiries found."
          columns={dashboardColumns}
        />
      </div>
    </div>
  );
};
export default Dashboard;
