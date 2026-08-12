import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/image/logo.svg";
import SearchBar from "./SearchBar";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";
import { Menu, X, Sun, Moon } from "lucide-react";
import { categoriesService } from "../../services/categories";
import type { Category } from "../../services/posts";
import { useTheme } from "../../hooks/useTheme";
import { useSettings } from "../../hooks/useSettings";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Beranda");
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { isDark, toggleTheme } = useTheme();
  const { settings } = useSettings();

  const journalUrl =
    settings.journalLink || "https://ijissjournal.org/index.php/journal";

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 10) {
        setShowNavbar(true);
      } else {
        if (currentScrollY > lastScrollY) {
          setShowNavbar(false);
        } else {
          setShowNavbar(true);
        }
      }
      setLastScrollY(currentScrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar, { passive: true });
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoriesService.getCategories();
        const categoriesWithPosts = categoriesData.filter(
          (cat: Category & { post_count?: string }) =>
            cat.post_count && parseInt(cat.post_count) > 0,
        );
        const prioritySlugs = [
          "pendidikan",
          "sejarah",
          "dunia-islam",
          "opini",
          "khazanah",
        ];
        const sortedCategories = [...categoriesWithPosts].sort((a, b) => {
          const indexA = prioritySlugs.indexOf(a.slug.toLowerCase());
          const indexB = prioritySlugs.indexOf(b.slug.toLowerCase());
          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return 0;
        });
        setCategories(sortedCategories.slice(0, 5));
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-[#00531b] dark:bg-gray-900 border-b border-green-900 dark:border-gray-700 w-full overflow-visible">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8 py-3">
          <div className="flex items-center justify-between gap-3 min-w-0">
            <div className="flex items-center min-w-0 flex-1 sm:flex-initial">
              <Link
                to="/"
                onClick={() => setActiveCategory("Beranda")}
                className="min-w-0 block"
              >
                <img
                  src={Logo}
                  alt="Logo Al-Muhtada"
                  className="h-17 sm:h-17 md:h-19 lg:h-24 object-contain flex-shrink-0 max-w-full"
                />
              </Link>
              <div className="hidden lg:block h-6 w-px bg-white/20 mx-5" />
              <span className="hidden lg:block text-sm text-white/95 font-medium leading-tight whitespace-nowrap">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                <SearchBar />
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors flex-shrink-0"
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors flex-shrink-0"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav
        className={`sticky top-0 z-[100] transition-transform duration-300 bg-[#00531b] dark:bg-gray-900 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <MobileNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          journalUrl={journalUrl}
        />
        <DesktopNav
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          journalUrl={journalUrl}
        />

        {/* Mobile Hamburger Menu */}
        {isOpen && (
          <div className="md:hidden flex flex-col py-3 border-t border-white/20 max-h-[75vh] overflow-y-auto min-w-0">
            <div className="px-1 pb-3">
              <SearchBar />
            </div>
            <div className="flex flex-col">
              <Link
                to="/"
                className="px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                onClick={() => {
                  setActiveCategory("Beranda");
                  setIsOpen(false);
                }}
              >
                Beranda
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className="px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => {
                    setActiveCategory(category.slug);
                    setIsOpen(false);
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </div>
            <div className="border-t border-white/15 mt-2 pt-2">
              <p className="px-4 py-2 text-xs font-semibold text-white/60 uppercase tracking-wider">
                Profil
              </p>
              <div className="flex flex-col">
                <Link
                  to="/tentang-pesantren"
                  className="px-6 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Tentang Pesantren
                </Link>
                <Link
                  to="/program-pengajar"
                  className="px-6 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Program & Pengajar
                </Link>
                <Link
                  to="/pendaftaran"
                  className="px-6 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Pendaftaran Mahasantri Baru
                </Link>
                <Link
                  to="/prestasi-mahasantri"
                  className="px-6 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Prestasi Mahasantri
                </Link>
                <Link
                  to="/publikasi-mahasantri"
                  className="px-6 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Publikasi Mahasantri
                </Link>
                <Link
                  to="/griya-quran"
                  className="px-6 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Griya Qur'an
                </Link>
                <a
                  href={journalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Jurnal Ilmiah
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default Navbar;
