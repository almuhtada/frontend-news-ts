import { Link } from "react-router-dom";
import Logo from "../../assets/image/logo.svg";

const Footer = () => {
  const kategoriRoutes: Record<string, string> = {
    "Doa Harian": "/kategori/doa-harian",
    "Dunia Islam": "/kategori/dunia-islam",
    Fiqih: "/kategori/fiqih",
    Hadits: "/kategori/hadits",
    Khutbah: "/kategori/khutbah",
    Kolom: "/kategori/kolom",
    Lifestyle: "/kategori/lifestyle",
    News: "/kategori/news",
    Pendidikan: "/kategori/pendidikan",
    Pengumuman: "/kategori/pengumuman",
    Sejarah: "/kategori/sejarah",
    Tafsir: "/kategori/tafsir",
    Tokoh: "/kategori/tokoh",
    "Wisata Religi": "/kategori/wisata-religi",
  };

  const profilRoutes: Record<string, string> = {
    "Tentang Pesantren": "/tentang-pesantren",
    "Program & Pengajar": "/program-pengajar",
    "Pendaftaran Mahasantri Baru 2025": "/pendaftaran",
    "Prestasi Mahasantri": "/prestasi-mahasantri",
    "Publikasi Mahasantri": "/publikasi-mahasantri",
    "Griya Qur’an": "/griya-quran",
  };

  return (
    <footer className="bg-emerald-950 text-white/80 mt-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-6 py-12">
        {/* Logo + Kontak */}
        <div>
          <img src={Logo} alt="Al-Muhtada" className="w-40 mb-4" />
          <p className="text-sm leading-relaxed text-white/70">
            Gang Kenanga No. 1 Sekaran <br />
            Gunungpati Kota Semarang 50229
          </p>
          <p className="text-sm mt-3 text-white/70">
            <span className="font-medium text-white">Telp:</span> 087814501978
          </p>
          <p className="text-sm text-white/70">
            <span className="font-medium text-white">Email:</span>{" "}
            pesantren.almuhtada@gmail.com
          </p>
        </div>

        {/* Kategori */}
        <div>
          <h4 className="font-bold text-lg mb-3 text-emerald-400">Kategori</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(kategoriRoutes).map(([label, path]) => (
              <li key={label}>
                <Link
                  to={path}
                  className="text-white/70 hover:text-emerald-400 transition font-medium"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Profil */}
        <div>
          <h4 className="font-bold text-lg mb-3 text-emerald-400">Profil</h4>
          <ul className="space-y-2 text-sm">
            {Object.entries(profilRoutes).map(([label, path]) => (
              <li key={label}>
                <Link
                  to={path}
                  className="text-white/70 hover:text-emerald-400 transition font-medium"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h4 className="font-bold text-lg mb-3 text-emerald-400">
            Connect With Us
          </h4>
          <p className="text-sm text-white/70 mb-4 leading-relaxed">
            Dapatkan update berita dan tulisan pilihan dengan bergabung di Grup
            Telegram{" "}
            <span className="font-semibold text-white">“Almuhtada Online”</span>
            .
          </p>
          <a
            href="https://t.me/almuhtadaonline"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition"
          >
            <span className="text-lg">📨</span> Gabung Sekarang
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} Almuhtada.org — All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
