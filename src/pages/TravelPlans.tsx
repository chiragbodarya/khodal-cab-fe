import { useState } from 'react';
import { useGetTourPlansQuery } from '../redux/slices/tourApiSlice';
import { useGetCabPlansQuery } from '../redux/slices/cabApiSlice';
import { LuClock, LuCheck, LuMapPin, LuInfo, LuCar } from 'react-icons/lu';
import { CAB_PLANS } from '../utils/constants';
import { InquiryModal, type InquiryItem } from '../components/common/InquiryModal';

export const TravelPlans = () => {
  const { data: tourData } = useGetTourPlansQuery();
  const { data: cabData } = useGetCabPlansQuery();
  const tourPlans = (tourData?.data as any[]) || [];
  const liveCabPlans = (cabData?.data as any[]) || [];
  const cabPlansToDisplay = liveCabPlans.length > 0 ? liveCabPlans : CAB_PLANS;
  const plans = tourPlans;
  const [selectedItem, setSelectedItem] = useState<InquiryItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'tours' | 'cabs'>('tours');

  const handleOpenInquiry = (plan: any) => {
    const title = plan.title || plan.packageName || 'Trip Booking';
    const duration = plan.duration || (plan.days ? `${plan.days} Days / ${plan.nights} Nights` : undefined);
    const destination = plan.destination || plan.tripRoute;
    const price = plan.price || plan.pricePerPerson || 0;
    const photo = plan.photo || plan.imageUrl;

    setSelectedItem({
      id: String(plan.id || plan._id || ''),
      title,
      type: activeTab === 'tours' ? 'tour' : 'cab',
      destination,
      duration,
      price,
      photo,
    });
    setShowModal(true);
  };

  return (
    <div className="animate-in mx-auto max-w-7xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-black text-zinc-900 sm:text-5xl dark:text-white">
          {activeTab === 'tours' ? 'Tour Packages' : 'Cab Trip Plans'}
        </h1>
        <p className="text-zinc-550 mx-auto max-w-xl text-sm font-light dark:text-zinc-400">
          {activeTab === 'tours'
            ? 'Handpicked premium holiday packages, tailored for absolute comfort and unforgettable travel experiences.'
            : 'Direct cab routes and custom travel options with professional drivers. Slogan: ટ્રીપ તમારી કાર અમારી (Trip Tamari, Car Amari).'}
        </p>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-amber-400" />
      </div>

      {/* Tab Switcher */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl border border-zinc-200 bg-zinc-100 p-1 shadow-inner dark:border-zinc-800 dark:bg-zinc-900">
          <button
            type="button"
            onClick={() => setActiveTab('tours')}
            className={`cursor-pointer rounded-xl px-6 py-2.5 text-xs font-bold transition-all duration-200 ${
              activeTab === 'tours'
                ? 'bg-amber-400 text-zinc-950 shadow-md'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            Tour Packages
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cabs')}
            className={`flex cursor-pointer items-center gap-1.5 rounded-xl px-6 py-2.5 text-xs font-bold transition-all duration-200 ${
              activeTab === 'cabs'
                ? 'bg-amber-400 text-zinc-950 shadow-md'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <LuCar size={14} /> Cab Trip Plans
          </button>
        </div>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {(activeTab === 'tours' ? plans : cabPlansToDisplay).map((plan: any, i: number) => {
          const planId = plan.id || plan._id || `plan-${i}`;
          const duration = plan.duration || (plan.days ? `${plan.days} Days / ${plan.nights} Nights` : null);
          const destination = plan.destination || plan.tripRoute;
          const title = plan.title || plan.packageName;
          const photo =
            plan.photo ||
            plan.imageUrl ||
            'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80';
          const price = (plan.price || plan.pricePerPerson || 0).toLocaleString('en-IN');

          return (
            <div
              key={planId}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md transition-all hover:border-amber-400/30 dark:border-zinc-800/85 dark:bg-zinc-900 dark:shadow-lg"
            >
              {/* Cover photo */}
              <div className="relative aspect-video overflow-hidden bg-zinc-800">
                <img
                  src={photo}
                  alt={title}
                  onError={(e: any) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                {duration && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-xs font-bold text-amber-400 backdrop-blur-md">
                    <LuClock size={12} />
                    {duration}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-grow flex-col justify-between space-y-6 p-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    {destination && (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest text-amber-500 uppercase dark:text-amber-400/80">
                        <LuMapPin size={12} />
                        {destination}
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-zinc-900 transition-colors group-hover:text-amber-500 dark:text-white dark:group-hover:text-amber-400">
                      {title}
                    </h3>
                  </div>

                  <p className="text-zinc-650 text-xs leading-relaxed font-light dark:text-zinc-400">
                    {plan.description || ''}
                  </p>

                  {/* Highlights */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-zinc-555 flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase dark:text-zinc-500">
                      <LuInfo size={11} className="text-amber-400" />{' '}
                      {activeTab === 'tours' ? 'Package Highlights' : 'Service Highlights'}
                    </span>
                    <div className="grid grid-cols-1 gap-1">
                      {(plan.highlights || ['Comfortable journey', 'Professional driver'])
                        .slice(0, 3)
                        .map((item: string, idx: number) => (
                          <span
                            key={idx}
                            className="flex items-center gap-2 text-xs font-light text-zinc-700 dark:text-zinc-300"
                          >
                            <LuCheck
                              size={12}
                              className="flex-shrink-0 text-amber-500 dark:text-amber-400"
                            />
                            {item}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="border-zinc-150 flex items-center justify-between border-t pt-4 dark:border-zinc-800">
                  <div>
                    <span className="text-zinc-555 block text-[10px] font-semibold tracking-wider uppercase dark:text-zinc-500">
                      {activeTab === 'tours' ? 'Price Per Person' : 'Price Starts At'}
                    </span>
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">
                      ₹{price}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenInquiry(plan)}
                    className="text-zinc-955 cursor-pointer rounded-xl bg-amber-400 px-4 py-2.5 text-xs font-bold shadow-lg shadow-amber-400/10 transition-all hover:bg-amber-300"
                  >
                    Book / Enquire
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Booking Inquiry Modal ── */}
      <InquiryModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedItem(null);
        }}
        item={selectedItem}
      />
    </div>
  );
};
export default TravelPlans;
