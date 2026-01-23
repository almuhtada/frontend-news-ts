import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Award,
  UserCheck,
  Settings,
  Heart,
} from "lucide-react";
import SectionCard from "../../components/components-news/card-section-program-pengajar";
import {
  pageContentsService,
  defaultProgramPengajarContent,
  type ProgramPengajarContent,
} from "../../services/pageContents";

const ProgramPengajar = () => {
  const [content, setContent] = useState<ProgramPengajarContent>(
    defaultProgramPengajarContent,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response =
          await pageContentsService.getByKey<ProgramPengajarContent>(
            "program-pengajar",
          );
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
        <div className="max-w-7xl mx-auto px-6 py-20 animate-pulse space-y-8">
          <div className="h-12 bg-slate-200 rounded w-1/2 mx-auto" />
          <div className="h-4 bg-slate-200 rounded w-2/3 mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* HEADER */}
        <div className="relative text-center mb-20">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 opacity-5 blur-3xl" />
          <div className="relative space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">
              {content.header.title}
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              {content.header.description}
            </p>
            <div className="flex justify-center">
              <div className="w-24 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {/* PROGRAM PESANTREN */}
          <div className="lg:col-span-2 xl:col-span-3">
            <SectionCard
              title="Program Pesantren"
              icon={BookOpen}
              gradient="bg-gradient-to-r from-emerald-600 to-teal-600"
            >
              <div className="grid md:grid-cols-2 gap-4">
                {content.programs.map((program, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition"
                  >
                    <span className="w-2 h-2 mt-2 rounded-full bg-emerald-600" />
                    <p className="text-slate-700 leading-relaxed">{program}</p>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {/* DEWAN MASYAYIKH */}
          <SectionCard
            title="Dewan Masyayikh"
            icon={Award}
            gradient="bg-gradient-to-r from-emerald-700 to-green-600"
          >
            <div className="space-y-3">
              {content.masyayikh.map((person, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 flex items-center justify-center text-white text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-slate-700 text-sm">{person}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* DEWAN GURU */}
          <SectionCard
            title="Dewan Guru / Asatidz"
            icon={Users}
            gradient="bg-gradient-to-r from-green-600 to-emerald-600"
          >
            <div className="space-y-3">
              {content.asatidz.map((person, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-green-50 rounded-lg hover:bg-green-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-slate-700 text-sm">{person}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* BADAN PENGURUS */}
          <SectionCard
            title="Badan Pengurus Harian"
            icon={Settings}
            gradient="bg-gradient-to-r from-emerald-700 to-green-700"
          >
            <div className="space-y-4">
              {content.pengurus.map((item, index) => (
                <div
                  key={index}
                  className="p-4 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition"
                >
                  <div className="font-semibold text-emerald-700 mb-1">
                    {item.role}
                  </div>
                  <div className="text-slate-700 text-sm">{item.name}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* TIM MENTOR */}
          <SectionCard
            title="Tim Mentor"
            icon={Heart}
            gradient="bg-gradient-to-r from-teal-600 to-emerald-600"
          >
            <div className="space-y-3">
              {content.mentors.map((person, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold">
                    {index + 1}
                  </div>
                  <span className="text-slate-700 text-sm">{person}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* CTA */}
          <div className="lg:col-span-2 xl:col-span-1">
            <SectionCard
              title="Bergabung Bersama Kami"
              icon={UserCheck}
              gradient="bg-gradient-to-r from-emerald-600 to-green-600"
            >
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 flex items-center justify-center">
                  <UserCheck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-3">
                  Tertarik Bergabung?
                </h3>
                <p className="text-slate-600 text-sm mb-6">{content.ctaText}</p>
                <button className="px-6 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition">
                  Hubungi Kami
                </button>
              </div>
            </SectionCard>
          </div>
        </div>

        {/* FOOTER BADGE */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md">
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 animate-pulse" />
            <span className="text-slate-600 text-sm font-medium">
              Program Aktif & Terpercaya
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramPengajar;
