import { useState } from "react";
import { Search, Download, ChevronDown, Printer, Filter } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import { DateRangePicker } from "./date-range-picker";

const CUENTAS_MAYOR = [
  {
    codigo: "1.1.1.01",
    nombre: "Caja General",
    tipo: "Activo",
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
    codigo: "1.1.1.02",
    nombre: "Banco Pichincha Cte.",
    tipo: "Activo",
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
    codigo: "1.1.2.01",
    nombre: "Cuentas por Cobrar Clientes",
    tipo: "Activo",
    saldoInicial: 28000.00,
    movimientos: [
      { fecha: "2026-03-01", asiento: "AS-001", detalle: "Factura #145 - Cliente ABC", debe: 5600.00, haber: 0, saldo: 33600.00 },
      { fecha: "2026-03-07", asiento: "AS-008", detalle: "Cobro Factura #120", debe: 0, haber: 3200.00, saldo: 30400.00 },
      { fecha: "2026-03-14", asiento: "AS-017", detalle: "Factura #146 - Cliente XYZ", debe: 7800.00, haber: 0, saldo: 38200.00 },
      { fecha: "2026-03-21", asiento: "AS-026", detalle: "Cobro Factura #145", debe: 0, haber: 5600.00, saldo: 32600.00 },
    ],
  },
  {
    codigo: "1.1.4.01",
    nombre: "Inventario",
    tipo: "Activo",
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
    codigo: "2.1.1.01",
    nombre: "Proveedores Locales",
    tipo: "Pasivo",
    saldoInicial: 32000.00,
    movimientos: [
      { fecha: "2026-03-04", asiento: "AS-004", detalle: "Factura Proveedor #789", debe: 0, haber: 12000.00, saldo: 44000.00 },
      { fecha: "2026-03-09", asiento: "AS-010", detalle: "Pago Factura #756", debe: 8000.00, haber: 0, saldo: 36000.00 },
      { fecha: "2026-03-11", asiento: "AS-013", detalle: "Factura Proveedor #790", debe: 0, haber: 8500.00, saldo: 44500.00 },
      { fecha: "2026-03-19", asiento: "AS-023", detalle: "Pago Factura #789", debe: 12000.00, haber: 0, saldo: 32500.00 },
    ],
  },
  {
    codigo: "4.1.1.01",
    nombre: "Ventas",
    tipo: "Ingreso",
    saldoInicial: 0,
    movimientos: [
      { fecha: "2026-03-01", asiento: "AS-001", detalle: "Venta Factura #145", debe: 0, haber: 2500.00, saldo: 2500.00 },
      { fecha: "2026-03-14", asiento: "AS-017", detalle: "Venta Factura #146", debe: 0, haber: 7800.00, saldo: 10300.00 },
      { fecha: "2026-03-20", asiento: "AS-025", detalle: "Venta Factura #147", debe: 0, haber: 1850.00, saldo: 12150.00 },
    ],
  },
  {
    codigo: "5.1.1.01",
    nombre: "Sueldos y Salarios",
    tipo: "Gasto",
    saldoInicial: 0,
    movimientos: [
      { fecha: "2026-03-03", asiento: "AS-003", detalle: "Pago de nómina administrativa", debe: 8000.00, haber: 0, saldo: 8000.00 },
      { fecha: "2026-03-15", asiento: "AS-018", detalle: "Pago de nómina operativa", debe: 4200.00, haber: 0, saldo: 12200.00 },
    ],
  },
];

export function LedgerContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [search, setSearch] = useState("");
  const [filterTipo, setFilterTipo] = useState("all");
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());
  const [dateRange, setDateRange] = useState<[Date, Date]>([new Date("2026-03-01"), new Date("2026-03-31")]);

  const filtered = CUENTAS_MAYOR.filter(c => {
    const q = search.toLowerCase();
    const matchQ = c.codigo.includes(q) || c.nombre.toLowerCase().includes(q);
    const matchT = filterTipo === "all" || c.tipo === filterTipo;
    return matchQ && matchT;
  });

  const toggle = (codigo: string) => {
    const newSet = new Set(expandedAccounts);
    if (newSet.has(codigo)) {
      newSet.delete(codigo);
    } else {
      newSet.add(codigo);
    }
    setExpandedAccounts(newSet);
  };

  const exportCSV = () => {
    toast.success("Libro Mayor exportado a CSV");
  };

  const print = () => {
    toast.success("Imprimiendo Libro Mayor");
  };

  const fmt = (v: number) => `$${v.toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Formatear el período seleccionado
  const formatPeriodo = () => {
    const desde = dateRange[0];
    const hasta = dateRange[1];
    const opciones: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const desdeStr = desde.toLocaleDateString('es-EC', opciones);
    const hastaStr = hasta.toLocaleDateString('es-EC', opciones);
    return `${desdeStr} - ${hastaStr}`;
  };

  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const card = `rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;
  const inp = `px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const opt = "bg-[#0D1B2A]";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h2 className={`text-lg font-bold ${txt}`}>Libro Mayor</h2>
          <p className={`text-xs mt-0.5 ${sub}`}>{filtered.length} cuentas · Período: {formatPeriodo()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button onClick={print} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub} pointer-events-none`} />
          <input type="text" placeholder="Buscar cuenta..." value={search} onChange={e => setSearch(e.target.value)} className={`${inp} pl-10 w-full`} />
        </div>
        <div className="relative">
          <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub} pointer-events-none`} />
          <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)} className={`${inp} pl-10 w-full appearance-none`}>
            <option value="all" className={opt}>Todos los tipos</option>
            <option value="Activo" className={opt}>Activo</option>
            <option value="Pasivo" className={opt}>Pasivo</option>
            <option value="Patrimonio" className={opt}>Patrimonio</option>
            <option value="Ingreso" className={opt}>Ingreso</option>
            <option value="Gasto" className={opt}>Gasto</option>
          </select>
        </div>
        <div className="col-span-1 md:col-span-2">
          <DateRangePicker 
            dateFrom={dateRange[0].toISOString().split('T')[0]} 
            dateTo={dateRange[1].toISOString().split('T')[0]} 
            onDateFromChange={(val) => setDateRange([new Date(val), dateRange[1]])} 
            onDateToChange={(val) => setDateRange([dateRange[0], new Date(val)])} 
          />
        </div>
      </div>

      {/* Lista de cuentas */}
      <div className="space-y-3">
        {filtered.map(cuenta => {
          const isExpanded = expandedAccounts.has(cuenta.codigo);
          const totalDebe = cuenta.movimientos.reduce((s, m) => s + m.debe, 0);
          const totalHaber = cuenta.movimientos.reduce((s, m) => s + m.haber, 0);
          const saldoFinal = cuenta.movimientos[cuenta.movimientos.length - 1]?.saldo || cuenta.saldoInicial;

          return (
            <div key={cuenta.codigo} className={card}>
              {/* Cabecera de cuenta */}
              <div className={`flex items-center justify-between p-4 cursor-pointer ${isLight ? "hover:bg-gray-50/50" : "hover:bg-white/[0.02]"} transition-colors`} onClick={() => toggle(cuenta.codigo)}>
                <div className="flex items-center gap-3 flex-1">
                  <ChevronDown className={`w-4 h-4 ${sub} transition-transform ${isExpanded ? "" : "-rotate-90"}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono font-semibold text-primary">{cuenta.codigo}</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                        cuenta.tipo === "Activo" ? isLight ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        cuenta.tipo === "Pasivo" ? isLight ? "bg-red-50 text-red-700 border border-red-200" : "bg-red-500/10 text-red-400 border border-red-500/20" :
                        cuenta.tipo === "Patrimonio" ? isLight ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-purple-500/10 text-purple-400 border border-purple-500/20" :
                        cuenta.tipo === "Ingreso" ? isLight ? "bg-green-50 text-green-700 border border-green-200" : "bg-green-500/10 text-green-400 border border-green-500/20" :
                        isLight ? "bg-orange-50 text-orange-700 border border-orange-200" : "bg-orange-500/10 text-orange-400 border border-orange-500/20"
                      }`}>
                        {cuenta.tipo}
                      </span>
                    </div>
                    <p className={`text-sm font-semibold ${txt} mt-0.5`}>{cuenta.nombre}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className={`text-xs ${sub}`}>Saldo Inicial</p>
                    <p className={`text-sm font-mono font-semibold ${txt}`}>{fmt(cuenta.saldoInicial)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${sub}`}>Saldo Final</p>
                    <p className={`text-sm font-mono font-bold text-primary`}>{fmt(saldoFinal)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs ${sub}`}>Movimientos</p>
                    <p className={`text-sm font-semibold ${txt}`}>{cuenta.movimientos.length}</p>
                  </div>
                </div>
              </div>

              {/* Detalle de movimientos */}
              {isExpanded && (
                <div className={`border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className={`${isLight ? "bg-gray-50/50 border-b border-gray-200" : "bg-white/[0.02] border-b border-white/5"}`}>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>Fecha</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>Asiento</th>
                          <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>Detalle</th>
                          <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${sub}`}>Debe</th>
                          <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${sub}`}>Haber</th>
                          <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${sub}`}>Saldo</th>
                        </tr>
                      </thead>
                      <tbody className={isLight ? "bg-white" : ""}>
                        {/* Saldo inicial */}
                        <tr className={isLight ? "bg-blue-50/50" : "bg-blue-500/5"}>
                          <td className={`px-4 py-3 text-sm ${txt}`} colSpan={3}>
                            <span className="font-semibold">Saldo Inicial</span>
                          </td>
                          <td className={`px-4 py-3 text-right text-sm font-mono ${sub}`}>—</td>
                          <td className={`px-4 py-3 text-right text-sm font-mono ${sub}`}>—</td>
                          <td className={`px-4 py-3 text-right text-sm font-mono font-semibold ${txt}`}>{fmt(cuenta.saldoInicial)}</td>
                        </tr>

                        {/* Movimientos */}
                        {cuenta.movimientos.map((mov, idx) => (
                          <tr key={idx} className={`${isLight ? "hover:bg-gray-50/50" : "hover:bg-white/[0.02]"} transition-colors`}>
                            <td className={`px-4 py-4 text-sm ${txt}`}>{mov.fecha}</td>
                            <td className="px-4 py-4">
                              <span className="text-sm font-mono font-semibold text-primary">{mov.asiento}</span>
                            </td>
                            <td className={`px-4 py-4 text-sm ${txt}`}>{mov.detalle}</td>
                            <td className={`px-4 py-4 text-right text-sm font-mono ${txt}`}>{mov.debe > 0 ? fmt(mov.debe) : "—"}</td>
                            <td className={`px-4 py-4 text-right text-sm font-mono ${txt}`}>{mov.haber > 0 ? fmt(mov.haber) : "—"}</td>
                            <td className={`px-4 py-4 text-right text-sm font-mono font-semibold ${txt}`}>{fmt(mov.saldo)}</td>
                          </tr>
                        ))}

                        {/* Totales */}
                        <tr className={`border-t-2 ${isLight ? "border-gray-300 bg-gray-50" : "border-white/20 bg-white/5"}`}>
                          <td colSpan={3} className={`px-4 py-3 text-sm font-bold ${txt}`}>TOTALES</td>
                          <td className={`px-4 py-3 text-right text-sm font-mono font-bold ${txt}`}>{fmt(totalDebe)}</td>
                          <td className={`px-4 py-3 text-right text-sm font-mono font-bold ${txt}`}>{fmt(totalHaber)}</td>
                          <td className={`px-4 py-3 text-right text-sm font-mono font-bold text-primary`}>{fmt(saldoFinal)}</td>
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

      {filtered.length === 0 && (
        <div className={`${card} py-12 text-center`}>
          <p className={`text-sm ${sub}`}>No se encontraron cuentas</p>
        </div>
      )}
    </div>
  );
}