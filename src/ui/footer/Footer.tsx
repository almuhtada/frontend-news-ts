import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaFacebook, FaInstagram, FaYoutube, FaXTwitter, FaTelegram } from "react-icons/fa6";
import Logo from "../../assets/image/logo.svg";
import { categoriesService } from "../../services/categories";
import { useSettings } from "../../hooks/useSettings";
import type { Category } from "../../services/posts";

const Footer = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const { settings } = useSettings();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const profilRoutes: Record<string, string> = {
    "Tentang Pesantren": "/tentang-pesantren",
    "Program & Pengajar": "/program-pengajar",
    "Pendaftaran Mahasantri Baru": "/pendaftaran",
    "Prestasi Mahasantri": "/prestasi-mahasantri",
    "Publikasi Mahasantri": "/publikasi-mahasantri",
    "Griya Qur'an": "/griya-quran",
  };

  // Check if any social media link exists
  const hasSocialLinks = settings.facebook || settings.instagram || settings.youtube || settings.twitter;

  return (
    <footer className="bg-emerald-950 dark:bg-gray-900 text-white/80 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 sm:px-6 py-12">
        {/* Logo + Kontak */}
        <div className="sm:col-span-2 md:col-span-1">
          <img src={Logo} alt={settings.siteName} className="w-32 sm:w-40 mb-4" />
          <p className="text-sm leading-relaxed text-white/70 whitespace-pre-line">
            {settings.address}
          </p>
          <p className="text-sm mt-3 text-white/70">
            <span className="font-medium text-white">Telp:</span> {settings.phone}
          </p>
          <p className="text-sm text-white/70">
            <span className="font-medium text-white">Email:</span>{" "}
            {settings.email}
          </p>

          {/* Social Media Icons */}
          {hasSocialLinks && (
            <div className="flex gap-3 mt-4">
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-lg hover:bg-emerald-600 transition"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-4 h-4" />
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-lg hover:bg-emerald-600 transition"
                  aria-label="Instagram"
                >
                  <FaInstagram className="w-4 h-4" />
                </a>
              )}
              {settings.youtube && (
                <a
                  href={settings.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-lg hover:bg-emerald-600 transition"
                  aria-label="YouTube"
                >
                  <FaYoutube className="w-4 h-4" />
                </a>
              )}
              {settings.twitter && (
                <a
                  href={settings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 rounded-lg hover:bg-emerald-600 transition"
                  aria-label="Twitter"
                >
                  <FaXTwitter className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Kategori */}
        <div>
          <h4 className="font-bold text-lg mb-3 text-emerald-400">Kategori</h4>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  to={`/kategori/${category.slug}`}
                  className="text-white/70 hover:text-emerald-400 transition font-medium block"
                >
                  {category.name}
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
                  className="text-white/70 hover:text-emerald-400 transition font-medium block"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div className="sm:col-span-2 md:col-span-1">
          <h4 className="font-bold text-lg mb-3 text-emerald-400">
            Connect With Us
          </h4>
          <p className="text-sm text-white/70 mb-4 leading-relaxed">
            Dapatkan update berita dan tulisan pilihan dengan bergabung di Grup
            Telegram{" "}
            <span className="font-semibold text-white">"Almuhtada Online"</span>
            .
          </p>
          <a
            href="https://t.me/almuhtadaonline"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 transition w-full sm:w-auto"
          >
            <FaTelegram className="w-5 h-5" /> Gabung Sekarang
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4 text-center text-xs text-white/50">
          © {new Date().getFullYear()} {settings.siteName || "Pesantren Riset Al-Muhtada"} — All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
