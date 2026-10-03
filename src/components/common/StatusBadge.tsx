import { cn } from "@/lib/utils";

type Status = "received" | "in_progress" | "completed" | "new" | "contacted" | "closed";

const STATUS_CONFIG: Record<Status, { label: string; className: string }> = {
  received: { label: "Received", className: "bg-primary-100 text-primary-700" },
  in_progress: { label: "In Progress", className: "bg-accent-100 text-warning-500" },
  completed: { label: "Completed", className: "bg-teal-100 text-teal-500" },
  new: { label: "New", className: "bg-accent-100 text-accent-600" },
  contacted: { label: "Contacted", className: "bg-primary-100 text-primary-700" },
  closed: { label: "Closed", className: "bg-neutral-100 text-neutral-700" },
};

export default function StatusBadge({ status }: { status: Status }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      data-testid="status-badge"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium",
        config.className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {config.label}
    </span>
  );
}

