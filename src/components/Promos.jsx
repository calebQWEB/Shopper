"use client";

import { useEffect, useState } from "react";
import PromotionBanner from "./ui/PromotionBanner";

const Promos = () => {
  const [activePromos, setActivePromos] = useState([]);
  const [promoIndex, setPromoIndex] = useState(0);

  useEffect(() => {
    const fetchActivePromotions = async () => {
      try {
        const res = await fetch("/api/promotion/activePromos");
        const promotions = await res.json();
        if (!res.ok) {
          console.log(promotions);
          return;
        }
        setActivePromos(promotions.activePromos);
        console.log(promotions);
      } catch (error) {
        console.error("Cannot fetch promos", error);
      }
    };

    fetchActivePromotions();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1 >= activePromos.length ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(interval);
  }, [activePromos.length]);

  return (
    activePromos && (
      <div className={activePromos ? "block" : "hidden"}>
        {activePromos.length > 0 &&
          (() => {
            const filtered = activePromos.filter((promo) => !promo.isSpecial);
            const current = filtered[promoIndex];

            return current ? (
              <PromotionBanner
                key={current.id}
                description={current.description}
                startDate={current.startDate}
                endDate={current.endDate}
                type={current.type}
                value={current.value}
              />
            ) : null;
          })()}
      </div>
    )
  );
};

export default Promos;
