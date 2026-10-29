"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus } from "lucide-react";
import { uploadToCloudinary } from "@/libs/uploadToCloudinary";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

const ImageUpload = ({ value, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles, rejected) => {
      setError("");
      if (rejected.length) {
        setError("Use a JPG, PNG or WebP image under 5MB.");
        return;
      }
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      try {
        onChange(await uploadToCloudinary(file));
      } catch (err) {
        console.error(err);
        setError("Upload failed. Check your Cloudinary settings and try again.");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxSize: MAX_SIZE,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".webp"] },
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="relative aspect-square w-32 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Product preview" className="h-full w-full object-cover" />
        ) : (
          <span className="grid h-full place-items-center px-2 text-center text-xs text-slate-400">No image yet</span>
        )}
      </div>

      <div className="flex-1">
        <div
          {...getRootProps()}
          className={`grid cursor-pointer place-items-center gap-1 rounded-xl border-2 border-dashed px-4 py-6 text-center text-sm transition ${
            isDragActive ? "border-headline bg-slate-50" : "border-slate-300 hover:border-headline"
          }`}
        >
          <input {...getInputProps()} />
          <ImagePlus size={24} className="text-slate-400" />
          <p className="font-semibold">{uploading ? "Uploading…" : value ? "Replace image" : "Upload image"}</p>
          <p className="text-xs text-slate-500">Drag and drop, or click to choose. JPG, PNG or WebP up to 5MB.</p>
        </div>
        {error && <p className="field-error">{error}</p>}
      </div>
    </div>
  );
};

export default ImageUpload;
