const SearchBar = () => (
  <div className="hidden md:flex items-center gap-3 rounded-full bg-white/90 px-4 py-2 shadow-sm ring-1 ring-black/5 focus-within:ring-emerald-600 transition">
    {/* Icon */}
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className="text-emerald-700"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>

    {/* Input */}
    <input
      type="search"
      placeholder="Cari artikel..."
      className="
        w-56
        bg-transparent
        text-sm
        text-gray-700
        placeholder:text-gray-400
        outline-none
      "
    />
  </div>
);

export default SearchBar;
