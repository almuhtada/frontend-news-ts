import { useState, useEffect } from "react";
import ArtikelPopulerApi from "../../components/components-global/artikel-populer-api";
import {
  publicationsService,
  type Publication,
} from "../../services/publications";

const PublikasiMahasantri = () => {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        setLoading(true);
        const response = await publicationsService.getAll();
        setPublications(response.data);
      } catch (error) {
        console.error("Error fetching publications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 dark:text-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Konten utama */}
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
            Publikasi Mahasantri
          </h1>
          {publications.length === 0 ? (
            <div className="text-center text-gray-500">
              Belum ada data publikasi
            </div>
          ) : (
            publications.map((pub) => (
              <div
                key={pub.id}
                className="p-5 rounded-2xl bg-white dark:bg-gray-800 hover:shadow-md transition"
              >
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  {pub.title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{pub.authors}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 italic">
                  {pub.journal ? `${pub.journal}, ` : ""}
                  {pub.year}
                </p>
                {pub.link && (
                  <a
                    href={pub.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    🔗 Baca selengkapnya
                  </a>
                )}
              </div>
            ))
          )}
        </div>

        {/* Sidebar artikel populer */}
        <div>
          <ArtikelPopulerApi />
        </div>
      </div>
    </div>
  );
};

export default PublikasiMahasantri;
