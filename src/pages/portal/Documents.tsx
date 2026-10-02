import { useState } from "react";
import { FileText, Download } from "lucide-react";
import { useMyDocuments, getDocumentSignedUrl } from "@/hooks/useDocuments";
import Seo from "@/components/common/Seo";
import EmptyState from "@/components/common/EmptyState";
import { formatDate } from "@/lib/utils";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export default function Documents() {
  const { data: documents, isLoading } = useMyDocuments();
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filtered = (documents ?? []).filter(
    (d) => categoryFilter === "all" || d.category === categoryFilter,
  );

  async function handleDownload(storagePath: string) {
    const url = await getDocumentSignedUrl(storagePath);
    window.open(url, "_blank");
  }

  return (
    <div className="p-6 lg:p-10">
      <Seo title="My Documents | M. R. Services Client Portal" description="Securely access statements, reports, and completed documents from M. R. Services." />
      <h1 className="font-heading text-2xl font-bold text-neutral-900">My Documents & Statements</h1>
      <p className="mt-1 text-neutral-700">
        Securely access statements, reports, and completed documents shared by
        M. R. Services.
      </p>
      <p className="mt-1 text-sm text-neutral-400">
        Documents are stored securely and are visible only to the account holder.
        Older documents remain accessible for your records; nothing is deleted
        automatically.
      </p>

      <Select value={categoryFilter} onValueChange={setCategoryFilter}>
        <SelectTrigger className="mt-6 w-64"><SelectValue /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          <SelectItem value="society_accounting">Society Accounting</SelectItem>
          <SelectItem value="business_accounting">Business Accounting</SelectItem>
          <SelectItem value="typing">Typing</SelectItem>
        </SelectContent>
      </Select>

      <div className="mt-6">
        {isLoading && <p className="text-neutral-700">Loading documents...</p>}
        {!isLoading && filtered.length === 0 && (
          <EmptyState icon={FileText} title="No documents yet" description="Documents and statements we share with you will appear here." />
        )}
        {filtered.length > 0 && (
          <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-neutral-100 text-left text-neutral-700">
                <tr><th className="px-4 py-3">Document Name</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Date</th><th className="px-4 py-3" /></tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filtered.map((doc) => (
                  <tr key={doc.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-900">{doc.title}</td>
                    <td className="px-4 py-3 capitalize">{doc.category.replace("_", " ")}</td>
                    <td className="px-4 py-3 text-neutral-400">{formatDate(doc.created_at)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDownload(doc.storage_path)} className="flex items-center gap-1 text-primary-500 hover:underline">
                        <Download className="h-4 w-4" /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


