import { Link, useParams } from "react-router-dom";
import { useClientDetail, humanize, errorMessage } from "@/hooks/useAdminData";
import Seo from "@/components/common/Seo";
import StatusBadge from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { formatDate, timeAgo } from "@/lib/utils";
import { ROUTES } from "@/routes/routePaths";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useClientDetail(id);

  if (isLoading) return <div className="p-10 text-neutral-700">Loading...</div>;
  if (error || !data) {
    return <div className="p-10 text-danger-500">Could not load this client. {error ? errorMessage(error) : ""}</div>;
  }

  const { profile, requests, documents, messages } = data;

  return (
    <div className="max-w-4xl p-6 lg:p-10">
      <Seo title={`${profile.full_name} | M. R. Services Admin`} description="Client overview." />
      <Link to={ROUTES.adminClients} className="text-sm text-primary-500 hover:underline">&larr; All clients</Link>

      <h1 className="mt-2 font-heading text-2xl font-bold text-neutral-900">{profile.full_name || "(no name)"}</h1>
      <p className="mt-1 text-sm text-neutral-400">
        {profile.email} &middot; {profile.mobile_number} &middot; {profile.society_or_business_name}
      </p>
      <p className="mt-1 text-sm text-neutral-400">
        Joined {formatDate(profile.created_at)} &middot; Notifications: {profile.notification_preference}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <Button asChild>
          <Link to={`${ROUTES.adminDocuments}?client=${profile.id}`}>Upload document</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link to={`${ROUTES.adminMessages}?client=${profile.id}`}>Message client</Link>
        </Button>
      </div>

      <h2 className="mt-10 font-heading text-lg font-semibold text-neutral-900">Requests</h2>
      {requests.length === 0 ? (
        <p className="mt-2 text-sm text-neutral-400">No requests yet.</p>
      ) : (
        <div className="mt-3 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <tbody className="divide-y divide-neutral-200">
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-3">
                    <Link to={ROUTES.adminRequestDetail(r.id)} className="font-medium text-primary-500 hover:underline">
                      {r.request_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 capitalize">{humanize(r.service_category)}</td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-neutral-400">{formatDate(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="mt-10 font-heading text-lg font-semibold text-neutral-900">Documents</h2>
      {documents.length === 0 ? (
        <p className="mt-2 text-sm text-neutral-400">No documents shared yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white text-sm">
          {documents.map((d) => (
            <li key={d.id} className="flex justify-between px-4 py-3">
              <span className="text-neutral-900">{d.title}</span>
              <span className="text-neutral-400">{humanize(d.category)} &middot; {formatDate(d.created_at)}</span>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-10 font-heading text-lg font-semibold text-neutral-900">Recent messages</h2>
      {messages.length === 0 ? (
        <p className="mt-2 text-sm text-neutral-400">No messages yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white text-sm">
          {messages.map((m) => (
            <li key={m.id} className="px-4 py-3">
              <p className="text-neutral-900">
                <span className="font-medium capitalize">{m.sender_role}:</span> {m.body}
              </p>
              <p className="text-xs text-neutral-400">{timeAgo(m.created_at)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

