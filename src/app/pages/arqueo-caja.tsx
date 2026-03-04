import { useState, type ReactNode } from "react";
import {
  Banknote,
  AlertCircle,
  Printer,
  DollarSign,
  CheckCircle,
  XCircle,
  CreditCard,
  Lock,
  ShoppingBag,
  FileText,
  Coins,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "../contexts/theme-context";
import { useCaja } from "../contexts/caja-context";

interface Gasto {
  id: string; fecha: string; hora: string;
  concepto: string; categoria: string; monto: number; responsable: string;
}
interface Transaccion {
  id: string; fecha: string; hora: string;
  cliente: string; factura: string; monto: number; estado: string;
}

export function ArqueoCaja() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { isCajaOpen, montoInicialCaja, closeCaja } = useCaja();
  const isCajaCerrada = !isCajaOpen;

  const rootBg   = isLight ? "bg-gray-50"  : "bg-gradient-to-br from-[#0D1B2A] via-[#1a2332] to-[#0D1B2A]";
  const txt      = isLight ? "text-gray-900" : "text-white";
  const sub      = isLight ? "text-gray-500" : "text-gray-400";
  const card     = isLight ? "bg-white border border-gray-200 shadow-sm" : "bg-white/[0.04] border border-white/10";
  const inp      = isLight
    ? "bg-white border border-gray-300 text-gray-900 placeholder-gray-300 focus:border-primary"
    : "bg-[#0D1B2A]/70 border border-white/15 text-white placeholder-gray-600 focus:border-primary";
  const divider  = isLight ? "border-gray-100"  : "border-white/[0.08]";
  const divider2 = isLight ? "border-gray-200"  : "border-white/[0.12]";
  const theadBg  = isLight ? "bg-gray-50"       : "bg-[#0D1B2A]/50";
  const rowHover = isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.03]";
  const faintBg  = isLight ? "bg-gray-50"       : "bg-white/[0.025]";
  const modalBg  = isLight ? "bg-white border border-gray-200" : "bg-[#0f1d2e] border border-white/10";
  const closeBtn = isLight
    ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
    : "text-gray-500 hover:text-white hover:bg-white/10";

  const [billetes, setBilletes] = useState({ b100: 0, b50: 0, b20: 0, b10: 0, b5: 0, b1: 0 });
  const [monedas,  setMonedas]  = useState({ m1: 0, m050: 0, m025: 0, m010: 0, m005: 0, m001: 0 });
  const [showGastos,       setShowGastos]       = useState(false);
  const [showTarjeta,      setShowTarjeta]      = useState(false);
  const [showTransferencia,setShowTransferencia]= useState(false);

  const montoInicial = montoInicialCaja;

  const gastosDelDia: Gasto[] = [
    { id: "G-001", fecha: "22/02/2026", hora: "09:15", concepto: "Compra de suministros de limpieza", categoria: "Suministros", monto: 15.50, responsable: "Juan Pérez" },
    { id: "G-002", fecha: "22/02/2026", hora: "11:30", concepto: "Pago de servicio de internet",       categoria: "Servicios",   monto: 25.00, responsable: "Juan Pérez" },
    { id: "G-003", fecha: "22/02/2026", hora: "14:45", concepto: "Compra de tinta para impresora",     categoria: "Suministros", monto: 5.00,  responsable: "Juan Pérez" },
  ];
  const totalGastos = gastosDelDia.reduce((s, g) => s + g.monto, 0);

  const transaccionesTarjeta: Transaccion[] = [
    { id: "TRX-001", fecha: "22/02/2026", hora: "10:25", cliente: "María González", factura: "FAC-001-001456", monto: 450.00, estado: "Aprobada" },
    { id: "TRX-002", fecha: "22/02/2026", hora: "12:10", cliente: "Carlos Ruiz",    factura: "FAC-001-001457", monto: 789.50, estado: "Aprobada" },
    { id: "TRX-003", fecha: "22/02/2026", hora: "14:35", cliente: "Ana Martínez",   factura: "FAC-001-001458", monto: 325.25, estado: "Aprobada" },
    { id: "TRX-004", fecha: "22/02/2026", hora: "16:20", cliente: "Pedro Sánchez",  factura: "FAC-001-001459", monto: 781.00, estado: "Aprobada" },
  ];
  const transaccionesTransferencia: Transaccion[] = [
    { id: "TRF-001", fecha: "22/02/2026", hora: "09:45", cliente: "Empresa ABC S.A.",  factura: "FAC-001-001454", monto: 560.75, estado: "Confirmada" },
    { id: "TRF-002", fecha: "22/02/2026", hora: "13:20", cliente: "Distribuidora XYZ", factura: "FAC-001-001460", monto: 329.50, estado: "Confirmada" },
  ];

  const totalTarjeta        = transaccionesTarjeta.reduce((s, t) => s + t.monto, 0);
  const totalTransferencias = transaccionesTransferencia.reduce((s, t) => s + t.monto, 0);
  const ventasEfectivo      = 1234.50;
  const ventasTarjeta       = 2345.75;
  const ventasTransferencia = 890.25;
  const ventasCredito       = 1486.15;
  const totalVentas         = ventasEfectivo + ventasTarjeta + ventasTransferencia + ventasCredito;

  const totalBilletes = billetes.b100*100 + billetes.b50*50 + billetes.b20*20 + billetes.b10*10 + billetes.b5*5 + billetes.b1;
  const totalMonedas  = monedas.m1 + monedas.m050*0.5 + monedas.m025*0.25 + monedas.m010*0.1 + monedas.m005*0.05 + monedas.m001*0.01;
  const totalContado  = totalBilletes + totalMonedas;
  const saldoEsperado = montoInicial + ventasEfectivo - totalGastos;
  const diferencia    = totalContado - saldoEsperado;

  const handleCerrarCaja = () => {
    if (isCajaCerrada) { toast.error("La caja ya está cerrada."); return; }
    closeCaja();
    toast.success("Caja cerrada exitosamente", { description: "El turno ha finalizado correctamente" });
  };

  const ModalWrapper = ({ children, onClose }: { children: ReactNode; onClose: () => void }) => (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl ${modalBg}`}>
        {children}
      </div>
    </div>
  );

  const billeteDefs = [
    { key: "b100" as const, label: "$100", value: 100 },
    { key: "b50"  as const, label: "$50",  value: 50  },
    { key: "b20"  as const, label: "$20",  value: 20  },
    { key: "b10"  as const, label: "$10",  value: 10  },
    { key: "b5"   as const, label: "$5",   value: 5   },
    { key: "b1"   as const, label: "$1",   value: 1   },
  ];
  const monedaDefs = [
    { key: "m1"   as const, label: "$1.00", value: 1    },
    { key: "m050" as const, label: "$0.50", value: 0.50 },
    { key: "m025" as const, label: "$0.25", value: 0.25 },
    { key: "m010" as const, label: "$0.10", value: 0.10 },
    { key: "m005" as const, label: "$0.05", value: 0.05 },
    { key: "m001" as const, label: "$0.01", value: 0.01 },
  ];

  // Fila de denominación
  const DenomRow = ({
    label, value: dv, qty, onChange, disabled,
  }: { label: string; value: number; qty: number; onChange: (v: number) => void; disabled: boolean }) => (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isLight ? "border-gray-100 bg-gray-50/60" : "border-white/[0.06] bg-white/[0.02]"}`}>
      <span className={`text-sm font-bold tabular-nums w-12 ${txt}`}>{label}</span>
      <span className={`text-xs ${sub}`}>×</span>
      <input
        type="number" min="0" value={qty || ""} placeholder="0"
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        disabled={disabled}
        className={`flex-1 min-w-0 px-2 py-1.5 rounded-lg text-sm text-center font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed tabular-nums ${inp}`}
      />
      <span className={`text-xs ${sub}`}>=</span>
      <span className={`text-sm font-bold tabular-nums w-16 text-right ${qty > 0 ? txt : sub}`}>
        ${(qty * dv).toFixed(2)}
      </span>
    </div>
  );

  // Fila de resumen (etiqueta · valor)
  const SumRow = ({ label, value, color, clickable, onClick }: {
    label: string; value: string; color?: string; clickable?: boolean; onClick?: () => void;
  }) => {
    const Comp = clickable ? "button" : "div";
    return (
      <Comp
        onClick={onClick}
        className={`w-full flex items-center justify-between py-2.5 px-0 border-b ${divider} last:border-0 transition-colors ${clickable ? rowHover + " rounded px-2 -mx-2 cursor-pointer" : ""}`}
      >
        <span className={`text-sm ${sub}`}>{label}</span>
        <div className="flex items-center gap-1.5">
          <span className={`text-sm font-bold tabular-nums ${color ?? txt}`}>{value}</span>
          {clickable && <ChevronRight className={`w-3.5 h-3.5 ${sub}`} />}
        </div>
      </Comp>
    );
  };

  // Modal genérico de tabla
  const TableModal = ({
    title, subtitle, icon, rows, columns, total, totalLabel, totalColor, onClose,
  }: {
    title: string; subtitle: string; icon: ReactNode;
    rows: ReactNode; columns: string[]; total: string;
    totalLabel: string; totalColor: string; onClose: () => void;
  }) => (
    <ModalWrapper onClose={onClose}>
      <div className={`flex items-center justify-between px-6 py-4 border-b ${divider2}`}>
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <p className={`text-base font-bold ${txt}`}>{title}</p>
            <p className={`text-xs ${sub}`}>{subtitle}</p>
          </div>
        </div>
        <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${closeBtn}`}><XCircle className="w-4 h-4" /></button>
      </div>
      <div className="overflow-auto max-h-[52vh]">
        <table className="w-full">
          <thead className={`sticky top-0 ${theadBg} border-b ${divider2}`}>
            <tr>
              {columns.map((c, i) => (
                <th key={c} className={`px-5 py-3 text-xs font-semibold uppercase tracking-wider ${sub} ${i === columns.length - 1 ? "text-right" : "text-left"}`}>{c}</th>
              ))}
            </tr>
          </thead>
          <tbody className={`divide-y ${divider}`}>{rows}</tbody>
          <tfoot>
            <tr className={`border-t-2 ${divider2} ${faintBg}`}>
              <td colSpan={columns.length - 1} className={`px-5 py-4 text-right text-sm font-bold ${txt}`}>{totalLabel}</td>
              <td className={`px-5 py-4 text-right text-lg font-extrabold tabular-nums ${totalColor}`}>{total}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className={`px-6 py-3 border-t ${divider2} ${faintBg}`}>
        <button onClick={onClose} className={`w-full px-4 py-2.5 rounded-xl text-sm font-semibold border transition-colors ${isLight ? "border-gray-200 text-gray-700 hover:bg-gray-100" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>Cerrar</button>
      </div>
    </ModalWrapper>
  );

  const badgeClass = `px-2.5 py-0.5 rounded text-xs font-medium border ${isLight ? "bg-gray-100 border-gray-200 text-gray-600" : "bg-white/5 border-white/10 text-gray-400"}`;

  return (
    <div className={`h-full ${rootBg} overflow-auto`}>

      {/* ── Print ───────────────────────────────────────────────────────── */}
      <div className="hidden print:block print:p-8 print:bg-white print:text-black">
        <style>{`@media print{body{margin:0;padding:0;}@page{margin:1cm;size:letter portrait;}*{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}`}</style>
        <div className="mb-6 pb-4 border-b-2 border-gray-800 flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ARQUEO DE CAJA</h1>
            <p className="text-sm text-gray-500 mt-1">{localStorage.getItem("companyName") || "Mi Empresa"} · TicSoftEc</p>
          </div>
          <div className="text-right text-sm text-gray-500">
            <p>{new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
            <p className="font-semibold text-gray-800 mt-1">Cajero: Juan Pérez</p>
          </div>
        </div>
        <table className="w-full text-sm border-collapse">
          <tbody>
            {[
              ["Monto Inicial", `$${montoInicial.toFixed(2)}`],
              ["Ventas Efectivo", `+$${ventasEfectivo.toFixed(2)}`],
              ["Gastos del Día", `-$${totalGastos.toFixed(2)}`],
              ["Saldo Esperado", `$${saldoEsperado.toFixed(2)}`],
              ["Efectivo Contado", `$${totalContado.toFixed(2)}`],
            ].map(([l, v]) => (
              <tr key={l} className="border-b border-gray-200">
                <td className="py-2 font-medium">{l}</td>
                <td className="py-2 text-right font-mono">{v}</td>
              </tr>
            ))}
            <tr className={`font-bold ${diferencia===0?"bg-green-100":diferencia>0?"bg-blue-100":"bg-red-100"}`}>
              <td className="py-3 px-1">{diferencia===0?"✓ CAJA CUADRADA":diferencia>0?"↑ SOBRANTE":"↓ FALTANTE"}</td>
              <td className="py-3 px-1 text-right font-mono">${Math.abs(diferencia).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          CONTENIDO PRINCIPAL
      ══════════════════════════════════════════════════════════════════ */}
      <div className="p-4 print:hidden">
        <div className="max-w-[1400px] mx-auto">

          {/* Espaciado superior igual al del Punto de Venta */}
          <div className="mb-4"></div>

          {/*
            Layout de 2 columnas:
            [Conteo de efectivo (billetes + monedas)] | [Panel de resumen]
          */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4 items-start">

            {/* ── COLUMNA IZQUIERDA: Conteo de efectivo ─────────────────── */}
            <div className={`${card} rounded-xl overflow-hidden`}>

              {/* Header de la tarjeta */}
              <div className={`flex items-center justify-between px-6 py-4 border-b ${divider2}`}>
                <div>
                  <p className={`text-base font-bold ${txt}`}>Conteo de Efectivo</p>
                  <p className={`text-xs ${sub} mt-0.5`}>Ingresa la cantidad de cada denominación para calcular el total en caja</p>
                </div>
                {/* Totalizador rápido */}
                <div className={`flex items-center gap-6 pl-6 border-l ${divider2}`}>
                  <div className="text-right">
                    <p className={`text-xs uppercase tracking-wide ${sub}`}>Billetes</p>
                    <p className={`text-lg font-bold tabular-nums ${txt}`}>${totalBilletes.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs uppercase tracking-wide ${sub}`}>Monedas</p>
                    <p className={`text-lg font-bold tabular-nums ${txt}`}>${totalMonedas.toFixed(2)}</p>
                  </div>
                  <div className={`text-right pl-6 border-l ${divider2}`}>
                    <p className={`text-xs uppercase tracking-wide ${sub}`}>Total contado</p>
                    <p className={`text-2xl font-extrabold tabular-nums text-primary`}>${totalContado.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              {/* Grilla de denominaciones: Billetes | Monedas */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-x" style={{ borderColor: isLight ? "#f3f4f6" : "rgba(255,255,255,0.06)" }}>

                {/* Billetes */}
                <div className="p-5">
                  <div className={`flex items-center gap-2 mb-4 pb-3 border-b ${divider}`}>
                    <Banknote className={`w-4 h-4 ${sub}`} />
                    <p className={`text-sm font-semibold ${txt}`}>Billetes</p>
                  </div>
                  {/* Encabezados de columnas */}
                  <div className={`grid grid-cols-[48px_1fr_72px] gap-2 px-3 pb-2 text-xs font-semibold uppercase tracking-wider ${sub}`}>
                    <span>Valor</span>
                    <span className="text-center">Cantidad</span>
                    <span className="text-right">Subtotal</span>
                  </div>
                  <div className="space-y-1.5">
                    {billeteDefs.map((b) => (
                      <DenomRow
                        key={b.key} label={b.label} value={b.value}
                        qty={billetes[b.key]}
                        onChange={(v) => setBilletes({ ...billetes, [b.key]: v })}
                        disabled={isCajaCerrada}
                      />
                    ))}
                  </div>
                  <div className={`mt-4 pt-3 border-t ${divider} flex items-center justify-between`}>
                    <span className={`text-sm font-semibold ${sub}`}>Total billetes</span>
                    <span className={`text-xl font-extrabold tabular-nums ${txt}`}>${totalBilletes.toFixed(2)}</span>
                  </div>
                </div>

                {/* Monedas */}
                <div className="p-5">
                  <div className={`flex items-center gap-2 mb-4 pb-3 border-b ${divider}`}>
                    <Coins className={`w-4 h-4 ${sub}`} />
                    <p className={`text-sm font-semibold ${txt}`}>Monedas</p>
                  </div>
                  <div className={`grid grid-cols-[48px_1fr_72px] gap-2 px-3 pb-2 text-xs font-semibold uppercase tracking-wider ${sub}`}>
                    <span>Valor</span>
                    <span className="text-center">Cantidad</span>
                    <span className="text-right">Subtotal</span>
                  </div>
                  <div className="space-y-1.5">
                    {monedaDefs.map((m) => (
                      <DenomRow
                        key={m.key} label={m.label} value={m.value}
                        qty={monedas[m.key]}
                        onChange={(v) => setMonedas({ ...monedas, [m.key]: v })}
                        disabled={isCajaCerrada}
                      />
                    ))}
                  </div>
                  <div className={`mt-4 pt-3 border-t ${divider} flex items-center justify-between`}>
                    <span className={`text-sm font-semibold ${sub}`}>Total monedas</span>
                    <span className={`text-xl font-extrabold tabular-nums ${txt}`}>${totalMonedas.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Barra inferior: total general contado */}
              <div className={`px-6 py-4 border-t ${divider2} ${faintBg} flex items-center justify-between`}>
                <div>
                  <p className={`text-xs uppercase tracking-widest font-semibold ${sub}`}>Total físico en caja</p>
                  <p className={`text-xs ${sub} mt-0.5`}>Billetes ${totalBilletes.toFixed(2)} + Monedas ${totalMonedas.toFixed(2)}</p>
                </div>
                <p className={`text-3xl font-extrabold tabular-nums ${txt}`}>${totalContado.toFixed(2)}</p>
              </div>
            </div>

            {/* ── COLUMNA DERECHA: Panel de resumen ─────────────────────── */}
            <div className="flex flex-col gap-4">

              {/* 1 · Ventas del turno */}
              <div className={`${card} rounded-xl overflow-hidden`}>
                <div className={`flex items-center gap-2 px-5 py-3 border-b ${divider2}`}>
                  <TrendingUp className={`w-4 h-4 ${sub}`} />
                  <p className={`text-sm font-bold ${txt}`}>Ventas del Turno</p>
                  <span className={`ml-auto text-xl font-extrabold tabular-nums ${txt}`}>${totalVentas.toFixed(2)}</span>
                </div>
                <div className="px-5 py-2 space-y-0">
                  <SumRow label="Efectivo" value={`$${ventasEfectivo.toFixed(2)}`} />
                  <SumRow
                    label={`Tarjeta · ${transaccionesTarjeta.length} transacciones`}
                    value={`$${ventasTarjeta.toFixed(2)}`}
                    clickable onClick={() => setShowTarjeta(true)}
                  />
                  <SumRow
                    label={`Transferencia · ${transaccionesTransferencia.length} transferencias`}
                    value={`$${ventasTransferencia.toFixed(2)}`}
                    clickable onClick={() => setShowTransferencia(true)}
                  />
                  <SumRow
                    label={`Gastos del día · ${gastosDelDia.length} registros`}
                    value={`-$${totalGastos.toFixed(2)}`}
                    color="text-red-400"
                    clickable onClick={() => setShowGastos(true)}
                  />
                </div>
              </div>

              {/* 2 · Cuadre de caja */}
              <div className={`${card} rounded-xl overflow-hidden`}>
                <div className={`flex items-center gap-2 px-5 py-3 border-b ${divider2}`}>
                  <FileText className={`w-4 h-4 ${sub}`} />
                  <p className={`text-sm font-bold ${txt}`}>Cuadre de Caja</p>
                </div>
                <div className="px-5 py-3 space-y-0">
                  <SumRow label="Monto inicial" value={`$${montoInicial.toFixed(2)}`} />
                  <SumRow label="+ Ventas efectivo" value={`$${ventasEfectivo.toFixed(2)}`} />
                  <SumRow label="− Gastos del día" value={`-$${totalGastos.toFixed(2)}`} color="text-red-400" />
                  {/* Saldo esperado destacado */}
                  <div className={`flex items-center justify-between py-3 mt-1 px-3 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/[0.04] border-white/10"}`}>
                    <span className={`text-sm font-semibold ${txt}`}>Saldo esperado</span>
                    <span className="text-base font-extrabold tabular-nums text-primary">${saldoEsperado.toFixed(2)}</span>
                  </div>
                  <div className={`flex items-center justify-between pt-3 pb-1 border-t ${divider} mt-2`}>
                    <span className={`text-sm ${sub}`}>Efectivo contado</span>
                    <span className={`text-base font-extrabold tabular-nums ${txt}`}>${totalContado.toFixed(2)}</span>
                  </div>
                </div>

                {/* Resultado diferencia */}
                <div className={`mx-5 mb-4 rounded-xl px-4 py-3 border ${
                  diferencia === 0
                    ? isLight ? "bg-emerald-50 border-emerald-200" : "bg-emerald-500/[0.07] border-emerald-500/20"
                    : diferencia > 0
                      ? isLight ? "bg-sky-50 border-sky-200"     : "bg-sky-500/[0.07] border-sky-500/20"
                      : isLight ? "bg-red-50 border-red-200"     : "bg-red-500/[0.07] border-red-500/20"
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    {diferencia === 0
                      ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                      : <AlertCircle className={`w-4 h-4 ${diferencia > 0 ? "text-sky-500" : "text-red-500"}`} />
                    }
                    <span className={`text-xs font-bold uppercase tracking-widest ${diferencia===0?"text-emerald-600":diferencia>0?"text-sky-600":"text-red-500"}`}>
                      {diferencia === 0 ? "Caja cuadrada" : diferencia > 0 ? "Sobrante en caja" : "Faltante en caja"}
                    </span>
                  </div>
                  <p className={`text-3xl font-extrabold tabular-nums leading-none ${diferencia===0?"text-emerald-600":diferencia>0?"text-sky-600":"text-red-500"}`}>
                    {diferencia !== 0 && (diferencia > 0 ? "+" : "−")}${Math.abs(diferencia).toFixed(2)}
                  </p>
                </div>

                {/* Acciones integradas */}
                <div className={`px-5 pb-4 grid grid-cols-2 gap-2.5`}>
                  <button
                    onClick={() => { window.print(); toast.success("Generando reporte de arqueo..."); }}
                    className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                      isLight
                        ? "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                        : "bg-white/[0.05] border-white/15 text-white hover:bg-white/10"
                    }`}
                  >
                    <Printer className="w-4 h-4" /> Imprimir
                  </button>
                  <button
                    onClick={handleCerrarCaja}
                    disabled={isCajaCerrada}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-700 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-red-600/20"
                  >
                    <Lock className="w-4 h-4" />
                    {isCajaCerrada ? "Caja cerrada" : "Cerrar caja"}
                  </button>
                </div>
              </div>

            </div>{/* /columna derecha */}
          </div>{/* /grid */}
        </div>
      </div>

      {/* ── MODAL GASTOS ──────────────────────────────────────────────────── */}
      {showGastos && (
        <TableModal
          title="Gastos del Día"
          subtitle={`${gastosDelDia.length} registros · $${totalGastos.toFixed(2)} total`}
          icon={<ShoppingBag className={`w-5 h-5 ${sub}`} />}
          columns={["ID","Fecha / Hora","Concepto","Categoría","Responsable","Monto"]}
          total={`$${totalGastos.toFixed(2)}`}
          totalLabel="Total gastos del día"
          totalColor="text-red-400"
          onClose={() => setShowGastos(false)}
          rows={gastosDelDia.map((g) => (
            <tr key={g.id} className={`transition-colors ${rowHover}`}>
              <td className={`px-5 py-3.5 text-sm font-mono ${sub}`}>{g.id}</td>
              <td className={`px-5 py-3.5 text-sm ${sub}`}>{g.fecha} · {g.hora}</td>
              <td className={`px-5 py-3.5 text-sm ${txt}`}>{g.concepto}</td>
              <td className="px-5 py-3.5"><span className={badgeClass}>{g.categoria}</span></td>
              <td className={`px-5 py-3.5 text-sm ${sub}`}>{g.responsable}</td>
              <td className="px-5 py-3.5 text-right text-sm font-bold tabular-nums text-red-400">${g.monto.toFixed(2)}</td>
            </tr>
          ))}
        />
      )}

      {/* ── MODAL TARJETAS ────────────────────────────────────────────────── */}
      {showTarjeta && (
        <TableModal
          title="Transacciones con Tarjeta"
          subtitle={`${transaccionesTarjeta.length} transacciones · $${totalTarjeta.toFixed(2)} total`}
          icon={<CreditCard className={`w-5 h-5 ${sub}`} />}
          columns={["ID","Fecha / Hora","Cliente","Factura","Estado","Monto"]}
          total={`$${totalTarjeta.toFixed(2)}`}
          totalLabel="Total tarjeta"
          totalColor={txt}
          onClose={() => setShowTarjeta(false)}
          rows={transaccionesTarjeta.map((t) => (
            <tr key={t.id} className={`transition-colors ${rowHover}`}>
              <td className={`px-5 py-3.5 text-sm font-mono ${sub}`}>{t.id}</td>
              <td className={`px-5 py-3.5 text-sm ${sub}`}>{t.fecha} · {t.hora}</td>
              <td className={`px-5 py-3.5 text-sm ${txt}`}>{t.cliente}</td>
              <td className={`px-5 py-3.5 text-sm font-mono ${sub}`}>{t.factura}</td>
              <td className="px-5 py-3.5"><span className={badgeClass}>{t.estado}</span></td>
              <td className={`px-5 py-3.5 text-right text-sm font-bold tabular-nums ${txt}`}>${t.monto.toFixed(2)}</td>
            </tr>
          ))}
        />
      )}

      {/* ── MODAL TRANSFERENCIAS ──────────────────────────────────────────── */}
      {showTransferencia && (
        <TableModal
          title="Transferencias Bancarias"
          subtitle={`${transaccionesTransferencia.length} transferencias · $${totalTransferencias.toFixed(2)} total`}
          icon={<DollarSign className={`w-5 h-5 ${sub}`} />}
          columns={["ID","Fecha / Hora","Cliente","Factura","Estado","Monto"]}
          total={`$${totalTransferencias.toFixed(2)}`}
          totalLabel="Total transferencias"
          totalColor={txt}
          onClose={() => setShowTransferencia(false)}
          rows={transaccionesTransferencia.map((t) => (
            <tr key={t.id} className={`transition-colors ${rowHover}`}>
              <td className={`px-5 py-3.5 text-sm font-mono ${sub}`}>{t.id}</td>
              <td className={`px-5 py-3.5 text-sm ${sub}`}>{t.fecha} · {t.hora}</td>
              <td className={`px-5 py-3.5 text-sm ${txt}`}>{t.cliente}</td>
              <td className={`px-5 py-3.5 text-sm font-mono ${sub}`}>{t.factura}</td>
              <td className="px-5 py-3.5"><span className={badgeClass}>{t.estado}</span></td>
              <td className={`px-5 py-3.5 text-right text-sm font-bold tabular-nums ${txt}`}>${t.monto.toFixed(2)}</td>
            </tr>
          ))}
        />
      )}

    </div>
  );
}