import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import BackButton from "../components/BackButton.jsx";
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

  // Regroupe les produits filtrés par catégorie, une ligne par catégorie
  const groupedByCategory = useMemo(() => {
    const groups = {};
    filtered.forEach((p) => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });

    // Ordre : d'abord selon l'ordre des catégories connues, puis le reste
    const knownOrder = categories.map((c) => c.id).filter((id) => groups[id]);
    const otherSlugs = Object.keys(groups).filter((slug) => !knownOrder.includes(slug));
    const orderedSlugs = [...knownOrder, ...otherSlugs];

    return orderedSlugs.map((slug) => ({
      slug,
      name: categories.find((c) => c.id === slug)?.name || slug,
      items: groups[slug],
    }));
  }, [filtered, categories]);

  return (
    <div className="container-page py-6 sm:py-10 md:py-12">
      <BackButton />
      <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-ink mb-1.5 sm:mb-2">
        Tous les produits
      </h1>
      <p className="text-xs sm:text-sm text-ink/60 mb-4 sm:mb-8">
        {loading ? "Chargement..." : `${filtered.length} produit(s) trouvé(s)`}
      </p>

      <div className="mb-5 sm:mb-8">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="text"
          placeholder="Rechercher un produit..."
          className="input-field text-sm sm:max-w-xs"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : groupedByCategory.length > 0 ? (
        <div className="space-y-8 sm:space-y-12">
          {groupedByCategory.map((group) => (
            <section key={group.slug}>
              <h2 className="font-display text-lg sm:text-xl font-bold text-ink mb-3 sm:mb-4 capitalize">
                {group.name}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
                {group.items.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <p className="text-center text-ink/50 py-16 text-sm">Aucun produit trouvé.</p>
      )}
    </div>
  );
}