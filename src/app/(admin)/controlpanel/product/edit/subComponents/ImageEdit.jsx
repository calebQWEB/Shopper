import { CloudUpload, Upload } from "lucide-react";
import React from "react";
import Dropzone from "react-dropzone";

const ImageEdit = () => {
  return (
    <Dropzone onDrop={(acceptedFiles) => console.log(acceptedFiles)}>
      {({ getRootProps, getInputProps }) => (
        <section className="grid place-items-center cursor-pointer bg-gray-300 border border-dashed border-gray-500 p-3">
          <CloudUpload color="blue" size={50} />
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        </section>
      )}
    </Dropzone>
  );
};

export default ImageEdit;
