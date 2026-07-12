import Product from "../models/Product.model.js";

export const getProducts = async (req, res, next) => {
  try {
    const { category, search } = req.query;
    const filter = { isVisible: true };

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ data: products });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isVisible: true });
    if (!product) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
};