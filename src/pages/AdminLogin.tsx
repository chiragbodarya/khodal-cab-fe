import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { login } from "../redux/slices/authSlice";
import { LuCompass, LuLock, LuMail, LuArrowLeft } from "react-icons/lu";
import toast from "react-hot-toast";

export const AdminLogin = () => {
  const [email, setEmail] = useState("admin@goldenway.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  // If already logged in, redirect
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate("/backstage/dashboard");
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simple mock auth validation
    setTimeout(() => {
      if (email === "admin@goldenway.com" && password === "admin123") {
        dispatch(
          login({
            id: "admin_01",
            name: "Rajesh Kumar",
            email: "admin@goldenway.com",
            role: "admin",
            avatar: "",
          })
        );
        toast.success("Welcome back, Rajesh! Admin session started.");
        navigate("/backstage/dashboard");
      } else {
        toast.error("Invalid credentials. Try using the default demo credentials.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Back to Home Link */}
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-amber-400 transition-colors"
      >
        <LuArrowLeft size={14} /> Back to public website
      </Link>

      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Glow Element */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-amber-400/5 blur-3xl rounded-full" />

        {/* Brand */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <LuCompass size={24} className="text-zinc-950 animate-spin-slow" />
          </div>
          <h2 className="text-xl font-bold text-white text-center">
            Admin Management Console
          </h2>
          <p className="text-zinc-500 text-xs text-center font-light">
            Sign in to manage fleet photos, routes, and blogs
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-400">Email Address</label>
            <div className="relative">
              <LuMail className="absolute left-3.5 top-3.5 text-zinc-500" size={16} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@goldenway.com"
                className="w-full bg-zinc-950 border border-zinc-800 text-white text-xs pl-10 pr-4 py-3.5 rounded-xl outline-none focus:border-amber-400/50 transition-colors"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-zinc-400">Password</label>
            <div className="relative">
              <LuLock className="absolute left-3.5 top-3.5 text-zinc-500" size={16} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 text-white text-xs pl-10 pr-4 py-3.5 rounded-xl outline-none focus:border-amber-400/50 transition-colors"
                required
              />
            </div>
          </div>

          {/* Demo Credentials Alert */}
          <div className="p-3.5 rounded-xl bg-amber-400/5 border border-amber-400/10 text-[11px] text-amber-300/80 leading-relaxed font-light">
            <strong>Demo Credentials:</strong> <br />
            Email: <code className="text-white">admin@goldenway.com</code> <br />
            Password: <code className="text-white">admin123</code>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-amber-400 text-zinc-950 font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? "Verifying..." : "Sign In to Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};
export default AdminLogin;
