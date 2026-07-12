import { getDeliveryFee } from "../data/deliveryFees.js";
import Order from "../models/Order.model.js";
import Product from "../models/Product.model.js";

const generateOrderNumber = () => {
  const date = new Date();
  const stamp = `${date.getFullYear().toString().slice(-2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.floor(1000 + Math.random() * 9000);
  return `ClickShop-${stamp}-${random}`;
};

export const createOrder = async (req, res, next) => {
  try {
    const { fullName, phone, email, wilaya, wilayaCode, commune, deliveryType, note, items } = req.body;

    if (!fullName || !phone || !wilayaCode || !commune || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Informations manquantes pour la commande." });
    }

    // Récupère tous les produits concernés en une seule requête
    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const orderItems = [];
    let subtotal = 0;

    for (const { productId, quantity } of items) {
      const product = products.find((p) => p._id.toString() === productId);

      if (!product) {
        return res.status(404).json({ message: `Produit introuvable (${productId}).` });
      }
      if (product.stock < quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour "${product.name}".` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity,
        unitPrice: product.price,
      });
      subtotal += product.price * quantity;
    }

    const DELIVERY_FEE = getDeliveryFee(wilayaCode, deliveryType);
    const total = subtotal + DELIVERY_FEE;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: { fullName, phone, email: email || null },
      wilaya,
      commune,
      deliveryType: deliveryType || "domicile",
      note: note || null,
      items: orderItems,
      deliveryFee: DELIVERY_FEE,
      subtotal,
      total,
    });

    // Décrémente le stock de chaque produit commandé
    for (const { productId, quantity } of items) {
      await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });
    }

    res.status(201).json({ data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "images")
      .sort({ createdAt: -1 });
    res.json({ data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product", "images");
    if (!order) {
      return res.status(404).json({ message: "Commande introuvable." });
    }
    res.json({ data: order });
  } catch (error) {
    next(error);
  }
};