import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Logo from "../../assets/image/logo.svg";
import SearchBar from "./SearchBar";
import Dropdown from "./Dropdown";
import NavLink from "./Navlink";
import DropdownItem from "./DropdownItem";
import { Menu, X } from "lucide-react"; // ikon hamburger & close
import { categoriesService } from "../../services/categories";
import type { Category } from "../../services/posts";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeCategory, setActiveCategory] = useState("Beranda");
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

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
            cat.post_count && parseInt(cat.post_count) > 0,
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
      <header className="bg-[#00531b] shadow-sm border-b border-green-900">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <img
              src={Logo}
              alt="Logo Al-Muhtada"
              className="
                    w-auto
                    h-14
                    sm:h-17
                    md:h-18
                    lg:h-19
                    xl:h-20
                    object-contain
                  "
            />

            {/* Divider */}
            <span className="hidden md:block h-8 w-px bg-white/30" />

            {/* Date */}
            <span className="hidden md:block text-sm text-white/80 leading-tight">
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <SearchBar />
            </div>
            {/* Hamburger Menu */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-white/10 text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav
        className={`bg-[#00531b] border-b border-gray-200 sticky top-0 z-50 transition-transform duration-300 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 py-4">
            <NavLink
              to="/"
              className={`whitespace-nowrap pb-2 border-b-2 text-sm font-medium transition-colors ${
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
              className={`whitespace-nowrap pb-2 border-b-2 text-sm font-medium transition-colors ${
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
              className={`whitespace-nowrap pb-2 border-b-2 text-sm font-medium transition-colors ${
                activeCategory === "sejarah"
                  ? "border-white text-white"
                  : "border-transparent text-white/80 hover:text-white hover:border-white/60"
              }`}
              onClick={() => setActiveCategory("sejarah")}
            >
              Sejarah
            </NavLink>

            {categories.slice(0, 4).map((category) => (
              <NavLink
                key={category.id}
                to={`/category/${category.slug}`}
                className={`whitespace-nowrap pb-2 border-b-2 text-sm font-medium transition-colors ${
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
              className={`whitespace-nowrap pb-2 border-b-2 text-sm font-medium transition-colors ${
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
            <div className="md:hidden flex flex-col space-y-4 py-4 border-t">
              <SearchBar />
              <Link
                to="/"
                className="text-gray-700 hover:text-[#00531b]"
                onClick={() => {
                  setActiveCategory("Beranda");
                  setIsOpen(false);
                }}
              >
                Beranda
              </Link>
              <Link
                to="/pendidikan"
                className="text-gray-700 hover:text-[#00531b]"
                onClick={() => {
                  setActiveCategory("Pendidikan");
                  setIsOpen(false);
                }}
              >
                Pendidikan
              </Link>
              <Link
                to="/category/sejarah"
                className="text-gray-700 hover:text-[#00531b]"
                onClick={() => {
                  setActiveCategory("sejarah");
                  setIsOpen(false);
                }}
              >
                Sejarah
              </Link>
              <div>
                <p className="font-medium text-gray-600">Kategori</p>
                <div className="pl-4 flex flex-col space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category.slug}`}
                      className="text-gray-700 hover:text-[#00531b]"
                      onClick={() => {
                        setActiveCategory(category.slug);
                        setIsOpen(false);
                      }}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-medium text-gray-600">Profil</p>
                <div className="pl-4 flex flex-col space-y-2">
                  <Link to="/tentang-pesantren">Tentang Pesantren</Link>
                  <Link to="/program-pengajar">Program & Pengajar</Link>
                  <Link to="/pendaftaran">Pendaftaran Mahasantri Baru</Link>
                  <Link to="/prestasi-mahasantri">Prestasi Mahasantri</Link>
                  <Link to="/publikasi-mahasantri">Publikasi Mahasantri</Link>
                  <Link to="/griya-quran">Griya Qur'an</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
