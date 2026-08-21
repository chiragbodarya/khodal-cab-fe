import { Link } from 'react-router-dom';
import { LuMail, LuPhone, LuMapPin } from 'react-icons/lu';
import { FaWhatsapp, FaInstagram, FaFacebookF, FaXTwitter } from 'react-icons/fa6';
import { COMPANY_DETAILS } from '../../utils/constants';

export const PublicFooter = () => {
  return (
    <footer className="border-t border-zinc-900 bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Col */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <img
                src="/favicon.png"
                alt="Khodal Cab Logo"
                className="shadow-amber-550/10 h-8 w-8 rounded-lg object-contain shadow-md"
              />
              <span className="text-lg font-bold tracking-tight text-white">
                Khodal <span className="text-amber-400">Cab</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-zinc-500">
              Premium travel company providing top-tier luxury buses, coaches, and mini-vans for
              groups, corporate tours, and family holidays.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://wa.me/${COMPANY_DETAILS.phoneCab.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-800/80 bg-zinc-900 text-zinc-400 shadow-sm transition-all hover:border-amber-400/35 hover:text-amber-400"
                title="WhatsApp"
              >
                <FaWhatsapp size={15} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-800/80 bg-zinc-900 text-zinc-400 shadow-sm transition-all hover:border-amber-400/35 hover:text-amber-400"
                title="Instagram"
              >
                <FaInstagram size={15} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-800/80 bg-zinc-900 text-zinc-400 shadow-sm transition-all hover:border-amber-400/35 hover:text-amber-400"
                title="Facebook"
              >
                <FaFacebookF size={13} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-zinc-800/80 bg-zinc-900 text-zinc-400 shadow-sm transition-all hover:border-amber-400/35 hover:text-amber-400"
                title="X (Twitter)"
              >
                <FaXTwitter size={13} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="transition-colors hover:text-amber-400">
                  Home Page
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="transition-colors hover:text-amber-400">
                  Our Fleet
                </Link>
              </li>
              <li>
                <Link to="/plans" className="transition-colors hover:text-amber-400">
                  Destinations
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="transition-colors hover:text-amber-400">
                  Travel Blogs
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="transition-colors hover:text-amber-400">
                  Photo Gallery
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition-colors hover:text-amber-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Get In Touch
            </h3>
            <ul className="space-y-3 text-xs">
              <li className="flex items-center gap-2.5">
                <LuMapPin size={14} className="flex-shrink-0 text-amber-400" />
                <span>{COMPANY_DETAILS.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <LuPhone size={14} className="flex-shrink-0 text-amber-400" />
                <span>{COMPANY_DETAILS.phoneCab}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <LuMail size={14} className="flex-shrink-0 text-amber-400" />
                <span>{COMPANY_DETAILS.emailInfo}</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Newsletter
            </h3>
            <p className="mb-3 text-xs text-zinc-500">
              Subscribe to receive destination guides and promotional deals.
            </p>
            <form onSubmit={e => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white transition-colors focus:border-amber-400/50 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="text-zinc-955 cursor-pointer rounded-lg bg-amber-400 px-4 py-2 text-xs font-semibold transition-colors hover:bg-amber-300"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-zinc-900/80" />

        {/* Bottom */}
        <div className="flex flex-col items-center justify-between gap-4 text-[11px] text-zinc-500 sm:flex-row">
          <div>
            © {new Date().getFullYear()} Khodal Cab. All rights reserved. Built for travelers.
          </div>
        </div>
      </div>
    </footer>
  );
};
