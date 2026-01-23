import { Eye, MessageSquare, FileText, TrendingUp } from "lucide-react";
import type { Member } from "../../components/dashboard/TeamProductivity";
import Sidebar from "../../components/components-admin/sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatsCards from "../../components/dashboard/StatsCards";
import ViewsChart from "../../components/dashboard/ViewsChart";
import TopArticles from "../../components/dashboard/TopArticles";
import TeamProductivity from "../../components/dashboard/TeamProductivity";
import LastNews, { type News } from "../../components/dashboard/LastNews";
import LastComments from "../../components/dashboard/LastComments";

/* ================= MOCK DATA ================= */

const viewsData = [
  { date: "2025-09-09", views: 1200 },
  { date: "2025-09-10", views: 1580 },
  { date: "2025-01-11", views: 1890 },
  { date: "2025-09-12", views: 1420 },
  { date: "2025-03-13", views: 1670 },
  { date: "2025-09-14", views: 2100 },
  { date: "2025-09-15", views: 1850 },
] satisfies { date: string; views: number }[];

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

const lastNews: News[] = [
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

const teamProductivity: Member[] = [
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
        <DashboardHeader
          title="Dashboard Admin"
          subtitle="Ringkasan performa dan aktivitas redaksi Pesantren Al-Muhtada"
        />

        {/* ===== SUMMARY STATS ===== */}
        <StatsCards
          stats={[
            {
              label: "Total Views",
              value: totalViews.toLocaleString(),
              note: "+12%",
              icon: Eye,
            },
            {
              label: "Rata-rata / Hari",
              value: avgViews.toLocaleString(),
              note: "Stabil",
              icon: TrendingUp,
            },
            {
              label: "Total Artikel",
              value: "156",
              note: "+5 baru",
              icon: FileText,
            },
            {
              label: "Komentar",
              value: "1.284",
              note: "+8%",
              icon: MessageSquare,
            },
          ]}
        />

        {/* ===== CHART & TOP ARTICLES ===== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ViewsChart data={viewsData} />
          <TopArticles articles={topArticles} />
        </section>

        {/* ===== COMMENTS & LAST NEWS ===== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <LastComments data={lastComments} />
          <LastNews data={lastNews} />
        </section>

        {/* ===== PRODUKTIVITAS TIM ===== */}

        <TeamProductivity data={teamProductivity} />
      </main>
    </div>
  );
};

export default Home;
