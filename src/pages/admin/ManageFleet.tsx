import { useState, useEffect } from "react";
import { getVehicles, saveVehicles, type Vehicle } from "../../utils/storage";
import { LuPlus, LuTrash2, LuPen, LuUsers, LuX } from "react-icons/lu";
import toast from "react-hot-toast";

const MOCK_PHOTO_PRESETS = [
  { label: "Sleeper Bus (Volvo)", url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80" },
  { label: "Tour Coach (Benz)", url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80" },
  { label: "Luxury Van (Toyota)", url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80" },
  { label: "Executive Sedan", url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80" },
];

export const ManageFleet = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [type, setType] = useState<"bus" | "van" | "coach" | "car">("bus");
  const [capacity, setCapacity] = useState(36);
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState(MOCK_PHOTO_PRESETS[0].url);
  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>(["AC", "Wi-Fi", "GPS"]);
  const [ratePerKm, setRatePerKm] = useState(40);

  useEffect(() => {
    setVehicles(getVehicles());
  }, []);

  const openAddModal = () => {
    setEditingVehicle(null);
    setName("");
    setType("bus");
    setCapacity(36);
    setDescription("");
    setPhoto(MOCK_PHOTO_PRESETS[0].url);
    setAmenities(["AC", "Wi-Fi", "GPS"]);
    setRatePerKm(40);
    setShowModal(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setName(vehicle.name);
    setType(vehicle.type);
    setCapacity(vehicle.capacity);
    setDescription(vehicle.description);
    setPhoto(vehicle.photo);
    setAmenities(vehicle.amenities);
    setRatePerKm(vehicle.ratePerKm || 40);
    setShowModal(true);
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
      setAmenities([...amenities, amenityInput.trim()]);
      setAmenityInput("");
    }
  };

  const handleRemoveAmenity = (indexToRemove: number) => {
    setAmenities(amenities.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !photo) {
      toast.error("Please fill in all details");
      return;
    }

    if (editingVehicle) {
      // Edit
      const updated = vehicles.map((v) =>
        v.id === editingVehicle.id
          ? { ...v, name, type, capacity, description, photo, amenities, ratePerKm }
          : v
      );
      saveVehicles(updated);
      setVehicles(updated);
      toast.success("Vehicle updated successfully!");
    } else {
      // Create new
      const newVehicle: Vehicle = {
        id: "veh_" + Date.now(),
        name,
        type,
        capacity,
        description,
        photo,
        amenities,
        ratePerKm,
        status: "active",
      };
      const updated = [newVehicle, ...vehicles];
      saveVehicles(updated);
      setVehicles(updated);
      toast.success("New vehicle added to fleet!");
    }

    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to remove this vehicle from fleet?")) {
      const updated = vehicles.filter((v) => v.id !== id);
      saveVehicles(updated);
      setVehicles(updated);
      toast.success("Vehicle removed from fleet.");
    }
  };

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">Fleet Management</h1>
          <p className="text-zinc-400 text-xs mt-1">
            Create, update, and manage transport buses, vans, and coaches.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-amber-400/10"
        >
          <LuPlus size={16} /> Add New Vehicle
        </button>
      </div>

      {/* Fleet Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.id}
            className="rounded-2xl bg-zinc-900 border border-zinc-800/80 overflow-hidden flex flex-col justify-between h-full shadow-lg"
          >
            <div className="relative aspect-video">
              <img src={v.photo} alt={v.name} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-zinc-950/80 backdrop-blur-sm border border-zinc-850 text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                {v.type}
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-zinc-950/90 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <LuUsers size={12} className="text-amber-400" />
                {v.capacity} Seater
              </div>
            </div>

            <div className="p-5 flex-grow space-y-4">
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white leading-snug">{v.name}</h3>
                <p className="text-zinc-400 text-xs font-light line-clamp-2 leading-relaxed">
                  {v.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {v.amenities.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-[9px] font-medium text-zinc-350 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions Bar */}
            <div className="px-5 py-4 border-t border-zinc-800/80 bg-zinc-950/20 flex items-center justify-between">
              <span className="text-xs font-bold text-white">
                ₹{v.ratePerKm || 40}/km
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditModal(v)}
                  className="p-1.5 rounded bg-zinc-850 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  title="Edit"
                >
                  <LuPen size={13} />
                </button>
                <button
                  onClick={() => handleDelete(v.id)}
                  className="p-1.5 rounded bg-zinc-850 hover:bg-red-500/15 border border-zinc-800 text-zinc-450 hover:text-red-400 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <LuTrash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {vehicles.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-550 border border-dashed border-zinc-800 rounded-2xl">
            No vehicles listed. Click "Add New Vehicle" to seed your fleet.
          </div>
        )}
      </div>

      {/* ── Add / Edit Vehicle Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in">
          <div className="relative w-full max-w-xl rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80">
              <h3 className="text-base font-bold text-white">
                {editingVehicle ? "Edit Vehicle Details" : "Add Vehicle to Fleet"}
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
                  <label className="block text-zinc-450 font-semibold">Vehicle Name *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Volvo 9600 Multi-Axle"
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-zinc-450 font-semibold">Vehicle Type *</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                  >
                    <option value="bus">Bus</option>
                    <option value="coach">Coach</option>
                    <option value="van">Luxury Mini Van</option>
                    <option value="car">Executive Car</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-zinc-450 font-semibold">Seat Capacity *</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                    required
                    min={1}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-zinc-450 font-semibold">Rate Per KM (INR) *</label>
                  <input
                    type="number"
                    value={ratePerKm}
                    onChange={(e) => setRatePerKm(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                    required
                    min={1}
                  />
                </div>
              </div>

              {/* Photo Input & Presets */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-zinc-450 font-semibold">Vehicle Image URL *</label>
                  <span className="text-[10px] text-amber-400">Or pick a preset below</span>
                </div>
                <input
                  type="text"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                  required
                />
                {/* Presets Row */}
                <div className="flex gap-2 overflow-x-auto py-1">
                  {MOCK_PHOTO_PRESETS.map((preset, idx) => (
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

              {/* Amenities Builder */}
              <div className="space-y-2">
                <label className="block text-zinc-450 font-semibold">Vehicle Amenities</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={amenityInput}
                    onChange={(e) => setAmenityInput(e.target.value)}
                    placeholder="e.g. Wi-Fi, Charger, Toilet"
                    className="flex-grow bg-zinc-950 border border-zinc-800 text-white p-2.5 rounded-xl outline-none focus:border-amber-400/50"
                  />
                  <button
                    type="button"
                    onClick={handleAddAmenity}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {amenities.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-[10px] font-semibold bg-zinc-950 border border-zinc-850 px-2.5 py-1 rounded-lg text-zinc-300"
                    >
                      {item}
                      <button
                        type="button"
                        onClick={() => handleRemoveAmenity(idx)}
                        className="text-red-400 hover:text-red-300 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-zinc-450 font-semibold">Short Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Describe comfort features, safety, or routes this vehicle works on..."
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
                  {editingVehicle ? "Save Changes" : "Create Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
export default ManageFleet;
