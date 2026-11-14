import type { Question, Quiz } from "../../types";

export interface ParseResult {
  quiz: Quiz | null;
  errors: string[];
}

export function parseQuiz(text: string): ParseResult {

  const errors: string[] = [];
  const lines = text.split(/\r?\n/);

  let title = "";
  let description = "";
  let descriptionStarted = false;

  const questions: Question[] = [];

  let current: {
    statement: string;
    type: "multiple" | "boolean";
    options: string[];
    correctAnswer: string;
  } | null = null;

  function flush() {
    if (!current) return;

    const q = current;

    if (!q.statement.trim()) {
      errors.push(`Pregunta sin enunciado cerca de: "${q.statement}"`);
    }

    if (!q.correctAnswer.trim()) {
      errors.push(`Falta respuesta correcta ("> ...") en: "${q.statement}"`);
    }

    // Boolean
    if (q.type === "boolean") {
      const ans = q.correctAnswer.trim().toLowerCase();

      if (ans !== "verdadero" && ans !== "falso") {
        errors.push(
          `La pregunta boolean "${q.statement}" debe responder "Verdadero" o "Falso"`
        );
      }

      q.correctAnswer = ans === "verdadero" ? "Verdadero" : "Falso";
      q.options = ["Verdadero", "Falso"];
    }

    // Multiple
    if (q.type === "multiple") {
      const opts = q.options.filter((o) => o.trim());

      if (opts.length < 2) {
        errors.push(
          `La pregunta "${q.statement}" necesita al menos 2 opciones (usá "* opción")`
        );
      }

      if (
        opts.length >= 2 &&
        !opts.some(
          (o) =>
            o.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
        )
      ) {
        errors.push(
          `La respuesta correcta de "${q.statement}" no coincide con ninguna opción`
        );
      }
    }

    questions.push({
      id: crypto.randomUUID(),
      statement: q.statement.trim(),
      type: q.type,
      options:
        q.type === "boolean"
          ? ["Verdadero", "Falso"]
          : q.options.filter((o) => o.trim()),
      correctAnswer: q.correctAnswer.trim(),
    });

    current = null;
  }

  for (const raw of lines) {
    const line = raw.trimEnd();

    // Título
    if (line.startsWith("# ")) {
      title = line.slice(2).trim();
      descriptionStarted = false;
      continue;
    }

    // Nueva pregunta
    if (line.startsWith("## ")) {
      flush();
      current = {
        statement: line.slice(3).trim(),
        type: "multiple",
        options: [],
        correctAnswer: "",
      };
      descriptionStarted = false;
      continue;
    }

    // Tipo explícito (solo boolean ahora)
    if (current && line.startsWith("? ")) {
      const t = line.slice(2).trim().toLowerCase();
      if (t === "boolean") current.type = "boolean";
      continue;
    }

    // Opción
    if (current && (line.startsWith("* ") || line.startsWith("- "))) {
      current.options.push(line.slice(2).trim());
      continue;
    }

    // Respuesta correcta
    if (current && line.startsWith("> ")) {
      current.correctAnswer = line.slice(2).trim();
      continue;
    }

    // Descripción (solo antes de la primera pregunta)
    if (title && !current && !questions.length) {
      if (line.trim()) {
        if (descriptionStarted) description += "\n";
        description += line.trim();
        descriptionStarted = true;
      }
      continue;
    }
  }

  flush();

  if (!title) {
    errors.push("Falta el título. Empezá con:  # Título del cuestionario");
  }

  if (questions.length === 0) {
    errors.push("No se encontró ninguna pregunta. Usá: ## Enunciado");
  }

  if (errors.length) {
    return { quiz: null, errors };
  }

  const now = new Date().toISOString();

  return {
    quiz: {
      id: crypto.randomUUID(),
      title,
      description,
      questions,
      createdAt: now,
      updatedAt: now,
    },
    errors: [],
  };
}

export function serializeQuiz(quiz: Quiz): string {
  const lines: string[] = [];

  lines.push(`# ${quiz.title}`);
  if (quiz.description) lines.push(quiz.description);
  lines.push("");

  for (const q of quiz.questions) {
    lines.push(`## ${q.statement}`);

    if (q.type === "boolean") {
      lines.push("? boolean");
      lines.push(`> ${q.correctAnswer}`);
    } else {
      for (const opt of q.options) lines.push(`* ${opt}`);
      lines.push(`> ${q.correctAnswer}`);
    }

    lines.push("");
  }

  return lines.join("\n").trim();
}