export const formatPrice = (value) => `${value.toLocaleString("fr-FR")} DA`;

export const generateOrderNumber = () => {
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ClickShop-${Date.now().toString().slice(-6)}-${random}`;
};