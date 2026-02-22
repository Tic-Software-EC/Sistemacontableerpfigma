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
  Hash,
  Building,
  Star,
} from "lucide-react";

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
  const [branches, setBranches] = useState<BranchData[]>([
    {
      id: "1",
      code: "SUC-001",
      name: "Sucursal Principal - Centro",
      type: "principal",
      address: "Av. Amazonas N24-123 y Colón",
      city: "Quito",
      province: "Pichincha",
      phone: "02-2345678",
      email: "centro@empresa.com",
      manager: "Carlos Méndez",
      openingDate: "2020-01-15",
      schedule: "Lun-Vie: 8:00-18:00, Sáb: 9:00-13:00",
      status: "active",
    },
    {
      id: "2",
      code: "SUC-002",
      name: "Sucursal Norte",
      type: "secundaria",
      address: "Av. de los Shyris N34-567",
      city: "Quito",
      province: "Pichincha",
      phone: "02-3456789",
      email: "norte@empresa.com",
      manager: "Ana Torres",
      openingDate: "2021-03-20",
      schedule: "Lun-Vie: 9:00-17:00",
      status: "active",
    },
    {
      id: "3",
      code: "SUC-003",
      name: "Sucursal Guayaquil",
      type: "secundaria",
      address: "Av. 9 de Octubre 456",
      city: "Guayaquil",
      province: "Guayas",
      phone: "04-2345678",
      email: "guayaquil@empresa.com",
      manager: "Roberto Jiménez",
      openingDate: "2021-06-10",
      schedule: "Lun-Vie: 8:30-17:30, Sáb: 9:00-12:00",
      status: "active",
    },
    {
      id: "4",
      code: "SUC-004",
      name: "Sucursal Sur",
      type: "secundaria",
      address: "Av. Maldonado S56-789",
      city: "Quito",
      province: "Pichincha",
      phone: "02-4567890",
      email: "sur@empresa.com",
      manager: "María López",
      openingDate: "2022-01-05",
      schedule: "Lun-Vie: 9:00-18:00",
      status: "inactive",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedBranch, setSelectedBranch] = useState<BranchData | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "secundaria" as "principal" | "secundaria",
    address: "",
    city: "",
    province: "",
    phone: "",
    email: "",
    manager: "",
    openingDate: "",
    schedule: "",
    status: "active" as "active" | "inactive",
  });

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setFormData({
      code: "",
      name: "",
      type: "secundaria",
      address: "",
      city: "",
      province: "",
      phone: "",
      email: "",
      manager: "",
      openingDate: "",
      schedule: "",
      status: "active",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (branch: BranchData) => {
    setModalMode("edit");
    setSelectedBranch(branch);
    setFormData({
      code: branch.code,
      name: branch.name,
      type: branch.type,
      address: branch.address,
      city: branch.city,
      province: branch.province,
      phone: branch.phone,
      email: branch.email,
      manager: branch.manager,
      openingDate: branch.openingDate,
      schedule: branch.schedule,
      status: branch.status,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBranch(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (modalMode === "create") {
      // Crear nueva sucursal
      const newBranch: BranchData = {
        id: String(branches.length + 1),
        ...formData,
      };
      setBranches([...branches, newBranch]);
      alert("Sucursal creada exitosamente");
    } else {
      // Editar sucursal existente
      setBranches(
        branches.map((branch) =>
          branch.id === selectedBranch?.id
            ? {
                ...branch,
                ...formData,
              }
            : branch
        )
      );
      alert("Sucursal actualizada exitosamente");
    }

    handleCloseModal();
  };

  const handleDeleteBranch = (branchId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar esta sucursal?")) {
      setBranches(branches.filter((branch) => branch.id !== branchId));
      alert("Sucursal eliminada exitosamente");
    }
  };

  const handleToggleStatus = (branchId: string) => {
    setBranches(
      branches.map((branch) =>
        branch.id === branchId
          ? {
              ...branch,
              status: branch.status === "active" ? "inactive" : "active",
            }
          : branch
      )
    );
  };

  const filteredBranches = branches.filter(
    (branch) =>
      branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.manager.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-primary" />
            Sucursales
          </h2>
          <p className="text-gray-400 text-sm">
            Gestiona las sucursales y puntos de venta de la empresa
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2 justify-center"
        >
          <Plus className="w-5 h-5" />
          Nueva Sucursal
        </button>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Barra de búsqueda */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por código, nombre, ciudad o responsable..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Grid de sucursales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredBranches.length > 0 ? (
          filteredBranches.map((branch) => (
            <div
              key={branch.id}
              className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/[0.07] transition-all"
            >
              {/* Header de la card */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      branch.type === "principal"
                        ? "bg-yellow-500/20"
                        : "bg-blue-500/20"
                    }`}
                  >
                    {branch.type === "principal" ? (
                      <Star className="w-6 h-6 text-yellow-400" />
                    ) : (
                      <Building2 className="w-6 h-6 text-blue-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold text-lg">
                        {branch.name}
                      </h3>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                          branch.type === "principal"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-blue-500/20 text-blue-300"
                        }`}
                      >
                        {branch.type === "principal" ? "Principal" : "Secundaria"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Hash className="w-3.5 h-3.5" />
                      {branch.code}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleStatus(branch.id)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    branch.status === "active"
                      ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                      : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                  }`}
                >
                  {branch.status === "active" ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      Activa
                    </>
                  ) : (
                    <>
                      <X className="w-3 h-3" />
                      Inactiva
                    </>
                  )}
                </button>
              </div>

              {/* Información de la sucursal */}
              <div className="space-y-3 mb-4">
                {/* Dirección */}
                <div className="flex items-start gap-2 text-gray-300 text-sm">
                  <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{branch.address}</p>
                    <p className="text-gray-400">
                      {branch.city}, {branch.province}
                    </p>
                  </div>
                </div>

                {/* Contacto */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="truncate">{branch.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300 text-sm">
                    <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                    <span className="truncate">{branch.email}</span>
                  </div>
                </div>

                {/* Responsable y Horario */}
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <User className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>Responsable: {branch.manager}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{branch.schedule}</span>
                </div>

                {/* Fecha de apertura */}
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Apertura: {branch.openingDate}</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <button
                  onClick={() => handleOpenEditModal(branch)}
                  className="flex-1 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteBranch(branch.id)}
                  className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 bg-white/5 border border-white/10 rounded-xl p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">No se encontraron sucursales</p>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Total Sucursales</p>
              <p className="text-white font-bold text-2xl">{branches.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Sucursales Activas</p>
              <p className="text-white font-bold text-2xl">
                {branches.filter((b) => b.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Principal</p>
              <p className="text-white font-bold text-2xl">
                {branches.filter((b) => b.type === "principal").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Building className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Secundarias</p>
              <p className="text-white font-bold text-2xl">
                {branches.filter((b) => b.type === "secundaria").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Crear/Editar Sucursal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary border border-white/10 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-secondary z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  {modalMode === "create" ? (
                    <Plus className="w-5 h-5 text-primary" />
                  ) : (
                    <Edit className="w-5 h-5 text-primary" />
                  )}
                </div>
                <h3 className="text-white font-bold text-xl">
                  {modalMode === "create" ? "Nueva Sucursal" : "Editar Sucursal"}
                </h3>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Código y Nombre */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Código
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      placeholder="SUC-001"
                      className="w-full pl-10 pr-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white mb-2 font-medium text-sm">
                    Nombre de la Sucursal
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Ej: Sucursal Centro"
                      className="w-full pl-10 pr-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Tipo y Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Tipo
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "principal" | "secundaria",
                      })
                    }
                    className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    required
                  >
                    <option value="secundaria">Secundaria</option>
                    <option value="principal">Principal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Estado
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "active" | "inactive",
                      })
                    }
                    className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    required
                  >
                    <option value="active">Activa</option>
                    <option value="inactive">Inactiva</option>
                  </select>
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="block text-white mb-2 font-medium text-sm">
                  Dirección
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Av. Principal N123-456"
                    className="w-full pl-10 pr-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              {/* Ciudad y Provincia */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Ciudad
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Quito"
                    className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Provincia
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                    placeholder="Pichincha"
                    className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              {/* Teléfono y Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Teléfono
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="02-2345678"
                      className="w-full pl-10 pr-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Correo Electrónico
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="sucursal@empresa.com"
                      className="w-full pl-10 pr-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Responsable y Fecha de Apertura */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Responsable
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.manager}
                      onChange={(e) =>
                        setFormData({ ...formData, manager: e.target.value })
                      }
                      placeholder="Nombre del responsable"
                      className="w-full pl-10 pr-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Fecha de Apertura
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="date"
                      value={formData.openingDate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          openingDate: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Horario */}
              <div>
                <label className="block text-white mb-2 font-medium text-sm">
                  Horario de Atención
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) =>
                      setFormData({ ...formData, schedule: e.target.value })
                    }
                    placeholder="Lun-Vie: 8:00-18:00, Sáb: 9:00-13:00"
                    className="w-full pl-10 pr-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              {/* Botones */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium"
                >
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