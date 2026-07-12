import express from "express";
import {
  getAdminCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  handleCategoryImageUpload,
} from "../../controllers/admin/category.admin.controller.js";
import { protect, authorize } from "../../middlewares/auth.middleware.js";
import { validate, categoryRules } from "../../validators/category.validator.js";
import { uploadCategoryImage } from "../../middlewares/upload.middleware.js";

const router = express.Router();

router.use(protect, authorize("admin", "superadmin"));
router.post("/upload", uploadCategoryImage, handleCategoryImageUpload);
router.get("/", getAdminCategories);
router.post("/", categoryRules, validate, createCategory);
router.put("/:id", categoryRules, validate, updateCategory);
router.delete("/:id", deleteCategory);

export default router;