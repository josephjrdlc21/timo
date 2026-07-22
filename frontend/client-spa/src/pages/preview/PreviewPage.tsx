import { useState } from "react";
import {
  ArrowRight,
  Bell,
  Check,
  Clock,
  Copy,
  CreditCard,
  Download,
  Home,
  LayoutDashboard,
  Pencil,
  Plus,
  Settings,
  Sparkles,
  Star,
  Trash2,
  User,
} from "lucide-react";
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Drawer,
  Dropdown,
  Kbd,
  Loader,
  Menu,
  Modal,
  PageHeader,
  Skeleton,
  Steps,
  Tabs,
  Toast,
  type AlertVariant,
  type AvatarShape,
  type AvatarSize,
  type BadgeSize,
  type BadgeVariant,
  type ButtonSize,
  type ButtonVariant,
  type DrawerSide,
  type KbdSize,
  type LoaderSize,
  type MenuItem,
  type ModalAlign,
  type ModalSize,
  type StepItem,
  type TabItem,
  type TabsVariant,
  type ToastVariant,
} from "@timo/ui";

const VARIANTS: ButtonVariant[] = [
  "neutral",
  "primary",
  "secondary",
  "accent",
  "info",
  "success",
  "warning",
  "error",
  "ghost",
  "link",
];

const SIZES: ButtonSize[] = ["xs", "sm", "md", "lg", "xl"];

const MODAL_SIZES: ModalSize[] = ["sm", "md", "lg", "xl", "full"];
const MODAL_ALIGNS: ModalAlign[] = ["top", "middle", "bottom"];

const BADGE_VARIANTS: BadgeVariant[] = [
  "neutral",
  "primary",
  "secondary",
  "accent",
  "info",
  "success",
  "warning",
  "error",
  "ghost",
];

const BADGE_SIZES: BadgeSize[] = ["xs", "sm", "md", "lg", "xl"];

const AVATAR_SIZES: AvatarSize[] = ["xs", "sm", "md", "lg", "xl"];
const AVATAR_SHAPES: AvatarShape[] = ["circle", "rounded", "square"];

// A stable sample image so the avatar preview isn't blank in demos.
const AVATAR_IMG = "https://i.pravatar.cc/150?img=12";

const STEP_ITEMS: StepItem[] = [
  { id: "cart", label: "Cart" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review" },
];

const MENU_ITEMS: MenuItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" />, href: "#" },
  { id: "profile", label: "Profile", icon: <User className="h-4 w-4" />, href: "#", active: true },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="h-4 w-4" />,
    href: "#",
    badge: <Badge variant="primary" size="sm" label="3" />,
  },
  {
    id: "billing",
    label: "Billing",
    icon: <CreditCard className="h-4 w-4" />,
    href: "#",
    disabled: true,
  },
];

const DRAWER_SIDES: DrawerSide[] = ["left", "right", "top", "bottom"];

const KBD_SIZES: KbdSize[] = ["xs", "sm", "md", "lg", "xl"];

const LOADER_SIZES: LoaderSize[] = ["xs", "sm", "md", "lg", "xl"];

const ALERT_VARIANTS: AlertVariant[] = ["info", "success", "warning", "error"];

const TOAST_VARIANTS: ToastVariant[] = ["info", "success", "warning", "error"];

const TOAST_MESSAGE: Record<ToastVariant, string> = {
  info: "A new statement is available.",
  success: "Your changes have been saved.",
  warning: "Your session expires soon.",
  error: "Something went wrong. Try again.",
};

/** A titled group of preview swatches. */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
        {title}
      </h2>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </section>
  );
}

/** Component gallery for the shared UI Button. */
function ButtonGallery() {
  // Fake an async action so the loading spinner can be seen in context.
  const [saving, setSaving] = useState(false);
  const runSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 2000);
  };

  return (
    <div className="space-y-10">
      <PageHeader title="Button" subtitle="Preview of the shared @timo/ui Button component" />

      <Section title="Variants">
        {VARIANTS.map((variant) => (
          <Button key={variant} variant={variant} label={variant} />
        ))}
      </Section>

      <Section title="Sizes">
        {SIZES.map((size) => (
          <Button key={size} variant="primary" size={size} label={size} />
        ))}
      </Section>

      <Section title="Outline">
        {VARIANTS.filter((v) => v !== "ghost" && v !== "link").map((variant) => (
          <Button key={variant} variant={variant} outline label={variant} />
        ))}
      </Section>

      <Section title="Soft">
        {VARIANTS.filter((v) => v !== "ghost" && v !== "link").map((variant) => (
          <Button key={variant} variant={variant} soft label={variant} />
        ))}
      </Section>

      <Section title="With icons">
        <Button variant="primary" startIcon={<Plus className="h-4 w-4" />} label="Create" />
        <Button
          variant="neutral"
          outline
          startIcon={<Download className="h-4 w-4" />}
          label="Download"
        />
        <Button variant="ghost" endIcon={<ArrowRight className="h-4 w-4" />} label="Next" />
        <Button variant="error" soft startIcon={<Trash2 className="h-4 w-4" />} label="Delete" />
      </Section>

      <Section title="Loading">
        <Button variant="primary" loading label="Loading" />
        <Button variant="neutral" outline loading label="Saving" />
        <Button variant="success" soft loading label="Processing" />
      </Section>

      <Section title="Disabled">
        <Button variant="primary" disabled label="Disabled" />
        <Button variant="neutral" outline disabled label="Disabled" />
      </Section>

      <Section title="Full width">
        <Button variant="primary" block label="Block button" />
      </Section>

      <Section title="Interactive">
        <Button variant="primary" loading={saving} onClick={runSave} label="Save changes" />
      </Section>
    </div>
  );
}

/** Component gallery for the shared UI Modal. */
function ModalGallery() {
  // A single key identifies which demo modal is open (null = all closed).
  const [openKey, setOpenKey] = useState<string | null>(null);
  const close = () => setOpenKey(null);

  return (
    <div className="space-y-10">
      <PageHeader title="Modal" subtitle="Preview of the shared @timo/ui Modal component" />

      <Section title="Basic">
        <Button variant="primary" label="Open modal" onClick={() => setOpenKey("basic")} />
        <Modal
          open={openKey === "basic"}
          onClose={close}
          title="Delete transaction"
          subtitle="This action can't be undone."
          footer={
            <>
              <Button variant="ghost" label="Cancel" onClick={close} />
              <Button variant="error" label="Delete" onClick={close} />
            </>
          }
        >
          <p className="text-base-content/80">
            Are you sure you want to permanently delete this transaction? It will be removed from
            all reports.
          </p>
        </Modal>
      </Section>

      <Section title="Sizes">
        {MODAL_SIZES.map((size) => (
          <div key={size}>
            <Button
              variant="neutral"
              outline
              label={size}
              onClick={() => setOpenKey(`size-${size}`)}
            />
            <Modal
              open={openKey === `size-${size}`}
              onClose={close}
              title={`Size: ${size}`}
              subtitle="The modal-box width scales with the size prop."
              size={size}
              footer={<Button variant="primary" label="Got it" onClick={close} />}
            >
              <p className="text-base-content/80">
                This dialog uses <code className="text-primary">size=&quot;{size}&quot;</code>.
              </p>
            </Modal>
          </div>
        ))}
      </Section>

      <Section title="Alignment">
        {MODAL_ALIGNS.map((align) => (
          <div key={align}>
            <Button
              variant="secondary"
              soft
              label={align}
              onClick={() => setOpenKey(`align-${align}`)}
            />
            <Modal
              open={openKey === `align-${align}`}
              onClose={close}
              title={`Align: ${align}`}
              subtitle="The dialog anchors to the top, middle, or bottom."
              align={align}
              footer={<Button variant="primary" label="Close" onClick={close} />}
            >
              <p className="text-base-content/80">
                This dialog uses <code className="text-primary">align=&quot;{align}&quot;</code>.
              </p>
            </Modal>
          </div>
        ))}
      </Section>

      <Section title="Custom header (JSX)">
        <Button variant="accent" label="Open" onClick={() => setOpenKey("custom-header")} />
        <Modal
          open={openKey === "custom-header"}
          onClose={close}
          titleContent={
            <div className="flex items-center gap-2">
              <Sparkles className="text-accent h-5 w-5" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Upgrade to Pro</h2>
            </div>
          }
          subtitleContent={
            <p className="text-base-content/60 mt-1 text-sm">
              Unlock <span className="text-accent font-medium">unlimited</span> budgets.
            </p>
          }
          footer={
            <>
              <Button variant="ghost" label="Maybe later" onClick={close} />
              <Button variant="accent" label="Upgrade" onClick={close} />
            </>
          }
        >
          <p className="text-base-content/80">
            The header and subtitle are passed as JSX via{" "}
            <code className="text-primary">titleContent</code> and{" "}
            <code className="text-primary">subtitleContent</code>.
          </p>
        </Modal>
      </Section>

      <Section title="Body only (no header, no backdrop close)">
        <Button variant="info" outline label="Open" onClick={() => setOpenKey("body-only")} />
        <Modal
          open={openKey === "body-only"}
          onClose={close}
          showCloseButton={false}
          closeOnBackdrop={false}
          footer={<Button variant="primary" label="Done" onClick={close} />}
        >
          <p className="text-base-content/80">
            No header, no X, and the backdrop won&apos;t close it — the footer button is the only
            way out (plus Escape).
          </p>
        </Modal>
      </Section>
    </div>
  );
}

/** Component gallery for the shared UI Badge. */
function BadgeGallery() {
  return (
    <div className="space-y-10">
      <PageHeader title="Badge" subtitle="Preview of the shared @timo/ui Badge component" />

      <Section title="Variants">
        {BADGE_VARIANTS.map((variant) => (
          <Badge key={variant} variant={variant} label={variant} />
        ))}
      </Section>

      <Section title="Sizes">
        {BADGE_SIZES.map((size) => (
          <Badge key={size} variant="primary" size={size} label={size} />
        ))}
      </Section>

      <Section title="Outline">
        {BADGE_VARIANTS.filter((v) => v !== "ghost").map((variant) => (
          <Badge key={variant} variant={variant} outline label={variant} />
        ))}
      </Section>

      <Section title="Soft">
        {BADGE_VARIANTS.filter((v) => v !== "ghost").map((variant) => (
          <Badge key={variant} variant={variant} soft label={variant} />
        ))}
      </Section>

      <Section title="Dash">
        {BADGE_VARIANTS.filter((v) => v !== "ghost").map((variant) => (
          <Badge key={variant} variant={variant} dash label={variant} />
        ))}
      </Section>

      <Section title="With icon">
        <Badge variant="success" icon={<Check className="h-3 w-3" />} label="Paid" />
        <Badge variant="warning" soft icon={<Clock className="h-3 w-3" />} label="Pending" />
        <Badge variant="error" outline icon={<Trash2 className="h-3 w-3" />} label="Overdue" />
        <Badge variant="accent" icon={<Star className="h-3 w-3" />} label="Featured" />
      </Section>
    </div>
  );
}

/** Component gallery for the shared UI Avatar. */
function AvatarGallery() {
  return (
    <div className="space-y-10">
      <PageHeader title="Avatar" subtitle="Preview of the shared @timo/ui Avatar component" />

      <Section title="Sizes (image)">
        {AVATAR_SIZES.map((size) => (
          <Avatar key={size} size={size} src={AVATAR_IMG} alt="Sample user" />
        ))}
      </Section>

      <Section title="Shapes (image)">
        {AVATAR_SHAPES.map((shape) => (
          <Avatar key={shape} shape={shape} size="lg" src={AVATAR_IMG} alt="Sample user" />
        ))}
      </Section>

      <Section title="Initials fallback">
        {AVATAR_SIZES.map((size) => (
          <Avatar key={size} size={size} name="Joseph Dela Cruz" />
        ))}
      </Section>

      <Section title="Icon fallback (no name)">
        <Avatar size="lg" />
        <Avatar size="lg" shape="rounded" icon={<Star className="h-1/2 w-1/2" />} />
      </Section>

      <Section title="Presence ring">
        <Avatar size="lg" src={AVATAR_IMG} alt="Online user" status="online" />
        <Avatar size="lg" name="Ada Lovelace" status="online" />
        <Avatar size="lg" name="Alan Turing" status="offline" />
      </Section>
    </div>
  );
}

/** Component gallery for the shared UI Steps. */
function StepsGallery() {
  // Drive the interactive tracker with a single index.
  const [current, setCurrent] = useState(1);
  const last = STEP_ITEMS.length - 1;

  return (
    <div className="space-y-10">
      <PageHeader title="Steps" subtitle="Preview of the shared @timo/ui Steps component" />

      <Section title="Colors">
        <Steps items={STEP_ITEMS} current={1} color="primary" />
        <Steps items={STEP_ITEMS} current={2} color="success" />
        <Steps items={STEP_ITEMS} current={2} color="warning" />
      </Section>

      <Section title="Custom markers (data-content)">
        <Steps
          color="success"
          current={3}
          items={[
            { id: "signed", label: "Signed up", marker: "✓" },
            { id: "verified", label: "Verified", marker: "✓" },
            { id: "profile", label: "Profile", marker: "✓" },
            { id: "done", label: "Done", marker: "★" },
          ]}
        />
      </Section>

      <Section title="Vertical">
        <Steps vertical items={STEP_ITEMS} current={1} />
      </Section>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Interactive
        </h2>
        <Steps items={STEP_ITEMS} current={current} />
        <div className="flex gap-3">
          <Button
            variant="neutral"
            outline
            label="Back"
            disabled={current === 0}
            onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          />
          <Button
            variant="primary"
            label="Next"
            disabled={current === last}
            onClick={() => setCurrent((c) => Math.min(last, c + 1))}
          />
        </div>
      </section>
    </div>
  );
}

/** Component gallery for the shared UI Menu. */
function MenuGallery() {
  return (
    <div className="space-y-10">
      <PageHeader title="Menu" subtitle="Preview of the shared @timo/ui Menu component" />

      <Section title="Basic (icons, active, badge & disabled)">
        <Menu items={MENU_ITEMS} className="w-56" />
      </Section>

      <Section title="Horizontal">
        <Menu
          horizontal
          className="w-auto"
          items={[
            { id: "home", label: "Home", icon: <Home className="h-4 w-4" />, href: "#" },
            {
              id: "settings",
              label: "Settings",
              icon: <Settings className="h-4 w-4" />,
              href: "#",
            },
            { id: "help", label: "Help", href: "#" },
          ]}
        />
      </Section>

      <Section title="With titles & a collapsible submenu">
        <Menu
          className="w-64"
          items={[
            { id: "account-title", label: "Account", title: true },
            { id: "profile2", label: "Profile", icon: <User className="h-4 w-4" />, href: "#" },
            {
              id: "billing2",
              label: "Billing",
              icon: <CreditCard className="h-4 w-4" />,
              href: "#",
            },
            {
              id: "settings-group",
              label: "Settings",
              icon: <Settings className="h-4 w-4" />,
              collapsible: true,
              defaultOpen: true,
              children: [
                { id: "general", label: "General", href: "#" },
                { id: "security", label: "Security", href: "#" },
                { id: "notifications2", label: "Notifications", href: "#" },
              ],
            },
          ]}
        />
      </Section>

      <Section title="Sizes">
        {(["xs", "sm", "md", "lg"] as const).map((size) => (
          <Menu
            key={size}
            size={size}
            className="w-40"
            items={[
              { id: `${size}-a`, label: "Overview", href: "#", active: true },
              { id: `${size}-b`, label: "Activity", href: "#" },
              { id: `${size}-c`, label: "Reports", href: "#" },
            ]}
          />
        ))}
      </Section>
    </div>
  );
}

/** Component gallery for the shared UI Drawer. */
function DrawerGallery() {
  // A single key identifies which demo drawer is open (null = all closed).
  const [openKey, setOpenKey] = useState<string | null>(null);
  const close = () => setOpenKey(null);

  return (
    <div className="space-y-10">
      <PageHeader title="Drawer" subtitle="Preview of the shared @timo/ui Drawer component" />

      <Section title="Sides">
        {DRAWER_SIDES.map((side) => (
          <div key={side}>
            <Button variant="primary" label={side} onClick={() => setOpenKey(`side-${side}`)} />
            <Drawer
              open={openKey === `side-${side}`}
              onClose={close}
              side={side}
              title={`Drawer: ${side}`}
              subtitle="Slides in from the chosen edge."
              footer={
                <>
                  <Button variant="ghost" label="Cancel" onClick={close} />
                  <Button variant="primary" label="Save" onClick={close} />
                </>
              }
            >
              <p className="text-base-content/80">
                This drawer uses <code className="text-primary">side=&quot;{side}&quot;</code>. The
                header stays put, this body scrolls, and the footer is pinned to the bottom.
              </p>
            </Drawer>
          </div>
        ))}
      </Section>

      <Section title="Custom header (JSX) + no backdrop close">
        <Button variant="accent" label="Open filters" onClick={() => setOpenKey("filters")} />
        <Drawer
          open={openKey === "filters"}
          onClose={close}
          side="left"
          size="sm"
          closeOnBackdrop={false}
          titleContent={
            <div className="flex items-center gap-2">
              <Sparkles className="text-accent h-5 w-5" aria-hidden="true" />
              <h2 className="text-lg font-semibold">Filters</h2>
            </div>
          }
          footer={<Button variant="accent" block label="Apply" onClick={close} />}
        >
          <p className="text-base-content/80">
            The header is JSX via <code className="text-primary">titleContent</code>, and the
            backdrop won&apos;t close it — use the X, Escape, or Apply.
          </p>
        </Drawer>
      </Section>
    </div>
  );
}

/** Component gallery for the shared UI Card. */
function CardGallery() {
  return (
    <div className="space-y-10">
      <PageHeader title="Card" subtitle="Preview of the shared @timo/ui Card component" />

      <div className="grid gap-6 sm:grid-cols-2">
        <Card
          title="Monthly budget"
          subtitle="July 2026"
          footer={
            <>
              <Button variant="ghost" size="sm" label="Details" />
              <Button variant="primary" size="sm" label="Add expense" />
            </>
          }
        >
          <p className="text-base-content/80">
            You&apos;ve spent <span className="font-semibold">$1,240</span> of your{" "}
            <span className="font-semibold">$2,000</span> budget this month.
          </p>
        </Card>

        <Card
          bordered
          titleContent={
            <h2 className="card-title">
              Pro plan{" "}
              <Badge
                variant="accent"
                size="sm"
                icon={<Star className="h-3 w-3" />}
                label="Popular"
              />
            </h2>
          }
          subtitle="Everything you need to scale"
          footer={<Button variant="accent" size="sm" block label="Upgrade" />}
        >
          <p className="text-base-content/80">
            Bordered card with a JSX title (<code className="text-primary">titleContent</code>)
            embedding a Badge.
          </p>
        </Card>

        <Card
          dash
          size="sm"
          title="Compact + dashed"
          footer={<Button variant="neutral" outline size="sm" label="Okay" />}
        >
          <p className="text-base-content/80">
            A `size=&quot;sm&quot;` card with the dashed style.
          </p>
        </Card>

        <Card
          side
          image={
            <div className="bg-primary/15 text-primary grid w-24 place-items-center">
              <Download className="h-6 w-6" aria-hidden="true" />
            </div>
          }
          title="Side layout"
          subtitle="Figure beside the body"
        >
          <p className="text-base-content/80">
            Uses `side` to place the figure alongside the body.
          </p>
        </Card>
      </div>
    </div>
  );
}

/** Component gallery for the shared UI Dropdown. */
function DropdownGallery() {
  const actions = [
    { label: "Edit", icon: <Pencil className="h-4 w-4" /> },
    { label: "Duplicate", icon: <Copy className="h-4 w-4" /> },
    { label: "Share", icon: <ArrowRight className="h-4 w-4" /> },
    { label: "Delete", icon: <Trash2 className="h-4 w-4" />, danger: true },
  ];

  return (
    <div className="space-y-10">
      <PageHeader title="Dropdown" subtitle="Preview of the shared @timo/ui Dropdown component" />

      <Section title="Text trigger">
        <Dropdown label="Actions" items={actions} />
      </Section>

      <Section title="Icon trigger (ellipsis)">
        <Dropdown ariaLabel="Row actions" items={actions} />
      </Section>

      <Section title="End-aligned">
        <Dropdown label="Aligned end" align="end" items={actions} />
      </Section>

      <Section title="With a disabled item">
        <Dropdown
          label="More"
          items={[
            { label: "Download", icon: <Download className="h-4 w-4" /> },
            { label: "Archive (soon)", disabled: true },
            { label: "Delete", icon: <Trash2 className="h-4 w-4" />, danger: true },
          ]}
        />
      </Section>
    </div>
  );
}

const TAB_VARIANTS: TabsVariant[] = ["box", "border", "lift"];

const TAB_ITEMS: TabItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: <Star className="h-4 w-4" />,
    content: <p className="text-base-content/80">Your account summary at a glance.</p>,
  },
  {
    id: "activity",
    label: "Activity",
    icon: <Clock className="h-4 w-4" />,
    count: 12,
    content: <p className="text-base-content/80">Recent transactions and events.</p>,
  },
  {
    id: "settings",
    label: "Settings",
    content: <p className="text-base-content/80">Manage preferences and security.</p>,
  },
  { id: "archived", label: "Archived", count: 3, disabled: true },
];

/** Component gallery for the shared UI Tabs. */
function TabsGallery() {
  return (
    <div className="space-y-10">
      <PageHeader title="Tabs" subtitle="Preview of the shared @timo/ui Tabs component" />

      {TAB_VARIANTS.map((variant) => (
        <section key={variant} className="space-y-3">
          <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
            {variant}
          </h2>
          <Tabs variant={variant} items={TAB_ITEMS} />
        </section>
      ))}
    </div>
  );
}

/** Component gallery for the shared UI Kbd. */
function KbdGallery() {
  return (
    <div className="space-y-10">
      <PageHeader title="Kbd" subtitle="Preview of the shared @timo/ui Kbd component" />

      <Section title="Sizes">
        {KBD_SIZES.map((size) => (
          <Kbd key={size} size={size} label={size} />
        ))}
      </Section>

      <Section title="Combos">
        <span className="flex items-center gap-1">
          <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd>
        </span>
        <span className="flex items-center gap-1">
          <Kbd>⌘</Kbd> + <Kbd>⇧</Kbd> + <Kbd>P</Kbd>
        </span>
      </Section>

      <Section title="In text">
        <p className="text-base-content/80">
          Press <Kbd size="sm">Esc</Kbd> to close, or <Kbd size="sm">Enter</Kbd> to confirm.
        </p>
      </Section>
    </div>
  );
}

/** Component gallery for the shared UI Loader. */
function LoaderGallery() {
  return (
    <div className="space-y-10">
      <PageHeader title="Loader" subtitle="Preview of the shared @timo/ui Loader component" />

      <Section title="Sizes">
        {LOADER_SIZES.map((size) => (
          <Loader key={size} size={size} />
        ))}
      </Section>

      <Section title="Colors (via className)">
        <Loader className="text-primary" />
        <Loader className="text-secondary" />
        <Loader className="text-accent" />
        <Loader className="text-success" />
        <Loader className="text-error" />
      </Section>

      <Section title="In context">
        <Button variant="primary" disabled>
          <Loader size="sm" className="text-primary-content" /> Loading
        </Button>
      </Section>
    </div>
  );
}

/** Component gallery for the shared UI Skeleton. */
function SkeletonGallery() {
  return (
    <div className="space-y-10">
      <PageHeader title="Skeleton" subtitle="Preview of the shared @timo/ui Skeleton component" />

      <Section title="Shapes">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-16 w-32" />
        <Skeleton circle className="h-16 w-16" />
      </Section>

      <Section title="Text lines">
        <div className="w-full max-w-sm space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
      </Section>

      <Section title="Card placeholder">
        <div className="flex w-full max-w-sm items-center gap-4" aria-busy="true">
          <Skeleton circle width={56} height={56} />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      </Section>
    </div>
  );
}

/** Component gallery for the shared UI Alert. */
function AlertGallery() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="space-y-10">
      <PageHeader title="Alert" subtitle="Preview of the shared @timo/ui Alert component" />

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Variants
        </h2>
        <div className="space-y-2">
          {ALERT_VARIANTS.map((variant) => (
            <Alert
              key={variant}
              variant={variant}
              title={variant.charAt(0).toUpperCase() + variant.slice(1)}
              message={`This is a ${variant} alert with its default icon.`}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Soft
        </h2>
        <div className="space-y-2">
          {ALERT_VARIANTS.map((variant) => (
            <Alert key={variant} variant={variant} soft message={`Soft ${variant} alert.`} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Outline
        </h2>
        <div className="space-y-2">
          {ALERT_VARIANTS.map((variant) => (
            <Alert key={variant} variant={variant} outline message={`Outline ${variant} alert.`} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Dash
        </h2>
        <div className="space-y-2">
          {ALERT_VARIANTS.map((variant) => (
            <Alert key={variant} variant={variant} dash message={`Dashed ${variant} alert.`} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Neutral, actions & dismiss
        </h2>
        <div className="space-y-2">
          <Alert message="A neutral base alert (no variant, no icon)." />
          <Alert
            variant="warning"
            title="Unsaved changes"
            message="You have unsaved changes on this page."
            action={
              <>
                <Button variant="ghost" size="sm" label="Discard" />
                <Button variant="warning" size="sm" label="Save" />
              </>
            }
          />
          {!dismissed && (
            <Alert
              variant="success"
              message="Dismissible — click the X to close."
              onClose={() => setDismissed(true)}
            />
          )}
        </div>
      </section>
    </div>
  );
}

/** Component gallery for the shared UI Toast. */
function ToastGallery() {
  // Track which variant's toast is currently shown (null = none).
  const [shown, setShown] = useState<ToastVariant | null>(null);

  return (
    <div className="space-y-10">
      <PageHeader title="Toast" subtitle="Preview of the shared @timo/ui Toast component" />

      <Section title="Variants (click to show — each auto-dismisses)">
        {TOAST_VARIANTS.map((variant) => (
          <Button
            key={variant}
            variant={variant === "info" ? "info" : variant}
            soft
            label={variant}
            onClick={() => setShown(variant)}
          />
        ))}
      </Section>

      {/* One Toast at a time, bottom-end, auto-dismissing after 3s. */}
      {shown && (
        <Toast
          open
          variant={shown}
          title={shown.charAt(0).toUpperCase() + shown.slice(1)}
          message={TOAST_MESSAGE[shown]}
          duration={3000}
          onClose={() => setShown(null)}
        />
      )}
    </div>
  );
}

/** Component gallery for shared @timo/ui components. */
export function PreviewPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-16 pb-10">
      <ButtonGallery />
      <ModalGallery />
      <BadgeGallery />
      <AvatarGallery />
      <StepsGallery />
      <MenuGallery />
      <DrawerGallery />
      <CardGallery />
      <DropdownGallery />
      <TabsGallery />
      <KbdGallery />
      <LoaderGallery />
      <SkeletonGallery />
      <AlertGallery />
      <ToastGallery />
    </div>
  );
}
