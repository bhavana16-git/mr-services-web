import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { Database } from "@/types/database.types";

type Enums = Database["public"]["Enums"];
export type ContactStatus = Enums["contact_status"];
export type RequestStatus = Enums["request_status"];
export type DocumentCategory = Enums["document_category"];

// ---------- Small helpers used by the admin pages ----------
export function humanize(value: string) {
  return value.replace(/_/g, " ");
}

export function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Something went wrong. Please try again.";
}

export function formatBytes(bytes: number | null) {
  if (!bytes) return "-";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Private files open through a link that stops working after 60 seconds.
export async function getSignedUrl(bucket: "documents" | "request-attachments", path: string) {
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, 60);
  if (error) throw error;
  return data.signedUrl;
}

// ---------- Dashboard ----------
export function useAdminDashboardSummary() {
  return useQuery({
    queryKey: ["admin-dashboard-summary"],
    queryFn: async () => {
      const [leads, requests, messages] = await Promise.all([
        supabase.from("contact_submissions").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("requests").select("*", { count: "exact", head: true }).in("status", ["received", "in_progress"]),
        supabase.from("messages").select("*", { count: "exact", head: true }).eq("sender_role", "client").is("read_at", null),
      ]);
      const firstError = leads.error ?? requests.error ?? messages.error;
      if (firstError) throw firstError;
      return {
        newLeads: leads.count ?? 0,
        openRequests: requests.count ?? 0,
        unreadMessages: messages.count ?? 0,
      };
    },
  });
}

// ---------- Clients ----------
export function useAdminClients() {
  return useQuery({
    queryKey: ["admin-clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email, mobile_number, society_or_business_name, created_at")
        .eq("role", "client")
        .order("full_name");
      if (error) throw error;
      return data;
    },
  });
}

// ===== Paste this INSTEAD of the old "export function useClientDetail" in src/hooks/useAdminData.ts =====
// It replaces everything from the old "export function useClientDetail(" line
// down to its closing "}" (stop before the line "// ---------- Contact leads ----------").

type Tables = Database["public"]["Tables"];

export type ClientDetailData = {
  profile: Tables["profiles"]["Row"];
  requests: Pick<Tables["requests"]["Row"], "id" | "request_number" | "service_category" | "status" | "created_at">[];
  documents: Pick<Tables["documents"]["Row"], "id" | "title" | "category" | "created_at">[];
  messages: Pick<Tables["messages"]["Row"], "id" | "body" | "sender_role" | "created_at">[];
};

export function useClientDetail(clientId: string | undefined) {
  return useQuery({
    queryKey: ["admin-client-detail", clientId],
    enabled: !!clientId,
    queryFn: async (): Promise<ClientDetailData> => {
      const id = clientId as string;
      const [profile, requests, documents, messages] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", id).single(),
        supabase
          .from("requests")
          .select("id, request_number, service_category, status, created_at")
          .eq("client_id", id)
          .order("created_at", { ascending: false }),
        supabase
          .from("documents")
          .select("id, title, category, created_at")
          .eq("client_id", id)
          .order("created_at", { ascending: false }),
        supabase
          .from("messages")
          .select("id, body, sender_role, created_at")
          .eq("client_id", id)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      if (profile.error) throw profile.error;
      if (requests.error) throw requests.error;
      if (documents.error) throw documents.error;
      if (messages.error) throw messages.error;
      return {
        profile: profile.data,
        requests: requests.data ?? [],
        documents: documents.data ?? [],
        messages: messages.data ?? [],
      };
    },
  });
}

// ---------- Contact leads ----------
export function useContactSubmissions() {
  return useQuery({
    queryKey: ["admin-contact-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateContactStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ContactStatus }) => {
      const { error } = await supabase.from("contact_submissions").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-submissions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-summary"] });
    },
  });
}

// ---------- Requests ----------
export function useAdminRequests() {
  return useQuery({
    queryKey: ["admin-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*, profiles(full_name, email), service_packages(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAdminRequestDetail(id: string | undefined) {
  return useQuery({
    queryKey: ["admin-request-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*, profiles(full_name, email, mobile_number), service_packages(name), request_attachments(*)")
        .eq("id", id as string)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

// Internal notes live in their own table, so a client can never read them.
export function useAdminRequestNotes(id: string | undefined) {
  return useQuery({
    queryKey: ["admin-request-notes", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("request_internal_notes")
        .select("*")
        .eq("request_id", id as string)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useUpdateRequestStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: RequestStatus }) => {
      const { error } = await supabase.from("requests").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-requests"] });
      queryClient.invalidateQueries({ queryKey: ["admin-request-detail"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-summary"] });
      queryClient.invalidateQueries({ queryKey: ["admin-client-detail"] });
    },
  });
}

export function useAddInternalNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ requestId, authorId, note }: { requestId: string; authorId: string; note: string }) => {
      const { error } = await supabase
        .from("request_internal_notes")
        .insert({ request_id: requestId, author_id: authorId, note });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-request-notes"] }),
  });
}

// ---------- Documents ----------
export function useAdminDocuments() {
  return useQuery({
    queryKey: ["admin-documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

// Storage keys reject spaces and symbols, so keep only safe characters.
function safeFileName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      clientId: string;
      requestId: string | null;
      title: string;
      category: DocumentCategory;
      file: File;
      uploadedBy: string;
    }) => {
      const filePath = `${input.clientId}/${crypto.randomUUID()}-${safeFileName(input.file.name)}`;

      const { error: uploadError } = await supabase.storage.from("documents").upload(filePath, input.file);
      if (uploadError) throw uploadError;

      const { data: doc, error: insertError } = await supabase
        .from("documents")
        .insert({
          client_id: input.clientId,
          request_id: input.requestId,
          title: input.title,
          category: input.category,
          storage_path: filePath,
          file_size_bytes: input.file.size,
          uploaded_by: input.uploadedBy,
        })
        .select("id")
        .single();

      if (insertError) {
        await supabase.storage.from("documents").remove([filePath]); // do not leave an orphan file
        throw insertError;
      }

      // The email is a bonus: if it fails, the document is still saved.
      const { error: notifyError } = await supabase.functions.invoke("notify-document-uploaded", {
        body: { documentId: doc.id },
      });
      if (notifyError) console.warn("Email notification failed:", notifyError);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-documents"] }),
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (doc: { id: string; storage_path: string }) => {
      const { error } = await supabase.from("documents").delete().eq("id", doc.id);
      if (error) throw error;
      await supabase.storage.from("documents").remove([doc.storage_path]);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-documents"] }),
  });
}

// ---------- Messages ----------
export function useAdminMessages() {
  return useQuery({
    queryKey: ["admin-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    refetchInterval: 15_000, // pick up new client messages without a page refresh
  });
}

export function useAdminReply() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ clientId, adminId, body }: { clientId: string; adminId: string; body: string }) => {
      const { data: message, error } = await supabase
        .from("messages")
        .insert({ client_id: clientId, sender_id: adminId, sender_role: "admin", body })
        .select("id")
        .single();
      if (error) throw error;

      const { error: notifyError } = await supabase.functions.invoke("notify-new-message", {
        body: { messageId: message.id },
      });
      if (notifyError) console.warn("Email notification failed:", notifyError);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-messages"] }),
  });
}

export function useMarkThreadRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (clientId: string) => {
      const { error } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("client_id", clientId)
        .eq("sender_role", "client")
        .is("read_at", null);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-messages"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard-summary"] });
    },
  });
}

// ---------- Service packages ----------
export function useAdminPackages() {
  return useQuery({
    queryKey: ["admin-packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_packages")
        .select("*")
        .order("category")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export function useTogglePackageActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { error } = await supabase.from("service_packages").update({ is_active: isActive }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-packages"] }),
  });
}

export function useUpdatePackagePrice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, price }: { id: string; price: number }) => {
      const { error } = await supabase.from("service_packages").update({ starting_price: price }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-packages"] }),
  });
}

// ---------- Blog ----------
export type BlogFormValues = {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  content_markdown: string;
  meta_description: string;
  tags: string[];
  is_published: boolean;
};

export function useAdminBlogPosts() {
  return useQuery({
    queryKey: ["admin-blog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useSaveBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      values: BlogFormValues;
      authorId: string;
      existingPublishedAt: string | null;
    }) => {
      const { values } = input;
      const row = {
        slug: values.slug,
        title: values.title,
        excerpt: values.excerpt || null,
        content_markdown: values.content_markdown,
        meta_description: values.meta_description || null,
        tags: values.tags,
        is_published: values.is_published,
        // The first time a post goes live, stamp the publish date.
        published_at: values.is_published
          ? (input.existingPublishedAt ?? new Date().toISOString())
          : input.existingPublishedAt,
      };
      if (values.id) {
        const { error } = await supabase.from("blog_posts").update(row).eq("id", values.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("blog_posts").insert({ ...row, author_id: input.authorId });
        if (error) throw error;
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-blog"] }),
  });
}

export function useToggleBlogPublished() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: string; isPublished: boolean; publishedAt: string | null }) => {
      const { error } = await supabase
        .from("blog_posts")
        .update({
          is_published: input.isPublished,
          published_at: input.isPublished
            ? (input.publishedAt ?? new Date().toISOString())
            : input.publishedAt,
        })
        .eq("id", input.id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-blog"] }),
  });
}

export function useDeleteBlogPost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-blog"] }),
  });
}

// ---------- Testimonials ----------
export function useAdminTestimonials() {
  return useQuery({
    queryKey: ["admin-testimonials"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("sort_order")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useAddTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      quote: string;
      author_name: string;
      author_role: string | null;
      is_featured: boolean;
      sort_order: number;
    }) => {
      const { error } = await supabase.from("testimonials").insert(input);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });
}

export function useUpdateTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      changes,
    }: {
      id: string;
      changes: { is_active?: boolean; is_featured?: boolean };
    }) => {
      const { error } = await supabase.from("testimonials").update(changes).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });
}

export function useDeleteTestimonial() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });
}

