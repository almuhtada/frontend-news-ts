import { useState, useEffect } from "react";
import ArtikelPopulerApi from "../../components/components-global/artikel-populer-api";
import { aboutService, type AboutSection } from "../../services/about";
import { API_BASE_URL } from "../../config/api";
import ProfileHero from "../../components/common/ProfileHero";

const TentangPesantren = () => {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await aboutService.getAll();
        setSections(response.data);
      } catch (error) {
        console.error("Error fetching about data:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || sections.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Data tidak tersedia. Silakan coba lagi nanti.
          </p>
        </div>
      </div>
    );
  }

  const getSection = (key: string) => sections.find((s) => s.section_key === key);

  const parseMission = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const getImageUrl = (url: string | null) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const baseUrl = API_BASE_URL.replace("/api", "");
    return `${baseUrl}${url}`;
  };

  const mainIntro = getSection("main_intro");
  const founders = getSection("founders");
  const vision = getSection("vision");
  const mission = getSection("mission");
  const founderUstadz = getSection("founder_ustadz");
  const founderUstadzah = getSection("founder_ustadzah");
  const missionItems = mission ? parseMission(mission.content) : [];

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="mb-10">
          <ProfileHero
            title={mainIntro?.title || "Tentang Kami"}
            description="Mengenal sejarah perjuangan, profil pengasuh, serta visi dan misi Pesantren Riset Al-Muhtada."
            badge="Profil Pesantren"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {/* Kolom Kiri */}
          <div className="md:col-span-2">

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-justify">
            {mainIntro?.content}
          </p>

          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-justify">
            {founders?.content}
          </p>

          {/* Visi */}
          {vision && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {vision.title}
            </h2>
            <blockquote className="italic text-gray-600 dark:text-gray-400 border-l-4 border-green-600 pl-4 bg-green-50 dark:bg-green-900/20 py-2 rounded-md">
              "{vision.content}"
            </blockquote>
          </section>
          )}

          {/* Misi */}
          {mission && missionItems.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {mission.title}
            </h2>
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
              {missionItems.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>
          )}

          {/* Profil Pengasuh */}
          {(founderUstadz || founderUstadzah) && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Profil Pengasuh
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {founderUstadz && (
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
                  {founderUstadz.image_url && (
                    <img
                      src={getImageUrl(founderUstadz.image_url)}
                      alt={founderUstadz.title}
                      className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";
                      }}
                    />
                  )}
                  <h3 className="text-lg font-bold text-center text-gray-800 dark:text-gray-100">
                    {founderUstadz.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 leading-relaxed text-justify">
                    {founderUstadz.content}
                  </p>
                </div>
              )}

              {founderUstadzah && (
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
                  {founderUstadzah.image_url && (
                    <img
                      src={getImageUrl(founderUstadzah.image_url)}
                      alt={founderUstadzah.title}
                      className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23cccccc'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";
                      }}
                    />
                  )}
                  <h3 className="text-lg font-bold text-center text-gray-800 dark:text-gray-100">
                    {founderUstadzah.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 leading-relaxed text-justify">
                    {founderUstadzah.content}
                  </p>
                </div>
              )}
            </div>
          </section>
          )}
        </div>

        {/* Kolom Kanan: Artikel Populer */}
        <div>
          <ArtikelPopulerApi />
        </div>
      </div>
    </div>
  </div>
  );
};

export default TentangPesantren;
