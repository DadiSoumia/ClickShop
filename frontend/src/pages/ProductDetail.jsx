import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiMinus, FiPlus, FiShoppingCart } from "react-icons/fi";
import BackButton from "../components/BackButton.jsx";
import Skeleton from "../components/Skeleton.jsx";
import { fetchProductById, getImageUrl } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";

const formatPrice = (value) => `${value.toLocaleString("fr-FR")} DA`;

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, removeFromCart, isInCart } = useCart();
  const [product, setProduct] = useState(undefined);
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    fetchProductById(id)
      .then((res) => setProduct(res.data.data))
      .catch(() => setProduct(null));
  }, [id]);

 if (product === undefined) {
  return (
    <div className="container-page py-5 sm:py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-5 sm:gap-8 md:gap-10">
        <Skeleton className="aspect-square rounded-xl sm:rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-32 mt-2" />
          <Skeleton className="h-4 w-full mt-4" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-12 w-full sm:w-48 rounded-full mt-6" />
        </div>
      </div>
    </div>
  );
}

  if (!product) {
    return (
      <div className="container-page py-16 sm:py-24 text-center">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-ink">Produit introuvable</h1>
        <Link to="/produits" className="btn-primary mt-5 sm:mt-6 inline-flex text-sm">
          Retour aux produits
        </Link>
      </div>
    );
  }

  const hasPromo = product.oldPrice && product.oldPrice > product.price;
  const outOfStock = product.stock <= 0;
  const inCart = isInCart(product._id);

  const handleBuyNow = () => {
    navigate(`/commande/${product._id}`, { state: { quantity } });
  };

  const handleToggleCart = () => {
    if (inCart) {
      removeFromCart(product._id);
      return;
    }
    addToCart(product, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="container-page py-5 sm:py-8 md:py-12">
      <BackButton />
      <div className="grid md:grid-cols-2 gap-5 sm:gap-8 md:gap-10">
        <div className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden border border-border">
          <img src={getImageUrl(product.images[0])} alt={product.name} className="h-full w-full object-cover" />
        </div>

        <div>
          <span className="text-[11px] sm:text-xs font-bold uppercase text-primary">{product.category}</span>
          <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-ink mt-1.5 sm:mt-2 leading-snug">
            {product.name}
          </h1>

          <div className="flex items-baseline gap-2 sm:gap-3 mt-3 sm:mt-4 flex-wrap">
            <span className="text-lg sm:text-2xl font-bold text-ink">{formatPrice(product.price)}</span>
            {hasPromo && (
              <span className="text-sm sm:text-lg text-ink/40 line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>

          <p className="text-sm sm:text-base text-ink/70 mt-3 sm:mt-4 leading-relaxed">{product.description}</p>

          <p className={`mt-3 sm:mt-4 text-xs sm:text-sm font-semibold ${outOfStock ? "text-red-500" : "text-primary"}`}>
            {outOfStock ? "Rupture de stock" : `En stock — ${product.stock} unités disponibles`}
          </p>

          <div className="flex items-center gap-3 sm:gap-4 mt-5 sm:mt-6">
            <span className="text-sm font-semibold text-ink">Quantité</span>
            <div className="inline-flex items-center border border-border rounded-full">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center"
                aria-label="Diminuer"
              >
                <FiMinus size={13} />
              </button>
              <span className="w-8 text-center font-semibold text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center"
                aria-label="Augmenter"
              >
                <FiPlus size={13} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8">
            <button
              onClick={handleToggleCart}
              disabled={outOfStock && !inCart}
              className={`inline-flex items-center justify-center gap-2 rounded-full !py-3 sm:!py-3.5 px-6 text-sm sm:text-base font-semibold disabled:opacity-40 disabled:pointer-events-none ${
                inCart ? "border border-primary bg-primary/10 text-primary" : "border border-border text-ink hover:bg-surface"
              }`}
            >
              <FiShoppingCart size={16} />
              {justAdded ? "Ajouté ✓" : inCart ? "Retirer du panier" : "Ajouter au panier"}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={outOfStock}
              className="btn-primary !py-3 sm:!py-3.5 text-sm sm:text-base disabled:opacity-40 disabled:pointer-events-none"
            >
              Acheter maintenant
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}