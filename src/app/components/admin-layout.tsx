import { Outlet } from "react-router";
import { AdminBrandProvider } from "../contexts/brand-context";

/**
 * Layout que envuelve todas las rutas /admin/*.
 * Fuerza los colores corporativos por defecto (sin personalización de empresa).
 */
export default function AdminLayout() {
  return (
    <AdminBrandProvider>
      <Outlet />
    </AdminBrandProvider>
  );
}
