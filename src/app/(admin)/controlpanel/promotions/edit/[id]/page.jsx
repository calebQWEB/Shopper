"use client";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState, useEffect } from "react";
import { styles } from "@/libs/styles";
import React from "react";
import { set, useForm } from "react-hook-form";
import SuccessPrompt from "../../../subComponents/SuccessPrompt";
import { useParams } from "next/navigation";
import Select from "react-select";

const promotionSchema = yup.object().shape({
  title: yup.string(),
  description: yup.string(),
  type: yup
    .string()
    .oneOf(["percentage", "fixed"], "Type must be 'percentage' or 'fixed'"),
  value: yup
    .number()
    .typeError("Value must be a number")
    .positive("Value must be positive"),
  startDate: yup.date().required("Start date is required"),
  endDate: yup
    .date()
    .min(yup.ref("startDate"), "End date must be after start date"),
  status: yup.string().oneOf(["active", "inactive"]),
});

const page = () => {
  const { id } = useParams();
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
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);

  const [getSpecPromo, setGetSpecPromo] = useState([]);
  const [promoLoading, setPromoLoading] = useState(false);

  const [submitLoad, setSubmitLoad] = useState(false);

  const applicableTo = watch("applicableTo");

  useEffect(() => {
    // Fetch products on mount
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/product/get");
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      } finally {
        setPromoLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchSpecPromo = async () => {
      try {
        const res = await fetch(`/api/promotion/getAllPromo/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to fetch promotion data");

        setGetSpecPromo(data);
        reset({
          title: data.title,
          description: data.description,
          type: data.type,
          value: data.value,
          startDate: data.startDate.split("T")[0],
          endDate: data.endDate.split("T")[0],
          status: data.status,
          applicableTo: data.applicableTo,
          // productIds: data.productIds ? data.productIds.split(",") : [],
        });
      } catch (error) {
        console.error("Failed to fetch promotion data:", error);
      }
    };

    fetchSpecPromo();
  }, [id]);

  const onSubmit = async (data) => {
    let productIds = data.productIds || [];
    let categoryIds = data.categoryIds || [];

    const payload = {
      ...data,
      productIds: productIds.join(","),
      categoryIds: categoryIds.join(","),
      value: parseFloat(data.value),
    };
    setSubmitLoad(true);
    try {
      const res = await fetch(`/api/promotion/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to update", data);
      }

      console.log("Updated Successfully");
      setShowSuccessPrompt(true);
      setTimeout(() => {
        setShowSuccessPrompt(false);
        reset();
      }, 5000);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitLoad(false);
    }
  };

  if (showSuccessPrompt)
    return (
      <SuccessPrompt promptMessage="Your promotion was edited successfully" />
    );

  if (promoLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading promotion data...</p>
      </div>
    );

  return (
    <section className={`${styles.padding} font-monsterrat`}>
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl md:text-3xl font-bold mb-10 text-gray-800">
          Edit Promotion
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              {...register("title")}
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
              {...register("type")}
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
              {...register("value")}
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
              {...register("startDate")}
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
              {...register("endDate")}
              className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              {...register("status")}
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
              {...register("applicableTo")}
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

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-xl text-center font-semibold hover:opacity-90 transition-all duration-200 shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default page;
