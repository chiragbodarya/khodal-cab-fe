import { useField } from "formik";
import type { InputHTMLAttributes } from "react";

interface FormikInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  helperText?: string;
}

export const FormikInput = ({
  name,
  label,
  helperText,
  className = "",
  ...props
}: FormikInputProps) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-zinc-300">
          {label}
          {props.required && (
            <span className="text-yellow-400 ml-0.5">*</span>
          )}
        </label>
      )}
      <input
        id={name}
        {...field}
        {...props}
        className={`
          bg-zinc-900 border rounded-lg px-3.5 py-2.5 text-sm text-white
          placeholder-zinc-500 w-full transition-all duration-200 outline-none
          ${
            hasError
              ? "border-red-500 focus:ring-2 focus:ring-red-500/30"
              : "border-zinc-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      />
      {hasError && (
        <p className="text-xs text-red-400">{meta.error}</p>
      )}
      {!hasError && helperText && (
        <p className="text-xs text-zinc-500">{helperText}</p>
      )}
    </div>
  );
};
