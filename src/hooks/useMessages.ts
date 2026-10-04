import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";

export function useMyMessages() {
  const { session } = useAuth();
  return useQuery({
    queryKey: ["my-messages", session?.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!session,
  });
}

export function useSendMessage() {
  const { session } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (body: string) => {
      if (!session) throw new Error("You must be signed in.");
      const { data, error } = await supabase
        .from("messages")
        .insert({
          client_id: session.user.id,
          sender_id: session.user.id,
          sender_role: "client",
          body,
        })
        .select()
        .single();
      if (error) throw error;

      // Tell Manali by email. A failed email must never stop the message sending.
      await supabase.functions.invoke("notify-new-message", { body: { messageId: data.id } });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-messages"] }),
  });
}



