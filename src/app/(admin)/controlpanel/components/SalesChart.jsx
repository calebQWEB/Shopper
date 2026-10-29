"use client";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNaira } from "@/libs/format";

// Single series: violet passes the palette checks against the white card surface
const SERIES_COLOR = "#6250d6";
const GRID_COLOR = "#e2e8f0";
const AXIS_TEXT = "#64748b";

const compactNaira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  notation: "compact",
  maximumFractionDigits: 1,
});

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs shadow-lg">
      <p className="text-slate-500">{point.label}</p>
      <p className="mt-0.5 text-sm font-semibold text-headline">{formatNaira(point.revenue)}</p>
      <p className="text-slate-500">
        {point.orders} {point.orders === 1 ? "order" : "orders"}
      </p>
    </div>
  );
};

const SalesChart = ({ data }) => {
  const total = data.reduce((sum, day) => sum + day.revenue, 0);

  return (
    <section className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="font-semibold">Revenue, last 30 days</h2>
          <p className="mt-1 text-2xl font-bold">{formatNaira(total)}</p>
        </div>
      </div>

      {total === 0 ? (
        <p className="grid h-56 place-items-center text-sm text-slate-500">
          No sales in the last 30 days yet.
        </p>
      ) : (
        <>
          <div className="mt-4 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={SERIES_COLOR} stopOpacity={0.18} />
                    <stop offset="100%" stopColor={SERIES_COLOR} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={GRID_COLOR} strokeWidth={1} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={24}
                  tick={{ fill: AXIS_TEXT, fontSize: 12 }}
                />
                <YAxis
                  width={56}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => compactNaira.format(v)}
                  tick={{ fill: AXIS_TEXT, fontSize: 12 }}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: AXIS_TEXT, strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={SERIES_COLOR}
                  strokeWidth={2}
                  fill="url(#revenueFill)"
                  activeDot={{ r: 5, fill: SERIES_COLOR, stroke: "#ffffff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <details className="mt-3 text-sm">
            <summary className="cursor-pointer text-slate-500 hover:text-headline">View as table</summary>
            <table className="mt-2 w-full text-left">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-1 font-semibold">Day</th>
                  <th className="py-1 font-semibold">Orders</th>
                  <th className="py-1 text-right font-semibold">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data
                  .filter((day) => day.orders > 0)
                  .map((day) => (
                    <tr key={day.date}>
                      <td className="py-1.5">{day.label}</td>
                      <td className="py-1.5">{day.orders}</td>
                      <td className="py-1.5 text-right font-medium">{formatNaira(day.revenue)}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </details>
        </>
      )}
    </section>
  );
};

export default SalesChart;
