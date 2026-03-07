import { useState } from "react";
import { Download, FileDown, Search, Calendar } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import { MonthPicker } from "./month-picker";

const COMPRAS_SAMPLE = [
  { id: "C-001", fecha: "2026-03-01", tipo: "Factura", numero: "001-001-000045", proveedor: "Distribuidora Nacional S.A.", ruc: "1792145678001", base: 5000.00, iva: 600.00, retRenta: 50.00, retIva: 72.00, total: 5600.00 },
  { id: "C-002", fecha: "2026-03-05", tipo: "Factura", numero: "002-001-000089", proveedor: "Kreafast S.A.", ruc: "0992876543001", base: 2000.00, iva: 240.00, retRenta: 20.00, retIva: 28.80, total: 2240.00 },
  { id: "C-003", fecha: "2026-03-10", tipo: "Factura", numero: "001-002-001234", proveedor: "Comercial del Pacífico", ruc: "1791234567001", base: 8500.00, iva: 960.00, retRenta: 85.00, retIva: 115.20, total: 9460.00 },
];

const VENTAS_SAMPLE = [
  { id: "V-001", fecha: "2026-03-02", tipo: "Factura", numero: "001-001-000120", cliente: "Supermercado La Esquina", ruc: "1792156789001", base: 12000.00, iva: 1440.00, total: 13440.00 },
  { id: "V-002", fecha: "2026-03-08", tipo: "Factura", numero: "001-001-000121", cliente: "Restaurante El Sabor", ruc: "0991234567001", base: 6500.00, iva: 780.00, total: 7280.00 },
  { id: "V-003", fecha: "2026-03-15", tipo: "Factura", numero: "001-001-000122", cliente: "Tienda Mayorista XYZ", ruc: "1793456789001", base: 15000.00, iva: 1800.00, total: 16800.00 },
];

const fmt = (v: number) => `$${v.toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function AtsContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [activeTab, setActiveTab] = useState<"compras" | "ventas">("compras");
  const [search, setSearch] = useState("");
  const [fechaDesde, setFechaDesde] = useState("2026-03-01");
  const [fechaHasta, setFechaHasta] = useState("2026-03-07");

  // Formatear el período seleccionado para mostrar en el header
  const formatPeriodo = () => {
    if (!fechaHasta) return "Sin período seleccionado";
    const hasta = new Date(fechaHasta);
    const mes = hasta.toLocaleDateString('es-EC', { month: 'long', year: 'numeric' });
    return mes.charAt(0).toUpperCase() + mes.slice(1);
  };

  const comprasFiltradas = COMPRAS_SAMPLE.filter(c =>
    c.proveedor.toLowerCase().includes(search.toLowerCase()) ||
    c.numero.includes(search) ||
    c.ruc.includes(search)
  );

  const ventasFiltradas = VENTAS_SAMPLE.filter(v =>
    v.cliente.toLowerCase().includes(search.toLowerCase()) ||
    v.numero.includes(search) ||
    v.ruc.includes(search)
  );

  const totalBaseCompras = COMPRAS_SAMPLE.reduce((s, c) => s + c.base, 0);
  const totalIvaCompras = COMPRAS_SAMPLE.reduce((s, c) => s + c.iva, 0);
  const totalRetCompras = COMPRAS_SAMPLE.reduce((s, c) => s + c.retRenta + c.retIva, 0);

  const totalBaseVentas = VENTAS_SAMPLE.reduce((s, v) => s + v.base, 0);
  const totalIvaVentas = VENTAS_SAMPLE.reduce((s, v) => s + v.iva, 0);

  const exportarXML = () => { toast.success("Archivo ATS.XML generado"); };
  const exportarCSV = () => { toast.success("Archivo ATS.CSV exportado"); };

  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const card = `rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;
  const inp = `px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h2 className={`text-lg font-bold ${txt}`}>Anexo Transaccional Simplificado (ATS)</h2>
          <p className={`text-xs mt-0.5 ${sub}`}>{formatPeriodo()} · Formato para SRI</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportarCSV} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button onClick={exportarXML} className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors">
            <FileDown className="w-4 h-4" />
            Generar XML
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-3">
        <div className={`p-3 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`}>
          <p className={`text-xs ${sub}`}>Total Compras</p>
          <p className={`text-xl font-bold ${txt} mt-1`}>{fmt(totalBaseCompras + totalIvaCompras)}</p>
          <p className={`text-xs ${sub} mt-0.5`}>{COMPRAS_SAMPLE.length} transacciones</p>
        </div>
        <div className={`p-3 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`}>
          <p className={`text-xs ${sub}`}>Total Ventas</p>
          <p className={`text-xl font-bold ${txt} mt-1`}>{fmt(totalBaseVentas + totalIvaVentas)}</p>
          <p className={`text-xs ${sub} mt-0.5`}>{VENTAS_SAMPLE.length} transacciones</p>
        </div>
        <div className={`p-3 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`}>
          <p className={`text-xs ${sub}`}>IVA por Pagar</p>
          <p className={`text-xl font-bold text-primary mt-1`}>{fmt(totalIvaVentas - totalIvaCompras)}</p>
          <p className={`text-xs ${sub} mt-0.5`}>Diferencia IVA</p>
        </div>
      </div>

      {/* Filtro de Período Mensual */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center gap-2">
          <Calendar className={`w-4 h-4 ${sub}`} />
          <span className={`text-sm font-medium ${txt}`}>Período:</span>
        </div>
        <div className="flex-1 max-w-xs">
          <MonthPicker 
            dateFrom={fechaDesde} 
            dateTo={fechaHasta} 
            onDateFromChange={setFechaDesde} 
            onDateToChange={setFechaHasta}
            placeholder="Seleccionar mes para ATS" 
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-white/10">
        <button onClick={() => setActiveTab("compras")} className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === "compras" ? "border-primary text-primary" : `border-transparent ${sub} hover:text-gray-700 dark:hover:text-gray-300`}`}>
          Compras ({COMPRAS_SAMPLE.length})
        </button>
        <button onClick={() => setActiveTab("ventas")} className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeTab === "ventas" ? "border-primary text-primary" : `border-transparent ${sub} hover:text-gray-700 dark:hover:text-gray-300`}`}>
          Ventas ({VENTAS_SAMPLE.length})
        </button>
      </div>

      {/* Filtros */}
      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
        <input type="text" placeholder="Buscar por proveedor, cliente, número o RUC..." value={search} onChange={e => setSearch(e.target.value)} className={`${inp} pl-10 w-full`} />
      </div>

      {/* Tabla Compras */}
      {activeTab === "compras" && (
        <div className={card}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isLight ? "bg-gray-50/50 border-b border-gray-200" : "bg-white/[0.02] border-b border-white/5"}`}>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>Fecha</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>Comprobante</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>Proveedor</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>RUC</th>
                  <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${sub}`}>Base</th>
                  <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${sub}`}>IVA</th>
                  <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${sub}`}>Ret. Renta</th>
                  <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${sub}`}>Ret. IVA</th>
                  <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${sub}`}>Total</th>
                </tr>
              </thead>
              <tbody className={isLight ? "bg-white" : ""}>
                {comprasFiltradas.map((c, idx) => (
                  <tr key={c.id} className={`${isLight ? "hover:bg-gray-50/50" : "hover:bg-white/[0.02]"} transition-colors`}>
                    <td className={`px-4 py-4 text-sm ${txt}`}>{c.fecha}</td>
                    <td className={`px-4 py-4 text-sm ${txt}`}>
                      <div>{c.tipo}</div>
                      <div className={`text-xs font-mono ${sub}`}>{c.numero}</div>
                    </td>
                    <td className={`px-4 py-4 text-sm ${txt}`}>{c.proveedor}</td>
                    <td className={`px-4 py-4 text-sm font-mono ${txt}`}>{c.ruc}</td>
                    <td className={`px-4 py-4 text-right text-sm font-mono ${txt}`}>{fmt(c.base)}</td>
                    <td className={`px-4 py-4 text-right text-sm font-mono ${txt}`}>{fmt(c.iva)}</td>
                    <td className={`px-4 py-4 text-right text-sm font-mono ${txt}`}>{fmt(c.retRenta)}</td>
                    <td className={`px-4 py-4 text-right text-sm font-mono ${txt}`}>{fmt(c.retIva)}</td>
                    <td className={`px-4 py-4 text-right text-sm font-mono font-semibold ${txt}`}>{fmt(c.total)}</td>
                  </tr>
                ))}
                <tr className={`border-t-2 ${isLight ? "border-gray-300 bg-gray-50" : "border-white/20 bg-white/5"}`}>
                  <td colSpan={4} className={`px-4 py-3 text-sm font-bold ${txt}`}>TOTALES</td>
                  <td className={`px-4 py-3 text-right text-sm font-mono font-bold ${txt}`}>{fmt(totalBaseCompras)}</td>
                  <td className={`px-4 py-3 text-right text-sm font-mono font-bold ${txt}`}>{fmt(totalIvaCompras)}</td>
                  <td className={`px-4 py-3 text-right text-sm font-mono font-bold ${txt}`}>{fmt(COMPRAS_SAMPLE.reduce((s, c) => s + c.retRenta, 0))}</td>
                  <td className={`px-4 py-3 text-right text-sm font-mono font-bold ${txt}`}>{fmt(COMPRAS_SAMPLE.reduce((s, c) => s + c.retIva, 0))}</td>
                  <td className={`px-4 py-3 text-right text-sm font-mono font-bold text-primary`}>{fmt(COMPRAS_SAMPLE.reduce((s, c) => s + c.total, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {comprasFiltradas.length === 0 && (
            <div className="py-12 text-center">
              <p className={`text-sm ${sub}`}>No se encontraron compras</p>
            </div>
          )}
        </div>
      )}

      {/* Tabla Ventas */}
      {activeTab === "ventas" && (
        <div className={card}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isLight ? "bg-gray-50/50 border-b border-gray-200" : "bg-white/[0.02] border-b border-white/5"}`}>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>Fecha</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>Comprobante</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>Cliente</th>
                  <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>RUC</th>
                  <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${sub}`}>Base Imponible</th>
                  <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${sub}`}>IVA</th>
                  <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${sub}`}>Total</th>
                </tr>
              </thead>
              <tbody className={isLight ? "bg-white" : ""}>
                {ventasFiltradas.map((v, idx) => (
                  <tr key={v.id} className={`${isLight ? "hover:bg-gray-50/50" : "hover:bg-white/[0.02]"} transition-colors`}>
                    <td className={`px-4 py-4 text-sm ${txt}`}>{v.fecha}</td>
                    <td className={`px-4 py-4 text-sm ${txt}`}>
                      <div>{v.tipo}</div>
                      <div className={`text-xs font-mono ${sub}`}>{v.numero}</div>
                    </td>
                    <td className={`px-4 py-4 text-sm ${txt}`}>{v.cliente}</td>
                    <td className={`px-4 py-4 text-sm font-mono ${txt}`}>{v.ruc}</td>
                    <td className={`px-4 py-4 text-right text-sm font-mono ${txt}`}>{fmt(v.base)}</td>
                    <td className={`px-4 py-4 text-right text-sm font-mono ${txt}`}>{fmt(v.iva)}</td>
                    <td className={`px-4 py-4 text-right text-sm font-mono font-semibold ${txt}`}>{fmt(v.total)}</td>
                  </tr>
                ))}
                <tr className={`border-t-2 ${isLight ? "border-gray-300 bg-gray-50" : "border-white/20 bg-white/5"}`}>
                  <td colSpan={4} className={`px-4 py-3 text-sm font-bold ${txt}`}>TOTALES</td>
                  <td className={`px-4 py-3 text-right text-sm font-mono font-bold ${txt}`}>{fmt(totalBaseVentas)}</td>
                  <td className={`px-4 py-3 text-right text-sm font-mono font-bold ${txt}`}>{fmt(totalIvaVentas)}</td>
                  <td className={`px-4 py-3 text-right text-sm font-mono font-bold text-primary`}>{fmt(VENTAS_SAMPLE.reduce((s, v) => s + v.total, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {ventasFiltradas.length === 0 && (
            <div className="py-12 text-center">
              <p className={`text-sm ${sub}`}>No se encontraron ventas</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}