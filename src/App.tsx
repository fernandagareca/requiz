import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import type { Quiz, StudyStats } from "./types";
import { loadQuizzes, loadStats, saveQuizzes, saveStats } from "./storage";
import Dashboard from "./pages/Dashboard";
import {QuizEditor} from "./pages/QuizEditor";
import Practice from "./pages/Practice";
import Statistics from "./pages/Statistics";
import { Navbar } from "./Navbar";

export default function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(loadQuizzes);
  const [stats, setStats] = useState<StudyStats>(loadStats);
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => saveQuizzes(quizzes), [quizzes]);
  useEffect(() => saveStats(stats), [stats]);

  function upsertQuiz(quiz: Quiz) {
    setQuizzes((current) => {
      const exists = current.some((item) => item.id === quiz.id);
      return exists ? current.map((item) => item.id === quiz.id ? quiz : item) : [quiz, ...current];
    });
    navigate("/");
  }

  function deleteQuiz(id: string) {
    setQuizzes((current) => current.filter((quiz) => quiz.id !== id));
  }

  return (
    <div className="app-shell">
      

      <main  className={`main-area ${sidebarCollapsed ? "expanded" : ""}`}>
        <header className="topbar"><span>Tu espacio de estudio</span><span className="user-chip">m.</span></header>
        <Navbar 
          sidebarCollapsed={sidebarCollapsed} 
          setSidebarCollapsed={setSidebarCollapsed}
        />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard quizzes={quizzes} stats={stats} onDelete={deleteQuiz} />} />
            <Route path="/create" element={<QuizEditor onSave={upsertQuiz} />} />
            <Route path="/edit/:id" element={<QuizEditor quizzes={quizzes} onSave={upsertQuiz} />} />
            <Route path="/practice/:id" element={<Practice quizzes={quizzes} onStats={setStats} onSave={ upsertQuiz} />} />
            <Route path="/statistics" element={<Statistics quizzes={quizzes} stats={stats} />} />
            <Route path="*" element={<Dashboard quizzes={quizzes} stats={stats} onDelete={deleteQuiz} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}