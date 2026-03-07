import { useState } from "react";
import { Download, Printer, Search, X, Save, Trash2, Eye, Pencil, Plus, Filter, FileText, Calendar, Tag, Hash, Building2, AlertCircle } from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";
import { DateRangePicker } from "./date-range-picker";
import { useAccounting, type Asiento, type AsientoLinea, type OrigenAsiento } from "../contexts/accounting-context";
import { printAsiento, printJournal, downloadJournalCSV } from "../utils/print-download";
import { DatePicker } from "./date-picker-range";

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
];

const TIPOS = ["Ajuste", "Cierre", "Corrección", "Reclasificación", "Otro"];

const origenLabel = (origen: OrigenAsiento): string => {
  if (origen === "ventas") return "Ventas";
  if (origen === "compras") return "Compras";
  if (origen === "inventario") return "Inventario";
  if (origen === "nomina") return "Nómina";
  if (origen === "pos") return "POS";
  return "Manual";
};

export function JournalContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { asientos, addAsiento, updateAsiento } = useAccounting();

  const [search, setSearch] = useState("");
  const [filterOrigen, setFilterOrigen] = useState("all");
  const [fechaDesde, setFechaDesde] = useState("2026-01-01");
  const [fechaHasta, setFechaHasta] = useState("2026-03-31");

  // Modal crear/editar
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ descripcion: "", referencia: "", tipo: "Ajuste", fecha: "2026-03-06" });
  const [editLineas, setEditLineas] = useState<AsientoLinea[]>([]);

  // Modal ver
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingAsiento, setViewingAsiento] = useState<Asiento | null>(null);

  const filtered = asientos.filter(a => {
    const q = search.toLowerCase();
    const matchQ = a.id.toLowerCase().includes(q) || a.descripcion.toLowerCase().includes(q);
    const matchO = filterOrigen === "all" || (filterOrigen === "manual" ? !a.autoGenerado : a.origen === filterOrigen);
    const matchF = (!fechaDesde || a.fecha >= fechaDesde) && (!fechaHasta || a.fecha <= fechaHasta);
    return matchQ && matchO && matchF;
  });

  const totalDebe = filtered.reduce((s, a) => s + a.debe, 0);
  const totalHaber = filtered.reduce((s, a) => s + a.haber, 0);
  const fmt = (v: number) => `$${v.toLocaleString("es-EC", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const openCreate = () => {
    setEditingId(null);
    setForm({ descripcion: "", referencia: "", tipo: "Ajuste", fecha: "2026-03-06" });
    setEditLineas([{ cuenta: "", nombre: "", debe: 0, haber: 0 }]);
    setShowFormModal(true);
  };

  const openEdit = (a: Asiento) => {
    setEditingId(a.id);
    setForm({ descripcion: a.descripcion, referencia: a.referencia, tipo: a.tipo, fecha: a.fecha });
    setEditLineas(a.lineas.map(l => ({ ...l })));
    setShowFormModal(true);
  };

  const handleSave = () => {
    if (!form.descripcion.trim()) { toast.error("La descripción es obligatoria"); return; }
    const lineas = editLineas.filter(l => l.cuenta);
    const debe = lineas.reduce((s, l) => s + (l.debe || 0), 0);
    const haber = lineas.reduce((s, l) => s + (l.haber || 0), 0);
    if (editingId) {
      updateAsiento(editingId, { ...form, debe, haber, lineas });
      toast.success("Asiento actualizado");
    } else {
      addAsiento({ ...form, estado: "borrador", origen: "manual", autoGenerado: false, debe, haber, lineas });
      toast.success("Asiento creado");
    }
    setShowFormModal(false);
  };

  const addLinea = () => setEditLineas(p => [...p, { cuenta: "", nombre: "", debe: 0, haber: 0 }]);
  const removeLinea = (i: number) => setEditLineas(p => p.filter((_, idx) => idx !== i));
  const updateLinea = (i: number, field: keyof AsientoLinea, value: string | number) =>
    setEditLineas(p => p.map((l, idx) => {
      if (idx !== i) return l;
      if (field === "cuenta") {
        const f = CUENTAS_DISPONIBLES.find(c => c.codigo === value);
        return { ...l, cuenta: String(value), nombre: f ? f.nombre : l.nombre };
      }
      return { ...l, [field]: value };
    }));

  const openView = (a: Asiento) => { setViewingAsiento(a); setShowViewModal(true); };

  const txt = isLight ? "text-gray-900" : "text-white";
  const sub = isLight ? "text-gray-500" : "text-gray-400";
  const card = `rounded-lg border ${isLight ? "bg-white border-gray-200" : "bg-white/[0.03] border-white/10"}`;
  const inp = `px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const opt = "bg-[#0D1B2A]";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`flex items-start justify-between gap-4 pb-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
        <div>
          <h2 className={`text-lg font-bold ${txt}`}>Libro Diario</h2>
          <p className={`text-xs mt-0.5 ${sub}`}>
            {filtered.length} asientos · Debe: {fmt(totalDebe)} · Haber: {fmt(totalHaber)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => downloadJournalCSV(filtered)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
            <Download className="w-4 h-4" />
            CSV
          </button>
          <button onClick={() => printJournal(filtered)} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
            <Printer className="w-4 h-4" />
            Imprimir
          </button>
          <button onClick={openCreate} className="flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold transition-colors">
            <Plus className="w-4 h-4" />
            Asiento Manual
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub} pointer-events-none`} />
          <input type="text" placeholder="Buscar asiento..." value={search} onChange={e => setSearch(e.target.value)} className={`${inp} pl-10 w-full`} />
        </div>
        <div className="relative">
          <Filter className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub} pointer-events-none`} />
          <select value={filterOrigen} onChange={e => setFilterOrigen(e.target.value)} className={`${inp} pl-10 w-full appearance-none`}>
            <option value="all" className={opt}>Todos los módulos</option>
            <option value="ventas" className={opt}>Ventas</option>
            <option value="compras" className={opt}>Compras</option>
            <option value="inventario" className={opt}>Inventario</option>
            <option value="pos" className={opt}>POS</option>
            <option value="manual" className={opt}>Manual</option>
          </select>
        </div>
        <div className="col-span-1 md:col-span-2">
          <DateRangePicker dateFrom={fechaDesde} dateTo={fechaHasta} onDateFromChange={setFechaDesde} onDateToChange={setFechaHasta} />
        </div>
      </div>

      {/* Tabla */}
      <div className={card}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`${isLight ? "bg-gray-50/50 border-b border-gray-200" : "bg-white/[0.02] border-b border-white/5"}`}>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>Fecha</th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>Asiento</th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>Descripción</th>
                <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${sub}`}>Origen</th>
                <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${sub}`}>Debe</th>
                <th className={`px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider ${sub}`}>Haber</th>
                <th className={`px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider ${sub}`}>Acciones</th>
              </tr>
            </thead>
            <tbody className={isLight ? "bg-white" : ""}>
              {filtered.map((a) => (
                <tr key={a.id} className={`${isLight ? "hover:bg-gray-50/50 border-b border-gray-100" : "hover:bg-white/[0.02] border-b border-white/5"} transition-colors last:border-0`}>
                  <td className={`px-4 py-4 text-sm ${txt}`}>{a.fecha}</td>
                  <td className="px-4 py-4">
                    <span className="text-sm font-mono font-semibold text-primary">{a.id}</span>
                  </td>
                  <td className={`px-4 py-4 text-sm ${txt}`}>{a.descripcion}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${
                      a.autoGenerado 
                        ? isLight ? "bg-blue-50 text-blue-700 border border-blue-200" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : isLight ? "bg-gray-100 text-gray-700 border border-gray-200" : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                    }`}>
                      {origenLabel(a.origen)}
                    </span>
                  </td>
                  <td className={`px-4 py-4 text-right text-sm font-mono ${txt}`}>{fmt(a.debe)}</td>
                  <td className={`px-4 py-4 text-right text-sm font-mono ${txt}`}>{fmt(a.haber)}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1.5">
                      <button onClick={() => openView(a)} className={`p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${isLight ? "text-gray-400 hover:text-gray-600" : "text-gray-500 hover:text-gray-300"}`} title="Ver">
                        <Eye className="w-4 h-4" />
                      </button>
                      {!a.autoGenerado && (
                        <button onClick={() => openEdit(a)} className={`p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${isLight ? "text-gray-400 hover:text-gray-600" : "text-gray-500 hover:text-gray-300"}`} title="Editar">
                          <Pencil className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={`border-t-2 ${isLight ? "border-gray-300 bg-gray-100" : "border-white/20 bg-white/5"}`}>
                <td colSpan={5} className={`px-4 py-2.5 text-sm font-bold ${txt}`}>TOTALES</td>
                <td className={`px-4 py-2.5 text-right text-sm font-mono font-bold ${txt}`}>{fmt(totalDebe)}</td>
                <td className={`px-4 py-2.5 text-right text-sm font-mono font-bold ${txt}`}>{fmt(totalHaber)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <p className={`text-sm ${sub}`}>No se encontraron asientos</p>
          </div>
        )}
      </div>

      {/* MODAL: Crear/Editar */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-4xl rounded-xl shadow-2xl border max-h-[90vh] flex flex-col ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
            {/* Header con icono */}
            <div className={`flex items-center justify-between px-6 py-5 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <h3 className={`font-bold text-lg ${txt}`}>{editingId ? "Editar Asiento" : "Nuevo Asiento Manual"}</h3>
              </div>
              <button onClick={() => setShowFormModal(false)} className={`p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors ${sub}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              {/* Campos principales con iconos */}
              <div className="grid grid-cols-2 gap-4">
                {/* Fecha */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Fecha <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub} pointer-events-none z-10`} />
                    <input 
                      type="date" 
                      value={form.fecha} 
                      onChange={e => setForm({ ...form, fecha: e.target.value })} 
                      className={`${inp} pl-10 w-full`} 
                    />
                  </div>
                </div>

                {/* Tipo */}
                <div>
                  <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                    Tipo <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Tag className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub} pointer-events-none z-10`} />
                    <select 
                      value={form.tipo} 
                      onChange={e => setForm({ ...form, tipo: e.target.value })} 
                      className={`${inp} pl-10 w-full appearance-none`}
                    >
                      {TIPOS.map(t => <option key={t} value={t} className={opt}>{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Descripción <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FileText className={`absolute left-3 top-3 w-4 h-4 ${sub} pointer-events-none z-10`} />
                  <input 
                    type="text" 
                    value={form.descripcion} 
                    onChange={e => setForm({ ...form, descripcion: e.target.value })} 
                    placeholder="Descripción del asiento contable..." 
                    className={`${inp} pl-10 w-full`} 
                  />
                </div>
              </div>

              {/* Referencia */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isLight ? "text-gray-700" : "text-gray-300"}`}>
                  Referencia
                </label>
                <div className="relative">
                  <Hash className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub} pointer-events-none z-10`} />
                  <input 
                    type="text" 
                    value={form.referencia} 
                    onChange={e => setForm({ ...form, referencia: e.target.value })} 
                    placeholder="Ej: DOC-2026-001" 
                    className={`${inp} pl-10 w-full`} 
                  />
                </div>
              </div>

              {/* Separador */}
              <div className={`border-t pt-5 ${isLight ? "border-gray-200" : "border-white/10"}`}>
                <div className="flex items-center justify-between mb-3">
                  <label className={`text-sm font-bold ${txt}`}>Líneas Contables</label>
                  <button 
                    onClick={addLinea} 
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-primary hover:text-primary/80 font-semibold transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Añadir
                  </button>
                </div>

                <div className={`rounded-lg overflow-hidden border ${isLight ? "border-gray-200" : "border-white/10"}`}>
                  <table className="w-full">
                    <thead>
                      <tr className={`text-xs font-semibold uppercase tracking-wider ${isLight ? "bg-gray-50 text-gray-600 border-b border-gray-200" : "bg-[#0D1B2A] text-gray-400 border-b border-white/10"}`}>
                        <th className="px-4 py-3 text-left">Cuenta</th>
                        <th className="px-4 py-3 text-right w-32">Debe</th>
                        <th className="px-4 py-3 text-right w-32">Haber</th>
                        <th className="w-12"></th>
                      </tr>
                    </thead>
                    <tbody className={isLight ? "bg-white" : ""}>
                      {editLineas.map((l, i) => (
                        <tr key={i} className={`border-t ${isLight ? "border-gray-100" : "border-white/5"}`}>
                          <td className="px-4 py-2.5">
                            <select 
                              value={l.cuenta} 
                              onChange={e => updateLinea(i, "cuenta", e.target.value)} 
                              className={`w-full text-sm px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-800" : "bg-[#0f1825] border-white/10 text-white"}`}
                            >
                              <option value="" className={opt}>— Seleccionar —</option>
                              {CUENTAS_DISPONIBLES.map(c => <option key={c.codigo} value={c.codigo} className={opt}>{c.codigo} — {c.nombre}</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-2.5">
                            <input 
                              type="number" 
                              step="0.01" 
                              min="0" 
                              value={l.debe || ""} 
                              onChange={e => updateLinea(i, "debe", parseFloat(e.target.value) || 0)} 
                              placeholder="0.00" 
                              className={`w-full text-sm text-right px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono transition-all ${isLight ? "bg-white border-gray-300 text-gray-800" : "bg-[#0f1825] border-white/10 text-white"}`} 
                            />
                          </td>
                          <td className="px-4 py-2.5">
                            <input 
                              type="number" 
                              step="0.01" 
                              min="0" 
                              value={l.haber || ""} 
                              onChange={e => updateLinea(i, "haber", parseFloat(e.target.value) || 0)} 
                              placeholder="0.00" 
                              className={`w-full text-sm text-right px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono transition-all ${isLight ? "bg-white border-gray-300 text-gray-800" : "bg-[#0f1825] border-white/10 text-white"}`} 
                            />
                          </td>
                          <td className="px-3 py-2.5">
                            <button 
                              onClick={() => removeLinea(i)} 
                              className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-red-600 hover:bg-red-50" : "text-gray-500 hover:text-red-400 hover:bg-red-500/10"}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr className={`border-t-2 ${isLight ? "border-gray-300 bg-gray-50" : "border-white/20 bg-white/5"}`}>
                        <td className="px-4 py-3"><span className={`text-sm font-bold ${txt}`}>Totales</span></td>
                        <td className="px-4 py-3 text-right"><span className={`text-sm font-bold font-mono ${txt}`}>${editLineas.reduce((s, l) => s + (l.debe || 0), 0).toFixed(2)}</span></td>
                        <td className="px-4 py-3 text-right"><span className={`text-sm font-bold font-mono ${txt}`}>${editLineas.reduce((s, l) => s + (l.haber || 0), 0).toFixed(2)}</span></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Footer con botones */}
            <div className={`border-t px-6 py-4 flex justify-end gap-3 ${isLight ? "border-gray-200 bg-gray-50/50" : "border-white/10 bg-white/[0.02]"}`}>
              <button 
                onClick={() => setShowFormModal(false)} 
                className={`px-5 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${isLight ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50" : "bg-white/5 border-white/10 text-white hover:bg-white/10"}`}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSave} 
                className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-lg shadow-primary/20"
              >
                <Save className="w-4 h-4" /> Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Ver */}
      {showViewModal && viewingAsiento && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-lg shadow-xl border ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
              <div>
                <h3 className={`font-bold text-base font-mono ${txt}`}>{viewingAsiento.id}</h3>
                <p className={`text-xs mt-0.5 ${sub}`}>{viewingAsiento.fecha} · {viewingAsiento.tipo}</p>
              </div>
              <button onClick={() => setShowViewModal(false)} className={`p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/5 ${sub}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className={`text-xs font-semibold mb-1 ${sub}`}>Descripción</p>
                <p className={`text-sm ${txt}`}>{viewingAsiento.descripcion}</p>
              </div>
              <div className={`rounded-lg overflow-hidden border ${isLight ? "border-gray-200" : "border-white/10"}`}>
                <table className="w-full">
                  <thead>
                    <tr className={`text-xs font-semibold ${isLight ? "bg-gray-50 text-gray-500 border-b border-gray-200" : "bg-[#0D1B2A] text-gray-400 border-b border-white/10"}`}>
                      <th className="px-4 py-2.5 text-left">Cuenta</th>
                      <th className="px-4 py-2.5 text-left">Nombre</th>
                      <th className="px-4 py-2.5 text-right">Debe</th>
                      <th className="px-4 py-2.5 text-right">Haber</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewingAsiento.lineas.map((l, i) => (
                      <tr key={i} className={`border-t ${isLight ? "border-gray-100" : "border-white/5"}`}>
                        <td className="px-4 py-2.5"><span className="text-xs font-mono font-semibold text-primary">{l.cuenta}</span></td>
                        <td className="px-4 py-2.5"><span className={`text-sm ${txt}`}>{l.nombre}</span></td>
                        <td className="px-4 py-2.5 text-right">{l.debe > 0 ? <span className="text-sm font-mono">{fmt(l.debe)}</span> : <span className={sub}>—</span>}</td>
                        <td className="px-4 py-2.5 text-right">{l.haber > 0 ? <span className="text-sm font-mono">{fmt(l.haber)}</span> : <span className={sub}>—</span>}</td>
                      </tr>
                    ))}
                    <tr className={`border-t ${isLight ? "border-gray-200 bg-gray-50" : "border-white/10 bg-white/[0.03]"}`}>
                      <td colSpan={2} className="px-4 py-2.5"><span className={`text-xs font-bold ${txt}`}>TOTAL</span></td>
                      <td className="px-4 py-2.5 text-right"><span className="text-sm font-bold font-mono">{fmt(viewingAsiento.debe)}</span></td>
                      <td className="px-4 py-2.5 text-right"><span className="text-sm font-bold font-mono">{fmt(viewingAsiento.haber)}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-xs ${sub}`}>{viewingAsiento.autoGenerado ? "Asiento automático" : "Asiento manual"}</span>
                <div className="flex gap-2">
                  {!viewingAsiento.autoGenerado && (
                    <button onClick={() => { setShowViewModal(false); openEdit(viewingAsiento); }} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
                      <Pencil className="w-3.5 h-3.5 inline mr-1" /> Editar
                    </button>
                  )}
                  <button onClick={() => printAsiento(viewingAsiento)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-600 hover:bg-gray-50" : "border-white/10 text-gray-300 hover:bg-white/5"}`}>
                    <Printer className="w-3.5 h-3.5 inline mr-1" /> Imprimir
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}