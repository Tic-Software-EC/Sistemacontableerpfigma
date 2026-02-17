import { useNavigate } from "react-router";
import { useState } from "react";
import {
  Settings,
  Building2,
  CreditCard,
  LogOut,
  X,
  FileText,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Receipt,
  ClipboardList,
  Warehouse,
  BarChart3,
  Calendar,
  FileSpreadsheet,
  UserCheck,
  Calculator,
  BookOpen,
  PieChart,
  Layers,
  Target,
  Briefcase,
  Activity,
  Plus,
  Edit3,
  Trash2,
  Save,
  Check,
  Menu,
  Home,
  TrendingUp,
  CreditCard as CreditCardIcon,
  Truck,
  ShieldCheck,
  Globe,
  Zap,
  Database,
  Cloud,
  Bell,
  Mail,
  MessageSquare,
  Phone,
  Video,
  Image as ImageIcon,
  Music,
  Film,
  Code,
  Terminal,
  Cpu,
  HardDrive,
  Server,
  Smartphone,
  Tablet,
  Monitor,
  Printer,
  Headphones,
  Camera,
  Search,
} from "lucide-react";
import { AdminNavigation } from "../components/admin-navigation";
import { ProfileModal } from "../components/profile-modal";

interface Module {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  order: number;
}

// Lista de íconos disponibles
const availableIcons = [
  { name: "FileText", icon: FileText, label: "Documento" },
  { name: "Users", icon: Users, label: "Usuarios" },
  { name: "ShoppingCart", icon: ShoppingCart, label: "Carrito" },
  { name: "DollarSign", icon: DollarSign, label: "Dólar" },
  { name: "Package", icon: Package, label: "Paquete" },
  { name: "Receipt", icon: Receipt, label: "Recibo" },
  { name: "ClipboardList", icon: ClipboardList, label: "Lista" },
  { name: "Warehouse", icon: Warehouse, label: "Bodega" },
  { name: "BarChart3", icon: BarChart3, label: "Gráfico" },
  { name: "Calendar", icon: Calendar, label: "Calendario" },
  { name: "FileSpreadsheet", icon: FileSpreadsheet, label: "Hoja" },
  { name: "UserCheck", icon: UserCheck, label: "Usuario Check" },
  { name: "Calculator", icon: Calculator, label: "Calculadora" },
  { name: "BookOpen", icon: BookOpen, label: "Libro" },
  { name: "PieChart", icon: PieChart, label: "Gráfico Pie" },
  { name: "Layers", icon: Layers, label: "Capas" },
  { name: "Target", icon: Target, label: "Objetivo" },
  { name: "Briefcase", icon: Briefcase, label: "Maletín" },
  { name: "Activity", icon: Activity, label: "Actividad" },
  { name: "Home", icon: Home, label: "Inicio" },
  { name: "TrendingUp", icon: TrendingUp, label: "Tendencia" },
  { name: "CreditCard", icon: CreditCardIcon, label: "Tarjeta" },
  { name: "Truck", icon: Truck, label: "Camión" },
  { name: "ShieldCheck", icon: ShieldCheck, label: "Escudo" },
  { name: "Globe", icon: Globe, label: "Globo" },
  { name: "Zap", icon: Zap, label: "Rayo" },
  { name: "Database", icon: Database, label: "Base de Datos" },
  { name: "Cloud", icon: Cloud, label: "Nube" },
  { name: "Bell", icon: Bell, label: "Campana" },
  { name: "Mail", icon: Mail, label: "Correo" },
  { name: "MessageSquare", icon: MessageSquare, label: "Mensaje" },
  { name: "Phone", icon: Phone, label: "Teléfono" },
  { name: "Video", icon: Video, label: "Video" },
  { name: "Image", icon: ImageIcon, label: "Imagen" },
  { name: "Music", icon: Music, label: "Música" },
  { name: "Film", icon: Film, label: "Película" },
  { name: "Code", icon: Code, label: "Código" },
  { name: "Terminal", icon: Terminal, label: "Terminal" },
  { name: "Cpu", icon: Cpu, label: "CPU" },
  { name: "HardDrive", icon: HardDrive, label: "Disco Duro" },
  { name: "Server", icon: Server, label: "Servidor" },
  { name: "Smartphone", icon: Smartphone, label: "Móvil" },
  { name: "Tablet", icon: Tablet, label: "Tablet" },
  { name: "Monitor", icon: Monitor, label: "Monitor" },
  { name: "Printer", icon: Printer, label: "Impresora" },
  { name: "Headphones", icon: Headphones, label: "Audífonos" },
  { name: "Camera", icon: Camera, label: "Cámara" },
  { name: "Settings", icon: Settings, label: "Configuración" },
];

// Paleta de colores predefinidos
const colorPalette = [
  { name: "Azul", color: "#3B82F6" },
  { name: "Verde", color: "#10B981" },
  { name: "Naranja", color: "#F97316" },
  { name: "Morado", color: "#A855F7" },
  { name: "Rosa", color: "#EC4899" },
  { name: "Cyan", color: "#06B6D4" },
  { name: "Rojo", color: "#EF4444" },
  { name: "Amarillo", color: "#FBBF24" },
  { name: "Índigo", color: "#6366F1" },
  { name: "Teal", color: "#14B8A6" },
  { name: "Lima", color: "#84CC16" },
  { name: "Amber", color: "#F59E0B" },
];

export default function ModuleConfigurationPage() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageType, setSuccessMessageType] = useState<"create" | "update" | "delete">("create");
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Estado para perfil de usuario
  const [userProfile, setUserProfile] = useState({
    name: "Super Admin",
    email: "admin@ticsoftec.com",
    phone: "+593 99 123 4567",
    role: "Administrador",
    avatar: "",
  });
  const [iconSearchTerm, setIconSearchTerm] = useState("");

  // Form state
  const [moduleForm, setModuleForm] = useState({
    name: "",
    icon: "Package",
    color: "#3B82F6",
    description: "",
    order: 1,
  });

  // Módulos del sistema
  const [modules, setModules] = useState<Module[]>([
    {
      id: "facturas",
      name: "Facturas",
      icon: "FileText",
      color: "#3B82F6",
      description: "Facturación electrónica completa",
      order: 1,
    },
    {
      id: "clientes",
      name: "Clientes",
      icon: "Users",
      color: "#10B981",
      description: "Administración de clientes",
      order: 2,
    },
    {
      id: "reportes",
      name: "Reportes",
      icon: "BarChart3",
      color: "#A855F7",
      description: "Análisis y reportes detallados",
      order: 3,
    },
    {
      id: "inventario",
      name: "Inventario",
      icon: "Package",
      color: "#F97316",
      description: "Control de stock y productos",
      order: 4,
    },
    {
      id: "contabilidad",
      name: "Contabilidad",
      icon: "Calculator",
      color: "#EC4899",
      description: "Gestión contable completa",
      order: 5,
    },
    {
      id: "ventas",
      name: "Ventas",
      icon: "ShoppingCart",
      color: "#06B6D4",
      description: "Gestión de ventas completa",
      order: 6,
    },
  ]);

  // Funciones de manejo de modal
  const handleOpenCreateModal = () => {
    setModalMode("create");
    setModuleForm({
      name: "",
      icon: "Package",
      color: "#3B82F6",
      description: "",
      order: modules.length + 1,
    });
    setShowModuleModal(true);
  };

  const handleOpenEditModal = (module: Module) => {
    setModalMode("edit");
    setSelectedModule(module);
    setModuleForm({
      name: module.name,
      icon: module.icon,
      color: module.color,
      description: module.description,
      order: module.order,
    });
    setShowModuleModal(true);
  };

  const handleCreateModule = () => {
    if (!moduleForm.name.trim()) return;

    const newModule: Module = {
      id: `module-${Date.now()}`,
      name: moduleForm.name,
      icon: moduleForm.icon,
      color: moduleForm.color,
      description: moduleForm.description,
      order: moduleForm.order,
    };

    setModules((prev) => [...prev, newModule].sort((a, b) => a.order - b.order));

    setShowModuleModal(false);
    setSuccessMessageType("create");
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3500);
  };

  const handleUpdateModule = () => {
    if (!selectedModule || !moduleForm.name.trim()) return;

    setModules((prev) =>
      prev
        .map((module) => {
          if (module.id !== selectedModule.id) return module;
          return {
            ...module,
            name: moduleForm.name,
            icon: moduleForm.icon,
            color: moduleForm.color,
            description: moduleForm.description,
            order: moduleForm.order,
          };
        })
        .sort((a, b) => a.order - b.order)
    );

    setShowModuleModal(false);
    setSuccessMessageType("update");
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3500);
  };

  const handleDeleteModule = (moduleId: string) => {
    if (!confirm("¿Estás seguro de eliminar este módulo? Esta acción no se puede deshacer.")) return;

    setModules((prev) => prev.filter((module) => module.id !== moduleId));

    setSuccessMessageType("delete");
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3500);
  };

  const getIconComponent = (iconName: string) => {
    const iconData = availableIcons.find((i) => i.name === iconName);
    return iconData ? iconData.icon : Package;
  };

  const filteredIcons = availableIcons.filter((icon) =>
    icon.label.toLowerCase().includes(iconSearchTerm.toLowerCase())
  );

  const getSuccessMessage = () => {
    switch (successMessageType) {
      case "create":
        return {
          title: "¡Módulo Creado!",
          message: "El nuevo módulo se ha creado correctamente",
          bgColor: "bg-green-600",
          borderColor: "border-green-500",
        };
      case "update":
        return {
          title: "¡Módulo Actualizado!",
          message: "Los cambios del módulo se han guardado correctamente",
          bgColor: "bg-blue-600",
          borderColor: "border-blue-500",
        };
      case "delete":
        return {
          title: "¡Módulo Eliminado!",
          message: "El módulo se ha eliminado correctamente",
          bgColor: "bg-red-600",
          borderColor: "border-red-500",
        };
    }
  };

  const successMsg = getSuccessMessage();

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-secondary border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">TicSoftEc</h1>
                <p className="text-gray-400 text-xs">Administrador de Suscripciones</p>
              </div>
            </div>

            {/* Usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">SA</span>
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">Super Admin</p>
                  <p className="text-gray-400 text-xs">Administrador</p>
                </div>
              </button>

              {/* Menú de usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#3a3f4f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-medium text-sm">Super Admin</p>
                    <p className="text-gray-400 text-xs">admin@ticsoftec.com</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Configuración</span>
                    </button>
                    <div className="border-t border-white/10 my-2"></div>
                    <button
                      onClick={() => navigate("/")}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors text-left"
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
      </header>

      {/* Navegación entre secciones */}
      <div className="bg-secondary border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <AdminNavigation activeSection="modules" />
        </div>
      </div>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Título y botón de acción */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">
              Configuración de Módulos
            </h2>
            <p className="text-gray-400">
              Gestiona los módulos del sistema ERP y sus características
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Nuevo Módulo
          </button>
        </div>

        {/* Grid de módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const IconComponent = getIconComponent(module.icon);
            return (
              <div
                key={module.id}
                className="bg-[#1e2530] border border-white/10 rounded-lg p-4 hover:border-white/20 transition-all"
              >
                {/* Header del módulo */}
                <div className="flex items-start justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${module.color}15` }}
                  >
                    <IconComponent className="w-5 h-5" style={{ color: module.color }} />
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEditModal(module)}
                      className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Información del módulo */}
                <h3 className="text-white font-semibold text-base mb-1.5">{module.name}</h3>
                <p className="text-gray-400 text-xs mb-3 line-clamp-2">{module.description}</p>

                {/* Footer con orden */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <span className="text-xs text-gray-500">Orden: {module.order}</span>
                  <div
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: `${module.color}20`,
                      color: module.color,
                    }}
                  >
                    {module.icon}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {modules.length === 0 && (
          <div className="bg-[#1e2530] border border-white/10 rounded-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-2xl mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">
              No hay módulos configurados
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Comienza creando el primer módulo del sistema
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors font-medium"
            >
              <Plus className="w-4 h-4" />
              Crear Primer Módulo
            </button>
          </div>
        )}
      </main>

      {/* Modal Crear/Editar Módulo */}
      {showModuleModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e2530] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Header del modal */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-[#1e2530] z-10">
              <div className="flex items-center gap-3">
                {modalMode === "create" ? (
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-green-400" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Edit3 className="w-5 h-5 text-blue-400" />
                  </div>
                )}
                <h3 className="text-white font-semibold text-xl">
                  {modalMode === "create" ? "Crear Nuevo Módulo" : "Editar Módulo"}
                </h3>
              </div>
              <button
                onClick={() => setShowModuleModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="p-6 space-y-5">
              {/* Preview del módulo */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-gray-400 text-xs font-medium mb-3">VISTA PREVIA</p>
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${moduleForm.color}15` }}
                  >
                    {(() => {
                      const IconComponent = getIconComponent(moduleForm.icon);
                      return <IconComponent className="w-8 h-8" style={{ color: moduleForm.color }} />;
                    })()}
                  </div>
                  <div>
                    <h4 className="text-white font-semibold text-lg">
                      {moduleForm.name || "Nombre del módulo"}
                    </h4>
                    <p className="text-gray-400 text-sm">
                      {moduleForm.description || "Descripción del módulo"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Nombre del módulo */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Nombre del Módulo *
                </label>
                <input
                  type="text"
                  value={moduleForm.name}
                  onChange={(e) => setModuleForm({ ...moduleForm, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="Ej: Facturación"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Descripción
                </label>
                <textarea
                  value={moduleForm.description}
                  onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors resize-none"
                  placeholder="Describe la funcionalidad de este módulo"
                  rows={3}
                />
              </div>

              {/* Selector de ícono */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Ícono del Módulo *
                </label>
                <button
                  onClick={() => setShowIconSelector(!showIconSelector)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {(() => {
                      const IconComponent = getIconComponent(moduleForm.icon);
                      return (
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${moduleForm.color}15` }}
                        >
                          <IconComponent className="w-5 h-5" style={{ color: moduleForm.color }} />
                        </div>
                      );
                    })()}
                    <div>
                      <p className="text-white font-medium text-sm">{moduleForm.icon}</p>
                      <p className="text-gray-400 text-xs">Click para cambiar</p>
                    </div>
                  </div>
                  <Search className="w-4 h-4 text-gray-400" />
                </button>

                {/* Grid de íconos */}
                {showIconSelector && (
                  <div className="mt-3 bg-white/5 border border-white/10 rounded-lg p-4">
                    {/* Búsqueda de íconos */}
                    <div className="mb-3">
                      <input
                        type="text"
                        value={iconSearchTerm}
                        onChange={(e) => setIconSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-primary"
                        placeholder="Buscar ícono..."
                      />
                    </div>

                    {/* Grid de íconos */}
                    <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto">
                      {filteredIcons.map((iconData) => {
                        const IconComp = iconData.icon;
                        const isSelected = moduleForm.icon === iconData.name;
                        return (
                          <button
                            key={iconData.name}
                            onClick={() => {
                              setModuleForm({ ...moduleForm, icon: iconData.name });
                              setShowIconSelector(false);
                              setIconSearchTerm("");
                            }}
                            className={`p-3 rounded-lg transition-all ${
                              isSelected
                                ? "bg-primary/20 border-2 border-primary"
                                : "bg-white/5 border border-white/10 hover:bg-white/10"
                            }`}
                            title={iconData.label}
                          >
                            <IconComp
                              className="w-5 h-5 mx-auto"
                              style={{ color: isSelected ? moduleForm.color : "#9CA3AF" }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Selector de color */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Color del Módulo *
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {colorPalette.map((colorData) => (
                    <button
                      key={colorData.color}
                      onClick={() => setModuleForm({ ...moduleForm, color: colorData.color })}
                      className={`h-10 rounded-lg transition-all ${
                        moduleForm.color === colorData.color
                          ? "ring-2 ring-white ring-offset-2 ring-offset-[#1e2530] scale-110"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: colorData.color }}
                      title={colorData.name}
                    />
                  ))}
                </div>

                {/* Color personalizado */}
                <div className="mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="color"
                      value={moduleForm.color}
                      onChange={(e) => setModuleForm({ ...moduleForm, color: e.target.value })}
                      className="w-10 h-10 rounded-lg cursor-pointer"
                    />
                    <span className="text-gray-400 text-sm">Color personalizado</span>
                  </label>
                </div>
              </div>

              {/* Orden */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Orden de visualización
                </label>
                <input
                  type="number"
                  min="1"
                  value={moduleForm.order}
                  onChange={(e) => setModuleForm({ ...moduleForm, order: parseInt(e.target.value) || 1 })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                  placeholder="1"
                />
              </div>
            </div>

            {/* Footer del modal */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 bg-[#1e2530]">
              <button
                onClick={() => setShowModuleModal(false)}
                className="px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={modalMode === "create" ? handleCreateModule : handleUpdateModule}
                disabled={!moduleForm.name.trim()}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-medium ${
                  !moduleForm.name.trim()
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : modalMode === "create"
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-primary hover:bg-primary/90 text-white"
                }`}
              >
                <Save className="w-4 h-4" />
                {modalMode === "create" ? "Crear Módulo" : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mensaje de éxito flotante */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-[100]">
          <div
            className={`${successMsg.bgColor} border ${successMsg.borderColor} rounded-xl shadow-2xl p-4 flex items-center gap-3 min-w-[350px] animate-slide-in-right`}
          >
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{successMsg.title}</p>
              <p className="text-white/90 text-xs mt-0.5">{successMsg.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-gray-500 text-xs">
            TicSoftEc ERP v2.0 © 2024 - Configuración de Módulos
          </p>
        </div>
      </footer>

      {/* Modal de Configuración de Perfil */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
        onSave={(newProfile) => setUserProfile(newProfile)}
      />

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}