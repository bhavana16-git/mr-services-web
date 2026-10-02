import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { useMyRequests } from "@/hooks/useRequests";
import Seo from "@/components/common/Seo";
import RequestsTable from "@/components/portal/RequestsTable";
import EmptyState from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/routePaths";

export default function MyRequests() {
  const { data: requests, isLoading } = useMyRequests();

  return (
    <div className="p-6 lg:p-10">
      <Seo title="My Requests | M. R. Services Client Portal" description="Track the status of your requests to M. R. Services." />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-neutral-900">My Requests & Work Status</h1>
          <p className="mt-1 text-neutral-700">
            Track the status of everything you've asked us to handle, from first
            request to completion.
          </p>
        </div>
        <Button asChild><Link to={ROUTES.portalNewRequest}>+ Request New Work</Link></Button>
      </div>

      <div className="mt-8">
        {isLoading && <p className="text-neutral-700">Loading requests...</p>}
        {!isLoading && (requests?.length ?? 0) === 0 && (
          <EmptyState
            icon={ClipboardList}
            title="No requests yet"
            description="Submit your first request and we'll take it from there."
            actionLabel="Request New Work"
            onAction={() => {}}
          />
        )}
        {(requests?.length ?? 0) > 0 && <RequestsTable rows={requests!} />}
      </div>
    </div>
  );
}


