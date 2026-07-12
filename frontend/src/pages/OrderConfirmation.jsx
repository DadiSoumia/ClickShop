import { Link, useLocation, Navigate } from "react-router-dom";
import { FiCheckCircle, FiHome } from "react-icons/fi";
import { formatPrice } from "../utils/format.js";

export default function OrderConfirmation() {
  const { state } = useLocation();

  if (!state?.orderNumber) return <Navigate to="/" replace />;

  const { orderNumber, items = [], total } = state;

  return (
    <div className="container-page py-16 md:py-24">
      <div className="max-w-lg mx-auto text-center">
        <div className="mx-auto h-20 w-20 rounded-full bg-primary/15 flex items-center justify-center">
          <FiCheckCircle className="text-primary" size={40} />
        </div>

        <h1 className="font-display text-3xl font-bold text-ink mt-6">
          Merci pour votre commande !
        </h1>
        <p className="text-ink/60 mt-3">
          Votre commande a bien été enregistrée. Notre équipe vous contactera
          prochainement pour confirmer la livraison.
        </p>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ink/60">Numéro de commande</span>
            <span className="font-display font-bold text-ink">{orderNumber}</span>
          </div>

          <div className="mt-4 pt-4 border-t border-border space-y-2">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm text-ink/70">
                <span className="line-clamp-1 pr-3">
                  {item.name} × {item.quantity}
                </span>
                <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border flex justify-between font-bold text-ink">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <Link to="/" className="btn-primary mt-8 inline-flex">
          <FiHome /> Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}