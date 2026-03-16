import { useState } from "react";
import {
  Calculator,
  FileText,
  TrendingUp,
  DollarSign,
  Download,
  Printer,
  Search,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "../../contexts/theme-context";

export function ReportesContabilidadTab() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [tipoReporte, setTipoReporte] = useState("balance-general");
  const [periodo, setPeriodo] = useState("mes-actual");
  const [searchTerm, setSearchTerm] = useState("");

  const estadisticas = [
    {
      label: "Total Activos",
      value: "$892,340",
      icon: TrendingUp,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Total Pasivos",
      value: "$458,720",
      icon: FileText,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Patrimonio",
      value: "$433,620",
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Utilidad Neta",
      value: "$124,890",
      icon: Calculator,
      color: "text-primary",
      bg: "bg-primary/10",
    },
  ];

  const reportesDisponibles = [
    { id: "balance-general", nombre: "Balance General" },
    { id: "estado-resultados", nombre: "Estado de Resultados" },
    { id: "flujo-efectivo", nombre: "Flujo de Efectivo" },
    { id: "libro-mayor", nombre: "Libro Mayor" },
    { id: "libro-diario", nombre: "Libro Diario" },
    { id: "balance-comprobacion", nombre: "Balance de Comprobación" },
  ];

  const datosContabilidad = [
    {
      id: "1",
      cuenta: "1.1.01",
      nombreCuenta: "Caja General",
      tipo: "Activo",
      debe: 45800,
      haber: 23400,
      saldo: 22400,
    },
    {
      id: "2",
      cuenta: "1.1.02",
      nombreCuenta: "Bancos",
      tipo: "Activo",
      debe: 184520,
      haber: 98750,
      saldo: 85770,
    },
    {
      id: "3",
      cuenta: "1.2.01",
      nombreCuenta: "Cuentas por Cobrar",
      tipo: "Activo",
      debe: 124680,
      haber: 56200,
      saldo: 68480,
    },
    {
      id: "4",
      cuenta: "1.3.01",
      nombreCuenta: "Inventarios",
      tipo: "Activo",
      debe: 485900,
      haber: 234100,
      saldo: 251800,
    },
    {
      id: "5",
      cuenta: "2.1.01",
      nombreCuenta: "Cuentas por Pagar",
      tipo: "Pasivo",
      debe: 89450,
      haber: 156800,
      saldo: -67350,
    },
    {
      id: "6",
      cuenta: "4.1.01",
      nombreCuenta: "Ventas",
      tipo: "Ingreso",
      debe: 0,
      haber: 548920,
      saldo: -548920,
    },
    {
      id: "7",
      cuenta: "5.1.01",
      nombreCuenta: "Costo de Ventas",
      tipo: "Gasto",
      debe: 325680,
      haber: 0,
      saldo: 325680,
    },
    {
      id: "8",
      cuenta: "5.2.01",
      nombreCuenta: "Gastos Administrativos",
      tipo: "Gasto",
      debe: 98350,
      haber: 0,
      saldo: 98350,
    },
  ];

  const getTipoColor = (tipo: string) => {
    const colors = {
      Activo: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      Pasivo: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      Ingreso: "bg-green-500/10 text-green-500 border-green-500/20",
      Gasto: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return colors[tipo as keyof typeof colors] || "";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estadisticas.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`rounded-lg border p-4 ${
                isLight
                  ? "bg-white border-gray-200"
                  : "bg-card border-white/10"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
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

      {/* Controles */}
      <div
        className={`rounded-lg border p-4 ${
          isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label
              className={`block text-xs font-medium mb-1.5 ${
                isLight ? "text-gray-700" : "text-gray-300"
              }`}
            >
              Tipo de Reporte
            </label>
            <div className="relative">
              <select
                value={tipoReporte}
                onChange={(e) => setTipoReporte(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-primary/50 ${
                  isLight
                    ? "bg-white border-gray-200 text-gray-900"
                    : "bg-secondary border-white/10 text-white"
                }`}
              >
                {reportesDisponibles.map((reporte) => (
                  <option key={reporte.id} value={reporte.id}>
                    {reporte.nombre}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1">
            <label
              className={`block text-xs font-medium mb-1.5 ${
                isLight ? "text-gray-700" : "text-gray-300"
              }`}
            >
              Período
            </label>
            <div className="relative">
              <select
                value={periodo}
                onChange={(e) => setPeriodo(e.target.value)}
                className={`w-full px-3 py-1.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-primary/50 ${
                  isLight
                    ? "bg-white border-gray-200 text-gray-900"
                    : "bg-secondary border-white/10 text-white"
                }`}
              >
                <option value="mes-actual">Mes Actual</option>
                <option value="trimestre">Trimestre</option>
                <option value="anio">Año</option>
                <option value="ejercicio-fiscal">Ejercicio Fiscal</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1">
            <label
              className={`block text-xs font-medium mb-1.5 ${
                isLight ? "text-gray-700" : "text-gray-300"
              }`}
            >
              Buscar Cuenta
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Código o nombre..."
                className={`w-full pl-9 pr-3 py-1.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-primary/50 ${
                  isLight
                    ? "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                    : "bg-secondary border-white/10 text-white placeholder-gray-500"
                }`}
              />
            </div>
          </div>

          <div className="flex gap-2 items-end">
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
      </div>

      {/* Tabla */}
      <div
        className={`rounded-lg overflow-hidden ${
          isLight ? "bg-gray-50" : "bg-secondary/50"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={isLight ? "bg-gray-100" : "bg-[#0D1B2A]"}>
              <tr>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Código
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Nombre de Cuenta
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Tipo
                </th>
                <th
                  className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Debe
                </th>
                <th
                  className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Haber
                </th>
                <th
                  className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Saldo
                </th>
              </tr>
            </thead>
            <tbody
              className={`divide-y ${
                isLight
                  ? "bg-white divide-gray-100"
                  : "bg-card divide-white/10"
              }`}
            >
              {datosContabilidad.map((cuenta) => (
                <tr
                  key={cuenta.id}
                  className={
                    isLight
                      ? "hover:bg-gray-50 transition-colors"
                      : "hover:bg-white/5 transition-colors"
                  }
                >
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-mono font-semibold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {cuenta.cuenta}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {cuenta.nombreCuenta}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTipoColor(
                        cuenta.tipo
                      )}`}
                    >
                      {cuenta.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`text-sm ${
                        cuenta.debe > 0
                          ? isLight
                            ? "text-gray-900 font-semibold"
                            : "text-white font-semibold"
                          : isLight
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      ${cuenta.debe.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`text-sm ${
                        cuenta.haber > 0
                          ? isLight
                            ? "text-gray-900 font-semibold"
                            : "text-white font-semibold"
                          : isLight
                          ? "text-gray-400"
                          : "text-gray-600"
                      }`}
                    >
                      ${cuenta.haber.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`text-sm font-bold ${
                        cuenta.saldo > 0
                          ? "text-green-500"
                          : cuenta.saldo < 0
                          ? "text-red-500"
                          : isLight
                          ? "text-gray-900"
                          : "text-white"
                      }`}
                    >
                      ${Math.abs(cuenta.saldo).toLocaleString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totales */}
      <div
        className={`rounded-lg border p-4 ${
          isLight ? "bg-white border-gray-200" : "bg-card border-white/10"
        }`}
      >
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p
              className={`text-xs mb-1 ${
                isLight ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Total Debe
            </p>
            <p
              className={`text-xl font-bold ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              $1,353,930
            </p>
          </div>
          <div>
            <p
              className={`text-xs mb-1 ${
                isLight ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Total Haber
            </p>
            <p
              className={`text-xl font-bold ${
                isLight ? "text-gray-900" : "text-white"
              }`}
            >
              $1,118,170
            </p>
          </div>
          <div>
            <p
              className={`text-xs mb-1 ${
                isLight ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Diferencia
            </p>
            <p className="text-xl font-bold text-green-500">$235,760</p>
          </div>
        </div>
      </div>
    </div>
  );
}
