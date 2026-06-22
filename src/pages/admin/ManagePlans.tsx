import { useState, useEffect } from "react";
import { getPlans, savePlans, type TravelPlan } from "../../utils/storage";
import { LuPlus, LuTrash2, LuPen, LuClock, LuMapPin, LuX } from "react-icons/lu";
import toast from "react-hot-toast";

const TOUR_PHOTO_PRESETS = [
  { label: "Taj Mahal", url: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80" },
  { label: "Kerala Houseboat", url: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80" },
  { label: "Manali Campsite", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80" },
  { label: "Goa Beach Resort", url: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80" },
];

export const ManagePlans = () => {
  const [plans, setPlans] = useState<TravelPlan[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<TravelPlan | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState(10000);
  const [photo, setPhoto] = useState(TOUR_PHOTO_PRESETS[0].url);
  const [description, setDescription] = useState("");

  const [highlightInput, setHighlightInput] = useState("");
  const [highlights, setHighlights] = useState<string[]>([]);

  const [inclusionInput, setInclusionInput] = useState("");
  const [inclusions, setInclusions] = useState<string[]>([]);

  useEffect(() => {
    setPlans(getPlans());
  }, []);

  const openAddModal = () => {
    setEditingPlan(null);
    setTitle("");
    setDestination("");
    setDuration("3 Days / 2 Nights");
    setPrice(10000);
    setPhoto(TOUR_PHOTO_PRESETS[0].url);
    setDescription("");
    setHighlights([]);
    setInclusions(["AC Coach Travel", "Hotel Stay", "Meals Included"]);
    setShowModal(true);
  };

  const openEditModal = (plan: TravelPlan) => {
    setEditingPlan(plan);
    setTitle(plan.title);
    setDestination(plan.destination);
    setDuration(plan.duration);
    setPrice(plan.price);
    setPhoto(plan.photo);
    setDescription(plan.description);
    setHighlights(plan.highlights);
    setInclusions(plan.inclusions);
    setShowModal(true);
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim() && !highlights.includes(highlightInput.trim())) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput("");
    }
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  const handleAddInclusion = () => {
    if (inclusionInput.trim() && !inclusions.includes(inclusionInput.trim())) {
      setInclusions([...inclusions, inclusionInput.trim()]);
      setInclusionInput("");
    }
  };

  const handleRemoveInclusion = (idx: number) => {
    setInclusions(inclusions.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !destination || !duration || !photo || !description) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (editingPlan) {
      const updated = plans.map((p) =>
        p.id === editingPlan.id
          ? { ...p, title, destination, duration, price, photo, description, highlights, inclusions }
          : p
      );
      savePlans(updated);
      setPlans(updated);
      toast.success("Travel plan updated successfully!");
    } else {
      const newPlan: TravelPlan = {
        id: "plan_" + Date.now(),
        title,
        destination,
        duration,
        price,
        photo,
        description,
        highlights,
        inclusions,
      };
      const updated = [newPlan, ...plans];
      savePlans(updated);
      setPlans(updated);
      toast.success("New travel package created!");
    }

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this travel package?")) {
      const updated = plans.filter((p) => p.id !== id);
      savePlans(updated);
      setPlans(updated);
      toast.success("Travel package removed.");
    }
  };

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Travel Plans & Places</h1>
          <p className="text-zinc-400 text-xs mt-1">
            Manage packages, prices, route details, and customer itinerary options.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/10"
        >
          <LuPlus size={16} /> Create Tour Package
        </button>
      </div>

      {/* Plans List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((p) => (
          <div
            key={p.id}
            className="rounded-2xl bg-zinc-900 border border-zinc-800/80 overflow-hidden flex flex-col justify-between h-full shadow-lg"
          >
            <div className="relative aspect-video">
              <img src={p.photo} alt={p.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur-sm border border-zinc-850 text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1">
                <LuMapPin size={10} />
                {p.destination}
              </div>
              <div className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded bg-zinc-950/90 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <LuClock size={10} className="text-amber-400" />
                {p.duration}
              </div>
            </div>

            <div className="p-5 flex-grow space-y-3">
              <h3 className="text-base font-bold text-white leading-snug">{p.title}</h3>
              <p className="text-zinc-400 text-xs font-light line-clamp-2 leading-relaxed">
                {p.description}
              </p>
            </div>

            {/* Actions Bar */}
            <div className="px-5 py-4 border-t border-zinc-800/80 bg-zinc-950/20 flex items-center justify-between">
              <span className="text-sm font-black text-white">
                ₹{p.price.toLocaleString("en-IN")}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(p)}
                  className="p-1.5 rounded bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Edit"
                >
                  <LuPen size={13} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="p-1.5 rounded bg-zinc-850 hover:bg-red-500/15 border border-zinc-800 text-zinc-450 hover:text-red-400 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <LuTrash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {plans.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-550 border border-dashed border-zinc-800 rounded-2xl">
            No travel packages listed. Click "Create Tour Package" to seed your destinations.
          </div>
        )}
      </div>

      {/* ── Add / Edit Tour Plan Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in">
          <div className="relative w-full max-w-2xl rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
              <h3 className="text-base font-bold text-white">
                {editingPlan ? "Edit Tour Destination Details" : "Create New Tour Destination"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
              >
                <LuX size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow text-xs text-zinc-300">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-zinc-455 font-semibold">Package Title *</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Agra Heritage Weekend Trip"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-zinc-455 font-semibold">Destination *</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Delhi - Agra - Delhi"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-zinc-455 font-semibold">Duration *</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="3 Days / 2 Nights"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-zinc-455 font-semibold">Package Price (INR) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                    required
                    min={1}
                  />
                </div>
              </div>

              {/* Photo selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-zinc-455 font-semibold">Cover Image URL *</label>
                  <span className="text-[10px] text-amber-400">Or pick a tour preset</span>
                </div>
                <input
                  type="text"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                  required
                />
                <div className="flex gap-2 overflow-x-auto py-1">
                  {TOUR_PHOTO_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setPhoto(preset.url)}
                      className={`px-3 py-1 rounded bg-zinc-850 hover:bg-zinc-800 border text-[10px] font-semibold cursor-pointer ${
                        photo === preset.url ? "border-amber-400 text-amber-400" : "border-zinc-800 text-zinc-400"
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Highlights Builder */}
              <div className="space-y-2">
                <label className="block text-zinc-455 font-semibold">Tour Highlights</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    placeholder="e.g. Taj Mahal sunrise view"
                    className="flex-grow bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {highlights.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold bg-zinc-950 border border-zinc-850 px-2.5 py-1 rounded-lg text-zinc-300"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(idx)}
                        className="text-red-400 hover:text-red-300 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Inclusions Builder */}
              <div className="space-y-2">
                <label className="block text-zinc-455 font-semibold">Package Inclusions</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inclusionInput}
                    onChange={(e) => setInclusionInput(e.target.value)}
                    placeholder="e.g. 3-star Hotel stay"
                    className="flex-grow bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddInclusion}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {inclusions.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold bg-zinc-950 border border-zinc-850 px-2.5 py-1 rounded-lg text-zinc-300"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveInclusion(idx)}
                        className="text-red-400 hover:text-red-300 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-455 font-semibold">Package Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Provide package summary, brief daily route planner, or target audience..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50 resize-none"
                  required
                />
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-zinc-800 hover:bg-zinc-800 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-bold cursor-pointer"
                >
                  {editingPlan ? "Save Changes" : "Create Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManagePlans;
