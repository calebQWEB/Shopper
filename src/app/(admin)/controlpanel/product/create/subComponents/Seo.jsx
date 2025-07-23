import React from "react";

const Seo = ({ register, errors }) => {
  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Title
        </label>
        <input
          {...register("title")}
          type="text"
          maxLength={60}
          placeholder="e.g JBL Flip 6 – Portable Bluetooth Speaker | Caleb's Gadget Store"
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      {/* Published Date */}
      <div className="flex flex-col gap-1">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Published Date
        </label>
        <input
          {...register("publishedDate")}
          type="date"
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
        {errors.publishedDate && (
          <p className="text-sm text-red-500">{errors.publishedDate.message}</p>
        )}
      </div>

      {/* SEO Description */}
      <div className="flex flex-col gap-1 md:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          SEO Description
        </label>
        <textarea
          {...register("seoDescription")}
          maxLength={160}
          rows={4}
          placeholder="e.g JBL Flip 6 – Portable Bluetooth Speaker | Caleb's Gadget Store"
          className="w-full rounded-2xl border border-gray-300 px-4 py-3 shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
        {errors.seoDescription && (
          <p className="text-sm text-red-500">
            {errors.seoDescription.message}
          </p>
        )}
      </div>

      {/* Product Visibility */}
      <div className="flex flex-col gap-1">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Product Visibility
        </label>
        <select
          {...register("visibility")}
          className="w-full border border-gray-300 px-4 py-3 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary transition"
        >
          <option value="active">Active</option>
          <option value="draft">In Draft</option>
          <option value="hidden">Hidden</option>
        </select>
        {errors.visibility && (
          <p className="text-sm text-red-500">{errors.visibility.message}</p>
        )}
      </div>
    </form>
  );
};

export default Seo;
