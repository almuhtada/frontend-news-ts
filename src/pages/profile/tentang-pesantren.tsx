import { useState, useEffect } from "react";
import ArtikelPopulerApi from "../../components/components-global/artikel-populer-api";
import { aboutService, type AboutSection } from "../../services/about";
import { API_BASE_URL } from "../../config/api";

const TentangPesantren = () => {
  const [sections, setSections] = useState<AboutSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const response = await aboutService.getAll();
        setSections(response.data);
      } catch (error) {
        console.error("Error fetching about data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const getSection = (key: string) => {
    return sections.find((s) => s.section_key === key);
  };

  const parseMission = (content: string) => {
    try {
      return JSON.parse(content);
    } catch {
      return [];
    }
  };

  const getImageUrl = (url: string | null) => {
    if (!url) return "";
    // If URL is already absolute, return as is
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    // Otherwise, prepend the API base URL (without /api)
    const baseUrl = API_BASE_URL.replace("/api", "");
    return `${baseUrl}${url}`;
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  const mainIntro = getSection("main_intro");
  const founders = getSection("founders");
  const vision = getSection("vision");
  const mission = getSection("mission");
  const founderUstadz = getSection("founder_ustadz");
  const founderUstadzah = getSection("founder_ustadzah");

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {/* Kolom Kiri */}
        <div className="md:col-span-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-6 md:mb-8">
            {mainIntro?.title || "Tentang Pesantren"}
          </h1>

          {mainIntro && (
            <p className="text-gray-700 leading-relaxed mb-6 text-justify">
              {mainIntro.content}
            </p>
          )}

          {founders && (
            <p className="text-gray-700 leading-relaxed mb-6 text-justify">
              {founders.content}
            </p>
          )}

          {/* Visi */}
          {vision && (
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {vision.title}
              </h2>
              <blockquote className="italic text-gray-600 border-l-4 border-green-600 pl-4 bg-green-50 py-2 rounded-md">
                "{vision.content}"
              </blockquote>
            </section>
          )}

          {/* Misi */}
          {mission && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                {mission.title}
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                {parseMission(mission.content).map(
                  (item: string, idx: number) => (
                    <li key={idx}>{item}</li>
                  ),
                )}
              </ul>
            </section>
          )}

          {/* Profil Pengasuh */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Profil Pengasuh
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Ustadz */}
              {founderUstadz && (
                <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
                  {founderUstadz.image_url && (
                    <img
                      src={getImageUrl(founderUstadz.image_url)}
                      alt={founderUstadz.title}
                      className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src = "https://via.placeholder.com/150";
                      }}
                    />
                  )}
                  <h3 className="text-lg font-bold text-center text-gray-800">
                    {founderUstadz.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed text-justify">
                    {founderUstadz.content}
                  </p>
                </div>
              )}

              {/* Ustadzah */}
              {founderUstadzah && (
                <div className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition">
                  {founderUstadzah.image_url && (
                    <img
                      src={getImageUrl(founderUstadzah.image_url)}
                      alt={founderUstadzah.title}
                      className="w-32 h-32 object-cover rounded-full mx-auto mb-4"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.currentTarget.src = "https://via.placeholder.com/150";
                      }}
                    />
                  )}
                  <h3 className="text-lg font-bold text-center text-gray-800">
                    {founderUstadzah.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed text-justify">
                    {founderUstadzah.content}
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Kolom Kanan: Artikel Populer */}
        <div>
          <ArtikelPopulerApi />
        </div>
      </div>
    </div>
  );
};

export default TentangPesantren;
