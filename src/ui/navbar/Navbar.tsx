import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/image/logo.svg";
import SearchBar from "./SearchBar";
import Dropdown from "./Dropdown";
import NavLink from "./Navlink";
import DropdownItem from "./DropdownItem";
import { Menu, X, Sun, Moon } from "lucide-react";
import { categoriesService } from "../../services/categories";
import type { Category } from "../../services/posts";
import { useTheme } from "../../hooks/useTheme";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Beranda");
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { isDark, toggleTheme } = useTheme();

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      setShowNavbar(window.scrollY <= lastScrollY || window.scrollY === 0);
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => window.removeEventListener("scroll", controlNavbar);
  }, [lastScrollY]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await categoriesService.getCategories();
        // Filter hanya category yang memiliki posts
        const categoriesWithPosts = categoriesData.filter(
          (cat: Category & { post_count?: string }) =>
            cat.post_count &&
            parseInt(cat.post_count) > 0 &&
            !["pendidikan", "sejarah"].includes(cat.slug.toLowerCase()),
        );
        setCategories(categoriesWithPosts);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      {/* Header */}
      <header className="bg-[#00531b] dark:bg-gray-900 border-b border-green-900 dark:border-gray-700">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* LOGO + DATE */}
            <div className="flex items-center gap-2 sm:gap-4 min-w-0">
              <Link to="/" onClick={() => setActiveCategory("Beranda")}>
                <img
                  src={Logo}
                  alt="Logo Al-Muhtada"
                  className="h-10 sm:h-12 md:h-16 lg:h-24 object-contain flex-shrink-0"
                />
              </Link>

              <span className="hidden lg:block text-sm text-white/80 leading-tight whitespace-nowrap">
                {new Date().toLocaleDateString("id-ID", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>

            {/* SEARCH + THEME TOGGLE + HAMBURGER */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden md:block">
                <SearchBar />
              </div>

              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                aria-label={
                  isDark ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Navigation */}
      <nav
        className={`bg-[#00531b] dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-8">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center justify-center gap-x-3 lg:gap-x-5 xl:gap-x-7 py-3 w-full">
            <NavLink
              to="/"
              className={`whitespace-nowrap pb-1 border-b-2 text-sm font-medium transition-colors ${
                activeCategory === "Beranda"
                  ? "border-white text-white"
                  : "border-transparent text-white/80 hover:text-white hover:border-white/60"
              }`}
              onClick={() => setActiveCategory("Beranda")}
            >
              Beranda
            </NavLink>

            <NavLink
              to="/pendidikan"
              className={`whitespace-nowrap pb-1 border-b-2 text-sm font-medium transition-colors ${
                activeCategory === "Pendidikan"
                  ? "border-white text-white"
                  : "border-transparent text-white/80 hover:text-white hover:border-white/60"
              }`}
              onClick={() => setActiveCategory("Pendidikan")}
            >
              Pendidikan
            </NavLink>

            <NavLink
              to="/category/sejarah"
              className={`whitespace-nowrap pb-1 border-b-2 text-sm font-medium transition-colors ${
                activeCategory === "sejarah"
                  ? "border-white text-white"
                  : "border-transparent text-white/80 hover:text-white hover:border-white/60"
              }`}
              onClick={() => setActiveCategory("sejarah")}
            >
              Sejarah
            </NavLink>

            {/* Kategori dari Database */}
            {categories.map((category) => (
              <NavLink
                key={category.id}
                to={`/category/${category.slug}`}
                className={`whitespace-nowrap pb-1 border-b-2 text-sm font-medium transition-colors ${
                  activeCategory === category.slug
                    ? "border-white text-white"
                    : "border-transparent text-white/80 hover:text-white hover:border-white/60"
                }`}
                onClick={() => setActiveCategory(category.slug)}
              >
                {category.name}
              </NavLink>
            ))}

            <Dropdown
              label="Profil"
              className={`whitespace-nowrap pb-1 border-b-2 text-sm font-medium transition-colors ${
                activeCategory === "Profil"
                  ? "border-white text-white"
                  : "border-transparent text-white/80 hover:text-white hover:border-white/60"
              }`}
              onClick={() => setActiveCategory("Profil")}
            >
              <DropdownItem to="/tentang-pesantren">
                Tentang Pesantren
              </DropdownItem>
              <DropdownItem to="/program-pengajar">
                Program & Pengajar
              </DropdownItem>
              <DropdownItem to="/pendaftaran">
                Pendaftaran Mahasantri Baru
              </DropdownItem>
              <DropdownItem to="/prestasi-mahasantri">
                Prestasi Mahasantri
              </DropdownItem>
              <DropdownItem to="/publikasi-mahasantri">
                Publikasi Mahasantri
              </DropdownItem>
              <DropdownItem to="/griya-quran">Griya Qur'an</DropdownItem>
            </Dropdown>
          </div>

          {/* Mobile Menu */}
          {isOpen && (
            <div className="md:hidden flex flex-col py-3 border-t border-white/20">
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
                <Link
                  to="/pendidikan"
                  className="px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => {
                    setActiveCategory("Pendidikan");
                    setIsOpen(false);
                  }}
                >
                  Pendidikan
                </Link>
                <Link
                  to="/category/sejarah"
                  className="px-4 py-2.5 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  onClick={() => {
                    setActiveCategory("sejarah");
                    setIsOpen(false);
                  }}
                >
                  Sejarah
                </Link>

                {/* Kategori dari Database */}
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
                </div>
              </div>
            </div>
          )}
        </div>
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
