import { useState } from "react";

const PromotionStatusToggleButton = ({ status, id }) => {
  const [promoStatus, setPromoStatus] = useState(status);

  const toggleStatus = async () => {
    const newStatus = promoStatus === "active" ? "inactive" : "active";
    setPromoStatus(newStatus);

    try {
      const res = await fetch(`/api/promotion/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to update", data);
      } else {
        console.log('Updated Successfully')
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      onClick={toggleStatus}
      className={`relative w-12 h-6 flex items-center rounded-full cursor-pointer transition-colors duration-300 
    ${promoStatus === "active" ? "bg-green-600" : "bg-gray-300"}
  `}
    >
      <div
        className={`absolute bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 
      ${promoStatus === "active" ? "translate-x-1" : "translate-x-6"}
    `}
      ></div>
    </div>
  );
};

export default PromotionStatusToggleButton;
