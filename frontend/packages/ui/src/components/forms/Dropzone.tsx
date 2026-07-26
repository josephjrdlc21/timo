import type { DragEvent, KeyboardEvent, ReactNode, Ref } from "react";
import { useRef, useState } from "react";
import { File as FileIcon, UploadCloud, X } from "lucide-react";
import { cn } from "../../lib/utils/cn";
import { FieldShell } from "./FieldShell";

interface DropzoneProps {
  /** Label rendered above the zone. */
  label?: ReactNode;
  /** Error message shown below the zone (also applies the error style). */
  error?: ReactNode;
  /** Helper text shown below the zone when there is no `error`. */
  hint?: ReactNode;
  /** Icon shown in the centre of the zone. Defaults to an upload-cloud icon. */
  icon?: ReactNode;
  /** Primary prompt text. */
  title?: ReactNode;
  /** Secondary prompt text under the title. */
  description?: ReactNode;
  /** `accept` attribute forwarded to the file input (e.g. "image/*,.pdf"). */
  accept?: string;
  /** Allow selecting more than one file. Defaults to false. */
  multiple?: boolean;
  /** Disable all interaction. */
  disabled?: boolean;
  /** Controlled list of selected files. Falls back to internal state when omitted. */
  files?: File[];
  /** Initial files when uncontrolled. */
  defaultFiles?: File[];
  /** Fires with the full file list whenever the selection changes. */
  onFilesChange?: (files: File[]) => void;
  /** Hide the list of selected files. */
  hideFileList?: boolean;
  /** Classes for the outer wrapper (the `fieldset`). */
  containerClassName?: string;
  /** Classes for the drop area itself. */
  className?: string;
  /** Ref to the underlying (hidden) file `<input>`. */
  ref?: Ref<HTMLInputElement>;
}

/** Human-readable file size, e.g. 1536 → "1.5 KB". */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exp);
  return `${value.toFixed(exp === 0 ? 0 : 1)} ${units[exp]}`;
}

/** Two files are "the same" for de-duping if name + size + mtime match. */
function isSameFile(a: File, b: File): boolean {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified;
}

/**
 * Drag-and-drop file upload area with a dashed border, click / keyboard
 * browsing, drag-over highlighting, and a removable list of selected files.
 *
 * Controlled via `files` + `onFilesChange` (a `File[]`), or left uncontrolled
 * with `defaultFiles`. With react-hook-form, wrap it in a `Controller` and map
 * `field.value` / `field.onChange`. The hidden `<input type="file">` ref is
 * forwarded for imperative access.
 */
export function Dropzone({
  label,
  error,
  hint,
  icon,
  title = "Drag & drop files here",
  description = "or click to browse",
  accept,
  multiple = false,
  disabled = false,
  files,
  defaultFiles = [],
  onFilesChange,
  hideFileList = false,
  containerClassName,
  className,
  ref,
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Depth counter so nested dragenter/dragleave events don't flicker the state.
  const dragDepth = useRef(0);
  const [dragging, setDragging] = useState(false);
  const [internal, setInternal] = useState<File[]>(defaultFiles);

  const hasError = error != null;
  const selected = files ?? internal;

  const assignRef = (el: HTMLInputElement | null) => {
    inputRef.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  const commit = (next: File[]) => {
    if (files === undefined) setInternal(next);
    onFilesChange?.(next);
  };

  const addFiles = (incoming: FileList | File[]) => {
    const list = Array.from(incoming);
    if (list.length === 0) return;
    if (!multiple) {
      commit(list.slice(0, 1));
      return;
    }
    // Append, skipping any file already in the list.
    const merged = [...selected];
    for (const file of list) {
      if (!merged.some((existing) => isSameFile(existing, file))) merged.push(file);
    }
    commit(merged);
  };

  const removeFile = (index: number) => {
    commit(selected.filter((_, i) => i !== index));
  };

  const openBrowser = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openBrowser();
    }
  };

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;
    dragDepth.current += 1;
    setDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;
    dragDepth.current -= 1;
    if (dragDepth.current <= 0) {
      dragDepth.current = 0;
      setDragging(false);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (disabled) return;
    dragDepth.current = 0;
    setDragging(false);
    addFiles(event.dataTransfer.files);
  };

  return (
    <FieldShell label={label} error={error} hint={hint} containerClassName={containerClassName}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled || undefined}
        aria-invalid={hasError || undefined}
        onClick={openBrowser}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "rounded-box flex flex-col items-center justify-center gap-2 border-2 border-dashed p-8 text-center transition-colors",
          disabled
            ? "border-base-content/10 cursor-not-allowed opacity-60"
            : "hover:border-primary/50 cursor-pointer",
          dragging && !disabled && "border-primary bg-primary/5",
          !dragging && !hasError && "border-base-content/20",
          hasError && "border-error/50",
          className,
        )}
      >
        <span className="text-base-content/40 [&_svg]:h-9 [&_svg]:w-9" aria-hidden="true">
          {icon ?? <UploadCloud />}
        </span>
        <p className="text-base-content font-medium">{title}</p>
        {description != null && <p className="text-base-content/60 text-sm">{description}</p>}

        <input
          ref={assignRef}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            // Reset so re-selecting the same file still fires onChange.
            e.target.value = "";
          }}
        />
      </div>

      {!hideFileList && selected.length > 0 && (
        <ul className="mt-2 space-y-1">
          {selected.map((file, index) => (
            <li
              key={`${file.name}-${file.lastModified}-${index}`}
              className="bg-base-200 flex items-center gap-2 rounded-md px-3 py-2 text-sm"
            >
              <FileIcon className="text-base-content/50 h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="flex-1 truncate">{file.name}</span>
              <span className="text-base-content/50 shrink-0">{formatBytes(file.size)}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="btn btn-ghost btn-xs btn-circle"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </FieldShell>
  );
}
