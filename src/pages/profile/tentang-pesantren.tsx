import { useState, useEffect } from "react";
import ArtikelPopulerApi from "../../components/components-global/artikel-populer-api";
import { aboutService, type AboutSection } from "../../services/about";
import { API_BASE_URL } from "../../config/api";

const FALLBACK_ABOUT = {
  mainIntro: {
    title: "Tentang Pesantren",
    content:
      "Pesantren Riset Al-Muhtada adalah pesantren mahasiswa di Semarang yang bertujuan untuk mencetak Muslim intelektual yang berakhlak mulia, berprestasi, dan memiliki keterampilan riset yang unggul. Pesantren ini diperuntukkan bagi para mahasiwa dan mahasiswi yang memiliki komitmen tinggi untuk maju dan berprestasi. Para calon santri diseleksi dengan kuota yang terbatas. Dengan lingkungan yang kondusif, asrama putera dan puteri terpisah, serta bebas biaya asrama, para santri dibimbing oleh para pengasuh dan guru yang berlatar belakang pendidikan S2/S3 dari dalam dan luar negeri.",
  },
  founders: {
    content:
      "Pesantren ini didirikan oleh Ustadz Dr. H. Dani Muhtada, M.Ag., M.A., M.P.A dan Ustadzah Hikmiyatin Jalilah, S.Ag., M.Ag. pada tanggal 12 Agustus 2018. Pesantren ini berada di bawah naungan Yayasan Kanzul Amal Al-Muhtad, yang berdiri dengan Akta Notaris Teguh Pambudi, S.H., M.Kn. dengan Nomor 26 tertanggal 21 Oktober 2020, serta disahkan oleh Kementerian Hukum dan HAM melalui Keputusan Menteri Hukum dan HAM Nomor AHU-0001360.AH.01.05 Tahun 2021.",
  },
  vision: {
    title: "Visi",
    content:
      "Menjadi pesantren unggulan yang mencetak mahasiswa muslim intelektual yang beriman, berbudi, dan berprestasi",
  },
  mission: {
    title: "Misi",
    content: [
      "Mencetak insan akademis melalui kegiatan pengajaran, diskusi dan pelatihan.",
      "Mengembangkan nalar kritis-analitis melalui kegiatan riset wajib tahunan.",
      "Menanamkan jiwa pengabdian melalui kegiatan bakti sosial kemasyarakatan.",
      "Menanamkan nilai-nilai keislaman, keummatan dan kebangsaan dalam kehidupan sehari-hari.",
    ],
  },
  founderUstadz: {
    title: "Ustadz Dr. H. Dani Muhtada, M.Ag., M.A., M.P.A.",
    content:
      "Beliau adalah dosen Fakultas Hukum Universitas Negeri Semarang (UNNES). Pendidikan dasar dan menengah (SD/MI, MTs, MA) beliau tempuh di Banyuwangi dan Jember, Jawa Timur. Beliau melanjutkan Pendidikan Sarjana (S1) dan Magister (S2) dalam bidang Hukum Islam di Fakultas Syariah IAIN Walisongo Semarang. Beliau sempat menyelesaikan Pendidikan S2 dalam bidang Interdisciplinary Islamic Studies (MA) di UIN Sunan Kalijaga Yogyakarta, yang merupakan program kerjasama dengan McGill University Canada. Gelar Master of Public Administration (MPA) beliau dapatkan dari Flinders University di Adelaide, Australia. Adapun gelar doktor diperoleh dari Northern Illinois University di Amerika Serikat. Disertasi beliau tentang Politik Hukum Islam di Indonesia, dengan fokus penelitian pada penyebaran Perda-Perda Syariah pasca Orde Baru.",
  },
  founderUstadzah: {
    title: "Ustadzah Hikmiyatin Jalilah, S.Ag., M.Ag.",
    content:
      "Beliau menempuh pendidikan dasar dan menengah (MI, MTs, MA) di Gresik dan Malang, Jawa Timur. Setelah itu beliau melanjutkan Pendidikan Sarjana (S1) dalam bidang Pendidikan Bahasa Arab di Fakultas Tarbiyah IAIN Walisongo Semarang. Di kampus yang sama, beliau juga menamatkan pendidikan Magister (S2) dalam bidang Pendidikan Islam. Tesis beliau berjudul “Kesetaraan Jender: Studi Komparatif atas Pengaruh Pendidikan Pesantren terhadap Persepsi Santriwati Pesantren Al-Muayyad dan Pesantren Assalam”, yang ditulis di bawah bimbingan Prof. Dr. H. Abdurrahman Mas’ud, M.A.",
  },
};

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
  const missionItems = mission
    ? parseMission(mission.content)
    : FALLBACK_ABOUT.mission.content;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
        {/* Kolom Kiri */}
        <div className="md:col-span-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center text-gray-900 mb-6 md:mb-8">
            {mainIntro?.title || FALLBACK_ABOUT.mainIntro.title}
          </h1>

          <p className="text-gray-700 leading-relaxed mb-6 text-justify">
            {mainIntro?.content || FALLBACK_ABOUT.mainIntro.content}
          </p>

          <p className="text-gray-700 leading-relaxed mb-6 text-justify">
            {founders?.content || FALLBACK_ABOUT.founders.content}
          </p>

          {/* Visi */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {vision?.title || FALLBACK_ABOUT.vision.title}
            </h2>
            <blockquote className="italic text-gray-600 border-l-4 border-green-600 pl-4 bg-green-50 py-2 rounded-md">
              "{vision?.content || FALLBACK_ABOUT.vision.content}"
            </blockquote>
          </section>

          {/* Misi */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {mission?.title || FALLBACK_ABOUT.mission.title}
            </h2>
            <ul className="list-disc list-inside text-gray-700 space-y-2">
              {missionItems.map((item: string, idx: number) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </section>

          {/* Profil Pengasuh */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Profil Pengasuh
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Ustadz */}
              {(founderUstadz || FALLBACK_ABOUT.founderUstadz) && (
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
                    {founderUstadz?.title || FALLBACK_ABOUT.founderUstadz.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed text-justify">
                    {founderUstadz?.content || FALLBACK_ABOUT.founderUstadz.content}
                  </p>
                </div>
              )}

              {/* Ustadzah */}
              {(founderUstadzah || FALLBACK_ABOUT.founderUstadzah) && (
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
                    {founderUstadzah?.title || FALLBACK_ABOUT.founderUstadzah.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-3 leading-relaxed text-justify">
                    {founderUstadzah?.content || FALLBACK_ABOUT.founderUstadzah.content}
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
