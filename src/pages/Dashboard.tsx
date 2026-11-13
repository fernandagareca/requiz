import { Link } from "react-router-dom";

import {
  BookOpen,
  Plus,
  Play,
  Pencil,
  Trash2,
  Clock3,
} from "lucide-react";

import type { Quiz } from "../types";

// Props que recibe el componente
interface Props {
  quizzes: Quiz[];
  onDelete: (id: string) => void;
}

export default function Dashboard({ quizzes, onDelete }: Props) {
  return (
    <>
      {/* Bienvenida */}
      <section className="welcome">
        <div>
          <span className="eyebrow">
            TU ESPACIO DE APRENDIZAJE
          </span>

          <h1>
            Convertí el estudio en{" "}
            <span className="pink">progreso.</span>
          </h1>

          <p>
            Creá tus propios cuestionarios y practicá hasta
            responder todo correctamente.
          </p>
        </div>

        <div className="welcome-decoration">
          R<span>.</span>
        </div>
      </section>

      {/* Encabezado de cuestionarios */}
      <div className="section-heading">
        <div>
          <h2>Mis cuestionarios</h2>

          <p>
            {quizzes.length} cuestionario
            {quizzes.length === 1 ? "" : "s"} creado
            {quizzes.length === 1 ? "" : "s"}
          </p>
        </div>

        <Link className="button button-primary" to="/create">
          <Plus size={17} />
          Nuevo cuestionario
        </Link>
      </div>

      {/* Si no hay cuestionarios */}
      {quizzes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <BookOpen size={26} />
          </div>

          <h3>Tu biblioteca está vacía</h3>

          <p>
            Creá tu primer cuestionario para empezar a practicar.
          </p>

          <Link className="button button-primary" to="/create">
            <Plus size={17} />
            Crear cuestionario
          </Link>
        </div>
      ) : (
        /* Si existen cuestionarios, mostramos sus tarjetas */
        <div className="quiz-grid">
          {quizzes.map((quiz) => (
            <article className="quiz-card" key={quiz.id}>

              {/* Icono y cantidad de preguntas */}
              <div className="quiz-card-top">
                <span className="quiz-icon">
                  <BookOpen size={19} />
                </span>

                <span className="question-count">
                  {quiz.questions.length} preguntas
                </span>
              </div>

              {/* Información del cuestionario */}
              <h3>{quiz.title}</h3>

              <p className="quiz-description">
                {quiz.description || "Sin descripción"}
              </p>

              {/* Fecha de actualización */}
              <div className="quiz-meta">
                <Clock3 size={14} />

                Actualizado{" "}
                {new Date(quiz.updatedAt).toLocaleDateString("es-AR")}
              </div>

              {/* Acciones */}
              <div className="quiz-actions">

                {/* Practicar */}
                <Link
                  className="button button-primary"
                  to={`/practice/${quiz.id}`}
                >
                  <Play size={15} />
                  Practicar
                </Link>

                {/* Editar */}
                <Link
                  className="icon-button"
                  aria-label="Editar"
                  to={`/edit/${quiz.id}`}
                >
                  <Pencil size={16} />
                </Link>

                {/* Eliminar */}
                <button
                  className="icon-button danger"
                  aria-label="Eliminar"
                  onClick={() => {
                    if (confirm(`¿Eliminar "${quiz.title}"?`)) {
                      onDelete(quiz.id);
                    }
                  }}
                >
                  <Trash2 size={16} />
                </button>

              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}