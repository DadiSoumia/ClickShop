import { useEffect, useRef, useState } from "react";
import { FiPlus, FiTrash2, FiX, FiUploadCloud, FiImage } from "react-icons/fi";
import {
  fetchAdminCategories,
  createAdminCategory,
  deleteAdminCategory,
  uploadCategoryImage,
  getImageUrl,
} from "../../services/api.js";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const loadCategories = () => {
    setLoading(true);
    fetchAdminCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => setError("Impossible de charger les catégories."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openModal = () => {
    setName("");
    setImage("");
    setError("");
    setModalOpen(true);
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const res = await uploadCategoryImage(file);
      setImage(res.data.data.url);
    } catch (err) {
      setError(err.response?.data?.message || "Échec de l'envoi de l'image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!image) {
      setError("Veuillez ajouter une image pour la catégorie.");
      return;
    }

    setSaving(true);
    try {
      await createAdminCategory({ name, image });
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category) => {
    if (!confirm(`Supprimer la catégorie "${category.name}" ?`)) return;
    try {
      await deleteAdminCategory(category._id);
      loadCategories();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">Catégories</h1>
        <button onClick={openModal} className="btn-primary">
          <FiPlus /> Ajouter une catégorie
        </button>
      </div>

      {loading ? (
        <p className="text-ink/50">Chargement...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="group relative rounded-2xl overflow-hidden border border-border bg-white"
            >
              <div className="aspect-square overflow-hidden">
                <img src={getImageUrl(cat.image)} alt={cat.name} className="h-full w-full object-cover" />
              </div>
              <div className="p-3">
                <p className="font-semibold text-ink text-sm line-clamp-1">{cat.name}</p>
                <p className="text-xs text-ink/40">{cat.slug}</p>
              </div>
              <button
                onClick={() => handleDelete(cat)}
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition hover:bg-red-50"
                aria-label="Supprimer"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="col-span-full text-center text-ink/50 py-8">
              Aucune catégorie pour l'instant.
            </p>
          )}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40">
          <div className="bg-white rounded-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-lg font-bold text-ink">Ajouter une catégorie</h2>
              <button onClick={() => setModalOpen(false)} className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-surface">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-ink mb-1.5 block">Image *</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer border-2 border-dashed border-border rounded-xl p-4 flex items-center gap-4 hover:border-primary/50 hover:bg-surface/50 transition"
                >
                  <div className="h-14 w-14 rounded-lg bg-surface flex items-center justify-center overflow-hidden shrink-0">
                    {image ? (
                      <img src={getImageUrl(image)} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <FiImage className="text-ink/30" size={20} />
                    )}
                  </div>
                  <span className="text-sm text-ink/70 font-medium flex items-center gap-1.5">
                    <FiUploadCloud size={14} />
                    {uploading ? "Envoi en cours..." : "Choisir une image"}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-ink mb-1.5 block">Nom de la catégorie *</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="input-field"
                  placeholder="Ex : Technologie"
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={saving || uploading}
                className="btn-primary w-full !py-3 disabled:opacity-60"
              >
                {saving ? "Création..." : "Créer la catégorie"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}