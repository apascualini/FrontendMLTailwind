import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="">
      <div className="pb-3 flex-row px-6">
        <div className="">
          <p className="max-w-6xl mx-auto flex justify-center bg-gray-200 text-gray-500 text-lg font-bold">Arieliten S.A.</p>
        </div>
        <div className="max-w-6xl mx-auto bg-gray-100">
          <div className="max-w-2xl mx-auto py-3 space-x-3 bg-gray-100">
            {/* NavLink añade la clase 'active' de forma automática si la URL coincide con el 'to' */}
            <NavLink className="p-2 text-gray-600 text-lg hover:bg-gray-300" to="/">Inicio</NavLink>
            <NavLink className="p-2 text-gray-600 text-lg hover:bg-gray-300" to="/productos">Productos</NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}