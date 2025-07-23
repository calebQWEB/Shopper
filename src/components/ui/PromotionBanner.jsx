import React from "react";

const PromotionBanner = ({ description, startDate, endDate, type, value }) => {
  const format = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };
  return (
    <div className="bg-yellow-100 text-yellow-800 p-2 text-center text-sm font-medium">
      <p className="text-gray-800 text-base mb-5 leading-relaxed">
        {description}
      </p>
      <div>
        <p className="mt-2 font-semibold text-yellow-800">
          {type === "percentage" ? `${value}% OFF` : `₦${value} OFF`}— Valid:{" "}
          {format(startDate)} to {format(endDate)}
        </p>
      </div>
    </div>
  );
};

export default PromotionBanner;
