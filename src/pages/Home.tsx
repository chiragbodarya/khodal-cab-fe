import { Link, useNavigate } from 'react-router-dom';
import { useGetTourPlansQuery } from '../redux/slices/tourApiSlice';
import { useGetVehiclesQuery } from '../redux/slices/vehicleApiSlice';
import { useGetBlogsQuery } from '../redux/slices/blogApiSlice';
import {
  LuCompass,
  LuArrowRight,
  LuShield,
  LuCalendar,
  LuAward,
  LuBus,
  LuCar,
  LuCheck,
  LuPhoneCall,
} from 'react-icons/lu';
import { COMPANY_DETAILS, CAB_FLEET, CAB_ROUTES, CAB_SERVICES } from '../utils/constants';

export const Home = () => {
  const { data: tourData } = useGetTourPlansQuery({ limit: 3 });
  const { data: vehicleData } = useGetVehiclesQuery({ limit: 3 });
  const { data: blogData } = useGetBlogsQuery({ limit: 2 });

  const featuredPlans = (tourData?.data as any[])?.slice(0, 3) || [];
  const vehicles = (vehicleData?.data as any[])?.slice(0, 3) || [];
  const recentBlogs = (blogData?.data as any[])?.slice(0, 2) || [];

  const navigate = useNavigate();

  return (
    <div className="space-y-20 pb-20">
      {/* ── Hero Section ── */}
      <section className="relative flex h-[85vh] items-center justify-center overflow-hidden">
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
        <div className="relative z-10 mx-auto max-w-5xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-amber-400 uppercase backdrop-blur-md">
            <LuCompass className="animate-spin-slow" /> Journey Beyond Expectations
          </div>
          <h1 className="text-4xl leading-none font-black tracking-tight text-white sm:text-6xl">
            Travel in Luxury. <br />
            Explore with <span className="text-amber-400">Khodel Travels</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed font-light text-zinc-200 sm:text-lg">
            Premium travel services with a world-class fleet of luxury buses, coaches, and
            customizable packages to make every journey memorable.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Link
              to="/plans"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-400 px-8 py-3.5 font-bold text-zinc-950 transition-all hover:bg-amber-300 hover:shadow-lg hover:shadow-amber-400/20 sm:w-auto"
            >
              Explore Destinations
              <LuArrowRight size={18} />
            </Link>
            <Link
              to="/vehicles"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 font-semibold text-white backdrop-blur-sm transition-all hover:border-amber-400/50 hover:text-amber-400 sm:w-auto"
            >
              <LuBus size={18} />
              View Our Fleet
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats / Benefits Section ── */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-amber-400/30 dark:border-zinc-800/80 dark:bg-zinc-900 dark:shadow-none">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
              <LuAward size={24} />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-bold text-zinc-900 dark:text-white">
                Premium Comfort
              </h3>
              <p className="text-zinc-650 text-sm leading-relaxed font-light dark:text-zinc-400">
                Ergonomic reclining seats, spacious legroom, air-conditioning, and onboard
                entertainment.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-amber-400/30 dark:border-zinc-800/80 dark:bg-zinc-900 dark:shadow-none">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
              <LuShield size={24} />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-bold text-zinc-900 dark:text-white">Safety First</h3>
              <p className="text-zinc-650 text-sm leading-relaxed font-light dark:text-zinc-400">
                Experienced, certified drivers and GPS-tracked modern fleet undergoing daily
                inspection.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-amber-400/30 dark:border-zinc-800/80 dark:bg-zinc-900 dark:shadow-none">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
              <LuCalendar size={24} />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-bold text-zinc-900 dark:text-white">
                Flexible Scheduling
              </h3>
              <p className="text-zinc-650 text-sm leading-relaxed font-light dark:text-zinc-400">
                Easy online inquiries, multiple daily departures, and customizable private charters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Destinations Highlights ── */}
      <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
              Popular Destinations
            </h2>
            <p className="text-sm font-light text-zinc-500 dark:text-zinc-400">
              Explore handpicked tour packages designed for the ultimate experience.
            </p>
          </div>
          <Link
            to="/plans"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-amber-500 transition-colors hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
          >
            All Packages
            <LuArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {featuredPlans.map(plan => (
            <div
              key={plan.id}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md transition-all hover:border-amber-400/30 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={
                    (plan as any).photo ||
                    'https://images.unsplash.com/photo-1599661046289-e31897846e41'
                  }
                  alt={(plan as any).title || plan.packageName}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 rounded-lg border border-zinc-800 bg-zinc-950/80 px-2.5 py-1 text-xs font-semibold text-amber-400 backdrop-blur-md">
                  {(plan as any).duration || `${plan.days} Days / ${plan.nights} Nights`}
                </div>
              </div>
              <div className="flex flex-grow flex-col justify-between space-y-4 p-5">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-widest text-amber-500 uppercase dark:text-amber-400/80">
                    {(plan as any).destination || plan.tripRoute}
                  </span>
                  <h3 className="text-lg leading-snug font-bold text-zinc-900 transition-colors group-hover:text-amber-500 dark:text-white dark:group-hover:text-amber-400">
                    {(plan as any).title || plan.packageName}
                  </h3>
                  <p className="line-clamp-2 text-xs leading-relaxed font-light text-zinc-600 dark:text-zinc-400">
                    {(plan as any).description || ''}
                  </p>
                </div>
                <div className="border-zinc-150 flex items-center justify-between border-t pt-4 dark:border-zinc-800">
                  <div>
                    <span className="text-zinc-555 block text-[10px] font-semibold tracking-wider uppercase dark:text-zinc-500">
                      Price Starts At
                    </span>
                    <span className="text-lg font-bold text-zinc-900 dark:text-white">
                      ₹{((plan as any).price || plan.pricePerPerson || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Link
                    to="/plans"
                    className="cursor-pointer rounded-lg bg-zinc-100 px-3.5 py-2 text-xs font-bold text-zinc-700 transition-all group-hover:bg-amber-400 group-hover:text-zinc-950 dark:bg-zinc-800 dark:text-zinc-300"
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
      <section className="border-y border-zinc-200 bg-zinc-100/60 py-16 transition-colors dark:border-zinc-900 dark:bg-zinc-900/40">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-zinc-900 dark:text-white">Our Fleet</h2>
              <p className="text-sm font-light text-zinc-500 dark:text-zinc-400">
                Travel with style and comfort in our highly maintained modern transport fleet.
              </p>
            </div>
            <Link
              to="/vehicles"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-amber-500 transition-colors hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
            >
              Full Fleet Details
              <LuArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {vehicles.map(v => (
              <div
                key={v.id}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-md transition-all hover:border-amber-400/20 dark:border-zinc-900 dark:bg-zinc-950 dark:shadow-none"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={
                      (v as any).photo ||
                      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'
                    }
                    alt={v.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                  />
                  <div className="absolute bottom-3 left-3 rounded bg-amber-400 px-2 py-1 text-[10px] font-bold tracking-wider text-zinc-950 uppercase">
                    {v.type}
                  </div>
                </div>
                <div className="flex flex-grow flex-col justify-between space-y-4 p-5">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-zinc-900 transition-colors group-hover:text-amber-500 dark:text-white dark:group-hover:text-amber-400">
                      {v.name}
                    </h3>
                    <p className="text-zinc-650 line-clamp-2 text-xs leading-relaxed font-light dark:text-zinc-400">
                      {v.description}
                    </p>
                  </div>
                  <div className="border-zinc-150 flex items-center justify-between border-t pt-4 text-xs text-zinc-500 dark:border-zinc-900">
                    <span>
                      Capacity:{' '}
                      <strong className="text-zinc-700 dark:text-zinc-300">
                        {v.capacity} Seats
                      </strong>
                    </span>
                    <span className="flex gap-1.5">
                      {((v as any).amenities || []).slice(0, 3).map((a: string, i: number) => (
                        <span
                          key={i}
                          className="rounded border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-[10px] text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400"
                        >
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
      <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-xs font-semibold tracking-wider text-amber-400 uppercase">
              <LuCar size={13} /> {COMPANY_DETAILS.name.split(' ')[0]} Cab
            </div>
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
              Premium Cab Services
            </h2>
            <p className="text-zinc-555 text-sm font-semibold text-amber-500 italic dark:text-zinc-400">
              "{COMPANY_DETAILS.slogan}" ({COMPANY_DETAILS.sloganEnglish})
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={`tel:${COMPANY_DETAILS.phoneCab.replace(/\s+/g, '')}`}
              className="text-zinc-955 flex cursor-pointer items-center gap-2 rounded-xl bg-amber-400 px-5 py-2.5 text-sm font-bold shadow-md shadow-amber-400/10 transition-all hover:bg-amber-300"
            >
              <LuPhoneCall size={16} /> Call {COMPANY_DETAILS.phoneCab}
            </a>
            <a
              href={`https://wa.me/${COMPANY_DETAILS.phoneCab.replace(/[^0-9]/g, '')}?text=Hello%20${COMPANY_DETAILS.name.split(' ')[0]}%20Cab,%20I%2520want%2520to%2520book%2520a%2520cab`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white/5 px-5 py-2.5 text-sm backdrop-blur-sm transition-all hover:border-amber-400/35 hover:text-amber-400 dark:border-zinc-800 dark:text-white"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Routes Card */}
          <div className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none">
            <h3 className="flex items-center gap-2 border-b border-zinc-100 pb-3 text-lg font-bold text-zinc-900 dark:border-zinc-800 dark:text-white">
              <span className="block h-6 w-1.5 rounded-full bg-amber-400" /> Popular Cab Routes
            </h3>
            <ul className="space-y-4 text-sm">
              {CAB_ROUTES.map((route, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {route.from}
                  </span>
                  <span className="px-2 font-bold text-amber-400">➔</span>
                  <span
                    className={`font-semibold ${route.special ? 'text-amber-400' : 'text-zinc-800 dark:text-zinc-200'}`}
                  >
                    {route.to}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vehicles Card */}
          <div className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none">
            <h3 className="flex items-center gap-2 border-b border-zinc-100 pb-3 text-lg font-bold text-zinc-900 dark:border-zinc-800 dark:text-white">
              <span className="block h-6 w-1.5 rounded-full bg-amber-400" /> Available Cab Fleet
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {CAB_FLEET.map((car, i) => (
                <div
                  key={i}
                  className="space-y-1 rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-center transition-all hover:border-amber-400/30 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  <span className="block text-[11px] font-bold text-amber-500 uppercase dark:text-amber-400">
                    {car.name}
                  </span>
                  <span className="block truncate text-[10px] font-light text-zinc-500 dark:text-zinc-400">
                    {car.desc}
                  </span>
                  <span className="mt-1 inline-block rounded bg-zinc-100 px-1.5 py-0.5 text-[9px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                    {car.capacity}
                  </span>
                </div>
              ))}
            </div>
            <div className="text-zinc-650 dark:text-zinc-450 rounded-xl border border-amber-400/10 bg-amber-400/5 p-3 text-center text-xs leading-relaxed font-light">
              All vehicles are fully air-conditioned, professionally sanitized, and operated by
              experienced highway drivers.
            </div>
          </div>

          {/* Service Types Card */}
          <div className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800/80 dark:bg-zinc-900/60 dark:shadow-none">
            <h3 className="flex items-center gap-2 border-b border-zinc-100 pb-3 text-lg font-bold text-zinc-900 dark:border-zinc-800 dark:text-white">
              <span className="block h-6 w-1.5 rounded-full bg-amber-400" /> Our Booking Services
            </h3>
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
              {CAB_SERVICES.map((srv, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
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
      <section className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-black text-zinc-900 dark:text-white">
              Travel Guides & Stories
            </h2>
            <p className="text-sm font-light text-zinc-500 dark:text-zinc-400">
              SEO blogs and traveling advice to guide you through your holiday destinations.
            </p>
          </div>
          <Link
            to="/blogs"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-amber-500 transition-colors hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-300"
          >
            Read All Blogs
            <LuArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {recentBlogs.map(blog => (
            <div
              key={blog.id}
              className="group flex cursor-pointer flex-col gap-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:border-amber-400/20 sm:flex-row dark:border-zinc-800/80 dark:bg-zinc-900 dark:shadow-none"
              onClick={() => navigate(`/blogs?id=${blog.id}`)}
            >
              <div className="aspect-[4/3] w-full flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 sm:w-1/3 dark:bg-zinc-800">
                <img
                  src={
                    (blog as any).photo ||
                    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957'
                  }
                  alt={blog.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-103"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between space-y-3 py-1">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-semibold text-zinc-500">
                    <span>By {blog.author}</span>
                    <span>•</span>
                    <span>{blog.date}</span>
                  </div>
                  <h3 className="text-base leading-snug font-bold text-zinc-900 transition-colors group-hover:text-amber-500 dark:text-white dark:group-hover:text-amber-400">
                    {blog.title}
                  </h3>
                  <p className="line-clamp-2 text-xs leading-relaxed font-light text-zinc-600 dark:text-zinc-400">
                    {blog.excerpt}
                  </p>
                </div>
                <div className="flex gap-2">
                  {((blog as any).tags || []).map((t: string, idx: number) => (
                    <span
                      key={idx}
                      className="text-zinc-550 rounded border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-medium dark:border-zinc-700/50 dark:bg-zinc-800 dark:text-zinc-400"
                    >
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
