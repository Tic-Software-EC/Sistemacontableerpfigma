import { useState, useMemo } from "react";
import {
  ShoppingBag,
  TrendingDown,
  DollarSign,
  Package,
  Download,
  Printer,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Users,
  FileText,
  Truck,
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

export function ReportesComprasTab() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [periodo, setPeriodo] = useState("mes-actual");

  // Generar ID único para este componente
  const chartId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

  // Datos para gráficos
  const comprasMensuales = [
    { id: 1, mes: "Ene", compras: 285400, ordenes: 145, productos: 1850 },
    { id: 2, mes: "Feb", compras: 312800, ordenes: 168, productos: 2120 },
    { id: 3, mes: "Mar", compras: 298600, ordenes: 156, productos: 1980 },
    { id: 4, mes: "Abr", compras: 345900, ordenes: 182, productos: 2340 },
    { id: 5, mes: "May", compras: 328500, ordenes: 174, productos: 2200 },
    { id: 6, mes: "Jun", compras: 367200, ordenes: 195, productos: 2510 },
  ];

  const comprasPorProveedor = [
    { id: 1, proveedor: "Tech Solutions S.A.", compras: 125600, ordenes: 45 },
    { id: 2, proveedor: "Distribuidora Global", compras: 98400, ordenes: 38 },
    { id: 3, proveedor: "Import Express Ltda.", compras: 87200, ordenes: 32 },
    { id: 4, proveedor: "Mayorista del Norte", compras: 73500, ordenes: 28 },
    { id: 5, proveedor: "Otros Proveedores", compras: 145800, ordenes: 52 },
  ];

  const comprasPorCategoria = [
    { id: 1, name: "Electrónica", value: 38, color: "#E8692E" },
    { id: 2, name: "Insumos", value: 25, color: "#3B82F6" },
    { id: 3, name: "Materiales", value: 22, color: "#10B981" },
    { id: 4, name: "Servicios", value: 15, color: "#F59E0B" },
  ];

  const estadoOrdenes = [
    { id: 1, estado: "Recibido", cantidad: 142, valor: 285600 },
    { id: 2, estado: "En Tránsito", cantidad: 38, valor: 67200 },
    { id: 3, estado: "Pendiente", cantidad: 15, valor: 14400 },
  ];

  const estadisticas = [
    {
      label: "Total Compras",
      value: "$367,200",
      cambio: "+11.8%",
      tendencia: "up",
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Órdenes de Compra",
      value: "195",
      cambio: "+12.1%",
      tendencia: "up",
      icon: FileText,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Proveedores Activos",
      value: "42",
      cambio: "+5.0%",
      tendencia: "up",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      label: "Productos Recibidos",
      value: "2,510",
      cambio: "+14.1%",
      tendencia: "up",
      icon: Package,
      color: "text-primary",
      bg: "bg-primary/10",
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
            {payload[0].payload.mes || payload[0].payload.proveedor || payload[0].payload.estado || payload[0].payload.name}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={`${entry.dataKey}-${index}`} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && entry.value > 1000 ? `$${entry.value.toLocaleString()}` : entry.value}
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
            Dashboard de Compras
          </h2>
          <p
            className={`text-sm ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Análisis gerencial de adquisiciones y proveedores
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
        {/* Evolución de Compras */}
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
            Evolución de Compras Mensuales
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={comprasMensuales}>
              <defs>
                <linearGradient id="colorCompras" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
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
                dataKey="compras"
                stroke="#3B82F6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCompras)"
                name="Compras"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Compras por Categoría */}
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
            Distribución por Categoría
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={comprasPorCategoria}
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
                {comprasPorCategoria.map((entry) => (
                  <Cell key={`cell-${entry.id}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Proveedores */}
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
            Top Proveedores
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comprasPorProveedor} layout="vertical">
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
                dataKey="proveedor"
                type="category"
                width={150}
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "11px" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="compras" fill="#E8692E" radius={[0, 8, 8, 0]} name="Compras" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Estado de Órdenes */}
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
            Estado de Órdenes de Compra
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={estadoOrdenes}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isLight ? "#e5e7eb" : "#374151"}
              />
              <XAxis
                dataKey="estado"
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "12px" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="cantidad" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Órdenes" />
              <Bar dataKey="valor" fill="#10B981" radius={[8, 8, 0, 0]} name="Valor" />
            </BarChart>
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
              <ShoppingBag className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Volumen Creciente
              </p>
              <p className="text-xs text-blue-600">
                Las compras aumentaron 11.8% reflejando expansión del negocio
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
              <Truck className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Entregas a Tiempo
              </p>
              <p className="text-xs text-green-600">
                El 73% de las órdenes fueron recibidas según lo planificado
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
                Proveedores Clave
              </p>
              <p className="text-xs text-primary">
                5 proveedores concentran el 68% del volumen total de compras
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
