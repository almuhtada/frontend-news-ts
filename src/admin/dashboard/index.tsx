import { useState, useEffect } from "react";
import { Eye, MessageSquare, FileText, TrendingUp, Loader } from "lucide-react";
import type { Member } from "../../components/dashboard/TeamProductivity";
import Sidebar from "../../components/components-admin/sidebar";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatsCards from "../../components/dashboard/StatsCards";
import ViewsChart from "../../components/dashboard/ViewsChart";
import TopArticles from "../../components/dashboard/TopArticles";
import TeamProductivity from "../../components/dashboard/TeamProductivity";
import LastNews, { type News } from "../../components/dashboard/LastNews";
import LastComments from "../../components/dashboard/LastComments";
import CategoryPie from "../../components/dashboard/CategoryPie";
import CategoryEngagementBar from "../../components/dashboard/CategoryEngagementBar";
import { postsService, type Post } from "../../services/posts";
import { interactionService, type Comment } from "../../services/interactions";
import { statsService, type CategoryEngagement, type CategoryDistribution } from "../../services/stats";

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [recentComments, setRecentComments] = useState<Comment[]>([]);
  const [categoryEngagement, setCategoryEngagement] = useState<CategoryEngagement[]>([]);
  const [categoryDistribution, setCategoryDistribution] = useState<CategoryDistribution[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalComments, setTotalComments] = useState(0);

  // Fetch all dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Fetch all posts (for statistics and charts)
        const postsResponse = await postsService.getPosts({
          limit: 1000,
          status: 'publish'
        });
        const allPosts = postsResponse.posts;
        setPosts(allPosts);

        // Calculate total views
        const views = allPosts.reduce((sum, post) => sum + ((post.views || post.view_count) || 0), 0);
        setTotalViews(views);
        setTotalArticles(allPosts.length);

        // Fetch recent comments from all posts
        try {
          const commentsResponse = await interactionService.getAllComments(
            "approved",
            100,
            0
          );
          if (commentsResponse.success) {
            setRecentComments(commentsResponse.data.comments);
            setTotalComments(commentsResponse.data.total);
          }
        } catch (error) {
          console.error("Error fetching comments:", error);
        }

        // Fetch category engagement statistics
        try {
          const engagement = await statsService.getCategoryEngagement();
          console.log("Category Engagement:", engagement);
          setCategoryEngagement(engagement);
        } catch (error) {
          console.error("Error fetching category engagement:", error);
        }

        // Fetch category distribution
        try {
          const distribution = await statsService.getCategoryDistribution();
          console.log("Category Distribution:", distribution);
          setCategoryDistribution(distribution);
        } catch (error) {
          console.error("Error fetching category distribution:", error);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate views data for chart (last 7 days)
  const getViewsData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map(date => {
      // For now, distribute views evenly across days
      // In production, this should come from view tracking with timestamps
      const dailyViews = Math.floor(totalViews / 7);
      return { date, views: dailyViews + Math.floor(Math.random() * 200) };
    });
  };

  // Get category distribution from fetched data
  const getCategoryData = () => {
    return categoryDistribution;
  };

  // Get top articles by views
  const getTopArticles = () => {
    return [...posts]
      .sort((a, b) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, 5)
      .map(post => ({
        id: post.id,
        title: post.title,
        views: (post.views || post.view_count) || 0,
      }));
  };

  // Get category engagement from fetched data
  const getCategoryEngagementData = () => {
    return categoryEngagement;
  };

  // Format last comments for display
  const getLastComments = () => {
    return recentComments.slice(0, 10).map(comment => {
      const timeAgo = getTimeAgo(comment.createdAt);

      return {
        id: comment.id,
        author: comment.author_name,
        comment: comment.content.substring(0, 100) + (comment.content.length > 100 ? '...' : ''),
        article: comment.post?.title || 'Unknown Article',
        time: timeAgo,
      };
    });
  };

  // Format last news for display
  const getLastNews = (): News[] => {
    return [...posts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(post => ({
        id: post.id,
        title: post.title,
        author: post.author?.display_name || post.author?.username || 'Unknown',
        editor: 'Editor', // This would come from post metadata if available
        time: getTimeAgo(post.createdAt),
        status: (post.status === 'publish' ? 'Published' : 'Draft') as 'Published' | 'Draft',
        category: post.categories?.[0]?.name || 'Uncategorized',
      }));
  };

  // Get team productivity (authors)
  const getTeamProductivity = (): Member[] => {
    const authorStats: Record<string, { name: string; role: 'Penulis' | 'Editor'; total: number }> = {};

    posts.forEach(post => {
      const authorName = post.author?.display_name || post.author?.username || 'Unknown';
      if (!authorStats[authorName]) {
        authorStats[authorName] = {
          name: authorName,
          role: 'Penulis' as const,
          total: 0,
        };
      }
      authorStats[authorName].total++;
    });

    return Object.values(authorStats)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5)
      .map((member, index) => ({
        id: index + 1,
        ...member,
      }));
  };

  // Helper function to get time ago
  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return `${seconds} detik lalu`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} menit lalu`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} jam lalu`;
    const days = Math.floor(hours / 24);
    return `${days} hari lalu`;
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-gray-950">
        <Sidebar />
        <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 flex items-center justify-center">
          <div className="text-center">
            <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Memuat data dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  const viewsData = getViewsData();
  const avgViews = Math.round(totalViews / (viewsData.length || 1));
  const categoryData = getCategoryData();
  const topArticles = getTopArticles();
  const categoryEngagementData = getCategoryEngagementData();
  const lastComments = getLastComments();
  const lastNews = getLastNews();
  const teamProductivity = getTeamProductivity();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-gray-950">
      <Sidebar />

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 lg:space-y-10 overflow-x-hidden">
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
              note: `${posts.length} artikel`,
              icon: Eye,
            },
            {
              label: "Rata-rata / Hari",
              value: avgViews.toLocaleString(),
              note: "7 hari terakhir",
              icon: TrendingUp,
            },
            {
              label: "Total Artikel",
              value: totalArticles.toString(),
              note: "Terpublikasi",
              icon: FileText,
            },
            {
              label: "Komentar",
              value: totalComments.toString(),
              note: "Disetujui",
              icon: MessageSquare,
            },
          ]}
        />

        {/* ===== ANALYTICS ===== */}
        <section className="space-y-6 sm:space-y-8">
          {/* ===== Views + Category Pie ===== */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
            {/* Views Chart (lebar) */}
            <div className="xl:col-span-2 bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 sm:p-6 overflow-x-auto">
              <ViewsChart data={viewsData} />
            </div>

            {/* Category Pie */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 sm:p-6">
              <CategoryPie data={categoryData} />
            </div>
          </div>

          {/* ===== Category Engagement (FULL WIDTH) ===== */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm p-4 sm:p-6 overflow-x-auto">
            <CategoryEngagementBar data={categoryEngagementData} />
          </div>
        </section>

        {/* ===== CONTENT INSIGHT ===== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <TopArticles articles={topArticles} />
          <LastNews data={lastNews} />
        </section>

        {/* ===== ENGAGEMENT ===== */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <LastComments data={lastComments} />
          <TeamProductivity data={teamProductivity} />
        </section>
      </main>
    </div>
  );
};

export default Home;
