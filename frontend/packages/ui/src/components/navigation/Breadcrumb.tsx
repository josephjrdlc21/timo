import { Link } from "react-router-dom";
import { cn } from "../../lib/utils/cn";
import type { BreadcrumbItem } from "../../types/navigation";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Trail of ancestor links ending at the current page, built on daisyUI's
 * `breadcrumbs` component — the separators are drawn by its `li + *::before`
 * rule, so there is no separator markup here.
 *
 * An item renders as a link when it has an `href` and is not `active`;
 * otherwise it is plain text, since the current page is not a destination.
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("breadcrumbs min-w-0 py-0 text-sm", className)}>
      <ol>
        {items.map((item, index) => {
          // The trail's own end is the current page even when no item is
          // flagged, so callers can leave `active` off entirely.
          const isCurrent = item.active ?? index === items.length - 1;

          return (
            <li key={item.href ?? item.label}>
              {item.href && !isCurrent ? (
                <Link
                  to={item.href}
                  className="text-base-content/60 hover:text-base-content transition-colors duration-200 ease-out"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  // daisyUI styles every `li > *` as clickable. These two beat
                  // it on specificity so the current page doesn't pretend to be
                  // a link.
                  className={cn(
                    "cursor-default! hover:no-underline!",
                    isCurrent ? "text-base-content font-medium" : "text-base-content/60",
                  )}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
