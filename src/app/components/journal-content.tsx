import { useState } from "react";
import {
  Search, Eye, Download, Printer,
  BookOpen, CheckCircle, AlertTriangle, X, Save,
  ArrowUpRight, ArrowDownRight, Trash2, Zap,
  ShoppingCart, ShoppingBag, Users, TrendingDown, DollarSign,
  Settings, ChevronDown, Lock, Plus,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import { AccountingKpiCard } from "./ui/accounting-kpi-card";
import { DateRangePicker } from "./date-range-picker";
import {
  useAccounting,
  type Asiento,
  type AsientoLinea,
  type OrigenAsiento,
} from "../contexts/accounting-context";
import { printAsiento, printJournal, downloadJournalCSV } from "../utils/print-download";

const CUENTAS_DISPONIBLES = [
  { codigo: "1.1.1.01", nombre: "Caja General" },
  { codigo: "1.1.1.02", nombre: "Banco Pichincha" },
  { codigo: "1.1.2.01", nombre: "Cuentas por Cobrar" },
  { codigo: "1.1.3.01", nombre: "IVA en Compras" },
  { codigo: "1.1.4.01", nombre: "Inventario" },
  { codigo: "2.1.1.01", nombre: "Cuentas por Pagar" },
  { codigo: "2.1.3.01", nombre: "IVA por Pagar" },
  { codigo: "4.1.1.01", nombre: "Ventas" },
  { codigo: "4.1.2.01", nombre: "Descuentos Ventas" },
  { codigo: "5.1.1.01", nombre: "Sueldos y Salarios" },
  { codigo: "5.2.1.01", nombre: "Gasto Depreciación" },
  { codigo: "1.2.1.02", nombre: "Dep. Acumulada Equipos" },
];

const TIPOS = ["Ajuste", "Cierre", "Otro"];

const MODULOS_FUENTE = [
  { key: "ventas",  label: "Ventas / Facturación",  icon: ShoppingCart, color: "text-gray-600" },
  { key: "compras", label: "Compras / Proveedores", icon: ShoppingBag,  color: "text-gray-600" },
  { key: "nomina",  label: "Nómina / RRHH",          icon: Users,        color: "text-gray-600" },
  { key: "activos", label: "Activos Fijos",           icon: TrendingDown, color: "text-gray-600" },
  { key: "cartera", label: "Cartera / Cobros",        icon: DollarSign,   color: "text-gray-600" },
];

const origenLabel = (origen: OrigenAsiento): string => {
  const m = MODULOS_FUENTE.find(f => f.key === origen);
  if (m)               return m.label;
  if (origen === "pos") return "Punto de Venta";
  return "Manual Excepcional";
};

export function JournalContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { asientos, addAsiento, removeAsiento } = useAccounting();

  const [search,        setSearch]        = useState("");
  const [filterOrigen,  setFilterOrigen]  = useState("all");
  const [fechaDesde,    setFechaDesde]    = useState("2026-03-01");
  const [fechaHasta,    setFechaHasta]    = useState("2026-03-31");
  const [expandedId,    setExpandedId]    = useState<string | null>(null);
  const [showAutoPanel, setShowAutoPanel] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal,   setShowViewModal]   = useState(false);
  const [viewingAsiento,  setViewingAsiento]  = useState<Asiento | null>(null);

  const emptyForm = { descripcion: "", referencia: "", tipo: "Ajuste", fecha: "2026-03-06" };
  const [form,       setForm]       = useState(emptyForm);
  const [editLineas, setEditLineas] = useState<AsientoLinea[]>([]);

  const filtered = asientos.filter(a => {
    const q      = search.toLowerCase();
    const matchQ = a.id.toLowerCase().includes(q) || a.descripcion.toLowerCase().includes(q) || a.referencia.toLowerCase().includes(q);
    const matchO = filterOrigen === "all" || (filterOrigen === "manual" ? !a.autoGenerado : a.origen === filterOrigen);
    const matchF = (!fechaDesde || a.fecha >= fechaDesde) && (!fechaHasta || a.fecha <= fechaHasta);
    return matchQ && matchO && matchF;
  });

  const totalDebe  = filtered.reduce((s, a) => s + a.debe,  0);
  const totalHaber = filtered.reduce((s, a) => s + a.haber, 0);
  const fmt = (v: number) => `$${v.toLocaleString("es-EC", { minimumFractionDigits: 2 })}`;

  /* ── Modal Crear ─────────────────────────────────────────────── */
  const openCreate = () => {
    setForm(emptyForm);
    setEditLineas([{ cuenta: "", nombre: "", debe: 0, haber: 0 }]);
    setShowCreateModal(true);
  };
  const handleCreate = () => {
    if (!form.descripcion.trim()) { toast.error("La descripción es obligatoria"); return; }
    const debe  = editLineas.reduce((s, l) => s + (l.debe  || 0), 0);
    const haber = editLineas.reduce((s, l) => s + (l.haber || 0), 0);
    addAsiento({ ...form, estado: "borrador", origen: "manual", autoGenerado: false, debe, haber, lineas: editLineas.filter(l => l.cuenta) });
    toast.success("Asiento manual creado");
    setShowCreateModal(false);
  };
  const addLinea    = () => setEditLineas(prev => [...prev, { cuenta: "", nombre: "", debe: 0, haber: 0 }]);
  const removeLinea = (i: number) => setEditLineas(prev => prev.filter((_, idx) => idx !== i));
  const updateLinea = (i: number, field: keyof AsientoLinea, value: string | number) => {
    setEditLineas(prev => prev.map((l, idx) => {
      if (idx !== i) return l;
      if (field === "cuenta") {
        const found = CUENTAS_DISPONIBLES.find(c => c.codigo === value);
        return { ...l, cuenta: String(value), nombre: found ? found.nombre : l.nombre };
      }
      return { ...l, [field]: value };
    }));
  };
  const openView = (a: Asiento) => { setViewingAsiento(a); setShowViewModal(true); };

  /* ── Clases comunes ──────────────────────────────────────────── */
  const card     = `rounded-xl ${isLight ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`;
  const ic       = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const lbl      = `block mb-1.5 text-xs font-medium ${isLight ? "text-gray-700" : "text-gray-300"}`;
  const opt      = "bg-[#0D1B2A]";
  const modalBg  = isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10";
  const thCls    = `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider whitespace-nowrap ${isLight ? "text-gray-500" : "text-gray-400"}`;
  const tdCls    = "px-4 py-3";
  const rowHover = isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]";

  /* ── KPIs ────────────────────────────────────────────────────── */
  const metrics = [
    { label: "Total Asientos", value: asientos.length,                                           icon: <BookOpen       className="w-5 h-5 text-primary" />,    bg: "bg-primary/10"   },
    { label: "Auto-generados", value: asientos.filter(a => a.autoGenerado).length,               icon: <Zap            className="w-5 h-5 text-gray-500" />,   bg: "bg-gray-500/10"  },
    { label: "Total Debe",     value: fmt(asientos.reduce((s,a) => s+a.debe,  0)),               icon: <ArrowUpRight    className="w-5 h-5 text-gray-500" />,   bg: "bg-gray-500/10"  },
    { label: "Total Haber",    value: fmt(asientos.reduce((s,a) => s+a.haber, 0)),               icon: <ArrowDownRight  className="w-5 h-5 text-gray-500" />,   bg: "bg-gray-500/10"  },
  ];

  /* ══════════════════════════════════════════════════════════════
     MODAL CREAR
  ══════════════════════════════════════════════════════════════ */
  const renderCreateModal = () => {
    const lineasDebe  = editLineas.reduce((s, l) => s + (l.debe  || 0), 0);
    const lineasHaber = editLineas.reduce((s, l) => s + (l.haber || 0), 0);
    const cuadrado    = Math.abs(lineasDebe - lineasHaber) < 0.01;
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className={`w-full max-w-2xl rounded-2xl shadow-2xl border max-h-[92vh] flex flex-col ${modalBg}`}>
          <div className={`flex items-center justify-between px-6 py-4 border-b flex-shrink-0 ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <div>
              <h3 className={`font-bold text-base ${isLight ? "text-gray-900" : "text-white"}`}>Asiento Manual Excepcional</h3>
              <p className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>Solo cuando la transacción no generó asiento automático</p>
            </div>
            <button onClick={() => setShowCreateModal(false)} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:bg-gray-100" : "text-gray-400 hover:bg-white/10"}`}><X className="w-4 h-4" /></button>
          </div>

          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            <div className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-xs ${isLight ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-amber-500/10 border-amber-500/20 text-amber-300"}`}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <p>Los asientos se generan automáticamente desde cada módulo. Use esta opción solo en casos excepcionales. Una vez creado, el asiento es inmutable.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Fecha</label><input type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} className={ic} /></div>
              <div><label className={lbl}>Tipo</label>
                <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} className={ic}>
                  {TIPOS.map(t => <option key={t} value={t} className={opt}>{t}</option>)}
                </select>
              </div>
            </div>
            <div><label className={lbl}>Descripción <span className="text-red-400">*</span></label>
              <input type="text" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} placeholder="Descripción del asiento" className={ic} />
            </div>
            <div><label className={lbl}>Referencia</label>
              <input type="text" value={form.referencia} onChange={e => setForm({...form, referencia: e.target.value})} placeholder="Ej: DOC-001" className={ic} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={lbl + " mb-0"}>Líneas Contables</label>
                <button onClick={addLinea} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium"><Plus className="w-3.5 h-3.5" /> Añadir línea</button>
              </div>
              <div className={`rounded-lg overflow-hidden border ${isLight ? "border-gray-200" : "border-white/10"}`}>
                <table className="w-full">
                  <thead>
                    <tr className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "bg-gray-50 text-gray-500 border-b border-gray-200" : "bg-[#0D1B2A] text-gray-400 border-b border-white/10"}`}>
                      <th className="px-4 py-2.5 text-left">Cuenta</th>
                      <th className="px-4 py-2.5 text-right w-28">Debe</th>
                      <th className="px-4 py-2.5 text-right w-28">Haber</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {editLineas.map((l, i) => (
                      <tr key={i} className={`border-t ${isLight ? "border-gray-100" : "border-white/5"}`}>
                        <td className="px-4 py-2">
                          <select value={l.cuenta} onChange={e => updateLinea(i, "cuenta", e.target.value)}
                            className={`w-full text-xs px-2 py-1.5 border rounded-lg focus:outline-none focus:border-primary ${isLight ? "bg-white border-gray-300 text-gray-800" : "bg-[#0f1825] border-white/10 text-white"}`}>
                            <option value="" className={opt}>— Seleccionar —</option>
                            {CUENTAS_DISPONIBLES.map(c => <option key={c.codigo} value={c.codigo} className={opt}>{c.codigo} — {c.nombre}</option>)}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input type="number" step="0.01" min="0" value={l.debe || ""} onChange={e => updateLinea(i, "debe", parseFloat(e.target.value) || 0)} placeholder="0.00"
                            className={`w-full text-xs text-right px-2 py-1.5 border rounded-lg focus:outline-none focus:border-primary font-mono ${isLight ? "bg-white border-gray-300 text-gray-800" : "bg-[#0f1825] border-white/10 text-white"}`} />
                        </td>
                        <td className="px-4 py-2">
                          <input type="number" step="0.01" min="0" value={l.haber || ""} onChange={e => updateLinea(i, "haber", parseFloat(e.target.value) || 0)} placeholder="0.00"
                            className={`w-full text-xs text-right px-2 py-1.5 border rounded-lg focus:outline-none focus:border-primary font-mono ${isLight ? "bg-white border-gray-300 text-gray-800" : "bg-[#0f1825] border-white/10 text-white"}`} />
                        </td>
                        <td className="px-2 py-2"><button onClick={() => removeLinea(i)} className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button></td>
                      </tr>
                    ))}
                    <tr className={`border-t ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.03]"}`}>
                      <td className="px-4 py-2.5"><span className={`text-xs font-semibold ${isLight ? "text-gray-600" : "text-gray-300"}`}>Totales</span></td>
                      <td className="px-4 py-2.5 text-right"><span className="text-xs font-bold font-mono">${lineasDebe.toFixed(2)}</span></td>
                      <td className="px-4 py-2.5 text-right"><span className="text-xs font-bold font-mono">${lineasHaber.toFixed(2)}</span></td>
                      <td className="px-2 py-2.5">{cuadrado ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {!cuadrado && editLineas.some(l => l.cuenta) && (
                <p className="text-xs text-yellow-600 mt-1.5 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Debe = Haber para un asiento balanceado</p>
              )}
            </div>
          </div>

          <div className={`border-t px-6 py-4 flex justify-end gap-3 flex-shrink-0 ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <button onClick={() => setShowCreateModal(false)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}>
              Cancelar
            </button>
            <button onClick={handleCreate} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <Save className="w-4 h-4" /> Crear Asiento
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ══════════════════════════════════════════════════════════════
     MODAL VER
  ══════════════════════════════════════════════════════════════ */
  const renderViewModal = (a: Asiento) => (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-xl rounded-2xl shadow-2xl border ${modalBg}`}>
        <div className={`flex items-center justify-between px-6 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div>
            <span className={`font-bold text-lg font-mono ${isLight ? "text-gray-900" : "text-white"}`}>{a.id}</span>
            <p className={`text-xs mt-0.5 ${isLight ? "text-gray-400" : "text-gray-500"}`}>{a.fecha} · {a.tipo} · {a.referencia || "Sin referencia"}</p>
          </div>
          <button onClick={() => setShowViewModal(false)} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:bg-gray-100" : "text-gray-400 hover:bg-white/10"}`}><X className="w-4 h-4" /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className={`px-4 py-3 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
              <p className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${isLight ? "text-gray-400" : "text-gray-500"}`}>Origen</p>
              <p className={`text-sm font-medium ${isLight ? "text-gray-800" : "text-gray-200"}`}>{origenLabel(a.origen)}</p>
            </div>
            <div className={`px-4 py-3 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
              <p className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${isLight ? "text-gray-400" : "text-gray-500"}`}>Tipo</p>
              <p className={`text-sm font-medium ${isLight ? "text-gray-800" : "text-gray-200"}`}>{a.tipo} · {a.autoGenerado ? "Automático" : "Manual"}</p>
            </div>
          </div>
          <div className={`px-4 py-3 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
            <p className={`text-[10px] uppercase tracking-wider font-semibold mb-1 ${isLight ? "text-gray-400" : "text-gray-500"}`}>Descripción</p>
            <p className={`text-sm ${isLight ? "text-gray-800" : "text-gray-200"}`}>{a.descripcion}</p>
          </div>

          <div className={`rounded-lg overflow-hidden border ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <table className="w-full">
              <thead>
                <tr className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "bg-gray-50 text-gray-500 border-b border-gray-200" : "bg-[#0D1B2A] text-gray-400 border-b border-white/10"}`}>
                  <th className="px-4 py-2.5 text-left">Cuenta</th>
                  <th className="px-4 py-2.5 text-left">Nombre</th>
                  <th className="px-4 py-2.5 text-right">Debe</th>
                  <th className="px-4 py-2.5 text-right">Haber</th>
                </tr>
              </thead>
              <tbody>
                {a.lineas.map((l, i) => (
                  <tr key={i} className={`border-t ${isLight ? "border-gray-100" : "border-white/5"}`}>
                    <td className="px-4 py-2.5"><span className="text-xs font-mono font-semibold text-primary">{l.cuenta}</span></td>
                    <td className="px-4 py-2.5"><span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>{l.nombre}</span></td>
                    <td className="px-4 py-2.5 text-right">
                      {l.debe > 0 ? <span className="text-sm font-mono">{fmt(l.debe)}</span> : <span className={`text-sm ${isLight ? "text-gray-300" : "text-gray-600"}`}>—</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      {l.haber > 0 ? <span className="text-sm font-mono">{fmt(l.haber)}</span> : <span className={`text-sm ${isLight ? "text-gray-300" : "text-gray-600"}`}>—</span>}
                    </td>
                  </tr>
                ))}
                <tr className={`border-t ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.03]"}`}>
                  <td colSpan={2} className="px-4 py-2.5"><span className={`text-xs font-bold uppercase tracking-wide ${isLight ? "text-gray-600" : "text-gray-400"}`}>Total</span></td>
                  <td className="px-4 py-2.5 text-right"><span className="text-sm font-bold font-mono">{fmt(a.debe)}</span></td>
                  <td className="px-4 py-2.5 text-right"><span className="text-sm font-bold font-mono">{fmt(a.haber)}</span></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 text-xs ${isLight ? "text-gray-400" : "text-gray-500"}`}>
              <Lock className="w-3.5 h-3.5" />
              <span>Asiento inmutable — corrija con una reversión</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold ${a.debe === a.haber ? "text-green-600" : "text-yellow-600"}`}>
                {a.debe === a.haber ? "Balanceado" : "Descuadrado"}
              </span>
              <button onClick={() => printAsiento(a)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
                <Printer className="w-3.5 h-3.5" /> Imprimir
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  /* ══════════════════════════════════════════════════════════════
     RENDER PRINCIPAL
  ══════════════════════════════════════════════════════════════ */
  return (
    <div className="space-y-6">

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map(m => <AccountingKpiCard key={m.label} label={m.label} value={m.value} icon={m.icon} iconBg={m.bg} />)}
      </div>

      <div className={`border-t ${isLight ? "border-gray-200" : "border-white/10"}`} />

      {/* Botones */}
      <div className="flex justify-end gap-2">
        <button onClick={() => downloadJournalCSV(filtered)}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
        <button onClick={() => printJournal(filtered)}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
          <Printer className="w-4 h-4" /> Imprimir
        </button>
        <button onClick={openCreate}
          className="px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 bg-primary hover:bg-primary/90 text-white transition-colors">
          <Settings className="w-4 h-4" /> Asiento Manual
        </button>
      </div>

      {/* ── FILTROS — mismo patrón que Libro Mayor ───────────────── */}
      <div className={`${card} p-5`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Buscador */}
          <div>
            <label className={lbl}>Buscar asiento</label>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
              <input
                type="text"
                placeholder="N.º, descripción, referencia..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm border focus:outline-none focus:border-primary transition-all ${
                  isLight ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400" : "bg-white/5 border-white/10 text-white placeholder-gray-500"
                }`}
              />
            </div>
          </div>

          {/* Selector de origen */}
          <div>
            <label className={lbl}>Módulo de origen</label>
            <select
              value={filterOrigen}
              onChange={e => setFilterOrigen(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm border focus:outline-none focus:border-primary transition-all ${
                isLight ? "bg-white border-gray-300 text-gray-900" : "bg-white/5 border-white/10 text-white"
              }`}
            >
              <option value="all" className={opt}>Todos los módulos</option>
              {MODULOS_FUENTE.map(m => <option key={m.key} value={m.key} className={opt}>{m.label}</option>)}
              <option value="pos" className={opt}>Punto de Venta</option>
              <option value="manual" className={opt}>Manual / Excepcional</option>
            </select>
          </div>

          {/* Rango de fechas */}
          <div className="md:col-span-1">
            <label className={lbl}>Período</label>
            <DateRangePicker
              dateFrom={fechaDesde}
              dateTo={fechaHasta}
              onDateFromChange={setFechaDesde}
              onDateToChange={setFechaHasta}
            />
          </div>
        </div>

        {/* Banner asientos automáticos */}
        <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/[0.02] border-white/10"}`}>
          <Zap className={`w-4 h-4 flex-shrink-0 ${isLight ? "text-gray-500" : "text-gray-400"}`} />
          <p className={`text-xs flex-1 ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            Los asientos se generan automáticamente desde cada módulo (Ventas, Compras, POS, Nómina). Son inmutables por diseño contable.
          </p>
          <button onClick={() => setShowAutoPanel(!showAutoPanel)}
            className={`flex items-center gap-1 text-xs font-medium transition-colors flex-shrink-0 ${isLight ? "text-gray-500 hover:text-gray-700" : "text-gray-400 hover:text-gray-200"}`}>
            Módulos <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAutoPanel ? "rotate-180" : ""}`} />
          </button>
        </div>

        {showAutoPanel && (
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {MODULOS_FUENTE.map(m => {
              const Icon = m.icon;
              const count = asientos.filter(a => a.origen === m.key).length;
              return (
                <div key={m.key} className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isLight ? "text-gray-400" : "text-gray-500"}`} />
                  <div className="min-w-0">
                    <p className={`text-xs font-medium leading-tight truncate ${isLight ? "text-gray-700" : "text-gray-300"}`}>{m.label}</p>
                    <p className={`text-[10px] ${isLight ? "text-gray-400" : "text-gray-500"}`}>{count} asientos</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── TABLA ────────────────────────────────────────────────── */}
      <div className={`rounded-xl overflow-hidden border ${isLight ? "border-gray-200" : "border-white/10"}`}>
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <BookOpen className={`w-8 h-8 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
            <p className={`text-sm font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>No se encontraron asientos</p>
            <p className={`text-xs mt-1 ${isLight ? "text-gray-400" : "text-gray-500"}`}>Los asientos se generan automáticamente desde los módulos</p>
          </div>
        ) : (
          <table className="w-full table-fixed">
            <thead>
              <tr className={isLight ? "bg-gray-50 border-b border-gray-200" : "bg-[#0D1B2A] border-b border-white/10"}>
                <th className={thCls} style={{width:"140px"}}>N.º Asiento</th>
                <th className={thCls} style={{width:"auto"}}>Concepto</th>
                <th className={thCls} style={{width:"180px"}}>Módulo</th>
                <th className={thCls} style={{width:"105px"}}>Fecha</th>
                <th className={thCls + " text-right"} style={{width:"110px"}}>Debe</th>
                <th className={thCls + " text-right"} style={{width:"110px"}}>Haber</th>
                <th className={thCls + " text-center"} style={{width:"80px"}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.flatMap((a, idx) => {
                const isExpanded = expandedId === a.id;
                const concepto = a.autoGenerado
                  ? `Asiento generado — ${origenLabel(a.origen)}`
                  : `Asiento manual — ${a.tipo}`;

                const mainRow = (
                  <tr key={a.id}
                    className={`${idx > 0 ? `border-t ${isLight ? "border-gray-100" : "border-white/5"}` : ""} ${rowHover} cursor-pointer transition-colors`}
                    onClick={() => setExpandedId(isExpanded ? null : a.id)}>

                    {/* N.º */}
                    <td className={tdCls}>
                      <span className="text-sm font-mono font-semibold text-primary">{a.id}</span>
                    </td>

                    {/* Concepto — descripción breve sin repetir origen */}
                    <td className={tdCls}>
                      <p className={`text-sm truncate ${isLight ? "text-gray-700" : "text-gray-300"}`}>{concepto}</p>
                      {a.referencia && <p className={`text-xs mt-0.5 ${isLight ? "text-gray-400" : "text-gray-500"}`}>{a.referencia}</p>}
                    </td>

                    {/* Módulo */}
                    <td className={tdCls}>
                      <span className={`text-sm ${isLight ? "text-gray-600" : "text-gray-400"}`}>{origenLabel(a.origen)}</span>
                    </td>

                    {/* Fecha */}
                    <td className={tdCls}>
                      <span className={`text-sm tabular-nums ${isLight ? "text-gray-600" : "text-gray-400"}`}>{a.fecha}</span>
                    </td>

                    {/* Debe */}
                    <td className={tdCls + " text-right"}>
                      <span className={`text-sm font-mono tabular-nums ${isLight ? "text-gray-800" : "text-gray-200"}`}>{fmt(a.debe)}</span>
                    </td>

                    {/* Haber */}
                    <td className={tdCls + " text-right"}>
                      <span className={`text-sm font-mono tabular-nums ${isLight ? "text-gray-800" : "text-gray-200"}`}>{fmt(a.haber)}</span>
                    </td>

                    {/* Acciones */}
                    <td className={tdCls + " text-center"} onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-3">
                        <button onClick={() => openView(a)}
                          className={`transition-colors ${isLight ? "text-gray-400 hover:text-gray-700" : "text-gray-500 hover:text-gray-200"}`} title="Ver detalle">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => { if (window.confirm("¿Eliminar este asiento?")) { removeAsiento(a.id); toast.success("Asiento eliminado"); } }}
                          className={`transition-colors ${isLight ? "text-gray-400 hover:text-red-500" : "text-gray-500 hover:text-red-400"}`} title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );

                /* Fila expandida — líneas contables */
                const detailRow = isExpanded ? (
                  <tr key={`${a.id}-detail`} className={`border-t ${isLight ? "border-gray-100" : "border-white/5"}`}>
                    <td colSpan={7} className={`px-8 pb-5 pt-3 ${isLight ? "bg-gray-50" : "bg-white/[0.015]"}`}>
                      <div className={`rounded-lg overflow-hidden border ${isLight ? "border-gray-200" : "border-white/10"}`}>
                        <table className="w-full">
                          <thead>
                            <tr className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "bg-gray-100 text-gray-500 border-b border-gray-200" : "bg-[#0D1B2A] text-gray-400 border-b border-white/10"}`}>
                              <th className="px-4 py-2 text-left w-32">Cuenta</th>
                              <th className="px-4 py-2 text-left">Nombre</th>
                              <th className="px-4 py-2 text-right w-32">Debe</th>
                              <th className="px-4 py-2 text-right w-32">Haber</th>
                            </tr>
                          </thead>
                          <tbody>
                            {a.lineas.map((l, i) => (
                              <tr key={i} className={`border-t ${isLight ? "border-gray-100 bg-white" : "border-white/5"}`}>
                                <td className="px-4 py-2.5"><span className="text-xs font-mono font-semibold text-primary">{l.cuenta}</span></td>
                                <td className="px-4 py-2.5"><span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>{l.nombre}</span></td>
                                <td className="px-4 py-2.5 text-right">
                                  {l.debe > 0 ? <span className="text-sm font-mono">{fmt(l.debe)}</span> : <span className={isLight ? "text-gray-300" : "text-gray-600"}>—</span>}
                                </td>
                                <td className="px-4 py-2.5 text-right">
                                  {l.haber > 0 ? <span className="text-sm font-mono">{fmt(l.haber)}</span> : <span className={isLight ? "text-gray-300" : "text-gray-600"}>—</span>}
                                </td>
                              </tr>
                            ))}
                            <tr className={`border-t ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.03]"}`}>
                              <td colSpan={2} className="px-4 py-2.5">
                                <span className={`text-xs font-bold uppercase tracking-wide ${isLight ? "text-gray-600" : "text-gray-400"}`}>Total</span>
                              </td>
                              <td className="px-4 py-2.5 text-right"><span className="text-sm font-bold font-mono">{fmt(a.debe)}</span></td>
                              <td className="px-4 py-2.5 text-right"><span className="text-sm font-bold font-mono">{fmt(a.haber)}</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                ) : null;

                return [mainRow, detailRow].filter(Boolean);
              })}
            </tbody>
            <tfoot>
              <tr className={`border-t-2 ${isLight ? "border-gray-200 bg-gray-50" : "border-white/15 bg-white/[0.03]"}`}>
                <td colSpan={4} className="px-4 py-3">
                  <span className={`text-xs font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                    {filtered.length} asiento{filtered.length !== 1 ? "s" : ""}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`text-sm font-bold font-mono tabular-nums ${isLight ? "text-gray-800" : "text-gray-200"}`}>{fmt(totalDebe)}</span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`text-sm font-bold font-mono tabular-nums ${isLight ? "text-gray-800" : "text-gray-200"}`}>{fmt(totalHaber)}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  {Math.abs(totalDebe - totalHaber) < 0.01
                    ? <span className="text-xs font-semibold text-green-600 flex items-center justify-center gap-1"><CheckCircle className="w-3.5 h-3.5" />OK</span>
                    : <span className="text-xs font-semibold text-yellow-600 flex items-center justify-center gap-1"><AlertTriangle className="w-3.5 h-3.5" />⚠</span>}
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>

      {showCreateModal && renderCreateModal()}
      {showViewModal && viewingAsiento && renderViewModal(viewingAsiento)}
    </div>
  );
}
