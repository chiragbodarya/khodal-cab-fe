import { useField } from 'formik';

interface FormikCheckboxProps {
  name: string;
  label: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

export const FormikCheckbox = ({
  name,
  label,
  helperText,
  required,
  disabled,
}: FormikCheckboxProps) => {
  const [field, meta] = useField({ name, type: 'checkbox' });
  const hasError = meta.touched && meta.error;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className={`group flex cursor-pointer items-start gap-3 ${
          disabled ? 'cursor-not-allowed opacity-50' : ''
        }`}
      >
        {/* Custom checkbox box */}
        <div className="relative mt-0.5 flex-shrink-0">
          <input
            id={name}
            type="checkbox"
            {...field}
            disabled={disabled}
            className="peer sr-only"
          />
          <div
            className={`h-4.5 w-4.5 rounded border transition-all duration-200 group-hover:border-yellow-400/60 peer-checked:border-yellow-400 peer-checked:bg-yellow-400 ${hasError ? 'border-red-500' : 'border-zinc-600 bg-zinc-900'} `}
          >
            {/* Checkmark */}
            <svg
              className="pointer-events-none absolute top-0.5 left-0.5 h-3 w-3 text-zinc-950 opacity-0 transition-opacity peer-checked:opacity-100"
              viewBox="0 0 12 12"
              fill="none"
            >
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <div>
          <span className="text-sm text-zinc-300 transition-colors select-none group-hover:text-white">
            {label}
            {required && <span className="ml-0.5 text-yellow-400">*</span>}
          </span>
          {helperText && <p className="mt-0.5 text-xs text-zinc-500">{helperText}</p>}
        </div>
      </label>

      {hasError && <p className="pl-7 text-xs text-red-400">{meta.error}</p>}
    </div>
  );
};
