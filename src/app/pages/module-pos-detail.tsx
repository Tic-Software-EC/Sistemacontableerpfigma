import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useBrand } from "../contexts/brand-context";
import {
  ShoppingCart,
  User,
  BarChart3,
  ChevronLeft,
  Bell,
  Settings,
  CreditCard,
  LogOut,
  Receipt,
  Clock,
  History,
  ShieldAlert,
  AlertTriangle,
  Calculator,
  Sun,
  Moon,
  Keyboard,
} from "lucide-react";
import { ProfileModal } from "../components/profile-modal";
import { PreferencesModal } from "../components/preferences-modal";
import { POS } from "./pos";
import { ArqueoCaja } from "./arqueo-caja";
import { toast } from "sonner";
import { useTheme } from "../contexts/theme-context";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { KeyboardShortcutsPanel } from "../components/keyboard-shortcuts-panel";

export default function ModulePosDetail() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  // Sincronizar activeTab con el parámetro "tab" de la URL
  const validPosTabs = ["pos", "arqueo", "sales-history", "reports"];
  const rawPosTab = searchParams.get("tab");
  const activeTab = validPosTabs.includes(rawPosTab ?? "") ? rawPosTab! : "pos";
  const setActiveTab = (tab: string) => {
    setSearchParams({ tab }, { replace: true });
  };
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [userStatus, setUserStatus] = useState<"online" | "away" | "dnd" | "offline">("online");

  // Obtener nombre de empresa desde localStorage
  const companyName = localStorage.getItem("companyName") || "Mi Empresa";
  const { logoUrl } = useBrand();

  // Obtener rol del usuario desde localStorage o estado global
  // Por ahora usamos un estado local, pero en producción vendría de la sesión
  const [userProfile, setUserProfile] = useState({
    name: "Juan Pérez",
    email: "juan.perez@empresa.com",
    phone: "+593 99 123 4567",
    role: localStorage.getItem("userRole") || "Cajero", // Obtener rol desde localStorage
    branch: "Sucursal Matriz - Quito",
  });

  const userRole = userProfile.role;
  const userBranch = "Sucursal Centro";

  // Validar acceso: solo usuarios con rol "Cajero" pueden acceder
  const hasAccess = userProfile.role === "Cajero";

  // Si no tiene acceso, mostrar pantalla de acceso denegado
  if (!hasAccess) {
    return (
      <div className={`min-h-screen ${isLight ? "bg-gray-50" : "bg-gradient-to-br from-secondary via-secondary to-[#1a1f2e]"} flex items-center justify-center p-6`}>
        <div className="max-w-2xl w-full">
          {/* Header con botón volver */}
          <div className="absolute top-6 left-6">
            <button
              onClick={() => navigate("/modules")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm ${isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Volver a Módulos</span>
            </button>
          </div>

          {/* Tarjeta de acceso denegado */}
          <div className={`border-2 border-red-600/30 rounded-2xl overflow-hidden shadow-2xl ${isLight ? "bg-white" : "bg-white/5"}`}>
            {/* Header */}
            <div className="bg-gradient-to-r from-red-600/20 to-red-600/10 border-b border-red-600/20 px-8 py-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-red-600 rounded-xl">
                  <ShieldAlert className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h1 className="text-white font-bold text-2xl">Acceso Denegado</h1>
                  <p className="text-gray-300 text-sm mt-1">No tienes permisos para acceder a este módulo</p>
                </div>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-8 space-y-6">
              {/* Información del usuario actual */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <p className="text-gray-400 text-sm mb-3">Usuario actual:</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">
                      {userProfile.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-bold">{userProfile.name}</p>
                    <p className="text-gray-400 text-sm">{userProfile.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-1 bg-gray-600/20 border border-gray-600/30 rounded text-gray-300 text-xs font-medium">
                        Rol: {userProfile.role}
                      </span>
                      <span className="text-gray-500 text-xs">•</span>
                      <span className="text-gray-400 text-xs">{userProfile.branch}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información sobre el requisito */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-5">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-yellow-400 font-bold text-lg mb-2">Rol Requerido</h3>
                    <p className="text-gray-300 text-sm mb-3">
                      El módulo de <strong className="text-white">Punto de Venta (POS)</strong> solo está disponible 
                      para usuarios con el rol de <strong className="text-primary">Cajero</strong>.
                    </p>
                    <p className="text-gray-400 text-sm">
                      Si necesitas acceso a este módulo, contacta con tu administrador de sistema para que te asigne el rol correspondiente.
                    </p>
                  </div>
                </div>
              </div>

              {/* Información adicional */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                  Acerca del módulo POS
                </h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Gestión completa de ventas en punto de venta</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Control de apertura y cierre de caja</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Emisión de facturas y comprobantes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Historial y reportes de ventas</span>
                  </li>
                </ul>
              </div>

              {/* Acciones */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => navigate("/modules")}
                  className="flex-1 px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Volver a Módulos
                </button>
                <button
                  onClick={() => {
                    // Aquí se podría abrir un modal de contacto con el admin
                    toast.info("Funcionalidad para contactar al administrador (por implementar)");
                  }}
                  className="flex-1 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <User className="w-5 h-5" />
                  Contactar Administrador
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              {companyName} • Sistema ERP TicSoftEc
            </p>
          </div>
        </div>
      </div>
    );
  }

  const handleProfileUpdate = (profile: any) => {
    setUserProfile(profile);
    setShowProfileModal(false);
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

  const tabs = [
    { id: "pos", label: "Punto de Venta", icon: ShoppingCart },
    { id: "arqueo", label: "Arqueo de Caja", icon: Calculator },
  ];

  // ── Atajos de teclado POS ──────────────────────────────────────────────────
  const posShortcuts = [
    { key: "F1", label: "F1", description: "Punto de Venta",  action: () => setActiveTab("pos") },
    { key: "F2", label: "F2", description: "Arqueo de Caja",  action: () => setActiveTab("arqueo") },
    { key: "F3", label: "F3", description: "Catálogo de Productos", action: () => {} }, // manejado en POS
    { key: "F12", label: "F12", description: "Mostrar atajos", action: () => setShowKeyboardHelp((v) => !v) },
    { key: "?",  label: "?",  description: "Mostrar atajos",  action: () => setShowKeyboardHelp((v) => !v) },
  ];

  useKeyboardShortcuts(posShortcuts);
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className={`min-h-screen ${isLight ? "bg-gray-50" : "bg-gradient-to-br from-secondary via-secondary to-[#1a1f2e]"}`}>
      {/* Header */}
      <header className={`border-b sticky top-0 z-40 backdrop-blur-sm ${isLight ? "border-gray-200 bg-white/90" : "border-white/10 bg-secondary/50"}`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            {/* Botón volver */}
            <button
              onClick={() => navigate("/modules")}
              className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Logo y título */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className={`font-bold text-xl ${isLight ? "text-gray-900" : "text-white"}`}>{companyName}</h1>
                <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>Punto de Venta</p>
              </div>
            </div>
          </div>

          {/* Derecha */}
          <div className="flex items-center gap-3">
            {/* Atajos de teclado */}
            <button
              onClick={() => setShowKeyboardHelp(true)}
              className={`p-2 rounded-lg transition-colors ${isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-primary hover:bg-white/5"}`}
              title="Atajos de teclado (F12)"
            >
              <Keyboard className="w-5 h-5" />
            </button>

            {/* Notificaciones */}
            <button className={`p-2 rounded-lg transition-colors relative ${isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-white hover:bg-white/5"}`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            </button>

            {/* Toggle Tema Sol/Luna */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all duration-300 ${isLight ? "text-gray-600 hover:text-primary hover:bg-gray-100" : "text-gray-400 hover:text-primary hover:bg-white/5"}`}
              title={isLight ? "Cambiar a modo oscuro" : "Cambiar a modo claro"}
            >
              {isLight ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Usuario */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"}`}
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">JP</span>
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusInfo().color} border-2 rounded-full ${isLight ? "border-white" : "border-secondary"}`}></div>
                </div>
                <div className="hidden md:block text-left">
                  <p className={`text-sm font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{userProfile.name}</p>
                  <p className={`text-xs ${isLight ? "text-gray-500" : "text-gray-400"}`}>{userRole} • {userBranch}</p>
                </div>
              </button>

              {/* Menú desplegable del usuario */}
              {showUserMenu && (
                <div className={`absolute right-0 mt-2 w-72 border rounded-xl shadow-2xl overflow-hidden z-50 ${isLight ? "bg-white border-gray-200" : "bg-[#1a1f2e] border-white/10"}`}>
                  <div className={`px-4 py-3 border-b ${isLight ? "border-gray-200" : "border-white/10"}`}>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold">JP</span>
                        </div>
                        <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${getStatusInfo().color} border-2 rounded-full ${isLight ? "border-white" : "border-[#1a1f2e]"}`}></div>
                      </div>
                      <div>
                        <p className={`font-medium ${isLight ? "text-gray-900" : "text-white"}`}>{userProfile.name}</p>
                        <p className={`text-sm ${isLight ? "text-gray-500" : "text-gray-400"}`}>{userProfile.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2">
                    <button onClick={() => { setShowUserMenu(false); setShowProfileModal(true); }} className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left text-sm ${isLight ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}>
                      <User className="w-4 h-4" /><span>Mi Perfil</span>
                    </button>
                    <button onClick={() => { setShowUserMenu(false); setShowPreferencesModal(true); }} className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left text-sm ${isLight ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}>
                      <Settings className="w-4 h-4" /><span>Mis preferencias</span>
                    </button>
                    <button className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-left text-sm ${isLight ? "text-gray-700 hover:bg-gray-100 hover:text-gray-900" : "text-gray-300 hover:bg-white/5 hover:text-white"}`}>
                      <CreditCard className="w-4 h-4" /><span>Mi suscripción</span>
                    </button>
                    <div className={`border-t my-2 ${isLight ? "border-gray-200" : "border-white/10"}`}></div>
                    <button onClick={() => navigate("/")} className={`w-full flex items-center gap-3 px-4 py-3 text-red-500 transition-colors text-left text-sm ${isLight ? "hover:bg-gray-100" : "hover:bg-white/5"} hover:text-red-400`}>
                      <LogOut className="w-4 h-4" /><span>Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className={`border-t ${isLight ? "border-gray-200" : "border-white/10"}`}>
          <div className="px-6 flex gap-0">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
                    isActive
                      ? `border-primary ${isLight ? "text-primary bg-primary/5" : "text-white bg-primary/5"}`
                      : `border-transparent ${isLight ? "text-gray-400 hover:text-gray-700 hover:bg-gray-100" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"}`
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-primary" : ""}`} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Contenido */}
      <div className="h-[calc(100vh-145px)]">
        {activeTab === "pos" && <POS />}
        {activeTab === "arqueo" && <ArqueoCaja />}
      </div>

      {/* Modales */}
      {showProfileModal && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          profile={userProfile}
          onSave={handleProfileUpdate}
        />
      )}

      {showPreferencesModal && (
        <PreferencesModal
          isOpen={showPreferencesModal}
          onClose={() => setShowPreferencesModal(false)}
        />
      )}

      {/* Panel de atajos de teclado */}
      <KeyboardShortcutsPanel
        open={showKeyboardHelp}
        onClose={() => setShowKeyboardHelp(false)}
        shortcuts={posShortcuts.filter((s) => s.key !== "?")}
        title="Atajos — Punto de Venta"
      />
    </div>
  );
}