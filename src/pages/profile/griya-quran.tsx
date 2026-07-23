import { useState, useEffect } from "react";
import { pageContentsService, type GriyaQuranContent } from "../../services/pageContents";

const GriyaQuran = () => {
  const [content, setContent] = useState<GriyaQuranContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await pageContentsService.getByKey<GriyaQuranContent>("griya-quran");
        if (response.success && response.data?.content) {
          setContent(response.data.content);
        } else {
          setError("Konten tidak ditemukan");
        }
      } catch (err) {
        console.error("Error fetching content:", err);
        setError("Gagal memuat konten");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="animate-pulse space-y-8">
          <div className="text-center space-y-4">
            <div className="h-10 bg-slate-200 rounded w-2/3 mx-auto"></div>
            <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 text-center">
        <p className="text-red-500">{error || "Konten tidak tersedia"}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-12 dark:text-gray-100">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">{content.header.title}</h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">{content.header.description}</p>
        <p className="text-gray-500 dark:text-gray-500 mt-3">
          📍 {content.header.address} | ☎️ {content.header.phone}
        </p>
      </div>

      {/* Visi & Misi */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Visi & Misi</h2>
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl shadow-sm">
          <p className="text-green-700 dark:text-green-400 font-medium italic mb-4">"{content.vpiMisi.visi}"</p>
          <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
            {content.vpiMisi.misi.map((misi, index) => (
              <li key={index}>{misi}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Program */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Program</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.programs.map((program, index) => (
            <div
              key={index}
              className="p-6 border border-gray-400 dark:border-gray-600 rounded-xl shadow-sm hover:shadow-md transition bg-white dark:bg-gray-800"
            >
              <h3 className="font-bold text-green-700 dark:text-green-400 mb-2">{program.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{program.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500">🗓️ {program.schedule}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Halaqah */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Halaqah</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.halaqah.map((h, index) => (
            <div key={index} className="bg-green-50 dark:bg-green-900/20 p-6 rounded-2xl shadow-sm text-center">
              <h4 className="font-bold text-green-700 dark:text-green-400 mb-2">{h.name}</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">{h.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GriyaQuran;
