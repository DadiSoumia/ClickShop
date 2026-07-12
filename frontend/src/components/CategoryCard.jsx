import { Link } from "react-router-dom";

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/produits?category=${category.id}`}
      className="group relative flex items-end aspect-square overflow-hidden rounded-xl sm:rounded-2xl border border-border"
    >
      <img
        src={category.image}
        alt={category.name}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-ink/40 group-hover:bg-ink/50 transition-colors" />
      <span className="relative z-10 p-2.5 sm:p-4 font-display text-sm sm:text-base font-semibold text-white">
        {category.name}
      </span>
    </Link>
  );
}