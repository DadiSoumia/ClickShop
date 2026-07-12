import jwt from "jsonwebtoken";
import crypto from "crypto";

export const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin._id, role: admin.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || "15m" }
  );
};

export const generateRefreshToken = (admin) => {
  return jwt.sign(
    { id: admin._id, tokenVersion: crypto.randomUUID() },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d" }
  );
};

export const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const REFRESH_COOKIE_NAME = "ClickShop_admin_refresh";

export const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/api/admin/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000, 
};