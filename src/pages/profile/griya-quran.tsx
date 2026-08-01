import { useState, useEffect } from "react";
import { pageContentsService, type GriyaQuranContent } from "../../services/pageContents";
import { MapPin, Phone, Calendar, Compass, BookOpen, CheckCircle2 } from "lucide-react";
import ProfileHero from "../../components/common/ProfileHero";

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 space-y-16 dark:text-gray-100">
      <ProfileHero
        title={content.header.title}
        description={content.header.description}
        badge="Program Unggulan"
      >
        <div className="pt-2 flex flex-wrap gap-x-6 gap-y-3 text-xs sm:text-sm text-gray-600 border-t border-gray-200 mt-2">
          <span className="flex items-center gap-2">
            <MapPin size={16} className="text-emerald-600 flex-shrink-0" />
            {content.header.address}
          </span>
          <span className="hidden sm:inline text-gray-300">|</span>
          <span className="flex items-center gap-2">
            <Phone size={16} className="text-emerald-600 flex-shrink-0" />
            {content.header.phone}
          </span>
        </div>
      </ProfileHero>

      {/* Visi & Misi */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2.5">
          <span className="w-1.5 h-6 rounded-full bg-emerald-600" />
          Visi & Misi
        </h2>
        <div className="grid md:grid-cols-12 gap-6 items-stretch">
          <div className="md:col-span-5 flex flex-col justify-between bg-emerald-50/50 dark:bg-emerald-950/25 border border-emerald-100/50 dark:border-emerald-900/30 p-8 rounded-3xl">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-6">
                <Compass size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Visi</h3>
              <p className="text-gray-700 dark:text-gray-300 text-base sm:text-lg font-medium leading-relaxed italic">
                "{content.vpiMisi.visi}"
              </p>
            </div>
          </div>
          <div className="md:col-span-7 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800/80 flex items-center justify-center text-gray-700 dark:text-gray-300 mb-6">
                <BookOpen size={20} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Misi</h3>
              <ul className="space-y-4">
                {content.vpiMisi.misi.map((misi, index) => (
                  <li key={index} className="flex gap-3 text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                    <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{misi}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Program */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2.5">
          <span className="w-1.5 h-6 rounded-full bg-emerald-600" />
          Program Pembelajaran
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.programs.map((program, index) => (
            <div
              key={index}
              className="group relative p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-emerald-500/20 dark:hover:border-emerald-400/20 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors mb-2.5">
                  {program.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                  {program.description}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 w-fit px-3 py-1.5 rounded-lg">
                <Calendar size={13} />
                <span>{program.schedule}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Halaqah */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2.5">
          <span className="w-1.5 h-6 rounded-full bg-emerald-600" />
          Halaqah
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {content.halaqah.map((h, index) => (
            <div 
              key={index} 
              className="bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/30 dark:border-emerald-900/10 p-6 rounded-2xl flex flex-col items-start gap-3"
            >
              <span className="px-2.5 py-1 text-[11px] font-bold tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100/70 dark:bg-emerald-900/40 rounded-md">
                Halaqah {index + 1}
              </span>
              <h4 className="font-bold text-base text-gray-900 dark:text-gray-100">{h.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{h.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GriyaQuran;
