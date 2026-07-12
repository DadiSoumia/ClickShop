import express from "express";
import {
  getAdminOrders,
  getAdminOrderById,
  updateOrderStatus,
  updateOrderDelivery,
  getOrdersSummary,
} from "../../controllers/admin/order.admin.controller.js";
import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { body } from "express-validator";
import { validate } from "../../validators/product.validator.js";

const router = express.Router();

router.use(protect, authorize("admin", "superadmin"));

router.get("/", getAdminOrders);
router.get("/stats/summary", getOrdersSummary);
router.get("/:id", getAdminOrderById);
router.patch(
  "/:id/status",
  body("status").notEmpty().withMessage("Le statut est requis"),
  validate,
  updateOrderStatus
);
router.patch("/:id/delivery", updateOrderDelivery);

export default router;