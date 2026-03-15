import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  FileText,
  Users,
  Calculator,
  BarChart3,
  ShoppingCart,
  ArrowRight,
  Layers,
  ChevronRight,
  Search,
  List,
  Upload,
  Download,
  Printer,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  TrendingUp,
  TrendingDown,
  PieChart,
  Wallet,
  Receipt,
  Banknote,
  Database,
  HardDrive,
  Server,
  Activity,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Eye,
  EyeOff,
  Zap,
  Cloud,
  Target,
  Briefcase,
  Calendar,
  Globe,
  Package,
  Settings as SettingsIcon,
  Building2,
  Menu as MenuIcon,
  Bell,
} from "lucide-react";
import { useTheme } from "../contexts/theme-context";
import { IconSelector } from "../components/icon-selector";
import { AdminHeader } from "../components/admin-header";
import { ProfileModal } from "../components/profile-modal";
import { toast } from "sonner";
import { useBrand } from "../contexts/brand-context";

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
}

export default function MenuManagementPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logoUrl } = useBrand();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNewMenuModal, setShowNewMenuModal] = useState(false);
  const [showEditMenuModal, setShowEditMenuModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState("Facturas");
  const [selectedMenu, setSelectedMenu] = useState<MenuItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState("basic");

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
    { id: "facturas", name: "Facturas", icon: FileText },
    { id: "clientes", name: "Clientes", icon: Users },
    { id: "inventario", name: "Inventario", icon: Package },
    { id: "reportes", name: "Reportes", icon: BarChart3 },
    { id: "contabilidad", name: "Contabilidad", icon: Calculator },
    { id: "compras", name: "Compras", icon: ShoppingCart },
    { id: "configuracion", name: "Configuración", icon: SettingsIcon },
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
    },
    {
      id: "11",
      name: "Nueva Factura",
      description: "Crear factura electrónica",
      path: "/facturas/emision/nueva",
      icon: "Plus",
      parent: "1",
      order: 1,
      isActive: true,
      module: "Facturas",
    },
    {
      id: "12",
      name: "Consultar Facturas",
      description: "Ver facturas emitidas",
      path: "/facturas/emision/consultar",
      icon: "Search",
      parent: "1",
      order: 2,
      isActive: true,
      module: "Facturas",
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
    },
    {
      id: "61",
      name: "Nuevo Producto",
      description: "Registrar producto",
      path: "/inventario/productos/nuevo",
      icon: "Plus",
      parent: "6",
      order: 1,
      isActive: true,
      module: "Inventario",
    },
    {
      id: "62",
      name: "Listado de Productos",
      description: "Ver productos",
      path: "/inventario/productos/listado",
      icon: "List",
      parent: "6",
      order: 2,
      isActive: true,
      module: "Inventario",
    },
    {
      id: "63",
      name: "Importar Productos",
      description: "Importación masiva",
      path: "/inventario/productos/importar",
      icon: "Upload",
      parent: "6",
      order: 3,
      isActive: true,
      module: "Inventario",
    },
  ]);

  const iconMap: Record<string, any> = {
    FileText,
    Plus,
    Search,
    List,
    Upload,
    Download,
    Printer,
    Mail,
    Phone,
    MapPin,
    DollarSign,
    TrendingUp,
    TrendingDown,
    PieChart,
    Wallet,
    Receipt,
    Banknote,
    Package,
    Users,
    Database,
    HardDrive,
    Server,
    Activity,
    AlertCircle,
    CheckCircle,
    XCircle,
    Info,
    Calculator,
    BarChart3,
    ShoppingCart,
    SettingsIcon,
    Bell,
    Building2,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Zap,
    Cloud,
    Target,
    Briefcase,
    Calendar,
    Globe,
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || FileText;
  };

  const availableIcons = [
    { name: "FileText", label: "Documento" },
    { name: "FilePlus", label: "Nuevo Documento" },
    { name: "FileCheck", label: "Doc Verificado" },
    { name: "FileMinus", label: "Doc Menos" },
    { name: "FileSpreadsheet", label: "Hoja Cálculo" },
    { name: "Plus", label: "Más" },
    { name: "Search", label: "Buscar" },
    { name: "List", label: "Lista" },
    { name: "Upload", label: "Subir" },
    { name: "Download", label: "Descargar" },
    { name: "Printer", label: "Imprimir" },
    { name: "Mail", label: "Correo" },
    { name: "Phone", label: "Teléfono" },
    { name: "MapPin", label: "Ubicación" },
    { name: "DollarSign", label: "Dólar" },
    { name: "Percent", label: "Porcentaje" },
    { name: "TrendingUp", label: "Tendencia Arriba" },
    { name: "TrendingDown", label: "Tendencia Abajo" },
    { name: "PieChart", label: "Gráfico Circular" },
    { name: "BarChart3", label: "Gráfico Barras" },
    { name: "Wallet", label: "Billetera" },
    { name: "Receipt", label: "Recibo" },
    { name: "Banknote", label: "Billete" },
    { name: "Package", label: "Paquete" },
    { name: "Users", label: "Usuarios" },
    { name: "Database", label: "Base Datos" },
    { name: "HardDrive", label: "Disco Duro" },
    { name: "Server", label: "Servidor" },
    { name: "Activity", label: "Actividad" },
    { name: "Calculator", label: "Calculadora" },
    { name: "ShoppingCart", label: "Carrito" },
    { name: "SettingsIcon", label: "Configuración" },
    { name: "Settings", label: "Ajustes" },
    { name: "Bell", label: "Campana" },
    { name: "Building2", label: "Edificio" },
    { name: "Edit", label: "Editar" },
    { name: "Eye", label: "Ver" },
    { name: "EyeOff", label: "Ocultar" },
    { name: "AlertCircle", label: "Alerta" },
    { name: "CheckCircle", label: "Verificado" },
    { name: "XCircle", label: "Error" },
    { name: "Info", label: "Información" },
    { name: "Zap", label: "Rayo" },
    { name: "Cloud", label: "Nube" },
    { name: "Target", label: "Objetivo" },
    { name: "Briefcase", label: "Maletín" },
    { name: "Calendar", label: "Calendario" },
    { name: "Globe", label: "Globo" },
    { name: "Truck", label: "Camión" },
    { name: "Star", label: "Estrella" },
    { name: "Heart", label: "Corazón" },
    { name: "Share2", label: "Compartir" },
    { name: "MessageSquare", label: "Mensaje" },
    { name: "Filter", label: "Filtro" },
    { name: "RefreshCw", label: "Actualizar" },
    { name: "MoreVertical", label: "Más Vertical" },
    { name: "MoreHorizontal", label: "Más Horizontal" },
    { name: "Copy", label: "Copiar" },
  ];

  const handleOpenNewModal = (parentMenu: MenuItem | null = null) => {
    const moduleMenus = getModuleMenus(selectedModule);
    const parentMenus = moduleMenus.filter((m) => !m.parent);
    const nextOrder = parentMenu
      ? getChildMenus(parentMenu.id).length + 1
      : parentMenus.length + 1;

    setFormData({
      name: "",
      description: "",
      path: "",
      icon: "FileText",
      parent: parentMenu ? parentMenu.id : null,
      order: nextOrder,
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
    const hasChildren = menuItems.some((m) => m.parent === menu.id);
    if (hasChildren) {
      toast.error("No puedes eliminar un menú que tiene submenús. Elimina primero los submenús.");
      return;
    }

    if (confirm(`¿Estás seguro de eliminar el menú "${menu.name}"?`)) {
      setMenuItems(menuItems.filter((m) => m.id !== menu.id));
    }
  };

  const handleSaveMenu = () => {
    if (!formData.name.trim() || !formData.path.trim()) {
      toast.error("El nombre y la ruta son obligatorios");
      return;
    }

    if (!formData.path.startsWith("/")) {
      toast.error("La ruta debe comenzar con /  (ej: /modulo/seccion)");
      return;
    }

    const newMenu: MenuItem = {
      id: Date.now().toString(),
      ...formData,
    };
    setMenuItems([...menuItems, newMenu]);
    setShowNewMenuModal(false);
  };

  const handleUpdateMenu = () => {
    if (!selectedMenu) return;

    if (!formData.name.trim() || !formData.path.trim()) {
      toast.error("El nombre y la ruta son obligatorios");
      return;
    }

    if (!formData.path.startsWith("/")) {
      toast.error("La ruta debe comenzar con /  (ej: /modulo/seccion)");
      return;
    }

    setMenuItems(
      menuItems.map((m) => (m.id === selectedMenu.id ? { ...m, ...formData } : m))
    );
    setShowEditMenuModal(false);
  };

  const getModuleMenus = (moduleName: string) => {
    return menuItems.filter((m) => m.module === moduleName);
  };

  const getParentMenus = (moduleName: string) => {
    return menuItems
      .filter((m) => m.module === moduleName && !m.parent)
      .sort((a, b) => a.order - b.order);
  };

  const getChildMenus = (parentId: string) => {
    return menuItems
      .filter((m) => m.parent === parentId)
      .sort((a, b) => a.order - b.order);
  };

  const getModuleCount = (moduleName: string) => {
    return menuItems.filter((m) => m.module === moduleName).length;
  };

  const getModuleDescription = (moduleName: string) => {
    const descriptions: Record<string, string> = {
      Facturas: "Facturación electrónica completa",
      Clientes: "Gestión de clientes y contactos",
      Inventario: "Control de productos y stock",
      Reportes: "Análisis y estadísticas",
      Contabilidad: "Gestión contable y financiera",
      Compras: "Gestión de compras y proveedores",
      Configuración: "Ajustes del sistema",
    };
    return descriptions[moduleName] || "";
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "light"
          ? "bg-gradient-to-br from-gray-50 via-white to-gray-100"
          : "bg-gradient-to-br from-secondary via-secondary to-[#1a1f2e]"
      }`}
    >
      {/* Header */}
      <AdminHeader userProfile={userProfile} onProfileUpdate={setUserProfile} />

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Panel izquierdo - Módulos */}
          <div className="col-span-12 lg:col-span-3">
            <div
              className={`border rounded-xl p-4 ${
                theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"
              }`}
            >
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
                  const moduleCount = getModuleCount(module.name);
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
                      <div
                        className={`p-2 rounded-lg ${
                          isSelected ? "bg-primary/20" : theme === "light" ? "bg-gray-200" : "bg-white/5"
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 ${
                            isSelected ? "text-primary" : theme === "light" ? "text-gray-600" : "text-gray-400"
                          }`}
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <p
                          className={`text-sm font-medium ${
                            isSelected ? "text-primary" : theme === "light" ? "text-gray-900" : "text-white"
                          }`}
                        >
                          {module.name}
                        </p>
                        <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}>
                          {moduleCount} menú{moduleCount !== 1 ? "s" : ""}
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
            <div
              className={`border rounded-xl ${
                theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"
              }`}
            >
              {/* Header del módulo */}
              <div
                className={`flex items-center justify-between px-6 py-4 border-b ${
                  theme === "light" ? "border-gray-200" : "border-white/10"
                }`}
              >
                <div>
                  <h2 className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                    {selectedModule}
                  </h2>
                  <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                    {getModuleDescription(selectedModule)}
                  </p>
                </div>
                <button
                  onClick={() => handleOpenNewModal(null)}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-white font-medium flex items-center gap-2 transition-all text-sm shadow-lg shadow-primary/20"
                >
                  <Plus className="w-4 h-4" />
                  Nuevo Menú
                </button>
              </div>

              {/* Lista de menús */}
              <div className="p-6 space-y-3">
                {getParentMenus(selectedModule).map((menu) => {
                  const subMenus = getChildMenus(menu.id);
                  const subMenuCount = subMenus.length;
                  const MenuIcon = getIconComponent(menu.icon);

                  return (
                    <div key={menu.id} className="space-y-2">
                      {/* Menú Padre */}
                      <div
                        className={`border rounded-lg p-4 transition-all ${
                          theme === "light"
                            ? "bg-gray-50 border-gray-200 hover:border-primary/50"
                            : "bg-[#1a2332] border-white/10 hover:border-primary/50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div
                              className={`flex items-center gap-2 ${
                                theme === "light" ? "text-gray-500" : "text-gray-500"
                              }`}
                            >
                              <ArrowRight className="w-4 h-4" />
                              <span className="text-sm font-medium">Orden: {menu.order}</span>
                            </div>
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <MenuIcon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h4
                                className={`font-semibold mb-1 ${
                                  theme === "light" ? "text-gray-900" : "text-white"
                                }`}
                              >
                                {menu.name}
                              </h4>
                              <p
                                className={`text-sm mb-2 ${
                                  theme === "light" ? "text-gray-600" : "text-gray-400"
                                }`}
                              >
                                {menu.description}
                              </p>
                              <div className="flex items-center gap-4">
                                <span
                                  className={`text-xs font-mono ${
                                    theme === "light" ? "text-blue-600" : "text-blue-400"
                                  }`}
                                >
                                  {menu.path}
                                </span>
                                {subMenuCount > 0 && (
                                  <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 rounded-md text-xs">
                                    {subMenuCount} submenú{subMenuCount > 1 ? "s" : ""}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenNewModal(menu)}
                              className="p-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 rounded-lg transition-colors"
                              title="Agregar submenú"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleEditMenu(menu)}
                              className="text-gray-400 hover:text-yellow-400 transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteMenu(menu)}
                              className="text-gray-400 hover:text-red-400 transition-colors"
                              title="Eliminar"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Submenús */}
                      {subMenus.map((subMenu) => {
                        const SubMenuIcon = getIconComponent(subMenu.icon);
                        return (
                          <div
                            key={subMenu.id}
                            className={`border rounded-lg p-4 ml-12 transition-all ${
                              theme === "light"
                                ? "bg-white border-gray-200 hover:border-primary/30"
                                : "bg-[#0f1621] border-white/5 hover:border-primary/30"
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-4 flex-1">
                                <div className="flex items-center gap-2">
                                  <ChevronRight className="w-4 h-4 text-primary" />
                                  <span
                                    className={`text-xs font-medium ${
                                      theme === "light" ? "text-gray-500" : "text-gray-500"
                                    }`}
                                  >
                                    Orden: {subMenu.order}
                                  </span>
                                </div>
                                <div
                                  className={`p-2 rounded-lg ${
                                    theme === "light" ? "bg-gray-100" : "bg-white/5"
                                  }`}
                                >
                                  <SubMenuIcon
                                    className={`w-4 h-4 ${
                                      theme === "light" ? "text-gray-600" : "text-gray-400"
                                    }`}
                                  />
                                </div>
                                <div className="flex-1">
                                  <h5
                                    className={`font-medium mb-1 text-sm ${
                                      theme === "light" ? "text-gray-900" : "text-white"
                                    }`}
                                  >
                                    {subMenu.name}
                                  </h5>
                                  <p
                                    className={`text-xs mb-1 ${
                                      theme === "light" ? "text-gray-600" : "text-gray-400"
                                    }`}
                                  >
                                    {subMenu.description}
                                  </p>
                                  <span
                                    className={`text-xs font-mono ${
                                      theme === "light" ? "text-blue-600" : "text-blue-400"
                                    }`}
                                  >
                                    {subMenu.path}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleEditMenu(subMenu)}
                                  className="text-gray-400 hover:text-yellow-400 transition-colors"
                                  title="Editar"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteMenu(subMenu)}
                                  className="text-gray-400 hover:text-red-400 transition-colors"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}

                {getParentMenus(selectedModule).length === 0 && (
                  <div
                    className={`text-center py-12 ${theme === "light" ? "text-gray-500" : "text-gray-500"}`}
                  >
                    <MenuIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No hay menús configurados para este módulo</p>
                    <button
                      onClick={() => handleOpenNewModal(null)}
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
          <div
            className={`w-full max-w-lg border rounded-2xl shadow-2xl my-8 overflow-hidden flex flex-col ${ 
              theme === "light" ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"
            }`}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between px-6 py-3.5 border-b ${
                theme === "light" ? "border-gray-200 bg-gray-50" : "border-white/10 bg-[#232d3f]"
              }`}
            >
              <h3 className={`font-bold text-lg flex items-center gap-3 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                <Plus className="w-5 h-5 text-primary" />
                {showNewMenuModal
                  ? formData.parent
                    ? "Nuevo Submenú"
                    : "Nuevo Menú Principal"
                  : "Editar Menú"}
              </h3>
              <button
                onClick={() => {
                  setShowNewMenuModal(false);
                  setShowEditMenuModal(false);
                  setActiveModalTab("basic");
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

            {/* Tabs */}
            <div className={`flex gap-1 px-6 pt-4 ${theme === "light" ? "bg-white" : "bg-[#1a2332]"}`}>
              <button
                onClick={() => setActiveModalTab("basic")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all text-sm font-medium ${
                  activeModalTab === "basic"
                    ? theme === "light"
                      ? "bg-gray-50 text-gray-900 border-b-4 border-primary"
                      : "bg-[#232d3f] text-white border-b-4 border-primary"
                    : theme === "light"
                    ? "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Información General
              </button>
              <button
                onClick={() => setActiveModalTab("config")}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all text-sm font-medium ${
                  activeModalTab === "config"
                    ? theme === "light"
                      ? "bg-gray-50 text-gray-900 border-b-4 border-primary"
                      : "bg-[#232d3f] text-white border-b-4 border-primary"
                    : theme === "light"
                    ? "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    : "bg-transparent text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <SettingsIcon className="w-4 h-4" />
                Configuración
              </button>
            </div>

            {/* Content */}
            <div className={`p-6 space-y-5 max-h-[60vh] overflow-y-auto ${theme === "light" ? "bg-gray-50" : "bg-[#232d3f]"}`}>
              {/* Tab: General */}
              {activeModalTab === "basic" && (
                <>
                  {/* Sección: Datos del Menú */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <MenuIcon className={`w-4 h-4 ${theme === "light" ? "text-gray-700" : "text-white"}`} />
                      <h4 className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                        Datos del Menú
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label
                          className={`block text-xs font-medium mb-1.5 ${
                            theme === "light" ? "text-gray-700" : "text-gray-300"
                          }`}
                        >
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
                        <label
                          className={`block text-xs font-medium mb-1.5 ${
                            theme === "light" ? "text-gray-700" : "text-gray-300"
                          }`}
                        >
                          Descripción
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                          rows={2}
                          className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                            theme === "light"
                              ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                              : "bg-[#0f1621] border-white/10 text-white placeholder:text-gray-500"
                          }`}
                          placeholder="Descripción breve del menú"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Tab: Configuración */}
              {activeModalTab === "config" && (
                <>
                  {/* Sección: Configuración del Menú */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <SettingsIcon className={`w-4 h-4 ${theme === "light" ? "text-gray-700" : "text-white"}`} />
                      <h4 className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                        Configuración del Menú
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label
                          className={`block text-xs font-medium mb-1.5 ${
                            theme === "light" ? "text-gray-700" : "text-gray-300"
                          }`}
                        >
                          Ícono del Menú <span className="text-red-400">*</span>
                        </label>
                        <IconSelector
                          selectedIcon={formData.icon}
                          onSelectIcon={(icon) => setFormData({ ...formData, icon })}
                          label=""
                          required={false}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label
                            className={`block text-xs font-medium mb-1.5 ${
                              theme === "light" ? "text-gray-700" : "text-gray-300"
                            }`}
                          >
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
                            placeholder="/ruta"
                          />
                        </div>

                        <div>
                          <label
                            className={`block text-xs font-medium mb-1.5 ${
                              theme === "light" ? "text-gray-700" : "text-gray-300"
                            }`}
                          >
                            Orden
                          </label>
                          <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                              theme === "light"
                                ? "bg-white border-gray-300 text-gray-900"
                                : "bg-[#0f1621] border-white/10 text-white"
                            }`}
                            min="1"
                          />
                        </div>
                      </div>

                      {showEditMenuModal && (
                        <div>
                          <label
                            className={`block text-xs font-medium mb-1.5 ${
                              theme === "light" ? "text-gray-700" : "text-gray-300"
                            }`}
                          >
                            Menú Padre
                          </label>
                          <select
                            value={formData.parent || ""}
                            onChange={(e) => setFormData({ ...formData, parent: e.target.value || null })}
                            className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                              theme === "light"
                                ? "bg-white border-gray-300 text-gray-900"
                                : "bg-[#0f1621] border-white/10 text-white"
                            }`}
                          >
                            <option value="">Ninguno (Menú Principal)</option>
                            {getParentMenus(selectedModule)
                              .filter((m) => (selectedMenu ? m.id !== selectedMenu.id : true))
                              .map((menu) => (
                                <option key={menu.id} value={menu.id}>
                                  {menu.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      )}

                      {showNewMenuModal && formData.parent && (
                        <div
                          className={`p-2.5 rounded-lg border ${
                            theme === "light" ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"
                          }`}
                        >
                          <p className={`text-xs ${theme === "light" ? "text-blue-900" : "text-blue-300"}`}>
                            <strong>Submenú de:</strong> {menuItems.find((m) => m.id === formData.parent)?.name}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className={`w-4 h-4 rounded ${
                            theme === "light" ? "bg-white border-gray-300" : "bg-[#1a2332] border-white/10"
                          }`}
                        />
                        <label
                          htmlFor="isActive"
                          className={`text-xs ${theme === "light" ? "text-gray-700" : "text-gray-300"}`}
                        >
                          Menú activo
                        </label>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div
              className={`flex items-center justify-end gap-3 px-5 py-3 border-t ${
                theme === "light" ? "bg-gray-50 border-gray-200" : "bg-[#1a2332] border-white/10"
              }`}
            >
              <button
                onClick={() => {
                  setShowNewMenuModal(false);
                  setShowEditMenuModal(false);
                  setActiveModalTab("basic");
                }}
                className={`px-5 py-2 rounded-lg transition-colors text-sm font-medium ${
                  theme === "light"
                    ? "bg-gray-200 hover:bg-gray-300 text-gray-900"
                    : "bg-white/5 hover:bg-white/10 text-white"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={showNewMenuModal ? handleSaveMenu : handleUpdateMenu}
                className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shadow-lg shadow-primary/20 text-sm font-medium flex items-center gap-2"
              >
                {showNewMenuModal ? <Plus className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {showNewMenuModal ? "Crear Menú" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}