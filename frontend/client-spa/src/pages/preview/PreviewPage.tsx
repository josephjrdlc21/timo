import { useState } from "react";
import { ArrowRight, Download, Plus, Trash2 } from "lucide-react";
import { Button, PageHeader, type ButtonSize, type ButtonVariant } from "@timo/ui";

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
export function PreviewPage() {
  // Fake an async action so the loading spinner can be seen in context.
  const [saving, setSaving] = useState(false);
  const runSave = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-10">
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
