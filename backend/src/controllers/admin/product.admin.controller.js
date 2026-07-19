import Product from "../../models/Product.model.js";

export const handleImageUpload = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Aucune image reçue." });
  }
  // Avec Cloudinary, req.file.path contient déjà l'URL complète et permanente
  const url = req.file.path;
  res.status(201).json({ success: true, data: { url } });
};

export const getAdminProducts = async (req, res, next) => {
  try {
    const { category, search, visibility, lowStock } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };
    if (visibility === "visible") filter.isVisible = true;
    if (visibility === "masque") filter.isVisible = false;
    if (lowStock === "true") filter.stock = { $lte: 5 };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ data: products });
  } catch (error) {
    next(error);
  }
};

export const getAdminProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Produit introuvable" });
    }
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};


export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) {
      return res.status(404).json({ success: false, message: "Produit introuvable" });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const toggleVisibility = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Produit introuvable" });
    }
    product.isVisible = !product.isVisible;
    await product.save();
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Produit introuvable" });
    }
    res.json({ success: true, message: "Produit supprimé avec succès" });
  } catch (error) {
    next(error);
  }
};