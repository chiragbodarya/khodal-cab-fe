import { useState } from 'react';
import { useGetGalleryQuery } from '../redux/slices/galleryApiSlice';
import {
  LuImage,
  LuMapPin,
  LuX,
  LuStar,
  LuMessageSquare,
  LuHeart,
  LuChevronLeft,
  LuChevronRight,
} from 'react-icons/lu';

interface GalleryItem {
  id: string;
  title: string;
  category: 'bus' | 'cab' | 'destination' | string;
  photo: string;
  location?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'g1',
    title: 'Luxury sleeper bus interior',
    category: 'bus',
    photo:
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
    location: 'Surat Terminal',
  },
  {
    id: 'g2',
    title: 'Touring coach on highway',
    category: 'bus',
    photo:
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
    location: 'Gujarat Highway',
  },
  {
    id: 'g3',
    title: 'Premium Innova Crysta Cab',
    category: 'cab',
    photo:
      'https://images.unsplash.com/photo-1494976388531-d10580905c35?auto=format&fit=crop&w=800&q=80',
    location: 'Surat Airport',
  },
  {
    id: 'g4',
    title: 'Munnar Tea Gardens Tour',
    category: 'destination',
    photo:
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
    location: 'Munnar, Kerala',
  },
  {
    id: 'g5',
    title: 'Taj Mahal Agra Tour Package',
    category: 'destination',
    photo:
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    location: 'Agra, Uttar Pradesh',
  },
  {
    id: 'g6',
    title: 'Premium Sedan Cab Dzire',
    category: 'cab',
    photo:
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80',
    location: 'Mumbai Expressway',
  },
  {
    id: 'g7',
    title: 'Himalayan Snow Valley Tour',
    category: 'destination',
    photo:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    location: 'Manali, Himachal Pradesh',
  },
  {
    id: 'g8',
    title: 'Luxury MPV Ertiga Cab',
    category: 'cab',
    photo:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    location: 'Ahmedabad Highway',
  },
  {
    id: 'g9',
    title: 'Ertiga & Innova Fleet ready',
    category: 'cab',
    photo:
      'https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=800&q=80',
    location: 'Khodel Cab Hub',
  },
];

const REVIEWS = [
  {
    name: 'Jatin Patel',
    rating: 5,
    date: '2 days ago',
    comment:
      'Extremely reliable cab service! We booked Surat to Mumbai Innova Crysta. Driver was very professional and route navigation was smooth.',
    source: 'Google Local Guide',
  },
  {
    name: 'Nikunj Bodarya',
    rating: 5,
    date: '1 week ago',
    comment:
      'Excellent experience. The bus seats were super clean and comfortable. Tolls and routes are very well managed. Highly recommended!',
    source: 'Verified Customer',
  },
  {
    name: 'Pooja Mehta',
    rating: 5,
    date: '3 weeks ago',
    comment:
      'We used Khodel Travels for our family Kerala tour package. Houseboat stay, hotel bookings, and vehicle transfers were outstanding.',
    source: 'Google Review',
  },
  {
    name: 'Rajesh Kumar',
    rating: 5,
    date: '1 month ago',
    comment:
      'Best cab rates for Surat to Ahmedabad round trips. The sedan was neat, and air conditioning worked perfectly. Will book again.',
    source: 'Google Local Guide',
  },
];

export const Gallery = () => {
  const { data: liveGalleryData } = useGetGalleryQuery();
  const rawItems = (liveGalleryData?.data as any[]) || [];
  const liveItems: GalleryItem[] = rawItems.map((item: any) => ({
    id: String(item.id || item._id),
    title: item.title || item.caption || 'Khodel Showcase',
    category: item.category || 'bus',
    photo: item.imageUrl || item.photo || '',
    location: item.location || '',
  }));

  const allItems = liveItems.length > 0 ? liveItems : GALLERY_ITEMS;

  const [filter, setFilter] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const prevReview = () => {
    setCurrentReviewIndex(prev => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentReviewIndex(prev => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  };

  const filteredItems = allItems.filter(item => filter === 'all' || item.category === filter);

  return (
    <div className="animate-in mx-auto max-w-7xl space-y-16 px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-3 text-center">
        <h1 className="text-3xl font-black text-zinc-900 sm:text-5xl dark:text-white">
          Photo Gallery
        </h1>
        <p className="text-zinc-550 mx-auto max-w-xl text-sm font-light dark:text-zinc-400">
          Explore visual stories of our premium luxury buses, cabs, tour fleets, and scenic holiday
          destinations.
        </p>
        <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-amber-400" />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { key: 'all', label: 'All Photos' },
          { key: 'bus', label: 'Buses & Coaches' },
          { key: 'cab', label: 'Cabs & Cars' },
          { key: 'destination', label: 'Destinations' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`cursor-pointer rounded-xl border px-5 py-2.5 text-xs font-bold tracking-wider uppercase transition-all ${
              filter === tab.key
                ? 'border-amber-400 bg-amber-400 text-zinc-950 shadow-md shadow-amber-400/10'
                : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredItems.map(item => (
          <div
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="group relative aspect-[4/3] cursor-pointer overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 shadow-md transition-all hover:border-amber-400/35 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
          >
            <img
              src={item.photo}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-103"
            />
            {/* Overlay Info */}
            <div className="absolute inset-0 flex flex-col justify-end space-y-1 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent p-5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-amber-400 uppercase">
                <LuImage size={11} /> {item.category}
              </span>
              <h3 className="truncate text-sm font-bold text-white">{item.title}</h3>
              {item.location && (
                <span className="flex items-center gap-1 text-[10px] font-light text-zinc-300">
                  <LuMapPin size={10} className="text-amber-400" /> {item.location}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Google Reviews Section ── */}
      <section className="space-y-8 rounded-3xl border border-zinc-200 bg-zinc-50 p-8 sm:p-12 dark:border-zinc-800/80 dark:bg-zinc-900/40">
        <div className="flex flex-col items-center justify-between gap-6 border-b border-zinc-200/80 pb-6 md:flex-row dark:border-zinc-800">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="flex items-center justify-center gap-2.5 text-2xl font-black text-zinc-900 sm:text-3xl md:justify-start dark:text-white">
              <LuMessageSquare className="text-amber-400" /> Customer Google Reviews
            </h2>
            <p className="text-zinc-550 text-xs font-light sm:text-sm dark:text-zinc-400">
              See what our travelers say about their luxury coach and cab journeys.
            </p>
          </div>
          {/* Average Rating Block */}
          <div className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white px-6 py-3 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-950">
            <div className="text-center">
              <span className="block text-3xl font-black text-zinc-900 dark:text-white">4.9</span>
              <span className="text-zinc-450 text-[9px] font-bold tracking-wider uppercase dark:text-zinc-500">
                Out of 5
              </span>
            </div>
            <div className="h-10 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-1">
              <div className="text-amber-450 flex">
                {[...Array(5)].map((_, i) => (
                  <LuStar key={i} size={15} fill="currentColor" className="text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] font-medium text-zinc-500">Based on 342+ reviews</span>
            </div>
          </div>
        </div>
        {/* Swiper Review Container */}
        <div className="relative mx-auto flex max-w-2xl items-center md:px-12">
          {/* Desktop Left Button */}
          <button
            type="button"
            onClick={prevReview}
            className="text-zinc-650 absolute top-1/2 left-0 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white p-2.5 shadow-md transition-all hover:border-amber-400/30 hover:text-amber-400 md:flex dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
            title="Previous Review"
          >
            <LuChevronLeft size={18} />
          </button>

          {/* Current Review Card */}
          <div className="flex min-h-[180px] w-full flex-col justify-between space-y-4 rounded-3xl border border-zinc-200/85 bg-white p-6 shadow-md transition-all duration-300 sm:p-8 dark:border-zinc-800/85 dark:bg-zinc-950">
            <div className="space-y-3">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-sm font-black text-amber-500">
                    {REVIEWS[currentReviewIndex].name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm leading-tight font-bold text-zinc-800 dark:text-white">
                      {REVIEWS[currentReviewIndex].name}
                    </h4>
                    <span className="text-[10px] font-light text-zinc-500">
                      {REVIEWS[currentReviewIndex].date}
                    </span>
                  </div>
                </div>
                <span className="border-zinc-150 text-zinc-505 self-start rounded border bg-zinc-50 px-2.5 py-1 text-[9px] font-bold tracking-wider uppercase sm:self-auto dark:border-zinc-800 dark:bg-zinc-900">
                  {REVIEWS[currentReviewIndex].source}
                </span>
              </div>
              <div className="text-amber-450 flex">
                {[...Array(REVIEWS[currentReviewIndex].rating)].map((_, idx) => (
                  <LuStar key={idx} size={13} fill="currentColor" className="text-amber-400" />
                ))}
              </div>
              <p className="text-zinc-650 text-xs leading-relaxed font-light italic sm:text-sm dark:text-zinc-400">
                "{REVIEWS[currentReviewIndex].comment}"
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-zinc-100 pt-3 text-[10px] text-zinc-500 dark:border-zinc-900">
              <span className="flex items-center gap-1 text-red-400/80">
                <LuHeart size={10} fill="currentColor" /> Helpful Review
              </span>
              <span>Verified Customer</span>
            </div>
          </div>

          {/* Desktop Right Button */}
          <button
            type="button"
            onClick={nextReview}
            className="text-zinc-650 absolute top-1/2 right-0 hidden -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-zinc-200 bg-white p-2.5 shadow-md transition-all hover:border-amber-400/30 hover:text-amber-400 md:flex dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
            title="Next Review"
          >
            <LuChevronRight size={18} />
          </button>
        </div>

        {/* Mobile controls & Indicator Dots */}
        <div className="flex items-center justify-center gap-6 pt-2">
          <button
            type="button"
            onClick={prevReview}
            className="border-zinc-205 dark:border-zinc-850 text-zinc-655 flex cursor-pointer items-center justify-center rounded-xl border bg-white p-2 shadow-sm transition-all hover:border-amber-400/20 hover:text-amber-400 md:hidden dark:bg-zinc-950 dark:text-zinc-400"
            title="Previous Review"
          >
            <LuChevronLeft size={16} />
          </button>

          <div className="flex justify-center gap-2">
            {REVIEWS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentReviewIndex(idx)}
                className={`h-2 w-2 cursor-pointer rounded-full transition-all ${
                  idx === currentReviewIndex
                    ? 'w-5 bg-amber-400'
                    : 'bg-zinc-300 hover:bg-zinc-400 dark:bg-zinc-700'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextReview}
            className="border-zinc-205 dark:border-zinc-850 text-zinc-655 flex cursor-pointer items-center justify-center rounded-xl border bg-white p-2 shadow-sm transition-all hover:border-amber-400/20 hover:text-amber-400 md:hidden dark:bg-zinc-950 dark:text-zinc-400"
            title="Next Review"
          >
            <LuChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* ── Photo Lightbox Modal ── */}
      {activePhoto && (
        <div className="animate-in fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 p-4 backdrop-blur-md">
          <button
            onClick={() => setActivePhoto(null)}
            className="text-zinc-450 absolute top-6 right-6 cursor-pointer rounded-full border border-zinc-800 bg-zinc-900 p-2 transition-colors hover:text-white"
            title="Close Lightbox"
          >
            <LuX size={20} />
          </button>

          <div className="flex w-full max-w-4xl flex-col items-center space-y-4">
            <div className="relative max-h-[75vh] overflow-hidden rounded-2xl border border-zinc-800">
              <img
                src={activePhoto.photo}
                alt={activePhoto.title}
                className="h-auto max-h-[75vh] w-full rounded-2xl object-contain"
              />
            </div>
            <div className="space-y-1 text-center">
              <h3 className="text-lg font-bold text-white">{activePhoto.title}</h3>
              {activePhoto.location && (
                <p className="flex items-center justify-center gap-1 text-xs font-light text-amber-400">
                  <LuMapPin size={12} /> {activePhoto.location}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
