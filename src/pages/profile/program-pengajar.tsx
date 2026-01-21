import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Award,
  UserCheck,
  Settings,
  Heart,
} from "lucide-react";
import SectionCard from "../../ui/components-news/card-section-program-pengajar";
import { pageContentsService, defaultProgramPengajarContent, type ProgramPengajarContent } from "../../services/pageContents";

const ProgramPengajar = () => {
  const [content, setContent] = useState<ProgramPengajarContent>(defaultProgramPengajarContent);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await pageContentsService.getByKey<ProgramPengajarContent>("program-pengajar");
        if (response.success && response.data?.content) {
          setContent(response.data.content);
        }
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="animate-pulse space-y-8">
            <div className="text-center space-y-4">
              <div className="h-12 bg-slate-200 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header Section */}
        <div className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-5 blur-3xl"></div>
          <div className="relative">
            <h1 className="text-5xl md:text-6xl font-bold">{content.header.title}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {content.header.description}
            </p>
            <div className="flex justify-center mt-8">
              <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* PROGRAM PESANTREN */}
          <div className="lg:col-span-2 xl:col-span-3">
            <SectionCard
              title="Program Pesantren"
              icon={BookOpen}
              gradient="bg-gradient-to-r from-emerald-500 to-teal-500"
            >
              <div className="grid md:grid-cols-2 gap-4">
                {content.programs.map((program, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors group"
                  >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0 group-hover:scale-125 transition-transform"></div>
                    <span className="text-gray-700 leading-relaxed">{program}</span>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* DEWAN MASYAYIKH */}
          <SectionCard
            title="Dewan Masyayikh"
            icon={Award}
            gradient="bg-gradient-to-r from-amber-500 to-orange-500"
          >
            <div className="space-y-3">
              {content.masyayikh.map((person, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed group-hover:text-gray-900 transition-colors">
                    {person}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* DEWAN GURU */}
          <SectionCard
            title="Dewan Guru / Asatidz"
            icon={Users}
            gradient="bg-gradient-to-r from-blue-500 to-cyan-500"
          >
            <div className="space-y-3">
              {content.asatidz.map((person, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed group-hover:text-gray-900 transition-colors">
                    {person}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* BADAN PENGURUS */}
          <SectionCard
            title="Badan Pengurus Harian"
            icon={Settings}
            gradient="bg-gradient-to-r from-purple-500 to-pink-500"
          >
            <div className="space-y-4">
              {content.pengurus.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group"
                >
                  <div className="font-semibold text-purple-700 mb-2 group-hover:text-purple-800 transition-colors">
                    {item.role}
                  </div>
                  <div className="text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
                    {item.name}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* TIM MENTOR */}
          <SectionCard
            title="Tim Mentor"
            icon={Heart}
            gradient="bg-gradient-to-r from-rose-500 to-red-500"
          >
            <div className="space-y-3">
              {content.mentors.map((person, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-rose-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <span className="text-gray-700 text-sm leading-relaxed group-hover:text-gray-900 transition-colors">
                    {person}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* BERGABUNG */}
          <div className="lg:col-span-2 xl:col-span-1">
            <SectionCard
              title="Bergabung dengan Kami"
              icon={UserCheck}
              gradient="bg-gradient-to-r from-indigo-500 to-blue-600"
            >
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">
                  Tertarik Bergabung?
                </h3>
                <p className="text-gray-600 text-sm mb-6">{content.ctaText}</p>
                <button className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-6 py-3 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 font-semibold">
                  Hubungi Kami
                </button>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* Bottom decorative section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg">
            <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
            <span className="text-gray-600 text-sm font-medium">
              Program Aktif & Terpercaya
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramPengajar;
