import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { loginAdmin } from "../../services/api.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await loginAdmin(form);
      const { accessToken, admin } = res.data.data;
      login(accessToken, admin);
      navigate("/admin/produits");
    } catch (err) {
      const message = err.response?.data?.message || "Email ou mot de passe incorrect.";
      setError(message);
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-border rounded-2xl p-8">
        <h1 className="font-display text-2xl font-bold text-ink mb-1">Espace admin</h1>
        <p className="text-sm text-ink/60 mb-6">Connectez-vous pour gérer votre boutique.</p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold text-ink mb-1.5 block">Email</label>
           <input
  type="email"
  required
  value={form.email}
  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value.toLowerCase() }))}
  autoCapitalize="none"
  autoCorrect="off"
  autoComplete="email"
  spellCheck="false"
  className="input-field"
  placeholder="admin@lumo-shop.dz"
/>
          </div>
          <div>
            <label className="text-sm font-semibold text-ink mb-1.5 block">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className="input-field pr-10"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70 transition"
                tabIndex={-1}
                aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button type="submit" disabled={submitting} className="btn-primary w-full !py-3 disabled:opacity-60">
            {submitting ? "Connexion..." : "Se connecter"}
          </button>
        </div>
      </form>
    </div>
  );
}