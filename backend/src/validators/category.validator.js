import { body, validationResult } from "express-validator";

export const categoryRules = [
  body("name").trim().notEmpty().withMessage("Le nom de la catégorie est requis."),
  body("image").trim().notEmpty().withMessage("L'image est requise."),
];

export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
