import { useState } from "react";
import { useNavigate } from "react-router";
import {
  CreditCard,
  Settings as SettingsIcon,
  LogOut,
  Bell,
  Building2,
  Package,
  Menu as MenuIcon,
  Plus,
  Edit,
  Eye,
  Trash2,
  X,
  Save,
  FileText,
  Users,
  Calculator,
  BarChart3,
  ShoppingCart,
  ArrowRight,
  Sun,
  Moon,
  Layers,
} from "lucide-react";
import { ProfileModal } from "../components/profile-modal";
import { useTheme } from "../contexts/theme-context";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  parent: string | null;
  order: number;
  isActive: boolean;
  module: string;
  subMenuCount?: number;
}

export default function MenuManagementPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNewMenuModal, setShowNewMenuModal] = useState(false);
  const [showEditMenuModal, setShowEditMenuModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState("Facturas");
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);

  const [userProfile, setUserProfile] = useState({
    name: "Super Admin",
    email: "admin@ticsoftec.com",
    phone: "+593 99 123 4567",
    role: "Administrador de Sistema",
    avatar: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    path: "",
    icon: "FileText",
    parent: null as string | null,
    order: 1,
    isActive: true,
    module: "Facturas",
  });

  const modules = [
    { id: "facturas", name: "Facturas", icon: FileText, count: 3 },
    { id: "clientes", name: "Clientes", icon: Users, count: 2 },
    { id: "inventario", name: "Inventario", icon: Package, count: 4 },
    { id: "reportes", name: "Reportes", icon: BarChart3, count: 5 },
    { id: "contabilidad", name: "Contabilidad", icon: Calculator, count: 3 },
    { id: "compras", name: "Compras", icon: ShoppingCart, count: 2 },
    { id: "configuracion", name: "Configuración", icon: SettingsIcon, count: 6 },
  ];

  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Emisión de Facturas",
      description: "Crear y emitir facturas electrónicas",
      path: "/facturas/emision",
      icon: "FileText",
      parent: null,
      order: 1,
      isActive: true,
      module: "Facturas",
      subMenuCount: 2,
    },
    {
      id: "2",
      name: "Notas de Crédito",
      description: "Gestión de devoluciones y anulaciones",
      path: "/facturas/notas-credito",
      icon: "FileText",
      parent: null,
      order: 2,
      isActive: true,
      module: "Facturas",
      subMenuCount: 0,
    },
    {
      id: "3",
      name: "Notas de Débito",
      description: "Cargos adicionales a facturas",
      path: "/facturas/notas-debito",
      icon: "FileText",
      parent: null,
      order: 3,
      isActive: true,
      module: "Facturas",
      subMenuCount: 0,
    },
    {
      id: "4",
      name: "Gestión de Clientes",
      description: "Administrar información de clientes",
      path: "/clientes/gestion",
      icon: "Users",
      parent: null,
      order: 1,
      isActive: true,
      module: "Clientes",
      subMenuCount: 1,
    },
    {
      id: "5",
      name: "Grupos de Clientes",
      description: "Clasificación y segmentación",
      path: "/clientes/grupos",
      icon: "Users",
      parent: null,
      order: 2,
      isActive: true,
      module: "Clientes",
      subMenuCount: 0,
    },
    {
      id: "6",
      name: "Productos",
      description: "Gestión de productos y servicios",
      path: "/inventario/productos",
      icon: "Package",
      parent: null,
      order: 1,
      isActive: true,
      module: "Inventario",
      subMenuCount: 3,
    },
    {
      id: "7",
      name: "Categorías",
      description: "Organización de productos",
      path: "/inventario/categorias",
      icon: "Package",
      parent: null,
      order: 2,
      isActive: true,
      module: "Inventario",
      subMenuCount: 0,
    },
    {
      id: "8",
      name: "Kardex",
      description: "Historial de movimientos",
      path: "/inventario/kardex",
      icon: "Package",
      parent: null,
      order: 3,
      isActive: true,
      module: "Inventario",
      subMenuCount: 0,
    },
    {
      id: "9",
      name: "Ajustes de Inventario",
      description: "Correcciones y ajustes de stock",
      path: "/inventario/ajustes",
      icon: "Package",
      parent: null,
      order: 4,
      isActive: true,
      module: "Inventario",
      subMenuCount: 0,
    },
  ]);

  const handleOpenNewModal = () => {
    setFormData({
      name: "",
      description: "",
      path: "",
      icon: "FileText",
      parent: null,
      order: getModuleMenus(selectedModule).length + 1,
      isActive: true,
      module: selectedModule,
    });
    setShowNewMenuModal(true);
  };

  const handleEditMenu = (menu: MenuItem) => {
    setSelectedMenu(menu);
    setFormData({
      name: menu.name,
      description: menu.description,
      path: menu.path,
      icon: menu.icon,
      parent: menu.parent,
      order: menu.order,
      isActive: menu.isActive,
      module: menu.module,
    });
    setShowEditMenuModal(true);
  };

  const handleDeleteMenu = (menu: MenuItem) => {
    if (confirm(`¿Estás seguro de eliminar el menú "${menu.name}"?`)) {
      setMenuItems(menuItems.filter(m => m.id !== menu.id));
    }
  };

  const handleSaveMenu = () => {
    const newMenu: MenuItem = {
      id: Date.now().toString(),
      ...formData,
      subMenuCount: 0,
    };
    setMenuItems([...menuItems, newMenu]);
    setShowNewMenuModal(false);
  };

  const handleUpdateMenu = () => {
    if (!selectedMenu) return;
    setMenuItems(menuItems.map(m => m.id === selectedMenu.id ? { ...m, ...formData } : m));
    setShowEditMenuModal(false);
  };

  const getModuleMenus = (moduleName: string) => {
    return menuItems.filter(m => m.module === moduleName).sort((a, b) => a.order - b.order);
  };

  const getModuleDescription = (moduleName: string) => {
    const descriptions: Record<string, string> = {
      "Facturas": "Facturación electrónica completa",
      "Clientes": "Gestión de clientes y contactos",
      "Inventario": "Control de productos y stock",
      "Reportes": "Análisis y estadísticas",
      "Contabilidad": "Gestión contable y financiera",
      "Compras": "Gestión de compras y proveedores",
      "Configuración": "Ajustes del sistema",
    };
    return descriptions[moduleName] || "";
  };

  return (
    <div className={`min-h-screen ${
      theme === "light"
        ? "bg-gradient-to-br from-gray-50 via-white to-gray-100"
        : "bg-gradient-to-br from-secondary via-secondary to-[#1a1f2e]"
    }`}>
      {/* Header */}
      <header className={`border-b sticky top-0 z-40 ${
        theme === "light"
          ? "border-gray-200 bg-white/90 backdrop-blur-sm"
          : "border-white/10 bg-secondary/50 backdrop-blur-sm"
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-xl ${theme === "light" ? "text-gray-900" : "text-white"}`}>TicSoftEc</h1>
                <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Administrador de Suscripciones</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Botón de tema */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === "light"
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button className={`p-2 rounded-lg transition-colors relative ${
              theme === "light"
                ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  theme === "light" ? "hover:bg-gray-100" : "hover:bg-white/5"
                }`}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SA</span>
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full ${
                    theme === "light" ? "border-white" : "border-secondary"
                  }`}></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>{userProfile.name}</p>
                  <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>{userProfile.role}</p>
                </div>
              </button>

              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-64 border rounded-xl shadow-2xl overflow-hidden z-50 ${
                  theme === "light"
                    ? "bg-white border-gray-200"
                    : "bg-[#1a2332] border-white/10"
                }`}>
                  <div className={`px-4 py-3 border-b ${
                    theme === "light" ? "border-gray-200" : "border-white/10"
                  }`}>
                    <p className={`font-medium text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>{userProfile.name}</p>
                    <p className={`text-xs ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>{userProfile.email}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowProfileModal(true);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${
                        theme === "light"
                          ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <SettingsIcon className="w-4 h-4" />
                      <span className="text-sm">Mi Perfil</span>
                    </button>
                    <div className={`border-t my-2 ${theme === "light" ? "border-gray-200" : "border-white/10"}`}></div>
                    <button
                      onClick={() => navigate("/")}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-red-400 transition-colors text-left ${
                        theme === "light" ? "hover:bg-gray-100" : "hover:bg-white/5"
                      } hover:text-red-300`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className={`px-6 border-t ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
          <div className="flex items-center gap-1 overflow-x-auto">
            <button
              onClick={() => navigate("/admin/companies")}
              className={`flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 border-transparent transition-all ${
                theme === "light"
                  ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <Building2 className="w-4 h-4" />
              Gestión de Empresas
            </button>
            <button
              onClick={() => navigate("/admin/plan-configuration")}
              className={`flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 border-transparent transition-all ${
                theme === "light"
                  ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <SettingsIcon className="w-4 h-4" />
              Configuración de Planes
            </button>
            <button
              onClick={() => navigate("/admin/module-configuration")}
              className={`flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 border-transparent transition-all ${
                theme === "light"
                  ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100"
                  : "text-gray-500 hover:text-white hover:bg-white/5"
              }`}
            >
              <Package className="w-4 h-4" />
              Configuración de Módulos
            </button>
            <button
              onClick={() => navigate("/admin/menu-management")}
              className={`flex items-center gap-2 px-5 py-3 font-medium text-sm whitespace-nowrap border-b-2 border-primary transition-all ${
                theme === "light"
                  ? "text-primary bg-primary/5"
                  : "text-white bg-primary/5"
              }`}
            >
              <MenuIcon className={`w-4 h-4 ${theme === "light" ? "text-primary" : ""}`} />
              Gestión de Menús
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Panel izquierdo - Módulos */}
          <div className="col-span-12 lg:col-span-3">
            <div className={`border rounded-xl p-4 ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-secondary border-white/10"
            }`}>
              <div className="flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-primary" />
                <h3 className={`font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                  Módulos del Sistema
                </h3>
              </div>
              <div className="space-y-2">
                {modules.map((module) => {
                  const Icon = module.icon;
                  const isSelected = selectedModule === module.name;
                  return (
                    <button
                      key={module.id}
                      onClick={() => setSelectedModule(module.name)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                        isSelected
                          ? theme === "light"
                            ? "bg-primary/10 border-2 border-primary"
                            : "bg-primary/10 border-2 border-primary"
                          : theme === "light"
                          ? "bg-gray-50 border-2 border-transparent hover:border-gray-300"
                          : "bg-[#1a2332] border-2 border-transparent hover:border-white/10"
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        isSelected
                          ? "bg-primary/20"
                          : theme === "light"
                          ? "bg-gray-200"
                          : "bg-white/5"
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          isSelected ? "text-primary" : theme === "light" ? "text-gray-600" : "text-gray-400"
                        }`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className={`text-sm font-medium ${
                          isSelected
                            ? "text-primary"
                            : theme === "light"
                            ? "text-gray-900"
                            : "text-white"
                        }`}>
                          {module.name}
                        </p>
                        <p className={`text-xs ${
                          theme === "light" ? "text-gray-500" : "text-gray-500"
                        }`}>
                          {module.count} menús
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Panel derecho - Menús del módulo seleccionado */}
          <div className="col-span-12 lg:col-span-9">
            <div className={`border rounded-xl ${
              theme === "light"
                ? "bg-white border-gray-200"
                : "bg-secondary border-white/10"
            }`}>
              {/* Header del módulo */}
              <div className={`flex items-center justify-between px-6 py-4 border-b ${
                theme === "light" ? "border-gray-200" : "border-white/10"
              }`}>
                <div>
                  <h2 className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                    {selectedModule}
                  </h2>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                    {getModuleDescription(selectedModule)}
                  </p>
                </div>
                <button
                  onClick={handleOpenNewModal}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-white font-medium flex items-center gap-2 transition-all text-sm shadow-lg shadow-primary/20"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Menú
                </button>
              </div>

              {/* Lista de menús */}
              <div className="p-6 space-y-3">
                {getModuleMenus(selectedModule).map((menu) => (
                  <div
                    key={menu.id}
                    className={`border rounded-lg p-4 transition-all ${
                      theme === "light"
                        ? "bg-gray-50 border-gray-200 hover:border-primary/50"
                        : "bg-[#1a2332] border-white/10 hover:border-primary/50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className={`flex items-center gap-2 ${
                          theme === "light" ? "text-gray-500" : "text-gray-500"
                        }`}>
                          <ArrowRight className="w-4 h-4" />
                          <span className="text-sm font-medium">Orden: {menu.order}</span>
                        </div>
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className={`font-semibold mb-1 ${
                            theme === "light" ? "text-gray-900" : "text-white"
                          }`}>
                            {menu.name}
                          </h4>
                          <p className={`text-sm mb-2 ${
                            theme === "light" ? "text-gray-600" : "text-gray-400"
                          }`}>
                            {menu.description}
                          </p>
                          <div className="flex items-center gap-4">
                            <span className={`text-xs font-mono ${
                              theme === "light" ? "text-blue-600" : "text-blue-400"
                            }`}>
                              {menu.path}
                            </span>
                            {menu.subMenuCount !== undefined && menu.subMenuCount > 0 && (
                              <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-md text-xs">
                                {menu.subMenuCount} submenú{menu.subMenuCount > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenNewModal()}
                          className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"
                          title="Agregar submenú"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEditMenu(menu)}
                          className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMenu(menu)}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {getModuleMenus(selectedModule).length === 0 && (
                  <div className={`text-center py-12 ${
                    theme === "light" ? "text-gray-500" : "text-gray-500"
                  }`}>
                    <MenuIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No hay menús configurados para este módulo</p>
                    <button
                      onClick={handleOpenNewModal}
                      className="mt-4 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-white font-medium text-sm transition-all"
                    >
                      Crear primer menú
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de perfil */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
        onSave={(updatedProfile) => {
          setUserProfile(updatedProfile);
          setShowProfileModal(false);
        }}
      />

      {/* Modal Nuevo/Editar Menú */}
      {(showNewMenuModal || showEditMenuModal) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`w-full max-w-2xl border rounded-xl shadow-2xl my-8 ${
            theme === "light"
              ? "bg-white border-gray-200"
              : "bg-secondary border-white/10"
          }`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${
              theme === "light" ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#232d3f]"
            }`}>
              <h3 className={`font-bold text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                {showNewMenuModal ? "Nuevo Menú" : "Editar Menú"}
              </h3>
              <button
                onClick={() => {
                  setShowNewMenuModal(false);
                  setShowEditMenuModal(false);
                }}
                className={`p-2 rounded-lg transition-colors ${
                  theme === "light"
                    ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className={`p-6 space-y-4 ${
              theme === "light" ? "bg-white" : "bg-[#232d3f]"
            }`}>
              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}>
                  Nombre del Menú <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                      : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-500"
                  }`}
                  placeholder="Ej: Emisión de Facturas"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}>
                  Descripción
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                      : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-500"
                  }`}
                  placeholder="Descripción breve del menú"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}>
                    Ruta <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.path}
                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono ${
                      theme === "light"
                        ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                        : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-500"
                    }`}
                    placeholder="/facturas/emision"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    theme === "light" ? "text-gray-900" : "text-white"
                  }`}>
                    Orden
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                      theme === "light"
                        ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                        : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-500"
                    }`}
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}>
                  Módulo del Sistema
                </label>
                <select
                  value={formData.module}
                  onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    theme === "light"
                      ? "bg-white border-gray-300 text-gray-900"
                      : "bg-[#0f1621] border-white/10 text-white"
                  }`}
                  disabled
                >
                  <option value={selectedModule}>{selectedModule}</option>
                </select>
                <p className={`text-xs mt-1.5 ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}>
                  El módulo se asigna automáticamente según tu selección
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className={`w-4 h-4 rounded ${
                    theme === "light"
                      ? "bg-white border-gray-300"
                      : "bg-[#1a2332] border-white/10"
                  }`}
                />
                <label htmlFor="isActive" className={`text-sm ${
                  theme === "light" ? "text-gray-900" : "text-white"
                }`}>
                  Menú activo
                </label>
              </div>
            </div>

            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
              theme === "light"
                ? "bg-gray-50 border-gray-200"
                : "bg-[#1a2332] border-white/10"
            }`}>
              <button
                onClick={() => {
                  setShowNewMenuModal(false);
                  setShowEditMenuModal(false);
                }}
                className={`px-6 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  theme === "light"
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    : "bg-white/5 hover:bg-white/10 text-white"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={showNewMenuModal ? handleSaveMenu : handleUpdateMenu}
                className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shadow-lg shadow-primary/20 text-sm font-medium flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {showNewMenuModal ? "Crear Menú" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}