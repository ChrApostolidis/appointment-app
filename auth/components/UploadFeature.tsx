"use client";

import Image from "next/image";
import { BsUpload } from "react-icons/bs";

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
    <>
      <div className="flex gap-4 items-start pb-4 w-full">
        <div className="flex flex-col gap-2 w-full">
          {fileUrl && file && (
            <div className="flex gap-4 items-center">
              <div className="rounded-full h-32 w-32 overflow-hidden relative">
                <Image
                  src={fileUrl}
                  alt="Preview"
                  className="object-cover"
                  width={400}
                  height={400}
                />
              </div>

              <button
                onClick={onRemove}
                disabled={disabled}
                type="button"
                className="border rounded-xl px-4 py-2"
              >
                Remove
              </button>
            </div>
          )}

          <label className="flex">
            <BsUpload
              size={24}
              className="hover:cursor-pointer text-neutral-500"
            />

            <input
              className="bg-transparent flex-1 border-none outline-none hidden"
              name="media"
              onChange={handleChange}
              disabled={disabled}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm"
            />
          </label>
        </div>
      </div>
    </>
  );
}
