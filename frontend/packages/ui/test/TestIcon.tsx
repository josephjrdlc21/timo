import { forwardRef } from "react";
import type { LucideIcon, LucideProps } from "lucide-react";

/**
 * Stand-in for a lucide glyph in tests. Nav and breadcrumb items type their
 * icon as `LucideIcon`, which is a `ForwardRefExoticComponent` — a plain
 * `() => <svg />` does not satisfy it. This matches the real shape so the
 * fixtures type-check without casts.
 *
 * `size` and `absoluteStrokeWidth` are lucide's own props, not SVG attributes,
 * so they are dropped rather than spread onto the element.
 */
export const TestIcon: LucideIcon = forwardRef<SVGSVGElement, LucideProps>(function TestIcon(
  { size: _size, absoluteStrokeWidth: _absoluteStrokeWidth, ...rest },
  ref,
) {
  return <svg ref={ref} data-testid="icon" {...rest} />;
});
