import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { getImageUrl } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

const formatPrice = (value) => `${value.toLocaleString("fr-FR")} DA`;

export default function ProductCard({ product }) {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const navigate = useNavigate();
  const hasColors = product.colors?.length > 0;
  const hasPromo = product.oldPrice && product.oldPrice > product.price;
  const outOfStock = product.stock <= 0;
  // Sans couleur : on vérifie juste le produit. Avec couleurs : on ne peut pas
  // savoir laquelle sans passer par la fiche produit, donc pas de "actif" ici.
  const inCart = !hasColors && isInCart(product._id);

  const handleToggleCart = (e) => {
    e.preventDefault();

    // Le produit a des couleurs → impossible de deviner laquelle depuis la carte,
    // on envoie directement vers la fiche produit pour que le client choisisse.
    if (hasColors) {
      navigate(`/produits/${product._id}`);
      return;
    }

    if (inCart) {
      removeFromCart(product._id);
      return;
    }
    if (outOfStock) return;
    addToCart(product, 1);
  };

  return (
    <div className="card-premium group flex flex-col h-full rounded-2xl overflow-hidden">
      <Link to={`/produits/${product._id}`} className="relative block aspect-square overflow-hidden">
        <img
          src={getImageUrl(product.images[0])}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 ease-premium group-hover:scale-110"
        />
        {hasPromo && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-primary text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
            Promo
          </span>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-ink/40 flex items-center justify-center">
            <span className="bg-white text-ink text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full">
              Rupture
            </span>
          </div>
        )}
      </Link>

      <div className="p-2.5 sm:p-4 flex flex-1 flex-col gap-1 sm:gap-1.5">
        <span className="text-[10px] sm:text-xs font-semibold uppercase text-primary">{product.category}</span>
        <Link to={`/produits/${product._id}`}>
          <h3 className="font-display text-sm sm:text-base font-semibold text-ink line-clamp-1 hover:text-primary">
            {product.name}
          </h3>
        </Link>

        {/* Pastilles de couleur — aperçu uniquement */}
        {hasColors && (
          <div className="flex gap-1 mt-0.5">
            {product.colors.slice(0, 5).map((color) => (
              <span
                key={color.name}
                title={color.name}
                className="h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full border border-border"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-ink/40">+{product.colors.length - 5}</span>
            )}
          </div>
        )}

        <div className="flex items-baseline gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 flex-wrap">
          <span className="text-sm sm:text-lg font-bold text-ink">{formatPrice(product.price)}</span>
          {hasPromo && (
            <span className="text-xs sm:text-sm text-ink/40 line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        <div className="flex gap-1.5 sm:gap-2 mt-auto pt-2 sm:pt-3">
          <div className="relative group/cartbtn">
            <button
              onClick={handleToggleCart}
              disabled={outOfStock && !inCart && !hasColors}
              aria-label={hasColors ? "Choisir une couleur" : inCart ? "Déjà dans le panier" : "Ajouter au panier"}
              className={`h-8 w-8 sm:h-9 sm:w-9 shrink-0 flex items-center justify-center rounded-full border transition-all duration-300 ease-premium disabled:opacity-40 disabled:pointer-events-none ${
                inCart ? "bg-primary/10 border-primary text-primary" : "border-border hover:bg-surface hover:border-primary/40 hover:-translate-y-0.5"
              }`}
            >
              <FiShoppingCart size={14} className="sm:size-4" />
            </button>
          </div>

          <Link
            to={hasColors ? `/produits/${product._id}` : `/commande/${product._id}`}
            className={`flex-1 text-center text-xs sm:text-sm font-semibold rounded-full py-1.5 sm:py-2 text-white bg-primary transition-all duration-300 ease-premium hover:bg-primary-dark hover:-translate-y-0.5 ${
              outOfStock ? "pointer-events-none opacity-40" : ""
            }`}
          >
            Acheter
          </Link>
        </div>
      </div>
    </div>
  );
}