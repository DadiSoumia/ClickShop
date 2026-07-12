import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
  };

  return (
    <section className="bg-surface">
      <div className="container-page py-8 sm:py-12 md:py-16 text-center">
        <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-ink">
          Restez informé de nos nouveautés
        </h2>
        <form onSubmit={handleSubmit} className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="Votre adresse email"
            className="input-field"
          />
          <button type="submit" className="btn-primary shrink-0">
            {sent ? "Envoyé ✓" : "S'inscrire"}
          </button>
        </form>
      </div>
    </section>
  );
}