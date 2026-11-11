
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import type { Question, QuestionType, Quiz } from "../types";
import Card from "../components/editor/Card";



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
  const [openQuestion, setOpenQuestion] = useState(0);

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
             className="add-question-button"
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
