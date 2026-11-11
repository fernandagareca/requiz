import { useEffect, useState } from "react";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { BookOpen, ChartNoAxesColumn, Plus, Sparkles } from "lucide-react";
import type { Quiz, StudyStats } from "./types";
import { loadQuizzes, loadStats, saveQuizzes, saveStats } from "./storage";
import Dashboard from "./pages/Dashboard";
import QuizEditor from "./pages/QuizEditor";
import Practice from "./pages/Practice";
import Statistics from "./pages/Statistics";

export default function App() {
  const [quizzes, setQuizzes] = useState<Quiz[]>(loadQuizzes);
  const [stats, setStats] = useState<StudyStats>(loadStats);
  const navigate = useNavigate();

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
      <aside className="sidebar">
        <NavLink to="/" className="brand"><span className="brand-mark">R</span>
        <span>Re<span className="pink">quiz</span></span></NavLink>
        <p className="nav-label">MENÚ</p>
        <nav className="nav-links">
          <NavLink to="/" end><BookOpen size={18} /> Mis cuestionarios</NavLink>
          <NavLink to="/create"><Plus size={18} /> Crear cuestionario</NavLink>
          <NavLink to="/statistics"><ChartNoAxesColumn size={18} /> Estadísticas</NavLink>
        </nav>
        <div className="sidebar-bottom"><Sparkles size={17} /><span>Aprendé a tu ritmo.</span></div>
      </aside>

      <main className="main-area">
        <header className="topbar"><span>Tu espacio de estudio</span><span className="user-chip">m.</span></header>
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Dashboard quizzes={quizzes} onDelete={deleteQuiz} />} />
            <Route path="/create" element={<QuizEditor onSave={upsertQuiz} />} />
            <Route path="/edit/:id" element={<QuizEditor quizzes={quizzes} onSave={upsertQuiz} />} />
            <Route path="/practice/:id" element={<Practice quizzes={quizzes} onStats={setStats} />} />
            <Route path="/statistics" element={<Statistics quizzes={quizzes} stats={stats} />} />
            <Route path="*" element={<Dashboard quizzes={quizzes} onDelete={deleteQuiz} />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}