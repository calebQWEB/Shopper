"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { styles } from "@/libs/styles";
import Select from "react-select";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const promotionSchema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  type: yup
    .string()
    .oneOf(["percentage", "fixed"], "Type must be 'percentage' or 'fixed'")
    .required("Type is required"),
  value: yup
    .number()
    .typeError("Value must be a number")
    .positive("Value must be positive")
    .required("Value is required"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),
  status: yup.string().oneOf(["active", "inactive"]),
});

const CreatePromotionPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(promotionSchema),
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const applicableTo = watch("applicableTo");

  useEffect(() => {
    // Fetch products on mount
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/product/get");
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const onSubmit = async (data) => {
    let productIds = data.productIds || [];
    let categoryIds = data.categoryIds || [];

    const payload = {
      ...data,
      productIds: productIds.join(","),
      categoryIds: categoryIds.join(","), // store as comma-separated string
      value: parseFloat(data.value),
    };

    try {
      const res = await fetch("/api/promotion/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (res.ok) {
        alert("Promotion created successfully!");
        reset();
      } else {
        alert(result.message || "Error creating promotion.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create promotion.");
    }
  };

  return (
    <section className={`${styles.padding} font-monsterrat`}>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold mb-10 text-gray-800">
          Create Promotion
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              {...register("title", { required: true })}
              placeholder="Black Friday"
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title?.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              {...register("description")}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description?.message}
              </p>
            )}
          </div>

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              {...register("type", { required: true })}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            >
              <option value="">Select type</option>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
            {errors.type && (
              <p className="text-red-500 text-sm mt-1">
                {errors.type?.message}
              </p>
            )}
          </div>

          {/* Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            <input
              type="number"
              step="0.01"
              {...register("value", { required: true })}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
            {errors.value && (
              <p className="text-red-500 text-sm mt-1">
                {errors.value?.message}
              </p>
            )}
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              {...register("startDate", { required: true })}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              {...register("endDate", { required: true })}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register("status", { required: true })}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            >
              <option value="">Select status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Applicable To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Applies To
            </label>
            <select
              {...register("applicableTo", { required: true })}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            >
              <option value="">Select</option>
              <option value="all">All Products</option>
              <option value="category">Specific Category</option>
              <option value="product">Specific Products</option>
            </select>
          </div>

          {/* Product Multi-Select */}
          {applicableTo === "product" && (
            <div>
              <label className="block font-semibold mb-2">
                Select Products:
              </label>
              {loading ? (
                <p>Loading products...</p>
              ) : (
                <Select
                  options={products.map((product) => ({
                    value: product.id,
                    label: product.name,
                  }))}
                  isMulti
                  className="react-select-container"
                  classNamePrefix="react-select"
                  onChange={(selectedOptions) => {
                    const values = selectedOptions.map((opt) => opt.value);
                    setValue("productIds", values); // use react-hook-form's setValue
                  }}
                />
              )}
            </div>
          )}

          {applicableTo === "category" && (
            <div>
              <label className="block font-semibold mb-2">
                Select Category:
              </label>
              {loading ? (
                <p>Loading category...</p>
              ) : (
                <Select
                  options={products.map((product) => ({
                    value: product.cateogory,
                    label: product.cateogory,
                  }))}
                  isMulti
                  className="react-select-container"
                  classNamePrefix="react-select"
                  onChange={(selectedOptions) => {
                    const values = selectedOptions.map((opt) => opt.value);
                    setValue("categoryIds", values);
                  }}
                />
              )}
            </div>
          )}

          <div className="flex items-center gap-2 font-montserrat text-lg">
            <input
              type="checkbox"
              {...register("isSpecial")}
              className="w-5 h-5 accent-primary"
            />
            <span className="text-sm font-bold text-gray-700">
              Special Campaign
            </span>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-xl text-center font-semibold hover:opacity-90 transition-all duration-200 shadow-md"
            >
              Create Promotion
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreatePromotionPage;
