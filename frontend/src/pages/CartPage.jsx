import { Link, useNavigate } from "react-router-dom";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi";
import BackButton from "../components/BackButton.jsx";
import { getImageUrl } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

const formatPrice = (value) => `${value.toLocaleString("fr-FR")} DA`;

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="container-page py-16 sm:py-24 text-center">
        <FiShoppingBag className="mx-auto text-ink/20" size={56} />
        <h1 className="font-display text-xl sm:text-2xl font-bold text-ink mt-4">
          Votre panier est vide
        </h1>
        <p className="text-ink/60 mt-2 text-sm sm:text-base">
          Ajoutez des produits pour commencer votre commande.
        </p>
        <Link to="/produits" className="btn-primary mt-6 inline-flex text-sm">
          Voir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="container-page py-6 sm:py-8 md:py-12">
      <BackButton />
      <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-ink mb-6 sm:mb-8">
        Mon panier
      </h1>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 sm:gap-10">
        {/* Liste des articles */}
        <div className="space-y-3 sm:space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.productId}-${item.colorName || "default"}`}
              className="flex gap-3 sm:gap-4 bg-white border border-border rounded-xl sm:rounded-2xl p-3 sm:p-4"
            >
              <img
                src={getImageUrl(item.image)}
                alt={item.name}
                className="h-16 w-16 sm:h-20 sm:w-20 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-ink text-sm sm:text-base line-clamp-1">{item.name}</p>
                {item.colorName && (
                  <p className="text-xs text-ink/50 mt-0.5">Couleur : {item.colorName}</p>
                )}
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-bold text-ink text-sm sm:text-base">{formatPrice(item.price)}</span>
                  {item.oldPrice && (
                    <span className="text-xs text-ink/40 line-through">{formatPrice(item.oldPrice)}</span>
                  )}
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="inline-flex items-center border border-border rounded-full">
                    <button
                      onClick={() => updateQuantity(item.productId, item.colorName, item.quantity - 1)}
                      className="h-8 w-8 flex items-center justify-center"
                      aria-label="Diminuer"
                    >
                      <FiMinus size={12} />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.colorName, item.quantity + 1)}
                      className="h-8 w-8 flex items-center justify-center"
                      aria-label="Augmenter"
                    >
                      <FiPlus size={12} />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.productId, item.colorName)}
                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-red-50 text-red-500"
                    aria-label="Retirer du panier"
                  >
                    <FiTrash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Résumé */}
        <aside className="h-fit rounded-xl sm:rounded-2xl border border-border bg-surface p-5 sm:p-6">
          <h2 className="font-display text-base sm:text-lg font-semibold text-ink mb-4">Résumé</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-ink/70">
              <span>Sous-total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <p className="text-xs text-ink/50">Les frais de livraison seront calculés à l'étape suivante.</p>
          </div>
          <div className="flex justify-between font-bold text-ink text-base pt-3 mt-3 border-t border-border">
            <span>Total</span>
            <span>{formatPrice(totalPrice)}</span>
          </div>
          <button
            onClick={() => navigate("/commande")}
            className="btn-primary w-full mt-5 !py-3"
          >
            Passer la commande
          </button>
        </aside>
      </div>
    </div>
  );
}