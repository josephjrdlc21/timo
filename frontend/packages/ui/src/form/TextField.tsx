import type { FieldValues, UseControllerProps } from "react-hook-form";
import { useController } from "react-hook-form";
import { cn } from "../cn";

export interface TextFieldProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  type?: string;
  placeholder?: string;
}

/**
 * react-hook-form controlled text input, shared across both apps.
 * Usage: <TextField name="email" control={control} label="Email" rules={{ required: true }} />
 */
export function TextField<T extends FieldValues>({
  label,
  type = "text",
  placeholder,
  ...controllerProps
}: TextFieldProps<T>) {
  const { field, fieldState } = useController(controllerProps);

  return (
    <label className="flex flex-col gap-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input
        {...field}
        type={type}
        placeholder={placeholder}
        value={field.value ?? ""}
        className={cn(
          "rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500",
          fieldState.error ? "border-red-500" : "border-gray-300",
        )}
      />
      {fieldState.error?.message && (
        <span className="text-xs text-red-600">{fieldState.error.message}</span>
      )}
    </label>
  );
}
