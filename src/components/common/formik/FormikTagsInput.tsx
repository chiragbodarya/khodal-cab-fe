import { useField, useFormikContext } from 'formik';
import { useState } from 'react';

interface FormikTagsInputProps {
  name: string;
  label?: string;
  placeholder?: string;
  tagPrefix?: string;
  required?: boolean;
}

export const FormikTagsInput = ({
  name,
  label,
  placeholder,
  tagPrefix = '',
  required,
}: FormikTagsInputProps) => {
  const [field, meta] = useField<string[]>(name);
  const { setFieldValue } = useFormikContext();
  const [inputValue, setInputValue] = useState('');

  const hasError = meta.touched && meta.error;
  const tags = field.value || [];

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setFieldValue(name, [...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setFieldValue(
      name,
      tags.filter((_, idx) => idx !== indexToRemove)
    );
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-zinc-455 block text-sm font-semibold">
          {label}
          {required && <span className="ml-0.5 text-yellow-400">*</span>}
        </label>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`flex-grow rounded-lg border bg-zinc-900 px-3.5 py-2.5 text-white transition-colors outline-none ${
            hasError
              ? 'border-red-500 focus:border-red-500/50'
              : 'border-zinc-700 focus:border-amber-400/50'
          }`}
        />
        <button
          type="button"
          onClick={handleAddTag}
          className="cursor-pointer rounded-lg bg-zinc-800 px-4 py-2 font-bold text-white transition-colors hover:bg-zinc-700"
        >
          Add
        </button>
      </div>
      {hasError && <p className="text-xs text-red-400">{meta.error as string}</p>}
      <div className="flex flex-wrap gap-2 pt-1">
        {tags.map((item, idx) => (
          <span
            key={idx}
            className="border-zinc-850 inline-flex items-center gap-1 rounded-lg border bg-zinc-950 px-2.5 py-1 text-[10px] font-semibold text-zinc-300"
          >
            {tagPrefix}
            {item}
            <button
              type="button"
              onClick={() => handleRemoveTag(idx)}
              className="ml-1 cursor-pointer text-red-400 hover:text-red-300"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};
