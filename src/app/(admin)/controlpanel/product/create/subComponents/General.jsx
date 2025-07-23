import { useState } from "react";
import InputTags from "./InputTags";

const General = ({ tags, setTags, register, errors }) => {
  return (
    <form
      //   onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Name
        </label>
        <input
          {...register("name")}
          placeholder="e.g. MacBook Pro"
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition"
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Category
        </label>
        <select
          {...register("cateogory")}
          placeholder="e.g. Electronics"
          className="w-full border border-gray-300 px-4 py-3 focus:ring-2 outline-none transition"
        >
          <option value="">All Categories</option>
          <option value="laptop">Laptop</option>
          <option value="tablet">Tablet</option>
          <option value="gaming console">Gaming Console</option>
          <option value="headphones">Headphones</option>
        </select>
        {errors.cateogory && (
          <p className="text-sm text-red-500 mt-1">
            {errors.cateogory.message}
          </p>
        )}
      </div>

      <div className="md:col-span-2">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
          placeholder="Product description..."
          rows={4}
          className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary outline-none transition resize-none"
        />
      </div>

      <div className="space-y-6">
        {/* ...other form fields */}
        <div>
          <label className="block font-medium mb-1">Tags</label>
          <InputTags value={tags} onChange={setTags} />
        </div>
      </div>
    </form>
  );
};

export default General;
