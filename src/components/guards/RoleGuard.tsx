import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../redux/hooks';
import type { UserRole } from '../../redux/slices/authSlice';

interface RoleGuardProps {
  allowedRoles: UserRole[];
}

/**
 * Protects child routes by role — redirects to /unauthorized if user's role
 * is not included in `allowedRoles`.
 */
export const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { user } = useAppSelector(s => s.auth);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
