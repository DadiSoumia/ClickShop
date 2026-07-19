import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { getImageUrl } from "../services/api.js";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/produits?category=${category.id}`}
      className="group relative flex items-end aspect-[4/5] overflow-hidden rounded-2xl border border-border/60 shadow-soft transition-all duration-500 ease-premium hover:shadow-card-hover hover:-translate-y-1"
    >
      <img
       src={getImageUrl(category.image)} alt={category.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
      />
      {/* Overlay dégradé — plus élégant qu'un aplat uni */}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent transition-opacity duration-500 group-hover:from-ink/90" />

      <div className="relative z-10 p-3 sm:p-5 w-full">
        <span className="font-display text-sm sm:text-lg font-semibold text-white block">
          {category.name}
        </span>
        <span className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-white/0 group-hover:text-white/90 max-h-0 group-hover:max-h-6 overflow-hidden transition-all duration-300 mt-0 group-hover:mt-1.5">
          Découvrir <FiArrowRight size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}