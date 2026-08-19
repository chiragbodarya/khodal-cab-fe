import React, { useRef, useState, useEffect } from 'react';
import {
  LuUpload,
  LuImage,
  LuLoader,
  LuCheck,
  LuLink,
  LuTrash2,
  LuRefreshCw,
  LuImageOff,
} from 'react-icons/lu';
import { useUploadImageMutation } from '../../redux/slices/uploadApiSlice';
import toast from 'react-hot-toast';

interface Preset {
  label: string;
  url: string;
}

interface ImageUploadFieldProps {
  name: string;
  label?: string;
  value: string;
  onChange: (url: string) => void;
  presets?: Preset[];
  required?: boolean;
}

export const getFullImageUrl = (imgUrl: string): string => {
  if (!imgUrl) return '';
  if (
    imgUrl.startsWith('http://') ||
    imgUrl.startsWith('https://') ||
    imgUrl.startsWith('data:') ||
    imgUrl.startsWith('blob:')
  ) {
    return imgUrl;
  }
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:9000/api/v1';
  const serverOrigin = baseUrl.replace(/\/api\/v1\/?$/, '');
  const cleanPath = imgUrl.startsWith('/') ? imgUrl : `/${imgUrl}`;
  return `${serverOrigin}${cleanPath}`;
};

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  name,
  label = 'Image URL / Upload',
  value,
  onChange,
  presets,
  required,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const [mode, setMode] = useState<'upload' | 'url'>(value ? 'url' : 'upload');
  const [localFileName, setLocalFileName] = useState<string>('');
  const [imgError, setImgError] = useState(false);

  // Sync error state and mode when value changes (e.g. opening edit drawer)
  useEffect(() => {
    setImgError(false);
    if (value) {
      setMode('url');
    }
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    setLocalFileName(file.name);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res: any = await uploadImage(formData).unwrap();
      let uploadedUrl = '';
      if (typeof res === 'string') {
        uploadedUrl = res;
      } else if (res?.data?.url) {
        uploadedUrl = res.data.url;
      } else if (res?.data?.filename) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:9000/api/v1';
        const serverOrigin = baseUrl.replace(/\/api\/v1\/?$/, '');
        uploadedUrl = `${serverOrigin}/uploads/${res.data.filename}`;
      } else if (res?.url) {
        uploadedUrl = res.url;
      } else if (res?.filename) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:9000/api/v1';
        const serverOrigin = baseUrl.replace(/\/api\/v1\/?$/, '');
        uploadedUrl = `${serverOrigin}/uploads/${res.filename}`;
      }

      if (uploadedUrl) {
        onChange(uploadedUrl);
        setImgError(false);
        toast.success(`"${file.name}" uploaded successfully!`);
      } else {
        toast.error('Failed to parse uploaded image URL.');
      }
    } catch (err: any) {
      toast.error(err?.data?.message || err?.message || 'Failed to upload photo to server.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClearImage = () => {
    onChange('');
    setLocalFileName('');
    setImgError(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const resolvedSrc = getFullImageUrl(value);

  return (
    <div className="space-y-2.5">
      {/* ── Label & Mode Switcher ── */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-zinc-300">
          {label} {required && <span className="text-amber-400">*</span>}
        </label>
        <div className="flex items-center gap-1 rounded-lg border border-zinc-800 bg-zinc-950 p-0.5 text-[10px]">
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`flex cursor-pointer items-center gap-1 rounded-md px-2 py-0.5 font-semibold transition-colors ${
              mode === 'upload'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LuUpload size={11} /> Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`flex cursor-pointer items-center gap-1 rounded-md px-2 py-0.5 font-semibold transition-colors ${
              mode === 'url'
                ? 'bg-amber-400 text-zinc-950 shadow-sm'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <LuLink size={11} /> Direct URL
          </button>
        </div>
      </div>

      {/* ── Hidden File Input ── */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* ── Active Image Preview Card (Shown if an image is selected) ── */}
      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-3 shadow-lg">
          <div className="flex items-center gap-3.5">
            <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-inner flex items-center justify-center">
              {!imgError ? (
                <img
                  src={resolvedSrc}
                  alt="Selected preview"
                  className="h-full w-full object-cover"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-1 text-center text-zinc-500">
                  <LuImageOff size={18} className="text-zinc-600" />
                  <span className="text-[9px] mt-0.5">No preview</span>
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 rounded bg-emerald-400/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  <LuCheck size={11} /> Image Selected
                </span>
                {localFileName && (
                  <span className="truncate text-[10px] text-zinc-400">({localFileName})</span>
                )}
              </div>
              <p className="truncate font-mono text-[11px] text-zinc-400" title={value}>
                {value}
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  if (mode === 'upload') {
                    fileInputRef.current?.click();
                  } else {
                    setMode('url');
                  }
                }}
                disabled={isUploading}
                className="flex cursor-pointer items-center gap-1 rounded-xl border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 transition-colors hover:border-amber-400/40 hover:bg-zinc-850 hover:text-amber-400"
                title="Replace selected image"
              >
                {isUploading ? (
                  <LuLoader className="animate-spin text-amber-400" size={13} />
                ) : (
                  <LuRefreshCw size={13} />
                )}
                <span className="hidden sm:inline">Change</span>
              </button>

              <button
                type="button"
                onClick={handleClearImage}
                className="flex cursor-pointer items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 p-2 text-zinc-400 transition-colors hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400"
                title="Remove image"
              >
                <LuTrash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* ── Input Controls (Upload Button or URL Input) ── */}
      {mode === 'upload' ? (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-zinc-800 bg-zinc-950/60 p-5 text-center transition-all hover:border-amber-400/50 hover:bg-zinc-900/50 ${
            isUploading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
            {isUploading ? (
              <LuLoader className="animate-spin" size={20} />
            ) : (
              <LuUpload size={20} />
            )}
          </div>
          <div>
            <p className="text-xs font-semibold text-white">
              {isUploading ? 'Uploading file to server...' : 'Click to select and upload image'}
            </p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Supports PNG, JPG, JPEG, WEBP up to 5MB</p>
          </div>
        </div>
      ) : (
        <div className="space-y-1.5">
          <div className="relative flex items-center">
            <LuImage className="absolute left-3.5 text-zinc-500" size={15} />
            <input
              type="text"
              name={name}
              value={value || ''}
              onChange={e => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              required={required}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-zinc-600 outline-none transition-colors focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20"
            />
          </div>
        </div>
      )}

      {/* ── Presets Row ── */}
      {presets && presets.length > 0 && (
        <div className="space-y-1.5 pt-1">
          <span className="block text-[10px] font-medium text-zinc-500">
            Or select from quick presets:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setLocalFileName(preset.label);
                }}
                className={`cursor-pointer rounded-lg border px-2.5 py-1 text-[10px] font-medium transition-colors ${
                  value === preset.url
                    ? 'border-amber-400 bg-amber-400/10 text-amber-400 font-bold'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
