import Order from "../../models/Order.model.js";

const VALID_STATUSES = ["en_attente", "confirmee", "livree", "retoure"];

// GET /api/admin/orders?status=&search=&page=&limit=
export const getAdminOrders = async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && VALID_STATUSES.includes(status)) filter.status = status;

    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customer.fullName": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("items.product", "images")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/orders/:id
export const getAdminOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.product", "name images");
    if (!order) {
      return res.status(404).json({ success: false, message: "Commande introuvable" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/orders/:id/status
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Statut invalide. Valeurs autorisées : ${VALID_STATUSES.join(", ")}`,
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Commande introuvable" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/admin/orders/:id/delivery — modifier les infos client/livraison
export const updateOrderDelivery = async (req, res, next) => {
  try {
    const { fullName, phone, email, wilaya, commune, deliveryType, deliveryFee, note } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Commande introuvable" });
    }

    if (fullName !== undefined) order.customer.fullName = fullName;
    if (phone !== undefined) order.customer.phone = phone;
    if (email !== undefined) order.customer.email = email || null;
    if (wilaya !== undefined) order.wilaya = wilaya;
    if (commune !== undefined) order.commune = commune;
    if (deliveryType !== undefined) {
      if (!["domicile", "bureau"].includes(deliveryType)) {
        return res.status(400).json({ success: false, message: "Mode de livraison invalide." });
      }
      order.deliveryType = deliveryType;
    }
    if (note !== undefined) order.note = note || null;

    if (deliveryFee !== undefined) {
      const fee = Number(deliveryFee);
      if (Number.isNaN(fee) || fee < 0) {
        return res.status(400).json({ success: false, message: "Frais de livraison invalide." });
      }
      order.deliveryFee = fee;
      order.total = order.subtotal + fee; // recalcul automatique du total
    }

    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/orders/:id
export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Commande introuvable" });
    }
    res.json({ success: true, message: "Commande supprimée avec succès" });
  } catch (error) {
    next(error);
  }
};

// GET /api/admin/orders/stats/summary — petit résumé utile pour le dashboard
export const getOrdersSummary = async (req, res, next) => {
  try {
    const [counts, revenueAgg] = await Promise.all([
      Order.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { status: { $ne: "retoure" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

    const byStatus = counts.reduce((acc, c) => ({ ...acc, [c._id]: c.count }), {});

    res.json({
      success: true,
      data: {
        byStatus,
        totalOrders: counts.reduce((sum, c) => sum + c.count, 0),
        totalRevenue: revenueAgg[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};