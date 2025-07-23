"use-client";

import { uploadToCloudinary } from "@/libs/uploadToCloudinary";
import { useCallback, useState } from "react";
import { CloudUpload } from "lucide-react";
import Dropzone from "react-dropzone";

const ImageUpload = ({ onImageUpload }) => {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      // Validate file type (e.g., only images)
      if (!file.type.startsWith("image/")) {
        setError("Only image files are allowed");
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError("File size exceeds the 5MB limit");
        return;
      }

      setStatus("uploading");
      setError("");

      try {
        const url = await uploadToCloudinary(file);
        onImageUpload(url);
        setStatus("idle");
      } catch (err) {
        console.error(err);
        setError(err.message);
        setStatus("error");
      }
    },
    [onImageUpload]
  );

  return (
    <div>
      <Dropzone onDrop={onDrop}>
        {({ getRootProps, getInputProps }) => (
          <section
            className="grid place-items-center cursor-pointer bg-gray-300 border border-dashed border-gray-500 p-3"
            role="button"
            aria-label="Upload image"
          >
            <CloudUpload color="blue" size={50} />
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </section>
        )}
      </Dropzone>
      {status === "uploading" && (
        <p className="text-blue-500 mt-2">Uploading...</p>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default ImageUpload;
