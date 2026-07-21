import { useId, useState, type ReactNode } from "react";
import { cn } from "../../lib/utils/cn";
import { Badge } from "../display/Badge";

export interface TabItem {
  /** Unique value identifying the tab. */
  id: string;
  /** Tab label. */
  label: ReactNode;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Optional trailing count, shown as a soft neutral badge. */
  count?: number;
  /** Panel content shown when the tab is active. */
  content?: ReactNode;
  /** Disable the tab. */
  disabled?: boolean;
}

export type TabsVariant = "box" | "border" | "lift";
export type TabsSize = "xs" | "sm" | "md" | "lg" | "xl";

interface TabsProps {
  /** Tabs to render. */
  items: TabItem[];
  /** Active tab id for controlled usage. Pair with `onChange`. */
  value?: string;
  /** Initial active tab id for uncontrolled usage. Defaults to the first tab. */
  defaultValue?: string;
  /** Called with the tab id when the active tab changes. */
  onChange?: (id: string) => void;
  /** Visual style. Defaults to "border". */
  variant?: TabsVariant;
  /** Tab size. Defaults to "md". */
  size?: TabsSize;
  /** Extra classes merged onto the tablist. */
  className?: string;
  /** Extra classes merged onto the active panel wrapper. */
  contentClassName?: string;
}

const VARIANT_CLASS: Record<TabsVariant, string> = {
  box: "tabs-box",
  border: "tabs-border",
  lift: "tabs-lift",
};

const SIZE_CLASS: Record<TabsSize, string> = {
  xs: "tabs-xs",
  sm: "tabs-sm",
  md: "tabs-md",
  lg: "tabs-lg",
  xl: "tabs-xl",
};

/**
 * daisyUI tabs. Works controlled (pass `value` + `onChange`) or uncontrolled
 * (optional `defaultValue`, otherwise the first tab). Each item carries its own
 * panel `content`, rendered below the tablist. Proper tab semantics — roles,
 * `aria-selected`, and roving `tabIndex` — are wired for you.
 */
export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  variant = "border",
  size = "md",
  className,
  contentClassName,
}: TabsProps) {
  const baseId = useId();
  const [internal, setInternal] = useState(defaultValue ?? items[0]?.id);
  // Controlled when `value` is provided, otherwise internal state drives it.
  const active = value ?? internal;

  const select = (id: string) => {
    if (value === undefined) setInternal(id);
    onChange?.(id);
  };

  const activeItem = items.find((item) => item.id === active);

  const tabId = (id: string) => `${baseId}-tab-${id}`;
  const panelId = (id: string) => `${baseId}-panel-${id}`;

  return (
    <div>
      <div
        role="tablist"
        className={cn("tabs", VARIANT_CLASS[variant], SIZE_CLASS[size], className)}
      >
        {items.map((item) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={tabId(item.id)}
              aria-selected={selected}
              aria-controls={item.content != null ? panelId(item.id) : undefined}
              // Roving tabindex: only the active tab is in the tab order.
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              className={cn("tab gap-2", selected && "tab-active", item.disabled && "tab-disabled")}
              onClick={() => select(item.id)}
            >
              {item.icon}
              {item.label}
              {item.count != null && (
                <Badge variant="neutral" soft size="sm">
                  {item.count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {activeItem?.content != null && (
        <div
          role="tabpanel"
          id={panelId(activeItem.id)}
          aria-labelledby={tabId(activeItem.id)}
          className={cn("pt-4", contentClassName)}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
}
