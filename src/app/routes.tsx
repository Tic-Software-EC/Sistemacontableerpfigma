import { createBrowserRouter, Navigate } from "react-router";
import { Login } from "./pages/login";
import ModulesPage from "./pages/modules";
import ModuleDetailPage from "./pages/module-detail";
import ModuleConfigDetailPage from "./pages/module-detail";
import SubscriptionAdminPage from "./pages/subscription-admin";
import SubscriptionsManagementPage from "./pages/subscriptions-management";
import PlanConfigurationPage from "./pages/plan-configuration";
import MenuManagementPage from "./pages/menu-management";
import ModuleConfigurationPage from "./pages/module-configuration";
import { DashboardLayout } from "./components/dashboard-layout";
import { Dashboard } from "./pages/dashboard";
import { Invoices } from "./pages/invoices";
import { Clients } from "./pages/clients";
import { Reports } from "./pages/reports";
import { Inventory } from "./pages/inventory";
import { Settings } from "./pages/settings";
import ModuleComprasDetail from "./pages/module-compras-detail";
import ModulePosDetail from "./pages/module-pos-detail";
import { POS } from "./pages/pos";

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
    path: "/module-detail",
    element: <ModuleDetailPage />,
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
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: "facturas",
        element: <Invoices />,
      },
      {
        path: "clientes",
        element: <Clients />,
      },
      {
        path: "reportes",
        element: <Reports />,
      },
      {
        path: "inventory",
        element: <Inventory />,
      },
      {
        path: "configuracion",
        element: <Settings />,
      },
      {
        path: "compras",
        element: <ModuleComprasDetail />,
      },
      {
        path: "pos",
        element: <ModulePosDetail />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);