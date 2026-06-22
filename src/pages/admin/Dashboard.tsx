import { useState, useEffect } from "react";
import { getInquiries, getPlans, getVehicles, getBlogs, saveInquiries, type Inquiry } from "../../utils/storage";
import { LuBus, LuMapPin, LuFileText, LuCheck, LuTrash2, LuInbox } from "react-icons/lu";
import toast from "react-hot-toast";

export const Dashboard = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState({
    plansCount: 0,
    fleetCount: 0,
    blogsCount: 0,
    inqCount: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const inqs = getInquiries();
    setInquiries(inqs);
    setStats({
      plansCount: getPlans().length,
      fleetCount: getVehicles().length,
      blogsCount: getBlogs().length,
      inqCount: inqs.filter((i) => i.status === "pending").length,
    });
  };

  const handleToggleStatus = (id: string) => {
    const updated = inquiries.map((inq) => {
      if (inq.id === id) {
        const newStatus = inq.status === "pending" ? "responded" : "pending";
        return { ...inq, status: newStatus as "pending" | "responded" };
      }
      return inq;
    });
    saveInquiries(updated);
    setInquiries(updated);
    toast.success("Inquiry status updated successfully!");
    loadData();
  };

  const handleDeleteInquiry = (id: string) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      const updated = inquiries.filter((inq) => inq.id !== id);
      saveInquiries(updated);
      setInquiries(updated);
      toast.success("Inquiry deleted successfully!");
      loadData();
    }
  };

  return (
    <div className="space-y-8 animate-in">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-white">Console Overview</h1>
        <p className="text-zinc-400 text-xs mt-1">
          Monitor your customer booking inquiries, view website stats, and manage travel modules.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">Pending Inquiries</span>
            <span className="text-2xl font-black text-white">{stats.inqCount}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
            <LuInbox size={20} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">Total Fleet</span>
            <span className="text-2xl font-black text-white">{stats.fleetCount} Vehicles</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
            <LuBus size={20} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">Destinations</span>
            <span className="text-2xl font-black text-white">{stats.plansCount} Packages</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
            <LuMapPin size={20} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider block">SEO Articles</span>
            <span className="text-2xl font-black text-white">{stats.blogsCount} Posts</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center">
            <LuFileText size={20} />
          </div>
        </div>
      </div>

      {/* Customer Inquiries Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          Customer Booking Inquiries
          {stats.inqCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-zinc-950 text-[10px] font-bold">
              {stats.inqCount} New
            </span>
          )}
        </h2>

        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-950/50 text-zinc-500 uppercase tracking-wider font-semibold">
                  <th className="p-4">Customer</th>
                  <th className="p-4">Requested Tour</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Message</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-350">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-zinc-850/40 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-white">{inq.name}</div>
                      <div className="text-[10px] text-zinc-500">{inq.email} | {inq.phone}</div>
                    </td>
                    <td className="p-4 font-medium text-zinc-300">
                      {inq.planTitle}
                    </td>
                    <td className="p-4 text-zinc-450">{inq.date}</td>
                    <td className="p-4 max-w-xs truncate" title={inq.message}>
                      {inq.message || "—"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          inq.status === "pending"
                            ? "bg-amber-400/10 text-amber-400 border border-amber-400/20"
                            : "bg-emerald-450/10 text-emerald-400 border border-emerald-400/20"
                        }`}
                      >
                        {inq.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleToggleStatus(inq.id)}
                          className={`p-1.5 rounded cursor-pointer transition-colors ${
                            inq.status === "pending"
                              ? "bg-zinc-850 hover:bg-emerald-500/15 text-zinc-400 hover:text-emerald-400 border border-zinc-800"
                              : "bg-zinc-850 hover:bg-amber-500/15 text-zinc-450 hover:text-amber-400 border border-zinc-800"
                          }`}
                          title={inq.status === "pending" ? "Mark Responded" : "Mark Pending"}
                        >
                          <LuCheck size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1.5 rounded bg-zinc-850 hover:bg-red-500/15 text-zinc-400 hover:text-red-400 border border-zinc-800 cursor-pointer"
                          title="Delete"
                        >
                          <LuTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {inquiries.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-zinc-550">
                      No customer inquiries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
