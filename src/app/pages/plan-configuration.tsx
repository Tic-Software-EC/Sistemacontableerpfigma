import { useNavigate } from "react-router";
import { useState } from "react";
import {
  Save,
  Check,
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
  Eye,
  Edit3,
  Menu,
  Camera,
  Mail,
  User,
  Lock,
} from "lucide-react";
import { AdminNavigation } from "../components/admin-navigation";
import { PLAN_CONFIGS, type PlanConfig } from "../config/plans";
import { ProfileModal } from "../components/profile-modal";

interface SubModule {
  id: string;
  name: string;
  description: string;
}

interface Module {
  id: string;
  name: string;
  icon: any;
  color: string;
  bgColor: string;
  description: string;
  subModules: SubModule[];
  freeEnabled: boolean;
  standardEnabled: boolean;
  customEnabled: boolean;
  freeMenus: string[]; // IDs de menús habilitados para plan free
  standardMenus: string[]; // IDs de menús habilitados para plan standard
  customMenus: string[]; // IDs de menús habilitados para plan custom
}

export default function PlanConfigurationPage() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<"free" | "standard" | "custom" | null>(null);
  const [hasChanges, setHasChanges] = useState<{
    free: boolean;
    standard: boolean;
    custom: boolean;
  }>({ free: false, standard: false, custom: false });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessageType, setSuccessMessageType] = useState<"save" | "update" | "delete">("save");
  const [showPlanDetailsModal, setShowPlanDetailsModal] = useState<"free" | "standard" | "custom" | null>(null);
  const [showEditPlanModal, setShowEditPlanModal] = useState<"free" | "standard" | "custom" | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  
  // Estado local para los planes (en producción vendría de la base de datos)
  const [planConfigs, setPlanConfigs] = useState(PLAN_CONFIGS);
  const [editingPlan, setEditingPlan] = useState<PlanConfig | null>(null);
  
  // Estado para perfil de usuario
  const [userProfile, setUserProfile] = useState({
    name: "Super Admin",
    email: "admin@ticsoftec.com",
    phone: "+593 99 123 4567",
    role: "Administrador",
    avatar: "",
  });

  // Definición de todos los módulos del sistema
  const [modules, setModules] = useState<Module[]>([
    {
      id: "facturas",
      name: "Facturas",
      icon: FileText,
      color: "#3B82F6",
      bgColor: "rgba(59, 130, 246, 0.15)",
      description: "Facturación electrónica completa",
      freeEnabled: true,
      standardEnabled: true,
      customEnabled: true,
      freeMenus: ["fact-1", "fact-2"],
      standardMenus: ["fact-1", "fact-2", "fact-3", "fact-4", "fact-5"],
      customMenus: ["fact-1", "fact-2", "fact-3", "fact-4", "fact-5"],
      subModules: [
        { id: "fact-1", name: "Emisión de Facturas", description: "Crear y emitir facturas electrónicas" },
        { id: "fact-2", name: "Notas de Crédito", description: "Gestión de devoluciones y anulaciones" },
        { id: "fact-3", name: "Notas de Débito", description: "Cargos adicionales a facturas" },
        { id: "fact-4", name: "Guías de Remisión", description: "Transporte de mercancías" },
        { id: "fact-5", name: "Retenciones", description: "Retenciones de impuestos" },
      ],
    },
    {
      id: "clientes",
      name: "Clientes",
      icon: Users,
      color: "#10B981",
      bgColor: "rgba(16, 185, 129, 0.15)",
      description: "Administración de clientes",
      freeEnabled: true,
      standardEnabled: true,
      customEnabled: true,
      freeMenus: ["cli-1", "cli-2"],
      standardMenus: ["cli-1", "cli-2", "cli-3", "cli-4"],
      customMenus: ["cli-1", "cli-2", "cli-3", "cli-4"],
      subModules: [
        { id: "cli-1", name: "Base de Clientes", description: "Registro y gestión de clientes" },
        { id: "cli-2", name: "Historial de Compras", description: "Seguimiento de transacciones" },
        { id: "cli-3", name: "Segmentación", description: "Clasificación de clientes" },
        { id: "cli-4", name: "Programa de Lealtad", description: "Puntos y recompensas" },
      ],
    },
    {
      id: "reportes",
      name: "Reportes",
      icon: BarChart3,
      color: "#A855F7",
      bgColor: "rgba(168, 85, 247, 0.15)",
      description: "Análisis y reportes detallados",
      freeEnabled: false,
      standardEnabled: true,
      customEnabled: true,
      freeMenus: [],
      standardMenus: ["rep-1", "rep-2", "rep-3"],
      customMenus: ["rep-1", "rep-2", "rep-3", "rep-4"],
      subModules: [
        { id: "rep-1", name: "Dashboard Ejecutivo", description: "KPIs principales del negocio" },
        { id: "rep-2", name: "Reportes de Ventas", description: "Análisis detallado de ventas" },
        { id: "rep-3", name: "Reportes Financieros", description: "Estados financieros" },
        { id: "rep-4", name: "Reportes Personalizados", description: "Crear reportes a medida" },
      ],
    },
    {
      id: "inventario",
      name: "Inventario",
      icon: Package,
      color: "#F97316",
      bgColor: "rgba(249, 115, 22, 0.15)",
      description: "Control de stock y productos",
      freeEnabled: true,
      standardEnabled: true,
      customEnabled: true,
      freeMenus: ["inv-1", "inv-2"],
      standardMenus: ["inv-1", "inv-2", "inv-3", "inv-4", "inv-5"],
      customMenus: ["inv-1", "inv-2", "inv-3", "inv-4", "inv-5"],
      subModules: [
        { id: "inv-1", name: "Productos", description: "Catálogo de productos" },
        { id: "inv-2", name: "Categorías", description: "Clasificación de productos" },
        { id: "inv-3", name: "Bodegas", description: "Múltiples ubicaciones" },
        { id: "inv-4", name: "Kardex", description: "Movimientos de inventario" },
        { id: "inv-5", name: "Transferencias", description: "Entre bodegas" },
      ],
    },
    {
      id: "contabilidad",
      name: "Contabilidad",
      icon: Calculator,
      color: "#EC4899",
      bgColor: "rgba(236, 72, 153, 0.15)",
      description: "Gestión contable completa",
      freeEnabled: false,
      standardEnabled: true,
      customEnabled: true,
      freeMenus: [],
      standardMenus: ["cont-1", "cont-2", "cont-3"],
      customMenus: ["cont-1", "cont-2", "cont-3", "cont-4", "cont-5"],
      subModules: [
        { id: "cont-1", name: "Libro Diario", description: "Registro de transacciones diarias" },
        { id: "cont-2", name: "Libro Mayor", description: "Cuentas contables" },
        { id: "cont-3", name: "Balance General", description: "Estado de situación financiera" },
        { id: "cont-4", name: "Estado de Resultados", description: "Ingresos y gastos" },
        { id: "cont-5", name: "Plan de Cuentas", description: "Estructura contable" },
      ],
    },
    {
      id: "ventas",
      name: "Ventas",
      icon: ShoppingCart,
      color: "#06B6D4",
      bgColor: "rgba(6, 182, 212, 0.15)",
      description: "Gestión de ventas completa",
      freeEnabled: true,
      standardEnabled: true,
      customEnabled: true,
      freeMenus: ["ven-1", "ven-2"],
      standardMenus: ["ven-1", "ven-2", "ven-3", "ven-4"],
      customMenus: ["ven-1", "ven-2", "ven-3", "ven-4"],
      subModules: [
        { id: "ven-1", name: "Cotizaciones", description: "Presupuestos a clientes" },
        { id: "ven-2", name: "Pedidos", description: "Órdenes de venta" },
        { id: "ven-3", name: "Punto de Venta (POS)", description: "Venta directa en mostrador" },
        { id: "ven-4", name: "Comisiones", description: "Cálculo de comisiones de vendedores" },
      ],
    },
    {
      id: "compras",
      name: "Compras",
      icon: ShoppingCart,
      color: "#8B5CF6",
      bgColor: "rgba(139, 92, 246, 0.15)",
      description: "Gestión de compras y proveedores",
      freeEnabled: false,
      standardEnabled: true,
      customEnabled: true,
      freeMenus: [],
      standardMenus: ["com-1", "com-2", "com-3"],
      customMenus: ["com-1", "com-2", "com-3", "com-4"],
      subModules: [
        { id: "com-1", name: "Órdenes de Compra", description: "Pedidos a proveedores" },
        { id: "com-2", name: "Proveedores", description: "Base de datos de proveedores" },
        { id: "com-3", name: "Recepción de Mercancía", description: "Ingreso de productos" },
        { id: "com-4", name: "Comparación de Cotizaciones", description: "Análisis de proveedores" },
      ],
    },
    {
      id: "gastos",
      name: "Gastos",
      icon: Receipt,
      color: "#EF4444",
      bgColor: "rgba(239, 68, 68, 0.15)",
      description: "Control de gastos empresariales",
      freeEnabled: false,
      standardEnabled: true,
      customEnabled: true,
      freeMenus: [],
      standardMenus: ["gas-1", "gas-2"],
      customMenus: ["gas-1", "gas-2", "gas-3", "gas-4"],
      subModules: [
        { id: "gas-1", name: "Registro de Gastos", description: "Captura de gastos" },
        { id: "gas-2", name: "Categorías de Gastos", description: "Clasificación de gastos" },
        { id: "gas-3", name: "Aprobación de Gastos", description: "Flujo de aprobaciones" },
        { id: "gas-4", name: "Reembolsos", description: "Gestión de reembolsos" },
      ],
    },
    {
      id: "empleados",
      name: "Empleados",
      icon: UserCheck,
      color: "#14B8A6",
      bgColor: "rgba(20, 184, 166, 0.15)",
      description: "Recursos humanos y nómina",
      freeEnabled: false,
      standardEnabled: true,
      customEnabled: true,
      freeMenus: [],
      standardMenus: ["emp-1", "emp-2"],
      customMenus: ["emp-1", "emp-2", "emp-3", "emp-4"],
      subModules: [
        { id: "emp-1", name: "Registro de Empleados", description: "Base de datos de personal" },
        { id: "emp-2", name: "Nómina", description: "Cálculo de sueldos" },
        { id: "emp-3", name: "Asistencia", description: "Control de asistencia" },
        { id: "emp-4", name: "Vacaciones", description: "Gestión de vacaciones" },
      ],
    },
    {
      id: "configuracion",
      name: "Configuración",
      icon: Settings,
      color: "#6B7280",
      bgColor: "rgba(107, 114, 128, 0.15)",
      description: "Configuración del sistema",
      freeEnabled: true,
      standardEnabled: true,
      customEnabled: true,
      freeMenus: ["conf-1", "conf-2"],
      standardMenus: ["conf-1", "conf-2", "conf-3", "conf-4"],
      customMenus: ["conf-1", "conf-2", "conf-3", "conf-4"],
      subModules: [
        { id: "conf-1", name: "Datos de Empresa", description: "Información de la empresa" },
        { id: "conf-2", name: "Usuarios", description: "Gestión de usuarios" },
        { id: "conf-3", name: "Roles y Permisos", description: "Control de acceso" },
        { id: "conf-4", name: "Parámetros", description: "Configuración general" },
      ],
    },
  ]);

  const handleToggleModule = (moduleId: string, plan: "free" | "standard" | "custom") => {
    setHasChanges((prev) => ({ ...prev, [plan]: true }));
    setModules((prev) =>
      prev.map((module) => {
        if (module.id !== moduleId) return module;
        return {
          ...module,
          [`${plan}Enabled`]: !module[`${plan}Enabled`],
        };
      })
    );
  };

  const handleToggleMenu = (moduleId: string, menuId: string, plan: "free" | "standard" | "custom") => {
    setHasChanges((prev) => ({ ...prev, [plan]: true }));
    setModules((prev) =>
      prev.map((module) => {
        if (module.id !== moduleId) return module;
        
        const menuKey = `${plan}Menus` as keyof Module;
        const currentMenus = module[menuKey] as string[];
        const isEnabled = currentMenus.includes(menuId);
        
        return {
          ...module,
          [menuKey]: isEnabled
            ? currentMenus.filter(id => id !== menuId)
            : [...currentMenus, menuId],
        };
      })
    );
  };

  const handleSaveChanges = () => {
    if (!selectedPlan) return;
    setHasChanges((prev) => ({ ...prev, [selectedPlan]: false }));
    setShowSuccessMessage(true);
    setSuccessMessageType("save");
    setTimeout(() => setShowSuccessMessage(false), 3500);
  };

  const handleOpenModuleMenus = (module: Module) => {
    setSelectedModule(module);
  };

  const getSuccessMessage = () => {
    switch (successMessageType) {
      case "save":
        return {
          title: "¡Cambios Guardados!",
          message: "La configuración del plan se ha actualizado correctamente",
          bgColor: "bg-green-600",
          borderColor: "border-green-500",
        };
      case "update":
        return {
          title: "¡Configuración Actualizada!",
          message: "Los menús del módulo se han actualizado correctamente",
          bgColor: "bg-blue-600",
          borderColor: "border-blue-500",
        };
      case "delete":
        return {
          title: "¡Módulo Deshabilitado!",
          message: "El módulo ha sido deshabilitado para este plan",
          bgColor: "bg-red-600",
          borderColor: "border-red-500",
        };
    }
  };

  const successMsg = getSuccessMessage();

  // Función para abrir el modal de edición de plan
  const handleEditPlan = (planType: "free" | "standard" | "custom") => {
    setEditingPlan({ ...planConfigs[planType] });
    setShowEditPlanModal(planType);
  };

  // Función para guardar los cambios del plan
  const handleSavePlan = () => {
    if (!showEditPlanModal || !editingPlan) return;
    
    setPlanConfigs(prev => ({
      ...prev,
      [showEditPlanModal]: editingPlan
    }));
    
    setShowSuccessMessage(true);
    setSuccessMessageType("save");
    setShowEditPlanModal(null);
    setEditingPlan(null);
    
    setTimeout(() => setShowSuccessMessage(false), 3500);
  };

  // Función para actualizar los campos del plan en edición
  const updateEditingPlanField = (field: keyof PlanConfig, value: any) => {
    if (!editingPlan) return;
    setEditingPlan(prev => prev ? { ...prev, [field]: value } : null);
  };

  // Funciones para manejo de perfil
  const handleSaveProfile = (newProfile: { name: string; email: string; phone: string; role: string; avatar: string }) => {
    setUserProfile(newProfile);
    setShowSuccessMessage(true);
    setSuccessMessageType("save");
    setTimeout(() => setShowSuccessMessage(false), 3500);
  };

  const handleSaveModuleMenus = () => {
    if (!selectedPlan) return;
    setHasChanges((prev) => ({ ...prev, [selectedPlan]: false }));
    setShowSuccessMessage(true);
    setSuccessMessageType("update");
    setSelectedModule(null);
    setTimeout(() => setShowSuccessMessage(false), 3500);
  };

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
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg flex items-center justify-center overflow-hidden">
                  {userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white font-bold text-xs">
                      {userProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-white text-sm font-medium">{userProfile.name}</p>
                  <p className="text-gray-400 text-xs">{userProfile.role}</p>
                </div>
              </button>

              {/* Menú de usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-[#3a3f4f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-medium text-sm">{userProfile.name}</p>
                    <p className="text-gray-400 text-xs">{userProfile.email}</p>
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
          <AdminNavigation activeSection="plans" />
        </div>
      </div>

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Título y descripción */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Configuración de Planes
          </h2>
          <p className="text-gray-400">
            Configura los módulos disponibles para cada plan de suscripción. Selecciona un plan, activa los módulos deseados y guarda los cambios.
          </p>
        </div>

        {/* Planes de suscripción */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Plan Free */}
          <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 border-2 border-gray-500/30 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-2xl">Free</h3>
                <p className="text-gray-400 text-sm mt-1">${planConfigs.free.price}/mes</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditPlan("free")}
                  className="w-10 h-10 bg-gray-500/20 hover:bg-gray-500/30 rounded-xl flex items-center justify-center transition-colors group"
                  title="Editar plan"
                >
                  <Edit3 className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </button>
                <button
                  onClick={() => setShowPlanDetailsModal("free")}
                  className="w-10 h-10 bg-gray-500/20 hover:bg-gray-500/30 rounded-xl flex items-center justify-center transition-colors group"
                  title="Ver detalles"
                >
                  <Eye className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-3">{planConfigs.free.description}</p>
            <div className="flex gap-2 mb-4 text-xs">
              <span className="px-2 py-1 bg-white/5 rounded text-gray-400">{planConfigs.free.maxUsers} Usuario</span>
              <span className="px-2 py-1 bg-white/5 rounded text-gray-400">{planConfigs.free.maxBranches} Sucursal</span>
              <span className="px-2 py-1 bg-white/5 rounded text-gray-400">{planConfigs.free.maxCashRegisters} Caja</span>
            </div>
            <button
              onClick={() => setSelectedPlan("free")}
              className={`w-full py-2.5 rounded-lg font-medium transition-colors text-sm ${
                selectedPlan === "free"
                  ? "bg-green-600 text-white"
                  : "bg-gray-600 hover:bg-gray-700 text-white"
              }`}
            >
              {selectedPlan === "free" ? "Seleccionado" : "Configurar Módulos"}
            </button>
          </div>

          {/* Plan Standard */}
          <div className="bg-gradient-to-br from-primary/20 to-orange-600/20 border-2 border-primary rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-2xl">Standard</h3>
                <p className="text-primary text-sm mt-1 font-semibold">${planConfigs.standard.price}/mes</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditPlan("standard")}
                  className="w-10 h-10 bg-primary/20 hover:bg-primary/30 rounded-xl flex items-center justify-center transition-colors group"
                  title="Editar plan"
                >
                  <Edit3 className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                </button>
                <button
                  onClick={() => setShowPlanDetailsModal("standard")}
                  className="w-10 h-10 bg-primary/20 hover:bg-primary/30 rounded-xl flex items-center justify-center transition-colors group"
                  title="Ver detalles"
                >
                  <Eye className="w-4 h-4 text-primary group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-3">{planConfigs.standard.description}</p>
            <div className="flex gap-2 mb-4 text-xs">
              <span className="px-2 py-1 bg-primary/10 rounded text-primary">{planConfigs.standard.maxUsers} Usuarios</span>
              <span className="px-2 py-1 bg-primary/10 rounded text-primary">{planConfigs.standard.maxBranches} Sucursales</span>
              <span className="px-2 py-1 bg-primary/10 rounded text-primary">{planConfigs.standard.maxCashRegisters} Cajas</span>
            </div>
            <button
              onClick={() => setSelectedPlan("standard")}
              className={`w-full py-2.5 rounded-lg font-medium transition-colors text-sm ${
                selectedPlan === "standard"
                  ? "bg-green-600 text-white"
                  : "bg-primary hover:bg-primary/90 text-white"
              }`}
            >
              {selectedPlan === "standard" ? "Seleccionado" : "Configurar Módulos"}
            </button>
          </div>

          {/* Plan Custom */}
          <div className="bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-2 border-cyan-500/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white font-bold text-2xl">Custom</h3>
                <p className="text-cyan-400 text-sm mt-1 font-semibold">${planConfigs.custom.price}/mes</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEditPlan("custom")}
                  className="w-10 h-10 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-xl flex items-center justify-center transition-colors group"
                  title="Editar plan"
                >
                  <Edit3 className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors" />
                </button>
                <button
                  onClick={() => setShowPlanDetailsModal("custom")}
                  className="w-10 h-10 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-xl flex items-center justify-center transition-colors group"
                  title="Ver detalles"
                >
                  <Eye className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors" />
                </button>
              </div>
            </div>
            <p className="text-gray-400 text-xs mb-3">{planConfigs.custom.description}</p>
            <div className="flex gap-2 mb-4 text-xs">
              <span className="px-2 py-1 bg-cyan-500/10 rounded text-cyan-400">{planConfigs.custom.maxUsers} Usuarios</span>
              <span className="px-2 py-1 bg-cyan-500/10 rounded text-cyan-400">{planConfigs.custom.maxBranches} Sucursales</span>
              <span className="px-2 py-1 bg-cyan-500/10 rounded text-cyan-400">{planConfigs.custom.maxCashRegisters} Cajas</span>
            </div>
            <button
              onClick={() => setSelectedPlan("custom")}
              className={`w-full py-2.5 rounded-lg font-medium transition-colors text-sm ${
                selectedPlan === "custom"
                  ? "bg-green-600 text-white"
                  : "bg-cyan-600 hover:bg-cyan-700 text-white"
              }`}
            >
              {selectedPlan === "custom" ? "Seleccionado" : "Configurar Módulos"}
            </button>
          </div>
        </div>

        {/* Mensaje cuando no hay plan seleccionado */}
        {!selectedPlan && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/5 rounded-2xl mb-4">
              <Settings className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-white text-xl font-semibold mb-2">
              Selecciona un Plan
            </h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Elige uno de los planes de arriba para ver y configurar sus módulos disponibles
            </p>
          </div>
        )}

        {/* Vista de módulos por plan */}
        {selectedPlan && (
          <div>
            {/* Header con info del plan */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    selectedPlan === "free"
                      ? "bg-gray-500/20"
                      : selectedPlan === "standard"
                      ? "bg-primary/20"
                      : "bg-cyan-500/20"
                  }`}
                >
                  {selectedPlan === "free" ? (
                    <Package className="w-6 h-6 text-gray-400" />
                  ) : selectedPlan === "standard" ? (
                    <Target className="w-6 h-6 text-primary" />
                  ) : (
                    <Briefcase className="w-6 h-6 text-cyan-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">
                    Módulos del Sistema
                  </h3>
                  <p className="text-gray-400 text-sm">
                    Plan {selectedPlan === "free" ? "Free" : selectedPlan === "standard" ? "Standard" : "Custom"}
                  </p>
                </div>
              </div>
              
              {/* Botón de guardar cambios */}
              {hasChanges[selectedPlan] && (
                <button
                  onClick={handleSaveChanges}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium shadow-lg animate-pulse"
                >
                  <Save className="w-5 h-5" />
                  Guardar Cambios
                </button>
              )}
            </div>

            {/* Grid de módulos con toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {modules.map((module) => {
                const Icon = module.icon;
                const isEnabled = module[`${selectedPlan}Enabled`];
                const enabledMenusCount = (module[`${selectedPlan}Menus`] as string[]).length;

                return (
                  <div
                    key={module.id}
                    className={`relative border rounded-xl p-5 transition-all ${
                      isEnabled
                        ? "bg-white/10 border-primary/50"
                        : "bg-secondary/50 border-white/10"
                    }`}
                  >
                    {/* Icono y nombre */}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: module.bgColor }}
                      >
                        <Icon className="w-6 h-6" style={{ color: module.color }} />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium text-sm mb-1 ${isEnabled ? "text-white" : "text-gray-400"}`}>
                          {module.name}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {module.description}
                        </p>
                        {isEnabled && (
                          <p className="text-xs text-primary mt-2">
                            {enabledMenusCount} de {module.subModules.length} menús activos
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Controles */}
                    <div className="flex items-center justify-between">
                      {/* Toggle para habilitar/deshabilitar módulo */}
                      <button
                        onClick={() => handleToggleModule(module.id, selectedPlan)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                          isEnabled
                            ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                            : "bg-gray-600/20 text-gray-400 hover:bg-gray-600/30"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isEnabled
                              ? "bg-green-600 border-green-600"
                              : "border-gray-600"
                          }`}
                        >
                          {isEnabled && <Check className="w-3 h-3 text-white" />}
                        </div>
                        {isEnabled ? "Habilitado" : "Deshabilitado"}
                      </button>

                      {/* Botón para configurar menús */}
                      {isEnabled && (
                        <button
                          onClick={() => handleOpenModuleMenus(module)}
                          className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors text-sm font-medium"
                        >
                          <Menu className="w-4 h-4" />
                          Menús
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal de configuración de menús por módulo */}
        {selectedModule && selectedPlan && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-3xl bg-secondary border border-white/10 rounded-2xl overflow-hidden flex flex-col max-h-[85vh]">
              {/* Header del módulo */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: selectedModule.bgColor,
                    }}
                  >
                    {(() => {
                      const Icon = selectedModule.icon;
                      return (
                        <Icon
                          className="w-7 h-7"
                          style={{ color: selectedModule.color }}
                        />
                      );
                    })()}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-xl">
                      {selectedModule.name} - Configuración de Menús
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Plan {selectedPlan === "free" ? "Free" : selectedPlan === "standard" ? "Standard" : "Custom"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedModule(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contenido del módulo */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="mb-6">
                  <p className="text-gray-400 text-sm mb-4">
                    Selecciona los menús que estarán disponibles para este módulo en el plan <span className="font-semibold text-white">{selectedPlan === "free" ? "Free" : selectedPlan === "standard" ? "Standard" : "Custom"}</span>
                  </p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                    selectedPlan === "free"
                      ? "bg-green-600/20 text-green-400"
                      : selectedPlan === "standard"
                      ? "bg-primary/20 text-primary"
                      : "bg-cyan-500/20 text-cyan-400"
                  }`}>
                    <Check className="w-4 h-4" />
                    {(selectedModule[`${selectedPlan}Menus`] as string[]).length} de {selectedModule.subModules.length} menús activos
                  </div>
                </div>
                
                {/* Lista de menús con checkboxes */}
                <div className="space-y-3">
                  {selectedModule.subModules.map((subModule) => {
                    const isMenuEnabled = (selectedModule[`${selectedPlan}Menus`] as string[]).includes(subModule.id);
                    
                    return (
                      <button
                        key={subModule.id}
                        onClick={() => handleToggleMenu(selectedModule.id, subModule.id, selectedPlan)}
                        className={`w-full flex items-start gap-4 border rounded-lg p-4 text-left transition-all hover:scale-[1.02] ${
                          isMenuEnabled
                            ? selectedPlan === "free"
                              ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20"
                              : selectedPlan === "standard"
                              ? "bg-primary/10 border-primary/30 hover:bg-primary/20"
                              : "bg-cyan-500/10 border-cyan-500/30 hover:bg-cyan-500/20"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {/* Checkbox */}
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                            isMenuEnabled
                              ? selectedPlan === "free"
                                ? "bg-green-500 border-green-500"
                                : selectedPlan === "standard"
                                ? "bg-primary border-primary"
                                : "bg-cyan-500 border-cyan-500"
                              : "border-gray-600"
                          }`}
                        >
                          {isMenuEnabled && <Check className="w-4 h-4 text-white" />}
                        </div>

                        {/* Información del menú */}
                        <div className="flex-1">
                          <p className={`font-medium text-sm mb-1 ${isMenuEnabled ? "text-white" : "text-gray-400"}`}>
                            {subModule.name}
                          </p>
                          <p className={`text-xs ${isMenuEnabled ? "text-gray-400" : "text-gray-600"}`}>
                            {subModule.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Footer con botones */}
              <div className="flex items-center justify-between p-6 border-t border-white/10">
                <button
                  onClick={() => setSelectedModule(null)}
                  className="px-6 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveModuleMenus}
                  className={`flex items-center gap-2 px-6 py-2.5 text-white rounded-lg transition-colors font-medium ${
                    selectedPlan === "free"
                      ? "bg-green-600 hover:bg-green-700"
                      : selectedPlan === "standard"
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-cyan-600 hover:bg-cyan-700"
                  }`}
                >
                  <Save className="w-4 h-4" />
                  Guardar Menús
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modal de Detalles del Plan */}
      {showPlanDetailsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg rounded-2xl p-8 relative ${
            showPlanDetailsModal === "free"
              ? "bg-gradient-to-br from-gray-700/40 to-gray-800/40 border-2 border-gray-500/30"
              : showPlanDetailsModal === "standard"
              ? "bg-gradient-to-br from-primary/30 to-orange-600/30 border-2 border-primary"
              : "bg-gradient-to-br from-cyan-600/30 to-blue-600/30 border-2 border-cyan-500/50"
          }`}>
            {/* Badge POPULAR para Standard */}
            {showPlanDetailsModal === "standard" && (
              <div className="absolute top-4 right-4 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                POPULAR
              </div>
            )}
            
            {/* Botón cerrar */}
            <button
              onClick={() => setShowPlanDetailsModal(null)}
              className="absolute top-4 left-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Contenido del modal - Plan Free */}
            {showPlanDetailsModal === "free" && (
              <>
                <div className="flex items-center justify-center mb-6 mt-6">
                  <div className="w-20 h-20 bg-gray-500/20 rounded-2xl flex items-center justify-center">
                    <Package className="w-10 h-10 text-gray-400" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-3xl text-center mb-2">{planConfigs.free.displayName}</h3>
                <p className="text-gray-400 text-center mb-6">{planConfigs.free.description}</p>
                
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold text-white">${planConfigs.free.price}</span>
                    <span className="text-gray-400 text-base">/mes</span>
                  </div>
                  <p className="text-gray-400 text-sm">{planConfigs.free.maxUsers} usuario{planConfigs.free.maxUsers !== 1 ? 's' : ''} • {planConfigs.free.maxBranches} sucursal{planConfigs.free.maxBranches !== 1 ? 'es' : ''} • {planConfigs.free.maxCashRegisters} caja{planConfigs.free.maxCashRegisters !== 1 ? 's' : ''}</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {planConfigs.free.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Contenido del modal - Plan Standard */}
            {showPlanDetailsModal === "standard" && (
              <>
                <div className="flex items-center justify-center mb-6 mt-6">
                  <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <Target className="w-10 h-10 text-primary" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-3xl text-center mb-2">{planConfigs.standard.displayName}</h3>
                <p className="text-gray-300 text-center mb-6">{planConfigs.standard.description}</p>
                
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold text-white">${planConfigs.standard.price}</span>
                    <span className="text-gray-300 text-base">/mes</span>
                  </div>
                  <p className="text-gray-300 text-sm">{planConfigs.standard.maxUsers} usuarios • {planConfigs.standard.maxBranches} sucursales • {planConfigs.standard.maxCashRegisters} cajas</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {planConfigs.standard.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-200">
                      <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {/* Contenido del modal - Plan Custom */}
            {showPlanDetailsModal === "custom" && (
              <>
                <div className="flex items-center justify-center mb-6 mt-6">
                  <div className="w-20 h-20 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
                    <Briefcase className="w-10 h-10 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-white font-bold text-3xl text-center mb-2">{planConfigs.custom.displayName}</h3>
                <p className="text-gray-300 text-center mb-6">{planConfigs.custom.description}</p>
                
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <span className="text-5xl font-bold text-white">${planConfigs.custom.price}</span>
                    <span className="text-gray-300 text-base">/mes</span>
                  </div>
                  <p className="text-gray-300 text-sm">{planConfigs.custom.maxUsers} usuarios • {planConfigs.custom.maxBranches} sucursales • {planConfigs.custom.maxCashRegisters} cajas</p>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {planConfigs.custom.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-gray-200">
                      <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modal de Edición de Plan */}
      {showEditPlanModal && editingPlan && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-2xl rounded-2xl p-8 relative ${
            showEditPlanModal === "free"
              ? "bg-gradient-to-br from-gray-700/40 to-gray-800/40 border-2 border-gray-500/30"
              : showEditPlanModal === "standard"
              ? "bg-gradient-to-br from-primary/30 to-orange-600/30 border-2 border-primary"
              : "bg-gradient-to-br from-cyan-600/30 to-blue-600/30 border-2 border-cyan-500/50"
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-bold text-2xl">
                  Editar Plan {editingPlan.displayName}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  Configura los límites y precio del plan
                </p>
              </div>
              <button
                onClick={() => {
                  setShowEditPlanModal(null);
                  setEditingPlan(null);
                }}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Formulario de edición */}
            <div className="space-y-4">
              {/* Precio */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Precio Mensual (USD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400">$</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={editingPlan.price}
                    onChange={(e) => updateEditingPlanField("price", parseFloat(e.target.value) || 0)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pl-8 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* Usuarios máximos */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Usuarios Máximos
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={editingPlan.maxUsers}
                    onChange={(e) => updateEditingPlanField("maxUsers", parseInt(e.target.value) || 1)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Sucursales máximas */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Sucursales Máximas
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={editingPlan.maxBranches}
                    onChange={(e) => updateEditingPlanField("maxBranches", parseInt(e.target.value) || 1)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Cajas máximas */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Cajas Máximas
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    min="1"
                    value={editingPlan.maxCashRegisters}
                    onChange={(e) => updateEditingPlanField("maxCashRegisters", parseInt(e.target.value) || 1)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="1"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">
                  Descripción
                </label>
                <input
                  type="text"
                  value={editingPlan.description}
                  onChange={(e) => updateEditingPlanField("description", e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Descripción del plan"
                />
              </div>
            </div>

            {/* Resumen visual */}
            <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
              <p className="text-gray-400 text-xs mb-3">Vista previa:</p>
              <div className="flex gap-2 flex-wrap">
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  showEditPlanModal === "free"
                    ? "bg-white/10 text-gray-300"
                    : showEditPlanModal === "standard"
                    ? "bg-primary/10 text-primary"
                    : "bg-cyan-500/10 text-cyan-400"
                }`}>
                  ${editingPlan.price}/mes
                </span>
                <span className={`px-3 py-1.5 rounded-lg text-sm ${
                  showEditPlanModal === "free"
                    ? "bg-white/10 text-gray-300"
                    : showEditPlanModal === "standard"
                    ? "bg-primary/10 text-primary"
                    : "bg-cyan-500/10 text-cyan-400"
                }`}>
                  {editingPlan.maxUsers} usuarios
                </span>
                <span className={`px-3 py-1.5 rounded-lg text-sm ${
                  showEditPlanModal === "free"
                    ? "bg-white/10 text-gray-300"
                    : showEditPlanModal === "standard"
                    ? "bg-primary/10 text-primary"
                    : "bg-cyan-500/10 text-cyan-400"
                }`}>
                  {editingPlan.maxBranches} sucursales
                </span>
                <span className={`px-3 py-1.5 rounded-lg text-sm ${
                  showEditPlanModal === "free"
                    ? "bg-white/10 text-gray-300"
                    : showEditPlanModal === "standard"
                    ? "bg-primary/10 text-primary"
                    : "bg-cyan-500/10 text-cyan-400"
                }`}>
                  {editingPlan.maxCashRegisters} cajas
                </span>
              </div>
            </div>

            {/* Botones */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditPlanModal(null);
                  setEditingPlan(null);
                }}
                className="flex-1 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-white/5 border border-white/10 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePlan}
                className={`flex-1 px-4 py-2.5 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  showEditPlanModal === "free"
                    ? "bg-gray-600 hover:bg-gray-700"
                    : showEditPlanModal === "standard"
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-cyan-600 hover:bg-cyan-700"
                }`}
              >
                <Save className="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configuración de Perfil */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
        onSave={handleSaveProfile}
      />

      {/* Mensaje de éxito flotante */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-[100]">
          <div className={`${successMsg.bgColor} border ${successMsg.borderColor} rounded-xl shadow-2xl p-4 flex items-center gap-3 min-w-[350px] animate-slide-in-right`}>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm">
                {successMsg.title}
              </p>
              <p className="text-white/90 text-xs mt-0.5">
                {successMsg.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-gray-500 text-xs">
            TicSoftEc ERP v2.0 © 2024 - Configuración de Planes
          </p>
        </div>
      </footer>

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
