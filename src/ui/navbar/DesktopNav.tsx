import { Link } from "react-router-dom";
import NavLink from "./Navlink";
import Dropdown, { DropdownItem, DropdownLabel, DropdownSeparator } from "./Dropdown";
import { Sun, Moon } from "lucide-react";
import Logo from "../../assets/image/logo.svg";
import type { Category } from "../../services/posts";

interface DesktopNavProps {
  categories: Category[];
  allCategories: Category[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  journalUrl: string;
  isScrolled?: boolean;
  isDark?: boolean;
  toggleTheme?: () => void;
  renderLanguageDropdown?: () => React.ReactNode;
}

const DesktopNav = ({
  categories,
  allCategories,
  activeCategory,
  onCategoryChange,
  journalUrl,
  isScrolled = false,
  isDark = false,
  toggleTheme,
  renderLanguageDropdown,
}: DesktopNavProps) => {
  // Categories for "Lainnya" dropdown (remaining categories from API)
  const remainingCategories = allCategories.filter(
    (cat) => !categories.some((vis) => vis.id === cat.id)
  );

  return (
    <div className="hidden md:flex items-center justify-between py-2 px-4 sm:px-6 md:px-8 w-full min-w-0 max-w-[1500px] mx-auto">
      {/* Container Kiri: Logo (saat scrolled) + Dynamic Category Menu Links */}
      <div className="flex items-center gap-x-3 lg:gap-x-5 xl:gap-x-6 min-w-0 flex-1">
        {/* Logo muncul disamping kiri ketika pengguna melakukan scroll ke bawah */}
        {isScrolled && (
          <Link
            to="/"
            onClick={() => onCategoryChange("Beranda")}
            className="flex items-center shrink-0 mr-2 transition-transform duration-200 hover:scale-105"
            title="Al-Muhtada Beranda"
          >
            <img
              src={Logo}
              alt="Logo Al-Muhtada"
              className="h-9 lg:h-10 w-auto object-contain"
            />
          </Link>
        )}

        {/* Beranda Link */}
        <NavLink
          to="/"
          className={`whitespace-nowrap text-sm lg:text-base font-semibold py-1 px-3 rounded-lg transition-all duration-200 ${
            activeCategory === "Beranda"
              ? "bg-white/20 text-white font-bold shadow-sm"
              : "text-white/90 hover:text-white hover:bg-white/10"
          }`}
          onClick={() => onCategoryChange("Beranda")}
        >
          Beranda
        </NavLink>

        {/* Kategori Dinamis dari API Backend (/category/slug & category.name) */}
        {categories.map((category) => {
          const isActive = activeCategory === category.slug;
          return (
            <NavLink
              key={category.id}
              to={`/category/${category.slug}`}
              className={`whitespace-nowrap text-sm lg:text-base font-semibold py-1 px-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-white/20 text-white font-bold shadow-sm"
                  : "text-white/90 hover:text-white hover:bg-white/10"
              }`}
              onClick={() => onCategoryChange(category.slug)}
            >
              {category.name}
            </NavLink>
          );
        })}

        {/* Dropdown Lainnya (Kategori sisa dari API) */}
        {allCategories.length > categories.length && (
          <Dropdown label="Lainnya" variant="nav" align="left" width="w-60">
            <DropdownLabel>Kategori Lainnya</DropdownLabel>
            <DropdownSeparator />
            {(remainingCategories.length > 0 ? remainingCategories : allCategories).map((category) => (
              <DropdownItem
                key={category.id}
                to={`/category/${category.slug}`}
                active={activeCategory === category.slug}
                onClick={() => onCategoryChange(category.slug)}
              >
                {category.name}
              </DropdownItem>
            ))}
          </Dropdown>
        )}

        {/* Dropdown Profil Pesantren */}
        <Dropdown label="Profil" variant="nav" align="left" width="w-64">
          <DropdownLabel>Profil Pesantren</DropdownLabel>
          <DropdownSeparator />
          <DropdownItem
            to="/tentang-pesantren"
            active={activeCategory === "tentang-pesantren"}
            onClick={() => onCategoryChange("tentang-pesantren")}
          >
            Tentang Pesantren
          </DropdownItem>
          <DropdownItem
            to="/program-pengajar"
            active={activeCategory === "program-pengajar"}
            onClick={() => onCategoryChange("program-pengajar")}
          >
            Program & Pengajar
          </DropdownItem>
          <DropdownItem
            to="/pendaftaran"
            active={activeCategory === "pendaftaran"}
            onClick={() => onCategoryChange("pendaftaran")}
          >
            Pendaftaran Mahasantri Baru
          </DropdownItem>
          <DropdownItem
            to="/prestasi-mahasantri"
            active={activeCategory === "prestasi-mahasantri"}
            onClick={() => onCategoryChange("prestasi-mahasantri")}
          >
            Prestasi Mahasantri
          </DropdownItem>
          <DropdownItem
            to="/publikasi-mahasantri"
            active={activeCategory === "publikasi-mahasantri"}
            onClick={() => onCategoryChange("publikasi-mahasantri")}
          >
            Publikasi Mahasantri
          </DropdownItem>
          <DropdownItem
            to="/griya-quran"
            active={activeCategory === "griya-quran"}
            onClick={() => onCategoryChange("griya-quran")}
          >
            Griya Qur'an
          </DropdownItem>
          <DropdownSeparator />
          <DropdownItem to={journalUrl}>Jurnal Ilmiah</DropdownItem>
        </Dropdown>
      </div>

      {/* Container Kanan (saat scrolled): Bahasa + Theme button */}
      {isScrolled && (
        <div className="flex items-center gap-3 shrink-0 ml-4 animate-fadeIn">
          {renderLanguageDropdown?.()}
          {toggleTheme && (
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center w-9 h-9 rounded-full text-white/90 hover:bg-white/10 transition-colors shrink-0"
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DesktopNav;
