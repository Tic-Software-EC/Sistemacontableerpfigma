import { useState } from "react";
import {
  UserCheck,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  Shield,
  Eye,
  FilePlus,
  Edit,
  Trash,
  FileDown,
  ChevronDown,
  ChevronRight,
  Copy,
  CheckCircle2,
} from "lucide-react";

interface Permission {
  module: string;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
}

interface Role {
  id: string;
  name: string;
  description: string;
  type: "predefined" | "custom";
  usersCount: number;
  permissions: Permission[];
  color: string;
}

const modules = [
  "Configuración",
  "Ventas",
  "Inventario",
  "Contabilidad",
  "Compras",
];

// Roles predefinidos del sistema
const predefinedRoles: Role[] = [
  {
    id: "2",
    name: "Administrador de Empresa",
    description: "Gestión completa de la empresa y configuraciones",
    type: "predefined",
    usersCount: 5,
    color: "#3B82F6",
    permissions: modules.map((module) => ({
      module,
      view: true,
      create: true,
      edit: true,
      delete: true,
      export: true,
    })),
  },
  {
    id: "3",
    name: "Contador",
    description: "Acceso completo a módulo contable y reportes financieros",
    type: "predefined",
    usersCount: 3,
    color: "#10B981",
    permissions: [
      {
        module: "Configuración",
        view: true,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
      {
        module: "Ventas",
        view: true,
        create: false,
        edit: false,
        delete: false,
        export: true,
      },
      {
        module: "Inventario",
        view: true,
        create: false,
        edit: false,
        delete: false,
        export: true,
      },
      {
        module: "Contabilidad",
        view: true,
        create: true,
        edit: true,
        delete: true,
        export: true,
      },
      {
        module: "Compras",
        view: true,
        create: false,
        edit: false,
        delete: false,
        export: true,
      },
    ],
  },
  {
    id: "4",
    name: "Vendedor",
    description: "Gestión de ventas, facturación y clientes",
    type: "predefined",
    usersCount: 12,
    color: "#8B5CF6",
    permissions: [
      {
        module: "Configuración",
        view: true,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
      {
        module: "Ventas",
        view: true,
        create: true,
        edit: true,
        delete: false,
        export: true,
      },
      {
        module: "Inventario",
        view: true,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
      {
        module: "Contabilidad",
        view: false,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
      {
        module: "Compras",
        view: false,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
    ],
  },
  {
    id: "5",
    name: "Cajero",
    description: "Procesamiento de pagos y cierre de caja",
    type: "predefined",
    usersCount: 8,
    color: "#F59E0B",
    permissions: [
      {
        module: "Configuración",
        view: true,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
      {
        module: "Ventas",
        view: true,
        create: true,
        edit: false,
        delete: false,
        export: false,
      },
      {
        module: "Inventario",
        view: true,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
      {
        module: "Contabilidad",
        view: false,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
      {
        module: "Compras",
        view: false,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
    ],
  },
  {
    id: "6",
    name: "Comprador",
    description: "Gestión de compras, proveedores y órdenes",
    type: "predefined",
    usersCount: 4,
    color: "#EC4899",
    permissions: [
      {
        module: "Configuración",
        view: true,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
      {
        module: "Ventas",
        view: false,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
      {
        module: "Inventario",
        view: true,
        create: true,
        edit: true,
        delete: false,
        export: true,
      },
      {
        module: "Contabilidad",
        view: false,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
      {
        module: "Compras",
        view: true,
        create: true,
        edit: true,
        delete: false,
        export: true,
      },
    ],
  },
  {
    id: "7",
    name: "Bodeguero",
    description: "Control de inventario y movimientos de stock",
    type: "predefined",
    usersCount: 6,
    color: "#14B8A6",
    permissions: [
      {
        module: "Configuración",
        view: true,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
      {
        module: "Ventas",
        view: true,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
      {
        module: "Inventario",
        view: true,
        create: true,
        edit: true,
        delete: false,
        export: true,
      },
      {
        module: "Contabilidad",
        view: false,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
      {
        module: "Compras",
        view: true,
        create: false,
        edit: false,
        delete: false,
        export: false,
      },
    ],
  },
];

export function RolesPermissionsContent() {
  const [roles, setRoles] = useState<Role[]>(predefinedRoles);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);
  const [showCopyModal, setShowCopyModal] = useState(false);

  // Formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: modules.map((module) => ({
      module,
      view: false,
      create: false,
      edit: false,
      delete: false,
      export: false,
    })),
  });

  const filteredRoles = roles.filter(
    (role) =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    const newRole: Role = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      type: "custom",
      usersCount: 0,
      color: "#6366F1",
      permissions: formData.permissions,
    };

    setRoles([...roles, newRole]);
    setShowCreateModal(false);
    resetForm();
  };

  const handleEdit = () => {
    if (!selectedRole) return;

    setRoles(
      roles.map((role) =>
        role.id === selectedRole.id
          ? {
              ...role,
              name: formData.name,
              description: formData.description,
              permissions: formData.permissions,
            }
          : role
      )
    );

    setShowEditModal(false);
    setSelectedRole(null);
    resetForm();
  };

  const handleDelete = () => {
    if (!selectedRole) return;
    setRoles(roles.filter((role) => role.id !== selectedRole.id));
    setShowDeleteModal(false);
    setSelectedRole(null);
  };

  const handleCopy = () => {
    if (!selectedRole) return;

    const copiedRole: Role = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      type: "custom",
      usersCount: 0,
      color: "#6366F1",
      permissions: formData.permissions,
    };

    setRoles([...roles, copiedRole]);
    setShowCopyModal(false);
    setSelectedRole(null);
    resetForm();
  };

  const openEditModal = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description,
      permissions: role.permissions,
    });
    setShowEditModal(true);
  };

  const openCopyModal = (role: Role) => {
    setSelectedRole(role);
    setFormData({
      name: `${role.name} (Copia)`,
      description: role.description,
      permissions: role.permissions,
    });
    setShowCopyModal(true);
  };

  const openDeleteModal = (role: Role) => {
    setSelectedRole(role);
    setShowDeleteModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      permissions: modules.map((module) => ({
        module,
        view: false,
        create: false,
        edit: false,
        delete: false,
        export: false,
      })),
    });
  };

  const updatePermission = (
    moduleIndex: number,
    field: keyof Omit<Permission, "module">,
    value: boolean
  ) => {
    const newPermissions = [...formData.permissions];
    newPermissions[moduleIndex] = {
      ...newPermissions[moduleIndex],
      [field]: value,
    };
    setFormData({ ...formData, permissions: newPermissions });
  };

  const toggleAllPermissions = (moduleIndex: number, value: boolean) => {
    const newPermissions = [...formData.permissions];
    newPermissions[moduleIndex] = {
      module: newPermissions[moduleIndex].module,
      view: value,
      create: value,
      edit: value,
      delete: value,
      export: value,
    };
    setFormData({ ...formData, permissions: newPermissions });
  };

  const stats = {
    total: roles.length,
    predefined: roles.filter((r) => r.type === "predefined").length,
    custom: roles.filter((r) => r.type === "custom").length,
    totalUsers: roles.reduce((sum, r) => sum + r.usersCount, 0),
  };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Roles y Permisos
          </h2>
          <p className="text-gray-400 text-sm">
            Gestiona los roles de usuario y sus permisos en el sistema
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2 w-fit"
        >
          <Plus className="w-5 h-5" />
          Nuevo Rol
        </button>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Buscador */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar roles por nombre o descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {/* Lista de Roles */}
      <div className="space-y-4">
        {filteredRoles.map((role) => {
          const isExpanded = expandedRole === role.id;

          return (
            <div
              key={role.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-colors"
            >
              {/* Header del rol */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${role.color}20` }}
                    >
                      <Shield
                        className="w-6 h-6"
                        style={{ color: role.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-white font-bold text-lg">
                          {role.name}
                        </h3>
                        {role.type === "predefined" && (
                          <span className="px-2 py-0.5 bg-primary/20 text-primary rounded-md text-xs font-medium">
                            Predefinido
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-3">
                        {role.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">
                          <span className="text-white font-semibold">
                            {role.usersCount}
                          </span>{" "}
                          usuarios asignados
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() =>
                        setExpandedRole(isExpanded ? null : role.id)
                      }
                      className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      title={isExpanded ? "Ocultar permisos" : "Ver permisos"}
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => openEditModal(role)}
                      className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                      title="Editar rol"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => openDeleteModal(role)}
                      className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Eliminar rol"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Permisos expandidos */}
              {isExpanded && (
                <div className="border-t border-white/10 bg-black/20 p-5">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    Permisos del Rol
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left text-gray-400 text-sm font-medium pb-3 pr-4">
                            Módulo
                          </th>
                          <th className="text-center text-gray-400 text-sm font-medium pb-3 px-3">
                            <Eye className="w-4 h-4 mx-auto" title="Ver" />
                          </th>
                          <th className="text-center text-gray-400 text-sm font-medium pb-3 px-3">
                            <FilePlus
                              className="w-4 h-4 mx-auto"
                              title="Crear"
                            />
                          </th>
                          <th className="text-center text-gray-400 text-sm font-medium pb-3 px-3">
                            <Edit className="w-4 h-4 mx-auto" title="Editar" />
                          </th>
                          <th className="text-center text-gray-400 text-sm font-medium pb-3 px-3">
                            <Trash
                              className="w-4 h-4 mx-auto"
                              title="Eliminar"
                            />
                          </th>
                          <th className="text-center text-gray-400 text-sm font-medium pb-3 px-3">
                            <FileDown
                              className="w-4 h-4 mx-auto"
                              title="Exportar"
                            />
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {role.permissions.map((perm, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <td className="py-3 pr-4">
                              <span className="text-white font-medium">
                                {perm.module}
                              </span>
                            </td>
                            <td className="text-center px-3 py-3">
                              {perm.view && (
                                <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                              )}
                            </td>
                            <td className="text-center px-3 py-3">
                              {perm.create && (
                                <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                              )}
                            </td>
                            <td className="text-center px-3 py-3">
                              {perm.edit && (
                                <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                              )}
                            </td>
                            <td className="text-center px-3 py-3">
                              {perm.delete && (
                                <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                              )}
                            </td>
                            <td className="text-center px-3 py-3">
                              {perm.export && (
                                <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredRoles.length === 0 && (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-white font-semibold text-lg mb-2">
              No se encontraron roles
            </h3>
            <p className="text-gray-400 text-sm">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        )}
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total de Roles</p>
              <p className="text-white font-bold text-2xl">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Predefinidos</p>
              <p className="text-white font-bold text-2xl">
                {stats.predefined}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Personalizados</p>
              <p className="text-white font-bold text-2xl">{stats.custom}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Edit className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Usuarios Totales</p>
              <p className="text-white font-bold text-2xl">
                {stats.totalUsers}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Modal Crear/Editar/Copiar */}
      {(showCreateModal || showEditModal || showCopyModal) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-secondary border border-white/10 rounded-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-secondary border-b border-white/10 p-6 flex items-center justify-between">
              <h3 className="text-white font-bold text-xl">
                {showCreateModal && "Crear Nuevo Rol"}
                {showEditModal && "Editar Rol"}
                {showCopyModal && "Duplicar Rol"}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setShowCopyModal(false);
                  resetForm();
                }}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* Información básica */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Nombre del Rol *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Ej: Gerente de Ventas"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2 font-medium">
                    Descripción *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe las responsabilidades de este rol..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                  />
                </div>
              </div>

              {/* Permisos */}
              <div>
                <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Configurar Permisos
                </h4>

                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10 bg-black/20">
                          <th className="text-left text-gray-300 text-sm font-medium p-4">
                            Módulo
                          </th>
                          <th className="text-center text-gray-300 text-sm font-medium p-4">
                            <div className="flex flex-col items-center gap-1">
                              <Eye className="w-4 h-4" />
                              <span className="text-xs">Ver</span>
                            </div>
                          </th>
                          <th className="text-center text-gray-300 text-sm font-medium p-4">
                            <div className="flex flex-col items-center gap-1">
                              <FilePlus className="w-4 h-4" />
                              <span className="text-xs">Crear</span>
                            </div>
                          </th>
                          <th className="text-center text-gray-300 text-sm font-medium p-4">
                            <div className="flex flex-col items-center gap-1">
                              <Edit className="w-4 h-4" />
                              <span className="text-xs">Editar</span>
                            </div>
                          </th>
                          <th className="text-center text-gray-300 text-sm font-medium p-4">
                            <div className="flex flex-col items-center gap-1">
                              <Trash className="w-4 h-4" />
                              <span className="text-xs">Eliminar</span>
                            </div>
                          </th>
                          <th className="text-center text-gray-300 text-sm font-medium p-4">
                            <div className="flex flex-col items-center gap-1">
                              <FileDown className="w-4 h-4" />
                              <span className="text-xs">Exportar</span>
                            </div>
                          </th>
                          <th className="text-center text-gray-300 text-sm font-medium p-4">
                            <span className="text-xs">Todos</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.permissions.map((perm, idx) => {
                          const allChecked =
                            perm.view &&
                            perm.create &&
                            perm.edit &&
                            perm.delete &&
                            perm.export;

                          return (
                            <tr
                              key={idx}
                              className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                              <td className="p-4">
                                <span className="text-white font-medium">
                                  {perm.module}
                                </span>
                              </td>
                              <td className="text-center p-4">
                                <input
                                  type="checkbox"
                                  checked={perm.view}
                                  onChange={(e) =>
                                    updatePermission(
                                      idx,
                                      "view",
                                      e.target.checked
                                    )
                                  }
                                  className="w-5 h-5 rounded border-2 border-white/20 bg-transparent checked:bg-primary checked:border-primary cursor-pointer"
                                />
                              </td>
                              <td className="text-center p-4">
                                <input
                                  type="checkbox"
                                  checked={perm.create}
                                  onChange={(e) =>
                                    updatePermission(
                                      idx,
                                      "create",
                                      e.target.checked
                                    )
                                  }
                                  className="w-5 h-5 rounded border-2 border-white/20 bg-transparent checked:bg-primary checked:border-primary cursor-pointer"
                                />
                              </td>
                              <td className="text-center p-4">
                                <input
                                  type="checkbox"
                                  checked={perm.edit}
                                  onChange={(e) =>
                                    updatePermission(
                                      idx,
                                      "edit",
                                      e.target.checked
                                    )
                                  }
                                  className="w-5 h-5 rounded border-2 border-white/20 bg-transparent checked:bg-primary checked:border-primary cursor-pointer"
                                />
                              </td>
                              <td className="text-center p-4">
                                <input
                                  type="checkbox"
                                  checked={perm.delete}
                                  onChange={(e) =>
                                    updatePermission(
                                      idx,
                                      "delete",
                                      e.target.checked
                                    )
                                  }
                                  className="w-5 h-5 rounded border-2 border-white/20 bg-transparent checked:bg-primary checked:border-primary cursor-pointer"
                                />
                              </td>
                              <td className="text-center p-4">
                                <input
                                  type="checkbox"
                                  checked={perm.export}
                                  onChange={(e) =>
                                    updatePermission(
                                      idx,
                                      "export",
                                      e.target.checked
                                    )
                                  }
                                  className="w-5 h-5 rounded border-2 border-white/20 bg-transparent checked:bg-primary checked:border-primary cursor-pointer"
                                />
                              </td>
                              <td className="text-center p-4">
                                <button
                                  onClick={() =>
                                    toggleAllPermissions(idx, !allChecked)
                                  }
                                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                                    allChecked
                                      ? "bg-primary/20 text-primary hover:bg-primary/30"
                                      : "bg-white/5 text-gray-400 hover:bg-white/10"
                                  }`}
                                >
                                  {allChecked ? "Quitar" : "Todo"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-secondary border-t border-white/10 p-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                  setShowCopyModal(false);
                  resetForm();
                }}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={
                  showCreateModal
                    ? handleCreate
                    : showEditModal
                    ? handleEdit
                    : handleCopy
                }
                disabled={!formData.name || !formData.description}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {showCreateModal && "Crear Rol"}
                {showEditModal && "Guardar Cambios"}
                {showCopyModal && "Crear Copia"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {showDeleteModal && selectedRole && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-secondary border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">Eliminar Rol</h3>
                <p className="text-gray-400 text-sm">
                  Esta acción no se puede deshacer
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <p className="text-white mb-2">
                ¿Estás seguro de que deseas eliminar el rol{" "}
                <span className="font-bold">{selectedRole.name}</span>?
              </p>
              {selectedRole.usersCount > 0 && (
                <p className="text-yellow-400 text-sm">
                  ⚠️ Este rol tiene {selectedRole.usersCount} usuarios
                  asignados. Deberás reasignarlos a otro rol.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedRole(null);
                }}
                className="px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors font-medium flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}