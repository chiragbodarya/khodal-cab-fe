import { useNavigate } from 'react-router-dom';
import { LuArrowLeft } from 'react-icons/lu';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 p-4">
      <div className="max-w-sm text-center">
        <p className="mb-4 text-8xl leading-none font-black text-yellow-400">404</p>
        <h1 className="mb-2 text-2xl font-bold text-white">Page not found</h1>
        <p className="mb-8 text-sm leading-relaxed text-zinc-500">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-yellow-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-yellow-400/20 transition-all duration-200 hover:bg-yellow-300 active:scale-95"
        >
          <LuArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};
