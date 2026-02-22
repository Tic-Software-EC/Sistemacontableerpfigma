import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./pages/login";
import ModulesPage from "./pages/modules";
import ModuleConfigDetailPage from "./pages/module-config-detail";
import SubscriptionAdminPage from "./pages/subscription-admin";
import SubscriptionsManagementPage from "./pages/subscriptions-management";
import PlanConfigurationPage from "./pages/plan-configuration";
import MenuManagementPage from "./pages/menu-management";
import ModuleConfigurationPage from "./pages/module-configuration";
import ModuleComprasDetail from "./pages/module-compras-detail";
import ModulePosDetail from "./pages/module-pos-detail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/admin/companies",
    element: <SubscriptionAdminPage />,
  },
  {
    path: "/admin/subscriptions",
    element: <SubscriptionAdminPage />,
  },
  {
    path: "/admin/subscriptions-management",
    element: <SubscriptionsManagementPage />,
  },
  {
    path: "/admin/plan-configuration",
    element: <PlanConfigurationPage />,
  },
  {
    path: "/admin/menu-management",
    element: <MenuManagementPage />,
  },
  {
    path: "/admin/plans-config",
    element: <PlanConfigurationPage />,
  },
  {
    path: "/admin/module-configuration",
    element: <ModuleConfigurationPage />,
  },
  {
    path: "/modules",
    element: <ModulesPage />,
  },
  {
    path: "/module-config-detail",
    element: <ModuleConfigDetailPage />,
  },
  {
    path: "/module-compras-detail",
    element: <ModuleComprasDetail />,
  },
  {
    path: "/module-pos-detail",
    element: <ModulePosDetail />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);