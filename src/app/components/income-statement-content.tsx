import { useState } from "react";
import { TrendingUp, TrendingDown, DollarSign, Percent, Download, Printer, BarChart2 } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { printIncomeStatement, downloadIncomeStatementCSV } from "../utils/print-download";
import { toast } from "sonner";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AccountingKpiCard } from "./ui/accounting-kpi-card";

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

const CHART_DATA = [
  { id: "ene-2026", mes: "Ene", ingresos: 108700, costos: 57000, utilidad: 36010 },
  { id: "feb-2026", mes: "Feb", ingresos: 124800, costos: 65900, utilidad: 42820 },
  { id: "mar-2026", mes: "Mar", ingresos: 145500, costos: 79200, utilidad: 50000 },
];

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

  const card = `rounded-xl ${isLight ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`;

  const section = (
    titulo: string,
    items: { nombre: string; valor: number }[],
    total: number,
    colorHdr: string,
    colorTotal: string
  ) => (
    <div className={`${card} overflow-hidden`}>
      <div className={`px-5 py-3 border-b ${colorHdr}`}>
        <div className="flex items-center justify-between">
          <span className="font-semibold text-sm">{titulo}</span>
          <span className="font-bold font-mono text-sm">{fmt(total)}</span>
        </div>
      </div>
      {items.map(item => (
        <div key={item.nombre} className={`flex items-center justify-between px-5 py-2.5 border-b transition-colors ${isLight ? "border-gray-50 hover:bg-gray-50" : "border-white/[0.04] hover:bg-white/[0.02]"}`}>
          <div className="flex items-center gap-2 pl-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary/40 flex-shrink-0" />
            <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>{item.nombre}</span>
          </div>
          <span className={`text-sm font-mono ${item.valor < 0 ? "text-red-400" : isLight ? "text-gray-800" : "text-gray-200"}`}>
            {item.valor < 0 ? `(${fmt(Math.abs(item.valor))})` : fmt(item.valor)}
          </span>
        </div>
      ))}
      <div className={`flex items-center justify-between px-5 py-3 ${colorTotal}`}>
        <span className="text-sm font-bold">Total {titulo}</span>
        <span className="text-sm font-bold font-mono">{fmt(total)}</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Ingresos Totales", value: fmt(totalIngresos), icon: <TrendingUp className="w-5 h-5 text-green-400" />, iconBg: "bg-green-500/20" },
          { label: "Utilidad Bruta",   value: fmt(utilidadBruta), icon: <BarChart2 className="w-5 h-5 text-blue-400" />,  iconBg: "bg-blue-500/20"  },
          { label: "Utilidad Neta",    value: fmt(utilidadNeta),  icon: <DollarSign className="w-5 h-5 text-primary" />,  iconBg: "bg-primary/20"   },
          { label: "Margen Neto",      value: `${margenNeto.toFixed(1)}%`, icon: <TrendingDown className="w-5 h-5 text-purple-400" />, iconBg: "bg-purple-500/20" },
        ].map(m => (
          <AccountingKpiCard key={m.label} label={m.label} value={m.value} icon={m.icon} iconBg={m.iconBg} />
        ))}
      </div>

      <div className={`border-t ${isLight ? "border-gray-200" : "border-white/10"}`} />

      {/* Selector de período + acciones */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>Período:</span>
          <div className="flex gap-1">
            {PERIODOS.map(p => (
              <button key={p} onClick={() => setPeriodo(p)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${periodo === p ? "bg-primary text-white" : isLight ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-white/5 text-gray-400 hover:bg-white/10"}`}>
                {p.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              downloadIncomeStatementCSV({
                ingresos: data.ingresos, costos: data.costos, gastos: data.gastos,
                totalIngresos, totalCostos, utilidadBruta, totalGastos,
                utilidadOper, utilidadNeta, margenNeto,
              }, periodo);
              toast.success("Estado de resultados exportado");
            }}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
            <Download className="w-4 h-4" /> Exportar CSV
          </button>
          <button
            onClick={() => printIncomeStatement({
              ingresos: data.ingresos, costos: data.costos, gastos: data.gastos,
              totalIngresos, totalCostos, utilidadBruta, totalGastos,
              utilidadOper, utilidadNeta, margenNeto,
            }, periodo)}
            className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-lg shadow-primary/20">
            <Printer className="w-4 h-4" /> Imprimir / PDF
          </button>
        </div>
      </div>

      {/* Gráfico de tendencia */}
      <div className={`rounded-xl p-5 ${isLight ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`}>
        <h3 className={`font-semibold mb-4 text-sm ${isLight ? "text-gray-700" : "text-gray-200"}`}>Tendencia Trimestral</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart id="income-chart" data={CHART_DATA} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "#f0f0f0" : "#ffffff10"} />
            <XAxis dataKey="mes" tick={{ fill: isLight ? "#6b7280" : "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: isLight ? "#6b7280" : "#9ca3af", fontSize: 11 }} axisLine={false} tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              formatter={(v: any, name: string) => [fmt(v), name === "Ingresos" ? "Ingresos" : name === "Costos" ? "Costos" : "Utilidad"]}
              contentStyle={{ background: isLight ? "#fff" : "#0D1B2A", border: `1px solid ${isLight ? "#e5e7eb" : "#ffffff15"}`, borderRadius: "8px" }}
              labelStyle={{ color: isLight ? "#111" : "#fff", fontWeight: 600 }}
            />
            <Legend formatter={(v) => v === "Ingresos" ? "Ingresos" : v === "Costos" ? "Costos" : "Utilidad"} />
            <Bar key="bar-ingresos" name="Ingresos" dataKey="ingresos" fill="#22c55e" radius={[4,4,0,0]} />
            <Bar key="bar-costos" name="Costos"   dataKey="costos"   fill="#ef4444" radius={[4,4,0,0]} />
            <Bar key="bar-utilidad" name="Utilidad" dataKey="utilidad" fill="#E8692E" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Estado de Resultados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {section("Ingresos Operacionales", data.ingresos, totalIngresos,
          isLight ? "bg-green-50 border-green-100 text-green-800" : "bg-green-500/10 border-green-500/20 text-green-300",
          isLight ? "bg-green-50 text-green-800" : "bg-green-500/10 text-green-300")}
        {section("Costos de Ventas", data.costos, totalCostos,
          isLight ? "bg-red-50 border-red-100 text-red-800" : "bg-red-500/10 border-red-500/20 text-red-300",
          isLight ? "bg-red-50 text-red-800" : "bg-red-500/10 text-red-300")}
      </div>

      {/* Utilidad Bruta */}
      <div className={`rounded-xl px-5 py-4 flex items-center justify-between ${isLight ? "bg-blue-50 border border-blue-200" : "bg-blue-500/10 border border-blue-500/20"}`}>
        <div>
          <p className={`text-sm font-semibold ${isLight ? "text-blue-700" : "text-blue-300"}`}>UTILIDAD BRUTA</p>
          <p className={`text-xs ${isLight ? "text-blue-500" : "text-blue-400"}`}>Margen Bruto: {margenBruto.toFixed(1)}%</p>
        </div>
        <span className={`font-bold font-mono text-xl ${isLight ? "text-blue-700" : "text-blue-300"}`}>{fmt(utilidadBruta)}</span>
      </div>

      {/* Gastos */}
      {section("Gastos Operacionales", data.gastos, totalGastos,
        isLight ? "bg-orange-50 border-orange-100 text-orange-800" : "bg-orange-500/10 border-orange-500/20 text-orange-300",
        isLight ? "bg-orange-50 text-orange-800" : "bg-orange-500/10 text-orange-300")}

      {/* Utilidad Operacional */}
      <div className={`rounded-xl px-5 py-4 flex items-center justify-between ${isLight ? "bg-purple-50 border border-purple-200" : "bg-purple-500/10 border border-purple-500/20"}`}>
        <span className={`text-sm font-semibold ${isLight ? "text-purple-700" : "text-purple-300"}`}>UTILIDAD OPERACIONAL</span>
        <span className={`font-bold font-mono text-xl ${isLight ? "text-purple-700" : "text-purple-300"}`}>{fmt(utilidadOper)}</span>
      </div>

      {/* Impuesto y Utilidad Neta */}
      <div className={`rounded-xl overflow-hidden ${isLight ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`}>
        {[
          { label: "(-) Participación Trabajadores 15%", valor: utilidadOper * 0.15 },
          { label: "(-) Impuesto a la Renta 25%", valor: impuesto },
        ].map(r => (
          <div key={r.label} className={`flex items-center justify-between px-5 py-3 border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
            <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>{r.label}</span>
            <span className={`text-sm font-mono text-red-400`}>({fmt(r.valor)})</span>
          </div>
        ))}
        <div className="flex items-center justify-between px-5 py-4 bg-primary/10">
          <div>
            <p className="font-bold text-primary">UTILIDAD NETA DEL PERÍODO</p>
            <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Margen Neto: {margenNeto.toFixed(1)}%</p>
          </div>
          <span className="font-bold font-mono text-2xl text-primary">{fmt(utilidadNeta)}</span>
        </div>
      </div>

      <p className={`text-xs text-center ${isLight ? "text-gray-400" : "text-gray-500"}`}>
        Estado de Resultados — {periodo} • Generado el 04 de marzo, 2026
      </p>
    </div>
  );
}