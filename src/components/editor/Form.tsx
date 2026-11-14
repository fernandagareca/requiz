import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Info, Plus, Save } from "lucide-react";

import Card from "./Card";
import type { Question, QuestionType } from "../../types";

interface Props {
  questions: Question[];
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  description: string;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  submit: () => void;
}
// Crear una pregunta vací
const newQuestion = (): Question => ({
  id: crypto.randomUUID(),
  statement: "",
  type: "multiple",
  options: ["", ""],
  correctAnswer: "",
});

export const Form = ({
  questions,
  setQuestions,
  title,
  setTitle,
  description,
  setDescription,
  submit,
}: Props) => {
  const navigate = useNavigate();

  // Estado interno del formulario
  const [openQuestion, setOpenQuestion] = useState(0);

  // Actualizar una pregunta
  function updateQuestion(index: number, patch: Partial<Question>) {
    setQuestions((current) =>
      current.map((question, i) =>
        i === index ? { ...question, ...patch } : question
      )
    );
  }

  // Cambiar el tipo de pregunta
  function changeType(index: number, type: QuestionType) {
    updateQuestion(index, {
      type,
      options: type === "multiple" ? ["", ""] : ["Verdadero", "Falso"],
      correctAnswer: "",
    });
  }

  // Submit wrapper
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    submit();
  }

  return (
    <form className="editor-form" onSubmit={handleSubmit}>
			{/* Encabezado de preguntas */}
      <div className="section-heading">
        <div className="section-title">
          <h2>
            <Info size={22} />
            Info General
          </h2>
        </div>
        <div className="section-line"></div>
      </div>
      {/* Información general */}
      <section className="panel">
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
      <div className="section-heading">
        <div className="section-title">
          <h2>
            <ClipboardList size={22} />
            Preguntas
          </h2>
          <p>
            {questions.length} pregunta
            {questions.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="section-line"></div>
      </div>

      {/* Lista de preguntas */}
      {questions.map((q, index) => (
        <Card
          key={q.id}
          q={q}
          index={index}
          questionsLength={questions.length}
          isOpen={openQuestion === index}
          onToggle={() =>
            setOpenQuestion(openQuestion === index ? -1 : index)
          }
          updateQuestion={updateQuestion}
          changeType={changeType}
          onDelete={(id) => {
            setQuestions((current) =>
              current.filter((item) => item.id !== id)
            );
            setOpenQuestion(-1);
          }}
        />
      ))}

      {/* Botones finales */}
      <div className="form-footer">
        <button
          type="button"
          className="add-option"
          onClick={() => {
            setQuestions((current) => [...current, newQuestion()]);
            setOpenQuestion(questions.length);
          }}
        >
          <Plus size={16} />
          Agregar pregunta
        </button>

        <button
          type="button"
          className="button button-secondary"
          onClick={() => navigate("/")}
        >
          Cancelar
        </button>

        <button className="button button-primary" type="submit">
          <Save size={16} />
          Guardar cuestionario
        </button>
      </div>
    </form>
  );
};