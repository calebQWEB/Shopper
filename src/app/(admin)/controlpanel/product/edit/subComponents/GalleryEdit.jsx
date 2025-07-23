import ImageEdit from "../subComponents/ImageEdit";
import ImageUpload from "./ImageUpload";

const GalleryEdit = ({ register, errors }) => {
  const handleUpload = (url) => {
    console.log(url);
  };
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
        <h2 className="font-montserrat text-gray-800 text-2xl lg:text-3xl font-semibold mb-4">
          ✏️ Edit Image
        </h2>
        <ImageUpload onImageUpload={handleUpload} />
      </div>

      <div className="bg-white rounded-2xl shadow-md p-6">
        <h2 className="font-montserrat text-gray-800 text-2xl lg:text-3xl font-semibold mb-4">
          🖼️ Preview Image
        </h2>
        {/* Add image preview component or placeholder here */}
        <div className="h-64 bg-gray-100 border border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
          Preview Area
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-3">
          <input
            {...register("imageURL")}
            readOnly
            placeholder="Url appears here"
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
          />
          {errors.imageURL && (
            <p className="text-sm text-red-500 mt-1">
              {errors.imageURL.message}
            </p>
          )}
          <input
            {...register("altText")}
            placeholder="e.g., A silver MacBook Pro with Retina display"
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
          />
          {errors.altText && (
            <p className="text-sm text-red-500 mt-1">
              {errors.altText.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryEdit;
