import { useState } from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Download,
  Printer,
  Calendar,
  Filter,
  ChevronDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { useTheme } from "../../contexts/theme-context";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export function ReportesClientesTab() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [periodo, setPeriodo] = useState("mes-actual");

  // Datos para gráficos
  const ventasMensuales = [
    { id: 1, mes: "Ene", ventas: 45800, clientes: 89 },
    { id: 2, mes: "Feb", ventas: 52300, clientes: 95 },
    { id: 3, mes: "Mar", ventas: 48900, clientes: 92 },
    { id: 4, mes: "Abr", ventas: 61200, clientes: 108 },
    { id: 5, mes: "May", ventas: 58700, clientes: 102 },
    { id: 6, mes: "Jun", ventas: 67400, clientes: 115 },
  ];

  const topClientes = [
    { id: 1, nombre: "Distribuidora Norte", valor: 125800, porcentaje: 25 },
    { id: 2, nombre: "Comercial Sur", valor: 98500, porcentaje: 20 },
    { id: 3, nombre: "Importadora Pacífico", valor: 87200, porcentaje: 18 },
    { id: 4, nombre: "Retail Express", valor: 65300, porcentaje: 13 },
    { id: 5, nombre: "Otros", valor: 119200, porcentaje: 24 },
  ];

  const segmentacionClientes = [
    { id: 1, name: "VIP", value: 35, color: "#E8692E" },
    { id: 2, name: "Mayoristas", value: 28, color: "#3B82F6" },
    { id: 3, name: "Regulares", value: 37, color: "#10B981" },
  ];

  const crecimientoClientes = [
    { id: 1, mes: "Ene", nuevos: 12, activos: 245, inactivos: 8 },
    { id: 2, mes: "Feb", nuevos: 18, activos: 255, inactivos: 6 },
    { id: 3, mes: "Mar", nuevos: 15, activos: 264, inactivos: 7 },
    { id: 4, mes: "Abr", nuevos: 22, activos: 279, inactivos: 5 },
    { id: 5, mes: "May", nuevos: 19, activos: 293, inactivos: 6 },
    { id: 6, mes: "Jun", nuevos: 25, activos: 312, inactivos: 4 },
  ];

  const estadisticas = [
    {
      label: "Total Clientes",
      value: "1,247",
      cambio: "+12.5%",
      tendencia: "up",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Clientes Activos",
      value: "892",
      cambio: "+8.3%",
      tendencia: "up",
      icon: TrendingUp,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Facturación Total",
      value: "$496,000",
      cambio: "+15.2%",
      tendencia: "up",
      icon: DollarSign,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Ticket Promedio",
      value: "$556",
      cambio: "+3.8%",
      tendencia: "up",
      icon: ShoppingBag,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`px-3 py-2 rounded-lg shadow-lg border ${
            isLight
              ? "bg-white border-gray-200"
              : "bg-card border-white/10"
          }`}
        >
          <p className={`text-xs font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
            {payload[0].payload.mes || payload[0].payload.nombre}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header con controles */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h2
            className={`text-2xl font-bold ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Dashboard de Clientes
          </h2>
          <p
            className={`text-sm ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Análisis gerencial del comportamiento y rendimiento
          </p>
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className={`px-3 py-1.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-primary/50 ${
                isLight
                  ? "bg-white border-gray-200 text-gray-900"
                  : "bg-secondary border-white/10 text-white"
              }`}
            >
              <option value="semana">Última Semana</option>
              <option value="mes-actual">Mes Actual</option>
              <option value="trimestre">Trimestre</option>
              <option value="anio">Año</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <button
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isLight
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                : "bg-white/5 hover:bg-white/10 text-gray-300"
            }`}
          >
            <Printer className="w-4 h-4" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20">
            <Download className="w-4 h-4" />
            Exportar
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estadisticas.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-xl border p-4 ${
                isLight
                  ? "bg-white border-gray-200"
                  : "bg-card border-white/10"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className="flex items-center gap-1">
                  {stat.tendencia === "up" ? (
                    <ArrowUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-xs font-medium ${
                      stat.tendencia === "up"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stat.cambio}
                  </span>
                </div>
              </div>
              <div
                className={`text-2xl font-bold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                {stat.value}
              </div>
              <div
                className={`text-xs ${
                  isLight ? "text-gray-500" : "text-gray-400"
                }`}
              >
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Ventas Mensuales */}
        <div
          className={`rounded-xl border p-6 ${
            isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Evolución de Ventas por Cliente
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={ventasMensuales}>
              <defs>
                <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8692E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E8692E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isLight ? "#e5e7eb" : "#374151"}
              />
              <XAxis
                dataKey="mes"
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "12px" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="ventas"
                stroke="#E8692E"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVentas)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Segmentación */}
        <div
          className={`rounded-xl border p-6 ${
            isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Segmentación de Clientes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={segmentacionClientes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {segmentacionClientes.map((entry) => (
                  <Cell key={`cell-${entry.id}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Clientes */}
        <div
          className={`rounded-xl border p-6 ${
            isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Top 5 Clientes por Facturación
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topClientes} layout="vertical">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isLight ? "#e5e7eb" : "#374151"}
              />
              <XAxis
                type="number"
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                dataKey="nombre"
                type="category"
                width={150}
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "12px" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="valor" fill="#E8692E" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Crecimiento de Clientes */}
        <div
          className={`rounded-xl border p-6 ${
            isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
          }`}
        >
          <h3
            className={`text-lg font-semibold mb-4 ${
              isLight ? "text-gray-900" : "text-white"
            }`}
          >
            Crecimiento de Clientes
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={crecimientoClientes}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isLight ? "#e5e7eb" : "#374151"}
              />
              <XAxis
                dataKey="mes"
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "12px" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="nuevos"
                stroke="#10B981"
                strokeWidth={2}
                name="Nuevos"
              />
              <Line
                type="monotone"
                dataKey="activos"
                stroke="#E8692E"
                strokeWidth={2}
                name="Activos"
              />
              <Line
                type="monotone"
                dataKey="inactivos"
                stroke="#EF4444"
                strokeWidth={2}
                name="Inactivos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights gerenciales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`rounded-xl border p-5 ${
            isLight
              ? "bg-gradient-to-br from-blue-50 to-white border-blue-200"
              : "bg-gradient-to-br from-blue-500/10 to-card border-blue-500/20"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Tendencia Positiva
              </p>
              <p className="text-xs text-blue-600">
                El crecimiento de clientes activos aumentó 12% este mes
              </p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl border p-5 ${
            isLight
              ? "bg-gradient-to-br from-green-50 to-white border-green-200"
              : "bg-gradient-to-br from-green-500/10 to-card border-green-500/20"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Mayor Facturación
              </p>
              <p className="text-xs text-green-600">
                Junio registró el mayor volumen de ventas del año
              </p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl border p-5 ${
            isLight
              ? "bg-gradient-to-br from-orange-50 to-white border-orange-200"
              : "bg-gradient-to-br from-orange-500/10 to-card border-orange-500/20"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Clientes VIP
              </p>
              <p className="text-xs text-primary">
                35% de los clientes son VIP generando el 60% de ingresos
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}