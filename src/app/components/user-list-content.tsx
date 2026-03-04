import { useState } from "react";
import {
  Users, Search, Plus, Edit, Trash2, X, Eye, EyeOff,
  Mail, User, Shield, UserCheck, Crown, CheckCircle2,
  Wallet, Package, ShoppingCart, Calculator, Send, KeyRound,
  Building2, Filter, Info, AlertCircle, RefreshCw, Copy, Clock,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { useRoles } from "../contexts/roles-context";
import { toast } from "sonner";

interface UserData {
  id: string;
  username: string;
  email: string;
  fullName: string;
  roleId: string;
  branch: string;
  status: "active" | "inactive";
  mustChangePassword: boolean;
  createdAt: string;
  lastLogin: string;
}

const BRANCHES = [
  { id: "sucursal1", name: "Sucursal Principal - Centro" },
  { id: "sucursal2", name: "Sucursal Norte" },
  { id: "sucursal3", name: "Sucursal Guayaquil" },
  { id: "sucursal4", name: "Sucursal Sur" },
];

// Genera una contraseña segura aleatoria
function generatePassword(length = 10): string {
  const upper   = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower   = "abcdefghjkmnpqrstuvwxyz";
  const numbers = "23456789";
  const special = "@#$%&*!";
  const all     = upper + lower + numbers + special;
  let pwd = [
    upper  [Math.floor(Math.random() * upper.length)],
    lower  [Math.floor(Math.random() * lower.length)],
    numbers[Math.floor(Math.random() * numbers.length)],
    special[Math.floor(Math.random() * special.length)],
  ];
  for (let i = 4; i < length; i++) {
    pwd.push(all[Math.floor(Math.random() * all.length)]);
  }
  return pwd.sort(() => Math.random() - 0.5).join("");
}

const INITIAL_USERS: UserData[] = [
  { id: "1", username: "admin",      email: "admin@empresa.com",      fullName: "Administrador Principal", roleId: "2", branch: "sucursal1", status: "active",   mustChangePassword: false, createdAt: "2024-01-15", lastLogin: "2026-02-17 09:30" },
  { id: "2", username: "jperez",     email: "jperez@empresa.com",     fullName: "Juan Pérez García",       roleId: "5", branch: "sucursal1", status: "active",   mustChangePassword: false, createdAt: "2024-02-20", lastLogin: "2026-02-16 15:20" },
  { id: "3", username: "mrodriguez", email: "mrodriguez@empresa.com", fullName: "María Rodríguez López",   roleId: "3", branch: "sucursal1", status: "active",   mustChangePassword: false, createdAt: "2024-03-10", lastLogin: "2026-02-17 08:15" },
  { id: "4", username: "lmartinez",  email: "lmartinez@empresa.com",  fullName: "Luis Martínez Ruiz",      roleId: "4", branch: "sucursal1", status: "inactive", mustChangePassword: true,  createdAt: "2024-04-05", lastLogin: "Nunca" },
];

export function UserListContent() {
  const { theme }    = useTheme();
  const { roles }    = useRoles();
  const isLight      = theme === "light";

  const txt      = isLight ? "text-gray-900"  : "text-white";
  const sub      = isLight ? "text-gray-500"  : "text-gray-400";
  const lbl      = isLight ? "text-gray-600"  : "text-gray-300";
  const divB     = isLight ? "border-gray-200" : "border-white/10";
  const card     = `rounded-xl border ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"}`;
  const modalCls = `rounded-2xl border shadow-2xl ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`;
  const IN       = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400" : "bg-[#0f1825] border-white/10 text-white placeholder-gray-500"}`;
  const INpl     = `w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400" : "bg-[#0f1825] border-white/10 text-white placeholder-gray-500"}`;
  const OB       = isLight ? "" : "bg-[#0D1B2A]";
  const thCls    = `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`;
  const hoverRow = isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]";

  const [users, setUsers]               = useState<UserData[]>(INITIAL_USERS);
  const [searchTerm, setSearchTerm]     = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [showModal, setShowModal]       = useState(false);
  const [modalMode, setModalMode]       = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showGenPwd, setShowGenPwd]     = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetData, setResetData]       = useState({ newPassword: "", confirmPassword: "" });
  const [showResetPwd, setShowResetPwd] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    roleId: "",
    branch: "sucursal1",
    status: "active" as "active" | "inactive",
    generatedPassword: "",
  });

  const getBranchName = (id: string) => BRANCHES.find(b => b.id === id)?.name ?? "Sin asignar";
  const getRoleName   = (id: string) => roles.find(r => r.id === id)?.name ?? "Sin rol";

  const filteredUsers = users.filter(u => {
    const term = searchTerm.toLowerCase();
    return (u.username.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || u.fullName.toLowerCase().includes(term))
      && (branchFilter === "all" || u.branch === branchFilter);
  });

  const newGeneratedPwd = () => {
    const pwd = generatePassword();
    setFormData(f => ({ ...f, generatedPassword: pwd }));
  };

  const openCreate = () => {
    setModalMode("create");
    setSelectedUser(null);
    const pwd = generatePassword();
    setFormData({ username: "", email: "", fullName: "", roleId: "", branch: "sucursal1", status: "active", generatedPassword: pwd });
    setShowGenPwd(false);
    setShowModal(true);
  };

  const openEdit = (u: UserData) => {
    setModalMode("edit");
    setSelectedUser(u);
    setFormData({ username: u.username, email: u.email, fullName: u.fullName, roleId: u.roleId, branch: u.branch, status: u.status, generatedPassword: "" });
    setShowGenPwd(false);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setSelectedUser(null); };

  const copyPwd = () => {
    try {
      const ta = document.createElement("textarea");
      ta.value = formData.generatedPassword;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      toast.success("Contraseña copiada al portapapeles");
    } catch {
      toast.error("No se pudo copiar. Cópiala manualmente.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username.trim()) { toast.error("El nombre de usuario es obligatorio"); return; }
    if (!formData.email.trim())    { toast.error("El email es obligatorio"); return; }
    if (!formData.roleId)          { toast.error("Debes seleccionar un rol"); return; }
    if (modalMode === "create") {
      const roleName = getRoleName(formData.roleId);
      setUsers(prev => [...prev, {
        id: String(Date.now()),
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName || formData.username,
        roleId: formData.roleId,
        branch: formData.branch,
        status: "active",
        mustChangePassword: true,
        createdAt: new Date().toISOString().split("T")[0],
        lastLogin: "Nunca",
      }]);
      toast.success(`✅ Usuario "${formData.username}" creado como ${roleName}. Contraseña temporal enviada a ${formData.email}.`);
    } else {
      setUsers(prev => prev.map(u => u.id === selectedUser?.id
        ? { ...u, username: formData.username, email: formData.email, fullName: formData.fullName, roleId: formData.roleId, branch: formData.branch, status: formData.status }
        : u
      ));
      toast.success("Usuario actualizado exitosamente");
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("¿Eliminar este usuario?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
      toast.success("Usuario eliminado");
    }
  };
  const toggleStatus = (id: string) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u));
    const u = users.find(x => x.id === id);
    toast.success(u?.status === "active" ? "Usuario desactivado" : "Usuario activado");
  };
  const sendCredentials = (u: UserData) => toast.success(`Credenciales enviadas a ${u.email}`);
  const openReset = (u: UserData) => {
    setSelectedUser(u);
    setResetData({ newPassword: "", confirmPassword: "" });
    setShowResetModal(true);
  };
  const closeReset = () => { setShowResetModal(false); setSelectedUser(null); setShowResetPwd(false); };
  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetData.newPassword !== resetData.confirmPassword) { toast.error("Las contraseñas no coinciden"); return; }
    if (resetData.newPassword.length < 6) { toast.error("Mínimo 6 caracteres"); return; }
    toast.success(`Contraseña actualizada para ${selectedUser?.username}`);
    closeReset();
  };

  const getRoleBadge = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${isLight ? "bg-gray-100 text-gray-400" : "bg-white/10 text-gray-500"}`}>
        — Sin asignar
      </span>
    );
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
        style={{ backgroundColor: role.color + "22", color: role.color }}>
        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: role.color }} />
        {role.name}
      </span>
    );
  };

  const metrics = [
    { label: "Total Usuarios", val: users.length,                                        icon: <Users     className="w-5 h-5 text-primary"   />, bg: "bg-primary/20"   },
    { label: "Activos",        val: users.filter(u => u.status === "active").length,      icon: <UserCheck className="w-5 h-5 text-green-400" />, bg: "bg-green-500/20" },
    { label: "Inactivos",      val: users.filter(u => u.status === "inactive").length,    icon: <User      className="w-5 h-5 text-red-400"   />, bg: "bg-red-500/20"   },
    { label: "1er Acceso",     val: users.filter(u => u.mustChangePassword).length,       icon: <Clock     className="w-5 h-5 text-amber-400" />, bg: "bg-amber-500/20" },
  ];

  return (
    <div className="space-y-6 w-full">

      <div className={`border-t ${divB}`} />

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map(m => (
          <div key={m.label} className={`${card} p-4`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs mb-1 ${sub}`}>{m.label}</p>
                <p className={`font-bold text-2xl ${txt}`}>{m.val}</p>
              </div>
              <div className={`w-10 h-10 ${m.bg} rounded-lg flex items-center justify-center`}>{m.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className={`border-t ${divB}`} />

      {/* Botón acción */}
      <div className="flex justify-end">
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20">
          <Plus className="w-4 h-4" /> Nuevo Usuario
        </button>
      </div>

      {/* Búsqueda + filtros */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-lg border text-sm ${isLight ? "bg-white border-gray-300" : "bg-[#0f1825] border-white/10"}`}>
          <Search className={`w-4 h-4 flex-shrink-0 ${sub}`} />
          <input type="text" placeholder="Buscar por usuario, email o nombre..." value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent outline-none text-sm ${txt} placeholder:text-gray-500`} />
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${isLight ? "bg-white border-gray-300" : "bg-[#0f1825] border-white/10"}`}>
          <Filter className={`w-4 h-4 ${sub}`} />
          <select value={branchFilter} onChange={e => setBranchFilter(e.target.value)} className={`bg-transparent outline-none text-sm ${txt}`}>
            <option value="all" className={OB}>Todas las sucursales</option>
            {BRANCHES.map(b => <option key={b.id} value={b.id} className={OB}>{b.name}</option>)}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className={`${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${divB} ${isLight ? "bg-gray-50" : "bg-white/[0.03]"}`}>
                {["Usuario", "Nombre Completo", "Rol", "Sucursal", "Estado", "Acciones"].map(h => (
                  <th key={h} className={thCls}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className={`divide-y ${divB}`}>
              {filteredUsers.length > 0 ? filteredUsers.map(u => (
                <tr key={u.id} className={`transition-colors ${hoverRow}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      
                      <div>
                        <div className="flex items-center gap-2">
                          <p className={`text-sm font-medium ${txt}`}>{u.username}</p>
                          {u.mustChangePassword && (
                            null
                          )}
                        </div>
                        
                      </div>
                    </div>
                  </td>
                  <td className={`px-4 py-3 text-sm ${lbl}`}>{u.fullName || <span className={sub}>—</span>}</td>
                  <td className="px-4 py-3">{getRoleBadge(u.roleId)}</td>
                  <td className="px-4 py-3">
                    <div className={`flex items-center gap-1.5 text-sm ${lbl}`}>
                      <Building2 className={`w-3.5 h-3.5 ${sub}`} />
                      {getBranchName(u.branch)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleStatus(u.id)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        u.status === "active"
                          ? isLight ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                          : isLight ? "bg-red-100 text-red-700 hover:bg-red-200"       : "bg-red-500/20 text-red-300 hover:bg-red-500/30"
                      }`}>
                      {u.status === "active"
                        ? <><CheckCircle2 className="w-3 h-3" />Activo</>
                        : <><X className="w-3 h-3" />Inactivo</>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => sendCredentials(u)} title="Reenviar credenciales"
                        className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-green-600 hover:bg-green-50" : "text-gray-500 hover:text-green-400 hover:bg-green-500/10"}`}>
                        <Send className="w-4 h-4" />
                      </button>
                      <button onClick={() => openReset(u)} title="Resetear contraseña"
                        className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-orange-600 hover:bg-orange-50" : "text-gray-500 hover:text-orange-400 hover:bg-orange-500/10"}`}>
                        <KeyRound className="w-4 h-4" />
                      </button>
                      <button onClick={() => openEdit(u)} title="Editar"
                        className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-primary hover:bg-primary/10" : "text-gray-500 hover:text-primary hover:bg-primary/10"}`}>
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(u.id)} title="Eliminar"
                        className={`p-1.5 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-red-600 hover:bg-red-50" : "text-gray-500 hover:text-red-400 hover:bg-red-500/10"}`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Users className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                    <p className={`text-sm font-medium ${txt}`}>No se encontraron usuarios</p>
                    <p className={`text-xs mt-1 ${sub}`}>Intenta con otros términos o crea un nuevo usuario</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          MODAL: Crear / Editar Usuario
      ══════════════════════════════════════════════════ */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md ${modalCls} flex flex-col max-h-[92vh]`}>

            {/* Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${divB} flex-shrink-0`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/20 rounded-lg flex items-center justify-center">
                  {modalMode === "create" ? <Plus className="w-4 h-4 text-primary" /> : <Edit className="w-4 h-4 text-primary" />}
                </div>
                <div>
                  <h3 className={`font-bold text-base ${txt}`}>
                    {modalMode === "create" ? "Nuevo Usuario" : "Editar Usuario"}
                  </h3>
                  <p className={`text-xs ${sub}`}>
                    {modalMode === "create" ? "Datos básicos de acceso al sistema" : `Editando: ${selectedUser?.username}`}
                  </p>
                </div>
              </div>
              <button onClick={closeModal} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aviso — solo al crear */}
            {modalMode === "create" && (
              <div className={`mx-6 mt-5 flex items-start gap-3 px-4 py-3 rounded-xl border text-xs ${isLight ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-blue-500/10 border-blue-500/20 text-blue-300"}`}>
                <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold mb-0.5">Solo datos de acceso</p>
                  <p className={isLight ? "text-blue-600" : "text-blue-400/90"}>
                    Completa los datos personales (cédula, teléfono, cargo, etc.) en el módulo de{" "}
                    <strong>Empleados</strong>. El usuario deberá cambiar su contraseña en el primer acceso.
                  </p>
                </div>
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

              {/* Usuario */}
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>
                  Nombre de usuario <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <UserCheck className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                  <input type="text" value={formData.username}
                    onChange={e => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/\s/g, "") })}
                    placeholder="jperez" className={INpl} required />
                </div>
                <p className={`text-xs mt-1 ${sub}`}>Sin espacios · solo minúsculas</p>
              </div>

              {/* Email */}
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>
                  Correo electrónico <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                  <input type="email" value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    placeholder="usuario@empresa.com" className={INpl} required />
                </div>
              </div>

              {/* Contraseña autogenerada — solo al crear */}
              {modalMode === "create" && (
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>
                    Contraseña temporal autogenerada
                  </label>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${isLight ? "bg-gray-50 border-gray-300" : "bg-[#0f1825] border-white/10"}`}>
                    {/* Contraseña oculta o visible */}
                    <span className={`flex-1 font-mono text-sm tracking-widest ${txt}`}>
                      {showGenPwd ? formData.generatedPassword : "•".repeat(formData.generatedPassword.length)}
                    </span>
                    <button type="button" onClick={() => setShowGenPwd(!showGenPwd)} title="Ver / ocultar"
                      className={`p-1 rounded transition-colors ${sub} hover:text-primary`}>
                      {showGenPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button type="button" onClick={copyPwd} title="Copiar contraseña"
                      className={`p-1 rounded transition-colors ${sub} hover:text-primary`}>
                      <Copy className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={newGeneratedPwd} title="Regenerar contraseña"
                      className={`p-1 rounded transition-colors ${sub} hover:text-primary`}>
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  {/* Aviso de envío */}
                  <div className={`flex items-center gap-2 mt-2 px-3 py-2 rounded-lg text-xs ${isLight ? "bg-green-50 border border-green-200 text-green-700" : "bg-green-500/10 border border-green-500/20 text-green-400"}`}>
                    <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Esta contraseña se enviará automáticamente al correo del usuario al crear la cuenta.</span>
                  </div>
                  {/* Indicador de cambio obligatorio */}
                  <div className={`flex items-center gap-2 mt-1.5 px-3 py-2 rounded-lg text-xs ${isLight ? "bg-amber-50 border border-amber-200 text-amber-700" : "bg-amber-500/10 border border-amber-500/20 text-amber-400"}`}>
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>El usuario <strong>deberá cambiar la contraseña</strong> en su primer inicio de sesión.</span>
                  </div>
                </div>
              )}

              {/* Rol — dinámico desde RolesContext */}
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>
                  Rol del sistema <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Shield className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                  <select value={formData.roleId}
                    onChange={e => setFormData({ ...formData, roleId: e.target.value })}
                    className={`${INpl} appearance-none`} required>
                    <option value="" className={OB}>— Seleccionar rol —</option>
                    {roles.map(r => (
                      <option key={r.id} value={r.id} className={OB}>{r.name}</option>
                    ))}
                  </select>
                </div>
                {/* Descripción del rol seleccionado */}
                {formData.roleId && (() => {
                  const r = roles.find(x => x.id === formData.roleId);
                  return r ? (
                    <div className={`flex items-start gap-2 mt-2 px-3 py-2 rounded-lg text-xs border ${isLight ? "bg-gray-50 border-gray-200 text-gray-600" : "bg-white/[0.04] border-white/10 text-gray-400"}`}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: r.color }} />
                      <span><strong className={txt}>{r.name}:</strong> {r.description}</span>
                    </div>
                  ) : null;
                })()}
              </div>

              {/* Sucursal */}
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>
                  Sucursal asignada <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                  <select value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })}
                    className={`${INpl} appearance-none`}>
                    {BRANCHES.map(b => <option key={b.id} value={b.id} className={OB}>{b.name}</option>)}
                  </select>
                </div>
              </div>

              {/* Estado — solo al editar */}
              {modalMode === "edit" && (
                <div>
                  <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Estado</label>
                  <select value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as "active" | "inactive" })}
                    className={IN}>
                    <option value="active"   className={OB}>Activo</option>
                    <option value="inactive" className={OB}>Inactivo</option>
                  </select>
                </div>
              )}
            </form>

            {/* Footer */}
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t flex-shrink-0 ${divB} ${isLight ? "bg-gray-50" : "bg-white/[0.02]"}`}>
              <button type="button" onClick={closeModal}
                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-100" : "border-white/15 text-gray-300 hover:bg-white/10"}`}>
                Cancelar
              </button>
              <button onClick={handleSubmit as any}
                disabled={!formData.username || !formData.email || !formData.roleId}
                className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors">
                {modalMode === "create" ? <><Send className="w-4 h-4" />Crear y enviar credenciales</> : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          MODAL: Resetear contraseña
      ══════════════════════════════════════════════════ */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-sm ${modalCls}`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${divB}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <KeyRound className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${txt}`}>Resetear Contraseña</h3>
                  <p className={`text-xs ${sub}`}>{selectedUser?.username}</p>
                </div>
              </div>
              <button onClick={closeReset} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-500 hover:bg-gray-100" : "text-gray-400 hover:bg-white/5"}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleReset} className="p-6 space-y-4">
              <div className={`flex items-start gap-2 px-3 py-2.5 rounded-lg text-xs border ${isLight ? "bg-amber-50 border-amber-200 text-amber-700" : "bg-amber-500/10 border-amber-500/20 text-amber-300"}`}>
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Se enviará la nueva contraseña al correo del usuario y se solicitará cambiarla en el siguiente acceso.</span>
              </div>
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Nueva contraseña <span className="text-red-400">*</span></label>
                <div className="relative">
                  <KeyRound className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                  <input type={showResetPwd ? "text" : "password"} value={resetData.newPassword}
                    onChange={e => setResetData({ ...resetData, newPassword: e.target.value })}
                    placeholder="••••••••" className={`${INpl} pr-9`} required />
                  <button type="button" onClick={() => setShowResetPwd(!showResetPwd)}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 ${sub} hover:text-primary`}>
                    {showResetPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Confirmar contraseña <span className="text-red-400">*</span></label>
                <div className="relative">
                  <KeyRound className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${sub}`} />
                  <input type="password" value={resetData.confirmPassword}
                    onChange={e => setResetData({ ...resetData, confirmPassword: e.target.value })}
                    placeholder="••••••••" className={INpl} required />
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={closeReset}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${isLight ? "border-gray-300 text-gray-700 hover:bg-gray-100" : "border-white/15 text-gray-300 hover:bg-white/10"}`}>
                  Cancelar
                </button>
                <button type="submit" className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-medium transition-colors">
                  <Send className="w-4 h-4" /> Actualizar y notificar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}