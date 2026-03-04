import { useState } from "react";
import {
  Printer, Plus, Search, Edit2, Trash2, X, Save,
  Building2, Hash, FileText, AlertTriangle, ToggleLeft, ToggleRight, Filter, Eye,
  LayoutGrid, CheckCircle2, Star, Monitor,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { usePuntosEmision, PuntoEmision, TipoDoc } from "../contexts/punto-emision-context";
import { useSucursales } from "../contexts/sucursal-context";

const TIPOS_DOC: { id: TipoDoc; label: string; short: string }[] = [
  { id: "FAC",     label: "Factura",                short: "FAC" },
  { id: "LIQ",     label: "Liquidación de Compra",  short: "LIQ" },
  { id: "NOT_DEB", label: "Nota de Débito",          short: "N/D" },
  { id: "NOT_CRE", label: "Nota de Crédito",         short: "N/C" },
  { id: "RET",     label: "Comprobante de Retención",short: "RET" },
  { id: "GRE",     label: "Guía de Remisión",        short: "GRE" },
];

const EMPTY_SEC: Record<TipoDoc, number> = {
  FAC: 1, LIQ: 1, NOT_DEB: 1, NOT_CRE: 1, RET: 1, GRE: 1,
};

function fmtNum(v: string) { return v.replace(/\D/g, "").slice(0, 3); }

export function PuntoEmisionContent() {
  const { theme } = useTheme();
  const isLight = theme === "light";
  const { puntos: data, setPuntos: setData } = usePuntosEmision();
  const { sucursales, activeSucursales } = useSucursales();

  const [search,       setSearch]       = useState("");
  const [filterSuc,    setFilterSuc]    = useState("todos");
  const [showModal,    setShowModal]    = useState(false);
  const [editItem,     setEditItem]     = useState<PuntoEmision | null>(null);
  const [deleteItem,   setDeleteItem]   = useState<PuntoEmision | null>(null);
  const [viewItem,     setViewItem]     = useState<PuntoEmision | null>(null);

  const [form, setForm] = useState({
    sucursalId:     "",
    establecimiento: "",
    puntoEmision:   "001",
    descripcion:    "",
    tiposDocumento: ["FAC"] as TipoDoc[],
    secuenciales:   { ...EMPTY_SEC },
    responsable:    "",
    ambiente:       "2" as "1" | "2",
  });

  // Estilos
  const txt  = isLight ? "text-gray-900"  : "text-white";
  const sub  = isLight ? "text-gray-500"  : "text-gray-400";
  const lbl  = isLight ? "text-gray-600"  : "text-gray-300";
  const divB = isLight ? "border-gray-200": "border-white/10";
  const card = `rounded-xl border ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"}`;
  const IN   = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400" : "bg-[#0f1825] border-white/10 text-white placeholder-gray-500"}`;
  const OB   = isLight ? "" : "bg-[#0D1B2A]";

  const getSucursal  = (id: string) => sucursales.find(s => s.id === id);
  const filtered = data.filter(d => {
    const term = search.toLowerCase();
    const suc  = getSucursal(d.sucursalId);
    const matchSearch =
      d.descripcion.toLowerCase().includes(term) ||
      d.establecimiento.includes(term) ||
      d.puntoEmision.includes(term) ||
      (suc?.name ?? "").toLowerCase().includes(term);
    const matchSuc = filterSuc === "todos" || d.sucursalId === filterSuc;
    return matchSearch && matchSuc;
  });

  const stats = {
    total:          data.length,
    activos:        data.filter(d => d.activo).length,
    sucursalesUsed: [...new Set(data.map(d => d.sucursalId))].length,
    produccion:     data.filter(d => d.ambiente === "2").length,
  };

  // Cuando se elige sucursal → hereda el establecimiento
  const handleSucursalChange = (sucursalId: string) => {
    const suc = getSucursal(sucursalId);
    setForm(f => ({
      ...f,
      sucursalId,
      establecimiento: suc?.establecimiento ?? "",
    }));
  };

  const openCreate = () => {
    setEditItem(null);
    const firstSuc = activeSucursales[0];
    setForm({
      sucursalId:     firstSuc?.id ?? "",
      establecimiento: firstSuc?.establecimiento ?? "",
      puntoEmision:   "001",
      descripcion:    "",
      tiposDocumento: ["FAC"],
      secuenciales:   { ...EMPTY_SEC },
      responsable:    "",
      ambiente:       "2",
    });
    setShowModal(true);
  };

  const openEdit = (item: PuntoEmision) => {
    setEditItem(item);
    setForm({
      sucursalId:     item.sucursalId,
      establecimiento: item.establecimiento,
      puntoEmision:   item.puntoEmision,
      descripcion:    item.descripcion,
      tiposDocumento: [...item.tiposDocumento],
      secuenciales:   { ...item.secuenciales },
      responsable:    item.responsable,
      ambiente:       item.ambiente,
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.descripcion || !form.sucursalId || !form.puntoEmision) return;
    const suc = getSucursal(form.sucursalId);
    const payload = { ...form, establecimiento: suc?.establecimiento ?? form.establecimiento };
    if (editItem) {
      setData(data.map(d => d.id === editItem.id ? { ...d, ...payload } : d));
    } else {
      setData([...data, { id: Date.now().toString(), ...payload, activo: true }]);
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (!deleteItem) return;
    setData(data.filter(d => d.id !== deleteItem.id));
    setDeleteItem(null);
  };

  const toggleActivo = (id: string) =>
    setData(data.map(d => d.id === id ? { ...d, activo: !d.activo } : d));

  const toggleTipo = (tipo: TipoDoc) => {
    const has = form.tiposDocumento.includes(tipo);
    setForm({ ...form, tiposDocumento: has ? form.tiposDocumento.filter(t => t !== tipo) : [...form.tiposDocumento, tipo] });
  };

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>{label}</label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 w-full">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Printer className="w-8 h-8 text-primary" />
          <h2 className={`font-bold text-3xl ${txt}`}>Puntos de Emisión</h2>
        </div>
        <p className={`text-sm ${sub}`}>
          Configura los puntos de emisión por sucursal · cada punto hereda el establecimiento SRI de su sucursal
        </p>
      </div>

      <div className={`border-t ${divB}`} />

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total puntos",    val: stats.total,          icon: <LayoutGrid   className="w-5 h-5 text-primary" />,      bg: "bg-primary/20"    },
          { label: "Activos",         val: stats.activos,        icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,    bg: "bg-green-500/20"  },
          { label: "Sucursales c/PT", val: stats.sucursalesUsed, icon: <Star         className="w-5 h-5 text-yellow-400" />,   bg: "bg-yellow-500/20" },
          { label: "En Producción",   val: stats.produccion,     icon: <Monitor      className="w-5 h-5 text-blue-400" />,     bg: "bg-blue-500/20"   },
        ].map(m => (
          <div key={m.label} className={`${card} p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">{m.label}</p>
                <p className={`font-bold text-2xl ${isLight ? "text-gray-900" : "text-white"}`}>{m.val}</p>
              </div>
              <div className={`w-10 h-10 ${m.bg} rounded-lg flex items-center justify-center`}>{m.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={`border-t ${divB}`} />

      {/* Aviso si hay sucursales sin puntos */}
      {activeSucursales.some(s => !data.find(d => d.sucursalId === s.id)) && (
        null
      )}

      {/* Acción */}
      <div className="flex justify-end">
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Nuevo Punto de Emisión
        </button>
      </div>

      {/* Búsqueda + filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-lg border text-sm ${isLight ? "bg-white border-gray-300" : "bg-[#0f1825] border-white/10"}`}>
          <Search className={`w-4 h-4 flex-shrink-0 ${sub}`} />
          <input type="text" placeholder="Buscar por descripción, sucursal, punto…" value={search}
            onChange={e => setSearch(e.target.value)}
            className={`flex-1 bg-transparent outline-none ${txt} placeholder:text-gray-500`} />
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${isLight ? "bg-white border-gray-300" : "bg-[#0f1825] border-white/10"}`}>
          <Filter className={`w-4 h-4 ${sub}`} />
          <select value={filterSuc} onChange={e => setFilterSuc(e.target.value)} className={`bg-transparent outline-none ${txt} text-sm`}>
            <option value="todos" className={OB}>Todas las sucursales</option>
            {sucursales.map(s => (
              <option key={s.id} value={s.id} className={OB}>{s.establecimiento} — {s.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className={`${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${divB} ${isLight ? "bg-gray-50" : "bg-white/[0.03]"}`}>
                {["Prefijo SRI", "Descripción", "Sucursal", "Ambiente", "Estado", "Acciones"].map(h => (
                  <th key={h} className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${divB}`}>
              {filtered.map(item => {
                const suc = getSucursal(item.sucursalId);
                return (
                  <tr key={item.id} className={`transition-colors ${isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]"}`}>
                    {/* Prefijo SRI unificado */}
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-sm font-mono font-medium ${isLight ? "text-gray-500" : "text-gray-400"}`}>
                        {item.establecimiento}-{item.puntoEmision}
                      </span>
                    </td>
                    {/* Descripción */}
                    <td className="px-4 py-3">
                      <p className={`text-sm font-medium ${txt}`}>{item.descripcion}</p>
                    </td>
                    {/* Sucursal */}
                    <td className="px-4 py-3">
                      <p className={`text-sm ${txt}`}>{suc?.name ?? <span className="text-yellow-400 text-xs">Sin sucursal</span>}</p>
                    </td>
                    {/* Ambiente */}
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        item.ambiente === "2"
                          ? isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400"
                          : isLight ? "bg-yellow-100 text-yellow-700" : "bg-yellow-500/20 text-yellow-400"
                      }`}>
                        {item.ambiente === "2" ? "Producción" : "Pruebas"}
                      </span>
                    </td>
                    {/* Estado */}
                    <td className="px-4 py-3">
                      <button onClick={() => toggleActivo(item.id)} className="flex items-center gap-1.5 transition-colors">
                        {item.activo
                          ? <><ToggleRight className="w-5 h-5 text-primary" /><span className="text-xs font-medium text-primary">Activo</span></>
                          : <><ToggleLeft className={`w-5 h-5 ${sub}`} /><span className={`text-xs font-medium ${sub}`}>Inactivo</span></>
                        }
                      </button>
                    </td>
                    {/* Acciones */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewItem(item)} className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`} title="Ver detalle">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => openEdit(item)} className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`} title="Editar">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteItem(item)} className={`p-1.5 rounded-lg transition-colors text-gray-400 ${isLight ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`} title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Printer className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                    <p className={`text-sm font-medium ${txt}`}>No se encontraron puntos de emisión</p>
                    <p className={`text-xs mt-1 ${sub}`}>Intenta con otros términos o crea uno nuevo</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info SRI */}
      <div className={`${card} p-4 flex gap-3`}>
        <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className={`text-sm font-medium ${txt}`}>Numeración según formato SRI</p>
          <p className={`text-xs mt-0.5 ${sub}`}>
            El número se compone de: <span className="text-primary font-mono font-semibold">001-001-000000001</span> (Establecimiento – Punto de Emisión – Secuencial de 9 dígitos). El establecimiento es heredado automáticamente de la Sucursal.
          </p>
        </div>
      </div>

      {/* ══ MODAL VER DETALLE ══ */}
      {viewItem && (() => {
        const suc = getSucursal(viewItem.sucursalId);
        return (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
              {/* Header */}
              <div className={`flex items-center justify-between px-6 py-4 border-b ${divB}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                    <Printer className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className={`font-bold text-base ${txt}`}>{viewItem.descripcion}</p>
                    <p className="text-primary font-mono font-bold text-sm tracking-widest">
                      {viewItem.establecimiento}-{viewItem.puntoEmision}
                    </p>
                  </div>
                </div>
                <button onClick={() => setViewItem(null)} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-4 space-y-4">
                {/* Fila sucursal + ambiente */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-xl p-3 border ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/[0.03] border-white/5"}`}>
                    <p className={`text-xs mb-1 ${sub}`}>Sucursal</p>
                    <p className={`text-sm font-semibold ${txt}`}>{suc?.name ?? "—"}</p>
                    <p className={`text-xs font-mono mt-0.5 ${sub}`}>{suc?.code}</p>
                  </div>
                  <div className={`rounded-xl p-3 border ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/[0.03] border-white/5"}`}>
                    <p className={`text-xs mb-1 ${sub}`}>Establecimiento SRI</p>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-sm font-bold font-mono ${isLight ? "bg-primary/10 text-primary" : "bg-primary/20 text-primary"}`}>
                      <Building2 className="w-3.5 h-3.5" />{viewItem.establecimiento}
                    </span>
                  </div>
                </div>

                {/* Numeración completa */}
                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${isLight ? "bg-primary/5 border-primary/20" : "bg-primary/10 border-primary/20"}`}>
                  <Hash className="w-4 h-4 text-primary flex-shrink-0" />
                  <div>
                    <p className={`text-xs ${sub}`}>Prefijo del comprobante</p>
                    <p className="text-primary font-mono font-bold text-lg tracking-widest">
                      {viewItem.establecimiento}-{viewItem.puntoEmision}-
                      <span className={isLight ? "text-gray-400" : "text-gray-500"}>000000001</span>
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      viewItem.ambiente === "2"
                        ? isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400"
                        : isLight ? "bg-yellow-100 text-yellow-700" : "bg-yellow-500/20 text-yellow-400"
                    }`}>
                      {viewItem.ambiente === "2" ? "Producción" : "Pruebas"}
                    </span>
                  </div>
                </div>

                {/* Responsable + Estado */}
                <div className="grid grid-cols-2 gap-3">
                  <div className={`rounded-xl p-3 border ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/[0.03] border-white/5"}`}>
                    <p className={`text-xs mb-1 ${sub}`}>Responsable</p>
                    <p className={`text-sm font-semibold ${txt}`}>{viewItem.responsable || "—"}</p>
                  </div>
                  <div className={`rounded-xl p-3 border ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/[0.03] border-white/5"}`}>
                    <p className={`text-xs mb-1 ${sub}`}>Estado</p>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold ${viewItem.activo ? (isLight ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-400") : (isLight ? "bg-red-100 text-red-700" : "bg-red-500/20 text-red-400")}`}>
                      {viewItem.activo ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                      {viewItem.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>

                {/* Tipos de comprobante */}
                <div className={`rounded-xl p-3 border ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/[0.03] border-white/5"}`}>
                  <p className={`text-xs mb-2 ${sub}`}>Tipos de comprobante habilitados</p>
                  <div className="flex flex-wrap gap-1.5">
                    {viewItem.tiposDocumento.map(t => (
                      <span key={t} className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${isLight ? "bg-primary/10 text-primary border border-primary/20" : "bg-primary/15 text-primary border border-primary/20"}`}>
                        {TIPOS_DOC.find(d => d.id === t)?.short}
                        <span className={`font-normal ${isLight ? "text-gray-500" : "text-gray-400"}`}>· {TIPOS_DOC.find(d => d.id === t)?.label}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Secuenciales */}
                <div className={`rounded-xl p-3 border ${isLight ? "bg-gray-50 border-gray-100" : "bg-white/[0.03] border-white/5"}`}>
                  <p className={`text-xs mb-2 ${sub}`}>Secuenciales actuales</p>
                  <div className="grid grid-cols-3 gap-2">
                    {viewItem.tiposDocumento.map(t => (
                      <div key={t} className={`flex flex-col items-center px-2 py-1.5 rounded-lg ${isLight ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`}>
                        <span className={`text-[10px] font-semibold ${sub}`}>{TIPOS_DOC.find(d => d.id === t)?.short}</span>
                        <span className={`text-sm font-bold font-mono ${txt}`}>{String(viewItem.secuenciales[t]).padStart(9, "0")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className={`flex gap-3 px-6 py-4 border-t ${divB}`}>
                <button onClick={() => setViewItem(null)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white"}`}>
                  Cerrar
                </button>
                <button onClick={() => { setViewItem(null); openEdit(viewItem); }} className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                  <Edit2 className="w-4 h-4" /> Editar
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ══ MODAL CREAR / EDITAR ══ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-2xl border shadow-2xl max-h-[92vh] overflow-y-auto ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>

            <div className={`sticky top-0 flex items-center justify-between px-6 py-4 border-b ${divB} ${isLight ? "bg-white" : "bg-[#0D1B2A]"}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                  <Printer className="w-4 h-4 text-primary" />
                </div>
                <h3 className={`font-bold text-base ${txt}`}>
                  {editItem ? "Editar Punto de Emisión" : "Nuevo Punto de Emisión"}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className={`p-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100 text-gray-500" : "hover:bg-white/5 text-gray-400"}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* ── Sucursal (paso 1) ── */}
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${sub}`}>1. Selecciona la Sucursal</p>
                <Field label="Sucursal *">
                  <select
                    value={form.sucursalId}
                    onChange={e => handleSucursalChange(e.target.value)}
                    className={IN}
                    required
                  >
                    <option value="" className={OB}>— Selecciona una sucursal —</option>
                    {sucursales.filter(s => s.status === "active").map(s => (
                      <option key={s.id} value={s.id} className={OB}>
                        [{s.establecimiento}] {s.name}
                      </option>
                    ))}
                  </select>
                </Field>
                {/* Vista del establecimiento heredado */}
                {form.sucursalId && (
                  <div className={`mt-3 flex items-center gap-3 px-4 py-2.5 rounded-lg border ${isLight ? "bg-primary/5 border-primary/20" : "bg-primary/10 border-primary/20"}`}>
                    <Building2 className="w-4 h-4 text-primary" />
                    <div>
                      <p className={`text-xs ${sub}`}>Establecimiento SRI heredado de la sucursal</p>
                      <p className="text-primary font-mono font-bold text-lg tracking-widest">
                        {form.establecimiento || "—"}
                      </p>
                    </div>
                    <div className="ml-auto text-right">
                      <p className={`text-xs ${sub}`}>Prefijo del comprobante</p>
                      <p className="text-primary font-mono font-bold text-lg">
                        {form.establecimiento || "000"}-{form.puntoEmision || "000"}-
                        <span className={isLight ? "text-gray-400" : "text-gray-500"}>000000001</span>
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ── Punto de emisión (paso 2) ── */}
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${sub}`}>2. Identificación del Punto</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Punto de Emisión (3 dígitos) *">
                    <div className="relative">
                      <Hash className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                      <input
                        type="text" maxLength={3}
                        value={form.puntoEmision}
                        onChange={e => setForm({ ...form, puntoEmision: fmtNum(e.target.value) })}
                        placeholder="001"
                        className={`${IN} pl-9 font-mono`}
                      />
                    </div>
                  </Field>
                  <Field label="Responsable">
                    <input type="text" value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} placeholder="Nombre del cajero / responsable" className={IN} />
                  </Field>
                </div>
                <div className="mt-3">
                  <Field label="Descripción *">
                    <input type="text" value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })} placeholder="Ej: Caja 1 – Atención al cliente" className={IN} />
                  </Field>
                </div>
                <div className="mt-3">
                  <Field label="Ambiente">
                    <select value={form.ambiente} onChange={e => setForm({ ...form, ambiente: e.target.value as "1" | "2" })} className={IN}>
                      <option value="2" className={OB}>🟢 Producción</option>
                      <option value="1" className={OB}>🟡 Pruebas</option>
                    </select>
                  </Field>
                </div>
              </div>

              {/* ── Tipos de comprobante ── */}
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${sub}`}>3. Tipos de comprobante habilitados</p>
                <div className="grid grid-cols-2 gap-2">
                  {TIPOS_DOC.map(tipo => {
                    const active = form.tiposDocumento.includes(tipo.id);
                    return (
                      <button key={tipo.id} type="button" onClick={() => toggleTipo(tipo.id)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all ${
                          active
                            ? "border-primary bg-primary/10 text-primary"
                            : isLight ? "border-gray-200 hover:border-gray-300 text-gray-600" : "border-white/10 hover:border-white/20 text-gray-400"
                        }`}>
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${active ? "border-primary bg-primary" : isLight ? "border-gray-300" : "border-white/20"}`}>
                          {active && <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>}
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{tipo.short}</p>
                          <p className={`text-[10px] ${isLight ? "text-gray-500" : "text-gray-500"}`}>{tipo.label}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Secuenciales ── */}
              {form.tiposDocumento.length > 0 && (
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wide mb-3 ${sub}`}>4. Secuencial inicial por tipo</p>
                  <div className="grid grid-cols-2 gap-3">
                    {form.tiposDocumento.map(tipo => (
                      <Field key={tipo} label={`${TIPOS_DOC.find(d => d.id === tipo)?.label}`}>
                        <div className="relative">
                          <FileText className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                          <input
                            type="number" min={1}
                            value={form.secuenciales[tipo]}
                            onChange={e => setForm({ ...form, secuenciales: { ...form.secuenciales, [tipo]: Number(e.target.value) } })}
                            className={`${IN} pl-9 font-mono`}
                          />
                        </div>
                      </Field>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`sticky bottom-0 flex justify-end gap-3 px-6 py-4 border-t ${divB} ${isLight ? "bg-white" : "bg-[#0D1B2A]"}`}>
              <button onClick={() => setShowModal(false)} className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white"}`}>
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!form.descripcion || !form.sucursalId || !form.puntoEmision || form.tiposDocumento.length === 0}
                className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                {editItem ? "Guardar Cambios" : "Crear Punto de Emisión"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {deleteItem && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-red-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className={`font-bold text-base ${txt}`}>Eliminar punto de emisión</h3>
                <p className={`text-xs ${sub}`}>Esta acción no se puede deshacer</p>
              </div>
            </div>
            <div className={`p-4 rounded-xl border mb-5 ${isLight ? "bg-red-50 border-red-100" : "bg-red-500/5 border-red-500/20"}`}>
              <p className={`text-sm ${txt}`}>
                ¿Eliminar el punto{" "}
                <span className="font-bold text-primary">{deleteItem.establecimiento}-{deleteItem.puntoEmision}</span>{" "}
                "{deleteItem.descripcion}"? Las cajas POS asociadas perderán su punto de emisión.
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteItem(null)} className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white"}`}>
                Cancelar
              </button>
              <button onClick={handleDelete} className="inline-flex items-center gap-2 px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors">
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}