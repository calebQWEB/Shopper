// Product prices are stored in USD; checkout converts them to NGN for Paystack.
const priceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export const formatPrice = (value) => priceFormatter.format(Number(value) || 0);

// Fixed rate checkout uses to convert USD prices into the NGN amount charged
export const USD_TO_NGN = 1000;

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

export const formatNaira = (value) => nairaFormatter.format(Number(value) || 0);

export const toNaira = (usd) => Math.round(Number(usd) * USD_TO_NGN);

export const formatDate = (date) =>
  new Date(date).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// Percentage saved when a product has a higher oldPrice, otherwise 0
export const getDiscount = (product) =>
  product.oldPrice && product.oldPrice > product.price
    ? Math.round((1 - product.price / product.oldPrice) * 100)
    : 0;
