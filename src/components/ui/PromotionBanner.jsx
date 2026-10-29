const PromotionBanner = ({ description, endDate, type, value }) => {
  const ends = new Date(endDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });

  return (
    <div className="bg-headline px-4 py-2 text-center text-xs text-white sm:text-sm">
      <span className="font-bold text-accent">
        {type === "percentage" ? `${value}% off` : `₦${value} off`}
      </span>
      <span className="mx-2 text-white/40">•</span>
      <span>{description}</span>
      <span className="ml-2 hidden text-white/60 sm:inline">Ends {ends}</span>
    </div>
  );
};

export default PromotionBanner;
