import { useState } from "react";
import { Download, Printer, TrendingUp, TrendingDown, BarChart2, PieChart as PieIcon, FileText, Calendar, Eye, X } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell,
} from "recharts";

const MONTHS_DATA = [
  { mes: "Oct", ingresos: 82000, gastos: 61000, utilidad: 21000 },
  { mes: "Nov", ingresos: 95000, gastos: 68000, utilidad: 27000 },
  { mes: "Dic", ingresos: 128000, gastos: 84000, utilidad: 44000 },
  { mes: "Ene", ingresos: 108700, gastos: 72690, utilidad: 36010 },
  { mes: "Feb", ingresos: 124800, gastos: 81980, utilidad: 42820 },
  { mes: "Mar", ingresos: 145500, gastos: 95500, utilidad: 50000 },
];

const GASTOS_PIE = [
  { name: "Sueldos", value: 12400, color: "#E8692E" },
  { name: "Costo Ventas", value: 72400, color: "#3b82f6" },
  { name: "Beneficios", value: 2480, color: "#a855f7" },
  { name: "Arriendos", value: 1800, color: "#22c55e" },
  { name: "Depreciaciones", value: 850, color: "#f59e0b" },
  { name: "Otros", value: 5570, color: "#6b7280" },
];

const REPORTES = [
  { id: "balance", nombre: "Balance General", icono: <BarChart2 className="w-5 h-5" />, tipo: "Estado Financiero", periodo: "Mar 2026" },
  { id: "resultados", nombre: "Estado de Resultados", icono: <TrendingUp className="w-5 h-5" />, tipo: "Estado Financiero", periodo: "Mar 2026" },
  { id: "flujo", nombre: "Flujo de Efectivo", icono: <PieIcon className="w-5 h-5" />, tipo: "Estado Financiero", periodo: "Mar 2026" },
  { id: "mayores", nombre: "Libro Mayor", icono: <FileText className="w-5 h-5" />, tipo: "Libro Contable", periodo: "Mar 2026" },
  { id: "diario", nombre: "Libro Diario", icono: <Calendar className="w-5 h-5" />, tipo: "Libro Contable", periodo: "Mar 2026" },
  { id: "ats", nombre: "ATS", icono: <FileText className="w-5 h-5" />, tipo: "Tributario", periodo: "Mar 2026" },
];

const fmt = (v: number) => `$${v.toLocaleString("es-EC", { minimumFractionDigits: 0 })}`;

export function FinancialReportsContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const totalIngresos = MONTHS_DATA[MONTHS_DATA.length - 1].ingresos;
  const totalGastos = MONTHS_DATA[MONTHS_DATA.length - 1].gastos;
  const utilidadMes = MONTHS_DATA[MONTHS_DATA.length - 1].utilidad;
  const margenNeto = ((utilidadMes / totalIngresos) * 100).toFixed(1);

  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const card = `rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;

  const exportCSV = () => { toast.success("Reporte exportado a CSV"); };
  const print = () => { toast.success("Imprimiendo reporte"); };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h2 className={`text-lg font-bold ${txt}`}>Reportes Financieros</h2>
          <p className={`text-xs mt-0.5 ${sub}`}>Análisis y reportes del período Marzo 2026</p>
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

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-3">
        <div className={`p-3 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`}>
          <div className="flex items-center justify-between">
            <p className={`text-xs ${sub}`}>Ingresos</p>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <p className={`text-xl font-bold ${txt} mt-1`}>{fmt(totalIngresos)}</p>
          <p className="text-xs text-green-600 mt-0.5">+16.5% vs mes anterior</p>
        </div>
        <div className={`p-3 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`}>
          <div className="flex items-center justify-between">
            <p className={`text-xs ${sub}`}>Gastos</p>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <p className={`text-xl font-bold ${txt} mt-1`}>{fmt(totalGastos)}</p>
          <p className="text-xs text-red-600 mt-0.5">+16.5% vs mes anterior</p>
        </div>
        <div className={`p-3 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`}>
          <div className="flex items-center justify-between">
            <p className={`text-xs ${sub}`}>Utilidad</p>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <p className={`text-xl font-bold text-primary mt-1`}>{fmt(utilidadMes)}</p>
          <p className="text-xs text-green-600 mt-0.5">+16.8% vs mes anterior</p>
        </div>
        <div className={`p-3 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`}>
          <div className="flex items-center justify-between">
            <p className={`text-xs ${sub}`}>Margen Neto</p>
            <BarChart2 className="w-4 h-4 text-blue-500" />
          </div>
          <p className={`text-xl font-bold ${txt} mt-1`}>{margenNeto}%</p>
          <p className="text-xs text-green-600 mt-0.5">+0.2% vs mes anterior</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-2 gap-4">
        {/* Ingresos vs Gastos */}
        <div className={card}>
          <div className={`px-4 py-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <h3 className={`text-sm font-semibold ${txt}`}>Ingresos vs Gastos</h3>
            <p className={`text-xs ${sub} mt-0.5`}>Últimos 6 meses</p>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={MONTHS_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke={isLight ? "#e5e7eb" : "#374151"} />
                <XAxis dataKey="mes" tick={{ fill: isLight ? "#6b7280" : "#9ca3af", fontSize: 12 }} />
                <YAxis tick={{ fill: isLight ? "#6b7280" : "#9ca3af", fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isLight ? "#fff" : "#1f2937",
                    border: `1px solid ${isLight ? "#e5e7eb" : "#374151"}`,
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                  labelStyle={{ color: isLight ? "#111827" : "#f9fafb" }}
                  itemStyle={{ color: isLight ? "#6b7280" : "#d1d5db" }}
                />
                <Bar dataKey="ingresos" fill="#22c55e" radius={[4, 4, 0, 0]} name="Ingresos" />
                <Bar dataKey="gastos" fill="#ef4444" radius={[4, 4, 0, 0]} name="Gastos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribución de Gastos */}
        <div className={card}>
          <div className={`px-4 py-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <h3 className={`text-sm font-semibold ${txt}`}>Distribución de Gastos</h3>
            <p className={`text-xs ${sub} mt-0.5`}>Marzo 2026</p>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={240}>
              <RechartsPieChart>
                <Pie 
                  data={GASTOS_PIE} 
                  cx="50%" 
                  cy="50%" 
                  labelLine={false} 
                  outerRadius={90} 
                  fill="#8884d8" 
                  dataKey="value"
                  nameKey="name"
                >
                  {GASTOS_PIE.map((entry, index) => (
                    <Cell key={`cell-gastos-${index}-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isLight ? "#fff" : "#1f2937",
                    border: `1px solid ${isLight ? "#e5e7eb" : "#374151"}`,
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {GASTOS_PIE.map((item, idx) => (
                <div key={`legend-${idx}-${item.name}`} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className={`text-xs ${txt}`}>{item.name}</span>
                  <span className={`text-xs ${sub} ml-auto`}>{fmt(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Reportes */}
      <div>
        <h3 className={`text-sm font-semibold ${txt} mb-3`}>Reportes Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {REPORTES.map(reporte => (
            <div key={reporte.id} className={`${card} p-4 hover:shadow-md transition-shadow cursor-pointer`} onClick={() => setSelectedReport(reporte.id)}>
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${isLight ? "bg-primary/10" : "bg-primary/20"}`}>
                  <div className="text-primary">{reporte.icono}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold ${txt} truncate`}>{reporte.nombre}</h4>
                  <p className={`text-xs ${sub} mt-0.5`}>{reporte.tipo}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs ${sub}`}>{reporte.periodo}</span>
                    <button className={`flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors`}>
                      <Eye className="w-3.5 h-3.5" />
                      Ver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Preview (simple) */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-lg shadow-xl border ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <h3 className={`font-bold text-base ${txt}`}>
                {REPORTES.find(r => r.id === selectedReport)?.nombre}
              </h3>
              <button onClick={() => setSelectedReport(null)} className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5 ${sub}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <p className={`text-sm ${sub} text-center`}>Aquí se mostraría la vista previa del reporte seleccionado</p>
              <div className="flex gap-2 mt-4">
                <button onClick={exportCSV} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
                  <Download className="w-4 h-4" />
                  Exportar
                </button>
                <button onClick={print} className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors`}>
                  <Printer className="w-4 h-4" />
                  Imprimir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}