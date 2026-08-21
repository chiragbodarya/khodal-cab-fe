import { useState } from 'react';
import { useGetVehiclesQuery } from '../redux/slices/vehicleApiSlice';
import { DEFAULT_VEHICLES } from '../utils/storage';
import { LuUsers, LuCompass, LuSparkles, LuCheck, LuArrowRight } from 'react-icons/lu';
import { InquiryModal } from '../components/common/InquiryModal';

export const Vehicles = () => {
  const { data: vehicleData, isLoading } = useGetVehiclesQuery();
  const apiVehicles = (vehicleData?.data as any[]) || [];
  const vehicles = apiVehicles.length > 0 ? apiVehicles : DEFAULT_VEHICLES;
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenInquiry = (v: any) => {
    setSelectedVehicle(v);
    setIsModalOpen(true);
  };

  const filterTabs = [
    { label: 'All Fleet', value: 'all' },
    { label: 'Buses', value: 'bus' },
    { label: 'Coaches', value: 'coach' },
    { label: 'Mini Vans', value: 'van' },
    { label: 'Cars & Sedans', value: 'car' },
    { label: 'SUVs', value: 'suv' },
  ];

  const normalizeType = (v: any) => {
    const rawType = (v.type || v.category || 'bus').toString().toLowerCase();
    return rawType;
  };

  const getVehicleImage = (v: any) => {
    if (v.photo) return v.photo;
    if (v.imageUrl) return v.imageUrl;
    if (v.image) return v.image;
    if (v.coverImage) return v.coverImage;
    if (Array.isArray(v.images) && v.images.length > 0) return v.images[0];
    if (typeof v.images === 'string' && v.images) return v.images;
    return 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';
  };

  const getVehicleAmenities = (v: any): string[] => {
    let list = v.amenities || v.features;
    if (typeof list === 'string') {
      list = list.split(',').map((s: string) => s.trim()).filter(Boolean);
    }
    if (Array.isArray(list) && list.length > 0) {
      return list;
    }
    return ['Air Conditioning', 'Pushback Seats', 'Luggage Space', 'Clean Interiors'];
  };

  const filteredVehicles = vehicles.filter((v: any) => {
    if (filterType === 'all') return true;
    const vType = normalizeType(v);
    return vType.includes(filterType.toLowerCase()) || filterType.toLowerCase().includes(vType);
  });

  return (
    <div className="animate-in mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold tracking-wider text-amber-500 uppercase dark:text-amber-400">
          <LuCompass className="animate-spin-slow" /> Premium Transportation Fleet
        </div>
        <h1 className="text-3xl font-black text-zinc-900 sm:text-5xl dark:text-white">
          Our Luxury Fleet
        </h1>
        <p className="mx-auto max-w-xl text-sm font-light text-zinc-500 dark:text-zinc-400">
          State-of-the-art vehicles, from 36-seater luxury sleeper buses to executive coaches,
          family mini-vans, and premium sedans tailored for every journey.
        </p>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-amber-400" />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {filterTabs.map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilterType(tab.value)}
            className={`cursor-pointer rounded-xl border px-5 py-2 text-xs font-bold tracking-wider uppercase transition-all ${
              filterType === tab.value
                ? 'border-amber-400 bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/10'
                : 'text-zinc-650 border-zinc-200 bg-white hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredVehicles.map((vehicle: any, idx: number) => {
          const vehicleId = vehicle.id || vehicle._id || `veh-${idx}`;
          const photo = getVehicleImage(vehicle);
          const name = vehicle.name || vehicle.title || 'Premium Travel Vehicle';
          const type = vehicle.type || vehicle.category || 'Luxury';
          const capacity = vehicle.capacity || vehicle.seatCapacity || vehicle.seats || 4;
          const description =
            vehicle.description ||
            vehicle.desc ||
            'Comfortable and modern vehicle maintained to the highest safety and hygiene standards.';
          const amenities = getVehicleAmenities(vehicle);
          const rate = vehicle.ratePerKm || vehicle.pricePerKm || vehicle.rate || vehicle.price;

          return (
            <div
              key={vehicleId}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md transition-all hover:border-amber-400/30 hover:shadow-xl dark:border-zinc-800/80 dark:bg-zinc-900 dark:shadow-lg"
            >
              {/* Vehicle image */}
              <div className="relative aspect-video overflow-hidden bg-zinc-800">
                <img
                  src={photo}
                  alt={name}
                  onError={(e: any) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg border border-zinc-800/80 bg-zinc-950/85 px-2.5 py-1 text-[10px] font-bold tracking-widest text-amber-400 uppercase backdrop-blur-md">
                  <LuCompass size={12} className="animate-spin-slow text-amber-400" />
                  {type}
                </div>
                <div className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-lg bg-zinc-950/90 px-2.5 py-1 text-[11px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
                  <LuUsers size={13} className="text-amber-400" />
                  <span className="text-sm font-black text-amber-400">{capacity}</span> Seater
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-grow flex-col justify-between space-y-6 p-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-zinc-900 transition-colors group-hover:text-amber-500 dark:text-white dark:group-hover:text-amber-400">
                    {name}
                  </h3>
                  <p className="text-zinc-650 line-clamp-3 text-xs leading-relaxed font-light dark:text-zinc-400">
                    {description}
                  </p>

                  {/* Amenities checklist */}
                  <div className="space-y-2 pt-2">
                    <span className="text-zinc-550 flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase dark:text-zinc-500">
                      <LuSparkles size={10} className="text-amber-400" /> Onboard Amenities
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {amenities.map((amenity: string, idx2: number) => (
                        <span
                          key={idx2}
                          className="border-zinc-150 dark:border-zinc-850 inline-flex items-center gap-1 rounded-md border bg-zinc-50 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
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
                      {rate ? (
                        <>
                          ₹{rate}/km <span className="text-xs font-light text-zinc-500">onwards</span>
                        </>
                      ) : (
                        <span className="text-xs font-medium text-amber-500 dark:text-amber-400">
                          Custom Quote
                        </span>
                      )}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleOpenInquiry({
                        id: vehicleId,
                        title: name,
                        type: 'vehicle',
                        price: rate ? `${rate}/km` : undefined,
                        capacity: capacity,
                        photo: photo,
                      })
                    }
                    className="text-zinc-750 inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-100 px-4 py-2 text-xs font-bold transition-all hover:border-amber-400/20 hover:bg-amber-400 hover:text-zinc-950 dark:border-zinc-800/80 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-zinc-950"
                  >
                    Enquire Fleet <LuArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredVehicles.length === 0 && (
          <div className="col-span-full py-16 text-center text-zinc-500">
            {isLoading ? 'Loading fleet vehicles...' : 'No vehicles found matching the filter selection.'}
          </div>
        )}
      </div>

      {/* ── Fleet Inquiry Modal ── */}
      <InquiryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={selectedVehicle}
      />
    </div>
  );
};
export default Vehicles;
