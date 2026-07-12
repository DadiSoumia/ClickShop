import express from "express";
import {
  login,
  refresh,
  logout,
  getMe,
  createAdmin,
  changePassword,
} from "../controllers/auth.controller.js";
import { protect, authorize } from "../middlewares/auth.middleware.js";
import { loginLimiter } from "../middlewares/rateLimiter.js";
import {
  validate,
  loginRules,
  createAdminRules,
  changePasswordRules,
} from "../validators/auth.validator.js";

const router = express.Router();


router.post("/login", loginLimiter, loginRules, validate, login);
router.post("/refresh", refresh);
router.post("/logout", logout);

router.get("/me", protect, getMe);
router.patch("/change-password", protect, changePasswordRules, validate, changePassword);


router.post(
  "/create",
  protect,
  authorize("superadmin"),
  createAdminRules,
  validate,
  createAdmin
);

export default router;