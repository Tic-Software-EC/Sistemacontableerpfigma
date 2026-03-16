import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Building2,
  Settings,
  Package,
  Menu,
  ChevronRight,
  Users,
  CreditCard,
  Shield,
  TrendingUp,
  Globe,
  Layers,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  FolderTree,
} from "lucide-react";
import { AdminHeader } from "../components/admin-header";
import { useTheme } from "../contexts/theme-context";

const modules = [
  {
    icon: Building2,
    title: "Gestión de Empresas",
    description:
      "Administra todas las empresas suscriptoras del sistema. Crea, edita, suspende o elimina cuentas corporativas, gestiona planes y accesos de administradores.",
    path: "/admin/companies",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    icon: Settings,
    title: "Configuración de Planes",
    description:
      "Define y personaliza los planes de suscripción disponibles: Free, Standard y Custom. Controla precios, límites de usuarios, sucursales y módulos incluidos.",
    path: "/admin/plan-configuration",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
  },
  {
    icon: FolderTree,
    title: "Gestión de Catálogos",
    description:
      "Administra los catálogos contables del sistema en estructura jerárquica. Define cuentas padres e hijos para Activos, Pasivos, Patrimonio, Ingresos y Gastos.",
    path: "/admin/catalogs-admin",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  {
    icon: Menu,
    title: "Gestión de Menús",
    description:
      "Configura la estructura de navegación del sistema. Controla qué opciones de menú están disponibles para cada rol y módulo dentro del ERP.",
    path: "/admin/menu-management",
    color: "text-green-400",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
  },
];

const features = [
  { icon: Users, label: "Multi-empresa", desc: "Gestión centralizada de múltiples organizaciones" },
  { icon: CreditCard, label: "Facturación", desc: "Control de suscripciones y pagos recurrentes" },
  { icon: Shield, label: "Seguridad", desc: "Roles y permisos por empresa y módulo" },
  { icon: TrendingUp, label: "Escalabilidad", desc: "Planes adaptables al crecimiento empresarial" },
  { icon: Globe, label: "Multi-sucursal", desc: "Soporte para operaciones en múltiples ubicaciones" },
  { icon: Layers, label: "Modular", desc: "Activa solo los módulos que cada empresa necesita" },
];

export default function AdminWelcomePage() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isLight = theme === "light";
  const [userProfile] = useState({
    name: "Super Admin",
    email: "admin@ticsoftec.com",
    phone: "+593 99 123 4567",
    role: "Administrador de Sistema",
    avatar: "",
  });

  const cardBase = isLight
    ? "bg-white border-gray-200"
    : "bg-card border-white/10";

  return (
    <div className={`min-h-screen ${
      isLight
        ? "bg-gradient-to-br from-gray-50 via-white to-gray-100"
        : "bg-gradient-to-br from-[#0D1B2A] via-[#1a2936] to-[#0D1B2A]"
    }`}>
      <AdminHeader userProfile={userProfile} />

      <div className="p-6 max-w-7xl mx-auto">

        {/* Hero de bienvenida */}
        <div className={`relative overflow-hidden rounded-2xl border mb-6 ${cardBase}`}>
          {/* Fondo decorativo */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-56 h-56 bg-blue-500/5 rounded-full blur-2xl" />
          </div>

          <div className="relative flex flex-col md:flex-row items-center gap-8 p-8">
            {/* Texto */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className={`text-xs font-medium uppercase tracking-widest ${
                    isLight ? "text-gray-500" : "text-gray-400"
                  }`}>Panel de Administración</p>
                  <h1 className={`font-bold text-2xl leading-tight ${
                    isLight ? "text-gray-900" : "text-white"
                  }`}>TicSoftEc · Super Admin</h1>
                </div>
              </div>

              <p className={`mb-6 leading-relaxed ${
                isLight ? "text-gray-600" : "text-gray-300"
              }`}>
                Bienvenido al módulo de administración central de <strong>TicSoftEc ERP</strong>.
                Desde aquí puedes gestionar todas las empresas suscriptoras, configurar planes y precios,
                administrar los módulos del sistema y controlar la estructura de navegación de toda la plataforma.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/admin/companies")}
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-primary/20"
                >
                  <Building2 className="w-4 h-4" />
                  Gestionar Empresas
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate("/admin/plan-configuration")}
                  className={`flex items-center gap-2 px-5 py-2.5 border rounded-lg text-sm font-medium transition-all ${
                    isLight
                      ? "border-gray-200 text-gray-700 hover:bg-gray-50"
                      : "border-white/10 text-gray-300 hover:bg-white/5"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Ver Planes
                </button>
              </div>
            </div>

            {/* Visual decorativo */}
            <div className="hidden md:flex flex-col items-center gap-3">
              <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-primary/20 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400"
                  alt="Dashboard Analytics"
                  className="w-full h-full object-cover opacity-80"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Sistema operativo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tarjetas de módulos */}
        <h2 className={`font-semibold mb-4 flex items-center gap-2 ${
          isLight ? "text-gray-700" : "text-gray-300"
        }`}>
          <Layers className="w-5 h-5" />
          Secciones del módulo
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.path}
                onClick={() => navigate(mod.path)}
                className={`group text-left border rounded-xl p-5 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 ${cardBase}`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl border ${mod.bg} ${mod.border} shrink-0`}>
                    <Icon className={`w-5 h-5 ${mod.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`font-semibold text-sm ${
                        isLight ? "text-gray-900" : "text-white"
                      }`}>{mod.title}</h3>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${
                        isLight ? "text-gray-300" : "text-gray-600"
                      }`} />
                    </div>
                    <p className={`text-xs leading-relaxed ${
                      isLight ? "text-gray-500" : "text-gray-400"
                    }`}>{mod.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Capacidades del sistema */}
        <div className={`border rounded-xl p-6 ${cardBase}`}>
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            <h2 className={`font-semibold ${
              isLight ? "text-gray-800" : "text-white"
            }`}>Capacidades del sistema</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.label} className={`flex items-start gap-3 p-3 rounded-lg ${
                  isLight ? "bg-gray-50" : "bg-white/[0.03]"
                }`}>
                  <div className="p-1.5 bg-primary/10 rounded-lg shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${
                      isLight ? "text-gray-800" : "text-white"
                    }`}>{f.label}</p>
                    <p className={`text-xs ${
                      isLight ? "text-gray-500" : "text-gray-400"
                    }`}>{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}