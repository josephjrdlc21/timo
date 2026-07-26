import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  ArrowRight,
  Bell,
  Calendar,
  Check,
  Clock,
  Copy,
  CreditCard,
  Download,
  FileText,
  Hash,
  Home,
  Inbox,
  LayoutDashboard,
  Lock,
  Mail,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ServerCrash,
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
  ConfirmModal,
  Drawer,
  Dropdown,
  Dropzone,
  EmptyState,
  ErrorState,
  InputField,
  Kbd,
  Loader,
  Menu,
  Modal,
  NumberField,
  OTPField,
  PageHeader,
  PasswordField,
  RadioField,
  RangeField,
  SelectField,
  Skeleton,
  Steps,
  Tabs,
  TextAreaField,
  Toast,
  ToggleField,
  CheckboxField,
  DateField,
  FileUploadField,
  type AlertVariant,
  type AvatarShape,
  type AvatarSize,
  type BadgeSize,
  type BadgeVariant,
  type ButtonSize,
  type ButtonVariant,
  type DrawerSide,
  type EmptyStateSize,
  type ErrorStateSize,
  type InputFieldSize,
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

const EMPTY_STATE_SIZES: EmptyStateSize[] = ["sm", "md", "lg"];

const ERROR_STATE_SIZES: ErrorStateSize[] = ["sm", "md", "lg"];

const INPUT_FIELD_SIZES: InputFieldSize[] = ["xs", "sm", "md", "lg", "xl"];

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

/** Component gallery for the shared UI ConfirmModal. */
function ConfirmModalGallery() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [deleted, setDeleted] = useState(false);
  const close = () => setOpenKey(null);

  // Fake an async delete so the confirm button's loading state is visible.
  const fakeAsync = () =>
    new Promise<void>((resolve) => {
      setTimeout(() => {
        setDeleted(true);
        resolve();
        close();
      }, 1500);
    });

  return (
    <div className="space-y-10">
      <PageHeader
        title="ConfirmModal"
        subtitle="Preview of the shared @timo/ui ConfirmModal component"
      />

      <Section title="Confirm (default)">
        <Button variant="primary" label="Publish…" onClick={() => setOpenKey("confirm")} />
        <ConfirmModal
          open={openKey === "confirm"}
          onClose={close}
          onConfirm={close}
          title="Publish this report?"
          description="Everyone in your workspace will be able to see it."
          confirmLabel="Publish"
        />
      </Section>

      <Section title="Danger (delete)">
        <Button
          variant="error"
          soft
          startIcon={<Trash2 className="h-4 w-4" />}
          label="Delete account"
          onClick={() => setOpenKey("danger")}
        />
        <ConfirmModal
          open={openKey === "danger"}
          onClose={close}
          onConfirm={close}
          variant="danger"
          title="Delete account?"
          description="This permanently removes the account and all of its data. This action can't be undone."
        />
      </Section>

      <Section title="Danger + async loading">
        <Button
          variant="error"
          startIcon={<Trash2 className="h-4 w-4" />}
          label="Delete transaction"
          onClick={() => setOpenKey("async")}
        />
        <ConfirmModal
          open={openKey === "async"}
          onClose={close}
          onConfirm={fakeAsync}
          variant="danger"
          description="Deleting this transaction takes a moment — the dialog locks until it finishes."
        />
        {deleted && <span className="text-success text-sm">✓ Deleted</span>}
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

/** Component gallery for the shared UI EmptyState. */
function EmptyStateGallery() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="EmptyState"
        subtitle="Preview of the shared @timo/ui EmptyState component"
      />

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          With icon, title, description & action
        </h2>
        <EmptyState
          icon={<Inbox />}
          title="No transactions yet"
          description="Once you add your first transaction, it'll show up right here."
          action={
            <Button
              variant="primary"
              startIcon={<Plus className="h-4 w-4" />}
              label="Add transaction"
            />
          }
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Multiple actions
        </h2>
        <EmptyState
          icon={<Search />}
          title="No results found"
          description="We couldn't find anything matching your filters. Try broadening your search."
          action={
            <>
              <Button variant="neutral" outline label="Clear filters" />
              <Button variant="primary" label="New search" />
            </>
          }
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Text only (no icon, no action)
        </h2>
        <EmptyState title="Nothing here" description="This space is empty for now." />
      </section>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Sizes
        </h2>
        <div className="space-y-4">
          {EMPTY_STATE_SIZES.map((size) => (
            <EmptyState
              key={size}
              size={size}
              icon={<FileText />}
              title={`Size: ${size}`}
              description="Padding and icon scale with the size prop."
              action={<Button variant="primary" size="sm" label="Create" />}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/** Component gallery for the shared UI ErrorState. */
function ErrorStateGallery() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="ErrorState"
        subtitle="Preview of the shared @timo/ui ErrorState component"
      />

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Default (warning icon, retry action)
        </h2>
        <ErrorState
          description="We couldn't load your transactions. Please try again."
          action={
            <Button variant="error" startIcon={<RotateCcw className="h-4 w-4" />} label="Retry" />
          }
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Custom icon, title & multiple actions
        </h2>
        <ErrorState
          icon={<ServerCrash />}
          title="Server unavailable"
          description="The server didn't respond. Check your connection or contact support if this keeps happening."
          action={
            <>
              <Button variant="neutral" outline label="Contact support" />
              <Button variant="error" startIcon={<RotateCcw className="h-4 w-4" />} label="Retry" />
            </>
          }
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Text only (icon hidden, no action)
        </h2>
        <ErrorState
          icon={null}
          title="Failed to save"
          description="Your changes could not be saved."
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Sizes
        </h2>
        <div className="space-y-4">
          {ERROR_STATE_SIZES.map((size) => (
            <ErrorState
              key={size}
              size={size}
              title={`Size: ${size}`}
              description="Padding and icon scale with the size prop."
              action={<Button variant="error" size="sm" label="Retry" />}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

/** Shape of the react-hook-form demo below. */
interface SignInForm {
  email: string;
  username: string;
}

/** Component gallery for the shared UI InputField. */
function InputFieldGallery() {
  // A plain uncontrolled/controlled demo without react-hook-form.
  const [search, setSearch] = useState("");

  // The react-hook-form demo — InputField wires up via {...register(...)}.
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInForm>({ defaultValues: { email: "", username: "" } });
  const [submitted, setSubmitted] = useState<SignInForm | null>(null);

  return (
    <div className="space-y-10">
      <PageHeader
        title="InputField"
        subtitle="Preview of the shared @timo/ui InputField component"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
            With label
          </h2>
          <InputField label="Full name" placeholder="Jane Doe" />
        </section>

        <section className="space-y-3">
          <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
            Without label
          </h2>
          <InputField placeholder="No label, just a field" />
        </section>

        <section className="space-y-3">
          <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
            With leading icon
          </h2>
          <InputField label="Email" startIcon={<Mail />} placeholder="you@example.com" />
        </section>

        <section className="space-y-3">
          <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
            Controlled + icon (no RHF)
          </h2>
          <InputField
            label="Search"
            startIcon={<Search />}
            placeholder="Type to search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <p className="text-base-content/60 text-sm">
            Value: <code className="text-primary">{search || "—"}</code>
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
            Error state
          </h2>
          <InputField
            label="Email"
            startIcon={<Mail />}
            defaultValue="not-an-email"
            error="Enter a valid email address."
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
            Helper text & disabled
          </h2>
          <InputField label="Username" hint="Letters, numbers, and underscores only." />
          <InputField label="Read only" defaultValue="Locked value" disabled />
        </section>
      </div>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Sizes
        </h2>
        <div className="space-y-3">
          {INPUT_FIELD_SIZES.map((size) => (
            <InputField key={size} size={size} startIcon={<User />} placeholder={`Size: ${size}`} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          With react-hook-form (register + validation)
        </h2>
        <form
          className="max-w-sm space-y-3"
          onSubmit={handleSubmit((data) => setSubmitted(data))}
          noValidate
        >
          <InputField
            label="Email"
            startIcon={<Mail />}
            placeholder="you@example.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required.",
              pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "Enter a valid email." },
            })}
          />
          <InputField
            label="Username"
            startIcon={<User />}
            placeholder="jane_doe"
            error={errors.username?.message}
            {...register("username", {
              required: "Username is required.",
              minLength: { value: 3, message: "At least 3 characters." },
            })}
          />
          <Button type="submit" variant="primary" label="Submit" />
        </form>
        {submitted && (
          <p className="text-success text-sm">
            Submitted: <code>{JSON.stringify(submitted)}</code>
          </p>
        )}
      </section>
    </div>
  );
}

/** Component gallery for the shared UI NumberField. */
function NumberFieldGallery() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="NumberField"
        subtitle="Preview of the shared @timo/ui NumberField component"
      />
      <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
        <NumberField label="Quantity" startIcon={<Hash />} defaultValue={1} min={0} step={1} />
        <NumberField
          label="Amount"
          placeholder="0.00"
          min={0}
          step={0.01}
          hint="Two decimal places."
        />
        <NumberField label="Age" defaultValue={200} max={120} error="Must be 120 or below." />
        <NumberField label="Read only" defaultValue={42} disabled />
      </div>
    </div>
  );
}

/** Component gallery for the shared UI PasswordField. */
function PasswordFieldGallery() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="PasswordField"
        subtitle="Preview of the shared @timo/ui PasswordField component"
      />
      <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
        <PasswordField label="Password" startIcon={<Lock />} placeholder="••••••••" />
        <PasswordField
          label="With hint"
          startIcon={<Lock />}
          hint="At least 8 characters."
          defaultValue="secret123"
        />
        <PasswordField
          label="Error state"
          startIcon={<Lock />}
          defaultValue="123"
          error="Password is too short."
        />
        <PasswordField label="No toggle button" startIcon={<Lock />} hideToggle />
      </div>
    </div>
  );
}

/** Component gallery for the shared UI TextAreaField. */
function TextAreaFieldGallery() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="TextAreaField"
        subtitle="Preview of the shared @timo/ui TextAreaField component"
      />
      <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
        <TextAreaField label="Bio" placeholder="Tell us about yourself…" rows={4} />
        <TextAreaField
          label="Notes"
          hint="Markdown is supported."
          defaultValue="- First note"
          rows={4}
        />
        <TextAreaField
          label="Feedback"
          error="This field is required."
          rows={4}
          containerClassName="sm:col-span-2"
        />
      </div>
    </div>
  );
}

/** Component gallery for the shared UI SelectField. */
function SelectFieldGallery() {
  const countries = [
    { label: "Philippines", value: "ph" },
    { label: "United States", value: "us" },
    { label: "Japan", value: "jp" },
    { label: "Germany", value: "de", disabled: true },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title="SelectField"
        subtitle="Preview of the shared @timo/ui SelectField component"
      />
      <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
        <SelectField label="Country" placeholder="Choose a country" options={countries} />
        <SelectField
          label="With icon"
          startIcon={<Home />}
          defaultValue="us"
          options={countries}
          hint="Germany is disabled."
        />
        <SelectField
          label="Error state"
          placeholder="Choose a country"
          options={countries}
          error="Please select a country."
        />
        <SelectField label="Disabled" options={countries} defaultValue="jp" disabled />
      </div>
    </div>
  );
}

/** Component gallery for the shared UI DateField. */
function DateFieldGallery() {
  return (
    <div className="space-y-10">
      <PageHeader title="DateField" subtitle="Preview of the shared @timo/ui DateField component" />
      <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
        <DateField label="Start date" startIcon={<Calendar />} />
        <DateField label="Appointment" type="datetime-local" />
        <DateField label="Billing month" type="month" hint="Pick a month." />
        <DateField label="Deadline" startIcon={<Calendar />} error="Date must be in the future." />
      </div>
    </div>
  );
}

/** Component gallery for the shared UI FileUploadField. */
function FileUploadFieldGallery() {
  return (
    <div className="space-y-10">
      <PageHeader
        title="FileUploadField"
        subtitle="Preview of the shared @timo/ui FileUploadField component"
      />
      <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
        <FileUploadField label="Avatar" accept="image/*" hint="PNG or JPG, up to 2 MB." />
        <FileUploadField label="Attachments" multiple />
        <FileUploadField
          label="Resume"
          accept=".pdf"
          error="A PDF file is required."
          containerClassName="sm:col-span-2"
        />
      </div>
    </div>
  );
}

/** Component gallery for the shared UI RangeField. */
function RangeFieldGallery() {
  const [volume, setVolume] = useState(40);

  return (
    <div className="space-y-10">
      <PageHeader
        title="RangeField"
        subtitle="Preview of the shared @timo/ui RangeField component"
      />
      <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
        <RangeField
          label={`Volume: ${volume}`}
          min={0}
          max={100}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <RangeField label="Brightness" min={0} max={100} defaultValue={70} step={10} />
      </div>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Sizes
        </h2>
        <div className="max-w-2xl space-y-3">
          {SIZES.map((size) => (
            <RangeField key={size} size={size} min={0} max={100} defaultValue={50} />
          ))}
        </div>
      </section>
    </div>
  );
}

/** Component gallery for the shared UI CheckboxField, ToggleField & RadioField. */
function ChoiceFieldsGallery() {
  const plans = [
    { label: "Free", value: "free" },
    { label: "Pro", value: "pro" },
    { label: "Enterprise (contact us)", value: "enterprise", disabled: true },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title="Checkbox / Toggle / Radio"
        subtitle="Choice fields fixed to the primary colour"
      />

      <div className="grid max-w-2xl gap-8 sm:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
            CheckboxField
          </h2>
          <CheckboxField label="I accept the terms" defaultChecked />
          <CheckboxField label="Subscribe to the newsletter" />
          <CheckboxField label="Required" error="You must accept to continue." />
        </section>

        <section className="space-y-3">
          <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
            ToggleField
          </h2>
          <ToggleField label="Email notifications" defaultChecked />
          <ToggleField label="Dark mode" />
          <ToggleField label="Disabled" disabled defaultChecked />
        </section>
      </div>

      <div className="grid max-w-2xl gap-8 sm:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
            RadioField (stacked)
          </h2>
          <RadioField
            name="plan-stacked"
            label="Choose a plan"
            options={plans}
            defaultValue="pro"
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
            RadioField (inline + error)
          </h2>
          <RadioField
            name="plan-inline"
            label="Billing cycle"
            inline
            options={[
              { label: "Monthly", value: "monthly" },
              { label: "Yearly", value: "yearly" },
            ]}
            error="Please pick a billing cycle."
          />
        </section>
      </div>
    </div>
  );
}

/** Component gallery for the shared UI OTPField. */
function OTPFieldGallery() {
  const [code, setCode] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="space-y-10">
      <PageHeader title="OTPField" subtitle="Preview of the shared @timo/ui OTPField component" />

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          6-digit code (controlled)
        </h2>
        <OTPField
          label="Verification code"
          value={code}
          onChange={(v) => {
            setCode(v);
            setDone(false);
          }}
          onComplete={() => setDone(true)}
        />
        <p className="text-base-content/60 text-sm">
          Value: <code className="text-primary">{code || "—"}</code>
          {done && <span className="text-success ml-2">✓ complete</span>}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          4 boxes, alphanumeric
        </h2>
        <OTPField length={4} mode="alphanumeric" defaultValue="A1" />
      </section>

      <section className="space-y-3">
        <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
          Error state
        </h2>
        <OTPField defaultValue="123456" error="That code is incorrect." />
      </section>
    </div>
  );
}

/** Component gallery for the shared UI Dropzone. */
function DropzoneGallery() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <div className="space-y-10">
      <PageHeader title="Dropzone" subtitle="Preview of the shared @timo/ui Dropzone component" />

      <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
        <section className="space-y-3">
          <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
            Single file
          </h2>
          <Dropzone label="Avatar" accept="image/*" hint="PNG or JPG." />
        </section>

        <section className="space-y-3">
          <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
            Multiple (controlled)
          </h2>
          <Dropzone
            label="Attachments"
            multiple
            files={files}
            onFilesChange={setFiles}
            description="or click to browse — drop as many as you like"
          />
          <p className="text-base-content/60 text-sm">
            Selected: <code className="text-primary">{files.length}</code> file(s)
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
            Error state
          </h2>
          <Dropzone label="Resume" accept=".pdf" error="A PDF file is required." />
        </section>

        <section className="space-y-3">
          <h2 className="text-base-content/70 text-sm font-semibold tracking-wider uppercase">
            Disabled
          </h2>
          <Dropzone label="Locked" disabled title="Uploads are disabled" description="" />
        </section>
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
      <ConfirmModalGallery />
      <BadgeGallery />
      <AvatarGallery />
      <StepsGallery />
      <MenuGallery />
      <DrawerGallery />
      <CardGallery />
      <EmptyStateGallery />
      <ErrorStateGallery />
      <InputFieldGallery />
      <NumberFieldGallery />
      <PasswordFieldGallery />
      <TextAreaFieldGallery />
      <SelectFieldGallery />
      <DateFieldGallery />
      <FileUploadFieldGallery />
      <RangeFieldGallery />
      <ChoiceFieldsGallery />
      <OTPFieldGallery />
      <DropzoneGallery />
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
