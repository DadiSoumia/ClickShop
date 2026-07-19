/**
 * Script de migration : corrige les URLs d'images enregistrées en dur
 * (ex: http://192.168.100.4:5000/uploads/...) pour les transformer
 * en chemins relatifs (/uploads/...).
 *
 * À exécuter UNE SEULE FOIS, en local, connecté à ta vraie base MongoDB (Atlas).
 *
 * Utilisation :
 *   1. Place ce fichier à la racine de ton dossier backend
 *   2. Assure-toi que le package "dotenv" est installé (npm install dotenv si besoin)
 *   3. Lance : node fix-image-urls.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Product from "./src/models/Product.model.js";
import Category from "./src/models/Category.model.js";

dotenv.config();

// Regex qui capture n'importe quelle URL locale du style http://IP:PORT ou http://localhost:PORT
const LOCAL_URL_REGEX = /^https?:\/\/(192\.168\.\d+\.\d+|localhost|127\.0\.0\.1)(:\d+)?/;

function toRelativePath(url) {
  if (!url || typeof url !== "string") return url;
  if (!LOCAL_URL_REGEX.test(url)) return url; // déjà relatif ou une vraie URL externe (Cloudinary etc.)
  return url.replace(LOCAL_URL_REGEX, "");
}

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connecté à MongoDB");

  // --- Produits ---
  const products = await Product.find({});
  let updatedProducts = 0;

  for (const product of products) {
    let changed = false;

    if (Array.isArray(product.images)) {
      const newImages = product.images.map((img) => {
        const fixed = toRelativePath(img);
        if (fixed !== img) changed = true;
        return fixed;
      });
      product.images = newImages;
    }

    // Si jamais tu as aussi un champ "colors[].image" ou similaire, décommente et adapte :
    // if (Array.isArray(product.colors)) {
    //   product.colors = product.colors.map((c) => {
    //     if (c.image) {
    //       const fixed = toRelativePath(c.image);
    //       if (fixed !== c.image) changed = true;
    //       c.image = fixed;
    //     }
    //     return c;
    //   });
    // }

    if (changed) {
      await product.save();
      updatedProducts++;
      console.log(`✔ Produit corrigé : ${product.name}`);
    }
  }

  // --- Catégories ---
  const categories = await Category.find({});
  let updatedCategories = 0;

  for (const category of categories) {
    if (category.image) {
      const fixed = toRelativePath(category.image);
      if (fixed !== category.image) {
        category.image = fixed;
        await category.save();
        updatedCategories++;
        console.log(`✔ Catégorie corrigée : ${category.name}`);
      }
    }
  }

  console.log("\n--- Résumé ---");
  console.log(`Produits corrigés   : ${updatedProducts}`);
  console.log(`Catégories corrigées: ${updatedCategories}`);

  await mongoose.disconnect();
  console.log("Terminé, connexion fermée.");
}

run().catch((err) => {
  console.error("Erreur pendant la migration :", err);
  process.exit(1);
});