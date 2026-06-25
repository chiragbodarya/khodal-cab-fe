import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPlans, getVehicles, getBlogs, type TravelPlan, type Vehicle, type Blog } from "../utils/storage";
import { LuCompass, LuArrowRight, LuShield, LuCalendar, LuAward, LuBus, LuCar, LuCheck, LuPhoneCall } from "react-icons/lu";
import { COMPANY_DETAILS, CAB_FLEET, CAB_ROUTES, CAB_SERVICES } from "../utils/constants";

export const Home = () => {
  const [featuredPlans, setFeaturedPlans] = useState<TravelPlan[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [recentBlogs, setRecentBlogs] = useState<Blog[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setFeaturedPlans(getPlans().slice(0, 3));
    setVehicles(getVehicles().slice(0, 3));
    setRecentBlogs(getBlogs().slice(0, 2));
  }, []);

  return (
    <div className="space-y-20 pb-20">
      {/* ── Hero Section ── */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Amber Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517760444937-f6397edcbbcd?auto=format&fit=crop&w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-transparent dark:from-zinc-950 dark:via-zinc-950/70" />
        <div className="absolute inset-0 bg-amber-500/10 mix-blend-overlay" />

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 backdrop-blur-md text-amber-400 text-xs font-semibold tracking-wider uppercase">
            <LuCompass className="animate-spin-slow" /> Journey Beyond Expectations
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
            Travel in Luxury. <br />
            Explore with <span className="text-amber-400">Khodel Travels</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-200 max-w-2xl mx-auto font-light leading-relaxed">
            Premium travel services with a world-class fleet of luxury buses, coaches, and customizable packages to make every journey memorable.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/plans"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-400 text-zinc-950 font-bold hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20 transition-all flex items-center justify-center gap-2"
            >
              Explore Destinations
              <LuArrowRight size={18} />
            </Link>
            <Link
              to="/vehicles"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-white/20 hover:border-amber-400/50 hover:text-amber-400 transition-all flex items-center justify-center gap-2 text-white font-semibold backdrop-blur-sm bg-white/5"
            >
              <LuBus size={18} />
              View Our Fleet
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats / Benefits Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 flex gap-4 items-start hover:border-amber-400/30 transition-all shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <LuAward size={24} />
            </div>
            <div>
              <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-1">Premium Comfort</h3>
              <p className="text-zinc-650 dark:text-zinc-400 text-sm font-light leading-relaxed">
                Ergonomic reclining seats, spacious legroom, air-conditioning, and onboard entertainment.
              </p>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 flex gap-4 items-start hover:border-amber-400/30 transition-all shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <LuShield size={24} />
            </div>
            <div>
              <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-1">Safety First</h3>
              <p className="text-zinc-650 dark:text-zinc-400 text-sm font-light leading-relaxed">
                Experienced, certified drivers and GPS-tracked modern fleet undergoing daily inspection.
              </p>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 flex gap-4 items-start hover:border-amber-400/30 transition-all shadow-sm dark:shadow-none">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <LuCalendar size={24} />
            </div>
            <div>
              <h3 className="text-zinc-900 dark:text-white font-bold text-lg mb-1">Flexible Scheduling</h3>
              <p className="text-zinc-650 dark:text-zinc-400 text-sm font-light leading-relaxed">
                Easy online inquiries, multiple daily departures, and customizable private charters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Destinations Highlights ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Popular Destinations</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light">Explore handpicked tour packages designed for the ultimate experience.</p>
          </div>
          <Link
            to="/plans"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors group"
          >
            All Packages
            <LuArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPlans.map((plan) => (
            <div
              key={plan.id}
              className="group rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 overflow-hidden hover:border-amber-400/30 transition-all flex flex-col h-full shadow-md dark:shadow-none"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={plan.photo}
                  alt={plan.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-zinc-950/80 backdrop-blur-md border border-zinc-800 text-xs font-semibold text-amber-400">
                  {plan.duration}
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-amber-500 dark:text-amber-400/80 tracking-widest">
                    {plan.destination}
                  </span>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white leading-snug group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                    {plan.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-xs font-light line-clamp-2 leading-relaxed">
                    {plan.description}
                  </p>
                </div>
                <div className="pt-4 border-t border-zinc-150 dark:border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-zinc-555 dark:text-zinc-500 text-[10px] uppercase tracking-wider block font-semibold">Price Starts At</span>
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">₹{plan.price.toLocaleString("en-IN")}</span>
                  </div>
                  <Link
                    to="/plans"
                    className="px-3.5 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-amber-400 group-hover:text-zinc-950 text-zinc-700 dark:text-zinc-300 font-bold text-xs transition-all cursor-pointer"
                  >
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Vehicle Fleet Highlight ── */}
      <section className="bg-zinc-100/60 dark:bg-zinc-900/40 border-y border-zinc-200 dark:border-zinc-900 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Our Fleet</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light">Travel with style and comfort in our highly maintained modern transport fleet.</p>
            </div>
            <Link
              to="/vehicles"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors group"
            >
              Full Fleet Details
              <LuArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vehicles.map((v) => (
              <div
                key={v.id}
                className="group rounded-2xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 overflow-hidden hover:border-amber-400/20 transition-all flex flex-col h-full shadow-md dark:shadow-none"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={v.photo}
                    alt={v.name}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-amber-400 text-zinc-950 font-bold text-[10px] uppercase tracking-wider">
                    {v.type}
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                      {v.name}
                    </h3>
                    <p className="text-zinc-650 dark:text-zinc-400 text-xs font-light line-clamp-2 leading-relaxed">
                      {v.description}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-zinc-150 dark:border-zinc-900 flex items-center justify-between text-xs text-zinc-500">
                    <span>Capacity: <strong className="text-zinc-700 dark:text-zinc-300">{v.capacity} Seats</strong></span>
                    <span className="flex gap-1.5">
                      {v.amenities.slice(0, 3).map((a, i) => (
                        <span key={i} className="px-1.5 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] text-zinc-600 dark:text-zinc-400">
                          {a}
                        </span>
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cab Services Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold tracking-wider uppercase">
              <LuCar size={13} /> {COMPANY_DETAILS.name.split(" ")[0]} Cab
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Premium Cab Services</h2>
            <p className="text-zinc-555 dark:text-zinc-400 text-sm font-semibold italic text-amber-500">
              "{COMPANY_DETAILS.slogan}" ({COMPANY_DETAILS.sloganEnglish})
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${COMPANY_DETAILS.phoneCab.replace(/\s+/g, "")}`}
              className="px-5 py-2.5 rounded-xl bg-amber-400 text-zinc-955 font-bold hover:bg-amber-300 transition-all flex items-center gap-2 text-sm shadow-md shadow-amber-400/10 cursor-pointer"
            >
              <LuPhoneCall size={16} /> Call {COMPANY_DETAILS.phoneCab}
            </a>
            <a
              href={`https://wa.me/${COMPANY_DETAILS.phoneCab.replace(/[^0-9]/g, "")}?text=Hello%20${COMPANY_DETAILS.name.split(" ")[0]}%20Cab,%20I%2520want%2520to%2520book%2520a%2520cab`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-400/35 hover:text-amber-400 dark:text-white transition-all flex items-center gap-2 text-sm backdrop-blur-sm bg-white/5 cursor-pointer"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Routes Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 space-y-5 shadow-sm dark:shadow-none">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="w-1.5 h-6 rounded-full bg-amber-400 block" /> Popular Cab Routes
            </h3>
            <ul className="space-y-4 text-sm">
              {CAB_ROUTES.map((route, i) => (
                <li key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">{route.from}</span>
                  <span className="text-amber-400 font-bold px-2">➔</span>
                  <span className={`font-semibold ${route.special ? "text-amber-400" : "text-zinc-800 dark:text-zinc-200"}`}>{route.to}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicles Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 space-y-5 shadow-sm dark:shadow-none">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="w-1.5 h-6 rounded-full bg-amber-400 block" /> Available Cab Fleet
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {CAB_FLEET.map((car, i) => (
                <div key={i} className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 space-y-1 text-center hover:border-amber-400/30 transition-all">
                  <span className="block text-[11px] font-bold text-amber-500 dark:text-amber-400 uppercase">{car.name}</span>
                  <span className="block text-[10px] text-zinc-500 dark:text-zinc-400 font-light truncate">{car.desc}</span>
                  <span className="inline-block text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold mt-1">{car.capacity}</span>
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/10 text-xs text-zinc-650 dark:text-zinc-450 text-center font-light leading-relaxed">
              All vehicles are fully air-conditioned, professionally sanitized, and operated by experienced highway drivers.
            </div>
          </div>

          {/* Service Types Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800/80 space-y-5 shadow-sm dark:shadow-none">
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <span className="w-1.5 h-6 rounded-full bg-amber-400 block" /> Our Booking Services
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
              {CAB_SERVICES.map((srv, i) => (
                <li key={i} className="flex items-center gap-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  <span className="w-5 h-5 rounded-full bg-amber-400/10 text-amber-400 flex items-center justify-center flex-shrink-0">
                    <LuCheck size={12} />
                  </span>
                  <span>{srv}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── SEO Blogs Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Travel Guides & Stories</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm font-light">SEO blogs and traveling advice to guide you through your holiday destinations.</p>
          </div>
          <Link
            to="/blogs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-500 dark:text-amber-400 hover:text-amber-600 dark:hover:text-amber-300 transition-colors group"
          >
            Read All Blogs
            <LuArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recentBlogs.map((blog) => (
            <div
              key={blog.id}
              className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 flex flex-col sm:flex-row gap-6 hover:border-amber-400/20 transition-all group cursor-pointer shadow-sm dark:shadow-none"
              onClick={() => navigate(`/blogs?id=${blog.id}`)}
            >
              <div className="w-full sm:w-1/3 aspect-[4/3] rounded-xl overflow-hidden flex-shrink-0 bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={blog.photo}
                  alt={blog.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col justify-between flex-1 py-1 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-semibold">
                    <span>By {blog.author}</span>
                    <span>•</span>
                    <span>{blog.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-xs font-light line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
                <div className="flex gap-2">
                  {blog.tags.map((t, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50 text-zinc-550 dark:text-zinc-400 font-medium">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default Home;
