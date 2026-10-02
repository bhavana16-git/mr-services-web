import { Link } from "react-router-dom";
import StatusBadge from "@/components/common/StatusBadge";
import { timeAgo } from "@/lib/utils";
import { ROUTES } from "@/routes/routePaths";

type Row = {
  id: string; request_number: string; status: "received" | "in_progress" | "completed";
  service_category: string; updated_at: string; service_packages: { name: string } | null;
};

export default function RequestsTable({ rows }: { rows: Row[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-sm">
        <thead className="bg-neutral-100 text-left text-neutral-700">
          <tr>
            <th className="px-4 py-3">Request ID</th>
            <th className="px-4 py-3">Service / Package</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Last Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3">
                <Link to={ROUTES.portalRequestDetail(r.id)} className="font-medium text-primary-500 hover:underline">
                  {r.request_number}
                </Link>
              </td>
              <td className="px-4 py-3">{r.service_packages?.name ?? r.service_category}</td>
              <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
              <td className="px-4 py-3 text-neutral-400">{timeAgo(r.updated_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

