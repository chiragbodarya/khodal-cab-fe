import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { login as loginAction } from '../redux/slices/authSlice';
import { useLoginMutation } from '../redux/slices/adminApiSlice';
import { LuLock, LuMail, LuArrowLeft } from 'react-icons/lu';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import { FormikInput } from '../components/common/formik';

export const AdminLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn);
  const [loginMutation, { isLoading }] = useLoginMutation();

  // If already logged in, redirect
  React.useEffect(() => {
    if (isLoggedIn) {
      navigate('/backstage/dashboard');
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (values: any) => {
    try {
      const response = await loginMutation({
        email: values.email,
        password: values.password,
      }).unwrap();
      const { admin, accessToken, refreshToken } = response.data;

      dispatch(
        loginAction({
          user: {
            id: admin.id,
            name: admin.name || 'Admin',
            email: admin.email,
            role: 'admin',
            avatar: admin.avatar || '',
          },
          token: accessToken,
          refreshToken,
        })
      );
      toast.success('Login successful! Admin session started.');
      navigate('/backstage/dashboard');
    } catch (error: unknown) {
      const err = error as { data?: { message?: string }; message?: string };
      toast.error(err?.data?.message || err?.message || 'Invalid credentials.');
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Back to Home Link */}
      <Link
        to="/"
        className="mb-8 inline-flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-amber-400"
      >
        <LuArrowLeft size={14} /> Back to public website
      </Link>

      <div className="relative w-full max-w-md space-y-6 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        {/* Glow Element */}
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-amber-400/5 blur-3xl" />

        {/* Brand */}
        <div className="flex flex-col items-center space-y-2">
          <img
            src="/favicon.png"
            alt="Khodel Travels Logo"
            className="h-12 w-12 rounded-2xl object-contain shadow-lg shadow-amber-500/20"
          />
          <h2 className="text-center text-xl font-bold text-white">Admin Management Console</h2>
          <p className="text-center text-xs font-light text-zinc-500">
            Sign in to manage fleet photos, routes, and blogs
          </p>
        </div>

        {/* Login Form */}
        <Formik
          initialValues={{ email: '', password: '' }}
          onSubmit={handleLogin}
        >
          {() => (
            <Form className="space-y-4">
              <FormikInput
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                icon={<LuMail size={16} />}
                required
                className="!bg-zinc-955 !rounded-xl !py-3.5"
              />

              <FormikInput
                name="password"
                type="password"
                label="Password"
                placeholder="••••••••"
                icon={<LuLock size={16} />}
                required
                className="!bg-zinc-955 !rounded-xl !py-3.5"
              />

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-400 py-3.5 text-xs font-bold text-zinc-950 transition-colors hover:bg-amber-300"
              >
                {isLoading ? 'Verifying...' : 'Sign In to Admin'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};
export default AdminLogin;
