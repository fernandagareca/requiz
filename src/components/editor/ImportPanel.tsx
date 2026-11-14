import { useState } from "react";
import { Upload, FileText, AlertCircle, CheckCircle2, Copy } from "lucide-react";

import { parseQuiz } from "../editor/parseQuiz";
import type { Quiz } from "../../types";
import "./style.css";
interface Props {
  onImport: (quiz: Quiz) => void;
}

const EXAMPLE = `# Sistemas operativos
Fundamentos de SO para el parcial.

## ¿Qué es un proceso?
* Un programa en ejecución
* Una carpeta del sistema
- Un archivo del kernel
- Una partición del disco
> Un programa en ejecución

## El kernel es el corazón del sistema operativo
? boolean
> Verdadero`;

const FORMAT = [
  ["#", "Título del cuestionario"],
  ["##", "Enunciado de la pregunta"],
  ["* / -", "Opción de respuesta"],
  [">", "Respuesta correcta"],
  ["? boolean", "Verdadero/Falso"],
];

export const ImportPanel = ({ onImport }: Props) => {
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [preview, setPreview] = useState<Quiz | null>(null);

  const parse = () => {
    const { quiz, errors } = parseQuiz(text);
    setPreview(quiz);
    setErrors(errors);
    return quiz;
  };

  const handleChange = (value: string) => {
    setText(value);
    setPreview(null);
    setErrors([]);
  };

  const handleImport = () => {
    const quiz = preview ?? parse();
    if (quiz) onImport(quiz);
  };
  const handleCopy = async () => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  return (
    <section className="panel import-panel">
      <p className="helper-text">Pegá el cuestionario con este formato:</p>

      <ul className="format-guide">
        {FORMAT.map(([symbol, label]) => (
          <li key={symbol}>
            <code>{symbol} </code> {label}
          </li>
        ))}
      </ul>

      <div className="import-textarea-wrapper">
        <textarea
          className="import-textarea"
          value={text}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={EXAMPLE}
          rows={16}
          spellCheck={false}
        />

        <button
          type="button"
          className="copy-button"
          onClick={handleCopy}
          disabled={!text.trim()}
          title="Copiar texto"
          aria-label="Copiar texto"
        >
          <Copy size={16} />
        </button>
      </div>

      <div className="import-actions">
        <button
          type="button"
          className="button button-secondary"
          onClick={() => handleChange(EXAMPLE)}
        >
          Usar ejemplo
        </button>

        <button
          type="button"
          className="button button-secondary"
          onClick={parse}
          disabled={!text.trim()}
        >
          <FileText size={16} />
          Previsualizar
        </button>

        <button
          type="button"
          className="button button-primary"
          onClick={handleImport}
          disabled={!text.trim()}
        >
          <Upload size={16} />
          Importar
        </button>
      </div>

      {errors.length > 0 && (
        <Panel
          className="import-errors"
          icon={<AlertCircle size={16} />}
          title="Revisá lo siguiente:"
          items={errors}
        />
      )}

      {preview && (
        <Panel
          className="import-preview"
          icon={<CheckCircle2 size={16} />}
          title={`${preview.questions.length} pregunta${
            preview.questions.length === 1 ? "" : "s"
          } detectada${preview.questions.length === 1 ? "" : "s"}`}
          items={preview.questions.map(
            (q, i) => `${i + 1}. ${q.statement} (${q.type})`
          )}
        />
      )}
    </section>
  );
};

/* --- Subcomponente para errores y preview --- */
function Panel({
  className,
  icon,
  title,
  items,
}: {
  className: string;
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div className={className}>
      {icon}
      <div>
        <strong>{title}</strong>
        <ul>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}