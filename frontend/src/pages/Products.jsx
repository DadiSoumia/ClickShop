import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import useProducts from "../hooks/useProducts.js";
import useCategories from "../hooks/useCategories.js";
import ProductCardSkeleton from "../components/ProductCardSkeleton.jsx";

export default function Products() {
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery =
        !query.trim() || p.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesCategory = !category || p.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  return (
    <div className="container-page py-6 sm:py-10 md:py-12">
      <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-ink mb-1.5 sm:mb-2">
        Tous les produits
      </h1>
      <p className="text-xs sm:text-sm text-ink/60 mb-4 sm:mb-8">
        {loading ? "Chargement..." : `${filtered.length} produit(s) trouvé(s)`}
      </p>

      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mb-5 sm:mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Rechercher un produit..."
          className="input-field text-sm sm:max-w-xs"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="input-field text-sm sm:max-w-[200px]"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
    {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
  </div>
) : filtered.length > 0 ? (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
    {filtered.map((p) => (
      <ProductCard key={p._id} product={p} />
    ))}
  </div>
) : (
  <p className="text-center text-ink/50 py-16 text-sm">Aucun produit trouvé.</p>
)}
    </div>
  );
}