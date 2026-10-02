import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "./routePaths";

export default function RoleRoute({ role }: { role: "client" | "admin" }) {
  const { session, profile, loading } = useAuth();

  if (loading) return null;
  if (!session) return <Navigate to={ROUTES.signIn} replace />;
  if (!profile) return null;

  if (profile.role !== role) {
    return (
      <Navigate to={profile.role === "admin" ? ROUTES.adminDashboard : ROUTES.portalDashboard} replace />
    );
  }

  return <Outlet />;
}


