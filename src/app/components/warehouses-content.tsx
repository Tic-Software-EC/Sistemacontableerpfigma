import { useState } from "react";
import {
  Warehouse, Search, Plus, Edit, Eye, X,
  MapPin, Building2, Hash, Package, Boxes,
  Archive, SlidersHorizontal, CheckCircle2,
  XCircle, Pencil, Trash2, AlertCircle,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { toast } from "sonner";

/* ─── tipos ────────────────────────────────────────────── */
type WType  = "general" | "refrigerado" | "materias_primas" | "productos_terminados";
type Status = "active" | "inactive";

interface WarehouseData {
  id: string;
  code: string;
  name: string;
  branchId: string;
  branchName: string;
  type: WType;
  location: string;
  capacity: string;
  manager: string;
  status: Status;
  description?: string;
}

const EMPTY: Omit<WarehouseData, "id" | "branchName"> = {
  code: "", name: "", branchId: "", type: "general",
  location: "", capacity: "", manager: "", status: "active", description: "",
};

const BRANCHES = [
  { id: "1", name: "Sucursal Principal - Centro" },
  { id: "2", name: "Sucursal Norte" },
  { id: "3", name: "Sucursal Guayaquil" },
  { id: "4", name: "Sucursal Sur" },
];

const EMPLOYEES = [
  { id: "1", name: "Luis Rodríguez",  branchId: "1" },
  { id: "2", name: "María Fernández", branchId: "1" },
  { id: "3", name: "Ana Torres",      branchId: "1" },
  { id: "4", name: "Pedro Gómez",     branchId: "2" },
  { id: "5", name: "Diana Ruiz",      branchId: "2" },
  { id: "6", name: "Carlos Morales",  branchId: "3" },
  { id: "7", name: "Jorge Sánchez",   branchId: "3" },
  { id: "8", name: "Patricia López",  branchId: "4" },
];

const TYPE_CFG: Record<WType, { label: string; dark: string; light: string }> = {
  general:             { label: "General",          dark: "bg-blue-500/15 text-blue-400 border-blue-500/30",    light: "bg-blue-50 text-blue-600 border-blue-200"    },
  refrigerado:         { label: "Refrigerado",      dark: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",    light: "bg-cyan-50 text-cyan-600 border-cyan-200"    },
  materias_primas:     { label: "Mat. Primas",      dark: "bg-purple-500/15 text-purple-400 border-purple-500/30", light: "bg-purple-50 text-purple-600 border-purple-200" },
  productos_terminados:{ label: "Prod. Terminados", dark: "bg-green-500/15 text-green-400 border-green-500/30", light: "bg-green-50 text-green-600 border-green-200" },
};

function TypeBadge({ type, isLight }: { type: WType; isLight: boolean }) {
  const cfg = TYPE_CFG[type];
  return (
    <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${isLight ? cfg.light : cfg.dark}`}>
      {cfg.label}
    </span>
  );
}

/* ─── componente ────────────────────────────────────────── */
export function WarehousesContent() {
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
  const IN    = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" : "bg-[#0f1825] border-white/10 text-white placeholder:text-gray-500"}`;
  const TA    = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none ${isLight ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" : "bg-[#0f1825] border-white/10 text-white placeholder:text-gray-500"}`;
  const OB    = "bg-[#0D1B2A]";

  /* data */
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([
    { id:"1", code:"ALM-001", name:"Almacén Principal Centro",     branchId:"1", branchName:"Sucursal Principal - Centro", type:"general",             location:"Planta Baja - Sector A", capacity:"500 m²",  manager:"Luis Rodríguez",  status:"active"   },
    { id:"2", code:"ALM-002", name:"Cámara Fría Centro",           branchId:"1", branchName:"Sucursal Principal - Centro", type:"refrigerado",          location:"Sótano - Sector B",      capacity:"150 m²",  manager:"María Fernández", status:"active"   },
    { id:"3", code:"ALM-003", name:"Almacén Norte Principal",      branchId:"2", branchName:"Sucursal Norte",              type:"general",             location:"Planta Baja",            capacity:"350 m²",  manager:"Pedro Gómez",     status:"active"   },
    { id:"4", code:"ALM-004", name:"Bodega Materias Primas",       branchId:"1", branchName:"Sucursal Principal - Centro", type:"materias_primas",      location:"Planta Alta - Sector C", capacity:"200 m²",  manager:"Ana Torres",      status:"active"   },
    { id:"5", code:"ALM-005", name:"Almacén Guayaquil",            branchId:"3", branchName:"Sucursal Guayaquil",          type:"general",             location:"Planta Baja",            capacity:"400 m²",  manager:"Carlos Morales",  status:"active"   },
    { id:"6", code:"ALM-006", name:"Almacén Prod. Terminados",     branchId:"2", branchName:"Sucursal Norte",              type:"productos_terminados", location:"Planta Alta",            capacity:"300 m²",  manager:"Diana Ruiz",      status:"inactive" },
  ]);

  /* filtros */
  const [search,       setSearch]       = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [typeFilter,   setTypeFilter]   = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  /* modal */
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [viewW,     setViewW]     = useState<WarehouseData | null>(null);
  const [editingW,  setEditingW]  = useState<WarehouseData | null>(null);
  const [formData,  setFormData]  = useState({ ...EMPTY });

  const empForBranch = EMPLOYEES.filter(e => e.branchId === formData.branchId);
  const branchName   = (id: string) => BRANCHES.find(b => b.id === id)?.name ?? "";

  const openCreate = () => {
    setModalMode("create"); setEditingW(null);
    setFormData({ ...EMPTY }); setShowModal(true);
  };
  const openEdit = (w: WarehouseData) => {
    setModalMode("edit"); setEditingW(w);
    setFormData({ code: w.code, name: w.name, branchId: w.branchId, type: w.type,
      location: w.location, capacity: w.capacity, manager: w.manager,
      status: w.status, description: w.description ?? "" });
    setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditingW(null); };

  const handleSave = () => {
    if (!formData.code.trim() || !formData.name.trim() || !formData.branchId || !formData.location.trim() || !formData.capacity.trim() || !formData.manager) {
      toast.error("Todos los campos obligatorios deben completarse"); return;
    }
    const bn = branchName(formData.branchId);
    if (modalMode === "create") {
      setWarehouses(p => [...p, { id: String(Date.now()), ...formData, branchName: bn }]);
      toast.success("Almacén creado exitosamente");
    } else if (editingW) {
      setWarehouses(p => p.map(w => w.id === editingW.id ? { ...editingW, ...formData, branchName: bn } : w));
      toast.success("Almacén actualizado exitosamente");
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (!confirm("¿Eliminar este almacén?")) return;
    setWarehouses(p => p.filter(w => w.id !== id));
    toast.success("Almacén eliminado");
  };

  const filtered = warehouses.filter(w => {
    const q = search.toLowerCase();
    const ms = !q || w.code.toLowerCase().includes(q) || w.name.toLowerCase().includes(q) || w.branchName.toLowerCase().includes(q) || w.manager.toLowerCase().includes(q);
    const mb = branchFilter === "all" || w.branchId === branchFilter;
    const mt = typeFilter   === "all" || w.type      === typeFilter;
    const me = statusFilter === "all" || w.status    === statusFilter;
    return ms && mb && mt && me;
  });

  /* métricas */
  const metrics = [
    { label: "Total Almacenes", value: warehouses.length,                               icon: <Warehouse    className="w-5 h-5 text-primary"    />, bg: "bg-primary/15"     },
    { label: "Activos",         value: warehouses.filter(w => w.status==="active").length,   icon: <CheckCircle2 className="w-5 h-5 text-green-500" />, bg: "bg-green-500/15"  },
    { label: "Inactivos",       value: warehouses.filter(w => w.status==="inactive").length, icon: <XCircle     className="w-5 h-5 text-red-500"   />, bg: "bg-red-500/15"    },
    { label: "Sucursales",      value: [...new Set(warehouses.map(w => w.branchId))].length, icon: <Building2   className="w-5 h-5 text-blue-500"  />, bg: "bg-blue-500/15"   },
  ];

  /* ── render ── */
  return (
    <div className="space-y-6 w-full">

      <div className={`border-t ${divB}`} />

      {/* MÉTRICAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className={`rounded-xl border p-4 flex items-center justify-between ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"}`}>
            <div>
              <p className={`text-xs mb-1 ${sub}`}>{m.label}</p>
              <p className={`font-bold text-2xl ${txt}`}>{m.value}</p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.bg}`}>{m.icon}</div>
          </div>
        ))}
      </div>

      <div className={`border-t ${divB}`} />

      {/* BOTÓN */}
      <div className="flex justify-end">
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Nuevo Almacén
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col sm:flex-row gap-2">
        {/* Búsqueda */}
        <div className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Buscar almacén..." value={search}
            onChange={e => setSearch(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${txt}`} />
        </div>
        {/* Sucursal */}
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[190px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${sub}`}>
            <option value="all" className={OB}>Todas las sucursales</option>
            {BRANCHES.map(b => <option key={b.id} value={b.id} className={OB}>{b.name}</option>)}
          </select>
        </div>
        {/* Tipo */}
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[170px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${sub}`}>
            <option value="all"              className={OB}>Todos los tipos</option>
            <option value="general"          className={OB}>General</option>
            <option value="refrigerado"      className={OB}>Refrigerado</option>
            <option value="materias_primas"  className={OB}>Materias Primas</option>
            <option value="productos_terminados" className={OB}>Prod. Terminados</option>
          </select>
        </div>
        {/* Estado */}
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[150px] ${isLight ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${sub}`}>
            <option value="all"      className={OB}>Todos los estados</option>
            <option value="active"   className={OB}>Activo</option>
            <option value="inactive" className={OB}>Inactivo</option>
          </select>
        </div>
      </div>

      {/* TABLA */}
      <div className={`rounded-xl overflow-hidden border ${tWrap}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${tHead}`}>
                <th className="px-4 py-3 text-left">Código</th>
                <th className="px-4 py-3 text-left">Almacén</th>
                <th className="px-4 py-3 text-left">Sucursal</th>
                <th className="px-4 py-3 text-center">Tipo</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${tDiv}`}>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-14 text-center">
                    <Warehouse className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                    <p className={`text-sm ${sub}`}>No se encontraron almacenes</p>
                  </td>
                </tr>
              ) : filtered.map(w => (
                <tr key={w.id} className={`transition-colors ${rowHv}`}>
                  {/* Código */}
                  <td className="px-4 py-3">
                    <span className={`text-sm font-mono font-medium ${isLight ? "text-gray-600" : "text-gray-300"}`}>{w.code}</span>
                  </td>
                  {/* Nombre */}
                  <td className="px-4 py-3">
                    <p className={`text-sm font-semibold ${txt}`}>{w.name}</p>
                  </td>
                  {/* Sucursal */}
                  <td className="px-4 py-3">
                    <span className={`text-sm ${sub}`}>{w.branchName}</span>
                  </td>
                  {/* Tipo */}
                  <td className="px-4 py-3 text-center">
                    <TypeBadge type={w.type} isLight={isLight} />
                  </td>
                  {/* Estado */}
                  <td className="px-4 py-3 text-center">
                    {w.status === "active" ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${isLight ? "bg-green-100 text-green-700" : "bg-green-500/15 text-green-400"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />Activo
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${isLight ? "bg-gray-100 text-gray-500" : "bg-white/5 text-gray-500"}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />Inactivo
                      </span>
                    )}
                  </td>
                  {/* Acciones */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setViewW(w)} title="Ver detalle"
                        className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/10"}`}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(w)} title="Editar"
                        className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-primary hover:bg-primary/10" : "text-gray-400 hover:text-primary hover:bg-primary/10"}`}>
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(w.id)} title="Eliminar"
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

      {/* INFO */}
      <div className={`rounded-xl border p-4 flex gap-3 ${isLight ? "bg-blue-50 border-blue-200" : "bg-blue-500/5 border-blue-500/20"}`}>
        <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
        <ul className={`text-xs space-y-1 ${isLight ? "text-blue-700" : "text-gray-400"}`}>
          <li>• Cada almacén pertenece a una sucursal y tiene un responsable asignado</li>
          <li>• Puede activar o desactivar almacenes sin eliminarlos del sistema</li>
        </ul>
      </div>

      {/* ═══════════════════════════════════
          MODAL VER DETALLE
      ════════════════════════════════════ */}
      {viewW && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl border ${MB}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${divB}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Warehouse className="w-4 h-4 text-primary" />
                </div>
                <p className={`font-bold text-base ${txt}`}>{viewW.name}</p>
              </div>
              <button onClick={() => setViewW(null)} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              {/* Badges */}
              <div className="flex gap-2 flex-wrap">
                <TypeBadge type={viewW.type} isLight={isLight} />
                {viewW.status === "active"
                  ? <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${isLight ? "bg-green-50 text-green-700 border-green-200" : "bg-green-500/15 text-green-400 border-green-500/30"}`}><span className="w-1.5 h-1.5 rounded-full bg-green-500" />Activo</span>
                  : <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium border ${isLight ? "bg-gray-100 text-gray-500 border-gray-200" : "bg-white/5 text-gray-400 border-white/10"}`}><span className="w-1.5 h-1.5 rounded-full bg-gray-400" />Inactivo</span>
                }
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Código",      value: viewW.code       },
                  { label: "Sucursal",    value: viewW.branchName },
                  { label: "Ubicación",   value: viewW.location   },
                  { label: "Capacidad",   value: viewW.capacity   },
                ].map(r => (
                  <div key={r.label} className={`rounded-lg p-3 border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <p className={`text-xs mb-1 ${sub}`}>{r.label}</p>
                    <p className={`text-sm font-semibold ${txt}`}>{r.value}</p>
                  </div>
                ))}
              </div>

              <div className={`rounded-lg p-3 border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                <p className={`text-xs mb-1 ${sub}`}>Responsable</p>
                <p className={`text-sm font-semibold ${txt}`}>{viewW.manager}</p>
              </div>

              {viewW.description && (
                <div className={`rounded-lg p-3 border ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
                  <p className={`text-xs mb-1 ${sub}`}>Descripción</p>
                  <p className={`text-sm ${lbl}`}>{viewW.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════
          MODAL CREAR / EDITAR
      ════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl shadow-2xl max-h-[92vh] flex flex-col border ${MB}`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0 ${divB}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Warehouse className="w-4 h-4 text-primary" />
                </div>
                <p className={`font-bold text-base ${txt}`}>{modalMode === "create" ? "Nuevo Almacén" : "Editar Almacén"}</p>
              </div>
              <button onClick={closeModal} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">

              {/* Código + Nombre */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Código <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="ALM-001" value={formData.code}
                    onChange={e => setFormData(p => ({ ...p, code: e.target.value }))} className={IN} />
                </div>
                <div className="col-span-2">
                  <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Nombre <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="Ej: Almacén Principal" value={formData.name}
                    onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} className={IN} />
                </div>
              </div>

              {/* Sucursal + Tipo */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Sucursal <span className="text-red-400">*</span></label>
                  <select value={formData.branchId}
                    onChange={e => setFormData(p => ({ ...p, branchId: e.target.value, manager: "" }))}
                    className={IN}>
                    <option value="" className={OB}>— Selecciona —</option>
                    {BRANCHES.map(b => <option key={b.id} value={b.id} className={OB}>{b.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Tipo <span className="text-red-400">*</span></label>
                  <select value={formData.type}
                    onChange={e => setFormData(p => ({ ...p, type: e.target.value as WType }))}
                    className={IN}>
                    <option value="general"             className={OB}>General</option>
                    <option value="refrigerado"         className={OB}>Refrigerado</option>
                    <option value="materias_primas"     className={OB}>Materias Primas</option>
                    <option value="productos_terminados"className={OB}>Productos Terminados</option>
                  </select>
                </div>
              </div>

              {/* Ubicación + Capacidad */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Ubicación Física <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="Ej: Planta Baja - Sector A" value={formData.location}
                    onChange={e => setFormData(p => ({ ...p, location: e.target.value }))} className={IN} />
                </div>
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Capacidad <span className="text-red-400">*</span></label>
                  <input type="text" placeholder="Ej: 500 m²" value={formData.capacity}
                    onChange={e => setFormData(p => ({ ...p, capacity: e.target.value }))} className={IN} />
                </div>
              </div>

              {/* Responsable */}
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Responsable <span className="text-red-400">*</span></label>
                <select value={formData.manager}
                  onChange={e => setFormData(p => ({ ...p, manager: e.target.value }))}
                  className={IN} disabled={!formData.branchId}>
                  <option value="" className={OB}>{formData.branchId ? "— Selecciona responsable —" : "— Primero selecciona la sucursal —"}</option>
                  {empForBranch.map(e => <option key={e.id} value={e.name} className={OB}>{e.name}</option>)}
                </select>
                {formData.branchId && empForBranch.length === 0 && (
                  <p className="text-yellow-400 text-xs mt-1">No hay empleados registrados en esta sucursal</p>
                )}
              </div>

              {/* Descripción */}
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Descripción <span className={sub}>(opcional)</span></label>
                <textarea rows={2} placeholder="Observaciones del almacén..." value={formData.description ?? ""}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} className={TA} />
              </div>

              {/* Estado — solo edición */}
              {modalMode === "edit" && (
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Estado</label>
                  <select value={formData.status}
                    onChange={e => setFormData(p => ({ ...p, status: e.target.value as Status }))}
                    className={IN}>
                    <option value="active"   className={OB}>Activo</option>
                    <option value="inactive" className={OB}>Inactivo</option>
                  </select>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`flex gap-3 px-5 py-4 border-t flex-shrink-0 ${divB}`}>
              <button onClick={closeModal}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white"}`}>
                Cancelar
              </button>
              <button onClick={handleSave}
                className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20">
                {modalMode === "create" ? "Crear Almacén" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}