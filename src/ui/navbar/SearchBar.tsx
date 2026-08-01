import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-3 rounded-full bg-white px-5 py-2.5 shadow-sm transition w-full md:w-auto"
    >
      <Search className="w-4 h-4 text-emerald-700 flex-shrink-0" />

      <input
        type="search"
        placeholder="Cari artikel..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="
          w-full md:w-72
          bg-transparent
          text-sm
          text-gray-700
          placeholder:text-gray-400
          outline-none
        "
      />
    </form>
  );
};

export default SearchBar;
