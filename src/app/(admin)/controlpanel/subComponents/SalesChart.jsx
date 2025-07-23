import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const SalesChart = ({ orders }) => {
  // Transform the ordersArray into the salesData format
  const salesData = orders?.orders?.map((order) => ({
    date: order.createdAt ? order.createdAt.substring(0, 10) : "",
    sales: Number(order.totalPrice) || 0,
  }));

  return (
    <div className="w-[90%] h-64 p-4 rounded-lg mt-20 bg-white shadow-sm">
      <div className="mb-6">
        <h2
          className="font-semibold font-montserrat text-lg md:text-2xl"
          onClick={() => {
            console.log(salesData);
          }}
        >
          Sales Trend
        </h2>
        <p className="font-montserrat text-sm md:text-base">
          Monitor your sales trend within the specified date range
        </p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={salesData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="#10B981"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesChart;
