import { useState, useMemo } from "react";
import {
  Wallet,
  Building2,
  TrendingUp,
  DollarSign,
  Download,
  Printer,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  CreditCard,
  ArrowLeftRight,
  PiggyBank,
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

export function ReportesCajaBancosTab() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [periodo, setPeriodo] = useState("mes-actual");

  // Generar ID único para este componente
  const chartId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

  // Datos para gráficos
  const flujoCaja = [
    { id: 1, mes: "Ene", ingresos: 485600, egresos: 342800, saldo: 142800 },
    { id: 2, mes: "Feb", ingresos: 528900, egresos: 398200, saldo: 130700 },
    { id: 3, mes: "Mar", ingresos: 562300, egresos: 412500, saldo: 149800 },
    { id: 4, mes: "Abr", ingresos: 618400, egresos: 445600, saldo: 172800 },
    { id: 5, mes: "May", ingresos: 584900, egresos: 428300, saldo: 156600 },
    { id: 6, mes: "Jun", ingresos: 652700, egresos: 467800, saldo: 184900 },
  ];

  const saldosPorBanco = [
    { id: 1, banco: "Banco del Pacífico", saldo: 285600, moneda: "USD" },
    { id: 2, banco: "Banco Guayaquil", saldo: 198400, moneda: "USD" },
    { id: 3, banco: "Banco Pichincha", saldo: 167200, moneda: "USD" },
    { id: 4, banco: "Produbanco", saldo: 142800, moneda: "USD" },
  ];

  const distribucionFondos = [
    { id: 1, name: "Bancos", value: 68, color: "#3B82F6" },
    { id: 2, name: "Caja Chica", value: 12, color: "#10B981" },
    { id: 3, name: "Inversiones", value: 20, color: "#E8692E" },
  ];

  const movimientosPorTipo = [
    { id: 1, tipo: "Ingresos por Ventas", monto: 425800, transacciones: 1245 },
    { id: 2, tipo: "Pagos a Proveedores", monto: 285600, transacciones: 342 },
    { id: 3, tipo: "Gastos Operativos", monto: 98400, transacciones: 567 },
    { id: 4, tipo: "Nómina", monto: 67200, transacciones: 89 },
    { id: 5, tipo: "Otros", monto: 45900, transacciones: 234 },
  ];

  const estadisticas = [
    {
      label: "Saldo Total",
      value: "$794,000",
      cambio: "+8.3%",
      tendencia: "up",
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Saldo en Bancos",
      value: "$538,200",
      cambio: "+6.7%",
      tendencia: "up",
      icon: Building2,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Flujo Neto Junio",
      value: "+$184,900",
      cambio: "+18.1%",
      tendencia: "up",
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Caja Chica",
      value: "$12,800",
      cambio: "-2.5%",
      tendencia: "down",
      icon: Wallet,
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
            {payload[0].payload.mes || payload[0].payload.banco || payload[0].payload.tipo || payload[0].payload.name}
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
            Dashboard de Caja y Bancos
          </h2>
          <p
            className={`text-sm ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Análisis gerencial de flujo de caja y posición financiera
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
        {/* Flujo de Caja */}
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
            Flujo de Caja Mensual
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={flujoCaja}>
              <defs>
                <linearGradient id="colorSaldoCaja" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
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
              <Bar dataKey="ingresos" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Ingresos" />
              <Bar dataKey="egresos" fill="#EF4444" radius={[8, 8, 0, 0]} name="Egresos" />
              <Line
                type="monotone"
                dataKey="saldo"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 5 }}
                name="Saldo Neto"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de Fondos */}
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
            Distribución de Fondos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribucionFondos}
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
                {distribucionFondos.map((entry) => (
                  <Cell key={`cell-${entry.id}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Saldos por Banco */}
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
            Saldos Bancarios
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={saldosPorBanco}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isLight ? "#e5e7eb" : "#374151"}
              />
              <XAxis
                dataKey="banco"
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "11px" }}
                angle={-15}
                textAnchor="end"
                height={80}
              />
              <YAxis
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "12px" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="saldo" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Saldo" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Movimientos por Tipo */}
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
            Movimientos por Tipo
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={movimientosPorTipo} layout="vertical">
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
                dataKey="tipo"
                type="category"
                width={140}
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "11px" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="monto" fill="#E8692E" radius={[0, 8, 8, 0]} name="Monto" />
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
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Flujo Positivo
              </p>
              <p className="text-xs text-green-600">
                El flujo neto de junio alcanzó $184,900, el más alto del semestre
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
              <Building2 className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Diversificación
              </p>
              <p className="text-xs text-blue-600">
                Los fondos están distribuidos en 4 instituciones bancarias principales
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
              <PiggyBank className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Liquidez Saludable
              </p>
              <p className="text-xs text-primary">
                La posición de caja cubre 1.7 meses de gastos operativos promedio
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
