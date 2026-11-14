import type { Quiz, StudyStats } from "./types";

const QUIZZES_KEY = "study-loop:quizzes";
const STATS_KEY = "study-loop:stats";

export function loadQuizzes(): Quiz[] {
  try {
    return JSON.parse(localStorage.getItem(QUIZZES_KEY) ?? "[]") as Quiz[];
  } catch {
    return [];
  }
}

export function saveQuizzes(quizzes: Quiz[]) {
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
}

export function loadStats(): StudyStats {
  try {
    return JSON.parse(
      localStorage.getItem(STATS_KEY) ??
        '{"attempts":0,"mistakes":0,"completed":0,"progressByQuiz":{}}'
    ) as StudyStats;
  } catch {
    return {
      attempts: 0,
      mistakes: 0,
      completed: 0,
      progressByQuiz: {},
    };
  }
}

export function saveStats(stats: StudyStats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}