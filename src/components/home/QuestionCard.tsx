import { Link } from "react-router-dom";
import { BookOpen, Clock3, Play, Pencil, Trash2 } from "lucide-react";
import type { Quiz } from "../../types";
import "../../pages/Dashboard.css";

interface Props {
  quiz: Quiz;
  correct: number;
  total: number;
  onDelete: (id: string) => void;
}

export const QuestionCard = ({ quiz, correct, total, onDelete }: Props) => {
  const percent = total === 0 ? 0 : Math.round((correct / total) * 100);

  const handleDelete = () => {
    if (confirm(`¿Eliminar "${quiz.title}"?`)) {
      onDelete(quiz.id);
    }
  };

  return (
    <article className="quiz-card">
      <div className="quiz-card-top">
        <span className="quiz-icon">
          <BookOpen size={19} />
        </span>
        <span className="question-count">
          {quiz.questions.length} preguntas
        </span>
      </div>

      <h3>{quiz.title}</h3>

      <p className="quiz-description">
        {quiz.description || "Sin descripción"}
      </p>

      <div className="quiz-meta">
        <Clock3 size={14} />
        Actualizado{" "}
        {new Date(quiz.updatedAt).toLocaleDateString("es-AR")}
      </div>

      {/* Barra de racha */}
      <div className="quiz-progress">
        <div className="quiz-progress-info">
          <span>Mejor Racha: {correct} de {total}</span>
          <span>{percent}%</span>
        </div>
        <div className="quiz-progress-track">
          <div
            className="quiz-progress-bar"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="quiz-actions">
        <Link
          className="button button-primary"
          to={`/practice/${quiz.id}`}
        >
          <Play size={15} />
          Practicar
        </Link>

        <Link
          className="icon-button"
          aria-label="Editar"
          to={`/edit/${quiz.id}`}
        >
          <Pencil size={16} />
        </Link>

        <button
          className="icon-button danger"
          aria-label="Eliminar"
          onClick={handleDelete}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </article>
  );
};