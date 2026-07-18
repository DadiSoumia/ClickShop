import { useMemo } from "react";
import Hero from "../components/Hero.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import ProductCard from "../components/ProductCard.jsx";
import WhyUs from "../components/WhyUs.jsx";
import Reveal from "../components/Reveal.jsx";
import useProducts from "../hooks/useProducts.js";
import useCategories from "../hooks/useCategories.js";
import ProductCardSkeleton from "../components/ProductCardSkeleton.jsx";

const HIDE_SCROLLBAR = "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden";

export default function Home() {
  const { products, loading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();

  const popular = useMemo(() => products.slice(0, 8), [products]);

  return (
    <div>
      <div id="accueil">
        <Hero />
      </div>

      <section id="categories" className="py-12 sm:py-20 md:py-28">
        <Reveal className="container-page">
          <SectionHeader title="Nos catégories" subtitle="Explorez nos univers de produits" />
        </Reveal>

        {!categoriesLoading && categories.length === 0 ? (
          <p className="text-center text-ink/50 text-sm">Aucune catégorie pour le moment.</p>
        ) : (
          <Reveal
            delay={0.1}
            className={`flex gap-2.5 sm:gap-4 overflow-x-auto snap-x snap-mandatory pb-2 px-4 sm:px-6 lg:px-8 ${HIDE_SCROLLBAR}`}
          >
            {categories.map((c) => (
              <div key={c.id} className="shrink-0 w-32 sm:w-44 md:w-52 snap-start">
                <CategoryCard category={c} />
              </div>
            ))}
          </Reveal>
        )}
      </section>

      {/* Produits populaires — carrousel horizontal */}
      <section id="produits" className="bg-surface py-12 sm:py-20 md:py-28">
        <Reveal className="container-page">
          <SectionHeader title="Produits populaires" />
        </Reveal>

        <Reveal
          delay={0.1}
          className={`flex gap-2.5 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-2 px-4 sm:px-6 lg:px-8 ${HIDE_SCROLLBAR}`}
        >
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="shrink-0 w-40 sm:w-52 md:w-56 snap-start">
                  <ProductCardSkeleton />
                </div>
              ))
            : popular.map((p) => (
                <div key={p._id} className="shrink-0 w-40 sm:w-52 md:w-56 snap-start">
                  <ProductCard product={p} />
                </div>
              ))}
        </Reveal>
      </section>

      <Reveal>
        <WhyUs />
      </Reveal>
    </div>
  );
}