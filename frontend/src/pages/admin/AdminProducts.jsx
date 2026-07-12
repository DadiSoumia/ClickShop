import { useEffect, useRef, useState } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiUploadCloud, FiImage } from "react-icons/fi";
import {
  fetchAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  uploadProductImage,
  fetchCategories,
  getImageUrl,
} from "../../services/api.js";

const formatPrice = (v) => `${Number(v).toLocaleString("fr-FR")} DA`;

const emptyForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
  description: "",
  image: "",
  isPromo: false,
  oldPrice: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const loadProducts = () => {
    setLoading(true);
    fetchAdminProducts()
      .then((res) => setProducts(res.data.data))
      .catch(() => setError("Impossible de charger les produits."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
    fetchCategories()
      .then((res) => setCategories(res.data.data))
      .catch(() => setCategories([]));
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    const hasPromo = !!(product.oldPrice && product.oldPrice > product.price);
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
      image: product.images?.[0] || "",
      isPromo: hasPromo,
      oldPrice: hasPromo ? product.oldPrice : "",
    });
    setError("");
    setModalOpen(true);
  };

  const handleChange = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleTogglePromo = (e) => {
    const checked = e.target.checked;
    setForm((f) => ({ ...f, isPromo: checked, oldPrice: checked ? f.oldPrice : "" }));
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const res = await uploadProductImage(file);
      setForm((f) => ({ ...f, image: res.data.data.url }));
    } catch (err) {
      setError(err.response?.data?.message || "Échec de l'envoi de l'image.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.image) {
      setError("Veuillez ajouter une image du produit.");
      return;
    }

    if (form.isPromo) {
      const priceNum = Number(form.price);
      const oldPriceNum = Number(form.oldPrice);
      if (!form.oldPrice || oldPriceNum <= priceNum) {
        setError(
          "Pour une promotion, le prix normal doit être supérieur au prix promo affiché."
        );
        return;
      }
    }

    setSaving(true);

    const payload = {
      name: form.name,
      category: form.category.toLowerCase().trim(),
      price: Number(form.price),
      oldPrice: form.isPromo ? Number(form.oldPrice) : null,
      stock: Number(form.stock),
      description: form.description,
      images: [form.image],
    };

    try {
      if (editingId) {
        await updateAdminProduct(editingId, payload);
      } else {
        await createAdminProduct(payload);
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce produit définitivement ?")) return;
    try {
      await deleteAdminProduct(id);
      loadProducts();
    } catch {
      alert("Erreur lors de la suppression.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-3">
        <h1 className="font-display text-xl sm:text-2xl font-bold text-ink">Produits</h1>
        <button onClick={openCreateModal} className="btn-primary !px-3 sm:!px-5 shrink-0">
          <FiPlus /> <span className="hidden sm:inline">Ajouter un produit</span>
        </button>
      </div>

      {loading ? (
        <p className="text-ink/50">Chargement...</p>
      ) : (
        <>
         
          <div className="md:hidden space-y-3">
            {products.map((p) => {
              const hasPromo = p.oldPrice && p.oldPrice > p.price;
              return (
                <div key={p._id} className="bg-white border border-border rounded-2xl p-4 flex gap-3">
                  <img
                    src={getImageUrl(p.images?.[0])}
                    alt=""
                    className="h-16 w-16 rounded-lg object-cover bg-surface shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink line-clamp-1">{p.name}</p>
                    <p className="text-xs text-ink/50 capitalize">{p.category}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-semibold text-ink text-sm">{formatPrice(p.price)}</span>
                      {hasPromo && (
                        <span className="text-xs text-ink/40 line-through">{formatPrice(p.oldPrice)}</span>
                      )}
                    </div>
                    <p className={`text-xs mt-1 ${p.stock <= 0 ? "text-red-500 font-semibold" : "text-ink/50"}`}>
                      Stock : {p.stock}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(p)}
                      className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-surface text-ink/70"
                      aria-label="Modifier"
                    >
                      <FiEdit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-red-50 text-red-500"
                      aria-label="Supprimer"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
            {products.length === 0 && (
              <p className="text-center text-ink/50 py-12">Aucun produit pour l'instant.</p>
            )}
          </div>

          <div className="hidden md:block bg-white border border-border rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface text-ink/70 text-left">
                <tr>
                  <th className="p-4">Produit</th>
                  <th className="p-4">Catégorie</th>
                  <th className="p-4">Prix</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const hasPromo = p.oldPrice && p.oldPrice > p.price;
                  return (
                    <tr key={p._id} className="border-t border-border">
                      <td className="p-4 flex items-center gap-3">
                        <img src={getImageUrl(p.images?.[0])} alt="" className="h-10 w-10 rounded-lg object-cover bg-surface" />
                        <span className="font-semibold text-ink line-clamp-1">{p.name}</span>
                      </td>
                      <td className="p-4 capitalize text-ink/70">{p.category}</td>
                      <td className="p-4 text-ink">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold">{formatPrice(p.price)}</span>
                          {hasPromo && (
                            <span className="text-xs text-ink/40 line-through">{formatPrice(p.oldPrice)}</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={p.stock <= 0 ? "text-red-500 font-semibold" : "text-ink/70"}>
                          {p.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-surface text-ink/70"
                            aria-label="Modifier"
                          >
                            <FiEdit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(p._id)}
                            className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-red-50 text-red-500"
                            aria-label="Supprimer"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-ink/50">
                      Aucun produit pour l'instant.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-lg font-bold text-ink">
                {editingId ? "Modifier le produit" : "Ajouter un produit"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-surface">
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
             
              <div>
                <label className="text-sm font-semibold text-ink mb-1.5 block">Image du produit *</label>
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
                  <div className="h-16 w-16 rounded-lg bg-surface flex items-center justify-center overflow-hidden shrink-0">
                    {form.image ? (
                      <img src={getImageUrl(form.image)} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <FiImage className="text-ink/30" size={22} />
                    )}
                  </div>
                  <div className="text-sm">
                    {uploading ? (
                      <span className="text-primary font-medium">Envoi en cours...</span>
                    ) : form.image ? (
                      <span className="text-ink/70 font-medium flex items-center gap-1.5">
                        <FiUploadCloud size={14} /> Cliquez pour changer l'image
                      </span>
                    ) : (
                      <span className="text-ink/70 font-medium flex items-center gap-1.5">
                        <FiUploadCloud size={14} /> Cliquez pour choisir une image
                      </span>
                    )}
                    <p className="text-ink/40 text-xs mt-0.5">JPG, PNG ou WEBP — 5 Mo max</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-ink mb-1.5 block">Nom *</label>
                <input value={form.name} onChange={handleChange("name")} required className="input-field" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-ink mb-1.5 block">Catégorie *</label>
                  <select
                    value={form.category}
                    onChange={handleChange("category")}
                    required
                    className="input-field"
                  >
                    <option value="">Sélectionner...</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <p className="text-xs text-ink/40 mt-1">
                      Aucune catégorie — créez-en une dans l'onglet Catégories.
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink mb-1.5 block">Stock *</label>
                  <input type="number" value={form.stock} onChange={handleChange("stock")} required min="0" className="input-field" />
                </div>
              </div>

              <div className="rounded-xl border border-border p-4 space-y-3 bg-surface/40">
                <div>
                  <label className="text-sm font-semibold text-ink mb-1.5 block">
                    {form.isPromo ? "Prix promo (affiché aux clients) *" : "Prix (DA) *"}
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={handleChange("price")}
                    required
                    min="0"
                    className="input-field"
                  />
                </div>

                <label className="flex items-center gap-2 text-sm font-medium text-ink cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isPromo}
                    onChange={handleTogglePromo}
                    className="h-4 w-4 rounded accent-primary"
                  />
                  Mettre ce produit en promotion
                </label>

                {form.isPromo && (
                  <div>
                    <label className="text-sm font-semibold text-ink mb-1.5 block">
                      Prix normal (affiché barré) *
                    </label>
                    <input
                      type="number"
                      value={form.oldPrice}
                      onChange={handleChange("oldPrice")}
                      required
                      min="0"
                      className="input-field"
                      placeholder="Doit être supérieur au prix promo"
                    />
                  </div>
                )}

                {form.price && (
                  <div className="pt-2 border-t border-border flex items-baseline gap-2">
                    <span className="text-xs text-ink/50 mr-1">Aperçu client :</span>
                    <span className="font-bold text-ink">{formatPrice(form.price)}</span>
                    {form.isPromo && form.oldPrice && (
                      <span className="text-sm text-ink/40 line-through">{formatPrice(form.oldPrice)}</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm font-semibold text-ink mb-1.5 block">Description</label>
                <textarea value={form.description} onChange={handleChange("description")} rows={3} className="input-field resize-none" />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={saving || uploading}
                className="btn-primary w-full !py-3 disabled:opacity-60"
              >
                {saving ? "Enregistrement..." : editingId ? "Enregistrer les modifications" : "Créer le produit"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}