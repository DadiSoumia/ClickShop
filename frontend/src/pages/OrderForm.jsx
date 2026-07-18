import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { FiMinus, FiPlus } from "react-icons/fi";
import BackButton from "../components/BackButton.jsx";
import { fetchProductById, submitOrder, getImageUrl } from "../services/api.js";
import { WILAYAS, COMMUNES_BY_WILAYA } from "../data/algeriaLocations.js";
import { getDeliveryFee } from "../data/deliveryFees.js";
import { useCart } from "../context/CartContext.jsx";

const formatPrice = (value) => `${value.toLocaleString("fr-FR")} DA`;

export default function OrderForm() {
  const { id } = useParams(); // présent = achat direct d'un seul produit ; absent = checkout du panier
  const { state } = useLocation();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  // "checkoutItems" unifie les deux flux : [{ productId, colorName, name, image, price, stock, quantity }]
  const [checkoutItems, setCheckoutItems] = useState(id ? undefined : cart);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    wilayaCode: "",
    commune: "",
    deliveryType: "domicile",
    note: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Achat direct : on charge le produit unique demandé, avec sa couleur choisie s'il y en a une
  useEffect(() => {
    if (!id) return;
    fetchProductById(id)
      .then((res) => {
        const product = res.data.data;
        const colorName = state?.colorName || null;
        const matchedColor = colorName ? product.colors?.find((c) => c.name === colorName) : null;

        setCheckoutItems([
          {
            productId: product._id,
            colorName,
            name: product.name,
            image: matchedColor?.images?.[0] || product.images?.[0] || "",
            price: product.price,
            stock: matchedColor ? matchedColor.stock : product.stock,
            quantity: state?.quantity || 1,
          },
        ]);
      })
      .catch(() => setCheckoutItems(null));
  }, [id]);

  // Checkout panier : le stock mis en cache dans le panier peut être périmé
  // (un autre client a pu acheter entre-temps) → on revérifie le stock réel,
  // en tenant compte de la couleur choisie pour chaque article.
  useEffect(() => {
    if (id) return;
    if (cart.length === 0) return;

    Promise.all(
      cart.map((item) =>
        fetchProductById(item.productId)
          .then((res) => res.data.data)
          .catch(() => null)
      )
    ).then((products) => {
      setCheckoutItems(
        cart.map((item, i) => {
          const product = products[i];
          if (!product) return item; // produit introuvable : on garde tel quel, le serveur validera
          const matchedColor = item.colorName
            ? product.colors?.find((c) => c.name === item.colorName)
            : null;
          const freshStock = matchedColor ? matchedColor.stock : product.stock;
          return {
            ...item,
            price: product.price,
            stock: freshStock,
            quantity: Math.min(item.quantity, freshStock),
          };
        })
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Panier vide et pas d'achat direct → rien à commander
  if (!id && cart.length === 0) {
    return (
      <div className="container-page py-16 sm:py-24 text-center">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-ink">Votre panier est vide</h1>
        <Link to="/produits" className="btn-primary mt-6 inline-flex text-sm">
          Voir les produits
        </Link>
      </div>
    );
  }

  if (checkoutItems === undefined) {
    return <p className="container-page py-24 text-center text-ink/50">Chargement...</p>;
  }

  if (checkoutItems === null) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-ink">Produit introuvable</h1>
        <Link to="/produits" className="btn-primary mt-6 inline-flex">
          Retour aux produits
        </Link>
      </div>
    );
  }

  // Identifie un article par produit + couleur, comme dans le panier
  const setItemQuantity = (productId, colorName, quantity) => {
    setCheckoutItems((prev) =>
      prev.map((item) =>
        item.productId === productId && item.colorName === colorName
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock || 99)) }
          : item
      )
    );
  };

  const deliveryFee = form.wilayaCode ? getDeliveryFee(form.wilayaCode, form.deliveryType) : null;
  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal + (deliveryFee || 0);

  const communesDisponibles = form.wilayaCode
    ? COMMUNES_BY_WILAYA[form.wilayaCode] || []
    : [];

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleWilayaChange = (e) => {
    const wilayaCode = e.target.value;
    setForm((f) => ({ ...f, wilayaCode, commune: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 3)
      e.fullName = "Merci d'indiquer votre nom complet.";
    if (!/^0[5-7][0-9]{8}$/.test(form.phone.replace(/\s/g, "")))
      e.phone = "Numéro de téléphone invalide (ex : 0555123456).";
    if (!form.wilayaCode) e.wilayaCode = "Merci de sélectionner votre wilaya.";
    if (!form.commune) e.commune = "Merci de sélectionner votre commune.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);

    const wilaya = WILAYAS.find((w) => w.code === form.wilayaCode);

    try {
      const res = await submitOrder({
        fullName: form.fullName,
        phone: form.phone,
        wilaya: wilaya?.name || "",
        wilayaCode: form.wilayaCode,
        commune: form.commune,
        deliveryType: form.deliveryType,
        note: form.note || null,
        items: checkoutItems.map((item) => ({
          productId: item.productId,
          colorName: item.colorName || null,
          quantity: item.quantity,
        })),
      });

      const order = res.data.data;

      // Achat panier → on vide le panier après succès. Achat direct → rien à vider.
      if (!id) clearCart();

      navigate("/confirmation", {
        state: {
          orderNumber: order.orderNumber,
          items: checkoutItems,
          total: order.total,
        },
      });
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || "Une erreur est survenue. Merci de réessayer." });
      setSubmitting(false);
    }
  };

  return (
    <div className="container-page py-12">
      <BackButton />
      <h1 className="font-display text-3xl font-bold text-ink mb-8">Finaliser la commande</h1>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-[1fr_340px] gap-10">
        {/* Formulaire */}
        <div className="space-y-5 order-2 lg:order-1">
          <div>
            <label className="text-sm font-semibold text-ink mb-1.5 block">Nom complet *</label>
            <input
              value={form.fullName}
              onChange={handleChange("fullName")}
              type="text"
              placeholder="Ex : Amine Belkacem"
              className="input-field"
            />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="text-sm font-semibold text-ink mb-1.5 block">Téléphone *</label>
            <input
              value={form.phone}
              onChange={handleChange("phone")}
              type="tel"
              placeholder="0555123456"
              className="input-field"
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-ink mb-1.5 block">Wilaya *</label>
              <select value={form.wilayaCode} onChange={handleWilayaChange} className="input-field">
                <option value="">Sélectionnez votre wilaya</option>
                {WILAYAS.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.code} - {w.name}
                  </option>
                ))}
              </select>
              {errors.wilayaCode && <p className="text-xs text-red-500 mt-1">{errors.wilayaCode}</p>}
            </div>

            <div>
              <label className="text-sm font-semibold text-ink mb-1.5 block">Commune *</label>
              <select
                value={form.commune}
                onChange={handleChange("commune")}
                disabled={!form.wilayaCode}
                className="input-field disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="">
                  {form.wilayaCode ? "Sélectionnez votre commune" : "Choisissez une wilaya d'abord"}
                </option>
                {communesDisponibles.map((commune) => (
                  <option key={commune} value={commune}>
                    {commune}
                  </option>
                ))}
              </select>
              {errors.commune && <p className="text-xs text-red-500 mt-1">{errors.commune}</p>}
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-ink mb-1.5 block">Mode de livraison *</label>
            <select
              value={form.deliveryType}
              onChange={handleChange("deliveryType")}
              className="input-field"
            >
              <option value="domicile">Livraison à domicile</option>
              <option value="bureau">Retrait au bureau</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-ink mb-1.5 block">Remarque (optionnelle)</label>
            <textarea
              value={form.note}
              onChange={handleChange("note")}
              rows={2}
              placeholder="Précisions pour la livraison (rue, repère...)"
              className="input-field resize-none"
            />
          </div>

          {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto !py-3.5 disabled:opacity-60">
            {submitting ? "Envoi en cours..." : "Confirmer la commande"}
          </button>
        </div>

        {/* Résumé — liste tous les articles (1 ou plusieurs), avec leur couleur */}
        <aside className="h-fit rounded-2xl border border-border bg-surface p-6 order-1 lg:order-2">
          <h2 className="font-display text-lg font-semibold text-ink mb-4">Résumé de la commande</h2>

          <div className="space-y-3">
            {checkoutItems.map((item) => (
              <div key={`${item.productId}-${item.colorName || "default"}`} className="flex gap-3">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="h-16 w-16 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-ink line-clamp-1">{item.name}</p>
                  {item.colorName && (
                    <p className="text-xs text-ink/50 mt-0.5">Couleur : {item.colorName}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      type="button"
                      onClick={() => setItemQuantity(item.productId, item.colorName, item.quantity - 1)}
                      className="h-6 w-6 flex items-center justify-center rounded-full border border-border"
                    >
                      <FiMinus size={10} />
                    </button>
                    <span className="text-xs text-ink/60 w-4 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => setItemQuantity(item.productId, item.colorName, item.quantity + 1)}
                      className="h-6 w-6 flex items-center justify-center rounded-full border border-border"
                    >
                      <FiPlus size={10} />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-ink mt-1">{formatPrice(item.price)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-4 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-ink/70">
              <span>Sous-total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink/70">
              <span>Livraison ({form.deliveryType === "domicile" ? "domicile" : "bureau"})</span>
              <span>{deliveryFee !== null ? formatPrice(deliveryFee) : "Choisir une wilaya"}</span>
            </div>
            <div className="flex justify-between font-bold text-ink text-base pt-2 border-t border-border">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}