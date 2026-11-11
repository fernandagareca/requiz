
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import type { Question, QuestionType, Quiz } from "../types";
interface Props {
  quizzes?: Quiz[];
  onSave: (quiz: Quiz) => void;
}

// ----------------------------------
// Crear una pregunta vacía
// ----------------------------------

const newQuestion = (): Question => ({
  id: crypto.randomUUID(),
  statement: "",
  type: "multiple",
  options: ["", ""],
  correctAnswer: "",
});

// ----------------------------------
// Componente principal
// ----------------------------------

export default function QuizEditor({ quizzes = [], onSave }: Props) {

  // Navegación y parámetros
  const { id } = useParams();
  const navigate = useNavigate();

  // Buscar cuestionario existente
  const existing = quizzes.find((quiz) => quiz.id === id);

  // Estados del formulario
  const [title, setTitle] = useState(existing?.title ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");

  const [questions, setQuestions] = useState<Question[]>(
    existing?.questions ?? [newQuestion()]
  );

  // ----------------------------------
  // Verificar si existe el cuestionario
  // ----------------------------------

  useEffect(() => {
    if (id && !existing) {
      navigate("/");
    }
  }, [id, existing, navigate]);

  // ----------------------------------
  // Actualizar una pregunta
  // ----------------------------------

  function updateQuestion(index: number, patch: Partial<Question>) {
    setQuestions((current) =>
      current.map((question, i) =>
        i === index
          ? { ...question, ...patch }
          : question
      )
    );
  }

  // ----------------------------------
  // Cambiar el tipo de pregunta
  // ----------------------------------

  function changeType(index: number, type: QuestionType) {
    updateQuestion(index, {
      type,

      options:
        type === "multiple"
          ? ["", ""]
          : type === "boolean"
            ? ["Verdadero", "Falso"]
            : [],

      correctAnswer: "",
    });
  }

  // ----------------------------------
  // Guardar cuestionario
  // ----------------------------------

  function submit(event: React.FormEvent) {
    event.preventDefault();

    // Validar preguntas
    const valid = questions.every(
      (q) =>
        q.statement.trim() &&
        q.correctAnswer.trim() &&
        (
          q.type !== "multiple" ||
          q.options.filter((o) => o.trim()).length >= 2
        )
    );

    if (!valid) {
      alert(
        "Completá cada pregunta, su respuesta correcta y al menos dos opciones cuando corresponda."
      );
      return;
    }

    // Fecha de actualización
    const now = new Date().toISOString();

    // Crear objeto del cuestionario
    onSave({
      id: existing?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      questions,

      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
  }

  // ----------------------------------
  // Renderizado
  // ----------------------------------

  return (
    <>
      {/* Volver al inicio */}
      <Link className="back-link" to="/">
        <ArrowLeft size={16} />
        Volver
      </Link>

      {/* Encabezado */}
      <div className="form-heading">
        <span className="eyebrow">BIBLIOTECA</span>

        <h1>
          {existing ? "Editar cuestionario" : "Crear cuestionario"}
        </h1>

        <p>
          Organizá las preguntas y definí cuál es la respuesta correcta.
        </p>
      </div>

      {/* Formulario */}
      <form className="editor-form" onSubmit={submit}>

        {/* Información general */}
        <section className="panel">
          <h2>Información general</h2>

          <label>
            Título

            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Sistemas operativos"
            />
          </label>

          <label>
            Descripción <span className="muted">(opcional)</span>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="¿Qué temas incluye este cuestionario?"
              rows={3}
            />
          </label>
        </section>

        {/* Encabezado de preguntas */}
        <div className="section-heading compact">

          <div>
            <h2>Preguntas</h2>

            <p>
              {questions.length} pregunta
              {questions.length === 1 ? "" : "s"}
            </p>
          </div>

          <button
            type="button"
            className="button button-secondary"
            onClick={() =>
              setQuestions((current) => [
                ...current,
                newQuestion(),
              ])
            }
          >
            <Plus size={16} />
            Agregar pregunta
          </button>

        </div>

        {/* Lista de preguntas */}
        {questions.map((q, index) => (
          <section
            className="panel question-editor"
            key={q.id}
          >

            {/* Título y botón eliminar */}
            <div className="question-editor-title">

              <h3>Pregunta {index + 1}</h3>

              <button
                type="button"
                className="icon-button danger"
                aria-label="Eliminar pregunta"
                disabled={questions.length === 1}
                onClick={() =>
                  setQuestions((current) =>
                    current.filter((item) => item.id !== q.id)
                  )
                }
              >
                <Trash2 size={16} />
              </button>

            </div>

            {/* Enunciado */}
            <label>
              Enunciado

              <textarea
                required
                rows={2}
                value={q.statement}
                onChange={(e) =>
                  updateQuestion(index, {
                    statement: e.target.value,
                  })
                }
                placeholder="Escribí tu pregunta..."
              />
            </label>

            {/* Tipo de respuesta */}
            <label>
              Tipo de respuesta

              <select
                value={q.type}
                onChange={(e) =>
                  changeType(index, e.target.value as QuestionType)
                }
              >
                <option value="multiple">Opción múltiple</option>
                <option value="boolean">Verdadero / Falso</option>
                <option value="text">Respuesta escrita</option>
              </select>
            </label>

            {/* Opciones de respuesta múltiple */}
            {q.type === "multiple" && (
              <div className="option-list">

                <span className="field-label">Opciones</span>

                {q.options.map((option, optionIndex) => (
                  <div className="option-row" key={optionIndex}>

                    <input
                      aria-label={`Opción ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) =>
                        updateQuestion(index, {
                          options: q.options.map((o, i) =>
                            i === optionIndex
                              ? e.target.value
                              : o
                          ),
                        })
                      }
                      placeholder={`Opción ${optionIndex + 1}`}
                    />

                    <button
                      type="button"
                      className="text-button"
                      disabled={q.options.length <= 2}
                      onClick={() =>
                        updateQuestion(index, {
                          options: q.options.filter(
                            (_, i) => i !== optionIndex
                          ),

                          correctAnswer:
                            q.correctAnswer === option
                              ? ""
                              : q.correctAnswer,
                        })
                      }
                    >
                      Quitar
                    </button>

                  </div>
                ))}

                <button
                  type="button"
                  className="text-button add-option"
                  onClick={() =>
                    updateQuestion(index, {
                      options: [...q.options, ""],
                    })
                  }
                >
                  + Agregar opción
                </button>

              </div>
            )}

            {/* Ayuda para verdadero / falso */}
            {q.type === "boolean" && (
              <p className="helper-text">
                Las opciones serán Verdadero y Falso.
              </p>
            )}

            {/* Respuesta correcta */}
            <label>
              Respuesta correcta

              {q.type === "multiple" || q.type === "boolean" ? (

                <select
                  required
                  value={q.correctAnswer}
                  onChange={(e) =>
                    updateQuestion(index, {
                      correctAnswer: e.target.value,
                    })
                  }
                >
                  <option value="">
                    Seleccioná la respuesta correcta
                  </option>

                  {(
                    q.type === "boolean"
                      ? ["Verdadero", "Falso"]
                      : q.options.filter((o) => o.trim())
                  ).map((option, i) => (
                    <option
                      key={`${option}-${i}`}
                      value={option}
                    >
                      {option}
                    </option>
                  ))}

                </select>

              ) : (

                <input
                  required
                  value={q.correctAnswer}
                  onChange={(e) =>
                    updateQuestion(index, {
                      correctAnswer: e.target.value,
                    })
                  }
                  placeholder="Respuesta esperada"
                />

              )}

            </label>

            {/* Ayuda para respuesta escrita */}
            {q.type === "text" && (
              <p className="helper-text">
                La respuesta escrita se comparará ignorando
                mayúsculas y espacios al principio o al final.
              </p>
            )}

          </section>
        ))}

        {/* Botones finales */}
        <div className="form-footer">

          <button
            type="button"
            className="button button-secondary"
            onClick={() => navigate("/")}
          >
            Cancelar
          </button>

          <button
            className="button button-primary"
            type="submit"
          >
            Guardar cuestionario
          </button>

        </div>

      </form>
    </>
  );
}
