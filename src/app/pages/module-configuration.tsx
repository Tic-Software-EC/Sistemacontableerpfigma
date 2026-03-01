import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Package,
  Plus,
  Edit,
  Eye,
  Trash2,
  X,
  Save,
  CheckCircle2,
  FileText,
  Users,
  ShoppingCart,
  BarChart3,
  Calculator,
  Receipt,
  UserCheck,
  Layers,
  CreditCard,
  Search,
  Pencil,
  DollarSign,
  ClipboardList,
  Building,
  Calendar,
  UserPlus,
  Book,
  PieChart,
  Target,
  Briefcase,
  Activity,
  Home,
  TrendingUp,
  Truck,
  Shield,
  Globe,
  Zap,
  Database,
  Cloud,
  Bell,
  Mail,
} from "lucide-react";
import { AdminHeader } from "../components/admin-header";
import { useTheme } from "../contexts/theme-context";

interface Module {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  isActive: boolean;
  features: string[];
  order: number;
}

export default function ModuleConfigurationPage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [showNewModuleModal, setShowNewModuleModal] = useState(false);
  const [showEditModuleModal, setShowEditModuleModal] = useState(false);
  const [showViewModuleModal, setShowViewModuleModal] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  
  // Estados de filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [userProfile, setUserProfile] = useState({
    name: "Super Admin",
    email: "admin@ticsoftec.com",
    phone: "+593 99 123 4567",
    role: "Administrador de Sistema",
    avatar: "",
  });

  const iconMap: { [key: string]: any } = {
    FileText,
    Users,
    ShoppingCart,
    DollarSign,
    Package,
    Calculator,
    ClipboardList,
    Building,
    BarChart3,
    Calendar,
    Receipt,
    UserPlus,
    Book,
    PieChart,
    Layers,
    Target,
    Briefcase,
    Activity,
    Home,
    TrendingUp,
    CreditCard,
    Truck,
    Shield,
    Globe,
    Zap,
    Database,
    Cloud,
    Bell,
    Mail,
  };

  const [formData, setFormData] = useState({
    name: "",
    icon: "Package",
    color: "#E8692E",
    description: "",
    isActive: true,
    features: [] as string[],
    order: 1,
  });

  const [featureInput, setFeatureInput] = useState("");
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [customColor, setCustomColor] = useState(false);
  const [iconSearchTerm, setIconSearchTerm] = useState("");

  // Paleta de colores predefinidos
  const colorPalette = [
    "#3B82F6", // Azul
    "#10B981", // Verde
    "#F97316", // Naranja
    "#A855F7", // Morado
    "#EC4899", // Rosa
    "#06B6D4", // Cyan
    "#EF4444", // Rojo
    "#F59E0B", // Amarillo
    "#6366F1", // Indigo
    "#14B8A6", // Teal
    "#84CC16", // Lima
    "#FB923C", // Naranja claro
  ];

  const [modules, setModules] = useState<Module[]>([
    {
      id: "1",
      name: "Facturas",
      icon: FileText,
      color: "#3B82F6",
      description: "Facturación electrónica completa",
      isActive: true,
      features: ["Emisión de Facturas", "Notas de Crédito", "Retenciones"],
      order: 1,
    },
    {
      id: "2",
      name: "Clientes",
      icon: Users,
      color: "#10B981",
      description: "Administración de clientes",
      isActive: true,
      features: ["Base de Clientes", "Historial de Compras", "Segmentación"],
      order: 2,
    },
    {
      id: "3",
      name: "Reportes",
      icon: BarChart3,
      color: "#A855F7",
      description: "Análisis y reportes detallados",
      isActive: true,
      features: ["Dashboard Ejecutivo", "Reportes de Ventas", "Reportes Financieros"],
      order: 3,
    },
    {
      id: "4",
      name: "Inventario",
      icon: Package,
      color: "#F97316",
      description: "Control de stock y productos",
      isActive: true,
      features: ["Productos", "Categorías", "Kardex", "Transferencias"],
      order: 4,
    },
    {
      id: "5",
      name: "Contabilidad",
      icon: Calculator,
      color: "#EC4899",
      description: "Gestión contable completa",
      isActive: true,
      features: ["Libro Diario", "Libro Mayor", "Balance General", "Estado de Resultados"],
      order: 5,
    },
    {
      id: "6",
      name: "Ventas",
      icon: ShoppingCart,
      color: "#06B6D4",
      description: "Gestión de ventas completa",
      isActive: true,
      features: ["Cotizaciones", "Pedidos", "POS", "Comisiones"],
      order: 6,
    },
    {
      id: "7",
      name: "Compras",
      icon: ShoppingCart,
      color: "#8B5CF6",
      description: "Gestión de compras y proveedores",
      isActive: true,
      features: ["Órdenes de Compra", "Proveedores", "Recepción de Mercancía"],
      order: 7,
    },
    {
      id: "8",
      name: "Gastos",
      icon: Receipt,
      color: "#EF4444",
      description: "Control de gastos empresariales",
      isActive: true,
      features: ["Registro de Gastos", "Categorías de Gastos", "Aprobación de Gastos"],
      order: 8,
    },
    {
      id: "9",
      name: "Empleados",
      icon: UserCheck,
      color: "#14B8A6",
      description: "Recursos humanos y nómina",
      isActive: true,
      features: ["Registro de Empleados", "Nómina", "Asistencia", "Vacaciones"],
      order: 9,
    },
  ]);

  const handleOpenNewModal = () => {
    setFormData({
      name: "",
      icon: "Package",
      color: "#E8692E",
      description: "",
      isActive: true,
      features: [],
      order: modules.length + 1,
    });
    setShowNewModuleModal(true);
  };

  const handleEditModule = (module: Module) => {
    setSelectedModule(module);
    setFormData({
      name: module.name,
      icon: module.icon.name,
      color: module.color,
      description: module.description,
      isActive: module.isActive,
      features: [...module.features],
      order: module.order,
    });
    setShowEditModuleModal(true);
  };

  const handleViewModule = (module: Module) => {
    setSelectedModule(module);
    setShowViewModuleModal(true);
  };

  const handleDeleteModule = (module: Module) => {
    if (confirm(`¿Estás seguro de eliminar el módulo "${module.name}"?`)) {
      setModules(modules.filter(m => m.id !== module.id));
    }
  };

  const handleSaveModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      name: formData.name,
      icon: iconMap[formData.icon],
      color: formData.color,
      description: formData.description,
      isActive: formData.isActive,
      features: formData.features,
      order: formData.order,
    };
    setModules([...modules, newModule]);
    setShowNewModuleModal(false);
  };

  const handleUpdateModule = () => {
    if (!selectedModule) return;
    setModules(modules.map(m => m.id === selectedModule.id ? {
      ...m,
      name: formData.name,
      icon: iconMap[formData.icon],
      color: formData.color,
      description: formData.description,
      isActive: formData.isActive,
      features: formData.features,
      order: formData.order,
    } : m));
    setShowEditModuleModal(false);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] });
      setFeatureInput("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  const activeModules = modules.filter(m => m.isActive).length;
  const freeModules = modules.filter(m => m.availableInFree).length;
  const standardModules = modules.filter(m => m.availableInStandard).length;
  const customModules = modules.filter(m => m.availableInCustom).length;

  // Filtrado de módulos
  const filteredModules = modules.filter(module => {
    const nameMatch = module.name.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter === "all" || (statusFilter === "active" ? module.isActive : !module.isActive);
    return nameMatch && statusMatch;
  });

  return (
    <div className={`min-h-screen ${
      theme === "light"
        ? "bg-gradient-to-br from-gray-50 via-white to-gray-100"
        : "bg-gradient-to-br from-secondary via-secondary to-[#1a1f2e]"
    }`}>
      {/* Header */}
      <AdminHeader userProfile={userProfile} onProfileUpdate={setUserProfile} currentTab="module-configuration" />

      {/* Main Content */}
      <div className="p-6">
        {/* Métricas compactas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className={`border rounded-lg p-3 ${
            theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs mb-1 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Total Módulos</p>
                <p className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>{modules.length}</p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <Package className="w-4 h-4 text-primary" />
              </div>
            </div>
          </div>

          <div className={`border rounded-lg p-3 ${
            theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs mb-1 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Activos</p>
                <p className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>{modules.filter(m => m.isActive).length}</p>
              </div>
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle2 className="w-4 h-4 text-green-400" />
              </div>
            </div>
          </div>

          <div className={`border rounded-lg p-3 ${
            theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs mb-1 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Inactivos</p>
                <p className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>{modules.filter(m => !m.isActive).length}</p>
              </div>
              <div className="p-2 bg-yellow-500/10 rounded-lg">
                <Activity className="w-4 h-4 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className={`border rounded-lg p-3 ${
            theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs mb-1 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Categorías</p>
                <p className={`text-xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>{new Set(modules.map(m => m.category)).size}</p>
              </div>
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Layers className="w-4 h-4 text-blue-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Línea separadora */}
        <div className={`border-t mb-4 ${theme === "light" ? "border-gray-200" : "border-white/10"}`}></div>

        {/* Filtros y Botón Nuevo Módulo */}
        <div className="mb-4 flex items-center justify-between gap-4">
          {/* Filtros */}
          <div className="flex items-center gap-2">
            {/* Búsqueda */}
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${theme === "light" ? "text-gray-400" : "text-gray-500"}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                    : "bg-[#1a2332] border-white/10 text-white placeholder:text-gray-500"
                }`}
                placeholder="Buscar módulo..."
              />
            </div>

            {/* Filtro por Estado */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className={`px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                theme === "light"
                  ? "bg-white border-gray-300 text-gray-900"
                  : "bg-[#1a2332] border-white/10 text-white"
              }`}
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>

            {/* Limpiar filtros */}
            {(searchTerm || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className={`px-3 py-2 border rounded-lg flex items-center gap-2 transition-colors text-sm font-medium ${
                  theme === "light"
                    ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    : "bg-[#1a2332] border-white/10 text-gray-300 hover:bg-white/5"
                }`}
              >
                <X className="w-4 h-4" />
                Limpiar
              </button>
            )}

            {/* Contador de resultados */}
            {(searchTerm || statusFilter !== "all") && (
              <span className={`text-sm ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}>
                {filteredModules.length} resultado{filteredModules.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Botón Nuevo Módulo */}
          <button
            onClick={handleOpenNewModal}
            className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-white font-medium flex items-center gap-2 transition-all text-sm shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Nuevo Módulo
          </button>
        </div>

        {/* Tabla de Módulos */}
        <div className={`border rounded-xl overflow-hidden mb-6 ${
          theme === "light" ? "bg-white border-gray-200" : "bg-[#1a2332] border-white/10"
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${
                  theme === "light" ? "bg-gray-50 border-gray-200" : "bg-[#0f1621] border-white/10"
                }`}>
                  <th className={`px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}>
                    Módulo
                  </th>
                  <th className={`px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wide ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}>
                    Descripción
                  </th>
                  <th className={`px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}>
                    Estado
                  </th>
                  <th className={`px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}>
                    Orden
                  </th>
                  <th className={`px-4 py-3 text-center text-[10px] font-semibold uppercase tracking-wide ${
                    theme === "light" ? "text-gray-600" : "text-gray-400"
                  }`}>
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredModules.map((module, index) => {
                  const Icon = module.icon;
                  return (
                    <tr
                      key={module.id}
                      className={`border-b transition-colors ${
                        theme === "light"
                          ? "border-gray-200 hover:bg-gray-50"
                          : "border-white/5 hover:bg-white/5"
                      }`}
                    >
                      {/* Módulo */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${module.color}20` }}
                          >
                            <Icon className="w-4 h-4" style={{ color: module.color }} />
                          </div>
                          <span className={`font-semibold text-sm ${
                            theme === "light" ? "text-gray-900" : "text-white"
                          }`}>
                            {module.name}
                          </span>
                        </div>
                      </td>

                      {/* Descripción */}
                      <td className="px-4 py-3">
                        <span className={`text-sm ${
                          theme === "light" ? "text-gray-700" : "text-gray-300"
                        }`}>
                          {module.description}
                        </span>
                      </td>

                      {/* Estado */}
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <span className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-semibold ${
                            module.isActive 
                              ? 'bg-[#166534] text-white' 
                              : 'bg-[#713f12] text-white'
                          }`}>
                            {module.isActive ? "Activo" : "Inactivo"}
                          </span>
                        </div>
                      </td>

                      {/* Orden */}
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <span className={`text-sm ${
                            theme === "light" ? "text-gray-700" : "text-gray-300"
                          }`}>
                            {module.order}
                          </span>
                        </div>
                      </td>

                      {/* Acciones */}
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewModule(module)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === "light"
                                ? "text-blue-600 hover:bg-blue-50"
                                : "text-blue-400 hover:bg-white/5"
                            }`}
                            title="Ver Detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditModule(module)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === "light"
                                ? "text-orange-600 hover:bg-orange-50"
                                : "text-orange-400 hover:bg-white/5"
                            }`}
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteModule(module)}
                            className={`p-2 rounded-lg transition-colors ${
                              theme === "light"
                                ? "text-red-600 hover:bg-red-50"
                                : "text-red-400 hover:bg-white/5"
                            }`}
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {filteredModules.length === 0 && (
          <div className={`text-center py-12 border rounded-lg ${
            theme === "light" ? "bg-blue-50 border-blue-200" : "bg-blue-500/10 border-blue-500/20"
          }`}>
            <Package className={`w-12 h-12 mx-auto mb-2 ${
              theme === "light" ? "text-blue-600" : "text-blue-400"
            }`} />
            <p className={`text-sm ${
              theme === "light" ? "text-blue-800" : "text-blue-300"
            }`}>
              No se encontraron módulos con los filtros aplicados
            </p>
          </div>
        )}
      </div>

      {/* Modal Ver Módulo */}
      {showViewModuleModal && selectedModule && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl border rounded-xl shadow-2xl ${
            theme === "light"
              ? "bg-white border-gray-200"
              : "bg-secondary border-white/10"
          }`}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${
              theme === "light" ? "border-gray-200" : "border-white/10"
            }`}>
              <h3 className={`font-bold text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>Detalles del Módulo</h3>
              <button onClick={() => setShowViewModuleModal(false)} className={`p-2 rounded-lg transition-colors ${
                theme === "light"
                  ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-5">
                {/* Nombre del Módulo */}
                <div className="col-span-2">
                  <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}>
                    Nombre del Módulo
                  </label>
                  <div className={`px-3 py-2 rounded-lg border text-sm ${
                    theme === "light"
                      ? "bg-gray-50 border-gray-200 text-gray-900"
                      : "bg-[#3d4f61] border-white/10 text-white"
                  }`}>
                    {selectedModule.name}
                  </div>
                </div>

                {/* Descripción */}
                <div className="col-span-2">
                  <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}>
                    Descripción
                  </label>
                  <div className={`px-3 py-2 rounded-lg border text-sm ${
                    theme === "light"
                      ? "bg-gray-50 border-gray-200 text-gray-900"
                      : "bg-[#3d4f61] border-white/10 text-white"
                  }`}>
                    {selectedModule.description}
                  </div>
                </div>

                {/* Ícono del Módulo */}
                <div>
                  <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}>
                    Ícono del Módulo
                  </label>
                  <div className={`px-3 py-3 rounded-lg border flex items-center gap-3 ${
                    theme === "light"
                      ? "bg-gray-50 border-gray-200"
                      : "bg-[#3d4f61] border-white/10"
                  }`}>
                    {(() => {
                      const Icon = selectedModule.icon;
                      return <Icon className={`w-5 h-5 ${theme === "light" ? "text-blue-600" : "text-blue-400"}`} />;
                    })()}
                    <span className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                      {selectedModule.icon.name}
                    </span>
                  </div>
                </div>

                {/* Color del Módulo */}
                <div>
                  <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}>
                    Color del Módulo
                  </label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-12 h-12 rounded-lg border-2"
                      style={{ 
                        backgroundColor: selectedModule.color,
                        borderColor: theme === "light" ? "#d1d5db" : "#ffffff1a"
                      }}
                    ></div>
                    <span className={`font-mono text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                      {selectedModule.color}
                    </span>
                  </div>
                </div>

                {/* Orden de visualización */}
                <div>
                  <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}>
                    Orden de visualización
                  </label>
                  <div className={`px-3 py-2 rounded-lg border text-sm ${
                    theme === "light"
                      ? "bg-gray-50 border-gray-200 text-gray-900"
                      : "bg-[#3d4f61] border-white/10 text-white"
                  }`}>
                    {selectedModule.order}
                  </div>
                </div>

                {/* Estado */}
                <div>
                  <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}>
                    Estado
                  </label>
                  <div>
                    <span className={`inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold ${
                      selectedModule.isActive 
                        ? 'bg-green-500/10 text-green-400 border-2 border-green-500/20' 
                        : 'bg-gray-500/10 text-gray-400 border-2 border-gray-500/20'
                    }`}>
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      {selectedModule.isActive ? "Módulo Activo" : "Módulo Inactivo"}
                    </span>
                  </div>
                </div>

                {/* Características */}
                <div className="col-span-2">
                  <label className={`block text-sm mb-2 font-medium ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}>
                    Características
                  </label>
                  <div className={`rounded-lg border p-4 ${
                    theme === "light"
                      ? "bg-gray-50 border-gray-200"
                      : "bg-[#3d4f61] border-white/10"
                  }`}>
                    {selectedModule.features.length > 0 ? (
                      <div className="space-y-2">
                        {selectedModule.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className={`text-sm ${theme === "light" ? "text-gray-700" : "text-white"}`}>{feature}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                        No hay características definidas
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
              theme === "light" ? "bg-gray-50 border-gray-200" : "bg-[#1a2332] border-white/10"
            }`}>
              <button onClick={() => setShowViewModuleModal(false)} className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                theme === "light"
                  ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  : "bg-white/5 hover:bg-white/10 text-white"
              }`}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nueva/Editar Módulo */}
      {(showNewModuleModal || showEditModuleModal) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className={`w-full max-w-3xl border rounded-xl shadow-2xl my-8 ${
            theme === "light" ? "bg-white border-gray-200" : "bg-[#2C3E50] border-white/10"
          }`}>
            {/* Header */}
            <div className={`flex items-center gap-3 px-6 py-4 border-b ${
              theme === "light" ? "border-gray-200" : "border-white/10"
            }`}>
              <Pencil className={`w-5 h-5 ${theme === "light" ? "text-blue-600" : "text-blue-400"}`} />
              <h3 className={`font-bold text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                {showNewModuleModal ? "Nuevo Módulo" : "Editar Módulo"}
              </h3>
              <button
                onClick={() => {
                  setShowNewModuleModal(false);
                  setShowEditModuleModal(false);
                  setShowIconSelector(false);
                  setCustomColor(false);
                }}
                className={`ml-auto p-2 rounded-lg transition-colors ${
                  theme === "light"
                    ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Vista Previa */}
              {showEditModuleModal && (
                <div className={`rounded-lg p-5 mb-1 ${
                  theme === "light" ? "bg-gray-50 border border-gray-200" : "bg-[#3d4f61]"
                }`}>
                  <p className={`text-xs uppercase mb-3 ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>VISTA PREVIA</p>
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: formData.color }}
                    >
                      {(() => {
                        const Icon = iconMap[formData.icon] || Package;
                        return <Icon className="w-7 h-7 text-white" />;
                      })()}
                    </div>
                    <div>
                      <h4 className={`font-bold text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                        {formData.name || "Nombre del módulo"}
                      </h4>
                      <p className={`text-sm ${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>
                        {formData.description || "Descripción del módulo"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nombre del Módulo */}
              <div>
                <label className={`block text-sm mb-2 ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}>
                  Nombre del Módulo <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    theme === "light"
                      ? "bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400"
                      : "bg-[#3d4f61] border-none text-white"
                  }`}
                  placeholder="Ej: Facturación"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className={`block text-sm mb-2 ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}>
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${
                    theme === "light"
                      ? "bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400"
                      : "bg-[#3d4f61] border-none text-white"
                  }`}
                  rows={3}
                  placeholder="Descripción del módulo..."
                />
              </div>

              {/* Ícono del Módulo */}
              <div>
                <label className={`block text-sm mb-2 ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}>
                  Ícono del Módulo <span className="text-red-400">*</span>
                </label>
                <div
                  onClick={() => setShowIconSelector(!showIconSelector)}
                  className={`w-full px-3 py-3 rounded-lg cursor-pointer transition-colors flex items-center justify-between ${
                    theme === "light"
                      ? "bg-white border border-gray-300 hover:bg-gray-50"
                      : "bg-[#3d4f61] hover:bg-[#4a5f75]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {(() => {
                      const Icon = iconMap[formData.icon] || Package;
                      return <Icon className={`w-5 h-5 ${theme === "light" ? "text-blue-600" : "text-blue-400"}`} />;
                    })()}
                    <div>
                      <p className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                        {formData.icon}
                      </p>
                      <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>
                        Click para cambiar
                      </p>
                    </div>
                  </div>
                  <Search className={`w-4 h-4 ${theme === "light" ? "text-gray-400" : "text-gray-400"}`} />
                </div>

                {/* Selector de iconos */}
                {showIconSelector && (
                  <div className={`mt-2 rounded-lg p-4 space-y-3 ${
                    theme === "light" ? "bg-gray-50 border border-gray-200" : "bg-[#3d4f61]"
                  }`}>
                    {/* Campo de búsqueda */}
                    <input
                      type="text"
                      value={iconSearchTerm}
                      onChange={(e) => setIconSearchTerm(e.target.value)}
                      className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        theme === "light"
                          ? "bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400"
                          : "bg-[#4a5f75] border-none text-white placeholder:text-gray-400"
                      }`}
                      placeholder="Buscar ícono..."
                    />
                    
                    {/* Grid de iconos - 6 columnas */}
                    <div className="grid grid-cols-6 gap-2 max-h-[300px] overflow-y-auto">
                      {Object.entries(iconMap)
                        .filter(([iconName]) => iconName.toLowerCase().includes(iconSearchTerm.toLowerCase()))
                        .map(([iconName, IconComponent]) => (
                          <button
                            key={iconName}
                            onClick={() => {
                              setFormData({ ...formData, icon: iconName });
                              setShowIconSelector(false);
                              setIconSearchTerm("");
                            }}
                            className={`p-4 rounded-lg transition-all flex items-center justify-center ${
                              formData.icon === iconName
                                ? theme === "light"
                                  ? "bg-blue-100 border-2 border-blue-500"
                                  : "bg-[#2C3E50] border-2 border-primary"
                                : theme === "light"
                                ? "bg-white border-2 border-gray-200 hover:bg-gray-100"
                                : "bg-[#4a5f75] hover:bg-[#556f8a] border-2 border-transparent"
                            }`}
                            title={iconName}
                          >
                            <IconComponent className={`w-6 h-6 ${
                              theme === "light" ? "text-gray-700" : "text-gray-300"
                            }`} />
                          </button>
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Color del Módulo */}
              <div>
                <label className={`block text-sm mb-2 ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}>
                  Color del Módulo <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {colorPalette.map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setFormData({ ...formData, color });
                        setCustomColor(false);
                      }}
                      className={`h-12 rounded-lg transition-all ${
                        formData.color === color && !customColor
                          ? "ring-4 ring-primary/30 scale-105"
                          : "hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                {/* Color personalizado */}
                <div className="flex items-center gap-3 mt-3">
                  <div
                    className="w-10 h-10 rounded-lg border"
                    style={{ 
                      backgroundColor: customColor ? formData.color : "#E8692E",
                      borderColor: theme === "light" ? "#d1d5db" : "#ffffff1a"
                    }}
                  />
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={customColor}
                      onChange={(e) => setCustomColor(e.target.checked)}
                      className={`w-4 h-4 rounded ${
                        theme === "light" ? "bg-white border-gray-300" : "bg-[#3d4f61] border-white/10"
                      }`}
                    />
                    <span className={`text-sm ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}>
                      Color personalizado
                    </span>
                  </label>
                  {customColor && (
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="ml-auto w-20 h-8 bg-transparent cursor-pointer"
                    />
                  )}
                </div>
              </div>

              {/* Orden de visualización */}
              <div>
                <label className={`block text-sm mb-2 ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}>
                  Orden de visualización
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                  min="1"
                  className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                    theme === "light"
                      ? "bg-white border border-gray-300 text-gray-900"
                      : "bg-[#3d4f61] border-none text-white"
                  }`}
                  placeholder="1"
                />
              </div>

              {/* Estado del módulo */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className={`w-4 h-4 rounded ${
                      theme === "light" ? "bg-white border-gray-300" : "bg-[#3d4f61] border-white/10"
                    }`}
                  />
                  <span className={`text-sm ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}>
                    Módulo activo
                  </span>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className={`flex items-center justify-end gap-3 px-6 py-4 border-t ${
              theme === "light" ? "bg-gray-50 border-gray-200" : "bg-[#243342] border-white/10"
            }`}>
              <button
                onClick={() => {
                  setShowNewModuleModal(false);
                  setShowEditModuleModal(false);
                  setShowIconSelector(false);
                  setCustomColor(false);
                }}
                className={`px-5 py-2.5 rounded-lg transition-colors text-sm ${
                  theme === "light"
                    ? "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    : "bg-white/5 hover:bg-white/10 text-white"
                }`}
              >
                Cancelar
              </button>
              <button
                onClick={showNewModuleModal ? handleSaveModule : handleUpdateModule}
                className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors shadow-lg shadow-primary/20 text-sm font-medium"
              >
                {showNewModuleModal ? "Crear Módulo" : "Guardar cambios"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}