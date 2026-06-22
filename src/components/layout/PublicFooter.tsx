import { Link } from "react-router-dom";
import { LuCompass, LuMail, LuPhone, LuMapPin } from "react-icons/lu";

export const PublicFooter = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center shadow-md shadow-amber-500/10">
                <LuCompass size={18} className="text-zinc-950" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Golden<span className="text-amber-400">Way</span>
              </span>
            </Link>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Premium travel company providing top-tier luxury buses, coaches, and mini-vans for groups, corporate tours, and family holidays.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/vehicles" className="hover:text-amber-400 transition-colors">Our Fleet</Link>
              </li>
              <li>
                <Link to="/plans" className="hover:text-amber-400 transition-colors">Destinations</Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-amber-400 transition-colors">Travel Blogs</Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Get In Touch</h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2.5">
                <LuMapPin size={14} className="text-amber-400 flex-shrink-0" />
                <span>102 Golden Arcade, Tourism Sector, City Center</span>
              </li>
              <li className="flex items-center gap-2.5">
                <LuPhone size={14} className="text-amber-400 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2.5">
                <LuMail size={14} className="text-amber-400 flex-shrink-0" />
                <span>info@goldenwaytravels.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Newsletter</h3>
            <p className="text-xs text-zinc-500 mb-3">Subscribe to receive destination guides and promotional deals.</p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-zinc-900 border border-zinc-800 text-white text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-amber-400/50 transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-zinc-900/80" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} GoldenWay Travels. All rights reserved. Built for travelers.
          </div>
        </div>
      </div>
    </footer>
  );
};
