
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Pencil } from "lucide-react";
import type { Question, Quiz } from "../types";

import "./QuizEditor.css";
import { Form } from "../components/editor/Form";
import {ImportPanel} from "../components/editor/ImportPanel";

interface Props {
  quizzes?: Quiz[];
  onSave: (quiz: Quiz) => void;
}
// Crear una pregunta vací

const newQuestion = (): Question => ({
  id: crypto.randomUUID(),
  statement: "",
  type: "multiple",
  options: ["", ""],
  correctAnswer: "",
});
type Mode = "manual" | "import";

export const QuizEditor = ({ quizzes = [], onSave }: Props) => {

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
  const [mode, setMode] = useState<Mode>("manual");
  // Verificar si existe el cuestionario

  useEffect(() => {
    if (id && !existing) {
      navigate("/");
    }
  }, [id, existing, navigate]);


   function submit() {
    const valid = questions.every(
      (q) =>
        q.statement.trim() &&
        q.correctAnswer.trim() &&
        (q.type !== "multiple" ||
          q.options.filter((o) => o.trim()).length >= 2)
    );

    if (!valid) {
      alert(
        "Completá cada pregunta, su respuesta correcta y al menos dos opciones cuando corresponda."
      );
      return;
    }

    const now = new Date().toISOString();

    onSave({
      id: existing?.id ?? crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      questions,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    });
  }

  return (
    <main>
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
      {/* Selector de modo */}
        <div className="editor-tabs">
          <button
            type="button"
            className={`editor-tab ${mode === "manual" ? "active" : ""}`}
            onClick={() => setMode("manual")}
          >
            <Pencil />
            Manual
          </button>

          <button
            type="button"
            className={`editor-tab ${mode === "import" ? "active" : ""}`}
            onClick={() => setMode("import")}
          >
            <FileText  />
            Pegar texto
          </button>
        </div>

      {mode === "manual" && (
        <Form
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          questions={questions}
          setQuestions={setQuestions}
          submit={submit}
        />
      )}

      {mode === "import" && (
        <ImportPanel
          onImport={(quiz ) => {
            setTitle(quiz.title);
            setDescription(quiz.description);
            setQuestions(quiz.questions);
            setMode("manual");
          }}
        />
      )}
    </main>
  );
}
