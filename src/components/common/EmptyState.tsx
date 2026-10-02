import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border
                     border-neutral-200 bg-white px-6 py-14 text-center">
      <Icon className="mb-4 h-10 w-10 text-neutral-400" strokeWidth={1.5} />
      <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-neutral-700">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-6">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}



