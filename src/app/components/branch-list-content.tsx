import { useState } from "react";
import {
  Building2, Search, Plus, Edit, Trash2, X,
  MapPin, Phone, Mail, User, Calendar,
  CheckCircle2, Clock, Building, Star, Filter, Eye, Hash,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { useSucursales, Sucursal } from "../contexts/sucursal-context";
import { usePuntosEmision } from "../contexts/punto-emision-context";
import { toast } from "sonner";

export function BranchListContent() {
  const { theme } = useTheme();
  const { sucursales: branches, setSucursales: setBranches } = useSucursales();
  const { puntos } = usePuntosEmision();

  const [searchTerm, setSearchTerm]       = useState("");
  const [filterType, setFilterType]       = useState("all");
  const [filterStatus, setFilterStatus]   = useState("all");
  const [showModal, setShowModal]         = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingBranch, setViewingBranch] = useState<Sucursal | null>(null);
  const [modalMode, setModalMode]         = useState<"create" | "edit">("create");
  const [selectedBranch, setSelectedBranch] = useState<Sucursal | null>(null);

  const emptyForm: Omit<Sucursal, "id"> = {
    code: "", name: "", establecimiento: "", type: "secundaria",
    address: "", city: "", province: "", phone: "", email: "",
    manager: "", openingDate: "", schedule: "", status: "active",
  };
  const [formData, setFormData] = useState(emptyForm);

  const handleOpenCreateModal = () => { setModalMode("create"); setFormData(emptyForm); setShowModal(true); };
  const handleOpenEditModal   = (b: Sucursal) => {
    setModalMode("edit"); setSelectedBranch(b);
    setFormData({ code: b.code, name: b.name, establecimiento: b.establecimiento, type: b.type, address: b.address, city: b.city, province: b.province, phone: b.phone, email: b.email, manager: b.manager, openingDate: b.openingDate, schedule: b.schedule, status: b.status });
    setShowModal(true);
  };
  const handleViewBranch  = (b: Sucursal) => { setViewingBranch(b); setShowViewModal(true); };
  const handleCloseModal  = () => { setShowModal(false); setSelectedBranch(null); };
  const handleCloseViewModal = () => { setShowViewModal(false); setViewingBranch(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === "create") {
      setBranches([...branches, { id: `s${Date.now()}`, ...formData, status: "active" }]);
      toast.success("Sucursal creada exitosamente");
    } else {
      setBranches(branches.map(b => b.id === selectedBranch?.id ? { ...b, ...formData } : b));
      toast.success("Sucursal actualizada exitosamente");
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    const puntosAsociados = puntos.filter(p => p.sucursalId === id).length;
    if (puntosAsociados > 0) {
      toast.error(`No se puede eliminar: esta sucursal tiene ${puntosAsociados} punto(s) de emisión asociado(s). Elimínalos primero.`);
      return;
    }
    if (confirm("¿Eliminar esta sucursal?")) { setBranches(branches.filter(b => b.id !== id)); toast.success("Sucursal eliminada exitosamente"); }
  };

  const handleToggleStatus = (id: string) => {
    setBranches(branches.map(b => b.id === id ? { ...b, status: b.status === "active" ? "inactive" : "active" } : b));
    const b = branches.find(x => x.id === id);
    toast.success(b?.status === "active" ? "Sucursal desactivada" : "Sucursal activada");
  };

  const filteredBranches = branches.filter(b => {
    const q = searchTerm.toLowerCase();
    const matchSearch = b.code.toLowerCase().includes(q) || b.name.toLowerCase().includes(q) || b.city.toLowerCase().includes(q) || b.manager.toLowerCase().includes(q);
    return matchSearch && (filterType === "all" || b.type === filterType) && (filterStatus === "all" || b.status === filterStatus);
  });

  // Contadores de puntos de emisión por sucursal
  const puntosCount = (id: string) => puntos.filter(p => p.sucursalId === id).length;

  const ic  = `w-full px-3 py-2 border rounded-lg text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const ici = `w-full pl-10 pr-3 py-2 border rounded-lg text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const card    = `rounded-xl p-4 ${theme === "light" ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`;
  const divider = `border-t ${theme === "light" ? "border-gray-200" : "border-white/10"}`;
  const optBg   = "bg-[#0D1B2A]";

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Building2 className="w-8 h-8 text-primary" />
          <h2 className={`font-bold text-3xl ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            Sucursales / Establecimientos
          </h2>
        </div>
        <p className="text-gray-400 text-sm">
          Gestiona las sucursales · cada una define su código de establecimiento SRI para los Puntos de Emisión
        </p>
      </div>

      <div className={divider} />

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total",       value: branches.length,                                     icon: <Building2    className="w-5 h-5 text-primary" />,     bg: "bg-primary/20"    },
          { label: "Activas",     value: branches.filter(b => b.status === "active").length,  icon: <CheckCircle2 className="w-5 h-5 text-green-400" />,   bg: "bg-green-500/20"  },
          { label: "Principal",   value: branches.filter(b => b.type === "principal").length, icon: <Star        className="w-5 h-5 text-yellow-400" />,  bg: "bg-yellow-500/20" },
          { label: "Secundarias", value: branches.filter(b => b.type === "secundaria").length,icon: <Building    className="w-5 h-5 text-blue-400" />,    bg: "bg-blue-500/20"   },
        ].map(m => (
          <div key={m.label} className={card}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs mb-1">{m.label}</p>
                <p className={`font-bold text-2xl ${theme === "light" ? "text-gray-900" : "text-white"}`}>{m.value}</p>
              </div>
              <div className={`w-10 h-10 ${m.bg} rounded-lg flex items-center justify-center`}>{m.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={divider} />

      {/* Acción */}
      <div className="flex justify-end">
        <button onClick={handleOpenCreateModal} className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2 text-sm shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Nueva Sucursal
        </button>
      </div>

      {/* Búsqueda + filtros */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 ${theme === "light" ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Buscar por código, nombre, ciudad, estab…" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
        </div>
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[148px] ${theme === "light" ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
            <option value="all" className={optBg}>Todos los tipos</option>
            <option value="principal" className={optBg}>Principal</option>
            <option value="secundaria" className={optBg}>Secundaria</option>
          </select>
        </div>
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[148px] ${theme === "light" ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
            <option value="all" className={optBg}>Todos los estados</option>
            <option value="active" className={optBg}>Activas</option>
            <option value="inactive" className={optBg}>Inactivas</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className={`rounded-xl overflow-hidden border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${theme === "light" ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-white/5 border-white/10 text-gray-400"}`}>
                <th className="px-4 py-3 text-left">Código</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-center">Estab. SRI</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-center">Puntos de Em.</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === "light" ? "divide-gray-100" : "divide-white/5"}`}>
              {filteredBranches.length > 0 ? filteredBranches.map(branch => (
                <tr key={branch.id} className={`transition-colors ${theme === "light" ? "hover:bg-gray-50" : "hover:bg-white/[0.04]"}`}>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-mono ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>{branch.code}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>{branch.name}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {branch.establecimiento
                      ? <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold font-mono ${theme === "light" ? "bg-primary/10 text-primary" : "bg-primary/20 text-primary"}`}>
                          <Hash className="w-3 h-3" />{branch.establecimiento}
                        </span>
                      : <span className="text-gray-500 text-xs">—</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                      branch.type === "principal"
                        ? theme === "light" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : "bg-yellow-500/20 text-yellow-300"
                        : theme === "light" ? "bg-blue-100 text-blue-700 border border-blue-200"   : "bg-blue-500/20 text-blue-300"
                    }`}>
                      {branch.type === "principal" ? <><Star className="w-3 h-3" />Principal</> : <><Building className="w-3 h-3" />Secundaria</>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {puntosCount(branch.id) > 0
                      ? <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${theme === "light" ? "bg-blue-100 text-blue-700" : "bg-blue-500/20 text-blue-300"}`}>
                          <Hash className="w-3 h-3" />{puntosCount(branch.id)}
                        </span>
                      : <span className="text-gray-500 text-xs">0</span>
                    }
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleToggleStatus(branch.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        branch.status === "active"
                          ? theme === "light" ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200" : "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                          : theme === "light" ? "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200"         : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                      }`}>
                      {branch.status === "active" ? <><CheckCircle2 className="w-3 h-3" />Activa</> : <><X className="w-3 h-3" />Inactiva</>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleViewBranch(branch)} title="Ver detalles"
                        className={`p-1.5 rounded-lg transition-colors text-gray-400 ${theme === "light" ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleOpenEditModal(branch)} title="Editar"
                        className={`p-1.5 rounded-lg transition-colors text-gray-400 ${theme === "light" ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(branch.id)} title="Eliminar"
                        className={`p-1.5 rounded-lg transition-colors text-gray-400 ${theme === "light" ? "hover:text-gray-700 hover:bg-gray-100" : "hover:text-gray-200 hover:bg-white/10"}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center">
                    <Building2 className={`w-10 h-10 mx-auto mb-3 ${theme === "light" ? "text-gray-300" : "text-gray-600"}`} />
                    <p className="text-gray-400 text-sm">No se encontraron sucursales</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ver Detalle */}
      {showViewModal && viewingBranch && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${theme === "light" ? "bg-white border border-gray-200" : "bg-[#0D1B2A] border border-white/10"}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${viewingBranch.type === "principal" ? "bg-yellow-500/20" : "bg-blue-500/20"}`}>
                  {viewingBranch.type === "principal" ? <Star className="w-5 h-5 text-yellow-400" /> : <Building2 className="w-5 h-5 text-blue-400" />}
                </div>
                <div>
                  <p className={`font-bold text-base ${theme === "light" ? "text-gray-900" : "text-white"}`}>{viewingBranch.name}</p>
                  <p className="text-gray-400 text-xs font-mono">{viewingBranch.code} · Estab. <strong className="text-primary">{viewingBranch.establecimiento || "—"}</strong></p>
                </div>
              </div>
              <button onClick={handleCloseViewModal} className={`p-2 rounded-lg transition-colors ${theme === "light" ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Indicador de puntos de emisión asociados */}
            <div className={`mx-5 mt-4 flex items-center gap-3 px-3 py-2 rounded-lg ${theme === "light" ? "bg-blue-50 border border-blue-100" : "bg-blue-500/10 border border-blue-500/20"}`}>
              <Hash className="w-4 h-4 text-blue-400" />
              <span className={`text-xs ${theme === "light" ? "text-blue-700" : "text-blue-300"}`}>
                <strong>{puntosCount(viewingBranch.id)}</strong> punto(s) de emisión asociado(s) a esta sucursal
              </span>
            </div>

            <div className="px-5 py-4 space-y-0">
              {[
                { icon: <MapPin className="w-4 h-4 text-primary" />,   label: "Dirección",         value: viewingBranch.address },
                { icon: <MapPin className="w-4 h-4 text-primary" />,   label: "Ciudad / Provincia", value: `${viewingBranch.city}, ${viewingBranch.province}` },
                { icon: <Phone className="w-4 h-4 text-primary" />,    label: "Teléfono",           value: viewingBranch.phone },
                { icon: <Mail className="w-4 h-4 text-primary" />,     label: "Correo",             value: viewingBranch.email },
                { icon: <User className="w-4 h-4 text-primary" />,     label: "Responsable",        value: viewingBranch.manager },
                { icon: <Clock className="w-4 h-4 text-primary" />,    label: "Horario",            value: viewingBranch.schedule },
                { icon: <Calendar className="w-4 h-4 text-primary" />, label: "Fecha apertura",     value: viewingBranch.openingDate },
              ].map(row => (
                <div key={row.label} className={`flex items-start gap-3 py-2.5 border-b ${theme === "light" ? "border-gray-100" : "border-white/5"}`}>
                  <div className="mt-0.5 flex-shrink-0">{row.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-xs">{row.label}</p>
                    <p className={`text-sm font-medium truncate ${theme === "light" ? "text-gray-800" : "text-white"}`}>{row.value}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-gray-400 text-xs">Estado</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                  viewingBranch.status === "active"
                    ? theme === "light" ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-300"
                    : theme === "light" ? "bg-red-100 text-red-700"     : "bg-red-500/20 text-red-300"
                }`}>
                  {viewingBranch.status === "active" ? <><CheckCircle2 className="w-3 h-3" />Activa</> : <><X className="w-3 h-3" />Inactiva</>}
                </span>
              </div>
            </div>
            <div className="px-5 pb-5">
              <button onClick={handleCloseViewModal}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors ${theme === "light" ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white"}`}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${theme === "light" ? "bg-white border border-gray-200" : "bg-[#0D1B2A] border border-white/10"}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10 ${theme === "light" ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  {modalMode === "create" ? <Plus className="w-5 h-5 text-primary" /> : <Edit className="w-5 h-5 text-primary" />}
                </div>
                <h3 className={`font-bold text-xl ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                  {modalMode === "create" ? "Nueva Sucursal / Establecimiento" : "Editar Sucursal"}
                </h3>
              </div>
              <button onClick={handleCloseModal} className={`p-2 rounded-lg transition-colors ${theme === "light" ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">

              {/* Aviso jerarquía */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${theme === "light" ? "bg-primary/5 border border-primary/20 text-primary" : "bg-primary/10 border border-primary/20 text-primary"}`}>
                <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                El código de Establecimiento (SRI) será heredado por todos los Puntos de Emisión de esta sucursal.
              </div>

              {/* Código + Establecimiento SRI + Nombre */}
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Código <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })} placeholder="SUC-001" className={ici} required />
                  </div>
                </div>
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>
                    Estab. SRI <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      maxLength={3}
                      value={formData.establecimiento}
                      onChange={e => setFormData({ ...formData, establecimiento: e.target.value.replace(/\D/g, "").slice(0, 3) })}
                      placeholder="001"
                      className={`${ici} font-mono`}
                      required
                    />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Nombre <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Sucursal Centro" className={ici} required />
                  </div>
                </div>
              </div>

              {/* Tipo */}
              <div>
                <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Tipo</label>
                <select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value as any })} className={ic}>
                  <option value="secundaria">Secundaria</option>
                  <option value="principal">Principal</option>
                </select>
              </div>

              {/* Dirección */}
              <div>
                <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Dirección <span className="text-red-400">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} placeholder="Av. Principal N123-456" className={ici} required />
                </div>
              </div>

              {/* Ciudad + Provincia */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Ciudad <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="Quito" className={ic} required />
                </div>
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Provincia <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.province} onChange={e => setFormData({ ...formData, province: e.target.value })} placeholder="Pichincha" className={ic} required />
                </div>
              </div>

              {/* Teléfono + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Teléfono <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="02-2345678" className={ici} required />
                  </div>
                </div>
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Email <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="sucursal@empresa.com" className={ici} required />
                  </div>
                </div>
              </div>

              {/* Responsable + Fecha */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Responsable <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={formData.manager} onChange={e => setFormData({ ...formData, manager: e.target.value })} placeholder="Nombre del responsable" className={ici} required />
                  </div>
                </div>
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Fecha Apertura <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="date" value={formData.openingDate} onChange={e => setFormData({ ...formData, openingDate: e.target.value })} className={ici} required />
                  </div>
                </div>
              </div>

              {/* Horario */}
              <div>
                <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Horario de Atención <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={formData.schedule} onChange={e => setFormData({ ...formData, schedule: e.target.value })} placeholder="Lun-Vie: 8:00-18:00, Sáb: 9:00-13:00" className={ici} required />
                </div>
              </div>

              {/* Botones */}
              <div className={`flex gap-3 pt-2 border-t ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                <button type="button" onClick={handleCloseModal}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${theme === "light" ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white"}`}>
                  Cancelar
                </button>
                <button type="submit" className="flex-1 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                  {modalMode === "create" ? "Crear Sucursal" : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}