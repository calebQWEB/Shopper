"use client";
import { useForm } from "react-hook-form";
import { useState } from "react";
import General from "./subComponents/General";
import Pricing from "./subComponents/Pricing";
import Inventory from "./subComponents/Inventory";
import Gallery from "./subComponents/Gallery";
import Shipping from "./subComponents/Shipping";
import Seo from "./subComponents/Seo";
import SuccessPrompt from "../../subComponents/SuccessPrompt";

const CreateProductPage = () => {
  const [showSuccessPrompt, setShowSuccessPrompt] = useState(false);
  const [tags, setTags] = useState([]);
  const createTabs = [
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
  } = useForm();

  const onSubmit = async (data) => {
    const combined = { ...data, tags };

    const createdfields = Object.fromEntries(
      Object.entries(combined).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );

    try {
      const res = await fetch("/api/product/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createdfields),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Failed to Create", errorData);
      }

      await res.json();
      console.log("Created Successfully");
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
      <SuccessPrompt promptMessage="Your product was created successfully" />
    );

  return (
    <section className="min-h-screen flex justify-center items-start px-4 py-10 font-montserrat">
      <div className="w-full max-w-4xl bg-white p-8 transition-all">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">
          Create
        </h1>

        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {createTabs.map((tab) => (
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
          <General
            register={register}
            errors={errors}
            tags={tags}
            setTags={setTags}
          />
        )}
        {activeTab === "Pricing" && (
          <Pricing register={register} errors={errors} />
        )}
        {activeTab === "Inventory" && (
          <Inventory register={register} errors={errors} />
        )}
        {activeTab === "Images" && (
          <Gallery register={register} errors={errors} />
        )}
        {activeTab === "Shipping" && (
          <Shipping register={register} errors={errors} />
        )}
        {activeTab === "SEO" && <Seo register={register} errors={errors} />}
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-md px-6 py-3 flex justify-end z-40">
        <button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="bg-green-500 text-white font-montserrat font-semibold px-6 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          Create Product
        </button>
      </div>
    </section>
  );
};

export default CreateProductPage;
