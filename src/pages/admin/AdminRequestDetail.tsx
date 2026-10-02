import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useAdminRequestDetail, useAdminRequestNotes, useUpdateRequestStatus, useAddInternalNote,
  getSignedUrl, humanize, errorMessage, formatBytes, type RequestStatus,
} from "@/hooks/useAdminData";
import { useAuth } from "@/hooks/useAuth";
import Seo from "@/components/common/Seo";
import StatusBadge from "@/components/common/StatusBadge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatDate, timeAgo } from "@/lib/utils";
import { ROUTES } from "@/routes/routePaths";

export default function AdminRequestDetail() {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const { data: request, isLoading, error } = useAdminRequestDetail(id);
  const { data: notes } = useAdminRequestNotes(id);
  const updateStatus = useUpdateRequestStatus();
  const addNote = useAddInternalNote();
  const [noteDraft, setNoteDraft] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);

  async function openAttachment(path: string) {
    try {
      setFileError(null);
      const url = await getSignedUrl("request-attachments", path);
      window.open(url, "_blank", "noopener");
    } catch (e) {
      setFileError(errorMessage(e));
    }
  }

  if (isLoading) return <div className="p-10 text-neutral-700">Loading...</div>;
  if (error || !request) {
    return <div className="p-10 text-danger-500">Could not load this request. {error ? errorMessage(error) : ""}</div>;
  }

  function saveNote() {
    if (!session || !request || !noteDraft.trim()) return;
    addNote.mutate(
      { requestId: request.id, authorId: session.user.id, note: noteDraft.trim() },
      { onSuccess: () => setNoteDraft("") },
    );
  }

  return (
    <div className="max-w-3xl p-6 lg:p-10">
      <Seo title={`${request.request_number} | M. R. Services Admin`} description="Request detail and triage." />
      <Link to={ROUTES.adminRequests} className="text-sm text-primary-500 hover:underline">&larr; All requests</Link>

      <div className="mt-2 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">{request.request_number}</h1>
        <StatusBadge status={request.status} />
      </div>
      <p className="mt-1 text-sm text-neutral-400">
        <Link to={ROUTES.adminClientDetail(request.client_id)} className="text-primary-500 hover:underline">
          {request.profiles?.full_name}
        </Link>
        {" "}&middot; {request.profiles?.email} &middot; {request.profiles?.mobile_number}
      </p>

      <dl className="mt-6 grid gap-4 rounded-lg border border-neutral-200 bg-white p-5 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-neutral-400">Package</dt>
          <dd className="text-neutral-900">{request.service_packages?.name ?? "Custom request"}</dd>
        </div>
        <div>
          <dt className="text-neutral-400">Category</dt>
          <dd className="capitalize text-neutral-900">{humanize(request.service_category)}</dd>
        </div>
        <div>
          <dt className="text-neutral-400">Preferred contact</dt>
          <dd className="capitalize text-neutral-900">{request.preferred_contact_method}</dd>
        </div>
        <div>
          <dt className="text-neutral-400">Preferred start date</dt>
          <dd className="text-neutral-900">
            {request.preferred_start_date ? formatDate(request.preferred_start_date) : "Not specified"}
          </dd>
        </div>
        <div>
          <dt className="text-neutral-400">Submitted</dt>
          <dd className="text-neutral-900">{formatDate(request.created_at)}</dd>
        </div>
      </dl>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Description</h2>
        <p className="mt-1 whitespace-pre-wrap text-neutral-900">{request.description}</p>
      </div>

      {request.request_attachments && request.request_attachments.length > 0 && (
        <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-400">Attachments</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {request.request_attachments.map((a) => (
              <li key={a.id}>
                <button
                  onClick={() => openAttachment(a.storage_path)}
                  className="text-primary-500 hover:underline"
                >
                  {a.file_name}
                </button>
                <span className="text-neutral-400"> ({formatBytes(a.file_size_bytes)})</span>
              </li>
            ))}
          </ul>
          {fileError && <p className="mt-2 text-sm text-danger-500">{fileError}</p>}
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <span className="text-sm font-medium text-neutral-700">Update Status:</span>
        <Select
          value={request.status}
          disabled={updateStatus.isPending}
          onValueChange={(status) =>
            updateStatus.mutate({ id: request.id, status: status as RequestStatus })
          }
        >
          <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="received">Received</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {updateStatus.error && (
        <p className="mt-2 text-sm text-danger-500">{errorMessage(updateStatus.error)}</p>
      )}

      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-neutral-900">Internal Notes</h2>
        <p className="text-xs text-neutral-400">Visible only to M. R. Services staff. Never shown to the client.</p>
        <div className="mt-3 space-y-3">
          {notes?.length === 0 && <p className="text-sm text-neutral-400">No notes yet.</p>}
          {notes?.map((n) => (
            <div key={n.id} className="rounded-lg bg-accent-100 p-3 text-sm">
              <p className="whitespace-pre-wrap text-neutral-900">{n.note}</p>
              <p className="mt-1 text-xs text-neutral-400">{timeAgo(n.created_at)}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex gap-3">
          <Textarea
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            rows={2}
            placeholder="Add an internal note..."
          />
          <Button onClick={saveNote} disabled={addNote.isPending}>Add Note</Button>
        </div>
        {addNote.error && <p className="mt-2 text-sm text-danger-500">{errorMessage(addNote.error)}</p>}
      </div>
    </div>
  );
}


