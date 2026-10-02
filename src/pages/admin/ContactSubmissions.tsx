import {
  useContactSubmissions, useUpdateContactStatus, humanize, errorMessage, type ContactStatus,
} from "@/hooks/useAdminData";
import Seo from "@/components/common/Seo";
import { formatDate } from "@/lib/utils";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function ContactSubmissions() {
  const { data: submissions, isLoading, error } = useContactSubmissions();
  const updateStatus = useUpdateContactStatus();

  return (
    <div className="p-6 lg:p-10">
      <Seo title="Contact Leads | M. R. Services Admin" description="Triage public contact form submissions." />
      <h1 className="font-heading text-2xl font-bold text-neutral-900">Contact Leads</h1>
      <p className="mt-1 text-neutral-700">Public contact form submissions. Mark each one New, Contacted or Closed.</p>

      {isLoading && <p className="mt-6 text-neutral-700">Loading...</p>}
      {error && <p className="mt-6 text-danger-500">Could not load leads: {errorMessage(error)}</p>}
      {updateStatus.error && (
        <p className="mt-4 text-danger-500">Could not update status: {errorMessage(updateStatus.error)}</p>
      )}
      {submissions && submissions.length === 0 && (
        <p className="mt-6 text-neutral-400">No contact submissions yet.</p>
      )}

      {submissions && submissions.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-left text-neutral-700">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Message</th>
                <th className="px-4 py-3">Received</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {submissions.map((s) => (
                <tr key={s.id} className="align-top hover:bg-neutral-50">
                  <td className="px-4 py-3 font-medium text-neutral-900">{s.name}</td>
                  <td className="px-4 py-3 text-neutral-700">
                    <a href={`tel:${s.phone}`} className="text-primary-500 hover:underline">{s.phone}</a>
                    <br />
                    <a href={`mailto:${s.email}`} className="text-primary-500 hover:underline">{s.email}</a>
                  </td>
                  <td className="px-4 py-3 capitalize">{humanize(s.service_interested_in)}</td>
                  <td className="max-w-md whitespace-pre-wrap px-4 py-3 text-neutral-700">{s.message}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-400">{formatDate(s.created_at)}</td>
                  <td className="px-4 py-3">
                    <Select
                      value={s.status}
                      onValueChange={(status) =>
                        updateStatus.mutate({ id: s.id, status: status as ContactStatus })
                      }
                    >
                      <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="contacted">Contacted</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


