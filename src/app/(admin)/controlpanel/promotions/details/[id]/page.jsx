"use client";
import PromotionCard from "@/components/ui/PromotionCard";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const { id } = useParams();
  const [promotionDetails, setPromotionDetails] = useState([]);
  useEffect(() => {
    const fetchPromotionDetails = async () => {
      try {
        const res = await fetch(`/api/promotion/getAllPromo/${id}`);
        if (!res.ok) throw new Error("Failed to fetch promotion details");
        const data = await res.json();
        setPromotionDetails(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching promotion details:", error);
      }
    };

    fetchPromotionDetails();
  }, [id]);
  const { title, description, type, value, applicableTo, startDate, endDate } =
    promotionDetails;
  return (
    <section className="flex items-center justify-center flex-col px-4 py-8">
      <div className="max-w-xl w-full">
        <PromotionCard
          title={title}
          description={description}
          type={type}
          value={value}
          startDate={startDate}
          endDate={endDate}
          applicableTo={applicableTo}
        />
      </div>

      <div className="flex items-start justify-between p-6 mt-6 max-w-xl w-full">
        <div className="grid gap-6">
          <div>
            <p className="text-gray-600 font-bold">
              <strong>Title:</strong>
            </p>
            <p className="text-gray-600">{title}</p>
          </div>
          <div>
            <p className="text-gray-600 font-bold">
              <strong>Type:</strong>
            </p>
            <p className="text-gray-600">{type}</p>
          </div>
          <div>
            <p className="text-gray-600 font-bold">
              <strong>Description:</strong>
            </p>
            <p className="text-gray-600">{description}</p>
          </div>
          <div>
            <p className="text-gray-600 font-bold">
              <strong>Value:</strong>
            </p>
            <p className="text-gray-600">{value}</p>
          </div>
        </div>

        <div className="grid gap-6">
          <div>
            <p className="text-gray-600 font-bold">
              <strong>Applicable To:</strong>
            </p>
            <p className="text-gray-600">{applicableTo}</p>
          </div>
          <div>
            <p className="text-gray-600 font-bold">
              <strong>Start Date:</strong>
            </p>
            <p className="text-gray-600">
              {new Date(startDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-gray-600 font-bold">
              <strong>End Date:</strong>
            </p>
            <p className="text-gray-600">
              {new Date(endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
