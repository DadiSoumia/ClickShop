import Admin from "../models/Admin.model.js";
import {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  REFRESH_COOKIE_NAME,
  refreshCookieOptions,
} from "../utils/generateTokens.js";
import jwt from "jsonwebtoken";

// clearCookie ne doit pas recevoir "maxAge" (dépréciation Express) :
// on réutilise les mêmes options (path/domain/secure/sameSite/httpOnly)
// mais sans la durée de vie, puisqu'on ne fait que supprimer le cookie.
const { maxAge, ...clearCookieOptions } = refreshCookieOptions;

export const login = async (req, res, next) => {
  try {
   const { email, password } = req.body;

const admin = await Admin.findOne({
  email: email?.toLowerCase().trim()
}).select("+password +loginAttempts +lockUntil");

    const invalidCredsMessage = "Email ou mot de passe incorrect.";

    if (!admin) {
      return res.status(401).json({ success: false, message: invalidCredsMessage });
    }

    if (admin.isLocked) {
      const minutesLeft = Math.ceil((admin.lockUntil - Date.now()) / 60000);
      return res.status(423).json({
        success: false,
        message: `Compte temporairement verrouillé suite à plusieurs échecs. Réessayez dans ${minutesLeft} min.`,
      });
    }

    if (!admin.isActive) {
      return res.status(403).json({ success: false, message: "Compte désactivé." });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      await admin.registerFailedAttempt();
      return res.status(401).json({ success: false, message: invalidCredsMessage });
    }

    await admin.resetLoginAttempts();

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    admin.refreshTokenHash = hashToken(refreshToken);
    await admin.save({ validateBeforeSave: false });

    res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);

    res.json({
      success: true,
      data: {
        accessToken,
        admin: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ success: false, message: "Session expirée." });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch {
      res.clearCookie(REFRESH_COOKIE_NAME, clearCookieOptions);
      return res.status(401).json({ success: false, message: "Session invalide." });
    }

    const admin = await Admin.findById(decoded.id).select("+refreshTokenHash");

    if (!admin || !admin.isActive || admin.refreshTokenHash !== hashToken(token)) {
      res.clearCookie(REFRESH_COOKIE_NAME, clearCookieOptions);
      return res.status(401).json({ success: false, message: "Session invalide." });
    }

    const newAccessToken = generateAccessToken(admin);
    const newRefreshToken = generateRefreshToken(admin);
    admin.refreshTokenHash = hashToken(newRefreshToken);
    await admin.save({ validateBeforeSave: false });

    res.cookie(REFRESH_COOKIE_NAME, newRefreshToken, refreshCookieOptions);

    res.json({ success: true, data: { accessToken: newAccessToken } });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        await Admin.findByIdAndUpdate(decoded.id, { refreshTokenHash: null });
      } catch {
      
      }
    }

    res.clearCookie(REFRESH_COOKIE_NAME, clearCookieOptions);
    res.json({ success: true, message: "Déconnecté." });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res) => {
  res.json({ success: true, data: req.admin });
};

export const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: "Cet email est déjà utilisé." });
    }

    const admin = await Admin.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      data: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const admin = await Admin.findById(req.admin._id).select("+password");

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Mot de passe actuel incorrect." });
    }

    admin.password = newPassword;
    admin.refreshTokenHash = null; 
    await admin.save();

    res.clearCookie(REFRESH_COOKIE_NAME, clearCookieOptions);
    res.json({ success: true, message: "Mot de passe modifié. Veuillez vous reconnecter." });
  } catch (error) {
    next(error);
  }
};