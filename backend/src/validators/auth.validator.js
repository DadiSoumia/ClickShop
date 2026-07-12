import { body, validationResult } from "express-validator";

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Données invalides.",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

export const loginRules = [
  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères"),
];

export const createAdminRules = [
  body("name").trim().notEmpty().withMessage("Le nom est requis"),
  body("email").isEmail().withMessage("Email invalide").normalizeEmail(),
  body("password")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Le mot de passe doit contenir 8+ caractères, majuscule, minuscule, chiffre et symbole"
    ),
  body("role")
    .optional()
    .isIn(["admin", "superadmin"])
    .withMessage("Rôle invalide"),
];

export const changePasswordRules = [
  body("currentPassword").notEmpty().withMessage("Mot de passe actuel requis"),
  body("newPassword")
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
    .withMessage(
      "Le nouveau mot de passe doit contenir 8+ caractères, majuscule, minuscule, chiffre et symbole"
    ),
];