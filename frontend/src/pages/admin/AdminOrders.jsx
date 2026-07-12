import { useEffect, useState } from "react";
import { FiEdit2, FiX } from "react-icons/fi";
import { fetchAdminOrders, updateOrderStatus, updateOrderDelivery } from "../../services/api.js";

const formatPrice = (v) => `${v.toLocaleString("fr-FR")} DA`;

const STATUS_OPTIONS = [
  { value: "en_attente", label: "En attente" },
  { value: "confirmee", label: "Confirmée" },
  { value: "livree", label: "Livrée" },
  { value: "retoure", label: "Retournée" },
];

const statusColor = {
  en_attente: "bg-yellow-100 text-yellow-700",
  confirmee: "bg-green-100 text-blue-700",
  livree: "bg-blue-100 text-green-700",
  retoure: "bg-red-100 text-red-700",
};

const emptyEditForm = {
  fullName: "",
  phone: "",
  email: "",
  wilaya: "",
  commune: "",
  deliveryType: "domicile",
  deliveryFee: "",
  note: "",
};

const StatusSelect = ({ order, onChange }) => (
  <select
    value={order.status}
    onChange={(e) => onChange(order._id, e.target.value)}
    className={`text-xs font-semibold px-3 py-1.5 rounded-full border-0 ${statusColor[order.status]}`}
  >
    {STATUS_OPTIONS.map((s) => (
      <option key={s.value} value={s.value}>
        {s.label}
      </option>
    ))}
  </select>
);

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = () => {
    setLoading(true);
    fetchAdminOrders()
      .then((res) => setOrders(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, status } : o)));
    try {
      await updateOrderStatus(id, status);
    } catch {
      alert("Erreur lors de la mise à jour du statut.");
      loadOrders();
    }
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setEditForm({
      fullName: order.customer?.fullName || "",
      phone: order.customer?.phone || "",
      email: order.customer?.email || "",
      wilaya: order.wilaya || "",
      commune: order.commune || "",
      deliveryType: order.deliveryType || "domicile",
      deliveryFee: order.deliveryFee ?? "",
      note: order.note || "",
    });
    setError("");
  };

  const handleEditChange = (field) => (e) =>
    setEditForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSaveDelivery = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const res = await updateOrderDelivery(editingOrder._id, {
        fullName: editForm.fullName,
        phone: editForm.phone,
        email: editForm.email || null,
        wilaya: editForm.wilaya,
        commune: editForm.commune,
        deliveryType: editForm.deliveryType,
        deliveryFee: Number(editForm.deliveryFee),
        note: editForm.note || null,
      });
      setOrders((prev) => prev.map((o) => (o._id === editingOrder._id ? res.data.data : o)));
      setEditingOrder(null);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'enregistrement.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-display text-xl sm:text-2xl font-bold text-ink mb-6">Commandes</h1>

      {loading ? (
        <p className="text-ink/50">Chargement...</p>
      ) : (
        <>
        
          <div className="md:hidden space-y-3">
            {orders.map((order) => (
              <div key={order._id} className="bg-white border border-border rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="font-display font-bold text-ink text-sm">{order.orderNumber}</p>
                    <p className="text-xs text-ink/50">
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <button
                    onClick={() => openEditModal(order)}
                    className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-surface text-ink/70 shrink-0"
                    aria-label="Modifier la livraison"
                  >
                    <FiEdit2 size={15} />
                  </button>
                </div>

                <p className="text-sm text-ink font-medium">{order.customer?.fullName}</p>
                <p className="text-xs text-ink/60">{order.customer?.phone}</p>
                <p className="text-xs text-ink/60 mt-1">{order.commune}, {order.wilaya}</p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="font-bold text-ink">{formatPrice(order.total)}</span>
                  <StatusSelect order={order} onChange={handleStatusChange} />
                </div>
              </div>
            ))}
            {orders.length === 0 && (
              <p className="text-center text-ink/50 py-12">Aucune commande pour l'instant.</p>
            )}
            </div>
            
          <div className="hidden md:block bg-white border border-border rounded-2xl overflow-hidden overflow-x-auto">
            <table className="w-full text-sm min-w-[820px]">
              <thead className="bg-surface text-ink/70 text-left">
                <tr>
                  <th className="p-4">Commande</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Livraison</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-border align-top">
                    <td className="p-4">
                      <p className="font-display font-bold text-ink">{order.orderNumber}</p>
                      <p className="text-xs text-ink/50">
                        {new Date(order.createdAt).toLocaleString("fr-FR")}
                      </p>
                      <p className="text-xs text-ink/50 mt-1">
                        {order.items?.length || 0} article{(order.items?.length || 0) > 1 ? "s" : ""}
                      </p>
                    </td>
                    <td className="p-4">
                      <p className="text-ink font-medium">{order.customer?.fullName}</p>
                      <p className="text-ink/70 text-xs">{order.customer?.phone}</p>
                      {order.customer?.email && (
                        <p className="text-ink/50 text-xs">{order.customer.email}</p>
                      )}
                    </td>
                    <td className="p-4">
                      <p className="text-ink">{order.commune}, {order.wilaya}</p>
                      <p className="text-ink/50 text-xs capitalize">{order.deliveryType}</p>
                      <p className="text-ink/50 text-xs">Frais : {formatPrice(order.deliveryFee)}</p>
                    </td>
                    <td className="p-4 font-bold text-ink">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <StatusSelect order={order} onChange={handleStatusChange} />
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => openEditModal(order)}
                        className="h-9 w-9 inline-flex items-center justify-center rounded-full hover:bg-surface text-ink/70"
                        aria-label="Modifier la livraison"
                        title="Modifier la livraison"
                      >
                        <FiEdit2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-ink/50">
                      Aucune commande pour l'instant.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div>
                <h2 className="font-display text-lg font-bold text-ink">Modifier la livraison</h2>
                <p className="text-xs text-ink/50">{editingOrder.orderNumber}</p>
              </div>
              <button
                onClick={() => setEditingOrder(null)}
                className="h-9 w-9 flex items-center justify-center rounded-full hover:bg-surface"
              >
                <FiX size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDelivery} className="p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-ink mb-1.5 block">Nom du client *</label>
                <input value={editForm.fullName} onChange={handleEditChange("fullName")} required className="input-field" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-ink mb-1.5 block">Téléphone *</label>
                  <input value={editForm.phone} onChange={handleEditChange("phone")} required className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink mb-1.5 block">Email</label>
                  <input type="email" value={editForm.email} onChange={handleEditChange("email")} className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-ink mb-1.5 block">Wilaya *</label>
                  <input value={editForm.wilaya} onChange={handleEditChange("wilaya")} required className="input-field" />
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink mb-1.5 block">Commune *</label>
                  <input value={editForm.commune} onChange={handleEditChange("commune")} required className="input-field" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-ink mb-1.5 block">Mode de livraison *</label>
                  <select value={editForm.deliveryType} onChange={handleEditChange("deliveryType")} className="input-field">
                    <option value="domicile">Livraison à domicile</option>
                    <option value="bureau">Retrait au bureau</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-ink mb-1.5 block">Frais de livraison (DA) *</label>
                  <input
                    type="number"
                    value={editForm.deliveryFee}
                    onChange={handleEditChange("deliveryFee")}
                    required
                    min="0"
                    className="input-field"
                  />
                  <p className="text-xs text-ink/40 mt-1">Le total de la commande sera recalculé.</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-ink mb-1.5 block">Remarque</label>
                <textarea value={editForm.note} onChange={handleEditChange("note")} rows={2} className="input-field resize-none" />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button type="submit" disabled={saving} className="btn-primary w-full !py-3 disabled:opacity-60">
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}