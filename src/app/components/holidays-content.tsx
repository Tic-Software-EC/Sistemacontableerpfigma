import { useState } from "react";
import {
  Calendar, Plus, Trash2, Pencil, Eye,
  Building2, Search, X, CheckCircle,
  PartyPopper, AlertCircle, SlidersHorizontal,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: "nacional" | "local" | "religioso" | "comercial" | "otro";
  sucursales: string[];
  description: string;
  isObligatory: boolean;
}

const SUCURSALES = [
  { id: "suc-001", name: "Sucursal Principal - Centro" },
  { id: "suc-002", name: "Sucursal Norte" },
  { id: "suc-003", name: "Sucursal Guayaquil" },
  { id: "suc-004", name: "Sucursal Sur" },
];

const HOLIDAY_TYPES: { value: Holiday["type"]; label: string; lightCls: string; darkCls: string }[] = [
  { value: "nacional",  label: "Nacional",  lightCls: "bg-blue-100 border-blue-300 text-blue-700",     darkCls: "bg-blue-500/15 border-blue-500/30 text-blue-400"   },
  { value: "local",     label: "Local",     lightCls: "bg-green-100 border-green-300 text-green-700",  darkCls: "bg-green-500/15 border-green-500/30 text-green-400" },
  { value: "religioso", label: "Religioso", lightCls: "bg-purple-100 border-purple-300 text-purple-700",darkCls: "bg-purple-500/15 border-purple-500/30 text-purple-400"},
  { value: "comercial", label: "Comercial", lightCls: "bg-orange-100 border-orange-300 text-orange-700",darkCls: "bg-orange-500/15 border-orange-500/30 text-orange-400"},
  { value: "otro",      label: "Otro",      lightCls: "bg-gray-100 border-gray-300 text-gray-600",      darkCls: "bg-gray-500/15 border-gray-500/30 text-gray-400"   },
];

const EMPTY_FORM: Omit<Holiday, "id"> = {
  name: "", date: "", type: "nacional", sucursales: [], description: "", isObligatory: true,
};

function formatDate(ds: string) {
  const d = new Date(ds + "T00:00:00");
  return d.toLocaleDateString("es-EC", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function formatDateShort(ds: string) {
  const d = new Date(ds + "T00:00:00");
  return d.toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" });
}

function getTypeCfg(type: string) {
  return HOLIDAY_TYPES.find(t => t.value === type) ?? HOLIDAY_TYPES[4];
}

function getSucName(id: string) {
  return SUCURSALES.find(s => s.id === id)?.name ?? id;
}

export function HolidaysContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const txt   = isLight ? "text-gray-900"  : "text-white";
  const sub   = isLight ? "text-gray-500"  : "text-gray-400";
  const lbl   = isLight ? "text-gray-600"  : "text-gray-300";
  const divB  = isLight ? "border-gray-200" : "border-white/10";
  const tHead = isLight ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-white/5 border-white/10 text-gray-400";
  const tDiv  = isLight ? "divide-gray-100" : "divide-white/5";
  const tWrap = isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10";
  const rowHv = isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.04]";
  const MB    = isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10";
  const IN    = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" : "bg-[#0f1825] border-white/10 text-white placeholder:text-gray-500"}`;
  const TA    = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none ${isLight ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" : "bg-[#0f1825] border-white/10 text-white placeholder:text-gray-500"}`;
  const OB    = "bg-[#0D1B2A]";

  const [holidays, setHolidays] = useState<Holiday[]>([
    { id: "1", name: "Año Nuevo",        date: "2026-01-01", type: "nacional",  sucursales: ["suc-001","suc-002","suc-003","suc-004"], description: "Celebración de año nuevo",        isObligatory: true  },
    { id: "2", name: "Día del Trabajo",  date: "2026-05-01", type: "nacional",  sucursales: ["suc-001","suc-002","suc-003","suc-004"], description: "Día internacional del trabajador", isObligatory: true  },
    { id: "3", name: "Fiestas de Quito", date: "2026-12-06", type: "local",     sucursales: ["suc-001","suc-002","suc-004"],           description: "Festividades locales de Quito",   isObligatory: false },
  ]);

  const [searchTerm,  setSearchTerm]  = useState("");
  const [typeFilter,  setTypeFilter]  = useState("all");
  const [showModal,   setShowModal]   = useState(false);
  const [modalMode,   setModalMode]   = useState<"create" | "edit">("create");
  const [editingH,    setEditingH]    = useState<Holiday | null>(null);
  const [viewH,       setViewH]       = useState<Holiday | null>(null);
  const [formData,    setFormData]    = useState<Omit<Holiday, "id">>({ ...EMPTY_FORM });

  const openCreate = () => {
    setModalMode("create");
    setFormData({ ...EMPTY_FORM });
    setShowModal(true);
  };

  const openEdit = (h: Holiday) => {
    setModalMode("edit");
    setEditingH(h);
    setFormData({ name: h.name, date: h.date, type: h.type, sucursales: [...h.sucursales], description: h.description, isObligatory: h.isObligatory });
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingH(null); };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.date || formData.sucursales.length === 0) {
      toast.error("Nombre, fecha y al menos una sucursal son obligatorios");
      return;
    }
    if (modalMode === "create") {
      setHolidays(prev => [...prev, { id: Date.now().toString(), ...formData }]);
      toast.success("Día festivo creado");
    } else if (editingH) {
      setHolidays(prev => prev.map(h => h.id === editingH.id ? { ...editingH, ...formData } : h));
      toast.success("Día festivo actualizado");
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este día festivo?")) return;
    setHolidays(prev => prev.filter(h => h.id !== id));
    toast.success("Día festivo eliminado");
  };

  const toggleSuc = (id: string) => {
    setFormData(p => ({
      ...p,
      sucursales: p.sucursales.includes(id) ? p.sucursales.filter(s => s !== id) : [...p.sucursales, id],
    }));
  };

  const filtered = holidays
    .filter(h => {
      const ms = h.name.toLowerCase().includes(searchTerm.toLowerCase());
      const mt = typeFilter === "all" || h.type === typeFilter;
      return ms && mt;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const metricCards = [
    { label: "Total festivos",  value: holidays.length,                            icon: <PartyPopper className="w-5 h-5 text-primary" />,       iconBg: "bg-primary/15"     },
    { label: "Nacionales",      value: holidays.filter(h => h.type === "nacional").length, icon: <Calendar className="w-5 h-5 text-blue-500" />,  iconBg: "bg-blue-500/15"   },
    { label: "Locales",         value: holidays.filter(h => h.type === "local").length,    icon: <Building2 className="w-5 h-5 text-green-500" />, iconBg: "bg-green-500/15"  },
    { label: "Obligatorios",    value: holidays.filter(h => h.isObligatory).length,        icon: <AlertCircle className="w-5 h-5 text-red-500" />, iconBg: "bg-red-500/15"    },
  ];

  return (
    <div className="space-y-6 w-full">

      {/* TÍTULO */}
      <div>
        <h2 className={`font-bold text-3xl mb-1 flex items-center gap-3 ${txt}`}>
          <Calendar className="w-8 h-8 text-primary" />
          Días Festivos
        </h2>
        <p className={`text-sm ${sub}`}>Gestione los días festivos y feriados por sucursal</p>
      </div>

      <div className={`border-t ${divB}`} />

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map(m => (
          <div key={m.label} className={`rounded-xl border p-4 flex items-center justify-between ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"}`}>
            <div>
              <p className={`text-xs mb-1 ${sub}`}>{m.label}</p>
              <p className={`font-bold text-2xl ${txt}`}>{m.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.iconBg}`}>{m.icon}</div>
          </div>
        ))}
      </div>

      {/* LÍNEA INFERIOR */}
      <div className={`border-t ${divB}`} />

      {/* BOTÓN */}
      <div className="flex justify-end">
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Nuevo Festivo
        </button>
      </div>

      {/* BÚSQUEDA + FILTRO */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Buscar día festivo..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${txt}`} />
        </div>
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[200px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${sub}`}>
            <option value="all" className={OB}>Todos los tipos</option>
            {HOLIDAY_TYPES.map(t => <option key={t.value} value={t.value} className={OB}>{t.label}</option>)}
          </select>
        </div>
      </div>

      {/* TABLA */}
      <div className={`rounded-xl overflow-hidden border ${tWrap}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${tHead}`}>
                <th className="px-4 py-3 text-left">Festivo</th>
                <th className="px-4 py-3 text-left">Descripción</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-center">Tipo</th>
                <th className="px-4 py-3 text-center">Sucursales</th>
                <th className="px-4 py-3 text-center">Obligatorio</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${tDiv}`}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center">
                    <Calendar className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                    <p className={`text-sm ${sub}`}>No se encontraron días festivos</p>
                  </td>
                </tr>
              ) : filtered.map(h => {
                const tc = getTypeCfg(h.type);
                const typeBadge = isLight ? tc.lightCls : tc.darkCls;
                return (
                  <tr key={h.id} className={`transition-colors ${rowHv}`}>
                    {/* Nombre */}
                    <td className="px-4 py-3">
                      <p className={`text-sm font-semibold ${txt}`}>{h.name}</p>
                    </td>
                    {/* Descripción */}
                    <td className="px-4 py-3">
                      <p className={`text-sm ${sub}`}>{h.description || <span className="italic opacity-50">—</span>}</p>
                    </td>
                    {/* Fecha */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-sm capitalize ${sub}`}>{formatDateShort(h.date)}</span>
                    </td>
                    {/* Tipo */}
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${typeBadge}`}>{tc.label}</span>
                    </td>
                    {/* Sucursales */}
                    <td className="px-4 py-3 text-center">
                      {h.sucursales.length === SUCURSALES.length ? (
                        <span className={`text-xs font-medium ${isLight ? "text-blue-600" : "text-blue-400"}`}>Todas</span>
                      ) : (
                        <span className={`text-xs font-medium ${txt}`}>{h.sucursales.length} sucursal{h.sucursales.length !== 1 ? "es" : ""}</span>
                      )}
                    </td>
                    {/* Obligatorio */}
                    <td className="px-4 py-3 text-center">
                      {h.isObligatory ? (
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${isLight ? "bg-red-100 text-red-700" : "bg-red-500/15 text-red-400"}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" />Sí
                        </span>
                      ) : (
                        <span className={`text-xs ${sub}`}>No</span>
                      )}
                    </td>
                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setViewH(h)} title="Ver detalle"
                          className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/10"}`}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEdit(h)} title="Editar"
                          className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-primary hover:bg-primary/10" : "text-gray-400 hover:text-primary hover:bg-primary/10"}`}>
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(h.id)} title="Eliminar"
                          className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-red-600 hover:bg-red-50" : "text-gray-400 hover:text-red-400 hover:bg-white/10"}`}>
                          <Trash2 className="w-4 h-4" />
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

      {/* INFO */}
      <div className={`rounded-xl border p-4 flex gap-3 ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/5 border-blue-500/20"}`}>
        <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <ul className={`text-xs space-y-1 ${isLight ? "text-blue-700" : "text-gray-400"}`}>
          <li>• Los días obligatorios no permiten laborar y afectan el cálculo de nómina</li>
          <li>• Puede configurar diferentes festivos para cada sucursal de forma independiente</li>
        </ul>
      </div>

      {/* ── MODAL VER DETALLE ── */}
      {viewH && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl border ${MB}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${divB}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center">
                  <PartyPopper className="w-4 h-4 text-primary" />
                </div>
                <p className={`font-bold text-base ${txt}`}>{viewH.name}</p>
              </div>
              <button onClick={() => setViewH(null)} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-lg p-3 border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <p className={`text-xs mb-1 ${sub}`}>Fecha</p>
                  <p className={`text-sm font-semibold ${txt} capitalize`}>{formatDate(viewH.date)}</p>
                </div>
                <div className={`rounded-lg p-3 border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <p className={`text-xs mb-1 ${sub}`}>Tipo</p>
                  <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${isLight ? getTypeCfg(viewH.type).lightCls : getTypeCfg(viewH.type).darkCls}`}>{getTypeCfg(viewH.type).label}</span>
                </div>
              </div>
              {viewH.description && (
                <div className={`rounded-lg p-3 border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <p className={`text-xs mb-1 ${sub}`}>Descripción</p>
                  <p className={`text-sm ${lbl}`}>{viewH.description}</p>
                </div>
              )}
              <div className={`rounded-lg p-3 border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <p className={`text-xs mb-2 ${sub}`}>Sucursales</p>
                <div className="flex flex-wrap gap-1.5">
                  {viewH.sucursales.map(sid => (
                    <span key={sid} className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs border ${isLight ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-blue-500/10 border-blue-500/20 text-blue-300"}`}>
                      <Building2 className="w-3 h-3" />{getSucName(sid)}
                    </span>
                  ))}
                </div>
              </div>
              {viewH.isObligatory && (
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isLight ? "bg-red-50 border-red-200 text-red-700" : "bg-red-500/10 border-red-500/20 text-red-400"}`}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-xs font-medium">Descanso obligatorio — no se puede laborar este día</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CREAR/EDITAR ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl max-h-[92vh] flex flex-col border ${MB}`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0 ${divB}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-primary" />
                </div>
                <p className={`font-bold text-base ${txt}`}>{modalMode === "create" ? "Nuevo Día Festivo" : "Editar Día Festivo"}</p>
              </div>
              <button onClick={closeModal} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Nombre + Fecha */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Nombre <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.name} placeholder="Ej: Año Nuevo"
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className={IN} />
                </div>
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Fecha <span className="text-red-400">*</span></label>
                  <input type="date" value={formData.date}
                    onChange={e => setFormData(p => ({ ...p, date: e.target.value }))} className={IN} />
                </div>
              </div>

              {/* Tipo */}
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Tipo</label>
                <select value={formData.type} onChange={e => setFormData(p => ({ ...p, type: e.target.value as Holiday["type"] }))} className={IN}>
                  {HOLIDAY_TYPES.map(t => <option key={t.value} value={t.value} className={OB}>{t.label}</option>)}
                </select>
              </div>

              {/* Descripción */}
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Descripción</label>
                <textarea rows={2} value={formData.description} placeholder="Descripción opcional..."
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className={TA} />
              </div>

              {/* Obligatorio */}
              <label className="flex items-center gap-3 cursor-pointer">
                <button type="button" onClick={() => setFormData(p => ({ ...p, isObligatory: !p.isObligatory }))}
                  className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors ${formData.isObligatory ? "bg-primary border-primary" : isLight ? "border-gray-300" : "border-gray-600"}`}>
                  {formData.isObligatory && <CheckCircle className="w-3 h-3 text-white" />}
                </button>
                <span className={`text-sm ${lbl}`}>Descanso obligatorio (no se puede laborar)</span>
              </label>

              {/* Sucursales */}
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Sucursal <span className="text-red-400">*</span></label>
                <select
                  value={formData.sucursales.length === SUCURSALES.length ? "all" : formData.sucursales[0] ?? ""}
                  onChange={e => {
                    const val = e.target.value;
                    if (val === "all") setFormData(p => ({ ...p, sucursales: SUCURSALES.map(s => s.id) }));
                    else setFormData(p => ({ ...p, sucursales: val ? [val] : [] }));
                  }}
                  className={IN}>
                  <option value="" className={OB}>— Selecciona una sucursal —</option>
                  <option value="all" className={OB}>Todas las sucursales</option>
                  {SUCURSALES.map(s => <option key={s.id} value={s.id} className={OB}>{s.name}</option>)}
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className={`px-5 py-4 border-t flex gap-3 flex-shrink-0 ${divB}`}>
              <button onClick={closeModal}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white"}`}>
                Cancelar
              </button>
              <button onClick={handleSave}
                disabled={!formData.name.trim() || !formData.date || formData.sucursales.length === 0}
                className="flex-1 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors">
                {modalMode === "create" ? "Crear Festivo" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}