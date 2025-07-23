import React from "react";

const Pricing = ({ register, errors }) => {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Price (₦)
        </label>
        <input
          {...register("price")}
          type="number"
          step="0.01"
          placeholder="1500"
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
        />
        {errors.price && (
          <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Discount
        </label>
        <div className="flex items-center justify-start gap-2">
          <input
            {...register("discount")}
            type="number"
            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
          />
          {errors.discount && (
            <p className="text-sm text-red-500 mt-1">
              {errors.discount.message}
            </p>
          )}
          <p className="text-md font-semibold text-gray-700 mb-1">%</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Old Price (₦)
        </label>
        <input
          {...register("oldprice")}
          type="number"
          step="0.01"
          placeholder="2500"
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
        />
        {errors.oldprice && (
          <p className="text-sm text-red-500 mt-1">{errors.oldprice.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Cost Per Item (₦)
        </label>
        <input
          {...register("costPerItem")}
          type="number"
          step="0.01"
          placeholder="1200"
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
        />
        {errors.costPerItem && (
          <p className="text-sm text-red-500 mt-1">
            {errors.costPerItem.message}
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 font-montserrat text-lg">
        <input
          type="checkbox"
          {...register("tax")}
          className="w-5 h-5 accent-primary"
        />
        <span className="text-sm font-bold text-gray-700">Taxable</span>
      </div>
    </form>
  );
};

export default Pricing;
