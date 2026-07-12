import express from "express";
import {
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  toggleVisibility,
  deleteProduct,
  handleImageUpload,
} from "../../controllers/admin/product.admin.controller.js";
import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate, productRules } from "../../validators/product.validator.js";
import { uploadSingleImage } from "../../middlewares/upload.middleware.js";

const router = express.Router();

router.use(protect, authorize("admin", "superadmin"));
router.post("/upload", uploadSingleImage, handleImageUpload);
router.get("/", getAdminProducts);
router.get("/:id", getAdminProductById);
router.post("/", productRules, validate, createProduct);
router.put("/:id", productRules, validate, updateProduct);
router.patch("/:id/visibility", toggleVisibility);
router.delete("/:id", deleteProduct);

export default router;