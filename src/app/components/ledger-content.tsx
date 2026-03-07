import { useState } from "react";
import { Search, Download, ChevronRight } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

// Datos de ejemplo del Libro Mayor
const CUENTAS_MAYOR = [
  {
    codigo: "1.1.1.01",
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
    codigo: "1.1.1.02",
    nombre: "Banco Pichincha Cte.",
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
  const [expandedAccounts, setExpandedAccounts] = useState<Set<string>>(new Set());

  const filtered = CUENTAS_MAYOR.filter(c => {
    const q = search.toLowerCase();
    return c.codigo.includes(q) || c.nombre.toLowerCase().includes(q);
  });

  const toggle = (codigo: string) => {
    setExpandedAccounts(prev => {
      const n = new Set(prev);
      n.has(codigo) ? n.delete(codigo) : n.add(codigo);
      return n;
    });
  };

  const fmt = (v: number) => `$${v.toLocaleString("es-EC", { minimumFractionDigits: 2 })}`;

  const card = `rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;
  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";

  const exportCSV = () => {
    let csv = "Cuenta,Fecha,Asiento,Detalle,Debe,Haber,Saldo\n";
    CUENTAS_MAYOR.forEach(c => {
      c.movimientos.forEach(m => {
        csv += `"${c.codigo} - ${c.nombre}","${m.fecha}","${m.asiento}","${m.detalle}",${m.debe},${m.haber},${m.saldo}\n`;
      });
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "libro-mayor.csv";
    a.click();
    toast.success("Libro Mayor exportado");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-5 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h2 className={`text-xl font-bold ${txt}`}>Libro Mayor General</h2>
          <p className={`text-sm mt-1 ${sub}`}>{CUENTAS_MAYOR.length} cuentas con movimientos</p>
        </div>

        <button
          onClick={exportCSV}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
            isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"
          }`}
        >
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Buscador */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
        <input
          type="text"
          placeholder="Buscar cuenta por código o nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${
            isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"
          }`}
        />
      </div>

      {/* Cuentas */}
      <div className="space-y-3">
        {filtered.map((cuenta) => {
          const isExpanded = expandedAccounts.has(cuenta.codigo);
          const totalDebe = cuenta.movimientos.reduce((s, m) => s + m.debe, 0);
          const totalHaber = cuenta.movimientos.reduce((s, m) => s + m.haber, 0);
          const saldoFinal = cuenta.movimientos[cuenta.movimientos.length - 1]?.saldo || cuenta.saldoInicial;

          return (
            <div key={cuenta.codigo} className={card}>
              {/* Header de cuenta */}
              <button
                onClick={() => toggle(cuenta.codigo)}
                className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${
                  isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <ChevronRight 
                    className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-90" : ""} ${sub}`} 
                  />
                  <div className="text-left">
                    <div className={`font-semibold ${txt}`}>{cuenta.codigo} — {cuenta.nombre}</div>
                    <div className={`text-xs mt-0.5 ${sub}`}>
                      {cuenta.movimientos.length} movimientos · Saldo inicial: {fmt(cuenta.saldoInicial)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-semibold ${txt}`}>Saldo final</div>
                  <div className={`text-lg font-bold font-mono ${txt}`}>{fmt(saldoFinal)}</div>
                </div>
              </button>

              {/* Movimientos */}
              {isExpanded && (
                <div className={`border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  {/* Header de tabla */}
                  <div className={`px-5 py-3 border-b ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <div className="grid grid-cols-12 gap-4 text-xs font-semibold uppercase tracking-wide">
                      <div className={`col-span-1 ${sub}`}>Fecha</div>
                      <div className={`col-span-1 ${sub}`}>Asiento</div>
                      <div className={`col-span-5 ${sub}`}>Detalle</div>
                      <div className={`col-span-1 text-right ${sub}`}>Debe</div>
                      <div className={`col-span-1 text-right ${sub}`}>Haber</div>
                      <div className={`col-span-2 text-right ${sub}`}>Saldo</div>
                      <div className={`col-span-1 ${sub}`}></div>
                    </div>
                  </div>

                  {/* Saldo inicial */}
                  <div className={`px-5 py-3 border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
                    <div className="grid grid-cols-12 gap-4">
                      <div className={`col-span-7 text-sm font-medium ${txt}`}>Saldo Inicial</div>
                      <div className="col-span-1"></div>
                      <div className="col-span-1"></div>
                      <div className={`col-span-2 text-right text-sm font-mono ${txt}`}>{fmt(cuenta.saldoInicial)}</div>
                      <div className="col-span-1"></div>
                    </div>
                  </div>

                  {/* Movimientos */}
                  {cuenta.movimientos.map((mov, idx) => (
                    <div 
                      key={idx}
                      className={`px-5 py-3 border-b ${isLight ? "border-gray-100 hover:bg-gray-50" : "border-white/5 hover:bg-white/[0.02]"} transition-colors`}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className={`col-span-1 text-xs ${sub}`}>
                          {new Date(mov.fecha).toLocaleDateString("es-EC", { day: "2-digit", month: "short" })}
                        </div>
                        <div className={`col-span-1 text-xs font-mono ${sub}`}>{mov.asiento}</div>
                        <div className={`col-span-5 text-sm ${txt}`}>{mov.detalle}</div>
                        <div className={`col-span-1 text-right text-sm font-mono ${mov.debe > 0 ? "text-blue-600" : sub}`}>
                          {mov.debe > 0 ? fmt(mov.debe) : "—"}
                        </div>
                        <div className={`col-span-1 text-right text-sm font-mono ${mov.haber > 0 ? "text-green-600" : sub}`}>
                          {mov.haber > 0 ? fmt(mov.haber) : "—"}
                        </div>
                        <div className={`col-span-2 text-right text-sm font-mono font-semibold ${txt}`}>
                          {fmt(mov.saldo)}
                        </div>
                        <div className="col-span-1"></div>
                      </div>
                    </div>
                  ))}

                  {/* Totales */}
                  <div className={`px-5 py-3 ${isLight ? "bg-gray-50" : "bg-white/5"}`}>
                    <div className="grid grid-cols-12 gap-4">
                      <div className={`col-span-7 text-sm font-bold ${txt}`}>TOTALES</div>
                      <div className={`col-span-1 text-right text-sm font-bold font-mono text-blue-600`}>
                        {fmt(totalDebe)}
                      </div>
                      <div className={`col-span-1 text-right text-sm font-bold font-mono text-green-600`}>
                        {fmt(totalHaber)}
                      </div>
                      <div className={`col-span-2 text-right text-sm font-bold font-mono ${txt}`}>
                        {fmt(saldoFinal)}
                      </div>
                      <div className="col-span-1"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className={`text-xs text-center ${sub}`}>
        Generado el 04 de marzo, 2026
      </p>
    </div>
  );
}
