import { createBrowserRouter, Navigate } from "react-router";
import RootLayout from "./components/root-layout";
import { Login } from "./pages/login";
import { LoginBrandProvider } from "./contexts/brand-context";
import ModulesPage from "./pages/modules";
import ModuleConfigDetailPage from "./pages/module-config-detail";
import SubscriptionAdminPage from "./pages/subscription-admin";
import PlanConfigurationPage from "./pages/plan-configuration";
import MenuManagementPage from "./pages/menu-management";
import ModuleConfigurationPage from "./pages/module-configuration";
import ModuleComprasDetail from "./pages/module-compras-detail";
import ModuleVentasDetail from "./pages/module-ventas-detail";
import ModulePosDetail from "./pages/module-pos-detail";
import ModuleInventoryDetail from "./pages/module-inventory-detail";
import ModuleAccountingDetail from "./pages/module-accounting-detail";
import { ModuleClientesDetail } from "./pages/module-clientes-detail";
import { ModuleEmpleadosDetail } from "./pages/module-empleados-detail";
import AdminLayout from "./components/admin-layout";
import AdminWelcomePage from "./pages/admin-welcome";
import { RouteError } from "./components/route-error";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteError />,
    children: [
      // ── Login ─────────────────────────────────────────────────────────────
      {
        path: "/",
        element: (
          <LoginBrandProvider>
            <Login />
          </LoginBrandProvider>
        ),
      },

      // ── Panel Super Admin ──────────────────────────────────────────────────
      {
        path: "/admin",
        element: <AdminLayout />,
        errorElement: <RouteError />,
        children: [
          { index: true,                   element: <AdminWelcomePage /> },
          { path: "companies",             element: <SubscriptionAdminPage /> },
          { path: "plan-configuration",    element: <PlanConfigurationPage /> },
          { path: "menu-management",       element: <MenuManagementPage /> },
          { path: "module-configuration",  element: <ModuleConfigurationPage /> },
        ],
      },

      // ── Módulos (selector) ─────────────────────────────────────────────────
      { path: "/modules", element: <ModulesPage /> },

      // ── Configuración con sidebar ──────────────────────────────────────────
      // URL: /module-config-detail/{menuId}/{sectionId}
      // Ej:  /module-config-detail/general-settings/branches
      {
        path: "/module-config-detail/:menuId",
        element: <ModuleConfigDetailPage />,
      },
      {
        path: "/module-config-detail/:menuId/:sectionId",
        element: <ModuleConfigDetailPage />,
      },

      // ── Compras ────────────────────────────────────────────────────────────
      { path: "/module-compras-detail/:tab", element: <ModuleComprasDetail /> },
      { path: "/module-compras-detail", element: <Navigate to="/module-compras-detail/inicio" replace /> },

      // ── Ventas ─────────────────────────────────────────────────────────────
      { path: "/module-ventas-detail/:tab", element: <ModuleVentasDetail /> },
      { path: "/module-ventas-detail", element: <Navigate to="/module-ventas-detail/inicio" replace /> },

      // ── Punto de Venta ─────────────────────────────────────────────────────
      { path: "/module-pos-detail/:tab", element: <ModulePosDetail /> },

      // ── Inventario ─────────────────────────────────────────────────────────
      { path: "/module-inventory-detail/:tab", element: <ModuleInventoryDetail /> },
      { path: "/module-inventory-detail", element: <Navigate to="/module-inventory-detail/inicio" replace /> },

      // ── Contabilidad ───────────────────────────────────────────────────────
      { path: "/module-accounting-detail/:tab", element: <ModuleAccountingDetail /> },
      { path: "/module-accounting-detail", element: <Navigate to="/module-accounting-detail/inicio" replace /> },

      // ── Clientes ───────────────────────────────────────────────────────────
      { path: "/module-clientes-detail/:tab", element: <ModuleClientesDetail /> },
      { path: "/module-clientes-detail", element: <Navigate to="/module-clientes-detail/inicio" replace /> },

      // ── Empleados ──────────────────────────────────────────────────────────
      { path: "/module-empleados-detail/:tab", element: <ModuleEmpleadosDetail /> },
      { path: "/module-empleados-detail", element: <Navigate to="/module-empleados-detail/inicio" replace /> },

      // ── Redirects para URLs base sin parámetros obligatorios ───────────────
      {
        path: "/module-config-detail",
        element: <Navigate to="/module-config-detail/general-settings" replace />,
      },
      {
        path: "/module-pos-detail",
        element: <Navigate to="/module-pos-detail/pos" replace />,
      },

      // ── Catch-all: cualquier ruta desconocida → login ──────────────────────
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);