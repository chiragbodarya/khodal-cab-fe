import { useState, useEffect } from "react";
import { getPlans, getInquiries, saveInquiries, type TravelPlan, type Inquiry } from "../utils/storage";
import { LuClock, LuCheck, LuMapPin, LuInfo, LuX } from "react-icons/lu";
import toast from "react-hot-toast";

export const TravelPlans = () => {
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<TravelPlan | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    setPlans(getPlans());
  }, []);

  const handleOpenInquiry = (plan: TravelPlan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handleCloseInquiry = () => {
    setSelectedPlan(null);
    setShowModal(false);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newInquiry: Inquiry = {
      id: "inq_" + Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      planId: selectedPlan?.id,
      planTitle: selectedPlan?.title || "Custom Inquiry",
      date: new Date().toISOString().split("T")[0],
      message: formData.message,
      status: "pending",
    };

    const currentInquiries = getInquiries();
    saveInquiries([newInquiry, ...currentInquiries]);

    toast.success("Inquiry submitted successfully! Our agent will contact you shortly.");
    handleCloseInquiry();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white">Tour Packages</h1>
        <p className="text-zinc-550 dark:text-zinc-400 text-sm max-w-xl mx-auto font-light">
          Handpicked premium holiday packages, tailored for absolute comfort and unforgettable travel experiences.
        </p>
        <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-4" />
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/85 overflow-hidden hover:border-amber-400/30 transition-all flex flex-col h-full shadow-md dark:shadow-lg"
          >
            {/* Cover photo */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={plan.photo}
                alt={plan.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <LuClock size={12} />
                {plan.duration}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-amber-500 dark:text-amber-400/80 tracking-widest flex items-center gap-1.5">
                    <LuMapPin size={12} />
                    {plan.destination}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                    {plan.title}
                  </h3>
                </div>

                <p className="text-zinc-650 dark:text-zinc-400 text-xs font-light leading-relaxed">
                  {plan.description}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-550 dark:text-zinc-500 tracking-wider flex items-center gap-1">
                    <LuInfo size={11} className="text-amber-400" /> Package Highlights
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    {plan.highlights.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="text-zinc-700 dark:text-zinc-300 text-xs flex items-center gap-2 font-light">
                        <LuCheck size={12} className="text-amber-500 dark:text-amber-400 flex-shrink-0" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price and Action */}
              <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <span className="text-zinc-550 dark:text-zinc-500 text-[10px] uppercase tracking-wider block font-semibold">Price Per Person</span>
                  <span className="text-lg font-bold text-zinc-900 dark:text-white">₹{plan.price.toLocaleString("en-IN")}</span>
                </div>
                <button
                  onClick={() => handleOpenInquiry(plan)}
                  className="px-4 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-all cursor-pointer shadow-lg shadow-amber-400/10"
                >
                  Book / Enquire
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Booking Inquiry Modal ── */}
      {showModal && selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-150 dark:border-zinc-800/80">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-500 dark:text-amber-400 tracking-wider">Submit Inquiry</span>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white mt-0.5">{selectedPlan.title}</h3>
              </div>
              <button
                onClick={handleCloseInquiry}
                className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
              >
                <LuX size={18} />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow text-xs">
              <div className="space-y-1">
                <label className="block font-semibold text-zinc-605 dark:text-zinc-400">Selected Package</label>
                <input
                  type="text"
                  disabled
                  value={`${selectedPlan.title} (${selectedPlan.duration})`}
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 px-3 py-2.5 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-semibold text-zinc-605 dark:text-zinc-400">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-3 py-2.5 rounded-xl outline-none focus:border-amber-400/50 transition-colors"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-semibold text-zinc-605 dark:text-zinc-400">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-3 py-2.5 rounded-xl outline-none focus:border-amber-400/50 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-zinc-605 dark:text-zinc-400">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-3 py-2.5 rounded-xl outline-none focus:border-amber-400/50 transition-colors"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-zinc-605 dark:text-zinc-400">Special Requests / Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about passenger count, custom dates, or any special requirements..."
                  className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white px-3 py-2.5 rounded-xl outline-none focus:border-amber-400/50 transition-colors resize-none"
                />
              </div>

              <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800/80 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCloseInquiry}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-955 font-bold transition-colors cursor-pointer shadow-md"
                >
                  Submit Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default TravelPlans;
