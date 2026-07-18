import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // ex: "Rouge"
    hex: { type: String, default: "#000000" },
    images: { type: [String], default: [] }, // vide = utilise les images générales du produit
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, lowercase: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: null },
    stock: { type: Number, required: true, default: 0, min: 0 },
    description: { type: String, default: "" },
    images: { type: [String], default: [] },
    colors: { type: [colorSchema], default: [] }, // vide = produit sans variante de couleur
    isVisible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);