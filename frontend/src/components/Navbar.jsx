import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiSearch, FiChevronDown, FiFacebook, FiInstagram, FiShoppingCart } from "react-icons/fi";
import useCategories from "../hooks/useCategories.js";
import useScrollSpy from "../hooks/useScrollSpy.js";
import { useCart } from "../context/CartContext.jsx";

const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/clickshopdz16",
  instagram: "https://instagram.com/tonpage",
};

export default function Navbar() {
  const { categories } = useCategories();
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isHome = pathname === "/";
  const activeSection = useScrollSpy(["accueil", "categories", "produits"]);

  const isAccueilActive = isHome ? activeSection === "accueil" : false;
  const isCategoriesActive = isHome ? activeSection === "categories" : pathname.startsWith("/categories");
  const isProduitsActive = isHome ? activeSection === "produits" : pathname.startsWith("/produits");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/produits?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setOpen(false);
    setSearchOpen(false);
  };

  const goToCategory = (categoryId) => {
    navigate(`/produits?category=${categoryId}`);
    setCatOpen(false);
    setMobileCatOpen(false);
    setOpen(false);
  };

  // Lien avec petit soulignement animé au survol (et actif en permanence si actif)
  const linkClass = (active) =>
    `relative text-sm font-semibold transition-colors pb-1 after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-primary after:transition-all after:duration-300 after:ease-premium ${
      active ? "text-primary after:w-full" : "text-ink hover:text-primary after:w-0 hover:after:w-full"
    }`;

  const iconBtn = "h-9 w-9 flex items-center justify-center rounded-full transition-all duration-300 hover:bg-surface hover:scale-105 active:scale-95";

  const CartButton = ({ size = 19, className = "" }) => (
    <Link
      to="/panier"
      onClick={() => setOpen(false)}
      className={`relative ${iconBtn} ${className}`}
      aria-label="Panier"
    >
      <FiShoppingCart size={size} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 h-4.5 min-w-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold leading-none">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-xl border-b border-border/60 shadow-soft"
          : "bg-white/40 backdrop-blur-md border-b border-transparent"
      }`}
    >
      <nav className="container-page flex items-center justify-between h-16 sm:h-20 md:h-24">
        {/* Logo */}
        <Link to="/" className="font-display text-lg sm:text-2xl md:text-3xl font-bold text-ink shrink-0 transition-transform duration-300 hover:scale-[1.02]">
          ClickShop<span className="text-primary">.</span>
        </Link>

        {/* Liens desktop */}
        <ul className="hidden lg:flex items-center gap-10">
          <li>
            <Link to="/" className={linkClass(isAccueilActive)}>Accueil</Link>
          </li>
          <li className="relative">
            <button
              onClick={() => setCatOpen((v) => !v)}
              className={`flex items-center gap-1 ${linkClass(isCategoriesActive)}`}
            >
              Catégories <FiChevronDown className={`transition-transform duration-300 ${catOpen ? "rotate-180" : ""}`} size={14} />
            </button>
            {catOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setCatOpen(false)}></div>
                <div className="absolute right-0 top-full mt-4 w-56 bg-white/90 backdrop-blur-xl border border-border/60 rounded-2xl shadow-card z-20 overflow-hidden animate-fadeInUp">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => goToCategory(c.id)}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-ink hover:bg-surface hover:text-primary transition-colors"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </li>
          <li>
            <Link to="/produits" className={linkClass(isProduitsActive)}>Produits</Link>
          </li>
        </ul>

        {/* Actions à droite */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Recherche desktop (inline) */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Rechercher..."
              className="input-field !py-2 w-40 lg:w-52 text-sm !bg-white/70"
            />
            <button type="submit" className={iconBtn}>
              <FiSearch size={17} />
            </button>
          </form>

          <button
            onClick={() => setSearchOpen((v) => !v)}
            className={`md:hidden ${iconBtn}`}
            aria-label="Rechercher"
          >
            <FiSearch size={19} />
          </button>

          {/* Icône panier — toujours visible, mobile et desktop */}
          <CartButton />

          <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-border ml-1">
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className={`${iconBtn} text-ink hover:bg-primary hover:text-white hover:scale-110`}>
              <FiFacebook size={15} />
            </a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className={`${iconBtn} text-ink hover:bg-primary hover:text-white hover:scale-110`}>
              <FiInstagram size={15} />
            </a>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className={`lg:hidden ${iconBtn}`}
            aria-label="Menu"
          >
            {open ? <FiX size={21} /> : <FiMenu size={21} />}
          </button>
        </div>
      </nav>

      {searchOpen && (
        <div className="md:hidden border-t border-border/60 bg-white/80 backdrop-blur-xl px-4 py-3">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="Rechercher un produit..."
              className="input-field text-sm flex-1"
            />
            <button type="submit" className="btn-primary !px-4 shrink-0">
              <FiSearch size={16} />
            </button>
          </form>
        </div>
      )}

      {open && (
        <div className="lg:hidden border-t border-border/60 bg-white/90 backdrop-blur-xl max-h-[calc(100vh-64px)] overflow-y-auto">
          <ul className="container-page py-3 flex flex-col gap-0.5">
            <li>
              <Link to="/" onClick={() => setOpen(false)} className={`block py-3 text-base font-semibold ${isAccueilActive ? "text-primary" : "text-ink"}`}>
                Accueil
              </Link>
            </li>
            <li className="pt-2">
              <button
                onClick={() => setMobileCatOpen((v) => !v)}
                className={`w-full flex items-center justify-between py-2 text-xs font-bold uppercase tracking-wide2 ${isCategoriesActive ? "text-primary" : "text-ink/50"}`}
              >
                Catégories
                <FiChevronDown className={`transition-transform duration-300 ${mobileCatOpen ? "rotate-180" : ""}`} size={15} />
              </button>
              {mobileCatOpen && (
                <div className="flex flex-col gap-0.5 pb-2 animate-fadeInUp">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => goToCategory(c.id)}
                      className="text-left py-2.5 text-sm font-medium text-ink hover:text-primary transition-colors"
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              )}
            </li>
            <li className="border-t border-border pt-2">
              <Link to="/produits" onClick={() => setOpen(false)} className={`block py-3 text-base font-semibold ${isProduitsActive ? "text-primary" : "text-ink"}`}>
                Produits
              </Link>
            </li>
          </ul>

          <div className="container-page pb-5 flex items-center gap-3 border-t border-border pt-4">
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-surface text-ink hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105">
              <FiFacebook size={16} />
            </a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-surface text-ink hover:bg-primary hover:text-white transition-all duration-300 hover:scale-105">
              <FiInstagram size={16} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}