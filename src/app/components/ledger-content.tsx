import { useState } from "react";
import { Search, Filter, Download, Calendar, ChevronDown, ChevronRight } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { DateRangePicker } from "./date-range-picker";

// Datos de ejemplo del Libro Mayor
const CUENTAS_MAYOR = [
  {
    codigo: "1.1.01.001",
    nombre: "Caja General",
    saldoInicial: 15000.00,
    movimientos: [
      { fecha: "2026-03-01", asiento: "AS-001", detalle: "Venta de contado #001", debe: 2500.00, haber: 0, saldo: 17500.00 },
      { fecha: "2026-03-05", asiento: "AS-005", detalle: "Pago a proveedor", debe: 0, haber: 1200.00, saldo: 16300.00 },
      { fecha: "2026-03-10", asiento: "AS-012", detalle: "Cobro de cliente", debe: 3400.00, haber: 0, saldo: 19700.00 },
      { fecha: "2026-03-15", asiento: "AS-018", detalle: "Pago de servicios básicos", debe: 0, haber: 450.00, saldo: 19250.00 },
      { fecha: "2026-03-20", asiento: "AS-025", detalle: "Venta de contado #025", debe: 1850.00, haber: 0, saldo: 21100.00 },
    ],
  },
  {
    codigo: "1.1.01.002",
    nombre: "Bancos - Banco Pichincha",
    saldoInicial: 45000.00,
    movimientos: [
      { fecha: "2026-03-02", asiento: "AS-002", detalle: "Depósito de ventas", debe: 8500.00, haber: 0, saldo: 53500.00 },
      { fecha: "2026-03-03", asiento: "AS-003", detalle: "Pago de nómina", debe: 0, haber: 12000.00, saldo: 41500.00 },
      { fecha: "2026-03-08", asiento: "AS-009", detalle: "Transferencia de cliente", debe: 6200.00, haber: 0, saldo: 47700.00 },
      { fecha: "2026-03-12", asiento: "AS-015", detalle: "Pago a proveedores", debe: 0, haber: 8500.00, saldo: 39200.00 },
      { fecha: "2026-03-18", asiento: "AS-022", detalle: "Cobro cheque diferido", debe: 4300.00, haber: 0, saldo: 43500.00 },
      { fecha: "2026-03-22", asiento: "AS-028", detalle: "Pago de arriendo", debe: 0, haber: 1500.00, saldo: 42000.00 },
    ],
  },
  {
    codigo: "1.1.02.001",
    nombre: "Cuentas por Cobrar Clientes",
    saldoInicial: 28000.00,
    movimientos: [
      { fecha: "2026-03-01", asiento: "AS-001", detalle: "Factura #145 - Cliente ABC", debe: 5600.00, haber: 0, saldo: 33600.00 },
      { fecha: "2026-03-07", asiento: "AS-008", detalle: "Cobro Factura #120", debe: 0, haber: 3200.00, saldo: 30400.00 },
      { fecha: "2026-03-14", asiento: "AS-017", detalle: "Factura #146 - Cliente XYZ", debe: 7800.00, haber: 0, saldo: 38200.00 },
      { fecha: "2026-03-21", asiento: "AS-026", detalle: "Cobro Factura #145", debe: 0, haber: 5600.00, saldo: 32600.00 },
    ],
  },
  {
    codigo: "1.1.03.001",
    nombre: "Inventario de Mercaderías",
    saldoInicial: 65000.00,
    movimientos: [
      { fecha: "2026-03-04", asiento: "AS-004", detalle: "Compra de mercadería", debe: 12000.00, haber: 0, saldo: 77000.00 },
      { fecha: "2026-03-06", asiento: "AS-006", detalle: "Costo de venta #001", debe: 0, haber: 1800.00, saldo: 75200.00 },
      { fecha: "2026-03-11", asiento: "AS-013", detalle: "Compra de mercadería", debe: 8500.00, haber: 0, saldo: 83700.00 },
      { fecha: "2026-03-16", asiento: "AS-019", detalle: "Costo de venta #015", debe: 0, haber: 3200.00, saldo: 80500.00 },
      { fecha: "2026-03-23", asiento: "AS-029", detalle: "Devolución en compra", debe: 0, haber: 500.00, saldo: 80000.00 },
    ],
  },
  {
    codigo: "2.1.01.001",
    nombre: "Cuentas por Pagar Proveedores",
    saldoInicial: 32000.00,
    movimientos: [
      { fecha: "2026-03-04", asiento: "AS-004", detalle: "Factura Proveedor #789", debe: 0, haber: 12000.00, saldo: 44000.00 },
      { fecha: "2026-03-09", asiento: "AS-010", detalle: "Pago Factura #756", debe: 8000.00, haber: 0, saldo: 36000.00 },
      { fecha: "2026-03-11", asiento: "AS-013", detalle: "Factura Proveedor #790", debe: 0, haber: 8500.00, saldo: 44500.00 },
      { fecha: "2026-03-19", asiento: "AS-023", detalle: "Pago Factura #789", debe: 12000.00, haber: 0, saldo: 32500.00 },
    ],
  },
  {
    codigo: "4.1.01.001",
    nombre: "Ventas de Productos",
    saldoInicial: 0,
    movimientos: [
      { fecha: "2026-03-01", asiento: "AS-001", detalle: "Venta Factura #145", debe: 0, haber: 2500.00, saldo: 2500.00 },
      { fecha: "2026-03-14", asiento: "AS-017", detalle: "Venta Factura #146", debe: 0, haber: 7800.00, saldo: 10300.00 },
      { fecha: "2026-03-20", asiento: "AS-025", detalle: "Venta Factura #147", debe: 0, haber: 1850.00, saldo: 12150.00 },
    ],
  },
  {
    codigo: "5.1.01.001",
    nombre: "Costo de Ventas",
    saldoInicial: 0,
    movimientos: [
      { fecha: "2026-03-06", asiento: "AS-006", detalle: "Costo venta #001", debe: 1800.00, haber: 0, saldo: 1800.00 },
      { fecha: "2026-03-16", asiento: "AS-019", detalle: "Costo venta #015", debe: 3200.00, haber: 0, saldo: 5000.00 },
    ],
  },
  {
    codigo: "5.2.01.001",
    nombre: "Gastos de Administración",
    saldoInicial: 0,
    movimientos: [
      { fecha: "2026-03-03", asiento: "AS-003", detalle: "Pago de nómina administrativa", debe: 8000.00, haber: 0, saldo: 8000.00 },
      { fecha: "2026-03-15", asiento: "AS-018", detalle: "Servicios básicos oficina", debe: 450.00, haber: 0, saldo: 8450.00 },
      { fecha: "2026-03-22", asiento: "AS-028", detalle: "Arriendo de oficina", debe: 1500.00, haber: 0, saldo: 9950.00 },
    ],
  },
];

export function LedgerContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [searchTerm, setSearchTerm] = useState("");
  const [cuentaSeleccionada, setCuentaSeleccionada] = useState<string | null>(null);
  const [fechaDesde, setFechaDesde] = useState("2026-03-01");
  const [fechaHasta, setFechaHasta] = useState("2026-03-31");
  const [expandedAccounts, setExpandedAccounts] = useState<string[]>([]);

  const card = `rounded-xl ${isLight ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`;

  // Filtrar cuentas según búsqueda
  const cuentasFiltradas = CUENTAS_MAYOR.filter(c =>
    c.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Si hay cuenta seleccionada, mostrar solo esa
  const cuentasAMostrar = cuentaSeleccionada
    ? cuentasFiltradas.filter(c => c.codigo === cuentaSeleccionada)
    : cuentasFiltradas;

  const toggleAccount = (codigo: string) => {
    if (expandedAccounts.includes(codigo)) {
      setExpandedAccounts(expandedAccounts.filter(c => c !== codigo));
    } else {
      setExpandedAccounts([...expandedAccounts, codigo]);
    }
  };

  const calcularTotales = (cuenta: typeof CUENTAS_MAYOR[0]) => {
    const totalDebe = cuenta.movimientos.reduce((acc, m) => acc + m.debe, 0);
    const totalHaber = cuenta.movimientos.reduce((acc, m) => acc + m.haber, 0);
    const saldoFinal = cuenta.saldoInicial + totalDebe - totalHaber;
    return { totalDebe, totalHaber, saldoFinal };
  };

  const fmt = (v: number) => `$${v.toFixed(2)}`;

  const exportarPDF = () => {
    // Aquí iría la lógica para exportar a PDF
    alert("Funcionalidad de exportación a PDF próximamente");
  };

  return (
    <div className="space-y-6">
      {/* Header con filtros */}
      <div className={`${card} p-6`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className={`text-xl font-bold mb-1 ${isLight ? "text-gray-900" : "text-white"}`}>
              Libro Mayor General
            </h2>
            <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
              Movimientos detallados por cuenta contable
            </p>
          </div>

          <button
            onClick={exportarPDF}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Búsqueda */}
          <div>
            <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
              Buscar Cuenta
            </label>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
              <input
                type="text"
                placeholder="Código o nombre de cuenta..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 px-3 py-2 rounded-lg text-sm border ${
                  isLight
                    ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    : "bg-white/5 border-white/10 text-white placeholder-gray-500"
                }`}
              />
            </div>
          </div>

          {/* Selector de rango de fechas */}
          <div className="md:col-span-2">
            <DateRangePicker
              dateFrom={fechaDesde}
              dateTo={fechaHasta}
              onDateFromChange={setFechaDesde}
              onDateToChange={setFechaHasta}
            />
          </div>
        </div>

        {/* Selector de cuenta específica */}
        <div className="mt-4">
          <label className={`block text-xs font-medium mb-1 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
            Filtrar por Cuenta Específica
          </label>
          <select
            value={cuentaSeleccionada || ""}
            onChange={(e) => setCuentaSeleccionada(e.target.value || null)}
            className={`w-full px-3 py-2 rounded-lg text-sm border ${
              isLight
                ? "bg-white border-gray-300 text-gray-900"
                : "bg-white/5 border-white/10 text-white"
            }`}
          >
            <option value="">Todas las cuentas</option>
            {CUENTAS_MAYOR.map((cuenta) => (
              <option key={cuenta.codigo} value={cuenta.codigo}>
                {cuenta.codigo} - {cuenta.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de cuentas con movimientos */}
      <div className="space-y-4">
        {cuentasAMostrar.map((cuenta) => {
          const isExpanded = expandedAccounts.includes(cuenta.codigo);
          const totales = calcularTotales(cuenta);

          return (
            <div key={cuenta.codigo} className={card}>
              {/* Header de la cuenta */}
              <button
                onClick={() => toggleAccount(cuenta.codigo)}
                className={`w-full px-6 py-4 flex items-center justify-between transition-colors ${
                  isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className={`w-5 h-5 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                  ) : (
                    <ChevronRight className={`w-5 h-5 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                  )}
                  <div className="text-left">
                    <div className={`font-mono text-sm font-medium ${isLight ? "text-primary" : "text-white"}`}>
                      {cuenta.codigo}
                    </div>
                    <div className={`text-sm font-semibold ${isLight ? "text-gray-900" : "text-white"}`}>
                      {cuenta.nombre}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Saldo Inicial</div>
                    <div className={`font-mono text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                      {fmt(cuenta.saldoInicial)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Movimientos</div>
                    <div className={`font-mono text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                      {cuenta.movimientos.length}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Saldo Final</div>
                    <div className={`font-mono text-sm font-bold ${totales.saldoFinal >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {fmt(totales.saldoFinal)}
                    </div>
                  </div>
                </div>
              </button>

              {/* Detalle de movimientos */}
              {isExpanded && (
                <div className={`border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${isLight ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0D1B2A] border-white/10 text-gray-400"}`}>
                          <th className="px-6 py-3 text-left">Fecha</th>
                          <th className="px-6 py-3 text-left">Asiento</th>
                          <th className="px-6 py-3 text-left">Detalle</th>
                          <th className="px-6 py-3 text-right">Debe</th>
                          <th className="px-6 py-3 text-right">Haber</th>
                          <th className="px-6 py-3 text-right">Saldo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Saldo inicial */}
                        <tr className={`border-b ${isLight ? "bg-blue-50 border-gray-100" : "bg-blue-500/5 border-white/5"}`}>
                          <td className={`px-6 py-3 text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                            {fechaDesde}
                          </td>
                          <td className={`px-6 py-3 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                            -
                          </td>
                          <td className={`px-6 py-3 text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                            Saldo Inicial
                          </td>
                          <td className={`px-6 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                            -
                          </td>
                          <td className={`px-6 py-3 text-sm text-right font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                            -
                          </td>
                          <td className={`px-6 py-3 text-sm text-right font-mono font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                            {fmt(cuenta.saldoInicial)}
                          </td>
                        </tr>

                        {/* Movimientos */}
                        {cuenta.movimientos.map((mov, idx) => (
                          <tr
                            key={idx}
                            className={`border-b transition-colors ${isLight ? "hover:bg-gray-50 border-gray-100" : "hover:bg-white/[0.04] border-white/5"}`}
                          >
                            <td className={`px-6 py-3 text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>
                              {new Date(mov.fecha).toLocaleDateString("es-EC")}
                            </td>
                            <td className={`px-6 py-3 text-sm font-mono ${isLight ? "text-gray-900" : "text-white"}`}>
                              {mov.asiento}
                            </td>
                            <td className={`px-6 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                              {mov.detalle}
                            </td>
                            <td className={`px-6 py-3 text-sm text-right font-mono ${mov.debe > 0 ? "text-blue-600 font-medium" : isLight ? "text-gray-400" : "text-gray-600"}`}>
                              {mov.debe > 0 ? fmt(mov.debe) : "-"}
                            </td>
                            <td className={`px-6 py-3 text-sm text-right font-mono ${mov.haber > 0 ? "text-red-600 font-medium" : isLight ? "text-gray-400" : "text-gray-600"}`}>
                              {mov.haber > 0 ? fmt(mov.haber) : "-"}
                            </td>
                            <td className={`px-6 py-3 text-sm text-right font-mono font-medium ${isLight ? "text-gray-900" : "text-white"}`}>
                              {fmt(mov.saldo)}
                            </td>
                          </tr>
                        ))}

                        {/* Totales */}
                        <tr className={`border-t-2 font-semibold ${isLight ? "bg-gray-50 border-gray-300" : "bg-white/[0.05] border-white/20"}`}>
                          <td colSpan={3} className={`px-6 py-3 text-sm ${isLight ? "text-gray-900" : "text-white"}`}>
                            TOTALES
                          </td>
                          <td className={`px-6 py-3 text-sm text-right font-mono text-blue-600`}>
                            {fmt(totales.totalDebe)}
                          </td>
                          <td className={`px-6 py-3 text-sm text-right font-mono text-red-600`}>
                            {fmt(totales.totalHaber)}
                          </td>
                          <td className={`px-6 py-3 text-sm text-right font-mono font-bold ${totales.saldoFinal >= 0 ? "text-green-600" : "text-red-600"}`}>
                            {fmt(totales.saldoFinal)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Información adicional */}
      {cuentasAMostrar.length === 0 && (
        <div className={`${card} p-12 text-center`}>
          <div className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            No se encontraron cuentas que coincidan con los criterios de búsqueda
          </div>
        </div>
      )}
    </div>
  );
}
