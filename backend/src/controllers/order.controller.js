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
    const { fullName, phone, email, wilaya, wilayaCode, commune, deliveryType, note, productId, quantity } = req.body;

    if (!fullName || !phone || !wilayaCode || !commune || !productId || !quantity) {
      return res.status(400).json({ message: "Informations manquantes pour la commande." });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable." });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Stock insuffisant pour ce produit." });
    }

    const DELIVERY_FEE = getDeliveryFee(wilayaCode, deliveryType);
    const subtotal = product.price * quantity;
    const total = subtotal + DELIVERY_FEE;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      customer: { fullName, phone, email: email || null },
      wilaya,
      commune,
      deliveryType: deliveryType || "domicile",
      note: note || null,
      items: [
        {
          product: product._id,
          name: product.name,
          quantity,
          unitPrice: product.price,
        },
      ],
      deliveryFee: DELIVERY_FEE,
      subtotal,
      total,
    });

    product.stock -= quantity;
    await product.save();

    res.status(201).json({ data: order });
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ data: orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Commande introuvable." });
    }
    res.json({ data: order });
  } catch (error) {
    next(error);
  }
};