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
import ModulePosDetail from "./pages/module-pos-detail";
import ModuleInventoryDetail from "./pages/module-inventory-detail";
import AdminLayout from "./components/admin-layout";
import AdminWelcomePage from "./pages/admin-welcome";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: (
          <LoginBrandProvider>
            <Login />
          </LoginBrandProvider>
        ),
      },
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          { index: true,                        element: <AdminWelcomePage /> },
          { path: "companies",                  element: <SubscriptionAdminPage /> },
          { path: "subscriptions-management",   element: <Navigate to="/admin/companies" replace /> },
          { path: "plan-configuration",         element: <PlanConfigurationPage /> },
          { path: "menu-management",            element: <MenuManagementPage /> },
          { path: "plans-config",               element: <PlanConfigurationPage /> },
          { path: "module-configuration",       element: <ModuleConfigurationPage /> },
        ],
      },
      { path: "/modules",                        element: <ModulesPage /> },
      { path: "/module-config-detail",           element: <ModuleConfigDetailPage /> },
      { path: "/module-compras-detail",          element: <ModuleComprasDetail /> },
      { path: "/module-pos-detail",              element: <ModulePosDetail /> },
      { path: "/module-inventory-detail",        element: <ModuleInventoryDetail /> },
      { path: "*",                               element: <Navigate to="/" replace /> },
    ],
  },
]);