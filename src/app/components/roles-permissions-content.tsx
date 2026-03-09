import { useState } from "react";
import {
  Plus, Search, Edit2, Trash2, X, Save, Shield,
  Eye, FilePlus, Edit, Trash, FileDown,
  CheckCircle2, Users, Lock, Settings, Filter, ChevronDown, ChevronRight,
} from "lucide-react";
import { useRoles, SystemRole, Permission, MODULE_STRUCTURE, ModulePermission, MenuPermission } from "../contexts/roles-context";
import { useTheme } from "../contexts/theme-context";
import React from "react";

type Role = SystemRole;

export function RolesPermissionsContent() {
  const { roles, setRoles, modules } = useRoles();
  const { theme } = useTheme();
  const isLight = theme === "light";

  // ── Estilos ────────────────────────────────────────────────────────────────
  const txt      = isLight ? "text-gray-900"  : "text-white";
  const sub      = isLight ? "text-gray-500"  : "text-gray-400";
  const lbl      = isLight ? "text-gray-600"  : "text-gray-300";
  const divB     = isLight ? "border-gray-200" : "border-white/10";
  const card     = `rounded-xl border ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"}`;
  const modal    = `rounded-2xl border shadow-2xl ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`;
  const IN       = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900 placeholder-gray-400" : "bg-[#0f1825] border-white/10 text-white placeholder-gray-500"}`;
  const OB       = isLight ? "" : "bg-[#0D1B2A]";
  const thCls    = `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide ${sub}`;
  const hoverRow = isLight ? "hover:bg-gray-50" : "hover:bg-white/[0.02]";
  const btnSec   = isLight ? "bg-gray-100 hover:bg-gray-200 text-gray-700" : "bg-white/5 hover:bg-white/10 text-white";

  // ── Estado ─────────────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm]           = useState("");
  const [typeFilter, setTypeFilter]           = useState("all");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal]     = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal]     = useState(false);
  const [selectedRole, setSelectedRole]       = useState<Role | null>(null);
  const [showCopyModal, setShowCopyModal]     = useState(false);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  const emptyPerms = () =>
    modules.map((module) => ({
      module, view: false, create: false, edit: false, delete: false, export: false,
    }));

  const emptyModulePerms = (): ModulePermission[] =>
    MODULE_STRUCTURE.map(moduleStruct => ({
      module: moduleStruct.module,
      menus: moduleStruct.menus.map(menu => ({
        menu,
        view: false,
        create: false,
        edit: false,
        delete: false,
        export: false
      }))
    }));

  const [formData, setFormData] = useState({
    name: "", 
    description: "", 
    permissions: emptyPerms(),
    modulePermissions: emptyModulePerms()
  });

  // ── Filtrado ───────────────────────────────────────────────────────────────
  const filteredRoles = roles.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === "all" || r.type === typeFilter;
    return matchSearch && matchType;
  });

  // ── Helpers ───────────────────────────────────────────────────────────────
  const resetForm = () => setFormData({ name: "", description: "", permissions: emptyPerms(), modulePermissions: emptyModulePerms() });
  const closeModals = () => {
    setShowCreateModal(false); setShowEditModal(false); setShowCopyModal(false); resetForm();
  };

  // ── CRUD ───────────────────────────────────────────────────────────────────
  const handleCreate = () => {
    const nextNum = String(roles.filter(r => r.type === "custom").length + 1).padStart(3, "0");
    setRoles([...roles, {
      id: Date.now().toString(),
      code: `PER-${nextNum}`,
      name: formData.name, description: formData.description,
      type: "custom", usersCount: 0, color: "#6366F1", permissions: formData.permissions,
    }]);
    setShowCreateModal(false); resetForm();
  };

  const handleEdit = () => {
    if (!selectedRole) return;
    setRoles(roles.map((r) =>
      r.id === selectedRole.id
        ? { ...r, name: formData.name, description: formData.description, permissions: formData.permissions }
        : r
    ));
    setShowEditModal(false); setSelectedRole(null); resetForm();
  };

  const handleDelete = () => {
    if (!selectedRole) return;
    setRoles(roles.filter((r) => r.id !== selectedRole.id));
    setShowDeleteModal(false); setSelectedRole(null);
  };

  const handleCopy = () => {
    if (!selectedRole) return;
    const nextNum = String(roles.filter(r => r.type === "custom").length + 1).padStart(3, "0");
    setRoles([...roles, {
      id: Date.now().toString(),
      code: `PER-${nextNum}`,
      name: formData.name, description: formData.description,
      type: "custom", usersCount: 0, color: "#6366F1", permissions: formData.permissions,
    }]);
    setShowCopyModal(false); setSelectedRole(null); resetForm();
  };

  const openViewModal = (role: Role) => { setSelectedRole(role); setShowViewModal(true); };
  const openEditModal = (role: Role) => {
    setSelectedRole(role);
    setFormData({ 
      name: role.name, 
      description: role.description, 
      permissions: role.permissions,
      modulePermissions: role.modulePermissions || emptyModulePerms()
    });
    setShowEditModal(true);
  };
  const openDeleteModal = (role: Role) => { setSelectedRole(role); setShowDeleteModal(true); };

  const updatePermission = (idx: number, field: keyof Omit<Permission, "module">, value: boolean) => {
    const perms = [...formData.permissions];
    perms[idx] = { ...perms[idx], [field]: value };
    setFormData({ ...formData, permissions: perms });
  };

  const toggleAllPermissions = (idx: number, value: boolean) => {
    const perms = [...formData.permissions];
    perms[idx] = { module: perms[idx].module, view: value, create: value, edit: value, delete: value, export: value };
    setFormData({ ...formData, permissions: perms });
  };

  // ── Métricas ───────────────────────────────────────────────────────────────
  const metrics = [
    { label: "Total Roles", val: roles.length,   icon: <Shield       className="w-5 h-5 text-primary"    />, bg: "bg-primary/20"  },
    { label: "Módulos",     val: modules.length,  icon: <Settings     className="w-5 h-5 text-blue-400"   />, bg: "bg-blue-500/20" },
    { label: "Activos",     val: roles.filter(r => r.type === "predefined").length, icon: <CheckCircle2 className="w-5 h-5 text-green-400" />, bg: "bg-green-500/20" },
  ];

  // ── Badge tipo ─────────────────────────────────────────────────────────────
  const getTypeBadge = (type: string) =>
    type === "predefined"
      ? <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary/15 text-primary"><Lock className="w-3 h-3" />Predefinido</span>
      : <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${isLight ? "bg-indigo-50 text-indigo-600" : "bg-indigo-500/20 text-indigo-300"}`}><Settings className="w-3 h-3" />Personalizado</span>;

  // ── Resumen permisos ───────────────────────────────────────────────────────
  const permCount = (role: Role) => role.permissions.reduce((n, p) =>
    n + [p.view, p.create, p.edit, p.delete, p.export].filter(Boolean).length, 0);
  const permTotal = (role: Role) => role.permissions.length * 5;

  return (
    <div className="space-y-6 w-full">

      <div className={`border-t ${divB}`} />

      {/* ── Métricas ── */}
      <div className="grid grid-cols-3 gap-4">
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

      {/* ── Botón acción ── */}
      <div className="flex justify-end">
        <button
          onClick={() => { resetForm(); setShowCreateModal(true); }}
          className="inline-flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" /> Nuevo Rol
        </button>
      </div>

      {/* ── Búsqueda + filtro ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-lg border text-sm ${isLight ? "bg-white border-gray-300" : "bg-[#0f1825] border-white/10"}`}>
          <Search className={`w-4 h-4 flex-shrink-0 ${sub}`} />
          <input
            type="text"
            placeholder="Buscar por nombre o descripción..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={`flex-1 bg-transparent outline-none text-sm ${txt} placeholder:text-gray-500`}
          />
        </div>
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${isLight ? "bg-white border-gray-300" : "bg-[#0f1825] border-white/10"}`}>
          <Filter className={`w-4 h-4 ${sub}`} />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className={`bg-transparent outline-none text-sm ${txt}`}
          >
            <option value="all"        className={OB}>Todos los tipos</option>
            <option value="predefined" className={OB}>Predefinidos</option>
            <option value="custom"     className={OB}>Personalizados</option>
          </select>
        </div>
      </div>

      {/* ── Tabla ── */}
      <div className={`${card} overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`border-b ${divB} ${isLight ? "bg-gray-50" : "bg-white/[0.03]"}`}>
                <th className={thCls}>Código</th>
                <th className={thCls}>Nombre</th>
                <th className={thCls}>Descripción</th>
                <th className={`${thCls} text-center`}>Estado</th>
                <th className={`${thCls} text-center`}>Acciones</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${divB}`}>
              {filteredRoles.length > 0 ? filteredRoles.map((role) => (
                <tr key={role.id} className={`transition-colors ${hoverRow}`}>

                  {/* Código */}
                  <td className="px-4 py-3">
                    <span className={`text-sm font-mono font-medium ${sub}`}>
                      {role.code}
                    </span>
                  </td>

                  {/* Nombre */}
                  <td className="px-4 py-3">
                    <span className={`text-sm font-semibold ${txt}`}>{role.name}</span>
                  </td>

                  {/* Descripción */}
                  <td className={`px-4 py-3 text-sm ${sub} max-w-xs`}>
                    <span className="line-clamp-1">{role.description}</span>
                  </td>

                  {/* Estado */}
                  <td className="px-4 py-3 text-center">
                    {role.type === "predefined" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/15 text-green-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Activo
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${isLight ? "bg-gray-100 text-gray-500" : "bg-white/10 text-gray-400"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full inline-block ${isLight ? "bg-gray-400" : "bg-gray-500"}`} /> Personalizado
                      </span>
                    )}
                  </td>

                  {/* Acciones: iconos sin texto */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => openViewModal(role)}
                        title="Ver permisos"
                        className={`transition-colors ${isLight ? "text-gray-400 hover:text-emerald-600" : "text-gray-500 hover:text-emerald-400"}`}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openEditModal(role)}
                        title="Editar"
                        className={`transition-colors ${isLight ? "text-gray-400 hover:text-blue-600" : "text-gray-500 hover:text-blue-400"}`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => openDeleteModal(role)}
                        title="Eliminar"
                        className={`transition-colors ${isLight ? "text-gray-400 hover:text-red-500" : "text-gray-500 hover:text-red-400"}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <Shield className={`w-10 h-10 mx-auto mb-3 ${isLight ? "text-gray-300" : "text-gray-600"}`} />
                    <p className={`text-sm font-medium ${txt}`}>No se encontraron roles</p>
                    <p className={`text-xs mt-1 ${sub}`}>Intenta con otros términos o crea un nuevo rol</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pie de tabla - REMOVED */}
      </div>

      {/* ══ Modal Ver Permisos ══════════════════════════════════════════════════ */}
      {showViewModal && selectedRole && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-3xl ${modal} max-h-[90vh] overflow-y-auto`}>

            {/* Header */}
            <div className={`sticky top-0 z-10 border-b ${divB} px-6 py-4 flex items-center justify-between rounded-t-2xl ${isLight ? "bg-white" : "bg-[#0D1B2A]"}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${selectedRole.color}20` }}>
                  <Shield className="w-4 h-4" style={{ color: selectedRole.color }} />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${txt}`}>{selectedRole.name}</h3>
                  <p className={`text-xs ${sub}`}>{selectedRole.description}</p>
                </div>
              </div>
              <button
                onClick={() => { setShowViewModal(false); setSelectedRole(null); }}
                className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <h4 className={`font-bold text-sm ${txt}`}>Permisos Configurados por Módulo y Menú</h4>
              </div>

              {/* Lista de módulos expandibles */}
              <div className="space-y-3">
                {(selectedRole.modulePermissions || emptyModulePerms()).map((modulePerm, moduleIdx) => {
                  const isExpanded = expandedModules.has(modulePerm.module);
                  const moduleStruct = MODULE_STRUCTURE.find(m => m.module === modulePerm.module);
                  
                  // Contar permisos activos del módulo
                  const activePerms = modulePerm.menus.reduce((acc, menu) => 
                    acc + [menu.view, menu.create, menu.edit, menu.delete, menu.export].filter(Boolean).length, 0
                  );
                  const totalPerms = modulePerm.menus.length * 5;
                  
                  return (
                    <div key={modulePerm.module} className={`border rounded-xl overflow-hidden ${isLight ? "border-gray-200" : "border-white/10"}`}>
                      {/* Header del módulo */}
                      <button
                        onClick={() => {
                          const newExpanded = new Set(expandedModules);
                          if (isExpanded) newExpanded.delete(modulePerm.module);
                          else newExpanded.add(modulePerm.module);
                          setExpandedModules(newExpanded);
                        }}
                        className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${isLight ? "bg-gray-50 hover:bg-gray-100" : "bg-white/[0.03] hover:bg-white/[0.05]"}`}
                      >
                        <div className="flex items-center gap-3">
                          {isExpanded ? <ChevronDown className={`w-4 h-4 ${sub}`} /> : <ChevronRight className={`w-4 h-4 ${sub}`} />}
                          <Settings className="w-4 h-4 text-primary" />
                          <span className={`text-sm font-semibold ${txt}`}>{modulePerm.module}</span>
                          <span className={`text-xs ${sub}`}>({modulePerm.menus.length} menús)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${activePerms > 0 ? "text-green-500" : sub}`}>
                            {activePerms} de {totalPerms} permisos
                          </span>
                        </div>
                      </button>

                      {/* Menús del módulo (expandible) */}
                      {isExpanded && (
                        <div className={`border-t ${divB}`}>
                          <table className="w-full">
                            <thead>
                              <tr className={`border-b ${isLight ? "bg-white border-gray-200" : "bg-white/[0.02] border-white/10"}`}>
                                <th className={`text-left text-xs font-semibold p-3 pl-12 ${sub}`}>Menú</th>
                                {[["Ver", Eye], ["Crear", FilePlus], ["Editar", Edit], ["Eliminar", Trash], ["Exportar", FileDown]].map(([label, Icon]: any) => (
                                  <th key={label} className={`text-center text-xs font-semibold p-2 ${sub}`}>
                                    <div className="flex flex-col items-center gap-0.5">
                                      <Icon className="w-3 h-3" />
                                      <span className="text-[10px]">{label}</span>
                                    </div>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className={`divide-y ${divB}`}>
                              {modulePerm.menus.map((menuPerm, menuIdx) => (
                                <tr key={menuPerm.menu} className={`transition-colors ${hoverRow}`}>
                                  <td className={`p-3 pl-12 text-sm ${txt}`}>{menuPerm.menu}</td>
                                  {(["view","create","edit","delete","export"] as const).map(field => (
                                    <td key={field} className="text-center p-2">
                                      {menuPerm[field] ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                                      ) : (
                                        <span className={`block w-3 h-3 mx-auto rounded-full border-2 ${isLight ? "border-gray-200" : "border-white/10"}`} />
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className={`sticky bottom-0 border-t ${divB} px-6 py-4 flex justify-between items-center rounded-b-2xl ${isLight ? "bg-white" : "bg-[#0D1B2A]"}`}>
              <p className={`text-xs ${sub}`}>
                Rol: <span className={`font-semibold ${txt}`}>{selectedRole.name}</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowViewModal(false); openEditModal(selectedRole); }}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${btnSec}`}
                >
                  <Edit2 className="w-3.5 h-3.5" /> Editar Rol
                </button>
                <button
                  onClick={() => { setShowViewModal(false); setSelectedRole(null); }}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal Crear / Editar / Copiar ══════════════════════════════════════ */}
      {(showCreateModal || showEditModal || showCopyModal) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl ${modal} max-h-[90vh] overflow-y-auto`}>

            {/* Header */}
            <div className={`sticky top-0 z-10 border-b ${divB} px-6 py-4 flex items-center justify-between rounded-t-2xl ${isLight ? "bg-white" : "bg-[#0D1B2A]"}`}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <h3 className={`font-bold text-base ${txt}`}>
                  {showCreateModal ? "Crear Nuevo Rol" : showEditModal ? "Editar Rol" : "Duplicar Rol"}
                </h3>
              </div>
              <button onClick={closeModals} className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              {/* ═══ SECCIÓN 1: DATOS DEL ROL ═══ */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-blue-500/15 rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-500" />
                  </div>
                  <h4 className={`font-bold text-sm ${txt}`}>Información del Rol</h4>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Nombre del Rol <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej: Gerente de Ventas"
                      className={IN}
                    />
                  </div>
                  <div>
                    <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>Descripción <span className="text-red-500">*</span></label>
                    <textarea
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Describe las responsabilidades de este rol..."
                      rows={3}
                      className={`${IN} resize-none`}
                    />
                  </div>
                </div>
              </div>

              {/* Separador */}
              <div className={`border-t ${divB}`}></div>

              {/* ═══ SECCIÓN 2: PERMISOS POR MÓDULO Y MENÚ ═══ */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>
                  <h4 className={`font-bold text-sm ${txt}`}>Configurar Permisos por Módulo y Menú</h4>
                </div>

                {/* Lista de módulos expandibles */}
                <div className="space-y-3">
                  {formData.modulePermissions.map((modulePerm, moduleIdx) => {
                    const isExpanded = expandedModules.has(modulePerm.module);
                    const moduleStruct = MODULE_STRUCTURE.find(m => m.module === modulePerm.module);
                    
                    return (
                      <div key={modulePerm.module} className={`border rounded-xl overflow-hidden ${isLight ? "border-gray-200" : "border-white/10"}`}>
                        {/* Header del módulo */}
                        <button
                          onClick={() => {
                            const newExpanded = new Set(expandedModules);
                            if (isExpanded) newExpanded.delete(modulePerm.module);
                            else newExpanded.add(modulePerm.module);
                            setExpandedModules(newExpanded);
                          }}
                          className={`w-full px-4 py-3 flex items-center justify-between transition-colors ${isLight ? "bg-gray-50 hover:bg-gray-100" : "bg-white/[0.03] hover:bg-white/[0.05]"}`}
                        >
                          <div className="flex items-center gap-3">
                            {isExpanded ? <ChevronDown className={`w-4 h-4 ${sub}`} /> : <ChevronRight className={`w-4 h-4 ${sub}`} />}
                            <Settings className="w-4 h-4 text-primary" />
                            <span className={`text-sm font-semibold ${txt}`}>{modulePerm.module}</span>
                            <span className={`text-xs ${sub}`}>({modulePerm.menus.length} menús)</span>
                          </div>
                        </button>

                        {/* Menús del módulo (expandible) */}
                        {isExpanded && (
                          <div className={`border-t ${divB}`}>
                            <table className="w-full">
                              <thead>
                                <tr className={`border-b ${isLight ? "bg-white border-gray-200" : "bg-white/[0.02] border-white/10"}`}>
                                  <th className={`text-left text-xs font-semibold p-3 pl-12 ${sub}`}>Menú</th>
                                  {[["Ver", Eye], ["Crear", FilePlus], ["Editar", Edit], ["Eliminar", Trash], ["Exportar", FileDown]].map(([label, Icon]: any) => (
                                    <th key={label} className={`text-center text-xs font-semibold p-2 ${sub}`}>
                                      <div className="flex flex-col items-center gap-0.5">
                                        <Icon className="w-3 h-3" />
                                        <span className="text-[10px]">{label}</span>
                                      </div>
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className={`divide-y ${divB}`}>
                                {modulePerm.menus.map((menuPerm, menuIdx) => (
                                  <tr key={menuPerm.menu} className={`transition-colors ${hoverRow}`}>
                                    <td className={`p-3 pl-12 text-sm ${txt}`}>{menuPerm.menu}</td>
                                    {(["view","create","edit","delete","export"] as const).map(field => (
                                      <td key={field} className="text-center p-2">
                                        <input
                                          type="checkbox"
                                          checked={menuPerm[field]}
                                          onChange={e => {
                                            const newModulePerms = [...formData.modulePermissions];
                                            newModulePerms[moduleIdx].menus[menuIdx] = {
                                              ...menuPerm,
                                              [field]: e.target.checked
                                            };
                                            setFormData({ ...formData, modulePermissions: newModulePerms });
                                          }}
                                          className="w-4 h-4 rounded accent-primary cursor-pointer"
                                        />
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className={`sticky bottom-0 border-t ${divB} px-6 py-4 flex justify-end gap-3 rounded-b-2xl ${isLight ? "bg-white" : "bg-[#0D1B2A]"}`}>
              <button onClick={closeModals} className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${btnSec}`}>
                Cancelar
              </button>
              <button
                onClick={showCreateModal ? handleCreate : showEditModal ? handleEdit : handleCopy}
                disabled={!formData.name || !formData.description}
                className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {showCreateModal ? "Crear Rol" : showEditModal ? "Guardar Cambios" : "Crear Copia"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal Eliminar ══════════════════════════════════════════════════════ */}
      {showDeleteModal && selectedRole && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-md ${modal} p-6`}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-10 h-10 bg-red-500/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className={`font-bold text-base ${txt}`}>Eliminar Rol</h3>
                <p className={`text-sm ${sub}`}>Esta acción no se puede deshacer</p>
              </div>
            </div>
            <div className={`border rounded-xl p-4 mb-5 ${isLight ? "bg-gray-50 border-gray-200" : "bg-white/5 border-white/10"}`}>
              <p className={`text-sm ${txt}`}>
                ¿Seguro que deseas eliminar <span className="font-bold">{selectedRole.name}</span>?
              </p>
              {selectedRole.usersCount > 0 && (
                <p className="text-yellow-500 text-xs mt-2">⚠️ Este rol tiene {selectedRole.usersCount} usuarios asignados.</p>
              )}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowDeleteModal(false); setSelectedRole(null); }}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${btnSec}`}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}