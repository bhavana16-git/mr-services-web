import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useMyMessages, useSendMessage } from "@/hooks/useMessages";
import Seo from "@/components/common/Seo";
import EmptyState from "@/components/common/EmptyState";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { timeAgo, cn } from "@/lib/utils";

export default function Messages() {
  const { data: messages, isLoading } = useMyMessages();
  const sendMessage = useSendMessage();
  const [draft, setDraft] = useState("");

  async function handleSend() {
    if (!draft.trim()) return;
    await sendMessage.mutateAsync(draft.trim());
    setDraft("");
  }

  return (
    <div className="flex h-screen flex-col p-6 lg:p-10">
      <Seo title="Messages | M. R. Services Client Portal" description="Message M. R. Services directly about your requests." />
      <h1 className="font-heading text-2xl font-bold text-neutral-900">Messages</h1>
      <p className="mt-1 text-neutral-700">
        A direct line to the M. R. Services team for questions about ongoing or
        upcoming work.
      </p>

      <div className="mt-6 flex-1 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-4">
        {isLoading && <p className="text-neutral-700">Loading messages...</p>}
        {!isLoading && (messages?.length ?? 0) === 0 && (
          <EmptyState icon={MessageSquare} title="No messages yet" description="Send a message below to start the conversation." />
        )}
        <div className="space-y-3">
          {messages?.map((m) => (
            <div key={m.id} className={cn("max-w-[75%] rounded-lg px-4 py-2 text-sm",
              m.sender_role === "client" ? "ml-auto bg-primary-100 text-primary-900" : "bg-neutral-100 text-neutral-900")}>
              <p>{m.body}</p>
              <p className="mt-1 text-xs text-neutral-400">{timeAgo(m.created_at)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          rows={2}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={sendMessage.isPending}>New Message</Button>
      </div>
    </div>
  );
}

