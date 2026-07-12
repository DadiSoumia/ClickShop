import express from "express";
import authRoutes from "../auth.routes.js";
import productAdminRoutes from "./product.routes.js";
import orderAdminRoutes from "./order.routes.js";
import categoryAdminRoutes from "./category.routes.js";
import { adminApiLimiter } from "../../middlewares/rateLimiter.js";

const router = express.Router();

router.use(adminApiLimiter);
router.use("/auth", authRoutes);
router.use("/products", productAdminRoutes);
router.use("/orders", orderAdminRoutes);
router.use("/categories", categoryAdminRoutes);

export default router;