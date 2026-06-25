import { useState } from "react";
import { LuImage, LuMapPin, LuX, LuStar, LuMessageSquare, LuHeart, LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface GalleryItem {
  id: string;
  title: string;
  category: "bus" | "cab" | "destination";
  photo: string;
  location?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g1",
    title: "Luxury sleeper bus interior",
    category: "bus",
    photo: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80",
    location: "Surat Terminal"
  },
  {
    id: "g2",
    title: "Touring coach on highway",
    category: "bus",
    photo: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80",
    location: "Gujarat Highway"
  },
  {
    id: "g3",
    title: "Premium Innova Crysta Cab",
    category: "cab",
    photo: "https://images.unsplash.com/photo-1494976388531-d10580905c35?auto=format&fit=crop&w=800&q=80",
    location: "Surat Airport"
  },
  {
    id: "g4",
    title: "Munnar Tea Gardens Tour",
    category: "destination",
    photo: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80",
    location: "Munnar, Kerala"
  },
  {
    id: "g5",
    title: "Taj Mahal Agra Tour Package",
    category: "destination",
    photo: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80",
    location: "Agra, Uttar Pradesh"
  },
  {
    id: "g6",
    title: "Premium Sedan Cab Dzire",
    category: "cab",
    photo: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
    location: "Mumbai Expressway"
  },
  {
    id: "g7",
    title: "Himalayan Snow Valley Tour",
    category: "destination",
    photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    location: "Manali, Himachal Pradesh"
  },
  {
    id: "g8",
    title: "Luxury MPV Ertiga Cab",
    category: "cab",
    photo: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    location: "Ahmedabad Highway"
  },
  {
    id: "g9",
    title: "Ertiga & Innova Fleet ready",
    category: "cab",
    photo: "https://images.unsplash.com/photo-1485291571150-772bcfc10da5?auto=format&fit=crop&w=800&q=80",
    location: "Khodel Cab Hub"
  }
];

const REVIEWS = [
  {
    name: "Jatin Patel",
    rating: 5,
    date: "2 days ago",
    comment: "Extremely reliable cab service! We booked Surat to Mumbai Innova Crysta. Driver was very professional and route navigation was smooth.",
    source: "Google Local Guide"
  },
  {
    name: "Nikunj Bodarya",
    rating: 5,
    date: "1 week ago",
    comment: "Excellent experience. The bus seats were super clean and comfortable. Tolls and routes are very well managed. Highly recommended!",
    source: "Verified Customer"
  },
  {
    name: "Pooja Mehta",
    rating: 5,
    date: "3 weeks ago",
    comment: "We used Khodel Travels for our family Kerala tour package. Houseboat stay, hotel bookings, and vehicle transfers were outstanding.",
    source: "Google Review"
  },
  {
    name: "Rajesh Kumar",
    rating: 5,
    date: "1 month ago",
    comment: "Best cab rates for Surat to Ahmedabad round trips. The sedan was neat, and air conditioning worked perfectly. Will book again.",
    source: "Google Local Guide"
  }
];

export const Gallery = () => {
  const [filter, setFilter] = useState<string>("all");
  const [activePhoto, setActivePhoto] = useState<GalleryItem | null>(null);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const prevReview = () => {
    setCurrentReviewIndex((prev) => (prev === 0 ? REVIEWS.length - 1 : prev - 1));
  };

  const nextReview = () => {
    setCurrentReviewIndex((prev) => (prev === REVIEWS.length - 1 ? 0 : prev + 1));
  };

  const filteredItems = GALLERY_ITEMS.filter(
    (item) => filter === "all" || item.category === filter
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 animate-in">
      {/* Header */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 dark:text-white">Photo Gallery</h1>
        <p className="text-zinc-550 dark:text-zinc-400 text-sm max-w-xl mx-auto font-light">
          Explore visual stories of our premium luxury buses, cabs, tour fleets, and scenic holiday destinations.
        </p>
        <div className="w-16 h-1 bg-amber-400 mx-auto rounded-full mt-4" />
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center flex-wrap gap-2">
        {[
          { key: "all", label: "All Photos" },
          { key: "bus", label: "Buses & Coaches" },
          { key: "cab", label: "Cabs & Cars" },
          { key: "destination", label: "Destinations" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border cursor-pointer ${
              filter === tab.key
                ? "bg-amber-400 border-amber-400 text-zinc-950 shadow-md shadow-amber-400/10"
                : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 cursor-pointer hover:border-amber-400/35 transition-all shadow-md dark:shadow-none"
          >
            <img
              src={item.photo}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            {/* Overlay Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider flex items-center gap-1">
                <LuImage size={11} /> {item.category}
              </span>
              <h3 className="text-white font-bold text-sm truncate">{item.title}</h3>
              {item.location && (
                <span className="text-zinc-300 text-[10px] flex items-center gap-1 font-light">
                  <LuMapPin size={10} className="text-amber-400" /> {item.location}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ── Google Reviews Section ── */}
      <section className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-8 sm:p-12 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-zinc-200/80 dark:border-zinc-800 pb-6">
          <div className="text-center md:text-left space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white flex items-center justify-center md:justify-start gap-2.5">
              <LuMessageSquare className="text-amber-400" /> Customer Google Reviews
            </h2>
            <p className="text-zinc-550 dark:text-zinc-400 text-xs sm:text-sm font-light">
              See what our travelers say about their luxury coach and cab journeys.
            </p>
          </div>
          {/* Average Rating Block */}
          <div className="flex items-center gap-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800/80 px-6 py-3 rounded-2xl shadow-sm">
            <div className="text-center">
              <span className="text-3xl font-black text-zinc-900 dark:text-white block">4.9</span>
              <span className="text-[9px] uppercase font-bold text-zinc-450 dark:text-zinc-500 tracking-wider">Out of 5</span>
            </div>
            <div className="h-10 w-[1px] bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-1">
              <div className="flex text-amber-450">
                {[...Array(5)].map((_, i) => (
                  <LuStar key={i} size={15} fill="currentColor" className="text-amber-400" />
                ))}
              </div>
              <span className="text-[10px] text-zinc-500 font-medium">Based on 342+ reviews</span>
            </div>
          </div>
        </div>
                {/* Swiper Review Container */}
        <div className="relative max-w-2xl mx-auto md:px-12 flex items-center">
          {/* Desktop Left Button */}
          <button
            type="button"
            onClick={prevReview}
            className="absolute left-0 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:text-amber-400 hover:border-amber-400/30 transition-all cursor-pointer shadow-md hidden md:flex items-center justify-center"
            title="Previous Review"
          >
            <LuChevronLeft size={18} />
          </button>

          {/* Current Review Card */}
          <div className="w-full min-h-[180px] p-6 sm:p-8 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200/85 dark:border-zinc-800/85 shadow-md flex flex-col justify-between space-y-4 transition-all duration-300">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-500 flex items-center justify-center font-black text-sm flex-shrink-0">
                    {REVIEWS[currentReviewIndex].name[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-zinc-800 dark:text-white leading-tight">{REVIEWS[currentReviewIndex].name}</h4>
                    <span className="text-[10px] text-zinc-500 font-light">{REVIEWS[currentReviewIndex].date}</span>
                  </div>
                </div>
                <span className="text-[9px] px-2.5 py-1 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-150 dark:border-zinc-800 text-zinc-505 font-bold uppercase tracking-wider self-start sm:self-auto">
                  {REVIEWS[currentReviewIndex].source}
                </span>
              </div>
              <div className="flex text-amber-450">
                {[...Array(REVIEWS[currentReviewIndex].rating)].map((_, idx) => (
                  <LuStar key={idx} size={13} fill="currentColor" className="text-amber-400" />
                ))}
              </div>
              <p className="text-zinc-650 dark:text-zinc-400 text-xs sm:text-sm font-light leading-relaxed italic">
                "{REVIEWS[currentReviewIndex].comment}"
              </p>
            </div>
            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center text-[10px] text-zinc-500">
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
            className="absolute right-0 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:text-amber-400 hover:border-amber-400/30 transition-all cursor-pointer shadow-md hidden md:flex items-center justify-center"
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
            className="p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-205 dark:border-zinc-850 text-zinc-655 dark:text-zinc-400 hover:text-amber-400 hover:border-amber-400/20 transition-all cursor-pointer md:hidden shadow-sm flex items-center justify-center"
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
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentReviewIndex
                    ? "bg-amber-400 w-5"
                    : "bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400"
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={nextReview}
            className="p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-205 dark:border-zinc-850 text-zinc-655 dark:text-zinc-400 hover:text-amber-400 hover:border-amber-400/20 transition-all cursor-pointer md:hidden shadow-sm flex items-center justify-center"
            title="Next Review"
          >
            <LuChevronRight size={16} />
          </button>
        </div>
      </section>

      {/* ── Photo Lightbox Modal ── */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/90 backdrop-blur-md animate-in">
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-450 hover:text-white cursor-pointer transition-colors"
            title="Close Lightbox"
          >
            <LuX size={20} />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center space-y-4">
            <div className="relative max-h-[75vh] overflow-hidden rounded-2xl border border-zinc-800">
              <img
                src={activePhoto.photo}
                alt={activePhoto.title}
                className="w-full h-auto max-h-[75vh] object-contain rounded-2xl"
              />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-white font-bold text-lg">{activePhoto.title}</h3>
              {activePhoto.location && (
                <p className="text-amber-400 text-xs flex items-center justify-center gap-1 font-light">
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
