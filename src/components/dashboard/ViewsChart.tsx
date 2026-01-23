import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================= TYPES ================= */
type Range = "today" | "7d" | "30d" | "6m" | "1y";

type ViewData = {
  date: string;
  views: number;
};

type Props = {
  data: ViewData[];
};

/* ================= CONSTANTS ================= */
const RANGES: { label: string; value: Range }[] = [
  { label: "Hari ini", value: "today" },
  { label: "7 Hari", value: "7d" },
  { label: "30 Hari", value: "30d" },
  { label: "6 Bulan", value: "6m" },
  { label: "1 Tahun", value: "1y" },
];

const ViewsChart: React.FC<Props> = ({ data }) => {
  const [range, setRange] = useState<Range>("7d");

  const filteredData = useMemo(() => {
    if (!data.length) return [];

    // ambil tanggal TERBARU dari data
    const latestDate = new Date(
      Math.max(...data.map((d) => new Date(d.date).getTime())),
    );

    const isAfter = (d: Date, days: number) =>
      d >= new Date(latestDate.getTime() - days * 86400000);

    switch (range) {
      case "today":
        return data.filter(
          (d) => new Date(d.date).toDateString() === latestDate.toDateString(),
        );

      case "7d":
        return data.filter((d) => isAfter(new Date(d.date), 7));

      case "30d":
        return data.filter((d) => isAfter(new Date(d.date), 30));

      case "6m":
        return data.filter((d) => isAfter(new Date(d.date), 180));

      case "1y":
        return data.filter((d) => isAfter(new Date(d.date), 365));

      default:
        return data;
    }
  }, [data, range]);

  return (
    <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
        <h3 className="font-semibold text-gray-900">Statistik Views</h3>

        <div className="flex rounded-xl bg-gray-100 p-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition
                ${
                  range === r.value
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={filteredData}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(v) =>
              new Date(v).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
              })
            }
          />
          <YAxis />
          <Tooltip
            labelFormatter={(v) =>
              new Date(v).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            }
            formatter={(v) => [`${v} views`, "Views"]}
          />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#059669"
            strokeWidth={3}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ViewsChart;
