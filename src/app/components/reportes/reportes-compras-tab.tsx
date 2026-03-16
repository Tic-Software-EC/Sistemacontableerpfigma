import { useState } from "react";
import {
  TrendingUp,
  Package,
  DollarSign,
  Users,
  Download,
  Printer,
  Search,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "../../contexts/theme-context";

export function ReportesComprasTab() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [tipoReporte, setTipoReporte] = useState("compras-periodo");
  const [periodo, setPeriodo] = useState("mes-actual");
  const [searchTerm, setSearchTerm] = useState("");

  const estadisticas = [
    {
      label: "Compras Totales",
      value: "$325,680",
      cambio: "+14.2%",
      icon: DollarSign,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Órdenes de Compra",
      value: "487",
      cambio: "+8.5%",
      icon: Package,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Promedio por Orden",
      value: "$668.50",
      cambio: "+5.2%",
      icon: TrendingUp,
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Proveedores Activos",
      value: "128",
      cambio: "+3.1%",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  const reportesDisponibles = [
    { id: "compras-periodo", nombre: "Compras por Período" },
    { id: "compras-proveedor", nombre: "Compras por Proveedor" },
    { id: "compras-producto", nombre: "Compras por Producto" },
    { id: "cuentas-pagar", nombre: "Cuentas por Pagar" },
    { id: "ordenes-pendientes", nombre: "Órdenes Pendientes" },
    { id: "comparativo", nombre: "Comparativo de Períodos" },
  ];

  const datosCompras = [
    {
      id: "1",
      fecha: "2026-03-15",
      orden: "OC-2026-00487",
      proveedor: "Tecnología Global S.A.",
      productos: 15,
      subtotal: 18500,
      iva: 2220,
      total: 20720,
      estado: "recibido",
    },
    {
      id: "2",
      fecha: "2026-03-14",
      orden: "OC-2026-00486",
      proveedor: "Distribuidora Nacional",
      productos: 8,
      subtotal: 12300,
      iva: 1476,
      total: 13776,
      estado: "pendiente",
    },
    {
      id: "3",
      fecha: "2026-03-13",
      orden: "OC-2026-00485",
      proveedor: "Importadora Tech",
      productos: 22,
      subtotal: 28900,
      iva: 3468,
      total: 32368,
      estado: "recibido",
    },
    {
      id: "4",
      fecha: "2026-03-12",
      orden: "OC-2026-00484",
      proveedor: "Suministros del Sur",
      productos: 12,
      subtotal: 9800,
      iva: 1176,
      total: 10976,
      estado: "recibido",
    },
  ];

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
                <span className="text-xs font-medium text-green-500">
                  {stat.cambio}
                </span>
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
                <option value="hoy">Hoy</option>
                <option value="semana-actual">Semana Actual</option>
                <option value="mes-actual">Mes Actual</option>
                <option value="trimestre">Trimestre</option>
                <option value="anio">Año</option>
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
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Orden, proveedor..."
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
                  Fecha
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Orden de Compra
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Proveedor
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  # Productos
                </th>
                <th
                  className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Subtotal
                </th>
                <th
                  className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  IVA
                </th>
                <th
                  className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Total
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Estado
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
              {datosCompras.map((compra) => (
                <tr
                  key={compra.id}
                  className={
                    isLight
                      ? "hover:bg-gray-50 transition-colors"
                      : "hover:bg-white/5 transition-colors"
                  }
                >
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm ${
                        isLight ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      {compra.fecha}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-mono font-semibold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {compra.orden}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {compra.proveedor}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-sm ${
                        isLight ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      {compra.productos}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`text-sm ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      ${compra.subtotal.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`text-sm ${
                        isLight ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      ${compra.iva.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`text-sm font-semibold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      ${compra.total.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        compra.estado === "recibido"
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                      }`}
                    >
                      {compra.estado === "recibido" ? "Recibido" : "Pendiente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
