import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";

export function useMyDocuments() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["my-documents", session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });
}

export async function getDocumentSignedUrl(storagePath: string) {
  const { data, error } = await supabase.storage
    .from("documents")
    .createSignedUrl(storagePath, 60);
  if (error) throw error;
  return data.signedUrl;
}

