import { useState } from "react";
import { Download, Printer, ChevronDown, Filter } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { printIncomeStatement, downloadIncomeStatementCSV } from "../utils/print-download";
import { MonthPicker } from "./month-picker";
import { YearPicker } from "./year-picker";

const ESTADO_RESULTADOS = {
  periodo: "Enero - Marzo 2026",
  ingresos: {
    operacionales: [
      { nombre: "Ventas Locales", valor: 245600.00 },
      { nombre: "Ventas Exportación", valor: 128400.00 },
      { nombre: "Servicios Prestados", valor: 45200.00 },
    ],
    noOperacionales: [
      { nombre: "Intereses Ganados", valor: 1850.00 },
      { nombre: "Otros Ingresos", valor: 2340.00 },
    ]
  },
  costosVentas: [
    { nombre: "Costo de Mercadería Vendida", valor: 156800.00 },
    { nombre: "Costo de Servicios", valor: 18500.00 },
  ],
  gastosOperacionales: {
    administrativos: [
      { nombre: "Sueldos Administrativos", valor: 48000.00 },
      { nombre: "Servicios Básicos", valor: 3200.00 },
      { nombre: "Arriendos", valor: 6000.00 },
      { nombre: "Depreciación", valor: 4500.00 },
    ],
    ventas: [
      { nombre: "Sueldos Ventas", valor: 32000.00 },
      { nombre: "Publicidad", valor: 8500.00 },
      { nombre: "Transporte", valor: 4200.00 },
      { nombre: "Comisiones", valor: 12300.00 },
    ]
  },
  gastosFinancieros: [
    { nombre: "Intereses Bancarios", valor: 3400.00 },
    { nombre: "Comisiones Bancarias", valor: 850.00 },
  ]
};

const fmt = (v: number) => `$${v.toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function IncomeStatementContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [expanded, setExpanded] = useState({ 
    ingOp: true, ingNoOp: true, costos: true, gastAdm: true, gastVent: true, gastFin: true 
  });
  const [tipoPeriodo, setTipoPeriodo] = useState<"mensual" | "anual">("mensual");
  const [fechaDesde, setFechaDesde] = useState("2026-03-01");
  const [fechaHasta, setFechaHasta] = useState("2026-03-07");
  
  const toggle = (key: keyof typeof expanded) => setExpanded(p => ({ ...p, [key]: !p[key] }));

  // Formatear el período seleccionado
  const formatPeriodo = () => {
    if (!fechaHasta) return "Sin período seleccionado";
    const desde = new Date(fechaDesde);
    const hasta = new Date(fechaHasta);
    
    if (tipoPeriodo === "mensual") {
      const opciones: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      const desdeStr = desde.toLocaleDateString('es-EC', opciones);
      const hastaStr = hasta.toLocaleDateString('es-EC', opciones);
      
      // Si es el mismo mes
      if (desde.getMonth() === hasta.getMonth() && desde.getFullYear() === hasta.getFullYear()) {
        const mes = hasta.toLocaleDateString('es-EC', { month: 'long', year: 'numeric' });
        return `Del ${desde.getDate()} al ${hasta.getDate()} de ${mes.charAt(0).toUpperCase() + mes.slice(1)}`;
      }
      
      return `Del ${desdeStr} al ${hastaStr}`;
    } else {
      // Anual
      const year = hasta.getFullYear();
      const today = new Date();
      const isCurrentYear = year === today.getFullYear();
      const isUpToToday = hasta.toDateString() === today.toDateString() || 
                         (hasta.getMonth() === today.getMonth() && hasta.getDate() === today.getDate());
      
      if (isCurrentYear && isUpToToday) {
        const fecha = hasta.toLocaleDateString('es-EC', { day: 'numeric', month: 'long', year: 'numeric' });
        return `1 de Enero al ${fecha}`;
      }
      
      return `Año ${year} (1 de Enero al 31 de Diciembre)`;
    }
  };

  const totalIngOp = ESTADO_RESULTADOS.ingresos.operacionales.reduce((s, i) => s + i.valor, 0);
  const totalIngNoOp = ESTADO_RESULTADOS.ingresos.noOperacionales.reduce((s, i) => s + i.valor, 0);
  const totalIngresos = totalIngOp + totalIngNoOp;

  const totalCostos = ESTADO_RESULTADOS.costosVentas.reduce((s, i) => s + i.valor, 0);
  const utilidadBruta = totalIngOp - totalCostos;

  const totalGastAdm = ESTADO_RESULTADOS.gastosOperacionales.administrativos.reduce((s, i) => s + i.valor, 0);
  const totalGastVent = ESTADO_RESULTADOS.gastosOperacionales.ventas.reduce((s, i) => s + i.valor, 0);
  const totalGastOp = totalGastAdm + totalGastVent;

  const utilidadOperacional = utilidadBruta - totalGastOp;

  const totalGastFin = ESTADO_RESULTADOS.gastosFinancieros.reduce((s, i) => s + i.valor, 0);
  
  const utilidadAntesImp = utilidadOperacional + totalIngNoOp - totalGastFin;
  const impuestos = utilidadAntesImp * 0.25; // 25%
  const utilidadNeta = utilidadAntesImp - impuestos;

  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const card = `rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;
  const inp = `px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h2 className={`text-lg font-bold ${txt}`}>Estado de Resultados</h2>
          <p className={`text-xs mt-0.5 ${sub}`}>{formatPeriodo()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => downloadIncomeStatementCSV(ESTADO_RESULTADOS)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button onClick={() => printIncomeStatement(ESTADO_RESULTADOS)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
        </div>
      </div>

      {/* Filtros de Período */}
      <div className="flex items-center gap-3">
        {/* Selector de Tipo de Período */}
        <div className="relative w-40">
          <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub} pointer-events-none`} />
          <select 
            value={tipoPeriodo} 
            onChange={(e) => setTipoPeriodo(e.target.value as "mensual" | "anual")}
            className={`${inp} w-full pl-9 pr-3 appearance-none cursor-pointer`}
          >
            <option value="mensual">Mensual</option>
            <option value="anual">Anual</option>
          </select>
        </div>

        {/* Selector de Fecha según el Tipo */}
        <div className="flex-1 max-w-xs">
          {tipoPeriodo === "mensual" ? (
            <MonthPicker 
              dateFrom={fechaDesde} 
              dateTo={fechaHasta} 
              onDateFromChange={setFechaDesde} 
              onDateToChange={setFechaHasta} 
            />
          ) : (
            <YearPicker 
              dateFrom={fechaDesde} 
              dateTo={fechaHasta} 
              onDateFromChange={setFechaDesde} 
              onDateToChange={setFechaHasta} 
            />
          )}
        </div>
      </div>

      {/* Estado de Resultados */}
      <div className={card}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${isLight ? "bg-gray-50/50 border-b border-gray-200" : "bg-white/[0.02] border-b border-white/5"}`}>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>Concepto</th>
                <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${sub}`}>Valor</th>
              </tr>
            </thead>
            <tbody className={isLight ? "bg-white" : ""}>
              {/* INGRESOS OPERACIONALES */}
              <tr className={`border-b cursor-pointer ${isLight ? "border-gray-100 bg-green-50 hover:bg-green-100" : "border-white/5 bg-green-500/10 hover:bg-green-500/15"} transition-colors`} onClick={() => toggle("ingOp")}>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <ChevronDown className={`w-3.5 h-3.5 ${sub} transition-transform ${expanded.ingOp ? "" : "-rotate-90"}`} />
                    <span className={`text-sm font-bold ${txt}`}>INGRESOS OPERACIONALES</span>
                  </div>
                </td>
                <td className={`px-4 py-2 text-right text-sm font-bold ${txt}`}>{fmt(totalIngOp)}</td>
              </tr>
              {expanded.ingOp && ESTADO_RESULTADOS.ingresos.operacionales.map((item, idx) => (
                <tr key={idx} className={`border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
                  <td className={`px-4 py-2 pl-12 text-sm ${txt}`}>{item.nombre}</td>
                  <td className={`px-4 py-2 text-right text-sm font-mono ${txt}`}>{fmt(item.valor)}</td>
                </tr>
              ))}

              {/* COSTOS DE VENTAS */}
              <tr className={`border-b cursor-pointer ${isLight ? "border-gray-100 bg-red-50 hover:bg-red-100" : "border-white/5 bg-red-500/10 hover:bg-red-500/15"} transition-colors`} onClick={() => toggle("costos")}>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <ChevronDown className={`w-3.5 h-3.5 ${sub} transition-transform ${expanded.costos ? "" : "-rotate-90"}`} />
                    <span className={`text-sm font-bold ${txt}`}>(-) COSTOS DE VENTAS</span>
                  </div>
                </td>
                <td className={`px-4 py-2 text-right text-sm font-bold ${txt}`}>({fmt(totalCostos)})</td>
              </tr>
              {expanded.costos && ESTADO_RESULTADOS.costosVentas.map((item, idx) => (
                <tr key={idx} className={`border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
                  <td className={`px-4 py-2 pl-12 text-sm ${txt}`}>{item.nombre}</td>
                  <td className={`px-4 py-2 text-right text-sm font-mono ${txt}`}>({fmt(item.valor)})</td>
                </tr>
              ))}

              {/* UTILIDAD BRUTA */}
              <tr className={`border-b ${isLight ? "border-gray-200 bg-blue-50" : "border-white/10 bg-blue-500/10"}`}>
                <td className={`px-4 py-2.5 text-sm font-bold ${txt}`}>UTILIDAD BRUTA</td>
                <td className={`px-4 py-2.5 text-right text-sm font-bold text-primary`}>{fmt(utilidadBruta)}</td>
              </tr>

              {/* GASTOS ADMINISTRATIVOS */}
              <tr className={`border-b cursor-pointer ${isLight ? "border-gray-100 hover:bg-gray-50" : "border-white/5 hover:bg-white/[0.02]"} transition-colors`} onClick={() => toggle("gastAdm")}>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <ChevronDown className={`w-3.5 h-3.5 ${sub} transition-transform ${expanded.gastAdm ? "" : "-rotate-90"}`} />
                    <span className={`text-sm font-semibold ${txt}`}>(-) Gastos Administrativos</span>
                  </div>
                </td>
                <td className={`px-4 py-2 text-right text-sm font-semibold ${txt}`}>({fmt(totalGastAdm)})</td>
              </tr>
              {expanded.gastAdm && ESTADO_RESULTADOS.gastosOperacionales.administrativos.map((item, idx) => (
                <tr key={idx} className={`border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
                  <td className={`px-4 py-2 pl-12 text-sm ${txt}`}>{item.nombre}</td>
                  <td className={`px-4 py-2 text-right text-sm font-mono ${txt}`}>({fmt(item.valor)})</td>
                </tr>
              ))}

              {/* GASTOS DE VENTAS */}
              <tr className={`border-b cursor-pointer ${isLight ? "border-gray-100 hover:bg-gray-50" : "border-white/5 hover:bg-white/[0.02]"} transition-colors`} onClick={() => toggle("gastVent")}>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <ChevronDown className={`w-3.5 h-3.5 ${sub} transition-transform ${expanded.gastVent ? "" : "-rotate-90"}`} />
                    <span className={`text-sm font-semibold ${txt}`}>(-) Gastos de Ventas</span>
                  </div>
                </td>
                <td className={`px-4 py-2 text-right text-sm font-semibold ${txt}`}>({fmt(totalGastVent)})</td>
              </tr>
              {expanded.gastVent && ESTADO_RESULTADOS.gastosOperacionales.ventas.map((item, idx) => (
                <tr key={idx} className={`border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
                  <td className={`px-4 py-2 pl-12 text-sm ${txt}`}>{item.nombre}</td>
                  <td className={`px-4 py-2 text-right text-sm font-mono ${txt}`}>({fmt(item.valor)})</td>
                </tr>
              ))}

              {/* UTILIDAD OPERACIONAL */}
              <tr className={`border-b ${isLight ? "border-gray-200 bg-purple-50" : "border-white/10 bg-purple-500/10"}`}>
                <td className={`px-4 py-2.5 text-sm font-bold ${txt}`}>UTILIDAD OPERACIONAL</td>
                <td className={`px-4 py-2.5 text-right text-sm font-bold text-primary`}>{fmt(utilidadOperacional)}</td>
              </tr>

              {/* INGRESOS NO OPERACIONALES */}
              <tr className={`border-b cursor-pointer ${isLight ? "border-gray-100 hover:bg-gray-50" : "border-white/5 hover:bg-white/[0.02]"} transition-colors`} onClick={() => toggle("ingNoOp")}>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <ChevronDown className={`w-3.5 h-3.5 ${sub} transition-transform ${expanded.ingNoOp ? "" : "-rotate-90"}`} />
                    <span className={`text-sm font-semibold ${txt}`}>(+) Ingresos No Operacionales</span>
                  </div>
                </td>
                <td className={`px-4 py-2 text-right text-sm font-semibold ${txt}`}>{fmt(totalIngNoOp)}</td>
              </tr>
              {expanded.ingNoOp && ESTADO_RESULTADOS.ingresos.noOperacionales.map((item, idx) => (
                <tr key={idx} className={`border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
                  <td className={`px-4 py-2 pl-12 text-sm ${txt}`}>{item.nombre}</td>
                  <td className={`px-4 py-2 text-right text-sm font-mono ${txt}`}>{fmt(item.valor)}</td>
                </tr>
              ))}

              {/* GASTOS FINANCIEROS */}
              <tr className={`border-b cursor-pointer ${isLight ? "border-gray-100 hover:bg-gray-50" : "border-white/5 hover:bg-white/[0.02]"} transition-colors`} onClick={() => toggle("gastFin")}>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <ChevronDown className={`w-3.5 h-3.5 ${sub} transition-transform ${expanded.gastFin ? "" : "-rotate-90"}`} />
                    <span className={`text-sm font-semibold ${txt}`}>(-) Gastos Financieros</span>
                  </div>
                </td>
                <td className={`px-4 py-2 text-right text-sm font-semibold ${txt}`}>({fmt(totalGastFin)})</td>
              </tr>
              {expanded.gastFin && ESTADO_RESULTADOS.gastosFinancieros.map((item, idx) => (
                <tr key={idx} className={`border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
                  <td className={`px-4 py-2 pl-12 text-sm ${txt}`}>{item.nombre}</td>
                  <td className={`px-4 py-2 text-right text-sm font-mono ${txt}`}>({fmt(item.valor)})</td>
                </tr>
              ))}

              {/* UTILIDAD ANTES DE IMPUESTOS */}
              <tr className={`border-b ${isLight ? "border-gray-200 bg-yellow-50" : "border-white/10 bg-yellow-500/10"}`}>
                <td className={`px-4 py-2.5 text-sm font-bold ${txt}`}>UTILIDAD ANTES DE IMPUESTOS</td>
                <td className={`px-4 py-2.5 text-right text-sm font-bold ${txt}`}>{fmt(utilidadAntesImp)}</td>
              </tr>

              {/* IMPUESTOS */}
              <tr className={`border-b ${isLight ? "border-gray-100" : "border-white/5"}`}>
                <td className={`px-4 py-2 pl-8 text-sm ${txt}`}>(-) Impuesto a la Renta (25%)</td>
                <td className={`px-4 py-2 text-right text-sm font-mono ${txt}`}>({fmt(impuestos)})</td>
              </tr>

              {/* UTILIDAD NETA */}
              <tr className={`border-t-2 ${isLight ? "border-gray-300 bg-green-100" : "border-white/20 bg-green-500/10"}`}>
                <td className={`px-4 py-3 text-sm font-bold ${txt}`}>UTILIDAD NETA DEL EJERCICIO</td>
                <td className={`px-4 py-3 text-right text-base font-bold ${utilidadNeta >= 0 ? "text-green-600" : "text-red-600"}`}>{fmt(utilidadNeta)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-4 gap-3">
        <div className={`p-3 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`}>
          <p className={`text-xs ${sub}`}>Margen Bruto</p>
          <p className={`text-lg font-bold ${txt}`}>{((utilidadBruta / totalIngOp) * 100).toFixed(1)}%</p>
        </div>
        <div className={`p-3 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`}>
          <p className={`text-xs ${sub}`}>Margen Operacional</p>
          <p className={`text-lg font-bold ${txt}`}>{((utilidadOperacional / totalIngOp) * 100).toFixed(1)}%</p>
        </div>
        <div className={`p-3 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`}>
          <p className={`text-xs ${sub}`}>Margen Neto</p>
          <p className={`text-lg font-bold ${txt}`}>{((utilidadNeta / totalIngresos) * 100).toFixed(1)}%</p>
        </div>
        <div className={`p-3 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`}>
          <p className={`text-xs ${sub}`}>ROI Trimestral</p>
          <p className={`text-lg font-bold text-primary`}>{((utilidadNeta / totalIngresos) * 100).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
}