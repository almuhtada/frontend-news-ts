import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  Area,
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

export default function ViewsChart({ data }: Props) {
  const [range, setRange] = useState<Range>("7d");

  const filteredData = useMemo(() => {
    if (!data.length) return [];

    const latest = new Date(
      Math.max(...data.map((d) => new Date(d.date).getTime())),
    );

    const withinDays = (date: string, days: number) =>
      new Date(date) >= new Date(latest.getTime() - days * 86400000);

    switch (range) {
      case "today":
        return data.filter(
          (d) => new Date(d.date).toDateString() === latest.toDateString(),
        );
      case "7d":
        return data.filter((d) => withinDays(d.date, 7));
      case "30d":
        return data.filter((d) => withinDays(d.date, 30));
      case "6m":
        return data.filter((d) => withinDays(d.date, 180));
      case "1y":
        return data.filter((d) => withinDays(d.date, 365));
      default:
        return data;
    }
  }, [data, range]);

  return (
    <div
      className="
        relative overflow-hidden  p-6
     
      "
    >
      {/* subtle depth overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/70 via-transparent to-emerald-50/40" />

      {/* ================= HEADER ================= */}
      <div className="relative z-10 mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            Statistik Views
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Tren kunjungan berdasarkan waktu
          </p>
        </div>

        <div className="flex rounded-xl bg-gray-100/70 p-1 shadow-inner">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all
                ${
                  range === r.value
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= CHART ================= */}
      <div className="relative z-10">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={filteredData}>
            <defs>
              {/* blur untuk shadow fill */}
              <filter id="areaBlur">
                <feGaussianBlur stdDeviation="7" />
              </filter>

              {/* glow halus untuk line */}
              <filter id="lineGlow">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* inner shadow gradient */}
              <linearGradient id="innerShadow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.12} />
                <stop offset="35%" stopColor="#10b981" stopOpacity={0.05} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="#e5e7eb" opacity={0.15} />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              tickFormatter={(v) =>
                new Date(v).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })
              }
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
              width={40}
            />

            <Tooltip
              contentStyle={{
                background: "rgba(255,255,255,0.85)",
                backdropFilter: "blur(6px)",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                fontSize: 12,
              }}
              formatter={(v) => [`${v} views`, "Views"]}
            />

            {/* SHADOW DI DALAM LINE */}
            <Area
              type="monotone"
              dataKey="views"
              fill="url(#innerShadow)"
              stroke="none"
              filter="url(#areaBlur)"
            />

            {/* LINE UTAMA */}
            <Line
              type="monotone"
              dataKey="views"
              stroke="#10b981"
              strokeWidth={2.2}
              dot={false}
              activeDot={{ r: 5 }}
              filter="url(#lineGlow)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
