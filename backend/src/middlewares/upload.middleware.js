import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.config.js";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

function createImageUpload(folderName) {
  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `clickshop/${folderName}`, // dossier créé automatiquement sur Cloudinary
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1200, crop: "limit" }], // évite d'uploader des images énormes
    },
  });

  const fileFilter = (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Format d'image non supporté (jpg, png, webp uniquement)."));
    }
  };

  const multerUpload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
  }).single("image");

  return (req, res, next) => {
    multerUpload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        const message =
          err.code === "LIMIT_FILE_SIZE"
            ? "L'image est trop lourde (5 Mo maximum)."
            : "Erreur lors de l'envoi de l'image.";
        return res.status(400).json({ success: false, message });
      }
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      next();
    });
  };
}

export const uploadSingleImage = createImageUpload("products");
export const uploadCategoryImage = createImageUpload("categories");