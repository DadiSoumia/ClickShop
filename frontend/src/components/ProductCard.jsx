import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { getImageUrl } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

const formatPrice = (value) => `${value.toLocaleString("fr-FR")} DA`;

export default function ProductCard({ product }) {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const hasPromo = product.oldPrice && product.oldPrice > product.price;
  const outOfStock = product.stock <= 0;
  const inCart = isInCart(product._id);

  const handleToggleCart = (e) => {
    e.preventDefault();
    if (inCart) {
      removeFromCart(product._id);
      return;
    }
    if (outOfStock) return;
    addToCart(product, 1);
  };

  return (
    <div className="group flex flex-col rounded-xl sm:rounded-2xl bg-white border border-border overflow-hidden">
      <Link to={`/produits/${product._id}`} className="relative block aspect-square overflow-hidden">
        <img
          src={getImageUrl(product.images[0])}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
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

      <div className="p-2.5 sm:p-4 flex flex-col gap-1 sm:gap-1.5">
        <span className="text-[10px] sm:text-xs font-semibold uppercase text-primary">{product.category}</span>
        <Link to={`/produits/${product._id}`}>
          <h3 className="font-display text-sm sm:text-base font-semibold text-ink line-clamp-1 hover:text-primary">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 flex-wrap">
          <span className="text-sm sm:text-lg font-bold text-ink">{formatPrice(product.price)}</span>
          {hasPromo && (
            <span className="text-xs sm:text-sm text-ink/40 line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3">
          <div className="relative group/cartbtn">
            <button
              onClick={handleToggleCart}
              disabled={outOfStock && !inCart}
              aria-label={inCart ? "Déjà dans le panier" : "Ajouter au panier"}
              className={`h-8 w-8 sm:h-9 sm:w-9 shrink-0 flex items-center justify-center rounded-full border disabled:opacity-40 disabled:pointer-events-none ${
                inCart ? "bg-primary/10 border-primary text-primary" : "border-border hover:bg-surface"
              }`}
            >
              <FiShoppingCart size={14} className="sm:size-4" />
            </button>

            {/* Menu rapide au survol */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max min-w-[150px] flex-col rounded-lg border border-border bg-white shadow-lg py-1 z-20 hidden group-hover/cartbtn:flex">
              <button
                onClick={handleToggleCart}
                disabled={outOfStock && !inCart}
                className="px-3 py-2 text-left text-xs font-medium text-ink hover:bg-surface disabled:opacity-40 disabled:pointer-events-none"
              >
                {inCart ? "Retirer du panier" : "Ajouter au panier"}
              </button>
              <Link
                to={`/produits/${product._id}`}
                className="px-3 py-2 text-left text-xs font-medium text-ink hover:bg-surface"
              >
                Voir détails
              </Link>
            </div>
          </div>

          <Link
            to={`/commande/${product._id}`}
            className={`flex-1 text-center text-xs sm:text-sm font-semibold rounded-full py-1.5 sm:py-2 text-white bg-primary hover:opacity-90 ${
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