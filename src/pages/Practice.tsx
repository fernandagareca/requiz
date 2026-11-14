import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Trophy,
  Flame,
  OctagonAlert,
} from "lucide-react";

import type { Quiz, StudyStats } from "../types";
import "./Practice.css";

interface Props {
  quizzes: Quiz[];
  onStats: (update: (current: StudyStats) => StudyStats) => void;
  onSave: (quiz: Quiz) => void;
}

export default function Practice({ quizzes, onStats }: Props) {
  // Obtener ID del cuestionario
  const { id } = useParams();

  // Buscar cuestionario
  const quiz = quizzes.find((item) => item.id === id);

  // Estados de la práctica
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  const [mistakes, setMistakes] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Racha de la sesión
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Verificar si existe el cuestionario
  if (!quiz) {
    return (
      <div className="empty-state">
        <h2>No encontramos ese cuestionario</h2>
        <Link to="/">Volver al inicio</Link>
      </div>
    );
  }

  const currentQuiz = quiz;

  // Reiniciar ronda (conserva el mejor puntaje de la sesión)
  function restart() {
    setIndex(0);
    setAnswer("");
    setFeedback(null);
    setCompleted(false);
    setStreak(0);
    // setBestStreak(0); // NO: se conserva durante la sesión
  }

  // Reiniciar todo (nueva sesión)
  function restartFull() {
    restart();
    setBestStreak(0);
  }

  // Comprobar respuesta
  function check() {
    if (!answer.trim() || feedback) return;

    const question = currentQuiz.questions[index];
    const total = currentQuiz.questions.length;

    const isCorrect =
      question.type === "text"
        ? answer.trim().toLowerCase() ===
          question.correctAnswer.trim().toLowerCase()
        : answer === question.correctAnswer;

    // ACIERTO
    if (isCorrect) {
      setFeedback("correct");

      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak((prev) => Math.max(prev, newStreak));

      const reached = index + 1;
      const isLast = index === total - 1;

      onStats((current) => {
        const prev = current.progressByQuiz[currentQuiz.id];
        const prevCorrect = prev?.correct ?? 0;

        return {
          ...current,
          attempts: current.attempts + 1,
          completed: isLast ? current.completed + 1 : current.completed,
          progressByQuiz: {
            ...current.progressByQuiz,
            [currentQuiz.id]: {
              correct: Math.max(prevCorrect, reached),
              total,
            },
          },
        };
      });

      window.setTimeout(() => {
        if (isLast) {
          setCompleted(true);
        } else {
          setIndex((c) => c + 1);
          setAnswer("");
          setFeedback(null);
        }
      }, 650);

      return;
    }

    // FALLO → reset a 0 (el bestStreak se conserva)
    setFeedback("wrong");
    setMistakes((c) => c + 1);
    setStreak(0);

    onStats((current) => {
      const prev = current.progressByQuiz[currentQuiz.id];
      const prevCorrect = prev?.correct ?? 0;
      const reachedThisRound = index;

      return {
        ...current,
        attempts: current.attempts + 1,
        mistakes: current.mistakes + 1,
        progressByQuiz: {
          ...current.progressByQuiz,
          [currentQuiz.id]: {
            correct: Math.max(prevCorrect, reachedThisRound),
            total,
          },
        },
      };
    });

    window.setTimeout(() => restart(), 1100);
  }

  // Pantalla de finalización
  if (completed) {
    return (
      <div className="completion-card">
        {/* Icono de logro */}
        <div className="completion-icon">
          <Trophy size={32} />
        </div>

        <span className="eyebrow">OBJETIVO ALCANZADO</span>

        <h1>¡Lo lograste!</h1>

        <p>
          Completaste <strong>{quiz.title}</strong> respondiendo todas las
          preguntas correctamente en una misma ronda.
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

          <span>
            <strong>{bestStreak}</strong>
            mejor racha
          </span>
        </div>

        {/* Acciones */}
        <button className="button button-primary" onClick={restartFull}>
          <RotateCcw size={16} />
          Practicar otra vez
        </button>

        <Link className="back-link centered" to="/">
          Volver a mis cuestionarios
        </Link>
      </div>
    );
  }

  // Obtener pregunta actual
  const question = quiz.questions[index];

  // Calcular progreso
  const progress = (index / quiz.questions.length) * 100;

  // Renderizado de la práctica
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
          <Flame size={20} />
          MODO SUPERVIVENCIA
        </span>

        <h1>{quiz.title}</h1>

        <p className="description-text">
          <OctagonAlert size={16} />
          Un error y volvés a empezar desde la primera pregunta.
        </p>
      </div>
       {/* Racha de la sesión */}
      <div className="streak-info">
        <Flame size={14} />
        Mejor racha de la sesión: {bestStreak}
      </div>

      {/* Información del progreso */}
      <div className="progress-info">
        <span>
          Pregunta {index + 1} de {quiz.questions.length}
        </span>

        <span>{Math.round(progress)}% completado</span>
      </div>

      {/* Barra de progreso */}
      <div className="progress-track">
        <div style={{ width: `${progress}%` }} />
      </div>

      {/* Tarjeta de pregunta */}
      <section className={`practice-card ${feedback ?? ""}`}>
        {/* Número de pregunta */}
        <span className="question-number">
          PREGUNTA {String(index + 1).padStart(2, "0")}
        </span>

        {/* Enunciado */}
        <h2>{question.statement}</h2>

        {/* Respuestas */}
        {question.type === "text" ? (
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
          <div className="answer-options">
            {(question.type === "boolean"
              ? ["Verdadero", "Falso"]
              : question.options.filter((o) => o.trim())
            ).map((option, i) => (
              <button
                type="button"
                key={`${option}-${i}`}
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
                <span className="answer-letter">
                  {question.type === "boolean"
                    ? i === 0
                      ? "V"
                      : "F"
                    : String.fromCharCode(65 + i)}
                </span>

                <span className="answer-text">{option}</span>

                {feedback === "correct" && answer === option && (
                  <CheckCircle2 size={18} />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Retroalimentación */}
        {feedback === "wrong" && (
          <div className="feedback wrong-feedback">
            <XCircle size={18} />
            <div>
              <strong>Respuesta incorrecta</strong>
              <span>Volvemos al comienzo del cuestionario...</span>
            </div>
          </div>
        )}

        {feedback === "correct" && (
          <div className="feedback correct-feedback">
            <CheckCircle2 size={18} />
            <strong>¡Correcto!</strong>
          </div>
        )}

        {/* Botón de comprobación */}
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