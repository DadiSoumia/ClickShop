import { FiTruck, FiShield, FiHeadphones } from "react-icons/fi";
import SectionHeader from "./SectionHeader.jsx";

const points = [
  { icon: FiTruck, title: "Livraison rapide", text: "Expédition vers toutes les wilayas." },
  { icon: FiShield, title: "Achat sécurisé", text: "Vos informations sont protégées." },
  { icon: FiHeadphones, title: "Support réactif", text: "Une équipe à votre écoute." },
];

export default function WhyUs() {
  return (
    <section className="container-page py-8 sm:py-12 md:py-16">
      <SectionHeader title="Pourquoi nous choisir" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
        {points.map((p) => (
          <div key={p.title} className="rounded-2xl bg-surface p-5 sm:p-6 text-center">
            <div className="h-11 w-11 sm:h-12 sm:w-12 mx-auto rounded-full bg-primary/15 text-primary flex items-center justify-center">
              <p.icon size={20} />
            </div>
            <h3 className="font-display font-semibold text-ink mt-3 sm:mt-4">{p.title}</h3>
            <p className="text-sm text-ink/60 mt-1.5">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}