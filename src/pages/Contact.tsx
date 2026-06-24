import { useState } from "react";
import { getInquiries, saveInquiries, type Inquiry } from "../utils/storage";
import { LuMail, LuPhone, LuMapPin, LuSend, LuClock } from "react-icons/lu";
import toast from "react-hot-toast";

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    setTimeout(() => {
      const newInquiry: Inquiry = {
        id: "inq_" + Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: new Date().toISOString().split("T")[0],
        message: formData.message,
        status: "pending",
      };

      const currentInquiries = getInquiries();
      saveInquiries([newInquiry, ...currentInquiries]);

      toast.success("Message sent! Our support team will get back to you shortly.");
      setFormData({ name: "", email: "", phone: "", message: "" });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-in text-theme-primary">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black">Contact Us</h1>
        <p className="text-theme-secondary text-sm max-w-xl mx-auto font-light">
          Have queries about tour bookings, customizable charters, or vehicle availability? Reach out to Balaji Travels.
        </p>
        <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-1 space-y-4">
          <div className="p-6 rounded-2xl bg-theme-card border border-theme-muted flex gap-4 items-start shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-450/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <LuMapPin size={22} />
            </div>
            <div>
              <h3 className="font-bold text-base mb-1">Our Head Office</h3>
              <p className="text-theme-secondary text-xs font-light leading-relaxed">
                102 Balaji Arcade, Tourism Sector, City Center, India
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-theme-card border border-theme-muted flex gap-4 items-start shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-450/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <LuPhone size={22} />
            </div>
            <div>
              <h3 className="font-bold text-base mb-1">Call Booking Desk</h3>
              <p className="text-theme-secondary text-xs font-light leading-relaxed">
                +91 98765 43210 <br />
                <span className="text-[10px] text-theme-muted">Toll Free: 1800 123 4567</span>
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-theme-card border border-theme-muted flex gap-4 items-start shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-450/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <LuMail size={22} />
            </div>
            <div>
              <h3 className="font-bold text-base mb-1">Email Queries</h3>
              <p className="text-theme-secondary text-xs font-light leading-relaxed">
                info@balajitravels.com <br />
                <span className="text-[10px] text-theme-muted">support@balajitravels.com</span>
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-theme-card border border-theme-muted flex gap-4 items-start shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-amber-450/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <LuClock size={22} />
            </div>
            <div>
              <h3 className="font-bold text-base mb-1">Working Hours</h3>
              <p className="text-theme-secondary text-xs font-light leading-relaxed">
                Monday to Saturday: 09:00 AM - 08:00 PM <br />
                Sunday: 10:00 AM - 04:00 PM
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-theme-card border border-theme-muted shadow-lg">
          <h2 className="text-xl font-bold mb-6">Send Us a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block font-semibold text-theme-secondary">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  className="w-full bg-theme-input border border-theme-muted text-theme-primary px-3 py-2.5 rounded-xl outline-none focus:border-amber-400/50 transition-colors"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="block font-semibold text-theme-secondary">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full bg-theme-input border border-theme-muted text-theme-primary px-3 py-2.5 rounded-xl outline-none focus:border-amber-400/50 transition-colors"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-theme-secondary">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className="w-full bg-theme-input border border-theme-muted text-theme-primary px-3 py-2.5 rounded-xl outline-none focus:border-amber-400/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="block font-semibold text-theme-secondary">Your Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                placeholder="Write your query or custom itinerary requests..."
                className="w-full bg-theme-input border border-theme-muted text-theme-primary px-3 py-2.5 rounded-xl outline-none focus:border-amber-400/50 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-955 font-bold transition-colors cursor-pointer shadow-md flex items-center gap-2 justify-center"
            >
              <LuSend size={14} />
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Contact;
