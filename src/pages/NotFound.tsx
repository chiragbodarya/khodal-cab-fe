import { useNavigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <p className="text-8xl font-black text-yellow-400 mb-4 leading-none">
          404
        </p>
        <h1 className="text-2xl font-bold text-white mb-2">Page not found</h1>
        <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
            bg-yellow-400 text-zinc-950 text-sm font-semibold
            hover:bg-yellow-300 active:scale-95 transition-all duration-200
            cursor-pointer shadow-lg shadow-yellow-400/20"
        >
          <LuArrowLeft size={16} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};