// src/layouts/LayoutPrincipal.jsx
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // Tu barra de navegación con <NavLink>

export default function LayoutPrincipal() {
  return (
    <div>
      {/* El Navbar se mantiene estático arriba en toda la app */}
      <Navbar /> 
      
      <main className="max-w-6xl mx-auto px-6 py-3">
        <Outlet /> 
      </main>
    </div>
  );
}