import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

export default function DashboardCard({
  icon: Icon, label, value, to,
}: { icon: LucideIcon; label: string; value: string | number; to: string }) {
  return (
    <Link to={to} className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <Icon className="h-5 w-5 text-accent-600" strokeWidth={1.75} />
      <p className="mt-3 text-2xl font-semibold text-neutral-900">{value}</p>
      <p className="text-sm text-neutral-700">{label}</p>
    </Link>
  );
}


