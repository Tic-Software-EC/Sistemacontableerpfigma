import { useState } from "react";
import {
  Building2,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  Building,
  Star,
  Filter,
  Eye,
  Hash,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";

interface BranchData {
  id: string;
  code: string;
  name: string;
  type: "principal" | "secundaria";
  address: string;
  city: string;
  province: string;
  phone: string;
  email: string;
  manager: string;
  openingDate: string;
  schedule: string;
  status: "active" | "inactive";
}

export function BranchListContent() {
  const { theme } = useTheme();
  const [branches, setBranches] = useState<BranchData[]>([
    { id: "1", code: "SUC-001", name: "Sucursal Principal - Centro", type: "principal", address: "Av. Amazonas N24-123 y Colón", city: "Quito", province: "Pichincha", phone: "02-2345678", email: "centro@empresa.com", manager: "Carlos Méndez", openingDate: "2020-01-15", schedule: "Lun-Vie: 8:00-18:00, Sáb: 9:00-13:00", status: "active" },
    { id: "2", code: "SUC-002", name: "Sucursal Norte", type: "secundaria", address: "Av. de los Shyris N34-567", city: "Quito", province: "Pichincha", phone: "02-3456789", email: "norte@empresa.com", manager: "Ana Torres", openingDate: "2021-03-20", schedule: "Lun-Vie: 9:00-17:00", status: "active" },
    { id: "3", code: "SUC-003", name: "Sucursal Guayaquil", type: "secundaria", address: "Av. 9 de Octubre 456", city: "Guayaquil", province: "Guayas", phone: "04-2345678", email: "guayaquil@empresa.com", manager: "Roberto Jiménez", openingDate: "2021-06-10", schedule: "Lun-Vie: 8:30-17:30, Sáb: 9:00-12:00", status: "active" },
    { id: "4", code: "SUC-004", name: "Sucursal Sur", type: "secundaria", address: "Av. Maldonado S56-789", city: "Quito", province: "Pichincha", phone: "02-4567890", email: "sur@empresa.com", manager: "María López", openingDate: "2022-01-05", schedule: "Lun-Vie: 9:00-18:00", status: "inactive" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingBranch, setViewingBranch] = useState<BranchData | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedBranch, setSelectedBranch] = useState<BranchData | null>(null);

  const emptyForm = { code: "", name: "", type: "secundaria" as const, address: "", city: "", province: "", phone: "", email: "", manager: "", openingDate: "", schedule: "", status: "active" as const };
  const [formData, setFormData] = useState(emptyForm);

  const handleOpenCreateModal = () => { setModalMode("create"); setFormData(emptyForm); setShowModal(true); };
  const handleOpenEditModal = (b: BranchData) => { setModalMode("edit"); setSelectedBranch(b); setFormData({ code: b.code, name: b.name, type: b.type, address: b.address, city: b.city, province: b.province, phone: b.phone, email: b.email, manager: b.manager, openingDate: b.openingDate, schedule: b.schedule, status: b.status }); setShowModal(true); };
  const handleViewBranch = (b: BranchData) => { setViewingBranch(b); setShowViewModal(true); };
  const handleCloseModal = () => { setShowModal(false); setSelectedBranch(null); };
  const handleCloseViewModal = () => { setShowViewModal(false); setViewingBranch(null); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === "create") {
      setBranches([...branches, { id: String(Date.now()), ...formData }]);
    } else {
      setBranches(branches.map((b) => b.id === selectedBranch?.id ? { ...b, ...formData } : b));
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar esta sucursal?")) setBranches(branches.filter((b) => b.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setBranches(branches.map((b) => b.id === id ? { ...b, status: b.status === "active" ? "inactive" : "active" } : b));
  };

  const filteredBranches = branches.filter((b) => {
    const q = searchTerm.toLowerCase();
    const matchSearch = b.code.toLowerCase().includes(q) || b.name.toLowerCase().includes(q) || b.city.toLowerCase().includes(q) || b.manager.toLowerCase().includes(q);
    return matchSearch && (filterType === "all" || b.type === filterType) && (filterStatus === "all" || b.status === filterStatus);
  });

  const ic = `w-full px-3 py-2 border rounded-lg text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const ici = `w-full pl-10 pr-3 py-2 border rounded-lg text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${theme === "light" ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;
  const card = `rounded-xl p-4 ${theme === "light" ? "bg-white border border-gray-200" : "bg-white/5 border border-white/10"}`;
  const divider = `border-t ${theme === "light" ? "border-gray-200" : "border-white/10"}`;
  const optBg = "bg-[#0D1B2A]";

  return (
    <div className="space-y-6">

      {/* TÍTULO estándar: icono naranja + título bold + subtítulo gris */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <Building2 className="w-8 h-8 text-primary" />
          <h2 className={`font-bold text-3xl ${theme === "light" ? "text-gray-900" : "text-white"}`}>
            Sucursales
          </h2>
        </div>
        <p className="text-gray-400 text-sm">Gestiona las sucursales registradas de la empresa</p>
      </div>

      {/* Separador */}
      <div className={divider} />

      {/* Métricas KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: branches.length, icon: <Building2 className="w-5 h-5 text-primary" />, bg: "bg-primary/20" },
          { label: "Activas", value: branches.filter(b => b.status === "active").length, icon: <CheckCircle2 className="w-5 h-5 text-green-400" />, bg: "bg-green-500/20" },
          { label: "Principal", value: branches.filter(b => b.type === "principal").length, icon: <Star className="w-5 h-5 text-yellow-400" />, bg: "bg-yellow-500/20" },
          { label: "Secundarias", value: branches.filter(b => b.type === "secundaria").length, icon: <Building className="w-5 h-5 text-blue-400" />, bg: "bg-blue-500/20" },
        ].map((m) => (
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

      {/* Separador + Botón */}
      <div className={divider} />
      <div className="flex justify-end">
        <button onClick={handleOpenCreateModal} className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2 text-sm shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Nueva Sucursal
        </button>
      </div>

      {/* Filtros compactos en línea */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className={`flex-1 flex items-center gap-2 border rounded-lg px-3 py-2 ${theme === "light" ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Buscar por código, nombre, ciudad..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none placeholder:text-gray-500 ${theme === "light" ? "text-gray-900" : "text-white"}`} />
        </div>
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[148px] ${theme === "light" ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
            <option value="all" className={optBg}>Todos los tipos</option>
            <option value="principal" className={optBg}>Principal</option>
            <option value="secundaria" className={optBg}>Secundaria</option>
          </select>
        </div>
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 min-w-[148px] ${theme === "light" ? "bg-white border-gray-300" : "bg-transparent border-white/15"}`}>
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className={`flex-1 bg-transparent text-sm focus:outline-none appearance-none cursor-pointer ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}>
            <option value="all" className={optBg}>Todos los estados</option>
            <option value="active" className={optBg}>Activas</option>
            <option value="inactive" className={optBg}>Inactivas</option>
          </select>
        </div>
      </div>

      {/* Tabla compacta */}
      <div className={`rounded-xl overflow-hidden border ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b text-xs font-semibold uppercase tracking-wider ${theme === "light" ? "bg-gray-50 border-gray-200 text-gray-500" : "bg-white/5 border-white/10 text-gray-400"}`}>
                <th className="px-4 py-3 text-left">Código</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Tipo</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${theme === "light" ? "divide-gray-100" : "divide-white/5"}`}>
              {filteredBranches.length > 0 ? filteredBranches.map((branch) => (
                <tr key={branch.id} className={`transition-colors ${theme === "light" ? "hover:bg-gray-50" : "hover:bg-white/[0.04]"}`}>

                  {/* Código — solo el texto */}
                  <td className="px-4 py-3">
                    <span className={`text-sm font-mono ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>{branch.code}</span>
                  </td>

                  {/* Nombre */}
                  <td className="px-4 py-3">
                    <span className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>{branch.name}</span>
                  </td>

                  {/* Tipo */}
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                      branch.type === "principal"
                        ? theme === "light" ? "bg-yellow-100 text-yellow-700 border border-yellow-200" : "bg-yellow-500/20 text-yellow-300"
                        : theme === "light" ? "bg-blue-100 text-blue-700 border border-blue-200" : "bg-blue-500/20 text-blue-300"
                    }`}>
                      {branch.type === "principal" ? <><Star className="w-3 h-3" />Principal</> : <><Building className="w-3 h-3" />Secundaria</>}
                    </span>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => handleToggleStatus(branch.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        branch.status === "active"
                          ? theme === "light" ? "bg-green-100 text-green-700 border border-green-200 hover:bg-green-200" : "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                          : theme === "light" ? "bg-red-100 text-red-700 border border-red-200 hover:bg-red-200" : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                      }`}>
                      {branch.status === "active"
                        ? <><CheckCircle2 className="w-3 h-3" />Activa</>
                        : <><X className="w-3 h-3" />Inactiva</>}
                    </button>
                  </td>

                  {/* Acciones */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleViewBranch(branch)} title="Ver detalles"
                        className={`p-1.5 rounded-lg transition-colors ${theme === "light" ? "text-gray-500 hover:bg-gray-100 hover:text-gray-800" : "text-gray-400 hover:bg-white/10 hover:text-white"}`}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleOpenEditModal(branch)} title="Editar"
                        className={`p-1.5 rounded-lg transition-colors ${theme === "light" ? "text-blue-600 hover:bg-blue-50" : "text-blue-400 hover:bg-blue-500/10"}`}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(branch.id)} title="Eliminar"
                        className={`p-1.5 rounded-lg transition-colors ${theme === "light" ? "text-red-600 hover:bg-red-50" : "text-red-400 hover:bg-red-500/10"}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center">
                    <Building2 className={`w-10 h-10 mx-auto mb-3 ${theme === "light" ? "text-gray-300" : "text-gray-600"}`} />
                    <p className="text-gray-400 text-sm">No se encontraron sucursales</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal Ver Detalle ── */}
      {showViewModal && viewingBranch && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ${theme === "light" ? "bg-white border border-gray-200" : "bg-[#0D1B2A] border border-white/10"}`}>
            {/* Header modal */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${viewingBranch.type === "principal" ? "bg-yellow-500/20" : "bg-blue-500/20"}`}>
                  {viewingBranch.type === "principal" ? <Star className="w-5 h-5 text-yellow-400" /> : <Building2 className="w-5 h-5 text-blue-400" />}
                </div>
                <div>
                  <p className={`font-bold text-base ${theme === "light" ? "text-gray-900" : "text-white"}`}>{viewingBranch.name}</p>
                  <p className="text-gray-400 text-xs font-mono">{viewingBranch.code}</p>
                </div>
              </div>
              <button onClick={handleCloseViewModal} className={`p-2 rounded-lg transition-colors ${theme === "light" ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            {/* Filas de detalle */}
            <div className="px-5 py-4 space-y-0">
              {[
                { icon: <MapPin className="w-4 h-4 text-primary" />, label: "Dirección", value: `${viewingBranch.address}` },
                { icon: <MapPin className="w-4 h-4 text-primary" />, label: "Ciudad / Provincia", value: `${viewingBranch.city}, ${viewingBranch.province}` },
                { icon: <Phone className="w-4 h-4 text-primary" />, label: "Teléfono", value: viewingBranch.phone },
                { icon: <Mail className="w-4 h-4 text-primary" />, label: "Correo", value: viewingBranch.email },
                { icon: <User className="w-4 h-4 text-primary" />, label: "Responsable", value: viewingBranch.manager },
                { icon: <Clock className="w-4 h-4 text-primary" />, label: "Horario", value: viewingBranch.schedule },
                { icon: <Calendar className="w-4 h-4 text-primary" />, label: "Fecha de apertura", value: viewingBranch.openingDate },
              ].map((row) => (
                <div key={row.label} className={`flex items-start gap-3 py-2.5 border-b ${theme === "light" ? "border-gray-100" : "border-white/5"}`}>
                  <div className="mt-0.5 flex-shrink-0">{row.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-400 text-xs">{row.label}</p>
                    <p className={`text-sm font-medium truncate ${theme === "light" ? "text-gray-800" : "text-white"}`}>{row.value}</p>
                  </div>
                </div>
              ))}
              {/* Estado */}
              <div className="flex items-center justify-between py-2.5">
                <span className="text-gray-400 text-xs">Estado</span>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${
                  viewingBranch.status === "active"
                    ? theme === "light" ? "bg-green-100 text-green-700" : "bg-green-500/20 text-green-300"
                    : theme === "light" ? "bg-red-100 text-red-700" : "bg-red-500/20 text-red-300"
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

      {/* ── Modal Crear / Editar ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto ${theme === "light" ? "bg-white border border-gray-200" : "bg-[#0D1B2A] border border-white/10"}`}>
            {/* Header */}
            <div className={`flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10 ${theme === "light" ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  {modalMode === "create" ? <Plus className="w-5 h-5 text-primary" /> : <Edit className="w-5 h-5 text-primary" />}
                </div>
                <h3 className={`font-bold text-xl ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                  {modalMode === "create" ? "Nueva Sucursal" : "Editar Sucursal"}
                </h3>
              </div>
              <button onClick={handleCloseModal} className={`p-2 rounded-lg transition-colors ${theme === "light" ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Código + Nombre */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Código <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="SUC-001" className={ici} required />
                  </div>
                </div>
                <div className="col-span-2">
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Nombre <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Sucursal Centro" className={ici} required />
                  </div>
                </div>
              </div>

              {/* Tipo + Estado */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Tipo</label>
                  <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as any })} className={ic}>
                    <option value="secundaria">Secundaria</option>
                    <option value="principal">Principal</option>
                  </select>
                </div>
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Estado</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })} className={ic}>
                    <option value="active">Activa</option>
                    <option value="inactive">Inactiva</option>
                  </select>
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Dirección <span className="text-red-400">*</span></label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Av. Principal N123-456" className={ici} required />
                </div>
              </div>

              {/* Ciudad + Provincia */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Ciudad <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Quito" className={ic} required />
                </div>
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Provincia <span className="text-red-400">*</span></label>
                  <input type="text" value={formData.province} onChange={(e) => setFormData({ ...formData, province: e.target.value })} placeholder="Pichincha" className={ic} required />
                </div>
              </div>

              {/* Teléfono + Email */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Teléfono <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="02-2345678" className={ici} required />
                  </div>
                </div>
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Email <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="sucursal@empresa.com" className={ici} required />
                  </div>
                </div>
              </div>

              {/* Responsable + Fecha */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Responsable <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" value={formData.manager} onChange={(e) => setFormData({ ...formData, manager: e.target.value })} placeholder="Nombre del responsable" className={ici} required />
                  </div>
                </div>
                <div>
                  <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Fecha Apertura <span className="text-red-400">*</span></label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="date" value={formData.openingDate} onChange={(e) => setFormData({ ...formData, openingDate: e.target.value })} className={ici} required />
                  </div>
                </div>
              </div>

              {/* Horario */}
              <div>
                <label className={`block mb-1.5 text-sm font-medium ${theme === "light" ? "text-gray-700" : "text-white"}`}>Horario de Atención <span className="text-red-400">*</span></label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={formData.schedule} onChange={(e) => setFormData({ ...formData, schedule: e.target.value })} placeholder="Lun-Vie: 8:00-18:00, Sáb: 9:00-13:00" className={ici} required />
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