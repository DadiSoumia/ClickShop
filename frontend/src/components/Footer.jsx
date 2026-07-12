import { Link } from "react-router-dom";
import { FiInstagram, FiFacebook } from "react-icons/fi";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface border-t border-border">
      <div className="container-page py-12 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-8">
       
        <div>
          <Link to="/" className="font-display text-2xl font-bold text-ink">
            ClickShop<span className="text-primary">.</span>
          </Link>
          <p className="mt-3 text-sm text-ink/70 max-w-xs">
            Votre boutique en ligne pour la technologie, la mode, et la beauté.
          </p>
        </div>

      
        <div className="text-center sm:text-left">
          <h4 className="font-display font-semibold text-ink mb-3">Suivez-nous</h4>
          <div className="flex gap-3 justify-center sm:justify-start">
            <a href="#" className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-border hover:bg-primary hover:text-white transition-colors">
              <FiInstagram size={16} />
            </a>
            <a href="https://www.facebook.com/clickshopdz16" className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-border hover:bg-primary hover:text-white transition-colors">
              <FiFacebook size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <p className="container-page py-4 text-xs text-ink/60 text-center">
          © {year} ClickShop. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}