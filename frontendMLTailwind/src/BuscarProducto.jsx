import { useState, useEffect, useRef } from 'react'
import axiosClient from './axiosClient'
import './App.css'
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";

 
 export default function BuscarProducto({ onEnviar , onCategoriaChange }) {
 
    const [buscar, setBuscar] = useState('');
    const [categoriaBusqueda, setCategoriaBusqueda] = useState('');


    const handleCategoriaChange = (e) => {
        //e.preventDefault();
        setCategoriaBusqueda(e.target.value);
        onCategoriaChange(e.target.value);
    };

    const handleBuscarSubmit = (e) => {
        e.preventDefault();
        onEnviar(buscar, categoriaBusqueda); // Llamar a la función onEnviar con los valores actuales
    };

    return (
    <form onSubmit={handleBuscarSubmit} className="">
        
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          
          {/* Título del Filtro y Paginación Secundaria (Línea decorativa muy limpia) */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              Filtros de Búsqueda
            </h2>
          </div>

          {/* PARTE INFERIOR: Los 3 Controles Alineados */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            
            {/* 1. Input Buscar */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Buscar por nombre</label>
              <input
                type="text"
                placeholder="Ej: Teclado mecánico..."
                value={buscar}
                onChange={(e) => setBuscar(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* 2. Selector Categoría */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-600">Categoría</label>
              <select className="w-full text-sm px-3 py-2 bg-slate-50 border
              border-slate-200 rounded-lg shadow-2xs focus:outline-none focus:ring-2
              focus:ring-blue-500/20 focus:border-blue-500 transition 
              text-slate-700 cursor-pointer"
                value={categoriaBusqueda}
                onChange={handleCategoriaChange}>
                <option value="">Todas las categorías</option>
                <option value="Bebidas">Bebidas</option>
                <option value="Bazar">Bazar</option>
                <option value="Almacén">Almacén</option>
                <option value="Electro">Electro</option>
              </select>
            </div>

            {/* 3. Botón Buscar Estilizado */}
            <button className="w-full text-sm px-4 py-2 bg-slate-800 text-white font-medium rounded-lg hover:bg-slate-900 active:bg-slate-950 transition cursor-pointer flex items-center justify-center gap-2 h-9.5 shadow-sm">
              <span>🔍</span>
              <span>Buscar</span>
            </button>

          </div>

        </div>
    </form>);
 }

