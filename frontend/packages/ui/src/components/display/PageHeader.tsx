import type { ReactNode } from "react";
import { cn } from "../../lib/utils/cn";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /**
   * Trailing controls, laid out in a row on the right. A slot rather than a
   * list of button descriptors, so call sites keep using daisyUI's `btn`
   * classes directly and non-button actions (links, dropdowns) still fit.
   */
  actions?: ReactNode;
  className?: string;
}

/** Page masthead: title + optional subtitle, with actions on the right. */
export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <h1 className="text-base-content text-4xl font-bold tracking-tight sm:text-5xl">{title}</h1>
        {subtitle && <p className="text-base-content/60 mt-2 text-base">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
