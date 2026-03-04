import { useState, useCallback, useMemo } from "react";
import {
  Search, Plus, Filter, Eye, Edit, Download, Printer,
  BookOpen, CheckCircle, Clock, AlertTriangle, X, Save,
  ChevronDown, ChevronUp, ArrowUpRight, ArrowDownRight, Trash2,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import { AccountingKpiCard } from "./ui/accounting-kpi-card";
import {
  printAsiento,
  printJournal,
  downloadJournalCSV,
} from "../utils/print-download";

const ASIENTOS_INIT = [
  {
    id: "ASI-2026-001", fecha: "2026-03-01",
    descripcion: "Venta de mercadería - Factura #F001-0045",
    referencia: "FAC-0045", tipo: "Venta", estado: "aprobado",
    debe: 5600.00, haber: 5600.00,
    lineas: [
      { cuenta: "1.1.1.01", nombre: "Caja",         debe: 5600.00, haber: 0 },
      { cuenta: "4.1.1.01", nombre: "Ventas",        debe: 0,       haber: 5000.00 },
      { cuenta: "2.1.3.01", nombre: "IVA por Pagar", debe: 0,       haber: 600.00 },
    ],
  },
  {
    id: "ASI-2026-002", fecha: "2026-03-02",
    descripcion: "Compra de mercadería - OC-2026-001",
    referencia: "OC-001", tipo: "Compra", estado: "aprobado",
    debe: 3360.00, haber: 3360.00,
    lineas: [
      { cuenta: "1.1.4.01", nombre: "Inventario",         debe: 3000.00, haber: 0 },
      { cuenta: "1.1.3.01", nombre: "IVA en Compras",      debe: 360.00,  haber: 0 },
      { cuenta: "2.1.1.01", nombre: "Cuentas por Pagar",   debe: 0,       haber: 3360.00 },
    ],
  },
  {
    id: "ASI-2026-003", fecha: "2026-03-03",
    descripcion: "Pago de nómina – Febrero 2026",
    referencia: "NOM-FEB-2026", tipo: "Nómina", estado: "pendiente",
    debe: 12400.00, haber: 12400.00,
    lineas: [
      { cuenta: "5.1.1.01", nombre: "Sueldos y Salarios",  debe: 12400.00, haber: 0 },
      { cuenta: "1.1.1.02", nombre: "Banco Pichincha",      debe: 0,        haber: 12400.00 },
    ],
  },
  {
    id: "ASI-2026-004", fecha: "2026-03-04",
    descripcion: "Depreciación mensual de activos fijos",
    referencia: "DEP-MAR-2026", tipo: "Depreciación", estado: "aprobado",
    debe: 850.00, haber: 850.00,
    lineas: [
      { cuenta: "5.2.1.01", nombre: "Gasto Depreciación",    debe: 850.00, haber: 0 },
      { cuenta: "1.2.1.02", nombre: "Dep. Acumulada Equipos", debe: 0,      haber: 850.00 },
    ],
  },
  {
    id: "ASI-2026-005", fecha: "2026-03-04",
    descripcion: "Cobro de factura a cliente - Empresa XYZ",
    referencia: "COB-0022", tipo: "Cobro", estado: "borrador",
    debe: 2800.00, haber: 2800.00,
    lineas: [
      { cuenta: "1.1.1.02", nombre: "Banco Pichincha",      debe: 2800.00, haber: 0 },
      { cuenta: "1.1.2.01", nombre: "Cuentas por Cobrar",   debe: 0,       haber: 2800.00 },
    ],
  },
];

const TIPOS = ["Venta", "Compra", "Nómina", "Depreciación", "Cobro", "Ajuste", "Cierre"];

const CUENTAS_DISPONIBLES = [
  { codigo: "1.1.1.01", nombre: "Caja General" },
  { codigo: "1.1.1.02", nombre: "Banco Pichincha" },
  { codigo: "1.1.2.01", nombre: "Cuentas por Cobrar" },
  { codigo: "1.1.3.01", nombre: "IVA en Compras" },
  { codigo: "1.1.4.01", nombre: "Inventario" },
  { codigo: "2.1.1.01", nombre: "Cuentas por Pagar" },
  { codigo: "2.1.3.01", nombre: "IVA por Pagar" },
  { codigo: "4.1.1.01", nombre: "Ventas" },
  { codigo: "5.1.1.01", nombre: "Sueldos y Salarios" },
  { codigo: "5.2.1.01", nombre: "Gasto Depreciación" },
  { codigo: "1.2.1.02", nombre: "Dep. Acumulada Equipos" },
];

type Asiento = (typeof ASIENTOS_INIT)[number];
type Linea   = Asiento["lineas"][number];

export function JournalContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const [asientos, setAsientos] = useState<Asiento[]>(ASIENTOS_INIT);
  const [search, setSearch]       = useState("");
  const [filterTipo, setFilterTipo]   = useState("all");
  const [filterEstado, setFilterEstado] = useState("all");
  const [expandedId, setExpandedId]   = useState<string | null>(null);

  /* ── Modales ──────────────────────────────────────────────────────── */
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal,   setShowEditModal]   = useState(false);
  const [showViewModal,   setShowViewModal]   = useState(false);
  const [editingAsiento,  setEditingAsiento]  = useState<Asiento | null>(null);
  const [viewingAsiento,  setViewingAsiento]  = useState<Asiento | null>(null);

  const emptyForm = { descripcion: "", referencia: "", tipo: "Venta", fecha: "2026-03-04" };
  const [form, setForm] = useState(emptyForm);

  /* ── Líneas en el modal de edición ─────────────────────────────────── */
  const [editLineas, setEditLineas] = useState<Linea[]>([]);

  /* ─────────────────── Filtrado ────────────────────────────────────── */
  const filtered = asientos.filter(a => {
    const q = search.toLowerCase();
    const matchQ = a.id.toLowerCase().includes(q) || a.descripcion.toLowerCase().includes(q) || a.referencia.toLowerCase().includes(q);
    const matchTipo   = filterTipo   === "all" || a.tipo   === filterTipo;
    const matchEstado = filterEstado === "all" || a.estado === filterEstado;
    return matchQ && matchTipo && matchEstado;
  });

  const totalDebe  = filtered.reduce((s, a) => s + a.debe,  0);
  const totalHaber = filtered.reduce((s, a) => s + a.haber, 0);

  /* ─────────────────── Helpers visuales ───────────────────────────── */
  const estadoInfo = (estado: string) => {
    switch (estado) {
      case "aprobado":  return { color: isLight ? "bg-green-100 text-green-700"   : "bg-green-500/20 text-green-300",   label: "Aprobado",  icon: <CheckCircle className="w-3 h-3" /> };
      case "pendiente": return { color: isLight ? "bg-yellow-100 text-yellow-700" : "bg-yellow-500/20 text-yellow-300", label: "Pendiente", icon: <Clock className="w-3 h-3" /> };
      case "borrador":  return { color: isLight ? "bg-gray-100 text-gray-600"     : "bg-white/10 text-gray-400",        label: "Borrador",  icon: <AlertTriangle className="w-3 h-3" /> };
      default:          return { color: "bg-gray-500/20 text-gray-400", label: estado, icon: null };
    }
  };

  /* ─────────────────── Acciones ────────────────────────────────────── */
  const handleAprobar = (id: string) => {
    setAsientos(prev => prev.map(a => a.id === id ? { ...a, estado: "aprobado" } : a));
    toast.success("Asiento aprobado correctamente");
  };

  const handleEliminar = (id: string) => {
    setAsientos(prev => prev.filter(a => a.id !== id));
    toast.success("Asiento eliminado");
  };

  /* ── Crear ──────────────────────────────────────────────────────────── */
  const openCreate = () => {
    setForm(emptyForm);
    setEditLineas([{ cuenta: "", nombre: "", debe: 0, haber: 0 }]);
    setShowCreateModal(true);
  };

  const handleCreate = () => {
    if (!form.descripcion.trim()) { toast.error("La descripción es obligatoria"); return; }
    const debe  = editLineas.reduce((s, l) => s + (l.debe  || 0), 0);
    const haber = editLineas.reduce((s, l) => s + (l.haber || 0), 0);
    const lineas = editLineas.filter(l => l.cuenta);
    const newId = `ASI-2026-00${asientos.length + 1}`;
    setAsientos(prev => [...prev, { id: newId, ...form, estado: "borrador", debe, haber, lineas }]);
    toast.success("Asiento creado correctamente");
    setShowCreateModal(false);
  };

  /* ── Editar ─────────────────────────────────────────────────────────── */
  const openEdit = (a: Asiento) => {
    setEditingAsiento(a);
    setForm({ descripcion: a.descripcion, referencia: a.referencia, tipo: a.tipo, fecha: a.fecha });
    setEditLineas(a.lineas.map(l => ({ ...l })));
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!form.descripcion.trim()) { toast.error("La descripción es obligatoria"); return; }
    const debe  = editLineas.reduce((s, l) => s + (l.debe  || 0), 0);
    const haber = editLineas.reduce((s, l) => s + (l.haber || 0), 0);
    const lineas = editLineas.filter(l => l.cuenta);
    setAsientos(prev => prev.map(a => a.id === editingAsiento!.id ? { ...a, ...form, debe, haber, lineas } : a));
    toast.success("Asiento actualizado correctamente");
    setShowEditModal(false);
    setEditingAsiento(null);
  };

  /* ── Ver detalle ────────────────────────────────────────────────────── */
  const openView = (a: Asiento) => { setViewingAsiento(a); setShowViewModal(true); };

  /* ── Líneas del formulario ─────────────────────────────────────────── */
  const addLinea = () => setEditLineas(prev => [...prev, { cuenta: "", nombre: "", debe: 0, haber: 0 }]);
  const removeLinea = (i: number) => setEditLineas(prev => prev.filter((_, idx) => idx !== i));
  const updateLinea = (i: number, field: keyof Linea, value: string | number) => {
    setEditLineas(prev => prev.map((l, idx) => {
      if (idx !== i) return l;
      if (field === "cuenta") {
        const found = CUENTAS_DISPONIBLES.find(c => c.codigo === value);
        return { ...l, cuenta: String(value), nombre: found ? found.nombre : l.nombre };
      }
      return { ...l, [field]: value };
    }));
  };

  /* ── Estilos ──────────────────────────────────────────────────────── */
  const ic  = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const lbl = `block mb-1.5 text-sm font-medium ${isLight ? "text-gray-700" : "text-white"}`;
  const card = `rounded-xl p-4 ${isLight ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`;
  const div = `border-t ${isLight ? "border-gray-200" : "border-white/10"}`;
  const opt = "bg-[#0D1B2A]";
  const modalBg = `${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`;

  const metrics = [
    { label: "Total Asientos", value: asientos.length, icon: <BookOpen className="w-5 h-5 text-primary" />, bg: "bg-primary/20" },
    { label: "Aprobados",      value: asientos.filter(a => a.estado === "aprobado").length,  icon: <CheckCircle className="w-5 h-5 text-green-400" />,  bg: "bg-green-500/20"  },
    { label: "Total Debe",     value: `$${asientos.reduce((s,a)=>s+a.debe,0).toLocaleString("es-EC",{minimumFractionDigits:2})}`, icon: <ArrowUpRight   className="w-5 h-5 text-blue-400" />,   bg: "bg-blue-500/20"   },
    { label: "Total Haber",    value: `$${asientos.reduce((s,a)=>s+a.haber,0).toLocaleString("es-EC",{minimumFractionDigits:2})}`, icon: <ArrowDownRight className="w-5 h-5 text-purple-400" />, bg: "bg-purple-500/20" },
  ];

  /* ── Componente modal de formulario (compartido crear/editar) ─────── */
  const renderFormModal = (mode: "create" | "edit", onClose: () => void, onSave: () => void) => {
    const title = mode === "create" ? "Nuevo Asiento Contable" : `Editar Asiento — ${editingAsiento?.id}`;
    const lineasDebe  = editLineas.reduce((s, l) => s + (l.debe  || 0), 0);
    const lineasHaber = editLineas.reduce((s, l) => s + (l.haber || 0), 0);
    const cuadrado    = Math.abs(lineasDebe - lineasHaber) < 0.01;

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className={`w-full max-w-2xl rounded-2xl shadow-2xl border max-h-[92vh] flex flex-col ${modalBg}`}>
          {/* Header */}
          <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0 ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                {mode === "create" ? <Plus className="w-5 h-5 text-primary" /> : <Edit className="w-5 h-5 text-primary" />}
              </div>
              <h3 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>{title}</h3>
            </div>
            <button onClick={onClose} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-5 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Fecha</label>
                <input type="date" value={form.fecha} onChange={e => setForm({...form, fecha: e.target.value})} className={ic} />
              </div>
              <div>
                <label className={lbl}>Tipo</label>
                <select value={form.tipo} onChange={e => setForm({...form, tipo: e.target.value})} className={ic}>
                  {TIPOS.map(t => <option key={t} value={t} className={opt}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className={lbl}>Descripción <span className="text-red-400">*</span></label>
              <input type="text" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})}
                placeholder="Descripción del asiento" className={ic} />
            </div>
            <div>
              <label className={lbl}>Referencia</label>
              <input type="text" value={form.referencia} onChange={e => setForm({...form, referencia: e.target.value})}
                placeholder="Ej: FAC-0045" className={ic} />
            </div>

            {/* Líneas contables */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className={lbl + " mb-0"}>Líneas Contables</label>
                <button onClick={addLinea} className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Añadir línea
                </button>
              </div>

              <div className={`rounded-lg overflow-hidden border ${isLight ? "border-gray-200" : "border-white/10"}`}>
                <table className="w-full">
                  <thead>
                    <tr className={`text-xs font-semibold uppercase ${isLight ? "bg-gray-50 text-gray-500" : "bg-[#0D1B2A] text-gray-400"}`}>
                      <th className="px-3 py-2 text-left">Cuenta</th>
                      <th className="px-3 py-2 text-right">Debe</th>
                      <th className="px-3 py-2 text-right">Haber</th>
                      <th className="px-2 py-2"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {editLineas.map((l, i) => (
                      <tr key={i} className={`border-t ${isLight ? "border-gray-100" : "border-white/5"}`}>
                        <td className="px-3 py-2">
                          <select value={l.cuenta} onChange={e => updateLinea(i, "cuenta", e.target.value)}
                            className={`w-full text-xs px-2 py-1.5 border rounded-lg focus:outline-none focus:border-primary ${isLight ? "bg-white border-gray-300 text-gray-800" : "bg-[#0f1825] border-white/10 text-white"}`}>
                            <option value="" className={opt}>— Seleccionar —</option>
                            {CUENTAS_DISPONIBLES.map(c => (
                              <option key={c.codigo} value={c.codigo} className={opt}>{c.codigo} — {c.nombre}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" step="0.01" min="0" value={l.debe || ""}
                            onChange={e => updateLinea(i, "debe", parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className={`w-24 text-xs text-right px-2 py-1.5 border rounded-lg focus:outline-none focus:border-primary font-mono ${isLight ? "bg-white border-gray-300 text-gray-800" : "bg-[#0f1825] border-white/10 text-white"}`} />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" step="0.01" min="0" value={l.haber || ""}
                            onChange={e => updateLinea(i, "haber", parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className={`w-24 text-xs text-right px-2 py-1.5 border rounded-lg focus:outline-none focus:border-primary font-mono ${isLight ? "bg-white border-gray-300 text-gray-800" : "bg-[#0f1825] border-white/10 text-white"}`} />
                        </td>
                        <td className="px-2 py-2">
                          <button onClick={() => removeLinea(i)}
                            className={`p-1 rounded transition-colors text-gray-400 ${isLight ? "hover:text-red-600 hover:bg-red-50" : "hover:text-red-400 hover:bg-red-500/10"}`}>
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    <tr className={`border-t ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.03]"}`}>
                      <td className="px-3 py-2">
                        <span className={`text-xs font-semibold ${isLight ? "text-gray-700" : "text-gray-300"}`}>Totales</span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className="text-xs font-bold font-mono text-blue-400">${lineasDebe.toFixed(2)}</span>
                      </td>
                      <td className="px-3 py-2 text-right">
                        <span className="text-xs font-bold font-mono text-purple-400">${lineasHaber.toFixed(2)}</span>
                      </td>
                      <td className="px-2 py-2">
                        {cuadrado
                          ? <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                          : <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {!cuadrado && editLineas.some(l => l.cuenta) && (
                <p className="text-xs text-yellow-500 mt-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> El asiento no está balanceado (Debe ≠ Haber)
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={`border-t px-5 py-4 flex justify-end gap-3 flex-shrink-0 ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <button onClick={onClose}
              className={`px-5 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}>
              Cancelar
            </button>
            <button onClick={onSave}
              className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
              <Save className="w-4 h-4" /> {mode === "create" ? "Crear Asiento" : "Guardar Cambios"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ── Modal vista detalle ─────────────────────────────────────────────── */
  const renderViewModal = (a: Asiento) => {
    const info = estadoInfo(a.estado);
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className={`w-full max-w-xl rounded-2xl shadow-2xl border ${modalBg}`}>
          {/* Header */}
          <div className={`flex items-center justify-between px-5 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>{a.id}</h3>
                <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{a.fecha} — {a.tipo}</p>
              </div>
            </div>
            <button onClick={() => setShowViewModal(false)} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5 space-y-4">
            {/* Info básica */}
            <div className={`p-4 rounded-xl ${isLight ? "bg-gray-50 border border-gray-200" : "bg-white/5 border border-white/10"}`}>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { l: "Descripción", v: a.descripcion },
                  { l: "Referencia",  v: a.referencia },
                  { l: "Tipo",        v: a.tipo },
                  { l: "Estado",      v: null },
                ].map(({ l, v }) => (
                  <div key={l}>
                    <p className="text-gray-400 text-xs mb-0.5">{l}</p>
                    {v ? (
                      <p className={`text-sm font-medium ${isLight ? "text-gray-800" : "text-gray-200"}`}>{v}</p>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${info.color}`}>
                        {info.icon}{info.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Líneas */}
            <div className={`rounded-xl overflow-hidden border ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider ${isLight ? "bg-gray-50 text-gray-500 border-b border-gray-200" : "bg-[#0D1B2A] text-gray-400 border-b border-white/10"}`}>
                Líneas Contables
              </div>
              <table className="w-full">
                <tbody>
                  {a.lineas.map((l, i) => (
                    <tr key={i} className={`border-b ${isLight ? "border-gray-50 hover:bg-gray-50" : "border-white/5 hover:bg-white/[0.02]"}`}>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs font-mono ${isLight ? "text-primary" : "text-primary"}`}>{l.cuenta}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-300"}`}>{l.nombre}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {l.debe > 0
                          ? <span className="text-sm font-mono font-medium text-blue-400">${l.debe.toLocaleString("es-EC",{minimumFractionDigits:2})}</span>
                          : <span className="text-gray-400 text-sm">—</span>}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {l.haber > 0
                          ? <span className="text-sm font-mono font-medium text-purple-400">${l.haber.toLocaleString("es-EC",{minimumFractionDigits:2})}</span>
                          : <span className="text-gray-400 text-sm">—</span>}
                      </td>
                    </tr>
                  ))}
                  <tr className={`${isLight ? "bg-gray-50 border-t border-gray-200" : "bg-white/[0.03] border-t border-white/10"}`}>
                    <td colSpan={2} className="px-4 py-2.5">
                      <span className={`text-xs font-bold uppercase ${isLight ? "text-gray-600" : "text-gray-300"}`}>Total</span>
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold font-mono text-blue-400">
                      ${a.debe.toLocaleString("es-EC",{minimumFractionDigits:2})}
                    </td>
                    <td className="px-4 py-2.5 text-right font-bold font-mono text-purple-400">
                      ${a.haber.toLocaleString("es-EC",{minimumFractionDigits:2})}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Balance indicator */}
            <div className={`flex items-center justify-between px-4 py-3 rounded-lg ${a.debe === a.haber ? isLight ? "bg-green-50 border border-green-200" : "bg-green-500/10 border border-green-500/20" : "bg-yellow-500/10 border border-yellow-500/20"}`}>
              <span className={`text-sm font-medium ${a.debe === a.haber ? "text-green-500" : "text-yellow-500"}`}>
                {a.debe === a.haber ? "✔ Asiento balanceado" : "⚠ Asiento no balanceado"}
              </span>
              <div className="flex gap-2">
                <button onClick={() => { setShowViewModal(false); printAsiento(a); }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
                  <Printer className="w-3.5 h-3.5" /> Imprimir
                </button>
                <button onClick={() => { setShowViewModal(false); openEdit(a); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Editar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════ RENDER ═══════════════════════════════ */
  return (
    <div className="space-y-6">
      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map(m => (
          <AccountingKpiCard key={m.label} label={m.label} value={m.value} icon={m.icon} iconBg={m.bg} />
        ))}
      </div>

      <div className={div} />

      {/* Acciones */}
      <div className="flex justify-end gap-2">
        <button onClick={() => downloadJournalCSV(filtered)}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
        <button onClick={() => printJournal(filtered)}
          className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
          <Printer className="w-4 h-4" /> Imprimir Lista
        </button>
        <button onClick={openCreate}
          className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium flex items-center gap-2 text-sm shadow-lg shadow-primary/20 transition-colors">
          <Plus className="w-4 h-4" /> Nuevo Asiento
        </button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Buscar asientos..." value={search} onChange={e => setSearch(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${isLight ? "text-gray-900" : "text-white"}`} />
        </div>
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[150px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${isLight ? "text-gray-700" : "text-gray-300"}`}>
            <option value="all" className={opt}>Todos los tipos</option>
            {TIPOS.map(t => <option key={t} value={t} className={opt}>{t}</option>)}
          </select>
        </div>
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[150px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={filterEstado} onChange={e => setFilterEstado(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${isLight ? "text-gray-700" : "text-gray-300"}`}>
            <option value="all" className={opt}>Todos los estados</option>
            <option value="aprobado"  className={opt}>Aprobado</option>
            <option value="pendiente" className={opt}>Pendiente</option>
            <option value="borrador"  className={opt}>Borrador</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className={`rounded-xl overflow-hidden border ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${isLight ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-[#0D1B2A] border-white/10 text-gray-400"}`}>
                <th className="px-4 py-3 w-8"></th>
                <th className="px-4 py-3 text-left">Asiento</th>
                <th className="px-4 py-3 text-left">Descripción</th>
                <th className="px-4 py-3 text-center">Tipo</th>
                <th className="px-4 py-3 text-right">Debe</th>
                <th className="px-4 py-3 text-right">Haber</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? filtered.map(asiento => {
                const info  = estadoInfo(asiento.estado);
                const isExp = expandedId === asiento.id;

                return [
                  <tr key={asiento.id}
                    className={`border-b transition-colors ${isExp ? isLight ? "bg-primary/5 border-primary/20" : "bg-primary/10 border-primary/20" : isLight ? "hover:bg-gray-50 border-gray-100" : "hover:bg-white/[0.04] border-white/5"}`}>
                    <td className="px-3 py-3">
                      <button onClick={() => setExpandedId(isExp ? null : asiento.id)}
                        className={`p-1 rounded transition-colors ${isExp ? "text-primary" : isLight ? "text-gray-400 hover:text-gray-600" : "text-gray-500 hover:text-gray-300"}`}>
                        {isExp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-mono font-medium text-primary">{asiento.id}</p>
                      <p className={`text-xs ${isLight ? "text-gray-400" : "text-gray-500"}`}>{asiento.fecha}</p>
                    </td>
                    <td className="px-4 py-3 max-w-[240px]">
                      <p className={`text-sm truncate ${isLight ? "text-gray-800" : "text-gray-200"}`}>{asiento.descripcion}</p>
                      <p className={`text-xs ${isLight ? "text-gray-400" : "text-gray-500"}`}>Ref: {asiento.referencia}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${isLight ? "bg-blue-50 text-blue-600 border border-blue-200" : "bg-blue-500/10 text-blue-400"}`}>
                        {asiento.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-medium font-mono ${isLight ? "text-gray-800" : "text-gray-200"}`}>
                        ${asiento.debe.toLocaleString("es-EC",{minimumFractionDigits:2})}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-medium font-mono ${isLight ? "text-gray-800" : "text-gray-200"}`}>
                        ${asiento.haber.toLocaleString("es-EC",{minimumFractionDigits:2})}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${info.color}`}>
                        {info.icon}{info.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        {/* Ver */}
                        <button onClick={() => openView(asiento)} title="Ver detalle"
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-primary hover:bg-primary/10" : "hover:text-primary hover:bg-primary/10"}`}>
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* Editar */}
                        <button onClick={() => openEdit(asiento)} title="Editar"
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-blue-600 hover:bg-blue-50" : "hover:text-blue-400 hover:bg-blue-500/10"}`}>
                          <Edit className="w-4 h-4" />
                        </button>
                        {/* Aprobar */}
                        {asiento.estado !== "aprobado" && (
                          <button onClick={() => handleAprobar(asiento.id)} title="Aprobar"
                            className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-green-600 hover:bg-green-50" : "hover:text-green-400 hover:bg-green-500/10"}`}>
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        {/* Imprimir */}
                        <button onClick={() => printAsiento(asiento)} title="Imprimir asiento"
                          className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}>
                          <Printer className="w-4 h-4" />
                        </button>
                        {/* Eliminar borrador */}
                        {asiento.estado === "borrador" && (
                          <button onClick={() => { if(confirm("¿Eliminar este asiento?")) handleEliminar(asiento.id); }} title="Eliminar borrador"
                            className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-red-600 hover:bg-red-50" : "hover:text-red-400 hover:bg-red-500/10"}`}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>,

                  isExp && (
                    <tr key={`${asiento.id}-lineas`}>
                      <td colSpan={8} className={`px-0 py-0 border-b ${isLight ? "border-primary/10" : "border-primary/10"}`}>
                        <div className={isLight ? "bg-primary/[0.02]" : "bg-primary/[0.05]"}>
                          <table className="w-full">
                            <thead>
                              <tr className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "text-gray-400 bg-primary/5" : "text-gray-500 bg-primary/5"}`}>
                                <th className="pl-14 pr-4 py-2 text-left">Código</th>
                                <th className="px-4 py-2 text-left">Cuenta Contable</th>
                                <th className="px-4 py-2 text-right">Debe</th>
                                <th className="px-4 py-2 text-right">Haber</th>
                              </tr>
                            </thead>
                            <tbody>
                              {asiento.lineas.map((l, i) => (
                                <tr key={i} className={`${i < asiento.lineas.length - 1 ? isLight ? "border-b border-primary/5" : "border-b border-primary/5" : ""}`}>
                                  <td className="pl-14 pr-4 py-2.5">
                                    <span className="font-mono text-xs text-primary">{l.cuenta}</span>
                                  </td>
                                  <td className="px-4 py-2.5">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
                                      <span className={`text-sm ${isLight ? "text-gray-700" : "text-gray-200"}`}>{l.nombre}</span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-2.5 text-right">
                                    {l.debe > 0
                                      ? <span className={`text-sm font-mono font-medium ${isLight ? "text-blue-600" : "text-blue-400"}`}>${l.debe.toLocaleString("es-EC",{minimumFractionDigits:2})}</span>
                                      : <span className="text-gray-400 text-sm">—</span>}
                                  </td>
                                  <td className="px-4 py-2.5 text-right">
                                    {l.haber > 0
                                      ? <span className={`text-sm font-mono font-medium ${isLight ? "text-purple-600" : "text-purple-400"}`}>${l.haber.toLocaleString("es-EC",{minimumFractionDigits:2})}</span>
                                      : <span className="text-gray-400 text-sm">—</span>}
                                  </td>
                                </tr>
                              ))}
                              <tr className={`${isLight ? "bg-gray-50 border-t border-gray-200" : "bg-white/[0.03] border-t border-white/10"}`}>
                                <td colSpan={2} className="pl-14 pr-4 py-2">
                                  <span className={`text-xs font-semibold uppercase ${isLight ? "text-gray-500" : "text-gray-400"}`}>Total</span>
                                </td>
                                <td className={`px-4 py-2 text-right text-sm font-mono font-bold ${isLight ? "text-blue-600" : "text-blue-400"}`}>
                                  ${asiento.debe.toLocaleString("es-EC",{minimumFractionDigits:2})}
                                </td>
                                <td className={`px-4 py-2 text-right text-sm font-mono font-bold ${isLight ? "text-purple-600" : "text-purple-400"}`}>
                                  ${asiento.haber.toLocaleString("es-EC",{minimumFractionDigits:2})}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  ),
                ];
              }) : (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <BookOpen className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                    <p className="text-gray-400 text-sm">No se encontraron asientos contables</p>
                  </td>
                </tr>
              )}
            </tbody>
            {filtered.length > 0 && (
              <tfoot>
                <tr className={`border-t text-sm font-semibold ${isLight ? "bg-gray-50 border-gray-200 text-gray-700" : "bg-[#0D1B2A] border-white/10 text-white"}`}>
                  <td colSpan={4} className="px-4 py-3 text-right">Totales del período:</td>
                  <td className="px-4 py-3 text-right font-mono text-blue-400">
                    ${totalDebe.toLocaleString("es-EC",{minimumFractionDigits:2})}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-purple-400">
                    ${totalHaber.toLocaleString("es-EC",{minimumFractionDigits:2})}
                  </td>
                  <td colSpan={2} className="px-4 py-3 text-center">
                    {totalDebe === totalHaber
                      ? <span className="text-green-400 text-xs flex items-center justify-center gap-1"><CheckCircle className="w-3 h-3" /> Balanceado</span>
                      : <span className="text-red-400 text-xs">Diferencia: ${Math.abs(totalDebe - totalHaber).toFixed(2)}</span>}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Modales */}
      {showCreateModal && renderFormModal("create", () => setShowCreateModal(false), handleCreate)}
      {showEditModal   && renderFormModal("edit",   () => { setShowEditModal(false); setEditingAsiento(null); }, handleSaveEdit)}
      {showViewModal   && viewingAsiento && renderViewModal(viewingAsiento)}
    </div>
  );
}