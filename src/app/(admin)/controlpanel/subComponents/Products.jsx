"use client";
import React, { useEffect, useState } from "react";
import ProductTable from "./ProductTable";
import EditModal from "./EditModal";
import DeleteModal from "./DeleteModal";
import { Plus } from "lucide-react";
import Link from "next/link";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState("");
  // Filter states
  const [searchName, setSearchName] = useState("");
  const [cateogory, setCateogory] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productId, setProductId] = useState("");

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const params = new URLSearchParams();
      if (searchName) params.append("name", searchName);
      if (cateogory) params.append("cateogory", cateogory);
      if (inStockOnly) params.append("inStock", "true");

      const res = await fetch(`/api/product/get?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      setProductError("Failed to fetch products");
    } finally {
      setLoadingProducts(false);
    }
  };

  const onClose = () => {
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  const handleUpdate = async (form) => {
    const updatedFields = {};
    if (form.name) updatedFields.name = form.name;
    if (form.price) updatedFields.price = parseFloat(form.price);
    if (form.description) updatedFields.description = form.description;
    if (form.cateogory) updatedFields.cateogory = form.cateogory;
    if (form.quantity !== undefined)
      updatedFields.quantity = parseInt(form.quantity);

    try {
      const res = await fetch(`/api/product/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("API Error:", errorData);
        throw new Error("Failed to update product");
      }

      const data = await res.json();
      console.log("Updated product:", data);
      fetchProducts();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const deleteProduct = async () => {
    try {
      const res = await fetch(`api/product/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error("Could not delete");
      }

      fetchProducts();
      console.log("Deleted successfully");
    } catch (error) {
      console.error("Failed to delete", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchName, cateogory, inStockOnly]);

  if (loadingProducts)
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-gray-600 text-lg">Loading products...</p>
      </div>
    );
  if (productError)
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <p className="text-red-500 text-lg">{productError}</p>
      </div>
    );

  if (showEditModal) {
    return (
      <EditModal
        productId={productId}
        product={products}
        onClose={onClose}
        handleUpdate={handleUpdate}
      />
    );
  }

  if (showDeleteModal) {
    return <DeleteModal onClose={onClose} deleteClick={deleteProduct} />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-montserrat">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">All Products</h2>
        {/* Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search by name"
              className="border px-3 py-2 rounded w-full md:w-1/3"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />

            <select
              value={cateogory}
              onChange={(e) => setCateogory(e.target.value)}
              className="border px-3 py-2 rounded w-full md:w-1/4"
            >
              <option value="">All Categories</option>
              <option value="laptops">laptops</option>
              <option value="phone">phone</option>
              <option value="tablet">tablet</option>
              {/* Add your real categories here */}
            </select>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={() => setInStockOnly(!inStockOnly)}
              />
              In Stock Only
            </label>
          </div>

          <Link href="/controlpanel/product/create">
            {" "}
            <button className="px-6 py-3 bg-green-500 rounded-xl text-white flex items-center justify-center font-bold gap-2 hover:scale-105 active:scale-95 transition">
              New
              <Plus size={20} />
            </button>
          </Link>
        </div>

        {/* Product Table */}
        <div className="overflow-x-scroll">
          <ProductTable
            setProductId={setProductId}
            products={products}
            setShowEditModal={setShowEditModal}
            setShowDeleteModal={setShowDeleteModal}
          />
        </div>
      </div>
    </div>
  );
};

export default Products;
