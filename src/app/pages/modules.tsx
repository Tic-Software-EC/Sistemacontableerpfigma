import { useNavigate } from "react-router";
import { useState } from "react";
import {
  FileText,
  Users,
  BarChart3,
  Package,
  Calculator,
  ShoppingCart,
  ShoppingBag,
  Wallet,
  UserCheck,
  Settings,
  FileBarChart,
  Calendar,
  CreditCard,
  Truck,
  Receipt,
  Building2,
  ClipboardList,
  TrendingUp,
  DollarSign,
  Layers,
  BookOpen,
  FileCheck,
  PieChart,
  Boxes,
  ChevronDown,
  HelpCircle,
  User,
  LogOut,
  X,
  Lock,
  Shield,
  Eye,
  EyeOff,
  Database,
  Download,
  Copy,
  Edit,
  AlertCircle,
  Camera,
  Upload,
} from "lucide-react";
import { ProfileModal } from "../components/profile-modal";
import { PreferencesModal } from "../components/preferences-modal";

interface Module {
  id: string;
  name: string;
  icon: any;
  color: string;
  route: string;
  description: string;
}

export default function ModulesPage() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] =
    useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] =
    useState(false);
  const [activeTab, setActiveTab] = useState("preferences");
  const [activeSubscriptionTab, setActiveSubscriptionTab] =
    useState("current-plan");
  const [showPassword, setShowPassword] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [userStatus, setUserStatus] = useState<
    "online" | "away" | "dnd" | "offline"
  >("online");
  const [profilePhoto, setProfilePhoto] = useState<
    string | null
  >(null);
  const [uploadError, setUploadError] = useState<string>("");
  const [showProfileModal, setShowProfileModal] =
    useState(false);

  // Obtener nombre de empresa desde localStorage
  const companyName =
    localStorage.getItem("companyName") || null;

  // Estado para perfil de usuario
  const [userProfile, setUserProfile] = useState({
    name: "Carlos Méndez",
    email: "carlos.mendez@empresa.com",
    phone: "+593 99 123 4567",
    role: "Administrador",
    avatar: "",
  });

  const modules: Module[] = [
    {
      id: "facturas",
      name: "Facturas",
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      route: "/dashboard/facturas",
      description: "Gestión de facturas",
    },
    {
      id: "clientes",
      name: "Clientes",
      icon: Users,
      color: "from-green-500 to-green-600",
      route: "/dashboard/clientes",
      description: "Administración de clientes",
    },
    {
      id: "reportes",
      name: "Reportes",
      icon: BarChart3,
      color: "from-purple-500 to-purple-600",
      route: "/dashboard/reportes",
      description: "Reportes y análisis",
    },
    {
      id: "inventario",
      name: "Inventario",
      icon: Package,
      color: "from-orange-500 to-orange-600",
      route: "/dashboard/inventario",
      description: "Control de inventario",
    },
    {
      id: "contabilidad",
      name: "Contabilidad",
      icon: Calculator,
      color: "from-pink-500 to-pink-600",
      route: "/dashboard",
      description: "Gestión contable",
    },
    {
      id: "ventas",
      name: "Ventas",
      icon: ShoppingCart,
      color: "from-cyan-500 to-cyan-600",
      route: "/dashboard",
      description: "Módulo de ventas",
    },
    {
      id: "pos",
      name: "Punto de Venta",
      icon: Receipt,
      color: "from-primary to-primary/80",
      route: "/dashboard/pos",
      description: "Sistema POS",
    },
    {
      id: "compras",
      name: "Compras",
      icon: ShoppingBag,
      color: "from-indigo-500 to-indigo-600",
      route: "/dashboard",
      description: "Gestión de compras",
    },
    {
      id: "gastos",
      name: "Gastos",
      icon: Wallet,
      color: "from-red-500 to-red-600",
      route: "/dashboard",
      description: "Control de gastos",
    },
    {
      id: "empleados",
      name: "Empleados",
      icon: UserCheck,
      color: "from-teal-500 to-teal-600",
      route: "/dashboard",
      description: "Gestión de personal",
    },
    {
      id: "configuracion",
      name: "Configuración",
      icon: Settings,
      color: "from-gray-500 to-gray-600",
      route: "/dashboard/configuracion",
      description: "Ajustes del sistema",
    },
    {
      id: "estados-financieros",
      name: "Estados Financieros",
      icon: FileBarChart,
      color: "from-emerald-500 to-emerald-600",
      route: "/dashboard",
      description: "Reportes financieros",
    },
    {
      id: "calendario",
      name: "Calendario",
      icon: Calendar,
      color: "from-amber-500 to-amber-600",
      route: "/dashboard",
      description: "Calendario fiscal",
    },
    {
      id: "pagos",
      name: "Pagos",
      icon: CreditCard,
      color: "from-violet-500 to-violet-600",
      route: "/dashboard",
      description: "Gestión de pagos",
    },
    {
      id: "proveedores",
      name: "Proveedores",
      icon: Truck,
      color: "from-lime-500 to-lime-600",
      route: "/dashboard",
      description: "Administración de proveedores",
    },
    {
      id: "cotizaciones",
      name: "Cotizaciones",
      icon: Receipt,
      color: "from-sky-500 to-sky-600",
      route: "/dashboard",
      description: "Gestión de cotizaciones",
    },
    {
      id: "activos",
      name: "Activos",
      icon: Building2,
      color: "from-rose-500 to-rose-600",
      route: "/dashboard",
      description: "Control de activos fijos",
    },
    {
      id: "proyectos",
      name: "Proyectos",
      icon: ClipboardList,
      color: "from-fuchsia-500 to-fuchsia-600",
      route: "/dashboard",
      description: "Gestión de proyectos",
    },
    {
      id: "indicadores",
      name: "Indicadores",
      icon: TrendingUp,
      color: "from-yellow-500 to-yellow-600",
      route: "/dashboard",
      description: "KPIs y métricas",
    },
    {
      id: "caja-bancos",
      name: "Caja y Bancos",
      icon: DollarSign,
      color: "from-green-600 to-green-700",
      route: "/dashboard",
      description: "Gestión de tesorería",
    },
    {
      id: "productos",
      name: "Productos",
      icon: Boxes,
      color: "from-orange-600 to-orange-700",
      route: "/dashboard",
      description: "Catálogo de productos",
    },
    {
      id: "libro-diario",
      name: "Libro Diario",
      icon: BookOpen,
      color: "from-blue-600 to-blue-700",
      route: "/dashboard",
      description: "Asientos contables",
    },
    {
      id: "auditoria",
      name: "Auditoría",
      icon: FileCheck,
      color: "from-purple-600 to-purple-700",
      route: "/dashboard",
      description: "Trazabilidad y auditoría",
    },
    {
      id: "presupuestos",
      name: "Presupuestos",
      icon: PieChart,
      color: "from-cyan-600 to-cyan-700",
      route: "/dashboard",
      description: "Control presupuestario",
    },
    {
      id: "almacenes",
      name: "Almacenes",
      icon: Layers,
      color: "from-indigo-600 to-indigo-700",
      route: "/dashboard",
      description: "Gestión de almacenes",
    },
  ];

  const handleModuleClick = (module: Module) => {
    // Módulo de Compras tiene su propia página con tabs
    if (module.name === "Compras") {
      navigate("/module-compras-detail");
      return;
    }

    // Módulo POS (Punto de Venta)
    if (module.name === "Punto de Venta") {
      navigate("/module-pos-detail");
      return;
    }

    // Módulos que deben usar el nuevo sistema de menús
    const modulesWithMenus = [
      "Configuración",
      "Ventas",
      "Inventario",
      "Contabilidad",
    ];

    if (modulesWithMenus.includes(module.name)) {
      const targetRoute = module.name === "Configuración" 
        ? "/module-config-detail" 
        : "/module-detail";
        
      navigate(targetRoute, {
        state: {
          moduleName: module.name,
          moduleColor: module.color,
          userPlan: "Plan Profesional", // Este valor debería venir del estado del usuario
        },
      });
    } else {
      navigate(module.route);
    }
  };

  const getStatusInfo = () => {
    switch (userStatus) {
      case "online":
        return { label: "En línea", color: "bg-green-500" };
      case "away":
        return { label: "Ausente", color: "bg-yellow-500" };
      case "dnd":
        return { label: "No molestar", color: "bg-red-500" };
      case "offline":
        return { label: "Desconectado", color: "bg-gray-500" };
      default:
        return { label: "En línea", color: "bg-green-500" };
    }
  };

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setUploadError("");
    const file = e.target.files?.[0];

    if (!file) return;

    // Validar tipo de archivo
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
    ];
    if (!validTypes.includes(file.type)) {
      setUploadError("Formato no válido. Solo JPG, PNG o GIF");
      return;
    }

    // Validar tamaño (2MB máximo)
    const maxSize = 2 * 1024 * 1024; // 2MB en bytes
    if (file.size > maxSize) {
      setUploadError("La imagen no debe superar los 2MB");
      return;
    }

    // Crear URL de previsualización
    const reader = new FileReader();
    reader.onload = (event) => {
      setProfilePhoto(event.target?.result as string);
      setUploadError("");
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoDelete = () => {
    setProfilePhoto(null);
    setUploadError("");
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-secondary border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  T
                </span>
              </div>
              <div>
                <h1 className="text-white font-semibold text-lg">
                  {companyName || "TicSoftEc"}
                </h1>
                <p className="text-gray-400 text-xs">
                  Sistema ERP Empresarial
                </p>
              </div>
            </div>

            {/* Iconos de navegación derecha */}
            <div className="flex items-center gap-4">
              {/* Notificaciones */}
              <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Búsqueda */}
              <button className="p-2 text-gray-400 hover:text-white transition-colors">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Idioma - Entre lupa y usuario */}
              <button className="px-3 py-1 text-xs text-gray-400 hover:text-white border border-gray-700 rounded hover:border-gray-600 transition-colors">
                ES
              </button>

              {/* Usuario con menú desplegable */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <div className="relative">
                    {profilePhoto ? (
                      <div className="w-8 h-8 rounded-lg overflow-hidden">
                        <img
                          src={profilePhoto}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          JP
                        </span>
                      </div>
                    )}
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusInfo().color} border-2 border-secondary rounded-full`}
                    ></span>
                  </div>
                  <div className="text-left">
                    <p className="text-white text-sm font-medium">
                      Juan Pérez
                    </p>
                    <p className="text-gray-400 text-xs">
                      Administrador de Empresa
                    </p>
                  </div>
                </button>

                {/* Menú desplegable del usuario */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-fit bg-[#3a3f4f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 flex">
                    {/* Panel izquierdo - Selector de estado */}
                    {showStatusMenu && (
                      <div className="w-64 bg-[#2f3442] border-r border-white/10 py-2">
                        <button
                          onClick={() =>
                            setUserStatus("online")
                          }
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            userStatus === "online"
                              ? "bg-white/10 text-white"
                              : "text-gray-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {userStatus === "online" && (
                            <svg
                              className="w-4 h-4 text-green-500 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {userStatus !== "online" && (
                            <div className="w-4"></div>
                          )}
                          <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                          <span className="text-sm font-medium">
                            En línea
                          </span>
                        </button>

                        <button
                          onClick={() => setUserStatus("away")}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            userStatus === "away"
                              ? "bg-white/10 text-white"
                              : "text-gray-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {userStatus === "away" && (
                            <svg
                              className="w-4 h-4 text-green-500 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {userStatus !== "away" && (
                            <div className="w-4"></div>
                          )}
                          <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                          <span className="text-sm font-medium">
                            Ausente
                          </span>
                        </button>

                        <button
                          onClick={() => setUserStatus("dnd")}
                          className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                            userStatus === "dnd"
                              ? "bg-white/10 text-white"
                              : "text-gray-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {userStatus === "dnd" && (
                            <svg
                              className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {userStatus !== "dnd" && (
                            <div className="w-4 mt-0.5"></div>
                          )}
                          <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1.5"></span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              No molestar
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              No recibirás notificaciones
                            </p>
                          </div>
                        </button>

                        <button
                          onClick={() =>
                            setUserStatus("offline")
                          }
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            userStatus === "offline"
                              ? "bg-white/10 text-white"
                              : "text-gray-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          {userStatus === "offline" && (
                            <svg
                              className="w-4 h-4 text-green-500 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                          {userStatus !== "offline" && (
                            <div className="w-4"></div>
                          )}
                          <span className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></span>
                          <span className="text-sm font-medium">
                            Desconectado
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Panel derecho - Opciones principales */}
                    <div className="w-72">
                      {/* Header con info del usuario */}
                      <div className="px-4 py-3 border-b border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            {profilePhoto ? (
                              <div className="w-10 h-10 rounded-lg overflow-hidden">
                                <img
                                  src={profilePhoto}
                                  alt="Avatar"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">
                                  JP
                                </span>
                              </div>
                            )}
                            <span
                              className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusInfo().color} border-2 border-[#3a3f4f] rounded-full`}
                            ></span>
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">
                              Juan Pérez
                            </p>
                            <p className="text-gray-400 text-xs">
                              juan.perez@ticsoftec.com
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Opciones del menú */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setShowPreferencesModal(true);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm">
                            Mis preferencias
                          </span>
                        </button>

                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            setShowSubscriptionModal(true);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                        >
                          <CreditCard className="w-4 h-4" />
                          <span className="text-sm">
                            Mi suscripción
                          </span>
                        </button>

                        <div className="border-t border-white/10 my-2"></div>

                        <button
                          onClick={() => navigate("/")}
                          className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span className="text-sm">
                            Cerrar sesión
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Banner informativo */}
      <div className="bg-gradient-to-r from-primary/90 to-primary border-b border-primary/20"></div>

      {/* Modal de Preferencias */}
      {showPreferencesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header del modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">
                Mis Preferencias
              </h2>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="flex h-[calc(90vh-8rem)]">
              {/* Sidebar con pestañas */}
              <div className="w-64 border-r border-white/10 p-4 space-y-2 overflow-y-auto">
                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === "preferences"
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Preferencias</span>
                </button>

                <button
                  onClick={() => setActiveTab("private")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === "private"
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span className="text-sm">Privado</span>
                </button>
                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeTab === "security"
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-sm">Seguridad</span>
                </button>
              </div>

              {/* Contenido de las pestañas */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Tab: Preferencias */}
                {activeTab === "preferences" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-medium mb-4">
                        Configuración General
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Tema
                          </label>
                          <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
                            <option>Oscuro</option>
                            <option>Claro</option>
                            <option>Auto</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Idioma
                          </label>
                          <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
                            <option>Español</option>
                            <option>English</option>
                            <option>Português</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Zona Horaria
                          </label>
                          <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
                            <option>GMT-5 (Ecuador)</option>
                            <option>GMT-3 (Argentina)</option>
                            <option>GMT-6 (México)</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-medium mb-4">
                        Notificaciones
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-primary"
                            defaultChecked
                          />
                          <span className="text-sm text-gray-300">
                            Notificaciones de email
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-primary"
                            defaultChecked
                          />
                          <span className="text-sm text-gray-300">
                            Notificaciones push
                          </span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm text-gray-300">
                            Alertas de sistema
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Calendario */}
                {activeTab === "calendar" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-medium mb-4">
                        Configuración de Calendario
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Primer día de la semana
                          </label>
                          <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
                            <option>Lunes</option>
                            <option>Domingo</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Formato de fecha
                          </label>
                          <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
                            <option>DD/MM/YYYY</option>
                            <option>MM/DD/YYYY</option>
                            <option>YYYY-MM-DD</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Formato de hora
                          </label>
                          <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary">
                            <option>24 horas</option>
                            <option>12 horas (AM/PM)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Privado */}
                {activeTab === "private" && (
                  <div className="space-y-6">
                    {/* Foto de Perfil */}
                    <div>
                      <h3 className="text-white font-medium mb-4">
                        Foto de Perfil
                      </h3>
                      <div className="flex items-start gap-6">
                        {/* Avatar actual */}
                        <div className="relative group">
                          {profilePhoto ? (
                            <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg">
                              <img
                                src={profilePhoto}
                                alt="Foto de perfil"
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-3xl">
                                JP
                              </span>
                            </div>
                          )}
                          {/* Overlay con icono de cámara */}
                          <div className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <Camera className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex-1 space-y-3">
                          <p className="text-gray-400 text-sm">
                            La imagen debe ser en formato JPG,
                            PNG o GIF y no superar los 2MB
                          </p>

                          {/* Mensaje de error */}
                          {uploadError && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                              <p className="text-red-400 text-sm">
                                {uploadError}
                              </p>
                            </div>
                          )}

                          <div className="flex gap-3">
                            <label className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer">
                              <Upload className="w-4 h-4" />
                              <span>Subir Foto</span>
                              <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/gif"
                                className="hidden"
                                onChange={handlePhotoUpload}
                              />
                            </label>
                            <button
                              onClick={handlePhotoDelete}
                              disabled={!profilePhoto}
                              className={`px-4 py-2 border border-white/20 rounded-lg text-sm transition-colors ${
                                profilePhoto
                                  ? "text-gray-300 hover:bg-white/5 hover:text-white"
                                  : "text-gray-600 cursor-not-allowed opacity-50"
                              }`}
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-medium mb-4">
                        Información Personal
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Nombre completo
                          </label>
                          <input
                            type="text"
                            defaultValue="Juan Pérez"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Correo electrónico
                          </label>
                          <input
                            type="email"
                            defaultValue="juan.perez@ticsoftec.com"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Teléfono
                          </label>
                          <input
                            type="tel"
                            defaultValue="+593 99 999 9999"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Cargo
                          </label>
                          <input
                            type="text"
                            defaultValue="Administrador"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                            disabled
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Seguridad */}
                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-medium mb-4">
                        Cambiar Contraseña
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Contraseña actual
                          </label>
                          <div className="relative">
                            <input
                              type={
                                showPassword
                                  ? "text"
                                  : "password"
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary pr-10"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setShowPassword(!showPassword)
                              }
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Nueva contraseña
                          </label>
                          <input
                            type="password"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">
                            Confirmar contraseña
                          </label>
                          <input
                            type="password"
                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-medium mb-4">
                        Autenticación de Dos Factores
                      </h3>
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-primary"
                          />
                          <span className="text-sm text-gray-300">
                            Habilitar autenticación de dos
                            factores
                          </span>
                        </label>
                        <p className="text-xs text-gray-500">
                          Agrega una capa adicional de seguridad
                          requiriendo un código además de tu
                          contraseña.
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white font-medium mb-4">
                        Sesiones Activas
                      </h3>
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-white">
                              Esta sesión (Actual)
                            </p>
                            <p className="text-xs text-gray-400">
                              Última actividad: Hace 5 minutos
                            </p>
                          </div>
                          <button className="text-xs text-red-400 hover:text-red-300">
                            Cerrar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer del modal */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowPreferencesModal(false);
                  alert("Preferencias guardadas exitosamente");
                }}
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Suscripción */}
      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-secondary border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header del modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">
                Mi Suscripción
              </h2>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido del modal */}
            <div className="flex h-[calc(90vh-8rem)]">
              {/* Sidebar con pestañas */}
              <div className="w-64 border-r border-white/10 p-4 space-y-2 overflow-y-auto">
                <button
                  onClick={() =>
                    setActiveSubscriptionTab("current-plan")
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeSubscriptionTab === "current-plan"
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-sm">Plan Actual</span>
                </button>
                <button
                  onClick={() =>
                    setActiveSubscriptionTab("plans")
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                    activeSubscriptionTab === "plans"
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span className="text-sm">Planes</span>
                </button>
              </div>

              {/* Contenido de las pestañas */}
              <div className="flex-1 p-6 overflow-y-auto">
                {/* Tab: Plan Actual */}
                {activeSubscriptionTab === "current-plan" && (
                  <div className="space-y-6">
                    {/* Alerta de prueba */}
                    <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 px-6 py-4 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium">
                          Su período de prueba expira en 5 días
                        </p>
                        <p className="text-xs text-yellow-400/80 mt-1">
                          Actualice su plan para continuar
                          usando todas las funcionalidades
                        </p>
                      </div>
                    </div>

                    {/* Plan actual con badge */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-white font-semibold text-lg">
                              Plan Standard
                            </h3>
                            <span className="px-3 py-1 bg-yellow-500 text-gray-900 text-xs font-semibold rounded">
                              Trial
                            </span>
                          </div>
                          <p className="text-gray-400 text-sm">
                            Todas las aplicaciones incluidas
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-primary text-2xl font-bold">
                            $8.95
                          </p>
                          <p className="text-gray-400 text-xs">
                            /usuario/mes
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span>
                            Acceso completo a todos los módulos
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span>5 usuarios simultáneos</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span>Soporte técnico 24/7</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span>
                            Backups automáticos diarios
                          </span>
                        </div>
                      </div>

                      <button className="w-full px-4 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                        Comprar Plan Standard
                      </button>
                    </div>

                    {/* Información adicional */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2 text-sm">
                          Cambiar de Plan
                        </h4>
                        <p className="text-gray-400 text-xs mb-3">
                          Flexible; cambie en cualquier momento
                          sin penalizaciones.
                        </p>
                        <p className="text-gray-400 text-xs">
                          ¿Ya tiene una suscripción?{" "}
                          <a
                            href="#"
                            className="text-primary hover:underline"
                          >
                            Regístrela aquí
                          </a>
                        </p>
                      </div>

                      <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                        <h4 className="text-white font-medium mb-2 text-sm">
                          ¿Necesita Ayuda?
                        </h4>
                        <p className="text-gray-400 text-xs">
                          Contacte a su gerente de cuenta
                          dedicado o al soporte técnico.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Planes */}
                {activeSubscriptionTab === "plans" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-medium mb-4">
                        Planes Disponibles
                      </h3>
                      <p className="text-gray-400 text-sm mb-6">
                        Seleccione el plan que mejor se adapte a
                        las necesidades de su empresa
                      </p>
                    </div>

                    {/* Grid de planes */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Plan Free */}
                      <div className="bg-white/5 border border-white/10 hover:border-primary/50 rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-primary/10">
                        <h4 className="text-cyan-400 font-semibold text-lg mb-2">
                          Free
                        </h4>
                        <p className="text-gray-400 text-sm mb-4">
                          Una aplicación únicamente
                        </p>
                        <p className="text-white text-3xl font-bold mb-6">
                          Gratis
                        </p>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center gap-2 text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                            <span>1 módulo</span>
                          </li>
                          <li className="flex items-center gap-2 text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                            <span>1 usuario</span>
                          </li>
                          <li className="flex items-center gap-2 text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                            <span>Soporte básico</span>
                          </li>
                        </ul>
                        <button className="w-full px-4 py-2 border border-white/20 text-gray-300 hover:bg-white/5 rounded-lg text-sm transition-colors">
                          Cambiar a Free
                        </button>
                      </div>

                      {/* Plan Standard - Destacado */}
                      <div className="bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary rounded-lg p-6 relative shadow-lg shadow-primary/20">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <span className="px-4 py-1 bg-yellow-500 text-gray-900 text-xs font-bold rounded-full">
                            ACTUAL
                          </span>
                        </div>
                        <h4 className="text-primary font-semibold text-lg mb-2">
                          Standard
                        </h4>
                        <p className="text-gray-300 text-sm mb-4">
                          Todas las aplicaciones
                        </p>
                        <div className="mb-6">
                          <span className="text-white text-3xl font-bold">
                            $8.95
                          </span>
                          <span className="text-gray-400 text-sm">
                            /usuario/mes
                          </span>
                        </div>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center gap-2 text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>Todos los módulos</span>
                          </li>
                          <li className="flex items-center gap-2 text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>5 usuarios</span>
                          </li>
                          <li className="flex items-center gap-2 text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>Soporte 24/7</span>
                          </li>
                          <li className="flex items-center gap-2 text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                            <span>Backups diarios</span>
                          </li>
                        </ul>
                        <button className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                          Comprar Standard
                        </button>
                      </div>

                      {/* Plan Custom */}
                      <div className="bg-white/5 border border-white/10 hover:border-primary/50 rounded-lg p-6 transition-all hover:shadow-lg hover:shadow-primary/10">
                        <h4 className="text-cyan-400 font-semibold text-lg mb-2">
                          Custom
                        </h4>
                        <p className="text-gray-400 text-sm mb-4">
                          Personalizado para empresas
                        </p>
                        <div className="mb-6">
                          <span className="text-white text-3xl font-bold">
                            $13.60
                          </span>
                          <span className="text-gray-400 text-sm">
                            /usuario/mes
                          </span>
                        </div>
                        <ul className="space-y-2 mb-6">
                          <li className="flex items-center gap-2 text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                            <span>Todas las apps</span>
                          </li>
                          <li className="flex items-center gap-2 text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                            <span>Studio incluido</span>
                          </li>
                          <li className="flex items-center gap-2 text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                            <span>API / Multi Company</span>
                          </li>
                          <li className="flex items-center gap-2 text-gray-300 text-sm">
                            <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                            <span>Usuarios ilimitados</span>
                          </li>
                        </ul>
                        <button className="w-full px-4 py-2 border border-white/20 text-gray-300 hover:bg-white/5 rounded-lg text-sm transition-colors">
                          Cambiar a Custom
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab: Base de Datos */}
                {activeSubscriptionTab === "database" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-white font-medium mb-4">
                        Información de Base de Datos
                      </h3>
                      <p className="text-gray-400 text-sm mb-6">
                        Gestione la configuración y respaldos de
                        su base de datos
                      </p>
                    </div>

                    {/* Version */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium mb-1 text-sm">
                            Versión
                          </h4>
                          <p className="text-gray-400 text-sm">
                            Su versión:{" "}
                            <span className="text-primary">
                              saas-19.1
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Database URL */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-1 text-sm">
                            Base de Datos
                          </h4>
                          <p className="text-gray-400 text-sm">
                            Su base de datos se ejecuta en{" "}
                            <a
                              href="#"
                              className="text-primary hover:underline"
                            >
                              ticsoftec-erp.com
                            </a>
                          </p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm transition-colors">
                          <Edit className="w-4 h-4" />
                          Renombrar
                        </button>
                      </div>
                    </div>

                    {/* Duplicate */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-1 text-sm">
                            Duplicar
                          </h4>
                          <p className="text-gray-400 text-sm">
                            Duplique su base de datos para
                            pruebas o producción
                          </p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-sm transition-colors">
                          <Copy className="w-4 h-4" />
                          Duplicar
                        </button>
                      </div>
                    </div>

                    {/* Backups */}
                    <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-white font-medium mb-1 text-sm">
                            Respaldos
                          </h4>
                          <p className="text-gray-400 text-sm">
                            Sus datos están seguros, verifique
                            nuestra{" "}
                            <a
                              href="#"
                              className="text-primary hover:underline"
                            >
                              política de respaldo
                            </a>
                          </p>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                          <Download className="w-4 h-4" />
                          Descargar Backup
                        </button>
                      </div>
                    </div>

                    {/* Información adicional */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-blue-400 text-sm font-medium mb-1">
                            Respaldos Automáticos
                          </p>
                          <p className="text-gray-400 text-xs">
                            Su base de datos se respalda
                            automáticamente cada 24 horas. Los
                            respaldos se mantienen por 30 días.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer del modal */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-white mb-2">
            Módulos del Sistema
          </h2>
          <p className="text-gray-400">
            Accede a los módulos según tus permisos de usuario
          </p>
        </div>

        {/* Grid de módulos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => handleModuleClick(module)}
                className="group relative bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-primary/50 p-3 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 rounded-[10px]"
              >
                <div className="flex flex-col items-center gap-2">
                  {/* Icono con gradiente */}
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {/* Nombre del módulo */}
                  <div className="text-center">
                    <h3 className="text-white text-xs font-medium group-hover:text-primary transition-colors leading-tight">
                      {module.name}
                    </h3>
                  </div>
                </div>

                {/* Tooltip en hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-xl">
                    {module.description}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1">
                      <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-gray-500 text-xs">
            TicSoftEc ERP v2.0 © 2024 - Sistema de Gestión
            Empresarial
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

      {/* Modal de Preferencias */}
      <PreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
      />
    </div>
  );
}