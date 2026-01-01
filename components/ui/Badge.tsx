import { clsx } from "clsx";
import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  color?: "brand" | "gray" | "success" | "warning" | "danger";
}

const colorMap: Record<NonNullable<BadgeProps["color"]>, string> = {
  brand: "bg-brand-100 text-brand-700",
  gray: "bg-slate-200 text-slate-700",
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700"
};

export function Badge({ children, color = "brand" }: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        colorMap[color]
      )}
    >
      {children}
    </span>
  );
}
