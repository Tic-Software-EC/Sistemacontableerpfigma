import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  Settings,
  Users,
  Bell,
  ChevronLeft,
  ChevronDown,
  Menu as MenuIcon,
  X,
  LogOut,
  CreditCard,
  Shield,
  ShoppingCart,
  Calendar,
  Package,
  Wallet,
  BarChart3,
  Building2,
  Globe,
  Mail,
  Printer,
  UserCheck,
  ClipboardList,
  TrendingUp,
  Receipt,
  FileText,
  Clock,
  Truck,
  Boxes,
  Calculator,
  DollarSign,
  AlertCircle,
  Database,
} from "lucide-react";

// Modales
import { ProfileModal } from "../components/profile-modal";
import { PreferencesModal } from "../components/preferences-modal";

// Componentes de contenido
import { WarehousesContent } from "../components/warehouses-content";
import { StockConfigContent } from "../components/stock-config-content";
import { CategoriesContent } from "../components/categories-content";
import { UnitsContent } from "../components/units-content";
import { AccessLogsContent } from "../components/access-logs-content";
import { SuppliersContent } from "../components/suppliers-content";
import { PurchaseOrdersContent } from "../components/purchase-orders-content";
import { PrinterConfigContent } from "../components/printer-config-content";
import { CommunicationsContent } from "../components/communications-content";
import { CompanyInfoContent } from "../components/company-info-content";
import { RegionalConfigContent } from "../components/regional-config-content";
import { UserListContent } from "../components/user-list-content";
import { BranchListContent } from "../components/branch-list-content";
import { RolesPermissionsContent } from "../components/roles-permissions-content";
import { HolidaysContent } from "../components/holidays-content";
import { SalesConfigContent } from "../components/sales-config-content";
import { PaymentMethodsContent } from "../components/payment-methods-content";
import { WorkScheduleContent } from "../components/work-schedule-content";
import { TaxesContent } from "../components/taxes-content";
import { DiscountsContent } from "../components/discounts-content";
import { PurchasesConfigContent } from "../components/purchases-config-content";
import { PosConfigContent } from "../components/pos-config-content";

// Componente de Seguridad
function SecurityContent() {
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [passwordExpiry, setPasswordExpiry] = useState("90");
  const [loginAttempts, setLoginAttempts] = useState("3");
  const [ipWhitelist, setIpWhitelist] = useState("");

  const handleSave = () => {
    console.log("Guardando configuración de seguridad...");
    alert("Configuración de seguridad guardada exitosamente");
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2">
            Configuración de Seguridad
          </h2>
          <p className="text-gray-400 text-sm">
            Gestiona las opciones de seguridad de tu cuenta
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium"
        >
          Guardar Cambios
        </button>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Autenticación */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="text-white font-bold text-xl">Autenticación</h3>
        </div>

        <div className="space-y-5">
          {/* Autenticación de dos factores */}
          <label className="flex items-center gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative">
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {twoFactorAuth && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className="text-white font-medium">Autenticación de Dos Factores</span>
              <p className="text-gray-400 text-xs mt-0.5">Seguridad adicional para tu cuenta</p>
            </div>
          </label>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Tiempo de sesión (minutos)
              </label>
              <input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(e.target.value)}
                className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Expiración de contraseña (días)
              </label>
              <input
                type="number"
                value={passwordExpiry}
                onChange={(e) => setPasswordExpiry(e.target.value)}
                className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm mb-2 font-medium">
                Intentos de login permitidos
              </label>
              <input
                type="number"
                value={loginAttempts}
                onChange={(e) => setLoginAttempts(e.target.value)}
                className="w-full px-3 py-2 bg-[#0f1825] border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>

            
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Notificaciones (placeholder simple)
function NotificationsContent() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  const handleSave = () => {
    console.log("Guardando configuración de notificaciones...");
    alert("Configuración de notificaciones guardada exitosamente");
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-3xl mb-2">
            Notificaciones
          </h2>
          <p className="text-gray-400 text-sm">
            Gestiona cómo recibes las notificaciones del sistema
          </p>
        </div>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium"
        >
          Guardar Cambios
        </button>
      </div>

      {/* Separador */}
      <div className="border-t border-white/10"></div>

      {/* Canales de Notificación */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className="text-white font-bold text-xl">Canales de Notificación</h3>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {emailNotifications && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className="text-white font-medium">Notificaciones por Email</span>
              <p className="text-gray-400 text-xs mt-0.5">Recibe actualizaciones por correo electrónico</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative">
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {pushNotifications && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className="text-white font-medium">Notificaciones Push</span>
              <p className="text-gray-400 text-xs mt-0.5">Recibe notificaciones en tiempo real</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group p-4 bg-[#0f1825]/50 rounded-xl hover:bg-[#0f1825] transition-colors">
            <div className="relative">
              <input
                type="checkbox"
                checked={smsNotifications}
                onChange={(e) => setSmsNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-5 h-5 border-2 border-white/20 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center">
                {smsNotifications && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className="text-white font-medium">Notificaciones por SMS</span>
              <p className="text-gray-400 text-xs mt-0.5">Recibe alertas importantes por mensaje de texto</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

// Estructura de menús por módulo
const moduleMenus: Record<string, any> = {
  "Configuración": [
    {
      id: "general-settings",
      name: "Ajustes generales",
      icon: Settings,
      submenus: [
        { id: "company-info", name: "Empresa", icon: Building2 },
        { id: "branches", name: "Sucursales", icon: Building2 },
        { id: "pos-config", name: "Configurar POS", icon: ShoppingCart },
        { id: "regional-config", name: "Config. Regional", icon: Globe },
        { id: "security", name: "Seguridad", icon: Shield },
        { id: "communications", name: "Comunicaciones", icon: Mail },
        { id: "printer-config", name: "Impresoras", icon: Printer },
      ]
    },
    {
      id: "users",
      name: "Usuarios",
      icon: Users,
      submenus: [
        { id: "user-list", name: "Lista de usuarios", icon: Users },
        { id: "roles", name: "Roles y permisos", icon: UserCheck },
      ]
    },
    {
      id: "sales",
      name: "Ventas",
      icon: ShoppingCart,
      submenus: [
        { id: "sales-config", name: "Configurar", icon: Settings },
        { id: "payment-methods", name: "Métodos de pago", icon: CreditCard },
        { id: "taxes", name: "Impuestos", icon: Calculator },
        { id: "discounts", name: "Descuentos", icon: DollarSign },
      ]
    },
    {
      id: "calendar",
      name: "Calendario",
      icon: Calendar,
      submenus: [
        { id: "work-schedule", name: "Horario laboral", icon: Calendar },
        { id: "holidays", name: "Días festivos", icon: Calendar },
      ]
    },
    {
      id: "purchases",
      name: "Compras",
      icon: ShoppingCart,
      submenus: [
        { id: "purchase-config", name: "Configurar", icon: Settings },
      ]
    },
    {
      id: "inventory",
      name: "Inventario",
      icon: Package,
      submenus: [
        { id: "warehouses", name: "Almacenes", icon: Building2 },
        { id: "stock-config", name: "Configuración de stock", icon: Boxes },
        { id: "categories", name: "Categorías", icon: Boxes },
        { id: "units", name: "Unidades de medida", icon: Calculator },
      ]
    },
    {
      id: "accounting",
      name: "Contabilidad",
      icon: Wallet,
      submenus: [
        { id: "chart-accounts", name: "Plan de cuentas", icon: FileText },
        { id: "fiscal-year", name: "Ejercicio fiscal", icon: Calendar },
        { id: "accounting-config", name: "Configuración contable", icon: Settings },
      ]
    },
    {
      id: "reports",
      name: "Reportes",
      icon: BarChart3,
      submenus: [
        { id: "report-templates", name: "Plantillas de reportes", icon: FileText },
        { id: "custom-reports", name: "Reportes personalizados", icon: ClipboardList },
        { id: "report-schedule", name: "Programación", icon: Calendar },
      ]
    },
  ],
  "Ventas": [
    {
      id: "sales-dashboard",
      name: "Panel de ventas",
      icon: TrendingUp,
      submenus: []
    },
    {
      id: "invoicing",
      name: "Facturación",
      icon: Receipt,
      submenus: [
        { id: "new-invoice", name: "Nueva factura", icon: FileText },
        { id: "invoice-list", name: "Lista de facturas", icon: ClipboardList },
        { id: "pending-invoices", name: "Facturas pendientes", icon: Clock },
      ]
    },
    {
      id: "quotes",
      name: "Cotizaciones",
      icon: FileText,
      submenus: [
        { id: "new-quote", name: "Nueva cotización", icon: FileText },
        { id: "quote-list", name: "Lista de cotizaciones", icon: ClipboardList },
      ]
    },
    {
      id: "customers",
      name: "Clientes",
      icon: Users,
      submenus: [
        { id: "customer-list", name: "Lista de clientes", icon: Users },
        { id: "customer-groups", name: "Grupos de clientes", icon: Users },
      ]
    },
  ],
  "Inventario": [
    {
      id: "products",
      name: "Productos",
      icon: Package,
      submenus: [
        { id: "product-list", name: "Lista de productos", icon: ClipboardList },
        { id: "new-product", name: "Nuevo producto", icon: Package },
        { id: "product-categories", name: "Categorías", icon: Boxes },
      ]
    },
    {
      id: "stock",
      name: "Stock",
      icon: Boxes,
      submenus: [
        { id: "stock-movements", name: "Movimientos de stock", icon: TrendingUp },
        { id: "stock-adjustment", name: "Ajuste de stock", icon: Settings },
        { id: "low-stock", name: "Productos con bajo stock", icon: AlertCircle },
      ]
    },
  ],
  "Contabilidad": [
    {
      id: "accounting-dashboard",
      name: "Panel contable",
      icon: BarChart3,
      submenus: []
    },
    {
      id: "journal",
      name: "Diario",
      icon: FileText,
      submenus: [
        { id: "journal-entries", name: "Asientos contables", icon: FileText },
        { id: "new-entry", name: "Nuevo asiento", icon: FileText },
      ]
    },
    {
      id: "ledger",
      name: "Mayor",
      icon: Database,
      submenus: [
        { id: "general-ledger", name: "Libro mayor", icon: FileText },
        { id: "account-balance", name: "Balance de cuentas", icon: BarChart3 },
      ]
    },
  ],
  "Compras": [
    {
      id: "purchase-orders",
      name: "Órdenes de compra",
      icon: ShoppingCart,
      submenus: []
    },
    {
      id: "suppliers",
      name: "Proveedores",
      icon: Truck,
      submenus: []
    },
  ],
};

// Planes y sus módulos/menús disponibles
const planAccess: Record<string, any> = {
  "Plan Básico": {
    modules: ["Configuración", "Ventas", "Inventario"],
    menus: {
      "Configuración": ["general-settings", "users", "sales"],
      "Ventas": ["sales-dashboard", "invoicing", "customers"],
      "Inventario": ["products", "stock"],
    }
  },
  "Plan Profesional": {
    modules: ["Configuración", "Ventas", "Inventario", "Compras"],
    menus: {
      "Configuración": ["general-settings", "users", "sales", "calendar", "purchases", "inventory"],
      "Ventas": ["sales-dashboard", "invoicing", "quotes", "customers"],
      "Inventario": ["products", "stock"],
      "Compras": ["purchase-orders", "suppliers"],
    }
  },
  "Plan Empresarial": {
    modules: ["Configuración", "Ventas", "Inventario", "Contabilidad", "Compras"],
    menus: {
      "Configuración": ["general-settings", "users", "sales", "calendar", "purchases", "inventory", "accounting", "reports"],
      "Ventas": ["sales-dashboard", "invoicing", "quotes", "customers"],
      "Inventario": ["products", "stock"],
      "Contabilidad": ["accounting-dashboard", "journal", "ledger"],
      "Compras": ["purchase-orders", "suppliers"],
    }
  },
};

export default function ModuleConfigDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { moduleName, moduleColor, userPlan } = location.state || {
    moduleName: "Configuración",
    moduleColor: "#E8692E",
    userPlan: "Plan Profesional"
  };

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [userStatus, setUserStatus] = useState<"online" | "away" | "dnd" | "offline">("online");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  // Obtener nombre de empresa desde localStorage
  const companyName = localStorage.getItem("companyName") || null;

  // Obtener menús disponibles según el plan
  const availableMenus = moduleMenus[moduleName]?.filter((menu: any) => {
    const planMenus = planAccess[userPlan]?.menus[moduleName] || [];
    return planMenus.includes(menu.id);
  }) || [];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
    
    // Si el menú es "suppliers" o "purchase-orders", seleccionarlo directamente
    if (menuId === "suppliers" || menuId === "purchase-orders") {
      setSelectedMenu(menuId);
    }
  };

  const handleSubmenuClick = (submenu: any) => {
    setSelectedMenu(submenu.id);
  };

  const [userProfile] = useState({
    name: "Juan Pérez",
    email: "juan.perez@ticsoftec.com",
    phone: "+593 99 123 4567",
    role: "Administrador de Empresa",
    avatar: "",
  });

  const handleSaveProfile = (profile: any) => {
    console.log("Perfil actualizado:", profile);
  };

  const getStatusInfo = () => {
    switch (userStatus) {
      case "online":
        return { color: "bg-green-500", label: "En línea" };
      case "away":
        return { color: "bg-yellow-500", label: "Ausente" };
      case "dnd":
        return { color: "bg-red-500", label: "No molestar" };
      case "offline":
        return { color: "bg-gray-400", label: "Desconectado" };
      default:
        return { color: "bg-green-500", label: "En línea" };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary to-[#1a1f2e]">
      {/* Header */}
      <header className="border-b border-white/10 bg-secondary/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Botón volver */}
            <button
              onClick={() => navigate("/modules")}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Toggle sidebar en móvil */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                {moduleName === "Configuración" ? (
                  <Settings className="w-6 h-6 text-white" />
                ) : moduleName === "Ventas" ? (
                  <ShoppingCart className="w-6 h-6 text-white" />
                ) : moduleName === "Inventario" ? (
                  <Package className="w-6 h-6 text-white" />
                ) : moduleName === "Contabilidad" ? (
                  <Wallet className="w-6 h-6 text-white" />
                ) : moduleName === "Compras" ? (
                  <ShoppingCart className="w-6 h-6 text-white" />
                ) : (
                  <span className="text-white font-bold text-lg">T</span>
                )}
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">
                  {companyName || "TicSoftEc"}
                </h1>
                <p className="text-gray-400 text-xs">{moduleName}</p>
              </div>
            </div>
          </div>

          {/* Derecha */}
          <div className="flex items-center gap-3">
            {/* Notificaciones */}
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* Usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">JP</span>
                  </div>
                  {/* Indicador de estado online */}
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-secondary rounded-full"></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-white text-sm font-medium">{userProfile.name}</p>
                  <p className="text-gray-400 text-xs">{userProfile.role}</p>
                </div>
              </button>

              {/* Menú desplegable del usuario */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-fit bg-[#3a3f4f] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 flex">
                  {/* Panel izquierdo - Selector de estado */}
                  {showStatusMenu && (
                    <div className="w-64 bg-[#2f3442] border-r border-white/10 py-2">
                      <button
                        onClick={() => setUserStatus("online")}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          userStatus === "online" 
                            ? "bg-white/10 text-white" 
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {userStatus === "online" && (
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {userStatus !== "online" && <div className="w-4"></div>}
                        <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                        <span className="text-sm font-medium">En línea</span>
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
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {userStatus !== "away" && <div className="w-4"></div>}
                        <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
                        <span className="text-sm font-medium">Ausente</span>
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
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {userStatus !== "dnd" && <div className="w-4 mt-0.5"></div>}
                        <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1.5"></span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">No molestar</p>
                          <p className="text-xs text-gray-400 mt-0.5">No recibirás notificaciones</p>
                        </div>
                      </button>

                      <button
                        onClick={() => setUserStatus("offline")}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          userStatus === "offline" 
                            ? "bg-white/10 text-white" 
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {userStatus === "offline" && (
                          <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                        {userStatus !== "offline" && <div className="w-4"></div>}
                        <span className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0"></span>
                        <span className="text-sm font-medium">Desconectado</span>
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
                              <span className="text-white font-bold text-sm">JP</span>
                            </div>
                          )}
                          <span className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusInfo().color} border-2 border-[#3a3f4f] rounded-full`}></span>
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{userProfile.name}</p>
                          <p className="text-gray-400 text-xs">{userProfile.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Opciones del menú */}
                    <div className="py-2">
                      <div className="border-t border-white/10 my-2"></div>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setShowPreferencesModal(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Mis preferencias</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          setShowSubscriptionModal(true);
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span className="text-sm">Mi suscripción</span>
                      </button>

                      <div className="border-t border-white/10 my-2"></div>

                      <button
                        onClick={() => navigate("/")}
                        className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm">Cerrar sesión</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-72 bg-secondary/80 backdrop-blur-sm border-r border-white/10 transition-transform duration-300 overflow-y-auto`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-bold text-lg">Menús</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lista de menús */}
            <div className="space-y-2">
              {availableMenus.map((menu: any) => {
                const Icon = menu.icon;
                const isExpanded = expandedMenus[menu.id];
                const hasSubmenus = menu.submenus && menu.submenus.length > 0;

                return (
                  <div key={menu.id}>
                    <button
                      onClick={() => hasSubmenus ? toggleMenu(menu.id) : setSelectedMenu(menu.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                        selectedMenu === menu.id || isExpanded
                          ? "bg-primary/10 text-white"
                          : "text-gray-300 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5" />
                        <span className="font-medium text-sm">{menu.name}</span>
                      </div>
                      {hasSubmenus && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </button>

                    {/* Submenús */}
                    {hasSubmenus && isExpanded && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-white/10 pl-4">
                        {menu.submenus.map((submenu: any) => {
                          const SubIcon = submenu.icon;
                          return (
                            <button
                              key={submenu.id}
                              onClick={() => handleSubmenuClick(submenu)}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                selectedMenu === submenu.id
                                  ? "bg-primary/20 text-white font-medium"
                                  : "text-gray-400 hover:bg-white/5 hover:text-white"
                              }`}
                            >
                              <SubIcon className="w-4 h-4" />
                              <span>{submenu.name}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto p-8">
          {selectedMenu ? (
            <div>
              {selectedMenu === "company-info" ? (
                <CompanyInfoContent />
              ) : selectedMenu === "regional-config" ? (
                <RegionalConfigContent />
              ) : selectedMenu === "security" ? (
                <SecurityContent />
              ) : selectedMenu === "notifications" ? (
                <NotificationsContent />
              ) : selectedMenu === "communications" ? (
                <CommunicationsContent />
              ) : selectedMenu === "printer-config" ? (
                <PrinterConfigContent />
              ) : selectedMenu === "user-list" ? (
                <UserListContent />
              ) : selectedMenu === "branches" ? (
                <BranchListContent />
              ) : selectedMenu === "roles" ? (
                <RolesPermissionsContent />
              ) : selectedMenu === "access-log" ? (
                <AccessLogsContent />
              ) : selectedMenu === "work-schedule" ? (
                <WorkScheduleContent />
              ) : selectedMenu === "holidays" ? (
                <HolidaysContent />
              ) : selectedMenu === "sales-config" ? (
                <SalesConfigContent />
              ) : selectedMenu === "payment-methods" ? (
                <PaymentMethodsContent />
              ) : selectedMenu === "taxes" ? (
                <TaxesContent />
              ) : selectedMenu === "discounts" ? (
                <DiscountsContent />
              ) : selectedMenu === "purchase-config" ? (
                <PurchasesConfigContent />
              ) : selectedMenu === "suppliers" ? (
                <SuppliersContent />
              ) : selectedMenu === "purchase-orders" ? (
                <PurchaseOrdersContent />
              ) : selectedMenu === "warehouses" ? (
                <WarehousesContent />
              ) : selectedMenu === "stock-config" ? (
                <StockConfigContent />
              ) : selectedMenu === "categories" ? (
                <CategoriesContent />
              ) : selectedMenu === "units" ? (
                <UnitsContent />
              ) : selectedMenu === "pos-config" ? (
                <PosConfigContent userPlan={userPlan} />
              ) : (
                <>
                  <h2 className="text-white font-bold text-2xl mb-6">
                    {availableMenus
                      .flatMap((m: any) => m.submenus)
                      .find((s: any) => s?.id === selectedMenu)?.name || "Contenido"}
                  </h2>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-8">
                    <p className="text-gray-400">
                      Contenido del submenú: <span className="text-white font-semibold">{selectedMenu}</span>
                    </p>
                    <p className="text-gray-500 text-sm mt-4">
                      Aquí se mostrará el contenido específico de esta sección.
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-white font-bold text-xl mb-2">
                  Selecciona un menú
                </h3>
                <p className="text-gray-400 text-sm">
                  Elige una opción del menú lateral para comenzar
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Overlay sidebar móvil */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
        />
      )}

      {/* Modales */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        userProfile={userProfile}
        onSave={handleSaveProfile}
      />

      <PreferencesModal
        isOpen={showPreferencesModal}
        onClose={() => setShowPreferencesModal(false)}
      />

      {showSubscriptionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-secondary border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-white font-bold text-xl">Mi Suscripción</h3>
              <button
                onClick={() => setShowSubscriptionModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Plan actual</p>
                <p className="text-white font-bold text-lg">{userPlan}</p>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Estado</p>
                <span className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium">
                  Activo
                </span>
              </div>
              <div className="p-4 bg-white/5 rounded-xl">
                <p className="text-gray-400 text-sm mb-1">Próxima renovación</p>
                <p className="text-white font-semibold">16 de Marzo, 2026</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}