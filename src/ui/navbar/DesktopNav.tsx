import NavLink from "./Navlink";
import Dropdown from "./Dropdown";
import DropdownItem from "./DropdownItem";
import type { Category } from "../../services/posts";

interface DesktopNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  journalUrl: string;
}

const DesktopNav = ({
  categories,
  activeCategory,
  onCategoryChange,
  journalUrl,
}: DesktopNavProps) => {
  return (
    <div className="hidden md:flex items-center justify-center gap-x-5 lg:gap-x-7 xl:gap-x-9 py-2.5 px-4 sm:px-6 md:px-8 w-full overflow-x-auto md:overflow-x-visible scrollbar-hide min-w-0">
      <NavLink
        to="/"
        className={`whitespace-nowrap text-base font-semibold transition-colors ${
          activeCategory === "Beranda"
            ? "text-white font-bold"
            : "text-white/85 hover:text-white"
        }`}
        onClick={() => onCategoryChange("Beranda")}
      >
        Beranda
      </NavLink>

      {categories.map((category) => (
        <NavLink
          key={category.id}
          to={`/category/${category.slug}`}
          className={`whitespace-nowrap text-base font-semibold transition-colors ${
            activeCategory === category.slug
              ? "text-white font-bold"
              : "text-white/85 hover:text-white"
          }`}
          onClick={() => onCategoryChange(category.slug)}
        >
          {category.name}
        </NavLink>
      ))}

      <Dropdown
        label="Profil"
        variant="pill"
        align="center"
        onClick={() => onCategoryChange("Profil")}
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
        <DropdownItem to={journalUrl}>Jurnal Ilmiah</DropdownItem>
      </Dropdown>
    </div>
  );
};

export default DesktopNav;
