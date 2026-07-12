// Run once with: node src/seed/seedAdmin.js
import "dotenv/config";
import mongoose from "mongoose";
import Admin from "../models/Admin.model.js";

const run = async () => {
  const { MONGO_URI, ADMIN_SEED_NAME, ADMIN_SEED_EMAIL, ADMIN_SEED_PASSWORD } = process.env;

  if (!ADMIN_SEED_EMAIL || !ADMIN_SEED_PASSWORD) {
    console.error(
      " Définissez ADMIN_SEED_EMAIL et ADMIN_SEED_PASSWORD dans .env avant de lancer ce script."
    );
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);

  const existing = await Admin.findOne({ email: ADMIN_SEED_EMAIL });
  if (existing) {
    console.log("ℹ  Un compte avec cet email existe déjà. Aucune action effectuée.");
    process.exit(0);
  }

  const admin = await Admin.create({
    name: ADMIN_SEED_NAME || "Super Admin",
    email: ADMIN_SEED_EMAIL,
    password: ADMIN_SEED_PASSWORD,
    role: "superadmin",
  });

  console.log(" Superadmin créé avec succès :", admin.email);
  process.exit(0);
};

run().catch((err) => {
  console.error(" Erreur lors du seed :", err);
  process.exit(1);
});