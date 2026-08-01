import { useState, useEffect } from "react";
import { Trophy, Calendar, Medal, Sparkles } from "lucide-react";
import ArtikelPopulerApi from "../../components/components-global/artikel-populer-api";
import {
  achievementsService,
  type Achievement,
} from "../../services/achievements";
import ProfileHero from "../../components/common/ProfileHero";

const PrestasiMahasantri = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await achievementsService.getAll();
        setAchievements(response.data);
      } catch (err) {
        setError("Gagal memuat data prestasi. Silakan coba lagi.");
        console.error("Error fetching achievements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Group achievements by year
  const groupedByYear = achievements.reduce(
    (acc, achievement) => {
      const year = achievement.years;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(achievement);
      return acc;
    },
    {} as Record<number, Achievement[]>,
  );

  const sortedYears = Object.keys(groupedByYear).sort(
    (a, b) => Number(b) - Number(a),
  );

  // ─── Loading State ───────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gray-50/50">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-emerald-500 animate-spin" />
          <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-t-emerald-300 animate-spin [animation-duration:1.5s]" />
        </div>
        <p className="mt-5 text-sm text-gray-500 font-medium animate-pulse">
          Memuat prestasi...
        </p>
      </div>
    );
  }

  // ─── Error State ─────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-gray-50/50 px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-red-50 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Terjadi Kesalahan
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-5 px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/80 dark:bg-gray-950">
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-10">
          <ProfileHero
            title="Prestasi Mahasantri"
            description="Daftar prestasi yang diraih oleh para mahasantri dalam berbagai kompetisi, akademik, penelitian, hingga karya publikasi."
            badge="Rekam Jejak Gemilang"
            badgeIcon={<Sparkles className="w-3.5 h-3.5 text-emerald-600" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* ─── Main Content ─────────────────────────────────── */}
          <div className="lg:col-span-8">

            {/* Achievement Stats */}

            {/* Achievement List by Year */}
            <div className="space-y-8 lg:space-y-10">
              {sortedYears.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gray-50 flex items-center justify-center">
                    <Trophy className="w-7 h-7 text-gray-300" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Belum Ada Data Prestasi
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Data prestasi akan muncul di sini setelah tersedia.
                  </p>
                </div>
              ) : (
                sortedYears.map((year) => (
                  <div key={year}>
                    {/* Year Header */}
                    <div className="flex items-center gap-3 mb-4 lg:mb-5">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">
                          Tahun {year}
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {groupedByYear[Number(year)].length} prestasi
                        </p>
                      </div>
                      <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-transparent" />
                    </div>

                    {/* Achievement Cards */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                      <div className="divide-y divide-gray-50 dark:divide-gray-700">
                        {groupedByYear[Number(year)].map(
                          (achievement, index) => (
                            <div
                              key={achievement.id}
                              className="group flex items-start gap-4 p-4 sm:p-5 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors duration-200"
                            >
                              {/* Number */}
                              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 flex items-center justify-center text-xs font-bold group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/30 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {String(index + 1).padStart(2, "0")}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors leading-snug">
                                  {achievement.title}
                                </h3>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                  {achievement.name}
                                </p>
                              </div>

                              {/* Medal icon */}
                              <div className="flex-shrink-0 hidden sm:flex w-8 h-8 rounded-full bg-amber-50 items-center justify-center">
                                <Medal className="w-4 h-4 text-amber-500" />
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────── */}
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-6">
              <ArtikelPopulerApi />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrestasiMahasantri;
