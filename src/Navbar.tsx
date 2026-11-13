
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BookOpen,
  ChartNoAxesColumn,
  ChevronsLeft,
  Plus,
  Sparkles
} from 'lucide-react';

import './Navbar.css';

export interface Props {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Navbar = ({ sidebarCollapsed, setSidebarCollapsed }: Props) => {
  return (
    <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <NavLink to="/" className="brand">
          <span className="brand-mark">R</span>
          <span>Re<span className="pink">quiz</span></span>
        </NavLink>

        <button
					className="sidebar-toggle"
					onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
					aria-label={sidebarCollapsed ? "Expandir menú" : "Contraer menú"}
				>
					<ChevronsLeft
						size={18}
						className={sidebarCollapsed ? "toggle-icon rotated" : "toggle-icon"}
					/>
				</button>
      </div>
			<hr className="separator"/>

      <p className="nav-label">GENERAL</p>

      <nav className="nav-links">
        <NavLink to="/" end title="Mis cuestionarios">
          <BookOpen size={19} />
          <span>Mis cuestionarios</span>
        </NavLink>

        <NavLink to="/create" title="Crear cuestionario">
          <Plus size={19} />
          <span>Crear cuestionario</span>
        </NavLink>

        <NavLink to="/statistics" title="Estadísticas">
          <ChartNoAxesColumn size={19} />
          <span>Estadísticas</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <Sparkles size={16} />
        <span>Aprendé a tu ritmo.</span>
      </div>
    </aside>
  );
};
