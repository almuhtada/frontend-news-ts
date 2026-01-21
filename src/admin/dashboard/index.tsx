import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Eye,
  MessageSquare,
  FileText,
  TrendingUp,
  Calendar,
  User,
  CheckCircle2,
} from "lucide-react";
import Sidebar from "../../ui/components-admin/sidebar";

/* ================= MOCK DATA ================= */

const viewsData = [
  { date: "09/09", views: 1200 },
  { date: "10/09", views: 1580 },
  { date: "11/09", views: 1890 },
  { date: "12/09", views: 1420 },
  { date: "13/09", views: 1670 },
  { date: "14/09", views: 2100 },
  { date: "15/09", views: 1850 },
];

const topArticles = [
  { id: 1, title: "Teknologi AI Mengubah Dunia Industri", views: 12500 },
  { id: 2, title: "Inflasi Indonesia Turun", views: 9800 },
  { id: 3, title: "Timnas Raih Kemenangan", views: 8750 },
  { id: 4, title: "Tips Hidup Sehat", views: 7200 },
  { id: 5, title: "Kebijakan UMKM Baru", views: 6900 },
];

const lastComments = [
  {
    id: 1,
    author: "Ahmad Rizky",
    comment: "Artikel sangat informatif dan mudah dipahami.",
    article: "Teknologi AI Mengubah Dunia Industri",
    time: "2 menit lalu",
  },
  {
    id: 2,
    author: "Sari Dewi",
    comment: "Analisisnya sangat tepat dan relevan.",
    article: "Inflasi Indonesia Turun",
    time: "15 menit lalu",
  },
];

const lastNews = [
  {
    id: 1,
    title: "Inovasi Startup Indonesia",
    author: "Sarah Wijaya",
    editor: "Muhammad Farid",
    time: "30 menit lalu",
    status: "Published",
    category: "Teknologi",
  },
  {
    id: 2,
    title: "Festival Budaya Nusantara",
    author: "Indira Sari",
    editor: "Ahmad Rizki",
    time: "1 jam lalu",
    status: "Draft",
    category: "Budaya",
  },
];

const teamProductivity = [
  { id: 1, name: "Ahmad Fauzi", role: "Penulis", total: 5 },
  { id: 2, name: "Siti Aisyah", role: "Penulis", total: 3 },
  { id: 3, name: "Muhammad Farid", role: "Editor", total: 8 },
  { id: 4, name: "Lisa Amelia", role: "Editor", total: 6 },
];

/* ================= COMPONENT ================= */

const Home: React.FC = () => {
  const totalViews = viewsData.reduce((s, i) => s + i.views, 0);
  const avgViews = Math.round(totalViews / viewsData.length);

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />

      <main className="flex-1 px-6 py-8 space-y-10">
        {/* ===== HEADER ===== */}
        <header>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          <p className="text-sm text-gray-600 mt-1">
            Ringkasan performa dan aktivitas redaksi Pesantren Al-Muhtada
          </p>
        </header>

        {/* ===== SUMMARY STATS ===== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            {
              label: "Total Views (7 Hari)",
              value: totalViews.toLocaleString(),
              icon: Eye,
              note: "+12% dari minggu lalu",
            },
            {
              label: "Rata-rata Views / Hari",
              value: avgViews.toLocaleString(),
              icon: TrendingUp,
              note: "Stabil",
            },
            {
              label: "Total Artikel",
              value: "156",
              icon: FileText,
              note: "+5 artikel baru",
            },
            {
              label: "Total Komentar",
              value: "1.284",
              icon: MessageSquare,
              note: "+8% engagement",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-gray-500">{item.label}</p>
                <div className="p-2 rounded-xl bg-emerald-50">
                  <item.icon className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-emerald-600 mt-1">{item.note}</p>
            </div>
          ))}
        </section>

        {/* ===== CHART & TOP ARTICLES ===== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">
              Views Harian (7 Hari)
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={viewsData}>
                <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#059669"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">
              Artikel Terpopuler
            </h3>
            <ul className="space-y-3">
              {topArticles.map((a, i) => (
                <li key={a.id} className="flex justify-between text-sm">
                  <span className="truncate text-gray-800">
                    {i + 1}. {a.title}
                  </span>
                  <span className="text-gray-500">
                    {a.views.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ===== COMMENTS & LAST NEWS ===== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">
              Komentar Terbaru
            </h3>
            <div className="space-y-4">
              {lastComments.map((c) => (
                <div key={c.id} className="border-l-4 border-emerald-500 pl-4">
                  <p className="text-sm font-medium text-gray-900">
                    {c.author}
                  </p>
                  <p className="text-sm text-gray-700">{c.comment}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {c.article} • {c.time}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">
              Berita Terakhir Di-upload
            </h3>
            <div className="space-y-4">
              {lastNews.map((n) => (
                <div
                  key={n.id}
                  className="border border-gray-100 rounded-xl p-4"
                >
                  <div className="flex justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {n.title}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        n.status === "Published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {n.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Penulis: {n.author} • Editor: {n.editor}
                  </p>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{n.category}</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {n.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* ===== PRODUKTIVITAS TIM ===== */}
        <section className="rounded-2xl bg-white border border-gray-100 shadow-sm">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">
              Produktivitas Tim
            </h2>
            <p className="text-sm text-gray-500">
              Ringkasan kontribusi penulis & editor
            </p>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            {/* ================= PENULIS ================= */}
            <div className="px-6 py-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-yellow-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Penulis</h3>
              </div>

              <div className="space-y-3">
                {teamProductivity
                  .filter((m) => m.role === "Penulis")
                  .map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 hover:bg-yellow-50/40 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-yellow-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {m.name}
                          </p>
                          <p className="text-xs text-gray-500">Penulis</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm font-semibold text-yellow-700">
                        <FileText className="w-4 h-4" />
                        {m.total}
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* ================= EDITOR ================= */}
            <div className="px-6 py-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Editor</h3>
              </div>

              <div className="space-y-3">
                {teamProductivity
                  .filter((m) => m.role === "Editor")
                  .map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between rounded-xl border border-gray-100 px-4 py-3 hover:bg-emerald-50/40 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-emerald-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {m.name}
                          </p>
                          <p className="text-xs text-gray-500">Editor</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-sm font-semibold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                        {m.total}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
