import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section
      className="relative bg-ink bg-cover bg-center bg-no-repeat flex items-center"
      style={{ backgroundImage: "url('/hero-bg.jpg')" }}
    >
      {/* Overlay sombre léger — garde le texte lisible peu importe la photo */}
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/50 to-ink/70" />

      <div className="relative z-10 container-page py-16 sm:py-20 md:py-28 text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-xs sm:text-sm font-semibold uppercase tracking-wide3 text-gold mb-3 sm:mb-4"
        >
          Nouvelle sélection
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-3xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] px-2"
        >
          Trouvez ce qui compte,
          <br />
          <span className="text-[#E8825A] drop-shadow-[0_2px_12px_rgba(184,92,56,0.5)]">livré simplement.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 sm:mt-6 text-sm sm:text-lg text-white/80 max-w-md sm:max-w-lg mx-auto px-2 leading-relaxed"
        >
          Technologie, mode et beauté — une sélection simple, sans compte à créer.
        </motion.p>
      </div>
    </section>
  );
}