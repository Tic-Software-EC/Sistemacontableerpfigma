import { useState, useMemo } from "react";
import {
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Users,
  Download,
  Printer,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  CreditCard,
  Target,
  Award,
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
  ComposedChart,
} from "recharts";

export function ReportesVentasTab() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [periodo, setPeriodo] = useState("mes-actual");

  // Generar ID único para este componente
  const chartId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

  // Datos para gráficos
  const ventasMensuales = [
    { id: 1, mes: "Ene", ventas: 425800, transacciones: 1520, meta: 400000 },
    { id: 2, mes: "Feb", ventas: 478300, transacciones: 1680, meta: 450000 },
    { id: 3, mes: "Mar", ventas: 512900, transacciones: 1790, meta: 480000 },
    { id: 4, mes: "Abr", ventas: 589200, transacciones: 1950, meta: 520000 },
    { id: 5, mes: "May", ventas: 556700, transacciones: 1870, meta: 550000 },
    { id: 6, mes: "Jun", ventas: 625400, transacciones: 2100, meta: 580000 },
  ];

  const ventasPorVendedor = [
    { id: 1, vendedor: "Juan Pérez", ventas: 185600, comision: 9280 },
    { id: 2, vendedor: "María González", ventas: 156400, comision: 7820 },
    { id: 3, vendedor: "Carlos López", ventas: 142800, comision: 7140 },
    { id: 4, vendedor: "Ana Martínez", ventas: 128900, comision: 6445 },
    { id: 5, vendedor: "Roberto Silva", ventas: 98600, comision: 4930 },
  ];

  const ventasPorCategoria = [
    { id: 1, name: "Electrónica", value: 42, color: "#E8692E" },
    { id: 2, name: "Accesorios", value: 28, color: "#3B82F6" },
    { id: 3, name: "Oficina", value: 18, color: "#10B981" },
    { id: 4, name: "Hogar", value: 12, color: "#F59E0B" },
  ];

  const metodosPago = [
    { id: 1, metodo: "Efectivo", cantidad: 485, monto: 125600 },
    { id: 2, metodo: "Tarjeta", cantidad: 892, monto: 285400 },
    { id: 3, metodo: "Transferencia", cantidad: 356, monto: 189500 },
    { id: 4, metodo: "Cheque", cantidad: 114, monto: 48900 },
  ];

  const estadisticas = [
    {
      label: "Ventas Totales",
      value: "$625,400",
      cambio: "+12.4%",
      tendencia: "up",
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Transacciones",
      value: "2,100",
      cambio: "+8.7%",
      tendencia: "up",
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Ticket Promedio",
      value: "$298",
      cambio: "+5.2%",
      tendencia: "up",
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Clientes Únicos",
      value: "892",
      cambio: "+15.3%",
      tendencia: "up",
      icon: Users,
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
            {payload[0].payload.mes || payload[0].payload.vendedor || payload[0].payload.metodo || payload[0].payload.name}
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
            Dashboard de Ventas
          </h2>
          <p
            className={`text-sm ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Análisis gerencial de ingresos, rendimiento y cumplimiento
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
        {/* Ventas vs Meta */}
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
            Ventas vs Meta Mensual
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={ventasMensuales}>
              <defs>
                <linearGradient id="colorVentasTab" x1="0" y1="0" x2="0" y2="1">
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
              <Legend />
              <Area
                type="monotone"
                dataKey="ventas"
                stroke="#E8692E"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVentasTab)"
                name="Ventas"
              />
              <Line
                type="monotone"
                dataKey="meta"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 4 }}
                name="Meta"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Ventas por Categoría */}
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
                data={ventasPorCategoria}
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
                {ventasPorCategoria.map((entry) => (
                  <Cell key={`cell-${entry.id}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top Vendedores */}
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
            Ranking de Vendedores
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ventasPorVendedor} layout="vertical">
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
                dataKey="vendedor"
                type="category"
                width={120}
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "11px" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ventas" fill="#E8692E" radius={[0, 8, 8, 0]} name="Ventas" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Métodos de Pago */}
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
            Métodos de Pago
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metodosPago}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isLight ? "#e5e7eb" : "#374151"}
              />
              <XAxis
                dataKey="metodo"
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "12px" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="cantidad" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Transacciones" />
              <Bar dataKey="monto" fill="#10B981" radius={[8, 8, 0, 0]} name="Monto" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Insights gerenciales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className={`rounded-xl border p-5 ${
            isLight
              ? "bg-gradient-to-br from-green-50 to-white border-green-200"
              : "bg-gradient-to-br from-green-500/10 to-card border-green-500/20"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Target className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Meta Superada
              </p>
              <p className="text-xs text-green-600">
                Se superó la meta mensual en un 7.8% generando $45,400 adicionales
              </p>
            </div>
          </div>
        </div>

        <div
          className={`rounded-xl border p-5 ${
            isLight
              ? "bg-gradient-to-br from-blue-50 to-white border-blue-200"
              : "bg-gradient-to-br from-blue-500/10 to-card border-blue-500/20"
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <CreditCard className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Tarjetas Dominan
              </p>
              <p className="text-xs text-blue-600">
                El 45% de las transacciones se realizan con tarjeta de crédito/débito
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
              <Award className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Top Vendedor
              </p>
              <p className="text-xs text-primary">
                Juan Pérez lidera las ventas con $185,600 y comisión de $9,280
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
