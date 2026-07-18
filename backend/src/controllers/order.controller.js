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

    const productIds = items.map((i) => i.productId);
    const products = await Product.find({ _id: { $in: productIds } });

    const orderItems = [];
    let subtotal = 0;

    for (const { productId, quantity, colorName } of items) {
      const product = products.find((p) => p._id.toString() === productId);

      if (!product) {
        return res.status(404).json({ message: `Produit introuvable (${productId}).` });
      }

      // Si le produit a des couleurs, on vérifie le stock DE LA COULEUR choisie, pas le stock global
      let availableStock = product.stock;
      let matchedColor = null;

      if (product.colors?.length > 0) {
        matchedColor = product.colors.find((c) => c.name === colorName);
        if (!matchedColor) {
          return res.status(400).json({
            message: `Merci de préciser une couleur valide pour "${product.name}".`,
          });
        }
        availableStock = matchedColor.stock;
      }

      if (availableStock < quantity) {
        return res.status(400).json({ message: `Stock insuffisant pour "${product.name}".` });
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        colorName: matchedColor ? matchedColor.name : null,
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

    // Décrémente le stock : celui de la couleur précise ET le stock global en même temps
    for (const { productId, quantity, colorName } of items) {
      const product = products.find((p) => p._id.toString() === productId);

      if (product.colors?.length > 0 && colorName) {
        await Product.updateOne(
          { _id: productId, "colors.name": colorName },
          {
            $inc: {
              "colors.$[c].stock": -quantity,
              stock: -quantity,
            },
          },
          { arrayFilters: [{ "c.name": colorName }] }
        );
      } else {
        await Product.findByIdAndUpdate(productId, { $inc: { stock: -quantity } });
      }
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