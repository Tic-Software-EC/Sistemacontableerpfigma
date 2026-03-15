import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router";
import {
  Settings,
  Users,
  Bell,
  ChevronLeft,
  ChevronDown,
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

// Modales
import { ProfileModal } from "../components/profile-modal";
import { PreferencesModal } from "../components/preferences-modal";
import { useTheme } from "../contexts/theme-context";
import { useBrand } from "../contexts/brand-context";
import { SysTabBar, SysTab } from "../components/ui/sys-tab-bar";

// ─── Metadatos de sección ────────────────────────────────────────────────────
interface SectionMeta { title: string; description: string; icon: LucideIcon }
const SECTION_META: Record<string, SectionMeta> = {
  "company-info":      { title: "Información de Empresa",      description: "Configura los datos generales de tu empresa",                        icon: Building2    },
  "branches":          { title: "Sucursales", description: "Administra las sucursales, establecimientos y puntos de emisión de documentos electrónicos", icon: Building2    },
  "punto-emision":     { title: "Puntos de Emisión",            description: "Gestiona los puntos de emisión de documentos electrónicos",           icon: Printer      },
  "pos-config":        { title: "Cajas POS",                    description: "Gestiona las cajas registradoras",                                    icon: ShoppingCart },
  "regional-config":   { title: "Configuración Regional",       description: "Zona horaria, idioma, moneda y formato de fechas",                    icon: Globe        },
  "security":          { title: "Seguridad",                    description: "Gestiona las opciones de seguridad y acceso de tu cuenta",            icon: Shield       },
  "communications":    { title: "Comunicaciones",               description: "Configura correos, SMS y canales de comunicación del sistema",        icon: Mail         },
  "printer-config":    { title: "Impresoras",                   description: "Administra las impresoras y configuración de impresión",              icon: Printer      },
  "roles":             { title: "Roles y Permisos",             description: "Define los roles y niveles de acceso de los usuarios",                icon: UserCheck    },
  "user-list":         { title: "Lista de Usuarios",            description: "Administra los usuarios del sistema y sus datos",                     icon: Users        },
  "work-schedule":     { title: "Horario Laboral",              description: "Define los turnos y horarios de trabajo del personal",                icon: Calendar     },
  "holidays":          { title: "Días Festivos",                description: "Gestiona el calendario de días no laborables",                       icon: Calendar     },
  "warehouses":        { title: "Almacenes",                    description: "Configura los almacenes y bodegas de tu empresa",                     icon: Building2    },
  "categories":        { title: "Categorías",                   description: "Organiza los productos en categorías y subcategorías",               icon: Boxes        },
  "units":             { title: "Unidades de Medida",           description: "Define las unidades de medida utilizadas en el inventario",           icon: Calculator   },
  "access-log":        { title: "Registros de Acceso",          description: "Historial de accesos y actividad de los usuarios",                   icon: ClipboardList},
  "suppliers":         { title: "Proveedores",                  description: "Gestiona el catálogo de proveedores de tu empresa",                  icon: Truck        },
  "purchase-orders":   { title: "Órdenes de Compra",            description: "Administra y da seguimiento a las órdenes de compra",                icon: ShoppingCart },
  "sales-config":      { title: "Configuración de Ventas",      description: "Parámetros generales del módulo de ventas",                          icon: TrendingUp   },
  "payment-methods":   { title: "Métodos de Pago",              description: "Configura las formas de pago aceptadas por tu empresa",              icon: DollarSign   },
  "taxes":             { title: "Impuestos",                    description: "Define los impuestos y tarifas aplicables",                          icon: Receipt      },
  "discounts":         { title: "Descuentos",                   description: "Configura las reglas y tipos de descuentos disponibles",             icon: Receipt      },
  "purchase-config":   { title: "Configuración de Compras",     description: "Parámetros y reglas del módulo de compras",                          icon: ShoppingCart },
  "stock-config":      { title: "Configuración de Stock",       description: "Define los parámetros de control y alertas de inventario",           icon: Boxes        },
  "notifications":     { title: "Notificaciones",               description: "Gestiona cómo recibes las notificaciones del sistema",               icon: Bell         },
  "fiscal-year":       { title: "Ejercicio Fiscal",             description: "Gestiona los periodos contables y cierres fiscales",                 icon: Calendar     },
  "accounting-config": { title: "Configuración Contable",       description: "Parámetros generales del módulo de contabilidad",                   icon: Settings     },
  "report-templates":  { title: "Plantillas de Reportes",       description: "Administra y personaliza las plantillas de informes",                icon: FileText     },
  "custom-reports":    { title: "Reportes Personalizados",      description: "Crea y gestiona reportes adaptados a tus necesidades",               icon: ClipboardList},
  "report-schedule":   { title: "Programación de Reportes",     description: "Automatiza el envío periódico de reportes",                         icon: Calendar     },
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

const SECURITY_TABS: SysTab[] = [
  { id: "auth",     label: "Autenticación", icon: Shield },
  { id: "sessions", label: "Sesiones",      icon: Clock  },
  { id: "password", label: "Contraseñas",   icon: Shield },
];

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
import { PuntoEmisionContent } from "../components/punto-emision-content";
import { PaymentMethodsContent } from "../components/payment-methods-content";
import { WorkScheduleContent } from "../components/work-schedule-content";
import { TaxesContent } from "../components/taxes-content";
import { DiscountsContent } from "../components/discounts-content";
import { PurchasesConfigContent } from "../components/purchases-config-content";
import { PosConfigContent } from "../components/pos-config-content";

// Componente de Seguridad
function SecurityContent({ theme }: { theme: string }) {
  const [activeTab,        setActiveTab]        = useState("auth");
  const [twoFactorAuth,    setTwoFactorAuth]    = useState(false);
  const [sessionTimeout,   setSessionTimeout]   = useState("30");
  const [passwordExpiry,   setPasswordExpiry]   = useState("90");
  const [loginAttempts,    setLoginAttempts]    = useState("3");
  const [lockoutDuration,  setLockoutDuration]  = useState("15");
  const [minPassLength,    setMinPassLength]    = useState("8");
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers,   setRequireNumbers]   = useState(true);
  const [requireSymbols,   setRequireSymbols]   = useState(false);
  const [ipWhitelist,      setIpWhitelist]      = useState("");
  const [saved,            setSaved]            = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const isLight = theme === "light";
  const txt  = isLight ? "text-gray-900" : "text-white";
  const sub  = isLight ? "text-gray-500" : "text-gray-400";
  const lbl  = isLight ? "text-gray-600" : "text-gray-300";
  const D    = `border-t ${isLight ? "border-gray-200" : "border-white/10"}`;
  const card = `rounded-2xl p-6 border ${isLight ? "bg-white border-gray-200 shadow-sm" : "bg-white/5 border-white/10"}`;
  const sec  = `rounded-xl p-4 border mb-5 ${isLight ? "border-gray-100 bg-gray-50" : "border-white/8 bg-white/[0.03]"}`;
  const SH   = `text-xs font-semibold uppercase tracking-wide mb-3 ${isLight ? "text-gray-400" : "text-gray-500"}`;
  const IN   = `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all ${isLight ? "bg-white border-gray-300 text-gray-900" : "bg-[#0f1825] border-white/10 text-white"}`;

  const CheckRow = ({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc: string }) => (
    <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-colors ${isLight ? "bg-gray-50 hover:bg-gray-100" : "bg-[#0f1825]/50 hover:bg-[#0f1825]"}`}>
      <div className="flex-shrink-0">
        <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} className="sr-only" />
        <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${checked ? "bg-primary border-primary" : isLight ? "border-gray-300" : "border-white/20"}`}>
          {checked && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
      <div>
        <span className={`text-sm font-medium ${txt}`}>{label}</span>
        <p className={`text-xs mt-0.5 ${sub}`}>{desc}</p>
      </div>
    </label>
  );

  const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>{label}</label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6 w-full">

      <div className={D} />

      {/* BOTÓN GUARDAR */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/20 ${saved ? "bg-green-500" : "bg-primary hover:bg-primary/90"} text-white`}
        >
          {saved
            ? <><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> Guardado</>
            : "Guardar Cambios"
          }
        </button>
      </div>

      <SysTabBar tabs={SECURITY_TABS} active={activeTab} onChange={setActiveTab} />

      {/* ══ AUTENTICACIÓN ══ */}
      {activeTab === "auth" && (
        <div className={card}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Autenticación</h3>
          </div>
          <div className="space-y-3">
            <CheckRow
              checked={twoFactorAuth}
              onChange={setTwoFactorAuth}
              label="Autenticación de Dos Factores (2FA)"
              desc="Requiere un código adicional al iniciar sesión"
            />
          </div>
        </div>
      )}

      {/* ══ SESIONES ══ */}
      {activeTab === "sessions" && (
        <div className={card}>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Control de Sesiones</h3>
          </div>
          <div className={sec} style={{ marginBottom: 0 }}>
            <p className={SH}>Límites de sesión</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Tiempo de inactividad (minutos)">
                <input type="number" value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} className={IN} />
              </Field>
              <Field label="Intentos de login permitidos">
                <input type="number" value={loginAttempts} onChange={e => setLoginAttempts(e.target.value)} className={IN} />
              </Field>
              <Field label="Duración del bloqueo (minutos)">
                <input type="number" value={lockoutDuration} onChange={e => setLockoutDuration(e.target.value)} className={IN} />
              </Field>
            </div>
          </div>
        </div>
      )}

      {/* ══ CONTRASEÑAS ══ */}
      {activeTab === "password" && (
        <div className={card}>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Política de Contraseñas</h3>
          </div>
          <div className={sec}>
            <p className={SH}>Requisitos de longitud</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Longitud mínima">
                <input type="number" value={minPassLength} onChange={e => setMinPassLength(e.target.value)} className={IN} />
              </Field>
              <Field label="Expiración (días)">
                <input type="number" value={passwordExpiry} onChange={e => setPasswordExpiry(e.target.value)} className={IN} />
              </Field>
            </div>
          </div>
          <div className={sec} style={{ marginBottom: 0 }}>
            <p className={SH}>Requisitos de complejidad</p>
            <div className="space-y-2">
              <CheckRow checked={requireUppercase} onChange={setRequireUppercase} label="Requerir mayúsculas" desc="La contraseña debe incluir al menos una letra mayúscula" />
              <CheckRow checked={requireNumbers}   onChange={setRequireNumbers}   label="Requerir números"   desc="La contraseña debe incluir al menos un número" />
              <CheckRow checked={requireSymbols}   onChange={setRequireSymbols}   label="Requerir símbolos"  desc="La contraseña debe incluir caracteres especiales (!@#$%)" />
            </div>
          </div>
        </div>
      )}

      {/* ══ ACCESO POR IP ══ */}
      {activeTab === "ip" && (
        <div className={card}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 bg-primary/15 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <h3 className={`font-bold text-base ${txt}`}>Control de Acceso por IP</h3>
          </div>
          <div>
            <label className={`block mb-1.5 text-xs font-medium ${lbl}`}>IPs permitidas (una por línea — dejar vacío para permitir todas)</label>
            <textarea
              value={ipWhitelist}
              onChange={e => setIpWhitelist(e.target.value)}
              rows={5}
              placeholder={"192.168.1.0/24\n10.0.0.1"}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all resize-none ${isLight ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400" : "bg-[#0f1825] border-white/10 text-white placeholder:text-gray-600"}`}
            />
          </div>
        </div>
      )}

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
        { id: "company-info",  name: "Empresa",          icon: Building2     },
        { id: "branches",      name: "Sucursales", icon: Building2     },
        { id: "pos-config",    name: "Configurar POS",    icon: ShoppingCart  },
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
      id: "inventory",
      name: "Inventario",
      icon: Package,
      submenus: [
        { id: "warehouses", name: "Almacenes", icon: Building2 },
        { id: "categories", name: "Categorías", icon: Boxes },
        { id: "units", name: "Unidades de medida", icon: Calculator },
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

  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [userStatus, setUserStatus] = useState<"online" | "away" | "dnd" | "offline">("online");
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  // Obtener nombre de empresa desde localStorage
  const companyName = localStorage.getItem("companyName") || null;

  // Obtener menús disponibles según el plan
  const availableMenus = moduleMenus[moduleName]?.filter((menu: any) => {
    const planMenus = planAccess[resolvedUserPlan]?.menus[moduleName] || [];
    return planMenus.includes(menu.id);
  }) || [];

  const toggleMenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
    // Seleccionar directamente si es un menú sin submenús (leaf menu)
    setSelectedMenu(menuId);
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
        return { color: "bg-gray-400", label: "Desconectado" };
      default:
        return { color: "bg-green-500", label: "En línea" };
    }
  };

  return (
    <div className={`min-h-screen ${theme === "light" ? "bg-gray-50" : "bg-gradient-to-br from-secondary via-secondary to-[#1a1f2e]"}`}>
      {/* Header */}
      <header className={`border-b sticky top-0 z-40 ${theme === "light" ? "bg-white/95 border-gray-200" : "border-white/10 bg-secondary/50"} backdrop-blur-sm`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Botón volver */}
            <button
              onClick={() => navigate("/modules")}
              className={`p-2 rounded-lg transition-colors ${theme === "light" ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Toggle sidebar en móvil */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${theme === "light" ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <MenuIcon className="w-5 h-5" />
            </button>

            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
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
                <h1 className={`font-bold text-xl ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                  {companyName || "TicSoftEc"}
                </h1>
                <p className="text-gray-400 text-xs">{moduleName}</p>
              </div>
            </div>
          </div>

          {/* Derecha */}
          <div className="flex items-center gap-3">
            {/* Notificaciones */}
            <button className={`p-2 rounded-lg transition-colors relative ${theme === "light" ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* Toggle Theme */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${theme === "light" ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-primary hover:bg-white/5"}`}
              title={theme === "light" ? "Modo Oscuro" : "Modo Claro"}
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>

            {/* Usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${theme === "light" ? "hover:bg-gray-100" : "hover:bg-white/5"}`}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">JP</span>
                  </div>
                  {/* Indicador de estado online */}
                  <div className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full ${theme === "light" ? "border-white" : "border-secondary"}`}></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className={`text-sm font-medium ${theme === "light" ? "text-gray-900" : "text-white"}`}>{userProfile.name}</p>
                  <p className="text-gray-400 text-xs">{userProfile.role}</p>
                </div>
              </button>

              {/* Menú desplegable del usuario */}
              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-fit rounded-xl shadow-2xl overflow-hidden z-50 flex border ${theme === "light" ? "bg-white border-gray-200 shadow-xl" : "bg-[#3a3f4f] border-white/10"}`}>
                  {/* Panel izquierdo - Selector de estado */}
                  {showStatusMenu && (
                    <div className={`w-64 border-r py-2 ${theme === "light" ? "bg-gray-50 border-gray-200" : "bg-[#2f3442] border-white/10"}`}>
                      <button
                        onClick={() => setUserStatus("online")}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                          userStatus === "online"
                            ? theme === "light" ? "bg-primary/10 text-primary" : "bg-white/10 text-white"
                            : theme === "light" ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900" : "text-gray-300 hover:bg-white/5 hover:text-white"
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
                            ? theme === "light" ? "bg-primary/10 text-primary" : "bg-white/10 text-white"
                            : theme === "light" ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900" : "text-gray-300 hover:bg-white/5 hover:text-white"
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
                            ? theme === "light" ? "bg-primary/10 text-primary" : "bg-white/10 text-white"
                            : theme === "light" ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900" : "text-gray-300 hover:bg-white/5 hover:text-white"
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
                            ? theme === "light" ? "bg-primary/10 text-primary" : "bg-white/10 text-white"
                            : theme === "light" ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900" : "text-gray-300 hover:bg-white/5 hover:text-white"
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
                    <div className={`px-4 py-3 border-b ${theme === "light" ? "border-gray-100" : "border-white/10"}`}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          {getModuleIcon()}
                        </div>
                        <div className="flex-1">
                          <p className={`font-medium text-sm ${theme === "light" ? "text-gray-900" : "text-white"}`}>{companyName || "TicSoftEc"}</p>
                          <p className="text-gray-400 text-xs">{moduleName}</p>
                        </div>
                      </div>
                    </div>

                    {/* Opciones del menú */}
                    <div className="py-2">
                      <div className={`border-t my-2 ${theme === "light" ? "border-gray-100" : "border-white/10"}`}></div>

                      <button
                        onClick={() => { setShowUserMenu(false); setShowProfileModal(true); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${theme === "light" ? "text-gray-600 hover:bg-gray-50 hover:text-gray-900" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                      >
                        <Settings className="w-4 h-4" />
                        <span className="text-sm">Mi Perfil</span>
                      </button>

                      {/* Solo administradores pueden ver Preferencias */}
                      {userProfile.role.toLowerCase().includes("administrador") && (
                        <>
                          <button
                            onClick={() => { setShowUserMenu(false); setShowPreferencesModal(true); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${theme === "light" ? "text-gray-600 hover:bg-gray-50 hover:text-gray-900" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
                          >
                            <Settings className="w-4 h-4" />
                            <span className="text-sm">Mis preferencias</span>
                          </button>
                        </>
                      )}

                      <div className={`border-t my-2 ${theme === "light" ? "border-gray-100" : "border-white/10"}`}></div>

                      <button
                        onClick={() => navigate("/")}
                        className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left ${theme === "light" ? "text-gray-600 hover:bg-gray-50 hover:text-gray-900" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}
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
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-72 backdrop-blur-sm border-r transition-transform duration-300 overflow-y-auto ${
            theme === "light" ? "bg-white border-gray-200" : "bg-secondary/80 border-white/10"
          }`}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`font-bold text-lg ${theme === "light" ? "text-gray-900" : "text-white"}`}>Menús</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className={`lg:hidden p-2 rounded-lg transition-colors ${theme === "light" ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
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
                          ? theme === "light" 
                            ? "bg-primary/10 text-primary" 
                            : "bg-primary/10 text-white"
                          : theme === "light"
                            ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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
                      <div className={`ml-4 mt-1 space-y-1 border-l-2 pl-4 ${theme === "light" ? "border-gray-200" : "border-white/10"}`}>
                        {menu.submenus.map((submenu: any) => {
                          const SubIcon = submenu.icon;
                          return (
                            <button
                              key={submenu.id}
                              onClick={() => handleSubmenuClick(submenu)}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                                selectedMenu === submenu.id
                                  ? theme === "light"
                                    ? "bg-primary/20 text-primary font-medium"
                                    : "bg-primary/20 text-white font-medium"
                                  : theme === "light"
                                    ? "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
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
              {/* ── Encabezado universal de sección ── */}
              {SECTION_META[selectedMenu] && (
                <SectionHeader
                  meta={SECTION_META[selectedMenu]}
                  theme={theme}
                  badge={selectedMenu === "pos-config" ? resolvedUserPlan : undefined}
                />
              )}

              {selectedMenu === "company-info" ? (
                <CompanyInfoContent />
              ) : selectedMenu === "regional-config" ? (
                <RegionalConfigContent />
              ) : selectedMenu === "security" ? (
                <SecurityContent theme={theme} />
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
                <PosConfigContent userPlan={resolvedUserPlan} />
              ) : (
                <>
                  <h2 className={`font-bold text-2xl mb-6 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
                    {availableMenus
                      .flatMap((m: any) => m.submenus)
                      .find((s: any) => s?.id === selectedMenu)?.name || "Contenido"}
                  </h2>
                  <div className={`border rounded-xl p-8 ${theme === "light" ? "bg-white border-gray-200" : "bg-white/5 border-white/10"}`}>
                    <p className="text-gray-400">
                      Contenido del submenú: <span className={`font-semibold ${theme === "light" ? "text-gray-900" : "text-white"}`}>{selectedMenu}</span>
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
                <h3 className={`font-bold text-xl mb-2 ${theme === "light" ? "text-gray-900" : "text-white"}`}>
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
    </div>
  );
}