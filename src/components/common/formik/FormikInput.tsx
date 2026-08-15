import { useField } from 'formik';
import type { InputHTMLAttributes } from 'react';

interface FormikInputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const FormikInput = ({
  name,
  label,
  helperText,
  icon,
  className = '',
  ...props
}: FormikInputProps) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-zinc-300">
          {label}
          {props.required && <span className="ml-0.5 text-yellow-400">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute top-[13px] left-3.5 flex items-center justify-center text-zinc-500">
            {icon}
          </div>
        )}
        <input
          id={name}
          {...field}
          {...props}
          className={`w-full rounded-lg border bg-zinc-900 py-2.5 text-sm text-white placeholder-zinc-500 transition-all duration-200 outline-none ${icon ? 'pr-3.5 pl-10' : 'px-3.5'} ${
            hasError
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
              : 'border-zinc-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
          } disabled:cursor-not-allowed disabled:opacity-50 ${className} `}
        />
      </div>
      {hasError && <p className="text-xs text-red-400">{meta.error}</p>}
      {!hasError && helperText && <p className="text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
};
