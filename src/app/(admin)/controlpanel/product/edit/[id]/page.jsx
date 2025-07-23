"use client";
import { useForm } from "react-hook-form";

import { useParams } from "next/navigation";
import React, { useState } from "react";
import SuccessPrompt from "../../../subComponents/SuccessPrompt";
import GeneralEdit from "../subComponents/GeneralEdit";
import PricingEdit from "../subComponents/PricingEdit";
import InventoryEdit from "../subComponents/InventoryEdit";
import GalleryEdit from "../subComponents/GalleryEdit";
import ShippingEdit from "../subComponents/ShippingEdit";
import SeoEdit from "../subComponents/SeoEdit";

const EditProductPage = () => {
  const { id } = useParams();
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
  const [tags, setTags] = useState([]);
  const editTabs = [
    "General",
    "Pricing",
    "Inventory",
    "Images",
    "Shipping",
    "SEO",
    ,
  ];
  const [activeTab, setActiveTab] = useState("General");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  const onSubmit = async (data) => {
    const combined = { ...data, tags };

    const editedFields = Object.fromEntries(
      Object.entries(combined).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    try {
      const res = await fetch(`/api/product/${parseInt(id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedFields),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to update", errorData);
      }

      await res.json();
      console.log("Updated Successfully");
      setShowSuccessPrompt(true);
      setTimeout(() => {
        setShowSuccessPrompt(false);
      }, 5000);
    } catch (error) {
      console.error(error);
    }
  };

  if (showSuccessPrompt)
    return (
      <SuccessPrompt promptMessage="Your product was edited successfully" />
    );

  return (
    <section className="min-h-screen flex justify-center items-start px-4 py-10 font-montserrat">
      <div className="w-full max-w-4xl bg-white p-8 transition-all">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
          Edit Product <span className="text-primary">#{id}</span>
        </h1>

        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {editTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 px-3 font-semibold border-b-2 transition ${
                activeTab === tab
                  ? "border-[#ebb26c] text-[#ebb26c]"
                  : "border-transparent text-gray-500 hover:text-[#ebb26c]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "General" && (
          <GeneralEdit
            register={register}
            errors={errors}
            tags={tags}
            setTags={setTags}
            setValue={setValue}
            watch={watch}
          />
        )}
        {activeTab === "Pricing" && (
          <PricingEdit register={register} errors={errors} />
        )}
        {activeTab === "Inventory" && (
          <InventoryEdit register={register} errors={errors} />
        )}
        {activeTab === "Images" && (
          <GalleryEdit register={register} errors={errors} />
        )}
        {activeTab === "Shipping" && (
          <ShippingEdit register={register} errors={errors} />
        )}
        {activeTab === "SEO" && <SeoEdit register={register} errors={errors} />}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md px-6 py-3 flex justify-end z-40">
        <button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="bg-[#ebb26c] text-white font-montserrat font-semibold px-6 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          Save Changes
        </button>
      </div>
    </section>
  );
};

export default EditProductPage;
