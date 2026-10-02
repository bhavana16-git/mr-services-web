import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useAdminClients, useAdminMessages, useAdminReply, useMarkThreadRead, errorMessage,
} from "@/hooks/useAdminData";
import { useAuth } from "@/hooks/useAuth";
import Seo from "@/components/common/Seo";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { timeAgo, cn } from "@/lib/utils";

export default function AdminMessages() {
  const { session } = useAuth();
  const [searchParams] = useSearchParams();
  const { data: clients } = useAdminClients();
  const { data: messages } = useAdminMessages();
  const reply = useAdminReply();
  const { mutate: markThreadRead } = useMarkThreadRead();
  const [activeClientId, setActiveClientId] = useState<string | null>(searchParams.get("client"));
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const all = messages ?? []; // newest first
  const clientIds = [...new Set(all.map((m) => m.client_id))];
  // Lets "Message client" on a client page open a thread that has no messages yet.
  if (activeClientId && !clientIds.includes(activeClientId)) clientIds.unshift(activeClientId);

  const nameOf = (id: string) => {
    const c = clients?.find((x) => x.id === id);
    return c ? c.full_name || c.email : "Unknown client";
  };
  const lastMessage = (id: string) => all.find((m) => m.client_id === id);
  const unreadCount = (id: string) =>
    all.filter((m) => m.client_id === id && m.sender_role === "client" && !m.read_at).length;

  const thread = all
    .filter((m) => m.client_id === activeClientId)
    .sort((a, b) => a.created_at.localeCompare(b.created_at));
  const unreadInThread = thread.filter((m) => m.sender_role === "client" && !m.read_at).length;

  // Viewing a conversation marks the client's messages as read.
  useEffect(() => {
    if (activeClientId && unreadInThread > 0) markThreadRead(activeClientId);
  }, [activeClientId, unreadInThread, markThreadRead]);

  // Keep the newest message in view.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [activeClientId, thread.length]);

  function send() {
    if (!session || !activeClientId || !draft.trim()) return;
    reply.mutate(
      { clientId: activeClientId, adminId: session.user.id, body: draft.trim() },
      { onSuccess: () => setDraft("") },
    );
  }

  return (
    <div className="flex h-screen">
      <Seo title="Messages | M. R. Services Admin" description="Reply to client messages across every thread." />

      <aside className="w-72 shrink-0 overflow-y-auto border-r border-neutral-200 bg-white p-4">
        <h2 className="font-heading text-lg font-semibold text-neutral-900">Conversations</h2>
        {clientIds.length === 0 && <p className="mt-3 text-sm text-neutral-400">No messages yet.</p>}
        {clientIds.map((id) => {
          const last = lastMessage(id);
          const unread = unreadCount(id);
          return (
            <button
              key={id}
              onClick={() => setActiveClientId(id)}
              className={cn(
                "mt-2 block w-full rounded-md px-3 py-2 text-left text-sm",
                activeClientId === id ? "bg-accent-100" : "hover:bg-neutral-100",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-neutral-900">{nameOf(id)}</p>
                {unread > 0 && (
                  <span className="rounded-full bg-accent-500 px-2 text-xs font-semibold text-white">{unread}</span>
                )}
              </div>
              <p className="truncate text-neutral-400">{last ? last.body : "No messages yet"}</p>
            </button>
          );
        })}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col p-6">
        {activeClientId ? (
          <>
            <h2 className="mb-4 font-heading text-lg font-semibold text-neutral-900">{nameOf(activeClientId)}</h2>
            <div className="flex-1 space-y-3 overflow-y-auto">
              {thread.length === 0 && (
                <p className="text-sm text-neutral-400">No messages yet. Write the first one below.</p>
              )}
              {thread.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "max-w-[70%] rounded-lg px-4 py-2 text-sm",
                    m.sender_role === "admin" ? "ml-auto bg-primary-100" : "bg-neutral-100",
                  )}
                >
                  <p className="whitespace-pre-wrap">{m.body}</p>
                  <p className="mt-1 text-xs text-neutral-400">{timeAgo(m.created_at)}</p>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            {reply.error && <p className="mt-2 text-sm text-danger-500">{errorMessage(reply.error)}</p>}
            <div className="mt-4 flex gap-3">
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={2}
                placeholder="Write a reply..."
                className="flex-1"
              />
              <Button onClick={send} disabled={reply.isPending}>
                {reply.isPending ? "Sending..." : "Reply"}
              </Button>
            </div>
          </>
        ) : (
          <p className="text-neutral-400">Select a conversation to view messages.</p>
        )}
      </div>
    </div>
  );
}

