import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard, Inbox, Users, ClipboardList, FileText, MessageSquare,
  Package, Newspaper, Quote, Settings, LogOut,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { ROUTES } from "@/routes/routePaths";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Dashboard", to: ROUTES.adminDashboard, icon: LayoutDashboard },
  { label: "Contact Leads", to: ROUTES.adminContactSubmissions, icon: Inbox },
  { label: "Clients", to: ROUTES.adminClients, icon: Users },
  { label: "Requests", to: ROUTES.adminRequests, icon: ClipboardList },
  { label: "Documents", to: ROUTES.adminDocuments, icon: FileText },
  { label: "Messages", to: ROUTES.adminMessages, icon: MessageSquare },
  { label: "Packages", to: ROUTES.adminPackages, icon: Package },
  { label: "Blog", to: ROUTES.adminBlog, icon: Newspaper },
  { label: "Testimonials", to: ROUTES.adminTestimonials, icon: Quote },
  { label: "Settings", to: ROUTES.adminSettings, icon: Settings },
];

export default function AdminLayout() {
  const { signOut } = useAuth();

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar: laptops and larger */}
      <aside className="hidden lg:flex lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-neutral-200 lg:bg-white">
        <div className="p-6">
          <Logo />
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Admin back office
          </p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  isActive ? "bg-accent-100 text-accent-600" : "text-neutral-700 hover:bg-neutral-100",
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

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Menu strip: phones and tablets */}
        <nav className="flex gap-1 overflow-x-auto border-b border-neutral-200 bg-white px-2 py-2 lg:hidden">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium",
                  isActive ? "bg-accent-100 text-accent-600" : "text-neutral-700",
                )
              }
            >
              <item.icon className="h-4 w-4" strokeWidth={1.75} />
              {item.label}
            </NavLink>
          ))}
          <button
            onClick={() => signOut()}
            className="flex shrink-0 items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-neutral-700"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.75} /> Log Out
          </button>
        </nav>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

