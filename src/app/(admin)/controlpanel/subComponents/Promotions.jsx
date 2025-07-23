"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { Plus, Search } from "lucide-react";
import PromotionTable from "./PromotionTable";
import { useEffect, useState } from "react";
import DeleteModal from "./DeleteModal";

const Promotions = () => {
  const [allPromotions, setAllPromotions] = useState([]);
  const [loadingPromotions, setLoadingPromotions] = useState(false);
  const [promotionError, setPromotionError] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [promotionId, setPromotionId] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data = {}) => {
    setLoadingPromotions(true);
    try {
      const params = new URLSearchParams();
      if (data.title) params.append("title", data.title);
      if (data.status) params.append("status", data.status);
      if (data.type) params.append("type", data.type);
      if (data.applicableTo) params.append("applicableTo", data.applicableTo);

      const res = await fetch(`/api/promotion/get?${params.toString()}`);
      if (!res.ok) throw new Error("Network response was not ok");
      const promo = await res.json();

      if (promo.length === 0) {
        setPromotionError("No promotions found for the given filters.");
        setAllPromotions([]);
      } else {
        setAllPromotions(promo);
        setPromotionError("");
        console.log(promo);
      }
    } catch (error) {
      console.error("Failed to fetch promotions:", error);
      setPromotionError("Failed to fetch promotions. Please try again later.");
    } finally {
      setLoadingPromotions(false);
    }
  };

  useEffect(() => {
    onSubmit();
  }, []);

  const handlePromoDelete = async () => {
    try {
      const res = await fetch(`/api/promotion/${promotionId}`, {
        method: "DELETE",
        // headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Cannot handle delete");
      await onSubmit();
      console.log("Deleted Successfully");
      // Optionally show success message here
    } catch (error) {
      alert("Failed to delete promotion.");
      console.error(error);
    }
  };

  const onClose = () => {
    setShowDeleteModal(false);
  };

  if (showDeleteModal) {
    return <DeleteModal onClose={onClose} deleteClick={handlePromoDelete} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-montserrat">
      <div className="max-w-7xl mx-auto bg-white shadow-sm rounded-2xl p-8">
        <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            All Promotions
          </h2>

          <Link href="/controlpanel/promotions/create">
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold transition">
              <Plus size={18} />
              New
            </button>
          </Link>
        </div>

        {/* Filters */}
        <form
          onSubmit={handleSubmit((data) => console.log(data))}
          className="flex flex-wrap gap-4 mb-8"
        >
          <input
            type="text"
            placeholder="Search Title"
            {...register("title")}
            className="w-full md:w-[200px] px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          <select
            {...register("status")}
            className="w-full md:w-[180px] px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Status</option>
            <option value="active">Active</option>
            <option value="inActive">Inactive</option>
          </select>

          <select
            {...register("type")}
            className="w-full md:w-[180px] px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Type</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>

          <select
            {...register("applicableTo")}
            className="w-full md:w-[200px] px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          >
            <option value="">Applicable To</option>
            <option value="all">All Products</option>
            <option value="category">Specific Category</option>
            <option value="product">Specific Products</option>
          </select>

          <button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
          >
            <Search size={18} />
            Search
          </button>
        </form>

        {/* Table */}
        <div className="overflow-x-auto">
          <PromotionTable
            allPromotions={allPromotions}
            loadingPromotions={loadingPromotions}
            promotionError={promotionError}
            setPromotionId={setPromotionId}
            setShowDeleteModal={setShowDeleteModal}
            // onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default Promotions;
