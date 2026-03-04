import { useState } from "react";
import { Download, Printer, TrendingUp, TrendingDown, DollarSign, BarChart2, ChevronDown, ChevronRight } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { printBalanceSheet, downloadBalanceSheetCSV } from "../utils/print-download";
import { toast } from "sonner";
import { AccountingKpiCard } from "./ui/accounting-kpi-card";

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

  const card   = `rounded-xl ${isLight ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`;
  const secHdr = (label: string, key: keyof typeof expanded, total: number) => (
    <button onClick={() => toggle(key)} className={`w-full flex items-center justify-between px-5 py-3 border-b text-sm font-semibold transition-colors ${isLight ? "border-gray-100 text-gray-700 hover:bg-gray-50" : "border-white/5 text-gray-200 hover:bg-white/[0.03]"}`}>
      <div className="flex items-center gap-2">
        {expanded[key] ? <ChevronDown className="w-4 h-4 text-primary" /> : <ChevronRight className="w-4 h-4 text-primary" />}
        {label}
      </div>
      <span className={`font-mono ${isLight ? "text-gray-900" : "text-white"}`}>{fmt(total)}</span>
    </button>
  );

  const row = (nombre: string, valor: number) => (
    <div key={nombre} className={`flex items-center justify-between px-5 py-2.5 border-b transition-colors ${isLight ? "border-gray-50 hover:bg-gray-50" : "border-white/[0.04] hover:bg-white/[0.02]"}`}>
      <div className="flex items-center gap-2 pl-4">
        <div className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
        <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>{nombre}</span>
      </div>
      <span className={`text-sm font-mono ${isLight ? "text-gray-800" : "text-gray-200"}`}>{fmt(valor)}</span>
    </div>
  );

  const totalRow = (label: string, valor: number, primary = false) => (
    <div className={`flex items-center justify-between px-5 py-3 ${primary ? "bg-primary/10" : isLight ? "bg-gray-50" : "bg-white/[0.04]"}`}>
      <span className={`text-sm font-bold ${primary ? "text-primary" : isLight ? "text-gray-700" : "text-gray-300"}`}>{label}</span>
      <span className={`text-sm font-bold font-mono ${primary ? "text-primary" : isLight ? "text-gray-900" : "text-white"}`}>{fmt(valor)}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Activos",    value: fmt(totalActivo),    icon: <TrendingUp className="w-5 h-5 text-blue-400" />,   iconBg: "bg-blue-500/20"   },
          { label: "Total Pasivos",    value: fmt(totalPasivo),    icon: <TrendingDown className="w-5 h-5 text-red-400" />,  iconBg: "bg-red-500/20"    },
          { label: "Patrimonio",       value: fmt(totalPatrimonio),icon: <DollarSign className="w-5 h-5 text-green-400" />,  iconBg: "bg-green-500/20"  },
          { label: "Activos / Pasivos",value: `${(totalActivo / totalPasPat * 100).toFixed(1)}%`, icon: <BarChart2 className="w-5 h-5 text-primary" />, iconBg: "bg-primary/20" },
        ].map(m => (
          <AccountingKpiCard key={m.label} label={m.label} value={m.value} icon={m.icon} iconBg={m.iconBg} />
        ))}
      </div>

      <div className={`border-t ${isLight ? "border-gray-200" : "border-white/10"}`} />

      {/* Acciones */}
      <div className="flex justify-end gap-2">
        <button onClick={() => { downloadBalanceSheetCSV(balanceData); toast.success("Balance exportado como CSV"); }}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
        <button onClick={() => printBalanceSheet(balanceData)}
          className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-primary/20">
          <Printer className="w-4 h-4" /> Imprimir / PDF
        </button>
      </div>

      {/* Balance en dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ACTIVOS */}
        <div className={`${card} overflow-hidden`}>
          <div className={`px-5 py-4 border-b ${isLight ? "bg-blue-50 border-blue-100" : "bg-blue-500/10 border-blue-500/20"}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-bold flex items-center gap-2 ${isLight ? "text-blue-800" : "text-blue-300"}`}>
                <TrendingUp className="w-5 h-5" /> ACTIVOS
              </h3>
              <span className={`font-bold font-mono ${isLight ? "text-blue-800" : "text-blue-300"}`}>{fmt(totalActivo)}</span>
            </div>
          </div>
          {secHdr("Activos Corrientes", "actCor", totalActCor)}
          {expanded.actCor && BALANCE.activos.corrientes.map(i => row(i.nombre, i.valor))}
          {expanded.actCor && totalRow("Subtotal Activos Corrientes", totalActCor)}
          {secHdr("Activos No Corrientes", "actNoCor", totalActNoCor)}
          {expanded.actNoCor && BALANCE.activos.noCorrientes.map(i => row(i.nombre, i.valor))}
          {expanded.actNoCor && totalRow("Subtotal Activos No Corrientes", totalActNoCor)}
          {totalRow("TOTAL ACTIVOS", totalActivo, true)}
        </div>

        {/* PASIVOS + PATRIMONIO */}
        <div className={`${card} overflow-hidden`}>
          <div className={`px-5 py-4 border-b ${isLight ? "bg-red-50 border-red-100" : "bg-red-500/10 border-red-500/20"}`}>
            <div className="flex items-center justify-between">
              <h3 className={`font-bold flex items-center gap-2 ${isLight ? "text-red-800" : "text-red-300"}`}>
                <TrendingDown className="w-5 h-5" /> PASIVOS + PATRIMONIO
              </h3>
              <span className={`font-bold font-mono ${isLight ? "text-red-800" : "text-red-300"}`}>{fmt(totalPasPat)}</span>
            </div>
          </div>
          {secHdr("Pasivos Corrientes", "pasCor", totalPasCor)}
          {expanded.pasCor && BALANCE.pasivos.corrientes.map(i => row(i.nombre, i.valor))}
          {expanded.pasCor && totalRow("Subtotal Pasivos Corrientes", totalPasCor)}
          {secHdr("Pasivos No Corrientes", "pasNoCor", totalPasNoCor)}
          {expanded.pasNoCor && BALANCE.pasivos.noCorrientes.map(i => row(i.nombre, i.valor))}
          {expanded.pasNoCor && totalRow("Subtotal Pasivos No Corrientes", totalPasNoCor)}
          {totalRow("TOTAL PASIVOS", totalPasivo)}
          {secHdr("Patrimonio", "pat", totalPatrimonio)}
          {expanded.pat && BALANCE.patrimonio.map(i => row(i.nombre, i.valor))}
          {expanded.pat && totalRow("Total Patrimonio", totalPatrimonio)}
          {totalRow("TOTAL PASIVOS + PATRIMONIO", totalPasPat, true)}
          <div className={`px-5 py-3 flex items-center justify-between border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <span className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Diferencia (Activos − Pasivos+Pat.):</span>
            <span className={`font-mono text-xs font-bold ${Math.abs(totalActivo - totalPasPat) < 0.01 ? "text-green-400" : "text-red-400"}`}>
              {fmt(Math.abs(totalActivo - totalPasPat))} {Math.abs(totalActivo - totalPasPat) < 0.01 ? "✓ Cuadra" : "✗ No cuadra"}
            </span>
          </div>
        </div>
      </div>

      <p className={`text-xs text-center ${isLight ? "text-gray-400" : "text-gray-500"}`}>
        Balance General al {BALANCE.fecha} • Generado el 04 de marzo, 2026
      </p>
    </div>
  );
}