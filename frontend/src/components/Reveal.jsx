import { motion } from "framer-motion";

/**
 * Fait apparaître son contenu en fondu + léger décalage vertical
 * quand il entre dans la zone visible de l'écran (scroll).
 * Usage : <Reveal><section>...</section></Reveal>
 * Ou avec délai : <Reveal delay={0.15}>...</Reveal>
 */
export default function Reveal({ children, delay = 0, className = "", as = "div" }) {
  const MotionTag = motion[as] || motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}