import { useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useBrand } from "../contexts/brand-context";
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
  User,
  LogOut,
  X,
  Eye,
  EyeOff,
  Database,
  Download,
  Copy,
  Edit,
  AlertCircle,
  Camera,
  Upload,
  Sun,
  Moon,
  Lock,
} from "lucide-react";
import { ProfileModal } from "../components/profile-modal";
import { useTheme } from "../contexts/theme-context";

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
  const { theme, toggleTheme } = useTheme();
  const { logoUrl } = useBrand();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [userStatus, setUserStatus] = useState<"online" | "away" | "dnd" | "offline">("online");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string>("");
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Campos del formulario de preferencias
  const [prefForm, setPrefForm] = useState({
    nombre: "Juan Pérez",
    correo: "juan.perez@ticsoftec.com",
    telefono: "+593 99 123 4567",
    rol: "Administrador",
    passwordActual: "",
    nuevaPassword: "",
  });

  // Obtener nombre de empresa desde localStorage
  const companyName = localStorage.getItem("companyName") || null;

  const [userProfile, setUserProfile] = useState({
    name: "Juan Pérez",
    email: "juan.perez@empresa.com",
    phone: "+593 99 123 4567",
    role: "Administrador",
    avatar: "",
  });

  const modules: Module[] = [
    { id: "facturas", name: "Facturas", icon: FileText, color: "from-blue-500 to-blue-600", route: "/module-config-detail", description: "Gestión de facturas" },
    { id: "clientes", name: "Clientes", icon: Users, color: "from-green-500 to-green-600", route: "/module-config-detail", description: "Administración de clientes" },
    { id: "reportes", name: "Reportes", icon: BarChart3, color: "from-purple-500 to-purple-600", route: "/module-config-detail", description: "Reportes y análisis" },
    { id: "inventario", name: "Inventario", icon: Package, color: "from-orange-500 to-orange-600", route: "/module-inventory-detail", description: "Control de inventario" },
    { id: "contabilidad", name: "Contabilidad", icon: Calculator, color: "from-pink-500 to-pink-600", route: "/module-config-detail", description: "Gestión contable" },
    { id: "ventas", name: "Ventas", icon: ShoppingCart, color: "from-cyan-500 to-cyan-600", route: "/module-ventas-detail", description: "Módulo de ventas" },
    { id: "pos", name: "Punto de Venta", icon: Receipt, color: "from-primary to-primary/80", route: "/module-pos-detail", description: "Sistema POS" },
    { id: "compras", name: "Compras", icon: ShoppingBag, color: "from-indigo-500 to-indigo-600", route: "/module-compras-detail", description: "Gestión de compras" },
    { id: "gastos", name: "Gastos", icon: Wallet, color: "from-red-500 to-red-600", route: "/module-config-detail", description: "Control de gastos" },
    { id: "empleados", name: "Empleados", icon: UserCheck, color: "from-teal-500 to-teal-600", route: "/module-config-detail", description: "Gestión de personal" },
    { id: "configuracion", name: "Configuración", icon: Settings, color: "from-gray-500 to-gray-600", route: "/module-config-detail", description: "Ajustes del sistema" },
    { id: "estados-financieros", name: "Estados Financieros", icon: FileBarChart, color: "from-emerald-500 to-emerald-600", route: "/module-config-detail", description: "Reportes financieros" },
    { id: "calendario", name: "Calendario", icon: Calendar, color: "from-amber-500 to-amber-600", route: "/module-config-detail", description: "Calendario fiscal" },
    { id: "pagos", name: "Pagos", icon: CreditCard, color: "from-violet-500 to-violet-600", route: "/module-config-detail", description: "Gestión de pagos" },
    { id: "proveedores", name: "Proveedores", icon: Truck, color: "from-lime-500 to-lime-600", route: "/module-config-detail", description: "Administración de proveedores" },
    { id: "cotizaciones", name: "Cotizaciones", icon: Receipt, color: "from-sky-500 to-sky-600", route: "/module-config-detail", description: "Gestión de cotizaciones" },
    { id: "activos", name: "Activos", icon: Building2, color: "from-rose-500 to-rose-600", route: "/module-config-detail", description: "Control de activos fijos" },
    { id: "proyectos", name: "Proyectos", icon: ClipboardList, color: "from-fuchsia-500 to-fuchsia-600", route: "/module-config-detail", description: "Gestión de proyectos" },
    { id: "indicadores", name: "Indicadores", icon: TrendingUp, color: "from-yellow-500 to-yellow-600", route: "/module-config-detail", description: "KPIs y métricas" },
    { id: "caja-bancos", name: "Caja y Bancos", icon: DollarSign, color: "from-green-600 to-green-700", route: "/module-config-detail", description: "Gestión de tesorería" },
    { id: "productos", name: "Productos", icon: Boxes, color: "from-orange-600 to-orange-700", route: "/module-config-detail", description: "Catálogo de productos" },
    { id: "libro-diario", name: "Libro Diario", icon: BookOpen, color: "from-blue-600 to-blue-700", route: "/module-config-detail", description: "Asientos contables" },
    { id: "auditoria", name: "Auditoría", icon: FileCheck, color: "from-purple-600 to-purple-700", route: "/module-config-detail", description: "Trazabilidad y auditoría" },
    { id: "presupuestos", name: "Presupuestos", icon: PieChart, color: "from-cyan-600 to-cyan-700", route: "/module-config-detail", description: "Control presupuestario" },
    { id: "almacenes", name: "Almacenes", icon: Layers, color: "from-indigo-600 to-indigo-700", route: "/module-config-detail", description: "Gestión de almacenes" },
  ];

  const handleModuleClick = (module: Module) => {
    // Módulos con vista propia
    if (module.name === "Compras")        { navigate("/module-compras-detail"); return; }
    if (module.name === "Ventas")         { navigate("/module-ventas-detail/invoices"); return; }
    if (module.name === "Punto de Venta") { navigate("/module-pos-detail/pos"); return; }
    if (module.name === "Inventario")     { navigate("/module-inventory-detail"); return; }
    if (module.name === "Contabilidad")   { navigate("/module-accounting-detail/journal"); return; }

    // Primer menuId de cada módulo — define el grupo que se abre por defecto
    // URL resultante: /module-config-detail/{menuId}
    const moduleFirstMenuMap: Record<string, string> = {
      "Configuración":        "general-settings",
      "Ventas":               "sales-dashboard",
      "Contabilidad":         "accounting-dashboard",
      "Facturas":             "invoicing",
      "Clientes":             "customers",
      "Reportes":             "reports",
      "Gastos":               "sales-config",
      "Empleados":            "users",
      "Estados Financieros":  "accounting-dashboard",
      "Calendario":           "calendar",
      "Pagos":                "payment-methods",
      "Proveedores":          "suppliers",
      "Cotizaciones":         "quotes",
      "Activos":              "general-settings",
      "Proyectos":            "general-settings",
      "Indicadores":          "report-templates",
      "Caja y Bancos":        "payment-methods",
      "Productos":            "products",
      "Libro Diario":         "journal",
      "Auditoría":            "access-log",
      "Presupuestos":         "accounting-dashboard",
      "Almacenes":            "warehouses",
    };

    const firstMenu = moduleFirstMenuMap[module.name] || "general-settings";
    navigate(
      `/module-config-detail/${firstMenu}`,
      { state: { moduleName: module.name, moduleColor: module.color, userPlan: "Plan Profesional" } }
    );
  };

  const getStatusInfo = () => {
    switch (userStatus) {
      case "online": return { label: "En línea", color: "bg-green-500" };
      case "away": return { label: "Ausente", color: "bg-yellow-500" };
      case "dnd": return { label: "No molestar", color: "bg-red-500" };
      case "offline": return { label: "Desconectado", color: "bg-gray-500" };
      default: return { label: "En línea", color: "bg-green-500" };
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    const file = e.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) { setUploadError("Formato no válido. Solo JPG, PNG o GIF"); return; }
    if (file.size > 2 * 1024 * 1024) { setUploadError("La imagen no debe superar los 2MB"); return; }
    const reader = new FileReader();
    reader.onload = (event) => { setProfilePhoto(event.target?.result as string); setUploadError(""); };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-gray-50" : "bg-secondary"}`}>
      {/* Header */}
      <header className={`${theme === "light" ? "bg-white border-gray-200" : "bg-secondary border-white/10"} border-b`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary/80 flex-shrink-0">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo empresa" className="w-full h-full object-contain p-1" />
                ) : (
                  <span className="text-white font-bold text-lg">T</span>
                )}
              </div>
              <div>
                <h1 className={`font-semibold text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                  {companyName || "TicSoftEc"}
                </h1>
                <p className="text-gray-400 text-xs">Sistema ERP Empresarial</p>
              </div>
            </div>

            {/* Iconos de navegación derecha */}
            <div className="flex items-center gap-4">
              {/* Notificaciones */}
              <button className={`relative p-2 transition-colors ${theme === "light" ? "text-gray-600 hover:text-primary" : "text-gray-400 hover:text-white"}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* Toggle Theme */}
              <button onClick={toggleTheme} className="p-2 text-gray-400 hover:text-primary transition-all duration-300" title={theme === "light" ? "Modo Oscuro" : "Modo Claro"}>
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {/* Usuario con menú desplegable */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`flex items-center gap-2 p-2 transition-colors ${theme === "light" ? "text-gray-600 hover:text-primary" : "text-gray-400 hover:text-white"}`}
                >
                  <div className="relative">
                    {profilePhoto ? (
                      <div className="w-8 h-8 rounded-lg overflow-hidden">
                        <img src={profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xs">JP</span>
                      </div>
                    )}
                    <span className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusInfo().color} border-2 ${theme === "light" ? "border-white" : "border-secondary"} rounded-full`}></span>
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>Juan Pérez</p>
                    <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>Administrador de Empresa</p>
                  </div>
                </button>

                {/* Menú desplegable del usuario */}
                {showUserMenu && (
                  <div className={`absolute right-0 mt-2 w-72 rounded-2xl shadow-2xl overflow-hidden z-50 border ${theme === "light" ? "bg-white border-gray-200 shadow-gray-200/80" : "bg-[#3a3f4f] border-white/10"}`}>
                    {/* Header con info del usuario */}
                    <div className={`px-4 py-4 border-b ${theme === "light" ? "border-gray-100" : "border-white/10"}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary to-primary/80 flex-shrink-0">
                          {logoUrl ? (
                            <img src={logoUrl} alt="Logo empresa" className="w-full h-full object-contain p-1" />
                          ) : (
                            <span className="text-white font-bold text-lg">T</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`font-semibold text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>{companyName || "TicSoftEc"}</p>
                          <p className={`text-xs ${theme === "light" ? "text-gray-500" : "text-gray-400"}`}>Sistema ERP Empresarial</p>
                        </div>
                      </div>
                    </div>
                    {/* Opciones del menú */}
                    <div className="py-2">
                      <button
                        onClick={() => { setShowUserMenu(false); setShowProfileModal(true); }}
                        className={`w-full flex items-center gap-3 px-5 py-3.5 transition-colors text-left ${theme === "light" ? "text-gray-600 hover:bg-gray-50 hover:text-primary" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                      >
                        <User className="w-4 h-4" />
                        <span className="text-sm">Mi Perfil</span>
                      </button>
                      {/* Solo administradores pueden ver Preferencias */}
                      {userProfile.role.toLowerCase().includes("administrador") && (
                        <button
                          onClick={() => { setShowUserMenu(false); setShowPreferencesModal(true); }}
                          className={`w-full flex items-center gap-3 px-5 py-3.5 transition-colors text-left ${theme === "light" ? "text-gray-600 hover:bg-gray-50 hover:text-primary" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                        >
                          <Settings className="w-4 h-4" />
                          <span className="text-sm">Mis preferencias</span>
                        </button>
                      )}
                      <div className={`border-t my-1 mx-4 ${theme === "light" ? "border-gray-100" : "border-white/10"}`}></div>
                      <button
                        onClick={() => navigate("/")}
                        className={`w-full flex items-center gap-3 px-5 py-3.5 transition-colors text-left ${theme === "light" ? "text-red-500 hover:bg-red-50 hover:text-red-600" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
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
        </div>
      </header>

      {/* Banner informativo */}
      <div className="bg-gradient-to-r from-primary/90 to-primary border-b border-primary/20"></div>

      {/* ── Modal de Preferencias (light mode) ─────────────────────────────── */}
      {showPreferencesModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">

            {/* Header del modal */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-gray-900 font-semibold text-base">Configuración de Perfil</h2>
                  <p className="text-gray-400 text-xs">Actualiza tu información personal</p>
                </div>
              </div>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido */}
            <div className="px-6 py-5 space-y-5 max-h-[70vh] overflow-y-auto">

              {/* Foto de perfil */}
              <div className="flex items-center gap-4">
                <div className="relative group flex-shrink-0">
                  {profilePhoto ? (
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-md">
                      <img src={profilePhoto} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/70 rounded-2xl flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-2xl">JP</span>
                    </div>
                  )}
                  <label className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="w-5 h-5 text-white" />
                    <input type="file" accept="image/jpeg,image/jpg,image/png,image/gif" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
                <div>
                  <p className="text-gray-700 text-sm font-medium mb-1">Foto de perfil</p>
                  <p className="text-gray-400 text-xs mb-2">Sube una foto para personalizar tu perfil</p>
                  <p className="text-gray-300 text-xs">JPG, PNG o GIF · Máx. 2MB</p>
                  {uploadError && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
                </div>
              </div>

              {/* Nombre completo */}
              <div>
                <label className="block text-sm text-gray-600 mb-1.5 font-medium">Nombre completo</label>
                <input
                  type="text"
                  value={prefForm.nombre}
                  onChange={(e) => setPrefForm({ ...prefForm, nombre: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                />
              </div>

              {/* Correo electrónico */}
              <div>
                <label className="block text-sm text-gray-600 mb-1.5 font-medium">Correo electrónico</label>
                <input
                  type="email"
                  value={prefForm.correo}
                  onChange={(e) => setPrefForm({ ...prefForm, correo: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                />
              </div>

              {/* Teléfono + Rol */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5 font-medium">Teléfono</label>
                  <input
                    type="tel"
                    value={prefForm.telefono}
                    onChange={(e) => setPrefForm({ ...prefForm, telefono: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1.5 font-medium">Rol</label>
                  <input
                    type="text"
                    value={prefForm.rol}
                    disabled
                    className="w-full bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-gray-500 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Sección cambiar contraseña */}
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-gray-800 text-sm font-semibold">Cambiar Contraseña</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5 font-medium">Contraseña actual</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={prefForm.passwordActual}
                        onChange={(e) => setPrefForm({ ...prefForm, passwordActual: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors pr-10"
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5 font-medium">Nueva contraseña</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={prefForm.nuevaPassword}
                        onChange={(e) => setPrefForm({ ...prefForm, nuevaPassword: e.target.value })}
                        placeholder="••••••••"
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-gray-900 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors pr-10"
                      />
                      <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer del modal */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowPreferencesModal(false);
                  toast.success("Perfil actualizado correctamente");
                }}
                className="px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Layers className="w-8 h-8 text-primary" />
            <h2 className={`text-3xl font-bold ${theme === "light" ? "text-gray-900" : "text-white"}`}>
              Módulos del Sistema
            </h2>
          </div>
          <p className="text-gray-400 text-sm">Accede a los módulos según tus permisos de usuario</p>
        </div>

        {/* Grid de módulos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <button
                key={module.id}
                onClick={() => handleModuleClick(module)}
                className={`group relative backdrop-blur-sm border p-3 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/20 rounded-[10px] ${
                  theme === "light"
                    ? "bg-white hover:bg-gray-50 border-gray-200 hover:border-primary/50"
                    : "bg-white/5 hover:bg-white/10 border-white/10 hover:border-primary/50"
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${module.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="text-center">
                    <h3 className={`text-xs font-medium group-hover:text-primary transition-colors leading-tight ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                      {module.name}
                    </h3>
                  </div>
                </div>
                {/* Tooltip en hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-xl bg-gray-900 text-white">
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
      <footer className={`border-t mt-12 ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-gray-500 text-xs">TicSoftEc ERP v2.0 © 2024 - Sistema de Gestión Empresarial</p>
        </div>
      </footer>

      {/* Modal de Configuración de Perfil */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
        onSave={(newProfile) => setUserProfile(newProfile)}
      />
    </div>
  );
}