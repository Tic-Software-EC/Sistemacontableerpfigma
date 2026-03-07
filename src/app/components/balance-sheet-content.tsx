import { useState } from "react";
import { Download, Printer, ChevronDown } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { printBalanceSheet, downloadBalanceSheetCSV } from "../utils/print-download";
import { YearPicker } from "./year-picker";

const BALANCE = {
  fecha: "31 de Marzo, 2026",
  activos: {
    corrientes: [
      { nombre: "Caja y Bancos", valor: 122200.00 },
      { nombre: "Cuentas por Cobrar", valor: 36000.00 },
      { nombre: "Crédito Tributario IVA", valor: 4320.00 },
      { nombre: "Inventarios", valor: 68500.00 },
    ],
    noCorrientes: [
      { nombre: "Equipos de Computación (Neto)", valor: 13300.00 },
      { nombre: "Muebles y Enseres (Neto)", valor: 8400.00 },
      { nombre: "Vehículos (Neto)", valor: 24500.00 },
    ]
  },
  pasivos: {
    corrientes: [
      { nombre: "Proveedores por Pagar", valor: 28600.00 },
      { nombre: "Sueldos por Pagar", valor: 12400.00 },
      { nombre: "IVA por Pagar", valor: 9800.00 },
      { nombre: "Ret. Fuente por Pagar", valor: 1240.00 },
    ],
    noCorrientes: [
      { nombre: "Préstamo Bancario L/P", valor: 45000.00 },
    ]
  },
  patrimonio: [
    { nombre: "Capital Suscrito y Pagado", valor: 50000.00 },
    { nombre: "Reserva Legal", valor: 12500.00 },
    { nombre: "Utilidades Retenidas", valor: 87680.00 },
    { nombre: "Utilidad del Ejercicio", valor: 30000.00 },
  ]
};

const fmt = (v: number) => `$${v.toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function BalanceSheetContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [expanded, setExpanded] = useState({ actCor: true, actNoCor: true, pasCor: true, pasNoCor: true, pat: true });
  const [fechaDesde, setFechaDesde] = useState("2026-01-01");
  const [fechaHasta, setFechaHasta] = useState("2026-03-07");
  
  const toggle = (key: keyof typeof expanded) => setExpanded(p => ({ ...p, [key]: !p[key] }));

  // Formatear el período seleccionado (anual)
  const formatPeriodo = () => {
    if (!fechaHasta) return "Sin período seleccionado";
    const desde = new Date(fechaDesde);
    const hasta = new Date(fechaHasta);
    const year = hasta.getFullYear();
    const today = new Date();
    
    // Si es el año actual y la fecha hasta es hoy o cercana
    const isCurrentYear = year === today.getFullYear();
    const isUpToToday = hasta.toDateString() === today.toDateString() || 
                       (hasta.getMonth() === today.getMonth() && hasta.getDate() === today.getDate());
    
    if (isCurrentYear && isUpToToday) {
      const fecha = hasta.toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
      return `31 de diciembre de ${year - 1} al ${fecha}`;
    }
    
    // Año completo pasado
    return `31 de diciembre de ${year}`;
  };

  const totalActCor = BALANCE.activos.corrientes.reduce((s, i) => s + i.valor, 0);
  const totalActNoCor = BALANCE.activos.noCorrientes.reduce((s, i) => s + i.valor, 0);
  const totalActivos = totalActCor + totalActNoCor;

  const totalPasCor = BALANCE.pasivos.corrientes.reduce((s, i) => s + i.valor, 0);
  const totalPasNoCor = BALANCE.pasivos.noCorrientes.reduce((s, i) => s + i.valor, 0);
  const totalPasivos = totalPasCor + totalPasNoCor;

  const totalPatrimonio = BALANCE.patrimonio.reduce((s, i) => s + i.valor, 0);
  const totalPasPat = totalPasivos + totalPatrimonio;

  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const card = `rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;
  const inp = `px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h2 className={`text-lg font-bold ${txt}`}>Balance General</h2>
          <p className={`text-xs mt-0.5 ${sub}`}>Al {formatPeriodo()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => downloadBalanceSheetCSV(BALANCE)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button onClick={() => printBalanceSheet(BALANCE)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Filtro de Fecha */}
      <div className="max-w-xs">
        <YearPicker 
          dateFrom={fechaDesde} 
          dateTo={fechaHasta} 
          onDateFromChange={setFechaDesde} 
          onDateToChange={setFechaHasta} 
        />
      </div>

      {/* Balance */}
      <div className={card}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${isLight ? "bg-gray-50/50 border-b border-gray-200" : "bg-white/[0.02] border-b border-white/5"}`}>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>Cuenta</th>
                <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${sub}`}>Valor</th>
              </tr>
            </thead>
            <tbody className={isLight ? "bg-white" : ""}>
              {/* ACTIVOS */}
              <tr className={`border-b ${isLight ? "border-gray-200 bg-blue-50/50" : "border-white/10 bg-blue-500/10"}`}>
                <td className={`px-4 py-3 text-sm font-bold ${txt}`}>ACTIVOS</td>
                <td className={`px-4 py-3 text-right text-sm font-bold ${txt}`}>{fmt(totalActivos)}</td>
              </tr>

              {/* Activos Corrientes */}
              <tr className={`cursor-pointer ${isLight ? "hover:bg-gray-50/50" : "hover:bg-white/[0.02]"} transition-colors`} onClick={() => toggle("actCor")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ChevronDown className={`w-3.5 h-3.5 ${sub} transition-transform ${expanded.actCor ? "" : "-rotate-90"}`} />
                    <span className={`text-sm font-semibold ${txt}`}>Activos Corrientes</span>
                  </div>
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${txt}`}>{fmt(totalActCor)}</td>
              </tr>
              {expanded.actCor && BALANCE.activos.corrientes.map((item, idx) => (
                <tr key={idx} className={`${isLight ? "hover:bg-gray-50/30" : "hover:bg-white/[0.01]"} transition-colors`}>
                  <td className={`px-4 py-3 pl-12 text-sm ${txt}`}>{item.nombre}</td>
                  <td className={`px-4 py-3 text-right text-sm font-mono ${txt}`}>{fmt(item.valor)}</td>
                </tr>
              ))}

              {/* Activos No Corrientes */}
              <tr className={`cursor-pointer ${isLight ? "hover:bg-gray-50/50" : "hover:bg-white/[0.02]"} transition-colors`} onClick={() => toggle("actNoCor")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ChevronDown className={`w-3.5 h-3.5 ${sub} transition-transform ${expanded.actNoCor ? "" : "-rotate-90"}`} />
                    <span className={`text-sm font-semibold ${txt}`}>Activos No Corrientes</span>
                  </div>
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${txt}`}>{fmt(totalActNoCor)}</td>
              </tr>
              {expanded.actNoCor && BALANCE.activos.noCorrientes.map((item, idx) => (
                <tr key={idx} className={`${isLight ? "hover:bg-gray-50/30" : "hover:bg-white/[0.01]"} transition-colors`}>
                  <td className={`px-4 py-3 pl-12 text-sm ${txt}`}>{item.nombre}</td>
                  <td className={`px-4 py-3 text-right text-sm font-mono ${txt}`}>{fmt(item.valor)}</td>
                </tr>
              ))}

              {/* PASIVOS */}
              <tr className={`border-b ${isLight ? "border-gray-200 bg-red-50/50" : "border-white/10 bg-red-500/10"}`}>
                <td className={`px-4 py-3 text-sm font-bold ${txt}`}>PASIVOS</td>
                <td className={`px-4 py-3 text-right text-sm font-bold ${txt}`}>{fmt(totalPasivos)}</td>
              </tr>

              {/* Pasivos Corrientes */}
              <tr className={`cursor-pointer ${isLight ? "hover:bg-gray-50/50" : "hover:bg-white/[0.02]"} transition-colors`} onClick={() => toggle("pasCor")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ChevronDown className={`w-3.5 h-3.5 ${sub} transition-transform ${expanded.pasCor ? "" : "-rotate-90"}`} />
                    <span className={`text-sm font-semibold ${txt}`}>Pasivos Corrientes</span>
                  </div>
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${txt}`}>{fmt(totalPasCor)}</td>
              </tr>
              {expanded.pasCor && BALANCE.pasivos.corrientes.map((item, idx) => (
                <tr key={idx} className={`${isLight ? "hover:bg-gray-50/30" : "hover:bg-white/[0.01]"} transition-colors`}>
                  <td className={`px-4 py-3 pl-12 text-sm ${txt}`}>{item.nombre}</td>
                  <td className={`px-4 py-3 text-right text-sm font-mono ${txt}`}>{fmt(item.valor)}</td>
                </tr>
              ))}

              {/* Pasivos No Corrientes */}
              <tr className={`cursor-pointer ${isLight ? "hover:bg-gray-50/50" : "hover:bg-white/[0.02]"} transition-colors`} onClick={() => toggle("pasNoCor")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ChevronDown className={`w-3.5 h-3.5 ${sub} transition-transform ${expanded.pasNoCor ? "" : "-rotate-90"}`} />
                    <span className={`text-sm font-semibold ${txt}`}>Pasivos No Corrientes</span>
                  </div>
                </td>
                <td className={`px-4 py-3 text-right text-sm font-semibold ${txt}`}>{fmt(totalPasNoCor)}</td>
              </tr>
              {expanded.pasNoCor && BALANCE.pasivos.noCorrientes.map((item, idx) => (
                <tr key={idx} className={`${isLight ? "hover:bg-gray-50/30" : "hover:bg-white/[0.01]"} transition-colors`}>
                  <td className={`px-4 py-3 pl-12 text-sm ${txt}`}>{item.nombre}</td>
                  <td className={`px-4 py-3 text-right text-sm font-mono ${txt}`}>{fmt(item.valor)}</td>
                </tr>
              ))}

              {/* PATRIMONIO */}
              <tr className={`border-b cursor-pointer ${isLight ? "border-gray-200 bg-purple-50/50 hover:bg-purple-50" : "border-white/10 bg-purple-500/10 hover:bg-purple-500/15"} transition-colors`} onClick={() => toggle("pat")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <ChevronDown className={`w-3.5 h-3.5 ${sub} transition-transform ${expanded.pat ? "" : "-rotate-90"}`} />
                    <span className={`text-sm font-bold ${txt}`}>PATRIMONIO</span>
                  </div>
                </td>
                <td className={`px-4 py-3 text-right text-sm font-bold ${txt}`}>{fmt(totalPatrimonio)}</td>
              </tr>
              {expanded.pat && BALANCE.patrimonio.map((item, idx) => (
                <tr key={idx} className={`${isLight ? "hover:bg-gray-50/30" : "hover:bg-white/[0.01]"} transition-colors`}>
                  <td className={`px-4 py-3 pl-12 text-sm ${txt}`}>{item.nombre}</td>
                  <td className={`px-4 py-3 text-right text-sm font-mono ${txt}`}>{fmt(item.valor)}</td>
                </tr>
              ))}

              {/* TOTAL PASIVO + PATRIMONIO */}
              <tr className={`border-t-2 ${isLight ? "border-gray-300 bg-gray-50" : "border-white/20 bg-white/5"}`}>
                <td className={`px-4 py-3 text-sm font-bold ${txt}`}>TOTAL PASIVO + PATRIMONIO</td>
                <td className={`px-4 py-3 text-right text-sm font-bold text-primary`}>{fmt(totalPasPat)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Verificación */}
      <div className={`flex items-center justify-between p-3 rounded-lg border ${totalActivos === totalPasPat ? (isLight ? "bg-green-50 border-green-200" : "bg-green-500/10 border-green-500/20") : (isLight ? "bg-yellow-50 border-yellow-200" : "bg-yellow-500/10 border-yellow-500/20")}`}>
        <span className={`text-sm font-semibold ${totalActivos === totalPasPat ? "text-green-700" : "text-yellow-700"}`}>
          {totalActivos === totalPasPat ? "✓ Balance Cuadrado" : "⚠ Balance Descuadrado"}
        </span>
        <span className={`text-xs ${totalActivos === totalPasPat ? "text-green-600" : "text-yellow-600"}`}>
          Diferencia: {fmt(Math.abs(totalActivos - totalPasPat))}
        </span>
      </div>
    </div>
  );
}