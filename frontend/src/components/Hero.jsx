import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

export default function Hero() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/produits?q=${encodeURIComponent(query.trim())}` : "/produits");
  };

  return (
    <section className="bg-surface">
      <div className="container-page py-10 sm:py-16 md:py-24 text-center">
        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold text-ink leading-tight px-2">
          Trouvez ce qui compte,
          <br />
          <span className="text-primary">livré simplement.</span>
        </h1>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-ink/70 max-w-md mx-auto px-2">
          Technologie, mode, maison, beauté, sport et livres — une sélection simple,
          sans compte à créer.
        </p>

        <form
          onSubmit={handleSearch}
          className="mt-6 sm:mt-8 flex items-center gap-1.5 sm:gap-2 max-w-md mx-auto bg-white rounded-full p-1.5 border border-border"
        >
          <FiSearch className="ml-2.5 sm:ml-3 text-ink/40 shrink-0" size={17} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            placeholder="Rechercher un produit..."
            className="flex-1 min-w-0 bg-transparent outline-none text-sm py-2"
          />
          <button type="submit" className="btn-primary !py-2 !px-3.5 sm:!py-2.5 sm:!px-5 text-xs sm:text-sm shrink-0">
            Chercher
          </button>
        </form>
      </div>
    </section>
  );
}