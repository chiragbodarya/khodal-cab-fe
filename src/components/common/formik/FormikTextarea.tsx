import { useField } from 'formik';
import type { TextareaHTMLAttributes } from 'react';

interface FormikTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  helperText?: string;
}

export const FormikTextarea = ({
  name,
  label,
  helperText,
  className = '',
  rows = 4,
  ...props
}: FormikTextareaProps) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          {label}
          {props.required && <span className="ml-0.5 text-amber-500 dark:text-yellow-400">*</span>}
        </label>
      )}
      <textarea
        id={name}
        rows={rows}
        {...field}
        {...props}
        className={`w-full resize-none rounded-xl border bg-zinc-50 dark:bg-zinc-900/90 px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 outline-none focus:bg-white dark:focus:bg-zinc-900 ${
          hasError
            ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
            : 'border-zinc-200 dark:border-zinc-700/80 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
        } disabled:cursor-not-allowed disabled:opacity-50 ${className} `}
      />
      {hasError && <p className="text-xs text-red-500 dark:text-red-400">{meta.error}</p>}
      {!hasError && helperText && <p className="text-xs text-zinc-500 dark:text-zinc-400">{helperText}</p>}
    </div>
  );
};
