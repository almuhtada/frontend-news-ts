import { useState, useEffect, useRef } from "react";
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
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Beranda");
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const { isDark, toggleTheme } = useTheme();
  const { settings } = useSettings();

  // Menyimpan posisi scroll terakhir tanpa menyebabkan re-render
  const lastScrollY = useRef(0);

  // Menyimpan status requestAnimationFrame
  const ticking = useRef(false);

  const journalUrl =
    settings.journalLink || "https://ijissjournal.org/index.php/journal";

  /**
   * Navbar scroll behavior
   *
   * Top:
   * - Navbar berada pada posisi normal
   *
   * Scroll down:
   * - Navbar menghilang
   *
   * Scroll up:
   * - Navbar muncul fixed di atas viewport
   */
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const previousScrollY = lastScrollY.current;

        // Selalu tampil ketika berada sangat dekat dengan posisi paling atas
        if (currentScrollY <= 10) {
          setIsScrolled(false);
          setShowNavbar(true);
        } else {
          setIsScrolled(true);

          // Scroll ke bawah
          if (currentScrollY > previousScrollY) {
            setShowNavbar(false);
          }

          // Scroll ke atas
          else if (currentScrollY < previousScrollY) {
            setShowNavbar(true);
          }
        }

        lastScrollY.current = currentScrollY;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  /**
   * Ambil kategori yang memiliki artikel
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoriesService.getCategories();

        const categoriesWithPosts = categoriesData.filter(
          (cat: Category & { post_count?: string }) =>
            cat.post_count && parseInt(cat.post_count, 10) > 0,
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

          if (indexA !== -1 && indexB !== -1) {
            return indexA - indexB;
          }

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

  /**
   * Tutup mobile menu ketika layar berubah ke desktop
   */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /**
   * Tutup mobile menu ketika user melakukan scroll
   */
  useEffect(() => {
    if (isOpen) {
      const handleScroll = () => {
        setIsOpen(false);
      };

      window.addEventListener("scroll", handleScroll, {
        passive: true,
      });

      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isOpen]);

  return (
    <>
      {/* =========================================================
          HEADER UTAMA
          ========================================================= */}
      <header className="bg-[#00531b] dark:bg-gray-900 w-full">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8 py-3">
          <div className="flex items-center justify-between gap-3 min-w-0">
            {/* Logo + tanggal */}
            <div className="flex items-center min-w-0 flex-1 sm:flex-initial">
              <Link
                to="/"
                onClick={() => {
                  setActiveCategory("Beranda");
                  setIsOpen(false);
                }}
                className="min-w-0 block"
              >
                <img
                  src={Logo}
                  alt="Logo Al-Muhtada"
                  className="h-16 sm:h-16 md:h-18 lg:h-24 object-contain flex-shrink-0 max-w-full"
                />
              </Link>

              {/* Divider */}
              <div className="hidden lg:block h-6 w-px bg-white/20 mx-5" />

              {/* Date */}
              <span className="hidden lg:block text-sm text-white/90 font-medium whitespace-nowrap">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Search + theme + mobile menu */}
            <div className="flex items-center gap-2">
              {/* Desktop Search */}
              <div className="hidden md:block">
                <SearchBar />
              </div>

              {/* Theme */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center w-9 h-9 rounded-full text-white/90 hover:bg-white/10 transition-colors flex-shrink-0"
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {/* Mobile menu button */}
              <button
                className="md:hidden flex items-center justify-center w-9 h-9 rounded-full text-white/90 hover:bg-white/10 transition-colors flex-shrink-0"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X size={19} /> : <Menu size={19} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          NAVBAR PLACEHOLDER
          
          Menjaga layout agar konten tidak meloncat ketika navbar
          berubah dari relative menjadi fixed.
          ========================================================= */}
      <div
        className={`transition-[height] duration-300 ${
          isScrolled ? "h-0" : "h-auto"
        }`}
        aria-hidden="true"
      />

      {/* =========================================================
          NAVIGATION
          
          Ketika belum scroll:
          - relative
          - mengikuti flow normal

          Ketika sudah scroll:
          - fixed
          - berada di paling atas viewport

          Ketika scroll turun:
          - hide

          Ketika scroll naik:
          - show
          ========================================================= */}
      <nav
        className={`
          z-[100]
          w-full
          bg-[#00531b] dark:bg-gray-900
          border-t border-white/10 dark:border-gray-700
          transition-transform duration-300 ease-in-out
          ${
            isScrolled
              ? `fixed top-0 left-0 right-0 ${
                  showNavbar ? "translate-y-0" : "-translate-y-full"
                }`
              : "relative translate-y-0"
          }
        `}
      >
        {/* Desktop / Mobile Navigation */}
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

        {/* =======================================================
            MOBILE HAMBURGER MENU
            ======================================================= */}
        {isOpen && (
          <div className="md:hidden flex flex-col py-2 border-t border-white/10 max-h-[75vh] overflow-y-auto min-w-0">
            {/* Mobile Search */}
            <div className="px-4 py-3">
              <SearchBar />
            </div>

            {/* Main Menu */}
            <div className="flex flex-col">
              <Link
                to="/"
                className="px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors"
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
                  className="px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => {
                    setActiveCategory(category.slug);
                    setIsOpen(false);
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Profil */}
            <div className="border-t border-white/10 mt-2 pt-2">
              <p className="px-4 py-2 text-xs font-semibold text-white/50 uppercase tracking-wider">
                Profil
              </p>

              <div className="flex flex-col">
                <Link
                  to="/tentang-pesantren"
                  className="px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Tentang Pesantren
                </Link>

                <Link
                  to="/program-pengajar"
                  className="px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Program & Pengajar
                </Link>

                <Link
                  to="/pendaftaran"
                  className="px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Pendaftaran Mahasantri Baru
                </Link>

                <Link
                  to="/prestasi-mahasantri"
                  className="px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Prestasi Mahasantri
                </Link>

                <Link
                  to="/publikasi-mahasantri"
                  className="px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Publikasi Mahasantri
                </Link>

                <Link
                  to="/griya-quran"
                  className="px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Griya Qur'an
                </Link>

                <a
                  href={journalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Jurnal Ilmiah
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Scrollbar utility */}
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
