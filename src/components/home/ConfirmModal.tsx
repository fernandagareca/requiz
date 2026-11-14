
import { AlertTriangle, Trash2, X } from "lucide-react";
import "./ConfirmModal.css";

interface Props {
  title?: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  title = "¿Estás seguro?",
  message,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <div className="confirm-overlay" onClick={onCancel}>
      <div
        className="confirm-modal"
        onClick={(e) => e.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
      >
        <button
          className="confirm-close"
          onClick={onCancel}
          aria-label="Cerrar"
        >
          <X size={18} />
        </button>

        <div className="confirm-icon">
          <AlertTriangle size={25} />
        </div>

        <h3 id="confirm-title">{title}</h3>

        <p>{message}</p>

        <div className="confirm-actions">
          <button
            className="confirm-cancel"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button
            className="confirm-delete"
            onClick={onConfirm}
          >
            <Trash2 size={16} />
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}
