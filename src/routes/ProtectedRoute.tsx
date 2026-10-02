import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "./routePaths";

export default function ProtectedRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!session) {
    const redirect = encodeURIComponent(location.pathname);
    return <Navigate to={`${ROUTES.signIn}?redirect=${redirect}`} replace />;
  }

  return <Outlet />;
}


