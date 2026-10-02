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
      const { data: message, error } = await supabase
        .from("messages")
        .insert({
          client_id: session.user.id,
          sender_id: session.user.id,
          sender_role: "client",
          body,
        })
        .select("id")
        .single();
      if (error) throw error;

      // Email Manali. If the email fails the message is still saved.
      const { error: notifyError } = await supabase.functions.invoke("notify-new-message", {
        body: { messageId: message.id },
      });
      if (notifyError) console.warn("Email notification failed:", notifyError);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["my-messages"] }),
  });
}

