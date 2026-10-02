import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";
import type { RequestFormInput } from "@/lib/validators/requestForm.schema";
import type { TablesInsert } from "@/types/database.types";


export function useMyRequests() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["my-requests", session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*, service_packages(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });
}

export function useRequestDetail(id: string) {
  return useQuery({
    queryKey: ["request-detail", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*, service_packages(name), request_attachments(*)")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateRequest() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: RequestFormInput) => {
      if (!session) throw new Error("You must be signed in.");
      const { data, error } = await supabase
        .from("requests")
        .insert({
          client_id: session.user.id,
          package_id: input.packageId,
          service_category: input.serviceCategory,
          description: input.description,
          preferred_start_date: input.preferredStartDate || null,
          preferred_contact_method: input.preferredContactMethod,
        } as TablesInsert<"requests">)
        .select()
        .single();
      if (error) throw error;

      await supabase.functions.invoke("notify-new-request", { body: { requestId: data.id } });

      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-requests"] }),
  });
}

