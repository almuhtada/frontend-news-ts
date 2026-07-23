import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

type DropdownProps = {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  align?: "left" | "right" | "center";
  width?: string;
  variant?: "default" | "ghost" | "outline";
};

const Dropdown = ({
  label,
  children,
  onClick,
  className = "",
  align = "left",
  width = "w-56",
  variant = "default",
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
    default: "text-white hover:text-white/90 hover:bg-white/10",
    ghost: "text-gray-700 hover:text-gray-900 hover:bg-gray-100",
    outline:
      "text-gray-700 border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 hover:border-gray-400",
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
          whitespace-nowrap text-sm font-medium
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-white/40 focus:ring-offset-2 focus:ring-offset-transparent
          ${variantStyles[variant]}
          ${variant === "default" ? "pb-2" : ""}
        `}
      >
        {label}
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Animated dropdown panel */}
      <div
        className={`
          absolute ${alignClass[align]} top-full mt-2
          ${width}
          origin-top
          transition-all duration-200 ease-out
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
            bg-white/95 backdrop-blur-sm
            border border-gray-200/60
            shadow-[0_8px_30px_rgb(0,0,0,0.12)]
            ring-1 ring-black/5
          `}
        >
          <div className="flex flex-col py-1">{children}</div>
        </div>
      </div>
    </div>
  );
};

// Sub-component untuk item dropdown
export const DropdownItem = ({
  children,
  onClick,
  icon,
  disabled = false,
  danger = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center gap-3 w-full px-4 py-2.5
      text-sm text-left
      transition-colors duration-150
      ${
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
      }
      ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
    `}
  >
    {icon && <span className="flex-shrink-0 text-gray-400">{icon}</span>}
    <span className="truncate">{children}</span>
  </button>
);

// Sub-component untuk separator
export const DropdownSeparator = () => (
  <div className="my-1 mx-4 border-t border-gray-100" />
);

// Sub-component untuk label section
export const DropdownLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
    {children}
  </div>
);

export default Dropdown;
