import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useAdminClients, useAdminDocuments, useUploadDocument, useDeleteDocument,
  getSignedUrl, humanize, errorMessage, formatBytes, type DocumentCategory,
} from "@/hooks/useAdminData";
import { useAuth } from "@/hooks/useAuth";
import Seo from "@/components/common/Seo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB, the limit set in the backend

export default function AdminDocuments() {
  const { session } = useAuth();
  const [searchParams] = useSearchParams();
  const { data: clients } = useAdminClients();
  const { data: documents, isLoading } = useAdminDocuments();
  const uploadDocument = useUploadDocument();
  const deleteDocument = useDeleteDocument();

  const [clientId, setClientId] = useState(searchParams.get("client") ?? "");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("other");
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const clientName = (id: string) => clients?.find((c) => c.id === id)?.full_name ?? "Unknown client";

  async function handleUpload() {
    setMessage(null);
    if (!session) return;
    if (!clientId || !title.trim() || !file) {
      setMessage({ type: "error", text: "Choose a client, enter a title and pick a file." });
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setMessage({ type: "error", text: "That file is larger than 10 MB." });
      return;
    }
    try {
      await uploadDocument.mutateAsync({
        clientId, requestId: null, title: title.trim(), category, file, uploadedBy: session.user.id,
      });
      setTitle("");
      setFile(null);
      setFileInputKey((k) => k + 1); // empties the file picker
      setMessage({ type: "ok", text: "Document uploaded." });
    } catch (e) {
      setMessage({ type: "error", text: errorMessage(e) });
    }
  }

  async function handleDownload(path: string) {
    try {
      const url = await getSignedUrl("documents", path);
      window.open(url, "_blank", "noopener");
    } catch (e) {
      setMessage({ type: "error", text: errorMessage(e) });
    }
  }

  function handleDelete(doc: { id: string; title: string; storage_path: string }) {
    if (!window.confirm(`Delete "${doc.title}"? The client will no longer see it.`)) return;
    deleteDocument.mutate(
      { id: doc.id, storage_path: doc.storage_path },
      { onError: (e) => setMessage({ type: "error", text: errorMessage(e) }) },
    );
  }

  return (
    <div className="p-6 lg:p-10">
      <Seo title="Documents | M. R. Services Admin" description="Upload and manage documents for clients." />
      <h1 className="font-heading text-2xl font-bold text-neutral-900">Documents</h1>

      <div className="mt-6 grid gap-4 rounded-lg border border-neutral-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label>Client</Label>
          <Select value={clientId} onValueChange={setClientId}>
            <SelectTrigger><SelectValue placeholder="Choose a client" /></SelectTrigger>
            <SelectContent>
              {clients?.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.full_name || c.email}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="doc-title">Title</Label>
          <Input id="doc-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as DocumentCategory)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="society_accounting">Society Accounting</SelectItem>
              <SelectItem value="business_accounting">Business Accounting</SelectItem>
              <SelectItem value="typing">Typing</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="doc-file">File (max 10 MB)</Label>
          <Input
            id="doc-file"
            key={fileInputKey}
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <Button
          onClick={handleUpload}
          disabled={uploadDocument.isPending}
          className="sm:col-span-2 lg:col-span-4"
        >
          {uploadDocument.isPending ? "Uploading..." : "Upload Document"}
        </Button>
        {message && (
          <p className={`text-sm sm:col-span-2 lg:col-span-4 ${message.type === "ok" ? "text-teal-500" : "text-danger-500"}`}>
            {message.text}
          </p>
        )}
      </div>

      {isLoading && <p className="mt-6 text-neutral-700">Loading...</p>}
      {documents && documents.length === 0 && (
        <p className="mt-6 text-neutral-400">No documents uploaded yet.</p>
      )}

      {documents && documents.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-lg border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-neutral-100 text-left text-neutral-700">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Client</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Uploaded</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {documents.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-3 font-medium text-neutral-900">{d.title}</td>
                  <td className="px-4 py-3">{clientName(d.client_id)}</td>
                  <td className="px-4 py-3 capitalize">{humanize(d.category)}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatBytes(d.file_size_bytes)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-neutral-400">{formatDate(d.created_at)}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <Button variant="ghost" onClick={() => handleDownload(d.storage_path)}>Download</Button>
                    <Button variant="ghost" onClick={() => handleDelete(d)} className="text-danger-500">Delete</Button>
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

