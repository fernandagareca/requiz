
import {
  ChartNoAxesColumn,
  CircleCheck,
  CircleX,
  BookOpen,
} from "lucide-react";

import type { Quiz, StudyStats } from "../types";
import "./Statistics.css";

interface Props {
  quizzes: Quiz[];
  stats: StudyStats;
}

export default function Statistics({ quizzes, stats }: Props) {
  const cards = [
    {
      label: "Cuestionarios",
      value: quizzes.length,
      icon: BookOpen,
    },
    {
      label: "Rondas completadas",
      value: stats.completed,
      icon: CircleCheck,
    },
    {
      label: "Respuestas incorrectas",
      value: stats.mistakes,
      icon: CircleX,
    },
  ];
  return (
    <>
      {/* Encabezado */}
      <div className="form-heading">
        <span className="eyebrow">
          SEGUIMIENTO
        </span>
        <h1>Estadísticas</h1>
        <p>
          Un resumen de tu actividad de estudio en este dispositivo.
        </p>
      </div>
      {/* ----------------------------------
          Tarjetas de estadísticas
      ---------------------------------- */}
      <div className="stats-grid">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            className="stat-card"
            key={label}
          >
            {/* Icono */}
            <span className="stat-icon">
              <Icon size={20} />
            </span>
            {/* Valor */}
            <strong>{value}</strong>
            {/* Descripción */}
            <span>{label}</span>
          </div>
        ))}
      </div>
      {/*Información sobre el progreso*/}
      <div className="panel stats-note">
        <ChartNoAxesColumn size={22} />
        <div>
          <h3>Tu progreso, paso a paso</h3>
          <p>
            Las estadísticas se guardan localmente en este navegador.
            Cada ronda completada cuenta cuando respondés todas las
            preguntas sin errores en esa ronda.
          </p>
        </div>
      </div>
    </>
  );
}
