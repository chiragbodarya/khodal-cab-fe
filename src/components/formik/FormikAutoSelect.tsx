import { useState, useRef, useEffect } from 'react';
import { useField } from 'formik';
import { LuChevronDown, LuX, LuCheck } from 'react-icons/lu';
import type { SelectOption } from './FormikSelect';

interface FormikAutoSelectProps {
  name: string;
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  helperText?: string;
  required?: boolean;
  disabled?: boolean;
}

export const FormikAutoSelect = ({
  name,
  label,
  options,
  placeholder = 'Type to search...',
  helperText,
  required,
  disabled,
}: FormikAutoSelectProps) => {
  const [field, meta, helpers] = useField(name);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasError = meta.touched && meta.error;
  const selected = options.find(o => o.value === field.value);
  const filtered = options.filter(o => o.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (option: SelectOption) => {
    helpers.setValue(option.value);
    helpers.setTouched(true);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    helpers.setValue('');
    helpers.setTouched(true);
    setQuery('');
    inputRef.current?.focus();
  };

  const displayValue = isOpen ? query : (selected?.label ?? '');

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-zinc-300">
          {label}
          {required && <span className="ml-0.5 text-yellow-400">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          ref={inputRef}
          id={name}
          type="text"
          value={displayValue}
          placeholder={selected ? selected.label : placeholder}
          disabled={disabled}
          onChange={e => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={`w-full rounded-lg border bg-zinc-900 px-3.5 py-2.5 pr-16 text-sm text-white placeholder-zinc-500 transition-all duration-200 outline-none ${
            hasError
              ? 'border-red-500 focus:ring-2 focus:ring-red-500/30'
              : 'border-zinc-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20'
          } disabled:cursor-not-allowed disabled:opacity-50`}
        />

        {/* Right icons */}
        <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
          {field.value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-0.5 text-zinc-500 transition-colors hover:text-white"
            >
              <LuX size={14} />
            </button>
          )}
          <LuChevronDown
            size={14}
            className={`text-zinc-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-52 overflow-y-auto rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/60">
            {filtered.length === 0 ? (
              <p className="px-4 py-3 text-center text-sm text-zinc-500">No options found</p>
            ) : (
              filtered.map(option => {
                const isSelected = field.value === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onMouseDown={e => {
                      e.preventDefault();
                      handleSelect(option);
                    }}
                    className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors duration-150 ${
                      isSelected
                        ? 'bg-yellow-400/5 text-yellow-400'
                        : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    } `}
                  >
                    <span
                      className={`flex-shrink-0 ${
                        isSelected ? 'text-yellow-400' : 'text-transparent'
                      }`}
                    >
                      <LuCheck size={14} />
                    </span>
                    {option.label}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {hasError && <p className="text-xs text-red-400">{meta.error}</p>}
      {!hasError && helperText && <p className="text-xs text-zinc-500">{helperText}</p>}
    </div>
  );
};
