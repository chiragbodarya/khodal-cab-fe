import { useState, useMemo, useCallback } from 'react';
import {
  useGetAdminsQuery,
  useCreateAdminMutation,
  useChangePasswordMutation,
  useDeleteAdminMutation,
  type Admin,
} from '../../redux/slices/adminApiSlice';
import { useAppSelector } from '../../redux/hooks';
import {
  LuPlus,
  LuTrash2,
  LuKey,
  LuShieldCheck,
  LuMail,
  LuUser,
  LuLock,
  LuSearch,
  LuUserCheck,
} from 'react-icons/lu';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import { FormikInput } from '../../components/common/formik';
import { AdminDrawer } from '../../components/common/AdminDrawer';
import { Table } from '../../components/Table';
import type { Column } from '../../components/Table';

export const ManageAdmins = () => {
  const { data: adminResponse, isLoading, refetch } = useGetAdminsQuery();
  const currentUser = useAppSelector(state => state.auth.user);

  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [passwordTargetAdmin, setPasswordTargetAdmin] = useState<Admin | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Normalize list of admins
  const admins: Admin[] = useMemo(() => {
    if (!adminResponse) return [];
    if (Array.isArray(adminResponse.data)) {
      return adminResponse.data;
    }
    if (Array.isArray((adminResponse as any)?.admins)) {
      return (adminResponse as any).admins;
    }
    return [];
  }, [adminResponse]);

  const filteredAdmins = useMemo(() => {
    if (!searchQuery.trim()) return admins;
    const q = searchQuery.toLowerCase();
    return admins.filter(
      a =>
        a.name?.toLowerCase().includes(q) ||
        a.email?.toLowerCase().includes(q) ||
        a.id?.toLowerCase().includes(q)
    );
  }, [admins, searchQuery]);

  const handleCreateAdmin = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      await createAdmin({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      }).unwrap();

      toast.success(`Admin account for ${values.name} created successfully!`);
      setIsAddDrawerOpen(false);
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to create admin.');
    }
  };

  const handleChangePassword = async (values: {
    currentPassword?: string;
    newPassword: string;
    confirmPassword?: string;
  }) => {
    if (!passwordTargetAdmin) return;
    if (values.newPassword !== values.confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    try {
      await changePassword({
        id: passwordTargetAdmin.id,
        currentPassword: values.currentPassword || undefined,
        newPassword: values.newPassword,
      }).unwrap();

      toast.success(`Password for ${passwordTargetAdmin.name || passwordTargetAdmin.email} updated successfully!`);
      setPasswordTargetAdmin(null);
    } catch (error: any) {
      toast.error(error?.data?.message || error?.message || 'Failed to update password.');
    }
  };

  const handleDeleteAdmin = useCallback(
    async (admin: Admin) => {
      if (currentUser?.id === admin.id || currentUser?.email === admin.email) {
        toast.error('You cannot delete your own admin account while logged in.');
        return;
      }

      if (
        window.confirm(
          `Are you sure you want to permanently remove admin "${admin.name || admin.email}"?`
        )
      ) {
        try {
          await deleteAdmin(admin.id).unwrap();
          toast.success(`Admin ${admin.name || admin.email} removed.`);
          refetch();
        } catch (error: any) {
          toast.error(error?.data?.message || error?.message || 'Failed to delete admin.');
        }
      }
    },
    [currentUser, deleteAdmin, refetch]
  );

  const columns: Column<Admin>[] = useMemo(
    () => [
      {
        header: 'Administrator',
        render: (admin: Admin) => {
          const isMe = currentUser?.id === admin.id || currentUser?.email === admin.email;
          const initials = admin.name
            ? admin.name
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
            : 'AD';

          return (
            <div className="flex items-center gap-3">
              {admin.avatar ? (
                <img
                  src={admin.avatar}
                  alt={admin.name}
                  className="h-10 w-10 rounded-xl border border-zinc-800 object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 font-bold text-zinc-950 shadow-md shadow-amber-500/10">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white truncate">{admin.name || 'Admin User'}</span>
                  {isMe && (
                    <span className="inline-flex items-center gap-1 rounded bg-amber-400/15 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                      <LuUserCheck size={11} /> You
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-400 block truncate">{admin.email}</span>
              </div>
            </div>
          );
        },
      },
      {
        header: 'Role & Access',
        render: () => (
          <div className="inline-flex items-center gap-1.5 rounded-lg border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-400">
            <LuShieldCheck size={13} /> Full Access
          </div>
        ),
      },
      {
        header: 'Actions',
        render: (admin: Admin) => {
          const isMe = currentUser?.id === admin.id || currentUser?.email === admin.email;

          return (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPasswordTargetAdmin(admin)}
                title="Change Password"
                className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-amber-400/40 hover:bg-zinc-800 hover:text-amber-400 cursor-pointer"
              >
                <LuKey size={13} />
                <span className="hidden sm:inline">Password</span>
              </button>

              <button
                onClick={() => handleDeleteAdmin(admin)}
                disabled={isMe || isDeleting}
                title={isMe ? 'Cannot delete yourself' : 'Delete Administrator'}
                className={`rounded-lg border p-2 transition-colors cursor-pointer ${
                  isMe
                    ? 'border-zinc-800/40 bg-zinc-950/40 text-zinc-700 cursor-not-allowed'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400'
                }`}
              >
                <LuTrash2 size={14} />
              </button>
            </div>
          );
        },
      },
    ],
    [currentUser, handleDeleteAdmin, isDeleting]
  );

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">Manage Administrators</h1>
            <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2.5 py-0.5 text-xs font-bold text-amber-400">
              {admins.length} {admins.length === 1 ? 'Admin' : 'Admins'}
            </span>
          </div>
          <p className="mt-1 text-xs text-zinc-400">
            Create new administrators, manage login credentials, and configure system permissions
          </p>
        </div>

        <button
          onClick={() => setIsAddDrawerOpen(true)}
          className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-amber-400 px-5 py-3 text-xs font-bold text-zinc-950 shadow-lg shadow-amber-400/10 transition-all hover:bg-amber-300 hover:shadow-amber-400/20"
        >
          <LuPlus size={16} /> Add Administrator
        </button>
      </div>

      {/* ── Filter / Search Bar ── */}
      <div className="flex items-center gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-3">
        <div className="relative flex-1">
          <LuSearch className="absolute top-1/2 left-3.5 -translate-y-1/2 text-zinc-500" size={15} />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search admins by name or email..."
            className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-500 transition-colors focus:border-amber-400 focus:outline-none"
          />
        </div>
      </div>

      {/* ── Administrators Table ── */}
      <Table
        columns={columns}
        data={filteredAdmins}
        keyFn={(admin: Admin) => admin.id || admin.email}
        emptyMessage={
          isLoading
            ? 'Loading admin records...'
            : searchQuery
            ? 'No administrators match your search query.'
            : 'No administrators found.'
        }
      />

      {/* ── Add Admin Drawer ── */}
      <AdminDrawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="Add New Administrator"
        subtitle="Provision access credentials for a new administrator"
      >
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
          }}
          onSubmit={handleCreateAdmin}
        >
          {() => (
            <Form className="space-y-5">
              <FormikInput
                name="name"
                label="Full Name"
                placeholder="e.g. Rahul Sharma"
                icon={<LuUser size={15} />}
                required
              />

              <FormikInput
                name="email"
                type="email"
                label="Email Address"
                placeholder="e.g. rahul@khodalcab.com"
                icon={<LuMail size={15} />}
                required
              />

              <FormikInput
                name="password"
                type="password"
                label="Password"
                placeholder="Minimum 6 characters"
                icon={<LuLock size={15} />}
                required
              />

              <FormikInput
                name="confirmPassword"
                type="password"
                label="Confirm Password"
                placeholder="Repeat password"
                icon={<LuLock size={15} />}
                required
              />

              <div className="rounded-xl border border-amber-400/10 bg-amber-400/5 p-3.5 text-xs text-zinc-400 leading-relaxed">
                <strong className="text-amber-400">Security Note:</strong> New administrators will have complete access to manage fleet, travel packages, blogs, inquiries, and gallery photos.
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddDrawerOpen(false)}
                  className="flex-1 cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 py-3 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 cursor-pointer rounded-xl bg-amber-400 py-3 text-xs font-bold text-zinc-950 transition-colors hover:bg-amber-300 disabled:opacity-50"
                >
                  {isCreating ? 'Creating Admin...' : 'Create Admin'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </AdminDrawer>

      {/* ── Change Password Drawer ── */}
      <AdminDrawer
        isOpen={!!passwordTargetAdmin}
        onClose={() => setPasswordTargetAdmin(null)}
        title={`Change Password: ${passwordTargetAdmin?.name || passwordTargetAdmin?.email || ''}`}
        subtitle="Update authentication password for this administrator"
      >
        <Formik
          initialValues={{
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
          }}
          onSubmit={handleChangePassword}
        >
          {() => (
            <Form className="space-y-5">
              <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
                  <LuShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">
                    {passwordTargetAdmin?.name || 'Administrator'}
                  </p>
                  <p className="text-[11px] text-zinc-400">{passwordTargetAdmin?.email}</p>
                </div>
              </div>

              {currentUser?.id === passwordTargetAdmin?.id && (
                <FormikInput
                  name="currentPassword"
                  type="password"
                  label="Current Password"
                  placeholder="Enter current password"
                  icon={<LuLock size={15} />}
                />
              )}

              <FormikInput
                name="newPassword"
                type="password"
                label="New Password"
                placeholder="Enter new password"
                icon={<LuLock size={15} />}
                required
              />

              <FormikInput
                name="confirmPassword"
                type="password"
                label="Confirm New Password"
                placeholder="Repeat new password"
                icon={<LuLock size={15} />}
                required
              />

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPasswordTargetAdmin(null)}
                  className="flex-1 cursor-pointer rounded-xl border border-zinc-800 bg-zinc-950 py-3 text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="flex-1 cursor-pointer rounded-xl bg-amber-400 py-3 text-xs font-bold text-zinc-950 transition-colors hover:bg-amber-300 disabled:opacity-50"
                >
                  {isChangingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </AdminDrawer>
    </div>
  );
};

export default ManageAdmins;
