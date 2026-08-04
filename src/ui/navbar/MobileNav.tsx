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
  `relative whitespace-nowrap h-full flex items-center text-[15px] transition-colors duration-300 ${
    active
      ? "text-[#0B6B3A] font-semibold"
      : "text-[#555] dark:text-gray-300 font-normal hover:text-[#0B6B3A]"
  }`;

const underlineClass = (active: boolean) =>
  `absolute left-0 right-0 bottom-0 h-[2.5px] rounded-full bg-[#0B6B3A] transition-transform duration-300 origin-left ${
    active ? "scale-x-100" : "scale-x-0"
  }`;

const MobileNav = ({
  categories,
  activeCategory,
  onCategoryChange,
  journalUrl,
}: MobileNavProps) => {
  const [isProfilOpen, setIsProfilOpen] = useState(false);

  return (
    <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      {/* Category Strip */}
      <div className="flex items-center h-11 gap-6 px-4 overflow-x-auto scrollbar-hide min-w-0">
        <NavLink
          to="/"
          className={navItemClass(activeCategory === "Beranda")}
          onClick={() => onCategoryChange("Beranda")}
        >
          Beranda
          <span className={underlineClass(activeCategory === "Beranda")} />
        </NavLink>

        {categories.slice(0, 4).map((category) => (
          <NavLink
            key={category.id}
            to={`/category/${category.slug}`}
            className={navItemClass(activeCategory === category.slug)}
            onClick={() => onCategoryChange(category.slug)}
          >
            {category.name}
            <span className={underlineClass(activeCategory === category.slug)} />
          </NavLink>
        ))}

        <button
          onClick={() => setIsProfilOpen(!isProfilOpen)}
          className={navItemClass(isProfilOpen)}
        >
          Profil
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-200 ${
              isProfilOpen ? "rotate-180" : ""
            }`}
          />
          <span className={underlineClass(isProfilOpen)} />
        </button>
      </div>

      {/* Profil Dropdown */}
      {isProfilOpen && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <div className="px-4 py-2 flex flex-col">
            {profilLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all"
                onClick={() => setIsProfilOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={journalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all"
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
