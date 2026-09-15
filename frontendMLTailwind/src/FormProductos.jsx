import { useState, useEffect } from 'react'
import axiosClient from './axiosClient'
import './App.css'
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const esquemaProducto = z.object({
        nombre: z
            .string({ invalid_type_error: "El nombre debe ser un texto" })
            .min(3, { message: "El nombre es obligatorio" }), // <-- Tu mensaje aquí
        precio: z.preprocess(
        (val) => (val === "" || val === null || isNaN(Number(val)) ? undefined : Number(val)),
        z.number({
            required_error: "El precio es obligatorio",
            invalid_type_error: "El precio debe ser un número válido"
        })
        .min(0, { message: "El precio debe ser mayor o igual a 0" })
        ),
        categoria: z
        .string({ invalid_type_error: "La categoría debe ser un texto" })
        .min(1, { message: "La categoría es obligatoria" }) // <-- Tu mensaje aquí
    });

 
 export default function FormProductos({producto, idEditando, editando, onEdicionCorrecta, onCerrar})
 {

    const [idEditandoForm, setIdEditando] = useState(idEditando);
    const [editandoForm, setEditando] = useState(editando);

    
    const { register, handleSubmit: hookSubmit, formState: { errors }, setFocus, reset } = useForm({
        resolver: zodResolver(esquemaProducto),
    });

    // Only reset the form when the `producto` prop changes to avoid resetting on every render
    useEffect(() => {
      if (producto) {
        reset(producto);
        // Wait a tick for reset to apply, then set focus
        setTimeout(() => setFocus("nombre"), 50);
      }
    }, [producto, reset, setFocus]);

    // Keep local editing state in sync with incoming props
    useEffect(() => {
      setIdEditando(idEditando);
    }, [idEditando]);

    useEffect(() => {
      setEditando(editando);
    }, [editando]);

    // Crear o Editar producto (POST / PUT)
    // `hookSubmit` from react-hook-form will pass the form data object here
    const handleSubmit = async (formData) => {
      const payload = { id: idEditandoForm || 0, nombre: formData.nombre, precio: parseFloat(formData.precio), categoria: formData.categoria };

      try {
        setEditando(false);
        setIdEditando(null);
        reset({
          nombre: "",
          precio: "", // Se deja vacío para limpiar el input numérico
          categoria: ""
        });
        // SOLUCIÓN: Espera a que termine el reset antes de tirar el foco
        setTimeout(() => {
          setFocus("nombre");
        }, 50);

        await onEdicionCorrecta(payload, idEditandoForm);
        onCerrar();
      }
      catch (err) {
        console.error('Error al guardar:', err);
      }
    };

    return (  
    <form className="flex flex-col h-full bg-white" 
        onSubmit={hookSubmit(handleSubmit)} >
        <h2 className=" text-center font-semibold text-slate-800 border-b border-slate-100 pb-3">
          {idEditandoForm ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="flex flex-col gap-1.5"> 
            <label className="text-sm font-semibold text-slate-700">Nombre del Producto</label>
            <input
              type="text"
              placeholder="Nombre del Producto"
              {...register("nombre")}
              className={`w-full text-sm px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                errors.nombre 
                  ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                  : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
              }`}
            />
            {errors.nombre && <span className="text-xs font-medium text-red-600 mt-0.5">{errors.nombre.message}</span>}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5"> 
              <label className="text-sm font-semibold text-slate-700">Precio del Producto</label>
              <input
                type="number"
                step="0.01"
                placeholder="Precio del Producto"
                {...register("precio", { valueAsNumber: true })}
                className={`w-full text-sm px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                errors.precio 
                ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
                }`}       
              />
              {errors.precio && <span className="text-xs font-medium text-red-600 mt-0.5">{errors.precio.message}</span>}
            </div>
              
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-slate-700">Categoría del Producto</label>
              <input
                type="text"
                placeholder="Categoría del Producto"
                {...register("categoria")} 
                className={`w-full text-sm px-3 py-2 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 transition ${
                  errors.categoria 
                    ? "border-red-500 focus:ring-red-500/20 focus:border-red-500" 
                    : "border-slate-300 focus:ring-blue-500/20 focus:border-blue-500"
                }`}
              />
              {errors.categoria && <span className="text-xs font-medium text-red-600 mt-0.5">{errors.categoria.message}</span>}
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end items-stretch 
            sm:items-center gap-3 pt-4 border-t border-slate-100 p-6 bg-slate-50">
          <button
            type="button"
            onClick={() => {
              setEditando(false);
              setIdEditando(null);
              reset({
                nombre: "",
                precio: "", 
                categoria: ""
              });
              setTimeout(() => {
                setFocus("nombre");
              }, 50);
              onCerrar();
            }}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition cursor-pointer text-center w-full sm:w-auto"
          >
            Cancelar
          </button>
          <button type="submit"
            className="px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition cursor-pointer text-center w-full sm:w-auto" >
            {idEditandoForm ? 'Guardar' : 'Agregar'}
          </button>
        </div>
      </form>
    );
}