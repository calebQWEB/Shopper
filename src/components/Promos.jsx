"use client";

import { useEffect, useState } from "react";
import PromotionBanner from "./ui/PromotionBanner";

const Promos = () => {
  const [promos, setPromos] = useState([]);
  const [promoIndex, setPromoIndex] = useState(0);

  useEffect(() => {
    const fetchActivePromotions = async () => {
      try {
        const res = await fetch("/api/promotion/activePromos");
        if (!res.ok) return;
        const data = await res.json();
        setPromos((data.activePromos || []).filter((promo) => !promo.isSpecial));
      } catch (error) {
        console.error("Cannot fetch promos", error);
      }
    };

    fetchActivePromotions();
  }, []);

  useEffect(() => {
    if (promos.length < 2) return;
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [promos.length]);

  const current = promos[promoIndex];
  if (!current) return null;

  return (
    <PromotionBanner
      key={current.id}
      description={current.description}
      endDate={current.endDate}
      type={current.type}
      value={current.value}
    />
  );
};

export default Promos;
