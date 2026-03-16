import { useState, useMemo } from "react";
import {
  Calculator,
  TrendingUp,
  DollarSign,
  FileText,
  Download,
  Printer,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  PieChart as PieChartIcon,
  BarChart3,
  Activity,
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

export function ReportesContabilidadTab() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [periodo, setPeriodo] = useState("mes-actual");

  // Generar ID único para este componente
  const chartId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

  // Datos para gráficos
  const estadoResultados = [
    { id: 1, mes: "Ene", ingresos: 548900, gastos: 412300, utilidad: 136600 },
    { id: 2, mes: "Feb", ingresos: 612400, gastos: 458600, utilidad: 153800 },
    { id: 3, mes: "Mar", ingresos: 589700, gastos: 442100, utilidad: 147600 },
    { id: 4, mes: "Abr", ingresos: 678200, gastos: 495800, utilidad: 182400 },
    { id: 5, mes: "May", ingresos: 645300, gastos: 478900, utilidad: 166400 },
    { id: 6, mes: "Jun", ingresos: 712600, gastos: 518400, utilidad: 194200 },
  ];

  const balanceGeneral = [
    { id: 1, categoria: "Activos Corrientes", valor: 1245800 },
    { id: 2, categoria: "Activos Fijos", valor: 892400 },
    { id: 3, categoria: "Pasivos Corrientes", valor: -567200 },
    { id: 4, categoria: "Pasivos Largo Plazo", valor: -312800 },
    { id: 5, categoria: "Patrimonio", valor: 1258200 },
  ];

  const distribucionGastos = [
    { id: 1, name: "Operativos", value: 42, color: "#E8692E" },
    { id: 2, name: "Administrativos", value: 28, color: "#3B82F6" },
    { id: 3, name: "Financieros", value: 18, color: "#10B981" },
    { id: 4, name: "Otros", value: 12, color: "#F59E0B" },
  ];

  const razonesFinancieras = [
    { id: 1, razon: "Liquidez", valor: 2.2, benchmark: 2.0 },
    { id: 2, razon: "Endeudamiento", valor: 0.41, benchmark: 0.50 },
    { id: 3, razon: "Rentabilidad", valor: 27.3, benchmark: 25.0 },
    { id: 4, razon: "Rotación Activos", valor: 1.8, benchmark: 1.5 },
  ];

  const estadisticas = [
    {
      label: "Utilidad Neta",
      value: "$194,200",
      cambio: "+16.7%",
      tendencia: "up",
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Margen Neto",
      value: "27.3%",
      cambio: "+2.1%",
      tendencia: "up",
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Patrimonio",
      value: "$1,258,200",
      cambio: "+8.4%",
      tendencia: "up",
      icon: PieChartIcon,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "ROE",
      value: "15.4%",
      cambio: "+1.3%",
      tendencia: "up",
      icon: Calculator,
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
            {payload[0].payload.mes || payload[0].payload.categoria || payload[0].payload.razon || payload[0].payload.name}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={`${entry.dataKey}-${index}`} className="text-xs" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' && Math.abs(entry.value) > 1000 ? `$${entry.value.toLocaleString()}` : entry.value}
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
            Dashboard de Contabilidad
          </h2>
          <p
            className={`text-sm ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Análisis gerencial de estados financieros y razones contables
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
        {/* Estado de Resultados */}
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
            Estado de Resultados
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={estadoResultados}>
              <defs>
                <linearGradient id="colorUtilidadCont" x1="0" y1="0" x2="0" y2="1">
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
              <Bar dataKey="gastos" fill="#EF4444" radius={[8, 8, 0, 0]} name="Gastos" />
              <Area
                type="monotone"
                dataKey="utilidad"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUtilidadCont)"
                name="Utilidad"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de Gastos */}
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
            Distribución de Gastos
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribucionGastos}
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
                {distribucionGastos.map((entry) => (
                  <Cell key={`cell-${entry.id}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Balance General */}
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
            Balance General
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={balanceGeneral} layout="vertical">
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
                dataKey="categoria"
                type="category"
                width={140}
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "11px" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="valor" radius={[0, 8, 8, 0]} name="Valor">
                {balanceGeneral.map((entry) => (
                  <Cell
                    key={`cell-${entry.id}`}
                    fill={entry.valor > 0 ? "#10B981" : "#EF4444"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Razones Financieras */}
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
            Razones Financieras vs Benchmark
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={razonesFinancieras}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isLight ? "#e5e7eb" : "#374151"}
              />
              <XAxis
                dataKey="razon"
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
              <Legend />
              <Bar dataKey="valor" fill="#E8692E" radius={[8, 8, 0, 0]} name="Actual" />
              <Bar dataKey="benchmark" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Benchmark" />
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
                Rentabilidad Excelente
              </p>
              <p className="text-xs text-green-600">
                El margen neto de 27.3% supera el benchmark del sector en 2.3%
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
              <Activity className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Liquidez Sólida
              </p>
              <p className="text-xs text-blue-600">
                Ratio de liquidez de 2.2 indica capacidad para cubrir obligaciones
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
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Endeudamiento Saludable
              </p>
              <p className="text-xs text-primary">
                Relación deuda/activo de 41% está por debajo del límite recomendado
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
