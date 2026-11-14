import { Link, NavLink } from "react-router-dom";

import {
  BookOpen,
  Plus,
  NotebookTabs,
} from "lucide-react";

import type { Quiz, StudyStats } from "../types";
import "./Dashboard.css";
import { QuestionCard } from "../components/home/QuestionCard";
// Props que recibe el componente
interface Props {
  quizzes: Quiz[];
  stats: StudyStats;
  onDelete: (id: string) => void;
}

export default function Dashboard({ quizzes, stats, onDelete }: Props) {

  return (
    <>
      {/* Bienvenida */}
      <section className="welcome">
        <div>
          <span className="eyebrow ">
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
        
        <div className="section-title">
          <h2 > <NotebookTabs size={22} /> Mis cuestionarios</h2>
          <p>
            {quizzes.length} cuestionario
            {quizzes.length === 1 ? "" : "s"} creado
            {quizzes.length === 1 ? "" : "s"}
          </p>
        </div>
          <div className="section-line"></div>
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
        {quizzes.map((quiz) => {
          const progress = stats.progressByQuiz?.[quiz.id];
          return (
            <QuestionCard
              key={quiz.id}
              quiz={quiz}
              correct={progress?.correct ?? 0}
              total={progress?.total ?? quiz.questions.length}
              onDelete={onDelete}
            />
          );
        })}
        <NavLink to="/create">
          <div className="empty-state">
            <div className="empty-icon">
              <BookOpen size={26} />
            </div>

            <h3>Agregar un nuevo cuestionario</h3>
            <Link className="button button-primary" to="/create">
              <Plus size={17} />
              Crear cuestionario
            </Link>
          </div></NavLink>
        </div>
      )}
    </>
  );
}