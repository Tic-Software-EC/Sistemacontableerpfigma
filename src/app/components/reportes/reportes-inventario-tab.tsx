import { useState } from "react";
import {
  Package,
  TrendingDown,
  AlertTriangle,
  DollarSign,
  Download,
  Printer,
  Search,
  Filter,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import { useTheme } from "../../contexts/theme-context";

export function ReportesInventarioTab() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [tipoReporte, setTipoReporte] = useState("existencias");
  const [periodo, setPeriodo] = useState("actual");
  const [searchTerm, setSearchTerm] = useState("");

  const estadisticas = [
    {
      label: "Total Productos",
      value: "847",
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Stock Bajo",
      value: "23",
      icon: TrendingDown,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      label: "Sin Stock",
      value: "7",
      icon: AlertTriangle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      label: "Valor Inventario",
      value: "$485,900",
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
  ];

  const reportesDisponibles = [
    { id: "existencias", nombre: "Existencias Actuales" },
    { id: "movimientos", nombre: "Movimientos de Inventario" },
    { id: "stock-bajo", nombre: "Productos con Stock Bajo" },
    { id: "sin-movimiento", nombre: "Productos sin Movimiento" },
    { id: "valoracion", nombre: "Valoración de Inventario" },
    { id: "rotacion", nombre: "Rotación de Productos" },
  ];

  const datosInventario = [
    {
      id: "1",
      codigo: "PROD-001",
      nombre: "Laptop HP ProBook 450",
      categoria: "Electrónica",
      stockActual: 45,
      stockMinimo: 20,
      precioCompra: 850,
      precioVenta: 1200,
      valorTotal: 38250,
      estado: "normal",
    },
    {
      id: "2",
      codigo: "PROD-002",
      nombre: "Mouse Inalámbrico Logitech",
      categoria: "Accesorios",
      stockActual: 12,
      stockMinimo: 15,
      precioCompra: 15,
      precioVenta: 25,
      valorTotal: 180,
      estado: "bajo",
    },
    {
      id: "3",
      codigo: "PROD-003",
      nombre: "Monitor Samsung 24\"",
      categoria: "Electrónica",
      stockActual: 0,
      stockMinimo: 10,
      precioCompra: 180,
      precioVenta: 280,
      valorTotal: 0,
      estado: "agotado",
    },
    {
      id: "4",
      codigo: "PROD-004",
      nombre: "Teclado Mecánico RGB",
      categoria: "Accesorios",
      stockActual: 78,
      stockMinimo: 30,
      precioCompra: 45,
      precioVenta: 75,
      valorTotal: 3510,
      estado: "normal",
    },
  ];

  const getEstadoBadge = (estado: string) => {
    const badges = {
      normal: {
        text: "Normal",
        className: "bg-green-500/10 text-green-500 border-green-500/20",
      },
      bajo: {
        text: "Stock Bajo",
        className: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      },
      agotado: {
        text: "Agotado",
        className: "bg-red-500/10 text-red-500 border-red-500/20",
      },
    };

    const badge = badges[estado as keyof typeof badges];
    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${badge.className}`}
      >
        {badge.text}
      </span>
    );
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
              Buscar Producto
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
              <Filter className="w-4 h-4" />
            </button>
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
                  Producto
                </th>
                <th
                  className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Categoría
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Stock Actual
                </th>
                <th
                  className={`px-4 py-3 text-center text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Stock Mínimo
                </th>
                <th
                  className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Precio Compra
                </th>
                <th
                  className={`px-4 py-3 text-right text-xs font-medium uppercase tracking-wide ${
                    isLight ? "text-gray-600" : "text-white/70"
                  }`}
                >
                  Valor Total
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
              {datosInventario.map((producto) => (
                <tr
                  key={producto.id}
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
                      {producto.codigo}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      {producto.nombre}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-sm ${
                        isLight ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      {producto.categoria}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-sm font-semibold ${
                        producto.stockActual === 0
                          ? "text-red-500"
                          : producto.stockActual <= producto.stockMinimo
                          ? "text-orange-500"
                          : isLight
                          ? "text-gray-900"
                          : "text-white"
                      }`}
                    >
                      {producto.stockActual}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-sm ${
                        isLight ? "text-gray-700" : "text-gray-400"
                      }`}
                    >
                      {producto.stockMinimo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`text-sm ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      ${producto.precioCompra.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span
                      className={`text-sm font-semibold ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}
                    >
                      ${producto.valorTotal.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {getEstadoBadge(producto.estado)}
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
