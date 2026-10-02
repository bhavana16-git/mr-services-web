import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminRequests, humanize, errorMessage } from "@/hooks/useAdminData";
import Seo from "@/components/common/Seo";
import StatusBadge from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/utils";
import { ROUTES } from "@/routes/routePaths";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function AdminRequests() {
  const { data: requests, isLoading, error } = useAdminRequests();
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const visible = (requests ?? []).filter(
    (r) =>
      (statusFilter === "all" || r.status === statusFilter) &&
      (categoryFilter === "all" || r.service_category === categoryFilter),
  );

  return (
    <div className="p-6 lg:p-10">
      <Seo title="Requests | M. R. Services Admin" description="All client requests across the business." />
      <h1 className="font-heading text-2xl font-bold text-neutral-900">Requests</h1>

      <div className="mt-6 flex flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            <SelectItem value="society_accounting">Society Accounting</SelectItem>
            <SelectItem value="business_accounting">Business Accounting</SelectItem>
            <SelectItem value="typing_services">Typing Services</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading && <p className="mt-6 text-neutral-700">Loading...</p>}
      {error && <p className="mt-6 text-danger-500">Could not load requests: {errorMessage(error)}</p>}
      {requests && visible.length === 0 && (
        <p className="mt-6 text-neutral-400">No requests match these filters.</p>
      )}

      {visible.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-left text-neutral-700">
              <tr>
                <th className="px-4 py-3">Request</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Package / Category</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {visible.map((r) => (
                <tr key={r.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link to={ROUTES.adminRequestDetail(r.id)} className="font-medium text-primary-500 hover:underline">
                      {r.request_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{r.profiles?.full_name}</td>
                  <td className="px-4 py-3 capitalize">
                    {r.service_packages?.name ?? humanize(r.service_category)}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-400">{formatDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


