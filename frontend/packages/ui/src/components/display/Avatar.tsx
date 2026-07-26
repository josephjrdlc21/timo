import type { HTMLAttributes, ReactNode, Ref } from "react";
import { User } from "lucide-react";
import { cn } from "../../lib/utils/cn";

export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
export type AvatarShape = "circle" | "rounded" | "square";
/** daisyUI presence ring (`avatar-online` / `avatar-offline`). */
export type AvatarStatus = "online" | "offline";

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /** Image URL. When omitted, the initials / icon fallback is shown instead. */
  src?: string;
  /** Alt text for the image (also the accessible label). Falls back to `name`. */
  alt?: string;
  /** Display name. Its initials render in the placeholder when there's no `src`. */
  name?: string;
  /** Avatar size. Defaults to "md". */
  size?: AvatarSize;
  /** Corner shape. Defaults to "circle". */
  shape?: AvatarShape;
  /** Presence ring drawn around the avatar. Omit for none. */
  status?: AvatarStatus;
  /** Icon fallback used when there's neither `src` nor `name`. Defaults to a user glyph. */
  icon?: ReactNode;
  ref?: Ref<HTMLDivElement>;
}

const SIZE_CLASS: Record<AvatarSize, string> = {
  xs: "h-8 w-8",
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

const TEXT_CLASS: Record<AvatarSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
  xl: "text-3xl",
};

const SHAPE_CLASS: Record<AvatarShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-xl",
  square: "rounded-none",
};

const STATUS_CLASS: Record<AvatarStatus, string> = {
  online: "avatar-online",
  offline: "avatar-offline",
};

/** First letter of the first and last words, upper-cased (max two characters). */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "";
  const first = words[0].charAt(0);
  const last = words.length > 1 ? words[words.length - 1].charAt(0) : "";
  return (first + last).toUpperCase();
}

/**
 * daisyUI avatar with an image, or a placeholder that falls back to the `name`'s
 * initials (and then to an icon). Size, shape, and an optional presence ring map
 * straight onto daisyUI classes. The placeholder uses the daisyUI
 * `avatar-placeholder` treatment; extra props (e.g. `onClick`) forward to the
 * root element.
 */
export function Avatar({
  src,
  alt,
  name,
  size = "md",
  shape = "circle",
  status,
  icon,
  className,
  ref,
  ...rest
}: AvatarProps) {
  const initials = name ? initialsOf(name) : "";
  const label = alt ?? name;

  return (
    <div
      ref={ref}
      className={cn(
        "avatar",
        !src && "avatar-placeholder",
        status && STATUS_CLASS[status],
        className,
      )}
      {...rest}
    >
      <div
        className={cn(
          SIZE_CLASS[size],
          SHAPE_CLASS[shape],
          !src && "bg-neutral text-neutral-content",
        )}
      >
        {src ? (
          <img src={src} alt={label ?? ""} className="h-full w-full object-cover" />
        ) : initials ? (
          <span className={TEXT_CLASS[size]} aria-label={label}>
            {initials}
          </span>
        ) : (
          (icon ?? <User className="h-1/2 w-1/2" aria-label={label} />)
        )}
      </div>
    </div>
  );
}
