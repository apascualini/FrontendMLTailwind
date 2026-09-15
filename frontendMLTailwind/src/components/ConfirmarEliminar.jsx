import { useState } from "react";

export default function ConfirmarEliminar({ isOpen, onClose, onConfirm, nombreItem }) {
  if (!isOpen) return null;

  return (
    // 1. Fondo Oscuro Transparente (Backdrop)
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      
      {/* 2. Contenedor del Modal */}
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Cabecera con Icono de Advertencia */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-10 h-10 bg-red-50 text-red-600 rounded-full">
            {/* Icono de advertencia simple */}
            <svg xmlns="http://w3.org" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            ¿Confirmar eliminación?
          </h3>
        </div>

        {/* Mensaje */}
        <p className="text-sm text-slate-600 leading-relaxed mb-6">
          ¿Estás seguro de que deseas eliminar <span className="font-semibold text-slate-800">"{nombreItem}"</span>? 
          Esta acción no se puede deshacer y borrará el elemento permanentemente.
        </p>

        {/* Botones de Acción (Sí / No) */}
        <div className="flex justify-end gap-3">
          {/* Botón NO (Cancelar) */}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition cursor-pointer"
          >
            No, cancelar
          </button>
          
          {/* Botón SÍ (Eliminar) */}
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose(); // Cierra el modal tras confirmar
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg shadow-sm hover:bg-red-700 transition cursor-pointer"
          >
            Sí, eliminar
          </button>
        </div>

      </div>
    </div>
  );
}
