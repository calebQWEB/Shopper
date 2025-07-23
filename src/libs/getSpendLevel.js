export function getSpendLevel(totalSpent) {
  if (totalSpent >= 40000) return "platinum";
  if (totalSpent >= 15000) return "gold";
  if (totalSpent >= 5000) return "silver";
  return "bronze";
}
