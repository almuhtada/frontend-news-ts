import { useState, useEffect } from "react";
import {
  BookOpen,
  Award,
  Users,
  Settings,
  Heart,
  UserCheck,
} from "lucide-react";
import ArtikelPopulerApi from "../../components/components-global/artikel-populer-api";
import {
  pageContentsService,
  type ProgramPengajarContent,
} from "../../services/pageContents";
import ProfileHero from "../../components/common/ProfileHero";

const ProgramPengajar = () => {
  const [content, setContent] = useState<ProgramPengajarContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response =
          await pageContentsService.getByKey<ProgramPengajarContent>(
            "program-pengajar",
          );
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
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10">
        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-3 lg:border-r lg:border-green-800/15 dark:lg:border-green-700/20 lg:pr-8 space-y-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
              <div className="space-y-3 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-16 bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8 py-16 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          {error || "Konten tidak tersedia"}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <main className="max-w-[1500px] mx-auto px-4 py-8 sm:px-6 md:px-8">
        <div className="mb-10">
          <ProfileHero
            title={content.header.title}
            description={content.header.description}
            badge="Struktur & Pengajar"
          />
        </div>

        <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-3 space-y-6 lg:space-y-10 lg:border-r lg:border-green-800/15 dark:lg:border-green-700/20 lg:pr-8">

            <section className="border-b border-green-800/10 dark:border-green-700/10 pb-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  Program Pesantren
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                {content.programs.map((program, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 py-4 border-b border-green-800/5 dark:border-green-700/10"
                  >
                    <span className="flex-shrink-0 text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      {program}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* ─── 2-Column: Masyayikh + Asatidz ──────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-b border-green-800/10 dark:border-green-700/10 pb-10">
              {/* Dewan Masyayikh */}
              <section>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Dewan Masyayikh
                  </h2>
                </div>
                <div className="divide-y divide-green-800/5 dark:divide-green-700/10">
                  {content.masyayikh.map((person, index) => (
                    <div key={index} className="flex items-center gap-3 py-3">
                      <span className="flex-shrink-0 text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base text-gray-700 dark:text-gray-300">
                        {person}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Dewan Guru / Asatidz */}
              <section>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Dewan Guru / Asatidz
                  </h2>
                </div>
                <div className="divide-y divide-green-800/5 dark:divide-green-700/10">
                  {content.asatidz.map((person, index) => (
                    <div key={index} className="flex items-center gap-3 py-3">
                      <span className="flex-shrink-0 text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base text-gray-700 dark:text-gray-300">
                        {person}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ─── 2-Column: Pengurus + Mentor ─────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-b border-green-800/10 dark:border-green-700/10 pb-10">
              {/* Badan Pengurus Harian */}
              <section>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Badan Pengurus Harian
                  </h2>
                </div>
                <div className="divide-y divide-green-800/5 dark:divide-green-700/10">
                  {content.pengurus.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex-shrink-0 text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-base text-gray-800 dark:text-gray-200 truncate">
                          {item.name}
                        </span>
                      </div>
                      <span className="flex-shrink-0 ml-3 text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        {item.role}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tim Mentor */}
              <section>
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    Tim Mentor
                  </h2>
                </div>
                <div className="divide-y divide-green-800/5 dark:divide-green-700/10">
                  {content.mentors.map((person, index) => (
                    <div key={index} className="flex items-center gap-3 py-3">
                      <span className="flex-shrink-0 text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="text-base text-gray-700 dark:text-gray-300">
                        {person}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ─── CTA ───────────────────────────────────────── */}
            <section className="pb-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Bergabung Bersama Kami
                </h2>
              </div>
              <p className="text-base text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                {content.ctaText}
              </p>
              <a
                href="/pendaftaran"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white text-base font-medium rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Hubungi Kami
              </a>
            </section>
          </div>

          {/* ─── Sidebar ──────────────────────────────────────── */}
          <div>
            <div className="lg:sticky lg:top-6">
              <ArtikelPopulerApi />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProgramPengajar;
