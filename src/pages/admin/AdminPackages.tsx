import { useState } from "react";
import {
  useAdminPackages, useTogglePackageActive, useUpdatePackagePrice, humanize, errorMessage,
} from "@/hooks/useAdminData";
import Seo from "@/components/common/Seo";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function AdminPackages() {
  const { data: packages, isLoading, error } = useAdminPackages();
  const toggleActive = useTogglePackageActive();
  const updatePrice = useUpdatePackagePrice();
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="p-6 lg:p-10">
      <Seo title="Service Packages | M. R. Services Admin" description="Manage Service Package pricing and availability." />
      <h1 className="font-heading text-2xl font-bold text-neutral-900">Service Packages</h1>
      <p className="mt-1 text-neutral-700">
        Click a price to edit it, then press Enter. Switch a package off to hide it from clients.
      </p>

      {isLoading && <p className="mt-6 text-neutral-700">Loading...</p>}
      {error && <p className="mt-6 text-danger-500">Could not load packages: {errorMessage(error)}</p>}
      {(toggleActive.error || updatePrice.error) && (
        <p className="mt-4 text-danger-500">
          Could not save: {errorMessage(toggleActive.error ?? updatePrice.error)}
        </p>
      )}

      {packages && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-left text-neutral-700">
              <tr>
                <th className="px-4 py-3">Package</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Best for</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {packages.map((p) => (
                <tr key={p.id} className={p.is_active ? "" : "bg-neutral-50 text-neutral-400"}>
                  <td className="px-4 py-3 font-medium text-neutral-900">{p.name}</td>
                  <td className="px-4 py-3 capitalize">{humanize(p.category)}</td>
                  <td className="px-4 py-3">{p.best_for}</td>
                  <td className="px-4 py-3">
                    {editingId === p.id ? (
                      <input
                        type="number"
                        min={0}
                        defaultValue={p.starting_price}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") e.currentTarget.blur();
                        }}
                        onBlur={(e) => {
                          const price = Number(e.target.value);
                          if (!Number.isFinite(price) || price < 0 || price === Number(p.starting_price)) {
                            setEditingId(null);
                            return;
                          }
                          updatePrice.mutate({ id: p.id, price }, { onSuccess: () => setEditingId(null) });
                        }}
                        className="w-28 rounded border border-neutral-200 px-2 py-1"
                      />
                    ) : (
                      <Button variant="ghost" onClick={() => setEditingId(p.id)}>
                        Rs. {Number(p.starting_price).toLocaleString("en-IN")}
                        <span className="ml-1 text-xs font-normal text-neutral-400">{p.price_unit}</span>
                      </Button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={p.is_active}
                      onCheckedChange={(checked) => toggleActive.mutate({ id: p.id, isActive: checked })}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-sm text-neutral-400">
        Adding a brand-new package or editing its feature bullets is done in the Supabase dashboard
        (Table Editor, tables service_packages and service_package_features).
      </p>
    </div>
  );
}

