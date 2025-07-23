import React from "react";

const Inventory = ({ register, errors }) => {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Quantity
        </label>
        <input
          {...register("quantity")}
          type="number"
          placeholder="1500"
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
        />
        {errors.quantity && (
          <p className="text-sm text-red-500 mt-1">{errors.quantity.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          SKU <span className="text-xs font-bold">(Stock keeping unit)</span>
        </label>
        <input
          {...register("sku")}
          type="text"
          placeholder="e.g "
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
        />
        {errors.sku && (
          <p className="text-sm text-red-500 mt-1">{errors.sku.message}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Restock date
        </label>
        <input
          {...register("restockDate")}
          type="date"
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
        />
        {errors.restockDate && (
          <p className="text-sm text-red-500 mt-1">
            {errors.restockDate.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 font-montserrat text-lg">
        <input
          type="checkbox"
          {...register("lowStock")}
          className="w-5 h-5 accent-primary"
        />
        <span className="text-sm font-bold text-gray-700">
          Low stock notification
        </span>
      </div>
    </form>
  );
};

export default Inventory;
