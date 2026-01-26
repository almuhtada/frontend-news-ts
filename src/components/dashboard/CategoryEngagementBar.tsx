import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type CategoryEngagementBarProps = {
  data: {
    category: string;
    views: number;
    likes: number;
    comments: number;
  }[];
};

const BAR_COLORS = {
  views: "#69bf64",
  likes: "#ff2800",
  comments: "#ffe14c",
};

export default function CategoryEngagementBar({
  data,
}: CategoryEngagementBarProps) {
  return (
    <div className="w-full h-[360px] rounded-2xl bg-white p-4 shadow-sm">
      <h3 className="mb-3 text-sm font-semibold text-slate-700">
        Category Engagement
      </h3>

      <ResponsiveContainer>
        <BarChart data={data} barGap={10} barCategoryGap={20}>
          {/* GRID LEMBUT */}
          <CartesianGrid vertical={false} stroke="#e5e7eb" opacity={0.4} />

          {/* AXIS TENANG */}
          <XAxis
            dataKey="category"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#64748b" }}
          />

          {/* TOOLTIP FLOATING */}
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #e5e7eb",
              fontSize: 12,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
            }}
          />

          {/* LEGEND LEBIH RINGAN */}
          <Legend
            wrapperStyle={{
              fontSize: 12,
              color: "#64748b",
            }}
          />

          {/* BARS */}
          <Bar dataKey="views" fill={BAR_COLORS.views} radius={[6, 6, 0, 0]} />
          <Bar dataKey="likes" fill={BAR_COLORS.likes} radius={[6, 6, 0, 0]} />
          <Bar
            dataKey="comments"
            fill={BAR_COLORS.comments}
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
