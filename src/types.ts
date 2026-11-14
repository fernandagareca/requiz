export type QuestionType = "multiple" | "boolean" | "text";

export interface Question {
  id: string;
  statement: string;
  type: QuestionType;
  options: string[];
  correctAnswer: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: string;
  updatedAt: string;
}
export interface QuizProgress {
  correct: number; // preguntas acertadas en la última ronda
  total: number;   // total de preguntas del quiz (al momento de practicar)
}
export interface StudyStats {
  attempts: number;
  mistakes: number;
  completed: number;
  progressByQuiz: Record<string, QuizProgress>;
}