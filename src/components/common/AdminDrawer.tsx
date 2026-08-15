import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { LuX } from 'react-icons/lu';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: string; // e.g. 'max-w-xl', 'max-w-2xl'
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-xl',
}) => {
  // Prevent body scrolling and handle escape key when drawer is open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] overflow-hidden">
      {/* Backdrop overlay with blur */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300 ease-out"
        aria-hidden="true"
      />

      {/* Drawer Panel Container */}
      <div className="fixed inset-y-0 right-0 flex h-full max-w-full pl-6 pointer-events-none">
        <aside
          className={`pointer-events-auto relative flex h-full h-[100dvh] w-screen ${maxWidth} flex-col border-l border-zinc-800 bg-zinc-900 shadow-2xl transition-transform duration-300 ease-in-out`}
        >
          {/* Header */}
          <div className="flex flex-shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-900 px-6 py-5">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">{title}</h2>
              {subtitle && <p className="mt-0.5 text-xs text-zinc-400 font-light">{subtitle}</p>}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 p-2 text-zinc-400 transition-colors hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
              title="Close panel (Esc)"
            >
              <LuX size={18} />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 text-zinc-300">
            {children}
          </div>
        </aside>
      </div>
    </div>,
    document.body
  );
};
export default AdminDrawer;
