
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trophy,
} from "lucide-react";

import type { Quiz, StudyStats } from "../types";

// ----------------------------------
// Props
// ----------------------------------

interface Props {
  quizzes: Quiz[];
  onStats: (update: (current: StudyStats) => StudyStats) => void;
}

// ----------------------------------
// Componente principal
// ----------------------------------

export default function Practice({ quizzes, onStats }: Props) {

  // Obtener ID del cuestionario
  const { id } = useParams();

  // Buscar cuestionario
  const quiz = quizzes.find((item) => item.id === id);

  // ----------------------------------
  // Estados de la práctica
  // ----------------------------------

  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const [feedback, setFeedback] = useState<
    "correct" | "wrong" | null
  >(null);

  const [mistakes, setMistakes] = useState(0);
  const [completed, setCompleted] = useState(false);

  // ----------------------------------
  // Verificar si existe el cuestionario
  // ----------------------------------

  if (!quiz) {
    return (
      <div className="empty-state">
        <h2>No encontramos ese cuestionario</h2>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }
  const currentQuiz = quiz;
  // ----------------------------------
  // Reiniciar cuestionario
  // ----------------------------------

  function restart() {
    setIndex(0);
    setAnswer("");
    setFeedback(null);
    setCompleted(false);
  }

  // ----------------------------------
  // Comprobar respuesta
  // ----------------------------------

  function check() {

    // Evitar respuestas vacías o repetidas
    if (!answer.trim() || feedback) {
      return;
    }

    const question = currentQuiz.questions[index];

    // Comparar respuesta del usuario con la correcta
    const correct =
      question.type === "text"
        ? answer.trim().toLocaleLowerCase() ===
          question.correctAnswer.trim().toLocaleLowerCase()
        : answer === question.correctAnswer;

    // ----------------------------------
    // Respuesta correcta
    // ----------------------------------

    if (correct) {

      setFeedback("correct");

      window.setTimeout(() => {

        // Si es la última pregunta, finalizar
        if (index === currentQuiz.questions.length - 1) {

          setCompleted(true);

          onStats((current) => ({
            ...current,
            completed: current.completed + 1,
          }));

        } else {

          // Pasar a la siguiente pregunta
          setIndex((current) => current + 1);
          setAnswer("");
          setFeedback(null);

        }

      }, 650);

    } else {

      // ----------------------------------
      // Respuesta incorrecta
      // ----------------------------------

      setFeedback("wrong");

      setMistakes((current) => current + 1);

      // Actualizar estadísticas
      onStats((current) => ({
        ...current,
        mistakes: current.mistakes + 1,
        attempts: current.attempts + 1,
      }));

      // Volver al inicio después de mostrar el error
      window.setTimeout(() => restart(), 1100);
    }
  }

  // ----------------------------------
  // Pantalla de finalización
  // ----------------------------------

  if (completed) {
    return (
      <div className="completion-card">

        {/* Icono de logro */}
        <div className="completion-icon">
          <Trophy size={32} />
        </div>

        <span className="eyebrow">
          OBJETIVO ALCANZADO
        </span>

        <h1>¡Lo lograste!</h1>

        <p>
          Completaste <strong>{quiz.title}</strong> respondiendo
          todas las preguntas correctamente en una misma ronda.
        </p>

        {/* Estadísticas de la sesión */}
        <div className="result-stats">

          <span>
            <strong>{quiz.questions.length}</strong>
            preguntas
          </span>

          <span>
            <strong>{mistakes}</strong>
            errores
          </span>

        </div>

        {/* Acciones */}
        <button
          className="button button-primary"
          onClick={restart}
        >
          <RotateCcw size={16} />
          Practicar otra vez
        </button>

        <Link
          className="back-link centered"
          to="/"
        >
          Volver a mis cuestionarios
        </Link>

      </div>
    );
  }

  // ----------------------------------
  // Obtener pregunta actual
  // ----------------------------------

  const question = quiz.questions[index];

  // Calcular progreso
  const progress = (index / quiz.questions.length) * 100;

  // ----------------------------------
  // Renderizado de la práctica
  // ----------------------------------

  return (
    <div className="practice-wrap">

      {/* Volver al inicio */}
      <Link className="back-link" to="/">
        <ArrowLeft size={16} />
        Salir de la práctica
      </Link>

      {/* Encabezado */}
      <div className="practice-heading">

        <span className="eyebrow">
          MODO PRÁCTICA
        </span>

        <h1>{quiz.title}</h1>

        <p>
          Un error y volvés a empezar desde la primera pregunta.
        </p>

      </div>

      {/* Información del progreso */}
      <div className="progress-info">

        <span>
          Pregunta {index + 1} de {quiz.questions.length}
        </span>

        <span>
          {Math.round(progress)}% completado
        </span>

      </div>

      {/* Barra de progreso */}
      <div className="progress-track">
        <div
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Tarjeta de pregunta */}
      <section className={`practice-card ${feedback ?? ""}`}>

        {/* Número de pregunta */}
        <span className="question-number">
          PREGUNTA {String(index + 1).padStart(2, "0")}
        </span>

        {/* Enunciado */}
        <h2>{question.statement}</h2>

        {/* ----------------------------------
            Respuestas
        ---------------------------------- */}

        {question.type === "text" ? (

          // Respuesta escrita
          <input
            className="answer-input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                check();
              }
            }}
            placeholder="Escribí tu respuesta..."
            disabled={!!feedback}
          />

        ) : (

          // Opción múltiple o verdadero/falso
          <div className="answer-options">

            {(
              question.type === "boolean"
                ? ["Verdadero", "Falso"]
                : question.options.filter((o) => o.trim())
            ).map((option) => (

              <button
                type="button"
                key={option}
                disabled={!!feedback}
                className={`
                  answer-option
                  ${answer === option ? "selected" : ""}
                  ${
                    feedback && option === question.correctAnswer
                      ? "is-correct"
                      : ""
                  }
                `}
                onClick={() => setAnswer(option)}
              >

                {option}

                {feedback === "correct" && answer === option ? (
                  <CheckCircle2 size={18} />
                ) : null}

              </button>

            ))}

          </div>
        )}

        {/* ----------------------------------
            Retroalimentación
        ---------------------------------- */}

        {feedback === "wrong" && (
          <div className="feedback wrong-feedback">

            <XCircle size={18} />

            <div>
              <strong>Respuesta incorrecta</strong>

              <span>
                Volvemos al comienzo del cuestionario...
              </span>
            </div>

          </div>
        )}

        {feedback === "correct" && (
          <div className="feedback correct-feedback">

            <CheckCircle2 size={18} />

            <strong>¡Correcto!</strong>

          </div>
        )}

        {/* ----------------------------------
            Botón de comprobación
        ---------------------------------- */}

        <button
          className="button button-primary check-button"
          disabled={!answer.trim() || !!feedback}
          onClick={check}
        >
          Comprobar respuesta
        </button>

      </section>

      {/* Errores de la sesión */}
      <div className="practice-footnote">

        <RotateCcw size={14} />

        Errores en esta sesión: {mistakes}

      </div>

    </div>
  );
}
