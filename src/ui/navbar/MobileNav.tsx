import { useState } from "react";
import { Link } from "react-router-dom";
import NavLink from "./Navlink";
import { ChevronDown } from "lucide-react";
import type { Category } from "../../services/posts";


interface MobileNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (slug: string) => void;
  journalUrl: string;
  isScrolled?: boolean;
}

const profilLinks = [
  { to: "/tentang-pesantren", label: "Tentang Pesantren" },
  { to: "/program-pengajar", label: "Program & Pengajar" },
  { to: "/pendaftaran", label: "Pendaftaran Mahasantri Baru" },
  { to: "/prestasi-mahasantri", label: "Prestasi Mahasantri" },
  { to: "/publikasi-mahasantri", label: "Publikasi Mahasantri" },
  { to: "/griya-quran", label: "Griya Qur'an" },
];

const navItemClass = (active: boolean) =>
  `relative whitespace-nowrap h-full flex items-center text-sm font-semibold transition-colors duration-200 py-2.5 px-1 ${
    active ? "text-white font-bold" : "text-white/80 hover:text-white"
  }`;

const underlineClass = (active: boolean) =>
  `absolute left-0 right-0 bottom-0 h-[2.5px] rounded-full bg-white transition-transform duration-300 origin-left ${
    active ? "scale-x-100" : "scale-x-0"
  }`;

const MobileNav = ({
  categories,
  activeCategory,
  onCategoryChange,
  journalUrl,
}: MobileNavProps) => {
  const [isProfilOpen, setIsProfilOpen] = useState(false);

  // Kategori sisa untuk dropdown "Lainnya"


  return (
    <div className="md:hidden bg-[#00531b] dark:bg-gray-900 border-b border-white/10">
      {/* Category Strip */}
      <div className="flex items-center h-11 gap-5 px-4 overflow-x-auto scrollbar-hide min-w-0">
        <NavLink
          to="/"
          className={navItemClass(activeCategory === "Beranda")}
          onClick={() => onCategoryChange("Beranda")}
        >
          Beranda
          <span className={underlineClass(activeCategory === "Beranda")} />
        </NavLink>

        {/* Dynamic categories from API */}
        {categories.map((category) => {
          const isActive = activeCategory === category.slug;
          return (
            <NavLink
              key={category.id}
              to={`/category/${category.slug}`}
              className={navItemClass(isActive)}
              onClick={() => onCategoryChange(category.slug)}
            >
              {category.name}
              <span className={underlineClass(isActive)} />
            </NavLink>
          );
        })}

        {/* Dropdown Lainnya */}

        {/* Profil Button */}
        <button
          onClick={() => setIsProfilOpen(!isProfilOpen)}
          className={navItemClass(isProfilOpen)}
        >
          Profil
          <ChevronDown
            className={`h-4 w-4 ml-1 transition-transform duration-200 ${
              isProfilOpen ? "rotate-180" : ""
            }`}
          />
          <span className={underlineClass(isProfilOpen)} />
        </button>
      </div>

      {/* Profil Dropdown Accordion */}
      {isProfilOpen && (
        <div className="bg-[#004215] dark:bg-gray-800 border-t border-white/10">
          <div className="px-4 py-2 flex flex-col">
            {profilLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                onClick={() => setIsProfilOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={journalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
              onClick={() => setIsProfilOpen(false)}
            >
              Jurnal Ilmiah
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileNav;
