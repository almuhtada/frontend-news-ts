import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type CategoryPieProps = {
  data: { name: string; value: number }[];
};

const COLORS = [
  "#8FAE9B", // Matcha green (muted)
  "#D6C26E", // Kuning UNNES (soft mustard)
  "#C45A5A", // Merah Ferrari (muted red)
  "#7FA6C2", // Biru nasional (muted blue)
  "#8B7FB3", // Ungu lembut
  "#C29A6B", // Coklat tanah
  "#A3B18A", // Olive green
  "#6FAF9A", // Tosca hijau (soft)
  "#BFA3C2", // Pink dusty
  "#9C8F7A", // Abu coklat hangat
  "#7F9F8C", // Moss green
  "#C7BFA6", // Cream oat
  "#8FA3A6", // Teal pudar
  "#B8A48C", // Latte
  "#A97C50", // Copper muted
];

export default function CategoryPie({ data }: CategoryPieProps) {
  return (
    <div style={{ width: "100%", height: 320 }}>
      <h3
        style={{
          marginBottom: 12,
          fontWeight: 600,
          color: "#334155", // slate-700
        }}
      >
        News Category Distribution
      </h3>

      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={{
              fill: "#475569", // slate-600
              fontSize: 12,
            }}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>

          <Tooltip
            contentStyle={{
              borderRadius: 8,
              borderColor: "#e5e7eb",
              fontSize: 12,
            }}
          />
          <Legend
            wrapperStyle={{
              fontSize: 12,
              color: "#475569",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
