import { useField } from 'formik';

export interface SelectOption {
  value: string;
  label: string;
}

interface FormikSelectProps {
  name: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

export const FormikSelect = ({
  name,
  label,
  options,
  placeholder = 'Select an option',
  helperText,
  required,
  disabled,
}: FormikSelectProps) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-zinc-300">
          {label}
          {required && <span className="ml-0.5 text-yellow-400">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          id={name}
          {...field}
          disabled={disabled}
          className={`w-full cursor-pointer appearance-none rounded-lg border bg-zinc-900 px-3.5 py-2.5 pr-10 text-sm transition-all duration-200 outline-none ${field.value === '' ? 'text-zinc-500' : 'text-white'} ${
            hasError
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
              : 'border-zinc-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
          } disabled:cursor-not-allowed disabled:opacity-50`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map(opt => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900 text-white">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom chevron */}
        <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-zinc-500">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {hasError && <p className="text-xs text-red-400">{meta.error}</p>}
      {!hasError && helperText && <p className="text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
};
