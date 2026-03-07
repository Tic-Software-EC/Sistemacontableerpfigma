import { useState } from "react";
import { Download, Printer, ChevronRight } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { printBalanceSheet, downloadBalanceSheetCSV } from "../utils/print-download";
import { toast } from "sonner";

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

const fmt = (v: number) => `$${v.toLocaleString("es-EC", { minimumFractionDigits: 2 })}`;

export function BalanceSheetContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [expanded, setExpanded] = useState({ actCor: true, actNoCor: true, pasCor: true, pasNoCor: true, pat: true });
  const toggle = (key: keyof typeof expanded) => setExpanded(p => ({ ...p, [key]: !p[key] }));

  const totalActCor    = BALANCE.activos.corrientes.reduce((s, i) => s + i.valor, 0);
  const totalActNoCor  = BALANCE.activos.noCorrientes.reduce((s, i) => s + i.valor, 0);
  const totalActivo    = totalActCor + totalActNoCor;
  const totalPasCor    = BALANCE.pasivos.corrientes.reduce((s, i) => s + i.valor, 0);
  const totalPasNoCor  = BALANCE.pasivos.noCorrientes.reduce((s, i) => s + i.valor, 0);
  const totalPasivo    = totalPasCor + totalPasNoCor;
  const totalPatrimonio = BALANCE.patrimonio.reduce((s, i) => s + i.valor, 0);
  const totalPasPat    = totalPasivo + totalPatrimonio;

  const balanceData = {
    activos: BALANCE.activos, pasivos: BALANCE.pasivos, patrimonio: BALANCE.patrimonio,
    totalActCor, totalActNoCor, totalActivo,
    totalPasCor, totalPasNoCor, totalPasivo, totalPatrimonio, totalPasPat,
  };

  const card = `rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;
  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";

  const secHdr = (label: string, key: keyof typeof expanded, total: number) => (
    <button 
      onClick={() => toggle(key)} 
      className={`w-full flex items-center justify-between px-4 py-2 text-sm font-semibold transition-colors ${
        isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"
      }`}
    >
      <div className="flex items-center gap-2">
        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expanded[key] ? "rotate-90" : ""} ${sub}`} />
        <span className={txt}>{label}</span>
      </div>
      <span className={`font-mono ${txt}`}>{fmt(total)}</span>
    </button>
  );

  const row = (nombre: string, valor: number) => (
    <div 
      key={nombre} 
      className={`flex items-center justify-between px-4 py-1.5 pl-10 border-t ${
        isLight ? "border-gray-100" : "border-white/5"
      }`}
    >
      <span className={`text-sm ${sub}`}>{nombre}</span>
      <span className={`text-sm font-mono ${txt}`}>{fmt(valor)}</span>
    </div>
  );

  const totalRow = (label: string, valor: number, level: "subtotal" | "total" | "grand" = "subtotal") => {
    const bgClass = level === "grand" 
      ? (isLight ? "bg-gray-100" : "bg-white/10")
      : level === "total"
      ? (isLight ? "bg-gray-50" : "bg-white/5")
      : (isLight ? "bg-gray-50" : "bg-white/5");
    
    const fontWeight = level === "grand" ? "font-bold" : "font-semibold";

    return (
      <div className={`flex items-center justify-between px-4 py-2 border-t ${isLight ? "border-gray-200" : "border-white/10"} ${bgClass}`}>
        <span className={`text-sm ${fontWeight} ${txt}`}>{label}</span>
        <span className={`text-sm ${fontWeight} font-mono ${txt}`}>{fmt(valor)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h2 className={`text-lg font-bold ${txt}`}>Balance General</h2>
          <p className={`text-xs mt-0.5 ${sub}`}>Al {BALANCE.fecha}</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => { downloadBalanceSheetCSV(balanceData); toast.success("Balance exportado como CSV"); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"
            }`}
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button 
            onClick={() => printBalanceSheet(balanceData)}
            className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Activos", value: totalActivo },
          { label: "Total Pasivos", value: totalPasivo },
          { label: "Total Patrimonio", value: totalPatrimonio },
        ].map(item => (
          null
        ))}
      </div>

      {/* Balance en dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ACTIVOS */}
        <div className={`${card} overflow-hidden`}>
          <div className={`px-4 py-2.5 border-b ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
            <h3 className={`text-sm font-bold ${txt}`}>ACTIVOS</h3>
          </div>
          
          {secHdr("Activos Corrientes", "actCor", totalActCor)}
          {expanded.actCor && BALANCE.activos.corrientes.map(i => row(i.nombre, i.valor))}
          {expanded.actCor && totalRow("Subtotal Activos Corrientes", totalActCor, "subtotal")}
          
          {secHdr("Activos No Corrientes", "actNoCor", totalActNoCor)}
          {expanded.actNoCor && BALANCE.activos.noCorrientes.map(i => row(i.nombre, i.valor))}
          {expanded.actNoCor && totalRow("Subtotal Activos No Corrientes", totalActNoCor, "subtotal")}
          
          {totalRow("TOTAL ACTIVOS", totalActivo, "grand")}
        </div>

        {/* PASIVOS + PATRIMONIO */}
        <div className={`${card} overflow-hidden`}>
          <div className={`px-4 py-2.5 border-b ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
            <h3 className={`text-sm font-bold ${txt}`}>PASIVOS Y PATRIMONIO</h3>
          </div>
          
          {secHdr("Pasivos Corrientes", "pasCor", totalPasCor)}
          {expanded.pasCor && BALANCE.pasivos.corrientes.map(i => row(i.nombre, i.valor))}
          {expanded.pasCor && totalRow("Subtotal Pasivos Corrientes", totalPasCor, "subtotal")}
          
          {secHdr("Pasivos No Corrientes", "pasNoCor", totalPasNoCor)}
          {expanded.pasNoCor && BALANCE.pasivos.noCorrientes.map(i => row(i.nombre, i.valor))}
          {expanded.pasNoCor && totalRow("Subtotal Pasivos No Corrientes", totalPasNoCor, "subtotal")}
          
          {totalRow("TOTAL PASIVOS", totalPasivo, "total")}
          
          {secHdr("Patrimonio", "pat", totalPatrimonio)}
          {expanded.pat && BALANCE.patrimonio.map(i => row(i.nombre, i.valor))}
          {expanded.pat && totalRow("Total Patrimonio", totalPatrimonio, "total")}
          
          {totalRow("TOTAL PASIVOS + PATRIMONIO", totalPasPat, "grand")}
        </div>
      </div>

      {/* Verificación */}
      <div className={`${card} px-5 py-3`}>
        <div className="flex items-center justify-between">
          <span className={`text-sm ${sub}`}>Verificación de cuadre:</span>
          <span className={`font-mono text-sm font-semibold ${
            Math.abs(totalActivo - totalPasPat) < 0.01 ? "text-green-600" : "text-red-600"
          }`}>
            {Math.abs(totalActivo - totalPasPat) < 0.01 ? "✓ Balance cuadrado" : `✗ Diferencia: ${fmt(Math.abs(totalActivo - totalPasPat))}`}
          </span>
        </div>
      </div>

      <p className={`text-xs text-center ${sub}`}>
        Generado el 04 de marzo, 2026
      </p>
    </div>
  );
}