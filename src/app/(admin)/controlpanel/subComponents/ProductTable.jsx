"use client";
import React from "react";
import { Pencil, Eye, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

const ProductTable = ({
  setProductId,
  products,
  setShowEditModal,
  setShowDeleteModal,
}) => {
  const router = useRouter();

  return (
    <table className="min-w-full divide-y divide-gray-200 font-montserrat">
      <thead className="bg-gray-100">
        <tr>
          {[
            "Name",
            "Price",
            "Category",
            "Quantity",
            "SKU",
            "Status",
            "Actions",
          ].map((heading) => (
            <th
              key={heading}
              className="px-6 py-3 text-left text-sm font-bold text-gray-700 uppercase tracking-wider border-b"
            >
              {heading}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {products.map((product) => (
          <tr
            key={product.id}
            className="transition-colors duration-200 hover:bg-gray-50"
          >
            <td className="px-6 py-4 text-gray-800">{product.name}</td>
            <td className="px-6 py-4 text-gray-800">
              ${product.price.toFixed(2)}
            </td>
            <td className="px-6 py-4 text-gray-800">
              {product.cateogory || "N/A"}
            </td>
            <td className="px-6 py-4 text-gray-800">{product.quantity}</td>
            <td className="px-6 py-4 text-gray-800">{product.sku || "N/A"}</td>
            <td className="px-6 py-4">
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  product.quantity > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.quantity > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap flex items-center space-x-3">
              <button
                title="edit"
                className="text-blue-600 hover:text-blue-800"
                onClick={() => {
                  setProductId(product.id);
                  setShowEditModal(true);
                }}
              >
                <Pencil size={18} />
              </button>
              <button
                title="details"
                className="text-gray-600 hover:text-gray-800"
                onClick={() =>
                  router.push(`/controlpanel/product/details/${product.id}`)
                }
              >
                <Eye size={18} />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                title="delete"
                onClick={() => {
                  setShowDeleteModal(true);
                  setProductId(product.id);
                }}
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

export default ProductTable;
