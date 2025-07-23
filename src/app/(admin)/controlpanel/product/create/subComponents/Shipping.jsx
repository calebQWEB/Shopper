import React from "react";

const Shipping = ({ register, errors }) => {
  return (
    <form className="grid grid-cols-2 gap-6 items-start">
      {/* Weight */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Weight (lbs)
        </label>
        <input
          {...register("weight")}
          type="number"
          placeholder="e.g. 12"
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
        />
        {errors.weight && (
          <p className="text-sm text-red-500 mt-1">{errors.weight.message}</p>
        )}
      </div>

      {/* Dimensions */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Dimensions (cm)
        </label>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <input
              {...register("length")}
              type="number"
              placeholder="L"
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
            />
            {errors.length && (
              <p className="text-sm text-red-500 mt-1">
                {errors.length.message}
              </p>
            )}
          </div>
          <div>
            <input
              {...register("width")}
              type="number"
              placeholder="W"
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
            />
            {errors.width && (
              <p className="text-sm text-red-500 mt-1">
                {errors.width.message}
              </p>
            )}
          </div>
          <div>
            <input
              {...register("height")}
              type="number"
              placeholder="H"
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
            />
            {errors.height && (
              <p className="text-sm text-red-500 mt-1">
                {errors.height.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Shipping;
