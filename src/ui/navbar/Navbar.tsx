import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../../assets/image/logo.svg";
import SearchBar from "./SearchBar";
import MobileNav from "./MobileNav";
import DesktopNav from "./DesktopNav";
import { Menu, X, Sun, Moon, Languages, ChevronDown } from "lucide-react";
import { categoriesService } from "../../services/categories";
import type { Category } from "../../services/posts";
import { useTheme } from "../../hooks/useTheme";
import { useSettings } from "../../hooks/useSettings";

const LANGUAGES = [
  { code: "id", name: "Indonesia", flag: "🇮🇩" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "zh-CN", name: "Chinese", flag: "🇨🇳" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
];

const getActiveLanguage = () => {
  if (typeof document === "undefined") return "id";
  const match = document.cookie.match(/googtrans=([^;]+)/);
  if (match) {
    const value = match[1];
    const parts = value.split("/");
    const langCode = parts[parts.length - 1];
    return langCode || "id";
  }
  return "id";
};

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Beranda");
  const [isOpen, setIsOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  const { isDark, toggleTheme } = useTheme();
  const { settings } = useSettings();
  const location = useLocation();

  // Translation States
  const [currentLang, setCurrentLang] = useState("id");
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const languageDropdownRef = useRef<HTMLDivElement>(null);

  // Menyimpan posisi scroll terakhir
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const journalUrl =
    settings.journalLink || "https://ijissjournal.org/index.php/journal";

  // Tutup dropdown bahasa jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        languageDropdownRef.current &&
        event.target instanceof Node &&
        !languageDropdownRef.current.contains(event.target)
      ) {
        setIsLanguageOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Inisialisasi Google Translate
  useEffect(() => {
    setCurrentLang(getActiveLanguage());

    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        {
          pageLanguage: "id",
          layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_hidden"
      );
    };

    const existingScript = document.getElementById("google-translate-script");
    if (!existingScript) {
      const addScript = document.createElement("script");
      addScript.setAttribute("id", "google-translate-script");
      addScript.setAttribute(
        "src",
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      addScript.async = true;
      document.body.appendChild(addScript);
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    setIsTranslating(true);
    const cookieValue = langCode === "id" ? "" : `/id/${langCode}`;
    
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    
    const host = window.location.host;
    const parts = host.split(".");
    if (parts.length > 2) {
      const domain = parts.slice(-2).join(".");
      document.cookie = `googtrans=${cookieValue}; path=/; domain=.${domain};`;
    }
    
    setCurrentLang(langCode);

    setTimeout(() => {
      try {
        const googleSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;
        if (googleSelect) {
          googleSelect.value = langCode;
          googleSelect.dispatchEvent(new Event("change"));
          
          setTimeout(() => {
            setIsTranslating(false);
          }, 1500);
        } else {
          window.location.reload();
        }
      } catch (e) {
        console.error("Error triggering instant translation:", e);
        window.location.reload();
      }
    }, 150);
  };

  /**
   * Sync activeCategory dengan route URL saat ini
   */
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") {
      setActiveCategory("Beranda");
    } else if (path.startsWith("/category/")) {
      const slug = path.replace("/category/", "");
      setActiveCategory(slug);
    } else {
      const profilePaths = [
        "tentang-pesantren",
        "program-pengajar",
        "pendaftaran",
        "prestasi-mahasantri",
        "publikasi-mahasantri",
        "griya-quran",
      ];
      const foundProfile = profilePaths.find((p) => path.includes(p));
      if (foundProfile) {
        setActiveCategory(foundProfile);
      }
    }
  }, [location.pathname]);

  /**
   * Scroll behavior untuk sticky navbar
   */
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;

      ticking.current = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const previousScrollY = lastScrollY.current;

        if (currentScrollY <= 15) {
          setIsScrolled(false);
          setShowNavbar(true);
        } else {
          setIsScrolled(true);
          // Selalu tampilkan sticky navbar saat scroll agar logo & menu selalu kelihatan
          if (currentScrollY > previousScrollY && currentScrollY > 150) {
            // Jika scroll ke bawah jauh, tetap tampilkan navbar dengan rapi
            setShowNavbar(true);
          } else {
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
   * Ambil daftar kategori dari API
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

        setAllCategories(sortedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Categories yang ditampilkan langsung di navbar utama (max 5)
  const visibleCategories = allCategories.slice(0, 5);

  /**
   * Tutup mobile menu saat resize ke desktop
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
   * Tutup mobile menu ketika scroll
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

  const activeLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  const renderLanguageDropdown = () => (
    <div ref={languageDropdownRef} className="relative">
      <button
        onClick={() => setIsLanguageOpen(!isLanguageOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors text-xs font-semibold cursor-pointer whitespace-nowrap bg-transparent"
      >
        <Languages size={14} />
        <span>{activeLangObj.flag} {activeLangObj.name}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isLanguageOpen ? 'rotate-180' : ''}`} />
      </button>

      {isLanguageOpen && (
        <>
          {/* Backdrop untuk menutup dropdown */}
          <div 
            className="fixed inset-0 z-[110]" 
            onClick={() => setIsLanguageOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 py-1.5 z-[120] max-h-72 overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  changeLanguage(lang.code);
                  setIsLanguageOpen(false);
                }}
                className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                  currentLang === lang.code
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* =========================================================
          HEADER UTAMA (Muncul paling atas sebelum scroll)
          ========================================================= */}
      <header className="bg-[#00531b] dark:bg-gray-900 w-full border-b border-white/10">
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
                  className="h-16 sm:h-16 md:h-18 lg:h-22 object-contain flex-shrink-0 max-w-full"
                />
              </Link>

              {/* Divider */}
              <div className="hidden lg:block h-6 w-px bg-white/20 mx-5" />

              {/* Tanggal */}
              <span className="hidden lg:block text-sm text-white/90 font-medium whitespace-nowrap">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* Search + Bahasa + theme + mobile menu */}
            <div className="flex items-center gap-3">
              {/* Desktop Search */}
              <div className="hidden md:block">
                <SearchBar />
              </div>

              {/* Dropdown Bahasa */}
              {renderLanguageDropdown()}

              {/* Theme Toggle */}
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
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================================================
          NAVBAR PLACEHOLDER
          Menjaga layout tetap stabil ketika navbar berubah menjadi fixed sticky
          ========================================================= */}
      {isScrolled && <div className="h-12 w-full" aria-hidden="true" />}

      {/* =========================================================
          STICKY NAVIGATION BAR
          ========================================================= */}
      <nav
        className={`
          z-[100]
          w-full
          bg-[#00531b] dark:bg-gray-900
          border-b border-white/10 shadow-md
          transition-all duration-300 ease-in-out
          ${
            isScrolled
              ? `fixed top-0 left-0 right-0 ${
                  showNavbar ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
                }`
              : "relative translate-y-0 opacity-100"
          }
        `}
      >
        {/* Mobile Sticky Top Header (Logo + Mobile Controls saat Scrolled) */}
        {isScrolled && (
          <div className="md:hidden flex items-center justify-between px-4 py-2 border-b border-white/10 bg-[#004717] dark:bg-gray-950">
            <Link
              to="/"
              onClick={() => {
                setActiveCategory("Beranda");
                setIsOpen(false);
              }}
              className="flex items-center"
            >
              <img
                src={Logo}
                alt="Logo Al-Muhtada"
                className="h-8 object-contain"
              />
            </Link>

            <div className="flex items-center gap-2">
              {renderLanguageDropdown()}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-full text-white/90 hover:bg-white/10"
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <button
                onClick={() => setIsOpen((prev) => !prev)}
                className="p-1.5 rounded-full text-white/90 hover:bg-white/10"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation Strip */}
        <MobileNav
          categories={visibleCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          journalUrl={journalUrl}
          isScrolled={isScrolled}
        />

        {/* Desktop Navigation */}
        <DesktopNav
          categories={visibleCategories}
          allCategories={allCategories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          journalUrl={journalUrl}
          isScrolled={isScrolled}
          isDark={isDark}
          toggleTheme={toggleTheme}
          renderLanguageDropdown={renderLanguageDropdown}
        />

        {/* =======================================================
            MOBILE HAMBURGER MENU DRAWER
            ======================================================= */}
        {isOpen && (
          <div className="md:hidden flex flex-col py-2 border-t border-white/10 max-h-[80vh] overflow-y-auto min-w-0 bg-[#004717] dark:bg-gray-900 shadow-2xl">
            {/* Mobile Search */}
            <div className="px-4 py-3">
              <SearchBar />
            </div>

            {/* Main Category Menu */}
            <div className="flex flex-col">
              <p className="px-4 py-1.5 text-xs font-bold text-white/50 uppercase tracking-wider">
                Kategori Berita
              </p>
              <Link
                to="/"
                className={`px-4 py-2 text-sm font-semibold transition-colors ${
                  activeCategory === "Beranda"
                    ? "bg-white/20 text-white"
                    : "text-white/90 hover:bg-white/10"
                }`}
                onClick={() => {
                  setActiveCategory("Beranda");
                  setIsOpen(false);
                }}
              >
                Beranda
              </Link>

              {allCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`/category/${category.slug}`}
                  className={`px-4 py-2 text-sm font-semibold transition-colors ${
                    activeCategory === category.slug
                      ? "bg-white/20 text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                  onClick={() => {
                    setActiveCategory(category.slug);
                    setIsOpen(false);
                  }}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            {/* Menu Profil */}
            <div className="border-t border-white/10 mt-3 pt-2">
              <p className="px-4 py-1.5 text-xs font-bold text-white/50 uppercase tracking-wider">
                Profil Pesantren
              </p>

              <div className="flex flex-col">
                <Link
                  to="/tentang-pesantren"
                  className="px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Tentang Pesantren
                </Link>

                <Link
                  to="/program-pengajar"
                  className="px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Program & Pengajar
                </Link>

                <Link
                  to="/pendaftaran"
                  className="px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Pendaftaran Mahasantri Baru
                </Link>

                <Link
                  to="/prestasi-mahasantri"
                  className="px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Prestasi Mahasantri
                </Link>

                <Link
                  to="/publikasi-mahasantri"
                  className="px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Publikasi Mahasantri
                </Link>

                <Link
                  to="/griya-quran"
                  className="px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Griya Qur'an
                </Link>

                <a
                  href={journalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Jurnal Ilmiah
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay loading saat proses translasi sedang berjalan */}
      {isTranslating && (
        <div className="fixed inset-0 bg-white/70 dark:bg-gray-950/70 backdrop-blur-md flex flex-col items-center justify-center z-[999999] transition-all duration-300 px-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-[280px] sm:max-w-xs px-6 py-5 sm:px-8 sm:py-6 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-4 border-emerald-600 border-t-transparent" />
            <div>
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-sm sm:text-base">
                Menerjemahkan Halaman
              </h3>
              <p className="text-[11px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-1.5 leading-relaxed">
                Sedang menyesuaikan bahasa, mohon tunggu sebentar...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Target tersembunyi untuk engine Google Translate */}
      <div id="google_translate_hidden" style={{ display: "none" }}></div>

      {/* Scrollbar utility */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Navbar;
