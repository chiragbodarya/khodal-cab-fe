import { useState, useMemo, useCallback } from 'react';
import {
  useGetAdminInquiriesQuery,
  useGetAdminInquiryStatsQuery,
  useUpdateAdminInquiryMutation,
  useDeleteAdminInquiryMutation,
  type Inquiry,
  type InquiryStatus,
} from '../../redux/slices/inquiryApiSlice';
import {
  LuTrash2,
  LuPhone,
  LuMail,
  LuCalendar,
  LuMapPin,
  LuUsers,
  LuClock,
  LuFileText,
  LuSearch,
  LuRefreshCw,
  LuCheck,
  LuEye,
  LuCompass,
  LuCar,
  LuBus,
  LuMessageSquare,
  LuExternalLink,
  LuX,
  LuSparkles,
} from 'react-icons/lu';
import toast from 'react-hot-toast';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';
import { AdminDrawer } from '../../components/common/AdminDrawer';

export const ManageInquiries = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [followUpFilter, setFollowUpFilter] = useState<'all' | 'today' | 'pending'>('all');

  const queryParams = useMemo(() => {
    const params: any = {};
    if (selectedType !== 'ALL') params.type = selectedType;
    if (selectedStatus !== 'ALL') params.status = selectedStatus;
    if (followUpFilter !== 'all') params.followUp = followUpFilter;
    if (searchTerm.trim()) params.search = searchTerm.trim();
    return params;
  }, [selectedType, selectedStatus, followUpFilter, searchTerm]);

  const { data: inquiryData, isLoading, isFetching, refetch } = useGetAdminInquiriesQuery(queryParams);
  const { data: statsData } = useGetAdminInquiryStatsQuery();
  const [updateInquiry, { isLoading: isUpdating }] = useUpdateAdminInquiryMutation();
  const [deleteInquiry] = useDeleteAdminInquiryMutation();

  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Form states for drawer update
  const [drawerStatus, setDrawerStatus] = useState<InquiryStatus>('NEW');
  const [drawerAdminNotes, setDrawerAdminNotes] = useState('');
  const [drawerFollowUpDate, setDrawerFollowUpDate] = useState('');
  const [drawerIsWorkedOn, setDrawerIsWorkedOn] = useState(false);

  const inquiries = (inquiryData?.data || []) as Inquiry[];
  const stats = statsData?.data;

  const openInquiryDetail = useCallback((inq: Inquiry) => {
    setSelectedInquiry(inq);
    setDrawerStatus(inq.status || 'NEW');
    setDrawerAdminNotes(inq.adminNotes || '');
    setDrawerFollowUpDate(
      inq.followUpDate ? new Date(inq.followUpDate).toISOString().split('T')[0] : ''
    );
    setDrawerIsWorkedOn(!!inq.isWorkedOn);
    setIsDrawerOpen(true);
  }, []);

  const handleQuickStatusChange = async (inq: Inquiry, newStatus: string) => {
    try {
      await updateInquiry({
        id: inq.id,
        body: {
          status: newStatus as InquiryStatus,
          isWorkedOn: true,
          lastContactedAt: new Date().toISOString(),
        },
      }).unwrap();
      toast.success(`Inquiry status updated to ${newStatus}`);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to update status.');
    }
  };

  const handleSaveDrawerDetails = async () => {
    if (!selectedInquiry) return;
    try {
      await updateInquiry({
        id: selectedInquiry.id,
        body: {
          status: drawerStatus,
          adminNotes: drawerAdminNotes.trim() || null,
          followUpDate: drawerFollowUpDate ? new Date(drawerFollowUpDate).toISOString() : null,
          isWorkedOn: drawerIsWorkedOn,
          lastContactedAt: new Date().toISOString(),
        },
      }).unwrap();
      toast.success('Inquiry updated successfully!');
      setIsDrawerOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to save inquiry.');
    }
  };

  const handleDeleteInquiry = async (id: string | number) => {
    if (window.confirm('Are you sure you want to permanently delete this customer inquiry?')) {
      try {
        await deleteInquiry(id).unwrap();
        toast.success('Inquiry deleted successfully!');
        if (selectedInquiry?.id === id) {
          setIsDrawerOpen(false);
        }
      } catch (error: any) {
        toast.error(error?.data?.message || error?.message || 'Failed to delete inquiry.');
      }
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
      case 'pending':
        return 'border-amber-400/40 bg-amber-400/10 text-amber-300';
      case 'IN_PROGRESS':
        return 'border-sky-400/40 bg-sky-400/10 text-sky-300';
      case 'CALL_BACK_REQUESTED':
        return 'border-purple-400/40 bg-purple-400/10 text-purple-300';
      case 'CONFIRMED':
      case 'responded':
        return 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300';
      case 'RESOLVED':
        return 'border-zinc-600 bg-zinc-800 text-zinc-300';
      case 'CANCELLED':
        return 'border-rose-500/40 bg-rose-500/10 text-rose-300';
      default:
        return 'border-zinc-700 bg-zinc-800 text-zinc-400';
    }
  };

  const getTypeMeta = (type?: string) => {
    switch (type) {
      case 'VEHICLE':
        return {
          label: 'Vehicle Fleet',
          icon: LuBus,
          badgeCls: 'bg-blue-400/10 text-blue-400 border-blue-400/30',
        };
      case 'TOUR_PLAN':
        return {
          label: 'Tour Package',
          icon: LuCompass,
          badgeCls: 'bg-amber-400/10 text-amber-400 border-amber-400/30',
        };
      case 'CAB_PLAN':
        return {
          label: 'Cab Plan',
          icon: LuCar,
          badgeCls: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/30',
        };
      default:
        return {
          label: 'Contact Query',
          icon: LuMessageSquare,
          badgeCls: 'bg-zinc-800 text-zinc-300 border-zinc-700',
        };
    }
  };

  const cleanPhone = (phone?: string) => {
    return phone ? phone.replace(/[^0-9+]/g, '') : '';
  };

  const columns: Column<Inquiry>[] = useMemo(
    () => [
      {
        header: 'Customer Details',
        render: (inq: Inquiry) => {
          const rawPhone = cleanPhone(inq.phone);
          const whatsappPhone = rawPhone.startsWith('+') ? rawPhone.slice(1) : rawPhone.startsWith('91') ? rawPhone : `91${rawPhone}`;

          return (
            <div className="space-y-1.5 py-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wide">{inq.name}</span>
                {inq.isWorkedOn && (
                  <span
                    title="Agent Worked On"
                    className="inline-flex items-center gap-0.5 rounded bg-emerald-400/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400"
                  >
                    <LuCheck size={10} /> Active
                  </span>
                )}
              </div>

              {/* Direct Quick Action Contact Links */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <a
                  href={`tel:${inq.phone}`}
                  className="inline-flex items-center gap-1 font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  title="Call Customer"
                >
                  <LuPhone size={12} />
                  <span>{inq.phone}</span>
                </a>

                {inq.phone && (
                  <a
                    href={`https://wa.me/${whatsappPhone}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                    title="Chat on WhatsApp"
                  >
                    WhatsApp
                  </a>
                )}
              </div>

              {inq.email && (
                <a
                  href={`mailto:${inq.email}`}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors truncate max-w-[220px]"
                >
                  <LuMail size={11} className="shrink-0" />
                  <span className="truncate">{inq.email}</span>
                </a>
              )}
            </div>
          );
        },
      },
      {
        header: 'Service / Category',
        render: (inq: Inquiry) => {
          const typeMeta = getTypeMeta(inq.type);
          const Icon = typeMeta.icon;
          const title =
            inq.vehicle?.name ||
            inq.tourPlan?.title ||
            inq.cabPlan?.title ||
            inq.planTitle ||
            'General Customer Inquiry';

          return (
            <div className="space-y-1.5 py-1">
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase ${typeMeta.badgeCls}`}
              >
                <Icon size={12} />
                {typeMeta.label}
              </span>
              <div className="text-xs font-semibold text-zinc-100 line-clamp-2 max-w-[240px]">
                {title}
              </div>
            </div>
          );
        },
      },
      {
        header: 'Trip Route & Schedule',
        render: (inq: Inquiry) => (
          <div className="space-y-1.5 py-1 text-xs">
            {(inq.pickupLocation || inq.dropLocation) ? (
              <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
                <LuMapPin size={13} className="shrink-0 text-amber-400" />
                <span>
                  {inq.pickupLocation || 'Origin'} <span className="text-zinc-500">→</span> {inq.dropLocation || 'Destination'}
                </span>
              </div>
            ) : (
              <span className="text-zinc-500 text-[11px]">No specific route</span>
            )}

            <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-zinc-400">
              {inq.travelDate && (
                <span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-zinc-300 font-medium">
                  <LuCalendar size={11} className="text-amber-400" /> {new Date(inq.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              )}
              {inq.passengers && (
                <span className="inline-flex items-center gap-1 rounded bg-zinc-800 px-2 py-0.5 text-zinc-300 font-medium">
                  <LuUsers size={11} className="text-amber-400" /> {inq.passengers} Seats
                </span>
              )}
            </div>
          </div>
        ),
      },
      {
        header: 'Message & Follow-Up',
        render: (inq: Inquiry) => (
          <div className="max-w-[260px] space-y-1.5 py-1 text-xs">
            <p className="line-clamp-2 text-zinc-300 leading-relaxed text-xs" title={inq.message}>
              {inq.message || <span className="text-zinc-500 italic">No notes provided</span>}
            </p>

            {inq.followUpDate && (
              <div className="inline-flex items-center gap-1 rounded-md border border-purple-400/30 bg-purple-400/10 px-2 py-0.5 text-[10px] font-bold text-purple-300">
                <LuClock size={11} />
                Follow-up: {new Date(inq.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
              </div>
            )}

            {inq.adminNotes && (
              <p className="line-clamp-1 rounded bg-amber-400/5 px-1.5 py-0.5 text-[10px] text-amber-300 italic border border-amber-400/10" title={inq.adminNotes}>
                Note: {inq.adminNotes}
              </p>
            )}
          </div>
        ),
      },
      {
        header: 'Lead Status',
        render: (inq: Inquiry) => (
          <select
            value={inq.status || 'NEW'}
            onChange={e => handleQuickStatusChange(inq, e.target.value)}
            className={`cursor-pointer rounded-xl border px-3 py-1.5 text-xs font-bold tracking-wider uppercase transition-all shadow-sm outline-none ${getStatusBadge(
              inq.status
            )}`}
          >
            <option value="NEW" className="bg-zinc-900 text-amber-400">● NEW</option>
            <option value="IN_PROGRESS" className="bg-zinc-900 text-sky-400">● IN PROGRESS</option>
            <option value="CALL_BACK_REQUESTED" className="bg-zinc-900 text-purple-400">● CALL BACK</option>
            <option value="CONFIRMED" className="bg-zinc-900 text-emerald-400">● CONFIRMED</option>
            <option value="RESOLVED" className="bg-zinc-900 text-zinc-300">● RESOLVED</option>
            <option value="CANCELLED" className="bg-zinc-900 text-rose-400">● CANCELLED</option>
          </select>
        ),
      },
      {
        header: 'Actions',
        render: (inq: Inquiry) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => openInquiryDetail(inq)}
              className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs font-bold text-zinc-300 transition-all hover:border-amber-400/50 hover:bg-amber-400 hover:text-zinc-950 flex items-center gap-1.5 shadow-sm"
              title="View & Edit Lead"
            >
              <LuEye size={14} />
              <span>Details</span>
            </button>
            <button
              onClick={() => handleDeleteInquiry(inq.id)}
              className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-500 transition-colors hover:border-rose-500/50 hover:bg-rose-500/15 hover:text-rose-400"
              title="Delete Inquiry"
            >
              <LuTrash2 size={15} />
            </button>
          </div>
        ),
      },
    ],
    [handleQuickStatusChange, openInquiryDetail, handleDeleteInquiry]
  );

  return (
    <div className="animate-in space-y-7 pb-10">
      {/* ── Page Header ── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight">Customer Inquiries & Leads</h1>
            <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-0.5 text-xs font-black text-amber-400">
              {stats?.total ?? inquiries.length} Leads
            </span>
          </div>
          <p className="mt-1 text-xs font-light text-zinc-400">
            Track incoming website booking requests, schedule client callbacks, update status, and manage conversion logs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-xs font-bold text-zinc-300 transition-all hover:border-amber-400/40 hover:bg-zinc-800 hover:text-white shadow-sm"
          >
            <LuRefreshCw size={14} className={isFetching ? 'animate-spin text-amber-400' : ''} />
            Refresh Leads
          </button>
        </div>
      </div>

      {/* ── KPI Stats Cards with Interactive Filtering ── */}
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-6">
        {/* Total Leads */}
        <div
          onClick={() => { setSelectedStatus('ALL'); setSelectedType('ALL'); setFollowUpFilter('all'); }}
          className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:translate-y-[-2px] ${
            selectedStatus === 'ALL' && selectedType === 'ALL' && followUpFilter === 'all'
              ? 'border-amber-400 bg-zinc-900/90 shadow-lg shadow-amber-400/5'
              : 'border-zinc-800/90 bg-zinc-900/50 hover:border-zinc-700'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">All Leads</span>
            <LuSparkles size={14} className="text-zinc-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-white">{stats?.total ?? inquiries.length}</div>
        </div>

        {/* New / Fresh */}
        <div
          onClick={() => setSelectedStatus('NEW')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:translate-y-[-2px] ${
            selectedStatus === 'NEW'
              ? 'border-amber-400 bg-amber-400/10 shadow-lg shadow-amber-400/10'
              : 'border-amber-400/20 bg-amber-400/5 hover:border-amber-400/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">New / Fresh</span>
            <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-400">
            {stats?.newInquiries ?? inquiries.filter(i => i.status === 'NEW' || i.status === 'pending').length}
          </div>
        </div>

        {/* In Progress */}
        <div
          onClick={() => setSelectedStatus('IN_PROGRESS')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:translate-y-[-2px] ${
            selectedStatus === 'IN_PROGRESS'
              ? 'border-sky-400 bg-sky-400/10 shadow-lg shadow-sky-400/10'
              : 'border-sky-400/20 bg-sky-400/5 hover:border-sky-400/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">In Progress</span>
            <span className="h-2 w-2 rounded-full bg-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-sky-400">
            {stats?.inProgress ?? inquiries.filter(i => i.status === 'IN_PROGRESS').length}
          </div>
        </div>

        {/* Callbacks */}
        <div
          onClick={() => setSelectedStatus('CALL_BACK_REQUESTED')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:translate-y-[-2px] ${
            selectedStatus === 'CALL_BACK_REQUESTED'
              ? 'border-purple-400 bg-purple-400/10 shadow-lg shadow-purple-400/10'
              : 'border-purple-400/20 bg-purple-400/5 hover:border-purple-400/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Callbacks</span>
            <LuPhone size={14} className="text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-purple-400">
            {stats?.callBackRequested ?? inquiries.filter(i => i.status === 'CALL_BACK_REQUESTED').length}
          </div>
        </div>

        {/* Confirmed */}
        <div
          onClick={() => setSelectedStatus('CONFIRMED')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:translate-y-[-2px] ${
            selectedStatus === 'CONFIRMED'
              ? 'border-emerald-400 bg-emerald-400/10 shadow-lg shadow-emerald-400/10'
              : 'border-emerald-400/20 bg-emerald-400/5 hover:border-emerald-400/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Confirmed</span>
            <LuCheck size={14} className="text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-400">
            {stats?.confirmed ?? inquiries.filter(i => i.status === 'CONFIRMED' || i.status === 'responded').length}
          </div>
        </div>

        {/* Today Follow-ups */}
        <div
          onClick={() => setFollowUpFilter(prev => prev === 'today' ? 'all' : 'today')}
          className={`cursor-pointer rounded-2xl border p-4 transition-all duration-200 hover:translate-y-[-2px] ${
            followUpFilter === 'today'
              ? 'border-rose-400 bg-rose-400/10 shadow-lg shadow-rose-400/10'
              : 'border-rose-400/20 bg-rose-400/5 hover:border-rose-400/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Due Today</span>
            <LuClock size={14} className="text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-black text-rose-400">
            {stats?.todayFollowUps ?? 0}
          </div>
        </div>
      </div>

      {/* ── Search & Filter Controls Bar ── */}
      <div className="flex flex-col gap-3.5 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Search */}
        <div className="relative flex-1 min-w-[280px]">
          <LuSearch size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone, pickup, destination, or notes..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pr-10 pl-10 text-xs text-white placeholder-zinc-500 outline-none transition-all focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <LuX size={14} />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category Filter */}
          <select
            value={selectedType}
            onChange={e => setSelectedType(e.target.value)}
            className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs font-semibold text-zinc-200 outline-none transition-all hover:border-zinc-700 focus:border-amber-400"
          >
            <option value="ALL">All Categories</option>
            <option value="VEHICLE">Vehicles / Fleet</option>
            <option value="TOUR_PLAN">Tour Packages</option>
            <option value="CAB_PLAN">Cab Trip Plans</option>
            <option value="CONTACT_US">Contact Us Forms</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs font-semibold text-zinc-200 outline-none transition-all hover:border-zinc-700 focus:border-amber-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW">New Inquiries</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="CALL_BACK_REQUESTED">Call Back Requested</option>
            <option value="CONFIRMED">Confirmed Bookings</option>
            <option value="RESOLVED">Resolved / Closed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Follow-up Filter */}
          <select
            value={followUpFilter}
            onChange={e => setFollowUpFilter(e.target.value as any)}
            className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs font-semibold text-zinc-200 outline-none transition-all hover:border-zinc-700 focus:border-amber-400"
          >
            <option value="all">All Follow-ups</option>
            <option value="today">Due Today</option>
            <option value="pending">Pending Follow-ups</option>
          </select>
        </div>
      </div>

      {/* ── Main Inquiries Table ── */}
      <Table
        data={inquiries}
        keyFn={(row: Inquiry) => String(row.id)}
        emptyMessage={
          isLoading
            ? 'Loading customer leads...'
            : searchTerm || selectedStatus !== 'ALL' || selectedType !== 'ALL'
            ? 'No inquiries match the active filter criteria.'
            : 'No customer inquiries yet.'
        }
        columns={columns}
      />

      {/* ── Detail & Lead Management Drawer ── */}
      <AdminDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Lead Profile & Journey Management"
        subtitle={
          selectedInquiry
            ? `${selectedInquiry.name} • ${selectedInquiry.phone}`
            : 'Review and manage lead lifecycle'
        }
        maxWidth="max-w-xl"
      >
        {selectedInquiry && (
          <div className="space-y-6 text-xs text-zinc-300 pb-6">
            {/* Customer Profile Header */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">{selectedInquiry.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                    <span className="flex items-center gap-1 text-amber-400 font-semibold">
                      <LuPhone size={13} /> {selectedInquiry.phone}
                    </span>
                    {selectedInquiry.email && (
                      <span className="flex items-center gap-1 text-zinc-300">
                        <LuMail size={13} /> {selectedInquiry.email}
                      </span>
                    )}
                  </div>
                </div>
                <span
                  className={`rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase ${
                    getTypeMeta(selectedInquiry.type).badgeCls
                  }`}
                >
                  {selectedInquiry.type || 'CONTACT_US'}
                </span>
              </div>

              {/* Direct Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-800/80">
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-bold text-zinc-950 hover:bg-amber-300 transition-colors shadow-sm"
                >
                  <LuPhone size={13} /> Call Customer
                </a>

                {selectedInquiry.phone && (
                  <a
                    href={`https://wa.me/${cleanPhone(selectedInquiry.phone)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-400 transition-colors shadow-sm"
                  >
                    <LuExternalLink size={13} /> WhatsApp
                  </a>
                )}

                {selectedInquiry.email && (
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
                  >
                    <LuMail size={13} /> Send Email
                  </a>
                )}
              </div>
            </div>

            {/* Journey & Travel Specifications */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-zinc-400">
                Trip & Service Specifications
              </h4>

              <div className="grid grid-cols-2 gap-3.5 text-xs">
                <div className="space-y-1">
                  <span className="block text-[10px] font-semibold text-zinc-500 uppercase">Service</span>
                  <span className="font-bold text-white block">
                    {selectedInquiry.vehicle?.name ||
                      selectedInquiry.tourPlan?.title ||
                      selectedInquiry.cabPlan?.title ||
                      selectedInquiry.planTitle ||
                      'General Customer Booking'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] font-semibold text-zinc-500 uppercase">Passengers</span>
                  <span className="font-bold text-zinc-200 block">
                    {selectedInquiry.passengers ? `${selectedInquiry.passengers} Passengers` : 'Not specified'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] font-semibold text-zinc-500 uppercase">Pickup Location</span>
                  <span className="font-bold text-amber-400 block">
                    {selectedInquiry.pickupLocation || '—'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] font-semibold text-zinc-500 uppercase">Drop Destination</span>
                  <span className="font-bold text-amber-400 block">
                    {selectedInquiry.dropLocation || '—'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] font-semibold text-zinc-500 uppercase">Start Date</span>
                  <span className="font-bold text-zinc-200 block">
                    {selectedInquiry.travelDate
                      ? new Date(selectedInquiry.travelDate).toLocaleDateString('en-IN', { dateStyle: 'long' })
                      : '—'}
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="block text-[10px] font-semibold text-zinc-500 uppercase">Return Date</span>
                  <span className="font-bold text-zinc-200 block">
                    {selectedInquiry.returnDate
                      ? new Date(selectedInquiry.returnDate).toLocaleDateString('en-IN', { dateStyle: 'long' })
                      : '—'}
                  </span>
                </div>
              </div>

              {selectedInquiry.message && (
                <div className="border-t border-zinc-800 pt-3 space-y-1">
                  <span className="block text-[10px] font-semibold text-zinc-500 uppercase">Client Notes / Request</span>
                  <div className="rounded-xl bg-zinc-950 p-3 text-xs leading-relaxed text-zinc-200 border border-zinc-800/80">
                    "{selectedInquiry.message}"
                  </div>
                </div>
              )}
            </div>

            {/* Admin Lead Management Form */}
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4 space-y-4">
              <h4 className="font-bold text-amber-400 text-xs uppercase tracking-wider">
                Admin Lead Management
              </h4>

              {/* Status Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-200">Current Lead Status</label>
                <select
                  value={drawerStatus}
                  onChange={e => setDrawerStatus(e.target.value as InquiryStatus)}
                  className="w-full cursor-pointer rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs font-bold text-white outline-none focus:border-amber-400"
                >
                  <option value="NEW">● NEW (Fresh Inquiry)</option>
                  <option value="IN_PROGRESS">● IN PROGRESS (Agent Working On It)</option>
                  <option value="CALL_BACK_REQUESTED">● CALL BACK REQUESTED</option>
                  <option value="CONFIRMED">● CONFIRMED (Booking Closed / Won)</option>
                  <option value="RESOLVED">● RESOLVED (Query Completed)</option>
                  <option value="CANCELLED">● CANCELLED (Not Interested)</option>
                </select>
              </div>

              {/* Scheduled Follow-up Date */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-200">
                  Scheduled Follow-up Date
                </label>
                <input
                  type="date"
                  value={drawerFollowUpDate}
                  onChange={e => setDrawerFollowUpDate(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* Internal Notes */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-zinc-200">
                  Internal Conversation Notes & Details
                </label>
                <textarea
                  rows={4}
                  value={drawerAdminNotes}
                  onChange={e => setDrawerAdminNotes(e.target.value)}
                  placeholder="Record call discussions, negotiated price, driver assignments, or follow-up schedule..."
                  className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-amber-400"
                />
              </div>

              {/* Worked on Checkbox */}
              <label className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-zinc-200">
                <input
                  type="checkbox"
                  checked={drawerIsWorkedOn}
                  onChange={e => setDrawerIsWorkedOn(e.target.checked)}
                  className="h-4 w-4 rounded accent-amber-400"
                />
                Mark as actively worked on by team
              </label>

              {/* Save / Delete Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                  className="cursor-pointer text-xs font-semibold text-rose-400 hover:text-rose-300"
                >
                  Delete Inquiry
                </button>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(false)}
                    className="cursor-pointer rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2 font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveDrawerDetails}
                    disabled={isUpdating}
                    className="flex cursor-pointer items-center gap-1.5 rounded-xl bg-amber-400 px-5 py-2 font-bold text-zinc-950 shadow-md transition-colors hover:bg-amber-300 disabled:opacity-50"
                  >
                    <LuFileText size={14} />
                    {isUpdating ? 'Saving...' : 'Save Lead Details'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </AdminDrawer>
    </div>
  );
};
export default ManageInquiries;
