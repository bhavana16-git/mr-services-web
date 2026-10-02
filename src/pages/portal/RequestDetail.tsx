import { useParams } from "react-router-dom";
import { useRequestDetail } from "@/hooks/useRequests";
import Seo from "@/components/common/Seo";
import StatusBadge from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";

export default function RequestDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: request, isLoading } = useRequestDetail(id!);

  if (isLoading) return <div className="p-10">Loading...</div>;
  if (!request) return <div className="p-10">Request not found.</div>;

  return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <Seo title={`${request.request_number} | M. R. Services Client Portal`} description="Request status and details." />
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">{request.request_number}</h1>
        <StatusBadge status={request.status} />
      </div>
      <p className="mt-1 text-sm text-neutral-400">Submitted {formatDate(request.created_at)}</p>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Package</h2>
        <p className="mt-1 text-neutral-900">{request.service_packages?.name ?? request.service_category}</p>

        <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-neutral-400">Description</h2>
        <p className="mt-1 text-neutral-900 whitespace-pre-wrap">{request.description}</p>

        {request.preferred_start_date && (
          <>
            <h2 className="mt-4 text-sm font-semibold uppercase tracking-wide text-neutral-400">Preferred Start Date</h2>
            <p className="mt-1 text-neutral-900">{formatDate(request.preferred_start_date)}</p>
          </>
        )}
      </div>

      {/* Status timeline -- Received -> In Progress -> Completed */}
      <div className="mt-6 flex items-center gap-2 text-sm">
        {(["received", "in_progress", "completed"] as const).map((step, i) => (
          <span key={step} className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${
              ["received", "in_progress", "completed"].indexOf(request.status) >= i
                ? "bg-accent-500" : "bg-neutral-200"
            }`} />
            <span className="capitalize text-neutral-700">{step.replace("_", " ")}</span>
            {i < 2 && <span className="mx-1 text-neutral-300">&rarr;</span>}
          </span>
        ))}
      </div>
    </div>
  );
}


