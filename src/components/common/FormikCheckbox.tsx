import { useField } from "formik";

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
  const [field, meta] = useField({ name, type: "checkbox" });
  const hasError = meta.touched && meta.error;

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={name}
        className={`flex items-start gap-3 cursor-pointer group ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {/* Custom checkbox box */}
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            id={name}
            type="checkbox"
            {...field}
            disabled={disabled}
            className="sr-only peer"
          />
          <div
            className={`
              w-4.5 h-4.5 rounded border transition-all duration-200
              peer-checked:bg-yellow-400 peer-checked:border-yellow-400
              group-hover:border-yellow-400/60
              ${hasError ? "border-red-500" : "border-zinc-600 bg-zinc-900"}
            `}
          >
            {/* Checkmark */}
            <svg
              className="w-3 h-3 text-zinc-950 absolute top-0.5 left-0.5 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
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
          <span className="text-sm text-zinc-300 group-hover:text-white transition-colors select-none">
            {label}
            {required && <span className="text-yellow-400 ml-0.5">*</span>}
          </span>
          {helperText && (
            <p className="text-xs text-zinc-500 mt-0.5">{helperText}</p>
          )}
        </div>
      </label>

      {hasError && (
        <p className="text-xs text-red-400 pl-7">{meta.error}</p>
      )}
    </div>
  );
};
