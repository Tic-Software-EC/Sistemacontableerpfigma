import { useState } from "react";
import { Download, Printer } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { printIncomeStatement, downloadIncomeStatementCSV } from "../utils/print-download";
import { toast } from "sonner";

const PERIODOS = ["Enero 2026", "Febrero 2026", "Marzo 2026"];

const DATA_POR_PERIODO: Record<string, { ingresos: any[]; costos: any[]; gastos: any[] }> = {
  "Enero 2026": {
    ingresos: [
      { nombre: "Ventas de Productos", valor: 98500 },
      { nombre: "Ventas de Servicios", valor: 12300 },
      { nombre: "(-) Descuentos en Ventas", valor: -2100 },
    ],
    costos: [
      { nombre: "Costo de Ventas", valor: 52800 },
      { nombre: "Costo de Servicios", valor: 4200 },
    ],
    gastos: [
      { nombre: "Sueldos y Salarios", valor: 12400 },
      { nombre: "Beneficios Sociales", valor: 2480 },
      { nombre: "Arriendos", valor: 1800 },
      { nombre: "Servicios Básicos", valor: 420 },
      { nombre: "Depreciaciones", valor: 850 },
      { nombre: "Gastos Bancarios", valor: 340 },
    ],
  },
  "Febrero 2026": {
    ingresos: [
      { nombre: "Ventas de Productos", valor: 112400 },
      { nombre: "Ventas de Servicios", valor: 15600 },
      { nombre: "(-) Descuentos en Ventas", valor: -3200 },
    ],
    costos: [
      { nombre: "Costo de Ventas", valor: 60100 },
      { nombre: "Costo de Servicios", valor: 5800 },
    ],
    gastos: [
      { nombre: "Sueldos y Salarios", valor: 12400 },
      { nombre: "Beneficios Sociales", valor: 2480 },
      { nombre: "Arriendos", valor: 1800 },
      { nombre: "Servicios Básicos", valor: 390 },
      { nombre: "Depreciaciones", valor: 850 },
      { nombre: "Gastos Bancarios", valor: 410 },
    ],
  },
  "Marzo 2026": {
    ingresos: [
      { nombre: "Ventas de Productos", valor: 131200 },
      { nombre: "Ventas de Servicios", valor: 18400 },
      { nombre: "(-) Descuentos en Ventas", valor: -4100 },
    ],
    costos: [
      { nombre: "Costo de Ventas", valor: 72400 },
      { nombre: "Costo de Servicios", valor: 6800 },
    ],
    gastos: [
      { nombre: "Sueldos y Salarios", valor: 12400 },
      { nombre: "Beneficios Sociales", valor: 2480 },
      { nombre: "Arriendos", valor: 1800 },
      { nombre: "Servicios Básicos", valor: 480 },
      { nombre: "Depreciaciones", valor: 850 },
      { nombre: "Gastos Bancarios", valor: 290 },
    ],
  },
};

const fmt = (v: number) => `$${v.toLocaleString("es-EC", { minimumFractionDigits: 2 })}`;

export function IncomeStatementContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [periodo, setPeriodo] = useState("Marzo 2026");
  const data = DATA_POR_PERIODO[periodo];

  const totalIngresos = data.ingresos.reduce((s, i) => s + i.valor, 0);
  const totalCostos   = data.costos.reduce((s, i) => s + i.valor, 0);
  const utilidadBruta = totalIngresos - totalCostos;
  const totalGastos   = data.gastos.reduce((s, i) => s + i.valor, 0);
  const utilidadOper  = utilidadBruta - totalGastos;
  const impuesto      = utilidadOper > 0 ? utilidadOper * 0.25 : 0;
  const utilidadNeta  = utilidadOper - impuesto;
  const margenBruto   = totalIngresos > 0 ? (utilidadBruta / totalIngresos * 100) : 0;
  const margenNeto    = totalIngresos > 0 ? (utilidadNeta / totalIngresos * 100) : 0;

  const card = `rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;
  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";

  const incomeData = {
    ingresos: data.ingresos, costos: data.costos, gastos: data.gastos,
    totalIngresos, totalCostos, utilidadBruta, totalGastos, utilidadOper, impuesto, utilidadNeta, margenBruto, margenNeto,
  };

  const row = (nombre: string, valor: number, indent: boolean = false) => (
    <div 
      key={nombre} 
      className={`flex items-center justify-between py-1.5 ${indent ? "pl-6" : "pl-4"} pr-4 border-t ${
        isLight ? "border-gray-100" : "border-white/5"
      }`}
    >
      <span className={`text-sm ${sub}`}>{nombre}</span>
      <span className={`text-sm font-mono ${valor < 0 ? "text-red-600" : txt}`}>{fmt(valor)}</span>
    </div>
  );

  const totalRow = (label: string, valor: number, level: "subtotal" | "total" | "grand" = "subtotal") => {
    const bgClass = level === "grand" 
      ? (isLight ? "bg-gray-100" : "bg-white/10")
      : level === "total"
      ? (isLight ? "bg-gray-50" : "bg-white/5")
      : "";
    
    const fontWeight = level === "grand" ? "font-bold" : "font-semibold";
    const colorClass = valor < 0 ? "text-red-600" : txt;

    return (
      <div className={`flex items-center justify-between px-4 py-2 border-t ${isLight ? "border-gray-200" : "border-white/10"} ${bgClass}`}>
        <span className={`text-sm ${fontWeight} ${txt}`}>{label}</span>
        <span className={`text-sm ${fontWeight} font-mono ${colorClass}`}>{fmt(valor)}</span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h2 className={`text-lg font-bold ${txt}`}>Estado de Resultados</h2>
          <p className={`text-xs mt-0.5 ${sub}`}>Periodo: {periodo}</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            className={`px-3 py-2 border rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${
              isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"
            }`}
          >
            {PERIODOS.map(p => (
              <option key={p} value={p} className="bg-[#0D1B2A]">{p}</option>
            ))}
          </select>
          <button 
            onClick={() => { downloadIncomeStatementCSV(incomeData, periodo); toast.success("Estado de resultados exportado"); }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"
            }`}
          >
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button 
            onClick={() => printIncomeStatement(incomeData, periodo)}
            className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Ingresos Totales", value: totalIngresos },
          { label: "Utilidad Bruta", value: utilidadBruta },
          { label: "Utilidad Operacional", value: utilidadOper },
          { label: "Utilidad Neta", value: utilidadNeta },
        ].map(item => (
          null
        ))}
      </div>

      {/* Estado de Resultados */}
      <div className={`${card} overflow-hidden`}>
        {/* Ingresos */}
        <div className={`px-4 py-2.5 border-b ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
          <h3 className={`text-sm font-bold ${txt}`}>INGRESOS OPERACIONALES</h3>
        </div>
        {data.ingresos.map(i => row(i.nombre, i.valor, true))}
        {totalRow("Total Ingresos", totalIngresos, "total")}

        {/* Costos */}
        <div className={`px-4 py-2.5 border-t ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
          <h3 className={`text-sm font-bold ${txt}`}>COSTOS DE VENTAS</h3>
        </div>
        {data.costos.map(i => row(i.nombre, i.valor, true))}
        {totalRow("Total Costos", totalCostos, "total")}

        {/* Utilidad Bruta */}
        {totalRow("UTILIDAD BRUTA", utilidadBruta, "grand")}
        <div className={`px-5 py-2 text-xs ${sub} border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
          Margen bruto: {margenBruto.toFixed(1)}%
        </div>

        {/* Gastos */}
        <div className={`px-4 py-2.5 border-t ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
          <h3 className={`text-sm font-bold ${txt}`}>GASTOS OPERACIONALES</h3>
        </div>
        {data.gastos.map(i => row(i.nombre, i.valor, true))}
        {totalRow("Total Gastos", totalGastos, "total")}

        {/* Utilidad Operacional */}
        {totalRow("UTILIDAD OPERACIONAL", utilidadOper, "grand")}

        {/* Impuestos */}
        <div className={`px-4 py-2.5 border-t ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
          <h3 className={`text-sm font-bold ${txt}`}>OTROS</h3>
        </div>
        {row("Impuesto a la Renta (25%)", impuesto, true)}

        {/* Utilidad Neta */}
        {totalRow("UTILIDAD NETA DEL EJERCICIO", utilidadNeta, "grand")}
        <div className={`px-5 py-2 text-xs ${sub}`}>
          Margen neto: {margenNeto.toFixed(1)}%
        </div>
      </div>

      <p className={`text-xs text-center ${sub}`}>
        Generado el 04 de marzo, 2026
      </p>
    </div>
  );
}