import { useState } from "react";
import { useNavigate, useParams } from "react-router"; // React Router v7
import {
  ArrowLeft,
  BarChart3,
  Moon,
  Sun,
  Home,
  FileText,
  TrendingUp,
  Package,
  ShoppingCart,
  CreditCard,
  Calculator,
  Users,
  Bell,
  UserCog,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { ReportesClientesTab } from "../components/reportes/reportes-clientes-tab";
import { ReportesInventarioTab } from "../components/reportes/reportes-inventario-tab";
import { ReportesVentasTab } from "../components/reportes/reportes-ventas-tab";
import { ReportesComprasTab } from "../components/reportes/reportes-compras-tab";
import { ReportesCajaBancosTab } from "../components/reportes/reportes-caja-bancos-tab";
import { ReportesContabilidadTab } from "../components/reportes/reportes-contabilidad-tab";
import { ReportesEmpleadosTab } from "../components/reportes/reportes-empleados-tab";

// Módulo de Reportes - TicSoftEc - Updated

export function ModuleReportesDetail() {
  const navigate = useNavigate();
  const params = useParams<{ tab?: string }>();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  const validTabs = [
    "inicio",
    "clientes",
    "empleados",
    "inventario",
    "ventas",
    "compras",
    "caja-bancos",
    "contabilidad",
  ];

  type TabType = typeof validTabs[number];
  const activeTab: TabType = validTabs.includes(params.tab as TabType)
    ? (params.tab as TabType)
    : "inicio";
  const setActiveTab = (tab: TabType) => {
    navigate(`/module-reportes-detail/${tab}`, { replace: true });
  };

  const navItems = [
    { id: "inicio" as const, label: "Inicio", icon: Home },
    { id: "clientes" as const, label: "Clientes", icon: Users },
    { id: "empleados" as const, label: "Empleados", icon: UserCog },
    { id: "inventario" as const, label: "Inventario", icon: Package },
    { id: "ventas" as const, label: "Ventas", icon: ShoppingCart },
    { id: "compras" as const, label: "Compras", icon: TrendingUp },
    { id: "caja-bancos" as const, label: "Caja y Bancos", icon: CreditCard },
    { id: "contabilidad" as const, label: "Contabilidad", icon: Calculator },
  ];

  const reportesCards = [
    {
      id: "clientes",
      titulo: "Reportes de Clientes",
      descripcion: "Análisis completo del comportamiento y rendimiento de clientes",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      caracteristicas: [
        "Análisis de facturación por cliente",
        "Cuentas por cobrar detalladas",
        "Ranking de clientes más rentables",
        "Tendencias de compra y fidelización",
      ],
    },
    {
      id: "empleados",
      titulo: "Reportes de Empleados",
      descripcion: "Análisis de recursos humanos, nómina y desempeño laboral",
      icon: UserCog,
      color: "from-indigo-500 to-indigo-600",
      caracteristicas: [
        "Nómina mensual y evolución salarial",
        "Análisis de desempeño por área",
        "Distribución por departamentos",
        "Ranking de empleados top por ventas",
      ],
    },
    {
      id: "inventario",
      titulo: "Reportes de Inventario",
      descripcion: "Control total de existencias y movimientos de productos",
      icon: Package,
      color: "from-orange-500 to-orange-600",
      caracteristicas: [
        "Estado actual de existencias",
        "Productos con stock bajo o agotado",
        "Valoración total de inventario",
        "Análisis de rotación de productos",
      ],
    },
    {
      id: "ventas",
      titulo: "Reportes de Ventas",
      descripcion: "Visualización de rendimiento comercial y tendencias de mercado",
      icon: ShoppingCart,
      color: "from-green-500 to-green-600",
      caracteristicas: [
        "Ventas por período y comparativas",
        "Rendimiento por vendedor",
        "Análisis de productos más vendidos",
        "Márgenes de utilidad por línea",
      ],
    },
    {
      id: "compras",
      titulo: "Reportes de Compras",
      descripcion: "Gestión y análisis de órdenes de compra y proveedores",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
      caracteristicas: [
        "Órdenes de compra por proveedor",
        "Cuentas por pagar pendientes",
        "Análisis de costos de adquisición",
        "Evaluación de proveedores",
      ],
    },
    {
      id: "caja-bancos",
      titulo: "Reportes de Caja y Bancos",
      descripcion: "Control financiero de flujos de efectivo y saldos bancarios",
      icon: CreditCard,
      color: "from-cyan-500 to-cyan-600",
      caracteristicas: [
        "Flujo de efectivo consolidado",
        "Saldos por cuenta bancaria",
        "Conciliaciones bancarias",
        "Proyecciones de tesorería",
      ],
    },
    {
      id: "contabilidad",
      titulo: "Reportes Contables",
      descripcion: "Estados financieros y libros contables del sistema",
      icon: Calculator,
      color: "from-pink-500 to-pink-600",
      caracteristicas: [
        "Balance general consolidado",
        "Estado de resultados",
        "Libro mayor y diario",
        "Análisis de cuentas contables",
      ],
    },
  ];

  return (
    <div
      className={`min-h-screen ${
        isLight ? "bg-gray-50" : "bg-[#0D1B2A]"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-50 border-b ${
          isLight
            ? "bg-white border-gray-200"
            : "bg-[#0D1B2A] border-white/10"
        }`}
      >
        {/* Fila principal del header */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Izquierda: botón volver + logo/título */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/modules")}
              className={`p-2 rounded-lg transition-colors ${
                isLight
                  ? "text-gray-600 hover:text-primary hover:bg-gray-100"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className={`font-bold text-xl ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Comercial del Pacífico S.A.
                </h1>
                <p
                  className={`text-xs ${
                    isLight ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Reportes
                </p>
              </div>
            </div>
          </div>

          {/* Derecha: acciones y usuario */}
          <div className="flex items-center gap-3">
            {/* Toggle tema */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${
                isLight
                  ? "text-gray-600 hover:text-primary hover:bg-gray-100"
                  : "text-gray-400 hover:text-primary hover:bg-white/5"
              }`}
              title={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
            >
              {isLight ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Notificaciones */}
            <button
              className={`p-2 rounded-lg transition-colors relative ${
                isLight
                  ? "text-gray-600 hover:text-primary hover:bg-gray-100"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* Usuario */}
            <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">JP</span>
              </div>
              <div className="hidden md:block text-left">
                <p
                  className={`text-sm font-medium ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}
                >
                  Juan Pérez
                </p>
                <p
                  className={`text-xs ${
                    isLight ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Vendedor • Matriz
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs horizontales */}
        <div
          className={`px-6 border-t ${
            isLight ? "border-gray-200" : "border-white/10"
          }`}
        >
          <div className="flex items-center gap-0 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all -mb-px ${
                    isActive
                      ? `border-primary ${
                          isLight ? "text-primary bg-primary/5" : "text-primary"
                        }`
                      : `border-transparent ${
                          isLight
                            ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                            : "text-gray-500 hover:text-gray-300"
                        }`
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-primary" : ""}`}
                  />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Contenido */}
      <main className="p-6">
        {activeTab === "inicio" && (
          <div>
            {/* Bienvenida al módulo */}
            <div className={`mb-8 border rounded-xl p-8 text-center ${
              isLight 
                ? "bg-gradient-to-br from-blue-50 to-white border-blue-200" 
                : "bg-gradient-to-br from-blue-500/10 to-secondary border-blue-500/20"
            }`}>
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-9 h-9 text-white" />
              </div>
              <h2 className={`text-2xl font-bold mb-2 ${
                isLight ? "text-gray-900" : "text-white"
              }`}>Módulo de Reportes</h2>
              <p className={`text-sm max-w-2xl mx-auto ${
                isLight ? "text-gray-600" : "text-gray-400"
              }`}>
                Sistema completo para la generación de reportes gerenciales, análisis de datos y dashboards ejecutivos
                con información en tiempo real de todos los módulos del sistema
              </p>
            </div>

            {/* Grid de submódulos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportesCards.map((reporte) => {
                const Icon = reporte.icon;
                return (
                  <button
                    key={reporte.id}
                    onClick={() => setActiveTab(reporte.id as TabType)}
                    className={`text-left border rounded-xl p-6 transition-all hover:scale-[1.02] ${
                      isLight 
                        ? "bg-white border-gray-200 hover:border-primary hover:shadow-lg" 
                        : "bg-secondary border-white/10 hover:border-primary/50 hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${reporte.color}`}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-lg mb-2 ${
                          isLight ? "text-gray-900" : "text-white"
                        }`}>
                          {reporte.titulo}
                        </h3>
                        <p className={`text-sm mb-4 ${
                          isLight ? "text-gray-600" : "text-gray-400"
                        }`}>
                          {reporte.descripcion}
                        </p>
                        <ul className="space-y-2">
                          {reporte.caracteristicas.map((caracteristica, idx) => (
                            <li
                              key={idx}
                              className={`text-xs flex items-start gap-2 ${
                                isLight ? "text-gray-600" : "text-gray-400"
                              }`}
                            >
                              <span className="text-primary mt-0.5">✓</span>
                              <span>{caracteristica}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "clientes" && <ReportesClientesTab />}
        {activeTab === "empleados" && <ReportesEmpleadosTab />}
        {activeTab === "inventario" && <ReportesInventarioTab />}
        {activeTab === "ventas" && <ReportesVentasTab />}
        {activeTab === "compras" && <ReportesComprasTab />}
        {activeTab === "caja-bancos" && <ReportesCajaBancosTab />}
        {activeTab === "contabilidad" && <ReportesContabilidadTab />}
      </main>
    </div>
  );
}