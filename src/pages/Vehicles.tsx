import { useState, useEffect } from "react";
import { getVehicles, type Vehicle } from "../utils/storage";
import { LuUsers, LuCompass, LuSparkles, LuCheck } from "react-icons/lu";

export const Vehicles = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    setVehicles(getVehicles());
  }, []);

  const types = ["all", "bus", "coach", "van", "car"];

  const filteredVehicles = vehicles.filter(
    (v) => filterType === "all" || v.type === filterType
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white">Our Luxury Fleet</h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xl mx-auto font-light">
          State-of-the-art vehicles, from 36-seater luxury sleeper buses to executive coaches and mini-vans, suitable for every group size.
        </p>
        <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-4" />
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center flex-wrap gap-2">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
              filterType === type
                ? "bg-amber-400 border-amber-400 text-zinc-950 shadow-md shadow-amber-400/10"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            {type}s
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredVehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 overflow-hidden hover:border-amber-400/30 transition-all flex flex-col h-full shadow-md dark:shadow-lg"
          >
            {/* Vehicle image */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={vehicle.photo}
                alt={vehicle.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-[10px] font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
                <LuCompass size={12} className="text-amber-400 animate-spin-slow" />
                {vehicle.type}
              </div>
              <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-zinc-950/90 text-white font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                <LuUsers size={12} className="text-amber-400" />
                {vehicle.capacity} Seater
              </div>
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow justify-between space-y-6">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                  {vehicle.name}
                </h3>
                <p className="text-zinc-650 dark:text-zinc-400 text-xs font-light leading-relaxed">
                  {vehicle.description}
                </p>

                {/* Amenities checklist */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-550 dark:text-zinc-500 tracking-wider flex items-center gap-1">
                    <LuSparkles size={10} className="text-amber-400" /> Onboard Amenities
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.amenities.map((amenity, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-700 dark:text-zinc-300 px-2.5 py-1 rounded bg-zinc-50 dark:bg-zinc-950 border border-zinc-150 dark:border-zinc-850"
                      >
                        <LuCheck size={10} className="text-amber-400" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rate and Inquiry Button */}
              {vehicle.ratePerKm && (
                <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-zinc-550 dark:text-zinc-500 text-[10px] uppercase tracking-wider block font-semibold">Estimated Rate</span>
                    <span className="text-sm font-bold text-zinc-900 dark:text-white">₹{vehicle.ratePerKm}/km <span className="text-zinc-500 text-xs font-light">onwards</span></span>
                  </div>
                  <a
                    href="#enquire"
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = "/plans";
                    }}
                    className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-amber-400 hover:text-zinc-950 dark:hover:text-zinc-950 text-zinc-750 dark:text-zinc-300 font-bold text-xs transition-all cursor-pointer border border-zinc-200 dark:border-zinc-800/80 hover:border-amber-400/10"
                  >
                    Enquire Fleet
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredVehicles.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-500">
            No vehicles found matching the filter selection.
          </div>
        )}
      </div>
    </div>
  );
};
export default Vehicles;
