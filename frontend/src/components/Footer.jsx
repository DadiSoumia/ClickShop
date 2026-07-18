import { useState } from "react";
import { Link } from "react-router-dom";
import { FiInstagram, FiFacebook, FiMail, FiArrowRight, FiCheck } from "react-icons/fi";

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    // Pas de backend de newsletter pour l'instant — retour visuel simple.
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="bg-ink text-white">
      {/* Newsletter */}
      

      {/* Colonnes de liens */}
      <div className="container-page py-12 sm:py-16 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
        <div className="col-span-2 sm:col-span-1">
          <Link to="/" className="font-display text-2xl font-bold text-white">
            ClickShop<span className="text-primary">.</span>
          </Link>
          <p className="mt-3 text-sm text-white/60 max-w-xs leading-relaxed">
            Votre boutique en ligne pour la technologie, la mode et la beauté.
          </p>
          <div className="flex gap-2.5 mt-5">
            <a
              href="https://www.facebook.com/clickshopdz16"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-all duration-300 hover:scale-105"
            >
              <FiFacebook size={15} />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-primary transition-all duration-300 hover:scale-105"
            >
              <FiInstagram size={15} />
            </a>
          </div>
        </div>


       

       
      </div>

      <div className="border-t border-white/10">
        <p className="container-page py-5 text-xs text-white/50 text-center">
          © {year} ClickShop. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}