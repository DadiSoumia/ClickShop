import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

export default function BackButton({ label = "Retour" }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-primary transition-colors mb-6"
    >
      <FiArrowLeft size={16} />
      {label}
    </button>
  );
}