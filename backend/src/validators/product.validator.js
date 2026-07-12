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

export const productRules = [
  body("name").trim().notEmpty().withMessage("Le nom du produit est requis"),
  body("category").trim().notEmpty().withMessage("La catégorie est requise"),
  body("price").isFloat({ min: 0 }).withMessage("Le prix doit être un nombre positif"),
  body("oldPrice")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("L'ancien prix doit être un nombre positif"),
  body("stock").isInt({ min: 0 }).withMessage("Le stock doit être un entier positif"),
  body("images").optional().isArray().withMessage("Les images doivent être une liste d'URLs"),
];