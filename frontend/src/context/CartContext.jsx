import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "clickshop_cart";

// Un article de panier est identifié par SA COMBINAISON produit + couleur.
// "Chemise - Rouge" et "Chemise - Bleu" sont deux lignes distinctes.
const sameItem = (item, productId, colorName) =>
  item.productId === productId && (item.colorName || null) === (colorName || null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  // Ajoute un produit (avec une couleur optionnelle) ; si la même combinaison
  // produit+couleur existe déjà, augmente simplement la quantité.
  const addToCart = (product, quantity = 1, colorName = null) => {
    const matchedColor = colorName ? product.colors?.find((c) => c.name === colorName) : null;
    const availableStock = matchedColor ? matchedColor.stock : product.stock;
    const image = matchedColor?.images?.[0] || product.images?.[0] || "";

    setCart((prev) => {
      const existing = prev.find((item) => sameItem(item, product._id, colorName));
      if (existing) {
        return prev.map((item) =>
          sameItem(item, product._id, colorName)
            ? { ...item, quantity: Math.min(item.quantity + quantity, availableStock) }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product._id,
          colorName: colorName || null,
          name: product.name,
          image,
          price: product.price,
          oldPrice: product.oldPrice || null,
          stock: availableStock,
          quantity: Math.min(quantity, availableStock),
        },
      ];
    });
  };

  const removeFromCart = (productId, colorName = null) => {
    setCart((prev) => prev.filter((item) => !sameItem(item, productId, colorName)));
  };

  const updateQuantity = (productId, colorName, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        sameItem(item, productId, colorName)
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const isInCart = (productId, colorName = null) =>
    cart.some((item) => sameItem(item, productId, colorName));

  const getCartQuantity = (productId, colorName = null) =>
    cart.find((item) => sameItem(item, productId, colorName))?.quantity || 0;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        isInCart,
        getCartQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);