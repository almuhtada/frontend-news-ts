import { useState, useEffect } from "react";
import ArtikelPopulerApi from "../../components/components-global/artikel-populer-api";
import {
  achievementsService,
  type Achievement,
} from "../../services/achievements";

const PrestasiMahasantri = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);
        const response = await achievementsService.getAll();
        setAchievements(response.data);
      } catch (error) {
        console.error("Error fetching achievements:", error);
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Layout utama: Header, Prestasi, Artikel Populer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 justify-center items-center">
          {/* Header */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl text-center font-bold text-gray-900 mb-3">
            Prestasi Mahasantri
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mb-6 sm:mb-8 text-center mx-auto px-4">
            Daftar prestasi yang diraih oleh para mahasantri dalam berbagai
            kompetisi, akademik, penelitian, hingga karya publikasi.
          </p>

          {/* Konten Prestasi */}
          <div className="space-y-10">
            {sortedYears.length === 0 ? (
              <div className="text-center text-gray-500">
                Belum ada data prestasi
              </div>
            ) : (
              sortedYears.map((year) => (
                <div key={year}>
                  <div className="border-b">
                    <h2 className="text-2xl font-semibold text-emerald-600 mb-4">
                      Tahun {year}
                    </h2>
                  </div>
                  <div className="bg-white rounded-2xl p-6">
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      {groupedByYear[Number(year)].map((achievement) => (
                        <li key={achievement.id}>
                          <strong>{achievement.title}</strong> -{" "}
                          {achievement.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Kanan: Artikel Populer */}
        <ArtikelPopulerApi />
      </div>
    </div>
  );
};

export default PrestasiMahasantri;
