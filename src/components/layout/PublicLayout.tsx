import { Outlet } from 'react-router-dom';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';

export const PublicLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-zinc-900 transition-colors duration-200 selection:bg-amber-400 selection:text-zinc-950 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Navbar */}
      <PublicHeader />

      {/* Main Content Area */}
      <main className="flex-grow pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
};
export default PublicLayout;
