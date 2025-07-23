import { useEffect, useState } from "react";

export const useOrderSearch = (filters) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams();
        Object.entries(filters).forEach(([Key, value]) => {
          if (value && value !== "") {
            query.append(Key, value.trim());
          }
        });

        const response = await fetch(`/api/search?${query.toString()}`);
        const data = await response.json();

        if (response.ok) {
          setOrders(data.filteredOrders);
        } else {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        setError(error.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filters]);

  return { orders, loading, error };
};
