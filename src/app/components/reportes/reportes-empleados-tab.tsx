import { useState, useMemo } from "react";
import {
  Users,
  TrendingUp,
  DollarSign,
  Award,
  Download,
  Printer,
  ChevronDown,
  ArrowUp,
  ArrowDown,
  Briefcase,
  UserCheck,
  Clock,
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export function ReportesEmpleadosTab() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [periodo, setPeriodo] = useState("mes-actual");

  // Generar ID único para este componente
  const chartId = useMemo(() => Math.random().toString(36).substr(2, 9), []);

  // Datos para gráficos
  const nominaMensual = [
    { id: 1, mes: "Ene", nomina: 45600, empleados: 28, horas: 4480 },
    { id: 2, mes: "Feb", nomina: 46200, empleados: 29, horas: 4640 },
    { id: 3, mes: "Mar", nomina: 47800, empleados: 30, horas: 4800 },
    { id: 4, mes: "Abr", nomina: 48200, empleados: 30, horas: 4800 },
    { id: 5, mes: "May", nomina: 49600, empleados: 31, horas: 4960 },
    { id: 6, mes: "Jun", nomina: 51200, empleados: 32, horas: 5120 },
  ];

  const empleadosPorDepartamento = [
    { id: 1, departamento: "Ventas", empleados: 12, salario: 18400 },
    { id: 2, departamento: "Administración", empleados: 8, salario: 14200 },
    { id: 3, departamento: "Operaciones", empleados: 6, salario: 9800 },
    { id: 4, departamento: "Contabilidad", empleados: 4, salario: 6200 },
    { id: 5, departamento: "Logística", empleados: 2, salario: 2600 },
  ];

  const distribucionEmpleados = [
    { id: 1, name: "Tiempo Completo", value: 75, color: "#3B82F6" },
    { id: 2, name: "Medio Tiempo", value: 15, color: "#10B981" },
    { id: 3, name: "Por Contrato", value: 10, color: "#F59E0B" },
  ];

  const topEmpleados = [
    { id: 1, empleado: "Juan Pérez", ventas: 185600, comision: 9280, dept: "Ventas" },
    { id: 2, empleado: "María González", ventas: 156400, comision: 7820, dept: "Ventas" },
    { id: 3, empleado: "Carlos López", ventas: 142800, comision: 7140, dept: "Ventas" },
    { id: 4, empleado: "Ana Martínez", ventas: 128900, comision: 6445, dept: "Ventas" },
    { id: 5, empleado: "Roberto Silva", ventas: 98600, comision: 4930, dept: "Ventas" },
  ];

  const desempenoPorArea = [
    { id: 1, area: "Ventas", valor: 92 },
    { id: 2, area: "Productividad", valor: 85 },
    { id: 3, area: "Puntualidad", valor: 88 },
    { id: 4, area: "Calidad", valor: 90 },
    { id: 5, area: "Colaboración", valor: 87 },
  ];

  const estadisticas = [
    {
      label: "Total Empleados",
      value: "32",
      cambio: "+3.2%",
      tendencia: "up",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Nómina Mensual",
      value: "$51,200",
      cambio: "+3.2%",
      tendencia: "up",
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Salario Promedio",
      value: "$1,600",
      cambio: "+0.0%",
      tendencia: "up",
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Tasa Retención",
      value: "94.5%",
      cambio: "+2.3%",
      tendencia: "up",
      icon: Award,
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
            {payload[0].payload.mes || payload[0].payload.departamento || payload[0].payload.empleado || payload[0].payload.name || payload[0].payload.area}
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
            Dashboard de Empleados
          </h2>
          <p
            className={`text-sm ${
              isLight ? "text-gray-600" : "text-gray-400"
            }`}
          >
            Análisis gerencial de nómina, desempeño y recursos humanos
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
        {/* Evolución de Nómina */}
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
            Evolución de Nómina Mensual
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={nominaMensual}>
              <defs>
                <linearGradient id="colorNomina" x1="0" y1="0" x2="0" y2="1">
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
              <Area
                type="monotone"
                dataKey="nomina"
                stroke="#10B981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorNomina)"
                name="Nómina"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Distribución de Empleados */}
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
            Distribución por Tipo de Contrato
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distribucionEmpleados}
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
                {distribucionEmpleados.map((entry) => (
                  <Cell key={`cell-${entry.id}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Empleados por Departamento */}
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
            Empleados por Departamento
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={empleadosPorDepartamento}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isLight ? "#e5e7eb" : "#374151"}
              />
              <XAxis
                dataKey="departamento"
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
              <Bar dataKey="empleados" fill="#3B82F6" radius={[8, 8, 0, 0]} name="Empleados" />
              <Bar dataKey="salario" fill="#E8692E" radius={[8, 8, 0, 0]} name="Salario Total" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Empleados por Rendimiento */}
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
            Top 5 Empleados por Ventas
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topEmpleados} layout="vertical">
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
                dataKey="empleado"
                type="category"
                width={120}
                stroke={isLight ? "#6b7280" : "#9ca3af"}
                style={{ fontSize: "11px" }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="ventas" fill="#10B981" radius={[0, 8, 8, 0]} name="Ventas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Gráfico de Radar - Desempeño */}
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
          Análisis de Desempeño General
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={desempenoPorArea}>
            <PolarGrid stroke={isLight ? "#e5e7eb" : "#374151"} />
            <PolarAngleAxis
              dataKey="area"
              stroke={isLight ? "#6b7280" : "#9ca3af"}
              style={{ fontSize: "12px" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              stroke={isLight ? "#6b7280" : "#9ca3af"}
              style={{ fontSize: "12px" }}
            />
            <Radar
              name="Desempeño"
              dataKey="valor"
              stroke="#E8692E"
              fill="#E8692E"
              fillOpacity={0.6}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
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
              <UserCheck className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Alta Retención
              </p>
              <p className="text-xs text-green-600">
                La tasa de retención del 94.5% refleja un ambiente laboral positivo
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
              <Briefcase className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
                Crecimiento Sostenido
              </p>
              <p className="text-xs text-blue-600">
                La plantilla creció 3.2% incorporando personal calificado en ventas
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
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p
                className={`text-sm font-semibold mb-1 ${
                  isLight ? "text-gray-900" : "text-white"
                }`}
              >
              Alto Desempeño
              </p>
              <p className="text-xs text-primary">
                El equipo de ventas mantiene un desempeño superior al 88% en todas las áreas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
