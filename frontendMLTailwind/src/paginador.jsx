 
 import { useState, useEffect } from 'react'
 
 
 /*calcularPaginas()*/
export default function Paginador({ paginasAMostrar, pagina, totalPaginas, onActualizarPagina }) { 
 
    return (
        <div>
        {/* --- BOTONERA DE PAGINACIÓN --- */}
        {totalPaginas > 1 && (
            <nav aria-label="Pagination" className="flex justify-center my-8">
            <ul className="inline-flex items-center -space-x-px bg-white rounded-md 
                shadow-sm border border-slate-200"> 
                {/* Botón Anterior */}
                <li className="">
                <button
                    disabled={pagina <= 1}
                    className="px-3 py-2 ml-0 leading-tight text-slate-500 bg-white border border-slate-300 rounded-l-md transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-500"
                    onClick={() => onActualizarPagina(pagina - 1)}
                >
                    Anterior
                </button>
                </li>

                {/* Números de Página */}
                {
                paginasAMostrar.map((num) => (
                <li key={num}
                    className="hidden sm:block" >
                    <button
                    disabled={pagina === num}
                    className="px-2 sm:px-4 py-2 leading-tight text-slate-500 bg-white border border-slate-300 hover:bg-slate-100 hover:text-slate-700 transition disabled:cursor-not-allowed disabled:hover:bg-blue-300 disabled:hover:text-blue-500 disabled:text-blue-500 disabled:bg-gray-300"
                    onClick={() => onActualizarPagina(num)}
                    >
                    {num}
                    </button>
                </li>                
                ))}
                <span className="text-slate-500 block px-2 sm:hidden">{"Página " + pagina + " de " + totalPaginas}</span>

                {/* Botón Siguiente */}
                <li className={`page-item ${pagina === totalPaginas ? 'disabled' : ''}`}>
                <button
                    disabled={pagina >= totalPaginas}
                    className="px-3 py-2 ml-0 leading-tight text-slate-500 bg-white border border-slate-300 rounded-l-md transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-500"
                    onClick={() => onActualizarPagina(pagina + 1)}
                >
                    Siguiente
                </button>
                </li>
            </ul>
            </nav>
        )}
      </div>
    )
}