"use client";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import PromotionStatusToggleButton from "./PromotionStatusToggleButton";

const PromotionTable = ({
  allPromotions,
  loadingPromotions,
  promotionError,
  setPromotionId,
  setShowDeleteModal,
}) => {
  if (loadingPromotions)
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-gray-600 text-lg">Loading promotions...</p>
      </div>
    );

  if (promotionError)
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-red-500 text-lg">{promotionError}</p>
      </div>
    );

  return (
    <table className="min-w-full divide-y divide-gray-200 font-montserrat">
      <thead className="bg-gray-100">
        <tr>
          {[
            "Title",
            "Type",
            "Value",
            "Applies To",
            "Status",
            "Start Date",
            "End Date",
            "Actions",
          ].map((heading) => (
            <th
              key={heading}
              className="px-6 py-3 text-left text-sm font-extrabold text-gray-700 uppercase tracking-wider border-b"
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {allPromotions.map((promo) => (
          <tr
            key={promo.id}
            className="transition-colors duration-200 hover:bg-gray-50"
          >
            <td className="px-6 py-4 text-gray-800 font-bold text-sm">
              {promo.title}
            </td>
            <td className="px-6 py-4 text-gray-800 font-bold text-sm">
              {promo.type}
            </td>
            <td className="px-6 py-4 text-gray-800 font-bold text-sm">
              {promo.value}
            </td>
            <td className="px-6 py-4 text-gray-800 font-bold text-sm">
              {promo.applicableTo}
            </td>
            <td className="px-6 py-4 text-gray-800 font-bold text-sm">
              <PromotionStatusToggleButton
                status={promo.status}
                id={promo.id}
              />
            </td>
            <td className="px-6 py-4 text-gray-800 font-bold text-sm">
              {new Date(promo.startDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 text-gray-800 font-bold text-sm">
              {new Date(promo.endDate).toLocaleDateString()}
            </td>
            <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
              <Link href={`/controlpanel/promotions/edit/${promo.id}`}>
                <button
                  title="edit"
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </button>
              </Link>
              <Link href={`/controlpanel/promotions/details/${promo.id}`}>
                <button
                  title="details"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Eye size={18} />
                </button>
              </Link>
              <button
                onClick={() => {
                  setPromotionId(promo.id);
                  setShowDeleteModal(true);
                }}
                className="text-red-600 hover:text-red-800"
                title="delete"
              >
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default PromotionTable;
