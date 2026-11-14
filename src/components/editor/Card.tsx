
import { Trash2, ChevronDown, Plus } from "lucide-react";
import type { Question, QuestionType } from "../../types";
import "./Card.css";
interface Props {
  q: Question;
  index: number;
  questionsLength: number;
  isOpen: boolean;
  onToggle: () => void;
  updateQuestion: (index: number, patch: Partial<Question>) => void;
  changeType: (index: number, type: QuestionType) => void;
  onDelete: (id: string) => void;
}

export default function Card({
  q,
  index,
  questionsLength,
  isOpen,
  onToggle,
  updateQuestion,
  changeType,
  onDelete,
}: Props) {

  return (
    <section className="panel question-editor">

      {/* Título y acciones */}
      <div className="question-editor-title">
        <button
          type="button"
          className="question-toggle"
          onClick={onToggle}
          aria-expanded={isOpen}
        >
          <h3>Pregunta {index + 1}</h3>
          <ChevronDown
            size={18}
            className={isOpen ? "chevron-open" : ""}
          />
        </button>

        <button
          type="button"
          className="icon-button danger"
          aria-label="Eliminar pregunta"
          disabled={questionsLength === 1}
          onClick={() => onDelete(q.id)}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Contenido desplegable */}
      {isOpen && (
        <section className="question-editor-content">
          {/* Enunciado */}
          <label >
            Enunciado
            <textarea
              required
              rows={2}
              value={q.statement}
              onChange={(e) =>
                updateQuestion(index, { statement: e.target.value })
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
            </select>
          </label>

          {/* Opciones */}
          {q.type === "multiple" && (
            <div className="option-list">
              <span className="field-label">Opciones</span>

              {q.options.map((option, i) => (
                <div className="option-row" key={i}>
                  {/* Letra automática */}
                  <span className="option-letter">
                    {String.fromCharCode(65 + i)}
                  </span>

                  {/* Texto de la opción */}
                  <input
                    aria-label={`Opción ${i + 1}`}
                    value={option}
                    placeholder={`Escribí la opción ${String.fromCharCode(65 + i)}...`}
                    onChange={(e) =>
                      updateQuestion(index, {
                        options: q.options.map((o, j) =>
                          j === i ? e.target.value : o
                        ),
                      })
                    }
                  />

                  {/* Eliminar opción */}
                  <button
                    type="button"
                    className="option-delete"
                    aria-label={`Eliminar opción ${i + 1}`}
                    disabled={q.options.length <= 2}
                    onClick={() =>
                      updateQuestion(index, {
                        options: q.options.filter((_, j) => j !== i),
                        correctAnswer:
                          q.correctAnswer === option ? "" : q.correctAnswer,
                      })
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="add-button"
                onClick={() =>
                  updateQuestion(index, {
                    options: [...q.options, ""],
                  })
                }
              >
                <Plus size={16} />
                Agregar opción
              </button>
            </div>
          )}

          {/* Respuesta correcta */}
          <label>
            Respuesta correcta

            {q.type === "text" ? (
              <input
                required
                value={q.correctAnswer}
                placeholder="Respuesta esperada"
                onChange={(e) =>
                  updateQuestion(index, {
                    correctAnswer: e.target.value,
                  })
                }
              />
            ) : (
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

                {(q.type === "boolean"
                  ? ["Verdadero", "Falso"]
                  : q.options.filter((o) => o.trim())
                ).map((option, i) => (
                  <option key={`${option}-${i}`} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            )}
          </label>
        </section>
      )}
    </section>
  );
}
