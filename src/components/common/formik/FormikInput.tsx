import { useField } from 'formik';
import { useState, type InputHTMLAttributes } from 'react';
import { LuEye, LuEyeOff } from 'react-icons/lu';

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
  type = 'text',
  ...props
}: FormikInputProps) => {
  const [field, meta] = useField(name);
  const [showPassword, setShowPassword] = useState(false);
  const hasError = meta.touched && meta.error;
  const isPasswordField = type === 'password';

  const resolvedType = isPasswordField ? (showPassword ? 'text' : 'password') : type;

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
          type={resolvedType}
          className={`w-full rounded-lg border bg-zinc-900 py-2.5 text-sm text-white placeholder-zinc-500 transition-all duration-200 outline-none ${
            icon ? 'pl-10' : 'pl-3.5'
          } ${isPasswordField ? 'pr-11' : 'pr-3.5'} ${
            hasError
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
              : 'border-zinc-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20'
          } disabled:cursor-not-allowed disabled:opacity-50 ${className} `}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            tabIndex={-1}
            className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center justify-center p-1 rounded-md text-zinc-500 transition-colors hover:text-amber-400 focus:outline-none cursor-pointer"
            title={showPassword ? 'Hide password' : 'Show password'}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <LuEyeOff size={16} /> : <LuEye size={16} />}
          </button>
        )}
      </div>
      {hasError && <p className="text-xs text-red-400">{meta.error}</p>}
      {!hasError && helperText && <p className="text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
};

