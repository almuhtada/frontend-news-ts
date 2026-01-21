// Dropdown.js
import { useState, useRef, useEffect } from "react";

type DropdownProps = {
  label: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

const Dropdown = ({ label, children }: DropdownProps) => {
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

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="whitespace-nowrap pb-2 text-sm font-medium text-white hover:text-white hover:border-white/60"
      >
        {label}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
          <div className="flex flex-col">{children}</div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
