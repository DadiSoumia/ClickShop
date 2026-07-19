import Category from "../../models/Category.model.js";
import Product from "../../models/Product.model.js";

export const handleCategoryImageUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Aucune image reçue." });
  }
  // Avec Cloudinary, req.file.path contient déjà l'URL complète et permanente
  const url = req.file.path;
  res.status(201).json({ success: true, data: { url } });
};

export const getAdminCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ data: categories });
  } catch (error) {
    next(error);
  }
};


export const createCategory = async (req, res, next) => {
  try {
    const category = await Category.create(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Une catégorie avec ce nom existe déjà.",
      });
    }
    next(error);
  }
};


export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return res.status(404).json({ success: false, message: "Catégorie introuvable" });
    }
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Catégorie introuvable" });
    }

    const isUsed = await Product.exists({ category: category.name });
    if (isUsed) {
      return res.status(400).json({
        success: false,
        message: "Impossible de supprimer : des produits utilisent encore cette catégorie.",
      });
    }

    await category.deleteOne();
    res.json({ success: true, message: "Catégorie supprimée avec succès" });
  } catch (error) {
    next(error);
  }
};