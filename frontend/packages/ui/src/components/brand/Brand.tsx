import mark from "@timo/brand/assets/logos/timo-mark-96.png";

interface BrandProps {
  name: string;
  /** Icon-only when the sidebar is collapsed. */
  collapsed?: boolean;
}

/** Logo mark + wordmark shown at the top of the sidebar. */
export function Brand({ name, collapsed = false }: BrandProps) {
  return (
    <div className="flex items-center gap-2 overflow-hidden">
      <img src={mark} alt={name} className="h-8 w-8 shrink-0" />
      {!collapsed && (
        <span className="text-base-content truncate text-lg font-semibold tracking-tight">
          {name}
        </span>
      )}
    </div>
  );
}
