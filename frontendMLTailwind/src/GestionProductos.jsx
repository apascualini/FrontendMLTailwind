import { useState, useEffect } from 'react'
import axiosClient from './axiosClient'
import './App.css'
import BuscarProducto from './BuscarProducto';
import FormProductos from './FormProductos';
import ConfirmarEliminar from './components/ConfirmarEliminar';
import { exportarExcel, exportarCSV, exportarPDF } from './exportUtils.js';
import Paginador from './paginador.jsx';

function GestionProductos() {
  
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [animate, setAnimate] = useState(false); 
  const [categoriaBusqueda, setCategoriaBusqueda] = useState('');
  const [buscar, setBuscar] = useState('');

  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(false);
  const [idEditando, setIdEditando] = useState(null);

  const [totalPaginas, setTotalPaginas] = useState(0);
  const [cargando, setCargando] = useState(false);

  // Estados de Filtros y Paginación
  const [pagina, setPagina] = useState(1);
  const [tamanioPagina, setTamanioPagina] = useState(5);

  // Estados para controlar el modal
  const [modalAbierto, setModalAbierto] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  const [cargandoReporte, setCargandoReporte] = useState(false);

  const [orden, setOrden] = useState({
    columna: 'nombre', // Columna activa por defecto
    direccion: 'asc'   // 'asc' o 'desc'
  });

  // 1. Initialize state with current window dimensions
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    // 2. Handler function to update state on resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      calcularPaginas(); // Recalculate visible pages on resize
    };

    // 3. Add the event listener when the component mounts
    window.addEventListener('resize', handleResize);

    // 4. Clean up the listener when the component unmounts
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures this only runs once on mount

  // 1. Función para abrir: Primero se monta en el DOM, un milisegundo después se activan los estilos
  const abrirPanel = () => {
    setIsPanelOpen(true);
    setTimeout(() => setAnimate(true), 10);
  };

  // 2. Función para cerrar: Primero se quitan los estilos (inicia la animación de salida), 
  // luego de 300ms (lo que dura la transición) se desmonta del DOM.
  const cerrarPanel = () => {
    setAnimate(false);
    setTimeout(() => {
      setIsPanelOpen(false);
      setProductoSeleccionado(null);
    }, 300); // 300ms coincide con la clase duration-300 de Tailwind
  };

  // Función para cambiar el orden al hacer clic en el encabezado
  const manejarOrdenar = (columnaNombre) => {
    setOrden(prev => {
      if (prev.columna === columnaNombre) {
        // Si hace clic en la misma columna, alterna la dirección
        return { columna: columnaNombre, direccion: prev.direccion === 'asc' ? 'desc' : 'asc' };
      }
      // Si hace clic en una columna nueva, empieza en ascendente
      return { columna: columnaNombre, direccion: 'asc' };
    });
  };


  const cargarProductos = async () => {
    try {
      console.trace("🔍 Cargando datos desde:");

      setCargando(true);

      const response = await axiosClient.get('/producto', {
        params: {
          buscar: buscar,
          categoria: categoriaBusqueda,
          pagina: pagina,
          tamanioPagina: tamanioPagina,
          ordenarPor: orden.columna,
          ascendente: orden.direccion === 'asc' ? true : false
        }
      });
      setProductos(response.data.items);
      setTotalPaginas(response.data.totalPaginas);

      console.log('Productos cargados:', response.data);
    }
    catch (error) {
      console.error('Error fetching productos:', error);
    }
    finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, [pagina, categoriaBusqueda, tamanioPagina, buscar, orden]);

  const handleEditar = (producto) => {
    // Lógica para editar el producto
    console.log('Editar producto:', producto);

    setEditando(true); // Cambia el estado de edición
    setIdEditando(producto.id); // Establece el ID del producto en edición
    setProductoSeleccionado(producto); // Establece el producto seleccionado para editar
    abrirPanel(); // Abre el panel para editar
  }

    // Funciones de control
  const manejarNuevoProducto = () => {
    setProductoSeleccionado({ nombre: "", precio: "", categoria: "" }); // Resetea valores
    setIdEditando(null);
    setEditando(false);
    abrirPanel(); // Abre el panel para crear un nuevo producto
  };

  const handleEliminar = async (producto) => {

    setProductoAEliminar(producto);
    setModalAbierto(true);
    
    console.log('Eliminar producto:', producto);
  }

  const ejecutarEliminacion = async () => {
    try {
      await axiosClient.delete(`/producto/${productoAEliminar.id}`);
      cargarProductos();
      console.log('¡Eliminado!', 'El producto fue eliminado correctamente.', 'success');
    } catch (err) {
      console.error('No se pudo eliminar el producto.');
    }

    // Aquí ejecutas tu lógica real (ej: borrar en base de datos o state)
    console.log("Eliminando producto con ID:", productoAEliminar.id);
  };

  const BuscarProductos = (buscar, categoria) => {
    console.log("Categoría:", categoria, "Buscar:", buscar);

    setCategoriaBusqueda(categoria);
    setBuscar(buscar);
    setPagina(1); // Reinicia a la primera página al cambiar la categoría o realizar una búsqueda
  }

  const cambiarTamanioPagina = (e,nuevoTamanio) => {
    console.log("Nuevo tamaño de página:", nuevoTamanio);
    e.preventDefault();
    setTamanioPagina(nuevoTamanio);
    setPagina(1); // Reinicia a la primera página al cambiar el tamaño de página
  }

  const handleEdicionCorrecta = async (payload, idEditandoForm) => {
    try {
      console.log("Edición correcta:", payload, "ID Editando:", idEditandoForm);
      
      if (idEditandoForm) {
          await axiosClient.put(`/producto/${idEditandoForm}`, payload);
      }
      else {
          await axiosClient.post('/producto', payload);
      }
  
      setEditando(false);
      setIdEditando(null);
      setProductoSeleccionado(null);
      
      cargarProductos(); // Recargar productos después de la edición o creación
    } catch (error) {
      console.error('Error al guardar el producto:', error);
    }
  }

  const calcularPaginas = () => {
      // 1. Calculate dynamic boundaries with compensation padding
      let startPage = pagina - 5;
      let endPage = pagina + 5;
      let windowSize = 11; // Total number of pages to display in the pagination bar

      if (windowWidth < 700) {
        windowSize = 6; // Mostrar menos páginas en pantallas pequeñas
      }
      else if (windowWidth >= 700 && windowWidth < 800) {
        windowSize = 8; // Mostrar menos páginas en pantallas pequeñas
      }
      else{
        windowSize = 11; // Mostrar todas las páginas en pantallas grandes
      } 

      // Handle left boundary overflow
      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(totalPaginas, windowSize);
      }

      // Handle right boundary overflow
      if (endPage > totalPaginas) {
        endPage = totalPaginas;
        startPage = Math.max(1, totalPaginas - windowSize + 1);
      }

      // 2. Generate the fixed length array
      const visiblePagesLength = endPage - startPage + 1;
      const visiblePages = Array.from(
        { length: visiblePagesLength }, 
        (_, index) => startPage + index
      );

      return visiblePages;
  }

  const manejarExportarCompleto = async (tipoFormato) => {
  try {
      setCargandoReporte(true);

      const response = await axiosClient.get('/producto', {
        params: {
          buscar: buscar,
          categoria: categoriaBusqueda,
          pagina: 1,
          tamanioPagina: 9999
        }
      });
      
      console.log("Datos obtenidos para exportar:", response);

      await new Promise(resolve => setTimeout(resolve, 5000));

      const todosLosProductos = response.data.items; // Adapta esto según la estructura de tu API

      // 3. Enviamos el listado completo a tus funciones de exportUtils.js
      if (tipoFormato === 'excel') exportarExcel(todosLosProductos);
      if (tipoFormato === 'csv') exportarCSV(todosLosProductos);
      if (tipoFormato === 'pdf') exportarPDF(todosLosProductos);

    } catch (error) {
      console.error("Error al descargar datos para el reporte:", error);
      alert("No se pudo obtener el listado completo de productos para exportar.");
    } finally {
      setCargandoReporte(false);
    }
  };

  const formateadorPrecio = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS', // Puedes cambiarlo por 'USD', 'EUR', etc.
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  function IconoOrdenamiento({ columnaActual, columnaActiva, direccion }) {
    const esActiva = columnaActual === columnaActiva;

    return (
      <svg className="w-5 h-5 ml-2 shrink-0 " aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
        {/* Flecha Superior (Ascendente) */}
        <path 
          className={`transition-colors duration-200 ${esActiva && direccion === 'asc' ? 'text-blue-600' : 'text-slate-300'}`}
          d="M8.574 11.024h6.852a.75.75 0 0 0 .614-1.182L12.614 5.496a.75.75 0 0 0-1.228 0L7.96 9.842a.75.75 0 0 0 .614 1.182Z" 
        />
        {/* Flecha Inferior (Descendente) */}
        <path 
          className={`transition-colors duration-200 ${esActiva && direccion === 'desc' ? 'text-blue-600' : 'text-slate-300'}`}
          d="M8.574 12.976h6.852a.75.75 0 0 1 .614 1.182l-3.426 4.346a.75.75 0 0 1-1.228 0L7.96 14.158a.75.75 0 0 1 .614-1.182Z" 
        />
      </svg>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-3">

      {/* BARRA SUPERIOR: Título y Acción Principal */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-2">
        <div className="flex items-center  gap-2">
          <span className="text-2xl">📦</span>
          <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Gestión de Productos</h1>
        </div>
      </div>
      
      {/* --- BARRA DE BÚSQUEDA Y FILTROS --- */}
      <BuscarProducto onEnviar={BuscarProductos} onCategoriaChange={(categoria) => setCategoriaBusqueda(categoria)} />
      
      {/* Contenedor derecho: Paginación + Acciones de Exportar */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
        <span className="text-sm">Página {pagina} de {totalPaginas || 1}</span>
        {/* Separador vertical visual */}
        <div className="hidden sm:block h-4 w-px bg-slate-200"></div>
        <span className="text-sm">Tamaño de página:</span>
        <select             
          className="text-sm border border-gray-300 rounded-md px-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          value={tamanioPagina}
          onChange={(e) => cambiarTamanioPagina(e, parseInt(e.target.value))}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
          <option value="25">25</option>
        </select>
        <div className="hidden sm:block h-4 w-px bg-slate-200"></div>

        {/* GRUPO DE BOTONES DE EXPORTACIÓN */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
          <span className="text-[10px] uppercase font-bold text-slate-400 px-2">Exportar:</span>
          
          {/* Botón Excel */}
          <button 
            disabled={cargandoReporte}
            onClick={() => manejarExportarCompleto('excel')}
            className="px-2.5 py-1 bg-white hover:bg-green-50 text-green-700 font-semibold rounded-md border
             border-slate-200 shadow-2xs transition cursor-pointer flex items-center gap-1"
          >
            {cargandoReporte ? (
              <div className="w-3.5 h-3.5 border-2 border-green-700 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>📊</span>
            )}
            <span className="hidden sm:inline">Excel</span>
          </button>

          {/* Botón CSV */}
          <button 
            disabled={cargandoReporte}
            onClick={() => manejarExportarCompleto('csv')}
            className="px-2.5 py-1 bg-white hover:bg-blue-50 text-blue-700 font-semibold rounded-md border
             border-slate-200 shadow-2xs transition cursor-pointer flex items-center gap-1"
          >
            {cargandoReporte ? (
              <div className="w-3.5 h-3.5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>📄</span>
            )}
            <span className="hidden sm:inline">CSV</span>
          </button>

          {/* Botón PDF */}
          <button 
            disabled={cargandoReporte}
            onClick={() => manejarExportarCompleto('pdf')}
            className="px-2.5 py-1 bg-white hover:bg-red-50 text-red-700 font-semibold rounded-md border
             border-slate-200 shadow-2xs transition cursor-pointer flex items-center gap-1"
          >
          {cargandoReporte ? (
            <div className="w-3.5 h-3.5 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <span>📕</span>
          )}
          <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
        <div className="hidden sm:block h-4 w-px bg-slate-200"></div>
        <button onClick={manejarNuevoProducto} 
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm 
          font-semibold rounded-lg shadow-sm hover:bg-blue-700 active:bg-blue-800 
          transition cursor-pointer flex items-center justify-center gap-1.5">
          <span>+</span> Nuevo Producto
        </button>
      </div>

      {/* --- TABLA DE PRODUCTOS --- */}
      <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
        <table className="w-full border-collapse bg-white text-left text-sm text-slate-500" >
          <thead className="bg-blue-100 text-xs font-semibold uppercase text-slate-700">
            <tr>
              <th 
                scope="col" 
                onClick={() => manejarOrdenar('nombre')}
                className="px-2 sm:px-6 py-3 cursor-pointer select-none hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center">
                  <span>Producto</span>
                  <IconoOrdenamiento 
                    columnaActual="nombre" 
                    columnaActiva={orden.columna} 
                    direccion={orden.direccion} 
                  />
                </div>
              </th>
              <th 
                scope="col" 
                onClick={() => manejarOrdenar('precio')}
                className="px-2 sm:px-6 py-3 cursor-pointer select-none hover:bg-slate-100 transition-colors text-right"
              >
                {/* Al estar a la derecha, justify-end alinea el conjunto y el SVG queda al final */}
                <div className="flex items-center justify-end">
                  <span>Precio</span>
                  <IconoOrdenamiento 
                    columnaActual="precio" 
                    columnaActiva={orden.columna} 
                    direccion={orden.direccion} 
                  />
                </div>
              </th>
              <th 
                scope="col" 
                onClick={() => manejarOrdenar('categoria')}
                className="px-2 sm:px-6 py-3 cursor-pointer select-none hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center">
                  <span>Categoría</span>
                  <IconoOrdenamiento 
                    columnaActual="categoria" 
                    columnaActiva={orden.columna} 
                    direccion={orden.direccion} 
                  />
                </div>
              </th>
              <th scope="col" className="px-2 sm:px-6 py-3"><span className="hidden sm:flex">Editar</span></th>
              <th scope="col" className="px-2 sm:px-6 py-3"><span className="hidden sm:flex">Eliminar</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 border-t border-slate-200">
            {cargando ?
            (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  <div className="" role="status"></div>
                  <p className="">Cargando productos...</p>
                </td>
              </tr>
            ) :
            productos.length > 0 ?
            (
              productos.map((producto) => (
                <tr className="bg-white even:bg-slate-50 hover:bg-slate-100 transition-colors" key={producto.id}>
                  <td className="px-2 sm:px-6 py-4  font-medium text-slate-900">{producto.nombre}</td>
                  <td className="px-2 sm:px-6 py-4  text-right font-medium text-slate-900 tabular-nums">{formateadorPrecio.format(producto.precio)}</td>
                  <td className="px-2 sm:px-6 py-4">{producto.categoria}</td>
                  <td className="px-2 sm:px-6 py-4">
                    <button onClick={() => handleEditar(producto)} className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer">
                      ✏️
                    </button>
                  </td>
                  <td className="px-2 sm:px-6 py-4">
                    <button onClick={() => handleEliminar(producto)} className="text-red-600 hover:text-red-800 font-medium cursor-pointer">
                      ❌
                    </button>
                  </td>
                </tr> 
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-2 sm:px-6 py-4  font-medium text-slate-900">
                  No se encontraron productos con los filtros seleccionados.
                </td>
              </tr>
            )
            }
          </tbody>
        </table>
      </div>

      <Paginador paginasAMostrar={calcularPaginas()} pagina={pagina} 
        totalPaginas={totalPaginas} onActualizarPagina={(pag) =>setPagina(pag)} />

      <ConfirmarEliminar 
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onConfirm={ejecutarEliminacion}
        nombreItem={productoAEliminar?.nombre || ""}
      />

      {/* ========================================================= */}
      {/* ENVOLTURA DEL PANEL LATERAL FLOTANTE (DRAWER)             */}
      {/* ========================================================= */}
      {isPanelOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 overflow-hidden">
            
            {/* Backdrop: Fondo oscuro que desenfoca la tabla de atrás */}
            <div 
              onClick={cerrarPanel} 
              className={`absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
                animate ? "opacity-100" : "opacity-0"
              }`}
            ></div>

            {/* Contenedor Deslizable */}
            <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
              <div className={`w-screen max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col h-full transform transition-transform duration-300 ease-in-out ${
                  animate ? "translate-x-0" : "translate-x-full"
                }`}>
                
                {/* Cabecera Estática del Panel */}
                <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {idEditando ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                  </div>
                  <button onClick={cerrarPanel} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    ✕
                  </button>
                </div>

                {/* TU COMPONENTE ORIGINAL CON REACT HOOK FORM */}
                {/* Se renderiza de manera limpia ocupando el resto del cuerpo */}
                <div className="flex-1 overflow-hidden">
                  <FormProductos 
                    producto={productoSeleccionado} 
                    idEditando={idEditando} 
                    editando={editando} 
                    onEdicionCorrecta={handleEdicionCorrecta}
                    onCerrar={cerrarPanel} /> 
                </div>

              </div>
            </div>

          </div>
        </div>
      )}



    </div>);
}

export default GestionProductos;