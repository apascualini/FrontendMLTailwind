import { createBrowserRouter } from "react-router-dom";
import GestionProductos from "../GestionProductos";
import Inicio from "../Inicio";
import LayoutPrincipal from "../layouts/LayoutPrincipal";

const router = createBrowserRouter([
    {
        // 1. La ruta raíz carga el contenedor estructural con el Navbar
        path: "/",
        element: <LayoutPrincipal />,
        // 2. Las rutas hijas se renderizan dentro del <Outlet /> del Layout
        children: [
            {
              path: "/",
              element: <Inicio />,
            },
            {
              path: "/productos",
              element: <GestionProductos />,
            }
        ],
    },
]);

export default router;



