import { Link } from "react-router-dom";
import { cn } from "../../lib/utils/cn";
import type { BreadcrumbItem } from "../../types/navigation";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Trail of ancestor links ending at the current page, separated by slashes.
 * Links shift color on hover rather than underlining.
 *
 * Hand-rolled rather than daisyUI's `breadcrumbs`: that component hard-codes
 * its separator as a rotated-border chevron in `li + *::before`, which can
 * only be turned into a slash by unpicking half a dozen of its declarations.
 * It also forces `text-decoration: underline` on hover for every `li > *`,
 * which the items would then have to beat with `!important`. Explicit markup
 * costs a few lines and drops both problems.
 *
 * An item renders as a link when it has an `href` and is not `active`;
 * otherwise it is plain text, since the current page is not a destination.
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn("min-w-0 max-w-full overflow-x-auto text-base", className)}
    >
      <ol className="flex items-center whitespace-nowrap">
        {items.map((item, index) => {
          // The trail's own end is the current page even when no item is
          // flagged, so callers can leave `active` off entirely.
          const isCurrent = item.active ?? index === items.length - 1;
          const Icon = item.icon;
          const content = (
            <>
              {Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />}
              {item.label}
            </>
          );

          return (
            <li key={item.href ?? item.label} className="flex items-center">
              {index > 0 && (
                <span aria-hidden="true" className="text-base-content/40 mx-2">
                  /
                </span>
              )}
              {item.href && !isCurrent ? (
                <Link
                  to={item.href}
                  className="text-base-content/60 hover:text-base-content flex items-center gap-2 transition-colors duration-200 ease-out"
                >
                  {content}
                </Link>
              ) : (
                <span
                  aria-current={isCurrent ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-2",
                    isCurrent ? "text-base-content font-medium" : "text-base-content/60",
                  )}
                >
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
