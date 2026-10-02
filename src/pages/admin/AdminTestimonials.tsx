import { useState } from "react";
import {
  useAdminTestimonials, useAddTestimonial, useUpdateTestimonial, useDeleteTestimonial, errorMessage,
} from "@/hooks/useAdminData";
import Seo from "@/components/common/Seo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export default function AdminTestimonials() {
  const { data: testimonials, isLoading, error } = useAdminTestimonials();
  const addTestimonial = useAddTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const [quote, setQuote] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [isFeatured, setIsFeatured] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function handleAdd() {
    setFormError(null);
    setNotice(null);
    if (quote.trim().length < 10 || !authorName.trim()) {
      setFormError("Enter the quote (at least 10 characters) and the author's name.");
      return;
    }
    addTestimonial.mutate(
      {
        quote: quote.trim(),
        author_name: authorName.trim(),
        author_role: authorRole.trim() || null,
        is_featured: isFeatured,
        sort_order: Number.parseInt(sortOrder, 10) || 0,
      },
      {
        onSuccess: () => {
          setQuote("");
          setAuthorName("");
          setAuthorRole("");
          setSortOrder("0");
          setIsFeatured(false);
          setNotice("Testimonial added.");
        },
        onError: (e) => setFormError(errorMessage(e)),
      },
    );
  }

  function handleDelete(id: string, author: string) {
    if (!window.confirm(`Delete the testimonial from ${author}? This cannot be undone.`)) return;
    deleteTestimonial.mutate(id);
  }

  return (
    <div className="p-6 lg:p-10">
      <Seo title="Testimonials | M. R. Services Admin" description="Manage customer testimonials." />
      <h1 className="font-heading text-2xl font-bold text-neutral-900">Testimonials</h1>
      <p className="mt-1 text-neutral-700">
        Active means visible on the public site. The Home page shows the active testimonial with the lowest Order number.
      </p>

      <div className="mt-6 grid gap-4 rounded-lg border border-neutral-200 bg-white p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="t-quote">Quote</Label>
          <Textarea id="t-quote" rows={3} value={quote} onChange={(e) => setQuote(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="t-name">Author name</Label>
          <Input id="t-name" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="t-role">Author role (for example: Secretary, XYZ Society)</Label>
          <Input id="t-role" value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="t-order">Order (lowest number shows first)</Label>
          <Input
            id="t-order"
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 pt-6">
          <Switch id="t-featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
          <Label htmlFor="t-featured">Featured</Label>
        </div>
        {formError && <p className="text-sm text-danger-500 sm:col-span-2">{formError}</p>}
        {notice && <p className="text-sm text-teal-500 sm:col-span-2">{notice}</p>}
        <Button onClick={handleAdd} disabled={addTestimonial.isPending} className="sm:col-span-2">
          {addTestimonial.isPending ? "Adding..." : "Add testimonial"}
        </Button>
      </div>

      {isLoading && <p className="mt-6 text-neutral-700">Loading...</p>}
      {error && <p className="mt-6 text-danger-500">Could not load testimonials: {errorMessage(error)}</p>}
      {(updateTestimonial.error || deleteTestimonial.error) && (
        <p className="mt-4 text-sm text-danger-500">
          {errorMessage(updateTestimonial.error ?? deleteTestimonial.error)}
        </p>
      )}
      {testimonials && testimonials.length === 0 && (
        <p className="mt-6 text-neutral-400">No testimonials yet.</p>
      )}

      {testimonials && testimonials.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-left text-neutral-700">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Quote</th>
                <th className="px-4 py-3">Featured</th>
                <th className="px-4 py-3">Active</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {testimonials.map((t) => (
                <tr key={t.id} className={t.is_active ? "align-top" : "bg-neutral-50 align-top text-neutral-400"}>
                  <td className="px-4 py-3">{t.sort_order}</td>
                  <td className="max-w-lg px-4 py-3">
                    <p className="whitespace-pre-wrap text-neutral-900">&ldquo;{t.quote}&rdquo;</p>
                    <p className="mt-1 text-xs text-neutral-400">
                      {t.author_name}{t.author_role ? `, ${t.author_role}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={t.is_featured}
                      onCheckedChange={(checked) =>
                        updateTestimonial.mutate({ id: t.id, changes: { is_featured: checked } })
                      }
                      aria-label={`Feature testimonial from ${t.author_name}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Switch
                      checked={t.is_active}
                      onCheckedChange={(checked) =>
                        updateTestimonial.mutate({ id: t.id, changes: { is_active: checked } })
                      }
                      aria-label={`Show testimonial from ${t.author_name}`}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" onClick={() => handleDelete(t.id, t.author_name)} className="text-danger-500">
                      Delete
                    </Button>
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

