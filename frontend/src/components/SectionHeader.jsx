export default function SectionHeader({ title, subtitle }) {
  return (
    <div className="mb-5 sm:mb-8 text-center">
      <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-ink">{title}</h2>
      {subtitle && <p className="text-ink/60 mt-1.5 sm:mt-2 text-xs sm:text-sm md:text-base">{subtitle}</p>}
    </div>
  );
}