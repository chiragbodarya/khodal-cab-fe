import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";

/**
 * Protects all child routes — redirects to /login if user is not authenticated.
 */
export const ProtectedRoute = () => {
  const { isLoggedIn } = useAppSelector((s) => s.auth);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
