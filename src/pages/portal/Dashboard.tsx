import { useQuery } from "@tanstack/react-query";
import { Package, ClipboardList, FileText, MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import Seo from "@/components/common/Seo";
import DashboardCard from "@/components/portal/DashboardCard";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/routePaths";

export default function Dashboard() {
  const { profile, session } = useAuth();

  const { data } = useQuery({
    queryKey: ["dashboard-summary", session?.user.id],
    queryFn: async () => {
      const [{ count: ongoing }, { data: recentDocs }, { count: unread }] = await Promise.all([
        supabase.from("requests").select("*", { count: "exact", head: true }).in("status", ["received", "in_progress"]),
        supabase.from("documents").select("id").order("created_at", { ascending: false }).limit(3),
        supabase.from("messages").select("*", { count: "exact", head: true }).eq("sender_role", "admin").is("read_at", null),
      ]);
      return { ongoing: ongoing ?? 0, recentDocsCount: recentDocs?.length ?? 0, unread: unread ?? 0 };
    },
    enabled: !!session,
  });

  const hasActivity = (data?.ongoing ?? 0) > 0 || (data?.recentDocsCount ?? 0) > 0;

  return (
    <div className="p-6 lg:p-10">
      <Seo title="Dashboard | M. R. Services Client Portal" description="Your M. R. Services account overview." />
      <h1 className="font-heading text-2xl font-bold text-neutral-900">
        Welcome back, {profile?.full_name ?? "there"}
      </h1>
      <p className="mt-1 text-neutral-700">Here's a quick snapshot of your account with M. R. Services.</p>

      {hasActivity ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard icon={Package} label="Service Packages" value="Browse" to={ROUTES.portalPackages} />
          <DashboardCard icon={ClipboardList} label="Ongoing Requests" value={data?.ongoing ?? 0} to={ROUTES.portalRequests} />
          <DashboardCard icon={FileText} label="Recent Documents" value={data?.recentDocsCount ?? 0} to={ROUTES.portalDocuments} />
          <DashboardCard icon={MessageSquare} label="Unread Messages" value={data?.unread ?? 0} to={ROUTES.portalMessages} />
        </div>
      ) : (
        <div className="mt-8">
          <EmptyState
            icon={Package}
            title="You don't have an active package yet"
            description="Browse Service Packages to get started, or request a custom quote."
            actionLabel="Browse Service Packages"
            onAction={() => {}}
          />
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild><Link to={ROUTES.portalPackages}>Browse Service Packages</Link></Button>
        <Button asChild variant="secondary"><Link to={ROUTES.portalNewRequest}>Request New Work</Link></Button>
        <Button asChild variant="outline"><Link to={ROUTES.portalMessages}>Message Us</Link></Button>
      </div>
    </div>
  );
}


