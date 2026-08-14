import { useState } from 'react';
import { useGetVehiclesQuery } from '../redux/slices/vehicleApiSlice';
import { LuUsers, LuCompass, LuSparkles, LuCheck } from 'react-icons/lu';

export const Vehicles = () => {
  const { data: vehicleData } = useGetVehiclesQuery();
  const vehicles = (vehicleData?.data as any[]) || [];
  const [filterType, setFilterType] = useState<string>('all');

  const types = ['all', 'bus', 'coach', 'van', 'car'];

  const filteredVehicles = vehicles.filter(
    (v: any) => filterType === 'all' || v.type === filterType
  );

  return (
    <div className="animate-in mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-black text-zinc-900 sm:text-5xl dark:text-white">
          Our Luxury Fleet
        </h1>
        <p className="mx-auto max-w-xl text-sm font-light text-zinc-500 dark:text-zinc-400">
          State-of-the-art vehicles, from 36-seater luxury sleeper buses to executive coaches and
          mini-vans, suitable for every group size.
        </p>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-amber-400" />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`cursor-pointer rounded-xl border px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all ${
              filterType === type
                ? 'border-amber-400 bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/10'
                : 'text-zinc-650 border-zinc-200 bg-white hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-white'
            }`}
          >
            {type}s
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredVehicles.map(vehicle => (
          <div
            key={vehicle.id}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md transition-all hover:border-amber-400/30 dark:border-zinc-800/80 dark:bg-zinc-900 dark:shadow-lg"
          >
            {/* Vehicle image */}
            <div className="relative aspect-video overflow-hidden">
              <img
                src={
                  (vehicle as any).photo ||
                  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'
                }
                alt={vehicle.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-[10px] font-bold tracking-widest text-amber-400 uppercase backdrop-blur-md">
                <LuCompass size={12} className="animate-spin-slow text-amber-400" />
                {vehicle.type}
              </div>
              <div className="absolute right-3 bottom-3 flex items-center gap-1 rounded bg-zinc-950/90 px-2 py-1 text-[10px] font-bold tracking-wider text-white uppercase">
                <LuUsers size={12} className="text-amber-400" />
                {vehicle.capacity} Seater
              </div>
            </div>

            {/* Content */}
            <div className="flex flex-grow flex-col justify-between space-y-6 p-6">
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-zinc-900 transition-colors group-hover:text-amber-500 dark:text-white dark:group-hover:text-amber-400">
                  {vehicle.name}
                </h3>
                <p className="text-zinc-650 text-xs leading-relaxed font-light dark:text-zinc-400">
                  {vehicle.description}
                </p>

                {/* Amenities checklist */}
                <div className="space-y-2 pt-2">
                  <span className="text-zinc-550 flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase dark:text-zinc-500">
                    <LuSparkles size={10} className="text-amber-400" /> Onboard Amenities
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {((vehicle as any).amenities || []).map((amenity: string, idx: number) => (
                      <span
                        key={idx}
                        className="border-zinc-150 dark:border-zinc-850 inline-flex items-center gap-1 rounded border bg-zinc-50 px-2.5 py-1 text-[10px] font-semibold text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
                      >
                        <LuCheck size={10} className="text-amber-400" />
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rate and Inquiry Button */}
              <div className="border-zinc-150 flex items-center justify-between border-t pt-4 dark:border-zinc-800">
                <div>
                  <span className="text-zinc-550 block text-[10px] font-semibold tracking-wider uppercase dark:text-zinc-500">
                    Estimated Rate
                  </span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-white">
                    ₹{(vehicle as any).ratePerKm}/km{' '}
                    <span className="text-xs font-light text-zinc-500">onwards</span>
                  </span>
                </div>
                <a
                  href="#enquire"
                  onClick={e => {
                    e.preventDefault();
                    window.location.href = '/plans';
                  }}
                  className="text-zinc-750 cursor-pointer rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2 text-xs font-bold transition-all hover:border-amber-400/10 hover:bg-amber-400 hover:text-zinc-950 dark:border-zinc-800/80 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-950"
                >
                  Enquire Fleet
                </a>
              </div>
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
