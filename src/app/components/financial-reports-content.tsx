import { useState } from "react";
import { Download, Printer, TrendingUp, TrendingDown, DollarSign, BarChart2, PieChart as PieIcon, FileText, Calendar, Eye, X } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell,
} from "recharts";
import {
  printFinancialReport, downloadCSV,
  printBalanceSheet, downloadBalanceSheetCSV,
  printIncomeStatement, downloadIncomeStatementCSV,
  printAllRetentions, downloadRetentionsCSV,
  printJournal, downloadJournalCSV,
} from "../utils/print-download";
import { AccountingKpiCard } from "./ui/accounting-kpi-card";

const MONTHS_DATA = [
  { id: "oct-2025", mes: "Oct", ingresos: 82000, gastos: 61000, utilidad: 21000 },
  { id: "nov-2025", mes: "Nov", ingresos: 95000, gastos: 68000, utilidad: 27000 },
  { id: "dic-2025", mes: "Dic", ingresos: 128000, gastos: 84000, utilidad: 44000 },
  { id: "ene-2026", mes: "Ene", ingresos: 108700, gastos: 72690, utilidad: 36010 },
  { id: "feb-2026", mes: "Feb", ingresos: 124800, gastos: 81980, utilidad: 42820 },
  { id: "mar-2026", mes: "Mar", ingresos: 145500, gastos: 95500, utilidad: 50000 },
];

const GASTOS_PIE = [
  { id: "sueldos", name: "Sueldos y Salarios", value: 12400, color: "#E8692E" },
  { id: "costo-ventas", name: "Costo de Ventas",    value: 72400, color: "#3b82f6" },
  { id: "beneficios", name: "Beneficios Sociales",value: 2480,  color: "#a855f7" },
  { id: "arriendos", name: "Arriendos",          value: 1800,  color: "#22c55e" },
  { id: "depreciaciones", name: "Depreciaciones",     value: 850,   color: "#f59e0b" },
  { id: "otros", name: "Otros",              value: 5570,  color: "#6b7280" },
];

const REPORTES = [
  { id: "balance",    nombre: "Balance General",          icono: <BarChart2 className="w-5 h-5" />, tipo: "Estado Financiero", periodo: "Mar 2026", generado: "04/03/2026" },
  { id: "resultados", nombre: "Estado de Resultados",     icono: <TrendingUp className="w-5 h-5" />, tipo: "Estado Financiero", periodo: "Mar 2026", generado: "04/03/2026" },
  { id: "flujo",      nombre: "Flujo de Efectivo",        icono: <PieIcon className="w-5 h-5" />, tipo: "Estado Financiero", periodo: "Mar 2026", generado: "04/03/2026" },
  { id: "mayores",    nombre: "Libro Mayor",              icono: <FileText className="w-5 h-5" />, tipo: "Libro Contable",   periodo: "Mar 2026", generado: "04/03/2026" },
  { id: "diario",     nombre: "Libro Diario",             icono: <Calendar className="w-5 h-5" />, tipo: "Libro Contable",   periodo: "Mar 2026", generado: "04/03/2026" },
  { id: "ret-fuente", nombre: "Retenciones en la Fuente", icono: <FileText className="w-5 h-5" />, tipo: "Tributario",      periodo: "Mar 2026", generado: "04/03/2026" },
  { id: "ret-iva",    nombre: "Retenciones en IVA",       icono: <FileText className="w-5 h-5" />, tipo: "Tributario",      periodo: "Mar 2026", generado: "04/03/2026" },
  { id: "ats",        nombre: "ATS - Anexo Transaccional",icono: <FileText className="w-5 h-5" />, tipo: "Tributario",      periodo: "Mar 2026", generado: "04/03/2026" },
];

const fmt = (v: number) => `$${v.toLocaleString("es-EC", { minimumFractionDigits: 0 })}`;

// Datos para los reportes
const BALANCE_DATA = {
  activos: {
    corrientes: [
      { nombre: "Caja y Bancos", valor: 122200 }, { nombre: "Cuentas por Cobrar", valor: 36000 },
      { nombre: "Crédito Tributario IVA", valor: 4320 }, { nombre: "Inventarios", valor: 68500 },
    ],
    noCorrientes: [
      { nombre: "Equipos de Computación (Neto)", valor: 13300 }, { nombre: "Muebles y Enseres (Neto)", valor: 8400 }, { nombre: "Vehículos (Neto)", valor: 24500 },
    ]
  },
  pasivos: {
    corrientes: [
      { nombre: "Proveedores por Pagar", valor: 28600 }, { nombre: "Sueldos por Pagar", valor: 12400 },
      { nombre: "IVA por Pagar", valor: 9800 }, { nombre: "Ret. Fuente por Pagar", valor: 1240 },
    ],
    noCorrientes: [{ nombre: "Préstamo Bancario L/P", valor: 45000 }]
  },
  patrimonio: [
    { nombre: "Capital Suscrito y Pagado", valor: 50000 }, { nombre: "Reserva Legal", valor: 12500 },
    { nombre: "Utilidades Retenidas", valor: 87680 }, { nombre: "Utilidad del Ejercicio", valor: 30000 },
  ],
  totalActCor: 231020, totalActNoCor: 46200, totalActivo: 277220,
  totalPasCor: 52040, totalPasNoCor: 45000, totalPasivo: 97040,
  totalPatrimonio: 180180, totalPasPat: 277220,
};

const INCOME_DATA = {
  ingresos: [{ nombre: "Ventas de Productos", valor: 131200 }, { nombre: "Ventas de Servicios", valor: 18400 }, { nombre: "(-) Descuentos en Ventas", valor: -4100 }],
  costos:   [{ nombre: "Costo de Ventas", valor: 72400 }, { nombre: "Costo de Servicios", valor: 6800 }],
  gastos:   [{ nombre: "Sueldos y Salarios", valor: 12400 }, { nombre: "Beneficios Sociales", valor: 2480 }, { nombre: "Arriendos", valor: 1800 }, { nombre: "Servicios Básicos", valor: 480 }, { nombre: "Depreciaciones", valor: 850 }, { nombre: "Gastos Bancarios", valor: 290 }],
  totalIngresos: 145500, totalCostos: 79200, utilidadBruta: 66300,
  totalGastos: 18300, utilidadOper: 48000, utilidadNeta: 36000, margenNeto: 24.7,
};

const RETENCIONES_SAMPLE = [
  { id: "RET-2026-001", fecha: "2026-03-01", tipo: "Fuente", contribuyente: "Distribuidora Nacional S.A.", ruc: "1792145678001", comprobante: "F-001-000045", base: 5000, porcentaje: 1, valor: 50, estado: "emitida", num: "001-001-00000012" },
  { id: "RET-2026-002", fecha: "2026-03-02", tipo: "IVA", contribuyente: "Kreafast S.A.", ruc: "0992876543001", comprobante: "F-002-000089", base: 2000, porcentaje: 30, valor: 72, estado: "emitida", num: "001-001-00000013" },
];

const JOURNAL_SAMPLE = [
  { id: "ASI-2026-001", fecha: "2026-03-01", descripcion: "Venta de mercadería - Factura #F001-0045", referencia: "FAC-0045", tipo: "Venta", estado: "aprobado", debe: 5600, haber: 5600, lineas: [] },
  { id: "ASI-2026-002", fecha: "2026-03-02", descripcion: "Compra de mercadería - OC-2026-001", referencia: "OC-001", tipo: "Compra", estado: "aprobado", debe: 3360, haber: 3360, lineas: [] },
];

// Acciones de descarga por tipo de reporte
function getReportActions(id: string, isLight: boolean, periodo: string) {
  const borderBtn = `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`;
  switch (id) {
    case "balance":    return { onView: () => printBalanceSheet(BALANCE_DATA), onDownload: () => { downloadBalanceSheetCSV(BALANCE_DATA); toast.success("Balance General exportado"); }, onPrint: () => printBalanceSheet(BALANCE_DATA) };
    case "resultados": return { onView: () => printIncomeStatement(INCOME_DATA, periodo), onDownload: () => { downloadIncomeStatementCSV(INCOME_DATA, periodo); toast.success("Estado de Resultados exportado"); }, onPrint: () => printIncomeStatement(INCOME_DATA, periodo) };
    case "ret-fuente":
    case "ret-iva":    return { onView: () => printAllRetentions(RETENCIONES_SAMPLE), onDownload: () => { downloadRetentionsCSV(RETENCIONES_SAMPLE); toast.success("Retenciones exportadas"); }, onPrint: () => printAllRetentions(RETENCIONES_SAMPLE) };
    case "diario":     return { onView: () => printJournal(JOURNAL_SAMPLE), onDownload: () => { downloadJournalCSV(JOURNAL_SAMPLE); toast.success("Libro Diario exportado"); }, onPrint: () => printJournal(JOURNAL_SAMPLE) };
    default:
      return {
        onView:     () => printFinancialReport(id, "Reporte", periodo),
        onDownload: () => { downloadCSV([["Reporte", "Período", "Generado"], [id, periodo, new Date().toISOString().slice(0,10)]], `reporte-${id}.csv`); toast.success("Reporte exportado"); },
        onPrint:    () => printFinancialReport(id, "Reporte", periodo),
      };
  }
}

export function FinancialReportsContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const card = `rounded-xl ${isLight ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`;
  const tipoColors: Record<string, string> = {
    "Estado Financiero": isLight ? "bg-blue-50 text-blue-700 border border-blue-200"      : "bg-blue-500/10 text-blue-400",
    "Libro Contable":    isLight ? "bg-purple-50 text-purple-700 border border-purple-200" : "bg-purple-500/10 text-purple-400",
    "Tributario":        isLight ? "bg-green-50 text-green-700 border border-green-200"    : "bg-green-500/10 text-green-400",
  };

  return (
    <div className="space-y-6">
      {/* Listado de reportes disponibles */}
      <div className={`${card} overflow-hidden`}>
        <div className={`px-5 py-4 border-b flex items-center justify-between ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/[0.03] border-white/10"}`}>
          <h3 className={`font-semibold ${isLight ? "text-gray-700" : "text-gray-200"}`}>Reportes Disponibles — Marzo 2026</h3>
          <button
            onClick={() => {
              downloadCSV(
                [["Reporte","Tipo","Período","Generado"], ...REPORTES.map(r => [r.nombre, r.tipo, r.periodo, r.generado])],
                "reportes-disponibles.csv"
              );
              toast.success("Lista de reportes exportada");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-white" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
            <Download className="w-4 h-4" /> Exportar Lista
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${isLight ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0D1B2A] border-white/10 text-gray-400"}`}>
              <th className="px-4 py-3 text-left">Reporte</th>
              <th className="px-4 py-3 text-center">Tipo</th>
              <th className="px-4 py-3 text-center">Período</th>
              <th className="px-4 py-3 text-center">Generado</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {REPORTES.map(r => {
              const actions = getReportActions(r.id, isLight, r.periodo);
              return (
                <tr key={r.id} className={`border-b transition-colors ${isLight ? "hover:bg-gray-50 border-gray-100" : "hover:bg-white/[0.04] border-white/5"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isLight ? "bg-primary/10 text-primary" : "bg-primary/20 text-primary"}`}>
                        {r.icono}
                      </div>
                      <span className={`text-sm font-medium ${isLight ? "text-gray-800" : "text-gray-200"}`}>{r.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${tipoColors[r.tipo] || "bg-gray-500/20 text-gray-400"}`}>
                      {r.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>{r.periodo}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-sm ${isLight ? "text-gray-500" : "text-gray-500"}`}>{r.generado}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={actions.onView} title="Vista previa / Imprimir"
                        className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-primary hover:bg-primary/10" : "hover:text-primary hover:bg-primary/10"}`}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={actions.onDownload} title="Descargar CSV"
                        className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}>
                        <Download className="w-4 h-4" />
                      </button>
                      <button onClick={actions.onPrint} title="Imprimir / PDF"
                        className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}>
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}