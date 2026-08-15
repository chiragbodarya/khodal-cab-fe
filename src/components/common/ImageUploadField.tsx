import React, { useRef, useState } from 'react';
import { LuUpload, LuImage, LuLoader, LuCheck, LuLink } from 'react-icons/lu';
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
  const [mode, setMode] = useState<'upload' | 'url'>('url');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res: any = await uploadImage(formData).unwrap();
      // Handle various response shapes from multer/backend:
      // res.data.url or res.data.filename or res.url or res.filename
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
        toast.success('Image uploaded successfully!');
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

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-zinc-350 block text-xs font-semibold">
          {label} {required && <span className="text-amber-400">*</span>}
        </label>
        <div className="flex items-center gap-1.5 text-[10px]">
          <button
            type="button"
            onClick={() => setMode('url')}
            className={`cursor-pointer rounded px-2 py-0.5 font-medium transition-colors ${mode === 'url' ? 'bg-amber-400/20 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            <LuLink className="mr-1 inline" size={10} /> URL
          </button>
          <button
            type="button"
            onClick={() => setMode('upload')}
            className={`cursor-pointer rounded px-2 py-0.5 font-medium transition-colors ${mode === 'upload' ? 'bg-amber-400/20 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
          >
            <LuUpload className="mr-1 inline" size={10} /> Upload File
          </button>
        </div>
      </div>

      {mode === 'url' ? (
        <div className="flex gap-2">
          <input
            type="text"
            name={name}
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            required={required}
            className="flex-grow rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-amber-400"
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-zinc-700 bg-zinc-950/70 px-4 py-2.5 text-xs font-semibold text-zinc-300 transition-colors hover:border-amber-400 hover:text-amber-400"
          >
            {isUploading ? (
              <>
                <LuLoader className="animate-spin text-amber-400" size={14} /> Uploading...
              </>
            ) : (
              <>
                <LuUpload size={14} /> Choose Image File (Max 5MB)
              </>
            )}
          </button>
          {value && (
            <span className="flex items-center gap-1 text-[11px] text-emerald-400">
              <LuCheck size={12} /> Image Ready
            </span>
          )}
        </div>
      )}

      {/* Presets Row */}
      {presets && presets.length > 0 && (
        <div className="space-y-1 pt-1">
          <span className="block text-[10px] text-zinc-500">Or pick from curated presets:</span>
          <div className="flex gap-1.5 overflow-x-auto py-1">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(preset.url)}
                className={`cursor-pointer rounded-lg border px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap transition-colors ${value === preset.url
                    ? 'border-amber-400 bg-amber-400/10 text-amber-400'
                    : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                  }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Image Preview Box */}
      {value && (
        <div className="mt-2 flex items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950 p-2">
          <img
            src={value}
            alt="Preview"
            onError={e => {
              (e.target as HTMLElement).style.display = 'none';
            }}
            className="h-12 w-20 rounded-lg border border-zinc-800 object-cover"
          />
          <div className="min-w-0 flex-1">
            <span className="flex items-center gap-1 text-[10px] font-semibold text-zinc-400">
              <LuImage size={11} className="text-amber-400" /> Active Preview
            </span>
            <p className="truncate text-[10px] text-zinc-500">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
};
