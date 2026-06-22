import { Outlet } from "react-router-dom";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";

export const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 selection:bg-amber-400 selection:text-zinc-950 font-sans transition-colors duration-200">
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
