import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdminClients, errorMessage } from "@/hooks/useAdminData";
import Seo from "@/components/common/Seo";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { ROUTES } from "@/routes/routePaths";

export default function Clients() {
  const { data: clients, isLoading, error } = useAdminClients();
  const [search, setSearch] = useState("");

  const q = search.trim().toLowerCase();
  const visible = (clients ?? []).filter(
    (c) =>
      !q ||
      c.full_name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      (c.society_or_business_name ?? "").toLowerCase().includes(q),
  );

  return (
    <div className="p-6 lg:p-10">
      <Seo title="Clients | M. R. Services Admin" description="Everyone with a client portal account." />
      <h1 className="font-heading text-2xl font-bold text-neutral-900">Clients</h1>

      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email or society..."
        className="mt-6 max-w-sm"
      />

      {isLoading && <p className="mt-6 text-neutral-700">Loading...</p>}
      {error && <p className="mt-6 text-danger-500">Could not load clients: {errorMessage(error)}</p>}
      {clients && visible.length === 0 && <p className="mt-6 text-neutral-400">No clients found.</p>}

      {visible.length > 0 && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-left text-neutral-700">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Mobile</th>
                <th className="px-4 py-3">Society / Business</th>
                <th className="px-4 py-3">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {visible.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-50">
                  <td className="px-4 py-3">
                    <Link to={ROUTES.adminClientDetail(c.id)} className="font-medium text-primary-500 hover:underline">
                      {c.full_name || "(no name)"}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.mobile_number}</td>
                  <td className="px-4 py-3">{c.society_or_business_name}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-400">{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

