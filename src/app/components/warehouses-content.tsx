import { useState } from "react";
import {
  Warehouse,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  MapPin,
  Building2,
  User,
  Hash,
  CheckCircle2,
  Package,
  Boxes,
  Archive,
} from "lucide-react";

interface WarehouseData {
  id: string;
  code: string;
  name: string;
  branchId: string;
  branchName: string;
  type: "general" | "refrigerado" | "materias_primas" | "productos_terminados";
  location: string;
  capacity: string;
  manager: string;
  status: "active" | "inactive";
}

export function WarehousesContent() {
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([
    {
      id: "1",
      code: "ALM-001",
      name: "Almacén Principal Centro",
      branchId: "1",
      branchName: "Sucursal Principal - Centro",
      type: "general",
      location: "Planta Baja - Sector A",
      capacity: "500 m²",
      manager: "Luis Rodríguez",
      status: "active",
    },
    {
      id: "2",
      code: "ALM-002",
      name: "Cámara Fría Centro",
      branchId: "1",
      branchName: "Sucursal Principal - Centro",
      type: "refrigerado",
      location: "Sótano - Sector B",
      capacity: "150 m²",
      manager: "María Fernández",
      status: "active",
    },
    {
      id: "3",
      code: "ALM-003",
      name: "Almacén Norte Principal",
      branchId: "2",
      branchName: "Sucursal Norte",
      type: "general",
      location: "Planta Baja",
      capacity: "350 m²",
      manager: "Pedro Gómez",
      status: "active",
    },
    {
      id: "4",
      code: "ALM-004",
      name: "Bodega Materias Primas",
      branchId: "1",
      branchName: "Sucursal Principal - Centro",
      type: "materias_primas",
      location: "Planta Alta - Sector C",
      capacity: "200 m²",
      manager: "Ana Torres",
      status: "active",
    },
    {
      id: "5",
      code: "ALM-005",
      name: "Almacén Guayaquil",
      branchId: "3",
      branchName: "Sucursal Guayaquil",
      type: "general",
      location: "Planta Baja",
      capacity: "400 m²",
      manager: "Carlos Morales",
      status: "active",
    },
    {
      id: "6",
      code: "ALM-006",
      name: "Almacén Productos Terminados",
      branchId: "2",
      branchName: "Sucursal Norte",
      type: "productos_terminados",
      location: "Planta Alta",
      capacity: "300 m²",
      manager: "Diana Ruiz",
      status: "inactive",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedWarehouse, setSelectedWarehouse] = useState<WarehouseData | null>(null);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>("all");

  // Mock data de sucursales para el selector
  const branches = [
    { id: "1", name: "Sucursal Principal - Centro" },
    { id: "2", name: "Sucursal Norte" },
    { id: "3", name: "Sucursal Guayaquil" },
    { id: "4", name: "Sucursal Sur" },
  ];

  // Mock data de empleados por sucursal
  const employees = [
    { id: "1", name: "Luis Rodríguez", branchId: "1", position: "Jefe de Almacén" },
    { id: "2", name: "María Fernández", branchId: "1", position: "Supervisora" },
    { id: "3", name: "Ana Torres", branchId: "1", position: "Coordinadora" },
    { id: "4", name: "Pedro Gómez", branchId: "2", position: "Jefe de Almacén" },
    { id: "5", name: "Diana Ruiz", branchId: "2", position: "Supervisora" },
    { id: "6", name: "Carlos Morales", branchId: "3", position: "Jefe de Almacén" },
    { id: "7", name: "Jorge Sánchez", branchId: "3", position: "Coordinador" },
    { id: "8", name: "Patricia López", branchId: "4", position: "Jefa de Almacén" },
  ];

  // Form states
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    branchId: "",
    type: "general" as "general" | "refrigerado" | "materias_primas" | "productos_terminados",
    location: "",
    capacity: "",
    manager: "",
    status: "active" as "active" | "inactive",
  });

  // Filtrar empleados por sucursal seleccionada
  const availableEmployees = employees.filter(
    (emp) => emp.branchId === formData.branchId
  );

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setFormData({
      code: "",
      name: "",
      branchId: "",
      type: "general",
      location: "",
      capacity: "",
      manager: "",
      status: "active",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (warehouse: WarehouseData) => {
    setModalMode("edit");
    setSelectedWarehouse(warehouse);
    setFormData({
      code: warehouse.code,
      name: warehouse.name,
      branchId: warehouse.branchId,
      type: warehouse.type,
      location: warehouse.location,
      capacity: warehouse.capacity,
      manager: warehouse.manager,
      status: warehouse.status,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedWarehouse(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedBranch = branches.find((b) => b.id === formData.branchId);

    if (modalMode === "create") {
      const newWarehouse: WarehouseData = {
        id: String(warehouses.length + 1),
        ...formData,
        branchName: selectedBranch?.name || "",
      };
      setWarehouses([...warehouses, newWarehouse]);
      alert("Almacén creado exitosamente");
    } else {
      setWarehouses(
        warehouses.map((warehouse) =>
          warehouse.id === selectedWarehouse?.id
            ? {
                ...warehouse,
                ...formData,
                branchName: selectedBranch?.name || warehouse.branchName,
              }
            : warehouse
        )
      );
      alert("Almacén actualizado exitosamente");
    }

    handleCloseModal();
  };

  const handleDeleteWarehouse = (warehouseId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este almacén?")) {
      setWarehouses(warehouses.filter((warehouse) => warehouse.id !== warehouseId));
      alert("Almacén eliminado exitosamente");
    }
  };

  const handleToggleStatus = (warehouseId: string) => {
    setWarehouses(
      warehouses.map((warehouse) =>
        warehouse.id === warehouseId
          ? {
              ...warehouse,
              status: warehouse.status === "active" ? "inactive" : "active",
            }
          : warehouse
      )
    );
  };

  const filteredWarehouses = warehouses.filter((warehouse) => {
    const matchesSearch =
      warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.branchName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.manager.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBranch = selectedBranchFilter === "all" || warehouse.branchId === selectedBranchFilter;

    return matchesSearch && matchesBranch;
  });

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      general: "General",
      refrigerado: "Refrigerado",
      materias_primas: "Materias Primas",
      productos_terminados: "Productos Terminados",
    };
    return types[type] || type;
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      general: "bg-blue-500",
      refrigerado: "bg-cyan-500",
      materias_primas: "bg-purple-500",
      productos_terminados: "bg-green-500",
    };
    return colors[type] || "bg-gray-500";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "refrigerado":
        return <Archive className="w-5 h-5 text-white" />;
      case "materias_primas":
        return <Package className="w-5 h-5 text-white" />;
      case "productos_terminados":
        return <Boxes className="w-5 h-5 text-white" />;
      default:
        return <Warehouse className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <Warehouse className="w-8 h-8 text-primary" />
            Almacenes por Sucursal
          </h2>
          <p className="text-gray-400 text-sm">
            Gestiona los almacenes disponibles por sucursal
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium flex items-center gap-2 justify-center whitespace-nowrap"
        >
          <Plus className="w-5 h-5" />
          Nuevo Almacén
        </button>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Filtro por Sucursal */}
        <div className="bg-[#0f1825]/50 border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="w-5 h-5 text-primary" />
            <span className="text-white font-medium">Sucursal</span>
          </div>
          <select
            value={selectedBranchFilter}
            onChange={(e) => setSelectedBranchFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0a1628] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none"
          >
            <option value="all">Sucursal Principal - Centro</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch.name}
              </option>
            ))}
          </select>
        </div>

        {/* Búsqueda */}
        <div className="bg-[#0f1825]/50 border border-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Search className="w-5 h-5 text-primary" />
            <span className="text-white font-medium">Buscar almacén</span>
          </div>
          <input
            type="text"
            placeholder="Nombre del almacén..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 bg-[#0a1628] border border-white/10 rounded-lg text-white text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Grid de almacenes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredWarehouses.length > 0 ? (
          filteredWarehouses.map((warehouse) => (
            <div
              key={warehouse.id}
              className="bg-[#0a1628] border border-white/5 rounded-xl p-6 hover:border-white/10 transition-all"
            >
              {/* Header de la card */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getTypeColor(warehouse.type)}`}>
                    {getTypeIcon(warehouse.type)}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-0.5">
                      {warehouse.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{getTypeLabel(warehouse.type)}</p>
                  </div>
                </div>
                
                {/* Toggle Switch */}
                <button
                  onClick={() => handleToggleStatus(warehouse.id)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    warehouse.status === "active" ? "bg-primary" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      warehouse.status === "active" ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {/* Información del almacén */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Cuenta contable:</span>
                  <span className="text-white text-sm font-medium">{warehouse.code}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Sucursal:</span>
                  <span className="text-white text-sm font-medium">{warehouse.branchName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Ubicación:</span>
                  <span className="text-white text-sm font-medium">{warehouse.location}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Capacidad:</span>
                  <span className="text-white text-sm font-medium">{warehouse.capacity}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 text-sm">Responsable:</span>
                  <span className="text-white text-sm font-medium">{warehouse.manager}</span>
                </div>
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-3 pt-5 border-t border-white/5">
                <button
                  onClick={() => handleOpenEditModal(warehouse)}
                  className="flex-1 px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteWarehouse(warehouse.id)}
                  className="flex-1 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 bg-[#0a1628] border border-white/5 rounded-xl p-12 text-center">
            <Warehouse className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No se encontraron almacenes</p>
          </div>
        )}
      </div>

      {/* Modal Crear/Editar Almacén */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0a1628] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto border border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#0a1628] z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  {modalMode === "create" ? (
                    <Plus className="w-5 h-5 text-primary" />
                  ) : (
                    <Edit className="w-5 h-5 text-primary" />
                  )}
                </div>
                <h3 className="text-white font-bold text-xl">
                  {modalMode === "create" ? "Nuevo Almacén" : "Editar Almacén"}
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
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      placeholder="ALM-001"
                      className="w-full pl-10 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-white mb-2 font-medium text-sm">
                    Nombre del Almacén
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Warehouse className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Ej: Almacén Principal"
                      className="w-full pl-10 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Sucursal */}
              <div>
                <label className="block text-white mb-2 font-medium text-sm">
                  Sucursal
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={formData.branchId}
                    onChange={(e) =>
                      setFormData({ ...formData, branchId: e.target.value, manager: "" })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none"
                    required
                  >
                    <option value="">Seleccionar sucursal</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
                {formData.branchId && availableEmployees.length === 0 && (
                  <p className="text-yellow-400 text-xs mt-2">
                    No hay empleados disponibles en esta sucursal
                  </p>
                )}
              </div>

              {/* Tipo y Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Tipo de Almacén
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as "general" | "refrigerado" | "materias_primas" | "productos_terminados",
                      })
                    }
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    required
                  >
                    <option value="general">General</option>
                    <option value="refrigerado">Refrigerado</option>
                    <option value="materias_primas">Materias Primas</option>
                    <option value="productos_terminados">Productos Terminados</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Estado
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as "active" | "inactive",
                      })
                    }
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    required
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>

              {/* Ubicación y Capacidad */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Ubicación Física
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      placeholder="Ej: Planta Baja - Sector A"
                      className="w-full pl-10 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Capacidad
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <Boxes className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData({ ...formData, capacity: e.target.value })
                      }
                      placeholder="Ej: 500 m²"
                      className="w-full pl-10 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Responsable */}
              <div>
                <label className="block text-white mb-2 font-medium text-sm">
                  Responsable
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={formData.manager}
                    onChange={(e) =>
                      setFormData({ ...formData, manager: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={!formData.branchId || availableEmployees.length === 0}
                  >
                    <option value="">
                      {!formData.branchId 
                        ? "Primero selecciona una sucursal" 
                        : availableEmployees.length === 0 
                        ? "No hay empleados disponibles"
                        : "Seleccionar responsable"}
                    </option>
                    {availableEmployees.map((emp) => (
                      <option key={emp.id} value={emp.name}>
                        {emp.name} - {emp.position}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg transition-colors font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium"
                >
                  {modalMode === "create" ? "Crear Almacén" : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}