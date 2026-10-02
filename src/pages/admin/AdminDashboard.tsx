import { Link } from "react-router-dom";
import { Inbox, ClipboardList, MessageSquare } from "lucide-react";
import { useAdminDashboardSummary } from "@/hooks/useAdminData";
import Seo from "@/components/common/Seo";
import DashboardCard from "@/components/portal/DashboardCard";
import { ROUTES } from "@/routes/routePaths";

export default function AdminDashboard() {
  const { data, isLoading } = useAdminDashboardSummary();
  const show = (n: number | undefined) => (isLoading ? "..." : (n ?? 0));

  return (
    <div className="p-6 lg:p-10">
      <Seo title="Admin Dashboard | M. R. Services" description="Overview of new leads, open requests, and unread messages." />
      <h1 className="font-heading text-2xl font-bold text-neutral-900">Admin Dashboard</h1>
      <p className="mt-1 text-neutral-700">Overview: new leads, open requests, unread messages.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <DashboardCard icon={Inbox} label="New Leads" value={show(data?.newLeads)} to={ROUTES.adminContactSubmissions} />
        <DashboardCard icon={ClipboardList} label="Open Requests" value={show(data?.openRequests)} to={ROUTES.adminRequests} />
        <DashboardCard icon={MessageSquare} label="Unread Messages" value={show(data?.unreadMessages)} to={ROUTES.adminMessages} />
      </div>

      <p className="mt-10 text-sm text-neutral-400">
        <Link to={ROUTES.adminClients} className="text-primary-500 underline">View all clients</Link>
        {" "}&middot;{" "}
        <Link to={ROUTES.adminPackages} className="text-primary-500 underline">Manage Service Packages</Link>
        {" "}&middot;{" "}
        <Link to={ROUTES.adminBlog} className="text-primary-500 underline">Blog</Link>
        {" "}&middot;{" "}
        <Link to={ROUTES.adminTestimonials} className="text-primary-500 underline">Testimonials</Link>
      </p>
    </div>
  );
}

