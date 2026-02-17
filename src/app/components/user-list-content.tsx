import { useState } from "react";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  Shield,
  UserCheck,
  Crown,
  CheckCircle2,
  Wallet,
  Package,
  ShoppingCart,
  Calculator,
} from "lucide-react";

interface UserData {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: "super_admin" | "admin_empresa" | "contador" | "cajero" | "bodeguero" | "vendedor" | "comprador";
  status: "active" | "inactive";
  createdAt: string;
  lastLogin: string;
}

export function UserListContent() {
  const [users, setUsers] = useState<UserData[]>([
    {
      id: "1",
      username: "admin",
      email: "admin@empresa.com",
      fullName: "Administrador Principal",
      role: "admin_empresa",
      status: "active",
      createdAt: "2024-01-15",
      lastLogin: "2026-02-17 09:30",
    },
    {
      id: "2",
      username: "jperez",
      email: "jperez@empresa.com",
      fullName: "Juan Pérez García",
      role: "vendedor",
      status: "active",
      createdAt: "2024-02-20",
      lastLogin: "2026-02-16 15:20",
    },
    {
      id: "3",
      username: "mrodriguez",
      email: "mrodriguez@empresa.com",
      fullName: "María Rodríguez López",
      role: "contador",
      status: "active",
      createdAt: "2024-03-10",
      lastLogin: "2026-02-17 08:15",
    },
    {
      id: "4",
      username: "lmartinez",
      email: "lmartinez@empresa.com",
      fullName: "Luis Martínez Ruiz",
      role: "bodeguero",
      status: "inactive",
      createdAt: "2024-04-05",
      lastLogin: "2026-01-30 14:45",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
    role: "cajero" as "super_admin" | "admin_empresa" | "contador" | "cajero" | "bodeguero" | "vendedor" | "comprador",
    status: "active" as "active" | "inactive",
  });

  const handleOpenCreateModal = () => {
    setModalMode("create");
    setFormData({
      username: "",
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      role: "cajero",
      status: "active",
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (user: UserData) => {
    setModalMode("edit");
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      password: "",
      confirmPassword: "",
      role: user.role,
      status: user.status,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setShowPassword(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (modalMode === "create" && !formData.password) {
      alert("La contraseña es obligatoria");
      return;
    }

    if (modalMode === "create") {
      // Crear nuevo usuario
      const newUser: UserData = {
        id: String(users.length + 1),
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        role: formData.role,
        status: formData.status,
        createdAt: new Date().toISOString().split("T")[0],
        lastLogin: "Nunca",
      };
      setUsers([...users, newUser]);
      alert("Usuario creado exitosamente");
    } else {
      // Editar usuario existente
      setUsers(
        users.map((user) =>
          user.id === selectedUser?.id
            ? {
                ...user,
                username: formData.username,
                email: formData.email,
                fullName: formData.fullName,
                role: formData.role,
                status: formData.status,
              }
            : user
        )
      );
      alert("Usuario actualizado exitosamente");
    }

    handleCloseModal();
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      setUsers(users.filter((user) => user.id !== userId));
      alert("Usuario eliminado exitosamente");
    }
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "super_admin":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-medium">
            <Crown className="w-3 h-3" />
            Super Admin
          </span>
        );
      case "admin_empresa":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-medium">
            <Shield className="w-3 h-3" />
            Admin
          </span>
        );
      case "contador":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500/20 text-gray-300 rounded-lg text-xs font-medium">
            <Calculator className="w-3 h-3" />
            Contador
          </span>
        );
      case "cajero":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500/20 text-gray-300 rounded-lg text-xs font-medium">
            <Wallet className="w-3 h-3" />
            Cajero
          </span>
        );
      case "bodeguero":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500/20 text-gray-300 rounded-lg text-xs font-medium">
            <Package className="w-3 h-3" />
            Bodeguero
          </span>
        );
      case "vendedor":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500/20 text-gray-300 rounded-lg text-xs font-medium">
            <ShoppingCart className="w-3 h-3" />
            Vendedor
          </span>
        );
      case "comprador":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-500/20 text-gray-300 rounded-lg text-xs font-medium">
            <ShoppingCart className="w-3 h-3" />
            Comprador
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" />
            Lista de Usuarios
          </h2>
          <p className="text-gray-400 text-sm">
            Gestiona los usuarios y sus credenciales de acceso al sistema
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium flex items-center gap-2 justify-center"
        >
          <Plus className="w-5 h-5" />
          Nuevo Usuario
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
            placeholder="Buscar por usuario, email o nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-white/5 border-b border-white/10">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Nombre Completo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Último Acceso
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-white font-medium">
                          {user.username}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{user.email}</td>
                    <td className="px-6 py-4 text-gray-300">{user.fullName}</td>
                    <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                          user.status === "active"
                            ? "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                            : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                        }`}
                      >
                        {user.status === "active" ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Activo
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            Inactivo
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {user.lastLogin}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEditModal(user)}
                          className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Users className="w-12 h-12 text-gray-600" />
                      <p className="text-gray-400">
                        No se encontraron usuarios
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Total Usuarios</p>
              <p className="text-white font-bold text-2xl">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Usuarios Activos</p>
              <p className="text-white font-bold text-2xl">
                {users.filter((u) => u.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Administradores</p>
              <p className="text-white font-bold text-2xl">
                {users.filter((u) => u.role === "admin_empresa" || u.role === "super_admin").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Crear/Editar Usuario */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto">
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
                  {modalMode === "create" ? "Nuevo Usuario" : "Editar Usuario"}
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
              {/* Nombre Completo */}
              <div>
                <label className="block text-white mb-2 font-medium text-sm">
                  Nombre Completo
                  <span className="text-red-400 ml-1">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Ej: Juan Pérez García"
                    className="w-full pl-10 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    required
                  />
                </div>
              </div>

              {/* Usuario y Email en dos columnas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Usuario */}
                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Nombre de Usuario
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <UserCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) =>
                        setFormData({ ...formData, username: e.target.value })
                      }
                      placeholder="usuario"
                      className="w-full pl-10 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
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
                      placeholder="usuario@empresa.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Contraseña y Confirmar Contraseña */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Contraseña */}
                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Contraseña
                    {modalMode === "create" && (
                      <span className="text-red-400 ml-1">*</span>
                    )}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required={modalMode === "create"}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {modalMode === "edit" && (
                    <p className="text-gray-500 text-xs mt-1">
                      Dejar en blanco para mantener la contraseña actual
                    </p>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Confirmar Contraseña
                    {modalMode === "create" && (
                      <span className="text-red-400 ml-1">*</span>
                    )}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                      required={modalMode === "create"}
                    />
                  </div>
                </div>
              </div>

              {/* Rol y Estado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Rol */}
                <div>
                  <label className="block text-white mb-2 font-medium text-sm">
                    Rol
                    <span className="text-red-400 ml-1">*</span>
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        role: e.target.value as "super_admin" | "admin_empresa" | "contador" | "cajero" | "bodeguero" | "vendedor" | "comprador",
                      })
                    }
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    required
                  >
                    <option value="cajero">Cajero</option>
                    <option value="vendedor">Vendedor</option>
                    <option value="comprador">Comprador</option>
                    <option value="bodeguero">Bodeguero</option>
                    <option value="contador">Contador</option>
                    <option value="admin_empresa">Admin Empresa</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                {/* Estado */}
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
                    className="w-full px-4 py-3 bg-[#0f1825] border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                    required
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
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
                  {modalMode === "create" ? "Crear Usuario" : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}