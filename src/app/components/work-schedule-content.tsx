import { useState } from "react";
import {
  Clock, Building2, Plus, Pencil, Trash2, Eye,
  X, CheckCircle, Sun, Moon, Sunset, Search,
  SlidersHorizontal, AlertCircle, CalendarDays, Settings,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

interface WorkingDaysConfig {
  lunes: boolean; martes: boolean; miercoles: boolean;
  jueves: boolean; viernes: boolean; sabado: boolean; domingo: boolean;
}

interface WorkShift {
  id: string; name: string; sucursal: string;
  workingDays: WorkingDaysConfig;
  morningStart: string; morningEnd: string;
  lunchStart: string;   lunchEnd: string;
  afternoonStart: string; afternoonEnd: string;
  // Horarios especiales fin de semana
  weekendMorningStart: string; weekendMorningEnd: string;
  weekendLunchStart: string;   weekendLunchEnd: string;
  weekendAfternoonStart: string; weekendAfternoonEnd: string;
  hasWeekendSchedule: boolean;
  enabled: boolean;
}

const SUCURSALES = [
  { id: "suc-001", name: "Sucursal Principal - Centro" },
  { id: "suc-002", name: "Sucursal Norte" },
  { id: "suc-003", name: "Sucursal Guayaquil" },
  { id: "suc-004", name: "Sucursal Sur" },
];

const DAYS: { key: keyof WorkingDaysConfig; short: string; label: string; isWeekend: boolean }[] = [
  { key: "lunes",     short: "Lu", label: "Lunes",     isWeekend: false },
  { key: "martes",    short: "Ma", label: "Martes",    isWeekend: false },
  { key: "miercoles", short: "Mi", label: "Miércoles", isWeekend: false },
  { key: "jueves",    short: "Ju", label: "Jueves",    isWeekend: false },
  { key: "viernes",   short: "Vi", label: "Viernes",   isWeekend: false },
  { key: "sabado",    short: "Sá", label: "Sábado",    isWeekend: true  },
  { key: "domingo",   short: "Do", label: "Domingo",   isWeekend: true  },
];

const DEFAULT_DAYS: WorkingDaysConfig = {
  lunes: true, martes: true, miercoles: true,
  jueves: true, viernes: true, sabado: false, domingo: false,
};

const DEFAULT_SHIFT: Omit<WorkShift, "id"> = {
  name: "", sucursal: "suc-001",
  workingDays: { ...DEFAULT_DAYS },
  morningStart: "08:00", morningEnd: "12:00",
  lunchStart: "12:00",   lunchEnd: "13:00",
  afternoonStart: "13:00", afternoonEnd: "17:00",
  weekendMorningStart: "09:00", weekendMorningEnd: "13:00",
  weekendLunchStart: "13:00",   weekendLunchEnd: "14:00",
  weekendAfternoonStart: "14:00", weekendAfternoonEnd: "17:00",
  hasWeekendSchedule: false,
  enabled: true,
};

function calcH(s: string, e: string) {
  const [sh, sm] = s.split(":").map(Number);
  const [eh, em] = e.split(":").map(Number);
  return Math.max(0, eh - sh + (em - sm) / 60);
}

function totalH(shift: WorkShift) {
  return calcH(shift.morningStart, shift.morningEnd) + calcH(shift.afternoonStart, shift.afternoonEnd);
}

function daysCount(wd: WorkingDaysConfig) { return Object.values(wd).filter(Boolean).length; }
function hasWeekend(wd: WorkingDaysConfig) { return wd.sabado || wd.domingo; }
function getSucName(id: string) { return SUCURSALES.find(s => s.id === id)?.name ?? id; }

export function WorkScheduleContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";

  const txt   = isLight ? "text-gray-900"   : "text-white";
  const sub   = isLight ? "text-gray-500"   : "text-gray-400";
  const lbl   = isLight ? "text-gray-600"   : "text-gray-300";
  const divB  = isLight ? "border-gray-200" : "border-white/10";
  const tHead = isLight ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-white/5 border-white/10 text-gray-400";
  const tDiv  = isLight ? "divide-gray-100" : "divide-white/5";
  const tWrap = isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10";
  const rowHv = isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.04]";
  const MB    = isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10";
  const IN    = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const OB    = "bg-[#0D1B2A]";
  const SEC   = `rounded-lg border p-4 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/[0.03] border-white/8"}`;

  const [shifts, setShifts] = useState<WorkShift[]>([
    { id: "1", name: "Turno Administrativo",  sucursal: "suc-001", workingDays: { lunes:true,martes:true,miercoles:true,jueves:true,viernes:true,sabado:false,domingo:false }, morningStart:"08:00",morningEnd:"12:30",lunchStart:"12:30",lunchEnd:"14:00",afternoonStart:"14:00",afternoonEnd:"18:00", weekendMorningStart:"09:00",weekendMorningEnd:"13:00",weekendLunchStart:"13:00",weekendLunchEnd:"14:00",weekendAfternoonStart:"14:00",weekendAfternoonEnd:"17:00", hasWeekendSchedule:false, enabled:true },
    { id: "2", name: "Turno Comercial",       sucursal: "suc-002", workingDays: { lunes:true,martes:true,miercoles:true,jueves:true,viernes:true,sabado:true,domingo:false },  morningStart:"10:00",morningEnd:"13:00",lunchStart:"13:00",lunchEnd:"14:00",afternoonStart:"14:00",afternoonEnd:"19:00", weekendMorningStart:"10:00",weekendMorningEnd:"14:00",weekendLunchStart:"14:00",weekendLunchEnd:"15:00",weekendAfternoonStart:"15:00",weekendAfternoonEnd:"18:00", hasWeekendSchedule:true, enabled:true },
  ]);

  const [showModal,    setShowModal]    = useState(false);
  const [editingShift, setEditingShift] = useState<WorkShift | null>(null);
  const [formData,     setFormData]    = useState<Omit<WorkShift,"id">>({ ...DEFAULT_SHIFT, workingDays: { ...DEFAULT_DAYS } });
  const [searchTerm,   setSearchTerm]  = useState("");
  const [sucFilter,    setSucFilter]   = useState("all");
  const [viewShift,    setViewShift]   = useState<WorkShift | null>(null);
  const [activeTab,    setActiveTab]   = useState<"general" | "semana" | "finde">("general");

  const filtered = shifts.filter(s => {
    const ms = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const mf = sucFilter === "all" || s.sucursal === sucFilter;
    return ms && mf;
  });

  const openNew = () => {
    setEditingShift(null);
    setFormData({ ...DEFAULT_SHIFT, workingDays: { ...DEFAULT_DAYS } });
    setActiveTab("general");
    setShowModal(true);
  };

  const openEdit = (s: WorkShift) => {
    setEditingShift(s);
    setFormData({ ...s });
    setActiveTab("general");
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.name.trim()) { toast.error("El nombre es obligatorio"); return; }
    if (editingShift) {
      setShifts(prev => prev.map(s => s.id === editingShift.id ? { id: editingShift.id, ...formData } : s));
      toast.success("Turno actualizado");
    } else {
      setShifts(prev => [...prev, { id: Date.now().toString(), ...formData }]);
      toast.success("Turno creado");
    }
    setShowModal(false);
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este turno?")) return;
    setShifts(prev => prev.filter(s => s.id !== id));
    toast.success("Turno eliminado");
  };

  const toggleEnabled = (id: string) => {
    setShifts(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const f = (k: keyof Omit<WorkShift,"id">, v: any) => setFormData(p => ({ ...p, [k]: v }));
  const toggleDay = (key: keyof WorkingDaysConfig) =>
    setFormData(p => ({ ...p, workingDays: { ...p.workingDays, [key]: !p.workingDays[key] } }));

  const weekendSelected = hasWeekend(formData.workingDays);

  const tabs = [
    { key: "general" as const, label: "General",   icon: <Settings className="w-3.5 h-3.5" /> },
    { key: "semana"  as const, label: "Sem. Laboral", icon: <Sun className="w-3.5 h-3.5" /> },
    ...(weekendSelected ? [{ key: "finde" as const, label: "Fin de Semana", icon: <CalendarDays className="w-3.5 h-3.5" /> }] : []),
  ];

  const metricCards = [
    { label: "Total turnos",    value: shifts.length,                                                                                       icon: <Clock className="w-5 h-5 text-primary" />,        iconBg: "bg-primary/15"   },
    { label: "Activos",         value: shifts.filter(s => s.enabled).length,                                                                icon: <CheckCircle className="w-5 h-5 text-green-500" />, iconBg: "bg-green-500/15" },
    { label: "Sucursales",      value: new Set(shifts.map(s => s.sucursal)).size,                                                            icon: <Building2 className="w-5 h-5 text-blue-500" />,   iconBg: "bg-blue-500/15"  },
    { label: "Horas/día prom.", value: shifts.length ? (shifts.reduce((a,s) => a + totalH(s), 0) / shifts.length).toFixed(1) + "h" : "—",  icon: <Sun className="w-5 h-5 text-amber-500" />,        iconBg: "bg-amber-500/15" },
  ];

  const TimeBlock = ({ label, icon, startK, endK, startL, endL, cls }: {
    label: string; icon: React.ReactNode; startK: keyof Omit<WorkShift,"id">; endK: keyof Omit<WorkShift,"id">; startL: string; endL: string; cls: string;
  }) => (
    <div className={`rounded-lg border p-3 ${cls}`}>
      <div className="flex items-center gap-2 mb-3">{icon}<span className="text-xs font-semibold">{label}</span></div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className={`block mb-1 text-xs ${lbl}`}>{startL}</label>
          <input type="time" value={(formData[startK] as string) ?? ""} onChange={e => f(startK, e.target.value)} className={IN} />
        </div>
        <div>
          <label className={`block mb-1 text-xs ${lbl}`}>{endL}</label>
          <input type="time" value={(formData[endK] as string) ?? ""} onChange={e => f(endK, e.target.value)} className={IN} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 w-full">

      {/* TÍTULO */}
      <div>
        <h2 className={`font-bold text-3xl mb-1 flex items-center gap-3 ${txt}`}>
          <Clock className="w-8 h-8 text-primary" />
          Horario Laboral
        </h2>
        <p className={`text-sm ${sub}`}>Configure los turnos de trabajo por sucursal</p>
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

      <div className={`border-t ${divB}`} />

      {/* BOTÓN */}
      <div className="flex justify-end">
        <button onClick={openNew}
          className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Nuevo Turno
        </button>
      </div>

      {/* BÚSQUEDA + FILTRO */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Buscar turno..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${txt}`} />
        </div>
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[220px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={sucFilter} onChange={e => setSucFilter(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${sub}`}>
            <option value="all" className={OB}>Todas las sucursales</option>
            {SUCURSALES.map(s => <option key={s.id} value={s.id} className={OB}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {/* TABLA */}
      <div className={`rounded-xl overflow-hidden border ${tWrap}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${tHead}`}>
                <th className="px-4 py-3 text-left">Turno</th>
                <th className="px-4 py-3 text-left">Sucursal</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${tDiv}`}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-14 text-center">
                    <Clock className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                    <p className={`text-sm ${sub}`}>No hay turnos configurados</p>
                  </td>
                </tr>
              ) : filtered.map(s => (
                <tr key={s.id} className={`transition-colors ${rowHv}`}>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold ${txt}`}>{s.name}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-sm ${sub}`}>{getSucName(s.sucursal)}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggleEnabled(s.id)}
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                        s.enabled
                          ? isLight ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-green-500/15 text-green-400 hover:bg-green-500/25"
                          : isLight ? "bg-gray-100 text-gray-500 hover:bg-gray-200"   : "bg-white/5 text-gray-500 hover:bg-white/10"
                      }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.enabled ? "bg-green-500" : "bg-gray-400"}`} />
                      {s.enabled ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setViewShift(s)} title="Ver detalle"
                        className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/10"}`}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(s)} title="Editar"
                        className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-primary hover:bg-primary/10" : "text-gray-400 hover:text-primary hover:bg-primary/10"}`}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(s.id)} title="Eliminar"
                        className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-red-600 hover:bg-red-50" : "text-gray-400 hover:text-red-400 hover:bg-white/10"}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AVISO */}
      <div className={`rounded-xl border p-4 flex gap-3 ${isLight ? "bg-amber-50 border-amber-200" : "bg-yellow-500/5 border-yellow-500/20"}`}>
        <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className={`text-xs ${isLight ? "text-amber-700" : "text-gray-400"}`}>
          Los tiempos de almuerzo/descanso no se contabilizan como horas laborables. Cada turno aplica según la sucursal asignada.
        </p>
      </div>

      {/* ── MODAL VER DETALLE ── */}
      {viewShift && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl border ${MB}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${divB}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <p className={`font-bold text-base ${txt}`}>{viewShift.name}</p>
              </div>
              <button onClick={() => setViewShift(null)} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg border ${isLight ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-blue-500/5 border-blue-500/20 text-blue-300"}`}>
                <Building2 className="w-3.5 h-3.5" />{getSucName(viewShift.sucursal)}
              </div>
              {/* Días */}
              <div>
                <p className={`text-xs mb-2 font-medium ${sub}`}>Días laborables</p>
                <div className="flex gap-1.5 flex-wrap">
                  {DAYS.map(d => (
                    <span key={d.key} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                      viewShift.workingDays[d.key]
                        ? d.isWeekend ? "bg-orange-500/20 text-orange-500 border border-orange-500/30" : "bg-green-500/20 text-green-500 border border-green-500/30"
                        : isLight ? "bg-gray-100 text-gray-400 border border-gray-200" : "bg-white/5 text-gray-600 border border-white/10"
                    }`}>{d.label}</span>
                  ))}
                </div>
              </div>
              {/* Horario semana */}
              <p className={`text-xs font-semibold uppercase tracking-wider pt-1 ${sub}`}>Horario Semanal</p>
              {[
                { label: "Mañana",  icon: <Sun className="w-3.5 h-3.5 text-blue-400" />,    time: `${viewShift.morningStart} – ${viewShift.morningEnd}`,     cls: isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/5 border-blue-500/20" },
                { label: "Almuerzo",icon: <Sunset className="w-3.5 h-3.5 text-orange-400" />,time: `${viewShift.lunchStart} – ${viewShift.lunchEnd}`,         cls: isLight ? "bg-orange-50 border-orange-200" : "bg-orange-500/5 border-orange-500/20" },
                { label: "Tarde",   icon: <Moon className="w-3.5 h-3.5 text-purple-400" />,  time: `${viewShift.afternoonStart} – ${viewShift.afternoonEnd}`, cls: isLight ? "bg-purple-50 border-purple-200" : "bg-purple-500/5 border-purple-500/20" },
              ].map(b => (
                <div key={b.label} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${b.cls}`}>
                  <div className="flex items-center gap-2">{b.icon}<span className={`text-xs font-medium ${lbl}`}>{b.label}</span></div>
                  <span className={`text-xs font-mono font-semibold ${txt}`}>{b.time}</span>
                </div>
              ))}
              {/* Horario fin de semana */}
              {hasWeekend(viewShift.workingDays) && viewShift.hasWeekendSchedule && (
                <>
                  <p className={`text-xs font-semibold uppercase tracking-wider pt-1 ${sub}`}>Horario Fin de Semana</p>
                  {[
                    { label: "Mañana",  icon: <Sun className="w-3.5 h-3.5 text-amber-400" />,   time: `${viewShift.weekendMorningStart} – ${viewShift.weekendMorningEnd}`,     cls: isLight ? "bg-amber-50 border-amber-200" : "bg-amber-500/5 border-amber-500/20" },
                    { label: "Almuerzo",icon: <Sunset className="w-3.5 h-3.5 text-rose-400" />,  time: `${viewShift.weekendLunchStart} – ${viewShift.weekendLunchEnd}`,         cls: isLight ? "bg-rose-50 border-rose-200" : "bg-rose-500/5 border-rose-500/20" },
                    { label: "Tarde",   icon: <Moon className="w-3.5 h-3.5 text-violet-400" />,  time: `${viewShift.weekendAfternoonStart} – ${viewShift.weekendAfternoonEnd}`, cls: isLight ? "bg-violet-50 border-violet-200" : "bg-violet-500/5 border-violet-500/20" },
                  ].map(b => (
                    <div key={b.label} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${b.cls}`}>
                      <div className="flex items-center gap-2">{b.icon}<span className={`text-xs font-medium ${lbl}`}>{b.label}</span></div>
                      <span className={`text-xs font-mono font-semibold ${txt}`}>{b.time}</span>
                    </div>
                  ))}
                </>
              )}
              <div className={`flex items-center justify-between px-3 py-2.5 rounded-lg border ${isLight ? "bg-green-50 border-green-200" : "bg-green-500/5 border-green-500/20"}`}>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-xs font-medium text-green-600">Total semanal</span></div>
                <span className="text-sm font-bold text-green-600">{(totalH(viewShift) * daysCount(viewShift.workingDays)).toFixed(1)}h</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CREAR/EDITAR CON TABS ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl flex flex-col border ${MB}`} style={{ maxHeight: "88vh" }}>

            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0 ${divB}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <p className={`font-bold text-base ${txt}`}>{editingShift ? "Editar Turno" : "Nuevo Turno"}</p>
              </div>
              <button onClick={() => setShowModal(false)} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tabs */}
            <div className={`flex border-b flex-shrink-0 ${divB} px-5`}>
              {tabs.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-1.5 px-3 py-3 text-xs font-medium border-b-2 -mb-px transition-colors ${
                    activeTab === t.key
                      ? "border-primary text-primary"
                      : `border-transparent ${sub} hover:text-gray-600`
                  }`}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">

              {/* TAB: GENERAL */}
              {activeTab === "general" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Nombre <span className="text-red-400">*</span></label>
                      <input type="text" value={formData.name} placeholder="Ej: Turno Mañana"
                        onChange={e => f("name", e.target.value)} className={IN} />
                    </div>
                    <div>
                      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Sucursal</label>
                      <select value={formData.sucursal} onChange={e => f("sucursal", e.target.value)} className={IN}>
                        {SUCURSALES.map(s => <option key={s.id} value={s.id} className={OB}>{s.name}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className={SEC}>
                    <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${sub}`}>Días laborables</p>
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map(d => (
                        <button key={d.key} type="button" onClick={() => toggleDay(d.key)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            formData.workingDays[d.key]
                              ? d.isWeekend
                                ? "bg-orange-500/20 border border-orange-500/40 text-orange-500"
                                : "bg-primary/20 border border-primary/40 text-primary"
                              : isLight ? "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                          }`}>{d.label}</button>
                      ))}
                    </div>
                    <p className={`text-xs mt-2 ${sub}`}>{daysCount(formData.workingDays)} días seleccionados
                      {weekendSelected && <span className="text-orange-500 ml-2">• Incluye fin de semana</span>}
                    </p>
                  </div>

                  {/* Horario fin de semana toggle */}
                  {weekendSelected && (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <button type="button" onClick={() => f("hasWeekendSchedule", !formData.hasWeekendSchedule)}
                        className={`w-5 h-5 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors ${formData.hasWeekendSchedule ? "bg-primary border-primary" : isLight ? "border-gray-300" : "border-gray-600"}`}>
                        {formData.hasWeekendSchedule && <CheckCircle className="w-3 h-3 text-white" />}
                      </button>
                      <span className={`text-sm ${lbl}`}>Horario diferente para fin de semana</span>
                    </label>
                  )}
                </>
              )}

              {/* TAB: SEMANA LABORAL */}
              {activeTab === "semana" && (
                <>
                  <p className={`text-xs ${sub}`}>Horario aplicado de lunes a viernes</p>
                  <TimeBlock label="Jornada Mañana"   icon={<Sun    className="w-3.5 h-3.5 text-blue-400"   />} startK="morningStart"   endK="morningEnd"   startL="Entrada" endL="Salida" cls={isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/5 border-blue-500/20"}     />
                  <TimeBlock label="Almuerzo"          icon={<Sunset className="w-3.5 h-3.5 text-orange-400" />} startK="lunchStart"     endK="lunchEnd"     startL="Inicio"  endL="Fin"    cls={isLight ? "bg-orange-50 border-orange-200" : "bg-orange-500/5 border-orange-500/20"} />
                  <TimeBlock label="Jornada Tarde"     icon={<Moon   className="w-3.5 h-3.5 text-purple-400" />} startK="afternoonStart" endK="afternoonEnd" startL="Entrada" endL="Salida" cls={isLight ? "bg-purple-50 border-purple-200" : "bg-purple-500/5 border-purple-500/20"}   />
                  <div className={`flex items-center justify-between px-3 py-2 rounded-lg border ${isLight ? "bg-green-50 border-green-200" : "bg-green-500/5 border-green-500/20"}`}>
                    <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-xs font-medium text-green-600">Horas productivas / día</span></div>
                    <span className="text-sm font-bold text-green-600">{totalH({ ...formData } as WorkShift).toFixed(1)}h</span>
                  </div>
                </>
              )}

              {/* TAB: FIN DE SEMANA */}
              {activeTab === "finde" && weekendSelected && (
                <>
                  <p className={`text-xs ${sub}`}>Horario aplicado sábado{formData.workingDays.domingo ? " y domingo" : ""}</p>
                  {formData.hasWeekendSchedule ? (
                    <>
                      <TimeBlock label="Mañana (fin de semana)"   icon={<Sun    className="w-3.5 h-3.5 text-amber-400"  />} startK="weekendMorningStart"   endK="weekendMorningEnd"   startL="Entrada" endL="Salida" cls={isLight ? "bg-amber-50 border-amber-200" : "bg-amber-500/5 border-amber-500/20"}   />
                      <TimeBlock label="Almuerzo (fin de semana)" icon={<Sunset className="w-3.5 h-3.5 text-rose-400"   />} startK="weekendLunchStart"     endK="weekendLunchEnd"     startL="Inicio"  endL="Fin"    cls={isLight ? "bg-rose-50 border-rose-200" : "bg-rose-500/5 border-rose-500/20"}       />
                      <TimeBlock label="Tarde (fin de semana)"    icon={<Moon   className="w-3.5 h-3.5 text-violet-400" />} startK="weekendAfternoonStart" endK="weekendAfternoonEnd" startL="Entrada" endL="Salida" cls={isLight ? "bg-violet-50 border-violet-200" : "bg-violet-500/5 border-violet-500/20"} />
                    </>
                  ) : (
                    <div className={`rounded-lg border p-6 text-center ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/[0.03] border-white/8"}`}>
                      <CalendarDays className={`w-8 h-8 mx-auto mb-2 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                      <p className={`text-sm ${sub}`}>Se usará el mismo horario de la semana laboral</p>
                      <button type="button" onClick={() => f("hasWeekendSchedule", true)}
                        className="mt-3 text-xs text-primary hover:text-primary/80 underline transition-colors">
                        Definir horario diferente
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            <div className={`px-5 py-4 border-t flex gap-3 flex-shrink-0 ${divB}`}>
              <button onClick={() => setShowModal(false)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white"}`}>
                Cancelar
              </button>
              <button onClick={handleSave}
                className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                {editingShift ? "Guardar Cambios" : "Crear Turno"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}