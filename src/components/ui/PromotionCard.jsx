const PromotionCard = ({
  title,
  type,
  description,
  value,
  applicableTo,
  startDate,
  endDate,
}) => {
  const format = (date) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 border border-blue-300 shadow-lg rounded-3xl p-6 hover:shadow-2xl transition duration-300 font-inter">
      <h2 className="text-3xl font-bold text-blue-900 mb-3 tracking-tight">
        {title}
      </h2>
      <p className="text-gray-800 text-base mb-5 leading-relaxed">
        {description}
      </p>

      <div>
        <div>
          <p className="mt-2 font-semibold text-blue-800">
            {type === "percentage" ? `${value}% OFF` : `₦${value} OFF`}— Valid:{" "}
            {format(startDate)} to {format(endDate)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;
