"use client";

import Image from "next/image";
import { BsUpload } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";

interface UploadFeatureProps {
  onFileSelect: (file: File) => void;
  file?: File;
  fileUrl?: string;
  onRemove: () => void;
  disabled?: boolean;
}

export default function UploadFeature({
  onFileSelect,
  file,
  fileUrl,
  onRemove,
  disabled,
}: UploadFeatureProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-2">
        Business Logo <span className="text-red-400">*</span>
      </label>
      <label
        className={`relative flex flex-col items-center justify-center w-full rounded-xl border-2 border-dashed px-6 py-10 transition-colors ${
          disabled
            ? "opacity-60 cursor-not-allowed border-slate-700"
            : "cursor-pointer border-slate-700 hover:border-slate-500"
        } bg-slate-900/40`}
        aria-disabled={disabled}
      >
        <input
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          name="media"
          onChange={handleChange}
          disabled={disabled}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
        />

        <div className="flex flex-col items-center text-center gap-3 pointer-events-none">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800/70 text-slate-300">
            <BsUpload size={22} />
          </div>
          <div className="space-y-1">
            <p className="text-slate-200 font-medium">
              Click to upload or drag & drop
            </p>
            <p className="text-slate-400 text-xs">PNG, JPG, WEBP • up to 5MB</p>
          </div>
        </div>
      </label>

      {/* Preview */}
      {fileUrl && file && (
        <div className="mt-4 flex items-center gap-4">
          <div className="relative h-24 w-24 rounded-lg overflow-hidden ring-1 ring-slate-700">
            <Image
              src={fileUrl}
              alt={file.name || "Selected image"}
              className="object-cover"
              fill
              sizes="96px"
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-slate-200 text-sm truncate">{file.name}</p>
            <p className="text-slate-400 text-xs">
              {(file.size / 1024).toFixed(0)} KB • {file.type || "image"}
            </p>
          </div>

          <button
            onClick={onRemove}
            disabled={disabled}
            type="button"
            className="inline-flex items-center gap-2 rounded-md bg-slate-800 px-3 py-2 text-slate-100 text-sm hover:bg-slate-700 disabled:opacity-60"
            aria-label="Remove selected image"
          >
            <FaTrashAlt className="h-3.5 w-3.5" />
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
