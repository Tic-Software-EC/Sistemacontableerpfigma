import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import {
  Settings,
  Users,
  User,
  Bell,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Menu,
  Menu as MenuIcon,
  X,
  LogOut,
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
  Sun,
  Moon,
  type LucideIcon,
} from "lucide-react";

import { toast } from "sonner";

// Modales
import { ProfileModal } from "../components/profile-modal";
import { PreferencesModal } from "../components/preferences-modal";
import { useTheme } from "../contexts/theme-context";
import { useBrand } from "../contexts/brand-context";

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
import { UserListContent } from "../components/user-list-content";
import { BranchListContent } from "../components/branch-list-content";
import { RolesPermissionsContent } from "../components/roles-permissions-content";
import { HolidaysContent } from "../components/holidays-content";
import { SalesConfigContent } from "../components/sales-config-content";
import { PuntoEmisionContent } from "../components/punto-emision-content";
import { PaymentMethodsContent } from "../components/payment-methods-content";
import { WorkScheduleContent } from "../components/work-schedule-content";
import { TaxesContent } from "../components/taxes-content";
import { DiscountsContent } from "../components/discounts-content";
import { PurchasesConfigContent } from "../components/purchases-config-content";
import { PosConfigContent } from "../components/pos-config-content";

// ─── Metadatos de sección ────────────────────────────────────────────────────
interface SectionMeta { title: string; description: string; icon: LucideIcon; Component: React.ComponentType }

// Componente de Notificaciones (placeholder simple)
function NotificationsContent() {
  const { theme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  
  const isLight = theme === "light";

  const handleSave = () => {
    console.log("Guardando configuración de notificaciones...");
    toast.success("Configuración de notificaciones guardada exitosamente");
  };

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div></div>
        <button
          onClick={handleSave}
          className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors font-medium"
        >
          Guardar Cambios
        </button>
      </div>

      {/* Separador */}
      <div className={`border-t ${isLight ? "border-gray-200" : "border-white/10"}`}></div>

      {/* Canales de Notificación */}
      <div className={`border rounded-2xl p-6 ${isLight ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-primary" />
          <h3 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>Canales de Notificación</h3>
        </div>

        <div className="space-y-4">
          <label className={`flex items-center gap-3 cursor-pointer group p-4 rounded-xl transition-colors ${isLight ? "bg-gray-50 hover:bg-gray-100" : "bg-[#0f1825]/50 hover:bg-[#0f1825]"}`}>
            <div className="relative">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-5 h-5 border-2 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center ${isLight ? "border-gray-300" : "border-white/20"}`}>
                {emailNotifications && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>Notificaciones por Email</span>
              <p className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>Recibe actualizaciones por correo electrónico</p>
            </div>
          </label>

          <label className={`flex items-center gap-3 cursor-pointer group p-4 rounded-xl transition-colors ${isLight ? "bg-gray-50 hover:bg-gray-100" : "bg-[#0f1825]/50 hover:bg-[#0f1825]"}`}>
            <div className="relative">
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-5 h-5 border-2 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center ${isLight ? "border-gray-300" : "border-white/20"}`}>
                {pushNotifications && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>Notificaciones Push</span>
              <p className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>Recibe notificaciones en tiempo real</p>
            </div>
          </label>

          <label className={`flex items-center gap-3 cursor-pointer group p-4 rounded-xl transition-colors ${isLight ? "bg-gray-50 hover:bg-gray-100" : "bg-[#0f1825]/50 hover:bg-[#0f1825]"}`}>
            <div className="relative">
              <input
                type="checkbox"
                checked={smsNotifications}
                onChange={(e) => setSmsNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className={`w-5 h-5 border-2 rounded peer-checked:bg-primary peer-checked:border-primary transition-colors flex items-center justify-center ${isLight ? "border-gray-300" : "border-white/20"}`}>
                {smsNotifications && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <span className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>Notificaciones por SMS</span>
              <p className={`text-xs mt-0.5 ${isLight ? "text-gray-500" : "text-gray-400"}`}>Recibe alertas importantes por mensaje de texto</p>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

const SECTION_META: Record<string, SectionMeta> = {
  "company-info":      { title: "Información de Empresa",      description: "Configura los datos generales de tu empresa",                        icon: Building2,    Component: CompanyInfoContent },
  "branches":          { title: "Sucursales", description: "Administra las sucursales, establecimientos y puntos de emisión de documentos electrónicos", icon: Building2,    Component: BranchListContent },
  "punto-emision":     { title: "Puntos de Emisión",            description: "Gestiona los puntos de emisión de documentos electrónicos",           icon: Printer,      Component: PuntoEmisionContent },
  "pos-config":        { title: "Cajas POS",                    description: "Gestiona las cajas registradoras",                                    icon: ShoppingCart, Component: PosConfigContent },
  "communications":    { title: "Comunicaciones",               description: "Configura correos, SMS y canales de comunicación del sistema",        icon: Mail,         Component: CommunicationsContent },
  "printer-config":    { title: "Impresoras",                   description: "Administra las impresoras y configuración de impresión",              icon: Printer,      Component: PrinterConfigContent },
  "roles":             { title: "Roles y Permisos",             description: "Define los roles y niveles de acceso de los usuarios",                icon: UserCheck,    Component: RolesPermissionsContent },
  "user-list":         { title: "Lista de Usuarios",            description: "Administra los usuarios del sistema y sus datos",                     icon: Users,        Component: UserListContent },
  "work-schedule":     { title: "Horario Laboral",              description: "Define los turnos y horarios de trabajo del personal",                icon: Calendar,     Component: WorkScheduleContent },
  "holidays":          { title: "Días Festivos",                description: "Gestiona el calendario de días no laborables",                       icon: Calendar,     Component: HolidaysContent },
  "warehouses":        { title: "Bodega/Almacén",                description: "Configura las bodegas y almacenes de tu empresa",                     icon: Building2,    Component: WarehousesContent },
  "categories":        { title: "Categorías",                   description: "Organiza los productos en categorías y subcategorías",               icon: Boxes,        Component: CategoriesContent },
  "units":             { title: "Unidades de Medida",           description: "Define las unidades de medida utilizadas en el inventario",           icon: Calculator,   Component: UnitsContent },
  "access-log":        { title: "Registros de Acceso",          description: "Historial de accesos y actividad de los usuarios",                   icon: ClipboardList, Component: AccessLogsContent },
  "suppliers":         { title: "Proveedores",                  description: "Gestiona el catálogo de proveedores de tu empresa",                  icon: Truck,        Component: SuppliersContent },
  "purchase-orders":   { title: "Órdenes de Compra",            description: "Administra y da seguimiento a las órdenes de compra",                icon: ShoppingCart, Component: PurchaseOrdersContent },
  "sales-config":      { title: "Configuración de Ventas",      description: "Parámetros generales del módulo de ventas",                          icon: TrendingUp,   Component: SalesConfigContent },
  "payment-methods":   { title: "Métodos de Pago",              description: "Configura las formas de pago aceptadas por tu empresa",              icon: DollarSign,   Component: PaymentMethodsContent },
  "taxes":             { title: "Impuestos",                    description: "Define los impuestos y tarifas aplicables",                          icon: Receipt,      Component: TaxesContent },
  "discounts":         { title: "Descuentos",                   description: "Configura las reglas y tipos de descuentos disponibles",             icon: Receipt,      Component: DiscountsContent },
  "purchase-config":   { title: "Configuración de Compras",     description: "Parámetros y reglas del módulo de compras",                          icon: ShoppingCart, Component: PurchasesConfigContent },
  "stock-config":      { title: "Configuración de Stock",       description: "Define los parámetros de control y alertas de inventario",           icon: Boxes,        Component: StockConfigContent },
  "notifications":     { title: "Notificaciones",               description: "Gestiona cómo recibes las notificaciones del sistema",               icon: Bell,         Component: NotificationsContent },
  "fiscal-year":       { title: "Ejercicio Fiscal",             description: "Gestiona los periodos contables y cierres fiscales",                 icon: Calendar,     Component: NotificationsContent },
  "accounting-config": { title: "Configuración Contable",       description: "Parámetros generales del módulo de contabilidad",                   icon: Settings,     Component: NotificationsContent },
  "report-templates":  { title: "Plantillas de Reportes",       description: "Administra y personaliza las plantillas de informes",                icon: FileText,     Component: NotificationsContent },
  "custom-reports":    { title: "Reportes Personalizados",      description: "Crea y gestiona reportes adaptados a tus necesidades",               icon: ClipboardList, Component: NotificationsContent },
  "report-schedule":   { title: "Programación de Reportes",     description: "Automatiza el envío periódico de reportes",                         icon: Calendar,     Component: NotificationsContent },
};

/** Encabezado estándar de sección — aparece en TODAS las opciones del módulo */
function SectionHeader({ meta, theme, badge }: { meta: SectionMeta; theme: string; badge?: string }) {
  const Icon = meta.icon;
  const isLight = theme === "light";
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <h2 className={`font-bold text-2xl ${isLight ? "text-gray-900" : "text-white"}`}>
          {meta.title}
        </h2>
      </div>
      <p className={`ml-12 text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>
        {meta.description}
        {badge && (
          <> · <span className="text-primary font-medium">{badge}</span></>
        )}
      </p>
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
        { id: "company-info",  name: "Empresa",          icon: Building2     },
        { id: "branches",      name: "Sucursales", icon: Building2     },
        { id: "pos-config",    name: "Configurar POS",    icon: ShoppingCart  },
        { id: "warehouses", name: "Bodega/Almacén", icon: Building2 },
        { id: "communications", name: "Comunicaciones", icon: Mail },
        { id: "printer-config", name: "Impresoras", icon: Printer },
      ]
    },
    {
      id: "users",
      name: "Usuarios",
      icon: Users,
      submenus: [
        { id: "roles", name: "Roles y permisos", icon: UserCheck },
        { id: "user-list", name: "Lista de usuarios", icon: Users },
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
      id: "accounting",
      name: "Contabilidad",
      icon: Wallet,
      submenus: [
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
    {
      id: "sales",
      name: "Ventas",
      icon: TrendingUp,
      submenus: [
        { id: "sales-config", name: "Config. de ventas", icon: Settings },
        { id: "payment-methods", name: "Métodos de pago", icon: DollarSign },
        { id: "taxes", name: "Impuestos", icon: Receipt },
        { id: "discounts", name: "Descuentos", icon: Receipt },
      ]
    },
    {
      id: "purchases",
      name: "Compras",
      icon: ShoppingCart,
      submenus: [
        { id: "purchase-config", name: "Config. de compras", icon: Settings },
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
      "Configuración": ["general-settings", "users"],
      "Ventas": ["sales-dashboard", "invoicing", "customers"],
      "Inventario": ["products", "stock"],
    }
  },
  "Plan Profesional": {
    modules: ["Configuración", "Ventas", "Inventario", "Compras"],
    menus: {
      "Configuración": ["general-settings", "users", "calendar"],
      "Ventas": ["sales-dashboard", "invoicing", "quotes", "customers"],
      "Inventario": ["products", "stock"],
      "Compras": ["purchase-orders", "suppliers"],
    }
  },
  "Plan Empresarial": {
    modules: ["Configuración", "Ventas", "Inventario", "Contabilidad", "Compras"],
    menus: {
      "Configuración": ["general-settings", "users", "calendar", "accounting", "reports"],
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
  const params = useParams<{ menuId?: string; sectionId?: string }>();
  const { theme, toggleTheme } = useTheme();
  const { logoUrl } = useBrand();

  // El módulo activo viene de location.state o localStorage (persiste en refresh)
  const { moduleName: stateModuleName, moduleColor, userPlan } = location.state || {};
  const moduleName: string = (() => {
    if (stateModuleName) {
      localStorage.setItem("activeModuleName", stateModuleName);
      return stateModuleName;
    }
    return localStorage.getItem("activeModuleName") || "Configuración";
  })();
  const resolvedModuleColor = moduleColor || "#E8692E";
  const resolvedUserPlan = userPlan || "Plan Profesional";

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [userStatus, setUserStatus] = useState<"online" | "away" | "dnd" | "offline">("online");

  // selectedMenu derivado 100% de la URL:
  // /module-config-detail/:menuId            → selectedMenu = menuId  (menú hoja)
  // /module-config-detail/:menuId/:sectionId → selectedMenu = sectionId (submenú)
  const selectedMenu = params.sectionId || params.menuId || null;

  // Base de navegación sin slug de módulo
  const buildBase = () => `/module-config-detail`;

  // Al seleccionar → navega a la URL correcta
  // Ej: /module-config-detail/general-settings/branches
  const setSelectedMenu = (id: string | null) => {
    if (!id) { navigate(buildBase(), { replace: true }); return; }
    let parentMenuId: string | null = null;
    Object.values(moduleMenus).flat().forEach((menu: any) => {
      if (menu.submenus?.some((s: any) => s.id === id)) parentMenuId = menu.id;
    });
    if (parentMenuId) {
      navigate(`${buildBase()}/${parentMenuId}/${id}`, { replace: true });
    } else {
      navigate(`${buildBase()}/${id}`, { replace: true });
    }
  };

  // expandedMenus: expande el grupo padre de la sección activa al cargar
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(() => {
    const expanded: Record<string, boolean> = {};
    if (params.menuId) expanded[params.menuId] = true;
    const activeId = params.sectionId || params.menuId;
    if (activeId) {
      Object.values(moduleMenus).flat().forEach((menu: any) => {
        if (menu.submenus?.some((s: any) => s.id === activeId)) expanded[menu.id] = true;
      });
    }
    return expanded;
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Sincronizar expandedMenus al navegar con botones atrás/adelante del browser
  useEffect(() => {
    setExpandedMenus(prev => {
      const next = { ...prev };
      if (params.menuId) next[params.menuId] = true;
      const activeId = params.sectionId || params.menuId;
      if (activeId) {
        Object.values(moduleMenus).flat().forEach((menu: any) => {
          if (menu.submenus?.some((s: any) => s.id === activeId)) next[menu.id] = true;
        });
      }
      return next;
    });
  }, [params.menuId, params.sectionId]);

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({ ...prev, [menuId]: !prev[menuId] }));
  };

  const handleLogout = () => {
    navigate("/");
  };

  // Filtro de menús según el plan del usuario
  const availableModules = planAccess[resolvedUserPlan]?.modules || [];
  const filteredMenus = availableModules.reduce((acc: any, modName: string) => {
    acc[modName] = moduleMenus[modName] || [];
    return acc;
  }, {});

  // Obtener nombre de empresa desde localStorage
  const companyName = localStorage.getItem("companyName") || null;

  // Obtener menús disponibles según el plan
  const availableMenus = moduleMenus[moduleName]?.filter((menu: any) => {
    const planMenus = planAccess[resolvedUserPlan]?.menus[moduleName] || [];
    return planMenus.includes(menu.id);
  }) || [];

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

  const getModuleIcon = () => {
    switch (moduleName) {
      case "Configuración":
        return <Settings className="w-5 h-5 text-white" />;
      case "Ventas":
        return <ShoppingCart className="w-5 h-5 text-white" />;
      case "Inventario":
        return <Package className="w-5 h-5 text-white" />;
      case "Contabilidad":
        return <Wallet className="w-5 h-5 text-white" />;
      case "Compras":
        return <ShoppingCart className="w-5 h-5 text-white" />;
      default:
        return <Settings className="w-5 h-5 text-white" />;
    }
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
        return { color: "bg-gray-500", label: "Desconectado" };
    }
  };

  const renderSectionContent = () => {
    if (!selectedMenu) return null;

    const sectionMeta = SECTION_META[selectedMenu];
    if (!sectionMeta) return <div className={`${theme === "light" ? "text-gray-600" : "text-gray-400"}`}>Sección no encontrada</div>;

    const { Component } = sectionMeta;
    return <Component />;
  };
  
  const isLight = theme === "light";

  return (
    <div className={`h-screen flex flex-col overflow-hidden ${isLight ? "bg-gray-50" : "bg-[#0D1B2A]"}`}>
      {/* Header */}
      <div className={`h-16 border-b flex-shrink-0 ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}>
        <div className="h-full px-4 flex items-center justify-between">
          {/* Izquierda: Logo + módulo + toggle sidebar móvil */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${isLight ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>

            <button
              onClick={() => navigate("/modules")}
              className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                {getModuleIcon()}
              </div>
              <div>
                <h1 className={`font-bold text-lg ${isLight ? "text-gray-900" : "text-white"}`}>
                  {companyName || "TicSoftEc"}
                </h1>
                <p className="text-gray-400 text-xs">{moduleName}</p>
              </div>
            </div>
          </div>

          {/* Derecha: Notificaciones + Theme + Usuario */}
          <div className="flex items-center gap-3">
            <button className={`p-2 rounded-lg transition-colors relative ${isLight ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"}`}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">JP</span>
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusInfo().color} border-2 ${isLight ? "border-white" : "border-[#0D1B2A]"} rounded-full`}></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{userProfile.name}</p>
                  <p className="text-gray-400 text-xs">{userProfile.role}</p>
                </div>
              </button>

              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-72 border rounded-xl shadow-2xl overflow-hidden z-50 ${isLight ? "bg-white border-gray-200" : "bg-[#1a2936] border-white/10"}`}>
                  <div className={`px-4 py-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        {getModuleIcon()}
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium text-sm ${isLight ? "text-gray-900" : "text-white"}`}>{userProfile.name}</p>
                        <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{userProfile.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowProfileModal(true);
                        setShowUserMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isLight ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm font-medium">Mi perfil</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowPreferencesModal(true);
                        setShowUserMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isLight ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm font-medium">Preferencias</span>
                    </button>

                    <div className={`my-2 border-t ${isLight ? "border-gray-200" : "border-white/10"}`}></div>

                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${isLight ? "text-red-600 hover:bg-red-50" : "text-red-400 hover:bg-red-500/10"}`}
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm font-medium">Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 fixed lg:relative z-30 w-64 h-full border-r transition-transform duration-300 overflow-y-auto ${isLight ? "bg-white border-gray-200" : "bg-[#0D1B2A] border-white/10"}`}
        >
          <div className="p-4 space-y-2">
            {availableMenus.map((menu: any) => {
              const Icon = menu.icon;
              const isExpanded = expandedMenus[menu.id];
              const hasSubmenus = menu.submenus && menu.submenus.length > 0;

              return (
                <div key={menu.id}>
                  <button
                    onClick={() => {
                      if (hasSubmenus) {
                        toggleMenu(menu.id);
                      } else {
                        setSelectedMenu(menu.id);
                      }
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      selectedMenu === menu.id
                        ? isLight ? "bg-primary/10 text-primary" : "bg-primary/20 text-white"
                        : isLight ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900" : "text-gray-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{menu.name}</span>
                    </div>
                    {hasSubmenus && (
                      isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                    )}
                  </button>

                  {/* Submenús */}
                  {hasSubmenus && isExpanded && (
                    <div className={`ml-4 mt-1 space-y-1 border-l-2 pl-2 ${isLight ? "border-gray-200" : "border-white/10"}`}>
                      {menu.submenus.map((submenu: any) => {
                        const SubIcon = submenu.icon;
                        return (
                          <button
                            key={submenu.id}
                            onClick={() => setSelectedMenu(submenu.id)}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedMenu === submenu.id
                                ? isLight ? "bg-primary/10 text-primary font-medium" : "bg-primary/20 text-white font-medium"
                                : isLight ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900" : "text-gray-400 hover:bg-white/5 hover:text-white"
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
        </aside>

        {/* Main Content */}
        <main className={`flex-1 overflow-y-auto ${isLight ? "bg-gray-50" : "bg-[#0D1B2A]"}`}>
          <div className="p-6">
            {selectedMenu && SECTION_META[selectedMenu] && (
              <SectionHeader meta={SECTION_META[selectedMenu]} theme={theme} />
            )}
            {renderSectionContent()}
          </div>
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
    </div>
  );
}