import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

type DropdownProps = {
  label?: string;
  labelNode?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  align?: "left" | "right" | "center";
  width?: string;
  variant?: "default" | "pill" | "ghost" | "outline" | "nav";
};

const Dropdown = ({
  label,
  labelNode,
  children,
  onClick,
  className = "",
  align = "left",
  width = "w-56",
  variant = "nav",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown jika klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Tutup dengan Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const alignClass = {
    left: "left-0",
    right: "right-0",
    center: "left-1/2 -translate-x-1/2",
  };

  const variantStyles = {
    nav: `text-white/90 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-1.5 ${
      isOpen ? "bg-white/10 text-white" : ""
    }`,
    default: "text-white hover:text-white/90 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all font-medium",
    pill: `text-white bg-black/15 hover:bg-black/25 dark:bg-white/10 dark:hover:bg-white/15 px-4 py-1.5 rounded-xl transition-all duration-200 ${
      isOpen ? "bg-black/25 dark:bg-white/15" : ""
    }`,
    ghost: "text-white/90 hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all font-medium",
    outline:
      "text-white border border-white/20 rounded-lg px-4 py-1.5 hover:bg-white/10",
  };

  const handleChildClick = (e: React.MouseEvent) => {
    // Close dropdown when a child link/button inside is clicked
    if ((e.target as HTMLElement).closest("a, button")) {
      setIsOpen(false);
    }
  };

  return (
    <div ref={dropdownRef} className={`relative inline-block ${className}`}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          onClick?.();
        }}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`
          inline-flex items-center gap-1.5
          whitespace-nowrap text-sm lg:text-base font-semibold
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent
          ${variantStyles[variant]}
        `}
      >
        {labelNode ? labelNode : label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Animated dropdown panel */}
      <div
        onClick={handleChildClick}
        className={`
          absolute ${alignClass[align]} top-full mt-2
          ${width}
          origin-top
          transition-all duration-200 ease-out
          z-[9999]
          ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
              : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
          }
        `}
      >
        <div
          className={`
            overflow-hidden rounded-xl
            bg-white dark:bg-gray-900
            border border-gray-200/80 dark:border-gray-800
            shadow-[0_10px_38px_rgba(0,0,0,0.18)]
            ring-1 ring-black/5
          `}
        >
          <div className="flex flex-col py-1.5 max-h-[70vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Sub-component untuk item dropdown
export const DropdownItem = ({
  children,
  to,
  onClick,
  icon,
  active = false,
  disabled = false,
  danger = false,
}: {
  children: React.ReactNode;
  to?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  danger?: boolean;
}) => {
  const content = (
    <>
      {icon && <span className="flex-shrink-0 text-emerald-600 dark:text-emerald-400">{icon}</span>}
      <span className="truncate flex-1">{children}</span>
    </>
  );

  const baseStyles = `
    flex items-center gap-2.5 w-full px-4 py-2.5
    text-sm text-left font-medium
    transition-all duration-150 rounded-md mx-1 my-0.5
    ${
      active
        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-semibold"
        : danger
        ? "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
        : "text-gray-700 dark:text-gray-200 hover:bg-emerald-50/80 dark:hover:bg-gray-800 hover:text-emerald-700 dark:hover:text-emerald-400"
    }
    ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
  `;

  if (to) {
    const isExternal = to.startsWith("http://") || to.startsWith("https://");
    if (isExternal) {
      return (
        <a
          href={to}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className={baseStyles}
        >
          {content}
        </a>
      );
    }
    return (
      <Link to={to} onClick={onClick} className={baseStyles}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={baseStyles}>
      {content}
    </button>
  );
};

// Sub-component untuk separator
export const DropdownSeparator = () => (
  <div className="my-1 mx-3 border-t border-gray-100 dark:border-gray-800" />
);

// Sub-component untuk label section
export const DropdownLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="px-4 py-1.5 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
    {children}
  </div>
);

export default Dropdown;
