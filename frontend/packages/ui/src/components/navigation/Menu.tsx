import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "../../lib/utils/cn";

export interface MenuItem {
  /** Unique value identifying the item. */
  id: string;
  /** Item text. */
  label: ReactNode;
  /** Optional leading icon. */
  icon?: ReactNode;
  /** Render as a link. Ignored when the item has `children`. */
  href?: string;
  /** Click handler (ignored when `href` is set). */
  onClick?: () => void;
  /** Disable the item. */
  disabled?: boolean;
  /** Mark as the active item (daisyUI `menu-active`). */
  active?: boolean;
  /** Trailing content, e.g. a `<Badge>` or `<Kbd>`. */
  badge?: ReactNode;
  /** Render a non-interactive section heading (daisyUI `menu-title`). */
  title?: boolean;
  /** Nested submenu items. */
  children?: MenuItem[];
  /** Render a `children` submenu as a collapsible `<details>` instead of a static list. */
  collapsible?: boolean;
  /** Start a `collapsible` submenu open. */
  defaultOpen?: boolean;
}

export type MenuSize = "xs" | "sm" | "md" | "lg" | "xl";

interface MenuProps extends HTMLAttributes<HTMLUListElement> {
  /** Items to render, in order. */
  items: MenuItem[];
  /** Lay the items out in a row (daisyUI `menu-horizontal`) instead of stacked. */
  horizontal?: boolean;
  /** Item size. Defaults to "md". */
  size?: MenuSize;
  ref?: Ref<HTMLUListElement>;
}

const SIZE_CLASS: Record<MenuSize, string> = {
  xs: "menu-xs",
  sm: "menu-sm",
  md: "menu-md",
  lg: "menu-lg",
  xl: "menu-xl",
};

/** The inner row of a leaf item: icon, label, then trailing badge. */
function ItemBody({ item }: { item: MenuItem }) {
  return (
    <>
      {item.icon}
      <span className="grow truncate">{item.label}</span>
      {item.badge}
    </>
  );
}

/** Render one item — a title, a submenu group, or a leaf link / button. */
function renderItem(item: MenuItem) {
  // Section heading, optionally introducing a nested group of children.
  if (item.title) {
    if (item.children?.length) {
      return (
        <li key={item.id}>
          <h2 className="menu-title">{item.label}</h2>
          <ul>{item.children.map(renderItem)}</ul>
        </li>
      );
    }
    return (
      <li key={item.id} className="menu-title">
        {item.label}
      </li>
    );
  }

  // Submenu: collapsible (<details>) or a static nested list.
  if (item.children?.length) {
    if (item.collapsible) {
      return (
        <li key={item.id}>
          <details open={item.defaultOpen}>
            <summary>
              {item.icon}
              {item.label}
            </summary>
            <ul>{item.children.map(renderItem)}</ul>
          </details>
        </li>
      );
    }
    return (
      <li key={item.id}>
        <span className="menu-title">
          {item.icon}
          {item.label}
        </span>
        <ul>{item.children.map(renderItem)}</ul>
      </li>
    );
  }

  // Leaf: link or action button.
  return (
    <li key={item.id}>
      {item.href ? (
        <a
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          aria-disabled={item.disabled || undefined}
          className={cn(item.active && "menu-active", item.disabled && "menu-disabled")}
        >
          <ItemBody item={item} />
        </a>
      ) : (
        <button
          type="button"
          disabled={item.disabled}
          aria-current={item.active ? "page" : undefined}
          className={cn(item.active && "menu-active", item.disabled && "menu-disabled")}
          onClick={item.onClick}
        >
          <ItemBody item={item} />
        </button>
      )}
    </li>
  );
}

/**
 * daisyUI menu — a vertical (or horizontal) list of links / actions rendered
 * from data. Items support a leading `icon`, trailing `badge`, `active` and
 * `disabled` states, section headings (`title`), and nested submenus
 * (`children`, optionally `collapsible`). Defaults to the daisyUI panel look
 * (`bg-base-200 rounded-box`); set a width and override styling via `className`.
 */
export function Menu({ items, horizontal = false, size = "md", className, ...rest }: MenuProps) {
  return (
    <ul
      className={cn(
        "menu bg-base-200 rounded-box",
        horizontal && "menu-horizontal",
        SIZE_CLASS[size],
        className,
      )}
      {...rest}
    >
      {items.map(renderItem)}
    </ul>
  );
}
