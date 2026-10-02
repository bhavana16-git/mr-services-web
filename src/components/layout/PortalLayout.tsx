import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Package, ClipboardList, FileText, MessageSquare, User, LogOut,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { ROUTES } from "@/routes/routePaths";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", to: ROUTES.portalDashboard, icon: LayoutDashboard },
  { label: "Service Packages", to: ROUTES.portalPackages, icon: Package },
  { label: "My Requests", to: ROUTES.portalRequests, icon: ClipboardList },
  { label: "Documents", to: ROUTES.portalDocuments, icon: FileText },
  { label: "Messages", to: ROUTES.portalMessages, icon: MessageSquare },
  { label: "My Profile", to: ROUTES.portalProfile, icon: User },
];

export default function PortalLayout() {
  const { signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-neutral-200 lg:bg-white">
        <div className="p-6"><Logo /></div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-accent-100 text-accent-600"
                    : "text-neutral-700 hover:bg-neutral-100",
                )
              }
            >
              <item.icon className="h-4 w-4" strokeWidth={1.75} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => signOut()}
          className="m-3 flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} /> Log Out
        </button>
      </aside>

      <div className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t
                       border-neutral-200 bg-white py-2 lg:hidden">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn("flex flex-col items-center gap-0.5 px-2 text-xs",
                 isActive ? "text-accent-600" : "text-neutral-700")
            }
          >
            <item.icon className="h-5 w-5" strokeWidth={1.75} />
            {item.label.split(" ")[0]}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}


