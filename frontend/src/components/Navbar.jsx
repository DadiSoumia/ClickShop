import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiSearch, FiChevronDown, FiFacebook, FiInstagram } from "react-icons/fi";
import useCategories from "../hooks/useCategories.js";
import useScrollSpy from "../hooks/useScrollSpy.js";

const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/clickshopdz16",
  instagram: "https://instagram.com/tonpage",
};

export default function Navbar() {
  const { categories } = useCategories();
  const [open, setOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
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
    setOpen(false);
  };

  const linkClass = (active) =>
    `text-sm font-semibold transition-colors ${active ? "text-primary" : "text-ink hover:text-primary"}`;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md shadow-sm border-b border-border"
          : "bg-background/95 backdrop-blur-sm border-b border-transparent"
      }`}
    >
      <nav className="container-page flex items-center justify-between h-14 sm:h-16 md:h-20">
        {/* Logo */}
        <Link to="/" className="font-display text-lg sm:text-xl md:text-2xl font-bold text-ink shrink-0">
          ClickShop<span className="text-primary">.</span>
        </Link>

        {/* Liens desktop */}
        <ul className="hidden lg:flex items-center gap-8">
          <li>
            <Link to="/" className={linkClass(isAccueilActive)}>Accueil</Link>
          </li>
          <li className="relative">
            <button
              onClick={() => setCatOpen((v) => !v)}
              className={`flex items-center gap-1 ${linkClass(isCategoriesActive)}`}
            >
              Catégories <FiChevronDown className={`transition-transform ${catOpen ? "rotate-180" : ""}`} size={14} />
            </button>
            {catOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setCatOpen(false)}></div>
                <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-border rounded-xl shadow-lg z-20 overflow-hidden">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => goToCategory(c.id)}
                      className="w-full text-left px-4 py-3 text-sm font-medium text-ink hover:bg-surface transition-colors"
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
              className="input-field !py-2 w-40 lg:w-48 text-sm"
            />
            <button type="submit" className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-surface shrink-0">
              <FiSearch size={17} />
            </button>
          </form>

          
          <button
            onClick={() => setSearchOpen((v) => !v)}
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-full hover:bg-surface"
            aria-label="Rechercher"
          >
            <FiSearch size={19} />
          </button>

    
          <div className="hidden lg:flex items-center gap-1.5 pl-2 border-l border-border ml-1">
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="h-9 w-9 flex items-center justify-center rounded-full text-ink hover:bg-primary hover:text-white transition-colors">
              <FiFacebook size={15} />
            </a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="h-9 w-9 flex items-center justify-center rounded-full text-ink hover:bg-primary hover:text-white transition-colors">
              <FiInstagram size={15} />
            </a>
          </div>

       
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden h-9 w-9 flex items-center justify-center rounded-full hover:bg-surface"
            aria-label="Menu"
          >
            {open ? <FiX size={21} /> : <FiMenu size={21} />}
          </button>
        </div>
      </nav>

      
      {searchOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3">
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
        <div className="lg:hidden border-t border-border bg-background max-h-[calc(100vh-56px)] overflow-y-auto">
          <ul className="container-page py-3 flex flex-col gap-0.5">
            <li>
              <Link to="/" onClick={() => setOpen(false)} className={`block py-3 text-base font-semibold ${isAccueilActive ? "text-primary" : "text-ink"}`}>
                Accueil
              </Link>
            </li>
            <li className="pt-2">
              <p className={`text-xs font-bold uppercase mb-2 ${isCategoriesActive ? "text-primary" : "text-ink/50"}`}>
                Catégories
              </p>
              <div className="flex flex-col gap-0.5 pb-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => goToCategory(c.id)}
                    className="text-left py-2.5 text-sm font-medium text-ink hover:text-primary"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </li>
            <li className="border-t border-border pt-2">
              <Link to="/produits" onClick={() => setOpen(false)} className={`block py-3 text-base font-semibold ${isProduitsActive ? "text-primary" : "text-ink"}`}>
                Produits
              </Link>
            </li>
          </ul>

          <div className="container-page pb-5 flex items-center gap-3 border-t border-border pt-4">
            <a href={SOCIAL_LINKS.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-surface text-ink hover:bg-primary hover:text-white transition-colors">
              <FiFacebook size={16} />
            </a>
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="h-10 w-10 flex items-center justify-center rounded-full bg-surface text-ink hover:bg-primary hover:text-white transition-colors">
              <FiInstagram size={16} />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}