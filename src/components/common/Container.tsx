import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Container({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6",
        wide ? "max-w-[1440px]" : "max-w-[1200px]",
        className,
      )}
    >
      {children}
    </div>
  );
}


